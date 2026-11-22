const fs = require('fs/promises');
const path = require('path');
const initSqlJs = require('sql.js');
const { MATERIAL_DEFINITIONS } = require('../src/main/material-files');

async function requireFile(file, label) {
  let current = path.resolve(file);
  let first = true;
  while (true) {
    let stat;
    try { stat = await fs.lstat(current); }
    catch (error) { throw new Error(`${label}: missing or unreadable file (${error.code}): ${file}`); }
    if (stat.isSymbolicLink()) throw new Error(`${label}: symbolic links are not allowed: ${current}`);
    if (first ? !stat.isFile() : !stat.isDirectory()) throw new Error(`${label}: expected a regular file and directory ancestors: ${file}`);
    const parent = path.dirname(current);
    if (parent === current) return;
    current = parent;
    first = false;
  }
}

async function checkProductAssets(databaseFile, imagesDir, materialsDir) {
  await requireFile(databaseFile, 'Database');
  const bytes = await fs.readFile(databaseFile);
  if (!bytes.subarray(0, 16).equals(Buffer.from('SQLite format 3\0'))) throw new Error('Database: invalid SQLite header');
  const SQL = await initSqlJs();
  let db;
  try {
    db = new SQL.Database(bytes);
    const integrity = db.exec('PRAGMA integrity_check')[0]?.values;
    if (integrity?.length !== 1 || integrity[0][0] !== 'ok') throw new Error('SQLite integrity_check failed');
    const columns = db.exec('PRAGMA table_info(items)')[0]?.values.map(row => row[1]) || [];
    if (!['id', 'image_path', 'documents'].every(column => columns.includes(column))) throw new Error('items schema requires id, image_path and documents');
    const rows = db.exec('SELECT id, image_path, documents FROM items')[0]?.values || [];
    for (const [id, imagePath, rawDocuments] of rows) {
      const label = `Item ${id}`;
      let documents = {};
      if (rawDocuments !== null && rawDocuments !== '') {
        if (typeof rawDocuments !== 'string') throw new Error(`${label} documents must be a JSON object`);
        try { documents = JSON.parse(rawDocuments); }
        catch { throw new Error(`${label} documents: invalid JSON`); }
        if (!documents || typeof documents !== 'object' || Array.isArray(documents)) throw new Error(`${label} documents must be a JSON object`);
      }
      await checkReference(imagePath, 'images', imagesDir, `${label} image_path`);
      const photos = documents.photos;
      if (photos !== undefined && photos !== null && photos !== '') {
        if (!Array.isArray(photos)) throw new Error(`${label} documents.photos must be an array`);
        for (const [index, photo] of photos.entries()) await checkReference(photo, 'images', imagesDir, `${label} documents.photos[${index}]`);
      }
      for (const key of Object.keys(MATERIAL_DEFINITIONS)) await checkReference(documents[key], 'materials', materialsDir, `${label} documents.${key}`);
    }
  } catch (error) {
    throw new Error(`Product asset check failed (${databaseFile}): ${error.message}`);
  } finally { if (db) db.close(); }
}

async function checkReference(value, prefix, directory, label) {
  if (value === undefined || value === null || value === '') return;
  if (typeof value !== 'string') throw new Error(`${label}: asset path must be a string`);
  const normalized = value.replace(/\\/g, '/');
  const parts = normalized.split('/');
  if (path.posix.isAbsolute(normalized) || path.win32.isAbsolute(value) || /[:\x00-\x1f]/.test(value) ||
      parts.some(part => !part || part === '.' || part === '..' || /[. ]$/.test(part)) || parts[0] !== prefix || parts.length < 2) {
    throw new Error(`${label}: expected a safe ${prefix}/ relative path: ${JSON.stringify(value)}`);
  }
  await requireFile(path.join(directory, ...parts.slice(1)), label);
}

module.exports = { checkProductAssets };
