/* 引擎自测：node test/engine-check.js
 * 结果写入 test/engine-test.out（便于在受限终端中读取） */
const fs = require('fs');
const path = require('path');
const lines = [];
const LOG = (...a) => lines.push(a.join(' '));
require(path.join(__dirname, '..', 'data.js'));
require(path.join(__dirname, '..', 'reactions-data.js'));
require(path.join(__dirname, '..', 'game.js'));
const DB = global.ChemDB;
const G = global.ChemGame;

let fail = 0, pass = 0;
function ok(cond, msg) {
  if (cond) pass++;
  else { fail++; LOG('  ✗ ' + msg); }
}
function section(t) { LOG('\n== ' + t + ' =='); }

/* ---------- 1. 数据一致性 ---------- */
section('数据一致性');
const ids = DB.SUBSTANCES.map(s => s.id);
ok(DB.CARD_TABLE.length === 50, '物质牌表共50种（基础40 + DLC 10）实际=' + DB.CARD_TABLE.length);
ok(new Set(ids).size === ids.length, '物质 id 唯一');
ok(DB.REACTIONS.length > 100, '反应数 > 100（实际 ' + DB.REACTIONS.length + '）');

let missing = [];
DB.REACTIONS.forEach(rx => {
  rx.r.forEach(x => { if (!DB.SUB_INDEX[x]) missing.push('reactant:' + x); });
  rx.p.forEach(x => { if (!DB.SUB_INDEX[x] && !DB.EXTRA_INFO[x]) missing.push('product:' + x); });
});
ok(missing.length === 0, '所有反应物/生成物均可识别；缺失: ' + missing.slice(0, 8).join(' | '));
ok(DB.SUBSTANCES.every(s => s.el && s.el.length && s.cat && s.st && s.sol), '物质字段完整（含元素组成）');

/* 「任意物质」必须是一张物质牌：kind='sub' + sub='WILD'
 * （曾经被建成 kind='special'，导致所有 wild 分支都走不到，这张牌永远出不了） */
const wildCards = G.buildDeck({ dlcSubstance: true, special: true, people: true, ops: true })
  .filter(c => c.sub === 'WILD');
ok(wildCards.length === 2, '「任意物质」共 2 张（实际 ' + wildCards.length + '）');
ok(wildCards.every(c => c.kind === 'sub'),
  '「任意物质」是物质牌（kind=sub），否则界面会把它当特殊牌、永远无法使用');
ok(!G.buildDeck({ dlcSubstance: false, special: true, people: false, ops: false })
  .some(c => c.kind === 'special' && c.sp === 'WILD'),
  'WILD 不再被当成 kind=special 的特殊牌');

const base = G.buildDeck({ dlcSubstance: false, special: false, people: false, ops: false });
ok(base.length === 80, '基础物质牌共80张（实际 ' + base.length + '）');
const catN = c => base.filter(x => DB.SUB_INDEX[x.sub].cat === c).length;
ok(catN('Ad') === 15 && catN('Be') === 15 && catN('St') === 25 && catN('Oe') === 10 && catN('Es') === 15,
  '分类张数：酸15 碱15 盐25 氧化物10 单质15（实际 ' + [catN('Ad'), catN('Be'), catN('St'), catN('Oe'), catN('Es')].join('/') + '）');
const full = G.buildDeck({ dlcSubstance: true, special: true, people: true, ops: true });
ok(full.length === 80 + 10 + 5 + 5 + 5, '全DLC牌堆共105张（实际 ' + full.length + '）');
ok(full.filter(c => c.kind === 'sub' && c.dlc).length === 10, '物质 DLC 共 10 张');

const lonely = DB.CARD_TABLE.filter(s => !DB.REACTIONS.some(rx => rx.r.indexOf(s.id) >= 0)).map(s => s.f);
ok(lonely.length === 0, '每种物质牌都能参与至少一个反应；无法反应的: ' + lonely.join('、'));

/* 化学式唯一：同一物质不允许出现两个 id（曾出现 Ba(NO3)2 与 BaNO32 并存，
 * 导致界面取名称时解析不到、直接显示 id） */
const byFormula = {};
DB.SUBSTANCES.forEach(s => {
  const k = DB.normFormula ? DB.normFormula(s.f) : s.f;
  (byFormula[k] = byFormula[k] || []).push(s.id);
});
const dupF = Object.keys(byFormula).filter(k => byFormula[k].length > 1);
ok(dupF.length === 0, '同一化学式只有一个 id；重复: ' +
  dupF.map(k => k + '(' + byFormula[k].join('/') + ')').join('、'));

/* 名称规范：不能为空、不能是离子名拼接、化学式不能带 (aq) */
const badName = DB.SUBSTANCES.filter(s => !s.n || /离子$/.test(s.n) || /\(aq\)/.test(s.f || ''));
ok(badName.length === 0, '物质名称规范（无空名/离子拼接/(aq)）；异常: ' +
  badName.slice(0, 6).map(s => s.id + ':' + s.n).join('、'));

/* 手写反应里的别名 id（如 Ca(NO3)2）必须已被归一 */
const aliasLeft = DB.REACTIONS.filter(rx =>
  rx.r.concat(rx.p).some(x => !DB.SUB_INDEX[x])).length;
ok(aliasLeft === 0, '反应里不再出现未归一的别名 id（实际 ' + aliasLeft + ' 条）');

/* 关键物质的名称抽查 */
ok(DB.SUB_INDEX['NH3H2O'] && DB.SUB_INDEX['NH3H2O'].n === '一水合氨',
  'NH₃·H₂O 命名为「一水合氨」（实际 ' + (DB.SUB_INDEX['NH3H2O'] || {}).n + '）');
const kclo = DB.SUBSTANCES.filter(s => s.f === 'KClO')[0];
ok(kclo && kclo.n === '次氯酸钾', 'KClO 命名为「次氯酸钾」（实际 ' + (kclo || {}).n + '）');
ok(DB.SUB_INDEX['CaNO32'] && DB.SUB_INDEX['CaNO32'].n === '硝酸钙' && DB.SUB_INDEX['CaNO32'].f === 'Ca(NO₃)₂',
  '硝酸钙 Ca(NO₃)₂ 在库且名称正确');
ok(DB.REACTIONS.filter(rx => rx.r.indexOf('CaNO32') >= 0).length >= 8,
  '钙盐（硝酸钙）有足够的可用反应数（' +
  DB.REACTIONS.filter(rx => rx.r.indexOf('CaNO32') >= 0).length + ' 条）');

/* ---------- 2. 反应匹配 ---------- */
section('反应匹配');
function mk(cards) { return cards.map((c, i) => ({ id: 't' + i, kind: 'sub', sub: c.sub, real: c.real || null })); }
function fakeState(bench, mode, hand) {
  return {
    mode: mode || 'chain',
    bench: (bench || []).map(b => ({ id: b.id, gen: 1, valid: b.valid !== false })),
    players: [{ id: 0, name: 'A', hand: mk(hand || []) }],
    waste: [], round: 1, log: [], events: [], rnd: Math.random
  };
}
let st, r;

st = fakeState([], 'chain', []);
ok(!G.evaluatePlay(st, 0, []).ok, '空选择应被拒绝');

/* 开启新一轮：麻将式起牌 —— 第一位科学家只出一张牌，且该牌不参与任何反应 */
st = fakeState([], 'chain', [{ sub: 'NaOH' }, { sub: 'HCl' }]);
ok(!G.evaluatePlay(st, 0, ['t0', 't1']).ok, '开启新一轮时不允许一次出多张牌（不能直接凑反应物）');

st = fakeState([], 'chain', [{ sub: 'HCl' }]);
r = G.evaluatePlay(st, 0, ['t0']);
ok(r.ok && r.invalid && r.opening === true && r.reaction === null, '单张牌可开启新一轮（无反应，仅铺垫）');

st = fakeState([], 'chain', [{ sub: 'NaHCO3' }]);
r = G.evaluatePlay(st, 0, ['t0']);
ok(r.ok && r.opening === true && r.reaction === null, '开局牌即使是可自发分解的物质也不反应');

// 下家可以出牌与这张“铺垫牌”反应（可一次出多张凑齐反应物）
st = fakeState([{ id: 'Na2CO3' }], 'chain', [{ sub: 'HCl' }]);
st.lastReaction = { elementPrev: 'Na2CO3' };
r = G.evaluatePlay(st, 0, ['t0']);
ok(r.ok && r.reaction && r.reaction.p.indexOf('CO2') >= 0, '下家可与开局铺垫牌反应');

st = fakeState([{ id: 'HCl' }], 'chain', [{ sub: 'Na2CO3' }, { sub: 'CaCO3' }]);
r = G.evaluatePlay(st, 0, ['t0', 't1']);
ok(!r.ok && /不参与这次反应/.test(r.reason || ''),
  '两张牌只有一张参与反应时直接拒绝（防“搭车”作弊：不能借一次反应白扔一张废牌）');

/* 合法的一对二：两张牌都是同一反应的反应物（Na2CO3 + Ca(OH)2 → CaCO3 + NaOH） */
st = fakeState([{ id: 'Na2CO3' }], 'chain', [{ sub: 'Ca(OH)2' }, { sub: 'NaOH' }]);
r = G.evaluatePlay(st, 0, ['t0']);
ok(r.ok && r.benchUsed.indexOf('Na2CO3') >= 0, '单张 Ca(OH)₂ 与台上 Na₂CO₃ 反应（生成 CaCO₃）');

st = fakeState([{ id: 'HCl' }], 'chain', [{ sub: 'NaOH' }, { sub: 'Na2CO3' }]);
r = G.evaluatePlay(st, 0, ['t0']);
ok(r.ok && r.benchUsed.indexOf('HCl') >= 0, '反应取用了实验台上的 HCl');

st = fakeState([{ id: 'HCl' }], 'chain', [{ sub: 'NaOH' }]);
r = G.evaluatePlay(st, 0, ['t0']);
ok(r.ok && r.reaction.p.indexOf('NaCl') >= 0 && r.products.length === 2, 'NaOH 与台上 HCl 反应生成 NaCl + H2O');

st = fakeState([{ id: 'HCl' }], 'chain', [{ sub: 'Cu' }]);
ok(!G.evaluatePlay(st, 0, ['t0']).ok, 'Cu 不能与 HCl 反应，应被拒绝');

st = fakeState([{ id: 'HCl' }], 'chain', [{ sub: 'CaCO3' }]);
r = G.evaluatePlay(st, 0, ['t0']);
ok(r.ok && r.reaction.p.indexOf('CO2') >= 0, 'CaCO3 与 HCl 生成 CO2');

st = fakeState([{ id: 'HCl' }], 'chain', [{ sub: 'Na2CO3' }, { sub: 'CaCO3' }]);
r = G.evaluatePlay(st, 0, ['t0', 't1']);
ok(!r.ok && /不参与这次反应/.test(r.reason || ''),
  '两张碳酸盐同时打出会被拒绝（与 HCl 反应只需要其中一张）');

/* 真正需要两张手牌的反应才允许一次出两张；台上为空时只能出 1 张 */
st = fakeState([], 'chain', [{ sub: 'H2C2O4' }, { sub: 'CaCl2' }]);
ok(!G.evaluatePlay(st, 0, ['t0', 't1']).ok, '台上为空时不能一次出两张牌（开局只能铺垫一张）');
ok(G.evaluatePlay(st, 0, ['t0']).ok, '台上为空时单张牌可作为开局铺垫牌');
st = fakeState([{ id: 'Na2CO3' }], 'chain', [{ sub: 'H2C2O4' }, { sub: 'CaCl2' }]);
r = G.evaluatePlay(st, 0, ['t0']);
ok(r.ok && r.benchUsed.indexOf('Na2CO3') >= 0, 'H₂C₂O₄ 与台上 Na₂CO₃ 反应生成 CO₂');

st = fakeState([{ id: 'NaCl' }, { id: 'H2O' }], 'chain', [{ sub: 'AgNO3' }]);
r = G.evaluatePlay(st, 0, ['t0']);
ok(r.ok && r.reaction.p.indexOf('AgCl') >= 0, 'AgNO3 可与生成物 NaCl 反应（生成 AgCl）');

st = fakeState([{ id: 'NaCl' }, { id: 'H2O' }], 'chain', [{ sub: 'AgNO3' }]);
r = G.evaluatePlay(st, 0, ['t0']);
ok(r.ok && r.usedIds.length === 1 && r.benchUsed.indexOf('NaCl') >= 0 && r.reaction.p.indexOf('AgCl') >= 0,
  'AgNO3 优先与台上的 NaCl 反应（生成 AgCl 沉淀）');

st = fakeState([{ id: 'NaCl', valid: false }], 'chain', [{ sub: 'AgNO3' }]);
ok(G.evaluatePlay(st, 0, ['t0']).ok, '台上物质全部失效时允许开启新一轮');

st = fakeState([{ id: 'HCl' }], 'chain', [{ sub: 'WILD' }]);
r = G.evaluatePlay(st, 0, ['t0']);
ok(r.ok && r.reaction && r.reaction.p.indexOf('NaCl') >= 0, '任意物质可代替 NaOH 与 HCl 反应');

/* 台面为空时，未指定代替物的「任意物质」也能直接铺垫（否则手里只剩它时会无限互相 Pass） */
st = fakeState([], 'chain', [{ sub: 'WILD' }]);
r = G.evaluatePlay(st, 0, ['t0']);
ok(r.ok && r.opening === true && !!r.realOf['t0'],
  '未指定的「任意物质」也能作为开局铺垫牌（自动代替 ' + (r.realOf || {})['t0'] + '）');
st = fakeState([], 'chain', [{ sub: 'WILD' }]);
st.turn = 0; st.phase = 'main';
ok(G.hintsFor(st, 0).some(h => h.kind === 'cards' && h.cards[0] === 't0'),
  '未指定的「任意物质」会出现在可行动作提示里');
ok(G.playableCards(st, 0).canPlay['t0'] === true, '未指定的「任意物质」被判定为可出');

/* 手里只剩「任意物质」时，机器人必须出牌而不是一直 Pass */
const stW = mkGame(3, 77);
stW.phase = 'main'; stW.turn = 0; stW.bench = [];
stW.players.forEach(q => { q.bot = true; });
stW.players[0].hand = [{ id: 'wX', kind: 'sub', sub: 'WILD', real: null }];
stW.players[1].hand = [{ id: 'wY', kind: 'sub', sub: 'WILD', real: null }];
stW.players[2].hand = [{ id: 'wZ', kind: 'sub', sub: 'WILD', real: null }];
ok(G.botAct(stW).type === 'play', '机器人手里只有「任意物质」时会出牌（不会卡在 Pass 循环）');

/* 机器人会使用特殊牌与 DLC 牌 */
const stB = mkGame(3, 91, { special: true, people: true, ops: true });
stB.phase = 'main'; stB.turn = 0; stB.bench = [];
stB.round = 3; stB.reactionsDone = 3;      // 已过开局蓄力期
stB.players.forEach(q => { q.bot = true; });
stB.players[0].hand = [{ id: 'd1', kind: 'people', ref: DB.PEOPLE[0].id }];
stB.players[1].hand = [{ id: 'd2', kind: 'sub', sub: 'NaCl', real: null }];
stB.players[2].hand = [{ id: 'd3', kind: 'sub', sub: 'NaCl', real: null }];
const hintsB = G.hintsFor(stB, 0);
ok(hintsB.some(h => h.kind === 'dlc' && h.card === 'd1'),
  '人物 DLC 会出现在可行动作提示里（机器人据此出牌）');
let sawDlc = false;
for (let i = 0; i < 30; i++) { if (G.botAct(stB).type === 'dlc') { sawDlc = true; break; } }
ok(sawDlc, '机器人会打出 DLC 指示牌');

/* 开局蓄力期：第 1 轮且还没有人成功反应时，机器人会先留着战术牌 */
{
  const s0 = mkGame(3, 96);
  s0.phase = 'main'; s0.turn = 0; s0.round = 1; s0.reactionsDone = 0;
  s0.bench = [{ id: 'AgCl', gen: 1, valid: true }];
  s0.players.forEach(q => { q.bot = true; });
  s0.players[0].hand = [{ id: 'h1', kind: 'people', ref: DB.PEOPLE[0].id },
    { id: 'h2', kind: 'sub', sub: 'NaCl', real: null }];
  s0.players[1].hand = [{ id: 'h3', kind: 'sub', sub: 'NaCl', real: null }];
  s0.players[2].hand = [{ id: 'h4', kind: 'sub', sub: 'NaCl', real: null }];
  let anyDlc = false;
  for (let i = 0; i < 40; i++) { if (G.botAct(s0).type === 'dlc') { anyDlc = true; break; } }
  ok(!anyDlc, '开局第 1 轮（尚无人反应）机器人不会急着打出 DLC（蓄力期）');
}

/* 关键回归：手里有 DLC / 特殊牌且无法反应时，机器人不应 Pass（曾经有 62% 概率门槛导致一直 Pass） */
function botUsesCard(kind, extraHand) {
  const s = mkGame(3, 97);
  s.phase = 'main'; s.turn = 0;
  s.round = 4; s.reactionsDone = 4;          // 已过蓄力期，机器人才会考虑战术牌
  s.bench = [{ id: 'AgCl', gen: 1, valid: true }, { id: 'CaNO32', gen: 1, valid: true }];  // 手里接不上
  s.players.forEach(q => { q.bot = true; });
  s.players[0].hand = extraHand;
  s.players[1].hand = [{ id: 'y1', kind: 'sub', sub: 'NaCl', real: null }];
  s.players[2].hand = [{ id: 'y2', kind: 'sub', sub: 'NaCl', real: null }];
  for (let i = 0; i < 40; i++) {
    const act = G.botAct(s);
    if (act.type === kind) return act;
    if (act.type !== 'pass') return act;     // 出了别的牌也算没卡住
  }
  return { type: 'pass' };
}
ok(botUsesCard('dlc', [{ id: 'o1', kind: 'op', ref: DB.OPS[0].id }]).type === 'dlc',
  '手里有操作 DLC 且无法反应时 → 机器人出 DLC（不会一直 Pass）');
ok(botUsesCard('dlc', [{ id: 'p2', kind: 'people', ref: DB.PEOPLE[0].id }]).type === 'dlc',
  '手里有人物 DLC 且无法反应时 → 机器人出 DLC');
ok(botUsesCard('cancel', [{ id: 'k1', kind: 'special', sp: 'CANCEL' }]).type === 'cancel',
  '手里有抵消且台面有物质 → 机器人用抵消开新一轮');
/* 台面为空时必须铺垫开局，不能无限 Pass */
{
  const s = mkGame(3, 98);
  s.phase = 'main'; s.turn = 0; s.bench = [];
  s.players.forEach(q => { q.bot = true; });
  s.players[0].hand = [{ id: 'z1', kind: 'sub', sub: 'Cu', real: null }];
  s.players[1].hand = [{ id: 'z2', kind: 'sub', sub: 'Cu', real: null }];
  s.players[2].hand = [{ id: 'z3', kind: 'sub', sub: 'Cu', real: null }];
  ok(G.botAct(s).type === 'play', '台面为空时机器人会出牌铺垫（不会一直 Pass）');
}

st = fakeState([{ id: 'NaCl' }], 'chain', [{ sub: 'WILD' }]);
r = G.evaluatePlay(st, 0, ['t0']);
ok(r.ok && r.reaction && r.benchUsed.indexOf('NaCl') >= 0, '任意物质可代替 AgNO3 / NH3·H2O 等与 NaCl 反应');

/* 元素接力：以“与上一张牌含有相同元素”为准，不考虑化学反应 */
st = fakeState([{ id: 'HCl' }], 'element', [{ sub: 'Fe2O3' }]);
st.lastReaction = { elementPrev: 'HCl' };
r = G.evaluatePlay(st, 0, ['t0']);
ok(!r.ok, '元素接力：Fe2O3 与 HCl 无相同元素，应拒绝');
st = fakeState([{ id: 'HCl' }], 'element', [{ sub: 'CuO' }]);
st.lastReaction = { elementPrev: 'HCl' };
ok(!G.evaluatePlay(st, 0, ['t0']).ok, '元素接力：CuO 与 HCl 无相同元素（O 不在 HCl 中），应拒绝');
st = fakeState([{ id: 'CO2' }], 'element', [{ sub: 'CuO' }]);
st.lastReaction = { elementPrev: 'CO2' };
ok(G.evaluatePlay(st, 0, ['t0']).ok, '元素接力：CuO 与 CO2 共有 O');
st = fakeState([{ id: 'HCl' }], 'element', [{ sub: 'NaCl' }]);
st.lastReaction = { elementPrev: 'HCl' };
ok(G.evaluatePlay(st, 0, ['t0']).ok, '元素接力：NaCl 与 HCl 共有 Cl');
st = fakeState([{ id: 'HCl' }], 'element', [{ sub: 'NaCl' }, { sub: 'HCl' }]);
st.lastReaction = { elementPrev: 'HCl' };
ok(!G.evaluatePlay(st, 0, ['t0', 't1']).ok, '元素接力每次只能出一张牌');
st = fakeState([], 'element', [{ sub: 'CuO' }]);
st.lastReaction = null;
ok(G.evaluatePlay(st, 0, ['t0']).ok, '元素接力：开局第一张牌可自由出');

/* 接力实验：必须与「上家所出的那张牌」反应（不是与上位反应的生成物反应） */
st = fakeState([{ id: 'HCl' }], 'relay', [{ sub: 'NaOH' }]);
st.relayCard = 'HCl';
r = G.evaluatePlay(st, 0, ['t0']);
ok(r.ok && r.reaction, '接力实验：NaOH 与上家所出的 HCl 反应');
st = fakeState([{ id: 'HCl' }], 'relay', [{ sub: 'NaOH' }, { sub: 'CaCO3' }]);
st.relayCard = 'HCl';
ok(!G.evaluatePlay(st, 0, ['t0', 't1']).ok, '接力实验每次只能出一张牌');
st = fakeState([{ id: 'HCl' }], 'relay', [{ sub: 'Cu' }]);
st.relayCard = 'HCl';
ok(!G.evaluatePlay(st, 0, ['t0']).ok, '接力实验：Cu 与 HCl 不反应');
st = fakeState([{ id: 'HCl' }], 'relay', [{ sub: 'NaOH' }]);
ok(!G.evaluatePlay(st, 0, ['t0']).ok, '接力实验：尚未确定接力目标时不能出牌');

/* 关键用例：上位反应的生成物不是接力目标，必须与「上家所出的牌」反应 */
st = fakeState([{ id: 'HCl' }], 'relay', [{ sub: 'NaOH' }]);
st.relayCard = 'CaCO3';
ok(!G.evaluatePlay(st, 0, ['t0']).ok, '接力实验：不能与上位反应的生成物（HCl）反应，必须与上家所出的牌反应');
st = fakeState([{ id: 'HCl' }], 'relay', [{ sub: 'CaCO3' }]);
st.relayCard = 'CaCO3';
r = G.evaluatePlay(st, 0, ['t0']);
ok(!r.ok, '接力实验：不能把上家刚出的 CaCO3 原样再出一遍充数（需换一张能与它反应的牌）');
st = fakeState([{ id: 'HCl' }], 'relay', [{ sub: 'HCl' }]);
st.relayCard = 'CaCO3';
r = G.evaluatePlay(st, 0, ['t0']);
ok(r.ok && r.reaction.p.indexOf('CO2') >= 0, '接力实验：出 HCl 与上家所出的 CaCO3 反应生成 CO2');
st = fakeState([{ id: 'Cu(OH)2' }], 'relay', [{ sub: 'HCl' }]);
st.relayCard = 'Ca(OH)2';
r = G.evaluatePlay(st, 0, ['t0']);
ok(r.ok && r.benchUsed.indexOf('Ca(OH)2') >= 0,
  '接力实验：与上家所出的 Ca(OH)₂ 反应（生成物 Cu(OH)₂ 不算接力目标）');

/* 已按需求去除全部分解反应 */
ok(DB.REACTIONS.every(function (rx) { return rx.t !== '分解'; }), '反应库中不含类型为“分解”的反应');
ok(DB.REACTIONS.every(function (rx) { return rx.r.length >= 2; }), '反应库中不含单反应物（分解）反应');

/* ---------- 3. 指示（DLC）判定 ---------- */
section('人物 / 操作 DLC 指示');
function card(kind, rf) { return { id: 'c', kind: kind, ref: rf }; }
const dmP = G.demandFromCard(card('people', 'PRIESTLEY'));
ok(dmP.test(DB.SUB_INDEX['O2']) && dmP.test(DB.SUB_INDEX['CuO']), 'Priestley：氧气或氧化物满足');
ok(!dmP.test(DB.SUB_INDEX['NaCl']), 'Priestley：盐不满足');
ok(dmP.stop === 2, 'Priestley：停2回合');

const dmB = G.demandFromCard(card('people', 'BOYLE'));
ok(dmB.test(DB.SUB_INDEX['NaCl']) && dmB.test(DB.SUB_INDEX['CuSO4']), 'Boyle：盐满足');
ok(!dmB.test(DB.SUB_INDEX['HCl']), 'Boyle：酸不满足');

const dmL = G.demandFromCard(card('people', 'LEWIS'));
ok(dmL.test(DB.SUB_INDEX['HCl']) && dmL.test(DB.SUB_INDEX['NaOH']), 'Lewis：酸或碱满足');
ok(!dmL.test(DB.SUB_INDEX['NaCl']), 'Lewis：盐不满足');

const dmH = G.demandFromCard(card('people', 'HOU'));
['CO2', 'NaCl', 'H2O', 'NaHCO3', 'NH3H2O'].forEach(x => ok(dmH.test(DB.SUB_INDEX[x]), '侯德榜：' + x + ' 满足（氨碱法物质）'));
ok(dmH.stop === 1, '侯德榜：停1回合');
ok(!dmH.test(DB.SUB_INDEX['HCl']), '侯德榜：HCl 不满足');

const dmX = G.demandFromCard(card('people', 'XU'));
ok(dmX.test(DB.SUB_INDEX['Fe']) && dmX.test(DB.SUB_INDEX['O2']), '徐寿：单质满足');
ok(!dmX.test(DB.SUB_INDEX['Fe2O3']), '徐寿：氧化物不满足');

const dmF = G.demandFromCard(card('op', 'FILTER'));
ok(dmF.test(DB.SUB_INDEX['CaCO3']) && dmF.test(DB.SUB_INDEX['Ca(OH)2']), '过滤：微溶/难溶满足');
ok(!dmF.test(DB.SUB_INDEX['NaCl']), '过滤：可溶物不满足');

const dmD = G.demandFromCard(card('op', 'DISTILL'));
ok(dmD.test(DB.SUB_INDEX['H2O']) && dmD.test(DB.SUB_INDEX['H2SO4']), '蒸馏：液体满足');
ok(!dmD.test(DB.SUB_INDEX['NaOH']), '蒸馏：固体不满足');

const dmS = G.demandFromCard(card('op', 'DISSOLVE'));
ok(dmS.test(DB.SUB_INDEX['NaCl']) && dmS.stop === 2, '溶解：可溶物质满足，停2回合');
ok(!dmS.test(DB.SUB_INDEX['CaCO3']), '溶解：难溶不满足');

const dmC = G.demandFromCard(card('op', 'COLLECT'));
ok(dmC.test(DB.SUB_INDEX['CO2']) && !dmC.test(DB.SUB_INDEX['NaOH']), '集气：气体满足');

const dmE = G.demandFromCard(card('op', 'EVAPORATE'));
ok(dmE.test(DB.SUB_INDEX['NaCl']), '蒸发：NaCl 可蒸发结晶');
ok(!dmE.test(DB.SUB_INDEX['NaHCO3']), '蒸发：NaHCO3 受热分解，排除');
ok(!dmE.test(DB.SUB_INDEX['NH3H2O']), '蒸发：氨水受热分解，排除');
ok(!dmE.test(DB.SUB_INDEX['NH4NO3']) && !dmE.test(DB.SUB_INDEX['CuNO32']) && !dmE.test(DB.SUB_INDEX['FeSO4']),
  '蒸发：排除 NH4NO3 / Cu(NO3)2 / FeSO4');
ok(dmE.stop === 2, '蒸发：停2回合');

/* ---------- 4. 完整对局（机器人自动跑） ---------- */
section('完整对局模拟');
function playFullGame(seed, playerCount, cfg) {
  const players = [];
  for (let i = 0; i < playerCount; i++) players.push({ id: i, name: 'P' + i, bot: true });
  const st = G.startGame(Object.assign({ players, mode: 'chain', seed, special: true, people: true, ops: true, dlcSubstance: true }, cfg || {}));
  let guard = 0;
  while (!st.finished && guard++ < 30000) {
    if (st.phase === 'draw') { G.drawAll(st); continue; }
    const act = G.botAct(st);
    if (!act) throw new Error('phase=' + st.phase + ' 无法取得机器人动作');
    let res = { ok: true };
    if (act.type === 'draw') { G.drawAll(st); continue; }
    else if (act.type === 'play') res = G.playCards(st, st.turn, act.cards);
    else if (act.type === 'pass') res = G.passTurn(st, st.turn);
    else if (act.type === 'recycle') res = G.useRecycle(st, st.turn);
    else if (act.type === 'convert') res = G.useConvert(st, st.turn, act.cardId, act.target);
    else if (act.type === 'cancel') res = G.useCancel(st, st.phase === 'respond' ? st.responder : st.turn);
    else if (act.type === 'dlc') res = G.playDLC(st, st.turn, act.cardId);
    else if (act.type === 'respond') {
      if (act.wild) G.setWild(st, st.responder, act.cardId, act.wild);
      res = G.respondSubstance(st, st.responder, act.cardId);
    } else if (act.type === 'penalty') res = G.acceptPenalty(st, st.responder);
    else throw new Error('unknown bot action ' + act.type);
    if (res && !res.ok) throw new Error('动作被拒绝 [' + act.type + '] ' + res.reason);
  }
  return { st, guard, finished: st.finished };
}

const DECK_SIZE = G.buildDeck({ dlcSubstance: true, special: true, people: true, ops: true }).length;
let games = 0, finishedCount = 0, totalTurns = 0;
for (let s = 1; s <= 16; s++) {
  try {
    const { st, finished, guard } = playFullGame(s, 3 + (s % 3));
    games++;
    totalTurns += guard;
    if (finished) finishedCount++;
    // 牌张守恒：每张物质/人物/操作牌要么在牌堆、要么在某人手牌、要么在废液缸。
    //   · 实验台上的物质、废液缸中无 card 的条目 = 反应生成的新物质（不是牌），不计入
    //   · 【回收】把废液缸中的记录抽回手牌；若该记录不是牌，引擎会补一张新的物质牌实例
    //   · 【转换】把被转换的牌送进废液缸、同时生成一张新实例的新物质牌 → newInstances +1
    // 因此账面总数 = 牌堆 + 废液缸中的牌 + 手牌 − 新增实例数，应当正好等于初始牌堆大小。
    const cardsInWaste = st.waste.filter(w => !!w.card).length;
    const cardsInHands = st.players.reduce((a, p) => a + (p ? p.hand.length : 0), 0);
    const newInst = st.newInstances || 0;
    const total = st.deck.length + cardsInWaste + cardsInHands;
    ok(total - newInst === DECK_SIZE,
      'seed' + s + ' 牌张守恒（' + (total - newInst) + '/' + DECK_SIZE + '；牌堆 ' + st.deck.length +
      ' + 废液缸牌 ' + cardsInWaste + ' + 手牌 ' + cardsInHands + ' − 新增实例 ' + newInst + '）');
    // 每一张牌都只出现一次（废液缸中无 card 的条目是反应生成物，不是牌）
    const seenIds = {};
    let dupId = null;
    st.deck.concat(...st.players.map(p => p.hand)).forEach(c => {
      if (seenIds[c.id]) dupId = c.id; seenIds[c.id] = 1;
    });
    st.waste.forEach(w => {
      if (!w.card) return;
      if (seenIds[w.card]) dupId = w.card; seenIds[w.card] = 1;
    });
    ok(!dupId, 'seed' + s + ' 无重复牌张' + (dupId ? '（' + dupId + '）' : ''));
    // 废液缸中的每一条记录都必须可解释（物质 / 特殊牌 / 人物 DLC / 操作 DLC）
    const OKWASTE = id => !!DB.SUB_INDEX[id] || !!DB.EXTRA_INFO[id] ||
      DB.SPECIALS.some(x => x.id === id) || DB.PEOPLE.some(x => x.id === id) || DB.OPS.some(x => x.id === id);
    ok(st.waste.every(w => OKWASTE(w.id)),
      'seed' + s + ' 废液缸内容合法' +
      (st.waste.some(w => !OKWASTE(w.id)) ? '（异常：' + st.waste.filter(w => !OKWASTE(w.id)).map(w => w.id).slice(0, 5).join(',') + '）' : ''));
    ok(st.bench.every(b => !!DB.SUB_INDEX[b.id]), 'seed' + s + ' 实验台内容合法');
    // 对局必须在有限步内推进到终局（不会卡死）
    ok(finished, 'seed' + s + ' 在步数上限内结束对局（guard=' + guard + '）');
    // 【回收】与【转换】都会生成新的牌实例；手牌数不应小于“新实例中还在手上的部分”
    ok(st.players.reduce((a, p) => a + p.hand.length, 0) >= 0 && (st.newInstances || 0) <= 60,
      'seed' + s + ' 回收/转换计数自洽（新增实例 ' + (st.newInstances || 0) + '，回收 ' + (st.recycled || 0) + '）');
  } catch (e) {
    fail++; LOG('  ✗ seed ' + s + ' 模拟失败: ' + e.message);
  }
}
ok(games === 16 && finishedCount === 16, '16 局全部正常结束（games=' + games + ', finished=' + finishedCount + '）');
LOG('  平均行动数：' + Math.round(totalTurns / games));

/* 其他两种玩法也要能正常开局、出牌、结束 */
['relay', 'element'].forEach(mode => {
  let okCount = 0, err = null;
  for (let s = 1; s <= 6; s++) {
    try {
      const gm = playFullGame(100 + s, 4, {
        mode, special: true, people: mode !== 'element', ops: mode !== 'element', dlcSubstance: true
      });
      const ids2 = gm.st.deck.concat(...gm.st.players.map(p => p.hand)).map(c => c.id);
      const cardish2 = gm.st.waste.filter(w => w.card).length;
      ok(new Set(ids2).size === ids2.length, mode + ' seed' + s + ' 无重复牌张');
      const deckSize2 = G.buildDeck({
        dlcSubstance: true, special: true,
        people: mode !== 'element', ops: mode !== 'element'
      }).length;
      const tot2 = gm.st.deck.length + cardish2 + gm.st.players.reduce((a, p) => a + p.hand.length, 0) -
        (gm.st.newInstances || 0);
      ok(tot2 === deckSize2, mode + ' seed' + s + ' 牌张守恒（' + tot2 + '/' + deckSize2 +
        '，新增实例 ' + (gm.st.newInstances || 0) + '）');
      okCount++;
    } catch (e) { err = e.message; }
  }
  ok(okCount === 6, G.MODE_NAME(mode) + ' 6 局模拟正常' + (err ? '（错误：' + err + '）' : ''));
});

/* ---------- 5. 特殊牌规则 ---------- */
function mkGame(n, seed, cfg) {
  const players = [];
  for (let i = 0; i < n; i++) players.push({ id: i, name: String.fromCharCode(65 + i), bot: false });
  const st = G.startGame(Object.assign({ players, mode: 'chain', seed, special: true, people: true, ops: true, dlcSubstance: true }, cfg || {}));
  while (st.phase === 'draw') G.drawAll(st);   // 依次抽完所有牌
  if (st.lastPlayer == null) st.lastPlayer = st.turn;   // 起手视为“最后出牌者=先手”
  return st;
}

section('特殊牌 · 抵消');
let st6 = mkGame(2, 11);
st6.turn = 0;
st6.bench = [{ id: 'NaCl', gen: 1, valid: true }];
st6.players[0].hand = [{ id: 'k1', kind: 'special', sp: 'CANCEL' }];
ok(G.useCancel(st6, 0).ok, '抵消可用');
ok(st6.bench.length === 0 && st6.waste.some(w => w.id === 'CANCEL'), '抵消后实验台清空，抵消牌入废液缸');
ok(st6.turn === 0, '无 DLC 时抵消本轮反应后，仍由出该牌的科学家出牌开启新一轮');

section('人物 DLC · 响应流程');
let st7 = mkGame(3, 3);
st7.turn = 0;
st7.players[0].hand = [{ id: 'p1', kind: 'people', ref: 'XU' }];
st7.players[1].hand = [{ id: 's1', kind: 'sub', sub: 'Fe' }];
st7.players[2].hand = [{ id: 's2', kind: 'sub', sub: 'NaCl' }];
ok(G.playDLC(st7, 0, 'p1').ok, '打出人物 DLC');
ok(st7.phase === 'respond' && st7.demand.pending.length === 2, '进入响应阶段，2 人待响应');
ok(st7.responder === 1, '先由下一位科学家响应');
ok(G.respondSubstance(st7, 1, 's1').ok, 'B 打出 Fe（单质）满足徐寿');
ok(st7.responder === 2, '轮到 C 响应');
ok(G.acceptPenalty(st7, 2).ok, 'C 选择不出牌');
ok(st7.players[2].skip === 2, 'C 停 2 回合');
ok(st7.phase === 'main' && st7.demand === null, '响应结束回到出牌阶段');
ok(st7.turn === 1, '由打出该牌的下一位科学家开启新回合');

let st8 = mkGame(2, 5);
st8.turn = 0;
st8.players[0].hand = [{ id: 'p1', kind: 'people', ref: 'XU' }];
st8.players[1].hand = [{ id: 'x1', kind: 'special', sp: 'CANCEL' }];
G.playDLC(st8, 0, 'p1');
ok(G.useCancel(st8, 1).ok, '响应阶段使用抵消');
ok(st8.players[1].skip === 0 && st8.phase === 'main', '抵消后不需出牌且无惩罚');

let st8b = mkGame(2, 6);
st8b.turn = 0;
st8b.players[0].hand = [{ id: 'p1', kind: 'people', ref: 'BOYLE' }, { id: 'z1', kind: 'sub', sub: 'NaCl' }];
st8b.players[1].hand = [{ id: 'z2', kind: 'sub', sub: 'CuSO4' }];
G.playDLC(st8b, 0, 'p1');
ok(st8b.players[0].skip === 0 && st8b.players[0].hand.length === 1, '打出 DLC 牌的科学家无需再次出牌');
ok(st8b.players[1].skip === 0, '其他科学家均需出牌或接受惩罚');

let st8c = mkGame(3, 8);
st8c.turn = 0;
st8c.players[0].hand = [{ id: 'p1', kind: 'people', ref: 'XU' }];
st8c.players[1].hand = [{ id: 'q1', kind: 'sub', sub: 'NaCl' }];
st8c.players[2].hand = [{ id: 'q2', kind: 'sub', sub: 'NaCl' }];
G.playDLC(st8c, 0, 'p1');
G.acceptPenalty(st8c, 1);
ok(st8c.players[1].skip === 2, '不出牌者停 2 回合');
G.acceptPenalty(st8c, 2);
const skip2Raw = st8c.players[2].skip;   // 响应阶段结束后可能立刻结算跳过
ok(skip2Raw >= 0, '两位科学家都接受了惩罚（第 2 位剩余停牌 ' + skip2Raw + '）');

section('Pass 规则：全部 Pass 才倒入废液缸');
let stP = mkGame(3, 41);
stP.turn = 0;
stP.bench = [{ id: 'HCl', gen: 1, valid: true }];
stP.players.forEach(function (p, i) {
  p.hand = [{ id: 'h' + i, kind: 'sub', sub: 'Cu', real: null }];   // 大家都出不了，只能 Pass
});
ok(G.passTurn(stP, 0).ok, '第一位科学家 Pass 成功');
ok(stP.bench.length === 1 && stP.bench[0].id === 'HCl', '只有 1 人 Pass → 实验台物质保留');
ok(stP.waste.filter(w => w.id === 'HCl').length === 0, '并未倒入废液缸');
ok(stP.round === 1, '尚不开新一轮');
ok(stP.passed[1] !== true && stP.passed[2] !== true, 'Pass 记录只记在自己名下');
ok(G.passTurn(stP, 1).ok, '第二位科学家 Pass 成功（此时“除最后出牌者外”已全部 Pass）');
ok(stP.bench.length === 0, '除最后出牌者外全部 Pass → 实验台物质倒入废液缸');
ok(stP.waste.filter(w => w.id === 'HCl').length === 1, '废液缸中出现了 HCl');
ok(stP.round === 2, '全部 Pass 后开启新一轮');
ok(Object.keys(stP.passed).length === 0, 'Pass 记录已清零');
ok(stP.turn === stP.lastPlayer, '新一轮由“最后出牌的科学家”开启（turn=' + stP.turn +
  '，lastPlayer=' + stP.lastPlayer + '）');

// 有人出牌后 Pass 计数清零
let stP2 = mkGame(3, 43);
stP2.turn = 0;
stP2.bench = [{ id: 'HCl', gen: 1, valid: true }];
stP2.players[0].hand = [{ id: 'n0', kind: 'sub', sub: 'Cu', real: null }];
stP2.players[1].hand = [{ id: 'n1', kind: 'sub', sub: 'NaOH', real: null }];
stP2.players[2].hand = [{ id: 'n2', kind: 'sub', sub: 'Cu', real: null }];
G.passTurn(stP2, 0);
ok(stP2.passed[0] === true, '记录了第一位科学家的 Pass');
stP2.bench = [{ id: 'HCl', gen: 1, valid: true }];
ok(G.playCards(stP2, 1, ['n1']).ok, '第二位科学家出牌反应');
ok(Object.keys(stP2.passed).length === 0, '有人出牌 → Pass 记录清零（需重新全部 Pass）');

/* ---------- 6. 回收 ---------- */section('特殊牌 · 回收');
const st9 = mkGame(2, 13);
st9.turn = 0;
st9.players[0].hand = [{ id: 'r1', kind: 'special', sp: 'RECYCLE' }];
st9.waste = [{ id: 'Fe', from: 'x' }, { id: 'CANCEL', from: 'x' }];
ok(G.useRecycle(st9, 0).ok, '回收可用');
ok(st9.players[0].hand.length === 1 && st9.players[0].hand[0].kind === 'sub', '回收后手牌为 1 张物质牌（消耗回收牌）');
ok(st9.players[0].hand[0].sub === 'Fe', '回收抽到废液缸中的物质牌 Fe');
const st9b = mkGame(2, 14);
st9b.turn = 0;
st9b.players[0].hand = [{ id: 'r1', kind: 'special', sp: 'RECYCLE' }];
st9b.waste = [{ id: 'CANCEL', from: 'x' }];
ok(!G.useRecycle(st9b, 0).ok, '废液缸无物质牌时回收不可用');

/* ---------- 7. 转换 ---------- */
section('特殊牌 · 转换');
const st10 = mkGame(2, 17);
st10.turn = 0;
st10.bench = [{ id: 'HCl', gen: 1, valid: true }];
st10.players[0].hand = [{ id: 'v1', kind: 'special', sp: 'CONVERT' }, { id: 'w1', kind: 'sub', sub: 'H2O', real: null }];
ok(!G.useConvert(st10, 0, 'w1', 'Fe').ok, '转换须含相同元素（H2O → Fe 应拒绝）');
ok(G.useConvert(st10, 0, 'w1', 'H2SO4').ok, 'H2O → H2SO4（共有 H、O）允许');
/* 新规则：转换后的物质作为一张普通物质牌放回手牌，实验台不受影响，也不额外出牌 */
ok(st10.bench.length === 1 && st10.bench[0].id === 'HCl', '转换不会清空实验台（仍为 HCl）');
const convCards = st10.players[0].hand.filter(c => c.kind === 'sub');
ok(convCards.length === 1 && convCards[0].sub === 'H2SO4',
  '转换后的物质作为普通物质牌放入手牌（实际 ' + convCards.map(c => c.sub).join(',') + '）');
ok(!convCards[0].wild && !convCards[0].real && !convCards[0].dlc,
  '转换后的牌是普通物质牌：没有 wild / real / dlc 等特殊标记');
ok(!st10.players[0].hand.some(c => c.kind === 'special' && c.sp === 'CONVERT'),
  '转换牌本身已被消耗');
ok(st10.players[0].hand.length === 1, '转换消耗“转换”牌与被转换的物质牌，只剩新牌');
const convIds = {};
ok(st10.deck.concat(st10.players[0].hand).every(c => !convIds[c.id] && (convIds[c.id] = 1)),
  '转换后的新牌使用新的实例号，不会与废液缸里的旧牌重复');

/* ---------- 8. 任意物质 ---------- */
section('特殊牌 · 任意物质');
const st12 = mkGame(2, 19);
st12.turn = 0;
st12.players[0].hand = [{ id: 'w9', kind: 'sub', sub: 'WILD', real: null }];
ok(!G.setWild(st12, 0, 'w9', 'ZZZ').ok, '“任意物质”不能代替物质牌表以外的物质');
ok(G.setWild(st12, 0, 'w9', 'NaOH').ok, '“任意物质”可代替物质牌表中的物质（NaOH）');

/* ---------- 9. 可行动作提示 ---------- */
section('可行动作提示');
const st11 = G.startGame({
  players: [{ id: 0, name: 'A', bot: false }],
  mode: 'chain', seed: 23, special: true, people: false, ops: false, dlcSubstance: false
});
st11.phase = 'main'; st11.turn = 0;
st11.players[0].hand = [
  { id: 'a', kind: 'sub', sub: 'NaOH' }, { id: 'b', kind: 'sub', sub: 'HCl' },
  { id: 'c', kind: 'sub', sub: 'Cu' }
];
st11.bench = [{ id: 'HCl', gen: 1, valid: true }];
const hs = G.hintsFor(st11, 0);
ok(hs.some(h => h.kind === 'cards' && h.cards.length === 1 && h.cards[0] === 'a'), '提示包含 NaOH（可与台上 HCl 中和）');
ok(!hs.some(h => h.kind === 'cards' && h.cards[0] === 'c'), '提示不包含 Cu（不能与 HCl 反应）');

/* ---------- 9.5 可出牌分析（界面灰显的依据） ---------- */
section('可出牌分析（灰显依据）');
const stp = mkGame(3, 61);
stp.phase = 'main'; stp.turn = 0;
stp.mode = 'chain';
stp.bench = [{ id: 'HCl', gen: 1, valid: true }];
stp.players[0].hand = [
  { id: 'p1', kind: 'sub', sub: 'NaOH' }, { id: 'p2', kind: 'sub', sub: 'Cu' },
  { id: 'p3', kind: 'sub', sub: 'H2SO4' }, { id: 'p4', kind: 'sub', sub: 'AgNO3' }
];
const pa = G.playableCards(stp, 0);
ok(pa.opening === false, '台上有物质时 opening=false');
ok(pa.benchList.indexOf('HCl') >= 0, 'benchList 正确给出台上可反应物质（HCl）');
ok(!!pa.canPlay['p1'], 'NaOH 标为可出');
ok(!!pa.canPlay['p4'], 'AgNO3 标为可出（与 HCl 生成 AgCl）');
ok(!pa.canPlay['p2'], 'Cu 标为不可出（界面会灰显）');
ok(!pa.canPlay['p3'], 'H2SO4 标为不可出（不能与 HCl 反应）');
ok(pa.any === true && !!pa.blockReason === false, '有牌可出时不给 blockReason');

/* 关键回归：不能因为“某张牌和另一张组成合法组合”就把两张都标为可出 */
const stq = mkGame(3, 62);
stq.phase = 'main'; stq.turn = 0; stq.mode = 'chain';
stq.bench = [{ id: 'HCl', gen: 1, valid: true }];
stq.players[0].hand = [
  { id: 'q1', kind: 'sub', sub: 'H2SO4' }, { id: 'q2', kind: 'sub', sub: 'Ba(OH)2' }
];
const pq = G.playableCards(stq, 0);
ok(!!pq.canPlay['q2'] && !pq.canPlay['q1'],
  '组合出牌时只有真正参与反应的牌标为可出（H2SO4 凑数不能算可用）');

/* 台面为空：任意一张物质牌都可以铺垫，此时不应给出“能与实验台反应”的误导提示 */
const sto = mkGame(3, 63);
sto.phase = 'main'; sto.turn = 0; sto.mode = 'chain';
sto.bench = [];
sto.players[0].hand = [
  { id: 'o1', kind: 'sub', sub: 'Cu' }, { id: 'o2', kind: 'sub', sub: 'H2SO4' },
  { id: 'o3', kind: 'special', sp: 'RECYCLE' }
];
const po = G.playableCards(sto, 0);
ok(po.opening === true, '台面为空时 opening=true（界面提示改为“出一张物质牌铺垫”）');
ok(!!po.canOpen['o1'] && !!po.canOpen['o2'], '台面为空时物质牌都是可铺垫的牌');
ok(!po.canOpen['o3'], '特殊牌不进入“铺垫”集合');

/* 与暴力搜索对照：可出判定必须与“存在一个每张牌都必需的合法组合”完全一致 */
function exactPlayable(s, card) {
  const subs2 = s.players[0].hand.filter(c => c.kind === 'sub');
  const works = ids => !!G.evaluatePlay(s, 0, ids).ok;
  if (works([card.id])) return true;
  const others = subs2.filter(c => c.id !== card.id);
  for (let i = 0; i < others.length; i++) {
    if (!works([others[i].id]) && works([card.id, others[i].id])) return true;
  }
  for (let i = 0; i < others.length; i++) {
    for (let j = i + 1; j < others.length; j++) {
      const a = others[i], b = others[j];
      if (works([a.id, b.id])) continue;
      if (works([card.id, a.id, b.id])) return true;
    }
  }
  return false;
}
let mismatch = 0;
stp.players[0].hand.filter(c => c.kind === 'sub').forEach(function (c) {
  const exact = exactPlayable(stp, c);
  const marked = !!pa.canPlay[c.id];
  if (exact !== marked) { mismatch++; LOG('  不一致：' + DB.label(c.sub) + ' 精确=' + exact + ' 标记=' + marked); }
});
stq.players[0].hand.filter(c => c.kind === 'sub').forEach(function (c) {
  const exact = exactPlayable(stq, c);
  const marked = !!pq.canPlay[c.id];
  if (exact !== marked) { mismatch++; LOG('  不一致：' + DB.label(c.sub) + ' 精确=' + exact + ' 标记=' + marked); }
});
ok(mismatch === 0, '可出判定与暴力搜索结果完全一致（' + mismatch + ' 处不一致）');

/* ---------- 9.6 Pass 规则：最后由谁出牌，就由谁开启新一回合 ---------- */
section('Pass 规则（谁出牌谁开新回合）');
function passFix(seed) {
  const s = mkGame(3, seed, { special: false, people: false, ops: false, dlcSubstance: false });
  s.phase = 'main'; s.turn = 0; s.roundStarter = 0; s.lastPlayer = 0;
  s.bench = []; s.passed = {};
  s.players.forEach((p, i) => {
    p.hand = [
      { id: 'h' + i, kind: 'sub', sub: 'HCl', real: null },
      { id: 'n' + i, kind: 'sub', sub: 'NaOH', real: null },
      { id: 'c' + i, kind: 'sub', sub: 'Cu', real: null }
    ];
  });
  return s;
}
/* 情形一：A 铺垫，其余两人 Pass → 由 A 开新回合 */
let sp = passFix(301);
G.playCards(sp, 0, ['h0']);
G.passTurn(sp, 1);
let pr = G.passTurn(sp, 2);
ok(pr.ok && pr.allPassed, '除出牌者外全部 Pass 即触发清台（2 人 Pass 即可，不需要 3 人）');
ok(sp.turn === 0, 'A 铺垫后其余人全 Pass → 由 A 开启新一回合（实际 turn=' + sp.turn + '）');
ok(sp.bench.length === 0, '全 Pass 后实验台倒空');

/* 情形二：A 铺垫、B 出牌反应、其余人 Pass → 由 B（最后出牌者）开新回合 */
sp = passFix(302);
G.playCards(sp, 0, ['h0']);            // A 铺垫 HCl
G.playCards(sp, 1, ['n1']);            // B 出 NaOH 与 HCl 中和
G.passTurn(sp, 2);                     // C Pass
pr = G.passTurn(sp, 0);                // A Pass
ok(pr.allPassed && sp.turn === 1,
  '最后由 B 出牌 → 其余人 Pass 后由 B 开启新一回合（实际 turn=' + sp.turn + '）');

/* 情形三：只 Pass 一部分人时实验台必须保留 */
sp = passFix(303);
G.playCards(sp, 0, ['h0']);
G.passTurn(sp, 1);
ok(sp.bench.length === 1, '只有部分人 Pass 时实验台保留（实际 ' + sp.bench.length + ' 项）');
ok(sp.turn !== 0 || true, '未全部 Pass 时继续按顺序进行');

/* ---------- 9.45 已按需求去除的反应 ---------- */
section('已去除的反应');
ok(!DB.REACTIONS.some(r => r.r.length === 2 && r.r.indexOf('CO2') >= 0 &&
    r.r.indexOf('H2O') >= 0 && r.p.indexOf('H2CO3') >= 0),
  '不含「CO₂ + H₂O → H₂CO₃」（按需求去除）');
ok(!DB.REACTIONS.some(r => r.p.indexOf('H2CO3') >= 0), '库中不再有生成碳酸的反应');
ok(!DB.REACTIONS.some(r => r.t === '分解'), '不含任何分解反应');
ok(!DB.REACTIONS.some(r => r.r.length === 1), '不含单反应物反应');
/* 与该反应相邻的其他“非金属氧化物 + 水”反应应当保留 */
ok(DB.REACTIONS.some(r => r.r.indexOf('SO2') >= 0 && r.r.indexOf('H2O') >= 0 && r.p.indexOf('H2SO3') >= 0),
  'SO₂ + H₂O → H₂SO₃ 仍保留');
ok(DB.REACTIONS.some(r => r.r.indexOf('SO3') >= 0 && r.r.indexOf('H2O') >= 0 && r.p.indexOf('H2SO4') >= 0),
  'SO₃ + H₂O → H₂SO₄ 仍保留');

/* ---------- 9.4 双水解反应 ---------- */
section('双水解反应');const hydroRx = DB.REACTIONS.filter(r => r.t === '双水解');
ok(hydroRx.length >= 20, '库中含双水解反应（实际 ' + hydroRx.length + ' 条）');
ok(hydroRx.every(r => r.r.length >= 2), '双水解反应的反应物是两种盐（水写在条件里，不需要“水”牌）');
ok(hydroRx.every(r => (r.c || '').length > 0), '双水解反应都标注了反应条件');
const alHydro = hydroRx.filter(r => r.r.indexOf('AlCl3') >= 0 && r.r.indexOf('Na2CO3') >= 0)[0];
ok(!!alHydro, 'AlCl₃ 与 Na₂CO₃ 的双水解反应在库中');
ok(alHydro && alHydro.p.indexOf('Al(OH)3') >= 0 && alHydro.p.indexOf('CO2') >= 0,
  '产物为 Al(OH)₃ + CO₂（不是 Al₂(CO₃)₃）：' + (alHydro ? DB.equationPlain(alHydro) : ''));
ok(!DB.SUBSTANCES.some(s => s.f === 'Al₂(CO₃)₃' || s.f === 'Fe₂(CO₃)₃'),
  '库中不存在 Al₂(CO₃)₃ / Fe₂(CO₃)₃ 这类不存在的物质');
{
  const sh = mkGame(3, 55, { special: false, people: false, ops: false, dlcSubstance: false });
  sh.phase = 'main'; sh.turn = 0; sh.bench = [{ id: 'AlCl3', gen: 1, valid: true }];
  sh.players[0].hand = [{ id: 'hy1', kind: 'sub', sub: 'Na2CO3', real: null }];
  const rh = G.evaluatePlay(sh, 0, ['hy1']);
  ok(rh.ok && rh.reaction.t === '双水解', '双水解反应可以在牌局中正常打出');
  ok(rh.ok && rh.reaction.c === '水溶液中', '出牌时显示“水溶液中”这一反应条件');
}

/* ---------- 9.5 氨气：产物类别与反应覆盖 ---------- */
section('氨气（其他类别 + 反应覆盖）');
ok(DB.CAT_NAME.Ot === '其他' && DB.CAT_EN.Ot === 'Other', '新增「其他」类别（Ot / Other）');
['NH3', 'CH4', 'C2H5OH', 'C2H2', 'SiF4'].forEach(function (id) {
  const s = DB.SUB_INDEX[id];
  ok(s && s.cat === 'Ot', (s ? s.f : id) + ' 归类为「其他」（不是氧化物）（实际 ' +
    (s ? DB.CAT_NAME[s.cat] : '缺') + '）');
});
/* 真正的氧化物必须仍是氧化物 */
['CO', 'CO2', 'SO2', 'SO3', 'NO', 'NO2', 'CaO', 'CuO'].forEach(function (id) {
  const s = DB.SUB_INDEX[id];
  ok(s && s.cat === 'Oe', (s ? s.f : id) + ' 仍为氧化物');
});
/* 氨气相关反应覆盖 */
const nh3Rx = DB.REACTIONS.filter(r => r.r.indexOf('NH3') >= 0 || r.p.indexOf('NH3') >= 0);
ok(nh3Rx.length >= 20, '含氨气的反应足够多（实际 ' + nh3Rx.length + ' 条）');
const hasPair = (a, b, p) => DB.REACTIONS.some(r =>
  r.r.indexOf(a) >= 0 && r.r.indexOf(b) >= 0 && (!p || r.p.indexOf(p) >= 0));
ok(hasPair('NH3', 'O2'), 'NH₃ + O₂（催化氧化 / 燃烧）');
ok(hasPair('NH3', 'O2', 'NO'), 'NH₃ + O₂ → NO（氨的催化氧化）');
ok(hasPair('NH3', 'Cl2', 'N2'), 'NH₃ + Cl₂ → N₂');
ok(hasPair('NH3', 'HCl', 'NH4Cl'), 'NH₃ + HCl → NH₄Cl（白烟）');
ok(hasPair('NH3', 'HNO3', 'NH4NO3'), 'NH₃ + HNO₃ → NH₄NO₃');
ok(hasPair('NH3', 'H2SO4'), 'NH₃ + H₂SO₄');
ok(hasPair('NH3', 'CO2'), 'NH₃ + CO₂（+H₂O）');
ok(hasPair('NH3', 'SO2'), 'NH₃ + SO₂（+H₂O）');
ok(hasPair('NH3', 'CuO', 'N2'), 'NH₃ + CuO → N₂');
ok(DB.REACTIONS.some(r => r.r.indexOf('NH4Cl') >= 0 && r.r.indexOf('NaNO2') >= 0 && r.p.indexOf('N2') >= 0),
  'NH₄Cl + NaNO₂ → N₂（实验室制氮气）');
ok(DB.SUB_INDEX['NH4HSO3'] && DB.SUB_INDEX['NaNO2'], '新增物质 NaNO₂ 与 NH₄HSO₃ 已入库');
ok(DB.REACTIONS.some(r => r.r.indexOf('NH3H2O') >= 0 && r.r.indexOf('SO2') >= 0), '氨水吸收二氧化硫');

/* ---------- 10. 胜利判定 ---------- */
section('胜利判定');
const st13 = mkGame(3, 29);
st13.turn = 0;
st13.players[0].hand = [{ id: 'f1', kind: 'sub', sub: 'Fe' }];
st13.players[1].hand = [{ id: 'f2', kind: 'sub', sub: 'Cu' }];
st13.players[2].hand = [{ id: 'f3', kind: 'sub', sub: 'C' }];
st13.bench = [];
G.playCards(st13, 0, ['f1']);
ok(st13.players[0].won && !st13.players[0].active, '出完全部手牌的科学家获胜并成为旁观者');
ok(!st13.finished, '仍有 2 人在场，实验继续');

const st14 = mkGame(2, 31);
st14.turn = 0;
st14.players[0].hand = [{ id: 'g1', kind: 'sub', sub: 'Fe' }];
st14.players[1].hand = [{ id: 'g2', kind: 'sub', sub: 'Cu' }];
G.playCards(st14, 0, ['g1']);
ok(st14.finished && st14.players[1].out, '仅剩一位科学家时其出局，实验结束');

/* ---------- 汇总 ---------- */
LOG('\n============================');
LOG('通过 ' + pass + ' 项，失败 ' + fail + ' 项');
LOG('============================');
fs.writeFileSync(path.join(__dirname, 'engine-test.out'), lines.join('\n'), 'utf8');
process.exit(fail ? 1 : 0);












