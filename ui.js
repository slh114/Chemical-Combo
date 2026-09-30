/* ============================================================
 * 化学之王 Chemical Combo —— 界面层
 * 依赖 data.js (ChemDB) 与 game.js (ChemGame)
 * ============================================================ */
(function () {
  'use strict';
  var DB = window.ChemDB, G = window.ChemGame;
  var st = null;                 // 当前对局
  var sel = [];                  // 选中的手牌 id
  var benchTarget = null;        // 玩家点选的“要与台上哪个物质反应”
  var botTimer = null;           // 待执行的电脑行动计时器
  var botSkip = 0;               // 连续被拒绝的电脑动作计数（防止死循环）
  var curOptions = [];           // 当前选择对应的可选反应（含方程式）
  var me = 0;                    // 当前真人玩家座位（-1 = 观战）
  var busy = false;              // 电脑思考中 / 等待换人
  var lastLogLen = 0;
  var hotseat = false;           // 全部真人：同一设备轮流
  var humanSeats = [];           // 真人座位号
  var cfg = {                       // 开局设置
    players: 3, mode: 'chain', dlcSubstance: true, people: true, ops: true, special: true,
    bots: 'all', open: false, botSpeed: 0.7,
    counter: true, counterColor: true, counterMode: 'each',
    names: []
  };

  /* 深拷贝对局状态（用于回溯）：函数按引用保留，rnd 状态单独保存 */
  function cloneState(s) {
    if (s === null || typeof s !== 'object') return s;
    if (Array.isArray(s)) return s.map(cloneState);
    var o = {};
    Object.keys(s).forEach(function (k) {
      var v = s[k];
      o[k] = (typeof v === 'function') ? v : cloneState(v);
    });
    return o;
  }
  function snapshot() {
    if (!st) return null;
    return { st: cloneState(st), rnd: st.rnd };
  }
  /* 回溯（悔棋）：回到**上家上一次出牌之后**，也就是撤销自己上一次操作。
   * nodeSnapshot = 自己上一次操作之前的局面 = 上家出完牌、轮到自己决定的那一刻；
   * prevSnapshot = 再往前一个节点（只作为首次操作时的兜底）。 */
  var prevSnapshot = null;
  var nodeSnapshot = null;
  function markPlayNode(before) {
    var b = before || snapshot();
    prevSnapshot = nodeSnapshot;
    nodeSnapshot = b;
  }
  function undo() {
    if (!st) { toast('没有可回溯的局面'); return; }
    var target = nodeSnapshot || prevSnapshot;
    if (!target) { toast('还没有可回溯的出牌记录'); return; }
    if (botTimer) { clearTimeout(botTimer); botTimer = null; }
    busy = false;
    st = target.st;
    st.rnd = target.rnd;
    prevSnapshot = null;
    nodeSnapshot = null;
    sel = []; benchTarget = null; curOptions = [];
    if (hotseat) { handoffKey = null; awaitingHandoff = false; skipNextHandoff = false; }
    $('handoff').classList.add('hidden');
    G.logMsg(st, '↩ 已回滚到上家上一次出牌之后（撤销你上一次操作）', 'muted');
    render();
    scheduleBot();
  }

  var $ = function (id) { return document.getElementById(id); };
  function el(tag, cls, html) {
    var d = document.createElement(tag);
    if (cls) d.className = cls;
    if (html != null) d.innerHTML = html;
    return d;
  }
  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  var CAT_LABEL = { Ad: 'Ad', Be: 'Be', St: 'St', Oe: 'Oe', Es: 'Es', Ot: 'Ot' };
  var SOL_ICON = { y: '✔', m: '…', n: '✘', x: '—' };
  var ST_ICON = { s: '固', l: '液', g: '气' };

  function catOf(card) {
    if (card.kind === 'sub') {
      var s = DB.SUB_INDEX[card.sub];
      return s ? s.cat : 'St';
    }
    if (card.kind === 'special') return 'X';
    if (card.kind === 'people') return 'P';
    return 'O';
  }

  function iconsOf(card) {
    if (card.kind !== 'sub') return '';
    var s = DB.SUB_INDEX[card.sub];
    if (!s) return '';
    var out = [];
    out.push('Ad Be St Oe Es Ot'.indexOf(s.cat) >= 0 ? CAT_LABEL[s.cat] : '');
    out.push(SOL_ICON[s.sol] || '');
    out.push(ST_ICON[s.st] || '');
    if (s.cor) out.push('腐');
    if (s.vol) out.push('↑');
    if (s.dec) out.push('▲');
    return out.filter(Boolean).join(' ');
  }

  /* ---------------- 卡牌渲染 ---------------- */
  function cardNode(card, opts) {
    opts = opts || {};
    var cat = catOf(card);
    var d = el('div', 'card cat-' + cat);
    if (cat === 'X') d.classList.add('special');
    if (cat === 'P') d.classList.add('people');
    if (cat === 'O') d.classList.add('op');
    d.dataset.id = card.id;
    d.appendChild(el('div', 'cat-bar'));

    if (card.kind === 'sub') {
      var s = DB.SUB_INDEX[card.sub] || { f: card.sub, n: '', note: '' };
      var isWild = card.sub === 'WILD';
      if (isWild) {
        var real = card.real ? DB.SUB_INDEX[card.real] : null;
        d.appendChild(el('div', 'formula', real ? esc(real.f) : '?'));
        d.appendChild(el('div', 'cn', real ? esc(real.n) + '（代替）' : '任意物质'));
        d.appendChild(el('div', 'icons', '任选表内物质'));
        d.appendChild(el('div', 'note', '使用时须明确所代替的物质'));
      } else {
        d.appendChild(el('div', 'formula', esc(s.f)));
        d.appendChild(el('div', 'cn', esc(s.n)));
        d.appendChild(el('div', 'icons', iconsOf(card)));
        d.appendChild(el('div', 'note', esc(s.note || '')));
        if (card.dlc) d.appendChild(el('div', 'dlc-mark', 'DLC'));
      }
      if (!isWild) d.appendChild(el('div', 'cat', CAT_LABEL[s.cat] || ''));
    } else if (card.kind === 'special') {
      var sp = G.specialById(card.sp);
      d.appendChild(el('div', 'big', esc(sp.name)));
      d.appendChild(el('div', 'icons', 'S · 特殊牌'));
      d.appendChild(el('div', 'text', esc(sp.text)));
    } else if (card.kind === 'people') {
      var pp = G.peopleById(card.ref);
      d.appendChild(el('div', 'who', esc(pp.name)));
      d.appendChild(el('div', 'icons', '人物 DLC · ' + esc(pp.cn || '')));
      d.appendChild(el('div', 'text', esc(pp.text)));
    } else if (card.kind === 'op') {
      var oo = G.opById(card.ref);
      d.appendChild(el('div', 'big', esc(oo.name)));
      d.appendChild(el('div', 'icons', '操作 DLC'));
      d.appendChild(el('div', 'text', esc(oo.text)));
    }
    if (opts.disabled) d.classList.add('disabled');
    if (opts.suggest) d.classList.add('suggest');
    if (opts.invalid) d.classList.add('invalid');
    if (opts.isNew) d.classList.add('new');
    return d;
  }

  function subCardNode(subId, opts) {
    return cardNode({ id: 'b:' + subId, kind: 'sub', sub: subId, real: null }, opts || {});
  }

  /* ---------------- 渲染 ---------------- */
  /* 当前需要操作的座位（响应阶段是响应者，否则是当前出牌者） */
  function activeSeat() {
    if (!st) return -1;
    if (st.phase === 'respond' && st.demand && st.demand.pending.length) return st.demand.pending[0];
    if (st.phase === 'main') return st.turn;
    return st.turn;
  }

  /* 热座模式下由“当前该行动的人”操作 */
  function syncSeat() {
    if (hotseat) me = activeSeat();
  }

  function render() {
    if (!st) return;
    syncSeat();
    $('deck-count').textContent = st.deck.length;
    $('waste-count').textContent = st.waste.length;
    $('round-no').textContent = st.round;
    updateOptions();
    renderPlayers();
    renderBench();
    renderHand();
    renderPlayableList();
    renderHints();
    renderLog();
    renderBottom();
    renderDemandBar();
  }

  /* 根据当前选择，重新计算“可与台上哪种物质反应”以及方程式预览 */
  function updateOptions() {
    curOptions = [];
    if (!st || me < 0 || !sel.length) { benchTarget = null; return; }
    var p = st.players[me];
    if (!p || !p.active) { benchTarget = null; return; }
    var inMain = st.phase === 'main' && st.turn === me && !st.finished;
    if (!inMain) { benchTarget = null; return; }
    var selected = sel.map(function (id) {
      var c = p.hand.filter(function (x) { return x.id === id; })[0];
      return c;
    }).filter(Boolean);
    if (!selected.length) { benchTarget = null; return; }
    if (selected.some(function (c) { return c.kind !== 'sub'; })) { benchTarget = null; return; }
    if (selected.some(function (c) { return c.sub === 'WILD' && !c.real; })) { benchTarget = null; return; }
    curOptions = G.benchReactionOptions(st, selected, null);
    var valid = curOptions.filter(function (o) { return o.targets.length; });
    if (valid.length) curOptions = valid; else curOptions = [];
    if (benchTarget && !curOptions.some(function (o) { return o.targets.indexOf(benchTarget) >= 0; })) {
      benchTarget = null;
    }
    if (curOptions.length && !benchTarget) benchTarget = curOptions[0].targets[0];
  }

  function renderPlayers() {
    var ul = $('player-list');
    ul.innerHTML = '';
    st.players.forEach(function (p, i) {
      var li = el('li', (i === st.turn && !st.finished ? 'cur ' : '') + (i === me ? 'me' : '') + (p.active ? '' : ' out'));
      li.appendChild(el('span', 'nm', (p.bot ? '🤖 ' : '🧑‍🔬 ') + esc(p.name)));
      li.appendChild(el('span', 'cnt', String(p.hand.length)));
      if (!p.bot && hotseat) li.appendChild(el('span', 'tag bot', i === me ? '操作中' : '等待'));
      else if (p.bot) li.appendChild(el('span', 'tag bot', '电脑'));
      if (p.skip > 0) li.appendChild(el('span', 'tag skip', '停' + p.skip));
      if (p.won) li.appendChild(el('span', 'tag win', '已出完'));
      if (p.out) li.appendChild(el('span', 'tag', '出局'));
      ul.appendChild(li);
    });
  }

  function renderBench() {
    var b = $('bench');
    b.innerHTML = '';
    // 当前选择能与之反应的台上物质
    var targets = {};
    var chosen = benchTarget;
    curOptions.forEach(function (o) { o.targets.forEach(function (t) { targets[t] = true; }); });

    if (!st.bench.length) {
      b.appendChild(el('div', 'empty', '实验台为空 —— 可以出一张物质牌开启新一轮'));
    } else {
      st.bench.forEach(function (x) {
        var isTarget = !!targets[x.id];
        var node = subCardNode(x.id, { invalid: !x.valid });
        if (isTarget) {
          node.classList.add('bench-target');
          if (x.id === chosen) node.classList.add('bench-chosen');
          node.onclick = function () {
            benchTarget = x.id;
            render();
          };
        }
        b.appendChild(node);
      });
    }

    var hint = [];
    var activeN = st.players.filter(function (q) { return q.active; }).length;
    var passN = st.players.filter(function (q) { return q.active && st.passed && st.passed[q.id]; }).length;
    if (st.mode === 'relay') {
      hint.push(st.relayCard
        ? '🎯 接力目标：必须与上家所出的 ' + DB.label(st.relayCard) + ' 反应'
        : '本轮尚无接力目标：出一张牌开启新一轮');
    } else if (st.bench.length) {
      var act = activeSubs();
      hint.push(act.length
        ? '可反应物质：' + act.map(function (x) { return DB.label(x.id); }).join('、')
        : '（无有效物质，可出一张牌开启新一轮）');
    }
    hint.push('本轮 Pass：' + passN + '/' + activeN + (passN > 0 && passN < activeN ? '（全部 Pass 后才倒入废液缸）' : ''));
    $('bench-hint').textContent = hint.join('　｜　');

    // 提示玩家点选反应对象
    var chooseHint = $('bench-choose-hint');
    if (!chooseHint) return;
    if (curOptions.length > 1) {
      chooseHint.textContent = '👆 有 ' + curOptions.length + ' 种物质都可反应，请在实验台上点选一种';
      chooseHint.style.color = '#ffd54f';
    } else if (curOptions.length === 1 && curOptions[0].targets.length) {
      chooseHint.textContent = '将与 ' + DB.label(curOptions[0].targets[0]) + ' 反应';
      chooseHint.style.color = '#9fe3c0';
    } else {
      chooseHint.textContent = '';
    }

    var strip = $('reaction-strip');
    if (curOptions.length) {
      var chosenOpt = curOptions.filter(function (o) { return o.targets.indexOf(chosen) >= 0; })[0] || curOptions[0];
      strip.textContent = (curOptions.length > 1 ? '（当前选中 ' + DB.label(chosenOpt.targets[0]) + '）' : '') +
        '预测反应：' + chosenOpt.equation + '　【' + chosenOpt.note + '】';
      strip.style.color = '#9fe3c0';
    } else if (st.mode === 'relay' && st.relayCard && !st.reaction) {
      strip.textContent = '🎯 上家（' + (st.relayOwner != null && st.players[st.relayOwner] ? st.players[st.relayOwner].name : '—') +
        '）所出的牌是 ' + DB.label(st.relayCard) + ' —— 你出的牌必须能与它反应。';
      strip.style.color = '';
    } else if (st.reaction) {
      strip.textContent = '✔ ' + st.reaction.text + '　【第' + st.reaction.round + '回合 · ' +
        st.players[st.reaction.player].name + '】';
      strip.style.color = '';
    } else if (st.bench.length) {
      strip.textContent = passN > 0
        ? '⏳ 已有 ' + passN + '/' + activeN + ' 位科学家 Pass；只有全部科学家都 Pass 后，实验台上的物质才会倒入废液缸。'
        : '⏳ 实验台上是上一手留下的物质，等待下一位科学家决定是否让它参与反应（Pass 后仍保留，直到所有人 Pass）。';
      strip.style.color = '';
    } else {
      strip.textContent = '';
      strip.style.color = '';
    }
  }

  function activeSubs() {
    return st.bench.filter(function (x) { return x.valid; });
  }

  function renderHand() {
    var hand = $('hand');
    hand.innerHTML = '';
    if (me < 0) {
      $('hand-title').textContent = '观战模式（全部电脑对战）';
      hand.appendChild(el('div', 'empty', '你正在观战：所有座位都由电脑控制。点击「重新开始」可以改为亲自实验。'));
      return;
    }
    var p = st.players[me];
    $('hand-title').textContent = (hotseat ? '🧑‍🔬 ' : '') + '我的手牌 · ' + p.name + '（' + p.hand.length + ' 张）';
    if (!$('handoff').classList.contains('hidden') || awaitingHandoff) {
      hand.appendChild(el('div', 'empty', '🔒 手牌已遮盖 —— 点击「我准备好了，显示手牌」后才会显示 ' + p.name + ' 的手牌。'));
      return;
    }
    if (!p.active) {
      hand.appendChild(el('div', 'empty', p.won ? '你已出完全部手牌，成为旁观者 🏆' : '你已出局'));
      return;
    }
    var myTurn = st.phase === 'main' && st.turn === me && !busy && !st.finished;
    var canRespond = st.phase === 'respond' && st.demand && st.demand.pending[0] === me && !st.finished;
    var play = G.playableCards(st, me);
    G.sortHand(p.hand).forEach(function (c) {
      var usable;
      if (myTurn) {
        usable = c.kind === 'sub' ? !!play.canPlay[c.id]
          : (c.kind === 'special' ? !!play.canSpecial[c.id] : !!play.canDLC[c.id]);
      } else {
        usable = canRespond && (c.kind === 'sub' ? !!play.canPlay[c.id] : !!play.canSpecial[c.id]);
      }
      if (myTurn && c.kind === 'sub' && c.sub === 'WILD') usable = true;
      var node = cardNode(c, { disabled: !usable, suggest: usable });
      if (sel.indexOf(c.id) >= 0) node.classList.add('sel');
      if (usable) {
        node.onclick = function () { onCardClick(c); };
      } else {
        node.onclick = function () {
          if (c.kind === 'sub') {
            toast('「' + DB.label(c.real || c.sub) + '」现在用不了：实验台上没有它能参与的反应' +
              (st.mode === 'relay' && st.relayCard ? '（须能与上家所出的 ' + DB.label(st.relayCard) + ' 反应）' : '') +
              '。可以换一张牌，或点击 Pass。');
          } else if (c.kind === 'special') {
            toast('「' + G.specialById(c.sp).name + '」现在用不了（' +
              (c.sp === 'RECYCLE' ? '废液缸里还没有物质牌' : c.sp === 'CANCEL' ? '当前没有可抵消的反应' : '手牌里没有可转换的物质牌') + '）。');
          } else {
            toast('该 DLC 牌现在用不了（所有对手都能满足它的要求，或者不在你的回合）。');
          }
        };
      }
      hand.appendChild(node);
    });

    var sh = $('sel-hint');
    if (sh) {
      if (myTurn) sh.textContent = play.any
        ? '已选 ' + sel.length + ' 张；灰显的牌当前无法使用'
        : '没有可出的牌，请点击 Pass';
    }
  }

  /* ---------------- 右栏：可出的牌 ---------------- */
  function renderPlayableList() {
    var box = $('playable-list');
    if (!box) return;
    box.innerHTML = '';
    if (!st || st.finished) { box.appendChild(el('div', 'none', '实验已结束')); return; }
    if (me < 0) { box.appendChild(el('div', 'none', '观战中')); return; }
    if (st.phase === 'draw') { box.appendChild(el('div', 'none', '抽牌阶段……')); return; }
    if (!$('handoff').classList.contains('hidden') || awaitingHandoff) {
      box.appendChild(el('div', 'none', '请先确认换人'));
      return;
    }
    var p = st.players[me];
    if (!p || !p.active) { box.appendChild(el('div', 'none', '你已不参与本局')); return; }
    var play = G.playableCards(st, me);

    if (st.phase === 'respond' && st.demand) {
      var dm = st.demand;
      box.appendChild(el('div', 'none', '需要响应指示：' + dm.needDesc));
      G.sortHand(p.hand).forEach(function (c) {
        if (!play.canPlay[c.id] && !play.canSpecial[c.id]) return;
        var s = c.kind === 'sub' ? DB.SUB_INDEX[c.real || c.sub] : null;
        var txt = c.kind === 'sub'
          ? (s ? s.f + '（' + s.n + '）' : DB.label(c.sub))
          : G.cardLabel(c);
        var it = el('div', 'pl ' + (c.kind === 'special' ? 'sp' : 'ok'), esc(txt) +
          '<span class="why">点击即用于响应</span>');
        it.onclick = function () { onCardClick(c); };
        box.appendChild(it);
      });
      return;
    }

    // 说明当前实验台的可反应物质，避免“x 与实验台反应”这种看不出对象的提示
    if (play.opening) {
      box.appendChild(el('div', 'none', '实验台为空：出一张物质牌铺垫（本张不参与反应）'));
    } else {
      box.appendChild(el('div', 'none', '实验台可反应物质：' +
        play.benchList.map(function (x) { return DB.label(x); }).join('、')));
    }

    G.sortHand(p.hand).forEach(function (c) {
      var cls = null, why = '';
      if (c.kind === 'sub') {
        if (play.canPlay[c.id]) {
          cls = 'ok';
          why = play.opening
            ? '可出：开启新一轮，本张不参与反应'
            : '可出：能与 ' + play.benchList.map(function (x) { return DB.label(x); }).join(' / ') + ' 反应';
        } else if (c.sub === 'WILD' && !c.real) {
          cls = 'sp'; why = '可出：先选择所代替的物质';
        }
      } else if (c.kind === 'special') {
        if (play.canSpecial[c.id]) { cls = 'sp'; why = '可用（不计入出牌次数）'; }
      } else if (c.kind === 'people' || c.kind === 'op') {
        if (play.canDLC[c.id]) { cls = 'dlc'; why = '可出：其它科学家需响应'; }
      }
      if (!cls) return;
      var label = c.kind === 'sub'
        ? ((c.sub === 'WILD' && !c.real) ? '任意物质' : DB.label(c.sub) + '（' + DB.nameOf(c.real || c.sub) + '）')
        : G.cardLabel(c);
      var it = el('div', 'pl ' + cls, esc(label) + '<span class="why">' + esc(why) + '</span>');
      it.onclick = function () { onCardClick(c); };
      box.appendChild(it);
    });
    if (!box.querySelector('.pl')) {
      box.appendChild(el('div', 'none', play.blockReason || '当前没有可出的牌，可点击 Pass'));
    }
  }

  function renderHints() {
    var box = $('hints');
    box.innerHTML = '';
    if (st.finished) {
      box.appendChild(el('div', 'hint-item small', '实验已结束，可点击「重新开始」再来一局。'));
      return;
    }
    if (st.phase === 'draw') {
      box.appendChild(el('div', 'hint-item small', '抽牌阶段……'));
      return;
    }
    if (!$('handoff').classList.contains('hidden')) {
      box.appendChild(el('div', 'hint-item small', '请先点击「我准备好了，显示手牌」。'));
      return;
    }
    if (st.phase === 'respond') {
      var dm = st.demand;
      box.appendChild(el('div', 'hint-item sp', '指示：' + esc(dm.name) + ' —— ' + esc(dm.needDesc) +
        '；若不出牌则停 ' + dm.stop + ' 回合。'));
      box.appendChild(el('div', 'hint-item small', '响应顺序：' +
        (dm.pending.map(function (i) { return st.players[i].name; }).join(' → ') || '（已完成）')));
      if (dm.pending[0] === me) {
        box.appendChild(el('div', 'hint-item small', '点击手里符合条件的物质牌即可响应；也可以用「抵消」。'));
      }
      return;
    }
    if (me < 0) {
      box.appendChild(el('div', 'hint-item small', '观战中：等待电脑行动……'));
      return;
    }
    if (st.turn !== me) {
      box.appendChild(el('div', 'hint-item small', '等待 ' + esc(st.players[st.turn].name) + ' 出牌……'));
      return;
    }
    var hs = G.hintsFor(st, me);
    if (!hs.length) {
      box.appendChild(el('div', 'hint-item small', '没有可出的牌，请点击「结束出牌轮」（Pass）。'));
      return;
    }
    if (activeSubs().length === 0) {
      box.appendChild(el('div', 'hint-item sp', '实验台为空：出一张牌开启新一轮 —— 这张牌不参与反应，由你的下家决定是否与它反应。'));
    }
    hs.forEach(function (h) {
      var cls = 'hint-item' + (h.kind !== 'cards' ? ' sp' : (h.invalid ? ' invalid' : ''));
      var item = el('div', cls, esc(h.label));
      item.onclick = function () {
        if (h.kind === 'cards') {
          sel = h.cards.slice();
          render();
        } else if (h.kind === 'recycle') {
          doAction(function () { return G.useRecycle(st, me); });
        } else if (h.kind === 'cancel') {
          doAction(function () { return G.useCancel(st, me); });
        } else if (h.kind === 'convert') {
          openConvertPicker();
        }
      };
      box.appendChild(item);
    });
  }

  function renderLog() {
    var box = $('log');
    for (var i = lastLogLen; i < st.log.length; i++) {
      var e = st.log[i];
      box.appendChild(el('div', e.cls, esc(e.text)));
    }
    lastLogLen = st.log.length;
    box.scrollTop = box.scrollHeight;
  }

  /* ---------------- 记牌器（下方手牌区） ---------------- */
  function renderBottom() {
    var box = $('all-hands');
    if (!box) return;
    box.innerHTML = '';
    if (!cfg.counter) return;                       // 记牌器已关闭
    if (!st) return;

    if (cfg.counterMode === 'total') {
      var total = st.players.reduce(function (a, p) { return a + p.hand.length; }, 0);
      var row0 = el('div', 'hand-row');
      row0.appendChild(el('div', 'who', '🔢 记牌器'));
      var cards0 = el('div', 'cards');
      cards0.appendChild(el('span', 'mini-card', '在场手牌合计 ' + total + ' 张'));
      cards0.appendChild(el('span', 'mini-card', '药品柜 ' + st.deck.length + ' 张'));
      cards0.appendChild(el('span', 'mini-card', '废液缸 ' + st.waste.length + ' 条'));
      row0.appendChild(cards0);
      box.appendChild(row0);
      return;
    }

    st.players.forEach(function (p, i) {
      var row = el('div', 'hand-row');
      row.appendChild(el('div', 'who' + (i === st.turn && !st.finished ? ' cur' : '') + (i === me ? ' me' : ''),
        p.name + '（' + p.hand.length + '）'));
      var cards = el('div', 'cards');
      // 能否看到具体牌面：明牌、实验结束、或轮到自己且不在响应阶段
      var showDetail;
      if (hotseat) showDetail = cfg.open || st.finished || (i === me && !awaitingHandoff);
      else showDetail = cfg.open || st.finished || (i === me && st.phase !== 'respond');
      p.hand = G.sortHand(p.hand);
      p.hand.forEach(function (c) {
        var lab = c.kind === 'sub'
          ? (c.sub === 'WILD' ? (c.real ? DB.label(c.real) + '(任意)' : '任意物质') : DB.label(c.sub))
          : G.cardLabel(c);
        // 不展示种类时，所有牌统一为灰色（cat-X）
        var cls = 'mini-card ' + (cfg.counterColor && showDetail ? ('cat-' + catOf(c)) : 'cat-X');
        cards.appendChild(el('span', cls, showDetail ? esc(lab) : '🂠'));
      });
      if (!p.hand.length) cards.appendChild(el('span', 'mini-card', '（已出完）'));
      row.appendChild(cards);
      box.appendChild(row);
    });
  }

  function renderDemandBar() {
    var old = $('demand-bar');
    if (old) old.remove();
    if (st.phase !== 'respond' || !st.demand) return;
    var dm = st.demand;
    var bar = el('div', '', '');
    bar.id = 'demand-bar';
    var resp = dm.pending[0];
    var who = resp != null ? st.players[resp].name : '—';
    bar.innerHTML = '<span>🧪 指示【' + esc(dm.name) + '】' + esc(dm.needDesc) +
      '（不出牌停 ' + dm.stop + ' 回合）</span><span class="who">等待 ' + esc(who) + ' 响应</span>';
    var acts = el('div', 'acts');
    if (me < 0 || resp !== me || !$('handoff').classList.contains('hidden')) {
      acts.appendChild(el('span', 'hint-item small', '（点击上方手牌中的物质牌即可响应该指示）'));
    } else {
      var b1 = el('button', 'primary', '我不出牌，接受惩罚');
      b1.onclick = function () { doAction(function () { return G.acceptPenalty(st, me); }); };
      acts.appendChild(b1);
      acts.appendChild(el('span', 'hint-item small', '（选择手牌后按「出牌」确认响应）'));
    }
    bar.appendChild(acts);
    $('bench-panel').after(bar);
  }

  /* ---------------- 交互 ---------------- */
  function onCardClick(card) {
    if (!st || st.finished) return;
    if (st.phase === 'respond' && st.demand) {
      if (st.responder !== me && st.demand.pending[0] !== me) return;
      /* 物质牌：点击即用于响应（这是指示的常规响应方式） */
      if (card.kind === 'sub') {
        if (card.sub === 'WILD' && !card.real) {
          openWildPicker(function (subId) {
            doAction(function () {
              G.setWild(st, me, card.id, subId);
              return G.respondSubstance(st, me, card.id);
            });
          });
          return;
        }
        doAction(function () { return G.respondSubstance(st, me, card.id); });
        return;
      }
      /* 特殊牌（抵消）：先选中，再由出牌键确认。
       * 之前这里对任何牌都直接调 respondSubstance，抵消牌会被立刻拒绝，
       * 界面看起来就是「抵消点不动、选不上」。 */
      if (card.kind === 'special') {
        var k = sel.indexOf(card.id);
        if (k >= 0) sel.splice(k, 1); else sel = [card.id];
        render();
        return;
      }
      return;
    }
    if (st.phase !== 'main' || st.turn !== me) return;
    // 「任意物质」：点击 → 询问要替换成哪种物质（只能选物质牌表内的物质）
    // → 该物质以一张新手牌的形式放进自己的手牌 → 再由玩家决定出哪张牌
    if (card.kind === 'sub' && card.sub === 'WILD') {
      openWildPicker(function (subId) {
        var r = doAction(function () { return G.setWild(st, me, card.id, subId); });
        if (r && r.ok) {
          var idx = sel.indexOf(card.id);
          if (idx >= 0) sel.splice(idx, 1);
          benchTarget = null;
          render();
          toast('已把「任意物质」换成了 ' + DB.label(subId) + '（' + DB.nameOf(subId) +
            '），现在可以像普通物质牌一样打出它。');
        }
      });
      return;
    }
    // 特殊牌 / 人物牌 / 操作牌：同样先选中，由出牌键确认
    if (card.kind === 'people' || card.kind === 'op' || card.kind === 'special') {
      var j = sel.indexOf(card.id);
      if (j >= 0) sel.splice(j, 1); else sel = [card.id];
      render();
      return;
    }
    var i = sel.indexOf(card.id);
    if (i >= 0) { sel.splice(i, 1); benchTarget = null; } else { sel.push(card.id); }
    render();
  }

  function doAction(fn) {
    if (!st) return { ok: false };
    var before = snapshot();              // 本次操作前的局面（用于判断是否成功）
    var r = fn();
    if (r && !r.ok) {
      toast(r.reason);
      return r;                           // 明确告知用户不能出牌，不做任何界面“补救”
    }
    /* 操作成功：把“上家出牌节点”推进为操作前的局面，
     * 于是点回溯时会滚回到上家上一次出牌之后那一刻。 */
    markPlayNode(before);
    sel = [];
    benchTarget = null;
    render();
    scheduleBot();
    return r;
  }

  function toast(msg) {
    if (!msg) return;
    G.logMsg(st, '⚠ ' + msg, 'warn');
    render();
  }

  /* 按下「出牌」：按牌的种类分别处理，全部都要经此确认 */
  function playSelected() {
    if (!st || st.finished) return;
    if (st.phase === 'respond') {
      var rp = st.responder != null ? st.responder : (st.demand ? st.demand.pending[0] : -1);
      if (rp !== me || !sel.length) { toast('请先选中一张用于响应的牌'); return; }
      var c0 = st.players[me].hand.filter(function (c) { return c.id === sel[0]; })[0];
      if (!c0) { toast('请先选中一张用于响应的牌'); return; }
      if (c0.kind === 'sub') doAction(function () { return G.respondSubstance(st, me, c0.id); });
      else if (c0.kind === 'special' && c0.sp === 'CANCEL') doAction(function () { return G.useCancel(st, me); });
      else toast('该牌不能用于响应指示');
      return;
    }
    if (st.phase !== 'main' || st.turn !== me) return;
    if (!sel.length) { toast('请先选择要出的牌'); return; }
    var cards = sel.map(function (id) {
      return st.players[me].hand.filter(function (c) { return c.id === id; })[0];
    }).filter(Boolean);
    if (cards.length !== sel.length) { toast('手牌已变化，请重新选择'); sel = []; render(); return; }

    // 只选了一张非物质牌 → 按特殊牌 / DLC 处理
    if (cards.length === 1 && cards[0].kind !== 'sub') {
      var c = cards[0];
      if (c.kind === 'special') {
        if (c.sp === 'RECYCLE') doAction(function () { return G.useRecycle(st, me); });
        else if (c.sp === 'CANCEL') doAction(function () { return G.useCancel(st, me); });
        else if (c.sp === 'CONVERT') openConvertPicker();
        return;
      }
      doAction(function () { return G.playDLC(st, me, c.id); });
      return;
    }
    // 混合选择：物质牌 + 特殊牌
    if (cards.some(function (c) { return c.kind !== 'sub'; })) {
      if (cards.length === 1) return;
      toast('物质牌与特殊牌请分开出');
      return;
    }
    // 物质牌：带上玩家点选的反应对象。
    // 注意：这里不再弹「多选的牌不参与反应」这类"搭车"确认框——
    // 引擎会直接拒绝这种出牌（每张牌都必须被同一个反应用掉），只提示原因即可。
    var opt = {};
    if (benchTarget && curOptions.some(function (o) { return o.targets.indexOf(benchTarget) >= 0; })) {
      opt.anchor = benchTarget;
    }
    doAction(function () { return G.playCards(st, me, sel.slice(), opt); });
  }

  /* ---------------- 欢迎界面 / 制作人员 ---------------- */
  function showWelcome() {
    var w = $('welcome');
    if (!w) return;
    var h1 = w.querySelector('h1');
    if (h1) h1.textContent = '化学之王';
  }

  function showCredits() {
    var d = el('div', '');
    d.appendChild(el('div', 'quote',
      '本页是桌游《化学之王》的官方单机网页版，原作SLH.Pictures.Inc.'));
    d.appendChild(el('h3', '', '原作'));
    d.appendChild(el('div', 'kv', '<b>桌游名称</b><span>化学之王 Chemical Combo</span>'));
    d.appendChild(el('div', 'kv', '<b>规则来源</b><span>《化学之王 游戏指南》（正文第 1~6 部分及附录）、《规则补充》</span>'));
    d.appendChild(el('div', 'kv', '<b>卡牌设定</b><span>酸 15 张 · 碱 15 张 · 盐 25 张 · 氧化物 10 张 · 单质 15 张 = 基础物质牌 80 张</span>'));
    d.appendChild(el('div', 'kv', '<b>扩展内容</b><span>物质 DLC 10 张 · 特殊牌 5 张 · 人物 DLC 5 张 · 操作 DLC 5 张</span>'));
    d.appendChild(el('h3', '', '网页复现'));
    d.appendChild(el('div', 'kv', '<b>实现方式</b><span>纯 HTML + CSS + 原生 JavaScript，无框架、无外部依赖、可离线双击运行</span>'));
    d.appendChild(el('div', 'kv', '<b>规则引擎</b><span>反映链判定、麻将式开局牌、全部 Pass 才清台、特殊牌、人物/操作 DLC 指示与停牌结算</span>'));
    d.appendChild(el('div', 'kv', '<b>电脑对手</b><span>启发式 AI，出牌间隔可调；也可全部换成真人同一设备轮流</span>'));
    d.appendChild(el('h3', '', '数据'));
    d.appendChild(el('div', 'kv', '<b>物质库</b><span>' + DB.SUBSTANCES.length + ' 种（物质牌表 ' + DB.CARD_TABLE.length + ' 种）'));
    d.appendChild(el('div', 'kv', '<b>反应库</b><span>' + DB.REACTIONS.length + ' 条，含反应条件、类型与名称'));
    d.appendChild(el('div', 'kv', '<b>生成方式</b><span>离子穷举 + 经典反应族枚举 + 相关性/范围过滤，见 tools/gen-reactions.js'));
    d.appendChild(el('div', 'kv', '<b>准确性</b><span>经独立化学审查（test/chemistry-review.out）后修正；不含分解反应'));
    d.appendChild(el('h3', '', '致谢'));
    d.appendChild(el('div', 'quote',
      '感谢《化学之王》原作设计者SLH.Pictures.Inc.与所有把化学做成游戏的人。愿这套卡片能让你更愿意翻开课本。'));
    openOverlay('🧑‍🔬 制作人员与声明', d);
  }


  /* ---------------- 选择器 ---------------- */
  function pickSubstance(title, filterFn, onPick, extraTop) {
    var body = $('overlay-body');
    body.innerHTML = '';
    if (extraTop) { body.appendChild(extraTop); }
    var row = el('div', 'declare-search');
    var input = el('input', '');
    input.placeholder = '搜索物质名 / 化学式 / 元素，如 钠、Na、Cu';
    row.appendChild(input);
    body.appendChild(row);
    var list = el('div', '');
    list.id = 'declare-list';
    body.appendChild(list);
    function fill(q) {
      list.innerHTML = '';
      q = (q || '').trim().toLowerCase();
      var n = 0;
      DB.CARD_TABLE.forEach(function (s) {
        if (filterFn && !filterFn(s)) return;
        var hay = (s.f + ' ' + s.n + ' ' + s.id + ' ' + s.el.join('')).toLowerCase();
        if (q && hay.indexOf(q) < 0) return;
        n++;
        var o = el('div', 'opt', '<b>' + esc(s.f) + '</b> <small>' + esc(s.n) + ' · ' +
          esc(DB.CAT_NAME[s.cat]) + ' · ' + esc(s.el.join('')) + ' · ' +
          esc(DB.SOL_NAME ? DB.SOL_NAME[s.sol] : '') + '</small>');
        o.onclick = function () { closeOverlay(); onPick(s.id); };
        list.appendChild(o);
      });
      if (!n) list.appendChild(el('div', 'opt', '没有符合条件的物质'));
    }
    input.oninput = function () { fill(input.value); };
    fill('');
    openOverlay(title, body);
    setTimeout(function () { input.focus(); }, 30);
  }

  /* 任意物质：先列出“能与台面反应的候选物质 + 方程式”，也可浏览全部 */
  function openWildPicker(cb) {
    var cands = G.wildCandidates(st, me);
    var body = el('div', '');
    body.appendChild(el('div', 'quote',
      st.mode === 'relay'
        ? '【任意物质】须明确所代替的物质。下面列出能与「上家所出的 ' +
          esc(st.relayCard ? DB.label(st.relayCard) : '—') + '」反应的候选物质与反应方程式：'
        : '【任意物质】须明确所代替的物质。下面列出能与实验台上现有物质反应的候选物质与反应方程式：'));
    if (!cands.length) {
      body.appendChild(el('div', 'opt', '当前台面上没有可直接反应的候选物质，可在下方切换到「浏览全部物质」。'));
    } else {
      var list = el('div', '');
      list.id = 'declare-list';
      cands.forEach(function (c) {
        var s = DB.SUB_INDEX[c.sub];
        var o = el('div', 'opt',
          '<b>' + esc(s.f) + '</b> <small>' + esc(s.n) + ' · ' + esc(DB.CAT_NAME[s.cat]) + '</small>' +
          '<div class="eq">' + esc(c.equation) + '</div>' +
          (c.benchUsed && c.benchUsed.length
            ? '<div class="eq small">与实验台上的 ' + esc(c.benchUsed.map(DB.label).join('、')) + ' 反应</div>' : ''));
        o.onclick = function () { closeOverlay(); cb(c.sub); };
        list.appendChild(o);
      });
      body.appendChild(list);
    }
    var all = el('div', 'opt', '📋 浏览全部物质（物质牌表 ' + DB.CARD_TABLE.length + ' 种）');
    all.onclick = function () { pickSubstance('选择「任意物质」所代替的物质', null, cb); };
    body.appendChild(all);
    openOverlay('选择「任意物质」所代替的物质', body);
  }

  /* 转换：三步 —— 选要转换的手牌 → 选用于转换的元素 → 选转换后的物质 */
  function openConvertPicker() {
    var p = st.players[me];
    var subs = p.hand.filter(function (c) { return c.kind === 'sub'; });
    if (!subs.length) { toast('手牌中没有可转换的物质牌'); return; }
    var body = el('div', '');
    body.appendChild(el('div', 'quote', '【转换】第一步：选择要转换的手牌中的物质牌。'));
    var list = el('div', '');
    list.id = 'declare-list';
    subs.forEach(function (c) {
      var s = DB.SUB_INDEX[c.real || c.sub] || { f: c.sub, n: '', el: [] };
      var o = el('div', 'opt', '<b>' + esc(s.f) + '</b> <small>' + esc(s.n) + ' · 含元素 ' + esc(s.el.join('、')) + '</small>');
      o.onclick = function () { convertStep2(c, s); };
      list.appendChild(o);
    });
    body.appendChild(list);
    openOverlay('【转换】第一步：选择要转换的物质', body);
  }

  function convertStep2(card, src) {
    var body = el('div', '');
    body.appendChild(el('div', 'quote', '【转换】第二步：选择用于转换的元素。' +
      '转换后的物质须含有该元素（源自 ' + esc(src.f) + '）。'));
    var list = el('div', '');
    list.id = 'declare-list';
    src.el.forEach(function (e) {
      var o = el('div', 'opt', '<b>' + esc(e) + '</b> <small>只列出含 ' + esc(e) + ' 元素的物质</small>');
      o.onclick = function () { convertStep3(card, src, e); };
      list.appendChild(o);
    });
    body.appendChild(list);
    openOverlay('【转换】第二步：选择元素', body);
  }

  function convertStep3(card, src, element) {
    var body = el('div', '');
    body.appendChild(el('div', 'quote', '【转换】第三步：把 ' + esc(src.f) + ' 转换为（含 ' + esc(element) +
      ' 元素，且不能是它自己）：'));
    var list = el('div', '');
    list.id = 'declare-list';
    var n = 0;
    DB.CARD_TABLE.forEach(function (t) {
      if (t.id === src.id) return;
      if (t.el.indexOf(element) < 0) return;
      n++;
      var shared = t.el.filter(function (x) { return src.el.indexOf(x) >= 0; });
      var o = el('div', 'opt', '<b>' + esc(t.f) + '</b> <small>' + esc(t.n) + ' · ' + esc(DB.CAT_NAME[t.cat]) +
        ' · 含 ' + esc(t.el.join('、')) + ' · 与 ' + esc(src.f) + ' 共有 ' + esc(shared.join('、') || '—') + '</small>');
      o.onclick = function () {
        closeOverlay();
        var r = doAction(function () { return G.useConvert(st, me, card.id, t.id); });
        if (r && r.ok) {
          toast('【转换】完成：' + src.f + ' 已换成 ' + t.f + ' 并放入手牌，可直接打出。');
        }
      };
      list.appendChild(o);
    });
    if (!n) list.appendChild(el('div', 'opt', '没有符合条件的物质'));
    body.appendChild(list);
    var back = el('div', 'opt', '← 返回上一步（重选元素）');
    back.onclick = function () { convertStep2(card, src); };
    body.appendChild(back);
    openOverlay('【转换】第三步：选择转换后的物质', body);
  }

  /* ---------------- 遮罩 ---------------- */
  function openOverlay(title, bodyNode) {
    $('overlay-title').textContent = title;
    var body = $('overlay-body');
    if (bodyNode) { body.innerHTML = ''; body.appendChild(bodyNode); }
    var ov = $('overlay');
    // 兜底：欢迎界面 / 设置面板 / 换人遮罩都在 #overlay 之后出现，
    // 若层级不够弹窗会被它们盖住（表现为「点不开」）。这里直接保证最高层。
    ov.style.zIndex = '9999';
    ov.classList.remove('hidden');
    // 弹窗打开时锁住背景滚动，避免滚动穿透
    if (document.body && document.body.style) document.body.style.overflow = 'hidden';
  }
  function closeOverlay() {
    var ov = $('overlay');
    ov.classList.add('hidden');
    // 回到欢迎界面 / 设置面板时恢复滚动
    if ((!$('welcome') || $('welcome').classList.contains('hidden')) &&
      (!$('setup') || $('setup').classList.contains('hidden'))) {
      if (document.body && document.body.style) document.body.style.overflow = '';
    }
  }

  /* ---------------- 规则 / 总表 ---------------- */
  function showRules() {
    var d = el('div', '');
    d.innerHTML = RULES_HTML;
    openOverlay('📖 游戏规则（依据《化学之王 游戏指南》与《规则补充》）', d);
  }

  /* 物质总表：可按名称/化学式/元素/类别筛选，并列出全部卡牌 */
  function showCardList() {
    var d = el('div', '');
    d.appendChild(el('div', 'quote',
      '物质牌表 ' + DB.CARD_TABLE.length + ' 种（可直接摸到的牌）；另有 ' +
      (DB.SUBSTANCES.length - DB.CARD_TABLE.length) + ' 种只作为反应产物出现的物质；共收录反应 ' +
      DB.REACTIONS.length + ' 条。'));
    var row = el('div', 'declare-search');
    var input = el('input', '');
    input.placeholder = '筛选：物质名 / 化学式 / 元素 / 类别，如 硫酸、SO₄、Cu、盐';
    row.appendChild(input);
    d.appendChild(row);
    var holder = el('div', '');
    d.appendChild(holder);

    function catCards(cat, arr) {
      if (!arr.length) return;
      holder.appendChild(el('h3', '', DB.CAT_NAME[cat] + ' ' + (DB.CAT_EN[cat] || '')));
      var g = el('div', 'card-grid');
      arr.forEach(function (s) { g.appendChild(subCardNode(s.id)); });
      holder.appendChild(g);
    }

    function fill(q) {
      holder.innerHTML = '';
      q = (q || '').trim().toLowerCase();
      var groups = { Ad: [], Be: [], St: [], Oe: [], Es: [], Ot: [] };
      var direct = [];
      DB.SUBSTANCES.forEach(function (s) {
        if (DB.CARD_SUB_IDS && DB.CARD_SUB_IDS[s.id] && !groups[s.cat]) return;
        var hay = (s.f + ' ' + s.n + ' ' + s.id + ' ' + (s.el || []).join('') + ' ' +
          (DB.CAT_NAME[s.cat] || '')).toLowerCase();
        if (q && hay.indexOf(q) < 0) return;
        if (s.cat === 'Ad' || s.cat === 'Be' || s.cat === 'Oe') { /* 下面统一处理 */ }
        if (!groups[s.cat]) { direct.push(s); return; }
        groups[s.cat].push(s);
      });
      ['Ad', 'Be', 'St', 'Oe', 'Es', 'Ot'].forEach(function (c) { catCards(c, groups[c]); });
      if (direct.length) {
        holder.appendChild(el('h3', '', '其他物质'));
        var g2 = el('div', 'card-grid');
        direct.forEach(function (s) { g2.appendChild(subCardNode(s.id)); });
        holder.appendChild(g2);
      }
      if (!q || '特殊牌 special'.indexOf(q) >= 0 || '特殊'.indexOf(q) >= 0) {
        holder.appendChild(el('h3', '', '特殊牌（' + DB.SPECIALS.length + ' 种 / 5 张）'));
        var g1 = el('div', 'card-grid');
        DB.SPECIALS.forEach(function (sp) {
          for (var i = 0; i < sp.count; i++) {
            g1.appendChild(cardNode({ id: 'l' + sp.id + i, kind: 'special', sp: sp.id }));
          }
        });
        holder.appendChild(g1);
        holder.appendChild(el('h3', '', '人物 DLC（5 张）'));
        var g3 = el('div', 'card-grid');
        DB.PEOPLE.forEach(function (p) { g3.appendChild(cardNode({ id: 'lp' + p.id, kind: 'people', ref: p.id })); });
        holder.appendChild(g3);
        holder.appendChild(el('h3', '', '操作 DLC（5 张）'));
        var g4 = el('div', 'card-grid');
        DB.OPS.forEach(function (o) { g4.appendChild(cardNode({ id: 'lo' + o.id, kind: 'op', ref: o.id })); });
        holder.appendChild(g4);
      }
      var t = el('div', '');
      var counts = {};
      DB.CARD_TABLE.forEach(function (s) { counts[s.cat] = (counts[s.cat] || 0) + (DB.COUNTS[s.id] || 1); });
      t.innerHTML = Object.keys(counts).map(function (k) {
        return '<span class="mini-card">' + DB.CAT_NAME[k] + ' ' + counts[k] + ' 张</span>';
      }).join(' ') + '<span class="mini-card">基础物质牌 80 张</span>' +
        '<span class="mini-card">物质 DLC 10 张</span><span class="mini-card">特殊牌 5 张</span>' +
        '<span class="mini-card">人物 DLC 5 张</span><span class="mini-card">操作 DLC 5 张</span>';
      t.style.display = 'flex'; t.style.gap = '6px'; t.style.flexWrap = 'wrap';
      holder.appendChild(el('h3', '', '物质牌张数'));
      holder.appendChild(t);
    }
    input.oninput = function () { fill(input.value); };
    fill('');
    openOverlay('🧪 物质总表与全部卡牌', d);
    setTimeout(function () { input.focus(); }, 30);
  }

  function showWaste() {
    var d = el('div', '');
    d.appendChild(el('div', 'quote', '废液缸中的药品原则上严禁使用（特殊牌【回收】除外）。点击「回收」时会从中随机抽取一张物质牌。'));
    var grid = el('div', 'card-grid');
    var subs = st.waste.filter(function (w) { return DB.SUB_INDEX[w.id]; });
    if (!subs.length) d.appendChild(el('div', 'opt', '废液缸是空的（或只剩特殊牌）'));
    subs.forEach(function (w, i) { grid.appendChild(subCardNode(w.id)); });
    d.appendChild(grid);
    var others = st.waste.filter(function (w) { return !DB.SUB_INDEX[w.id]; });
    if (others.length) {
      d.appendChild(el('h3', '', '其中非物质牌'));
      var g2 = el('div', 'card-grid');
      others.forEach(function (w) {
        g2.appendChild(el('span', 'mini-card cat-X', esc(w.id)));
      });
      d.appendChild(g2);
    }
    openOverlay('🗑 废液缸（共 ' + st.waste.length + ' 条记录，其中物质牌 ' + subs.length + ' 张）', d);
  }

  function renderRxLookup() {
    var q = ($('rx-input').value || '').trim();
    var res = $('rx-result');
    res.innerHTML = '';
    if (!q) {
      res.appendChild(el('div', 'nm', '输入物质名或化学式，查看它能参与的反应。'));
      return;
    }
    var ids = DB.SUBSTANCES.filter(function (s) {
      return (s.f + s.n + s.id).toLowerCase().indexOf(q.toLowerCase()) >= 0;
    }).map(function (s) { return s.id; });
    if (!ids.length) { res.appendChild(el('div', 'nm', '没有找到该物质。')); return; }
    var hits = DB.REACTIONS.filter(function (rx) {
      return rx.r.some(function (x) { return ids.indexOf(x) >= 0; }) ||
        rx.p.some(function (x) { return ids.indexOf(x) >= 0; });
    });
    res.appendChild(el('div', 'nm', '匹配 ' + ids.map(DB.label).join('、') + '，共 ' + hits.length + ' 个反应'));
    hits.slice(0, 60).forEach(function (rx) {
      var line = el('div', 'rx', '<b>' + esc(DB.equationPlain(rx)) + '</b>' +
        (rx.c ? ' <span class="nm">[' + esc(rx.c) + ']</span>' : '') +
        '<div class="nm">' + esc(rx.nm) + ' · ' + esc(rx.t) + '</div>');
      res.appendChild(line);
    });
  }

  /* ---------------- 换人遮罩（同设备轮流） ---------------- */
  var handoffKey = null;   // 已展示换人遮罩的局面标识，避免重复弹出
  var awaitingHandoff = false;  // 正在等待某位真人点击「我准备好了」
  var skipNextHandoff = false;  // 开局第一位真人无需遮挡（此前没有需要隐藏的手牌）

  /* 当前局面的标识：同一局面只弹一次换人遮罩 */
  function handoffKeyOf() {
    var seat = activeSeat();
    return seat + ':' + st.round + ':' + st.phase + ':' + st.turn + ':' +
      (st.demand ? st.demand.pending.length : 0);
  }

  function showHandoff() {
    var seat = activeSeat();
    var p = st.players[seat];
    busy = true;
    awaitingHandoff = true;
    sel = [];
    syncSeat();
    render();                       // 先按当前座位重画（此时手牌处于遮盖状态）
    $('handoff-title').textContent = '轮到 ' + p.name + (p.skip > 0 ? '（停牌 ' + p.skip + ' 回合）' : '');
    $('handoff-sub').textContent = st.phase === 'respond'
      ? '实验台上有指示需要你响应：请先看牌，再决定出牌或接受惩罚。'
      : '请将设备交给 ' + p.name + '；点击按钮后才会显示他的手牌。';
    var info = $('handoff-info');
    info.innerHTML = '';
    if (st.phase === 'respond' && st.demand) {
      info.appendChild(el('div', 'ho-line', '🧪 指示【' + esc(st.demand.name) + '】：' + esc(st.demand.needDesc) +
        '（不出牌则停 ' + st.demand.stop + ' 回合）'));
    }
    var act = activeSubs();
    info.appendChild(el('div', 'ho-line', act.length
      ? '实验台可反应物质：' + act.map(function (x) { return DB.label(x.id); }).join('、')
      : '实验台为空：出一张牌开启新一轮（这张牌不参与反应，等你的下家去反应）'));
    info.appendChild(el('div', 'ho-line', '第 ' + st.round + ' 回合　｜　药品柜剩余 ' + st.deck.length +
      ' 张　｜　废液缸 ' + st.waste.length + ' 条'));
    $('handoff').classList.remove('hidden');
  }

  function hideHandoff() {
    // 注意：保留 handoffKey，避免同一局面被反复弹出换人遮罩
    awaitingHandoff = false;
    $('handoff').classList.add('hidden');
    busy = false;
    render();
  }

  /* ---------------- 电脑行动调度 ---------------- */
  function scheduleBot() {
    if (!st || st.finished) return;
    if (busy) return;
    syncSeat();
    var seat = activeSeat();
    var p = st.players[seat];
    if (!p || !p.bot) {
      // 轮到真人：热座模式下先弹出换人遮罩（同一局面只弹一次）
      if (hotseat && st.phase !== 'draw') {
        var key = handoffKeyOf();
        if (handoffKey !== key) {
          handoffKey = key;
          if (skipNextHandoff) {
            // 开局第一位真人不需要遮挡（此前没有需要隐藏的牌）
            skipNextHandoff = false;
            render();
            return;
          }
          showHandoff();
          return;
        }
      }
      render();
      return;
    }
    var act = G.botAct(st);
    if (!act) { render(); return; }
    busy = true;
    var delay = act.type === 'draw' ? 0 : Math.round((cfg.botSpeed || 0) * 1000 * (st.phase === 'respond' ? 0.72 : 1));
    botTimer = setTimeout(function () {
      botTimer = null;
      busy = false;
      if (!st || st.finished) { render(); return; }
      var a = G.botAct(st);
      if (!a) { render(); return; }
      var inResp = (st.phase === 'respond');
      var pi = (a.type === 'respond' || a.type === 'penalty' || (a.type === 'cancel' && inResp))
        ? st.responder : st.turn;
      var r = { ok: true };
      if (a.type === 'draw') { G.drawAll(st); }
      else if (a.type === 'play') r = G.playCards(st, pi, a.cards);
      else if (a.type === 'pass') r = G.passTurn(st, pi);
      else if (a.type === 'recycle') r = G.useRecycle(st, pi);
      else if (a.type === 'convert') r = G.useConvert(st, pi, a.cardId, a.target);
      else if (a.type === 'cancel') r = G.useCancel(st, pi);
      /* 人物 / 操作 DLC：以前这里漏了这一支，电脑想打 DLC 时没有任何效果，
       * 于是每次都返回同一个动作、界面看起来就是「卡死」。 */
      else if (a.type === 'dlc') r = G.playDLC(st, pi, a.cardId);
      else if (a.type === 'respond') {
        if (a.wild) G.setWild(st, st.responder, a.cardId, a.wild);
        r = G.respondSubstance(st, st.responder, a.cardId);
      } else if (a.type === 'penalty') r = G.acceptPenalty(st, st.responder);
      if (r && !r.ok) {
        /* 动作被拒绝时必须上报，并且不能再把同一个动作重复排队（会死循环） */
        G.logMsg(st, '⚠ 电脑动作被拒绝：' + r.reason, 'warn');
        botSkip = (botSkip || 0) + 1;
        if (botSkip > 8) {
          botSkip = 0;
          render();
          if (st.phase === 'main' && st.players[st.turn] && st.players[st.turn].bot) {
            G.passTurn(st, st.turn);           // 兜底：强制过手，避免整局卡住
            render();
          }
          scheduleBot();
          return;
        }
      } else {
        botSkip = 0;
      }
      if (st.phase === 'draw') G.drawAll(st);
      render();
      scheduleBot();
    }, delay);
  }

  /* ---------------- 记牌器 / 昵称 ---------------- */
  function applyCounter() {
    var b = $('bottom');
    if (b) b.classList.toggle('counter-off', !cfg.counter);
  }

  function buildNameInputs() {
    var box = $('set-names');
    if (!box) return;
    box.innerHTML = '';
    for (var i = 0; i < 5; i++) {
      var row = el('div', 'name-row');
      row.appendChild(el('span', '', '科学家 ' + String.fromCharCode(65 + i)));
      var inp = el('input', '');
      inp.placeholder = '默认：科学家 ' + String.fromCharCode(65 + i);
      inp.value = (cfg.names && cfg.names[i]) || '';
      (function (idx, input) {
        input.oninput = function () {
          cfg.names = cfg.names || [];
          cfg.names[idx] = input.value;
        };
      })(i, inp);
      row.appendChild(inp);
      box.appendChild(row);
    }
  }

  /* ---------------- 新开一局 ---------------- */
  function startGame() {
    var n = cfg.players;
    var players = [];
    hotseat = cfg.bots === 'human';
    var spectate = cfg.bots === 'all';       // 全部电脑 → 观战模式
    humanSeats = [];
    for (var i = 0; i < n; i++) {
      var isHuman = hotseat || (!spectate && i === 0);
      if (isHuman) humanSeats.push(i);
      var custom = (cfg.names && cfg.names[i] || '').trim();
      players.push({
        id: i,
        name: (isHuman ? '🧑‍🔬 ' : '🤖 ') + (custom || ('科学家 ' + String.fromCharCode(65 + i))),
        bot: !isHuman
      });
    }
    st = G.startGame({
      players: players, mode: cfg.mode, seed: (Date.now() % 100000),
      dlcSubstance: cfg.dlcSubstance, people: cfg.people, ops: cfg.ops, special: cfg.special
    });
    me = spectate ? -1 : 0;
    sel = [];
    benchTarget = null;
    curOptions = [];
    prevSnapshot = null; nodeSnapshot = null;
    botSkip = 0;
    if (botTimer) { clearTimeout(botTimer); botTimer = null; }
    handoffKey = null;
    awaitingHandoff = false;
    busy = false;
    lastLogLen = 0;
    $('log').innerHTML = '';
    $('handoff').classList.add('hidden');
    $('setup').classList.add('hidden');
    while (st.phase === 'draw') G.drawAll(st);   // 依次抽牌，抽完为止
    if (hotseat) {
      // 开局第一位真人直接看牌（此前没有需要隐藏的手牌），从第二位开始才弹换人遮罩
      skipNextHandoff = true;
    }
    applyCounter();
    render();
    scheduleBot();
  }

  /* ---------------- 事件绑定 ---------------- */
  function bind() {
    document.querySelectorAll('#set-players button').forEach(function (b) {
      b.onclick = function () {
        cfg.players = +b.dataset.v;
        document.querySelectorAll('#set-players button').forEach(function (x) { x.classList.remove('on'); });
        b.classList.add('on');
      };
    });
    var modeTip = {
      chain: '出牌须能与上位反应的生成物之一反应，可一次出多张牌组成全部反应物（接龙实验 ★★★★★）。',
      relay: '每次只能出一张牌，且必须能与上一位科学家所出的牌反应（接力实验 ★★★★）。',
      element: '所出物质牌须与上一张牌有一种或多种相同元素，禁用人物 DLC、操作 DLC（元素接力 ★★）。'
    };
    document.querySelectorAll('#set-mode button').forEach(function (b) {
      b.onclick = function () {
        cfg.mode = b.dataset.v;
        document.querySelectorAll('#set-mode button').forEach(function (x) { x.classList.remove('on'); });
        b.classList.add('on');
        $('mode-tip').textContent = modeTip[cfg.mode];
      };
    });
    document.querySelectorAll('#set-bots button').forEach(function (b) {
      b.onclick = function () {
        cfg.bots = b.dataset.v;
        document.querySelectorAll('#set-bots button').forEach(function (x) { x.classList.remove('on'); });
        b.classList.add('on');
        var tip = {
          all: '观战模式：所有座位均由电脑控制。',
          one: '你（科学家 A）与电脑对战。',
          human: '全部真人：同一台设备依次传牌，轮到谁就点一次「我准备好了，显示手牌」，出完牌点「结束出牌轮」。'
        };
        $('bots-tip').textContent = tip[cfg.bots] || '';
      };
    });
    var speed = $('set-botspeed');
    if (speed) {
      var upd = function () {
        cfg.botSpeed = parseFloat(speed.value) || 0;
        $('bot-speed-val').textContent = cfg.botSpeed === 0 ? '立即出牌' : cfg.botSpeed.toFixed(1) + ' 秒';
      };
      speed.oninput = upd;
      upd();
    }
    document.querySelectorAll('#set-open button').forEach(function (b) {
      b.onclick = function () {
        cfg.open = b.dataset.v === '1';
        document.querySelectorAll('#set-open button').forEach(function (x) { x.classList.remove('on'); });
        b.classList.add('on');
        if (st) render();
      };
    });
    ['set-dlcsub', 'set-people', 'set-ops', 'set-special'].forEach(function (id) {
      $(id).onchange = function () {
        cfg[{ 'set-dlcsub': 'dlcSubstance', 'set-people': 'people', 'set-ops': 'ops', 'set-special': 'special' }[id]] = $(id).checked;
      };
    });

    /* 记牌器设置 */
    document.querySelectorAll('#set-counter button').forEach(function (b) {
      b.onclick = function () {
        cfg.counter = b.dataset.v === '1';
        document.querySelectorAll('#set-counter button').forEach(function (x) { x.classList.remove('on'); });
        b.classList.add('on');
        var opts = $('counter-opts');
        if (opts) opts.classList.toggle('disabled', !cfg.counter);
        applyCounter();
      };
    });
    if ($('set-counter-color')) {
      $('set-counter-color').onchange = function () {
        cfg.counterColor = $('set-counter-color').checked;
        if (st) renderBottom();
      };
    }
    document.querySelectorAll('#set-counter-mode button').forEach(function (b) {
      b.onclick = function () {
        cfg.counterMode = b.dataset.v;
        document.querySelectorAll('#set-counter-mode button').forEach(function (x) { x.classList.remove('on'); });
        b.classList.add('on');
        if (st) renderBottom();
      };
    });
    buildNameInputs();

    $('btn-start').onclick = startGame;

    $('btn-play').onclick = playSelected;
    $('btn-undo').onclick = undo;
    $('btn-clear').onclick = function () { sel = []; benchTarget = null; render(); };
    $('btn-pass').onclick = function () {
      if (!st || st.finished) return;
      if (st.phase === 'respond') return;                       // 响应阶段用指示条上的按钮
      if (st.phase !== 'main' || st.turn !== me) return;
      if (!$('handoff').classList.contains('hidden')) return;   // 还没确认换人
      doAction(function () { return G.passTurn(st, me); });
    };
    $('btn-rules').onclick = showRules;
    $('btn-cardlist').onclick = showCardList;
    $('btn-waste').onclick = showWaste;
    $('btn-newgame').onclick = function () {
      if (st) { st = null; }
      $('welcome').classList.remove('hidden');
      $('setup').classList.add('hidden');
      showWelcome();
    };
    $('welcome-start').onclick = function () {
      $('welcome').classList.add('hidden');
      $('setup').classList.remove('hidden');
      buildNameInputs();
    };
    $('welcome-rules').onclick = function () { showRules(); };
    $('welcome-credits').onclick = function () { showCredits(); };
    $('setup-back').onclick = function () {
      $('setup').classList.add('hidden');
      $('welcome').classList.remove('hidden');
    };
    // 欢迎界面初始可见，确保按钮状态一致
    showWelcome();
    $('overlay-close').onclick = closeOverlay;
    $('overlay').onclick = function (e) { if (e.target === $('overlay')) closeOverlay(); };
    $('handoff-ok').onclick = function () {
        hideHandoff();
      scheduleBot();
    };
    $('btn-rx').onclick = renderRxLookup;
    $('rx-input').oninput = renderRxLookup;
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeOverlay();
      if (e.key === 'Enter' && st && !st.finished) {
        if ($('overlay').classList.contains('hidden')) playSelected();
      }
    });
  }

  window.addEventListener('DOMContentLoaded', function () {
    bind();
    renderRxLookup();
  });

  /* ---------------- 规则文本 ---------------- */
  var RULES_HTML = [
    '<div class="quote">本页内容整理自《化学之王 游戏指南》（第 2~6 部分、附录）与《规则补充》，仅作游玩参考。</div>',
    '<h3>一、基本定义</h3>',
    '<ul>',
    '<li><span class="k">科学家</span>：指在场的玩家。</li>',
    '<li><span class="k">实验</span>：进行游戏。</li>',
    '<li><span class="k">药品柜</span>：物质牌储存处，其中药品允许使用。</li>',
    '<li><span class="k">废液缸</span>：反应废液倾倒处，其中药品严禁使用（特殊牌【回收】除外）。</li>',
    '<li><span class="k">实验台</span>：反应进行处。</li>',
    '<li><span class="k">反应</span>：两张或多张物质牌转化为新物质的过程。</li>',
    '</ul>',

    '<h3>二、玩法：接龙实验（★★★★★，本程序默认）</h3>',
    '<ul>',
    '<li>各位科学家按出牌顺序依次抽物质牌，抽完为止（每次一人一张）。</li>',
    '<li>由初始牌最多的科学家先出牌（多人并列则随机其一），按顺时针方向进行。</li>',
    '<li><b>开局起牌</b>：实验台上没有可反应物质时，本回合第一位科学家<b>只出一张牌铺垫，这一张不参与任何反应</b>' +
    '（即使它本身可以自发分解）；由下一位科学家决定出牌与它反应、还是 Pass，Pass 掉它即倒入废液缸并开启新一轮。' +
    '因此一轮真正的反应至少要经过两位科学家。</li>',
    '<li>下一位可以 Pass，也可以出牌：所出物质牌须能与上一张牌（或上位反应的生成物之一）发生化学反应，并且可一次出多张牌组成一个反应的全部反应物。<b>出牌时不考虑化学计量数。</b></li>',
    '<li>反应时，出牌科学家必须说出反应的反应物、生成物、反应条件，否则不予反应（本程序自动判定并显示反应式）。</li>',
    '<li>当反应进行一回合时，将实验台上的废液（无效物质）倒入废液缸。</li>',
    '<li><b>Pass</b>：<b>只有在场科学家全部 Pass 之后</b>，实验台上的药品才倒入废液缸并开启新一轮；'
      + '只要还有人没有 Pass，台上的物质就仍然有效，后面的人仍可出牌与它反应（一旦有人出牌，Pass 计数清零）。</li>',
    '<li>实验台上多个生成物时，下家可以任选一个反应。</li>',
    '</ul>',

    '<h3>三、玩法：接力实验（★★★★）</h3>',
    '<ul>',
    '<li>与接龙实验相同，但<b>每次只能出一张牌</b>。</li>',
    '<li><b>判定对象是「上家所出的那张牌」，而不是上位反应的生成物</b>：你出的牌必须能与上家刚出的那张牌发生反应。'
      + '（实验台上的生成物仍会显示，但本玩法不作为接力目标。）</li>',
    '<li>不能把上家刚出的那张牌原样再出一遍充数，必须换一张能与它反应的牌。</li>',
    '<li>本程序会把当前接力目标显示在实验台上方：「🎯 接力目标：必须与上家所出的 X 反应」。</li>',
    '</ul>',

    '<h3>四、玩法：元素接力（★★）</h3>',
    '<ul><li>所出的物质牌须与上一张牌有一种或多种相同元素；<b>该玩法禁用人物 DLC、操作 DLC。</b></li></ul>',

    '<h3>五、胜利判定</h3>',
    '<ul>',
    '<li>若科学家的所有手牌均出完，则该科学家胜利；之后成为旁观者，保持安静，不得进行一切战术交流。</li>',
    '<li>剩余科学家继续实验。当仅剩一位科学家在场时，该科学家出局，可进行惩罚。</li>',
    '</ul>',

    '<h3>六、特殊牌（共 5 张，规则补充）</h3>',
    '<ul>',
    '<li><span class="k">任意物质 ×2</span>：可代替任意一种在现实中存在的物质。<b>使用时须明确所代替的物质名称，否则不予反应</b>；所代替的物质须为物质牌表中的物质。</li>',
    '<li><span class="k">抵消 ×1</span>：抵消一次行动，即有科学家出人物或操作 DLC 的牌时，出此牌即视为完成相应要求。若人物和操作 DLC 均未启用，则此牌可抵消本轮反应，开启新一轮（由出该牌的科学家出牌）。</li>',
    '<li><span class="k">转换 ×1</span>：将一种物质牌转换为至少含有一种相同元素的另一种物质。</li>',
    '<li><span class="k">回收 ×1</span>：在废液缸中随机抽取一张物质牌放入自己的牌组中。</li>',
    '</ul>',
    '<div class="quote">特殊牌在任意出牌轮均可发动技能，且<b>不计入出牌次数</b>。</div>',

    '<h3>七、人物 DLC（5 位化学家，规则补充）</h3>',
    '<ul>',
    '<li><span class="k">J. J. Priestley</span>：在场所有科学家打出一张氧气或氧化物的物质牌，若不出牌，则停 2 回合。</li>',
    '<li><span class="k">R. Boyle</span>：在场所有科学家打出一张盐的物质牌，若不出牌，则停 2 回合。</li>',
    '<li><span class="k">G. N. Lewis</span>：在场所有科学家打出一张酸或碱的物质牌，若不出牌，则停 2 回合。</li>',
    '<li><span class="k">侯德榜</span>：在场所有科学家打出一张氨碱法制碱反应（NH₃ + CO₂ + NaCl + H₂O = NaHCO₃ + NH₄Cl）中 6 种物质之一的物质牌（NH₃·H₂O 也算），若不出牌，则停 1 回合。</li>',
    '<li><span class="k">徐寿</span>：在场所有科学家打出一张单质的物质牌，若不出牌，则停 2 回合。</li>',
    '</ul>',
    '<div class="quote">打出该牌的科学家无需再次出牌；其他科学家均需出牌或接受停牌惩罚。全部科学家行动完后，由打出该牌的下一位科学家开启新回合。</div>',

    '<h3>八、操作 DLC（5 种操作，规则补充）</h3>',
    '<ul>',
    '<li><span class="k">过滤</span>：打出一张微溶或难溶的物质牌，否则停 1 回合。</li>',
    '<li><span class="k">蒸馏</span>：打出一张液体的物质牌，否则停 1 回合。</li>',
    '<li><span class="k">溶解</span>：打出一张可溶的物质牌，否则停 2 回合。</li>',
    '<li><span class="k">集气</span>：打出一张气体的物质牌，否则停 1 回合。</li>',
    '<li><span class="k">蒸发</span>：打出一张可蒸发结晶的可溶物质牌（<b>不包括</b>受热分解的 NaHCO₃、NH₃·H₂O、NH₄NO₃、Cu(NO₃)₂ 和受热易氧化的 FeSO₄），否则停 2 回合。</li>',
    '</ul>',

    '<h3>九、易混淆事项（规则补充原文）</h3>',
    '<ul>',
    '<li><b>每人初始抽几张牌？</b> 一人一张，依次抽牌，抽完为止。</li>',
    '<li><b>出牌顺序怎么定？</b> 若有一名牌最多的科学家，则由他先出，按顺时针方向出牌；若有多个科学家均有最多牌，则在其中随机选一人先出；若所有科学家牌数目均相同，则随机选一人先出。</li>',
    '<li><b>“Pass 掉一回合，则该物质无效”具体指哪张物质？</b> 指被 Pass 的这个物质（即当时实验台上要求你去反应的那张/那些物质）；'
      + '本程序按「在场科学家全部 Pass 后」才把台上的药品倒入废液缸处理。</li>',    '<li><b>实验台上多个生成物时，下家可以任选一个吗？</b> 可以。</li>',
    '<li><b>特殊牌“任意物质”代替的物质，如果数据库里没有怎么办？</b> 任意物质代替的物质须为物质牌表中的物质。</li>',
    '<li><b>人物和操作 DLC 打出后“无需再次出牌”具体如何影响回合？</b> 打出该牌的科学家无需按牌面指示出相应的牌，其他科学家均需出牌或接受暂停回合惩罚。全部科学家均行动完后，由打出该牌的下一位科学家开启新回合。</li>',
    '<li><b>胜利后其他人继续，直到只剩一人出局吗？</b> 是的。</li>',
    '</ul>',

    '<h3>十、其他事项</h3>',
    '<ul>',
    '<li>反应范围：初高中常见化学反应及“烧杯”APP 中的化学反应（不包括试卷、课外习题等的反应）。</li>',
    '<li>不能确定能否反应的，以附录-溶解性表及“烧杯”APP 为准。</li>',
    '<li>实验中若有任何问题，请询问管理员。SLH.Pictures.Inc. 保留最终解释权。</li>',
    '</ul>',
    '<h3>十一、图例说明（物质牌）</h3>',
    '<ul>',
    '<li>✔ 可溶　… 微溶　✘ 不溶、难溶　— 可与水反应或本身是水</li>',
    '<li>腐：腐蚀性　↑：挥发性　▲：常温下自发分解　固/液/气：物质状态（20℃、1atm）</li>',
    '<li>Ad 酸　Be 碱　St 盐　Oe 氧化物　Es 单质　DLC 标记表示该物质来自扩展包</li>',
    '</ul>'
  ].join('');
})();











