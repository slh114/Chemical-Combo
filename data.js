/* ============================================================
 * 化学之王 Chemical Combo —— 数据层
 * 数据来源：
 *   《化学之王 游戏指南》(化学之王正文.docx) 第3~4部分、附录
 *   《规则补充》(规则补充.docx)
 * ============================================================ */
(function (global) {
  'use strict';

  /* ---------- 物质牌总表 ----------
   * st 状态: s固态 l液态 g气态
   * sol 溶解性: y可溶 m微溶 n难溶 x遇水反应/本身是水
   * el 元素组成（用于“转换”牌：至少含一种相同元素）
   */
  var SUBSTANCES = [
    /* 酸 Acid (Ad) */
    { id: 'HCl', f: 'HCl', n: '盐酸', cat: 'Ad', st: 'l', sol: 'y', el: ['H', 'Cl'], cor: true, vol: true, note: '常见强酸' },
    { id: 'H2SO4', f: 'H₂SO₄', n: '硫酸', cat: 'Ad', st: 'l', sol: 'y', el: ['H', 'S', 'O'], cor: true, note: '常见强酸，浓硫酸有强吸水性、脱水性' },
    { id: 'HNO3', f: 'HNO₃', n: '硝酸', cat: 'Ad', st: 'l', sol: 'y', el: ['H', 'N', 'O'], cor: true, vol: true, note: '常见强酸，见光易分解' },
    { id: 'HF', f: 'HF', n: '氢氟酸', cat: 'Ad', st: 'l', sol: 'y', el: ['H', 'F'], cor: true, vol: true, note: '弱酸，能腐蚀玻璃' },
    { id: 'CH3COOH', f: 'CH₃COOH', n: '醋酸', cat: 'Ad', st: 'l', sol: 'y', el: ['C', 'H', 'O'], note: 'DLC·弱酸，食醋的主要成分' },
    { id: 'H2C2O4', f: 'H₂C₂O₄', n: '草酸', cat: 'Ad', st: 's', sol: 'y', el: ['C', 'H', 'O'], note: 'DLC·弱酸，有还原性' },

    /* 碱 Base (Be) */
    { id: 'NaOH', f: 'NaOH', n: '氢氧化钠', cat: 'Be', st: 's', sol: 'y', el: ['Na', 'O', 'H'], cor: true, note: '俗称烧碱、火碱、苛性钠' },
    { id: 'Ca(OH)2', f: 'Ca(OH)₂', n: '氢氧化钙', cat: 'Be', st: 's', sol: 'm', el: ['Ca', 'O', 'H'], note: '俗称熟石灰、消石灰，澄清石灰水' },
    { id: 'KOH', f: 'KOH', n: '氢氧化钾', cat: 'Be', st: 's', sol: 'y', el: ['K', 'O', 'H'], cor: true, note: '强碱' },
    { id: 'Ba(OH)2', f: 'Ba(OH)₂', n: '氢氧化钡', cat: 'Be', st: 's', sol: 'y', el: ['Ba', 'O', 'H'], note: '可溶性钡盐、钡碱有毒' },
    { id: 'NH3H2O', f: 'NH₃·H₂O', n: '一水合氨', cat: 'Be', st: 'l', sol: 'y', el: ['N', 'H', 'O'], vol: true, dec: true, note: '唯一的可溶性弱碱，受热易分解' },
    { id: 'Cu(OH)2', f: 'Cu(OH)₂', n: '氢氧化铜', cat: 'Be', st: 's', sol: 'n', el: ['Cu', 'O', 'H'], note: '蓝色沉淀' },
    { id: 'Mg(OH)2', f: 'Mg(OH)₂', n: '氢氧化镁', cat: 'Be', st: 's', sol: 'n', el: ['Mg', 'O', 'H'], note: 'DLC·白色沉淀，受热分解' },
    { id: 'Fe(OH)3', f: 'Fe(OH)₃', n: '氢氧化铁', cat: 'Be', st: 's', sol: 'n', el: ['Fe', 'O', 'H'], note: 'DLC·红褐色沉淀' },

    /* 盐 Salt (St) */
    { id: 'Na2CO3', f: 'Na₂CO₃', n: '碳酸钠', cat: 'St', st: 's', sol: 'y', el: ['Na', 'C', 'O'], note: '俗称纯碱、苏打' },
    { id: 'CaCl2', f: 'CaCl₂', n: '氯化钙', cat: 'St', st: 's', sol: 'y', el: ['Ca', 'Cl'], note: '可作干燥剂' },
    { id: 'AgNO3', f: 'AgNO₃', n: '硝酸银', cat: 'St', st: 's', sol: 'y', el: ['Ag', 'N', 'O'], note: '见光分解，用于检验氯离子' },
    { id: 'CuSO4', f: 'CuSO₄', n: '硫酸铜', cat: 'St', st: 's', sol: 'y', el: ['Cu', 'S', 'O'], note: '白色粉末，遇水变蓝；溶液呈蓝色' },
    { id: 'BaCl2', f: 'BaCl₂', n: '氯化钡', cat: 'St', st: 's', sol: 'y', el: ['Ba', 'Cl'], note: '有毒，用于检验硫酸根' },
    { id: 'NH4NO3', f: 'NH₄NO₃', n: '硝酸铵', cat: 'St', st: 's', sol: 'y', el: ['N', 'H', 'O'], dec: true, note: '受热分解，可作氮肥' },
    { id: 'CaCO3', f: 'CaCO₃', n: '碳酸钙', cat: 'St', st: 's', sol: 'n', el: ['Ca', 'C', 'O'], note: '大理石、石灰石的主要成分' },
    { id: 'FeSO4', f: 'FeSO₄', n: '硫酸亚铁', cat: 'St', st: 's', sol: 'y', el: ['Fe', 'S', 'O'], note: '浅绿色溶液，受热易被氧化' },
    { id: 'FeCl3', f: 'FeCl₃', n: '氯化铁', cat: 'St', st: 's', sol: 'y', el: ['Fe', 'Cl'], note: '溶液呈黄色' },
    { id: 'MgNO32', f: 'Mg(NO₃)₂', n: '硝酸镁', cat: 'St', st: 's', sol: 'y', el: ['Mg', 'N', 'O'], dec: true, note: '受热分解' },
    { id: 'BaNO32', f: 'Ba(NO₃)₂', n: '硝酸钡', cat: 'St', st: 's', sol: 'y', el: ['Ba', 'N', 'O'], dec: true, note: '受热分解' },
    { id: 'NaHCO3', f: 'NaHCO₃', n: '碳酸氢钠', cat: 'St', st: 's', sol: 'y', el: ['Na', 'H', 'C', 'O'], dec: true, note: '俗称小苏打，受热分解' },
    { id: 'CuCl2', f: 'CuCl₂', n: '氯化铜', cat: 'St', st: 's', sol: 'y', el: ['Cu', 'Cl'], note: '溶液呈蓝绿色' },
    { id: 'NH4HCO3', f: 'NH₄HCO₃', n: '碳酸氢铵', cat: 'St', st: 's', sol: 'y', el: ['N', 'H', 'C', 'O'], dec: true, note: '受热分解，可作氮肥' },
    { id: 'CuNO32', f: 'Cu(NO₃)₂', n: '硝酸铜', cat: 'St', st: 's', sol: 'y', el: ['Cu', 'N', 'O'], dec: true, note: 'DLC·蓝色晶体，受热分解' },
    { id: 'NaCl', f: 'NaCl', n: '氯化钠', cat: 'St', st: 's', sol: 'y', el: ['Na', 'Cl'], note: 'DLC·食盐' },
    { id: 'ZnSO4', f: 'ZnSO₄', n: '硫酸锌', cat: 'St', st: 's', sol: 'y', el: ['Zn', 'S', 'O'], note: 'DLC·无色晶体' },

    /* 氧化物 Oxide (Oe) */
    { id: 'H2O', f: 'H₂O', n: '水', cat: 'Oe', st: 'l', sol: 'x', el: ['H', 'O'], note: '最常见的溶剂' },
    { id: 'CO', f: 'CO', n: '一氧化碳', cat: 'Oe', st: 'g', sol: 'n', el: ['C', 'O'], note: '有毒，可燃' },
    { id: 'CO2', f: 'CO₂', n: '二氧化碳', cat: 'Oe', st: 'g', sol: 'm', el: ['C', 'O'], note: '能使澄清石灰水变浑浊' },
    { id: 'Fe2O3', f: 'Fe₂O₃', n: '氧化铁', cat: 'Oe', st: 's', sol: 'n', el: ['Fe', 'O'], note: '红棕色，俗称铁锈' },
    { id: 'CaO', f: 'CaO', n: '氧化钙', cat: 'Oe', st: 's', sol: 'x', el: ['Ca', 'O'], note: '俗称生石灰，遇水放热' },
    { id: 'CuO', f: 'CuO', n: '氧化铜', cat: 'Oe', st: 's', sol: 'n', el: ['Cu', 'O'], note: '黑色粉末' },
    { id: 'Al2O3', f: 'Al₂O₃', n: '氧化铝', cat: 'Oe', st: 's', sol: 'n', el: ['Al', 'O'], note: 'DLC·两性氧化物' },

    /* 单质 Elemental Substance (Es) */
    { id: 'O2', f: 'O₂', n: '氧气', cat: 'Es', st: 'g', sol: 'm', el: ['O'], note: '助燃，供给呼吸' },
    { id: 'H2', f: 'H₂', n: '氢气', cat: 'Es', st: 'g', sol: 'n', el: ['H'], note: '最轻的气体，可燃' },
    { id: 'Fe', f: 'Fe', n: '铁', cat: 'Es', st: 's', sol: 'n', el: ['Fe'], note: '金属活动性位于氢之前' },
    { id: 'Cu', f: 'Cu', n: '铜', cat: 'Es', st: 's', sol: 'n', el: ['Cu'], note: '紫红色金属，活动性弱于氢' },
    { id: 'Al', f: 'Al', n: '铝', cat: 'Es', st: 's', sol: 'n', el: ['Al'], note: '表面易形成致密氧化膜' },
    { id: 'Cl2', f: 'Cl₂', n: '氯气', cat: 'Es', st: 'g', sol: 'y', el: ['Cl'], note: '黄绿色，有毒' },
    { id: 'Na', f: 'Na', n: '钠', cat: 'Es', st: 's', sol: 'x', el: ['Na'], note: '与水剧烈反应' },
    { id: 'Zn', f: 'Zn', n: '锌', cat: 'Es', st: 's', sol: 'n', el: ['Zn'], note: '常用于制氢气' },
    { id: 'Mg', f: 'Mg', n: '镁', cat: 'Es', st: 's', sol: 'n', el: ['Mg'], note: '燃烧发出耀眼白光' },
    { id: 'C', f: 'C', n: '碳', cat: 'Es', st: 's', sol: 'n', el: ['C'], note: '常见还原剂' },
    { id: 'K', f: 'K', n: '钾', cat: 'Es', st: 's', sol: 'x', el: ['K'], note: 'DLC·活动性极强的金属' },
    { id: 'Ag', f: 'Ag', n: '银', cat: 'Es', st: 's', sol: 'n', el: ['Ag'], note: 'DLC·导电导热性最好的金属' }
  ];

  var COUNTS = {
    HCl: 5, H2SO4: 5, HNO3: 4, HF: 1,
    NaOH: 5, 'Ca(OH)2': 3, KOH: 2, 'Ba(OH)2': 2, NH3H2O: 2, 'Cu(OH)2': 1,
    Na2CO3: 3, CaCl2: 3, AgNO3: 3, CuSO4: 2, BaCl2: 2, NH4NO3: 2, CaCO3: 2, FeSO4: 2,
    FeCl3: 1, MgNO32: 1, BaNO32: 1, NaHCO3: 1, CuCl2: 1, NH4HCO3: 1,
    H2O: 3, CO: 2, CO2: 2, Fe2O3: 1, CaO: 1, CuO: 1,
    O2: 3, H2: 2, Fe: 2, Cu: 2, Al: 1, Cl2: 1, Na: 1, Zn: 1, Mg: 1, C: 1
  };

  /* DLC 物质牌（10种各1张） */
  var DLC_SUBSTANCE = ['CH3COOH', 'H2C2O4', 'Mg(OH)2', 'Fe(OH)3', 'CuNO32', 'NaCl', 'ZnSO4', 'Al2O3', 'K', 'Ag'];

  /* 反应中作为反应物出现、但不在物质牌表内的物质（仅存在于反应数据库，不发放手牌） */
  var OFF_TABLE = {
    MgO: { f: 'MgO', n: '氧化镁', cat: 'Oe', st: 's', sol: 'n', el: ['Mg', 'O'], note: '白色固体，金属氧化物' },
    'Al(OH)3': { f: 'Al(OH)₃', n: '氢氧化铝', cat: 'Be', st: 's', sol: 'n', el: ['Al', 'O', 'H'], note: '两性氢氧化物' },
    SO2: { f: 'SO₂', n: '二氧化硫', cat: 'Oe', st: 'g', sol: 'y', el: ['S', 'O'], note: '有刺激性气味，形成酸雨' },
    SO3: { f: 'SO₃', n: '三氧化硫', cat: 'Oe', st: 'l', sol: 'x', el: ['S', 'O'], note: '遇水放出大量热' },
    NH3: { f: 'NH₃', n: '氨气', cat: 'Oe', st: 'g', sol: 'y', el: ['N', 'H'], note: '有刺激性气味，极易溶于水' },
    'Fe(OH)2': { f: 'Fe(OH)₂', n: '氢氧化亚铁', cat: 'Be', st: 's', sol: 'n', el: ['Fe', 'O', 'H'], note: '白色沉淀，易被氧化' },
    BaCO3: { f: 'BaCO₃', n: '碳酸钡', cat: 'St', st: 's', sol: 'n', el: ['Ba', 'C', 'O'], note: '白色沉淀' },
    MgCl2: { f: 'MgCl₂', n: '氯化镁', cat: 'St', st: 's', sol: 'y', el: ['Mg', 'Cl'], note: '' },
    MgSO4: { f: 'MgSO₄', n: '硫酸镁', cat: 'St', st: 's', sol: 'y', el: ['Mg', 'S', 'O'], note: '' },
    BaO: { f: 'BaO', n: '氧化钡', cat: 'Oe', st: 's', sol: 'x', el: ['Ba', 'O'], note: '' },
    Na2O: { f: 'Na₂O', n: '氧化钠', cat: 'Oe', st: 's', sol: 'x', el: ['Na', 'O'], note: '' },
    Na2O2: { f: 'Na₂O₂', n: '过氧化钠', cat: 'Oe', st: 's', sol: 'x', el: ['Na', 'O'], note: '淡黄色固体' },
    KO2: { f: 'KO₂', n: '超氧化钾', cat: 'Oe', st: 's', sol: 'x', el: ['K', 'O'], note: '' },
    Fe3O4: { f: 'Fe₃O₄', n: '四氧化三铁', cat: 'Oe', st: 's', sol: 'n', el: ['Fe', 'O'], note: '黑色晶体，有磁性' },
    AgCl: { f: 'AgCl', n: '氯化银', cat: 'St', st: 's', sol: 'n', el: ['Ag', 'Cl'], note: '白色沉淀，不溶于稀硝酸' },
    BaSO4: { f: 'BaSO₄', n: '硫酸钡', cat: 'St', st: 's', sol: 'n', el: ['Ba', 'S', 'O'], note: '白色沉淀，不溶于稀硝酸' },
    CaSO4: { f: 'CaSO₄', n: '硫酸钙', cat: 'St', st: 's', sol: 'm', el: ['Ca', 'S', 'O'], note: '微溶' },
    'Ba(NO3)2': { f: 'Ba(NO₃)₂', n: '硝酸钡', cat: 'St', st: 's', sol: 'y', el: ['Ba', 'N', 'O'], note: '有毒' },
    Na2SO4: { f: 'Na₂SO₄', n: '硫酸钠', cat: 'St', st: 's', sol: 'y', el: ['Na', 'S', 'O'], note: '' },
    NH4Cl: { f: 'NH₄Cl', n: '氯化铵', cat: 'St', st: 's', sol: 'y', el: ['N', 'H', 'Cl'], note: '受热分解' },
    NaF: { f: 'NaF', n: '氟化钠', cat: 'St', st: 's', sol: 'y', el: ['Na', 'F'], note: '' }
  };
  /* 物质牌表（可发放手牌、可被“任意物质”代替、可作“转换”目标） */
  var CARD_TABLE = SUBSTANCES.slice();
  var CARD_IDS = CARD_TABLE.map(function (s) { return s.id; });

  var SUB_INDEX = {};
  SUBSTANCES.forEach(function (s) { SUB_INDEX[s.id] = s; });

  /* 全部物质 = 牌表 + 表外物质（表外物质只出现在反应数据库中） */
  Object.keys(OFF_TABLE).forEach(function (k) {
    if (SUB_INDEX[k]) return;
    var o = OFF_TABLE[k];
    var entry = { id: k, f: o.f, n: o.n, cat: o.cat, st: o.st, sol: o.sol, el: o.el, note: o.note, offTable: true };
    SUBSTANCES.push(entry);
    SUB_INDEX[k] = entry;
  });

  var CAT_NAME = { Ad: '酸', Be: '碱', St: '盐', Oe: '氧化物', Es: '单质', Ot: '其他' };
  var CAT_EN = { Ad: 'Acid', Be: 'Base', St: 'Salt', Oe: 'Oxide', Es: 'Elemental', Ot: 'Other' };

  /* ---------- 特殊牌 ---------- */
  var SPECIALS = [
    {
      id: 'WILD', name: '任意物质', count: 2,
      short: '任',
      text: '可代替任意一种【物质牌表】中存在的物质。使用时须明确所代替的物质名称，否则不予反应。',
      detail: '打出该牌时必须指定它代表物质牌表中的哪一种物质，之后按该物质参与反应。'
    },
    {
      id: 'CANCEL', name: '抵消', count: 1,
      short: '抵',
      text: '抵消一次行动：有科学家打出人物或操作 DLC 牌时，出此牌即视为完成相应要求。若人物牌与操作牌均未启用，则此牌可抵消本轮反应，开启新一轮（由出该牌的科学家出牌）。',
      detail: '用于响应人物/操作 DLC 的指示，免疫本次指示，不需出物质牌、不受停牌惩罚。'
    },
    {
      id: 'CONVERT', name: '转换', count: 1,
      short: '转',
      text: '将一种物质牌转换为至少含有一种相同元素的另一种物质。',
      detail: '把手中一张物质牌变为物质牌表中的另一种物质（二者元素组成至少有一种相同元素），转换后的物质进入实验台，由下一位科学家继续。'
    },
    {
      id: 'RECYCLE', name: '回收', count: 1,
      short: '回',
      text: '在废液缸中随机抽取一张物质牌放入自己的牌组中。',
      detail: '从废液缸随机抽一张物质牌加入手牌（废液缸中的药品原则上严禁使用，此牌为例外）。'
    }
  ];

  /* ---------- 人物 DLC（5位化学家） ---------- */
  var PEOPLE = [
    {
      id: 'PRIESTLEY', name: 'J. J. Priestley', cn: '普利斯特里', count: 1,
      need: 'O2 或 氧化物', needDesc: '一张氧气或氧化物物质牌', kind: ['O2'], cat: ['Oe'], stop: 2,
      text: '在场所有科学家打出一张氧气或氧化物的物质牌，若不出牌，则停 2 回合。',
      bio: '发现氧气、氨气等多种气体'
    },
    {
      id: 'BOYLE', name: 'R. Boyle', cn: '波义耳', count: 1,
      need: '盐', needDesc: '一张盐类物质牌', kind: [], cat: ['St'], stop: 2,
      text: '在场所有科学家打出一张盐的物质牌，若不出牌，则停 2 回合。',
      bio: '近代化学之父，提出元素概念'
    },
    {
      id: 'LEWIS', name: 'G. N. Lewis', cn: '路易斯', count: 1,
      need: '酸 或 碱', needDesc: '一张酸或碱的物质牌', kind: [], cat: ['Ad', 'Be'], stop: 2,
      text: '在场所有科学家打出一张酸或碱的物质牌，若不出牌，则停 2 回合。',
      bio: '提出共价键与电子对理论'
    },
    {
      id: 'HOU', name: '侯德榜', cn: '侯德榜', count: 1,
      need: '氨碱法六物质之一', needDesc: 'NH₃、CO₂、NaCl、H₂O、NaHCO₃、NH₄Cl 之一（氨水亦可）',
      kind: ['CO2', 'NaCl', 'H2O', 'NaHCO3'], cat: [], extra: ['NH3H2O'], stop: 1,
      text: '在场所有科学家打出一张氨碱法制碱反应（NH₃ + CO₂ + NaCl + H₂O → NaHCO₃ + NH₄Cl）中 6 种物质之一的物质牌（NH₃·H₂O 也算），若不出牌，则停 1 回合。',
      bio: '发明联合制碱法（侯氏制碱法）'
    },
    {
      id: 'XU', name: '徐寿', cn: '徐寿', count: 1,
      need: '单质', needDesc: '一张单质物质牌', kind: [], cat: ['Es'], stop: 2,
      text: '在场所有科学家打出一张单质的物质牌，若不出牌，则停 2 回合。',
      bio: '中国近代化学先驱，翻译《化学鉴原》'
    }
  ];

  /* ---------- 操作 DLC（5种操作） ---------- */
  var OPS = [
    {
      id: 'FILTER', name: '过滤', count: 1, stop: 1,
      need: '微溶或难溶的物质', needDesc: '一张微溶或难溶的物质牌',
      test: function (s) { return s.sol === 'm' || s.sol === 'n'; },
      text: '在场所有科学家打出一张微溶或难溶的物质牌，若不出牌，则停 1 回合。',
      desc: '分离可溶物与不溶物'
    },
    {
      id: 'DISTILL', name: '蒸馏', count: 1, stop: 1,
      need: '液体物质', needDesc: '一张液体的物质牌',
      test: function (s) { return s.st === 'l'; },
      text: '在场所有科学家打出一张液体的物质牌，若不出牌，则停 1 回合。',
      desc: '利用沸点差异分离液体混合物'
    },
    {
      id: 'DISSOLVE', name: '溶解', count: 1, stop: 2,
      need: '可溶物质', needDesc: '一张可溶的物质牌',
      test: function (s) { return s.sol === 'y'; },
      text: '在场所有科学家打出一张可溶的物质牌，若不出牌，则停 2 回合。',
      desc: '溶质分散到溶剂中形成溶液'
    },
    {
      id: 'COLLECT', name: '集气', count: 1, stop: 1,
      need: '气体物质', needDesc: '一张气体的物质牌',
      test: function (s) { return s.st === 'g'; },
      text: '在场所有科学家打出一张气体的物质牌，若不出牌，则停 1 回合。',
      desc: '排水法或向上排空气法收集气体'
    },
    {
      id: 'EVAPORATE', name: '蒸发', count: 1, stop: 2,
      need: '可蒸发结晶的可溶物质', needDesc: '一张可蒸发结晶的可溶物质牌（不含受热分解的 NaHCO₃、NH₃·H₂O、NH₄NO₃、Cu(NO₃)₂ 与受热易氧化的 FeSO₄）',
      test: function (s) { return s.sol === 'y' && s.id !== 'NaHCO3' && s.id !== 'NH3H2O' && s.id !== 'NH4NO3' && s.id !== 'CuNO32' && s.id !== 'FeSO4'; },
      text: '在场所有科学家打出一张可蒸发结晶的可溶物质牌（不包括受热分解的 NaHCO₃、NH₃·H₂O、NH₄NO₃、Cu(NO₃)₂ 和受热易氧化的 FeSO₄），若不出牌，则停 2 回合。',
      desc: '蒸发溶剂得到晶体'
    }
  ];

  /* ---------- 反应数据库 ----------
   * r 反应物 / p 生成物 / c 反应条件 / nm 反应名称 / t 反应类型
   * 反应范围：初高中常见化学反应（不含试卷、课外习题中的反应）
   */
  var REACTIONS = [
    /* 酸 + 碱 → 盐 + 水 */
    { r: ['HCl', 'NaOH'], p: ['NaCl', 'H2O'], c: '', nm: '中和反应', t: '中和' },
    { r: ['H2SO4', 'NaOH'], p: ['Na2SO4', 'H2O'], c: '', nm: '中和反应', t: '中和' },
    { r: ['HNO3', 'NaOH'], p: ['NaNO3', 'H2O'], c: '', nm: '中和反应', t: '中和' },
    { r: ['HCl', 'KOH'], p: ['KCl', 'H2O'], c: '', nm: '中和反应', t: '中和' },
    { r: ['H2SO4', 'KOH'], p: ['K2SO4', 'H2O'], c: '', nm: '中和反应', t: '中和' },
    { r: ['HNO3', 'KOH'], p: ['KNO3', 'H2O'], c: '', nm: '中和反应', t: '中和' },
    { r: ['HCl', 'Ca(OH)2'], p: ['CaCl2', 'H2O'], c: '', nm: '中和反应', t: '中和' },
    { r: ['H2SO4', 'Ca(OH)2'], p: ['CaSO4', 'H2O'], c: '', nm: '中和反应', t: '中和' },
    { r: ['HNO3', 'Ca(OH)2'], p: ['Ca(NO3)2', 'H2O'], c: '', nm: '中和反应', t: '中和' },
    { r: ['HCl', 'Ba(OH)2'], p: ['BaCl2', 'H2O'], c: '', nm: '中和反应', t: '中和' },
    { r: ['H2SO4', 'Ba(OH)2'], p: ['BaSO4', 'H2O'], c: '', nm: '中和反应（同时生成沉淀）', t: '中和' },
    { r: ['HNO3', 'Ba(OH)2'], p: ['Ba(NO3)2', 'H2O'], c: '', nm: '中和反应', t: '中和' },
    { r: ['HCl', 'NH3H2O'], p: ['NH4Cl', 'H2O'], c: '', nm: '中和反应', t: '中和' },
    { r: ['H2SO4', 'NH3H2O'], p: ['(NH4)2SO4', 'H2O'], c: '', nm: '中和反应', t: '中和' },
    { r: ['HNO3', 'NH3H2O'], p: ['NH4NO3', 'H2O'], c: '', nm: '中和反应', t: '中和' },
    { r: ['CH3COOH', 'NaOH'], p: ['CH3COONa', 'H2O'], c: '', nm: '中和反应', t: '中和' },
    { r: ['CH3COOH', 'Ca(OH)2'], p: ['(CH3COO)2Ca', 'H2O'], c: '', nm: '中和反应', t: '中和' },
    { r: ['CH3COOH', 'Na2CO3'], p: ['CH3COONa', 'H2O', 'CO2'], c: '', nm: '强酸制弱酸', t: '复分解' },
    { r: ['H2C2O4', 'NaOH'], p: ['Na2C2O4', 'H2O'], c: '', nm: '中和反应', t: '中和' },
    { r: ['HCl', 'Cu(OH)2'], p: ['CuCl2', 'H2O'], c: '', nm: '碱与酸反应', t: '中和' },
    { r: ['H2SO4', 'Cu(OH)2'], p: ['CuSO4', 'H2O'], c: '', nm: '碱与酸反应', t: '中和' },
    { r: ['HNO3', 'Cu(OH)2'], p: ['CuNO32', 'H2O'], c: '', nm: '碱与酸反应', t: '中和' },
    { r: ['HCl', 'Mg(OH)2'], p: ['MgCl2', 'H2O'], c: '', nm: '碱与酸反应', t: '中和' },
    { r: ['HNO3', 'Mg(OH)2'], p: ['MgNO32', 'H2O'], c: '', nm: '碱与酸反应', t: '中和' },
    { r: ['HCl', 'Fe(OH)3'], p: ['FeCl3', 'H2O'], c: '', nm: '碱与酸反应', t: '中和' },
    { r: ['H2SO4', 'Fe(OH)3'], p: ['Fe2(SO4)3', 'H2O'], c: '', nm: '碱与酸反应', t: '中和' },
    { r: ['HCl', 'Al(OH)3'], p: ['AlCl3', 'H2O'], c: '', nm: '两性氢氧化物与酸反应', t: '中和' },

    /* 酸 + 盐 → 新酸 + 新盐 */
    { r: ['HCl', 'Na2CO3'], p: ['NaCl', 'H2O', 'CO2'], c: '', nm: '碳酸盐与酸反应', t: '复分解' },
    { r: ['HCl', 'CaCO3'], p: ['CaCl2', 'H2O', 'CO2'], c: '', nm: '实验室制二氧化碳', t: '复分解' },
    { r: ['HCl', 'NaHCO3'], p: ['NaCl', 'H2O', 'CO2'], c: '', nm: '碳酸氢盐与酸反应', t: '复分解' },
    { r: ['HCl', 'NH4HCO3'], p: ['NH4Cl', 'H2O', 'CO2'], c: '', nm: '碳酸氢盐与酸反应', t: '复分解' },
    { r: ['H2SO4', 'Na2CO3'], p: ['Na2SO4', 'H2O', 'CO2'], c: '', nm: '碳酸盐与酸反应', t: '复分解' },
    { r: ['H2SO4', 'NaHCO3'], p: ['Na2SO4', 'H2O', 'CO2'], c: '', nm: '碳酸氢盐与酸反应', t: '复分解' },
    { r: ['HNO3', 'Na2CO3'], p: ['NaNO3', 'H2O', 'CO2'], c: '', nm: '碳酸盐与酸反应', t: '复分解' },
    { r: ['HNO3', 'NaHCO3'], p: ['NaNO3', 'H2O', 'CO2'], c: '', nm: '碳酸氢盐与酸反应', t: '复分解' },
    { r: ['H2SO4', 'BaCl2'], p: ['BaSO4', 'HCl'], c: '', nm: '检验硫酸根离子', t: '复分解' },
    { r: ['HCl', 'AgNO3'], p: ['AgCl', 'HNO3'], c: '', nm: '检验氯离子', t: '复分解' },
    { r: ['H2C2O4', 'CaCl2'], p: ['CaC2O4', 'HCl'], c: '', nm: '生成草酸钙沉淀', t: '复分解' },
    { r: ['HF', 'NaOH'], p: ['NaF', 'H2O'], c: '', nm: '中和反应（弱酸）', t: '中和' },

    /* 酸 + 金属氧化物 → 盐 + 水 */
    { r: ['HCl', 'Fe2O3'], p: ['FeCl3', 'H2O'], c: '', nm: '除铁锈', t: '复分解' },
    { r: ['H2SO4', 'Fe2O3'], p: ['Fe2(SO4)3', 'H2O'], c: '', nm: '金属氧化物与酸反应', t: '复分解' },
    { r: ['HNO3', 'Fe2O3'], p: ['Fe(NO3)3', 'H2O'], c: '', nm: '金属氧化物与酸反应', t: '复分解' },
    { r: ['HCl', 'CuO'], p: ['CuCl2', 'H2O'], c: '', nm: '黑色氧化铜溶解', t: '复分解' },
    { r: ['H2SO4', 'CuO'], p: ['CuSO4', 'H2O'], c: '', nm: '金属氧化物与酸反应', t: '复分解' },
    { r: ['HNO3', 'CuO'], p: ['CuNO32', 'H2O'], c: '', nm: '金属氧化物与酸反应', t: '复分解' },
    { r: ['HCl', 'CaO'], p: ['CaCl2', 'H2O'], c: '', nm: '金属氧化物与酸反应', t: '复分解' },
    { r: ['H2SO4', 'CaO'], p: ['CaSO4', 'H2O'], c: '', nm: '金属氧化物与酸反应', t: '复分解' },
    { r: ['HNO3', 'CaO'], p: ['Ca(NO3)2', 'H2O'], c: '', nm: '金属氧化物与酸反应', t: '复分解' },
    { r: ['HCl', 'MgO'], p: ['MgCl2', 'H2O'], c: '', nm: '金属氧化物与酸反应', t: '复分解' },
    { r: ['H2SO4', 'MgO'], p: ['MgSO4', 'H2O'], c: '', nm: '金属氧化物与酸反应', t: '复分解' },
    { r: ['HCl', 'Al2O3'], p: ['AlCl3', 'H2O'], c: '', nm: '两性氧化物与酸反应', t: '复分解' },
    { r: ['H2SO4', 'Al2O3'], p: ['Al2(SO4)3', 'H2O'], c: '', nm: '两性氧化物与酸反应', t: '复分解' },
    { r: ['HNO3', 'Al2O3'], p: ['Al(NO3)3', 'H2O'], c: '', nm: '两性氧化物与酸反应', t: '复分解' },

    /* 酸 + 金属 → 盐 + 氢气 */
    { r: ['HCl', 'Zn'], p: ['ZnCl2', 'H2'], c: '', nm: '实验室制氢气', t: '置换' },
    { r: ['H2SO4', 'Zn'], p: ['ZnSO4', 'H2'], c: '', nm: '实验室制氢气', t: '置换' },
    { r: ['HCl', 'Fe'], p: ['FeCl2', 'H2'], c: '', nm: '金属与酸反应', t: '置换' },
    { r: ['H2SO4', 'Fe'], p: ['FeSO4', 'H2'], c: '', nm: '金属与酸反应', t: '置换' },
    { r: ['HCl', 'Mg'], p: ['MgCl2', 'H2'], c: '', nm: '金属与酸反应', t: '置换' },
    { r: ['H2SO4', 'Mg'], p: ['MgSO4', 'H2'], c: '', nm: '金属与酸反应', t: '置换' },
    { r: ['HCl', 'Al'], p: ['AlCl3', 'H2'], c: '', nm: '金属与酸反应', t: '置换' },
    { r: ['H2SO4', 'Al'], p: ['Al2(SO4)3', 'H2'], c: '', nm: '金属与酸反应', t: '置换' },

    /* 碱 + 非金属氧化物 */
    { r: ['NaOH', 'CO2'], p: ['Na2CO3', 'H2O'], c: '', nm: '吸收二氧化碳', t: '复分解' },
    { r: ['KOH', 'CO2'], p: ['K2CO3', 'H2O'], c: '', nm: '吸收二氧化碳', t: '复分解' },
    { r: ['Ca(OH)2', 'CO2'], p: ['CaCO3', 'H2O'], c: '', nm: '检验二氧化碳', t: '复分解' },
    { r: ['Ba(OH)2', 'CO2'], p: ['BaCO3', 'H2O'], c: '', nm: '吸收二氧化碳', t: '复分解' },
    { r: ['NH3H2O', 'CO2'], p: ['NH4HCO3'], c: '', nm: '氨水吸收二氧化碳', t: '化合' },
    { r: ['NH3H2O', 'CO2'], p: ['(NH4)2CO3', 'H2O'], c: '', nm: '氨水吸收过量二氧化碳', t: '化合' },
    { r: ['NaOH', 'SO2'], p: ['Na2SO3', 'H2O'], c: '', nm: '吸收二氧化硫', t: '复分解' },
    { r: ['Ca(OH)2', 'SO2'], p: ['CaSO3', 'H2O'], c: '', nm: '吸收二氧化硫', t: '复分解' },
    { r: ['NaOH', 'SO3'], p: ['Na2SO4', 'H2O'], c: '', nm: '吸收三氧化硫', t: '复分解' },
    { r: ['NaOH', 'Al2O3'], p: ['NaAlO2', 'H2O'], c: '', nm: '两性氧化物与碱反应', t: '复分解' },
    { r: ['NaOH', 'Al(OH)3'], p: ['NaAlO2', 'H2O'], c: '', nm: '两性氢氧化物与碱反应', t: '复分解' },

    /* 碱 + 盐 */
    { r: ['NaOH', 'CuSO4'], p: ['Cu(OH)2', 'Na2SO4'], c: '', nm: '生成蓝色沉淀', t: '复分解' },
    { r: ['NaOH', 'CuCl2'], p: ['Cu(OH)2', 'NaCl'], c: '', nm: '生成蓝色沉淀', t: '复分解' },
    { r: ['NaOH', 'CuNO32'], p: ['Cu(OH)2', 'NaNO3'], c: '', nm: '生成蓝色沉淀', t: '复分解' },
    { r: ['NaOH', 'FeCl3'], p: ['Fe(OH)3', 'NaCl'], c: '', nm: '生成红褐色沉淀', t: '复分解' },
    { r: ['NaOH', 'FeSO4'], p: ['Fe(OH)2', 'Na2SO4'], c: '', nm: '生成白色沉淀', t: '复分解' },
    { r: ['NaOH', 'MgNO32'], p: ['Mg(OH)2', 'NaNO3'], c: '', nm: '生成白色沉淀', t: '复分解' },
    { r: ['NaOH', 'MgCl2'], p: ['Mg(OH)2', 'NaCl'], c: '', nm: '生成白色沉淀', t: '复分解' },
    { r: ['KOH', 'CuSO4'], p: ['Cu(OH)2', 'K2SO4'], c: '', nm: '生成蓝色沉淀', t: '复分解' },
    { r: ['KOH', 'FeCl3'], p: ['Fe(OH)3', 'KCl'], c: '', nm: '生成红褐色沉淀', t: '复分解' },
    { r: ['Ca(OH)2', 'Na2CO3'], p: ['CaCO3', 'NaOH'], c: '', nm: '工业制烧碱', t: '复分解' },
    { r: ['Ca(OH)2', 'CuSO4'], p: ['Cu(OH)2', 'CaSO4'], c: '', nm: '配制波尔多液', t: '复分解' },
    { r: ['Ba(OH)2', 'Na2SO4'], p: ['BaSO4', 'NaOH'], c: '', nm: '生成硫酸钡沉淀', t: '复分解' },
    { r: ['Ba(OH)2', 'CuSO4'], p: ['BaSO4', 'Cu(OH)2'], c: '', nm: '同时生成两种沉淀', t: '复分解' },
    { r: ['Ba(OH)2', 'Na2CO3'], p: ['BaCO3', 'NaOH'], c: '', nm: '生成碳酸钡沉淀', t: '复分解' },
    { r: ['NH3H2O', 'FeCl3'], p: ['Fe(OH)3', 'NH4Cl'], c: '', nm: '氨水与盐反应', t: '复分解' },
    { r: ['NH3H2O', 'CuSO4'], p: ['Cu(OH)2', '(NH4)2SO4'], c: '', nm: '氨水与盐反应', t: '复分解' },

    /* 盐 + 盐 */
    { r: ['AgNO3', 'NaCl'], p: ['AgCl', 'NaNO3'], c: '', nm: '生成氯化银沉淀', t: '复分解' },
    { r: ['AgNO3', 'CaCl2'], p: ['AgCl', 'Ca(NO3)2'], c: '', nm: '生成氯化银沉淀', t: '复分解' },
    { r: ['AgNO3', 'BaCl2'], p: ['AgCl', 'Ba(NO3)2'], c: '', nm: '生成氯化银沉淀', t: '复分解' },
    { r: ['AgNO3', 'CuCl2'], p: ['AgCl', 'CuNO32'], c: '', nm: '生成氯化银沉淀', t: '复分解' },
    { r: ['AgNO3', 'Na2CO3'], p: ['Ag2CO3', 'NaNO3'], c: '', nm: '生成碳酸银沉淀', t: '复分解' },
    { r: ['AgNO3', 'HCl'], p: ['AgCl', 'HNO3'], c: '', nm: '检验氯离子', t: '复分解' },
    { r: ['BaCl2', 'Na2SO4'], p: ['BaSO4', 'NaCl'], c: '', nm: '生成硫酸钡沉淀', t: '复分解' },
    { r: ['BaCl2', 'CuSO4'], p: ['BaSO4', 'CuCl2'], c: '', nm: '生成硫酸钡沉淀', t: '复分解' },
    { r: ['BaCl2', 'ZnSO4'], p: ['BaSO4', 'ZnCl2'], c: '', nm: '生成硫酸钡沉淀', t: '复分解' },
    { r: ['BaCl2', 'Na2CO3'], p: ['BaCO3', 'NaCl'], c: '', nm: '生成碳酸钡沉淀', t: '复分解' },
    { r: ['BaCl2', 'AgNO3'], p: ['AgCl', 'Ba(NO3)2'], c: '', nm: '生成氯化银沉淀', t: '复分解' },
    { r: ['BaCl2', 'H2SO4'], p: ['BaSO4', 'HCl'], c: '', nm: '检验硫酸根离子', t: '复分解' },
    { r: ['CaCl2', 'Na2CO3'], p: ['CaCO3', 'NaCl'], c: '', nm: '生成碳酸钙沉淀', t: '复分解' },
    { r: ['CaCl2', 'AgNO3'], p: ['AgCl', 'Ca(NO3)2'], c: '', nm: '生成氯化银沉淀', t: '复分解' },
    { r: ['CaCl2', 'Na2SO4'], p: ['CaSO4', 'NaCl'], c: '', nm: '生成微溶的硫酸钙', t: '复分解' },
    { r: ['BaNO32', 'Na2SO4'], p: ['BaSO4', 'NaNO3'], c: '', nm: '生成硫酸钡沉淀', t: '复分解' },
    { r: ['CuSO4', 'Na2CO3'], p: ['Cu2OH2CO3', 'Na2SO4'], c: '', nm: '生成碱式碳酸铜沉淀（铜绿）', t: '复分解' },
    { r: ['CuSO4', 'Zn'], p: ['Cu', 'ZnSO4'], c: '', nm: '湿法炼铜', t: '置换' },
    { r: ['CuCl2', 'Zn'], p: ['Cu', 'ZnCl2'], c: '', nm: '金属置换', t: '置换' },
    { r: ['CuSO4', 'Fe'], p: ['Cu', 'FeSO4'], c: '', nm: '铁与硫酸铜溶液反应', t: '置换' },
    { r: ['CuCl2', 'Fe'], p: ['Cu', 'FeCl2'], c: '', nm: '铁与氯化铜溶液反应', t: '置换' },
    { r: ['AgNO3', 'Cu'], p: ['Ag', 'Cu(NO3)2'], c: '', nm: '铜置换银', t: '置换' },
    { r: ['Ag', 'HNO3'], p: ['AgNO3', 'H2O', 'NO2'], c: '', nm: '银与硝酸反应', t: '氧化还原' },
    { r: ['NH4NO3', 'NaOH'], p: ['NaNO3', 'H2O', 'NH3'], c: '加热', nm: '铵盐与碱反应（检验铵根）', t: '复分解' },
    { r: ['AgNO3', 'Fe'], p: ['Ag', 'Fe(NO3)2'], c: '', nm: '铁置换银', t: '置换' },
    { r: ['AgNO3', 'Zn'], p: ['Ag', 'Zn(NO3)2'], c: '', nm: '锌置换银', t: '置换' },
    { r: ['ZnSO4', 'Mg'], p: ['Zn', 'MgSO4'], c: '', nm: '镁置换锌', t: '置换' },
    { r: ['FeSO4', 'Mg'], p: ['Fe', 'MgSO4'], c: '', nm: '镁置换铁', t: '置换' },
    { r: ['FeCl3', 'Fe'], p: ['FeCl2'], c: '', nm: '铁与氯化铁反应', t: '化合' },
    { r: ['FeCl3', 'Cu'], p: ['FeCl2', 'CuCl2'], c: '', nm: '铜与氯化铁反应', t: '化合' },
    { r: ['Na2CO3', 'CO2'], p: ['NaHCO3'], c: '', nm: '碳酸钠吸收二氧化碳', t: '化合' },
    
    { r: ['NaCl', 'H2O'], p: ['NaOH', 'H2', 'Cl2'], c: '电解', nm: '氯碱工业', t: '氧化还原' },
    { r: ['Na2CO3', 'NH4Cl'], p: ['NaHCO3', 'NaCl', 'NH3'], c: '加热', nm: '碳酸钠与氯化铵反应', t: '复分解' },
    { r: ['Na2CO3', 'Ca(OH)2'], p: ['CaCO3', 'NaOH'], c: '', nm: '苛化法', t: '复分解' },

    /* 金属 + 氧气 */
    { r: ['Fe', 'O2'], p: ['Fe3O4'], c: '点燃', nm: '铁在氧气中燃烧', t: '化合' },
    { r: ['Fe', 'O2', 'H2O'], p: ['Fe(OH)3'], c: '潮湿空气', nm: '铁生锈', t: '化合' },
    { r: ['Cu', 'O2'], p: ['CuO'], c: '加热', nm: '铜在空气中加热', t: '化合' },
    { r: ['Al', 'O2'], p: ['Al2O3'], c: '', nm: '铝表面氧化', t: '化合' },
    { r: ['Mg', 'O2'], p: ['MgO'], c: '点燃', nm: '镁条燃烧', t: '化合' },
    { r: ['Na', 'O2'], p: ['Na2O'], c: '', nm: '钠在空气中氧化', t: '化合' },
    { r: ['Na', 'O2'], p: ['Na2O2'], c: '点燃', nm: '钠在氧气中燃烧', t: '化合' },
    { r: ['Zn', 'O2'], p: ['ZnO'], c: '加热', nm: '锌在空气中氧化', t: '化合' },
    { r: ['K', 'O2'], p: ['KO2'], c: '点燃', nm: '钾在氧气中燃烧', t: '化合' },
    { r: ['C', 'O2'], p: ['CO2'], c: '点燃', nm: '碳充分燃烧', t: '化合' },
    { r: ['C', 'O2'], p: ['CO'], c: '点燃（氧气不足）', nm: '碳不充分燃烧', t: '化合' },
    { r: ['H2', 'O2'], p: ['H2O'], c: '点燃', nm: '氢气燃烧', t: '化合' },
    { r: ['H2', 'Cl2'], p: ['HCl'], c: '点燃', nm: '氢气在氯气中燃烧', t: '化合' },

    /* 单质 + 水 / 碱 */
    { r: ['Na', 'H2O'], p: ['NaOH', 'H2'], c: '', nm: '钠与水剧烈反应', t: '置换' },
    { r: ['K', 'H2O'], p: ['KOH', 'H2'], c: '', nm: '钾与水剧烈反应', t: '置换' },
    { r: ['CaO', 'H2O'], p: ['Ca(OH)2'], c: '', nm: '生石灰与水反应', t: '化合' },
    /* 按需求去除「CO₂ + H₂O → H₂CO₃」：碳酸不稳定，该反应不再收录 */
    { r: ['SO2', 'H2O'], p: ['H2SO3'], c: '', nm: '二氧化硫溶于水', t: '化合' },
    { r: ['SO3', 'H2O'], p: ['H2SO4'], c: '', nm: '三氧化硫与水反应', t: '化合' },
    { r: ['Cl2', 'NaOH'], p: ['NaCl', 'NaClO', 'H2O'], c: '', nm: '氯气与碱反应', t: '歧化' },
    { r: ['Cl2', 'Ca(OH)2'], p: ['Ca(ClO)2', 'CaCl2', 'H2O'], c: '', nm: '工业制漂白粉', t: '歧化' },
    { r: ['Cl2', 'H2O'], p: ['HCl', 'HClO'], c: '', nm: '氯气溶于水', t: '歧化' },

    /* 还原剂 + 金属氧化物 */
    { r: ['CO', 'Fe2O3'], p: ['Fe', 'CO2'], c: '高温', nm: '高炉炼铁', t: '氧化还原' },
    { r: ['CO', 'CuO'], p: ['Cu', 'CO2'], c: '加热', nm: '一氧化碳还原氧化铜', t: '氧化还原' },
    { r: ['H2', 'CuO'], p: ['Cu', 'H2O'], c: '加热', nm: '氢气还原氧化铜', t: '氧化还原' },
    { r: ['H2', 'Fe2O3'], p: ['Fe', 'H2O'], c: '高温', nm: '氢气还原氧化铁', t: '氧化还原' },
    { r: ['C', 'CuO'], p: ['Cu', 'CO2'], c: '高温', nm: '碳还原氧化铜', t: '氧化还原' },
    { r: ['C', 'Fe2O3'], p: ['Fe', 'CO2'], c: '高温', nm: '碳还原氧化铁', t: '氧化还原' },
    { r: ['C', 'CO2'], p: ['CO'], c: '高温', nm: '二氧化碳与碳反应', t: '氧化还原' },
    { r: ['CO', 'O2'], p: ['CO2'], c: '点燃', nm: '一氧化碳燃烧', t: '化合' },
    
    { r: ['Fe', 'H2O'], p: ['Fe3O4', 'H2'], c: '高温', nm: '铁与水蒸气反应', t: '置换' },

    /* 说明：按需求「去除所有分解反应」，此处不再收录任何分解反应
     * （原电解水、碳酸钙高温分解、小苏打受热分解等均已移除；
     *   生成器 tools/gen-reactions.js 也会过滤掉类型为“分解”的反应）。 */

    /* 氨碱法（侯氏制碱法） */
    { r: ['NH3', 'CO2', 'NaCl', 'H2O'], p: ['NaHCO3', 'NH4Cl'], c: '', nm: '氨碱法制碱（侯氏制碱法）', t: '化合' },
    { r: ['NH4HCO3', 'NaCl'], p: ['NaHCO3', 'NH4Cl'], c: '', nm: '侯氏制碱法中间反应', t: '复分解' }
  ];

  REACTIONS.forEach(function (r, i) { r.id = 'rx' + i; });

  /* 生成物中不在物质牌表内的物质，用简易信息补全（仅作展示） */
  var EXTRA_INFO = {
    Na2SO4: { f: 'Na₂SO₄', n: '硫酸钠' }, NaNO3: { f: 'NaNO₃', n: '硝酸钠' },
    KCl: { f: 'KCl', n: '氯化钾' }, K2SO4: { f: 'K₂SO₄', n: '硫酸钾' },
    KNO3: { f: 'KNO₃', n: '硝酸钾' }, CaSO4: { f: 'CaSO₄', n: '硫酸钙' },
    'Ca(NO3)2': { f: 'Ca(NO₃)₂', n: '硝酸钙' }, BaSO4: { f: 'BaSO₄', n: '硫酸钡' },
    'Ba(NO3)2': { f: 'Ba(NO₃)₂', n: '硝酸钡' }, NH4Cl: { f: 'NH₄Cl', n: '氯化铵' },
    '(NH4)2SO4': { f: '(NH₄)₂SO₄', n: '硫酸铵' }, CH3COONa: { f: 'CH₃COONa', n: '醋酸钠' },
    '(CH3COO)2Ca': { f: '(CH₃COO)₂Ca', n: '醋酸钙' }, Na2C2O4: { f: 'Na₂C₂O₄', n: '草酸钠' },
    MgCl2: { f: 'MgCl₂', n: '氯化镁' }, MgSO4: { f: 'MgSO₄', n: '硫酸镁' },
    'Fe2(SO4)3': { f: 'Fe₂(SO₄)₃', n: '硫酸铁' }, 'Fe(NO3)3': { f: 'Fe(NO₃)₃', n: '硝酸铁' },
    AlCl3: { f: 'AlCl₃', n: '氯化铝' }, 'Al2(SO4)3': { f: 'Al₂(SO₄)₃', n: '硫酸铝' },
    'Al(NO3)3': { f: 'Al(NO₃)₃', n: '硝酸铝' }, ZnCl2: { f: 'ZnCl₂', n: '氯化锌' },
    'Zn(NO3)2': { f: 'Zn(NO₃)₂', n: '硝酸锌' }, FeCl2: { f: 'FeCl₂', n: '氯化亚铁' },
    'Fe(NO3)2': { f: 'Fe(NO₃)₂', n: '硝酸亚铁' }, CuCO3: { f: 'CuCO₃', n: '碳酸铜' },
    'Cu(NO3)2': { f: 'Cu(NO₃)₂', n: '硝酸铜' }, 'Cu(NO3)2_': { f: 'Cu(NO₃)₂', n: '硝酸铜' },
    Ag2CO3: { f: 'Ag₂CO₃', n: '碳酸银' }, K2CO3: { f: 'K₂CO₃', n: '碳酸钾' },
    H2CO3: { f: 'H₂CO₃', n: '碳酸' }, H2SO3: { f: 'H₂SO₃', n: '亚硫酸' },
    HClO: { f: 'HClO', n: '次氯酸' }, NaClO: { f: 'NaClO', n: '次氯酸钠' },
    'Ca(ClO)2': { f: 'Ca(ClO)₂', n: '次氯酸钙' }, CaC2O4: { f: 'CaC₂O₄', n: '草酸钙' },
    BaCO3: { f: 'BaCO₃', n: '碳酸钡' }, Na2SO3: { f: 'Na₂SO₃', n: '亚硫酸钠' },
    CaSO3: { f: 'CaSO₃', n: '亚硫酸钙' }, NaAlO2: { f: 'NaAlO₂', n: '偏铝酸钠' },
    'Al(OH)3': { f: 'Al(OH)₃', n: '氢氧化铝' }, MgO: { f: 'MgO', n: '氧化镁' },
    ZnO: { f: 'ZnO', n: '氧化锌' }, Na2O: { f: 'Na₂O', n: '氧化钠' },
    Na2O2: { f: 'Na₂O₂', n: '过氧化钠' }, KO2: { f: 'KO₂', n: '超氧化钾' },
    Fe3O4: { f: 'Fe₃O₄', n: '四氧化三铁' }, 'Fe(OH)2': { f: 'Fe(OH)₂', n: '氢氧化亚铁' },
    BaO: { f: 'BaO', n: '氧化钡' }, AgCl: { f: 'AgCl', n: '氯化银' },
    NO2: { f: 'NO₂', n: '二氧化氮' }, SO2: { f: 'SO₂', n: '二氧化硫' },
    SO3: { f: 'SO₃', n: '三氧化硫' }, NH3: { f: 'NH₃', n: '氨气' },
    '(NH4)2CO3': { f: '(NH₄)₂CO₃', n: '碳酸铵' }
  };

  function label(id) {
    var s = SUB_INDEX[id];
    if (s) return s.f;
    var e = EXTRA_INFO[id];
    if (e) return e.f;
    return id;
  }
  function nameOf(id) {
    var s = SUB_INDEX[id];
    if (s) return s.n;
    var e = EXTRA_INFO[id];
    if (e) return e.n;
    return id;
  }

  /* 反应式文本（系数简化，仅作展示；出牌时不考虑化学计量数） */
  function equation(rx) {
    return rx.r.map(function (id) { return label(id); }).join(' + ') +
      (rx.c ? (' —[' + rx.c + ']→ ') : ' → ') +
      rx.p.map(function (id) { return label(id); }).join(' + ');
  }
  function equationPlain(rx) {
    return rx.r.map(function (id) { return label(id); }).join(' + ') + ' = ' +
      rx.p.map(function (id) { return label(id); }).join(' + ');
  }

  /* 物质牌表内的物质（“任意物质”可代替的范围、“转换”的目标范围） */
  var TABLE_IDS = CARD_IDS.slice();

  var DB = {
    SUBSTANCES: SUBSTANCES,
    CARD_TABLE: CARD_TABLE,
    OFF_TABLE: OFF_TABLE,
    SUB_INDEX: SUB_INDEX,
    TABLE_IDS: TABLE_IDS,
    COUNTS: COUNTS,
    DLC_SUBSTANCE: DLC_SUBSTANCE,
    SPECIALS: SPECIALS,
    PEOPLE: PEOPLE,
    OPS: OPS,
    REACTIONS: REACTIONS,
    CAT_NAME: CAT_NAME,
    CAT_EN: CAT_EN,
    EXTRA_INFO: EXTRA_INFO,
    label: label,
    nameOf: nameOf,
    equation: equation,
    equationPlain: equationPlain
  };

  global.ChemDB = DB;
  if (typeof module !== 'undefined' && module.exports) module.exports = DB;
})(typeof window !== 'undefined' ? window : globalThis);


