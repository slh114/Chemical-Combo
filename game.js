/* ============================================================
 * 化学之王 Chemical Combo —— 规则引擎
 * 依赖 data.js (ChemDB)
 * 规则依据：《游戏指南》第6部分 + 《规则补充》
 * ============================================================ */
(function (global) {
  'use strict';
  var DB = global.ChemDB;
  var RNG_SEED = 0x2f6e2b1;

  /* ---------------- 工具 ---------------- */
  function mulberry32(a) {
    return function () {
      a |= 0; a = a + 0x6D2B79F5 | 0;
      var t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }

  function union(a, b) {
    var out = a.slice();
    b.forEach(function (x) { if (out.indexOf(x) < 0) out.push(x); });
    return out;
  }

  function cloneCards(cards) { return cards.map(function (c) { return Object.assign({}, c); }); }

  /* ---------------- 牌堆构建 ---------------- */
  // opt: {dlcSubstance:bool, special:bool, people:bool, ops:bool}
  function buildDeck(opt) {
    var deck = [], i, s;
    var counts = DB.COUNTS;
    for (i = 0; i < DB.CARD_TABLE.length; i++) {
      s = DB.CARD_TABLE[i];
      var isDlc = DB.DLC_SUBSTANCE.indexOf(s.id) >= 0;
      if (isDlc && !opt.dlcSubstance) continue;
      var n = counts[s.id] || 1;
      for (var k = 0; k < n; k++) {
        deck.push({ id: 'S:' + s.id + ':' + k, kind: 'sub', sub: s.id, real: null, dlc: isDlc });
      }
    }
    if (opt.special) {
      DB.SPECIALS.forEach(function (sp) {
        for (var k = 0; k < sp.count; k++) {
          /* 「任意物质」是一张“物质牌”（可以指定代替任何一种物质牌），
           * 必须用 kind:'sub' + sub:'WILD' 表示；其余特殊牌才是 kind:'special'。 */
          if (sp.id === 'WILD') {
            deck.push({ id: 'X:' + sp.id + ':' + k, kind: 'sub', sub: 'WILD', real: null, wild: true });
          } else {
            deck.push({ id: 'X:' + sp.id + ':' + k, kind: 'special', sp: sp.id });
          }
        }
      });
    }
    if (opt.people) {
      DB.PEOPLE.forEach(function (p) {
        for (var k = 0; k < p.count; k++) deck.push({ id: 'P:' + p.id + ':' + k, kind: 'people', ref: p.id });
      });
    }
    if (opt.ops) {
      DB.OPS.forEach(function (o) {
        for (var k = 0; k < o.count; k++) deck.push({ id: 'O:' + o.id + ':' + k, kind: 'op', ref: o.id });
      });
    }
    return deck;
  }

  function shuffled(deck, rnd) {
    for (var i = deck.length - 1; i > 0; i--) {
      var j = Math.floor(rnd() * (i + 1));
      var t = deck[i]; deck[i] = deck[j]; deck[j] = t;
    }
    return deck;
  }

  function cardById(state, id) {
    for (var i = 0; i < state.players.length; i++) {
      var p = state.players[i];
      if (!p) continue;
      for (var k = 0; k < p.hand.length; k++) if (p.hand[k].id === id) return { p: p, c: p.hand[k], i: k };
    }
    return null;
  }

  /* 只在指定玩家自己的手牌中查找（出牌 / 响应指示必须使用本人手牌） */
  function cardInHand(state, pi, id) {
    var p = state.players[pi];
    if (!p) return null;
    for (var k = 0; k < p.hand.length; k++) if (p.hand[k].id === id) return { p: p, c: p.hand[k], i: k };
    return null;
  }

  function ref(card) { return card.ref || card.sp || card.sub; }

  function cardLabel(card) {
    if (card.kind === 'sub') return DB.label(card.sub);
    if (card.kind === 'special') return specialById(card.sp).name;
    if (card.kind === 'people') return peopleById(card.ref).name;
    if (card.kind === 'op') return opById(card.ref).name;
    return '?';
  }

  function specialById(id) { return DB.SPECIALS.filter(function (x) { return x.id === id; })[0]; }
  function peopleById(id) { return DB.PEOPLE.filter(function (x) { return x.id === id; })[0]; }
  function opById(id) { return DB.OPS.filter(function (x) { return x.id === id; })[0]; }
  function subById(id) { return DB.SUB_INDEX[id]; }
  function subLabel(id) { return DB.label(id); }

  /* ---------------- 手牌排序 ----------------
   * 按「牌的种类 + 在相应表中的次序」排列：
   *   特殊牌 → 人物 DLC → 操作 DLC → 物质牌（按物质牌表：酸→碱→盐→氧化物→单质，表内次序）
   * 同一物质的多张牌排在一起；“任意物质”排在物质牌最前。 */
  var SUB_ORDER = {};
  DB.CARD_TABLE.forEach(function (s, i) { SUB_ORDER[s.id] = i; });

  function cardOrderKey(card) {
    if (card.kind === 'special') {
      var sp = DB.SPECIALS.map(function (x) { return x.id; }).indexOf(card.sp);
      return { g: 0, s: sp < 0 ? 99 : sp, k: 0 };
    }
    if (card.kind === 'people') {
      var pi = DB.PEOPLE.map(function (x) { return x.id; }).indexOf(card.ref);
      return { g: 1, s: pi < 0 ? 99 : pi, k: 0 };
    }
    if (card.kind === 'op') {
      var oi = DB.OPS.map(function (x) { return x.id; }).indexOf(card.ref);
      return { g: 2, s: oi < 0 ? 99 : oi, k: 0 };
    }
    if (card.sub === 'WILD') return { g: 3, s: -1, k: 0 };   // 任意物质排物质牌最前
    var idx = SUB_ORDER[card.sub];
    return { g: 3, s: idx == null ? 999 : idx, k: 0 };
  }

  function sortHand(cards) {
    return cards
      .map(function (c, i) { return { c: c, i: i, key: cardOrderKey(c) }; })
      .sort(function (a, b) {
        if (a.key.g !== b.key.g) return a.key.g - b.key.g;
        if (a.key.s !== b.key.s) return a.key.s - b.key.s;
        if (a.key.k !== b.key.k) return a.key.k - b.key.k;
        return a.i - b.i;                       // 同种牌保持稳定次序
      })
      .map(function (x) { return x.c; });
  }

  /* ---------------- 初始化 ---------------- */
  function startGame(cfg) {
    var players = cfg.players.map(function (p) {
      return {
        id: p.id, name: p.name, bot: !!p.bot, hand: [], skip: 0,
        active: true, won: false, out: false, done: 0, used: 0, color: p.color || null
      };
    });
    var rnd = mulberry32(cfg.seed == null ? RNG_SEED : cfg.seed);
    var deck = shuffled(buildDeck({
      dlcSubstance: !!cfg.dlcSubstance,
      special: cfg.special !== false,
      people: !!cfg.people,
      ops: !!cfg.ops
    }), rnd);

    var st = {
      cfg: cfg,
      mode: cfg.mode || 'chain',
      rnd: rnd,
      players: players,
      deck: deck,
      waste: [],
      bench: [],
      turn: 0,
      round: 1,
      roundStarter: 0,
      phase: 'draw',
      reaction: null,
      demand: null,
      passed: {},
      relayCard: null,
      relayOwner: null,
      log: [],
      events: [],
      winnerOrder: [],
      finished: false,
      lastReaction: null
    };
    logMsg(st, '实验开始：' + players.length + ' 位科学家就位，牌堆共 ' + deck.length + ' 张物质牌（含特殊牌/DLC）。');
    logMsg(st, '玩法：' + MODE_NAME(st.mode));
    st.phase = 'draw';
    return st;
  }

  var MODE_NAME = function (m) {
    return { chain: '接龙实验', relay: '接力实验', element: '元素接力' }[m] || m;
  };

  function logMsg(st, text, cls) {
    st.log.push({ t: st.log.length, text: text, cls: cls || '' });
    if (st.log.length > 400) st.log.shift();
  }

  function ev(st, type, data) {
    st.events.push(Object.assign({ type: type }, data || {}));
  }

  /* ---------------- 抽牌阶段 ---------------- */
  function drawAll(st) {
    var n = st.players.length;
    if (st.phase !== 'draw') return false;
    var before = st.players.map(function (p) { return p.hand.length; });
    for (var i = 0; i < n; i++) {
      var p = st.players[(st.turn + i) % n];
      if (st.deck.length) { p.hand.push(st.deck.pop()); p.done++; }
    }
    var after = st.players.map(function (p) { return p.hand.length; });
    ev(st, 'draw', { deltas: after.map(function (v, i) { return v - before[i]; }) });
    if (st.deck.length === 0) {
      finishDraw(st);
      return true;
    }
    return true;
  }

  function finishDraw(st) {
    var best = [], max = -1;
    st.players.forEach(function (p) {
      if (p.hand.length > max) { max = p.hand.length; best = [p]; }
      else if (p.hand.length === max) best.push(p);
    });
    var starter = best[Math.floor(st.rnd() * best.length)];
    st.roundStarter = starter.id;
    st.turn = starter.id;
    st.phase = 'main';
    var note = best.length === 1 ? '（牌最多，独享先手）' : '（多人牌数相同，随机选中）';
    logMsg(st, '抽牌结束，共 ' + st.players.length + ' 位科学家。由 ' + starter.name + ' 先出牌' + note + '，按顺时针方向进行。', 'hl');
    ev(st, 'turn', { player: starter.id });
  }

  function autoDraw(st) {
    if (st.phase !== 'draw') return false;
    drawAll(st);
    return true;
  }

  /* ---------------- 实验台 ---------------- */
  function cardCount(st, subId) {
    var n = 0;
    st.players.forEach(function (p) { p.hand.forEach(function (c) { if (c.kind === 'sub' && c.sub === subId) n++; }); });
    return n;
  }

  function activeBench(st) {
    if (!st.bench) st.bench = [];
    return st.bench.filter(function (b) { return b.valid; });
  }

  function startBench(st, subId) {
    st.bench = [{ id: subId, gen: st.round, valid: true }];
    ev(st, 'bench', {});
  }

  function sweepBench(st, ctx) {
    // 反应进行完毕：
    //  · 本次反应消耗的实验台物质 / 上位反应残留的生成物 → 无效，倒入废液缸
    //  · 本次反应生成的新物质 → 置于实验台，供下一位科学家反应
    // 说明：实验台上的物质是“反应生成的新物质”，不是牌；因此倒入废液缸时标记 from:'product'，
    //       便于与“被打出的手牌”区分（废液缸中两者都可以被【回收】抽取）。
    var used = (ctx && ctx.usedIds) || [];
    var keep = [];
    st.bench.forEach(function (b) {
      if (used.indexOf(b.id) >= 0) return;          // 反应物，已由调用方倒入废液缸
      st.waste.push({ id: b.id, from: 'product' }); // 残留生成物失效
    });
    st.bench = keep;
    if (ctx && ctx.products) {
      ctx.products.forEach(function (pid) {
        st.bench.push({ id: pid, gen: st.round, valid: true });
      });
    }
    ev(st, 'bench', {});
  }

  /* ---------------- 匹配“任意物质” ---------------- */
  function expandWilds(selected) {
    var combos = [[]];
    selected.forEach(function (c) {
      if (c.kind !== 'sub') return;
      var opts = (c.sub === 'WILD') ? DB.TABLE_IDS : [c.real || c.sub];
      var next = [];
      combos.forEach(function (base) {
        opts.forEach(function (o) { next.push(base.concat([o])); });
      });
      combos = next;
    });
    return combos;
  }

  /* ---------------- 反应索引 ----------------
   * 反应库上千条，逐条匹配太慢；先按“反应物中的某一种物质”建倒排索引，
   * 匹配时只扫描与本次所出牌 / 台面物质 / 接力目标相关的反应。 */
  var RX_BY_SUB = null;
  function buildReactionIndex() {
    RX_BY_SUB = {};
    DB.REACTIONS.forEach(function (rx) {
      var seenRx = {};
      rx.r.forEach(function (id) {
        if (seenRx[id]) return;
        seenRx[id] = 1;
        (RX_BY_SUB[id] = RX_BY_SUB[id] || []).push(rx);
      });
    });
  }
  function candidateReactions(ids) {
    if (!RX_BY_SUB) buildReactionIndex();
    var out = [], seen = {};
    for (var i = 0; i < ids.length; i++) {
      var list = RX_BY_SUB[ids[i]];
      if (!list) continue;
      for (var k = 0; k < list.length; k++) {
        if (seen[list[k].id]) continue;
        seen[list[k].id] = 1;
        out.push(list[k]);
      }
    }
    return out;
  }

  /* fullIds: 本次出牌（“任意物质”展开后）的物质序列
   * benchActiveIds: 实验台上的有效物质（普通玩法下反应物可从这里取用）
   * anchor: 接力目标物质（接力实验中=上家所出的那张牌）。
   *         指定 anchor 时，本次反应**必须**用掉它，且它算作可用的反应物（即使不在实验台上）。 */
  function matchReaction(rx, fullIds, benchActiveIds, anchor) {
    var sel = {};
    fullIds.forEach(function (id) { sel[id] = (sel[id] || 0) + 1; });
    var bench = {};
    benchActiveIds.forEach(function (id) { bench[id] = (bench[id] || 0) + 1; });

    var usedIds = [];       // 反应中由本次出牌提供的反应物（消耗出牌牌张）
    var benchNeed = [];     // 反应中需从实验台取用的反应物
    var touch = false;      // 本次反应是否用到了台上的有效物质
    var anchorUsed = false; // 接力目标牌是否被纳入本次反应
    for (var i = 0; i < rx.r.length; i++) {
      var id = rx.r[i];
      if (sel[id] > 0) {
        sel[id]--;
        usedIds.push(id);
        if (anchor && id === anchor) { anchorUsed = true; touch = true; }
        if (benchActiveIds.indexOf(id) >= 0) touch = true;  // 台上也有，可直接相接
      } else if (bench[id] > 0) {
        bench[id]--;
        benchNeed.push(id);
        touch = true;
        if (anchor && id === anchor) anchorUsed = true;
      } else if (anchor && id === anchor && !anchorUsed) {
        // 接力实验：上家所出的那张牌本身就是反应物（它不一定还在实验台上）
        anchorUsed = true;
        benchNeed.push(id);
        touch = true;
      } else {
        return null;  // 反应物凑不齐
      }
    }
    // 接力实验：本次反应必须用掉那张“上家所出的牌”，否则不算接力
    if (anchor && !anchorUsed) return null;
    // 本次所出的牌至少要有一张真正参与反应（否则等于没出牌去反应）
    if (usedIds.length === 0) return null;
    // 实验台上没有有效物质时（空台 / 被 Pass 掉），可用物质牌开启新一轮，无需反应
    if (!touch && !anchor && benchActiveIds.length > 0) return null;
    var score = usedIds.length * 6;
    if (usedIds.length === fullIds.length) score += 20;  // 所出的牌全部参与反应的方案优先
    score -= (fullIds.length - usedIds.length) * 10;     // 多出的牌只是无效物质
    score -= benchNeed.length * 2;                       // 尽量少依赖台上残留物
    // 反应用不到的台上物质会立刻失效，尽量选能把它们一起消耗掉的反应
    var leftovers = 0;
    benchActiveIds.forEach(function (id) { if (usedIds.indexOf(id) < 0) leftovers++; });
    score -= leftovers * 8;
    if (touch) score += 10;
    return { rx: rx, used: usedIds.length, score: score, usedIds: usedIds, benchUsed: benchNeed };
  }

  function bestMatch(st, selected, anchor) {
    var real = selected.filter(function (c) { return c.kind === 'sub'; });
    if (!real.length) return null;
    var benchIds = activeBench(st).map(function (b) { return b.id; });
    var combos = expandWilds(selected);
    var best = null, fallback = null;
    combos.forEach(function (full) {
      candidateReactions(full).forEach(function (rx) {
        var m = matchReaction(rx, full, benchIds, anchor);
        if (!m) return;
        if (rx.t === '分解') {
          // 反应库已按要求去除全部分解反应；这里保留兜底：
          // 万一以后有分解反应被重新加入，也只在没有其他可行反应时才允许。
          if (!fallback || m.score > fallback.score) fallback = m;
          return;
        }
        if (!best || m.score > best.score) best = m;
      });
    });
    if (!best) best = fallback;
    if (!best) return null;
    // 未被使用的牌（超出反应所需）视为无效物质，一并倒入废液缸
    best.extra = real.length - best.used;
    return best;
  }

  /* 元素接力：与上一张牌有一种或多种相同元素 */
  function sameElement(a, b) {
    var sa = subById(a), sb = subById(b);
    if (!sa || !sb) return false;
    for (var i = 0; i < sa.el.length; i++) if (sb.el.indexOf(sa.el[i]) >= 0) return true;
    return false;
  }

  /* ---------------- 出牌合法性 ----------------
   * opt.anchor: 指定必须与之反应的台上物质（用户在实验台上点选的目标）。
   *             未指定时，接龙/接力/元素接力按各自规则自动挑选最优反应。
   * 返回 {ok, reason, reaction, usedIds, products, realOf, invalid} */
  function evaluatePlay(st, pi, cardIds, opt) {
    var r = evaluatePlayRaw(st, pi, cardIds, opt);
    if (r && r.ok) {
      /* 防作弊：本次所出的每一张物质牌都必须真的被这个反应用掉。
       * 否则就可以“搭车”——选一张可反应的牌 + 任意一张不可反应的牌，
       * 反应照常进行，而那张废牌被白白扔进废液缸，等于变相快速出牌。 */
      var v = verifyAllCardsConsumed(r, cardIds);
      if (!v.ok) {
        return {
          ok: false, reason: v.reason,
          reaction: null, products: [], usedIds: [], benchUsed: [], realOf: r.realOf
        };
      }
    }
    return r;
  }

  /* 校验：每张所出的物质牌都在本次反应中被消耗 */
  function verifyAllCardsConsumed(res, cardIds) {
    // 开启新一轮的“铺垫牌”本来就不参与反应，单独放行（出牌张数另有校验）
    if (res.opening) return { ok: true };
    // 非反应型出牌（元素接力只看元素是否相同）不涉及反应物消耗
    if (!(res.usedIds && res.usedIds.length) && !(res.benchUsed && res.benchUsed.length)) {
      return { ok: true };
    }
    var consume = {};
    (res.usedIds || []).forEach(function (id) { consume[id] = (consume[id] || 0) + 1; });
    (res.benchUsed || []).forEach(function (id) { consume[id] = (consume[id] || 0) + 1; });
    var bad = null;
    for (var i = 0; i < cardIds.length; i++) {
      var id = cardIds[i];
      var real = (res.realOf && res.realOf[id]) || null;
      if (!real) continue;
      if (consume[real]) { consume[real]--; continue; }
      bad = real;
      break;
    }
    if (bad) {
      return {
        ok: false,
        reason: '「' + DB.label(bad) + '」不参与这次反应，不能与其它牌一起打出' +
          '（一次出牌里的每一张物质牌都必须被同一个反应用掉）'
      };
    }
    return { ok: true };
  }

  function evaluatePlayRaw(st, pi, cardIds, opt) {
    opt = opt || {};
    var anchor = opt.anchor || null;
    var p = st.players[pi];
    if (!p) return { ok: false, reason: '无此玩家' };
    var selected = cardIds.map(function (id) {
      var f = cardInHand(st, pi, id);
      return f ? f.c : null;
    }).filter(Boolean);
    if (selected.length !== cardIds.length) return { ok: false, reason: '手牌中不存在所选牌' };

    var substs = selected.filter(function (c) { return c.kind === 'sub'; });
    var others = selected.filter(function (c) { return c.kind !== 'sub'; });
    var realOf = {};
    substs.forEach(function (c) { realOf[c.id] = c.real || c.sub; });

    /* 开启新一轮：实验台上没有可反应物质时，本回合的第一位科学家只出一张牌铺垫，
     * 这一张牌不参与任何反应（既不能自发分解，也不能与旧台上的残留物反应），
     * 由下一位科学家决定出牌与它反应或 Pass。（麻将式起牌）
     * 注意：这一判断必须放在“特殊牌不能与物质牌同出”之前，
     * 否则手里只剩未指定物质的「任意物质」时会卡死（无法铺垫、只能一直 Pass）。 */
    var openIds = activeBench(st).map(function (b) { return b.id; });
    if (openIds.length === 0) {
      if (cardIds.length !== 1) return { ok: false, reason: '开启新一轮时只能出一张物质牌（该牌不参与反应）' };
      var only = substs[0];
      if (!only) return { ok: false, reason: '请选择一张物质牌用于开启新一轮' };
      if (!only.real && only.sub === 'WILD') {
        /* 未指定代替物的「任意物质」也可以直接铺垫：默认代替 NaCl，
         * 玩家之后仍可点击它重新指定。若这里直接拒绝，手里只剩这张牌时
         * 会与对手无限互相 Pass，对局永远结束不了。 */
        only.real = DB.TABLE_IDS.indexOf('NaCl') >= 0 ? 'NaCl' : DB.TABLE_IDS[0];
      }
      realOf[only.id] = only.real || only.sub;
      var openReal = only.real || only.sub;
      return {
        ok: true, reaction: null, products: [], usedIds: [], benchUsed: [], invalid: true,
        opening: true, realOf: realOf,
        note: '开启新一轮：' + DB.label(openReal) + '（本张不参与反应，由下家决定是否反应）'
      };
    }

    if (others.length) return { ok: false, reason: '请单独使用特殊牌 / 人物牌 / 操作牌' };
    if (!substs.length) return { ok: false, reason: '请选择物质牌' };

    substs.forEach(function (c) { if (c.kind === 'sub') realOf[c.id] = c.real || c.sub; });

    /* 元素接力：只看“上一张牌”的元素 */
    if (st.mode === 'element') {
      if (substs.length !== 1) return { ok: false, reason: '元素接力每次只能出一张物质牌' };
      var c0 = substs[0];
      var ids0 = (c0.sub === 'WILD') ? (c0.real ? [c0.real] : DB.TABLE_IDS) : [c0.sub];
      var prev = st.lastReaction && st.lastReaction.elementPrev;
      var matchId = null;
      if (!prev) {
        matchId = ids0[0];                       // 开局第一张牌自由出
      } else {
        for (var i2 = 0; i2 < ids0.length; i2++) {
          if (sameElement(ids0[i2], prev)) { matchId = ids0[i2]; break; }
        }
      }
      if (!matchId) {
        return { ok: false, reason: '所出物质牌须与上一张牌 ' + (prev ? DB.label(prev) : '—') + ' 有一种或多种相同元素' };
      }
      var o2 = {}; o2[c0.id] = matchId;
      return {
        ok: true, reaction: null, products: [], usedIds: [], benchUsed: [], invalid: false,
        realOf: o2, note: '与 ' + DB.label(prev || matchId) + ' 含有相同元素'
      };
    }

    /* 接力实验：只能出一张牌，且必须与「上家所出的那张牌」反应
     * （而不是与上位反应的生成物反应；实验台上的生成物不参与本玩法的判定） */
    if (st.mode === 'relay') {
      if (substs.length !== 1) return { ok: false, reason: '接力实验每次只能出一张物质牌' };
      var relayTarget = st.relayCard || null;
      if (!relayTarget) {
        return { ok: false, reason: '尚未确定接力目标（请先由一位科学家出一张牌开启本轮）' };
      }
      var m = bestMatch(st, substs, relayTarget);
      if (!m) {
        return { ok: false, reason: '所出物质牌必须能与上家所出的 ' + DB.label(relayTarget) + ' 反应' };
      }
      // 通配牌绑定：确认它确实用掉了那张接力目标牌
      var combosR = expandWilds(substs);
      var bound = null;
      for (var a = 0; a < combosR.length; a++) {
        var rids = m.rx.r;
        for (var b2 = 0; b2 < rids.length; b2++) {
          if (rids[b2] === relayTarget) { bound = combosR[a][0]; break; }
        }
        if (bound) break;
      }
      if (bound) realOf[substs[0].id] = bound;
      // 不能把上家刚出的那张牌原样再出一遍充数（要换一张能与它反应的牌）
      var myId = realOf[substs[0].id];
      if (myId === relayTarget && m.usedIds.length === 1) {
        return { ok: false, reason: '接力实验：请出一张能与上家所出的 ' + DB.label(relayTarget) + ' 反应的牌' };
      }
      return {
        ok: true, reaction: m.rx, products: m.rx.p.slice(), usedIds: m.usedIds.slice(),
        benchUsed: m.benchUsed.slice(), invalid: false, realOf: realOf,
        note: DB.equation(m.rx) + '　（与上家所出的 ' + DB.label(relayTarget) + ' 反应）'
      };
    }

    /* 接龙实验：可选指定要与台上哪一个物质反应（anchor） */
    var mm = bestMatch(st, substs, anchor || null);
    if (mm) {
      // 把通配牌绑定到实际反应所需物质上
      var combos = expandWilds(substs);
      for (var q = 0; q < combos.length; q++) {
        var full = combos[q];
        var counts = {};
        full.forEach(function (x) { counts[x] = (counts[x] || 0) + 1; });
        var good = true;
        for (var w = 0; w < mm.rx.r.length; w++) {
          if (counts[mm.rx.r[w]]) { counts[mm.rx.r[w]]--; continue; }
          if (mm.benchUsed.indexOf(mm.rx.r[w]) >= 0) continue;  // 由实验台提供
          good = false; break;
        }
        if (!good) continue;
        full.forEach(function (x, idx) { if (substs[idx]) realOf[substs[idx].id] = x; });
        break;
      }
      return {
        ok: true, reaction: mm.rx, products: mm.rx.p.slice(), usedIds: mm.usedIds.slice(),
        benchUsed: (mm.benchUsed || []).slice(), invalid: false, realOf: realOf, note: DB.equation(mm.rx)
      };
    }

    // 实验台上有可反应物质，但所出的牌都无法参与反应
    return {
      ok: false,
      reason: '所出物质牌必须能与实验台上 ' + openIds.map(DB.label).join('、') + ' 之一发生反应'
    };
  }

  /* ---------------- 主要操作 ---------------- */
  function playCards(st, pi, cardIds, opt) {
    if (st.finished || st.phase !== 'main' || pi !== st.turn) return { ok: false, reason: '现在不是该科学家的出牌轮' };
    var p = st.players[pi];
    if (p.skip > 0) return { ok: false, reason: p.name + ' 正在停牌中' };

    var res = evaluatePlay(st, pi, cardIds, opt);
    if (!res.ok) return res;

    st.passed = {};          // 有人出牌 → 本轮 Pass 计数清零
    st.idlePass = 0;         // 有人出牌 → “连续干等”计数清零
    st.lastPlayer = pi;      // 记录“最后出牌的科学家”：其余人全部 Pass 后由他开启新一回合

    var playedHands = [];

    // 从手牌移除；每张牌都按其实际代表的物质计入废液缸（“任意物质”用其指定的物质）
    // 注意：res.usedIds 仅记录“本次所出牌”中参与反应的物质，台上取用的记在 benchUsed
    var handPool = res.usedIds.slice();
    cardIds.forEach(function (id) {
      var f = cardInHand(st, pi, id);
      if (!f) return;
      var realId = (res.realOf && res.realOf[id]) || f.c.sub;
      var at = handPool.indexOf(realId);
      var used = at >= 0;
      if (used) handPool.splice(at, 1);
      playedHands.push({ id: realId, from: used ? 'reaction' : 'unused', card: id });
      f.p.hand.splice(f.i, 1);
      f.p.used++;
    });

    // 所有打出的牌都进入废液缸（参与反应 or 成为无效物质）
    playedHands.forEach(function (w) { st.waste.push(w); });

    if (res.reaction) {
      // 反应物：除本次所出的牌外，还需从实验台取用的物质，同样消耗（倒入废液缸）
      (res.benchUsed || []).forEach(function (subId) {
        if (st.bench.some(function (b) { return b.id === subId; })) st.waste.push({ id: subId, from: 'reaction' });
      });
      sweepBench(st, { usedIds: res.benchUsed || [], products: res.products });
      st.reaction = {
        round: st.round, player: pi, rxId: res.reaction.id, products: res.products.slice(),
        text: DB.equationPlain(res.reaction)
      };
      st.reactionsDone = (st.reactionsDone || 0) + 1;   // 供 AI 判断“开局蓄力期”是否结束
      st.lastReaction = { elementPrev: (res.realOf || {})[cardIds[0]] || null, products: res.products.slice() };
      if (st.mode === 'relay') {
        var playedRelay = (res.realOf || {})[cardIds[0]] || null;
        // 接力实验：实验台上只保留「上家所出的那张物质牌」。
        // （sweepBench 会留下反应生成物，这里把它们撤下，换成刚出的这张牌）
        st.bench.forEach(function (b) {
          if (b.id !== playedRelay) st.waste.push({ id: b.id, from: 'product' });
        });
        st.bench = [];
        startBench(st, playedRelay);
        st.relayCard = playedRelay;
        st.relayOwner = pi;
        st.reaction = null;
        logMsg(st, p.name + ' 出牌：' + res.note + '　【' + res.reaction.nm + '·' + res.reaction.t +
          '】下家须与 ' + DB.label(playedRelay) + ' 反应。', 'ok');
      } else {
        logMsg(st, p.name + ' 出牌：' + res.note + '　【' + res.reaction.nm + '·' + res.reaction.t + '】', 'ok');
      }
      ev(st, 'play', { player: pi, cards: cardIds.slice(), reaction: res.reaction.id, products: res.products.slice() });
    } else if (res.invalid) {
      var real = (res.realOf || {})[cardIds[0]] || null;
      if (res.opening) {
        // 开局铺垫牌：清台后把这一张放上去，接力目标即它本身
        st.bench.forEach(function (b) { st.waste.push({ id: b.id, from: 'product' }); });
        st.bench = [];
        startBench(st, real);
        if (st.mode === 'relay') { st.relayCard = real; st.relayOwner = pi; }
      }
      st.reaction = null;
      st.lastReaction = { elementPrev: real, products: [] };
      logMsg(st, p.name + ' 出牌：' + DB.label(real) + '（开启新一轮，本张不参与反应，由下家决定是否反应）', 'warn');
      ev(st, 'play', { player: pi, cards: cardIds.slice(), reaction: null, products: [] });
    } else {
      // 元素接力
      st.bench.forEach(function (b) { st.waste.push({ id: b.id, from: 'product' }); });
      st.bench = [];
      startBench(st, (res.realOf || {})[cardIds[0]] || null);
      st.lastReaction = { elementPrev: (res.realOf || {})[cardIds[0]], products: [] };
      logMsg(st, p.name + ' 出牌：' + DB.label(st.lastReaction.elementPrev) + '　' + res.note, 'ok');
      ev(st, 'play', { player: pi, cards: cardIds.slice(), reaction: null, products: [] });
    }

    endTurn(st, pi, { played: true });
    return { ok: true, res: res };
  }

  /* 该科学家现在是否还有任何可以执行的动作（出牌 / Pass 之外的选项） */
  function playerHasAction(st, pi) {
    var p = st.players[pi];
    if (!p || !p.active) return false;
    var pv = playableCards(st, pi);
    return !!(pv.any || pv.opening);
  }

  /* Pass：只有在场科学家全部 Pass 之后，实验台上的药品才倒入废液缸。
   * 规则：一轮里，出牌者之后的其他科学家全部 Pass 后，由**出该牌的科学家**
   *       （即本轮开始铺垫/出牌的那位）开启新一回合，而不是顺延给下一位。 */
  function passTurn(st, pi) {
    if (st.finished || st.phase !== 'main' || pi !== st.turn) return { ok: false, reason: '现在不是该科学家的出牌轮' };
    var p = st.players[pi];
    var activePlayers = st.players.filter(function (q) { return q.active; });
    var passed = st.passed || (st.passed = {});
    passed[pi] = true;
    st.idlePass = (st.idlePass || 0) + 1;   // 用于让 AI 判断“干等了多久”，越久越可能动用战术牌
    var passCount = activePlayers.filter(function (q) { return passed[q.id]; }).length;
    /* 需要 Pass 的是“除本轮最后出牌的科学家以外的所有在场科学家”：
     * 最后由谁出的牌，就由谁开启新一回合，他本人不需要 Pass，所以门槛是 total - 1。 */
    var lp = (st.lastPlayer != null && st.players[st.lastPlayer] && st.players[st.lastPlayer].active)
      ? st.lastPlayer
      : ((st.roundStarter != null && st.players[st.roundStarter] && st.players[st.roundStarter].active)
        ? st.roundStarter : null);
    var needed = activePlayers.length - (lp != null ? 1 : 0);
    if (needed < 1) needed = 1;
    var allPassed = passCount >= needed;

    var benchNames = st.bench.map(function (b) { return DB.label(b.id); }).join('、');
    if (allPassed) {
      if (st.bench.length) {
        logMsg(st, p.name + ' 选择 Pass。其余科学家全部 Pass（' + passCount + '/' + needed +
          '），实验台上的 ' + benchNames + ' 全部无效，倒入废液缸。', 'warn');
        dumpBench(st);
      } else {
        logMsg(st, p.name + ' 选择 Pass。其余科学家全部 Pass（' + passCount + '/' + needed + '），实验台为空。', 'warn');
      }
      st.passed = {};
      st.relayCard = null;      // 全体 Pass → 接力链中断，重新起牌
      st.relayOwner = null;
      /* 由本轮最后出牌的科学家开启新一回合（若他已出完/出局，则顺延给下一位在场科学家）。
       * 注意还要看他手里是否真的还有能出的牌：否则他会一直 Pass 而别人也无法接手，
       * 对局会陷入死循环。 */
      if (lp != null && lp !== pi && playerHasAction(st, lp)) {
        startNewRoundFrom(st, lp);
        st.turn = lp;
        ev(st, 'turn', { player: lp });
        logMsg(st, '新一轮由最后出牌的 ' + st.players[lp].name + ' 重新开始。', 'muted');
        st.players[lp].skip = 0;                    // 轮到自己开局时不再停牌
        st.lastPlayer = lp;
        return { ok: true, allPassed: true };
      }
      startNewRoundFrom(st, pi);
    } else {
      logMsg(st, p.name + ' 选择 Pass（其余科学家已 Pass ' + passCount + '/' + needed + '）。' +
        (st.bench.length ? '实验台上的 ' + benchNames + ' 仍然有效，等待其他科学家决定。' : ''), 'warn');
    }
    ev(st, 'pass', { player: pi, allPassed: allPassed });
    endTurn(st, pi, {});
    return { ok: true, allPassed: allPassed };
  }

  function startNewRoundFrom(st, pi) {
    st.round++;
    st.roundStarter = pi;
    ev(st, 'round', { round: st.round });
  }

  /* 结束当前出牌轮：判定胜负 → 无人可继续则清台 → 下一位 */
  function endTurn(st, pi, opt) {
    checkWin(st, pi);
    if (st.finished) return;
    if (benchDeadlock(st)) {
      dumpBench(st);
      logMsg(st, '实验台上已无可反应的物质，全部倒入废液缸。', 'muted');
      startNewRoundFrom(st, st.turn);
    }
    nextTurn(st);
  }

  function benchDeadlock(st) {
    return st.bench.length > 0 && activeBench(st).length === 0;
  }

  function dumpBench(st) {
    st.bench.forEach(function (b) { st.waste.push({ id: b.id, from: 'product' }); });
    st.bench = [];
    st.reaction = null;
    ev(st, 'bench', {});
  }

  function checkWin(st, pi) {
    var p = st.players[pi];
    if (!p || !p.active) return;
    if (p.hand.length === 0) {
      p.won = true; p.active = false; p.done = st.round;
      st.winnerOrder.push(pi);
      logMsg(st, '🏆 ' + p.name + ' 已出完全部手牌，实验成功，成为旁观者（保持安静，不得进行战术交流）。', 'win');
      ev(st, 'win', { player: pi });
      var remain = st.players.filter(function (q) { return q.active; });
      if (remain.length <= 1) {
        remain.forEach(function (q) { q.out = true; q.active = false; });
        st.finished = true;
        var names = st.winnerOrder.map(function (i) { return st.players[i].name; });
        logMsg(st, '实验结束。胜利顺序：' + names.join(' → ') +
          (remain.length ? '；' + remain[0].name + ' 为最后一位在场科学家，出局。' : ''), 'win');
        ev(st, 'end', { order: st.winnerOrder.slice() });
      }
    }
  }

  function nextTurn(st) {
    var n = st.players.length;
    // 停滞保护：极少数情况下科学家们会陷入“回收→Pass”的循环，避免实验无限进行
    st.actions = (st.actions || 0) + 1;
    if (st.actions > 400) {
      st.finished = true;
      logMsg(st, '实验已进行很久，仍无人出完全部手牌，实验结束（平局）。', 'win');
      ev(st, 'end', { order: st.winnerOrder.slice() });
      return;
    }
    var guard = 0;
    var i = st.turn;
    while (guard++ < n * 6) {
      i = (i + 1) % n;
      var p = st.players[i];
      if (!p.active) continue;
      if (p.skip > 0) {
        p.skip--;
        logMsg(st, p.name + ' 停牌中，跳过本回合' + (p.skip > 0 ? '（还剩 ' + p.skip + ' 回合）' : '（停牌结束）') + '。', 'muted');
        ev(st, 'skip', { player: i });
        continue;
      }
      st.turn = i;
      ev(st, 'turn', { player: i });
      return;
    }
    st.finished = true;
    logMsg(st, '所有科学家均已无法行动，实验结束。', 'win');
  }

  /* ---------------- 特殊牌 ---------------- */
  function useCancel(st, pi) {
    if (st.finished) return { ok: false, reason: '实验已结束' };
    var p = st.players[pi];
    var idx = p.hand.findIndex(function (c) { return c.kind === 'special' && c.sp === 'CANCEL'; });
    if (idx < 0) return { ok: false, reason: '手牌中没有“抵消”' };
    // 响应 DLC 指示
    if (st.phase === 'respond' && st.demand) {
      if (st.demand.pending.indexOf(pi) < 0) return { ok: false, reason: '本轮指示与你无关' };
      var cancel1 = p.hand.splice(idx, 1)[0];
      st.waste.push({ id: 'CANCEL', from: 'special', card: cancel1.id });
      var r = st.demand.responses[pi] || (st.demand.responses[pi] = {});
      r.cancel = true;
      logMsg(st, p.name + ' 打出【抵消】，抵消一次行动，视为完成本次指示要求。', 'special');
      ev(st, 'cancel', { player: pi });
      afterResponse(st);
      return { ok: true };
    }
    // 无 DLC 时：抵消本轮反应，开启新一轮，由出该牌的科学家出牌
    if (st.phase !== 'main' || pi !== st.turn) return { ok: false, reason: '现在不是该科学家的出牌轮' };
    var cancel2 = p.hand.splice(idx, 1)[0];
    st.waste.push({ id: 'CANCEL', from: 'special', card: cancel2.id });
    dumpBench(st);
    logMsg(st, p.name + ' 打出【抵消】，抵消本轮反应，开启新一轮，由 ' + p.name + ' 出牌。', 'special');
    startNewRoundFrom(st, pi);
    p.skip = 0;
    tryGrantExtraTurn(st, pi);
    return { ok: true };
  }

  /* 抵消后由出牌者再出一张牌开启新一轮：给该玩家一次额外出牌机会 */
  function tryGrantExtraTurn(st, pi) {
    if (st.players[pi] && st.players[pi].active && !st.finished) {
      st.turn = pi;
      st.phase = 'main';
      ev(st, 'turn', { player: pi });
    }
  }

  /* 从牌堆中取出一张指定物质的牌（用于回收时补牌） */
  function takeDeckCard(st, subId) {
    for (var i = st.deck.length - 1; i >= 0; i--) {
      if (st.deck[i].kind === 'sub' && st.deck[i].sub === subId) {
        return st.deck.splice(i, 1)[0].id;
      }
    }
    return null;
  }

  /* 生成一个保证不重复的牌实例号（回收补牌 / 转换生成新牌时使用）。
   * 只用计数器而不校验的话，回收补出来的 “S:xx:r1” 可能与转换补出来的撞号，
   * 造成同一实例号出现在两处、牌张账目少一张。 */
  function newInstanceId(st, subId) {
    st.newInstances = (st.newInstances || 0) + 1;
    var seq = st.newInstances;
    var id;
    do {
      id = 'S:' + subId + ':n' + seq;
      seq++;
    } while (idInUseAnywhere(st, id));
    st.newInstances = seq - 1;
    return id;
  }
  function idInUseAnywhere(st, id) {
    if (st.deck.some(function (c) { return c.id === id; })) return true;
    if (st.players.some(function (q) { return q.hand.some(function (c) { return c.id === id; }); })) return true;
    return st.waste.some(function (w) { return w.card === id; });
  }

  function useRecycle(st, pi) {
    var p = st.players[pi];
    var idx = p.hand.findIndex(function (c) { return c.kind === 'special' && c.sp === 'RECYCLE'; });
    if (idx < 0) return { ok: false, reason: '手牌中没有“回收”' };
    if (!st.waste.length) return { ok: false, reason: '废液缸中没有物质牌，无法回收' };
    var subIdx = [];
    st.waste.forEach(function (w, i) { if (DB.SUB_INDEX[w.id]) subIdx.push(i); });
    if (!subIdx.length) return { ok: false, reason: '废液缸中没有物质牌，无法回收' };
    var pick = subIdx[Math.floor(st.rnd() * subIdx.length)];
    var got = st.waste[pick];
    var recycle = p.hand.splice(idx, 1)[0];   // 先取出手牌，避免索引失效
    st.waste.splice(pick, 1);
    st.waste.push({ id: 'RECYCLE', from: 'special', card: recycle.id });
    // 抽回手牌：优先沿用废液缸中那张牌自己的实例号；
    // 若那条记录是反应生成物（没有实例号），或该实例号仍在使用中（异常状态），
    // 则改为生成一个新的实例号，保证同一实例号不会同时出现在两处。
    var p2 = st.players[pi];
    function idInUse(id) {
      if (!id) return true;
      if (st.deck.some(function (c) { return c.id === id; })) return true;
      if (p2.hand.some(function (c) { return c.id === id; })) return true;
      if (st.waste.some(function (w) { return w.card === id; })) return true;
      var other = st.players.some(function (q) {
        return q !== p2 && q.hand.some(function (c) { return c.id === id; });
      });
      return other;
    }
    var newId;
    if (typeof got.card === 'string' && got.card.indexOf('S:') === 0 && !idInUse(got.card)) {
      newId = got.card;                                   // 该牌实例从废液缸回到手牌
    } else {
      delete got.card;
      newId = takeDeckCard(st, got.id);
      if (!newId) newId = newInstanceId(st, got.id);       // 牌堆已空：生成一个新实例
    }
    st.recycled = (st.recycled || 0) + 1;
    p.hand.push({ id: newId, kind: 'sub', sub: got.id, real: null });
    logMsg(st, p.name + ' 打出【回收】，从废液缸中随机抽到 ' + DB.label(got.id) + '（' + DB.nameOf(got.id) + '）并加入手牌。', 'special');
    ev(st, 'recycle', { player: pi, got: got.id });
    return { ok: true };
  }

  function useConvert(st, pi, cardId, targetSub) {
    var p = st.players[pi];
    var idx = p.hand.findIndex(function (c) { return c.kind === 'special' && c.sp === 'CONVERT'; });
    if (idx < 0) return { ok: false, reason: '手牌中没有“转换”' };
    var f = cardInHand(st, pi, cardId);
    if (!f || f.p !== p || f.c.kind !== 'sub') return { ok: false, reason: '请选择自己手牌中的一张物质牌' };
    var src = f.c.real || f.c.sub;
    var tgt = subById(targetSub);
    if (!tgt) return { ok: false, reason: '“任意物质”以外不可转换为物质牌表以外的物质' };
    var srcS = subById(src);
    if (!srcS) return { ok: false, reason: '来源物质无效' };
    var shared = tgt.el.filter(function (e) { return srcS.el.indexOf(e) >= 0; });
    if (!shared.length) return { ok: false, reason: '转换后的物质须与 ' + srcS.f + ' 至少含有一种相同元素' };

    // 先取出“转换”牌本身（注意：splice 后索引会失效，必须用被移除的对象）
    var convCard = p.hand.splice(idx, 1)[0];
    st.waste.push({ id: 'CONVERT', from: 'special', card: convCard.id });
    // 再取出手牌中被转换的物质牌
    var fi = p.hand.findIndex(function (c) { return c.id === cardId; });
    var srcCard = p.hand.splice(fi, 1)[0];
    st.waste.push({ id: src, from: 'converted', card: srcCard.id });

    /* 转换后的物质作为一张**普通物质牌**放回自己手里，而不是直接出牌。
     * （原来会把实验台清空并把它放上台，等于白送一次出牌并破坏接龙链）
     * 注意：被转换的那张牌已经进了废液缸，所以这里必须用一个新的实例号，
     * 否则同一张牌会同时出现在废液缸和手牌里，牌张统计就乱了。 */
    var keepId = newInstanceId(st, targetSub);
    p.hand.push({ id: keepId, kind: 'sub', sub: targetSub, real: null, dlc: false });
    logMsg(st, p.name + ' 打出【转换】，将手牌中的 ' + srcS.f + ' 转换为 ' + tgt.f +
      '（共有元素：' + shared.join('、') + '），新牌已放入手牌；本轮结束，由下一位科学家继续。', 'special');
    ev(st, 'convert', { player: pi, from: src, to: targetSub });
    /* 转换只是“换一张牌”，不改变实验台，也不额外获得出牌机会 */
    endTurn(st, pi, {});
    return { ok: true, to: targetSub };
  }

  /* 指定“任意物质”所代替的物质：
   * 指定后这张牌就**变成一张普通的物质牌**（只替换一次，之后不再具备“任意物质”属性，
   * 也绝不会再次弹出选择框），直接留在手牌里等待玩家决定何时打出。 */
  function setWild(st, pi, cardId, subId) {
    var f = cardInHand(st, pi, cardId);
    if (!f || f.p.id !== pi) return { ok: false, reason: '无此牌' };
    if (f.c.kind !== 'sub' || f.c.sub !== 'WILD') return { ok: false, reason: '该牌不是“任意物质”' };
    if (DB.TABLE_IDS.indexOf(subId) < 0) return { ok: false, reason: '“任意物质”代替的物质须为物质牌表中的物质' };
    var oldId = f.c.id;
    /* 整张牌就地换成普通物质牌：不保留 wild / real 之类的特殊标记 */
    f.p.hand.splice(f.i, 1);
    f.p.hand.push({ id: oldId, kind: 'sub', sub: subId, real: null, dlc: false });
    logMsg(st, st.players[pi].name + ' 把「任意物质」换成 ' + DB.label(subId) +
      '（' + DB.nameOf(subId) + '），成为一张普通物质牌留在手牌中。', 'special');
    ev(st, 'wild', { player: pi, to: subId });
    return { ok: true, sub: subId };
  }

  /* ---------------- 人物 / 操作 DLC ---------------- */
  function demandFromCard(card) {
    if (card.kind === 'people') {
      var pp = peopleById(card.ref);
      return {
        kind: 'people', ref: card.ref, name: pp.name, stop: pp.stop, desc: pp.text,
        test: function (s) {
          if (pp.kind.indexOf(s.id) >= 0) return true;
          if (pp.extra && pp.extra.indexOf(s.id) >= 0) return true;
          if (pp.cat.indexOf(s.cat) >= 0) return true;
          return false;
        },
        needDesc: pp.needDesc
      };
    }
    var oo = opById(card.ref);
    return {
      kind: 'op', ref: card.ref, name: oo.name, stop: oo.stop, desc: oo.text,
      test: oo.test, needDesc: oo.needDesc
    };
  }

  function playDLC(st, pi, cardId) {
    if (st.finished || st.phase !== 'main' || pi !== st.turn) return { ok: false, reason: '现在不是该科学家的出牌轮' };
    var f = cardInHand(st, pi, cardId);
    if (!f || f.p.id !== pi) return { ok: false, reason: '无此牌' };
    var card = f.c;
    if (card.kind !== 'people' && card.kind !== 'op') return { ok: false, reason: '该牌不是人物/操作 DLC 牌' };

    f.p.hand.splice(f.i, 1);
    st.waste.push({ id: ref(card), from: card.kind, card: card.id });
    var dm = demandFromCard(card);
    dm.by = pi;
    dm.card = cardId;
    dm.pending = [];
    dm.responses = {};
    st.players.forEach(function (q) { if (q.active && q.id !== pi) dm.pending.push(q.id); });
    st.demand = dm;
    st.phase = 'respond';
    st.reaction = null;
    st.passed = {};          // 指示行动期间重新开始计 Pass
    logMsg(st, f.p.name + ' 打出' + (card.kind === 'people' ? '人物 DLC' : '操作 DLC') + '【' + dm.name + '】：' + dm.desc + '（该科学家无需再次出牌，其余科学家须响应）', 'dlc');
    ev(st, 'demand', { demand: dm.ref, by: pi, kind: dm.kind });
    if (!dm.pending.length) { resolveDemand(st); return { ok: true }; }
    st.responder = dm.pending[0];
    return { ok: true, demand: dm };
  }

  function respondSubstance(st, pi, cardId) {
    if (st.phase !== 'respond' || !st.demand) return { ok: false, reason: '当前没有待响应的指示' };
    var dm = st.demand;
    if (pi !== st.responder && dm.responses[pi]) return { ok: false, reason: '你已响应' };
    var f = cardInHand(st, pi, cardId);
    if (!f || f.p.id !== pi) return { ok: false, reason: '无此牌' };
    var card = f.c;
    if (card.kind !== 'sub') return { ok: false, reason: '须出物质牌（或使用抵消）' };
    var realId = card.real || card.sub;
    if (card.sub === 'WILD' && !card.real) return { ok: false, reason: '请先指定“任意物质”所代替的物质' };
    var s = subById(realId);
    if (!s) return { ok: false, reason: '该物质不在物质牌表内' };
    if (!dm.test(s)) return { ok: false, reason: '不符合指示要求：' + dm.needDesc };

    f.p.hand.splice(f.i, 1);
    f.p.used++;
    st.waste.push({ id: realId, from: 'respond', card: card.id });
    dm.responses[pi] = { card: realId };
    logMsg(st, f.p.name + ' 响应指示，打出 ' + s.f + '（' + s.n + '）。', 'ok');
    ev(st, 'respond', { player: pi, card: realId });
    afterResponse(st);
    return { ok: true };
  }

  function acceptPenalty(st, pi) {
    if (st.phase !== 'respond' || !st.demand) return { ok: false, reason: '当前没有待响应的指示' };
    var dm = st.demand;
    var p = st.players[pi];
    if (!p || !p.active) return { ok: false, reason: '该科学家已不在场' };
    p.skip += dm.stop;
    dm.responses[pi] = { penalty: dm.stop };
    logMsg(st, p.name + ' 选择不出牌，接受惩罚：停 ' + dm.stop + ' 回合。', 'warn');
    ev(st, 'penalty', { player: pi, stop: dm.stop });
    afterResponse(st);
    return { ok: true };
  }

  function afterResponse(st) {
    var dm = st.demand;
    if (!dm) return;
    dm.pending = dm.pending.filter(function (id) { return !dm.responses[id]; });
    if (!dm.pending.length) { resolveDemand(st); return; }
    st.responder = dm.pending[0];
    ev(st, 'responder', { player: st.responder });
  }

  function resolveDemand(st) {
    var dm = st.demand;
    st.demand = null;
    st.phase = 'main';
    st.passed = {};          // 指示行动完毕，Pass 计数清零
    // 行动完毕，实验台上所有无效物质倒入废液缸（反应物/产物在指示期间一律失效）
    dumpBench(st);
    var by = dm.by;
    logMsg(st, '【' + dm.name + '】指示行动完毕，实验台清空，由 ' +
      st.players[(by + 1) % st.players.length].name + ' 开启新一回合。', 'dlc');
    startNewRoundFrom(st, by);
    // 自出牌科学家的下一位科学家开始新回合
    var n = st.players.length;
    var i = by, guard = 0;
    while (guard++ <= n) {
      i = (i + 1) % n;
      if (st.players[i].active) break;
    }
    st.turn = i;
    st.phase = 'main';
    ev(st, 'turn', { player: i });
    // 响应阶段可能有人打出了最后一张牌，逐一判定胜负
    for (var q = 0; q < st.players.length; q++) {
      checkWin(st, q);
      if (st.finished) return;
    }
    // 若轮到的人正在停牌，交给 nextTurn 处理
    if (st.players[i].skip > 0) nextTurn(st);
  }

  /* ---------------- 提示（可行动作） ---------------- */
  /* 本次所出的牌可以与台上哪几种物质反应（供 UI 让玩家点选反应对象） */
  function benchOptions(st, pi, cardIds) {
    var out = [], seen = {};
    var targets = (st.mode === 'relay')
      ? (st.relayCard ? [st.relayCard] : [])
      : activeBench(st).map(function (b) { return b.id; });
    targets.forEach(function (t) {
      if (seen[t]) return;
      seen[t] = 1;
      var r = evaluatePlay(st, pi, cardIds, { anchor: t });
      if (r && r.ok && r.reaction) {
        out.push({
          sub: t, reaction: r.reaction, equation: DB.equation(r.reaction),
          products: r.products.slice(),
          usesBench: (r.benchUsed && r.benchUsed.length > 0)
        });
      }
    });
    return out;
  }

  /* ---------------- 手牌可用性分析 ----------------
   * 返回 {
   *   any,                    // 是否有任何牌可以出
   *   canPlay, canSpecial, canDLC,
   *   opening,                // 本轮是否处于“实验台为空、需要出牌铺垫”的状态
   *   canOpen,                // 可以用于铺垫（开启新一轮）的牌
   *   benchList,              // 当前台面上可反应的物质（供提示用）
   *   blockReason             // 没有牌可出时的原因
   * } */
  function playableCards(st, pi) {
    var res = {
      any: false, canPlay: {}, canSpecial: {}, canDLC: {},
      opening: false, canOpen: {}, benchList: [], blockReason: ''
    };
    if (!st || !p_valid(st, pi)) return res;
    var p = st.players[pi];
    if (!p || p.active === false) return res;
    var inMain = st.phase === 'main' && st.turn === pi && !st.finished;
    var inRespond = st.phase === 'respond' && st.demand && st.demand.pending[0] === pi;

    if (inRespond) {
      var dm = st.demand;
      p.hand.forEach(function (c) {
        if (c.kind !== 'sub') {
          if (c.kind === 'special' && c.sp === 'CANCEL') { res.canSpecial[c.id] = true; res.any = true; }
          return;
        }
        var realId = c.real || (c.sub === 'WILD' ? wildFitFor(st, pi, dm) : c.sub);
        var s = realId ? subById(realId) : null;
        if (s && dm.test(s)) { res.canPlay[c.id] = true; res.any = true; }
      });
      return res;
    }

    if (!inMain) return res;

    p.hand.forEach(function (c) {
      if (c.kind === 'special') {
        if (c.sp === 'RECYCLE' && st.waste.some(function (w) { return DB.SUB_INDEX[w.id]; })) {
          res.canSpecial[c.id] = true; res.any = true;
        } else if (c.sp === 'CONVERT' && p.hand.some(function (x) { return x.kind === 'sub'; })) {
          res.canSpecial[c.id] = true; res.any = true;
        } else if (c.sp === 'CANCEL') {
          res.canSpecial[c.id] = true; res.any = true;
        }
      } else if (c.kind === 'people' || c.kind === 'op') {
        res.canDLC[c.id] = true; res.any = true;
      }
    });

    var subs = p.hand.filter(function (c) { return c.kind === 'sub'; });
    var benchIds = (st.mode === 'relay')
      ? (st.relayCard ? [st.relayCard] : [])
      : activeBench(st).map(function (b) { return b.id; });
    res.benchList = benchIds.slice();
    res.opening = benchIds.length === 0;

    /* 1) 实验台为空：本回合只需出一张牌铺垫，任意一张物质牌都可以（此牌不参与反应）。
     *    注意：这种情况不能算作“能与实验台反应”，否则所有牌都会显示成可用。 */
    if (res.opening) {
      subs.forEach(function (c) {
        res.canOpen[c.id] = true;
        res.canPlay[c.id] = true;
        res.any = true;
      });
      return res;
    }

    /* 2) 实验台上有物质：单张能反应，或与手上另外 1~2 张凑齐一个反应的全部反应物（接力模式只需一张） */
    var i, j, k, m;
    p.hand.forEach(function (c) {
      if (c.kind !== 'sub') return;
      var r = evaluatePlay(st, pi, [c.id]);
      if (r.ok) { res.canPlay[c.id] = true; res.any = true; }
    });

    var relayMode = (st.mode === 'relay');
    if (res.any && !relayMode) {
      // 已有单张可出，就不必再做组合扫描
    } else {
      var rem = subs.filter(function (c) { return !res.canPlay[c.id]; });
      var maxCombo = relayMode ? 1 : 3;
      function scan(list, depth, prefix) {
        if (depth >= maxCombo || prefix.length >= maxCombo) return;
        for (var x = 0; x < list.length; x++) {
          var next = prefix.concat([list[x]]);
          if (next.length >= 2) {
            var r = evaluatePlay(st, pi, next.map(function (c) { return c.id; }));
            if (r.ok) {
              /* 只把这次反应真正用到的牌标为可用，
               * 否则“凑数”的牌也会被误判成可出（曾导致所有牌都不灰显） */
              var used = {};
              (r.usedIds || []).forEach(function (id) { used[id] = 1; });
              var realIds = next.map(function (c) { return c.real || c.sub; });
              var mark = {};
              next.forEach(function (c, idx) {
                if (used[c.id] || used[c.real || c.sub] || realIds.indexOf(c.real || c.sub) >= 0) mark[c.id] = 1;
              });
              Object.keys(mark).forEach(function (id) { res.canPlay[id] = true; res.any = true; });
            }
          }
          scan(list.slice(x + 1), depth + 1, next);
        }
      }
      scan(relayMode ? subs : rem, 0, []);
    }

    if (!res.any) {
      res.blockReason = '手牌中没有能与实验台（' +
        benchIds.map(function (x) { return DB.label(x); }).join('、') + '）反应的物质牌';
    }
    return res;
  }
  function p_valid(st, pi) { return pi != null && pi >= 0 && pi < st.players.length; }

  /* 本次所出的牌，每一个反应分别用到了台上的哪个物质
   * （供 UI 让玩家点选“与哪一种台上物质反应”，并预览方程式） */
  function benchReactionOptions(st, selected, anchor) {
    var real = selected.filter(function (c) { return c.kind === 'sub'; });
    if (!real.length) return [];
    var benchIds = activeBench(st).map(function (b) { return b.id; });
    var combos = expandWilds(selected);
    var out = [], seen = {};
    combos.forEach(function (full) {
      candidateReactions(full.concat(benchIds)).forEach(function (rx) {
        var m = matchReaction(rx, full, benchIds, anchor || null);
        if (!m) return;
        var targets = [];
        m.benchUsed.forEach(function (id) { if (benchIds.indexOf(id) >= 0 && targets.indexOf(id) < 0) targets.push(id); });
        m.usedIds.forEach(function (id) { if (benchIds.indexOf(id) >= 0 && targets.indexOf(id) < 0) targets.push(id); });
        if (anchor && targets.indexOf(anchor) < 0) return;
        var key = rx.id + '|' + targets.slice().sort().join(',');
        if (seen[key]) return;
        seen[key] = 1;
        out.push({
          reaction: rx, targets: targets, usedIds: m.usedIds.slice(), benchUsed: m.benchUsed.slice(),
          equation: DB.equation(rx), products: rx.p.slice(),
          note: rx.nm + '·' + rx.t
        });
      });
    });
    return out;
  }

  function hintsFor(st, pi) {
    var out = [];
    if (st.phase !== 'main' || pi !== st.turn || st.finished) return out;

    /* 特殊牌 */
    var p = st.players[pi];
    var hasRecycle = p.hand.some(function (c) { return c.sp === 'RECYCLE'; });
    if (hasRecycle && st.waste.some(function (w) { return DB.SUB_INDEX[w.id]; })) {
      out.push({ kind: 'recycle', label: '回收：从废液缸随机抽一张物质牌入手' });
    }
    var hasConvert = p.hand.some(function (c) { return c.sp === 'CONVERT'; });
    if (hasConvert) {
      out.push({ kind: 'convert', label: '转换（选择手牌中一张物质牌 → 转为含相同元素的另一物质）' });
    }
    var hasCancel = p.hand.some(function (c) { return c.sp === 'CANCEL'; });
    if (hasCancel && st.bench.length) {
      out.push({ kind: 'cancel', label: '抵消本轮反应，开启新一轮（由你出牌）' });
    }

    /* 人物 / 操作 DLC：同样属于可出的牌（打出后其余科学家必须响应）。
     * 即使所有对手都能满足要求，打出它也能逼对手耗掉一张牌，所以一律列入可出行列。 */
    p.hand.forEach(function (c) {
      if (c.kind === 'people') {
        var pp = peopleById(c.ref);
        // 若至少有一位对手无法满足，这张牌的收益更大（会触发停牌惩罚）
        var hits = st.players.some(function (q) {
          return q.active && q.id !== pi && !canSatisfy(st, q.id, demandFromCard(c));
        });
        out.push({
          kind: 'dlc', card: c.id, people: true, strong: hits,
          label: '人物 DLC【' + pp.name + '】：' + pp.text + (hits ? '（有对手无法满足）' : '（对手均可满足）')
        });
      } else if (c.kind === 'op') {
        var oo = opById(c.ref);
        out.push({
          kind: 'dlc', card: c.id, people: false,
          label: '操作 DLC【' + oo.name + '】：' + oo.text
        });
      }
    });

    /* 物质牌组合（单张 / 两张 / 三张） */
    var subs = p.hand.filter(function (c) { return c.kind === 'sub'; });
    var combosC = [];
    subs.forEach(function (c) { combosC.push([c]); });
    var i, j, k;
    for (i = 0; i < subs.length; i++) for (j = i + 1; j < subs.length; j++) combosC.push([subs[i], subs[j]]);
    if (subs.length <= 26) {
      for (i = 0; i < subs.length; i++) for (j = i + 1; j < subs.length; j++) for (k = j + 1; k < subs.length; k++) combosC.push([subs[i], subs[j], subs[k]]);
    }
    var seen = {};
    combosC.forEach(function (cs) {
      var key = cs.map(function (c) { return c.id; }).join('|');
      if (seen[key]) return;
      seen[key] = 1;
      var r = evaluatePlay(st, pi, cs.map(function (c) { return c.id; }));
      if (!r.ok) return;
      out.push({
        kind: 'cards', cards: cs.map(function (c) { return c.id; }),
        reactionId: r.reaction ? r.reaction.id : null,
        label: r.note, invalid: !!r.invalid
      });
    });
    out.sort(function (a, b) {
      if (a.kind !== 'cards') return 1;
      if (b.kind !== 'cards') return -1;
      if (!!a.invalid !== !!b.invalid) return a.invalid ? 1 : -1;
      return b.cards.length - a.cards.length;
    });
    return out;
  }

  /* ---------------- 「任意物质」的候选物质 ----------------
   * 列出：把它当作某物质后，能与当前实验台（接力模式为接力目标牌）发生反应的候选物质，
   * 并给出对应的反应方程式。返回 [{sub, rx, equation, benchUsed, needsHand}] */
  function wildCandidates(st, pi) {
    var p = st.players[pi];
    if (!p) return [];
    var isRelay = st.mode === 'relay';
    var anchor = null, benchIds = [];
    if (isRelay) {
      anchor = st.relayCard || null;
      if (!anchor) return [];
    } else if (st.mode === 'element') {
      var prev = st.lastReaction && st.lastReaction.elementPrev;
      if (!prev) return DB.TABLE_IDS.map(function (id) { return { sub: id, rx: null, equation: '开局自由出牌', element: true }; });
      return DB.TABLE_IDS.filter(function (id) { return sameElement(id, prev); })
        .map(function (id) {
          return { sub: id, rx: null, element: true, equation: DB.label(id) + ' 与 ' + DB.label(prev) + ' 含有相同元素' };
        });
    } else {
      benchIds = activeBench(st).map(function (b) { return b.id; });
    }
    var handOthers = p.hand.filter(function (c) { return c.kind === 'sub' && !(c.sub === 'WILD' && !c.real); })
      .map(function (c) { return c.real || c.sub; });

    var out = [], seen = {};
    var pool0 = benchIds.concat(handOthers);
    if (anchor) pool0 = pool0.concat([anchor]);
    candidateReactions(pool0).forEach(function (rx) {
      // 该反应是否用到了「台面/接力目标」
      var touches = false;
      if (isRelay) {
        touches = rx.r.indexOf(anchor) >= 0;
      } else {
        if (benchIds.length === 0) return;                    // 空台：随便代替
        for (var i = 0; i < rx.r.length; i++) {
          if (benchIds.indexOf(rx.r[i]) >= 0) { touches = true; break; }
        }
      }
      if (!touches) return;
      // 反应物中，除台面/接力目标与手里已有的牌之外，还差哪些 —— 这些就是“任意物质”可以顶替的
      var pool = benchIds.concat(handOthers);
      if (anchor) pool = pool.concat([anchor]);
      var need = [];
      var poolCopy = pool.slice();
      for (var k = 0; k < rx.r.length; k++) {
        var idx = poolCopy.indexOf(rx.r[k]);
        if (idx >= 0) poolCopy.splice(idx, 1);
        else need.push(rx.r[k]);
      }
      if (need.length !== 1) return;                          // 只需顶替一张牌的情况
      var cand = need[0];
      if (DB.TABLE_IDS.indexOf(cand) < 0) return;             // “任意物质”只能代替物质牌表内的物质
      if (seen[cand]) return;
      seen[cand] = 1;
      out.push({
        sub: cand, rx: rx.id, reaction: rx, equation: DB.equation(rx),
        benchUsed: rx.r.filter(function (x) { return benchIds.indexOf(x) >= 0; }),
        needsHand: rx.r.filter(function (x) { return handOthers.indexOf(x) >= 0; })
      });
    });
    // 排序：单反应物优先（更容易成链），其次按物质表次序
    out.sort(function (a, b) {
      var la = a.rx.r ? a.rx.r.length : 0, lb = b.rx.r ? b.rx.r.length : 0;
      if (la !== lb) return la - lb;
      return (SUB_ORDER[a.sub] == null ? 999 : SUB_ORDER[a.sub]) - (SUB_ORDER[b.sub] == null ? 999 : SUB_ORDER[b.sub]);
    });
    return out;
  }

  /* 某玩家能否满足指示（用于 UI 提示 / AI） */  function canSatisfy(st, pi, dm) {
    var p = st.players[pi];
    return p.hand.some(function (c) {
      if (c.kind !== 'sub') return false;
      var realId = c.real;
      if (!realId && c.sub === 'WILD') return true; // 只要表里存在符合条件的物质即可
      if (c.sub === 'WILD' && realId) return !!subById(realId) && !!dm.test(subById(realId));
      var s = subById(c.sub);
      return !!s && !!dm.test(s);
    });
  }
  function wildFitFor(st, pi, dm) {
    var p = st.players[pi];
    var has = p.hand.some(function (c) { return c.kind === 'sub' && c.sub === 'WILD' && !c.real; });
    if (!has) return null;
    for (var i = 0; i < DB.SUBSTANCES.length; i++) {
      if (dm.test(DB.SUBSTANCES[i])) return DB.SUBSTANCES[i].id;
    }
    return null;
  }

  /* ---------------- AI ---------------- */
  function botMain(st, pi) {
    var p = st.players[pi];
    var hints = hintsFor(st, pi);
    var cardHints = hints.filter(function (h) { return h.kind === 'cards'; });
    var real = cardHints.filter(function (h) { return !h.invalid; });
    var recycle = hints.filter(function (h) { return h.kind === 'recycle'; })[0];
    var convert = hints.filter(function (h) { return h.kind === 'convert'; })[0];
    var cancel = hints.filter(function (h) { return h.kind === 'cancel'; })[0];
    var dlc = hints.filter(function (h) { return h.kind === 'dlc'; });

    /* ① 有能反应的物质牌就出（首要目标是把手里能接上的牌打出去） */
    if (real.length) {
      real.sort(function (a, b) { return b.cards.length - a.cards.length || (a.reactionId ? 0 : 1) - (b.reactionId ? 0 : 1); });
      var pick = real[Math.floor(st.rnd() * Math.min(3, real.length))];
      return { type: 'play', cards: pick.cards };
    }
    /* ② 特殊牌与 DLC：这是“战术牌”，不应该一有机会就全打出去，否则
     *    开局就刷完、后面只剩物质牌，观感很差。改成按局面概率使用：
     *    · 手里物质牌还很多（≥8）→ 只有 15% 概率使用（先攒着）
     *    · 实在接不上（连续 Pass 过）→ 概率提高，避免干等
     *    · 还能靠铺垫开新一轮 → 降概率（把机会留给物质牌）
     *    · 人物牌若有对手满足不了（会触发停牌惩罚）则大幅优先 */
    var subsInHand = p.hand.filter(function (c) { return c.kind === 'sub'; }).length;
    var stuck = st.idlePass || 0;                       // 连续 Pass 次数（在 passTurn 里累计）
    var canOpen = st.bench.length === 0 || activeBench(st).length === 0 || playableCards(st, pi).opening;
    if (dlc.length) {
      var strongDlc = dlc.filter(function (h) { return h.strong; });
      var pool = strongDlc.length ? strongDlc : dlc;
      /* 开局“蓄力期”：第 1 轮且还没有人成功反应过时，先把战术牌留着，
       * 否则会出现「一开局就把特殊牌和 DLC 全打完」的观感。 */
      var rounds = st.round || 1;
      var recycled = st.reactionsDone || 0;
      var hold = rounds < 2 && recycled < 1;
      var prob = 0.3 + Math.min(stuck, 3) * 0.2;        // 干等越久越可能出手
      if (strongDlc.length) prob = 0.8;                 // 能罚人的指示牌优先
      if (subsInHand >= 8) prob *= 0.35;                // 手牌还厚，先别急着用
      if (canOpen) prob *= 0.6;                         // 自己还能开链，先出物质牌
      if (hold) prob = 0;                               // 第 1 轮完全不使用
      else if (rounds <= 3) prob *= 0.5;                // 前几轮也克制一些
      prob = Math.max(0, Math.min(0.9, prob));
      if (prob > 0 && st.rnd() < prob) {
        return { type: 'dlc', cardId: pool[Math.floor(st.rnd() * pool.length)].card };
      }
    }
    /* ③ 开新一轮 / 场上没东西可接时，用抵消把台面清掉并自己重新开局 */
    if (cancel && !playableCards(st, pi).opening) return { type: 'cancel' };
    if (recycle) return { type: 'recycle' };
    if (convert) {
      var subs = p.hand.filter(function (c) { return c.kind === 'sub'; });
      if (subs.length) {
        var src = subs[Math.floor(st.rnd() * subs.length)];
        var srcId = src.real || src.sub;
        var srcS = subById(srcId);
        if (srcS) {
          var cands = DB.SUBSTANCES.filter(function (s) {
            if (s.id === srcId) return false;
            return s.el.some(function (e) { return srcS.el.indexOf(e) >= 0; });
          });
          if (cands.length) {
            var tgt = cands[Math.floor(st.rnd() * cands.length)];
            return { type: 'convert', cardId: src.id, target: tgt.id };
          }
        }
      }
    }
    /* ④ 台面为空只能铺垫时，出一张牌开新一轮 */
    var invalidHints = cardHints.filter(function (h) { return h.invalid; });
    if (invalidHints.length) return { type: 'play', cards: invalidHints[0].cards };
    return { type: 'pass' };
  }

  function botRespond(st, pi) {
    var dm = st.demand;
    var p = st.players[pi];
    // 优先出物质牌（保留抵消应对更差的情况）
    var first = true;
    for (var i = 0; i < p.hand.length; i++) {
      var c = p.hand[i];
      if (c.kind !== 'sub') continue;
      var realId = c.real || c.sub;
      if (c.sub === 'WILD' && !c.real) {
        var fit = wildFitFor(st, pi, dm);
        if (fit) return { type: 'respond', cardId: c.id, wild: fit };
        continue;
      }
      var s = subById(realId);
      if (s && dm.test(s)) return { type: 'respond', cardId: c.id };
    }
    var hasCancel = p.hand.some(function (c) { return c.sp === 'CANCEL'; });
    if (hasCancel) return { type: 'cancel' };
    return { type: 'penalty' };
  }

  function botAct(st) {
    if (st.finished) return null;
    if (st.phase === 'draw') return { type: 'draw' };
    if (st.phase === 'respond') {
      var pi = st.responder;
      if (pi == null || !st.players[pi] || !st.players[pi].bot) return null;
      return botRespond(st, pi);
    }
    if (st.phase === 'main') {
      var p = st.players[st.turn];
      if (!p || !p.bot) return null;
      return botMain(st, st.turn);
    }
    return null;
  }

  /* ---------------- 导出 ---------------- */
  global.ChemGame = {
    startGame: startGame,
    drawAll: drawAll,
    autoDraw: autoDraw,
    finishDraw: finishDraw,
    playCards: playCards,
    passTurn: passTurn,
    useCancel: useCancel,
    useRecycle: useRecycle,
    useConvert: useConvert,
    setWild: setWild,
    playDLC: playDLC,
    respondSubstance: respondSubstance,
    acceptPenalty: acceptPenalty,
    evaluatePlay: evaluatePlay,
    hintsFor: hintsFor,
    sortHand: sortHand,
    cardOrderKey: cardOrderKey,
    cardById: cardById,
    cardLabel: cardLabel,
    ref: ref,
    subById: subById,
    subLabel: subLabel,
    specialById: specialById,
    peopleById: peopleById,
    opById: opById,
    demandFromCard: demandFromCard,
    wildCandidates: wildCandidates,
    benchReactionOptions: benchReactionOptions,
    playableCards: playableCards,
    buildDeck: buildDeck,
    activeBench: activeBench,
    canSatisfy: canSatisfy,
    wildFitFor: wildFitFor,
    botAct: botAct,
    MODE_NAME: MODE_NAME,
    logMsg: logMsg,
    mulberry32: mulberry32
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = global.ChemGame;
})(typeof window !== 'undefined' ? window : globalThis);

