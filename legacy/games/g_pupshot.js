function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
(function () {
  var GR = 140,
    BR = 2.6,
    RIM = 13,
    FLOOR = [-30, 146, 160, 30];
  var SHOT = [{
    d: [18, 138],
    h: [68, 96, "r"],
    w: [],
    par: 1,
    tip: "HOLD TO CHARGE, LET GO"
  }, {
    d: [15, 138],
    h: [72, 118, "r"],
    w: [[44, 96, 8, 50]],
    par: 1,
    tip: "LOB IT OVER THE WALL"
  }, {
    d: [15, 138],
    h: [74, 112, "r"],
    w: [[30, 0, 70, 78]],
    par: 2,
    tip: "KEEP IT LOW"
  }, {
    d: [15, 138],
    h: [70, 42, "r"],
    w: [[60, 58, 34, 4]],
    par: 2,
    tip: "TAP WHILE IT FLIES TO WARP"
  }, {
    d: [85, 138],
    h: [12, 92, "l"],
    w: [[4, 106, 28, 4]],
    par: 2
  }, {
    d: [14, 138],
    h: [76, 112, "r"],
    w: [[54, 92, 4, 54], [93, 92, 4, 54]],
    par: 1,
    tip: "DROP IT IN THE BOX"
  }, {
    d: [12, 138],
    h: [74, 108, "r"],
    w: [[48, 0, 8, 62], [48, 86, 8, 60]],
    par: 1,
    tip: "THREAD THE WINDOW"
  }, {
    d: [15, 138],
    h: [68, 48, "r"],
    w: [[62, 66, 32, 80]],
    par: 2
  }, {
    d: [12, 138],
    h: [74, 118, "r"],
    w: [[40, 34, 10, 112]],
    par: 3
  }, {
    d: [12, 138],
    h: [14, 72, "l"],
    w: [[0, 96, 66, 5]],
    par: 3
  }, {
    d: [88, 138],
    h: [10, 120, "l"],
    w: [[30, 46, 8, 100], [30, 0, 8, 22]],
    par: 3
  }, {
    d: [50, 138],
    h: [80, 30, "r"],
    w: [[20, 100, 20, 4], [62, 70, 26, 4], [70, 46, 26, 4]],
    par: 3
  }];
  function world(L) {
    var walls = L.w.map(function (a) {
      return {
        x: a[0],
        y: a[1],
        w: a[2],
        h: a[3],
        b: !!a[4]
      };
    }).concat([{
      x: FLOOR[0],
      y: FLOOR[1],
      w: FLOOR[2],
      h: FLOOR[3],
      b: false
    }]);
    var _L$h = _slicedToArray(L.h, 3),
      hx = _L$h[0],
      hy = _L$h[1],
      side = _L$h[2];
    walls.push({
      x: side === "l" ? hx - 2 : hx + RIM + 0.2,
      y: hy - 15,
      w: 1.8,
      h: 19,
      b: false,
      board: true
    });
    return {
      walls: walls,
      rims: [{
        x: hx,
        y: hy
      }, {
        x: hx + RIM,
        y: hy
      }],
      bombs: (L.bombs || []).map(function (b) {
        return {
          x: b[0],
          y: b[1],
          on: true
        };
      }),
      mags: (L.mags || []).map(function (m) {
        return {
          x: m[0],
          y: m[1]
        };
      }),
      hx: hx,
      hy: hy
    };
  }
  function step(W, b, dt, bounce, ev) {
    var n = 4,
      h = dt / n;
    for (var k = 0; k < n; k++) {
      b.vy += GR * h;
      var _iterator = _createForOfIteratorHelper(W.mags),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var m = _step.value;
          var dx = m.x - b.x,
            dy = m.y - b.y,
            d = Math.hypot(dx, dy);
          if (d < 28 && d > 0.5) {
            var a = 1500 / (d + 8);
            b.vx += dx / d * a * h;
            b.vy += dy / d * a * h;
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
      var py = b.y;
      b.x += b.vx * h;
      b.y += b.vy * h;
      b.touch = false;
      var _iterator2 = _createForOfIteratorHelper(W.walls),
        _step2;
      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var w = _step2.value;
          var cx = Math.max(w.x, Math.min(b.x, w.x + w.w)),
            cy = Math.max(w.y, Math.min(b.y, w.y + w.h));
          var _dx = b.x - cx,
            _dy = b.y - cy,
            _d = Math.hypot(_dx, _dy);
          if (_d >= BR) continue;
          if (_d < 1e-6) {
            var l = b.x - w.x,
              r = w.x + w.w - b.x,
              t = b.y - w.y,
              bt = w.y + w.h - b.y,
              _m = Math.min(l, r, t, bt);
            if (_m === t) {
              _dx = 0;
              _dy = -1;
              b.y = w.y - BR;
            } else if (_m === bt) {
              _dx = 0;
              _dy = 1;
              b.y = w.y + w.h + BR;
            } else if (_m === l) {
              _dx = -1;
              _dy = 0;
              b.x = w.x - BR;
            } else {
              _dx = 1;
              _dy = 0;
              b.x = w.x + w.w + BR;
            }
          } else {
            _dx /= _d;
            _dy /= _d;
            b.x = cx + _dx * BR;
            b.y = cy + _dy * BR;
          }
          var vn = b.vx * _dx + b.vy * _dy;
          if (vn < 0) {
            var e = w.b ? 1.12 : bounce;
            b.vx -= (1 + e) * vn * _dx;
            b.vy -= (1 + e) * vn * _dy;
            var tx = -_dy,
              ty = _dx,
              vt = b.vx * tx + b.vy * ty;
            b.vx -= vt * tx * 0.04;
            b.vy -= vt * ty * 0.04;
            if (w.b && ev) ev.push({
              k: "boing",
              x: b.x,
              y: b.y
            });
          }
          if (_dy < -0.5) b.touch = true;
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
      var _iterator3 = _createForOfIteratorHelper(W.rims),
        _step3;
      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var _r = _step3.value;
          var _dx2 = b.x - _r.x,
            _dy2 = b.y - _r.y,
            _d2 = Math.hypot(_dx2, _dy2),
            rr = BR + 0.8;
          if (_d2 < rr && _d2 > 1e-6) {
            var nx = _dx2 / _d2,
              ny = _dy2 / _d2;
            b.x = _r.x + nx * rr;
            b.y = _r.y + ny * rr;
            var _vn = b.vx * nx + b.vy * ny;
            if (_vn < 0) {
              b.vx -= 1.5 * _vn * nx;
              b.vy -= 1.5 * _vn * ny;
            }
          }
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }
      var _iterator4 = _createForOfIteratorHelper(W.bombs),
        _step4;
      try {
        for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
          var q = _step4.value;
          if (q.on && Math.hypot(b.x - q.x, b.y - q.y) < BR + 3.6) {
            q.on = false;
            var _dx3 = b.x - q.x,
              _dy3 = b.y - q.y,
              _d3 = Math.hypot(_dx3, _dy3) || 1;
            b.vx = _dx3 / _d3 * 105;
            b.vy = _dy3 / _d3 * 105;
            if (ev) ev.push({
              k: "boom",
              x: q.x,
              y: q.y
            });
          }
        }
      } catch (err) {
        _iterator4.e(err);
      } finally {
        _iterator4.f();
      }
      if (py < W.hy && b.y >= W.hy && b.vy > 0 && b.x > W.hx + 1.2 && b.x < W.hx + RIM - 1.2) return "score";
      if (b.y > 175 || b.x < -25 || b.x > 125) return "out";
    }
    return "";
  }
  var SPEED = function SPEED(p) {
    return 30 + 100 * p;
  };
  var ANG = 70 * Math.PI / 180,
    CHARGE = 1.5;
  var chargeP = function chargeP(t) {
    return 1 - Math.abs(t / CHARGE % 2 - 1);
  };
  var aimDir = function aimDir(W, x) {
    return W.hx + RIM / 2 >= x ? 1 : -1;
  };
  var ENG = {
    SHOT: SHOT,
    world: world,
    step: step,
    SPEED: SPEED,
    BR: BR,
    ANG: ANG,
    aimDir: aimDir,
    RIM: RIM
  };
  var levelPts = function levelPts(shots, par) {
    return Math.max(100, 500 - 100 * Math.max(0, shots - par));
  };
  var stars = function stars(shots, par) {
    return shots <= par ? 3 : shots === par + 1 ? 2 : 1;
  };
  function view(G) {
    var S = Math.min(G.W / 100, (G.H - 40) / 150);
    return {
      S: S,
      ox: (G.W - 100 * S) / 2,
      oy: G.H - 150 * S - 2
    };
  }
  function drawCourt(G, c, s, V) {
    var dk = G.dark(),
      S = V.S,
      X = function X(x) {
        return V.ox + x * S;
      },
      Y = function Y(y) {
        return V.oy + y * S;
      };
    var sky = c.createLinearGradient(0, 0, 0, G.H);
    if (dk) {
      sky.addColorStop(0, "#141a33");
      sky.addColorStop(1, "#2b2350");
    } else {
      sky.addColorStop(0, "#8fd3ff");
      sky.addColorStop(1, "#ffe1b8");
    }
    c.fillStyle = sky;
    c.fillRect(0, 0, G.W, G.H);
    c.fillStyle = dk ? "#3b2a1f" : "#d9a066";
    c.fillRect(0, Y(146), G.W, G.H - Y(146));
    c.fillStyle = dk ? "#5a4030" : "#c48850";
    for (var x = 0; x < 100; x += 10) c.fillRect(X(x), Y(146), 1, G.H - Y(146));
    s.W.walls.forEach(function (w) {
      if (w.board || w.y >= 146) return;
      if (w.b) {
        c.fillStyle = "#ff6fae";
        c.fillRect(X(w.x), Y(w.y), w.w * S, w.h * S);
        c.strokeStyle = "#fff";
        c.lineWidth = 2;
        c.beginPath();
        for (var _x = 0; _x <= w.w; _x += 3) c.lineTo(X(w.x + _x), Y(w.y + (_x / 3 % 2 ? 1 : w.h - 1)));
        c.stroke();
        return;
      }
      c.fillStyle = dk ? "#4b5675" : "#6b7a99";
      c.fillRect(X(w.x), Y(w.y), w.w * S, w.h * S);
      c.fillStyle = dk ? "#5d6a8e" : "#8292b3";
      c.fillRect(X(w.x), Y(w.y), w.w * S, Math.min(w.h * S, 3));
    });
    s.W.mags.forEach(function (m) {
      c.strokeStyle = "rgba(255,80,80,0.25)";
      c.setLineDash([4, 6]);
      c.beginPath();
      c.arc(X(m.x), Y(m.y), 30 * S * (0.6 + 0.4 * (G.t * 0.8 % 1)), 0, 7);
      c.stroke();
      c.setLineDash([]);
      G.emoji(c, "🧲", X(m.x), Y(m.y), 9 * S);
    });
    s.W.bombs.forEach(function (q) {
      if (q.on) G.emoji(c, "💣", X(q.x), Y(q.y), 8 * S);
    });
    var hx = s.W.hx,
      hy = s.W.hy,
      bd = s.W.walls.find(function (w) {
        return w.board;
      });
    c.fillStyle = "#fff";
    c.fillRect(X(bd.x), Y(bd.y), bd.w * S, bd.h * S);
    c.strokeStyle = "#e53935";
    c.lineWidth = 2;
    c.strokeRect(X(bd.x), Y(bd.y), bd.w * S, bd.h * S);
    c.strokeStyle = "rgba(255,255,255,0.9)";
    c.lineWidth = 1.5;
    c.beginPath();
    for (var i = 0; i <= 4; i++) {
      var a = hx + i * RIM / 4,
        b2 = hx + 2 + i * (RIM - 4) / 4;
      c.moveTo(X(a), Y(hy));
      c.lineTo(X(b2), Y(hy + 8));
    }
    c.moveTo(X(hx + 1), Y(hy + 4));
    c.lineTo(X(hx + RIM - 1), Y(hy + 4));
    c.moveTo(X(hx + 2), Y(hy + 8));
    c.lineTo(X(hx + RIM - 2), Y(hy + 8));
    c.stroke();
    c.strokeStyle = "#ff7a1a";
    c.lineWidth = Math.max(3, S * 1.2);
    c.beginPath();
    c.moveTo(X(hx), Y(hy));
    c.lineTo(X(hx + RIM), Y(hy));
    c.stroke();
    (s.fx || []).forEach(function (f) {
      c.globalAlpha = Math.max(0, 1 - f.t / 0.6);
      G.emoji(c, f.k === "boom" ? "💥" : f.k === "swish" ? "✨" : "💫", X(f.x), Y(f.y), (f.k === "boom" ? 16 : 10) * S * (1 + f.t));
      c.globalAlpha = 1;
    });
  }
  function drawBall(G, c, V, b, rot) {
    var S = V.S,
      x = V.ox + b.x * S,
      y = V.oy + b.y * S,
      r = BR * S;
    c.save();
    c.translate(x, y);
    c.rotate(rot || 0);
    c.fillStyle = "#ff8a1f";
    c.beginPath();
    c.arc(0, 0, r, 0, 7);
    c.fill();
    c.strokeStyle = "#7a3a00";
    c.lineWidth = Math.max(1, r * 0.14);
    c.stroke();
    c.beginPath();
    c.moveTo(-r, 0);
    c.lineTo(r, 0);
    c.moveTo(0, -r);
    c.lineTo(0, r);
    c.stroke();
    c.beginPath();
    c.arc(-r * 1.25, 0, r * 0.9, -0.9, 0.9);
    c.stroke();
    c.beginPath();
    c.arc(r * 1.25, 0, r * 0.9, Math.PI - 0.9, Math.PI + 0.9);
    c.stroke();
    c.restore();
  }
  function hud(G, c, s, name) {
    G.hud(c, "COURT ".concat(s.lv + 1, "/12"), "".concat(s.score), "SHOTS ".concat(s.shots));
  }
  function banner(G, c, s) {
    if (s.clear > 0) {
      var st = stars(s.shots, s.L.par);
      c.fillStyle = "rgba(0,0,0,0.45)";
      c.fillRect(0, G.H * 0.3 - 40, G.W, 110);
      G.banner(c, s.shots <= s.L.par ? "SWISH!" : "BUCKET!", "#ffd23f", G.H * 0.3);
      G.text(c, "★".repeat(st) + "☆".repeat(3 - st), G.W / 2, G.H * 0.3 + 34, 18, "#ffd23f");
      G.text(c, "+".concat(levelPts(s.shots, s.L.par)), G.W / 2, G.H * 0.3 + 58, 11, "#fff");
    }
  }
  function common(key) {
    return {
      newLevel: function newLevel(G) {
        var s = G.s,
          L = SHOT[s.lv];
        s.L = L;
        s.W = world(L);
        s.shots = 0;
        s.fx = [];
        s.clear = 0;
        this.home(G);
        s.tipT = 4;
      },
      home: function home(G) {
        var s = G.s;
        s.dog = {
          x: s.L.d[0],
          y: s.L.d[1] - 4
        };
        s.ball = {
          x: s.dog.x + 3,
          y: s.dog.y - 2,
          vx: 0,
          vy: 0
        };
        s.phase = "aim";
        s.rot = 0;
        s.rest = 0;
        s.flyT = 0;
        s.charge = null;
        s.W.bombs.forEach(function (q) {
          return q.on = true;
        });
      },
      cleared: function cleared(G) {
        var s = G.s;
        s.score += levelPts(s.shots, s.L.par);
        s.clear = 1.6;
        s.phase = "clear";
        G.sfx("win");
        s.fx.push({
          k: "swish",
          x: s.W.hx + RIM / 2,
          y: s.W.hy + 4,
          t: 0
        });
      },
      advance: function advance(G) {
        var s = G.s;
        s.lv++;
        if (s.lv >= 12) {
          s.done = true;
          return G.over(s.score, "All 12 courts cleared! 🏀");
        }
        this.newLevel(G);
      },
      save: function save(G) {
        var s = G.s;
        if (s.done || s.phase === "clear") return null;
        return {
          label: "Court ".concat(s.lv + 1, " \xB7 ").concat(s.score, " pts"),
          v: {
            lv: s.lv,
            score: s.score
          }
        };
      },
      load: function load(G, sv) {
        G.s.lv = sv.v.lv;
        G.s.score = sv.v.score;
        this.newLevel(G);
      },
      fly: function fly(G, dt) {
        var s = G.s,
          ev = [];
        var r = "";
        s.acc = (s.acc || 0) + dt;
        while (s.acc >= 1 / 60 && !r) {
          s.acc -= 1 / 60;
          r = step(s.W, s.ball, 1 / 60, 0.55, ev);
        }
        if (r) s.acc = 0;
        s.rot += s.ball.vx * dt * 0.25;
        s.flyT += dt;
        ev.forEach(function (e) {
          s.fx.push(Object.assign(e, {
            t: 0
          }));
          G.sfx("pop");
          if (e.k === "boom") G.buzz();
        });
        if (r === "score") return this.cleared(G);
        if (r === "out") {
          s.fx.push({
            k: "poof",
            x: Math.max(4, Math.min(96, s.ball.x)),
            y: Math.min(140, s.ball.y),
            t: 0
          });
          return "out";
        }
        var sp = Math.hypot(s.ball.vx, s.ball.vy);
        s.rest = sp < 7 && s.ball.touch ? s.rest + dt : 0;
        return s.rest > 0.9 ? "rest" : s.flyT > 9 ? "rest" : "";
      },
      tickFx: function tickFx(G, dt) {
        var s = G.s;
        s.fx.forEach(function (f) {
          return f.t += dt;
        });
        s.fx = s.fx.filter(function (f) {
          return f.t < 0.6;
        });
        if (s.tipT > 0) s.tipT -= dt;
        if (s.clear > 0) {
          s.clear -= dt;
          if (s.clear <= 0) this.advance(G);
        }
      }
    };
  }
  var pup = Object.assign(common("pupshot"), {
    key: "pupshot",
    name: "Pup Shot",
    icon: "🏀",
    max: 99999,
    blurb: "Fling it, warp to it, dunk it. 12 courts.",
    how: "Hold your thumb on the screen (or hold the space bar) to charge, then let go to shoot. The angle is always the same and your pup always shoots toward the hoop, so it's all about how long you hold: the power meter fills up, then drops back down if you hold too long. While the ball is flying, TAP anywhere (or press space) to warp your pup to the ball, then shoot again from right there, even in mid-air. Keep holding after the warp tap to start charging right away. Get it through the hoop. Each court is worth 500 if you make it in par shots (the stars), 100 less for each extra shot. If the ball flies off the court it comes back to the start. Stuck? Tap ↺ to restart the court. 12 courts.",
    reset: function reset(G) {
      G.s = {
        lv: 0,
        score: 0
      };
      this.newLevel(G);
    },
    update: function update(G, dt) {
      var s = G.s;
      this.tickFx(G, dt);
      if (s.phase === "fly") {
        var r = this.fly(G, dt);
        if (r === "out") {
          G.sfx("lose");
          this.home(G);
        }
      }
      if (s.phase === "warp") {
        s.wt -= dt;
        if (s.wt <= 0) {
          s.phase = "aim";
          if (s.held) s.charge = {
            p: 0,
            t: 0
          };
        }
      }
      if (s.phase === "aim" && s.charge) {
        s.charge.t += dt;
        s.charge.p = chargeP(s.charge.t);
      }
    },
    shoot: function shoot(G) {
      var s = G.s,
        d = s.charge;
      s.charge = null;
      if (!d || d.p < 0.06) return;
      var v = ENG.SPEED(d.p),
        dir = aimDir(s.W, s.dog.x),
        cx = Math.cos(ANG) * dir,
        sy = Math.sin(ANG);
      s.ball.x = s.dog.x + cx * 3;
      s.ball.y = s.dog.y - sy * 3;
      s.ball.vx = cx * v;
      s.ball.vy = -sy * v;
      s.phase = "fly";
      s.shots++;
      s.rest = 0;
      s.flyT = 0;
      G.sfx("pop");
    },
    warp: function warp(G) {
      var s = G.s;
      s.dog.x = s.ball.x - 2;
      s.dog.y = s.ball.y;
      s.ball.vx = s.ball.vy = 0;
      s.phase = "warp";
      s.wt = 0.12;
      s.fx.push({
        k: "poof",
        x: s.dog.x,
        y: s.dog.y,
        t: 0
      });
      G.sfx("pop");
    },
    draw: function draw(G, c) {
      var s = G.s,
        V = view(G),
        S = V.S,
        X = function X(x) {
          return V.ox + x * S;
        },
        Y = function Y(y) {
          return V.oy + y * S;
        };
      drawCourt(G, c, s, V);
      if (s.phase === "aim") {
        var p = s.charge ? s.charge.p : 0,
          dir = aimDir(s.W, s.dog.x),
          ca = Math.cos(ANG) * dir,
          sa = Math.sin(ANG),
          px = X(s.dog.x),
          py = Y(s.dog.y - 4);
        var len = (8 + 14 * p) * S,
          ex = px + ca * len,
          ey = py - sa * len;
        c.strokeStyle = s.charge ? "#ffd23f" : "rgba(255,255,255,0.75)";
        c.lineWidth = Math.max(2, S * 0.7);
        c.lineCap = "round";
        c.beginPath();
        c.moveTo(px + ca * 7 * S, py - sa * 7 * S);
        c.lineTo(ex, ey);
        c.moveTo(ex, ey);
        c.lineTo(ex + (-ca * 0.9 - sa * 0.5) * 3 * S, ey + (sa * 0.9 - ca * 0.5) * 3 * S);
        c.moveTo(ex, ey);
        c.lineTo(ex + (-ca * 0.9 + sa * 0.5) * 3 * S, ey + (sa * 0.9 + ca * 0.5) * 3 * S);
        c.stroke();
        var mh = 18 * S,
          mx = X(s.dog.x) - dir * 9 * S - 3,
          my = Y(s.dog.y) - mh + 4 * S;
        c.fillStyle = "rgba(0,0,0,0.4)";
        c.fillRect(mx, my, 6, mh);
        c.fillStyle = p > 0.92 ? "#ff5a5a" : p > 0.66 ? "#ffb13f" : "#6cdc6c";
        c.fillRect(mx, my + mh * (1 - p), 6, mh * p);
        c.strokeStyle = "rgba(255,255,255,0.8)";
        c.lineWidth = 1;
        c.strokeRect(mx, my, 6, mh);
      }
      G.img(c, s.phase === "clear" ? ":dawgpog:" : s.phase === "fly" ? ":dawgsus:" : ":dawgW:", X(s.dog.x), Y(s.dog.y), 11 * S);
      if (s.phase !== "clear" || s.clear > 1.2) drawBall(G, c, V, s.phase === "aim" || s.phase === "warp" ? {
        x: s.dog.x + 3.5,
        y: s.dog.y - 3
      } : s.ball, s.rot);
      hud(G, c, s);
      banner(G, c, s);
      s.btns = [{
        k: "reset",
        x: G.W - 50,
        y: 40,
        w: 44,
        h: 40
      }];
      c.fillStyle = "rgba(0,0,0,0.45)";
      c.beginPath();
      c.arc(G.W - 28, 60, 18, 0, 7);
      c.fill();
      G.text(c, "↺", G.W - 28, 61, 14, "#fff");
      if (s.shots >= s.L.par + 5) {
        s.btns.push({
          k: "skip",
          x: 8,
          y: 40,
          w: 70,
          h: 36
        });
        c.fillStyle = "rgba(0,0,0,0.45)";
        c.fillRect(8, 42, 70, 32);
        G.text(c, "SKIP", 43, 58, 10, "#fff");
      }
      if (s.phase === "fly") G.hint(c, "TAP TO WARP", 99, G.H * 0.2);else if (s.tipT > 0 && s.L.tip) G.hint(c, s.L.tip, s.tipT, G.H * 0.2);
    },
    btnAt: function btnAt(G, x, y) {
      return (G.s.btns || []).find(function (b) {
        return x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h;
      });
    },
    down: function down(G, x, y) {
      var s = G.s,
        b = this.btnAt(G, x, y);
      if (b) {
        if (b.k === "reset" && s.phase !== "clear") this.home(G);
        if (b.k === "skip" && s.phase !== "clear") {
          s.shots = 99;
          this.advance(G);
        }
        return;
      }
      this.press(G);
    },
    up: function up(G) {
      this.release(G);
    },
    press: function press(G) {
      var s = G.s;
      s.held = true;
      if (s.phase === "fly") this.warp(G);else if (s.phase === "aim" && !s.charge) s.charge = {
        p: 0,
        t: 0
      };
    },
    release: function release(G) {
      var s = G.s;
      s.held = false;
      if (s.phase === "aim" && s.charge) this.shoot(G);
      s.charge = null;
    },
    onKey: function onKey(G, k, d) {
      var s = G.s;
      if (k !== " ") return;
      if (d) {
        if (s.keyDown) return;
        s.keyDown = true;
        this.press(G);
      } else {
        s.keyDown = false;
        this.release(G);
      }
    }
  });
  pup._eng = ENG;
  defGame(pup);
})();