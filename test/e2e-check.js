/* 端到端验证新增交互：任意物质、反应对象选择、回溯快照 */
const fs = require('fs');
const path = require('path');
global.window = undefined;
require(path.join(__dirname, '..', 'data.js'));
require(path.join(__dirname, '..', 'reactions-data.js'));
require(path.join(__dirname, '..', 'game.js'));
const DB = global.ChemDB, G = global.ChemGame;
const out = [];

const ps = [{ id: 0, name: 'A', bot: false }, { id: 1, name: 'B', bot: false }, { id: 2, name: 'C', bot: false }];
const st = G.startGame({ players: ps, mode: 'chain', seed: 42, special: true, people: true, ops: true, dlcSubstance: true });
while (st.phase === 'draw') G.drawAll(st);
const filler = () => ({ id: 'f' + Math.random().toString(36).slice(2), kind: 'sub', sub: 'NaCl', real: null });

st.turn = 0;
st.bench = [{ id: 'HCl', gen: 1, valid: true }];
st.players[0].hand = [{ id: 'w1', kind: 'sub', sub: 'WILD', real: null }, filler(), filler(), filler()];
out.push('1) 任意物质是否可出: ' + G.playableCards(st, 0).canPlay['w1']);
out.push('2) 候选: ' + G.benchReactionOptions(st, st.players[0].hand).slice(0, 3)
  .map(o => DB.label(o.targets[0]) + ' → ' + o.equation).join(' | '));
G.setWild(st, 0, 'w1', 'NaOH');
out.push('3) 指定为 NaOH 后出牌: ' + G.playCards(st, 0, ['w1']).ok);
out.push('4) 日志: ' + st.log[st.log.length - 1].text);

st.turn = 1;
st.bench = [{ id: 'HCl', gen: 1, valid: true }, { id: 'H2SO4', gen: 1, valid: true }];
st.players[1].hand = [{ id: 'n1', kind: 'sub', sub: 'NaOH', real: null }, filler(), filler(), filler()];
const opts = G.benchReactionOptions(st, st.players[1].hand);
out.push('5) 多对象: ' + opts.map(o => DB.label(o.targets[0]) + ' → ' + o.equation).join(' | '));
const rA = G.playCards(st, 1, ['n1'], { anchor: 'HCl' });
out.push('6) 选 HCl 出牌: ' + rA.ok + ' → ' + (rA.ok ? st.log[st.log.length - 1].text : rA.reason));

/* 多选凑数检测：所选牌里哪些真正参与反应（UI 会据此弹确认框） */
st.turn = 2;
st.bench = [{ id: 'HCl', gen: 1, valid: true }];
st.players[2].hand = [
  { id: 'm1', kind: 'sub', sub: 'NaOH', real: null },
  { id: 'm2', kind: 'sub', sub: 'H2SO4', real: null },
  { id: 'm3', kind: 'sub', sub: 'Cu', real: null }
];
const multi = G.benchReactionOptions(st, [st.players[2].hand[0], st.players[2].hand[1]]);
out.push('7) 多选 (NaOH + H₂SO₄) 的可选反应: ' +
  multi.map(o => o.equation + '〔本反应实际用到：' + o.usedIds.map(x => DB.label(x)).join('+') + '〕').join(' | '));
const chosen = multi[0];
const usedSet = {}; (chosen ? chosen.usedIds : []).forEach(x => { usedSet[x] = 1; });
const extra = [st.players[2].hand[0], st.players[2].hand[1]]
  .filter(c => !usedSet[c.id] && !usedSet[c.real || c.sub]);
out.push('8) 不参与反应的凑数牌: ' + (extra.length ? extra.map(c => DB.label(c.sub)).join('、') : '无') +
  '（界面会先弹确认框提醒）');

/* 离子适配检查 */
function count(pred) {
  const perm = {};
  DB.SUBSTANCES.filter(pred).forEach(s => { perm[s.id] = 1; });
  return {
    subs: Object.keys(perm).length,
    asReactant: DB.REACTIONS.filter(r => r.r.some(x => perm[x])).length,
    total: DB.REACTIONS.filter(r => r.r.concat(r.p).some(x => perm[x])).length
  };
}
out.push('');
out.push('离子适配（物质数 / 可作为反应物 / 涉及反应）');
[['F⁻', s => s.el && s.el.indexOf('F') >= 0],
['CH₃COO⁻', s => s.id.indexOf('CH3COO') >= 0],
['C₂O₄²⁻', s => s.id.indexOf('C2O4') >= 0],
['NH₄⁺', s => s.n && s.n.indexOf('铵') >= 0],
['Ba²⁺', s => s.el && s.el.indexOf('Ba') >= 0]
].forEach(function (x) {
  const c = count(x[1]);
  out.push('  ' + x[0].padEnd(9) + c.subs + ' / ' + c.asReactant + ' / ' + c.total);
});
out.push('');
out.push('规模：物质 ' + DB.SUBSTANCES.length + ' 种，反应 ' + DB.REACTIONS.length + ' 条，分解反应 ' +
  DB.REACTIONS.filter(r => r.t === '分解').length + ' 条，牌表 ' + DB.CARD_TABLE.length + ' 种');

/* 钙盐适配情况 */
out.push('');
out.push('钙相关物质（化学式 / 名称 / 可溶性 / 作反应物次数 / 作产物次数）');
DB.SUBSTANCES.filter(s => s.el && s.el.indexOf('Ca') >= 0).forEach(function (s) {
  out.push('  ' + (s.f || '').padEnd(16) + (s.n || '').padEnd(12) + s.sol + '  ' +
    String(DB.REACTIONS.filter(r => r.r.indexOf(s.id) >= 0).length).padStart(2) + '  ' +
    String(DB.REACTIONS.filter(r => r.p.indexOf(s.id) >= 0).length).padStart(2));
});
fs.writeFileSync(path.join(__dirname, 'e2e.out'), out.join('\n'), 'utf8');
console.log(out.join('\n'));
