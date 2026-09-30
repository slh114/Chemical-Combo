/* ============================================================
 * 化学之王 Chemical Combo —— 反应数据库生成器
 *
 * 目的：避免手工枚举反应时出错/漏项。做法是：
 *   1) 维护一张“物质母表”（本文件 SUBSTANCES_EXTRA + data.js 中已有的物质）；
 *   2) 用离子表穷举「阳/阴离子结合」，按复分解反应发生的条件
 *      （生成沉淀 / 气体 / 弱电解质）决定该组合能否反应；
 *   3) 再按初高中常见反应类型（中和、酸+金属、酸+金属氧化物、
 *      碱+非金属氧化物、置换、氧化还原、分解、氨碱法…）枚举；
 *   4) 与 data.js 中已有的人工整理反应合并、去重，输出 reactions-data.js。
 *
 * 运行：node tools/gen-reactions.js
 * ============================================================ */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
global.window = undefined;
require(path.join(ROOT, 'data.js'));
require(path.join(ROOT, 'ion-data.js'));
const DB = global.ChemDB;
const IONS = global.ChemIons;

/* ---------------------------------------------------------------
 * 一、新增物质母表
 * st: s固 l液 g气 / sol: y溶 m微溶 n难溶 x遇水反应或本身是水
 * cat: Ad酸 Be碱 St盐 Oe氧化物 Es单质
 * ------------------------------------------------------------- */
const EXTRA = [
  /* ---- 氧化物 / 非金属氧化物 / 气体 ---- */
  { id: 'NO', f: 'NO', n: '一氧化氮', cat: 'Oe', st: 'g', sol: 'n', el: ['N', 'O'], note: '无色气体，难溶于水，易被氧化为 NO₂' },
  { id: 'NO2', f: 'NO₂', n: '二氧化氮', cat: 'Oe', st: 'g', sol: 'y', el: ['N', 'O'], note: '红棕色有刺激性气味的气体，与水反应生成硝酸和 NO' },
  { id: 'N2O', f: 'N₂O', n: '一氧化二氮', cat: 'Oe', st: 'g', sol: 'y', el: ['N', 'O'], note: '笑气' },
  { id: 'SO3', f: 'SO₃', n: '三氧化硫', cat: 'Oe', st: 'l', sol: 'x', el: ['S', 'O'], note: '与水化合生成硫酸，工业制硫酸的中间产物' },
  { id: 'SO2', f: 'SO₂', n: '二氧化硫', cat: 'Oe', st: 'g', sol: 'y', el: ['S', 'O'], vol: true, note: '无色有刺激性气味的气体，形成酸雨；有漂白性、还原性' },
  { id: 'SiO2', f: 'SiO₂', n: '二氧化硅', cat: 'Oe', st: 's', sol: 'n', el: ['Si', 'O'], note: '沙子、石英的主要成分，与氢氟酸、强碱反应' },
  { id: 'P2O5', f: 'P₂O₅', n: '五氧化二磷', cat: 'Oe', st: 's', sol: 'x', el: ['P', 'O'], note: '白色固体，强吸水性' },
  { id: 'Fe3O4', f: 'Fe₃O₄', n: '四氧化三铁', cat: 'Oe', st: 's', sol: 'n', el: ['Fe', 'O'], note: '黑色晶体，有磁性' },
  { id: 'FeO', f: 'FeO', n: '氧化亚铁', cat: 'Oe', st: 's', sol: 'n', el: ['Fe', 'O'], note: '黑色粉末' },
  { id: 'MgO', f: 'MgO', n: '氧化镁', cat: 'Oe', st: 's', sol: 'n', el: ['Mg', 'O'], note: '白色固体，耐火材料' },
  { id: 'ZnO', f: 'ZnO', n: '氧化锌', cat: 'Oe', st: 's', sol: 'n', el: ['Zn', 'O'], note: '白色固体，两性氧化物' },
  { id: 'Na2O', f: 'Na₂O', n: '氧化钠', cat: 'Oe', st: 's', sol: 'x', el: ['Na', 'O'], note: '白色固体，与水反应生成氢氧化钠' },
  { id: 'Na2O2', f: 'Na₂O₂', n: '过氧化钠', cat: 'Oe', st: 's', sol: 'x', el: ['Na', 'O'], note: '淡黄色固体，与水和二氧化碳反应放出氧气' },
  { id: 'BaO', f: 'BaO', n: '氧化钡', cat: 'Oe', st: 's', sol: 'x', el: ['Ba', 'O'], note: '白色固体，与水反应生成氢氧化钡' },
  { id: 'KO2', f: 'KO₂', n: '超氧化钾', cat: 'Oe', st: 's', sol: 'x', el: ['K', 'O'], note: '橙黄色固体，供氧剂' },

  /* ---- 酸 ---- */
  { id: 'H2S', f: 'H₂S', n: '氢硫酸', cat: 'Ad', st: 'l', sol: 'y', el: ['H', 'S'], vol: true, note: '硫化氢的水溶液，弱酸，有臭鸡蛋气味' },
  { id: 'HCN', f: 'HCN', n: '氢氰酸', cat: 'Ad', st: 'l', sol: 'y', el: ['H', 'C', 'N'], note: '弱酸（剧毒）' },
  { id: 'H2SO3', f: 'H₂SO₃', n: '亚硫酸', cat: 'Ad', st: 'l', sol: 'y', el: ['H', 'S', 'O'], note: '弱酸，不稳定，易分解为 SO₂ 和 H₂O' },
  { id: 'H2CO3', f: 'H₂CO₃', n: '碳酸', cat: 'Ad', st: 'l', sol: 'y', el: ['H', 'C', 'O'], note: '弱酸，不稳定，易分解为 CO₂ 和 H₂O' },
  { id: 'H2SiO3', f: 'H₂SiO₃', n: '硅酸', cat: 'Ad', st: 's', sol: 'n', el: ['H', 'Si', 'O'], note: '白色胶状沉淀，弱酸' },
  { id: 'H3PO4', f: 'H₃PO₄', n: '磷酸', cat: 'Ad', st: 'l', sol: 'y', el: ['H', 'P', 'O'], note: '中强酸' },
  { id: 'HClO', f: 'HClO', n: '次氯酸', cat: 'Ad', st: 'l', sol: 'y', el: ['H', 'Cl', 'O'], note: '弱酸，有强氧化性和漂白性，见光分解' },
  { id: 'HBr', f: 'HBr', n: '氢溴酸', cat: 'Ad', st: 'l', sol: 'y', el: ['H', 'Br'], vol: true, note: '强酸' },
  { id: 'HI', f: 'HI', n: '氢碘酸', cat: 'Ad', st: 'l', sol: 'y', el: ['H', 'I'], vol: true, note: '强酸，有还原性' },

  /* ---- 碱（多为一元/二元弱碱或沉淀） ---- */
  { id: 'FeOH2', f: 'Fe(OH)₂', n: '氢氧化亚铁', cat: 'Be', st: 's', sol: 'n', el: ['Fe', 'O', 'H'], note: '白色沉淀，很快被氧化为红褐色' },
  { id: 'ZnOH2', f: 'Zn(OH)₂', n: '氢氧化锌', cat: 'Be', st: 's', sol: 'n', el: ['Zn', 'O', 'H'], note: '白色沉淀，两性' },

  /* ---- 盐 ---- */
  { id: 'FeNO33', f: 'Fe(NO₃)₃', n: '硝酸铁', cat: 'St', st: 's', sol: 'y', el: ['Fe', 'N', 'O'], dec: true, note: '受热分解' },
  { id: 'Fe2SO43', f: 'Fe₂(SO₄)₃', n: '硫酸铁', cat: 'St', st: 's', sol: 'y', el: ['Fe', 'S', 'O'], note: '' },
  { id: 'FeCl2', f: 'FeCl₂', n: '氯化亚铁', cat: 'St', st: 's', sol: 'y', el: ['Fe', 'Cl'], note: '浅绿色溶液' },
  { id: 'FeNO32', f: 'Fe(NO₃)₂', n: '硝酸亚铁', cat: 'St', st: 's', sol: 'y', el: ['Fe', 'N', 'O'], note: '' },
  { id: 'MgCl2', f: 'MgCl₂', n: '氯化镁', cat: 'St', st: 's', sol: 'y', el: ['Mg', 'Cl'], note: '' },
  { id: 'MgSO4', f: 'MgSO₄', n: '硫酸镁', cat: 'St', st: 's', sol: 'y', el: ['Mg', 'S', 'O'], note: '' },
  { id: 'AlCl3', f: 'AlCl₃', n: '氯化铝', cat: 'St', st: 's', sol: 'y', el: ['Al', 'Cl'], note: '' },
  { id: 'Al2SO43', f: 'Al₂(SO₄)₃', n: '硫酸铝', cat: 'St', st: 's', sol: 'y', el: ['Al', 'S', 'O'], note: '' },
  { id: 'AlNO33', f: 'Al(NO₃)₃', n: '硝酸铝', cat: 'St', st: 's', sol: 'y', el: ['Al', 'N', 'O'], dec: true, note: '受热分解' },
  { id: 'ZnCl2', f: 'ZnCl₂', n: '氯化锌', cat: 'St', st: 's', sol: 'y', el: ['Zn', 'Cl'], note: '' },
  { id: 'ZnNO32', f: 'Zn(NO₃)₂', n: '硝酸锌', cat: 'St', st: 's', sol: 'y', el: ['Zn', 'N', 'O'], dec: true, note: '受热分解' },
  { id: 'KCl', f: 'KCl', n: '氯化钾', cat: 'St', st: 's', sol: 'y', el: ['K', 'Cl'], note: '常见钾肥' },
  { id: 'K2SO4', f: 'K₂SO₄', n: '硫酸钾', cat: 'St', st: 's', sol: 'y', el: ['K', 'S', 'O'], note: '钾肥' },
  { id: 'KNO3', f: 'KNO₃', n: '硝酸钾', cat: 'St', st: 's', sol: 'y', el: ['K', 'N', 'O'], dec: true, note: '受热分解，黑火药成分' },
  { id: 'K2CO3', f: 'K₂CO₃', n: '碳酸钾', cat: 'St', st: 's', sol: 'y', el: ['K', 'C', 'O'], note: '草木灰的主要成分' },
  { id: 'KClO3', f: 'KClO₃', n: '氯酸钾', cat: 'St', st: 's', sol: 'y', el: ['K', 'Cl', 'O'], dec: true, note: '受热分解，制氧剂' },
  { id: 'KMnO4', f: 'KMnO₄', n: '高锰酸钾', cat: 'St', st: 's', sol: 'y', el: ['K', 'Mn', 'O'], dec: true, note: '紫黑色晶体，强氧化剂' },
  { id: 'K2MnO4', f: 'K₂MnO₄', n: '锰酸钾', cat: 'St', st: 's', sol: 'y', el: ['K', 'Mn', 'O'], note: '绿色固体' },
  { id: 'Na2SO4', f: 'Na₂SO₄', n: '硫酸钠', cat: 'St', st: 's', sol: 'y', el: ['Na', 'S', 'O'], note: '' },
  { id: 'NaNO3', f: 'NaNO₃', n: '硝酸钠', cat: 'St', st: 's', sol: 'y', el: ['Na', 'N', 'O'], note: '' },
  { id: 'Na2S', f: 'Na₂S', n: '硫化钠', cat: 'St', st: 's', sol: 'y', el: ['Na', 'S'], note: '水解显碱性' },
  { id: 'Na2SO3', f: 'Na₂SO₃', n: '亚硫酸钠', cat: 'St', st: 's', sol: 'y', el: ['Na', 'S', 'O'], note: '有还原性' },
  { id: 'NaClO', f: 'NaClO', n: '次氯酸钠', cat: 'St', st: 's', sol: 'y', el: ['Na', 'Cl', 'O'], note: '漂白液的有效成分' },
  { id: 'Na2SiO3', f: 'Na₂SiO₃', n: '硅酸钠', cat: 'St', st: 's', sol: 'y', el: ['Na', 'Si', 'O'], note: '水玻璃，矿物胶' },
  { id: 'NaAlO2', f: 'NaAlO₂', n: '偏铝酸钠', cat: 'St', st: 's', sol: 'y', el: ['Na', 'Al', 'O'], note: '' },
  { id: 'Na3PO4', f: 'Na₃PO₄', n: '磷酸钠', cat: 'St', st: 's', sol: 'y', el: ['Na', 'P', 'O'], note: '' },
  { id: 'NaBr', f: 'NaBr', n: '溴化钠', cat: 'St', st: 's', sol: 'y', el: ['Na', 'Br'], note: '' },
  { id: 'NaI', f: 'NaI', n: '碘化钠', cat: 'St', st: 's', sol: 'y', el: ['Na', 'I'], note: '' },
  { id: 'NaF', f: 'NaF', n: '氟化钠', cat: 'St', st: 's', sol: 'y', el: ['Na', 'F'], note: '' },
  { id: 'CaCl2_', f: '', n: '', cat: 'St', st: 's', sol: 'y', el: [], note: '' },
  { id: 'CaNO32', f: 'Ca(NO₃)₂', n: '硝酸钙', cat: 'St', st: 's', sol: 'y', el: ['Ca', 'N', 'O'], note: '可作氮肥' },
  { id: 'CaSO4', f: 'CaSO₄', n: '硫酸钙', cat: 'St', st: 's', sol: 'm', el: ['Ca', 'S', 'O'], note: '微溶，石膏的主要成分' },
  { id: 'CaCO3__', f: '', n: '', cat: 'St', st: 's', sol: 'n', el: [], note: '' },
  { id: 'BaSO4', f: 'BaSO₄', n: '硫酸钡', cat: 'St', st: 's', sol: 'n', el: ['Ba', 'S', 'O'], note: '白色沉淀，不溶于稀硝酸，可作钡餐' },
  { id: 'BaCO3', f: 'BaCO₃', n: '碳酸钡', cat: 'St', st: 's', sol: 'n', el: ['Ba', 'C', 'O'], note: '白色沉淀，溶于酸' },
  { id: 'BaCl2_', f: '', n: '', cat: 'St', st: 's', sol: 'y', el: [], note: '' },
  { id: 'BaNO32_', f: '', n: '', cat: 'St', st: 's', sol: 'y', el: [], note: '' },
  { id: 'MgCO3', f: 'MgCO₃', n: '碳酸镁', cat: 'St', st: 's', sol: 'n', el: ['Mg', 'C', 'O'], note: '白色沉淀' },
  { id: 'ZnCO3', f: 'ZnCO₃', n: '碳酸锌', cat: 'St', st: 's', sol: 'n', el: ['Zn', 'C', 'O'], note: '白色沉淀' },
  { id: 'AgCl', f: 'AgCl', n: '氯化银', cat: 'St', st: 's', sol: 'n', el: ['Ag', 'Cl'], note: '白色沉淀，不溶于稀硝酸' },
  { id: 'AgNO3_', f: '', n: '', cat: 'St', st: 's', sol: 'y', el: [], note: '' },
  { id: 'Ag2SO4', f: 'Ag₂SO₄', n: '硫酸银', cat: 'St', st: 's', sol: 'm', el: ['Ag', 'S', 'O'], note: '微溶' },
  { id: 'Ag2CO3', f: 'Ag₂CO₃', n: '碳酸银', cat: 'St', st: 's', sol: 'n', el: ['Ag', 'C', 'O'], note: '淡黄色沉淀' },
  { id: 'AgBr', f: 'AgBr', n: '溴化银', cat: 'St', st: 's', sol: 'n', el: ['Ag', 'Br'], note: '淡黄色沉淀，感光材料' },
  { id: 'AgI', f: 'AgI', n: '碘化银', cat: 'St', st: 's', sol: 'n', el: ['Ag', 'I'], note: '黄色沉淀，用于人工降雨' },
  { id: 'Ag2O', f: 'Ag₂O', n: '氧化银', cat: 'Oe', st: 's', sol: 'n', el: ['Ag', 'O'], note: '棕黑色固体' },
  { id: 'CuCO3', f: 'CuCO₃', n: '碳酸铜', cat: 'St', st: 's', sol: 'n', el: ['Cu', 'C', 'O'], note: '蓝绿色沉淀' },
  { id: 'CuOH2_', f: '', n: '', cat: 'Be', st: 's', sol: 'n', el: [], note: '' },
  { id: 'CuCl2_', f: '', n: '', cat: 'St', st: 's', sol: 'y', el: [], note: '' },
  { id: 'CuNO32_', f: '', n: '', cat: 'St', st: 's', sol: 'y', el: [], note: '' },
  { id: 'CuSO4_', f: '', n: '', cat: 'St', st: 's', sol: 'y', el: [], note: '' },
  { id: 'CuS', f: 'CuS', n: '硫化铜', cat: 'St', st: 's', sol: 'n', el: ['Cu', 'S'], note: '黑色沉淀' },
  { id: 'FeS', f: 'FeS', n: '硫化亚铁', cat: 'St', st: 's', sol: 'n', el: ['Fe', 'S'], note: '黑色固体，与酸反应生成 H₂S' },
  { id: 'NH4Cl_', f: '', n: '', cat: 'St', st: 's', sol: 'y', el: [], note: '' },
  { id: 'NH42SO4', f: '(NH₄)₂SO₄', n: '硫酸铵', cat: 'St', st: 's', sol: 'y', el: ['N', 'H', 'S', 'O'], note: '常见氮肥' },
  { id: 'NH42CO3', f: '(NH₄)₂CO₃', n: '碳酸铵', cat: 'St', st: 's', sol: 'y', el: ['N', 'H', 'C', 'O'], note: '受热分解' },
  { id: 'CaC2O4', f: 'CaC₂O₄', n: '草酸钙', cat: 'St', st: 's', sol: 'n', el: ['Ca', 'C', 'O'], note: '白色沉淀，难溶于水' },
  { id: 'BaSO3', f: 'BaSO₃', n: '亚硫酸钡', cat: 'St', st: 's', sol: 'n', el: ['Ba', 'S', 'O'], note: '白色沉淀，溶于酸' },
  { id: 'Ba3PO42', f: 'Ba₃(PO₄)₂', n: '磷酸钡', cat: 'St', st: 's', sol: 'n', el: ['Ba', 'P', 'O'], note: '白色沉淀' },
  { id: 'Ca3PO42', f: 'Ca₃(PO₄)₂', n: '磷酸钙', cat: 'St', st: 's', sol: 'n', el: ['Ca', 'P', 'O'], note: '白色沉淀，骨骼主要成分' },
  { id: 'Mg3N2', f: 'Mg₃N₂', n: '氮化镁', cat: 'St', st: 's', sol: 'x', el: ['Mg', 'N'], note: '黄绿色固体，与水反应生成氨气' },
  { id: 'CaS', f: 'CaS', n: '硫化钙', cat: 'St', st: 's', sol: 'y', el: ['Ca', 'S'], note: '' },
  { id: 'Al2S3', f: 'Al₂S₃', n: '硫化铝', cat: 'St', st: 's', sol: 'x', el: ['Al', 'S'], note: '遇水完全水解' },

  /* ---- 单质 / 非金属 ---- */
  { id: 'N2', f: 'N₂', n: '氮气', cat: 'Es', st: 'g', sol: 'n', el: ['N'], note: '空气的主要成分，性质稳定' },
  /* 其他：既不是酸/碱/盐，也不是氧化物、单质的常见物质（气体、有机物等），
   * 类别 cat:'Ot'，界面上用白色标签区分。 */
  { id: 'S', f: 'S', n: '硫', cat: 'Es', st: 's', sol: 'n', el: ['S'], note: '淡黄色固体，燃烧发出蓝紫色火焰' },
  { id: 'P', f: 'P', n: '红磷', cat: 'Es', st: 's', sol: 'n', el: ['P'], note: '红棕色固体，燃烧生成大量白烟' },
  { id: 'Si', f: 'Si', n: '硅', cat: 'Es', st: 's', sol: 'n', el: ['Si'], note: '半导体材料' },
  { id: 'Br2', f: 'Br₂', n: '溴', cat: 'Es', st: 'l', sol: 'm', el: ['Br'], note: '深红棕色液体，易挥发' },
  { id: 'I2', f: 'I₂', n: '碘', cat: 'Es', st: 's', sol: 'n', el: ['I'], note: '紫黑色固体，升华产生紫色蒸气' },
  { id: 'Mn', f: 'Mn', n: '锰', cat: 'Es', st: 's', sol: 'n', el: ['Mn'], note: '' },
  { id: 'Hg', f: 'Hg', n: '汞', cat: 'Es', st: 'l', sol: 'n', el: ['Hg'], note: '常温下唯一液态金属' }
];
/* 说明：氨气、甲烷、乙醇、乙炔等既不是氧化物也不属于酸/碱/盐/单质，
 * 类别在输出阶段统一改写成「其他」（cat:'Ot'，界面白色标签），见文件末尾的 CAT_FIX。 */

/* 去掉占位条目 */
const extras = EXTRA.filter(function (s) { return s.f && s.n; });

/* 生成反应里用到、但上面尚未列出的物质（补齐后即可解析这些反应） */
const MORE = [
  { id: 'CH3COONa', f: 'CH₃COONa', n: '醋酸钠', cat: 'St', st: 's', sol: 'y', el: ['C', 'H', 'O', 'Na'], note: '强碱弱酸盐，水解显碱性' },
  { id: 'CH3COO2Ca', f: '(CH₃COO)₂Ca', n: '醋酸钙', cat: 'St', st: 's', sol: 'y', el: ['C', 'H', 'O', 'Ca'], note: '' },
  { id: 'Na2C2O4', f: 'Na₂C₂O₄', n: '草酸钠', cat: 'St', st: 's', sol: 'y', el: ['Na', 'C', 'O'], note: '' },
  { id: 'Ag3PO4', f: 'Ag₃PO₄', n: '磷酸银', cat: 'St', st: 's', sol: 'n', el: ['Ag', 'P', 'O'], note: '黄色沉淀' },
  { id: 'Ag2S', f: 'Ag₂S', n: '硫化银', cat: 'St', st: 's', sol: 'n', el: ['Ag', 'S'], note: '黑色沉淀，难溶于酸' },
  { id: 'Ca(ClO)2', f: 'Ca(ClO)₂', n: '次氯酸钙', cat: 'St', st: 's', sol: 'y', el: ['Ca', 'Cl', 'O'], note: '漂白粉的有效成分' },
  { id: 'H2O2', f: 'H₂O₂', n: '过氧化氢', cat: 'Oe', st: 'l', sol: 'x', el: ['H', 'O'], note: '双氧水，易分解放出氧气，有氧化性' },
  { id: 'MnO2', f: 'MnO₂', n: '二氧化锰', cat: 'Oe', st: 's', sol: 'n', el: ['Mn', 'O'], note: '黑色粉末，常用作催化剂' },
  { id: 'HgO', f: 'HgO', n: '氧化汞', cat: 'Oe', st: 's', sol: 'n', el: ['Hg', 'O'], note: '红色固体，受热分解' },
  { id: 'KNO2', f: 'KNO₂', n: '亚硝酸钾', cat: 'St', st: 's', sol: 'y', el: ['K', 'N', 'O'], note: '' },
  { id: 'CaSiO3', f: 'CaSiO₃', n: '硅酸钙', cat: 'St', st: 's', sol: 'n', el: ['Ca', 'Si', 'O'], note: '玻璃、水泥的成分之一' },
  { id: 'CaHCO32', f: 'Ca(HCO₃)₂', n: '碳酸氢钙', cat: 'St', st: 's', sol: 'y', el: ['Ca', 'H', 'C', 'O'], note: '只存在于溶液中，受热分解' },
  { id: 'MgHCO32', f: 'Mg(HCO₃)₂', n: '碳酸氢镁', cat: 'St', st: 's', sol: 'y', el: ['Mg', 'H', 'C', 'O'], note: '只存在于溶液中' },
  { id: 'BaHCO32', f: 'Ba(HCO₃)₂', n: '碳酸氢钡', cat: 'St', st: 's', sol: 'y', el: ['Ba', 'H', 'C', 'O'], note: '可溶' },
  { id: 'CH3COO2Mg', f: '(CH₃COO)₂Mg', n: '醋酸镁', cat: 'St', st: 's', sol: 'y', el: ['C', 'H', 'O', 'Mg'], note: '' },
  { id: 'CH3COOK', f: 'CH₃COOK', n: '醋酸钾', cat: 'St', st: 's', sol: 'y', el: ['C', 'H', 'O', 'K'], note: '' },
  { id: 'CH3COO2Fe', f: '(CH₃COO)₂Fe', n: '醋酸亚铁', cat: 'St', st: 's', sol: 'y', el: ['C', 'H', 'O', 'Fe'], note: '' },
  { id: 'SiF4', f: 'SiF₄', n: '四氟化硅', cat: 'Oe', st: 'g', sol: 'x', el: ['Si', 'F'], note: '氢氟酸腐蚀玻璃的产物' },
  { id: 'CaC2', f: 'CaC₂', n: '碳化钙', cat: 'St', st: 's', sol: 'x', el: ['Ca', 'C'], note: '俗称电石，与水反应生成乙炔' },
  { id: 'C2H2', f: 'C₂H₂', n: '乙炔', cat: 'Oe', st: 'g', sol: 'm', el: ['C', 'H'], note: '可燃气体，氧炔焰用于焊接' },
  { id: 'Cu2OH2CO3', f: 'Cu₂(OH)₂CO₃', n: '碱式碳酸铜', cat: 'St', st: 's', sol: 'n', el: ['Cu', 'O', 'H', 'C'], note: '铜生锈的产物，俗称铜绿' },
  /* ---- 补齐静态反应表用到的物质（否则整条反应会被丢弃） ---- */
  { id: 'P', f: 'P', n: '红磷', cat: 'Es', st: 's', sol: 'n', el: ['P'], note: '红棕色固体，燃烧生成大量白烟' },
  { id: 'P2O5', f: 'P₂O₅', n: '五氧化二磷', cat: 'Oe', st: 's', sol: 'x', el: ['P', 'O'], note: '白色固体，强吸水性' },
  { id: 'Si', f: 'Si', n: '硅', cat: 'Es', st: 's', sol: 'n', el: ['Si'], note: '半导体材料' },
  { id: 'SiO2', f: 'SiO₂', n: '二氧化硅', cat: 'Oe', st: 's', sol: 'n', el: ['Si', 'O'], note: '沙子、石英的主要成分' },
  { id: 'Br2', f: 'Br₂', n: '溴', cat: 'Es', st: 'l', sol: 'm', el: ['Br'], note: '深红棕色液体，易挥发' },
  { id: 'I2', f: 'I₂', n: '碘', cat: 'Es', st: 's', sol: 'n', el: ['I'], note: '紫黑色固体，升华产生紫色蒸气' },
  { id: 'H2O2', f: 'H₂O₂', n: '过氧化氢', cat: 'Oe', st: 'l', sol: 'x', el: ['H', 'O'], note: '双氧水，易分解放出氧气' },
  { id: 'KClO3', f: 'KClO₃', n: '氯酸钾', cat: 'St', st: 's', sol: 'y', el: ['K', 'Cl', 'O'], dec: true, note: '受热分解，制氧剂' },
  { id: 'KMnO4', f: 'KMnO₄', n: '高锰酸钾', cat: 'St', st: 's', sol: 'y', el: ['K', 'Mn', 'O'], dec: true, note: '紫黑色晶体，强氧化剂' },
  { id: 'K2MnO4', f: 'K₂MnO₄', n: '锰酸钾', cat: 'St', st: 's', sol: 'y', el: ['K', 'Mn', 'O'], note: '绿色固体' },
  { id: 'MnO2', f: 'MnO₂', n: '二氧化锰', cat: 'Oe', st: 's', sol: 'n', el: ['Mn', 'O'], note: '黑色粉末，常用作催化剂' },
  { id: 'Hg', f: 'Hg', n: '汞', cat: 'Es', st: 'l', sol: 'n', el: ['Hg'], note: '常温下唯一液态金属' },
  { id: 'HgO', f: 'HgO', n: '氧化汞', cat: 'Oe', st: 's', sol: 'n', el: ['Hg', 'O'], note: '红色固体，受热分解' },
  { id: 'FeO', f: 'FeO', n: '氧化亚铁', cat: 'Oe', st: 's', sol: 'n', el: ['Fe', 'O'], note: '黑色粉末' },
  { id: 'KNO2', f: 'KNO₂', n: '亚硝酸钾', cat: 'St', st: 's', sol: 'y', el: ['K', 'N', 'O'], note: '' },
  { id: 'N2O', f: 'N₂O', n: '一氧化二氮', cat: 'Oe', st: 'g', sol: 'y', el: ['N', 'O'], note: '笑气' },
  { id: 'SiF4', f: 'SiF₄', n: '四氟化硅', cat: 'Oe', st: 'g', sol: 'x', el: ['Si', 'F'], note: '氢氟酸腐蚀玻璃的产物' },
  { id: 'CaC2', f: 'CaC₂', n: '碳化钙', cat: 'St', st: 's', sol: 'x', el: ['Ca', 'C'], note: '俗称电石，与水反应生成乙炔' },
  { id: 'C2H2', f: 'C₂H₂', n: '乙炔', cat: 'Oe', st: 'g', sol: 'm', el: ['C', 'H'], note: '可燃气体，氧炔焰用于焊接' },
  { id: 'Ag2O', f: 'Ag₂O', n: '氧化银', cat: 'Oe', st: 's', sol: 'n', el: ['Ag', 'O'], note: '棕黑色固体' },
  { id: 'Ag3PO4', f: 'Ag₃PO₄', n: '磷酸银', cat: 'St', st: 's', sol: 'n', el: ['Ag', 'P', 'O'], note: '黄色沉淀' },
  { id: 'Ag2S', f: 'Ag₂S', n: '硫化银', cat: 'St', st: 's', sol: 'n', el: ['Ag', 'S'], note: '黑色沉淀，难溶于酸' },
  { id: 'KNO3_', f: '', n: '', cat: 'St', st: 's', sol: 'y', el: [], note: '' },
  { id: 'CH4', f: 'CH₄', n: '甲烷', cat: 'Oe', st: 'g', sol: 'n', el: ['C', 'H'], note: '最简单的有机物，天然气主要成分' },
  { id: 'C2H5OH', f: 'C₂H₅OH', n: '乙醇', cat: 'Oe', st: 'l', sol: 'y', el: ['C', 'H', 'O'], note: '酒精，可作燃料' },
  { id: 'Na2ZnO2', f: 'Na₂ZnO₂', n: '锌酸钠', cat: 'St', st: 's', sol: 'y', el: ['Na', 'Zn', 'O'], note: '氢氧化锌溶于强碱的产物' },
  { id: 'NaNO2', f: 'NaNO₂', n: '亚硝酸钠', cat: 'St', st: 's', sol: 'y', el: ['Na', 'N', 'O'], note: '白色固体，有氧化性' },
  { id: 'NH4HSO3', f: 'NH₄HSO₃', n: '亚硫酸氢铵', cat: 'St', st: 's', sol: 'y', el: ['N', 'H', 'S', 'O'], note: '氨水吸收过量二氧化硫的产物' },
  { id: 'H2C2H2O4', f: '', n: '', cat: 'Ad', st: 's', sol: 'y', el: [], note: '' },
  { id: 'CaF2', f: 'CaF₂', n: '氟化钙', cat: 'St', st: 's', sol: 'n', el: ['Ca', 'F'], note: '萤石的主要成分，难溶于水' },
  { id: 'AgF', f: 'AgF', n: '氟化银', cat: 'St', st: 's', sol: 'y', el: ['Ag', 'F'], note: '可溶性银盐' },
  { id: 'BaC2O4', f: 'BaC₂O₄', n: '草酸钡', cat: 'St', st: 's', sol: 'n', el: ['Ba', 'C', 'O'], note: '白色沉淀' },
  { id: 'K2C2O4', f: 'K₂C₂O₄', n: '草酸钾', cat: 'St', st: 's', sol: 'y', el: ['K', 'C', 'O'], note: '' },
  { id: 'MnC2O4', f: 'MnC₂O₄', n: '草酸锰', cat: 'St', st: 's', sol: 'n', el: ['Mn', 'C', 'O'], note: '浅粉色沉淀' },
  { id: 'CH3COO2Fe', f: '(CH₃COO)₂Fe', n: '醋酸亚铁', cat: 'St', st: 's', sol: 'y', el: ['C', 'H', 'O', 'Fe'], note: '' },
  { id: 'CaF2_', f: '', n: '', cat: 'St', st: 's', sol: 'n', el: [], note: '' }
].filter(function (s) { return s.f && s.n; });
extras.push.apply(extras, MORE);

/* ---------------------------------------------------------------
 * 二、工具
 * ------------------------------------------------------------- */
const KEY = function (r) { return r.slice().sort().join('+'); };

function romanSub(n) {
  return { 2: '₂', 3: '₃', 4: '₄' }[n] || String(n);
}
const DIGITS = { 2: '₂', 3: '₃', 4: '₄', 5: '₅', 6: '₆' };
function sub(n) { return DIGITS[n] || String(n); }

/* 由阳离子 c 与阴离子 a 生成化学式（含角标）
 * 多原子离子（SO₄、CO₃、OH…）在需要下标时必须加括号 */
const POLY = {
  OH: 1, NO3: 1, ClO: 1, MnO4: 1, HCO3: 1, CH3COO: 1, AlO2: 1,
  SO4: 1, CO3: 1, SO3: 1, C2O4: 1, PO4: 1, SiO3: 1
};
/* 需要把酸根写在阳离子之前的酸根（与母表书写习惯一致） */
const REORDER_ANION = {
  SO4: 1, CO3: 1, NO3: 1, HCO3: 1, SO3: 1, C2O4: 1, CH3COO: 1, PO4: 1, SiO3: 1
};
function formulaOf(c, a) {
  var cn = c.charge, an = a.charge;
  var g = 1;
  for (var i = 2; i <= Math.min(cn, an); i++) if (cn % i === 0 && an % i === 0) g = i;
  var nc = an / g, na = cn / g;
  var cPart = c.f + (nc > 1 ? sub(nc) : '');
  var aPart;
  if (na > 1 && POLY[a.id]) aPart = '(' + a.f + ')' + sub(na);
  else aPart = a.f + (na > 1 ? sub(na) : '');
  /* 书写顺序与母表保持一致：
   * - 含氧酸根（SO₄²⁻、CO₃²⁻、NO₃⁻、CH₃COO⁻、PO₄³⁻、C₂O₄²⁻…）写在阳离子之前，
   *   如 Na₂CO₃ / Ca(NO₃)₂ / (CH₃COO)₂Ca；
   * - 次氯酸根、高锰酸根、偏铝酸根按 NaClO / KMnO₄ / NaAlO₂ 的写法，阳离子在前；
   * - 酸（H⁺）与单原子酸根（Cl⁻、F⁻、S²⁻…）按 HCl / MgCl₂ / FeS 书写。 */
  var polyAnion = na > 1 && POLY[a.id] && REORDER_ANION[a.id];
  if (polyAnion && c.id !== 'H') return aPart + cPart;
  return cPart + aPart;
}

/* 阳离子 + 阴离子 → 物质 id 名（与 data.js 中的命名习惯对齐） */
const SALT_ID = {
  'Na|Cl': 'NaCl', 'Na|CO3': 'Na2CO3', 'Na|SO4': 'Na2SO4', 'Na|NO3': 'NaNO3',
  'Na|HCO3': 'NaHCO3', 'Na|OH': 'NaOH', 'Na|S': 'Na2S', 'Na|SO3': 'Na2SO3',
  'Na|ClO': 'NaClO', 'Na|SiO3': 'Na2SiO3', 'Na|AlO2': 'NaAlO2', 'Na|PO4': 'Na3PO4',
  'Na|F': 'NaF', 'Na|Br': 'NaBr', 'Na|I': 'NaI', 'Na|CH3COO': 'CH3COONa',
  'K|Cl': 'KCl', 'K|OH': 'KOH', 'K|SO4': 'K2SO4', 'K|NO3': 'KNO3', 'K|CO3': 'K2CO3',
  'K|ClO3': 'KClO3', 'K|MnO4': 'KMnO4', 'K|HCO3': 'KHCO3',
  'NH4|Cl': 'NH4Cl', 'NH4|SO4': 'NH42SO4', 'NH4|NO3': 'NH4NO3',
  'NH4|HCO3': 'NH4HCO3', 'NH4|CO3': 'NH42CO3',
  'Ca|Cl': 'CaCl2', 'Ca|OH': 'Ca(OH)2', 'Ca|SO4': 'CaSO4', 'Ca|NO3': 'CaNO32',
  'Ca|CO3': 'CaCO3', 'Ca|C2O4': 'CaC2O4', 'Ca|PO4': 'Ca3PO42', 'Ca|S': 'CaS',
  'Mg|Cl': 'MgCl2', 'Mg|OH': 'Mg(OH)2', 'Mg|SO4': 'MgSO4', 'Mg|CO3': 'MgCO3',
  'Mg|NO3': 'MgNO32',
  'Al|Cl': 'AlCl3', 'Al|OH': 'Al(OH)3', 'Al|SO4': 'Al2SO43', 'Al|NO3': 'AlNO33',
  'Al|S': 'Al2S3',
  'Zn|Cl': 'ZnCl2', 'Zn|OH': 'ZnOH2', 'Zn|SO4': 'ZnSO4', 'Zn|CO3': 'ZnCO3',
  'Ca|HCO3': 'CaHCO32', 'Mg|HCO3': 'MgHCO32', 'Ba|HCO3': 'BaHCO32',
  'Ca|CH3COO': 'CH3COO2Ca', 'Mg|CH3COO': 'CH3COO2Mg', 'K|CH3COO': 'CH3COOK',
  'Zn|NO3': 'ZnNO32',
  'Fe2|Cl': 'FeCl2', 'Fe2|OH': 'FeOH2', 'Fe2|SO4': 'FeSO4', 'Fe2|NO3': 'FeNO32',
  'Fe2|S': 'FeS',
  'Fe3|Cl': 'FeCl3', 'Fe3|OH': 'Fe(OH)3', 'Fe3|SO4': 'Fe2SO43', 'Fe3|NO3': 'FeNO33',
  'Cu|Cl': 'CuCl2', 'Cu|OH': 'Cu(OH)2', 'Cu|SO4': 'CuSO4', 'Cu|NO3': 'CuNO32',
  'Cu|CO3': 'CuCO3', 'Cu|S': 'CuS',
  'Ba|Cl': 'BaCl2', 'Ba|OH': 'Ba(OH)2', 'Ba|SO4': 'BaSO4', 'Ba|CO3': 'BaCO3',
  'Ba|NO3': 'BaNO32', 'Ba|SO3': 'BaSO3', 'Ba|PO4': 'Ba3PO42',
  'Ag|Cl': 'AgCl', 'Ag|NO3': 'AgNO3', 'Ag|SO4': 'Ag2SO4', 'Ag|CO3': 'Ag2CO3',
  'Ag|Br': 'AgBr', 'Ag|I': 'AgI',
  'H|Cl': 'HCl', 'H|SO4': 'H2SO4', 'H|NO3': 'HNO3', 'H|F': 'HF', 'H|CO3': 'H2CO3',
  'H|S': 'H2S', 'H|SO3': 'H2SO3', 'H|ClO': 'HClO', 'H|CH3COO': 'CH3COOH',
  'H|C2O4': 'H2C2O4', 'H|Br': 'HBr', 'H|I': 'HI', 'H|PO4': 'H3PO4', 'H|OH': 'H2O',
  'H|SiO3': 'H2SiO3', 'H|MnO4': 'HMnO4', 'H|AlO2': 'HAlO2'
};
/* 补充：H|OH → H2O 是特例（氢离子 + 氢氧根） */
function subIdOf(ci, ai) {
  if (ci === 'H' && ai === 'OH') return 'H2O';
  if (ci === 'NH4' && ai === 'OH') return 'NH3H2O';   // 铵根 + 氢氧根实际是一水合氨
  var k = ci + '|' + ai;
  if (COMPOUND[k]) return COMPOUND[k].id;
  return SALT_ID[k] || ('m_' + ci + '_' + ai);
}

/* 由 id 在“全部物质”里查 */
const ALL = {};
DB.SUBSTANCES.forEach(function (s) { ALL[s.id] = s; });
extras.forEach(function (s) { ALL[s.id] = s; });

/* ---------------- 化学式 → 规范 id / 名称 ----------------
 * 母表里已有确切物质的，一律复用它的 id 与名称，避免同一个化学式出现两个 id
 * （例如 Ca(NO₃)₂ 曾经同时存在 CaNO32 与 Ca(NO3)2，界面显示时解析不到名称）。 */
const SUBDIGIT = { '₀': '0', '₁': '1', '₂': '2', '₃': '3', '₄': '4', '₅': '5', '₆': '6', '₇': '7', '₈': '8', '₉': '9' };
/* 归一化化学式：统一角标与括号、忽略书写顺序，便于同一物质互相匹配。
 * 例：Ca(NO3)2 与 (NO3)2Ca 视为同一物质。 */
function normF(f) {
  if (!f) return '';
  var s = String(f).replace(/[₀-₉]/g, function (c) { return SUBDIGIT[c]; })
    .replace(/\s+/g, '').replace(/（/g, '(').replace(/）/g, ')');
  /* 拆成“元素/括号片段 + 个数”，排序后拼接，从而忽略顺序 */
  var parts = s.match(/\((?:[^()]|\([^()]*\))*\)\d*|[A-Z][a-z]?\d*|\([^)]*\)/g);
  if (!parts) return s;
  return parts.map(function (p) { return p; }).sort().join('');
}
const BY_FORMULA = {};
Object.keys(ALL).forEach(function (id) {
  var s = ALL[id];
  if (!s || !s.f) return;
  var k = normF(s.f);
  if (!BY_FORMULA[k]) BY_FORMULA[k] = s;
});
/* 高中范围内不存在 / 不应出现的化学式：生成时直接排除 */
const BAD_FORMULA = {};
['NH4OH', 'HHCO3', 'HMnO4', 'HAlO2', 'HCN', 'AgOH', 'Al2S3', 'Fe2S3',
  'Al2(CO3)3', 'Fe2(CO3)3', 'CuCO3', 'FeCO3', 'CuI2', 'FeI3', 'CuSO3',
  'FeSO3', 'Al2(SO3)3', 'Fe2(SO3)3', 'Al(HCO3)3', 'Cu(HCO3)2'
].forEach(function (x) { BAD_FORMULA[normF(x)] = 1; });

/* ---------------- 双水解 ----------------
 * 弱碱阳离子（Al³⁺、Fe³⁺）与弱酸酸根（CO₃²⁻、HCO₃⁻、AlO₂⁻、SiO₃²⁻、S²⁻、SO₃²⁻）
 * 在同一溶液中会互相促进水解，反应进行到底，生成氢氧化物沉淀与气体/弱酸：
 *     2Al³⁺ + 3CO₃²⁻ + 3H₂O = 2Al(OH)₃↓ + 3CO₂↑
 * 高中有明确要求掌握的就是这一组；这里统一用“双水解”反应类型单独生成，
 * 并从复分解穷举里排除这些离子对，避免出现写成 Al₂(CO₃)₃ 的错误产物。 */
const HYDRO_CATIONS = ['Al', 'Fe3'];
const HYDRO_ANIONS = ['CO3', 'HCO3', 'AlO2', 'SiO3', 'S', 'SO3'];
const HYDRO = {};
HYDRO_CATIONS.forEach(function (ci) {
  HYDRO_ANIONS.forEach(function (ai) {
    HYDRO[ci + '|' + ai] = 1;
    HYDRO[ai + '|' + ci] = 1;
  });
});

/* 由离子 id 找它的元素组成 */
function ionEls(ci, ai) {
  var c = findCation(ci), a = findAnion(ai);
  return elsOf(c || { id: ci, el: null }, a || { id: ai });
}


/* 酸根的中文化名：盐的名字 = 酸根名 + 阳离子名（如 SO₄²⁻ + Ca²⁺ → 硫酸钙） */
const ANION_CN = {
  OH: '氢氧化', SO4: '硫酸', CO3: '碳酸', NO3: '硝酸', HCO3: '碳酸氢',
  SO3: '亚硫酸', ClO: '次氯酸', MnO4: '高锰酸', AlO2: '偏铝酸',
  PO4: '磷酸', SiO3: '硅酸', F: '氟化', Cl: '氯化', Br: '溴化',
  I: '碘化', S: '硫化', CH3COO: '醋酸', C2O4: '草酸'
};
/* 酸的名字单独给（H⁺ + 酸根） */
const ACID_CN = {
  Cl: '盐酸', SO4: '硫酸', NO3: '硝酸', F: '氢氟酸', S: '氢硫酸', CO3: '碳酸',
  SO3: '亚硫酸', ClO: '次氯酸', CH3COO: '醋酸', C2O4: '草酸', Br: '氢溴酸',
  I: '氢碘酸', PO4: '磷酸', SiO3: '硅酸', MnO4: '高锰酸', AlO2: '偏铝酸'
};

/* 物质信息（优先取母表，其次取 data.js 的 SUB_INDEX） */
function infoOf(id) {
  if (ALL[id]) return ALL[id];
  if (DB.SUB_INDEX[id]) return DB.SUB_INDEX[id];
  return null;
}
function byFormula(f) { return f && BY_FORMULA[normF(f)] ? BY_FORMULA[normF(f)] : null; }
function adoptId(ci, ai) {
  var hit = byFormula(formulaOf(
    CATIONS_IDX[ci] || findCation(ci), ANIONS_IDX[ai] || findAnion(ai)));
  return hit ? hit.id : null;
}

/* 元素组成推断：阳离子元素 + 阴离子元素 */
function elsOf(c, a) {
  var el = [];
  function add(x) { if (x && el.indexOf(x) < 0) el.push(x); }
  if (c.el) add(c.el);
  else if (c.id === 'NH4') { add('N'); add('H'); }
  else if (c.id === 'Fe2' || c.id === 'Fe3') add('Fe');
  else if (c.id === 'Cu1' || c.id === 'Cu') add('Cu');
  else add(c.id);
  var map = {
    OH: ['O', 'H'], SO4: ['S', 'O'], CO3: ['C', 'O'], NO3: ['N', 'O'],
    HCO3: ['H', 'C', 'O'], SO3: ['S', 'O'], ClO: ['Cl', 'O'],
    CH3COO: ['C', 'H', 'O'], C2O4: ['C', 'O'], MnO4: ['Mn', 'O'],
    AlO2: ['Al', 'O'], PO4: ['P', 'O'], SiO3: ['Si', 'O']
  };
  (map[a.id] || [a.id]).forEach(add);
  return el;
}

/* 先把「阳离子 × 阴离子」能构成、但母表里没有的物质全部登记，
 * 保证任何组合都能解析，并且带上完整性质（类别/状态/溶解性/元素组成/说明）。
 * 注意：必须放在 solOf / formulaOf 定义之后执行。 */
const COMPOUND = {};
function buildCompoundIndex() {
  CATIONS.forEach(function (cc) {
    ANIONS.forEach(function (aa) {
      if (cc.id === 'H' && aa.id === 'OH') return;      // H⁺ + OH⁻ = 水，单独处理
      var key = cc.id + '|' + aa.id;
      var f = formulaOf(cc, aa);
      if (BAD_FORMULA[normF(f)]) return;                  // 不存在/双水解的化学式，直接不生成
      /* 阳离子与阴离子含同一元素（Al/AlO₂、Mn/MnO₄、铵/偏铝酸铵等）的复盐高中不涉及，跳过 */
      if (['AlO2', 'MnO4'].indexOf(aa.id) >= 0 && cc.id !== 'H' &&
        (cc.id === 'Al' || cc.id === 'Mn' || cc.id === 'NH4')) return;
      var canon = byFormula(f);
      if (canon) return;                                 // 母表里已有确切物质，直接复用
      var sol = solOf(cc.id, aa.id);
      var isAcid = cc.id === 'H';
      var isBase = aa.id === 'OH';
      var isStrongAcid = isAcid && ['Cl', 'SO4', 'NO3', 'Br', 'I'].indexOf(aa.id) >= 0;
      var cn;
      if (isAcid) cn = (ACID_CN[aa.id] || (aa.n.replace(/根$/, '') + '酸'));
      else {
        // 盐名 = 酸根名 + 阳离子名，去掉“根”字（铵根 + 硫酸根 → 硫酸铵）
        var cationCn = cc.n.replace('离子', '').replace(/根$/, '');
        cn = (ANION_CN[aa.id] || aa.n.replace(/根$/, '')) + cationCn;
      }
      /* 次氯酸盐很不稳定，高中不涉及它们的溶液复分解；氨基/铵 + 氢氧根实际是一水合氨 */
      var unstable = isUnstablePair(cc.id, aa.id);
      var info = {
        id: 'm_' + cc.id + '_' + aa.id,
        f: f,
        n: cn,
        cat: isAcid ? 'Ad' : (isBase ? 'Be' : 'St'),
        st: isStrongAcid ? 'l' : 's',
        sol: isStrongAcid ? 'y' : sol,
        el: elsOf(cc, aa),
        note: (sol === 'n' ? '难溶（沉淀）' : (sol === 'm' ? '微溶' : '')),
        unstable: unstable || undefined,
        derived: true
      };
      if (unstable) info.note = (info.note ? info.note + '；' : '') + '只作为产物出现，不参与溶液中的复分解';
      COMPOUND[key] = info;
      ALL[info.id] = info;
      BY_FORMULA[normF(f)] = info;
    });
  });
}
function findCation(id) { for (var i = 0; i < CATIONS.length; i++) if (CATIONS[i].id === id) return CATIONS[i]; return null; }
function findAnion(id) { for (var i = 0; i < ANIONS.length; i++) if (ANIONS[i].id === id) return ANIONS[i]; return null; }
const CATIONS_IDX = {}, ANIONS_IDX = {};
function buildIonIndex() {
  for (var i = 0; i < CATIONS.length; i++) CATIONS_IDX[CATIONS[i].id] = CATIONS[i];
  for (var j = 0; j < ANIONS.length; j++) ANIONS_IDX[ANIONS[j].id] = ANIONS[j];
}

/* ---------------------------------------------------------------
 * 三、复分解反应：阳离子 × 阴离子 穷举
 * ------------------------------------------------------------- */
const CATIONS = IONS.CATIONS, ANIONS = IONS.ANIONS;
const RX = [];                                        // 生成的反应
const seen = {};                                      // 去重
function push(rx, prio) {
  if (rx.t === '分解') return;          // 按需求：去除所有分解反应
  var k = KEY(rx.r) + '=>' + KEY(rx.p);
  if (seen[k]) return;
  seen[k] = 1;
  rx.prio = prio || 2;          // 1 = 静态表（经典反应，必须保留）；2 = 离子穷举
  RX.push(rx);
}

/* 溶解性判定：返回 'y' | 'm' | 'n' | 'x'（遇水反应/不存在） */
const INSOLUBLE = {
  'Mg|OH': 'n', 'Al|OH': 'n', 'Zn|OH': 'n', 'Fe2|OH': 'n', 'Fe3|OH': 'n',
  'Cu|OH': 'n', 'Ba|SO4': 'n', 'Ag|Cl': 'n', 'Ag|Br': 'n', 'Ag|I': 'n',
  'Ca|CO3': 'n', 'Ba|CO3': 'n', 'Mg|CO3': 'n', 'Zn|CO3': 'n', 'Ag|CO3': 'n',
  'Cu|S': 'n', 'Fe2|S': 'n', 'Ca|C2O4': 'n', 'Ba|SO3': 'n',
  'Ba|PO4': 'n', 'Ca|PO4': 'n', 'Al|S': 'x', 'Ag|OH': 'x',
  'Cu|CO3': 'x', 'Fe3|CO3': 'x', 'Al|CO3': 'x', 'Fe2|CO3': 'x', 'Cu|I': 'x',
  'Fe3|I': 'x', 'Al|SO3': 'x', 'Fe3|SO3': 'x', 'Al|HCO3': 'x', 'Cu|HCO3': 'x',
  'Fe3|S': 'x', 'Zn|S': 'n', 'Cu|SO3': 'x', 'Ag|S': 'n', 'Cu|Br': 'y'
};
const MICRO = { 'Ca|SO4': 'm', 'Ag|SO4': 'm', 'Ca|OH': 'm' };
function solOf(ci, ai) {
  var k = ci + '|' + ai;
  if (INSOLUBLE[k]) return INSOLUBLE[k];
  if (MICRO[k]) return MICRO[k];
  if (ai === 'OH') {
    if (ci === 'Na' || ci === 'K' || ci === 'Ba' || ci === 'NH4') return 'y';
    if (ci === 'Ca') return 'm';
    return 'n';
  }
  /* 氟化物：NaF/KF/NH₄F/AgF/HF 可溶，其余（MgF₂/CaF₂/BaF₂ 等）难溶 */
  if (ai === 'F') return (ci === 'Na' || ci === 'K' || ci === 'NH4' || ci === 'Ag' || ci === 'H') ? 'y' : 'n';
  /* 醋酸盐：绝大多数可溶，仅 Ag⁺ 微溶 */
  if (ai === 'CH3COO') return (ci === 'Ag') ? 'm' : 'y';
  /* 草酸盐：碱金属、铵、氢、铁、镁可溶；Ca/Ba/Zn/Cu/Ag 难溶 */
  if (ai === 'C2O4') {
    if (ci === 'Na' || ci === 'K' || ci === 'NH4' || ci === 'H' || ci === 'Fe2' || ci === 'Fe3' || ci === 'Mg') return 'y';
    return 'n';
  }
  /* 硅酸盐：只有碱金属与铵可溶 */
  if (ai === 'SiO3') return (ci === 'Na' || ci === 'K' || ci === 'NH4') ? 'y' : 'n';
  /* 磷酸盐：碱金属、铵、氢可溶；钙微溶；其余难溶 */
  if (ai === 'PO4') {
    if (ci === 'Na' || ci === 'K' || ci === 'NH4' || ci === 'H') return 'y';
    if (ci === 'Ca') return 'm';
    return 'n';
  }
  /* 硫化物：碱金属、铵、钙、钡可溶，其余难溶 */
  if (ai === 'S') return (ci === 'Na' || ci === 'K' || ci === 'NH4' || ci === 'Ca' || ci === 'Ba') ? 'y' : 'n';
  /* 亚硫酸盐：碱金属、铵、氢可溶，其余难溶 */
  if (ai === 'SO3') return (ci === 'Na' || ci === 'K' || ci === 'NH4' || ci === 'H') ? 'y' : 'n';
  /* 碳酸氢盐：碱金属、铵、钙、镁、钡可溶，其余遇水分解 */
  if (ai === 'HCO3') {
    return (ci === 'Na' || ci === 'K' || ci === 'NH4' || ci === 'Ca' || ci === 'Mg' || ci === 'Ba' || ci === 'H') ? 'y' : 'x';
  }
  return 'y';
}

/* 由离子直接构造一个物质信息（用于母表中未列出的产物） */
/* 高中范围内“只作为产物出现、不作为反应物”的物质：
 * 次氯酸银/铝/铁/铜极不稳定，铵根 + 氢氧根实际是一水合氨 */
function isUnstablePair(ci, ai) {
  if (ai === 'OH' && ci === 'NH4') return true;
  if (ai === 'ClO' && ['Ag', 'Al', 'Fe2', 'Fe3', 'Cu'].indexOf(ci) >= 0) return true;
  return false;
}
function makeInfo(ci, ai, c, a) {
  var id = subIdOf(ci, ai);
  var exist = infoOf(id);
  if (exist) return exist;
  var el = [];
  [c.el || c.id, a.id].forEach(function (x) {
    var s = infoOf(x);
    if (s && s.el) s.el.forEach(function (e) { if (el.indexOf(e) < 0) el.push(e); });
  });
  return {
    id: id, f: formulaOf(c, a), n: c.n.replace('离子', '') + a.n.replace('根', '') + '（推算）',
    cat: 'St', st: solOf(ci, ai) === 'n' ? 's' : 's', sol: solOf(ci, ai), el: el, note: '', derived: true
  };
}

/* 复分解：两两交换成分 */
buildIonIndex();
buildCompoundIndex();
for (var i = 0; i < CATIONS.length; i++) {
  for (var j = 0; j < ANIONS.length; j++) {
    var c1 = CATIONS[i], a1 = ANIONS[j];
    if (c1.id === 'H' && a1.id === 'OH') continue;   // H + OH = H2O 单独处理
    if (c1.id === 'H' && (a1.id === 'CO3' || a1.id === 'SO3' || a1.id === 'S')) continue; // H2CO3/H2SO3/H2S 不稳定
    var id1 = subIdOf(c1.id, a1.id);
    var s1 = infoOf(id1);
    if (!s1) continue;                               // 母表里没有这种物质就不参与
    if (isUnstablePair(c1.id, a1.id)) continue;      // 不稳定的盐不作为反应物
    for (var k = 0; k < CATIONS.length; k++) {
      for (var l = 0; l < ANIONS.length; l++) {
        if (i === k && j === l) continue;
        var c2 = CATIONS[k], a2 = ANIONS[l];
        if (c2.id === 'H' && a2.id === 'OH') continue;
        if (c2.id === 'H' && (a2.id === 'CO3' || a2.id === 'SO3' || a2.id === 'S')) continue;
        var id2 = subIdOf(c2.id, a2.id);
        var s2 = infoOf(id2);
        if (!s2) continue;
        if (isUnstablePair(c2.id, a2.id)) continue;     // 不稳定的盐不作为反应物
        /* 交换后 */
        if (c1.id === c2.id || a1.id === a2.id) continue;   // 同一离子不构成交换
        var p1id = subIdOf(c1.id, a2.id), p2id = subIdOf(c2.id, a1.id);
        var sol1 = solOf(c1.id, a2.id), sol2 = solOf(c2.id, a1.id);
        var t1 = infoOf(p1id) || makeInfo(c1.id, a2.id, c1, a2);
        var t2 = infoOf(p2id) || makeInfo(c2.id, a1.id, c2, a1);
        /* 反应发生的条件：生成沉淀 / 微溶物 / 气体 / 水。
         * 复分解的必要条件：两种反应物都必须可溶（难溶物只有与酸反应才溶解），
         * 且生成物中至少有一种是沉淀、气体或水。 */
        var GAS_SET = { CO2: 1, SO2: 1, H2S: 1, NH3: 1 };
        var gas = { CO3: 'CO2', HCO3: 'CO2', SO3: 'SO2', S: 'H2S' };
        var sol1r = solOf(c1.id, a1.id), sol2r = solOf(c2.id, a2.id);
        if (sol1r === 'n' || sol2r === 'n') continue;     // 难溶物不参与溶液中的复分解
        if (sol1r === 'x' || sol2r === 'x') continue;     // 不存在 / 遇水分解（双水解）的物质
        if (s1.unstable || s2.unstable) continue;         // 只作为产物出现的物质不作为反应物
        /* 双水解：由 buildDoubleHydrolysis 单独生成，这里跳过对应的离子对 */
        if (HYDRO[c1.id + '|' + a2.id] || HYDRO[c2.id + '|' + a1.id]) continue;
        var okReason = null;
        // 只有生成难溶物（沉淀）或气体/水才算发生反应；微溶物不足以驱动复分解
        if (sol1 === 'n' || sol2 === 'n') okReason = '沉淀';
        if (!okReason) {
          var pIds = [c1.id === 'H' ? gas[a2.id] : null, c2.id === 'H' ? gas[a1.id] : null];
          pIds.forEach(function (g) { if (g) okReason = okReason || '气体'; });
          if (c1.id === 'H' && a2.id === 'OH') okReason = '中和';
          if (c2.id === 'H' && a1.id === 'OH') okReason = '中和';
        }
        if (!okReason) continue;
        /* 组装产物：酸分解特例 */
        var prods = [], cond = '';
        function pushProd(acidIon, baseCation, anId, otherIon) {
          // 生成酸时若酸不稳定则拆成气体 + 水
          if (acidIon === 'H') {
            if (anId === 'CO3') { prods.push('CO2'); prods.push('H2O'); return; }
            if (anId === 'HCO3') { prods.push('CO2'); prods.push('H2O'); return; }
            if (anId === 'SO3') { prods.push('SO2'); prods.push('H2O'); return; }
            if (anId === 'S') { prods.push('H2S'); return; }
            if (anId === 'OH') { prods.push('H2O'); return; }
          }
          prods.push(subIdOf(acidIon, anId));
        }
        prods = [];
        pushProd(c1.id === 'H' ? 'H' : c1.id, null, a2.id);
        if (c2.id === 'H') pushProd('H', null, a1.id);
        else prods.push(subIdOf(c2.id, a1.id));
        // 去重（如两个产物都是 H2O）
        var uniq = [];
        prods.forEach(function (p) { if (p && uniq.indexOf(p) < 0 && !(p === 'H2O' && uniq.indexOf('H2O') >= 0)) uniq.push(p); });
        prods = uniq;
        // 过滤掉推算不出来的产物
        var keep = true;
        prods.forEach(function (p) { if (!infoOf(p)) keep = false; });
        if (!keep) continue;
        // 产物不能和反应物相同
        var rr = [id1, id2];
        if (prods.some(function (p) { return rr.indexOf(p) >= 0 && p.length > 3; })) { /* 允许 H2O 等 */ }
        var nm = okReason === '中和' ? '中和反应' : (okReason === '沉淀' ? '复分解反应（生成沉淀）' : '复分解反应（生成气体与水）');
        push({ r: rr, p: prods, c: cond, nm: nm, t: '复分解' });
      }
    }
  }
}

/* ---------------------------------------------------------------
 * 四、静态反应族（初高中常见，含氧化还原、分解、置换等）
 * ------------------------------------------------------------- */
const T = [
  /* 酸 + 金属 → 盐 + H2 */
  ['置换', 'Zn+HCl>ZnCl2+H2', '金属与酸反应'],
  ['置换', 'Fe+HCl>FeCl2+H2', '金属与酸反应'],
  ['置换', 'Mg+HCl>MgCl2+H2', '金属与酸反应'],
  ['置换', 'Al+HCl>AlCl3+H2', '金属与酸反应'],
  ['置换', 'Zn+H2SO4>ZnSO4+H2', '实验室制氢气'],
  ['置换', 'Fe+H2SO4>FeSO4+H2', '金属与酸反应'],
  ['置换', 'Mg+H2SO4>MgSO4+H2', '金属与酸反应'],
  ['置换', 'Al+H2SO4>Al2SO43+H2', '金属与酸反应'],
  /* 金属 + 盐（置换） */
  ['置换', 'Fe+CuSO4>FeSO4+Cu', '铁与硫酸铜溶液反应（湿法炼铜）'],
  ['置换', 'Zn+CuSO4>ZnSO4+Cu', '金属置换反应'],
  ['置换', 'Zn+CuCl2>ZnCl2+Cu', '金属置换反应'],
  ['置换', 'Fe+CuCl2>FeCl2+Cu', '金属置换反应'],
  ['置换', 'Cu+AgNO3>CuNO32+Ag', '铜置换银'],
  ['置换', 'Fe+AgNO3>FeNO32+Ag', '铁置换银'],
  ['置换', 'Zn+AgNO3>ZnNO32+Ag', '锌置换银'],
  ['置换', 'Mg+ZnSO4>MgSO4+Zn', '镁置换锌'],
  ['置换', 'Mg+FeSO4>MgSO4+Fe', '镁置换铁'],
  ['置换', 'Fe+Fe2SO43>FeSO4', '铁与硫酸铁反应'],
  ['置换', 'Cu+Fe2SO43>FeSO4+CuSO4', '铜与硫酸铁反应'],
  /* 金属 + 氧气 */
  ['化合', 'Fe+O2>Fe3O4@点燃', '铁在氧气中燃烧'],
  ['化合', 'Cu+O2>CuO@加热', '铜在空气中加热'],
  ['化合', 'Al+O2>Al2O3', '铝表面氧化'],
  ['化合', 'Mg+O2>MgO@点燃', '镁条燃烧'],
  ['化合', 'Na+O2>Na2O', '钠在空气中氧化'],
  ['化合', 'Na+O2>Na2O2@点燃', '钠在氧气中燃烧'],
  ['化合', 'Zn+O2>ZnO@加热', '锌在空气中氧化'],
  ['化合', 'K+O2>KO2@点燃', '钾在氧气中燃烧'],
  ['化合', 'C+O2>CO2@点燃', '碳充分燃烧'],
  ['化合', 'C+O2>CO@点燃（氧气不足）', '碳不充分燃烧'],
  ['化合', 'H2+O2>H2O@点燃', '氢气燃烧'],
  ['化合', 'H2+Cl2>HCl@点燃', '氢气在氯气中燃烧'],
  ['化合', 'S+O2>SO2@点燃', '硫在氧气中燃烧'],
  ['化合', 'P+O2>P2O5@点燃', '红磷燃烧（测定空气中氧气含量）'],
  ['化合', 'N2+O2>NO@放电', '氮气与氧气在放电条件下反应'],
  ['化合', 'NO+O2>NO2', '一氧化氮被氧化'],
  ['化合', 'N2+H2>NH3@高温高压催化剂', '工业合成氨'],
  ['化合', 'Si+O2>SiO2@加热', '硅在氧气中燃烧'],
  ['化合', 'Cu+O2+CO2+H2O>Cu2OH2CO3@潮湿空气', '铜生锈'],
  /* 非金属氧化物 + 水 */
  /* 按需求去除「CO₂ + H₂O → H₂CO₃」：碳酸极不稳定，该反应在题库中不收录 */
  ['化合', 'SO2+H2O>H2SO3', '二氧化硫溶于水'],
  ['化合', 'SO3+H2O>H2SO4', '三氧化硫与水反应'],
  ['化合', 'NO2+H2O>HNO3+NO', '二氧化氮与水反应'],
  ['化合', 'P2O5+H2O>H3PO4', '五氧化二磷吸水'],
  ['化合', 'Na2O+H2O>NaOH', '氧化钠与水反应'],
  ['化合', 'Na2O2+H2O>NaOH+O2', '过氧化钠与水反应'],
  ['化合', 'Na2O2+CO2>Na2CO3+O2', '过氧化钠与二氧化碳反应'],
  ['化合', 'CaO+H2O>Ca(OH)2', '生石灰与水反应（放热）'],
  ['化合', 'BaO+H2O>Ba(OH)2', '氧化钡与水反应'],
  ['化合', 'Mg3N2+H2O>Mg(OH)2+NH3', '氮化镁与水反应'],
  ['化合', 'Al2S3+H2O>Al(OH)3+H2S', '硫化铝水解'],
  /* 碱 + 非金属氧化物 */
  ['复分解', 'NaOH+CO2>Na2CO3+H2O', '吸收二氧化碳'],
  ['复分解', 'NaOH+SO2>Na2SO3+H2O', '吸收二氧化硫'],
  ['复分解', 'NaOH+SO3>Na2SO4+H2O', '吸收三氧化硫'],
  ['复分解', 'KOH+CO2>K2CO3+H2O', '吸收二氧化碳'],
  ['复分解', 'Ca(OH)2+CO2>CaCO3+H2O', '检验二氧化碳'],
  ['复分解', 'Ba(OH)2+CO2>BaCO3+H2O', '吸收二氧化碳'],
  ['复分解', 'NH3H2O+CO2>NH4HCO3', '氨水吸收二氧化碳'],
  ['复分解', 'NaOH+SiO2>Na2SiO3+H2O', '二氧化硅与碱反应'],
  ['复分解', 'NaOH+Al2O3>NaAlO2+H2O', '两性氧化物与碱反应'],
  ['复分解', 'NaOH+Al(OH)3>NaAlO2+H2O', '两性氢氧化物与碱反应'],
  /* 酸 + 金属氧化物 */
  ['复分解', 'HCl+Fe2O3>FeCl3+H2O', '除铁锈'],
  ['复分解', 'HCl+CuO>CuCl2+H2O', '黑色氧化铜溶解'],
  ['复分解', 'HCl+MgO>MgCl2+H2O', '金属氧化物与酸反应'],
  ['复分解', 'HCl+CaO>CaCl2+H2O', '金属氧化物与酸反应'],
  ['复分解', 'HCl+ZnO>ZnCl2+H2O', '金属氧化物与酸反应'],
  ['复分解', 'HCl+Al2O3>AlCl3+H2O', '两性氧化物与酸反应'],
  ['复分解', 'H2SO4+Fe2O3>Fe2SO43+H2O', '金属氧化物与酸反应'],
  ['复分解', 'H2SO4+CuO>CuSO4+H2O', '金属氧化物与酸反应'],
  ['复分解', 'H2SO4+MgO>MgSO4+H2O', '金属氧化物与酸反应'],
  ['复分解', 'H2SO4+ZnO>ZnSO4+H2O', '金属氧化物与酸反应'],
  ['复分解', 'H2SO4+Al2O3>Al2SO43+H2O', '两性氧化物与酸反应'],
  ['复分解', 'HNO3+CuO>CuNO32+H2O', '金属氧化物与酸反应'],
  ['复分解', 'HNO3+Fe2O3>FeNO33+H2O', '金属氧化物与酸反应'],
  ['复分解', 'HNO3+MgO>MgNO32+H2O', '金属氧化物与酸反应'],
  /* 酸 + 碱（中和） */
  ['中和', 'HCl+NaOH>NaCl+H2O', '中和反应'],
  ['中和', 'HCl+KOH>KCl+H2O', '中和反应'],
  ['中和', 'HCl+Ba(OH)2>BaCl2+H2O', '中和反应'],
  ['中和', 'HCl+Ca(OH)2>CaCl2+H2O', '中和反应'],
  ['中和', 'HCl+NH3H2O>NH4Cl+H2O', '中和反应'],
  ['中和', 'HCl+Cu(OH)2>CuCl2+H2O', '碱与酸反应'],
  ['中和', 'HCl+Mg(OH)2>MgCl2+H2O', '碱与酸反应'],
  ['中和', 'HCl+Fe(OH)3>FeCl3+H2O', '碱与酸反应'],
  ['中和', 'HCl+Zn(OH)2>ZnCl2+H2O', '碱与酸反应'],
  ['中和', 'HCl+Fe(OH)2>FeCl2+H2O', '碱与酸反应'],
  ['中和', 'H2SO4+NaOH>Na2SO4+H2O', '中和反应'],
  ['中和', 'H2SO4+KOH>K2SO4+H2O', '中和反应'],
  ['中和', 'H2SO4+Ba(OH)2>BaSO4+H2O', '中和反应（同时生成沉淀）'],
  ['中和', 'H2SO4+Ca(OH)2>CaSO4+H2O', '中和反应'],
  ['中和', 'H2SO4+NH3H2O>NH42SO4+H2O', '中和反应'],
  ['中和', 'H2SO4+Cu(OH)2>CuSO4+H2O', '碱与酸反应'],
  ['中和', 'H2SO4+Fe(OH)3>Fe2SO43+H2O', '碱与酸反应'],
  ['中和', 'H2SO4+Mg(OH)2>MgSO4+H2O', '碱与酸反应'],
  ['中和', 'HNO3+NaOH>NaNO3+H2O', '中和反应'],
  ['中和', 'HNO3+KOH>KNO3+H2O', '中和反应'],
  ['中和', 'HNO3+Ba(OH)2>BaNO32+H2O', '中和反应'],
  ['中和', 'HNO3+NH3H2O>NH4NO3+H2O', '中和反应'],
  ['中和', 'HNO3+Cu(OH)2>CuNO32+H2O', '碱与酸反应'],
  ['中和', 'HNO3+Fe(OH)3>FeNO33+H2O', '碱与酸反应'],
  ['中和', 'CH3COOH+NaOH>CH3COONa+H2O', '中和反应'],
  ['中和', 'CH3COOH+Ca(OH)2>(CH3COO)2Ca+H2O', '中和反应'],
  ['中和', 'HF+NaOH>NaF+H2O', '中和反应（弱酸）'],
  ['中和', 'H2C2O4+NaOH>Na2C2O4+H2O', '中和反应'],
  ['中和', 'H3PO4+NaOH>Na3PO4+H2O', '中和反应'],
  /* 酸 + 盐（强酸制弱酸 / 生成气体） */
  ['复分解', 'HCl+Na2CO3>NaCl+H2O+CO2', '碳酸盐与酸反应'],
  ['复分解', 'HCl+CaCO3>CaCl2+H2O+CO2', '实验室制二氧化碳'],
  ['复分解', 'HCl+NaHCO3>NaCl+H2O+CO2', '碳酸氢盐与酸反应'],
  ['复分解', 'HCl+NH4HCO3>NH4Cl+H2O+CO2', '碳酸氢盐与酸反应'],
  ['复分解', 'HCl+K2CO3>KCl+H2O+CO2', '碳酸盐与酸反应'],
  ['复分解', 'HCl+BaCO3>BaCl2+H2O+CO2', '碳酸盐与酸反应'],
  ['复分解', 'HCl+MgCO3>MgCl2+H2O+CO2', '碳酸盐与酸反应'],
  ['复分解', 'HCl+ZnCO3>ZnCl2+H2O+CO2', '碳酸盐与酸反应'],
  ['复分解', 'HCl+AgNO3>AgCl+HNO3', '检验氯离子'],
  ['复分解', 'HCl+Ag2CO3>AgCl+H2O+CO2', '碳酸银溶于盐酸'],
  ['复分解', 'H2SO4+Na2CO3>Na2SO4+H2O+CO2', '碳酸盐与酸反应'],
  ['复分解', 'H2SO4+NaHCO3>Na2SO4+H2O+CO2', '碳酸氢盐与酸反应'],
  ['复分解', 'H2SO4+BaCl2>BaSO4+HCl', '检验硫酸根离子'],
  ['复分解', 'H2SO4+BaNO32>BaSO4+HNO3', '硫酸根检验'],
  ['复分解', 'H2SO4+Ba(OH)2>BaSO4+H2O', '硫酸根检验'],
  ['复分解', 'H2SO4+BaCO3>BaSO4+H2O+CO2', '碳酸钡与硫酸反应'],
  ['复分解', 'HNO3+Na2CO3>NaNO3+H2O+CO2', '碳酸盐与酸反应'],
  ['复分解', 'HNO3+NaHCO3>NaNO3+H2O+CO2', '碳酸氢盐与酸反应'],
  ['复分解', 'HNO3+CaCO3>CaNO32+H2O+CO2', '碳酸盐与酸反应'],
  ['复分解', 'H2C2O4+CaCl2>CaC2O4+HCl', '生成草酸钙沉淀'],
  ['复分解', 'CH3COOH+Na2CO3>CH3COONa+H2O+CO2', '强酸制弱酸'],
  ['复分解', 'HCl+Na2SO3>NaCl+H2O+SO2', '亚硫酸盐与酸反应'],
  ['复分解', 'H2SO4+Na2SO3>Na2SO4+H2O+SO2', '亚硫酸盐与酸反应'],
  ['复分解', 'HCl+Na2S>NaCl+H2S', '硫化物与酸反应'],
  ['复分解', 'H2SO4+FeS>FeSO4+H2S', '硫化物与酸反应'],
  ['复分解', 'HCl+Na2SiO3>NaCl+H2SiO3', '强酸制弱酸（硅酸）'],
  ['复分解', 'CO2+Na2SiO3+H2O>Na2CO3+H2SiO3', '碳酸制硅酸'],
  ['复分解', 'HCl+NaAlO2>NaCl+Al(OH)3', '偏铝酸盐与酸反应'],
  ['复分解', 'CO2+NaAlO2+H2O>Na2CO3+Al(OH)3', '偏铝酸钠与二氧化碳'],
  ['复分解', 'HCl+Na3PO4>NaCl+H3PO4', '强酸制弱酸（磷酸）'],
  /* 碱 + 盐 */
  ['复分解', 'NaOH+CuSO4>Cu(OH)2+Na2SO4', '生成蓝色沉淀'],
  ['复分解', 'NaOH+CuCl2>Cu(OH)2+NaCl', '生成蓝色沉淀'],
  ['复分解', 'NaOH+CuNO32>Cu(OH)2+NaNO3', '生成蓝色沉淀'],
  ['复分解', 'NaOH+FeCl3>Fe(OH)3+NaCl', '生成红褐色沉淀'],
  ['复分解', 'NaOH+Fe2SO43>Fe(OH)3+Na2SO4', '生成红褐色沉淀'],
  ['复分解', 'NaOH+FeSO4>FeOH2+Na2SO4', '生成白色沉淀（迅速变灰绿→红褐）'],
  ['复分解', 'NaOH+FeCl2>FeOH2+NaCl', '生成白色沉淀'],
  ['复分解', 'NaOH+MgCl2>Mg(OH)2+NaCl', '生成白色沉淀'],
  ['复分解', 'NaOH+MgNO32>Mg(OH)2+NaNO3', '生成白色沉淀'],
  ['复分解', 'NaOH+MgSO4>Mg(OH)2+Na2SO4', '生成白色沉淀'],
  ['复分解', 'NaOH+AlCl3>Al(OH)3+NaCl', '生成白色沉淀'],
  ['复分解', 'NaOH+ZnCl2>Zn(OH)2+NaCl', '生成白色沉淀'],
  ['复分解', 'KOH+CuSO4>Cu(OH)2+K2SO4', '生成蓝色沉淀'],
  ['复分解', 'KOH+FeCl3>Fe(OH)3+KCl', '生成红褐色沉淀'],
  ['复分解', 'Ca(OH)2+Na2CO3>CaCO3+NaOH', '工业制烧碱'],
  ['复分解', 'Ca(OH)2+CuSO4>Cu(OH)2+CaSO4', '配制波尔多液'],
  ['复分解', 'Ba(OH)2+Na2SO4>BaSO4+NaOH', '生成硫酸钡沉淀'],
  ['复分解', 'Ba(OH)2+CuSO4>BaSO4+Cu(OH)2', '同时生成两种沉淀'],
  ['复分解', 'Ba(OH)2+Na2CO3>BaCO3+NaOH', '生成碳酸钡沉淀'],
  ['复分解', 'NH3H2O+FeCl3>Fe(OH)3+NH4Cl', '氨水与盐反应'],
  ['复分解', 'NH3H2O+CuSO4>Cu(OH)2+NH42SO4', '氨水与盐反应'],
  ['复分解', 'NH3H2O+AlCl3>Al(OH)3+NH4Cl', '氨水与盐反应'],
  ['复分解', 'NH3H2O+MgCl2>Mg(OH)2+NH4Cl', '氨水与盐反应'],
  ['复分解', 'Ca(OH)2+MgCl2>Mg(OH)2+CaCl2', '生成氢氧化镁沉淀'],
  ['复分解', 'Ba(OH)2+MgSO4>BaSO4+Mg(OH)2', '同时生成两种沉淀'],
  /* 盐 + 盐 */
  ['复分解', 'AgNO3+NaCl>AgCl+NaNO3', '生成氯化银沉淀'],
  ['复分解', 'AgNO3+CaCl2>AgCl+CaNO32', '生成氯化银沉淀'],
  ['复分解', 'AgNO3+BaCl2>AgCl+BaNO32', '生成氯化银沉淀'],
  ['复分解', 'AgNO3+CuCl2>AgCl+CuNO32', '生成氯化银沉淀'],
  ['复分解', 'AgNO3+Na2CO3>Ag2CO3+NaNO3', '生成碳酸银沉淀'],
  ['复分解', 'AgNO3+NaBr>AgBr+NaNO3', '生成溴化银沉淀'],
  ['复分解', 'AgNO3+NaI>AgI+NaNO3', '生成碘化银沉淀'],
  ['复分解', 'AgNO3+Na3PO4>Ag3PO4+NaNO3', '生成磷酸银沉淀'],
  ['复分解', 'AgNO3+Na2S>Ag2S+NaNO3', '生成硫化银沉淀'],
  ['复分解', 'BaCl2+Na2SO4>BaSO4+NaCl', '生成硫酸钡沉淀'],
  ['复分解', 'BaCl2+CuSO4>BaSO4+CuCl2', '生成硫酸钡沉淀'],
  ['复分解', 'BaCl2+ZnSO4>BaSO4+ZnCl2', '生成硫酸钡沉淀'],
  ['复分解', 'BaCl2+Na2CO3>BaCO3+NaCl', '生成碳酸钡沉淀'],
  ['复分解', 'BaCl2+Na2SO3>BaSO3+NaCl', '生成亚硫酸钡沉淀'],
  ['复分解', 'BaCl2+Na3PO4>Ba3PO42+NaCl', '生成磷酸钡沉淀'],
  ['复分解', 'BaNO32+Na2SO4>BaSO4+NaNO3', '生成硫酸钡沉淀'],
  ['复分解', 'CaCl2+Na2CO3>CaCO3+NaCl', '生成碳酸钙沉淀'],
  ['复分解', 'CaCl2+Na3PO4>Ca3PO42+NaCl', '生成磷酸钙沉淀'],
  ['复分解', 'CaCl2+Na2C2O4>CaC2O4+NaCl', '生成草酸钙沉淀'],
  ['复分解', 'CuSO4+Na2CO3>Cu2OH2CO3+Na2SO4', '生成碱式碳酸铜沉淀'],
  ['复分解', 'CuSO4+Na2S>CuS+Na2SO4', '生成硫化铜沉淀'],
  ['复分解', 'CuSO4+BaCl2>BaSO4+CuCl2', '生成硫酸钡沉淀'],
  ['复分解', 'FeSO4+BaCl2>BaSO4+FeCl2', '生成硫酸钡沉淀'],
  ['复分解', 'FeCl3+NaOH>Fe(OH)3+NaCl', '生成红褐色沉淀'],
  ['复分解', 'Na2CO3+CO2+H2O>NaHCO3', '碳酸钠吸收二氧化碳'],
  ['复分解', 'NaCl+NH3H2O+CO2>NaHCO3+NH4Cl', '侯氏制碱法'],
  ['复分解', 'NH4HCO3+NaCl>NaHCO3+NH4Cl', '侯氏制碱法中间反应'],
  ['复分解', 'NaHCO3+NaOH>Na2CO3+H2O', '碳酸氢钠与碱反应'],
  /* 还原 / 氧化还原 */
  ['氧化还原', 'CO+Fe2O3>Fe+CO2@高温', '高炉炼铁'],
  ['氧化还原', 'CO+CuO>Cu+CO2@加热', '一氧化碳还原氧化铜'],
  ['氧化还原', 'CO+Fe3O4>Fe+CO2@高温', '一氧化碳还原四氧化三铁'],
  ['氧化还原', 'H2+CuO>Cu+H2O@加热', '氢气还原氧化铜'],
  ['氧化还原', 'H2+Fe2O3>Fe+H2O@高温', '氢气还原氧化铁'],
  ['氧化还原', 'C+CuO>Cu+CO2@高温', '碳还原氧化铜'],
  ['氧化还原', 'C+Fe2O3>Fe+CO2@高温', '碳还原氧化铁'],
  ['氧化还原', 'C+CO2>CO@高温', '二氧化碳与碳反应'],
  ['氧化还原', 'CO+O2>CO2@点燃', '一氧化碳燃烧'],
  ['氧化还原', 'Fe+H2O>Fe3O4+H2@高温', '铁与水蒸气反应'],
  ['氧化还原', 'Cl2+NaOH>NaCl+NaClO+H2O', '氯气与碱反应'],
  ['氧化还原', 'Cl2+Ca(OH)2>Ca(ClO)2+CaCl2+H2O', '工业制漂白粉'],
  ['氧化还原', 'Cl2+H2O>HCl+HClO', '氯气溶于水'],
  ['氧化还原', 'Cl2+NaBr>NaCl+Br2', '氯气置换溴'],
  ['氧化还原', 'Cl2+NaI>NaCl+I2', '氯气置换碘'],
  ['氧化还原', 'Br2+NaI>NaBr+I2', '溴置换碘'],
  ['氧化还原', 'Cu+HNO3>CuNO32+NO2+H2O@浓硝酸', '铜与浓硝酸反应'],
  ['氧化还原', 'Cu+HNO3>CuNO32+NO+H2O@稀硝酸', '铜与稀硝酸反应'],
  ['氧化还原', 'Ag+HNO3>AgNO3+NO2+H2O', '银与硝酸反应'],
  ['氧化还原', 'Fe+HNO3>FeNO33+NO+H2O@稀硝酸', '铁与稀硝酸反应'],
  ['氧化还原', 'SO2+O2>SO3@催化剂加热', '接触法制硫酸'],
  ['氧化还原', 'SO2+Cl2+H2O>H2SO4+HCl', '二氧化硫与氯气反应'],
  ['氧化还原', 'H2S+O2>SO2+H2O@点燃', '硫化氢燃烧'],
  ['氧化还原', 'NH3+O2>NO+H2O@催化剂加热', '氨的催化氧化'],
  ['氧化还原', 'NH3+Cl2>N2+NH4Cl', '氨气与氯气反应'],
  ['氧化还原', 'Na+H2O>NaOH+H2', '钠与水剧烈反应'],
  ['氧化还原', 'K+H2O>KOH+H2', '钾与水剧烈反应'],
  ['氧化还原', 'Mg+CO2>C+MgO@点燃', '镁在二氧化碳中燃烧'],
  ['氧化还原', 'Zn+FeSO4>ZnSO4+Fe', '锌置换铁'],
  ['氧化还原', 'Fe2O3+CO>Fe+CO2@高温', '高炉炼铁主要反应'],
  ['氧化还原', 'CuO+H2>Cu+H2O@加热', '氢气还原氧化铜'],
  ['氧化还原', 'Fe2O3+H2>Fe+H2O@高温', '氢气还原氧化铁'],
  ['氧化还原', 'Fe3O4+CO>Fe+CO2@高温', '一氧化碳还原四氧化三铁'],
  ['氧化还原', 'CuO+C>Cu+CO2@高温', '碳还原氧化铜'],
  ['氧化还原', 'Fe2O3+C>Fe+CO2@高温', '碳还原氧化铁'],
  ['氧化还原', 'NaCl+H2O>NaOH+H2+Cl2@电解', '氯碱工业'],
  ['氧化还原', 'Hg+O2>HgO@加热', '汞与氧气反应'],
  /* 说明：按需求「去除所有分解反应」，下面这些单物质分解/电解反应一律不再收录。
     （过氧化氢制氧、氯酸钾制氧、高锰酸钾制氧、电解水、氧化汞受热分解、
       碳酸钙高温分解、碳酸氢盐受热分解、氢氧化物受热分解、硝酸盐受热分解、
       电解熔融氧化铝/氯化钠/氯化铜、碱式碳酸铜分解等）
     原文保留在 tools/gen-reactions.js 的 git 历史中，如需恢复把注释去掉即可。 */
  /* 其他常见 */
  ['复分解', 'CaCO3+CO2+H2O>Ca(HCO3)2', '溶洞形成'],
  ['复分解', 'Na2CO3+SiO2>Na2SiO3+CO2@高温', '工业制玻璃'],
  ['复分解', 'Fe2O3+CO>Fe+CO2@高温', '高炉炼铁'],
  ['化合', 'Al+Fe2O3>Al2O3+Fe@高温', '铝热反应'],
  ['化合', 'Mg+HCl>MgCl2+H2', '金属与酸反应'],
  ['复分解', 'SiO2+HF>SiF4+H2O', '氢氟酸腐蚀玻璃'],
  ['复分解', 'SiO2+NaOH>Na2SiO3+H2O', '二氧化硅与碱反应'],
  ['化合', 'Al(OH)3+NaOH>NaAlO2+H2O', '两性氢氧化物溶于碱'],
  ['复分解', 'AlCl3+NH3H2O>Al(OH)3+NH4Cl', '氨水与铝盐反应'],
  ['复分解', 'Mg3N2+H2O>Mg(OH)2+NH3', '氮化镁与水反应'],
  ['化合', 'CaC2+H2O>Ca(OH)2+C2H2', '电石与水反应'],
  ['复分解', 'Na2O2+H2O>NaOH+O2', '过氧化钠与水反应'],
  ['复分解', 'Na2O2+CO2>Na2CO3+O2', '过氧化钠与二氧化碳反应'],
  ['复分解', 'Fe+CuSO4>FeSO4+Cu', '湿法炼铜'],
  ['化合', 'Cu+Cl2>CuCl2@点燃', '铜在氯气中燃烧'],
  ['化合', 'Fe+Cl2>FeCl3@点燃', '铁在氯气中燃烧'],
  ['化合', 'Na+Cl2>NaCl@点燃', '钠在氯气中燃烧'],
  /* 审查意见补充的经典反应 */
  ['氧化还原', 'CH4+O2>CO2+H2O@点燃', '甲烷燃烧'],
  ['氧化还原', 'C2H5OH+O2>CO2+H2O@点燃', '乙醇燃烧'],
  ['氧化还原', 'FeOH2+O2+H2O>Fe(OH)3', '氢氧化亚铁被氧化（白色→灰绿→红褐）'],
  ['复分解', 'NaOH+SO2>Na2SO3+H2O', '少量二氧化硫与氢氧化钠'],
  ['氧化还原', 'NO+O2>NO2', '一氧化氮被氧气氧化'],
  ['氧化还原', 'NO2+H2O>HNO3+NO', '二氧化氮与水反应'],
  ['复分解', 'Na2O+H2O>NaOH', '氧化钠与水反应'],
  ['复分解', 'BaO+H2O>Ba(OH)2', '氧化钡与水反应'],
  ['复分解', 'SO2+O2>SO3@催化剂加热', '二氧化硫催化氧化'],
  ['复分解', 'ZnO+H2SO4>ZnSO4+H2O', '氧化锌与酸反应'],
  ['复分解', 'Zn(OH)2+H2SO4>ZnSO4+H2O', '氢氧化锌与酸反应'],
  ['复分解', 'Zn(OH)2+NaOH>Na2ZnO2+H2O', '氢氧化锌溶于强碱'],
  ['复分解', 'Zn+CuSO4>ZnSO4+Cu', '锌置换铜'],
  /* ---- 氨与铵盐专项补充 ---- */
  ['氧化还原', 'NH3+O2>NO+H2O@催化剂加热', '氨的催化氧化（工业制硝酸第一步）'],
  ['氧化还原', 'NH3+O2>N2+H2O@点燃', '氨在纯氧中燃烧'],
  ['氧化还原', 'NH3+Cl2>N2+HCl', '氨气与氯气反应'],
  ['氧化还原', 'NH3+Cl2>N2+NH4Cl', '氨气与氯气反应（现象：白烟）'],
  ['氧化还原', 'NH3+CuO>N2+Cu+H2O@加热', '氨气还原氧化铜'],
  ['化合', 'NH3+HCl>NH4Cl', '氨气与氯化氢反应（白烟）'],
  ['化合', 'NH3+HNO3>NH4NO3', '氨气与硝酸反应'],
  ['复分解', 'NH3+CO2+H2O>NH4HCO3', '氨气、二氧化碳与水反应'],
  ['复分解', 'NH3+CO2+H2O>NH42CO3', '氨气与过量二氧化碳反应'],
  ['复分解', 'NH3+SO2+H2O>NH42SO3', '氨气吸收二氧化硫'],
  ['复分解', 'NH3+H2SO4>NH42SO4', '氨气与硫酸反应'],
  ['复分解', 'NH3+H2O>NH3H2O', '氨气极易溶于水生成一水合氨'],
  ['复分解', 'NH3+CuSO4+H2O>Cu(OH)2+NH42SO4', '少量氨水与硫酸铜'],
  ['复分解', 'NH3+AlCl3+H2O>Al(OH)3+NH4Cl', '氨水与氯化铝'],
  ['复分解', 'NH3+FeCl3+H2O>Fe(OH)3+NH4Cl', '氨水与氯化铁'],
  ['复分解', 'NH3+MgCl2+H2O>Mg(OH)2+NH4Cl', '氨水与氯化镁'],
  ['复分解', 'NH42S+CuSO4>CuS+NH42SO4', '生成硫化铜沉淀'],
  ['复分解', 'NH42CO3+BaCl2>BaCO3+NH4Cl', '生成碳酸钡沉淀'],
  ['复分解', 'NH42SO4+BaNO32>BaSO4+NH4NO3', '检验硫酸根离子'],
  ['复分解', 'NH4Cl+AgNO3>AgCl+NH4NO3', '检验氯离子'],
  ['氧化还原', 'NH4Cl+NaNO2>N2+NaCl+H2O@加热', '铵盐与亚硝酸盐反应制氮气'],
  ['复分解', 'NH3H2O+SO2>NH4HSO3', '氨水吸收过量二氧化硫'],
  ['复分解', 'NH3H2O+NH4HCO3>NH42CO3+H2O', '氨水与碳酸氢铵'],
  ['复分解', 'NH4HCO3+NaCl>NaHCO3+NH4Cl', '侯氏制碱法的析出反应'],
  /* ---- 离子专项补充：F⁻ / CH₃COO⁻ / C₂O₄²⁻ / NH₄⁺ / Ba²⁺ ---- */
  /* 氟化物 */
  ['复分解', 'HF+NaOH>NaF+H2O', '氢氟酸与碱中和'],
  ['复分解', 'NaF+HCl>NaCl+HF', '强酸制弱酸（氢氟酸）'],
  ['复分解', 'CaCl2+NaF>CaF2+NaCl', '生成氟化钙沉淀'],
  ['复分解', 'AgNO3+NaF>AgF+NaNO3', '生成氟化银'],
  ['复分解', 'H2SO4+CaF2>CaSO4+HF', '萤石制氢氟酸'],
  ['复分解', 'SiO2+HF>SiF4+H2O', '氢氟酸腐蚀玻璃'],
  /* 醋酸盐 */
  ['复分解', 'CH3COOH+NaOH>CH3COONa+H2O', '醋酸与氢氧化钠中和'],
  ['复分解', 'CH3COOH+Na2CO3>CH3COONa+H2O+CO2', '强酸制弱酸'],
  ['复分解', 'CH3COOH+CaCO3>CH3COO2Ca+H2O+CO2', '食醋除水垢'],
  ['复分解', 'CH3COONa+HCl>NaCl+CH3COOH', '强酸制弱酸（醋酸）'],
  ['复分解', 'CH3COONa+H2SO4>Na2SO4+CH3COOH', '强酸制弱酸（醋酸）'],
  ['复分解', 'CH3COONa+FeCl3>CH3COO2Fe+NaCl', '醋酸钠与铁盐'],
  ['复分解', 'Ca(OH)2+CH3COOH>CH3COO2Ca+H2O', '醋酸与氢氧化钙'],
  /* 草酸盐 */
  ['复分解', 'H2C2O4+NaOH>Na2C2O4+H2O', '草酸与氢氧化钠中和'],
  ['复分解', 'H2C2O4+CaCl2>CaC2O4+HCl', '生成草酸钙沉淀'],
  ['复分解', 'Ca(OH)2+Na2C2O4>CaC2O4+NaOH', '生成草酸钙沉淀'],
  ['复分解', 'BaCl2+Na2C2O4>BaC2O4+NaCl', '生成草酸钡沉淀'],
  ['复分解', 'H2C2O4+Na2CO3>Na2C2O4+H2O+CO2', '草酸与碳酸钠'],
  ['复分解', 'H2C2O4+KMnO4>K2C2O4+MnC2O4+H2O', '草酸与高锰酸钾'],
  /* 铵盐 */
  ['复分解', 'NH4Cl+NaOH>NaCl+H2O+NH3', '铵盐与碱共热（检验铵根）'],
  ['复分解', 'NH42SO4+NaOH>Na2SO4+H2O+NH3', '铵盐与碱共热'],
  ['复分解', 'NH4NO3+NaOH>NaNO3+H2O+NH3', '铵盐与碱共热'],
  ['复分解', 'NH4HCO3+NaOH>Na2CO3+H2O+NH3', '铵盐与碱共热'],
  ['复分解', 'NH3H2O+HCl>NH4Cl+H2O', '氨水与盐酸'],
  ['复分解', 'NH3H2O+CO2>NH4HCO3', '氨水吸收二氧化碳'],
  ['复分解', 'NH4Cl+Ca(OH)2>CaCl2+H2O+NH3', '实验室制氨气'],
  ['复分解', 'NH42SO4+Ca(OH)2>CaSO4+H2O+NH3', '铵盐与熟石灰'],
  ['复分解', 'NH4Cl+AgNO3>AgCl+NH4NO3', '检验氯离子'],
  ['复分解', 'NH42SO4+BaCl2>BaSO4+NH4Cl', '检验硫酸根'],
  ['复分解', 'NH42CO3+CaCl2>CaCO3+NH4Cl', '生成碳酸钙沉淀'],
  /* 钡盐 */
  ['复分解', 'BaCl2+H2SO4>BaSO4+HCl', '检验硫酸根离子'],
  ['复分解', 'BaCl2+Na2SO4>BaSO4+NaCl', '生成硫酸钡沉淀'],
  ['复分解', 'BaCl2+Na2CO3>BaCO3+NaCl', '生成碳酸钡沉淀'],
  ['复分解', 'BaCl2+Na2SO3>BaSO3+NaCl', '生成亚硫酸钡沉淀'],
  ['复分解', 'Ba(OH)2+H2SO4>BaSO4+H2O', '氢氧化钡与硫酸'],
  ['复分解', 'Ba(OH)2+Na2SO4>BaSO4+NaOH', '氢氧化钡与硫酸钠'],
  ['复分解', 'Ba(OH)2+CO2>BaCO3+H2O', '氢氧化钡吸收二氧化碳'],
  ['复分解', 'BaCl2+Na2C2O4>BaC2O4+NaCl', '生成草酸钡沉淀'],
  ['复分解', 'BaCl2+Na3PO4>Ba3PO42+NaCl', '生成磷酸钡沉淀'],
  ['复分解', 'Ba(NO3)2+Na2SO4>BaSO4+NaNO3', '生成硫酸钡沉淀'],
  ['复分解', 'BaO+H2O>Ba(OH)2', '氧化钡与水反应'],
  ['复分解', 'Ba(OH)2+CuSO4>BaSO4+Cu(OH)2', '同时生成两种沉淀']
];

/* 反向索引：盐 id → 它的阴离子 id（置换反应与双水解共用，必须在使用前声明） */
const SALT_ANION = {};
Object.keys(SALT_ID).forEach(function (k) {
  var parts = k.split('|');
  var id = SALT_ID[k];
  if (id) SALT_ANION[id] = parts[1];
});

/* ---------------------------------------------------------------
 * 四之二、置换反应：按金属活动性顺序穷举
 *   ① 金属（活动性在氢之前）+ 稀酸 → 盐 + H₂
 *   ② 较活泼金属 + 较不活泼金属的盐溶液 → 新金属 + 新盐
 *   ③ 特别活泼金属（K、Na）+ 水 → 碱 + H₂
 * ------------------------------------------------------------- */
(function buildDisplacement() {
  /* 金属活动性顺序（K Ca Na Mg Al Zn Fe Sn Pb H Cu Hg Ag Pt Au） */
  var SERIES = ['K', 'Na', 'Mg', 'Al', 'Zn', 'Fe', 'Cu', 'Ag'];
  var RANK = {};
  SERIES.forEach(function (m, i) { RANK[m] = i; });
  /* 金属单质 → 它在盐里的阳离子 id */
  var METAL_ION = { Na: 'Na', K: 'K', Mg: 'Mg', Al: 'Al', Zn: 'Zn', Fe: 'Fe2', Cu: 'Cu', Ag: 'Ag' };
  /* 能与酸反应放出氢气的金属（活动性在氢之前；K/Na 太活泼，与酸反应过于剧烈且实际先与水反应） */
  var ACID_METALS = ['Mg', 'Al', 'Zn', 'Fe'];

  /* 反向索引盐 id → 阴离子 id，见文件上方的 SALT_ANION */

  function push2(type, r, p, cond, nm) {
    T.push([type, r.join('+') + '>' + p.join('+') + (cond ? ('@' + cond) : ''), nm]);
  }

  /* ① 金属 + 稀酸 */
  ['HCl', 'H2SO4'].forEach(function (acid) {
    ACID_METALS.forEach(function (m) {
      var salt = null;
      if (m === 'Mg') salt = (acid === 'HCl') ? 'MgCl2' : 'MgSO4';
      if (m === 'Al') salt = (acid === 'HCl') ? 'AlCl3' : 'Al2SO43';
      if (m === 'Zn') salt = (acid === 'HCl') ? 'ZnCl2' : 'ZnSO4';
      if (m === 'Fe') salt = (acid === 'HCl') ? 'FeCl2' : 'FeSO4';
      if (salt) push2('置换', [m, acid], [salt, 'H2'], '', '金属与稀酸反应放出氢气');
    });
  });

  /* ② 金属 + 盐溶液：需要「盐可溶」且「置换出的金属不溶/可溶均可」 */
  var SALT_CANDS = [
    'CuSO4', 'CuCl2', 'AgNO3', 'ZnSO4', 'FeSO4', 'FeCl2', 'FeNO32',
    'MgSO4', 'MgCl2', 'Al2SO43', 'AlCl3', 'Fe2SO43'
  ];
  SALT_CANDS.forEach(function (saltId) {
    var salt = infoOf(saltId);
    if (!salt || !salt.el) return;
    if (salt.sol === 'n' || salt.sol === 'x') return;      // 难溶盐不参与置换
    /* 找出盐里的金属元素（排除 H、非金属） */
    var saltMetal = null;
    for (var e = 0; e < salt.el.length; e++) {
      if (RANK[salt.el[e]] !== undefined) { saltMetal = salt.el[e]; break; }
    }
    if (!saltMetal) return;
    SERIES.forEach(function (m) {
      if (m === saltMetal) return;
      if (RANK[m] >= RANK[saltMetal]) return;              // 必须比盐中金属活泼
      if (m === 'K' || m === 'Na') return;                 // K/Na 先与水反应，不直接置换盐
      var ion = METAL_ION[saltMetal];
      var newSalt = ion ? subIdOf(METAL_ION[m], SALT_ANION[saltId]) : null;
      if (!newSalt || !infoOf(newSalt)) return;
      push2('置换', [m, saltId], [newSalt, saltMetal], '',
        '较活泼金属把较不活泼金属从其盐溶液中置换出来');
    });
  });

  /* ③ K、Na 与水反应（水作反应物） */
  T.push(['置换', 'Na+H2O>NaOH+H2', '钠与水剧烈反应生成氢气']);
  T.push(['置换', 'K+H2O>KOH+H2', '钾与水剧烈反应生成氢气']);
})();

/* ---------------------------------------------------------------
 * 四之三、双水解反应
 *   2Al³⁺ + 3CO₃²⁻ + 3H₂O = 2Al(OH)₃↓ + 3CO₂↑ 等
 * ------------------------------------------------------------- */
(function buildDoubleHydrolysis() {
  /* 发生双水解的“弱碱阳离子盐”（铝盐 / 铁盐）与其氢氧化物沉淀 */
  var AL_SALTS = ['AlCl3', 'Al2SO43', 'AlNO33', 'FeCl3', 'Fe2SO43', 'FeNO33'];
  var HYDROXIDE = { Al: 'Al(OH)3', Fe3: 'Fe(OH)3' };
  /* 弱酸酸根：反应物盐 + 双水解产生的小分子/弱酸 */
  var WEAK = {
    CO3: { salts: ['Na2CO3', 'K2CO3', 'NH42CO3'], gas: 'CO2', keepAnion: 'CO3' },
    HCO3: { salts: ['NaHCO3', 'KHCO3', 'NH4HCO3'], gas: 'CO2', keepAnion: 'HCO3' },
    AlO2: { salts: ['NaAlO2', 'KAlO2'], gas: null, keepAnion: null },   // 只生成氢氧化物
    SiO3: { salts: ['Na2SiO3', 'K2SiO3'], gas: 'H2SiO3', keepAnion: 'SiO3' },
    S: { salts: ['Na2S', 'K2S'], gas: 'H2S', keepAnion: 'S' },
    SO3: { salts: ['Na2SO3', 'K2SO3'], gas: 'SO2', keepAnion: 'SO3' }
  };
  /* 盐里的阳离子 → 离子 id（用于生成对应的新盐） */
  var SALT_CATION = { Na2CO3: 'Na', K2CO3: 'K', NH42CO3: 'NH4', NaHCO3: 'Na', KHCO3: 'K', NH4HCO3: 'NH4', NaAlO2: 'Na', KAlO2: 'K', Na2SiO3: 'Na', K2SiO3: 'K', Na2S: 'Na', K2S: 'K', Na2SO3: 'Na', K2SO3: 'K' };

  AL_SALTS.forEach(function (alId) {
    var al = infoOf(alId);
    if (!al) return;
    /* 铝盐/铁盐的金属离子 */
    var ci = al.el.indexOf('Al') >= 0 ? 'Al' : 'Fe3';
    var hyd = HYDROXIDE[ci];
    var alAnion = SALT_ANION[alId];                 // Cl / SO4 / NO3
    if (!alAnion) return;

    Object.keys(WEAK).forEach(function (ai) {
      var w = WEAK[ai];
      w.salts.forEach(function (saltId) {
        var salt = infoOf(saltId);
        if (!salt) return;
        var cat = SALT_CATION[saltId];
        if (!cat) return;
        /* 双水解的另一产物：铝盐的酸根 + 弱酸盐的阳离子 */
        var newSalt = w.keepAnion ? subIdOf(cat, alAnion) : null;
        if (w.keepAnion && (!newSalt || !infoOf(newSalt))) return;
        var prods = [hyd];
        if (w.gas) prods.push(w.gas);
        if (newSalt) prods.push(newSalt);
        var uniq = [];
        prods.forEach(function (x) { if (x && uniq.indexOf(x) < 0) uniq.push(x); });
        if (uniq.length < 2) return;
        /* 反应物只列两种盐：水是溶液中的介质，写进“条件”而不是当作要打出的反应物，
         * 否则出牌时还需要一张“水”牌才凑得齐反应物。 */
        var r = [alId, saltId];
        T.push(['双水解', r.join('+') + '>' + uniq.join('+') + '@水溶液中',
          '双水解反应：Al³⁺/Fe³⁺ 与弱酸酸根互相促进水解，反应进行到底']);
      });
    });
  });
})();

const SHORT = {};
DB.SUBSTANCES.forEach(function (s) { SHORT[s.id] = s.id; });/* 允许在简写里使用的别名（把简写统一到标准 id） */
const ALIAS = {
  NH42SO4: 'NH42SO4', NH42CO3: 'NH42CO3', CaNO32: 'CaNO32',
  CuNO32: 'CuNO32', BaNO32: 'BaNO32', MgNO32: 'MgNO32', ZnNO32: 'ZnNO32',
  FeNO32: 'FeNO32', FeNO33: 'FeNO33', AlNO33: 'AlNO33',
  'ZnOH2': 'ZnOH2', 'Zn(OH)2': 'ZnOH2', 'FeOH2': 'FeOH2', 'Fe(OH)2': 'FeOH2',
  'CH3COO2Ca': 'CH3COO2Ca', '(CH3COO)2Ca': 'CH3COO2Ca',
  'CaHCO32': 'CaHCO32', 'Ca(HCO3)2': 'CaHCO32',
  CH3COO2Ca: 'CH3COO2Ca', CaHCO32: 'CaHCO32', CaClO2: 'Ca(ClO)2',
  Cu2OH2CO3: 'Cu2OH2CO3', Fe2SO43: 'Fe2SO43', Na2C2O4: 'Na2C2O4'
};
function fixId(id) { return ALIAS[id] || id; }
/* 静态表里可能写成 “Ca(NO3)2”“(NH4)2SO4” 这种别名形式，
 * 统一按化学式归一到规范 id，避免出现同一物质两个 id、甚至解析不到名称 */
function canonId(id) {
  var raw = fixId(id);
  if (ALL[raw] || DB.SUB_INDEX[raw]) return raw;
  var s = byFormula(raw);
  if (s) return s.id;
  return raw;
}

/* 这些产物若母表中没有，则按“推算物质”补进物质库 */
const DERIVED = {};

T.forEach(function (t) {
  var type = t[0], expr = t[1], nm = t[2];
  var parts = expr.split('>');
  var left = parts[0].split('+');
  var right = parts[1].split('@');
  var cond = right.length > 1 ? right[1] : '';
  var prods = right[0].split('+');
  var r = left.map(canonId), p = prods.map(canonId);
  /* 检查所有物质是否可知；不可知的记录下来待补 */
  var unknown = [];
  r.concat(p).forEach(function (id) {
    if (!infoOf(id)) unknown.push(id);
  });
  if (unknown.length) {
    unknown.forEach(function (id) { DERIVED[id] = true; });
    return;                     // 无法确定成分的反应先跳过（会在下面报告）
  }
  push({ r: r, p: p, c: cond, nm: nm, t: type }, 1);
});

/* ---------------------------------------------------------------
 * 五、相关性过滤
 * 穷举出的组合里有很多是高中不涉及的冷门反应（如 AgClO、CuSiO₃ 之类）。
 * 规则：只保留「至少有一种反应物是物质牌表内的物质」的反应；
 *       并按“直接涉及牌表反应物的数量”排序，牌表相关的排在前面。
 * ------------------------------------------------------------- */
const CARD = {};
DB.CARD_TABLE.forEach(function (s) { CARD[s.id] = 1; });
const GASESET = { CO2: 1, SO2: 1, H2S: 1, NH3: 1, NO: 1, NO2: 1, O2: 1, H2: 1, Cl2: 1, N2: 1 };
/* 打分只用来排序，不作硬性门槛：只要反应物中至少有一种是物质牌表里的牌，
 * 或生成物里有沉淀/气体/水，就是“可玩”的复分解反应，应当保留。
 * （曾经用固定条数截断，把 Ca(NO₃)₂+Na₂SO₄ 这类常见反应挤掉了） */
function relevance(rx) {
  var n = (rx.prio === 1 ? 100 : 0);   // 静态表（经典反应）排最前
  rx.r.forEach(function (id) { if (CARD[id]) n++; });
  rx.p.forEach(function (id) { if (CARD[id]) n += 0.6; });
  rx.p.forEach(function (id) { if (GASESET[id]) n += 0.5; });
  rx.p.forEach(function (id) { if (id === 'H2O') n += 0.3; });
  var s;
  rx.p.forEach(function (id) { s = infoOf(id); if (s && s.sol === 'n') n += 0.4; });
  return n;
}
const kept = [], dropped = [];
RX.forEach(function (rx) {
  var rel = relevance(rx);
  if (rel <= 0) { dropped.push(rx); return; }
  rx._rel = rel;
  kept.push(rx);
});
kept.sort(function (a, b) { return b._rel - a._rel; });
/* 静态表的经典反应全部保留；离子穷举的反应全部保留（已由上面的相关性门槛筛过） */
const staticRx = kept.filter(function (rx) { return rx.prio === 1; });
const genRx = kept.filter(function (rx) { return rx.prio !== 1; });
const finalRX0 = staticRx.concat(genRx);
/* 审查意见：剔除不存在 / 双水解 / 超纲元素的反应 */
const BADSUB = { AgOH: 1, NH4OH: 1, HHCO3: 1, HAlO2: 1, HMnO4: 1, HCN: 1,
  CuI2: 1, FeI3: 1, Fe2S3: 1, Al2CO33: 1, Fe2CO33: 1, AlHCO33: 1, CuHCO32: 1,
  Al2SO33: 1, Fe2SO33: 1, CuSO3: 1, AgClO: 1, AgMnO4: 1, CuCO3: 1, FeCO3: 1,
  FeSO3: 1, FeHCO32: 1, CaS: 1, Al2S3: 1, SiF4x: 1 };
const OKELEM = { H: 1, C: 1, N: 1, O: 1, Na: 1, Mg: 1, Al: 1, Si: 1, P: 1, S: 1, Cl: 1,
  K: 1, Ca: 1, Mn: 1, Fe: 1, Cu: 1, Zn: 1, Ag: 1, Ba: 1, Br: 1, I: 1, F: 1, Hg: 1 };
function subOk(id) {
  if (BADSUB[id]) return false;
  var s = ALL[id];
  if (!s) return true;
  if (s.el && s.el.some(function (e) { return !OKELEM[e]; })) return false;
  return true;
}
const finalRX = finalRX0.filter(function (rx) {
  if (rx.t === '分解') return false;     // 去除所有分解反应（兜底）
  return rx.r.concat(rx.p).every(subOk);
});
finalRX.forEach(function (rx) { delete rx._rel; delete rx.prio; });

/* ---------------------------------------------------------------
 * 六、输出
 * ------------------------------------------------------------- *//* 生成的反应里引用到、但既不在 data.js 也不在 extras 里的物质（由离子组合推算而来），
 * 只补真正用到的那些，保证界面上每种物质都有完整性质 */
const referenced = {};
finalRX.forEach(function (rx) {
  rx.r.concat(rx.p).forEach(function (id) { referenced[id] = 1; });
});
const extraDerived = [];
Object.keys(referenced).forEach(function (id) {
  if (DB.SUB_INDEX[id]) return;
  if (extras.some(function (x) { return x.id === id; })) return;
  var s = ALL[id];
  if (!s || !s.f) return;
  extraDerived.push({ id: s.id, f: s.f, n: s.n, cat: s.cat, st: s.st, sol: s.sol, el: s.el, note: s.note || '' });
});
extras.push.apply(extras, extraDerived);
const newSubs = extras.filter(function (s) { return !DB.SUB_INDEX[s.id]; });

/* 只输出「真的被反应引用到」的新物质，避免把穷举产生的上千种冷门化合物塞进物质库 */
const usedIds = {};
finalRX.forEach(function (rx) { rx.r.concat(rx.p).forEach(function (id) { usedIds[id] = 1; }); });
const outSubs = newSubs.filter(function (s) { return usedIds[s.id]; });

const out = [];
out.push('/* ============================================================');
out.push(' * 化学之王 Chemical Combo —— 自动生成的扩充数据');
out.push(' * 由 tools/gen-reactions.js 生成，请勿手工修改。');
out.push(' * 物质：' + outSubs.length + ' 种新增　反应：' + finalRX.length + ' 条（穷举 ' + RX.length + ' 条，已滤除冷门组合 ' + dropped.length + ' 条）');
out.push(' * ============================================================ */');
out.push('(function (global) {');
out.push("  'use strict';");
out.push('  var DB = global.ChemDB;');
out.push('');
out.push('  /* ---------- 统一化学式书写：把普通数字下标换成 Unicode 角标 ---------- */');
out.push("  var SUBS = { '1': '', '2': '₂', '3': '₃', '4': '₄', '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉' };");
out.push('  function prettyFormula(f) {');
out.push('    if (!f) return f;');
out.push("    // 匹配“元素/右括号 + 一串数字”，但跳过电荷标记 ²⁻ / ³⁺ 之类");
out.push("    return f.replace(/(.)(\\d+)/g, function (m, p, digits) {");
out.push("      if ('²³⁺⁻'.indexOf(p) >= 0) return m;");
out.push("      var conv = '';");
out.push("      for (var k = 0; k < digits.length; k++) conv += (SUBS[digits[k]] === undefined ? digits[k] : SUBS[digits[k]]);");
out.push('      return p + conv;');
out.push('    });');
out.push('  }');
out.push('  function prettyLabel(id) { return prettyFormula(DB.label(id)); }');
out.push('  DB.prettyFormula = prettyFormula;');
out.push('  DB.equationOf = function (rx) {');
out.push("    return rx.r.map(prettyLabel).join(' + ') + (rx.c ? (' —[' + rx.c + ']→ ') : ' → ') + rx.p.map(prettyLabel).join(' + ');");
out.push('  };');
out.push('  DB.equationPlainOf = function (rx) {');
out.push("    return rx.r.map(prettyLabel).join(' + ') + ' = ' + rx.p.map(prettyLabel).join(' + ');");
out.push('  };');
out.push('  var bi, brx;');
out.push('  for (bi = 0; bi < DB.SUBSTANCES.length; bi++) {');
out.push('    DB.SUBSTANCES[bi].f = prettyFormula(DB.SUBSTANCES[bi].f);');
out.push('  }');
out.push('  for (bi = 0; bi < DB.CARD_TABLE.length; bi++) {');
out.push('    DB.CARD_TABLE[bi].f = prettyFormula(DB.CARD_TABLE[bi].f);');
out.push('  }');
out.push('');
out.push('  /* ---------- 覆盖取标签 / 方程式的函数，全部走统一格式 ---------- */');
out.push('  DB.label = function (id) {');
out.push('    var s = DB.SUB_INDEX[id];');
out.push('    if (s) return s.f;');
out.push('    var e = DB.EXTRA_INFO[id];');
out.push('    if (e) return prettyFormula(e.f);');
out.push('    return id;');
out.push('  };');
out.push('  DB.equation = function (rx) { return DB.equationOf(rx); };');
out.push('  DB.equationPlain = function (rx) { return DB.equationPlainOf(rx); };');
out.push('');
out.push('  /* ---------- 新增物质 ---------- */');
out.push('  var SUBSTANCES = ' + JSON.stringify(outSubs, null, 2).replace(/\n/g, '\n  ') + ';');
out.push('');
out.push('  /* ---------- 自动生成的反应 ---------- */');
out.push('  var REACTIONS = ' + JSON.stringify(finalRX, null, 2).replace(/\n/g, '\n  ') + ';');
out.push('');
out.push('  /* ---------- 合并进数据库 ---------- */');
out.push('  var subIndex = DB.SUB_INDEX;');
out.push('  var addedSub = 0;');
out.push('  SUBSTANCES.forEach(function (s) {');
out.push('    if (subIndex[s.id]) return;');
out.push('    DB.SUBSTANCES.push(s);');
out.push('    subIndex[s.id] = s;');
out.push('    addedSub++;');
out.push('  });');
out.push('  DB.GENERATED = { substances: addedSub, reactions: 0, added: 0 };');
out.push('');
out.push('  /* ---------- 化学式归一：同一物质只保留一个 id ----------');
out.push('   * data.js 的手写反应里存在 “Ca(NO3)2”“(NH4)2SO4” 这类别名写法，');
out.push('   * 与生成库里的 CaNO32 / NH42SO4 指向同一物质，若不统一会出现');
out.push('   * 同一个化学式两个 id、界面上解析不到名称的问题。这里按化学式全部归一。 */');
out.push('  var SUBD = { "₀": "0", "₁": "1", "₂": "2", "₃": "3", "₄": "4", "₅": "5", "₆": "6", "₇": "7", "₈": "8", "₉": "9" };');
out.push('  DB.normFormula = function (f) {');
out.push('    if (!f) return "";');
out.push('    var s = String(f).replace(/[₀-₉]/g, function (c) { return SUBD[c]; })');
out.push('      .replace(/\\s+/g, "").replace(/（/g, "(").replace(/）/g, ")");');
out.push('    /* 忽略书写顺序：(NO3)2Ca 与 Ca(NO3)2 视为同一物质 */');
out.push('    var parts = s.match(/\\((?:[^()]|\\([^()]*\\))*\\)\\d*|[A-Z][a-z]?\\d*|\\([^)]*\\)/g);');
out.push('    return parts ? parts.sort().join("") : s;');
out.push('  };');
out.push('  var F2ID = {}, F2SUB = {};');
out.push('  function rebuildFormulaIndex() {');
out.push('    F2ID = {}; F2SUB = {};');
out.push('    DB.SUBSTANCES.forEach(function (s) {');
out.push('      var k = DB.normFormula(s.f);');
out.push('      if (!k) return;');
out.push('      if (!F2ID[k]) { F2ID[k] = s.id; F2SUB[k] = s; }');
out.push('    });');
out.push('  }');
out.push('  /* 生成物质已并入 DB.SUBSTANCES，这里首次建立索引即可覆盖全部物质 */');
out.push('  rebuildFormulaIndex();');
out.push('  DB.rebuildFormulaIndex = rebuildFormulaIndex;');
out.push('  DB.resolveId = function (id) {');
out.push('    if (DB.SUB_INDEX[id]) return id;');
out.push('    var k = DB.normFormula(id);');
out.push('    return F2ID[k] || null;');
out.push('  };');
out.push('');
out.push('  /* 把每条反应的物质 id 换写成规范 id，并去掉因此产生的重复项 */');
out.push('  function normList(list) {');
out.push('    var out2 = [], seen2 = {};');
out.push('    list.forEach(function (x) {');
out.push('      var id = DB.resolveId(x);');
out.push('      if (!id || seen2[id]) return;');
out.push('      seen2[id] = 1;');
out.push('      out2.push(id);');
out.push('    });');
out.push('    return out2;');
out.push('  }');
out.push('  var normed = [], seenRx = {};');
out.push('  DB.REACTIONS.forEach(function (rx) {');
out.push('    var r = normList(rx.r), p = normList(rx.p);');
out.push('    if (!r.length || !p.length) return;');
out.push('    if (r.some(function (x) { return p.indexOf(x) >= 0; })) return;   // 同一物质不能既是反应物又是产物');
out.push('    rx.r = r; rx.p = p;');
out.push('    var key = r.slice().sort().join("+") + "=>" + p.slice().sort().join("+");');
out.push('    if (seenRx[key]) return;');
out.push('    seenRx[key] = 1;');
out.push('    normed.push(rx);');
out.push('  });');
out.push('  DB.REACTIONS = normed;');
out.push('');
out.push('  /* ---------- 合并自动生成的反应（放在物质裁剪之前，否则会误删物质） ---------- */');
out.push('  var seen = {};');
out.push('  DB.REACTIONS.forEach(function (rx) {');
out.push('    seen[rx.r.slice().sort().join("+") + "=>" + rx.p.slice().sort().join("+")] = 1;');
out.push('  });');
out.push('  var added = 0;');
out.push('  REACTIONS.forEach(function (rx) {');
out.push('    var r2 = normList(rx.r), p2 = normList(rx.p);');
out.push('    if (!r2.length || !p2.length) return;');
out.push('    rx.r = r2; rx.p = p2;');
out.push('    var k = r2.slice().sort().join("+") + "=>" + p2.slice().sort().join("+");');
out.push('    if (seen[k]) return;');
out.push('    seen[k] = 1;');
out.push('    rx.id = "gx" + (DB.REACTIONS.length);');
out.push('    DB.REACTIONS.push(rx);');
out.push('    added++;');
out.push('  });');
out.push('');
out.push('  /* 裁剪：只保留被反应引用到的物质（避免穷举出的上千种冷门化合物塞满物质库） */');out.push('  var used = {};');
out.push('  DB.REACTIONS.forEach(function (rx) { rx.r.concat(rx.p).forEach(function (x) { used[x] = 1; }); });');
out.push('  /* 先把同一化学式的别名合并到第一个出现的规范 id（如 Ba(NO3)2 → BaNO32） */');
out.push('  var winner = {}, alias2canon = {};');
out.push('  DB.SUBSTANCES.forEach(function (s) {');
out.push('    var k = DB.normFormula(s.f);');
out.push('    if (!k) return;');
out.push('    if (!winner[k]) winner[k] = s.id;');
out.push('    else if (winner[k] !== s.id) alias2canon[s.id] = winner[k];');
out.push('  });');
out.push('  DB.aliasMap = alias2canon;');
out.push('  DB.REACTIONS.forEach(function (rx) {');
out.push('    function fix(a) {');
out.push('      var out3 = [], seen3 = {};');
out.push('      a.forEach(function (x) {');
out.push('        var id = alias2canon[x] || x;');
out.push('        if (seen3[id]) return;');
out.push('        seen3[id] = 1; out3.push(id);');
out.push('      });');
out.push('      return out3;');
out.push('    }');
out.push('    rx.r = fix(rx.r); rx.p = fix(rx.p);');
out.push('  });');
out.push('  /* 物质本身也只保留规范 id 那一条 */');
out.push('  DB.SUBSTANCES = DB.SUBSTANCES.filter(function (s) { return !alias2canon[s.id]; });');
out.push('  used = {};');
out.push('  DB.REACTIONS.forEach(function (rx) { rx.r.concat(rx.p).forEach(function (x) { used[x] = 1; }); });');
out.push('  DB.SUBSTANCES = DB.SUBSTANCES.filter(function (s) {');
out.push('    /* 未被任何反应引用、又不是牌表里的物质 → 丢弃；牌表物质必须保留 */');
out.push('    return used[s.id] || DB.CARD_TABLE.some(function (c) { return c.id === s.id; });');
out.push('  });');
out.push('  DB.SUB_INDEX = {};');
out.push('  DB.SUBSTANCES.forEach(function (s) { DB.SUB_INDEX[s.id] = s; });');
out.push('  rebuildFormulaIndex();');
out.push('');
out.push('  /* 类别修正：这些物质既不是氧化物也不属于酸/碱/盐/单质，统一归到「其他」（白色标签） */');
out.push('  var CAT_FIX = { NH3: 1, CH4: 1, C2H5OH: 1, C2H2: 1, SiF4: 1 };');
out.push('  DB.SUBSTANCES.forEach(function (s) { if (CAT_FIX[s.id]) s.cat = "Ot"; });');
out.push('  DB.CAT_NAME.Ot = "其他";');
out.push('  DB.CAT_EN.Ot = "Other";');
out.push('');
out.push('  DB.GENERATED = { substances: addedSub, reactions: added, total: DB.REACTIONS.length };');
out.push('');
out.push('  /* 给所有反应预生成统一格式的方程式 */');
out.push('  for (var ri = 0; ri < DB.REACTIONS.length; ri++) {');
out.push('    DB.REACTIONS[ri].eq = DB.equationOf(DB.REACTIONS[ri]);');
out.push('    DB.REACTIONS[ri].eqPlain = DB.equationPlainOf(DB.REACTIONS[ri]);');
out.push('  }');
out.push('})(typeof window !== "undefined" ? window : globalThis);');
out.push('');

fs.writeFileSync(path.join(ROOT, 'reactions-data.js'), out.join('\n'), 'utf8');

console.log('新增物质：' + outSubs.length + ' 种（穷举产生 ' + newSubs.length + ' 种，只输出被反应引用到的）');
console.log('穷举反应：' + RX.length + ' 条 → 保留相关反应 ' + finalRX.length + ' 条（滤除冷门 ' + dropped.length + ' 条）');
console.log('未能解析（已跳过）：' + (Object.keys(DERIVED).length ? Object.keys(DERIVED).join(', ') : '无'));
































