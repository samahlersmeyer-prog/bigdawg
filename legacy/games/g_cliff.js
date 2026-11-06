function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
defGame({
  key: "cliff",
  name: "Cliff Dawg",
  icon: "🏞️",
  max: 99999,
  blurb: "Leap, steer, nail the tiny pool. 3 lives.",
  how: "Hold anywhere to charge your jump (the meter swings up and down), then let go to leap off the cliff. Too weak and you hit the cliff, too strong and you hit the far wall. While you fall, hold the left or right side (or the arrow keys) to steer. The canyon gets narrower toward the bottom, and rocks stick out of the walls on deeper dives. Land in the pool to score, more for hitting the middle and +100 for a PERFECT. Every dive is deeper and tighter. You get 3 lives: hit a wall and you climb back up to try that same dive again. Lose all 3 and the run is over.",
  R: 12,
  STEP: 30,
  CHARGE: 1.7,
  reset: function reset(G) {
    G.s = {
      lvl: 1,
      pts: 0,
      streak: 0,
      lives: 3,
      keys: {},
      hold: 0,
      pops: [],
      drops: []
    };
    this.level(G);
  },
  level: function level(G) {
    var s = G.s,
      W = G.W,
      H = G.H,
      lvl = s.lvl;
    var D = Math.min(3600, 1100 + lvl * 260);
    var pw = Math.max(40, 112 - lvl * 7);
    var cx = W * 0.5 + (Math.random() - 0.5) * W * Math.min(0.42, 0.12 + lvl * 0.05);
    var L0 = Math.min(90, W * 0.2),
      R0 = W - 24;
    var n = Math.ceil(D / this.STEP) + 1,
      L = [],
      Rt = [];
    for (var i = 0; i < n; i++) {
      var f = Math.min(1, i * this.STEP / D),
        e = Math.pow(f, 1.7);
      L.push(L0 + (cx - pw / 2 - L0) * e);
      Rt.push(R0 + (cx + pw / 2 - R0) * e);
    }
    var rocks = Math.min(8, lvl - 1 + Math.floor(lvl / 3));
    for (var k = 0; k < rocks; k++) {
      var _i = Math.floor(n * (0.15 + Math.random() * 0.65)),
        span = 4 + Math.floor(Math.random() * 3),
        left = Math.random() < 0.5;
      var gap = Rt[_i] - L[_i],
        amp = Math.min(gap - pw - 46, 24 + Math.random() * (14 + lvl * 5));
      if (amp < 12) continue;
      for (var j = -span; j <= span; j++) {
        var q = _i + j;
        if (q < 1 || q >= n - 4) continue;
        var a = amp * (1 - Math.abs(j) / (span + 1));
        if (left) L[q] = Math.max(L[q], Math.min(L[q] + a, Rt[q] - pw - 40));else Rt[q] = Math.min(Rt[q], Math.max(Rt[q] - a, L[q] + pw + 40));
      }
    }
    var bones = [];
    for (var _k = 0; _k < 3 + Math.min(4, lvl); _k++) {
      var y = D * (0.2 + 0.7 * Math.random()),
        w = this.walls(L, Rt, y);
      bones.push({
        x: w[0] + (w[1] - w[0]) * (0.25 + Math.random() * 0.5),
        y: y,
        got: 0
      });
    }
    Object.assign(s, {
      D: D,
      pw: pw,
      cx: cx,
      L: L,
      Rt: Rt,
      bones: bones,
      L0: L0,
      splash: 0,
      camY: -H * 0.42
    });
    this.respawn(G);
  },
  respawn: function respawn(G) {
    var s = G.s;
    Object.assign(s, {
      phase: "aim",
      charging: false,
      charge: 0,
      ct: 0,
      hold: 0,
      p: {
        x: s.L0 - 26,
        y: -this.R,
        vx: 0,
        vy: 0,
        rot: 0
      }
    });
  },
  walls: function walls(L, Rt, y) {
    var f = Math.max(0, y) / this.STEP,
      i = Math.min(L.length - 2, Math.floor(f)),
      t = Math.min(1, f - i);
    return [L[i] + (L[i + 1] - L[i]) * t, Rt[i] + (Rt[i + 1] - Rt[i]) * t];
  },
  jump: function jump(G) {
    var s = G.s;
    if (s.phase !== "aim" || !s.charging) return;
    s.charging = false;
    s.phase = "fall";
    s.p.vx = 40 + s.charge * (G.W * 0.75);
    s.p.vy = -300;
    G.sfx("pop");
  },
  update: function update(G, dt) {
    var s = G.s,
      p = s.p,
      H = G.H,
      R = this.R;
    s.pops.forEach(function (o) {
      o.t -= dt;
      o.y -= 30 * dt;
    });
    s.pops = s.pops.filter(function (o) {
      return o.t > 0;
    });
    s.drops.forEach(function (d) {
      d.x += d.vx * dt;
      d.y += d.vy * dt;
      d.vy += 700 * dt;
      d.t -= dt;
    });
    s.drops = s.drops.filter(function (d) {
      return d.t > 0;
    });
    if (s.phase === "aim") {
      if (s.charging) {
        s.ct += dt;
        s.charge = 0.5 - 0.5 * Math.cos(s.ct * Math.PI / this.CHARGE);
      }
      s.camY += (-H * 0.42 - s.camY) * Math.min(1, dt * 5);
      return;
    }
    if (s.phase === "crash") {
      s.splash -= dt;
      p.vy = Math.min(500, p.vy + 900 * dt);
      p.y += p.vy * dt;
      p.rot += 8 * dt;
      if (s.splash <= 0) this.respawn(G);
      return;
    }
    if (s.phase === "splash") {
      s.splash -= dt;
      if (s.splash <= 0) {
        s.lvl++;
        this.level(G);
        s.pops.push({
          x: G.W / 2,
          y: s.camY + H * 0.35,
          t: 1.4,
          txt: "DIVE ".concat(s.lvl)
        });
      }
      return;
    }
    var dir = s.hold || (s.keys.ArrowRight ? 1 : 0) - (s.keys.ArrowLeft ? 1 : 0);
    p.vx += dir * 760 * dt;
    p.vx *= Math.pow(0.35, dt);
    p.vx = Math.max(-280, Math.min(280, p.vx));
    p.vy = Math.min(470 + s.lvl * 8, p.vy + 820 * dt);
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.rot += (p.vx * 0.01 + 3) * dt;
    s.camY += (Math.min(p.y - H * 0.3, s.D + 90 - H) - s.camY) * Math.min(1, dt * 8);
    var _iterator = _createForOfIteratorHelper(s.bones),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var b = _step.value;
        if (!b.got && Math.hypot(b.x - p.x, b.y - p.y) < 22) {
          b.got = 1;
          s.pts += 15;
          G.sfx("pop");
          s.pops.push({
            x: b.x,
            y: b.y - 14,
            t: 0.8,
            txt: "+15"
          });
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
    if (p.y + R > 0 && p.y < s.D) {
      var _this$walls = this.walls(s.L, s.Rt, p.y + R * 0.5),
        _this$walls2 = _slicedToArray(_this$walls, 2),
        l = _this$walls2[0],
        r = _this$walls2[1];
      if (p.x - R < l || p.x + R > r) return this.splat(G);
    }
    if (p.y >= s.D) {
      var acc = Math.max(0, 1 - Math.abs(p.x - s.cx) / (s.pw / 2));
      var perfect = acc > 0.82;
      var pts = 100 + Math.round(acc * 100) + (s.lvl - 1) * 25 + (perfect ? 100 : 0);
      s.pts += pts;
      s.streak = perfect ? s.streak + 1 : 0;
      s.phase = "splash";
      s.splash = 1.5;
      p.y = s.D + 6;
      for (var k = 0; k < 18; k++) s.drops.push({
        x: p.x,
        y: s.D,
        vx: (Math.random() - 0.5) * 220,
        vy: -150 - Math.random() * 250,
        t: 0.9
      });
      G.sfx("win");
      s.pops.push({
        x: p.x,
        y: s.D - 40,
        t: 1.4,
        txt: perfect ? s.streak > 1 ? "PERFECT x".concat(s.streak, "!") : "PERFECT!" : "+".concat(pts)
      });
    }
  },
  splat: function splat(G) {
    var s = G.s;
    G.sfx("lose");
    G.buzz();
    s.lives--;
    s.streak = 0;
    if (s.lives > 0) {
      s.phase = "crash";
      s.splash = 1.4;
      s.p.vx = 0;
      s.p.vy = 60;
      s.hold = 0;
      s.pops.push({
        x: G.W / 2,
        y: s.p.y - 30,
        t: 1.4,
        txt: s.lives === 1 ? "OUCH! LAST LIFE" : "OUCH! ".concat(s.lives, " LIVES LEFT")
      });
      return;
    }
    s.phase = "dead";
    var sc = s.pts;
    G.over(sc, s.lvl >= 6 ? "Cliff legend!" : s.lvl >= 3 ? "Splat!" : "Ouch. Steer!");
  },
  side: function side(G, x) {
    G.s.hold = x < G.W / 2 ? -1 : 1;
  },
  down: function down(G, x) {
    var s = G.s;
    if (s.phase === "aim") {
      s.charging = true;
      s.ct = 0;
      s.charge = 0;
    } else this.side(G, x);
  },
  move: function move(G, x) {
    if (G.s.phase === "fall" && G.s.hold) this.side(G, x);
  },
  up: function up(G) {
    var s = G.s;
    if (s.phase === "aim") this.jump(G);
    s.hold = 0;
  },
  onKey: function onKey(G, k, isDown) {
    var s = G.s;
    if (k === "ArrowLeft" || k === "ArrowRight") s.keys[k] = isDown;
    if (k === " " || k === "ArrowUp" || k === "Enter") {
      if (isDown && s.phase === "aim" && !s.charging) {
        s.charging = true;
        s.ct = 0;
      } else if (!isDown) this.jump(G);
    }
  },
  draw: function draw(G, c) {
    var s = G.s,
      W = G.W,
      H = G.H,
      p = s.p,
      cy = s.camY,
      dark = G.dark();
    var sky = c.createLinearGradient(0, 0, 0, H);
    sky.addColorStop(0, dark ? "#0e1a33" : "#7cc4ff");
    sky.addColorStop(1, dark ? "#1b2e4a" : "#cfeaff");
    c.fillStyle = sky;
    c.fillRect(0, 0, W, H);
    var deep = Math.max(0, Math.min(1, (cy + H / 2) / s.D));
    c.fillStyle = "rgba(20,10,30,".concat(0.15 + deep * 0.45, ")");
    c.fillRect(0, Math.max(0, -cy), W, H);
    var y0 = Math.max(0, cy - 10),
      y1 = Math.min(s.D, cy + H + 10);
    var rock = dark ? "#5a3d2b" : "#a0663f",
      rock2 = dark ? "#43291c" : "#7f4c2c";
    if (y1 > y0) {
      c.fillStyle = rock;
      c.beginPath();
      c.moveTo(0, y0 - cy);
      for (var y = y0; y <= y1; y += 10) c.lineTo(this.walls(s.L, s.Rt, y)[0], y - cy);
      c.lineTo(0, y1 - cy);
      c.fill();
      c.beginPath();
      c.moveTo(W, y0 - cy);
      for (var _y = y0; _y <= y1; _y += 10) c.lineTo(this.walls(s.L, s.Rt, _y)[1], _y - cy);
      c.lineTo(W, y1 - cy);
      c.fill();
      c.strokeStyle = rock2;
      c.lineWidth = 2;
      for (var _y2 = Math.ceil(y0 / 70) * 70; _y2 < y1; _y2 += 70) {
        var _this$walls3 = this.walls(s.L, s.Rt, _y2),
          _this$walls4 = _slicedToArray(_this$walls3, 2),
          l = _this$walls4[0],
          r = _this$walls4[1];
        c.beginPath();
        c.moveTo(0, _y2 - cy);
        c.lineTo(l - 4, _y2 - cy + 6);
        c.stroke();
        c.beginPath();
        c.moveTo(W, _y2 - cy);
        c.lineTo(r + 4, _y2 - cy + 6);
        c.stroke();
      }
    }
    var _this$walls5 = this.walls(s.L, s.Rt, 0),
      _this$walls6 = _slicedToArray(_this$walls5, 1),
      l0 = _this$walls6[0];
    if (-cy > -40) {
      c.fillStyle = "#4caf50";
      c.fillRect(0, -cy - 6, l0, 8);
      c.fillStyle = rock;
      c.fillRect(0, -cy + 2, l0, 4);
    }
    var by = s.D - cy;
    if (by < H + 20) {
      var _this$walls7 = this.walls(s.L, s.Rt, s.D),
        _this$walls8 = _slicedToArray(_this$walls7, 2),
        _l = _this$walls8[0],
        _r = _this$walls8[1];
      c.fillStyle = rock2;
      c.fillRect(0, by, W, H - by + 10);
      c.fillStyle = "#29b6f6";
      c.fillRect(_l, by - 2, _r - _l, 26);
      c.fillStyle = "rgba(255,255,255,0.6)";
      c.fillRect(s.cx - 3, by - 2, 6, 4);
      c.fillStyle = rock;
      c.fillRect(0, by, _l, H - by + 10);
      c.fillRect(_r, by, W - _r, H - by + 10);
    }
    s.bones.forEach(function (b) {
      if (!b.got && b.y - cy > -20 && b.y - cy < H + 20) G.emoji(c, "🦴", b.x, b.y - cy, 16);
    });
    c.fillStyle = "#4fc3f7";
    s.drops.forEach(function (d) {
      c.beginPath();
      c.arc(d.x, d.y - cy, 3, 0, 7);
      c.fill();
    });
    if (s.phase !== "splash") G.img(c, s.phase === "dead" || s.phase === "crash" ? ":dawgpain:" : s.phase === "aim" ? ":dawgW:" : ":dawgpog:", p.x, p.y - cy, 26, s.phase === "fall" || s.phase === "crash" ? p.rot : 0);
    if (s.phase === "aim") {
      var mx = W - 34,
        mh = Math.min(170, H * 0.3),
        my = H * 0.5 - mh / 2;
      c.fillStyle = "rgba(0,0,0,0.45)";
      c.fillRect(mx - 3, my - 3, 20, mh + 6);
      var gg = c.createLinearGradient(0, my + mh, 0, my);
      gg.addColorStop(0, "#66bb6a");
      gg.addColorStop(0.6, "#ffd23f");
      gg.addColorStop(1, "#ff5252");
      c.fillStyle = gg;
      c.fillRect(mx, my + mh * (1 - s.charge), 14, mh * s.charge);
      G.text(c, "POWER", mx + 7, my - 14, 8, "#fff");
      if (s.charging) {
        c.fillStyle = "rgba(255,255,255,0.8)";
        var x = p.x,
          _y3 = p.y,
          vx = 40 + s.charge * (W * 0.75),
          vy = -300;
        for (var i = 0; i < 9; i++) {
          for (var k = 0; k < 4; k++) {
            x += vx * 0.02;
            _y3 += vy * 0.02;
            vy += 820 * 0.02;
          }
          c.beginPath();
          c.arc(x, _y3 - cy, 2.5, 0, 7);
          c.fill();
        }
      }
    }
    s.pops.forEach(function (o) {
      c.globalAlpha = Math.min(1, o.t * 2);
      G.text(c, o.txt, o.x + 2, o.y - cy + 2, 13, "rgba(0,0,0,0.7)");
      G.text(c, o.txt, o.x, o.y - cy, 13, "#ffd23f");
      c.globalAlpha = 1;
    });
    var depth = Math.max(0, Math.round((s.D - Math.max(0, p.y)) / 10));
    G.hud(c, "SCORE ".concat(s.pts), "DIVE ".concat(s.lvl), s.phase === "fall" ? "".concat(depth, "m") : "");
    for (var _i2 = 0; _i2 < 3; _i2++) {
      c.globalAlpha = _i2 < s.lives ? 1 : 0.25;
      G.emoji(c, "❤️", G.W - 16 - _i2 * 22, 50, 15);
    }
    c.globalAlpha = 1;
    if (G.state === "play" && s.phase === "aim") G.hint(c, "HOLD, THEN LET GO", 99);
    if (G.state === "play" && s.phase === "fall" && s.lvl === 1) G.hint(c, "HOLD LEFT / RIGHT TO STEER", 99, 80);
  }
});