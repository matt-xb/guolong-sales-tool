const fs = require('fs/promises');
const path = require('path');
const initSqlJs = require('sql.js');

async function exists(file) {
  try { await fs.lstat(file); return true; }
  catch (error) { if (error.code === 'ENOENT') return false; throw error; }
}

async function validateDatabase(file) {
  const bytes = await fs.readFile(file);
  if (!bytes.subarray(0, 16).equals(Buffer.from('SQLite format 3\0'))) throw new Error('下载的数据库格式无效。');
  const SQL = await initSqlJs();
  const db = new SQL.Database(bytes);
  try {
    if (db.exec('PRAGMA quick_check')[0]?.values[0]?.[0] !== 'ok') throw new Error('下载的数据库完整性校验失败。');
    if (!(db.exec('SELECT COUNT(*) FROM items')[0]?.values[0]?.[0] > 0)) throw new Error('下载的数据库没有产品数据。');
  } finally { db.close(); }
}

async function copyTree(source, target, step, report) {
  const files = [];
  const directories = [''];
  async function scan(relative) {
    const dir = path.join(source, relative);
    if ((await fs.lstat(dir)).isSymbolicLink()) throw new Error('资料目录包含链接，已停止刷新。');
    for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
      const next = path.join(relative, entry.name);
      if (entry.isSymbolicLink()) throw new Error('资料目录包含链接，已停止刷新。');
      if (entry.isDirectory()) { directories.push(next); await scan(next); }
      else if (entry.isFile()) files.push(next);
      else throw new Error('资料目录包含不支持的文件类型。');
    }
  }
  report({ step, detail: '正在统计文件…' });
  await scan('');
  for (const directory of directories) await fs.mkdir(path.join(target, directory), { recursive: true });
  for (let i = 0; i < files.length; i++) {
    report({ step, current: i, total: files.length, detail: path.basename(files[i]) });
    await fs.copyFile(path.join(source, files[i]), path.join(target, files[i]));
    report({ step, current: i + 1, total: files.length, detail: path.basename(files[i]) });
  }
  if (!files.length) report({ step, current: 1, total: 1, detail: '目录为空，无需复制文件' });
}

async function refreshData(source, target, report = () => {}) {
  source = path.resolve(source);
  target = path.resolve(target);
  const overlap = (parent, child) => {
    const relative = path.relative(parent, child);
    return !relative || (!relative.startsWith(`..${path.sep}`) && relative !== '..' && !path.isAbsolute(relative));
  };
  if (overlap(source, target) || overlap(target, source)) throw new Error('资料源与本机目录不能相同或互相包含。');
  try { await fs.access(source); }
  catch { throw new Error('无法访问资料共享目录，请检查网络连接和共享账号权限。本机原有数据未更改。'); }
  await fs.access(target);
  for (const directory of [target, path.join(target, 'resources')]) {
    if (await exists(directory) && (await fs.lstat(directory)).isSymbolicLink()) throw new Error('本机资料目录不能是链接。');
  }
  const local = path.join(target, 'local-data');
  await fs.mkdir(local, { recursive: true });
  if ((await fs.lstat(local)).isSymbolicLink()) throw new Error('本机数据目录不能是链接。');
  const stage = await fs.mkdtemp(path.join(local, 'refresh-stage-'));
  let backup;
  const swapped = [];
  let recoveryRequired = false;
  try {
    report({ step: 1, detail: '正在下载最新产品和库存数据…' });
    await fs.copyFile(path.join(source, 'sales.sqlite'), path.join(stage, 'sales.sqlite'));
    await copyTree(path.join(source, 'images'), path.join(stage, 'images'), 2, report);
    const hasMaterials = await exists(path.join(source, 'resources', 'materials'));
    if (hasMaterials) await copyTree(path.join(source, 'resources', 'materials'), path.join(stage, 'materials'), 3, report);
    else report({ step: 3, detail: '共享目录未提供资料文件，保留本机现有资料' });
    report({ step: 4, detail: '正在检查数据库完整性与产品数据…' });
    await validateDatabase(path.join(stage, 'sales.sqlite'));
    // Rename on the same volume; every old directory remains available until the whole swap succeeds.
    backup = await fs.mkdtemp(path.join(local, 'data-refresh-backup-'));
    const entries = [['images', 'images'], ...(hasMaterials ? [['materials', 'resources/materials']] : []), ['sales.sqlite', 'sales.sqlite']];
    report({ step: 5, detail: '正在应用已校验的资料…' });
    for (const [name, relative] of entries) {
      const destination = path.join(target, relative);
      await fs.mkdir(path.dirname(destination), { recursive: true });
      if (await exists(destination) && (await fs.lstat(destination)).isSymbolicLink()) throw new Error('本机资料目录不能是链接。');
      const entry = { destination, old: path.join(backup, name), installed: false, saved: false };
      swapped.push(entry);
      if (await exists(destination)) { await fs.rename(destination, entry.old); entry.saved = true; }
      await fs.rename(path.join(stage, name), destination);
      entry.installed = true;
    }
  } catch (error) {
    const reasons = { ENOENT: '共享目录或资料文件不存在，请检查网络及共享目录。', EACCES: '没有权限访问或替换资料，请检查共享权限及文件是否被占用。', EPERM: '资料文件被占用或访问受限，请关闭相关文件后重试。', ENOSPC: '本机磁盘空间不足，请清理空间后重试。' };
    if (reasons[error.code]) error.message = reasons[error.code];
    for (const entry of swapped.reverse()) {
      try {
        if (entry.installed) await fs.rm(entry.destination, { recursive: true, force: true });
        if (entry.saved) await fs.rename(entry.old, entry.destination);
      } catch { recoveryRequired = true; }
    }
    error.recoveryRequired = recoveryRequired;
    error.message = recoveryRequired
      ? `${error.message}\n部分资料恢复失败，原始备份保留在：${backup}。请勿继续编辑产品。`
      : `${error.message}\n本机原有数据已保留。`;
    throw error;
  } finally {
    await fs.rm(stage, { recursive: true, force: true }).catch(() => {});
    // Never delete the backup if restoring an original file failed.
    if (backup && !recoveryRequired) await fs.rm(backup, { recursive: true, force: true }).catch(() => {});
  }
}

module.exports = { refreshData, validateDatabase };
