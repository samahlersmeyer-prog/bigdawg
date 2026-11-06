function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
defGame({
  key: "fall",
  name: "Fall Dawg",
  icon: "⬇️",
  max: 99999,
  blurb: "Roll through the gaps. Don't hit the spikes.",
  how: "The bars keep rising. Hold the left or right side of the screen (or use the arrow keys) to roll the Big Dawg into a gap and drop through. Every row you drop is +10, and bones in the gaps are +25. If the bars push you up into the spikes at the top, it's over. It gets faster the longer you last.",
  ROWGAP: 92,
  TOP: 48,
  reset: function reset(G) {
    var W = G.W,
      H = G.H;
    var s = G.s = {
      p: {
        x: W / 2,
        y: H * 0.3,
        vx: 0,
        vy: 0,
        rot: 0
      },
      rows: [],
      hold: 0,
      keys: {},
      t: 0,
      spd: 62,
      pts: 0,
      pops: [],
      stars: [],
      lastSpd: 0
    };
    for (var i = 0; i < 40; i++) s.stars.push({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.6 + 0.3
    });
    var y = H * 0.48;
    while (y < H + this.ROWGAP * 2) {
      s.rows.push(this.row(G, y));
      y += this.ROWGAP;
    }
  },
  row: function row(G, y) {
    var s = G.s,
      W = G.W;
    var gw = Math.max(50, 86 - s.t * 0.55);
    var gaps = [];
    var two = s.t < 25 && Math.random() < 0.35;
    var n = two ? 2 : 1;
    var _loop = function _loop() {
      var x,
        tries = 0;
      do {
        x = 8 + Math.random() * (W - gw - 16);
        tries++;
      } while (tries < 20 && gaps.some(function (g) {
        return Math.abs(g.x - x) < gw + 40;
      }));
      gaps.push({
        x: x,
        w: gw
      });
    };
    for (var k = 0; k < n; k++) {
      _loop();
    }
    var g0 = gaps[0];
    return {
      y: y,
      gaps: gaps,
      hue: (y * 0.7 + s.t * 20) % 360,
      bone: Math.random() < 0.28 ? {
        x: g0.x + g0.w / 2,
        got: 0
      } : null,
      passed: false
    };
  },
  inGap: function inGap(row, x, r) {
    return row.gaps.some(function (g) {
      return x - r * 0.55 >= g.x && x + r * 0.55 <= g.x + g.w;
    });
  },
  update: function update(G, dt) {
    var s = G.s,
      p = s.p,
      W = G.W,
      H = G.H,
      R = 14;
    s.t += dt;
    s.spd = Math.min(250, 62 + s.t * 3.1);
    if (Math.floor(s.spd / 40) > s.lastSpd) {
      if (s.lastSpd) s.pops.push({
        x: W / 2,
        y: H * 0.5,
        t: 1.1,
        txt: "FASTER!"
      });
      s.lastSpd = Math.floor(s.spd / 40);
    }
    var d = s.spd * dt;
    s.rows.forEach(function (r) {
      return r.y -= d;
    });
    s.stars.forEach(function (st) {
      st.y -= d * 0.25;
      if (st.y < 0) {
        st.y += H;
        st.x = Math.random() * W;
      }
    });
    while (s.rows.length && s.rows[0].y < this.TOP - 20) s.rows.shift();
    while (s.rows[s.rows.length - 1].y < H + this.ROWGAP) s.rows.push(this.row(G, s.rows[s.rows.length - 1].y + this.ROWGAP));
    var dir = s.hold || (s.keys.ArrowRight ? 1 : 0) - (s.keys.ArrowLeft ? 1 : 0);
    p.vx += (dir * 300 - p.vx) * Math.min(1, dt * 8);
    p.x = Math.max(R, Math.min(W - R, p.x + p.vx * dt));
    p.rot += p.vx * dt / R;
    var prevBottom = p.y + R;
    p.vy = Math.min(620, p.vy + 1500 * dt);
    p.y += p.vy * dt;
    var _iterator = _createForOfIteratorHelper(s.rows),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var r = _step.value;
        if (this.inGap(r, p.x, R)) continue;
        if (prevBottom <= r.y + d + 0.5 && p.y + R >= r.y) {
          p.y = r.y - R;
          p.vy = 0;
          break;
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
    if (p.y > H - R) {
      p.y = H - R;
      p.vy = 0;
    }
    var _iterator2 = _createForOfIteratorHelper(s.rows),
      _step2;
    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        var _r = _step2.value;
        if (!_r.passed && p.y - R > _r.y + 6) {
          _r.passed = true;
          s.pts += 10;
        }
        if (_r.bone && !_r.bone.got && Math.abs(p.x - _r.bone.x) < 20 && Math.abs(p.y - (_r.y - 4)) < 22) {
          _r.bone.got = 1;
          s.pts += 25;
          G.sfx("pop");
          s.pops.push({
            x: _r.bone.x,
            y: _r.y - 20,
            t: 0.8,
            txt: "+25"
          });
        }
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }
    s.pops.forEach(function (o) {
      o.t -= dt;
      o.y -= 30 * dt;
    });
    s.pops = s.pops.filter(function (o) {
      return o.t > 0;
    });
    if (p.y - R < this.TOP) {
      G.sfx("lose");
      G.buzz();
      var sc = s.pts;
      G.over(sc, sc >= 1500 ? "Bottomless dawg!" : sc >= 500 ? "Spiked!" : "Keep rolling!");
    }
  },
  side: function side(G, x) {
    G.s.hold = x < G.W / 2 ? -1 : 1;
  },
  down: function down(G, x) {
    this.side(G, x);
  },
  move: function move(G, x) {
    if (G.s.hold) this.side(G, x);
  },
  up: function up(G) {
    G.s.hold = 0;
  },
  onKey: function onKey(G, k, isDown) {
    if (k === "ArrowLeft" || k === "ArrowRight") G.s.keys[k] = isDown;
  },
  draw: function draw(G, c) {
    var s = G.s,
      W = G.W,
      H = G.H,
      p = s.p,
      dark = G.dark();
    var g = c.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, dark ? "#0b0b1e" : "#1d1b4a");
    g.addColorStop(1, dark ? "#1a1236" : "#4a2a7a");
    c.fillStyle = g;
    c.fillRect(0, 0, W, H);
    c.fillStyle = "rgba(255,255,255,0.7)";
    s.stars.forEach(function (st) {
      c.beginPath();
      c.arc(st.x, st.y, st.r, 0, 7);
      c.fill();
    });
    var _iterator3 = _createForOfIteratorHelper(s.rows),
      _step3;
    try {
      var _loop2 = function _loop2() {
        var r = _step3.value;
        var segs = [];
        var x = 0;
        r.gaps.slice().sort(function (a, b) {
          return a.x - b.x;
        }).forEach(function (gp) {
          segs.push([x, gp.x]);
          x = gp.x + gp.w;
        });
        segs.push([x, W]);
        segs.forEach(function (_ref) {
          var _ref2 = _slicedToArray(_ref, 2),
            a = _ref2[0],
            b = _ref2[1];
          if (b - a < 1) return;
          c.fillStyle = "hsl(".concat(r.hue, ",70%,58%)");
          c.beginPath();
          if (c.roundRect) c.roundRect(a, r.y, b - a, 12, 6);else c.rect(a, r.y, b - a, 12);
          c.fill();
          c.fillStyle = "rgba(255,255,255,0.35)";
          c.fillRect(a + 4, r.y + 2, Math.max(0, b - a - 8), 3);
        });
        if (r.bone && !r.bone.got) G.emoji(c, "🦴", r.bone.x, r.y - 4, 18);
      };
      for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
        _loop2();
      }
    } catch (err) {
      _iterator3.e(err);
    } finally {
      _iterator3.f();
    }
    c.fillStyle = "#ff4d6d";
    for (var x = 0; x < W; x += 14) {
      c.beginPath();
      c.moveTo(x, this.TOP - 12);
      c.lineTo(x + 7, this.TOP);
      c.lineTo(x + 14, this.TOP - 12);
      c.fill();
    }
    c.fillStyle = "#ff4d6d";
    c.fillRect(0, 34, W, this.TOP - 46);
    var near = Math.max(0, 1 - (p.y - this.TOP) / 120);
    if (near > 0) {
      c.fillStyle = "rgba(255,60,90,".concat(0.25 * near, ")");
      c.fillRect(0, 0, W, H);
    }
    G.img(c, G.state === "over" ? ":dawgpain:" : near > 0.5 ? ":dawgpog:" : ":dawgW:", p.x, p.y, 30, p.rot);
    s.pops.forEach(function (o) {
      c.globalAlpha = Math.min(1, o.t * 2);
      G.text(c, o.txt, o.x, o.y, 12, "#ffd23f");
      c.globalAlpha = 1;
    });
    G.hud(c, "SCORE ".concat(s.pts), "FALL DAWG", "".concat(Math.round(s.spd)));
    if (G.state === "play") G.hint(c, "HOLD LEFT / RIGHT", 4);
  }
});