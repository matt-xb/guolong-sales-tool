const fs = require('fs');
const path = require('path');
const initSqlJs = require('sql.js');
const { pinyin } = require('pinyin-pro');
const { productImageGroupKey, editProductImages } = require('../shared/product-images');

const DEFAULT_CATEGORIES = [
  '汤锅类',
  '炒锅类',
  '直立式行星炒锅类',
  '滚筒炒菜机类',
  '自动多功能炒锅类',
  '卤煮漂汤类',
  '高压锅类',
  '智能类',
  '异型类'
];

async function initDatabase(dbPath, seedPath = null) {
  const SQL = await initSqlJs({
    locateFile: (file) => path.join(__dirname, '..', '..', 'node_modules', 'sql.js', 'dist', file)
  });
  if (!fs.existsSync(dbPath) && seedPath && fs.existsSync(seedPath)) {
    fs.mkdirSync(path.dirname(dbPath), { recursive: true });
    fs.copyFileSync(seedPath, dbPath);
  }
  backupExistingDatabase(dbPath);
  const db = fs.existsSync(dbPath)
    ? new SQL.Database(fs.readFileSync(dbPath))
    : new SQL.Database();

  db.run(`
    CREATE TABLE IF NOT EXISTS items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL CHECK(type IN ('equipment', 'part')),
      name TEXT NOT NULL,
      model TEXT,
      category TEXT,
      price REAL,
      dimensions TEXT,
      parameters TEXT,
      application TEXT,
      selling_points TEXT,
      image_path TEXT,
      documents TEXT,
      remark TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_items_type ON items(type);
    CREATE INDEX IF NOT EXISTS idx_items_category ON items(category);
    CREATE INDEX IF NOT EXISTS idx_items_name ON items(name);
  `);
  ensureColumn(db, 'items', 'documents', 'TEXT');
  ensureColumn(db, 'items', 'stock_qty', 'TEXT');
  persist(db, dbPath);

  return {
    listItems(filters = {}) {
      const where = [];
      const params = [];

      if (filters.type && filters.type !== 'all') {
        where.push('type = ?');
        params.push(filters.type);
      }
      if (filters.category && filters.category !== 'all') {
        where.push('category = ?');
        params.push(filters.category);
      }
      const keywordTokens = splitSearchTokens(filters.keyword);

      const sql = `
        SELECT * FROM items
        ${where.length ? `WHERE ${where.join(' AND ')}` : ''}
        ORDER BY type ASC, category ASC, updated_at DESC, id DESC
      `;
      const items = queryAll(db, sql, params).map(deserializeItem);
      return keywordTokens.length
        ? items.filter((item) => matchesCatalogSearch(item, keywordTokens))
        : items;
    },
    getItem(id) {
      const item = queryOne(db, 'SELECT * FROM items WHERE id = ?', [id]);
      return item ? deserializeItem(item) : null;
    },
    saveItem(item) {
      const normalized = normalizeItem(item);
      if (normalized.id) {
        run(db, `
          UPDATE items SET
            type = ?,
            name = ?,
            model = ?,
            category = ?,
            price = ?,
            dimensions = ?,
            parameters = ?,
            application = ?,
            selling_points = ?,
            image_path = ?,
            documents = CASE WHEN ? IS NULL THEN documents ELSE ? END,
            remark = ?,
            updated_at = CURRENT_TIMESTAMP
          WHERE id = ?
        `, toUpdateValues(normalized).concat(normalized.id));
        persist(db, dbPath);
        return this.getItem(normalized.id);
      }

      run(db, `
        INSERT INTO items (
          type, name, model, category, price, dimensions, parameters,
          application, selling_points, image_path, documents, remark
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, toInsertValues(normalized));
      const row = queryOne(db, 'SELECT last_insert_rowid() AS id', []);
      persist(db, dbPath);
      return this.getItem(row.id);
    },
    deleteItem(id) {
      run(db, 'DELETE FROM items WHERE id = ?', [id]);
      persist(db, dbPath);
      return true;
    },
    updateItemDocument(id, key, value) {
      const item = this.getItem(id);
      if (!item) throw new Error('未找到商品，可能已被删除。');
      const documents = { ...item.documents };
      if (value) documents[key] = value;
      else delete documents[key];
      run(db, 'UPDATE items SET documents = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [
        serializeDocuments(documents),
        id
      ]);
      persist(db, dbPath);
      return this.getItem(id);
    },
    updateProductImages(id, action, imagePath, added = []) {
      const item = this.getItem(id);
      if (!item) throw new Error('未找到商品。');
      const album = editProductImages(item, action, imagePath, added);
      const members = this.listItems().filter((entry) => productImageGroupKey(entry) === productImageGroupKey(item));
      db.run('BEGIN TRANSACTION');
      try {
        for (const member of members) {
          const documents = { ...member.documents, photos: album.photos };
          // Extra photos are shared; adding them must not change existing model-specific main images.
          const main = imagePath === item.image_path && action !== 'add' ? album.image_path : member.image_path;
          run(db, 'UPDATE items SET image_path = ?, documents = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
            [main || '', serializeDocuments(documents), member.id]);
        }
        db.run('COMMIT');
      } catch (error) {
        db.run('ROLLBACK');
        throw error;
      }
      persist(db, dbPath);
      return this.getItem(id);
    },
    updateStockQuantities(updates = []) {
      const validUpdates = updates
        .map((entry) => ({
          id: Number(entry.id),
          stock_qty: String(entry.stock ?? '').trim()
        }))
        .filter((entry) => Number.isInteger(entry.id) && entry.id > 0);
      if (!validUpdates.length) return { updated: 0 };
      db.run('BEGIN TRANSACTION');
      try {
        validUpdates.forEach((entry) => {
          run(db, 'UPDATE items SET stock_qty = ? WHERE id = ?', [entry.stock_qty, entry.id]);
        });
        db.run('COMMIT');
      } catch (error) {
        db.run('ROLLBACK');
        throw error;
      }
      persist(db, dbPath);
      return { updated: validUpdates.length };
    }
  };
}

function queryAll(db, sql, params) {
  const stmt = db.prepare(sql);
  stmt.bind(params);
  const rows = [];
  while (stmt.step()) rows.push(stmt.getAsObject());
  stmt.free();
  return rows;
}

function queryOne(db, sql, params) {
  return queryAll(db, sql, params)[0] || null;
}

function run(db, sql, params) {
  const stmt = db.prepare(sql);
  stmt.run(params);
  stmt.free();
}

function ensureColumn(db, tableName, columnName, columnDefinition) {
  const columns = queryAll(db, `PRAGMA table_info(${tableName})`, []);
  if (columns.some((column) => column.name === columnName)) return;
  db.run(`ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${columnDefinition}`);
}

function persist(db, dbPath) {
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });
  fs.writeFileSync(dbPath, Buffer.from(db.export()));
}

function backupExistingDatabase(dbPath) {
  if (!fs.existsSync(dbPath)) return;
  const backupDir = path.join(path.dirname(dbPath), 'backups');
  fs.mkdirSync(backupDir, { recursive: true });
  const stamp = formatBackupStamp(new Date());
  const backupPath = path.join(backupDir, `sales-${stamp}.sqlite`);
  if (!fs.existsSync(backupPath)) fs.copyFileSync(dbPath, backupPath);
  pruneDatabaseBackups(backupDir, 10);
}

function formatBackupStamp(date) {
  const pad = (value) => String(value).padStart(2, '0');
  return [
    date.getFullYear(),
    pad(date.getMonth() + 1),
    pad(date.getDate()),
    '-',
    pad(date.getHours()),
    pad(date.getMinutes()),
    pad(date.getSeconds())
  ].join('');
}

function pruneDatabaseBackups(backupDir, keep) {
  const backups = fs.readdirSync(backupDir)
    .filter((name) => /^sales-\d{8}-\d{6}\.sqlite$/.test(name))
    .map((name) => ({
      name,
      fullPath: path.join(backupDir, name),
      mtimeMs: fs.statSync(path.join(backupDir, name)).mtimeMs
    }))
    .sort((a, b) => b.mtimeMs - a.mtimeMs);

  backups.slice(keep).forEach((backup) => {
    fs.unlinkSync(backup.fullPath);
  });
}

function normalizeItem(item) {
  const type = item.type === 'part' ? 'part' : 'equipment';
  return {
    id: item.id || null,
    type,
    name: (item.name || '').trim(),
    model: item.model || '',
    category: item.category || '',
    price: item.price === '' || item.price === null || item.price === undefined ? null : Number(item.price),
    dimensions: type === 'equipment' ? (item.dimensions || '') : '',
    parameters: type === 'equipment' ? (item.parameters || '') : '',
    application: type === 'equipment' ? (item.application || '') : '',
    selling_points: type === 'equipment' ? (item.selling_points || '') : '',
    image_path: item.image_path || '',
    documents: Object.prototype.hasOwnProperty.call(item, 'documents') ? serializeDocuments(item.documents) : null,
    remark: item.remark || ''
  };
}

function toBaseValues(item) {
  return [
    item.type,
    item.name,
    item.model,
    item.category,
    item.price,
    item.dimensions,
    item.parameters,
    item.application,
    item.selling_points,
    item.image_path
  ];
}

function toUpdateValues(item) {
  return [
    ...toBaseValues(item),
    item.documents,
    item.documents,
    item.remark
  ];
}

function toInsertValues(item) {
  return [
    ...toBaseValues(item),
    item.documents || '',
    item.remark
  ];
}

function deserializeItem(item) {
  return {
    ...item,
    documents: parseDocuments(item.documents)
  };
}

function splitSearchTokens(keyword) {
  return String(keyword || '')
    .normalize('NFKC')
    .replace(/([0-9A-Za-z])([\u4e00-\u9fff])/g, '$1 $2')
    .replace(/([\u4e00-\u9fff])([0-9A-Za-z])/g, '$1 $2')
    .split(/[\s,，;；、]+/)
    .map((token) => normalizeSearchText(token))
    .filter(Boolean);
}

function matchesCatalogSearch(item, tokens) {
  const fields = [
    item.name,
    item.model,
    extractCapacityForSearch(item),
    extractHeatingMethodForSearch(item)
  ].filter(Boolean);
  const source = normalizeSearchText(fields.join(' '));
  const compactSource = compactSearchText(source);
  const pinyinSource = buildPinyinSearchText(fields.join(' '));
  return tokens.every((token) => (
    source.includes(token)
    || compactSource.includes(compactSearchText(token))
    || pinyinSource.includes(compactSearchText(token))
  ));
}

function normalizeSearchText(value) {
  return String(value || '').normalize('NFKC').trim().toLowerCase();
}

function compactSearchText(value) {
  return normalizeSearchText(value).replace(/[\s\-_/()（）[\]【】]+/g, '');
}

function buildPinyinSearchText(value) {
  const chineseText = Array.from(String(value || ''))
    .filter((char) => /[\u3400-\u9fff]/.test(char))
    .join('');
  if (!chineseText) return '';

  const fullPinyin = pinyin(chineseText, {
    toneType: 'none',
    type: 'array'
  }).join('');
  const initials = pinyin(chineseText, {
    pattern: 'first',
    toneType: 'none',
    type: 'array'
  }).join('');
  return normalizeSearchText(`${fullPinyin} ${initials}`);
}

function extractCapacityForSearch(item) {
  const source = `${item.remark || ''}\n${item.parameters || ''}`;
  const match = source.match(/(?:容量|锅体容量)\s*[：:]?\s*([0-9]+(?:\.[0-9]+)?\s*(?:L|l|升)?)/);
  if (!match) return '';
  const capacity = match[1].replace(/\s+/g, '');
  return /(?:L|l|升)$/.test(capacity) ? capacity : `${capacity}L`;
}

function extractHeatingMethodForSearch(item) {
  const primarySource = normalizeSearchText([
    item.name,
    item.model,
    item.category
  ].filter(Boolean).join('\n'));
  const heatingPattern = /燃气|天然气|液化气|燃烧机|全预混|自吸风|电磁|电热|电加热|蒸汽|natural\s*gas|lpg|gas|burner|premix|self[\s-]*priming|induction|electric|steam/;
  const explicitParameterSource = String(item.parameters || '')
    .split(/\r?\n/)
    .filter((line) => /^\s*(?:加热方式|热源|燃气种类)\s*[：:]/.test(line))
    .join('\n');
  const source = heatingPattern.test(primarySource)
    ? primarySource
    : normalizeSearchText(`${primarySource}\n${explicitParameterSource}`);
  const terms = new Set();

  if (/燃气|天然气|液化气|燃烧机|全预混|自吸风|natural\s*gas|lpg|gas|burner|premix|self[\s-]*priming/.test(source)) {
    ['燃气', 'gas'].forEach((term) => terms.add(term));
  }
  if (/天然气|natural\s*gas/.test(source)) {
    ['天然气', 'natural gas'].forEach((term) => terms.add(term));
  }
  if (/液化气|lpg/.test(source)) {
    ['液化气', 'lpg'].forEach((term) => terms.add(term));
  }
  if (/燃烧机|burner/.test(source)) {
    ['燃烧机', 'burner'].forEach((term) => terms.add(term));
  }
  if (/全预混|premix/.test(source)) {
    ['全预混', 'premix'].forEach((term) => terms.add(term));
  }
  if (/自吸风|self[\s-]*priming/.test(source)) {
    ['自吸风', 'self priming'].forEach((term) => terms.add(term));
  }
  if (/电磁|induction/.test(source)) {
    ['电磁', '电磁加热', 'induction'].forEach((term) => terms.add(term));
  }
  if (/电热|电加热|electric/.test(source)) {
    ['电热', '电加热', 'electric'].forEach((term) => terms.add(term));
  }
  if (/蒸汽|steam/.test(source)) {
    ['蒸汽', 'steam'].forEach((term) => terms.add(term));
  }

  return [...terms].join(' ');
}

function parseDocuments(value) {
  if (!value) return {};
  if (typeof value === 'object') return value;
  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

function serializeDocuments(value) {
  const documents = parseDocuments(value);
  return Object.keys(documents).length ? JSON.stringify(documents) : '';
}

module.exports = { initDatabase, DEFAULT_CATEGORIES };
