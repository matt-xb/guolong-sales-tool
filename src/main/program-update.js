const fs = require('fs/promises');
const path = require('path');
const { readManifest, scanPaths, stageFiles, regularPath } = require('./sync-manifest');
const { validateDatabase } = require('./data-refresh');

async function prepareProgramUpdate(source, target, exePath, pid, report = () => {}) {
  source = path.resolve(source); target = path.resolve(target);
  for (const [a, b] of [[source, target], [target, source]]) {
    const relative = path.relative(a, b);
    if (!relative || !relative.startsWith(`..${path.sep}`) && relative !== '..' && !path.isAbsolute(relative)) throw new Error('更新源与本机目录不能相同或互相包含。');
  }
  const manifest = await readManifest(source);
  if (!manifest) throw new Error('共享源尚未生成增量更新清单，请先在发布电脑打开新版软件。');
  const names = new Set(manifest.files.map(f => f.path.toLowerCase()));
  const exe = path.basename(exePath);
  if (path.resolve(exePath) !== path.join(target, exe) || !names.has(exe.toLowerCase()) || !names.has('release-version.json') || !names.has('resources/app/package.json')) throw new Error('更新源不是完整的兼容程序目录。');
  if ((await fs.lstat(target)).isSymbolicLink()) throw new Error('本机程序目录不能是链接。');
  await fs.mkdir(path.join(target, 'local-data'), { recursive: true });
  if ((await fs.lstat(path.join(target, 'local-data'))).isSymbolicLink()) throw new Error('本机数据目录不能是链接。');
  const jobDir = await fs.mkdtemp(path.join(target, 'local-data/program-update-'));
  const stage = path.join(jobDir, 'stage');
  try {
    const stats = await stageFiles(source, target, stage, manifest, report, p => p === 'sales.sqlite' ? 1 : p.startsWith('images/') ? 2 : p.startsWith('resources/materials/') ? 3 : 1, false);
    const changed = new Set(stats.changed.map(f => f.path));
    const verifiedFile = p => path.join(changed.has(p) ? stage : target, p);
    report({ step: 4, detail: '正在校验程序版本与数据库…' });
    const release = JSON.parse(await fs.readFile(verifiedFile('release-version.json'), 'utf8'));
    const pkg = JSON.parse(await fs.readFile(verifiedFile('resources/app/package.json'), 'utf8'));
    const current = JSON.parse(await fs.readFile(path.join(source, 'release-version.json'), 'utf8'));
    if (!release.version || release.version !== pkg.version || release.version !== current.version) throw new Error('更新程序的版本信息不一致或发布源正在变化。');
    if (names.has('sales.sqlite')) await validateDatabase(verifiedFile('sales.sqlite'), true);
    const local = await scanPaths(target);
    const job = {
      target, stage, exePath, pid, version: release.version,
      files: stats.changed,
      deletes: local.files.filter(p => !names.has(p.toLowerCase())),
      directories: manifest.directories,
      emptyDirectories: local.directories.filter(p => !manifest.directories.includes(p)),
      restart: true
    };
    for (const p of job.deletes) await regularPath(target, p);
    await fs.copyFile(path.join(__dirname, 'apply-program-update.ps1'), path.join(jobDir, 'apply.ps1'));
    await fs.writeFile(path.join(jobDir, 'job.json'), JSON.stringify(job));
    return { jobDir, ...stats };
  } catch (error) { await fs.rm(jobDir, { recursive: true, force: true }); throw error; }
}
module.exports = { prepareProgramUpdate };
