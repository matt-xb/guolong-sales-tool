const path = require('path');

const MATERIAL_DEFINITIONS = {
  ccc: { label: '证书', extensions: ['pdf', 'png', 'jpg', 'jpeg', 'webp', 'bmp'] },
  report: { label: '检测报告', extensions: ['pdf', 'png', 'jpg', 'jpeg', 'webp', 'bmp'] },
  energy: { label: '能效标识', extensions: ['png', 'jpg', 'jpeg', 'webp', 'bmp', 'pdf'] },
  view3: { label: '三视图', extensions: ['pdf', 'png', 'jpg', 'jpeg', 'webp', 'bmp'] },
  manual: { label: '说明书', extensions: ['doc', 'docx', 'pdf'] }
};

function getMaterialDefinition(key) {
  const definition = MATERIAL_DEFINITIONS[String(key || '')];
  if (!definition) throw new Error('资料类型无效。');
  return definition;
}

function validateMaterialExtension(key, filePath) {
  const definition = getMaterialDefinition(key);
  const extension = path.extname(String(filePath || '')).slice(1).toLowerCase();
  if (!definition.extensions.includes(extension)) {
    throw new Error(`${definition.label}不支持 .${extension || '未知'} 格式。`);
  }
  return extension;
}

function buildImportedMaterialRelativePath(key, sourcePath, stamp = Date.now()) {
  const extension = validateMaterialExtension(key, sourcePath);
  const originalName = path.basename(sourcePath, path.extname(sourcePath));
  const safeName = originalName
    .trim()
    .replace(/[<>:"/\\|?*\x00-\x1F]/g, '')
    .replace(/[. ]+$/g, '')
    .slice(0, 80) || getMaterialDefinition(key).label;
  return path.posix.join('materials', 'user-imports', key, `${stamp}-${safeName}.${extension}`);
}

function isManagedImportedMaterialPath(relativePath) {
  return /^materials\/user-imports\/(ccc|report|energy|view3|manual)\/[^/]+$/i.test(
    String(relativePath || '').replace(/\\/g, '/')
  );
}

module.exports = {
  MATERIAL_DEFINITIONS,
  getMaterialDefinition,
  validateMaterialExtension,
  buildImportedMaterialRelativePath,
  isManagedImportedMaterialPath
};
