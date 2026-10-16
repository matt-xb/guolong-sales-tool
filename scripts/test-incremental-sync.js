const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const os = require('node:os');
const { execFile } = require('node:child_process');
const { promisify } = require('node:util');
const initSqlJs = require('sql.js');
const { refreshData, validateDatabase } = require('../src/main/data-refresh');
const { prepareProgramUpdate } = require('../src/main/program-update');
const { publishManifest, validateManifest, startManifestPublisher, readManifest } = require('../src/main/sync-manifest');
const run = promisify(execFile);
async function write(file, content) { await fs.mkdir(path.dirname(file), { recursive: true }); await fs.writeFile(file, content); }
async function main() {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'sales-incremental-'));
  const SQL = await initSqlJs();
  const db = new SQL.Database(); db.run("CREATE TABLE items (id INTEGER); INSERT INTO items VALUES (1)");
  const valid = Buffer.from(db.export()); db.close();
  async function fixture(name) {
    const source = path.join(root, name, 'source'), target = path.join(root, name, 'target');
    for (const base of [source, target]) {
      for (const [file, value] of [['sales.sqlite', valid], ['images/one.png', 'image1'], ['images/two.png', 'image2'], ['resources/materials/one.pdf','pdf'], ['app.exe','fake runtime'], ['release-version.json','{"version":"2.22.0"}'], ['resources/app/package.json','{"version":"2.22.0"}'], ['resources/app/main.js','new code']]) await write(path.join(base,file),value);
      await write(path.join(base,'outputs/contract.xlsx'),'PRIVATE_OUTPUT');
      await write(path.join(base,'local-data/recent-files.json'),'PRIVATE_RECENT');
      await write(path.join(base,'update-source.txt'),'LOCAL_SOURCE');
    }
    return { source, target };
  }
  try {
    const f = await fixture('data');
    await write(path.join(f.source,'sync-manifest.json'),'damaged cache');
    await publishManifest(f.source);
    assert((await readManifest(f.source)).files.length > 0);
    const empty = new SQL.Database(); empty.run('CREATE TABLE items (id INTEGER)');
    await write(path.join(root,'empty.sqlite'),Buffer.from(empty.export())); empty.close();
    await validateDatabase(path.join(root,'empty.sqlite'),true);
    await assert.rejects(validateDatabase(path.join(root,'empty.sqlite')),/没有产品数据/);
    await publishManifest(f.source);
    const copy = fs.copyFile, network = [];
    fs.copyFile = async (from,to,...args) => { if (from.startsWith(f.source + path.sep)) network.push(from); return copy(from,to,...args); };
    try {
      const first = await refreshData(f.source,f.target);
      assert.equal(first.downloaded,0); assert.equal(first.reused,4); assert.equal(network.length,0);
      await fs.utimes(path.join(f.source,'images/one.png'),new Date(1),new Date(1));
      await publishManifest(f.source);
      assert.equal((await refreshData(f.source,f.target)).downloaded,0);
      await write(path.join(f.source,'images/one.png'),'IMAGE1'); // Same size, different contents.
      await publishManifest(f.source);
      const one = await refreshData(f.source,f.target);
      assert.equal(one.downloaded,1); assert.equal(one.downloadedBytes,6); assert.equal(network.length,1);
      await fs.unlink(path.join(f.source,'images/two.png')); await publishManifest(f.source);
      assert.equal((await refreshData(f.source,f.target)).downloaded,0);
      await assert.rejects(fs.access(path.join(f.target,'images/two.png')));
      await write(path.join(f.source,'images/one.png'),'STALE!');
      await assert.rejects(refreshData(f.source,f.target),/清单不一致/);
      assert.equal(await fs.readFile(path.join(f.target,'images/one.png'),'utf8'),'IMAGE1');
      assert.equal(await fs.readFile(path.join(f.target,'outputs/contract.xlsx'),'utf8'),'PRIVATE_OUTPUT');
    } finally { fs.copyFile=copy; }
    const hash = 'a'.repeat(64);
    for (const unsafe of ['../outside','C:/outside','images/../x','outputs/test','local-data/x','images\\x','images/CON','images/x.']) {
      assert.throws(()=>validateManifest({schema:1,directories:[],files:[{path:unsafe,size:1,sha256:hash}]}));
    }
    assert.throws(()=>validateManifest({schema:1,directories:[],files:[{path:'a',size:1,sha256:hash},{path:'A',size:1,sha256:hash}]}));
    const watcher = await fixture('watcher');
    const stop = startManifestPublisher(watcher.source);
    try {
      for (let i=0; i<30 && !await readManifest(watcher.source); i++) await new Promise(r=>setTimeout(r,100));
      await write(path.join(watcher.source,'images/one.png'),'automatically changed');
      let updated=false;
      for (let i=0;i<40;i++) {
        await new Promise(r=>setTimeout(r,100));
        const m=await readManifest(watcher.source);
        if(m?.files.find(x=>x.path==='images/one.png')?.size===21) {updated=true;break;}
      }
      assert(updated,'Publisher must update after editing a source image');
    } finally {stop();}
    if (process.platform==='win32') {
      const p=await fixture('program');
      await write(path.join(p.target,'resources/app/main.js'),'old code');
      await write(path.join(p.target,'obsolete.dll'),'old');
      await publishManifest(p.source);
      const prepared=await prepareProgramUpdate(p.source,p.target,path.join(p.target,'app.exe'),0);
      assert.equal(prepared.downloaded,1); assert.equal(prepared.reused,7);
      const jobFile=path.join(prepared.jobDir,'job.json');
      const job=JSON.parse(await fs.readFile(jobFile,'utf8')); job.restart=false;
      await fs.writeFile(jobFile,JSON.stringify(job));
      await run('powershell.exe',['-NoProfile','-NonInteractive','-ExecutionPolicy','Bypass','-File',path.join(prepared.jobDir,'apply.ps1'),'-JobPath',jobFile],{windowsHide:true});
      const result=JSON.parse((await fs.readFile(path.join(p.target,'local-data/program-update-result.json'),'utf8')).replace(/^\uFEFF/,''));
      assert.equal(result.ok,true,JSON.stringify(result));
      assert.equal(await fs.readFile(path.join(p.target,'resources/app/main.js'),'utf8'),'new code');
      await assert.rejects(fs.access(path.join(p.target,'obsolete.dll')));
      assert.equal(await fs.readFile(path.join(p.target,'local-data/recent-files.json'),'utf8'),'PRIVATE_RECENT');
      assert.equal(await fs.readFile(path.join(p.target,'update-source.txt'),'utf8'),'LOCAL_SOURCE');
      const bad=await fixture('bad-program');
      await write(path.join(bad.target,'resources/app/main.js'),'old code'); await publishManifest(bad.source);
      const failed=await prepareProgramUpdate(bad.source,bad.target,path.join(bad.target,'app.exe'),0);
      const jf=path.join(failed.jobDir,'job.json'), j=JSON.parse(await fs.readFile(jf,'utf8')); j.restart=false;
      await fs.writeFile(jf,JSON.stringify(j)); await write(path.join(j.stage,'resources/app/main.js'),'tampered stage');
      await run('powershell.exe',['-NoProfile','-NonInteractive','-ExecutionPolicy','Bypass','-File',path.join(failed.jobDir,'apply.ps1'),'-JobPath',jf],{windowsHide:true});
      assert.equal(await fs.readFile(path.join(bad.target,'resources/app/main.js'),'utf8'),'old code');
      assert.equal(JSON.parse((await fs.readFile(path.join(bad.target,'local-data/program-update-result.json'),'utf8')).replace(/^\uFEFF/,'')).ok,false);
      const rollback=await fixture('rollback-program');
      await write(path.join(rollback.target,'resources/app/main.js'),'old code');
      await write(path.join(rollback.target,'obsolete.dll'),'must restore');
      await publishManifest(rollback.source);
      const pending=await prepareProgramUpdate(rollback.source,rollback.target,path.join(rollback.target,'app.exe'),0);
      const rp=path.join(pending.jobDir,'job.json'), rj=JSON.parse(await fs.readFile(rp,'utf8')); rj.restart=false;
      await fs.writeFile(rp,JSON.stringify(rj));
      const wrapper=path.join(root,'fail-install.ps1');
      await fs.writeFile(wrapper,`function Move-Item { param($LiteralPath,$Destination)\nif ($LiteralPath -like '*stage*main.js') { throw 'Simulated install failure' }; Microsoft.PowerShell.Management\\Move-Item -LiteralPath $LiteralPath -Destination $Destination\n}\n& '${path.join(pending.jobDir,'apply.ps1')}' -JobPath '${rp}'`);
      await run('powershell.exe',['-NoProfile','-NonInteractive','-ExecutionPolicy','Bypass','-File',wrapper],{windowsHide:true});
      const rr=JSON.parse((await fs.readFile(path.join(rollback.target,'local-data/program-update-result.json'),'utf8')).replace(/^\uFEFF/,''));
      assert.equal(rr.ok,false); assert.equal(rr.recoveryRequired,false,JSON.stringify(rr));
      assert.equal(await fs.readFile(path.join(rollback.target,'obsolete.dll'),'utf8'),'must restore');
      assert.equal(await fs.readFile(path.join(rollback.target,'resources/app/main.js'),'utf8'),'old code');
    }
    console.log('Incremental sync passed: zero-byte repeat, timestamp-only changes, same-size edits, deletes, stale hashes, path validation, automatic publisher, actual Windows installer and tamper recovery.');
  } finally {await fs.rm(root,{recursive:true,force:true});}
}
main().catch(e=>{console.error(e);process.exitCode=1;});
