function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
(function () {
  var NAMES = ["YOU", "WHISKERS", "BISCUIT", "MITTENS"];
  var team = function team(p) {
    return p % 2;
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
  var es = function es(c, tr) {
    return c.r === 11 && c.s === 3 - tr ? tr : c.s;
  };
  var pow = function pow(c, tr, led) {
    return es(c, tr) === tr ? c.r === 11 && c.s === tr ? 100 : c.r === 11 ? 99 : 50 + c.r : es(c, tr) === led ? c.r : 0;
  };
  var legal = function legal(h, tr, led) {
    if (led == null) return h.slice();
    var f = h.filter(function (c) {
      return es(c, tr) === led;
    });
    return f.length ? f : h.slice();
  };
  var keep = function keep(c) {
    return (c.r === 11 ? 0.5 : 0) + c.r;
  };
  function strength(h, tr) {
    var v = 0,
      nt = 0;
    var suits = new Set();
    h.forEach(function (c) {
      if (es(c, tr) === tr) {
        nt++;
        v += c.r === 11 ? c.s === tr ? 3.2 : 2.6 : {
          14: 2.2,
          13: 1.9,
          12: 1.7,
          10: 1.5,
          9: 1.4
        }[c.r];
      } else {
        suits.add(c.s);
        v += c.r === 14 ? 1 : c.r === 13 ? 0.3 : 0;
      }
    });
    if (nt >= 2) v += (3 - suits.size) * 0.4;
    return v;
  }
  function sortHand(h, tr) {
    var order = tr == null ? [0, 1, 3, 2] : [tr, (tr + 1) % 4, (tr + 3) % 4, (tr + 2) % 4];
    h.sort(function (a, b) {
      var sa = order.indexOf(tr == null ? a.s : es(a, tr)),
        sb = order.indexOf(tr == null ? b.s : es(b, tr));
      return sa - sb || (tr == null ? b.r - a.r : pow(b, tr, es(b, tr)) - pow(a, tr, es(a, tr)));
    });
  }
  defGame({
    key: "euchre",
    name: "Dawg Euchre",
    icon: "🃏",
    max: 300,
    cat: "den",
    blurb: "You + Biscuit vs the cats. First to 10.",
    how: "Classic euchre with you and your partner Biscuit (top) against two cats. Round 1: order up the turned card for trump, or pass. Round 2: name a different suit (the dealer has to call: stick the dealer). Tap ALONE to play without your partner for 4 points. Follow suit if you can; the jack of trump (right bower) and the other jack of the same color (left bower) are the top trumps. 3-4 tricks = 1 point, all 5 = 2, euchred = 2 for the other team. First to 10. Score: win = 100 + 10 for every point you win by.",
    save: function save(G) {
      var s = G.s;
      if (s.phase === "jacks" || s.phase === "trickEnd" || s.phase === "handEnd") return null;
      var v = JSON.parse(JSON.stringify(Object.assign({}, s, {
        btns: [],
        say: [null, null, null, null],
        gone: []
      })));
      return {
        label: "".concat(s.score[0], "\u2013").concat(s.score[1], ", hand ").concat(s.hand),
        v: v
      };
    },
    load: function load(G, sv) {
      if (!sv.v) {
        var s = G.s;
        s.score = sv.score.slice();
        s.dealer = (sv.dealer + 3) % 4;
        s.hand = sv.hand - 1;
        return this.deal(G);
      }
      Object.assign(G.s, sv.v);
      G.s.wait = 0.6;
      G.s.jpiles = null;
      G.s.msg = "Welcome back. " + (G.s.msg || "");
    },
    reset: function reset(G) {
      G.s = {
        score: [0, 0],
        dealer: 0,
        say: [null, null, null, null],
        btns: [],
        msg: "",
        t: 0,
        hands: [[], [], [], []],
        trick: [],
        gone: [],
        hand: 0,
        tricks: [0, 0]
      };
      this.jacks(G);
    },
    jacks: function jacks(G) {
      var s = G.s,
        d = [];
      for (var su = 0; su < 4; su++) for (var r = 9; r <= 14; r++) d.push({
        r: r,
        s: su
      });
      shuffle(d);
      s.phase = "jacks";
      s.jdeck = d;
      s.jpiles = [[], [], [], []];
      s.jto = Math.floor(Math.random() * 4);
      s.jwho = -1;
      s.wait = 0.6;
      s.msg = "Dealing for deal: first black jack deals.";
    },
    jackStep: function jackStep(G) {
      var s = G.s,
        c = s.jdeck.pop();
      s.jpiles[s.jto].push({
        c: c,
        a: 0
      });
      G.sfx("pop");
      if (c.r === 11 && (c.s === 0 || c.s === 3)) {
        s.jwho = s.jto;
        s.wait = 2.4;
        this.sayAt(G, s.jto, "Black jack!");
        s.msg = s.jto === 0 ? "You got the black jack. You deal first!" : "".concat(NAMES[s.jto], " got the black jack and deals first.");
        return;
      }
      s.jto = (s.jto + 1) % 4;
      s.wait = 0.38;
    },
    deal: function deal(G) {
      var s = G.s;
      s.dealer = (s.dealer + 1) % 4;
      s.hand++;
      s.jpiles = null;
      s.jwho = -1;
      var deck = [];
      for (var su = 0; su < 4; su++) for (var r = 9; r <= 14; r++) deck.push({
        r: r,
        s: su
      });
      shuffle(deck);
      s.hands = [0, 1, 2, 3].map(function (i) {
        return deck.slice(i * 5, i * 5 + 5);
      });
      s.up = deck[20];
      s.trump = null;
      s.maker = -1;
      s.alone = -1;
      s.tricks = [0, 0];
      s.trick = [];
      s.led = null;
      s.passes = 0;
      s.aloneTog = false;
      sortHand(s.hands[0], null);
      s.phase = "bid1";
      s.turn = (s.dealer + 1) % 4;
      s.wait = 1.0;
      s.msg = "".concat(s.dealer === 0 ? "You deal" : NAMES[s.dealer] + " deals", ". Turned up: ").concat(G.rankTxt(s.up.r)).concat(G.SUIT[s.up.s]);
    },
    sayAt: function sayAt(G, p, txt) {
      G.s.say[p] = {
        txt: txt,
        t: 1.6
      };
    },
    next: function next(G, p) {
      var s = G.s;
      var n = (p + 1) % 4;
      if (s.alone >= 0 && n === (s.alone + 2) % 4) n = (n + 1) % 4;
      return n;
    },
    bid: function bid(G, p, act, suit, alone) {
      var s = G.s;
      if (act === "pass") {
        this.sayAt(G, p, "Pass");
        s.passes++;
        if (s.phase === "bid1" && s.passes === 4) {
          s.phase = "bid2";
          s.passes = 0;
          s.turn = (s.dealer + 1) % 4;
          s.msg = "Turned down. Name a suit other than ".concat(G.SUIT[s.up.s], ".");
        } else s.turn = (p + 1) % 4;
        s.wait = 0.8;
        return;
      }
      s.trump = act === "order" ? s.up.s : suit;
      s.maker = p;
      s.alone = alone ? p : -1;
      this.sayAt(G, p, (act === "order" ? p === s.dealer ? "Picking it up" : "Order it up!" : "".concat(G.SUIT[suit], " trump")) + (alone ? " — ALONE!" : ""));
      G.sfx("pop");
      if (act === "order") {
        s.hands[s.dealer].push(s.up);
        if (s.dealer === 0 && s.alone !== 2) {
          s.phase = "discard";
          sortHand(s.hands[0], s.trump);
          s.msg = "Tap a card to discard.";
          return;
        }
        if (s.alone === (s.dealer + 2) % 4) s.hands[s.dealer].pop();else this.cpuDiscard(G, s.dealer);
      }
      this.startPlay(G);
    },
    cpuDiscard: function cpuDiscard(G, p) {
      var s = G.s,
        h = s.hands[p],
        tr = s.trump;
      var off = h.filter(function (c) {
        return es(c, tr) !== tr && c.r !== 14;
      });
      var pool = off.length ? off : h;
      pool.sort(function (a, b) {
        var ca = h.filter(function (c) {
            return es(c, tr) === es(a, tr);
          }).length,
          cb = h.filter(function (c) {
            return es(c, tr) === es(b, tr);
          }).length;
        return ca - cb || pow(a, tr, es(a, tr)) - pow(b, tr, es(b, tr));
      });
      h.splice(h.indexOf(pool[0]), 1);
    },
    startPlay: function startPlay(G) {
      var s = G.s;
      sortHand(s.hands[0], s.trump);
      s.phase = "play";
      s.trick = [];
      s.led = null;
      s.turn = this.next(G, s.dealer);
      s.wait = 1.1;
      var who = s.maker === 0 ? "You" : NAMES[s.maker][0] + NAMES[s.maker].slice(1).toLowerCase();
      s.msg = "".concat(who, " called ").concat(G.SUIT[s.trump]).concat(s.alone >= 0 ? " and went ALONE" : "", ".");
    },
    cpuBid: function cpuBid(G, p) {
      var s = G.s;
      if (s.phase === "bid1") {
        var v = strength(s.hands[p], s.up.s),
          uv = strength([s.up], s.up.s);
        if (p === s.dealer) v = strength(s.hands[p].concat([s.up]).sort(function (a, b) {
          return strength([b], s.up.s) - strength([a], s.up.s);
        }).slice(0, 5), s.up.s);else if (p === (s.dealer + 2) % 4) v += uv * 0.6;else v -= uv * 0.5;
        if (v >= 7.4) return this.bid(G, p, "order", null, v >= 11.5);
        return this.bid(G, p, "pass");
      }
      var best = -1,
        bv = -1;
      for (var su = 0; su < 4; su++) {
        if (su === s.up.s) continue;
        var _v = strength(s.hands[p], su);
        if (_v > bv) {
          bv = _v;
          best = su;
        }
      }
      if (bv >= 7 || p === s.dealer) return this.bid(G, p, "call", best, bv >= 11.5);
      this.bid(G, p, "pass");
    },
    winner: function winner(G) {
      var s = G.s;
      var b = s.trick[0];
      s.trick.forEach(function (t) {
        if (pow(t.c, s.trump, s.led) > pow(b.c, s.trump, s.led)) b = t;
      });
      return b;
    },
    play: function play(G, p, card) {
      var s = G.s,
        h = s.hands[p];
      h.splice(h.indexOf(card), 1);
      if (!s.trick.length) s.led = es(card, s.trump);
      s.trick.push({
        p: p,
        c: card,
        a: 0
      });
      G.sfx("pop");
      var need = s.alone >= 0 ? 3 : 4;
      if (s.trick.length === need) {
        var w = this.winner(G);
        s.win = w.p;
        s.phase = "trickEnd";
        s.wait = 1.3;
      } else {
        s.turn = this.next(G, p);
        s.wait = 0.7;
      }
    },
    cpuPlay: function cpuPlay(G, p) {
      var s = G.s,
        tr = s.trump,
        h = s.hands[p],
        L = legal(h, tr, s.led);
      var low = function low(arr) {
        return arr.slice().sort(function (a, b) {
          return (es(a, tr) === tr) - (es(b, tr) === tr) || pow(a, tr, es(a, tr)) - pow(b, tr, es(b, tr));
        })[0];
      };
      if (!s.trick.length) {
        var trumps = L.filter(function (c) {
          return es(c, tr) === tr;
        }).sort(function (a, b) {
          return pow(b, tr, tr) - pow(a, tr, tr);
        });
        if (team(p) === team(s.maker) && trumps.length && (pow(trumps[0], tr, tr) === 100 || trumps.length >= 2)) return this.play(G, p, trumps[0]);
        var aces = L.filter(function (c) {
          return es(c, tr) !== tr && c.r === 14;
        });
        if (aces.length) return this.play(G, p, aces[0]);
        return this.play(G, p, low(L));
      }
      var w = this.winner(G),
        wp = pow(w.c, tr, s.led),
        last = s.trick.length === (s.alone >= 0 ? 2 : 3);
      if (team(w.p) === team(p) && (wp >= 99 || last || wp >= 64)) return this.play(G, p, low(L));
      var beats = L.filter(function (c) {
        return pow(c, tr, s.led) > wp;
      }).sort(function (a, b) {
        return pow(a, tr, s.led) - pow(b, tr, s.led);
      });
      if (beats.length) return this.play(G, p, beats[0]);
      this.play(G, p, low(L));
    },
    endTrick: function endTrick(G) {
      var s = G.s;
      s.tricks[team(s.win)]++;
      s.gone = s.trick.map(function (t) {
        return {
          c: t.c,
          p: t.p,
          to: s.win
        };
      });
      s.goneT = 0.45;
      s.trick = [];
      s.led = null;
      if (s.tricks[0] + s.tricks[1] === 5) return this.scoreHand(G);
      s.phase = "play";
      s.turn = s.win;
      s.wait = 0.6;
    },
    scoreHand: function scoreHand(G) {
      var s = G.s,
        mt = team(s.maker),
        mk = s.tricks[mt];
      var pts, t;
      if (mk >= 3) {
        pts = mk === 5 ? s.alone >= 0 ? 4 : 2 : 1;
        s.score[mt] += pts;
        t = mk === 5 ? s.alone >= 0 ? "LONER! +4" : "MARCH! +2" : "+1";
      } else {
        pts = 2;
        s.score[1 - mt] += 2;
        t = "EUCHRED! +2";
      }
      var us = mk >= 3 === (mt === 0);
      s.handMsg = {
        t: t,
        us: us,
        tricks: s.tricks.slice()
      };
      G.sfx(us ? "win" : "lose");
      s.phase = "handEnd";
      s.wait = 2.6;
    },
    afterHand: function afterHand(G) {
      var s = G.s;
      if (s.score[0] >= 10 || s.score[1] >= 10) {
        var won = s.score[0] >= 10,
          sc = won ? 100 + 10 * (s.score[0] - s.score[1]) : 5 * s.score[0];
        G.over(Math.min(300, sc), won ? "You win ".concat(s.score[0], "\u2013").concat(s.score[1], "! Good dawgs.") : "The cats win ".concat(s.score[1], "\u2013").concat(s.score[0], "."));
        return;
      }
      this.deal(G);
    },
    update: function update(G, dt) {
      var s = G.s;
      s.t += dt;
      s.say.forEach(function (b, i) {
        if (b) {
          b.t -= dt;
          if (b.t <= 0) s.say[i] = null;
        }
      });
      s.trick.forEach(function (t) {
        return t.a = Math.min(1, t.a + dt * 4);
      });
      if (s.jpiles) s.jpiles.forEach(function (p) {
        return p.forEach(function (q) {
          return q.a = Math.min(1, q.a + dt * 5);
        });
      });
      if (s.goneT > 0) {
        s.goneT -= dt;
        if (s.goneT <= 0) s.gone = [];
      }
      if (s.wait > 0) {
        s.wait -= dt;
        if (s.wait > 0) return;
      }
      if (s.phase === "jacks") {
        if (s.jwho >= 0) {
          s.dealer = (s.jwho + 3) % 4;
          s.jpiles = null;
          return this.deal(G);
        }
        return this.jackStep(G);
      }
      if (s.phase === "trickEnd") return this.endTrick(G);
      if (s.phase === "handEnd") return this.afterHand(G);
      if (s.turn === 0 || s.phase === "discard") return;
      if (s.phase === "bid1" || s.phase === "bid2") this.cpuBid(G, s.turn);else if (s.phase === "play") this.cpuPlay(G, s.turn);
    },
    L: function L(G) {
      var W = G.W,
        H = G.H,
        cw = Math.min(70, (W - 24) / 5.2);
      return {
        W: W,
        H: H,
        cw: cw,
        ch: cw * 1.4,
        hy: H - cw * 0.7 - 16,
        cx: W / 2,
        cy: H * 0.43,
        seat: [[W / 2, H - 30], [40, H * 0.43], [W / 2, 96], [W - 40, H * 0.43]]
      };
    },
    handPos: function handPos(G) {
      var s = G.s,
        L = this.L(G),
        h = s.hands[0],
        n = h.length,
        gap = Math.min(L.cw * 0.95, (L.W - 20 - L.cw) / Math.max(1, n - 1));
      var x0 = L.W / 2 - gap * (n - 1) / 2,
        ok = s.phase === "play" && s.turn === 0 && !(s.wait > 0) ? legal(h, s.trump, s.led) : null;
      return h.map(function (c, i) {
        return {
          c: c,
          x: x0 + i * gap,
          y: L.hy - (ok && ok.includes(c) ? 14 : 0),
          ok: !ok || ok.includes(c)
        };
      });
    },
    tap: function tap(G, x, y) {
      var s = G.s;
      if (s.phase === "handEnd") {
        s.wait = 0;
        return;
      }
      if (s.phase === "jacks") {
        if (s.jwho < 0) {
          while (s.jwho < 0) this.jackStep(G);
          s.jpiles.forEach(function (p) {
            return p.forEach(function (q) {
              return q.a = 1;
            });
          });
        } else s.wait = 0;
        return;
      }
      var b = s.btns.find(function (b) {
        return x > b.x && x < b.x + b.w && y > b.y && y < b.y + b.h;
      });
      if (b) {
        b.fn();
        return;
      }
      var L = this.L(G),
        pos = this.handPos(G);
      for (var i = pos.length - 1; i >= 0; i--) {
        var q = pos[i];
        if (Math.abs(x - q.x) > L.cw / 2 || Math.abs(y - q.y) > L.ch / 2) continue;
        if (s.phase === "discard") {
          s.hands[0].splice(s.hands[0].indexOf(q.c), 1);
          G.sfx("pop");
          this.startPlay(G);
          return;
        }
        if (s.phase === "play" && s.turn === 0 && !(s.wait > 0) && q.ok) {
          this.play(G, 0, q.c);
          return;
        }
        if (s.phase === "play" && s.turn === 0 && !q.ok) {
          s.msg = "You have to follow suit.";
          return;
        }
        return;
      }
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
      c.fillStyle = hot ? "#ffd23f" : "#fffdf7";
      c.beginPath();
      if (c.roundRect) c.roundRect(x, y, w, h, 12);else c.rect(x, y, w, h);
      c.fill();
      c.fillStyle = label === "♥" || label === "♦" ? "#d32f2f" : "#1a1a1a";
      c.font = "800 ".concat(label.length <= 2 ? 22 : 14, "px system-ui, sans-serif");
      c.textAlign = "center";
      c.textBaseline = "middle";
      c.fillText(label, x + w / 2, y + h / 2 + 1);
    },
    draw: function draw(G, c) {
      var _this = this;
      var s = G.s,
        L = this.L(G),
        W = L.W,
        H = L.H;
      s.btns = [];
      var g = c.createRadialGradient(W / 2, H * 0.45, 30, W / 2, H * 0.45, H * 0.75);
      g.addColorStop(0, "#2e8b57");
      g.addColorStop(1, "#14532d");
      c.fillStyle = g;
      c.fillRect(0, 0, W, H);
      c.strokeStyle = "rgba(255,255,255,0.08)";
      c.lineWidth = 2;
      c.beginPath();
      c.ellipse(W / 2, H * 0.43, W * 0.36, H * 0.2, 0, 0, 7);
      c.stroke();
      [1, 2, 3].forEach(function (p) {
        var _L$seat$p = _slicedToArray(L.seat[p], 2),
          x = _L$seat$p[0],
          y = _L$seat$p[1],
          out = s.alone >= 0 && p === (s.alone + 2) % 4,
          turn = s.turn === p && (s.phase === "play" || s.phase.startsWith("bid"));
        c.globalAlpha = out ? 0.4 : 1;
        if (turn) {
          c.fillStyle = "rgba(255,210,63,0.35)";
          c.beginPath();
          c.arc(x, y, 30, 0, 7);
          c.fill();
        }
        if (p === 2) G.img(c, ":dawgpog:", x, y, 46);else G.emoji(c, p === 1 ? "😼" : "🐱", x, y, 40);
        G.text(c, NAMES[p], x, y + 32, 9, "#fff");
        var n = s.hands[p].length;
        for (var i = 0; i < n; i++) {
          var off = (i - (n - 1) / 2) * 7;
          if (p === 2) G.card(c, x + 40 + off, y - 4, 20, null, false);else G.card(c, x + off * 0.3, y - 44 - (p === 1 ? 0 : 0), 18, null, false, {
            rot: p === 1 ? 0.15 * (i - 2) : -0.15 * (i - 2)
          });
        }
        if (s.dealer === p && s.phase !== "jacks") {
          c.fillStyle = "#fff";
          c.beginPath();
          c.arc(x + 22, y + 16, 9, 0, 7);
          c.fill();
          G.text(c, "D", x + 22, y + 17, 8, "#222");
        }
        if (s.maker === p && s.trump != null) G.text(c, "★", x - 24, y - 18, 12, "#ffd23f");
        c.globalAlpha = 1;
        var b = s.say[p];
        if (b) {
          var _by = p === 2 ? y + 52 : y - 74,
            bw = Math.max(64, b.txt.length * 7.4 + 16),
            bx = Math.max(4, Math.min(W - bw - 4, x - bw / 2));
          c.fillStyle = "#fff";
          c.beginPath();
          if (c.roundRect) c.roundRect(bx, _by - 13, bw, 26, 13);else c.rect(bx, _by - 13, bw, 26);
          c.fill();
          c.fillStyle = "#222";
          c.font = "700 13px system-ui, sans-serif";
          c.textAlign = "center";
          c.fillText(b.txt, bx + bw / 2, _by + 1);
        }
      });
      if (s.dealer === 0 && s.phase !== "jacks") {
        c.fillStyle = "#fff";
        c.beginPath();
        c.arc(22, H - L.ch - 50, 9, 0, 7);
        c.fill();
        G.text(c, "D", 22, H - L.ch - 49, 8, "#222");
      }
      if (s.say[0]) G.text(c, s.say[0].txt, W / 2, L.hy - L.ch / 2 - 74, 11, "#ffd23f");
      var slot = [[0, 46], [-50, 0], [0, -46], [50, 0]];
      if (s.phase === "bid1") {
        G.card(c, L.cx, L.cy, 58, s.up, true);
        G.text(c, "ORDER IT UP?", L.cx, L.cy + 58, 10, "#fff");
      }
      if (s.phase === "bid2") {
        G.card(c, L.cx, L.cy, 58, s.up, false, {
          rot: 1.4
        });
        G.text(c, "NO ".concat(G.SUIT[s.up.s], " \u2014 CALL A SUIT"), L.cx, L.cy + 58, 10, "#fff");
      }
      s.trick.forEach(function (t) {
        var _L$seat$t$p = _slicedToArray(L.seat[t.p], 2),
          sx = _L$seat$t$p[0],
          sy = _L$seat$t$p[1],
          e = 1 - Math.pow(1 - t.a, 3);
        G.card(c, sx + (L.cx + slot[t.p][0] - sx) * e, sy + (L.cy + slot[t.p][1] - sy) * e, 56, t.c, true, {
          hl: s.phase === "trickEnd" && t.p === s.win,
          rot: (t.p - 1.5) * 0.06
        });
      });
      (s.gone || []).forEach(function (t) {
        var k = 1 - Math.max(0, s.goneT) / 0.45,
          _L$seat$t$to = _slicedToArray(L.seat[t.to], 2),
          tx = _L$seat$t$to[0],
          ty = _L$seat$t$to[1];
        G.card(c, L.cx + (tx - L.cx) * k, L.cy + (ty - L.cy) * k, 56 * (1 - k * 0.5), t.c, true);
      });
      if (s.jpiles) {
        var spot = [[W / 2, H - 150], [96, L.cy], [W / 2, 170], [W - 96, L.cy]];
        s.jpiles.forEach(function (pile, p) {
          return pile.forEach(function (q, i) {
            var e = 1 - Math.pow(1 - q.a, 3),
              tx = spot[p][0] + (p % 2 ? 0 : (i - 1) * 12),
              ty = spot[p][1] + (p % 2 ? (i - 1) * 12 : 0);
            var isJ = s.jwho === p && i === pile.length - 1;
            G.card(c, L.cx + (tx - L.cx) * e, L.cy + (ty - L.cy) * e, isJ ? 54 : 46, q.c, true, {
              hl: isJ,
              rot: (p - 1.5) * 0.05
            });
          });
        });
        if (s.jwho < 0) {
          G.card(c, L.cx, L.cy, 46, null, false);
          G.text(c, "TAP TO SKIP", W / 2, H - 60, 10, "#fff");
        } else G.banner(c, s.jwho === 0 ? "YOU DEAL!" : "".concat(NAMES[s.jwho], " DEALS"), "#ffd23f", H - 70, 20);
      }
      this.handPos(G).forEach(function (q, i) {
        return G.card(c, q.x, q.y, L.cw, q.c, true, {
          dim: !q.ok,
          rot: (i - (s.hands[0].length - 1) / 2) * 0.04
        });
      });
      if (s.turn === 0 && (s.phase === "play" || s.phase.startsWith("bid")) && !(s.wait > 0)) {
        c.fillStyle = "#ffd23f";
        c.fillRect(W / 2 - 30, H - 6, 60, 4);
      }
      var by = L.hy - L.ch / 2 - 62;
      if (s.turn === 0 && !(s.wait > 0) && (s.phase === "bid1" || s.phase === "bid2")) {
        if (s.phase === "bid1") {
          var w3 = (W - 40) / 3;
          this.btn(c, G, 12, by, w3, 46, "PASS", function () {
            return _this.bid(G, 0, "pass");
          });
          this.btn(c, G, 20 + w3, by, w3, 46, s.dealer === 0 ? "PICK UP" : "ORDER UP", function () {
            return _this.bid(G, 0, "order", null, s.aloneTog);
          }, true);
          this.btn(c, G, 28 + 2 * w3, by, w3, 46, s.aloneTog ? "ALONE ✓" : "ALONE?", function () {
            s.aloneTog = !s.aloneTog;
          }, s.aloneTog);
        } else {
          var su = [0, 1, 2, 3].filter(function (x) {
              return x !== s.up.s;
            }),
            canPass = s.dealer !== 0,
            n = su.length + (canPass ? 1 : 0) + 1,
            bw = (W - 24 - 6 * (n - 1)) / n;
          var x = 12;
          if (canPass) {
            this.btn(c, G, x, by, bw, 46, "PASS", function () {
              return _this.bid(G, 0, "pass");
            });
            x += bw + 6;
          }
          su.forEach(function (v) {
            _this.btn(c, G, x, by, bw, 46, G.SUIT[v], function () {
              return _this.bid(G, 0, "call", v, s.aloneTog);
            }, true);
            x += bw + 6;
          });
          this.btn(c, G, x, by, bw, 46, s.aloneTog ? "✓" : "ALONE", function () {
            s.aloneTog = !s.aloneTog;
          }, s.aloneTog);
          if (!canPass) G.text(c, "STICK THE DEALER: YOU MUST CALL", W / 2, by - 12, 9, "#ffd23f");
        }
      }
      G.hud(c, "US ".concat(s.score[0]), s.phase === "jacks" ? "WHO DEALS?" : s.trump != null ? "TRUMP ".concat(G.SUIT[s.trump], " \xB7 ").concat(s.tricks[0], "\u2013").concat(s.tricks[1]) : "HAND ".concat(s.hand), "THEM ".concat(s.score[1]));
      if (s.trump != null) {
        var red = s.trump === 1 || s.trump === 2;
        c.fillStyle = "#fffdf7";
        c.beginPath();
        c.arc(W / 2 + 70, 17, 0, 0, 7);
        c.fill();
      }
      c.fillStyle = "rgba(0,0,0,0.35)";
      c.fillRect(0, 36, W, 22);
      c.fillStyle = "#fff";
      c.font = "600 12.5px system-ui, sans-serif";
      c.textAlign = "center";
      c.textBaseline = "middle";
      c.fillText(s.phase === "play" && s.turn === 0 && !(s.wait > 0) ? "Your play" + (s.led != null ? " \u2014 ".concat(G.SUIT[s.led], " led") : " — you lead") : s.msg, W / 2, 47);
      if (s.phase === "handEnd" && s.handMsg) {
        c.fillStyle = "rgba(0,0,0,0.55)";
        c.fillRect(0, L.cy - 60, W, 120);
        G.banner(c, s.handMsg.t, s.handMsg.us ? "#7cff6b" : "#ff6b6b", L.cy - 10);
        G.text(c, "TRICKS ".concat(s.handMsg.tricks[0], "\u2013").concat(s.handMsg.tricks[1], " \xB7 SCORE ").concat(s.score[0], "\u2013").concat(s.score[1]), W / 2, L.cy + 30, 11, "#fff");
      }
    }
  });
})();