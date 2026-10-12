const assert = require('assert');
const fs = require('fs/promises');
const path = require('path');
const os = require('os');
const initSqlJs = require('sql.js');
const vm = require('vm');
const { refreshData } = require('../src/main/data-refresh');

async function main() {
  const temp = await fs.mkdtemp(path.join(os.tmpdir(), 'guolong-refresh-test-'));
  const SQL = await initSqlJs();
  const db = new SQL.Database();
  db.run("CREATE TABLE items (id INTEGER, name TEXT); INSERT INTO items VALUES (1, 'new product')");
  const valid = Buffer.from(db.export());
  db.close();
  async function write(file, text) { await fs.mkdir(path.dirname(file), { recursive: true }); await fs.writeFile(file, text); }
  async function fixture(name) {
    const source = path.join(temp, name, 'source'), target = path.join(temp, name, 'target');
    await write(path.join(source, 'sales.sqlite'), valid);
    await write(path.join(source, 'images/category/new.png'), 'new image');
    await write(path.join(source, 'resources/materials/new.pdf'), 'new material');
    await write(path.join(target, 'sales.sqlite'), 'original database');
    await write(path.join(target, 'images/old.png'), 'original image');
    await write(path.join(target, 'resources/materials/old.pdf'), 'original material');
    await write(path.join(target, 'outputs/合同/keep.xlsx'), 'contract');
    await write(path.join(target, 'outputs/报价单/keep.xlsx'), 'quote');
    await write(path.join(target, 'local-data/recent-files.json'), 'recent files');
    await write(path.join(target, 'resources/app.asar'), 'application');
    await write(path.join(target, 'release-version.json'), 'version');
    return { source, target };
  }
  async function unchanged(target) {
    assert.strictEqual(await fs.readFile(path.join(target, 'sales.sqlite'), 'utf8'), 'original database');
    assert.strictEqual(await fs.readFile(path.join(target, 'images/old.png'), 'utf8'), 'original image');
    assert.strictEqual(await fs.readFile(path.join(target, 'resources/materials/old.pdf'), 'utf8'), 'original material');
  }
  try {
    const mainSource = await fs.readFile(path.join(__dirname, '..', 'main.js'), 'utf8');
    const start = mainSource.indexOf('async function connectLanUpdateShare(');
    const end = mainSource.indexOf('\nfunction getUncShareRoot(', start);
    assert(start >= 0 && end > start);
    const connections = [];
    const context = vm.createContext({
      LAN_UPDATE: { shareUser: 'test-user', sharePass: 'test-password' },
      getUncShareRoot: () => 'test-share',
      execFile: (file, args, options, done) => {
        assert.strictEqual(file, 'net.exe');
        assert.strictEqual(options.windowsHide, true);
        connections.push(args.includes('/delete') ? 'disconnect' : 'connect');
        setTimeout(() => done(null), 1);
      }
    });
    await vm.runInContext(`let lanConnection = Promise.resolve(); ${mainSource.slice(start, end)}; Promise.all([connectLanUpdateShare('test'), connectLanUpdateShare('test')])`, context);
    assert.deepStrictEqual(connections, ['disconnect', 'connect', 'disconnect', 'connect']);
    const success = await fixture('success');
    const events = [];
    await refreshData(success.source, success.target, (event) => events.push(event));
    assert((await fs.readFile(path.join(success.target, 'sales.sqlite'))).equals(valid));
    assert.strictEqual(await fs.readFile(path.join(success.target, 'images/category/new.png'), 'utf8'), 'new image');
    await assert.rejects(fs.access(path.join(success.target, 'images/old.png')));
    for (const [file, value] of [['outputs/合同/keep.xlsx', 'contract'], ['outputs/报价单/keep.xlsx', 'quote'], ['local-data/recent-files.json', 'recent files'], ['resources/app.asar', 'application'], ['release-version.json', 'version']]) {
      assert.strictEqual(await fs.readFile(path.join(success.target, file), 'utf8'), value);
    }
    assert(events.some((event) => event.step === 2 && event.current === event.total && event.total > 0));
    const missing = await fixture('missing');
    await fs.unlink(path.join(missing.source, 'sales.sqlite'));
    await assert.rejects(refreshData(missing.source, missing.target), /原有数据已保留/);
    await unchanged(missing.target);
    const invalid = await fixture('invalid');
    await write(path.join(invalid.source, 'sales.sqlite'), 'not SQLite');
    await assert.rejects(refreshData(invalid.source, invalid.target), /数据库格式无效/);
    await unchanged(invalid.target);
    const optional = await fixture('optional');
    await fs.rm(path.join(optional.source, 'resources/materials'), { recursive: true });
    await refreshData(optional.source, optional.target);
    assert.strictEqual(await fs.readFile(path.join(optional.target, 'resources/materials/old.pdf'), 'utf8'), 'original material');
    const rollback = await fixture('rollback');
    const rename = fs.rename;
    fs.rename = async (from, to) => {
      if (from.includes('refresh-stage-') && to === path.join(rollback.target, 'resources/materials')) throw Object.assign(new Error('simulated failure'), { code: 'EACCES' });
      return rename(from, to);
    };
    try { await assert.rejects(refreshData(rollback.source, rollback.target), /原有数据已保留/); }
    finally { fs.rename = rename; }
    await unchanged(rollback.target);
    const recovery = await fixture('recovery');
    fs.rename = async (from, to) => {
      if ((from.includes('refresh-stage-') && to === path.join(recovery.target, 'resources/materials')) || (from.includes('data-refresh-backup-') && to === path.join(recovery.target, 'images'))) throw new Error('simulated restore failure');
      return rename(from, to);
    };
    try { await assert.rejects(refreshData(recovery.source, recovery.target), (error) => error.recoveryRequired && error.message.includes('原始备份保留')); }
    finally { fs.rename = rename; }
    const backups = (await fs.readdir(path.join(recovery.target, 'local-data'))).filter((name) => name.startsWith('data-refresh-backup-'));
    assert.strictEqual(backups.length, 1);
    assert.strictEqual(await fs.readFile(path.join(recovery.target, 'local-data', backups[0], 'images/old.png'), 'utf8'), 'original image');
    await assert.rejects(refreshData(success.source, success.source), /相同或互相包含/);
    await assert.rejects(refreshData(success.source, path.join(success.source, 'child')), /相同或互相包含/);
    console.log('Refresh checks passed: mirror, validation, missing source, optional materials, rollback, real file progress, outputs/local-data/app/version preservation.');
  } finally { await fs.rm(temp, { recursive: true, force: true }); }
}
main().catch((error) => { console.error(error); process.exitCode = 1; });
