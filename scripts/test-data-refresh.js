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
    const end = mainSource.indexOf('\nfunction execFileSyncHidden(', start);
    assert(start >= 0 && end > start);
    let accessible = false, failLogin = false, active = 0, maxActive = 0;
    const commands = [];
    const context = vm.createContext({
      LAN_UPDATE: { shareUser: 'test-user', sharePass: 'synthetic-secret' },
      fs: { constants: { R_OK: 4 }, promises: { access: async (source) => {
        if (!accessible || source === 'missing') throw Object.assign(new Error('missing'), { code: 'ENOENT', syscall: 'access' });
      } } },
      execFile: (file, args, options, done) => {
        assert.strictEqual(file, 'net.exe');
        assert.strictEqual(options.windowsHide, true);
        assert.strictEqual(options.timeout, 15000);
        assert(!args.includes('/delete'));
        assert(args.includes('/persistent:no'));
        commands.push(args); maxActive = Math.max(maxActive, ++active);
        setTimeout(() => {
          active--;
          if (failLogin) done(new Error('command synthetic-secret'), '', 'System error 1219');
          else { accessible = true; done(null); }
        }, 1);
      }
    });
    vm.runInContext(`let lanConnection = Promise.resolve(); ${mainSource.slice(start, end)}`, context);
    const share = String.raw`\\server\share`;
    accessible = true;
    await context.connectLanUpdateShare(share);
    assert.strictEqual(commands.length, 0, 'reuse existing Windows login');
    accessible = false;
    await Promise.all([context.connectLanUpdateShare(share), context.connectLanUpdateShare(share)]);
    assert.strictEqual(commands.length, 1, 'queued request reuses first login');
    assert.strictEqual(maxActive, 1);
    accessible = false; failLogin = true;
    await assert.rejects(context.connectLanUpdateShare(share), (error) => error.message.includes('1219') && !error.message.includes('synthetic-secret'));
    failLogin = false;
    await context.connectLanUpdateShare(share);
    assert.strictEqual(commands.length, 3, 'queue recovers after failed login');
    const eventsConnect = [];
    assert.strictEqual(await context.resolveLanUpdateSource(['missing', share], event => eventsConnect.push(event)), share);
    assert.strictEqual(eventsConnect.length, 2);
    await assert.rejects(context.resolveLanUpdateSource(['missing']), /ENOENT/);
    await assert.rejects(context.resolveLanUpdateSource([]), /无法访问/);
    context.LAN_UPDATE.shareUser = '';
    await context.connectLanUpdateShare(share);
    assert.strictEqual(commands.length, 3);
    const parserStart = mainSource.indexOf('function getLanUpdateSources(');
    const parserEnd = mainSource.indexOf('async function checkLanUpdate(', parserStart);
    const parser = vm.createContext({ fs: require('fs'), path, getDataDir: () => temp, process: { resourcesPath: temp }, __dirname: temp,
      LAN_UPDATE: { sourceConfigName: 'update-source.txt', defaultSourcePath: 'default-source' } });
    vm.runInContext(mainSource.slice(parserStart, parserEnd), parser);
    assert.deepStrictEqual(Array.from(parser.getLanUpdateSources()), ['default-source']);
    await write(path.join(temp, 'update-source.txt'), '\ufeff# comment\r\n first \r\n\r\n# backup\r\nsecond\r\nfirst\r\n');
    assert.deepStrictEqual(Array.from(parser.getLanUpdateSources()), ['first', 'second']);
    await write(path.join(temp, 'update-source.txt'), 'single');
    assert.deepStrictEqual(Array.from(parser.getLanUpdateSources()), ['single']);
    await write(path.join(temp, 'update-source.txt'), '# empty');
    assert.deepStrictEqual(Array.from(parser.getLanUpdateSources()), ['default-source']);
    assert(mainSource.includes('sourcePath = await resolveLanUpdateSource(sources)'));
    assert(mainSource.includes('source = await resolveLanUpdateSource(sources, report)'));
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
