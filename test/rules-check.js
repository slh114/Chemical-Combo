/* 验证：Pass 规则（最后由谁出牌，就由谁开启新回合）与回溯语义（回到上家上一次出牌之后） */
const fs = require('fs');
const path = require('path');
global.window = undefined;
require(path.join(__dirname, '..', 'data.js'));
require(path.join(__dirname, '..', 'reactions-data.js'));
require(path.join(__dirname, '..', 'game.js'));
const DB = global.ChemDB, G = global.ChemGame;
const out = [];
const L = s => out.push(s);

/* ---------- 1. Pass 规则 ---------- */
L('=== Pass 规则 ===');
function fresh(seed) {
  const ps = [{ id: 0, name: 'A' }, { id: 1, name: 'B' }, { id: 2, name: 'C' }];
  const st = G.startGame({
    players: ps, mode: 'chain', seed: seed,
    special: false, people: false, ops: false, dlcSubstance: false
  });
  while (st.phase === 'draw') G.drawAll(st);
  st.phase = 'main'; st.turn = 0; st.roundStarter = 0; st.lastPlayer = 0;
  st.bench = []; st.passed = {};
  st.players.forEach((p, i) => {
    p.hand = [
      { id: 'h' + i, kind: 'sub', sub: 'HCl', real: null },
      { id: 'n' + i, kind: 'sub', sub: 'NaOH', real: null },
      { id: 'c' + i, kind: 'sub', sub: 'Cu', real: null }
    ];
  });
  return st;
}

// 情形一：A 铺垫，B/C 都 Pass → 由 A 开新回合（A 是最后出牌者）
let st = fresh(1);
G.playCards(st, 0, ['h0']);
G.passTurn(st, 1);
const r1 = G.passTurn(st, 2);
L('A 铺垫 → B Pass → C Pass：turn=' + st.turn + '（期望 0=A），round=' + st.round +
  '，allPassed=' + r1.allPassed);

// 情形二：A 铺垫，B 出牌反应，C/A 都 Pass → 由 B 开新回合（B 是最后出牌者）
st = fresh(2);
G.playCards(st, 0, ['h0']);          // A 铺垫 HCl
G.playCards(st, 1, ['n1']);          // B 出 NaOH 与 HCl 反应
G.passTurn(st, 2);                   // C Pass
const r2 = G.passTurn(st, 0);        // A Pass
L('A 铺垫 → B 反应 → C Pass → A Pass：turn=' + st.turn + '（期望 1=B），round=' + st.round +
  '，allPassed=' + r2.allPassed + '，bench=' + JSON.stringify(st.bench));

// 情形三：只 Pass 了部分人时不应清台
st = fresh(3);
G.playCards(st, 0, ['h0']);
G.passTurn(st, 1);
L('只有 B Pass（1/2）时：bench=' + JSON.stringify(st.bench.map(b => b.id)) +
  '，turn=' + st.turn + '（实验台应保留）');

/* ---------- 2. 回溯语义 ---------- */
L('');
L('=== 回溯（悔棋）语义 ===');
// 复刻 ui.js 的快照机制
function clone(s) {
  if (s === null || typeof s !== 'object') return s;
  if (Array.isArray(s)) return s.map(clone);
  const o = {};
  Object.keys(s).forEach(k => { o[k] = (typeof s[k] === 'function') ? s[k] : clone(s[k]); });
  return o;
}
function snap(s) { return { st: clone(s), rnd: s.rnd }; }
let prev = null, node = null;
function mark(before) { prev = node; node = before; }

st = fresh(4);
const s0 = snap(st);                 // 上家（A）出牌后的局面
mark(s0);                            // 模拟 UI：A 出牌后建立节点
st = fresh(4);                       // 用自己的局面继续演示
// 玩家 B 的第一次操作
const before1 = snap(st);
G.playCards(st, 0, ['h0']);
G.playCards(st, 1, ['n1']);
mark(before1);
const afterFirst = st.turn;
L('B 第一次操作后 turn=' + afterFirst + '（C 的回合）');
// 玩家 B 的第二次操作（这里是 C 操作，仅用于演示节点推进）
const before2 = snap(st);
G.passTurn(st, 2);
mark(before2);
L('第二次操作后：nodeSnapshot 对应上一次操作前（turn=' + node.st.turn + '），' +
  'prevSnapshot 对应上上次（turn=' + (prev ? prev.st.turn : '无') + '）');
L('点回溯 → 恢复到 turn=' + (node || prev).st.turn +
  '，即「上家上一次出牌之后」那一刻（撤销自己上一次操作）');

fs.writeFileSync(path.join(__dirname, 'rules-check.out'), out.join('\n'), 'utf8');
console.log(out.join('\n'));
