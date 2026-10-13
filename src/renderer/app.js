const CATEGORIES = [
  '汤锅类',
  '炒锅类',
  '直立式行星炒锅类',
  '滚筒炒菜机类',
  '自动多功能炒锅类',
  '卤煮漂汤类',
  '高压锅类',
  '智能类',
  '异型类'
];

const PART_CATEGORIES = [
  '普通类',
  'CCC类'
];

const DEFAULT_QUOTE_REMARK_ZH = '备注：主要填写含不含税运，设备不含安装费用，设备整机质保一年，可以终身免费远程技术指导';
const DEFAULT_QUOTE_REMARK_EN = 'The quoted price includes tax and shipping; installation costs are not included. The equipment comes with a one-year full-unit warranty and lifetime free remote technical guidance.';

const CATEGORY_EN = {
  '汤锅类': 'Soup Kettles',
  '炒锅类': 'Tilting Woks',
  '直立式行星炒锅类': 'Vertical Planetary Woks',
  '滚筒炒菜机类': 'Drum Cooking Machines',
  '自动多功能炒锅类': 'Automatic Multi-function Woks',
  '卤煮漂汤类': 'Brining & Blanching',
  '高压锅类': 'Pressure Kettles',
  '智能类': 'Smart Equipment',
  '异型类': 'Custom Items',
  '普通类': 'Standard Parts',
  'CCC类': 'CCC Parts'
};

const FIELD_EN = {
  '型号': 'Model',
  '尺寸': 'Dimensions',
  '规格': 'Specification',
  '价格': 'Price',
  '单价': 'Unit Price',
  '数量': 'Quantity',
  '备注': 'Remarks',
  '外型尺寸': 'Overall dimensions',
  '设备外型尺寸': 'Overall dimensions',
  '设备基本参数': 'Basic Parameters',
  '设备应用场景': 'Applications',
  '主要卖点': 'Key Selling Points',
  '额定燃气压力': 'Rated gas pressure',
  '额定热负荷': 'Rated heat load',
  '额定电压': 'Rated voltage',
  '额定频率': 'Rated frequency',
  '额定功率': 'Rated power',
  '电压': 'Voltage',
  '加热额定功率': 'Rated heating power',
  '电热功率': 'Electric heating power',
  '电磁功率': 'Induction heating power',
  '热负荷': 'Heat load',
  '搅拌功率': 'Stirring power',
  '倾倒电机功率': 'Tilting motor power',
  '旋转电机功率': 'Rotation motor power',
  '电机功率': 'Motor power',
  '翻锅功率': 'Pot tilting power',
  '液压功率': 'Hydraulic power',
  '液压站尺寸': 'Hydraulic station dimensions',
  '接口': 'Connection',
  '燃气接口': 'Gas connection',
  '进气口': 'Gas inlet',
  '进水口': 'Water inlet',
  '执行标准': 'Standard',
  '燃气种类': 'Gas type',
  '燃气压力': 'Gas pressure',
  '天然气压力': 'Natural gas pressure',
  '额定压力': 'Rated pressure',
  '锅内额定压力': 'Inner pot rated pressure',
  '使用年限': 'Service life',
  '耗气量': 'Gas consumption',
  '导热油量': 'Thermal oil volume',
  '出厂状态': 'Factory condition',
  '设备重量': 'Equipment weight',
  '重量': 'Weight',
  '容量': 'Capacity',
  '锅体容量': 'Kettle capacity',
  '容积': 'Volume',
  '锅内直径': 'Inner pot diameter',
  '内锅直径': 'Inner pot diameter',
  '锅内径': 'Inner pot diameter',
  '内胆直径': 'Inner pot diameter',
  '网筐内径': 'Basket inner diameter',
  '网框内径': 'Basket inner diameter',
  '网筐尺寸': 'Basket dimensions',
  '网框尺寸': 'Basket dimensions',
  '网筐抬起尺寸': 'Basket raised dimensions',
  '网框抬起尺寸': 'Basket raised dimensions',
  '锅体直径': 'Pot diameter',
  '锅口直径': 'Pot opening diameter',
  '锅口径': 'Pot opening diameter',
  '锅内深度': 'Inner pot depth',
  '内锅深度': 'Inner pot depth',
  '深度': 'Depth',
  '蒸汽耗气量': 'Steam consumption',
  '工作压力': 'Working pressure',
  '内外锅胆': 'Inner and outer pot',
  '支架': 'Frame',
  '内锅材质': 'Inner pot material',
  '支架外壳材质': 'Frame and housing material',
  '外壳支架材质': 'Housing and frame material',
  '材质': 'Material',
  '火力说明': 'Heat output note',
  '证书编号': 'Certificate No.'
};

const PRODUCT_NAME_EN = {
  '自吸风摇摆汤锅': 'Self-priming Tilting Soup Kettle',
  '燃烧机摇摆汤锅': 'Burner Tilting Soup Kettle',
  '全预混摇摆汤锅': 'Premix Tilting Soup Kettle',
  '电磁摇摆汤锅': 'Induction Tilting Soup Kettle',
  '电磁摇摆炒锅': 'Induction Tilting Wok',
  '燃烧机摇摆炒锅': 'Burner Tilting Wok',
  '全预混摇摆炒锅': 'Premix Tilting Wok',
  '全钢可倾电热夹层锅': 'All-steel Tilting Electric Jacketed Kettle',
  '全钢可倾电热夹层锅（八字搅拌）': 'All-steel Tilting Electric Jacketed Kettle (Figure-eight Stirring)',
  '全钢可倾电热夹层锅（平躺搅拌）': 'All-steel Tilting Electric Jacketed Kettle (Horizontal Stirring)',
  '全钢钢架可倾蒸汽夹层锅': 'All-steel Tilting Steam Jacketed Kettle',
  '全钢钢架可倾蒸汽夹层锅（平躺搅拌）': 'All-steel Tilting Steam Jacketed Kettle (Horizontal Stirring)',
  '立式蒸汽夹层锅（全钢）': 'Vertical Steam Jacketed Kettle (All-steel)',
  '直立式燃气行星搅拌炒锅': 'Vertical Gas Planetary Stirring Wok',
  '直立式电热行星搅拌炒锅': 'Vertical Electric Planetary Stirring Wok',
  '直立式蒸汽行星搅拌炒锅': 'Vertical Steam Planetary Stirring Wok',
  '燃气全自动多功能炒锅（机头一体）': 'Gas Automatic Multi-function Wok (Integrated Head)',
  '燃气全自动多功能炒锅（机头后翻）': 'Gas Automatic Multi-function Wok (Rear-tilting Head)',
  '燃气全自动多爪行星炒锅': 'Gas Automatic Multi-arm Planetary Wok',
  '燃气全自动炒菜机': 'Gas Automatic Cooking Machine',
  '电热全自动多功能炒锅（机头一体）': 'Electric Automatic Multi-function Wok (Integrated Head)',
  '电热全自动多功能炒锅（机头后翻）': 'Electric Automatic Multi-function Wok (Rear-tilting Head)',
  '电磁全自动多功能炒锅（机头一体）': 'Induction Automatic Multi-function Wok (Integrated Head)',
  '电磁全自动多功能炒锅（机头后翻）': 'Induction Automatic Multi-function Wok (Rear-tilting Head)',
  '电磁全自动多爪行星炒锅': 'Induction Automatic Multi-arm Planetary Wok',
  '电磁全自动炒菜机': 'Induction Automatic Cooking Machine',
  '电磁自动炒锅': 'Induction Automatic Wok',
  '电磁自动炒锅（侧翻）': 'Induction Automatic Wok (Side Tilting)',
  '全预混自动炒锅': 'Premix Automatic Wok',
  '全预混自动炒锅(侧翻）': 'Premix Automatic Wok (Side Tilting)',
  '全预混自动炒锅(侧翻电动倾倒）': 'Premix Automatic Wok (Electric Side Tilting)',
  '智能煮粥机': 'Smart Porridge Cooker',
  '燃气手动可倾高压锅': 'Gas Manual Tilting Pressure Kettle',
  '电热手动可倾高压锅': 'Electric Manual Tilting Pressure Kettle',
  '燃气节能型方形卤煮锅': 'Gas Energy-saving Square Brining Kettle',
  '自动翻转漂汤锅（燃气）': 'Automatic Flip Blanching Kettle (Gas)',
  '自动翻转漂汤锅（电热）': 'Automatic Flip Blanching Kettle (Electric)',
  '自动翻转漂汤锅（蒸汽）': 'Automatic Flip Blanching Kettle (Steam)'
};

const PHRASE_EN = [
  ['倾倒电机功率', 'Tilting motor power'],
  ['翻锅功率', 'Pot tilting power'],
  ['加热额定功率', 'Rated heating power'],
  ['额定加热功率', 'Rated heating power'],
  ['电热功率', 'Electric heating power'],
  ['电磁功率', 'Induction heating power'],
  ['热负荷', 'Heat load'],
  ['搅拌功率', 'Stirring power'],
  ['旋转电机功率', 'Rotation motor power'],
  ['电机功率', 'Motor power'],
  ['液压功率', 'Hydraulic power'],
  ['液压站尺寸', 'Hydraulic station dimensions'],
  ['导热油量', 'Thermal oil volume'],
  ['出厂状态', 'Factory condition'],
  ['免组装免调试', 'No on-site assembly or commissioning required'],
  ['出厂加装好导热油', 'thermal oil pre-filled before shipment'],
  ['加装好导热油', 'thermal oil pre-filled'],
  ['锅内额定压力', 'Inner pot rated pressure'],
  ['天然气压力', 'Natural gas pressure'],
  ['额定压力', 'Rated pressure'],
  ['设备重量', 'Equipment weight'],
  ['锅体容量', 'Kettle capacity'],
  ['内锅材质', 'Inner pot material'],
  ['支架外壳材质', 'Frame and housing material'],
  ['外壳支架材质', 'Housing and frame material'],
  ['网筐抬起尺寸', 'Basket raised dimensions'],
  ['网框抬起尺寸', 'Basket raised dimensions'],
  ['网筐内径', 'Basket inner diameter'],
  ['网框内径', 'Basket inner diameter'],
  ['网筐升起尺寸', 'Basket raised dimensions'],
  ['网框升起尺寸', 'Basket raised dimensions'],
  ['网筐升降电压', 'Basket lift voltage'],
  ['网框升降电压', 'Basket lift voltage'],
  ['网筐尺寸', 'Basket dimensions'],
  ['网框尺寸', 'Basket dimensions'],
  ['搅拌抬起尺寸', 'Stirring lift dimensions'],
  ['展开最大尺寸', 'Maximum extended dimensions'],
  ['外型尺寸', 'Overall dimensions'],
  ['内锅深度', 'Inner pot depth'],
  ['额定功率', 'Rated power'],
  ['额定电压', 'Rated voltage'],
  ['天燃气', 'Natural Gas'],
  ['天然气', 'Natural Gas'],
  ['液化气', 'LPG'],
  ['电磁', 'Induction'],
  ['电热', 'Electric'],
  ['电加热', 'Electric heating'],
  ['燃气', 'Gas'],
  ['蒸汽', 'Steam'],
  ['全预混', 'Premix'],
  ['自吸风', 'Self-priming'],
  ['燃烧机', 'Burner'],
  ['摇摆', 'Tilting'],
  ['夹层锅', 'Jacketed Kettle'],
  ['汤锅', 'Soup Kettle'],
  ['炒锅', 'Wok'],
  ['行星搅拌', 'Planetary Stirring'],
  ['全自动', 'Automatic'],
  ['多功能', 'Multi-function'],
  ['多爪', 'Multi-arm'],
  ['炒菜机', 'Cooking Machine'],
  ['高压锅', 'Pressure Kettle'],
  ['卤煮锅', 'Brining Kettle'],
  ['漂汤锅', 'Blanching Kettle'],
  ['机头一体', 'Integrated Head'],
  ['机头后翻', 'Rear-tilting Head'],
  ['侧翻电动倾倒', 'Electric Side Tilting'],
  ['侧翻', 'Side Tilting'],
  ['八字搅拌', 'Figure-eight Stirring'],
  ['平躺搅拌', 'Horizontal Stirring'],
  ['全钢', 'All-steel'],
  ['钢架', 'Steel Frame'],
  ['内胆', 'Inner Pot'],
  ['锅盖', 'Lid'],
  ['折叠', 'Folding'],
  ['分体', 'Split'],
  ['炉头', 'Burner Head'],
  ['风机', 'Fan'],
  ['网筐', 'Basket'],
  ['网框', 'Basket'],
  ['接口', 'Connection'],
  ['进气口', 'Gas inlet'],
  ['进水口', 'Water inlet'],
  ['控制器', 'Controller'],
  ['安全阀', 'Safety Valve'],
  ['压力表', 'Pressure Gauge'],
  ['稳压阀', 'Pressure Regulator'],
  ['比例阀', 'Proportional Valve'],
  ['手动燃气阀', 'Manual Gas Valve'],
  ['燕尾阀', 'Dovetail Valve'],
  ['蝶形阀', 'Butterfly Valve'],
  ['排污阀', 'Drain Valve'],
  ['疏水器', 'Steam Trap'],
  ['接触器', 'Contactor'],
  ['继电器', 'Relay'],
  ['接近开关', 'Proximity Switch'],
  ['行程开关', 'Limit Switch'],
  ['热电偶', 'Thermocouple'],
  ['点火棒', 'Ignition Rod'],
  ['抗压金属软管', 'Pressure-resistant Metal Hose'],
  ['波纹管', 'Corrugated Tube'],
  ['观火孔镜片', 'Flame-viewing Glass'],
  ['触摸屏主板', 'Touchscreen Mainboard'],
  ['玻璃屏', 'Glass Screen'],
  ['导热油油桶', 'Thermal Oil Drum'],
  ['导热油', 'Thermal Oil'],
  ['电热管垫片', 'Heating Tube Gasket'],
  ['电热管', 'Heating Tube'],
  ['表弯', 'Gauge Siphon'],
  ['摇轮', 'Handwheel'],
  ['扇形齿轮', 'Sector Gear'],
  ['全齿齿轮', 'Full Gear'],
  ['蜗杆', 'Worm Gear'],
  ['空气滤芯', 'Air Filter Element'],
  ['高压点火线', 'High-voltage Ignition Cable'],
  ['电源插头线', 'Power Plug Cable'],
  ['四氟刮板', 'PTFE Scraper'],
  ['轴承', 'Bearing'],
  ['齿轮', 'Gear'],
  ['安全锁', 'Safety Lock'],
  ['水枪', 'Water Gun'],
  ['通用水龙头', 'Universal Faucet'],
  ['文丘里', 'Venturi'],
  ['减速机', 'Reducer'],
  ['高温线', 'High-temperature Wire'],
  ['点火器', 'Igniter'],
  ['点火针', 'Ignition Electrode'],
  ['探火针', 'Flame Sensor'],
  ['熄火保护', 'Flameout Protection'],
  ['电磁阀', 'Solenoid Valve'],
  ['万向节', 'Universal Joint'],
  ['万向阀', 'Universal Valve'],
  ['不锈钢', 'Stainless Steel'],
  ['铸铁', 'Cast iron'],
  ['食品加工厂', 'food processing plants'],
  ['中央厨房', 'central kitchens'],
  ['餐饮连锁门店', 'restaurant chain stores'],
  ['单位食堂', 'institutional canteens'],
  ['学校食堂', 'school canteens'],
  ['批量熬汤', 'batch soup cooking'],
  ['煮粥', 'porridge cooking'],
  ['卤煮', 'brining'],
  ['漂烫', 'blanching'],
  ['糖浆', 'syrup'],
  ['酱料', 'sauce'],
  ['加热', 'heating'],
  ['电压', 'Voltage'],
  ['功率', 'power'],
  ['尺寸', 'dimensions'],
  ['深度', 'depth'],
  ['重量', 'weight'],
  ['容积', 'volume'],
  ['配置', 'configuration'],
  ['接入', 'connect to'],
  ['电源', 'power supply'],
  ['不可调节转速', 'fixed speed'],
  ['搅拌组件可拆卸清洗', 'removable stirring assembly for cleaning'],
  ['固定结构', 'fixed structure'],
  ['手动可倾', 'manual tilting'],
  ['高压蒸煮', 'pressure cooking'],
  ['报价按', 'quote based on'],
  ['录入', 'entry'],
  ['热负荷', 'heat load'],
  ['倾倒', 'tilting'],
  ['翻锅', 'pot tilting'],
  ['材质', 'material'],
  ['专用', 'dedicated use'],
  ['约', 'approx.'],
  ['折算', 'calculated'],
  ['普通搅拌', 'standard stirring'],
  ['含', 'includes'],
  ['带', 'with'],
  ['长度', 'length'],
  ['口径', 'diameter'],
  ['单独', 'separate'],
  ['新款', 'new model'],
  ['铜制', 'copper'],
  ['英文版', 'English version'],
  ['无厂名', 'no factory name'],
  ['普通', 'standard'],
  ['老款红色', 'old red model'],
  ['小变频', 'small inverter'],
  ['大变频', 'large inverter'],
  ['电动倾倒', 'electric tilting'],
  ['手动', 'manual'],
  ['保温', 'heat preservation',
  ],
  ['慢煮', 'slow cooking'],
  ['常规熬制', 'standard simmering'],
  ['快速升温', 'rapid temperature rise'],
  ['快速烧开', 'fast boiling'],
  ['大批量', 'large-batch'],
  ['高火力', 'high-output'],
  ['小火', 'low heat'],
  ['猛火', 'high heat'],
  ['火力', 'heat output'],
  ['稳定', 'stable'],
  ['温和', 'gentle'],
  ['节能', 'energy-saving'],
  ['耐用', 'durable'],
  ['安全', 'safe'],
  ['可靠', 'reliable'],
  ['品质', 'quality'],
  ['认证', 'certification'],
  ['国家强制性产品认证', 'China Compulsory Certification'],
  ['国家CCC认证', 'National CCC certification'],
  ['证书编号', 'Certificate No.'],
  ['自主研发', 'self-developed'],
  ['智能控制系统', 'intelligent control system'],
  ['控制系统', 'control system'],
  ['电子点火', 'electronic ignition'],
  ['标准配置', 'standard configuration'],
  ['操作简单', 'easy operation'],
  ['保温棉', 'thermal insulation cotton'],
  ['数控旋压一体成型', 'CNC spin-formed one-piece pot body'],
  ['传热均匀', 'uniform heat transfer'],
  ['国家食品安全标准', 'national food safety standard'],
  ['适合', 'Suitable for'],
  ['用于', 'for'],
  ['不适合', 'not suitable for'],
  ['不太适合', 'less suitable for'],
  ['需要', 'requiring'],
  ['场景', 'scenarios'],
  ['工艺', 'processes'],
  ['设备', 'equipment'],
  ['配件', 'part'],
  ['未填写', 'Not filled'],
  ['暂无图片', 'No image'],
  ['图片缺失', 'Image missing'],
  ['图片文件缺失', 'Image file missing'],
  ['资料待补', 'Missing materials'],
  ['暂无资料', 'No material'],
  ['暂无更多产品描述', 'No additional product description'],
  ['已复制', 'Copied'],
  ['可直接粘贴', 'ready to paste'],
  ['复制失败', 'Copy failed'],
  ['证书', 'Certificate'],
  ['生产许可', 'Production License'],
  ['能效检测报告', 'Energy Efficiency Test Report'],
  ['检测报告', 'Test Report'],
  ['能效标识', 'Energy Label'],
  ['三视图', 'Three-view Drawing'],
  ['说明书', 'Manual']
];

const RESIDUAL_EN = [
  ['三头燃烧器', 'three-head burner'],
  ['单头', 'single-head'],
  ['双头', 'double-head'],
  ['五环', 'five-ring'],
  ['四环', 'four-ring'],
  ['三环', 'three-ring'],
  ['二环', 'two-ring'],
  ['自熄风炉盘', 'self-priming burner plate'],
  ['升自熄风炉盘用', 'for self-priming burner plate'],
  ['蘑菇头', 'mushroom head'],
  ['以及自熄风炉盘', 'and self-priming burner plate'],
  ['连接点火棒用', 'for connecting the ignition rod'],
  ['含底托', 'includes base support'],
  ['带高压线', 'with high-voltage cable'],
  ['变更后新加', 'newly added after change'],
  ['变更后主气阀', 'main gas valve after change'],
  ['主气阀', 'main gas valve'],
  ['常明火阀门', 'pilot flame valve'],
  ['不含夹片', 'without clips'],
  ['铸铁锅用', 'for cast-iron pot'],
  ['含垫子', 'includes gasket'],
  ['带木包装', 'with wooden packaging'],
  ['锅专用', 'for kettle'],
  ['装置', 'device'],
  ['控制板与', 'control board and'],
  ['不同', 'different'],
  ['同步', 'synchronized'],
  ['管垫片', 'tube gasket'],
  ['带座', 'with housing'],
  ['夹片', 'clip'],
  ['型圈', 'ring'],
  ['锅齿轮', 'kettle gear'],
  ['料仓体积可定制', 'hopper volume can be customized'],
  ['可添加', 'can add'],
  ['种液态料', 'types of liquid ingredients'],
  ['升降', 'lifting'],
  ['升起', 'raised'],
  ['压力', 'pressure'],
  ['外型', 'overall'],
  ['展开最大', 'maximum extended'],
  ['八字', 'figure-eight'],
  ['平躺', 'horizontal'],
  ['米型', 'meter type'],
  ['型', 'type'],
  ['号', 'No.'],
  ['桶', 'drum'],
  ['个', 'pc'],
  ['套', 'set'],
  ['片', 'pcs'],
  ['米', 'm'],
  ['元', 'CNY'],
  ['小', 'small'],
  ['中', 'medium'],
  ['大', 'large'],
  ['天', 'Natural'],
  ['按', 'at'],
  ['用', 'for'],
  ['机', 'machine'],
  ['锅用', 'for kettle'],
  ['阀', 'valve'],
  ['管', 'tube'],
  ['线', 'cable'],
  ['锁', 'lock'],
  ['铜', 'copper'],
  ['电', 'electric']
];

const DOCUMENT_ACTIONS = [
  { key: 'ccc', label: (item) => getCertificateLabel(item) },
  { key: 'report', label: '检测报告' },
  { key: 'energy', label: '能效标识' },
  { key: 'energyReport', label: '能效检测报告' },
  { key: 'view3', label: '三视图' },
  { key: 'manual', label: '说明书' }
];

const state = {
  filters: { type: 'all', category: 'all', keyword: '' },
  items: [],
  selected: new Map(),
  meta: null,
  update: null,
  inventoryFile: null,
  inventoryPreview: null,
  showPrices: true,
  quoteLanguage: 'zh',
  recentFiles: [],
  recentFileType: 'contract'
};

const el = {
  toast: document.querySelector('#toast'),
  typeFilter: document.querySelector('#typeFilter'),
  categoryFilter: document.querySelector('#categoryFilter'),
  searchInput: document.querySelector('#searchInput'),
  cards: document.querySelector('#cards'),
  catalogPage: document.querySelector('#catalogPage'),
  contractPage: document.querySelector('#contractPage'),
  quotePage: document.querySelector('#quotePage'),
  pageSubtitle: document.querySelector('#pageSubtitle'),
  backToCatalogBtn: document.querySelector('#backToCatalogBtn'),
  selectedList: document.querySelector('#selectedList'),
  contractSelectedList: document.querySelector('#contractSelectedList'),
  quoteSelectedList: document.querySelector('#quoteSelectedList'),
  selectedCount: document.querySelector('#selectedCount'),
  newItemBtn: document.querySelector('#newItemBtn'),
  heroNewItemBtn: document.querySelector('#heroNewItemBtn'),
  heroImportInventoryBtn: document.querySelector('#heroImportInventoryBtn'),
  recentFilesBtn: document.querySelector('#recentFilesBtn'),
  heroRecentFilesBtn: document.querySelector('#heroRecentFilesBtn'),
  heroAfterSalesVideoBtn: document.querySelector('#heroAfterSalesVideoBtn'),
  heroUpdateAppBtn: document.querySelector('#heroUpdateAppBtn'),
  heroDataRefreshBtn: document.querySelector('#heroDataRefreshBtn'),
  priceVisibilityToggle: document.querySelector('#priceVisibilityToggle'),
  quoteEnglishToggle: document.querySelector('#quoteEnglishToggle'),
  goContractBtn: document.querySelector('#goContractBtn'),
  goQuoteBtn: document.querySelector('#goQuoteBtn'),
  itemDialog: document.querySelector('#itemDialog'),
  customDialog: document.querySelector('#customDialog'),
  customForm: document.querySelector('#customForm'),
  customItemId: document.querySelector('#customItemId'),
  customItemName: document.querySelector('#customItemName'),
  customSize: document.querySelector('#customSize'),
  customBasicParams: document.querySelector('#customBasicParams'),
  customRequirement: document.querySelector('#customRequirement'),
  closeCustomDialogBtn: document.querySelector('#closeCustomDialogBtn'),
  cancelCustomBtn: document.querySelector('#cancelCustomBtn'),
  productDetailOverlay: document.querySelector('#productDetailOverlay'),
  productDetailContent: document.querySelector('#productDetailContent'),
  closeProductDetailBtn: document.querySelector('#closeProductDetailBtn'),
  itemForm: document.querySelector('#itemForm'),
  dialogTitle: document.querySelector('#dialogTitle'),
  itemId: document.querySelector('#itemId'),
  itemType: document.querySelector('#itemType'),
  itemName: document.querySelector('#itemName'),
  itemModel: document.querySelector('#itemModel'),
  itemCategory: document.querySelector('#itemCategory'),
  itemPrice: document.querySelector('#itemPrice'),
  itemDimensions: document.querySelector('#itemDimensions'),
  itemParameters: document.querySelector('#itemParameters'),
  itemApplication: document.querySelector('#itemApplication'),
  itemSellingPoints: document.querySelector('#itemSellingPoints'),
  itemRemark: document.querySelector('#itemRemark'),
  itemCompletenessPanel: document.querySelector('#itemCompletenessPanel'),
  itemImagePath: document.querySelector('#itemImagePath'),
  imagePreview: document.querySelector('#imagePreview'),
  pickImageBtn: document.querySelector('#pickImageBtn'),
  removeImageBtn: document.querySelector('#removeImageBtn'),
  copyItemBtn: document.querySelector('#copyItemBtn'),
  closeDialogBtn: document.querySelector('#closeDialogBtn'),
  cancelFormBtn: document.querySelector('#cancelFormBtn'),
  deleteItemBtn: document.querySelector('#deleteItemBtn'),
  clearSelectedBtn: document.querySelector('#clearSelectedBtn'),
  customerName: document.querySelector('#customerName'),
  customerCode: document.querySelector('#customerCode'),
  contractDate: document.querySelector('#contractDate'),
  contractNo: document.querySelector('#contractNo'),
  payment: document.querySelector('#payment'),
  deliveryDate: document.querySelector('#deliveryDate'),
  deliveryMethod: document.querySelector('#deliveryMethod'),
  freight: document.querySelector('#freight'),
  buyerInvoiceInfo: document.querySelector('#buyerInvoiceInfo'),
  clearInvoiceInfoBtn: document.querySelector('#clearInvoiceInfoBtn'),
  formatInvoiceInfoBtn: document.querySelector('#formatInvoiceInfoBtn'),
  createContractBtn: document.querySelector('#createContractBtn'),
  invoiceType: document.querySelector('#invoiceType'),
  createQuoteBtn: document.querySelector('#createQuoteBtn'),
  quoteRemark: document.querySelector('#quoteRemark'),
  statusText: document.querySelector('#statusText'),
  quoteStatusText: document.querySelector('#quoteStatusText'),
  recentFilesDialog: document.querySelector('#recentFilesDialog'),
  recentFileTypeTabs: document.querySelector('#recentFileTypeTabs'),
  closeRecentFilesBtn: document.querySelector('#closeRecentFilesBtn'),
  recentFilesList: document.querySelector('#recentFilesList'),
  inventoryDialog: document.querySelector('#inventoryDialog'),
  closeInventoryDialogBtn: document.querySelector('#closeInventoryDialogBtn'),
  cancelInventoryDialogBtn: document.querySelector('#cancelInventoryDialogBtn'),
  pickInventoryFileBtn: document.querySelector('#pickInventoryFileBtn'),
  inventoryDropZone: document.querySelector('#inventoryDropZone'),
  applyInventoryImportBtn: document.querySelector('#applyInventoryImportBtn'),
  inventoryFileInfo: document.querySelector('#inventoryFileInfo'),
  inventoryPreviewPanel: document.querySelector('#inventoryPreviewPanel'),
  inventoryPreviewSummary: document.querySelector('#inventoryPreviewSummary'),
  inventoryMatchedList: document.querySelector('#inventoryMatchedList'),
  inventorySkippedList: document.querySelector('#inventorySkippedList'),
  releaseNotesDialog: document.querySelector('#releaseNotesDialog'),
  releaseNotesSubtitle: document.querySelector('#releaseNotesSubtitle'),
  releaseNotesContent: document.querySelector('#releaseNotesContent'),
  closeReleaseNotesBtn: document.querySelector('#closeReleaseNotesBtn'),
  ackReleaseNotesBtn: document.querySelector('#ackReleaseNotesBtn'),
  appConfirmDialog: document.querySelector('#appConfirmDialog'),
  appConfirmTitle: document.querySelector('#appConfirmTitle'),
  appConfirmMessage: document.querySelector('#appConfirmMessage'),
  appConfirmDetails: document.querySelector('#appConfirmDetails'),
  appConfirmCancelBtn: document.querySelector('#appConfirmCancelBtn'),
  appConfirmConfirmBtn: document.querySelector('#appConfirmConfirmBtn'),
  materialContextMenu: document.querySelector('#materialContextMenu')
};

let appConfirmResolver = null;

init();

async function init() {
  state.meta = await window.salesApi.getMeta();
  fillCategories();
  bindEvents();
  el.contractDate.value = new Date().toISOString().slice(0, 10);
  updateContractNo();
  await loadItems();
  await showDataRefreshResult();

  if (state.meta && state.meta.version) {
    const versionEl = el.heroUpdateAppBtn;
    if (versionEl) {
      let ver = state.meta.version;
      if (ver.endsWith('.0')) {
        ver = ver.slice(0, -2);
      }
      versionEl.textContent = `v${ver}`;
    }
  }
  setTimeout(() => showPendingReleaseNotes(), 300);
  setTimeout(() => checkForUpdates(true), 1200);
}

function fillCategories() {
  fillCategorySelect(el.categoryFilter, CATEGORIES, true);
  fillCategorySelect(el.itemCategory, CATEGORIES);
  updateStaticLanguage();
}

function fillCategorySelect(select, categories, includeAll = false) {
  select.innerHTML = includeAll ? `<option value="all">${uiText('全部分类', 'All Categories')}</option>` : '';
  categories.forEach((category) => {
    const option = new Option(translateCategory(category), category);
    select.append(option);
  });
}

function isEnglishMode() {
  return state.quoteLanguage === 'en';
}

function uiText(zh, en) {
  return isEnglishMode() ? en : zh;
}

function updateStaticLanguage() {
  document.documentElement.lang = isEnglishMode() ? 'en' : 'zh-CN';
  document.body.classList.toggle('english-mode', isEnglishMode());
  document.querySelector('.brand-block h1').textContent = uiText('销售选品工作台', 'Sales Selection Workspace');
  document.querySelector('.hero-copy h2').textContent = uiText('国龙食品机械产品资料库', 'Guolong Food Machinery Product Library');
  el.pageSubtitle.textContent = uiText('产品资料、销售选品、合同与报价单输出', 'Product data, sales selection, contracts and quotations');
  el.recentFilesBtn.textContent = uiText('最近文件', 'Recent Files');
  el.heroRecentFilesBtn.textContent = uiText('最近文件', 'Recent Files');
  el.heroAfterSalesVideoBtn.textContent = uiText('售后视频', 'Service Videos');
  el.heroDataRefreshBtn.textContent = uiText('刷新资料', 'Refresh Data');
  el.newItemBtn.textContent = uiText('新增商品', 'New Item');
  el.heroNewItemBtn.textContent = uiText('新增商品', 'New Item');
  el.heroImportInventoryBtn.textContent = uiText('导入库存', 'Import Stock');
  el.goContractBtn.textContent = uiText('制作合同', 'Create Contract');
  el.goQuoteBtn.textContent = uiText('制作报价单', 'Create Quotation');
  el.createQuoteBtn.textContent = uiText('生成报价单 Excel', 'Create Quotation Excel');
  el.clearSelectedBtn.textContent = uiText('清空', 'Clear');
  document.querySelector('#quotePage .document-head h2').textContent = uiText('制作报价单', 'Create Quotation');
  document.querySelector('#quotePage .contract-box h2').textContent = uiText('报价单备注', 'Quotation Remarks');
  document.querySelector('#quotePage .contract-box label').childNodes[0].textContent = uiText('备注\n                ', 'Remarks\n                ');
  document.querySelector('#quotePage .document-grid > div:last-child h2').textContent = uiText('报价商品清单', 'Quotation Items');
  document.querySelector('#typeFilter [data-type="all"]').textContent = uiText('全部', 'All');
  document.querySelector('#typeFilter [data-type="equipment"]').textContent = uiText('设备', 'Equipment');
  document.querySelector('#typeFilter [data-type="part"]').textContent = uiText('配件', 'Parts');
  el.searchInput.placeholder = uiText('搜索名称、型号、容量、加热方式或拼音...', 'Search name, model, capacity, heating method or Pinyin...');
  document.querySelector('#selectedCount')?.previousElementSibling && (document.querySelector('#selectedCount').previousElementSibling.textContent = uiText('已选清单', 'Selection'));
  document.querySelector('.action-hint').textContent = uiText('选好商品后，选择要输出的单据。', 'Select products first, then choose an output document.');
  const priceText = el.priceVisibilityToggle.closest('label').querySelector('.switch-text');
  priceText.textContent = uiText('显示价格', 'Show Prices');
  const englishText = el.quoteEnglishToggle.closest('label').querySelector('.switch-text');
  englishText.textContent = uiText('英文报价', 'English');
  document.querySelector('#inventoryDialog .inventory-head h2').textContent = uiText('导入库存', 'Import Inventory');
  document.querySelector('#inventoryDialog .inventory-head p').textContent = uiText(
    '选择仓库库存表格，后续按映射关系匹配到产品库存。',
    'Select a warehouse inventory spreadsheet. Mapping rules will be connected later.'
  );
  document.querySelector('#inventoryDialog .inventory-import-note').textContent = uiText(
    '先核对可写入和跳过项，确认无误后再写入库存；未确认映射的项目不会自动录入。',
    'Review ready and skipped items first. Only confirmed mappings will be imported.'
  );
  el.pickInventoryFileBtn.textContent = uiText('选择库存表格', 'Choose Inventory Sheet');
  document.querySelector('#inventoryDropZone strong').textContent = uiText('或把库存 Excel 直接拖到这里', 'Or drop the inventory Excel here');
  el.cancelInventoryDialogBtn.textContent = uiText('关闭', 'Close');
  el.applyInventoryImportBtn.textContent = uiText('等待映射规则', 'Waiting for Mapping Rules');
  document.querySelector('#inventoryPreviewPanel section:first-child h3').textContent = uiText('可写入库存', 'Ready to Import');
  document.querySelector('#inventoryPreviewPanel section:last-child h3').textContent = uiText('已跳过 / 待确认', 'Skipped / Needs Review');
  el.quoteRemark.lang = isEnglishMode() ? 'en' : 'zh-CN';
  el.quoteRemark.classList.toggle('text-input-zh', !isEnglishMode());
  syncQuoteRemarkLanguage();
}

function syncQuoteRemarkLanguage() {
  const current = el.quoteRemark.value.trim();
  if (isEnglishMode() && (!current || current === DEFAULT_QUOTE_REMARK_ZH || hasChineseText(current))) {
    el.quoteRemark.value = DEFAULT_QUOTE_REMARK_EN;
  }
  if (!isEnglishMode() && (!current || current === DEFAULT_QUOTE_REMARK_EN)) {
    el.quoteRemark.value = DEFAULT_QUOTE_REMARK_ZH;
  }
}

function hasChineseText(value) {
  return /[\u4e00-\u9fff]/.test(String(value || ''));
}

async function showPendingReleaseNotes() {
  if (!window.salesApi.getPendingReleaseNotes || !el.releaseNotesDialog) return;
  try {
    const result = await window.salesApi.getPendingReleaseNotes();
    if (!result?.shouldShow || !Array.isArray(result.notes) || !result.notes.length) return;
    el.releaseNotesDialog.dataset.version = result.currentVersion || state.meta?.version || '';
    el.releaseNotesSubtitle.textContent = result.lastSeenVersion
      ? `已从 v${result.lastSeenVersion} 更新到 v${result.currentVersion}`
      : `当前版本 v${result.currentVersion}`;
    el.releaseNotesContent.innerHTML = result.notes.map((release) => `
      <section class="release-note-block">
        <h3>v${escapeHtml(release.version)}${release.title ? ` · ${escapeHtml(release.title)}` : ''}</h3>
        <ul>
          ${release.items.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}
        </ul>
      </section>
    `).join('');
    el.releaseNotesDialog.showModal();
  } catch {
    // Update notes should never block normal use.
  }
}

async function acknowledgeReleaseNotes() {
  const version = el.releaseNotesDialog?.dataset.version || state.meta?.version || '';
  try {
    if (window.salesApi.acknowledgeReleaseNotes) {
      await window.salesApi.acknowledgeReleaseNotes(version);
    }
  } catch {
    // Ignore acknowledgement errors; the dialog can still close.
  }
  el.releaseNotesDialog?.close();
}

function bindEvents() {
  el.typeFilter.addEventListener('click', async (event) => {
    const button = event.target.closest('button[data-type]');
    if (!button) return;
    el.typeFilter.querySelectorAll('button').forEach((item) => item.classList.remove('active'));
    button.classList.add('active');
    state.filters.type = button.dataset.type;
    state.filters.category = 'all';
    updateCategoryFilterOptions();
    await loadItems();
  });

  el.categoryFilter.addEventListener('change', async () => {
    state.filters.category = el.categoryFilter.value;
    await loadItems();
  });

  el.searchInput.addEventListener('input', debounce(async () => {
    state.filters.keyword = el.searchInput.value;
    await loadItems();
  }, 200));

  el.newItemBtn.addEventListener('click', () => openItemDialog());
  el.heroNewItemBtn.addEventListener('click', () => openItemDialog());
  el.recentFilesBtn.addEventListener('click', openRecentFiles);
  el.heroRecentFilesBtn.addEventListener('click', openRecentFiles);
  el.heroAfterSalesVideoBtn.addEventListener('click', openAfterSalesVideo);
  el.heroImportInventoryBtn.addEventListener('click', openInventoryDialog);
  el.heroUpdateAppBtn.addEventListener('click', handleUpdateClick);
  el.heroDataRefreshBtn.addEventListener('click', handleDataRefreshClick);
  el.priceVisibilityToggle.addEventListener('change', () => {
    state.showPrices = el.priceVisibilityToggle.checked;
    renderCards();
    renderSelected();
    if (!el.productDetailOverlay.classList.contains('hidden')) {
      const activeId = Number(el.productDetailOverlay.dataset.itemId || 0);
      if (activeId) openProductDetail(activeId);
    }
  });
  el.quoteEnglishToggle.addEventListener('change', () => {
    state.quoteLanguage = el.quoteEnglishToggle.checked ? 'en' : 'zh';
    fillCategories();
    updateCategoryFilterOptions();
    renderCards();
    renderSelected();
    if (!el.productDetailOverlay.classList.contains('hidden')) {
      const activeId = Number(el.productDetailOverlay.dataset.itemId || 0);
      if (activeId) openProductDetail(activeId);
    }
    setQuoteStatus('');
  });
  el.closeRecentFilesBtn.addEventListener('click', () => el.recentFilesDialog.close());
  el.recentFileTypeTabs.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-recent-type]');
    if (!button) return;
    state.recentFileType = button.dataset.recentType;
    updateRecentFileTabs();
    renderRecentFiles();
  });
  el.closeInventoryDialogBtn.addEventListener('click', () => el.inventoryDialog.close());
  el.cancelInventoryDialogBtn.addEventListener('click', () => el.inventoryDialog.close());
  el.pickInventoryFileBtn.addEventListener('click', pickInventoryFile);
  bindInventoryDropZone();
  el.applyInventoryImportBtn.addEventListener('click', applyInventoryImport);
  el.closeReleaseNotesBtn.addEventListener('click', acknowledgeReleaseNotes);
  el.ackReleaseNotesBtn.addEventListener('click', acknowledgeReleaseNotes);
  el.appConfirmCancelBtn.addEventListener('click', () => settleAppConfirm(false));
  el.appConfirmConfirmBtn.addEventListener('click', () => settleAppConfirm(true));
  el.appConfirmDialog.addEventListener('cancel', (event) => {
    event.preventDefault();
    settleAppConfirm(false);
  });
  el.appConfirmDialog.addEventListener('click', (event) => {
    if (event.target === el.appConfirmDialog) settleAppConfirm(false);
  });
  el.backToCatalogBtn.addEventListener('click', () => showPage('catalog'));
  el.goContractBtn.addEventListener('click', () => {
    if (!state.selected.size) return showToast('请先选择设备或配件，再制作合同。', 'warning');
    resetContractReviewFields();
    renderContractSelected();
    showPage('contract');
  });
  el.goQuoteBtn.addEventListener('click', () => {
    if (!state.selected.size) return showToast('请先选择设备或配件，再制作报价单。', 'warning');
    syncQuoteRemarkLanguage();
    renderQuoteSelected();
    showPage('quote');
  });
  el.closeDialogBtn.addEventListener('click', () => el.itemDialog.close());
  el.cancelFormBtn.addEventListener('click', () => el.itemDialog.close());
  el.itemType.addEventListener('change', updateFormByType);
  [el.itemName, el.itemModel, el.itemCategory, el.itemPrice, el.itemDimensions, el.itemParameters, el.itemRemark, el.itemImagePath].forEach((field) => {
    field.addEventListener('input', () => updateItemCompletenessPanel(readItemDraftFromForm()));
    field.addEventListener('change', () => updateItemCompletenessPanel(readItemDraftFromForm()));
  });
  el.pickImageBtn.addEventListener('click', pickImage);
  el.removeImageBtn.addEventListener('click', removeCurrentImage);
  el.copyItemBtn.addEventListener('click', copyCurrentItemDraft);
  el.itemForm.addEventListener('submit', saveItem);
  el.customForm.addEventListener('submit', saveCustomRequirement);
  el.closeCustomDialogBtn.addEventListener('click', () => el.customDialog.close());
  el.cancelCustomBtn.addEventListener('click', () => el.customDialog.close());
  el.closeProductDetailBtn.addEventListener('click', closeProductDetail);
  el.productDetailContent.addEventListener('click', copyMaterialFromDetail);
  el.productDetailContent.addEventListener('click', handleGalleryAction);
  let swipeStart = null;
  el.productDetailContent.addEventListener('pointerdown', (event) => {
    const button = event.target.closest('.product-image-copy-btn');
    if (button && event.button === 0) {
      swipeStart = { x: event.clientX, y: event.clientY };
      button.setPointerCapture(event.pointerId);
    }
  });
  el.productDetailContent.addEventListener('pointerup', (event) => {
    if (!swipeStart) return;
    const dx = event.clientX - swipeStart.x;
    const dy = event.clientY - swipeStart.y;
    swipeStart = null;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) {
      gallerySuppressClick = true;
      switchGalleryImage(dx < 0 ? 1 : -1);
      window.setTimeout(() => { gallerySuppressClick = false; }, 300);
    }
  });
  el.productDetailContent.addEventListener('pointercancel', () => { swipeStart = null; });
  el.productDetailContent.addEventListener('contextmenu', openMaterialContextMenu);
  el.materialContextMenu.addEventListener('click', handleMaterialContextAction);
  document.addEventListener('click', (event) => {
    if (!event.target.closest('#materialContextMenu')) closeMaterialContextMenu();
  });
  window.addEventListener('blur', closeMaterialContextMenu);
  window.addEventListener('resize', closeMaterialContextMenu);
  el.productDetailOverlay.addEventListener('click', (event) => {
    if (event.target === el.productDetailOverlay) closeProductDetail();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !el.productDetailOverlay.classList.contains('hidden')) {
      closeProductDetail();
    }
  });
  document.querySelectorAll('[data-requirement]').forEach((button) => {
    button.addEventListener('click', () => {
      appendCustomRequirement(button.dataset.requirement || button.textContent || '');
      el.customRequirement.focus();
    });
  });
  el.deleteItemBtn.addEventListener('click', deleteCurrentItem);
  el.clearSelectedBtn.addEventListener('click', () => {
    state.selected.clear();
    renderSelected();
    renderCards();
  });
  el.customerName.addEventListener('input', updateCustomerCodeFromName);
  el.customerCode.addEventListener('input', updateContractNo);
  el.contractDate.addEventListener('change', updateContractNo);
  el.clearInvoiceInfoBtn.addEventListener('click', () => {
    el.buyerInvoiceInfo.value = '';
    setInvoiceRecognitionPending(false);
    el.buyerInvoiceInfo.focus();
  });
  el.buyerInvoiceInfo.addEventListener('input', updateInvoiceRecognitionAction);
  bindContractReviewFields();
  el.formatInvoiceInfoBtn.addEventListener('click', async () => {
    const parsed = parseInvoiceInfoFields(el.buyerInvoiceInfo.value);
    el.buyerInvoiceInfo.value = invoiceFieldsToText(parsed);
    if (parsed.name) {
      el.customerName.value = parsed.name;
      await updateCustomerCodeFromName();
    }
    setInvoiceRecognitionPending(false);
    showToast('开票信息已按固定字段整理。', 'success');
  });
  el.createContractBtn.addEventListener('click', createContract);
  el.createQuoteBtn.addEventListener('click', createQuote);
  document.addEventListener('contextmenu', (event) => {
    if (event.target.closest('input, textarea')) {
      event.preventDefault();
      window.salesApi.showInputContextMenu();
    }
  });
}

function sortCatalogItems(items) {
  return [...items].sort((a, b) => {
    const typeRank = (a.type === 'equipment' ? 0 : 1) - (b.type === 'equipment' ? 0 : 1);
    if (typeRank) return typeRank;
    const categoryRank = getCategoryRank(a.category) - getCategoryRank(b.category);
    if (categoryRank) return categoryRank;
    const nameRank = String(a.name || '').localeCompare(String(b.name || ''), 'zh-Hans-CN');
    if (nameRank) return nameRank;
    const capacityRank = getCapacityNumber(a) - getCapacityNumber(b);
    if (capacityRank) return capacityRank;
    return String(a.model || '').localeCompare(String(b.model || ''), 'zh-Hans-CN', { numeric: true });
  });
}

function getCategoryRank(category) {
  const index = [...CATEGORIES, ...PART_CATEGORIES].indexOf(category);
  return index === -1 ? 999 : index;
}

function getActiveCategories() {
  return state.filters.type === 'part' ? PART_CATEGORIES : CATEGORIES;
}

function updateCategoryFilterOptions() {
  fillCategorySelect(el.categoryFilter, getActiveCategories(), true);
  el.categoryFilter.value = state.filters.category;
}

function getCapacityNumber(item) {
  const text = `${item.remark || ''}\n${item.parameters || ''}\n${item.model || ''}\n${item.name || ''}`;
  const match = text.match(/(?:容量[：:]\s*)?([0-9]+(?:\.[0-9]+)?)\s*L/i);
  return match ? Number(match[1]) : 999999;
}

function translateCategory(category) {
  if (!isEnglishMode()) return category;
  return CATEGORY_EN[category] || translateChineseText(category);
}

function translateProductName(name) {
  const value = String(name || '').trim();
  if (!isEnglishMode()) return value;
  return normalizeEnglishName(PRODUCT_NAME_EN[value] || translateChineseText(value));
}

function translateModel(model) {
  if (!isEnglishMode()) return model;
  return translateChineseText(model);
}

function translateStructuredText(value) {
  const text = String(value || '').trim();
  if (!isEnglishMode() || !text) return text;
  return text
    .split('\n')
    .map((line) => {
      const match = line.match(/^([^：:]{1,24})[：:]\s*(.*)$/);
      if (!match) return translateChineseText(line);
      const label = FIELD_EN[match[1].trim()] || translateChineseText(match[1].trim());
      return `${label}: ${translateParameterValue(match[2])}`;
    })
    .join('\n');
}

function translateParameterValue(value) {
  let text = String(value || '').trim();
  if (!text) return text;
  text = text
    .replace(/不锈钢\s*([0-9]{3})\s*材质/g, 'SUS$1 stainless steel')
    .replace(/([0-9]{3})\s*材质/g, 'SUS$1 stainless steel')
    .replace(/天然气（12T）/g, 'Natural gas (12T)')
    .replace(/天然气/g, 'Natural gas')
    .replace(/液化气/g, 'LPG')
    .replace(/年/g, ' years');
  return normalizeTranslatedParameterValue(translateChineseText(text));
}

function normalizeTranslatedParameterValue(value) {
  return String(value || '')
    .replace(/\b(Basket inner diameter|Basket raised dimensions|Basket dimensions|Basket lift voltage|Hydraulic station dimensions|Hydraulic power|Rated heating power|Electric heating power|Induction heating power|Stirring power|Rotation motor power|Tilting motor power|Pot tilting power|Motor power|Rated power|Rated voltage|Voltage|Thermal oil volume|Heat load|Connection|Gas connection|Gas inlet|Water inlet|Equipment weight|Weight|Kettle capacity|Volume|Depth|Inner pot depth|Inner pot rated pressure|Natural gas pressure|Rated pressure)(?=\s*[0-9A-Z])/g, '$1: ')
    .replace(/\b(No on-site assembly or commissioning required)\s*,?\s*(thermal oil pre-filled before shipment)/gi, '$1; $2')
    .replace(/:\s*:/g, ':')
    .replace(/ {2,}/g, ' ')
    .trim();
}

function translateApplicationText(item) {
  if (!isEnglishMode()) return item.application || '';
  if (item.type === 'part') {
    return item.application ? translateChineseText(item.application) : '';
  }
  const name = `${item.name || ''} ${item.category || ''}`;
  if (/蒸汽.*夹层锅|蒸汽/.test(name)) {
    return 'Suitable for central kitchens, food factories, school canteens and institutional canteens. Used for batch soup cooking, porridge, brining, blanching, syrup and sauce heating. The vertical structure is stable and works well for fixed-station production.';
  }
  if (/电磁/.test(name)) {
    return 'Suitable for central kitchens, food processing plants and clean production areas. Used for stir-frying, sauce cooking, soup heating and batch cooking where clean electric heating and precise temperature control are required.';
  }
  if (/燃烧机|全预混/.test(name)) {
    return 'Suitable for food factories, central kitchens and restaurant chain stores. Used for fast heating, boiling and high-output batch cooking where strong heat is required.';
  }
  if (/自吸风/.test(name)) {
    return 'Suitable for food processing plants, central kitchens and restaurant chain stores. Used for soup heating, heat preservation and slow simmering where stable medium-to-low heat is preferred.';
  }
  if (/漂汤|卤煮/.test(name)) {
    return 'Suitable for brining, blanching, soup processing and batch food preparation in central kitchens and food factories.';
  }
  if (/高压锅/.test(name)) {
    return 'Suitable for pressure cooking, stewing and batch processing where higher working pressure and faster cooking are required.';
  }
  return 'Suitable for food processing plants, central kitchens, canteens and restaurant production lines. Used for batch cooking, heating and food preparation.';
}

function translateSellingPointsText(item) {
  if (!isEnglishMode()) return item.selling_points || '';
  if (item.type === 'part') {
    return item.selling_points ? translateChineseText(item.selling_points) : '';
  }
  const name = `${item.name || ''} ${item.category || ''}`;
  const material = getEnglishMaterialSummary(item);
  const points = [];

  if (/蒸汽.*夹层锅|蒸汽/.test(name)) {
    points.push('Steam jacket indirect heating provides even heat transfer and shortens heating time.');
    points.push('Temperature is easy to control, making it suitable for long-time simmering and continuous production.');
    points.push('Stable vertical structure saves floor space and is suitable for fixed piping and fixed workstation use.');
  } else if (/电磁/.test(name)) {
    points.push('Induction heating is clean, efficient and easy to control.');
    points.push('Fast heat response helps improve production efficiency and temperature consistency.');
    points.push('No open flame, making the working environment cleaner and easier to manage.');
  } else if (/燃烧机|全预混/.test(name)) {
    points.push('High-output gas heating provides fast temperature rise and strong boiling performance.');
    points.push('Electronic ignition and flameout protection improve operating safety.');
    points.push('The insulated structure reduces heat loss and improves energy efficiency.');
  } else if (/自吸风/.test(name)) {
    points.push('Stable natural-draft heating is gentle and suitable for medium-to-low heat cooking.');
    points.push('Electronic ignition and flameout protection are standard for safer operation.');
    points.push('The insulated kettle structure reduces heat loss and supports steady production.');
  } else {
    points.push('Designed for batch food production with stable operation and easy daily use.');
    points.push('The structure is practical for commercial kitchens, food factories and canteens.');
  }

  if (material) points.push(material);
  points.push('Specifications can be adjusted according to customer requirements.');
  return points.join('\n');
}

function getEnglishMaterialSummary(item) {
  const text = `${item.parameters || ''}\n${item.remark || ''}`;
  const materials = [];
  if (/304/.test(text)) materials.push('SUS304 stainless steel contact parts');
  if (/201/.test(text)) materials.push('SUS201 stainless steel frame');
  if (!materials.length) return '';
  return `${materials.join(', ')} provide durability and easy cleaning.`;
}

function translateChineseText(value) {
  let text = String(value || '');
  if (!isEnglishMode() || !text) return text;

  text = text
    .replace(/【异型】/g, '[Custom] ')
    .replace(/（/g, '(')
    .replace(/）/g, ')')
    .replace(/，/g, ', ')
    .replace(/。/g, '. ')
    .replace(/；/g, '; ')
    .replace(/：/g, ': ')
    .replace(/、/g, ', ');

  const exact = {
    '全型号获得国家CCC认证': 'All models have obtained national CCC certification',
    '权威认证品质保障': 'Authoritative certification and quality assurance',
    '自主研发智能控制系统': 'Self-developed intelligent control system',
    '自主专利控制系统': 'Self-developed patented control system',
    '安全性能全面升级': 'Comprehensive safety upgrade',
    '独立火力分区控制': 'Independent heat-zone control',
    '高效节能结构设计': 'Efficient energy-saving structure',
    '便捷安全操控体验': 'Convenient and safe operation',
    '节能耐用一体化结构': 'Energy-saving and durable integrated structure'
  };
  Object.entries(exact).forEach(([source, target]) => {
    text = text.replaceAll(source, target);
  });

  PHRASE_EN
    .slice()
    .sort((a, b) => b[0].length - a[0].length)
    .forEach(([source, target]) => {
      text = text.replaceAll(source, target);
    });

  return cleanupEnglishText(text
    .replace(/(\d+(?:\.\d+)?)\s*年/g, '$1 years')
    .replace(/(\d+(?:\.\d+)?)\s*台/g, '$1 sets')
    .replace(/(\d+(?:\.\d+)?)\s*件/g, '$1 pcs')
    .replace(/\s+,/g, ',')
    .replace(/,\s*,/g, ', ')
    .replace(/\s+\./g, '.')
    .replace(/ {2,}/g, ' '));
}

function cleanupEnglishText(value) {
  let text = String(value || '');

  RESIDUAL_EN
    .slice()
    .sort((a, b) => b[0].length - a[0].length)
    .forEach(([source, target]) => {
      text = text.replaceAll(source, target);
    });

  text = text
    .replace(/SUS?([0-9]{3})\s*Stainless Steel/gi, 'SUS$1 stainless steel')
    .replace(/([0-9]{3})\s*Stainless Steel/gi, 'SUS$1 stainless steel')
    .replace(/Stainless Steel\s*([0-9]{3})/gi, 'SUS$1 stainless steel')
    .replace(/\bNatural GasBurner Head\b/g, 'Natural gas burner head')
    .replace(/\bGasBurner Head\b/g, 'gas burner head')
    .replace(/\bBurnerBurner Head\b/g, 'burner head')
    .replace(/\bIgnition ElectrodeFlame Sensor\b/g, 'ignition electrode and flame sensor')
    .replace(/\bGasFlameout Protection\b/g, 'gas flameout protection')
    .replace(/\benergy-savingBurner Head\b/g, 'energy-saving burner head')
    .replace(/\benergy-savingSoup Kettle\b/g, 'energy-saving soup kettle')
    .replace(/\bGasWokController\b/g, 'gas wok controller')
    .replace(/\bVoltage\/electricpower\b/g, 'Voltage / electric power')
    .replace(/\bheatingpower\b/g, 'heating power')
    .replace(/\bpowerpower\b/g, 'power')
    .replace(/\bequipmentequipment\b/g, 'equipment')
    .replace(/\bequipmentweight\b/g, 'equipment weight')
    .replace(/\bStirringconfiguration\b/g, 'stirring configuration')
    .replace(/\bHorizontal Stirringconfiguration\b/g, 'horizontal stirring configuration')
    .replace(/\bFigure-eight Stirringconfiguration\b/g, 'figure-eight stirring configuration')
    .replace(/\bGasConnection\b/g, 'gas connection')
    .replace(/\bBasketvolume\b/g, 'basket volume')
    .replace(/\bBasketliftingVoltage\b/g, 'basket lift voltage')
    .replace(/\bHydraulicRated power\b/g, 'hydraulic rated power')
    .replace(/\bInner Potmaterial\b/g, 'inner pot material')
    .replace(/\bStainless Steelclip\b/g, 'stainless steel clip')
    .replace(/([a-z])([A-Z])/g, '$1 $2');

  if (/[\u4e00-\u9fff]/.test(text)) {
    text = text.replace(/[\u4e00-\u9fff]+/g, '');
  }

  return text
    .replace(/\s*\/\s*/g, ' / ')
    .replace(/\s+,/g, ',')
    .replace(/,\s*,/g, ', ')
    .replace(/\s+\./g, '.')
    .replace(/\s+:/g, ':')
    .replace(/:\s*:/g, ':')
    .replace(/ {2,}/g, ' ')
    .trim();
}

function translateDocumentLabel(label) {
  if (!isEnglishMode()) return label;
  const exact = {
    'CCC证书': 'CCC Certificate',
    '证书': 'Certificate',
    '生产许可': 'Production License',
    '检测报告': 'Test Report',
    '能效标识': 'Energy Label',
    '能效检测报告': 'Energy Efficiency Test Report',
    '三视图': 'Three-view Drawing',
    '说明书': 'Manual'
  };
  return exact[label] || translateChineseText(label);
}

function translateMissingInfo(items) {
  return items.map((item) => translateChineseText(item));
}

function normalizeEnglishName(value) {
  return String(value || '')
    .replace(/([0-9]+(?:\.[0-9]+)?(?:²|KW|kw|L|mm)?)([A-Z])/g, '$1 $2')
    .replace(/CCC([A-Z])/g, 'CCC $1')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

async function loadItems() {
  state.items = sortCatalogItems(await window.salesApi.listItems(state.filters));
  renderCards();
}

function formatStockQty(value) {
  const text = String(value ?? '').trim();
  return text || '--';
}

function openInventoryDialog() {
  state.inventoryFile = null;
  state.inventoryPreview = null;
  el.inventoryFileInfo.textContent = uiText('暂未选择文件', 'No file selected');
  el.inventoryPreviewPanel.classList.add('hidden');
  el.inventoryPreviewSummary.textContent = '';
  el.inventoryMatchedList.innerHTML = '';
  el.inventorySkippedList.innerHTML = '';
  el.applyInventoryImportBtn.disabled = true;
  el.applyInventoryImportBtn.textContent = uiText('请先选择库存表', 'Choose a Sheet First');
  el.inventoryDialog.showModal();
}

async function pickInventoryFile() {
  try {
    const file = await window.salesApi.pickInventoryFile();
    if (!file) return;
    await previewInventoryFile(file);
  } catch (error) {
    handleInventoryPreviewError(error);
  }
}

function bindInventoryDropZone() {
  const stop = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };
  ['dragenter', 'dragover'].forEach((type) => {
    el.inventoryDropZone.addEventListener(type, (event) => {
      stop(event);
      el.inventoryDropZone.classList.add('drag-over');
    });
  });
  ['dragleave', 'drop'].forEach((type) => {
    el.inventoryDropZone.addEventListener(type, (event) => {
      stop(event);
      el.inventoryDropZone.classList.remove('drag-over');
    });
  });
  el.inventoryDropZone.addEventListener('drop', async (event) => {
    const file = event.dataTransfer?.files?.[0];
    if (!file) return;
    try {
      const filePath = window.salesApi.getDroppedFilePath(file);
      await previewInventoryFile({ filePath, fileName: file.name });
    } catch (error) {
      handleInventoryPreviewError(error);
    }
  });
}

async function previewInventoryFile(file) {
  validateInventoryFile(file);
  state.inventoryFile = file;
  el.inventoryFileInfo.textContent = `${uiText('已选择', 'Selected')}: ${file.fileName}\n${file.filePath}`;
  el.applyInventoryImportBtn.disabled = true;
  el.applyInventoryImportBtn.textContent = uiText('正在识别...', 'Reading...');
  const preview = await window.salesApi.previewInventoryFile(file.filePath);
  state.inventoryPreview = preview;
  renderInventoryPreview(preview);
  el.applyInventoryImportBtn.disabled = !preview.matched.length;
  el.applyInventoryImportBtn.textContent = preview.matched.length
    ? uiText('确认写入库存', 'Import Stock')
    : uiText('没有可写入项', 'Nothing to Import');
  showToast(uiText('库存表格已识别，请先核对预览结果。', 'Inventory sheet parsed. Review the preview before importing.'), 'info');
}

function validateInventoryFile(file) {
  if (!file?.filePath) throw new Error(uiText('没有读取到文件路径，请重新拖入或选择文件。', 'Could not read the file path. Drop or choose the file again.'));
  const name = file.fileName || file.filePath;
  if (!/\.(xlsx|xls|csv)$/i.test(name)) {
    throw new Error(uiText('只支持 xlsx、xls、csv 库存表。', 'Only xlsx, xls, and csv inventory files are supported.'));
  }
}

function handleInventoryPreviewError(error) {
  el.applyInventoryImportBtn.disabled = true;
  el.applyInventoryImportBtn.textContent = uiText('重新选择库存表', 'Choose Again');
  showToast(error.message || uiText('库存表格识别失败。', 'Failed to read the inventory sheet.'), 'error');
}

function renderInventoryPreview(preview) {
  el.inventoryPreviewPanel.classList.remove('hidden');
  el.inventoryPreviewSummary.textContent = uiText(
    `识别到 ${preview.matched.length} 个可写入项，${preview.skipped.length} 个跳过/待确认项。`,
    `${preview.matched.length} ready to import, ${preview.skipped.length} skipped or pending.`
  );
  el.inventoryMatchedList.innerHTML = preview.matched.length
    ? preview.matched.map((entry) => `
      <div class="inventory-preview-item">
        <strong>${escapeHtml(entry.name)} ${escapeHtml(entry.capacity)}：${escapeHtml(entry.stock)}</strong>
        <span>${escapeHtml(entry.model || '')}${entry.previousStock ? ` · ${uiText('原库存', 'Previous')}: ${escapeHtml(entry.previousStock)}` : ''}<br>${escapeHtml(entry.source)}</span>
      </div>
    `).join('')
    : `<div class="inventory-preview-item"><span>${uiText('没有可写入库存项。', 'No stock items ready to import.')}</span></div>`;
  el.inventorySkippedList.innerHTML = preview.skipped.length
    ? preview.skipped.map((entry) => `
      <div class="inventory-preview-item">
        <strong>${escapeHtml(entry.label || entry.source)}</strong>
        <span>${escapeHtml(entry.source || '')}<br>${escapeHtml(entry.reason || '')}</span>
      </div>
    `).join('')
    : `<div class="inventory-preview-item"><span>${uiText('没有跳过项。', 'No skipped items.')}</span></div>`;
}

async function applyInventoryImport() {
  if (!state.inventoryFile?.filePath || !state.inventoryPreview?.matched?.length) return;
  try {
    el.applyInventoryImportBtn.disabled = true;
    el.applyInventoryImportBtn.textContent = uiText('正在写入...', 'Importing...');
    const result = await window.salesApi.applyInventoryFile(state.inventoryFile.filePath);
    state.inventoryPreview = result;
    renderInventoryPreview(result);
    await loadItems();
    el.applyInventoryImportBtn.textContent = uiText('已写入库存', 'Imported');
    showToast(uiText(`已写入 ${result.updated || 0} 个库存项。`, `Imported ${result.updated || 0} stock items.`), 'success');
  } catch (error) {
    el.applyInventoryImportBtn.disabled = false;
    el.applyInventoryImportBtn.textContent = uiText('确认写入库存', 'Import Stock');
    showToast(error.message || uiText('库存写入失败。', 'Failed to import stock.'), 'error');
  }
}

function renderCards() {
  if (!state.items.length) {
    el.cards.innerHTML = `<div class="selected-list empty">${uiText('没有找到商品，可以新增设备或配件。', 'No items found. You can add equipment or parts.')}</div>`;
    return;
  }

  el.cards.innerHTML = state.items.map((item) => {
    const isSelected = state.selected.has(standardSelectionKey(item));
    const image = item.image_path && !item.image_missing ? pathToFileUrl(item.image_path) : '';
    const capacity = extractCapacity(item);
    const diameterMatch = String(item.parameters || '').match(/(锅内直径|内锅直径|锅内径|内胆直径|锅体直径|锅口直径|锅口径)[：:]?\s*([^\s\n]+)/i);
    const diameterText = diameterMatch ? translateStructuredText(diameterMatch[0]) : '';
    const missingInfo = translateMissingInfo(getMissingEquipmentInfo(item));
    const imageMissing = Boolean(item.image_path && item.image_missing);
    const isCccItem = isCccMarkedItem(item);
    const itemName = translateProductName(item.name);
    const itemDimensions = translateChineseText(item.dimensions || '');
    return `
      <article class="card" data-id="${item.id}" tabindex="0" role="button" aria-label="${escapeAttribute(uiText(`查看${item.name}详情`, `View details for ${itemName}`))}">
        <div class="card-media">
          ${image ? `<img src="${image}" alt="${escapeHtml(itemName)}" loading="lazy" decoding="async">` : `<div class="card-placeholder">${imageMissing ? uiText('图片缺失', 'Image missing') : ''}</div>`}
          ${capacity ? `<span class="capacity-tag">${escapeHtml(capacity)}</span>` : ''}
          ${missingInfo.length ? `<span class="missing-info-tag" title="${escapeAttribute(`${uiText('资料待补', 'Missing materials')}: ${missingInfo.join(', ')}`)}">!</span>` : ''}
          ${imageMissing ? `<span class="image-missing-tag">${uiText('图片缺失', 'Image missing')}</span>` : ''}
          ${isCccItem ? '<span class="ccc-tag">CCC</span>' : ''}
        </div>
        <div class="card-body">
          ${item.type === 'equipment' ? `<div class="card-stock-row"><span class="stock-tag">${uiText('库存', 'Stock')}: ${escapeHtml(formatStockQty(item.stock_qty))}</span></div>` : ''}
          <div class="card-title">
            <h3>${escapeHtml(itemName)}</h3>
          </div>
          <div class="meta">
            <div>${uiText('型号', 'Model')}: ${escapeHtml(translateModel(item.model || uiText('未填写', 'Not filled')))}</div>
          ${itemDimensions ? `<div class="card-dimensions" title="${escapeAttribute(itemDimensions)}">${uiText('尺寸', 'Dimensions')}: ${escapeHtml(itemDimensions)}</div>` : ''}
            ${diameterText ? `<div>${escapeHtml(diameterText)}</div>` : ''}
            ${renderPriceMeta(item.price)}
          </div>
          <div class="card-actions">
            <button class="primary-btn" data-action="select" data-id="${item.id}">${isSelected ? uiText('已选择', 'Selected') : uiText('加入', 'Add')}</button>
            <button class="ghost-btn" data-action="custom" data-id="${item.id}">${uiText('异型', 'Custom')}</button>
            <button class="ghost-btn" data-action="edit" data-id="${item.id}">${uiText('编辑', 'Edit')}</button>
          </div>
        </div>
      </article>
    `;
  }).join('');

  el.cards.querySelectorAll('button').forEach((button) => {
    button.addEventListener('click', () => {
      const item = state.items.find((entry) => entry.id === Number(button.dataset.id));
      if (!item) return;
      if (button.dataset.action === 'select') toggleSelected(item);
      if (button.dataset.action === 'custom') addCustomItem(item);
      if (button.dataset.action === 'edit') openItemDialog(item);
    });
  });

  el.cards.querySelectorAll('.card').forEach((card) => {
    card.addEventListener('click', (event) => {
      if (event.target.closest('button')) return;
      openProductDetail(Number(card.dataset.id));
    });
    card.addEventListener('contextmenu', (event) => {
      if (event.target.closest('button')) return;
      event.preventDefault();
      const item = state.items.find((entry) => entry.id === Number(card.dataset.id));
      if (item) toggleSelected(item, { notify: true });
    });
    card.addEventListener('keydown', (event) => {
      if (!['Enter', ' '].includes(event.key)) return;
      if (event.target.closest('button')) return;
      event.preventDefault();
      openProductDetail(Number(card.dataset.id));
    });
  });
}

let galleryIndex = 0;
let gallerySuppressClick = false;

function galleryPaths(item) {
  return item.product_images || (item.image_path && !item.image_missing ? [item.image_path] : []);
}

function buildProductGalleryHtml(item) {
  const images = galleryPaths(item);
  galleryIndex = Math.min(galleryIndex, Math.max(0, images.length - 1));
  if (!images.length) return `<div class="product-detail-placeholder" title="${uiText('右键添加图片', 'Right-click to add images')}">${uiText('暂无图片', 'No image')}</div>`;
  return `<button type="button" class="product-image-copy-btn" data-item-id="${item.id}" data-image-index="${galleryIndex}" title="${uiText('点击复制当前图片，右键管理', 'Click to copy this image; right-click to manage')}">
    <img draggable="false" src="${escapeHtml(pathToFileUrl(images[galleryIndex]))}" alt="${escapeHtml(translateProductName(item.name))}">
    <span class="product-image-copy-status" aria-live="polite"></span>
  </button>${images.length > 1 ? `<button type="button" class="gallery-arrow gallery-prev" data-gallery-step="-1" aria-label="${uiText('上一张', 'Previous image')}" title="${uiText('上一张', 'Previous image')}">&#8249;</button>
    <button type="button" class="gallery-arrow gallery-next" data-gallery-step="1" aria-label="${uiText('下一张', 'Next image')}" title="${uiText('下一张', 'Next image')}">&#8250;</button>
    <span class="gallery-count" aria-live="polite">${galleryIndex + 1} / ${images.length}</span>` : ''}`;
}

function switchGalleryImage(step) {
  const item = state.items.find((entry) => entry.id === Number(el.productDetailOverlay.dataset.itemId));
  if (!item || galleryPaths(item).length < 2) return;
  galleryIndex = (galleryIndex + step + galleryPaths(item).length) % galleryPaths(item).length;
  el.productDetailContent.querySelector('.product-detail-image').innerHTML = buildProductGalleryHtml(item);
}

function handleGalleryAction(event) {
  const button = event.target.closest('[data-gallery-step]');
  if (button) switchGalleryImage(Number(button.dataset.galleryStep));
}

function openProductDetail(itemId) {
  const item = state.items.find((entry) => entry.id === itemId);
  if (!item) return;
  galleryIndex = 0;
  el.productDetailOverlay.dataset.itemId = String(itemId);
  el.productDetailContent.innerHTML = buildProductDetailHtml(item);
  el.productDetailOverlay.classList.remove('hidden');
  document.body.classList.add('detail-open');
  requestAnimationFrame(() => {
    el.productDetailOverlay.classList.add('active');
  });
}

function closeProductDetail() {
  closeMaterialContextMenu();
  el.productDetailOverlay.classList.remove('active');
  document.body.classList.remove('detail-open');
  window.setTimeout(() => {
    if (!el.productDetailOverlay.classList.contains('active')) {
      el.productDetailOverlay.classList.add('hidden');
      el.productDetailContent.innerHTML = '';
    }
  }, 180);
}

function buildProductDetailHtml(item) {
  const typeText = item.type === 'part' ? uiText('配件', 'Part') : translateCategory(item.category || '设备');
  const missingInfo = translateMissingInfo(getMissingEquipmentInfo(item));
  const capacity = extractCapacity(item);
  const itemName = translateProductName(item.name || uiText('未命名商品', 'Unnamed Item'));
  const detailSections = [
    detailSection(uiText('设备基本参数', 'Basic Parameters'), translateStructuredText(item.parameters)),
    detailSection(uiText('设备应用场景', 'Applications'), translateApplicationText(item)),
    detailSection(uiText('主要卖点', 'Key Selling Points'), translateSellingPointsText(item)),
    detailSection(uiText('备注', 'Remarks'), translateStructuredText(item.remark))
  ].filter(Boolean).join('');

  return `
    <div class="product-detail-hero">
      <div class="product-detail-image">${buildProductGalleryHtml(item)}</div>
      <div class="product-detail-summary">
        <div class="product-detail-badges">
          <span class="badge">${escapeHtml(typeText)}</span>
          ${capacity ? `<span class="capacity-tag inline">${escapeHtml(capacity)}</span>` : ''}
          ${missingInfo.length ? `<span class="missing-info-pill">${uiText('资料待补', 'Missing materials')}: ${escapeHtml(missingInfo.join(', '))}</span>` : ''}
        </div>
        <h2 id="productDetailTitle">${escapeHtml(itemName)}</h2>
        <div class="product-detail-meta">
          ${detailMeta(uiText('型号', 'Model'), translateModel(item.model || uiText('未填写', 'Not filled')))}
          ${detailMeta(uiText('外型尺寸', 'Overall Dimensions'), translateChineseText(item.dimensions || uiText('未填写', 'Not filled')))}
          ${state.showPrices ? detailMeta(uiText('价格', 'Price'), formatPrice(item.price)) : ''}
        </div>
        ${buildDocumentActionsHtml(item)}
      </div>
    </div>
    <div class="product-detail-sections">
      ${detailSections || `<section class="product-detail-section muted-section">${uiText('暂无更多产品描述', 'No additional product description')}</section>`}
    </div>
  `;
}

function detailMeta(label, value) {
  return `
    <div class="product-detail-meta-row">
      <span>${escapeHtml(label)}</span>
      <strong>${escapeHtml(value)}</strong>
    </div>
  `;
}

function buildDocumentActionsHtml(item) {
  const documents = item.documents || {};
  const buttons = DOCUMENT_ACTIONS
    .filter((action) => action.key !== 'energyReport' || (item.type === 'equipment' && isCccMarkedItem(item)))
    .map((action) => {
    const label = translateDocumentLabel(typeof action.label === 'function' ? action.label(item) : action.label);
    const materialPath = String(documents[action.key] || '').trim();
    const disabled = !materialPath;
    return `
      <button
        type="button"
        class="material-copy-btn"
        data-item-id="${item.id}"
        data-material-key="${action.key}"
        data-label="${escapeHtml(label)}"
        data-material-path="${escapeHtml(materialPath)}"
        aria-disabled="${disabled}"
        title="${disabled ? uiText('暂无资料，右键添加', 'No material. Right-click to add.') : uiText(`左键复制${label}，右键管理`, `Left-click to copy ${label}; right-click to manage.`)}">
        ${escapeHtml(label)}
      </button>
    `;
  }).join('');

  return `
    <div class="product-detail-materials" aria-label="${uiText('产品资料复制', 'Product material copy')}">
      ${buttons}
    </div>
  `;
}

async function copyMaterialFromDetail(event) {
  if (gallerySuppressClick) return;
  const imageButton = event.target.closest('.product-image-copy-btn');
  if (imageButton) {
    await copyProductImageFromDetail(imageButton);
    return;
  }

  const button = event.target.closest('.material-copy-btn');
  if (!button) return;
  const materialPath = button.dataset.materialPath;
  if (!materialPath) return;
  const originalLabel = button.dataset.label || button.textContent;
  const copyApi = window.electronAPI?.copyMaterialFile || window.salesApi.copyMaterialFile;
  if (!copyApi) {
    showToast(uiText('复制失败：未找到剪贴板接口。', 'Copy failed: clipboard API not found.'), 'error');
    return;
  }

  try {
    button.disabled = true;
    await copyApi(materialPath);
    button.textContent = uiText('已复制', 'Copied');
    showToast(uiText(`${originalLabel}已复制，可直接粘贴。`, `${originalLabel} copied. Ready to paste.`), 'success');
  } catch (error) {
    showToast(error.message || uiText('复制失败。', 'Copy failed.'), 'error');
  } finally {
    window.setTimeout(() => {
      button.textContent = originalLabel;
      button.disabled = false;
    }, 1500);
  }
}

function openMaterialContextMenu(event) {
  const button = event.target.closest('.material-copy-btn');
  const imageArea = event.target.closest('.product-detail-image');
  if (!button && !imageArea) return;
  event.preventDefault();
  event.stopPropagation();

  const menu = el.materialContextMenu;
  const item = state.items.find((entry) => entry.id === Number(el.productDetailOverlay.dataset.itemId));
  const imagePath = imageArea ? galleryPaths(item)[galleryIndex] || '' : '';
  const hasMaterial = imageArea ? Boolean(imagePath) : Boolean(button.dataset.materialPath);
  menu.dataset.mode = imageArea ? 'image' : 'material';
  menu.dataset.imagePath = imagePath;
  menu.dataset.itemId = imageArea ? String(item.id) : button.dataset.itemId || '';
  menu.dataset.materialKey = button?.dataset.materialKey || '';
  menu.dataset.label = button?.dataset.label || '';
  menu.dataset.hasMaterial = String(hasMaterial);
  const attachButton = menu.querySelector('[data-material-action="attach"]');
  const removeButton = menu.querySelector('[data-material-action="remove"]');
  attachButton.textContent = imageArea ? uiText('添加图片', 'Add Images') : uiText(hasMaterial ? '替换资料' : '添加资料', hasMaterial ? 'Replace Material' : 'Add Material');
  const replaceButton = menu.querySelector('[data-material-action="replace-image"]');
  replaceButton.hidden = !imageArea;
  replaceButton.disabled = !hasMaterial;
  replaceButton.textContent = uiText('替换当前图', 'Replace Image');
  removeButton.textContent = imageArea ? uiText('删除当前图', 'Remove Image') : uiText('删除资料', 'Remove Material');
  removeButton.disabled = !hasMaterial;
  menu.classList.remove('hidden');

  const rect = menu.getBoundingClientRect();
  menu.style.left = `${Math.max(8, Math.min(event.clientX, window.innerWidth - rect.width - 8))}px`;
  menu.style.top = `${Math.max(8, Math.min(event.clientY, window.innerHeight - rect.height - 8))}px`;
  attachButton.focus();
}

function closeMaterialContextMenu() {
  if (!el.materialContextMenu) return;
  el.materialContextMenu.classList.add('hidden');
}

async function handleMaterialContextAction(event) {
  const actionButton = event.target.closest('button[data-material-action]');
  if (!actionButton || actionButton.disabled) return;
  const menu = el.materialContextMenu;
  if (menu.dataset.mode === 'image') {
    await handleProductImageAction(actionButton.dataset.materialAction, Number(menu.dataset.itemId), menu.dataset.imagePath);
    return;
  }
  const payload = {
    itemId: Number(menu.dataset.itemId),
    key: menu.dataset.materialKey
  };
  const label = menu.dataset.label || uiText('资料', 'Material');
  const action = actionButton.dataset.materialAction;
  closeMaterialContextMenu();

  try {
    if (action === 'attach') {
      const result = await window.salesApi.attachMaterialFile(payload);
      if (!result) return;
      showToast(uiText(`${label}已添加。`, `${label} added.`), 'success');
    } else {
      const item = state.items.find((entry) => entry.id === payload.itemId);
      const confirmed = await showAppConfirm({
        title: `删除${label}`,
        message: `删除后，当前产品将不再显示${label}。`,
        details: [`${item?.name || '当前产品'}${item?.model ? `（${item.model}）` : ''}`],
        confirmText: '确认删除',
        cancelText: '保留资料',
        tone: 'danger'
      });
      if (!confirmed) return;
      await window.salesApi.removeMaterialFile(payload);
      showToast(`${label}已删除。`, 'success');
    }
    await loadItems();
    if (state.items.some((item) => item.id === payload.itemId)) openProductDetail(payload.itemId);
  } catch (error) {
    showToast(error.message || uiText('资料操作失败。', 'Material operation failed.'), 'error');
  }
}

async function handleProductImageAction(action, itemId, imagePath) {
  closeMaterialContextMenu();
  const oldIndex = galleryIndex;
  try {
    let result;
    if (action === 'attach') result = await window.salesApi.addProductImages(itemId);
    else if (action === 'replace-image') result = await window.salesApi.replaceProductImage(itemId, imagePath);
    else {
      const item = state.items.find((entry) => entry.id === itemId);
      const confirmed = await showAppConfirm({
        title: uiText('删除当前图片', 'Remove Image'),
        message: uiText('同组全部型号都会移除这张图片。', 'This image will be removed from all models in this product group.'),
        details: [item?.name || '', ...(item?.image_path === imagePath ? [uiText('这是主图，删除后主页和报价单将不再显示该图。', 'This is the main image. It will also be removed from cards and quotations.')] : [])],
        confirmText: uiText('确认删除', 'Remove'), cancelText: uiText('保留图片', 'Keep Image'), tone: 'danger'
      });
      if (!confirmed) return;
      result = await window.salesApi.removeProductImage(itemId, imagePath);
    }
    if (!result) return;
    await loadItems();
    if (Number(el.productDetailOverlay.dataset.itemId) === itemId && !el.productDetailOverlay.classList.contains('hidden')) {
      const item = state.items.find((entry) => entry.id === itemId);
      galleryIndex = action === 'attach' ? galleryPaths(item).length - 1 : oldIndex;
      el.productDetailContent.innerHTML = buildProductDetailHtml(item);
    }
    showToast(uiText('图片已更新，同组全部型号已同步。', 'Images updated for all models in this group.'), 'success');
  } catch (error) {
    showToast(error.message || uiText('图片操作失败。', 'Image operation failed.'), 'error');
  }
}

async function copyProductImageFromDetail(button) {
  const itemId = Number(button.dataset.itemId);
  const copyApi = window.electronAPI?.copyProductImage || window.salesApi.copyProductImage;
  if (!copyApi) {
    showToast(uiText('复制失败：未找到图片剪贴板接口。', 'Copy failed: image clipboard API not found.'), 'error');
    return;
  }

  const status = button.querySelector('.product-image-copy-status');
  try {
    button.disabled = true;
    await copyApi(itemId, Number(button.dataset.imageIndex || 0));
    button.classList.add('copied');
    if (status) status.textContent = uiText('已复制', 'Copied');
    showToast(uiText('产品图片已复制，可直接粘贴。', 'Product image copied. Ready to paste.'), 'success');
  } catch (error) {
    showToast(error.message || uiText('图片复制失败。', 'Failed to copy image.'), 'error');
  } finally {
    window.setTimeout(() => {
      button.disabled = false;
      button.classList.remove('copied');
      if (status) status.textContent = '';
    }, 1500);
  }
}

function detailSection(title, value) {
  const text = String(value || '').trim();
  if (!text) return '';
  return `
    <section class="product-detail-section">
      <h3>${escapeHtml(title)}</h3>
      <div>${escapeHtml(text)}</div>
    </section>
  `;
}

function standardSelectionKey(item) {
  return `item-${item.id}`;
}

function customSelectionKey(itemId) {
  return `custom-${itemId}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function getSelectedKey(item) {
  return item.selectionKey || standardSelectionKey(item);
}

function displayName(item) {
  return item.name;
}

function displayModel(item) {
  return item.model;
}

function displaySize(item) {
  return item.isCustom && item.customSize ? item.customSize : item.dimensions;
}

function displayRemark(item) {
  if (!item.isCustom) return item.lineRemark || item.remark || '';
  return item.customRequirement || '';
}

function customMarkedName(name) {
  const value = String(name || '').trim();
  if (!value) return '\u3010\u5f02\u578b\u3011';
  return value.includes('\u3010\u5f02\u578b\u3011') ? value : `\u3010\u5f02\u578b\u3011${value}`;
}

function materializeSelectedItem(item) {
  const parameters = item.isCustom && item.customBasicParams ? item.customBasicParams : item.parameters;
  return {
    ...item,
    name: item.isCustom ? customMarkedName(displayName(item)) : displayName(item),
    model: displayModel(item),
    dimensions: displaySize(item),
    parameters,
    application: item.application,
    selling_points: item.selling_points,
    remark: displayRemark(item),
    lineRemark: displayRemark(item)
  };
}

function materializeSelectedItemForExport(item) {
  const value = materializeSelectedItem(item);
  if (!state.showPrices) value.price = 0;
  return isEnglishMode() ? translateItemForEnglishExport(value) : value;
}

function translateItemForEnglishExport(item) {
  return {
    ...item,
    name: translateProductName(item.name),
    category: translateCategory(item.category),
    model: translateModel(item.model),
    unit: item.unit === '件' ? 'pc' : item.unit === '台' ? 'set' : translateChineseText(item.unit),
    parameters: translateStructuredText(item.parameters),
    application: translateApplicationText(item),
    selling_points: translateSellingPointsText(item),
    remark: translateStructuredText(item.remark),
    lineRemark: translateStructuredText(item.lineRemark || item.remark),
    customRequirement: translateStructuredText(item.customRequirement)
  };
}

function appendCustomRequirement(text) {
  const value = String(text || '').trim();
  if (!value) return;
  const current = el.customRequirement.value.trim();
  el.customRequirement.value = current ? `${current}\n${value}` : value;
}
function toggleSelected(item, options = {}) {
  const key = standardSelectionKey(item);
  let selected = false;
  if (state.selected.has(key)) {
    state.selected.delete(key);
  } else {
    selected = true;
    state.selected.set(key, {
      ...item,
      selectionKey: key,
      isCustom: false,
      quantity: 1,
      unit: item.type === 'part' ? '件' : '台',
      lineRemark: item.remark || ''
    });
  }
  renderSelected();
  renderCards();
  if (options.notify) {
    showToast(selected ? uiText('已加入清单。', 'Added to selection.') : uiText('已从清单移除。', 'Removed from selection.'), 'success');
  }
}

function addCustomItem(item) {
  el.customItemId.value = item.id;
  el.customItemName.textContent = `${item.name}${item.model ? ` / ${item.model}` : ''}`;
  el.customSize.value = item.dimensions || '';
  el.customBasicParams.value = item.parameters || '';
  el.customRequirement.value = item.remark || '';
  el.customDialog.showModal();
  setTimeout(() => el.customSize.focus(), 0);
}

function saveCustomRequirement(event) {
  event.preventDefault();
  const itemId = Number(el.customItemId.value);
  const item = state.items.find((entry) => entry.id === itemId);
  if (!item) return;

  const requirement = el.customRequirement.value.trim();
  const key = customSelectionKey(item.id);
  state.selected.set(key, {
    ...item,
    selectionKey: key,
    sourceId: item.id,
    isCustom: true,
    quantity: 1,
    unit: item.type === 'part' ? '件' : '台',
    customSize: el.customSize.value.trim(),
    customBasicParams: el.customBasicParams.value.trim(),
    customRequirement: requirement,
    lineRemark: requirement
  });
  renderSelected();
  renderCards();
  el.customDialog.close();
  showToast('已加入清单，异型修改只用于当前清单和本次导出。', 'success');
}

function renderSelected() {
  const selected = Array.from(state.selected.values());
  el.selectedCount.textContent = isEnglishMode() ? `${selected.length} item${selected.length === 1 ? '' : 's'}` : `${selected.length} 项`;
  if (!selected.length) {
    el.selectedList.className = 'selected-list empty';
    el.selectedList.textContent = uiText('暂未选择设备或配件', 'No equipment or parts selected');
    return;
  }

  el.selectedList.className = 'selected-list';
  el.selectedList.innerHTML = selected.map((item) => `
    <div class="selected-item" data-key="${escapeAttribute(getSelectedKey(item))}">
      <strong>${escapeHtml(item.isCustom ? `${uiText('【异型】', '[Custom] ')}${translateProductName(displayName(item))}` : translateProductName(displayName(item)))}</strong>
      <div class="meta">${uiText('型号', 'Model')}: ${escapeHtml(translateModel(displayModel(item) || uiText('未填写', 'Not filled')))}</div>
      <div class="selected-grid">
        <label>${uiText('数量', 'Quantity')}<input data-field="quantity" type="number" min="1" step="1" value="${item.quantity}"></label>
        ${renderSelectedPriceInput(item)}
      </div>
      <label>${uiText('备注', 'Remarks')}<input data-field="lineRemark" value="${escapeAttribute(isEnglishMode() ? translateStructuredText(displayRemark(item)) : displayRemark(item))}"></label>
      <button class="ghost-btn" data-action="remove">${uiText('移除', 'Remove')}</button>
    </div>
  `).join('');

  el.selectedList.querySelectorAll('.selected-item').forEach((node) => {
    const key = node.dataset.key;
    node.querySelectorAll('input').forEach((input) => {
      input.addEventListener('input', () => {
        const item = state.selected.get(key);
        if (item) item[input.dataset.field] = input.value;
      });
    });
    node.querySelector('[data-action="remove"]').addEventListener('click', () => {
      state.selected.delete(key);
      renderSelected();
      renderCards();
    });
  });
  renderContractSelected();
  renderQuoteSelected();
}

function renderContractSelected() {
  const selected = Array.from(state.selected.values());
  if (!selected.length) {
    el.contractSelectedList.className = 'selected-list empty';
    el.contractSelectedList.textContent = '暂未选择设备或配件';
    return;
  }

  el.contractSelectedList.className = 'selected-list';
  el.contractSelectedList.innerHTML = selected.map((item) => `
    <div class="selected-item" data-key="${escapeAttribute(getSelectedKey(item))}">
      <strong>${item.isCustom ? '【异型】' : ''}${escapeHtml(displayName(item))}</strong>
      <div class="meta">型号：${escapeHtml(displayModel(item) || '未填写')}</div>
      <div class="selected-grid">
        <label>数量<input data-field="quantity" type="number" min="1" step="1" value="${item.quantity}"></label>
        ${renderSelectedPriceInput(item)}
      </div>
      <label>备注<input data-field="lineRemark" value="${escapeAttribute(displayRemark(item))}"></label>
    </div>
  `).join('');

  el.contractSelectedList.querySelectorAll('.selected-item').forEach((node) => {
    const key = node.dataset.key;
    node.querySelectorAll('input').forEach((input) => {
      input.addEventListener('input', () => {
        const item = state.selected.get(key);
        if (item) item[input.dataset.field] = input.value;
      });
    });
  });
}

function renderQuoteSelected() {
  const selected = Array.from(state.selected.values());
  if (!selected.length) {
    el.quoteSelectedList.className = 'selected-list empty';
    el.quoteSelectedList.textContent = uiText('暂未选择设备或配件', 'No equipment or parts selected');
    return;
  }

  el.quoteSelectedList.className = 'selected-list';
  el.quoteSelectedList.innerHTML = selected.map((item) => `
    <div class="selected-item" data-key="${escapeAttribute(getSelectedKey(item))}">
      <strong>${escapeHtml(item.isCustom ? `${uiText('【异型】', '[Custom] ')}${translateProductName(displayName(item))}` : translateProductName(displayName(item)))}</strong>
      <div class="meta">${uiText('规格', 'Specification')}: ${escapeHtml(translateModel(displaySize(item) || displayModel(item) || uiText('未填写', 'Not filled')))}</div>
      <div class="selected-grid">
        <label>${uiText('数量', 'Quantity')}<input data-field="quantity" type="number" min="1" step="1" value="${item.quantity}"></label>
        ${renderSelectedPriceInput(item)}
      </div>
      <label>${uiText('备注', 'Remarks')}<input data-field="lineRemark" value="${escapeAttribute(isEnglishMode() ? translateStructuredText(displayRemark(item)) : displayRemark(item))}"></label>
    </div>
  `).join('');

  el.quoteSelectedList.querySelectorAll('.selected-item').forEach((node) => {
    const key = node.dataset.key;
    node.querySelectorAll('input').forEach((input) => {
      input.addEventListener('input', () => {
        const item = state.selected.get(key);
        if (item) item[input.dataset.field] = input.value;
      });
    });
  });
}

function showPage(page) {
  document.body.classList.toggle('catalog-mode', page === 'catalog');
  el.catalogPage.classList.toggle('active', page === 'catalog');
  el.contractPage.classList.toggle('active', page === 'contract');
  el.quotePage.classList.toggle('active', page === 'quote');
  el.backToCatalogBtn.classList.toggle('hidden', page === 'catalog');
  el.newItemBtn.classList.toggle('hidden', page !== 'catalog');
  const subtitles = {
    catalog: uiText('本地产品资料库、销售展示、合同输出', 'Local product library, sales display and document output'),
    contract: '制作合同',
    quote: uiText('制作报价单', 'Create Quotation')
  };
  el.pageSubtitle.textContent = subtitles[page];
  window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  if (page === 'contract') el.contractPage.scrollTo?.({ top: 0, left: 0, behavior: 'auto' });
  if (page === 'quote') el.quotePage.scrollTo?.({ top: 0, left: 0, behavior: 'auto' });
}

function openItemDialog(item = null) {
  el.itemForm.reset();
  el.itemId.value = item?.id || '';
  el.dialogTitle.textContent = item ? '编辑商品' : '新增商品';
  el.deleteItemBtn.classList.toggle('hidden', !item);
  el.copyItemBtn.classList.toggle('hidden', !item);
  el.itemType.value = item?.type || 'equipment';
  updateFormByType();
  el.itemName.value = item?.name || '';
  el.itemModel.value = item?.model || '';
  el.itemCategory.value = item?.category || (el.itemType.value === 'part' ? PART_CATEGORIES[0] : CATEGORIES[0]);
  el.itemPrice.value = item?.price ?? '';
  el.itemDimensions.value = item?.dimensions || '';
  el.itemParameters.value = item?.parameters || '';
  el.itemApplication.value = item?.application || '';
  el.itemSellingPoints.value = item?.selling_points || '';
  el.itemRemark.value = item?.remark || '';
  el.itemImagePath.value = item?.image_path || '';
  updateImagePreview();
  updateItemCompletenessPanel(item || readItemDraftFromForm());
  el.itemDialog.showModal();
}

function updateFormByType() {
  const isEquipment = el.itemType.value === 'equipment';
  const currentValue = el.itemCategory.value;
  fillCategorySelect(el.itemCategory, isEquipment ? CATEGORIES : PART_CATEGORIES);
  el.itemCategory.value = (isEquipment ? CATEGORIES : PART_CATEGORIES).includes(currentValue)
    ? currentValue
    : (isEquipment ? CATEGORIES[0] : PART_CATEGORIES[0]);
  document.querySelectorAll('.equipment-only').forEach((node) => {
    node.classList.toggle('hidden', !isEquipment);
  });
  updateItemCompletenessPanel(readItemDraftFromForm());
}

async function pickImage() {
  const imagePath = await window.salesApi.pickImage({
    type: el.itemType.value,
    category: el.itemCategory.value,
    name: el.itemName.value
  });
  if (!imagePath) return;
  el.itemImagePath.value = imagePath;
  updateImagePreview();
}

function removeCurrentImage() {
  el.itemImagePath.value = '';
  updateImagePreview();
}

function updateImagePreview() {
  const imagePath = el.itemImagePath.value;
  el.imagePreview.src = imagePath ? pathToFileUrl(imagePath) : '';
  el.imagePreview.closest('.image-preview-wrap')?.classList.toggle('empty', !imagePath);
  updateItemCompletenessPanel(readItemDraftFromForm());
}

function updateItemCompletenessPanel(item) {
  const missing = getMissingEquipmentInfo(item);
  if (!el.itemCompletenessPanel) return;
  if (!missing.length) {
    el.itemCompletenessPanel.classList.add('hidden');
    el.itemCompletenessPanel.innerHTML = '';
    return;
  }
  el.itemCompletenessPanel.classList.remove('hidden');
  el.itemCompletenessPanel.innerHTML = `
    <strong>资料待补</strong>
    <span>${missing.map((entry) => `<b>${escapeHtml(entry)}</b>`).join('')}</span>
  `;
}

function copyCurrentItemDraft() {
  if (!el.itemId.value) return;
  el.itemId.value = '';
  el.dialogTitle.textContent = '复制商品';
  el.deleteItemBtn.classList.add('hidden');
  el.copyItemBtn.classList.add('hidden');
  showToast('已复制为新商品草稿，确认无误后点击保存。', 'success');
  el.itemName.focus();
}

async function saveItem(event) {
  event.preventDefault();
  if (!el.itemName.value.trim()) return;
  const item = readItemDraftFromForm();
  await window.salesApi.saveItem(item);
  el.itemDialog.close();
  await loadItems();
}

function readItemDraftFromForm() {
  return {
    id: el.itemId.value ? Number(el.itemId.value) : null,
    type: el.itemType.value,
    name: el.itemName.value,
    model: el.itemModel.value,
    category: el.itemCategory.value,
    price: el.itemPrice.value,
    dimensions: el.itemDimensions.value,
    parameters: el.itemParameters.value,
    application: el.itemApplication.value,
    selling_points: el.itemSellingPoints.value,
    remark: el.itemRemark.value,
    image_path: el.itemImagePath.value
  };
}

async function deleteCurrentItem() {
  const id = Number(el.itemId.value);
  if (!id) return;
  const confirmed = await showAppConfirm({
    title: '删除商品',
    message: '删除后，该商品将从产品资料库中移除。',
    details: [`${el.itemName.value || '当前商品'}${el.itemModel.value ? `（${el.itemModel.value}）` : ''}`],
    confirmText: '确认删除',
    cancelText: '保留商品',
    tone: 'danger'
  });
  if (!confirmed) return;
  await window.salesApi.deleteItem(id);
  Array.from(state.selected.entries()).forEach(([key, item]) => {
    if (item.id === id || item.sourceId === id) state.selected.delete(key);
  });
  el.itemDialog.close();
  renderSelected();
  await loadItems();
}

async function createContract() {
  const selected = Array.from(state.selected.values());
  if (!selected.length) {
    showToast('请先选择设备或配件。', 'warning');
    setStatus('请先选择设备或配件。');
    return;
  }
  if (!el.customerName.value.trim()) {
    showToast('请填写需方名称，合同需要这个信息。', 'warning');
    setStatus('请填写需方名称。');
    return;
  }
  if (!el.customerCode.value.trim()) {
    await updateCustomerCodeFromName();
  }
  const pendingReviewFields = [...document.querySelectorAll('.contract-review-field.review-needed')]
    .map((field) => String(field.childNodes[0]?.textContent || '').trim())
    .filter(Boolean);
  if (pendingReviewFields.length) {
    const confirmed = await showAppConfirm({
      title: '合同字段尚未确认',
      message: '以下内容还没有逐项检查。建议返回确认，或确认无误后继续生成合同。',
      details: pendingReviewFields,
      confirmText: '仍然生成',
      cancelText: '返回检查',
      tone: 'warning'
    });
    if (!confirmed) return;
  }
  try {
    showToast('正在生成合同，请稍候...', 'info');
    const outputPath = await window.salesApi.createContract({
      contractNo: el.contractNo.value.trim(),
      invoiceType: el.invoiceType.value,
      customerName: el.customerName.value.trim(),
      customerCode: el.customerCode.value.trim(),
      contractDate: el.contractDate.value,
      payment: el.payment.value,
      deliveryDate: el.deliveryDate.value,
      deliveryMethod: el.deliveryMethod.value,
      freight: el.freight.value,
      buyerInvoiceInfo: el.buyerInvoiceInfo.value,
      items: selected.map(materializeSelectedItemForExport)
    });
    const message = outputPath ? `合同已生成：${outputPath}` : '已取消保存。';
    setStatus(message);
    showToast(message, outputPath ? 'success' : 'info');
  } catch (error) {
    const message = error.message || '生成合同失败。';
    setStatus(message);
    showToast(message, 'error');
  }
}

async function createQuote() {
  const selected = Array.from(state.selected.values());
  if (!selected.length) {
    showToast(uiText('请先选择设备或配件。', 'Please select equipment or parts first.'), 'warning');
    setQuoteStatus(uiText('请先选择设备或配件。', 'Please select equipment or parts first.'));
    return;
  }
  try {
    showToast(uiText('正在生成报价单，请稍候...', 'Creating quotation, please wait...'), 'info');
    const quoteRemark = isEnglishMode() && (!el.quoteRemark.value.trim() || hasChineseText(el.quoteRemark.value))
      ? DEFAULT_QUOTE_REMARK_EN
      : el.quoteRemark.value;
    if (quoteRemark !== el.quoteRemark.value) {
      el.quoteRemark.value = quoteRemark;
    }
    const outputPath = await window.salesApi.createQuote({
      remark: quoteRemark,
      language: state.quoteLanguage,
      items: selected.map(materializeSelectedItemForExport)
    });
    const message = outputPath
      ? uiText(`报价单已生成：${outputPath}`, `Quotation created: ${outputPath}`)
      : uiText('已取消保存。', 'Save canceled.');
    setQuoteStatus(message);
    showToast(message, outputPath ? 'success' : 'info');
  } catch (error) {
    const message = error.message || uiText('生成报价单失败。', 'Failed to create quotation.');
    setQuoteStatus(message);
    showToast(message, 'error');
  }
}


async function openRecentFiles() {
  try {
    state.recentFiles = await window.salesApi.listRecentFiles();
    state.recentFileType = 'contract';
    updateRecentFileTabs();
    renderRecentFiles();
    el.recentFilesDialog.showModal();
  } catch (error) {
    showToast(error.message || '读取最近文件失败。', 'error');
  }
}

async function openAfterSalesVideo() {
  try {
    showToast('正在打开售后视频库...', 'info');
    await window.salesApi.openAfterSalesVideo();
    showToast('售后视频库已打开。', 'success');
  } catch (error) {
    showToast(error.message || '售后视频库启动失败，请检查网络或视频库服务', 'error');
  }
}

async function checkForUpdates(silent = false) {
  try {
    const update = await window.salesApi.checkUpdate();
    state.update = update;
    renderUpdateButtons();
    if (!silent) {
      showToast(update.available ? `发现新版本 ${update.latestVersion}，点击更新开始安装。` : (update.message || '当前已经是最新版本。'), update.available ? 'warning' : 'success');
    }
    return update;
  } catch (error) {
    state.update = null;
    renderUpdateButtons();
    if (!silent) showToast(error.message || '检查更新失败。', 'error');
    return null;
  }
}

async function handleUpdateClick() {
  const update = state.update?.available ? state.update : await checkForUpdates(false);
  if (!update?.available) return;
  const confirmed = await showAppConfirm({
    title: '更新程序版本',
    message: `程序将关闭，并从局域网同步${update.latestVersion ? ` ${update.latestVersion} 版本` : '最新版本'}。`,
    details: ['保留本机 outputs 文件', '保留 local-data 和最近文件', '更新完成后自动重新打开'],
    confirmText: '开始更新',
    cancelText: '暂不更新',
    tone: 'update'
  });
  if (!confirmed) return;
  try {
    showToast('正在启动更新器，软件即将关闭...', 'info');
    await window.salesApi.startUpdate();
  } catch (error) {
    showToast(error.message || '启动更新失败。', 'error');
  }
}

async function handleDataRefreshClick() {
  const confirmed = await showAppConfirm({
    title: '刷新产品资料',
    message: '程序将关闭，并从局域网同步最新数据库、库存、图片和资料文件。',
    details: ['不更新程序功能', '保留 outputs 和最近文件', '刷新完成后自动重新打开'],
    confirmText: '开始刷新',
    cancelText: '暂不刷新',
    tone: 'update'
  });
  if (!confirmed) return;
  try {
    showToast('正在打开资料刷新进度窗口…', 'info');
    await window.salesApi.startDataRefresh();
  } catch (error) {
    showToast(error.message || '资料刷新失败。', 'error');
  }
}

function showAppConfirm({
  title = '确认操作',
  message = '',
  details = [],
  confirmText = '确认',
  cancelText = '取消',
  tone = 'warning'
} = {}) {
  if (appConfirmResolver) settleAppConfirm(false);

  el.appConfirmTitle.textContent = title;
  el.appConfirmMessage.textContent = message;
  el.appConfirmConfirmBtn.textContent = confirmText;
  el.appConfirmCancelBtn.textContent = cancelText;
  el.appConfirmDialog.dataset.tone = tone;
  el.appConfirmConfirmBtn.className = tone === 'danger' ? 'danger-btn' : 'primary-btn';
  el.appConfirmDetails.replaceChildren();

  const entries = details.filter(Boolean);
  entries.forEach((detail) => {
    const item = document.createElement('li');
    item.textContent = detail;
    el.appConfirmDetails.append(item);
  });
  el.appConfirmDetails.classList.toggle('hidden', !entries.length);

  return new Promise((resolve) => {
    appConfirmResolver = resolve;
    el.appConfirmDialog.showModal();
  });
}

function settleAppConfirm(confirmed) {
  const resolve = appConfirmResolver;
  appConfirmResolver = null;
  if (el.appConfirmDialog.open) el.appConfirmDialog.close();
  if (resolve) resolve(confirmed);
}

async function showDataRefreshResult() {
  try {
    const result = await window.salesApi.getDataRefreshResult();
    if (!result) return;
    if (result.ok) {
      showToast('资料刷新成功，数据库、库存、图片和资料已更新。', 'success');
      return;
    }
    const labels = {
      'database-download': '数据库下载失败',
      'database-missing': '更新源缺少数据库',
      'database-invalid': '下载的数据库无效',
      'images-download': '图片下载失败',
      'materials-download': '资料文件下载失败',
      'database-replace': '数据库替换失败',
      'images-apply': '图片应用失败',
      'materials-apply': '资料文件应用失败',
      'result-unreadable': '刷新结果无法读取'
    };
    const reason = labels[result.detail] || '资料刷新失败';
    showToast(`${reason}${result.code ? `（错误码 ${result.code}）` : ''}，程序已恢复打开。`, 'error');
  } catch (error) {
    showToast(error.message || '无法读取资料刷新结果。', 'error');
  }
}

function renderUpdateButtons() {
  const hasUpdate = Boolean(state.update?.available);
  [el.heroUpdateAppBtn].forEach((button) => {
    if (!button) return;
    button.classList.toggle('has-update', hasUpdate);
    button.title = hasUpdate
      ? `发现新版本 ${state.update.latestVersion}`
      : '检查局域网更新';
  });
}

function updateRecentFileTabs() {
  el.recentFileTypeTabs.querySelectorAll('button[data-recent-type]').forEach((button) => {
    const active = button.dataset.recentType === state.recentFileType;
    button.classList.toggle('active', active);
    button.setAttribute('aria-selected', String(active));
  });
}

function renderRecentFiles() {
  const files = Array.isArray(state.recentFiles) ? state.recentFiles : [];
  const items = files.filter((item) => (
    state.recentFileType === 'quote'
      ? String(item.type || '').includes('报价单')
      : item.type === '合同'
  ));
  if (!items.length) {
    el.recentFilesList.className = 'recent-files-list empty';
    el.recentFilesList.textContent = state.recentFileType === 'quote' ? '暂无报价单' : '暂无合同';
    return;
  }
  el.recentFilesList.className = 'recent-files-list';
  el.recentFilesList.innerHTML = items.map((item) => `
    <div class="recent-file-item">
      <div class="recent-file-main">
        <strong>${escapeHtml(item.fileName || '未命名文件')}</strong>
        <div class="meta" title="${escapeAttribute(String(item.type || '').includes('报价单') ? (item.itemSummary || '未记录设备') : (item.customerName || '未填写客户'))}">${escapeHtml(item.date || '')}｜${escapeHtml(String(item.type || '').includes('报价单') ? (item.itemSummary || '未记录设备') : (item.customerName || '未填写客户'))}｜${escapeHtml(item.type || '文件')}</div>
      </div>
      <div class="recent-file-actions">
        <button class="ghost-btn" data-action="open" data-path="${escapeAttribute(item.filePath || '')}">打开文件</button>
        <button class="ghost-btn" data-action="reveal" data-path="${escapeAttribute(item.filePath || '')}">打开所在文件夹</button>
      </div>
    </div>
  `).join('');
  el.recentFilesList.querySelectorAll('button[data-action]').forEach((button) => {
    button.addEventListener('click', async () => {
      const filePath = button.dataset.path;
      try {
        if (button.dataset.action === 'open') {
          await window.salesApi.openRecentFile(filePath);
        } else {
          await window.salesApi.revealRecentFile(filePath);
        }
      } catch (error) {
        showToast(error.message || '文件操作失败。', 'error');
      }
    });
  });
}

function updateContractNo() {
  const date = (el.contractDate.value || new Date().toISOString().slice(0, 10)).replaceAll('-', '');
  const code = (el.customerCode.value || (el.customerName.value ? makeCustomerCode(el.customerName.value) : '')).toUpperCase();
  el.contractNo.value = code ? `${date}-${code}` : date;
}

function setStatus(text) {
  el.statusText.textContent = text;
}

function setQuoteStatus(text) {
  el.quoteStatusText.textContent = text;
}

function legacyNormalizeInvoiceInfoForView(input) {
  return invoiceFieldsToText(parseInvoiceInfoFields(input));
}

function legacyParseInvoiceInfoFields(input) {
  const raw = String(input || '').trim();
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
  if (!raw) return fields;
  parseInvoiceInfoForView(raw, fields);
  return fields;
}

function legacyInvoiceFieldsToText(fields) {
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

function makeCustomerCode(name) {
  const code = window.salesApi?.makeCustomerCode?.(name) || '';
  return String(code || '').toUpperCase();
}

let customerCodeRequestSequence = 0;

function updateInvoiceRecognitionAction() {
  setInvoiceRecognitionPending(Boolean(el.buyerInvoiceInfo.value.trim()));
}

function setInvoiceRecognitionPending(pending) {
  el.formatInvoiceInfoBtn.classList.toggle('invoice-recognition-ready', pending);
  el.formatInvoiceInfoBtn.title = pending ? '已检测到开票信息，点击整理识别' : '整理并识别开票信息';
}

function bindContractReviewFields() {
  ['deliveryMethod', 'freight', 'deliveryDate', 'invoiceType', 'payment'].forEach((fieldId) => {
    const field = document.querySelector(`#${fieldId}`);
    if (!field) return;
    const markReviewed = () => field.closest('.contract-review-field')?.classList.remove('review-needed');
    field.addEventListener('click', markReviewed);
    field.addEventListener('focus', markReviewed);
    field.addEventListener('change', markReviewed);
    field.addEventListener('input', markReviewed);
  });
}

function resetContractReviewFields() {
  document.querySelectorAll('.contract-review-field').forEach((field) => field.classList.add('review-needed'));
}

async function updateCustomerCodeFromName() {
  const customerName = el.customerName.value.trim();
  const requestSequence = ++customerCodeRequestSequence;
  if (!customerName) {
    el.customerCode.value = '';
    updateContractNo();
    return;
  }

  try {
    const resolvedCode = await window.salesApi.resolveCustomerCode(customerName);
    if (requestSequence === customerCodeRequestSequence && el.customerName.value.trim() === customerName) {
      el.customerCode.value = resolvedCode || makeCustomerCode(customerName);
    }
  } catch {
    if (requestSequence === customerCodeRequestSequence) {
      el.customerCode.value = makeCustomerCode(customerName);
    }
  }
  if (requestSequence === customerCodeRequestSequence) updateContractNo();
}

const FALLBACK_INITIALS = buildFallbackInitials({
  A: '阿安奥爱',
  B: '八巴白百班宝北滨博',
  C: '餐仓昌长常超城成诚创厨春村',
  D: '大德东鼎达店',
  E: '恩儿',
  F: '发方丰佛福富',
  G: '高国广光贵锅',
  H: '海汉杭好合河恒弘宏湖华环汇辉',
  J: '机吉济嘉佳建江焦金京久莒聚君技',
  K: '开康科口',
  L: '来蓝老乐利联良林龙隆鲁伦陵',
  M: '美门民明',
  N: '南农宁',
  O: '欧瓯',
  P: '鹏品普',
  Q: '齐企秦青清区庆',
  R: '日荣瑞',
  S: '三陕山上省沈实试食市司顺双',
  T: '泰汤唐天同',
  W: '万王威维味伟魏温沃吴五',
  X: '西县象小校新鑫星兴学行祥咸',
  Y: '雅亚阳一亿益验业饮银永优幼友园元源远云',
  Z: '张浙正郑中众州珠卓展照'
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

function parseInvoiceInfoForView(raw, fields) {
  const normalized = normalizeInvoiceTextForView(raw);
  parseHeaderValueBlockForView(normalized, fields);
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
  const orderedMatches = removeOverlappingInvoiceMatches(matches);
  orderedMatches.forEach((match, index) => {
    const next = orderedMatches[index + 1];
    const rawValue = normalized.slice(match.end, next ? next.index : normalized.length);
    if (match.key === 'bankAndAccount') {
      assignBankAndAccountForView(rawValue, fields);
      return;
    }
    if (match.key === 'addressAndPhone') {
      assignAddressAndPhoneForView(rawValue, fields);
      return;
    }
    if (match.key === 'taxNo') {
      assignTaxNameAddressForView(rawValue, rawValue.split('\n'), fields);
      return;
    }
    const value = cleanInvoiceValue(rawValue, match.key);
    if (value && !fields[match.key]) fields[match.key] = value;
  });
  const bankNoFromParentheses = normalized.match(/[（(]\s*行号\s*:\s*([0-9]{12})\s*[）)]/);
  if (!fields.bankNo && bankNoFromParentheses) fields.bankNo = bankNoFromParentheses[1];
  guessInvoiceFields(normalized, fields);
}

function normalizeInvoiceTextForView(raw) {
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

function parseHeaderValueBlockForView(text, fields) {
  const lines = String(text || '').split('\n').map((line) => line.trim()).filter(Boolean);
  const headerKeys = [];
  let valueStart = -1;
  for (let i = 0; i < lines.length; i += 1) {
    const key = keyForLooseInvoiceHeader(lines[i]);
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
      assignTaxAndAddressForView(value, fields);
      valueIndex += 1;
      return;
    }
    if (key === 'taxNo') {
      assignTaxNameAddressForView(value, values.slice(valueIndex), fields);
      valueIndex += 1;
      return;
    }
    if (key === 'bankAndAccount') {
      assignBankAndAccountForView(value, fields);
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

function keyForLooseInvoiceHeader(line) {
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

function assignTaxAndAddressForView(value, fields) {
  const compact = String(value || '').replace(/\s+/g, '');
  const tax = compact.match(/[0-9A-Z]{15,20}/i);
  if (tax && !fields.taxNo) fields.taxNo = tax[0].toUpperCase();
  const address = tax ? compact.slice(tax.index + tax[0].length).replace(/^编辑/, '') : compact;
  if (address && !fields.address) fields.address = address;
}

function assignTaxNameAddressForView(value, values, fields) {
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

function removeOverlappingInvoiceMatches(matches) {
  return matches
    .sort((a, b) => a.index - b.index || b.end - b.index - (a.end - a.index))
    .filter((match, index, sorted) => {
      const previous = sorted
        .slice(0, index)
        .find((item) => item.index <= match.index && item.end > match.index);
      return !previous;
    });
}

function assignBankAndAccountForView(value, fields) {
  const text = cleanInvoiceValue(value).replace(/账户/g, '').trim();
  const account = text.match(/([0-9][0-9\s]{8,28}[0-9])\s*$/);
  if (account) {
    if (!fields.account) fields.account = account[1].replace(/\s+/g, '');
    const bank = text.slice(0, account.index).trim();
    if (bank && !fields.bank) fields.bank = bank;
  } else if (text && !fields.bank) {
    fields.bank = text;
  }
}

function assignAddressAndPhoneForView(value, fields) {
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

function guessInvoiceFields(text, fields) {
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
    if (phone && !isInsideKnownInvoiceNumber(phone[0], fields)) fields.phone = phone[0];
  }
  if (!fields.account) {
    const account = numbersCompact.match(/\d{12,30}/);
    if (account && account[0] !== fields.phone && account[0] !== fields.taxNo) fields.account = account[0];
  }
}

function isInsideKnownInvoiceNumber(value, fields) {
  return [fields.account, fields.taxNo, fields.bankNo]
    .filter(Boolean)
    .some((known) => String(known).includes(value));
}

function cleanInvoiceValue(value, key = '') {
  let text = String(value || '');
  if (key === 'bank') text = text.split(/或转|也可转|或者转/)[0];
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


// SMART_INVOICE_PARSER_BEGIN
function legacySmartNormalizeInvoiceInfoForView(input) {
  return invoiceFieldsToText(parseInvoiceInfoFields(input));
}

function legacySmartParseInvoiceInfoFields(input) {
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
  const raw = String(input || '').trim();
  if (!raw) return fields;
  const normalized = smartInvoiceNormalize(raw);
  const lines = smartInvoiceLines(normalized);
  smartInvoiceParseLabeledText(normalized, fields);
  smartInvoiceParseHeaderTable(lines, fields);
  smartInvoiceGuessFromLines(lines, fields);
  smartInvoiceFinalize(fields);
  return fields;
}

function smartInvoiceNormalize(raw) {
  let text = String(raw || '')
    .replace(/\r/g, '\n')
    .replace(/[\u00a0\u3000]/g, ' ')
    .replace(/[：﹕︰]/g, ':')
    .replace(/[－—–]/g, '-')
    .replace(/[。]+/g, '\n')
    .replace(/(开户银行及账号|开户行及账号|开户银行账号|开户行账号|开户银行账户|开户行账户|开户行及账户|开户行及帐号|开户银行|开户行|银行账号|银行账户|银行帐号|账号|帐号|账户|地址|统一代码|统一社会信用代码|社会信用代码|纳税人识别号|税号|公司名称|单位名称|名称)\s*[；;]/g, '$1:')
    .replace(/[；;]/g, '\n')
    .replace(/[（]/g, '(')
    .replace(/[）]/g, ')')
    .replace(/税\s*号/g, '税号')
    .replace(/地\s*址/g, '地址')
    .replace(/电\s*话/g, '电话')
    .replace(/开\s*户\s*行/g, '开户行')
    .replace(/帐\s*号/g, '账号')
    .replace(/账\s*号/g, '账号')
    .replace(/账\s*户/g, '账户')
    .replace(/纳税人\s*识别号/g, '纳税人识别号')
    .replace(/统一\s*社会\s*信用\s*代码/g, '统一社会信用代码')
    .replace(/收票\s*邮箱/g, '收票邮箱');

  const labelPattern = /(开户银行及账号|开户行及账号|开户银行账号|开户行账号|开户银行账户|开户行账户|开户行及账户|开户行及帐号|开户地址|地址、电话|地址及电话|地址电话|纳税人识别号|统一社会信用代码|统一代码|社会信用代码|学校信用代码|企业代码|发票抬头|公司名称|单位名称|开票名称|企业名称|学校名称|单位地址|公司地址|注册地址|开户银行|开户行|银行账号|银行账户|银行帐号|联行号|联系人|联系电话|手机号|电话|名称|抬头|税号|地址|账号|帐号|账户|行号|邮箱)\s*:/g;
  text = text.replace(labelPattern, '\n$1:');
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .join('\n')
    .trim();
}

function smartInvoiceLines(text) {
  return String(text || '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}

function smartInvoiceParseLabeledText(text, fields) {
  const rules = [
    ['bankAndAccount', /(开户银行及账号|开户行及账号|开户银行账号|开户行账号|开户银行账户|开户行账户|开户行及账户|开户行及帐号)\s*:/g],
    ['addressAndPhone', /(地址、电话|地址及电话|地址电话)\s*:/g],
    ['taxNo', /(纳税人识别号|统一社会信用代码|统一代码|社会信用代码|学校信用代码|企业代码|税号)\s*:/g],
    ['name', /(发票抬头|公司名称|单位名称|开票名称|企业名称|学校名称|名称|抬头)\s*:/g],
    ['bankNo', /(联行号|行号)\s*:/g],
    ['bank', /([\u4e00-\u9fa5A-Za-z]{0,8}开户银行|[\u4e00-\u9fa5A-Za-z]{0,8}开户行)\s*:/g],
    ['account', /([\u4e00-\u9fa5A-Za-z]{0,8}银行账号|[\u4e00-\u9fa5A-Za-z]{0,8}银行账户|[\u4e00-\u9fa5A-Za-z]{0,8}银行帐号|[\u4e00-\u9fa5A-Za-z]{0,8}账号|[\u4e00-\u9fa5A-Za-z]{0,8}帐号|[\u4e00-\u9fa5A-Za-z]{0,8}账户)\s*:/g],
    ['address', /(注册地址|公司地址|单位地址|地址)\s*:/g],
    ['contact', /(联系人)\s*:/g],
    ['phone', /(联系电话|手机号|电话)\s*:/g],
    ['email', /(收票邮箱|邮箱)\s*:/g]
  ];
  const matches = [];
  rules.forEach(([key, regex]) => {
    for (const match of text.matchAll(regex)) {
      matches.push({ key, index: match.index, end: match.index + match[0].length });
    }
  });
  matches.sort((a, b) => a.index - b.index || b.end - b.index - (a.end - a.index));
  const filtered = [];
  matches.forEach((match) => {
    const last = filtered[filtered.length - 1];
    if (last && last.index <= match.index && last.end > match.index) return;
    filtered.push(match);
  });
  filtered.forEach((match, index) => {
    const next = filtered[index + 1];
    const value = text.slice(match.end, next ? next.index : text.length).trim();
    smartInvoiceAssign(match.key, value, fields);
  });
}

function smartInvoiceAssign(key, value, fields) {
  const text = smartInvoiceCleanValue(value);
  if (!text || key === 'email') return;
  if (key === 'bankAndAccount') {
    smartInvoiceAssignBankAndAccount(text, fields);
    return;
  }
  if (key === 'addressAndPhone') {
    smartInvoiceAssignAddressAndPhone(text, fields);
    return;
  }
  if (key === 'taxNo') {
    const tax = smartInvoiceFindTaxNo(text);
    if (tax && !fields.taxNo) fields.taxNo = tax;
    const lines = smartInvoiceLines(text);
    const possibleName = lines.find((line) => smartInvoiceLooksLikeName(line));
    if (possibleName && !fields.name) fields.name = possibleName;
    const possibleAddress = lines.find((line) => smartInvoiceLooksLikeAddress(line));
    if (possibleAddress && !fields.address) fields.address = smartInvoiceCleanAddress(possibleAddress);
    return;
  }
  if (key === 'bank') {
    const valueNoAccount = smartInvoiceStripAccountAndBankNo(text);
    if (valueNoAccount && !fields.bank) fields.bank = valueNoAccount;
    const account = smartInvoiceFindAccount(text);
    if (account && !fields.account) fields.account = account;
    const bankNo = smartInvoiceFindBankNo(text);
    if (bankNo && !fields.bankNo) fields.bankNo = bankNo;
    return;
  }
  if (key === 'account') {
    const account = smartInvoiceFindAccount(text);
    if (account && !fields.account) fields.account = account;
    const bankNo = smartInvoiceFindBankNo(text);
    if (bankNo && !fields.bankNo) fields.bankNo = bankNo;
    return;
  }
  if (key === 'bankNo') {
    const bankNo = smartInvoiceFindBankNo(text, true);
    if (bankNo && !fields.bankNo) fields.bankNo = bankNo;
    return;
  }
  if (key === 'phone') {
    const phone = smartInvoiceFindPhone(text, fields);
    if (phone && !fields.phone) fields.phone = phone;
    return;
  }
  if (key === 'address') {
    const phone = smartInvoiceFindPhone(text, fields);
    if (phone && !fields.phone) fields.phone = phone;
    const address = smartInvoiceCleanAddress(text.replace(phone || '', ''));
    if (address && !fields.address) fields.address = address;
    return;
  }
  const cleaned = smartInvoiceCleanByKey(text, key);
  if (cleaned && !fields[key]) fields[key] = cleaned;
}

function smartInvoiceParseHeaderTable(lines, fields) {
  const headers = [];
  let valueStart = -1;
  for (let i = 0; i < lines.length; i += 1) {
    const key = smartInvoiceHeaderKey(lines[i]);
    if (key && valueStart < 0) {
      headers.push(key);
      continue;
    }
    valueStart = i;
    break;
  }
  if (!headers.length || valueStart < 0) return;
  const values = lines.slice(valueStart).filter((line) => !smartInvoiceHeaderKey(line));
  let cursor = 0;
  headers.forEach((key) => {
    if (key === 'email') {
      cursor += 1;
      return;
    }
    const value = values[cursor] || '';
    if (!value) return;
    smartInvoiceAssign(key, value, fields);
    cursor += 1;
  });
}

function smartInvoiceHeaderKey(line) {
  const text = String(line || '').replace(/\s+/g, '');
  if (/^(发票抬头|抬头|名称|公司名称|单位名称|企业名称|学校名称)$/.test(text)) return 'name';
  if (/^(税号|纳税人识别号|统一社会信用代码|统一代码|社会信用代码|企业代码|学校信用代码)$/.test(text)) return 'taxNo';
  if (/^(单位地址|公司地址|注册地址|地址)$/.test(text)) return 'address';
  if (/^(电话|联系电话|手机号)$/.test(text)) return 'phone';
  if (/^(开户银行|开户行)$/.test(text)) return 'bank';
  if (/^(银行账户|银行账号|银行帐号|账号|帐号|账户)$/.test(text)) return 'account';
  if (/^(行号|联行号)$/.test(text)) return 'bankNo';
  if (/^(收票邮箱|邮箱|电子邮箱)$/.test(text)) return 'email';
  return '';
}

function smartInvoiceGuessFromLines(lines, fields) {
  if (!fields.name) {
    const nameLine = lines.find((line) => smartInvoiceLooksLikeName(line));
    if (nameLine) fields.name = smartInvoiceCleanName(nameLine);
  }

  if (!fields.taxNo) {
    const taxLine = lines.find((line) => /税号|识别号|信用代码|统一代码|企业代码/.test(line));
    const tax = smartInvoiceFindTaxNo(taxLine || lines.join('\n'));
    if (tax) fields.taxNo = tax;
  }

  if (!fields.bankNo) {
    const bankNoLine = lines.find((line) => /行号|联行号/.test(line));
    const bankNo = smartInvoiceFindBankNo(bankNoLine || lines.join('\n'), true);
    if (bankNo) fields.bankNo = bankNo;
  }

  if (!fields.bank || !fields.account) {
    for (const line of lines) {
      if (!smartInvoiceLooksLikeBankLine(line)) continue;
      smartInvoiceAssignBankAndAccount(line, fields);
      if (fields.bank && fields.account) break;
    }
  }

  if (!fields.account) {
    const accountLine = lines.find((line) => /账号|帐号|账户/.test(line));
    const account = smartInvoiceFindAccount(accountLine || lines.join('\n'), fields);
    if (account) fields.account = account;
  }

  if (!fields.phone) {
    const phoneLine = lines.find((line) => /电话|手机/.test(line));
    const phone = smartInvoiceFindPhone(phoneLine || lines.join('\n'), fields);
    if (phone) fields.phone = phone;
  }

  if (!fields.address) {
    const addressLine = lines.find((line) => smartInvoiceLooksLikeAddress(line));
    if (addressLine) fields.address = smartInvoiceCleanAddress(addressLine);
  }

  if (!fields.name && fields.taxNo) {
    const taxIndex = lines.findIndex((line) => line.includes(fields.taxNo));
    if (taxIndex > 0) {
      const before = lines.slice(0, taxIndex).reverse().find((line) => smartInvoiceLooksLikeName(line));
      if (before) fields.name = smartInvoiceCleanName(before);
    }
  }
}

function smartInvoiceAssignBankAndAccount(value, fields) {
  const text = smartInvoiceCleanValue(value);
  const bankNo = smartInvoiceFindBankNo(text);
  if (bankNo && !fields.bankNo) fields.bankNo = bankNo;
  const account = smartInvoiceFindAccount(text, fields);
  if (account && !fields.account) fields.account = account;
  const bank = smartInvoiceStripAccountAndBankNo(text)
    .replace(/^(农行|中国银行|建行|工行|招行|华夏银行|开户银行|开户行|银行账户|银行账号|账号|账户)[:：]?/, '')
    .trim();
  if (bank && smartInvoiceLooksLikeBankLine(bank) && !fields.bank) fields.bank = bank;
}

function smartInvoiceAssignAddressAndPhone(value, fields) {
  const text = smartInvoiceCleanValue(value);
  const phone = smartInvoiceFindPhone(text, fields);
  if (phone && !fields.phone) fields.phone = phone;
  const address = smartInvoiceCleanAddress(text.replace(phone || '', ''));
  if (address && !fields.address) fields.address = address;
}

function smartInvoiceFindTaxNo(text) {
  const source = String(text || '').toUpperCase();
  const rawMatches = source.match(/[0-9A-Z](?:[0-9A-Z\s]{13,24})[0-9A-Z]/g) || [];
  const matches = rawMatches
    .map((item) => item.replace(/\s+/g, ''))
    .filter((item) => item.length >= 15 && item.length <= 20);
  return matches.find((item) => /[A-Z]/.test(item) || item.length === 15 || item.length === 18 || item.length === 20) || '';
}

function smartInvoiceFindBankNo(text, loose = false) {
  const compact = String(text || '').replace(/\s+/g, '');
  const labeled = compact.match(/(?:行号|联行号)[:：]?([0-9]{12})/);
  if (labeled) return labeled[1];
  if (!loose) return '';
  const match = compact.match(/^[0-9]{12}$/);
  return match ? match[0] : '';
}

function smartInvoiceFindAccount(text, fields = {}) {
  const compact = String(text || '').replace(/[，,。；;()（）]/g, ' ').replace(/[－—–]/g, '-').replace(/\s+/g, ' ');
  const candidates = [];
  for (const match of compact.matchAll(/[0-9][0-9\s-]{8,32}[0-9]/g)) {
    const value = match[0].replace(/\D/g, '');
    if (value.length < 10 || value.length > 30) continue;
    if (smartInvoiceIsPhone(value)) continue;
    if (fields.taxNo && fields.taxNo.includes(value)) continue;
    if (fields.bankNo && fields.bankNo === value) continue;
    candidates.push(value);
  }
  const labeled = candidates.find((value) => /账号|帐号|账户|银行/.test(compact.slice(Math.max(0, compact.indexOf(value) - 20), compact.indexOf(value) + value.length + 5)));
  return labeled || candidates[0] || '';
}

function smartInvoiceFindPhone(text, fields = {}) {
  const source = String(text || '');
  const candidates = [];
  for (const match of source.matchAll(/(?:1[3-9]\d{9}|0\d{2,3}[- ]?\d{7,8})/g)) {
    const value = match[0].replace(/\s+/g, '');
    const numeric = value.replace(/\D/g, '');
    if (fields.account && fields.account.includes(numeric)) continue;
    if (fields.taxNo && fields.taxNo.includes(numeric)) continue;
    if (fields.bankNo && fields.bankNo.includes(numeric)) continue;
    if (smartInvoiceIsEmbeddedInLongNumber(source, match.index, match[0].length)) continue;
    candidates.push(value);
  }
  const labeled = candidates.find((value) => {
    const index = source.indexOf(value);
    return /电话|手机|联系方式/.test(source.slice(Math.max(0, index - 12), index + value.length));
  });
  return labeled || candidates[0] || '';
}

function smartInvoiceIsPhone(value) {
  return /^(1[3-9]\d{9}|0\d{9,11})$/.test(String(value || '').replace(/\D/g, ''));
}

function smartInvoiceIsEmbeddedInLongNumber(source, index, length) {
  const before = source[index - 1] || '';
  const after = source[index + length] || '';
  return /\d/.test(before) || /\d/.test(after);
}

function smartInvoiceLooksLikeName(line) {
  const text = smartInvoiceCleanName(line);
  if (!text || /银行|账号|账户|税号|识别号|信用代码|地址|电话|邮箱|开票信息|专票|普票/.test(text)) return false;
  return /(?:公司|有限公司|有限责任公司|股份有限公司|集团|学校|幼儿园|工厂|厂|店|合作社|中心|医院|研究院|事务所)$/.test(text);
}

function smartInvoiceCleanName(line) {
  return String(line || '')
    .replace(/^(开票信息如下|开票信息|发票抬头|公司名称|单位名称|开票名称|企业名称|学校名称|名称|抬头)[:：]?/, '')
    .replace(/[-—]+/g, '')
    .replace(/\s+/g, '')
    .trim();
}

function smartInvoiceLooksLikeAddress(line) {
  const text = String(line || '');
  if (/银行|账号|账户|税号|识别号|信用代码|邮箱|开户|发票抬头|公司名称|单位名称|企业名称|学校名称|名称/.test(text)) return false;
  if (smartInvoiceLooksLikeName(text)) return false;
  return /(省|市|自治区|自治州|县|区|镇|乡|街道|路|街|巷|号|园区|工业区|产业园|大厦|楼|室|门面房)/.test(text);
}

function smartInvoiceCleanAddress(line) {
  return String(line || '')
    .replace(/^(注册地址|公司地址|单位地址|地址)[:：]?/, '')
    .replace(/电话[:：]?\s*(?:1[3-9]\d{9}|0\d{2,3}[- ]?\d{7,8})/g, '')
    .replace(/(?:1[3-9]\d{9}|0\d{2,3}[- ]?\d{7,8})/g, '')
    .replace(/[，,。；;]+$/g, '')
    .replace(/\s+/g, '')
    .trim();
}

function smartInvoiceLooksLikeBankLine(line) {
  return /(银行|信用社|农商|支行|分行|营业部|开户行|开户银行)/.test(String(line || ''));
}

function smartInvoiceStripAccountAndBankNo(text) {
  return String(text || '')
    .replace(/\(?\s*(行号|联行号)\s*[:：]?\s*[0-9]{12}\s*\)?/g, '')
    .replace(/[0-9][0-9\s-]{8,32}[0-9]/g, '')
    .replace(/(账号|帐号|账户|银行账户|银行账号)[:：]?/g, '')
    .replace(/[()（）]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function smartInvoiceCleanValue(value) {
  return String(value || '')
    .replace(/开票信息如下[:：]?/g, '')
    .replace(/开票信息[:：]?/g, '')
    .replace(/---/g, ' ')
    .replace(/\b(专票|普票)\b/g, '')
    .replace(/[，,。]+$/g, '')
    .trim();
}

function smartInvoiceCleanByKey(value, key) {
  if (key === 'name') return smartInvoiceCleanName(value);
  if (key === 'address') return smartInvoiceCleanAddress(value);
  if (key === 'taxNo') return smartInvoiceFindTaxNo(value);
  if (key === 'account') return smartInvoiceFindAccount(value);
  if (key === 'bankNo') return smartInvoiceFindBankNo(value);
  if (key === 'phone') return smartInvoiceFindPhone(value);
  return String(value || '').replace(/\s+/g, ' ').trim();
}

function smartInvoiceFinalize(fields) {
  fields.name = smartInvoiceCleanName(fields.name);
  fields.taxNo = smartInvoiceFindTaxNo(fields.taxNo) || String(fields.taxNo || '').replace(/[^0-9A-Za-z]/g, '').toUpperCase();
  fields.account = smartInvoiceFindAccount(fields.account, fields) || String(fields.account || '').replace(/\D/g, '');
  fields.bankNo = smartInvoiceFindBankNo(fields.bankNo, true) || '';
  fields.phone = smartInvoiceFindPhone(fields.phone, fields) || String(fields.phone || '').trim();
  fields.address = smartInvoiceCleanAddress(fields.address);
  fields.bank = String(fields.bank || '').replace(/\s+/g, ' ').trim();
  fields.contact = String(fields.contact || '').replace(/\s+/g, ' ').trim();
}
// SMART_INVOICE_PARSER_END

function normalizeInvoiceInfoForView(input) {
  return invoiceFieldsToText(parseInvoiceInfo(input));
}

function parseInvoiceInfoFields(input) {
  const parsed = parseInvoiceInfo(input);
  return {
    ...parsed,
    bankNo: parsed.bankLineNo
  };
}

function parseInvoiceInfo(rawText) {
  const fields = {
    name: '',
    bank: '',
    account: '',
    bankLineNo: '',
    taxNo: '',
    address: '',
    contact: '',
    phone: ''
  };
  const raw = String(rawText || '').trim();
  if (!raw) return fields;

  let working = smartInvoiceNormalizeText(raw);

  fields.taxNo = smartInvoiceExtractTaxNo(working);
  working = smartInvoiceRemoveValue(working, fields.taxNo);

  fields.phone = smartInvoiceExtractPhone(working);
  working = smartInvoiceRemoveValue(working, fields.phone);

  fields.bankLineNo = smartInvoiceExtractBankLineNo(working);
  working = smartInvoiceRemoveValue(working, fields.bankLineNo);

  fields.account = smartInvoiceExtractAccount(working, fields);
  working = smartInvoiceRemoveValue(working, fields.account);

  fields.bank = smartInvoiceExtractBank(working);
  working = smartInvoiceRemoveValue(working, fields.bank);

  fields.name = smartInvoiceExtractName(working);
  working = smartInvoiceRemoveValue(working, fields.name);

  fields.address = smartInvoiceExtractAddress(working);

  return smartInvoiceFinalizeResult(fields);
}

function invoiceFieldsToText(fields) {
  const bankLineNo = fields.bankLineNo || fields.bankNo || '';
  return [
    `名称：${fields.name || ''}`,
    `开户行：${fields.bank || ''}`,
    `账号：${fields.account || ''}`,
    `行号：${bankLineNo}`,
    `税号：${fields.taxNo || ''}`,
    `地址：${fields.address || ''}`,
    `联系人：${fields.contact || ''}`,
    `电话：${fields.phone || ''}`
  ].join('\n');
}

function smartInvoiceNormalizeText(raw) {
  return String(raw || '')
    .replace(/\r/g, '\n')
    .replace(/[\u00a0\u3000]/g, ' ')
    .replace(/[，,；;]+/g, ' ')
    .replace(/[：:]/g, ' ')
    .replace(/[（）()]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function smartInvoiceExtractTaxNo(text) {
  const matches = String(text || '').toUpperCase().match(/[0-9A-Z]{18}/g) || [];
  return matches.find((value) => /[A-Z]/.test(value) || /^\d{18}$/.test(value)) || '';
}

function smartInvoiceExtractPhone(text) {
  const source = String(text || '');
  const matches = [];
  for (const match of source.matchAll(/(?:1[3-9]\d{9}|0\d{2,3}[- ]?\d{7,8}|0\d{2,3}\d{7,8})/g)) {
    const value = match[0].trim();
    if (smartInvoicePhoneEmbeddedInDigits(source, match.index || 0, value.length)) continue;
    matches.push(value);
  }
  return matches[0] || '';
}

function smartInvoicePhoneEmbeddedInDigits(source, start, length) {
  const before = source[start - 1] || '';
  const after = source[start + length] || '';
  return /\d/.test(before) || /\d/.test(after);
}

function smartInvoiceExtractBankLineNo(text) {
  const labeled = String(text || '').match(/(?:行号|联行号)\s*([0-9]{12})/);
  return labeled ? labeled[1] : '';
}

function smartInvoiceExtractAccount(text, fields) {
  const source = String(text || '');
  const candidates = [];
  for (const match of source.matchAll(/\d{12,30}/g)) {
    const value = match[0];
    if (value === fields.taxNo) continue;
    if (value === fields.bankLineNo) continue;
    if (fields.phone && value.includes(fields.phone.replace(/\D/g, ''))) continue;
    candidates.push(value);
  }
  return candidates.sort((a, b) => b.length - a.length)[0] || '';
}

function smartInvoiceExtractBank(text) {
  const source = String(text || '').replace(/\s+/g, '');
  const keywords = [
    '\u94f6\u884c',
    '\u4fe1\u7528\u793e',
    '\u519c\u5546\u884c',
    '\u5f00\u6237\u884c'
  ];
  const suffixes = [
    '\u8425\u4e1a\u90e8',
    '\u8425\u4e1a\u5385',
    '\u652f\u884c',
    '\u5206\u884c'
  ];
  const positions = keywords
    .map((keyword) => source.indexOf(keyword))
    .filter((index) => index >= 0)
    .sort((a, b) => a - b);
  if (!positions.length) return '';

  const keywordIndex = positions[0];
  const beforeBank = source.slice(0, keywordIndex);
  const boundaryIndex = Math.max(
    beforeBank.lastIndexOf('\u53f7'),
    beforeBank.lastIndexOf('\u697c'),
    beforeBank.lastIndexOf('\u5ba4'),
    beforeBank.lastIndexOf('\u9662'),
    beforeBank.lastIndexOf('\u533a'),
    beforeBank.lastIndexOf('\u53bf'),
    beforeBank.lastIndexOf('\u8857'),
    beforeBank.lastIndexOf('\u8def')
  );
  const start = boundaryIndex >= 0 ? boundaryIndex + 1 : Math.max(0, keywordIndex - 12);
  let end = Math.min(source.length, keywordIndex + 18);
  suffixes.forEach((suffix) => {
    const suffixIndex = source.indexOf(suffix, keywordIndex);
    if (suffixIndex >= 0) end = Math.max(end, suffixIndex + suffix.length);
  });
  return source.slice(start, end).replace(/^(?:\u540d\u79f0|\u5f00\u6237\u884c)/, '');
}

function smartInvoiceExtractName(text) {
  const source = String(text || '').replace(/\s+/g, '');
  const suffixes = [
    '\u6709\u9650\u8d23\u4efb\u516c\u53f8',
    '\u80a1\u4efd\u6709\u9650\u516c\u53f8',
    '\u6709\u9650\u516c\u53f8',
    '\u4e2a\u4f53\u5de5\u5546\u6237'
  ];
  for (const suffix of suffixes) {
    const index = source.indexOf(suffix);
    if (index < 0) continue;
    const end = index + suffix.length;
    const start = Math.max(0, end - 40);
    return source.slice(start, end).replace(/^(名称|需方|购方)/, '');
  }
  return '';
}

function smartInvoiceExtractAddress(text) {
  const compact = String(text || '').replace(/\s+/g, '');
  const startMatch = compact.match(/(\u4e2d\u56fd|\u5317\u4eac\u5e02|\u5929\u6d25\u5e02|\u4e0a\u6d77\u5e02|\u91cd\u5e86\u5e02|\u9999\u6e2f|\u6fb3\u95e8|\u5185\u8499\u53e4|\u5e7f\u897f|\u897f\u85cf|\u5b81\u590f|\u65b0\u7586|[\u4e00-\u9fa5]{2,8}\u7701|[\u4e00-\u9fa5]{2,8}\u5e02)/);
  if (!startMatch) return '';
  const start = startMatch.index || 0;
  const sliced = compact.slice(start);
  const endKeywords = [
    '\u94f6\u884c',
    '\u4fe1\u7528\u793e',
    '\u519c\u5546\u884c',
    '\u5f00\u6237\u884c'
  ];
  let end = sliced.length;
  endKeywords.forEach((keyword) => {
    const index = sliced.indexOf(keyword);
    if (index > 0) end = Math.min(end, index);
  });
  return smartInvoiceCleanAddressValue(sliced.slice(0, end));
}

function smartInvoiceCleanAddressValue(text) {
  return String(text || '')
    .replace(/(\u8054\u7cfb\u4eba|\u7535\u8bdd|\u7a0e\u53f7|\u8d26\u53f7|\u5f00\u6237\u884c|\u884c\u53f7).*$/g, '')
    .replace(/\s+/g, '')
    .trim();
}

function smartInvoiceRemoveValue(text, value) {
  if (!value) return String(text || '');
  const escaped = value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return String(text || '')
    .replace(new RegExp(escaped, 'g'), ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function smartInvoiceFinalizeResult(fields) {
  return {
    name: String(fields.name || '').trim(),
    bank: String(fields.bank || '').trim(),
    account: String(fields.account || '').replace(/\D/g, ''),
    bankLineNo: String(fields.bankLineNo || '').replace(/\D/g, ''),
    taxNo: String(fields.taxNo || '').toUpperCase().replace(/[^0-9A-Z]/g, ''),
    address: smartInvoiceCleanAddressValue(fields.address),
    contact: String(fields.contact || '').trim(),
    phone: String(fields.phone || '').trim()
  };
}

function normalizeInvoiceInfoForView(input) {
  return invoiceFieldsToText(parseInvoiceInfo(input));
}

function parseInvoiceInfoFields(input) {
  const parsed = parseInvoiceInfo(input);
  return {
    ...parsed,
    bankNo: parsed.bankLineNo
  };
}

function parseInvoiceInfo(rawText) {
  const fields = invoiceEmptyFields();
  const raw = String(rawText || '').trim();
  if (!raw) return fields;

  const text = invoiceNormalize(raw);
  const contentText = invoiceContentText(text);
  invoiceParseTaggedText(text, fields);
  invoiceParseHeaderValueLines(text, fields);
  invoiceParseLooseLabelLines(text, fields);

  let working = contentText;
  invoiceKnownValues(fields).forEach((value) => {
    working = invoiceRemoveValue(working, value);
  });

  if (!fields.taxNo) {
    fields.taxNo = invoiceFindTaxNo(working) || invoiceFindTaxNo(contentText);
    working = invoiceRemoveValue(working, fields.taxNo);
  }

  if (!fields.phone) {
    fields.phone = invoiceFindPhone(working) || invoiceFindPhone(contentText);
    working = invoiceRemoveValue(working, fields.phone);
  }

  if (!fields.account) {
    fields.account = invoiceFindAccount(working, fields) || invoiceFindAccount(contentText, fields);
    working = invoiceRemoveValue(working, fields.account);
  }

  if (!fields.bank) {
    fields.bank = invoiceFindBank(working) || invoiceFindBank(contentText);
    working = invoiceRemoveValue(working, fields.bank);
  }

  if (!fields.name) {
    fields.name = invoiceFindName(working) || invoiceFindName(invoiceRemoveValue(contentText, fields.bank));
    working = invoiceRemoveValue(working, fields.name);
  }

  if (!fields.address) {
    fields.address = invoiceFindAddress(working, fields) || invoiceFindAddress(contentText, fields);
  }

  return invoiceFinalize(fields);
}

function invoiceFieldsToText(fields) {
  const bankLineNo = fields.bankLineNo || fields.bankNo || '';
  return [
    `名称：${fields.name || ''}`,
    `开户行：${fields.bank || ''}`,
    `账号：${fields.account || ''}`,
    `行号：${bankLineNo}`,
    `税号：${fields.taxNo || ''}`,
    `地址：${fields.address || ''}`,
    `联系人：${fields.contact || ''}`,
    `电话：${fields.phone || ''}`
  ].join('\n');
}

function invoiceEmptyFields() {
  return {
    name: '',
    bank: '',
    account: '',
    bankLineNo: '',
    taxNo: '',
    address: '',
    contact: '',
    phone: ''
  };
}

function invoiceNormalize(value) {
  const labelPattern = invoiceLabelDefs()
    .map((item) => invoiceEscapeRegExp(item.label))
    .join('|');
  return String(value || '')
    .replace(/\r/g, '\n')
    .replace(/[\u00a0\u3000]/g, ' ')
    .replace(/[：]/g, ':')
    .replace(/[；;]/g, ':')
    .replace(/[－—–]/g, '-')
    .replace(/[。]/g, '\n')
    .replace(new RegExp(`([^\n])(${labelPattern})\\s*:`, 'g'), '$1\n$2:')
    .replace(/\n{2,}/g, '\n')
    .trim();
}

function invoiceContentText(text) {
  return String(text || '')
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && !invoiceIsTitleLine(line))
    .join('\n');
}

function invoiceParseTaggedText(text, fields) {
  const labels = invoiceLabelDefs();
  const labelPattern = labels
    .map((item) => invoiceEscapeRegExp(item.label))
    .join('|');
  const serialPrefix = '(?:\\d+[.、]|[一二三四五六七八九十]+、|（[一二三四五六七八九十]+）|[①②③④⑤⑥⑦⑧⑨⑩])?';
  const regex = new RegExp(`(?:^|[\n\\s])${serialPrefix}\\s*(${labelPattern})\\s*[:：]`, 'g');
  const matches = [];
  for (const match of text.matchAll(regex)) {
    matches.push({
      key: labels.find((item) => item.label === match[1])?.key || '',
      index: match.index + match[0].indexOf(match[1]),
      valueStart: match.index + match[0].length
    });
  }

  matches.forEach((match, index) => {
    const next = matches[index + 1];
    const value = text.slice(match.valueStart, next ? next.index : text.length).trim();
    invoiceAssignField(match.key, value, fields);
  });
}

function invoiceParseLooseLabelLines(text, fields) {
  const lines = String(text || '').split('\n').map((line) => line.trim()).filter(Boolean);
  lines.forEach((line, index) => {
    const normalized = line.replace(/^(?:\d+[.、]|[一二三四五六七八九十]+、|（[一二三四五六七八九十]+）|[①②③④⑤⑥⑦⑧⑨⑩])\s*/, '');
    for (const { label, key } of invoiceLabelDefs()) {
      if (!normalized.startsWith(label)) continue;
      const rest = normalized.slice(label.length).replace(/^[:：\s]*/, '');
      const value = rest || lines.slice(index + 1).find((item) => item && !invoiceHeaderKey(item)) || '';
      invoiceAssignField(key, value, fields);
      break;
    }
  });
}

function invoiceParseHeaderValueLines(text, fields) {
  const lines = text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
  for (let index = 0; index < lines.length; index += 1) {
    const headerKeys = [];
    let cursor = index;
    while (cursor < lines.length) {
      const key = invoiceHeaderKey(lines[cursor]);
      if (!key) break;
      headerKeys.push(key);
      cursor += 1;
    }
    if (headerKeys.length < 2) continue;

    const values = [];
    while (cursor < lines.length) {
      if (!invoiceHeaderKey(lines[cursor])) values.push(lines[cursor]);
      cursor += 1;
    }
    headerKeys.forEach((key, valueIndex) => {
      invoiceAssignField(key, invoiceValueForHeader(key, values, valueIndex) || '', fields);
    });
    index = cursor - 1;
  }
}

function invoiceValueForHeader(key, values, valueIndex) {
  if (key === 'taxNo') return values.find((value) => invoiceFindTaxNo(value)) || values[valueIndex] || '';
  if (key === 'address') return values.find((value) => invoiceAddressKeywordPattern().test(value) && !invoiceBankKeywordPattern().test(value)) || values[valueIndex] || '';
  if (key === 'phone') return values.find((value) => invoiceFindPhone(value)) || values[valueIndex] || '';
  if (key === 'bank') return values.find((value) => invoiceBankKeywordPattern().test(value)) || values[valueIndex] || '';
  if (key === 'account') return values.find((value) => invoiceFindAccount(value)) || values[valueIndex] || '';
  return values[valueIndex] || '';
}

function invoiceAssignField(key, rawValue, fields) {
  const value = invoiceCleanLabelWords(rawValue);
  if (!value) return;

  if (key === 'name' && !fields.name) {
    fields.name = invoiceCleanName(value);
    return;
  }
  if (key === 'taxNo' && !fields.taxNo) {
    fields.taxNo = invoiceFindTaxNo(value);
    const remainder = invoiceCleanLabelWords(invoiceRemoveValue(value, fields.taxNo));
    if (remainder && !fields.name) fields.name = invoiceFindName(remainder);
    if (remainder && !fields.address) fields.address = invoiceFindAddress(remainder, fields);
    return;
  }
  if (key === 'bank' && !fields.bank) {
    const account = invoiceFindAccount(value, fields);
    if (account && !fields.account) fields.account = account;
    fields.bank = invoiceCleanBank(invoiceRemoveValue(value, account));
    return;
  }
  if (key === 'bankAccount') {
    const account = invoiceFindAccount(value, fields);
    if (account && !fields.account) fields.account = account;
    if (!fields.bank) fields.bank = invoiceCleanBank(invoiceRemoveValue(value, account));
    return;
  }
  if (key === 'account' && !fields.account) {
    fields.account = invoiceFindAccount(value, fields);
    if (!fields.bank) fields.bank = invoiceFindBank(invoiceRemoveValue(value, fields.account));
    return;
  }
  if (key === 'bankLineNo' && !fields.bankLineNo) {
    const lineNo = value.match(/\d{12}/);
    fields.bankLineNo = lineNo ? lineNo[0] : '';
    return;
  }
  if (key === 'address' && !fields.address) {
    const phone = invoiceFindPhone(value);
    if (phone && !fields.phone) fields.phone = phone;
    fields.address = invoiceFindAddress(invoiceRemoveValue(value, phone), fields);
    return;
  }
  if (key === 'phone' && !fields.phone) {
    fields.phone = invoiceFindPhone(value);
    return;
  }
  if (key === 'contact' && !fields.contact) {
    const phone = invoiceFindPhone(value);
    if (phone && !fields.phone) fields.phone = phone;
    fields.contact = invoiceCleanContact(invoiceRemoveValue(value, phone));
  }
}

function invoiceFindTaxNo(text) {
  const candidates = [];
  for (const match of String(text || '').toUpperCase().matchAll(/(?:[0-9A-Z]\s*){18}/g)) {
    const value = match[0].replace(/\s+/g, '');
    if (value.length !== 18) continue;
    candidates.push(value);
  }
  return candidates.find((value) => /[A-Z]/.test(value)) || candidates[0] || '';
}

function invoiceFindPhone(text) {
  const source = String(text || '');
  for (const match of source.matchAll(/(?:1[3-9]\d{9}|0\d{2,3}[- ]?\d{7,8}|0\d{9,11})/g)) {
    const value = match[0].trim();
    const before = source[match.index - 1] || '';
    const after = source[match.index + value.length] || '';
    if (/\d/.test(before) || /\d/.test(after)) continue;
    return value;
  }
  return '';
}

function invoiceFindAccount(text, fields = {}) {
  const source = String(text || '');
  const candidates = [];
  for (const match of source.matchAll(/(?:\d[\s-]*){12,30}/g)) {
    const value = match[0].replace(/[\s-]+/g, '');
    if (value.length < 12) continue;
    if (fields.taxNo && value === fields.taxNo) continue;
    if (fields.taxNo && fields.taxNo.includes(value)) continue;
    if (fields.phone && value === fields.phone.replace(/\D/g, '')) continue;
    candidates.push(value);
  }
  return candidates.sort((a, b) => b.length - a.length)[0] || '';
}

function invoiceFindBank(text) {
  const lines = invoiceCandidateLines(text);
  const bankLine = lines.find((line) => invoiceBankKeywordPattern().test(line));
  if (bankLine) return invoiceCleanBank(bankLine);

  const compact = String(text || '').replace(/\s+/g, '');
  const match = compact.match(/[\u4e00-\u9fa5A-Za-z0-9]{0,30}(?:银行|信用社|农商行)[\u4e00-\u9fa5A-Za-z0-9]*(?:分行|支行|营业部|营业厅|分理处)?/);
  return match ? invoiceCleanBank(match[0]) : '';
}

function invoiceFindName(text) {
  const line = invoiceCandidateLines(text).find((item) => invoiceLooksLikeInstitutionName(item));
  if (line) return invoiceCleanName(line);

  const cleaned = invoiceCleanLabelWords(text).replace(/\s+/g, '');
  const suffixes = ['有限责任公司', '股份有限公司', '实验学校', '有限公司', '个体工商户', '幼儿园', '卫生院', '研究院', '合作社', '学校', '中学', '小学', '医院', '中心', '协会'];
  for (const suffix of suffixes) {
    const index = cleaned.indexOf(suffix);
    if (index < 0) continue;
    const end = index + suffix.length;
    const start = Math.max(0, end - 40);
    return invoiceCleanName(cleaned.slice(start, end));
  }
  return '';
}

function invoiceFindAddress(text, fields = {}) {
  let source = invoiceCleanLabelWords(text);
  invoiceKnownValues(fields).forEach((value) => {
    source = invoiceRemoveValue(source, value);
  });
  source = source
    .replace(/[A-Z0-9]{18}/gi, ' ')
    .replace(/(?:\d\s*){12,30}/g, ' ')
    .replace(/(?:1[3-9]\d{9}|0\d{2,3}[- ]?\d{7,8}|0\d{9,11})/g, ' ');

  const lines = invoiceCandidateLines(source).filter((line) => !invoiceBankKeywordPattern().test(line));
  const addressLine = lines.find((line) => invoiceAddressKeywordPattern().test(line));
  if (addressLine) return invoiceCleanAddress(addressLine);

  const compact = source.replace(/\s+/g, '');
  const match = compact.match(/[\u4e00-\u9fa5A-Za-z0-9（）()、,\-]{2,120}(?:省|市|区|县|路|街|号|楼|室|门面房|院|巷)[\u4e00-\u9fa5A-Za-z0-9（）()、,\-]*/);
  return match ? invoiceCleanAddress(match[0]) : '';
}

function invoiceFinalize(fields) {
  return {
    name: invoiceCleanName(fields.name),
    bank: invoiceCleanBank(fields.bank).replace(/[:：]+$/g, ''),
    account: String(fields.account || '').replace(/[^\d]/g, ''),
    bankLineNo: String(fields.bankLineNo || '').replace(/\D/g, ''),
    taxNo: String(fields.taxNo || '').toUpperCase().replace(/[^0-9A-Z]/g, ''),
    address: invoiceCleanAddress(fields.address),
    contact: invoiceCleanContact(fields.contact),
    phone: String(fields.phone || '').trim()
  };
}

function invoiceCleanName(value) {
  return invoiceCleanLabelWords(value)
    .replace(/^(?:\d+[.、]|[一二三四五六七八九十]+、|（[一二三四五六七八九十]+）|[①②③④⑤⑥⑦⑧⑨⑩])\s*/g, '')
    .replace(/^(开票信息|开票资料|开票\(汇款\)资料|汇款资料|公司名称|名称|单位名称|客户名称)[:：]?/g, '')
    .replace(/\n\s*(?:\d+[.、]|[一二三四五六七八九十]+、|（[一二三四五六七八九十]+）|[①②③④⑤⑥⑦⑧⑨⑩]).*$/s, '')
    .replace(/(纳税人识别号|税号|统一社会信用代码|统一代码|社会信用代码|开户银行|开户行|银行账户|账号|单位地址|地址、电话|地址|电话).*$/g, '')
    .trim();
}

function invoiceCleanBank(value) {
  return invoiceCleanLabelWords(String(value || '').replace(/银行账户/g, '银行'))
    .replace(/(?:\d[\s-]*){12,30}/g, '')
    .replace(/(账户号码|账号号码|开户账号|账户|账号|号码)/g, '')
    .replace(/(单位地址|地址、电话|地址|电话|收票邮箱|编辑|专票).*$/g, '')
    .trim();
}

function invoiceCleanAddress(value) {
  return invoiceCleanLabelWords(value)
    .replace(/(?:1[3-9]\d{9}|0\d{2,3}[- ]?\d{7,8}|0\d{9,11})/g, '')
    .replace(/[0-9A-Z]{18}/gi, '')
    .replace(/(?:开户银行|开户行|开户行及账号|开户银行账号|银行账户|账号).*/g, '')
    .replace(/\s+/g, '')
    .trim();
}

function invoiceCleanLabelWords(value) {
  return String(value || '')
    .replace(/开票\(汇款\)资料[:：]?/g, '')
    .replace(/开票信息[:：]?/g, '')
    .replace(/开票资料[:：]?/g, '')
    .replace(/汇款资料[:：]?/g, '')
    .replace(/开票信息如下[:：]?/g, '')
    .replace(/公司名称[:：]?/g, '')
    .replace(/单位名称[:：]?/g, '')
    .replace(/客户名称[:：]?/g, '')
    .replace(/纳税人识别号[:：]?/g, '')
    .replace(/统一社会信用代码[:：]?/g, '')
    .replace(/学校信用代码[:：]?/g, '')
    .replace(/统一代码[:：]?/g, '')
    .replace(/社会信用代码[:：]?/g, '')
    .replace(/开户银行账号[:：]?/g, '')
    .replace(/开户行及账号[:：]?/g, '')
    .replace(/开户行账号[:：]?/g, '')
    .replace(/开户账号[:：]?/g, '')
    .replace(/开户银行[:：]?/g, '')
    .replace(/开户行[:：]?/g, '')
    .replace(/开户行号[:：]?/g, '')
    .replace(/银行行号[:：]?/g, '')
    .replace(/联行号[:：]?/g, '')
    .replace(/大额行号[:：]?/g, '')
    .replace(/银行账户[:：]?/g, '')
    .replace(/单位地址[:：]?/g, '')
    .replace(/注册地址[:：]?/g, '')
    .replace(/发票寄送地址[:：]?/g, '')
    .replace(/邮寄地址[:：]?/g, '')
    .replace(/收件地址[:：]?/g, '')
    .replace(/地址、电话[:：]?/g, '')
    .replace(/地址电话[:：]?/g, '')
    .replace(/名称[:：]?/g, '')
    .replace(/税号[:：]?/g, '')
    .replace(/账号[:：]?/g, '')
    .replace(/账户号码[:：]?/g, '')
    .replace(/账号号码[:：]?/g, '')
    .replace(/账户[:：]?/g, '')
    .replace(/行号[:：]?/g, '')
    .replace(/联系人[:：]?/g, '')
    .replace(/收件人[:：]?/g, '')
    .replace(/收票人[:：]?/g, '')
    .replace(/开票联系人[:：]?/g, '')
    .replace(/联系电话[:：]?/g, '')
    .replace(/联系方式[:：]?/g, '')
    .replace(/手机号[:：]?/g, '')
    .replace(/手机[:：]?/g, '')
    .replace(/地址[:：]?/g, '')
    .replace(/电话[:：]?/g, '')
    .replace(/收票邮箱[:：]?/g, '')
    .replace(/电子发票邮箱[:：]?/g, '')
    .replace(/邮箱[:：]?/g, '')
    .replace(/邮编[:：]?/g, '')
    .replace(/编辑/g, '')
    .replace(/专票/g, '')
    .replace(/---/g, ' ')
    .trim();
}

function invoiceRemoveValue(text, value) {
  if (!value) return String(text || '');
  let result = String(text || '');
  const compact = String(value).replace(/\s+/g, '');
  const escaped = invoiceEscapeRegExp(String(value));
  result = result.replace(new RegExp(escaped, 'g'), ' ');
  if (/^[0-9A-Z]{12,30}$/i.test(compact)) {
    result = result.replace(new RegExp(compact.split('').join('[\\\\s-]*'), 'g'), ' ');
  }
  return result.replace(/[ \t]+/g, ' ').trim();
}

function invoiceKnownValues(fields) {
  return [
    fields.name,
    fields.bank,
    fields.account,
    fields.bankLineNo,
    fields.taxNo,
    fields.address,
    fields.phone
  ].filter(Boolean);
}

function invoiceCandidateLines(text) {
  return String(text || '')
    .split(/\n| {2,}/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function invoiceHeaderKey(line) {
  const text = String(line || '').replace(/\s+/g, '').replace(/^(?:\d+[.、]|[一二三四五六七八九十]+、|（[一二三四五六七八九十]+）|[①②③④⑤⑥⑦⑧⑨⑩])/, '').replace(/[:：]$/, '');
  return invoiceLabelDefs().find((item) => item.label === text)?.key || '';
}

function invoiceLabelDefs() {
  return [
    { label: '开户行及账号', key: 'bankAccount' },
    { label: '开户银行账号', key: 'bankAccount' },
    { label: '开户行账号', key: 'bankAccount' },
    { label: '开户账号', key: 'account' },
    { label: '账户号码', key: 'account' },
    { label: '账号号码', key: 'account' },
    { label: '纳税人识别号', key: 'taxNo' },
    { label: '统一社会信用代码', key: 'taxNo' },
    { label: '学校信用代码', key: 'taxNo' },
    { label: '社会信用代码', key: 'taxNo' },
    { label: '公司名称', key: 'name' },
    { label: '单位名称', key: 'name' },
    { label: '客户名称', key: 'name' },
    { label: '开户银行', key: 'bank' },
    { label: '银行账户', key: 'account' },
    { label: '单位地址', key: 'address' },
    { label: '注册地址', key: 'address' },
    { label: '地址、电话', key: 'address' },
    { label: '地址电话', key: 'address' },
    { label: '开户行', key: 'bank' },
    { label: '名称', key: 'name' },
    { label: '税号', key: 'taxNo' },
    { label: '统一代码', key: 'taxNo' },
    { label: '账号', key: 'account' },
    { label: '账户', key: 'account' },
    { label: '开户行号', key: 'bankLineNo' },
    { label: '银行行号', key: 'bankLineNo' },
    { label: '联行号', key: 'bankLineNo' },
    { label: '大额行号', key: 'bankLineNo' },
    { label: '行号', key: 'bankLineNo' },
    { label: '开票联系人', key: 'contact' },
    { label: '联系人', key: 'contact' },
    { label: '收件人', key: 'contact' },
    { label: '收票人', key: 'contact' },
    { label: '发票寄送地址', key: 'mailingAddress' },
    { label: '邮寄地址', key: 'mailingAddress' },
    { label: '收件地址', key: 'mailingAddress' },
    { label: '联系电话', key: 'contactPhone' },
    { label: '联系方式', key: 'contactPhone' },
    { label: '手机号', key: 'contactPhone' },
    { label: '手机', key: 'contactPhone' },
    { label: '地址', key: 'address' },
    { label: '电话', key: 'phone' },
    { label: '电子发票邮箱', key: 'email' },
    { label: '邮编', key: 'postcode' },
    { label: '邮箱', key: 'email' },
    { label: '收票邮箱', key: 'email' }
  ];
}

function invoiceBankKeywordPattern() {
  return /(银行|信用社|农商行|分行|支行|营业部|分理处)/;
}

function invoiceAddressKeywordPattern() {
  return /(省|市|区|县|路|街|号|楼|室|门面房|院|巷)/;
}

function invoiceEscapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function invoiceCleanContact(value) {
  return invoiceCleanLabelWords(value)
    .split(/\n/)[0]
    .replace(/(?:1[3-9]\d{9}|0\d{2,3}[- ]?\d{7,8}|0\d{9,11})/g, '')
    .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, '')
    .replace(/\s+/g, '')
    .trim();
}

function invoiceLooksLikeInstitutionName(value) {
  const text = invoiceCleanLabelWords(value).trim();
  if (!text || invoiceIsTitleLine(text) || invoiceAddressKeywordPattern().test(text) || invoiceBankKeywordPattern().test(text)) return false;
  if (invoiceFindTaxNo(text) || invoiceFindPhone(text) || invoiceFindAccount(text)) return false;
  return /(食品科技有限公司|餐饮管理有限公司|学校|实验学校|中学|小学|幼儿园|医院|卫生院|研究院|中心|协会|合作社|个体工商户|有限公司|有限责任公司|股份有限公司)$/.test(text);
}

function invoiceIsTitleLine(line) {
  const text = String(line || '').replace(/[:：\s]/g, '');
  if (/(有限公司|学校|医院|中心|个体工商户|合作社)/.test(text)) return false;
  return /(开票信息|开票资料|汇款资料|开票\(汇款\)资料|发票资料|专票资料|普票资料)/.test(text);
}

function parseInvoiceInfo(rawText) {
  const fields = invoiceEmptyFields();
  const source = invoiceNormalizeStrict(rawText);
  if (!source) return fields;

  invoiceParseExplicitLineFieldsStrict(source, fields);
  invoiceParseVerticalLabelValuesStrict(source, fields);
  const tagged = invoiceReadTaggedValues(source);
  let working = invoiceDropTitleLines(source);

  const explicitTaxNo = invoiceTaggedValue(tagged, ['taxNo']);
  fields.taxNo = fields.taxNo || invoiceFindTaggedTaxNoStrict(explicitTaxNo) || invoiceFindTaxNoStrict(working);
  working = invoiceRemoveLooseValue(working, fields.taxNo);

  const explicitPhone = invoiceTaggedValue(tagged, ['phone']);
  fields.phone = fields.phone || invoiceFindPhoneStrict(explicitPhone || working);
  working = invoiceRemoveLooseValue(working, fields.phone);

  const explicitAccount = invoiceTaggedValue(tagged, ['bankAccount', 'account']);
  fields.account = fields.account || invoiceFindAccountStrict(explicitAccount, fields) || invoiceFindAccountStrict(working, fields);
  working = invoiceRemoveLooseValue(working, fields.account);

  const explicitBank = invoiceTaggedValue(tagged, ['bank', 'bankAccount', 'account']);
  fields.bank = fields.bank || invoiceFindBankStrict(invoiceRemoveLooseValue(explicitBank, fields.account)) || invoiceFindBankStrict(working);
  working = invoiceRemoveLooseValue(working, fields.bank);

  const explicitAddress = invoiceTaggedValue(tagged, ['address']);
  fields.address = fields.address || invoiceFindAddressStrict(explicitAddress, fields) || invoiceFindAddressStrict(working, fields);
  working = invoiceRemoveLooseValue(working, fields.address);

  const explicitContact = invoiceTaggedValue(tagged, ['contact']);
  fields.contact = fields.contact || invoiceCleanContactStrict(explicitContact);
  if (!fields.phone && explicitContact) fields.phone = invoiceFindPhoneStrict(explicitContact);

  const explicitName = invoiceTaggedValue(tagged, ['name']);
  fields.name = fields.name || invoiceFindNameStrict(explicitName) || invoiceFindNameStrict(working) || invoiceFindNameStrict(source);

  invoiceParseFragmentedOcrFieldsStrict(source, fields);
  return invoiceFinalizeStrict(fields, source);
}

function parseInvoiceInfoFields(input) {
  const parsed = parseInvoiceInfo(input);
  return {
    ...parsed,
    bankNo: parsed.bankLineNo
  };
}

function normalizeInvoiceInfoForView(input) {
  return invoiceFieldsToText(parseInvoiceInfo(input));
}

function invoiceNormalizeStrict(value) {
  return String(value || '')
    .replace(/\r/g, '\n')
    .replace(/[\u00a0\u3000]/g, ' ')
    .replace(/[：；;]/g, ':')
    .replace(/[－—–]/g, '-')
    .replace(/。/g, '\n')
    .replace(/名[ \t]+称/g, '名称')
    .replace(/税[ \t]+号/g, '税号')
    .replace(/地[ \t]+址/g, '地址')
    .replace(/账[ \t]+号/g, '账号')
    .replace(/帐[ \t]+号/g, '账号')
    .replace(/行[ \t]+号/g, '行号')
    .replace(/电[ \t]+话/g, '电话')
    .replace(/\n?\s*(?:电\s*)?开账行\s*\n\s*行\s*:/g, '\n开户行:')
    .replace(/开户银行\s*银行账户/g, '开户银行\n银行账户')
    .replace(/开户行\s*银行账户/g, '开户行\n银行账户')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{2,}/g, '\n')
    .trim();
}

function invoiceParseExplicitLineFieldsStrict(text, fields) {
  let inMailingBlock = false;
  const lines = invoiceDropTitleLines(text).split('\n').map((line) => line.trim()).filter(Boolean);

  lines.forEach((rawLine) => {
    const line = invoiceCleanNoiseStrict(rawLine);
    if (!line || invoiceLooksLikeEmailStrict(line)) return;

    if (invoiceMailingAddressLabelPatternStrict().test(line)) {
      inMailingBlock = true;
      return;
    }

    if (!fields.name && invoiceLooksLikeInstitutionNameStrict(line)) {
      fields.name = invoiceFindNameStrict(line);
      return;
    }

    const nameValue = invoiceValueAfterLabelStrict(line, invoiceNameLabelPatternStrict());
    if (nameValue && !fields.name) fields.name = invoiceFindNameStrict(nameValue) || invoiceCleanNameStrict(nameValue);

    const taxValue = invoiceValueAfterLabelStrict(line, invoiceTaxNoLabelPatternStrict());
    if (taxValue && !fields.taxNo) fields.taxNo = invoiceFindTaggedTaxNoStrict(taxValue);

    const bankLineNoValue = invoiceValueAfterLabelStrict(line, invoiceBankLineNoLabelPatternStrict());
    if (bankLineNoValue && !fields.bankLineNo) fields.bankLineNo = invoiceFindBankLineNoStrict(bankLineNoValue);

    const accountValue = invoiceValueAfterLabelStrict(line, invoiceAccountLabelPatternStrict());
    if (accountValue && !fields.account) fields.account = invoiceFindAccountStrict(accountValue, fields);

    const bankValue = invoiceValueAfterLabelStrict(line, invoiceBankLabelPatternStrict());
    if (bankValue && !fields.bank) fields.bank = invoiceFindBankStrict(bankValue);

    const addressValue = invoiceValueAfterLabelStrict(line, invoiceAddressLabelPatternStrict());
    if (addressValue && !fields.address && invoiceLooksLikeAddressLineStrict(addressValue)) fields.address = invoiceCleanAddressStrict(addressValue);

    const phoneValue = invoiceValueAfterLabelStrict(line, invoicePhoneLabelPatternStrict());
    if (phoneValue && !fields.phone) fields.phone = invoiceFindPhoneStrict(phoneValue);
  });
}

function invoiceValueAfterLabelStrict(line, labelPattern) {
  const match = String(line || '').match(labelPattern);
  return match ? String(match[1] || '').replace(/^[:：;；]+/g, '').trim() : '';
}

function invoiceParseVerticalLabelValuesStrict(text, fields) {
  const lines = invoiceDropTitleLines(text).split('\n').map((line) => line.trim()).filter(Boolean);
  const headerStart = lines.findIndex((line, index) => invoiceHeaderKeyStrict(line) && invoiceHeaderKeyStrict(lines[index + 1] || ''));
  if (headerStart < 0) return;

  const beforeHeaders = lines.slice(0, headerStart).join('\n');
  if (!fields.name) fields.name = invoiceFindNameStrict(beforeHeaders);

  let valueStart = headerStart;
  while (valueStart < lines.length && invoiceHeaderKeyStrict(lines[valueStart])) valueStart += 1;
  const headers = lines.slice(headerStart, valueStart).map(invoiceHeaderKeyStrict);
  lines.slice(valueStart).forEach((line, index) => {
    invoiceAssignExpectedValueStrict(headers[index], line, fields);
    invoiceAssignLooseValueStrict(line, fields);
  });
}

function invoiceHeaderKeyStrict(line) {
  const text = String(line || '').replace(/[:：\s]/g, '');
  return invoiceStrictLabels().find((item) => item.label === text)?.key || '';
}

function invoiceAssignLooseValueStrict(rawValue, fields) {
  const value = invoiceCleanNoiseStrict(rawValue);
  if (!value || invoiceLooksLikeEmailStrict(value)) return;

  const taxNo = invoiceFindTaxNoStrict(value);
  if (taxNo) {
    if (!fields.taxNo) fields.taxNo = taxNo;
    const remainder = invoiceCleanNoiseStrict(invoiceRemoveLooseValue(value, taxNo));
    if (remainder && !fields.address && invoiceLooksLikeAddressLineStrict(remainder)) {
      fields.address = invoiceCleanAddressStrict(remainder);
    }
    if (remainder && !fields.name) fields.name = invoiceFindNameStrict(remainder);
    return;
  }

  if (!fields.phone) fields.phone = invoiceFindPhoneStrict(value);
  if (!fields.bank && invoiceBankKeywordPatternStrict().test(value)) fields.bank = invoiceFindBankStrict(value);
  if (!fields.account) fields.account = invoiceFindAccountStrict(value, fields);
  if (!fields.address && invoiceLooksLikeAddressLineStrict(value) && !invoiceBankKeywordPatternStrict().test(value) && !invoiceLooksLikeInstitutionNameStrict(value)) {
    fields.address = invoiceCleanAddressStrict(value);
  }
  if (!fields.name) fields.name = invoiceFindNameStrict(value);
}

function invoiceAssignExpectedValueStrict(key, rawValue, fields) {
  const value = invoiceCleanNoiseStrict(rawValue);
  if (!key || !value || invoiceLooksLikeEmailStrict(value)) return;

  if (key === 'taxNo' && !fields.taxNo) {
    fields.taxNo = invoiceFindTaggedTaxNoStrict(value);
  }
  if (key === 'name' && !fields.name) {
    fields.name = invoiceFindNameStrict(value) || invoiceCleanNameStrict(value);
  }
  if (key === 'address' && !fields.address) {
    fields.address = invoiceFindAddressStrict(value, fields) || (invoiceLooksLikeAddressLineStrict(value) ? invoiceCleanAddressStrict(value) : '');
  }
  if ((key === 'phone' || key === 'contactPhone') && !fields.phone) {
    fields.phone = invoiceFindPhoneStrict(value);
  }
  if (key === 'bank' && !fields.bank) {
    fields.bank = invoiceFindBankStrict(value);
  }
  if ((key === 'account' || key === 'bankAccount') && !fields.account) {
    fields.account = invoiceFindAccountStrict(value, fields);
  }
  if (key === 'bankLineNo' && !fields.bankLineNo) {
    fields.bankLineNo = invoiceFindBankLineNoStrict(value);
  }
}

function invoiceReadTaggedValues(text) {
  const labels = [...invoiceStrictLabels()].sort((a, b) => b.label.length - a.label.length);
  const labelPattern = labels.map((item) => invoiceEscapeRegExp(item.label)).join('|');
  const serial = '(?:\\d+[.、]|[一二三四五六七八九十]+、|（[一二三四五六七八九十]+）|[①②③④⑤⑥⑦⑧⑨⑩])?';
  const regex = new RegExp(`${serial}\\s*(${labelPattern})\\s*[:]?`, 'g');
  const matches = [];
  for (const match of text.matchAll(regex)) {
    const label = match[1];
    const def = labels.find((item) => item.label === label);
    if (!def) continue;
    matches.push({
      key: def.key,
      label,
      index: match.index + match[0].indexOf(label),
      valueStart: match.index + match[0].length
    });
  }
  return matches.map((match, index) => {
    const next = matches[index + 1];
    return {
      key: match.key,
      label: match.label,
      value: text.slice(match.valueStart, next ? next.index : text.length).trim()
    };
  });
}

function invoiceTaggedValue(tagged, keys) {
  const item = tagged.find((entry) => keys.includes(entry.key) && invoiceUsefulTaggedValue(entry.value, entry.key));
  return item ? item.value : '';
}

function invoiceUsefulTaggedValue(value, key) {
  const text = String(value || '').trim();
  if (!text) return false;
  if (key === 'taxNo') return Boolean(invoiceFindTaggedTaxNoStrict(text) || invoiceFindTaxNoStrict(text) || invoiceFindNameStrict(text));
  if (key === 'phone') return Boolean(invoiceFindPhoneStrict(text));
  if (key === 'account' || key === 'bankAccount') return Boolean(invoiceFindAccountStrict(text) || invoiceFindBankStrict(text));
  if (key === 'bank') return Boolean(invoiceFindBankStrict(text));
  if (key === 'address') return Boolean(invoiceFindAddressStrict(text));
  if (key === 'name') return Boolean(invoiceFindNameStrict(text));
  if (key === 'contact') return Boolean(invoiceCleanContactStrict(text));
  if (key === 'bankLineNo') return Boolean(invoiceFindBankLineNoStrict(text));
  return true;
}

function invoiceStrictLabels() {
  return [
    { label: '开户行及账号', key: 'bankAccount' },
    { label: '开户银行账号', key: 'bankAccount' },
    { label: '开户银行帐号', key: 'bankAccount' },
    { label: '开户行账号', key: 'bankAccount' },
    { label: '开户行帐号', key: 'bankAccount' },
    { label: '开户行账户', key: 'bankAccount' },
    { label: '银行账号', key: 'account' },
    { label: '银行帐号', key: 'account' },
    { label: '银行账户', key: 'account' },
    { label: '账户信息', key: 'bankAccount' },
    { label: '学校账户', key: 'bankAccount' },
    { label: '开户信息', key: 'bankAccount' },
    { label: '账户号码', key: 'account' },
    { label: '账号号码', key: 'account' },
    { label: '开户账号', key: 'account' },
    { label: '开户帐号', key: 'account' },
    { label: '国税纳税人识别号或统一社会信用代码', key: 'taxNo' },
    { label: '纳税人识别号', key: 'taxNo' },
    { label: '统一社会信用代码', key: 'taxNo' },
    { label: '学校信用代码', key: 'taxNo' },
    { label: '社会信用代码', key: 'taxNo' },
    { label: '信用代码', key: 'taxNo' },
    { label: '统一代码', key: 'taxNo' },
    { label: '纳税人名称', key: 'name' },
    { label: '公司名称', key: 'name' },
    { label: '单位名称', key: 'name' },
    { label: '客户名称', key: 'name' },
    { label: '学校名称', key: 'name' },
    { label: '开户地址', key: 'address' },
    { label: '地址在', key: 'address' },
    { label: '地址电话', key: 'address' },
    { label: '地址、电话', key: 'address' },
    { label: '税务登记的地址', key: 'address' },
    { label: '单位地址', key: 'address' },
    { label: '注册地址', key: 'address' },
    { label: '电开账行', key: 'bank' },
    { label: '开账行', key: 'bank' },
    { label: '开户银行名称', key: 'bank' },
    { label: '开户银行', key: 'bank' },
    { label: '开户行', key: 'bank' },
    { label: '开户行号', key: 'bankLineNo' },
    { label: '银行行号', key: 'bankLineNo' },
    { label: '联行号', key: 'bankLineNo' },
    { label: '大额行号', key: 'bankLineNo' },
    { label: '行号', key: 'bankLineNo' },
    { label: '开票联系人', key: 'contact' },
    { label: '联系人', key: 'contact' },
    { label: '收件人', key: 'contact' },
    { label: '收票人', key: 'contact' },
    { label: '联系电话', key: 'contactPhone' },
    { label: '联系方式', key: 'contactPhone' },
    { label: '手机号', key: 'contactPhone' },
    { label: '手机', key: 'contactPhone' },
    { label: '账号', key: 'account' },
    { label: '帐号', key: 'account' },
    { label: '账户', key: 'account' },
    { label: '税号', key: 'taxNo' },
    { label: '名称', key: 'name' },
    { label: '地址', key: 'address' },
    { label: '税务登记的电话', key: 'phone' },
    { label: '电话', key: 'phone' },
    { label: '话', key: 'phone' }
  ];
}

function invoiceDropTitleLines(text) {
  return String(text || '')
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && !invoiceIsTitleLineStrict(line))
    .join('\n');
}

function invoiceIsTitleLineStrict(line) {
  const text = String(line || '').replace(/[:：\s]/g, '');
  if (invoiceHasInstitutionKeyword(text)) return false;
  return /(开票信息|开票资料|汇款资料|开票\(汇款\)资料|发票资料|专票资料|普票资料|老板这个是我们的开票信息哈)/.test(text);
}

function invoiceFindTaxNoStrict(text) {
  for (const match of String(text || '').toUpperCase().matchAll(/(?:[0-9A-Z]\s*){18}/g)) {
    const value = match[0].replace(/\s+/g, '');
    if (value.length === 18 && /[A-Z]/.test(value)) return value;
  }
  return '';
}

function invoiceFindTaggedTaxNoStrict(text) {
  const source = String(text || '').toUpperCase();
  const mixedTaxNo = invoiceFindTaxNoStrict(source);
  if (mixedTaxNo) return mixedTaxNo;

  for (const match of source.matchAll(/(?:[0-9A-Z]\s*){15,20}/g)) {
    const value = match[0].replace(/[\s.\-]+/g, '');
    if (/^[0-9A-Z]{15,20}$/.test(value)) return value;
  }
  return '';
}

function invoiceFindPhoneStrict(text) {
  const source = String(text || '');
  for (const match of source.matchAll(/(?:1\s*\d{2}\s*\d{4}\s*\d{4}|1[3-9]\d{9}|0\d{2,3}\s+\d{3,4}\s+\d{3,4}|0\d{2,3}[- ]?\d{7,8}|0\d{9,11})/g)) {
    const value = match[0].trim();
    const compact = value.replace(/\s+/g, '');
    const before = source[match.index - 1] || '';
    const after = source[match.index + value.length] || '';
    if (/\d/.test(before) || /\d/.test(after)) continue;
    return /\s/.test(value) ? compact : value;
  }
  return '';
}

function invoiceFindAccountStrict(text, fields = {}) {
  const source = String(text || '');
  const accountNumberPattern = '((?:\\d[\\s.\\-]*){10,30})';
  const labeled = source.match(new RegExp(`(?:账号|帐号|账户|银行账号|银行帐号|银行账户|开户行账号|开户行帐号|开户银行账号|开户银行帐号|开户账号|开户帐号|账户号码|账号号码)\\s*:?\\s*${accountNumberPattern}`));
  const candidates = [];
  if (labeled) candidates.push(labeled[1]);
  for (const match of source.matchAll(/(?:\d[\s.\-]*){10,30}/g)) candidates.push(match[0]);
  for (const candidate of candidates) {
    const value = candidate.replace(/[\s.\-]+/g, '');
    if (value.length < 10 || value.length > 30) continue;
    if (fields.taxNo && fields.taxNo.includes(value)) continue;
    if (fields.bankLineNo && fields.bankLineNo.includes(value)) continue;
    if (fields.phone && fields.phone.replace(/\D/g, '') === value) continue;
    if (invoiceFindPhoneStrict(candidate) && candidate.replace(/\D/g, '') === invoiceFindPhoneStrict(candidate).replace(/\D/g, '')) continue;
    return value;
  }
  return '';
}

function invoiceFindBankLineNoStrict(text) {
  const match = String(text || '').match(/\d[\d\s.\-]{5,24}\d/);
  return match ? match[0].replace(/[^\d]/g, '') : '';
}

function invoiceFindBankStrict(text) {
  let source = invoiceCleanBankStrict(text);
  source = invoiceRemoveLooseValue(source, invoiceFindAccountStrict(source));
  const line = source.split('\n').map((item) => item.trim()).find((item) => invoiceBankKeywordPatternStrict().test(item));
  const bankSource = line || source.replace(/\s+/g, '');
  const match = bankSource.match(/[\u4e00-\u9fa5A-Za-z0-9]{0,35}(?:银行|中行|农行|工行|建行|交行|招行|邮储|招商银行|信用社|农商行)[\u4e00-\u9fa5A-Za-z0-9]*(?:分行|支行|营业部|营业厅|分理处)?/);
  return match ? invoiceCleanBankStrict(match[0]).replace(/\d+$/g, '') : '';
}

function invoiceFindAddressStrict(text, fields = {}) {
  let source = invoiceSliceFromAddressLabel(text);
  source = invoiceCleanAddressStrict(source);
  [fields.taxNo, fields.phone, fields.account, fields.bank, fields.name].filter(Boolean).forEach((value) => {
    source = invoiceRemoveLooseValue(source, value);
  });
  source = source
    .replace(/[A-Z0-9]{18}/gi, ' ')
    .replace(/[0-9][0-9\s.\-]{11,40}[0-9]/g, ' ')
    .replace(/(?:1\s*\d{2}\s*\d{4}\s*\d{4}|1[3-9]\d{9}|0\d{2,3}[- ]?\d{7,8}|0\d{9,11})/g, ' ');
  const line = source.split('\n')
    .map((item) => item.trim())
    .find((item) => invoiceLooksLikeAddressLineStrict(item) && !invoiceBankKeywordPatternStrict().test(item) && !invoiceLooksLikeInstitutionNameStrict(item));
  return invoiceCleanAddressStrict(line || '');
}

function invoiceSliceFromAddressLabel(text) {
  const source = String(text || '');
  const match = source.match(/(?:地址在|开户地址|单位地址|地址电话|地址、电话|地址)\s*[:：]?([\s\S]*)/);
  return match ? match[1] : source;
}

function invoiceFindNameStrict(text) {
  const rawLine = String(text || '').split('\n').map((item) => item.trim()).find((item) => invoiceLooksLikeInstitutionNameStrict(item));
  if (rawLine) return invoiceCleanNameStrict(rawLine);
  const cleaned = invoiceCleanNameStrict(text);
  const line = cleaned.split('\n').map((item) => item.trim()).find((item) => invoiceLooksLikeInstitutionNameStrict(item));
  if (line) return invoiceCleanNameStrict(line);
  const compact = cleaned.replace(/\s+/g, '');
  const match = compact.match(/[\u4e00-\u9fa5A-Za-z0-9（）()]{2,45}(?:食品科技有限公司|餐饮管理有限公司|供应链管理有限公司|酒业有限公司|有限责任公司|股份有限公司|厨房设备厂|食品厂|设备厂|经营部|实验学校|有限公司|个体工商户|幼儿园|卫生院|研究院|合作社|学校|中学|小学|医院|中心|协会)/);
  return match ? invoiceCleanNameStrict(match[0]) : '';
}

function invoiceCleanNameStrict(value) {
  let text = invoiceCleanNoiseStrict(value)
    .replace(/老板这个是我们的开票信息哈[:：]?/g, '')
    .replace(/^(?:开票[:：]?|开票|专票资料|开票资料|发票资料|单位[:：]?|公司[:：]?|名称[:：]?|学校开票)+/g, '')
    .replace(/开票信息[:：]?/g, '')
    .replace(/开票资料[:：]?/g, '')
    .replace(/发票资料[:：]?/g, '')
    .replace(/汇款资料[:：]?/g, '')
    .replace(/税\s*号.*$/s, '')
    .replace(/纳税人识别号.*$/s, '')
    .replace(/统一代码.*$/s, '')
    .replace(/信用代码.*$/s, '')
    .replace(/开户行.*$/s, '')
    .replace(/开户银行.*$/s, '')
    .replace(/地址.*$/s, '')
    .replace(/电话.*$/s, '')
    .trim();
  const index = text.search(/[\u4e00-\u9fa5A-Za-z0-9（）()]{2,45}(?:食品科技有限公司|餐饮管理有限公司|供应链管理有限公司|酒业有限公司|有限责任公司|股份有限公司|厨房设备厂|食品厂|设备厂|经营部|实验学校|有限公司|个体工商户|幼儿园|卫生院|研究院|合作社|学校|中学|小学|医院|中心|协会)/);
  if (index > 0) text = text.slice(index);
  return text.trim();
}

function invoiceCleanBankStrict(value) {
  const bank = invoiceCleanNoiseStrict(value)
    .replace(/学校账户[:：]?/g, '')
    .replace(/账户信息[:：]?/g, '')
    .replace(/开户信息[:：]?/g, '')
    .replace(/信息[:：]?/g, '')
    .replace(/开户行及账号[:：]?/g, '')
    .replace(/开户银行及账号[:：]?/g, '')
    .replace(/开户行及账户[:：]?/g, '')
    .replace(/开户银行及账户[:：]?/g, '')
    .replace(/银行账号[:：]?/g, '')
    .replace(/((?:[\u4e00-\u9fa5A-Za-z0-9]{1,35})(?:银行|中行|农行|工行|建行|交行|招行|邮储|信用社|农商行))账户/g, '$1')
    .replace(/银行账户[:：]?/g, '')
    .replace(/开户行账号[:：]?/g, '')
    .replace(/开户银行账号[:：]?/g, '')
    .replace(/开户银行[:：]?/g, '')
    .replace(/开户行[:：]?/g, '')
    .replace(/账号[:：]?/g, '')
    .replace(/账户[:：]?/g, '')
    .replace(/号码[:：]?/g, '')
    .replace(/^及/g, '')
    .replace(/(?:1\s*\d{2}\s*\d{4}\s*\d{4}|1[3-9]\d{9}|0\d{2,3}[- ]?\d{7,8}|0\d{9,11})/g, '')
    .trim();
  return invoiceTrimBankTrailingNoStrict(bank);
}

function invoiceCleanAddressStrict(value) {
  return invoiceCleanNoiseStrict(value)
    .replace(/^(地址在|开户地址|单位地址|地址)[:：]?/g, '')
    .replace(/^[^\u4e00-\u9fa5]*(?=[\u4e00-\u9fa5])/g, '')
    .replace(/^[0-9A-Z]{1,20}(?=[\u4e00-\u9fa5]*(?:省|市|区|县|镇|街|路|巷|号))/i, '')
    .replace(/(?:电话|话)[:：]?.*$/s, '')
    .replace(/电话.*$/s, '')
    .replace(/(^|[^\d])(?:1\s*\d{2}\s*\d{4}\s*\d{4}|1[3-9]\d{9}|0\d{2,3}[- ]?\d{7,8}|0\d{2,3}\s+\d{3,4}\s+\d{3,4}|0\d{9,11})(?!\d)/g, '$1')
    .replace(/开户行.*$/s, '')
    .replace(/开户银行.*$/s, '')
    .replace(/[，,。.\s]+$/g, '')
    .trim();
}

function invoiceCleanContactStrict(value) {
  return invoiceCleanNoiseStrict(value)
    .split(/\n/)[0]
    .replace(/联系人[:：]?/g, '')
    .replace(/收件人[:：]?/g, '')
    .replace(/收票人[:：]?/g, '')
    .replace(/电话[:：]?.*$/g, '')
    .replace(/(?:1\s*\d{2}\s*\d{4}\s*\d{4}|1[3-9]\d{9}|0\d{2,3}[- ]?\d{7,8}|0\d{9,11})/g, '')
    .replace(/[，,\s]+$/g, '')
    .trim();
}

function invoiceFinalizeStrict(fields, source = '') {
  const name = invoiceCleanNameStrict(fields.name);
  const result = {
    name,
    bank: invoiceCleanBankStrict(fields.bank),
    account: String(fields.account || '').replace(/[^\d]/g, ''),
    bankLineNo: String(fields.bankLineNo || '').replace(/\D/g, ''),
    taxNo: String(fields.taxNo || '').toUpperCase().replace(/[^0-9A-Z]/g, ''),
    address: invoiceCleanAddressStrict(fields.address),
    contact: invoiceCleanContactStrict(fields.contact),
    phone: String(fields.phone || '').trim()
  };
  if (!result.bankLineNo) result.bankLineNo = invoiceFindUnusedBankLineNoStrict(source, result);
  result.bank = invoiceCleanBankStrict(result.bank);
  result.address = invoiceCleanAddressStrict(invoiceRemoveLooseValue(result.address, result.phone));
  return result;
}

function invoiceParseFragmentedOcrFieldsStrict(text, fields) {
  const lines = invoiceDropTitleLines(text).split('\n').map((line) => line.trim()).filter(Boolean);
  lines.forEach((line, index) => {
    const compact = line.replace(/[:：\s]/g, '');
    if (!fields.bank && /^(?:电?开账行|开户银行|开户行)$/.test(compact)) {
      const bankLine = lines.slice(index + 1).find((item) => invoiceBankKeywordPatternStrict().test(item));
      if (bankLine) fields.bank = invoiceFindBankStrict(bankLine);
    }
    const numberMatch = line.match(/^号\s*:\s*(\d[\d\s.\-]{5,30}\d)$/);
    if (!numberMatch) return;
    const number = numberMatch[1].replace(/[^\d]/g, '');
    if (number.length === 12 && !fields.bankLineNo) {
      fields.bankLineNo = number;
    } else if (number.length >= 10 && number.length <= 30 && !fields.account) {
      fields.account = number;
    }
  });
}

function invoiceTrimBankTrailingNoStrict(value) {
  const text = String(value || '').trim();
  if (/号$/.test(text) && invoiceBankKeywordPatternStrict().test(text)) return text.replace(/号+$/g, '');
  return text;
}

function invoiceFindUnusedBankLineNoStrict(text, fields) {
  const used = [
    fields.account,
    fields.taxNo,
    fields.phone
  ].filter(Boolean).map((item) => String(item).replace(/\D/g, ''));
  for (const match of String(text || '').matchAll(/(?:^|[^\d])((?:\d[\s.\-]*){12})(?!\d)/g)) {
    const value = match[1].replace(/[^\d]/g, '');
    if (value.length === 12 && !used.some((item) => item === value || item.includes(value))) return value;
  }
  return '';
}

function invoiceRemoveLooseValue(text, value) {
  if (!value) return String(text || '');
  let result = String(text || '');
  const compact = String(value).replace(/[\s.\-]+/g, '');
  result = result.replace(new RegExp(invoiceEscapeRegExp(String(value)), 'g'), ' ');
  if (/^[0-9A-Z]{8,40}$/i.test(compact)) {
    result = result.replace(new RegExp(compact.split('').map(invoiceEscapeRegExp).join('[\\s.\\-]*'), 'gi'), ' ');
  }
  return result.replace(/[ \t]+/g, ' ').trim();
}

function invoiceCleanNoiseStrict(value) {
  return String(value || '')
    .replace(/编辑/g, '')
    .replace(/复制/g, '')
    .replace(/开票信息/g, '')
    .replace(/开票资料/g, '')
    .replace(/收票邮箱/g, '')
    .replace(/邮箱/g, '')
    .trim();
}

function invoiceLooksLikeEmailStrict(value) {
  return /^[A-Z0-9._%+-]+\s*@\s*[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(String(value || '').trim());
}

function invoiceHasInstitutionKeyword(text) {
  return /(食品科技有限公司|餐饮管理有限公司|供应链管理有限公司|酒业有限公司|厨房设备厂|食品厂|设备厂|经营部|学校|医院|中心|个体工商户|有限公司|有限责任公司|股份有限公司)/.test(String(text || ''));
}

function invoiceLooksLikeInstitutionNameStrict(text) {
  const value = invoiceCleanNameStrict(text);
  if (!value || invoiceIsForbiddenSingleNameStrict(value) || invoiceIsTitleLineStrict(value) || invoiceBankKeywordPatternStrict().test(value)) return false;
  if (invoiceLooksLikeAddressLineStrict(value) && !/(学校|实验学校|中学|小学|幼儿园|医院|中心|有限公司|有限责任公司|股份有限公司|酒业有限公司|个体工商户|厨房设备厂|食品厂|设备厂|经营部)/.test(value)) return false;
  if (invoiceFindTaxNoStrict(value) || invoiceFindPhoneStrict(value) || invoiceFindAccountStrict(value)) return false;
  return invoiceHasInstitutionKeyword(value);
}

function invoiceLooksLikeAddressLineStrict(text) {
  const value = String(text || '').trim();
  if (!value || invoiceLooksLikeSchoolNameLineStrict(value)) return false;
  return /(省|市|区|县|镇|街|路|巷|号|村|楼|室|层|门面房|工业区|道|门牌|院)/.test(value);
}

function invoiceLooksLikeSchoolNameLineStrict(text) {
  const value = String(text || '').trim();
  const chineseLength = (value.match(/[\u4e00-\u9fa5]/g) || []).length;
  return chineseLength >= 4 && /(实验学校|学校|中学|小学|幼儿园)/.test(value);
}

function invoiceIsForbiddenSingleNameStrict(text) {
  return /^(学校|医院|中心|公司|单位|开票|资料|账户|银行)$/.test(String(text || '').trim());
}

function invoiceBankKeywordPatternStrict() {
  return /(银行|中行|农行|工行|建行|交行|招行|邮储|信用社|农商行|分行|支行|营业部|分理处)/;
}

function invoiceAddressKeywordPatternStrict() {
  return /(省|市|区|县|镇|街|路|巷|号|村|楼|室|层|门面房|工业区|座|大道|院)/;
}

function invoiceTaxNoLabelPatternStrict() {
  return /^(?:纳税人识别号|统一社会信用代码|统一代码|社会信用代码|信用代码|税号)\s*:?\s*(.+)$/;
}

function invoiceNameLabelPatternStrict() {
  return /^(?:发票抬头|公司名称|单位名称|客户名称|学校名称|名称)\s*:?\s*(.+)$/;
}

function invoiceAccountLabelPatternStrict() {
  return /^(?:银行账号|银行帐号|银行账户|开户行账号|开户行帐号|开户银行账号|开户银行帐号|开户账号|开户帐号|账户号码|账号号码|账号|帐号|账户)\s*:?\s*(.+)$/;
}

function invoiceBankLineNoLabelPatternStrict() {
  return /^(?:开户行号|银行行号|联行号|大额行号|行号)\s*:?\s*(.+)$/;
}

function invoiceBankLabelPatternStrict() {
  return /^(?:开户银行|开户行)\s*:?\s*(.+)$/;
}

function invoiceAddressLabelPatternStrict() {
  return /^(?:地址在|开户地址|单位地址|注册地址|地址电话|地址、电话|地址)\s*:?\s*(.+)$/;
}

function invoiceMailingAddressLabelPatternStrict() {
  return /^(?:邮寄地址|发票寄送地址|收件地址|寄送地址|邮递地址)\s*:?/;
}

function invoicePhoneLabelPatternStrict() {
  return /^(?:联系电话|联系方式|电话|手机号|手机)\s*:?\s*(.+)$/;
}

let toastTimer;
const scopedToastTimers = new WeakMap();
function showToast(message, type = 'info') {
  const scope = getActiveToastScope();
  if (scope) {
    showScopedToast(scope, message, type);
    return;
  }

  clearTimeout(toastTimer);
  el.toast.textContent = message;
  el.toast.className = `toast ${type}`;
  toastTimer = setTimeout(() => {
    el.toast.classList.add('hidden');
  }, type === 'error' || type === 'warning' ? 5200 : 3600);
}

function getActiveToastScope() {
  if (!el.productDetailOverlay.classList.contains('hidden')) {
    return el.productDetailOverlay.querySelector('.product-detail-panel');
  }
  return [...document.querySelectorAll('dialog[open]')].at(-1) || null;
}

function showScopedToast(scope, message, type = 'info') {
  let toast = scope.querySelector(':scope > .scoped-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'scoped-toast hidden';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    scope.append(toast);
  }

  const oldTimer = scopedToastTimers.get(scope);
  if (oldTimer) clearTimeout(oldTimer);
  toast.textContent = message;
  toast.className = `scoped-toast ${type}`;
  const timer = setTimeout(() => {
    toast.classList.add('hidden');
  }, type === 'error' || type === 'warning' ? 5200 : 3600);
  scopedToastTimers.set(scope, timer);
}

function formatPrice(price) {
  if (price === null || price === undefined || price === '') return uiText('待确认', 'TBD');
  return `￥${Number(price).toLocaleString('zh-CN')}`;
}

function renderPriceMeta(price) {
  if (!state.showPrices) return '';
  return `<div>${uiText('价格', 'Price')}: <span class="price">${formatPrice(price)}</span></div>`;
}

function renderSelectedPriceInput(item) {
  if (!state.showPrices) return '';
  return `<label>${uiText('单价', 'Unit Price')}<input data-field="price" type="number" min="0" step="0.01" value="${item.price ?? ''}" placeholder="${uiText('可为空', 'Optional')}"></label>`;
}

function shortText(text, limit) {
  return text.length > limit ? `${text.slice(0, limit)}...` : text;
}

function pathToFileUrl(filePath) {
  const value = String(filePath || '');
  const isAbsolute = /^[a-zA-Z]:[\\/]/.test(value) || value.startsWith('\\\\') || value.startsWith('/');
  const resolved = isAbsolute ? value : `${state.meta?.baseDir || ''}\\${value}`;
  return `file:///${resolved.replace(/\\/g, '/')}`;
}

function isCccMarkedItem(item) {
  if (item.type === 'part' && (item.category === 'CCC类' || item.category === 'CCC零配件')) return true;
  if (item.type !== 'equipment') return false;
  return [
    '全预混摇摆汤锅',
    '燃烧机摇摆汤锅',
    '自吸风摇摆汤锅',
    '全预混摇摆炒锅',
    '燃烧机摇摆炒锅'
  ].includes(item.name);
}

function getCertificateLabel(item) {
  const identity = getItemIdentityText(item);
  if (/蒸汽|电热|电加热/.test(identity)) return '生产许可';
  if (/电磁/.test(identity)) return '证书';
  return 'CCC证书';
}

function getItemIdentityText(item) {
  return `${item.name || ''}\n${item.model || ''}\n${item.category || ''}\n${item.parameters || ''}\n${item.remark || ''}`;
}

function getMissingEquipmentInfo(item) {
  const missing = [];
  const text = `${item.parameters || ''}\n${item.dimensions || ''}\n${item.remark || ''}`;
  const identity = getItemIdentityText(item);

  if (item.type === 'equipment') {
    const hasCapacity = /容量[：:]\s*[0-9]+(?:\.[0-9]+)?\s*L/i.test(text);
    const hasInnerDiameter = /(锅内直径|内锅直径|锅内径|内胆直径|锅体直径|锅口直径|锅口径)[：:]?\s*[0-9]+/i.test(text);
    const dimensionText = String(item.dimensions || '').replace(/液压站尺寸[：:].*/g, '');
    const hasDimensions = /[0-9]+\s*[*x×✘]\s*[0-9]+\s*[*x×✘]\s*[0-9]+/i.test(dimensionText) || /设备外型尺寸[：:]\s*[0-9]+\s*[*x×✘]\s*[0-9]+\s*[*x×✘]\s*[0-9]+/i.test(text);
    const isElectricHeating = /(电热|电加热|电磁|煮粥机)/.test(identity);
    const hasMixer = /(搅拌|行星|炒菜机|自动炒锅|煮粥机)/.test(identity);
    const isGas = /(燃气|天然气|全预混|燃烧机|自吸风)/.test(identity);
    const hasRatedPower = /(加热额定功率|额定功率|电热功率|电磁功率|功率)[：:]?\s*[0-9.]+(?:-[0-9.]+)?\s*k?w/i.test(text);
    const hasMixerPower = /(搅拌功率|旋转电机功率|电机功率)[：:]?\s*[0-9.]+(?:-[0-9.]+)?\s*k?w/i.test(text);
    const hasVoltage = /电压[：:]\s*(?:220|380)\s*V/i.test(text) || /380V/i.test(text);
    const hasGasConsumption = /(耗气量|燃气耗气量|热负荷)[：:]?\s*[^\n]*[0-9.]+/i.test(text);

    if (item.price === null || item.price === undefined || item.price === '') missing.push('价格');
    if (!hasCapacity) missing.push('容量');
    if (!hasInnerDiameter) missing.push('内锅直径');
    if (!hasDimensions) missing.push('外型尺寸');
    if (isElectricHeating && !hasRatedPower) missing.push('额定功率');
    if (hasMixer && !hasMixerPower) missing.push('搅拌功率');
    if ((isElectricHeating || hasMixer) && !hasVoltage) missing.push('电压');
    if (isGas && !hasGasConsumption) missing.push('耗气量');
    if (!String(item.image_path || '').trim()) missing.push('图片');
    if (item.image_path && item.image_missing) missing.push('图片文件');
    missing.push(...getMissingDocumentInfo(item));
    return missing;
  }
  if (item.type === 'part') {
    if (item.price === null || item.price === undefined || item.price === '') missing.push('价格');
    if (!String(item.image_path || '').trim()) missing.push('图片');
    if (item.image_path && item.image_missing) missing.push('图片文件');
  }
  return missing;
}

function getMissingDocumentInfo(item) {
  if (item.type !== 'equipment') return [];
  if (!Object.prototype.hasOwnProperty.call(item, 'documents')) return [];
  const documents = item.documents || {};
  return [
    ['ccc', getCertificateLabel(item)],
    ['report', '检测报告'],
    ...(isCccMarkedItem(item) ? [['energyReport', '能效检测报告']] : []),
    ['view3', '三视图'],
    ['manual', '说明书']
  ]
    .filter(([key]) => !String(documents[key] || '').trim())
    .map(([, label]) => label);
}

function extractCapacity(item) {
  const source = `${item.remark || ''}\n${item.parameters || ''}`;
  const match = source.match(/容量[:：]\s*([0-9]+(?:\.[0-9]+)?\s*[Ll升]?)/);
  if (!match) return '';
  return match[1].replace(/\s+/g, '').replace(/升$/, 'L').replace(/l$/, 'L');
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function escapeAttribute(value) {
  return escapeHtml(value).replace(/`/g, '&#096;');
}

function debounce(fn, wait) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), wait);
  };
}
