const assert = require('assert/strict');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

// Load declarations in source order so duplicate legacy functions resolve as in the renderer.
const source = fs.readFileSync(path.join(__dirname, '../src/renderer/app.js'), 'utf8');
const context = vm.createContext({});
vm.runInContext(source.match(/^function \w+\([^\n]*\) \{[\s\S]*?^\}/gm).join('\n'), context);
const parse = text => JSON.parse(JSON.stringify(context.parseInvoiceInfoFields(text)));
const fields = {
  name: '示例酒店用品有限公司', bank: '示例银行城北支行', account: '456789012345',
  bankLineNo: '', taxNo: '91320000MA1234567X', address: '示例市城区示例路19号商业街1幢211室-7',
  contact: '', phone: '13912345678', bankNo: ''
};
function sample(addressLabel = '地址及电话', bankLabel = '开户行及银行账号') {
  return `开票资料\n名称：${fields.name}\n纳税人识别号：${fields.taxNo}\n${addressLabel}：${fields.address} ${fields.phone}\n${bankLabel}：${fields.bank} ${fields.account}`;
}
assert.deepEqual(parse(sample()), fields);
for (const label of ['地址、电话', '地址电话', '单位地址', '地址']) assert.deepEqual(parse(sample(label)), fields);
assert.deepEqual(parse(sample() + '\n联行号：123456789012'), { ...fields, bankLineNo: '123456789012', bankNo: '123456789012' });
assert.deepEqual(parse('123456789012\n' + sample()), { ...fields, bankLineNo: '123456789012', bankNo: '123456789012' });
assert.equal(parse(sample().replace('室-7', '室-77')).bankNo, '');
assert.equal(parse(sample().replace('室-7', '室-7').replace(' ' + fields.phone, ' 139 1234 5678')).bankNo, '');
assert.equal(context.normalizeInvoiceInfoForView(sample()), context.invoiceFieldsToText(context.parseInvoiceInfo(sample())));
console.log('Synthetic invoice compound labels, address suffix, phone and bank line number regressions passed.');
