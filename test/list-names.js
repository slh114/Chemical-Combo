/* 列出全部物质名称供人工核对，并标出可疑项 */
const fs = require('fs');
const path = require('path');
global.window = undefined;
require(path.join(__dirname, '..', 'data.js'));
require(path.join(__dirname, '..', 'reactions-data.js'));
const DB = global.ChemDB;
const out = [];
const L = s => out.push(s);

const cats = ['Ad', 'Be', 'St', 'Oe', 'Es'];
cats.forEach(c => {
  const list = DB.SUBSTANCES.filter(s => s.cat === c).sort((a, b) => (a.f || '').localeCompare(b.f || ''));
  L('=== ' + (DB.CAT_NAME[c] || c) + '（' + list.length + '） ===');
  list.forEach(s => L('  ' + (s.f || '').padEnd(16) + (s.n || '').padEnd(14) + (s.el || []).join('') + (s.note ? '  ' + s.note : '')));
  L('');
});

L('=== 可疑名称 ===');
const sus = DB.SUBSTANCES.filter(s => {
  const n = s.n || '';
  if (/离子$/.test(n)) return true;
  if (/(酸|根)$/.test(n) && /[钙钠钾钡镁铝锌铁铜银铵]/.test(n)) return true;
  if (/氨水/.test(n)) return true;
  if (/\(aq\)/.test(s.f || '')) return true;
  return false;
});
sus.forEach(s => L('  ' + (s.f || '').padEnd(16) + (s.n || '')));
if (!sus.length) L('  无');

L('');
L('=== 名称与化学式对照（抽查常见物质） ===');
['HCl', 'H2SO4', 'HNO3', 'NaOH', 'NH3H2O', 'NH3', 'CaNO32', 'CaCl2', 'CaSO4', 'CaCO3',
  'Ca(OH)2', 'CaSO3', 'CaSiO3', 'CaF2', 'KClO', 'KClO3', 'KMnO4', 'AgNO3', 'BaNO32',
  'FeOH2', 'Fe(OH)3', 'Cu(OH)2', 'Cu2OH2CO3', 'Na2C2O4', 'CH3COONa', 'NH4F', 'NH42SO4'
].forEach(id => {
  const s = DB.SUB_INDEX[id];
  L('  ' + id.padEnd(12) + (s ? ((s.f || '').padEnd(16) + (s.n || '')) : '（不在库中）'));
});
fs.writeFileSync(path.join(__dirname, 'names.out'), out.join('\n'), 'utf8');
console.log(out.join('\n'));
