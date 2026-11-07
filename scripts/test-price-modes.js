const assert = require('assert/strict');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const source = fs.readFileSync(path.join(__dirname, '../src/renderer/app.js'), 'utf8');
const context = vm.createContext({ state: { priceMode: 'base' } });
vm.runInContext(source.match(/^function \w+\([^\n]*\) \{[\s\S]*?^\}/gm).join('\n'), context);
context.isEnglishMode = () => false;
context.uiText = zh => zh;
const control = { setAttribute(name, value) { this[name] = value; } };
const output = {};
context.el = { priceMode: control };
context.document = { querySelector: () => output };
for (const [index, mode] of ['hidden', 'base', 'normal', 'special'].entries()) {
  context.state.priceMode = mode;
  context.updatePriceModeControl();
  assert.equal(control.value, index);
  assert.equal(control['aria-valuetext'], ['隐藏', '基础价', '普票 +2%', '专票 +12%'][index]);
  assert.equal(output.textContent, control['aria-valuetext']);
}
const markup = fs.readFileSync(path.join(__dirname, '../src/renderer/index.html'), 'utf8');
assert.match(markup, /id="priceMode" type="range" min="0" max="3" step="1" value="1"/);
assert.match(source, /el\.priceMode\.addEventListener\('input'/);
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
const product = { ...item, price: 100 };
const line = { ...product };
context.state.priceMode = 'base';
context.updateSelectedField(line, 'price', '200');
for (let repeat = 0; repeat < 3; repeat++) {
  for (const [mode, price] of [['normal', 204], ['special', 224], ['base', 200]]) {
    context.state.priceMode = mode;
    assert.equal(context.selectedPrice(line), price);
    assert.equal(context.materializeSelectedItemForExport(line).price, price);
    assert.match(context.renderSelectedPriceInput(line), new RegExp(`value="${price}"`));
    assert.match(context.renderPriceMeta(product.price), /￥100</);
  }
}
assert.equal(product.price, 100);
context.state.priceMode = 'normal';
context.updateSelectedField(line, 'price', '306');
assert.equal(context.selectedPrice(line), 306);
context.state.priceMode = 'special';
assert.equal(context.selectedPrice(line), 336);
context.state.priceMode = 'base';
assert.equal(context.selectedPrice(line), 300);
context.updateSelectedField(line, 'price', '');
for (const mode of ['normal', 'special', 'base']) {
  context.state.priceMode = mode;
  assert.equal(context.selectedPrice(line), '');
}
context.updateSelectedField(line, 'price', '0');
assert.equal(context.selectedPrice(line), 0);
context.state.priceMode = 'hidden';
assert.match(context.renderPriceMeta(1000), /￥1,000</);
assert.equal(context.renderSelectedPriceInput(item), '');
assert.equal(context.materializeSelectedItemForExport(item).price, 0);
assert.equal(item.price, 1000);
context.state.priceMode = 'base';
context.updateSelectedField(item, 'price', '200');
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
      const exported = context.materializeSelectedItemForExport(item);
      assert.equal(exported.price, { base: 200, normal: 204, special: 224, hidden: 0 }[mode]);
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
