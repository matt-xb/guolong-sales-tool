const assert = require('node:assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { stageApplication } = require('./stage-application');
const root = path.resolve(__dirname, '..');
const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'sales-editions-'));
try {
  const company = path.join(temp, 'private');
  fs.mkdirSync(path.join(company, 'data'), { recursive: true });
  fs.writeFileSync(path.join(company, 'edition.json'), JSON.stringify({ updateSource: 'PRIVATE_SOURCE', shareUser: 'PRIVATE_USER' }));
  fs.writeFileSync(path.join(company, 'data/seed-sales.sqlite'), 'PRIVATE_SEED');
  fs.cpSync(path.join(root, 'templates'), path.join(company, 'templates'), { recursive: true });
  for (const folder of ['images', 'materials', 'outputs', 'local-data', 'backups']) {
    fs.mkdirSync(path.join(company, folder)); fs.writeFileSync(path.join(company, folder, 'marker.txt'), `PRIVATE_${folder}`);
  }
  const publicOutput = path.join(temp, 'public');
  const internalOutput = path.join(temp, 'company');
  stageApplication(root, publicOutput);
  stageApplication(root, internalOutput, company);
  const pub = path.join(publicOutput, 'resources/app');
  const internal = path.join(internalOutput, 'resources/app');
  assert.equal(require(path.join(pub, 'package.json')).salesEdition, undefined);
  assert.equal(require(path.join(internal, 'package.json')).name, 'card-sales-system');
  assert.equal(require(path.join(internal, 'package.json')).salesEdition.updateSource, 'PRIVATE_SOURCE');
  assert.equal(fs.readFileSync(path.join(internalOutput, 'resources/data/seed-sales.sqlite'), 'utf8'), 'PRIVATE_SEED');
  assert.equal(fs.readFileSync(path.join(internalOutput, 'sales.sqlite'), 'utf8'), 'PRIVATE_SEED');
  assert(!fs.existsSync(path.join(publicOutput, 'sales.sqlite')));
  for (const name of ['images', 'materials', 'data']) assert(!fs.existsSync(path.join(publicOutput, name)) && !fs.existsSync(path.join(publicOutput, 'resources', name)));
  for (const name of ['outputs', 'local-data', 'backups']) assert(!fs.existsSync(path.join(internalOutput, name)));
  for (const name of ['main.js', 'preload.js', 'src/main/contractExporter.js', 'src/main/database.js']) assert.deepEqual(fs.readFileSync(path.join(pub, name)), fs.readFileSync(path.join(internal, name)));
  fs.writeFileSync(path.join(company, 'edition.json'), JSON.stringify({ password: 'DO_NOT_PACKAGE' }));
  assert.throws(() => stageApplication(root, path.join(temp, 'invalid'), company), /credentials/);
  assert.throws(() => stageApplication(root, path.join(temp, 'nested'), root), /separate/);
  console.log('Public empty inputs, company allowlist, identical program source and credential rejection passed.');
} finally { fs.rmSync(temp, { recursive: true, force: true }); }
