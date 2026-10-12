const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

function buildInventoryPreview(filePath, items) {
  if (!filePath || !fs.existsSync(filePath)) {
    throw new Error('库存表格不存在，请重新选择文件。');
  }
  const workbook = XLSX.readFile(filePath, { cellDates: false });
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  if (!worksheet) throw new Error('库存表格没有可读取的工作表。');

  const candidates = [];
  const skipped = [];

  collectInventoryCandidates(candidates, skipped, worksheet);

  const matchedById = new Map();
  for (const candidate of candidates) {
    if (candidate.stock === null) {
      skipped.push({ source: candidate.source, label: candidate.rawLabel, reason: '库存数量为空或不是数字。' });
      continue;
    }
    const matches = findInventoryItem(items, candidate);
    if (matches.length !== 1) {
      skipped.push({
        source: candidate.source,
        label: candidate.rawLabel,
        reason: matches.length === 0 ? '数据库没有找到唯一对应商品。' : '数据库匹配到多个商品，需确认后再导入。'
      });
      continue;
    }
    const item = matches[0];
    const existing = matchedById.get(item.id);
    if (existing) {
      existing.stock = String(Number(existing.stock || 0) + Number(candidate.stock || 0));
      existing.source = `${existing.source}; ${candidate.source}`;
      existing.label = `${existing.label}; ${candidate.rawLabel}`;
      continue;
    }
    matchedById.set(item.id, {
      id: item.id,
      name: item.name,
      model: item.model || '',
      category: item.category || '',
      capacity: candidate.capacity,
      stock: String(candidate.stock),
      previousStock: String(item.stock_qty ?? '').trim(),
      source: candidate.source,
      label: candidate.rawLabel
    });
  }
  const matched = Array.from(matchedById.values());

  return {
    filePath,
    fileName: path.basename(filePath),
    sheetName: workbook.SheetNames[0],
    matched,
    skipped
  };
}

function collectInventoryCandidates(candidates, skipped, worksheet) {
  collectSectionCandidates(candidates, worksheet, 'A', 'B', [
    section('燃烧机摇摆汤锅', '燃烧机摇摆汤锅', capacityBetween(100, 600, capacityRowExcluding(/全304|外壳304|内外304|分体盖/))),
    section('燃烧机摇摆炒锅', '燃烧机摇摆炒锅', capacityBetween(150, 150, capacityRowExcluding(/全304|外壳304/))),
    section('自吸风摇摆汤锅', '自吸风摇摆汤锅', capacityBetween(100, 600, capacityRowExcluding(/全304|外壳304|内外304|分体盖/))),
    section('全预混摇摆汤锅', '全预混摇摆汤锅', capacityBetween(100, 600, capacityRowExcluding(/全304|外壳304|内外304|分体盖/))),
    section('全预混摇摆炒锅', '全预混摇摆炒锅', capacityBetween(150, 150, capacityRowExcluding(/全304|外壳304/)))
  ]);

  collectSectionCandidates(candidates, worksheet, 'V', 'W', [
    section('全钢钢架304电加热', '全钢可倾电热夹层锅', exactCapacityIn([100, 200, 300, 400, 500, 600]))
  ]);

  collectSectionCandidates(candidates, worksheet, 'AJ', 'AK', [
    section('全钢成型', '全钢钢架可倾蒸汽夹层锅', capacityBetween(100, 600, capacityRowExcluding(/内[456]|全304|无支架|深/))),
    section('全钢立式成型', '立式蒸汽夹层锅（全钢）', exactCapacityIn([70, 100, 200, 300, 400, 500, 600, 800]))
  ]);

  collectSpecialPotCandidates(candidates, skipped, worksheet);
  addUnhandledStockRows(candidates, skipped, worksheet);
}

function section(headerText, productName, accept) {
  return { headerText, productName, accept };
}

function collectSectionCandidates(candidates, worksheet, labelColumn, stockColumn, sections) {
  const range = getWorksheetRange(worksheet);
  const labelCol = XLSX.utils.decode_col(labelColumn);
  const stockCol = XLSX.utils.decode_col(stockColumn);
  let activeSection = null;

  for (let row = range.s.r; row <= range.e.r; row += 1) {
    const label = cleanCellText(getCellValue(worksheet, row, labelCol));
    if (!label) continue;

    const matchedSection = sections.find((item) => label === item.headerText);
    if (matchedSection) {
      activeSection = matchedSection;
      continue;
    }

    if (!activeSection) continue;
    if (!extractCapacity(label)) {
      activeSection = null;
      continue;
    }
    if (!activeSection.accept(label)) continue;

    addCandidateFromRow(candidates, worksheet, row, labelCol, stockCol, activeSection.productName, extractCapacity(label), activeSection.headerText);
  }
}

function collectSpecialPotCandidates(candidates, skipped, worksheet) {
  const range = getWorksheetRange(worksheet);
  const labelCol = XLSX.utils.decode_col('AQ');
  const stockCol = XLSX.utils.decode_col('AR');

  for (let row = range.s.r; row <= range.e.r; row += 1) {
    const label = cleanCellText(getCellValue(worksheet, row, labelCol));
    if (!label) continue;

    if (/天然气熄火保护全自动/.test(label)) {
      const capacity = cookingMachineCapacity(label);
      if (capacity) {
        addCandidateFromRow(candidates, worksheet, row, labelCol, stockCol, '燃气全自动炒菜机', capacity, label);
        continue;
      }
    }

    if (/电磁全自动/.test(label) && !/无机芯/.test(label)) {
      const capacity = cookingMachineCapacity(label);
      if (capacity) {
        addCandidateFromRow(candidates, worksheet, row, labelCol, stockCol, '电磁全自动炒菜机', capacity, label);
        continue;
      }
    }

    if (/天然气漂烫锅/.test(label) && /熄火保护/.test(label)) {
      addCandidateFromRow(candidates, worksheet, row, labelCol, stockCol, '自动翻转漂汤锅（燃气）', extractCapacity(label), label);
      continue;
    }

    if (/蒸汽.*漂烫锅/.test(label)) {
      addCandidateFromRow(candidates, worksheet, row, labelCol, stockCol, '自动翻转漂汤锅（蒸汽）', extractCapacity(label), label);
      continue;
    }

    if (/150L节能燃气搅拌/.test(label) && /搅拌变频/.test(label)) {
      addCandidateFromRow(candidates, worksheet, row, labelCol, stockCol, '全预混自动炒锅', '150L', label);
      continue;
    }

    if (/650L节能燃气多爪行星搅拌/.test(label) && !/304内胆/.test(label)) {
      addCandidateFromRow(candidates, worksheet, row, labelCol, stockCol, '燃气全自动多爪行星炒锅', '650L', label);
      continue;
    }

    if (/600L节能燃气卤煮锅/.test(label)) {
      addCandidateFromRow(candidates, worksheet, row, labelCol, stockCol, '燃气节能型方形卤煮锅', '600L', label);
      continue;
    }

    if (/200L电加热煮粥机/.test(label)) {
      addCandidateFromRow(candidates, worksheet, row, labelCol, stockCol, '智能煮粥机', '200L', label);
      continue;
    }

    addSpecialPotSkipped(skipped, worksheet, row, labelCol, stockCol, label);
  }
}

function addCandidateFromRow(candidates, worksheet, row, labelCol, stockCol, productName, capacity, sourceName) {
  const rawLabel = cleanCellText(getCellValue(worksheet, row, labelCol));
  const stock = parseStockValue(getCellValue(worksheet, row, stockCol));
  const labelCell = XLSX.utils.encode_cell({ r: row, c: labelCol });
  const stockCell = XLSX.utils.encode_cell({ r: row, c: stockCol });
  candidates.push({
    productName,
    capacity,
    stock,
    rawLabel,
    source: `${labelCell}:${stockCell} ${sourceName}`
  });
}

function addSpecialPotSkipped(skipped, worksheet, row, labelCol, stockCol, label) {
  const reason = getSpecialPotSkipReason(label);
  if (!reason) return;
  const stock = getCellValue(worksheet, row, stockCol);
  const labelCell = XLSX.utils.encode_cell({ r: row, c: labelCol });
  const stockCell = XLSX.utils.encode_cell({ r: row, c: stockCol });
  skipped.push({ source: `${labelCell}:${stockCell}`, label: formatSkippedLabel(label, stock), reason });
}

function getSpecialPotSkipReason(label) {
  if (/节能燃气全自动/.test(label)) return '节能燃气全自动炒菜机：产品暂未录入。';
  if (normalizeCellText(label) === '800电磁') return '800电磁不是电磁全自动炒菜机，当前先不统计。';
  if (/电磁全自动/.test(label) && /无机芯/.test(label)) return '电磁全自动无机芯：特殊状态，未统计。';
  if (/液化气/.test(label)) return '液化气库存：按确认规则不统计。';
  if (/天然气漂烫锅/.test(label) && !/熄火保护/.test(label)) return '天然气漂烫锅未标“熄火保护”，待确认。';
  if (/电加热/.test(label) && /控制箱竖放/.test(label)) return '电加热控制箱竖放：特殊状态，未统计。';
  if (/导热油/.test(label)) return '全自动行星搅拌导热油：当前未建立确认映射。';
  if (/高压锅|大包锅|蒸汽电动倾倒|蒸汽保温可倾/.test(label) || normalizeCellText(label) === '300L蒸汽') return '高压锅/大包锅/蒸汽异型锅：当前未建立确认映射。';
  if (/节能燃气铸铁炒锅搅拌/.test(label)) return '节能燃气铸铁炒锅搅拌：未确认是否并入全预混自动炒锅。';
  if (/电磁炒锅搅拌|节能炒锅搅拌|江苏智厨产品|型节能燃气|调味机|大锅灶/.test(label)) return '后续异型/智厨/调味/大锅灶等项目：当前未建立确认映射。';
  if (/650L节能燃气多爪行星搅拌/.test(label) && /304内胆/.test(label)) return '多爪行星搅拌304内胆：特殊材质，未统计。';
  return '';
}

function addUnhandledStockRows(candidates, skipped, worksheet) {
  const handledSources = new Set([
    ...candidates.map((entry) => sourceCellRange(entry.source)),
    ...skipped.map((entry) => sourceCellRange(entry.source))
  ].filter(Boolean));
  const pairs = [
    ['A', 'B'],
    ['V', 'W'],
    ['AJ', 'AK'],
    ['AQ', 'AR']
  ];
  const range = getWorksheetRange(worksheet);

  pairs.forEach(([labelColumn, stockColumn]) => {
    const labelCol = XLSX.utils.decode_col(labelColumn);
    const stockCol = XLSX.utils.decode_col(stockColumn);
    for (let row = range.s.r; row <= range.e.r; row += 1) {
      const label = cleanCellText(getCellValue(worksheet, row, labelCol));
      const stockValue = getCellValue(worksheet, row, stockCol);
      const stock = parseStockValue(stockValue);
      if (!label || stock === null || stock === 0 || isInventorySummaryRow(label)) continue;

      const source = `${XLSX.utils.encode_cell({ r: row, c: labelCol })}:${XLSX.utils.encode_cell({ r: row, c: stockCol })}`;
      if (handledSources.has(source)) continue;
      skipped.push({
        source,
        label: formatSkippedLabel(label, stockValue),
        reason: '未识别库存项目，需确认映射后再导入。'
      });
      handledSources.add(source);
    }
  });
}

function sourceCellRange(source) {
  const match = String(source || '').match(/[A-Z]+\d+:[A-Z]+\d+/);
  return match ? match[0] : '';
}

function isInventorySummaryRow(label) {
  const text = cleanCellText(label);
  if (/合计|备注|成品库存表|今日结存/.test(text)) return true;
  return ['CCC款', '电加热', '304蒸汽', '异形锅'].includes(text);
}

function getWorksheetRange(worksheet) {
  return XLSX.utils.decode_range(worksheet['!ref'] || 'A1:A1');
}

function capacityBetween(min, max, baseAccept) {
  return (label) => {
    if (!baseAccept(label)) return false;
    const capacity = capacityNumber(label);
    return capacity >= min && capacity <= max;
  };
}

function capacityRowExcluding(pattern) {
  return (label) => {
    if (!extractCapacity(label)) return false;
    return !pattern.test(label);
  };
}

function exactCapacityIn(values) {
  const allowed = new Set(values);
  return (label) => {
    if (!/^\d+(?:\.\d+)?\s*(?:L|升)$/i.test(cleanCellText(label))) return false;
    return allowed.has(capacityNumber(label));
  };
}

function capacityNumber(value) {
  const match = String(value || '').match(/(\d+(?:\.\d+)?)\s*(?:L|升)?/i);
  return match ? Number(match[1]) : 0;
}

function cookingMachineCapacity(label) {
  const size = capacityNumber(label);
  if (size === 700) return '350L';
  if (size === 800) return '500L';
  if (size === 900) return '650L';
  return '';
}

function cleanCellText(value) {
  return String(value || '').replace(/\s+/g, ' ').trim();
}

function normalizeCellText(value) {
  return cleanCellText(value).replace(/\s+/g, '');
}

function getCellValue(worksheet, row, column) {
  const cell = worksheet[XLSX.utils.encode_cell({ r: row, c: column })];
  return cell ? cell.v : '';
}

function parseStockValue(value) {
  if (value === null || value === undefined || value === '') return null;
  const match = String(value).match(/-?\d+(?:\.\d+)?/);
  return match ? Number(match[0]) : null;
}

function extractCapacity(value) {
  const match = String(value || '').match(/(\d+(?:\.\d+)?)\s*(?:L|升)?/i);
  return match ? `${Number(match[1])}L` : '';
}

function findInventoryItem(items, candidate) {
  return items.filter((item) => {
    if (item.type !== 'equipment') return false;
    if (item.name !== candidate.productName) return false;
    if (candidate.productName === '电磁全自动炒菜机' && item.category !== '滚筒炒菜机类') return false;
    return extractItemCapacity(item) === candidate.capacity;
  });
}

function extractItemCapacity(item) {
  const source = `${item.remark || ''}\n${item.parameters || ''}`;
  const match = source.match(/(?:容量|锅体容量)\s*[：:]?\s*([0-9]+(?:\.[0-9]+)?\s*(?:L|升)?)/);
  return match ? extractCapacity(match[1]) : '';
}

function formatSkippedLabel(label, stock) {
  const left = String(label || '').trim() || '空白项';
  const right = String(stock ?? '').trim();
  return right ? `${left}：${right}` : left;
}

module.exports = {
  buildInventoryPreview
};
