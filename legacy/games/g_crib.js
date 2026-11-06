function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
(function () {
  var WIN = 121,
    OPP = "OLD TOM";
  var val = function val(c) {
    return Math.min(10, c.r);
  };
  var shuffle = function shuffle(a) {
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var _ref = [a[j], a[i]];
      a[i] = _ref[0];
      a[j] = _ref[1];
    }
    return a;
  };
  var nm = function nm(c) {
    return G.rankTxt(c.r) + G.SUIT[c.s];
  };
  function count(hand, st, crib) {
    var all = st ? hand.concat([st]) : hand.slice(),
      items = [];
    var total = 0;
    var add = function add(l, p) {
      items.push([l, p]);
      total += p;
    };
    var f = 0;
    var n = all.length;
    for (var m = 1; m < 1 << n; m++) {
      var sum = 0;
      for (var i = 0; i < n; i++) if (m & 1 << i) sum += val(all[i]);
      if (sum === 15) f++;
    }
    for (var _i = 0; _i < f; _i++) add("Fifteen ".concat(total + 2), 2);
    var byR = {};
    all.forEach(function (c) {
      return byR[c.r] = (byR[c.r] || 0) + 1;
    });
    Object.keys(byR).forEach(function (r) {
      var k = byR[r];
      if (k === 2) add("Pair of ".concat(G.rankTxt(+r), "s"), 2);
      if (k === 3) add("Three ".concat(G.rankTxt(+r), "s"), 6);
      if (k === 4) add("Four ".concat(G.rankTxt(+r), "s!"), 12);
    });
    for (var lo = 1; lo <= 13; lo++) {
      if (!byR[lo] || byR[lo - 1]) continue;
      var len = 0,
        mult = 1;
      while (byR[lo + len]) {
        mult *= byR[lo + len];
        len++;
      }
      if (len >= 3) for (var _i2 = 0; _i2 < mult; _i2++) add("Run of ".concat(len), len);
    }
    var s0 = hand[0].s;
    if (hand.every(function (c) {
      return c.s === s0;
    })) {
      if (st && st.s === s0) add("Flush of 5", 5);else if (!crib) add("Flush", 4);
    }
    if (st && hand.some(function (c) {
      return c.r === 11 && c.s === st.s;
    })) add("His nobs", 1);
    return {
      total: total,
      items: items
    };
  }
  function pegPts(seq, cnt) {
    var out = [];
    if (cnt === 15) out.push(["Fifteen", 2]);
    if (cnt === 31) out.push(["Thirty-one", 2]);
    var k = 1;
    while (k < seq.length && seq[seq.length - 1 - k].r === seq[seq.length - 1].r) k++;
    if (k >= 2) out.push([k === 2 ? "Pair" : k === 3 ? "Three of a kind" : "Four of a kind", k === 2 ? 2 : k === 3 ? 6 : 12]);
    var _loop = function _loop() {
      var t = seq.slice(-L).map(function (c) {
        return c.r;
      }).sort(function (a, b) {
        return a - b;
      });
      if (t.every(function (r, i) {
        return i === 0 || r === t[i - 1] + 1;
      })) {
        out.push(["Run of ".concat(L), L]);
        return 1;
      }
    };
    for (var L = seq.length; L >= 3; L--) {
      if (_loop()) break;
    }
    return out;
  }
  defGame({
    key: "crib",
    name: "Dawg Cribbage",
    icon: "🎯",
    max: 500,
    cat: "den",
    blurb: "Cribbage vs Old Tom the cat. First to 121.",
    how: "Two-player cribbage against Old Tom. Tap 2 cards to send to the crib, then TO CRIB. Then peg: take turns playing cards without going over 31 (15 and 31 = 2, pairs, runs, last card = 1). If you can't play, it's a Go. Then hands and the crib are counted for you, step by step. First to 121 wins; win before Tom reaches 91 for a skunk. Score: win = 100 + what you win by (+100 for a skunk).",
    save: function save(G) {
      var s = G.s;
      if (s.phase === "cutdeal" || s.phase === "over" || s.phase === "cut" || s.phase === "pegdone") return null;
      var v = JSON.parse(JSON.stringify(Object.assign({}, s, {
        btns: [],
        pops: [],
        sel: []
      })));
      return {
        label: "You ".concat(s.score[0], " \xB7 Tom ").concat(s.score[1]),
        v: v
      };
    },
    load: function load(G, sv) {
      var s = G.s;
      if (!sv.v) {
        s.score = sv.score.slice();
        s.back = sv.score.slice();
        s.dealer = 1 - sv.dealer;
        s.hand = sv.hand - 1;
        return this.deal(G);
      }
      Object.assign(s, sv.v);
      s.sel = [];
      s.pops = [];
      s.wait = 0.6;
      s.clearPile = false;
      if (s.show) s.show.rev = s.show.items.length;
    },
    reset: function reset(G) {
      G.s = {
        score: [0, 0],
        back: [0, 0],
        dealer: 0,
        pops: [],
        btns: [],
        hand: 0,
        sel: [],
        crib: [],
        hands: [[], []]
      };
      this.cutForDeal(G);
    },
    cutForDeal: function cutForDeal(G) {
      var s = G.s,
        d = [];
      for (var su = 0; su < 4; su++) for (var r = 1; r <= 13; r++) d.push({
        r: r,
        s: su
      });
      shuffle(d);
      s.spread = d.slice(0, 18);
      s.picks = [null, null];
      s.phase = "cutdeal";
      s.wait = 0;
      s.msg = "Cut for deal: pick a card. Low card deals.";
    },
    pickCut: function pickCut(G, i) {
      var s = G.s;
      if (s.picks[0] || !s.spread[i]) return;
      s.picks[0] = s.spread[i];
      s.spread[i] = null;
      G.sfx("pop");
      var left = s.spread.map(function (c, k) {
          return c ? k : -1;
        }).filter(function (k) {
          return k >= 0;
        }),
        j = left[Math.floor(Math.random() * left.length)];
      s.picks[1] = s.spread[j];
      s.spread[j] = null;
      s.wait = 2.2;
      var a = s.picks[0].r,
        b = s.picks[1].r;
      s.msg = a === b ? "Tie! Cut again." : a < b ? "You cut low. Your deal (and your crib)!" : "Tom cut low. Tom deals.";
    },
    deal: function deal(G) {
      var s = G.s;
      s.dealer = 1 - s.dealer;
      s.hand++;
      var d = [];
      for (var su = 0; su < 4; su++) for (var r = 1; r <= 13; r++) d.push({
        r: r,
        s: su
      });
      shuffle(d);
      s.deck = d;
      s.hands = [d.slice(0, 6), d.slice(6, 12)];
      s.sel = [];
      s.crib = [];
      s.starter = null;
      s.show = null;
      s.hands[0].sort(function (a, b) {
        return a.r - b.r || a.s - b.s;
      });
      s.phase = "discard";
      s.wait = 0;
      s.msg = s.dealer === 0 ? "Your crib. Pick 2 cards to keep for yourself." : "Tom's crib. Pick 2 cards to give away.";
      this.cpuDiscard(G);
    },
    cpuDiscard: function cpuDiscard(G) {
      var s = G.s,
        h = s.hands[1],
        mine = s.dealer === 1,
        rest = s.deck.slice(12);
      var best = null,
        bv = -1e9;
      var _loop2 = function _loop2(i) {
        var _loop3 = function _loop3(j) {
          var keep = h.filter(function (_, k) {
              return k !== i && k !== j;
            }),
            toss = [h[i], h[j]];
          var ev = 0;
          for (var k = 0; k < rest.length; k += 2) ev += count(keep, rest[k], false).total;
          ev /= Math.ceil(rest.length / 2);
          var cv = (val(toss[0]) + val(toss[1]) === 15 ? 2 : 0) + (toss[0].r === toss[1].r ? 2 : 0) + toss.filter(function (c) {
            return c.r === 5;
          }).length * 1.5 + (Math.abs(toss[0].r - toss[1].r) === 1 ? 0.6 : 0);
          var v = ev + (mine ? cv : -cv);
          if (v > bv) {
            bv = v;
            best = {
              keep: keep,
              toss: toss
            };
          }
        };
        for (var j = i + 1; j < 6; j++) {
          _loop3(j);
        }
      };
      for (var i = 0; i < 6; i++) {
        _loop2(i);
      }
      s.cpuToss = best.toss;
      s.cpuKeep = best.keep;
    },
    toCrib: function toCrib(G) {
      var s = G.s;
      if (s.sel.length !== 2) return;
      s.crib = s.sel.slice().concat(s.cpuToss);
      s.hands[0] = s.hands[0].filter(function (c) {
        return !s.sel.includes(c);
      });
      s.hands[1] = s.cpuKeep;
      s.sel = [];
      G.sfx("pop");
      s.starter = s.deck[12 + Math.floor(Math.random() * 40)];
      s.phase = "cut";
      s.wait = 1.2;
      s.msg = "Cut: ".concat(nm(s.starter));
      if (s.starter.r === 11) {
        this.peg(G, s.dealer, 2, "His heels");
      }
    },
    peg: function peg(G, p, pts, why) {
      var s = G.s;
      if (!pts || s.phase === "over") return;
      s.back[p] = s.score[p];
      s.score[p] = Math.min(WIN, s.score[p] + pts);
      s.pops.push({
        p: p,
        txt: "".concat(why, " +").concat(pts),
        t: 1.6
      });
      G.sfx(p === 0 ? "win" : "pop");
      if (s.score[p] >= WIN) this.finish(G, p);
    },
    finish: function finish(G, p) {
      var s = G.s;
      s.phase = "over";
      s.wait = 2.2;
      s.winner = p;
      var o = s.score[1 - p];
      s.skunk = o < 61 ? 2 : o < 91 ? 1 : 0;
    },
    startPeg: function startPeg(G) {
      var s = G.s;
      s.phase = "peg";
      s.cnt = 0;
      s.seq = [];
      s.pile = [];
      s.played = [[], []];
      s.left = [s.hands[0].slice(), s.hands[1].slice()];
      s.turn = 1 - s.dealer;
      s.goSaid = [false, false];
      s.last = -1;
      s.wait = 0.8;
      s.msg = s.turn === 0 ? "You lead." : "".concat(OPP, " leads.");
      s.left[0].sort(function (a, b) {
        return a.r - b.r;
      });
    },
    canPlay: function canPlay(G, p) {
      var s = G.s;
      return s.left[p].some(function (c) {
        return s.cnt + val(c) <= 31;
      });
    },
    playPeg: function playPeg(G, p, c) {
      var _this = this;
      var s = G.s;
      s.left[p].splice(s.left[p].indexOf(c), 1);
      s.cnt += val(c);
      s.seq.push(c);
      s.pile.push({
        c: c,
        p: p,
        a: 0
      });
      s.last = p;
      pegPts(s.seq, s.cnt).forEach(function (_ref2) {
        var _ref3 = _slicedToArray(_ref2, 2),
          l = _ref3[0],
          v = _ref3[1];
        return _this.peg(G, p, v, l);
      });
      if (s.phase === "over") return;
      G.sfx("pop");
      if (s.cnt === 31) return this.resetCount(G, p, true);
      this.advance(G, 1 - p);
    },
    advance: function advance(G, nx) {
      var s = G.s;
      if (!s.left[0].length && !s.left[1].length) {
        if (s.cnt !== 31) this.peg(G, s.last, 1, "Last card");
        if (s.phase === "over") return;
        s.phase = "pegdone";
        s.wait = 1.4;
        return;
      }
      if (this.canPlay(G, nx)) {
        s.turn = nx;
        s.wait = nx === 1 ? 0.9 : 0;
        return;
      }
      if (this.canPlay(G, 1 - nx)) {
        s.pops.push({
          p: nx,
          txt: "Go",
          t: 1
        });
        s.turn = 1 - nx;
        s.wait = 0.9;
        return;
      }
      this.peg(G, s.last, 1, "Go");
      if (s.phase === "over") return;
      this.resetCount(G, s.last, false);
    },
    resetCount: function resetCount(G, p, was31) {
      var s = G.s;
      s.cnt = 0;
      s.seq = [];
      s.wait = 1.0;
      s.clearPile = true;
      var nx = 1 - p;
      if (!s.left[0].length && !s.left[1].length) {
        s.phase = "pegdone";
        s.wait = 1.4;
        return;
      }
      s.turn = s.left[nx].length ? nx : p;
    },
    cpuPeg: function cpuPeg(G) {
      var s = G.s,
        opts = s.left[1].filter(function (c) {
          return s.cnt + val(c) <= 31;
        });
      var best = null,
        bv = -1e9;
      opts.forEach(function (c) {
        var cnt = s.cnt + val(c);
        var v = pegPts(s.seq.concat([c]), cnt).reduce(function (a, b) {
          return a + b[1];
        }, 0) * 10;
        if (cnt === 5 || cnt === 21) v -= 4;
        if (cnt < 15 && cnt + 10 === 15) v -= 3;
        if (s.cnt === 0 && c.r === 5) v -= 5;
        v -= val(c) * 0.15;
        if (v > bv) {
          bv = v;
          best = c;
        }
      });
      this.playPeg(G, 1, best);
    },
    startShow: function startShow(G) {
      var s = G.s,
        nd = 1 - s.dealer;
      s.steps = [{
        who: nd,
        cards: s.hands[nd],
        crib: false
      }, {
        who: s.dealer,
        cards: s.hands[s.dealer],
        crib: false
      }, {
        who: s.dealer,
        cards: s.crib,
        crib: true
      }];
      s.phase = "show";
      s.step = 0;
      this.showStep(G);
    },
    showStep: function showStep(G) {
      var s = G.s,
        st = s.steps[s.step],
        r = count(st.cards, s.starter, st.crib);
      s.show = {
        who: st.who,
        cards: st.cards,
        crib: st.crib,
        items: r.items,
        total: r.total,
        rev: 0,
        revT: 0.5
      };
      s.wait = 0.2;
    },
    nextShow: function nextShow(G) {
      var s = G.s,
        sh = s.show;
      this.peg(G, sh.who, sh.total, sh.crib ? "Crib" : "Hand");
      if (s.phase === "over") return;
      s.step++;
      if (s.step < 3) this.showStep(G);else {
        s.show = null;
        this.deal(G);
      }
    },
    update: function update(G, dt) {
      var s = G.s;
      s.pops.forEach(function (q) {
        return q.t -= dt;
      });
      s.pops = s.pops.filter(function (q) {
        return q.t > 0;
      });
      (s.pile || []).forEach(function (q) {
        return q.a = Math.min(1, q.a + dt * 4);
      });
      if (s.show && s.show.rev < s.show.items.length) {
        s.show.revT -= dt;
        if (s.show.revT <= 0) {
          s.show.rev++;
          s.show.revT = 0.55;
          G.sfx("pop");
        }
      }
      if (s.wait > 0) {
        s.wait -= dt;
        if (s.wait > 0) return;
      }
      if (s.phase === "over") {
        var p = s.winner,
          m = s.score[p] - s.score[1 - p];
        G.over(p === 0 ? Math.min(500, 100 + m + 100 * s.skunk) : Math.floor(s.score[0] / 2), p === 0 ? s.skunk === 2 ? "DOUBLE SKUNK! 🦨🦨" : s.skunk ? "SKUNKED HIM! 🦨" : "You win by ".concat(m, "!") : s.skunk ? "Tom skunked you. 🦨" : "Tom wins by ".concat(m, "."));
        return;
      }
      if (s.phase === "cut") return this.startPeg(G);
      if (s.phase === "cutdeal" && s.picks[1]) {
        var a = s.picks[0].r,
          b = s.picks[1].r;
        if (a === b) return this.cutForDeal(G);
        s.dealer = a < b ? 1 : 0;
        return this.deal(G);
      }
      if (s.phase === "pegdone") return this.startShow(G);
      if (s.clearPile) {
        s.clearPile = false;
        s.pile = [];
      }
      if (s.phase === "peg") {
        if (s.turn === 1) this.cpuPeg(G);else if (!this.canPlay(G, 0)) {
          s.pops.push({
            p: 0,
            txt: "Go",
            t: 1
          });
          this.advance(G, 1);
        }
      }
    },
    L: function L(G) {
      var W = G.W,
        H = G.H,
        cw = Math.min(66, (W - 24) / 4.6);
      return {
        W: W,
        H: H,
        cw: cw,
        ch: cw * 1.4,
        hy: H - cw * 0.7 - 14,
        cy: H * 0.5
      };
    },
    handPos: function handPos(G) {
      var s = G.s,
        L = this.L(G),
        h = s.phase === "discard" ? s.hands[0] : s.phase === "peg" || s.phase === "pegdone" ? s.left[0] : s.hands[0],
        n = h.length;
      var gap = Math.min(L.cw * 1.02, (L.W - 20 - L.cw) / Math.max(1, n - 1)),
        x0 = L.W / 2 - gap * (n - 1) / 2;
      return h.map(function (c, i) {
        var ok = s.phase !== "peg" || s.turn === 0 && s.cnt + val(c) <= 31;
        return {
          c: c,
          x: x0 + i * gap,
          y: L.hy - (s.sel.includes(c) ? 22 : 0) - (s.phase === "peg" && s.turn === 0 && ok && !(s.wait > 0) ? 10 : 0),
          ok: ok
        };
      });
    },
    tap: function tap(G, x, y) {
      var s = G.s;
      if (s.phase === "show" && s.show && s.show.rev >= s.show.items.length && !(s.wait > 0)) {
        this.nextShow(G);
        return;
      }
      if (s.phase === "show" && s.show) {
        s.show.rev = s.show.items.length;
        return;
      }
      var b = s.btns.find(function (b) {
        return x > b.x && x < b.x + b.w && y > b.y && y < b.y + b.h;
      });
      if (b) {
        b.fn();
        return;
      }
      if (s.phase === "cutdeal") {
        var sp = this.spreadPos(G);
        for (var i = sp.length - 1; i >= 0; i--) {
          var q = sp[i];
          if (q.c && Math.abs(x - q.x) < 16 && Math.abs(y - q.y) < 34) {
            this.pickCut(G, i);
            return;
          }
        }
        return;
      }
      var L = this.L(G),
        pos = this.handPos(G);
      for (var _i3 = pos.length - 1; _i3 >= 0; _i3--) {
        var _q = pos[_i3];
        if (Math.abs(x - _q.x) > L.cw / 2 || Math.abs(y - _q.y) > L.ch / 2) continue;
        if (s.phase === "discard") {
          var k = s.sel.indexOf(_q.c);
          if (k >= 0) s.sel.splice(k, 1);else if (s.sel.length < 2) s.sel.push(_q.c);
          G.sfx("pop");
        } else if (s.phase === "peg" && s.turn === 0 && !(s.wait > 0)) {
          if (_q.ok) this.playPeg(G, 0, _q.c);else s.pops.push({
            p: 0,
            txt: "Over 31",
            t: 0.8
          });
        }
        return;
      }
    },
    board: function board(G, c, y) {
      var s = G.s,
        W = G.W,
        x0 = 16,
        x1 = W - 16,
        w = x1 - x0;
      c.fillStyle = "#8a5a2b";
      c.beginPath();
      if (c.roundRect) c.roundRect(x0 - 8, y - 6, w + 16, 52, 10);else c.rect(x0 - 8, y - 6, w + 16, 52);
      c.fill();
      c.fillStyle = "#a8743c";
      c.fillRect(x0 - 4, y - 2, w + 8, 44);
      var X = function X(v) {
        return x0 + w * v / WIN;
      };
      [[0, y + 10, "#1e88e5"], [1, y + 30, "#e53935"]].forEach(function (_ref4) {
        var _ref5 = _slicedToArray(_ref4, 3),
          p = _ref5[0],
          ty = _ref5[1],
          col = _ref5[2];
        c.fillStyle = "rgba(0,0,0,0.25)";
        for (var k = 0; k <= WIN; k += 1) if (k % 5 === 0) c.fillRect(X(k) - 0.5, ty - 4, 1, 8);else c.fillRect(X(k) - 0.5, ty - 1, 1, 2);
        var peg = function peg(v, a) {
          c.globalAlpha = a;
          c.fillStyle = col;
          c.beginPath();
          c.arc(X(v), ty, 5, 0, 7);
          c.fill();
          c.strokeStyle = "#fff";
          c.lineWidth = 1.5;
          c.stroke();
          c.globalAlpha = 1;
        };
        peg(s.back[p], 0.4);
        peg(s.score[p], 1);
      });
      c.fillStyle = "rgba(255,255,255,0.5)";
      c.fillRect(X(90) - 1, y - 2, 2, 44);
      c.fillRect(X(WIN) - 1, y - 2, 2, 44);
      G.text(c, "90", X(90), y + 50, 8, "#fff");
      G.text(c, "121", X(WIN) - 6, y + 50, 8, "#fff");
    },
    spreadPos: function spreadPos(G) {
      var s = G.s,
        n = s.spread.length,
        W = G.W,
        gap = (W - 70) / (n - 1),
        cy = G.H * 0.5;
      return s.spread.map(function (c, i) {
        return {
          c: c,
          x: 35 + i * gap,
          y: cy + Math.abs(i - (n - 1) / 2) * 3,
          rot: (i - (n - 1) / 2) * 0.03
        };
      });
    },
    btn: function btn(c, G, x, y, w, h, label, fn, hot) {
      G.s.btns.push({
        x: x,
        y: y,
        w: w,
        h: h,
        fn: fn
      });
      c.fillStyle = "rgba(0,0,0,0.3)";
      c.beginPath();
      if (c.roundRect) c.roundRect(x + 1, y + 3, w, h, 12);else c.rect(x + 1, y + 3, w, h);
      c.fill();
      c.fillStyle = hot ? "#ffd23f" : "#ccc";
      c.beginPath();
      if (c.roundRect) c.roundRect(x, y, w, h, 12);else c.rect(x, y, w, h);
      c.fill();
      c.fillStyle = "#1a1a1a";
      c.font = "800 15px system-ui, sans-serif";
      c.textAlign = "center";
      c.textBaseline = "middle";
      c.fillText(label, x + w / 2, y + h / 2 + 1);
    },
    draw: function draw(G, c) {
      var _this2 = this;
      var s = G.s,
        L = this.L(G),
        W = L.W,
        H = L.H;
      s.btns = [];
      var g = c.createRadialGradient(W / 2, H * 0.5, 30, W / 2, H * 0.5, H * 0.75);
      g.addColorStop(0, "#1f6f8b");
      g.addColorStop(1, "#0d3b4c");
      c.fillStyle = g;
      c.fillRect(0, 0, W, H);
      var cutting = s.phase === "cutdeal";
      G.hud(c, "YOU ".concat(s.score[0]), cutting ? "CUT FOR DEAL" : "HAND ".concat(s.hand), "TOM ".concat(s.score[1]));
      this.board(G, c, 44);
      var ty = 150;
      G.emoji(c, "😼", 44, ty, 40);
      G.text(c, OPP, 44, ty + 30, 9, "#fff");
      var oc = cutting ? 0 : s.phase === "peg" || s.phase === "pegdone" ? s.left[1].length : s.phase === "discard" ? 6 : 4;
      for (var i = 0; i < oc; i++) G.card(c, 96 + i * 16, ty, 30, null, false, {
        rot: (i - oc / 2) * 0.05
      });
      if (s.dealer === 1 && !cutting) {
        c.fillStyle = "#fff";
        c.beginPath();
        c.arc(66, ty - 18, 9, 0, 7);
        c.fill();
        G.text(c, "D", 66, ty - 17, 8, "#222");
      }
      var sx = W - 46,
        sy = ty;
      if (!cutting) {
        if (s.starter) G.card(c, sx, sy, 40, s.starter, true);else G.card(c, sx, sy, 40, null, false);
        G.text(c, "CUT", sx, sy + 36, 8, "#fff");
      }
      if (s.crib.length && s.phase !== "show") {
        for (var _i4 = 0; _i4 < 4; _i4++) G.card(c, sx - 54 + _i4 * 3, sy, 40, null, false);
        G.text(c, s.dealer === 0 ? "YOUR CRIB" : "TOM'S CRIB", sx - 50, sy + 36, 8, "#fff");
      }
      if (s.phase === "peg" || s.phase === "pegdone") {
        var pile = s.pile || [],
          n = pile.length,
          gap = Math.min(34, (W - 90) / Math.max(1, n));
        pile.forEach(function (q, i) {
          var tx = W / 2 - gap * (n - 1) / 2 + i * gap,
            fy = q.p === 0 ? L.hy : ty,
            e = 1 - Math.pow(1 - q.a, 3);
          G.card(c, tx, fy + (L.cy - fy) * e + (q.p === 0 ? 8 : -8), 52, q.c, true);
        });
        c.fillStyle = "rgba(0,0,0,0.45)";
        c.beginPath();
        c.arc(W / 2, L.cy - 70, 26, 0, 7);
        c.fill();
        G.text(c, String(s.cnt), W / 2, L.cy - 72, 18, s.cnt === 15 || s.cnt === 31 ? "#ffd23f" : "#fff");
        G.text(c, "COUNT", W / 2, L.cy - 54, 7, "#ccc");
      }
      if (s.phase === "cutdeal") {
        this.spreadPos(G).forEach(function (q) {
          if (q.c) G.card(c, q.x, q.y, 44, null, false, {
            rot: q.rot
          });
        });
        if (!s.picks[0]) G.text(c, "TAP A CARD", W / 2, H * 0.5 + 56, 11, Math.floor(G.t * 2.5) % 2 ? "#fff" : "#ffd23f");
        if (s.picks[0]) {
          G.card(c, W / 2 - 60, H * 0.72, 64, s.picks[0], true, {
            hl: s.picks[1] && s.picks[0].r < s.picks[1].r
          });
          G.text(c, "YOU", W / 2 - 60, H * 0.72 + 58, 10, "#fff");
        }
        if (s.picks[1]) {
          G.card(c, W / 2 + 60, H * 0.72, 64, s.picks[1], true, {
            hl: s.picks[1].r < s.picks[0].r
          });
          G.text(c, "TOM", W / 2 + 60, H * 0.72 + 58, 10, "#fff");
        }
      }
      if (s.phase !== "show" && s.phase !== "cutdeal") this.handPos(G).forEach(function (q, i) {
        return G.card(c, q.x, q.y, L.cw, q.c, true, {
          dim: !q.ok && s.phase === "peg",
          hl: s.sel.includes(q.c)
        });
      });
      if (s.dealer === 0 && !cutting) {
        c.fillStyle = "#fff";
        c.beginPath();
        c.arc(20, L.hy - L.ch / 2 - 14, 9, 0, 7);
        c.fill();
        G.text(c, "D", 20, L.hy - L.ch / 2 - 13, 8, "#222");
      }
      if (s.phase === "discard") this.btn(c, G, W / 2 - 80, L.hy - L.ch / 2 - 80, 160, 46, s.sel.length === 2 ? s.dealer === 0 ? "TO MY CRIB" : "TO TOM'S CRIB" : "PICK ".concat(2 - s.sel.length, " MORE"), function () {
        return _this2.toCrib(G);
      }, s.sel.length === 2);
      if (s.show) {
        var sh = s.show,
          py = 214,
          ph = H - py - 20;
        c.fillStyle = "rgba(0,0,0,0.55)";
        c.beginPath();
        if (c.roundRect) c.roundRect(12, py, W - 24, ph, 16);else c.rect(12, py, W - 24, ph);
        c.fill();
        G.text(c, (sh.who === 0 ? "YOUR " : "TOM'S ") + (sh.crib ? "CRIB" : "HAND"), W / 2, py + 18, 12, "#ffd23f");
        var cw = Math.min(54, (W - 60) / 5.4);
        sh.cards.concat([s.starter]).forEach(function (cd, i) {
          return G.card(c, W / 2 - cw * 2.3 + i * cw * 1.15 + (i === 4 ? 8 : 0), py + 40 + cw * 0.7, cw, cd, true, {
            hl: i === 4
          });
        });
        var ly = py + 60 + cw * 1.4;
        sh.items.slice(0, sh.rev).forEach(function (_ref6, i) {
          var _ref7 = _slicedToArray(_ref6, 2),
            l = _ref7[0],
            p = _ref7[1];
          c.fillStyle = "#fff";
          c.font = "600 15px system-ui, sans-serif";
          c.textAlign = "left";
          c.fillText(l, 32, ly + i * 22);
          c.textAlign = "right";
          c.fillStyle = "#ffd23f";
          c.fillText("+" + p, W - 32, ly + i * 22);
        });
        if (!sh.items.length) G.text(c, "NINETEEN (NOTHING)", W / 2, ly + 6, 11, "#ccc");
        if (sh.rev >= sh.items.length) {
          G.banner(c, "".concat(sh.total, " POINT").concat(sh.total === 1 ? "" : "S"), sh.who === 0 ? "#7cff6b" : "#ff8a80", py + ph - 52, 22);
          G.text(c, "TAP TO CONTINUE", W / 2, py + ph - 18, 10, Math.floor(G.t * 2.5) % 2 ? "#fff" : "#ffd23f");
        }
      }
      c.fillStyle = "rgba(0,0,0,0.35)";
      c.fillRect(0, 186, W, 22);
      c.fillStyle = "#fff";
      c.font = "600 12.5px system-ui, sans-serif";
      c.textAlign = "center";
      c.textBaseline = "middle";
      c.fillText(s.phase === "peg" ? s.turn === 0 ? "Your play" : "".concat(OPP, " is thinking\u2026") : s.phase === "show" ? "Counting" : s.msg, W / 2, 197);
      s.pops.forEach(function (q, i) {
        var yy = q.p === 0 ? L.hy - L.ch / 2 - 40 - i * 18 : ty + 46 + i * 18;
        G.text(c, q.txt, q.p === 0 ? W / 2 : 140, yy - (1.6 - q.t) * 10, 12, q.p === 0 ? "#7cff6b" : "#ff8a80");
      });
    }
  });
})();