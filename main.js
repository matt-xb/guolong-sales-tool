const { app, BrowserWindow, dialog, ipcMain, Menu, nativeImage, shell } = require('electron');
const path = require('path');
const fs = require('fs');
const { clipboard } = require('electron');
const { execFile, spawn } = require('child_process');
const { initDatabase } = require('./src/main/database');
const { buildInventoryPreview } = require('./src/main/inventory-import');
const { productImagePaths, productImageFolder } = require('./src/shared/product-images');
const { refreshData } = require('./src/main/data-refresh');
const {
  MATERIAL_DEFINITIONS,
  getMaterialDefinition,
  validateMaterialExtension,
  buildImportedMaterialRelativePath,
  isManagedImportedMaterialPath
} = require('./src/main/material-files');
const { resolveUniqueCustomerCode } = require('./src/shared/customer-code');

const AFTER_SALES_VIDEO = {
  scriptName: 'open-after-sales-video.vbs',
  fallbackScriptPath: process.env.SALES_VIDEO_SCRIPT || ''
};

const LAN_UPDATE = {
  scriptName: 'update.bat',
  sourceConfigName: 'update-source.txt',
  defaultSourcePath: process.env.SALES_UPDATE_SOURCE || '',
  versionFileName: 'release-version.json',
  releaseNotesName: 'release-notes.json',
  releaseNotesStateName: 'release-notes-state.json',
  shareUser: process.env.SALES_SHARE_USER || '',
  sharePass: process.env.SALES_SHARE_PASSWORD || ''
};
const CONTRACT_TEMPLATE_OPTIONS = {
  special_food_machinery: {
    fileName: 'contract-template.xlsx',
    label: '国龙食品机械（专票）'
  },
  normal_kitchen_factory: {
    fileName: 'contract-template-normal.xlsx',
    label: '厨房设备厂（普票）'
  }
};

let mainWindow;
let refreshWindow;
let refreshBusy = false;
let lanConnection = Promise.resolve();
let db;
let dbPromise;
let recentFilesMigrationDone = false;
const gotSingleInstanceLock = app.requestSingleInstanceLock();

if (!gotSingleInstanceLock) {
  app.quit();
}

function ensureAppDirs() {
  const baseDir = getDataDir();
  const imageDir = path.join(baseDir, 'images');
  const outputDir = path.join(baseDir, 'outputs');
  const contractOutputDir = path.join(outputDir, '合同');
  const quoteOutputDir = path.join(outputDir, '报价单');
  const localDataDir = path.join(baseDir, 'local-data');
  fs.mkdirSync(imageDir, { recursive: true });
  fs.mkdirSync(outputDir, { recursive: true });
  fs.mkdirSync(contractOutputDir, { recursive: true });
  fs.mkdirSync(quoteOutputDir, { recursive: true });
  fs.mkdirSync(localDataDir, { recursive: true });
  if (!recentFilesMigrationDone) {
    migrateRecentFiles(baseDir, localDataDir);
    recentFilesMigrationDone = true;
  }
  return { baseDir, imageDir, outputDir, contractOutputDir, quoteOutputDir, localDataDir };
}

function getDataDir() {
  if (!app.isPackaged) return app.getPath('userData');
  return process.env.PORTABLE_EXECUTABLE_DIR || path.dirname(app.getPath('exe'));
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 820,
    minWidth: 1100,
    minHeight: 720,
    title: '国龙食品机械销售工具',
    icon: getWindowIconPath(),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  mainWindow.loadFile(path.join(__dirname, 'src', 'renderer', 'index.html'));
}

function focusMainWindow() {
  if (refreshWindow && !refreshWindow.isDestroyed()) { refreshWindow.show(); refreshWindow.focus(); return; }
  if (!mainWindow || mainWindow.isDestroyed()) return;
  if (mainWindow.isMinimized()) mainWindow.restore();
  mainWindow.show();
  mainWindow.focus();
}

if (gotSingleInstanceLock) {
  app.on('second-instance', focusMainWindow);

  app.whenReady().then(() => {
    app.setAppUserModelId('com.guolong.sales-tool.open-source');
    const dirs = ensureAppDirs();
    dbPromise = initDatabase(path.join(dirs.baseDir, 'sales.sqlite'), getSeedDatabasePath())
      .then((database) => {
        db = database;
        return database;
      });
    createWindow();

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
  });
}

function getDatabase() {
  return db || dbPromise;
}

function getSeedDatabasePath() {
  if (app.isPackaged) return null;
  const packagedPath = path.join(process.resourcesPath || '', 'data', 'seed-sales.sqlite');
  if (fs.existsSync(packagedPath)) return packagedPath;
  return path.join(__dirname, 'data', 'seed-sales.sqlite');
}


function getRecentFilesPath() {
  return path.join(ensureAppDirs().localDataDir, 'recent-files.json');
}

function getCustomerCodeRegistryPath() {
  return path.join(ensureAppDirs().localDataDir, 'customer-codes.json');
}

function readCustomerCodeRegistry() {
  const filePath = getCustomerCodeRegistryPath();
  if (!fs.existsSync(filePath)) return [];
  try {
    const parsed = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeCustomerCodeRegistry(entries) {
  fs.writeFileSync(getCustomerCodeRegistryPath(), JSON.stringify(entries, null, 2), 'utf8');
}

function assertCustomerCodeAvailable(customerName, customerCode) {
  const name = String(customerName || '').trim();
  const code = String(customerCode || '').trim().toUpperCase();
  if (!name || !code) return [];

  const entries = readCustomerCodeRegistry();
  const normalizedName = name.replace(/\s+/g, '');
  const conflicting = entries.find((entry) => String(entry.customerCode || '').toUpperCase() === code
    && String(entry.customerName || '').replace(/\s+/g, '') !== normalizedName);
  if (conflicting) {
    throw new Error(`客户简称 ${code} 已用于“${conflicting.customerName}”，请使用系统自动生成的未重复简称。`);
  }
  return entries;
}

function rememberCustomerCode(customerName, customerCode) {
  const name = String(customerName || '').trim();
  const code = String(customerCode || '').trim().toUpperCase();
  if (!name || !code) return;

  const entries = assertCustomerCodeAvailable(name, code);
  const normalizedName = name.replace(/\s+/g, '');
  const existingIndex = entries.findIndex((entry) => String(entry.customerName || '').replace(/\s+/g, '') === normalizedName);
  const entry = { customerName: name, customerCode: code, updatedAt: new Date().toISOString() };
  if (existingIndex >= 0) entries[existingIndex] = entry;
  else entries.push(entry);
  writeCustomerCodeRegistry(entries);
}

function getLegacyRecentFilesPath() {
  return path.join(ensureAppDirs().baseDir, 'recent-files.json');
}

function migrateRecentFiles(baseDir, localDataDir) {
  const legacyPath = path.join(baseDir, 'recent-files.json');
  const currentPath = path.join(localDataDir, 'recent-files.json');
  if (fs.existsSync(currentPath) || !fs.existsSync(legacyPath)) return;
  try {
    fs.copyFileSync(legacyPath, currentPath);
  } catch {
    // Recent files are non-critical; failing migration should not block startup.
  }
}

function readRecentFiles() {
  const filePath = getRecentFilesPath();
  const candidates = [filePath, getLegacyRecentFilesPath()];
  for (const candidate of candidates) {
    if (!fs.existsSync(candidate)) continue;
    try {
      const data = JSON.parse(fs.readFileSync(candidate, 'utf8'));
      if (Array.isArray(data)) return data;
    } catch {
      // Try the next candidate.
    }
  }
  return [];
}

function writeRecentFiles(items) {
  const filePath = getRecentFilesPath();
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(items.slice(0, 50), null, 2), 'utf8');
}

function addRecentFile(entry) {
  if (!entry?.filePath) return;
  const filePath = entry.filePath;
  const items = readRecentFiles().filter((item) => item.filePath !== filePath);
  const now = new Date();
  items.unshift({
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    createdAt: now.toISOString(),
    date: formatFileDate(now),
    type: entry.type || '文件',
    customerName: entry.customerName || '',
    itemSummary: entry.itemSummary || '',
    fileName: path.basename(filePath),
    filePath
  });
  writeRecentFiles(items);
}

function buildRecentItemSummary(items) {
  const labels = (Array.isArray(items) ? items : []).map((item) => {
    const name = String(item?.name || '').trim();
    if (!name) return '';
    const detailText = [item.lineRemark, item.remark, item.parameters].filter(Boolean).join('\n');
    const capacity = detailText.match(/(?:容量|Capacity)\s*[:：]?\s*(\d+(?:\.\d+)?\s*L)/i)?.[1]?.replace(/\s+/g, '') || '';
    const quantity = Math.max(1, Number(item.quantity) || 1);
    return `${name}${capacity && !name.includes(capacity) ? ` ${capacity}` : ''}${quantity > 1 ? ` ×${quantity}` : ''}`;
  }).filter(Boolean);
  if (!labels.length) return '';
  const visible = labels.slice(0, 3).join('、');
  return labels.length > 3 ? `${visible} 等 ${labels.length} 项` : visible;
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

ipcMain.handle('meta:get', () => {
  const dirs = ensureAppDirs();
  return {
    baseDir: dirs.baseDir,
    imageDir: dirs.imageDir,
    outputDir: dirs.outputDir,
    templatePath: path.join(__dirname, 'templates', 'contract-template.xlsx'),
    version: getDisplayVersion(dirs.baseDir)
  };
});

ipcMain.handle('release-notes:get-pending', () => getPendingReleaseNotes());

ipcMain.handle('release-notes:ack', (_event, version) => {
  const targetVersion = String(version || getDisplayVersion(ensureAppDirs().baseDir) || app.getVersion());
  writeReleaseNotesState({ lastSeenVersion: targetVersion, acknowledgedAt: new Date().toISOString() });
  return { ok: true, lastSeenVersion: targetVersion };
});

ipcMain.handle('items:list', async (_event, filters = {}) => {
  const dirs = ensureAppDirs();
  const items = (await getDatabase()).listItems(filters);
  return items.map((item) => decorateItemFileStatus(item, dirs.baseDir));
});
ipcMain.handle('items:get', async (_event, id) => {
  const dirs = ensureAppDirs();
  return decorateItemFileStatus((await getDatabase()).getItem(id), dirs.baseDir);
});
ipcMain.handle('items:save', async (_event, item) => {
  const dirs = ensureAppDirs();
  return decorateItemFileStatus((await getDatabase()).saveItem(item), dirs.baseDir);
});
ipcMain.handle('items:delete', async (_event, id) => (await getDatabase()).deleteItem(id));

ipcMain.handle('recent:list', async () => readRecentFiles());
ipcMain.handle('customer-code:resolve', async (_event, customerName) => (
  resolveUniqueCustomerCode(customerName, readCustomerCodeRegistry())
));
ipcMain.handle('recent:open', async (_event, filePath) => {
  if (!filePath || !fs.existsSync(filePath)) throw new Error('文件不存在，可能已被移动或删除。');
  const error = await shell.openPath(filePath);
  if (error) throw new Error(error);
  return true;
});
ipcMain.handle('recent:reveal', async (_event, filePath) => {
  if (!filePath || !fs.existsSync(filePath)) throw new Error('文件不存在，可能已被移动或删除。');
  shell.showItemInFolder(filePath);
  return true;
});

ipcMain.handle('after-sales-video:open', async () => {
  const scriptPath = getAfterSalesVideoScriptPath();
  if (!scriptPath) {
    throw new Error('售后视频库启动失败，请检查网络或视频库服务');
  }

  await runAfterSalesVideoScript(scriptPath);
  return true;
});


ipcMain.handle('update:check', async () => checkLanUpdate());

ipcMain.handle('update:start', async () => {
  const update = await checkLanUpdate();
  if (!update.available) {
    throw new Error(update.message || '当前已经是最新版本。');
  }
  const scriptPath = getLanUpdateScriptPath();
  if (!scriptPath) {
    throw new Error('未找到更新脚本，无法执行局域网更新。');
  }
  await runLanUpdateScript(scriptPath, update.sourcePath);
  app.quit();
  return true;
});

ipcMain.handle('data-refresh:start', async () => {
  await startDataRefresh();
  return true;
});
ipcMain.on('data-refresh:return', (event) => {
  if (refreshWindow && event.sender === refreshWindow.webContents && !refreshBusy) refreshWindow.close();
});

ipcMain.handle('data-refresh:get-result', async () => readDataRefreshResult());

ipcMain.handle('images:pick', async (_event, options = {}) => {
  const dirs = ensureAppDirs();
  const defaultImageDir = resolveImagePickerDir(dirs.imageDir, options);
  const result = await dialog.showOpenDialog(mainWindow, {
    title: '选择产品图片',
    defaultPath: defaultImageDir,
    properties: ['openFile'],
    filters: [
      { name: 'Images', extensions: ['jpg', 'jpeg', 'png', 'webp', 'bmp'] }
    ]
  });
  if (result.canceled || result.filePaths.length === 0) return null;

  const source = result.filePaths[0];
  const relativeExistingImage = getRelativePathIfInside(source, dirs.imageDir);
  if (relativeExistingImage) {
    return path.join('images', relativeExistingImage).replace(/\\/g, '/');
  }

  const fileName = `${Date.now()}-${Math.random().toString(16).slice(2)}.jpg`;
  const target = path.join(defaultImageDir, fileName);
  saveImageThumbnail(source, target);
  const relativeTarget = getRelativePathIfInside(target, dirs.imageDir) || fileName;
  return path.join('images', relativeTarget).replace(/\\/g, '/');
});

ipcMain.handle('inventory:pick-file', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    title: '选择库存表格',
    properties: ['openFile'],
    filters: [
      { name: '库存表格', extensions: ['xlsx', 'xls', 'csv'] },
      { name: '所有文件', extensions: ['*'] }
    ]
  });
  if (result.canceled || result.filePaths.length === 0) return null;
  const filePath = result.filePaths[0];
  return {
    filePath,
    fileName: path.basename(filePath)
  };
});

ipcMain.handle('inventory:preview', async (_event, filePath) => {
  const database = await getDatabase();
  const items = database.listItems({ type: 'equipment' });
  return buildInventoryPreview(filePath, items);
});

ipcMain.handle('inventory:apply', async (_event, filePath) => {
  const database = await getDatabase();
  const items = database.listItems({ type: 'equipment' });
  const preview = buildInventoryPreview(filePath, items);
  const result = database.updateStockQuantities(preview.matched);
  return {
    ...preview,
    updated: result.updated
  };
});

ipcMain.handle('materials:copy', async (_event, relativePath) => copyMaterialFile(relativePath));
ipcMain.handle('materials:attach', async (_event, payload) => attachMaterialFile(payload));
ipcMain.handle('materials:remove', async (_event, payload) => removeMaterialFile(payload));
ipcMain.handle('images:copy-product', async (_event, itemId, imageIndex = 0) => copyProductImage(itemId, imageIndex));
ipcMain.handle('images:add-product', async (_event, itemId) => importProductImages(itemId, 'add'));
ipcMain.handle('images:replace-product', async (_event, itemId, imagePath) => importProductImages(itemId, 'replace', imagePath));
async function importProductImages(itemId, action, imagePath) {
  const id = normalizeItemId(itemId);
  const database = await getDatabase();
  const item = database.getItem(id);
  if (!item) throw new Error('未找到商品。');
  if (action === 'replace' && !productImagePaths(item).includes(imagePath)) throw new Error('图片已变更，请重新打开详情页。');
  const dirs = ensureAppDirs();
  const folder = resolveImagePickerDir(dirs.imageDir, item);
  const result = await dialog.showOpenDialog(mainWindow, {
    title: action === 'add' ? '添加产品实物图' : '替换当前图片', defaultPath: folder,
    properties: action === 'add' ? ['openFile', 'multiSelections'] : ['openFile'],
    filters: [{ name: '图片', extensions: ['jpg', 'jpeg', 'png', 'webp', 'bmp'] }]
  });
  if (result.canceled) return null;
  const imported = [];
  try {
    for (const source of result.filePaths) {
      if (!['.jpg', '.jpeg', '.png', '.webp', '.bmp'].includes(path.extname(source).toLowerCase())) throw new Error('不支持的图片格式。');
      if (nativeImage.createFromPath(source).isEmpty()) throw new Error(`图片读取失败：${path.basename(source)}`);
      const target = path.join(folder, `photo-${Date.now()}-${Math.random().toString(16).slice(2)}${path.extname(source).toLowerCase()}`);
      fs.copyFileSync(source, target);
      imported.push(target);
    }
    const added = imported.map((file) => path.join('images', path.relative(dirs.imageDir, file)).replace(/\\/g, '/'));
    return decorateItemFileStatus(database.updateProductImages(id, action, imagePath, added), dirs.baseDir);
  } catch (error) {
    imported.forEach((file) => fs.rmSync(file, { force: true }));
    throw error;
  }
}
ipcMain.handle('images:remove-product', async (_event, itemId, imagePath) => {
  const database = await getDatabase();
  const id = normalizeItemId(itemId);
  return decorateItemFileStatus(database.updateProductImages(id, 'remove', imagePath), getDataDir());
});

function getWindowIconPath() {
  return path.join(__dirname, 'build', 'icon.ico');
}

function saveImageThumbnail(source, target) {
  fs.mkdirSync(path.dirname(target), { recursive: true });
  const image = nativeImage.createFromPath(source);
  if (image.isEmpty()) {
    fs.copyFileSync(source, target);
    return;
  }

  const { width, height } = image.getSize();
  const maxSide = 1200;
  const scale = Math.min(1, maxSide / Math.max(width, height));
  const resized = scale < 1
    ? image.resize({
      width: Math.max(1, Math.round(width * scale)),
      height: Math.max(1, Math.round(height * scale)),
      quality: 'good'
    })
    : image;

  fs.writeFileSync(target, resized.toJPEG(82));
}

function resolveImagePickerDir(imageDir, options = {}) {
  const target = path.join(imageDir, productImageFolder(options));
  if (isPathInside(target, imageDir)) {
    fs.mkdirSync(target, { recursive: true });
    return target;
  }
  return imageDir;
}

function decorateItemFileStatus(item, baseDir) {
  if (!item) return item;
  const imagePath = String(item.image_path || '').trim();
  const resolvedImagePath = imagePath ? resolveAppFilePath(imagePath, baseDir) : '';
  return {
    ...item,
    product_images: productImagePaths(item).filter((file) => fs.existsSync(resolveAppFilePath(file, baseDir))),
    image_missing: Boolean(imagePath && !fs.existsSync(resolvedImagePath))
  };
}

function resolveAppFilePath(filePath, baseDir) {
  const value = String(filePath || '').trim();
  if (/^[a-zA-Z]:[\\/]/.test(value) || value.startsWith('\\\\') || value.startsWith('/')) return value;
  return path.join(baseDir, value);
}

function getRelativePathIfInside(filePath, parentDir) {
  const relative = path.relative(path.resolve(parentDir), path.resolve(filePath));
  if (!relative || relative.startsWith('..') || path.isAbsolute(relative)) return '';
  return relative;
}

async function copyMaterialFile(relativePath) {
  const filePath = resolveMaterialFilePath(relativePath);
  const extension = path.extname(filePath).toLowerCase();

  if (['.png', '.jpg', '.jpeg', '.webp', '.bmp'].includes(extension)) {
    const image = nativeImage.createFromPath(filePath);
    if (image.isEmpty()) throw new Error('图片读取失败，请检查文件是否损坏。');
    clipboard.writeImage(image);
    return { ok: true, message: '已复制图片。' };
  }

  if (['.pdf', '.doc', '.docx'].includes(extension)) {
    await copyFilePathToClipboard(filePath);
    return { ok: true, message: '已复制文件。' };
  }

  throw new Error(`不支持复制这种资料格式：${extension || '未知格式'}`);
}

async function attachMaterialFile(payload = {}) {
  const itemId = normalizeItemId(payload.itemId);
  const key = String(payload.key || '');
  const definition = getMaterialDefinition(key);
  const database = await getDatabase();
  const item = database.getItem(itemId);
  if (!item) throw new Error('未找到商品，可能已被删除。');

  const currentPath = String(item.documents?.[key] || '').trim();
  const result = await dialog.showOpenDialog(mainWindow, {
    title: `${currentPath ? '替换' : '添加'}${definition.label}`,
    defaultPath: getMaterialPickerDir(currentPath),
    properties: ['openFile'],
    filters: [
      { name: definition.label, extensions: definition.extensions }
    ]
  });
  if (result.canceled || result.filePaths.length === 0) return null;

  const sourcePath = result.filePaths[0];
  validateMaterialExtension(key, sourcePath);
  const relativePath = buildImportedMaterialRelativePath(key, sourcePath);
  const baseDir = getMaterialWriteBase();
  const targetPath = path.join(baseDir, ...relativePath.split('/'));
  if (!isPathInside(targetPath, baseDir)) throw new Error('资料保存路径无效。');

  try {
    fs.mkdirSync(path.dirname(targetPath), { recursive: true });
    fs.copyFileSync(sourcePath, targetPath);
  } catch (error) {
    throw new Error(`资料保存失败：${error.message}`);
  }

  try {
    const updated = database.updateItemDocument(itemId, key, relativePath);
    removeManagedMaterialIfUnused(database, currentPath);
    return decorateItemFileStatus(updated, ensureAppDirs().baseDir);
  } catch (error) {
    if (fs.existsSync(targetPath)) fs.rmSync(targetPath, { force: true });
    throw error;
  }
}

async function removeMaterialFile(payload = {}) {
  const itemId = normalizeItemId(payload.itemId);
  const key = String(payload.key || '');
  getMaterialDefinition(key);
  const database = await getDatabase();
  const item = database.getItem(itemId);
  if (!item) throw new Error('未找到商品，可能已被删除。');

  const currentPath = String(item.documents?.[key] || '').trim();
  if (!currentPath) return decorateItemFileStatus(item, ensureAppDirs().baseDir);
  const updated = database.updateItemDocument(itemId, key, '');
  removeManagedMaterialIfUnused(database, currentPath);
  return decorateItemFileStatus(updated, ensureAppDirs().baseDir);
}

function normalizeItemId(value) {
  const itemId = Number(value);
  if (!Number.isInteger(itemId) || itemId < 1) throw new Error('商品信息无效。');
  return itemId;
}

function getMaterialWriteBase() {
  return app.isPackaged ? process.resourcesPath : __dirname;
}

function getMaterialPickerDir(currentPath) {
  if (currentPath) {
    try {
      return path.dirname(resolveMaterialFilePath(currentPath));
    } catch {
      // Fall through to the general material folder when the old file is missing.
    }
  }
  const baseDir = getMaterialWriteBase();
  const originalDir = path.join(baseDir, 'materials', 'original');
  const materialDir = path.join(baseDir, 'materials');
  return fs.existsSync(originalDir) ? originalDir : materialDir;
}

function removeManagedMaterialIfUnused(database, relativePath) {
  if (!isManagedImportedMaterialPath(relativePath)) return;
  const referenced = database.listItems({}).some((item) => (
    Object.values(item.documents || {}).some((value) => String(value || '') === relativePath)
  ));
  if (referenced) return;

  const baseDir = getMaterialWriteBase();
  const filePath = path.join(baseDir, ...String(relativePath).replace(/\\/g, '/').split('/'));
  if (isPathInside(filePath, baseDir) && fs.existsSync(filePath)) fs.rmSync(filePath, { force: true });
}

async function copyProductImage(itemId, imageIndex = 0) {
  const id = Number(itemId);
  if (!Number.isInteger(id) || id < 1) throw new Error('商品信息无效，无法复制图片。');

  const database = await getDatabase();
  const item = database.getItem(id);
  if (!item) throw new Error('未找到商品，可能已被删除。');

  const images = decorateItemFileStatus(item, getDataDir()).product_images;
  if (!Number.isInteger(imageIndex) || imageIndex < 0 || imageIndex >= images.length) throw new Error('图片不存在，请重新打开详情页。');
  const imagePath = images[imageIndex];
  if (!imagePath) throw new Error('该商品还没有设置图片。');
  const filePath = resolveAppFilePath(imagePath, getDataDir());
  if (!fs.existsSync(filePath)) throw new Error('图片文件不存在，请检查产品图片。');

  const extension = path.extname(filePath).toLowerCase();
  if (!['.png', '.jpg', '.jpeg', '.webp', '.bmp'].includes(extension)) {
    throw new Error(`不支持复制这种图片格式：${extension || '未知格式'}`);
  }

  const image = nativeImage.createFromPath(filePath);
  if (image.isEmpty()) throw new Error('图片读取失败，请检查文件是否损坏。');
  clipboard.writeImage(image);
  return { ok: true, message: '产品图片已复制。' };
}

function resolveMaterialFilePath(relativePath) {
  const safeRelative = normalizeMaterialRelativePath(relativePath);
  const bases = app.isPackaged
    ? [process.resourcesPath, getDataDir(), path.dirname(app.getPath('exe'))]
    : [path.join(__dirname, 'public'), __dirname];

  for (const base of bases.filter(Boolean)) {
    const candidate = path.join(base, safeRelative);
    if (!isPathInside(candidate, base)) continue;
    if (fs.existsSync(candidate)) return candidate;
  }

  throw new Error(`文件不存在：${safeRelative}`);
}

function normalizeMaterialRelativePath(relativePath) {
  const value = String(relativePath || '').trim().replace(/^[/\\]+/, '');
  if (!value) throw new Error('资料路径为空。');
  if (/^[a-zA-Z]:[\\/]/.test(value) || value.startsWith('\\\\')) {
    throw new Error('资料路径必须是相对路径。');
  }
  const normalized = path.normalize(value);
  if (normalized.split(/[\\/]+/).includes('..')) {
    throw new Error('资料路径不能包含上级目录。');
  }
  if (!normalized.toLowerCase().startsWith(`materials${path.sep}`) && normalized.toLowerCase() !== 'materials') {
    throw new Error('资料必须放在 materials 目录下。');
  }
  return normalized;
}

function isPathInside(child, parent) {
  const relative = path.relative(path.resolve(parent), path.resolve(child));
  return Boolean(relative) && !relative.startsWith('..') && !path.isAbsolute(relative);
}

function copyFilePathToClipboard(filePath) {
  return new Promise((resolve, reject) => {
    execFile(getPowerShellExePath(), [
      '-NoProfile',
      '-STA',
      '-ExecutionPolicy',
      'Bypass',
      '-Command',
      '& { param($p) Set-Clipboard -LiteralPath $p }',
      filePath
    ], { windowsHide: true }, (error) => {
      if (error) {
        reject(new Error(`复制失败：${error.message}`));
        return;
      }
      resolve(true);
    });
  });
}

function getPowerShellExePath() {
  const systemRoot = process.env.SystemRoot || process.env.windir || 'C:\\Windows';
  return path.join(systemRoot, 'System32', 'WindowsPowerShell', 'v1.0', 'powershell.exe');
}

function getAfterSalesVideoScriptPath() {
  const candidates = [
    path.join(getDataDir(), 'tools', AFTER_SALES_VIDEO.scriptName),
    path.join(process.resourcesPath || '', 'tools', AFTER_SALES_VIDEO.scriptName),
    path.join(__dirname, 'tools', AFTER_SALES_VIDEO.scriptName),
    AFTER_SALES_VIDEO.fallbackScriptPath
  ];
  return candidates.find((candidate) => candidate && fs.existsSync(candidate)) || '';
}

function getLanUpdateScriptPath() {
  const candidates = [
    path.join(getDataDir(), 'tools', LAN_UPDATE.scriptName),
    path.join(process.resourcesPath || '', 'tools', LAN_UPDATE.scriptName),
    path.join(__dirname, 'tools', LAN_UPDATE.scriptName)
  ];
  return candidates.find((candidate) => candidate && fs.existsSync(candidate)) || '';
}

function readDataRefreshResult() {
  const filePath = path.join(ensureAppDirs().localDataDir, 'data-refresh-result.txt');
  if (!fs.existsSync(filePath)) return null;
  try {
    const [status, detail = '', code = ''] = fs.readFileSync(filePath, 'utf8').trim().split('|');
    fs.rmSync(filePath, { force: true });
    return { ok: status === 'OK', detail, code };
  } catch {
    return { ok: false, detail: 'result-unreadable', code: '' };
  }
}

function getLanUpdateSourcePath() {
  const configPath = getLanUpdateSourceConfigPath();
  return (configPath ? readFirstLineIfExists(configPath) : '') || LAN_UPDATE.defaultSourcePath;
}

function getLanUpdateSourceConfigPath() {
  const candidates = [
    path.join(getDataDir(), LAN_UPDATE.sourceConfigName),
    path.join(process.resourcesPath || '', LAN_UPDATE.sourceConfigName),
    path.join(__dirname, LAN_UPDATE.sourceConfigName)
  ];
  return candidates.find((candidate) => candidate && fs.existsSync(candidate)) || '';
}

function readFirstLineIfExists(filePath) {
  try {
    if (!filePath || !fs.existsSync(filePath)) return '';
    return fs.readFileSync(filePath, 'utf8').split(/\r?\n/).map((line) => line.trim()).find((line) => line && !line.startsWith('#')) || '';
  } catch {
    return '';
  }
}

async function checkLanUpdate() {
  if (refreshBusy) return { available: false, message: '正在刷新资料，请稍后检查更新。' };
  const targetDir = getDataDir();
  const sourcePath = getLanUpdateSourcePath();
  const localVersionFile = path.join(targetDir, LAN_UPDATE.versionFileName);
  const currentVersion = readVersionFile(localVersionFile);
  if (!currentVersion) {
    return { available: false, currentVersion: '', latestVersion: '', sourcePath, message: '本地版本文件缺失，无法检查当前版本。' };
  }
  if (!sourcePath) {
    return { available: false, currentVersion, latestVersion: '', sourcePath: '', message: '未找到 update-source.txt，请先配置更新源路径。' };
  }
  await connectLanUpdateShare(sourcePath);
  if (!fs.existsSync(sourcePath)) {
    return { available: false, currentVersion, latestVersion: '', sourcePath, message: buildUpdateSourceAccessMessage(sourcePath) };
  }

  const remoteVersionFile = path.join(sourcePath, LAN_UPDATE.versionFileName);
  if (!fs.existsSync(remoteVersionFile)) {
    return { available: false, currentVersion, latestVersion: '', sourcePath, message: '更新源缺少 release-version.json，无法检查版本。' };
  }

  const latestVersion = readVersionFile(remoteVersionFile);
  if (!latestVersion) {
    return { available: false, currentVersion, latestVersion: '', sourcePath, message: '更新源缺少 release-version.json，无法检查版本。' };
  }

  const available = compareVersions(latestVersion, currentVersion) > 0;
  return {
    available,
    currentVersion,
    latestVersion,
    sourcePath,
    message: available ? `发现新版本 ${latestVersion}` : '当前已经是最新版本。'
  };
}

function readVersionFile(versionFile) {
  try {
    if (fs.existsSync(versionFile)) {
      const data = JSON.parse(fs.readFileSync(versionFile, 'utf8'));
      if (data && data.version) return String(data.version);
    }
  } catch {
    // Invalid or unreadable version file.
  }
  return '';
}

function getDisplayVersion(baseDir) {
  return readVersionFile(path.join(baseDir, LAN_UPDATE.versionFileName)) || app.getVersion();
}

function getReleaseNotesStatePath() {
  return path.join(ensureAppDirs().localDataDir, LAN_UPDATE.releaseNotesStateName);
}

function readReleaseNotesState() {
  const filePath = getReleaseNotesStatePath();
  try {
    if (!fs.existsSync(filePath)) return {};
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    return data && typeof data === 'object' && !Array.isArray(data) ? data : {};
  } catch {
    return {};
  }
}

function writeReleaseNotesState(state) {
  const filePath = getReleaseNotesStatePath();
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(state, null, 2), 'utf8');
}

function getReleaseNotesPath(baseDir) {
  const candidates = [
    path.join(baseDir, LAN_UPDATE.releaseNotesName),
    path.join(process.resourcesPath || '', LAN_UPDATE.releaseNotesName),
    path.join(__dirname, LAN_UPDATE.releaseNotesName)
  ];
  return candidates.find((candidate) => candidate && fs.existsSync(candidate)) || '';
}

function readReleaseNotes(baseDir) {
  const notesPath = getReleaseNotesPath(baseDir);
  try {
    if (!notesPath) return [];
    const data = JSON.parse(fs.readFileSync(notesPath, 'utf8'));
    const releases = Array.isArray(data) ? data : data.releases;
    return Array.isArray(releases)
      ? releases
        .filter((item) => item && item.version && Array.isArray(item.items))
        .map((item) => ({
          version: String(item.version),
          date: item.date ? String(item.date) : '',
          title: item.title ? String(item.title) : '',
          items: item.items.map((entry) => String(entry)).filter(Boolean)
        }))
      : [];
  } catch {
    return [];
  }
}

function getPendingReleaseNotes() {
  const dirs = ensureAppDirs();
  const currentVersion = getDisplayVersion(dirs.baseDir);
  const state = readReleaseNotesState();
  const lastSeenVersion = String(state.lastSeenVersion || '');
  const notes = readReleaseNotes(dirs.baseDir)
    .filter((item) => compareVersions(item.version, currentVersion) <= 0)
    .filter((item) => !lastSeenVersion || compareVersions(item.version, lastSeenVersion) > 0)
    .sort((a, b) => compareVersions(b.version, a.version));

  return {
    currentVersion,
    lastSeenVersion,
    shouldShow: notes.length > 0,
    notes: lastSeenVersion ? notes : notes.slice(0, 5)
  };
}

function compareVersions(left, right) {
  const a = String(left || '').split('.').map((item) => Number(item) || 0);
  const b = String(right || '').split('.').map((item) => Number(item) || 0);
  const length = Math.max(a.length, b.length);
  for (let index = 0; index < length; index += 1) {
    const diff = (a[index] || 0) - (b[index] || 0);
    if (diff) return diff;
  }
  return 0;
}

function runAfterSalesVideoScript(scriptPath) {
  return new Promise((resolve, reject) => {
    execFile('wscript.exe', [scriptPath], { windowsHide: true }, (error) => {
      if (error) {
        reject(new Error('售后视频库启动失败，请检查网络或视频库服务'));
        return;
      }
      resolve(true);
    });
  });
}

async function runLanUpdateScript(scriptPath, sourcePath) {
  const targetDir = getDataDir();
  if (!sourcePath) {
    throw new Error('更新源路径为空。');
  }
  await connectLanUpdateShare(sourcePath);
  if (!fs.existsSync(sourcePath)) {
    throw new Error(buildUpdateSourceAccessMessage(sourcePath));
  }
  if (!fs.existsSync(scriptPath)) {
    throw new Error(`未找到 update.bat：${scriptPath}`);
  }

  return new Promise((resolve, reject) => {
    const cmdPath = getCmdExePath();
    const exePath = process.execPath;
    const appPid = String(process.pid);
    const command = `call "${scriptPath}" "${sourcePath}" "${targetDir}" "${exePath}" "${appPid}"`;
    const child = spawn(cmdPath, ['/d', '/c', command], {
      cwd: targetDir,
      detached: true,
      stdio: 'ignore',
      windowsHide: true,
      windowsVerbatimArguments: true
    });

    child.once('error', (error) => {
      reject(new Error(`启动更新器失败：${error.message}`));
    });
    child.once('spawn', () => {
      child.unref();
      setTimeout(() => resolve(true), 800);
    });
  });
}

async function startDataRefresh() {
  if (refreshWindow) { refreshWindow.focus(); return; }
  const source = getLanUpdateSourcePath();
  if (!source) throw new Error('资料源路径为空。');
  const target = getDataDir();
  let succeeded = false;
  let applied = false;
  let recoveryRequired = false;
  refreshBusy = true;
  const progress = new BrowserWindow({
    width: 660, height: 440, resizable: false, maximizable: false,
    title: '刷新产品资料', icon: getWindowIconPath(), autoHideMenuBar: true,
    webPreferences: { preload: path.join(__dirname, 'src/renderer/data-refresh-preload.js'), contextIsolation: true, nodeIntegration: false }
  });
  refreshWindow = progress;
  progress.on('close', (event) => { if (refreshBusy) event.preventDefault(); });
  progress.on('closed', () => {
    refreshWindow = null;
    if (!succeeded) {
      if (recoveryRequired) app.quit();
      else if (!mainWindow || mainWindow.isDestroyed()) createWindow();
    }
  });
  try { await progress.loadFile(path.join(__dirname, 'src/renderer/data-refresh.html')); }
  catch (error) { refreshBusy = false; progress.destroy(); throw error; }
  mainWindow.close();
  const report = (state) => { if (!progress.isDestroyed()) progress.webContents.send('data-refresh:progress', state); };
  (async () => {
    try {
      report({ step: 0, detail: '正在建立局域网连接…' });
      await connectLanUpdateShare(source);
      await refreshData(source, target, report);
      applied = true;
      await fs.promises.writeFile(path.join(target, 'local-data/data-refresh-result.txt'), 'OK|', 'utf8').catch(() => {});
      report({ step: 6, current: 1, total: 1, detail: '最新数据库、库存、图片和资料已就绪' });
      await new Promise((resolve) => setTimeout(resolve, 800));
      succeeded = true;
      refreshBusy = false;
      app.relaunch();
      app.quit();
    } catch (error) {
      refreshBusy = false;
      recoveryRequired = Boolean(error.recoveryRequired || applied);
      progress.setSize(660, 560);
      report({ error: applied ? '资料已更新，但自动重启失败，请关闭后重新打开软件。' : error.message || '资料刷新失败，请检查共享连接。', recoveryRequired });
    }
  })();
}

async function connectLanUpdateShare(sourcePath) {
  const shareRoot = getUncShareRoot(sourcePath);
  if (!shareRoot || !LAN_UPDATE.shareUser || !LAN_UPDATE.sharePass) return;
  const run = (args) => new Promise((resolve) => execFile('net.exe', args, { windowsHide: true }, () => resolve()));
  // Serialize authentication so a background version check cannot disconnect an active refresh.
  lanConnection = lanConnection.then(async () => {
    await run(['use', shareRoot, '/delete', '/y']);
    await run(['use', shareRoot, LAN_UPDATE.sharePass, `/user:${LAN_UPDATE.shareUser}`, '/persistent:yes']);
  });
  await lanConnection;
}

function getUncShareRoot(sourcePath) {
  const match = String(sourcePath || '').match(/^(\\\\[^\\]+\\[^\\]+)/);
  return match ? match[1] : '';
}

function execFileSyncHidden(file, args) {
  const { execFileSync } = require('child_process');
  execFileSync(file, args, { windowsHide: true, stdio: 'ignore' });
}

function buildUpdateSourceAccessMessage(sourcePath) {
  return [
    '无法访问更新源。',
    `更新源：${sourcePath}`,
    '请先在这台电脑的资源管理器地址栏打开上面的路径。',
    '如果资源管理器也打不开，请检查：更新源电脑是否开机、两台电脑是否在同一网络、网络发现和文件共享是否开启、防火墙是否允许文件和打印机共享、电脑名 PC-202502211303 是否能被同事电脑解析。'
  ].join('\n');
}

function getCmdExePath() {
  const systemRoot = process.env.SystemRoot || process.env.windir || 'C:\\Windows';
  const cmdPath = path.join(systemRoot, 'System32', 'cmd.exe');
  return fs.existsSync(cmdPath) ? cmdPath : 'cmd.exe';
}

ipcMain.handle('contract:create', async (_event, payload) => {
  const dirs = ensureAppDirs();
  assertCustomerCodeAvailable(payload.customerName, payload.customerCode);
  const templatePath = getContractTemplatePath(payload.invoiceType);
  if (!fs.existsSync(templatePath)) {
    throw new Error('未找到合同模板，请确认 templates 目录下的合同模板存在。');
  }

  const outputPath = buildUniqueOutputPath(dirs.contractOutputDir, buildContractFileName(payload), '.xlsx');

  await createContractFromTemplate({
    templatePath,
    outputPath,
    payload
  });


  addRecentFile({
    type: '合同',
    customerName: payload.customerName,
    filePath: outputPath
  });
  rememberCustomerCode(payload.customerName, payload.customerCode);
  return outputPath;
});

ipcMain.handle('quote:create', async (_event, payload) => {
  const dirs = ensureAppDirs();
  const isEnglishQuote = payload.language === 'en';
  const templatePath = getQuoteTemplatePath(isEnglishQuote);
  if (!fs.existsSync(templatePath)) {
    throw new Error(`未找到报价单模板，请确认 templates/${path.basename(templatePath)} 存在。`);
  }

  const outputPath = buildUniqueOutputPath(
    dirs.quoteOutputDir,
    `${formatFileDate(new Date())}-${isEnglishQuote ? 'Quotation' : '报价单'}`,
    '.xlsx'
  );

  await createQuoteFromTemplate({
    templatePath,
    outputPath,
    payload: {
      ...payload,
      baseDir: dirs.baseDir
    }
  });


  addRecentFile({
    type: isEnglishQuote ? '英文报价单' : '报价单',
    customerName: payload.customerName,
    itemSummary: buildRecentItemSummary(payload.items),
    filePath: outputPath
  });
  return outputPath;
});

function getQuoteTemplatePath(isEnglishQuote) {
  const fileName = isEnglishQuote ? 'quote-template （English）.xlsx' : 'quote-template.xlsx';
  return path.join(__dirname, 'templates', fileName);
}

async function createContractFromTemplate(options) {
  const { createContract } = require('./src/main/contractExporter');
  return createContract(options);
}

async function createQuoteFromTemplate(options) {
  const { createQuote } = require('./src/main/quoteExporter');
  return createQuote(options);
}

ipcMain.on('context-menu:input', () => {
  const template = [
    { role: 'undo', label: '撤销' },
    { role: 'redo', label: '重做' },
    { type: 'separator' },
    { role: 'cut', label: '剪切' },
    { role: 'copy', label: '复制' },
    { role: 'paste', label: '粘贴' },
    { role: 'selectAll', label: '全选' }
  ];
  Menu.buildFromTemplate(template).popup({ window: mainWindow });
});

function buildContractFileName(payload) {
  const date = parseDate(payload.contractDate) || new Date();
  const company = sanitizeFileName(payload.customerName || '合同');
  return `${formatFileDate(date)}-${company}（${invoiceTypeText(payload.invoiceType)}）`;
}

function getContractTemplatePath(invoiceType) {
  const fileName = contractTemplateOption(invoiceType).fileName;
  return path.join(__dirname, 'templates', fileName);
}

function invoiceTypeText(invoiceType) {
  return contractTemplateOption(invoiceType).label;
}

function contractTemplateOption(invoiceType) {
  return CONTRACT_TEMPLATE_OPTIONS[invoiceType] || CONTRACT_TEMPLATE_OPTIONS.special_food_machinery;
}

function parseDate(value) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatFileDate(date) {
  const year = String(date.getFullYear()).slice(-2);
  return `${year}.${date.getMonth() + 1}.${date.getDate()}`;
}

function buildUniqueOutputPath(dir, baseName, ext) {
  const cleanBaseName = sanitizeFileName(baseName);
  let candidate = path.join(dir, `${cleanBaseName}${ext}`);
  let index = 1;
  while (fs.existsSync(candidate)) {
    candidate = path.join(dir, `${cleanBaseName}（${index}）${ext}`);
    index += 1;
  }
  return candidate;
}

function sanitizeFileName(value) {
  return String(value)
    .replace(/[\\/:*?"<>|]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 80) || '未命名';
}
