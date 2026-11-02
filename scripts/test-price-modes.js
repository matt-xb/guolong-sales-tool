const assert = require('assert/strict');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const source = fs.readFileSync(path.join(__dirname, '../src/renderer/app.js'), 'utf8');
const context = vm.createContext({ state: { priceMode: 'base' } });
vm.runInContext(source.match(/^function \w+\([^\n]*\) \{[\s\S]*?^\}/gm).join('\n'), context);
context.isEnglishMode = () => false;
context.uiText = zh => zh;
const item = { id: 1, name: 'Synthetic item', price: 1000, quantity: 3 };
for (let repeat = 0; repeat < 3; repeat++) {
  for (const [mode, price] of [['normal', 1020], ['special', 1120], ['base', 1000]]) {
    context.state.priceMode = mode;
    assert.equal(context.priceForMode(item.price), price);
    assert.equal(context.materializeSelectedItemForExport(item).price, price);
    assert.equal(context.materializeSelectedItemForExport(item).quantity, 3);
    assert.match(context.renderSelectedPriceInput(item), new RegExp(`value="${price}"`));
    for (const empty of [null, undefined, '']) assert.equal(context.priceForMode(empty), empty);
    assert.equal(context.priceForMode(0), 0);
  }
}
context.state.priceMode = 'normal';
assert.equal(context.priceForMode(19.99), 20.39);
assert.equal(context.priceForMode(0.25), 0.26);
context.updateSelectedField(item, 'price', '999.99');
assert.equal(context.materializeSelectedItemForExport(item).price, '999.99');
context.state.priceMode = 'special';
assert.equal(context.selectedPrice(item), 1120);
context.updateSelectedField(item, 'price', '');
assert.equal(context.selectedPrice(item), '');
context.state.priceMode = 'hidden';
assert.equal(context.renderPriceMeta(1000), '');
assert.equal(context.renderSelectedPriceInput(item), '');
assert.equal(context.materializeSelectedItemForExport(item).price, 0);
context.state.priceMode = 'normal';
assert.equal(context.selectedPrice(item), '999.99');
assert.equal(item.price, 1000);
context.updateSelectedField(item, 'quantity', '4');
assert.equal(item.quantity, '4');
assert.equal((source.match(/updateSelectedField\(item, input.dataset.field, input.value\)/g) || []).length, 3);
assert(!source.includes('showPrices'));
async function testWorkbookPrices() {
  const os = require('os');
  const ExcelJS = require('exceljs');
  const { createContract } = require('../src/main/contractExporter');
  const { createQuote } = require('../src/main/quoteExporter');
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'sales-price-modes-'));
  try {
    for (const mode of ['base', 'normal', 'special', 'hidden']) {
      context.state.priceMode = mode;
      const exported = context.materializeSelectedItemForExport({ ...item, priceOverrides: undefined });
      for (const name of ['contract-template.xlsx', 'contract-template-normal.xlsx', 'quote-template.xlsx', 'quote-template （English）.xlsx']) {
        const outputPath = path.join(directory, `${mode}-${name}`);
        await (name.startsWith('contract') ? createContract : createQuote)({
          templatePath: path.join(__dirname, '..', 'templates', name), outputPath,
          payload: { customerName: 'Synthetic Buyer', baseDir: directory, items: [exported] }
        });
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(outputPath);
        const sheet = workbook.worksheets[0];
        let found = false;
        sheet.eachRow(row => {
          if (row.getCell(6).value === exported.price && row.getCell(7).value?.formula === `F${row.number}*E${row.number}`) {
            assert.equal(row.getCell(7).value.result || 0, Number(exported.quantity) * exported.price);
            found = true;
          }
        });
        assert(found, `${mode} ${name}: price and amount row missing`);
      }
    }
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
  }
}
testWorkbookPrices().then(() => console.log('Four price modes: rounding, empty prices, repeat switching, per-mode edits and all four workbook exports passed.')).catch(error => {
  console.error(error);
  process.exitCode = 1;
});
