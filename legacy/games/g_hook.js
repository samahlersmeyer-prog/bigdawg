function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
defGame({
  key: "hook",
  name: "Hook Dawg",
  icon: "🪝",
  max: 99999,
  blurb: "Hold to hook, let go to fling. Swing forever.",
  how: "Hold anywhere to grab the glowing hook and swing. Let go to fling yourself forward. Let go on the upswing to fly far. Bounce pads at the bottom save you, but miss them and you're in the pit. Grab bones for +25, and do a full flip in the air for +50 (more for doubles). Hooks get farther apart and start to drift the farther you go.",
  reset: function reset(G) {
    var W = G.W,
      H = G.H;
    var s = G.s = {
      p: {
        x: 70,
        y: H * 0.42,
        vx: 0,
        vy: 0,
        rot: 0,
        spin: 0
      },
      hooks: [],
      pads: [],
      bones: [],
      pops: [],
      trail: [],
      hook: null,
      held: false,
      auto: true,
      len: 0,
      camX: 0,
      camY: 0,
      lastX: 0,
      maxX: 0,
      bonus: 0,
      airRot: 0,
      flips: 0,
      n: 0,
      hills: [],
      clouds: []
    };
    for (var i = 0; i < 7; i++) s.clouds.push({
      x: Math.random() * W * 2,
      y: 20 + Math.random() * H * 0.35,
      w: 40 + Math.random() * 60
    });
    for (var _i = 0; _i < 12; _i++) s.hills.push({
      x: _i * 140 + Math.random() * 60,
      h: 40 + Math.random() * 70,
      w: 120 + Math.random() * 80
    });
    s.hooks.push({
      x: 150,
      y: H * 0.16,
      by: H * 0.16,
      bob: 0,
      ph: 0
    });
    s.lastX = 150;
    s.hook = s.hooks[0];
    s.len = Math.hypot(s.p.x - s.hook.x, s.p.y - s.hook.y);
    s.p.vx = 260;
    this.gen(G);
  },
  gen: function gen(G) {
    var s = G.s,
      W = G.W,
      H = G.H;
    while (s.lastX < s.camX + W + 400) {
      s.n++;
      var lvl = Math.min(1, s.lastX / 30000);
      var gap = 170 + lvl * 110 + Math.random() * (50 + lvl * 40);
      var x = s.lastX + gap;
      var y = H * (0.12 + Math.random() * (0.26 + lvl * 0.08));
      var bob = s.lastX > 5000 && Math.random() < 0.25 + lvl * 0.45 ? 25 + Math.random() * 35 * (0.5 + lvl) : 0;
      s.hooks.push({
        x: x,
        y: y,
        by: y,
        bob: bob,
        ph: Math.random() * 6
      });
      if (Math.random() < 0.55) {
        var mx = s.lastX + gap / 2,
          my = H * (0.38 + Math.random() * 0.2);
        for (var i = -1; i <= 1; i++) s.bones.push({
          x: mx + i * 26,
          y: my - (i === 0 ? 14 : 0),
          got: 0
        });
      }
      if (Math.random() < 0.45 - lvl * 0.3) s.pads.push({
        x: s.lastX + gap * (0.3 + Math.random() * 0.4),
        w: 70 - lvl * 20,
        sq: 0
      });
      s.lastX = x;
    }
  },
  target: function target(G) {
    var s = G.s,
      p = s.p;
    var best = null,
      bd = 1e9;
    var _iterator = _createForOfIteratorHelper(s.hooks),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var h = _step.value;
        if (h.x < p.x - 60) continue;
        var d = Math.hypot(h.x - p.x, h.y - p.y);
        if (d > 360 || d < 30) continue;
        var score = d - (h.x > p.x ? 60 : 0);
        if (score < bd) {
          bd = score;
          best = h;
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
    return best;
  },
  grab: function grab(G) {
    var s = G.s,
      p = s.p;
    s.held = true;
    if (s.auto && s.hook) return;
    var h = this.target(G);
    if (!h) return;
    s.hook = h;
    s.len = Math.max(70, Math.hypot(p.x - h.x, p.y - h.y));
    s.auto = false;
    s.airRot = 0;
    G.sfx("pop");
  },
  release: function release(G) {
    var s = G.s,
      p = s.p;
    s.held = false;
    if (!s.hook) return;
    s.hook = null;
    s.auto = false;
    s.airRot = 0;
    p.spin = Math.max(-14, Math.min(14, p.vx * 0.006 + (p.vy < 0 ? 4 : 1) * Math.sign(p.vx || 1)));
  },
  update: function update(G, dt) {
    var s = G.s,
      p = s.p,
      W = G.W,
      H = G.H;
    var _iterator2 = _createForOfIteratorHelper(s.hooks),
      _step2;
    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        var _h = _step2.value;
        if (_h.bob) {
          _h.ph += dt * 1.6;
          _h.y = _h.by + Math.sin(_h.ph) * _h.bob;
        }
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }
    var steps = 3,
      h = dt / steps;
    for (var i = 0; i < steps; i++) {
      p.vy += 1500 * h;
      if (s.hook) {
        var dx = p.x - s.hook.x,
          dy = p.y - s.hook.y,
          d = Math.hypot(dx, dy) || 1;
        var tx = -dy / d,
          ty = dx / d,
          along = p.vx * tx + p.vy * ty;
        var push = Math.sign(along) * 260 * h;
        p.vx += tx * push;
        p.vy += ty * push;
      }
      p.x += p.vx * h;
      p.y += p.vy * h;
      if (s.hook) {
        var _dx = p.x - s.hook.x,
          _dy = p.y - s.hook.y,
          _d = Math.hypot(_dx, _dy) || 1;
        if (_d > s.len) {
          var nx = _dx / _d,
            ny = _dy / _d;
          p.x = s.hook.x + nx * s.len;
          p.y = s.hook.y + ny * s.len;
          var out = p.vx * nx + p.vy * ny;
          if (out > 0) {
            p.vx -= out * nx;
            p.vy -= out * ny;
          }
        }
      }
    }
    var sp = Math.hypot(p.vx, p.vy);
    if (sp > 1400) {
      p.vx *= 1400 / sp;
      p.vy *= 1400 / sp;
    }
    if (s.hook) {
      var want = Math.atan2(p.x - s.hook.x, -(p.y - s.hook.y)) + Math.PI;
      var dr = want - p.rot;
      dr = Math.atan2(Math.sin(dr), Math.cos(dr));
      p.rot += dr * Math.min(1, dt * 14);
    } else {
      var _dr = p.spin * dt;
      p.rot += _dr;
      s.airRot += _dr;
      p.spin *= Math.pow(0.6, dt);
      if (Math.abs(s.airRot) >= Math.PI * 2) {
        s.airRot -= Math.sign(s.airRot) * Math.PI * 2;
        s.flips++;
        var pts = 50 * s.flips;
        s.bonus += pts;
        G.sfx("win");
        s.pops.push({
          x: p.x,
          y: p.y - 40,
          t: 1,
          txt: (s.flips > 1 ? s.flips + "x FLIP +" : "FLIP +") + pts
        });
      }
    }
    if (s.hook) s.flips = 0;
    var bx = p.x - Math.sin(p.rot) * 32,
      by = p.y + Math.cos(p.rot) * 32;
    var _iterator3 = _createForOfIteratorHelper(s.bones),
      _step3;
    try {
      for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
        var b = _step3.value;
        if (!b.got && Math.abs(b.x - bx) < 26 && Math.abs(b.y - by) < 34) {
          b.got = 1;
          s.bonus += 25;
          G.sfx("pop");
          s.pops.push({
            x: b.x,
            y: b.y - 16,
            t: 0.8,
            txt: "+25"
          });
        }
      }
    } catch (err) {
      _iterator3.e(err);
    } finally {
      _iterator3.f();
    }
    var padY = H - 34;
    var _iterator4 = _createForOfIteratorHelper(s.pads),
      _step4;
    try {
      for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
        var pd = _step4.value;
        pd.sq = Math.max(0, pd.sq - dt * 4);
        if (!s.hook && p.vy > 0 && by > padY - 26 && by < padY + 14 && Math.abs(bx - pd.x) < pd.w / 2 + 10) {
          p.y -= by - (padY - 26);
          p.vy = -Math.max(950, p.vy * 0.95);
          p.vx = Math.max(p.vx, 280);
          p.spin = 6 * Math.sign(p.vx);
          s.airRot = 0;
          pd.sq = 1;
          G.sfx("win");
          s.pops.push({
            x: pd.x,
            y: padY - 40,
            t: 0.7,
            txt: "BOING"
          });
        }
      }
    } catch (err) {
      _iterator4.e(err);
    } finally {
      _iterator4.f();
    }
    s.trail.push({
      x: p.x,
      y: p.y,
      t: 0.35
    });
    var _iterator5 = _createForOfIteratorHelper(s.trail),
      _step5;
    try {
      for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
        var t = _step5.value;
        t.t -= dt;
      }
    } catch (err) {
      _iterator5.e(err);
    } finally {
      _iterator5.f();
    }
    if (s.trail.length) s.trail = s.trail.filter(function (t) {
      return t.t > 0;
    });
    var _iterator6 = _createForOfIteratorHelper(s.pops),
      _step6;
    try {
      for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
        var q = _step6.value;
        q.t -= dt;
      }
    } catch (err) {
      _iterator6.e(err);
    } finally {
      _iterator6.f();
    }
    if (s.pops.length) s.pops = s.pops.filter(function (q) {
      return q.t > 0;
    });
    var wantX = p.x - W * 0.36;
    s.camX += (wantX - s.camX) * Math.min(1, dt * 5);
    var wantY = Math.min(0, p.y - H * 0.18);
    s.camY += (wantY - s.camY) * Math.min(1, dt * 4);
    s.maxX = Math.max(s.maxX, p.x - 70);
    this.gen(G);
    var lo = s.camX - 300;
    if (s.hooks.length > 3 && s.hooks[0].x < lo && s.hooks[0] !== s.hook) s.hooks.shift();
    if (s.bones.length && s.bones[0].x < lo) s.bones = s.bones.filter(function (b) {
      return b.x >= lo;
    });
    if (s.pads.length && s.pads[0].x < lo) s.pads = s.pads.filter(function (pd) {
      return pd.x >= lo;
    });
    if (by > H + 10) {
      G.sfx("lose");
      G.buzz();
      var sc = this.score(s),
        m = Math.floor(s.maxX / 10);
      G.over(sc, m > 2000 ? "Swing legend!" : m > 600 ? "Into the pit!" : "Hold on tighter!");
    }
  },
  score: function score(s) {
    return Math.min(99999, Math.floor(s.maxX / 10) + s.bonus);
  },
  down: function down(G) {
    this.grab(G);
  },
  up: function up(G) {
    this.release(G);
  },
  onKey: function onKey(G, k, isDown) {
    if (k !== " " && k !== "ArrowUp" && k !== "w") return;
    if (isDown && !G.s.held) this.grab(G);else if (!isDown && G.s.held) this.release(G);
  },
  draw: function draw(G, c) {
    var s = G.s,
      W = G.W,
      H = G.H,
      dark = G.dark();
    if (!s.p) return;
    var cx = s.camX || 0,
      cy = s.camY || 0;
    var X = function X(x) {
        return x - cx;
      },
      Y = function Y(y) {
        return y - cy;
      };
    var gr = c.createLinearGradient(0, 0, 0, H);
    if (dark) {
      gr.addColorStop(0, "#141a46");
      gr.addColorStop(1, "#3a2d6e");
    } else {
      gr.addColorStop(0, "#5fb6ff");
      gr.addColorStop(1, "#ffd9a8");
    }
    c.fillStyle = gr;
    c.fillRect(0, 0, W, H);
    c.fillStyle = dark ? "rgba(240,240,255,0.85)" : "rgba(255,240,170,0.9)";
    c.beginPath();
    c.arc(W * 0.8, Y(H * 0.14) * 0.5 + 40, 26, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = dark ? "rgba(190,200,240,0.16)" : "rgba(255,255,255,0.85)";
    var span = W + 200;
    var _iterator7 = _createForOfIteratorHelper(s.clouds),
      _step7;
    try {
      for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
        var cl = _step7.value;
        var xx = ((cl.x - cx * 0.2) % span + span) % span - 100,
          yy = cl.y - cy * 0.3;
        c.beginPath();
        c.roundRect(xx - cl.w / 2, yy, cl.w, 16, 8);
        c.fill();
        c.beginPath();
        c.roundRect(xx - cl.w / 4, yy - 10, cl.w * 0.5, 16, 8);
        c.fill();
      }
    } catch (err) {
      _iterator7.e(err);
    } finally {
      _iterator7.f();
    }
    c.fillStyle = dark ? "#2a2556" : "#7fcf8a";
    var hspan = 12 * 140;
    var _iterator8 = _createForOfIteratorHelper(s.hills),
      _step8;
    try {
      for (_iterator8.s(); !(_step8 = _iterator8.n()).done;) {
        var hl = _step8.value;
        var _xx = ((hl.x - cx * 0.45) % hspan + hspan) % hspan - 120,
          base = H - 30 - cy * 0.5;
        c.beginPath();
        c.ellipse(_xx, base, hl.w / 2, hl.h, 0, Math.PI, 0);
        c.fill();
      }
    } catch (err) {
      _iterator8.e(err);
    } finally {
      _iterator8.f();
    }
    var pitY = Y(H - 24);
    c.fillStyle = dark ? "#0b0a1c" : "#3b2a4d";
    c.fillRect(0, pitY, W, H - pitY + 50);
    c.fillStyle = dark ? "#e0446a" : "#ff5a7a";
    for (var x = -(cx * 1 % 20); x < W + 20; x += 20) {
      c.beginPath();
      c.moveTo(x, pitY);
      c.lineTo(x + 10, pitY - 12);
      c.lineTo(x + 20, pitY);
      c.fill();
    }
    var _iterator9 = _createForOfIteratorHelper(s.pads),
      _step9;
    try {
      for (_iterator9.s(); !(_step9 = _iterator9.n()).done;) {
        var pd = _step9.value;
        var _x = X(pd.x);
        if (_x < -60 || _x > W + 60) continue;
        var y = Y(H - 34),
          q = pd.sq;
        c.fillStyle = "#222";
        c.fillRect(_x - pd.w / 2 + 4, y + 4, 4, 20);
        c.fillRect(_x + pd.w / 2 - 8, y + 4, 4, 20);
        c.fillStyle = "#1f9d55";
        c.beginPath();
        c.ellipse(_x, y + 4 + q * 5, pd.w / 2, 7 - q * 3, 0, 0, Math.PI * 2);
        c.fill();
        c.fillStyle = "#6cf0a0";
        c.fillRect(_x - pd.w / 2 + 8, y + 1 + q * 5, pd.w - 16, 2);
      }
    } catch (err) {
      _iterator9.e(err);
    } finally {
      _iterator9.f();
    }
    var _iterator0 = _createForOfIteratorHelper(s.bones),
      _step0;
    try {
      for (_iterator0.s(); !(_step0 = _iterator0.n()).done;) {
        var b = _step0.value;
        if (b.got) continue;
        var _x2 = X(b.x);
        if (_x2 < -30 || _x2 > W + 30) continue;
        G.emoji(c, "🦴", _x2, Y(b.y) + Math.sin(G.t * 4 + b.x) * 3, 22);
      }
    } catch (err) {
      _iterator0.e(err);
    } finally {
      _iterator0.f();
    }
    var tgt = !s.hook && G.state === "play" ? this.target(G) : null;
    var _iterator1 = _createForOfIteratorHelper(s.hooks),
      _step1;
    try {
      for (_iterator1.s(); !(_step1 = _iterator1.n()).done;) {
        var hk = _step1.value;
        var _x3 = X(hk.x),
          _y = Y(hk.y);
        if (_x3 < -40 || _x3 > W + 40) continue;
        if (hk === tgt) {
          c.strokeStyle = "rgba(255,210,63," + (0.5 + 0.3 * Math.sin(G.t * 8)) + ")";
          c.lineWidth = 3;
          c.beginPath();
          c.arc(_x3, _y, 18, 0, Math.PI * 2);
          c.stroke();
        }
        c.fillStyle = hk.bob ? "#7b5cff" : "#ff8a1e";
        c.beginPath();
        c.arc(_x3, _y, 10, 0, Math.PI * 2);
        c.fill();
        c.fillStyle = "#fff";
        c.beginPath();
        c.arc(_x3 - 3, _y - 3, 3, 0, Math.PI * 2);
        c.fill();
        c.strokeStyle = "rgba(0,0,0,0.35)";
        c.lineWidth = 2;
        c.beginPath();
        c.arc(_x3, _y, 10, 0, Math.PI * 2);
        c.stroke();
      }
    } catch (err) {
      _iterator1.e(err);
    } finally {
      _iterator1.f();
    }
    var _iterator10 = _createForOfIteratorHelper(s.trail),
      _step10;
    try {
      for (_iterator10.s(); !(_step10 = _iterator10.n()).done;) {
        var t = _step10.value;
        c.fillStyle = "rgba(255,255,255,".concat(t.t * 0.8, ")");
        c.fillRect(X(t.x) - 2, Y(t.y) - 2, 4, 4);
      }
    } catch (err) {
      _iterator10.e(err);
    } finally {
      _iterator10.f();
    }
    var p = s.p,
      px = X(p.x),
      py = Y(p.y);
    if (s.hook) {
      c.strokeStyle = dark ? "#e8e2ff" : "#3b2a1a";
      c.lineWidth = 2.5;
      c.beginPath();
      c.moveTo(px, py);
      c.lineTo(X(s.hook.x), Y(s.hook.y));
      c.stroke();
    }
    c.save();
    c.translate(px, py);
    c.rotate(p.rot);
    var ink = dark ? "#f2f2f2" : "#1d1d1d",
      fl = Math.sin(G.t * 12) * (s.hook ? 0.15 : 0.6);
    c.strokeStyle = ink;
    c.lineWidth = 3.5;
    c.lineCap = "round";
    c.lineJoin = "round";
    c.beginPath();
    if (s.hook) {
      c.moveTo(-2, 0);
      c.lineTo(-13, 11);
      c.lineTo(0, 24);
      c.moveTo(2, 0);
      c.lineTo(13, 11);
      c.lineTo(0, 24);
    } else {
      c.moveTo(0, 24);
      c.lineTo(-14, 20 + fl * 10);
      c.lineTo(-20, 10 + fl * 14);
      c.moveTo(0, 24);
      c.lineTo(14, 20 - fl * 10);
      c.lineTo(20, 10 - fl * 14);
    }
    c.moveTo(0, 22);
    c.lineTo(0, 42);
    c.moveTo(0, 42);
    c.lineTo(-7 - fl * 6, 50);
    c.lineTo(-9 - fl * 8, 60);
    c.moveTo(0, 42);
    c.lineTo(7 + fl * 6, 50);
    c.lineTo(9 + fl * 8, 60);
    c.stroke();
    c.restore();
    var hx = px - Math.sin(p.rot) * 12,
      hy = py + Math.cos(p.rot) * 12;
    var face = G.state === "over" ? ":dawgpain:" : s.flips > 0 && !s.hook ? ":dawgpog:" : p.vy > 700 && !s.hook ? ":dawgsweat:" : ":dawgW:";
    G.img(c, face, hx, hy, 24, p.rot * 0.35);
    var _iterator11 = _createForOfIteratorHelper(s.pops),
      _step11;
    try {
      for (_iterator11.s(); !(_step11 = _iterator11.n()).done;) {
        var _q = _step11.value;
        c.globalAlpha = Math.min(1, _q.t * 2);
        G.text(c, _q.txt, X(_q.x), Y(_q.y) - (1 - _q.t) * 30, 10, "#ffd23f");
        c.globalAlpha = 1;
      }
    } catch (err) {
      _iterator11.e(err);
    } finally {
      _iterator11.f();
    }
    if (py < 0) G.text(c, "▲", px, 40, 12, "#ffd23f");
    if (G.state === "play" && G.t < 4) {
      c.globalAlpha = 0.6 * Math.min(1, 4 - G.t);
      G.text(c, "HOLD = HOOK", W / 2, H * 0.62, 11, "#fff");
      G.text(c, "LET GO = FLING", W / 2, H * 0.62 + 20, 11, "#fff");
      c.globalAlpha = 1;
    }
    c.fillStyle = "rgba(0,0,0,0.35)";
    c.fillRect(0, 0, W, 30);
    G.text(c, "SCORE ".concat(this.score(s)), 10, 15, 11, "#fff", "left");
    G.text(c, "".concat(Math.floor(s.maxX / 10), "m"), W - 10, 15, 11, "#ffd23f", "right");
  }
});