const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { createRequire } = require('node:module');
const { buildAfterSalesVideoUrl } = require('../src/main/after-sales-video');

(async () => {
  const base = 'https://videos.example.test/library/?ref=sales&category=old&subcategory=old&device=old#old';
  assert.equal(buildAfterSalesVideoUrl(base), 'https://videos.example.test/library/?ref=sales');
  const name = '设备甲（燃气） & A/B #1';
  const linked = new URL(buildAfterSalesVideoUrl(base, name));
  assert.equal(linked.searchParams.get('device'), name);
  assert.equal(linked.origin, 'https://videos.example.test');
  assert.equal(linked.searchParams.get('category'), null);
  for (const value of ['', null, {}, 'not a url', 'http://videos.example.test', 'javascript:alert(1)', 'file:///C:/tool.vbs', 'data:text/html,test', 'https://user:pass@videos.example.test', 'https://user@videos.example.test']) {
    assert.throws(() => buildAfterSalesVideoUrl(value), /未配置|HTTPS/);
  }
  for (const value of ['', '  ', null, {}]) assert.throws(() => buildAfterSalesVideoUrl(base, value), /设备名称/);

  const root = path.resolve(__dirname, '..');
  const realRequire = createRequire(path.join(root, 'main.js'));
  const handlers = new Map(), opened = [], logged = [], lookedUp = [];
  let openError;
  const items = new Map([[7, { type: 'equipment', name }], [8, { type: 'part', name: '配件甲' }], [9, { type: 'equipment', name: '' }], [10, { type: 'equipment' }]]);
  const database = { getItem: id => { lookedUp.push(id); return items.get(id); } };
  const environment = { SALES_VIDEO_URL: 'https://override.example.test/videos' };
  const electron = {
    app: { isPackaged: false, requestSingleInstanceLock: () => false, quit() {}, on() {}, getPath: () => root },
    ipcMain: { handle: (channel, handler) => handlers.set(channel, handler), on() {} },
    Menu: { setApplicationMenu() {} },
    shell: { openExternal: async url => { if (openError) throw openError; opened.push(url); } }
  };
  const context = vm.createContext({
    require: key => key === 'electron' ? electron : key === './package.json' ? { salesEdition: { videoUrl: base } }
      : key === './src/main/operation-log' ? { createOperationLog: () => ({ run: (channel, run) => { logged.push(channel); return run(); } }) }
      : key === 'child_process' ? { execFile() { assert.fail('after-sales must not execute scripts'); }, spawn() { assert.fail('after-sales must not spawn scripts'); } } : realRequire(key),
    __dirname: root, process: { env: environment }, console, Buffer, database
  });
  const main = fs.readFileSync(path.join(root, 'main.js'), 'utf8');
  vm.runInContext(main + '\n dbPromise = Promise.resolve(database);', context);
  const open = handlers.get('after-sales-video:open');
  assert.equal(await open({}), true);
  assert.equal(opened.pop(), environment.SALES_VIDEO_URL);
  await open({}, 7);
  assert.equal(new URL(opened.pop()).searchParams.get('device'), name);
  assert.deepEqual(lookedUp, [7]);
  delete environment.SALES_VIDEO_URL;
  await open({});
  assert.equal(opened.pop(), buildAfterSalesVideoUrl(base));
  for (const id of ['https://attacker.example.test', '7', {}, null, 0, -1, NaN, Infinity, 1.5]) await assert.rejects(open({}, id), /设备编号/);
  for (const id of [8, 999]) await assert.rejects(open({}, id), /设备不存在/);
  for (const id of [9, 10]) await assert.rejects(open({}, id), /设备名称/);
  environment.SALES_VIDEO_URL = 'javascript:alert(1)';
  await assert.rejects(open({}, 7), /HTTPS/);
  environment.SALES_VIDEO_URL = 'https://videos.example.test';
  openError = new Error('browser unavailable');
  await assert.rejects(open({}), /售后视频库启动失败/);
  assert.equal(opened.length, 0);
  assert(logged.every(channel => channel === 'after-sales-video:open'));
  assert(!main.includes('getAfterSalesVideoScriptPath') && !main.includes('runAfterSalesVideoScript'));

  const apis = {};
  vm.runInNewContext(fs.readFileSync(path.join(root, 'preload.js'), 'utf8'), {
    require: key => key === 'electron' ? { contextBridge: { exposeInMainWorld: (key, api) => { apis[key] = api; } }, ipcRenderer: { invoke: (...args) => args } } : realRequire(key)
  });
  assert.deepEqual(Array.from(apis.salesApi.openAfterSalesVideo(7)), ['after-sales-video:open', 7]);
  assert.deepEqual(Array.from(apis.salesApi.openAfterSalesVideo()), ['after-sales-video:open', undefined]);

  const source = fs.readFileSync(path.join(root, 'src/renderer/app.js'), 'utf8');
  const calls = [], toasts = [];
  let rendererError;
  const renderer = vm.createContext({
    gallerySuppressClick: false, uiText: zh => zh, showToast: (message, type) => toasts.push({ message, type }),
    window: { salesApi: { openAfterSalesVideo: async id => { if (rendererError) throw rendererError; calls.push(id); } } }
  });
  vm.runInContext(source.slice(source.indexOf('async function copyMaterialFromDetail('), source.indexOf('function openMaterialContextMenu('))
    + source.slice(source.indexOf('async function openAfterSalesVideo('), source.indexOf('async function checkForUpdates(')), renderer);
  await renderer.copyMaterialFromDetail({ target: { closest: selector => selector === '[data-after-sales-item-id]' ? { dataset: { afterSalesItemId: '7' } } : null } });
  await renderer.openAfterSalesVideo();
  assert.deepEqual(calls, [7, undefined]);
  rendererError = new Error('precise error');
  await renderer.openAfterSalesVideo(7);
  assert.deepEqual(toasts.at(-1), { message: 'precise error', type: 'error' });
  assert(source.includes("el.heroAfterSalesVideoBtn.addEventListener('click', () => openAfterSalesVideo());"));
  Object.assign(renderer, {
    item: { id: 7, type: 'equipment', name: '设备甲' }, translateCategory: String, translateMissingInfo: value => value,
    getMissingEquipmentInfo: () => [], extractCapacity: () => '', translateProductName: String, detailSection: () => '',
    translateStructuredText: String, translateApplicationText: () => '', translateSellingPointsText: () => '',
    buildProductGalleryHtml: () => '', escapeHtml: String, detailMeta: () => '', translateModel: String,
    translateChineseText: String, formatPrice: () => '', buildDocumentActionsHtml: () => ''
  });
  vm.runInContext(source.slice(source.indexOf('function buildProductDetailHtml('), source.indexOf('function detailMeta(')), renderer);
  assert(renderer.buildProductDetailHtml(renderer.item).includes('data-after-sales-item-id="7"'));
  assert(!renderer.buildProductDetailHtml({ ...renderer.item, type: 'part' }).includes('data-after-sales-item-id'));
  console.log('After-sales video: HTTPS validation, database-only equipment names, env/edition, no script fallback, preload and detail/home renderer passed (synthetic only).');
})().catch(error => { console.error(error); process.exitCode = 1; });
