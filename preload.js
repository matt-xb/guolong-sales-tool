const { contextBridge, ipcRenderer, webUtils } = require('electron');
let pinyin;

try {
  ({ pinyin } = require('pinyin-pro'));
} catch {
  pinyin = null;
}

function generateCustomerCode(companyName) {
  const source = String(companyName || '').trim();
  const suffixes = ['有限责任公司', '股份有限公司', '集团有限公司', '有限公司', '公司'];
  const suffix = suffixes.find((item) => source.endsWith(item));
  const chineseName = Array.from(suffix ? source.slice(0, -suffix.length) : source)
    .filter((char) => /[\u4e00-\u9fff]/.test(char))
    .join('');
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

function normalizeCustomerCodePolyphones(value) {
  return String(value || '').replace(/莘/g, '辛');
}

function makeCustomerCode(name) {
  return generateCustomerCode(name);
}

function normalizeCustomerNameForCode(name) {
  let source = String(name || '')
    .trim()
    .replace(/[（(].*?[）)]/g, '')
    .replace(/[^\u4e00-\u9fa5A-Za-z0-9]/g, '');

  source = stripTrailingWords(source, [
    '有限责任公司',
    '股份有限公司',
    '餐饮管理有限公司',
    '食品科技有限公司',
    '食品机械有限公司',
    '厨房设备有限公司',
    '不锈钢制品有限公司',
    '餐饮有限公司',
    '设备有限公司',
    '有限公司',
    '公司',
    '工厂',
    '设备厂'
  ]);

  return source;
}

function stripTrailingWords(value, words) {
  let result = String(value || '');
  let changed = true;
  while (changed) {
    changed = false;
    for (const word of words) {
      if (result.length > word.length + 2 && result.endsWith(word)) {
        result = result.slice(0, -word.length);
        changed = true;
        break;
      }
    }
  }
  return result;
}

function fallbackCustomerCode(source) {
  return Array.from(String(source || ''))
    .map((char) => {
      if (/[A-Za-z0-9]/.test(char)) return char.toUpperCase();
      return FALLBACK_INITIALS[char] || '';
    })
    .join('')
    .slice(0, 16);
}

const FALLBACK_INITIALS = buildFallbackInitials({
  A: '阿安鞍奥爱皖',
  B: '八巴白百班宝北本比宾亳博宝',
  C: '餐仓苍曹测岑茶昌常超朝车郴成诚承城池赤崇楚川创春慈从翠厨',
  D: '大代丹德登邓迪点电东都渡端段',
  E: '鄂恩尔二',
  F: '发繁方房飞肥丰佛福阜富',
  G: '改甘赣高格工公古谷固广贵桂国郭果',
  H: '哈海邯杭合河贺黑衡红宏洪湖华淮淮黄惠汇慧徽霍航环怀淮弘',
  J: '机吉济佳嘉建江交焦胶揭金津晋京净九酒莒巨聚君钧经节洁',
  K: '开凯康科克库昆葵',
  L: '来莱兰廊乐雷丽利立连联梁聊辽临林灵六龙泸鲁路洛绿吕旅老',
  M: '马茂美门蒙绵闽明铭牡木',
  N: '南内宁农',
  O: '欧瓯',
  P: '攀彭平萍普蒲',
  Q: '七齐企祁启千黔青清庆琼曲泉群全',
  R: '日荣瑞润',
  S: '三厦山陕汕商上绍深沈生盛石实食蜀双顺司苏宿遂穗市',
  T: '台太泰唐天铁同铜通吐特',
  W: '万威潍温文乌无芜五武物西味魏芜皖',
  X: '西咸湘襄萧孝新信星兴邢徐许宣学旬迅祥小县乡香校',
  Y: '雅烟盐扬阳杨宜义益银英永优友渝榆豫元岳云运烟亿饮验',
  Z: '枣张漳湛肇浙镇郑中舟周珠株诸资淄自邹遵州驻筑准卓州州长'
});

function buildFallbackInitials(groups) {
  const result = {};
  Object.entries(groups).forEach(([initial, chars]) => {
    Array.from(chars).forEach((char) => {
      result[char] = initial;
    });
  });
  return result;
}

contextBridge.exposeInMainWorld('salesApi', {
  getMeta: () => ipcRenderer.invoke('meta:get'),
  getProgramUpdateResult: () => ipcRenderer.invoke('update:get-result'),
  listItems: (filters) => ipcRenderer.invoke('items:list', filters),
  getItem: (id) => ipcRenderer.invoke('items:get', id),
  saveItem: (item) => ipcRenderer.invoke('items:save', item),
  deleteItem: (id) => ipcRenderer.invoke('items:delete', id),
  pickImage: (options) => ipcRenderer.invoke('images:pick', options),
  pickInventoryFile: () => ipcRenderer.invoke('inventory:pick-file'),
  getDroppedFilePath: (file) => webUtils.getPathForFile(file),
  previewInventoryFile: (filePath) => ipcRenderer.invoke('inventory:preview', filePath),
  applyInventoryFile: (filePath) => ipcRenderer.invoke('inventory:apply', filePath),
  createContract: (payload) => ipcRenderer.invoke('contract:create', payload),
  createQuote: (payload) => ipcRenderer.invoke('quote:create', payload),
  listRecentFiles: () => ipcRenderer.invoke('recent:list'),
  openRecentFile: (filePath) => ipcRenderer.invoke('recent:open', filePath),
  revealRecentFile: (filePath) => ipcRenderer.invoke('recent:reveal', filePath),
  openAfterSalesVideo: () => ipcRenderer.invoke('after-sales-video:open'),
  copyMaterialFile: (relativePath) => ipcRenderer.invoke('materials:copy', relativePath),
  attachMaterialFile: (payload) => ipcRenderer.invoke('materials:attach', payload),
  removeMaterialFile: (payload) => ipcRenderer.invoke('materials:remove', payload),
  copyProductImage: (itemId, imageIndex = 0) => ipcRenderer.invoke('images:copy-product', itemId, imageIndex),
  addProductImages: (itemId) => ipcRenderer.invoke('images:add-product', itemId),
  replaceProductImage: (itemId, imagePath) => ipcRenderer.invoke('images:replace-product', itemId, imagePath),
  removeProductImage: (itemId, imagePath) => ipcRenderer.invoke('images:remove-product', itemId, imagePath),
  checkUpdate: () => ipcRenderer.invoke('update:check'),
  startUpdate: () => ipcRenderer.invoke('update:start'),
  startDataRefresh: () => ipcRenderer.invoke('data-refresh:start'),
  getDataRefreshResult: () => ipcRenderer.invoke('data-refresh:get-result'),
  getPendingReleaseNotes: () => ipcRenderer.invoke('release-notes:get-pending'),
  acknowledgeReleaseNotes: (version) => ipcRenderer.invoke('release-notes:ack', version),
  resolveCustomerCode: (customerName) => ipcRenderer.invoke('customer-code:resolve', customerName),
  generateCustomerCode,
  makeCustomerCode,
  showInputContextMenu: () => ipcRenderer.send('context-menu:input')
});

contextBridge.exposeInMainWorld('electronAPI', {
  copyMaterialFile: (relativePath) => ipcRenderer.invoke('materials:copy', relativePath),
  attachMaterialFile: (payload) => ipcRenderer.invoke('materials:attach', payload),
  removeMaterialFile: (payload) => ipcRenderer.invoke('materials:remove', payload),
  copyProductImage: (itemId, imageIndex = 0) => ipcRenderer.invoke('images:copy-product', itemId, imageIndex)
});
