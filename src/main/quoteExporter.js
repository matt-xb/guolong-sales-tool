const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');

const DETAIL_START_ROW = 3;
const DETAIL_END_ROW = 7;
const INFO_START_ROW = 8;
const INFO_END_ROW = 12;
const TOTAL_ROW = 13;
const REMARK_ROW = 14;
const BASE_INFO_ROWS = INFO_END_ROW - INFO_START_ROW + 1;
const IMAGE_START_COLUMN = 5;
const IMAGE_END_COLUMN = 7;
const IMAGE_PADDING_PX = 10;

async function createQuote({ templatePath, outputPath, payload }) {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(templatePath);

  const sheet = workbook.getWorksheet('Sheet1') || workbook.worksheets[0];
  if (!sheet) throw new Error('报价单模板没有可用工作表。');

  const items = payload.items || [];
  const extraRows = ensureDetailRows(sheet, items.length);
  const infoStartRow = INFO_START_ROW + extraRows;
  const infoEndRow = INFO_END_ROW + extraRows;
  const totalRow = TOTAL_ROW + extraRows;
  clearDetailRows(sheet, Math.max(items.length, DETAIL_END_ROW - DETAIL_START_ROW + 1));
  items.forEach((item, index) => writeDetailRow(sheet, DETAIL_START_ROW + index, item, index + 1));

  const addedInfoRows = writeProductInfoBlocks({
    sheet,
    workbook,
    items,
    baseDir: payload.baseDir,
    language: payload.language,
    infoStartRow,
    infoEndRow,
    totalRow,
    remarkRow: REMARK_ROW + extraRows
  });
  const actualTotalRow = totalRow + addedInfoRows;
  const actualRemarkRow = REMARK_ROW + extraRows + addedInfoRows;

  const lastDetailRow = DETAIL_START_ROW + Math.max(items.length, 1) - 1;
  sheet.getCell(`B${actualTotalRow}`).value = {
    formula: `SUM(G${DETAIL_START_ROW}:G${lastDetailRow})`,
    result: items.reduce((sum, item) => sum + Number(item.quantity || 0) * Number(item.price || 0), 0)
  };

  writeMerged(sheet, `A${actualRemarkRow}`, payload.remark || '');
  await workbook.xlsx.writeFile(outputPath);
  await validateGeneratedQuoteFile(outputPath, {
    items,
    baseDir: payload.baseDir,
    infoStartRow,
    actualTotalRow,
    actualRemarkRow,
    remark: payload.remark || ''
  });
}

async function validateGeneratedQuoteFile(outputPath, context) {
  if (!fs.existsSync(outputPath)) throw new Error(`报价单生成后未找到文件：${outputPath}`);
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(outputPath);
  const sheet = workbook.getWorksheet('Sheet1') || workbook.worksheets[0];
  if (!sheet) throw new Error('报价单生成后预检失败：没有可用工作表。');

  const { items, baseDir, infoStartRow, actualTotalRow, actualRemarkRow, remark } = context;
  const failures = [];
  const lastDetailRow = DETAIL_START_ROW + Math.max(items.length, 1) - 1;
  const totalFormula = getCellFormula(sheet.getCell(`B${actualTotalRow}`));
  const productInfoText = String(sheet.getCell(`A${infoStartRow}`).value || '');
  const firstItem = normalizeExportItem(items[0] || {});

  if (!totalFormula || !totalFormula.includes(`G${DETAIL_START_ROW}:G${lastDetailRow}`)) {
    failures.push(`合计金额公式异常：B${actualTotalRow}`);
  }

  items.forEach((item, index) => {
    const row = DETAIL_START_ROW + index;
    const expected = normalizeExportItem(item);
    const name = String(sheet.getCell(`B${row}`).value || '');
    const lineFormula = getCellFormula(sheet.getCell(`G${row}`));
    if (expected.name && !name.includes(expected.name)) {
      failures.push(`明细第 ${index + 1} 行产品名称异常：B${row}`);
    }
    if (!lineFormula || !lineFormula.includes(`F${row}*E${row}`)) {
      failures.push(`明细第 ${index + 1} 行金额公式异常：G${row}`);
    }
  });

  if (firstItem.name && !productInfoText.includes(firstItem.name)) {
    failures.push('产品信息块不是本次选择的产品。');
  }
  if (productInfoText.includes('[设备名称]')) {
    failures.push('产品信息块仍残留模板示例数据。');
  }
  if (remark && !String(sheet.getCell(`A${actualRemarkRow}`).value || '').includes(remark)) {
    failures.push(`备注内容位置异常：A${actualRemarkRow}`);
  }

  const expectedImages = items
    .map((item) => resolveImagePath(item.image_path, baseDir))
    .filter((imagePath) => imagePath && fs.existsSync(imagePath) && imageExtension(imagePath));
  const generatedImages = typeof sheet.getImages === 'function' ? sheet.getImages() : [];
  if (generatedImages.length !== expectedImages.length) {
    failures.push(`产品图片数量异常：应为 ${expectedImages.length}，实际为 ${generatedImages.length}`);
  } else {
    expectedImages.forEach((imagePath, index) => {
      const sourceSize = readImageDimensions(imagePath);
      const imageRange = generatedImages[index]?.range;
      const width = Number(imageRange?.ext?.width || 0);
      const height = Number(imageRange?.ext?.height || 0);
      if (!sourceSize || !width || !height) {
        failures.push(`产品图片尺寸读取失败：${path.basename(imagePath)}`);
        return;
      }
      const ratioDifference = Math.abs((width / height) - (sourceSize.width / sourceSize.height));
      if (ratioDifference > 0.02) failures.push(`产品图片比例异常：${path.basename(imagePath)}`);
      if (Math.max(width, height) <= 165) failures.push(`产品图片仍然过小：${path.basename(imagePath)}`);
    });
  }

  if (failures.length) {
    throw new Error(`报价单生成后预检失败：\n${failures.join('\n')}`);
  }
}

function getCellFormula(cell) {
  const value = cell.value;
  if (value && typeof value === 'object' && value.formula) return value.formula;
  return '';
}

function ensureDetailRows(sheet, count) {
  const defaultCapacity = DETAIL_END_ROW - DETAIL_START_ROW + 1;
  if (count <= defaultCapacity) return 0;

  const extra = count - defaultCapacity;
  sheet.insertRows(DETAIL_END_ROW + 1, Array.from({ length: extra }, () => []));
  for (let row = DETAIL_END_ROW + 1; row <= DETAIL_END_ROW + extra; row += 1) {
    copyRowStyle(sheet, DETAIL_END_ROW, row);
    sheet.getRow(row).height = sheet.getRow(DETAIL_END_ROW).height;
  }
  return extra;
}

function clearDetailRows(sheet, count) {
  for (let i = 0; i < count; i += 1) {
    const row = DETAIL_START_ROW + i;
    ['A', 'B', 'C', 'D', 'E', 'F', 'G'].forEach((col) => {
      sheet.getCell(`${col}${row}`).value = null;
    });
    sheet.getCell(`G${row}`).value = { formula: `F${row}*E${row}`, result: 0 };
  }
}

function writeDetailRow(sheet, row, item, index) {
  item = normalizeExportItem(item);
  sheet.getCell(`A${row}`).value = index;
  sheet.getCell(`B${row}`).value = item.name || '';
  sheet.getCell(`C${row}`).value = item.dimensions || '';
  sheet.getCell(`D${row}`).value = item.unit || (item.type === 'part' ? '件' : '台');
  sheet.getCell(`E${row}`).value = Number(item.quantity || 1);
  sheet.getCell(`F${row}`).value = item.price === '' || item.price === null || item.price === undefined ? null : Number(item.price);
  sheet.getCell(`G${row}`).value = { formula: `F${row}*E${row}`, result: Number(item.quantity || 1) * Number(item.price || 0) };
  enableWrap(sheet, row, ['B', 'C', 'D']);
  sheet.getRow(row).height = Math.max(sheet.getRow(row).height || 28, estimateDetailRowHeight(item));
}

function writeMerged(sheet, address, value) {
  sheet.getCell(address).value = value;
  sheet.getCell(address).alignment = {
    ...(sheet.getCell(address).alignment || {}),
    wrapText: true,
    vertical: 'middle'
  };
}

function writeProductInfoBlocks({ sheet, workbook, items, baseDir, language, infoStartRow, infoEndRow, totalRow, remarkRow }) {
  clearWorksheetImages(sheet);
  const blocks = (items.length ? items : [{ name: '', type: 'equipment' }]).map((item, index) => {
    const imagePath = resolveImagePath(item.image_path, baseDir);
    return {
      item,
      index,
      imagePath: imagePath && fs.existsSync(imagePath) ? imagePath : '',
      rows: estimateInfoBlockRows(item, language)
    };
  });
  const requiredRows = Math.max(BASE_INFO_ROWS, blocks.reduce((sum, block) => sum + block.rows, 0));
  const extraRows = Math.max(0, requiredRows - BASE_INFO_ROWS);
  unmergeRows(sheet, infoStartRow, remarkRow);

  if (extraRows) {
    sheet.insertRows(infoEndRow + 1, Array.from({ length: extraRows }, () => []));
  }

  for (let row = infoStartRow; row < infoStartRow + requiredRows; row += 1) {
    copyRowStyle(sheet, infoStartRow, row);
    sheet.getRow(row).height = 21;
    for (let col = 1; col <= 7; col += 1) {
      sheet.getCell(row, col).value = null;
    }
  }

  mergeIfPossible(sheet, `B${totalRow + extraRows}:G${totalRow + extraRows}`);
  mergeIfPossible(sheet, `A${remarkRow + extraRows}:G${remarkRow + extraRows}`);

  let cursor = infoStartRow;
  blocks.forEach((block) => {
    const start = cursor;
    const end = cursor + block.rows - 1;
    mergeIfPossible(sheet, `A${start}:D${end}`);
    mergeIfPossible(sheet, `E${start}:G${end}`);

    const textCell = sheet.getCell(`A${start}`);
    textCell.value = buildProductInfoText(block.item, block.index + 1, language);
    textCell.alignment = { wrapText: true, vertical: 'top' };
    textCell.font = { ...(textCell.font || {}), size: 9 };

    const imageCell = sheet.getCell(`E${start}`);
    imageCell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
    if (block.imagePath) {
      imageCell.value = null;
      const extension = imageExtension(block.imagePath);
      if (extension) {
        addContainedProductImage(sheet, workbook, block.imagePath, extension, start, end);
      }
    } else {
      imageCell.value = language === 'en' ? 'No reference image' : '暂无参考图片';
      imageCell.font = { ...(imageCell.font || {}), color: { argb: 'FF777777' } };
    }
    cursor += block.rows;
  });

  return extraRows;
}

function clearWorksheetImages(sheet) {
  if (!Array.isArray(sheet._media)) return;
  sheet._media = sheet._media.filter((media) => media.type !== 'image');
}

function resolveImagePath(imagePath, baseDir) {
  const value = String(imagePath || '').trim();
  if (!value) return '';
  if (path.isAbsolute(value)) return value;
  return path.join(baseDir || process.cwd(), value);
}

function imageExtension(imagePath) {
  const extension = path.extname(imagePath).toLowerCase().replace('.', '');
  if (extension === 'jpg') return 'jpeg';
  if (['jpeg', 'png', 'gif'].includes(extension)) return extension;
  return '';
}

function addContainedProductImage(sheet, workbook, imagePath, extension, startRow, endRow) {
  const imageSize = readImageDimensions(imagePath);
  if (!imageSize) return;
  const boxWidth = rangeWidthPx(sheet, IMAGE_START_COLUMN, IMAGE_END_COLUMN);
  const boxHeight = rangeHeightPx(sheet, startRow, endRow);
  const availableWidth = Math.max(1, boxWidth - IMAGE_PADDING_PX * 2);
  const availableHeight = Math.max(1, boxHeight - IMAGE_PADDING_PX * 2);
  const scale = Math.min(availableWidth / imageSize.width, availableHeight / imageSize.height);
  const width = Math.max(1, Math.round(imageSize.width * scale));
  const height = Math.max(1, Math.round(imageSize.height * scale));
  const offsetX = (boxWidth - width) / 2;
  const offsetY = (boxHeight - height) / 2;
  const imageId = workbook.addImage({ filename: imagePath, extension });
  sheet.addImage(imageId, {
    tl: {
      col: columnPositionForOffset(sheet, IMAGE_START_COLUMN, IMAGE_END_COLUMN, offsetX),
      row: rowPositionForOffset(sheet, startRow, endRow, offsetY)
    },
    ext: { width, height }
  });
}

function readImageDimensions(imagePath) {
  const buffer = fs.readFileSync(imagePath);
  if (buffer.length >= 24 && buffer.toString('ascii', 1, 4) === 'PNG') {
    return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
  }
  if (buffer.length >= 10 && ['GIF87a', 'GIF89a'].includes(buffer.toString('ascii', 0, 6))) {
    return { width: buffer.readUInt16LE(6), height: buffer.readUInt16LE(8) };
  }
  if (buffer.length >= 4 && buffer[0] === 0xff && buffer[1] === 0xd8) {
    let offset = 2;
    while (offset + 9 < buffer.length) {
      if (buffer[offset] !== 0xff) {
        offset += 1;
        continue;
      }
      const marker = buffer[offset + 1];
      if ([0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf].includes(marker)) {
        return { width: buffer.readUInt16BE(offset + 7), height: buffer.readUInt16BE(offset + 5) };
      }
      if (marker === 0xd8 || marker === 0xd9) {
        offset += 2;
        continue;
      }
      const segmentLength = buffer.readUInt16BE(offset + 2);
      if (segmentLength < 2) break;
      offset += segmentLength + 2;
    }
  }
  return null;
}

function columnWidthPx(sheet, columnNumber) {
  const width = Number(sheet.getColumn(columnNumber).width || 8.43);
  return Math.floor(width * 7 + 5);
}

function rowHeightPx(sheet, rowNumber) {
  return Number(sheet.getRow(rowNumber).height || 15) * 96 / 72;
}

function rangeWidthPx(sheet, startColumn, endColumn) {
  let width = 0;
  for (let column = startColumn; column <= endColumn; column += 1) width += columnWidthPx(sheet, column);
  return width;
}

function rangeHeightPx(sheet, startRow, endRow) {
  let height = 0;
  for (let row = startRow; row <= endRow; row += 1) height += rowHeightPx(sheet, row);
  return height;
}

function columnPositionForOffset(sheet, startColumn, endColumn, offsetPx) {
  let remaining = Math.max(0, offsetPx);
  for (let column = startColumn; column <= endColumn; column += 1) {
    const width = columnWidthPx(sheet, column);
    if (remaining <= width) return column - 1 + remaining / width;
    remaining -= width;
  }
  return endColumn;
}

function rowPositionForOffset(sheet, startRow, endRow, offsetPx) {
  let remaining = Math.max(0, offsetPx);
  for (let row = startRow; row <= endRow; row += 1) {
    const height = rowHeightPx(sheet, row);
    if (remaining <= height) return row - 1 + remaining / height;
    remaining -= height;
  }
  return endRow;
}

function mergeIfPossible(sheet, range) {
  try {
    sheet.mergeCells(range);
  } catch {
    // The template may already contain shifted merges; the label still works without merging.
  }
}

function unmergeIfPossible(sheet, range) {
  try {
    sheet.unMergeCells(range);
  } catch {
    // The template may have been edited; continue and normalize with new merges where needed.
  }
}

function unmergeRows(sheet, startRow, endRow) {
  const ranges = Object.entries(sheet._merges || {}).map(([master, range]) => ({
    master,
    top: range.model.top,
    bottom: range.model.bottom,
    left: range.model.left,
    right: range.model.right
  }));
  ranges.forEach((range) => {
    if (range.bottom < startRow || range.top > endRow) return;
    for (let row = range.top; row <= range.bottom; row += 1) {
      for (let col = range.left; col <= range.right; col += 1) {
        const cell = sheet.getCell(row, col);
        if (typeof cell.unmerge === 'function') cell.unmerge();
      }
    }
    delete sheet._merges[range.master];
    unmergeIfPossible(sheet, range.master);
  });
}

function enableWrap(sheet, row, columns) {
  columns.forEach((col) => {
    const cell = sheet.getCell(`${col}${row}`);
    cell.alignment = {
      ...(cell.alignment || {}),
      wrapText: true,
      vertical: 'middle'
    };
  });
}

function estimateDetailRowHeight(item) {
  const longest = Math.max(
    String(item.name || '').length,
    String(item.dimensions || '').length
  );
  if (longest > 48) return 70;
  if (longest > 30) return 52;
  return 34;
}

function buildProductInfoText(item, index, language = 'zh') {
  item = normalizeExportItem(item);
  const isEnglish = language === 'en';
  const lines = [`${isEnglish ? `${index}. ` : `${index}、`}${item.name || ''}`];
  if (item.type === 'part') {
    if (item.model) lines.push(`${isEnglish ? 'Part model: ' : '配件型号：'}${item.model}`);
  } else {
    if (item.model) lines.push(`${isEnglish ? 'Equipment model: ' : '设备型号：'}${item.model}`);
    if (item.parameters) lines.push(`${isEnglish ? 'Basic parameters: ' : '设备基础参数：'}${limitText(item.parameters, isEnglish ? 260 : 220)}`);
    if (item.selling_points) lines.push(`${isEnglish ? 'Key selling points: ' : '核心卖点：'}${limitText(item.selling_points, isEnglish ? 220 : 150)}`);
    if (item.application) lines.push(`${isEnglish ? 'Applications: ' : '适用场景：'}${limitText(item.application, isEnglish ? 200 : 120)}`);
  }
  if (item.lineRemark) lines.push(`${isEnglish ? 'Remarks: ' : '备注：'}${limitText(item.lineRemark, isEnglish ? 140 : 90)}`);
  return lines.join('\n');
}

function estimateInfoBlockRows(item, language = 'zh') {
  const text = buildProductInfoText(item, 1, language);
  const visualLines = text.split('\n').reduce((sum, line) => sum + Math.max(1, Math.ceil(String(line).length / 33)), 0);
  return Math.min(13, Math.max(8, visualLines + 1));
}

function normalizeExportItem(item) {
  if (!item || !item.isCustom) return item || {};
  const parameters = item.customBasicParams || item.parameters || '';
  return {
    ...item,
    name: customMarkedName(item.name || ''),
    model: item.model || '',
    dimensions: item.customSize || item.dimensions || '',
    parameters,
    application: item.application || '',
    selling_points: item.selling_points || '',
    remark: item.customRequirement || '',
    lineRemark: item.customRequirement || item.lineRemark || ''
  };
}

function customMarkedName(name) {
  const value = String(name || '').trim();
  if (!value) return '【异型】';
  return value.includes('【异型】') ? value : `【异型】${value}`;
}

function limitText(value, maxLength) {
  const text = String(value || '')
    .replace(/\r/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).replace(/[，,。；;、\s]+$/g, '')}...`;
}

function copyRowStyle(sheet, sourceRowNumber, targetRowNumber) {
  const source = sheet.getRow(sourceRowNumber);
  const target = sheet.getRow(targetRowNumber);
  source.eachCell({ includeEmpty: true }, (cell, colNumber) => {
    const targetCell = target.getCell(colNumber);
    targetCell.style = JSON.parse(JSON.stringify(cell.style || {}));
    targetCell.numFmt = cell.numFmt;
    targetCell.alignment = cell.alignment ? { ...cell.alignment } : undefined;
    targetCell.border = cell.border ? JSON.parse(JSON.stringify(cell.border)) : undefined;
    targetCell.fill = cell.fill ? JSON.parse(JSON.stringify(cell.fill)) : undefined;
  });
}

module.exports = { createQuote };
