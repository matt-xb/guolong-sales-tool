const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const vm = require('node:vm');
const { createRequire } = require('node:module');
const { initDatabase } = require('../src/main/database');
const { productImageFolder, productImageGroupKey } = require('../src/shared/product-images');

(async () => {
  const root = path.resolve(__dirname, '..');
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'sales-image-folders-'));
  try {
    const part = (name, category = 'Test') => ({ type: 'part', category, name });
    assert.equal(productImageFolder(part('100L/200L折叠锅盖')), 'parts/折叠锅盖');
    assert.equal(productImageFolder(part('300L/400L折叠锅盖')), 'parts/折叠锅盖');
    assert.equal(productImageFolder(part('1.1KW八字/平躺搅拌')), 'parts/八字平躺搅拌');
    for (const name of ['电加热控制器', '燃烧机控制器', '智能燃气炒锅控制器']) {
      assert.equal(productImageFolder(part(name)), 'parts/控制器');
    }
    assert.equal(productImageFolder(part('1810接触器')), 'parts/接触器');
    assert.equal(productImageFolder(part('电磁阀 20mm')), 'parts/电磁阀');
    assert.notEqual(productImageGroupKey(part('Control A')), productImageGroupKey(part('Control B')));
    assert.equal(productImageFolder({ type: 'equipment', name: 'New Product' }), 'equipment/New Product');
    assert.equal(productImageFolder(part('CON')), 'parts/_CON');
    assert(!productImageFolder({ type: 'equipment', category: '..', name: '../Safe' }).split('/').includes('..'));
    const handlers = new Map();
    let selection;
    let pickedFolder;
    const electron = {
      app: { isPackaged: false, requestSingleInstanceLock: () => false, quit() {}, on() {}, getPath: () => directory },
      ipcMain: { handle: (channel, fn) => handlers.set(channel, fn), on() {} },
      Menu: { setApplicationMenu() {} },
      dialog: { showOpenDialog: async (_window, options) => {
        pickedFolder = options.defaultPath;
        return selection ? { canceled: false, filePaths: [selection] } : { canceled: true, filePaths: [] };
      } },
      nativeImage: { createFromPath: file => ({ isEmpty: () => path.basename(file) === 'bad.png', getSize: () => ({ width: 20, height: 10 }), toJPEG: () => fs.readFileSync(file) }) }
    };
    const realRequire = createRequire(path.join(root, 'main.js'));
    const context = vm.createContext({ require: name => name === 'electron' ? electron : realRequire(name), __dirname: root, process, console, Buffer, setTimeout, clearTimeout });
    vm.runInContext(fs.readFileSync(path.join(root, 'main.js'), 'utf8'), context);
    context.testDatabase = await initDatabase(path.join(directory, 'sales.sqlite'));
    vm.runInContext('db = testDatabase', context);
    const pick = handlers.get('images:pick');
    const item = { type: 'equipment', category: 'Test', name: 'Original' };
    await assert.rejects(pick({}, { ...item, name: '' }), /商品名称/);
    assert.equal(await pick({}, item), null);
    assert(fs.statSync(path.join(directory, 'images/equipment/Test/Original')).isDirectory());
    selection = path.join(directory, 'input.png');
    fs.writeFileSync(selection, 'SYNTHETIC_IMAGE');
    const external = await pick({}, item);
    assert(external.startsWith('images/equipment/Test/Original/'));
    const original = path.join(directory, external);
    selection = original;
    assert.equal(await pick({}, item), external);
    const newItem = { ...item, name: 'Renamed', image_path: external };
    const saved = await handlers.get('items:save')({}, newItem);
    assert(saved.image_path.startsWith('images/equipment/Test/Renamed/'));
    assert.equal(fs.readFileSync(path.join(directory, saved.image_path), 'utf8'), 'SYNTHETIC_IMAGE');
    assert(fs.existsSync(original));
    selection = original;
    const copied = await pick({}, part('20mm Test Part'));
    assert(copied.startsWith('images/parts/Test Part/'));
    assert.equal(pickedFolder, path.join(directory, 'images/parts/Test Part'));
    selection = path.join(directory, 'bad.png');
    fs.writeFileSync(selection, 'BAD');
    await assert.rejects(pick({}, item), /图片读取失败/);
    assert(fs.existsSync(selection));
    const missing = await handlers.get('items:save')({}, { ...saved, image_path: 'images/missing.png' });
    assert.equal(missing.image_path, 'images/missing.png');
    console.log('Image folders: family grouping, independent albums, pick/cancel, reuse, rename-on-save, copies and invalid image handling passed.');
  } finally { fs.rmSync(directory, { recursive: true, force: true }); }
})().catch(error => { console.error(error); process.exitCode = 1; });
