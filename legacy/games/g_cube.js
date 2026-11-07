function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
(function () {
  var N = 7;
  var DIRS = [[-1, -1], [-1, 0], [1, 0], [1, 1]];
  var LVLS = [{
    need: 1,
    flip: false,
    tip: "Hop on every cube once."
  }, {
    need: 2,
    flip: false,
    tip: "Two hops per cube."
  }, {
    need: 1,
    flip: true,
    tip: "Careful: hop again and it flips back."
  }, {
    need: 2,
    flip: true,
    tip: "Two hops, and done cubes flip back."
  }];
  var PALS = [{
    top: ["#5b8def", "#f7d046", "#e9505a"],
    l: "#c58b5a",
    r: "#7b4f2c"
  }, {
    top: ["#e9505a", "#7ed957", "#f7d046"],
    l: "#7f8fa6",
    r: "#4b5568"
  }, {
    top: ["#f7d046", "#b07cf0", "#4dd0e1"],
    l: "#4e8f6a",
    r: "#2d5a3f"
  }, {
    top: ["#ffffff", "#ff9f43", "#3d7cf5"],
    l: "#a35d7a",
    r: "#6b3550"
  }];
  defGame({
    key: "cube",
    name: "Cube Dawg",
    icon: "🧊",
    max: 999999,
    blurb: "Hop the pyramid. Change every cube. Dodge the cat.",
    how: "Tap the corner of the screen you want to hop toward: up-left, up-right, down-left or down-right of the Big Dawg (or use the arrow keys: up = up-right, right = down-right, down = down-left, left = up-left). Landing on a cube changes its color (+25). Turn every cube to the target color shown at the top to clear the round. Red yarn balls roll down the pyramid. The purple ball hatches into an alley cat at the bottom that chases you. Hop off the edge onto a spinning frisbee to fly back to the top, and if the cat is right behind you it jumps off after you (+500). Catch a tennis ball to freeze everything (+100) and catch squirrels before they undo your cubes (+300). Hop off the pyramid anywhere else and you fall. 4 lives.",
    reset: function reset(G) {
      var s = G.s = {
        lvl: 0,
        rnd: 0,
        pts: 0,
        lives: 4,
        pops: [],
        ens: [],
        loop: 0
      };
      this.size(G);
      this.round(G);
    },
    size: function size(G) {
      var s = G.s,
        W = G.W,
        H = G.H;
      s.cw = Math.floor(Math.min((W - 28) / N, (H - 34 - 150) / (6 * 0.77 + 1.05)));
      s.q = s.cw * 0.27;
      s.d = s.cw * 0.5;
      s.step = s.q + s.d;
      var tot = 6 * s.step + 2 * s.q + s.d;
      s.y0 = 34 + Math.max(70, (H - 34 - tot) / 2 + 10) + s.q;
    },
    round: function round(G) {
      var s = G.s;
      s.cubes = [];
      for (var r = 0; r < N; r++) {
        s.cubes.push([]);
        for (var c = 0; c <= r; c++) s.cubes[r].push(0);
      }
      s.L = LVLS[s.lvl % LVLS.length];
      s.pal = PALS[(s.lvl + s.rnd) % PALS.length];
      s.p = {
        r: 0,
        c: 0,
        fr: 0,
        fc: 0,
        t: 1,
        q: null
      };
      s.ens = [];
      s.freeze = 0;
      s.spawnT = 1.6;
      s.spawned = 0;
      s.won = 0;
      s.dead = 0;
      s.fall = null;
      s.ride = null;
      s.lure = null;
      var rows = [2, 3, 4, 5];
      var pick = function pick() {
        return rows.splice(Math.floor(Math.random() * rows.length), 1)[0];
      };
      s.discs = [{
        side: -1,
        r: pick()
      }, {
        side: 1,
        r: pick()
      }];
      if (s.rnd >= 2) s.discs.push({
        side: Math.random() < 0.5 ? -1 : 1,
        r: pick()
      });
      s.intro = 1.8;
    },
    speed: function speed(G) {
      var s = G.s;
      return 1 + Math.min(0.9, (s.lvl * 4 + s.rnd) * 0.04);
    },
    pos: function pos(G, r, c) {
      var s = G.s;
      return [G.W / 2 + (c - r / 2) * s.cw, s.y0 + r * s.step];
    },
    on: function on(r, c) {
      return r >= 0 && r < N && c >= 0 && c <= r;
    },
    where: function where(G, o, lift) {
      var _this$pos = this.pos(G, o.fr, o.fc),
        _this$pos2 = _slicedToArray(_this$pos, 2),
        x0 = _this$pos2[0],
        y0 = _this$pos2[1],
        _this$pos3 = this.pos(G, o.r, o.c),
        _this$pos4 = _slicedToArray(_this$pos3, 2),
        x1 = _this$pos4[0],
        y1 = _this$pos4[1],
        t = Math.min(1, o.t);
      return [x0 + (x1 - x0) * t, y0 + (y1 - y0) * t - Math.sin(Math.PI * t) * G.s.cw * 0.42 - (lift || 0)];
    },
    pop: function pop(s, x, y, txt, col) {
      s.pops.push({
        x: x,
        y: y,
        t: 1,
        txt: txt,
        col: col || "#ffd23f"
      });
    },
    input: function input(G, d) {
      var s = G.s,
        p = s.p;
      if (s.dead || s.fall || s.ride || s.won || s.intro > 0.6) return;
      if (p.t < 1) {
        if (p.t > 0.45) p.q = d;
        return;
      }
      this.hop(G, d);
    },
    hop: function hop(G, d) {
      var s = G.s,
        p = s.p,
        _DIRS$d = _slicedToArray(DIRS[d], 2),
        dr = _DIRS$d[0],
        dc = _DIRS$d[1],
        r = p.r + dr,
        c = p.c + dc;
      p.fr = p.r;
      p.fc = p.c;
      p.r = r;
      p.c = c;
      p.t = 0;
      p.d = d;
      p.q = null;
      G.sfx("pass");
    },
    down: function down(G, x, y) {
      var s = G.s,
        _this$where = this.where(G, s.p, s.cw * 0.3),
        _this$where2 = _slicedToArray(_this$where, 2),
        px = _this$where2[0],
        py = _this$where2[1];
      this.input(G, x < px ? y < py ? 0 : 2 : y < py ? 1 : 3);
    },
    onKey: function onKey(G, k, d) {
      if (!d) return;
      var m = {
        ArrowLeft: 0,
        q: 0,
        ArrowUp: 1,
        e: 1,
        ArrowDown: 2,
        z: 2,
        ArrowRight: 3,
        c: 3
      }[k];
      if (m !== undefined) this.input(G, m);
    },
    land: function land(G) {
      var s = G.s,
        p = s.p;
      if (!this.on(p.r, p.c)) {
        var disc = s.discs.find(function (dd) {
          return dd.r === p.r && (dd.side < 0 && p.c === -1 || dd.side > 0 && p.c === p.r + 1);
        });
        if (disc) {
          s.discs = s.discs.filter(function (dd) {
            return dd !== disc;
          });
          var _this$pos5 = this.pos(G, p.r, p.c),
            _this$pos6 = _slicedToArray(_this$pos5, 2),
            x = _this$pos6[0],
            y = _this$pos6[1];
          s.ride = {
            t: 0,
            x: x,
            y: y
          };
          var cat = s.ens.find(function (e) {
            return e.k === "cat";
          });
          if (cat && Math.abs(cat.r - p.fr) + Math.abs(cat.c - p.fc) <= 2) s.lure = {
            r: p.fr,
            c: p.fc,
            d: p.d,
            t: 3
          };
          G.sfx("win");
          return;
        }
        s.fall = {
          t: 0
        };
        G.sfx("lose");
        return;
      }
      var L = s.L,
        v = s.cubes[p.r][p.c];
      if (v < L.need) {
        s.cubes[p.r][p.c] = v + 1;
        s.pts += 25;
      } else if (L.flip) s.cubes[p.r][p.c] = v - 1;
      if (s.cubes.every(function (row) {
        return row.every(function (x) {
          return x === L.need;
        });
      })) {
        var bonus = 1000 + 250 * (s.lvl * 4 + s.rnd) + 50 * s.discs.length;
        s.pts += bonus;
        s.won = 2.2;
        s.bonus = bonus;
        s.ens = [];
        G.sfx("win");
      }
    },
    spawn: function spawn(G) {
      var s = G.s,
        n = s.spawned++,
        has = function has(k) {
          return s.ens.some(function (e) {
            return e.k === k;
          });
        };
      var k = "red";
      if (n === 1 || n > 3 && !has("egg") && !has("cat") && Math.random() < 0.35) k = "egg";else if (n > 2 && !has("green") && Math.random() < 0.12) k = "green";else if ((s.lvl > 0 || s.rnd > 1) && n > 2 && !has("sq") && Math.random() < 0.2) k = "sq";
      if (k === "egg" && (has("egg") || has("cat"))) k = "red";
      var c = Math.random() < 0.5 ? 0 : 1;
      s.ens.push({
        k: k,
        r: 1,
        c: c,
        fr: -3,
        fc: c - 1.5,
        t: 0,
        wait: 0.35,
        drop: 1
      });
    },
    stepEnemy: function stepEnemy(G, e) {
      var _this = this;
      var s = G.s;
      e.fr = e.r;
      e.fc = e.c;
      e.t = 0;
      e.drop = 0;
      if (e.k === "cat") {
        var best = 0,
          bd = 1e9;
        var lure = s.lure && e.r === s.lure.r && e.c === s.lure.c;
        if (lure) {
          var _DIRS$s$lure$d = _slicedToArray(DIRS[s.lure.d], 2),
            dr = _DIRS$s$lure$d[0],
            dc = _DIRS$s$lure$d[1];
          e.r += dr;
          e.c += dc;
          e.off = 1;
          return;
        }
        var tr = s.lure ? s.lure.r : s.p.r,
          tc = s.lure ? s.lure.c : s.p.c,
          _this$pos7 = this.pos(G, tr, tc),
          _this$pos8 = _slicedToArray(_this$pos7, 2),
          tx = _this$pos8[0],
          ty = _this$pos8[1];
        DIRS.forEach(function (_ref, i) {
          var _ref2 = _slicedToArray(_ref, 2),
            dr = _ref2[0],
            dc = _ref2[1];
          var r = e.r + dr,
            c = e.c + dc;
          if (!_this.on(r, c)) return;
          var _this$pos9 = _this.pos(G, r, c),
            _this$pos0 = _slicedToArray(_this$pos9, 2),
            x = _this$pos0[0],
            y = _this$pos0[1],
            dd = Math.hypot(x - tx, y - ty);
          if (dd < bd) {
            bd = dd;
            best = i;
          }
        });
        e.r += DIRS[best][0];
        e.c += DIRS[best][1];
        return;
      }
      if (e.k === "egg" && e.r === N - 1) {
        e.k = "cat";
        e.wait = 0.8;
        e.t = 1;
        e.fr = e.r;
        e.fc = e.c;
        return;
      }
      e.r += 1;
      e.c += Math.random() < 0.5 ? 0 : 1;
      if (e.r >= N) e.off = 1;
    },
    die: function die(G) {
      var s = G.s;
      if (s.dead) return;
      s.dead = 1.6;
      s.lives--;
      s.ens = [];
      s.lure = null;
      G.sfx("lose");
      G.buzz();
    },
    update: function update(G, dt) {
      var s = G.s,
        p = s.p,
        sp = this.speed(G);
      if (!s.cw) this.size(G);
      s.pops.forEach(function (o) {
        o.t -= dt;
        o.y -= 26 * dt;
      });
      s.pops = s.pops.filter(function (o) {
        return o.t > 0;
      });
      if (s.intro > 0) s.intro -= dt;
      if (s.won) {
        s.won -= dt;
        if (s.won <= 0) {
          s.rnd++;
          if (s.rnd >= 4) {
            s.rnd = 0;
            s.lvl++;
          }
          this.round(G);
        }
        return;
      }
      if (s.dead) {
        s.dead -= dt;
        if (s.dead <= 0) {
          s.dead = 0;
          if (s.lives <= 0) return G.over(s.pts, s.lvl >= 2 ? "Pyramid pro!" : s.lvl ? "@!#?@!" : "Cat got you.");
          if (!this.on(p.r, p.c)) {
            p.r = 0;
            p.c = 0;
          }
          p.fr = p.r;
          p.fc = p.c;
          p.t = 1;
          s.spawnT = 1.4;
        }
        return;
      }
      if (s.fall) {
        s.fall.t += dt;
        if (s.fall.t > 1.1) {
          s.fall = null;
          p.r = p.c = p.fr = p.fc = 0;
          p.t = 1;
          this.die(G);
        }
        return;
      }
      if (s.ride) {
        s.ride.t += dt / 1.1;
        if (s.ride.t >= 1) {
          s.ride = null;
          p.r = 0;
          p.c = 0;
          p.fr = -2;
          p.fc = 0;
          p.t = 0;
          p.drop = 1;
        }
      } else if (p.t < 1) {
        p.t += dt / (0.3 / sp);
        if (p.t >= 1) {
          p.t = 1;
          p.drop = 0;
          this.land(G);
          if (p.q !== null && !s.fall && !s.ride && !s.won) this.hop(G, p.q);
        }
      }
      if (s.lure) {
        s.lure.t -= dt;
        if (s.lure.t <= 0) s.lure = null;
      }
      if (s.freeze > 0) s.freeze -= dt;else {
        if (s.intro <= 0) {
          s.spawnT -= dt;
          if (s.spawnT <= 0) {
            this.spawn(G);
            s.spawnT = Math.max(1.3, 3.2 - (s.lvl * 4 + s.rnd) * 0.1);
          }
        }
        var _iterator = _createForOfIteratorHelper(s.ens),
          _step;
        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var e = _step.value;
            if (e.t < 1) {
              e.t += dt / ((e.drop ? 0.45 : 0.32) / sp);
              if (e.t >= 1) {
                e.t = 1;
                if (e.off) {
                  e.gone = 1;
                  if (e.k === "cat" && s.lure) {
                    s.pts += 500;
                    this.pop(s, G.W / 2, s.y0 - s.cw, "+500 BYE CAT!");
                    s.lure = null;
                    G.sfx("win");
                  }
                  continue;
                }
                if (e.k === "sq" && this.on(e.r, e.c) && s.cubes[e.r][e.c] > 0) s.cubes[e.r][e.c]--;
                e.wait = (e.k === "cat" ? 0.42 : 0.5) / sp;
              }
            } else {
              e.wait -= dt;
              if (e.wait <= 0) this.stepEnemy(G, e);
            }
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
        s.ens = s.ens.filter(function (e) {
          return !e.gone;
        });
      }
      if (s.ride || s.fall) return;
      var _this$where3 = this.where(G, p),
        _this$where4 = _slicedToArray(_this$where3, 2),
        px = _this$where4[0],
        py = _this$where4[1];
      var _iterator2 = _createForOfIteratorHelper(s.ens),
        _step2;
      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var _e = _step2.value;
          if (_e.drop && _e.t < 0.7) continue;
          var _this$where5 = this.where(G, _e),
            _this$where6 = _slicedToArray(_this$where5, 2),
            x = _this$where6[0],
            y = _this$where6[1];
          if (Math.hypot(x - px, y - py) > s.cw * 0.42) continue;
          if (_e.k === "green") {
            _e.gone = 1;
            s.freeze = 3.2;
            s.pts += 100;
            this.pop(s, x, y - 20, "+100 FREEZE");
            G.sfx("win");
          } else if (_e.k === "sq") {
            _e.gone = 1;
            s.pts += 300;
            this.pop(s, x, y - 20, "+300");
            G.sfx("pop");
          } else return this.die(G);
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
      s.ens = s.ens.filter(function (e) {
        return !e.gone;
      });
    },
    cube: function cube(G, c, x, y, top, pal, sc) {
      var s = G.s,
        hw = s.cw / 2 * (sc || 1),
        q = s.q * (sc || 1),
        d = s.d * (sc || 1);
      c.fillStyle = pal.l;
      c.beginPath();
      c.moveTo(x - hw, y);
      c.lineTo(x, y + q);
      c.lineTo(x, y + q + d);
      c.lineTo(x - hw, y + d);
      c.fill();
      c.fillStyle = pal.r;
      c.beginPath();
      c.moveTo(x + hw, y);
      c.lineTo(x, y + q);
      c.lineTo(x, y + q + d);
      c.lineTo(x + hw, y + d);
      c.fill();
      c.fillStyle = top;
      c.beginPath();
      c.moveTo(x, y - q);
      c.lineTo(x + hw, y);
      c.lineTo(x, y + q);
      c.lineTo(x - hw, y);
      c.fill();
      c.strokeStyle = "rgba(0,0,0,0.35)";
      c.lineWidth = 1;
      c.stroke();
    },
    ball: function ball(c, x, y, r, col, line) {
      c.fillStyle = col;
      c.beginPath();
      c.arc(x, y, r, 0, 7);
      c.fill();
      c.strokeStyle = line;
      c.lineWidth = 1.5;
      c.beginPath();
      c.arc(x - r * 0.3, y, r * 0.8, -1, 1);
      c.stroke();
      c.beginPath();
      c.arc(x + r * 0.4, y, r * 0.7, 2, 4.3);
      c.stroke();
    },
    draw: function draw(G, c) {
      var _this2 = this;
      var s = G.s,
        W = G.W,
        H = G.H,
        dark = G.dark();
      if (!s.cubes) return;
      if (!s.cw) this.size(G);
      var bg = c.createLinearGradient(0, 0, 0, H);
      bg.addColorStop(0, dark ? "#05051a" : "#14143a");
      bg.addColorStop(1, dark ? "#120a2a" : "#2a1650");
      c.fillStyle = bg;
      c.fillRect(0, 0, W, H);
      c.fillStyle = "rgba(255,255,255,0.5)";
      for (var i = 0; i < 40; i++) {
        var x = i * 97.3 % W,
          y = 34 + i * 53.7 % (H - 34);
        c.fillRect(x, y, 1.5, 1.5);
      }
      var flash = s.won && Math.floor(s.won * 8) % 2;
      for (var r = 0; r < N; r++) for (var cc = 0; cc <= r; cc++) {
        var _this$pos1 = this.pos(G, r, cc),
          _this$pos10 = _slicedToArray(_this$pos1, 2),
          _x = _this$pos10[0],
          _y = _this$pos10[1],
          v = s.cubes[r][cc];
        this.cube(G, c, _x, _y, flash ? s.pal.top[(v + 1) % s.pal.top.length] : s.pal.top[v], s.pal);
      }
      s.discs.forEach(function (dd) {
        var _this2$pos = _this2.pos(G, dd.r, dd.side < 0 ? -1 : dd.r + 1),
          _this2$pos2 = _slicedToArray(_this2$pos, 2),
          x = _this2$pos2[0],
          y = _this2$pos2[1],
          sp = Math.cos(G.t * 6);
        c.save();
        c.translate(x, y - s.cw * 0.1);
        c.scale(Math.max(0.25, Math.abs(sp)), 1);
        var gr = c.createLinearGradient(-s.cw * 0.3, 0, s.cw * 0.3, 0);
        ["#ff5e5e", "#ffd23f", "#4cd964", "#4d9dff", "#b45cff"].forEach(function (col, i) {
          return gr.addColorStop(i / 4, col);
        });
        c.fillStyle = gr;
        c.beginPath();
        c.ellipse(0, 0, s.cw * 0.3, s.cw * 0.12, 0, 0, 7);
        c.fill();
        c.restore();
      });
      var _iterator3 = _createForOfIteratorHelper(s.ens),
        _step3;
      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var e = _step3.value;
          var _this$where9 = this.where(G, e, s.cw * 0.12),
            _this$where0 = _slicedToArray(_this$where9, 2),
            _x2 = _this$where0[0],
            _y2 = _this$where0[1],
            rr = s.cw * 0.15;
          if (s.freeze > 0) c.globalAlpha = 0.6 + 0.4 * Math.sin(G.t * 12);
          if (e.k === "red") this.ball(c, _x2, _y2, rr, "#e53950", "#ff9aa8");else if (e.k === "egg") this.ball(c, _x2, _y2, rr * 1.1, "#8e44ad", "#d7a6ee");else if (e.k === "green") {
            c.fillStyle = "#c6e83a";
            c.beginPath();
            c.arc(_x2, _y2, rr, 0, 7);
            c.fill();
            c.strokeStyle = "#fff";
            c.lineWidth = 1.5;
            c.beginPath();
            c.arc(_x2 - rr, _y2, rr * 0.8, -0.9, 0.9);
            c.stroke();
          } else if (e.k === "sq") G.emoji(c, "🐿️", _x2, _y2 - rr * 0.6, s.cw * 0.5);else if (e.k === "cat") {
            G.emoji(c, "😼", _x2, _y2 - rr * 0.8, s.cw * 0.55);
          }
          c.globalAlpha = 1;
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }
      var p = s.p;
      var px, py;
      if (s.ride) {
        var t = s.ride.t,
          _this$pos11 = this.pos(G, 0, 0),
          _this$pos12 = _slicedToArray(_this$pos11, 2),
          tx = _this$pos12[0],
          ty = _this$pos12[1];
        px = s.ride.x + (tx - s.ride.x) * t;
        py = s.ride.y + (ty - s.cw * 1.4 - s.ride.y) * t;
      } else {
        var _this$where7 = this.where(G, p, s.cw * 0.3);
        var _this$where8 = _slicedToArray(_this$where7, 2);
        px = _this$where8[0];
        py = _this$where8[1];
        if (s.fall) py += s.fall.t * s.fall.t * H * 0.9;
      }
      if (s.ride) {
        c.save();
        c.translate(px, py + s.cw * 0.28);
        var gr = c.createLinearGradient(-s.cw * 0.3, 0, s.cw * 0.3, 0);
        ["#ff5e5e", "#ffd23f", "#4cd964", "#4d9dff"].forEach(function (col, i) {
          return gr.addColorStop(i / 3, col);
        });
        c.fillStyle = gr;
        c.beginPath();
        c.ellipse(0, 0, s.cw * 0.3, s.cw * 0.1, 0, 0, 7);
        c.fill();
        c.restore();
      }
      if (!(s.fall && py > H + 40)) G.img(c, s.dead || s.fall ? ":dawgpain:" : p.t < 1 || s.ride ? ":dawgpog:" : ":dawgW:", px, py, s.cw * 0.62);
      if (s.dead) {
        var bx = px + s.cw * 0.2,
          by = py - s.cw * 0.75,
          bw = Math.max(86, s.cw * 1.6);
        c.fillStyle = "#fff";
        c.beginPath();
        if (c.roundRect) c.roundRect(bx - bw / 2, by - 16, bw, 32, 10);else c.rect(bx - bw / 2, by - 16, bw, 32);
        c.fill();
        c.beginPath();
        c.moveTo(bx - 8, by + 14);
        c.lineTo(px, py - s.cw * 0.3);
        c.lineTo(bx + 4, by + 14);
        c.fill();
        G.text(c, "@!#?@!", bx, by, 11, "#111");
      }
      s.pops.forEach(function (o) {
        c.globalAlpha = Math.min(1, o.t * 2);
        G.text(c, o.txt, o.x, o.y, 11, o.col);
        c.globalAlpha = 1;
      });
      G.hud(c, "".concat(s.pts), "CUBE DAWG", "LV ".concat(s.lvl + 1, "-").concat(s.rnd + 1));
      G.text(c, "GOAL", 12, 54, 9, "#fff", "left");
      this.cube(G, c, 70, 52, s.pal.top[s.L.need], s.pal, 0.42);
      for (var _i = 0; _i < Math.min(6, s.lives - (s.dead ? 0 : 1)); _i++) G.img(c, ":dawgW:", W - 18 - _i * 22, 54, 18);
      if (s.won) {
        G.text(c, "ROUND CLEAR!", W / 2, H - 70, 14, "#ffd23f");
        G.text(c, "+".concat(s.bonus), W / 2, H - 46, 12, "#fff");
      } else if (s.intro > 0) {
        G.text(c, "LEVEL ".concat(s.lvl + 1, " \xB7 ROUND ").concat(s.rnd + 1), W / 2, H - 70, Math.min(13, W / 28), "#ffd23f");
        G.text(c, s.L.tip, W / 2, H - 46, Math.min(10, W / 40), "#fff");
      } else if (G.state === "play") G.hint(c, "TAP A CORNER TO HOP", 6);
    }
  });
})();