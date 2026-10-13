const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { createOperationLog } = require('../src/main/operation-log');

(async () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'operation-log-'));
  try {
    const log = createOperationLog(directory);
    log.write('startup', { version: 'test', payload: 'PRIVATE', message: 'SECRET' });
    assert.equal(await log.run('export', () => 'unchanged-result'), 'unchanged-result');
    const failure = Object.assign(new Error('PRIVATE CUSTOMER TOKEN'), { code: 'TEMPLATE_MISSING' });
    await assert.rejects(log.run('export', () => { throw failure; }), error => error === failure);
    await log.run('pick', () => null);
    const file = path.join(directory, 'operations.log');
    const records = fs.readFileSync(file, 'utf8').trim().split('\n').map(JSON.parse);
    assert.equal(records[1].id, records[2].id);
    assert.equal(records[3].id, records[4].id);
    assert.equal(records[4].code, 'TEMPLATE_MISSING');
    assert.equal(records[6].result, 'skipped');
    assert(!fs.readFileSync(file, 'utf8').match(/PRIVATE|SECRET|TOKEN/));
    for (let index = 0; index < 5; index++) {
      fs.writeFileSync(file, 'x'.repeat(1024 * 1024));
      log.write('rotation');
    }
    assert(fs.statSync(file).size < 1024 * 1024);
    assert.equal(fs.readdirSync(directory).length, 4);
    const blocked = path.join(directory, 'blocked');
    fs.writeFileSync(blocked, 'not a directory');
    assert.equal(await createOperationLog(blocked).run('export', () => 7), 7);
    console.log('Operation log: correlation, unchanged results/errors, skip, privacy, rotation and unwritable directory passed.');
  } finally { fs.rmSync(directory, { recursive: true, force: true }); }
})().catch(error => { console.error(error); process.exitCode = 1; });
