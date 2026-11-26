function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
(function () {
  var N = 8,
    B = 150,
    R = 64,
    P = B + R,
    WORLD = N * P + R,
    SW = 12,
    DAYS = 5,
    ZR = 38;
  var TOUCH = typeof window !== "undefined" && "ontouchstart" in window;
  var clamp = function clamp(v, a, b) {
      return v < a ? a : v > b ? b : v;
    },
    hyp = Math.hypot;
  var hh = function hh(a, b) {
    var x = Math.imul(a * 374761 + b * 668265 ^ 0x9e3779b9, 2654435761);
    x ^= x >>> 15;
    x = Math.imul(x, 2246822519);
    x ^= x >>> 13;
    return (x >>> 0) / 4294967296;
  };
  var DAYN = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"];
  var PAL = ["#f4a261", "#e76f51", "#2a9d8f", "#e9c46a", "#8ecae6", "#b5838d", "#a8dadc", "#f6bd60", "#84a59d", "#cdb4db"];
  var SEAT = ["#22c55e", "#3b82f6", "#ec4899", "#f97316"];
  var FOLK = ["🙋", "🙋‍♀️", "🙋‍♂️", "💁", "🧑‍💼", "👵", "🧑‍🎤", "👷"];
  var CARC = ["#3b82f6", "#ef4444", "#a855f7", "#14b8a6", "#e5e7eb", "#f97316", "#64748b", "#ec4899"];
  var DIR = [[1, 0], [0, 1], [-1, 0], [0, -1]];
  var UPS = [{
    k: "seats",
    name: "SEATS",
    sub: "carry more riders at once",
    cost: [60, 150, 280]
  }, {
    k: "engine",
    name: "ENGINE",
    sub: "higher top speed",
    cost: [40, 90, 150, 220]
  }, {
    k: "tires",
    name: "TIRES",
    sub: "tighter turns, less sliding",
    cost: [40, 90, 150]
  }, {
    k: "shift",
    name: "LONGER SHIFT",
    sub: "+8 seconds every day",
    cost: [50, 110, 180]
  }, {
    k: "meter",
    name: "METER",
    sub: "+15% on every fare",
    cost: [60, 130, 210]
  }];
  var shade = function shade(hex, k) {
    var n = parseInt(hex.slice(1), 16),
      f = function f(v) {
        return clamp(Math.round(v * k), 0, 255);
      };
    return "rgb(" + f(n >> 16) + "," + f(n >> 8 & 255) + "," + f(n & 255) + ")";
  };
  var CITY = [];
  var _loop = function _loop(k) {
    var _loop3 = function _loop3(l) {
      var x = R + k * P,
        y = R + l * P,
        h = hh(k, l),
        b = {
          x: x,
          y: y,
          park: h < 0.14,
          bl: []
        },
        I = SW + 3,
        S = B - 2 * I;
      var add = function add(bx, by, bw, bh, i) {
        return b.bl.push({
          x: bx,
          y: by,
          w: bw,
          h: bh,
          ht: 16 + hh(k * 7 + i, l * 13 + i) * 54,
          col: PAL[Math.floor(hh(k + i * 3, l * 5 + i) * PAL.length)]
        });
      };
      if (b.park) for (var i = 0; i < 5; i++) b.bl.push({
        tree: 1,
        x: x + 30 + hh(k + i, l * 3) * (B - 60),
        y: y + 30 + hh(k * 3, l + i) * (B - 60)
      });else if (h < 0.4) add(x + I, y + I, S, S, 0);else if (h < 0.58) {
        add(x + I, y + I, S / 2 - 3, S, 0);
        add(x + I + S / 2 + 3, y + I, S / 2 - 3, S, 1);
      } else if (h < 0.76) {
        add(x + I, y + I, S, S / 2 - 3, 0);
        add(x + I, y + I + S / 2 + 3, S, S / 2 - 3, 1);
      } else for (var _i = 0; _i < 4; _i++) add(x + I + _i % 2 * (S / 2 + 3), y + I + (_i >> 1) * (S / 2 + 3), S / 2 - 3, S / 2 - 3, _i);
      CITY.push(b);
    };
    for (var l = 0; l < N; l++) {
      _loop3(l);
    }
  };
  for (var k = 0; k < N; k++) {
    _loop(k);
  }
  function spot(k, l, side, t) {
    var x = R + k * P,
      y = R + l * P,
      a = t * B;
    return side === 0 ? {
      x: x + a,
      y: y + 5,
      zx: x + a,
      zy: y - 20,
      k: k,
      l: l
    } : side === 1 ? {
      x: x + B - 5,
      y: y + a,
      zx: x + B + 20,
      zy: y + a,
      k: k,
      l: l
    } : side === 2 ? {
      x: x + a,
      y: y + B - 5,
      zx: x + a,
      zy: y + B + 20,
      k: k,
      l: l
    } : {
      x: x + 5,
      y: y + a,
      zx: x - 20,
      zy: y + a,
      k: k,
      l: l
    };
  }
  var rspot = function rspot() {
    return spot(Math.floor(Math.random() * N), Math.floor(Math.random() * N), Math.floor(Math.random() * 4), 0.2 + Math.random() * 0.6);
  };
  var lv = function lv(s, k) {
    return s.up[k] || 0;
  };
  var pop = function pop(s, txt, col) {
    return s.pops.push({
      txt: txt,
      col: col || "#fff",
      t: 1.6
    });
  };
  function addRider(s) {
    var _loop2 = function _loop2() {
        var a = rspot();
        if (hyp(a.x - s.car.x, a.y - s.car.y) < 200 || s.wait.some(function (w) {
          return hyp(w.x - a.x, w.y - a.y) < 120;
        })) return 0;
        var d = rspot(),
          blocks = Math.abs(d.k - a.k) + Math.abs(d.l - a.l);
        if (blocks < 2 || blocks > 2 + s.day) return 0;
        var dist = Math.abs(d.zx - a.zx) + Math.abs(d.zy - a.zy),
          vip = Math.random() < 0.12;
        s.wait.push({
          x: a.x,
          y: a.y,
          zx: a.zx,
          zy: a.zy,
          dest: d,
          vip: vip,
          fare: Math.round((6 + dist / 45) * (vip ? 2 : 1)),
          limit: dist / (vip ? 135 : 110) + 7,
          em: FOLK[Math.floor(Math.random() * FOLK.length)]
        });
        return {
          v: void 0
        };
      },
      _ret;
    for (var n = 0; n < 40; n++) {
      _ret = _loop2();
      if (_ret === 0) continue;
      if (_ret) return _ret.v;
    }
  }
  function addTraffic(s) {
    var i = Math.floor(Math.random() * (N + 1)),
      j = Math.floor(Math.random() * (N + 1)),
      t = {
        i: i,
        j: j,
        d: 0,
        p: Math.random(),
        v: 0,
        top: 70 + Math.random() * 40,
        col: CARC[Math.floor(Math.random() * CARC.length)],
        x: 0,
        y: 0,
        a: 0
      };
    turn(t, true);
    place(t, 1);
    if (hyp(t.x - s.car.x, t.y - s.car.y) > 160) s.cars.push(t);
  }
  function turn(t, any) {
    var ok = [];
    for (var d = 0; d < 4; d++) {
      var ni = t.i + DIR[d][0],
        nj = t.j + DIR[d][1];
      if (ni < 0 || nj < 0 || ni > N || nj > N || !any && d === (t.d + 2) % 4) continue;
      ok.push(d);
      if (d === t.d) ok.push(d, d);
    }
    t.d = ok.length ? ok[Math.floor(Math.random() * ok.length)] : (t.d + 2) % 4;
  }
  function place(t, k) {
    var dx = DIR[t.d][0],
      dy = DIR[t.d][1],
      x = (t.i + dx * t.p) * P + R / 2 - dy * R / 4,
      y = (t.j + dy * t.p) * P + R / 2 + dx * R / 4;
    t.x += (x - t.x) * k;
    t.y += (y - t.y) * k;
    var da = Math.atan2(dy, dx) - t.a;
    da = Math.atan2(Math.sin(da), Math.cos(da));
    t.a += da * k;
  }
  function crash(G, s, big) {
    if (s.hitT > 0) return;
    s.hitT = 0.8;
    s.shake = 0.3;
    G.buzz();
    G.sfx("lose");
    s.riders.forEach(function (r) {
      return r.bumps++;
    });
    if (big) {
      s.clock = Math.max(0, s.clock - 2);
      pop(s, "CRASH! -2s", "#f87171");
    }
  }
  function startDay(G) {
    var s = G.s;
    s.day++;
    s.mode = "ready";
    s.mt = 1.6;
    s.clock = s.len = 75 + 8 * lv(s, "shift");
    s.dayCash = 0;
    s.dayFares = 0;
    s.riders = [];
    s.wait = [];
    s.cars = [];
    s.zt = 0;
    s.zone = null;
    while (s.wait.length < 4 + s.day) addRider(s);
    for (var n = 0; n < 200 && s.cars.length < 7 + 2 * s.day; n++) addTraffic(s);
  }
  function drive(G, dt) {
    var s = G.s,
      car = s.car,
      k = s.keys;
    s.clock -= dt;
    s.hitT -= dt;
    if (s.clock <= 0) {
      s.clock = 0;
      G.sfx("pass");
      if (s.day >= DAYS) return G.over(s.total, s.total >= 1500 ? "Cab legend!" : s.total >= 800 ? "Big tipper week!" : "Meter's off. Go again!");
      s.mode = "shop";
      return;
    }
    var auto = !s.kb && (TOUCH || s.ptr);
    var L = k.l || s.tL || s.ptr < 0,
      Rt = k.r || s.tR || s.ptr > 0;
    var gas = auto ? s.tL && s.tR ? -1 : 1 : k.u ? 1 : k.d ? -1 : 0,
      steer = (Rt ? 1 : 0) - (L ? 1 : 0);
    if (auto && s.tL && s.tR) steer = 0;
    var zone = null;
    if (s.riders.length < 1 + lv(s, "seats")) s.wait.forEach(function (w) {
      if (!zone && hyp(w.zx - car.x, w.zy - car.y) < ZR) zone = w;
    });
    s.riders.forEach(function (r) {
      if (hyp(r.dest.zx - car.x, r.dest.zy - car.y) < ZR) zone = r;
    });
    var hx = Math.cos(car.a),
      hy = Math.sin(car.a);
    var f = car.vx * hx + car.vy * hy,
      l = -car.vx * hy + car.vy * hx;
    if (zone) {
      gas = 0;
      f -= f * Math.min(1, dt * 7);
      if (Math.abs(f) < 30) {
        s.zt += dt;
        if (s.zt > 0.4) {
          s.zt = 0;
          stop(G, s, zone);
        }
      }
    } else s.zt = 0;
    var grass = onGrass(car.x, car.y),
      top = (215 + 28 * lv(s, "engine")) * (grass ? 0.55 : 1) * (steer ? 0.62 : 1);
    if (gas > 0) f += (210 + 25 * lv(s, "engine")) * dt;else if (gas < 0) f -= (f > 0 ? 430 : 170) * dt;else f -= f * Math.min(1, dt * 0.8);
    f = clamp(f, -90, Math.max(top, f - 420 * dt));
    l -= l * Math.min(1, (4.5 + 1.6 * lv(s, "tires")) * dt);
    car.vx = hx * f - hy * l;
    car.vy = hy * f + hx * l;
    car.a += steer * (3 + 0.25 * lv(s, "tires")) * dt * (gas > 0 && f >= 0 ? Math.max(0.35, Math.min(1, f / 90)) : clamp(f / 90, -1, 1));
    car.x += car.vx * dt;
    car.y += car.vy * dt;
    var bk = Math.floor((car.x - R) / P),
      bl = Math.floor((car.y - R) / P),
      rad = 10;
    for (var a = bk - 1; a <= bk + 1; a++) for (var b = bl - 1; b <= bl + 1; b++) {
      if (a < 0 || b < 0 || a >= N || b >= N || CITY[a * N + b].park) continue;
      var rx = R + a * P + SW,
        ry = R + b * P + SW,
        rw = B - 2 * SW,
        cx = clamp(car.x, rx, rx + rw),
        cy = clamp(car.y, ry, ry + rw);
      var dx = car.x - cx,
        dy = car.y - cy;
      var d = hyp(dx, dy);
      if (d >= rad) continue;
      if (d === 0) {
        dx = car.x - (rx + rw / 2);
        dy = car.y - (ry + rw / 2);
        if (Math.abs(dx) > Math.abs(dy)) {
          car.x = dx > 0 ? rx + rw + rad : rx - rad;
        } else car.y = dy > 0 ? ry + rw + rad : ry - rad;
        car.vx *= -0.3;
        car.vy *= -0.3;
        continue;
      }
      var nx = dx / d,
        ny = dy / d,
        vn = car.vx * nx + car.vy * ny;
      car.x = cx + nx * rad;
      car.y = cy + ny * rad;
      if (vn < 0) {
        car.vx -= 1.4 * vn * nx;
        car.vy -= 1.4 * vn * ny;
        if (vn < -140) crash(G, s, false);
      }
    }
    if (car.x < rad || car.x > WORLD - rad) {
      car.x = clamp(car.x, rad, WORLD - rad);
      car.vx *= -0.4;
    }
    if (car.y < rad || car.y > WORLD - rad) {
      car.y = clamp(car.y, rad, WORLD - rad);
      car.vy *= -0.4;
    }
    s.cars.forEach(function (t) {
      var dx = DIR[t.d][0],
        dy = DIR[t.d][1];
      var blocked = false;
      var ahead = function ahead(ox, oy) {
        var ax = ox - t.x,
          ay = oy - t.y,
          fw = ax * dx + ay * dy;
        return fw > 4 && fw < 46 && Math.abs(-ax * dy + ay * dx) < 14;
      };
      if (ahead(car.x, car.y)) blocked = true;else {
        var _iterator = _createForOfIteratorHelper(s.cars),
          _step;
        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var o = _step.value;
            if (o !== t && ahead(o.x, o.y)) {
              blocked = true;
              break;
            }
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      }
      t.v += ((blocked ? 0 : t.top) - t.v) * Math.min(1, dt * 4);
      t.p += t.v * dt / P;
      if (t.p >= 1) {
        t.p -= 1;
        t.i += dx;
        t.j += dy;
        turn(t);
      }
      place(t, Math.min(1, dt * 7));
      var cx = car.x - t.x,
        cy = car.y - t.y,
        d = hyp(cx, cy) || 1;
      if (d < 20) {
        car.x = t.x + cx / d * 20;
        car.y = t.y + cy / d * 20;
        var sp = hyp(car.vx, car.vy);
        car.vx = cx / d * Math.max(60, sp * 0.4);
        car.vy = cy / d * Math.max(60, sp * 0.4);
        t.v = 0;
        crash(G, s, true);
      }
    });
    for (var i = s.riders.length - 1; i >= 0; i--) {
      var r = s.riders[i];
      r.t -= dt;
      if (r.t <= 0) {
        s.riders.splice(i, 1);
        pop(s, "TOO SLOW! " + r.em + " WALKED", "#f87171");
        G.buzz();
      }
    }
    while (s.wait.length < 4 + s.day) addRider(s);
  }
  function onGrass(x, y) {
    var k = Math.floor((x - R) / P),
      l = Math.floor((y - R) / P);
    if (k < 0 || l < 0 || k >= N || l >= N || !CITY[k * N + l].park) return false;
    var lx = x - R - k * P,
      ly = y - R - l * P;
    return lx > SW && ly > SW && lx < B - SW && ly < B - SW;
  }
  function stop(G, s, z) {
    var wi = s.wait.indexOf(z);
    if (wi >= 0) {
      s.wait.splice(wi, 1);
      var col = SEAT.find(function (c) {
        return !s.riders.some(function (r) {
          return r.col === c;
        });
      });
      s.riders.push({
        dest: z.dest,
        fare: z.fare,
        limit: z.limit,
        t: z.limit,
        em: z.em,
        vip: z.vip,
        bumps: 0,
        col: col
      });
      pop(s, (z.vip ? "VIP! " : "") + "FARE $" + z.fare, z.vip ? "#fde047" : "#fff");
      G.sfx("pop");
    } else {
      s.riders.splice(s.riders.indexOf(z), 1);
      var tip = Math.round(z.fare * 0.6 * Math.max(0, z.t / z.limit) * Math.max(0, 1 - 0.25 * z.bumps)),
        pay = Math.round((z.fare + tip) * (1 + 0.15 * lv(s, "meter")));
      s.cash += pay;
      s.total += pay;
      s.dayCash += pay;
      s.dayFares++;
      pop(s, "+$" + pay + (tip > z.fare * 0.35 ? " GREAT TIP!" : ""), "#4ade80");
      G.sfx("win");
    }
  }
  function buy(G, s, i) {
    var u = UPS[i],
      n = lv(s, u.k),
      cost = u.cost[n];
    if (cost === undefined || s.cash < cost) {
      G.buzz();
      return;
    }
    s.cash -= cost;
    s.up[u.k] = n + 1;
    G.sfx("pop");
  }
  var pt = function pt(s, x, y, h) {
    var dx = x - s.car.x,
      dy = y - s.car.y,
      k = s.z * (1 + (h || 0) * 0.0045);
    return [s.ax + (dx * s.cs - dy * s.sn) * k, s.ay + (dx * s.sn + dy * s.cs) * k];
  };
  function poly(c, pts, col) {
    c.fillStyle = col;
    c.beginPath();
    c.moveTo(pts[0][0], pts[0][1]);
    for (var i = 1; i < pts.length; i++) c.lineTo(pts[i][0], pts[i][1]);
    c.closePath();
    c.fill();
  }
  var rect = function rect(c, s, x, y, w, h, ht, col) {
    return poly(c, [pt(s, x, y, ht), pt(s, x + w, y, ht), pt(s, x + w, y + h, ht), pt(s, x, y + h, ht)], col);
  };
  function carShape(c, s, x, y, a, col, taxi) {
    var hx = Math.cos(a),
      hy = Math.sin(a),
      box = function box(x0, x1, w, h, cl) {
        return poly(c, [[x0, -w], [x1, -w], [x1, w], [x0, w]].map(function (p) {
          return pt(s, x + hx * p[0] - hy * p[1], y + hy * p[0] + hx * p[1], h);
        }), cl);
      };
    box(-15, 15, 9, 0, "rgba(0,0,0,0.3)");
    box(-14, 14, 7.5, 3, col);
    box(-8, 6, 6.5, 8, "#1f2937");
    box(-6, 3, 5.5, 10, shade(col, 1.12));
    box(13, 14.5, 6, 3, "#fef9c3");
    box(-14.5, -13, 6, 3, "#dc2626");
    if (taxi) {
      box(-3, 0, 3, 13, "#fff");
      box(-14, 14, 1.2, 3.4, "#111");
    }
  }
  function arrow(c, s, tx, ty, col, big) {
    var p = pt(s, tx, ty),
      dx = p[0] - s.ax,
      dy = p[1] - s.ay,
      d = hyp(dx, dy);
    if (d < 70) return;
    var a = Math.atan2(dy, dx),
      r = Math.min(d - 20, big ? 64 : 52),
      x = s.ax + Math.cos(a) * r,
      y = s.ay + Math.sin(a) * r,
      z = big ? 13 : 9;
    c.save();
    c.translate(x, y);
    c.rotate(a);
    c.fillStyle = "rgba(0,0,0,0.5)";
    c.beginPath();
    c.moveTo(z + 3, 0);
    c.lineTo(-z, -z - 2);
    c.lineTo(-z + 4, 0);
    c.lineTo(-z, z + 2);
    c.fill();
    c.fillStyle = col;
    c.beginPath();
    c.moveTo(z, 0);
    c.lineTo(-z + 2, -z + 1);
    c.lineTo(-z + 5, 0);
    c.lineTo(-z + 2, z - 1);
    c.fill();
    c.restore();
  }
  defGame({
    key: "cab",
    name: "Cab Dawg",
    icon: "🚕",
    max: 99999,
    blurb: "Pick up riders, beat their clock, upgrade the cab.",
    how: "You drive a cab around the city for 5 days. Hold the left or right side of the screen to steer. The gas is automatic, and holding both sides brakes and backs up (on a keyboard: up arrow or W for gas, left and right to steer, down to brake). Pull up next to a waving rider and the cab stops to let them in. The matching arrow points to their pin: get there before their timer runs out or they walk. Faster rides tip better, and bumps cost you the tip. Hitting traffic costs 2 seconds. Gold riders are VIPs: double fare, tighter clock. Parks are a slow shortcut. When the day's clock runs out, spend what you made on more seats, a faster engine, grippier tires, a longer shift or a better meter. Your score is every dollar you earn Monday to Friday.",
    reset: function reset(G) {
      var s = G.s = {
        day: 0,
        cash: 0,
        total: 0,
        up: {},
        keys: {},
        tL: 0,
        tR: 0,
        ptr: 0,
        kb: false,
        pops: [],
        shake: 0,
        hitT: 0,
        btns: [],
        car: {
          x: R / 2 + R / 4,
          y: 3 * P + R / 2,
          a: Math.PI / 2,
          vx: 0,
          vy: 0
        },
        ca: Math.PI / 2
      };
      startDay(G);
      this.hook();
    },
    hook: function hook() {
      if (window._cabT) return;
      window._cabT = 1;
      var w = $("gwrap");
      if (!w) return;
      var f = function f(e) {
        if (G.key !== "cab" || G.state !== "play" || !G.s || !G.s.car) return;
        var r = w.getBoundingClientRect(),
          s = G.s;
        s.tL = s.tR = 0;
        for (var i = 0; i < e.touches.length; i++) {
          if (e.touches[i].clientX - r.left < G.W / 2) s.tL = 1;else s.tR = 1;
        }
      };
      ["touchstart", "touchmove", "touchend", "touchcancel"].forEach(function (n) {
        return w.addEventListener(n, f, {
          passive: true
        });
      });
    },
    down: function down(G, x) {
      if (!TOUCH) G.s.ptr = x < G.W / 2 ? -1 : 1;
    },
    move: function move(G, x) {
      if (!TOUCH && G.s.ptr) G.s.ptr = x < G.W / 2 ? -1 : 1;
    },
    up: function up(G) {
      G.s.ptr = 0;
    },
    tap: function tap(G, x, y) {
      var s = G.s;
      if (s.mode !== "shop") return;
      var b = s.btns.find(function (b) {
        return x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h;
      });
      if (!b) return;
      if (b.i < 0) startDay(G);else buy(G, s, b.i);
    },
    onKey: function onKey(G, k, isDown) {
      var s = G.s,
        m = {
          ArrowLeft: "l",
          a: "l",
          ArrowRight: "r",
          d: "r",
          ArrowUp: "u",
          w: "u",
          ArrowDown: "d",
          s: "d"
        }[k];
      if (m) {
        s.keys[m] = isDown;
        s.kb = true;
        return;
      }
      if (!isDown || s.mode !== "shop") return;
      if (k === " " || k === "Enter") startDay(G);else if (k >= "1" && k <= "5") buy(G, s, +k - 1);
    },
    update: function update(G, dt) {
      var s = G.s;
      s.shake = Math.max(0, s.shake - dt);
      s.pops.forEach(function (o) {
        return o.t -= dt;
      });
      s.pops = s.pops.filter(function (o) {
        return o.t > 0;
      });
      var da = s.car.a - s.ca;
      da = Math.atan2(Math.sin(da), Math.cos(da));
      s.ca += da * Math.min(1, dt * 5);
      if (s.mode === "ready") {
        s.mt -= dt;
        if (s.mt <= 0) s.mode = "drive";
      } else if (s.mode === "drive") drive(G, dt);
    },
    draw: function draw(G, c) {
      var s = G.s,
        W = G.W,
        H = G.H,
        car = s.car,
        th = -Math.PI / 2 - s.ca;
      s.cs = Math.cos(th);
      s.sn = Math.sin(th);
      s.z = clamp(W / 340, 0.9, 1.4);
      s.ax = W / 2 + (s.shake > 0 ? (Math.random() - 0.5) * 30 * s.shake : 0);
      s.ay = H * 0.64 + (s.shake > 0 ? (Math.random() - 0.5) * 30 * s.shake : 0);
      c.fillStyle = "#38a3d1";
      c.fillRect(0, 0, W, H);
      rect(c, s, -14, -14, WORLD + 28, WORLD + 28, 0, "#d6c9a8");
      rect(c, s, 0, 0, WORLD, WORLD, 0, "#4b5563");
      c.strokeStyle = "rgba(255,255,255,0.45)";
      c.lineWidth = 2 * s.z;
      c.setLineDash([10 * s.z, 12 * s.z]);
      c.beginPath();
      for (var _k = 0; _k <= N; _k++) {
        var m = _k * P + R / 2;
        var a = pt(s, m, 0),
          b = pt(s, m, WORLD);
        c.moveTo(a[0], a[1]);
        c.lineTo(b[0], b[1]);
        a = pt(s, 0, m);
        b = pt(s, WORLD, m);
        c.moveTo(a[0], a[1]);
        c.lineTo(b[0], b[1]);
      }
      c.stroke();
      c.setLineDash([]);
      var far = Math.max(W, H) * 0.8 / s.z + B,
        near = CITY.filter(function (b) {
          return hyp(b.x + B / 2 - car.x, b.y + B / 2 - car.y) < far;
        });
      near.forEach(function (b) {
        rect(c, s, b.x, b.y, B, B, 0, "#cbd5e1");
        rect(c, s, b.x + SW, b.y + SW, B - 2 * SW, B - 2 * SW, 0, b.park ? "#6cc04a" : "#9ca3af");
      });
      var ring = function ring(x, y, col) {
        var p = pt(s, x, y),
          r = (ZR - 12 + Math.sin(G.t * 5) * 3) * s.z;
        c.strokeStyle = col;
        c.lineWidth = 4;
        c.globalAlpha = 0.85;
        c.beginPath();
        c.arc(p[0], p[1], r, 0, 7);
        c.stroke();
        c.globalAlpha = 0.2;
        c.fillStyle = col;
        c.fill();
        c.globalAlpha = 1;
      };
      var room = s.riders.length < 1 + lv(s, "seats");
      if (room) s.wait.forEach(function (w) {
        return ring(w.zx, w.zy, w.vip ? "#fde047" : "#ffffff");
      });
      s.riders.forEach(function (r) {
        return ring(r.dest.zx, r.dest.zy, r.col);
      });
      s.cars.forEach(function (t) {
        if (hyp(t.x - car.x, t.y - car.y) < far) carShape(c, s, t.x, t.y, t.a, t.col);
      });
      carShape(c, s, car.x, car.y, car.a, "#facc15", true);
      var bs = [];
      near.forEach(function (b) {
        return b.bl.forEach(function (o) {
          return bs.push(o);
        });
      });
      bs.sort(function (a, b) {
        return hyp(b.x + (b.w || 0) / 2 - car.x, b.y + (b.h || 0) / 2 - car.y) - hyp(a.x + (a.w || 0) / 2 - car.x, a.y + (a.h || 0) / 2 - car.y);
      });
      bs.forEach(function (o) {
        if (o.tree) {
          var _a = pt(s, o.x, o.y, 0),
            _b = pt(s, o.x, o.y, 22);
          c.strokeStyle = "#7c5a3a";
          c.lineWidth = 4 * s.z;
          c.beginPath();
          c.moveTo(_a[0], _a[1]);
          c.lineTo(_b[0], _b[1]);
          c.stroke();
          c.fillStyle = "#2f8f46";
          c.beginPath();
          c.arc(_b[0], _b[1], 13 * s.z, 0, 7);
          c.fill();
          c.fillStyle = "#46b05f";
          c.beginPath();
          c.arc(_b[0] - 3, _b[1] - 3, 7 * s.z, 0, 7);
          c.fill();
          return;
        }
        var g = [[o.x, o.y], [o.x + o.w, o.y], [o.x + o.w, o.y + o.h], [o.x, o.y + o.h]],
          lo = g.map(function (p) {
            return pt(s, p[0], p[1], 0);
          }),
          hi = g.map(function (p) {
            return pt(s, p[0], p[1], o.ht);
          });
        for (var i = 0; i < 4; i++) {
          var j = (i + 1) % 4;
          poly(c, [lo[i], lo[j], hi[j], hi[i]], shade(o.col, i % 2 ? 0.62 : 0.76));
        }
        poly(c, hi, o.col);
        var m = 6;
        rect(c, s, o.x + m, o.y + m, o.w - 2 * m, o.h - 2 * m, o.ht + 3, shade(o.col, 1.1));
      });
      c.fillStyle = "#000";
      s.wait.forEach(function (w) {
        var p = pt(s, w.x, w.y, 4);
        if (w.vip) {
          c.fillStyle = "#fde047";
          c.beginPath();
          c.arc(p[0], p[1], 12 * s.z, 0, 7);
          c.fill();
          c.fillStyle = "#000";
        }
        G.emoji(c, w.em, p[0], p[1] - Math.abs(Math.sin(G.t * 4 + w.x)) * 4, 20 * s.z);
      });
      s.riders.forEach(function (r) {
        var p = pt(s, r.dest.zx, r.dest.zy, 0),
          y = p[1] - 16 - Math.abs(Math.sin(G.t * 4)) * 6;
        c.fillStyle = r.col;
        c.beginPath();
        c.arc(p[0], y - 8, 13, 0, 7);
        c.moveTo(p[0] - 9, y);
        c.lineTo(p[0], y + 16);
        c.lineTo(p[0] + 9, y);
        c.fill();
        c.fillStyle = "#000";
        G.emoji(c, r.em, p[0], y - 8, 16);
      });
      G.img(c, ":dawgW:", s.ax, s.ay, 15 * s.z);
      if (s.mode !== "shop") {
        if (room) {
          var _b2 = null,
            bd = 1e9;
          s.wait.forEach(function (w) {
            var d = hyp(w.zx - car.x, w.zy - car.y);
            if (d < bd) {
              bd = d;
              _b2 = w;
            }
          });
          if (_b2) arrow(c, s, _b2.zx, _b2.zy, _b2.vip ? "#fde047" : "#ffffff", !s.riders.length);
        }
        s.riders.forEach(function (r) {
          return arrow(c, s, r.dest.zx, r.dest.zy, r.col, true);
        });
      }
      var low = s.clock < 10 && s.mode === "drive";
      G.hud(c, "$" + s.cash, "DAY " + s.day + "/" + DAYS, "0:" + String(Math.ceil(s.clock)).padStart(2, "0"));
      if (low && Math.floor(G.t * 4) % 2) G.text(c, "0:" + String(Math.ceil(s.clock)).padStart(2, "0"), W - 10, 17, Math.max(10, Math.min(13, W / 30)), "#f87171", "right");
      for (var i = 0; i <= lv(s, "seats"); i++) {
        var r = s.riders[i],
          x = 8,
          y = 42 + i * 30,
          w = 92;
        c.fillStyle = r ? "rgba(10,10,20,0.7)" : "rgba(10,10,20,0.35)";
        c.fillRect(x, y, w, 25);
        if (!r) {
          G.text(c, "EMPTY", x + w / 2, y + 13, 8, "rgba(255,255,255,0.6)");
          continue;
        }
        c.fillStyle = r.col;
        c.fillRect(x, y, 4, 25);
        c.fillStyle = "#000";
        G.emoji(c, r.em, x + 17, y + 13, 15);
        G.text(c, "$" + r.fare, x + 30, y + 9, 8, "#fff", "left");
        c.fillStyle = "rgba(255,255,255,0.2)";
        c.fillRect(x + 30, y + 16, w - 36, 5);
        c.fillStyle = r.t / r.limit < 0.3 ? "#f87171" : r.col;
        c.fillRect(x + 30, y + 16, (w - 36) * clamp(r.t / r.limit, 0, 1), 5);
      }
      var M = 76,
        mx = W - M - 8,
        my = 42,
        q = M / WORLD;
      c.fillStyle = "rgba(10,10,20,0.6)";
      c.fillRect(mx - 3, my - 3, M + 6, M + 6);
      c.fillStyle = "rgba(255,255,255,0.22)";
      CITY.forEach(function (b) {
        return c.fillRect(mx + b.x * q, my + b.y * q, B * q, B * q);
      });
      if (room) s.wait.forEach(function (w) {
        c.fillStyle = w.vip ? "#fde047" : "#fff";
        c.fillRect(mx + w.zx * q - 2, my + w.zy * q - 2, 4, 4);
      });
      s.riders.forEach(function (r) {
        c.fillStyle = r.col;
        c.beginPath();
        c.arc(mx + r.dest.zx * q, my + r.dest.zy * q, 4, 0, 7);
        c.fill();
      });
      c.save();
      c.translate(mx + car.x * q, my + car.y * q);
      c.rotate(car.a);
      c.fillStyle = "#facc15";
      c.beginPath();
      c.moveTo(6, 0);
      c.lineTo(-4, -4);
      c.lineTo(-4, 4);
      c.fill();
      c.restore();
      s.pops.forEach(function (o, i) {
        c.globalAlpha = Math.min(1, o.t * 2);
        var y = H * 0.3 - (s.pops.length - 1 - i) * 22 - (1.6 - o.t) * 10;
        G.text(c, o.txt, W / 2 + 1, y + 1, 11, "#000");
        G.text(c, o.txt, W / 2, y, 11, o.col);
      });
      c.globalAlpha = 1;
      if (s.mode === "ready") {
        G.banner(c, DAYN[s.day - 1], "#ffd23f", H * 0.36);
        G.text(c, "DAY " + s.day + " OF " + DAYS, W / 2, H * 0.36 + 34, 11, "#fff");
      }
      if (s.mode === "drive" && s.day === 1) G.hint(c, s.kb || !TOUCH ? "UP = GAS   LEFT / RIGHT = STEER" : "HOLD LEFT / RIGHT TO STEER", 6);
      if (s.mode === "shop") this.shop(G, c);
    },
    shop: function shop(G, c) {
      var s = G.s,
        W = G.W,
        H = G.H,
        pw = Math.min(W - 20, 360),
        x = (W - pw) / 2,
        rh = Math.min(52, (H - 230) / 5);
      var y = Math.max(40, (H - (150 + rh * 5)) / 2);
      c.fillStyle = "rgba(10,10,25,0.88)";
      c.fillRect(0, 34, W, H - 34);
      G.text(c, DAYN[s.day - 1] + " DONE", W / 2, y + 12, 14, "#ffd23f");
      G.text(c, s.dayFares + " FARES   +$" + s.dayCash, W / 2, y + 38, 10, "#fff");
      G.text(c, "BANK $" + s.cash, W / 2, y + 62, 12, "#4ade80");
      y += 84;
      s.btns = [];
      UPS.forEach(function (u, i) {
        var n = lv(s, u.k),
          cost = u.cost[n],
          ok = cost !== undefined && s.cash >= cost,
          ry = y + i * rh;
        c.fillStyle = "rgba(255,255,255,0.08)";
        c.fillRect(x, ry, pw, rh - 6);
        G.text(c, u.name, x + 10, ry + rh * 0.3, 9, "#fff", "left");
        c.font = "12px system-ui, sans-serif";
        c.fillStyle = "rgba(255,255,255,0.65)";
        c.textAlign = "left";
        c.fillText(u.sub, x + 10, ry + rh * 0.62);
        for (var j = 0; j < u.cost.length; j++) {
          c.fillStyle = j < n ? "#facc15" : "rgba(255,255,255,0.2)";
          c.fillRect(x + pw - 78 - (u.cost.length - j) * 9, ry + rh * 0.22, 6, 6);
        }
        var bw = 68,
          bx = x + pw - bw - 6,
          by = ry + 5,
          bh = rh - 16;
        c.fillStyle = cost === undefined ? "rgba(255,255,255,0.12)" : ok ? "#22c55e" : "rgba(255,255,255,0.18)";
        c.fillRect(bx, by, bw, bh);
        G.text(c, cost === undefined ? "MAX" : "$" + cost, bx + bw / 2, by + bh / 2, 9, ok || cost === undefined ? "#fff" : "rgba(255,255,255,0.5)");
        s.btns.push({
          x: x,
          y: ry,
          w: pw,
          h: rh - 6,
          i: i
        });
      });
      var by = y + 5 * rh + 8;
      c.fillStyle = "#facc15";
      c.fillRect(x, by, pw, 46);
      G.text(c, "START " + DAYN[s.day], W / 2, by + 23, 12, "#111");
      s.btns.push({
        x: x,
        y: by,
        w: pw,
        h: 46,
        i: -1
      });
    },
    _t: {
      CITY: CITY,
      spot: spot,
      N: N,
      P: P,
      R: R,
      WORLD: WORLD
    }
  });
})();