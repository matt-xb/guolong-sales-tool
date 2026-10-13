const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const ExcelJS = require('exceljs');
const { initDatabase } = require('../src/main/database');
const { createContract } = require('../src/main/contractExporter');
const { createQuote } = require('../src/main/quoteExporter');
const { validateMaterialExtension, isManagedImportedMaterialPath } = require('../src/main/material-files');

(async () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'sales-open-source-'));
  try {
    const database = await initDatabase(path.join(directory, 'sales.sqlite'));
    assert.deepStrictEqual(database.listItems(), []);
    database.saveItem({ type: 'equipment', name: 'Test Product', model: 'TEST', price: 1, category: 'Test' });
    const item = database.listItems({ keyword: 'Test Product' })[0];
    assert(item && item.price === 1);
    assert.strictEqual(validateMaterialExtension('energyReport', 'test.PDF'), 'pdf');
    assert.throws(() => validateMaterialExtension('energyReport', 'test.docx'), /不支持/);
    assert(isManagedImportedMaterialPath('materials/user-imports/energyReport/test.pdf'));
    assert.strictEqual(database.updateItemDocument(item.id, 'energyReport', 'materials/energy-reports/test.pdf').documents.energyReport, 'materials/energy-reports/test.pdf');
    assert.deepStrictEqual(database.updateItemDocument(item.id, 'energyReport', '').documents, {});
    const payload = { customerName: 'Test Buyer', items: [{ ...item, quantity: 2, qty: 2 }], baseDir: directory };
    for (const name of ['contract-template.xlsx', 'contract-template-normal.xlsx', 'quote-template.xlsx', 'quote-template （English）.xlsx']) {
      const outputPath = path.join(directory, name);
      const exportFile = name.startsWith('contract') ? createContract : createQuote;
      await exportFile({ templatePath: path.join(__dirname, '..', 'templates', name), outputPath, payload });
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.readFile(outputPath);
      assert(workbook.worksheets.length && fs.statSync(outputPath).size > 0);
    }
    const main = fs.readFileSync(path.join(__dirname, '..', 'main.js'), 'utf8');
    assert(main.includes("sharePass: process.env.SALES_SHARE_PASSWORD || (edition.company ? process.env.GUOLONG_SHARE_PASS : '') || ''"));
    assert(main.includes("defaultSourcePath: process.env.SALES_UPDATE_SOURCE || edition.updateSource || ''"));
    assert(!fs.existsSync(path.join(__dirname, '..', 'data', 'seed-sales.sqlite')));
    console.log('Empty database, synthetic product, four template exports and private-data exclusions passed.');
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
  }
})().catch(error => { console.error(error.message); process.exitCode = 1; });
