const fs = require('fs/promises');
const nativeFs = require('fs');
const path = require('path');
const { createHash } = require('crypto');

const MANIFEST = 'sync-manifest.json';
function protectedPath(relative) {
  const parts = relative.replace(/\\/g, '/').toLowerCase().split('/');
  return ['outputs', 'local-data', 'backups', 'db-backups'].includes(parts[0]) ||
    parts.some(p => ['.git', '.codex', '.agents'].includes(p) || p === '.env' || p.startsWith('.env.')) ||
    ['recent-files.json', 'update-source.txt', 'debug.log'].includes(parts.at(-1)) || parts[0].startsWith(MANIFEST);
}
function safeRelative(relative) {
  if (typeof relative !== 'string' || !relative || relative.includes('\\') || relative.split('/').some(p =>
    !p || p === '.' || p === '..' || /[<>:"|?*\x00-\x1f]/.test(p) || /[. ]$/.test(p) || /^(con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\.|$)/i.test(p)) || protectedPath(relative)) {
    throw new Error('更新清单包含不允许的文件路径。');
  }
  return relative;
}
async function regularPath(root, relative) {
  if ((await fs.lstat(root)).isSymbolicLink()) throw new Error('同步根目录不能是链接。');
  let file = root;
  for (const segment of relative.split('/')) {
    file = path.join(file, segment);
    try { if ((await fs.lstat(file)).isSymbolicLink()) throw new Error('同步目录包含链接，已停止更新。'); }
    catch (error) { if (error.code === 'ENOENT') return false; throw error; }
  }
  return (await fs.stat(file)).isFile();
}
async function digest(file) {
  const hash = createHash('sha256');
  for await (const chunk of nativeFs.createReadStream(file)) hash.update(chunk);
  return hash.digest('hex');
}
async function scanPaths(root) {
  if ((await fs.lstat(root)).isSymbolicLink()) throw new Error('同步根目录不能是链接。');
  const files = [], directories = [];
  async function scan(relative) {
    for (const entry of await fs.readdir(path.join(root, relative), { withFileTypes: true })) {
      const next = relative ? `${relative}/${entry.name}` : entry.name;
      if (protectedPath(next)) continue;
      safeRelative(next);
      if (entry.isSymbolicLink()) throw new Error('同步目录包含链接。');
      if (entry.isDirectory()) { directories.push(next); await scan(next); }
      else if (entry.isFile()) {
        files.push(next);
      } else throw new Error('同步目录包含不支持的文件类型。');
    }
  }
  await scan('');
  return { directories: directories.sort(), files: files.sort() };
}
async function buildManifest(root, previous) {
  const tree = await scanPaths(root), files = [];
  const cache = new Map((previous?.files || []).map(f => [f.path, f]));
  for (const relative of tree.files) {
    const file = path.join(root, relative), before = await fs.stat(file);
    const old = cache.get(relative);
    const sha256 = old && old.size === before.size && old.mtimeMs === before.mtimeMs && old.ctimeMs === before.ctimeMs ? old.sha256 : await digest(file);
    const after = await fs.stat(file);
    if (before.size !== after.size || before.mtimeMs !== after.mtimeMs || before.ctimeMs !== after.ctimeMs) throw new Error('源文件正在修改，请稍后重试。');
    files.push({ path: relative, size: after.size, mtimeMs: after.mtimeMs, ctimeMs: after.ctimeMs, sha256 });
  }
  return { schema: 1, directories: tree.directories, files };
}
function validateManifest(manifest) {
  if (manifest?.schema !== 1 || !Array.isArray(manifest.files) || !Array.isArray(manifest.directories)) throw new Error('更新清单格式无效。');
  const seen = new Set();
  for (const entry of [...manifest.directories.map(p => ({ path: p })), ...manifest.files]) {
    const relative = safeRelative(entry.path), key = relative.toLowerCase();
    if (seen.has(key)) throw new Error('更新清单存在重复路径。');
    seen.add(key);
  }
  const files = new Set(manifest.files.map(f => f.path.toLowerCase()));
  for (const p of seen) {
    const parts = p.split('/');
    while (parts.pop(), parts.length) if (files.has(parts.join('/'))) throw new Error('更新清单的文件与目录冲突。');
  }
  for (const file of manifest.files) if (!Number.isSafeInteger(file.size) || file.size < 0 || !Number.isFinite(file.mtimeMs) || !Number.isFinite(file.ctimeMs) || !/^[a-f0-9]{64}$/.test(file.sha256)) throw new Error('更新清单校验值无效。');
  return manifest;
}
async function publishManifest(root) {
  let previous;
  try { previous = await readManifest(root); } catch { /* Rebuild a damaged local cache; remote readers still reject it. */ }
  const manifest = await buildManifest(root, previous);
  const file = path.join(root, MANIFEST), next = `${file}.tmp`;
  await fs.writeFile(next, JSON.stringify(manifest));
  await fs.rename(next, file);
  return manifest;
}
async function readManifest(source) {
  try { return validateManifest(JSON.parse(await fs.readFile(path.join(source, MANIFEST), 'utf8'))); }
  catch (error) { if (error.code === 'ENOENT') return null; throw error; }
}
function startManifestPublisher(root, onError = () => {}) {
  let timer, running = false, pending = false, closed = false;
  async function publish() {
    if (closed) return;
    if (running) { pending = true; return; }
    running = true;
    try { await publishManifest(root); } catch (error) { onError(error); }
    finally { running = false; if (pending && !closed) { pending = false; schedule(); } }
  }
  function schedule() { clearTimeout(timer); timer = setTimeout(publish, 1000); timer.unref(); }
  const watcher = nativeFs.watch(root, { recursive: true }, (_event, file) => { if (!file || !protectedPath(String(file))) schedule(); });
  watcher.on('error', onError);
  schedule();
  return () => { closed = true; clearTimeout(timer); watcher.close(); };
}
// Unchanged files are read from local disk; only changed bytes cross the share.
async function stageFiles(source, target, stage, manifest, report = () => {}, stepFor = () => 1, copyReused = true) {
  const stats = { downloaded: 0, downloadedBytes: 0, reused: 0 };
  const changed = [];
  const ordered = [...manifest.files].sort((a, b) => stepFor(a.path) - stepFor(b.path) || a.path.localeCompare(b.path));
  if (copyReused) for (const directory of manifest.directories) await fs.mkdir(path.join(stage, directory), { recursive: true });
  for (let i = 0; i < manifest.files.length; i++) {
    const entry = ordered[i], relative = entry.path;
    const local = path.join(target, relative), remote = path.join(source, relative), destination = path.join(stage, relative);
    if (!await regularPath(source, relative)) throw new Error('共享文件不存在或已被替换，请稍后重试。');
    const remoteInfo = await fs.stat(remote);
    if (remoteInfo.size !== entry.size || remoteInfo.mtimeMs !== entry.mtimeMs || remoteInfo.ctimeMs !== entry.ctimeMs) throw new Error('文件内容与清单不一致，共享资料可能正在更新，请稍后重试。');
    let reuse = false;
    if (await regularPath(target, relative)) reuse = (await fs.stat(local)).size === entry.size && await digest(local) === entry.sha256;
    report({ step: stepFor(relative), current: i, total: manifest.files.length, detail: `${reuse ? '本机复用' : '下载'}：${path.basename(relative)}`, ...stats });
    if (!reuse || copyReused) {
      await fs.mkdir(path.dirname(destination), { recursive: true });
      await fs.copyFile(reuse ? local : remote, destination);
      if ((await fs.stat(destination)).size !== entry.size || await digest(destination) !== entry.sha256) throw new Error('文件内容与清单不一致，共享资料可能正在更新，请稍后重试。');
    }
    if (reuse) stats.reused++; else { stats.downloaded++; stats.downloadedBytes += entry.size; changed.push(entry); }
    report({ step: stepFor(relative), current: i + 1, total: manifest.files.length, detail: `${reuse ? '已复用' : '已下载'}：${path.basename(relative)}`, ...stats });
  }
  return { ...stats, changed };
}
module.exports = { MANIFEST, protectedPath, safeRelative, regularPath, digest, scanPaths, buildManifest, validateManifest, readManifest, publishManifest, startManifestPublisher, stageFiles };
