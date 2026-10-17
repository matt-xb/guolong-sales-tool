const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const vm = require('node:vm');
const { createRequire } = require('node:module');
const { execFileSync } = require('node:child_process');

(async () => {
  const root = path.resolve(__dirname, '..');
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'sales-recent-copy-'));
  try {
    const handlers = new Map();
    const calls = [];
    let copyError;
    const electron = {
      app: { isPackaged: false, requestSingleInstanceLock: () => false, quit() {}, on() {}, getPath: () => temp },
      ipcMain: { handle: (channel, handler) => handlers.set(channel, handler), on() {} },
      Menu: { setApplicationMenu() {} }
    };
    const realRequire = createRequire(path.join(root, 'main.js'));
    vm.runInNewContext(fs.readFileSync(path.join(root, 'main.js'), 'utf8'), {
      require: name => name === 'electron' ? electron : name === 'child_process' ? {
        ...realRequire(name), execFile: (exe, args, options, callback) => {
          calls.push({ exe, args, options }); callback(copyError);
        }
      } : realRequire(name),
      __dirname: root, process, console, Buffer, setTimeout, clearTimeout
    });
    const copy = handlers.get('recent:copy');
    const contract = path.join(temp, "contract [A]&B's.xlsx");
    const quote = path.join(temp, 'quote.xlsx');
    const missing = path.join(temp, 'missing.xlsx');
    fs.mkdirSync(path.join(temp, 'local-data'), { recursive: true });
    fs.writeFileSync(contract, 'SYNTHETIC_CONTRACT');
    fs.writeFileSync(quote, 'SYNTHETIC_QUOTE');
    fs.writeFileSync(path.join(temp, 'local-data/recent-files.json'), JSON.stringify([
      { type: '合同', filePath: contract }, { type: '英文报价单', filePath: quote },
      { type: '合同', filePath: missing }, { type: '合同', filePath: temp }
    ]));
    for (const file of [contract, quote]) assert.equal((await copy({}, file)).ok, true);
    assert.equal(calls.length, 2);
    assert.equal(calls[0].options.env.SALES_CLIPBOARD_FILE, contract);
    assert.equal(calls[0].options.windowsHide, true);
    assert(calls[0].args.includes('-STA'));
    assert(calls[0].args.some(arg => arg.includes('Set-Clipboard -LiteralPath')));
    if (process.platform === 'win32') {
      const args = calls[0].args.slice();
      args[args.length - 1] = 'function Set-Clipboard { param([string]$LiteralPath); [Console]::Write([Convert]::ToBase64String([Text.Encoding]::Unicode.GetBytes($LiteralPath))) }; ' + args.at(-1);
      const result = execFileSync(calls[0].exe, args, { ...calls[0].options, encoding: 'utf8' });
      assert.equal(Buffer.from(result, 'base64').toString('utf16le'), contract);
    }
    for (const file of [null, {}, 'relative.xlsx', path.join(temp, 'unlisted.xlsx')]) await assert.rejects(copy({}, file), /最近文件/);
    await assert.rejects(copy({}, missing), /不存在/);
    await assert.rejects(copy({}, temp), /不是一个文件/);
    assert.equal(calls.length, 2);
    copyError = new Error('clipboard busy');
    await assert.rejects(copy({}, contract), /复制失败.*clipboard busy/);
    assert.equal(fs.readFileSync(contract, 'utf8'), 'SYNTHETIC_CONTRACT');

    const apis = {};
    vm.runInNewContext(fs.readFileSync(path.join(root, 'preload.js'), 'utf8'), {
      require: name => name === 'electron' ? {
        contextBridge: { exposeInMainWorld: (key, api) => { apis[key] = api; } },
        ipcRenderer: { invoke: (...args) => args }
      } : realRequire(name)
    });
    assert.deepEqual(Array.from(apis.salesApi.copyRecentFile(contract)), ['recent:copy', contract]);

    const source = fs.readFileSync(path.join(root, 'src/renderer/app.js'), 'utf8');
    const renderer = source.slice(source.indexOf('function renderRecentFiles()'), source.indexOf('function updateContractNo()'));
    const buttons = ['open', 'reveal', 'copy'].map(action => ({
      dataset: { action, path: contract }, textContent: '', disabled: false,
      addEventListener(_event, callback) { this.click = callback; }
    }));
    const list = { querySelectorAll: () => buttons };
    const state = { recentFileType: 'contract', recentFiles: [
      { type: '合同', filePath: contract, fileName: 'Contract.xlsx' },
      { type: '英文报价单', filePath: quote, fileName: 'Quote.xlsx' }
    ] };
    const timers = [];
    const errors = [];
    const copied = [];
    const context = vm.createContext({
      state, el: { recentFilesList: list }, uiText: zh => zh,
      escapeHtml: String, escapeAttribute: String,
      window: { salesApi: { copyRecentFile: async file => { if (copyError) throw copyError; copied.push(file); } } },
      setTimeout: (callback, delay) => timers.push({ callback, delay }),
      showToast: message => errors.push(message)
    });
    vm.runInContext(renderer + '\nrenderRecentFiles();', context);
    assert(list.innerHTML.includes('data-action="copy"'));
    assert(!list.innerHTML.includes('Quote.xlsx'));
    copyError = null;
    await buttons[2].click();
    assert.deepEqual(copied, [contract]);
    assert.equal(buttons[2].textContent, '已复制');
    assert.equal(buttons[2].disabled, true);
    assert.equal(timers[0].delay, 1500);
    timers[0].callback();
    assert.equal(buttons[2].textContent, '复制');
    assert.equal(buttons[2].disabled, false);
    copyError = new Error('copy failed');
    await buttons[2].click();
    assert.equal(errors.at(-1), 'copy failed');
    assert.equal(buttons[2].disabled, false);
    state.recentFileType = 'quote';
    vm.runInContext('renderRecentFiles();', context);
    assert(list.innerHTML.includes('Quote.xlsx') && !list.innerHTML.includes('Contract.xlsx'));
    assert(list.innerHTML.includes('data-action="copy"'));
    console.log('Recent copy: allowlist, literal file clipboard, failures, preload, both tabs and feedback passed.');
  } finally { fs.rmSync(temp, { recursive: true, force: true }); }
})().catch(error => { console.error(error); process.exitCode = 1; });
