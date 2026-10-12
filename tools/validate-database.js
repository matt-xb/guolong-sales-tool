const fs = require('fs');
const path = require('path');

const [databasePath, appAsarPath] = process.argv.slice(2);

validate().catch((error) => {
  console.error(error.message || String(error));
  process.exitCode = 25;
});

async function validate() {
  if (!databasePath || !appAsarPath || !fs.existsSync(databasePath) || !fs.existsSync(appAsarPath)) {
    process.exitCode = 20;
    return;
  }

  const bytes = fs.readFileSync(databasePath);
  const expectedHeader = Buffer.from('SQLite format 3\0', 'ascii');
  if (bytes.length < 100 || !bytes.subarray(0, expectedHeader.length).equals(expectedHeader)) {
    process.exitCode = 21;
    return;
  }

  const sqlJsRoot = path.join(appAsarPath, 'node_modules', 'sql.js');
  const initSqlJs = require(sqlJsRoot);
  const SQL = await initSqlJs({
    locateFile: (file) => path.join(sqlJsRoot, 'dist', file)
  });
  const database = new SQL.Database(bytes);

  try {
    const integrityRows = query(database, 'PRAGMA quick_check');
    if (String(integrityRows[0]?.quick_check || '').toLowerCase() !== 'ok') {
      process.exitCode = 22;
      return;
    }

    const tableRows = query(database, "SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'items'");
    if (!tableRows.length) {
      process.exitCode = 23;
      return;
    }

    const itemRows = query(database, 'SELECT COUNT(*) AS count FROM items');
    if (Number(itemRows[0]?.count || 0) < 1) {
      process.exitCode = 24;
    }
  } finally {
    database.close();
  }
}

function query(database, sql) {
  const statement = database.prepare(sql);
  const rows = [];
  try {
    while (statement.step()) rows.push(statement.getAsObject());
  } finally {
    statement.free();
  }
  return rows;
}
