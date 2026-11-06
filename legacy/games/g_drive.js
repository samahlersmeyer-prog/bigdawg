function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
(function () {
  var PXM = 8;
  var SEC = 2600;
  var ZONE = 2000 * PXM;
  var START = 400;
  var clamp = function clamp(v, a, b) {
    return v < a ? a : v > b ? b : v;
  };
  var rnd = function rnd(a, b) {
    return a + Math.random() * (b - a);
  };
  var hh = function hh(n) {
    var x = Math.imul((n | 0) ^ 0x9e3779b9, 2654435761);
    x ^= x >>> 15;
    x = Math.imul(x, 2246822519);
    x ^= x >>> 13;
    return (x >>> 0) / 4294967296;
  };
  var E = function E(c, ch, x, y, sz) {
    c.fillStyle = "#000";
    G.emoji(c, ch, x, y, sz);
  };
  var rr = function rr(c, x, y, w, h, r) {
    c.beginPath();
    c.moveTo(x + r, y);
    c.arcTo(x + w, y, x + w, y + h, r);
    c.arcTo(x + w, y + h, x, y + h, r);
    c.arcTo(x, y + h, x, y, r);
    c.arcTo(x, y, x + w, y, r);
    c.closePath();
  };
  var THEMES = [{
    name: "SUBURBS",
    g1: "#6cc04a",
    g2: "#62b443",
    road: "#5a5f6b",
    rum1: "#e63946",
    rum2: "#f5f5f5",
    line: "#ffffff",
    deco: ["🌳", "🏡", "🌲", "🌳", "🏠", "🌷"],
    decoR: null
  }, {
    name: "BEACH",
    g1: "#f2d58a",
    g2: "#ebcb7c",
    road: "#6b6f78",
    rum1: "#2a9df4",
    rum2: "#f5f5f5",
    line: "#ffffff",
    deco: ["🌴", "⛱️", "🌴", "🐚", "🦀"],
    decoR: ["⛵", "🐬", "🏄"]
  }, {
    name: "DESERT",
    g1: "#e0b46c",
    g2: "#d6a85f",
    road: "#6e6258",
    rum1: "#c2410c",
    rum2: "#fde68a",
    line: "#fff3c4",
    deco: ["🌵", "🪨", "🌵", "🦂", "🏜️"],
    decoR: null
  }, {
    name: "NIGHT CITY",
    g1: "#2b2d42",
    g2: "#30334a",
    road: "#24262f",
    rum1: "#facc15",
    rum2: "#3f3f46",
    line: "#fde047",
    deco: ["🏢", "🏬", "🏙️", "🏢", "🏨"],
    decoR: null
  }];
  var zoneOf = function zoneOf(wy) {
    var z = Math.floor(wy / ZONE);
    return (z % 4 + 4) % 4;
  };
  var LW = 64,
    AMP = 40,
    NL = 0,
    NR = 0;
  function geo(G) {
    LW = Math.min(66, Math.floor((G.W - 64) / 4));
    AMP = Math.max(0, (G.W - 4 * LW) / 2 - 18);
  }
  var cxAt = function cxAt(G, wy) {
    return G.W / 2 + AMP * (0.6 * Math.sin(wy / 900) + 0.4 * Math.sin(wy / 2300 + 1));
  };
  function nar(wy) {
    NL = 0;
    NR = 0;
    var k = Math.floor(wy / SEC);
    if (k < 2) return;
    var h = hh(k * 7 + 3);
    if (h < 0.4) return;
    var p = wy - k * SEC,
      f = clamp(Math.min((p - 300) / 260, (SEC - 300 - p) / 260), 0, 1);
    if (h < 0.7) NL = f;else NR = f;
  }
  var laneX = function laneX(G, lp, wy) {
    return cxAt(G, wy) + (lp - 1.5) * LW;
  };
  function laneOk(i, wy) {
    nar(wy);
    return !(i === 0 && NL > 0.02 || i === 3 && NR > 0.02);
  }
  function laneOkSpan(i, wy, span) {
    for (var d = 0; d <= span; d += 150) if (!laneOk(i, wy + d)) return false;
    return true;
  }
  function nLanes(wy) {
    nar(wy);
    return 4 - (NL > 0.5 ? 1 : 0) - (NR > 0.5 ? 1 : 0);
  }
  var PYf = function PYf(G) {
    return Math.round(G.H * 0.76);
  };
  var score = function score(s) {
    return Math.min(99999, Math.floor((s.py - START) / (PXM * 5)) + s.bones * 50);
  };
  var CAR_COLS = ["#3b82f6", "#22c55e", "#a855f7", "#f97316", "#14b8a6", "#eab308", "#ec4899", "#e5e7eb", "#0ea5e9"];
  function newTraffic(s, kind, lane, wy) {
    var t = s.time,
      sp = 1 + Math.min(0.5, t / 200);
    var o = {
      kind: kind,
      lane: lane,
      lp: lane,
      tl: lane,
      wy: wy,
      blink: 0,
      nc: rnd(1.5, 5),
      col: CAR_COLS[Math.random() * CAR_COLS.length | 0],
      w: 30,
      h: 50,
      bv: 170,
      cv: 170,
      chg: false,
      bump: 0
    };
    if (kind === "car") {
      o.bv = rnd(150, 215) * sp;
      o.chg = Math.random() < (t < 20 ? 0.25 : 0.5);
    } else if (kind === "truck") {
      o.w = 36;
      o.h = 86;
      o.bv = rnd(130, 165) * sp;
      o.col = ["#dc2626", "#2563eb", "#16a34a", "#7c3aed"][Math.random() * 4 | 0];
      o.chg = Math.random() < 0.2;
    } else if (kind === "mail") {
      o.w = 32;
      o.h = 60;
      o.bv = rnd(135, 160) * sp;
      o.chg = Math.random() < 0.35;
    } else {
      o.w = 40;
      o.h = 58;
      o.bv = 75 * sp;
    }
    o.cv = o.bv;
    return o;
  }
  function crowd(s, wy, r) {
    var n = 0;
    var _iterator = _createForOfIteratorHelper(s.cars),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var o = _step.value;
        if (Math.abs(o.wy - wy) < r) n++;
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
    return n;
  }
  var lbits = function lbits(lp) {
    return 1 << Math.floor(lp) | 1 << Math.ceil(lp);
  };
  var pop = function pop(m) {
    return (m & 1) + (m >> 1 & 1) + (m >> 2 & 1) + (m >> 3 & 1);
  };
  function occ(s, wy, r, skip) {
    var m = 0;
    var _iterator2 = _createForOfIteratorHelper(s.cars),
      _step2;
    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        var o = _step2.value;
        if (o !== skip && Math.abs(o.wy - wy) < r) m |= lbits(o.lp) | lbits(o.tl);
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }
    return m;
  }
  function bandLimit(s, wy) {
    return Math.max(0, nLanes(wy) - (s.time < 25 ? 3 : 2));
  }
  function spawnTraffic(G, wy) {
    var s = G.s;
    if (crowd(s, wy, 190) >= bandLimit(s, wy) + 1) return false;
    var ok = [];
    for (var i = 0; i < 4; i++) if (laneOkSpan(i, wy, 1500)) ok.push(i);
    var _loop = function _loop() {
        var li = Math.random() * ok.length | 0,
          lane = ok[li];
        if (s.cars.some(function (o) {
          return Math.abs(o.lp - lane) < 0.9 && Math.abs(o.wy - wy) < 130;
        }) || pop(occ(s, wy, 200) | 1 << lane) >= nLanes(wy)) {
          ok.splice(li, 1);
          return 0;
        }
        var r = Math.random(),
          t = s.time;
        var kind = r < 0.62 ? "car" : r < 0.8 ? "truck" : r < 0.92 ? "mail" : t > 15 ? "sweeper" : "car";
        s.cars.push(newTraffic(s, kind, lane, wy));
        return {
          v: true
        };
      },
      _ret;
    for (var tries = 0; tries < 4 && ok.length; tries++) {
      _ret = _loop();
      if (_ret === 0) continue;
      if (_ret) return _ret.v;
    }
    return false;
  }
  function spawnThing(G, type, wy) {
    var s = G.s,
      ok = [];
    for (var i = 0; i < 4; i++) if (laneOk(i, wy)) ok.push(i);
    var lane = ok[Math.random() * ok.length | 0];
    s.things.push({
      type: type,
      lane: lane,
      wy: wy,
      got: false
    });
  }
  function bonk(G, o) {
    var s = G.s;
    s.lives--;
    s.inv = 2.2;
    s.dizzy = 1.3;
    s.v *= 0.35;
    s.turbo = 0;
    var ox = laneX(G, o.lp, o.wy);
    s.kx = (s.px < ox ? -1 : 1) * 260;
    o.wy += 40;
    o.bump = 0.4;
    G.sfx("lose");
    G.buzz();
    s.pops.push({
      x: s.px,
      y: PYf(G) - 50,
      txt: "BONK!",
      c: "#ffd23f",
      t: 0.9
    });
    if (s.lives <= 0 && !s.dead) {
      s.dead = 1.1;
      s.why = "lives";
    }
  }
  function turbo(G) {
    var s = G.s;
    if (s.dead || s.tcd > 0) return;
    s.turbo = 1.3;
    s.tcd = 3;
    G.sfx("pop");
    s.pops.push({
      x: s.px,
      y: PYf(G) - 50,
      txt: "TURBO!",
      c: "#7df9ff",
      t: 0.7
    });
  }
  function drawVehicle(G, c, o, x, y) {
    var w = o.w,
      h = o.h,
      l = x - w / 2,
      t = y - h / 2;
    c.fillStyle = "rgba(0,0,0,0.28)";
    rr(c, l + 3, t + 4, w, h, 7);
    c.fill();
    c.fillStyle = "#111";
    c.fillRect(l - 3, t + 8, 5, 13);
    c.fillRect(l + w - 2, t + 8, 5, 13);
    c.fillRect(l - 3, t + h - 20, 5, 13);
    c.fillRect(l + w - 2, t + h - 20, 5, 13);
    c.strokeStyle = "#1a1a1a";
    c.lineWidth = 2;
    if (o.kind === "car") {
      c.fillStyle = o.col;
      rr(c, l, t, w, h, 8);
      c.fill();
      c.stroke();
      c.fillStyle = "#9fd8ff";
      rr(c, l + 4, t + 11, w - 8, 9, 3);
      c.fill();
      c.fillStyle = "rgba(0,0,0,0.18)";
      rr(c, l + 4, t + 21, w - 8, h * 0.34, 3);
      c.fill();
      c.fillStyle = "#7fb8e0";
      rr(c, l + 5, t + h - 13, w - 10, 6, 2);
      c.fill();
    } else if (o.kind === "truck") {
      c.fillStyle = o.col;
      rr(c, l + 2, t, w - 4, 24, 6);
      c.fill();
      c.stroke();
      c.fillStyle = "#9fd8ff";
      c.fillRect(l + 6, t + 8, w - 12, 6);
      c.fillStyle = "#e5e7eb";
      rr(c, l, t + 26, w, h - 26, 3);
      c.fill();
      c.stroke();
      c.fillStyle = o.col;
      c.fillRect(l + 3, t + 40, w - 6, 5);
      c.fillRect(l + 3, t + 62, w - 6, 5);
    } else if (o.kind === "mail") {
      c.fillStyle = "#f8fafc";
      rr(c, l, t, w, h, 6);
      c.fill();
      c.stroke();
      c.fillStyle = "#9fd8ff";
      rr(c, l + 4, t + 8, w - 8, 7, 2);
      c.fill();
      c.fillStyle = "#1d4ed8";
      c.fillRect(l + 2, t + 22, w - 4, 6);
      c.fillStyle = "#dc2626";
      c.fillRect(l + 2, t + 29, w - 4, 4);
      E(c, "📬", x, t + 45, 16);
    } else {
      c.fillStyle = "#f4c430";
      rr(c, l, t + 8, w, h - 8, 7);
      c.fill();
      c.stroke();
      c.fillStyle = "#9fd8ff";
      c.fillRect(l + 7, t + 16, w - 14, 7);
      c.fillStyle = "#3f3f46";
      c.fillRect(l + 5, t + 30, w - 10, h - 40);
      if ((G.t * 4 | 0) % 2) {
        c.fillStyle = "#ff8c00";
        c.beginPath();
        c.arc(x, t + 26, 4, 0, 7);
        c.fill();
      }
      for (var _i = 0, _arr = [l + 3, l + w - 3]; _i < _arr.length; _i++) {
        var bx = _arr[_i];
        c.fillStyle = "#94a3b8";
        c.beginPath();
        c.arc(bx, t + 6, 9, 0, 7);
        c.fill();
        c.strokeStyle = "#475569";
        c.lineWidth = 2;
        c.beginPath();
        for (var k = 0; k < 3; k++) {
          var a = G.t * 14 + k * 2.094;
          c.moveTo(bx, t + 6);
          c.lineTo(bx + Math.cos(a) * 9, t + 6 + Math.sin(a) * 9);
        }
        c.stroke();
      }
    }
    c.fillStyle = "#fff7b0";
    c.fillRect(l + 3, t + 1, 5, 3);
    c.fillRect(l + w - 8, t + 1, 5, 3);
    c.fillStyle = "#ef4444";
    c.fillRect(l + 3, t + h - 4, 5, 3);
    c.fillRect(l + w - 8, t + h - 4, 5, 3);
    if (o.tl !== o.lane && (G.t * 6 | 0) % 2) {
      var sx = o.tl < o.lane ? l - 1 : l + w + 1;
      c.fillStyle = "#ffb703";
      c.beginPath();
      c.arc(sx, t + 5, 4, 0, 7);
      c.arc(sx, t + h - 5, 4, 0, 7);
      c.fill();
    }
  }
  function drawPlayer(G, c, s, x, y) {
    c.save();
    c.translate(x, y);
    c.rotate(s.ang + clamp(s.vx * 0.0011, -0.25, 0.25));
    if (s.inv > 0 && (G.t * 12 | 0) % 2) c.globalAlpha = 0.45;
    c.fillStyle = "rgba(0,0,0,0.3)";
    rr(c, -15, -26, 34, 58, 9);
    c.fill();
    if (s.turbo > 0) {
      for (var _i2 = 0, _arr2 = [-8, 8]; _i2 < _arr2.length; _i2++) {
        var fx = _arr2[_i2];
        var _fl = 12 + Math.random() * 12;
        c.fillStyle = "#ff8c00";
        c.beginPath();
        c.moveTo(fx - 5, 29);
        c.lineTo(fx + 5, 29);
        c.lineTo(fx, 29 + _fl);
        c.fill();
        c.fillStyle = "#ffe066";
        c.beginPath();
        c.moveTo(fx - 3, 29);
        c.lineTo(fx + 3, 29);
        c.lineTo(fx, 29 + _fl * 0.55);
        c.fill();
      }
    }
    c.fillStyle = "#111";
    c.fillRect(-20, -22, 6, 14);
    c.fillRect(14, -22, 6, 14);
    c.fillRect(-20, 8, 6, 15);
    c.fillRect(14, 8, 6, 15);
    c.fillStyle = "#e63946";
    c.strokeStyle = "#5c0f17";
    c.lineWidth = 2;
    rr(c, -17, -29, 34, 58, 9);
    c.fill();
    c.stroke();
    c.fillStyle = "#fff";
    c.fillRect(-3, -28, 6, 15);
    c.fillStyle = "#ff8f98";
    c.fillRect(-14, -26, 4, 10);
    c.fillStyle = "#9fd8ff";
    c.strokeStyle = "#333";
    rr(c, -14, -13, 28, 6, 2);
    c.fill();
    c.stroke();
    c.fillStyle = "#3a2a22";
    rr(c, -13, -6, 26, 27, 5);
    c.fill();
    var fl = 0.35 + 0.3 * Math.sin(G.t * (s.turbo > 0 ? 40 : 24));
    c.fillStyle = "#8a5a3b";
    c.save();
    c.translate(-10, 0);
    c.rotate(0.5 + fl);
    c.beginPath();
    c.ellipse(0, 7, 4.5, 9, 0, 0, 7);
    c.fill();
    c.restore();
    c.save();
    c.translate(10, 0);
    c.rotate(-0.5 - fl);
    c.beginPath();
    c.ellipse(0, 7, 4.5, 9, 0, 0, 7);
    c.fill();
    c.restore();
    var face = s.dead ? ":dawgpain:" : s.dizzy > 0 ? ":dawgpain:" : s.spin > 0 ? ":dawgsus:" : s.turbo > 0 ? ":dawgpog:" : s.fuel < 20 ? ":dawgsweat:" : ":dawgW:";
    G.img(c, face, 0, 3, 28);
    c.fillStyle = "#c92a37";
    rr(c, -14, 21, 28, 6, 2);
    c.fill();
    c.fillStyle = "#fff7b0";
    c.fillRect(-14, -29, 6, 3);
    c.fillRect(8, -29, 6, 3);
    c.fillStyle = "#ff3b3b";
    c.fillRect(-14, 26, 6, 3);
    c.fillRect(8, 26, 6, 3);
    c.restore();
    if (s.dizzy > 0 || s.dead) for (var k = 0; k < 3; k++) {
      var a = G.t * 6 + k * 2.094;
      E(c, "⭐", x + Math.cos(a) * 20, y - 2 + Math.sin(a) * 8, 13);
    }
  }
  defGame({
    key: "drive",
    name: "Road Dawg",
    icon: "🚙",
    max: 99999,
    blurb: "Floor it. Weave through traffic.",
    how: "Drag or hold anywhere: the car steers toward your finger. Quick tap = TURBO (3 s cooldown). Dodge traffic and oil slicks, stay off the grass, grab ⛽ before the tank runs dry. 🦴 = +50. 3 bonks and you're done.",
    reset: function reset(G) {
      geo(G);
      G.s = {
        py: START,
        px: 0,
        vx: 0,
        kx: 0,
        v: 300,
        ang: 0,
        spin: 0,
        spinDir: 1,
        dizzy: 0,
        inv: 0,
        lives: 3,
        fuel: 100,
        bones: 0,
        turbo: 0,
        tcd: 0,
        hold: false,
        tx: 0,
        kdir: 0,
        time: 0,
        cars: [],
        things: [],
        pops: [],
        dead: 0,
        why: "",
        nextCar: START + 700,
        nextBone: START + 900,
        nextFuel: START + 2600,
        nextOil: START + 5000,
        zone: 0,
        banner: "SUBURBS",
        bt: 2,
        off: false,
        shake: 0
      };
      var s = G.s;
      s.px = laneX(G, 1.5, START + 0) + LW / 2;
      var PY = PYf(G);
      for (var _i3 = 0, _arr3 = [PY - 60, PY + 200]; _i3 < _arr3.length; _i3++) {
        var d = _arr3[_i3];
        spawnTraffic(G, START + d);
      }
      s.nextCar = START + PY + 120;
    },
    update: function update(G, dt) {
      var s = G.s,
        PY = PYf(G);
      s.time += dt;
      var cruise = 300 + Math.min(300, s.time * 2.6);
      if (!s.dead) {
        s.fuel -= dt * (1.7 + (s.turbo > 0 ? 1.3 : 0));
        if (s.fuel <= 0) {
          s.fuel = 0;
          s.dead = 1.8;
          s.why = "gas";
          G.sfx("lose");
        }
      }
      nar(s.py);
      var cx = cxAt(G, s.py),
        le = cx - 2 * LW + NL * LW,
        re = cx + 2 * LW - NR * LW;
      s.le = le;
      s.re = re;
      s.off = s.px - 12 < le || s.px + 12 > re;
      var tv = s.dead ? 0 : cruise * (s.turbo > 0 ? 1.55 : 1);
      if (s.off) tv = Math.min(tv, 115);
      if (s.spin > 0) tv *= 0.6;
      if (s.v < tv) s.v = Math.min(tv, s.v + (s.turbo > 0 ? 700 : 240) * dt);else s.v = Math.max(tv, s.v - (s.off ? 650 : s.dead ? 260 : 300) * dt);
      s.turbo -= dt;
      s.tcd -= dt;
      s.inv -= dt;
      s.dizzy -= dt;
      if (s.spin > 0) {
        s.spin -= dt;
        s.ang += 13 * dt * s.spinDir;
        if (s.spin <= 0) s.ang = 0;
      } else if (!s.dead) {
        var dvx = 0;
        if (s.hold) dvx = clamp((s.tx - s.px) * 9, -(360 + s.v * 0.35), 360 + s.v * 0.35);else if (s.kdir) dvx = s.kdir * (300 + s.v * 0.3);
        s.vx += (dvx - s.vx) * Math.min(1, dt * 12);
      } else s.vx *= Math.exp(-4 * dt);
      s.px += (s.vx + s.kx) * dt;
      s.kx *= Math.exp(-6 * dt);
      s.px = clamp(s.px, 16, G.W - 16);
      s.py += s.v * dt;
      s.shake = s.off && s.v > 40 ? 1.5 : 0;
      var _iterator3 = _createForOfIteratorHelper(s.cars),
        _step3;
      try {
        var _loop2 = function _loop2() {
          var o = _step3.value;
          o.cv = o.bv;
          o.bump -= dt;
          var ahead = 0,
            minAhead = 1e9,
            am = lbits(o.lp) | lbits(o.tl);
          var _iterator6 = _createForOfIteratorHelper(s.cars),
            _step6;
          try {
            for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
              var p = _step6.value;
              if (p === o) continue;
              var _d = p.wy - o.wy;
              if (_d > 0 && _d < 200) {
                ahead++;
                am |= lbits(p.lp) | lbits(p.tl);
                if (p.cv < minAhead) minAhead = p.cv;
              }
              if (_d > 0 && _d < 120 && Math.abs(p.lp - o.lp) < 0.95) o.cv = Math.min(o.cv, p.bv * 0.98);
            }
          } catch (err) {
            _iterator6.e(err);
          } finally {
            _iterator6.f();
          }
          if (ahead > 0 && (ahead >= bandLimit(s, o.wy) || pop(am) >= Math.min(nLanes(o.wy), nLanes(o.wy + 200)))) o.cv = Math.min(o.cv, minAhead);
          if (o.tl !== o.lane) {
            if (o.blink > 0) o.blink -= dt;else {
              var dir = Math.sign(o.tl - o.lp);
              o.lp += dir * 1.5 * dt;
              if ((o.tl - o.lp) * dir <= 0) {
                o.lp = o.tl;
                o.lane = o.tl;
                o.nc = rnd(2, 6);
              }
            }
          } else {
            var mustMerge = !laneOk(o.lane, o.wy + 320);
            o.nc -= dt;
            if (mustMerge || o.chg && o.nc <= 0) {
              o.nc = rnd(1, 3);
              var dirs = o.lane === 0 ? [1] : o.lane === 3 ? [-1] : Math.random() < 0.5 ? [-1, 1] : [1, -1];
              var _loop3 = function _loop3() {
                  var d = _dirs[_i4];
                  var nl = o.lane + d;
                  if (!laneOkSpan(nl, o.wy, 600)) return 0;
                  if (s.cars.some(function (p) {
                    return p !== o && Math.abs(p.lp - nl) < 0.9 && Math.abs(p.wy - o.wy) < 140;
                  })) return 0;
                  if (!mustMerge && pop(occ(s, o.wy, 200, o) | lbits(o.lp) | 1 << nl) >= nLanes(o.wy)) return 0;
                  var sy = PY - (o.wy - s.py);
                  if (sy > PY - 150 && sy < PY + 60 && Math.abs(laneX(G, nl, o.wy) - s.px) < LW * 0.8) return 0;
                  o.tl = nl;
                  o.blink = mustMerge ? 0.6 : 1.0;
                  return 1;
                },
                _ret2;
              for (var _i4 = 0, _dirs = dirs; _i4 < _dirs.length; _i4++) {
                _ret2 = _loop3();
                if (_ret2 === 0) continue;
                if (_ret2 === 1) break;
              }
            }
          }
          o.wy += o.cv * dt;
        };
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          _loop2();
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }
      var _iterator4 = _createForOfIteratorHelper(s.cars),
        _step4;
      try {
        for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
          var o = _step4.value;
          var ox = o._x = laneX(G, o.lp, o.wy),
            oy = PY - (o.wy - s.py);
          if (s.dead) continue;
          if (s.inv <= 0 && Math.abs(s.px - ox) < (34 + o.w) / 2 - 5 && Math.abs(PY - oy) < (56 + o.h) / 2 - 7) {
            bonk(G, o);
            break;
          }
        }
      } catch (err) {
        _iterator4.e(err);
      } finally {
        _iterator4.f();
      }
      var _iterator5 = _createForOfIteratorHelper(s.things),
        _step5;
      try {
        for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
          var t = _step5.value;
          if (t.got) continue;
          var tx = t._x = laneX(G, t.lane, t.wy),
            ty = PY - (t.wy - s.py);
          if (s.dead) continue;
          if (t.type === "oil") {
            if (s.spin <= 0 && s.inv <= 0 && Math.abs(s.px - tx) < 28 && Math.abs(PY - ty) < 34) {
              t.got = true;
              s.spin = 0.9;
              s.spinDir = Math.random() < 0.5 ? -1 : 1;
              s.vx = s.spinDir * 140;
              s.turbo = 0;
              G.sfx("lose");
              s.pops.push({
                x: s.px,
                y: PY - 50,
                txt: "WHOA!",
                c: "#c4b5fd",
                t: 0.8
              });
            }
          } else if (Math.abs(s.px - tx) < 30 && Math.abs(PY - ty) < 36) {
            t.got = true;
            G.sfx("pop");
            if (t.type === "bone") {
              s.bones++;
              s.pops.push({
                x: tx,
                y: ty - 20,
                txt: "+50",
                c: "#ffd23f",
                t: 0.7
              });
            } else {
              s.fuel = Math.min(100, s.fuel + 35);
              s.pops.push({
                x: tx,
                y: ty - 20,
                txt: "FUEL!",
                c: "#7CFC8A",
                t: 0.8
              });
            }
          }
        }
      } catch (err) {
        _iterator5.e(err);
      } finally {
        _iterator5.f();
      }
      var top = s.py + PY + 110;
      if (top >= s.nextCar) {
        spawnTraffic(G, top);
        var d = Math.min(1, s.time / 110);
        s.nextCar = top + rnd(330, 470) * (1 - d * 0.6);
      }
      if (top >= s.nextBone) {
        spawnThing(G, "bone", top);
        s.nextBone = top + rnd(500, 1100);
      }
      if (top >= s.nextFuel) {
        spawnThing(G, "fuel", top);
        s.nextFuel = top + rnd(3000, 4000) + s.time * 5;
      }
      if (s.time > 18 && top >= s.nextOil) {
        spawnThing(G, "oil", top + 30);
        s.nextOil = top + rnd(2200, 4200) * (s.time > 60 ? 0.7 : 1);
      }
      s.cars = s.cars.filter(function (o) {
        var sy = PY - (o.wy - s.py);
        return sy < G.H + 160 && sy > -900;
      });
      s.things = s.things.filter(function (t) {
        return PY - (t.wy - s.py) < G.H + 80 && !(t.got && t.type !== "oil");
      });
      s.pops.forEach(function (p) {
        return p.t -= dt;
      });
      s.pops = s.pops.filter(function (p) {
        return p.t > 0;
      });
      var z = Math.floor(s.py / ZONE);
      if (z !== s.zone) {
        s.zone = z;
        s.banner = THEMES[zoneOf(s.py)].name;
        s.bt = 2.2;
        G.sfx("win");
      }
      s.bt -= dt;
      if (s.dead) {
        s.dead -= dt;
        if (s.dead <= 0) {
          var sc = score(s);
          G.over(sc, s.why === "gas" ? sc >= 1500 ? "Ran dry. What a drive!" : "Out of gas!" : sc >= 1500 ? "Road Dawg legend!" : "Bonked out!");
        }
      }
    },
    down: function down(G, x) {
      var s = G.s;
      s.hold = true;
      s.tx = x;
      s.downT = G.t;
    },
    move: function move(G, x) {
      G.s.tx = x;
    },
    up: function up(G) {
      G.s.hold = false;
    },
    tap: function tap(G) {
      if (G.t - (G.s.downT || 0) < 0.35) turbo(G);
    },
    onKey: function onKey(G, k, d) {
      var s = G.s;
      if (k === "ArrowLeft" || k === "a") s.kdir = d ? -1 : s.kdir === -1 ? 0 : s.kdir;else if (k === "ArrowRight" || k === "d") s.kdir = d ? 1 : s.kdir === 1 ? 0 : s.kdir;else if (d && (k === " " || k === "ArrowUp" || k === "w")) turbo(G);
    },
    draw: function draw(G, c) {
      var s = G.s,
        W = G.W,
        H = G.H,
        PY = PYf(G),
        dark = G.dark();
      geo(G);
      var shx = s.shake ? (Math.random() - 0.5) * 2 * s.shake : 0;
      c.save();
      c.translate(shx, 0);
      var STEP = 4;
      for (var sy = 0; sy < H; sy += STEP) {
        var wy = s.py + (PY - sy),
          th = THEMES[zoneOf(wy)];
        nar(wy);
        var cx = cxAt(G, wy),
          fl = cx - 2 * LW,
          fr = cx + 2 * LW,
          le = fl + NL * LW,
          re = fr - NR * LW;
        var band = Math.floor(wy / 40) & 1;
        c.fillStyle = band ? th.g1 : th.g2;
        c.fillRect(-4, sy, W + 8, STEP);
        if (th === THEMES[1]) {
          var wx = fr + 44 + 10 * Math.sin(wy / 120);
          c.fillStyle = "#f8e7b5";
          c.fillRect(wx - 6, sy, 6, STEP);
          c.fillStyle = Math.floor((wy + 20 * Math.sin(wy / 50)) / 30) & 1 ? "#3fa7d6" : "#3a9bcc";
          c.fillRect(wx, sy, W - wx + 4, STEP);
        } else if (th === THEMES[3]) {
          c.fillStyle = band ? "#4a4e69" : "#444862";
          c.fillRect(fl - 30, sy, 22, STEP);
          c.fillRect(fr + 8, sy, 22, STEP);
        }
        var hz = Math.floor(wy / 18) & 1 ? "#ff8c1a" : "#fafafa";
        if (NL > 0) {
          c.fillStyle = hz;
          c.fillRect(fl, sy, le - fl, STEP);
        }
        if (NR > 0) {
          c.fillStyle = hz;
          c.fillRect(re, sy, fr - re, STEP);
        }
        c.fillStyle = Math.floor(wy / 24) & 1 ? th.rum1 : th.rum2;
        c.fillRect(le - 8, sy, 8, STEP);
        c.fillRect(re, sy, 8, STEP);
        c.fillStyle = th.road;
        c.fillRect(le, sy, re - le, STEP);
        c.fillStyle = th.line;
        c.fillRect(le + 3, sy, 3, STEP);
        c.fillRect(re - 6, sy, 3, STEP);
        if ((wy % 64 + 64) % 64 < 32) {
          if (NL < 0.5) c.fillRect(cx - LW - 2, sy, 4, STEP);
          c.fillRect(cx - 2, sy, 4, STEP);
          if (NR < 0.5) c.fillRect(cx + LW - 2, sy, 4, STEP);
        }
      }
      var CH = 86,
        k0 = Math.floor((s.py + PY - H - 40) / CH),
        k1 = Math.floor((s.py + PY + 40) / CH);
      for (var k = k0; k <= k1; k++) {
        var _wy = k * CH + 30 * hh(k * 13 + 1),
          _sy = PY - (_wy - s.py),
          _th = THEMES[zoneOf(_wy)];
        var _cx = cxAt(G, _wy),
          _fl2 = _cx - 2 * LW,
          _fr = _cx + 2 * LW;
        if (_th === THEMES[3]) {
          for (var side = 0; side < 2; side++) {
            var x0 = side ? _fr + 30 : 0,
              x1 = side ? W : _fl2 - 30;
            if (x1 - x0 < 10) continue;
            c.fillStyle = ["#1e1b4b", "#312e81", "#1f2937", "#3b0764"][hh(k * 29 + side) * 4 | 0];
            c.fillRect(x0, _sy - 40, x1 - x0, 76);
            c.fillStyle = "#fde68a";
            for (var ci = 0, _wx = x0 + 5; _wx < x1 - 6; ci++, _wx += 11) for (var ri = 0; ri < 5; ri++) if (hh(k * 131 + ci * 17 + ri * 5 + side * 997) < 0.45) c.fillRect(_wx, _sy - 34 + ri * 13, 6, 7);
          }
        } else {
          var lspace = _fl2 - 12;
          if (lspace > 26 && hh(k * 3 + 7) < 0.85) E(c, _th.deco[hh(k * 5 + 2) * _th.deco.length | 0], 13 + hh(k * 3 + 1) * (lspace - 26), _sy, 26);
          if (_th === THEMES[1]) {
            var _wx2 = _fr + 44;
            if (W - _wx2 > 30 && hh(k * 11 + 5) < 0.3) E(c, _th.decoR[hh(k * 17) * 3 | 0], _wx2 + 14 + hh(k * 19) * (W - _wx2 - 28), _sy, 22);
          } else {
            var r0 = _fr + 12,
              rspace = W - r0;
            if (rspace > 26 && hh(k * 9 + 4) < 0.85) E(c, _th.deco[hh(k * 23 + 8) * _th.deco.length | 0], r0 + 13 + hh(k * 7 + 3) * (rspace - 26), _sy, 26);
          }
        }
        nar(_wy);
        if (NL > 0.05 && NL < 0.95) E(c, "🚧", _fl2 + NL * LW * 0.5, _sy, 20);
        if (NR > 0.05 && NR < 0.95) E(c, "🚧", _fr - NR * LW * 0.5, _sy, 20);
        if (_th === THEMES[3] && k & 1) {
          c.fillStyle = "rgba(255,210,90,0.13)";
          c.beginPath();
          c.arc(_fl2 + 10, _sy, 34, 0, 7);
          c.arc(_fr - 10, _sy + 40, 34, 0, 7);
          c.fill();
          c.fillStyle = "#fde68a";
          c.fillRect(_fl2 - 14, _sy - 2, 10, 4);
          c.fillRect(_fr + 4, _sy + 38, 10, 4);
        }
      }
      if (dark) {
        c.fillStyle = "rgba(5,8,30,0.28)";
        c.fillRect(-4, 0, W + 8, H);
      }
      var _iterator7 = _createForOfIteratorHelper(s.things),
        _step7;
      try {
        for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
          var t = _step7.value;
          if (t.got && t.type !== "oil") continue;
          var tx = laneX(G, t.lane, t.wy),
            ty = PY - (t.wy - s.py);
          if (ty < -40 || ty > H + 40) continue;
          if (t.type === "oil") {
            c.fillStyle = "#0b0b12";
            c.beginPath();
            c.ellipse(tx, ty, 24, 14, 0.3, 0, 7);
            c.fill();
            c.beginPath();
            c.ellipse(tx + 12, ty + 8, 10, 7, 0, 0, 7);
            c.fill();
            c.fillStyle = "rgba(160,120,255,0.45)";
            c.beginPath();
            c.ellipse(tx - 6, ty - 4, 9, 4, 0.3, 0, 7);
            c.fill();
            c.fillStyle = "rgba(80,220,255,0.35)";
            c.beginPath();
            c.ellipse(tx + 5, ty + 2, 6, 3, 0.3, 0, 7);
            c.fill();
          } else {
            var bob = Math.sin(G.t * 6 + t.wy) * 3;
            c.fillStyle = "rgba(255,255,255,0.35)";
            c.beginPath();
            c.arc(tx, ty + bob, 17, 0, 7);
            c.fill();
            E(c, t.type === "bone" ? "🦴" : "⛽", tx, ty + bob, t.type === "bone" ? 24 : 26);
          }
        }
      } catch (err) {
        _iterator7.e(err);
      } finally {
        _iterator7.f();
      }
      var night = zoneOf(s.py) === 3;
      var _iterator8 = _createForOfIteratorHelper(s.cars),
        _step8;
      try {
        for (_iterator8.s(); !(_step8 = _iterator8.n()).done;) {
          var o = _step8.value;
          var ox = laneX(G, o.lp, o.wy),
            oy = PY - (o.wy - s.py);
          if (oy < -100 || oy > H + 100) continue;
          if (night) {
            c.fillStyle = "rgba(255,240,170,0.1)";
            c.beginPath();
            c.moveTo(ox - o.w / 2 + 3, oy - o.h / 2);
            c.lineTo(ox + o.w / 2 - 3, oy - o.h / 2);
            c.lineTo(ox + o.w, oy - o.h / 2 - 90);
            c.lineTo(ox - o.w, oy - o.h / 2 - 90);
            c.fill();
          }
          drawVehicle(G, c, o, ox, oy);
        }
      } catch (err) {
        _iterator8.e(err);
      } finally {
        _iterator8.f();
      }
      if (night) {
        c.fillStyle = "rgba(255,245,190,0.22)";
        c.beginPath();
        c.moveTo(s.px - 14, PY - 29);
        c.lineTo(s.px + 14, PY - 29);
        c.lineTo(s.px + 40, PY - 150);
        c.lineTo(s.px - 40, PY - 150);
        c.fill();
      }
      drawPlayer(G, c, s, s.px, PY);
      c.restore();
      var _iterator9 = _createForOfIteratorHelper(s.pops),
        _step9;
      try {
        for (_iterator9.s(); !(_step9 = _iterator9.n()).done;) {
          var p = _step9.value;
          G.text(c, p.txt, p.x, p.y - (1 - p.t) * 30, 11, p.c);
        }
      } catch (err) {
        _iterator9.e(err);
      } finally {
        _iterator9.f();
      }
      c.fillStyle = "rgba(0,0,0,0.5)";
      c.fillRect(0, 0, W, 52);
      G.text(c, "SCORE ".concat(score(s)), 10, 15, 11, "#fff", "left");
      for (var i = 0; i < 3; i++) {
        c.globalAlpha = i < s.lives ? 1 : 0.25;
        G.img(c, ":dawgW:", W - 16 - i * 22, 15, 20);
        c.globalAlpha = 1;
      }
      E(c, "⛽", 14, 37, 15);
      var fw = W / 2 - 40,
        fx = 26;
      c.fillStyle = "#222";
      c.fillRect(fx, 31, fw, 12);
      var fc = s.fuel > 50 ? "#4ade80" : s.fuel > 22 ? "#facc15" : "#ef4444";
      if (!(s.fuel <= 22 && (G.t * 4 | 0) % 2)) {
        c.fillStyle = fc;
        c.fillRect(fx + 2, 33, (fw - 4) * clamp(s.fuel / 100, 0, 1), 8);
      }
      c.strokeStyle = "#fff";
      c.lineWidth = 1;
      c.strokeRect(fx + 0.5, 31.5, fw - 1, 11);
      var tx0 = W / 2 + 8,
        tw = W / 2 - 18,
        ready = s.tcd <= 0;
      G.text(c, "TURBO", tx0, 38, 8, ready ? "#7df9ff" : "#9ca3af", "left");
      var bx = tx0 + 46,
        bw = tw - 46;
      c.fillStyle = "#222";
      c.fillRect(bx, 31, bw, 12);
      c.fillStyle = s.turbo > 0 ? "#ff8c00" : ready ? (G.t * 3 | 0) % 2 ? "#7df9ff" : "#38bdf8" : "#0ea5e9";
      c.fillRect(bx + 2, 33, (bw - 4) * (s.turbo > 0 ? clamp(s.turbo / 1.3, 0, 1) : clamp(1 - s.tcd / 3, 0, 1)), 8);
      c.strokeStyle = "#fff";
      c.strokeRect(bx + 0.5, 31.5, bw - 1, 11);
      c.fillStyle = "rgba(0,0,0,0.45)";
      c.fillRect(0, H - 24, W, 24);
      G.text(c, "".concat(Math.max(0, Math.floor((s.py - START) / PXM)), " M"), 10, H - 12, 9, "#fff", "left");
      G.text(c, "".concat(Math.round(s.v / PXM * 3.6), " KM/H"), W - 10, H - 12, 9, s.turbo > 0 ? "#ff8c00" : s.off ? "#facc15" : "#fff", "right");
      if (s.off && !s.dead) G.text(c, "OFF ROAD!", W / 2, H - 12, 9, "#facc15");
      if (s.bt > 0) {
        c.fillStyle = "rgba(0,0,0,0.55)";
        c.fillRect(0, H * 0.3 - 20, W, 40);
        G.text(c, s.banner, W / 2, H * 0.3, 16, "#ffd23f");
      }
      if (s.time < 5 && G.state === "play") {
        c.fillStyle = "rgba(0,0,0,0.55)";
        c.fillRect(W / 2 - 130, H * 0.42 - 26, 260, 52);
        G.text(c, "DRAG TO STEER", W / 2, H * 0.42 - 9, 11, "#fff");
        G.text(c, "TAP = TURBO", W / 2, H * 0.42 + 11, 11, "#7df9ff");
      }
      if (s.fuel > 0 && s.fuel < 22 && !s.dead && (G.t * 2 | 0) % 2) G.text(c, "LOW FUEL!", W / 2, 66, 10, "#ef4444");
      if (s.dead && s.why === "gas") G.text(c, "OUT OF GAS!", W / 2, H * 0.45, 14, "#ef4444");
    }
  });
})();