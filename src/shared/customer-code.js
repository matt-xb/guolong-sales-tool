let pinyin;

try {
  ({ pinyin } = require('pinyin-pro'));
} catch {
  pinyin = null;
}

const COMPANY_TYPE_SUFFIXES = [
  '有限责任公司',
  '股份有限公司',
  '集团有限公司',
  '有限公司',
  '公司'
];

function normalizeCustomerNameForCode(companyName) {
  const source = String(companyName || '').trim();
  const suffix = COMPANY_TYPE_SUFFIXES.find((item) => source.endsWith(item));
  const withoutSuffix = suffix ? source.slice(0, -suffix.length) : source;
  return Array.from(withoutSuffix)
    .filter((char) => /[\u4e00-\u9fff]/.test(char))
    .join('');
}

function generateCustomerCode(companyName) {
  const chineseName = normalizeCustomerNameForCode(companyName);
  if (!chineseName || !pinyin) return '';

  return Array.from(chineseName)
    .map((char) => {
      const value = pinyin(char, {
        pattern: 'first',
        toneType: 'none',
        type: 'array'
      });
      return String(Array.isArray(value) ? value[0] : value || '')
        .replace(/[^A-Za-z]/g, '')
        .toUpperCase();
    })
    .join('');
}

function normalizeRegistryName(name) {
  return String(name || '').replace(/\s+/g, '').trim();
}

function resolveUniqueCustomerCode(companyName, existingEntries = []) {
  const baseCode = generateCustomerCode(companyName);
  if (!baseCode) return '';

  const normalizedName = normalizeRegistryName(companyName);
  const entries = Array.isArray(existingEntries) ? existingEntries : [];
  const existingForName = entries.find((entry) => normalizeRegistryName(entry?.customerName) === normalizedName);
  if (existingForName?.customerCode) return String(existingForName.customerCode).toUpperCase();

  const usedCodes = new Set(entries
    .map((entry) => String(entry?.customerCode || '').trim().toUpperCase())
    .filter(Boolean));
  if (!usedCodes.has(baseCode)) return baseCode;

  let sequence = 2;
  while (usedCodes.has(`${baseCode}${sequence}`)) sequence += 1;
  return `${baseCode}${sequence}`;
}

module.exports = {
  generateCustomerCode,
  normalizeCustomerNameForCode,
  resolveUniqueCustomerCode
};
