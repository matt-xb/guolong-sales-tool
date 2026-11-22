const assert = require('node:assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');
const vm = require('vm');
const { createHash } = require('crypto');
const initSqlJs = require('sql.js');
const { stageApplication } = require('./stage-application');
const { checkProductAssets } = require('./check-product-assets');
const { MATERIAL_DEFINITIONS } = require('../src/main/material-files');
const root = path.resolve(__dirname, '..');
const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'sales-editions-'));
const materialPaths = Object.fromEntries(Object.keys(MATERIAL_DEFINITIONS).map(key => [key, 'materials/docs/' + key + '.pdf']));
const valid = { image: 'images/main.png', documents: JSON.stringify({ photos: ['images/gallery/side.png', '', null], ...materialPaths, description: 'Synthetic, not a file' }) };

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
}

function snapshot(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name)).flatMap(entry => {
    const file = path.join(directory, entry.name);
    return entry.isDirectory() ? snapshot(file).map(value => entry.name + '/' + value) :
      [entry.name + ':' + createHash('sha256').update(fs.readFileSync(file)).digest('hex')];
  });
}

async function main() {
  const SQL = await initSqlJs();
  function seed(file, rows = [valid], schema = 'CREATE TABLE items (id INTEGER PRIMARY KEY, name TEXT, price REAL, stock INTEGER, image_path TEXT, documents TEXT)') {
    const db = new SQL.Database();
    try {
      db.run(schema);
      rows.forEach((row, index) => db.run('INSERT INTO items VALUES (?, ?, ?, ?, ?, ?)', [index + 1, 'Synthetic product', 1234.56, 9, row.image, row.documents]));
      const bytes = Buffer.from(db.export());
      write(file, bytes);
      return bytes;
    } finally { db.close(); }
  }
  function assets(directory) {
    for (const file of [valid.image, 'images/gallery/side.png', ...Object.values(materialPaths)]) write(path.join(directory, file), 'SYNTHETIC_ASSET:' + file);
  }
  const check = directory => checkProductAssets(path.join(directory, 'data/seed-sales.sqlite'), path.join(directory, 'images'), path.join(directory, 'materials'));
  const company = path.join(temp, 'private');
  const dataRoot = path.join(temp, 'selected-data');
  write(path.join(company, 'edition.json'), JSON.stringify({ updateSource: 'PRIVATE_SOURCE', shareUser: 'PRIVATE_USER' }));
  const companySeed = seed(path.join(company, 'data/seed-sales.sqlite'), [{ image: 'images/company-only.png', documents: '{}' }]);
  write(path.join(company, 'images/company-only.png'), 'COMPANY_DECOY_IMAGE');
  fs.cpSync(path.join(root, 'templates'), path.join(company, 'templates'), { recursive: true });
  for (const folder of ['materials', 'outputs', 'local-data', 'backups']) write(path.join(company, folder, 'marker.txt'), 'PRIVATE_' + folder);
  const selectedSeed = seed(path.join(dataRoot, 'data/seed-sales.sqlite'));
  write(path.join(dataRoot, 'sales.sqlite'), 'IGNORE_ROOT_DATABASE');
  assets(dataRoot);
  const originals = [snapshot(company), snapshot(dataRoot)];
  await check(company);
  await check(dataRoot);

  const publicOutput = path.join(temp, 'public');
  const internalOutput = path.join(temp, 'company');
  const selectedOutput = path.join(temp, 'selected-company');
  stageApplication(root, publicOutput);
  stageApplication(root, internalOutput, company);
  stageApplication(root, selectedOutput, company, dataRoot);
  const pub = path.join(publicOutput, 'resources/app');
  const internal = path.join(internalOutput, 'resources/app');
  assert.equal(require(path.join(pub, 'package.json')).salesEdition, undefined);
  assert.equal(require(path.join(internal, 'package.json')).name, 'card-sales-system');
  assert.equal(require(path.join(internal, 'package.json')).salesEdition.updateSource, 'PRIVATE_SOURCE');
  for (const [output, expected] of [[internalOutput, companySeed], [selectedOutput, selectedSeed]]) {
    assert.deepEqual(fs.readFileSync(path.join(output, 'resources/data/seed-sales.sqlite')), expected);
    assert.deepEqual(fs.readFileSync(path.join(output, 'sales.sqlite')), expected);
    await checkProductAssets(path.join(output, 'resources/data/seed-sales.sqlite'), path.join(output, 'images'), path.join(output, 'resources/materials'));
  }
  assert(!fs.existsSync(path.join(selectedOutput, 'images/company-only.png')));
  assert(!fs.existsSync(path.join(selectedOutput, 'resources/materials/marker.txt')));
  assert(!fs.existsSync(path.join(publicOutput, 'sales.sqlite')));
  for (const name of ['images', 'materials', 'data']) assert(!fs.existsSync(path.join(publicOutput, name)) && !fs.existsSync(path.join(publicOutput, 'resources', name)));
  for (const name of ['outputs', 'local-data', 'backups']) assert(!fs.existsSync(path.join(internalOutput, name)));
  for (const name of ['main.js', 'preload.js', 'src/main/contractExporter.js', 'src/main/database.js']) assert.deepEqual(fs.readFileSync(path.join(pub, name)), fs.readFileSync(path.join(internal, name)));

  const checks = path.join(temp, 'checks');
  const checkDb = path.join(checks, 'data/seed-sales.sqlite');
  seed(checkDb);
  assets(checks);
  const beforeCheck = snapshot(checks);
  await check(checks);
  assert.deepEqual(snapshot(checks), beforeCheck);
  for (const file of [valid.image, 'images/gallery/side.png', ...Object.values(materialPaths)]) {
    const absolute = path.join(checks, file);
    const bytes = fs.readFileSync(absolute);
    fs.unlinkSync(absolute);
    await assert.rejects(check(checks), /missing or unreadable file/);
    write(absolute, bytes);
  }
  for (const documents of ['{', '[]', 'null', '42', JSON.stringify({ photos: 'images/main.png' }), JSON.stringify({ photos: {} }), JSON.stringify({ photos: [false] }), JSON.stringify({ manual: [] }), Buffer.from('{}')]) {
    seed(checkDb, [{ image: '', documents }]);
    await assert.rejects(check(checks), /invalid JSON|JSON object|photos must be an array|asset path must be a string/);
  }
  seed(checkDb, [{ image: 123, documents: '{}' }]);
  await assert.rejects(check(checks), /expected a safe images|missing or unreadable/);
  seed(checkDb, [{ image: Buffer.from('images/main.png'), documents: '{}' }]);
  await assert.rejects(check(checks), /asset path must be a string/);
  const backslash = String.fromCharCode(92);
  for (const image of ['/absolute.png', ['C:', 'absolute.png'].join(backslash), 'C:relative.png', backslash.repeat(2) + ['server', 'share', 'main.png'].join(backslash), '//server/share/main.png', 'images/../main.png', 'images/gallery/../../main.png', ['images', '..', 'main.png'].join(backslash), './images/main.png', 'images/./main.png', 'images//main.png', 'images/main.png:stream', 'images/main.png.', 'images/main.png ', 'materials/docs/ccc.pdf']) {
    seed(checkDb, [{ image, documents: '{}' }]);
    await assert.rejects(check(checks), /safe images/);
  }
  for (const documents of [{ photos: ['images/gallery/../main.png'] }, { ccc: 'materials/docs/../../outside.pdf' }, { report: 'images/main.png' }]) {
    seed(checkDb, [{ image: '', documents: JSON.stringify(documents) }]);
    await assert.rejects(check(checks), /safe images|safe materials/);
  }
  seed(checkDb, [{ image: ['images', 'main.png'].join(backslash), documents: JSON.stringify({ photos: [['images', 'gallery', 'side.png'].join(backslash)], ...Object.fromEntries(Object.entries(materialPaths).map(([key, file]) => [key, file.replaceAll('/', backslash)])) }) }]);
  await check(checks);
  seed(checkDb, [{ image: 'images/gallery', documents: '{}' }]);
  await assert.rejects(check(checks), /regular file/);
  const imageLink = path.join(checks, 'images/linked');
  fs.symlinkSync(path.join(checks, 'images/gallery'), imageLink, 'junction');
  seed(checkDb, [{ image: 'images/linked/side.png', documents: '{}' }]);
  await assert.rejects(check(checks), /symbolic links/);
  fs.unlinkSync(imageLink);
  const rootLink = path.join(temp, 'linked-images');
  fs.symlinkSync(path.join(checks, 'images'), rootLink, 'junction');
  seed(checkDb);
  await assert.rejects(checkProductAssets(checkDb, rootLink, path.join(checks, 'materials')), /symbolic links/);
  fs.unlinkSync(rootLink);
  const dbLink = path.join(temp, 'linked-database');
  fs.symlinkSync(path.dirname(checkDb), dbLink, 'junction');
  await assert.rejects(checkProductAssets(path.join(dbLink, 'seed-sales.sqlite'), path.join(checks, 'images'), path.join(checks, 'materials')), /symbolic links/);
  fs.unlinkSync(dbLink);
  const emptyRoot = path.join(temp, 'empty');
  seed(path.join(emptyRoot, 'data/seed-sales.sqlite'), [{ image: '', documents: '' }, { image: null, documents: null }, { image: '', documents: JSON.stringify({ photos: [], ...Object.fromEntries(Object.keys(materialPaths).map(key => [key, ''])) }) }]);
  await check(emptyRoot);
  seed(path.join(emptyRoot, 'data/seed-sales.sqlite'), []);
  await check(emptyRoot);
  seed(checkDb, [], 'CREATE TABLE unrelated (id INTEGER)');
  await assert.rejects(check(checks), /items schema/);
  seed(checkDb, [], 'CREATE TABLE items (id INTEGER, image_path TEXT)');
  await assert.rejects(check(checks), /items schema/);
  write(checkDb, 'PRIVATE_SEED');
  await assert.rejects(check(checks), /invalid SQLite header/);
  const corrupt = Buffer.alloc(512);
  Buffer.from('SQLite format 3\0').copy(corrupt);
  write(checkDb, corrupt);
  await assert.rejects(check(checks), /Product asset check failed/);
  write(checkDb, selectedSeed.subarray(0, 100));
  await assert.rejects(check(checks), /Product asset check failed/);
  fs.unlinkSync(checkDb);
  await assert.rejects(check(checks), /missing or unreadable file/);

  // Execute the real entry with synthetic runtime/source and intercept only external commands and manifest publication.
  const entryRoot = path.join(temp, 'source');
  const runtime = path.join(temp, 'runtime/dist');
  write(path.join(runtime, 'electron.exe'), 'SYNTHETIC_RUNTIME');
  for (const file of ['main.js', 'preload.js', 'LICENSE', 'README.md', 'scripts/stub.js', 'src/stub.js', 'templates/stub.txt']) write(path.join(entryRoot, file), 'SYNTHETIC_SOURCE');
  write(path.join(entryRoot, 'package.json'), JSON.stringify({ name: 'public-test', version: '0.0.0' }));
  write(path.join(entryRoot, 'package-lock.json'), JSON.stringify({ name: 'public-test', packages: { '': { name: 'public-test' } } }));
  const entryCode = fs.readFileSync(path.join(__dirname, 'package-public.js'), 'utf8');
  let run = 0;
  async function packageEntry(input = dataRoot, mutateStage = () => {}, manifestFailure = false, companyBuild = true) {
    const output = path.join(temp, 'entry-' + ++run);
    const events = [];
    const errors = [];
    const fakeProcess = { argv: ['node', 'package-public.js', ...(companyBuild ? ['--company-content', company, '--data-root', input] : []), '--output', output], env: {}, execPath: process.execPath, exitCode: 0 };
    const load = id => {
      if (id === 'fs') return { ...fs, cpSync(source, target, options) { events.push('runtime'); return fs.cpSync(source, target, options); } };
      if (id === 'child_process') return { execFileSync(command, args) { if (args.includes('ci')) assert.equal(command, 'C:/Windows/System32/cmd.exe'); events.push(args.includes('ci') ? 'install' : 'public-smoke'); } };
      if (id === './stage-application') return { stageApplication(...args) { events.push('stage'); stageApplication(...args); mutateStage(output); } };
      if (id === './check-product-assets') return { async checkProductAssets(...args) { const phase = args[0].startsWith(output + path.sep) ? 'postflight' : 'preflight'; events.push(phase + ':start'); await checkProductAssets(...args); events.push(phase + ':done'); } };
      if (id === '../src/main/sync-manifest') return { async publishManifest() { events.push('manifest:start'); await Promise.resolve(); if (manifestFailure) throw new Error('SYNTHETIC_MANIFEST_FAILURE'); events.push('manifest:done'); } };
      if (id === '../package.json') return { version: '0.0.0' };
      return require(id);
    };
    load.resolve = id => { assert.equal(id, 'electron/package.json'); return path.join(runtime, '../package.json'); };
    await vm.runInNewContext(entryCode, { require: load, __dirname: path.join(entryRoot, 'scripts'), process: fakeProcess, console: { log() { events.push('success'); }, error(message) { errors.push(message); } } }, { filename: 'package-public.js' });
    return { output, events, errors, exitCode: fakeProcess.exitCode };
  }
  const packaged = await packageEntry();
  assert.equal(packaged.exitCode, 0, packaged.errors.join('\n'));
  assert.deepEqual(packaged.events, ['preflight:start', 'preflight:done', 'runtime', 'stage', 'postflight:start', 'postflight:done', 'install', 'manifest:start', 'manifest:done', 'success']);
  assert.deepEqual(fs.readFileSync(path.join(packaged.output, 'sales.sqlite')), selectedSeed);
  const publicPackage = await packageEntry(null, undefined, false, false);
  assert.equal(publicPackage.exitCode, 0, publicPackage.errors.join('\n'));
  assert.deepEqual(publicPackage.events, ['runtime', 'stage', 'install', 'public-smoke', 'manifest:start', 'manifest:done', 'success']);
  assert(!fs.existsSync(path.join(publicPackage.output, 'sales.sqlite')));
  for (const sourceFailure of ['missing-image', 'invalid-database', 'root-only-database']) {
    const badRoot = path.join(temp, sourceFailure);
    if (sourceFailure === 'root-only-database') write(path.join(badRoot, 'sales.sqlite'), selectedSeed);
    else seed(path.join(badRoot, 'data/seed-sales.sqlite'));
    if (sourceFailure === 'invalid-database') write(path.join(badRoot, 'data/seed-sales.sqlite'), 'NOT_SQLITE');
    const before = snapshot(badRoot);
    const failed = await packageEntry(badRoot);
    assert.equal(failed.exitCode, 1);
    assert(failed.errors.length);
    assert.deepEqual(failed.events, ['preflight:start']);
    assert(!fs.existsSync(failed.output));
    assert.deepEqual(snapshot(badRoot), before);
  }
  for (const mutate of [output => fs.unlinkSync(path.join(output, 'images/main.png')), output => fs.unlinkSync(path.join(output, 'images/gallery/side.png')), output => fs.unlinkSync(path.join(output, 'resources/materials/docs/manual.pdf')), output => fs.appendFileSync(path.join(output, 'sales.sqlite'), 'DIFFERENT'), output => write(path.join(output, 'resources/data/seed-sales.sqlite'), 'NOT_SQLITE')]) {
    const failed = await packageEntry(dataRoot, mutate);
    assert.equal(failed.exitCode, 1);
    assert(failed.errors.length);
    assert(failed.events.includes('postflight:start'));
    assert(!failed.events.some(event => ['install', 'manifest:start', 'success'].includes(event)));
  }
  const manifestFailed = await packageEntry(dataRoot, undefined, true);
  assert.equal(manifestFailed.exitCode, 1);
  assert.deepEqual(manifestFailed.errors, ['SYNTHETIC_MANIFEST_FAILURE']);
  assert(!manifestFailed.events.includes('success'));
  assert.deepEqual([snapshot(company), snapshot(dataRoot)], originals);
  write(path.join(company, 'edition.json'), JSON.stringify({ password: 'DO_NOT_PACKAGE' }));
  assert.throws(() => stageApplication(root, path.join(temp, 'invalid'), company), /credentials/);
  assert.throws(() => stageApplication(root, path.join(temp, 'nested'), root), /separate/);
  console.log('Edition isolation, synthetic SQLite assets, safe paths, unchanged inputs and packaging pre/postflight sequencing passed.');
}

main().catch(error => { console.error(error); process.exitCode = 1; }).finally(() => fs.rmSync(temp, { recursive: true, force: true }));
