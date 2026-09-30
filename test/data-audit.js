/* 数据体检：重名/重复化学式/无名称/参考不到的物质 */
const fs = require('fs');
const path = require('path');
global.window = undefined;
require(path.join(__dirname, '..', 'data.js'));
require(path.join(__dirname, '..', 'reactions-data.js'));
const DB = global.ChemDB;
const out = [];
const L = s => out.push(s);

const byF = {};
DB.SUBSTANCES.forEach(s => { (byF[s.f] = byF[s.f] || []).push(s.id); });
L('=== 同一化学式对应多个 id ===');
const dups = Object.keys(byF).filter(f => byF[f].length > 1);
dups.forEach(f => L('  ' + f + ' → ' + byF[f].join(', ')));
L('共 ' + dups.length + ' 组');

L('');
L('=== 名称可疑（像是离子名拼接而成） ===');
DB.SUBSTANCES.filter(s => s.n && /离子/.test(s.n)).slice(0, 30)
  .forEach(s => L('  ' + s.id.padEnd(14) + (s.f || '').padEnd(16) + s.n));

L('');
L('=== 名称以“酸/根”结尾但明显不是酸/根 ===');
DB.SUBSTANCES.filter(s => s.n && /(酸|根)$/.test(s.n) && /[钙钠钾钡镁铝锌铁铜银铵]/.test(s.n))
  .slice(0, 30).forEach(s => L('  ' + s.id.padEnd(14) + (s.f || '').padEnd(16) + s.n));

L('');
const refs = {};
DB.REACTIONS.forEach(r => r.r.concat(r.p).forEach(x => { refs[x] = 1; }));
const unresolved = Object.keys(refs).filter(id => !DB.SUB_INDEX[id]);
L('=== 反应引用但物质库中缺失（界面会直接显示 id） ===');
L('  ' + unresolved.length + ' 个: ' + unresolved.join(', '));

L('');
L('=== 化学式里用了普通数字的物质 ===');
DB.SUBSTANCES.filter(s => s.f && /\d/.test(s.f) && !/[₀-₉]/.test(s.f))
  .forEach(s => L('  ' + s.id.padEnd(14) + s.f + '  ' + s.n));

L('');
L('=== 名称与化学式明显不符（抽查含 ClO / NH4 / OH 的碱） ===');
DB.SUBSTANCES.filter(s => s.f && (/ClO/.test(s.f) || /NH/.test(s.f) || /OH\)/.test(s.f)))
  .slice(0, 30).forEach(s => L('  ' + s.id.padEnd(14) + (s.f || '').padEnd(16) + s.n));

fs.writeFileSync(path.join(__dirname, 'data-audit.out'), out.join('\n'), 'utf8');
console.log(out.join('\n'));
