function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n5 = 0, F = function F() {}; return { s: F, n: function n() { return _n5 >= r.length ? { done: !0 } : { done: !1, value: r[_n5++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
(function () {
  var TOUCH = typeof window !== "undefined" && "ontouchstart" in window;
  var REACT = 0.35;
  var GRAV = -10,
    DT = 1 / 120,
    ITER = 8,
    SLOP = 0.01,
    BETA = 0.2,
    MARGIN = 0.02;
  var BID = 0;
  function body(kind, x, y, a) {
    return {
      id: ++BID,
      kind: kind,
      x: x,
      y: y,
      a: a || 0,
      vx: 0,
      vy: 0,
      w: 0,
      m: 0,
      im: 0,
      I: 0,
      iI: 0,
      sh: [],
      group: 0,
      noG: false
    };
  }
  function poly(b, v, o) {
    o = o || {};
    var n = [];
    for (var i = 0; i < v.length; i++) {
      var p = v[i],
        q = v[(i + 1) % v.length],
        ex = q[0] - p[0],
        ey = q[1] - p[1],
        l = Math.hypot(ex, ey) || 1;
      n.push([ey / l, -ex / l]);
    }
    var s = {
      t: 1,
      v: v,
      n: n,
      wv: v.map(function () {
        return [0, 0];
      }),
      wn: n.map(function () {
        return [0, 0];
      }),
      f: o.f == null ? 0.7 : o.f,
      kill: !!o.kill,
      den: o.den == null ? 1 : o.den,
      b: b,
      bb: [0, 0, 0, 0]
    };
    s.si = b.sh.length;
    b.sh.push(s);
    return s;
  }
  function circ(b, x, y, r, o) {
    o = o || {};
    var s = {
      t: 0,
      x: x,
      y: y,
      r: r,
      wx: 0,
      wy: 0,
      f: o.f == null ? 0.9 : o.f,
      kill: !!o.kill,
      den: o.den == null ? 1 : o.den,
      b: b,
      bb: [0, 0, 0, 0]
    };
    s.si = b.sh.length;
    b.sh.push(s);
    return s;
  }
  var box = function box(b, hw, hh, cx, cy, o) {
    return poly(b, [[cx - hw, cy - hh], [cx + hw, cy - hh], [cx + hw, cy + hh], [cx - hw, cy + hh]], o);
  };
  function mass(b) {
    if (b.kind !== "dyn") {
      b.m = b.im = b.I = b.iI = 0;
      return;
    }
    var m = 0,
      I = 0;
    var _iterator = _createForOfIteratorHelper(b.sh),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var s = _step.value;
        if (s.t === 0) {
          var mm = Math.PI * s.r * s.r * s.den;
          m += mm;
          I += mm * (s.r * s.r / 2 + s.x * s.x + s.y * s.y);
        } else for (var i = 0; i < s.v.length; i++) {
          var p = s.v[i],
            q = s.v[(i + 1) % s.v.length],
            cr = (p[0] * q[1] - p[1] * q[0]) / 2;
          m += cr * s.den;
          I += cr * s.den * (p[0] * p[0] + p[1] * p[1] + p[0] * q[0] + p[1] * q[1] + q[0] * q[0] + q[1] * q[1]) / 6;
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
    b.m = m;
    b.im = m > 0 ? 1 / m : 0;
    b.I = I;
    b.iI = I > 0 ? 1 / I : 0;
  }
  function xform(b) {
    var c = Math.cos(b.a),
      sn = Math.sin(b.a);
    var _iterator2 = _createForOfIteratorHelper(b.sh),
      _step2;
    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        var s = _step2.value;
        var bb = s.bb;
        if (s.t === 0) {
          s.wx = b.x + c * s.x - sn * s.y;
          s.wy = b.y + sn * s.x + c * s.y;
          bb[0] = s.wx - s.r;
          bb[1] = s.wy - s.r;
          bb[2] = s.wx + s.r;
          bb[3] = s.wy + s.r;
          continue;
        }
        bb[0] = bb[1] = 1e9;
        bb[2] = bb[3] = -1e9;
        for (var i = 0; i < s.v.length; i++) {
          var p = s.v[i],
            w = s.wv[i],
            nn = s.n[i],
            wn = s.wn[i];
          w[0] = b.x + c * p[0] - sn * p[1];
          w[1] = b.y + sn * p[0] + c * p[1];
          wn[0] = c * nn[0] - sn * nn[1];
          wn[1] = sn * nn[0] + c * nn[1];
          if (w[0] < bb[0]) bb[0] = w[0];
          if (w[0] > bb[2]) bb[2] = w[0];
          if (w[1] < bb[1]) bb[1] = w[1];
          if (w[1] > bb[3]) bb[3] = w[1];
        }
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }
  }
  var ovl = function ovl(a, b) {
    return a[0] <= b[2] + MARGIN && b[0] <= a[2] + MARGIN && a[1] <= b[3] + MARGIN && b[1] <= a[3] + MARGIN;
  };
  function cc(A, B, out) {
    var dx = B.wx - A.wx,
      dy = B.wy - A.wy,
      d = Math.hypot(dx, dy),
      sep = d - A.r - B.r;
    if (sep > MARGIN) return;
    var nx = d > 1e-9 ? dx / d : 0,
      ny = d > 1e-9 ? dy / d : 1;
    out.push([A.wx + nx * A.r, A.wy + ny * A.r, nx, ny, sep, 0]);
  }
  function pc(A, B, out, flip) {
    var v = A.wv,
      n = A.wn,
      cx = B.wx,
      cy = B.wy,
      r = B.r;
    var best = -1e9,
      bi = 0;
    for (var i = 0; i < v.length; i++) {
      var s = n[i][0] * (cx - v[i][0]) + n[i][1] * (cy - v[i][1]);
      if (s > r + MARGIN) return;
      if (s > best) {
        best = s;
        bi = i;
      }
    }
    var v1 = v[bi],
      v2 = v[(bi + 1) % v.length];
    var nx = n[bi][0],
      ny = n[bi][1],
      sep = best - r;
    if (best > 1e-6) {
      var u1 = (cx - v1[0]) * (v2[0] - v1[0]) + (cy - v1[1]) * (v2[1] - v1[1]),
        u2 = (cx - v2[0]) * (v1[0] - v2[0]) + (cy - v2[1]) * (v1[1] - v2[1]);
      var cn = u1 <= 0 ? v1 : u2 <= 0 ? v2 : null;
      if (cn) {
        var dx = cx - cn[0],
          dy = cy - cn[1],
          d = Math.hypot(dx, dy);
        if (d - r > MARGIN) return;
        nx = dx / (d || 1);
        ny = dy / (d || 1);
        sep = d - r;
      }
    }
    var px = cx - nx * r,
      py = cy - ny * r;
    out.push(flip ? [px, py, -nx, -ny, sep, 1] : [px, py, nx, ny, sep, 1]);
  }
  function maxSep(P, Q) {
    var best = -1e9,
      bi = 0;
    for (var i = 0; i < P.wv.length; i++) {
      var nx = P.wn[i][0],
        ny = P.wn[i][1],
        vx = P.wv[i][0],
        vy = P.wv[i][1];
      var mn = 1e9;
      var _iterator3 = _createForOfIteratorHelper(Q.wv),
        _step3;
      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var q = _step3.value;
          var d = nx * (q[0] - vx) + ny * (q[1] - vy);
          if (d < mn) mn = d;
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }
      if (mn > best) {
        best = mn;
        bi = i;
      }
    }
    return [best, bi];
  }
  function pp(A, B, out) {
    var _maxSep = maxSep(A, B),
      _maxSep2 = _slicedToArray(_maxSep, 2),
      sa = _maxSep2[0],
      ea = _maxSep2[1];
    if (sa > MARGIN) return;
    var _maxSep3 = maxSep(B, A),
      _maxSep4 = _slicedToArray(_maxSep3, 2),
      sb = _maxSep4[0],
      eb = _maxSep4[1];
    if (sb > MARGIN) return;
    var R, I, e, flip;
    if (sb > sa * 0.98 + 0.001) {
      R = B;
      I = A;
      e = eb;
      flip = 1;
    } else {
      R = A;
      I = B;
      e = ea;
      flip = 0;
    }
    var n1x = R.wn[e][0],
      n1y = R.wn[e][1];
    var mi = 1e9,
      ie = 0;
    for (var i = 0; i < I.wn.length; i++) {
      var d = n1x * I.wn[i][0] + n1y * I.wn[i][1];
      if (d < mi) {
        mi = d;
        ie = i;
      }
    }
    var v11 = R.wv[e],
      v12 = R.wv[(e + 1) % R.wv.length];
    var tx = v12[0] - v11[0],
      ty = v12[1] - v11[1];
    var tl = Math.hypot(tx, ty) || 1;
    tx /= tl;
    ty /= tl;
    var p0 = I.wv[ie],
      p1 = I.wv[(ie + 1) % I.wv.length];
    var c0 = [p0[0], p0[1]],
      c1 = [p1[0], p1[1]];
    var clip = function clip(nx, ny, off) {
      var d0 = nx * c0[0] + ny * c0[1] - off,
        d1 = nx * c1[0] + ny * c1[1] - off;
      if (d0 > 0 && d1 > 0) return false;
      if (d0 > 0) {
        var t = d0 / (d0 - d1);
        c0 = [c0[0] + t * (c1[0] - c0[0]), c0[1] + t * (c1[1] - c0[1])];
      } else if (d1 > 0) {
        var _t = d0 / (d0 - d1);
        c1 = [c0[0] + _t * (c1[0] - c0[0]), c0[1] + _t * (c1[1] - c0[1])];
      }
      return true;
    };
    if (!clip(-tx, -ty, -(tx * v11[0] + ty * v11[1]))) return;
    if (!clip(tx, ty, tx * v12[0] + ty * v12[1])) return;
    var fo = n1x * v11[0] + n1y * v11[1],
      nx = flip ? -n1x : n1x,
      ny = flip ? -n1y : n1y;
    var s0 = n1x * c0[0] + n1y * c0[1] - fo,
      s1 = n1x * c1[0] + n1y * c1[1] - fo,
      id = 2 + flip * 1000 + e * 37 + ie * 7;
    if (s0 <= MARGIN) out.push([c0[0], c0[1], nx, ny, s0, id]);
    if (s1 <= MARGIN) out.push([c1[0], c1[1], nx, ny, s1, id + 1]);
  }
  function collide(A, B, out) {
    if (A.t === 0 && B.t === 0) cc(A, B, out);else if (A.t === 1 && B.t === 0) pc(A, B, out, 0);else if (A.t === 0 && B.t === 1) pc(B, A, out, 1);else pp(A, B, out);
  }
  function World() {
    this.bodies = [];
    this.joints = [];
    this.arb = new Map();
    this.grid = new Map();
    this.ground = body("static", 0, 0);
    this.ground.id = 0;
    this.onHit = null;
    this.carGroup = 1;
  }
  World.prototype.add = function (b) {
    mass(b);
    xform(b);
    this.bodies.push(b);
    return b;
  };
  World.prototype.seg = function (ax, ay, bx, by, f) {
    if (Math.hypot(bx - ax, by - ay) < 1e-4) return;
    var s = poly(this.ground, [[ax, ay], [bx, by]], {
      f: f == null ? 0.9 : f
    });
    s.ground = 1;
    s.gi = this.ground.sh.length - 1;
    for (var i = 0; i < 2; i++) {
      s.wv[i][0] = s.v[i][0];
      s.wv[i][1] = s.v[i][1];
      s.wn[i][0] = s.n[i][0];
      s.wn[i][1] = s.n[i][1];
    }
    s.bb = [Math.min(ax, bx), Math.min(ay, by), Math.max(ax, bx), Math.max(ay, by)];
    for (var k = Math.floor(s.bb[0] / 4); k <= Math.floor(s.bb[2] / 4); k++) {
      if (!this.grid.has(k)) this.grid.set(k, []);
      this.grid.get(k).push(s);
    }
  };
  World.prototype.pin = function (A, B, wx, wy) {
    var la = toLocal(A, wx, wy),
      lb = toLocal(B, wx, wy);
    var j = {
      t: "pin",
      A: A,
      B: B,
      la: la,
      lb: lb,
      P: [0, 0]
    };
    this.joints.push(j);
    return j;
  };
  World.prototype.wheel = function (A, B, mx, my, hz, zeta, maxT) {
    var j = {
      t: "wheel",
      A: A,
      B: B,
      la: [mx, my],
      ax: [0, 1],
      hz: hz,
      zeta: zeta,
      maxT: maxT,
      speed: 0,
      motor: false,
      Pp: 0,
      Ps: 0,
      Pm: 0
    };
    this.joints.push(j);
    return j;
  };
  World.prototype.rope = function (A, B, wax, way, wbx, wby) {
    var j = {
      t: "rope",
      A: A,
      B: B,
      la: toLocal(A, wax, way),
      lb: toLocal(B, wbx, wby),
      L: Math.hypot(wbx - wax, wby - way),
      P: 0
    };
    this.joints.push(j);
    return j;
  };
  function toLocal(b, wx, wy) {
    var c = Math.cos(b.a),
      s = Math.sin(b.a),
      dx = wx - b.x,
      dy = wy - b.y;
    return [c * dx + s * dy, -s * dx + c * dy];
  }
  var rot = function rot(b, l) {
    var c = Math.cos(b.a),
      s = Math.sin(b.a);
    return [c * l[0] - s * l[1], s * l[0] + c * l[1]];
  };
  World.prototype.step = function (dt) {
    var _this = this;
    var bs = this.bodies,
      idt = 1 / dt;
    var _iterator4 = _createForOfIteratorHelper(bs),
      _step4;
    try {
      for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
        var b = _step4.value;
        if (b.kind === "dyn") {
          b.vy += GRAV * dt;
          b.vx *= 0.9995;
          b.w *= 0.998;
        }
      }
    } catch (err) {
      _iterator4.e(err);
    } finally {
      _iterator4.f();
    }
    var seen = new Map(),
      tmp = [];
    var pair = function pair(A, sa, B, sb, key) {
      tmp.length = 0;
      collide(sa, sb, tmp);
      if (!tmp.length) return;
      if (_this.onHit) _this.onHit(sa, sb, tmp);
      var old = _this.arb.get(key),
        f = Math.sqrt(sa.f * sb.f);
      var cs = tmp.map(function (c) {
        var o = {
          px: c[0],
          py: c[1],
          nx: c[2],
          ny: c[3],
          sep: c[4],
          id: c[5],
          Pn: 0,
          Pt: 0
        };
        if (old) {
          var _iterator5 = _createForOfIteratorHelper(old.cs),
            _step5;
          try {
            for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
              var q = _step5.value;
              if (q.id === o.id) {
                o.Pn = q.Pn;
                o.Pt = q.Pt;
                break;
              }
            }
          } catch (err) {
            _iterator5.e(err);
          } finally {
            _iterator5.f();
          }
        }
        return o;
      });
      seen.set(key, {
        A: A,
        B: B,
        cs: cs,
        f: f
      });
    };
    for (var i = 0; i < bs.length; i++) {
      var A = bs[i];
      if (A.kind === "dyn" && !A.noG) {
        var _iterator6 = _createForOfIteratorHelper(A.sh),
          _step6;
        try {
          for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
            var sa = _step6.value;
            var k0 = Math.floor(sa.bb[0] / 4),
              k1 = Math.floor(sa.bb[2] / 4),
              done = new Set();
            for (var k = k0; k <= k1; k++) {
              var _L = this.grid.get(k);
              if (!_L) continue;
              var _iterator7 = _createForOfIteratorHelper(_L),
                _step7;
              try {
                for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
                  var g = _step7.value;
                  if (done.has(g) || !ovl(sa.bb, g.bb)) continue;
                  done.add(g);
                  pair(this.ground, g, A, sa, "g" + A.id + ":" + sa.si + ":" + g.gi);
                }
              } catch (err) {
                _iterator7.e(err);
              } finally {
                _iterator7.f();
              }
            }
          }
        } catch (err) {
          _iterator6.e(err);
        } finally {
          _iterator6.f();
        }
      }
      for (var j = i + 1; j < bs.length; j++) {
        var B = bs[j];
        if (A.kind !== "dyn" && B.kind !== "dyn") continue;
        if (A.group && A.group === B.group) continue;
        for (var p = 0; p < A.sh.length; p++) {
          var _sa = A.sh[p];
          for (var q = 0; q < B.sh.length; q++) {
            var sb = B.sh[q];
            if (ovl(_sa.bb, sb.bb)) pair(A, _sa, B, sb, A.id + ":" + p + ":" + B.id + ":" + q);
          }
        }
      }
    }
    this.arb = seen;
    var _iterator8 = _createForOfIteratorHelper(seen.values()),
      _step8;
    try {
      for (_iterator8.s(); !(_step8 = _iterator8.n()).done;) {
        var _ar = _step8.value;
        var _A2 = _ar.A,
          _B2 = _ar.B;
        var _iterator12 = _createForOfIteratorHelper(_ar.cs),
          _step12;
        try {
          for (_iterator12.s(); !(_step12 = _iterator12.n()).done;) {
            var _c = _step12.value;
            var rax = _c.px - _A2.x,
              ray = _c.py - _A2.y,
              rbx = _c.px - _B2.x,
              rby = _c.py - _B2.y;
            var rna = rax * _c.ny - ray * _c.nx,
              rnb = rbx * _c.ny - rby * _c.nx,
              _tx = _c.ny,
              _ty = -_c.nx;
            var rta = rax * _ty - ray * _tx,
              rtb = rbx * _ty - rby * _tx;
            _c.rax = rax;
            _c.ray = ray;
            _c.rbx = rbx;
            _c.rby = rby;
            _c.mn = 1 / (_A2.im + _B2.im + _A2.iI * rna * rna + _B2.iI * rnb * rnb || 1e9);
            _c.mt = 1 / (_A2.im + _B2.im + _A2.iI * rta * rta + _B2.iI * rtb * rtb || 1e9);
            _c.bias = _c.sep > 0 ? -_c.sep * idt : -BETA * idt * Math.min(0, _c.sep + SLOP);
            var _Px = _c.Pn * _c.nx + _c.Pt * _tx,
              _Py = _c.Pn * _c.ny + _c.Pt * _ty;
            _A2.vx -= _A2.im * _Px;
            _A2.vy -= _A2.im * _Py;
            _A2.w -= _A2.iI * (rax * _Py - ray * _Px);
            _B2.vx += _B2.im * _Px;
            _B2.vy += _B2.im * _Py;
            _B2.w += _B2.iI * (rbx * _Py - rby * _Px);
          }
        } catch (err) {
          _iterator12.e(err);
        } finally {
          _iterator12.f();
        }
      }
    } catch (err) {
      _iterator8.e(err);
    } finally {
      _iterator8.f();
    }
    var _iterator9 = _createForOfIteratorHelper(this.joints),
      _step9;
    try {
      for (_iterator9.s(); !(_step9 = _iterator9.n()).done;) {
        var _j2 = _step9.value;
        jPre(_j2, dt, idt);
      }
    } catch (err) {
      _iterator9.e(err);
    } finally {
      _iterator9.f();
    }
    for (var it = 0; it < ITER; it++) {
      var _iterator0 = _createForOfIteratorHelper(this.joints),
        _step0;
      try {
        for (_iterator0.s(); !(_step0 = _iterator0.n()).done;) {
          var _j = _step0.value;
          jApply(_j, dt);
        }
      } catch (err) {
        _iterator0.e(err);
      } finally {
        _iterator0.f();
      }
      var _iterator1 = _createForOfIteratorHelper(seen.values()),
        _step1;
      try {
        for (_iterator1.s(); !(_step1 = _iterator1.n()).done;) {
          var ar = _step1.value;
          var _A = ar.A,
            _B = ar.B;
          var _iterator10 = _createForOfIteratorHelper(ar.cs),
            _step10;
          try {
            for (_iterator10.s(); !(_step10 = _iterator10.n()).done;) {
              var c = _step10.value;
              var dvx = _B.vx - _B.w * c.rby - _A.vx + _A.w * c.ray,
                dvy = _B.vy + _B.w * c.rbx - _A.vy - _A.w * c.rax;
              var vn = dvx * c.nx + dvy * c.ny;
              var dPn = c.mn * (-vn + c.bias);
              var P0 = c.Pn;
              c.Pn = Math.max(P0 + dPn, 0);
              dPn = c.Pn - P0;
              var Px = dPn * c.nx,
                Py = dPn * c.ny;
              _A.vx -= _A.im * Px;
              _A.vy -= _A.im * Py;
              _A.w -= _A.iI * (c.rax * Py - c.ray * Px);
              _B.vx += _B.im * Px;
              _B.vy += _B.im * Py;
              _B.w += _B.iI * (c.rbx * Py - c.rby * Px);
              dvx = _B.vx - _B.w * c.rby - _A.vx + _A.w * c.ray;
              dvy = _B.vy + _B.w * c.rbx - _A.vy - _A.w * c.rax;
              var tx = c.ny,
                ty = -c.nx,
                vt = dvx * tx + dvy * ty,
                mx = ar.f * c.Pn;
              var dPt = c.mt * -vt;
              var T0 = c.Pt;
              c.Pt = Math.max(-mx, Math.min(mx, T0 + dPt));
              dPt = c.Pt - T0;
              Px = dPt * tx;
              Py = dPt * ty;
              _A.vx -= _A.im * Px;
              _A.vy -= _A.im * Py;
              _A.w -= _A.iI * (c.rax * Py - c.ray * Px);
              _B.vx += _B.im * Px;
              _B.vy += _B.im * Py;
              _B.w += _B.iI * (c.rbx * Py - c.rby * Px);
            }
          } catch (err) {
            _iterator10.e(err);
          } finally {
            _iterator10.f();
          }
        }
      } catch (err) {
        _iterator1.e(err);
      } finally {
        _iterator1.f();
      }
    }
    var _iterator11 = _createForOfIteratorHelper(bs),
      _step11;
    try {
      for (_iterator11.s(); !(_step11 = _iterator11.n()).done;) {
        var _b = _step11.value;
        if (_b.kind !== "static") {
          _b.x += _b.vx * dt;
          _b.y += _b.vy * dt;
          _b.a += _b.w * dt;
          xform(_b);
        }
      }
    } catch (err) {
      _iterator11.e(err);
    } finally {
      _iterator11.f();
    }
  };
  function jPre(j, dt, idt) {
    var A = j.A,
      B = j.B;
    if (j.t === "pin") {
      var ra = rot(A, j.la),
        rb = rot(B, j.lb);
      j.ra = ra;
      j.rb = rb;
      var k11 = A.im + B.im + A.iI * ra[1] * ra[1] + B.iI * rb[1] * rb[1],
        k12 = -A.iI * ra[0] * ra[1] - B.iI * rb[0] * rb[1],
        k22 = A.im + B.im + A.iI * ra[0] * ra[0] + B.iI * rb[0] * rb[0];
      var det = k11 * k22 - k12 * k12 || 1e-9;
      j.M = [k22 / det, -k12 / det, k11 / det];
      j.bx = -BETA * idt * (B.x + rb[0] - A.x - ra[0]);
      j.by = -BETA * idt * (B.y + rb[1] - A.y - ra[1]);
      var P = j.P;
      A.vx -= A.im * P[0];
      A.vy -= A.im * P[1];
      A.w -= A.iI * (ra[0] * P[1] - ra[1] * P[0]);
      B.vx += B.im * P[0];
      B.vy += B.im * P[1];
      B.w += B.iI * (rb[0] * P[1] - rb[1] * P[0]);
    } else if (j.t === "rope") {
      var _ra = rot(A, j.la),
        _rb = rot(B, j.lb);
      j.ra = _ra;
      j.rb = _rb;
      var ux = B.x + _rb[0] - A.x - _ra[0],
        uy = B.y + _rb[1] - A.y - _ra[1];
      var _L2 = Math.hypot(ux, uy) || 1;
      ux /= _L2;
      uy /= _L2;
      j.u = [ux, uy];
      var ca = _ra[0] * uy - _ra[1] * ux,
        cb = _rb[0] * uy - _rb[1] * ux;
      j.m = 1 / (A.im + B.im + A.iI * ca * ca + B.iI * cb * cb || 1e9);
      j.bias = -BETA * idt * (_L2 - j.L);
      var Px = j.P * ux,
        Py = j.P * uy;
      A.vx -= A.im * Px;
      A.vy -= A.im * Py;
      A.w -= A.iI * (_ra[0] * Py - _ra[1] * Px);
      B.vx += B.im * Px;
      B.vy += B.im * Py;
      B.w += B.iI * (_rb[0] * Py - _rb[1] * Px);
    } else {
      var _ra2 = rot(A, j.la),
        ax = rot(A, j.ax),
        px = -ax[1],
        py = ax[0];
      var dx = B.x - A.x - _ra2[0],
        dy = B.y - A.y - _ra2[1];
      j.ra = _ra2;
      j.axw = ax;
      j.pw = [px, py];
      j.sp = (dx + _ra2[0]) * py - (dy + _ra2[1]) * px;
      j.mp = 1 / (A.im + B.im + A.iI * j.sp * j.sp || 1e9);
      j.bp = -BETA * idt * (dx * px + dy * py);
      j.ss = (dx + _ra2[0]) * ax[1] - (dy + _ra2[1]) * ax[0];
      var inv = A.im + B.im + A.iI * j.ss * j.ss,
        m = inv > 0 ? 1 / inv : 0,
        om = 2 * Math.PI * j.hz;
      var k = m * om * om,
        c = 2 * m * j.zeta * om,
        C = dx * ax[0] + dy * ax[1];
      j.gam = dt * (c + dt * k);
      j.gam = j.gam > 0 ? 1 / j.gam : 0;
      j.bs = C * dt * k * j.gam;
      j.ms = inv + j.gam > 0 ? 1 / (inv + j.gam) : 0;
      j.mm = 1 / (REACT * A.iI + B.iI || 1e9);
      if (!j.motor) j.Pm = 0;
      var _Px2 = j.Pp * px + j.Ps * ax[0],
        _Py2 = j.Pp * py + j.Ps * ax[1];
      A.vx -= A.im * _Px2;
      A.vy -= A.im * _Py2;
      A.w -= A.iI * (j.Pp * j.sp + j.Ps * j.ss + REACT * j.Pm);
      B.vx += B.im * _Px2;
      B.vy += B.im * _Py2;
      B.w += B.iI * j.Pm;
    }
  }
  function jApply(j, dt) {
    var A = j.A,
      B = j.B;
    if (j.t === "pin") {
      var ra = j.ra,
        rb = j.rb;
      var dvx = B.vx - B.w * rb[1] - A.vx + A.w * ra[1],
        dvy = B.vy + B.w * rb[0] - A.vy - A.w * ra[0];
      var bx = j.bx - dvx,
        by = j.by - dvy,
        Px = j.M[0] * bx + j.M[1] * by,
        Py = j.M[1] * bx + j.M[2] * by;
      j.P[0] += Px;
      j.P[1] += Py;
      A.vx -= A.im * Px;
      A.vy -= A.im * Py;
      A.w -= A.iI * (ra[0] * Py - ra[1] * Px);
      B.vx += B.im * Px;
      B.vy += B.im * Py;
      B.w += B.iI * (rb[0] * Py - rb[1] * Px);
    } else if (j.t === "rope") {
      var _ra3 = j.ra,
        _rb2 = j.rb,
        u = j.u;
      var _dvx = B.vx - B.w * _rb2[1] - A.vx + A.w * _ra3[1],
        _dvy = B.vy + B.w * _rb2[0] - A.vy - A.w * _ra3[0];
      var P = j.m * (j.bias - (_dvx * u[0] + _dvy * u[1]));
      j.P += P;
      var _Px3 = P * u[0],
        _Py3 = P * u[1];
      A.vx -= A.im * _Px3;
      A.vy -= A.im * _Py3;
      A.w -= A.iI * (_ra3[0] * _Py3 - _ra3[1] * _Px3);
      B.vx += B.im * _Px3;
      B.vy += B.im * _Py3;
      B.w += B.iI * (_rb2[0] * _Py3 - _rb2[1] * _Px3);
    } else {
      if (j.motor) {
        var _Cd = B.w - A.w - j.speed,
          mx = j.maxT * dt;
        var _P = -j.mm * _Cd;
        var o = j.Pm;
        j.Pm = Math.max(-mx, Math.min(mx, o + _P));
        _P = j.Pm - o;
        A.w -= REACT * A.iI * _P;
        B.w += B.iI * _P;
      }
      var ax = j.axw,
        pw = j.pw;
      var Cd = (B.vx - A.vx) * ax[0] + (B.vy - A.vy) * ax[1] - A.w * j.ss;
      var _P2 = -j.ms * (Cd + j.bs + j.gam * j.Ps);
      j.Ps += _P2;
      A.vx -= A.im * _P2 * ax[0];
      A.vy -= A.im * _P2 * ax[1];
      A.w -= A.iI * _P2 * j.ss;
      B.vx += B.im * _P2 * ax[0];
      B.vy += B.im * _P2 * ax[1];
      Cd = (B.vx - A.vx) * pw[0] + (B.vy - A.vy) * pw[1] - A.w * j.sp;
      _P2 = j.mp * (j.bp - Cd);
      j.Pp += _P2;
      A.vx -= A.im * _P2 * pw[0];
      A.vy -= A.im * _P2 * pw[1];
      A.w -= A.iI * _P2 * j.sp;
      B.vx += B.im * _P2 * pw[0];
      B.vy += B.im * _P2 * pw[1];
    }
  }
  var CARS = {
    jeep: {
      name: "JEEP",
      col: "#e63946",
      den: 1,
      hz: 4.2,
      zeta: 0.7,
      speed: 30,
      air: 6,
      rim: "#ddd",
      body: [[[-1.55, -0.3], [1.55, -0.3], [1.6, 0.1], [1.05, 0.32], [-1.55, 0.35]]],
      head: [-0.2, 0.78, 0.3],
      wind: [0.35, 0.33, 0.12, 0.9],
      wheels: [[-1.05, -0.38, 0.48, 9], [1.05, -0.38, 0.48, 9]]
    },
    truck: {
      name: "PICKUP",
      col: "#2a9df4",
      den: 1,
      hz: 4,
      zeta: 0.7,
      speed: 28,
      air: 5,
      rim: "#eee",
      body: [[[-2.0, -0.3], [2.0, -0.3], [2.05, 0.25], [-2.0, 0.3]]],
      cab: [[-0.55, 0.28], [0.85, 0.28], [0.5, 1.0], [-0.55, 1.0]],
      head: [0.0, 0.7, 0.26],
      wheels: [[-1.35, -0.4, 0.5, 11], [1.35, -0.4, 0.5, 11]]
    },
    monster: {
      name: "MONSTER",
      col: "#8e44ad",
      den: 1,
      hz: 2.6,
      zeta: 0.55,
      speed: 20,
      air: 5,
      rim: "#f1c40f",
      body: [[[-1.6, -0.15], [1.7, -0.15], [1.75, 0.35], [-1.6, 0.4]]],
      cab: [[-0.6, 0.38], [0.6, 0.38], [0.35, 1.0], [-0.6, 1.0]],
      head: [-0.1, 0.72, 0.26],
      wheels: [[-1.25, -0.7, 0.85, 22], [1.25, -0.7, 0.85, 22]],
      wf: 1.3
    },
    buggy: {
      name: "BUGGY",
      col: "#f4a300",
      den: 0.8,
      hz: 3.4,
      zeta: 0.6,
      speed: 34,
      air: 7,
      rim: "#333",
      body: [[[-1.2, -0.18], [1.3, -0.18], [1.05, 0.28], [-1.2, 0.3]]],
      head: [-0.25, 0.72, 0.28],
      cage: 1,
      wheels: [[-0.95, -0.38, 0.55, 8], [0.95, -0.38, 0.55, 8]]
    },
    racer: {
      name: "RACER",
      col: "#1abc9c",
      den: 1,
      hz: 5.5,
      zeta: 0.8,
      speed: 44,
      air: 5,
      rim: "#bbb",
      body: [[[-1.8, -0.2], [1.95, -0.2], [1.95, 0.0], [0.6, 0.28], [-1.8, 0.3]]],
      head: [-0.45, 0.57, 0.27],
      wind: [0.15, 0.3, -0.1, 0.62],
      spoiler: 1,
      wheels: [[-1.25, -0.28, 0.42, 9], [1.3, -0.28, 0.42, 9]]
    },
    bus: {
      name: "BUS",
      col: "#ffc93c",
      den: 1,
      hz: 3.5,
      zeta: 0.7,
      speed: 24,
      air: 3,
      rim: "#ccc",
      body: [[[-2.7, -0.35], [2.7, -0.35], [2.7, 1.3], [-2.7, 1.3]]],
      roof: [[-2.7, 1.3], [2.7, 1.3], [2.6, 1.5], [-2.6, 1.5]],
      head: [2.05, 0.75, 0.26],
      wheels: [[-1.85, -0.45, 0.52, 14], [1.85, -0.45, 0.52, 14]]
    },
    tank: {
      name: "TANK",
      col: "#5b7a3a",
      den: 1,
      hz: 5,
      zeta: 0.8,
      speed: 26,
      air: 3,
      rim: "#444",
      tread: 1,
      body: [[[-1.8, -0.15], [1.8, -0.15], [1.55, 0.42], [-1.65, 0.42]]],
      cab: [[-0.7, 0.4], [0.7, 0.4], [0.5, 0.85], [-0.5, 0.85]],
      head: [-0.1, 1.1, 0.27],
      gun: 1,
      wheels: [[-1.45, -0.42, 0.33, 7], [-0.73, -0.45, 0.33, 7], [0, -0.45, 0.33, 7], [0.73, -0.45, 0.33, 7], [1.45, -0.42, 0.33, 7]],
      wf: 1.4
    },
    tractor: {
      name: "TRACTOR",
      col: "#27ae60",
      den: 1,
      hz: 3.5,
      zeta: 0.7,
      speed: 18,
      air: 4,
      rim: "#f39c12",
      body: [[[-1.1, -0.15], [1.45, -0.15], [1.45, 0.4], [-1.1, 0.45]]],
      cab: [[-1.05, 0.43], [0.0, 0.43], [-0.1, 1.25], [-1.0, 1.25]],
      head: [-0.55, 0.88, 0.27],
      open: 1,
      wheels: [[-0.75, -0.2, 0.85, 26], [1.05, -0.5, 0.45, 6]],
      wf: 1.3
    }
  };
  function makeCar(W, kind, x, y) {
    var D = CARS[kind],
      ch = body("dyn", x, y);
    ch.group = W.carGroup;
    ch.car = D;
    D.body.forEach(function (v) {
      return poly(ch, v, {
        den: D.den,
        f: 0.5
      });
    });
    if (D.cab) poly(ch, D.cab, {
      den: D.den * 0.4,
      f: 0.5,
      kill: true
    });
    if (D.roof) poly(ch, D.roof, {
      den: D.den * 0.4,
      f: 0.5,
      kill: true
    });
    var hd = circ(ch, D.head[0], D.head[1], D.head[2], {
      den: 0.2,
      kill: true,
      f: 0.5
    });
    hd.head = 1;
    W.add(ch);
    var wheels = D.wheels.map(function (w) {
      var b = body("dyn", x + w[0], y + w[1]);
      b.group = W.carGroup;
      circ(b, 0, 0, w[2], {
        den: 0.9,
        f: D.wf || 1.1
      });
      W.add(b);
      var j = W.wheel(ch, b, w[0], w[1], D.hz, D.zeta, w[3]);
      b.j = j;
      b.r = w[2];
      return b;
    });
    return {
      ch: ch,
      wheels: wheels,
      D: D
    };
  }
  var L = function L(name, car, th, ops) {
    return {
      name: name,
      car: car,
      th: th,
      ops: ops
    };
  };
  var LEVELS = [L("First Drive", "jeep", 0, [["f", 25], ["h", 24, 0.5, 4], ["f", 8], ["c", 12, 2.5], ["f", 6], ["c", 12, -2.5], ["f", 10]]), L("Hill Hopper", "jeep", 0, [["f", 15], ["c", 14, 4], ["f", 4], ["c", 14, -4], ["f", 4], ["c", 16, 6], ["f", 6], ["c", 18, -6], ["h", 20, 0.8, 3]]), L("Mind the Gap", "jeep", 0, [["f", 22], ["s", 7, 1.6], ["gap", 4, -1.6], ["f", 14], ["s", 7, 1.8], ["gap", 6, -1.8], ["f", 14], ["c", 8, 2], ["gap", 5, -1], ["f", 10]]), L("Rope Bridge", "truck", 0, [["f", 18], ["br", 14, 10, "hinge"], ["f", 10], ["c", 8, 1.5], ["br", 18, 12, "hinge"], ["f", 12]]), L("Box Bash", "truck", 0, [["f", 16], ["bx", 6, 1, 0], ["f", 18], ["bx", 6, 1, 0], ["f", 14], ["c", 10, 3], ["f", 8], ["bx", 6, 1, 0], ["f", 12], ["c", 10, -3]]), L("Teeter Totter", "jeep", 0, [["f", 18], ["see", 10, 0], ["f", 12], ["see", 12, 2], ["f", 10], ["see", 12, 3], ["f", 8]]), L("Monster Steps", "monster", 1, [["f", 15], ["st", 0.5], ["f", 6], ["st", 0.6], ["f", 6], ["st", 0.7], ["f", 8], ["st", -1.8], ["f", 8], ["bl", 5, 0.5, 2], ["f", 16], ["h", 20, 1.4, 3]]), L("Crumbly Bridge", "buggy", 1, [["f", 22], ["br", 20, 14, "crumble"], ["f", 12], ["br", 24, 16, "crumble"], ["f", 12]]), L("Going Up", "jeep", 0, [["f", 16], ["el", 6, 4], ["f", 10], ["el", 6, 5], ["f", 8], ["c", 16, -9], ["f", 6]]), L("Wrecking Ball", "bus", 2, [["f", 20], ["wr", 6, 5], ["f", 18], ["wr", 8, 5], ["f", 14], ["wr", 6, 4.5], ["f", 14]]), L("Tank Hill", "tank", 2, [["f", 14], ["c", 10, 4], ["f", 3], ["bx", 6, 1, 0], ["f", 10], ["c", 10, 4], ["f", 6], ["st", -2], ["f", 8], ["c", 12, -6]]), L("Crusher Alley", "racer", 3, [["f", 22], ["cr", 4, 0], ["f", 14], ["cr", 4, 0.8], ["f", 14], ["cr", 4, 1.6], ["f", 12]]), L("Big Air", "racer", 1, [["f", 20], ["bo", 10], ["s", 10, 2.5], ["gap", 12, -2.5], ["f", 18], ["bo", 10], ["s", 10, 3], ["gap", 16, -3], ["f", 16]]), L("Boing!", "buggy", 0, [["f", 16], ["sp", 0, 13], ["f", 3], ["st", 3.5, "v"], ["f", 10], ["sp", 0, 13], ["f", 3], ["st", 3.5, "v"], ["f", 8], ["sp", 2, 12], ["gap", 7, 0], ["f", 12]]), L("Slider", "jeep", 3, [["f", 16], ["mv", 12], ["f", 8], ["mv", 16], ["f", 10]]), L("Low Bridge", "truck", 2, [["f", 14], ["ce", 26, 2.65], ["h", 26, 0.35, 3], ["f", 10], ["ce", 20, 2.7], ["h", 20, 0.3, 2], ["f", 10]]), L("Tractor Pull", "tractor", 0, [["f", 14], ["bx", 6, 1, 0], ["f", 12], ["c", 12, 5], ["f", 4], ["bl", 6, 0.6, 0], ["f", 10], ["c", 12, -5], ["st", 0.8], ["f", 8]]), L("Swing Set", "jeep", 1, [["f", 18], ["br", 16, 12, "hinge"], ["wr", -8, 5], ["f", 10], ["br", 16, 12, "hinge"], ["wr", -8, 5], ["f", 10]]), L("Monster Mash", "monster", 1, [["f", 14], ["bx", 6, 1, 0], ["f", 12], ["s", 6, 2], ["gap", 6, -2], ["f", 6], ["bx", 6, 1, 0], ["f", 10], ["st", 0.7], ["f", 5], ["st", 0.7], ["f", 8], ["c", 10, -1.4]]), L("Elevator Music", "buggy", 3, [["f", 16], ["el", 5, 3], ["f", 4], ["el", 5, 3], ["f", 4], ["el", 5, -6], ["f", 10], ["mv", 12], ["f", 10]]), L("Bus Route", "bus", 0, [["f", 16], ["c", 12, 3], ["f", 6], ["br", 16, 12, "hinge"], ["f", 6], ["see", 12, 0], ["f", 8], ["c", 12, -3], ["bx", 6, 1, 4], ["f", 16]]), L("Crush Hour", "jeep", 3, [["f", 18], ["cr", 4, 0], ["f", 10], ["cr", 4, 0.4], ["f", 12], ["el", 6, 3], ["f", 4], ["cr", 4, 0.7], ["f", 12]]), L("Tank Trap", "tank", 2, [["f", 14], ["c", 4, 1], ["f", 4], ["c", 4, 1], ["f", 4], ["br", 14, 10, "crumble"], ["f", 8], ["see", 12, 2], ["f", 10]]), L("Ski Jump", "racer", 4, [["f", 10], ["c", 24, -8], ["bo", 8], ["s", 8, 2], ["gap", 18, -6], ["c", 10, -2], ["f", 14], ["bo", 8], ["s", 8, 2.5], ["gap", 14, -2.5], ["f", 14]]), L("Snow Plow", "tractor", 4, [["f", 12], ["bx", 5, 1, 0], ["f", 16], ["c", 10, 3], ["f", 6], ["bl", 8, 0.5, 0], ["f", 12], ["c", 10, -3], ["f", 18]]), L("Double Trouble", "buggy", 4, [["f", 16], ["see", 12, 2], ["f", 4], ["wr", 3, 5], ["f", 6], ["br", 16, 12, "crumble"], ["f", 6], ["sp", 0, 13], ["f", 3], ["st", 3.5, "v"], ["f", 10]]), L("Night Drive", "jeep", 5, [["f", 16], ["h", 20, 1, 4], ["s", 6, 2], ["gap", 5, -2], ["f", 8], ["mv", 12], ["f", 6], ["el", 6, 4], ["f", 8], ["c", 14, -4]]), L("Monster Madness", "monster", 5, [["f", 14], ["st", 0.7], ["f", 5], ["st", 0.7], ["f", 6], ["see", 12, 0], ["f", 6], ["bx", 6, 1, 0], ["f", 10], ["s", 6, 2], ["gap", 7, -3.2], ["f", 12]]), L("Bus Stop", "bus", 5, [["f", 16], ["wr", 6, 5.5], ["f", 14], ["el", 7, 3], ["f", 8], ["cr", 6, 0], ["f", 10], ["br", 16, 12, "crumble"], ["f", 10]]), L("The Gauntlet", "racer", 5, [["f", 18], ["cr", 6, 0], ["f", 8], ["bo", 8], ["s", 8, 2], ["gap", 10, -2], ["f", 8], ["br", 16, 12, "crumble"], ["f", 6], ["wr", 4, 4.5], ["f", 8], ["mv", 14], ["f", 10], ["bo", 6], ["s", 6, 1.5], ["gap", 8, -1.5], ["f", 12]])];
  var THEMES = [{
    sky: ["#6ec6ff", "#d6f0ff"],
    dirt: "#8a5a35",
    top: "#5cc142",
    hill: "#9ad38a",
    hill2: "#7cc06b"
  }, {
    sky: ["#ffb36b", "#ffe2b8"],
    dirt: "#9b6b3e",
    top: "#7dbf3c",
    hill: "#e9b384",
    hill2: "#d99d6b"
  }, {
    sky: ["#8ed1fc", "#e8f7ff"],
    dirt: "#6d6d74",
    top: "#a3a3ab",
    hill: "#b9c7d6",
    hill2: "#9fb0c2"
  }, {
    sky: ["#f6d365", "#fda085"],
    dirt: "#b5723c",
    top: "#e0a458",
    hill: "#e8b06b",
    hill2: "#d4974f"
  }, {
    sky: ["#a1c4fd", "#eef4ff"],
    dirt: "#7a8ea6",
    top: "#ffffff",
    hill: "#dfe9f5",
    hill2: "#c9d8ea"
  }, {
    sky: ["#0f1a3a", "#2b3a67"],
    dirt: "#3b2a3f",
    top: "#6b4e8a",
    hill: "#26305a",
    hill2: "#1d2549",
    night: 1
  }];
  function build(li) {
    BID = 0;
    var W = new World(),
      lv = LEVELS[li],
      parts = [];
    var pieces = [],
      roofs = [],
      hz = [],
      springs = [],
      boosts = [],
      deco = [];
    var x = 0,
      y = 0,
      piece = [[-30, 20], [-30, 0], [0, 0]],
      minY = 0;
    var pt = function pt(nx, ny) {
      x = nx;
      y = ny;
      piece.push([x, y]);
      minY = Math.min(minY, y);
    };
    var endPiece = function endPiece() {
      piece.push([x, y - 40]);
      pieces.push(piece);
    };
    var newPiece = function newPiece(nx, ny) {
      x = nx;
      y = ny;
      piece = [[x, y - 40], [x, y]];
      minY = Math.min(minY, y);
    };
    var grp = 10;
    var _iterator13 = _createForOfIteratorHelper(lv.ops),
      _step13;
    try {
      for (_iterator13.s(); !(_step13 = _iterator13.n()).done;) {
        var op = _step13.value;
        var k = op[0];
        if (k === "f") pt(x + op[1], y);else if (k === "s") pt(x + op[1], y + op[2]);else if (k === "st") {
          if (op[1] > 0 && !op[2]) pt(x + op[1] * 0.45, y + op[1]);else if (op[1] > 0) {
            pt(x, y + op[1]);
            pt(x + 0.01, y);
          } else {
            pt(x, y + op[1]);
            pt(x + 0.01, y);
          }
        } else if (k === "c") {
          var x0 = x,
            y0 = y,
            n = Math.max(4, Math.ceil(op[1] / 0.8));
          for (var _i3 = 1; _i3 <= n; _i3++) pt(x0 + op[1] * _i3 / n, y0 + op[2] * (1 - Math.cos(Math.PI * _i3 / n)) / 2);
        } else if (k === "h") {
          var _x = x,
            _y = y,
            _n = Math.ceil(op[1] / 0.6);
          for (var _i4 = 1; _i4 <= _n; _i4++) pt(_x + op[1] * _i4 / _n, _y + op[2] * (1 - Math.cos(2 * Math.PI * op[3] * _i4 / _n)) / 2);
        } else if (k === "gap") {
          endPiece();
          newPiece(x + op[1], y + (op[2] || 0));
        } else if (k === "br") {
          var len = op[1],
            _n2 = op[2],
            crum = op[3] === "crumble",
            w = len / _n2,
            _x2 = x,
            g = ++grp;
          endPiece();
          var prev = W.ground;
          for (var _i5 = 0; _i5 < _n2; _i5++) {
            var b = body(crum ? "static" : "dyn", _x2 + w * (_i5 + 0.5), y - 0.13);
            b.group = g;
            b.noG = true;
            b.plank = 1;
            box(b, w / 2 - (crum ? 0.03 : 0), 0.13, 0, 0, {
              den: 0.6,
              f: 0.9
            });
            W.add(b);
            parts.push(b);
            if (crum) {
              b.crumble = 1;
              continue;
            }
            W.pin(prev, b, _x2 + w * _i5, y - 0.13);
            prev = b;
          }
          if (!crum) W.pin(prev, W.ground, _x2 + len, y - 0.13);
          newPiece(_x2 + len, y);
        } else if (k === "see") {
          var _len = op[1],
            dy = op[2],
            _x3 = x,
            _y2 = y;
          endPiece();
          var hy = Math.max(_y2, _y2 + dy) + 0.55,
            pl = _len + 2.4,
            cx = _x3 + _len / 2;
          var a0 = Math.asin(Math.min(0.9, (hy - _y2 - 0.15) / (pl / 2)));
          var _b2 = body("dyn", cx, hy, a0);
          _b2.see = 1;
          box(_b2, pl / 2, 0.15, 0, 0, {
            den: 0.5,
            f: 0.9
          });
          W.add(_b2);
          parts.push(_b2);
          W.pin(W.ground, _b2, cx, hy);
          deco.push({
            k: "pivot",
            x: cx,
            y: hy,
            y0: Math.min(_y2, _y2 + dy) - 2
          });
          newPiece(_x3 + _len, _y2 + dy);
        } else if (k === "el") {
          var _len2 = op[1],
            _dy = op[2],
            _x4 = x,
            _y3 = y;
          endPiece();
          var _b3 = body("kin", _x4 + _len2 / 2, _y3 - 0.2);
          _b3.elev = {
            y0: _y3 - 0.2,
            dy: _dy,
            mv: 1 + Math.abs(_dy) * 0.3
          };
          box(_b3, _len2 / 2 - 0.12, 0.2, 0, 0, {
            f: 1
          });
          W.add(_b3);
          parts.push(_b3);
          newPiece(_x4 + _len2, _y3 + _dy);
        } else if (k === "mv") {
          var _len3 = op[1],
            _x5 = x,
            _y4 = y,
            pw = 5.2;
          endPiece();
          var _b4 = body("kin", _x5 + 0.15 + pw / 2, _y4 - 0.2);
          _b4.slide = {
            x0: _x5 + 0.15 + pw / 2,
            dx: _len3 - 0.3 - pw,
            mv: 1 + _len3 * 0.15
          };
          box(_b4, pw / 2, 0.2, 0, 0, {
            f: 1
          });
          W.add(_b4);
          parts.push(_b4);
          newPiece(_x5 + _len3, _y4);
        } else if (k === "bx") {
          var _n3 = op[1],
            s = op[2],
            _x6 = x + (op[3] || 0) + 0.5;
          var left = _n3,
            row = 0;
          while (left > 0) {
            var inRow = row ? left : Math.min(left, Math.ceil((_n3 + 1) / 2));
            for (var _i6 = 0; _i6 < inRow; _i6++) {
              var _b5 = body("dyn", _x6 + (_i6 + row * 0.5) * (s + 0.02) + s / 2, y + s / 2 + row * s + 0.01);
              _b5.crate = s;
              box(_b5, s / 2, s / 2, 0, 0, {
                den: 0.08,
                f: 0.3
              });
              W.add(_b5);
              parts.push(_b5);
            }
            left -= inRow;
            row++;
          }
        } else if (k === "bl") {
          var _n4 = op[1],
            _r = op[2],
            _x7 = x + (op[3] || 0) + _r;
          for (var _i7 = 0; _i7 < _n4; _i7++) {
            var _b6 = body("dyn", _x7 + _i7 * (2 * _r + 0.05), y + _r + 0.01);
            _b6.ball = _r;
            circ(_b6, 0, 0, _r, {
              den: 0.3,
              f: 0.8
            });
            W.add(_b6);
            parts.push(_b6);
          }
        } else if (k === "wr") {
          var ax = x + op[1],
            _len4 = op[2],
            ay = y + _len4 + 1.15,
            _r2 = 0.75;
          var _b7 = body("dyn", ax + _len4 * Math.sin(1.1), ay - _len4 * Math.cos(1.1));
          _b7.wreck = {
            ax: ax,
            ay: ay,
            r: _r2
          };
          _b7.noG = true;
          circ(_b7, 0, 0, _r2, {
            den: 2,
            f: 0.4
          });
          W.add(_b7);
          parts.push(_b7);
          W.rope(W.ground, _b7, ax, ay, _b7.x, _b7.y);
        } else if (k === "cr") {
          var _w = op[1],
            _cx = x + _w / 2 + 1,
            top = y + 6.5,
            low = y + 1.45 + 1.5;
          var _b8 = body("kin", _cx, top);
          _b8.crush = {
            top: top,
            low: low,
            per: 4,
            t: op[2] || 0
          };
          box(_b8, _w / 2, 1.5, 0, 0, {
            f: 0.5
          });
          W.add(_b8);
          parts.push(_b8);
        } else if (k === "sp") {
          var sx = x + op[1];
          springs.push({
            x0: sx,
            x1: sx + 1.8,
            y: y,
            v: op[2],
            t: 0
          });
        } else if (k === "bo") {
          boosts.push({
            x0: x,
            x1: x + op[1],
            y: y
          });
          pt(x + op[1], y);
        } else if (k === "ce") {
          roofs.push({
            x0: x,
            x1: x + op[1],
            y: y + op[2]
          });
        }
      }
    } catch (err) {
      _iterator13.e(err);
    } finally {
      _iterator13.f();
    }
    pt(x + 6, y);
    var fin = x;
    pt(x + 40, y);
    endPiece();
    for (var _i = 0, _pieces = pieces; _i < _pieces.length; _i++) {
      var p = _pieces[_i];
      for (var i = 0; i + 1 < p.length; i++) W.seg(p[i][0], p[i][1], p[i + 1][0], p[i + 1][1]);
    }
    for (var _i2 = 0, _roofs = roofs; _i2 < _roofs.length; _i2++) {
      var r = _roofs[_i2];
      W.seg(r.x0, r.y, r.x1, r.y);
      W.seg(r.x0, r.y, r.x0, r.y + 20);
      W.seg(r.x1, r.y, r.x1, r.y + 20);
    }
    var car = makeCar(W, lv.car, 4, 0.2 - Math.min.apply(Math, _toConsumableArray(CARS[lv.car].wheels.map(function (w) {
      return w[1] - w[2];
    }))));
    return {
      W: W,
      lv: lv,
      pieces: pieces,
      roofs: roofs,
      springs: springs,
      boosts: boosts,
      deco: deco,
      parts: parts,
      car: car,
      fin: fin,
      minY: minY,
      th: THEMES[lv.th]
    };
  }
  function script(L, dt, t) {
    var _iterator14 = _createForOfIteratorHelper(L.parts),
      _step14;
    try {
      for (_iterator14.s(); !(_step14 = _iterator14.n()).done;) {
        var b = _step14.value;
        if (b.elev) {
          var e = b.elev;
          b.vy = (e.y0 + e.dy * shuttle(t + dt, e.mv) - b.y) / dt;
        } else if (b.slide) {
          var _e = b.slide;
          b.vx = (_e.x0 + _e.dx * shuttle(t + dt, _e.mv) - b.x) / dt;
        } else if (b.crush) {
          var c = b.crush,
            p = ((t + dt) / c.per + c.t) % 1;
          var f = p < 0.55 ? 0 : p < 0.62 ? Math.pow((p - 0.55) / 0.07, 2) : p < 0.75 ? 1 : 1 - (p - 0.75) / 0.25;
          b.vy = (c.top + (c.low - c.top) * f - b.y) / dt;
        } else if (b.crumble && b.hitT != null && b.kind === "static") {
          b.hitT -= dt;
          if (b.hitT <= 0) {
            b.kind = "dyn";
            mass(b);
            b.w = (Math.random() - 0.5) * 0.6;
          }
        }
      }
    } catch (err) {
      _iterator14.e(err);
    } finally {
      _iterator14.f();
    }
  }
  var DWELL = 2.2;
  function shuttle(t, mv) {
    var cyc = 2 * (DWELL + mv),
      p = (t % cyc + cyc) % cyc;
    var ease = function ease(u) {
      return (1 - Math.cos(Math.PI * u)) / 2;
    };
    return p < DWELL ? 0 : p < DWELL + mv ? ease((p - DWELL) / mv) : p < 2 * DWELL + mv ? 1 : 1 - ease((p - 2 * DWELL - mv) / mv);
  }
  function carInfo(car) {
    var c = car.ch,
      up = [-Math.sin(c.a), Math.cos(c.a)];
    return {
      x: c.x,
      y: c.y,
      a: c.a,
      up: up,
      sp: Math.hypot(c.vx, c.vy)
    };
  }
  var pkey = function pkey() {
    return "bdd:mad:" + (typeof me !== "undefined" && me ? me.id : "");
  };
  function prog() {
    var p = null;
    try {
      p = store.get(pkey());
    } catch (e) {}
    if (!p || !p.b) p = {
      u: 0,
      b: {},
      t: {},
      last: 0
    };
    return p;
  }
  function saveProg(p) {
    try {
      store.set(pkey(), p);
    } catch (e) {}
  }
  var total = function total(p) {
    return Object.keys(p.b).reduce(function (a, k) {
      return a + (p.b[k] || 0);
    }, 0);
  };
  var PAR = [10, 12, 10, 8, 10, 12, 20, 8, 30, 10, 12, 9, 9, 16, 33, 8, 15, 7, 10, 52, 12, 17, 12, 11, 14, 15, 28, 12, 24, 22];
  var ptsFor = function ptsFor(li, t) {
    var par = PAR[li] || 20;
    return 1000 + Math.round(500 * Math.max(0, Math.min(1, 1 - (t - par) / (par * 1.5))));
  };
  var stars = function stars(pts) {
    return !pts ? 0 : pts >= 1400 ? 3 : pts >= 1200 ? 2 : 1;
  };
  var def = {
    key: "mad",
    name: "Mad Dawg",
    icon: "🛻",
    max: 99999,
    blurb: "Physics car levels. Don't flip!",
    how: "Get the car to the checkered flag. Hold the RIGHT side of the screen to drive and the LEFT side to brake and back up (arrow keys work too). In the air, gas tips the nose up and brake tips it down, so use them to land on your wheels. If the Big Dawg's head (or a closed car's roof) touches anything, or you fall in a pit, the level restarts. Bridges, seesaws, crushers, wrecking balls, elevators and a new car every few levels. ↻ restarts, ☰ picks a level. Score is your career total: every level you beat counts once, 1000 + up to 500 for a fast time.",
    _t: {
      build: build,
      script: script,
      LEVELS: LEVELS,
      CARS: CARS,
      DT: DT,
      carInfo: carInfo,
      ptsFor: ptsFor,
      DWELL: DWELL
    },
    reset: function reset(G) {
      var p = prog(),
        li = Math.min(p.last || 0, p.u, LEVELS.length - 1);
      G.s = {
        p: p,
        li: li,
        gas: 0,
        brk: 0,
        keys: {},
        pops: [],
        fx: [],
        menu: false
      };
      this.load(G, li);
      this.hook();
    },
    load: function load(G, li) {
      var _this2 = this;
      var s = G.s;
      s.li = li;
      s.L = build(li);
      s.t = 0;
      s.acc = 0;
      s.phase = "go";
      s.pt = 0;
      s.flip = 0;
      s.fx = [];
      s.done = 0;
      var ci = carInfo(s.L.car);
      s.cam = {
        x: ci.x + 4,
        y: ci.y + 1
      };
      s.L.W.onHit = function (a, b, cs) {
        return _this2.hit(G, a, b, cs);
      };
      s.p.last = li;
      saveProg(s.p);
    },
    hit: function hit(G, a, b, cs) {
      var s = G.s;
      if (s.phase !== "go") return;
      var isCar = function isCar(sh) {
        return sh.b.group === 1;
      };
      for (var _i8 = 0, _arr = [[a, b], [b, a]]; _i8 < _arr.length; _i8++) {
        var _arr$_i = _slicedToArray(_arr[_i8], 2),
          k = _arr$_i[0],
          o = _arr$_i[1];
        if (k.kill && !isCar(o) && (o.ground || o.b.kind !== "dyn") && cs.some(function (c) {
          return c[4] < 0.005;
        })) this.crash(G, k.head ? "BONK!" : "CRUNCH!");
        if (o.b.crumble && o.b.hitT == null && isCar(k)) o.b.hitT = 0.45;
      }
    },
    crash: function crash(G, msg) {
      var s = G.s;
      if (s.phase !== "go") return;
      s.phase = "crash";
      s.pt = 0;
      G.sfx("lose");
      G.buzz();
      s.pops.push({
        t: 1.2,
        txt: msg
      });
      var c = s.L.car.ch;
      for (var i = 0; i < 14; i++) s.fx.push({
        x: c.x,
        y: c.y + 0.5,
        vx: (Math.random() - 0.5) * 8,
        vy: Math.random() * 7,
        t: 0.9,
        col: "#ffd23f"
      });
    },
    win: function win(G) {
      var s = G.s;
      s.phase = "win";
      s.pt = 0;
      G.sfx("win");
      var pts = ptsFor(s.li, s.t),
        old = s.p.b[s.li] || 0;
      s.winPts = pts;
      s.winBest = pts > old;
      if (pts > old) s.p.b[s.li] = pts;
      if (!s.p.t[s.li] || s.t < s.p.t[s.li]) s.p.t[s.li] = Math.round(s.t * 10) / 10;
      s.p.u = Math.max(s.p.u, Math.min(LEVELS.length - 1, s.li + 1));
      saveProg(s.p);
      if (pts > old) G.postQuiet(total(s.p));
      var f = s.L.fin;
      for (var i = 0; i < 60; i++) s.fx.push({
        x: f + (Math.random() - 0.3) * 6,
        y: s.L.car.ch.y + 4 + Math.random() * 3,
        vx: (Math.random() - 0.5) * 6,
        vy: Math.random() * 5,
        t: 2 + Math.random(),
        col: ["#e63946", "#ffd23f", "#2a9df4", "#5cc142", "#ff7ab6"][i % 5],
        conf: 1
      });
    },
    update: function update(G, dt) {
      var s = G.s;
      if (s.menu) return;
      s.pops.forEach(function (o) {
        return o.t -= dt;
      });
      s.pops = s.pops.filter(function (o) {
        return o.t > 0;
      });
      s.fx.forEach(function (f) {
        f.x += f.vx * dt;
        f.y += f.vy * dt;
        f.vy -= (f.conf ? 3 : 14) * dt;
        f.t -= dt;
      });
      s.fx = s.fx.filter(function (f) {
        return f.t > 0;
      });
      var L = s.L,
        car = L.car,
        D = car.D;
      if (s.phase === "crash") {
        s.pt += dt;
        if (s.pt > 1.3) this.load(G, s.li);
      }
      if (s.phase === "win") {
        s.pt += dt;
        if (s.pt > 2.6) this.load(G, Math.min(LEVELS.length - 1, s.li + 1));
      }
      var gas = s.phase === "go" && (s.gas || s.keys.gas) ? 1 : 0,
        brk = s.phase === "go" && (s.brk || s.keys.brk) ? 1 : 0;
      s.acc += dt;
      while (s.acc >= DT) {
        s.acc -= DT;
        var fwd = Math.cos(car.ch.a) * car.ch.vx + Math.sin(car.ch.a) * car.ch.vy;
        var ground = false;
        var _iterator15 = _createForOfIteratorHelper(car.wheels),
          _step15;
        try {
          for (_iterator15.s(); !(_step15 = _iterator15.n()).done;) {
            var w = _step15.value;
            var j = w.j;
            if (gas && !brk) {
              j.motor = true;
              j.speed = -D.speed;
              j.maxT = D.wheels[car.wheels.indexOf(w)][3];
            } else if (brk) {
              j.motor = true;
              j.maxT = D.wheels[car.wheels.indexOf(w)][3] * (fwd > 1 ? 2.2 : 1);
              j.speed = fwd > 1 ? 0 : D.speed * 0.55;
            } else {
              j.motor = true;
              j.speed = 0;
              j.maxT = Math.abs(w.w - car.ch.w) * w.r < 1.5 ? D.wheels[car.wheels.indexOf(w)][3] : 0.25;
            }
            var _iterator18 = _createForOfIteratorHelper(L.W.arb.values()),
              _step18;
            try {
              for (_iterator18.s(); !(_step18 = _iterator18.n()).done;) {
                var ar = _step18.value;
                if (ar.B === w || ar.A === w) {
                  ground = true;
                  break;
                }
              }
            } catch (err) {
              _iterator18.e(err);
            } finally {
              _iterator18.f();
            }
          }
        } catch (err) {
          _iterator15.e(err);
        } finally {
          _iterator15.f();
        }
        s.air = !ground;
        if (!ground && (gas || brk)) {
          var c = car.ch;
          c.w += (gas ? 1 : -1) * D.air * DT;
          c.w = Math.max(-4.5, Math.min(4.5, c.w));
        }
        var _iterator16 = _createForOfIteratorHelper(L.springs),
          _step16;
        try {
          var _loop = function _loop() {
            var sp = _step16.value;
            sp.t = Math.max(0, sp.t - DT);
            if (sp.t > 0) return 1;
            if (car.wheels.some(function (w) {
              return w.x > sp.x0 - 0.2 && w.x < sp.x1 + 0.2 && w.y - w.r < sp.y + 0.3;
            })) {
              sp.t = 0.6;
              sp.fire = 0.25;
              [car.ch].concat(car.wheels).forEach(function (b) {
                return b.vy = Math.max(b.vy, sp.v);
              });
              G.sfx("pop");
            }
          };
          for (_iterator16.s(); !(_step16 = _iterator16.n()).done;) {
            if (_loop()) continue;
          }
        } catch (err) {
          _iterator16.e(err);
        } finally {
          _iterator16.f();
        }
        var _iterator17 = _createForOfIteratorHelper(L.boosts),
          _step17;
        try {
          var _loop2 = function _loop2() {
            var bo = _step17.value;
            if (ground && car.ch.x > bo.x0 && car.ch.x < bo.x1) {
              var ca = Math.cos(car.ch.a),
                sa = Math.sin(car.ch.a);
              [car.ch].concat(car.wheels).forEach(function (b) {
                if (b.vx * ca + b.vy * sa < 22) {
                  b.vx += ca * 24 * DT;
                  b.vy += sa * 24 * DT;
                }
              });
            }
          };
          for (_iterator17.s(); !(_step17 = _iterator17.n()).done;) {
            _loop2();
          }
        } catch (err) {
          _iterator17.e(err);
        } finally {
          _iterator17.f();
        }
        script(L, DT, s.t);
        L.W.step(DT);
        if (s.phase === "go") s.t += DT;
      }
      L.springs.forEach(function (sp) {
        return sp.fire = Math.max(0, (sp.fire || 0) - dt);
      });
      var ci = carInfo(car);
      if (s.phase === "go") {
        if (ci.y < L.minY - 12) this.crash(G, "SPLAT!");else if (ci.x > L.fin) this.win(G);
        if (ci.up[1] < -0.2 && ci.sp < 1.5) {
          s.flip += dt;
          if (s.flip > 1.5) this.crash(G, "FLIPPED!");
        } else s.flip = 0;
      }
      var tx = ci.x + 3 + Math.max(-2, Math.min(4, car.ch.vx * 0.25)),
        ty = ci.y + 1;
      s.cam.x += (tx - s.cam.x) * Math.min(1, dt * 3);
      s.cam.y += (ty - s.cam.y) * Math.min(1, dt * 2.5);
    },
    btns: function btns(G) {
      var y = 50,
        r = 17;
      return {
        menu: {
          x: G.W - 26,
          y: y,
          r: r
        },
        redo: {
          x: G.W - 66,
          y: y,
          r: r
        }
      };
    },
    hook: function hook() {
      if (window._madT) return;
      window._madT = 1;
      var w = $("gwrap");
      if (!w) return;
      var f = function f(e) {
        if (G.key !== "mad" || G.state !== "play" || !G.s || G.s.menu) return;
        var r = w.getBoundingClientRect(),
          xs = [];
        for (var i = 0; i < e.touches.length; i++) {
          var t = e.touches[i];
          if (t.clientY - r.top > 72) xs.push(t.clientX - r.left);
        }
        GAMEDEFS.mad.zone(G, xs);
      };
      ["touchstart", "touchmove", "touchend", "touchcancel"].forEach(function (n) {
        return w.addEventListener(n, f, {
          passive: true
        });
      });
    },
    zone: function zone(G, xs) {
      var s = G.s;
      s.brk = xs.some(function (x) {
        return x < G.W / 2;
      }) ? 1 : 0;
      s.gas = xs.some(function (x) {
        return x >= G.W / 2;
      }) ? 1 : 0;
    },
    down: function down(G, x, y) {
      var s = G.s;
      if (s.menu) return this.menuTap(G, x, y);
      var b = this.btns(G);
      if (Math.hypot(x - b.menu.x, y - b.menu.y) < 24) {
        s.menu = true;
        s.gas = s.brk = 0;
        return;
      }
      if (Math.hypot(x - b.redo.x, y - b.redo.y) < 24) {
        if (s.phase !== "win") this.load(G, s.li);
        return;
      }
      if (!TOUCH && y > 72) this.zone(G, [x]);
    },
    up: function up(G) {
      if (!TOUCH && G.s) this.zone(G, []);
    },
    onKey: function onKey(G, k, d) {
      var s = G.s;
      if (!s) return;
      if (k === "ArrowRight" || k === "d" || k === "ArrowUp" || k === "w") s.keys.gas = d;
      if (k === "ArrowLeft" || k === "a" || k === "ArrowDown" || k === "s") s.keys.brk = d;
      if ((k === "r" || k === "R") && d && !s.menu && s.phase !== "win") this.load(G, s.li);
      if (k === "Escape" && d) s.menu = !s.menu;
    },
    menuLayout: function menuLayout(G) {
      var cols = 5,
        pad = 14,
        top = 96,
        cw = (G.W - pad * 2) / cols,
        chh = Math.min(cw * 0.9, (G.H - top - 70) / Math.ceil(LEVELS.length / cols));
      return {
        cols: cols,
        pad: pad,
        top: top,
        cw: cw,
        chh: chh
      };
    },
    menuTap: function menuTap(G, x, y) {
      var s = G.s,
        m = this.menuLayout(G);
      if (y < 80 && x > G.W - 60) {
        s.menu = false;
        return;
      }
      var c = Math.floor((x - m.pad) / m.cw),
        r = Math.floor((y - m.top) / m.chh),
        i = r * m.cols + c;
      if (c < 0 || c >= m.cols || r < 0 || i >= LEVELS.length) {
        if (y > m.top + Math.ceil(LEVELS.length / m.cols) * m.chh + 10) s.menu = false;
        return;
      }
      if (i > s.p.u) {
        G.sfx("lose");
        return;
      }
      s.menu = false;
      G.sfx("pop");
      this.load(G, i);
    },
    draw: function draw(G, c) {
      var s = G.s;
      if (!s || !s.L) return;
      var W = G.W,
        H = G.H,
        L = s.L,
        th = L.th,
        S = Math.max(18, Math.min(W / 13, H / 9));
      var cx = s.cam.x,
        cy = s.cam.y,
        X = function X(wx) {
          return (wx - cx) * S + W / 2;
        },
        Y = function Y(wy) {
          return H * 0.55 - (wy - cy) * S;
        };
      var sk = c.createLinearGradient(0, 0, 0, H);
      sk.addColorStop(0, th.sky[0]);
      sk.addColorStop(1, th.sky[1]);
      c.fillStyle = sk;
      c.fillRect(0, 0, W, H);
      if (th.night) {
        c.fillStyle = "#fff";
        for (var i = 0; i < 40; i++) {
          var sx = ((i * 97.3 - cx * 2) % W + W) % W,
            sy = i * 53.7 % (H * 0.5);
          c.globalAlpha = 0.4 + i % 3 * 0.2;
          c.fillRect(sx, sy, 2, 2);
        }
        c.globalAlpha = 1;
        c.fillStyle = "#fdf6c3";
        c.beginPath();
        c.arc(W * 0.8, H * 0.15, 22, 0, 7);
        c.fill();
      } else {
        c.fillStyle = "rgba(255,255,255,0.85)";
        for (var _i9 = 0; _i9 < 6; _i9++) {
          var px = ((_i9 * 230 - cx * S * 0.15) % (W + 300) + W + 300) % (W + 300) - 150,
            _py = 60 + _i9 * 47 % (H * 0.3);
          c.beginPath();
          c.arc(px, _py, 18, 0, 7);
          c.arc(px + 20, _py - 8, 22, 0, 7);
          c.arc(px + 42, _py, 17, 0, 7);
          c.fill();
        }
      }
      for (var _i0 = 0, _arr2 = [[th.hill, 0.25, 50, 0.62], [th.hill2, 0.45, 35, 0.72]]; _i0 < _arr2.length; _i0++) {
        var _arr2$_i = _slicedToArray(_arr2[_i0], 4),
          col = _arr2$_i[0],
          f = _arr2$_i[1],
          amp = _arr2$_i[2],
          base = _arr2$_i[3];
        c.fillStyle = col;
        c.beginPath();
        c.moveTo(0, H);
        for (var _sx = 0; _sx <= W + 20; _sx += 20) {
          var wx = _sx + cx * S * f;
          c.lineTo(_sx, H * base - amp * (0.6 * Math.sin(wx / 160) + 0.4 * Math.sin(wx / 71 + 2)) - cy * S * f * 0.3);
        }
        c.lineTo(W, H);
        c.fill();
      }
      var py = Y(L.minY - 0.6);
      if (py < H) {
        var pg = c.createLinearGradient(0, py, 0, py + 3 * S);
        pg.addColorStop(0, "rgba(10,8,20,0)");
        pg.addColorStop(1, "rgba(10,8,20,0.92)");
        c.fillStyle = pg;
        c.fillRect(0, py, W, H - py);
      }
      this.drawFinish(c, L, X, Y, S);
      c.fillStyle = th.night ? "#2a2236" : "#5f5149";
      var _iterator19 = _createForOfIteratorHelper(L.roofs),
        _step19;
      try {
        for (_iterator19.s(); !(_step19 = _iterator19.n()).done;) {
          var r = _step19.value;
          c.fillRect(X(r.x0), Y(r.y + 20), (r.x1 - r.x0) * S, 20 * S);
          c.fillStyle = "#3d342e";
          c.fillRect(X(r.x0), Y(r.y) - 4, (r.x1 - r.x0) * S, 4);
          c.fillStyle = th.night ? "#2a2236" : "#5f5149";
        }
      } catch (err) {
        _iterator19.e(err);
      } finally {
        _iterator19.f();
      }
      var _iterator20 = _createForOfIteratorHelper(L.deco),
        _step20;
      try {
        for (_iterator20.s(); !(_step20 = _iterator20.n()).done;) {
          var d = _step20.value;
          if (d.k === "pivot") {
            c.fillStyle = "#7f8c8d";
            c.beginPath();
            c.moveTo(X(d.x), Y(d.y));
            c.lineTo(X(d.x) - 0.7 * S, Y(d.y0));
            c.lineTo(X(d.x) + 0.7 * S, Y(d.y0));
            c.fill();
            c.fillStyle = "#555";
            c.beginPath();
            c.arc(X(d.x), Y(d.y), 0.15 * S, 0, 7);
            c.fill();
          }
        }
      } catch (err) {
        _iterator20.e(err);
      } finally {
        _iterator20.f();
      }
      var _iterator21 = _createForOfIteratorHelper(L.pieces),
        _step21;
      try {
        for (_iterator21.s(); !(_step21 = _iterator21.n()).done;) {
          var p = _step21.value;
          if (X(p[p.length - 1][0]) < -50 || X(p[0][0]) > W + 50) continue;
          c.fillStyle = th.dirt;
          c.beginPath();
          c.moveTo(X(p[0][0]), H + 10);
          var _iterator27 = _createForOfIteratorHelper(p),
            _step27;
          try {
            for (_iterator27.s(); !(_step27 = _iterator27.n()).done;) {
              var _q = _step27.value;
              c.lineTo(X(_q[0]), Math.min(H + 10, Y(_q[1])));
            }
          } catch (err) {
            _iterator27.e(err);
          } finally {
            _iterator27.f();
          }
          c.lineTo(X(p[p.length - 1][0]), H + 10);
          c.fill();
          c.strokeStyle = th.top;
          c.lineWidth = Math.max(4, S * 0.3);
          c.lineJoin = "round";
          c.beginPath();
          for (var _i10 = 1; _i10 < p.length - 1; _i10++) {
            var q = p[_i10];
            if (_i10 === 1) c.moveTo(X(q[0]), Y(q[1]) + c.lineWidth / 2 - 1);else c.lineTo(X(q[0]), Y(q[1]) + c.lineWidth / 2 - 1);
          }
          c.stroke();
        }
      } catch (err) {
        _iterator21.e(err);
      } finally {
        _iterator21.f();
      }
      var _iterator22 = _createForOfIteratorHelper(L.boosts),
        _step22;
      try {
        for (_iterator22.s(); !(_step22 = _iterator22.n()).done;) {
          var b = _step22.value;
          c.fillStyle = "#ff9f1c";
          for (var x = b.x0 + 0.3; x < b.x1 - 0.6; x += 1.6) {
            var _sx2 = X(x),
              _sy = Y(b.y);
            c.beginPath();
            c.moveTo(_sx2, _sy - 3);
            c.lineTo(_sx2 + 0.6 * S, _sy - 3);
            c.lineTo(_sx2 + 1.1 * S, _sy - 0.25 * S - 3);
            c.lineTo(_sx2 + 0.6 * S, _sy - 0.5 * S - 3);
            c.lineTo(_sx2, _sy - 0.5 * S - 3);
            c.lineTo(_sx2 + 0.5 * S, _sy - 0.25 * S - 3);
            c.fill();
          }
        }
      } catch (err) {
        _iterator22.e(err);
      } finally {
        _iterator22.f();
      }
      var _iterator23 = _createForOfIteratorHelper(L.springs),
        _step23;
      try {
        for (_iterator23.s(); !(_step23 = _iterator23.n()).done;) {
          var sp = _step23.value;
          var _sx3 = X(sp.x0),
            _sy2 = Y(sp.y),
            w = (sp.x1 - sp.x0) * S,
            h = (sp.fire > 0 ? 0.9 : 0.35) * S;
          c.strokeStyle = "#555";
          c.lineWidth = 2;
          c.beginPath();
          for (var _i11 = 0; _i11 <= 6; _i11++) c.lineTo(_sx3 + w * (0.2 + 0.6 * (_i11 % 2)), _sy2 - h * _i11 / 6);
          c.stroke();
          c.fillStyle = "#e63946";
          c.fillRect(_sx3, _sy2 - h - 0.18 * S, w, 0.18 * S);
        }
      } catch (err) {
        _iterator23.e(err);
      } finally {
        _iterator23.f();
      }
      var _iterator24 = _createForOfIteratorHelper(L.parts),
        _step24;
      try {
        for (_iterator24.s(); !(_step24 = _iterator24.n()).done;) {
          var _b9 = _step24.value;
          var _px = X(_b9.x);
          if (_px > -12 * S && _px < W + 12 * S) this.drawPart(c, _b9, X, Y, S, L);
        }
      } catch (err) {
        _iterator24.e(err);
      } finally {
        _iterator24.f();
      }
      this.drawCar(c, L.car, X, Y, S, s);
      var _iterator25 = _createForOfIteratorHelper(s.fx),
        _step25;
      try {
        for (_iterator25.s(); !(_step25 = _iterator25.n()).done;) {
          var _f = _step25.value;
          c.globalAlpha = Math.min(1, _f.t * 2);
          c.fillStyle = _f.col;
          c.fillRect(X(_f.x) - 3, Y(_f.y) - 3, _f.conf ? 6 : 5, _f.conf ? 9 : 5);
        }
      } catch (err) {
        _iterator25.e(err);
      } finally {
        _iterator25.f();
      }
      c.globalAlpha = 1;
      var best = s.p.b[s.li];
      G.hud(c, "LVL ".concat(s.li + 1), LEVELS[s.li].name.toUpperCase(), "".concat(total(s.p)));
      var bx = 14,
        bw = W - 120,
        by = 46,
        prog = Math.max(0, Math.min(1, (L.car.ch.x - 4) / (L.fin - 4)));
      c.fillStyle = "rgba(0,0,0,0.35)";
      c.beginPath();
      c.roundRect ? c.roundRect(bx, by, bw, 9, 5) : c.rect(bx, by, bw, 9);
      c.fill();
      c.fillStyle = "#ffd23f";
      c.beginPath();
      c.roundRect ? c.roundRect(bx, by, Math.max(9, bw * prog), 9, 5) : c.rect(bx, by, bw * prog, 9);
      c.fill();
      G.emoji(c, "🏁", bx + bw + 2, by + 4, 14);
      c.globalAlpha = 0.9;
      G.text(c, "".concat(s.t.toFixed(1), "s"), bx, by + 22, 9, th.night ? "#fff" : "#1d2a3a", "left");
      if (best) G.text(c, "★".repeat(stars(best)) + "☆".repeat(3 - stars(best)), bx + bw, by + 22, 9, "#ffb300", "right");
      c.globalAlpha = 1;
      var bt = this.btns(G);
      for (var _i1 = 0, _arr3 = [["redo", "↻"], ["menu", "☰"]]; _i1 < _arr3.length; _i1++) {
        var _arr3$_i = _slicedToArray(_arr3[_i1], 2),
          k = _arr3$_i[0],
          ch = _arr3$_i[1];
        var o = bt[k];
        c.fillStyle = "rgba(0,0,0,0.45)";
        c.beginPath();
        c.arc(o.x, o.y, o.r, 0, 7);
        c.fill();
        c.fillStyle = "#fff";
        c.font = "bold 18px system-ui";
        c.textAlign = "center";
        c.textBaseline = "middle";
        c.fillText(ch, o.x, o.y + 1);
      }
      if (G.state === "play" && !s.menu) this.drawPedals(c, G, s);
      var _iterator26 = _createForOfIteratorHelper(s.pops),
        _step26;
      try {
        for (_iterator26.s(); !(_step26 = _iterator26.n()).done;) {
          var _o = _step26.value;
          c.globalAlpha = Math.min(1, _o.t * 2);
          G.text(c, _o.txt, W / 2 + 2, H * 0.32 + 2, 22, "rgba(0,0,0,0.6)");
          G.text(c, _o.txt, W / 2, H * 0.32, 22, "#ff5252");
        }
      } catch (err) {
        _iterator26.e(err);
      } finally {
        _iterator26.f();
      }
      c.globalAlpha = 1;
      if (s.phase === "win") {
        var a = Math.min(1, s.pt * 3);
        c.globalAlpha = a;
        c.fillStyle = "rgba(0,0,0,0.55)";
        c.fillRect(0, H * 0.24, W, 120);
        G.text(c, "LEVEL COMPLETE!", W / 2, H * 0.24 + 30, Math.min(20, W / 18), "#ffd23f");
        G.text(c, "".concat(s.t.toFixed(1), "s  +").concat(s.winPts), W / 2, H * 0.24 + 62, 13, "#fff");
        G.text(c, s.winBest ? "NEW BEST!" : "BEST " + (s.p.b[s.li] || 0), W / 2, H * 0.24 + 90, 10, s.winBest ? "#7CFC00" : "#ccc");
        G.emoji(c, "⭐".repeat(stars(s.winPts)), W / 2, H * 0.24 + 112, 16);
        c.globalAlpha = 1;
      }
      if (G.state === "play" && s.phase === "go" && s.li === 0 && s.t < 4) G.hint(c, "HOLD RIGHT = GAS · LEFT = BRAKE", 99, H - 175);
      if (s.menu) this.drawMenu(c, G, s);
    },
    drawPedals: function drawPedals(c, G, s) {
      var W = G.W,
        H = G.H,
        pw = Math.min(70, W * 0.17),
        ph = pw * 1.25;
      var ped = function ped(x, on, lbl, col) {
        var y = H - ph - 16;
        c.save();
        c.globalAlpha = on ? 0.95 : 0.55;
        c.translate(x + pw / 2, y + ph / 2);
        c.rotate(on ? 0.12 : 0);
        c.translate(-pw / 2, -ph / 2);
        c.fillStyle = "rgba(0,0,0,0.35)";
        c.beginPath();
        c.roundRect ? c.roundRect(3, 5, pw, ph, 12) : c.rect(3, 5, pw, ph);
        c.fill();
        c.fillStyle = on ? col : "#cfd6dd";
        c.beginPath();
        c.roundRect ? c.roundRect(0, 0, pw, ph, 12) : c.rect(0, 0, pw, ph);
        c.fill();
        c.fillStyle = "rgba(0,0,0,0.18)";
        for (var i = 0; i < 5; i++) c.fillRect(pw * 0.18, ph * (0.18 + i * 0.15), pw * 0.64, ph * 0.06);
        c.restore();
        G.text(c, lbl, x + pw / 2, y - 10, 8, "#fff");
      };
      ped(16, s.brk || s.keys.brk, "BRAKE", "#ff6b6b");
      ped(W - pw - 16, s.gas || s.keys.gas, "GAS", "#7bd389");
    },
    drawFinish: function drawFinish(c, L, X, Y, S) {
      var p = L.pieces[L.pieces.length - 1];
      var gy = 0;
      var _iterator28 = _createForOfIteratorHelper(p),
        _step28;
      try {
        for (_iterator28.s(); !(_step28 = _iterator28.n()).done;) {
          var q = _step28.value;
          if (q[0] <= L.fin) gy = q[1];
        }
      } catch (err) {
        _iterator28.e(err);
      } finally {
        _iterator28.f();
      }
      var x = X(L.fin),
        y = Y(gy),
        h = 4.2 * S,
        sq = 0.35 * S;
      c.fillStyle = "#444";
      c.fillRect(x - 3, y - h, 6, h);
      c.fillRect(x + 3 + 5 * sq, y - h, 6, h);
      for (var r = 0; r < 3; r++) for (var k = 0; k < 5; k++) {
        c.fillStyle = (r + k) % 2 ? "#111" : "#fff";
        c.fillRect(x + 3 + k * sq, y - h + r * sq, sq, sq);
      }
      for (var _r3 = 0; _r3 < 4; _r3++) {
        c.fillStyle = _r3 % 2 ? "#111" : "#fff";
        c.fillRect(x - 0.15 * S, y - _r3 * 0.3 * S - 0.3 * S, 0.3 * S, 0.3 * S);
      }
      c.fillStyle = "rgba(255,255,255,0.7)";
      c.fillRect(X(2.2), Y(0) - 2, 0.25 * S, 4);
    },
    drawPart: function drawPart(c, b, X, Y, S, L) {
      var sx = X(b.x),
        sy = Y(b.y);
      if (b.wreck) {
        c.strokeStyle = "#333";
        c.lineWidth = 2;
        c.beginPath();
        c.moveTo(X(b.wreck.ax), Y(b.wreck.ay));
        c.lineTo(sx, sy);
        c.stroke();
        c.fillStyle = "#555";
        c.fillRect(X(b.wreck.ax) - 0.5 * S, Y(b.wreck.ay) - 0.2 * S, S, 0.25 * S);
        var g = c.createRadialGradient(sx - 0.25 * S, sy - 0.25 * S, 2, sx, sy, b.wreck.r * S);
        g.addColorStop(0, "#777");
        g.addColorStop(1, "#222");
        c.fillStyle = g;
        c.beginPath();
        c.arc(sx, sy, b.wreck.r * S, 0, 7);
        c.fill();
        return;
      }
      if (b.ball) {
        c.save();
        c.translate(sx, sy);
        c.rotate(-b.a);
        c.fillStyle = "#8d5a2b";
        c.beginPath();
        c.arc(0, 0, b.ball * S, 0, 7);
        c.fill();
        c.strokeStyle = "#5e3a1a";
        c.lineWidth = 2;
        c.beginPath();
        c.arc(0, 0, b.ball * S * 0.6, 0, 7);
        c.stroke();
        c.beginPath();
        c.arc(0, 0, b.ball * S * 0.25, 0, 7);
        c.stroke();
        c.restore();
        return;
      }
      var sh = b.sh[0];
      if (!sh || sh.t !== 1) return;
      c.beginPath();
      sh.wv.forEach(function (v, i) {
        return i ? c.lineTo(X(v[0]), Y(v[1])) : c.moveTo(X(v[0]), Y(v[1]));
      });
      c.closePath();
      if (b.crate) {
        c.fillStyle = "#c98b4a";
        c.fill();
        c.strokeStyle = "#7a4f24";
        c.lineWidth = 2;
        c.stroke();
        var v = sh.wv;
        c.beginPath();
        c.moveTo(X(v[0][0]), Y(v[0][1]));
        c.lineTo(X(v[2][0]), Y(v[2][1]));
        c.moveTo(X(v[1][0]), Y(v[1][1]));
        c.lineTo(X(v[3][0]), Y(v[3][1]));
        c.stroke();
      } else if (b.plank) {
        c.fillStyle = b.crumble ? b.hitT != null ? "#b07a4f" : "#c4915f" : "#a8723d";
        c.fill();
        c.strokeStyle = "#5e3a1a";
        c.lineWidth = 1.5;
        c.stroke();
      } else if (b.see) {
        c.fillStyle = "#e9c46a";
        c.fill();
        c.strokeStyle = "#8a6d1e";
        c.lineWidth = 2;
        c.stroke();
      } else if (b.crush) {
        c.fillStyle = "#6c757d";
        c.fill();
        c.strokeStyle = "#343a40";
        c.lineWidth = 2;
        c.stroke();
        var _v = sh.wv,
          bx0 = X(_v[0][0]),
          by0 = Y(_v[0][1]),
          w = X(_v[1][0]) - bx0;
        c.save();
        c.beginPath();
        c.rect(bx0, by0 - 0.35 * S, w, 0.35 * S);
        c.clip();
        c.fillStyle = "#ffd23f";
        c.fillRect(bx0, by0 - 0.35 * S, w, 0.35 * S);
        c.fillStyle = "#111";
        for (var k = -1; k < w / (0.4 * S) + 1; k++) {
          c.beginPath();
          c.moveTo(bx0 + k * 0.4 * S, by0);
          c.lineTo(bx0 + k * 0.4 * S + 0.2 * S, by0);
          c.lineTo(bx0 + k * 0.4 * S + 0.55 * S, by0 - 0.35 * S);
          c.lineTo(bx0 + k * 0.4 * S + 0.35 * S, by0 - 0.35 * S);
          c.fill();
        }
        c.restore();
        c.fillStyle = "#495057";
        c.fillRect(X(b.x) - 0.15 * S, 0, 0.3 * S, Y(b.y + 1.5));
      } else {
        c.fillStyle = "#8395a7";
        c.fill();
        c.strokeStyle = "#3d4a5a";
        c.lineWidth = 2;
        c.stroke();
        c.fillStyle = "#ffd23f";
        var _v2 = sh.wv;
        c.fillRect(X(_v2[3][0]), Y(_v2[3][1]), X(_v2[2][0]) - X(_v2[3][0]), 3);
      }
    },
    drawCar: function drawCar(c, car, X, Y, S, s) {
      var D = car.D,
        ch = car.ch;
      if (D.tread) {
        var w0 = car.wheels[0],
          w1 = car.wheels[car.wheels.length - 1],
          r = w0.r + 0.1;
        c.save();
        c.strokeStyle = "#222";
        c.lineWidth = 0.18 * S;
        c.lineCap = "round";
        var ang = Math.atan2(w1.y - w0.y, w1.x - w0.x),
          nx = -Math.sin(ang) * r,
          ny = Math.cos(ang) * r;
        c.beginPath();
        c.moveTo(X(w0.x + nx), Y(w0.y + ny));
        c.lineTo(X(w1.x + nx), Y(w1.y + ny));
        c.stroke();
        c.beginPath();
        c.moveTo(X(w0.x - nx), Y(w0.y - ny));
        c.lineTo(X(w1.x - nx), Y(w1.y - ny));
        c.stroke();
        c.beginPath();
        c.arc(X(w0.x), Y(w0.y), r * S, 0, 7);
        c.stroke();
        c.beginPath();
        c.arc(X(w1.x), Y(w1.y), r * S, 0, 7);
        c.stroke();
        c.restore();
      }
      c.strokeStyle = "#555";
      c.lineWidth = Math.max(2, 0.1 * S);
      var _iterator29 = _createForOfIteratorHelper(car.wheels),
        _step29;
      try {
        for (_iterator29.s(); !(_step29 = _iterator29.n()).done;) {
          var w = _step29.value;
          var m = rot(ch, w.j.la);
          c.beginPath();
          c.moveTo(X(ch.x + m[0] - Math.sin(ch.a) * 0.3), Y(ch.y + m[1] + Math.cos(ch.a) * 0.3));
          c.lineTo(X(w.x), Y(w.y));
          c.stroke();
        }
      } catch (err) {
        _iterator29.e(err);
      } finally {
        _iterator29.f();
      }
      var _iterator30 = _createForOfIteratorHelper(car.wheels),
        _step30;
      try {
        for (_iterator30.s(); !(_step30 = _iterator30.n()).done;) {
          var _w2 = _step30.value;
          var _r4 = _w2.r * S;
          c.save();
          c.translate(X(_w2.x), Y(_w2.y));
          c.rotate(-_w2.a);
          c.fillStyle = "#1e1e1e";
          c.beginPath();
          c.arc(0, 0, _r4, 0, 7);
          c.fill();
          if (D.wf) {
            c.fillStyle = "#333";
            for (var _k = 0; _k < 10; _k++) {
              c.save();
              c.rotate(_k * Math.PI / 5);
              c.fillRect(-_r4 * 0.12, -_r4 - 1, _r4 * 0.24, _r4 * 0.2);
              c.restore();
            }
          }
          c.fillStyle = D.rim;
          c.beginPath();
          c.arc(0, 0, _r4 * 0.55, 0, 7);
          c.fill();
          c.strokeStyle = "#555";
          c.lineWidth = Math.max(1.5, _r4 * 0.12);
          for (var _k2 = 0; _k2 < 3; _k2++) {
            c.beginPath();
            c.moveTo(0, 0);
            c.lineTo(Math.cos(_k2 * 2.094) * _r4 * 0.5, Math.sin(_k2 * 2.094) * _r4 * 0.5);
            c.stroke();
          }
          c.restore();
        }
      } catch (err) {
        _iterator30.e(err);
      } finally {
        _iterator30.f();
      }
      c.save();
      c.translate(X(ch.x), Y(ch.y));
      c.rotate(-ch.a);
      c.scale(S, -S);
      var P = function P(v) {
        c.beginPath();
        v.forEach(function (p, i) {
          return i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1]);
        });
        c.closePath();
      };
      var dk = shade(D.col, -0.3);
      c.lineWidth = 0.06;
      c.strokeStyle = dk;
      c.lineJoin = "round";
      if (D.cab) {
        P(D.cab);
        c.fillStyle = shade(D.col, 0.1);
        c.fill();
        c.stroke();
      }
      if (D.cage) {
        c.strokeStyle = "#333";
        c.lineWidth = 0.08;
        c.beginPath();
        c.moveTo(-0.9, 0.28);
        c.lineTo(-0.7, 1.15);
        c.lineTo(0.35, 1.1);
        c.lineTo(0.75, 0.3);
        c.stroke();
        c.lineWidth = 0.06;
        c.strokeStyle = dk;
      }
      var _iterator31 = _createForOfIteratorHelper(D.body),
        _step31;
      try {
        for (_iterator31.s(); !(_step31 = _iterator31.n()).done;) {
          var _v3 = _step31.value;
          P(_v3);
          c.fillStyle = D.col;
          c.fill();
          c.stroke();
        }
      } catch (err) {
        _iterator31.e(err);
      } finally {
        _iterator31.f();
      }
      if (D.roof) {
        P(D.roof);
        c.fillStyle = shade(D.col, -0.15);
        c.fill();
        c.stroke();
      }
      c.fillStyle = "rgba(255,255,255,0.35)";
      if (D.body[0][0][0] < -2.5) {
        for (var k = -2.3; k < 1.3; k += 0.9) c.fillRect(k, 0.55, 0.7, 0.5);
        c.fillStyle = "#333";
        c.fillRect(-2.7, 0.05, 5.4, 0.12);
      } else c.fillRect(D.body[0][0][0] + 0.2, 0.0, (D.body[0][1][0] - D.body[0][0][0]) * 0.6, 0.08);
      if (D.cab) {
        c.fillStyle = "rgba(170,220,255,0.75)";
        var v = D.cab;
        P([[v[0][0] + 0.12, v[0][1] + 0.12], [v[1][0] - 0.2, v[1][1] + 0.12], [v[2][0] - 0.12, v[2][1] - 0.12], [v[3][0] + 0.12, v[3][1] - 0.12]]);
        c.fill();
      }
      if (D.gun) {
        c.fillStyle = shade(D.col, -0.2);
        c.fillRect(0.5, 0.58, 1.6, 0.14);
      }
      if (D.spoiler) {
        c.fillStyle = dk;
        c.fillRect(-1.95, 0.55, 0.55, 0.1);
        c.fillRect(-1.75, 0.3, 0.08, 0.27);
      }
      c.fillStyle = "#fff6a8";
      c.fillRect(D.body[0][1][0] - 0.12, D.body[0][1][1] + 0.12, 0.12, 0.14);
      c.restore();
      var hd = ch.sh.find(function (q) {
        return q.head;
      });
      var face = s.phase === "crash" ? ":dawgpain:" : s.phase === "win" ? ":dawgpog:" : ":dawgW:";
      if (D.cab || D.roof) {
        c.save();
        c.beginPath();
        c.arc(X(hd.wx), Y(hd.wy), hd.r * S * 1.25, 0, 7);
        c.clip();
        G.img(c, face, X(hd.wx), Y(hd.wy), hd.r * S * 2.6, -ch.a);
        c.restore();
      } else G.img(c, face, X(hd.wx), Y(hd.wy), hd.r * S * 2.6, -ch.a);
      if (D.wind) {
        c.save();
        c.translate(X(ch.x), Y(ch.y));
        c.rotate(-ch.a);
        c.scale(S, -S);
        c.strokeStyle = "rgba(170,220,255,0.9)";
        c.lineWidth = 0.09;
        c.beginPath();
        c.moveTo(D.wind[0], D.wind[1]);
        c.lineTo(D.wind[2], D.wind[3]);
        c.stroke();
        c.restore();
      }
    },
    drawMenu: function drawMenu(c, G, s) {
      var W = G.W,
        H = G.H,
        m = this.menuLayout(G);
      c.fillStyle = "rgba(10,14,30,0.9)";
      c.fillRect(0, 0, W, H);
      G.text(c, "PICK A LEVEL", W / 2, 50, 14, "#ffd23f");
      G.text(c, "TOTAL ".concat(total(s.p)), W / 2, 74, 9, "#fff");
      c.fillStyle = "#fff";
      c.font = "bold 22px system-ui";
      c.textAlign = "center";
      c.textBaseline = "middle";
      c.fillText("✕", W - 28, 48);
      LEVELS.forEach(function (lv, i) {
        var col = i % m.cols,
          row = Math.floor(i / m.cols),
          x = m.pad + col * m.cw + 4,
          y = m.top + row * m.chh + 4,
          w = m.cw - 8,
          h = m.chh - 8;
        var lock = i > s.p.u,
          pts = s.p.b[i];
        c.fillStyle = lock ? "#2c3346" : i === s.li ? "#ffd23f" : pts ? "#3a7d44" : "#2f6fb3";
        c.beginPath();
        c.roundRect ? c.roundRect(x, y, w, h, 10) : c.rect(x, y, w, h);
        c.fill();
        if (lock) G.emoji(c, "🔒", x + w / 2, y + h / 2, Math.min(18, h * 0.4));else {
          G.text(c, String(i + 1), x + w / 2, y + h * 0.4, Math.min(14, h * 0.28), i === s.li ? "#222" : "#fff");
          if (pts) G.text(c, "★".repeat(stars(pts)), x + w / 2, y + h * 0.75, Math.min(9, h * 0.18), i === s.li ? "#7a4f00" : "#ffd23f");
        }
      });
      var by = m.top + Math.ceil(LEVELS.length / m.cols) * m.chh + 26;
      G.text(c, "TAP OUTSIDE TO CLOSE", W / 2, Math.min(H - 20, by), 8, "#aaa");
    }
  };
  function shade(hex, f) {
    var n = parseInt(hex.slice(1), 16);
    var r = n >> 16,
      g = n >> 8 & 255,
      b = n & 255;
    var t = f < 0 ? 0 : 255,
      p = Math.abs(f);
    r = Math.round((t - r) * p + r);
    g = Math.round((t - g) * p + g);
    b = Math.round((t - b) * p + b);
    return "rgb(" + r + "," + g + "," + b + ")";
  }
  defGame(def);
})();