/* ============================================================
 * 化学之王 Chemical Combo —— 自动生成的扩充数据
 * 由 tools/gen-reactions.js 生成，请勿手工修改。
 * 物质：205 种新增　反应：2014 条（穷举 2067 条，已滤除冷门组合 0 条）
 * ============================================================ */
(function (global) {
  'use strict';
  var DB = global.ChemDB;

  /* ---------- 统一化学式书写：把普通数字下标换成 Unicode 角标 ---------- */
  var SUBS = { '1': '', '2': '₂', '3': '₃', '4': '₄', '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉' };
  function prettyFormula(f) {
    if (!f) return f;
    // 匹配“元素/右括号 + 一串数字”，但跳过电荷标记 ²⁻ / ³⁺ 之类
    return f.replace(/(.)(\d+)/g, function (m, p, digits) {
      if ('²³⁺⁻'.indexOf(p) >= 0) return m;
      var conv = '';
      for (var k = 0; k < digits.length; k++) conv += (SUBS[digits[k]] === undefined ? digits[k] : SUBS[digits[k]]);
      return p + conv;
    });
  }
  function prettyLabel(id) { return prettyFormula(DB.label(id)); }
  DB.prettyFormula = prettyFormula;
  DB.equationOf = function (rx) {
    return rx.r.map(prettyLabel).join(' + ') + (rx.c ? (' —[' + rx.c + ']→ ') : ' → ') + rx.p.map(prettyLabel).join(' + ');
  };
  DB.equationPlainOf = function (rx) {
    return rx.r.map(prettyLabel).join(' + ') + ' = ' + rx.p.map(prettyLabel).join(' + ');
  };
  var bi, brx;
  for (bi = 0; bi < DB.SUBSTANCES.length; bi++) {
    DB.SUBSTANCES[bi].f = prettyFormula(DB.SUBSTANCES[bi].f);
  }
  for (bi = 0; bi < DB.CARD_TABLE.length; bi++) {
    DB.CARD_TABLE[bi].f = prettyFormula(DB.CARD_TABLE[bi].f);
  }

  /* ---------- 覆盖取标签 / 方程式的函数，全部走统一格式 ---------- */
  DB.label = function (id) {
    var s = DB.SUB_INDEX[id];
    if (s) return s.f;
    var e = DB.EXTRA_INFO[id];
    if (e) return prettyFormula(e.f);
    return id;
  };
  DB.equation = function (rx) { return DB.equationOf(rx); };
  DB.equationPlain = function (rx) { return DB.equationPlainOf(rx); };

  /* ---------- 新增物质 ---------- */
  var SUBSTANCES = [
    {
      "id": "NO",
      "f": "NO",
      "n": "一氧化氮",
      "cat": "Oe",
      "st": "g",
      "sol": "n",
      "el": [
        "N",
        "O"
      ],
      "note": "无色气体，难溶于水，易被氧化为 NO₂"
    },
    {
      "id": "NO2",
      "f": "NO₂",
      "n": "二氧化氮",
      "cat": "Oe",
      "st": "g",
      "sol": "y",
      "el": [
        "N",
        "O"
      ],
      "note": "红棕色有刺激性气味的气体，与水反应生成硝酸和 NO"
    },
    {
      "id": "SiO2",
      "f": "SiO₂",
      "n": "二氧化硅",
      "cat": "Oe",
      "st": "s",
      "sol": "n",
      "el": [
        "Si",
        "O"
      ],
      "note": "沙子、石英的主要成分，与氢氟酸、强碱反应"
    },
    {
      "id": "P2O5",
      "f": "P₂O₅",
      "n": "五氧化二磷",
      "cat": "Oe",
      "st": "s",
      "sol": "x",
      "el": [
        "P",
        "O"
      ],
      "note": "白色固体，强吸水性"
    },
    {
      "id": "ZnO",
      "f": "ZnO",
      "n": "氧化锌",
      "cat": "Oe",
      "st": "s",
      "sol": "n",
      "el": [
        "Zn",
        "O"
      ],
      "note": "白色固体，两性氧化物"
    },
    {
      "id": "H2S",
      "f": "H₂S",
      "n": "氢硫酸",
      "cat": "Ad",
      "st": "l",
      "sol": "y",
      "el": [
        "H",
        "S"
      ],
      "vol": true,
      "note": "硫化氢的水溶液，弱酸，有臭鸡蛋气味"
    },
    {
      "id": "H2SO3",
      "f": "H₂SO₃",
      "n": "亚硫酸",
      "cat": "Ad",
      "st": "l",
      "sol": "y",
      "el": [
        "H",
        "S",
        "O"
      ],
      "note": "弱酸，不稳定，易分解为 SO₂ 和 H₂O"
    },
    {
      "id": "H2SiO3",
      "f": "H₂SiO₃",
      "n": "硅酸",
      "cat": "Ad",
      "st": "s",
      "sol": "n",
      "el": [
        "H",
        "Si",
        "O"
      ],
      "note": "白色胶状沉淀，弱酸"
    },
    {
      "id": "H3PO4",
      "f": "H₃PO₄",
      "n": "磷酸",
      "cat": "Ad",
      "st": "l",
      "sol": "y",
      "el": [
        "H",
        "P",
        "O"
      ],
      "note": "中强酸"
    },
    {
      "id": "HClO",
      "f": "HClO",
      "n": "次氯酸",
      "cat": "Ad",
      "st": "l",
      "sol": "y",
      "el": [
        "H",
        "Cl",
        "O"
      ],
      "note": "弱酸，有强氧化性和漂白性，见光分解"
    },
    {
      "id": "HBr",
      "f": "HBr",
      "n": "氢溴酸",
      "cat": "Ad",
      "st": "l",
      "sol": "y",
      "el": [
        "H",
        "Br"
      ],
      "vol": true,
      "note": "强酸"
    },
    {
      "id": "HI",
      "f": "HI",
      "n": "氢碘酸",
      "cat": "Ad",
      "st": "l",
      "sol": "y",
      "el": [
        "H",
        "I"
      ],
      "vol": true,
      "note": "强酸，有还原性"
    },
    {
      "id": "FeOH2",
      "f": "Fe(OH)₂",
      "n": "氢氧化亚铁",
      "cat": "Be",
      "st": "s",
      "sol": "n",
      "el": [
        "Fe",
        "O",
        "H"
      ],
      "note": "白色沉淀，很快被氧化为红褐色"
    },
    {
      "id": "ZnOH2",
      "f": "Zn(OH)₂",
      "n": "氢氧化锌",
      "cat": "Be",
      "st": "s",
      "sol": "n",
      "el": [
        "Zn",
        "O",
        "H"
      ],
      "note": "白色沉淀，两性"
    },
    {
      "id": "FeNO33",
      "f": "Fe(NO₃)₃",
      "n": "硝酸铁",
      "cat": "St",
      "st": "s",
      "sol": "y",
      "el": [
        "Fe",
        "N",
        "O"
      ],
      "dec": true,
      "note": "受热分解"
    },
    {
      "id": "Fe2SO43",
      "f": "Fe₂(SO₄)₃",
      "n": "硫酸铁",
      "cat": "St",
      "st": "s",
      "sol": "y",
      "el": [
        "Fe",
        "S",
        "O"
      ],
      "note": ""
    },
    {
      "id": "FeCl2",
      "f": "FeCl₂",
      "n": "氯化亚铁",
      "cat": "St",
      "st": "s",
      "sol": "y",
      "el": [
        "Fe",
        "Cl"
      ],
      "note": "浅绿色溶液"
    },
    {
      "id": "FeNO32",
      "f": "Fe(NO₃)₂",
      "n": "硝酸亚铁",
      "cat": "St",
      "st": "s",
      "sol": "y",
      "el": [
        "Fe",
        "N",
        "O"
      ],
      "note": ""
    },
    {
      "id": "AlCl3",
      "f": "AlCl₃",
      "n": "氯化铝",
      "cat": "St",
      "st": "s",
      "sol": "y",
      "el": [
        "Al",
        "Cl"
      ],
      "note": ""
    },
    {
      "id": "Al2SO43",
      "f": "Al₂(SO₄)₃",
      "n": "硫酸铝",
      "cat": "St",
      "st": "s",
      "sol": "y",
      "el": [
        "Al",
        "S",
        "O"
      ],
      "note": ""
    },
    {
      "id": "AlNO33",
      "f": "Al(NO₃)₃",
      "n": "硝酸铝",
      "cat": "St",
      "st": "s",
      "sol": "y",
      "el": [
        "Al",
        "N",
        "O"
      ],
      "dec": true,
      "note": "受热分解"
    },
    {
      "id": "ZnCl2",
      "f": "ZnCl₂",
      "n": "氯化锌",
      "cat": "St",
      "st": "s",
      "sol": "y",
      "el": [
        "Zn",
        "Cl"
      ],
      "note": ""
    },
    {
      "id": "ZnNO32",
      "f": "Zn(NO₃)₂",
      "n": "硝酸锌",
      "cat": "St",
      "st": "s",
      "sol": "y",
      "el": [
        "Zn",
        "N",
        "O"
      ],
      "dec": true,
      "note": "受热分解"
    },
    {
      "id": "KCl",
      "f": "KCl",
      "n": "氯化钾",
      "cat": "St",
      "st": "s",
      "sol": "y",
      "el": [
        "K",
        "Cl"
      ],
      "note": "常见钾肥"
    },
    {
      "id": "K2SO4",
      "f": "K₂SO₄",
      "n": "硫酸钾",
      "cat": "St",
      "st": "s",
      "sol": "y",
      "el": [
        "K",
        "S",
        "O"
      ],
      "note": "钾肥"
    },
    {
      "id": "KNO3",
      "f": "KNO₃",
      "n": "硝酸钾",
      "cat": "St",
      "st": "s",
      "sol": "y",
      "el": [
        "K",
        "N",
        "O"
      ],
      "dec": true,
      "note": "受热分解，黑火药成分"
    },
    {
      "id": "K2CO3",
      "f": "K₂CO₃",
      "n": "碳酸钾",
      "cat": "St",
      "st": "s",
      "sol": "y",
      "el": [
        "K",
        "C",
        "O"
      ],
      "note": "草木灰的主要成分"
    },
    {
      "id": "KMnO4",
      "f": "KMnO₄",
      "n": "高锰酸钾",
      "cat": "St",
      "st": "s",
      "sol": "y",
      "el": [
        "K",
        "Mn",
        "O"
      ],
      "dec": true,
      "note": "紫黑色晶体，强氧化剂"
    },
    {
      "id": "NaNO3",
      "f": "NaNO₃",
      "n": "硝酸钠",
      "cat": "St",
      "st": "s",
      "sol": "y",
      "el": [
        "Na",
        "N",
        "O"
      ],
      "note": ""
    },
    {
      "id": "Na2S",
      "f": "Na₂S",
      "n": "硫化钠",
      "cat": "St",
      "st": "s",
      "sol": "y",
      "el": [
        "Na",
        "S"
      ],
      "note": "水解显碱性"
    },
    {
      "id": "Na2SO3",
      "f": "Na₂SO₃",
      "n": "亚硫酸钠",
      "cat": "St",
      "st": "s",
      "sol": "y",
      "el": [
        "Na",
        "S",
        "O"
      ],
      "note": "有还原性"
    },
    {
      "id": "NaClO",
      "f": "NaClO",
      "n": "次氯酸钠",
      "cat": "St",
      "st": "s",
      "sol": "y",
      "el": [
        "Na",
        "Cl",
        "O"
      ],
      "note": "漂白液的有效成分"
    },
    {
      "id": "Na2SiO3",
      "f": "Na₂SiO₃",
      "n": "硅酸钠",
      "cat": "St",
      "st": "s",
      "sol": "y",
      "el": [
        "Na",
        "Si",
        "O"
      ],
      "note": "水玻璃，矿物胶"
    },
    {
      "id": "NaAlO2",
      "f": "NaAlO₂",
      "n": "偏铝酸钠",
      "cat": "St",
      "st": "s",
      "sol": "y",
      "el": [
        "Na",
        "Al",
        "O"
      ],
      "note": ""
    },
    {
      "id": "Na3PO4",
      "f": "Na₃PO₄",
      "n": "磷酸钠",
      "cat": "St",
      "st": "s",
      "sol": "y",
      "el": [
        "Na",
        "P",
        "O"
      ],
      "note": ""
    },
    {
      "id": "NaBr",
      "f": "NaBr",
      "n": "溴化钠",
      "cat": "St",
      "st": "s",
      "sol": "y",
      "el": [
        "Na",
        "Br"
      ],
      "note": ""
    },
    {
      "id": "NaI",
      "f": "NaI",
      "n": "碘化钠",
      "cat": "St",
      "st": "s",
      "sol": "y",
      "el": [
        "Na",
        "I"
      ],
      "note": ""
    },
    {
      "id": "CaNO32",
      "f": "Ca(NO₃)₂",
      "n": "硝酸钙",
      "cat": "St",
      "st": "s",
      "sol": "y",
      "el": [
        "Ca",
        "N",
        "O"
      ],
      "note": "可作氮肥"
    },
    {
      "id": "MgCO3",
      "f": "MgCO₃",
      "n": "碳酸镁",
      "cat": "St",
      "st": "s",
      "sol": "n",
      "el": [
        "Mg",
        "C",
        "O"
      ],
      "note": "白色沉淀"
    },
    {
      "id": "ZnCO3",
      "f": "ZnCO₃",
      "n": "碳酸锌",
      "cat": "St",
      "st": "s",
      "sol": "n",
      "el": [
        "Zn",
        "C",
        "O"
      ],
      "note": "白色沉淀"
    },
    {
      "id": "Ag2SO4",
      "f": "Ag₂SO₄",
      "n": "硫酸银",
      "cat": "St",
      "st": "s",
      "sol": "m",
      "el": [
        "Ag",
        "S",
        "O"
      ],
      "note": "微溶"
    },
    {
      "id": "Ag2CO3",
      "f": "Ag₂CO₃",
      "n": "碳酸银",
      "cat": "St",
      "st": "s",
      "sol": "n",
      "el": [
        "Ag",
        "C",
        "O"
      ],
      "note": "淡黄色沉淀"
    },
    {
      "id": "AgBr",
      "f": "AgBr",
      "n": "溴化银",
      "cat": "St",
      "st": "s",
      "sol": "n",
      "el": [
        "Ag",
        "Br"
      ],
      "note": "淡黄色沉淀，感光材料"
    },
    {
      "id": "AgI",
      "f": "AgI",
      "n": "碘化银",
      "cat": "St",
      "st": "s",
      "sol": "n",
      "el": [
        "Ag",
        "I"
      ],
      "note": "黄色沉淀，用于人工降雨"
    },
    {
      "id": "CuS",
      "f": "CuS",
      "n": "硫化铜",
      "cat": "St",
      "st": "s",
      "sol": "n",
      "el": [
        "Cu",
        "S"
      ],
      "note": "黑色沉淀"
    },
    {
      "id": "FeS",
      "f": "FeS",
      "n": "硫化亚铁",
      "cat": "St",
      "st": "s",
      "sol": "n",
      "el": [
        "Fe",
        "S"
      ],
      "note": "黑色固体，与酸反应生成 H₂S"
    },
    {
      "id": "NH42SO4",
      "f": "(NH₄)₂SO₄",
      "n": "硫酸铵",
      "cat": "St",
      "st": "s",
      "sol": "y",
      "el": [
        "N",
        "H",
        "S",
        "O"
      ],
      "note": "常见氮肥"
    },
    {
      "id": "NH42CO3",
      "f": "(NH₄)₂CO₃",
      "n": "碳酸铵",
      "cat": "St",
      "st": "s",
      "sol": "y",
      "el": [
        "N",
        "H",
        "C",
        "O"
      ],
      "note": "受热分解"
    },
    {
      "id": "CaC2O4",
      "f": "CaC₂O₄",
      "n": "草酸钙",
      "cat": "St",
      "st": "s",
      "sol": "n",
      "el": [
        "Ca",
        "C",
        "O"
      ],
      "note": "白色沉淀，难溶于水"
    },
    {
      "id": "BaSO3",
      "f": "BaSO₃",
      "n": "亚硫酸钡",
      "cat": "St",
      "st": "s",
      "sol": "n",
      "el": [
        "Ba",
        "S",
        "O"
      ],
      "note": "白色沉淀，溶于酸"
    },
    {
      "id": "Ba3PO42",
      "f": "Ba₃(PO₄)₂",
      "n": "磷酸钡",
      "cat": "St",
      "st": "s",
      "sol": "n",
      "el": [
        "Ba",
        "P",
        "O"
      ],
      "note": "白色沉淀"
    },
    {
      "id": "Ca3PO42",
      "f": "Ca₃(PO₄)₂",
      "n": "磷酸钙",
      "cat": "St",
      "st": "s",
      "sol": "n",
      "el": [
        "Ca",
        "P",
        "O"
      ],
      "note": "白色沉淀，骨骼主要成分"
    },
    {
      "id": "Mg3N2",
      "f": "Mg₃N₂",
      "n": "氮化镁",
      "cat": "St",
      "st": "s",
      "sol": "x",
      "el": [
        "Mg",
        "N"
      ],
      "note": "黄绿色固体，与水反应生成氨气"
    },
    {
      "id": "N2",
      "f": "N₂",
      "n": "氮气",
      "cat": "Es",
      "st": "g",
      "sol": "n",
      "el": [
        "N"
      ],
      "note": "空气的主要成分，性质稳定"
    },
    {
      "id": "S",
      "f": "S",
      "n": "硫",
      "cat": "Es",
      "st": "s",
      "sol": "n",
      "el": [
        "S"
      ],
      "note": "淡黄色固体，燃烧发出蓝紫色火焰"
    },
    {
      "id": "P",
      "f": "P",
      "n": "红磷",
      "cat": "Es",
      "st": "s",
      "sol": "n",
      "el": [
        "P"
      ],
      "note": "红棕色固体，燃烧生成大量白烟"
    },
    {
      "id": "Si",
      "f": "Si",
      "n": "硅",
      "cat": "Es",
      "st": "s",
      "sol": "n",
      "el": [
        "Si"
      ],
      "note": "半导体材料"
    },
    {
      "id": "Br2",
      "f": "Br₂",
      "n": "溴",
      "cat": "Es",
      "st": "l",
      "sol": "m",
      "el": [
        "Br"
      ],
      "note": "深红棕色液体，易挥发"
    },
    {
      "id": "I2",
      "f": "I₂",
      "n": "碘",
      "cat": "Es",
      "st": "s",
      "sol": "n",
      "el": [
        "I"
      ],
      "note": "紫黑色固体，升华产生紫色蒸气"
    },
    {
      "id": "Hg",
      "f": "Hg",
      "n": "汞",
      "cat": "Es",
      "st": "l",
      "sol": "n",
      "el": [
        "Hg"
      ],
      "note": "常温下唯一液态金属"
    },
    {
      "id": "CH3COONa",
      "f": "CH₃COONa",
      "n": "醋酸钠",
      "cat": "St",
      "st": "s",
      "sol": "y",
      "el": [
        "C",
        "H",
        "O",
        "Na"
      ],
      "note": "强碱弱酸盐，水解显碱性"
    },
    {
      "id": "CH3COO2Ca",
      "f": "(CH₃COO)₂Ca",
      "n": "醋酸钙",
      "cat": "St",
      "st": "s",
      "sol": "y",
      "el": [
        "C",
        "H",
        "O",
        "Ca"
      ],
      "note": ""
    },
    {
      "id": "Na2C2O4",
      "f": "Na₂C₂O₄",
      "n": "草酸钠",
      "cat": "St",
      "st": "s",
      "sol": "y",
      "el": [
        "Na",
        "C",
        "O"
      ],
      "note": ""
    },
    {
      "id": "Ag3PO4",
      "f": "Ag₃PO₄",
      "n": "磷酸银",
      "cat": "St",
      "st": "s",
      "sol": "n",
      "el": [
        "Ag",
        "P",
        "O"
      ],
      "note": "黄色沉淀"
    },
    {
      "id": "Ag2S",
      "f": "Ag₂S",
      "n": "硫化银",
      "cat": "St",
      "st": "s",
      "sol": "n",
      "el": [
        "Ag",
        "S"
      ],
      "note": "黑色沉淀，难溶于酸"
    },
    {
      "id": "Ca(ClO)2",
      "f": "Ca(ClO)₂",
      "n": "次氯酸钙",
      "cat": "St",
      "st": "s",
      "sol": "y",
      "el": [
        "Ca",
        "Cl",
        "O"
      ],
      "note": "漂白粉的有效成分"
    },
    {
      "id": "HgO",
      "f": "HgO",
      "n": "氧化汞",
      "cat": "Oe",
      "st": "s",
      "sol": "n",
      "el": [
        "Hg",
        "O"
      ],
      "note": "红色固体，受热分解"
    },
    {
      "id": "CaHCO32",
      "f": "Ca(HCO₃)₂",
      "n": "碳酸氢钙",
      "cat": "St",
      "st": "s",
      "sol": "y",
      "el": [
        "Ca",
        "H",
        "C",
        "O"
      ],
      "note": "只存在于溶液中，受热分解"
    },
    {
      "id": "MgHCO32",
      "f": "Mg(HCO₃)₂",
      "n": "碳酸氢镁",
      "cat": "St",
      "st": "s",
      "sol": "y",
      "el": [
        "Mg",
        "H",
        "C",
        "O"
      ],
      "note": "只存在于溶液中"
    },
    {
      "id": "BaHCO32",
      "f": "Ba(HCO₃)₂",
      "n": "碳酸氢钡",
      "cat": "St",
      "st": "s",
      "sol": "y",
      "el": [
        "Ba",
        "H",
        "C",
        "O"
      ],
      "note": "可溶"
    },
    {
      "id": "CH3COO2Mg",
      "f": "(CH₃COO)₂Mg",
      "n": "醋酸镁",
      "cat": "St",
      "st": "s",
      "sol": "y",
      "el": [
        "C",
        "H",
        "O",
        "Mg"
      ],
      "note": ""
    },
    {
      "id": "CH3COOK",
      "f": "CH₃COOK",
      "n": "醋酸钾",
      "cat": "St",
      "st": "s",
      "sol": "y",
      "el": [
        "C",
        "H",
        "O",
        "K"
      ],
      "note": ""
    },
    {
      "id": "CH3COO2Fe",
      "f": "(CH₃COO)₂Fe",
      "n": "醋酸亚铁",
      "cat": "St",
      "st": "s",
      "sol": "y",
      "el": [
        "C",
        "H",
        "O",
        "Fe"
      ],
      "note": ""
    },
    {
      "id": "SiF4",
      "f": "SiF₄",
      "n": "四氟化硅",
      "cat": "Oe",
      "st": "g",
      "sol": "x",
      "el": [
        "Si",
        "F"
      ],
      "note": "氢氟酸腐蚀玻璃的产物"
    },
    {
      "id": "CaC2",
      "f": "CaC₂",
      "n": "碳化钙",
      "cat": "St",
      "st": "s",
      "sol": "x",
      "el": [
        "Ca",
        "C"
      ],
      "note": "俗称电石，与水反应生成乙炔"
    },
    {
      "id": "C2H2",
      "f": "C₂H₂",
      "n": "乙炔",
      "cat": "Oe",
      "st": "g",
      "sol": "m",
      "el": [
        "C",
        "H"
      ],
      "note": "可燃气体，氧炔焰用于焊接"
    },
    {
      "id": "Cu2OH2CO3",
      "f": "Cu₂(OH)₂CO₃",
      "n": "碱式碳酸铜",
      "cat": "St",
      "st": "s",
      "sol": "n",
      "el": [
        "Cu",
        "O",
        "H",
        "C"
      ],
      "note": "铜生锈的产物，俗称铜绿"
    },
    {
      "id": "P",
      "f": "P",
      "n": "红磷",
      "cat": "Es",
      "st": "s",
      "sol": "n",
      "el": [
        "P"
      ],
      "note": "红棕色固体，燃烧生成大量白烟"
    },
    {
      "id": "P2O5",
      "f": "P₂O₅",
      "n": "五氧化二磷",
      "cat": "Oe",
      "st": "s",
      "sol": "x",
      "el": [
        "P",
        "O"
      ],
      "note": "白色固体，强吸水性"
    },
    {
      "id": "Si",
      "f": "Si",
      "n": "硅",
      "cat": "Es",
      "st": "s",
      "sol": "n",
      "el": [
        "Si"
      ],
      "note": "半导体材料"
    },
    {
      "id": "SiO2",
      "f": "SiO₂",
      "n": "二氧化硅",
      "cat": "Oe",
      "st": "s",
      "sol": "n",
      "el": [
        "Si",
        "O"
      ],
      "note": "沙子、石英的主要成分"
    },
    {
      "id": "Br2",
      "f": "Br₂",
      "n": "溴",
      "cat": "Es",
      "st": "l",
      "sol": "m",
      "el": [
        "Br"
      ],
      "note": "深红棕色液体，易挥发"
    },
    {
      "id": "I2",
      "f": "I₂",
      "n": "碘",
      "cat": "Es",
      "st": "s",
      "sol": "n",
      "el": [
        "I"
      ],
      "note": "紫黑色固体，升华产生紫色蒸气"
    },
    {
      "id": "KMnO4",
      "f": "KMnO₄",
      "n": "高锰酸钾",
      "cat": "St",
      "st": "s",
      "sol": "y",
      "el": [
        "K",
        "Mn",
        "O"
      ],
      "dec": true,
      "note": "紫黑色晶体，强氧化剂"
    },
    {
      "id": "Hg",
      "f": "Hg",
      "n": "汞",
      "cat": "Es",
      "st": "l",
      "sol": "n",
      "el": [
        "Hg"
      ],
      "note": "常温下唯一液态金属"
    },
    {
      "id": "HgO",
      "f": "HgO",
      "n": "氧化汞",
      "cat": "Oe",
      "st": "s",
      "sol": "n",
      "el": [
        "Hg",
        "O"
      ],
      "note": "红色固体，受热分解"
    },
    {
      "id": "SiF4",
      "f": "SiF₄",
      "n": "四氟化硅",
      "cat": "Oe",
      "st": "g",
      "sol": "x",
      "el": [
        "Si",
        "F"
      ],
      "note": "氢氟酸腐蚀玻璃的产物"
    },
    {
      "id": "CaC2",
      "f": "CaC₂",
      "n": "碳化钙",
      "cat": "St",
      "st": "s",
      "sol": "x",
      "el": [
        "Ca",
        "C"
      ],
      "note": "俗称电石，与水反应生成乙炔"
    },
    {
      "id": "C2H2",
      "f": "C₂H₂",
      "n": "乙炔",
      "cat": "Oe",
      "st": "g",
      "sol": "m",
      "el": [
        "C",
        "H"
      ],
      "note": "可燃气体，氧炔焰用于焊接"
    },
    {
      "id": "Ag3PO4",
      "f": "Ag₃PO₄",
      "n": "磷酸银",
      "cat": "St",
      "st": "s",
      "sol": "n",
      "el": [
        "Ag",
        "P",
        "O"
      ],
      "note": "黄色沉淀"
    },
    {
      "id": "Ag2S",
      "f": "Ag₂S",
      "n": "硫化银",
      "cat": "St",
      "st": "s",
      "sol": "n",
      "el": [
        "Ag",
        "S"
      ],
      "note": "黑色沉淀，难溶于酸"
    },
    {
      "id": "CH4",
      "f": "CH₄",
      "n": "甲烷",
      "cat": "Oe",
      "st": "g",
      "sol": "n",
      "el": [
        "C",
        "H"
      ],
      "note": "最简单的有机物，天然气主要成分"
    },
    {
      "id": "C2H5OH",
      "f": "C₂H₅OH",
      "n": "乙醇",
      "cat": "Oe",
      "st": "l",
      "sol": "y",
      "el": [
        "C",
        "H",
        "O"
      ],
      "note": "酒精，可作燃料"
    },
    {
      "id": "Na2ZnO2",
      "f": "Na₂ZnO₂",
      "n": "锌酸钠",
      "cat": "St",
      "st": "s",
      "sol": "y",
      "el": [
        "Na",
        "Zn",
        "O"
      ],
      "note": "氢氧化锌溶于强碱的产物"
    },
    {
      "id": "NaNO2",
      "f": "NaNO₂",
      "n": "亚硝酸钠",
      "cat": "St",
      "st": "s",
      "sol": "y",
      "el": [
        "Na",
        "N",
        "O"
      ],
      "note": "白色固体，有氧化性"
    },
    {
      "id": "NH4HSO3",
      "f": "NH₄HSO₃",
      "n": "亚硫酸氢铵",
      "cat": "St",
      "st": "s",
      "sol": "y",
      "el": [
        "N",
        "H",
        "S",
        "O"
      ],
      "note": "氨水吸收过量二氧化硫的产物"
    },
    {
      "id": "CaF2",
      "f": "CaF₂",
      "n": "氟化钙",
      "cat": "St",
      "st": "s",
      "sol": "n",
      "el": [
        "Ca",
        "F"
      ],
      "note": "萤石的主要成分，难溶于水"
    },
    {
      "id": "AgF",
      "f": "AgF",
      "n": "氟化银",
      "cat": "St",
      "st": "s",
      "sol": "y",
      "el": [
        "Ag",
        "F"
      ],
      "note": "可溶性银盐"
    },
    {
      "id": "BaC2O4",
      "f": "BaC₂O₄",
      "n": "草酸钡",
      "cat": "St",
      "st": "s",
      "sol": "n",
      "el": [
        "Ba",
        "C",
        "O"
      ],
      "note": "白色沉淀"
    },
    {
      "id": "K2C2O4",
      "f": "K₂C₂O₄",
      "n": "草酸钾",
      "cat": "St",
      "st": "s",
      "sol": "y",
      "el": [
        "K",
        "C",
        "O"
      ],
      "note": ""
    },
    {
      "id": "MnC2O4",
      "f": "MnC₂O₄",
      "n": "草酸锰",
      "cat": "St",
      "st": "s",
      "sol": "n",
      "el": [
        "Mn",
        "C",
        "O"
      ],
      "note": "浅粉色沉淀"
    },
    {
      "id": "CH3COO2Fe",
      "f": "(CH₃COO)₂Fe",
      "n": "醋酸亚铁",
      "cat": "St",
      "st": "s",
      "sol": "y",
      "el": [
        "C",
        "H",
        "O",
        "Fe"
      ],
      "note": ""
    },
    {
      "id": "m_NH4_SO4",
      "f": "NH₄₂SO₄",
      "n": "硫酸铵",
      "cat": "St",
      "st": "s",
      "sol": "y",
      "el": [
        "N",
        "H",
        "S",
        "O"
      ],
      "note": ""
    },
    {
      "id": "m_NH4_S",
      "f": "NH₄₂S",
      "n": "硫化铵",
      "cat": "St",
      "st": "s",
      "sol": "y",
      "el": [
        "N",
        "H",
        "S"
      ],
      "note": ""
    },
    {
      "id": "m_NH4_SO3",
      "f": "NH₄₂SO₃",
      "n": "亚硫酸铵",
      "cat": "St",
      "st": "s",
      "sol": "y",
      "el": [
        "N",
        "H",
        "S",
        "O"
      ],
      "note": ""
    },
    {
      "id": "m_NH4_F",
      "f": "NH₄F",
      "n": "氟化铵",
      "cat": "St",
      "st": "s",
      "sol": "y",
      "el": [
        "N",
        "H",
        "F"
      ],
      "note": ""
    },
    {
      "id": "m_NH4_CH3COO",
      "f": "NH₄CH₃COO",
      "n": "醋酸铵",
      "cat": "St",
      "st": "s",
      "sol": "y",
      "el": [
        "N",
        "H",
        "C",
        "O"
      ],
      "note": ""
    },
    {
      "id": "m_NH4_C2O4",
      "f": "NH₄₂C₂O₄",
      "n": "草酸铵",
      "cat": "St",
      "st": "s",
      "sol": "y",
      "el": [
        "N",
        "H",
        "C",
        "O"
      ],
      "note": ""
    },
    {
      "id": "m_NH4_CO3",
      "f": "NH₄₂CO₃",
      "n": "碳酸铵",
      "cat": "St",
      "st": "s",
      "sol": "y",
      "el": [
        "N",
        "H",
        "C",
        "O"
      ],
      "note": ""
    },
    {
      "id": "m_Ba_F",
      "f": "BaF₂",
      "n": "氟化钡",
      "cat": "St",
      "st": "s",
      "sol": "n",
      "el": [
        "Ba",
        "F"
      ],
      "note": "难溶（沉淀）"
    },
    {
      "id": "m_Mg_F",
      "f": "MgF₂",
      "n": "氟化镁",
      "cat": "St",
      "st": "s",
      "sol": "n",
      "el": [
        "Mg",
        "F"
      ],
      "note": "难溶（沉淀）"
    },
    {
      "id": "m_K_HCO3",
      "f": "KHCO₃",
      "n": "碳酸氢钾",
      "cat": "St",
      "st": "s",
      "sol": "y",
      "el": [
        "K",
        "H",
        "C",
        "O"
      ],
      "note": ""
    },
    {
      "id": "m_K_F",
      "f": "KF",
      "n": "氟化钾",
      "cat": "St",
      "st": "s",
      "sol": "y",
      "el": [
        "K",
        "F"
      ],
      "note": ""
    },
    {
      "id": "m_Zn_F",
      "f": "ZnF₂",
      "n": "氟化锌",
      "cat": "St",
      "st": "s",
      "sol": "n",
      "el": [
        "Zn",
        "F"
      ],
      "note": "难溶（沉淀）"
    },
    {
      "id": "m_Fe2_F",
      "f": "FeF₂",
      "n": "氟化亚铁",
      "cat": "St",
      "st": "s",
      "sol": "n",
      "el": [
        "Fe",
        "F"
      ],
      "note": "难溶（沉淀）"
    },
    {
      "id": "m_Fe3_F",
      "f": "FeF₃",
      "n": "氟化铁",
      "cat": "St",
      "st": "s",
      "sol": "n",
      "el": [
        "Fe",
        "F"
      ],
      "note": "难溶（沉淀）"
    },
    {
      "id": "m_Cu_F",
      "f": "CuF₂",
      "n": "氟化铜",
      "cat": "St",
      "st": "s",
      "sol": "n",
      "el": [
        "Cu",
        "F"
      ],
      "note": "难溶（沉淀）"
    },
    {
      "id": "m_NH4_ClO",
      "f": "NH₄ClO",
      "n": "次氯酸铵",
      "cat": "St",
      "st": "s",
      "sol": "y",
      "el": [
        "N",
        "H",
        "Cl",
        "O"
      ],
      "note": ""
    },
    {
      "id": "m_Ba_CH3COO",
      "f": "(CH₃COO)₂Ba",
      "n": "醋酸钡",
      "cat": "St",
      "st": "s",
      "sol": "y",
      "el": [
        "Ba",
        "C",
        "H",
        "O"
      ],
      "note": ""
    },
    {
      "id": "m_Mg_C2O4",
      "f": "MgC₂O₄",
      "n": "草酸镁",
      "cat": "St",
      "st": "s",
      "sol": "y",
      "el": [
        "Mg",
        "C",
        "O"
      ],
      "note": ""
    },
    {
      "id": "m_Zn_C2O4",
      "f": "ZnC₂O₄",
      "n": "草酸锌",
      "cat": "St",
      "st": "s",
      "sol": "n",
      "el": [
        "Zn",
        "C",
        "O"
      ],
      "note": "难溶（沉淀）"
    },
    {
      "id": "m_Cu_C2O4",
      "f": "CuC₂O₄",
      "n": "草酸铜",
      "cat": "St",
      "st": "s",
      "sol": "n",
      "el": [
        "Cu",
        "C",
        "O"
      ],
      "note": "难溶（沉淀）"
    },
    {
      "id": "m_Ag_C2O4",
      "f": "Ag₂C₂O₄",
      "n": "草酸银",
      "cat": "St",
      "st": "s",
      "sol": "n",
      "el": [
        "Ag",
        "C",
        "O"
      ],
      "note": "难溶（沉淀）"
    },
    {
      "id": "m_NH4_PO4",
      "f": "NH₄₃PO₄",
      "n": "磷酸铵",
      "cat": "St",
      "st": "s",
      "sol": "y",
      "el": [
        "N",
        "H",
        "P",
        "O"
      ],
      "note": ""
    },
    {
      "id": "m_NH4_Br",
      "f": "NH₄Br",
      "n": "溴化铵",
      "cat": "St",
      "st": "s",
      "sol": "y",
      "el": [
        "N",
        "H",
        "Br"
      ],
      "note": ""
    },
    {
      "id": "m_NH4_I",
      "f": "NH₄I",
      "n": "碘化铵",
      "cat": "St",
      "st": "s",
      "sol": "y",
      "el": [
        "N",
        "H",
        "I"
      ],
      "note": ""
    },
    {
      "id": "m_K_SO3",
      "f": "K₂SO₃",
      "n": "亚硫酸钾",
      "cat": "St",
      "st": "s",
      "sol": "y",
      "el": [
        "K",
        "S",
        "O"
      ],
      "note": ""
    },
    {
      "id": "m_Mg_PO4",
      "f": "(PO₄)₂Mg₃",
      "n": "磷酸镁",
      "cat": "St",
      "st": "s",
      "sol": "n",
      "el": [
        "Mg",
        "P",
        "O"
      ],
      "note": "难溶（沉淀）"
    },
    {
      "id": "m_Fe3_C2O4",
      "f": "(C₂O₄)₃Fe₂",
      "n": "草酸铁",
      "cat": "St",
      "st": "s",
      "sol": "y",
      "el": [
        "Fe",
        "C",
        "O"
      ],
      "note": ""
    },
    {
      "id": "m_Ba_S",
      "f": "BaS",
      "n": "硫化钡",
      "cat": "St",
      "st": "s",
      "sol": "y",
      "el": [
        "Ba",
        "S"
      ],
      "note": ""
    },
    {
      "id": "m_Ag_CH3COO",
      "f": "AgCH₃COO",
      "n": "醋酸银",
      "cat": "St",
      "st": "s",
      "sol": "m",
      "el": [
        "Ag",
        "C",
        "H",
        "O"
      ],
      "note": "微溶"
    },
    {
      "id": "m_NH4_SiO3",
      "f": "NH₄₂SiO₃",
      "n": "硅酸铵",
      "cat": "St",
      "st": "s",
      "sol": "y",
      "el": [
        "N",
        "H",
        "Si",
        "O"
      ],
      "note": ""
    },
    {
      "id": "m_Al_F",
      "f": "AlF₃",
      "n": "氟化铝",
      "cat": "St",
      "st": "s",
      "sol": "n",
      "el": [
        "Al",
        "F"
      ],
      "note": "难溶（沉淀）"
    },
    {
      "id": "m_Al_CH3COO",
      "f": "(CH₃COO)₃Al",
      "n": "醋酸铝",
      "cat": "St",
      "st": "s",
      "sol": "y",
      "el": [
        "Al",
        "C",
        "H",
        "O"
      ],
      "note": ""
    },
    {
      "id": "m_Zn_CH3COO",
      "f": "(CH₃COO)₂Zn",
      "n": "醋酸锌",
      "cat": "St",
      "st": "s",
      "sol": "y",
      "el": [
        "Zn",
        "C",
        "H",
        "O"
      ],
      "note": ""
    },
    {
      "id": "m_Fe2_C2O4",
      "f": "FeC₂O₄",
      "n": "草酸亚铁",
      "cat": "St",
      "st": "s",
      "sol": "y",
      "el": [
        "Fe",
        "C",
        "O"
      ],
      "note": ""
    },
    {
      "id": "m_Fe3_CH3COO",
      "f": "(CH₃COO)₃Fe",
      "n": "醋酸铁",
      "cat": "St",
      "st": "s",
      "sol": "y",
      "el": [
        "Fe",
        "C",
        "H",
        "O"
      ],
      "note": ""
    },
    {
      "id": "m_Cu_CH3COO",
      "f": "(CH₃COO)₂Cu",
      "n": "醋酸铜",
      "cat": "St",
      "st": "s",
      "sol": "y",
      "el": [
        "Cu",
        "C",
        "H",
        "O"
      ],
      "note": ""
    },
    {
      "id": "m_K_ClO",
      "f": "KClO",
      "n": "次氯酸钾",
      "cat": "St",
      "st": "s",
      "sol": "y",
      "el": [
        "K",
        "Cl",
        "O"
      ],
      "note": ""
    },
    {
      "id": "m_Ba_ClO",
      "f": "Ba(ClO)₂",
      "n": "次氯酸钡",
      "cat": "St",
      "st": "s",
      "sol": "y",
      "el": [
        "Ba",
        "Cl",
        "O"
      ],
      "note": ""
    },
    {
      "id": "m_Mg_ClO",
      "f": "Mg(ClO)₂",
      "n": "次氯酸镁",
      "cat": "St",
      "st": "s",
      "sol": "y",
      "el": [
        "Mg",
        "Cl",
        "O"
      ],
      "note": ""
    },
    {
      "id": "m_Al_C2O4",
      "f": "(C₂O₄)₃Al₂",
      "n": "草酸铝",
      "cat": "St",
      "st": "s",
      "sol": "n",
      "el": [
        "Al",
        "C",
        "O"
      ],
      "note": "难溶（沉淀）"
    },
    {
      "id": "m_K_PO4",
      "f": "K₃PO₄",
      "n": "磷酸钾",
      "cat": "St",
      "st": "s",
      "sol": "y",
      "el": [
        "K",
        "P",
        "O"
      ],
      "note": ""
    },
    {
      "id": "m_Zn_PO4",
      "f": "(PO₄)₂Zn₃",
      "n": "磷酸锌",
      "cat": "St",
      "st": "s",
      "sol": "n",
      "el": [
        "Zn",
        "P",
        "O"
      ],
      "note": "难溶（沉淀）"
    },
    {
      "id": "m_Fe2_PO4",
      "f": "(PO₄)₂Fe₃",
      "n": "磷酸亚铁",
      "cat": "St",
      "st": "s",
      "sol": "n",
      "el": [
        "Fe",
        "P",
        "O"
      ],
      "note": "难溶（沉淀）"
    },
    {
      "id": "m_Fe3_PO4",
      "f": "FePO₄",
      "n": "磷酸铁",
      "cat": "St",
      "st": "s",
      "sol": "n",
      "el": [
        "Fe",
        "P",
        "O"
      ],
      "note": "难溶（沉淀）"
    },
    {
      "id": "m_Cu_PO4",
      "f": "(PO₄)₂Cu₃",
      "n": "磷酸铜",
      "cat": "St",
      "st": "s",
      "sol": "n",
      "el": [
        "Cu",
        "P",
        "O"
      ],
      "note": "难溶（沉淀）"
    },
    {
      "id": "m_K_Br",
      "f": "KBr",
      "n": "溴化钾",
      "cat": "St",
      "st": "s",
      "sol": "y",
      "el": [
        "K",
        "Br"
      ],
      "note": ""
    },
    {
      "id": "m_Ba_Br",
      "f": "BaBr₂",
      "n": "溴化钡",
      "cat": "St",
      "st": "s",
      "sol": "y",
      "el": [
        "Ba",
        "Br"
      ],
      "note": ""
    },
    {
      "id": "m_Ca_Br",
      "f": "CaBr₂",
      "n": "溴化钙",
      "cat": "St",
      "st": "s",
      "sol": "y",
      "el": [
        "Ca",
        "Br"
      ],
      "note": ""
    },
    {
      "id": "m_Mg_Br",
      "f": "MgBr₂",
      "n": "溴化镁",
      "cat": "St",
      "st": "s",
      "sol": "y",
      "el": [
        "Mg",
        "Br"
      ],
      "note": ""
    },
    {
      "id": "m_K_I",
      "f": "KI",
      "n": "碘化钾",
      "cat": "St",
      "st": "s",
      "sol": "y",
      "el": [
        "K",
        "I"
      ],
      "note": ""
    },
    {
      "id": "m_Ba_I",
      "f": "BaI₂",
      "n": "碘化钡",
      "cat": "St",
      "st": "s",
      "sol": "y",
      "el": [
        "Ba",
        "I"
      ],
      "note": ""
    },
    {
      "id": "m_Ca_I",
      "f": "CaI₂",
      "n": "碘化钙",
      "cat": "St",
      "st": "s",
      "sol": "y",
      "el": [
        "Ca",
        "I"
      ],
      "note": ""
    },
    {
      "id": "m_Mg_I",
      "f": "MgI₂",
      "n": "碘化镁",
      "cat": "St",
      "st": "s",
      "sol": "y",
      "el": [
        "Mg",
        "I"
      ],
      "note": ""
    },
    {
      "id": "m_Mg_S",
      "f": "MgS",
      "n": "硫化镁",
      "cat": "St",
      "st": "s",
      "sol": "n",
      "el": [
        "Mg",
        "S"
      ],
      "note": "难溶（沉淀）"
    },
    {
      "id": "m_Ca_SO3",
      "f": "CaSO₃",
      "n": "亚硫酸钙",
      "cat": "St",
      "st": "s",
      "sol": "n",
      "el": [
        "Ca",
        "S",
        "O"
      ],
      "note": "难溶（沉淀）"
    },
    {
      "id": "m_Mg_SO3",
      "f": "MgSO₃",
      "n": "亚硫酸镁",
      "cat": "St",
      "st": "s",
      "sol": "n",
      "el": [
        "Mg",
        "S",
        "O"
      ],
      "note": "难溶（沉淀）"
    },
    {
      "id": "m_Ag_SO3",
      "f": "Ag₂SO₃",
      "n": "亚硫酸银",
      "cat": "St",
      "st": "s",
      "sol": "n",
      "el": [
        "Ag",
        "S",
        "O"
      ],
      "note": "难溶（沉淀）"
    },
    {
      "id": "m_Ba_SiO3",
      "f": "BaSiO₃",
      "n": "硅酸钡",
      "cat": "St",
      "st": "s",
      "sol": "n",
      "el": [
        "Ba",
        "Si",
        "O"
      ],
      "note": "难溶（沉淀）"
    },
    {
      "id": "m_Mg_SiO3",
      "f": "MgSiO₃",
      "n": "硅酸镁",
      "cat": "St",
      "st": "s",
      "sol": "n",
      "el": [
        "Mg",
        "Si",
        "O"
      ],
      "note": "难溶（沉淀）"
    },
    {
      "id": "m_Cu_SiO3",
      "f": "CuSiO₃",
      "n": "硅酸铜",
      "cat": "St",
      "st": "s",
      "sol": "n",
      "el": [
        "Cu",
        "Si",
        "O"
      ],
      "note": "难溶（沉淀）"
    },
    {
      "id": "m_Ag_SiO3",
      "f": "Ag₂SiO₃",
      "n": "硅酸银",
      "cat": "St",
      "st": "s",
      "sol": "n",
      "el": [
        "Ag",
        "Si",
        "O"
      ],
      "note": "难溶（沉淀）"
    },
    {
      "id": "m_Mg_MnO4",
      "f": "Mg(MnO₄)₂",
      "n": "高锰酸镁",
      "cat": "St",
      "st": "s",
      "sol": "y",
      "el": [
        "Mg",
        "Mn",
        "O"
      ],
      "note": ""
    },
    {
      "id": "m_Na_MnO4",
      "f": "NaMnO₄",
      "n": "高锰酸钠",
      "cat": "St",
      "st": "s",
      "sol": "y",
      "el": [
        "Na",
        "Mn",
        "O"
      ],
      "note": ""
    },
    {
      "id": "m_Mg_AlO2",
      "f": "Mg(AlO₂)₂",
      "n": "偏铝酸镁",
      "cat": "St",
      "st": "s",
      "sol": "y",
      "el": [
        "Mg",
        "Al",
        "O"
      ],
      "note": ""
    },
    {
      "id": "m_Fe3_MnO4",
      "f": "Fe(MnO₄)₃",
      "n": "高锰酸铁",
      "cat": "St",
      "st": "s",
      "sol": "y",
      "el": [
        "Fe",
        "Mn",
        "O"
      ],
      "note": ""
    },
    {
      "id": "m_Fe3_AlO2",
      "f": "Fe(AlO₂)₃",
      "n": "偏铝酸铁",
      "cat": "St",
      "st": "s",
      "sol": "y",
      "el": [
        "Fe",
        "Al",
        "O"
      ],
      "note": ""
    },
    {
      "id": "m_Fe3_Br",
      "f": "FeBr₃",
      "n": "溴化铁",
      "cat": "St",
      "st": "s",
      "sol": "y",
      "el": [
        "Fe",
        "Br"
      ],
      "note": ""
    },
    {
      "id": "m_Cu_MnO4",
      "f": "Cu(MnO₄)₂",
      "n": "高锰酸铜",
      "cat": "St",
      "st": "s",
      "sol": "y",
      "el": [
        "Cu",
        "Mn",
        "O"
      ],
      "note": ""
    },
    {
      "id": "m_Cu_AlO2",
      "f": "Cu(AlO₂)₂",
      "n": "偏铝酸铜",
      "cat": "St",
      "st": "s",
      "sol": "y",
      "el": [
        "Cu",
        "Al",
        "O"
      ],
      "note": ""
    },
    {
      "id": "m_Cu_Br",
      "f": "CuBr₂",
      "n": "溴化铜",
      "cat": "St",
      "st": "s",
      "sol": "y",
      "el": [
        "Cu",
        "Br"
      ],
      "note": ""
    },
    {
      "id": "m_Ca_MnO4",
      "f": "Ca(MnO₄)₂",
      "n": "高锰酸钙",
      "cat": "St",
      "st": "s",
      "sol": "y",
      "el": [
        "Ca",
        "Mn",
        "O"
      ],
      "note": ""
    },
    {
      "id": "m_Ca_AlO2",
      "f": "Ca(AlO₂)₂",
      "n": "偏铝酸钙",
      "cat": "St",
      "st": "s",
      "sol": "y",
      "el": [
        "Ca",
        "Al",
        "O"
      ],
      "note": ""
    },
    {
      "id": "m_K_AlO2",
      "f": "KAlO₂",
      "n": "偏铝酸钾",
      "cat": "St",
      "st": "s",
      "sol": "y",
      "el": [
        "K",
        "Al",
        "O"
      ],
      "note": ""
    },
    {
      "id": "m_K_SiO3",
      "f": "K₂SiO₃",
      "n": "硅酸钾",
      "cat": "St",
      "st": "s",
      "sol": "y",
      "el": [
        "K",
        "Si",
        "O"
      ],
      "note": ""
    },
    {
      "id": "m_Ba_MnO4",
      "f": "Ba(MnO₄)₂",
      "n": "高锰酸钡",
      "cat": "St",
      "st": "s",
      "sol": "y",
      "el": [
        "Ba",
        "Mn",
        "O"
      ],
      "note": ""
    },
    {
      "id": "m_Ba_AlO2",
      "f": "Ba(AlO₂)₂",
      "n": "偏铝酸钡",
      "cat": "St",
      "st": "s",
      "sol": "y",
      "el": [
        "Ba",
        "Al",
        "O"
      ],
      "note": ""
    },
    {
      "id": "m_Zn_S",
      "f": "ZnS",
      "n": "硫化锌",
      "cat": "St",
      "st": "s",
      "sol": "n",
      "el": [
        "Zn",
        "S"
      ],
      "note": "难溶（沉淀）"
    },
    {
      "id": "m_K_S",
      "f": "K₂S",
      "n": "硫化钾",
      "cat": "St",
      "st": "s",
      "sol": "y",
      "el": [
        "K",
        "S"
      ],
      "note": ""
    },
    {
      "id": "m_Al_Br",
      "f": "AlBr₃",
      "n": "溴化铝",
      "cat": "St",
      "st": "s",
      "sol": "y",
      "el": [
        "Al",
        "Br"
      ],
      "note": ""
    },
    {
      "id": "m_Al_I",
      "f": "AlI₃",
      "n": "碘化铝",
      "cat": "St",
      "st": "s",
      "sol": "y",
      "el": [
        "Al",
        "I"
      ],
      "note": ""
    },
    {
      "id": "m_Zn_ClO",
      "f": "Zn(ClO)₂",
      "n": "次氯酸锌",
      "cat": "St",
      "st": "s",
      "sol": "y",
      "el": [
        "Zn",
        "Cl",
        "O"
      ],
      "note": ""
    },
    {
      "id": "m_Zn_Br",
      "f": "ZnBr₂",
      "n": "溴化锌",
      "cat": "St",
      "st": "s",
      "sol": "y",
      "el": [
        "Zn",
        "Br"
      ],
      "note": ""
    },
    {
      "id": "m_Zn_I",
      "f": "ZnI₂",
      "n": "碘化锌",
      "cat": "St",
      "st": "s",
      "sol": "y",
      "el": [
        "Zn",
        "I"
      ],
      "note": ""
    },
    {
      "id": "m_Fe2_Br",
      "f": "FeBr₂",
      "n": "溴化亚铁",
      "cat": "St",
      "st": "s",
      "sol": "y",
      "el": [
        "Fe",
        "Br"
      ],
      "note": ""
    },
    {
      "id": "m_Fe2_I",
      "f": "FeI₂",
      "n": "碘化亚铁",
      "cat": "St",
      "st": "s",
      "sol": "y",
      "el": [
        "Fe",
        "I"
      ],
      "note": ""
    },
    {
      "id": "m_Zn_SO3",
      "f": "ZnSO₃",
      "n": "亚硫酸锌",
      "cat": "St",
      "st": "s",
      "sol": "n",
      "el": [
        "Zn",
        "S",
        "O"
      ],
      "note": "难溶（沉淀）"
    },
    {
      "id": "m_Zn_SiO3",
      "f": "ZnSiO₃",
      "n": "硅酸锌",
      "cat": "St",
      "st": "s",
      "sol": "n",
      "el": [
        "Zn",
        "Si",
        "O"
      ],
      "note": "难溶（沉淀）"
    },
    {
      "id": "m_Fe2_SiO3",
      "f": "FeSiO₃",
      "n": "硅酸亚铁",
      "cat": "St",
      "st": "s",
      "sol": "n",
      "el": [
        "Fe",
        "Si",
        "O"
      ],
      "note": "难溶（沉淀）"
    },
    {
      "id": "m_Zn_MnO4",
      "f": "Zn(MnO₄)₂",
      "n": "高锰酸锌",
      "cat": "St",
      "st": "s",
      "sol": "y",
      "el": [
        "Zn",
        "Mn",
        "O"
      ],
      "note": ""
    },
    {
      "id": "m_Zn_AlO2",
      "f": "Zn(AlO₂)₂",
      "n": "偏铝酸锌",
      "cat": "St",
      "st": "s",
      "sol": "y",
      "el": [
        "Zn",
        "Al",
        "O"
      ],
      "note": ""
    },
    {
      "id": "m_Fe2_MnO4",
      "f": "Fe(MnO₄)₂",
      "n": "高锰酸亚铁",
      "cat": "St",
      "st": "s",
      "sol": "y",
      "el": [
        "Fe",
        "Mn",
        "O"
      ],
      "note": ""
    },
    {
      "id": "m_Fe2_AlO2",
      "f": "Fe(AlO₂)₂",
      "n": "偏铝酸亚铁",
      "cat": "St",
      "st": "s",
      "sol": "y",
      "el": [
        "Fe",
        "Al",
        "O"
      ],
      "note": ""
    },
    {
      "id": "m_Ag_MnO4",
      "f": "AgMnO₄",
      "n": "高锰酸银",
      "cat": "St",
      "st": "s",
      "sol": "y",
      "el": [
        "Ag",
        "Mn",
        "O"
      ],
      "note": ""
    },
    {
      "id": "m_Ag_AlO2",
      "f": "AgAlO₂",
      "n": "偏铝酸银",
      "cat": "St",
      "st": "s",
      "sol": "y",
      "el": [
        "Ag",
        "Al",
        "O"
      ],
      "note": ""
    },
    {
      "id": "m_Zn_HCO3",
      "f": "(HCO₃)₂Zn",
      "n": "碳酸氢锌",
      "cat": "St",
      "st": "s",
      "sol": "x",
      "el": [
        "Zn",
        "H",
        "C",
        "O"
      ],
      "note": ""
    },
    {
      "id": "m_Fe2_HCO3",
      "f": "(HCO₃)₂Fe",
      "n": "碳酸氢亚铁",
      "cat": "St",
      "st": "s",
      "sol": "x",
      "el": [
        "Fe",
        "H",
        "C",
        "O"
      ],
      "note": ""
    },
    {
      "id": "m_Fe2_ClO",
      "f": "Fe(ClO)₂",
      "n": "次氯酸亚铁",
      "cat": "St",
      "st": "s",
      "sol": "y",
      "el": [
        "Fe",
        "Cl",
        "O"
      ],
      "note": "只作为产物出现，不参与溶液中的复分解"
    },
    {
      "id": "m_Cu_ClO",
      "f": "Cu(ClO)₂",
      "n": "次氯酸铜",
      "cat": "St",
      "st": "s",
      "sol": "y",
      "el": [
        "Cu",
        "Cl",
        "O"
      ],
      "note": "只作为产物出现，不参与溶液中的复分解"
    },
    {
      "id": "m_Al_PO4",
      "f": "AlPO₄",
      "n": "磷酸铝",
      "cat": "St",
      "st": "s",
      "sol": "n",
      "el": [
        "Al",
        "P",
        "O"
      ],
      "note": "难溶（沉淀）"
    },
    {
      "id": "m_Ag_HCO3",
      "f": "AgHCO₃",
      "n": "碳酸氢银",
      "cat": "St",
      "st": "s",
      "sol": "x",
      "el": [
        "Ag",
        "H",
        "C",
        "O"
      ],
      "note": ""
    },
    {
      "id": "m_Al_ClO",
      "f": "Al(ClO)₃",
      "n": "次氯酸铝",
      "cat": "St",
      "st": "s",
      "sol": "y",
      "el": [
        "Al",
        "Cl",
        "O"
      ],
      "note": "只作为产物出现，不参与溶液中的复分解"
    },
    {
      "id": "m_Fe3_ClO",
      "f": "Fe(ClO)₃",
      "n": "次氯酸铁",
      "cat": "St",
      "st": "s",
      "sol": "y",
      "el": [
        "Fe",
        "Cl",
        "O"
      ],
      "note": "只作为产物出现，不参与溶液中的复分解"
    },
    {
      "id": "m_Ag_ClO",
      "f": "AgClO",
      "n": "次氯酸银",
      "cat": "St",
      "st": "s",
      "sol": "y",
      "el": [
        "Ag",
        "Cl",
        "O"
      ],
      "note": "只作为产物出现，不参与溶液中的复分解"
    }
  ];

  /* ---------- 自动生成的反应 ---------- */
  var REACTIONS = [
    {
      "r": [
        "NaCl",
        "H2O"
      ],
      "p": [
        "NaOH",
        "H2",
        "Cl2"
      ],
      "c": "电解",
      "nm": "氯碱工业",
      "t": "氧化还原"
    },
    {
      "r": [
        "FeCl3",
        "Na2CO3"
      ],
      "p": [
        "Fe(OH)3",
        "CO2",
        "NaCl"
      ],
      "c": "水溶液中",
      "nm": "双水解反应：Al³⁺/Fe³⁺ 与弱酸酸根互相促进水解，反应进行到底",
      "t": "双水解"
    },
    {
      "r": [
        "FeCl3",
        "NaHCO3"
      ],
      "p": [
        "Fe(OH)3",
        "CO2",
        "NaCl"
      ],
      "c": "水溶液中",
      "nm": "双水解反应：Al³⁺/Fe³⁺ 与弱酸酸根互相促进水解，反应进行到底",
      "t": "双水解"
    },
    {
      "r": [
        "HCl",
        "CaCO3"
      ],
      "p": [
        "CaCl2",
        "H2O",
        "CO2"
      ],
      "c": "",
      "nm": "实验室制二氧化碳",
      "t": "复分解"
    },
    {
      "r": [
        "Cu",
        "O2",
        "CO2",
        "H2O"
      ],
      "p": [
        "Cu2OH2CO3"
      ],
      "c": "潮湿空气",
      "nm": "铜生锈",
      "t": "化合"
    },
    {
      "r": [
        "Cu",
        "HNO3"
      ],
      "p": [
        "CuNO32",
        "NO",
        "H2O"
      ],
      "c": "稀硝酸",
      "nm": "铜与稀硝酸反应",
      "t": "氧化还原"
    },
    {
      "r": [
        "Zn",
        "H2SO4"
      ],
      "p": [
        "ZnSO4",
        "H2"
      ],
      "c": "",
      "nm": "实验室制氢气",
      "t": "置换"
    },
    {
      "r": [
        "Fe",
        "H2SO4"
      ],
      "p": [
        "FeSO4",
        "H2"
      ],
      "c": "",
      "nm": "金属与酸反应",
      "t": "置换"
    },
    {
      "r": [
        "CO",
        "Fe2O3"
      ],
      "p": [
        "Fe",
        "CO2"
      ],
      "c": "高温",
      "nm": "高炉炼铁",
      "t": "氧化还原"
    },
    {
      "r": [
        "CO",
        "CuO"
      ],
      "p": [
        "Cu",
        "CO2"
      ],
      "c": "加热",
      "nm": "一氧化碳还原氧化铜",
      "t": "氧化还原"
    },
    {
      "r": [
        "C",
        "CuO"
      ],
      "p": [
        "Cu",
        "CO2"
      ],
      "c": "高温",
      "nm": "碳还原氧化铜",
      "t": "氧化还原"
    },
    {
      "r": [
        "C",
        "Fe2O3"
      ],
      "p": [
        "Fe",
        "CO2"
      ],
      "c": "高温",
      "nm": "碳还原氧化铁",
      "t": "氧化还原"
    },
    {
      "r": [
        "Na",
        "H2O"
      ],
      "p": [
        "NaOH",
        "H2"
      ],
      "c": "",
      "nm": "钠与水剧烈反应",
      "t": "氧化还原"
    },
    {
      "r": [
        "K",
        "H2O"
      ],
      "p": [
        "KOH",
        "H2"
      ],
      "c": "",
      "nm": "钾与水剧烈反应",
      "t": "氧化还原"
    },
    {
      "r": [
        "FeCl3",
        "NH4HCO3"
      ],
      "p": [
        "Fe(OH)3",
        "CO2",
        "NH4Cl"
      ],
      "c": "水溶液中",
      "nm": "双水解反应：Al³⁺/Fe³⁺ 与弱酸酸根互相促进水解，反应进行到底",
      "t": "双水解"
    },
    {
      "r": [
        "Al",
        "Fe2O3"
      ],
      "p": [
        "Al2O3",
        "Fe"
      ],
      "c": "高温",
      "nm": "铝热反应",
      "t": "化合"
    },
    {
      "r": [
        "HNO3",
        "CaCO3"
      ],
      "p": [
        "CaNO32",
        "H2O",
        "CO2"
      ],
      "c": "",
      "nm": "碳酸盐与酸反应",
      "t": "复分解"
    },
    {
      "r": [
        "Cu",
        "HNO3"
      ],
      "p": [
        "CuNO32",
        "NO2",
        "H2O"
      ],
      "c": "浓硝酸",
      "nm": "铜与浓硝酸反应",
      "t": "氧化还原"
    },
    {
      "r": [
        "Ag",
        "HNO3"
      ],
      "p": [
        "AgNO3",
        "NO2",
        "H2O"
      ],
      "c": "",
      "nm": "银与硝酸反应",
      "t": "氧化还原"
    },
    {
      "r": [
        "CH3COOH",
        "CaCO3"
      ],
      "p": [
        "CH3COO2Ca",
        "H2O",
        "CO2"
      ],
      "c": "",
      "nm": "食醋除水垢",
      "t": "复分解"
    },
    {
      "r": [
        "H2C2O4",
        "Na2CO3"
      ],
      "p": [
        "Na2C2O4",
        "H2O",
        "CO2"
      ],
      "c": "",
      "nm": "草酸与碳酸钠",
      "t": "复分解"
    },
    {
      "r": [
        "NH4HCO3",
        "NaOH"
      ],
      "p": [
        "Na2CO3",
        "H2O",
        "NH3"
      ],
      "c": "",
      "nm": "铵盐与碱共热",
      "t": "复分解"
    },
    {
      "r": [
        "Fe",
        "H2O"
      ],
      "p": [
        "Fe3O4",
        "H2"
      ],
      "c": "高温",
      "nm": "铁与水蒸气反应",
      "t": "氧化还原"
    },
    {
      "r": [
        "Ca(OH)2",
        "CO2"
      ],
      "p": [
        "CaCO3",
        "H2O"
      ],
      "c": "",
      "nm": "检验二氧化碳",
      "t": "复分解"
    },
    {
      "r": [
        "H2",
        "CuO"
      ],
      "p": [
        "Cu",
        "H2O"
      ],
      "c": "加热",
      "nm": "氢气还原氧化铜",
      "t": "氧化还原"
    },
    {
      "r": [
        "H2",
        "Fe2O3"
      ],
      "p": [
        "Fe",
        "H2O"
      ],
      "c": "高温",
      "nm": "氢气还原氧化铁",
      "t": "氧化还原"
    },
    {
      "r": [
        "Fe",
        "HNO3"
      ],
      "p": [
        "FeNO33",
        "NO",
        "H2O"
      ],
      "c": "稀硝酸",
      "nm": "铁与稀硝酸反应",
      "t": "氧化还原"
    },
    {
      "r": [
        "NH3",
        "CuO"
      ],
      "p": [
        "N2",
        "Cu",
        "H2O"
      ],
      "c": "加热",
      "nm": "氨气还原氧化铜",
      "t": "氧化还原"
    },
    {
      "r": [
        "FeNO33",
        "NH4HCO3"
      ],
      "p": [
        "Fe(OH)3",
        "CO2",
        "NH4NO3"
      ],
      "c": "水溶液中",
      "nm": "双水解反应：Al³⁺/Fe³⁺ 与弱酸酸根互相促进水解，反应进行到底",
      "t": "双水解"
    },
    {
      "r": [
        "Fe",
        "CuSO4"
      ],
      "p": [
        "FeSO4",
        "Cu"
      ],
      "c": "",
      "nm": "铁与硫酸铜溶液反应（湿法炼铜）",
      "t": "置换"
    },
    {
      "r": [
        "Zn",
        "CuSO4"
      ],
      "p": [
        "ZnSO4",
        "Cu"
      ],
      "c": "",
      "nm": "金属置换反应",
      "t": "置换"
    },
    {
      "r": [
        "Cu",
        "AgNO3"
      ],
      "p": [
        "CuNO32",
        "Ag"
      ],
      "c": "",
      "nm": "铜置换银",
      "t": "置换"
    },
    {
      "r": [
        "Na2CO3",
        "CO2",
        "H2O"
      ],
      "p": [
        "NaHCO3"
      ],
      "c": "",
      "nm": "碳酸钠吸收二氧化碳",
      "t": "复分解"
    },
    {
      "r": [
        "NaCl",
        "NH3H2O",
        "CO2"
      ],
      "p": [
        "NaHCO3",
        "NH4Cl"
      ],
      "c": "",
      "nm": "侯氏制碱法",
      "t": "复分解"
    },
    {
      "r": [
        "Zn",
        "FeSO4"
      ],
      "p": [
        "ZnSO4",
        "Fe"
      ],
      "c": "",
      "nm": "锌置换铁",
      "t": "氧化还原"
    },
    {
      "r": [
        "Mg",
        "AgNO3"
      ],
      "p": [
        "MgNO32",
        "Ag"
      ],
      "c": "",
      "nm": "较活泼金属把较不活泼金属从其盐溶液中置换出来",
      "t": "置换"
    },
    {
      "r": [
        "HCl",
        "BaCO3"
      ],
      "p": [
        "BaCl2",
        "H2O",
        "CO2"
      ],
      "c": "",
      "nm": "碳酸盐与酸反应",
      "t": "复分解"
    },
    {
      "r": [
        "Zn",
        "HCl"
      ],
      "p": [
        "ZnCl2",
        "H2"
      ],
      "c": "",
      "nm": "金属与酸反应",
      "t": "置换"
    },
    {
      "r": [
        "Fe",
        "HCl"
      ],
      "p": [
        "FeCl2",
        "H2"
      ],
      "c": "",
      "nm": "金属与酸反应",
      "t": "置换"
    },
    {
      "r": [
        "Mg",
        "HCl"
      ],
      "p": [
        "MgCl2",
        "H2"
      ],
      "c": "",
      "nm": "金属与酸反应",
      "t": "置换"
    },
    {
      "r": [
        "Al",
        "HCl"
      ],
      "p": [
        "AlCl3",
        "H2"
      ],
      "c": "",
      "nm": "金属与酸反应",
      "t": "置换"
    },
    {
      "r": [
        "Mg",
        "H2SO4"
      ],
      "p": [
        "MgSO4",
        "H2"
      ],
      "c": "",
      "nm": "金属与酸反应",
      "t": "置换"
    },
    {
      "r": [
        "Al",
        "H2SO4"
      ],
      "p": [
        "Al2SO43",
        "H2"
      ],
      "c": "",
      "nm": "金属与酸反应",
      "t": "置换"
    },
    {
      "r": [
        "NaOH",
        "CO2"
      ],
      "p": [
        "Na2CO3",
        "H2O"
      ],
      "c": "",
      "nm": "吸收二氧化碳",
      "t": "复分解"
    },
    {
      "r": [
        "HCl",
        "Fe2O3"
      ],
      "p": [
        "FeCl3",
        "H2O"
      ],
      "c": "",
      "nm": "除铁锈",
      "t": "复分解"
    },
    {
      "r": [
        "HCl",
        "CuO"
      ],
      "p": [
        "CuCl2",
        "H2O"
      ],
      "c": "",
      "nm": "黑色氧化铜溶解",
      "t": "复分解"
    },
    {
      "r": [
        "HCl",
        "CaO"
      ],
      "p": [
        "CaCl2",
        "H2O"
      ],
      "c": "",
      "nm": "金属氧化物与酸反应",
      "t": "复分解"
    },
    {
      "r": [
        "H2SO4",
        "CuO"
      ],
      "p": [
        "CuSO4",
        "H2O"
      ],
      "c": "",
      "nm": "金属氧化物与酸反应",
      "t": "复分解"
    },
    {
      "r": [
        "HNO3",
        "CuO"
      ],
      "p": [
        "CuNO32",
        "H2O"
      ],
      "c": "",
      "nm": "金属氧化物与酸反应",
      "t": "复分解"
    },
    {
      "r": [
        "HCl",
        "Cu(OH)2"
      ],
      "p": [
        "CuCl2",
        "H2O"
      ],
      "c": "",
      "nm": "碱与酸反应",
      "t": "中和"
    },
    {
      "r": [
        "HCl",
        "Fe(OH)3"
      ],
      "p": [
        "FeCl3",
        "H2O"
      ],
      "c": "",
      "nm": "碱与酸反应",
      "t": "中和"
    },
    {
      "r": [
        "H2SO4",
        "Cu(OH)2"
      ],
      "p": [
        "CuSO4",
        "H2O"
      ],
      "c": "",
      "nm": "碱与酸反应",
      "t": "中和"
    },
    {
      "r": [
        "HNO3",
        "NH3H2O"
      ],
      "p": [
        "NH4NO3",
        "H2O"
      ],
      "c": "",
      "nm": "中和反应",
      "t": "中和"
    },
    {
      "r": [
        "HNO3",
        "Cu(OH)2"
      ],
      "p": [
        "CuNO32",
        "H2O"
      ],
      "c": "",
      "nm": "碱与酸反应",
      "t": "中和"
    },
    {
      "r": [
        "NaHCO3",
        "NaOH"
      ],
      "p": [
        "Na2CO3",
        "H2O"
      ],
      "c": "",
      "nm": "碳酸氢钠与碱反应",
      "t": "复分解"
    },
    {
      "r": [
        "Cl2",
        "NaOH"
      ],
      "p": [
        "NaCl",
        "NaClO",
        "H2O"
      ],
      "c": "",
      "nm": "氯气与碱反应",
      "t": "氧化还原"
    },
    {
      "r": [
        "Cl2",
        "Ca(OH)2"
      ],
      "p": [
        "Ca(ClO)2",
        "CaCl2",
        "H2O"
      ],
      "c": "",
      "nm": "工业制漂白粉",
      "t": "氧化还原"
    },
    {
      "r": [
        "Mg",
        "CO2"
      ],
      "p": [
        "C",
        "MgO"
      ],
      "c": "点燃",
      "nm": "镁在二氧化碳中燃烧",
      "t": "氧化还原"
    },
    {
      "r": [
        "HCl",
        "Ag2CO3"
      ],
      "p": [
        "AgCl",
        "H2O",
        "CO2"
      ],
      "c": "",
      "nm": "碳酸银溶于盐酸",
      "t": "复分解"
    },
    {
      "r": [
        "H2SO4",
        "BaCO3"
      ],
      "p": [
        "BaSO4",
        "H2O",
        "CO2"
      ],
      "c": "",
      "nm": "碳酸钡与硫酸反应",
      "t": "复分解"
    },
    {
      "r": [
        "NH4NO3",
        "NaOH"
      ],
      "p": [
        "NaNO3",
        "H2O",
        "NH3"
      ],
      "c": "",
      "nm": "铵盐与碱共热",
      "t": "复分解"
    },
    {
      "r": [
        "Ba(OH)2",
        "CO2"
      ],
      "p": [
        "BaCO3",
        "H2O"
      ],
      "c": "",
      "nm": "吸收二氧化碳",
      "t": "复分解"
    },
    {
      "r": [
        "SO2",
        "Cl2",
        "H2O"
      ],
      "p": [
        "H2SO4",
        "HCl"
      ],
      "c": "",
      "nm": "二氧化硫与氯气反应",
      "t": "氧化还原"
    },
    {
      "r": [
        "C",
        "O2"
      ],
      "p": [
        "CO2"
      ],
      "c": "点燃",
      "nm": "碳充分燃烧",
      "t": "化合"
    },
    {
      "r": [
        "CO",
        "Fe3O4"
      ],
      "p": [
        "Fe",
        "CO2"
      ],
      "c": "高温",
      "nm": "一氧化碳还原四氧化三铁",
      "t": "氧化还原"
    },
    {
      "r": [
        "CO",
        "O2"
      ],
      "p": [
        "CO2"
      ],
      "c": "点燃",
      "nm": "一氧化碳燃烧",
      "t": "氧化还原"
    },
    {
      "r": [
        "AlCl3",
        "Na2CO3"
      ],
      "p": [
        "Al(OH)3",
        "CO2",
        "NaCl"
      ],
      "c": "水溶液中",
      "nm": "双水解反应：Al³⁺/Fe³⁺ 与弱酸酸根互相促进水解，反应进行到底",
      "t": "双水解"
    },
    {
      "r": [
        "AlCl3",
        "NaHCO3"
      ],
      "p": [
        "Al(OH)3",
        "CO2",
        "NaCl"
      ],
      "c": "水溶液中",
      "nm": "双水解反应：Al³⁺/Fe³⁺ 与弱酸酸根互相促进水解，反应进行到底",
      "t": "双水解"
    },
    {
      "r": [
        "AlNO33",
        "NH4HCO3"
      ],
      "p": [
        "Al(OH)3",
        "CO2",
        "NH4NO3"
      ],
      "c": "水溶液中",
      "nm": "双水解反应：Al³⁺/Fe³⁺ 与弱酸酸根互相促进水解，反应进行到底",
      "t": "双水解"
    },
    {
      "r": [
        "FeCl3",
        "K2CO3"
      ],
      "p": [
        "Fe(OH)3",
        "CO2",
        "KCl"
      ],
      "c": "水溶液中",
      "nm": "双水解反应：Al³⁺/Fe³⁺ 与弱酸酸根互相促进水解，反应进行到底",
      "t": "双水解"
    },
    {
      "r": [
        "FeCl3",
        "NH42CO3"
      ],
      "p": [
        "Fe(OH)3",
        "CO2",
        "NH4Cl"
      ],
      "c": "水溶液中",
      "nm": "双水解反应：Al³⁺/Fe³⁺ 与弱酸酸根互相促进水解，反应进行到底",
      "t": "双水解"
    },
    {
      "r": [
        "FeCl3",
        "Na2S"
      ],
      "p": [
        "Fe(OH)3",
        "H2S",
        "NaCl"
      ],
      "c": "水溶液中",
      "nm": "双水解反应：Al³⁺/Fe³⁺ 与弱酸酸根互相促进水解，反应进行到底",
      "t": "双水解"
    },
    {
      "r": [
        "FeCl3",
        "Na2SO3"
      ],
      "p": [
        "Fe(OH)3",
        "SO2",
        "NaCl"
      ],
      "c": "水溶液中",
      "nm": "双水解反应：Al³⁺/Fe³⁺ 与弱酸酸根互相促进水解，反应进行到底",
      "t": "双水解"
    },
    {
      "r": [
        "Fe2SO43",
        "Na2CO3"
      ],
      "p": [
        "Fe(OH)3",
        "CO2",
        "Na2SO4"
      ],
      "c": "水溶液中",
      "nm": "双水解反应：Al³⁺/Fe³⁺ 与弱酸酸根互相促进水解，反应进行到底",
      "t": "双水解"
    },
    {
      "r": [
        "Fe2SO43",
        "NaHCO3"
      ],
      "p": [
        "Fe(OH)3",
        "CO2",
        "Na2SO4"
      ],
      "c": "水溶液中",
      "nm": "双水解反应：Al³⁺/Fe³⁺ 与弱酸酸根互相促进水解，反应进行到底",
      "t": "双水解"
    },
    {
      "r": [
        "Fe2SO43",
        "NH4HCO3"
      ],
      "p": [
        "Fe(OH)3",
        "CO2",
        "m_NH4_SO4"
      ],
      "c": "水溶液中",
      "nm": "双水解反应：Al³⁺/Fe³⁺ 与弱酸酸根互相促进水解，反应进行到底",
      "t": "双水解"
    },
    {
      "r": [
        "FeNO33",
        "Na2CO3"
      ],
      "p": [
        "Fe(OH)3",
        "CO2",
        "NaNO3"
      ],
      "c": "水溶液中",
      "nm": "双水解反应：Al³⁺/Fe³⁺ 与弱酸酸根互相促进水解，反应进行到底",
      "t": "双水解"
    },
    {
      "r": [
        "FeNO33",
        "NaHCO3"
      ],
      "p": [
        "Fe(OH)3",
        "CO2",
        "NaNO3"
      ],
      "c": "水溶液中",
      "nm": "双水解反应：Al³⁺/Fe³⁺ 与弱酸酸根互相促进水解，反应进行到底",
      "t": "双水解"
    },
    {
      "r": [
        "Zn",
        "CuCl2"
      ],
      "p": [
        "ZnCl2",
        "Cu"
      ],
      "c": "",
      "nm": "金属置换反应",
      "t": "置换"
    },
    {
      "r": [
        "Fe",
        "CuCl2"
      ],
      "p": [
        "FeCl2",
        "Cu"
      ],
      "c": "",
      "nm": "金属置换反应",
      "t": "置换"
    },
    {
      "r": [
        "Fe",
        "AgNO3"
      ],
      "p": [
        "FeNO32",
        "Ag"
      ],
      "c": "",
      "nm": "铁置换银",
      "t": "置换"
    },
    {
      "r": [
        "Zn",
        "AgNO3"
      ],
      "p": [
        "ZnNO32",
        "Ag"
      ],
      "c": "",
      "nm": "锌置换银",
      "t": "置换"
    },
    {
      "r": [
        "Mg",
        "ZnSO4"
      ],
      "p": [
        "MgSO4",
        "Zn"
      ],
      "c": "",
      "nm": "镁置换锌",
      "t": "置换"
    },
    {
      "r": [
        "Mg",
        "FeSO4"
      ],
      "p": [
        "MgSO4",
        "Fe"
      ],
      "c": "",
      "nm": "镁置换铁",
      "t": "置换"
    },
    {
      "r": [
        "Cu",
        "O2"
      ],
      "p": [
        "CuO"
      ],
      "c": "加热",
      "nm": "铜在空气中加热",
      "t": "化合"
    },
    {
      "r": [
        "Al",
        "O2"
      ],
      "p": [
        "Al2O3"
      ],
      "c": "",
      "nm": "铝表面氧化",
      "t": "化合"
    },
    {
      "r": [
        "C",
        "O2"
      ],
      "p": [
        "CO"
      ],
      "c": "点燃（氧气不足）",
      "nm": "碳不充分燃烧",
      "t": "化合"
    },
    {
      "r": [
        "CO2",
        "Na2SiO3",
        "H2O"
      ],
      "p": [
        "Na2CO3",
        "H2SiO3"
      ],
      "c": "",
      "nm": "碳酸制硅酸",
      "t": "复分解"
    },
    {
      "r": [
        "CO2",
        "NaAlO2",
        "H2O"
      ],
      "p": [
        "Na2CO3",
        "Al(OH)3"
      ],
      "c": "",
      "nm": "偏铝酸钠与二氧化碳",
      "t": "复分解"
    },
    {
      "r": [
        "NH3H2O",
        "FeCl3"
      ],
      "p": [
        "Fe(OH)3",
        "NH4Cl"
      ],
      "c": "",
      "nm": "氨水与盐反应",
      "t": "复分解"
    },
    {
      "r": [
        "NH3H2O",
        "CuSO4"
      ],
      "p": [
        "Cu(OH)2",
        "NH42SO4"
      ],
      "c": "",
      "nm": "氨水与盐反应",
      "t": "复分解"
    },
    {
      "r": [
        "C",
        "CO2"
      ],
      "p": [
        "CO"
      ],
      "c": "高温",
      "nm": "二氧化碳与碳反应",
      "t": "氧化还原"
    },
    {
      "r": [
        "CaCO3",
        "CO2",
        "H2O"
      ],
      "p": [
        "CaHCO32"
      ],
      "c": "",
      "nm": "溶洞形成",
      "t": "复分解"
    },
    {
      "r": [
        "FeOH2",
        "O2",
        "H2O"
      ],
      "p": [
        "Fe(OH)3"
      ],
      "c": "",
      "nm": "氢氧化亚铁被氧化（白色→灰绿→红褐）",
      "t": "氧化还原"
    },
    {
      "r": [
        "NH3",
        "CuSO4",
        "H2O"
      ],
      "p": [
        "Cu(OH)2",
        "NH42SO4"
      ],
      "c": "",
      "nm": "少量氨水与硫酸铜",
      "t": "复分解"
    },
    {
      "r": [
        "NH3",
        "FeCl3",
        "H2O"
      ],
      "p": [
        "Fe(OH)3",
        "NH4Cl"
      ],
      "c": "",
      "nm": "氨水与氯化铁",
      "t": "复分解"
    },
    {
      "r": [
        "Mg",
        "CuSO4"
      ],
      "p": [
        "MgSO4",
        "Cu"
      ],
      "c": "",
      "nm": "较活泼金属把较不活泼金属从其盐溶液中置换出来",
      "t": "置换"
    },
    {
      "r": [
        "Al",
        "CuSO4"
      ],
      "p": [
        "Al2SO43",
        "Cu"
      ],
      "c": "",
      "nm": "较活泼金属把较不活泼金属从其盐溶液中置换出来",
      "t": "置换"
    },
    {
      "r": [
        "Mg",
        "CuCl2"
      ],
      "p": [
        "MgCl2",
        "Cu"
      ],
      "c": "",
      "nm": "较活泼金属把较不活泼金属从其盐溶液中置换出来",
      "t": "置换"
    },
    {
      "r": [
        "Al",
        "CuCl2"
      ],
      "p": [
        "AlCl3",
        "Cu"
      ],
      "c": "",
      "nm": "较活泼金属把较不活泼金属从其盐溶液中置换出来",
      "t": "置换"
    },
    {
      "r": [
        "Al",
        "AgNO3"
      ],
      "p": [
        "AlNO33",
        "Ag"
      ],
      "c": "",
      "nm": "较活泼金属把较不活泼金属从其盐溶液中置换出来",
      "t": "置换"
    },
    {
      "r": [
        "Al",
        "ZnSO4"
      ],
      "p": [
        "Al2SO43",
        "Zn"
      ],
      "c": "",
      "nm": "较活泼金属把较不活泼金属从其盐溶液中置换出来",
      "t": "置换"
    },
    {
      "r": [
        "Al",
        "FeSO4"
      ],
      "p": [
        "Al2SO43",
        "Fe"
      ],
      "c": "",
      "nm": "较活泼金属把较不活泼金属从其盐溶液中置换出来",
      "t": "置换"
    },
    {
      "r": [
        "FeCl3",
        "Na2SiO3"
      ],
      "p": [
        "Fe(OH)3",
        "H2SiO3",
        "NaCl"
      ],
      "c": "水溶液中",
      "nm": "双水解反应：Al³⁺/Fe³⁺ 与弱酸酸根互相促进水解，反应进行到底",
      "t": "双水解"
    },
    {
      "r": [
        "HCl",
        "MgCO3"
      ],
      "p": [
        "MgCl2",
        "H2O",
        "CO2"
      ],
      "c": "",
      "nm": "碳酸盐与酸反应",
      "t": "复分解"
    },
    {
      "r": [
        "HCl",
        "ZnCO3"
      ],
      "p": [
        "ZnCl2",
        "H2O",
        "CO2"
      ],
      "c": "",
      "nm": "碳酸盐与酸反应",
      "t": "复分解"
    },
    {
      "r": [
        "CH4",
        "O2"
      ],
      "p": [
        "CO2",
        "H2O"
      ],
      "c": "点燃",
      "nm": "甲烷燃烧",
      "t": "氧化还原"
    },
    {
      "r": [
        "C2H5OH",
        "O2"
      ],
      "p": [
        "CO2",
        "H2O"
      ],
      "c": "点燃",
      "nm": "乙醇燃烧",
      "t": "氧化还原"
    },
    {
      "r": [
        "NH4Cl",
        "NaOH"
      ],
      "p": [
        "NaCl",
        "H2O",
        "NH3"
      ],
      "c": "",
      "nm": "铵盐与碱共热（检验铵根）",
      "t": "复分解"
    },
    {
      "r": [
        "NH4Cl",
        "Ca(OH)2"
      ],
      "p": [
        "CaCl2",
        "H2O",
        "NH3"
      ],
      "c": "",
      "nm": "实验室制氨气",
      "t": "复分解"
    },
    {
      "r": [
        "H2",
        "O2"
      ],
      "p": [
        "H2O"
      ],
      "c": "点燃",
      "nm": "氢气燃烧",
      "t": "化合"
    },
    {
      "r": [
        "KOH",
        "CO2"
      ],
      "p": [
        "K2CO3",
        "H2O"
      ],
      "c": "",
      "nm": "吸收二氧化碳",
      "t": "复分解"
    },
    {
      "r": [
        "NaOH",
        "Al2O3"
      ],
      "p": [
        "NaAlO2",
        "H2O"
      ],
      "c": "",
      "nm": "两性氧化物与碱反应",
      "t": "复分解"
    },
    {
      "r": [
        "HCl",
        "Al2O3"
      ],
      "p": [
        "AlCl3",
        "H2O"
      ],
      "c": "",
      "nm": "两性氧化物与酸反应",
      "t": "复分解"
    },
    {
      "r": [
        "H2SO4",
        "Fe2O3"
      ],
      "p": [
        "Fe2SO43",
        "H2O"
      ],
      "c": "",
      "nm": "金属氧化物与酸反应",
      "t": "复分解"
    },
    {
      "r": [
        "H2SO4",
        "Al2O3"
      ],
      "p": [
        "Al2SO43",
        "H2O"
      ],
      "c": "",
      "nm": "两性氧化物与酸反应",
      "t": "复分解"
    },
    {
      "r": [
        "HNO3",
        "Fe2O3"
      ],
      "p": [
        "FeNO33",
        "H2O"
      ],
      "c": "",
      "nm": "金属氧化物与酸反应",
      "t": "复分解"
    },
    {
      "r": [
        "HCl",
        "NH3H2O"
      ],
      "p": [
        "NH4Cl",
        "H2O"
      ],
      "c": "",
      "nm": "中和反应",
      "t": "中和"
    },
    {
      "r": [
        "HCl",
        "Mg(OH)2"
      ],
      "p": [
        "MgCl2",
        "H2O"
      ],
      "c": "",
      "nm": "碱与酸反应",
      "t": "中和"
    },
    {
      "r": [
        "H2SO4",
        "NH3H2O"
      ],
      "p": [
        "NH42SO4",
        "H2O"
      ],
      "c": "",
      "nm": "中和反应",
      "t": "中和"
    },
    {
      "r": [
        "H2SO4",
        "Fe(OH)3"
      ],
      "p": [
        "Fe2SO43",
        "H2O"
      ],
      "c": "",
      "nm": "碱与酸反应",
      "t": "中和"
    },
    {
      "r": [
        "H2SO4",
        "Mg(OH)2"
      ],
      "p": [
        "MgSO4",
        "H2O"
      ],
      "c": "",
      "nm": "碱与酸反应",
      "t": "中和"
    },
    {
      "r": [
        "HNO3",
        "Fe(OH)3"
      ],
      "p": [
        "FeNO33",
        "H2O"
      ],
      "c": "",
      "nm": "碱与酸反应",
      "t": "中和"
    },
    {
      "r": [
        "H2C2O4",
        "NaOH"
      ],
      "p": [
        "Na2C2O4",
        "H2O"
      ],
      "c": "",
      "nm": "中和反应",
      "t": "中和"
    },
    {
      "r": [
        "NH3H2O",
        "NH4HCO3"
      ],
      "p": [
        "NH42CO3",
        "H2O"
      ],
      "c": "",
      "nm": "氨水与碳酸氢铵",
      "t": "复分解"
    },
    {
      "r": [
        "NH3",
        "O2"
      ],
      "p": [
        "NO",
        "H2O"
      ],
      "c": "催化剂加热",
      "nm": "氨的催化氧化",
      "t": "氧化还原"
    },
    {
      "r": [
        "NH3",
        "O2"
      ],
      "p": [
        "N2",
        "H2O"
      ],
      "c": "点燃",
      "nm": "氨在纯氧中燃烧",
      "t": "氧化还原"
    },
    {
      "r": [
        "Na2O2",
        "H2O"
      ],
      "p": [
        "NaOH",
        "O2"
      ],
      "c": "",
      "nm": "过氧化钠与水反应",
      "t": "化合"
    },
    {
      "r": [
        "Na2O2",
        "CO2"
      ],
      "p": [
        "Na2CO3",
        "O2"
      ],
      "c": "",
      "nm": "过氧化钠与二氧化碳反应",
      "t": "化合"
    },
    {
      "r": [
        "FeNO33",
        "NH42CO3"
      ],
      "p": [
        "Fe(OH)3",
        "CO2",
        "NH4NO3"
      ],
      "c": "水溶液中",
      "nm": "双水解反应：Al³⁺/Fe³⁺ 与弱酸酸根互相促进水解，反应进行到底",
      "t": "双水解"
    },
    {
      "r": [
        "H2",
        "Cl2"
      ],
      "p": [
        "HCl"
      ],
      "c": "点燃",
      "nm": "氢气在氯气中燃烧",
      "t": "化合"
    },
    {
      "r": [
        "CaO",
        "H2O"
      ],
      "p": [
        "Ca(OH)2"
      ],
      "c": "",
      "nm": "生石灰与水反应（放热）",
      "t": "化合"
    },
    {
      "r": [
        "NH3H2O",
        "CO2"
      ],
      "p": [
        "NH4HCO3"
      ],
      "c": "",
      "nm": "氨水吸收二氧化碳",
      "t": "复分解"
    },
    {
      "r": [
        "NH4HCO3",
        "NaCl"
      ],
      "p": [
        "NaHCO3",
        "NH4Cl"
      ],
      "c": "",
      "nm": "侯氏制碱法中间反应",
      "t": "复分解"
    },
    {
      "r": [
        "Cl2",
        "H2O"
      ],
      "p": [
        "HCl",
        "HClO"
      ],
      "c": "",
      "nm": "氯气溶于水",
      "t": "氧化还原"
    },
    {
      "r": [
        "Cu",
        "Cl2"
      ],
      "p": [
        "CuCl2"
      ],
      "c": "点燃",
      "nm": "铜在氯气中燃烧",
      "t": "化合"
    },
    {
      "r": [
        "Fe",
        "Cl2"
      ],
      "p": [
        "FeCl3"
      ],
      "c": "点燃",
      "nm": "铁在氯气中燃烧",
      "t": "化合"
    },
    {
      "r": [
        "Na",
        "Cl2"
      ],
      "p": [
        "NaCl"
      ],
      "c": "点燃",
      "nm": "钠在氯气中燃烧",
      "t": "化合"
    },
    {
      "r": [
        "NH3",
        "CO2",
        "H2O"
      ],
      "p": [
        "NH4HCO3"
      ],
      "c": "",
      "nm": "氨气、二氧化碳与水反应",
      "t": "复分解"
    },
    {
      "r": [
        "Mg",
        "FeNO32"
      ],
      "p": [
        "MgNO32",
        "Fe"
      ],
      "c": "",
      "nm": "较活泼金属把较不活泼金属从其盐溶液中置换出来",
      "t": "置换"
    },
    {
      "r": [
        "Zn",
        "Fe2SO43"
      ],
      "p": [
        "ZnSO4",
        "Fe"
      ],
      "c": "",
      "nm": "较活泼金属把较不活泼金属从其盐溶液中置换出来",
      "t": "置换"
    },
    {
      "r": [
        "NO2",
        "H2O"
      ],
      "p": [
        "HNO3",
        "NO"
      ],
      "c": "",
      "nm": "二氧化氮与水反应",
      "t": "化合"
    },
    {
      "r": [
        "Mg3N2",
        "H2O"
      ],
      "p": [
        "Mg(OH)2",
        "NH3"
      ],
      "c": "",
      "nm": "氮化镁与水反应",
      "t": "化合"
    },
    {
      "r": [
        "NH3",
        "Cl2"
      ],
      "p": [
        "N2",
        "HCl"
      ],
      "c": "",
      "nm": "氨气与氯气反应",
      "t": "氧化还原"
    },
    {
      "r": [
        "AlCl3",
        "NH4HCO3"
      ],
      "p": [
        "Al(OH)3",
        "CO2",
        "NH4Cl"
      ],
      "c": "水溶液中",
      "nm": "双水解反应：Al³⁺/Fe³⁺ 与弱酸酸根互相促进水解，反应进行到底",
      "t": "双水解"
    },
    {
      "r": [
        "Al2SO43",
        "Na2CO3"
      ],
      "p": [
        "Al(OH)3",
        "CO2",
        "Na2SO4"
      ],
      "c": "水溶液中",
      "nm": "双水解反应：Al³⁺/Fe³⁺ 与弱酸酸根互相促进水解，反应进行到底",
      "t": "双水解"
    },
    {
      "r": [
        "Al2SO43",
        "NaHCO3"
      ],
      "p": [
        "Al(OH)3",
        "CO2",
        "Na2SO4"
      ],
      "c": "水溶液中",
      "nm": "双水解反应：Al³⁺/Fe³⁺ 与弱酸酸根互相促进水解，反应进行到底",
      "t": "双水解"
    },
    {
      "r": [
        "Al2SO43",
        "NH4HCO3"
      ],
      "p": [
        "Al(OH)3",
        "CO2",
        "m_NH4_SO4"
      ],
      "c": "水溶液中",
      "nm": "双水解反应：Al³⁺/Fe³⁺ 与弱酸酸根互相促进水解，反应进行到底",
      "t": "双水解"
    },
    {
      "r": [
        "AlNO33",
        "Na2CO3"
      ],
      "p": [
        "Al(OH)3",
        "CO2",
        "NaNO3"
      ],
      "c": "水溶液中",
      "nm": "双水解反应：Al³⁺/Fe³⁺ 与弱酸酸根互相促进水解，反应进行到底",
      "t": "双水解"
    },
    {
      "r": [
        "AlNO33",
        "NaHCO3"
      ],
      "p": [
        "Al(OH)3",
        "CO2",
        "NaNO3"
      ],
      "c": "水溶液中",
      "nm": "双水解反应：Al³⁺/Fe³⁺ 与弱酸酸根互相促进水解，反应进行到底",
      "t": "双水解"
    },
    {
      "r": [
        "H2SO4",
        "ZnO"
      ],
      "p": [
        "ZnSO4",
        "H2O"
      ],
      "c": "",
      "nm": "金属氧化物与酸反应",
      "t": "复分解"
    },
    {
      "r": [
        "HNO3",
        "MgO"
      ],
      "p": [
        "MgNO32",
        "H2O"
      ],
      "c": "",
      "nm": "金属氧化物与酸反应",
      "t": "复分解"
    },
    {
      "r": [
        "ZnOH2",
        "H2SO4"
      ],
      "p": [
        "ZnSO4",
        "H2O"
      ],
      "c": "",
      "nm": "氢氧化锌与酸反应",
      "t": "复分解"
    },
    {
      "r": [
        "Fe",
        "O2"
      ],
      "p": [
        "Fe3O4"
      ],
      "c": "点燃",
      "nm": "铁在氧气中燃烧",
      "t": "化合"
    },
    {
      "r": [
        "Mg",
        "O2"
      ],
      "p": [
        "MgO"
      ],
      "c": "点燃",
      "nm": "镁条燃烧",
      "t": "化合"
    },
    {
      "r": [
        "Zn",
        "O2"
      ],
      "p": [
        "ZnO"
      ],
      "c": "加热",
      "nm": "锌在空气中氧化",
      "t": "化合"
    },
    {
      "r": [
        "CuSO4",
        "Na2CO3"
      ],
      "p": [
        "Cu2OH2CO3",
        "Na2SO4"
      ],
      "c": "",
      "nm": "生成碱式碳酸铜沉淀",
      "t": "复分解"
    },
    {
      "r": [
        "H2S",
        "O2"
      ],
      "p": [
        "SO2",
        "H2O"
      ],
      "c": "点燃",
      "nm": "硫化氢燃烧",
      "t": "氧化还原"
    },
    {
      "r": [
        "NH4Cl",
        "NaNO2"
      ],
      "p": [
        "N2",
        "NaCl",
        "H2O"
      ],
      "c": "加热",
      "nm": "铵盐与亚硝酸盐反应制氮气",
      "t": "氧化还原"
    },
    {
      "r": [
        "NH42SO4",
        "NaOH"
      ],
      "p": [
        "Na2SO4",
        "H2O",
        "NH3"
      ],
      "c": "",
      "nm": "铵盐与碱共热",
      "t": "复分解"
    },
    {
      "r": [
        "NH42SO4",
        "Ca(OH)2"
      ],
      "p": [
        "CaSO4",
        "H2O",
        "NH3"
      ],
      "c": "",
      "nm": "铵盐与熟石灰",
      "t": "复分解"
    },
    {
      "r": [
        "H2C2O4",
        "KMnO4"
      ],
      "p": [
        "K2C2O4",
        "MnC2O4",
        "H2O"
      ],
      "c": "",
      "nm": "草酸与高锰酸钾",
      "t": "复分解"
    },
    {
      "r": [
        "Cu",
        "Fe2SO43"
      ],
      "p": [
        "FeSO4",
        "CuSO4"
      ],
      "c": "",
      "nm": "铜与硫酸铁反应",
      "t": "置换"
    },
    {
      "r": [
        "NaF",
        "HCl"
      ],
      "p": [
        "NaCl",
        "HF"
      ],
      "c": "",
      "nm": "强酸制弱酸（氢氟酸）",
      "t": "复分解"
    },
    {
      "r": [
        "CH3COONa",
        "HCl"
      ],
      "p": [
        "NaCl",
        "CH3COOH"
      ],
      "c": "",
      "nm": "强酸制弱酸（醋酸）",
      "t": "复分解"
    },
    {
      "r": [
        "H2SO4",
        "FeS"
      ],
      "p": [
        "FeSO4",
        "H2S"
      ],
      "c": "",
      "nm": "硫化物与酸反应",
      "t": "复分解"
    },
    {
      "r": [
        "Na2CO3",
        "SiO2"
      ],
      "p": [
        "Na2SiO3",
        "CO2"
      ],
      "c": "高温",
      "nm": "工业制玻璃",
      "t": "复分解"
    },
    {
      "r": [
        "AlNO33",
        "NH42CO3"
      ],
      "p": [
        "Al(OH)3",
        "CO2",
        "NH4NO3"
      ],
      "c": "水溶液中",
      "nm": "双水解反应：Al³⁺/Fe³⁺ 与弱酸酸根互相促进水解，反应进行到底",
      "t": "双水解"
    },
    {
      "r": [
        "Fe2SO43",
        "K2CO3"
      ],
      "p": [
        "Fe(OH)3",
        "CO2",
        "K2SO4"
      ],
      "c": "水溶液中",
      "nm": "双水解反应：Al³⁺/Fe³⁺ 与弱酸酸根互相促进水解，反应进行到底",
      "t": "双水解"
    },
    {
      "r": [
        "Fe2SO43",
        "NH42CO3"
      ],
      "p": [
        "Fe(OH)3",
        "CO2",
        "m_NH4_SO4"
      ],
      "c": "水溶液中",
      "nm": "双水解反应：Al³⁺/Fe³⁺ 与弱酸酸根互相促进水解，反应进行到底",
      "t": "双水解"
    },
    {
      "r": [
        "FeNO33",
        "K2CO3"
      ],
      "p": [
        "Fe(OH)3",
        "CO2",
        "KNO3"
      ],
      "c": "水溶液中",
      "nm": "双水解反应：Al³⁺/Fe³⁺ 与弱酸酸根互相促进水解，反应进行到底",
      "t": "双水解"
    },
    {
      "r": [
        "Na",
        "O2"
      ],
      "p": [
        "Na2O"
      ],
      "c": "",
      "nm": "钠在空气中氧化",
      "t": "化合"
    },
    {
      "r": [
        "Na",
        "O2"
      ],
      "p": [
        "Na2O2"
      ],
      "c": "点燃",
      "nm": "钠在氧气中燃烧",
      "t": "化合"
    },
    {
      "r": [
        "K",
        "O2"
      ],
      "p": [
        "KO2"
      ],
      "c": "点燃",
      "nm": "钾在氧气中燃烧",
      "t": "化合"
    },
    {
      "r": [
        "HCl",
        "NaAlO2"
      ],
      "p": [
        "NaCl",
        "Al(OH)3"
      ],
      "c": "",
      "nm": "偏铝酸盐与酸反应",
      "t": "复分解"
    },
    {
      "r": [
        "NH3H2O",
        "MgCl2"
      ],
      "p": [
        "Mg(OH)2",
        "NH4Cl"
      ],
      "c": "",
      "nm": "氨水与盐反应",
      "t": "复分解"
    },
    {
      "r": [
        "CaCl2",
        "Na2C2O4"
      ],
      "p": [
        "CaC2O4",
        "NaCl"
      ],
      "c": "",
      "nm": "生成草酸钙沉淀",
      "t": "复分解"
    },
    {
      "r": [
        "Cl2",
        "NaI"
      ],
      "p": [
        "NaCl",
        "I2"
      ],
      "c": "",
      "nm": "氯气置换碘",
      "t": "氧化还原"
    },
    {
      "r": [
        "NH3",
        "CO2",
        "H2O"
      ],
      "p": [
        "NH42CO3"
      ],
      "c": "",
      "nm": "氨气与过量二氧化碳反应",
      "t": "复分解"
    },
    {
      "r": [
        "NH3",
        "MgCl2",
        "H2O"
      ],
      "p": [
        "Mg(OH)2",
        "NH4Cl"
      ],
      "c": "",
      "nm": "氨水与氯化镁",
      "t": "复分解"
    },
    {
      "r": [
        "NH42SO4",
        "BaNO32"
      ],
      "p": [
        "BaSO4",
        "NH4NO3"
      ],
      "c": "",
      "nm": "检验硫酸根离子",
      "t": "复分解"
    },
    {
      "r": [
        "CaCl2",
        "NaF"
      ],
      "p": [
        "CaF2",
        "NaCl"
      ],
      "c": "",
      "nm": "生成氟化钙沉淀",
      "t": "复分解"
    },
    {
      "r": [
        "Ca(OH)2",
        "Na2C2O4"
      ],
      "p": [
        "CaC2O4",
        "NaOH"
      ],
      "c": "",
      "nm": "生成草酸钙沉淀",
      "t": "复分解"
    },
    {
      "r": [
        "BaCl2",
        "Na2C2O4"
      ],
      "p": [
        "BaC2O4",
        "NaCl"
      ],
      "c": "",
      "nm": "生成草酸钡沉淀",
      "t": "复分解"
    },
    {
      "r": [
        "NH42CO3",
        "CaCl2"
      ],
      "p": [
        "CaCO3",
        "NH4Cl"
      ],
      "c": "",
      "nm": "生成碳酸钙沉淀",
      "t": "复分解"
    },
    {
      "r": [
        "Mg",
        "FeCl2"
      ],
      "p": [
        "MgCl2",
        "Fe"
      ],
      "c": "",
      "nm": "较活泼金属把较不活泼金属从其盐溶液中置换出来",
      "t": "置换"
    },
    {
      "r": [
        "Al",
        "FeCl2"
      ],
      "p": [
        "AlCl3",
        "Fe"
      ],
      "c": "",
      "nm": "较活泼金属把较不活泼金属从其盐溶液中置换出来",
      "t": "置换"
    },
    {
      "r": [
        "Zn",
        "FeCl2"
      ],
      "p": [
        "ZnCl2",
        "Fe"
      ],
      "c": "",
      "nm": "较活泼金属把较不活泼金属从其盐溶液中置换出来",
      "t": "置换"
    },
    {
      "r": [
        "Al",
        "FeNO32"
      ],
      "p": [
        "AlNO33",
        "Fe"
      ],
      "c": "",
      "nm": "较活泼金属把较不活泼金属从其盐溶液中置换出来",
      "t": "置换"
    },
    {
      "r": [
        "Zn",
        "FeNO32"
      ],
      "p": [
        "ZnNO32",
        "Fe"
      ],
      "c": "",
      "nm": "较活泼金属把较不活泼金属从其盐溶液中置换出来",
      "t": "置换"
    },
    {
      "r": [
        "Mg",
        "Al2SO43"
      ],
      "p": [
        "MgSO4",
        "Al"
      ],
      "c": "",
      "nm": "较活泼金属把较不活泼金属从其盐溶液中置换出来",
      "t": "置换"
    },
    {
      "r": [
        "Mg",
        "AlCl3"
      ],
      "p": [
        "MgCl2",
        "Al"
      ],
      "c": "",
      "nm": "较活泼金属把较不活泼金属从其盐溶液中置换出来",
      "t": "置换"
    },
    {
      "r": [
        "Mg",
        "Fe2SO43"
      ],
      "p": [
        "MgSO4",
        "Fe"
      ],
      "c": "",
      "nm": "较活泼金属把较不活泼金属从其盐溶液中置换出来",
      "t": "置换"
    },
    {
      "r": [
        "Al",
        "Fe2SO43"
      ],
      "p": [
        "Al2SO43",
        "Fe"
      ],
      "c": "",
      "nm": "较活泼金属把较不活泼金属从其盐溶液中置换出来",
      "t": "置换"
    },
    {
      "r": [
        "N2",
        "O2"
      ],
      "p": [
        "NO"
      ],
      "c": "放电",
      "nm": "氮气与氧气在放电条件下反应",
      "t": "化合"
    },
    {
      "r": [
        "NH3",
        "Cl2"
      ],
      "p": [
        "N2",
        "NH4Cl"
      ],
      "c": "",
      "nm": "氨气与氯气反应",
      "t": "氧化还原"
    },
    {
      "r": [
        "NaOH",
        "SO2"
      ],
      "p": [
        "Na2SO3",
        "H2O"
      ],
      "c": "",
      "nm": "吸收二氧化硫",
      "t": "复分解"
    },
    {
      "r": [
        "NaOH",
        "SO3"
      ],
      "p": [
        "Na2SO4",
        "H2O"
      ],
      "c": "",
      "nm": "吸收三氧化硫",
      "t": "复分解"
    },
    {
      "r": [
        "NaOH",
        "SiO2"
      ],
      "p": [
        "Na2SiO3",
        "H2O"
      ],
      "c": "",
      "nm": "二氧化硅与碱反应",
      "t": "复分解"
    },
    {
      "r": [
        "NaOH",
        "Al(OH)3"
      ],
      "p": [
        "NaAlO2",
        "H2O"
      ],
      "c": "",
      "nm": "两性氢氧化物与碱反应",
      "t": "复分解"
    },
    {
      "r": [
        "HCl",
        "MgO"
      ],
      "p": [
        "MgCl2",
        "H2O"
      ],
      "c": "",
      "nm": "金属氧化物与酸反应",
      "t": "复分解"
    },
    {
      "r": [
        "HCl",
        "ZnO"
      ],
      "p": [
        "ZnCl2",
        "H2O"
      ],
      "c": "",
      "nm": "金属氧化物与酸反应",
      "t": "复分解"
    },
    {
      "r": [
        "H2SO4",
        "MgO"
      ],
      "p": [
        "MgSO4",
        "H2O"
      ],
      "c": "",
      "nm": "金属氧化物与酸反应",
      "t": "复分解"
    },
    {
      "r": [
        "HCl",
        "ZnOH2"
      ],
      "p": [
        "ZnCl2",
        "H2O"
      ],
      "c": "",
      "nm": "碱与酸反应",
      "t": "中和"
    },
    {
      "r": [
        "HCl",
        "FeOH2"
      ],
      "p": [
        "FeCl2",
        "H2O"
      ],
      "c": "",
      "nm": "碱与酸反应",
      "t": "中和"
    },
    {
      "r": [
        "SiO2",
        "HF"
      ],
      "p": [
        "SiF4",
        "H2O"
      ],
      "c": "",
      "nm": "氢氟酸腐蚀玻璃",
      "t": "复分解"
    },
    {
      "r": [
        "ZnOH2",
        "NaOH"
      ],
      "p": [
        "Na2ZnO2",
        "H2O"
      ],
      "c": "",
      "nm": "氢氧化锌溶于强碱",
      "t": "复分解"
    },
    {
      "r": [
        "Fe",
        "Fe2SO43"
      ],
      "p": [
        "FeSO4"
      ],
      "c": "",
      "nm": "铁与硫酸铁反应",
      "t": "置换"
    },
    {
      "r": [
        "SO3",
        "H2O"
      ],
      "p": [
        "H2SO4"
      ],
      "c": "",
      "nm": "三氧化硫与水反应",
      "t": "化合"
    },
    {
      "r": [
        "Na2O",
        "H2O"
      ],
      "p": [
        "NaOH"
      ],
      "c": "",
      "nm": "氧化钠与水反应",
      "t": "化合"
    },
    {
      "r": [
        "BaO",
        "H2O"
      ],
      "p": [
        "Ba(OH)2"
      ],
      "c": "",
      "nm": "氧化钡与水反应",
      "t": "化合"
    },
    {
      "r": [
        "HCl",
        "Na3PO4"
      ],
      "p": [
        "NaCl",
        "H3PO4"
      ],
      "c": "",
      "nm": "强酸制弱酸（磷酸）",
      "t": "复分解"
    },
    {
      "r": [
        "Cl2",
        "NaBr"
      ],
      "p": [
        "NaCl",
        "Br2"
      ],
      "c": "",
      "nm": "氯气置换溴",
      "t": "氧化还原"
    },
    {
      "r": [
        "CaC2",
        "H2O"
      ],
      "p": [
        "Ca(OH)2",
        "C2H2"
      ],
      "c": "",
      "nm": "电石与水反应",
      "t": "化合"
    },
    {
      "r": [
        "NH3",
        "HNO3"
      ],
      "p": [
        "NH4NO3"
      ],
      "c": "",
      "nm": "氨气与硝酸反应",
      "t": "化合"
    },
    {
      "r": [
        "NH3",
        "H2O"
      ],
      "p": [
        "NH3H2O"
      ],
      "c": "",
      "nm": "氨气极易溶于水生成一水合氨",
      "t": "复分解"
    },
    {
      "r": [
        "H2SO4",
        "CaF2"
      ],
      "p": [
        "CaSO4",
        "HF"
      ],
      "c": "",
      "nm": "萤石制氢氟酸",
      "t": "复分解"
    },
    {
      "r": [
        "CH3COONa",
        "H2SO4"
      ],
      "p": [
        "Na2SO4",
        "CH3COOH"
      ],
      "c": "",
      "nm": "强酸制弱酸（醋酸）",
      "t": "复分解"
    },
    {
      "r": [
        "CH3COONa",
        "FeCl3"
      ],
      "p": [
        "CH3COO2Fe",
        "NaCl"
      ],
      "c": "",
      "nm": "醋酸钠与铁盐",
      "t": "复分解"
    },
    {
      "r": [
        "S",
        "O2"
      ],
      "p": [
        "SO2"
      ],
      "c": "点燃",
      "nm": "硫在氧气中燃烧",
      "t": "化合"
    },
    {
      "r": [
        "NO",
        "O2"
      ],
      "p": [
        "NO2"
      ],
      "c": "",
      "nm": "一氧化氮被氧化",
      "t": "化合"
    },
    {
      "r": [
        "N2",
        "H2"
      ],
      "p": [
        "NH3"
      ],
      "c": "高温高压催化剂",
      "nm": "工业合成氨",
      "t": "化合"
    },
    {
      "r": [
        "AlCl3",
        "K2CO3"
      ],
      "p": [
        "Al(OH)3",
        "CO2",
        "KCl"
      ],
      "c": "水溶液中",
      "nm": "双水解反应：Al³⁺/Fe³⁺ 与弱酸酸根互相促进水解，反应进行到底",
      "t": "双水解"
    },
    {
      "r": [
        "AlCl3",
        "NH42CO3"
      ],
      "p": [
        "Al(OH)3",
        "CO2",
        "NH4Cl"
      ],
      "c": "水溶液中",
      "nm": "双水解反应：Al³⁺/Fe³⁺ 与弱酸酸根互相促进水解，反应进行到底",
      "t": "双水解"
    },
    {
      "r": [
        "AlCl3",
        "Na2S"
      ],
      "p": [
        "Al(OH)3",
        "H2S",
        "NaCl"
      ],
      "c": "水溶液中",
      "nm": "双水解反应：Al³⁺/Fe³⁺ 与弱酸酸根互相促进水解，反应进行到底",
      "t": "双水解"
    },
    {
      "r": [
        "AlCl3",
        "Na2SO3"
      ],
      "p": [
        "Al(OH)3",
        "SO2",
        "NaCl"
      ],
      "c": "水溶液中",
      "nm": "双水解反应：Al³⁺/Fe³⁺ 与弱酸酸根互相促进水解，反应进行到底",
      "t": "双水解"
    },
    {
      "r": [
        "Al2SO43",
        "K2CO3"
      ],
      "p": [
        "Al(OH)3",
        "CO2",
        "K2SO4"
      ],
      "c": "水溶液中",
      "nm": "双水解反应：Al³⁺/Fe³⁺ 与弱酸酸根互相促进水解，反应进行到底",
      "t": "双水解"
    },
    {
      "r": [
        "Al2SO43",
        "NH42CO3"
      ],
      "p": [
        "Al(OH)3",
        "CO2",
        "m_NH4_SO4"
      ],
      "c": "水溶液中",
      "nm": "双水解反应：Al³⁺/Fe³⁺ 与弱酸酸根互相促进水解，反应进行到底",
      "t": "双水解"
    },
    {
      "r": [
        "AlNO33",
        "K2CO3"
      ],
      "p": [
        "Al(OH)3",
        "CO2",
        "KNO3"
      ],
      "c": "水溶液中",
      "nm": "双水解反应：Al³⁺/Fe³⁺ 与弱酸酸根互相促进水解，反应进行到底",
      "t": "双水解"
    },
    {
      "r": [
        "Fe2SO43",
        "Na2S"
      ],
      "p": [
        "Fe(OH)3",
        "H2S",
        "Na2SO4"
      ],
      "c": "水溶液中",
      "nm": "双水解反应：Al³⁺/Fe³⁺ 与弱酸酸根互相促进水解，反应进行到底",
      "t": "双水解"
    },
    {
      "r": [
        "Fe2SO43",
        "Na2SO3"
      ],
      "p": [
        "Fe(OH)3",
        "SO2",
        "Na2SO4"
      ],
      "c": "水溶液中",
      "nm": "双水解反应：Al³⁺/Fe³⁺ 与弱酸酸根互相促进水解，反应进行到底",
      "t": "双水解"
    },
    {
      "r": [
        "FeNO33",
        "Na2S"
      ],
      "p": [
        "Fe(OH)3",
        "H2S",
        "NaNO3"
      ],
      "c": "水溶液中",
      "nm": "双水解反应：Al³⁺/Fe³⁺ 与弱酸酸根互相促进水解，反应进行到底",
      "t": "双水解"
    },
    {
      "r": [
        "FeNO33",
        "Na2SO3"
      ],
      "p": [
        "Fe(OH)3",
        "SO2",
        "NaNO3"
      ],
      "c": "水溶液中",
      "nm": "双水解反应：Al³⁺/Fe³⁺ 与弱酸酸根互相促进水解，反应进行到底",
      "t": "双水解"
    },
    {
      "r": [
        "Si",
        "O2"
      ],
      "p": [
        "SiO2"
      ],
      "c": "加热",
      "nm": "硅在氧气中燃烧",
      "t": "化合"
    },
    {
      "r": [
        "NH3H2O",
        "AlCl3"
      ],
      "p": [
        "Al(OH)3",
        "NH4Cl"
      ],
      "c": "",
      "nm": "氨水与盐反应",
      "t": "复分解"
    },
    {
      "r": [
        "AgNO3",
        "Na3PO4"
      ],
      "p": [
        "Ag3PO4",
        "NaNO3"
      ],
      "c": "",
      "nm": "生成磷酸银沉淀",
      "t": "复分解"
    },
    {
      "r": [
        "AgNO3",
        "Na2S"
      ],
      "p": [
        "Ag2S",
        "NaNO3"
      ],
      "c": "",
      "nm": "生成硫化银沉淀",
      "t": "复分解"
    },
    {
      "r": [
        "Hg",
        "O2"
      ],
      "p": [
        "HgO"
      ],
      "c": "加热",
      "nm": "汞与氧气反应",
      "t": "氧化还原"
    },
    {
      "r": [
        "NH3",
        "AlCl3",
        "H2O"
      ],
      "p": [
        "Al(OH)3",
        "NH4Cl"
      ],
      "c": "",
      "nm": "氨水与氯化铝",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_S",
        "CuSO4"
      ],
      "p": [
        "CuS",
        "NH42SO4"
      ],
      "c": "",
      "nm": "生成硫化铜沉淀",
      "t": "复分解"
    },
    {
      "r": [
        "NH42CO3",
        "BaCl2"
      ],
      "p": [
        "BaCO3",
        "NH4Cl"
      ],
      "c": "",
      "nm": "生成碳酸钡沉淀",
      "t": "复分解"
    },
    {
      "r": [
        "NH42SO4",
        "BaCl2"
      ],
      "p": [
        "BaSO4",
        "NH4Cl"
      ],
      "c": "",
      "nm": "检验硫酸根",
      "t": "复分解"
    },
    {
      "r": [
        "AlCl3",
        "Na2SiO3"
      ],
      "p": [
        "Al(OH)3",
        "H2SiO3",
        "NaCl"
      ],
      "c": "水溶液中",
      "nm": "双水解反应：Al³⁺/Fe³⁺ 与弱酸酸根互相促进水解，反应进行到底",
      "t": "双水解"
    },
    {
      "r": [
        "Fe2SO43",
        "Na2SiO3"
      ],
      "p": [
        "Fe(OH)3",
        "H2SiO3",
        "Na2SO4"
      ],
      "c": "水溶液中",
      "nm": "双水解反应：Al³⁺/Fe³⁺ 与弱酸酸根互相促进水解，反应进行到底",
      "t": "双水解"
    },
    {
      "r": [
        "FeNO33",
        "Na2SiO3"
      ],
      "p": [
        "Fe(OH)3",
        "H2SiO3",
        "NaNO3"
      ],
      "c": "水溶液中",
      "nm": "双水解反应：Al³⁺/Fe³⁺ 与弱酸酸根互相促进水解，反应进行到底",
      "t": "双水解"
    },
    {
      "r": [
        "P",
        "O2"
      ],
      "p": [
        "P2O5"
      ],
      "c": "点燃",
      "nm": "红磷燃烧（测定空气中氧气含量）",
      "t": "化合"
    },
    {
      "r": [
        "SO2",
        "H2O"
      ],
      "p": [
        "H2SO3"
      ],
      "c": "",
      "nm": "二氧化硫溶于水",
      "t": "化合"
    },
    {
      "r": [
        "P2O5",
        "H2O"
      ],
      "p": [
        "H3PO4"
      ],
      "c": "",
      "nm": "五氧化二磷吸水",
      "t": "化合"
    },
    {
      "r": [
        "SO2",
        "O2"
      ],
      "p": [
        "SO3"
      ],
      "c": "催化剂加热",
      "nm": "接触法制硫酸",
      "t": "氧化还原"
    },
    {
      "r": [
        "NH3",
        "HCl"
      ],
      "p": [
        "NH4Cl"
      ],
      "c": "",
      "nm": "氨气与氯化氢反应（白烟）",
      "t": "化合"
    },
    {
      "r": [
        "NH3",
        "SO2",
        "H2O"
      ],
      "p": [
        "m_NH4_SO3"
      ],
      "c": "",
      "nm": "氨气吸收二氧化硫",
      "t": "复分解"
    },
    {
      "r": [
        "NH3",
        "H2SO4"
      ],
      "p": [
        "NH42SO4"
      ],
      "c": "",
      "nm": "氨气与硫酸反应",
      "t": "复分解"
    },
    {
      "r": [
        "NH3H2O",
        "SO2"
      ],
      "p": [
        "NH4HSO3"
      ],
      "c": "",
      "nm": "氨水吸收过量二氧化硫",
      "t": "复分解"
    },
    {
      "r": [
        "AgNO3",
        "NaF"
      ],
      "p": [
        "AgF",
        "NaNO3"
      ],
      "c": "",
      "nm": "生成氟化银",
      "t": "复分解"
    },
    {
      "r": [
        "Al2SO43",
        "Na2S"
      ],
      "p": [
        "Al(OH)3",
        "H2S",
        "Na2SO4"
      ],
      "c": "水溶液中",
      "nm": "双水解反应：Al³⁺/Fe³⁺ 与弱酸酸根互相促进水解，反应进行到底",
      "t": "双水解"
    },
    {
      "r": [
        "Al2SO43",
        "Na2SO3"
      ],
      "p": [
        "Al(OH)3",
        "SO2",
        "Na2SO4"
      ],
      "c": "水溶液中",
      "nm": "双水解反应：Al³⁺/Fe³⁺ 与弱酸酸根互相促进水解，反应进行到底",
      "t": "双水解"
    },
    {
      "r": [
        "AlNO33",
        "Na2S"
      ],
      "p": [
        "Al(OH)3",
        "H2S",
        "NaNO3"
      ],
      "c": "水溶液中",
      "nm": "双水解反应：Al³⁺/Fe³⁺ 与弱酸酸根互相促进水解，反应进行到底",
      "t": "双水解"
    },
    {
      "r": [
        "AlNO33",
        "Na2SO3"
      ],
      "p": [
        "Al(OH)3",
        "SO2",
        "NaNO3"
      ],
      "c": "水溶液中",
      "nm": "双水解反应：Al³⁺/Fe³⁺ 与弱酸酸根互相促进水解，反应进行到底",
      "t": "双水解"
    },
    {
      "r": [
        "Al2SO43",
        "Na2SiO3"
      ],
      "p": [
        "Al(OH)3",
        "H2SiO3",
        "Na2SO4"
      ],
      "c": "水溶液中",
      "nm": "双水解反应：Al³⁺/Fe³⁺ 与弱酸酸根互相促进水解，反应进行到底",
      "t": "双水解"
    },
    {
      "r": [
        "AlNO33",
        "Na2SiO3"
      ],
      "p": [
        "Al(OH)3",
        "H2SiO3",
        "NaNO3"
      ],
      "c": "水溶液中",
      "nm": "双水解反应：Al³⁺/Fe³⁺ 与弱酸酸根互相促进水解，反应进行到底",
      "t": "双水解"
    },
    {
      "r": [
        "Br2",
        "NaI"
      ],
      "p": [
        "NaBr",
        "I2"
      ],
      "c": "",
      "nm": "溴置换碘",
      "t": "氧化还原"
    },
    {
      "r": [
        "Ba(NO3)2",
        "Na2SO4"
      ],
      "p": [
        "BaSO4",
        "NaNO3"
      ],
      "c": "",
      "nm": "生成硫酸钡沉淀",
      "t": "复分解"
    },
    {
      "r": [
        "HCl",
        "Na2CO3"
      ],
      "p": [
        "CO2",
        "H2O",
        "NaCl"
      ],
      "c": "",
      "nm": "复分解反应（生成气体与水）",
      "t": "复分解"
    },
    {
      "r": [
        "HCl",
        "NaHCO3"
      ],
      "p": [
        "CO2",
        "H2O",
        "NaCl"
      ],
      "c": "",
      "nm": "复分解反应（生成气体与水）",
      "t": "复分解"
    },
    {
      "r": [
        "HNO3",
        "NH4HCO3"
      ],
      "p": [
        "CO2",
        "H2O",
        "NH4NO3"
      ],
      "c": "",
      "nm": "复分解反应（生成气体与水）",
      "t": "复分解"
    },
    {
      "r": [
        "HCl",
        "NH4HCO3"
      ],
      "p": [
        "CO2",
        "H2O",
        "NH4Cl"
      ],
      "c": "",
      "nm": "复分解反应（生成气体与水）",
      "t": "复分解"
    },
    {
      "r": [
        "H2SO4",
        "NH4HCO3"
      ],
      "p": [
        "CO2",
        "H2O",
        "m_NH4_SO4"
      ],
      "c": "",
      "nm": "复分解反应（生成气体与水）",
      "t": "复分解"
    },
    {
      "r": [
        "H2SO4",
        "Na2CO3"
      ],
      "p": [
        "CO2",
        "H2O",
        "Na2SO4"
      ],
      "c": "",
      "nm": "复分解反应（生成气体与水）",
      "t": "复分解"
    },
    {
      "r": [
        "H2SO4",
        "NaHCO3"
      ],
      "p": [
        "CO2",
        "H2O",
        "Na2SO4"
      ],
      "c": "",
      "nm": "复分解反应（生成气体与水）",
      "t": "复分解"
    },
    {
      "r": [
        "HNO3",
        "Na2CO3"
      ],
      "p": [
        "CO2",
        "H2O",
        "NaNO3"
      ],
      "c": "",
      "nm": "复分解反应（生成气体与水）",
      "t": "复分解"
    },
    {
      "r": [
        "HNO3",
        "NaHCO3"
      ],
      "p": [
        "CO2",
        "H2O",
        "NaNO3"
      ],
      "c": "",
      "nm": "复分解反应（生成气体与水）",
      "t": "复分解"
    },
    {
      "r": [
        "HF",
        "NH4HCO3"
      ],
      "p": [
        "CO2",
        "H2O",
        "m_NH4_F"
      ],
      "c": "",
      "nm": "复分解反应（生成气体与水）",
      "t": "复分解"
    },
    {
      "r": [
        "HF",
        "Na2CO3"
      ],
      "p": [
        "CO2",
        "H2O",
        "NaF"
      ],
      "c": "",
      "nm": "复分解反应（生成气体与水）",
      "t": "复分解"
    },
    {
      "r": [
        "HF",
        "NaHCO3"
      ],
      "p": [
        "CO2",
        "H2O",
        "NaF"
      ],
      "c": "",
      "nm": "复分解反应（生成气体与水）",
      "t": "复分解"
    },
    {
      "r": [
        "CH3COOH",
        "NH4HCO3"
      ],
      "p": [
        "CO2",
        "H2O",
        "m_NH4_CH3COO"
      ],
      "c": "",
      "nm": "复分解反应（生成气体与水）",
      "t": "复分解"
    },
    {
      "r": [
        "CH3COOH",
        "Na2CO3"
      ],
      "p": [
        "CO2",
        "H2O",
        "CH3COONa"
      ],
      "c": "",
      "nm": "复分解反应（生成气体与水）",
      "t": "复分解"
    },
    {
      "r": [
        "CH3COOH",
        "NaHCO3"
      ],
      "p": [
        "CO2",
        "H2O",
        "CH3COONa"
      ],
      "c": "",
      "nm": "复分解反应（生成气体与水）",
      "t": "复分解"
    },
    {
      "r": [
        "H2C2O4",
        "NH4HCO3"
      ],
      "p": [
        "CO2",
        "H2O",
        "m_NH4_C2O4"
      ],
      "c": "",
      "nm": "复分解反应（生成气体与水）",
      "t": "复分解"
    },
    {
      "r": [
        "HCl",
        "BaHCO32"
      ],
      "p": [
        "CO2",
        "H2O",
        "BaCl2"
      ],
      "c": "",
      "nm": "复分解反应（生成气体与水）",
      "t": "复分解"
    },
    {
      "r": [
        "HCl",
        "CaHCO32"
      ],
      "p": [
        "CO2",
        "H2O",
        "CaCl2"
      ],
      "c": "",
      "nm": "复分解反应（生成气体与水）",
      "t": "复分解"
    },
    {
      "r": [
        "HNO3",
        "m_NH4_CO3"
      ],
      "p": [
        "CO2",
        "H2O",
        "NH4NO3"
      ],
      "c": "",
      "nm": "复分解反应（生成气体与水）",
      "t": "复分解"
    },
    {
      "r": [
        "HNO3",
        "BaHCO32"
      ],
      "p": [
        "CO2",
        "H2O",
        "BaNO32"
      ],
      "c": "",
      "nm": "复分解反应（生成气体与水）",
      "t": "复分解"
    },
    {
      "r": [
        "HNO3",
        "MgHCO32"
      ],
      "p": [
        "CO2",
        "H2O",
        "MgNO32"
      ],
      "c": "",
      "nm": "复分解反应（生成气体与水）",
      "t": "复分解"
    },
    {
      "r": [
        "NaOH",
        "FeCl3"
      ],
      "p": [
        "NaCl",
        "Fe(OH)3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "NaOH",
        "CuCl2"
      ],
      "p": [
        "NaCl",
        "Cu(OH)2"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2CO3",
        "Ca(OH)2"
      ],
      "p": [
        "NaOH",
        "CaCO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2CO3",
        "CaCl2"
      ],
      "p": [
        "NaCl",
        "CaCO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Ba(OH)2",
        "MgNO32"
      ],
      "p": [
        "BaNO32",
        "Mg(OH)2"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Ba(OH)2",
        "FeCl3"
      ],
      "p": [
        "BaCl2",
        "Fe(OH)3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Ba(OH)2",
        "CuCl2"
      ],
      "p": [
        "BaCl2",
        "Cu(OH)2"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Ba(OH)2",
        "CuNO32"
      ],
      "p": [
        "BaNO32",
        "Cu(OH)2"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Ca(OH)2",
        "FeCl3"
      ],
      "p": [
        "CaCl2",
        "Fe(OH)3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Ca(OH)2",
        "CuCl2"
      ],
      "p": [
        "CaCl2",
        "Cu(OH)2"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "HCl",
        "NaOH"
      ],
      "p": [
        "H2O",
        "NaCl"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "HCl",
        "Ba(OH)2"
      ],
      "p": [
        "H2O",
        "BaCl2"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "HCl",
        "Ca(OH)2"
      ],
      "p": [
        "H2O",
        "CaCl2"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "HNO3",
        "Ba(OH)2"
      ],
      "p": [
        "H2O",
        "BaNO32"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "H2SO4",
        "BaHCO32"
      ],
      "p": [
        "CO2",
        "H2O",
        "BaSO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "HF",
        "BaHCO32"
      ],
      "p": [
        "CO2",
        "H2O",
        "m_Ba_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "HF",
        "MgHCO32"
      ],
      "p": [
        "CO2",
        "H2O",
        "m_Mg_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "H2C2O4",
        "CaHCO32"
      ],
      "p": [
        "CO2",
        "H2O",
        "CaC2O4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Ba(OH)2",
        "CuSO4"
      ],
      "p": [
        "BaSO4",
        "Cu(OH)2"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "H2SO4",
        "Ba(OH)2"
      ],
      "p": [
        "H2O",
        "BaSO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "HF",
        "Ba(OH)2"
      ],
      "p": [
        "H2O",
        "m_Ba_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "H2C2O4",
        "Ca(OH)2"
      ],
      "p": [
        "H2O",
        "CaC2O4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "HCl",
        "m_NH4_CO3"
      ],
      "p": [
        "CO2",
        "H2O",
        "NH4Cl"
      ],
      "c": "",
      "nm": "复分解反应（生成气体与水）",
      "t": "复分解"
    },
    {
      "r": [
        "HCl",
        "Na2SO3"
      ],
      "p": [
        "SO2",
        "H2O",
        "NaCl"
      ],
      "c": "",
      "nm": "复分解反应（生成气体与水）",
      "t": "复分解"
    },
    {
      "r": [
        "HCl",
        "K2CO3"
      ],
      "p": [
        "CO2",
        "H2O",
        "KCl"
      ],
      "c": "",
      "nm": "复分解反应（生成气体与水）",
      "t": "复分解"
    },
    {
      "r": [
        "HCl",
        "m_K_HCO3"
      ],
      "p": [
        "CO2",
        "H2O",
        "KCl"
      ],
      "c": "",
      "nm": "复分解反应（生成气体与水）",
      "t": "复分解"
    },
    {
      "r": [
        "HCl",
        "MgHCO32"
      ],
      "p": [
        "CO2",
        "H2O",
        "MgCl2"
      ],
      "c": "",
      "nm": "复分解反应（生成气体与水）",
      "t": "复分解"
    },
    {
      "r": [
        "HCl",
        "AgNO3"
      ],
      "p": [
        "HNO3",
        "AgCl"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "H2SO4",
        "m_NH4_CO3"
      ],
      "p": [
        "CO2",
        "H2O",
        "m_NH4_SO4"
      ],
      "c": "",
      "nm": "复分解反应（生成气体与水）",
      "t": "复分解"
    },
    {
      "r": [
        "H2SO4",
        "K2CO3"
      ],
      "p": [
        "CO2",
        "H2O",
        "K2SO4"
      ],
      "c": "",
      "nm": "复分解反应（生成气体与水）",
      "t": "复分解"
    },
    {
      "r": [
        "H2SO4",
        "m_K_HCO3"
      ],
      "p": [
        "CO2",
        "H2O",
        "K2SO4"
      ],
      "c": "",
      "nm": "复分解反应（生成气体与水）",
      "t": "复分解"
    },
    {
      "r": [
        "H2SO4",
        "BaCl2"
      ],
      "p": [
        "HCl",
        "BaSO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "H2SO4",
        "BaNO32"
      ],
      "p": [
        "HNO3",
        "BaSO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "H2SO4",
        "CaHCO32"
      ],
      "p": [
        "CO2",
        "H2O",
        "CaSO4"
      ],
      "c": "",
      "nm": "复分解反应（生成气体与水）",
      "t": "复分解"
    },
    {
      "r": [
        "H2SO4",
        "MgHCO32"
      ],
      "p": [
        "CO2",
        "H2O",
        "MgSO4"
      ],
      "c": "",
      "nm": "复分解反应（生成气体与水）",
      "t": "复分解"
    },
    {
      "r": [
        "HNO3",
        "m_NH4_SO3"
      ],
      "p": [
        "SO2",
        "H2O",
        "NH4NO3"
      ],
      "c": "",
      "nm": "复分解反应（生成气体与水）",
      "t": "复分解"
    },
    {
      "r": [
        "HNO3",
        "K2CO3"
      ],
      "p": [
        "CO2",
        "H2O",
        "KNO3"
      ],
      "c": "",
      "nm": "复分解反应（生成气体与水）",
      "t": "复分解"
    },
    {
      "r": [
        "HNO3",
        "m_K_HCO3"
      ],
      "p": [
        "CO2",
        "H2O",
        "KNO3"
      ],
      "c": "",
      "nm": "复分解反应（生成气体与水）",
      "t": "复分解"
    },
    {
      "r": [
        "HNO3",
        "CaHCO32"
      ],
      "p": [
        "CO2",
        "H2O",
        "CaNO32"
      ],
      "c": "",
      "nm": "复分解反应（生成气体与水）",
      "t": "复分解"
    },
    {
      "r": [
        "HF",
        "m_NH4_CO3"
      ],
      "p": [
        "CO2",
        "H2O",
        "m_NH4_F"
      ],
      "c": "",
      "nm": "复分解反应（生成气体与水）",
      "t": "复分解"
    },
    {
      "r": [
        "HF",
        "K2CO3"
      ],
      "p": [
        "CO2",
        "H2O",
        "m_K_F"
      ],
      "c": "",
      "nm": "复分解反应（生成气体与水）",
      "t": "复分解"
    },
    {
      "r": [
        "HF",
        "m_K_HCO3"
      ],
      "p": [
        "CO2",
        "H2O",
        "m_K_F"
      ],
      "c": "",
      "nm": "复分解反应（生成气体与水）",
      "t": "复分解"
    },
    {
      "r": [
        "HF",
        "BaCl2"
      ],
      "p": [
        "HCl",
        "m_Ba_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "HF",
        "BaNO32"
      ],
      "p": [
        "HNO3",
        "m_Ba_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "HF",
        "MgNO32"
      ],
      "p": [
        "HNO3",
        "m_Mg_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "HF",
        "ZnSO4"
      ],
      "p": [
        "H2SO4",
        "m_Zn_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "HF",
        "FeSO4"
      ],
      "p": [
        "H2SO4",
        "m_Fe2_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "HF",
        "FeCl3"
      ],
      "p": [
        "HCl",
        "m_Fe3_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "HF",
        "CuCl2"
      ],
      "p": [
        "HCl",
        "m_Cu_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "HF",
        "CuSO4"
      ],
      "p": [
        "H2SO4",
        "m_Cu_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "HF",
        "CuNO32"
      ],
      "p": [
        "HNO3",
        "m_Cu_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "HClO",
        "NH4HCO3"
      ],
      "p": [
        "CO2",
        "H2O",
        "m_NH4_ClO"
      ],
      "c": "",
      "nm": "复分解反应（生成气体与水）",
      "t": "复分解"
    },
    {
      "r": [
        "HClO",
        "Na2CO3"
      ],
      "p": [
        "CO2",
        "H2O",
        "NaClO"
      ],
      "c": "",
      "nm": "复分解反应（生成气体与水）",
      "t": "复分解"
    },
    {
      "r": [
        "HClO",
        "NaHCO3"
      ],
      "p": [
        "CO2",
        "H2O",
        "NaClO"
      ],
      "c": "",
      "nm": "复分解反应（生成气体与水）",
      "t": "复分解"
    },
    {
      "r": [
        "CH3COOH",
        "m_NH4_CO3"
      ],
      "p": [
        "CO2",
        "H2O",
        "m_NH4_CH3COO"
      ],
      "c": "",
      "nm": "复分解反应（生成气体与水）",
      "t": "复分解"
    },
    {
      "r": [
        "CH3COOH",
        "K2CO3"
      ],
      "p": [
        "CO2",
        "H2O",
        "CH3COOK"
      ],
      "c": "",
      "nm": "复分解反应（生成气体与水）",
      "t": "复分解"
    },
    {
      "r": [
        "CH3COOH",
        "m_K_HCO3"
      ],
      "p": [
        "CO2",
        "H2O",
        "CH3COOK"
      ],
      "c": "",
      "nm": "复分解反应（生成气体与水）",
      "t": "复分解"
    },
    {
      "r": [
        "CH3COOH",
        "BaHCO32"
      ],
      "p": [
        "CO2",
        "H2O",
        "m_Ba_CH3COO"
      ],
      "c": "",
      "nm": "复分解反应（生成气体与水）",
      "t": "复分解"
    },
    {
      "r": [
        "CH3COOH",
        "CaHCO32"
      ],
      "p": [
        "CO2",
        "H2O",
        "CH3COO2Ca"
      ],
      "c": "",
      "nm": "复分解反应（生成气体与水）",
      "t": "复分解"
    },
    {
      "r": [
        "CH3COOH",
        "MgHCO32"
      ],
      "p": [
        "CO2",
        "H2O",
        "CH3COO2Mg"
      ],
      "c": "",
      "nm": "复分解反应（生成气体与水）",
      "t": "复分解"
    },
    {
      "r": [
        "H2C2O4",
        "m_NH4_CO3"
      ],
      "p": [
        "CO2",
        "H2O",
        "m_NH4_C2O4"
      ],
      "c": "",
      "nm": "复分解反应（生成气体与水）",
      "t": "复分解"
    },
    {
      "r": [
        "H2C2O4",
        "CaCl2"
      ],
      "p": [
        "HCl",
        "CaC2O4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "H2C2O4",
        "MgHCO32"
      ],
      "p": [
        "CO2",
        "H2O",
        "m_Mg_C2O4"
      ],
      "c": "",
      "nm": "复分解反应（生成气体与水）",
      "t": "复分解"
    },
    {
      "r": [
        "H2C2O4",
        "ZnSO4"
      ],
      "p": [
        "H2SO4",
        "m_Zn_C2O4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "H2C2O4",
        "CuCl2"
      ],
      "p": [
        "HCl",
        "m_Cu_C2O4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "H2C2O4",
        "CuSO4"
      ],
      "p": [
        "H2SO4",
        "m_Cu_C2O4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "H2C2O4",
        "CuNO32"
      ],
      "p": [
        "HNO3",
        "m_Cu_C2O4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "H2C2O4",
        "AgNO3"
      ],
      "p": [
        "HNO3",
        "m_Ag_C2O4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "H3PO4",
        "NH4HCO3"
      ],
      "p": [
        "CO2",
        "H2O",
        "m_NH4_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成气体与水）",
      "t": "复分解"
    },
    {
      "r": [
        "H3PO4",
        "Na2CO3"
      ],
      "p": [
        "CO2",
        "H2O",
        "Na3PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成气体与水）",
      "t": "复分解"
    },
    {
      "r": [
        "H3PO4",
        "NaHCO3"
      ],
      "p": [
        "CO2",
        "H2O",
        "Na3PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成气体与水）",
      "t": "复分解"
    },
    {
      "r": [
        "HBr",
        "NH4HCO3"
      ],
      "p": [
        "CO2",
        "H2O",
        "m_NH4_Br"
      ],
      "c": "",
      "nm": "复分解反应（生成气体与水）",
      "t": "复分解"
    },
    {
      "r": [
        "HBr",
        "Na2CO3"
      ],
      "p": [
        "CO2",
        "H2O",
        "NaBr"
      ],
      "c": "",
      "nm": "复分解反应（生成气体与水）",
      "t": "复分解"
    },
    {
      "r": [
        "HBr",
        "NaHCO3"
      ],
      "p": [
        "CO2",
        "H2O",
        "NaBr"
      ],
      "c": "",
      "nm": "复分解反应（生成气体与水）",
      "t": "复分解"
    },
    {
      "r": [
        "HI",
        "NH4HCO3"
      ],
      "p": [
        "CO2",
        "H2O",
        "m_NH4_I"
      ],
      "c": "",
      "nm": "复分解反应（生成气体与水）",
      "t": "复分解"
    },
    {
      "r": [
        "HI",
        "Na2CO3"
      ],
      "p": [
        "CO2",
        "H2O",
        "NaI"
      ],
      "c": "",
      "nm": "复分解反应（生成气体与水）",
      "t": "复分解"
    },
    {
      "r": [
        "HI",
        "NaHCO3"
      ],
      "p": [
        "CO2",
        "H2O",
        "NaI"
      ],
      "c": "",
      "nm": "复分解反应（生成气体与水）",
      "t": "复分解"
    },
    {
      "r": [
        "NaOH",
        "MgNO32"
      ],
      "p": [
        "NaNO3",
        "Mg(OH)2"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "NaOH",
        "CuSO4"
      ],
      "p": [
        "Na2SO4",
        "Cu(OH)2"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "NaOH",
        "CuNO32"
      ],
      "p": [
        "NaNO3",
        "Cu(OH)2"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2CO3",
        "Ba(OH)2"
      ],
      "p": [
        "NaOH",
        "BaCO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2CO3",
        "BaCl2"
      ],
      "p": [
        "NaCl",
        "BaCO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "KOH",
        "MgNO32"
      ],
      "p": [
        "KNO3",
        "Mg(OH)2"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "KOH",
        "FeCl3"
      ],
      "p": [
        "KCl",
        "Fe(OH)3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "KOH",
        "CuCl2"
      ],
      "p": [
        "KCl",
        "Cu(OH)2"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "KOH",
        "CuSO4"
      ],
      "p": [
        "K2SO4",
        "Cu(OH)2"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "KOH",
        "CuNO32"
      ],
      "p": [
        "KNO3",
        "Cu(OH)2"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "BaCl2",
        "CuSO4"
      ],
      "p": [
        "BaSO4",
        "CuCl2"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "BaCl2",
        "AgNO3"
      ],
      "p": [
        "BaNO32",
        "AgCl"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "BaNO32",
        "CuSO4"
      ],
      "p": [
        "BaSO4",
        "CuNO32"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Ca(OH)2",
        "MgNO32"
      ],
      "p": [
        "CaNO32",
        "Mg(OH)2"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Ca(OH)2",
        "CuSO4"
      ],
      "p": [
        "CaSO4",
        "Cu(OH)2"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Ca(OH)2",
        "CuNO32"
      ],
      "p": [
        "CaNO32",
        "Cu(OH)2"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "CuCl2",
        "AgNO3"
      ],
      "p": [
        "CuNO32",
        "AgCl"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "HCl",
        "KOH"
      ],
      "p": [
        "H2O",
        "KCl"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "H2SO4",
        "NaOH"
      ],
      "p": [
        "H2O",
        "Na2SO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "H2SO4",
        "KOH"
      ],
      "p": [
        "H2O",
        "K2SO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "H2SO4",
        "Ca(OH)2"
      ],
      "p": [
        "H2O",
        "CaSO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "HNO3",
        "NaOH"
      ],
      "p": [
        "H2O",
        "NaNO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "HNO3",
        "KOH"
      ],
      "p": [
        "H2O",
        "KNO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "HNO3",
        "Ca(OH)2"
      ],
      "p": [
        "H2O",
        "CaNO32"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "HF",
        "NaOH"
      ],
      "p": [
        "H2O",
        "NaF"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "HF",
        "KOH"
      ],
      "p": [
        "H2O",
        "m_K_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "CH3COOH",
        "NaOH"
      ],
      "p": [
        "H2O",
        "CH3COONa"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "CH3COOH",
        "KOH"
      ],
      "p": [
        "H2O",
        "CH3COOK"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "CH3COOH",
        "Ba(OH)2"
      ],
      "p": [
        "H2O",
        "m_Ba_CH3COO"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "CH3COOH",
        "Ca(OH)2"
      ],
      "p": [
        "H2O",
        "CH3COO2Ca"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Ba(OH)2",
        "ZnSO4"
      ],
      "p": [
        "BaSO4",
        "ZnOH2"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Ba(OH)2",
        "FeSO4"
      ],
      "p": [
        "BaSO4",
        "FeOH2"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_CO3",
        "Ca(OH)2"
      ],
      "p": [
        "NH3H2O",
        "CaCO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "NaOH",
        "MgCl2"
      ],
      "p": [
        "NaCl",
        "Mg(OH)2"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "NaOH",
        "MgHCO32"
      ],
      "p": [
        "NaHCO3",
        "Mg(OH)2"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2CO3",
        "CaHCO32"
      ],
      "p": [
        "NaHCO3",
        "CaCO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "K2CO3",
        "Ca(OH)2"
      ],
      "p": [
        "KOH",
        "CaCO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Ba(OH)2",
        "MgCl2"
      ],
      "p": [
        "BaCl2",
        "Mg(OH)2"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Ba(OH)2",
        "FeNO33"
      ],
      "p": [
        "BaNO32",
        "Fe(OH)3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Ca(OH)2",
        "MgCl2"
      ],
      "p": [
        "CaCl2",
        "Mg(OH)2"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "HCl",
        "m_NH4_SO3"
      ],
      "p": [
        "SO2",
        "H2O",
        "NH4Cl"
      ],
      "c": "",
      "nm": "复分解反应（生成气体与水）",
      "t": "复分解"
    },
    {
      "r": [
        "HCl",
        "m_K_SO3"
      ],
      "p": [
        "SO2",
        "H2O",
        "KCl"
      ],
      "c": "",
      "nm": "复分解反应（生成气体与水）",
      "t": "复分解"
    },
    {
      "r": [
        "H2SO4",
        "m_NH4_SO3"
      ],
      "p": [
        "SO2",
        "H2O",
        "m_NH4_SO4"
      ],
      "c": "",
      "nm": "复分解反应（生成气体与水）",
      "t": "复分解"
    },
    {
      "r": [
        "H2SO4",
        "Na2SO3"
      ],
      "p": [
        "SO2",
        "H2O",
        "Na2SO4"
      ],
      "c": "",
      "nm": "复分解反应（生成气体与水）",
      "t": "复分解"
    },
    {
      "r": [
        "H2SO4",
        "m_K_SO3"
      ],
      "p": [
        "SO2",
        "H2O",
        "K2SO4"
      ],
      "c": "",
      "nm": "复分解反应（生成气体与水）",
      "t": "复分解"
    },
    {
      "r": [
        "HNO3",
        "Na2SO3"
      ],
      "p": [
        "SO2",
        "H2O",
        "NaNO3"
      ],
      "c": "",
      "nm": "复分解反应（生成气体与水）",
      "t": "复分解"
    },
    {
      "r": [
        "HNO3",
        "m_K_SO3"
      ],
      "p": [
        "SO2",
        "H2O",
        "KNO3"
      ],
      "c": "",
      "nm": "复分解反应（生成气体与水）",
      "t": "复分解"
    },
    {
      "r": [
        "HF",
        "m_NH4_SO3"
      ],
      "p": [
        "SO2",
        "H2O",
        "m_NH4_F"
      ],
      "c": "",
      "nm": "复分解反应（生成气体与水）",
      "t": "复分解"
    },
    {
      "r": [
        "HF",
        "Na2SO3"
      ],
      "p": [
        "SO2",
        "H2O",
        "NaF"
      ],
      "c": "",
      "nm": "复分解反应（生成气体与水）",
      "t": "复分解"
    },
    {
      "r": [
        "HF",
        "m_K_SO3"
      ],
      "p": [
        "SO2",
        "H2O",
        "m_K_F"
      ],
      "c": "",
      "nm": "复分解反应（生成气体与水）",
      "t": "复分解"
    },
    {
      "r": [
        "CH3COOH",
        "m_NH4_SO3"
      ],
      "p": [
        "SO2",
        "H2O",
        "m_NH4_CH3COO"
      ],
      "c": "",
      "nm": "复分解反应（生成气体与水）",
      "t": "复分解"
    },
    {
      "r": [
        "CH3COOH",
        "Na2SO3"
      ],
      "p": [
        "SO2",
        "H2O",
        "CH3COONa"
      ],
      "c": "",
      "nm": "复分解反应（生成气体与水）",
      "t": "复分解"
    },
    {
      "r": [
        "CH3COOH",
        "m_K_SO3"
      ],
      "p": [
        "SO2",
        "H2O",
        "CH3COOK"
      ],
      "c": "",
      "nm": "复分解反应（生成气体与水）",
      "t": "复分解"
    },
    {
      "r": [
        "H2C2O4",
        "m_NH4_SO3"
      ],
      "p": [
        "SO2",
        "H2O",
        "m_NH4_C2O4"
      ],
      "c": "",
      "nm": "复分解反应（生成气体与水）",
      "t": "复分解"
    },
    {
      "r": [
        "H3PO4",
        "BaHCO32"
      ],
      "p": [
        "CO2",
        "H2O",
        "Ba3PO42"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "H3PO4",
        "CaHCO32"
      ],
      "p": [
        "CO2",
        "H2O",
        "Ca3PO42"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "H3PO4",
        "MgHCO32"
      ],
      "p": [
        "CO2",
        "H2O",
        "m_Mg_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "NaOH",
        "ZnSO4"
      ],
      "p": [
        "Na2SO4",
        "ZnOH2"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "NaOH",
        "FeSO4"
      ],
      "p": [
        "Na2SO4",
        "FeOH2"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "NaCl",
        "AgNO3"
      ],
      "p": [
        "NaNO3",
        "AgCl"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2CO3",
        "BaNO32"
      ],
      "p": [
        "NaNO3",
        "BaCO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2CO3",
        "MgNO32"
      ],
      "p": [
        "NaNO3",
        "MgCO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2CO3",
        "ZnSO4"
      ],
      "p": [
        "Na2SO4",
        "ZnCO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2CO3",
        "AgNO3"
      ],
      "p": [
        "NaNO3",
        "Ag2CO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "KOH",
        "ZnSO4"
      ],
      "p": [
        "K2SO4",
        "ZnOH2"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "KOH",
        "FeSO4"
      ],
      "p": [
        "K2SO4",
        "FeOH2"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Ba(OH)2",
        "MgSO4"
      ],
      "p": [
        "BaSO4",
        "Mg(OH)2"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Ba(OH)2",
        "Fe2SO43"
      ],
      "p": [
        "BaSO4",
        "Fe(OH)3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "BaCl2",
        "ZnSO4"
      ],
      "p": [
        "BaSO4",
        "ZnCl2"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "BaCl2",
        "FeSO4"
      ],
      "p": [
        "BaSO4",
        "FeCl2"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "BaNO32",
        "ZnSO4"
      ],
      "p": [
        "BaSO4",
        "ZnNO32"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "BaNO32",
        "FeSO4"
      ],
      "p": [
        "BaSO4",
        "FeNO32"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Ca(OH)2",
        "m_Mg_C2O4"
      ],
      "p": [
        "CaC2O4",
        "Mg(OH)2"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Ca(OH)2",
        "ZnSO4"
      ],
      "p": [
        "CaSO4",
        "ZnOH2"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Ca(OH)2",
        "FeSO4"
      ],
      "p": [
        "CaSO4",
        "FeOH2"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Ca(OH)2",
        "m_Fe3_C2O4"
      ],
      "p": [
        "CaC2O4",
        "Fe(OH)3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "CaCl2",
        "AgNO3"
      ],
      "p": [
        "CaNO32",
        "AgCl"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "FeCl3",
        "AgNO3"
      ],
      "p": [
        "FeNO33",
        "AgCl"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "H3PO4",
        "Ba(OH)2"
      ],
      "p": [
        "H2O",
        "Ba3PO42"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "H3PO4",
        "Ca(OH)2"
      ],
      "p": [
        "H2O",
        "Ca3PO42"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "HCl",
        "Na2S"
      ],
      "p": [
        "H2S",
        "NaCl"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "HCl",
        "m_Ba_S"
      ],
      "p": [
        "H2S",
        "BaCl2"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "HNO3",
        "m_NH4_S"
      ],
      "p": [
        "H2S",
        "NH4NO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "HNO3",
        "m_Ba_S"
      ],
      "p": [
        "H2S",
        "BaNO32"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "HCl",
        "Na2SiO3"
      ],
      "p": [
        "H2SiO3",
        "NaCl"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "HCl",
        "Ag2SO4"
      ],
      "p": [
        "H2SO4",
        "AgCl"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "HCl",
        "m_Ag_CH3COO"
      ],
      "p": [
        "CH3COOH",
        "AgCl"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "H2SO4",
        "m_Ba_CH3COO"
      ],
      "p": [
        "CH3COOH",
        "BaSO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "HNO3",
        "m_NH4_SiO3"
      ],
      "p": [
        "H2SiO3",
        "NH4NO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "HF",
        "m_Ba_CH3COO"
      ],
      "p": [
        "CH3COOH",
        "m_Ba_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "HF",
        "MgCl2"
      ],
      "p": [
        "HCl",
        "m_Mg_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "HF",
        "MgSO4"
      ],
      "p": [
        "H2SO4",
        "m_Mg_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "HF",
        "CH3COO2Mg"
      ],
      "p": [
        "CH3COOH",
        "m_Mg_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "HF",
        "m_Mg_C2O4"
      ],
      "p": [
        "H2C2O4",
        "m_Mg_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "HF",
        "AlCl3"
      ],
      "p": [
        "HCl",
        "m_Al_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "HF",
        "Al2SO43"
      ],
      "p": [
        "H2SO4",
        "m_Al_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "HF",
        "AlNO33"
      ],
      "p": [
        "HNO3",
        "m_Al_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "HF",
        "m_Al_CH3COO"
      ],
      "p": [
        "CH3COOH",
        "m_Al_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "HF",
        "ZnCl2"
      ],
      "p": [
        "HCl",
        "m_Zn_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "HF",
        "ZnNO32"
      ],
      "p": [
        "HNO3",
        "m_Zn_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "HF",
        "m_Zn_CH3COO"
      ],
      "p": [
        "CH3COOH",
        "m_Zn_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "HF",
        "FeCl2"
      ],
      "p": [
        "HCl",
        "m_Fe2_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "HF",
        "FeNO32"
      ],
      "p": [
        "HNO3",
        "m_Fe2_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "HF",
        "m_Fe2_C2O4"
      ],
      "p": [
        "H2C2O4",
        "m_Fe2_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "HF",
        "Fe2SO43"
      ],
      "p": [
        "H2SO4",
        "m_Fe3_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "HF",
        "FeNO33"
      ],
      "p": [
        "HNO3",
        "m_Fe3_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "HF",
        "m_Fe3_CH3COO"
      ],
      "p": [
        "CH3COOH",
        "m_Fe3_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "HF",
        "m_Fe3_C2O4"
      ],
      "p": [
        "H2C2O4",
        "m_Fe3_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "HF",
        "m_Cu_CH3COO"
      ],
      "p": [
        "CH3COOH",
        "m_Cu_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "HClO",
        "m_NH4_CO3"
      ],
      "p": [
        "CO2",
        "H2O",
        "m_NH4_ClO"
      ],
      "c": "",
      "nm": "复分解反应（生成气体与水）",
      "t": "复分解"
    },
    {
      "r": [
        "HClO",
        "K2CO3"
      ],
      "p": [
        "CO2",
        "H2O",
        "m_K_ClO"
      ],
      "c": "",
      "nm": "复分解反应（生成气体与水）",
      "t": "复分解"
    },
    {
      "r": [
        "HClO",
        "m_K_HCO3"
      ],
      "p": [
        "CO2",
        "H2O",
        "m_K_ClO"
      ],
      "c": "",
      "nm": "复分解反应（生成气体与水）",
      "t": "复分解"
    },
    {
      "r": [
        "HClO",
        "BaHCO32"
      ],
      "p": [
        "CO2",
        "H2O",
        "m_Ba_ClO"
      ],
      "c": "",
      "nm": "复分解反应（生成气体与水）",
      "t": "复分解"
    },
    {
      "r": [
        "HClO",
        "MgHCO32"
      ],
      "p": [
        "CO2",
        "H2O",
        "m_Mg_ClO"
      ],
      "c": "",
      "nm": "复分解反应（生成气体与水）",
      "t": "复分解"
    },
    {
      "r": [
        "H2C2O4",
        "CaSO4"
      ],
      "p": [
        "H2SO4",
        "CaC2O4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "H2C2O4",
        "CaNO32"
      ],
      "p": [
        "HNO3",
        "CaC2O4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "H2C2O4",
        "CH3COO2Ca"
      ],
      "p": [
        "CH3COOH",
        "CaC2O4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "H2C2O4",
        "AlCl3"
      ],
      "p": [
        "HCl",
        "m_Al_C2O4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "H2C2O4",
        "Al2SO43"
      ],
      "p": [
        "H2SO4",
        "m_Al_C2O4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "H2C2O4",
        "AlNO33"
      ],
      "p": [
        "HNO3",
        "m_Al_C2O4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "H2C2O4",
        "m_Al_CH3COO"
      ],
      "p": [
        "CH3COOH",
        "m_Al_C2O4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "H2C2O4",
        "ZnCl2"
      ],
      "p": [
        "HCl",
        "m_Zn_C2O4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "H2C2O4",
        "ZnNO32"
      ],
      "p": [
        "HNO3",
        "m_Zn_C2O4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "H2C2O4",
        "m_Zn_CH3COO"
      ],
      "p": [
        "CH3COOH",
        "m_Zn_C2O4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "H2C2O4",
        "m_Cu_CH3COO"
      ],
      "p": [
        "CH3COOH",
        "m_Cu_C2O4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "H2C2O4",
        "Ag2SO4"
      ],
      "p": [
        "H2SO4",
        "m_Ag_C2O4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "H2C2O4",
        "m_Ag_CH3COO"
      ],
      "p": [
        "CH3COOH",
        "m_Ag_C2O4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "H3PO4",
        "m_NH4_CO3"
      ],
      "p": [
        "CO2",
        "H2O",
        "m_NH4_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成气体与水）",
      "t": "复分解"
    },
    {
      "r": [
        "H3PO4",
        "K2CO3"
      ],
      "p": [
        "CO2",
        "H2O",
        "m_K_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成气体与水）",
      "t": "复分解"
    },
    {
      "r": [
        "H3PO4",
        "m_K_HCO3"
      ],
      "p": [
        "CO2",
        "H2O",
        "m_K_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成气体与水）",
      "t": "复分解"
    },
    {
      "r": [
        "H3PO4",
        "BaCl2"
      ],
      "p": [
        "HCl",
        "Ba3PO42"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "H3PO4",
        "BaNO32"
      ],
      "p": [
        "HNO3",
        "Ba3PO42"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "H3PO4",
        "CaCl2"
      ],
      "p": [
        "HCl",
        "Ca3PO42"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "H3PO4",
        "MgNO32"
      ],
      "p": [
        "HNO3",
        "m_Mg_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "H3PO4",
        "ZnSO4"
      ],
      "p": [
        "H2SO4",
        "m_Zn_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "H3PO4",
        "FeSO4"
      ],
      "p": [
        "H2SO4",
        "m_Fe2_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "H3PO4",
        "FeCl3"
      ],
      "p": [
        "HCl",
        "m_Fe3_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "H3PO4",
        "CuCl2"
      ],
      "p": [
        "HCl",
        "m_Cu_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "H3PO4",
        "CuSO4"
      ],
      "p": [
        "H2SO4",
        "m_Cu_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "H3PO4",
        "CuNO32"
      ],
      "p": [
        "HNO3",
        "m_Cu_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "HBr",
        "m_NH4_CO3"
      ],
      "p": [
        "CO2",
        "H2O",
        "m_NH4_Br"
      ],
      "c": "",
      "nm": "复分解反应（生成气体与水）",
      "t": "复分解"
    },
    {
      "r": [
        "HBr",
        "K2CO3"
      ],
      "p": [
        "CO2",
        "H2O",
        "m_K_Br"
      ],
      "c": "",
      "nm": "复分解反应（生成气体与水）",
      "t": "复分解"
    },
    {
      "r": [
        "HBr",
        "m_K_HCO3"
      ],
      "p": [
        "CO2",
        "H2O",
        "m_K_Br"
      ],
      "c": "",
      "nm": "复分解反应（生成气体与水）",
      "t": "复分解"
    },
    {
      "r": [
        "HBr",
        "BaHCO32"
      ],
      "p": [
        "CO2",
        "H2O",
        "m_Ba_Br"
      ],
      "c": "",
      "nm": "复分解反应（生成气体与水）",
      "t": "复分解"
    },
    {
      "r": [
        "HBr",
        "CaHCO32"
      ],
      "p": [
        "CO2",
        "H2O",
        "m_Ca_Br"
      ],
      "c": "",
      "nm": "复分解反应（生成气体与水）",
      "t": "复分解"
    },
    {
      "r": [
        "HBr",
        "MgHCO32"
      ],
      "p": [
        "CO2",
        "H2O",
        "m_Mg_Br"
      ],
      "c": "",
      "nm": "复分解反应（生成气体与水）",
      "t": "复分解"
    },
    {
      "r": [
        "HBr",
        "AgNO3"
      ],
      "p": [
        "HNO3",
        "AgBr"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "HI",
        "m_NH4_CO3"
      ],
      "p": [
        "CO2",
        "H2O",
        "m_NH4_I"
      ],
      "c": "",
      "nm": "复分解反应（生成气体与水）",
      "t": "复分解"
    },
    {
      "r": [
        "HI",
        "K2CO3"
      ],
      "p": [
        "CO2",
        "H2O",
        "m_K_I"
      ],
      "c": "",
      "nm": "复分解反应（生成气体与水）",
      "t": "复分解"
    },
    {
      "r": [
        "HI",
        "m_K_HCO3"
      ],
      "p": [
        "CO2",
        "H2O",
        "m_K_I"
      ],
      "c": "",
      "nm": "复分解反应（生成气体与水）",
      "t": "复分解"
    },
    {
      "r": [
        "HI",
        "BaHCO32"
      ],
      "p": [
        "CO2",
        "H2O",
        "m_Ba_I"
      ],
      "c": "",
      "nm": "复分解反应（生成气体与水）",
      "t": "复分解"
    },
    {
      "r": [
        "HI",
        "CaHCO32"
      ],
      "p": [
        "CO2",
        "H2O",
        "m_Ca_I"
      ],
      "c": "",
      "nm": "复分解反应（生成气体与水）",
      "t": "复分解"
    },
    {
      "r": [
        "HI",
        "MgHCO32"
      ],
      "p": [
        "CO2",
        "H2O",
        "m_Mg_I"
      ],
      "c": "",
      "nm": "复分解反应（生成气体与水）",
      "t": "复分解"
    },
    {
      "r": [
        "HI",
        "AgNO3"
      ],
      "p": [
        "HNO3",
        "AgI"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "NH4Cl",
        "AgNO3"
      ],
      "p": [
        "NH4NO3",
        "AgCl"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_SO4",
        "Ba(OH)2"
      ],
      "p": [
        "NH3H2O",
        "BaSO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_SO4",
        "BaNO32"
      ],
      "p": [
        "NH4NO3",
        "BaSO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_CO3",
        "Ba(OH)2"
      ],
      "p": [
        "NH3H2O",
        "BaCO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_CO3",
        "BaNO32"
      ],
      "p": [
        "NH4NO3",
        "BaCO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_CO3",
        "CaCl2"
      ],
      "p": [
        "NH4Cl",
        "CaCO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_CO3",
        "MgNO32"
      ],
      "p": [
        "NH4NO3",
        "MgCO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_CO3",
        "AgNO3"
      ],
      "p": [
        "NH4NO3",
        "Ag2CO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_F",
        "Ba(OH)2"
      ],
      "p": [
        "NH3H2O",
        "m_Ba_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_F",
        "BaNO32"
      ],
      "p": [
        "NH4NO3",
        "m_Ba_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_F",
        "MgNO32"
      ],
      "p": [
        "NH4NO3",
        "m_Mg_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_F",
        "CuNO32"
      ],
      "p": [
        "NH4NO3",
        "m_Cu_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_S",
        "MgNO32"
      ],
      "p": [
        "NH4NO3",
        "m_Mg_S"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_S",
        "CuNO32"
      ],
      "p": [
        "NH4NO3",
        "CuS"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_SO3",
        "Ba(OH)2"
      ],
      "p": [
        "NH3H2O",
        "BaSO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_SO3",
        "BaNO32"
      ],
      "p": [
        "NH4NO3",
        "BaSO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_SO3",
        "Ca(OH)2"
      ],
      "p": [
        "NH3H2O",
        "m_Ca_SO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_SO3",
        "MgNO32"
      ],
      "p": [
        "NH4NO3",
        "m_Mg_SO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_SO3",
        "AgNO3"
      ],
      "p": [
        "NH4NO3",
        "m_Ag_SO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_C2O4",
        "Ca(OH)2"
      ],
      "p": [
        "NH3H2O",
        "CaC2O4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_C2O4",
        "CuNO32"
      ],
      "p": [
        "NH4NO3",
        "m_Cu_C2O4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_C2O4",
        "AgNO3"
      ],
      "p": [
        "NH4NO3",
        "m_Ag_C2O4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_PO4",
        "Ba(OH)2"
      ],
      "p": [
        "NH3H2O",
        "Ba3PO42"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_PO4",
        "BaNO32"
      ],
      "p": [
        "NH4NO3",
        "Ba3PO42"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_PO4",
        "Ca(OH)2"
      ],
      "p": [
        "NH3H2O",
        "Ca3PO42"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_PO4",
        "MgNO32"
      ],
      "p": [
        "NH4NO3",
        "m_Mg_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_PO4",
        "CuNO32"
      ],
      "p": [
        "NH4NO3",
        "m_Cu_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_SiO3",
        "Ba(OH)2"
      ],
      "p": [
        "NH3H2O",
        "m_Ba_SiO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_SiO3",
        "BaNO32"
      ],
      "p": [
        "NH4NO3",
        "m_Ba_SiO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_SiO3",
        "MgNO32"
      ],
      "p": [
        "NH4NO3",
        "m_Mg_SiO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_SiO3",
        "CuNO32"
      ],
      "p": [
        "NH4NO3",
        "m_Cu_SiO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_SiO3",
        "AgNO3"
      ],
      "p": [
        "NH4NO3",
        "m_Ag_SiO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_Br",
        "AgNO3"
      ],
      "p": [
        "NH4NO3",
        "AgBr"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_I",
        "AgNO3"
      ],
      "p": [
        "NH4NO3",
        "AgI"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "NaOH",
        "MgSO4"
      ],
      "p": [
        "Na2SO4",
        "Mg(OH)2"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "NaOH",
        "m_Mg_ClO"
      ],
      "p": [
        "NaClO",
        "Mg(OH)2"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "NaOH",
        "CH3COO2Mg"
      ],
      "p": [
        "CH3COONa",
        "Mg(OH)2"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "NaOH",
        "m_Mg_MnO4"
      ],
      "p": [
        "m_Na_MnO4",
        "Mg(OH)2"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "NaOH",
        "m_Mg_AlO2"
      ],
      "p": [
        "NaAlO2",
        "Mg(OH)2"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "NaOH",
        "m_Mg_Br"
      ],
      "p": [
        "NaBr",
        "Mg(OH)2"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "NaOH",
        "m_Mg_I"
      ],
      "p": [
        "NaI",
        "Mg(OH)2"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "NaOH",
        "AlCl3"
      ],
      "p": [
        "NaCl",
        "Al(OH)3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "NaOH",
        "ZnCl2"
      ],
      "p": [
        "NaCl",
        "ZnOH2"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "NaOH",
        "FeCl2"
      ],
      "p": [
        "NaCl",
        "FeOH2"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "NaOH",
        "Fe2SO43"
      ],
      "p": [
        "Na2SO4",
        "Fe(OH)3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "NaOH",
        "FeNO33"
      ],
      "p": [
        "NaNO3",
        "Fe(OH)3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "NaOH",
        "m_Fe3_CH3COO"
      ],
      "p": [
        "CH3COONa",
        "Fe(OH)3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "NaOH",
        "m_Fe3_MnO4"
      ],
      "p": [
        "m_Na_MnO4",
        "Fe(OH)3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "NaOH",
        "m_Fe3_AlO2"
      ],
      "p": [
        "NaAlO2",
        "Fe(OH)3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "NaOH",
        "m_Fe3_Br"
      ],
      "p": [
        "NaBr",
        "Fe(OH)3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "NaOH",
        "m_Cu_CH3COO"
      ],
      "p": [
        "CH3COONa",
        "Cu(OH)2"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "NaOH",
        "m_Cu_MnO4"
      ],
      "p": [
        "m_Na_MnO4",
        "Cu(OH)2"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "NaOH",
        "m_Cu_AlO2"
      ],
      "p": [
        "NaAlO2",
        "Cu(OH)2"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "NaOH",
        "m_Cu_Br"
      ],
      "p": [
        "NaBr",
        "Cu(OH)2"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2SO4",
        "Ba(OH)2"
      ],
      "p": [
        "NaOH",
        "BaSO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2SO4",
        "BaCl2"
      ],
      "p": [
        "NaCl",
        "BaSO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2CO3",
        "BaHCO32"
      ],
      "p": [
        "NaHCO3",
        "BaCO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2CO3",
        "CaSO4"
      ],
      "p": [
        "Na2SO4",
        "CaCO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2CO3",
        "CaNO32"
      ],
      "p": [
        "NaNO3",
        "CaCO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2CO3",
        "CH3COO2Ca"
      ],
      "p": [
        "CH3COONa",
        "CaCO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2CO3",
        "m_Ca_MnO4"
      ],
      "p": [
        "m_Na_MnO4",
        "CaCO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2CO3",
        "m_Ca_AlO2"
      ],
      "p": [
        "NaAlO2",
        "CaCO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2CO3",
        "m_Ca_Br"
      ],
      "p": [
        "NaBr",
        "CaCO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2CO3",
        "m_Ca_I"
      ],
      "p": [
        "NaI",
        "CaCO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2CO3",
        "MgCl2"
      ],
      "p": [
        "NaCl",
        "MgCO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2CO3",
        "MgHCO32"
      ],
      "p": [
        "NaHCO3",
        "MgCO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2CO3",
        "ZnCl2"
      ],
      "p": [
        "NaCl",
        "ZnCO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "NaF",
        "Ba(OH)2"
      ],
      "p": [
        "NaOH",
        "m_Ba_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "NaF",
        "BaCl2"
      ],
      "p": [
        "NaCl",
        "m_Ba_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "NaF",
        "FeCl3"
      ],
      "p": [
        "NaCl",
        "m_Fe3_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "NaF",
        "CuCl2"
      ],
      "p": [
        "NaCl",
        "m_Cu_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2S",
        "CuCl2"
      ],
      "p": [
        "NaCl",
        "CuS"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2SO3",
        "Ba(OH)2"
      ],
      "p": [
        "NaOH",
        "BaSO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2SO3",
        "BaCl2"
      ],
      "p": [
        "NaCl",
        "BaSO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2SO3",
        "Ca(OH)2"
      ],
      "p": [
        "NaOH",
        "m_Ca_SO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2SO3",
        "CaCl2"
      ],
      "p": [
        "NaCl",
        "m_Ca_SO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na3PO4",
        "Ba(OH)2"
      ],
      "p": [
        "NaOH",
        "Ba3PO42"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na3PO4",
        "BaCl2"
      ],
      "p": [
        "NaCl",
        "Ba3PO42"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na3PO4",
        "Ca(OH)2"
      ],
      "p": [
        "NaOH",
        "Ca3PO42"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na3PO4",
        "CaCl2"
      ],
      "p": [
        "NaCl",
        "Ca3PO42"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na3PO4",
        "FeCl3"
      ],
      "p": [
        "NaCl",
        "m_Fe3_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na3PO4",
        "CuCl2"
      ],
      "p": [
        "NaCl",
        "m_Cu_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2SiO3",
        "Ba(OH)2"
      ],
      "p": [
        "NaOH",
        "m_Ba_SiO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2SiO3",
        "BaCl2"
      ],
      "p": [
        "NaCl",
        "m_Ba_SiO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2SiO3",
        "CuCl2"
      ],
      "p": [
        "NaCl",
        "m_Cu_SiO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "KOH",
        "MgCl2"
      ],
      "p": [
        "KCl",
        "Mg(OH)2"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "KOH",
        "MgSO4"
      ],
      "p": [
        "K2SO4",
        "Mg(OH)2"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "KOH",
        "MgHCO32"
      ],
      "p": [
        "m_K_HCO3",
        "Mg(OH)2"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "KOH",
        "m_Mg_ClO"
      ],
      "p": [
        "m_K_ClO",
        "Mg(OH)2"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "KOH",
        "CH3COO2Mg"
      ],
      "p": [
        "CH3COOK",
        "Mg(OH)2"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "KOH",
        "m_Mg_MnO4"
      ],
      "p": [
        "KMnO4",
        "Mg(OH)2"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "KOH",
        "m_Mg_AlO2"
      ],
      "p": [
        "m_K_AlO2",
        "Mg(OH)2"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "KOH",
        "m_Mg_Br"
      ],
      "p": [
        "m_K_Br",
        "Mg(OH)2"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "KOH",
        "m_Mg_I"
      ],
      "p": [
        "m_K_I",
        "Mg(OH)2"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "KOH",
        "Fe2SO43"
      ],
      "p": [
        "K2SO4",
        "Fe(OH)3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "KOH",
        "FeNO33"
      ],
      "p": [
        "KNO3",
        "Fe(OH)3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "KOH",
        "m_Fe3_CH3COO"
      ],
      "p": [
        "CH3COOK",
        "Fe(OH)3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "KOH",
        "m_Fe3_MnO4"
      ],
      "p": [
        "KMnO4",
        "Fe(OH)3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "KOH",
        "m_Fe3_AlO2"
      ],
      "p": [
        "m_K_AlO2",
        "Fe(OH)3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "KOH",
        "m_Fe3_Br"
      ],
      "p": [
        "m_K_Br",
        "Fe(OH)3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "KOH",
        "m_Cu_CH3COO"
      ],
      "p": [
        "CH3COOK",
        "Cu(OH)2"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "KOH",
        "m_Cu_MnO4"
      ],
      "p": [
        "KMnO4",
        "Cu(OH)2"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "KOH",
        "m_Cu_AlO2"
      ],
      "p": [
        "m_K_AlO2",
        "Cu(OH)2"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "KOH",
        "m_Cu_Br"
      ],
      "p": [
        "m_K_Br",
        "Cu(OH)2"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "K2SO4",
        "Ba(OH)2"
      ],
      "p": [
        "KOH",
        "BaSO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "K2CO3",
        "Ba(OH)2"
      ],
      "p": [
        "KOH",
        "BaCO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "K2CO3",
        "CaCl2"
      ],
      "p": [
        "KCl",
        "CaCO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_F",
        "Ba(OH)2"
      ],
      "p": [
        "KOH",
        "m_Ba_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_SO3",
        "Ba(OH)2"
      ],
      "p": [
        "KOH",
        "BaSO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_SO3",
        "Ca(OH)2"
      ],
      "p": [
        "KOH",
        "m_Ca_SO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_PO4",
        "Ba(OH)2"
      ],
      "p": [
        "KOH",
        "Ba3PO42"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_PO4",
        "Ca(OH)2"
      ],
      "p": [
        "KOH",
        "Ca3PO42"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_SiO3",
        "Ba(OH)2"
      ],
      "p": [
        "KOH",
        "m_Ba_SiO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Ba(OH)2",
        "CaSO4"
      ],
      "p": [
        "BaSO4",
        "Ca(OH)2"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Ba(OH)2",
        "MgHCO32"
      ],
      "p": [
        "BaHCO32",
        "Mg(OH)2"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Ba(OH)2",
        "m_Mg_ClO"
      ],
      "p": [
        "m_Ba_ClO",
        "Mg(OH)2"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Ba(OH)2",
        "CH3COO2Mg"
      ],
      "p": [
        "m_Ba_CH3COO",
        "Mg(OH)2"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Ba(OH)2",
        "m_Mg_MnO4"
      ],
      "p": [
        "m_Ba_MnO4",
        "Mg(OH)2"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Ba(OH)2",
        "m_Mg_AlO2"
      ],
      "p": [
        "m_Ba_AlO2",
        "Mg(OH)2"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Ba(OH)2",
        "m_Mg_Br"
      ],
      "p": [
        "m_Ba_Br",
        "Mg(OH)2"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Ba(OH)2",
        "m_Mg_I"
      ],
      "p": [
        "m_Ba_I",
        "Mg(OH)2"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Ba(OH)2",
        "AlCl3"
      ],
      "p": [
        "BaCl2",
        "Al(OH)3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Ba(OH)2",
        "AlNO33"
      ],
      "p": [
        "BaNO32",
        "Al(OH)3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Ba(OH)2",
        "ZnCl2"
      ],
      "p": [
        "BaCl2",
        "ZnOH2"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Ba(OH)2",
        "ZnNO32"
      ],
      "p": [
        "BaNO32",
        "ZnOH2"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Ba(OH)2",
        "FeCl2"
      ],
      "p": [
        "BaCl2",
        "FeOH2"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Ba(OH)2",
        "FeNO32"
      ],
      "p": [
        "BaNO32",
        "FeOH2"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Ba(OH)2",
        "m_Fe3_CH3COO"
      ],
      "p": [
        "m_Ba_CH3COO",
        "Fe(OH)3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Ba(OH)2",
        "m_Fe3_MnO4"
      ],
      "p": [
        "m_Ba_MnO4",
        "Fe(OH)3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Ba(OH)2",
        "m_Fe3_AlO2"
      ],
      "p": [
        "m_Ba_AlO2",
        "Fe(OH)3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Ba(OH)2",
        "m_Fe3_Br"
      ],
      "p": [
        "m_Ba_Br",
        "Fe(OH)3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Ba(OH)2",
        "m_Cu_CH3COO"
      ],
      "p": [
        "m_Ba_CH3COO",
        "Cu(OH)2"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Ba(OH)2",
        "m_Cu_MnO4"
      ],
      "p": [
        "m_Ba_MnO4",
        "Cu(OH)2"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Ba(OH)2",
        "m_Cu_AlO2"
      ],
      "p": [
        "m_Ba_AlO2",
        "Cu(OH)2"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Ba(OH)2",
        "m_Cu_Br"
      ],
      "p": [
        "m_Ba_Br",
        "Cu(OH)2"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "BaCl2",
        "CaSO4"
      ],
      "p": [
        "BaSO4",
        "CaCl2"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "BaCl2",
        "Fe2SO43"
      ],
      "p": [
        "BaSO4",
        "FeCl3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "BaNO32",
        "MgSO4"
      ],
      "p": [
        "BaSO4",
        "MgNO32"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "BaNO32",
        "Ag2SO4"
      ],
      "p": [
        "BaSO4",
        "AgNO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Ba_S",
        "MgNO32"
      ],
      "p": [
        "BaNO32",
        "m_Mg_S"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Ba_S",
        "CuCl2"
      ],
      "p": [
        "BaCl2",
        "CuS"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Ba_S",
        "CuNO32"
      ],
      "p": [
        "BaNO32",
        "CuS"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Ba_Br",
        "AgNO3"
      ],
      "p": [
        "BaNO32",
        "AgBr"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Ba_I",
        "AgNO3"
      ],
      "p": [
        "BaNO32",
        "AgI"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Ca(OH)2",
        "MgSO4"
      ],
      "p": [
        "CaSO4",
        "Mg(OH)2"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Ca(OH)2",
        "MgHCO32"
      ],
      "p": [
        "CaHCO32",
        "Mg(OH)2"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Ca(OH)2",
        "CH3COO2Mg"
      ],
      "p": [
        "CH3COO2Ca",
        "Mg(OH)2"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Ca(OH)2",
        "m_Mg_MnO4"
      ],
      "p": [
        "m_Ca_MnO4",
        "Mg(OH)2"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Ca(OH)2",
        "m_Mg_AlO2"
      ],
      "p": [
        "m_Ca_AlO2",
        "Mg(OH)2"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Ca(OH)2",
        "m_Mg_Br"
      ],
      "p": [
        "m_Ca_Br",
        "Mg(OH)2"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Ca(OH)2",
        "m_Mg_I"
      ],
      "p": [
        "m_Ca_I",
        "Mg(OH)2"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Ca(OH)2",
        "AlCl3"
      ],
      "p": [
        "CaCl2",
        "Al(OH)3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Ca(OH)2",
        "ZnCl2"
      ],
      "p": [
        "CaCl2",
        "ZnOH2"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Ca(OH)2",
        "FeCl2"
      ],
      "p": [
        "CaCl2",
        "FeOH2"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Ca(OH)2",
        "Fe2SO43"
      ],
      "p": [
        "CaSO4",
        "Fe(OH)3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Ca(OH)2",
        "FeNO33"
      ],
      "p": [
        "CaNO32",
        "Fe(OH)3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Ca(OH)2",
        "m_Fe3_CH3COO"
      ],
      "p": [
        "CH3COO2Ca",
        "Fe(OH)3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Ca(OH)2",
        "m_Fe3_MnO4"
      ],
      "p": [
        "m_Ca_MnO4",
        "Fe(OH)3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Ca(OH)2",
        "m_Fe3_AlO2"
      ],
      "p": [
        "m_Ca_AlO2",
        "Fe(OH)3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Ca(OH)2",
        "m_Fe3_Br"
      ],
      "p": [
        "m_Ca_Br",
        "Fe(OH)3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Ca(OH)2",
        "m_Cu_CH3COO"
      ],
      "p": [
        "CH3COO2Ca",
        "Cu(OH)2"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Ca(OH)2",
        "m_Cu_MnO4"
      ],
      "p": [
        "m_Ca_MnO4",
        "Cu(OH)2"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Ca(OH)2",
        "m_Cu_AlO2"
      ],
      "p": [
        "m_Ca_AlO2",
        "Cu(OH)2"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Ca(OH)2",
        "m_Cu_Br"
      ],
      "p": [
        "m_Ca_Br",
        "Cu(OH)2"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "CaCl2",
        "m_Fe3_C2O4"
      ],
      "p": [
        "CaC2O4",
        "FeCl3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "MgCl2",
        "AgNO3"
      ],
      "p": [
        "MgNO32",
        "AgCl"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Mg_C2O4",
        "CuNO32"
      ],
      "p": [
        "MgNO32",
        "m_Cu_C2O4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Mg_C2O4",
        "AgNO3"
      ],
      "p": [
        "MgNO32",
        "m_Ag_C2O4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Mg_Br",
        "AgNO3"
      ],
      "p": [
        "MgNO32",
        "AgBr"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Mg_I",
        "AgNO3"
      ],
      "p": [
        "MgNO32",
        "AgI"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "ZnSO4",
        "m_Fe2_C2O4"
      ],
      "p": [
        "m_Zn_C2O4",
        "FeSO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Fe2_C2O4",
        "CuSO4"
      ],
      "p": [
        "FeSO4",
        "m_Cu_C2O4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Fe3_C2O4",
        "CuCl2"
      ],
      "p": [
        "FeCl3",
        "m_Cu_C2O4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "CuCl2",
        "Ag2SO4"
      ],
      "p": [
        "CuSO4",
        "AgCl"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Cu_Br",
        "AgNO3"
      ],
      "p": [
        "CuNO32",
        "AgBr"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "HClO",
        "NaOH"
      ],
      "p": [
        "H2O",
        "NaClO"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "HClO",
        "KOH"
      ],
      "p": [
        "H2O",
        "m_K_ClO"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "HClO",
        "Ba(OH)2"
      ],
      "p": [
        "H2O",
        "m_Ba_ClO"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "H3PO4",
        "NaOH"
      ],
      "p": [
        "H2O",
        "Na3PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "H3PO4",
        "KOH"
      ],
      "p": [
        "H2O",
        "m_K_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "HBr",
        "NaOH"
      ],
      "p": [
        "H2O",
        "NaBr"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "HBr",
        "KOH"
      ],
      "p": [
        "H2O",
        "m_K_Br"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "HBr",
        "Ba(OH)2"
      ],
      "p": [
        "H2O",
        "m_Ba_Br"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "HBr",
        "Ca(OH)2"
      ],
      "p": [
        "H2O",
        "m_Ca_Br"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "HI",
        "NaOH"
      ],
      "p": [
        "H2O",
        "NaI"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "HI",
        "KOH"
      ],
      "p": [
        "H2O",
        "m_K_I"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "HI",
        "Ba(OH)2"
      ],
      "p": [
        "H2O",
        "m_Ba_I"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "HI",
        "Ca(OH)2"
      ],
      "p": [
        "H2O",
        "m_Ca_I"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "H2SO4",
        "m_Ba_S"
      ],
      "p": [
        "H2S",
        "BaSO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "HF",
        "m_Ba_S"
      ],
      "p": [
        "H2S",
        "m_Ba_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Ba(OH)2",
        "Al2SO43"
      ],
      "p": [
        "BaSO4",
        "Al(OH)3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "BaCl2",
        "Ag2SO4"
      ],
      "p": [
        "BaSO4",
        "AgCl"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Ba_S",
        "ZnSO4"
      ],
      "p": [
        "BaSO4",
        "m_Zn_S"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Ba_S",
        "FeSO4"
      ],
      "p": [
        "BaSO4",
        "FeS"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Ba_S",
        "CuSO4"
      ],
      "p": [
        "BaSO4",
        "CuS"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Ca(OH)2",
        "m_Fe2_C2O4"
      ],
      "p": [
        "CaC2O4",
        "FeOH2"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_CO3",
        "CaNO32"
      ],
      "p": [
        "NH4NO3",
        "CaCO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_CO3",
        "CaHCO32"
      ],
      "p": [
        "NH4HCO3",
        "CaCO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "HCl",
        "m_NH4_S"
      ],
      "p": [
        "H2S",
        "NH4Cl"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "HCl",
        "m_K_S"
      ],
      "p": [
        "H2S",
        "KCl"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "H2SO4",
        "m_NH4_S"
      ],
      "p": [
        "H2S",
        "m_NH4_SO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "H2SO4",
        "Na2S"
      ],
      "p": [
        "H2S",
        "Na2SO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "H2SO4",
        "m_K_S"
      ],
      "p": [
        "H2S",
        "K2SO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "HNO3",
        "Na2S"
      ],
      "p": [
        "H2S",
        "NaNO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "HNO3",
        "m_K_S"
      ],
      "p": [
        "H2S",
        "KNO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "HF",
        "m_NH4_S"
      ],
      "p": [
        "H2S",
        "m_NH4_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "HF",
        "Na2S"
      ],
      "p": [
        "H2S",
        "NaF"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "HF",
        "m_K_S"
      ],
      "p": [
        "H2S",
        "m_K_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "CH3COOH",
        "m_NH4_S"
      ],
      "p": [
        "H2S",
        "m_NH4_CH3COO"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "CH3COOH",
        "Na2S"
      ],
      "p": [
        "H2S",
        "CH3COONa"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "CH3COOH",
        "m_K_S"
      ],
      "p": [
        "H2S",
        "CH3COOK"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "CH3COOH",
        "m_Ba_S"
      ],
      "p": [
        "H2S",
        "m_Ba_CH3COO"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "H2C2O4",
        "m_NH4_S"
      ],
      "p": [
        "H2S",
        "m_NH4_C2O4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "HClO",
        "m_NH4_SO3"
      ],
      "p": [
        "SO2",
        "H2O",
        "m_NH4_ClO"
      ],
      "c": "",
      "nm": "复分解反应（生成气体与水）",
      "t": "复分解"
    },
    {
      "r": [
        "HClO",
        "Na2SO3"
      ],
      "p": [
        "SO2",
        "H2O",
        "NaClO"
      ],
      "c": "",
      "nm": "复分解反应（生成气体与水）",
      "t": "复分解"
    },
    {
      "r": [
        "HClO",
        "m_K_SO3"
      ],
      "p": [
        "SO2",
        "H2O",
        "m_K_ClO"
      ],
      "c": "",
      "nm": "复分解反应（生成气体与水）",
      "t": "复分解"
    },
    {
      "r": [
        "H3PO4",
        "m_NH4_SO3"
      ],
      "p": [
        "SO2",
        "H2O",
        "m_NH4_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成气体与水）",
      "t": "复分解"
    },
    {
      "r": [
        "H3PO4",
        "Na2SO3"
      ],
      "p": [
        "SO2",
        "H2O",
        "Na3PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成气体与水）",
      "t": "复分解"
    },
    {
      "r": [
        "H3PO4",
        "m_K_SO3"
      ],
      "p": [
        "SO2",
        "H2O",
        "m_K_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成气体与水）",
      "t": "复分解"
    },
    {
      "r": [
        "HBr",
        "m_NH4_SO3"
      ],
      "p": [
        "SO2",
        "H2O",
        "m_NH4_Br"
      ],
      "c": "",
      "nm": "复分解反应（生成气体与水）",
      "t": "复分解"
    },
    {
      "r": [
        "HBr",
        "Na2SO3"
      ],
      "p": [
        "SO2",
        "H2O",
        "NaBr"
      ],
      "c": "",
      "nm": "复分解反应（生成气体与水）",
      "t": "复分解"
    },
    {
      "r": [
        "HBr",
        "m_K_SO3"
      ],
      "p": [
        "SO2",
        "H2O",
        "m_K_Br"
      ],
      "c": "",
      "nm": "复分解反应（生成气体与水）",
      "t": "复分解"
    },
    {
      "r": [
        "HI",
        "m_NH4_SO3"
      ],
      "p": [
        "SO2",
        "H2O",
        "m_NH4_I"
      ],
      "c": "",
      "nm": "复分解反应（生成气体与水）",
      "t": "复分解"
    },
    {
      "r": [
        "HI",
        "Na2SO3"
      ],
      "p": [
        "SO2",
        "H2O",
        "NaI"
      ],
      "c": "",
      "nm": "复分解反应（生成气体与水）",
      "t": "复分解"
    },
    {
      "r": [
        "HI",
        "m_K_SO3"
      ],
      "p": [
        "SO2",
        "H2O",
        "m_K_I"
      ],
      "c": "",
      "nm": "复分解反应（生成气体与水）",
      "t": "复分解"
    },
    {
      "r": [
        "HCl",
        "m_NH4_SiO3"
      ],
      "p": [
        "H2SiO3",
        "NH4Cl"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "HCl",
        "m_K_SiO3"
      ],
      "p": [
        "H2SiO3",
        "KCl"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "H2SO4",
        "m_NH4_SiO3"
      ],
      "p": [
        "H2SiO3",
        "m_NH4_SO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "H2SO4",
        "Na2SiO3"
      ],
      "p": [
        "H2SiO3",
        "Na2SO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "H2SO4",
        "m_K_SiO3"
      ],
      "p": [
        "H2SiO3",
        "K2SO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "H2SO4",
        "m_Ba_ClO"
      ],
      "p": [
        "HClO",
        "BaSO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "H2SO4",
        "m_Ba_Br"
      ],
      "p": [
        "HBr",
        "BaSO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "H2SO4",
        "m_Ba_I"
      ],
      "p": [
        "HI",
        "BaSO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "HNO3",
        "Na2SiO3"
      ],
      "p": [
        "H2SiO3",
        "NaNO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "HNO3",
        "m_K_SiO3"
      ],
      "p": [
        "H2SiO3",
        "KNO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "HF",
        "m_NH4_SiO3"
      ],
      "p": [
        "H2SiO3",
        "m_NH4_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "HF",
        "Na2SiO3"
      ],
      "p": [
        "H2SiO3",
        "NaF"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "HF",
        "m_K_SiO3"
      ],
      "p": [
        "H2SiO3",
        "m_K_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "HF",
        "m_Ba_ClO"
      ],
      "p": [
        "HClO",
        "m_Ba_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "HF",
        "m_Ba_Br"
      ],
      "p": [
        "HBr",
        "m_Ba_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "HF",
        "m_Ba_I"
      ],
      "p": [
        "HI",
        "m_Ba_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "HF",
        "m_Mg_ClO"
      ],
      "p": [
        "HClO",
        "m_Mg_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "HF",
        "m_Mg_Br"
      ],
      "p": [
        "HBr",
        "m_Mg_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "HF",
        "m_Mg_I"
      ],
      "p": [
        "HI",
        "m_Mg_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "HF",
        "m_Al_Br"
      ],
      "p": [
        "HBr",
        "m_Al_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "HF",
        "m_Al_I"
      ],
      "p": [
        "HI",
        "m_Al_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "HF",
        "m_Zn_ClO"
      ],
      "p": [
        "HClO",
        "m_Zn_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "HF",
        "m_Zn_Br"
      ],
      "p": [
        "HBr",
        "m_Zn_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "HF",
        "m_Zn_I"
      ],
      "p": [
        "HI",
        "m_Zn_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "HF",
        "m_Fe2_Br"
      ],
      "p": [
        "HBr",
        "m_Fe2_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "HF",
        "m_Fe2_I"
      ],
      "p": [
        "HI",
        "m_Fe2_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "HF",
        "m_Fe3_Br"
      ],
      "p": [
        "HBr",
        "m_Fe3_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "HF",
        "m_Cu_Br"
      ],
      "p": [
        "HBr",
        "m_Cu_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "CH3COOH",
        "m_NH4_SiO3"
      ],
      "p": [
        "H2SiO3",
        "m_NH4_CH3COO"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "CH3COOH",
        "Na2SiO3"
      ],
      "p": [
        "H2SiO3",
        "CH3COONa"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "CH3COOH",
        "m_K_SiO3"
      ],
      "p": [
        "H2SiO3",
        "CH3COOK"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "H2C2O4",
        "m_NH4_SiO3"
      ],
      "p": [
        "H2SiO3",
        "m_NH4_C2O4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "H2C2O4",
        "m_Ca_Br"
      ],
      "p": [
        "HBr",
        "CaC2O4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "H2C2O4",
        "m_Ca_I"
      ],
      "p": [
        "HI",
        "CaC2O4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "H2C2O4",
        "m_Al_Br"
      ],
      "p": [
        "HBr",
        "m_Al_C2O4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "H2C2O4",
        "m_Al_I"
      ],
      "p": [
        "HI",
        "m_Al_C2O4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "H2C2O4",
        "m_Zn_ClO"
      ],
      "p": [
        "HClO",
        "m_Zn_C2O4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "H2C2O4",
        "m_Zn_Br"
      ],
      "p": [
        "HBr",
        "m_Zn_C2O4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "H2C2O4",
        "m_Zn_I"
      ],
      "p": [
        "HI",
        "m_Zn_C2O4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "H2C2O4",
        "m_Cu_Br"
      ],
      "p": [
        "HBr",
        "m_Cu_C2O4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_SO4",
        "BaCl2"
      ],
      "p": [
        "NH4Cl",
        "BaSO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_CO3",
        "BaCl2"
      ],
      "p": [
        "NH4Cl",
        "BaCO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_CO3",
        "ZnSO4"
      ],
      "p": [
        "m_NH4_SO4",
        "ZnCO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_F",
        "BaCl2"
      ],
      "p": [
        "NH4Cl",
        "m_Ba_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_F",
        "ZnSO4"
      ],
      "p": [
        "m_NH4_SO4",
        "m_Zn_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_F",
        "FeSO4"
      ],
      "p": [
        "m_NH4_SO4",
        "m_Fe2_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_F",
        "FeCl3"
      ],
      "p": [
        "NH4Cl",
        "m_Fe3_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_F",
        "CuCl2"
      ],
      "p": [
        "NH4Cl",
        "m_Cu_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_F",
        "CuSO4"
      ],
      "p": [
        "m_NH4_SO4",
        "m_Cu_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_S",
        "ZnSO4"
      ],
      "p": [
        "m_NH4_SO4",
        "m_Zn_S"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_S",
        "FeSO4"
      ],
      "p": [
        "m_NH4_SO4",
        "FeS"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_S",
        "CuCl2"
      ],
      "p": [
        "NH4Cl",
        "CuS"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_S",
        "CuSO4"
      ],
      "p": [
        "m_NH4_SO4",
        "CuS"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_SO3",
        "BaCl2"
      ],
      "p": [
        "NH4Cl",
        "BaSO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_SO3",
        "CaCl2"
      ],
      "p": [
        "NH4Cl",
        "m_Ca_SO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_SO3",
        "ZnSO4"
      ],
      "p": [
        "m_NH4_SO4",
        "m_Zn_SO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_C2O4",
        "CaCl2"
      ],
      "p": [
        "NH4Cl",
        "CaC2O4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_C2O4",
        "ZnSO4"
      ],
      "p": [
        "m_NH4_SO4",
        "m_Zn_C2O4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_C2O4",
        "CuCl2"
      ],
      "p": [
        "NH4Cl",
        "m_Cu_C2O4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_C2O4",
        "CuSO4"
      ],
      "p": [
        "m_NH4_SO4",
        "m_Cu_C2O4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_PO4",
        "BaCl2"
      ],
      "p": [
        "NH4Cl",
        "Ba3PO42"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_PO4",
        "CaCl2"
      ],
      "p": [
        "NH4Cl",
        "Ca3PO42"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_PO4",
        "ZnSO4"
      ],
      "p": [
        "m_NH4_SO4",
        "m_Zn_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_PO4",
        "FeSO4"
      ],
      "p": [
        "m_NH4_SO4",
        "m_Fe2_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_PO4",
        "FeCl3"
      ],
      "p": [
        "NH4Cl",
        "m_Fe3_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_PO4",
        "CuCl2"
      ],
      "p": [
        "NH4Cl",
        "m_Cu_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_PO4",
        "CuSO4"
      ],
      "p": [
        "m_NH4_SO4",
        "m_Cu_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_SiO3",
        "BaCl2"
      ],
      "p": [
        "NH4Cl",
        "m_Ba_SiO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_SiO3",
        "ZnSO4"
      ],
      "p": [
        "m_NH4_SO4",
        "m_Zn_SiO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_SiO3",
        "FeSO4"
      ],
      "p": [
        "m_NH4_SO4",
        "m_Fe2_SiO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_SiO3",
        "CuCl2"
      ],
      "p": [
        "NH4Cl",
        "m_Cu_SiO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_SiO3",
        "CuSO4"
      ],
      "p": [
        "m_NH4_SO4",
        "m_Cu_SiO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "NaOH",
        "Al2SO43"
      ],
      "p": [
        "Na2SO4",
        "Al(OH)3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "NaOH",
        "AlNO33"
      ],
      "p": [
        "NaNO3",
        "Al(OH)3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "NaOH",
        "m_Al_CH3COO"
      ],
      "p": [
        "CH3COONa",
        "Al(OH)3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "NaOH",
        "m_Al_Br"
      ],
      "p": [
        "NaBr",
        "Al(OH)3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "NaOH",
        "m_Al_I"
      ],
      "p": [
        "NaI",
        "Al(OH)3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "NaOH",
        "ZnNO32"
      ],
      "p": [
        "NaNO3",
        "ZnOH2"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "NaOH",
        "m_Zn_ClO"
      ],
      "p": [
        "NaClO",
        "ZnOH2"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "NaOH",
        "m_Zn_CH3COO"
      ],
      "p": [
        "CH3COONa",
        "ZnOH2"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "NaOH",
        "m_Zn_MnO4"
      ],
      "p": [
        "m_Na_MnO4",
        "ZnOH2"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "NaOH",
        "m_Zn_AlO2"
      ],
      "p": [
        "NaAlO2",
        "ZnOH2"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "NaOH",
        "m_Zn_Br"
      ],
      "p": [
        "NaBr",
        "ZnOH2"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "NaOH",
        "m_Zn_I"
      ],
      "p": [
        "NaI",
        "ZnOH2"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "NaOH",
        "FeNO32"
      ],
      "p": [
        "NaNO3",
        "FeOH2"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "NaOH",
        "m_Fe2_MnO4"
      ],
      "p": [
        "m_Na_MnO4",
        "FeOH2"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "NaOH",
        "m_Fe2_AlO2"
      ],
      "p": [
        "NaAlO2",
        "FeOH2"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "NaOH",
        "m_Fe2_Br"
      ],
      "p": [
        "NaBr",
        "FeOH2"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "NaOH",
        "m_Fe2_I"
      ],
      "p": [
        "NaI",
        "FeOH2"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "NaCl",
        "Ag2SO4"
      ],
      "p": [
        "Na2SO4",
        "AgCl"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "NaCl",
        "m_Ag_CH3COO"
      ],
      "p": [
        "CH3COONa",
        "AgCl"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "NaCl",
        "m_Ag_MnO4"
      ],
      "p": [
        "m_Na_MnO4",
        "AgCl"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "NaCl",
        "m_Ag_AlO2"
      ],
      "p": [
        "NaAlO2",
        "AgCl"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2SO4",
        "BaNO32"
      ],
      "p": [
        "NaNO3",
        "BaSO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2CO3",
        "m_Ba_S"
      ],
      "p": [
        "Na2S",
        "BaCO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2CO3",
        "m_Ba_ClO"
      ],
      "p": [
        "NaClO",
        "BaCO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2CO3",
        "m_Ba_CH3COO"
      ],
      "p": [
        "CH3COONa",
        "BaCO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2CO3",
        "m_Ba_MnO4"
      ],
      "p": [
        "m_Na_MnO4",
        "BaCO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2CO3",
        "m_Ba_AlO2"
      ],
      "p": [
        "NaAlO2",
        "BaCO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2CO3",
        "m_Ba_Br"
      ],
      "p": [
        "NaBr",
        "BaCO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2CO3",
        "m_Ba_I"
      ],
      "p": [
        "NaI",
        "BaCO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2CO3",
        "MgSO4"
      ],
      "p": [
        "Na2SO4",
        "MgCO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2CO3",
        "m_Mg_ClO"
      ],
      "p": [
        "NaClO",
        "MgCO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2CO3",
        "CH3COO2Mg"
      ],
      "p": [
        "CH3COONa",
        "MgCO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2CO3",
        "m_Mg_MnO4"
      ],
      "p": [
        "m_Na_MnO4",
        "MgCO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2CO3",
        "m_Mg_AlO2"
      ],
      "p": [
        "NaAlO2",
        "MgCO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2CO3",
        "m_Mg_Br"
      ],
      "p": [
        "NaBr",
        "MgCO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2CO3",
        "m_Mg_I"
      ],
      "p": [
        "NaI",
        "MgCO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2CO3",
        "ZnNO32"
      ],
      "p": [
        "NaNO3",
        "ZnCO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2CO3",
        "m_Zn_ClO"
      ],
      "p": [
        "NaClO",
        "ZnCO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2CO3",
        "m_Zn_CH3COO"
      ],
      "p": [
        "CH3COONa",
        "ZnCO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2CO3",
        "m_Zn_MnO4"
      ],
      "p": [
        "m_Na_MnO4",
        "ZnCO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2CO3",
        "m_Zn_AlO2"
      ],
      "p": [
        "NaAlO2",
        "ZnCO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2CO3",
        "m_Zn_Br"
      ],
      "p": [
        "NaBr",
        "ZnCO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2CO3",
        "m_Zn_I"
      ],
      "p": [
        "NaI",
        "ZnCO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2CO3",
        "Ag2SO4"
      ],
      "p": [
        "Na2SO4",
        "Ag2CO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2CO3",
        "m_Ag_CH3COO"
      ],
      "p": [
        "CH3COONa",
        "Ag2CO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2CO3",
        "m_Ag_MnO4"
      ],
      "p": [
        "m_Na_MnO4",
        "Ag2CO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2CO3",
        "m_Ag_AlO2"
      ],
      "p": [
        "NaAlO2",
        "Ag2CO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "NaF",
        "BaNO32"
      ],
      "p": [
        "NaNO3",
        "m_Ba_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "NaF",
        "MgNO32"
      ],
      "p": [
        "NaNO3",
        "m_Mg_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "NaF",
        "ZnSO4"
      ],
      "p": [
        "Na2SO4",
        "m_Zn_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "NaF",
        "FeSO4"
      ],
      "p": [
        "Na2SO4",
        "m_Fe2_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "NaF",
        "CuSO4"
      ],
      "p": [
        "Na2SO4",
        "m_Cu_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "NaF",
        "CuNO32"
      ],
      "p": [
        "NaNO3",
        "m_Cu_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2S",
        "MgNO32"
      ],
      "p": [
        "NaNO3",
        "m_Mg_S"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2S",
        "ZnSO4"
      ],
      "p": [
        "Na2SO4",
        "m_Zn_S"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2S",
        "FeSO4"
      ],
      "p": [
        "Na2SO4",
        "FeS"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2S",
        "CuSO4"
      ],
      "p": [
        "Na2SO4",
        "CuS"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2S",
        "CuNO32"
      ],
      "p": [
        "NaNO3",
        "CuS"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2SO3",
        "BaNO32"
      ],
      "p": [
        "NaNO3",
        "BaSO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2SO3",
        "MgNO32"
      ],
      "p": [
        "NaNO3",
        "m_Mg_SO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2SO3",
        "ZnSO4"
      ],
      "p": [
        "Na2SO4",
        "m_Zn_SO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2SO3",
        "AgNO3"
      ],
      "p": [
        "NaNO3",
        "m_Ag_SO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na3PO4",
        "BaNO32"
      ],
      "p": [
        "NaNO3",
        "Ba3PO42"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na3PO4",
        "MgNO32"
      ],
      "p": [
        "NaNO3",
        "m_Mg_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na3PO4",
        "ZnSO4"
      ],
      "p": [
        "Na2SO4",
        "m_Zn_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na3PO4",
        "FeSO4"
      ],
      "p": [
        "Na2SO4",
        "m_Fe2_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na3PO4",
        "CuSO4"
      ],
      "p": [
        "Na2SO4",
        "m_Cu_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na3PO4",
        "CuNO32"
      ],
      "p": [
        "NaNO3",
        "m_Cu_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2SiO3",
        "BaNO32"
      ],
      "p": [
        "NaNO3",
        "m_Ba_SiO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2SiO3",
        "MgNO32"
      ],
      "p": [
        "NaNO3",
        "m_Mg_SiO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2SiO3",
        "ZnSO4"
      ],
      "p": [
        "Na2SO4",
        "m_Zn_SiO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2SiO3",
        "FeSO4"
      ],
      "p": [
        "Na2SO4",
        "m_Fe2_SiO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2SiO3",
        "CuSO4"
      ],
      "p": [
        "Na2SO4",
        "m_Cu_SiO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2SiO3",
        "CuNO32"
      ],
      "p": [
        "NaNO3",
        "m_Cu_SiO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2SiO3",
        "AgNO3"
      ],
      "p": [
        "NaNO3",
        "m_Ag_SiO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "NaBr",
        "AgNO3"
      ],
      "p": [
        "NaNO3",
        "AgBr"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "NaI",
        "AgNO3"
      ],
      "p": [
        "NaNO3",
        "AgI"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "KOH",
        "AlCl3"
      ],
      "p": [
        "KCl",
        "Al(OH)3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "KOH",
        "Al2SO43"
      ],
      "p": [
        "K2SO4",
        "Al(OH)3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "KOH",
        "AlNO33"
      ],
      "p": [
        "KNO3",
        "Al(OH)3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "KOH",
        "m_Al_CH3COO"
      ],
      "p": [
        "CH3COOK",
        "Al(OH)3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "KOH",
        "m_Al_Br"
      ],
      "p": [
        "m_K_Br",
        "Al(OH)3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "KOH",
        "m_Al_I"
      ],
      "p": [
        "m_K_I",
        "Al(OH)3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "KOH",
        "ZnCl2"
      ],
      "p": [
        "KCl",
        "ZnOH2"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "KOH",
        "ZnNO32"
      ],
      "p": [
        "KNO3",
        "ZnOH2"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "KOH",
        "m_Zn_ClO"
      ],
      "p": [
        "m_K_ClO",
        "ZnOH2"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "KOH",
        "m_Zn_CH3COO"
      ],
      "p": [
        "CH3COOK",
        "ZnOH2"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "KOH",
        "m_Zn_MnO4"
      ],
      "p": [
        "KMnO4",
        "ZnOH2"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "KOH",
        "m_Zn_AlO2"
      ],
      "p": [
        "m_K_AlO2",
        "ZnOH2"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "KOH",
        "m_Zn_Br"
      ],
      "p": [
        "m_K_Br",
        "ZnOH2"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "KOH",
        "m_Zn_I"
      ],
      "p": [
        "m_K_I",
        "ZnOH2"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "KOH",
        "FeCl2"
      ],
      "p": [
        "KCl",
        "FeOH2"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "KOH",
        "FeNO32"
      ],
      "p": [
        "KNO3",
        "FeOH2"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "KOH",
        "m_Fe2_MnO4"
      ],
      "p": [
        "KMnO4",
        "FeOH2"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "KOH",
        "m_Fe2_AlO2"
      ],
      "p": [
        "m_K_AlO2",
        "FeOH2"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "KOH",
        "m_Fe2_Br"
      ],
      "p": [
        "m_K_Br",
        "FeOH2"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "KOH",
        "m_Fe2_I"
      ],
      "p": [
        "m_K_I",
        "FeOH2"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "KCl",
        "AgNO3"
      ],
      "p": [
        "KNO3",
        "AgCl"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "K2SO4",
        "BaCl2"
      ],
      "p": [
        "KCl",
        "BaSO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "K2SO4",
        "BaNO32"
      ],
      "p": [
        "KNO3",
        "BaSO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "K2CO3",
        "BaCl2"
      ],
      "p": [
        "KCl",
        "BaCO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "K2CO3",
        "BaNO32"
      ],
      "p": [
        "KNO3",
        "BaCO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "K2CO3",
        "MgNO32"
      ],
      "p": [
        "KNO3",
        "MgCO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "K2CO3",
        "ZnSO4"
      ],
      "p": [
        "K2SO4",
        "ZnCO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "K2CO3",
        "AgNO3"
      ],
      "p": [
        "KNO3",
        "Ag2CO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_F",
        "BaCl2"
      ],
      "p": [
        "KCl",
        "m_Ba_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_F",
        "BaNO32"
      ],
      "p": [
        "KNO3",
        "m_Ba_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_F",
        "MgNO32"
      ],
      "p": [
        "KNO3",
        "m_Mg_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_F",
        "ZnSO4"
      ],
      "p": [
        "K2SO4",
        "m_Zn_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_F",
        "FeSO4"
      ],
      "p": [
        "K2SO4",
        "m_Fe2_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_F",
        "FeCl3"
      ],
      "p": [
        "KCl",
        "m_Fe3_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_F",
        "CuCl2"
      ],
      "p": [
        "KCl",
        "m_Cu_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_F",
        "CuSO4"
      ],
      "p": [
        "K2SO4",
        "m_Cu_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_F",
        "CuNO32"
      ],
      "p": [
        "KNO3",
        "m_Cu_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_S",
        "MgNO32"
      ],
      "p": [
        "KNO3",
        "m_Mg_S"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_S",
        "ZnSO4"
      ],
      "p": [
        "K2SO4",
        "m_Zn_S"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_S",
        "FeSO4"
      ],
      "p": [
        "K2SO4",
        "FeS"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_S",
        "CuCl2"
      ],
      "p": [
        "KCl",
        "CuS"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_S",
        "CuSO4"
      ],
      "p": [
        "K2SO4",
        "CuS"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_S",
        "CuNO32"
      ],
      "p": [
        "KNO3",
        "CuS"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_SO3",
        "BaCl2"
      ],
      "p": [
        "KCl",
        "BaSO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_SO3",
        "BaNO32"
      ],
      "p": [
        "KNO3",
        "BaSO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_SO3",
        "CaCl2"
      ],
      "p": [
        "KCl",
        "m_Ca_SO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_SO3",
        "MgNO32"
      ],
      "p": [
        "KNO3",
        "m_Mg_SO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_SO3",
        "ZnSO4"
      ],
      "p": [
        "K2SO4",
        "m_Zn_SO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_SO3",
        "AgNO3"
      ],
      "p": [
        "KNO3",
        "m_Ag_SO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_PO4",
        "BaCl2"
      ],
      "p": [
        "KCl",
        "Ba3PO42"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_PO4",
        "BaNO32"
      ],
      "p": [
        "KNO3",
        "Ba3PO42"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_PO4",
        "CaCl2"
      ],
      "p": [
        "KCl",
        "Ca3PO42"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_PO4",
        "MgNO32"
      ],
      "p": [
        "KNO3",
        "m_Mg_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_PO4",
        "ZnSO4"
      ],
      "p": [
        "K2SO4",
        "m_Zn_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_PO4",
        "FeSO4"
      ],
      "p": [
        "K2SO4",
        "m_Fe2_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_PO4",
        "FeCl3"
      ],
      "p": [
        "KCl",
        "m_Fe3_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_PO4",
        "CuCl2"
      ],
      "p": [
        "KCl",
        "m_Cu_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_PO4",
        "CuSO4"
      ],
      "p": [
        "K2SO4",
        "m_Cu_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_PO4",
        "CuNO32"
      ],
      "p": [
        "KNO3",
        "m_Cu_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_SiO3",
        "BaCl2"
      ],
      "p": [
        "KCl",
        "m_Ba_SiO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_SiO3",
        "BaNO32"
      ],
      "p": [
        "KNO3",
        "m_Ba_SiO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_SiO3",
        "MgNO32"
      ],
      "p": [
        "KNO3",
        "m_Mg_SiO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_SiO3",
        "ZnSO4"
      ],
      "p": [
        "K2SO4",
        "m_Zn_SiO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_SiO3",
        "FeSO4"
      ],
      "p": [
        "K2SO4",
        "m_Fe2_SiO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_SiO3",
        "CuCl2"
      ],
      "p": [
        "KCl",
        "m_Cu_SiO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_SiO3",
        "CuSO4"
      ],
      "p": [
        "K2SO4",
        "m_Cu_SiO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_SiO3",
        "CuNO32"
      ],
      "p": [
        "KNO3",
        "m_Cu_SiO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_SiO3",
        "AgNO3"
      ],
      "p": [
        "KNO3",
        "m_Ag_SiO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_Br",
        "AgNO3"
      ],
      "p": [
        "KNO3",
        "AgBr"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_I",
        "AgNO3"
      ],
      "p": [
        "KNO3",
        "AgI"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Ba(OH)2",
        "m_Al_CH3COO"
      ],
      "p": [
        "m_Ba_CH3COO",
        "Al(OH)3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Ba(OH)2",
        "m_Al_Br"
      ],
      "p": [
        "m_Ba_Br",
        "Al(OH)3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Ba(OH)2",
        "m_Al_I"
      ],
      "p": [
        "m_Ba_I",
        "Al(OH)3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Ba(OH)2",
        "m_Zn_ClO"
      ],
      "p": [
        "m_Ba_ClO",
        "ZnOH2"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Ba(OH)2",
        "m_Zn_CH3COO"
      ],
      "p": [
        "m_Ba_CH3COO",
        "ZnOH2"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Ba(OH)2",
        "m_Zn_MnO4"
      ],
      "p": [
        "m_Ba_MnO4",
        "ZnOH2"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Ba(OH)2",
        "m_Zn_AlO2"
      ],
      "p": [
        "m_Ba_AlO2",
        "ZnOH2"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Ba(OH)2",
        "m_Zn_Br"
      ],
      "p": [
        "m_Ba_Br",
        "ZnOH2"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Ba(OH)2",
        "m_Zn_I"
      ],
      "p": [
        "m_Ba_I",
        "ZnOH2"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Ba(OH)2",
        "m_Fe2_MnO4"
      ],
      "p": [
        "m_Ba_MnO4",
        "FeOH2"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Ba(OH)2",
        "m_Fe2_AlO2"
      ],
      "p": [
        "m_Ba_AlO2",
        "FeOH2"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Ba(OH)2",
        "m_Fe2_Br"
      ],
      "p": [
        "m_Ba_Br",
        "FeOH2"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Ba(OH)2",
        "m_Fe2_I"
      ],
      "p": [
        "m_Ba_I",
        "FeOH2"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "BaCl2",
        "MgSO4"
      ],
      "p": [
        "BaSO4",
        "MgCl2"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "BaCl2",
        "Al2SO43"
      ],
      "p": [
        "BaSO4",
        "AlCl3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "BaCl2",
        "m_Ag_CH3COO"
      ],
      "p": [
        "m_Ba_CH3COO",
        "AgCl"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "BaCl2",
        "m_Ag_MnO4"
      ],
      "p": [
        "m_Ba_MnO4",
        "AgCl"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "BaCl2",
        "m_Ag_AlO2"
      ],
      "p": [
        "m_Ba_AlO2",
        "AgCl"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "BaNO32",
        "CaSO4"
      ],
      "p": [
        "BaSO4",
        "CaNO32"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "BaNO32",
        "Al2SO43"
      ],
      "p": [
        "BaSO4",
        "AlNO33"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "BaNO32",
        "Fe2SO43"
      ],
      "p": [
        "BaSO4",
        "FeNO33"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "BaHCO32",
        "ZnSO4"
      ],
      "p": [
        "BaSO4",
        "m_Zn_HCO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "BaHCO32",
        "FeSO4"
      ],
      "p": [
        "BaSO4",
        "m_Fe2_HCO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Ba_ClO",
        "ZnSO4"
      ],
      "p": [
        "BaSO4",
        "m_Zn_ClO"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Ba_ClO",
        "FeSO4"
      ],
      "p": [
        "BaSO4",
        "m_Fe2_ClO"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Ba_ClO",
        "CuSO4"
      ],
      "p": [
        "BaSO4",
        "m_Cu_ClO"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Ba_CH3COO",
        "ZnSO4"
      ],
      "p": [
        "BaSO4",
        "m_Zn_CH3COO"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Ba_CH3COO",
        "CuSO4"
      ],
      "p": [
        "BaSO4",
        "m_Cu_CH3COO"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Ba_MnO4",
        "ZnSO4"
      ],
      "p": [
        "BaSO4",
        "m_Zn_MnO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Ba_MnO4",
        "FeSO4"
      ],
      "p": [
        "BaSO4",
        "m_Fe2_MnO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Ba_MnO4",
        "CuSO4"
      ],
      "p": [
        "BaSO4",
        "m_Cu_MnO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Ba_AlO2",
        "ZnSO4"
      ],
      "p": [
        "BaSO4",
        "m_Zn_AlO2"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Ba_AlO2",
        "FeSO4"
      ],
      "p": [
        "BaSO4",
        "m_Fe2_AlO2"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Ba_AlO2",
        "CuSO4"
      ],
      "p": [
        "BaSO4",
        "m_Cu_AlO2"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Ba_Br",
        "ZnSO4"
      ],
      "p": [
        "BaSO4",
        "m_Zn_Br"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Ba_Br",
        "FeSO4"
      ],
      "p": [
        "BaSO4",
        "m_Fe2_Br"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Ba_Br",
        "CuSO4"
      ],
      "p": [
        "BaSO4",
        "m_Cu_Br"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Ba_I",
        "ZnSO4"
      ],
      "p": [
        "BaSO4",
        "m_Zn_I"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Ba_I",
        "FeSO4"
      ],
      "p": [
        "BaSO4",
        "m_Fe2_I"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Ca(OH)2",
        "Al2SO43"
      ],
      "p": [
        "CaSO4",
        "Al(OH)3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Ca(OH)2",
        "AlNO33"
      ],
      "p": [
        "CaNO32",
        "Al(OH)3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Ca(OH)2",
        "m_Al_CH3COO"
      ],
      "p": [
        "CH3COO2Ca",
        "Al(OH)3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Ca(OH)2",
        "m_Al_Br"
      ],
      "p": [
        "m_Ca_Br",
        "Al(OH)3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Ca(OH)2",
        "m_Al_I"
      ],
      "p": [
        "m_Ca_I",
        "Al(OH)3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Ca(OH)2",
        "ZnNO32"
      ],
      "p": [
        "CaNO32",
        "ZnOH2"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Ca(OH)2",
        "m_Zn_CH3COO"
      ],
      "p": [
        "CH3COO2Ca",
        "ZnOH2"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Ca(OH)2",
        "m_Zn_MnO4"
      ],
      "p": [
        "m_Ca_MnO4",
        "ZnOH2"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Ca(OH)2",
        "m_Zn_AlO2"
      ],
      "p": [
        "m_Ca_AlO2",
        "ZnOH2"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Ca(OH)2",
        "m_Zn_Br"
      ],
      "p": [
        "m_Ca_Br",
        "ZnOH2"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Ca(OH)2",
        "m_Zn_I"
      ],
      "p": [
        "m_Ca_I",
        "ZnOH2"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Ca(OH)2",
        "FeNO32"
      ],
      "p": [
        "CaNO32",
        "FeOH2"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Ca(OH)2",
        "m_Fe2_MnO4"
      ],
      "p": [
        "m_Ca_MnO4",
        "FeOH2"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Ca(OH)2",
        "m_Fe2_AlO2"
      ],
      "p": [
        "m_Ca_AlO2",
        "FeOH2"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Ca(OH)2",
        "m_Fe2_Br"
      ],
      "p": [
        "m_Ca_Br",
        "FeOH2"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Ca(OH)2",
        "m_Fe2_I"
      ],
      "p": [
        "m_Ca_I",
        "FeOH2"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "CaCl2",
        "m_Mg_C2O4"
      ],
      "p": [
        "CaC2O4",
        "MgCl2"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "CaCl2",
        "m_Fe2_C2O4"
      ],
      "p": [
        "CaC2O4",
        "FeCl2"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "CaCl2",
        "Ag2SO4"
      ],
      "p": [
        "CaSO4",
        "AgCl"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "CaCl2",
        "m_Ag_CH3COO"
      ],
      "p": [
        "CH3COO2Ca",
        "AgCl"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "CaCl2",
        "m_Ag_MnO4"
      ],
      "p": [
        "m_Ca_MnO4",
        "AgCl"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "CaCl2",
        "m_Ag_AlO2"
      ],
      "p": [
        "m_Ca_AlO2",
        "AgCl"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Ca_Br",
        "AgNO3"
      ],
      "p": [
        "CaNO32",
        "AgBr"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Ca_I",
        "AgNO3"
      ],
      "p": [
        "CaNO32",
        "AgI"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Mg_C2O4",
        "ZnSO4"
      ],
      "p": [
        "MgSO4",
        "m_Zn_C2O4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Mg_C2O4",
        "CuCl2"
      ],
      "p": [
        "MgCl2",
        "m_Cu_C2O4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Mg_C2O4",
        "CuSO4"
      ],
      "p": [
        "MgSO4",
        "m_Cu_C2O4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "AlCl3",
        "AgNO3"
      ],
      "p": [
        "AlNO33",
        "AgCl"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Al_Br",
        "AgNO3"
      ],
      "p": [
        "AlNO33",
        "AgBr"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Al_I",
        "AgNO3"
      ],
      "p": [
        "AlNO33",
        "AgI"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "ZnCl2",
        "AgNO3"
      ],
      "p": [
        "ZnNO32",
        "AgCl"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "ZnSO4",
        "m_Fe3_C2O4"
      ],
      "p": [
        "m_Zn_C2O4",
        "Fe2SO43"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Zn_Br",
        "AgNO3"
      ],
      "p": [
        "ZnNO32",
        "AgBr"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Zn_I",
        "AgNO3"
      ],
      "p": [
        "ZnNO32",
        "AgI"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "FeCl2",
        "AgNO3"
      ],
      "p": [
        "FeNO32",
        "AgCl"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Fe2_C2O4",
        "CuCl2"
      ],
      "p": [
        "FeCl2",
        "m_Cu_C2O4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Fe2_C2O4",
        "CuNO32"
      ],
      "p": [
        "FeNO32",
        "m_Cu_C2O4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Fe2_C2O4",
        "AgNO3"
      ],
      "p": [
        "FeNO32",
        "m_Ag_C2O4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Fe2_Br",
        "AgNO3"
      ],
      "p": [
        "FeNO32",
        "AgBr"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Fe2_I",
        "AgNO3"
      ],
      "p": [
        "FeNO32",
        "AgI"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "FeCl3",
        "Ag2SO4"
      ],
      "p": [
        "Fe2SO43",
        "AgCl"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "FeCl3",
        "m_Ag_CH3COO"
      ],
      "p": [
        "m_Fe3_CH3COO",
        "AgCl"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "FeCl3",
        "m_Ag_MnO4"
      ],
      "p": [
        "m_Fe3_MnO4",
        "AgCl"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Fe3_C2O4",
        "CuSO4"
      ],
      "p": [
        "Fe2SO43",
        "m_Cu_C2O4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Fe3_C2O4",
        "CuNO32"
      ],
      "p": [
        "FeNO33",
        "m_Cu_C2O4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Fe3_C2O4",
        "AgNO3"
      ],
      "p": [
        "FeNO33",
        "m_Ag_C2O4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Fe3_Br",
        "AgNO3"
      ],
      "p": [
        "FeNO33",
        "AgBr"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "CuCl2",
        "m_Ag_CH3COO"
      ],
      "p": [
        "m_Cu_CH3COO",
        "AgCl"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "CuCl2",
        "m_Ag_MnO4"
      ],
      "p": [
        "m_Cu_MnO4",
        "AgCl"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "CuCl2",
        "m_Ag_AlO2"
      ],
      "p": [
        "m_Cu_AlO2",
        "AgCl"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "H3PO4",
        "m_Ba_CH3COO"
      ],
      "p": [
        "CH3COOH",
        "Ba3PO42"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "H3PO4",
        "CaSO4"
      ],
      "p": [
        "H2SO4",
        "Ca3PO42"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "H3PO4",
        "CaNO32"
      ],
      "p": [
        "HNO3",
        "Ca3PO42"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "H3PO4",
        "CH3COO2Ca"
      ],
      "p": [
        "CH3COOH",
        "Ca3PO42"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "H3PO4",
        "MgCl2"
      ],
      "p": [
        "HCl",
        "m_Mg_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "H3PO4",
        "MgSO4"
      ],
      "p": [
        "H2SO4",
        "m_Mg_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "H3PO4",
        "CH3COO2Mg"
      ],
      "p": [
        "CH3COOH",
        "m_Mg_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "H3PO4",
        "m_Mg_C2O4"
      ],
      "p": [
        "H2C2O4",
        "m_Mg_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "H3PO4",
        "AlCl3"
      ],
      "p": [
        "HCl",
        "m_Al_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "H3PO4",
        "Al2SO43"
      ],
      "p": [
        "H2SO4",
        "m_Al_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "H3PO4",
        "AlNO33"
      ],
      "p": [
        "HNO3",
        "m_Al_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "H3PO4",
        "m_Al_CH3COO"
      ],
      "p": [
        "CH3COOH",
        "m_Al_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "H3PO4",
        "ZnCl2"
      ],
      "p": [
        "HCl",
        "m_Zn_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "H3PO4",
        "ZnNO32"
      ],
      "p": [
        "HNO3",
        "m_Zn_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "H3PO4",
        "m_Zn_CH3COO"
      ],
      "p": [
        "CH3COOH",
        "m_Zn_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "H3PO4",
        "FeCl2"
      ],
      "p": [
        "HCl",
        "m_Fe2_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "H3PO4",
        "FeNO32"
      ],
      "p": [
        "HNO3",
        "m_Fe2_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "H3PO4",
        "m_Fe2_C2O4"
      ],
      "p": [
        "H2C2O4",
        "m_Fe2_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "H3PO4",
        "Fe2SO43"
      ],
      "p": [
        "H2SO4",
        "m_Fe3_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "H3PO4",
        "FeNO33"
      ],
      "p": [
        "HNO3",
        "m_Fe3_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "H3PO4",
        "m_Fe3_CH3COO"
      ],
      "p": [
        "CH3COOH",
        "m_Fe3_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "H3PO4",
        "m_Fe3_C2O4"
      ],
      "p": [
        "H2C2O4",
        "m_Fe3_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "H3PO4",
        "m_Cu_CH3COO"
      ],
      "p": [
        "CH3COOH",
        "m_Cu_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "HBr",
        "Ag2SO4"
      ],
      "p": [
        "H2SO4",
        "AgBr"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "HBr",
        "m_Ag_CH3COO"
      ],
      "p": [
        "CH3COOH",
        "AgBr"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "HI",
        "Ag2SO4"
      ],
      "p": [
        "H2SO4",
        "AgI"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "HI",
        "m_Ag_CH3COO"
      ],
      "p": [
        "CH3COOH",
        "AgI"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_SO4",
        "BaHCO32"
      ],
      "p": [
        "NH4HCO3",
        "BaSO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_CO3",
        "BaHCO32"
      ],
      "p": [
        "NH4HCO3",
        "BaCO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_CO3",
        "CaSO4"
      ],
      "p": [
        "m_NH4_SO4",
        "CaCO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_CO3",
        "CH3COO2Ca"
      ],
      "p": [
        "m_NH4_CH3COO",
        "CaCO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_CO3",
        "m_Ca_Br"
      ],
      "p": [
        "m_NH4_Br",
        "CaCO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_CO3",
        "m_Ca_I"
      ],
      "p": [
        "m_NH4_I",
        "CaCO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_CO3",
        "MgHCO32"
      ],
      "p": [
        "NH4HCO3",
        "MgCO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_CO3",
        "ZnNO32"
      ],
      "p": [
        "NH4NO3",
        "ZnCO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_F",
        "BaHCO32"
      ],
      "p": [
        "NH4HCO3",
        "m_Ba_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_F",
        "MgHCO32"
      ],
      "p": [
        "NH4HCO3",
        "m_Mg_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_F",
        "AlNO33"
      ],
      "p": [
        "NH4NO3",
        "m_Al_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_F",
        "ZnNO32"
      ],
      "p": [
        "NH4NO3",
        "m_Zn_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_F",
        "FeNO32"
      ],
      "p": [
        "NH4NO3",
        "m_Fe2_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_F",
        "FeNO33"
      ],
      "p": [
        "NH4NO3",
        "m_Fe3_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_S",
        "MgHCO32"
      ],
      "p": [
        "NH4HCO3",
        "m_Mg_S"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_S",
        "ZnNO32"
      ],
      "p": [
        "NH4NO3",
        "m_Zn_S"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_S",
        "FeNO32"
      ],
      "p": [
        "NH4NO3",
        "FeS"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_SO3",
        "BaHCO32"
      ],
      "p": [
        "NH4HCO3",
        "BaSO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_SO3",
        "CaNO32"
      ],
      "p": [
        "NH4NO3",
        "m_Ca_SO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_SO3",
        "CaHCO32"
      ],
      "p": [
        "NH4HCO3",
        "m_Ca_SO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_SO3",
        "MgHCO32"
      ],
      "p": [
        "NH4HCO3",
        "m_Mg_SO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_SO3",
        "ZnNO32"
      ],
      "p": [
        "NH4NO3",
        "m_Zn_SO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_C2O4",
        "CaNO32"
      ],
      "p": [
        "NH4NO3",
        "CaC2O4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_C2O4",
        "CaHCO32"
      ],
      "p": [
        "NH4HCO3",
        "CaC2O4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_C2O4",
        "AlNO33"
      ],
      "p": [
        "NH4NO3",
        "m_Al_C2O4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_C2O4",
        "ZnNO32"
      ],
      "p": [
        "NH4NO3",
        "m_Zn_C2O4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_PO4",
        "BaHCO32"
      ],
      "p": [
        "NH4HCO3",
        "Ba3PO42"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_PO4",
        "CaNO32"
      ],
      "p": [
        "NH4NO3",
        "Ca3PO42"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_PO4",
        "CaHCO32"
      ],
      "p": [
        "NH4HCO3",
        "Ca3PO42"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_PO4",
        "MgHCO32"
      ],
      "p": [
        "NH4HCO3",
        "m_Mg_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_PO4",
        "AlNO33"
      ],
      "p": [
        "NH4NO3",
        "m_Al_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_PO4",
        "ZnNO32"
      ],
      "p": [
        "NH4NO3",
        "m_Zn_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_PO4",
        "FeNO32"
      ],
      "p": [
        "NH4NO3",
        "m_Fe2_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_PO4",
        "FeNO33"
      ],
      "p": [
        "NH4NO3",
        "m_Fe3_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_SiO3",
        "BaHCO32"
      ],
      "p": [
        "NH4HCO3",
        "m_Ba_SiO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_SiO3",
        "MgHCO32"
      ],
      "p": [
        "NH4HCO3",
        "m_Mg_SiO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_SiO3",
        "ZnNO32"
      ],
      "p": [
        "NH4NO3",
        "m_Zn_SiO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_SiO3",
        "FeNO32"
      ],
      "p": [
        "NH4NO3",
        "m_Fe2_SiO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2SO4",
        "BaHCO32"
      ],
      "p": [
        "NaHCO3",
        "BaSO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "NaF",
        "BaHCO32"
      ],
      "p": [
        "NaHCO3",
        "m_Ba_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "NaF",
        "MgCl2"
      ],
      "p": [
        "NaCl",
        "m_Mg_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "NaF",
        "MgHCO32"
      ],
      "p": [
        "NaHCO3",
        "m_Mg_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "NaF",
        "AlCl3"
      ],
      "p": [
        "NaCl",
        "m_Al_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "NaF",
        "ZnCl2"
      ],
      "p": [
        "NaCl",
        "m_Zn_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "NaF",
        "FeCl2"
      ],
      "p": [
        "NaCl",
        "m_Fe2_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2S",
        "MgCl2"
      ],
      "p": [
        "NaCl",
        "m_Mg_S"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2S",
        "MgHCO32"
      ],
      "p": [
        "NaHCO3",
        "m_Mg_S"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2S",
        "ZnCl2"
      ],
      "p": [
        "NaCl",
        "m_Zn_S"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2S",
        "FeCl2"
      ],
      "p": [
        "NaCl",
        "FeS"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2SO3",
        "BaHCO32"
      ],
      "p": [
        "NaHCO3",
        "BaSO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2SO3",
        "CaHCO32"
      ],
      "p": [
        "NaHCO3",
        "m_Ca_SO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2SO3",
        "MgCl2"
      ],
      "p": [
        "NaCl",
        "m_Mg_SO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2SO3",
        "MgHCO32"
      ],
      "p": [
        "NaHCO3",
        "m_Mg_SO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2SO3",
        "ZnCl2"
      ],
      "p": [
        "NaCl",
        "m_Zn_SO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na3PO4",
        "BaHCO32"
      ],
      "p": [
        "NaHCO3",
        "Ba3PO42"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na3PO4",
        "CaHCO32"
      ],
      "p": [
        "NaHCO3",
        "Ca3PO42"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na3PO4",
        "MgCl2"
      ],
      "p": [
        "NaCl",
        "m_Mg_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na3PO4",
        "MgHCO32"
      ],
      "p": [
        "NaHCO3",
        "m_Mg_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na3PO4",
        "AlCl3"
      ],
      "p": [
        "NaCl",
        "m_Al_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na3PO4",
        "ZnCl2"
      ],
      "p": [
        "NaCl",
        "m_Zn_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na3PO4",
        "FeCl2"
      ],
      "p": [
        "NaCl",
        "m_Fe2_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2SiO3",
        "BaHCO32"
      ],
      "p": [
        "NaHCO3",
        "m_Ba_SiO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2SiO3",
        "MgCl2"
      ],
      "p": [
        "NaCl",
        "m_Mg_SiO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2SiO3",
        "MgHCO32"
      ],
      "p": [
        "NaHCO3",
        "m_Mg_SiO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2SiO3",
        "ZnCl2"
      ],
      "p": [
        "NaCl",
        "m_Zn_SiO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2SiO3",
        "FeCl2"
      ],
      "p": [
        "NaCl",
        "m_Fe2_SiO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "K2CO3",
        "CaSO4"
      ],
      "p": [
        "K2SO4",
        "CaCO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "K2CO3",
        "CaNO32"
      ],
      "p": [
        "KNO3",
        "CaCO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "K2CO3",
        "CaHCO32"
      ],
      "p": [
        "m_K_HCO3",
        "CaCO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "K2CO3",
        "CH3COO2Ca"
      ],
      "p": [
        "CH3COOK",
        "CaCO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "K2CO3",
        "m_Ca_MnO4"
      ],
      "p": [
        "KMnO4",
        "CaCO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "K2CO3",
        "m_Ca_AlO2"
      ],
      "p": [
        "m_K_AlO2",
        "CaCO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "K2CO3",
        "m_Ca_Br"
      ],
      "p": [
        "m_K_Br",
        "CaCO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "K2CO3",
        "m_Ca_I"
      ],
      "p": [
        "m_K_I",
        "CaCO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Ba_S",
        "MgCl2"
      ],
      "p": [
        "BaCl2",
        "m_Mg_S"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Ba_S",
        "ZnCl2"
      ],
      "p": [
        "BaCl2",
        "m_Zn_S"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Ba_S",
        "ZnNO32"
      ],
      "p": [
        "BaNO32",
        "m_Zn_S"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Ba_S",
        "FeCl2"
      ],
      "p": [
        "BaCl2",
        "FeS"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Ba_S",
        "FeNO32"
      ],
      "p": [
        "BaNO32",
        "FeS"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "CaSO4",
        "m_Fe2_C2O4"
      ],
      "p": [
        "CaC2O4",
        "FeSO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "CaNO32",
        "m_Mg_C2O4"
      ],
      "p": [
        "CaC2O4",
        "MgNO32"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Mg_C2O4",
        "AlNO33"
      ],
      "p": [
        "MgNO32",
        "m_Al_C2O4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Mg_C2O4",
        "ZnNO32"
      ],
      "p": [
        "MgNO32",
        "m_Zn_C2O4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "AlCl3",
        "m_Fe3_C2O4"
      ],
      "p": [
        "m_Al_C2O4",
        "FeCl3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Al2SO43",
        "m_Fe2_C2O4"
      ],
      "p": [
        "m_Al_C2O4",
        "FeSO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "ZnCl2",
        "m_Fe3_C2O4"
      ],
      "p": [
        "m_Zn_C2O4",
        "FeCl3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "ZnCl2",
        "Ag2SO4"
      ],
      "p": [
        "ZnSO4",
        "AgCl"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Zn_Br",
        "Ag2SO4"
      ],
      "p": [
        "ZnSO4",
        "AgBr"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Zn_I",
        "Ag2SO4"
      ],
      "p": [
        "ZnSO4",
        "AgI"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "FeCl2",
        "Ag2SO4"
      ],
      "p": [
        "FeSO4",
        "AgCl"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Fe2_C2O4",
        "Ag2SO4"
      ],
      "p": [
        "FeSO4",
        "m_Ag_C2O4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Fe2_Br",
        "Ag2SO4"
      ],
      "p": [
        "FeSO4",
        "AgBr"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Fe2_I",
        "Ag2SO4"
      ],
      "p": [
        "FeSO4",
        "AgI"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Cu_Br",
        "Ag2SO4"
      ],
      "p": [
        "CuSO4",
        "AgBr"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "H3PO4",
        "m_Ba_S"
      ],
      "p": [
        "H2S",
        "Ba3PO42"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Ba_S",
        "MgSO4"
      ],
      "p": [
        "BaSO4",
        "m_Mg_S"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Ba_Br",
        "Ag2SO4"
      ],
      "p": [
        "BaSO4",
        "AgBr"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Ba_I",
        "Ag2SO4"
      ],
      "p": [
        "BaSO4",
        "AgI"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "HClO",
        "m_NH4_S"
      ],
      "p": [
        "H2S",
        "m_NH4_ClO"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "HClO",
        "Na2S"
      ],
      "p": [
        "H2S",
        "NaClO"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "HClO",
        "m_K_S"
      ],
      "p": [
        "H2S",
        "m_K_ClO"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "HClO",
        "m_Ba_S"
      ],
      "p": [
        "H2S",
        "m_Ba_ClO"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "H3PO4",
        "m_NH4_S"
      ],
      "p": [
        "H2S",
        "m_NH4_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "H3PO4",
        "Na2S"
      ],
      "p": [
        "H2S",
        "Na3PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "H3PO4",
        "m_K_S"
      ],
      "p": [
        "H2S",
        "m_K_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "HBr",
        "m_NH4_S"
      ],
      "p": [
        "H2S",
        "m_NH4_Br"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "HBr",
        "Na2S"
      ],
      "p": [
        "H2S",
        "NaBr"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "HBr",
        "m_K_S"
      ],
      "p": [
        "H2S",
        "m_K_Br"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "HBr",
        "m_Ba_S"
      ],
      "p": [
        "H2S",
        "m_Ba_Br"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "HI",
        "m_NH4_S"
      ],
      "p": [
        "H2S",
        "m_NH4_I"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "HI",
        "Na2S"
      ],
      "p": [
        "H2S",
        "NaI"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "HI",
        "m_K_S"
      ],
      "p": [
        "H2S",
        "m_K_I"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "HI",
        "m_Ba_S"
      ],
      "p": [
        "H2S",
        "m_Ba_I"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "HClO",
        "m_NH4_SiO3"
      ],
      "p": [
        "H2SiO3",
        "m_NH4_ClO"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "HClO",
        "Na2SiO3"
      ],
      "p": [
        "H2SiO3",
        "NaClO"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "HClO",
        "m_K_SiO3"
      ],
      "p": [
        "H2SiO3",
        "m_K_ClO"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "H3PO4",
        "m_NH4_SiO3"
      ],
      "p": [
        "H2SiO3",
        "m_NH4_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "H3PO4",
        "Na2SiO3"
      ],
      "p": [
        "H2SiO3",
        "Na3PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "H3PO4",
        "m_K_SiO3"
      ],
      "p": [
        "H2SiO3",
        "m_K_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "H3PO4",
        "m_Ba_ClO"
      ],
      "p": [
        "HClO",
        "Ba3PO42"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "H3PO4",
        "m_Ba_Br"
      ],
      "p": [
        "HBr",
        "Ba3PO42"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "H3PO4",
        "m_Ba_I"
      ],
      "p": [
        "HI",
        "Ba3PO42"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "H3PO4",
        "m_Ca_Br"
      ],
      "p": [
        "HBr",
        "Ca3PO42"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "H3PO4",
        "m_Ca_I"
      ],
      "p": [
        "HI",
        "Ca3PO42"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "H3PO4",
        "m_Mg_ClO"
      ],
      "p": [
        "HClO",
        "m_Mg_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "H3PO4",
        "m_Mg_Br"
      ],
      "p": [
        "HBr",
        "m_Mg_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "H3PO4",
        "m_Mg_I"
      ],
      "p": [
        "HI",
        "m_Mg_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "H3PO4",
        "m_Al_Br"
      ],
      "p": [
        "HBr",
        "m_Al_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "H3PO4",
        "m_Al_I"
      ],
      "p": [
        "HI",
        "m_Al_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "H3PO4",
        "m_Zn_ClO"
      ],
      "p": [
        "HClO",
        "m_Zn_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "H3PO4",
        "m_Zn_Br"
      ],
      "p": [
        "HBr",
        "m_Zn_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "H3PO4",
        "m_Zn_I"
      ],
      "p": [
        "HI",
        "m_Zn_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "H3PO4",
        "m_Fe2_Br"
      ],
      "p": [
        "HBr",
        "m_Fe2_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "H3PO4",
        "m_Fe2_I"
      ],
      "p": [
        "HI",
        "m_Fe2_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "H3PO4",
        "m_Fe3_Br"
      ],
      "p": [
        "HBr",
        "m_Fe3_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "H3PO4",
        "m_Cu_Br"
      ],
      "p": [
        "HBr",
        "m_Cu_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "HBr",
        "m_NH4_SiO3"
      ],
      "p": [
        "H2SiO3",
        "m_NH4_Br"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "HBr",
        "Na2SiO3"
      ],
      "p": [
        "H2SiO3",
        "NaBr"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "HBr",
        "m_K_SiO3"
      ],
      "p": [
        "H2SiO3",
        "m_K_Br"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "HI",
        "m_NH4_SiO3"
      ],
      "p": [
        "H2SiO3",
        "m_NH4_I"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "HI",
        "Na2SiO3"
      ],
      "p": [
        "H2SiO3",
        "NaI"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "HI",
        "m_K_SiO3"
      ],
      "p": [
        "H2SiO3",
        "m_K_I"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "NH4Cl",
        "Ag2SO4"
      ],
      "p": [
        "m_NH4_SO4",
        "AgCl"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "NH4Cl",
        "m_Ag_CH3COO"
      ],
      "p": [
        "m_NH4_CH3COO",
        "AgCl"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_SO4",
        "m_Ba_S"
      ],
      "p": [
        "m_NH4_S",
        "BaSO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_SO4",
        "m_Ba_ClO"
      ],
      "p": [
        "m_NH4_ClO",
        "BaSO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_SO4",
        "m_Ba_CH3COO"
      ],
      "p": [
        "m_NH4_CH3COO",
        "BaSO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_SO4",
        "m_Ba_Br"
      ],
      "p": [
        "m_NH4_Br",
        "BaSO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_SO4",
        "m_Ba_I"
      ],
      "p": [
        "m_NH4_I",
        "BaSO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_CO3",
        "m_Ba_S"
      ],
      "p": [
        "m_NH4_S",
        "BaCO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_CO3",
        "m_Ba_ClO"
      ],
      "p": [
        "m_NH4_ClO",
        "BaCO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_CO3",
        "m_Ba_CH3COO"
      ],
      "p": [
        "m_NH4_CH3COO",
        "BaCO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_CO3",
        "m_Ba_Br"
      ],
      "p": [
        "m_NH4_Br",
        "BaCO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_CO3",
        "m_Ba_I"
      ],
      "p": [
        "m_NH4_I",
        "BaCO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_CO3",
        "MgCl2"
      ],
      "p": [
        "NH4Cl",
        "MgCO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_CO3",
        "MgSO4"
      ],
      "p": [
        "m_NH4_SO4",
        "MgCO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_CO3",
        "m_Mg_ClO"
      ],
      "p": [
        "m_NH4_ClO",
        "MgCO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_CO3",
        "CH3COO2Mg"
      ],
      "p": [
        "m_NH4_CH3COO",
        "MgCO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_CO3",
        "m_Mg_C2O4"
      ],
      "p": [
        "m_NH4_C2O4",
        "MgCO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_CO3",
        "m_Mg_Br"
      ],
      "p": [
        "m_NH4_Br",
        "MgCO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_CO3",
        "m_Mg_I"
      ],
      "p": [
        "m_NH4_I",
        "MgCO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_CO3",
        "ZnCl2"
      ],
      "p": [
        "NH4Cl",
        "ZnCO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_CO3",
        "m_Zn_ClO"
      ],
      "p": [
        "m_NH4_ClO",
        "ZnCO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_CO3",
        "m_Zn_CH3COO"
      ],
      "p": [
        "m_NH4_CH3COO",
        "ZnCO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_CO3",
        "m_Zn_Br"
      ],
      "p": [
        "m_NH4_Br",
        "ZnCO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_CO3",
        "m_Zn_I"
      ],
      "p": [
        "m_NH4_I",
        "ZnCO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_CO3",
        "Ag2SO4"
      ],
      "p": [
        "m_NH4_SO4",
        "Ag2CO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_CO3",
        "m_Ag_CH3COO"
      ],
      "p": [
        "m_NH4_CH3COO",
        "Ag2CO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_F",
        "m_Ba_S"
      ],
      "p": [
        "m_NH4_S",
        "m_Ba_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_F",
        "m_Ba_ClO"
      ],
      "p": [
        "m_NH4_ClO",
        "m_Ba_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_F",
        "m_Ba_CH3COO"
      ],
      "p": [
        "m_NH4_CH3COO",
        "m_Ba_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_F",
        "m_Ba_Br"
      ],
      "p": [
        "m_NH4_Br",
        "m_Ba_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_F",
        "m_Ba_I"
      ],
      "p": [
        "m_NH4_I",
        "m_Ba_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_F",
        "MgCl2"
      ],
      "p": [
        "NH4Cl",
        "m_Mg_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_F",
        "MgSO4"
      ],
      "p": [
        "m_NH4_SO4",
        "m_Mg_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_F",
        "m_Mg_ClO"
      ],
      "p": [
        "m_NH4_ClO",
        "m_Mg_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_F",
        "CH3COO2Mg"
      ],
      "p": [
        "m_NH4_CH3COO",
        "m_Mg_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_F",
        "m_Mg_C2O4"
      ],
      "p": [
        "m_NH4_C2O4",
        "m_Mg_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_F",
        "m_Mg_Br"
      ],
      "p": [
        "m_NH4_Br",
        "m_Mg_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_F",
        "m_Mg_I"
      ],
      "p": [
        "m_NH4_I",
        "m_Mg_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_F",
        "AlCl3"
      ],
      "p": [
        "NH4Cl",
        "m_Al_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_F",
        "Al2SO43"
      ],
      "p": [
        "m_NH4_SO4",
        "m_Al_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_F",
        "m_Al_CH3COO"
      ],
      "p": [
        "m_NH4_CH3COO",
        "m_Al_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_F",
        "m_Al_Br"
      ],
      "p": [
        "m_NH4_Br",
        "m_Al_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_F",
        "m_Al_I"
      ],
      "p": [
        "m_NH4_I",
        "m_Al_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_F",
        "ZnCl2"
      ],
      "p": [
        "NH4Cl",
        "m_Zn_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_F",
        "m_Zn_ClO"
      ],
      "p": [
        "m_NH4_ClO",
        "m_Zn_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_F",
        "m_Zn_CH3COO"
      ],
      "p": [
        "m_NH4_CH3COO",
        "m_Zn_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_F",
        "m_Zn_Br"
      ],
      "p": [
        "m_NH4_Br",
        "m_Zn_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_F",
        "m_Zn_I"
      ],
      "p": [
        "m_NH4_I",
        "m_Zn_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_F",
        "FeCl2"
      ],
      "p": [
        "NH4Cl",
        "m_Fe2_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_F",
        "m_Fe2_C2O4"
      ],
      "p": [
        "m_NH4_C2O4",
        "m_Fe2_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_F",
        "m_Fe2_Br"
      ],
      "p": [
        "m_NH4_Br",
        "m_Fe2_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_F",
        "m_Fe2_I"
      ],
      "p": [
        "m_NH4_I",
        "m_Fe2_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_F",
        "Fe2SO43"
      ],
      "p": [
        "m_NH4_SO4",
        "m_Fe3_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_F",
        "m_Fe3_CH3COO"
      ],
      "p": [
        "m_NH4_CH3COO",
        "m_Fe3_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_F",
        "m_Fe3_C2O4"
      ],
      "p": [
        "m_NH4_C2O4",
        "m_Fe3_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_F",
        "m_Fe3_Br"
      ],
      "p": [
        "m_NH4_Br",
        "m_Fe3_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_F",
        "m_Cu_CH3COO"
      ],
      "p": [
        "m_NH4_CH3COO",
        "m_Cu_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_F",
        "m_Cu_Br"
      ],
      "p": [
        "m_NH4_Br",
        "m_Cu_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_S",
        "MgCl2"
      ],
      "p": [
        "NH4Cl",
        "m_Mg_S"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_S",
        "MgSO4"
      ],
      "p": [
        "m_NH4_SO4",
        "m_Mg_S"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_S",
        "m_Mg_ClO"
      ],
      "p": [
        "m_NH4_ClO",
        "m_Mg_S"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_S",
        "CH3COO2Mg"
      ],
      "p": [
        "m_NH4_CH3COO",
        "m_Mg_S"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_S",
        "m_Mg_C2O4"
      ],
      "p": [
        "m_NH4_C2O4",
        "m_Mg_S"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_S",
        "m_Mg_Br"
      ],
      "p": [
        "m_NH4_Br",
        "m_Mg_S"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_S",
        "m_Mg_I"
      ],
      "p": [
        "m_NH4_I",
        "m_Mg_S"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_S",
        "ZnCl2"
      ],
      "p": [
        "NH4Cl",
        "m_Zn_S"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_S",
        "m_Zn_ClO"
      ],
      "p": [
        "m_NH4_ClO",
        "m_Zn_S"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_S",
        "m_Zn_CH3COO"
      ],
      "p": [
        "m_NH4_CH3COO",
        "m_Zn_S"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_S",
        "m_Zn_Br"
      ],
      "p": [
        "m_NH4_Br",
        "m_Zn_S"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_S",
        "m_Zn_I"
      ],
      "p": [
        "m_NH4_I",
        "m_Zn_S"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_S",
        "FeCl2"
      ],
      "p": [
        "NH4Cl",
        "FeS"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_S",
        "m_Fe2_C2O4"
      ],
      "p": [
        "m_NH4_C2O4",
        "FeS"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_S",
        "m_Fe2_Br"
      ],
      "p": [
        "m_NH4_Br",
        "FeS"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_S",
        "m_Fe2_I"
      ],
      "p": [
        "m_NH4_I",
        "FeS"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_S",
        "m_Cu_CH3COO"
      ],
      "p": [
        "m_NH4_CH3COO",
        "CuS"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_S",
        "m_Cu_Br"
      ],
      "p": [
        "m_NH4_Br",
        "CuS"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_SO3",
        "m_Ba_S"
      ],
      "p": [
        "m_NH4_S",
        "BaSO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_SO3",
        "m_Ba_ClO"
      ],
      "p": [
        "m_NH4_ClO",
        "BaSO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_SO3",
        "m_Ba_CH3COO"
      ],
      "p": [
        "m_NH4_CH3COO",
        "BaSO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_SO3",
        "m_Ba_Br"
      ],
      "p": [
        "m_NH4_Br",
        "BaSO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_SO3",
        "m_Ba_I"
      ],
      "p": [
        "m_NH4_I",
        "BaSO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_SO3",
        "CaSO4"
      ],
      "p": [
        "m_NH4_SO4",
        "m_Ca_SO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_SO3",
        "CH3COO2Ca"
      ],
      "p": [
        "m_NH4_CH3COO",
        "m_Ca_SO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_SO3",
        "m_Ca_Br"
      ],
      "p": [
        "m_NH4_Br",
        "m_Ca_SO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_SO3",
        "m_Ca_I"
      ],
      "p": [
        "m_NH4_I",
        "m_Ca_SO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_SO3",
        "MgCl2"
      ],
      "p": [
        "NH4Cl",
        "m_Mg_SO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_SO3",
        "MgSO4"
      ],
      "p": [
        "m_NH4_SO4",
        "m_Mg_SO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_SO3",
        "m_Mg_ClO"
      ],
      "p": [
        "m_NH4_ClO",
        "m_Mg_SO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_SO3",
        "CH3COO2Mg"
      ],
      "p": [
        "m_NH4_CH3COO",
        "m_Mg_SO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_SO3",
        "m_Mg_C2O4"
      ],
      "p": [
        "m_NH4_C2O4",
        "m_Mg_SO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_SO3",
        "m_Mg_Br"
      ],
      "p": [
        "m_NH4_Br",
        "m_Mg_SO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_SO3",
        "m_Mg_I"
      ],
      "p": [
        "m_NH4_I",
        "m_Mg_SO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_SO3",
        "ZnCl2"
      ],
      "p": [
        "NH4Cl",
        "m_Zn_SO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_SO3",
        "m_Zn_ClO"
      ],
      "p": [
        "m_NH4_ClO",
        "m_Zn_SO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_SO3",
        "m_Zn_CH3COO"
      ],
      "p": [
        "m_NH4_CH3COO",
        "m_Zn_SO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_SO3",
        "m_Zn_Br"
      ],
      "p": [
        "m_NH4_Br",
        "m_Zn_SO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_SO3",
        "m_Zn_I"
      ],
      "p": [
        "m_NH4_I",
        "m_Zn_SO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_SO3",
        "Ag2SO4"
      ],
      "p": [
        "m_NH4_SO4",
        "m_Ag_SO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_SO3",
        "m_Ag_CH3COO"
      ],
      "p": [
        "m_NH4_CH3COO",
        "m_Ag_SO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_C2O4",
        "CaSO4"
      ],
      "p": [
        "m_NH4_SO4",
        "CaC2O4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_C2O4",
        "CH3COO2Ca"
      ],
      "p": [
        "m_NH4_CH3COO",
        "CaC2O4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_C2O4",
        "m_Ca_Br"
      ],
      "p": [
        "m_NH4_Br",
        "CaC2O4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_C2O4",
        "m_Ca_I"
      ],
      "p": [
        "m_NH4_I",
        "CaC2O4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_C2O4",
        "AlCl3"
      ],
      "p": [
        "NH4Cl",
        "m_Al_C2O4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_C2O4",
        "Al2SO43"
      ],
      "p": [
        "m_NH4_SO4",
        "m_Al_C2O4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_C2O4",
        "m_Al_CH3COO"
      ],
      "p": [
        "m_NH4_CH3COO",
        "m_Al_C2O4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_C2O4",
        "m_Al_Br"
      ],
      "p": [
        "m_NH4_Br",
        "m_Al_C2O4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_C2O4",
        "m_Al_I"
      ],
      "p": [
        "m_NH4_I",
        "m_Al_C2O4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_C2O4",
        "ZnCl2"
      ],
      "p": [
        "NH4Cl",
        "m_Zn_C2O4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_C2O4",
        "m_Zn_ClO"
      ],
      "p": [
        "m_NH4_ClO",
        "m_Zn_C2O4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_C2O4",
        "m_Zn_CH3COO"
      ],
      "p": [
        "m_NH4_CH3COO",
        "m_Zn_C2O4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_C2O4",
        "m_Zn_Br"
      ],
      "p": [
        "m_NH4_Br",
        "m_Zn_C2O4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_C2O4",
        "m_Zn_I"
      ],
      "p": [
        "m_NH4_I",
        "m_Zn_C2O4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_C2O4",
        "m_Cu_CH3COO"
      ],
      "p": [
        "m_NH4_CH3COO",
        "m_Cu_C2O4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_C2O4",
        "m_Cu_Br"
      ],
      "p": [
        "m_NH4_Br",
        "m_Cu_C2O4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_C2O4",
        "Ag2SO4"
      ],
      "p": [
        "m_NH4_SO4",
        "m_Ag_C2O4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_C2O4",
        "m_Ag_CH3COO"
      ],
      "p": [
        "m_NH4_CH3COO",
        "m_Ag_C2O4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_PO4",
        "m_Ba_S"
      ],
      "p": [
        "m_NH4_S",
        "Ba3PO42"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_PO4",
        "m_Ba_ClO"
      ],
      "p": [
        "m_NH4_ClO",
        "Ba3PO42"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_PO4",
        "m_Ba_CH3COO"
      ],
      "p": [
        "m_NH4_CH3COO",
        "Ba3PO42"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_PO4",
        "m_Ba_Br"
      ],
      "p": [
        "m_NH4_Br",
        "Ba3PO42"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_PO4",
        "m_Ba_I"
      ],
      "p": [
        "m_NH4_I",
        "Ba3PO42"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_PO4",
        "CaSO4"
      ],
      "p": [
        "m_NH4_SO4",
        "Ca3PO42"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_PO4",
        "CH3COO2Ca"
      ],
      "p": [
        "m_NH4_CH3COO",
        "Ca3PO42"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_PO4",
        "m_Ca_Br"
      ],
      "p": [
        "m_NH4_Br",
        "Ca3PO42"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_PO4",
        "m_Ca_I"
      ],
      "p": [
        "m_NH4_I",
        "Ca3PO42"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_PO4",
        "MgCl2"
      ],
      "p": [
        "NH4Cl",
        "m_Mg_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_PO4",
        "MgSO4"
      ],
      "p": [
        "m_NH4_SO4",
        "m_Mg_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_PO4",
        "m_Mg_ClO"
      ],
      "p": [
        "m_NH4_ClO",
        "m_Mg_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_PO4",
        "CH3COO2Mg"
      ],
      "p": [
        "m_NH4_CH3COO",
        "m_Mg_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_PO4",
        "m_Mg_C2O4"
      ],
      "p": [
        "m_NH4_C2O4",
        "m_Mg_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_PO4",
        "m_Mg_Br"
      ],
      "p": [
        "m_NH4_Br",
        "m_Mg_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_PO4",
        "m_Mg_I"
      ],
      "p": [
        "m_NH4_I",
        "m_Mg_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_PO4",
        "AlCl3"
      ],
      "p": [
        "NH4Cl",
        "m_Al_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_PO4",
        "Al2SO43"
      ],
      "p": [
        "m_NH4_SO4",
        "m_Al_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_PO4",
        "m_Al_CH3COO"
      ],
      "p": [
        "m_NH4_CH3COO",
        "m_Al_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_PO4",
        "m_Al_Br"
      ],
      "p": [
        "m_NH4_Br",
        "m_Al_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_PO4",
        "m_Al_I"
      ],
      "p": [
        "m_NH4_I",
        "m_Al_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_PO4",
        "ZnCl2"
      ],
      "p": [
        "NH4Cl",
        "m_Zn_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_PO4",
        "m_Zn_ClO"
      ],
      "p": [
        "m_NH4_ClO",
        "m_Zn_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_PO4",
        "m_Zn_CH3COO"
      ],
      "p": [
        "m_NH4_CH3COO",
        "m_Zn_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_PO4",
        "m_Zn_Br"
      ],
      "p": [
        "m_NH4_Br",
        "m_Zn_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_PO4",
        "m_Zn_I"
      ],
      "p": [
        "m_NH4_I",
        "m_Zn_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_PO4",
        "FeCl2"
      ],
      "p": [
        "NH4Cl",
        "m_Fe2_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_PO4",
        "m_Fe2_C2O4"
      ],
      "p": [
        "m_NH4_C2O4",
        "m_Fe2_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_PO4",
        "m_Fe2_Br"
      ],
      "p": [
        "m_NH4_Br",
        "m_Fe2_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_PO4",
        "m_Fe2_I"
      ],
      "p": [
        "m_NH4_I",
        "m_Fe2_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_PO4",
        "Fe2SO43"
      ],
      "p": [
        "m_NH4_SO4",
        "m_Fe3_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_PO4",
        "m_Fe3_CH3COO"
      ],
      "p": [
        "m_NH4_CH3COO",
        "m_Fe3_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_PO4",
        "m_Fe3_C2O4"
      ],
      "p": [
        "m_NH4_C2O4",
        "m_Fe3_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_PO4",
        "m_Fe3_Br"
      ],
      "p": [
        "m_NH4_Br",
        "m_Fe3_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_PO4",
        "m_Cu_CH3COO"
      ],
      "p": [
        "m_NH4_CH3COO",
        "m_Cu_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_PO4",
        "m_Cu_Br"
      ],
      "p": [
        "m_NH4_Br",
        "m_Cu_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_SiO3",
        "m_Ba_S"
      ],
      "p": [
        "m_NH4_S",
        "m_Ba_SiO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_SiO3",
        "m_Ba_ClO"
      ],
      "p": [
        "m_NH4_ClO",
        "m_Ba_SiO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_SiO3",
        "m_Ba_CH3COO"
      ],
      "p": [
        "m_NH4_CH3COO",
        "m_Ba_SiO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_SiO3",
        "m_Ba_Br"
      ],
      "p": [
        "m_NH4_Br",
        "m_Ba_SiO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_SiO3",
        "m_Ba_I"
      ],
      "p": [
        "m_NH4_I",
        "m_Ba_SiO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_SiO3",
        "MgCl2"
      ],
      "p": [
        "NH4Cl",
        "m_Mg_SiO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_SiO3",
        "MgSO4"
      ],
      "p": [
        "m_NH4_SO4",
        "m_Mg_SiO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_SiO3",
        "m_Mg_ClO"
      ],
      "p": [
        "m_NH4_ClO",
        "m_Mg_SiO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_SiO3",
        "CH3COO2Mg"
      ],
      "p": [
        "m_NH4_CH3COO",
        "m_Mg_SiO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_SiO3",
        "m_Mg_C2O4"
      ],
      "p": [
        "m_NH4_C2O4",
        "m_Mg_SiO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_SiO3",
        "m_Mg_Br"
      ],
      "p": [
        "m_NH4_Br",
        "m_Mg_SiO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_SiO3",
        "m_Mg_I"
      ],
      "p": [
        "m_NH4_I",
        "m_Mg_SiO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_SiO3",
        "ZnCl2"
      ],
      "p": [
        "NH4Cl",
        "m_Zn_SiO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_SiO3",
        "m_Zn_ClO"
      ],
      "p": [
        "m_NH4_ClO",
        "m_Zn_SiO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_SiO3",
        "m_Zn_CH3COO"
      ],
      "p": [
        "m_NH4_CH3COO",
        "m_Zn_SiO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_SiO3",
        "m_Zn_Br"
      ],
      "p": [
        "m_NH4_Br",
        "m_Zn_SiO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_SiO3",
        "m_Zn_I"
      ],
      "p": [
        "m_NH4_I",
        "m_Zn_SiO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_SiO3",
        "FeCl2"
      ],
      "p": [
        "NH4Cl",
        "m_Fe2_SiO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_SiO3",
        "m_Fe2_C2O4"
      ],
      "p": [
        "m_NH4_C2O4",
        "m_Fe2_SiO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_SiO3",
        "m_Fe2_Br"
      ],
      "p": [
        "m_NH4_Br",
        "m_Fe2_SiO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_SiO3",
        "m_Fe2_I"
      ],
      "p": [
        "m_NH4_I",
        "m_Fe2_SiO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_SiO3",
        "m_Cu_CH3COO"
      ],
      "p": [
        "m_NH4_CH3COO",
        "m_Cu_SiO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_SiO3",
        "m_Cu_Br"
      ],
      "p": [
        "m_NH4_Br",
        "m_Cu_SiO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_SiO3",
        "Ag2SO4"
      ],
      "p": [
        "m_NH4_SO4",
        "m_Ag_SiO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_SiO3",
        "m_Ag_CH3COO"
      ],
      "p": [
        "m_NH4_CH3COO",
        "m_Ag_SiO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_Br",
        "Ag2SO4"
      ],
      "p": [
        "m_NH4_SO4",
        "AgBr"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_Br",
        "m_Ag_CH3COO"
      ],
      "p": [
        "m_NH4_CH3COO",
        "AgBr"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_I",
        "Ag2SO4"
      ],
      "p": [
        "m_NH4_SO4",
        "AgI"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_NH4_I",
        "m_Ag_CH3COO"
      ],
      "p": [
        "m_NH4_CH3COO",
        "AgI"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2SO4",
        "m_Ba_S"
      ],
      "p": [
        "Na2S",
        "BaSO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2SO4",
        "m_Ba_ClO"
      ],
      "p": [
        "NaClO",
        "BaSO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2SO4",
        "m_Ba_CH3COO"
      ],
      "p": [
        "CH3COONa",
        "BaSO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2SO4",
        "m_Ba_MnO4"
      ],
      "p": [
        "m_Na_MnO4",
        "BaSO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2SO4",
        "m_Ba_AlO2"
      ],
      "p": [
        "NaAlO2",
        "BaSO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2SO4",
        "m_Ba_Br"
      ],
      "p": [
        "NaBr",
        "BaSO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2SO4",
        "m_Ba_I"
      ],
      "p": [
        "NaI",
        "BaSO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "NaF",
        "m_Ba_S"
      ],
      "p": [
        "Na2S",
        "m_Ba_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "NaF",
        "m_Ba_ClO"
      ],
      "p": [
        "NaClO",
        "m_Ba_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "NaF",
        "m_Ba_CH3COO"
      ],
      "p": [
        "CH3COONa",
        "m_Ba_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "NaF",
        "m_Ba_MnO4"
      ],
      "p": [
        "m_Na_MnO4",
        "m_Ba_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "NaF",
        "m_Ba_AlO2"
      ],
      "p": [
        "NaAlO2",
        "m_Ba_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "NaF",
        "m_Ba_Br"
      ],
      "p": [
        "NaBr",
        "m_Ba_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "NaF",
        "m_Ba_I"
      ],
      "p": [
        "NaI",
        "m_Ba_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "NaF",
        "MgSO4"
      ],
      "p": [
        "Na2SO4",
        "m_Mg_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "NaF",
        "m_Mg_ClO"
      ],
      "p": [
        "NaClO",
        "m_Mg_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "NaF",
        "CH3COO2Mg"
      ],
      "p": [
        "CH3COONa",
        "m_Mg_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "NaF",
        "m_Mg_MnO4"
      ],
      "p": [
        "m_Na_MnO4",
        "m_Mg_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "NaF",
        "m_Mg_AlO2"
      ],
      "p": [
        "NaAlO2",
        "m_Mg_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "NaF",
        "m_Mg_Br"
      ],
      "p": [
        "NaBr",
        "m_Mg_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "NaF",
        "m_Mg_I"
      ],
      "p": [
        "NaI",
        "m_Mg_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "NaF",
        "Al2SO43"
      ],
      "p": [
        "Na2SO4",
        "m_Al_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "NaF",
        "AlNO33"
      ],
      "p": [
        "NaNO3",
        "m_Al_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "NaF",
        "m_Al_CH3COO"
      ],
      "p": [
        "CH3COONa",
        "m_Al_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "NaF",
        "m_Al_Br"
      ],
      "p": [
        "NaBr",
        "m_Al_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "NaF",
        "m_Al_I"
      ],
      "p": [
        "NaI",
        "m_Al_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "NaF",
        "ZnNO32"
      ],
      "p": [
        "NaNO3",
        "m_Zn_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "NaF",
        "m_Zn_ClO"
      ],
      "p": [
        "NaClO",
        "m_Zn_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "NaF",
        "m_Zn_CH3COO"
      ],
      "p": [
        "CH3COONa",
        "m_Zn_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "NaF",
        "m_Zn_MnO4"
      ],
      "p": [
        "m_Na_MnO4",
        "m_Zn_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "NaF",
        "m_Zn_AlO2"
      ],
      "p": [
        "NaAlO2",
        "m_Zn_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "NaF",
        "m_Zn_Br"
      ],
      "p": [
        "NaBr",
        "m_Zn_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "NaF",
        "m_Zn_I"
      ],
      "p": [
        "NaI",
        "m_Zn_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "NaF",
        "FeNO32"
      ],
      "p": [
        "NaNO3",
        "m_Fe2_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "NaF",
        "m_Fe2_MnO4"
      ],
      "p": [
        "m_Na_MnO4",
        "m_Fe2_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "NaF",
        "m_Fe2_AlO2"
      ],
      "p": [
        "NaAlO2",
        "m_Fe2_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "NaF",
        "m_Fe2_Br"
      ],
      "p": [
        "NaBr",
        "m_Fe2_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "NaF",
        "m_Fe2_I"
      ],
      "p": [
        "NaI",
        "m_Fe2_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "NaF",
        "Fe2SO43"
      ],
      "p": [
        "Na2SO4",
        "m_Fe3_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "NaF",
        "FeNO33"
      ],
      "p": [
        "NaNO3",
        "m_Fe3_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "NaF",
        "m_Fe3_CH3COO"
      ],
      "p": [
        "CH3COONa",
        "m_Fe3_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "NaF",
        "m_Fe3_MnO4"
      ],
      "p": [
        "m_Na_MnO4",
        "m_Fe3_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "NaF",
        "m_Fe3_AlO2"
      ],
      "p": [
        "NaAlO2",
        "m_Fe3_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "NaF",
        "m_Fe3_Br"
      ],
      "p": [
        "NaBr",
        "m_Fe3_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "NaF",
        "m_Cu_CH3COO"
      ],
      "p": [
        "CH3COONa",
        "m_Cu_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "NaF",
        "m_Cu_MnO4"
      ],
      "p": [
        "m_Na_MnO4",
        "m_Cu_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "NaF",
        "m_Cu_AlO2"
      ],
      "p": [
        "NaAlO2",
        "m_Cu_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "NaF",
        "m_Cu_Br"
      ],
      "p": [
        "NaBr",
        "m_Cu_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2S",
        "MgSO4"
      ],
      "p": [
        "Na2SO4",
        "m_Mg_S"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2S",
        "m_Mg_ClO"
      ],
      "p": [
        "NaClO",
        "m_Mg_S"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2S",
        "CH3COO2Mg"
      ],
      "p": [
        "CH3COONa",
        "m_Mg_S"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2S",
        "m_Mg_MnO4"
      ],
      "p": [
        "m_Na_MnO4",
        "m_Mg_S"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2S",
        "m_Mg_AlO2"
      ],
      "p": [
        "NaAlO2",
        "m_Mg_S"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2S",
        "m_Mg_Br"
      ],
      "p": [
        "NaBr",
        "m_Mg_S"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2S",
        "m_Mg_I"
      ],
      "p": [
        "NaI",
        "m_Mg_S"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2S",
        "ZnNO32"
      ],
      "p": [
        "NaNO3",
        "m_Zn_S"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2S",
        "m_Zn_ClO"
      ],
      "p": [
        "NaClO",
        "m_Zn_S"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2S",
        "m_Zn_CH3COO"
      ],
      "p": [
        "CH3COONa",
        "m_Zn_S"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2S",
        "m_Zn_MnO4"
      ],
      "p": [
        "m_Na_MnO4",
        "m_Zn_S"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2S",
        "m_Zn_AlO2"
      ],
      "p": [
        "NaAlO2",
        "m_Zn_S"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2S",
        "m_Zn_Br"
      ],
      "p": [
        "NaBr",
        "m_Zn_S"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2S",
        "m_Zn_I"
      ],
      "p": [
        "NaI",
        "m_Zn_S"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2S",
        "FeNO32"
      ],
      "p": [
        "NaNO3",
        "FeS"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2S",
        "m_Fe2_MnO4"
      ],
      "p": [
        "m_Na_MnO4",
        "FeS"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2S",
        "m_Fe2_AlO2"
      ],
      "p": [
        "NaAlO2",
        "FeS"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2S",
        "m_Fe2_Br"
      ],
      "p": [
        "NaBr",
        "FeS"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2S",
        "m_Fe2_I"
      ],
      "p": [
        "NaI",
        "FeS"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2S",
        "m_Cu_CH3COO"
      ],
      "p": [
        "CH3COONa",
        "CuS"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2S",
        "m_Cu_MnO4"
      ],
      "p": [
        "m_Na_MnO4",
        "CuS"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2S",
        "m_Cu_AlO2"
      ],
      "p": [
        "NaAlO2",
        "CuS"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2S",
        "m_Cu_Br"
      ],
      "p": [
        "NaBr",
        "CuS"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2SO3",
        "m_Ba_S"
      ],
      "p": [
        "Na2S",
        "BaSO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2SO3",
        "m_Ba_ClO"
      ],
      "p": [
        "NaClO",
        "BaSO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2SO3",
        "m_Ba_CH3COO"
      ],
      "p": [
        "CH3COONa",
        "BaSO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2SO3",
        "m_Ba_MnO4"
      ],
      "p": [
        "m_Na_MnO4",
        "BaSO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2SO3",
        "m_Ba_AlO2"
      ],
      "p": [
        "NaAlO2",
        "BaSO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2SO3",
        "m_Ba_Br"
      ],
      "p": [
        "NaBr",
        "BaSO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2SO3",
        "m_Ba_I"
      ],
      "p": [
        "NaI",
        "BaSO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2SO3",
        "CaSO4"
      ],
      "p": [
        "Na2SO4",
        "m_Ca_SO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2SO3",
        "CaNO32"
      ],
      "p": [
        "NaNO3",
        "m_Ca_SO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2SO3",
        "CH3COO2Ca"
      ],
      "p": [
        "CH3COONa",
        "m_Ca_SO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2SO3",
        "m_Ca_MnO4"
      ],
      "p": [
        "m_Na_MnO4",
        "m_Ca_SO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2SO3",
        "m_Ca_AlO2"
      ],
      "p": [
        "NaAlO2",
        "m_Ca_SO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2SO3",
        "m_Ca_Br"
      ],
      "p": [
        "NaBr",
        "m_Ca_SO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2SO3",
        "m_Ca_I"
      ],
      "p": [
        "NaI",
        "m_Ca_SO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2SO3",
        "MgSO4"
      ],
      "p": [
        "Na2SO4",
        "m_Mg_SO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2SO3",
        "m_Mg_ClO"
      ],
      "p": [
        "NaClO",
        "m_Mg_SO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2SO3",
        "CH3COO2Mg"
      ],
      "p": [
        "CH3COONa",
        "m_Mg_SO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2SO3",
        "m_Mg_MnO4"
      ],
      "p": [
        "m_Na_MnO4",
        "m_Mg_SO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2SO3",
        "m_Mg_AlO2"
      ],
      "p": [
        "NaAlO2",
        "m_Mg_SO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2SO3",
        "m_Mg_Br"
      ],
      "p": [
        "NaBr",
        "m_Mg_SO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2SO3",
        "m_Mg_I"
      ],
      "p": [
        "NaI",
        "m_Mg_SO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2SO3",
        "ZnNO32"
      ],
      "p": [
        "NaNO3",
        "m_Zn_SO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2SO3",
        "m_Zn_ClO"
      ],
      "p": [
        "NaClO",
        "m_Zn_SO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2SO3",
        "m_Zn_CH3COO"
      ],
      "p": [
        "CH3COONa",
        "m_Zn_SO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2SO3",
        "m_Zn_MnO4"
      ],
      "p": [
        "m_Na_MnO4",
        "m_Zn_SO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2SO3",
        "m_Zn_AlO2"
      ],
      "p": [
        "NaAlO2",
        "m_Zn_SO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2SO3",
        "m_Zn_Br"
      ],
      "p": [
        "NaBr",
        "m_Zn_SO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2SO3",
        "m_Zn_I"
      ],
      "p": [
        "NaI",
        "m_Zn_SO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2SO3",
        "Ag2SO4"
      ],
      "p": [
        "Na2SO4",
        "m_Ag_SO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2SO3",
        "m_Ag_CH3COO"
      ],
      "p": [
        "CH3COONa",
        "m_Ag_SO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2SO3",
        "m_Ag_MnO4"
      ],
      "p": [
        "m_Na_MnO4",
        "m_Ag_SO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2SO3",
        "m_Ag_AlO2"
      ],
      "p": [
        "NaAlO2",
        "m_Ag_SO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na3PO4",
        "m_Ba_S"
      ],
      "p": [
        "Na2S",
        "Ba3PO42"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na3PO4",
        "m_Ba_ClO"
      ],
      "p": [
        "NaClO",
        "Ba3PO42"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na3PO4",
        "m_Ba_CH3COO"
      ],
      "p": [
        "CH3COONa",
        "Ba3PO42"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na3PO4",
        "m_Ba_MnO4"
      ],
      "p": [
        "m_Na_MnO4",
        "Ba3PO42"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na3PO4",
        "m_Ba_AlO2"
      ],
      "p": [
        "NaAlO2",
        "Ba3PO42"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na3PO4",
        "m_Ba_Br"
      ],
      "p": [
        "NaBr",
        "Ba3PO42"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na3PO4",
        "m_Ba_I"
      ],
      "p": [
        "NaI",
        "Ba3PO42"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na3PO4",
        "CaSO4"
      ],
      "p": [
        "Na2SO4",
        "Ca3PO42"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na3PO4",
        "CaNO32"
      ],
      "p": [
        "NaNO3",
        "Ca3PO42"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na3PO4",
        "CH3COO2Ca"
      ],
      "p": [
        "CH3COONa",
        "Ca3PO42"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na3PO4",
        "m_Ca_MnO4"
      ],
      "p": [
        "m_Na_MnO4",
        "Ca3PO42"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na3PO4",
        "m_Ca_AlO2"
      ],
      "p": [
        "NaAlO2",
        "Ca3PO42"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na3PO4",
        "m_Ca_Br"
      ],
      "p": [
        "NaBr",
        "Ca3PO42"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na3PO4",
        "m_Ca_I"
      ],
      "p": [
        "NaI",
        "Ca3PO42"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na3PO4",
        "MgSO4"
      ],
      "p": [
        "Na2SO4",
        "m_Mg_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na3PO4",
        "m_Mg_ClO"
      ],
      "p": [
        "NaClO",
        "m_Mg_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na3PO4",
        "CH3COO2Mg"
      ],
      "p": [
        "CH3COONa",
        "m_Mg_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na3PO4",
        "m_Mg_MnO4"
      ],
      "p": [
        "m_Na_MnO4",
        "m_Mg_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na3PO4",
        "m_Mg_AlO2"
      ],
      "p": [
        "NaAlO2",
        "m_Mg_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na3PO4",
        "m_Mg_Br"
      ],
      "p": [
        "NaBr",
        "m_Mg_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na3PO4",
        "m_Mg_I"
      ],
      "p": [
        "NaI",
        "m_Mg_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na3PO4",
        "Al2SO43"
      ],
      "p": [
        "Na2SO4",
        "m_Al_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na3PO4",
        "AlNO33"
      ],
      "p": [
        "NaNO3",
        "m_Al_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na3PO4",
        "m_Al_CH3COO"
      ],
      "p": [
        "CH3COONa",
        "m_Al_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na3PO4",
        "m_Al_Br"
      ],
      "p": [
        "NaBr",
        "m_Al_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na3PO4",
        "m_Al_I"
      ],
      "p": [
        "NaI",
        "m_Al_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na3PO4",
        "ZnNO32"
      ],
      "p": [
        "NaNO3",
        "m_Zn_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na3PO4",
        "m_Zn_ClO"
      ],
      "p": [
        "NaClO",
        "m_Zn_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na3PO4",
        "m_Zn_CH3COO"
      ],
      "p": [
        "CH3COONa",
        "m_Zn_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na3PO4",
        "m_Zn_MnO4"
      ],
      "p": [
        "m_Na_MnO4",
        "m_Zn_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na3PO4",
        "m_Zn_AlO2"
      ],
      "p": [
        "NaAlO2",
        "m_Zn_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na3PO4",
        "m_Zn_Br"
      ],
      "p": [
        "NaBr",
        "m_Zn_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na3PO4",
        "m_Zn_I"
      ],
      "p": [
        "NaI",
        "m_Zn_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na3PO4",
        "FeNO32"
      ],
      "p": [
        "NaNO3",
        "m_Fe2_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na3PO4",
        "m_Fe2_MnO4"
      ],
      "p": [
        "m_Na_MnO4",
        "m_Fe2_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na3PO4",
        "m_Fe2_AlO2"
      ],
      "p": [
        "NaAlO2",
        "m_Fe2_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na3PO4",
        "m_Fe2_Br"
      ],
      "p": [
        "NaBr",
        "m_Fe2_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na3PO4",
        "m_Fe2_I"
      ],
      "p": [
        "NaI",
        "m_Fe2_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na3PO4",
        "Fe2SO43"
      ],
      "p": [
        "Na2SO4",
        "m_Fe3_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na3PO4",
        "FeNO33"
      ],
      "p": [
        "NaNO3",
        "m_Fe3_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na3PO4",
        "m_Fe3_CH3COO"
      ],
      "p": [
        "CH3COONa",
        "m_Fe3_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na3PO4",
        "m_Fe3_MnO4"
      ],
      "p": [
        "m_Na_MnO4",
        "m_Fe3_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na3PO4",
        "m_Fe3_AlO2"
      ],
      "p": [
        "NaAlO2",
        "m_Fe3_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na3PO4",
        "m_Fe3_Br"
      ],
      "p": [
        "NaBr",
        "m_Fe3_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na3PO4",
        "m_Cu_CH3COO"
      ],
      "p": [
        "CH3COONa",
        "m_Cu_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na3PO4",
        "m_Cu_MnO4"
      ],
      "p": [
        "m_Na_MnO4",
        "m_Cu_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na3PO4",
        "m_Cu_AlO2"
      ],
      "p": [
        "NaAlO2",
        "m_Cu_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na3PO4",
        "m_Cu_Br"
      ],
      "p": [
        "NaBr",
        "m_Cu_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2SiO3",
        "m_Ba_S"
      ],
      "p": [
        "Na2S",
        "m_Ba_SiO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2SiO3",
        "m_Ba_ClO"
      ],
      "p": [
        "NaClO",
        "m_Ba_SiO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2SiO3",
        "m_Ba_CH3COO"
      ],
      "p": [
        "CH3COONa",
        "m_Ba_SiO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2SiO3",
        "m_Ba_MnO4"
      ],
      "p": [
        "m_Na_MnO4",
        "m_Ba_SiO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2SiO3",
        "m_Ba_AlO2"
      ],
      "p": [
        "NaAlO2",
        "m_Ba_SiO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2SiO3",
        "m_Ba_Br"
      ],
      "p": [
        "NaBr",
        "m_Ba_SiO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2SiO3",
        "m_Ba_I"
      ],
      "p": [
        "NaI",
        "m_Ba_SiO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2SiO3",
        "MgSO4"
      ],
      "p": [
        "Na2SO4",
        "m_Mg_SiO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2SiO3",
        "m_Mg_ClO"
      ],
      "p": [
        "NaClO",
        "m_Mg_SiO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2SiO3",
        "CH3COO2Mg"
      ],
      "p": [
        "CH3COONa",
        "m_Mg_SiO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2SiO3",
        "m_Mg_MnO4"
      ],
      "p": [
        "m_Na_MnO4",
        "m_Mg_SiO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2SiO3",
        "m_Mg_AlO2"
      ],
      "p": [
        "NaAlO2",
        "m_Mg_SiO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2SiO3",
        "m_Mg_Br"
      ],
      "p": [
        "NaBr",
        "m_Mg_SiO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2SiO3",
        "m_Mg_I"
      ],
      "p": [
        "NaI",
        "m_Mg_SiO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2SiO3",
        "ZnNO32"
      ],
      "p": [
        "NaNO3",
        "m_Zn_SiO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2SiO3",
        "m_Zn_ClO"
      ],
      "p": [
        "NaClO",
        "m_Zn_SiO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2SiO3",
        "m_Zn_CH3COO"
      ],
      "p": [
        "CH3COONa",
        "m_Zn_SiO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2SiO3",
        "m_Zn_MnO4"
      ],
      "p": [
        "m_Na_MnO4",
        "m_Zn_SiO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2SiO3",
        "m_Zn_AlO2"
      ],
      "p": [
        "NaAlO2",
        "m_Zn_SiO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2SiO3",
        "m_Zn_Br"
      ],
      "p": [
        "NaBr",
        "m_Zn_SiO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2SiO3",
        "m_Zn_I"
      ],
      "p": [
        "NaI",
        "m_Zn_SiO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2SiO3",
        "FeNO32"
      ],
      "p": [
        "NaNO3",
        "m_Fe2_SiO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2SiO3",
        "m_Fe2_MnO4"
      ],
      "p": [
        "m_Na_MnO4",
        "m_Fe2_SiO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2SiO3",
        "m_Fe2_AlO2"
      ],
      "p": [
        "NaAlO2",
        "m_Fe2_SiO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2SiO3",
        "m_Fe2_Br"
      ],
      "p": [
        "NaBr",
        "m_Fe2_SiO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2SiO3",
        "m_Fe2_I"
      ],
      "p": [
        "NaI",
        "m_Fe2_SiO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2SiO3",
        "m_Cu_CH3COO"
      ],
      "p": [
        "CH3COONa",
        "m_Cu_SiO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2SiO3",
        "m_Cu_MnO4"
      ],
      "p": [
        "m_Na_MnO4",
        "m_Cu_SiO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2SiO3",
        "m_Cu_AlO2"
      ],
      "p": [
        "NaAlO2",
        "m_Cu_SiO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2SiO3",
        "m_Cu_Br"
      ],
      "p": [
        "NaBr",
        "m_Cu_SiO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2SiO3",
        "Ag2SO4"
      ],
      "p": [
        "Na2SO4",
        "m_Ag_SiO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2SiO3",
        "m_Ag_CH3COO"
      ],
      "p": [
        "CH3COONa",
        "m_Ag_SiO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2SiO3",
        "m_Ag_MnO4"
      ],
      "p": [
        "m_Na_MnO4",
        "m_Ag_SiO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Na2SiO3",
        "m_Ag_AlO2"
      ],
      "p": [
        "NaAlO2",
        "m_Ag_SiO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "NaBr",
        "Ag2SO4"
      ],
      "p": [
        "Na2SO4",
        "AgBr"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "NaBr",
        "m_Ag_CH3COO"
      ],
      "p": [
        "CH3COONa",
        "AgBr"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "NaBr",
        "m_Ag_MnO4"
      ],
      "p": [
        "m_Na_MnO4",
        "AgBr"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "NaBr",
        "m_Ag_AlO2"
      ],
      "p": [
        "NaAlO2",
        "AgBr"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "NaI",
        "Ag2SO4"
      ],
      "p": [
        "Na2SO4",
        "AgI"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "NaI",
        "m_Ag_CH3COO"
      ],
      "p": [
        "CH3COONa",
        "AgI"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "NaI",
        "m_Ag_MnO4"
      ],
      "p": [
        "m_Na_MnO4",
        "AgI"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "NaI",
        "m_Ag_AlO2"
      ],
      "p": [
        "NaAlO2",
        "AgI"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "KCl",
        "Ag2SO4"
      ],
      "p": [
        "K2SO4",
        "AgCl"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "KCl",
        "m_Ag_CH3COO"
      ],
      "p": [
        "CH3COOK",
        "AgCl"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "KCl",
        "m_Ag_MnO4"
      ],
      "p": [
        "KMnO4",
        "AgCl"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "KCl",
        "m_Ag_AlO2"
      ],
      "p": [
        "m_K_AlO2",
        "AgCl"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "K2SO4",
        "BaHCO32"
      ],
      "p": [
        "m_K_HCO3",
        "BaSO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "K2SO4",
        "m_Ba_S"
      ],
      "p": [
        "m_K_S",
        "BaSO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "K2SO4",
        "m_Ba_ClO"
      ],
      "p": [
        "m_K_ClO",
        "BaSO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "K2SO4",
        "m_Ba_CH3COO"
      ],
      "p": [
        "CH3COOK",
        "BaSO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "K2SO4",
        "m_Ba_MnO4"
      ],
      "p": [
        "KMnO4",
        "BaSO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "K2SO4",
        "m_Ba_AlO2"
      ],
      "p": [
        "m_K_AlO2",
        "BaSO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "K2SO4",
        "m_Ba_Br"
      ],
      "p": [
        "m_K_Br",
        "BaSO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "K2SO4",
        "m_Ba_I"
      ],
      "p": [
        "m_K_I",
        "BaSO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "K2CO3",
        "BaHCO32"
      ],
      "p": [
        "m_K_HCO3",
        "BaCO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "K2CO3",
        "m_Ba_S"
      ],
      "p": [
        "m_K_S",
        "BaCO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "K2CO3",
        "m_Ba_ClO"
      ],
      "p": [
        "m_K_ClO",
        "BaCO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "K2CO3",
        "m_Ba_CH3COO"
      ],
      "p": [
        "CH3COOK",
        "BaCO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "K2CO3",
        "m_Ba_MnO4"
      ],
      "p": [
        "KMnO4",
        "BaCO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "K2CO3",
        "m_Ba_AlO2"
      ],
      "p": [
        "m_K_AlO2",
        "BaCO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "K2CO3",
        "m_Ba_Br"
      ],
      "p": [
        "m_K_Br",
        "BaCO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "K2CO3",
        "m_Ba_I"
      ],
      "p": [
        "m_K_I",
        "BaCO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "K2CO3",
        "MgCl2"
      ],
      "p": [
        "KCl",
        "MgCO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "K2CO3",
        "MgSO4"
      ],
      "p": [
        "K2SO4",
        "MgCO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "K2CO3",
        "MgHCO32"
      ],
      "p": [
        "m_K_HCO3",
        "MgCO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "K2CO3",
        "m_Mg_ClO"
      ],
      "p": [
        "m_K_ClO",
        "MgCO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "K2CO3",
        "CH3COO2Mg"
      ],
      "p": [
        "CH3COOK",
        "MgCO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "K2CO3",
        "m_Mg_MnO4"
      ],
      "p": [
        "KMnO4",
        "MgCO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "K2CO3",
        "m_Mg_AlO2"
      ],
      "p": [
        "m_K_AlO2",
        "MgCO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "K2CO3",
        "m_Mg_Br"
      ],
      "p": [
        "m_K_Br",
        "MgCO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "K2CO3",
        "m_Mg_I"
      ],
      "p": [
        "m_K_I",
        "MgCO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "K2CO3",
        "ZnCl2"
      ],
      "p": [
        "KCl",
        "ZnCO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "K2CO3",
        "ZnNO32"
      ],
      "p": [
        "KNO3",
        "ZnCO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "K2CO3",
        "m_Zn_ClO"
      ],
      "p": [
        "m_K_ClO",
        "ZnCO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "K2CO3",
        "m_Zn_CH3COO"
      ],
      "p": [
        "CH3COOK",
        "ZnCO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "K2CO3",
        "m_Zn_MnO4"
      ],
      "p": [
        "KMnO4",
        "ZnCO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "K2CO3",
        "m_Zn_AlO2"
      ],
      "p": [
        "m_K_AlO2",
        "ZnCO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "K2CO3",
        "m_Zn_Br"
      ],
      "p": [
        "m_K_Br",
        "ZnCO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "K2CO3",
        "m_Zn_I"
      ],
      "p": [
        "m_K_I",
        "ZnCO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "K2CO3",
        "Ag2SO4"
      ],
      "p": [
        "K2SO4",
        "Ag2CO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "K2CO3",
        "m_Ag_CH3COO"
      ],
      "p": [
        "CH3COOK",
        "Ag2CO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "K2CO3",
        "m_Ag_MnO4"
      ],
      "p": [
        "KMnO4",
        "Ag2CO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "K2CO3",
        "m_Ag_AlO2"
      ],
      "p": [
        "m_K_AlO2",
        "Ag2CO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_F",
        "BaHCO32"
      ],
      "p": [
        "m_K_HCO3",
        "m_Ba_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_F",
        "m_Ba_S"
      ],
      "p": [
        "m_K_S",
        "m_Ba_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_F",
        "m_Ba_ClO"
      ],
      "p": [
        "m_K_ClO",
        "m_Ba_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_F",
        "m_Ba_CH3COO"
      ],
      "p": [
        "CH3COOK",
        "m_Ba_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_F",
        "m_Ba_MnO4"
      ],
      "p": [
        "KMnO4",
        "m_Ba_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_F",
        "m_Ba_AlO2"
      ],
      "p": [
        "m_K_AlO2",
        "m_Ba_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_F",
        "m_Ba_Br"
      ],
      "p": [
        "m_K_Br",
        "m_Ba_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_F",
        "m_Ba_I"
      ],
      "p": [
        "m_K_I",
        "m_Ba_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_F",
        "MgCl2"
      ],
      "p": [
        "KCl",
        "m_Mg_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_F",
        "MgSO4"
      ],
      "p": [
        "K2SO4",
        "m_Mg_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_F",
        "MgHCO32"
      ],
      "p": [
        "m_K_HCO3",
        "m_Mg_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_F",
        "m_Mg_ClO"
      ],
      "p": [
        "m_K_ClO",
        "m_Mg_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_F",
        "CH3COO2Mg"
      ],
      "p": [
        "CH3COOK",
        "m_Mg_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_F",
        "m_Mg_MnO4"
      ],
      "p": [
        "KMnO4",
        "m_Mg_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_F",
        "m_Mg_AlO2"
      ],
      "p": [
        "m_K_AlO2",
        "m_Mg_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_F",
        "m_Mg_Br"
      ],
      "p": [
        "m_K_Br",
        "m_Mg_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_F",
        "m_Mg_I"
      ],
      "p": [
        "m_K_I",
        "m_Mg_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_F",
        "AlCl3"
      ],
      "p": [
        "KCl",
        "m_Al_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_F",
        "Al2SO43"
      ],
      "p": [
        "K2SO4",
        "m_Al_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_F",
        "AlNO33"
      ],
      "p": [
        "KNO3",
        "m_Al_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_F",
        "m_Al_CH3COO"
      ],
      "p": [
        "CH3COOK",
        "m_Al_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_F",
        "m_Al_Br"
      ],
      "p": [
        "m_K_Br",
        "m_Al_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_F",
        "m_Al_I"
      ],
      "p": [
        "m_K_I",
        "m_Al_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_F",
        "ZnCl2"
      ],
      "p": [
        "KCl",
        "m_Zn_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_F",
        "ZnNO32"
      ],
      "p": [
        "KNO3",
        "m_Zn_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_F",
        "m_Zn_ClO"
      ],
      "p": [
        "m_K_ClO",
        "m_Zn_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_F",
        "m_Zn_CH3COO"
      ],
      "p": [
        "CH3COOK",
        "m_Zn_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_F",
        "m_Zn_MnO4"
      ],
      "p": [
        "KMnO4",
        "m_Zn_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_F",
        "m_Zn_AlO2"
      ],
      "p": [
        "m_K_AlO2",
        "m_Zn_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_F",
        "m_Zn_Br"
      ],
      "p": [
        "m_K_Br",
        "m_Zn_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_F",
        "m_Zn_I"
      ],
      "p": [
        "m_K_I",
        "m_Zn_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_F",
        "FeCl2"
      ],
      "p": [
        "KCl",
        "m_Fe2_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_F",
        "FeNO32"
      ],
      "p": [
        "KNO3",
        "m_Fe2_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_F",
        "m_Fe2_MnO4"
      ],
      "p": [
        "KMnO4",
        "m_Fe2_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_F",
        "m_Fe2_AlO2"
      ],
      "p": [
        "m_K_AlO2",
        "m_Fe2_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_F",
        "m_Fe2_Br"
      ],
      "p": [
        "m_K_Br",
        "m_Fe2_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_F",
        "m_Fe2_I"
      ],
      "p": [
        "m_K_I",
        "m_Fe2_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_F",
        "Fe2SO43"
      ],
      "p": [
        "K2SO4",
        "m_Fe3_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_F",
        "FeNO33"
      ],
      "p": [
        "KNO3",
        "m_Fe3_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_F",
        "m_Fe3_CH3COO"
      ],
      "p": [
        "CH3COOK",
        "m_Fe3_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_F",
        "m_Fe3_MnO4"
      ],
      "p": [
        "KMnO4",
        "m_Fe3_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_F",
        "m_Fe3_AlO2"
      ],
      "p": [
        "m_K_AlO2",
        "m_Fe3_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_F",
        "m_Fe3_Br"
      ],
      "p": [
        "m_K_Br",
        "m_Fe3_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_F",
        "m_Cu_CH3COO"
      ],
      "p": [
        "CH3COOK",
        "m_Cu_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_F",
        "m_Cu_MnO4"
      ],
      "p": [
        "KMnO4",
        "m_Cu_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_F",
        "m_Cu_AlO2"
      ],
      "p": [
        "m_K_AlO2",
        "m_Cu_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_F",
        "m_Cu_Br"
      ],
      "p": [
        "m_K_Br",
        "m_Cu_F"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_S",
        "MgCl2"
      ],
      "p": [
        "KCl",
        "m_Mg_S"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_S",
        "MgSO4"
      ],
      "p": [
        "K2SO4",
        "m_Mg_S"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_S",
        "MgHCO32"
      ],
      "p": [
        "m_K_HCO3",
        "m_Mg_S"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_S",
        "m_Mg_ClO"
      ],
      "p": [
        "m_K_ClO",
        "m_Mg_S"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_S",
        "CH3COO2Mg"
      ],
      "p": [
        "CH3COOK",
        "m_Mg_S"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_S",
        "m_Mg_MnO4"
      ],
      "p": [
        "KMnO4",
        "m_Mg_S"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_S",
        "m_Mg_AlO2"
      ],
      "p": [
        "m_K_AlO2",
        "m_Mg_S"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_S",
        "m_Mg_Br"
      ],
      "p": [
        "m_K_Br",
        "m_Mg_S"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_S",
        "m_Mg_I"
      ],
      "p": [
        "m_K_I",
        "m_Mg_S"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_S",
        "ZnCl2"
      ],
      "p": [
        "KCl",
        "m_Zn_S"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_S",
        "ZnNO32"
      ],
      "p": [
        "KNO3",
        "m_Zn_S"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_S",
        "m_Zn_ClO"
      ],
      "p": [
        "m_K_ClO",
        "m_Zn_S"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_S",
        "m_Zn_CH3COO"
      ],
      "p": [
        "CH3COOK",
        "m_Zn_S"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_S",
        "m_Zn_MnO4"
      ],
      "p": [
        "KMnO4",
        "m_Zn_S"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_S",
        "m_Zn_AlO2"
      ],
      "p": [
        "m_K_AlO2",
        "m_Zn_S"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_S",
        "m_Zn_Br"
      ],
      "p": [
        "m_K_Br",
        "m_Zn_S"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_S",
        "m_Zn_I"
      ],
      "p": [
        "m_K_I",
        "m_Zn_S"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_S",
        "FeCl2"
      ],
      "p": [
        "KCl",
        "FeS"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_S",
        "FeNO32"
      ],
      "p": [
        "KNO3",
        "FeS"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_S",
        "m_Fe2_MnO4"
      ],
      "p": [
        "KMnO4",
        "FeS"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_S",
        "m_Fe2_AlO2"
      ],
      "p": [
        "m_K_AlO2",
        "FeS"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_S",
        "m_Fe2_Br"
      ],
      "p": [
        "m_K_Br",
        "FeS"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_S",
        "m_Fe2_I"
      ],
      "p": [
        "m_K_I",
        "FeS"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_S",
        "m_Cu_CH3COO"
      ],
      "p": [
        "CH3COOK",
        "CuS"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_S",
        "m_Cu_MnO4"
      ],
      "p": [
        "KMnO4",
        "CuS"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_S",
        "m_Cu_AlO2"
      ],
      "p": [
        "m_K_AlO2",
        "CuS"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_S",
        "m_Cu_Br"
      ],
      "p": [
        "m_K_Br",
        "CuS"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_SO3",
        "BaHCO32"
      ],
      "p": [
        "m_K_HCO3",
        "BaSO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_SO3",
        "m_Ba_S"
      ],
      "p": [
        "m_K_S",
        "BaSO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_SO3",
        "m_Ba_ClO"
      ],
      "p": [
        "m_K_ClO",
        "BaSO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_SO3",
        "m_Ba_CH3COO"
      ],
      "p": [
        "CH3COOK",
        "BaSO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_SO3",
        "m_Ba_MnO4"
      ],
      "p": [
        "KMnO4",
        "BaSO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_SO3",
        "m_Ba_AlO2"
      ],
      "p": [
        "m_K_AlO2",
        "BaSO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_SO3",
        "m_Ba_Br"
      ],
      "p": [
        "m_K_Br",
        "BaSO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_SO3",
        "m_Ba_I"
      ],
      "p": [
        "m_K_I",
        "BaSO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_SO3",
        "CaSO4"
      ],
      "p": [
        "K2SO4",
        "m_Ca_SO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_SO3",
        "CaNO32"
      ],
      "p": [
        "KNO3",
        "m_Ca_SO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_SO3",
        "CaHCO32"
      ],
      "p": [
        "m_K_HCO3",
        "m_Ca_SO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_SO3",
        "CH3COO2Ca"
      ],
      "p": [
        "CH3COOK",
        "m_Ca_SO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_SO3",
        "m_Ca_MnO4"
      ],
      "p": [
        "KMnO4",
        "m_Ca_SO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_SO3",
        "m_Ca_AlO2"
      ],
      "p": [
        "m_K_AlO2",
        "m_Ca_SO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_SO3",
        "m_Ca_Br"
      ],
      "p": [
        "m_K_Br",
        "m_Ca_SO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_SO3",
        "m_Ca_I"
      ],
      "p": [
        "m_K_I",
        "m_Ca_SO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_SO3",
        "MgCl2"
      ],
      "p": [
        "KCl",
        "m_Mg_SO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_SO3",
        "MgSO4"
      ],
      "p": [
        "K2SO4",
        "m_Mg_SO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_SO3",
        "MgHCO32"
      ],
      "p": [
        "m_K_HCO3",
        "m_Mg_SO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_SO3",
        "m_Mg_ClO"
      ],
      "p": [
        "m_K_ClO",
        "m_Mg_SO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_SO3",
        "CH3COO2Mg"
      ],
      "p": [
        "CH3COOK",
        "m_Mg_SO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_SO3",
        "m_Mg_MnO4"
      ],
      "p": [
        "KMnO4",
        "m_Mg_SO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_SO3",
        "m_Mg_AlO2"
      ],
      "p": [
        "m_K_AlO2",
        "m_Mg_SO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_SO3",
        "m_Mg_Br"
      ],
      "p": [
        "m_K_Br",
        "m_Mg_SO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_SO3",
        "m_Mg_I"
      ],
      "p": [
        "m_K_I",
        "m_Mg_SO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_SO3",
        "ZnCl2"
      ],
      "p": [
        "KCl",
        "m_Zn_SO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_SO3",
        "ZnNO32"
      ],
      "p": [
        "KNO3",
        "m_Zn_SO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_SO3",
        "m_Zn_ClO"
      ],
      "p": [
        "m_K_ClO",
        "m_Zn_SO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_SO3",
        "m_Zn_CH3COO"
      ],
      "p": [
        "CH3COOK",
        "m_Zn_SO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_SO3",
        "m_Zn_MnO4"
      ],
      "p": [
        "KMnO4",
        "m_Zn_SO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_SO3",
        "m_Zn_AlO2"
      ],
      "p": [
        "m_K_AlO2",
        "m_Zn_SO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_SO3",
        "m_Zn_Br"
      ],
      "p": [
        "m_K_Br",
        "m_Zn_SO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_SO3",
        "m_Zn_I"
      ],
      "p": [
        "m_K_I",
        "m_Zn_SO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_SO3",
        "Ag2SO4"
      ],
      "p": [
        "K2SO4",
        "m_Ag_SO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_SO3",
        "m_Ag_CH3COO"
      ],
      "p": [
        "CH3COOK",
        "m_Ag_SO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_SO3",
        "m_Ag_MnO4"
      ],
      "p": [
        "KMnO4",
        "m_Ag_SO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_SO3",
        "m_Ag_AlO2"
      ],
      "p": [
        "m_K_AlO2",
        "m_Ag_SO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_PO4",
        "BaHCO32"
      ],
      "p": [
        "m_K_HCO3",
        "Ba3PO42"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_PO4",
        "m_Ba_S"
      ],
      "p": [
        "m_K_S",
        "Ba3PO42"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_PO4",
        "m_Ba_ClO"
      ],
      "p": [
        "m_K_ClO",
        "Ba3PO42"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_PO4",
        "m_Ba_CH3COO"
      ],
      "p": [
        "CH3COOK",
        "Ba3PO42"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_PO4",
        "m_Ba_MnO4"
      ],
      "p": [
        "KMnO4",
        "Ba3PO42"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_PO4",
        "m_Ba_AlO2"
      ],
      "p": [
        "m_K_AlO2",
        "Ba3PO42"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_PO4",
        "m_Ba_Br"
      ],
      "p": [
        "m_K_Br",
        "Ba3PO42"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_PO4",
        "m_Ba_I"
      ],
      "p": [
        "m_K_I",
        "Ba3PO42"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_PO4",
        "CaSO4"
      ],
      "p": [
        "K2SO4",
        "Ca3PO42"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_PO4",
        "CaNO32"
      ],
      "p": [
        "KNO3",
        "Ca3PO42"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_PO4",
        "CaHCO32"
      ],
      "p": [
        "m_K_HCO3",
        "Ca3PO42"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_PO4",
        "CH3COO2Ca"
      ],
      "p": [
        "CH3COOK",
        "Ca3PO42"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_PO4",
        "m_Ca_MnO4"
      ],
      "p": [
        "KMnO4",
        "Ca3PO42"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_PO4",
        "m_Ca_AlO2"
      ],
      "p": [
        "m_K_AlO2",
        "Ca3PO42"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_PO4",
        "m_Ca_Br"
      ],
      "p": [
        "m_K_Br",
        "Ca3PO42"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_PO4",
        "m_Ca_I"
      ],
      "p": [
        "m_K_I",
        "Ca3PO42"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_PO4",
        "MgCl2"
      ],
      "p": [
        "KCl",
        "m_Mg_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_PO4",
        "MgSO4"
      ],
      "p": [
        "K2SO4",
        "m_Mg_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_PO4",
        "MgHCO32"
      ],
      "p": [
        "m_K_HCO3",
        "m_Mg_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_PO4",
        "m_Mg_ClO"
      ],
      "p": [
        "m_K_ClO",
        "m_Mg_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_PO4",
        "CH3COO2Mg"
      ],
      "p": [
        "CH3COOK",
        "m_Mg_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_PO4",
        "m_Mg_MnO4"
      ],
      "p": [
        "KMnO4",
        "m_Mg_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_PO4",
        "m_Mg_AlO2"
      ],
      "p": [
        "m_K_AlO2",
        "m_Mg_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_PO4",
        "m_Mg_Br"
      ],
      "p": [
        "m_K_Br",
        "m_Mg_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_PO4",
        "m_Mg_I"
      ],
      "p": [
        "m_K_I",
        "m_Mg_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_PO4",
        "AlCl3"
      ],
      "p": [
        "KCl",
        "m_Al_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_PO4",
        "Al2SO43"
      ],
      "p": [
        "K2SO4",
        "m_Al_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_PO4",
        "AlNO33"
      ],
      "p": [
        "KNO3",
        "m_Al_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_PO4",
        "m_Al_CH3COO"
      ],
      "p": [
        "CH3COOK",
        "m_Al_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_PO4",
        "m_Al_Br"
      ],
      "p": [
        "m_K_Br",
        "m_Al_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_PO4",
        "m_Al_I"
      ],
      "p": [
        "m_K_I",
        "m_Al_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_PO4",
        "ZnCl2"
      ],
      "p": [
        "KCl",
        "m_Zn_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_PO4",
        "ZnNO32"
      ],
      "p": [
        "KNO3",
        "m_Zn_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_PO4",
        "m_Zn_ClO"
      ],
      "p": [
        "m_K_ClO",
        "m_Zn_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_PO4",
        "m_Zn_CH3COO"
      ],
      "p": [
        "CH3COOK",
        "m_Zn_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_PO4",
        "m_Zn_MnO4"
      ],
      "p": [
        "KMnO4",
        "m_Zn_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_PO4",
        "m_Zn_AlO2"
      ],
      "p": [
        "m_K_AlO2",
        "m_Zn_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_PO4",
        "m_Zn_Br"
      ],
      "p": [
        "m_K_Br",
        "m_Zn_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_PO4",
        "m_Zn_I"
      ],
      "p": [
        "m_K_I",
        "m_Zn_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_PO4",
        "FeCl2"
      ],
      "p": [
        "KCl",
        "m_Fe2_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_PO4",
        "FeNO32"
      ],
      "p": [
        "KNO3",
        "m_Fe2_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_PO4",
        "m_Fe2_MnO4"
      ],
      "p": [
        "KMnO4",
        "m_Fe2_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_PO4",
        "m_Fe2_AlO2"
      ],
      "p": [
        "m_K_AlO2",
        "m_Fe2_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_PO4",
        "m_Fe2_Br"
      ],
      "p": [
        "m_K_Br",
        "m_Fe2_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_PO4",
        "m_Fe2_I"
      ],
      "p": [
        "m_K_I",
        "m_Fe2_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_PO4",
        "Fe2SO43"
      ],
      "p": [
        "K2SO4",
        "m_Fe3_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_PO4",
        "FeNO33"
      ],
      "p": [
        "KNO3",
        "m_Fe3_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_PO4",
        "m_Fe3_CH3COO"
      ],
      "p": [
        "CH3COOK",
        "m_Fe3_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_PO4",
        "m_Fe3_MnO4"
      ],
      "p": [
        "KMnO4",
        "m_Fe3_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_PO4",
        "m_Fe3_AlO2"
      ],
      "p": [
        "m_K_AlO2",
        "m_Fe3_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_PO4",
        "m_Fe3_Br"
      ],
      "p": [
        "m_K_Br",
        "m_Fe3_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_PO4",
        "m_Cu_CH3COO"
      ],
      "p": [
        "CH3COOK",
        "m_Cu_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_PO4",
        "m_Cu_MnO4"
      ],
      "p": [
        "KMnO4",
        "m_Cu_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_PO4",
        "m_Cu_AlO2"
      ],
      "p": [
        "m_K_AlO2",
        "m_Cu_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_PO4",
        "m_Cu_Br"
      ],
      "p": [
        "m_K_Br",
        "m_Cu_PO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_SiO3",
        "BaHCO32"
      ],
      "p": [
        "m_K_HCO3",
        "m_Ba_SiO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_SiO3",
        "m_Ba_S"
      ],
      "p": [
        "m_K_S",
        "m_Ba_SiO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_SiO3",
        "m_Ba_ClO"
      ],
      "p": [
        "m_K_ClO",
        "m_Ba_SiO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_SiO3",
        "m_Ba_CH3COO"
      ],
      "p": [
        "CH3COOK",
        "m_Ba_SiO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_SiO3",
        "m_Ba_MnO4"
      ],
      "p": [
        "KMnO4",
        "m_Ba_SiO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_SiO3",
        "m_Ba_AlO2"
      ],
      "p": [
        "m_K_AlO2",
        "m_Ba_SiO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_SiO3",
        "m_Ba_Br"
      ],
      "p": [
        "m_K_Br",
        "m_Ba_SiO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_SiO3",
        "m_Ba_I"
      ],
      "p": [
        "m_K_I",
        "m_Ba_SiO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_SiO3",
        "MgCl2"
      ],
      "p": [
        "KCl",
        "m_Mg_SiO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_SiO3",
        "MgSO4"
      ],
      "p": [
        "K2SO4",
        "m_Mg_SiO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_SiO3",
        "MgHCO32"
      ],
      "p": [
        "m_K_HCO3",
        "m_Mg_SiO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_SiO3",
        "m_Mg_ClO"
      ],
      "p": [
        "m_K_ClO",
        "m_Mg_SiO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_SiO3",
        "CH3COO2Mg"
      ],
      "p": [
        "CH3COOK",
        "m_Mg_SiO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_SiO3",
        "m_Mg_MnO4"
      ],
      "p": [
        "KMnO4",
        "m_Mg_SiO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_SiO3",
        "m_Mg_AlO2"
      ],
      "p": [
        "m_K_AlO2",
        "m_Mg_SiO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_SiO3",
        "m_Mg_Br"
      ],
      "p": [
        "m_K_Br",
        "m_Mg_SiO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_SiO3",
        "m_Mg_I"
      ],
      "p": [
        "m_K_I",
        "m_Mg_SiO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_SiO3",
        "ZnCl2"
      ],
      "p": [
        "KCl",
        "m_Zn_SiO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_SiO3",
        "ZnNO32"
      ],
      "p": [
        "KNO3",
        "m_Zn_SiO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_SiO3",
        "m_Zn_ClO"
      ],
      "p": [
        "m_K_ClO",
        "m_Zn_SiO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_SiO3",
        "m_Zn_CH3COO"
      ],
      "p": [
        "CH3COOK",
        "m_Zn_SiO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_SiO3",
        "m_Zn_MnO4"
      ],
      "p": [
        "KMnO4",
        "m_Zn_SiO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_SiO3",
        "m_Zn_AlO2"
      ],
      "p": [
        "m_K_AlO2",
        "m_Zn_SiO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_SiO3",
        "m_Zn_Br"
      ],
      "p": [
        "m_K_Br",
        "m_Zn_SiO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_SiO3",
        "m_Zn_I"
      ],
      "p": [
        "m_K_I",
        "m_Zn_SiO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_SiO3",
        "FeCl2"
      ],
      "p": [
        "KCl",
        "m_Fe2_SiO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_SiO3",
        "FeNO32"
      ],
      "p": [
        "KNO3",
        "m_Fe2_SiO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_SiO3",
        "m_Fe2_MnO4"
      ],
      "p": [
        "KMnO4",
        "m_Fe2_SiO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_SiO3",
        "m_Fe2_AlO2"
      ],
      "p": [
        "m_K_AlO2",
        "m_Fe2_SiO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_SiO3",
        "m_Fe2_Br"
      ],
      "p": [
        "m_K_Br",
        "m_Fe2_SiO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_SiO3",
        "m_Fe2_I"
      ],
      "p": [
        "m_K_I",
        "m_Fe2_SiO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_SiO3",
        "m_Cu_CH3COO"
      ],
      "p": [
        "CH3COOK",
        "m_Cu_SiO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_SiO3",
        "m_Cu_MnO4"
      ],
      "p": [
        "KMnO4",
        "m_Cu_SiO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_SiO3",
        "m_Cu_AlO2"
      ],
      "p": [
        "m_K_AlO2",
        "m_Cu_SiO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_SiO3",
        "m_Cu_Br"
      ],
      "p": [
        "m_K_Br",
        "m_Cu_SiO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_SiO3",
        "Ag2SO4"
      ],
      "p": [
        "K2SO4",
        "m_Ag_SiO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_SiO3",
        "m_Ag_CH3COO"
      ],
      "p": [
        "CH3COOK",
        "m_Ag_SiO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_SiO3",
        "m_Ag_MnO4"
      ],
      "p": [
        "KMnO4",
        "m_Ag_SiO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_SiO3",
        "m_Ag_AlO2"
      ],
      "p": [
        "m_K_AlO2",
        "m_Ag_SiO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_Br",
        "Ag2SO4"
      ],
      "p": [
        "K2SO4",
        "AgBr"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_Br",
        "m_Ag_CH3COO"
      ],
      "p": [
        "CH3COOK",
        "AgBr"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_Br",
        "m_Ag_MnO4"
      ],
      "p": [
        "KMnO4",
        "AgBr"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_Br",
        "m_Ag_AlO2"
      ],
      "p": [
        "m_K_AlO2",
        "AgBr"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_I",
        "Ag2SO4"
      ],
      "p": [
        "K2SO4",
        "AgI"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_I",
        "m_Ag_CH3COO"
      ],
      "p": [
        "CH3COOK",
        "AgI"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_I",
        "m_Ag_MnO4"
      ],
      "p": [
        "KMnO4",
        "AgI"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_K_I",
        "m_Ag_AlO2"
      ],
      "p": [
        "m_K_AlO2",
        "AgI"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "BaHCO32",
        "CaSO4"
      ],
      "p": [
        "BaSO4",
        "CaHCO32"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "BaHCO32",
        "MgSO4"
      ],
      "p": [
        "BaSO4",
        "MgHCO32"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "BaHCO32",
        "Ag2SO4"
      ],
      "p": [
        "BaSO4",
        "m_Ag_HCO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Ba_S",
        "MgHCO32"
      ],
      "p": [
        "BaHCO32",
        "m_Mg_S"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Ba_S",
        "m_Mg_ClO"
      ],
      "p": [
        "m_Ba_ClO",
        "m_Mg_S"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Ba_S",
        "CH3COO2Mg"
      ],
      "p": [
        "m_Ba_CH3COO",
        "m_Mg_S"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Ba_S",
        "m_Mg_MnO4"
      ],
      "p": [
        "m_Ba_MnO4",
        "m_Mg_S"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Ba_S",
        "m_Mg_AlO2"
      ],
      "p": [
        "m_Ba_AlO2",
        "m_Mg_S"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Ba_S",
        "m_Mg_Br"
      ],
      "p": [
        "m_Ba_Br",
        "m_Mg_S"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Ba_S",
        "m_Mg_I"
      ],
      "p": [
        "m_Ba_I",
        "m_Mg_S"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Ba_S",
        "m_Zn_ClO"
      ],
      "p": [
        "m_Ba_ClO",
        "m_Zn_S"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Ba_S",
        "m_Zn_CH3COO"
      ],
      "p": [
        "m_Ba_CH3COO",
        "m_Zn_S"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Ba_S",
        "m_Zn_MnO4"
      ],
      "p": [
        "m_Ba_MnO4",
        "m_Zn_S"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Ba_S",
        "m_Zn_AlO2"
      ],
      "p": [
        "m_Ba_AlO2",
        "m_Zn_S"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Ba_S",
        "m_Zn_Br"
      ],
      "p": [
        "m_Ba_Br",
        "m_Zn_S"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Ba_S",
        "m_Zn_I"
      ],
      "p": [
        "m_Ba_I",
        "m_Zn_S"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Ba_S",
        "m_Fe2_MnO4"
      ],
      "p": [
        "m_Ba_MnO4",
        "FeS"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Ba_S",
        "m_Fe2_AlO2"
      ],
      "p": [
        "m_Ba_AlO2",
        "FeS"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Ba_S",
        "m_Fe2_Br"
      ],
      "p": [
        "m_Ba_Br",
        "FeS"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Ba_S",
        "m_Fe2_I"
      ],
      "p": [
        "m_Ba_I",
        "FeS"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Ba_S",
        "m_Cu_CH3COO"
      ],
      "p": [
        "m_Ba_CH3COO",
        "CuS"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Ba_S",
        "m_Cu_MnO4"
      ],
      "p": [
        "m_Ba_MnO4",
        "CuS"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Ba_S",
        "m_Cu_AlO2"
      ],
      "p": [
        "m_Ba_AlO2",
        "CuS"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Ba_S",
        "m_Cu_Br"
      ],
      "p": [
        "m_Ba_Br",
        "CuS"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Ba_ClO",
        "MgSO4"
      ],
      "p": [
        "BaSO4",
        "m_Mg_ClO"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Ba_ClO",
        "Al2SO43"
      ],
      "p": [
        "BaSO4",
        "m_Al_ClO"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Ba_ClO",
        "Fe2SO43"
      ],
      "p": [
        "BaSO4",
        "m_Fe3_ClO"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Ba_ClO",
        "Ag2SO4"
      ],
      "p": [
        "BaSO4",
        "m_Ag_ClO"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Ba_CH3COO",
        "CaSO4"
      ],
      "p": [
        "BaSO4",
        "CH3COO2Ca"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Ba_CH3COO",
        "MgSO4"
      ],
      "p": [
        "BaSO4",
        "CH3COO2Mg"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Ba_CH3COO",
        "Al2SO43"
      ],
      "p": [
        "BaSO4",
        "m_Al_CH3COO"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Ba_CH3COO",
        "Fe2SO43"
      ],
      "p": [
        "BaSO4",
        "m_Fe3_CH3COO"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Ba_CH3COO",
        "Ag2SO4"
      ],
      "p": [
        "BaSO4",
        "m_Ag_CH3COO"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Ba_MnO4",
        "CaSO4"
      ],
      "p": [
        "BaSO4",
        "m_Ca_MnO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Ba_MnO4",
        "MgSO4"
      ],
      "p": [
        "BaSO4",
        "m_Mg_MnO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Ba_MnO4",
        "Fe2SO43"
      ],
      "p": [
        "BaSO4",
        "m_Fe3_MnO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Ba_MnO4",
        "Ag2SO4"
      ],
      "p": [
        "BaSO4",
        "m_Ag_MnO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Ba_AlO2",
        "CaSO4"
      ],
      "p": [
        "BaSO4",
        "m_Ca_AlO2"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Ba_AlO2",
        "MgSO4"
      ],
      "p": [
        "BaSO4",
        "m_Mg_AlO2"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Ba_AlO2",
        "Ag2SO4"
      ],
      "p": [
        "BaSO4",
        "m_Ag_AlO2"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Ba_Br",
        "CaSO4"
      ],
      "p": [
        "BaSO4",
        "m_Ca_Br"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Ba_Br",
        "MgSO4"
      ],
      "p": [
        "BaSO4",
        "m_Mg_Br"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Ba_Br",
        "Al2SO43"
      ],
      "p": [
        "BaSO4",
        "m_Al_Br"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Ba_Br",
        "Fe2SO43"
      ],
      "p": [
        "BaSO4",
        "m_Fe3_Br"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Ba_Br",
        "m_Ag_CH3COO"
      ],
      "p": [
        "m_Ba_CH3COO",
        "AgBr"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Ba_Br",
        "m_Ag_MnO4"
      ],
      "p": [
        "m_Ba_MnO4",
        "AgBr"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Ba_Br",
        "m_Ag_AlO2"
      ],
      "p": [
        "m_Ba_AlO2",
        "AgBr"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Ba_I",
        "CaSO4"
      ],
      "p": [
        "BaSO4",
        "m_Ca_I"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Ba_I",
        "MgSO4"
      ],
      "p": [
        "BaSO4",
        "m_Mg_I"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Ba_I",
        "Al2SO43"
      ],
      "p": [
        "BaSO4",
        "m_Al_I"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Ba_I",
        "m_Ag_CH3COO"
      ],
      "p": [
        "m_Ba_CH3COO",
        "AgI"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Ba_I",
        "m_Ag_MnO4"
      ],
      "p": [
        "m_Ba_MnO4",
        "AgI"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Ba_I",
        "m_Ag_AlO2"
      ],
      "p": [
        "m_Ba_AlO2",
        "AgI"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "CaSO4",
        "m_Mg_C2O4"
      ],
      "p": [
        "CaC2O4",
        "MgSO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "CaSO4",
        "m_Fe3_C2O4"
      ],
      "p": [
        "CaC2O4",
        "Fe2SO43"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "CaNO32",
        "m_Fe2_C2O4"
      ],
      "p": [
        "CaC2O4",
        "FeNO32"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "CaNO32",
        "m_Fe3_C2O4"
      ],
      "p": [
        "CaC2O4",
        "FeNO33"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "CaHCO32",
        "m_Mg_C2O4"
      ],
      "p": [
        "CaC2O4",
        "MgHCO32"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "CaHCO32",
        "m_Fe2_C2O4"
      ],
      "p": [
        "CaC2O4",
        "m_Fe2_HCO3"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "CH3COO2Ca",
        "m_Mg_C2O4"
      ],
      "p": [
        "CaC2O4",
        "CH3COO2Mg"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "CH3COO2Ca",
        "m_Fe3_C2O4"
      ],
      "p": [
        "CaC2O4",
        "m_Fe3_CH3COO"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Ca_MnO4",
        "m_Mg_C2O4"
      ],
      "p": [
        "CaC2O4",
        "m_Mg_MnO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Ca_MnO4",
        "m_Fe2_C2O4"
      ],
      "p": [
        "CaC2O4",
        "m_Fe2_MnO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Ca_MnO4",
        "m_Fe3_C2O4"
      ],
      "p": [
        "CaC2O4",
        "m_Fe3_MnO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Ca_AlO2",
        "m_Mg_C2O4"
      ],
      "p": [
        "CaC2O4",
        "m_Mg_AlO2"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Ca_AlO2",
        "m_Fe2_C2O4"
      ],
      "p": [
        "CaC2O4",
        "m_Fe2_AlO2"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Ca_Br",
        "m_Mg_C2O4"
      ],
      "p": [
        "CaC2O4",
        "m_Mg_Br"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Ca_Br",
        "m_Fe2_C2O4"
      ],
      "p": [
        "CaC2O4",
        "m_Fe2_Br"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Ca_Br",
        "m_Fe3_C2O4"
      ],
      "p": [
        "CaC2O4",
        "m_Fe3_Br"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Ca_Br",
        "Ag2SO4"
      ],
      "p": [
        "CaSO4",
        "AgBr"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Ca_Br",
        "m_Ag_CH3COO"
      ],
      "p": [
        "CH3COO2Ca",
        "AgBr"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Ca_Br",
        "m_Ag_MnO4"
      ],
      "p": [
        "m_Ca_MnO4",
        "AgBr"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Ca_Br",
        "m_Ag_AlO2"
      ],
      "p": [
        "m_Ca_AlO2",
        "AgBr"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Ca_I",
        "m_Mg_C2O4"
      ],
      "p": [
        "CaC2O4",
        "m_Mg_I"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Ca_I",
        "m_Fe2_C2O4"
      ],
      "p": [
        "CaC2O4",
        "m_Fe2_I"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Ca_I",
        "Ag2SO4"
      ],
      "p": [
        "CaSO4",
        "AgI"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Ca_I",
        "m_Ag_CH3COO"
      ],
      "p": [
        "CH3COO2Ca",
        "AgI"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Ca_I",
        "m_Ag_MnO4"
      ],
      "p": [
        "m_Ca_MnO4",
        "AgI"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Ca_I",
        "m_Ag_AlO2"
      ],
      "p": [
        "m_Ca_AlO2",
        "AgI"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "MgCl2",
        "Ag2SO4"
      ],
      "p": [
        "MgSO4",
        "AgCl"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "MgCl2",
        "m_Ag_CH3COO"
      ],
      "p": [
        "CH3COO2Mg",
        "AgCl"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "MgCl2",
        "m_Ag_MnO4"
      ],
      "p": [
        "m_Mg_MnO4",
        "AgCl"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "MgCl2",
        "m_Ag_AlO2"
      ],
      "p": [
        "m_Mg_AlO2",
        "AgCl"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Mg_C2O4",
        "AlCl3"
      ],
      "p": [
        "MgCl2",
        "m_Al_C2O4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Mg_C2O4",
        "Al2SO43"
      ],
      "p": [
        "MgSO4",
        "m_Al_C2O4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Mg_C2O4",
        "m_Al_CH3COO"
      ],
      "p": [
        "CH3COO2Mg",
        "m_Al_C2O4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Mg_C2O4",
        "m_Al_Br"
      ],
      "p": [
        "m_Mg_Br",
        "m_Al_C2O4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Mg_C2O4",
        "m_Al_I"
      ],
      "p": [
        "m_Mg_I",
        "m_Al_C2O4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Mg_C2O4",
        "ZnCl2"
      ],
      "p": [
        "MgCl2",
        "m_Zn_C2O4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Mg_C2O4",
        "m_Zn_ClO"
      ],
      "p": [
        "m_Mg_ClO",
        "m_Zn_C2O4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Mg_C2O4",
        "m_Zn_CH3COO"
      ],
      "p": [
        "CH3COO2Mg",
        "m_Zn_C2O4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Mg_C2O4",
        "m_Zn_MnO4"
      ],
      "p": [
        "m_Mg_MnO4",
        "m_Zn_C2O4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Mg_C2O4",
        "m_Zn_AlO2"
      ],
      "p": [
        "m_Mg_AlO2",
        "m_Zn_C2O4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Mg_C2O4",
        "m_Zn_Br"
      ],
      "p": [
        "m_Mg_Br",
        "m_Zn_C2O4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Mg_C2O4",
        "m_Zn_I"
      ],
      "p": [
        "m_Mg_I",
        "m_Zn_C2O4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Mg_C2O4",
        "m_Cu_CH3COO"
      ],
      "p": [
        "CH3COO2Mg",
        "m_Cu_C2O4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Mg_C2O4",
        "m_Cu_MnO4"
      ],
      "p": [
        "m_Mg_MnO4",
        "m_Cu_C2O4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Mg_C2O4",
        "m_Cu_AlO2"
      ],
      "p": [
        "m_Mg_AlO2",
        "m_Cu_C2O4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Mg_C2O4",
        "m_Cu_Br"
      ],
      "p": [
        "m_Mg_Br",
        "m_Cu_C2O4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Mg_C2O4",
        "Ag2SO4"
      ],
      "p": [
        "MgSO4",
        "m_Ag_C2O4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Mg_C2O4",
        "m_Ag_CH3COO"
      ],
      "p": [
        "CH3COO2Mg",
        "m_Ag_C2O4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Mg_C2O4",
        "m_Ag_MnO4"
      ],
      "p": [
        "m_Mg_MnO4",
        "m_Ag_C2O4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Mg_C2O4",
        "m_Ag_AlO2"
      ],
      "p": [
        "m_Mg_AlO2",
        "m_Ag_C2O4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Mg_Br",
        "Ag2SO4"
      ],
      "p": [
        "MgSO4",
        "AgBr"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Mg_Br",
        "m_Ag_CH3COO"
      ],
      "p": [
        "CH3COO2Mg",
        "AgBr"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Mg_Br",
        "m_Ag_MnO4"
      ],
      "p": [
        "m_Mg_MnO4",
        "AgBr"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Mg_Br",
        "m_Ag_AlO2"
      ],
      "p": [
        "m_Mg_AlO2",
        "AgBr"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Mg_I",
        "Ag2SO4"
      ],
      "p": [
        "MgSO4",
        "AgI"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Mg_I",
        "m_Ag_CH3COO"
      ],
      "p": [
        "CH3COO2Mg",
        "AgI"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Mg_I",
        "m_Ag_MnO4"
      ],
      "p": [
        "m_Mg_MnO4",
        "AgI"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Mg_I",
        "m_Ag_AlO2"
      ],
      "p": [
        "m_Mg_AlO2",
        "AgI"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "AlCl3",
        "m_Fe2_C2O4"
      ],
      "p": [
        "m_Al_C2O4",
        "FeCl2"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "AlCl3",
        "Ag2SO4"
      ],
      "p": [
        "Al2SO43",
        "AgCl"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "AlCl3",
        "m_Ag_CH3COO"
      ],
      "p": [
        "m_Al_CH3COO",
        "AgCl"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "Al2SO43",
        "m_Fe3_C2O4"
      ],
      "p": [
        "m_Al_C2O4",
        "Fe2SO43"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "AlNO33",
        "m_Fe2_C2O4"
      ],
      "p": [
        "m_Al_C2O4",
        "FeNO32"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "AlNO33",
        "m_Fe3_C2O4"
      ],
      "p": [
        "m_Al_C2O4",
        "FeNO33"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Al_CH3COO",
        "m_Fe3_C2O4"
      ],
      "p": [
        "m_Al_C2O4",
        "m_Fe3_CH3COO"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Al_Br",
        "m_Fe2_C2O4"
      ],
      "p": [
        "m_Al_C2O4",
        "m_Fe2_Br"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Al_Br",
        "m_Fe3_C2O4"
      ],
      "p": [
        "m_Al_C2O4",
        "m_Fe3_Br"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Al_Br",
        "Ag2SO4"
      ],
      "p": [
        "Al2SO43",
        "AgBr"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Al_Br",
        "m_Ag_CH3COO"
      ],
      "p": [
        "m_Al_CH3COO",
        "AgBr"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Al_I",
        "m_Fe2_C2O4"
      ],
      "p": [
        "m_Al_C2O4",
        "m_Fe2_I"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Al_I",
        "Ag2SO4"
      ],
      "p": [
        "Al2SO43",
        "AgI"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Al_I",
        "m_Ag_CH3COO"
      ],
      "p": [
        "m_Al_CH3COO",
        "AgI"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "ZnCl2",
        "m_Fe2_C2O4"
      ],
      "p": [
        "m_Zn_C2O4",
        "FeCl2"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "ZnCl2",
        "m_Ag_CH3COO"
      ],
      "p": [
        "m_Zn_CH3COO",
        "AgCl"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "ZnCl2",
        "m_Ag_MnO4"
      ],
      "p": [
        "m_Zn_MnO4",
        "AgCl"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "ZnCl2",
        "m_Ag_AlO2"
      ],
      "p": [
        "m_Zn_AlO2",
        "AgCl"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "ZnNO32",
        "m_Fe2_C2O4"
      ],
      "p": [
        "m_Zn_C2O4",
        "FeNO32"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "ZnNO32",
        "m_Fe3_C2O4"
      ],
      "p": [
        "m_Zn_C2O4",
        "FeNO33"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Zn_ClO",
        "m_Fe2_C2O4"
      ],
      "p": [
        "m_Zn_C2O4",
        "m_Fe2_ClO"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Zn_ClO",
        "m_Fe3_C2O4"
      ],
      "p": [
        "m_Zn_C2O4",
        "m_Fe3_ClO"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Zn_CH3COO",
        "m_Fe3_C2O4"
      ],
      "p": [
        "m_Zn_C2O4",
        "m_Fe3_CH3COO"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Zn_MnO4",
        "m_Fe2_C2O4"
      ],
      "p": [
        "m_Zn_C2O4",
        "m_Fe2_MnO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Zn_MnO4",
        "m_Fe3_C2O4"
      ],
      "p": [
        "m_Zn_C2O4",
        "m_Fe3_MnO4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Zn_AlO2",
        "m_Fe2_C2O4"
      ],
      "p": [
        "m_Zn_C2O4",
        "m_Fe2_AlO2"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Zn_Br",
        "m_Fe2_C2O4"
      ],
      "p": [
        "m_Zn_C2O4",
        "m_Fe2_Br"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Zn_Br",
        "m_Fe3_C2O4"
      ],
      "p": [
        "m_Zn_C2O4",
        "m_Fe3_Br"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Zn_Br",
        "m_Ag_CH3COO"
      ],
      "p": [
        "m_Zn_CH3COO",
        "AgBr"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Zn_Br",
        "m_Ag_MnO4"
      ],
      "p": [
        "m_Zn_MnO4",
        "AgBr"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Zn_Br",
        "m_Ag_AlO2"
      ],
      "p": [
        "m_Zn_AlO2",
        "AgBr"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Zn_I",
        "m_Fe2_C2O4"
      ],
      "p": [
        "m_Zn_C2O4",
        "m_Fe2_I"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Zn_I",
        "m_Ag_CH3COO"
      ],
      "p": [
        "m_Zn_CH3COO",
        "AgI"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Zn_I",
        "m_Ag_MnO4"
      ],
      "p": [
        "m_Zn_MnO4",
        "AgI"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Zn_I",
        "m_Ag_AlO2"
      ],
      "p": [
        "m_Zn_AlO2",
        "AgI"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "FeCl2",
        "m_Ag_MnO4"
      ],
      "p": [
        "m_Fe2_MnO4",
        "AgCl"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "FeCl2",
        "m_Ag_AlO2"
      ],
      "p": [
        "m_Fe2_AlO2",
        "AgCl"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Fe2_C2O4",
        "m_Cu_MnO4"
      ],
      "p": [
        "m_Fe2_MnO4",
        "m_Cu_C2O4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Fe2_C2O4",
        "m_Cu_AlO2"
      ],
      "p": [
        "m_Fe2_AlO2",
        "m_Cu_C2O4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Fe2_C2O4",
        "m_Cu_Br"
      ],
      "p": [
        "m_Fe2_Br",
        "m_Cu_C2O4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Fe2_C2O4",
        "m_Ag_MnO4"
      ],
      "p": [
        "m_Fe2_MnO4",
        "m_Ag_C2O4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Fe2_C2O4",
        "m_Ag_AlO2"
      ],
      "p": [
        "m_Fe2_AlO2",
        "m_Ag_C2O4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Fe2_Br",
        "m_Ag_MnO4"
      ],
      "p": [
        "m_Fe2_MnO4",
        "AgBr"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Fe2_Br",
        "m_Ag_AlO2"
      ],
      "p": [
        "m_Fe2_AlO2",
        "AgBr"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Fe2_I",
        "m_Ag_MnO4"
      ],
      "p": [
        "m_Fe2_MnO4",
        "AgI"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Fe2_I",
        "m_Ag_AlO2"
      ],
      "p": [
        "m_Fe2_AlO2",
        "AgI"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Fe3_C2O4",
        "m_Cu_CH3COO"
      ],
      "p": [
        "m_Fe3_CH3COO",
        "m_Cu_C2O4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Fe3_C2O4",
        "m_Cu_MnO4"
      ],
      "p": [
        "m_Fe3_MnO4",
        "m_Cu_C2O4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Fe3_C2O4",
        "m_Cu_Br"
      ],
      "p": [
        "m_Fe3_Br",
        "m_Cu_C2O4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Fe3_C2O4",
        "Ag2SO4"
      ],
      "p": [
        "Fe2SO43",
        "m_Ag_C2O4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Fe3_C2O4",
        "m_Ag_CH3COO"
      ],
      "p": [
        "m_Fe3_CH3COO",
        "m_Ag_C2O4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Fe3_C2O4",
        "m_Ag_MnO4"
      ],
      "p": [
        "m_Fe3_MnO4",
        "m_Ag_C2O4"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Fe3_Br",
        "Ag2SO4"
      ],
      "p": [
        "Fe2SO43",
        "AgBr"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Fe3_Br",
        "m_Ag_CH3COO"
      ],
      "p": [
        "m_Fe3_CH3COO",
        "AgBr"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Fe3_Br",
        "m_Ag_MnO4"
      ],
      "p": [
        "m_Fe3_MnO4",
        "AgBr"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Cu_Br",
        "m_Ag_CH3COO"
      ],
      "p": [
        "m_Cu_CH3COO",
        "AgBr"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Cu_Br",
        "m_Ag_MnO4"
      ],
      "p": [
        "m_Cu_MnO4",
        "AgBr"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    },
    {
      "r": [
        "m_Cu_Br",
        "m_Ag_AlO2"
      ],
      "p": [
        "m_Cu_AlO2",
        "AgBr"
      ],
      "c": "",
      "nm": "复分解反应（生成沉淀）",
      "t": "复分解"
    }
  ];

  /* ---------- 合并进数据库 ---------- */
  var subIndex = DB.SUB_INDEX;
  var addedSub = 0;
  SUBSTANCES.forEach(function (s) {
    if (subIndex[s.id]) return;
    DB.SUBSTANCES.push(s);
    subIndex[s.id] = s;
    addedSub++;
  });
  DB.GENERATED = { substances: addedSub, reactions: 0, added: 0 };

  /* ---------- 化学式归一：同一物质只保留一个 id ----------
   * data.js 的手写反应里存在 “Ca(NO3)2”“(NH4)2SO4” 这类别名写法，
   * 与生成库里的 CaNO32 / NH42SO4 指向同一物质，若不统一会出现
   * 同一个化学式两个 id、界面上解析不到名称的问题。这里按化学式全部归一。 */
  var SUBD = { "₀": "0", "₁": "1", "₂": "2", "₃": "3", "₄": "4", "₅": "5", "₆": "6", "₇": "7", "₈": "8", "₉": "9" };
  DB.normFormula = function (f) {
    if (!f) return "";
    var s = String(f).replace(/[₀-₉]/g, function (c) { return SUBD[c]; })
      .replace(/\s+/g, "").replace(/（/g, "(").replace(/）/g, ")");
    /* 忽略书写顺序：(NO3)2Ca 与 Ca(NO3)2 视为同一物质 */
    var parts = s.match(/\((?:[^()]|\([^()]*\))*\)\d*|[A-Z][a-z]?\d*|\([^)]*\)/g);
    return parts ? parts.sort().join("") : s;
  };
  var F2ID = {}, F2SUB = {};
  function rebuildFormulaIndex() {
    F2ID = {}; F2SUB = {};
    DB.SUBSTANCES.forEach(function (s) {
      var k = DB.normFormula(s.f);
      if (!k) return;
      if (!F2ID[k]) { F2ID[k] = s.id; F2SUB[k] = s; }
    });
  }
  /* 生成物质已并入 DB.SUBSTANCES，这里首次建立索引即可覆盖全部物质 */
  rebuildFormulaIndex();
  DB.rebuildFormulaIndex = rebuildFormulaIndex;
  DB.resolveId = function (id) {
    if (DB.SUB_INDEX[id]) return id;
    var k = DB.normFormula(id);
    return F2ID[k] || null;
  };

  /* 把每条反应的物质 id 换写成规范 id，并去掉因此产生的重复项 */
  function normList(list) {
    var out2 = [], seen2 = {};
    list.forEach(function (x) {
      var id = DB.resolveId(x);
      if (!id || seen2[id]) return;
      seen2[id] = 1;
      out2.push(id);
    });
    return out2;
  }
  var normed = [], seenRx = {};
  DB.REACTIONS.forEach(function (rx) {
    var r = normList(rx.r), p = normList(rx.p);
    if (!r.length || !p.length) return;
    if (r.some(function (x) { return p.indexOf(x) >= 0; })) return;   // 同一物质不能既是反应物又是产物
    rx.r = r; rx.p = p;
    var key = r.slice().sort().join("+") + "=>" + p.slice().sort().join("+");
    if (seenRx[key]) return;
    seenRx[key] = 1;
    normed.push(rx);
  });
  DB.REACTIONS = normed;

  /* ---------- 合并自动生成的反应（放在物质裁剪之前，否则会误删物质） ---------- */
  var seen = {};
  DB.REACTIONS.forEach(function (rx) {
    seen[rx.r.slice().sort().join("+") + "=>" + rx.p.slice().sort().join("+")] = 1;
  });
  var added = 0;
  REACTIONS.forEach(function (rx) {
    var r2 = normList(rx.r), p2 = normList(rx.p);
    if (!r2.length || !p2.length) return;
    rx.r = r2; rx.p = p2;
    var k = r2.slice().sort().join("+") + "=>" + p2.slice().sort().join("+");
    if (seen[k]) return;
    seen[k] = 1;
    rx.id = "gx" + (DB.REACTIONS.length);
    DB.REACTIONS.push(rx);
    added++;
  });

  /* 裁剪：只保留被反应引用到的物质（避免穷举出的上千种冷门化合物塞满物质库） */
  var used = {};
  DB.REACTIONS.forEach(function (rx) { rx.r.concat(rx.p).forEach(function (x) { used[x] = 1; }); });
  /* 先把同一化学式的别名合并到第一个出现的规范 id（如 Ba(NO3)2 → BaNO32） */
  var winner = {}, alias2canon = {};
  DB.SUBSTANCES.forEach(function (s) {
    var k = DB.normFormula(s.f);
    if (!k) return;
    if (!winner[k]) winner[k] = s.id;
    else if (winner[k] !== s.id) alias2canon[s.id] = winner[k];
  });
  DB.aliasMap = alias2canon;
  DB.REACTIONS.forEach(function (rx) {
    function fix(a) {
      var out3 = [], seen3 = {};
      a.forEach(function (x) {
        var id = alias2canon[x] || x;
        if (seen3[id]) return;
        seen3[id] = 1; out3.push(id);
      });
      return out3;
    }
    rx.r = fix(rx.r); rx.p = fix(rx.p);
  });
  /* 物质本身也只保留规范 id 那一条 */
  DB.SUBSTANCES = DB.SUBSTANCES.filter(function (s) { return !alias2canon[s.id]; });
  used = {};
  DB.REACTIONS.forEach(function (rx) { rx.r.concat(rx.p).forEach(function (x) { used[x] = 1; }); });
  DB.SUBSTANCES = DB.SUBSTANCES.filter(function (s) {
    /* 未被任何反应引用、又不是牌表里的物质 → 丢弃；牌表物质必须保留 */
    return used[s.id] || DB.CARD_TABLE.some(function (c) { return c.id === s.id; });
  });
  DB.SUB_INDEX = {};
  DB.SUBSTANCES.forEach(function (s) { DB.SUB_INDEX[s.id] = s; });
  rebuildFormulaIndex();

  /* 类别修正：这些物质既不是氧化物也不属于酸/碱/盐/单质，统一归到「其他」（白色标签） */
  var CAT_FIX = { NH3: 1, CH4: 1, C2H5OH: 1, C2H2: 1, SiF4: 1 };
  DB.SUBSTANCES.forEach(function (s) { if (CAT_FIX[s.id]) s.cat = "Ot"; });
  DB.CAT_NAME.Ot = "其他";
  DB.CAT_EN.Ot = "Other";

  DB.GENERATED = { substances: addedSub, reactions: added, total: DB.REACTIONS.length };

  /* 给所有反应预生成统一格式的方程式 */
  for (var ri = 0; ri < DB.REACTIONS.length; ri++) {
    DB.REACTIONS[ri].eq = DB.equationOf(DB.REACTIONS[ri]);
    DB.REACTIONS[ri].eqPlain = DB.equationPlainOf(DB.REACTIONS[ri]);
  }
})(typeof window !== "undefined" ? window : globalThis);
