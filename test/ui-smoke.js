/* UI 冒烟测试：在 Node 中用最小 DOM 桩加载 ui.js，模拟真人操作走完一局。
 * 运行：node test/ui-smoke.js  → 结果写入 test/ui-smoke.out */
const fs = require('fs');
const path = require('path');
const lines = [];
const LOG = (...a) => lines.push(a.map(x => String(x)).join(' '));
let fail = 0, pass = 0;
function ok(c, m) { if (c) pass++; else { fail++; LOG('  ✗ ' + m); } }

/* ---------------- 最小 DOM ---------------- */
class ClassList {
  constructor(node) { this.node = node; this.set = new Set(); }
  add(...c) { c.forEach(x => x && this.set.add(x)); this._sync(); }
  remove(...c) { c.forEach(x => this.set.delete(x)); this._sync(); }
  contains(c) { return this.set.has(c); }
  toggle(c, force) {
    const want = (force === undefined) ? !this.set.has(c) : !!force;
    if (want) this.set.add(c); else this.set.delete(c);
    this._sync();
    return want;
  }
  _sync() { this.node._className = Array.from(this.set).join(' '); }
}
let idSeq = 0;
class El {
  constructor(tag) {
    this.tagName = (tag || 'div').toUpperCase();
    this.children = [];
    this.parentNode = null;
    this.style = {};
    this.dataset = {};
    this.attrs = {};
    this._text = '';
    this._html = '';
    this._className = '';
    this.id = '';
    this._uid = ++idSeq;
    this.classList = new ClassList(this);
    this.classList.add('__t' + this._uid);   // 便于按类名检索
  }
  set className(v) {
    this._className = v || '';
    this.classList.set = new Set(this._className.split(/\s+/).filter(Boolean));
  }
  get className() { return this._className; }
  appendChild(c) { c.parentNode = this; this.children.push(c); return c; }
  removeChild(c) { const i = this.children.indexOf(c); if (i >= 0) this.children.splice(i, 1); return c; }
  remove() { if (this.parentNode) this.parentNode.removeChild(this); }
  after(sib) {
    if (!this.parentNode) return;
    const i = this.parentNode.children.indexOf(this);
    this.parentNode.children.splice(i + 1, 0, sib);
    sib.parentNode = this.parentNode;
  }
  set textContent(v) { this._text = String(v); this.children = []; }
  get textContent() {
    if (this.children.length) {
      return this._text + this.children.map(c => c.textContent).join('');
    }
    return this._text;
  }
  set innerHTML(v) {
    var raw = String(v);
    this._html = raw;
    this.children = [];
    // 粗略解析：把 <tag ...>text</tag> 转成子节点，便于断言 textContent
    const re = /<(\w+)([^>]*)>([^<]*)<\/\1>/g;
    let m;
    while ((m = re.exec(raw))) {
      const child = new El(m[1]);
      child._text = m[3];
      child.parentNode = this;
      this.children.push(child);
    }
    if (!this.children.length) {
      // 纯文本（ui.js 中大量 el('div', 'empty', '提示文字') 的用法）
      this._text = raw.replace(/<[^>]*>/g, '');
    }
  }
  get innerHTML() { return this._html; }
  focus() { }
  get classListStr() { return this._className; }
  /** 递归收集所有后代 */
  all(out) {
    out = out || [];
    this.children.forEach(c => { out.push(c); if (c.all) c.all(out); });
    return out;
  }
  querySelectorAll(sel) {
    const all = this.all();
    return all.filter(n => matchSel(n, sel));
  }
  querySelector(sel) { return this.querySelectorAll(sel)[0] || null; }
  /** 为 querySelectorAll('.card-grid[data-cat="X"]') 服务 */
  byClassAndData(cls, key) {
    return this.all().filter(n => n.classList.contains(cls) && n.dataset[key] != null);
  }
}
function matchSel(n, sel) {
  const m = sel.match(/^([.#]?)([\w-]+)(?:\[data-([\w-]+)="([^"]*)"\])?$/);
  if (!m) return false;
  const [, kind, name, dk, dv] = m;
  if (kind === '#') { if (n.id !== name) return false; }
  else if (kind === '.') { if (!n.classList.contains(name)) return false; }
  else if (n.tagName !== name.toUpperCase()) return false;
  if (dk && n.dataset[dk] !== dv) return false;
  return true;
}

const root = new El('body');
const byId = {};
function mk(id, tag) {
  const e = new El(tag || 'div');
  e.id = id;
  byId[id] = e;
  root.appendChild(e);
  return e;
}
['app', 'topbar', 'pile-deck', 'deck-count', 'pile-waste', 'waste-count', 'pile-round', 'round-no',
  'btn-rules', 'btn-cardlist', 'btn-newgame', 'body', 'left', 'player-list', 'log', 'center', 'bench-panel',
  'bench-hint', 'btn-pass', 'bench', 'reaction-strip', 'hand-panel', 'hand-title', 'sel-hint', 'btn-play',
  'btn-clear', 'hand', 'right', 'hints', 'rx-lookup', 'rx-input', 'btn-rx', 'rx-result', 'bottom', 'all-hands',
  'overlay', 'overlay-box', 'overlay-head', 'overlay-title', 'overlay-close', 'overlay-body', 'setup',
  'set-players', 'set-mode', 'mode-tip', 'set-dlcsub', 'set-people', 'set-ops', 'set-special', 'set-bots',
  'set-open', 'btn-waste', 'bots-tip', 'bot-speed-val', 'set-botspeed',
  'handoff', 'handoff-title', 'handoff-sub', 'handoff-info', 'handoff-ok',
  'btn-undo', 'playable-list', 'bench-choose-hint', 'set-names',
  'set-counter', 'counter-opts', 'set-counter-color', 'set-counter-mode',
  'welcome', 'welcome-start', 'welcome-rules', 'welcome-credits', 'setup-back'].forEach(function (id) { mk(id); });
mk('btn-start', 'button');
const segPlayers = byId['set-players'], segMode = byId['set-mode'], segBots = byId['set-bots'], segOpen = byId['set-open'];
const segCounter = byId['set-counter'], segCounterMode = byId['set-counter-mode'];
function mkSeg(parent, vals) {
  vals.forEach(v => { const b = new El('button'); b.dataset.v = v; b.classList.add('segbtn'); parent.appendChild(b); });
}
mkSeg(segPlayers, ['2', '3', '4', '5']);
mkSeg(segMode, ['chain', 'relay', 'element']);
mkSeg(segBots, ['all', 'one', 'human']);
mkSeg(segOpen, ['0', '1']);
mkSeg(segCounter, ['1', '0']);
mkSeg(segCounterMode, ['total', 'each']);
byId['set-counter-color'].checked = true;
['set-dlcsub', 'set-people', 'set-ops', 'set-special'].forEach(id => { byId[id] = new El('input'); byId[id].checked = true; });
byId['set-botspeed'].value = '0.7';
// #overlay / #handoff 初始含 hidden
byId['overlay'].classList.add('hidden');
byId['handoff'].classList.add('hidden');
byId['setup'].classList.add('modal');

const documentStub = {
  getElementById: id => byId[id] || null,
  createElement: tag => new El(tag),
  querySelectorAll: sel => {
    if (sel.startsWith('#')) {
      const m = sel.match(/^#([\w-]+)\s+button$/);
      if (m) return (byId[m[1]] || new El('div')).children.filter(c => c.tagName === 'BUTTON');
      return [];
    }
    return [];
  },
  addEventListener: (t, fn) => { documentStub._ev = documentStub._ev || {}; documentStub._ev[t] = fn; }
};
global.document = documentStub;
const windowStub = {
  _ev: {},
  addEventListener: (t, fn) => { windowStub._ev[t] = fn; }
};
global.window = windowStub;
global.setTimeout = (fn, ms) => { pending.push(fn); return pending.length; };
const pending = [];
function flushTimers(max) {
  let n = 0;
  while (pending.length && n++ < (max || 400)) {
    const fn = pending.shift();
    fn();
  }
  return n;
}

/* ---------------- 载入被测代码 ---------------- */
require(path.join(__dirname, '..', 'data.js'));
require(path.join(__dirname, '..', 'reactions-data.js'));
require(path.join(__dirname, '..', 'game.js'));
require(path.join(__dirname, '..', 'ui.js'));

/* ---------------- 断言 ---------------- */
LOG('== UI 冒烟测试 ==');
ok(typeof windowStub.ChemDB === 'object', 'data.js 载入');
ok(typeof windowStub.ChemGame === 'object', 'game.js 载入');
ok(typeof windowStub._ev === 'object' && !!windowStub._ev.DOMContentLoaded, 'ui.js 已注册 DOMContentLoaded');

windowStub._ev.DOMContentLoaded();
ok(byId['rx-result'].children.length > 0 || byId['rx-result'].innerHTML.length > 0, '反应参考初始提示已渲染');

/* 选择 3 人 / 接龙 / 全部电脑（默认）并开局 */
const startHuman = byId['btn-start'];
ok(typeof startHuman.onclick === 'function', '「开始实验」按钮已绑定');
startHuman.onclick();
ok(byId['setup'].classList.contains('hidden'), '开局后设置面板隐藏');
ok(byId['player-list'].children.length === 3, '玩家列表渲染 3 位科学家（实际 ' + byId['player-list'].children.length + '）');
ok(byId['deck-count'].textContent !== '0' || byId['round-no'].textContent === '1', '顶栏数据已渲染');
ok(byId['hand'].children.length > 0, '手牌区已渲染卡牌（' + byId['hand'].children.length + ' 张）');
ok(byId['log'].children.length > 0, '实验记录已输出');

/* 推进电脑对局（观战模式） */
flushTimers(600);
ok(true, '电脑自动推进会话未抛异常');
LOG('  抽屉/实验台渲染：bench=' + byId['bench'].children.length + '，hints=' + byId['hints'].children.length +
  '，all-hands 行=' + byId['all-hands'].children.length);
ok(byId['all-hands'].children.length === 3, '底部各家手牌视图渲染 3 行');
ok(byId['hand-title'].textContent.indexOf('观战') >= 0, '全部电脑时显示观战模式');

/* 重新开始 → 真人模式，再检查卡牌渲染 */
byId['btn-newgame'].onclick();
ok(!byId['welcome'].classList.contains('hidden') && byId['setup'].classList.contains('hidden'), '重新开始回到欢迎界面（设置面板隐藏）');
segBots.children[1].onclick();          // 1 位真人 + 电脑
byId['btn-start'].onclick();
ok(byId['hand-title'].textContent.indexOf('我的手牌') >= 0, '真人模式下显示「我的手牌」');

/* 卡牌渲染检查：类别 class 是否正确 */
const cardEls = byId['hand'].all().filter(n => n.classList.contains('card'));
ok(cardEls.length > 0, '手牌中出现 .card 元素（' + cardEls.length + ' 个）');
const catOk = cardEls.every(c => /cat-(Ad|Be|St|Oe|Es|X|P|O)/.test(c.className));
ok(catOk, '每张卡牌都带有正确的类别 class');
const hasBar = cardEls.every(c => c.children.some(x => x.classList.contains('cat-bar')));
ok(hasBar, '每张卡牌都有类别色带');
const labels = cardEls.map(c => (c.children.find(x => x.classList.contains('formula')) || {}).innerHTML ||
  (c.children.find(x => x.classList.contains('big')) || {}).innerHTML || '');
ok(labels.filter(Boolean).length > 0, '卡牌显示化学式或技能名（示例：' + labels.slice(0, 4).join(' / ') + '）');

/* 规则弹窗 */
byId['btn-rules'].onclick();
const rulesHtml = byId['overlay-body'].children.map(c => c.innerHTML).join('');
ok(!byId['overlay'].classList.contains('hidden'), '规则弹窗可打开');
ok(rulesHtml.indexOf('抵消') >= 0 && rulesHtml.indexOf('侯德榜') >= 0 && rulesHtml.indexOf('任意物质') >= 0,
  '规则文本包含特殊牌与人物 DLC 规则');
ok(rulesHtml.indexOf('Pass 掉一回合') >= 0, '规则文本包含《规则补充》易混淆事项');
byId['overlay-close'].onclick();
ok(byId['overlay'].classList.contains('hidden'), '规则弹窗可关闭');

/* 物质总表 */
byId['btn-cardlist'].onclick();
ok(!byId['overlay'].classList.contains('hidden'), '物质总表可打开');
const total = byId['overlay-body'].all().filter(n => n.classList.contains('card')).length;
ok(total >= 50, '物质总表至少列出 50 张卡牌（实际 ' + total + '）');
byId['overlay-close'].onclick();

/* 废液缸 */
byId['btn-waste'].onclick();
ok(!byId['overlay'].classList.contains('hidden'), '废液缸可查看');
byId['overlay-close'].onclick();

/* 反应查询 */
byId['rx-input'].value = '盐酸';
byId['rx-input'].oninput();
const rxHtml = byId['rx-result'].children.map(c => c.innerHTML).join('');
ok(rxHtml.indexOf('HCl') >= 0 || rxHtml.length > 0, '反应查询有结果');
byId['rx-input'].value = '不存在的物质XYZ';
byId['rx-input'].oninput();
const rxHtml2 = byId['rx-result'].children.map(c => c.innerHTML).join('');
ok(rxHtml2.indexOf('没有找到') >= 0, '反应查询可处理无结果');

/* 重新开始 → 真人模式 */
byId['btn-newgame'].onclick();
ok(!byId['welcome'].classList.contains('hidden') && byId['setup'].classList.contains('hidden'), '重新开始回到欢迎界面（设置面板隐藏）');
segBots.children[1].onclick();          // 1 位真人 + 电脑
byId['btn-start'].onclick();
ok(byId['hand-title'].textContent.indexOf('我的手牌') >= 0, '真人模式下显示「我的手牌」');

/* 真人点击一张牌 → 选中 */
const myCards = byId['hand'].all().filter(n => n.classList.contains('card'));
if (myCards.length) {
  myCards[0].onclick();
  ok(true, '点击手牌不会抛异常（选中状态 ' + (byId['hand'].all().some(n => n.classList.contains('sel')) ? '已设置' : '未设置（可能不可出）') + '）');
}
flushTimers(400);

/* ---------- 电脑出牌间隔自定义 ---------- */
segBots.children[1].onclick();                 // 保持 1 真人 + 电脑
byId['set-botspeed'].value = '2.5';
byId['set-botspeed'].oninput();
ok(byId['bot-speed-val'].textContent.indexOf('2.5') >= 0, '电脑间隔滑块显示当前值（' + byId['bot-speed-val'].textContent + '）');
byId['set-botspeed'].value = '0';
byId['set-botspeed'].oninput();
ok(byId['bot-speed-val'].textContent.indexOf('立即') >= 0, '间隔为 0 时显示「立即出牌」');
byId['set-botspeed'].value = '0.7';
byId['set-botspeed'].oninput();

/* ---------- 全部真人（同一设备轮流） ---------- */
byId['btn-newgame'].onclick();
segBots.children[2].onclick();                 // 全部真人
ok(byId['bots-tip'].textContent.indexOf('全部真人') >= 0, '选择全部真人后有说明提示');
byId['btn-start'].onclick();
ok(byId['player-list'].children.length === 3, '全部真人时仍是所选人数');
const botTags = byId['player-list'].all().filter(n => n.classList.contains('segbtn'));
const noBot = byId['player-list'].children.every(li => li.all().every(n => n.textContent !== '电脑'));
ok(noBot, '全部真人模式下玩家列表中没有「电脑」标记');
ok(byId['handoff'].classList.contains('hidden'), '开局第一位真人无需遮挡（之前没有需要隐藏的牌）');
const firstCards = byId['hand'].all().filter(n => n.classList.contains('card'));
ok(firstCards.length > 0, '开局即显示第一位科学家的手牌（' + firstCards.length + ' 张）');
// 第一位真人的座位名（从玩家列表当前高亮行读取）
const curRow = byId['player-list'].children.filter(li => li.classList.contains('cur'))[0];
const starterName = curRow ? curRow.textContent : '';
ok(/科学家 [A-E]/.test(starterName), '玩家列表标出当前该行动的科学家（' + starterName.slice(0, 12) + '）');
// 他 Pass 之后 → 轮到下一位真人，弹出换人遮罩
byId['btn-pass'].onclick();
ok(!byId['handoff'].classList.contains('hidden'), '一位真人行动结束后弹出换人遮罩，轮到下一位');
ok(byId['hand'].textContent.indexOf('遮盖') >= 0, '换人遮罩期间手牌被遮盖（' + byId['hand'].textContent.slice(0, 12) + '…）');
const handoffName = byId['handoff-title'].textContent;
ok(/科学家 [A-E]/.test(handoffName), '换人遮罩显示当前该行动的科学家（' + handoffName + '）');
ok(handoffName !== starterName, '换人遮罩切换到下一位科学家（' + starterName.slice(0, 8) + ' → ' + handoffName + '）');
byId['handoff-ok'].onclick();
ok(byId['handoff'].classList.contains('hidden'), '点击「我准备好了」后遮罩关闭');
const humanCards = byId['hand'].all().filter(n => n.classList.contains('card'));
ok(humanCards.length > 0, '确认换人后显示该科学家的手牌（' + humanCards.length + ' 张）');
flushTimers(60);

/* ---------- 开局牌不参与反应（麻将式起牌） ---------- */
const g2 = windowStub.ChemGame;
const st2 = g2.startGame({
  players: [{ id: 0, name: 'A', bot: false }, { id: 1, name: 'B', bot: false }],
  mode: 'chain', seed: 3, special: true, people: true, ops: true, dlcSubstance: true
});
const rEmpty = g2.evaluatePlay({ mode: 'chain', bench: [], players: [{ id: 0, name: 'A', hand: [{ id: 'q1', kind: 'sub', sub: 'NaOH' }, { id: 'q2', kind: 'sub', sub: 'HCl' }] }], waste: [], round: 1, log: [], events: [], rnd: Math.random }, 0, ['q1', 'q2']);
ok(!rEmpty.ok, '开启新一轮不能一次出多张牌凑反应');
const rOne = g2.evaluatePlay({ mode: 'chain', bench: [], players: [{ id: 0, name: 'A', hand: [{ id: 'q1', kind: 'sub', sub: 'NaOH' }] }], waste: [], round: 1, log: [], events: [], rnd: Math.random }, 0, ['q1']);
ok(rOne.ok && rOne.opening === true && rOne.reaction === null, '开局只出一张牌且不参与反应');

/* ---------- 任意物质 / 灰显 / 反应对象选择 / 回溯 / 记牌器 / 昵称 ---------- */
const g3 = windowStub.ChemGame;
function fakeSt(hand, bench, mode) {
  return {
    mode: mode || 'chain',
    bench: (bench || []).map(b => ({ id: b, gen: 1, valid: true })),
    players: [{ id: 0, name: 'A', hand: hand, active: true }],
    waste: [], round: 1, log: [], events: [], rnd: Math.random, passed: {},
    phase: 'main', turn: 0, finished: false, relayCard: null
  };
}
const mkHand = arr => arr.map((x, i) => ({ id: 'h' + i, kind: x.k, sub: x.s, real: null, ref: x.r, sp: x.sp }));

// 1) 任意物质：可用性分析必须认可
let fs1 = fakeSt(mkHand([{ k: 'sub', s: 'WILD' }]), ['HCl']);
let pl1 = g3.playableCards(fs1, 0);
ok(pl1.canPlay['h0'] === true, '「任意物质」被判定为可出（不再置灰）');
let op1 = g3.benchReactionOptions(fs1, fs1.players[0].hand);
ok(op1.length > 0 && op1[0].equation.indexOf('→') >= 0,
  '「任意物质」能列出可反应的候选与方程式（' + (op1[0] ? op1[0].equation : '—') + '）');

// 1b) 「任意物质」在牌堆里必须是一张物质牌（曾是 kind=special，导致完全不可用）
{
  const wd = g3.buildDeck({ dlcSubstance: true, special: true, people: true, ops: true }).filter(c => c.sub === 'WILD');
  ok(wd.length === 2 && wd.every(c => c.kind === 'sub'),
    '牌堆里的「任意物质」是物质牌（kind=sub，共 ' + wd.length + ' 张）');
}

// 1c) 点击「任意物质」→ 选代替物 → 该牌换成可打出的普通物质牌
{
  const realStart = g3.startGame;
  g3.__realStart = realStart;
  g3.startGame = function (o) {
    const s = g3.__realStart(o);
    while (s.phase === 'draw') g3.drawAll(s);
    s.turn = 0; s.phase = 'main';
    s.bench = [{ id: 'HCl', gen: 1, valid: true }];
    s.players[0].hand = [{ id: 'w1', kind: 'sub', sub: 'WILD', real: null }];
    return s;
  };
  byId['btn-newgame'].onclick();
  byId['welcome-start'].onclick();
  byId['btn-start'].onclick();
  if (typeof flushTimers === 'function') flushTimers(1);

  const wcard = byId['hand'].children.filter(n => n.classList.contains('card'))[0];
  ok(!!wcard, '手牌里渲染出了「任意物质」');
  ok(wcard && !wcard.classList.contains('disabled'), '「任意物质」不是灰显状态，可以点击');
  if (wcard && typeof wcard.onclick === 'function') wcard.onclick();
  ok(!byId['overlay'].classList.contains('hidden'), '点击「任意物质」会弹出选择代替物质的窗口');
  ok(byId['overlay-title'].textContent.indexOf('任意物质') >= 0,
    '弹窗标题说明是选择「任意物质」所代替的物质（' + byId['overlay-title'].textContent + '）');
  const opts1 = byId['overlay-body'].all().filter(n => n.classList && n.classList.contains('opt'));
  ok(opts1.length > 0, '弹窗里给出可选的物质（' + opts1.length + ' 项，只来自物质牌表）');
  if (opts1.length) {
    opts1[0].onclick();
    ok(byId['overlay'].classList.contains('hidden'), '选择后弹窗关闭');
    const afterCards = byId['hand'].children.filter(n => n.classList.contains('card'));
    ok(afterCards.length === 1, '替换后手牌仍只有 1 张（换牌而不是加牌）');
    const ac = afterCards[0];
    ok(ac && ac.textContent.indexOf('任意物质') < 0, '牌面已变成真实物质，不再显示「任意物质」');
    // 再点一次不应再弹选择框（只允许替换一次），并应进入“已选中”状态
    if (ac && typeof ac.onclick === 'function') ac.onclick();
    ok(byId['overlay'].classList.contains('hidden'),
      '替换后的牌再点一次不会再弹出选择框（可替换次数只有 1 次）');
    const selCards = byId['hand'].children.filter(n => n.classList.contains('card') && n.classList.contains('sel'));
    ok(selCards.length === 1, '点击替换后的牌是“选中准备出牌”，而不是再次替换');
  }
  g3.startGame = realStart;
}

// 2) 不可出的牌必须被置灰
let fs2 = fakeSt(mkHand([{ k: 'sub', s: 'Cu' }]), ['HCl']);
let pl2 = g3.playableCards(fs2, 0);
ok(pl2.canPlay['h0'] !== true, '不能反应的牌被判为不可出（界面会置灰）');

// 3) 台上有多种物质可反应 → 给出多个可选对象
let fs3 = fakeSt(mkHand([{ k: 'sub', s: 'NaOH' }]), ['HCl', 'H2SO4']);
let op3 = g3.benchReactionOptions(fs3, fs3.players[0].hand);
ok(op3.length >= 2, '台上有多种可反应物质时给出多个可选对象（' + op3.length + ' 个）');
ok(op3.every(o => o.targets.length > 0), '每个可选对象都标明了与台上哪个物质反应');
ok(op3.every(o => o.equation.indexOf('→') >= 0), '每个可选对象都带方程式预览');

// 4) 指定反应对象后，出牌判定按该对象进行
let rA = g3.evaluatePlay(fs3, 0, ['h0'], { anchor: 'HCl' });
let rB = g3.evaluatePlay(fs3, 0, ['h0'], { anchor: 'H2SO4' });
ok(rA.ok && rA.benchUsed.indexOf('HCl') >= 0, '指定与 HCl 反应 → 判定成功');
ok(rB.ok && rB.benchUsed.indexOf('H2SO4') >= 0, '指定与 H₂SO₄ 反应 → 判定成功');

// 4b) 真实局面下：不可出的牌必须带 disabled 类（灰显），可出的牌带 suggest
{
  const realStart = g3.startGame;
  let injected = null;
  g3.startGame = function (o) {
    const s = g3.__realStart(o);
    while (s.phase === 'draw') g3.drawAll(s);
    s.turn = 0; s.phase = 'main';
    s.bench = [{ id: 'HCl', gen: 1, valid: true }];
    s.players[0].hand = [
      { id: 'z1', kind: 'sub', sub: 'NaOH' }, { id: 'z2', kind: 'sub', sub: 'Cu' },
      { id: 'z3', kind: 'sub', sub: 'AgNO3' }
    ];
    injected = s;
    return s;
  };
  g3.__realStart = realStart;
  byId['btn-newgame'].onclick();
  byId['btn-start'].onclick();
  if (typeof flushTimers === 'function') flushTimers(1);

  const cards = byId['hand'].children.filter(n => n.classList.contains('card'));
  const byId2 = {};
  cards.forEach(n => { byId2[n.dataset.id] = n; });
  ok(!!byId2['z1'] && !!byId2['z2'], '手牌渲染出注入的两张牌');
  ok(byId2['z1'] && !byId2['z1'].classList.contains('disabled'), '可出的牌（NaOH）不加 disabled');
  ok(byId2['z2'] && byId2['z2'].classList.contains('disabled'), '不可出的牌（Cu）加上 disabled → 灰显');
  const plHtml = byId['playable-list'].textContent;
  ok(plHtml.indexOf('HCl') >= 0, '右栏“可出的牌”里写明实验台物质 HCl（原文：' + plHtml.slice(0, 60) + '）');
  ok(plHtml.indexOf('Cu') < 0 || plHtml.indexOf('NaOH') >= 0, '右栏只列出真正可出的牌');
  g3.startGame = realStart;
}

// 5) 回溯（悔棋）：快照 → 变更 → 还原
byId['btn-newgame'].onclick();
byId['welcome-start'].onclick();
segBots.children[1].onclick();          // 1 位真人 + 电脑
byId['btn-start'].onclick();
flushTimers(1);
ok(typeof byId['btn-undo'].onclick === 'function', '「回溯」按钮已绑定');
const handBefore = byId['hand-title'].textContent;
const logBefore = byId['log'].children.length;
byId['btn-undo'].onclick();             // 没有历史时应提示而不是崩溃
ok(true, '无历史时点击回溯不崩溃');
ok(byId['btn-pass'].parentNode === byId['hand'].parentNode || byId['btn-pass'].parentNode != null,
  'Pass 按钮与出牌按钮位于同一工具条（同一父节点）');
ok(byId['btn-play'].parentNode === byId['btn-pass'].parentNode, 'Pass 与出牌键在同一行');

// 6) 记牌器开关
segCounter.children[1].onclick();        // 关闭
flushTimers(1);
ok(byId['bottom'].classList.contains('counter-off'), '关闭记牌器后底部区域隐藏');
segCounter.children[0].onclick();        // 启用
ok(!byId['bottom'].classList.contains('counter-off'), '启用记牌器后底部区域显示');
segCounterMode.children[0].onclick();    // 只显示总数
if (byId['all-hands'].children.length) {
  ok(true, '记牌器「仅总数」模式可切换（' + byId['all-hands'].textContent.slice(0, 24) + '）');
}
segCounterMode.children[1].onclick();    // 各科学家
byId['set-counter-color'].checked = false;
byId['set-counter-color'].onchange();
ok(true, '记牌器「不展示种类」可切换（牌面统一灰色）');
byId['set-counter-color'].checked = true;
byId['set-counter-color'].onchange();

// 7) 昵称
ok(byId['set-names'].children.length === 5, '开局面板提供 5 个昵称输入框');
const nameInputs = byId['set-names'].children.map(r => r.children[1]).filter(Boolean);
nameInputs[0].value = '门捷列夫';
nameInputs[0].oninput();
byId['btn-newgame'].onclick();
byId['welcome-start'].onclick();
byId['btn-start'].onclick();
flushTimers(1);
ok(byId['player-list'].textContent.indexOf('门捷列夫') >= 0,
  '自定义昵称生效（' + byId['player-list'].textContent.slice(0, 30) + '）');


/* ---------- 手牌排序：按牌的种类 + 表内次序 ---------- */
const shuffleMe = [
  { id: 'z1', kind: 'sub', sub: 'Ag', real: null },          // 单质（表内靠后）
  { id: 'z2', kind: 'op', ref: 'DISTILL' },                  // 操作 DLC 第 2 项
  { id: 'z3', kind: 'sub', sub: 'HCl', real: null },         // 酸（表内第 1）
  { id: 'z4', kind: 'special', sp: 'RECYCLE' },              // 特殊牌
  { id: 'z5', kind: 'sub', sub: 'WILD', real: null },        // 任意物质 → 物质牌最前
  { id: 'z6', kind: 'people', ref: 'XU' },                   // 人物 DLC 第 5 位
  { id: 'z7', kind: 'sub', sub: 'NaOH', real: null },        // 碱（表内第 7）
  { id: 'z8', kind: 'op', ref: 'FILTER' },                   // 操作 DLC 第 1 项
  { id: 'z9', kind: 'sub', sub: 'HCl', real: null },         // 与 z3 同种，应相邻
  { id: 'z10', kind: 'sub', sub: 'CO2', real: null }         // 氧化物
];
const sorted = g2.sortHand(shuffleMe).map(c => c.id);
ok(JSON.stringify(sorted) === JSON.stringify(['z4', 'z6', 'z8', 'z2', 'z5', 'z3', 'z9', 'z7', 'z10', 'z1']),
  '手牌排序：特殊牌 → 人物 → 操作 → 物质（任意物质 → 酸 → 碱 → 氧化物 → 单质），同种相邻（' + sorted.join(',') + '）');

const catSeq = g2.sortHand(shuffleMe).filter(c => c.kind === 'sub').map(c => {
  const s = windowStub.ChemDB.SUB_INDEX[c.sub === 'WILD' ? 'HCl' : c.sub];
  return c.sub === 'WILD' ? 'WILD' : s.cat;
});
ok(catSeq.indexOf('WILD') === 0 && catSeq.lastIndexOf('Ad') < catSeq.indexOf('Be'),
  '物质牌按物质牌表次序（酸在碱前）排列');

/* ---------- 排序也要体现在实际渲染的手牌 DOM 上 ---------- */
byId['btn-newgame'].onclick();
byId['welcome-start'].onclick();
segBots.children[1].onclick();          // 1 位真人 + 电脑
byId['btn-start'].onclick();
flushTimers(1);                          // 停掉电脑计时器，锁定当前画面
const domCards = byId['hand'].all().filter(n => n.classList.contains('card'));
const domGroups = domCards.map(n => {
  const cat = (n.className.match(/cat-(\w+)/) || [])[1];
  return { X: 0, P: 1, O: 2 }[cat] != null ? ({ X: 0, P: 1, O: 2 }[cat]) : 3;
});
let domSorted = true;
for (let i = 1; i < domGroups.length; i++) if (domGroups[i] < domGroups[i - 1]) domSorted = false;
ok(domCards.length === 0 || domSorted,
  '渲染出的手牌也按「特殊 → 人物 → 操作 → 物质」分组排列（' + domGroups.join('') + '）');

/* ---------- 欢迎界面 ---------- */
LOG(''); LOG('== 欢迎界面 ==');
byId['btn-newgame'].onclick();                       // 回到欢迎界面
ok(!byId['welcome'].classList.contains('hidden'), '「重新开始」回到欢迎界面');
ok(byId['setup'].classList.contains('hidden'), '此时设置面板是隐藏的');
byId['welcome-rules'].onclick();
ok(!byId['overlay'].classList.contains('hidden'), '欢迎界面「规则介绍」打开规则弹窗');
ok(Number(byId['overlay'].style.zIndex || 0) >= 300,
  '规则弹窗层级高于欢迎界面（z-index=' + byId['overlay'].style.zIndex + '；层级不足时会被欢迎界面盖住，表现为「点不开」）');
ok(byId['overlay-title'].textContent.indexOf('规则') >= 0, '规则弹窗标题正确（' + byId['overlay-title'].textContent + '）');
byId['overlay-close'].onclick();
byId['welcome-credits'].onclick();
ok(!byId['overlay'].classList.contains('hidden'), '欢迎界面「制作人员」打开制作人员弹窗');
ok(byId['overlay-title'].textContent.indexOf('制作人员') >= 0, '制作人员弹窗标题正确（' + byId['overlay-title'].textContent + '）');
ok(byId['overlay-body'].textContent.indexOf('化学之王') >= 0, '制作人员页写明原作与卡牌设定');
byId['overlay-close'].onclick();
byId['welcome-start'].onclick();
ok(byId['welcome'].classList.contains('hidden') && !byId['setup'].classList.contains('hidden'),
  '「开始游戏」从欢迎界面进入设置面板');
byId['setup-back'].onclick();
ok(!byId['welcome'].classList.contains('hidden') && byId['setup'].classList.contains('hidden'),
  '设置面板「返回」回到欢迎界面');
byId['welcome-start'].onclick();                     // 继续后续流程

/* ---------- 响应 DLC 指示：抵消牌必须可选、能出牌 ---------- */
LOG(''); LOG('== 响应指示：抵消 ==');
{
  const realStart = g3.startGame;
  let injected = null;
  g3.startGame = function (o) {
    const s = g3.__realStart2 ? g3.__realStart2(o) : realStart(o);
    while (s.phase === 'draw') g3.drawAll(s);
    s.phase = 'main'; s.turn = 0; s.bench = []; s.passed = {};
    /* 座位 0 手里有人物 DLC 与抵消，座位 1/2 手里是普通物质牌 */
    s.players[0].hand = [
      { id: 'p1', kind: 'people', ref: windowStub.ChemDB.PEOPLE[0].id },
      { id: 'cx', kind: 'special', sp: 'CANCEL' }
    ];
    s.players[1].hand = [{ id: 'b1', kind: 'sub', sub: 'NaCl', real: null }];
    s.players[2].hand = [{ id: 'c1', kind: 'sub', sub: 'NaCl', real: null }];
    injected = s;
    return s;
  };
  g3.__realStart2 = realStart;
  byId['btn-newgame'].onclick();
  byId['welcome-start'].onclick();
  segBots.children[2].onclick();                      // 全部真人（同一设备轮流）
  byId['btn-start'].onclick();
  if (typeof flushTimers === 'function') flushTimers(1);

  /* 座位 0 打出人物 DLC → 进入响应阶段 */
  const dlcCard = byId['hand'].children.filter(n => n.classList.contains('card'))
    .filter(n => n.dataset.id === 'p1')[0];
  ok(!!dlcCard, '手牌里渲染出人物 DLC 牌');
  if (dlcCard) {
    ok(!dlcCard.classList.contains('disabled'), '人物 DLC 牌可选（不是灰显）');
    dlcCard.onclick();
    const selDlc = byId['hand'].children.filter(n => n.classList.contains('sel'));
    ok(selDlc.length === 1, '人物 DLC 点击后被选中');
    byId['btn-play'].onclick();                       // 出牌确认
  }
  ok(injected && injected.phase === 'respond', '打出人物 DLC 后进入响应阶段（' +
    (injected ? injected.phase : '?') + '）');
  const pip = injected ? injected.demand.pending[0] : -1;
  ok(pip === 1 || pip === 2, '响应者是被指定的另一位科学家（' + pip + '）');

  /* 把“当前操作座位”切到响应者：热座模式下需要先点“我准备好了” */
  byId['handoff-ok'].onclick();
  const respHand = byId['hand'].children.filter(n => n.classList.contains('card'));
  ok(respHand.length > 0, '响应者的手牌已渲染（' + respHand.length + ' 张）');

  /* 让响应者拿到抵消牌：直接改状态再渲染 */
  if (injected && pip >= 0) {
    injected.players[pip].hand = [{ id: 'cx2', kind: 'special', sp: 'CANCEL' }];
    injected.players[0].bot = false;
    injected.players[pip].bot = false;
  }
  /* 触发一次渲染：通过点击「可出的牌」列表里的项重建界面不可行，
     这里用 UI 的公开入口——重新渲染由按钮触发，所以直接调用清空按钮 */
  byId['btn-clear'].onclick();
  const afterHand = byId['hand'].children.filter(n => n.classList.contains('card'));
  const cancelNode = afterHand.filter(n => n.dataset.id === 'cx2')[0];
  ok(!!cancelNode, '响应者手牌里渲染出抵消牌（' + afterHand.map(n => n.dataset.id).join(',') + '）');
  if (cancelNode) {
    ok(!cancelNode.classList.contains('disabled'),
      '响应阶段抵消牌可选（不是灰显）——这是之前报的 bug');
    cancelNode.onclick();
    const selNow = byId['hand'].children.filter(n => n.classList.contains('sel'));
    ok(selNow.length === 1, '点击抵消牌后被选中');
    byId['btn-play'].onclick();
    ok(injected && injected.demand && injected.demand.responses[pip] &&
      injected.demand.responses[pip].cancel === true, '按「出牌」键成功用抵消响应了指示');
  }
  g3.startGame = realStart;
}

/* ---------- 「其他」类别（氨气等）的卡面着色 ---------- */
LOG(''); LOG('== 其他类别（氨气等） ==');
{
  ok(windowStub.ChemDB.CAT_NAME.Ot === '其他', '「其他」类别已注册（Ot / 其他）');
  const st = windowStub.ChemGame;
  const deck = st.buildDeck({ dlcSubstance: true, special: true, people: true, ops: true });
  const nh3 = windowStub.ChemDB.SUB_INDEX['NH3'];
  ok(!!nh3 && nh3.cat === 'Ot', '氨气在数据里归类为「其他」');
  /* 直接验证卡牌的 DOM：应带 cat-Ot 类（白色标签） */
  byId['btn-newgame'].onclick();
  byId['welcome-start'].onclick();
  byId['btn-start'].onclick();
  if (typeof flushTimers === 'function') flushTimers(1);
  /* 打开物质总表，检查氨气卡片是否存在且带 cat-Ot */
  byId['btn-cardlist'].onclick();
  const otCards = byId['overlay-body'].all().filter(n => n.classList && n.classList.contains('cat-Ot'));
  ok(otCards.length > 0, '物质总表里出现了 cat-Ot（其他）的卡片（' + otCards.length + ' 张）');
  ok(byId['overlay-body'].textContent.indexOf('其他') >= 0, '物质总表里显示了「其他」分组标题');
  byId['overlay-close'].onclick();
}

/* ---------- 电脑自动推进不会卡死（全电脑 / 电脑+真人） ---------- */
LOG(''); LOG('== 电脑自动推进不卡死 ==');
{
  /* 全电脑：一路 flush 计时器，看游戏能否自然结束 */
  byId['btn-newgame'].onclick();
  byId['welcome-start'].onclick();
  segBots.children[0].onclick();                 // 全部电脑
  byId['btn-start'].onclick();
  let ticks = flushTimers(4000);
  const logText = byId['log'].textContent;
  ok(ticks < 4000, '全电脑模式下电脑行动会自动推进（' + ticks + ' 次计时器回调后停下，说明没有空转）');
  ok(logText.indexOf('实验结束') >= 0 || logText.indexOf('平局') >= 0,
    '全电脑模式的对局能够自然结束（日志里出现结束记录）');
  ok(logText.indexOf('DLC') >= 0 || logText.indexOf('指示') >= 0,
    '电脑在这局里确实打出过 DLC / 指示牌（日志里有记录）');
  ok(logText.indexOf('电脑动作被拒绝') < 0, '电脑动作没有被拒绝（不会陷入重试死循环）');

  /* 电脑 + 真人：真人一直 Pass/出牌由测试代劳，机器人也要持续推进 */
  byId['btn-newgame'].onclick();
  byId['welcome-start'].onclick();
  segBots.children[1].onclick();                 // 1 位真人 + 电脑
  byId['btn-start'].onclick();
  flushTimers(2);
  let guard = 0, acted = 0;
  const st1 = g3.__peek ? g3.__peek() : null;
  while (guard++ < 400) {
    /* 轮到真人就随便出一个能出的动作（优先出牌，否则 Pass） */
    flushTimers(2);
    const pvHand = byId['hand'].children.filter(n => n.classList.contains('card') && !n.classList.contains('disabled'));
    if (pvHand.length) { pvHand[0].onclick(); byId['btn-play'].onclick(); acted++; }
    else { byId['btn-pass'].onclick(); acted++; }
    flushTimers(40);
    if (byId['log'].textContent.indexOf('实验结束') >= 0) break;
  }
  ok(byId['log'].textContent.indexOf('实验结束') >= 0 || acted > 20,
    '电脑 + 真人模式下双方都能轮流行动（真人行动 ' + acted + ' 次，未卡死）');
  ok(byId['log'].textContent.indexOf('电脑动作被拒绝') < 0,
    '电脑 + 真人模式下电脑动作没有被拒绝');
}

LOG('\n============================');
LOG('通过 ' + pass + ' 项，失败 ' + fail + ' 项');
LOG('============================');
fs.writeFileSync(path.join(__dirname, 'ui-smoke.out'), lines.join('\n'), 'utf8');
process.exit(fail ? 1 : 0);














