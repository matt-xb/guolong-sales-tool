const ExcelJS = require('exceljs');
const fs = require('fs');

const DETAIL_START_ROW = 6;
const DETAIL_END_ROW = 10;
const AMOUNT_WORDS_TEMPLATE_ROW = 11;
const CONTRACT_BODY_TEMPLATE_ROW = 12;
const PAYMENT_TEMPLATE_ROW = 15;
const PRODUCT_INFO_FONT_SIZE = 11;
const PRODUCT_INFO_ROW_HEIGHT = 285;
const CONTRACT_TERM_ROW_HEIGHT = 36;
const OTHER_TERMS_ROW_HEIGHT = 63;
const OTHER_TERMS_TEXT = [
  '七、其他约定事项',
  '1、本合同一式二份，供需双方各执一份，双方盖章签字后生效。',
  '2、未尽事宜，双方可再协商解决或再另行签订补充合同。',
  '3、本合同所有款项须通过双方对公账户进行转账，不接受个人账户转账。'
];

async function createContract({ templatePath, outputPath, payload }) {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(templatePath);

  const sheet = workbook.getWorksheet('Sheet1') || workbook.worksheets[0];
  if (!sheet) throw new Error('合同模板没有可用工作表。');

  validateContractTemplate(sheet, templatePath);

  const items = payload.items || [];
  const amountWordsTemplateRow = findAmountWordsTemplateRow(sheet);
  const amountWordsFormula = captureFormulaCell(sheet, `B${amountWordsTemplateRow}`);
  const extraRows = ensureDetailRows(sheet, items.length);
  const totalRow = 11 + extraRows;
  const amountWordsRow = amountWordsTemplateRow + extraRows;
  const productInfoRow = amountWordsRow + 1;

  writeMerged(sheet, 'F2', payload.contractNo || '');
  writeMerged(sheet, 'B3', payload.customerName || '');
  writeMerged(sheet, 'F3', payload.contractDate || '');

  clearDetailRows(sheet, Math.max(items.length, DETAIL_END_ROW - DETAIL_START_ROW + 1));
  items.forEach((item, index) => writeDetailRow(sheet, DETAIL_START_ROW + index, item, index + 1));

  const total = items.reduce((sum, item) => {
    const qty = Number(item.quantity || 0);
    const price = Number(item.price || 0);
    return sum + qty * price;
  }, 0);
  sheet.getCell(`E${totalRow}`).value = { formula: `SUM(G${DETAIL_START_ROW}:G${DETAIL_START_ROW + Math.max(items.length, 1) - 1})`, result: total };
  restoreAmountWordsFormula(sheet, amountWordsRow, amountWordsFormula, totalRow, total);
  normalizeAmountRowBorders(sheet, amountWordsRow);

  const contractBodyRow = CONTRACT_BODY_TEMPLATE_ROW + extraRows;
  const productInfoRows = writeProductInfoRows(sheet, productInfoRow, items, contractBodyRow);
  const paymentRow = PAYMENT_TEMPLATE_ROW + extraRows + productInfoRows;
  const deliveryDateRow = paymentRow + 1;
  const deliveryMethodRow = paymentRow + 3;
  const freightRow = paymentRow + 4;
  const buyerInvoiceRow = paymentRow + 11;

  [paymentRow, deliveryDateRow, deliveryMethodRow, freightRow].forEach((rowNumber) => {
    sheet.getRow(rowNumber).height = CONTRACT_TERM_ROW_HEIGHT;
  });

  writeMerged(sheet, `C${paymentRow}`, payload.payment || '');
  writeMerged(sheet, `C${deliveryDateRow}`, payload.deliveryDate || '');
  writeMerged(sheet, `C${deliveryMethodRow}`, payload.deliveryMethod || '');
  writeMerged(sheet, `C${freightRow}`, payload.freight || '');
  writeMerged(sheet, `E${buyerInvoiceRow}`, normalizeBuyerInvoiceInfo(payload.buyerInvoiceInfo || ''), {
    horizontal: 'left',
    vertical: 'top'
  });
  writeOtherTerms(sheet);
  normalizeBuyerStampBorders(sheet);

  workbook.calcProperties.fullCalcOnLoad = true;
  await workbook.xlsx.writeFile(outputPath);
  await validateGeneratedContractFile(outputPath, {
    items,
    totalRow,
    amountWordsRow,
    total,
    productInfoRow,
    productInfoRows,
    paymentRow,
    deliveryDateRow,
    deliveryMethodRow,
    freightRow
  });
}

function captureFormulaCell(sheet, address) {
  const cell = sheet.getCell(address);
  const formula = getCellFormula(cell);
  if (!formula) return null;
  return {
    formula,
    result: cell.value?.result,
    style: JSON.parse(JSON.stringify(cell.style || {})),
    numFmt: cell.numFmt,
    alignment: cell.alignment ? { ...cell.alignment } : undefined,
    border: cell.border ? JSON.parse(JSON.stringify(cell.border)) : undefined,
    fill: cell.fill ? JSON.parse(JSON.stringify(cell.fill)) : undefined
  };
}

function getCellFormula(cell) {
  const value = cell.value;
  if (value && typeof value === 'object' && value.formula) return value.formula;
  return '';
}

function validateContractTemplate(sheet, templatePath) {
  const failures = [];
  if (!getCellFormula(sheet.getCell('B11'))) failures.push('B11 must be a formula cell');
  if (!getCellFormula(sheet.getCell('E11'))) failures.push('E11 must be the total amount formula cell');
  const contractBodyTitle = String(sheet.getCell('A12').value || '');
  if (!contractBodyTitle.includes('合同内容')) failures.push('A12 must contain 合同内容');
  const paymentTitle = String(sheet.getCell('A15').value || '');
  if (!paymentTitle.includes('付款方式')) failures.push('A15 must contain 付款方式');
  if (failures.length) {
    throw new Error(`合同模板自检失败：${templatePath}\n${failures.join('\n')}`);
  }
}

async function validateGeneratedContractFile(outputPath, context) {
  if (!fs.existsSync(outputPath)) throw new Error(`合同生成后未找到文件：${outputPath}`);
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(outputPath);
  const sheet = workbook.getWorksheet('Sheet1') || workbook.worksheets[0];
  if (!sheet) throw new Error('合同生成后预检失败：没有可用工作表。');

  const {
    items,
    totalRow,
    amountWordsRow,
    total,
    productInfoRow,
    productInfoRows,
    paymentRow,
    deliveryDateRow,
    deliveryMethodRow,
    freightRow
  } = context;
  const failures = [];
  const amountFormula = getCellFormula(sheet.getCell(`B${amountWordsRow}`));
  const totalFormula = getCellFormula(sheet.getCell(`E${totalRow}`));
  const expectedTotalEnd = DETAIL_START_ROW + Math.max(items.length, 1) - 1;
  const productInfoText = String(sheet.getCell(`A${amountWordsRow + 1}`).value || '');
  const contractBodyText = String(sheet.getCell(`A${amountWordsRow + 1 + productInfoRows}`).value || '');

  for (let index = 0; index < productInfoRows; index += 1) {
    const rowNumber = productInfoRow + index;
    if (sheet.getRow(rowNumber).height !== PRODUCT_INFO_ROW_HEIGHT) {
      failures.push(`产品基础信息行高异常：${rowNumber}`);
    }
  }
  [paymentRow, deliveryDateRow, deliveryMethodRow, freightRow].forEach((rowNumber) => {
    if (sheet.getRow(rowNumber).height !== CONTRACT_TERM_ROW_HEIGHT) {
      failures.push(`合同条款行高异常：${rowNumber}`);
    }
  });
  validateOtherTerms(sheet, failures);

  if (!amountFormula || !amountFormula.includes(`E${totalRow}`)) {
    failures.push(`人民币大写公式异常：B${amountWordsRow}`);
  }
  if (sheet.getCell(`B${amountWordsRow}`).value?.result !== toChineseMoney(total)) {
    failures.push(`人民币大写缓存异常：B${amountWordsRow}`);
  }
  if (!totalFormula || !totalFormula.includes(`G${DETAIL_START_ROW}:G${expectedTotalEnd}`)) {
    failures.push(`小写金额公式异常：E${totalRow}`);
  }
  if (items[0]?.name && !productInfoText.includes(items[0].name)) {
    failures.push('产品基础信息不是本次选择的产品。');
  }
  if (items[0]?.parameters && !productInfoText.includes(items[0].parameters)) {
    failures.push('产品基础信息与本次选择的产品参数不一致。');
  }
  if (!contractBodyText.includes('合同内容')) {
    failures.push('合同内容标题位置异常。');
  }
  failures.push(...getAmountRowBorderFailures(sheet, amountWordsRow));
  failures.push(...getProductInfoBorderFailures(sheet, amountWordsRow + 1, productInfoRows));
  failures.push(...getBuyerStampBorderFailures(sheet));
  if (failures.length) {
    throw new Error(`合同生成后预检失败：\n${failures.join('\n')}`);
  }
}

function writeOtherTerms(sheet) {
  const rowNumber = findRowContainingText(sheet, OTHER_TERMS_TEXT[0]);
  if (!rowNumber) throw new Error('合同模板中未找到“七、其他约定事项”。');
  const cell = sheet.getCell(`A${rowNumber}`);
  const baseFont = JSON.parse(JSON.stringify(cell.font || {}));
  cell.value = {
    richText: OTHER_TERMS_TEXT.map((text, index) => ({
      text: index < OTHER_TERMS_TEXT.length - 1 ? `${text}\n` : text,
      font: index === 3
        ? { ...baseFont, color: { argb: 'FFFF0000' } }
        : baseFont
    }))
  };
  cell.alignment = {
    ...(cell.alignment || {}),
    horizontal: 'left',
    vertical: 'middle',
    wrapText: true
  };
  sheet.getRow(rowNumber).height = OTHER_TERMS_ROW_HEIGHT;
}

function validateOtherTerms(sheet, failures) {
  const rowNumber = findRowContainingText(sheet, OTHER_TERMS_TEXT[0]);
  if (!rowNumber) {
    failures.push('未找到“七、其他约定事项”。');
    return;
  }
  if (sheet.getRow(rowNumber).height !== OTHER_TERMS_ROW_HEIGHT) {
    failures.push(`其他约定事项行高异常：${rowNumber}`);
  }
  const richText = sheet.getCell(`A${rowNumber}`).value?.richText;
  const actualText = Array.isArray(richText)
    ? richText.map((part) => part.text).join('')
    : sheet.getCell(`A${rowNumber}`).text;
  if (actualText !== OTHER_TERMS_TEXT.join('\n')) {
    failures.push('其他约定事项内容异常。');
  }
  const thirdClause = Array.isArray(richText)
    ? richText.find((part) => String(part.text || '').startsWith('3、'))
    : null;
  if (thirdClause?.font?.color?.argb !== 'FFFF0000') {
    failures.push('其他约定事项第三条未标红。');
  }
}

function findAmountWordsTemplateRow(sheet) {
  if (getCellFormula(sheet.getCell(`B${AMOUNT_WORDS_TEMPLATE_ROW}`))) {
    return AMOUNT_WORDS_TEMPLATE_ROW;
  }
  return AMOUNT_WORDS_TEMPLATE_ROW;
}

function restoreAmountWordsFormula(sheet, amountWordsRow, captured, totalRow, total) {
  if (!captured) return;
  const cell = sheet.getCell(`B${amountWordsRow}`);
  cell.value = {
    formula: updateAmountWordsFormula(captured.formula, totalRow),
    result: toChineseMoney(total)
  };
  cell.style = JSON.parse(JSON.stringify(captured.style || {}));
  cell.numFmt = captured.numFmt;
  cell.alignment = captured.alignment ? { ...captured.alignment } : undefined;
  cell.border = captured.border ? JSON.parse(JSON.stringify(captured.border)) : undefined;
  cell.fill = captured.fill ? JSON.parse(JSON.stringify(captured.fill)) : undefined;
}

function normalizeAmountRowBorders(sheet, rowNumber) {
  const borders = {
    A: ['top', 'left', 'bottom', 'right'],
    B: ['top', 'left', 'bottom'],
    C: ['top', 'bottom', 'right'],
    D: ['top', 'bottom', 'right'],
    E: ['top', 'left', 'bottom'],
    F: ['top', 'bottom', 'right'],
    G: ['top', 'bottom', 'right'],
    H: ['top', 'left', 'bottom', 'right']
  };
  Object.entries(borders).forEach(([column, edges]) => {
    sheet.getCell(`${column}${rowNumber}`).border = createThinBorder(edges);
  });
}

function normalizeProductInfoRowBorders(sheet, rowNumber) {
  setRangeOuterThinBorder(sheet, rowNumber, 'A', 'H');
}

function normalizeBuyerStampBorders(sheet) {
  const rowNumber = findRowContainingText(sheet, '需方（盖章）');
  if (!rowNumber) return;
  setRangeOuterThinBorder(sheet, rowNumber, 'E', 'H');
}

function createThinBorder(edges) {
  return edges.reduce((border, edge) => {
    border[edge] = { style: 'thin' };
    return border;
  }, {});
}

function setRangeOuterThinBorder(sheet, rowNumber, startCol, endCol) {
  const start = columnToNumber(startCol);
  const end = columnToNumber(endCol);
  for (let col = start; col <= end; col += 1) {
    const cell = sheet.getRow(rowNumber).getCell(col);
    cell.border = {
      ...(cell.border || {}),
      top: { style: 'thin' },
      bottom: { style: 'thin' },
      ...(col === start ? { left: { style: 'thin' } } : {}),
      ...(col === end ? { right: { style: 'thin' } } : {})
    };
  }
}

function getAmountRowBorderFailures(sheet, rowNumber) {
  const failures = [];
  const expected = {
    A: ['top', 'left', 'bottom', 'right'],
    B: ['top', 'left', 'bottom'],
    C: ['top', 'bottom', 'right'],
    D: ['top', 'bottom', 'right'],
    E: ['top', 'left', 'bottom'],
    F: ['top', 'bottom', 'right'],
    G: ['top', 'bottom', 'right'],
    H: ['top', 'left', 'bottom', 'right']
  };
  Object.entries(expected).forEach(([column, requiredEdges]) => {
    const border = sheet.getCell(`${column}${rowNumber}`).border || {};
    ['top', 'left', 'bottom', 'right'].forEach((edge) => {
      const shouldExist = requiredEdges.includes(edge);
      const exists = border[edge]?.style === 'thin';
      if (shouldExist && !exists) {
        failures.push(`合计金额行边框缺失：${column}${rowNumber}.${edge}`);
      }
      if (!shouldExist && exists) {
        failures.push(`合计金额行边框多余：${column}${rowNumber}.${edge}`);
      }
    });
  });
  return failures;
}

function getProductInfoBorderFailures(sheet, startRow, rowCount) {
  const failures = [];
  for (let index = 0; index < rowCount; index += 1) {
    failures.push(...getRangeOuterBorderFailures(sheet, startRow + index, 'A', 'H', '产品基础信息'));
  }
  return failures;
}

function getBuyerStampBorderFailures(sheet) {
  const rowNumber = findRowContainingText(sheet, '需方（盖章）');
  if (!rowNumber) return ['需方盖章行未找到'];
  return getRangeOuterBorderFailures(sheet, rowNumber, 'E', 'H', '需方盖章');
}

function getRangeOuterBorderFailures(sheet, rowNumber, startCol, endCol, label) {
  const failures = [];
  const start = columnToNumber(startCol);
  const end = columnToNumber(endCol);
  for (let col = start; col <= end; col += 1) {
    const address = `${numberToColumn(col)}${rowNumber}`;
    const border = sheet.getCell(address).border || {};
    if (border.top?.style !== 'thin') failures.push(`${label}边框缺失：${address}.top`);
    if (border.bottom?.style !== 'thin') failures.push(`${label}边框缺失：${address}.bottom`);
    if (col === start && border.left?.style !== 'thin') failures.push(`${label}边框缺失：${address}.left`);
    if (col === end && border.right?.style !== 'thin') failures.push(`${label}边框缺失：${address}.right`);
  }
  return failures;
}

function findRowContainingText(sheet, text) {
  for (let row = 1; row <= sheet.rowCount; row += 1) {
    for (let col = 1; col <= 8; col += 1) {
      const cell = sheet.getRow(row).getCell(col);
      if (String(cell.text || cell.value || '').includes(text)) return row;
    }
  }
  return 0;
}

function updateAmountWordsFormula(formula, totalRow) {
  return String(formula || '').replace(/\bE\d+\b/g, `E${totalRow}`);
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
    const rowNumber = DETAIL_START_ROW + i;
    ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].forEach((col) => {
      sheet.getCell(`${col}${rowNumber}`).value = null;
    });
    sheet.getCell(`G${rowNumber}`).value = { formula: `F${rowNumber}*E${rowNumber}`, result: 0 };
  }
}

function writeDetailRow(sheet, row, item, index) {
  item = normalizeExportItem(item);
  sheet.getCell(`A${row}`).value = index;
  sheet.getCell(`B${row}`).value = item.name || '';
  sheet.getCell(`C${row}`).value = item.model || '';
  sheet.getCell(`D${row}`).value = item.unit || (item.type === 'part' ? '件' : '台');
  sheet.getCell(`E${row}`).value = Number(item.quantity || 1);
  sheet.getCell(`F${row}`).value = item.price === '' || item.price === null || item.price === undefined ? null : Number(item.price);
  sheet.getCell(`G${row}`).value = { formula: `F${row}*E${row}`, result: Number(item.quantity || 1) * Number(item.price || 0) };
  sheet.getCell(`H${row}`).value = item.lineRemark || item.remark || '';
  enableWrap(sheet, row, ['B', 'C', 'D', 'H']);
  sheet.getRow(row).height = Math.max(sheet.getRow(row).height || 17, estimateDetailRowHeight(item));
}

function writeMerged(sheet, address, value, alignment = {}) {
  sheet.getCell(address).value = value;
  sheet.getCell(address).alignment = {
    ...(sheet.getCell(address).alignment || {}),
    wrapText: true,
    vertical: 'middle',
    ...alignment
  };
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
  const lines = Math.max(
    estimateWrappedLines(item.name, 8),
    estimateWrappedLines(item.model, 12),
    estimateWrappedLines(item.lineRemark || item.remark, 8)
  );
  if (lines <= 1) return 24;
  return Math.min(112, 20 + lines * 18);
}

function estimateWrappedLines(value, charsPerLine) {
  const text = String(value || '').trim();
  if (!text) return 1;
  return text.split(/\r?\n/).reduce((sum, line) => {
    const length = String(line || '').trim().length;
    return sum + Math.max(1, Math.ceil(length / charsPerLine));
  }, 0);
}

function normalizeBuyerInvoiceInfo(input) {
  const raw = String(input || '').trim();
  if (!raw) return '';

  const fields = {
    name: '',
    bank: '',
    account: '',
    bankNo: '',
    taxNo: '',
    address: '',
    contact: '',
    phone: ''
  };

  parseInvoiceInfo(raw, fields);

  return [
    `名称：${fields.name}`,
    `开户行：${fields.bank}`,
    `账号：${fields.account}`,
    `行号：${fields.bankNo}`,
    `税号：${fields.taxNo}`,
    `地址：${fields.address}`,
    `联系人：${fields.contact}`,
    `电话：${fields.phone}`
  ].join('\n');
}

function parseInvoiceInfo(raw, fields) {
  const normalized = normalizeInvoiceText(raw);

  parseHeaderValueBlock(normalized, fields);

  const labelRules = [
    ['bankAndAccount', /(?:开户行及账号|开户银行及账号|开户行和账号|开户行账号|开户银行账号|开户银行账户|银行账户|[\u4e00-\u9fa5A-Za-z]*账户)\s*:/g],
    ['addressAndPhone', /(?:地址、电话|地址电话|地址及电话)\s*:/g],
    ['name', /(?:发票抬头|抬头|公司名称|单位名称|开票名称|企业名称|学校名称|名称|户名)\s*:/g],
    ['bank', /(?:[\u4e00-\u9fa5A-Za-z]*开户行|开户银行)\s*:/g],
    ['account', /(?:[\u4e00-\u9fa5A-Za-z]*账号|银行账号|账户|帐号|账号)\s*:/g],
    ['bankNo', /(?:行号|联行号)\s*:/g],
    ['taxNo', /(?:税号|纳税人识别号|统一社会信用代码|信用代码|企业代码|学校信用代码)\s*:/g],
    ['address', /(?:注册地址|公司地址|单位地址|地址)\s*:/g],
    ['contact', /(?:联系人|经办人)\s*:/g],
    ['phone', /(?:联系电话|手机号|手机|电话)\s*:/g]
  ];

  const matches = [];
  labelRules.forEach(([key, regex]) => {
    for (const match of normalized.matchAll(regex)) {
      matches.push({ key, index: match.index, end: match.index + match[0].length });
    }
  });
  const orderedMatches = removeOverlappingMatches(matches);

  orderedMatches.forEach((match, index) => {
    const next = orderedMatches[index + 1];
    const rawValue = normalized.slice(match.end, next ? next.index : normalized.length);
    if (match.key === 'bankAndAccount') {
      assignBankAndAccount(rawValue, fields);
      return;
    }
    if (match.key === 'addressAndPhone') {
      assignAddressAndPhone(rawValue, fields);
      return;
    }
    if (match.key === 'taxNo') {
      assignTaxNameAddress(rawValue, rawValue.split('\n'), fields);
      return;
    }
    const value = cleanInvoiceValue(rawValue, match.key);
    if (value && !fields[match.key]) fields[match.key] = value;
  });

  const bankNoFromParentheses = normalized.match(/[（(]\s*行号\s*:\s*([0-9]{12})\s*[）)]/);
  if (!fields.bankNo && bankNoFromParentheses) fields.bankNo = bankNoFromParentheses[1];

  guessInvoiceInfo(normalized, fields);
}

function normalizeInvoiceText(raw) {
  return String(raw || '')
    .replace(/\r/g, '\n')
    .replace(/\u00a0/g, ' ')
    .replace(/\u3000/g, ' ')
    .replace(/[：:]/g, ':')
    .replace(/[；;]/g, '\n')
    .split('\n')
    .map((line) => {
      const index = line.indexOf(':');
      if (index < 0) return line.trim();
      const label = line.slice(0, index).replace(/\s+/g, '').replace(/帐/g, '账');
      const value = line.slice(index + 1).trim();
      return `${label}:${value}`;
    })
    .join('\n')
    .trim();
}

function removeOverlappingMatches(matches) {
  return matches
    .sort((a, b) => a.index - b.index || b.end - b.index - (a.end - a.index))
    .filter((match, index, sorted) => {
      const previous = sorted
        .slice(0, index)
        .find((item) => item.index <= match.index && item.end > match.index);
      return !previous;
    });
}

function parseHeaderValueBlock(text, fields) {
  const lines = String(text || '').split('\n').map((line) => line.trim()).filter(Boolean);
  const headerKeys = [];
  let valueStart = -1;

  for (let i = 0; i < lines.length; i += 1) {
    const key = keyForLooseHeader(lines[i]);
    if (key && valueStart < 0) {
      headerKeys.push(key);
      continue;
    }
    valueStart = i;
    break;
  }

  if (!headerKeys.length || valueStart < 0) return;
  const values = lines.slice(valueStart);
  let valueIndex = 0;

  headerKeys.forEach((key) => {
    const value = values[valueIndex] || '';
    if (!value) return;

    if (key === 'taxAddress') {
      assignTaxAndAddress(value, fields);
      valueIndex += 1;
      return;
    }
    if (key === 'taxNo') {
      assignTaxNameAddress(value, values.slice(valueIndex), fields);
      valueIndex += 1;
      return;
    }
    if (key === 'bankAndAccount') {
      assignBankAndAccount(value, fields);
      valueIndex += 1;
      return;
    }
    if (key === 'email') {
      valueIndex += 1;
      return;
    }
    if (fields[key]) return;
    const cleaned = cleanInvoiceValue(value, key);
    if (cleaned && !fields[key]) fields[key] = cleaned;
    valueIndex += 1;
  });
}

function keyForLooseHeader(line) {
  const text = String(line || '').replace(/\s+/g, '').replace(/帐/g, '账');
  if (/^(税号|纳税人识别号|企业代码|统一社会信用代码)$/.test(text)) return 'taxAddress';
  if (/^(学校信用代码)$/.test(text)) return 'taxNo';
  if (/^(单位地址|公司地址|地址)$/.test(text)) return 'address';
  if (/^(电话|联系电话|手机|手机号)$/.test(text)) return 'phone';
  if (/^(开户银行|开户行)$/.test(text)) return 'bank';
  if (/^(银行账户|银行账号|账号|账户|帐号)$/.test(text)) return 'account';
  if (/^(行号|联行号)$/.test(text)) return 'bankNo';
  if (/^(发票抬头|抬头|名称|公司名称|单位名称|企业名称|学校名称)$/.test(text)) return 'name';
  if (/^(收票邮箱|邮箱|电子邮箱)$/.test(text)) return 'email';
  return '';
}

function assignTaxAndAddress(value, fields) {
  const compact = String(value || '').replace(/\s+/g, '');
  const tax = compact.match(/[0-9A-Z]{15,20}/i);
  if (tax && !fields.taxNo) fields.taxNo = tax[0].toUpperCase();
  const address = tax ? compact.slice(tax.index + tax[0].length).replace(/^编辑/, '') : compact;
  if (address && !fields.address) fields.address = address;
}

function assignTaxNameAddress(value, values, fields) {
  const joined = values.join('\n');
  const tax = joined.match(/[0-9A-Z]{15,20}/i);
  if (tax && !fields.taxNo) fields.taxNo = tax[0].toUpperCase();
  if (!fields.name) {
    const beforeTax = tax ? joined.slice(0, tax.index).trim() : value;
    const name = beforeTax.split('\n').map((line) => line.trim()).filter(Boolean)[0];
    if (name) fields.name = name;
  }
  if (!fields.address && tax) {
    const afterTax = joined.slice(tax.index + tax[0].length).split('\n').map((line) => line.trim()).filter(Boolean)[0];
    if (afterTax) fields.address = afterTax;
  }
}

function assignBankAndAccount(value, fields) {
  let text = cleanInvoiceValue(value).replace(/账户/g, '').trim();
  const account = text.match(/([0-9][0-9\s]{8,28}[0-9])\s*$/);
  if (account) {
    if (!fields.account) fields.account = account[1].replace(/\s+/g, '');
    const bank = text.slice(0, account.index).trim();
    if (bank && !fields.bank) fields.bank = bank;
  } else if (text && !fields.bank) {
    fields.bank = text;
  }
}

function assignAddressAndPhone(value, fields) {
  const text = cleanInvoiceValue(value, 'address');
  const phone = text.match(/(?:1[3-9]\d{9}|0\d{2,3}[- ]?\d{7,8})/);
  if (phone) {
    if (!fields.phone) fields.phone = phone[0];
    const address = text.replace(phone[0], '').trim();
    if (address && !fields.address) fields.address = address;
  } else if (text && !fields.address) {
    fields.address = text;
  }
}

function guessInvoiceInfo(text, fields) {
  const compact = String(text || '').replace(/\s+/g, ' ');
  const numbersCompact = String(text || '').replace(/\s+/g, '');
  if (!fields.name) {
    const name = compact.match(/[\u4e00-\u9fa5A-Za-z0-9（）()]{2,40}(?:公司|有限公司|集团|厂|店|学校|幼儿园)/);
    if (name) fields.name = name[0];
  }
  if (!fields.taxNo) {
    const tax = numbersCompact.match(/[0-9A-Z]{15,20}/i);
    if (tax) fields.taxNo = tax[0].toUpperCase();
  }
  if (!fields.phone) {
    const phone = compact.match(/(?:1[3-9]\d{9}|0\d{2,3}[- ]?\d{7,8})/);
    if (phone && !isInsideKnownNumber(phone[0], fields)) fields.phone = phone[0];
  }
  if (!fields.account) {
    const account = numbersCompact.match(/\d{12,30}/);
    if (account && account[0] !== fields.phone && account[0] !== fields.taxNo) fields.account = account[0];
  }
}

function isInsideKnownNumber(value, fields) {
  return [fields.account, fields.taxNo, fields.bankNo]
    .filter(Boolean)
    .some((known) => String(known).includes(value));
}

function cleanInvoiceValue(value, key = '') {
  let text = String(value || '');
  if (key === 'bank') text = text.split(/或转|也可转|或者转/)[0];
  if (key === 'name') {
    return text.replace(/[，,]/g, ' ').replace(/\n+/g, ' ').replace(/\s+/g, ' ').trim();
  }
  if (key === 'address') {
    return text.replace(/[，,]/g, ' ').replace(/\s+/g, '').trim();
  }
  text = text
    .replace(/[，,]/g, ' ')
    .replace(/\n+/g, ' ')
    .replace(/[（）()]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (key === 'bankNo') {
    const match = text.match(/\d{12}/);
    return match ? match[0] : text;
  }
  if (key === 'account') {
    const match = text.replace(/\s+/g, '').match(/[0-9]{10,30}/);
    return match ? match[0] : text;
  }
  if (key === 'taxNo') {
    const match = text.replace(/\s+/g, '').match(/[0-9A-Z]{15,20}/i);
    return match ? match[0].toUpperCase() : text;
  }
  return text;
}

function writeProductInfoRows(sheet, startRow, items, styleSourceRow = startRow) {
  const chunks = buildProductInfoChunks(items);
  sheet.insertRows(startRow, Array.from({ length: chunks.length }, () => []));
  const shiftedStyleSourceRow = styleSourceRow + chunks.length;

  chunks.forEach((chunk, index) => {
    const rowNumber = startRow + index;
    copyRowStyle(sheet, shiftedStyleSourceRow, rowNumber);
    forceMergeAcross(sheet, rowNumber, 'A', 'H');
    writeMerged(sheet, `A${rowNumber}`, chunk);
    setRowFontSize(sheet, rowNumber, 'A', 'H', PRODUCT_INFO_FONT_SIZE);
    normalizeProductInfoRowBorders(sheet, rowNumber);
    sheet.getRow(rowNumber).height = PRODUCT_INFO_ROW_HEIGHT;
  });

  return chunks.length;
}

function setRowFontSize(sheet, rowNumber, startCol, endCol, size) {
  const start = columnToNumber(startCol);
  const end = columnToNumber(endCol);
  for (let col = start; col <= end; col += 1) {
    const cell = sheet.getRow(rowNumber).getCell(col);
    cell.font = {
      ...(cell.font || {}),
      size
    };
  }
}

function forceMergeAcross(sheet, rowNumber, startCol, endCol) {
  unmergeCellsOnRow(sheet, rowNumber);
  clearCellsAcross(sheet, rowNumber, startCol, endCol);
  const range = `${startCol}${rowNumber}:${endCol}${rowNumber}`;
  try {
    sheet.mergeCells(range);
  } catch (_error) {
    // ExcelJS may already know about this range after row insertion; ignore.
  }
}

function unmergeCellsOnRow(sheet, rowNumber) {
  const mergeModels = Object.values(sheet._merges || {});
  mergeModels.forEach((merge) => {
    const model = merge.model || merge;
    if (model.top <= rowNumber && model.bottom >= rowNumber) {
      const range = `${numberToColumn(model.left)}${model.top}:${numberToColumn(model.right)}${model.bottom}`;
      try {
        sheet.unMergeCells(range);
      } catch (_error) {
        // Ignore ranges already removed by a prior unmerge.
      }
    }
  });
}

function clearCellsAcross(sheet, rowNumber, startCol, endCol) {
  const start = columnToNumber(startCol);
  const end = columnToNumber(endCol);
  for (let col = start; col <= end; col += 1) {
    sheet.getRow(rowNumber).getCell(col).value = null;
  }
}

function columnToNumber(column) {
  return String(column || '')
    .toUpperCase()
    .split('')
    .reduce((sum, char) => sum * 26 + char.charCodeAt(0) - 64, 0);
}

function numberToColumn(number) {
  let result = '';
  let value = number;
  while (value > 0) {
    const remainder = (value - 1) % 26;
    result = String.fromCharCode(65 + remainder) + result;
    value = Math.floor((value - 1) / 26);
  }
  return result;
}

function estimateProductInfoRowHeight(text) {
  const visualLines = String(text || '').split(/\r?\n/).reduce((sum, line) => {
    const length = String(line || '').trim().length;
    return sum + Math.max(1, Math.ceil(length / 88));
  }, 0);
  return Math.min(409, Math.max(42, Math.ceil(10 + visualLines * 13.5)));
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

function buildProductInfo(items) {
  items = items.map(normalizeExportItem);
  const equipments = items.filter((item) => item.type !== 'part');
  const parts = items.filter((item) => item.type === 'part');
  const lines = ['产品基础信息：'];

  equipments.forEach((item, index) => {
    lines.push('');
    lines.push(`${toChineseIndex(index + 1)}、${item.name || ''}`);
    if (item.model) lines.push(`设备型号：${item.model}`);
    if (item.parameters) lines.push(`设备基本参数：${item.parameters}`);
    if (item.remark) lines.push(`备注：${item.remark}`);
  });

  if (parts.length) {
    lines.push('');
    lines.push('配件信息：');
    parts.forEach((item, index) => {
      lines.push(`${index + 1}、${item.name || ''}${item.model ? `，型号：${item.model}` : ''}`);
    });
  }

  return lines.join('\n');
}

function buildProductInfoChunks(items) {
  items = items.map(normalizeExportItem);
  const equipments = items.filter((item) => item.type !== 'part');
  const parts = items.filter((item) => item.type === 'part');
  const chunks = [];

  equipments.forEach((item, index) => {
    const lines = [];
    if (index === 0) lines.push('产品基础信息：', '');
    lines.push(`${toChineseIndex(index + 1)}、${item.name || ''}`);
    if (item.model) lines.push(`设备型号：${item.model}`);
    if (item.parameters) lines.push(`设备基本参数：${item.parameters}`);
    if (item.remark) lines.push(`备注：${item.remark}`);
    chunks.push(lines.join('\n'));
  });

  if (parts.length) {
    const lines = ['配件信息：'];
    parts.forEach((item, index) => {
      lines.push(`${index + 1}、${item.name || ''}${item.model ? `，型号：${item.model}` : ''}`);
    });
    chunks.push(lines.join('\n'));
  }

  return chunks.length ? chunks : ['产品基础信息：'];
}

function toChineseIndex(num) {
  const map = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
  if (num <= 10) return map[num];
  return String(num);
}

function toChineseMoney(amount) {
  const fraction = ['角', '分'];
  const digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
  const unit = [
    ['元', '万', '亿'],
    ['', '拾', '佰', '仟']
  ];
  const head = amount < 0 ? '负' : '';
  let n = Math.abs(amount);
  let s = '';

  fraction.forEach((item, index) => {
    s += (digit[Math.floor(n * 10 * Math.pow(10, index)) % 10] + item).replace(/零./, '');
  });
  s = s || '整';
  n = Math.floor(n);

  for (let i = 0; i < unit[0].length && n > 0; i += 1) {
    let p = '';
    for (let j = 0; j < unit[1].length && n > 0; j += 1) {
      p = digit[n % 10] + unit[1][j] + p;
      n = Math.floor(n / 10);
    }
    s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
  }

  return head + s
    .replace(/(零.)*零元/, '元')
    .replace(/(零.)+/g, '零')
    .replace(/^整$/, '零元整');
}

module.exports = { createContract, normalizeBuyerInvoiceInfo };
