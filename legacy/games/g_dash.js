function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
defGame({
  key: "dash",
  name: "Dawg Dash",
  icon: "🛹",
  max: 999999,
  blurb: "Endless runner. Swipe to dodge trains.",
  how: "Swipe LEFT or RIGHT to switch tracks, UP to jump the low barriers, DOWN to slide under the high bars. Trains block a whole track: dodge them, or run up a ramp onto the roof and hop from car to car (and across to trains on other tracks). Grab bones for points. 🧲 pulls bones in, ⭐ doubles points, 🛹 lets you survive one crash. It gets faster the longer you go.",
  MISS: {
    bones: ["GRAB {n} BONES", 30, 25],
    jumps: ["JUMP {n} TIMES", 10, 6],
    slides: ["SLIDE {n} TIMES", 8, 5],
    roofs: ["LAND ON {n} TRAIN ROOFS", 3, 2],
    dist: ["RUN {n}M", 400, 300],
    pups: ["GRAB {n} POWER-UPS", 1, 1]
  },
  mkey: function mkey() {
    return "bdd:dash:" + (typeof me !== "undefined" && me ? me.id : "");
  },
  mload: function mload() {
    var m = null;
    try {
      m = store.get(this.mkey());
    } catch (e) {}
    if (!m || !m.set) {
      m = {
        mult: 1,
        set: null
      };
      m.set = this.newSet(1);
    }
    return m;
  },
  newSet: function newSet(mult) {
    var _this = this;
    var ks = Object.keys(this.MISS).sort(function () {
      return Math.random() - 0.5;
    }).slice(0, 3);
    return ks.map(function (k) {
      return {
        k: k,
        n: _this.MISS[k][1] + _this.MISS[k][2] * (mult - 1),
        done: false
      };
    });
  },
  mlabel: function mlabel(q) {
    return this.MISS[q.k][0].replace("{n}", q.n).replace("1 POWER-UPS", "A POWER-UP").replace("1 TRAIN ROOFS", "A TRAIN ROOF");
  },
  bump: function bump(G, k, n) {
    var s = G.s;
    s.st[k] = (s.st[k] || 0) + (n || 1);
    var m = s.miss;
    m.set.forEach(function (q) {
      if (!q.done && q.k === k && s.st[k] >= q.n) {
        q.done = true;
        s.pops.push({
          t: 1.6,
          txt: "MISSION DONE!"
        });
        G.sfx("win");
      }
    });
    if (m.set.every(function (q) {
      return q.done;
    })) {
      m.mult = Math.min(30, m.mult + 1);
      m.set = this.newSet(m.mult);
      s.pops.push({
        t: 2,
        txt: "MULTIPLIER x".concat(m.mult, "!")
      });
    }
    try {
      store.set(this.mkey(), m);
    } catch (e) {}
  },
  reset: function reset(G) {
    G.s = {
      st: {},
      miss: this.mload(),
      lane: 0,
      lx: 0,
      y: 0,
      vy: 0,
      roll: 0,
      dist: 0,
      sp: 16,
      bones: 0,
      score: 0,
      objs: [],
      nextZ: 26,
      mag: 0,
      dbl: 0,
      shield: 0,
      flash: 0,
      dead: 0,
      pops: []
    };
    this.spawnRow(G.s, 26, true);
    this.spawnRow(G.s, 42);
  },
  ZMAX: 70,
  TOP: 2.6,
  RL: 4,
  spawnRow: function spawnRow(s, z, easy) {
    var free = Math.floor(Math.random() * 3) - 1,
      lvl = Math.min(1, s.dist / 3000);
    for (var ln = -1; ln <= 1; ln++) {
      if (ln === free) continue;
      var r = Math.random();
      if (easy && r < 0.6) continue;
      var k = r < 0.25 - lvl * 0.1 ? null : r < 0.5 ? "low" : r < 0.72 ? "high" : "train";
      if (!k) continue;
      if (k !== "train") {
        s.objs.push({
          k: k,
          lane: ln,
          z: z,
          len: 0.6
        });
        continue;
      }
      var zz = z;
      var cars = Math.random() < 0.45 ? 2 : 1,
        ramp = Math.random() < 0.6;
      for (var i = 0; i < cars; i++) {
        var len = 7 + Math.random() * 4;
        s.objs.push({
          k: "train",
          lane: ln,
          z: zz,
          len: len,
          ramp: ramp && i === 0
        });
        if (ramp) for (var b = 1; b < 5; b++) s.objs.push({
          k: "bone",
          lane: ln,
          z: zz + b * len / 5,
          len: 0.4,
          h: this.TOP
        });
        zz += len + 1.4;
      }
      s.far = Math.max(s.far || 0, zz - z);
    }
    for (var _i = 0; _i < 5; _i++) s.objs.push({
      k: "bone",
      lane: free,
      z: z - 9 + _i * 1.6,
      len: 0.4,
      h: 0
    });
    if (Math.random() < 0.12) s.objs.push({
      k: ["mag", "dbl", "shield"][Math.floor(Math.random() * 3)],
      lane: free,
      z: z - 11,
      len: 0.4,
      h: 0.4
    });
  },
  swipe: function swipe(G, dx, dy) {
    var s = G.s;
    if (s.dead) return;
    if (dx) s.lane = Math.max(-1, Math.min(1, s.lane + dx));else if (dy < 0 && s.y <= (s.gnd || 0) + 0.05) {
      s.vy = 9.2;
      s.roll = 0;
      this.bump(G, "jumps");
    } else if (dy > 0) {
      if (s.y > (s.gnd || 0) + 0.05) s.vy = -16;
      s.roll = 0.62;
      this.bump(G, "slides");
    }
  },
  ground: function ground(s, lane) {
    var g = 0;
    var _iterator = _createForOfIteratorHelper(s.objs),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var o = _step.value;
        if (o.k !== "train" || o.lane !== lane || o.gone) continue;
        if (o.z <= 0.15 && o.z + o.len >= -0.15) g = Math.max(g, this.TOP);else if (o.ramp && o.z > 0 && o.z < this.RL) g = Math.max(g, this.TOP * (1 - o.z / this.RL));
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
    return g;
  },
  onKey: function onKey(G, k, d) {
    if (!d) return;
    var m = {
      ArrowLeft: [-1, 0],
      ArrowRight: [1, 0],
      ArrowUp: [0, -1],
      ArrowDown: [0, 1],
      " ": [0, -1]
    }[k];
    if (m) this.swipe(G, m[0], m[1]);
  },
  update: function update(G, dt) {
    var s = G.s;
    if (s.dead) {
      s.dead -= dt;
      if (s.dead <= 0) G.over(Math.min(999999, s.score), s.dist > 2500 ? "The dogcatcher finally got you!" : "Caught by the dogcatcher!");
      return;
    }
    s.sp = Math.min(40, 16 + s.dist / 140);
    var mv = s.sp * dt;
    s.dist += mv;
    s.lx += (s.lane - s.lx) * Math.min(1, dt * 14);
    var me0 = Math.round(s.lx),
      gnd = this.ground(s, me0);
    s.vy -= 26 * dt;
    s.y += s.vy * dt;
    if (s.y <= gnd + 0.02 && s.vy <= 0) {
      s.y = gnd;
      s.vy = 0;
    }
    if (gnd >= this.TOP && (s.gnd || 0) < this.TOP && s.y >= this.TOP - 0.01) this.bump(G, "roofs");
    s.gnd = gnd;
    var m10 = Math.floor(s.dist / 10);
    if (m10 > (s.lastM || 0)) {
      s.lastM = m10;
      s.st.dist = Math.floor(s.dist);
      this.bump(G, "dist", 0);
    }
    if (s.roll > 0) s.roll -= dt;
    ["mag", "dbl", "shield", "flash"].forEach(function (k) {
      if (s[k] > 0) s[k] -= dt;
    });
    s.acc = (s.acc || 0) + mv * (s.dbl > 0 ? 2 : 1) * s.miss.mult;
    var add = Math.floor(s.acc);
    s.acc -= add;
    s.score += add;
    s.objs.forEach(function (o) {
      return o.z -= mv;
    });
    s.nextZ -= mv;
    if (s.nextZ < this.ZMAX - 16) {
      var gap = Math.max(13, (s.far || 0) + 6) + Math.random() * 6;
      s.far = 0;
      s.nextZ += gap;
      this.spawnRow(s, s.nextZ);
    }
    var me = Math.round(s.lx);
    var _iterator2 = _createForOfIteratorHelper(s.objs),
      _step2;
    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        var o = _step2.value;
        if (o.gone) continue;
        if (o.k === "bone" || o.k === "mag" || o.k === "dbl" || o.k === "shield") {
          var pull = o.k === "bone" && s.mag > 0 && o.z < 6;
          if (o.z < 0.5 && o.z > -0.6 && (o.lane === me || pull) && Math.abs(s.y - (o.h || 0)) < 1.6) {
            o.gone = 1;
            if (o.k === "bone") {
              var v = (s.dbl > 0 ? 20 : 10) * s.miss.mult;
              s.bones++;
              s.score += v;
              G.sfx("pop");
              this.bump(G, "bones");
            } else {
              this.bump(G, "pups");
              s[o.k] = o.k === "shield" ? 12 : 9;
              s.pops.push({
                t: 1,
                txt: {
                  mag: "MAGNET!",
                  dbl: "2X POINTS!",
                  shield: "BOARD UP!"
                }[o.k]
              });
              G.sfx("win");
            }
          }
          continue;
        }
        if (o.lane !== me || o.hit) continue;
        var inside = o.z < 0.35 && o.z + o.len > -0.35;
        if (!inside) continue;
        var crash = o.k === "train" ? s.y < this.TOP - 0.6 : o.k === "low" ? s.y < 0.65 : s.roll <= 0 && s.y < 1.3;
        if (!crash) continue;
        o.hit = 1;
        if (s.shield > 0) {
          s.shield = 0;
          s.flash = 0.8;
          G.buzz();
          G.sfx("lose");
          s.pops.push({
            t: 1,
            txt: "SAVED BY THE BOARD!"
          });
          if (o.k === "train") o.gone = 1;
          continue;
        }
        s.dead = 1.1;
        G.buzz();
        G.sfx("lose");
        return;
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }
    s.objs = s.objs.filter(function (o) {
      return !o.gone && o.z + o.len > -3;
    });
    s.pops.forEach(function (p) {
      return p.t -= dt;
    });
    s.pops = s.pops.filter(function (p) {
      return p.t > 0;
    });
  },
  draw: function draw(G, c) {
    var _this2 = this;
    var s = G.s,
      W = G.W,
      H = G.H,
      dark = G.dark(),
      hy = H * 0.26,
      by = H - 80,
      LW = W * 0.3;
    var P = function P(z) {
        return 1 / (1 + Math.max(-0.9, z) / 7);
      },
      X = function X(ln, z) {
        return W / 2 + ln * LW * P(z);
      },
      Y = function Y(z) {
        return hy + (by - hy) * P(z);
      },
      U = 58;
    var sky = c.createLinearGradient(0, 0, 0, hy);
    sky.addColorStop(0, dark ? "#0d1530" : "#7ec8ff");
    sky.addColorStop(1, dark ? "#2a2f55" : "#ffd9a8");
    c.fillStyle = sky;
    c.fillRect(0, 0, W, hy);
    c.fillStyle = dark ? "#1b1d2a" : "#8d8f99";
    for (var i = 0; i < 9; i++) {
      var bw = W / 9;
      c.fillRect(i * bw, hy - 20 - i * 37 % 50, bw - 4, 80);
    }
    c.fillStyle = dark ? "#2b2b33" : "#a89f91";
    c.fillRect(0, hy, W, H - hy);
    var _loop = function _loop(ln) {
      c.fillStyle = dark ? "#3a3740" : "#b9ae9d";
      c.beginPath();
      c.moveTo(X(ln - 0.45, _this2.ZMAX), hy);
      c.lineTo(X(ln + 0.45, _this2.ZMAX), hy);
      c.lineTo(X(ln + 0.45, -0.8), H);
      c.lineTo(X(ln - 0.45, -0.8), H);
      c.fill();
      c.fillStyle = dark ? "#4a3a2a" : "#6d5236";
      for (var k = 0; k < 30; k++) {
        var z = k * 2.4 - s.dist % 2.4;
        if (z > _this2.ZMAX) break;
        var p = P(z),
          y = Y(z);
        c.fillRect(X(ln - 0.38, z), y, LW * 0.76 * p, Math.max(1, 5 * p));
      }
      c.strokeStyle = dark ? "#9aa" : "#666";
      c.lineWidth = 2;
      [-0.25, 0.25].forEach(function (o) {
        c.beginPath();
        c.moveTo(X(ln + o, _this2.ZMAX), hy);
        c.lineTo(X(ln + o, -0.8), H);
        c.stroke();
      });
    };
    for (var ln = -1; ln <= 1; ln++) {
      _loop(ln);
    }
    var key = function key(o) {
      return o.k === "train" && o.z < 0 ? o.z + o.len : o.z;
    };
    var objs = s.objs.filter(function (o) {
      return o.z < _this2.ZMAX && o.z + o.len > -1.5;
    }).sort(function (a, b) {
      return key(b) - key(a);
    });
    var meZ = 0;
    var drewMe = false;
    var drawMe = function drawMe() {
      drewMe = true;
      var x = X(s.lx, 0),
        y = by - s.y * U,
        sz = s.roll > 0 ? 50 : 66;
      c.fillStyle = "rgba(0,0,0,0.25)";
      c.beginPath();
      c.ellipse(x, by + 6 - (s.gnd || 0) * U, 26, 8, 0, 0, 7);
      c.fill();
      if (s.shield > 0) G.emoji(c, "🛹", x, by + 2, 46);
      if (!(s.flash > 0 && Math.floor(G.t * 16) % 2)) G.img(c, s.dead ? ":dawgpain:" : s.roll > 0 ? ":dawgsweat:" : ":dawgW:", x, y - sz / 2 + (s.roll > 0 ? 12 : 0), sz);
    };
    var _iterator3 = _createForOfIteratorHelper(objs),
      _step3;
    try {
      var _loop2 = function _loop2() {
          var o = _step3.value;
          if (!drewMe && key(o) < meZ) drawMe();
          var p = P(o.z),
            x = X(o.lane, o.z),
            y = Y(o.z),
            w = LW * 0.82 * p;
          if (o.k === "bone") {
            G.emoji(c, "🦴", x, y - (22 + (o.h || 0) * U) * p, 30 * p);
            return 0;
          }
          if (o.k === "mag" || o.k === "dbl" || o.k === "shield") {
            G.emoji(c, {
              mag: "🧲",
              dbl: "⭐",
              shield: "🛹"
            }[o.k], x, y - 40 * p + Math.sin(G.t * 5) * 4 * p, 36 * p);
            return 0;
          }
          if (o.k === "low") {
            var h = 0.6 * U * p;
            c.fillStyle = "#fafafa";
            c.fillRect(x - w / 2, y - h, w, h * 0.55);
            c.fillStyle = "#e53935";
            for (var _i2 = 0; _i2 < 4; _i2++) c.fillRect(x - w / 2 + _i2 * w / 4, y - h, w / 8, h * 0.55);
            c.fillStyle = "#555";
            c.fillRect(x - w / 2 + 2, y - h * 0.45, 4 * p, h * 0.45);
            c.fillRect(x + w / 2 - 6 * p, y - h * 0.45, 4 * p, h * 0.45);
          } else if (o.k === "high") {
            var top = 1.55 * U * p,
              bh = 0.5 * U * p;
            c.fillStyle = "#444";
            c.fillRect(x - w / 2, y - top, 5 * p, top);
            c.fillRect(x + w / 2 - 5 * p, y - top, 5 * p, top);
            c.fillStyle = "#ffb300";
            c.fillRect(x - w / 2, y - top, w, bh);
            c.fillStyle = "#222";
            for (var _i3 = 0; _i3 < 5; _i3++) c.fillRect(x - w / 2 + _i3 * w / 5, y - top, w / 10, bh);
          } else if (o.k === "train") {
            var z2 = Math.min(_this2.ZMAX, o.z + o.len),
              p2 = P(z2),
              x2 = X(o.lane, z2),
              y2 = Y(z2),
              w2 = LW * 0.82 * p2,
              _h = 2.6 * U * p,
              h2 = 2.6 * U * p2;
            c.fillStyle = dark ? "#5f6d8a" : "#90a4c8";
            c.beginPath();
            c.moveTo(x - w / 2, y - _h);
            c.lineTo(x + w / 2, y - _h);
            c.lineTo(x2 + w2 / 2, y2 - h2);
            c.lineTo(x2 - w2 / 2, y2 - h2);
            c.fill();
            c.fillStyle = dark ? "#3d4b6b" : "#4f6fa8";
            c.fillRect(x - w / 2, y - _h, w, _h);
            c.fillStyle = "#cfe8ff";
            c.fillRect(x - w * 0.36, y - _h * 0.86, w * 0.72, _h * 0.3);
            c.fillStyle = "#ffd23f";
            c.fillRect(x - w / 2, y - _h * 0.4, w, _h * 0.06);
            c.fillStyle = "#fff9c4";
            [-0.3, 0.3].forEach(function (o2) {
              c.beginPath();
              c.arc(x + o2 * w, y - _h * 0.18, 5 * p, 0, 7);
              c.fill();
            });
            if (o.ramp) {
              var zr = Math.max(-0.8, o.z - _this2.RL),
                pr = P(zr),
                xr = X(o.lane, zr),
                yr = Y(zr),
                wr = LW * 0.82 * pr;
              c.fillStyle = dark ? "#8d7a4a" : "#d9b45a";
              c.beginPath();
              c.moveTo(xr - wr / 2, yr);
              c.lineTo(xr + wr / 2, yr);
              c.lineTo(x + w / 2, y - _h);
              c.lineTo(x - w / 2, y - _h);
              c.fill();
              c.strokeStyle = "rgba(0,0,0,0.3)";
              c.lineWidth = 2;
              for (var _i4 = 1; _i4 < 5; _i4++) {
                var f = _i4 / 5,
                  zz = zr + (o.z - zr) * f,
                  pp = P(zz),
                  yy = Y(zz) - _this2.TOP * U * pp * f,
                  ww = LW * 0.82 * pp;
                c.beginPath();
                c.moveTo(X(o.lane, zz) - ww / 2, yy);
                c.lineTo(X(o.lane, zz) + ww / 2, yy);
                c.stroke();
              }
            }
          }
        },
        _ret;
      for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
        _ret = _loop2();
        if (_ret === 0) continue;
      }
    } catch (err) {
      _iterator3.e(err);
    } finally {
      _iterator3.f();
    }
    if (!drewMe) drawMe();
    if (G.t < 4.5 && !s.dead) {
      var a = Math.min(1, 4.5 - G.t);
      c.globalAlpha = a;
      c.fillStyle = "rgba(0,0,0,0.6)";
      c.fillRect(16, 48, W - 32, 96);
      G.text(c, "MISSIONS \xB7 MULTIPLIER x".concat(s.miss.mult), W / 2, 62, 10, "#ffd23f");
      s.miss.set.forEach(function (q, i) {
        return G.text(c, (q.done ? "✓ " : "· ") + _this2.mlabel(q) + (q.done ? "" : " (".concat(Math.min(q.n, s.st[q.k] || 0), "/").concat(q.n, ")")), W / 2, 84 + i * 20, 10, q.done ? "#7cff6b" : "#fff");
      });
      c.globalAlpha = 1;
    }
    G.hud(c, "\uD83E\uDDB4".concat(s.bones, " x").concat(s.miss.mult), "".concat(s.score), [s.mag > 0 ? "🧲" : "", s.dbl > 0 ? "⭐" : "", s.shield > 0 ? "🛹" : ""].join(""));
    s.pops.forEach(function (p, i) {
      return G.text(c, p.txt, W / 2, H * 0.32 + i * 18 - (1 - p.t) * 12, p.txt.length > 4 ? 12 : 11, "#ffd23f");
    });
    if (s.dead) G.banner(c, "BUSTED!", "#ff5252");
    G.hint(c, "SWIPE ← → ↑ ↓", 4);
  }
});