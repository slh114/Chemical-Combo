/* ============================================================
 * 化学之王 Chemical Combo —— 数据扩充母表（离子表）
 * 用途：配合 gen-reactions.js 穷举「阳离子 × 阴离子」的复分解反应，
 *       并枚举初高中常见反应。
 * 说明：curated 静态数据写在 gen-reactions.js 中，本文件只放“离子表”这种母数据。
 * ============================================================ */
(function (global) {
  'use strict';

  /* 阳离子：charge 电荷数，sulf 硫酸盐溶解性（m=微溶），
   * 用于判断“生成沉淀/微溶物”的复分解条件 */
  var CATIONS = [
    { id: 'H', f: 'H', n: '氢离子', charge: 1, ion: 'H⁺', sulf: 'y' },
    { id: 'NH4', f: 'NH₄', n: '铵根', charge: 1, ion: 'NH₄⁺', sulf: 'y' },
    { id: 'Na', f: 'Na', n: '钠离子', charge: 1, ion: 'Na⁺', sulf: 'y' },
    { id: 'K', f: 'K', n: '钾离子', charge: 1, ion: 'K⁺', sulf: 'y' },
    { id: 'Ba', f: 'Ba', n: '钡离子', charge: 2, ion: 'Ba²⁺', sulf: 'n' },
    { id: 'Ca', f: 'Ca', n: '钙离子', charge: 2, ion: 'Ca²⁺', sulf: 'm' },
    { id: 'Mg', f: 'Mg', n: '镁离子', charge: 2, ion: 'Mg²⁺', sulf: 'y' },
    { id: 'Al', f: 'Al', n: '铝离子', charge: 3, ion: 'Al³⁺', sulf: 'y' },
    { id: 'Zn', f: 'Zn', n: '锌离子', charge: 2, ion: 'Zn²⁺', sulf: 'y' },
    { id: 'Fe2', f: 'Fe', n: '亚铁离子', charge: 2, ion: 'Fe²⁺', sulf: 'y', el: 'Fe' },
    { id: 'Fe3', f: 'Fe', n: '铁离子', charge: 3, ion: 'Fe³⁺', sulf: 'y', el: 'Fe' },
    { id: 'Cu', f: 'Cu', n: '铜离子', charge: 2, ion: 'Cu²⁺', sulf: 'y' },
    { id: 'Ag', f: 'Ag', n: '银离子', charge: 1, ion: 'Ag⁺', sulf: 'm' }
  ];

  /* 阴离子：sol 该盐的溶解性（与阳离子无关时给出），sulf 硫酸盐覆盖值 */
  var ANIONS = [
    { id: 'OH', f: 'OH', n: '氢氧根', charge: 1, ion: 'OH⁻' },
    { id: 'Cl', f: 'Cl', n: '氯离子', charge: 1, ion: 'Cl⁻' },
    { id: 'SO4', f: 'SO₄', n: '硫酸根', charge: 2, ion: 'SO₄²⁻' },
    { id: 'CO3', f: 'CO₃', n: '碳酸根', charge: 2, ion: 'CO₃²⁻' },
    { id: 'NO3', f: 'NO₃', n: '硝酸根', charge: 1, ion: 'NO₃⁻' },
    { id: 'HCO3', f: 'HCO₃', n: '碳酸氢根', charge: 1, ion: 'HCO₃⁻' },
    { id: 'F', f: 'F', n: '氟离子', charge: 1, ion: 'F⁻' },
    { id: 'S', f: 'S', n: '硫离子', charge: 2, ion: 'S²⁻' },
    { id: 'SO3', f: 'SO₃', n: '亚硫酸根', charge: 2, ion: 'SO₃²⁻' },
    { id: 'ClO', f: 'ClO', n: '次氯酸根', charge: 1, ion: 'ClO⁻' },
    { id: 'CH3COO', f: 'CH₃COO', n: '醋酸根', charge: 1, ion: 'CH₃COO⁻' },
    { id: 'C2O4', f: 'C₂O₄', n: '草酸根', charge: 2, ion: 'C₂O₄²⁻' },
    { id: 'MnO4', f: 'MnO₄', n: '高锰酸根', charge: 1, ion: 'MnO₄⁻' },
    { id: 'AlO2', f: 'AlO₂', n: '偏铝酸根', charge: 1, ion: 'AlO₂⁻' },
    { id: 'PO4', f: 'PO₄', n: '磷酸根', charge: 3, ion: 'PO₄³⁻' },
    { id: 'SiO3', f: 'SiO₃', n: '硅酸根', charge: 2, ion: 'SiO₃²⁻' },
    { id: 'Br', f: 'Br', n: '溴离子', charge: 1, ion: 'Br⁻' },
    { id: 'I', f: 'I', n: '碘离子', charge: 1, ion: 'I⁻' }
  ];

  global.ChemIons = { CATIONS: CATIONS, ANIONS: ANIONS };
  if (typeof module !== 'undefined' && module.exports) module.exports = global.ChemIons;
})(typeof window !== 'undefined' ? window : globalThis);

