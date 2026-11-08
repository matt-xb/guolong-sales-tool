const assert = require('assert/strict');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const root = path.join(__dirname, '../src/renderer');
const source = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const boot = html.match(/<script>([\s\S]*?)<\/script>/)[1];
function setup(saved, blocked = false) {
  const buttons = Array.from({ length: 2 }, () => {
    const text = {};
    const label = { querySelector: () => text };
    return { text, closest: () => label, setAttribute(key, value) { this[key] = value; } };
  });
  const document = { documentElement: { dataset: {} }, querySelectorAll: () => buttons };
  const localStorage = {
    getItem() { if (blocked) throw Error('blocked'); return saved; },
    setItem(key, value) { if (blocked) throw Error('blocked'); assert.equal(key, 'sales-theme'); saved = value; }
  };
  const context = vm.createContext({ document, localStorage, uiText: zh => zh });
  vm.runInContext(boot, context);
  vm.runInContext(source.match(/^function (?:updateThemeControls|toggleTheme)\([^\n]*\) \{[\s\S]*?^\}/gm).join('\n'), context);
  return { context, document, buttons, saved: () => saved };
}
for (const value of [null, '', 'invalid', 'light', 'dark']) {
  const test = setup(value);
  assert.equal(test.document.documentElement.dataset.theme, value === 'dark' ? 'dark' : 'light');
  test.context.updateThemeControls();
  for (let index = 0; index < 4; index++) {
    const before = test.document.documentElement.dataset.theme;
    test.context.toggleTheme();
    const dark = before !== 'dark';
    assert.equal(test.saved(), dark ? 'dark' : 'light');
    for (const button of test.buttons) {
      assert.equal(button.text.textContent, dark ? '夜间' : '白天');
      assert.equal(button.checked, dark);
      assert.equal(button['aria-label'], '夜间主题');
    }
    assert.equal(setup(test.saved()).document.documentElement.dataset.theme, dark ? 'dark' : 'light');
  }
  test.context.uiText = (_zh, en) => en;
  test.context.updateThemeControls();
  assert.equal(test.buttons[0].text.textContent, test.document.documentElement.dataset.theme === 'dark' ? 'Night' : 'Day');
}
const blocked = setup(null, true);
assert.equal(blocked.document.documentElement.dataset.theme, 'light');
assert.doesNotThrow(() => blocked.context.toggleTheme());
assert.equal(blocked.document.documentElement.dataset.theme, 'dark');
assert.equal((html.match(/class="theme-toggle" type="checkbox" role="switch"/g) || []).length, 2);
assert.match(source, /input\.addEventListener\('change', toggleTheme\)/);
console.log('Theme startup, persistence, labels, repeated switching and blocked storage passed.');
