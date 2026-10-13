const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const vm = require('node:vm');
const { createRequire } = require('node:module');

(async () => {
  const root = path.resolve(__dirname, '..');
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'sales-ipc-log-'));
  try {
    const handlers = new Map();
    const realRequire = createRequire(path.join(root, 'main.js'));
    const fakeFs = Object.create(fs);
    fakeFs.existsSync = file => String(file).includes(`${path.sep}templates${path.sep}`) ? false : fs.existsSync(file);
    const electron = {
      app: { isPackaged: false, requestSingleInstanceLock: () => false, quit() {}, on() {}, getPath: () => directory },
      ipcMain: { handle: (channel, handler) => handlers.set(channel, handler), on() {} },
      Menu: { setApplicationMenu() {} }
    };
    vm.runInNewContext(fs.readFileSync(path.join(root, 'main.js'), 'utf8'), {
      require: name => name === 'electron' ? electron : name === 'fs' ? fakeFs : realRequire(name),
      __dirname: root, process, console, Buffer, setTimeout, clearTimeout
    });
    for (const channel of ['contract:create', 'quote:create', 'items:save', 'materials:copy', 'data-refresh:start']) assert(handlers.has(channel), channel);
    for (const channel of ['contract:create', 'quote:create']) {
      await assert.rejects(handlers.get(channel)({}, { customerName: 'PRIVATE_CUSTOMER', customerCode: 'P', items: [] }), error => error.code === 'TEMPLATE_MISSING');
    }
    const text = fs.readFileSync(path.join(directory, 'local-data/logs/operations.log'), 'utf8');
    const rows = text.trim().split('\n').map(JSON.parse);
    assert.equal(rows.length, 4);
    assert.equal(rows[0].id, rows[1].id); assert.equal(rows[2].id, rows[3].id);
    assert(rows.filter(row => row.result === 'failed').every(row => row.code === 'TEMPLATE_MISSING'));
    assert(!text.includes('PRIVATE_CUSTOMER'));
    console.log('Sales IPC log: registered callers, real export preflight failure, error preservation, correlation and customer privacy passed.');
  } finally { fs.rmSync(directory, { recursive: true, force: true }); }
})().catch(error => { console.error(error); process.exitCode = 1; });
