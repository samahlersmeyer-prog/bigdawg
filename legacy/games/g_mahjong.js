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
  var dayN = function dayN() {
    var _KEY$split$map = KEY.split("-").map(Number),
      _KEY$split$map2 = _slicedToArray(_KEY$split$map, 3),
      y = _KEY$split$map2[0],
      m = _KEY$split$map2[1],
      d = _KEY$split$map2[2];
    return Math.round((Date.UTC(y, m - 1, d) - Date.UTC(2026, 9, 27)) / 864e5);
  };
  var rk = function rk() {
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
  var speed = function speed(sec, limit, pts) {
    return Math.round(pts * Math.max(0, 1 - sec / limit));
  };
  var scoreOf = function scoreOf(s) {
    return Math.max(100, 700 + speed(s.el, 600, 300) - Math.round(s.pen));
  };
  defGame({
    key: "mahjong",
    name: "Mahjong",
    icon: "🀄",
    max: 1500,
    cat: "den",
    puzzle: true,
    blurb: "Daily: match pairs, clear the board.",
    how: "Clear the board by matching pairs of the same tile. You can only take a tile that's free: nothing stacked on top of it, and its left or right side open. Free tiles are bright; blocked ones are shaded. Stuck? Hint shows a pair and Shuffle mixes the tiles left; each costs a few points. Same board for everyone, one go per day, always solvable. Score: 700 for clearing the board, plus a bonus of up to 300 for going quick, minus a little for each hint or shuffle. No clock on screen, so take your time.",
    reset: function reset(G) {
      var s = G.s = {
        btns: [],
        sel: -1,
        msg: "",
        msgT: 0,
        postT: 0,
        hint: null
      };
      var r = store.get(rk());
      if (r && r.face) Object.assign(s, {
        face: r.face,
        alive: r.alive.slice(),
        el: r.el || 0,
        pen: r.pen || 0,
        done: !!r.done,
        posted: !!r.posted,
        shuf: r.shuf || 0
      });else {
        var all = POS.map(function (p, i) {
            return i;
          }),
          f = deal(rng("dawg-mahjong-" + KEY), all),
          face = all.map(function (i) {
            return f[i];
          });
        Object.assign(s, {
          face: face,
          alive: all,
          el: 0,
          pen: 0,
          done: false,
          posted: false,
          shuf: 0
        });
      }
    },
    persist: function persist(G) {
      var s = G.s;
      store.set(rk(), {
        face: s.face,
        alive: s.alive,
        el: s.el,
        pen: s.pen,
        done: s.done,
        posted: s.posted,
        shuf: s.shuf,
        score: s.done ? scoreOf(s) : 0
      });
    },
    info: function info(G) {
      var s = G.s,
        t = s.el + s.pen,
        sc = scoreOf(s);
      return {
        score: sc,
        title: t < 180 ? "Cleared! Speedy 🐶" : "Board cleared! 🀄",
        sub: "".concat(mmss(t)).concat(s.pen ? " · with a little help" : "", " \xB7 ").concat(sc, " pts."),
        share: "Mahjong #".concat(dayN() + 1, " \xB7 ").concat(mmss(t), " \uD83C\uDC04")
      };
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
        s.msg = "That tile is blocked";
        s.msgT = 0.9;
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
      s.alive = s.alive.filter(function (j) {
        return j !== i && j !== s.sel;
      });
      s.sel = -1;
      G.sfx("pop");
      if (!s.alive.length) {
        s.done = true;
        s.postT = 1.2;
        G.sfx("win");
        s.msg = "Board cleared! 🐶";
        s.msgT = 1.6;
      } else if (!this.moves(s).length) {
        this.shuffle(G, true);
        s.msg = "No matches left, so we reshuffled";
        s.msgT = 2;
      }
      this.persist(G);
    },
    shuffle: function shuffle(G, free) {
      var s = G.s;
      s.shuf++;
      if (!free) s.pen += 30;
      s.sel = -1;
      s.hint = null;
      redeal(s, rng("dawg-mahjong-" + KEY + "-" + s.shuf + "-" + s.alive.length));
      s.msg = "Shuffled";
      s.msgT = 1.2;
      this.persist(G);
    },
    update: function update(G, dt) {
      var s = G.s;
      if (s.msgT > 0) s.msgT -= dt;
      if (s.hint && (s.hint.t -= dt) <= 0) s.hint = null;
      if (!s.done) {
        s.el += dt;
        s.ck = (s.ck || 0) + dt;
        if (s.ck > 2) {
          s.ck = 0;
          this.persist(G);
        }
      }
      if (s.done && !s.posted && s.postT > 0) {
        s.postT -= dt;
        if (s.postT <= 0) {
          s.posted = true;
          this.persist(G);
          G.post(scoreOf(s), this.info(G));
        }
      }
    },
    geo: function geo(G) {
      var tw = Math.min((G.W - 28) / 8.3, (G.H - 190) / 6 / 1.28),
        th = tw * 1.28,
        dep = Math.max(3, tw * 0.09);
      var ox = (G.W - 8 * tw) / 2 + dep * 1.5,
        oy = 52 + dep * 3;
      return {
        tw: tw,
        th: th,
        dep: dep,
        ox: ox,
        oy: oy
      };
    },
    draw: function draw(G, c) {
      var s = G.s,
        dk = G.dark(),
        ink = dk ? "#fff" : "#121213",
        g = this.geo(G);
      c.fillStyle = dk ? "#121213" : "#fff";
      c.fillRect(0, 0, G.W, G.H);
      s.btns = [];
      c.fillStyle = ink;
      c.font = "500 15px ".concat(G.UI);
      c.textAlign = "left";
      c.textBaseline = "middle";
      c.fillText(s.done ? "Board cleared! 🐶" : "".concat(s.alive.length, " tiles left"), 14, 22);
      var order = s.alive.slice().sort(function (a, b) {
        return POS[a][2] - POS[b][2] || POS[a][1] - POS[b][1] || POS[a][0] - POS[b][0];
      });
      var hint = s.hint ? new Set(s.hint.pair) : null;
      order.forEach(function (i) {
        var _POS$i2 = _slicedToArray(POS[i], 3),
          col = _POS$i2[0],
          row = _POS$i2[1],
          l = _POS$i2[2],
          x = g.ox + col * g.tw - l * g.dep,
          y = g.oy + row * g.th - l * g.dep,
          free = isFree(i, s.alive),
          sel = s.sel === i;
        c.fillStyle = dk ? "#5b4a33" : "#c9b48a";
        rr(c, x + g.dep, y + g.dep, g.tw - 2, g.th - 2, 6);
        c.fill();
        c.fillStyle = sel ? "#ffd23f" : hint && hint.has(i) ? "#b6f0c2" : BG[s.face[i] % BG.length];
        rr(c, x, y, g.tw - 2, g.th - 2, 6);
        c.fill();
        c.strokeStyle = sel ? "#e0a800" : "rgba(0,0,0,0.28)";
        c.lineWidth = sel ? 2.5 : 1;
        c.stroke();
        G.emoji(c, FACES[s.face[i]], x + (g.tw - 2) / 2, y + (g.th - 2) / 2 + 1, g.tw * 0.62);
        if (!free) {
          c.fillStyle = "rgba(20,20,30,0.32)";
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
      var by = g.oy + 6 * g.th + 18,
        bw = (G.W - 48) / 3;
      if (!s.done) {
        s.btns.push(Object.assign(G.pill(c, 16, by, bw, 46, "Hint"), {
          k: "hint"
        }));
        s.btns.push(Object.assign(G.pill(c, 24 + bw, by, bw, 46, "Shuffle"), {
          k: "shuf"
        }));
        c.fillStyle = dk ? "#aaa" : "#666";
        c.font = "500 13px ".concat(G.UI);
        c.textAlign = "center";
        c.fillText("".concat(this.moves(s).length, " matches open"), 32 + 2.5 * bw, by + 23);
      } else if (s.posted) {
        var w = Math.min(260, G.W - 40);
        s.btns.push(Object.assign(G.pill(c, G.W / 2 - w / 2, by, w, 46, "See results \xB7 ".concat(mmss(s.el + s.pen)), true), {
          k: "res"
        }));
      }
      if (s.msgT > 0 && s.msg) {
        c.save();
        c.globalAlpha = Math.min(1, s.msgT * 2);
        c.font = "600 15px ".concat(G.UI);
        c.textAlign = "center";
        var _w = c.measureText(s.msg).width + 30;
        c.fillStyle = dk ? "#fff" : "#121213";
        rr(c, G.W / 2 - _w / 2, 34, _w, 34, 8);
        c.fill();
        c.fillStyle = dk ? "#121213" : "#fff";
        c.fillText(s.msg, G.W / 2, 51);
        c.restore();
      }
    },
    tap: function tap(G, x, y) {
      var s = G.s,
        b = s.btns.find(function (b) {
          return x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h;
        });
      if (b) {
        if (b.k === "res") return G.results(this.info(G));
        if (s.done) return;
        if (b.k === "hint") {
          var m = this.moves(s);
          if (!m.length) {
            s.msg = "No matches. Tap Shuffle.";
            s.msgT = 1.5;
            return;
          }
          s.pen += 15;
          s.hint = {
            pair: m[Math.floor(Math.random() * m.length)],
            t: 2.5
          };
          this.persist(G);
          return;
        }
        if (b.k === "shuf") return this.shuffle(G);
        return;
      }
      if (s.done || !s.hit) return;
      var t = s.hit.find(function (h) {
        return x >= h.x && x <= h.x + h.w && y >= h.y && y <= h.y + h.h;
      });
      if (t) this.pick(G, t.i);
    }
  });
})();