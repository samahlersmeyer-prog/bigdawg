function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
(function () {
  var DT = 1 / 120,
    GRAV = 1500,
    PR = 13,
    BR = 24,
    VMAX = 1500;
  var LEVELS = [{
    h: [[150, 0, 235], [392, 29, 235], [601, 18, 235], [828, -15, 235], [1067, -13, 235], [1287, -4, 235], [1508, 7, 235]],
    b: [],
    k: [[1838, 207, 260, 40]],
    fin: 1888,
    bot: 449
  }, {
    h: [[150, 0, 235], [366, -15, 234], [585, -13, 234], [801, -17, 234], [1018, -32, 234], [1233, -31, 234], [1462, -33, 234]],
    b: [],
    k: [[1792, 167, 260, 40]],
    fin: 1842,
    bot: 420
  }, {
    h: [[150, 0, 235], [374, -5, 232], [601, 40, 232], [1060, 54, 232], [1300, 56, 232], [1516, 106, 232], [1729, 153, 232], [1964, 133, 232], [2422, 117, 232]],
    b: [[811, 300], [2174, 393]],
    k: [[2752, 317, 260, 40]],
    fin: 2802,
    bot: 573
  }, {
    h: [[150, 0, 235], [394, 11, 230], [632, 51, 230], [853, 48, 230], [1143, 52, 230], [1358, 80, 230], [1590, 113, 230], [2061, 103, 230], [2526, 102, 230]],
    b: [[1800, 373], [2271, 363]],
    k: [[976, 203, 44, 700], [2856, 302, 260, 40]],
    fin: 2906,
    bot: 533
  }, {
    h: [[150, 0, 235], [383, 8, 229], [620, -14, 229], [910, -18, 229], [1124, 5, 229], [1340, -5, 229], [1812, -9, 229], [2065, 10, 229], [2297, 35, 229], [2587, 43, 229]],
    b: [[1550, 255]],
    k: [[743, 153, 44, 700], [2420, 208, 44, 700], [2917, 243, 260, 40]],
    fin: 2967,
    bot: 463
  }, {
    h: [[150, 0, 235], [360, -30, 232], [822, -21, 232], [1038, -37, 232], [1258, -83, 232], [1465, -41, 232], [1672, -36, 232], [1877, 12, 232]],
    b: [[570, 230]],
    k: [[2207, 212, 260, 40]],
    fin: 2257,
    bot: 432
  }, {
    h: [[150, 0, 235], [399, 58, 225], [645, 31, 225], [857, 4, 225], [1332, 0, 225], [1561, 14, 225], [1813, 66, 225], [2078, 78, 225], [2340, 80, 225], [2789, 96, 225], [3238, 88, 225], [3446, 131, 225]],
    b: [[1067, 264], [2550, 340], [2999, 356]],
    k: [[3776, 331, 260, 40]],
    fin: 3826,
    bot: 551
  }, {
    h: [[150, 0, 235], [440, -15, 228], [690, -22, 228], [909, 2, 228], [1199, 2, 228], [1408, -19, 228], [1886, -28, 228], [2125, -8, 228], [2415, -4, 228], [2664, 13, 228]],
    b: [[1618, 241]],
    k: [[273, 183, 44, 700], [1032, 172, 44, 700], [2248, 135, 44, 700], [2994, 213, 260, 40]],
    fin: 3044,
    bot: 433
  }, {
    h: [[150, 0, 235], [379, 26, 227], [669, 29, 227], [877, -34, 227], [1167, -23, 227], [1636, -17, 227], [1858, 39, 227], [2148, 32, 227], [2381, 37, 227], [2830, 51, 227], [3055, 96, 227]],
    b: [[1377, 237], [2591, 297]],
    k: [[502, 216, 44, 700], [1000, 119, 44, 700], [1981, 209, 44, 700], [3385, 296, 260, 40]],
    fin: 3435,
    bot: 516
  }, {
    h: [[150, 0, 235], [450, 10, 225], [695, -35, 225], [902, -3, 225], [1149, -17, 225], [1412, 2, 225], [1712, -6, 225], [2012, -23, 225], [2302, -15, 225], [2567, -12, 225], [3022, -23, 225]],
    b: [[2777, 248]],
    k: [[278, -620, 44, 724], [1540, -618, 44, 729], [1840, -626, 44, 723], [2135, 138, 44, 700], [3352, 177, 260, 40]],
    fin: 3402,
    bot: 430
  }, {
    h: [[150, 0, 235], [415, 20, 223], [705, 39, 223], [917, -32, 223], [1207, -53, 223], [1507, -35, 223], [1961, -46, 223], [2251, -44, 223], [2725, -35, 223], [2994, -30, 223], [3203, -2, 223], [3663, -19, 223]],
    b: [[1717, 225], [2461, 216], [3413, 258]],
    k: [[538, 175, 44, 700], [1040, 122, 44, 700], [1335, -673, 44, 724], [2084, 142, 44, 700], [3993, 181, 260, 40]],
    fin: 4043,
    bot: 459
  }, {
    h: [[150, 0, 235], [440, 1, 224], [685, -56, 224], [975, -54, 224], [1275, -46, 224], [1512, -51, 224], [1990, -35, 224], [2280, -27, 224], [2520, -86, 224], [2810, -97, 224], [3100, -104, 224], [3331, -65, 224]],
    b: [[1722, 209]],
    k: [[273, 176, 44, 700], [808, 100, 44, 700], [1103, -674, 44, 734], [2113, 122, 44, 700], [2643, 96, 44, 700], [2933, 83, 44, 700], [3661, 135, 260, 40]],
    fin: 3711,
    bot: 421
  }, {
    h: [[150, 0, 235], [395, -27, 220], [633, 51, 220], [933, 34, 220], [1223, 38, 220], [1513, 50, 220], [1772, 47, 220], [2028, 97, 220], [2486, 74, 220], [2701, 73, 220], [2910, 116, 220], [3378, 104, 220], [3604, 144, 220], [3894, 120, 220]],
    b: [[2238, 357], [3120, 376]],
    k: [[761, -569, 44, 710], [1056, 185, 44, 700], [1346, 217, 44, 700], [3727, 308, 44, 700], [4224, 320, 260, 40]],
    fin: 4274,
    bot: 564
  }, {
    h: [[150, 0, 235], [450, 6, 221], [740, 23, 221], [1187, 3, 221], [1487, 20, 221], [1966, 15, 221], [2221, -63, 221], [2511, -50, 221], [2749, -103, 221], [2983, -96, 221], [3447, -81, 221], [3925, -65, 221], [4179, -26, 221]],
    b: [[950, 283], [1697, 280], [3193, 164], [3657, 179]],
    k: [[278, -620, 44, 716], [573, 194, 44, 700], [1315, -617, 44, 734], [2344, 87, 44, 700], [4509, 174, 260, 40]],
    fin: 4559,
    bot: 443
  }, {
    h: [[150, 0, 235], [440, -19, 219], [672, 27, 219], [962, 21, 219], [1435, 34, 219], [1668, 25, 219], [1968, 8, 219], [2437, 32, 219], [2697, 61, 219], [2921, 56, 219], [3211, 43, 219], [3501, 66, 219], [3725, 26, 219], [4025, 48, 219]],
    b: [[1172, 281], [2178, 268]],
    k: [[273, 140, 44, 700], [795, 196, 44, 700], [1796, -595, 44, 713], [3044, 224, 44, 700], [3334, 189, 44, 700], [3853, -594, 44, 722], [4355, 248, 260, 40]],
    fin: 4405,
    bot: 486
  }, {
    h: [[150, 0, 235], [408, -10, 218], [874, -17, 218], [1174, -11, 218], [1432, 36, 218], [1698, 20, 218], [1929, 99, 218], [2219, 80, 218], [2464, 120, 218], [2913, 143, 218], [3197, 134, 218], [3662, 141, 218], [3909, 206, 218], [4178, 181, 218], [4642, 207, 218]],
    b: [[618, 250], [2674, 380], [3407, 394], [4388, 441]],
    k: [[1002, -637, 44, 715], [2052, 287, 44, 700], [4972, 407, 260, 40]],
    fin: 5022,
    bot: 627
  }, {
    h: [[150, 0, 235], [600, 11, 233], [1072, 25, 233], [1536, 36, 233], [1753, 1, 233], [2220, 13, 233], [2465, -36, 233], [2700, -13, 233]],
    b: [[360, 260], [810, 271], [1282, 285], [1963, 261]],
    k: [[3030, 187, 260, 40]],
    fin: 3080,
    bot: 456
  }, {
    h: [[150, 0, 235], [597, 13, 231], [848, 0, 231], [1082, -20, 231], [1311, 22, 231], [1559, 69, 231], [1780, 84, 231], [2017, 77, 231], [2265, 47, 231]],
    b: [[360, 260]],
    k: [[2595, 247, 260, 40]],
    fin: 2645,
    bot: 504
  }, {
    h: [[150, 0, 235], [603, 18, 226], [819, -43, 226], [1073, -22, 226], [1525, -33, 226], [1753, -74, 226], [1993, -140, 226], [2248, -151, 226], [2491, -112, 226], [2937, -119, 226], [3395, -117, 226]],
    b: [[360, 260], [1283, 238], [2701, 148], [3147, 141]],
    k: [[3725, 83, 260, 40]],
    fin: 3775,
    bot: 438
  }, {
    h: [[150, 0, 235], [599, 20, 222], [806, -51, 222], [1096, -35, 222], [1386, -52, 222], [1686, -71, 222], [1986, -86, 222], [2286, -98, 222], [2558, -95, 222], [3020, -78, 222], [3320, -99, 222], [3526, -175, 222], [3785, -98, 222]],
    b: [[360, 260], [2768, 165]],
    k: [[929, 126, 44, 700], [1219, 135, 44, 700], [1514, -672, 44, 709], [1814, -691, 44, 715], [2114, -706, 44, 721], [3148, -698, 44, 718], [4115, 102, 260, 40]],
    fin: 4165,
    bot: 440
  }, {
    h: [[150, 0, 235], [419, 25, 216], [890, 51, 216], [1344, 70, 216], [1630, 79, 216], [1930, 94, 216], [2197, 89, 216], [2470, 94, 216], [2758, 114, 216], [2994, 206, 216], [3219, 269, 216], [3438, 180, 216], [3728, 153, 216], [3983, 217, 216], [4273, 229, 216], [4544, 226, 216]],
    b: [[629, 285], [1100, 311]],
    k: [[1758, -541, 44, 725], [3561, 367, 44, 700], [4106, 391, 44, 700], [4874, 426, 260, 40]],
    fin: 4924,
    bot: 689
  }, {
    h: [[150, 0, 235], [429, 13, 218], [905, 34, 218], [1205, 32, 218], [1680, 8, 218], [1919, -14, 218], [2134, 36, 218], [2406, 29, 218], [2673, 29, 218], [2939, 9, 218], [3197, 4, 218], [3497, 4, 218], [3797, 4, 218], [4087, -21, 218]],
    b: [[639, 273], [1415, 292]],
    k: [[1033, -586, 44, 723], [3325, -616, 44, 713], [3625, -616, 44, 728], [3920, 162, 44, 700], [4417, 179, 260, 40]],
    fin: 4467,
    bot: 456
  }, {
    h: [[150, 0, 235], [440, -19, 217], [895, 0, 217], [1103, 49, 217], [1565, 48, 217], [1778, -41, 217], [2026, -114, 217], [2234, -37, 217], [2534, -12, 217], [2834, 1, 217], [3064, -58, 217], [3342, -44, 217], [3632, -58, 217], [3932, -84, 217], [4151, -86, 217]],
    b: [[650, 241], [1313, 309]],
    k: [[273, 159, 44, 700], [2362, -657, 44, 711], [2662, -632, 44, 718], [3465, 110, 44, 700], [3760, -678, 44, 713], [4481, 114, 260, 40]],
    fin: 4531,
    bot: 469
  }, {
    h: [[150, 0, 235], [608, 19, 215], [829, -56, 215], [1084, 20, 215], [1348, 8, 215], [1826, 35, 215], [2043, 45, 215], [2333, 68, 215], [2800, 85, 215], [3047, 94, 215], [3301, 41, 215], [3746, 22, 215], [4046, 25, 215], [4313, 27, 215], [4593, 41, 215], [4893, 27, 215]],
    b: [[360, 260], [1558, 268], [2543, 328], [3511, 301]],
    k: [[2166, 230, 44, 700], [3874, -598, 44, 726], [4721, -579, 44, 722], [5223, 227, 260, 40]],
    fin: 5273,
    bot: 514
  }];
  var PAR = [3.9, 4.1, 5.5, 6.1, 5.8, 4.4, 7.5, 6.7, 6, 6.7, 8.6, 9.1, 8.1, 8.9, 9, 11.7, 8.1, 7.8, 9.5, 10.2, 10, 8.1, 9.8, 14.7];
  function mk(L) {
    var h = L.h[0],
      st = {
        L: L,
        x: h[0] - 105,
        y: h[1] + 95,
        vx: 0,
        vy: 0,
        hk: 0,
        len: 0,
        t: 0,
        done: 0,
        dead: 0,
        was: false,
        rot: 0,
        spin: 0,
        still: 0,
        hitB: -1
      };
    st.len = Math.hypot(st.x - h[0], st.y - h[1]);
    return st;
  }
  function target(st) {
    var best = -1,
      bd = 1e9;
    st.L.h.forEach(function (h, i) {
      var d = Math.hypot(h[0] - st.x, h[1] - st.y);
      if (d < h[2] && d < bd) {
        bd = d;
        best = i;
      }
    });
    return best;
  }
  function step(st, held) {
    var L = st.L;
    if (held && !st.was && st.hk < 0) {
      var i = target(st);
      if (i >= 0) {
        st.hk = i;
        st.len = Math.max(50, Math.hypot(st.x - L.h[i][0], st.y - L.h[i][1]));
        st.min = Math.max(50, st.len * 0.78);
        st.ev = "grab";
      }
    }
    if (!held && st.was && st.hk >= 0) {
      st.hk = -1;
      st.spin = Math.max(-16, Math.min(16, st.vx * 0.012));
    }
    st.was = held;
    st.vy += GRAV * DT;
    st.x += st.vx * DT;
    st.y += st.vy * DT;
    if (st.hk >= 0) {
      var h = L.h[st.hk];
      if (st.min && st.len > st.min) st.len = Math.max(st.min, st.len - 150 * DT);
      var dx = st.x - h[0],
        dy = st.y - h[1],
        d = Math.hypot(dx, dy) || 1;
      if (d > st.len) {
        var nx = dx / d,
          ny = dy / d,
          out = st.vx * nx + st.vy * ny;
        st.x = h[0] + nx * st.len;
        st.y = h[1] + ny * st.len;
        if (out > 0) {
          st.vx -= out * nx;
          st.vy -= out * ny;
        }
      }
    }
    var _iterator = _createForOfIteratorHelper(L.k),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var k = _step.value;
        var cx = Math.max(k[0], Math.min(st.x, k[0] + k[2])),
          cy = Math.max(k[1], Math.min(st.y, k[1] + k[3]));
        var _nx2 = st.x - cx,
          _ny2 = st.y - cy,
          _d2 = Math.hypot(_nx2, _ny2);
        if (_d2 >= PR) continue;
        if (_d2 < 1e-6) {
          _nx2 = 0;
          _ny2 = -1;
          _d2 = 0;
          st.y = k[1] - PR;
        } else {
          _nx2 /= _d2;
          _ny2 /= _d2;
          st.x = cx + _nx2 * PR;
          st.y = cy + _ny2 * PR;
        }
        var _vn = st.vx * _nx2 + st.vy * _ny2;
        if (_vn < 0) {
          st.vx -= 1.35 * _vn * _nx2;
          st.vy -= 1.35 * _vn * _ny2;
          st.vx *= 0.99;
          st.vy *= 0.99;
          if (_vn < -250) st.ev = "thud";
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
    for (var _i = 0; _i < L.b.length; _i++) {
      var b = L.b[_i],
        _dx = st.x - b[0],
        _dy = st.y - b[1],
        _d = Math.hypot(_dx, _dy) || 1;
      if (_d >= PR + BR) continue;
      var _nx = _dx / _d,
        _ny = _dy / _d,
        vn = st.vx * _nx + st.vy * _ny;
      st.x = b[0] + _nx * (PR + BR);
      st.y = b[1] + _ny * (PR + BR);
      var want = Math.max(900, -vn);
      st.vx += (want - vn) * _nx;
      st.vy += (want - vn) * _ny;
      st.hitB = _i;
      st.ev = "boing";
    }
    var sp = Math.hypot(st.vx, st.vy);
    if (sp > VMAX) {
      st.vx *= VMAX / sp;
      st.vy *= VMAX / sp;
    }
    if (st.hk >= 0) {
      var _h = L.h[st.hk];
      st.rot = Math.atan2(st.x - _h[0], -(st.y - _h[1])) + Math.PI;
    } else {
      st.rot += st.spin * DT;
      st.still = sp < 25 ? st.still + DT : 0;
    }
    st.t += DT;
    if (st.x >= L.fin) st.done = 1;else if (st.y > L.bot || st.still > 1.2) st.dead = 1;
  }
  var pkey = function pkey() {
    return "bdd:hook:" + (typeof me !== "undefined" && me ? me.id : "");
  };
  function prog() {
    var p = null;
    try {
      p = store.get(pkey());
    } catch (e) {}
    if (!p || !p.b) p = {
      u: 0,
      b: {},
      last: 0
    };
    return p;
  }
  var total = function total(p) {
    return Object.keys(p.b).reduce(function (a, k) {
      return a + (p.b[k] || 0);
    }, 0);
  };
  var ptsFor = function ptsFor(li, t) {
    var par = PAR[li] || 12;
    return 1000 + Math.round(500 * Math.max(0, Math.min(1, 1 - (t - par) / (par * 1.5))));
  };
  var stars = function stars(pts) {
    return pts >= 1400 ? 3 : pts >= 1200 ? 2 : 1;
  };
  defGame({
    key: "hook",
    name: "Hook Dawg",
    icon: "🪝",
    max: 99999,
    blurb: "Hold to hook, let go to fling. 24 levels.",
    how: "Hold anywhere to grab the nearest hook and swing. You can only grab a hook when you're inside its dashed ring. Let go to fling yourself forward, and let go on the upswing to fly far. Round bumpers bounce you, striped blocks are solid. Fall off the bottom and the level just starts over. Swing past the checkered line to clear it. Each level is worth 1000, plus up to 500 for speed, and your score is the total of your best on every level. Tap ↻ to restart, and the arrows to replay a level you've cleared.",
    _t: {
      LEVELS: LEVELS,
      PAR: PAR,
      mk: mk,
      step: step,
      target: target,
      DT: DT,
      PR: PR,
      BR: BR
    },
    reset: function reset(G) {
      var p = prog();
      G.s = {
        p: p,
        held: false,
        acc: 0,
        fx: [],
        cam: null
      };
      this.load(G, Math.min(p.last || 0, p.u, LEVELS.length - 1));
    },
    load: function load(G, li) {
      var s = G.s;
      s.li = li;
      s.st = mk(LEVELS[li]);
      s.phase = "go";
      s.pt = 0;
      s.fx = [];
      s.held = false;
      s.trail = [];
      s.sq = {};
      s.cam = null;
      s.p.last = li;
      try {
        store.set(pkey(), s.p);
      } catch (e) {}
    },
    win: function win(G) {
      var s = G.s;
      s.phase = "win";
      s.pt = 0;
      G.sfx("win");
      var pts = ptsFor(s.li, s.st.t),
        old = s.p.b[s.li] || 0;
      s.winPts = pts;
      s.winBest = pts > old;
      if (pts > old) s.p.b[s.li] = pts;
      s.p.u = Math.max(s.p.u, Math.min(LEVELS.length - 1, s.li + 1));
      try {
        store.set(pkey(), s.p);
      } catch (e) {}
      if (pts > old) G.postQuiet(total(s.p));
      for (var i = 0; i < 50; i++) s.fx.push({
        x: s.st.x,
        y: s.st.y,
        vx: (Math.random() - 0.3) * 500,
        vy: -Math.random() * 600,
        t: 1.5 + Math.random(),
        col: ["#e63946", "#ffd23f", "#2a9df4", "#5cd65c"][i % 4]
      });
    },
    update: function update(G, dt) {
      var s = G.s,
        st = s.st;
      s.pt += dt;
      var _iterator2 = _createForOfIteratorHelper(s.fx),
        _step2;
      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var f = _step2.value;
          f.x += f.vx * dt;
          f.y += f.vy * dt;
          f.vy += 900 * dt;
          f.t -= dt;
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
      if (s.fx.length) s.fx = s.fx.filter(function (f) {
        return f.t > 0;
      });
      for (var k in s.sq) s.sq[k] = Math.max(0, s.sq[k] - dt * 5);
      if (s.phase === "dead") {
        if (s.pt > 0.45) this.load(G, s.li);
        return;
      }
      for (s.acc += dt; s.acc >= DT; s.acc -= DT) {
        if (s.phase === "win") {
          st.vy += GRAV * DT;
          st.x += st.vx * DT;
          st.y += st.vy * DT;
          st.rot += st.spin * DT;
          continue;
        }
        st.ev = null;
        step(st, s.held);
        if (st.ev === "boing") {
          s.sq[st.hitB] = 1;
          G.sfx("pop");
        } else if (st.ev === "grab") G.sfx("pop");
        if (st.done) {
          st.hk = -1;
          this.win(G);
        } else if (st.dead) {
          s.phase = "dead";
          s.pt = 0;
          G.sfx("lose");
          G.buzz();
          break;
        }
      }
      s.trail.push([st.x, st.y]);
      if (s.trail.length > 14) s.trail.shift();
    },
    btns: function btns(G) {
      var y = 52,
        r = 17,
        s = G.s;
      return {
        redo: {
          x: G.W - 26,
          y: y,
          r: r,
          ch: "↻"
        },
        next: {
          x: G.W - 66,
          y: y,
          r: r,
          ch: "▶",
          off: s.li >= s.p.u || s.li >= LEVELS.length - 1
        },
        prev: {
          x: G.W - 106,
          y: y,
          r: r,
          ch: "◀",
          off: s.li <= 0
        }
      };
    },
    down: function down(G, x, y) {
      var s = G.s,
        b = this.btns(G);
      for (var k in b) if (Math.hypot(x - b[k].x, y - b[k].y) < 22) {
        if (b[k].off) return;
        G.sfx("pop");
        return this.load(G, s.li + (k === "next" ? 1 : k === "prev" ? -1 : 0));
      }
      if (s.phase === "win") {
        if (s.pt > 0.5) this.load(G, (s.li + 1) % LEVELS.length);
        return;
      }
      s.held = true;
    },
    up: function up(G) {
      G.s.held = false;
    },
    onKey: function onKey(G, k, isDown) {
      var s = G.s;
      if ((k === "r" || k === "R") && isDown) return this.load(G, s.li);
      if (k !== " " && k !== "ArrowUp" && k !== "w") return;
      if (isDown && s.phase === "win") {
        if (s.pt > 0.5) this.load(G, (s.li + 1) % LEVELS.length);
        return;
      }
      s.held = isDown;
    },
    draw: function draw(G, c) {
      var s = G.s,
        W = G.W,
        H = G.H,
        dark = G.dark(),
        st = s.st;
      if (!st) return;
      var L = st.L,
        z = Math.max(0.8, Math.min(1.5, W / 400));
      var wx = st.x - W * 0.36 / z,
        wy = Math.min(st.y - H * 0.45 / z, L.bot + 30 - H / z);
      if (!s.cam) s.cam = {
        x: wx,
        y: wy
      };
      s.cam.x += (wx - s.cam.x) * 0.18;
      s.cam.y += (wy - s.cam.y) * 0.12;
      var gr = c.createLinearGradient(0, 0, 0, H);
      if (dark) {
        gr.addColorStop(0, "#131a35");
        gr.addColorStop(1, "#27325c");
      } else {
        gr.addColorStop(0, "#bfe6ff");
        gr.addColorStop(1, "#f4fbff");
      }
      c.fillStyle = gr;
      c.fillRect(0, 0, W, H);
      var ink = dark ? "#eef1ff" : "#22252e";
      c.save();
      c.scale(z, z);
      c.translate(-s.cam.x, -s.cam.y);
      var x0 = s.cam.x - 60,
        x1 = s.cam.x + W / z + 60;
      var sq = 14,
        top = s.cam.y - 20,
        rows = Math.ceil((H / z + 40) / sq);
      for (var r = 0; r < rows; r++) for (var q = 0; q < 2; q++) {
        c.fillStyle = (r + q) % 2 ? dark ? "#eef1ff" : "#22252e" : dark ? "#3a456f" : "#fff";
        c.fillRect(L.fin + q * sq, Math.floor(top / sq) * sq + r * sq, sq, sq);
      }
      var _iterator3 = _createForOfIteratorHelper(L.k),
        _step3;
      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var _k = _step3.value;
          if (_k[0] + _k[2] < x0 || _k[0] > x1) continue;
          c.fillStyle = dark ? "#55608f" : "#3d4558";
          c.fillRect(_k[0], _k[1], _k[2], _k[3]);
          c.save();
          c.beginPath();
          c.rect(_k[0], _k[1], _k[2], _k[3]);
          c.clip();
          c.strokeStyle = "rgba(255,255,255,0.13)";
          c.lineWidth = 7;
          c.beginPath();
          for (var x = _k[0] - _k[3]; x < _k[0] + _k[2]; x += 22) {
            c.moveTo(x, _k[1] + _k[3]);
            c.lineTo(x + _k[3], _k[1]);
          }
          c.stroke();
          c.restore();
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }
      L.b.forEach(function (b, i) {
        if (b[0] < x0 || b[0] > x1) return;
        var q = 1 + (s.sq[i] || 0) * 0.25;
        c.fillStyle = "#ff4d6d";
        c.beginPath();
        c.arc(b[0], b[1], BR * q, 0, 7);
        c.fill();
        c.strokeStyle = "#fff";
        c.lineWidth = 4;
        c.beginPath();
        c.arc(b[0], b[1], BR * q * 0.58, 0, 7);
        c.stroke();
      });
      var tg = s.phase === "go" && st.hk < 0 ? target(st) : -1;
      L.h.forEach(function (h, i) {
        if (h[0] + h[2] < x0 || h[0] - h[2] > x1) return;
        var on = i === tg || i === st.hk;
        c.setLineDash([7, 9]);
        c.lineWidth = on ? 2.5 : 1.5;
        c.strokeStyle = on ? "#ff8a1e" : dark ? "rgba(238,241,255,0.22)" : "rgba(34,37,46,0.2)";
        c.beginPath();
        c.arc(h[0], h[1], h[2], 0, 7);
        c.stroke();
        c.setLineDash([]);
        c.fillStyle = on ? "#ff8a1e" : ink;
        c.beginPath();
        c.arc(h[0], h[1], 8, 0, 7);
        c.fill();
        c.fillStyle = dark ? "#131a35" : "#fff";
        c.beginPath();
        c.arc(h[0], h[1], 3, 0, 7);
        c.fill();
      });
      s.trail.forEach(function (t, i) {
        c.fillStyle = dark ? "rgba(238,241,255,".concat(i / 40, ")") : "rgba(34,37,46,".concat(i / 50, ")");
        c.beginPath();
        c.arc(t[0], t[1], 2 + i / 4, 0, 7);
        c.fill();
      });
      c.strokeStyle = ink;
      c.lineCap = "round";
      c.lineJoin = "round";
      if (st.hk >= 0) {
        c.lineWidth = 2.5;
        c.beginPath();
        c.moveTo(st.x, st.y);
        c.lineTo(L.h[st.hk][0], L.h[st.hk][1]);
        c.stroke();
      }
      c.save();
      c.translate(st.x, st.y);
      c.rotate(st.rot);
      c.lineWidth = 3.5;
      c.beginPath();
      if (st.hk >= 0) {
        c.moveTo(-5, 6);
        c.lineTo(0, -16);
        c.lineTo(5, 6);
        c.moveTo(0, 8);
        c.lineTo(0, 30);
        c.moveTo(0, 30);
        c.lineTo(-6, 46);
        c.moveTo(0, 30);
        c.lineTo(7, 45);
      } else {
        c.arc(0, 6, 12, 0.3, Math.PI - 0.3);
        c.moveTo(-10, 12);
        c.lineTo(-4, 22);
        c.moveTo(10, 12);
        c.lineTo(4, 22);
      }
      c.stroke();
      c.restore();
      G.img(c, s.phase === "dead" ? ":dawgpain:" : s.phase === "win" ? ":dawgpog:" : st.hk < 0 && st.vy > 700 ? ":dawgsweat:" : ":dawgW:", st.x, st.y, 26, st.hk >= 0 ? st.rot * 0.35 : st.rot);
      var _iterator4 = _createForOfIteratorHelper(s.fx),
        _step4;
      try {
        for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
          var f = _step4.value;
          c.fillStyle = f.col;
          c.fillRect(f.x - 3, f.y - 3, 6, 6);
        }
      } catch (err) {
        _iterator4.e(err);
      } finally {
        _iterator4.f();
      }
      c.restore();
      if (s.phase === "dead") {
        c.fillStyle = "rgba(0,0,0,".concat(Math.min(0.5, s.pt), ")");
        c.fillRect(0, 0, W, H);
      }
      c.fillStyle = "rgba(0,0,0,0.35)";
      c.fillRect(0, 0, W, 30);
      G.text(c, "LEVEL ".concat(s.li + 1, "/").concat(LEVELS.length), 10, 15, 11, "#fff", "left");
      G.text(c, "".concat(total(s.p)), W - 10, 15, 11, "#ffd23f", "right");
      G.text(c, st.t.toFixed(1) + "s", 12, 52, 10, ink, "left");
      var b = this.btns(G);
      for (var k in b) {
        var o = b[k];
        c.globalAlpha = o.off ? 0.3 : 1;
        c.fillStyle = "rgba(0,0,0,0.45)";
        c.beginPath();
        c.arc(o.x, o.y, o.r, 0, 7);
        c.fill();
        c.fillStyle = "#fff";
        c.font = "bold 16px system-ui";
        c.textAlign = "center";
        c.textBaseline = "middle";
        c.fillText(o.ch, o.x, o.y + 1);
        c.globalAlpha = 1;
      }
      if (G.state === "play" && s.phase === "go" && s.li === 0 && st.t < 5) G.hint(c, "HOLD = HOOK · LET GO = FLING", 99, H * 0.8);
      if (s.phase === "win") {
        c.fillStyle = "rgba(0,0,0,0.45)";
        c.fillRect(0, H * 0.3, W, 150);
        G.text(c, s.li === LEVELS.length - 1 ? "ALL CLEAR!" : "LEVEL CLEAR", W / 2, H * 0.3 + 32, 16, "#ffd23f");
        G.text(c, "★".repeat(stars(s.winPts)) + "☆".repeat(3 - stars(s.winPts)), W / 2, H * 0.3 + 64, 18, "#ffd23f");
        G.text(c, "".concat(st.t.toFixed(1), "s  +").concat(s.winPts).concat(s.winBest ? "  BEST" : ""), W / 2, H * 0.3 + 96, 10, "#fff");
        if (s.pt > 0.5) G.text(c, "TAP FOR NEXT", W / 2, H * 0.3 + 126, 10, "#fff");
      }
    }
  });
})();