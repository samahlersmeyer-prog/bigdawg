function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
(function () {
  var ORDER = [20, 1, 18, 4, 13, 6, 10, 15, 2, 17, 3, 19, 7, 16, 8, 11, 14, 9, 12, 5];
  var RB = 0.05,
    ROB = 0.11,
    RT1 = 0.56,
    RT2 = 0.63,
    RD1 = 0.93,
    RD2 = 1.0,
    RSUR = 1.22;
  var AIM_OFF = 64;
  var FLY = 0.24;
  var ROUNDS = 10;
  var BLACK = "#1b1b1b",
    CREAM = "#f1e3bf",
    RED = "#d62828",
    GREEN = "#1d8a3a";
  function layout(G) {
    var s = G.s,
      W = G.W,
      H = G.H;
    s.R = Math.max(70, Math.min(W * 0.36, (H - 34 - 175) / 2 / RSUR));
    s.cx = W / 2;
    s.cy = 34 + 10 + s.R * RSUR;
    s.callY = s.cy + s.R * RSUR + 26;
  }
  function score(G, x, y) {
    var s = G.s,
      dx = x - s.cx,
      dy = y - s.cy,
      r = Math.hypot(dx, dy) / s.R;
    if (r > RD2) return {
      pts: 0,
      num: 0,
      call: "MISS",
      miss: true
    };
    if (r <= RB) return {
      pts: 50,
      num: 25,
      call: "BULL!"
    };
    if (r <= ROB) return {
      pts: 25,
      num: 25,
      call: "25"
    };
    var a = Math.atan2(dx, -dy) * 180 / Math.PI;
    if (a < 0) a += 360;
    var n = ORDER[Math.floor((a + 9) / 18) % 20];
    if (r >= RD1) return {
      pts: n * 2,
      num: n,
      call: "D" + n
    };
    if (r >= RT1 && r <= RT2) return {
      pts: n * 3,
      num: n,
      call: "T" + n + "!"
    };
    return {
      pts: n,
      num: n,
      call: "" + n
    };
  }
  function wobbleAmp(s) {
    return Math.min(36, 7 + s.round * 1.1 + s.hold * 8);
  }
  function aimPos(G) {
    var s = G.s,
      a = wobbleAmp(s),
      t = G.t;
    return [s.ax + a * (0.7 * Math.sin(t * 3.1 + 0.4) + 0.3 * Math.sin(t * 7.3 + 1.7)), s.ay + a * (0.7 * Math.sin(t * 2.3 + 2.1) + 0.3 * Math.sin(t * 6.1 + 0.3))];
  }
  function gauss() {
    return (Math.random() + Math.random() + Math.random() - 1.5) / 0.5;
  }
  function setFace(s, f, t) {
    s.face = f;
    s.faceT = t;
  }
  function startAim(G, x, y) {
    var s = G.s;
    if (s.phase !== "aim") return;
    s.aiming = true;
    s.hold = 0;
    s.ax = x;
    s.ay = y - AIM_OFF;
  }
  function throwDart(G) {
    var s = G.s;
    if (!s.aiming || s.phase !== "aim") return;
    s.aiming = false;
    var _aimPos = aimPos(G),
      _aimPos2 = _slicedToArray(_aimPos, 2),
      wx = _aimPos2[0],
      wy = _aimPos2[1],
      sc = 3 + s.round * 0.35;
    var tx = wx + gauss() * sc,
      ty = wy + gauss() * sc;
    s.fly = {
      x0: s.cx + (Math.random() - 0.5) * 60,
      y0: G.H + 20,
      x: tx,
      y: ty,
      t: 0
    };
    s.phase = "fly";
  }
  function land(G) {
    var s = G.s,
      f = s.fly,
      res = score(G, f.x, f.y);
    s.darts.push({
      x: f.x,
      y: f.y,
      pts: res.pts,
      num: res.num,
      miss: !!res.miss
    });
    s.fly = null;
    s.rt += res.pts;
    s.total += res.pts;
    s.call = res.call;
    s.callT = 1.4;
    s.callC = res.miss ? "#ff6b6b" : res.pts >= 50 || res.call[0] === "T" ? "#ffd23f" : res.call[0] === "D" ? "#7ee081" : "#fff";
    s.pops.push({
      x: f.x,
      y: f.y - 14,
      t: 0.8,
      txt: res.miss ? "0" : "+" + res.pts
    });
    if (res.miss) {
      setFace(s, ":dawgsus:", 1.4);
      G.sfx("lose");
      G.buzz();
    } else if (res.pts >= 50) {
      setFace(s, ":dawgpog:", 1.2);
      G.sfx("win");
    } else G.sfx("pop");
    if (s.darts.length >= 3) {
      var d = s.darts;
      if (!d[0].miss && d[0].num === d[1].num && d[1].num === d[2].num && !d[1].miss && !d[2].miss) {
        s.rt += 50;
        s.total += 50;
        s.hat = 1.6;
        G.sfx("win");
      }
      if (s.rt >= 60) setFace(s, ":dawgpog:", 1.8);else if (s.rt < 20) setFace(s, ":dawgcope:", 1.8);
      s.phase = "end";
      s.endT = 2.0;
      s.hat = s.hat > 0 ? 2.0 : 0;
      s.hist.push(s.rt);
    } else s.phase = "aim";
  }
  defGame({
    key: "darts",
    name: "Dawg Darts",
    icon: "🎯",
    max: 9999,
    cat: "sports",
    blurb: "10 rounds, 3 darts. Steady paws.",
    how: "Touch and hold to aim (the crosshair floats just above your thumb). It wobbles like a shaky paw, worse the longer you hold. Let go to throw. 10 rounds of 3 darts. Triple ring x3, double ring x2, bull 50. Same number 3 times in a round = +50 hat trick.",
    reset: function reset(G) {
      G.s = {
        round: 1,
        darts: [],
        rt: 0,
        total: 0,
        phase: "aim",
        aiming: false,
        hold: 0,
        ax: 0,
        ay: 0,
        fly: null,
        call: "",
        callT: 0,
        callC: "#fff",
        pops: [],
        hat: 0,
        endT: 0,
        face: ":dawgW:",
        faceT: 0,
        hist: [],
        kx: 0,
        ky: 0,
        keys: {}
      };
      layout(G);
      G.s.ax = G.s.cx;
      G.s.ay = G.s.cy;
    },
    update: function update(G, dt) {
      var s = G.s;
      if (s.aiming) {
        s.hold += dt;
        var k = s.keys,
          sp = 140 * dt;
        if (k.ArrowLeft) s.ax -= sp;
        if (k.ArrowRight) s.ax += sp;
        if (k.ArrowUp) s.ay -= sp;
        if (k.ArrowDown) s.ay += sp;
      }
      if (s.fly) {
        s.fly.t += dt;
        if (s.fly.t >= FLY) land(G);
      }
      if (s.callT > 0) s.callT -= dt;
      if (s.hat > 0) s.hat -= dt;
      if (s.faceT > 0) {
        s.faceT -= dt;
        if (s.faceT <= 0) s.face = ":dawgW:";
      }
      var _iterator = _createForOfIteratorHelper(s.pops),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var p = _step.value;
          p.t -= dt;
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
      if (s.pops.length && s.pops[0].t <= 0) s.pops = s.pops.filter(function (p) {
        return p.t > 0;
      });
      if (s.phase === "end") {
        s.endT -= dt;
        if (s.endT <= 0) {
          if (s.round >= ROUNDS) {
            var sc = Math.min(9999, Math.max(0, Math.round(s.total)));
            G.over(sc, sc >= 600 ? "Pub legend!" : sc >= 400 ? "Steady paws." : sc >= 250 ? "Good boy." : "Ruff night at the pub.");
            return;
          }
          s.round++;
          s.darts = [];
          s.rt = 0;
          s.phase = "aim";
        }
      }
    },
    down: function down(G, x, y) {
      startAim(G, x, y);
    },
    move: function move(G, x, y) {
      var s = G.s;
      if (s.aiming) {
        s.ax = x;
        s.ay = y - AIM_OFF;
      }
    },
    up: function up(G) {
      throwDart(G);
    },
    onKey: function onKey(G, k, isDown) {
      var s = G.s;
      if (k === " ") {
        if (isDown && !s.aiming && s.phase === "aim") {
          s.aiming = true;
          s.hold = 0;
        } else if (!isDown) throwDart(G);
      } else if (/^Arrow/.test(k)) s.keys[k] = isDown;
    },
    draw: function draw(G, c) {
      var s = G.s,
        W = G.W,
        H = G.H,
        dark = G.dark(),
        R = s.R,
        cx = s.cx,
        cy = s.cy;
      c.fillStyle = dark ? "#2a1a10" : "#8a5a34";
      c.fillRect(0, 0, W, H);
      c.fillStyle = dark ? "#311f13" : "#94633b";
      for (var x = 0; x < W; x += 36) c.fillRect(x, 0, 18, H);
      c.fillStyle = dark ? "#1c120a" : "#6e4526";
      for (var _x = 0; _x < W; _x += 36) c.fillRect(_x, 0, 2, H);
      c.fillStyle = dark ? "rgba(255,210,120,0.06)" : "rgba(255,240,200,0.18)";
      c.beginPath();
      c.arc(cx, cy, R * RSUR + 14, 0, 7);
      c.fill();
      c.fillStyle = "#111";
      c.beginPath();
      c.arc(cx, cy, R * RSUR, 0, 7);
      c.fill();
      c.strokeStyle = "#555";
      c.lineWidth = 3;
      c.stroke();
      var rings = [[RD2, RD1, 1], [RD1, RT2, 0], [RT2, RT1, 1], [RT1, ROB, 0]];
      for (var i = 0; i < 20; i++) {
        var a0 = (i * 18 - 9 - 90) * Math.PI / 180,
          a1 = a0 + Math.PI / 10,
          even = i % 2 === 0;
        var _iterator2 = _createForOfIteratorHelper(rings),
          _step2;
        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var _step2$value = _slicedToArray(_step2.value, 3),
              ro = _step2$value[0],
              ri = _step2$value[1],
              ring = _step2$value[2];
            c.fillStyle = ring ? even ? RED : GREEN : even ? BLACK : CREAM;
            c.beginPath();
            c.arc(cx, cy, R * ro, a0, a1);
            c.arc(cx, cy, R * ri, a1, a0, true);
            c.closePath();
            c.fill();
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }
      }
      c.fillStyle = GREEN;
      c.beginPath();
      c.arc(cx, cy, R * ROB, 0, 7);
      c.fill();
      c.fillStyle = RED;
      c.beginPath();
      c.arc(cx, cy, R * RB, 0, 7);
      c.fill();
      c.strokeStyle = "rgba(200,200,200,0.55)";
      c.lineWidth = 1;
      for (var _i = 0, _arr = [RD2, RD1, RT2, RT1, ROB, RB]; _i < _arr.length; _i++) {
        var r = _arr[_i];
        c.beginPath();
        c.arc(cx, cy, R * r, 0, 7);
        c.stroke();
      }
      c.beginPath();
      for (var _i2 = 0; _i2 < 20; _i2++) {
        var a = (_i2 * 18 - 9 - 90) * Math.PI / 180,
          ca = Math.cos(a),
          sa = Math.sin(a);
        c.moveTo(cx + ca * R * ROB, cy + sa * R * ROB);
        c.lineTo(cx + ca * R * RD2, cy + sa * R * RD2);
      }
      c.stroke();
      var ns = Math.max(8, Math.round(R * 0.085));
      for (var _i3 = 0; _i3 < 20; _i3++) {
        var _a = (_i3 * 18 - 90) * Math.PI / 180,
          rr = R * (1 + (RSUR - 1) / 2);
        G.text(c, "" + ORDER[_i3], cx + Math.cos(_a) * rr, cy + Math.sin(_a) * rr + 1, ns, "#fff");
      }
      var _iterator3 = _createForOfIteratorHelper(s.darts),
        _step3;
      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var _d = _step3.value;
          drawDart(c, _d.x, _d.y, 1);
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }
      if (s.fly) {
        var f = s.fly,
          p = Math.min(1, f.t / FLY),
          e = 1 - (1 - p) * (1 - p);
        var _x2 = f.x0 + (f.x - f.x0) * e,
          y = f.y0 + (f.y - f.y0) * e - Math.sin(p * Math.PI) * 40;
        drawDart(c, _x2, y, 1 + (1 - p) * 1.4);
      }
      var _iterator4 = _createForOfIteratorHelper(s.pops),
        _step4;
      try {
        for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
          var _p = _step4.value;
          if (_p.t > 0) G.text(c, _p.txt, _p.x, _p.y - (0.8 - _p.t) * 30, 11, "#ffd23f");
        }
      } catch (err) {
        _iterator4.e(err);
      } finally {
        _iterator4.f();
      }
      if (s.aiming) {
        var _aimPos3 = aimPos(G),
          _aimPos4 = _slicedToArray(_aimPos3, 2),
          _x3 = _aimPos4[0],
          _y = _aimPos4[1],
          _a2 = wobbleAmp(s);
        c.strokeStyle = _a2 > 22 ? "#ff6b6b" : "#ffe14d";
        c.lineWidth = 2.5;
        c.beginPath();
        c.arc(_x3, _y, 9, 0, 7);
        c.moveTo(_x3 - 16, _y);
        c.lineTo(_x3 - 5, _y);
        c.moveTo(_x3 + 5, _y);
        c.lineTo(_x3 + 16, _y);
        c.moveTo(_x3, _y - 16);
        c.lineTo(_x3, _y - 5);
        c.moveTo(_x3, _y + 5);
        c.lineTo(_x3, _y + 16);
        c.stroke();
        c.strokeStyle = "#000";
        c.lineWidth = 1;
        c.beginPath();
        c.arc(_x3, _y, 11, 0, 7);
        c.stroke();
        c.fillStyle = "rgba(255,255,255,0.35)";
        c.beginPath();
        c.arc(s.ax, s.ay + AIM_OFF, 18, 0, 7);
        c.fill();
      }
      var floorY = Math.max(s.callY + 30, H - 70);
      c.fillStyle = dark ? "#3a2416" : "#5b3a22";
      c.fillRect(0, floorY, W, H - floorY);
      c.fillStyle = dark ? "#2e1c10" : "#4c2f1b";
      for (var _x4 = 0; _x4 < W; _x4 += 40) c.fillRect(_x4, floorY, 2, H - floorY);
      c.fillStyle = "#ffd23f";
      c.fillRect(0, floorY, W, 4);
      var dogSz = Math.min(76, H - floorY + 10),
        wob = s.aiming ? Math.sin(G.t * 9) * 0.05 * Math.min(1, s.hold) : 0;
      G.img(c, s.aiming && wobbleAmp(s) > 22 ? ":dawgsweat:" : s.face, 48, floorY - dogSz * 0.18, dogSz, wob);
      for (var _i4 = 0; _i4 < 3; _i4++) {
        var _x5 = W - 120 + _i4 * 40,
          _y2 = floorY + (H - floorY) / 2 + 2,
          d = s.darts[_i4];
        c.fillStyle = "rgba(0,0,0,0.35)";
        c.fillRect(_x5 - 17, _y2 - 14, 34, 28);
        if (d) G.text(c, d.miss ? "X" : "" + d.pts, _x5, _y2 + 1, 10, d.miss ? "#ff6b6b" : "#fff");else if (_i4 === s.darts.length && s.phase !== "end") G.emoji(c, "🎯", _x5, _y2, 16);else G.text(c, "-", _x5, _y2, 10, "#aaa");
      }
      G.text(c, "THIS ROUND", W - 80, floorY - 12, 10, "#fff");
      if (s.phase === "end" && s.endT < 1.3) {
        var bh = s.hat > 0 ? 70 : 50,
          by = s.callY - 16,
          bw = Math.min(W - 24, 270);
        c.fillStyle = "rgba(0,0,0,0.65)";
        c.fillRect(W / 2 - bw / 2, by - 4, bw, bh);
        G.text(c, "ROUND ".concat(s.round, ": ").concat(s.rt), W / 2, by + 12, 14, s.rt >= 60 ? "#ffd23f" : "#fff");
        G.text(c, s.round >= ROUNDS ? "LAST ROUND!" : "NEXT ROUND...", W / 2, by + 33, 10, "#ddd");
        if (s.hat > 0) G.text(c, "HAT TRICK +50", W / 2, by + 53, 12, "#7ee081");
      } else if (s.callT > 0 && s.call) {
        var k = Math.min(1, (1.4 - s.callT) * 8),
          big = s.call.length > 5 ? 22 : 28;
        c.save();
        c.globalAlpha = Math.min(1, s.callT * 3);
        G.banner(c, s.call, s.callC, s.callY, Math.min(big, (W - 24) / s.call.length) * (0.6 + 0.4 * k));
        c.restore();
      } else if (s.phase === "aim" && !s.aiming && G.t > 6 && s.round === 1 && !s.darts.length) {
        G.text(c, "HOLD TO AIM", W / 2, s.callY, 11, "#fff");
      }
      G.hud(c, "TOTAL ".concat(s.total || 0), "RD ".concat(Math.min(ROUNDS, s.round || 1), "/").concat(ROUNDS), "🎯".repeat(s.phase === "end" ? 0 : 3 - s.darts.length - (s.fly ? 1 : 0)));
      if (s.round === 1 && !s.darts.length && !s.fly && !s.aiming) G.hint(c, "HOLD TO AIM · LET GO TO THROW", 6, s.callY);
    }
  });
  function drawDart(c, x, y, k) {
    var dx = 0.45 * k,
      dy = 0.9 * k;
    c.lineCap = "round";
    c.strokeStyle = "rgba(0,0,0,0.35)";
    c.lineWidth = 4 * k;
    c.beginPath();
    c.moveTo(x + 2, y + 2);
    c.lineTo(x + 2 + 26 * dx, y + 2 + 26 * dy);
    c.stroke();
    c.strokeStyle = "#cfd3d6";
    c.lineWidth = 1.6 * k;
    c.beginPath();
    c.moveTo(x, y);
    c.lineTo(x + 7 * dx, y + 7 * dy);
    c.stroke();
    c.strokeStyle = "#3a6fd8";
    c.lineWidth = 4 * k;
    c.beginPath();
    c.moveTo(x + 7 * dx, y + 7 * dy);
    c.lineTo(x + 17 * dx, y + 17 * dy);
    c.stroke();
    c.fillStyle = "#ffd23f";
    var fx = x + 17 * dx,
      fy = y + 17 * dy;
    c.beginPath();
    c.moveTo(fx, fy);
    c.lineTo(fx + 12 * dx - 6 * k, fy + 12 * dy + 1 * k);
    c.lineTo(fx + 14 * dx, fy + 14 * dy);
    c.lineTo(fx + 12 * dx + 6 * k, fy + 12 * dy - 2 * k);
    c.closePath();
    c.fill();
    c.fillStyle = "#c0392b";
    c.beginPath();
    c.arc(x, y, 1.6 * k, 0, 7);
    c.fill();
    c.lineCap = "butt";
  }
})();