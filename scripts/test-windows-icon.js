const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

if (process.platform !== 'win32') {
  console.log('Windows executable icon test requires Windows.');
} else {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'sales-exe-icon-'));
  try {
    const exe = path.join(temp, 'test.exe');
    fs.copyFileSync(path.join(path.dirname(require.resolve('electron/package.json')), 'dist/electron.exe'), exe);
    const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a2ioAAAAASUVORK5CYII=', 'base64');
    const header = Buffer.alloc(22);
    header.writeUInt16LE(1, 2); header.writeUInt16LE(1, 4);
    header[6] = 1; header[7] = 1;
    header.writeUInt16LE(1, 10); header.writeUInt16LE(32, 12);
    header.writeUInt32LE(png.length, 14); header.writeUInt32LE(22, 18);
    const icon = path.join(temp, 'test.ico');
    fs.writeFileSync(icon, Buffer.concat([header, png]));
    const script = path.join(__dirname, 'set-windows-icon.ps1');
    const run = () => execFileSync('powershell.exe', ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', script, '-Executable', exe, '-Icon', icon], { windowsHide: true, encoding: 'utf8', stdio: 'pipe' });
    const original = fs.readFileSync(exe);
    assert.match(run(), /embedded and verified/);
    assert(!fs.readFileSync(exe).equals(original));
    assert.match(run(), /embedded and verified/);
    const beforeInvalid = fs.readFileSync(exe);
    fs.writeFileSync(icon, 'invalid');
    assert.throws(run);
    assert(fs.readFileSync(exe).equals(beforeInvalid));
    fs.writeFileSync(icon, Buffer.concat([header, png.subarray(0, 5)]));
    assert.throws(run);
    assert(fs.readFileSync(exe).equals(beforeInvalid));
    console.log('Windows executable icon: embedded resources, repeat write, invalid/truncated ICO rejection passed.');
  } finally { fs.rmSync(temp, { recursive: true, force: true }); }
}
