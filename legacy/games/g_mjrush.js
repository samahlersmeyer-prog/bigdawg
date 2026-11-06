function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
(function () {
  var FACES = ["🐶", "🦴", "🎾", "🐾", "🏈", "⚾", "🏀", "⚽", "🏒", "⛳", "🌭", "🍕", "🍔", "🌮", "🍩", "🍪", "🧀", "🥨", "🍿", "🏆"];
  var BG = ["#fff4d6", "#e8f4ff", "#eaf7e4", "#fde8ef", "#efe8ff"];
  var POS = [];
  for (var r = 0; r < 6; r++) for (var c = 0; c < 8; c++) if (!((r === 0 || r === 5) && (c === 0 || c === 7))) POS.push([c, r, 0]);
  for (var _r = 1; _r < 5; _r++) for (var _c = 1; _c < 7; _c++) POS.push([_c, _r, 1]);
  for (var _r2 = 2; _r2 < 4; _r2++) for (var _c2 = 2; _c2 < 6; _c2++) POS.push([_c2, _r2, 2]);
  POS.push([3, 2.5, 3], [4, 2.5, 3]);
  var _unused = function _unused() {
    var _KEY$split$map = KEY.split("-").map(Number),
      _KEY$split$map2 = _slicedToArray(_KEY$split$map, 3),
      y = _KEY$split$map2[0],
      m = _KEY$split$map2[1],
      d = _KEY$split$map2[2];
    return Math.round((Date.UTC(y, m - 1, d) - Date.UTC(2026, 9, 27)) / 864e5);
  };
  var _rk = function _rk() {
    return "bdd:den:mahjong:" + KEY + ":" + (me ? me.id : "");
  };
  var rr = function rr(c, x, y, w, h, r) {
    c.beginPath();
    if (c.roundRect) c.roundRect(x, y, w, h, r);else c.rect(x, y, w, h);
  };
  var mmss = function mmss(t) {
    return "".concat(Math.floor(t / 60), ":").concat(String(Math.floor(t % 60)).padStart(2, "0"));
  };
  function rng(str) {
    var h = 1779033703 ^ str.length;
    for (var i = 0; i < str.length; i++) {
      h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
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
  function isFree(i, alive) {
    var _POS$i = _slicedToArray(POS[i], 3),
      c = _POS$i[0],
      r = _POS$i[1],
      l = _POS$i[2];
    var left = false,
      right = false;
    var _iterator = _createForOfIteratorHelper(alive),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var j = _step.value;
        if (j === i) continue;
        var _POS$j = _slicedToArray(POS[j], 3),
          c2 = _POS$j[0],
          r2 = _POS$j[1],
          l2 = _POS$j[2];
        if (l2 > l && Math.abs(c2 - c) < 1 && Math.abs(r2 - r) < 1) return false;
        if (l2 === l && Math.abs(r2 - r) < 1) {
          if (c2 === c - 1) left = true;
          if (c2 === c + 1) right = true;
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
    return !(left && right);
  }
  function redeal(s, R) {
    var cnt = {};
    s.alive.forEach(function (i) {
      return cnt[s.face[i]] = (cnt[s.face[i]] || 0) + 1;
    });
    var kinds = [];
    Object.keys(cnt).forEach(function (k) {
      for (var n = 0; n < cnt[k] / 2; n++) kinds.push(+k);
    });
    var at = s.alive,
      f = deal(R, at, kinds);
    if (!f) {
      var mid = [3.5, 2.5],
        flat = POS.map(function (p, i) {
          return i;
        }).filter(function (i) {
          return POS[i][2] === 0;
        }).sort(function (a, b) {
          return Math.hypot(POS[a][0] - mid[0], (POS[a][1] - mid[1]) * 1.6) - Math.hypot(POS[b][0] - mid[0], (POS[b][1] - mid[1]) * 1.6);
        });
      at = flat.slice(0, s.alive.length);
      f = deal(R, at, kinds);
    }
    if (!f) return false;
    s.alive = at.slice();
    at.forEach(function (i) {
      return s.face[i] = f[i];
    });
    return true;
  }
  function deal(R, alive, kindsIn) {
    var _loop = function _loop() {
        var left = alive.slice(),
          face = {};
        var k = 0,
          ok = true;
        var kinds = kindsIn ? kindsIn.slice() : [];
        if (!kindsIn) for (var p = 0; p < alive.length / 2; p++) kinds.push(p % FACES.length);
        for (var i = kinds.length - 1; i > 0; i--) {
          var j = Math.floor(R() * (i + 1));
          var _ref = [kinds[j], kinds[i]];
          kinds[i] = _ref[0];
          kinds[j] = _ref[1];
        }
        while (left.length) {
          var free = left.filter(function (i) {
            return isFree(i, left);
          });
          if (free.length < 2) {
            ok = false;
            break;
          }
          var a = free.splice(Math.floor(R() * free.length), 1)[0],
            b = free[Math.floor(R() * free.length)];
          face[a] = face[b] = kinds[k++];
          left.splice(left.indexOf(a), 1);
          left.splice(left.indexOf(b), 1);
        }
        if (ok) return {
          v: face
        };
      },
      _ret;
    for (var tries = 0; tries < 200; tries++) {
      _ret = _loop();
      if (_ret) return _ret.v;
    }
    return null;
  }
  var START = 90;
  defGame({
    key: "mjrush",
    name: "Mahjong Rush",
    icon: "🀄",
    max: 999999,
    blurb: "Endless tile matching vs the clock.",
    how: "Match pairs of free tiles (nothing on top, left or right side open) before the clock runs out. Every match adds 2 seconds. Match again within 3 seconds to build a combo (x2, x3, up to x5) for bigger points. Clear the board for +25 seconds and a level bonus, then a new board deals. Out of matches? Shuffle is free but costs 5 seconds. Hint costs 5 seconds too.",
    reset: function reset(G) {
      G.s = {
        level: 0,
        score: 0,
        time: START,
        combo: 0,
        lastMatch: -99,
        t: 0,
        sel: -1,
        hint: null,
        msg: "",
        msgT: 0,
        btns: [],
        pops: [],
        best: 0
      };
      this.newBoard(G);
    },
    newBoard: function newBoard(G) {
      var s = G.s;
      s.level++;
      var all = POS.map(function (p, i) {
          return i;
        }),
        R = rng("rush" + Math.random());
      var f = deal(R, all);
      s.face = all.map(function (i) {
        return f[i];
      });
      s.alive = all;
      s.sel = -1;
      s.hint = null;
      s.msg = s.level > 1 ? "Level ".concat(s.level, "!") : "Go!";
      s.msgT = 1.3;
    },
    moves: function moves(s) {
      var free = s.alive.filter(function (i) {
          return isFree(i, s.alive);
        }),
        out = [];
      for (var a = 0; a < free.length; a++) for (var b = a + 1; b < free.length; b++) if (s.face[free[a]] === s.face[free[b]]) out.push([free[a], free[b]]);
      return out;
    },
    shuffle: function shuffle(G, paid) {
      var s = G.s;
      if (paid) s.time -= 5;
      s.sel = -1;
      s.hint = null;
      redeal(s, rng("rs" + Math.random()));
      s.msg = paid ? "Shuffled −5s" : "No matches: shuffled";
      s.msgT = 1.1;
    },
    pick: function pick(G, i) {
      var s = G.s;
      s.hint = null;
      if (!isFree(i, s.alive)) {
        G.buzz();
        return;
      }
      if (s.sel < 0 || s.sel === i) {
        s.sel = s.sel === i ? -1 : i;
        return;
      }
      if (s.face[s.sel] !== s.face[i]) {
        s.sel = i;
        return;
      }
      var quick = s.t - s.lastMatch < 3;
      s.combo = quick ? Math.min(5, s.combo + 1) : 1;
      s.lastMatch = s.t;
      var pts = 10 * s.combo * s.level;
      s.score += pts;
      s.time = Math.min(s.time + 2, 180);
      var h = s.hit && s.hit.find(function (x) {
        return x.i === i;
      });
      if (h) s.pops.push({
        x: h.x + h.w / 2,
        y: h.y,
        txt: "+".concat(pts).concat(s.combo > 1 ? " x" + s.combo : ""),
        t: 0.9
      });
      s.alive = s.alive.filter(function (j) {
        return j !== i && j !== s.sel;
      });
      s.sel = -1;
      G.sfx("pop");
      if (!s.alive.length) {
        var bonus = 250 * s.level + Math.floor(s.time) * 5;
        s.score += bonus;
        s.time = Math.min(s.time + 25, 180);
        G.sfx("win");
        s.msg = "Board clear! +".concat(bonus);
        s.msgT = 1.6;
        s.wait = 1.2;
        return;
      }
      if (!this.moves(s).length) this.shuffle(G, false);
    },
    update: function update(G, dt) {
      var s = G.s;
      s.t += dt;
      if (s.msgT > 0) s.msgT -= dt;
      if (s.hint && (s.hint.t -= dt) <= 0) s.hint = null;
      s.pops.forEach(function (p) {
        p.t -= dt;
        p.y -= 30 * dt;
      });
      s.pops = s.pops.filter(function (p) {
        return p.t > 0;
      });
      if (s.wait > 0) {
        s.wait -= dt;
        if (s.wait <= 0) this.newBoard(G);
        return;
      }
      s.time -= dt * (1 + (s.level - 1) * 0.12);
      if (s.t - s.lastMatch > 3) s.combo = 0;
      if (s.time <= 0) {
        s.time = 0;
        G.sfx("lose");
        G.over(s.score, "Level ".concat(s.level, " \xB7 out of time"));
      }
    },
    geo: function geo(G) {
      var tw = Math.min((G.W - 28) / 8.3, (G.H - 200) / 6 / 1.28),
        th = tw * 1.28,
        dep = Math.max(3, tw * 0.09);
      return {
        tw: tw,
        th: th,
        dep: dep,
        ox: (G.W - 8 * tw) / 2 + dep * 1.5,
        oy: 84 + dep * 3
      };
    },
    draw: function draw(G, c) {
      var s = G.s,
        g = this.geo(G);
      var bg = c.createLinearGradient(0, 0, 0, G.H);
      bg.addColorStop(0, "#14532d");
      bg.addColorStop(1, "#0b2e1a");
      c.fillStyle = bg;
      c.fillRect(0, 0, G.W, G.H);
      G.hud(c, "SCORE ".concat(s.score), "LEVEL ".concat(s.level), s.combo > 1 ? "COMBO x".concat(s.combo) : "");
      var bw = G.W - 24,
        frac = Math.max(0, Math.min(1, s.time / 120));
      c.fillStyle = "rgba(255,255,255,0.15)";
      rr(c, 12, 46, bw, 14, 7);
      c.fill();
      c.fillStyle = s.time < 15 ? "#ff5252" : s.time < 35 ? "#ffd23f" : "#69f0ae";
      rr(c, 12, 46, Math.max(14, bw * frac), 14, 7);
      c.fill();
      G.text(c, "".concat(Math.ceil(s.time), "s"), G.W / 2, 72, 10, "#fff");
      var order = s.alive.slice().sort(function (a, b) {
          return POS[a][2] - POS[b][2] || POS[a][1] - POS[b][1] || POS[a][0] - POS[b][0];
        }),
        hint = s.hint ? new Set(s.hint.pair) : null;
      order.forEach(function (i) {
        var _POS$i2 = _slicedToArray(POS[i], 3),
          col = _POS$i2[0],
          row = _POS$i2[1],
          l = _POS$i2[2],
          x = g.ox + col * g.tw - l * g.dep,
          y = g.oy + row * g.th - l * g.dep,
          free = isFree(i, s.alive),
          sel = s.sel === i;
        c.fillStyle = "#8a7350";
        rr(c, x + g.dep, y + g.dep, g.tw - 2, g.th - 2, 6);
        c.fill();
        c.fillStyle = sel ? "#ffd23f" : hint && hint.has(i) ? "#b6f0c2" : BG[s.face[i] % BG.length];
        rr(c, x, y, g.tw - 2, g.th - 2, 6);
        c.fill();
        c.strokeStyle = sel ? "#e0a800" : "rgba(0,0,0,0.3)";
        c.lineWidth = sel ? 2.5 : 1;
        c.stroke();
        G.emoji(c, FACES[s.face[i]], x + (g.tw - 2) / 2, y + (g.th - 2) / 2 + 1, g.tw * 0.62);
        if (!free) {
          c.fillStyle = "rgba(10,30,15,0.38)";
          rr(c, x, y, g.tw - 2, g.th - 2, 6);
          c.fill();
        }
      });
      s.hit = order.slice().reverse().map(function (i) {
        var _POS$i3 = _slicedToArray(POS[i], 3),
          col = _POS$i3[0],
          row = _POS$i3[1],
          l = _POS$i3[2];
        return {
          i: i,
          x: g.ox + col * g.tw - l * g.dep,
          y: g.oy + row * g.th - l * g.dep,
          w: g.tw - 2,
          h: g.th - 2
        };
      });
      s.pops.forEach(function (p) {
        c.globalAlpha = Math.min(1, p.t * 2);
        G.text(c, p.txt, p.x, p.y, 11, "#ffd23f");
        c.globalAlpha = 1;
      });
      var by = g.oy + 6 * g.th + 16,
        w2 = (G.W - 40) / 2;
      s.btns = [];
      [["HINT −5s", "hint"], ["SHUFFLE −5s", "shuf"]].forEach(function (_ref2, i) {
        var _ref3 = _slicedToArray(_ref2, 2),
          t = _ref3[0],
          k = _ref3[1];
        var x = 16 + i * (w2 + 8);
        c.fillStyle = "rgba(255,255,255,0.92)";
        rr(c, x, by, w2, 44, 22);
        c.fill();
        G.text(c, t, x + w2 / 2, by + 22, 10, "#14532d");
        s.btns.push({
          x: x,
          y: by,
          w: w2,
          h: 44,
          k: k
        });
      });
      if (s.msgT > 0 && s.msg) G.banner(c, s.msg, "#ffd23f", G.H * 0.42, 18);
      G.hint(c, "MATCH FREE PAIRS · BEAT THE CLOCK", 4, by + 70);
    },
    tap: function tap(G, x, y) {
      var s = G.s;
      if (s.wait > 0) return;
      var b = s.btns.find(function (b) {
        return x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h;
      });
      if (b) {
        if (b.k === "shuf") return this.shuffle(G, true);
        var m = this.moves(s);
        if (m.length) {
          s.time -= 5;
          s.hint = {
            pair: m[Math.floor(Math.random() * m.length)],
            t: 2
          };
        }
        return;
      }
      var t = s.hit && s.hit.find(function (h) {
        return x >= h.x && x <= h.x + h.w && y >= h.y && y <= h.y + h.h;
      });
      if (t) this.pick(G, t.i);
    }
  });
  defGame({
    key: "mjzen",
    name: "Mahjong Zen",
    icon: "🍵",
    max: 999999,
    blurb: "Relaxed endless tile matching. No clock.",
    how: "The relaxed one: no clock, ever. Match pairs of free tiles (nothing on top, and the left or right side open). Clear a board and a new one deals. Hints and shuffles are free, and it reshuffles for you if you run out of matches. Leave any time; your board is saved. Tap Finish when you want to post your score: 10 per match and 200 per board cleared.",
    save: function save(G) {
      var s = G.s;
      return {
        label: "Board ".concat(s.level, " \xB7 ").concat(s.score, " pts"),
        v: {
          level: s.level,
          score: s.score,
          face: s.face,
          alive: s.alive,
          cleared: s.cleared
        }
      };
    },
    load: function load(G, sv) {
      Object.assign(G.s, sv.v);
      G.s.msg = "Welcome back";
      G.s.msgT = 1.2;
    },
    reset: function reset(G) {
      G.s = {
        level: 0,
        score: 0,
        cleared: 0,
        t: 0,
        sel: -1,
        hint: null,
        msg: "",
        msgT: 0,
        btns: [],
        pops: []
      };
      this.newBoard(G);
    },
    newBoard: function newBoard(G) {
      var s = G.s;
      s.level++;
      var all = POS.map(function (p, i) {
          return i;
        }),
        f = deal(rng("zen" + Math.random()), all);
      s.face = all.map(function (i) {
        return f[i];
      });
      s.alive = all;
      s.sel = -1;
      s.hint = null;
      s.msg = s.level > 1 ? "Board ".concat(s.level) : "Take your time 🍵";
      s.msgT = 1.4;
    },
    moves: function moves(s) {
      var free = s.alive.filter(function (i) {
          return isFree(i, s.alive);
        }),
        out = [];
      for (var a = 0; a < free.length; a++) for (var b = a + 1; b < free.length; b++) if (s.face[free[a]] === s.face[free[b]]) out.push([free[a], free[b]]);
      return out;
    },
    pick: function pick(G, i) {
      var s = G.s;
      s.hint = null;
      if (!isFree(i, s.alive)) {
        G.buzz();
        return;
      }
      if (s.sel < 0 || s.sel === i) {
        s.sel = s.sel === i ? -1 : i;
        return;
      }
      if (s.face[s.sel] !== s.face[i]) {
        s.sel = i;
        return;
      }
      s.score += 10;
      s.alive = s.alive.filter(function (j) {
        return j !== i && j !== s.sel;
      });
      s.sel = -1;
      G.sfx("pop");
      if (!s.alive.length) {
        s.cleared++;
        s.score += 200;
        G.sfx("win");
        s.msg = "Board cleared! +200";
        s.msgT = 1.6;
        s.wait = 1.4;
        return;
      }
      if (!this.moves(s).length) {
        redeal(s, rng("zs" + Math.random()));
        s.msg = "Reshuffled for you";
        s.msgT = 1.3;
      }
    },
    update: function update(G, dt) {
      var s = G.s;
      s.t += dt;
      if (s.msgT > 0) s.msgT -= dt;
      if (s.hint && (s.hint.t -= dt) <= 0) s.hint = null;
      if (s.wait > 0) {
        s.wait -= dt;
        if (s.wait <= 0) this.newBoard(G);
      }
    },
    geo: function geo(G) {
      var tw = Math.min((G.W - 28) / 8.3, (G.H - 190) / 6 / 1.28),
        th = tw * 1.28,
        dep = Math.max(3, tw * 0.09);
      return {
        tw: tw,
        th: th,
        dep: dep,
        ox: (G.W - 8 * tw) / 2 + dep * 1.5,
        oy: 56 + dep * 3
      };
    },
    draw: function draw(G, c) {
      var s = G.s,
        g = this.geo(G);
      var bg = c.createLinearGradient(0, 0, 0, G.H);
      bg.addColorStop(0, "#2f4f4f");
      bg.addColorStop(1, "#1f3535");
      c.fillStyle = bg;
      c.fillRect(0, 0, G.W, G.H);
      G.hud(c, "SCORE ".concat(s.score), "BOARD ".concat(s.level), "".concat(s.alive.length, " LEFT"));
      var order = s.alive.slice().sort(function (a, b) {
          return POS[a][2] - POS[b][2] || POS[a][1] - POS[b][1] || POS[a][0] - POS[b][0];
        }),
        hint = s.hint ? new Set(s.hint.pair) : null;
      order.forEach(function (i) {
        var _POS$i4 = _slicedToArray(POS[i], 3),
          col = _POS$i4[0],
          row = _POS$i4[1],
          l = _POS$i4[2],
          x = g.ox + col * g.tw - l * g.dep,
          y = g.oy + row * g.th - l * g.dep,
          free = isFree(i, s.alive),
          sel = s.sel === i;
        c.fillStyle = "#8a7350";
        rr(c, x + g.dep, y + g.dep, g.tw - 2, g.th - 2, 6);
        c.fill();
        c.fillStyle = sel ? "#ffd23f" : hint && hint.has(i) ? "#b6f0c2" : BG[s.face[i] % BG.length];
        rr(c, x, y, g.tw - 2, g.th - 2, 6);
        c.fill();
        c.strokeStyle = sel ? "#e0a800" : "rgba(0,0,0,0.3)";
        c.lineWidth = sel ? 2.5 : 1;
        c.stroke();
        G.emoji(c, FACES[s.face[i]], x + (g.tw - 2) / 2, y + (g.th - 2) / 2 + 1, g.tw * 0.62);
        if (!free) {
          c.fillStyle = "rgba(10,25,25,0.38)";
          rr(c, x, y, g.tw - 2, g.th - 2, 6);
          c.fill();
        }
      });
      s.hit = order.slice().reverse().map(function (i) {
        var _POS$i5 = _slicedToArray(POS[i], 3),
          col = _POS$i5[0],
          row = _POS$i5[1],
          l = _POS$i5[2];
        return {
          i: i,
          x: g.ox + col * g.tw - l * g.dep,
          y: g.oy + row * g.th - l * g.dep,
          w: g.tw - 2,
          h: g.th - 2
        };
      });
      var by = g.oy + 6 * g.th + 16,
        w3 = (G.W - 48) / 3;
      s.btns = [];
      [["HINT", "hint"], ["SHUFFLE", "shuf"], ["FINISH", "fin"]].forEach(function (_ref4, i) {
        var _ref5 = _slicedToArray(_ref4, 2),
          tx = _ref5[0],
          k = _ref5[1];
        var x = 16 + i * (w3 + 8);
        c.fillStyle = k === "fin" ? "#ffd23f" : "rgba(255,255,255,0.92)";
        rr(c, x, by, w3, 44, 22);
        c.fill();
        G.text(c, tx, x + w3 / 2, by + 22, 10, "#1f3535");
        s.btns.push({
          x: x,
          y: by,
          w: w3,
          h: 44,
          k: k
        });
      });
      if (s.msgT > 0 && s.msg) G.banner(c, s.msg, "#ffd23f", G.H * 0.42, 18);
      G.hint(c, "NO CLOCK · TAP FINISH TO POST YOUR SCORE", 5, by + 70);
    },
    tap: function tap(G, x, y) {
      var s = G.s;
      if (s.wait > 0) return;
      var b = s.btns.find(function (b) {
        return x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h;
      });
      if (b) {
        if (b.k === "fin") return G.over(s.score, s.cleared ? "".concat(s.cleared, " board").concat(s.cleared > 1 ? "s" : "", " cleared \uD83C\uDF75") : "Nice and easy 🍵");
        if (b.k === "shuf") {
          redeal(s, rng("zs" + Math.random()));
          s.sel = -1;
          s.msg = "Shuffled";
          s.msgT = 1;
          return;
        }
        var m = this.moves(s);
        if (m.length) s.hint = {
          pair: m[Math.floor(Math.random() * m.length)],
          t: 2.5
        };
        return;
      }
      var tl = s.hit && s.hit.find(function (h) {
        return x >= h.x && x <= h.x + h.w && y >= h.y && y <= h.y + h.h;
      });
      if (tl) this.pick(G, tl.i);
    }
  });
})();