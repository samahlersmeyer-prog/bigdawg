function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
(function () {
  var DIFF = [["EASY", 1000, 38], ["MEDIUM", 2000, 30], ["HARD", 3000, 25]];
  var dayIdx = function dayIdx() {
    var _KEY$split$map = KEY.split("-").map(Number),
      _KEY$split$map2 = _slicedToArray(_KEY$split$map, 3),
      y = _KEY$split$map2[0],
      m = _KEY$split$map2[1],
      d = _KEY$split$map2[2];
    return Math.round((Date.UTC(y, m - 1, d) - Date.UTC(2026, 9, 26)) / 864e5);
  };
  var rk = function rk(d) {
    return "bdd:den:sudoku:" + KEY + ":" + d + ":" + (me ? me.id : "");
  };
  var rr = function rr(c, x, y, w, h, r) {
    c.beginPath();
    if (c.roundRect) c.roundRect(x, y, w, h, r);else c.rect(x, y, w, h);
  };
  var RC = [];
  for (var i = 0; i < 81; i++) {
    var r = Math.floor(i / 9),
      cc = i % 9,
      b = Math.floor(r / 3) * 3 + Math.floor(cc / 3);
    RC.push([r, cc, b]);
  }
  var PEERS = RC.map(function (_ref, i) {
    var _ref2 = _slicedToArray(_ref, 3),
      r = _ref2[0],
      cc = _ref2[1],
      b = _ref2[2];
    return RC.map(function (x, j) {
      return j;
    }).filter(function (j) {
      return j !== i && (RC[j][0] === r || RC[j][1] === cc || RC[j][2] === b);
    });
  });
  function rng(str) {
    var h = 1779033703 ^ str.length;
    for (var _i = 0; _i < str.length; _i++) {
      h = Math.imul(h ^ str.charCodeAt(_i), 3432918353);
      h = h << 13 | h >>> 19;
    }
    var a = h >>> 0;
    return function () {
      a |= 0;
      a = a + 0x6D2B79F5 | 0;
      var t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }
  function solve(g, lim, rand) {
    var n = 0;
    var rows = new Array(9).fill(0),
      cols = new Array(9).fill(0),
      boxes = new Array(9).fill(0);
    for (var _i2 = 0; _i2 < 81; _i2++) if (g[_i2]) {
      var m = 1 << g[_i2],
        _RC$_i = _slicedToArray(RC[_i2], 3),
        _r = _RC$_i[0],
        _cc = _RC$_i[1],
        _b = _RC$_i[2];
      rows[_r] |= m;
      cols[_cc] |= m;
      boxes[_b] |= m;
    }
    var out = g.slice();
    (function go() {
      var best = -1,
        bm = 0,
        bc = 10;
      for (var _i3 = 0; _i3 < 81; _i3++) if (!g[_i3]) {
        var _RC$_i2 = _slicedToArray(RC[_i3], 3),
          _r2 = _RC$_i2[0],
          _cc2 = _RC$_i2[1],
          _b2 = _RC$_i2[2],
          _m = ~(rows[_r2] | cols[_cc2] | boxes[_b2]) & 0x3fe;
        var k = 0;
        for (var x = _m; x; x &= x - 1) k++;
        if (k < bc) {
          bc = k;
          best = _i3;
          bm = _m;
          if (k <= 1) break;
        }
      }
      if (best < 0) {
        if (!n && rand) for (var _i4 = 0; _i4 < 81; _i4++) out[_i4] = g[_i4];
        n++;
        return;
      }
      var ds = [];
      for (var d = 1; d <= 9; d++) if (bm & 1 << d) ds.push(d);
      if (rand) for (var _i5 = ds.length - 1; _i5 > 0; _i5--) {
        var j = Math.floor(rand() * (_i5 + 1));
        var _ref3 = [ds[j], ds[_i5]];
        ds[_i5] = _ref3[0];
        ds[j] = _ref3[1];
      }
      var _RC$best = _slicedToArray(RC[best], 3),
        r = _RC$best[0],
        cc = _RC$best[1],
        b = _RC$best[2];
      for (var _i6 = 0, _ds = ds; _i6 < _ds.length; _i6++) {
        var _d = _ds[_i6];
        var _m2 = 1 << _d;
        g[best] = _d;
        rows[r] |= _m2;
        cols[cc] |= _m2;
        boxes[b] |= _m2;
        go();
        rows[r] &= ~_m2;
        cols[cc] &= ~_m2;
        boxes[b] &= ~_m2;
        g[best] = 0;
        if (n >= lim) return;
      }
    })();
    return {
      n: n,
      out: out
    };
  }
  function makePuzzle(d) {
    var rand = rng("dawg-sudoku-" + KEY + "-" + d),
      sol = solve(new Array(81).fill(0), 1, rand).out,
      g = sol.slice();
    var order = _toConsumableArray(Array(81).keys());
    for (var _i7 = 80; _i7 > 0; _i7--) {
      var j = Math.floor(rand() * (_i7 + 1));
      var _ref4 = [order[j], order[_i7]];
      order[_i7] = _ref4[0];
      order[j] = _ref4[1];
    }
    var clues = 81;
    var _iterator = _createForOfIteratorHelper(order),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var _i8 = _step.value;
        if (clues <= DIFF[d][2]) break;
        var v = g[_i8];
        g[_i8] = 0;
        if (solve(g.slice(), 2).n !== 1) g[_i8] = v;else clues--;
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
    return {
      sol: sol,
      giv: g
    };
  }
  var speed = function speed(sec, limit, pts) {
    return Math.round(pts * Math.max(0, 1 - sec / limit));
  };
  var LIM = [900, 1500, 2400];
  var scoreOf = function scoreOf(d, st) {
    return Math.round(DIFF[d][1] * 0.7) + speed(st.el, LIM[d], DIFF[d][1] * 0.3);
  };
  defGame({
    key: "sudoku",
    name: "Dawg Sudoku",
    icon: "🔢",
    max: 3000,
    cat: "den",
    puzzle: true,
    blurb: "Daily: Easy, Medium and Hard sudoku.",
    how: "Three new sudokus every day, the same for everyone. Fill the grid so every row, column and 3x3 box has 1-9. Tap a square, then a number. NOTES lets you pencil in options. One try at each per day; your progress is saved if you leave. Score: solving is worth most of Easy 1000 / Medium 2000 / Hard 3000, with a small bonus for going quick. A wrong number just bounces back; it doesn't cost you anything. No clock on screen, so take your time. Your best of the three counts.",
    reset: function reset(G) {
      this.reset0(G);
      var cur = typeof store !== "undefined" && me ? store.get(this.curKey()) : null;
      if (cur !== null && cur !== undefined && !(this.rec(cur) || {}).done && this.rec(cur)) this.open(G, cur);
    },
    reset0: function reset0(G) {
      G.s = {
        phase: "pick",
        btns: [],
        sel: -1,
        notes: false,
        msg: "",
        msgT: 0,
        bad: -1,
        badT: 0,
        endT: 0
      };
    },
    rec: function rec(d) {
      return store.get(rk(d));
    },
    curKey: function curKey() {
      return rk("cur");
    },
    info: function info(d) {
      var _this = this;
      var r = this.rec(d) || {},
        t = Math.floor(r.el || 0),
        mm = "".concat(Math.floor(t / 60), ":").concat(String(t % 60).padStart(2, "0")),
        nm = DIFF[d][0][0] + DIFF[d][0].slice(1).toLowerCase();
      var done = [0, 1, 2].filter(function (k) {
        return (_this.rec(k) || {}).done;
      }).length;
      var nx = [d + 1, d + 2, d - 1, d - 2].map(function (k) {
        return (k + 3) % 3;
      }).find(function (k) {
        return k !== d && !(_this.rec(k) || {}).done;
      });
      var next = nx === undefined ? null : {
        label: "Play ".concat(DIFF[nx][0][0] + DIFF[nx][0].slice(1).toLowerCase(), " \u2192"),
        go: function go() {
          return _this.open(G, nx);
        }
      };
      return {
        next: next,
        score: r.score || 0,
        title: "".concat(nm, " solved!"),
        sub: "".concat(mm).concat(r.mist ? ", ".concat(r.mist, " mistake").concat(r.mist > 1 ? "s" : "") : "", " \xB7 ").concat(r.score || 0, " pts. ").concat(done === 3 ? "All three done today. 🐶" : "".concat(done, " of 3 done today.")),
        share: "Dawg Sudoku #".concat(dayIdx() + 1, " \xB7 ").concat(nm, " ").concat(mm).concat(r.mist ? " (".concat(r.mist, "\u2717)") : "")
      };
    },
    open: function open(G, d) {
      var s = G.s,
        r = this.rec(d);
      if (r && r.done) return G.results(this.info(d));
      try {
        store.set(this.curKey(), d);
      } catch (e) {}
      var p = makePuzzle(d);
      Object.assign(s, {
        phase: "play",
        d: d,
        sol: p.sol,
        giv: p.giv,
        g: r && r.g ? r.g.slice() : p.giv.slice(),
        n: r && r.n ? r.n.slice() : new Array(81).fill(0),
        el: r ? r.el : 0,
        mist: r ? r.mist : 0,
        sel: -1,
        notes: false
      });
      G.sfx("pop");
    },
    persist: function persist(G, extra) {
      var s = G.s;
      store.set(rk(s.d), Object.assign({
        g: s.g,
        n: s.n,
        el: s.el,
        mist: s.mist
      }, extra || {}));
    },
    put: function put(G, v) {
      var s = G.s,
        i = s.sel;
      if (i < 0 || s.giv[i] || s.phase !== "play") return;
      if (v === 0) {
        s.g[i] = 0;
        s.n[i] = 0;
        return this.persist(G);
      }
      if (s.notes) {
        if (!s.g[i]) s.n[i] ^= 1 << v;
        return this.persist(G);
      }
      if (s.g[i] === v) return;
      if (s.sol[i] !== v) {
        s.mist++;
        s.bad = i;
        s.badV = v;
        s.badT = 0.8;
        G.buzz();
        s.msg = "Not that one";
        s.msgT = 1.2;
        return this.persist(G);
      }
      s.g[i] = v;
      s.n[i] = 0;
      PEERS[i].forEach(function (j) {
        return s.n[j] &= ~(1 << v);
      });
      G.sfx("pop");
      if (s.g.every(function (x, k) {
        return x === s.sol[k];
      })) {
        s.phase = "won";
        s.endT = 1.3;
        var sc = scoreOf(s.d, s);
        s["final"] = sc;
        this.persist(G, {
          done: true,
          score: sc
        });
        G.sfx("win");
      } else this.persist(G);
    },
    update: function update(G, dt) {
      var s = G.s;
      if (s.msgT > 0) s.msgT -= dt;
      if (s.badT > 0) s.badT -= dt;
      if (s.phase === "play") {
        s.el += dt;
        s.ck = (s.ck || 0) + dt;
        if (s.ck > 2) {
          s.ck = 0;
          this.persist(G);
        }
      }
      if (s.phase === "won") {
        s.endT -= dt;
        if (s.endT <= 0) {
          s.phase = "pick";
          s.sel = -1;
          try {
            store.set(this.curKey(), null);
          } catch (e) {}
          G.post(s["final"], this.info(s.d));
        }
      }
    },
    draw: function draw(G, c) {
      var _this2 = this;
      var s = G.s,
        dk = G.dark(),
        fg = dk ? "#fff" : "#111";
      c.fillStyle = dk ? "#121213" : "#ffffff";
      c.fillRect(0, 0, G.W, G.H);
      s.btns = [];
      if (s.phase === "pick") {
        c.fillStyle = fg;
        c.textAlign = "center";
        c.textBaseline = "middle";
        c.font = "700 26px ".concat(G.TITLE);
        c.fillText("Today's puzzles", G.W / 2, 44);
        c.font = "400 14px ".concat(G.UI);
        c.fillStyle = dk ? "#aaa" : "#6b6b6b";
        c.fillText("Same for everyone. One go at each.", G.W / 2, 72);
        var bw = Math.min(340, G.W - 32);
        DIFF.forEach(function (_ref5, d) {
          var _ref6 = _slicedToArray(_ref5, 1),
            nm = _ref6[0];
          var r = _this2.rec(d),
            y = 100 + d * 92,
            x = G.W / 2 - bw / 2,
            label = nm[0] + nm.slice(1).toLowerCase();
          c.fillStyle = [dk ? "#22382a" : "#e3f1e0", dk ? "#3a3420" : "#fbefc9", dk ? "#3d2629" : "#f6dcdc"][d];
          rr(c, x, y, bw, 78, 14);
          c.fill();
          c.textAlign = "left";
          c.fillStyle = fg;
          c.font = "700 22px ".concat(G.TITLE);
          c.fillText(label, x + 18, y + 28);
          c.font = "400 14px ".concat(G.UI);
          c.fillStyle = dk ? "#ccc" : "#444";
          c.fillText(r && r.done ? "Solved \xB7 ".concat(r.score, " pts") : r ? "In progress" : "Up to ".concat(DIFF[d][1], " pts"), x + 18, y + 54);
          G.pill(c, x + bw - 100, y + 19, 86, 40, r && r.done ? "Results" : r ? "Resume" : "Play", !(r && r.done));
          s.btns.push({
            x: x,
            y: y,
            w: bw,
            h: 78,
            d: d
          });
        });
      } else {
        var N = Math.min(G.W - 16, G.H - 230),
          cs = N / 9,
          ox = (G.W - N) / 2,
          oy = 44;
        G.pbar(c, DIFF[s.d][0][0] + DIFF[s.d][0].slice(1).toLowerCase(), "", s.mist ? "Mistakes: ".concat(s.mist) : "");
        var sv = s.sel >= 0 ? s.g[s.sel] : 0;
        for (var _i9 = 0; _i9 < 81; _i9++) {
          var _RC$_i3 = _slicedToArray(RC[_i9], 3),
            _r3 = _RC$_i3[0],
            _cc3 = _RC$_i3[1],
            _b3 = _RC$_i3[2],
            x = ox + _cc3 * cs,
            y = oy + _r3 * cs;
          var bg = dk ? "#1e1e22" : "#fff";
          if (s.sel >= 0) {
            var _RC$s$sel = _slicedToArray(RC[s.sel], 3),
              sr = _RC$s$sel[0],
              sc = _RC$s$sel[1],
              sb = _RC$s$sel[2];
            if (_r3 === sr || _cc3 === sc || _b3 === sb) bg = dk ? "#2c2c36" : "#e8eef8";
            if (sv && s.g[_i9] === sv) bg = dk ? "#3d4766" : "#c9d8f2";
            if (_i9 === s.sel) bg = dk ? "#5a6aa0" : "#a9c3f0";
          }
          if (s.phase !== "play") bg = dk ? "#22382a" : "#e6f4e6";
          c.fillStyle = bg;
          c.fillRect(x, y, cs, cs);
          var v = s.g[_i9];
          if (v) {
            c.fillStyle = s.giv[_i9] ? fg : dk ? "#8fb4ff" : "#2456c8";
            c.font = "".concat(s.giv[_i9] ? 700 : 500, " ").concat(Math.round(cs * 0.6), "px system-ui, sans-serif");
            c.textAlign = "center";
            c.textBaseline = "middle";
            c.fillText(v, x + cs / 2, y + cs / 2 + 1);
          } else if (s.n[_i9]) {
            c.fillStyle = dk ? "#aaa" : "#666";
            c.font = "500 ".concat(Math.round(cs * 0.26), "px system-ui, sans-serif");
            c.textAlign = "center";
            c.textBaseline = "middle";
            for (var k = 1; k <= 9; k++) if (s.n[_i9] & 1 << k) c.fillText(k, x + ((k - 1) % 3 + 0.5) * cs / 3, y + (Math.floor((k - 1) / 3) + 0.5) * cs / 3 + 1);
          }
          if (_i9 === s.bad && s.badT > 0) {
            c.fillStyle = "rgba(230,40,40,0.35)";
            c.fillRect(x, y, cs, cs);
            c.fillStyle = "#e53935";
            c.font = "700 ".concat(Math.round(cs * 0.6), "px system-ui, sans-serif");
            c.textAlign = "center";
            c.fillText(s.badV, x + cs / 2, y + cs / 2 + 1);
          }
        }
        c.strokeStyle = dk ? "#444" : "#c8c8c8";
        c.lineWidth = 1;
        for (var _k = 1; _k < 9; _k++) if (_k % 3) {
          c.beginPath();
          c.moveTo(ox + _k * cs, oy);
          c.lineTo(ox + _k * cs, oy + N);
          c.moveTo(ox, oy + _k * cs);
          c.lineTo(ox + N, oy + _k * cs);
          c.stroke();
        }
        c.strokeStyle = fg;
        c.lineWidth = 2.5;
        for (var _k2 = 0; _k2 <= 9; _k2 += 3) {
          c.beginPath();
          c.moveTo(ox + _k2 * cs, oy);
          c.lineTo(ox + _k2 * cs, oy + N);
          c.moveTo(ox, oy + _k2 * cs);
          c.lineTo(ox + N, oy + _k2 * cs);
          c.stroke();
        }
        s.btns.push({
          x: ox,
          y: oy,
          w: N,
          h: N,
          grid: [ox, oy, cs]
        });
        if (s.phase === "play") {
          var py = oy + N + 12,
            pw = (G.W - 16) / 9,
            ph = Math.min(58, G.H - py - 80),
            cnt = new Array(10).fill(0);
          s.g.forEach(function (v) {
            return cnt[v]++;
          });
          for (var _k3 = 1; _k3 <= 9; _k3++) {
            var _x = 8 + (_k3 - 1) * pw;
            c.fillStyle = dk ? "#2a2a2e" : "#eef0f4";
            rr(c, _x + 2, py, pw - 4, ph, 8);
            c.fill();
            c.fillStyle = cnt[_k3] >= 9 ? dk ? "#555" : "#bbb" : s.notes ? dk ? "#aaa" : "#777" : fg;
            c.font = "".concat(s.notes ? 500 : 700, " ").concat(Math.round(Math.min(pw, ph) * 0.55), "px system-ui, sans-serif");
            c.textAlign = "center";
            c.textBaseline = "middle";
            c.fillText(_k3, _x + pw / 2, py + ph / 2 + 1);
            s.btns.push({
              x: _x,
              y: py,
              w: pw,
              h: ph,
              v: _k3
            });
          }
          var by = py + ph + 10,
            _bw = (G.W - 32) / 3;
          [["All puzzles", "menu"], [s.notes ? "Notes: on" : "Notes: off", "notes"], ["Erase", "erase"]].forEach(function (_ref7, i) {
            var _ref8 = _slicedToArray(_ref7, 2),
              t = _ref8[0],
              k = _ref8[1];
            var x = 8 + i * (_bw + 8),
              on = k === "notes" ? s.notes : k === "rot" && s.sel >= 0;
            s.btns.push(Object.assign(G.pill(c, x, by, _bw, 46, t, on), {
              k: k
            }));
          });
        } else {
          c.fillStyle = fg;
          c.font = "700 24px ".concat(G.TITLE);
          c.textAlign = "center";
          c.fillText("Solved! ".concat(s["final"], " pts"), G.W / 2, oy + N + 50);
        }
      }
      if (s.msgT > 0 && s.msg) {
        c.save();
        c.globalAlpha = Math.min(1, s.msgT * 2);
        c.font = "600 14px ".concat(G.UI);
        c.textAlign = "center";
        c.textBaseline = "middle";
        var w = c.measureText(s.msg).width + 26;
        c.fillStyle = dk ? "#fff" : "#111";
        rr(c, G.W / 2 - w / 2, G.H * 0.45, w, 32, 8);
        c.fill();
        c.fillStyle = dk ? "#111" : "#fff";
        c.fillText(s.msg, G.W / 2, G.H * 0.45 + 16);
        c.restore();
      }
    },
    tap: function tap(G, x, y) {
      var s = G.s,
        b = s.btns.find(function (b) {
          return x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h;
        });
      if (!b) return;
      if (b.d !== undefined) return this.open(G, b.d);
      if (s.phase !== "play") return;
      if (b.grid) {
        var _b$grid = _slicedToArray(b.grid, 3),
          ox = _b$grid[0],
          oy = _b$grid[1],
          cs = _b$grid[2],
          _i0 = Math.min(8, Math.floor((y - oy) / cs)) * 9 + Math.min(8, Math.floor((x - ox) / cs));
        s.sel = _i0;
        return;
      }
      if (b.v) return this.put(G, b.v);
      if (b.k === "erase") return this.put(G, 0);
      if (b.k === "notes") {
        s.notes = !s.notes;
        return;
      }
      if (b.k === "menu") {
        this.persist(G);
        s.phase = "pick";
        s.sel = -1;
      }
    },
    swipe: function swipe(G, dx, dy) {
      var s = G.s;
      if (s.phase !== "play" || s.sel < 0) return;
      var r = Math.max(0, Math.min(8, Math.floor(s.sel / 9) + dy)),
        cc = Math.max(0, Math.min(8, s.sel % 9 + dx));
      s.sel = r * 9 + cc;
    },
    onKey: function onKey(G, k, d) {
      if (!d) return;
      var s = G.s;
      if (s.phase !== "play") return;
      if (/^[1-9]$/.test(k)) this.put(G, +k);else if (k === "Backspace" || k === "0") this.put(G, 0);else if (k === "n") s.notes = !s.notes;else if (/^Arrow/.test(k)) {
        if (s.sel < 0) s.sel = 0;else this.swipe(G, k === "ArrowLeft" ? -1 : k === "ArrowRight" ? 1 : 0, k === "ArrowUp" ? -1 : k === "ArrowDown" ? 1 : 0);
      }
    }
  });
})();