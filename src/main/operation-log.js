const fs = require('node:fs');
const path = require('node:path');
const { randomUUID } = require('node:crypto');

// Only diagnostic metadata belongs on disk; never record IPC arguments or error messages.
function createOperationLog(directory) {
  const file = path.join(directory, 'operations.log');
  const keys = new Set(['id', 'result', 'reason', 'code', 'elapsedMs', 'version', 'count', 'stage', 'status', 'method', 'route']);
  function write(event, fields = {}) {
    try {
      const safe = Object.fromEntries(Object.entries(fields).filter(([key, value]) => keys.has(key) &&
        (typeof value === 'number' || typeof value === 'boolean' || (typeof value === 'string' && value.length <= 160))));
      const line = JSON.stringify({ time: new Date().toISOString(), pid: process.pid, event, ...safe }) + '\n';
      fs.mkdirSync(directory, { recursive: true });
      if (fs.existsSync(file) && fs.statSync(file).size + Buffer.byteLength(line) > 1024 * 1024) {
        for (let index = 3; index >= 1; index--) {
          const older = index === 1 ? file : `${file}.${index - 1}`;
          const newer = `${file}.${index}`;
          if (fs.existsSync(newer)) fs.unlinkSync(newer);
          if (fs.existsSync(older)) fs.renameSync(older, newer);
        }
      }
      fs.appendFileSync(file, line, 'utf8');
    } catch { /* Diagnostics must not interrupt the user's operation. */ }
  }
  async function run(event, action) {
    const id = randomUUID();
    const started = Date.now();
    write(event, { id, result: 'started' });
    try {
      const value = await action();
      const skipped = value === null || value === false || value?.canceled || value?.cancelled;
      write(event, { id, result: skipped ? 'skipped' : 'completed', reason: skipped ? 'cancelled_or_no_result' : 'handler_returned', elapsedMs: Date.now() - started });
      return value;
    } catch (error) {
      write(event, { id, result: 'failed', reason: error?.name || 'Error', code: typeof error?.code === 'string' && /^[A-Z0-9_]+$/.test(error.code) ? error.code : '', elapsedMs: Date.now() - started });
      throw error;
    }
  }
  return { write, run };
}

module.exports = { createOperationLog };
