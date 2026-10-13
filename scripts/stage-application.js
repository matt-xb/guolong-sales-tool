const fs = require('fs');
const path = require('path');

function copy(source, target) {
  fs.cpSync(source, target, { recursive: true, filter: file => {
    if (fs.lstatSync(file).isSymbolicLink()) throw new Error('Package inputs must not contain symbolic links');
    return true;
  } });
}

function stageApplication(root, output, company, dataRoot = company) {
  if (!company && dataRoot) throw new Error("Data input requires a company build");
  if (company) {
    const a = path.resolve(root).toLowerCase();
    const b = path.resolve(company).toLowerCase();
    if (a === b || b.startsWith(a + path.sep) || a.startsWith(b + path.sep) && path.basename(root) !== 'source') {
      throw new Error('Company content must be separate from the public source');
    }
    for (const name of ['edition.json', 'templates/contract-template.xlsx', 'templates/contract-template-normal.xlsx', 'templates/quote-template.xlsx', 'templates/quote-template （English）.xlsx']) {
      if (!fs.statSync(path.join(company, name)).isFile()) throw new Error(`Missing company input: ${name}`);
    }
  }
  if (company && !fs.statSync(path.join(dataRoot, 'data/seed-sales.sqlite')).isFile()) throw new Error('Missing seed database');
  const app = path.join(output, 'resources', 'app');
  fs.mkdirSync(app, { recursive: true });
  for (const name of ['main.js', 'preload.js', 'package.json', 'package-lock.json', 'LICENSE', 'src', 'scripts', 'templates']) copy(path.join(root, name), path.join(app, name));
  if (!company) return;
  const edition = JSON.parse(fs.readFileSync(path.join(company, 'edition.json'), 'utf8'));
  const allowed = ['updateSource', 'shareUser', 'videoScript'];
  if (Object.keys(edition).some(key => !allowed.includes(key)) || Object.values(edition).some(value => typeof value !== 'string')) {
    throw new Error('Unsupported company setting; credentials must use environment variables');
  }
  const pkg = JSON.parse(fs.readFileSync(path.join(app, 'package.json'), 'utf8'));
  pkg.name = 'card-sales-system';
  pkg.salesEdition = { company: true, ...edition };
  fs.writeFileSync(path.join(app, 'package.json'), JSON.stringify(pkg, null, 2) + '\n');
  const lock = JSON.parse(fs.readFileSync(path.join(app, 'package-lock.json'), 'utf8'));
  lock.name = pkg.name;
  lock.packages[''].name = pkg.name;
  fs.writeFileSync(path.join(app, 'package-lock.json'), JSON.stringify(lock, null, 2) + '\n');
  for (const name of ['contract-template.xlsx', 'contract-template-normal.xlsx', 'quote-template.xlsx', 'quote-template （English）.xlsx']) copy(path.join(company, 'templates', name), path.join(app, 'templates', name));
  copy(path.join(dataRoot, 'data/seed-sales.sqlite'), path.join(output, 'resources/data/seed-sales.sqlite'));
  copy(path.join(dataRoot, 'data/seed-sales.sqlite'), path.join(output, 'sales.sqlite'));
  const icon = path.join(company, 'branding/icon.ico');
  if (fs.existsSync(icon)) copy(icon, path.join(app, 'build/icon.ico'));
  fs.writeFileSync(path.join(output, 'release-version.json'), JSON.stringify({ version: pkg.version }) + '\n');
  for (const [source, target] of [['images', 'images'], ['materials', 'resources/materials'], ['branding', 'resources/app/src/renderer/assets'], ['tools', 'resources/tools'], ['release-notes.json', 'resources/app/release-notes.json']]) {
    const input = ['images', 'materials'].includes(source) ? dataRoot : company;
    if (fs.existsSync(path.join(input, source))) copy(path.join(input, source), path.join(output, target));
  }
}
module.exports = { stageApplication };
