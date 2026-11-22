const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { stageApplication } = require('./stage-application');
const { checkProductAssets } = require('./check-product-assets');
const { publishManifest } = require('../src/main/sync-manifest');

async function main() {
  const root = path.resolve(__dirname, '..');
  const args = process.argv.slice(2);
  if (args.some((arg, i) => i % 2 === 0 && !['--company-content', '--data-root', '--output'].includes(arg)) || args.length % 2) {
    throw new Error('Usage: npm run package -- [--company-content DIRECTORY] [--data-root DIRECTORY] [--output NEW_DIRECTORY]');
  }
  const options = Object.fromEntries(Array.from({ length: args.length / 2 }, (_, i) => [args[2 * i], args[2 * i + 1]]));
  const company = options['--company-content'] && path.resolve(options['--company-content']);
  if (!company && options['--data-root']) throw new Error('Data input requires --company-content');
  const dataRoot = options['--data-root'] ? path.resolve(options['--data-root']) : company;
  const version = require('../package.json').version;
  const edition = company ? 'company' : 'public';
  const output = path.resolve(options['--output'] || path.join(root, 'dist', `guolong-sales-v${version}-${edition}-windows-x64`));
  if (fs.existsSync(output)) throw new Error(`Output already exists: ${output}`);
  if (company) await checkProductAssets(path.join(dataRoot, 'data/seed-sales.sqlite'), path.join(dataRoot, 'images'), path.join(dataRoot, 'materials'));
  const runtime = path.join(path.dirname(require.resolve('electron/package.json')), 'dist');
  fs.cpSync(runtime, output, { recursive: true, filter: file => !['debug.log', 'default_app.asar'].includes(path.basename(file)) });
  fs.renameSync(path.join(output, 'electron.exe'), path.join(output, company ? '国龙食品机械销售工具.exe' : 'GuolongSalesTool.exe'));
  const app = path.join(output, 'resources', 'app');
  stageApplication(root, output, company, dataRoot);
  if (company) {
    const seed = path.join(output, 'resources/data/seed-sales.sqlite');
    await checkProductAssets(seed, path.join(output, 'images'), path.join(output, 'resources/materials'));
    if (!fs.readFileSync(seed).equals(fs.readFileSync(path.join(output, 'sales.sqlite')))) throw new Error('Staged sales.sqlite differs from seed database');
  }
  const icon = path.join(app, 'build', 'icon.ico');
  if (fs.existsSync(icon)) {
    execFileSync('powershell.exe', ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File',
      path.join(root, 'scripts', 'set-windows-icon.ps1'), '-Executable',
      path.join(output, company ? '国龙食品机械销售工具.exe' : 'GuolongSalesTool.exe'), '-Icon', icon],
    { stdio: 'inherit', windowsHide: true });
  }
  execFileSync(process.env.ComSpec || 'C:/Windows/System32/cmd.exe',
    ['/d', '/c', 'npm.cmd', 'ci', '--omit=dev', '--ignore-scripts', '--no-audit', '--no-fund'],
    { cwd: app, stdio: 'inherit', windowsHide: true });
  if (!company) execFileSync(process.execPath, ['scripts/test-open-source.js'], { cwd: app, stdio: 'inherit', windowsHide: true });
  for (const file of ['LICENSE', 'README.md']) fs.copyFileSync(path.join(root, file), path.join(output, file));
  await publishManifest(output);
  console.log(`${edition} portable build: ${output}`);
}

main().catch(error => { console.error(error.message); process.exitCode = 1; });
