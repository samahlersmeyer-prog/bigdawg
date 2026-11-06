function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, e) { if ("object" != _typeof(t) || !t) return t; var r; if ("undefined" != typeof Symbol && void 0 !== (r = t[Symbol.toPrimitive])) { var i = r.call(t, e || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === e ? String : Number)(t); }
(function () {
  var PTS = [0, 50, 40, 30, 20, 10, 5];
  var MAXS = 6;
  var FLASH = 2.8;
  var R = function R(a, b, c, d) {
    return [[a, b], [c, b], [c, d], [a, d]];
  };
  var FRONT = [{
    name: "STRAIGHT SHOT",
    par: 2,
    out: R(.22, .08, .78, .94),
    tee: [.5, .84],
    cup: [.5, .2],
    tip: "NICE AND EASY",
    deco: [["dog", .11, .6], ["🌻", .89, .28], ["🦴", .9, .78], ["🌼", .1, .2]]
  }, {
    name: "DOG-LEG",
    pw: 1.3,
    par: 3,
    out: [[.1, .94], [.42, .94], [.42, .42], [.9, .42], [.9, .08], [.1, .08]],
    tee: [.26, .84],
    cup: [.76, .24],
    tip: "BANK IT AROUND THE CORNER",
    deco: [["🌷", .7, .62], ["🐿️", .8, .84], ["🌼", .58, .76], ["🥏", .92, .95]]
  }, {
    name: "BANK SHOT",
    pw: 1.45,
    par: 3,
    out: R(.1, .08, .9, .94),
    blocks: [[.1, .47, .62, .53]],
    tee: [.26, .84],
    cup: [.24, .2],
    tip: "USE THE WALLS"
  }, {
    name: "DOG HOUSE",
    par: 2,
    out: R(.18, .08, .82, .94),
    movers: [{
      kind: "house",
      u: .5,
      v: .5,
      w: .3,
      h: .09,
      amp: .11,
      sp: 1.6
    }],
    tee: [.5, .85],
    cup: [.5, .18],
    tip: "TIME IT PAST THE HOUSE",
    deco: [["🌻", .08, .3], ["🦴", .91, .7], ["🌷", .09, .82]]
  }, {
    name: "NAP TIME",
    pw: 1.15,
    par: 3,
    out: R(.12, .08, .88, .94),
    sand: [[.28, .26, .72, .36]],
    dogs: [[.5, .58, .11]],
    tee: [.5, .86],
    cup: [.5, .17],
    tip: "LET SLEEPING DOGS LIE"
  }, {
    name: "THE POND",
    pw: 1.15,
    par: 3,
    out: R(.1, .08, .9, .94),
    water: [[.1, .42, .64, .6]],
    tee: [.3, .85],
    cup: [.3, .18],
    tip: "WATER COSTS A STROKE"
  }, {
    name: "BOUNCE HOUSE",
    par: 2,
    out: R(.14, .08, .86, .94),
    bump: [[.5, .5, .07], [.3, .36, .06], [.7, .36, .06], [.32, .67, .05], [.68, .67, .05]],
    tee: [.5, .86],
    cup: [.5, .17],
    tip: "BOING BOING"
  }, {
    name: "THE BRIDGE",
    par: 2,
    out: R(.1, .08, .9, .94),
    water: [[.1, .4, .9, .6]],
    bridges: [[.42, .4, .58, .6]],
    tee: [.5, .86],
    cup: [.36, .18],
    tip: "STAY ON THE BRIDGE"
  }, {
    name: "WINDMILL BONE",
    par: 3,
    out: R(.12, .08, .88, .94),
    blocks: [[.12, .48, .36, .54], [.64, .48, .88, .54]],
    bone: {
      u: .5,
      v: .51,
      len: .085,
      sp: 1.8
    },
    sand: [[.5, .27, .88, .35]],
    water: [[.12, .66, .34, .8]],
    bump: [[.3, .22, .05]],
    tee: [.5, .86],
    cup: [.72, .18],
    tip: "WATCH THE SPINNING BONE"
  }];
  var BACK = [{
    name: "LOOP-DE-LOOP",
    par: 3,
    out: R(.2, .06, .8, .94),
    tee: [.5, .86],
    cup: [.5, .17],
    tip: "TOO SLOW & IT ROLLS BACK",
    ramp: [.2, .4, .8, .68],
    loop: [.38, .34, .62, .4],
    blocks: [[.2, .34, .38, .4], [.62, .34, .8, .4]],
    deco: [["🌻", .1, .8], ["🐿️", .9, .22], ["🦴", .9, .74]]
  }, {
    name: "UNDER THE DECK",
    pw: 1.2,
    par: 2,
    out: R(.12, .06, .88, .94),
    tee: [.32, .86],
    cup: [.72, .18],
    tip: "PICK A TUNNEL",
    deck: {
      r: [.12, .36, .88, .6],
      tunnels: [[.2, .31], [.45, .55], [.69, .8]]
    },
    bump: [[.5, .74, .045]]
  }, {
    name: "SPRINKLER",
    par: 3,
    out: R(.1, .06, .9, .94),
    tee: [.5, .87],
    cup: [.5, .17],
    tip: "DODGE THE SPRAY",
    sprink: {
      u: .5,
      v: .5,
      R: .42,
      sp: 1.3,
      F: 640
    },
    deco: [["🐸", .05, .3], ["🌷", .95, .62]]
  }, {
    name: "SEESAW",
    par: 3,
    out: R(.18, .06, .82, .94),
    tee: [.5, .86],
    cup: [.5, .17],
    tip: "CROSS WHEN IT'S LEVEL",
    water: [[.18, .36, .82, .64]],
    seesaw: {
      r: [.39, .36, .61, .64],
      A: 340,
      sp: 1.5
    },
    deco: [["🦆", .1, .5], ["🌼", .9, .3]]
  }, {
    name: "MOW DOWN",
    par: 3,
    out: R(.12, .06, .88, .94),
    tee: [.5, .87],
    cup: [.5, .17],
    tip: "DON'T GET MOWED",
    movers: [{
      kind: "mower",
      u: .5,
      v: .58,
      w: .2,
      h: .075,
      amp: .2,
      sp: 1.3
    }, {
      kind: "mower",
      u: .5,
      v: .34,
      w: .2,
      h: .075,
      amp: .2,
      sp: 1.7,
      ph: 2
    }]
  }, {
    name: "ISLAND GREEN",
    par: 3,
    out: R(.1, .06, .9, .94),
    tee: [.5, .86],
    cup: [.5, .22],
    tip: "TAKE THE BRIDGE",
    water: [[.1, .06, .9, .52]],
    islands: [[.28, .12, .72, .34]],
    bridges: [[.44, .34, .56, .52]],
    deco: [["🐢", .05, .7], ["🌻", .95, .76]]
  }, {
    name: "ZIG-ZAG",
    par: 3,
    out: R(.12, .06, .88, .94),
    tee: [.5, .87],
    cup: [.72, .17],
    tip: "PINBALL TIME",
    bump: [[.3, .72, .05], [.7, .72, .05], [.5, .6, .05], [.3, .48, .05], [.7, .48, .05], [.5, .36, .05], [.3, .24, .05]]
  }, {
    name: "SHORTCUT",
    par: 3,
    out: R(.1, .06, .9, .94),
    tee: [.28, .86],
    cup: [.72, .82],
    tip: "THE DOGGY DOOR IS FASTER",
    blocks: [[.46, .26, .54, .6], [.46, .67, .54, .94]],
    sand: [[.6, .1, .86, .2]]
  }, {
    name: "THE DOGHOUSE",
    pw: 1.3,
    par: 3,
    out: R(.12, .06, .88, .94),
    tee: [.5, .87],
    cup: [.5, .2],
    tip: "PUTT IT THROUGH THE DOOR",
    dh: {
      r: [.34, .1, .66, .3],
      door: [.44, .56]
    },
    bump: [[.5, .58, .055], [.28, .44, .045], [.72, .44, .045]]
  }];
  var inR = function inR(r, x, y) {
    return x > r.x && x < r.x + r.w && y > r.y && y < r.y + r.h;
  };
  function inPoly(P, x, y) {
    var c = false;
    for (var i = 0, j = P.length - 1; i < P.length; j = i++) {
      var xi = P[i][0],
        yi = P[i][1],
        xj = P[j][0],
        yj = P[j][1];
      if (yi > y !== yj > y && x < (xj - xi) * (y - yi) / (yj - yi) + xi) c = !c;
    }
    return c;
  }
  var rectSegs = function rectSegs(segs, r, th) {
    return segs.push([r.x, r.y, r.x + r.w, r.y, th], [r.x + r.w, r.y, r.x + r.w, r.y + r.h, th], [r.x + r.w, r.y + r.h, r.x, r.y + r.h, th], [r.x, r.y + r.h, r.x, r.y, th]);
  };
  function _load(G, i) {
    var s = G.s,
      h = s.holes[i];
    var X = function X(u) {
        return s.x0 + u * s.cw;
      },
      Y = function Y(v) {
        return s.y0 + v * s.ch;
      };
    var rect = function rect(q) {
      return {
        x: X(q[0]),
        y: Y(q[1]),
        w: X(q[2]) - X(q[0]),
        h: Y(q[3]) - Y(q[1])
      };
    };
    s.hi = i;
    s.hole = h;
    s.strokes = 0;
    s.phase = "aim";
    s.drag = null;
    s.intro = 2.2;
    s.rt = 0;
    s.loopA = null;
    s.out = h.out.map(function (p) {
      return [X(p[0]), Y(p[1])];
    });
    s.path = typeof Path2D !== "undefined" ? new Path2D() : null;
    if (s.path) {
      s.out.forEach(function (p, k) {
        return k ? s.path.lineTo(p[0], p[1]) : s.path.moveTo(p[0], p[1]);
      });
      s.path.closePath();
    }
    s.segs = [];
    for (var k = 0; k < s.out.length; k++) {
      var a = s.out[k],
        b = s.out[(k + 1) % s.out.length];
      s.segs.push([a[0], a[1], b[0], b[1], 4]);
    }
    s.blocks = (h.blocks || []).map(rect);
    s.solid = s.blocks.slice();
    s.deck = null;
    if (h.deck) {
      var d = h.deck,
        r = d.r;
      s.deck = _objectSpread(_objectSpread({}, rect(r)), {}, {
        tun: d.tunnels.map(function (t) {
          return [X(t[0]), X(t[1])];
        })
      });
      var u = r[0];
      var _iterator = _createForOfIteratorHelper(d.tunnels.concat([[r[2], r[2]]])),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var t = _step.value;
          if (t[0] - u > 0.001) s.solid.push(rect([u, r[1], t[0], r[3]]));
          u = t[1];
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }
    s.solid.forEach(function (r) {
      return rectSegs(s.segs, r, 0);
    });
    s.dh = null;
    if (h.dh) {
      var _r = rect(h.dh.r),
        d0 = X(h.dh.door[0]),
        d1 = X(h.dh.door[1]);
      s.dh = _objectSpread(_objectSpread({}, _r), {}, {
        d0: d0,
        d1: d1
      });
      s.segs.push([_r.x, _r.y, _r.x + _r.w, _r.y, 3], [_r.x + _r.w, _r.y, _r.x + _r.w, _r.y + _r.h, 3], [_r.x, _r.y + _r.h, _r.x, _r.y, 3], [_r.x, _r.y + _r.h, d0, _r.y + _r.h, 3], [d1, _r.y + _r.h, _r.x + _r.w, _r.y + _r.h, 3]);
    }
    s.sand = (h.sand || []).map(rect);
    s.water = (h.water || []).map(rect);
    s.bridges = (h.bridges || []).map(rect);
    s.islands = (h.islands || []).map(rect);
    s.seesaw = h.seesaw ? _objectSpread(_objectSpread({}, rect(h.seesaw.r)), {}, {
      A: h.seesaw.A * s.k,
      sp: h.seesaw.sp,
      ax: 0
    }) : null;
    s.safe = s.bridges.concat(s.islands, s.seesaw ? [s.seesaw] : []);
    s.ramp = h.ramp ? rect(h.ramp) : null;
    s.loop = h.loop ? rect(h.loop) : null;
    if (s.loop) {
      s.loop.exitY = s.loop.y - s.br - 4;
      s.segs.push([s.loop.x, s.loop.y, s.loop.x + s.loop.w, s.loop.y, 0]);
    }
    s.spr = h.sprink ? {
      x: X(h.sprink.u),
      y: Y(h.sprink.v),
      R: h.sprink.R * s.cw,
      r: s.cw * 0.035,
      sp: h.sprink.sp,
      F: h.sprink.F * s.k,
      a: 0
    } : null;
    s.bump = (h.bump || []).map(function (b) {
      return {
        x: X(b[0]),
        y: Y(b[1]),
        r: b[2] * s.cw,
        hit: 0
      };
    });
    s.dogs = (h.dogs || []).map(function (b) {
      return {
        x: X(b[0]),
        y: Y(b[1]),
        r: b[2] * s.cw
      };
    });
    s.movers = (h.movers || []).map(function (m) {
      return {
        kind: m.kind,
        cx: X(m.u),
        y: Y(m.v) - m.h * s.ch / 2,
        w: m.w * s.cw,
        h: m.h * s.ch,
        amp: m.amp * s.cw,
        sp: m.sp,
        ph: m.ph || 0,
        x: 0,
        vx: 0
      };
    });
    s.bone = h.bone ? {
      x: X(h.bone.u),
      y: Y(h.bone.v),
      len: h.bone.len * s.cw,
      sp: h.bone.sp,
      a: 0
    } : null;
    s.cup = {
      x: X(h.cup[0]),
      y: Y(h.cup[1])
    };
    s.ball = {
      x: X(h.tee[0]),
      y: Y(h.tee[1]),
      vx: 0,
      vy: 0,
      r: s.br,
      sc: 1
    };
    s.last = {
      x: s.ball.x,
      y: s.ball.y
    };
    s.deco = (h.deco || []).map(function (d) {
      return [d[0], X(d[1]), Y(d[2])];
    });
    s.kang = -Math.PI / 2;
    s.kpow = 0.5;
    s.kshow = false;
    moveObstacles(s);
  }
  function moveObstacles(s) {
    var _iterator2 = _createForOfIteratorHelper(s.movers),
      _step2;
    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        var m = _step2.value;
        var t = s.ot * m.sp + m.ph;
        m.x = m.cx + Math.sin(t) * m.amp - m.w / 2;
        m.vx = Math.cos(t) * m.amp * m.sp;
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }
    if (s.bone) s.bone.a = s.ot * s.bone.sp;
    if (s.spr) s.spr.a = s.ot * s.spr.sp;
    if (s.seesaw) s.seesaw.ax = s.seesaw.A * Math.sin(s.ot * s.seesaw.sp);
  }
  function hitSeg(b, ax, ay, bx, by, th, svx, svy, e, om, px, py) {
    var dx = bx - ax,
      dy = by - ay,
      L2 = dx * dx + dy * dy;
    var t = L2 ? ((b.x - ax) * dx + (b.y - ay) * dy) / L2 : 0;
    t = t < 0 ? 0 : t > 1 ? 1 : t;
    var qx = ax + dx * t,
      qy = ay + dy * t;
    var nx = b.x - qx,
      ny = b.y - qy;
    var d = Math.hypot(nx, ny),
      m = b.r + th;
    if (d >= m) return false;
    if (d < 1e-6) {
      var l = Math.sqrt(L2) || 1;
      nx = -dy / l;
      ny = dx / l;
    } else {
      nx /= d;
      ny /= d;
    }
    b.x = qx + nx * m;
    b.y = qy + ny * m;
    if (om) {
      svx += -om * (qy - py);
      svy += om * (qx - px);
    }
    var vn = (b.vx - svx) * nx + (b.vy - svy) * ny;
    if (vn < 0) {
      b.vx -= (1 + e) * vn * nx;
      b.vy -= (1 + e) * vn * ny;
    }
    return vn < -60;
  }
  function hitCircle(b, cx, cy, cr, e, kick) {
    var nx = b.x - cx,
      ny = b.y - cy;
    var d = Math.hypot(nx, ny),
      m = cr + b.r;
    if (d >= m) return false;
    if (d < 1e-6) {
      nx = 0;
      ny = 1;
    } else {
      nx /= d;
      ny /= d;
    }
    b.x = cx + nx * m;
    b.y = cy + ny * m;
    var vn = b.vx * nx + b.vy * ny;
    if (vn < 0) {
      b.vx -= (1 + e) * vn * nx;
      b.vy -= (1 + e) * vn * ny;
      b.vx += nx * kick;
      b.vy += ny * kick;
      return true;
    }
    return false;
  }
  function movingHits(s, b, e) {
    var hit = false;
    var _iterator3 = _createForOfIteratorHelper(s.movers),
      _step3;
    try {
      for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
        var H = _step3.value;
        var x0 = H.x,
          y0 = H.y,
          x1 = H.x + H.w,
          y1 = H.y + H.h;
        hit = hitSeg(b, x0, y0, x1, y0, 0, H.vx, 0, e) | hitSeg(b, x1, y0, x1, y1, 0, H.vx, 0, e) | hitSeg(b, x1, y1, x0, y1, 0, H.vx, 0, e) | hitSeg(b, x0, y1, x0, y0, 0, H.vx, 0, e) || hit;
      }
    } catch (err) {
      _iterator3.e(err);
    } finally {
      _iterator3.f();
    }
    if (s.bone) {
      var B = s.bone,
        cx = Math.cos(B.a) * B.len,
        cy = Math.sin(B.a) * B.len;
      hit = hitSeg(b, B.x - cx, B.y - cy, B.x + cx, B.y + cy, 6, 0, 0, e, B.sp, B.x, B.y) || hit;
    }
    return hit;
  }
  function escaped(s, b) {
    if (!isFinite(b.x) || !isFinite(b.y) || !inPoly(s.out, b.x, b.y)) return true;
    var _iterator4 = _createForOfIteratorHelper(s.solid),
      _step4;
    try {
      for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
        var r = _step4.value;
        if (inR(r, b.x, b.y)) return true;
      }
    } catch (err) {
      _iterator4.e(err);
    } finally {
      _iterator4.f();
    }
    var _iterator5 = _createForOfIteratorHelper(s.movers),
      _step5;
    try {
      for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
        var m = _step5.value;
        if (inR(m, b.x, b.y)) return true;
      }
    } catch (err) {
      _iterator5.e(err);
    } finally {
      _iterator5.f();
    }
    var _iterator6 = _createForOfIteratorHelper(s.dogs),
      _step6;
    try {
      for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
        var d = _step6.value;
        if (Math.hypot(b.x - d.x, b.y - d.y) < d.r * 0.8) return true;
      }
    } catch (err) {
      _iterator6.e(err);
    } finally {
      _iterator6.f();
    }
    if (s.spr && Math.hypot(b.x - s.spr.x, b.y - s.spr.y) < s.spr.r * 0.8) return true;
    return false;
  }
  function spray(s, x, y) {
    var S = s.spr,
      dx = x - S.x,
      dy = y - S.y,
      d = Math.hypot(dx, dy);
    if (d > S.R || d < 1) return 0;
    var best = 0;
    for (var j = 0; j < 2; j++) {
      var da = Math.atan2(dy, dx) - S.a - j * Math.PI;
      da = Math.atan2(Math.sin(da), Math.cos(da));
      var c = 1 - Math.abs(da) / 0.42;
      if (c > best) best = c;
    }
    return best > 0 ? best * (1 - 0.5 * d / S.R) : 0;
  }
  function pop(s, txt, x, y, col) {
    s.pops.push({
      txt: txt,
      x: x,
      y: y,
      t: 0.9,
      c: col
    });
  }
  function shoot(G, ux, uy, p) {
    var s = G.s,
      b = s.ball;
    if (s.phase !== "aim" || p < 0.04) return;
    var v = p * s.vmax * (s.hole.pw || 1);
    b.vx = ux * v;
    b.vy = uy * v;
    s.last.x = b.x;
    s.last.y = b.y;
    s.strokes++;
    s.phase = "roll";
    s.rt = 0;
    s.drag = null;
    s.kshow = false;
    s.intro = 0;
    G.sfx("pop");
  }
  function finishHole(G, n, picked) {
    var s = G.s,
      h = s.hole;
    n = Math.min(MAXS, n);
    var pts = PTS[n];
    s.total += pts;
    s.cards.push(n);
    var d = n - h.par;
    var t,
      face,
      col = "#ffd23f";
    if (picked) {
      t = "PICKED UP";
      face = ":dawgL:";
      col = "#ff9f6b";
    } else if (n === 1) {
      t = "HOLE IN ONE!";
      face = ":dawgpog:";
    } else if (d <= -2) {
      t = "EAGLE!";
      face = ":dawgpog:";
    } else if (d === -1) {
      t = "BIRDIE!";
      face = ":dawgW:";
    } else if (d === 0) {
      t = "PAR";
      face = ":dawgW:";
      col = "#9be7ff";
    } else if (d === 1) {
      t = "BOGEY";
      face = ":dawgsweat:";
      col = "#ffb36b";
    } else {
      t = "+" + d + " OVER";
      face = ":dawgcope:";
      col = "#ff8f8f";
    }
    s.flash = {
      t: t,
      face: face,
      col: col,
      pts: pts,
      n: n
    };
    s.phase = "flash";
    s.pt = FLASH;
    s.drag = null;
    if (!picked && d <= 0) G.sfx("win");else if (picked) {
      G.sfx("lose");
      G.buzz();
    }
  }
  function stopBall(G) {
    var s = G.s,
      b = s.ball;
    b.vx = b.vy = 0;
    if (s.strokes >= MAXS) {
      finishHole(G, MAXS, true);
      return;
    }
    s.phase = "aim";
    s.last.x = b.x;
    s.last.y = b.y;
  }
  function physics(G, dt) {
    var s = G.s,
      b = s.ball;
    var sp0 = Math.hypot(b.vx, b.vy);
    var n = Math.min(24, Math.max(1, Math.ceil(sp0 * dt / (b.r * 0.4))));
    var h = dt / n;
    var inSand = false,
      onSlope = false;
    for (var i = 0; i < n; i++) {
      if (s.ramp && inR(s.ramp, b.x, b.y)) {
        b.vy += s.grav * h;
        onSlope = true;
      }
      if (s.seesaw && inR(s.seesaw, b.x, b.y)) {
        b.vx += s.seesaw.ax * h;
        onSlope = true;
      }
      if (s.spr) {
        var k = spray(s, b.x, b.y);
        if (k > 0) {
          var dx = b.x - s.spr.x,
            dy = b.y - s.spr.y,
            d = Math.hypot(dx, dy);
          b.vx += dx / d * s.spr.F * k * h;
          b.vy += dy / d * s.spr.F * k * h;
          if (s.wet <= 0) {
            s.wet = 0.7;
            pop(s, "SPLOOSH", b.x, b.y - 18, "#9be7ff");
          }
        }
      }
      b.x += b.vx * h;
      b.y += b.vy * h;
      var clack = false;
      var _iterator7 = _createForOfIteratorHelper(s.segs),
        _step7;
      try {
        for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
          var g = _step7.value;
          clack = hitSeg(b, g[0], g[1], g[2], g[3], g[4], 0, 0, 0.72) || clack;
        }
      } catch (err) {
        _iterator7.e(err);
      } finally {
        _iterator7.f();
      }
      var _iterator8 = _createForOfIteratorHelper(s.bump),
        _step8;
      try {
        for (_iterator8.s(); !(_step8 = _iterator8.n()).done;) {
          var u = _step8.value;
          if (hitCircle(b, u.x, u.y, u.r, 0.95, 70)) {
            u.hit = 0.2;
            clack = true;
          }
        }
      } catch (err) {
        _iterator8.e(err);
      } finally {
        _iterator8.f();
      }
      var _iterator9 = _createForOfIteratorHelper(s.dogs),
        _step9;
      try {
        for (_iterator9.s(); !(_step9 = _iterator9.n()).done;) {
          var _d = _step9.value;
          if (hitCircle(b, _d.x, _d.y, _d.r, 0.5, 0)) {
            clack = true;
            if (s.snort <= 0) {
              s.snort = 0.8;
              pop(s, "SNRK!", _d.x, _d.y - _d.r - 8, "#fff");
            }
          }
        }
      } catch (err) {
        _iterator9.e(err);
      } finally {
        _iterator9.f();
      }
      if (s.spr) hitCircle(b, s.spr.x, s.spr.y, s.spr.r, 0.5, 0);
      clack = movingHits(s, b, 0.7) || clack;
      if (clack && s.clack <= 0) {
        s.clack = 0.15;
      }
      if (s.loop && b.vy < 0 && inR(s.loop, b.x, b.y)) {
        var L = s.loop;
        s.phase = "loop";
        s.loopA = {
          t: 0,
          x: Math.max(L.x + b.r + 2, Math.min(L.x + L.w - b.r - 2, b.x)),
          v: Math.hypot(b.vx, b.vy)
        };
        b.vx = b.vy = 0;
        pop(s, "WHEEE!", L.x + L.w / 2, L.y - 30, "#ffd23f");
        G.sfx("pop");
        return;
      }
      var _iterator0 = _createForOfIteratorHelper(s.water),
        _step0;
      try {
        for (_iterator0.s(); !(_step0 = _iterator0.n()).done;) {
          var w = _step0.value;
          if (inR(w, b.x, b.y)) {
            var ok = false;
            var _iterator10 = _createForOfIteratorHelper(s.safe),
              _step10;
            try {
              for (_iterator10.s(); !(_step10 = _iterator10.n()).done;) {
                var q = _step10.value;
                if (inR(q, b.x, b.y)) {
                  ok = true;
                  break;
                }
              }
            } catch (err) {
              _iterator10.e(err);
            } finally {
              _iterator10.f();
            }
            if (ok) continue;
            s.phase = "splash";
            s.pt = 0.9;
            s.splash = {
              x: b.x,
              y: b.y
            };
            b.vx = b.vy = 0;
            s.strokes++;
            pop(s, "SPLASH! +1", b.x, b.y - 20, "#9be7ff");
            G.sfx("lose");
            G.buzz();
            return;
          }
        }
      } catch (err) {
        _iterator0.e(err);
      } finally {
        _iterator0.f();
      }
      var _iterator1 = _createForOfIteratorHelper(s.sand),
        _step1;
      try {
        for (_iterator1.s(); !(_step1 = _iterator1.n()).done;) {
          var r = _step1.value;
          if (inR(r, b.x, b.y)) inSand = true;
        }
      } catch (err) {
        _iterator1.e(err);
      } finally {
        _iterator1.f();
      }
      var cx = s.cup.x - b.x,
        cy = s.cup.y - b.y,
        cd = Math.hypot(cx, cy),
        _sp = Math.hypot(b.vx, b.vy);
      if (cd < s.cr) {
        if (_sp < s.sinkV || cd < s.cr * 0.35 && _sp < s.sinkV * 1.6) {
          s.phase = "sink";
          s.pt = 0.45;
          s.sinkFrom = {
            x: b.x,
            y: b.y
          };
          b.vx = b.vy = 0;
          G.sfx("win");
          return;
        }
        b.vx += cx / (cd || 1) * 1400 * h;
        b.vy += cy / (cd || 1) * 1400 * h;
      }
    }
    if (escaped(s, b)) {
      b.x = s.last.x;
      b.y = s.last.y;
      b.vx = b.vy = 0;
      s.oops = (s.oops || 0) + 1;
      pop(s, "OOPS", b.x, b.y - 20, "#fff");
      stopBall(G);
      return;
    }
    var sp = Math.hypot(b.vx, b.vy);
    var ns = sp * Math.exp(-(1.25 + (inSand ? 5 : 0)) * dt) - (inSand ? 120 : 30) * dt;
    if (ns < 0) ns = 0;
    s.inSand = inSand;
    if (ns < s.stopV && !onSlope || s.rt > 14) {
      stopBall(G);
      return;
    }
    if (sp > 0) {
      b.vx *= ns / sp;
      b.vy *= ns / sp;
    }
  }
  function nextHole(G) {
    var s = G.s;
    if (s.hi >= s.holes.length - 1) {
      s.phase = "done";
      var t = s.total,
        m = s.holes.length * 50;
      G.over(t, t >= m * 0.8 ? "Top dog of the yard!" : t >= m * 0.6 ? "Good boy!" : t >= m * 0.4 ? "Ruff round." : "Lost it in the hedges.");
      return;
    }
    _load(G, s.hi + 1);
  }
  function drawMower(G, c, m, dark) {
    var t = G.t;
    c.fillStyle = "#222";
    for (var _i = 0, _arr = [m.x + 5, m.x + m.w - 13]; _i < _arr.length; _i++) {
      var wx = _arr[_i];
      for (var _i2 = 0, _arr2 = [m.y - 3, m.y + m.h - 5]; _i2 < _arr2.length; _i2++) {
        var wy = _arr2[_i2];
        c.fillRect(wx, wy, 8, 8);
      }
    }
    c.fillStyle = "#e0453a";
    c.beginPath();
    c.roundRect(m.x, m.y, m.w, m.h, 8);
    c.fill();
    c.strokeStyle = "#7a1d16";
    c.lineWidth = 2;
    c.stroke();
    c.fillStyle = "#3a3a3a";
    c.beginPath();
    c.arc(m.x + m.w / 2, m.y + m.h / 2, m.h * 0.32, 0, 7);
    c.fill();
    c.strokeStyle = "#bbb";
    c.lineWidth = 2;
    var a = t * 20;
    c.beginPath();
    c.moveTo(m.x + m.w / 2 - Math.cos(a) * m.h * 0.28, m.y + m.h / 2 - Math.sin(a) * m.h * 0.28);
    c.lineTo(m.x + m.w / 2 + Math.cos(a) * m.h * 0.28, m.y + m.h / 2 + Math.sin(a) * m.h * 0.28);
    c.stroke();
    var dir = m.vx >= 0 ? -1 : 1,
      hx = dir < 0 ? m.x : m.x + m.w;
    c.strokeStyle = dark ? "#aaa" : "#555";
    c.lineWidth = 3;
    c.beginPath();
    c.moveTo(hx, m.y + 4);
    c.lineTo(hx + dir * 16, m.y - 2);
    c.moveTo(hx, m.y + m.h - 4);
    c.lineTo(hx + dir * 16, m.y + m.h + 2);
    c.lineTo(hx + dir * 16, m.y - 2);
    c.stroke();
    c.fillStyle = dark ? "#5c9e46" : "#3f8a2a";
    for (var i = 0; i < 4; i++) {
      var k = (t * 3 + i / 4) % 1;
      c.fillRect(hx + dir * (6 + k * 26), m.y + m.h / 2 + Math.sin(i * 2.1 + t * 9) * 10, 3, 3);
    }
  }
  function drawHouse(G, c, h) {
    c.fillStyle = "#c0392b";
    c.fillRect(h.x, h.y, h.w, h.h);
    c.fillStyle = "#8e2a1f";
    c.fillRect(h.x, h.y, h.w, h.h * 0.32);
    c.fillStyle = "#2b1a12";
    c.beginPath();
    c.roundRect(h.x + h.w * 0.38, h.y + h.h * 0.35, h.w * 0.24, h.h * 0.65, [8, 8, 0, 0]);
    c.fill();
    c.strokeStyle = "#5e1a12";
    c.lineWidth = 2;
    c.strokeRect(h.x, h.y, h.w, h.h);
    G.text(c, "WOOF", h.x + h.w * 0.19, h.y + h.h * 0.64, 10, "#ffe9a8");
  }
  function drawBall(c, b, r) {
    c.fillStyle = "rgba(0,0,0,0.25)";
    c.beginPath();
    c.ellipse(b.x + 2, b.y + 3, r, r * 0.8, 0, 0, 7);
    c.fill();
    c.fillStyle = "#d8f033";
    c.beginPath();
    c.arc(b.x, b.y, r, 0, 7);
    c.fill();
    c.strokeStyle = "#fff";
    c.lineWidth = 1.5;
    c.beginPath();
    c.arc(b.x - r * 0.9, b.y, r * 0.75, -1.1, 1.1);
    c.stroke();
    c.beginPath();
    c.arc(b.x + r * 0.9, b.y, r * 0.75, Math.PI - 1.1, Math.PI + 1.1);
    c.stroke();
  }
  function loopRing(s) {
    var L = s.loop;
    return {
      x: L.x + L.w / 2,
      y: L.y - s.ch * 0.035,
      rx: L.w * 0.42,
      ry: s.ch * 0.06
    };
  }
  function scorecard(G, c, s, x, y, w) {
    var n = s.holes.length,
      rows = n > 9 ? 2 : 1,
      lab = 34,
      cw = (w - lab) / 9,
      rh = 17;
    for (var r = 0; r < rows; r++) {
      var yy = y + r * (rh * 2 + 6);
      G.text(c, r ? "IN" : "OUT", x + 2, yy + rh / 2, 10, "#bbb", "left");
      var sum = 0;
      for (var k = 0; k < 9; k++) {
        var hi = r * 9 + k,
          cx = x + lab + cw * k + cw / 2,
          v = s.cards[hi],
          par = s.holes[hi].par;
        c.fillStyle = hi === s.cards.length - 1 ? "rgba(255,210,63,0.28)" : k % 2 ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.12)";
        c.fillRect(cx - cw / 2 + 1, yy, cw - 2, rh * 2);
        G.text(c, String(hi + 1), cx, yy + rh / 2 + 1, 10, "#999");
        if (v != null) {
          sum += v;
          G.text(c, String(v), cx, yy + rh * 1.5 + 1, 10, v < par ? "#7CFC6B" : v === par ? "#9be7ff" : v >= MAXS ? "#ff8f8f" : "#ffb36b");
        } else G.text(c, "·", cx, yy + rh * 1.5 + 1, 10, "#666");
      }
      if (sum) G.text(c, String(sum), x + 2, yy + rh * 1.5 + 1, 10, "#fff", "left");
    }
    return rows * (rh * 2 + 6);
  }
  function draw(G, c) {
    var s = G.s,
      W = G.W,
      H = G.H,
      dark = G.dark(),
      b = s.ball,
      t = G.t;
    c.fillStyle = dark ? "#173016" : "#5fa845";
    c.fillRect(0, 0, W, H);
    c.fillStyle = dark ? "#1b3819" : "#67b14c";
    for (var y = 0; y < H; y += 24) for (var x = y / 24 % 2 ? 12 : 0; x < W; x += 24) c.fillRect(x, y, 12, 12);
    if (!s.path) return;
    var _iterator11 = _createForOfIteratorHelper(s.deco),
      _step11;
    try {
      for (_iterator11.s(); !(_step11 = _iterator11.n()).done;) {
        var _d6 = _step11.value;
        if (_d6[0] === "dog") {
          c.fillStyle = dark ? "#5a3b2a" : "#b0754a";
          c.beginPath();
          c.ellipse(_d6[1], _d6[2] + 16, 34, 13, 0, 0, 7);
          c.fill();
          G.img(c, ":dawgW:", _d6[1], _d6[2], Math.min(56, s.cw * 0.17));
          var z = t * 0.7 % 1;
          G.text(c, "z", _d6[1] + 18 + z * 10, _d6[2] - 26 - z * 18, 10 + z * 5, dark ? "#cfe" : "#fff");
        } else G.emoji(c, _d6[0], _d6[1], _d6[2], 24);
      }
    } catch (err) {
      _iterator11.e(err);
    } finally {
      _iterator11.f();
    }
    c.save();
    c.clip(s.path);
    c.fillStyle = dark ? "#2f6b2a" : "#8fdc6a";
    c.fillRect(0, 0, W, H);
    c.fillStyle = dark ? "#2a6226" : "#83d35d";
    for (var _y = s.y0; _y < H; _y += 44) c.fillRect(0, _y, W, 22);
    if (s.ramp) {
      var r = s.ramp,
        gr = c.createLinearGradient(0, r.y, 0, r.y + r.h);
      gr.addColorStop(0, dark ? "#1f4d1c" : "#5fb43f");
      gr.addColorStop(1, dark ? "#2f6b2a" : "#8fdc6a");
      c.fillStyle = gr;
      c.fillRect(r.x, r.y, r.w, r.h);
      c.strokeStyle = dark ? "rgba(255,255,255,0.22)" : "rgba(255,255,255,0.5)";
      c.lineWidth = 3;
      for (var k = 0; k < 3; k++) {
        var yy = r.y + r.h * (0.3 + k * 0.25) - t * 20 % 14;
        c.beginPath();
        c.moveTo(r.x + r.w / 2 - 22, yy + 10);
        c.lineTo(r.x + r.w / 2, yy);
        c.lineTo(r.x + r.w / 2 + 22, yy + 10);
        c.stroke();
      }
      G.text(c, "UPHILL", r.x + 8, r.y + r.h - 12, 10, dark ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.8)", "left");
    }
    var _iterator12 = _createForOfIteratorHelper(s.sand),
      _step12;
    try {
      for (_iterator12.s(); !(_step12 = _iterator12.n()).done;) {
        var _r3 = _step12.value;
        c.fillStyle = dark ? "#a8925a" : "#ecd48e";
        c.beginPath();
        c.roundRect(_r3.x, _r3.y, _r3.w, _r3.h, 12);
        c.fill();
        c.fillStyle = dark ? "#8f7a48" : "#d6b96c";
        for (var i = 0; i < 14; i++) c.fillRect(_r3.x + i * 37 % _r3.w, _r3.y + i * 23 % _r3.h, 3, 3);
      }
    } catch (err) {
      _iterator12.e(err);
    } finally {
      _iterator12.f();
    }
    var _iterator13 = _createForOfIteratorHelper(s.water),
      _step13;
    try {
      for (_iterator13.s(); !(_step13 = _iterator13.n()).done;) {
        var _r4 = _step13.value;
        c.fillStyle = dark ? "#1f5f94" : "#4fb3f0";
        c.beginPath();
        c.roundRect(_r4.x, _r4.y, _r4.w, _r4.h, 14);
        c.fill();
        c.strokeStyle = dark ? "#4c8ec4" : "#a9e0ff";
        c.lineWidth = 2;
        for (var _i6 = 0; _i6 < 5; _i6++) {
          var wx = _r4.x + 16 + (_i6 * 61 + t * 14) % Math.max(20, _r4.w - 40),
            wy = _r4.y + 14 + _i6 * 29 % Math.max(10, _r4.h - 24);
          c.beginPath();
          c.arc(wx, wy, 7, Math.PI * 1.15, Math.PI * 1.85);
          c.stroke();
        }
        if (_r4.w > 120 && !s.bridges.length && !s.seesaw) G.emoji(c, "🦆", _r4.x + _r4.w * 0.3 + Math.sin(t * 0.6) * 20, _r4.y + _r4.h * 0.55, 22);
      }
    } catch (err) {
      _iterator13.e(err);
    } finally {
      _iterator13.f();
    }
    var _iterator14 = _createForOfIteratorHelper(s.islands),
      _step14;
    try {
      for (_iterator14.s(); !(_step14 = _iterator14.n()).done;) {
        var _r5 = _step14.value;
        c.fillStyle = dark ? "#c2a865" : "#f3dc95";
        c.beginPath();
        c.roundRect(_r5.x - 4, _r5.y - 4, _r5.w + 8, _r5.h + 8, 22);
        c.fill();
        c.fillStyle = dark ? "#2f6b2a" : "#8fdc6a";
        c.beginPath();
        c.roundRect(_r5.x, _r5.y, _r5.w, _r5.h, 18);
        c.fill();
        c.fillStyle = dark ? "#2a6226" : "#83d35d";
        c.fillRect(_r5.x + 10, _r5.y + _r5.h * 0.33, _r5.w - 20, _r5.h * 0.33);
        G.emoji(c, "🌴", _r5.x + 16, _r5.y + 18, 22);
      }
    } catch (err) {
      _iterator14.e(err);
    } finally {
      _iterator14.f();
    }
    var _iterator15 = _createForOfIteratorHelper(s.bridges),
      _step15;
    try {
      for (_iterator15.s(); !(_step15 = _iterator15.n()).done;) {
        var _r6 = _step15.value;
        c.fillStyle = dark ? "#7a5530" : "#b77b45";
        c.fillRect(_r6.x, _r6.y - 4, _r6.w, _r6.h + 8);
        c.fillStyle = dark ? "#5e3b1a" : "#8b5a2b";
        for (var _y5 = _r6.y; _y5 < _r6.y + _r6.h; _y5 += 10) c.fillRect(_r6.x, _y5, _r6.w, 2);
        c.fillRect(_r6.x, _r6.y - 4, 3, _r6.h + 8);
        c.fillRect(_r6.x + _r6.w - 3, _r6.y - 4, 3, _r6.h + 8);
      }
    } catch (err) {
      _iterator15.e(err);
    } finally {
      _iterator15.f();
    }
    if (s.seesaw) {
      var _r2 = s.seesaw,
        _k = s.seesaw.ax / (s.seesaw.A || 1);
      var _gr = c.createLinearGradient(_r2.x, 0, _r2.x + _r2.w, 0);
      var hi = dark ? "#a0703f" : "#d79a5c",
        lo = dark ? "#4e3016" : "#7a4b22",
        mid = dark ? "#7a5530" : "#b77b45";
      _gr.addColorStop(0, _k > 0.1 ? hi : _k < -0.1 ? lo : mid);
      _gr.addColorStop(0.5, mid);
      _gr.addColorStop(1, _k > 0.1 ? lo : _k < -0.1 ? hi : mid);
      c.fillStyle = _gr;
      c.fillRect(_r2.x, _r2.y, _r2.w, _r2.h);
      c.fillStyle = dark ? "#3a2412" : "#6e4723";
      for (var _y2 = _r2.y + 12; _y2 < _r2.y + _r2.h; _y2 += 18) c.fillRect(_r2.x, _y2, _r2.w, 2);
      c.strokeStyle = dark ? "#3a2412" : "#5e3b1a";
      c.lineWidth = 2;
      c.strokeRect(_r2.x, _r2.y, _r2.w, _r2.h);
      c.fillStyle = "#555";
      c.beginPath();
      c.arc(_r2.x + _r2.w / 2, _r2.y + _r2.h / 2, 6, 0, 7);
      c.fill();
      if (Math.abs(_k) > 0.25) {
        var dx = Math.sign(_k) * Math.min(_r2.w * 0.32, 10 + Math.abs(_k) * 18),
          ay = _r2.y + _r2.h * 0.3;
        c.strokeStyle = "#fff";
        c.lineWidth = 3;
        c.beginPath();
        c.moveTo(_r2.x + _r2.w / 2 - dx * 0.4, ay);
        c.lineTo(_r2.x + _r2.w / 2 + dx, ay);
        c.lineTo(_r2.x + _r2.w / 2 + dx * 0.5, ay - 6);
        c.moveTo(_r2.x + _r2.w / 2 + dx, ay);
        c.lineTo(_r2.x + _r2.w / 2 + dx * 0.5, ay + 6);
        c.stroke();
      } else G.text(c, "LEVEL", _r2.x + _r2.w / 2, _r2.y + _r2.h * 0.3, 10, "#fff");
    }
    if (s.dh) {
      var d = s.dh;
      c.fillStyle = dark ? "#3b2416" : "#6b4428";
      c.fillRect(d.x, d.y, d.w, d.h);
      c.fillStyle = dark ? "#4a2e1c" : "#7f5232";
      for (var _y3 = d.y + 10; _y3 < d.y + d.h; _y3 += 14) c.fillRect(d.x, _y3, d.w, 2);
    }
    c.restore();
    if (s.loop) {
      var L = loopRing(s);
      c.strokeStyle = dark ? "#2c4f7a" : "#4b7bc0";
      c.lineWidth = 12;
      c.beginPath();
      c.ellipse(L.x, L.y, L.rx, L.ry, 0, 0, 7);
      c.stroke();
      c.strokeStyle = dark ? "#7fa8de" : "#a9d0ff";
      c.lineWidth = 4;
      c.beginPath();
      c.ellipse(L.x, L.y, L.rx, L.ry, 0, 0, 7);
      c.stroke();
      c.fillStyle = dark ? "#2c4f7a" : "#4b7bc0";
      c.fillRect(s.loop.x, s.loop.y, s.loop.w, s.loop.h);
      c.fillStyle = dark ? "#7fa8de" : "#a9d0ff";
      for (var _x = s.loop.x + 6; _x < s.loop.x + s.loop.w - 4; _x += 12) c.fillRect(_x, s.loop.y + 4, 6, s.loop.h - 8);
    }
    c.fillStyle = "#1a1a1a";
    c.beginPath();
    c.arc(s.cup.x, s.cup.y, s.cr, 0, 7);
    c.fill();
    c.strokeStyle = dark ? "#ddd" : "#fff";
    c.lineWidth = 2;
    c.stroke();
    if (!s.dh) {
      c.fillStyle = "#555";
      c.fillRect(s.cup.x - 1, s.cup.y - 34, 2.5, 34);
      G.emoji(c, "🚩", s.cup.x + 8, s.cup.y - 34, 22);
    }
    var _iterator16 = _createForOfIteratorHelper(s.blocks),
      _step16;
    try {
      for (_iterator16.s(); !(_step16 = _iterator16.n()).done;) {
        var _r7 = _step16.value;
        c.fillStyle = dark ? "#6e4723" : "#a86c35";
        c.fillRect(_r7.x, _r7.y, _r7.w, _r7.h);
        c.fillStyle = dark ? "#4d3118" : "#7a4b22";
        for (var _x2 = _r7.x + 26; _x2 < _r7.x + _r7.w; _x2 += 26) c.fillRect(_x2, _r7.y, 2, _r7.h);
        c.strokeStyle = dark ? "#3a2412" : "#5e3b1a";
        c.lineWidth = 2;
        c.strokeRect(_r7.x, _r7.y, _r7.w, _r7.h);
      }
    } catch (err) {
      _iterator16.e(err);
    } finally {
      _iterator16.f();
    }
    c.lineJoin = "round";
    c.strokeStyle = dark ? "#3a2412" : "#5e3b1a";
    c.lineWidth = 10;
    c.stroke(s.path);
    c.strokeStyle = dark ? "#8a5c30" : "#c48a4f";
    c.lineWidth = 6;
    c.stroke(s.path);
    c.setLineDash([2, 16]);
    c.strokeStyle = dark ? "#3a2412" : "#6e4723";
    c.stroke(s.path);
    c.setLineDash([]);
    if (s.dh) {
      var _d2 = s.dh,
        wc = "#c0392b",
        wd = "#7a1d16";
      c.lineCap = "round";
      for (var _i3 = 0, _arr3 = [[10, wd], [6, wc]]; _i3 < _arr3.length; _i3++) {
        var _arr3$_i = _slicedToArray(_arr3[_i3], 2),
          lw = _arr3$_i[0],
          col = _arr3$_i[1];
        c.strokeStyle = col;
        c.lineWidth = lw;
        c.beginPath();
        c.moveTo(_d2.d0, _d2.y + _d2.h);
        c.lineTo(_d2.x, _d2.y + _d2.h);
        c.lineTo(_d2.x, _d2.y);
        c.lineTo(_d2.x + _d2.w, _d2.y);
        c.lineTo(_d2.x + _d2.w, _d2.y + _d2.h);
        c.lineTo(_d2.d1, _d2.y + _d2.h);
        c.stroke();
      }
      c.lineCap = "butt";
      c.fillStyle = "#8e2a1f";
      c.beginPath();
      c.moveTo(_d2.x - 8, _d2.y + 2);
      c.lineTo(_d2.x + _d2.w / 2, _d2.y - s.ch * 0.045);
      c.lineTo(_d2.x + _d2.w + 8, _d2.y + 2);
      c.closePath();
      c.fill();
      c.strokeStyle = wd;
      c.lineWidth = 2;
      c.stroke();
      G.text(c, "BIG DAWG", _d2.x + _d2.w / 2, _d2.y + _d2.h + 14, 10, "#ffe9a8");
      G.emoji(c, "🥣", _d2.x + _d2.w - 16, _d2.y + 16, 16);
      c.fillStyle = "#555";
      c.fillRect(s.cup.x - 1, s.cup.y - 22, 2.5, 22);
      G.emoji(c, "🚩", s.cup.x + 7, s.cup.y - 22, 18);
    }
    var _iterator17 = _createForOfIteratorHelper(s.bump),
      _step17;
    try {
      for (_iterator17.s(); !(_step17 = _iterator17.n()).done;) {
        var u = _step17.value;
        var _k4 = u.hit > 0 ? 1.12 : 1;
        c.fillStyle = "#e0453a";
        c.beginPath();
        c.arc(u.x, u.y, u.r * _k4, 0, 7);
        c.fill();
        c.fillStyle = "#fff";
        c.beginPath();
        c.arc(u.x, u.y, u.r * _k4 * 0.68, 0, 7);
        c.fill();
        c.fillStyle = "#e0453a";
        c.beginPath();
        c.arc(u.x, u.y, u.r * _k4 * 0.4, 0, 7);
        c.fill();
        G.emoji(c, "🐾", u.x, u.y, u.r * 0.7);
      }
    } catch (err) {
      _iterator17.e(err);
    } finally {
      _iterator17.f();
    }
    var _iterator18 = _createForOfIteratorHelper(s.dogs),
      _step18;
    try {
      for (_iterator18.s(); !(_step18 = _iterator18.n()).done;) {
        var _d7 = _step18.value;
        c.fillStyle = dark ? "#5a3b2a" : "#b0754a";
        c.beginPath();
        c.ellipse(_d7.x, _d7.y + _d7.r * 0.2, _d7.r * 1.15, _d7.r * 0.95, 0, 0, 7);
        c.fill();
        c.fillStyle = dark ? "#7a5440" : "#d9a06d";
        c.beginPath();
        c.ellipse(_d7.x, _d7.y + _d7.r * 0.2, _d7.r * 0.95, _d7.r * 0.75, 0, 0, 7);
        c.fill();
        G.img(c, ":dawgW:", _d7.x, _d7.y, _d7.r * 1.7, Math.sin(t * 1.3) * 0.04);
        var _z = t * 0.6 % 1;
        G.text(c, "Z", _d7.x + _d7.r * 0.7 + _z * 12, _d7.y - _d7.r * 0.8 - _z * 20, 10 + _z * 6, "#fff");
      }
    } catch (err) {
      _iterator18.e(err);
    } finally {
      _iterator18.f();
    }
    var _iterator19 = _createForOfIteratorHelper(s.movers),
      _step19;
    try {
      for (_iterator19.s(); !(_step19 = _iterator19.n()).done;) {
        var m = _step19.value;
        if (m.kind === "mower") drawMower(G, c, m, dark);else drawHouse(G, c, m);
      }
    } catch (err) {
      _iterator19.e(err);
    } finally {
      _iterator19.f();
    }
    if (s.bone) {
      var B = s.bone;
      c.save();
      c.translate(B.x, B.y);
      c.rotate(B.a);
      c.fillStyle = dark ? "#e8e0cc" : "#fffaf0";
      c.strokeStyle = "#8a7a5a";
      c.lineWidth = 2;
      c.beginPath();
      c.roundRect(-B.len, -5, B.len * 2, 10, 4);
      c.fill();
      c.stroke();
      for (var _i4 = 0, _arr4 = [-1, 1]; _i4 < _arr4.length; _i4++) {
        var e = _arr4[_i4];
        for (var _i5 = 0, _arr5 = [-1, 1]; _i5 < _arr5.length; _i5++) {
          var f = _arr5[_i5];
          c.beginPath();
          c.arc(e * B.len, f * 5, 6, 0, 7);
          c.fill();
          c.stroke();
        }
      }
      c.fillStyle = dark ? "#e8e0cc" : "#fffaf0";
      c.fillRect(-B.len + 2, -4, B.len * 2 - 4, 8);
      c.restore();
      c.fillStyle = "#8b5a2b";
      c.beginPath();
      c.arc(B.x, B.y, 4, 0, 7);
      c.fill();
    }
    if (s.spr) {
      var S = s.spr;
      c.fillStyle = dark ? "rgba(140,200,255,0.6)" : "rgba(235,248,255,0.85)";
      for (var j = 0; j < 2; j++) for (var _k2 = 1; _k2 <= 14; _k2++) {
        var _f = (_k2 / 14 + t * 0.9) % 1,
          _d3 = S.r + _f * (S.R - S.r),
          a = S.a + j * Math.PI + Math.sin(_k2 * 7.3) * 0.32;
        c.beginPath();
        c.arc(S.x + Math.cos(a) * _d3, S.y + Math.sin(a) * _d3, 2.5 + (1 - _f) * 2, 0, 7);
        c.fill();
      }
      c.fillStyle = "#6b6b6b";
      c.beginPath();
      c.arc(S.x, S.y, S.r, 0, 7);
      c.fill();
      c.fillStyle = "#3fa34d";
      c.beginPath();
      c.arc(S.x, S.y, S.r * 0.6, 0, 7);
      c.fill();
      c.strokeStyle = "#ddd";
      c.lineWidth = 3;
      c.beginPath();
      c.moveTo(S.x - Math.cos(S.a) * S.r, S.y - Math.sin(S.a) * S.r);
      c.lineTo(S.x + Math.cos(S.a) * S.r, S.y + Math.sin(S.a) * S.r);
      c.stroke();
    }
    if (s.phase === "splash" && s.splash) {
      var _k3 = 1 - s.pt / 0.9;
      c.strokeStyle = "#fff";
      c.lineWidth = 2;
      c.beginPath();
      c.arc(s.splash.x, s.splash.y, 6 + _k3 * 22, 0, 7);
      c.stroke();
      c.beginPath();
      c.arc(s.splash.x, s.splash.y, 3 + _k3 * 12, 0, 7);
      c.stroke();
    }
    var aim = null;
    if (s.phase === "aim") {
      if (s.drag) {
        var _dx = s.drag.x0 - s.drag.x,
          dy = s.drag.y0 - s.drag.y,
          _L = Math.hypot(_dx, dy);
        if (_L >= 14) aim = [_dx / _L, dy / _L, Math.min(1, _L / s.maxDrag)];
      } else if (s.kshow) aim = [Math.cos(s.kang), Math.sin(s.kang), s.kpow];
    }
    if (aim) {
      var _aim = aim,
        _aim2 = _slicedToArray(_aim, 3),
        ux = _aim2[0],
        uy = _aim2[1],
        p = _aim2[2],
        len = 30 + p * s.ch * 0.42;
      c.strokeStyle = "rgba(255,255,255,0.55)";
      c.lineWidth = 3;
      c.beginPath();
      c.moveTo(b.x, b.y);
      c.lineTo(b.x - ux * p * 50, b.y - uy * p * 50);
      c.stroke();
      var _col = p < 0.45 ? "#7CFC6B" : p < 0.8 ? "#ffd23f" : "#ff5a4f";
      c.fillStyle = _col;
      for (var _d4 = 16; _d4 < len; _d4 += 11) {
        c.beginPath();
        c.arc(b.x + ux * _d4, b.y + uy * _d4, Math.max(1.5, 3.2 - _d4 / len * 1.8), 0, 7);
        c.fill();
      }
      var mw = 74,
        mh = 10,
        mx = Math.min(W - mw - 50, Math.max(6, b.x - mw / 2)),
        my = b.y > s.y0 + 60 ? b.y - 36 : b.y + 22;
      c.fillStyle = "rgba(0,0,0,0.55)";
      c.fillRect(mx - 2, my - 2, mw + 46, mh + 4);
      c.fillStyle = _col;
      c.fillRect(mx, my, mw * p, mh);
      G.text(c, Math.round(p * 100) + "%", mx + mw + 4, my + mh / 2 + 1, 10, "#fff", "left");
    }
    if (s.phase === "loop" && s.loopA) {
      var _L2 = loopRing(s),
        _a = Math.PI / 2 - s.loopA.t / 0.6 * Math.PI * 2;
      drawBall(c, {
        x: _L2.x + Math.cos(_a) * _L2.rx,
        y: _L2.y + Math.sin(_a) * _L2.ry
      }, b.r);
    } else if (s.phase !== "splash" && s.phase !== "flash" && s.phase !== "done") drawBall(c, b, b.r * (b.sc || 1));
    if (s.deck) {
      var _d5 = s.deck;
      c.fillStyle = dark ? "#6e4723" : "#b77b45";
      c.fillRect(_d5.x, _d5.y, _d5.w, _d5.h);
      c.fillStyle = dark ? "#4d3118" : "#8b5a2b";
      for (var _y4 = _d5.y + 14; _y4 < _d5.y + _d5.h; _y4 += 14) c.fillRect(_d5.x, _y4, _d5.w, 2);
      c.strokeStyle = dark ? "#3a2412" : "#5e3b1a";
      c.lineWidth = 3;
      c.strokeRect(_d5.x, _d5.y, _d5.w, _d5.h);
      var _iterator20 = _createForOfIteratorHelper(_d5.tun),
        _step20;
      try {
        for (_iterator20.s(); !(_step20 = _iterator20.n()).done;) {
          var _step20$value = _slicedToArray(_step20.value, 2),
            a0 = _step20$value[0],
            a1 = _step20$value[1];
          c.fillStyle = "#1d130c";
          c.beginPath();
          c.roundRect(a0, _d5.y - 2, a1 - a0, 12, [0, 0, 8, 8]);
          c.fill();
          c.beginPath();
          c.roundRect(a0, _d5.y + _d5.h - 10, a1 - a0, 12, [8, 8, 0, 0]);
          c.fill();
          c.strokeStyle = dark ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.2)";
          c.setLineDash([4, 6]);
          c.lineWidth = 2;
          c.beginPath();
          c.moveTo(a0 + 3, _d5.y + 14);
          c.lineTo(a0 + 3, _d5.y + _d5.h - 14);
          c.moveTo(a1 - 3, _d5.y + 14);
          c.lineTo(a1 - 3, _d5.y + _d5.h - 14);
          c.stroke();
          c.setLineDash([]);
        }
      } catch (err) {
        _iterator20.e(err);
      } finally {
        _iterator20.f();
      }
      G.emoji(c, "🪑", _d5.x + _d5.w * 0.4, _d5.y + _d5.h * 0.4, 22);
      G.emoji(c, "🪴", _d5.x + _d5.w * 0.92, _d5.y + _d5.h * 0.3, 22);
      G.emoji(c, "☂️", _d5.x + _d5.w * 0.62, _d5.y + _d5.h * 0.62, 24);
      if (inR(_d5, b.x, b.y) && (s.phase === "roll" || s.phase === "aim")) {
        c.globalAlpha = 0.55;
        drawBall(c, b, b.r);
        c.globalAlpha = 1;
      }
    }
    var _iterator21 = _createForOfIteratorHelper(s.pops),
      _step21;
    try {
      for (_iterator21.s(); !(_step21 = _iterator21.n()).done;) {
        var _p = _step21.value;
        G.text(c, _p.txt, _p.x, _p.y - (0.9 - _p.t) * 30, 10, _p.c);
      }
    } catch (err) {
      _iterator21.e(err);
    } finally {
      _iterator21.f();
    }
    var N = s.holes.length,
      hh = G.hud(c, "HOLE ".concat(s.hi + 1, "/").concat(N), "", "SCORE ".concat(s.total));
    c.fillStyle = "rgba(10,10,20,0.45)";
    c.fillRect(0, hh, W, 20);
    G.text(c, "PAR ".concat(s.hole.par), 10, hh + 10, 10, "#9be7ff", "left");
    var st = Math.min(s.strokes, MAXS);
    G.text(c, "STROKES ".concat(st), W - 10, hh + 10, 10, st >= 5 ? "#ff8f8f" : "#fff", "right");
    if (s.intro > 0 && s.phase === "aim" && G.state === "play") {
      var _a2 = Math.min(1, s.intro / 0.35),
        pw = Math.min(W - 40, 310),
        ph = 104,
        px = (W - pw) / 2,
        py = s.y0 + s.ch * 0.42 - ph / 2;
      c.globalAlpha = _a2;
      c.fillStyle = "rgba(12,16,24,0.82)";
      c.beginPath();
      c.roundRect(px, py, pw, ph, 16);
      c.fill();
      c.strokeStyle = s.hi >= 9 ? "#ff9f6b" : "#ffd23f";
      c.lineWidth = 3;
      c.stroke();
      G.text(c, "HOLE ".concat(s.hi + 1), W / 2, py + 22, 16, "#ffd23f");
      G.text(c, s.hole.name, W / 2, py + 48, 12, "#fff");
      G.text(c, "PAR ".concat(s.hole.par), W / 2, py + 70, 10, "#9be7ff");
      G.text(c, s.hole.tip || "", W / 2, py + 88, 10, "#ccc");
      c.globalAlpha = 1;
    }
    if (s.hi === 0 && s.strokes === 0 && G.state === "play") G.hint(c, "PULL BACK & LET GO", 7, s.y0 + s.ch * 0.66);
    if ((s.phase === "flash" || s.phase === "done") && s.flash) {
      var _f2 = s.flash,
        rows = N > 9 ? 2 : 1,
        _pw = Math.min(W - 24, 350),
        _ph = 136 + rows * 40 + 24,
        _px = (W - _pw) / 2,
        _py = Math.max(s.y0 + 4, H * 0.45 - _ph / 2);
      c.fillStyle = "rgba(10,12,20,0.88)";
      c.beginPath();
      c.roundRect(_px, _py, _pw, _ph, 16);
      c.fill();
      c.strokeStyle = _f2.col;
      c.lineWidth = 3;
      c.stroke();
      G.img(c, _f2.face, W / 2, _py + 34, 48, Math.sin(t * 6) * 0.08);
      G.banner(c, _f2.t, _f2.col, _py + 78, Math.min(22, _pw / 13));
      G.text(c, "HOLE ".concat(s.hi + 1, ": ").concat(_f2.n, " STROKE").concat(_f2.n > 1 ? "S" : "", "  +").concat(_f2.pts), W / 2, _py + 106, 10, "#fff");
      scorecard(G, c, s, _px + 12, _py + 124, _pw - 24);
      G.text(c, "TOTAL ".concat(s.total), W / 2, _py + _ph - 16, 12, "#ffd23f");
    }
  }
  function makeGame(o) {
    var holes = o.holes;
    return {
      key: o.key,
      name: o.name,
      icon: "⛳",
      max: holes.length * 50,
      blurb: o.blurb,
      how: "".concat(holes.length, " holes. Drag back from the tennis ball like a slingshot, then let go to putt. The further you pull, the harder the shot. Ace = 50, 2 strokes = 40, 3 = 30, 4 = 20, 5 = 10, 6 = 5. Water costs a stroke. Max 6 strokes per hole.") + (o.extra || ""),
      save: function save(G) {
        var s = G.s;
        if (!s.hi || s.strokes || s.phase !== "aim") return null;
        return {
          label: "Hole ".concat(s.hi + 1),
          hi: s.hi,
          total: s.total,
          cards: s.cards.slice()
        };
      },
      load: function load(G, v) {
        var s = G.s;
        s.total = v.total;
        s.cards = v.cards.slice();
        _load(G, v.hi);
      },
      reset: function reset(G) {
        var top = 34 + 20 + 6,
          pad = 8;
        G.s = {
          holes: holes,
          x0: pad,
          y0: top,
          cw: G.W - pad * 2,
          ch: G.H - top - pad,
          total: 0,
          cards: [],
          pops: [],
          ot: 0,
          clack: 0,
          snort: 0,
          wet: 0,
          flash: null,
          movers: []
        };
        var s = G.s;
        s.br = Math.max(6, Math.min(8.5, s.cw * 0.02));
        s.cr = s.br * 1.75;
        s.vmax = Math.max(560, s.ch * 1.6);
        s.sinkV = Math.max(200, s.ch * 0.48);
        s.stopV = 8;
        s.k = s.vmax / 860;
        s.grav = s.ch * 0.85;
        s.maxDrag = Math.max(110, Math.min(G.W, G.H) * 0.36);
        _load(G, 0);
      },
      update: function update(G, dt) {
        var s = G.s;
        s.ot += dt;
        moveObstacles(s);
        if (s.intro > 0) s.intro -= dt;
        if (s.clack > 0) s.clack -= dt;
        if (s.snort > 0) s.snort -= dt;
        if (s.wet > 0) s.wet -= dt;
        var _iterator22 = _createForOfIteratorHelper(s.bump),
          _step22;
        try {
          for (_iterator22.s(); !(_step22 = _iterator22.n()).done;) {
            var u = _step22.value;
            if (u.hit > 0) u.hit -= dt;
          }
        } catch (err) {
          _iterator22.e(err);
        } finally {
          _iterator22.f();
        }
        var _iterator23 = _createForOfIteratorHelper(s.pops),
          _step23;
        try {
          for (_iterator23.s(); !(_step23 = _iterator23.n()).done;) {
            var p = _step23.value;
            p.t -= dt;
          }
        } catch (err) {
          _iterator23.e(err);
        } finally {
          _iterator23.f();
        }
        if (s.pops.length && s.pops[0].t <= 0) s.pops = s.pops.filter(function (p) {
          return p.t > 0;
        });
        var b = s.ball;
        if (s.phase === "aim") {
          if (movingHits(s, b, 0.5) && Math.hypot(b.vx, b.vy) > s.stopV) {
            s.phase = "roll";
            s.rt = 0;
            s.drag = null;
            s.last.x = b.x;
            s.last.y = b.y;
          } else {
            b.vx = b.vy = 0;
            if (escaped(s, b)) {
              b.x = s.last.x;
              b.y = s.last.y;
            }
          }
        } else if (s.phase === "roll") {
          s.rt += dt;
          physics(G, dt);
        } else if (s.phase === "loop") {
          s.loopA.t += dt;
          if (s.loopA.t >= 0.6) {
            var L = s.loop;
            b.x = s.loopA.x;
            b.y = L.exitY;
            b.vx = (Math.random() - 0.5) * 50 * s.k;
            b.vy = -Math.max(160 * s.k, Math.min(560 * s.k, s.loopA.v));
            s.loopA = null;
            s.phase = "roll";
            s.rt = 0;
          }
        } else if (s.phase === "sink") {
          s.pt -= dt;
          var k = Math.max(0, s.pt / 0.45);
          b.x = s.cup.x + (s.sinkFrom.x - s.cup.x) * k;
          b.y = s.cup.y + (s.sinkFrom.y - s.cup.y) * k;
          b.sc = 0.4 + 0.6 * k;
          if (s.pt <= 0) {
            b.sc = 1;
            finishHole(G, s.strokes, false);
          }
        } else if (s.phase === "splash") {
          s.pt -= dt;
          if (s.pt <= 0) {
            b.x = s.last.x;
            b.y = s.last.y;
            b.vx = b.vy = 0;
            s.splash = null;
            if (s.strokes >= MAXS) finishHole(G, MAXS, true);else s.phase = "aim";
          }
        } else if (s.phase === "flash") {
          s.pt -= dt;
          if (s.pt <= 0) nextHole(G);
        }
      },
      down: function down(G, x, y) {
        var s = G.s;
        if (s.phase === "flash") {
          if (s.pt < FLASH - 0.5) s.pt = 0;
          return;
        }
        if (s.phase !== "aim") return;
        if (s.intro > 0.3) s.intro = 0.3;
        s.drag = {
          x0: x,
          y0: y,
          x: x,
          y: y
        };
        s.kshow = false;
      },
      move: function move(G, x, y) {
        var d = G.s.drag;
        if (d) {
          d.x = x;
          d.y = y;
        }
      },
      up: function up(G, x, y) {
        var s = G.s,
          d = s.drag;
        if (!d) return;
        s.drag = null;
        d.x = x;
        d.y = y;
        var dx = d.x0 - d.x,
          dy = d.y0 - d.y,
          L = Math.hypot(dx, dy);
        if (L < 14) return;
        shoot(G, dx / L, dy / L, Math.min(1, L / s.maxDrag));
      },
      onKey: function onKey(G, k, isDown) {
        var s = G.s;
        if (!isDown) return;
        if (s.phase === "flash" && k === " ") {
          if (s.pt < FLASH - 0.5) s.pt = 0;
          return;
        }
        if (s.phase !== "aim") return;
        if (k === "ArrowLeft" || k === "a") {
          s.kang -= 0.08;
          s.kshow = true;
        } else if (k === "ArrowRight" || k === "d") {
          s.kang += 0.08;
          s.kshow = true;
        } else if (k === "ArrowUp" || k === "w") {
          s.kpow = Math.min(1, s.kpow + 0.05);
          s.kshow = true;
        } else if (k === "ArrowDown" || k === "s") {
          s.kpow = Math.max(0.05, s.kpow - 0.05);
          s.kshow = true;
        } else if (k === " ") shoot(G, Math.cos(s.kang), Math.sin(s.kang), s.kpow);
      },
      draw: draw
    };
  }
  defGame(makeGame({
    key: "putt",
    name: "Putt Pup",
    holes: FRONT,
    blurb: "9 holes of backyard mini golf."
  }));
  defGame(makeGame({
    key: "putt18",
    name: "Putt Pup 18",
    holes: FRONT.concat(BACK),
    blurb: "The full 18. Back nine included.",
    extra: " The back nine adds a loop-de-loop, deck tunnels, a sprinkler, a seesaw, lawnmowers, an island green and the doghouse."
  }));
})();