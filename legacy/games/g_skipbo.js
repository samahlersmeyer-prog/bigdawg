function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
(function () {
  var NAMES = ["YOU", "REX", "DUKE"],
    FACES = [null, "🐕", "🐶"];
  var shuffle = function shuffle(a) {
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var _ref = [a[j], a[i]];
      a[i] = _ref[0];
      a[j] = _ref[1];
    }
    return a;
  };
  var rr = function rr(c, x, y, w, h, r) {
    c.beginPath();
    if (c.roundRect) c.roundRect(x, y, w, h, r);else c.rect(x, y, w, h);
  };
  var top = function top(a) {
    return a[a.length - 1];
  };
  var vcol = function vcol(v) {
    return v <= 4 ? "#1e88e5" : v <= 8 ? "#2e9d47" : "#e53935";
  };
  function sbCard(c, x, y, w, v) {
    var o = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};
    var h = w * 1.4,
      r = w * 0.12;
    c.save();
    c.translate(x, y - (o.up ? 6 : 0));
    c.fillStyle = "rgba(0,0,0,0.3)";
    rr(c, -w / 2 + 1.5, -h / 2 + 2.5, w, h, r);
    c.fill();
    if (v === 0) {
      var g = c.createLinearGradient(0, -h / 2, 0, h / 2);
      g.addColorStop(0, "#ffb300");
      g.addColorStop(1, "#ef6c00");
      c.fillStyle = g;
      rr(c, -w / 2, -h / 2, w, h, r);
      c.fill();
      G.img(c, ":dawgW:", 0, -h * 0.08, w * 0.62);
      c.fillStyle = "#fff";
      c.font = "900 ".concat(Math.round(w * 0.2), "px system-ui, sans-serif");
      c.textAlign = "center";
      c.textBaseline = "middle";
      c.fillText(o.as ? String(o.as) : "WILD", 0, h * 0.32);
    } else {
      c.fillStyle = "#fffdf7";
      rr(c, -w / 2, -h / 2, w, h, r);
      c.fill();
      var col = vcol(v);
      c.fillStyle = col;
      c.textAlign = "center";
      c.textBaseline = "middle";
      c.font = "900 ".concat(Math.round(w * (v > 9 ? 0.5 : 0.6)), "px system-ui, -apple-system, sans-serif");
      c.fillText(String(v), 0, 1);
      c.font = "800 ".concat(Math.round(w * 0.2), "px system-ui, sans-serif");
      c.fillText(String(v), -w / 2 + w * 0.18, -h / 2 + w * 0.2);
      c.fillRect(-w / 2 + w * 0.12, h / 2 - w * 0.16, w * 0.76, Math.max(2, w * 0.05));
    }
    c.strokeStyle = o.sel ? "#ffd23f" : o.hl ? "#69f0ae" : "rgba(0,0,0,0.22)";
    c.lineWidth = o.sel || o.hl ? 3.5 : 1;
    rr(c, -w / 2, -h / 2, w, h, r);
    c.stroke();
    if (o.dim) {
      c.fillStyle = "rgba(0,0,0,0.35)";
      rr(c, -w / 2, -h / 2, w, h, r);
      c.fill();
    }
    c.restore();
  }
  function slot(c, x, y, w, txt, hl) {
    var h = w * 1.4;
    c.save();
    c.setLineDash([5, 4]);
    c.strokeStyle = hl ? "#69f0ae" : "rgba(255,255,255,0.35)";
    c.lineWidth = hl ? 3 : 1.5;
    rr(c, x - w / 2, y - h / 2, w, h, w * 0.12);
    c.stroke();
    c.restore();
    if (txt) {
      c.fillStyle = "rgba(255,255,255,0.4)";
      c.font = "700 ".concat(Math.round(w * 0.26), "px system-ui, sans-serif");
      c.textAlign = "center";
      c.textBaseline = "middle";
      c.fillText(txt, x, y);
    }
  }
  defGame({
    key: "skipbo",
    name: "Skip-Bo Dawgs",
    icon: "🔢",
    max: 500,
    cat: "den",
    blurb: "The stockpile card game vs Rex and Duke.",
    how: "Be the first to empty your stockpile (left, top card face up). The 4 building piles in the middle go up from 1 to 12, any color; at 12 a pile clears. Orange 🐶 cards are wild and count as whatever the pile needs. On your turn you fill up to 5 cards, then play as many cards as you like from your hand, the top of your stockpile, or the tops of your 4 discard piles: tap a card, then tap a building pile. Use your whole hand and you draw 5 more. To end your turn, tap a hand card and then one of your discard piles. Only the top card of each discard pile can be played, so stack them high-to-low. Quick game: 20-card stockpiles; Classic: 30. Win = 25 + 5 for each card left in the pups' stockpiles. Score: win = 100 + that; lose = 5 for every stockpile card you got rid of.",
    save: function save(G) {
      var s = G.s;
      if (s.phase !== "play" || s.turn !== 0) return null;
      return {
        label: "Your stock ".concat(s.stock[0].length, " \xB7 Rex ").concat(s.stock[1].length, " \xB7 Duke ").concat(s.stock[2].length),
        v: JSON.parse(JSON.stringify(Object.assign({}, s, {
          btns: [],
          hl: null,
          sel: null,
          say: [null, null, null]
        })))
      };
    },
    load: function load(G, sv) {
      Object.assign(G.s, sv.v);
      G.s.wait = 0.4;
      G.s.msg = "Welcome back. Your turn.";
    },
    reset: function reset(G) {
      G.s = {
        phase: "setup",
        btns: [],
        say: [null, null, null],
        msg: "",
        wait: 0,
        sel: null,
        hl: null
      };
    },
    deal: function deal(G, n) {
      var deck = [];
      for (var k = 0; k < 12; k++) for (var v = 1; v <= 12; v++) deck.push(v);
      for (var _k = 0; _k < 18; _k++) deck.push(0);
      shuffle(deck);
      var stock = [[], [], []];
      for (var r = 0; r < n; r++) for (var p = 0; p < 3; p++) stock[p].push(deck.pop());
      G.s = {
        phase: "play",
        deck: deck,
        done: [],
        build: [[], [], [], []],
        stock: stock,
        start: n,
        hand: [[], [], []],
        disc: [0, 1, 2].map(function () {
          return [[], [], [], []];
        }),
        turn: 0,
        sel: null,
        hl: null,
        say: [null, null, null],
        msg: "",
        wait: 0.3,
        btns: []
      };
      this.startTurn(G);
    },
    need: function need(s, k) {
      return s.build[k].length + 1;
    },
    refill: function refill(s, p) {
      while (s.hand[p].length < 5) {
        if (!s.deck.length) {
          s.deck = shuffle(s.done);
          s.done = [];
          if (!s.deck.length) break;
        }
        s.hand[p].push(s.deck.pop());
      }
      if (p === 0) s.hand[0].sort(function (a, b) {
        return (a || 99) - (b || 99);
      });
    },
    startTurn: function startTurn(G) {
      var s = G.s;
      this.refill(s, s.turn);
      s.sel = null;
      s.played = false;
      if (s.turn === 0) s.msg = (s.msg ? s.msg + " " : "") + "Your turn.";
      s.wait = s.turn === 0 ? 0.2 : 0.8;
    },
    endTurn: function endTurn(G, pass) {
      var s = G.s;
      s.passes = pass && !s.played ? (s.passes || 0) + 1 : 0;
      if (s.passes >= 3) return this.finish(G, -1);
      s.turn = (s.turn + 1) % 3;
      this.startTurn(G);
    },
    takeFrom: function takeFrom(s, p, src) {
      if (src.from === "stock") return s.stock[p].pop();
      if (src.from === "disc") return s.disc[p][src.i].pop();
      return s.hand[p].splice(src.i, 1)[0];
    },
    peek: function peek(s, p, src) {
      return src.from === "stock" ? top(s.stock[p]) : src.from === "disc" ? top(s.disc[p][src.i]) : s.hand[p][src.i];
    },
    playTo: function playTo(G, p, src, k) {
      var s = G.s,
        v = this.takeFrom(s, p, src),
        pile = s.build[k];
      pile.push(v);
      s.hl = {
        k: k,
        t: 0.9
      };
      s.played = true;
      G.sfx("pop");
      var as = pile.length;
      if (p !== 0) s.say[p] = {
        txt: v === 0 ? "Wild as ".concat(as) : "Plays ".concat(v),
        t: 1
      };
      if (pile.length === 12) {
        var _s$done;
        (_s$done = s.done).push.apply(_s$done, _toConsumableArray(pile));
        s.build[k] = [];
        s.say[p] = {
          txt: "12! Cleared",
          t: 1.2
        };
      }
      if (!s.stock[p].length) return this.finish(G, p);
      if (src.from === "hand" && !s.hand[p].length) {
        this.refill(s, p);
        if (p === 0) s.msg = "Hand empty: drew 5 more.";else s.say[p] = {
          txt: "Draws 5!",
          t: 1.2
        };
      }
      if (src.from === "stock" && p !== 0 && s.stock[p].length <= 3) s.say[p] = {
        txt: "".concat(s.stock[p].length, " left!"),
        t: 1.2
      };
    },
    discard: function discard(G, p, i, d) {
      var s = G.s,
        v = s.hand[p].splice(i, 1)[0];
      s.disc[p][d].push(v);
      G.sfx("pop");
      if (p === 0) s.msg = "";else s.say[p] = {
        txt: "Discards",
        t: 0.9
      };
      this.endTurn(G);
    },
    after: function after(s, k) {
      var n = s.build[k].length + 1;
      return n === 12 ? 1 : n + 1;
    },
    feeds: function feeds(s, p, k) {
      var _this = this;
      return [0, 1, 2].some(function (q) {
        return q !== p && s.stock[q].length && top(s.stock[q]) === _this.after(s, k);
      });
    },
    findPath: function findPath(s, p) {
      var _this2 = this;
      var t = top(s.stock[p]);
      var steps = 0,
        best = null;
      var _loop = function _loop() {
        var need = _this2.need(s, k);
        if (need > t) return 1;
        var hand = s.hand[p].slice(),
          discs = s.disc[p].map(function (d) {
            return d.slice();
          });
        var _go = function go(n, wilds) {
          if (++steps > 4000) return null;
          if (n === t) return {
            wilds: wilds,
            first: null
          };
          var tries = [];
          discs.forEach(function (d, i) {
            if (d.length && top(d) === n) tries.push({
              from: "disc",
              i: i
            });
          });
          var hi = hand.indexOf(n);
          if (hi >= 0) tries.push({
            from: "hand",
            i: hi
          });
          discs.forEach(function (d, i) {
            if (d.length && top(d) === 0) tries.push({
              from: "disc",
              i: i,
              w: 1
            });
          });
          var wi = hand.indexOf(0);
          if (wi >= 0) tries.push({
            from: "hand",
            i: wi,
            w: 1
          });
          for (var _i = 0, _tries = tries; _i < _tries.length; _i++) {
            var m = _tries[_i];
            var card = m.from === "disc" ? discs[m.i].pop() : hand.splice(m.i, 1)[0];
            var _r = _go(n + 1, wilds + (m.w ? 1 : 0));
            if (m.from === "disc") discs[m.i].push(card);else hand.splice(m.i, 0, card);
            if (_r) return {
              wilds: _r.wilds,
              first: m
            };
          }
          return null;
        };
        var r = _go(need, 0);
        if (r && (!best || r.wilds < best.wilds)) best = {
          wilds: r.wilds,
          move: {
            src: r.first,
            k: k
          }
        };
      };
      for (var k = 0; k < 4; k++) {
        if (_loop()) continue;
      }
      return best && best.move;
    },
    cpuStep: function cpuStep(G, p) {
      var _this3 = this;
      var s = G.s,
        t = top(s.stock[p]);
      var ks = [0, 1, 2, 3].filter(function (k) {
        return t === 0 || _this3.need(s, k) === t;
      });
      if (ks.length) {
        var k = ks.find(function (k) {
          return !_this3.feeds(s, p, k);
        });
        return this.playTo(G, p, {
          from: "stock"
        }, k === undefined ? ks[0] : k);
      }
      var path = this.findPath(s, p);
      if (path) return this.playTo(G, p, path.src, path.k);
      for (var i = 0; i < 4; i++) {
        var d = s.disc[p][i];
        if (!d.length || top(d) === 0) continue;
        for (var _k2 = 0; _k2 < 4; _k2++) if (this.need(s, _k2) === top(d) && !this.feeds(s, p, _k2)) return this.playTo(G, p, {
          from: "disc",
          i: i
        }, _k2);
      }
      for (var _i2 = 0; _i2 < s.hand[p].length; _i2++) {
        var v = s.hand[p][_i2];
        if (!v) continue;
        for (var _k3 = 0; _k3 < 4; _k3++) if (this.need(s, _k3) === v && !this.feeds(s, p, _k3)) return this.playTo(G, p, {
          from: "hand",
          i: _i2
        }, _k3);
      }
      if (!s.hand[p].length) {
        for (var _i3 = 0; _i3 < 4; _i3++) {
          var _d = s.disc[p][_i3];
          if (!_d.length) continue;
          for (var _k4 = 0; _k4 < 4; _k4++) if (top(_d) === 0 || this.need(s, _k4) === top(_d)) return this.playTo(G, p, {
            from: "disc",
            i: _i3
          }, _k4);
        }
        s.say[p] = {
          txt: "Pass",
          t: 1
        };
        return this.endTurn(G, true);
      }
      var best = null;
      s.hand[p].forEach(function (v, i) {
        return s.disc[p].forEach(function (d, k) {
          var sc;
          if (v === 0) sc = -50 + (d.length ? 0 : 5);else if (!d.length) sc = 5;else {
            var tv = top(d);
            sc = tv === 0 ? -5 : tv === v ? 8 : tv === v + 1 ? 10 : tv > v ? 7 - (tv - v) * 0.6 : 1 - (v - tv) * 0.6;
          }
          sc += v * 0.15 + Math.random() * 0.5;
          if (!best || sc > best.sc) best = {
            sc: sc,
            i: i,
            k: k
          };
        });
      });
      this.discard(G, p, best.i, best.k);
    },
    finish: function finish(G, w) {
      var s = G.s;
      s.phase = "over";
      s.sel = null;
      if (w < 0) {
        var n = s.stock.map(function (x) {
          return x.length;
        });
        w = n.indexOf(Math.min.apply(Math, _toConsumableArray(n)));
        s.stuck = true;
      }
      s.winner = w;
      var pts = 25 + 5 * [0, 1, 2].filter(function (p) {
        return p !== w;
      }).reduce(function (a, p) {
        return a + s.stock[p].length;
      }, 0);
      s.pts = pts;
      var score = w === 0 ? Math.min(500, 100 + pts) : 5 * (s.start - s.stock[0].length);
      G.sfx(w === 0 ? "win" : "lose");
      setTimeout(function () {
        return G.over(score, w === 0 ? "Skip-Bo! Top dog 🐶" : "".concat(NAMES[w], " ").concat(s.stuck ? "had the smallest stockpile" : "emptied the stockpile first", "."));
      }, 2000);
    },
    update: function update(G, dt) {
      var s = G.s;
      s.say.forEach(function (b, i) {
        if (b) {
          b.t -= dt;
          if (b.t <= 0) s.say[i] = null;
        }
      });
      if (s.hl) {
        s.hl.t -= dt;
        if (s.hl.t <= 0) s.hl = null;
      }
      if (s.phase !== "play") return;
      if (s.wait > 0) {
        s.wait -= dt;
        return;
      }
      if (s.turn !== 0) {
        this.cpuStep(G, s.turn);
        if (s.phase === "play") s.wait = Math.max(s.wait, 0.55);
        return;
      }
    },
    L: function L(G) {
      var W = G.W,
        H = G.H;
      var ow = Math.min(34, (W / 2 - 22) / 5.8),
        oh = ow * 1.4,
        oppY = 54,
        oppCards = oppY + 20 + oh / 2;
      var bw = Math.min(62, (W - 30) / 5.5),
        bh = bw * 1.4,
        buildY = oppCards + oh / 2 + 24 + bh / 2;
      var msgY = buildY + bh / 2 + 34;
      var hw = Math.min(64, (W - 24) / 5.4),
        hh = hw * 1.4,
        handY = H - hh / 2 - 16;
      var dw = Math.min(66, (W - 24) / 5.4),
        dh = dw * 1.4,
        areaY = msgY + 18 + dh / 2;
      var room = handY - hh / 2 - 22 - (areaY + dh / 2),
        off = Math.max(5, Math.min(26, room / 7));
      var col = function col(w, i) {
        var gap = (W - 5 * w) / 6;
        return gap + w / 2 + i * (w + gap);
      };
      return {
        W: W,
        H: H,
        ow: ow,
        oh: oh,
        oppY: oppY,
        oppCards: oppCards,
        bw: bw,
        bh: bh,
        buildY: buildY,
        msgY: msgY,
        hw: hw,
        hh: hh,
        handY: handY,
        dw: dw,
        dh: dh,
        areaY: areaY,
        off: off,
        col: col
      };
    },
    targets: function targets(s) {
      var _this4 = this;
      if (!s.sel || s.turn !== 0) return [];
      var v = this.peek(s, 0, s.sel);
      return [0, 1, 2, 3].filter(function (k) {
        return v === 0 || _this4.need(s, k) === v;
      });
    },
    draw: function draw(G, c) {
      var s = G.s,
        W = G.W,
        H = G.H;
      s.btns = [];
      var g = c.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, "#1d4f7a");
      g.addColorStop(1, "#0f2742");
      c.fillStyle = g;
      c.fillRect(0, 0, W, H);
      if (s.phase === "setup") {
        G.hud(c, "", "SKIP-BO DAWGS", "");
        G.emoji(c, "🐕", W / 2 - 40, H * 0.22, 44);
        G.emoji(c, "🐶", W / 2 + 40, H * 0.22, 44);
        G.text(c, "YOU VS REX & DUKE", W / 2, H * 0.31, 11, "#fff");
        [["QUICK GAME", "20-card stockpiles", 20, H * 0.4], ["CLASSIC", "30-card stockpiles", 30, H * 0.4 + 96]].forEach(function (_ref2) {
          var _ref3 = _slicedToArray(_ref2, 4),
            t = _ref3[0],
            sub = _ref3[1],
            n = _ref3[2],
            y = _ref3[3];
          var bx = W / 2 - 120;
          c.fillStyle = n === 20 ? "#ffd23f" : "#fff";
          rr(c, bx, y, 240, 76, 22);
          c.fill();
          G.text(c, t, W / 2, y + 28, 13, "#1b1b1f");
          c.fillStyle = "#444";
          c.font = "600 13px system-ui, sans-serif";
          c.textAlign = "center";
          c.fillText(sub, W / 2, y + 54);
          s.btns.push({
            x: bx,
            y: y,
            w: 240,
            h: 76,
            k: "start",
            n: n
          });
        });
        return;
      }
      var L = this.L(G),
        myTurn = s.turn === 0 && s.phase === "play";
      G.hud(c, "DECK ".concat(s.deck.length), "SKIP-BO DAWGS", "STOCK ".concat(s.stock[0].length));
      [1, 2].forEach(function (p) {
        var cx = p === 1 ? W * 0.25 : W * 0.75,
          bwid = W / 2 - 12,
          x0 = cx - bwid / 2,
          turn = s.turn === p && s.phase === "play";
        c.fillStyle = turn ? "rgba(255,210,63,0.25)" : "rgba(0,0,0,0.18)";
        rr(c, x0, L.oppY - 14, bwid, L.oppCards + L.oh / 2 + 14 - (L.oppY - 14), 12);
        c.fill();
        G.emoji(c, FACES[p], x0 + 16, L.oppY + 1, 18);
        G.text(c, "".concat(NAMES[p]), x0 + 34, L.oppY + 1, 9, "#fff", "left");
        G.text(c, "".concat(s.stock[p].length), x0 + bwid - 10, L.oppY + 1, 10, s.stock[p].length <= 3 ? "#ff8a80" : "#ffd23f", "right");
        var sx = x0 + 8 + L.ow / 2;
        if (s.stock[p].length) sbCard(c, sx, L.oppCards, L.ow, top(s.stock[p]));else slot(c, sx, L.oppCards, L.ow, "");
        for (var d = 0; d < 4; d++) {
          var dx = sx + L.ow * 1.25 + d * (L.ow * 0.98 + 3),
            pile = s.disc[p][d];
          if (pile.length) {
            sbCard(c, dx, L.oppCards, L.ow * 0.92, top(pile));
            if (pile.length > 1) {
              c.fillStyle = "#fff";
              c.font = "700 10px system-ui, sans-serif";
              c.textAlign = "center";
              c.fillText("\xD7".concat(pile.length), dx, L.oppCards + L.oh / 2 + 8);
            }
          } else slot(c, dx, L.oppCards, L.ow * 0.92, "");
        }
        var b = s.say[p];
        if (b) {
          var w = Math.max(74, b.txt.length * 7 + 18);
          c.fillStyle = "#fff";
          rr(c, cx - w / 2, L.oppCards + L.oh / 2 + 2, w, 22, 11);
          c.fill();
          c.fillStyle = "#222";
          c.font = "800 12px system-ui, sans-serif";
          c.textAlign = "center";
          c.textBaseline = "middle";
          c.fillText(b.txt, cx, L.oppCards + L.oh / 2 + 13);
        }
      });
      var tg = this.targets(s);
      G.card(c, L.col(L.bw, 0), L.buildY, L.bw, null, false);
      c.fillStyle = "rgba(255,255,255,0.7)";
      c.font = "700 11px system-ui, sans-serif";
      c.textAlign = "center";
      c.fillText("".concat(s.deck.length, " left"), L.col(L.bw, 0), L.buildY + L.bh / 2 + 13);
      for (var k = 0; k < 4; k++) {
        var x = L.col(L.bw, k + 1),
          pile = s.build[k],
          on = tg.includes(k),
          flash = s.hl && s.hl.k === k;
        if (pile.length) {
          if (flash) {
            c.fillStyle = "rgba(255,210,63,0.45)";
            rr(c, x - L.bw / 2 - 5, L.buildY - L.bh / 2 - 5, L.bw + 10, L.bh + 10, 10);
            c.fill();
          }
          sbCard(c, x, L.buildY, L.bw, top(pile), {
            as: pile.length,
            hl: on
          });
        } else slot(c, x, L.buildY, L.bw, "1-12", on);
        c.fillStyle = on ? "#69f0ae" : "rgba(255,255,255,0.7)";
        c.font = "700 11px system-ui, sans-serif";
        c.textAlign = "center";
        c.fillText("needs ".concat(this.need(s, k)), x, L.buildY + L.bh / 2 + 13);
        s.btns.push({
          x: x - L.bw / 2 - 4,
          y: L.buildY - L.bh / 2 - 4,
          w: L.bw + 8,
          h: L.bh + 8,
          k: "build",
          i: k
        });
      }
      var msg = s.phase !== "play" ? "" : myTurn ? s.sel ? s.sel.from === "hand" ? "Tap a green pile, or a discard pile to end your turn." : "Tap a green pile to play it." : s.msg || "Your turn." : "".concat(NAMES[s.turn], " is playing\u2026");
      if (msg) {
        c.fillStyle = "rgba(0,0,0,0.35)";
        rr(c, 8, L.msgY - 12, W - 16, 24, 12);
        c.fill();
        c.fillStyle = myTurn ? "#fff" : "#ffd23f";
        c.font = "600 12.5px system-ui, sans-serif";
        c.textAlign = "center";
        c.textBaseline = "middle";
        c.fillText(msg, W / 2, L.msgY, W - 28);
      }
      var sx = L.col(L.dw, 0),
        sel = s.sel;
      if (s.stock[0].length) {
        sbCard(c, sx, L.areaY, L.dw, top(s.stock[0]), {
          sel: sel && sel.from === "stock",
          up: sel && sel.from === "stock"
        });
      } else slot(c, sx, L.areaY, L.dw, "");
      c.fillStyle = "#ffd23f";
      c.font = "800 11px system-ui, sans-serif";
      c.textAlign = "center";
      c.fillText("STOCK ".concat(s.stock[0].length), sx, L.areaY + L.dh / 2 + 13);
      s.btns.push({
        x: sx - L.dw / 2,
        y: L.areaY - L.dh / 2 - 6,
        w: L.dw,
        h: L.dh + 6,
        k: "stock"
      });
      var discTarget = myTurn && sel && sel.from === "hand";
      var _loop2 = function _loop2(d) {
        var x = L.col(L.dw, d + 1),
          pile = s.disc[0][d],
          show = pile.slice(-8),
          base = L.areaY;
        if (!pile.length) slot(c, x, base, L.dw, discTarget ? "here" : "", discTarget);
        show.forEach(function (v, j) {
          var last = j === show.length - 1,
            isSel = last && sel && sel.from === "disc" && sel.i === d;
          sbCard(c, x, base + j * L.off, L.dw, v, {
            sel: isSel,
            up: isSel,
            hl: last && discTarget
          });
        });
        if (pile.length > show.length) {
          c.fillStyle = "rgba(255,255,255,0.7)";
          c.font = "700 10px system-ui, sans-serif";
          c.textAlign = "center";
          c.fillText("+".concat(pile.length - show.length), x, base - L.dh / 2 - 6);
        }
        var hgt = L.dh + Math.max(0, show.length - 1) * L.off;
        s.btns.push({
          x: x - L.dw / 2,
          y: base - L.dh / 2 - 6,
          w: L.dw,
          h: hgt + 6,
          k: "disc",
          i: d
        });
      };
      for (var d = 0; d < 4; d++) {
        _loop2(d);
      }
      c.fillStyle = "rgba(0,0,0,0.25)";
      rr(c, 4, L.handY - L.hh / 2 - 10, W - 8, L.hh + 20, 14);
      c.fill();
      s.hand[0].forEach(function (v, i) {
        var x = L.col(L.hw, i),
          isSel = sel && sel.from === "hand" && sel.i === i;
        sbCard(c, x, L.handY, L.hw, v, {
          sel: isSel,
          up: isSel,
          dim: !myTurn
        });
        s.btns.push({
          x: x - L.hw / 2,
          y: L.handY - L.hh / 2 - 6,
          w: L.hw,
          h: L.hh + 6,
          k: "hand",
          i: i
        });
      });
      if (myTurn && !s.hand[0].length) {
        var bx = W / 2 - 80;
        c.fillStyle = "#ffd23f";
        rr(c, bx, L.handY - 22, 160, 44, 22);
        c.fill();
        G.text(c, "END TURN", W / 2, L.handY, 11, "#222");
        s.btns.unshift({
          x: bx,
          y: L.handY - 22,
          w: 160,
          h: 44,
          k: "pass"
        });
        G.text(c, "NO CARDS LEFT TO DRAW", W / 2, L.handY - 36, 8, "#fff");
      }
      G.hint(c, "TAP A CARD, THEN A PILE", 5, L.handY - L.hh / 2 - 26);
      if (s.phase === "over") {
        c.fillStyle = "rgba(0,0,0,0.72)";
        c.fillRect(0, 0, W, H);
        G.banner(c, s.winner === 0 ? "SKIP-BO! YOU WIN" : "".concat(NAMES[s.winner], " WINS"), s.winner === 0 ? "#ffd23f" : "#fff", H * 0.3, 17);
        G.text(c, "".concat(NAMES[s.winner] === "YOU" ? "YOU SCORE" : NAMES[s.winner] + " SCORES", " ").concat(s.pts), W / 2, H * 0.38, 11, "#fff");
        [0, 1, 2].forEach(function (p) {
          return G.text(c, "".concat(NAMES[p], ": ").concat(s.stock[p].length, " left in stock"), W / 2, H * 0.46 + p * 26, 10, p === 0 ? "#ffd23f" : "#fff");
        });
      }
    },
    tap: function tap(G, x, y) {
      var s = G.s,
        hits = s.btns.filter(function (b) {
          return x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h;
        });
      if (!hits.length) return;
      var b = hits[0];
      if (s.phase === "setup") {
        if (b.k === "start") {
          this.deal(G, b.n);
          G.sfx("pop");
        }
        return;
      }
      if (s.phase !== "play" || s.turn !== 0 || s.wait > 0) return;
      if (b.k === "pass") {
        s.sel = null;
        s.msg = "";
        return this.endTurn(G, true);
      }
      var same = function same(a) {
        return s.sel && s.sel.from === a.from && s.sel.i === a.i;
      };
      if (b.k === "hand") {
        var a = {
          from: "hand",
          i: b.i
        };
        s.sel = same(a) ? null : a;
        return;
      }
      if (b.k === "stock") {
        if (!s.stock[0].length) return;
        var _a = {
          from: "stock"
        };
        s.sel = same(_a) ? null : _a;
        return;
      }
      if (b.k === "disc") {
        if (s.sel && s.sel.from === "hand") {
          var i = s.sel.i;
          s.sel = null;
          return this.discard(G, 0, i, b.i);
        }
        if (!s.disc[0][b.i].length) {
          s.msg = "Tap a hand card first, then a discard pile to end your turn.";
          return;
        }
        var _a2 = {
          from: "disc",
          i: b.i
        };
        s.sel = same(_a2) ? null : _a2;
        return;
      }
      if (b.k === "build") {
        if (!s.sel) {
          s.msg = "That pile needs a ".concat(this.need(s, b.i), ". Pick a card first.");
          return;
        }
        var v = this.peek(s, 0, s.sel);
        if (v !== 0 && v !== this.need(s, b.i)) {
          s.msg = "That pile needs a ".concat(this.need(s, b.i), ".");
          G.buzz();
          return;
        }
        var src = s.sel;
        s.sel = null;
        s.msg = "";
        this.playTo(G, 0, src, b.i);
      }
    }
  });
})();