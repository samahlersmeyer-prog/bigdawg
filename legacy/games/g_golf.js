function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
(function () {
  var SW = 0.16;
  var SWW = 0.24;
  var ZONE = 0.08;
  var SPD = 0.75;
  var CLUBS = [{
    n: "DRIVER",
    max: 250,
    loft: 0.12,
    roll: 0.14,
    wk: 1.0,
    head: "#8a5a2b"
  }, {
    n: "3 WOOD",
    max: 220,
    loft: 0.14,
    roll: 0.12,
    wk: 1.05,
    head: "#8a5a2b"
  }, {
    n: "5 IRON",
    max: 185,
    loft: 0.18,
    roll: 0.09,
    wk: 1.15,
    head: "#c9ced6"
  }, {
    n: "7 IRON",
    max: 150,
    loft: 0.22,
    roll: 0.07,
    wk: 1.25,
    head: "#c9ced6"
  }, {
    n: "9 IRON",
    max: 125,
    loft: 0.28,
    roll: 0.05,
    wk: 1.35,
    head: "#d6dae0"
  }, {
    n: "WEDGE",
    max: 100,
    loft: 0.36,
    roll: 0.03,
    wk: 1.5,
    head: "#e3e6ea"
  }, {
    n: "CHIP",
    max: 70,
    loft: 0.3,
    roll: 0.05,
    wk: 1.2,
    head: "#e3e6ea"
  }, {
    n: "PUTTER",
    max: 0,
    loft: 0,
    roll: 0,
    wk: 0,
    head: "#555"
  }];
  var WEDGE = 5,
    CHIP = 6,
    PUT = 7;
  var LIE = {
    t: "TEE",
    f: "FAIRWAY",
    r: "ROUGH",
    s: "BUNKER",
    g: "GREEN",
    w: "WATER"
  };
  var R0 = [-9999, -12, "r"],
    T0 = [-12, 8, "t"];
  var FRONT = [{
    nm: "PUPPY PARK",
    par: 4,
    pin: 340,
    end: 420,
    ph: 0.4,
    amp: 0.8,
    wmax: 3,
    trees: [-46, -28, 22, 150, 300, 398, 414],
    oaks: [],
    lift: [],
    seg: [R0, T0, [8, 26, "r"], [26, 198, "f"], [198, 212, "s"], [212, 306, "f"], [306, 318, "r"], [318, 360, "g"], [360, 368, "r"], [368, 380, "s"], [380, 99999, "r"]]
  }, {
    nm: "POND PUP",
    par: 3,
    pin: 150,
    end: 220,
    ph: 2.1,
    amp: 0.7,
    wmax: 4,
    trees: [-46, -30, 196, 214],
    oaks: [],
    lift: [[-80, 12, 4, 12]],
    seg: [R0, T0, [8, 30, "r"], [30, 68, "f"], [68, 112, "w"], [112, 124, "f"], [124, 135, "s"], [135, 166, "g"], [166, 172, "r"], [172, 182, "s"], [182, 99999, "r"]]
  }, {
    nm: "CREEK RUN",
    par: 5,
    pin: 505,
    end: 585,
    ph: 4.0,
    amp: 1.0,
    wmax: 5,
    trees: [-46, -28, 22, 160, 350, 545, 566],
    oaks: [[440, 13]],
    lift: [],
    seg: [R0, T0, [8, 30, "r"], [30, 228, "f"], [228, 242, "s"], [242, 302, "f"], [302, 312, "w"], [312, 378, "f"], [378, 410, "w"], [410, 468, "f"], [468, 480, "r"], [480, 528, "g"], [528, 99999, "r"]]
  }, {
    nm: "HIGH DAWG",
    par: 4,
    pin: 372,
    end: 450,
    ph: 1.3,
    amp: 1.1,
    wmax: 6,
    trees: [-46, -28, 22, 200, 300, 424, 442],
    oaks: [],
    lift: [[352, 470, 8, 12]],
    seg: [R0, T0, [8, 26, "r"], [26, 218, "f"], [218, 246, "w"], [246, 334, "f"], [334, 346, "s"], [346, 354, "f"], [354, 392, "g"], [392, 402, "s"], [402, 99999, "r"]]
  }, {
    nm: "TIMBER TRAIL",
    par: 4,
    pin: 342,
    end: 420,
    ph: 5.2,
    amp: 2.0,
    wmax: 7,
    trees: [-46, -30, 236, 384, 404],
    oaks: [[150, 14], [296, 15]],
    lift: [[-80, 12, 6, 14]],
    seg: [R0, T0, [8, 34, "r"], [34, 140, "f"], [140, 162, "r"], [162, 262, "f"], [262, 276, "s"], [276, 312, "f"], [312, 372, "g"], [372, 99999, "r"]]
  }, {
    nm: "SPLASH ZONE",
    par: 3,
    pin: 176,
    end: 250,
    ph: 3.3,
    amp: 0.9,
    wmax: 8,
    trees: [-46, -30, 232, 246],
    oaks: [],
    lift: [[-80, 12, 5, 14]],
    seg: [R0, T0, [8, 36, "r"], [36, 148, "w"], [148, 158, "s"], [158, 192, "g"], [192, 198, "r"], [198, 228, "w"], [228, 99999, "r"]]
  }, {
    nm: "TWIN CREEKS",
    par: 4,
    pin: 400,
    end: 480,
    ph: 0.9,
    amp: 1.5,
    wmax: 9,
    trees: [-46, -28, 22, 230, 444, 464],
    oaks: [[340, 13]],
    lift: [],
    seg: [R0, T0, [8, 30, "r"], [30, 98, "f"], [98, 112, "w"], [112, 286, "f"], [286, 300, "w"], [300, 362, "f"], [362, 374, "s"], [374, 382, "f"], [382, 418, "g"], [418, 428, "r"], [428, 440, "s"], [440, 99999, "r"]]
  }, {
    nm: "THE BEAST",
    par: 5,
    pin: 528,
    end: 610,
    ph: 2.7,
    amp: 1.7,
    wmax: 10,
    trees: [-46, -28, 22, 262, 566, 590],
    oaks: [[180, 13], [410, 14]],
    lift: [],
    seg: [R0, T0, [8, 30, "r"], [30, 228, "f"], [228, 246, "s"], [246, 268, "f"], [268, 280, "s"], [280, 338, "f"], [338, 360, "w"], [360, 436, "f"], [436, 470, "w"], [470, 492, "f"], [492, 502, "s"], [502, 548, "g"], [548, 99999, "r"]]
  }, {
    nm: "HOME STRETCH",
    par: 4,
    pin: 418,
    end: 520,
    ph: 4.6,
    amp: 1.2,
    wmax: 12,
    trees: [-46, -28, 22, 200, 340, 506],
    oaks: [],
    lift: [[394, 446, 7, 10]],
    seg: [R0, T0, [8, 30, "r"], [30, 145, "f"], [145, 192, "w"], [192, 328, "f"], [328, 344, "s"], [344, 388, "f"], [388, 398, "r"], [398, 436, "g"], [436, 446, "r"], [446, 458, "s"], [458, 500, "w"], [500, 99999, "r"]]
  }];
  var BACKNM = ["BARK BAY", "FETCH FIELD", "BIG BONE", "HYDRANT HILL", "MUTT MARSH", "SQUIRREL RIDGE", "COLLAR CREEK", "THE KENNEL", "DAWG HOUSE"];
  var BACKF = [1.05, 1.1, 1.05, 1.2, 1.2, 0.85, 1.05, 1.1, 1.15];
  var BACK = FRONT.map(function (h, i) {
    var f = BACKF[i],
      sc = function sc(v) {
        return v >= 26 && v < 99999 ? Math.round(v * f) : v;
      },
      pin = sc(h.pin);
    return Object.assign({}, h, {
      nm: BACKNM[8 - i],
      pin: pin,
      end: sc(h.end),
      par: pin < 230 ? 3 : pin <= 440 ? 4 : 5,
      ph: h.ph + 1.7,
      wmax: h.wmax + 3,
      trees: h.trees.map(sc),
      oaks: h.oaks.map(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2),
          x = _ref2[0],
          r = _ref2[1];
        return [sc(x), r];
      }),
      lift: h.lift.map(function (_ref3) {
        var _ref4 = _slicedToArray(_ref3, 4),
          a = _ref4[0],
          b = _ref4[1],
          c2 = _ref4[2],
          d = _ref4[3];
        return [sc(a), sc(b), c2, d];
      }),
      seg: h.seg.map(function (s) {
        return s.length === 3 ? [sc(s[0]), sc(s[1]), s[2]] : s;
      })
    });
  }).reverse();
  var HOLES = FRONT,
    PAR = 36;
  var useCourse = function useCourse(list) {
    HOLES = list;
    PAR = list.reduce(function (a, h) {
      return a + h.par;
    }, 0);
  };
  var rel = function rel(d) {
    return d === 0 ? "E" : d > 0 ? "+" + d : String(d);
  };
  var TRAIL = 14;
  var clamp = function clamp(v, a, b) {
    return v < a ? a : v > b ? b : v;
  };
  var gauss = function gauss() {
    return (Math.random() + Math.random() + Math.random() - 1.5) * 1.15;
  };
  var sm = function sm(t) {
    t = clamp(t, 0, 1);
    return t * t * (3 - 2 * t);
  };
  function hBase(H, x) {
    return (H.amp || 1) * 3.5 * Math.sin(x * 0.019 + H.ph) + (H.amp || 1) * 1.6 * Math.sin(x * 0.051 + H.ph * 2);
  }
  function hgt(H, x) {
    var h = hBase(H, x);
    var ng = sm(1 - (Math.abs(x - H.pin) - 20) / 25);
    h = h * (1 - ng) + hBase(H, H.pin) * ng;
    var nt = sm(1 - (Math.abs(x) - 10) / 15);
    h = h * (1 - nt) + hBase(H, 0) * nt;
    var L = H.lift;
    for (var i = 0; i < L.length; i++) {
      var l = L[i];
      h += l[2] * sm((x - l[0] + l[3]) / l[3]) * sm((l[1] + l[3] - x) / l[3]);
    }
    return h;
  }
  function segAt(H, x) {
    var sg = H.seg;
    for (var i = 0; i < sg.length; i++) if (x >= sg[i][0] && x < sg[i][1]) return sg[i];
    return sg[sg.length - 1];
  }
  function hd(H, x) {
    var g = segAt(H, x),
      h = hgt(H, x);
    if (g[2] === "w") return h - 6 * Math.sin(Math.PI * (x - g[0]) / (g[1] - g[0]));
    if (g[2] === "s") return h - 2 * Math.sin(Math.PI * (x - g[0]) / (g[1] - g[0]));
    return h;
  }
  function lieMult(lie, club) {
    return lie === "r" ? 0.85 : lie === "s" ? club >= WEDGE ? 0.9 : 0.65 : 1;
  }
  function cmax(s, club) {
    return club === CHIP ? clamp(Math.ceil(s.dist / 0.72 / 5) * 5, 10, 95) : CLUBS[club].max;
  }
  function puttLie(s) {
    var l = s.ball.lie;
    return l === "s" ? 0.4 : l === "r" || l === "w" ? 1 / 3 : 1;
  }
  function needPow(s, club) {
    if (club === PUT) return (s.dist + 0.3) / puttLie(s) / s.pmax;
    var cl = CLUBS[club],
      M = cmax(s, club) * lieMult(s.ball.lie, club);
    var a = s.wind * s.wdir * s.dir * 0.55 * cl.wk;
    var D = (s.dist - 0.25 * a) / (1 + cl.roll * 0.5 + a / 200);
    return Math.max(0.02, D) / M;
  }
  function target(s) {
    return clamp(needPow(s, s.club), 0.02, 1);
  }
  function tBar(s) {
    return s.club === PUT ? target(s) : SW + (1 - SW) * target(s);
  }
  function autoClub(s) {
    if (s.ball.lie === "g") return PUT;
    if (s.dist < 72) return CHIP;
    for (var c = WEDGE; c >= 0; c--) if (needPow(s, c) <= 0.88) return c;
    return 0;
  }
  function zonePow(s, bar) {
    var tb = tBar(s),
      e = bar - tb,
      span = s.club === PUT ? 1 : 1 - SW;
    if (Math.abs(e) <= ZONE) return {
      p: target(s),
      inZ: true,
      e: e / ZONE
    };
    return {
      p: clamp(target(s) + (e - Math.sign(e) * ZONE) / span, 0.01, 1),
      inZ: false,
      e: e / ZONE
    };
  }
  function camTarget(G) {
    var s = G.s,
      view = G.W / s.zoom,
      fr = s.phase === "fly" || s.phase === "roll" ? 0.5 : 0.28;
    return s.ball.x - view * (s.dir > 0 ? fr : 1 - fr);
  }
  function panelH(G) {
    return clamp(Math.round(G.H * 0.26), 140, 164);
  }
  function panelY(G) {
    return G.H - panelH(G);
  }
  function say(s, txt, col) {
    s.msg = txt;
    s.msgC = col || "#ffd23f";
    s.msgT = 1.7;
  }
  function startHole(G, i) {
    var s = G.s,
      H = HOLES[i];
    s.hole = i;
    s.H = H;
    s.strokes = 0;
    s.card = null;
    s.inHole = false;
    s.wind = Math.round(Math.random() * H.wmax);
    s.wdir = Math.random() < 0.5 ? -1 : 1;
    s.ball.x = 0;
    s.ball.y = hd(H, 0);
    s.side = false;
    setupShot(G, true);
    say(s, "".concat(i + 1, ": ").concat(H.nm), "#fff");
    s.msgT = 2.2;
  }
  function setupShot(G, snap) {
    var s = G.s,
      H = s.H,
      b = s.ball;
    b.lie = segAt(H, b.x)[2];
    if (s.side && (b.lie === "f" || b.lie === "g" || b.lie === "t")) b.lie = "r";
    s.side = false;
    b.y = hd(H, b.x);
    s.dist = Math.abs(H.pin - b.x);
    s.dir = H.pin >= b.x ? 1 : -1;
    s.dogX = b.x;
    s.pmax = Math.max(2, (s.dist + 0.3) / puttLie(s) / 0.6);
    s.club = autoClub(s);
    s.phase = "aim";
    s.meter = s.club === PUT ? 0 : SW;
    s.mt = 0;
    s.power = -1;
    s.pbar = -1;
    s.inZ = false;
    s.acc = -1;
    s.face = ":dawgW:";
    s.swing = 0;
    s.zoomT = b.lie === "g" || s.dist < 25 ? G.W / 45 : s.dist < 70 ? G.W / 110 : G.W / 200;
    s.tn = 0;
    s.ff = false;
    if (b.lie === "g" && s.dist < 1) {
      s.strokes++;
      b.x = H.pin;
      say(s, "GIMME! TAP-IN", "#7dff8a");
      s.inHole = true;
      s.face = ":dawgW:";
      G.sfx("pop");
      s.phase = "wait";
      s.wt = 0.6;
    }
    if (snap) {
      s.zoom = s.zoomT;
      s.cam = camTarget(G);
      s.camH = b.y;
    }
  }
  function cycleClub(G) {
    var s = G.s;
    if (s.phase !== "aim") return;
    s.club = (s.club + 1) % CLUBS.length;
    s.meter = s.club === PUT ? 0 : SW;
    s.mt = 0;
    G.sfx("pop");
  }
  function clubLabel(s) {
    if (s.club === PUT) return "CLUB: PUTTER \xB7 ".concat(Math.round(s.pmax * 3), " FT MAX");
    return "CLUB: ".concat(CLUBS[s.club].n, " \xB7 ").concat(Math.round(cmax(s, s.club) * lieMult(s.ball.lie, s.club)), " YD MAX");
  }
  function action(G) {
    var s = G.s;
    if (s.phase === "card") {
      if (s.card.age > 0.3) s.card.t = 0;
      return;
    }
    if (s.phase === "fly" || s.phase === "roll") {
      s.ff = true;
      return;
    }
    if (s.phase === "wait") {
      s.wt = Math.min(s.wt, 0.12);
      return;
    }
    if (s.phase === "aim") {
      if (s.club === PUT) {
        lockPower(G);
        strike(G);
      } else {
        s.phase = "up";
        s.meter = SW;
      }
    } else if (s.phase === "up") {
      lockPower(G);
      s.phase = "down";
    } else if (s.phase === "down") {
      s.acc = s.meter;
      strike(G);
    }
  }
  function lockPower(G) {
    var s = G.s,
      z = zonePow(s, s.meter);
    s.pbar = s.meter;
    s.power = z.p;
    s.inZ = z.inZ;
    s.pe = z.e;
    if (z.inZ) G.sfx("pop");
  }
  function strike(G) {
    var s = G.s,
      H = s.H,
      b = s.ball,
      cl = CLUBS[s.club];
    s.strokes++;
    s.dogX = b.x;
    s.tn = 0;
    s.trailN = 0;
    if (s.club === PUT) {
      var tb = tBar(s),
        k = Math.max(0, s.dist - 1),
        off = s.pbar - tb;
      var travel = s.dist + 0.3 + clamp(off / ZONE, -1, 1) * k * 0.15 + gauss() * k * 0.05;
      if (!s.inZ) travel += (off - Math.sign(off) * ZONE) * s.pmax * puttLie(s);
      var r = Math.max(0.2, travel) / puttLie(s) * (b.lie === "s" ? 0.4 : 1);
      s.roll = {
        r: r,
        putt: true
      };
      s.phase = "roll";
      G.sfx("pop");
      return;
    }
    var e = clamp((s.acc - SW) / SWW, -1, 1);
    var miss = Math.max(0, Math.abs(e) - 0.25) / 0.75;
    var want = cmax(s, s.club) * s.power * lieMult(b.lie, s.club),
      sig = Math.max(0.04, 1.6 / Math.max(1, want));
    var scat = 1 + gauss() * sig + clamp(s.pe || 0, -1, 1) * Math.max(0.04, 1 / Math.max(1, want)) * (s.inZ ? 1 : 0);
    var D = Math.max(2, cmax(s, s.club) * s.power * lieMult(b.lie, s.club) * (1 - 0.18 * miss) * scat);
    s.side = Math.abs(e) > 0.6;
    if (s.side) {
      say(s, e > 0 ? "SLICE!" : "HOOK!", "#ff8a65");
      s.face = ":dawgcope:";
    } else if (Math.abs(e) <= 0.25) {
      say(s, "PERFECT!", "#7dff8a");
      s.face = ":dawgpog:";
    } else s.face = ":dawgW:";
    var drift = s.wind * s.wdir * 0.55 * (D / 200 + 0.25) * cl.wk;
    s.fly = {
      x0: b.x,
      D: D,
      drift: drift,
      h0: hd(H, b.x),
      apex: D * cl.loft,
      T: 0.6 + D / 260,
      t: 0,
      hit: false
    };
    var xl = clamp(b.x + s.dir * D + drift, -55, H.end + 60);
    s.fly.drift = xl - b.x - s.dir * D;
    s.fly.h1 = hd(H, xl);
    s.phase = "fly";
    G.sfx("pop");
  }
  function splash(G, g, dirTravel) {
    var s = G.s,
      b = s.ball;
    s.strokes++;
    say(s, "SPLASH! +1", "#8fd0ff");
    s.face = ":dawgpain:";
    G.sfx("lose");
    G.buzz();
    b.x = dirTravel > 0 ? g[0] - 3 : g[1] + 3;
    b.y = hd(s.H, b.x);
    s.phase = "wait";
    s.wt = 1.1;
    s.side = false;
  }
  function holed(G) {
    var s = G.s;
    s.ball.x = s.H.pin;
    s.inHole = true;
    s.side = false;
    var st = s.strokes;
    say(s, st === 1 ? "HOLE IN ONE!!" : "IN THE HOLE!", "#ffd23f");
    s.face = ":dawgpog:";
    G.sfx("win");
    s.phase = "wait";
    s.wt = 0.8;
  }
  function stopBall(G, sand) {
    var s = G.s;
    if (sand) {
      say(s, "BUNKER!", "#f2dc8c");
      s.face = ":dawgsweat:";
    }
    s.phase = "wait";
    s.wt = 0.55;
  }
  function land(G) {
    var s = G.s,
      H = s.H,
      b = s.ball,
      f = s.fly,
      g = segAt(H, b.x);
    if (g[2] === "g" && Math.abs(b.x - H.pin) < 0.2) {
      holed(G);
      return;
    }
    if (g[2] === "w") {
      splash(G, g, s.dir);
      return;
    }
    if (g[2] === "s") {
      b.y = hd(H, b.x);
      stopBall(G, true);
      return;
    }
    var cl = CLUBS[s.club];
    if (f.dead) {
      s.roll = {
        r: 0,
        putt: false
      };
      s.phase = "roll";
      return;
    }
    var k = (g[2] === "r" || s.side ? 0.35 : g[2] === "g" ? 0.5 : 1) * (f.bank ? 0.2 : 1);
    s.roll = {
      r: f.D * cl.roll * k,
      putt: false
    };
    s.phase = "roll";
  }
  function holeName(st, d) {
    return st === 1 ? "HOLE IN ONE!" : d <= -3 ? "ALBATROSS!" : d === -2 ? "EAGLE!" : d === -1 ? "BIRDIE!" : d === 0 ? "PAR" : d === 1 ? "BOGEY" : d === 2 ? "DOUBLE BOGEY" : d === 3 ? "TRIPLE BOGEY" : "+".concat(d);
  }
  function endHole(G, pickup) {
    var s = G.s,
      st = Math.min(8, s.strokes),
      d = st - s.H.par;
    s.totStrokes += st;
    s.parThru += s.H.par;
    s.scores.push(st);
    s.card = {
      name: pickup ? "PICKED UP" : holeName(st, d),
      d: d,
      st: st,
      t: s.hole < HOLES.length - 1 ? 3.2 : 4,
      age: 0
    };
    s.phase = "card";
    if (d <= -1) G.sfx("win");
  }
  function overTitle(tot, d) {
    if (d <= -2) return "".concat(-d, " under! Tour card incoming.");
    if (d === -1) return "1 under. Dawg's got game.";
    if (d === 0) return "Even par. Clutch.";
    if (d <= 3) return "Shot ".concat(tot, ". So close to par!");
    if (d <= 9) return "Shot ".concat(tot, ". Bogey golf!");
    if (d <= 18) return "Shot ".concat(tot, ". Weekend hacker.");
    return "Shot ".concat(tot, ". Grip it and rip it.");
  }
  function nextHole(G) {
    var s = G.s;
    if (s.hole >= HOLES.length - 1) {
      var tot = s.totStrokes,
        d = tot - PAR;
      s.phase = "done";
      G.over(tot, overTitle(tot, d));
      return;
    }
    startHole(G, s.hole + 1);
  }
  function ballStep(G, dt) {
    var s = G.s,
      H = s.H,
      b = s.ball;
    if (s.phase === "fly") {
      var f = s.fly;
      f.t += dt;
      var u = Math.min(1, f.t / f.T),
        px = b.x;
      b.x = f.x0 + s.dir * f.D * u + f.drift * u * u;
      b.y = f.h0 + (f.h1 - f.h0) * u + 4 * f.apex * u * (1 - u);
      s.trailX[s.trailI] = b.x;
      s.trailY[s.trailI] = b.y;
      s.trailI = (s.trailI + 1) % TRAIL;
      s.trailN = Math.min(TRAIL, s.trailN + 1);
      if (!f.hit && !f.dead) {
        var ok = H.oaks;
        for (var i = 0; i < ok.length; i++) {
          var ox = ok[i][0],
            gy = hd(H, ox);
          if (Math.min(px, b.x) - 2.5 < ox && Math.max(px, b.x) + 2.5 > ox && b.y - gy < ok[i][1] && b.y - gy > 0.5 && Math.abs(ox - f.x0) > 15) {
            f.hit = true;
            say(s, "TIMBER!", "#ff8a65");
            s.face = ":dawgsus:";
            G.sfx("lose");
            G.buzz();
            var back = 4 + Math.random() * 5,
              lx = clamp(ox - s.dir * back, -55, H.end + 60);
            s.fly = {
              x0: b.x,
              D: (lx - b.x) * s.dir,
              drift: 0,
              h0: b.y,
              h1: hd(H, lx),
              apex: 0.6,
              T: 0.4,
              t: 0,
              hit: true,
              dead: true
            };
            return;
          }
        }
        if (u > 0.5 && u < 1 && b.y < hd(H, b.x) - 0.3) {
          b.y = hd(H, b.x);
          f.bank = true;
          land(G);
          return;
        }
      }
      if (u >= 1) {
        b.y = f.h1;
        land(G);
      }
    } else {
      var R = s.roll,
        _px = b.x;
      var g0 = segAt(H, _px)[2];
      var m = g0 === "r" || s.side && g0 !== "s" ? 3 : 1;
      var v = (R.putt ? 3 : 6) + R.r * 2.6;
      var step = Math.min(v * dt, R.r / m);
      b.x = clamp(_px + s.dir * step, -55, H.end + 60);
      R.r -= step * m;
      var g = segAt(H, b.x);
      b.y = hd(H, b.x);
      if (g[2] === "w") {
        splash(G, g, s.dir);
        return;
      }
      if ((_px - H.pin) * (b.x - H.pin) <= 0 && _px !== b.x && R.r < (R.putt ? 0.55 : 0.12)) {
        holed(G);
        return;
      }
      if (g[2] === "s") {
        stopBall(G, true);
        return;
      }
      if (R.r <= 0.001 || b.x <= -55 || b.x >= H.end + 60) {
        if (Math.abs(b.x - H.pin) < 0.25) {
          holed(G);
          return;
        }
        if (R.putt && Math.abs(b.x - H.pin) < 1.5) {
          say(s, "SO CLOSE!", "#ff8a65");
          s.face = ":dawgsweat:";
        }
        stopBall(G, false);
      }
    }
  }
  var golfDef = {
    key: "golf",
    name: "Dawg Golf",
    icon: "🏌️",
    max: 72,
    low: true,
    cat: "sports",
    course: FRONT,
    blurb: "Front nine, par 36. Three-tap swing. Mind the wind.",
    how: "Tap to start the swing, tap again while the marker is in the GREEN ZONE around the PIN flag (it already counts wind, lie and roll) to hit it the right distance, then tap the blue spot on the way back to hit it straight. On the green, one tap in the green zone putts. The club is picked for you; tap the yellow CLUB bar to switch. Water costs a stroke, trees knock the ball down, pick up at 8. Par 36: fewest strokes wins.",
    fmt: function fmt(n) {
      return n > 0 ? "".concat(n, " (").concat(rel(n - 36), ")") : "—";
    },
    save: function save(G) {
      var s = G.s;
      if (s.phase !== "card" || s.hole >= HOLES.length - 1) return null;
      return {
        label: "Hole ".concat(s.hole + 2),
        hole: s.hole,
        tot: s.totStrokes,
        par: s.parThru,
        scores: s.scores.slice()
      };
    },
    load: function load(G, v) {
      var s = G.s;
      s.totStrokes = v.tot;
      s.parThru = v.par;
      s.scores = v.scores.slice();
      startHole(G, v.hole + 1);
    },
    reset: function reset(G) {
      useCourse(this.course);
      G.s = {
        hole: 0,
        parThru: 0,
        totStrokes: 0,
        scores: [],
        ball: {
          x: 0,
          y: 0,
          lie: "t"
        },
        msg: "",
        msgT: 0,
        msgC: "#fff",
        trailX: new Float32Array(TRAIL),
        trailY: new Float32Array(TRAIL),
        trailN: 0,
        trailI: 0,
        tn: 0,
        zoom: 1,
        cam: 0,
        camH: 0
      };
      startHole(G, 0);
    },
    update: function update(G, dt) {
      var s = G.s,
        H = s.H,
        b = s.ball;
      s.tn += dt;
      if (s.msgT > 0) s.msgT -= dt;
      if (s.phase === "aim" || s.phase === "up") s.tbar = tBar(s);
      if (s.phase === "aim" && s.club === PUT) {
        s.mt += dt * SPD;
        var p = s.mt % 2;
        s.meter = p < 1 ? p : 2 - p;
      } else if (s.phase === "up") {
        s.meter += dt * SPD;
        if (s.meter >= 1) {
          s.meter = 1;
          lockPower(G);
          s.phase = "down";
        }
      } else if (s.phase === "down") {
        s.meter -= dt * SPD;
        if (s.meter <= 0) {
          s.meter = 0;
          s.acc = 0;
          strike(G);
        }
      } else if (s.phase === "fly" || s.phase === "roll") {
        var n = s.ff ? 3 : 1;
        for (var i = 0; i < n && (s.phase === "fly" || s.phase === "roll"); i++) ballStep(G, dt);
      } else if (s.phase === "wait") {
        s.wt -= dt;
        if (s.wt <= 0) {
          if (s.inHole) endHole(G, false);else if (s.strokes >= 8) endHole(G, true);else setupShot(G, false);
        }
      } else if (s.phase === "card") {
        s.card.age += dt;
        s.card.t -= dt;
        if (s.card.t <= 0) nextHole(G);
      }
      if (s.phase !== "card" && s.phase !== "done") {
        var k = 1 - Math.exp(-dt * (s.ff ? 7 : 3.5));
        s.zoom += (s.zoomT - s.zoom) * k;
        s.cam += (camTarget(G) - s.cam) * k;
        s.camH += (b.y - s.camH) * (1 - Math.exp(-dt * 2));
      }
    },
    tap: function tap(G, x, y) {
      var s = G.s;
      var py = panelY(G);
      if (s.phase === "aim" && y > py + 2 && y < py + 58) {
        cycleClub(G);
        return;
      }
      action(G);
    },
    onKey: function onKey(G, k, isDown) {
      if (!isDown) return;
      if (k === " " || k === "ArrowDown" || k === "Enter") action(G);else if (k === "c" || k === "ArrowUp") cycleClub(G);
    },
    draw: function draw(G, c) {
      var s = G.s,
        W = G.W,
        Hh = G.H,
        H = s.H,
        dark = G.dark(),
        b = s.ball;
      var sc = s.zoom,
        cam = s.cam,
        baseY = Math.min(Hh * 0.66, Hh - panelH(G) - 34);
      var SX = function SX(x) {
          return (x - cam) * sc;
        },
        SY = function SY(h) {
          return baseY - (h - s.camH) * sc;
        };
      var gr = c.createLinearGradient(0, 0, 0, baseY);
      gr.addColorStop(0, dark ? "#0d1b3d" : "#4fbef7");
      gr.addColorStop(1, dark ? "#33497f" : "#c8eeff");
      c.fillStyle = gr;
      c.fillRect(0, 0, W, Hh);
      if (dark) {
        c.fillStyle = "#f4f1d0";
        c.beginPath();
        c.arc(W - 60, 128, 16, 0, 7);
        c.fill();
        c.fillStyle = "#33497f";
        c.beginPath();
        c.arc(W - 52, 123, 14, 0, 7);
        c.fill();
      } else {
        c.fillStyle = "#fff3a0";
        c.fillRect(W - 76, 112, 32, 32);
        c.fillStyle = "#ffe066";
        c.fillRect(W - 72, 116, 24, 24);
      }
      c.fillStyle = dark ? "rgba(200,210,255,0.18)" : "rgba(255,255,255,0.9)";
      for (var i = 0; i < 5; i++) {
        var span = W + 140,
          cx = ((i * 157 - cam * sc * 0.15 - G.t * 6) % span + span) % span - 70,
          cy = 70 + i * 37 % 70;
        c.fillRect(cx, cy, 60, 12);
        c.fillRect(cx + 12, cy - 8, 32, 8);
        c.fillRect(cx - 6, cy + 4, 72, 8);
      }
      c.fillStyle = dark ? "#1d3550" : "#8fd19a";
      for (var sx = 0; sx < W; sx += 6) {
        var wx = sx + cam * sc * 0.3;
        var hy = baseY - 50 - 22 * Math.sin(wx * 0.011) - 10 * Math.sin(wx * 0.031);
        c.fillRect(sx, hy, 6, Hh - hy);
      }
      c.fillStyle = dark ? "#1a3a30" : "#67b874";
      for (var _sx = 0; _sx < W; _sx += 6) {
        var _wx = _sx + cam * sc * 0.5;
        var _hy = baseY - 22 - 14 * Math.sin(_wx * 0.017 + 1) - 6 * Math.sin(_wx * 0.05);
        c.fillRect(_sx, _hy, 6, Hh - _hy);
      }
      var tsz = clamp(sc * 14, 30, 56);
      for (var _i = 0; _i < H.trees.length; _i++) {
        var tx = SX(H.trees[_i]);
        if (tx > -40 && tx < W + 40) G.emoji(c, _i % 2 ? "🌲" : "🌳", tx, SY(hd(H, H.trees[_i])) - tsz * 0.42, tsz);
      }
      var soil = dark ? "#4a3018" : "#8a5a2b",
        soil2 = dark ? "#3a2412" : "#734a22";
      for (var _sx2 = 0; _sx2 < W + 3; _sx2 += 3) {
        var _wx2 = cam + (_sx2 + 1.5) / sc,
          g = segAt(H, _wx2),
          t = g[2],
          y = SY(hd(H, _wx2));
        if (t === "w") {
          var surf = SY(Math.min(hgt(H, g[0]), hgt(H, g[1])) - 0.8);
          c.fillStyle = soil;
          c.fillRect(_sx2, y, 3, Hh - y);
          if (surf < y) {
            c.fillStyle = dark ? "#1d4f99" : "#3a8ee8";
            c.fillRect(_sx2, surf, 3, y - surf);
            c.fillStyle = dark ? "#4a7fd0" : "#9ad6ff";
            if ((Math.floor(_sx2 / 3) + Math.floor(G.t * 3)) % 4 === 0) c.fillRect(_sx2, surf, 3, 2);
          }
          continue;
        }
        var col = void 0;
        if (t === "f" || t === "t") col = Math.floor(_wx2 / 8) % 2 ? dark ? "#2f7a2a" : "#5fcf4a" : dark ? "#29702a" : "#52bd3f";else if (t === "g") col = Math.floor(_wx2 / 4) % 2 ? dark ? "#3e9a36" : "#7ee36a" : dark ? "#3a9032" : "#74d860";else if (t === "s") col = dark ? "#b8a660" : "#f2dc8c";else col = dark ? "#245a20" : "#3f9a35";
        c.fillStyle = col;
        c.fillRect(_sx2, y, 3, 9);
        c.fillStyle = soil;
        c.fillRect(_sx2, y + 9, 3, Hh - y - 9);
        c.fillStyle = soil2;
        if (Math.floor(_wx2 * 1.7) % 5 === 0) c.fillRect(_sx2, y + 18 + Math.floor(_wx2) % 3 * 8, 3, 3);
        if (t === "r" && Math.floor(_wx2 * 1.3) % 3 === 0) {
          c.fillStyle = dark ? "#2e6d28" : "#2f7f27";
          c.fillRect(_sx2, y - 3, 3, 3);
        }
      }
      for (var _i2 = 0; _i2 < H.oaks.length; _i2++) {
        var ox = H.oaks[_i2][0],
          oh = H.oaks[_i2][1],
          X = SX(ox),
          R = Math.max(12, 3.6 * sc);
        if (X < -R - 10 || X > W + R + 10) continue;
        var Y = SY(hd(H, ox)),
          top = SY(hd(H, ox) + oh),
          tw = Math.max(4, 1.1 * sc);
        c.fillStyle = dark ? "#4a2e14" : "#6b4220";
        c.fillRect(X - tw / 2, top + R, tw, Y - top - R);
        var rows = [[0, 0.7], [0.45, 1], [0.95, 1], [1.4, 0.75]];
        for (var r = 0; r < rows.length; r++) {
          var hw = R * rows[r][1],
            yy = top + r * R * 0.5;
          c.fillStyle = dark ? "#1f5a22" : "#2f8f34";
          c.fillRect(X - hw, yy, hw * 2, R * 0.55);
          c.fillStyle = dark ? "#2b7230" : "#43ad47";
          c.fillRect(X - hw, yy, hw * 0.9, R * 0.25);
        }
      }
      for (var _i3 = 0, _arr = [-9, 6]; _i3 < _arr.length; _i3++) {
        var _tx = _arr[_i3];
        var _X = SX(_tx),
          _Y = SY(hd(H, _tx));
        if (_X > -10 && _X < W + 10) {
          c.fillStyle = _tx < 0 ? "#e84040" : "#3f6fe8";
          c.fillRect(_X - 3, _Y - 6, 6, 6);
        }
      }
      var PX = SX(H.pin),
        PY = SY(hd(H, H.pin));
      c.fillStyle = "#111";
      c.fillRect(PX - 5, PY - 1, 10, 3);
      c.fillStyle = "#fff";
      c.fillRect(PX - 1, PY - 46, 3, 46);
      var fl = (s.wdir || 1) * (12 + s.wind * 0.9),
        wv = Math.sin(G.t * 6) * 2;
      c.fillStyle = "#ff3b3b";
      c.beginPath();
      c.moveTo(PX + 1, PY - 46);
      c.lineTo(PX + 1 + fl, PY - 40 + wv);
      c.lineTo(PX + 1, PY - 33);
      c.fill();
      var dX = SX(s.dogX),
        dY = SY(hd(H, s.dogX)),
        dir = s.dir;
      if (dX > -40 && dX < W + 40) {
        var k = 0;
        if (s.phase === "aim" && s.club === PUT) k = s.meter * 0.35;else if (s.phase === "up" || s.phase === "down") k = clamp((s.meter - SW) / (1 - SW), 0, 1);else if (s.phase === "fly" || (s.phase === "roll" || s.phase === "wait") && !s.inHole && s.tn < 1.2) k = -0.8;
        var base = dir > 0 ? Math.PI / 2 - 0.5 : Math.PI / 2 + 0.5,
          ang = base + dir * k * 2.6;
        var shx = dX - dir * 12,
          shy = dY - 22,
          len = s.club === PUT ? 20 : 25;
        var hx = shx + Math.cos(ang) * len,
          _hy2 = shy + Math.sin(ang) * len;
        c.strokeStyle = "#ddd";
        c.lineWidth = 2;
        c.beginPath();
        c.moveTo(shx, shy);
        c.lineTo(hx, _hy2);
        c.stroke();
        c.fillStyle = CLUBS[s.club].head;
        c.fillRect(hx - 4, _hy2 - 2, 8, 5);
        G.img(c, s.face || ":dawgW:", dX - dir * 18, dY - 21, 40);
      }
      if (s.phase === "fly" || s.phase === "roll" && s.tn < 2) {
        c.fillStyle = dark ? "rgba(255,255,255,0.35)" : "rgba(255,255,255,0.7)";
        for (var _i4 = 0; _i4 < s.trailN; _i4++) {
          var j = (s.trailI - 1 - _i4 + TRAIL * 2) % TRAIL;
          if (_i4 % 2) continue;
          c.fillRect(SX(s.trailX[j]) - 1, SY(s.trailY[j]) - 1, 3, 3);
        }
      }
      if (!s.inHole) {
        var bx = SX(b.x),
          by = SY(b.y),
          gy = SY(hd(H, b.x));
        if (s.phase === "fly") {
          c.fillStyle = "rgba(0,0,0,0.3)";
          c.fillRect(bx - 4, gy - 1, 8, 3);
        }
        c.fillStyle = "#222";
        c.fillRect(bx - 4, by - 8, 8, 8);
        c.fillStyle = "#fff";
        c.fillRect(bx - 3, by - 7, 6, 6);
        if (by - 8 < 92) {
          c.fillStyle = "#fff";
          c.beginPath();
          c.moveTo(bx, 93);
          c.lineTo(bx - 6, 102);
          c.lineTo(bx + 6, 102);
          c.fill();
        }
      }
      if (PX > W - 6 || PX < 6) {
        var ex = PX > W ? W - 24 : 24,
          ey = Math.min(baseY - 30, Hh - panelH(G) - 40);
        G.emoji(c, "⛳", ex, ey, 22);
        G.text(c, "".concat(Math.round(s.dist || 0)), ex, ey + 20, 10, "#fff", "center");
      }
      var rd0 = s.totStrokes - s.parThru;
      G.hud(c, "HOLE ".concat(s.hole + 1, "/").concat(HOLES.length), "PAR ".concat(H.par), s.scores.length ? "TOT ".concat(rel(rd0)) : "TOT E");
      {
        var x0 = -20,
          x1 = H.end,
          _mw = W - 20,
          mxp = function mxp(x) {
            return 10 + (x - x0) / (x1 - x0) * _mw;
          },
          _my = 62;
        c.fillStyle = "rgba(0,0,0,0.3)";
        c.fillRect(6, 37, W - 12, 28);
        for (var px = 0; px < _mw; px += 3) {
          var _wx3 = x0 + (px + 1.5) / _mw * (x1 - x0),
            _t = segAt(H, _wx3)[2],
            _hy3 = Math.round(hd(H, _wx3) * 0.45);
          c.fillStyle = _t === "w" ? "#3a8ee8" : _t === "s" ? "#f2dc8c" : _t === "g" ? "#7ee36a" : _t === "f" || _t === "t" ? "#52bd3f" : "#2f7f27";
          c.fillRect(10 + px, _my - 6 - _hy3, 3, 6 + _hy3);
        }
        c.fillStyle = "#1c4d1f";
        for (var _i5 = 0; _i5 < H.oaks.length; _i5++) {
          var _X2 = mxp(H.oaks[_i5][0]);
          c.fillRect(_X2 - 2, _my - 13 - hd(H, H.oaks[_i5][0]) * 0.45, 4, 6);
        }
        var fx = mxp(H.pin),
          fy = _my - 6 - hd(H, H.pin) * 0.45;
        c.fillStyle = "#fff";
        c.fillRect(fx, fy - 11, 1, 11);
        c.fillStyle = "#ff3b3b";
        c.fillRect(fx + 1, fy - 11, 5, 4);
        if (!s.inHole) {
          var _bx = mxp(clamp(b.x, x0, x1)),
            _by = _my - 6 - b.y * 0.45;
          c.fillStyle = "#000";
          c.fillRect(_bx - 3, _by - 4, 7, 7);
          c.fillStyle = "#fff";
          c.fillRect(_bx - 2, _by - 3, 5, 5);
        }
      }
      c.fillStyle = "rgba(0,0,0,0.55)";
      c.fillRect(0, 67, W, 22);
      var onG = s.club === PUT || b.lie === "g" && s.dist < 25;
      G.text(c, onG ? "".concat(Math.round(s.dist * 3), " FT") : "".concat(Math.round(s.dist), " YD"), 10, 78, 10, "#7dff8a", "left");
      G.text(c, "SHOT ".concat(Math.min(8, s.strokes + 1)), W / 2, 78, 10, "#fff", "center");
      if (s.wind === 0) G.text(c, "CALM", W - 10, 78, 10, "#bfe9ff", "right");else {
        G.text(c, "".concat(s.wind, "MPH"), W - 10, 78, 10, "#bfe9ff", "right");
        var ax = W - 72 - (s.wind > 9 ? 10 : 0),
          ay = 78;
        c.fillStyle = "#bfe9ff";
        c.fillRect(ax - 9, ay - 2, 16, 4);
        c.beginPath();
        if (s.wdir > 0) {
          c.moveTo(ax + 12, ay);
          c.lineTo(ax + 4, ay - 6);
          c.lineTo(ax + 4, ay + 6);
        } else {
          c.moveTo(ax - 14, ay);
          c.lineTo(ax - 6, ay - 6);
          c.lineTo(ax - 6, ay + 6);
        }
        c.fill();
      }
      if (s.msgT > 0 && s.phase !== "card") G.banner(c, s.msg, s.msgC, 116, s.msg.length > 12 ? 16 : 20);
      var PH = panelH(G),
        py = Hh - PH;
      c.fillStyle = dark ? "rgba(0,0,0,0.6)" : "rgba(0,0,0,0.45)";
      c.fillRect(0, py, W, PH);
      var canClub = s.phase === "aim";
      c.fillStyle = canClub ? "#ffd23f" : "#8a7a3a";
      c.fillRect(10, py + 6, W - 20, 48);
      c.fillStyle = canClub ? "#b8901a" : "#5a4f26";
      c.fillRect(10, py + 50, W - 20, 4);
      var cl = clubLabel(s),
        csz = cl.length > 26 ? 10 : 11;
      G.text(c, cl, W / 2, py + 21, csz, "#2a1a00", "center");
      G.text(c, "".concat(LIE[b.lie] || "", " LIE").concat(canClub ? " · TAP TO SWITCH" : ""), W / 2, py + 39, 10, "#5a3d00", "center");
      var mx = 14,
        mw = W - 28,
        my = py + 64,
        mh = Math.min(48, PH - 100),
        M = function M(v) {
          return mx + clamp(v, 0, 1) * mw;
        };
      var swinging = s.phase === "aim" || s.phase === "up" || s.phase === "down";
      c.fillStyle = "#111";
      c.fillRect(mx - 3, my - 3, mw + 6, mh + 6);
      c.fillStyle = "#3a3a4a";
      c.fillRect(mx, my, mw, mh);
      var tb = tBar(s),
        z0 = M(tb - ZONE),
        z1 = M(tb + ZONE);
      c.fillStyle = "#2f9e3a";
      c.fillRect(z0, my, z1 - z0, mh);
      c.fillStyle = "#4fd35a";
      c.fillRect(z0, my, z1 - z0, 5);
      if (s.club === PUT) {
        c.fillStyle = "rgba(255,210,63,0.75)";
        c.fillRect(mx, my + mh * 0.3, s.meter * mw, mh * 0.4);
      } else {
        c.fillStyle = "#2a6fb8";
        c.fillRect(M(SW - SWW * 0.5), my, SWW * mw, mh);
        c.fillStyle = "#5ec8ff";
        c.fillRect(M(SW - SWW * 0.25), my, SWW * 0.5 * mw, mh);
        var fillTo = s.phase === "down" ? s.pbar : s.phase === "up" ? s.meter : 0;
        c.fillStyle = "rgba(255,210,63,0.75)";
        c.fillRect(M(SW), my + mh * 0.3, Math.max(0, fillTo - SW) * mw, mh * 0.4);
      }
      var TX = M(tb);
      c.fillStyle = "#fff";
      c.fillRect(TX - 1.5, my - 4, 3, mh + 8);
      c.fillStyle = "#ff3b3b";
      c.beginPath();
      c.moveTo(TX + 1, my - 18);
      c.lineTo(TX + 13, my - 13);
      c.lineTo(TX + 1, my - 8);
      c.fill();
      c.fillStyle = "#fff";
      c.fillRect(TX, my - 20, 2, 16);
      var lblR = TX + 60 < W;
      G.text(c, "PIN", lblR ? TX + 16 : TX - 4, my - 13, 10, "#fff", lblR ? "left" : "right");
      if (s.phase === "down" && s.club !== PUT) {
        c.fillStyle = s.inZ ? "#7dff8a" : "#ff8a3b";
        c.fillRect(M(s.pbar) - 3, my - 3, 6, mh + 6);
      }
      if (swinging) {
        c.fillStyle = "#111";
        c.fillRect(M(s.meter) - 4, my - 7, 9, mh + 14);
        c.fillStyle = "#fff";
        c.fillRect(M(s.meter) - 2, my - 5, 5, mh + 10);
      }
      var hint = s.phase === "aim" ? s.club === PUT ? "TAP IN THE GREEN ZONE" : "TAP TO START SWING" : s.phase === "up" ? "TAP IN THE GREEN ZONE" : s.phase === "down" ? s.inZ ? "NICE! NOW TAP THE BLUE" : "TAP ON THE BLUE SPOT" : "";
      if (hint) G.text(c, hint, W / 2, my + mh + 18, 10, Math.floor(G.t * 2.5) % 2 && s.phase === "aim" ? "#ffd23f" : "#fff", "center");
      if (s.hole === 0 && s.strokes === 0) G.hint(c, "3 TAPS: GO · POWER · AIM", 7, 152);
      if (s.phase === "card" && s.card) {
        var cw = Math.min(W - 16, 350),
          _cx = (W - cw) / 2,
          ch = 244,
          _cy = Math.max(84, Hh * 0.2);
        c.fillStyle = "#ffd23f";
        c.fillRect(_cx - 4, _cy - 4, cw + 8, ch + 8);
        c.fillStyle = dark ? "#111a33" : "#1d2a55";
        c.fillRect(_cx, _cy, cw, ch);
        var cd = s.card.d,
          _col = cd < 0 ? "#7dff8a" : cd === 0 ? "#fff" : "#ff8a65";
        G.img(c, cd <= 0 ? ":dawgpog:" : ":dawgcope:", _cx + 24, _cy + 26, 30);
        G.text(c, s.card.name, W / 2 + 14, _cy + 26, s.card.name.length > 10 ? 12 : 15, "#ffd23f", "center");
        G.text(c, "".concat(s.card.st, " STROKES \xB7 PAR ").concat(H.par), W / 2, _cy + 54, 10, _col, "center");
        var lw = 48,
          colW = (cw - lw - 12) / 9,
          gx = _cx + 6,
          _gy = _cy + 74,
          rh = 24;
        c.fillStyle = "rgba(255,255,255,0.08)";
        c.fillRect(gx, _gy, cw - 12, rh * 3);
        G.text(c, "HOLE", gx + 4, _gy + rh * 0.5, 10, "#9fb0d8", "left");
        G.text(c, "PAR", gx + 4, _gy + rh * 1.5, 10, "#9fb0d8", "left");
        G.text(c, "DAWG", gx + 4, _gy + rh * 2.5, 10, "#ffd23f", "left");
        var nine = HOLES.length > 9 && s.hole >= 9 ? 9 : 0;
        for (var _i6 = nine; _i6 < Math.min(HOLES.length, nine + 9); _i6++) {
          var _X3 = gx + lw + colW * (_i6 - nine + 0.5);
          if (_i6 === s.hole) {
            c.fillStyle = "rgba(255,210,63,0.18)";
            c.fillRect(_X3 - colW / 2, _gy, colW, rh * 3);
          }
          G.text(c, String(_i6 + 1), _X3, _gy + rh * 0.5, 10, "#9fb0d8", "center");
          G.text(c, String(HOLES[_i6].par), _X3, _gy + rh * 1.5, 10, "#fff", "center");
          if (_i6 < s.scores.length) {
            var st = s.scores[_i6],
              dd = st - HOLES[_i6].par,
              _Y2 = _gy + rh * 2.5;
            var cc = dd < 0 ? "#7dff8a" : dd === 0 ? "#fff" : dd === 1 ? "#ffb08a" : "#ff6a5a";
            c.strokeStyle = cc;
            c.lineWidth = 1.5;
            if (dd < 0) {
              c.beginPath();
              c.arc(_X3, _Y2, 8.5, 0, 7);
              c.stroke();
              if (dd < -1) {
                c.beginPath();
                c.arc(_X3, _Y2, 11, 0, 7);
                c.stroke();
              }
            } else if (dd > 0) {
              c.strokeRect(_X3 - 8, _Y2 - 8, 16, 16);
              if (dd > 1) c.strokeRect(_X3 - 10.5, _Y2 - 10.5, 21, 21);
            }
            G.text(c, String(st), _X3 + 0.5, _Y2 + 1, 10, cc, "center");
          }
        }
        var rd = s.totStrokes - s.parThru,
          rc = rd < 0 ? "#7dff8a" : rd === 0 ? "#fff" : "#ff8a65";
        G.text(c, "TOTAL ".concat(s.totStrokes, "  (").concat(rel(rd), ")"), W / 2, _cy + 168, 12, rc, "center");
        G.text(c, s.scores.length < HOLES.length ? "THRU ".concat(s.scores.length, " \xB7 NEXT: PAR ").concat(HOLES[s.hole + 1].par) : "ROUND COMPLETE", W / 2, _cy + 192, 10, "#bbb", "center");
        if (s.card.age > 0.3) G.text(c, s.hole < HOLES.length - 1 ? "TAP FOR NEXT HOLE" : "TAP TO FINISH", W / 2, _cy + 222, 10, Math.floor(G.t * 2.5) % 2 ? "#ffd23f" : "#fff", "center");
      }
    }
  };
  defGame(golfDef);
  var BPAR = 36 + BACK.reduce(function (a, h) {
    return a + h.par;
  }, 0);
  defGame(Object.assign({}, golfDef, {
    key: "golf18",
    name: "Dawg Golf 18",
    icon: "🏌️",
    max: 144,
    course: FRONT.concat(BACK),
    blurb: "The full 18, par ".concat(BPAR, ". Back nine plays longer and windier."),
    how: golfDef.how.replace("Par 36", "Par ".concat(BPAR, " over 18 holes")),
    fmt: function fmt(n) {
      return n > 0 ? "".concat(n, " (").concat(rel(n - BPAR), ")") : "—";
    }
  }));
})();