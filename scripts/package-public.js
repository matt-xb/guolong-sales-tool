const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const root = path.resolve(__dirname, '..');
const version = require('../package.json').version;
const output = path.join(root, 'dist', `guolong-sales-tool-v${version}-windows-x64`);
if (fs.existsSync(output)) throw new Error(`Output already exists: ${output}`);
const runtime = path.join(path.dirname(require.resolve('electron/package.json')), 'dist');
fs.cpSync(runtime, output, {
  recursive: true,
  filter: file => !['debug.log', 'default_app.asar'].includes(path.basename(file))
});
fs.renameSync(path.join(output, 'electron.exe'), path.join(output, 'GuolongSalesTool.exe'));
const app = path.join(output, 'resources', 'app');
fs.mkdirSync(app, { recursive: true });
for (const file of ['main.js', 'preload.js', 'package.json', 'package-lock.json', 'LICENSE']) {
  fs.copyFileSync(path.join(root, file), path.join(app, file));
}
for (const directory of ['src', 'templates', 'scripts']) {
  fs.cpSync(path.join(root, directory), path.join(app, directory), { recursive: true });
}
execFileSync(process.env.ComSpec || 'C:\\Windows\\System32\\cmd.exe',
  ['/d', '/c', 'npm.cmd', 'ci', '--omit=dev', '--ignore-scripts', '--no-audit', '--no-fund'],
  { cwd: app, stdio: 'inherit', windowsHide: true });
execFileSync(process.execPath, ['scripts/test-open-source.js'],
  { cwd: app, stdio: 'inherit', windowsHide: true });
for (const file of ['LICENSE', 'README.md']) {
  fs.copyFileSync(path.join(root, file), path.join(output, file));
}
console.log(`Public portable build: ${output}`);
