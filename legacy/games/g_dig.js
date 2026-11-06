function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
(function () {
  var C = 11,
    DIRS = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  var BANDS = [["#c98c4a", "#8a5a2b"], ["#b5703a", "#7a4a22"], ["#9c5a32", "#64381c"], ["#7f4630", "#4f2a18"]];
  defGame({
    key: "dig",
    name: "Dig Dawg",
    icon: "⛏️",
    max: 999999,
    blurb: "Dig tunnels, bark critters until they pop.",
    how: "Press and drag in a direction to dig that way; let go to stop. Tap anywhere to BARK in the direction you're facing. Each bark puffs a mole or badger up a little; four barks and it pops. Stop barking and it shrinks back. Critters chase you through your tunnels and can sneak through dirt as ghostly eyes. Dig out the dirt under a 🪨 rock and it falls, squashing anything below (big points, and watch your own head). Deeper critters are worth more. Clear them all to go to the next yard. 3 lives.",
    reset: function reset(G) {
      var cs = Math.floor(Math.min(G.W / C, (G.H - 34 - 54) / 14)),
        R = Math.floor((G.H - 34 - 54) / cs);
      G.s = {
        cs: cs,
        R: R,
        ox: Math.floor((G.W - cs * C) / 2),
        oy: 34,
        lvl: 0,
        lives: 3,
        score: 0,
        fx: [],
        bark: null,
        held: null,
        face: [1, 0],
        msgT: 0,
        dead: 0,
        rocksDropped: 0,
        bonus: null
      };
      this.level(G);
    },
    level: function level(G) {
      var s = G.s,
        R = s.R;
      s.lvl++;
      s.msgT = 1.8;
      s.dug = [];
      for (var y = 0; y < R; y++) {
        s.dug.push(new Array(C).fill(y === 0));
      }
      var mid = Math.floor(C / 2),
        half = Math.floor(R / 2);
      for (var _y = 0; _y <= half; _y++) s.dug[_y][mid] = true;
      s.start = [mid, half];
      s.p = {
        x: mid,
        y: half,
        dir: [0, 0]
      };
      var n = Math.min(8, 3 + s.lvl),
        spots = [],
        used = new Set();
      for (var k = 0; k < 60 && spots.length < n; k++) {
        var horiz = Math.random() < 0.5,
          x = 1 + Math.floor(Math.random() * (C - 4)),
          _y2 = 3 + Math.floor(Math.random() * (R - 6));
        if (Math.abs(x + 1 - mid) + Math.abs(_y2 - half) < 6 || Math.abs(x + 1 - mid) < 3 && _y2 <= half + 2) continue;
        var cells = horiz ? [[x, _y2], [x + 1, _y2], [x + 2, _y2]] : [[x + 1, _y2 - 1], [x + 1, _y2], [x + 1, _y2 + 1]];
        if (cells.some(function (_ref) {
          var _ref2 = _slicedToArray(_ref, 2),
            a = _ref2[0],
            b = _ref2[1];
          return used.has(a + "," + b) || used.has(a + "," + (b - 1)) || used.has(a + "," + (b + 1));
        })) continue;
        cells.forEach(function (_ref3) {
          var _ref4 = _slicedToArray(_ref3, 2),
            a = _ref4[0],
            b = _ref4[1];
          s.dug[b][a] = true;
          used.add(a + "," + b);
        });
        spots.push(cells[1]);
      }
      s.en = spots.map(function (_ref5, i) {
        var _ref6 = _slicedToArray(_ref5, 2),
          x = _ref6[0],
          y = _ref6[1];
        return {
          x: x,
          y: y,
          hx: x,
          hy: y,
          k: i % 3 === 2 ? "badger" : "mole",
          tx: x,
          ty: y,
          puff: 0,
          ghost: 0,
          gT: 6 + Math.random() * 6,
          dead: 0
        };
      });
      s.rocks = [];
      var _loop = function _loop() {
        var x = Math.floor(Math.random() * C),
          y = 2 + Math.floor(Math.random() * (R - 4));
        if (s.dug[y][x] || s.dug[y + 1][x] || s.rocks.some(function (r) {
          return Math.abs(r.x - x) + Math.abs(r.y - y) < 3;
        }) || used.has(x + "," + (y - 1))) return 1;
        s.rocks.push({
          x: x,
          y: y,
          st: "rest",
          t: 0
        });
      };
      for (var _k = 0; _k < 40 && s.rocks.length < 3 + Math.min(2, s.lvl - 1); _k++) {
        if (_loop()) continue;
      }
      s.bark = null;
      s.held = null;
      s.rocksDropped = 0;
      s.bonus = null;
      s.grace = 2;
    },
    pts: function pts(s, e) {
      return (e.k === "badger" ? 2 : 1) * [200, 300, 400, 500][Math.min(3, Math.floor(e.y / (s.R / 4)))];
    },
    free: function free(s, x, y) {
      return x >= 0 && x < C && y >= 0 && y < s.R && s.dug[y][x] && !s.rocks.some(function (r) {
        return r.st !== "gone" && Math.round(r.x) === x && Math.round(r.y) === y;
      });
    },
    die: function die(G) {
      var s = G.s;
      if (s.dead) return;
      s.lives--;
      s.dead = 1.8;
      G.sfx("lose");
      G.buzz();
      s.bark = null;
    },
    update: function update(G, dt) {
      var _this = this;
      var s = G.s,
        lv = s.lvl - 1;
      s.msgT = Math.max(0, s.msgT - dt);
      s.fx.forEach(function (f) {
        return f.t += dt;
      });
      s.fx = s.fx.filter(function (f) {
        return f.t < 0.9;
      });
      if (s.dead > 0) {
        s.dead -= dt;
        if (s.dead <= 0) {
          s.dead = 0;
          if (s.lives <= 0) return G.over(s.score, s.lvl > 2 ? "Yard ".concat(s.lvl, ". Good digging!") : "Caught in the tunnels!");
          s.p = {
            x: s.start[0],
            y: s.start[1],
            dir: [0, 0]
          };
          s.grace = 2;
          s.en.forEach(function (e) {
            e.x = e.tx = e.hx;
            e.y = e.ty = e.hy;
            e.puff = 0;
            e.ghost = 0;
          });
        }
        return;
      }
      var p = s.p,
        sp = 3.4 * dt,
        d = s.held;
      if (d) {
        var isI = function isI(v) {
            return Math.abs(v - Math.round(v)) < 1e-3;
          },
          step = function step(dv) {
            return Math.abs(dv) <= sp ? dv : Math.sign(dv) * sp;
          };
        if (d[0] && !isI(p.y)) p.y += step(Math.round(p.y) - p.y);else if (d[1] && !isI(p.x)) p.x += step(Math.round(p.x) - p.x);else {
          if (isI(p.x)) p.x = Math.round(p.x);
          if (isI(p.y)) p.y = Math.round(p.y);
          var nx = Math.max(0, Math.min(C - 1, p.x + d[0] * sp)),
            ny = Math.max(0, Math.min(s.R - 1, p.y + d[1] * sp));
          var rock = s.rocks.find(function (r) {
            return r.st !== "gone" && Math.abs(nx - r.x) < 1 && Math.abs(ny - r.y) < 1;
          });
          if (rock) {
            if (d[0]) p.x = Math.round(p.x);else p.y = Math.round(p.y);
          } else {
            p.x = nx;
            p.y = ny;
          }
          s.face = d.slice();
        }
        [[Math.floor(p.x), Math.floor(p.y)], [Math.ceil(p.x), Math.ceil(p.y)]].forEach(function (_ref7) {
          var _ref8 = _slicedToArray(_ref7, 2),
            x = _ref8[0],
            y = _ref8[1];
          if (!s.dug[y][x]) {
            s.dug[y][x] = true;
            s.score += 10;
          }
        });
      }
      if (s.bark) {
        s.bark.t += dt;
        if (s.bark.t > 0.28) s.bark = null;
      }
      if (s.bonus) {
        s.bonus.t -= dt;
        if (s.bonus.t <= 0) s.bonus = null;else if (Math.abs(p.x - s.bonus.x) < 0.6 && Math.abs(p.y - s.bonus.y) < 0.6) {
          s.score += 500 * s.lvl;
          s.fx.push({
            x: s.bonus.x,
            y: s.bonus.y,
            t: 0,
            txt: String(500 * s.lvl)
          });
          s.bonus = null;
          G.sfx("win");
        }
      }
      s.rocks.forEach(function (r) {
        if (r.st === "rest") {
          var bx = r.x,
            by = r.y + 1;
          if (by < s.R && s.dug[by][bx] && !(Math.abs(p.x - bx) < 0.6 && Math.abs(p.y - by) < 0.9 && Math.round(p.x) === bx)) {
            r.st = "wob";
            r.t = 0.6;
          }
        } else if (r.st === "wob") {
          r.t -= dt;
          if (r.t <= 0) {
            r.st = "fall";
            r.kills = 0;
          }
        } else if (r.st === "fall") {
          r.y += 7 * dt;
          var below = Math.floor(r.y) + 1;
          s.en.forEach(function (e) {
            if (!e.dead && Math.abs(e.x - r.x) < 0.7 && e.y > r.y - 0.2 && e.y < r.y + 0.9) {
              e.dead = 1;
              r.kills++;
            }
          });
          if (Math.abs(p.x - r.x) < 0.7 && p.y > r.y - 0.2 && p.y < r.y + 0.9) _this.die(G);
          if (below >= s.R || !s.dug[below][Math.round(r.x)]) {
            r.y = Math.floor(r.y);
            r.st = "gone";
            r.t = 0.4;
            s.rocksDropped++;
            if (r.kills) {
              var pts = [0, 1000, 2500, 4000, 6000][Math.min(4, r.kills)];
              s.score += pts;
              s.fx.push({
                x: r.x,
                y: r.y,
                t: 0,
                txt: String(pts)
              });
              G.sfx("win");
            }
            if (s.rocksDropped === 2 && !s.bonus) s.bonus = {
              x: s.start[0],
              y: s.start[1],
              t: 9
            };
          }
        } else if (r.st === "gone") r.t -= dt;
      });
      s.rocks = s.rocks.filter(function (r) {
        return r.st !== "gone" || r.t > 0;
      });
      if (s.grace > 0) s.grace -= dt;
      var espd = s.grace > 0 ? 0 : (1.7 + lv * 0.18) * dt;
      s.en.forEach(function (e) {
        if (e.dead) {
          e.dead += dt;
          return;
        }
        if (e.puff > 0) {
          e.pT = (e.pT || 0) + dt;
          if (e.pT > 0.9) {
            e.pT = 0;
            e.puff--;
          }
          return;
        }
        if (e.ghost) {
          var _dx = p.x - e.x,
            _dy = p.y - e.y,
            _L = Math.hypot(_dx, _dy) || 1,
            gs = espd * 0.7;
          e.x += _dx / _L * gs;
          e.y += _dy / _L * gs;
          e.ghost += dt;
          var gx = Math.round(e.x),
            gy = Math.round(e.y);
          if (e.ghost > 1.6 && _this.free(s, gx, gy) && Math.abs(e.x - gx) < 0.15 && Math.abs(e.y - gy) < 0.15) {
            e.ghost = 0;
            e.x = e.tx = gx;
            e.y = e.ty = gy;
            e.gT = 7 + Math.random() * 7 - lv * 0.4;
          }
          return;
        }
        e.gT -= dt;
        if (Math.abs(e.x - e.tx) < 0.001 && Math.abs(e.y - e.ty) < 0.001) {
          if (e.gT <= 0 && s.lvl + (s.en.length < 2 ? 3 : 0) > 0 && Math.random() < 0.02 + lv * 0.004) {
            e.ghost = 0.01;
            return;
          }
          var opts = DIRS.filter(function (_ref9) {
            var _ref0 = _slicedToArray(_ref9, 2),
              a = _ref0[0],
              b = _ref0[1];
            return _this.free(s, e.x + a, e.y + b);
          });
          if (!opts.length) {
            if (e.gT <= 0) e.ghost = 0.01;
            return;
          }
          var back = opts.length > 1 ? opts.filter(function (_ref1) {
            var _ref10 = _slicedToArray(_ref1, 2),
              a = _ref10[0],
              b = _ref10[1];
            return !(e.lx === -a && e.ly === -b);
          }) : opts;
          back.sort(function (A, B) {
            return Math.hypot(e.x + A[0] - p.x, e.y + A[1] - p.y) - Math.hypot(e.x + B[0] - p.x, e.y + B[1] - p.y) + (Math.random() - 0.5) * 1.2;
          });
          var _back$ = _slicedToArray(back[0], 2),
            a = _back$[0],
            b = _back$[1];
          e.tx = e.x + a;
          e.ty = e.y + b;
          e.lx = a;
          e.ly = b;
        }
        var dx = e.tx - e.x,
          dy = e.ty - e.y,
          L = Math.hypot(dx, dy);
        if (L <= espd) {
          e.x = e.tx;
          e.y = e.ty;
        } else {
          e.x += dx / L * espd;
          e.y += dy / L * espd;
        }
      });
      s.en = s.en.filter(function (e) {
        return !e.dead || e.dead < 0.5;
      });
      var _iterator = _createForOfIteratorHelper(s.en),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var e = _step.value;
          if (!e.dead && !e.puff && Math.abs(e.x - p.x) < 0.6 && Math.abs(e.y - p.y) < 0.6) {
            this.die(G);
            break;
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
      if (!s.en.length && !s.dead) {
        s.score += 1000 * s.lvl;
        G.sfx("win");
        this.level(G);
      }
    },
    barkNow: function barkNow(G) {
      var s = G.s,
        p = s.p;
      if (s.dead || s.bark) return;
      var _s$face = _slicedToArray(s.face, 2),
        fx = _s$face[0],
        fy = _s$face[1];
      s.bark = {
        t: 0
      };
      G.sfx("pop");
      var hit = null,
        best = 9;
      s.en.forEach(function (e) {
        if (e.dead || e.ghost) return;
        var rx = e.x - p.x,
          ry = e.y - p.y,
          along = rx * fx + ry * fy,
          side = Math.abs(rx * fy - ry * fx);
        if (along > -0.2 && along < 3.2 && side < 0.6 && along < best) {
          var clear = true;
          for (var k = 1; k < Math.round(along); k++) if (!s.dug[Math.round(p.y + fy * k)] || !s.dug[Math.round(p.y + fy * k)][Math.round(p.x + fx * k)]) clear = false;
          if (clear) {
            best = along;
            hit = e;
          }
        }
      });
      if (hit) {
        hit.puff++;
        hit.pT = 0;
        G.buzz();
        if (hit.puff >= 4) {
          hit.dead = 0.01;
          var pts = this.pts(s, hit);
          s.score += pts;
          s.fx.push({
            x: hit.x,
            y: hit.y,
            t: 0,
            txt: String(pts)
          });
        }
      }
    },
    draw: function draw(G, c) {
      var s = G.s,
        cs = s.cs,
        ox = s.ox,
        oy = s.oy,
        dk = G.dark(),
        X = function X(x) {
          return ox + x * cs + cs / 2;
        },
        Y = function Y(y) {
          return oy + y * cs + cs / 2;
        };
      c.fillStyle = dk ? "#0f1522" : "#7ec8f0";
      c.fillRect(0, 0, G.W, G.H);
      for (var y = 1; y < s.R; y++) {
        var b = BANDS[Math.min(3, Math.floor((y - 1) / ((s.R - 1) / 4)))];
        for (var x = 0; x < C; x++) {
          if (s.dug[y][x]) continue;
          c.fillStyle = b[0];
          c.fillRect(ox + x * cs, oy + y * cs, cs, cs);
          c.fillStyle = b[1];
          if ((x * 7 + y * 3) % 4 === 0) c.fillRect(ox + x * cs + cs * 0.25, oy + y * cs + cs * 0.3, 3, 3);
          if ((x * 5 + y * 11) % 5 === 0) c.fillRect(ox + x * cs + cs * 0.65, oy + y * cs + cs * 0.7, 3, 3);
        }
      }
      c.fillStyle = BANDS[3][1];
      c.fillRect(0, oy + s.R * cs, G.W, G.H - oy - s.R * cs);
      c.fillRect(0, oy + cs, ox, s.R * cs);
      c.fillRect(ox + C * cs, oy + cs, G.W, s.R * cs);
      c.fillStyle = dk ? "#1d2a12" : "#4caf50";
      c.fillRect(0, oy + cs - 5, G.W, 5);
      c.fillStyle = dk ? "#161616" : "#2a1a10";
      for (var _y3 = 1; _y3 < s.R; _y3++) for (var _x = 0; _x < C; _x++) if (s.dug[_y3][_x]) c.fillRect(ox + _x * cs, oy + _y3 * cs, cs, cs);
      G.emoji(c, "🌳", ox + cs * 0.8, oy + cs * 0.45, cs * 0.9);
      G.emoji(c, "🏠", ox + cs * (C - 0.9), oy + cs * 0.45, cs * 0.9);
      s.rocks.forEach(function (r) {
        var wob = r.st === "wob" ? Math.sin(G.t * 40) * 2 : 0;
        c.globalAlpha = r.st === "gone" ? Math.max(0, r.t / 0.4) : 1;
        G.emoji(c, "🪨", X(r.x) + wob, Y(r.y), cs * 0.9);
        c.globalAlpha = 1;
      });
      if (s.bonus) G.emoji(c, "🦴", X(s.bonus.x), Y(s.bonus.y), cs * 0.8);
      s.en.forEach(function (e) {
        if (e.dead) {
          G.emoji(c, "💨", X(e.x), Y(e.y), cs * (1 + e.dead * 2));
          return;
        }
        if (e.ghost) {
          c.globalAlpha = 0.85;
          G.emoji(c, "👀", X(e.x), Y(e.y), cs * 0.7);
          c.globalAlpha = 1;
          return;
        }
        var sz = cs * (0.85 + e.puff * 0.22);
        if (e.puff) {
          c.fillStyle = "rgba(255,255,255,0.35)";
          c.beginPath();
          c.arc(X(e.x), Y(e.y), sz * 0.55, 0, 7);
          c.fill();
        }
        G.emoji(c, e.k === "badger" ? "🦡" : "🐭", X(e.x), Y(e.y), sz);
      });
      var p = s.p;
      if (s.dead > 0) G.img(c, ":dawgpain:", X(p.x), Y(p.y), cs * 1.05 * Math.min(1, s.dead));else G.img(c, s.bark ? ":dawgpog:" : ":dawgW:", X(p.x), Y(p.y), cs * 1.05, s.face[0] < 0 ? -0.15 : s.face[0] > 0 ? 0.15 : 0);
      if (s.bark) {
        var _s$face2 = _slicedToArray(s.face, 2),
          fx = _s$face2[0],
          fy = _s$face2[1];
        c.strokeStyle = "#ffd23f";
        c.lineWidth = 3;
        c.globalAlpha = 1 - s.bark.t / 0.28;
        for (var k = 1; k <= 3; k++) {
          var r = cs * (0.4 + k * 0.45) * Math.min(1, s.bark.t / 0.12 + 0.3);
          c.beginPath();
          c.arc(X(p.x), Y(p.y), r, Math.atan2(fy, fx) - 0.5, Math.atan2(fy, fx) + 0.5);
          c.stroke();
        }
        c.globalAlpha = 1;
      }
      s.fx.forEach(function (f) {
        c.globalAlpha = 1 - f.t / 0.9;
        G.text(c, f.txt, X(f.x), Y(f.y) - f.t * 30, 10, "#ffd23f");
      });
      c.globalAlpha = 1;
      G.hud(c, "".concat(s.score), "YARD ".concat(s.lvl), "🐶".repeat(Math.max(0, Math.min(5, s.lives))));
      var by = G.H - 27;
      c.fillStyle = "#f3e0c8";
      c.font = "600 13px ".concat(G.UI);
      c.textAlign = "center";
      c.textBaseline = "middle";
      c.fillText("Drag to dig · Tap to BARK 🗯️", G.W / 2, by);
      if (s.msgT > 0) G.banner(c, "YARD ".concat(s.lvl), "#ffd23f");
    },
    down: function down(G, x, y) {
      var s = G.s;
      s.touch = {
        x: x,
        y: y,
        t: G.t,
        dragged: false
      };
    },
    move: function move(G, x, y) {
      var s = G.s,
        t = s.touch;
      if (!t) return;
      var dx = x - t.x,
        dy = y - t.y;
      if (Math.hypot(dx, dy) > 14) {
        t.dragged = true;
        s.held = Math.abs(dx) > Math.abs(dy) ? [Math.sign(dx), 0] : [0, Math.sign(dy)];
        if (Math.hypot(dx, dy) > 60) {
          t.x = x - Math.sign(dx) * (Math.abs(dx) > Math.abs(dy) ? 40 : 0);
          t.y = y - Math.sign(dy) * (Math.abs(dy) >= Math.abs(dx) ? 40 : 0);
        }
      }
    },
    up: function up(G) {
      var s = G.s,
        t = s.touch;
      s.touch = null;
      s.held = null;
      if (t && !t.dragged) this.barkNow(G);
    },
    onKey: function onKey(G, k, d) {
      var s = G.s,
        m = {
          ArrowLeft: [-1, 0],
          ArrowRight: [1, 0],
          ArrowUp: [0, -1],
          ArrowDown: [0, 1]
        }[k];
      if (m) {
        if (d) s.held = m;else if (s.held && s.held[0] === m[0] && s.held[1] === m[1]) s.held = null;
      }
      if (k === " " && d) this.barkNow(G);
    }
  });
})();