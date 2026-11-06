function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
(function () {
  var PXM = 14;
  var CELL = 170;
  var BEAST_M = 2000;
  var STEP = Math.PI / 6;
  var SPD = [1, 0.82, 0.5, 0];
  var rnd = function rnd(a, b) {
    return a + Math.random() * (b - a);
  };
  var clamp = function clamp(v, a, b) {
    return v < a ? a : v > b ? b : v;
  };
  var E = function E(c, ch, x, y, sz) {
    c.fillStyle = "#000";
    G.emoji(c, ch, x, y, sz);
  };
  var PY = function PY(G) {
    return Math.round(G.H * 0.3);
  };
  var meters = function meters(s) {
    return Math.floor(Math.max(0, s.wy) / PXM);
  };
  var total = function total(s) {
    return Math.min(99999, meters(s) + s.style);
  };
  var pop = function pop(s, x, y, txt, col) {
    return s.pops.push({
      x: x,
      y: y,
      txt: txt,
      col: col,
      t: 1.1
    });
  };
  function genCell(G, cx, cy) {
    var s = G.s,
      list = [],
      x0 = cx * CELL,
      y0 = cy * CELL;
    var m = Math.max(0, y0 / PXM),
      d = clamp(m / 2500, 0, 1);
    var near = function near(x, y) {
      return Math.abs(x) < 80 && y < 260;
    };
    var n = Math.floor(rnd(1, 2.4 + d * 3));
    for (var i = 0; i < n; i++) {
      var x = x0 + rnd(10, CELL - 10),
        y = y0 + rnd(10, CELL - 10);
      if (near(x, y)) continue;
      var q = Math.random();
      if (q < 0.42) {
        var sz = Math.random() < 0.45 ? 0 : Math.random() < 0.6 ? 1 : 2;
        list.push({
          t: "tree",
          x: x,
          y: y,
          sz: sz,
          r: 5 + sz * 3
        });
      } else if (q < 0.54) list.push({
        t: "rock",
        x: x,
        y: y,
        r: 8
      });else if (q < 0.64) list.push({
        t: "stump",
        x: x,
        y: y,
        r: 7
      });else if (q < 0.82) list.push({
        t: "mogul",
        x: x,
        y: y,
        r: 11
      });else if (q < 0.87) list.push({
        t: "pup",
        x: x,
        y: y,
        r: 9
      });else list.push({
        t: "tree",
        x: x,
        y: y,
        sz: 0,
        r: 5
      });
    }
    if (Math.random() < 0.16 && !near(x0 + 85, y0 + 85)) list.push({
      t: "ramp",
      x: x0 + rnd(30, CELL - 30),
      y: y0 + rnd(20, CELL - 20),
      r: 20
    });
    if (Math.random() < 0.12 && !near(x0 + 85, y0 + 85)) {
      var fx = x0 + rnd(40, CELL - 40),
        fy = y0 + rnd(20, CELL - 20),
        blue = Math.random() < 0.5;
      list.push({
        t: "flag",
        x: fx - 34,
        y: fy,
        r: 4,
        blue: blue
      });
      list.push({
        t: "flag",
        x: fx + 34,
        y: fy,
        r: 4,
        blue: blue
      });
      list.push({
        t: "gate",
        x: fx,
        y: fy,
        r: 30
      });
    }
    s.cells.set(cx + "," + cy, list);
  }
  function ensureCells(G) {
    var s = G.s,
      cx0 = Math.floor((s.x - G.W) / CELL),
      cx1 = Math.floor((s.x + G.W) / CELL);
    var cy0 = Math.floor((s.wy - PY(G) - 40) / CELL),
      cy1 = Math.floor((s.wy + G.H + 120) / CELL);
    for (var cy = cy0; cy <= cy1; cy++) for (var cx = cx0; cx <= cx1; cx++) if (!s.cells.has(cx + "," + cy)) genCell(G, cx, cy);
    if (++s.gc > 60) {
      s.gc = 0;
      var _iterator = _createForOfIteratorHelper(s.cells.keys()),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var k = _step.value;
          var p = k.split(","),
            _cx = +p[0],
            _cy = +p[1];
          if ((_cy + 1) * CELL < s.wy - G.H || Math.abs(_cx * CELL - s.x) > G.W * 3) s.cells["delete"](k);
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }
  }
  function crash(G, small, why) {
    var s = G.s;
    if (s.down > 0 || s.inv > 0) return;
    s.down = small ? 0.6 : 1.15;
    s.downMax = s.down;
    s.small = small;
    s.air = 0;
    s.big = false;
    s.flip = 0;
    s.crashes++;
    G.sfx("lose");
    G.buzz();
    pop(s, s.x, s.wy - 34, why || (small ? "BONK!" : "OOF!"), "#ff5a5a");
  }
  function hop(G) {
    var s = G.s;
    if (s.down > 0 || s.eat > 0) return;
    if (s.air > 0) {
      if (s.big && s.flip <= 0) {
        s.flip = 0.5;
        G.sfx("pop");
      }
      return;
    }
    s.air = s.airMax = 0.55;
    s.big = false;
    s.hopH = 15;
    G.sfx("pop");
  }
  function setHeading(s, h) {
    s.h = clamp(h, -3, 3);
  }
  function spawnCat(G) {
    var s = G.s,
      board = Math.random() < 0.4;
    s.cats.push({
      x: s.x + rnd(-G.W * 0.6, G.W * 0.6),
      y: s.wy + G.H - PY(G) + 40,
      vy: rnd(90, 160),
      ph: rnd(0, 6),
      sw: rnd(20, 60),
      board: board,
      fall: 0,
      hit: false
    });
  }
  defGame({
    key: "shred",
    name: "Shred Dawg",
    icon: "⛷️",
    max: 99999,
    cat: "sports",
    blurb: "Ski the endless mountain. Outrun the snow-cat.",
    how: "Hold anywhere and the dog turns to face your finger: straight down is fastest, sideways nearly stops you. Let go to keep your heading. Tap to hop over rocks, stumps, moguls, pups and small trees. Hit a ramp for big air and tap in the air to flip (+40 style), but finish the flip before you land. Ski between two flags for +10. Crashing just costs time. Past 2000 m the giant snow-cat chases you and it keeps getting faster. Score = meters + style.",
    reset: function reset(G) {
      G.s = {
        x: 0,
        wy: 0,
        pwy: 0,
        h: 0,
        v: 0,
        time: 0,
        style: 0,
        crashes: 0,
        air: 0,
        airMax: 0,
        big: false,
        hopH: 15,
        flip: 0,
        flips: 0,
        down: 0,
        downMax: 1,
        small: false,
        inv: 0,
        hold: false,
        holdT: 0,
        fx: 0,
        fy: 0,
        cells: new Map(),
        gc: 0,
        cats: [],
        catT: 3,
        pops: [],
        trail: [],
        trailT: 0,
        beast: null,
        eat: 0,
        banner: 0,
        slowT: 0
      };
      ensureCells(G);
    },
    down: function down(G, x, y) {
      var s = G.s;
      s.hold = true;
      s.holdT = 0;
      s.fx = x;
      s.fy = y;
    },
    move: function move(G, x, y) {
      var s = G.s;
      s.fx = x;
      s.fy = y;
    },
    up: function up(G) {
      G.s.hold = false;
    },
    tap: function tap(G) {
      if (G.s.holdT < 0.22) hop(G);
    },
    onKey: function onKey(G, k, d) {
      if (!d) return;
      var s = G.s;
      if (k === "ArrowLeft" || k === "a") setHeading(s, s.h - 1);else if (k === "ArrowRight" || k === "d") setHeading(s, s.h + 1);else if (k === "ArrowDown" || k === "s") setHeading(s, 0);else if (k === "ArrowUp" || k === " " || k === "w") hop(G);
    },
    update: function update(G, dt) {
      var s = G.s,
        py = PY(G);
      s.time += dt;
      s.inv = Math.max(0, s.inv - dt);
      s.slowT = Math.max(0, s.slowT - dt);
      if (s.hold) s.holdT += dt;
      if (s.eat > 0) {
        s.eat -= dt;
        var _iterator2 = _createForOfIteratorHelper(s.pops),
          _step2;
        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var p = _step2.value;
            p.t -= dt;
            p.y -= 20 * dt;
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }
        if (s.eat <= 0) G.over(total(s), "Gulp! The snow-cat got you.");
        return;
      }
      if (s.hold && s.holdT > 0.1 && s.down <= 0 && !(s.air > 0 && s.big)) {
        var dx = s.fx - G.W / 2,
          dy = s.fy - py;
        if (Math.abs(dx) > 6 || Math.abs(dy) > 6) {
          var ang = dy <= 0 ? dx < 0 ? -Math.PI / 2 : Math.PI / 2 : Math.atan2(dx, dy);
          setHeading(s, Math.round(ang / STEP));
        }
      }
      var m = meters(s),
        vmax = 270 + Math.min(110, m * 0.05);
      s.pwy = s.wy;
      if (s.down > 0) {
        s.down -= dt;
        s.v = Math.max(0, s.v - 900 * dt);
        if (s.down <= 0) {
          s.inv = 0.7;
          s.v = 0;
        }
      } else {
        var ah = Math.abs(s.h);
        var target = ah === 3 ? 42 : vmax * SPD[ah];
        if (s.slowT > 0) target *= 0.55;
        if (s.air > 0) target = Math.max(target, s.v);
        s.v += clamp(target - s.v, -520 * dt, (s.v < 120 ? 260 : 170) * dt);
      }
      var a = s.h * STEP,
        dirx = Math.sin(a),
        diry = Math.abs(s.h) === 3 ? 0 : Math.cos(a);
      if (s.down <= 0) {
        s.x += s.v * dirx * dt;
        s.wy += s.v * diry * dt;
      } else if (s.v > 0) s.wy += s.v * 0.6 * dt;
      if (s.air > 0) {
        s.air -= dt;
        if (s.flip > 0) {
          s.flip -= dt;
          if (s.flip <= 0) {
            s.flips++;
            s.style += 40;
            pop(s, s.x, s.wy - 50, "FLIP! +40", "#ffd23f");
            G.sfx("win");
          }
        }
        if (s.air <= 0) {
          s.air = 0;
          if (s.flip > 0) {
            s.flip = 0;
            s.big = false;
            crash(G, false, "FACEPLANT!");
          } else if (s.big) {
            s.big = false;
            pop(s, s.x, s.wy - 40, "STOMPED!", "#4cc9f0");
          }
        }
      }
      ensureCells(G);
      if (s.down <= 0) {
        var ccx = Math.floor(s.x / CELL),
          ccy = Math.floor(s.wy / CELL),
          hopping = s.air > 0 && !s.big,
          flying = s.air > 0 && s.big;
        for (var cy = ccy - 1; cy <= ccy + 1; cy++) for (var cx = ccx - 1; cx <= ccx + 1; cx++) {
          var list = s.cells.get(cx + "," + cy);
          if (!list) continue;
          var _iterator3 = _createForOfIteratorHelper(list),
            _step3;
          try {
            for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
              var o = _step3.value;
              if (o.hit) continue;
              var ddx = Math.abs(o.x - s.x);
              if (o.t === "gate") {
                if (o.y > s.pwy - 1 && o.y <= s.wy + 1 && ddx < 30) {
                  o.hit = true;
                  s.style += 10;
                  pop(s, s.x, s.wy - 40, "+10", "#4cc9f0");
                  G.sfx("pop");
                }
                continue;
              }
              if (ddx > o.r + 6 || o.y < s.pwy - 7 || o.y > s.wy + 7) continue;
              if (o.t === "ramp") {
                if (s.air <= 0) {
                  o.hit = true;
                  s.air = s.airMax = 1.35;
                  s.big = true;
                  s.hopH = 46;
                  s.v = Math.max(s.v, vmax * 0.8);
                  s.style += 10;
                  pop(s, s.x, s.wy - 44, "AIR! TAP TO FLIP", "#ffd23f");
                  G.sfx("pop");
                }
                continue;
              }
              if (flying || s.inv > 0) continue;
              if (o.t === "mogul") {
                o.hit = true;
                if (!hopping) {
                  s.slowT = 0.45;
                  s.air = s.airMax = 0.3;
                  s.big = false;
                  s.hopH = 7;
                  s.style += 1;
                }
                continue;
              }
              if (hopping && (o.t !== "tree" || o.sz === 0)) continue;
              o.hit = true;
              if (o.t === "pup") {
                o.bonk = 1.2;
                crash(G, true, "BONK! SORRY PUP");
              } else if (o.t === "flag") crash(G, true, "BONK!");else crash(G, false, o.t === "tree" ? "TIMBER!" : "OOF!");
            }
          } catch (err) {
            _iterator3.e(err);
          } finally {
            _iterator3.f();
          }
        }
      }
      if (m > 80) {
        s.catT -= dt;
        if (s.catT <= 0) {
          spawnCat(G);
          s.catT = rnd(2.2, 4.5) - Math.min(1.5, m / 1500);
        }
      }
      for (var i = s.cats.length - 1; i >= 0; i--) {
        var k = s.cats[i];
        if (k.fall > 0) k.fall -= dt;else {
          k.ph += dt;
          k.y += k.vy * dt;
          k.x += Math.cos(k.ph * 1.3) * k.sw * dt;
        }
        if (k.y < s.wy - py - 80 || k.y > s.wy + G.H * 2) {
          s.cats.splice(i, 1);
          continue;
        }
        if (!k.hit && s.down <= 0 && s.inv <= 0 && !(s.air > 0) && Math.abs(k.x - s.x) < 13 && Math.abs(k.y - s.wy) < 10) {
          k.hit = true;
          k.fall = 1.5;
          crash(G, false, "CAT CRASH!");
        }
      }
      if (!s.beast && m >= BEAST_M) {
        s.beast = {
          x: s.x - G.W * 0.4,
          y: s.wy - py - 140,
          spd: 250,
          t: 0
        };
        s.banner = 2.2;
      }
      if (s.banner > 0) s.banner -= dt;
      if (s.beast) {
        var b = s.beast;
        b.t += dt;
        b.spd += 6 * dt;
        var _dx = s.x - b.x,
          _dy = s.wy - b.y,
          dist = Math.hypot(_dx, _dy) || 1;
        b.x += _dx / dist * b.spd * dt;
        b.y += _dy / dist * b.spd * dt;
        if (dist > G.H * 1.6) {
          b.x = s.x - _dx / dist * G.H * 1.6;
          b.y = s.wy - _dy / dist * G.H * 1.6;
        }
        if (dist < 22 && !(s.air > 0 && s.big)) {
          s.eat = 1.5;
          b.x = s.x;
          b.y = s.wy + 6;
          G.sfx("lose");
          G.buzz();
        }
      }
      s.trailT -= dt;
      if (s.trailT <= 0) {
        s.trailT = 0.035;
        var gap = s.air > 0 || s.down > 0 || s.v < 5;
        s.trail.push({
          x: s.x,
          y: s.wy,
          a: a,
          gap: gap
        });
        if (s.trail.length > 70) s.trail.shift();
      }
      for (var _i = s.pops.length - 1; _i >= 0; _i--) {
        var _p = s.pops[_i];
        _p.t -= dt;
        _p.y -= 26 * dt;
        if (_p.t <= 0) s.pops.splice(_i, 1);
      }
      var _iterator4 = _createForOfIteratorHelper(s.cells.values()),
        _step4;
      try {
        for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
          var _list = _step4.value;
          var _iterator5 = _createForOfIteratorHelper(_list),
            _step5;
          try {
            for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
              var _o = _step5.value;
              if (_o.bonk > 0) _o.bonk -= dt;
            }
          } catch (err) {
            _iterator5.e(err);
          } finally {
            _iterator5.f();
          }
        }
      } catch (err) {
        _iterator4.e(err);
      } finally {
        _iterator4.f();
      }
      if (total(s) >= 99999) G.over(99999, "Legend of the mountain!");
    },
    draw: function draw(G, c) {
      var s = G.s,
        W = G.W,
        H = G.H,
        py = PY(G),
        dk = G.dark(),
        t = G.t;
      var ox = W / 2 - s.x,
        oy = py - s.wy;
      c.fillStyle = dk ? "#25304a" : "#ffffff";
      c.fillRect(0, 0, W, H);
      c.fillStyle = dk ? "#33405f" : "#e3eaf4";
      for (var gy = Math.floor((s.wy - py) / 46) * 46; gy < s.wy - py + H + 46; gy += 46) for (var gx = Math.floor((s.x - W / 2) / 46) * 46; gx < s.x + W / 2 + 46; gx += 46) {
        var hsh = Math.abs(gx * 73856093 ^ gy * 19349663) % 997;
        c.fillRect(Math.round(gx + hsh % 40 + ox), Math.round(gy + (hsh >> 3) % 40 + oy), 2, 2);
      }
      if (dk) {
        c.fillStyle = "rgba(255,255,255,0.55)";
        for (var i = 0; i < 26; i++) {
          var fx = (i * 97 + t * 20 * (1 + i % 3)) % W,
            fy = (i * 151 + t * 40 * (1 + i % 2)) % H;
          c.fillRect(fx, fy, 2, 2);
        }
      }
      c.strokeStyle = dk ? "#4a5a80" : "#cdd7e6";
      c.lineWidth = 1.5;
      c.beginPath();
      for (var _i2 = 1; _i2 < s.trail.length; _i2++) {
        var p0 = s.trail[_i2 - 1],
          p1 = s.trail[_i2];
        if (p1.gap || p0.gap) continue;
        for (var off = -3; off <= 3; off += 6) {
          c.moveTo(p0.x + ox + Math.cos(p0.a) * off, p0.y + oy - Math.sin(p0.a) * off);
          c.lineTo(p1.x + ox + Math.cos(p1.a) * off, p1.y + oy - Math.sin(p1.a) * off);
        }
      }
      c.stroke();
      var cy0 = Math.floor((s.wy - py - 60) / CELL),
        cy1 = Math.floor((s.wy - py + H + 60) / CELL);
      var cx0 = Math.floor((s.x - W / 2 - 40) / CELL),
        cx1 = Math.floor((s.x + W / 2 + 40) / CELL);
      for (var pass = 0; pass < 2; pass++) {
        for (var cy = cy0; cy <= cy1; cy++) for (var cx = cx0; cx <= cx1; cx++) {
          var list = s.cells.get(cx + "," + cy);
          if (!list) continue;
          var _iterator6 = _createForOfIteratorHelper(list),
            _step6;
          try {
            for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
              var o = _step6.value;
              var flat = o.t === "mogul" || o.t === "ramp";
              if (flat ? pass === 1 : o.y > s.wy !== (pass === 1)) continue;
              drawObj(c, o, o.x + ox, o.y + oy, dk, t);
            }
          } catch (err) {
            _iterator6.e(err);
          } finally {
            _iterator6.f();
          }
        }
        var _iterator7 = _createForOfIteratorHelper(s.cats),
          _step7;
        try {
          for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
            var k = _step7.value;
            if (k.y > s.wy === (pass === 1)) drawCat(c, k, k.x + ox, k.y + oy, dk, t);
          }
        } catch (err) {
          _iterator7.e(err);
        } finally {
          _iterator7.f();
        }
        if (pass === 0 && !(s.eat > 0 && s.eat < 1.2)) drawDog(G, c, s, W / 2, py, dk);
      }
      if (s.beast) {
        var b = s.beast,
          _bx = b.x + ox,
          _by = b.y + oy;
        if (_by < -10 || _bx < -30 || _bx > W + 30) {
          var ax = clamp(_bx, 16, W - 16),
            ay = clamp(_by, 14, H - 30);
          c.fillStyle = "#ff5a5a";
          c.beginPath();
          c.arc(ax, ay, 11, 0, 7);
          c.fill();
          G.text(c, "!", ax + 1, ay + 1, 12, "#fff");
        } else drawBeast(c, _bx, _by, t, s.eat > 0 ? 1 - s.eat / 1.5 : -1);
      }
      var _iterator8 = _createForOfIteratorHelper(s.pops),
        _step8;
      try {
        for (_iterator8.s(); !(_step8 = _iterator8.n()).done;) {
          var p = _step8.value;
          c.globalAlpha = clamp(p.t, 0, 1);
          G.text(c, p.txt, p.x + ox + 1, p.y + oy + 1, 10, dk ? "#000" : "rgba(0,0,0,0.35)");
          G.text(c, p.txt, p.x + ox, p.y + oy, 10, p.col);
        }
      } catch (err) {
        _iterator8.e(err);
      } finally {
        _iterator8.f();
      }
      c.globalAlpha = 1;
      var bw = 132,
        bh = 66,
        bx = W - bw - 8,
        by = 8;
      c.fillStyle = dk ? "#11182a" : "#ffffff";
      c.fillRect(bx, by, bw, bh);
      c.strokeStyle = dk ? "#8fa3cc" : "#000";
      c.lineWidth = 2;
      c.strokeRect(bx, by, bw, bh);
      var sec = Math.floor(s.time),
        tm = "".concat(Math.floor(sec / 60), ":").concat(String(sec % 60).padStart(2, "0"));
      var tc = dk ? "#e8eefc" : "#000";
      G.text(c, "TIME", bx + 7, by + 11, 10, tc, "left");
      G.text(c, tm, bx + bw - 7, by + 11, 10, tc, "right");
      G.text(c, "DIST", bx + 7, by + 26, 10, tc, "left");
      G.text(c, meters(s) + "m", bx + bw - 7, by + 26, 10, tc, "right");
      G.text(c, "SPEED", bx + 7, by + 41, 10, tc, "left");
      G.text(c, Math.round(s.v / PXM) + "", bx + bw - 7, by + 41, 10, tc, "right");
      G.text(c, "STYLE", bx + 7, by + 56, 10, tc, "left");
      G.text(c, String(s.style), bx + bw - 7, by + 56, 10, tc, "right");
      if (s.banner > 0 && s.eat <= 0) G.banner(c, "SNOW-CAT!", "#ff5a5a", H * 0.62);
      if (s.eat > 0) G.banner(c, "GULP!", "#ff5a5a", H * 0.62);
      if (s.beast && s.eat <= 0 && s.banner <= 0) G.text(c, "RUN!", 12, 20, 12, "#ff5a5a", "left");
      if (G.state === "play") G.hint(c, "HOLD TO STEER · TAP TO HOP", 5);
    }
  });
  function px(c, col, x, y, w, h) {
    c.fillStyle = col;
    c.fillRect(Math.round(x), Math.round(y), w, h);
  }
  function shadow(c, x, y, w) {
    c.fillStyle = "rgba(40,60,100,0.18)";
    c.beginPath();
    c.ellipse(x, y, w, w * 0.35, 0, 0, Math.PI * 2);
    c.fill();
  }
  function drawObj(c, o, x, y, dk, t) {
    if (y < -80 || y > G.H + 60 || x < -40 || x > G.W + 40) return;
    switch (o.t) {
      case "tree":
        {
          var u = [2, 3, 4][o.sz],
            g1 = dk ? "#2f7d55" : "#1f8a3a",
            g2 = dk ? "#3f9a6a" : "#38b04f";
          shadow(c, x + 3, y, 5 + o.sz * 3);
          px(c, "#7a4a20", x - u, y - u * 3, u * 2, u * 3);
          for (var i = 0; i < 6; i++) {
            var w = (6 - i) * u * 1.5 + (i % 2 ? 0 : u),
              yy = y - u * 3 - (i + 1) * u * 1.8;
            px(c, g1, x - w / 2, yy, w, u * 1.8 + 1);
            px(c, g2, x - w / 2, yy, Math.max(u, w * 0.3), u * 1.8 + 1);
          }
          if (dk) px(c, "#dfe8ff", x - u, y - u * 3 - 6 * u * 1.8 - 1, u * 2, u);
          break;
        }
      case "rock":
        {
          var g = dk ? "#7d8599" : "#8e949e",
            hl = dk ? "#a4adc2" : "#b9bec6";
          shadow(c, x + 2, y, 9);
          px(c, "#4a4f58", x - 9, y - 9, 18, 9);
          px(c, g, x - 8, y - 9, 16, 8);
          px(c, "#4a4f58", x - 6, y - 12, 12, 3);
          px(c, g, x - 5, y - 11, 10, 2);
          px(c, hl, x - 6, y - 8, 6, 3);
          break;
        }
      case "stump":
        {
          shadow(c, x + 2, y, 8);
          px(c, "#5a3412", x - 7, y - 9, 14, 9);
          px(c, "#8a5a2b", x - 6, y - 9, 12, 8);
          px(c, "#c99a5f", x - 7, y - 12, 14, 4);
          px(c, "#8a5a2b", x - 3, y - 11, 6, 2);
          break;
        }
      case "mogul":
        {
          c.fillStyle = dk ? "#3a4870" : "#d5dfee";
          c.beginPath();
          c.ellipse(x, y, 13, 6, 0, Math.PI, 0);
          c.fill();
          c.fillStyle = dk ? "#4e5f8f" : "#f3f6fb";
          c.beginPath();
          c.ellipse(x - 2, y - 2, 8, 3, 0, Math.PI, 0);
          c.fill();
          break;
        }
      case "ramp":
        {
          c.globalAlpha = o.hit ? 0.7 : 1;
          c.fillStyle = dk ? "#6b7fae" : "#a9c3e6";
          c.beginPath();
          c.moveTo(x - 20, y + 6);
          c.lineTo(x + 20, y + 6);
          c.lineTo(x + 15, y - 8);
          c.lineTo(x - 15, y - 8);
          c.fill();
          px(c, "#ffd23f", x - 15, y - 9, 30, 4);
          px(c, "#ff8c42", x - 15, y - 9, 6, 4);
          px(c, "#ff8c42", x - 3, y - 9, 6, 4);
          px(c, "#ff8c42", x + 9, y - 9, 6, 4);
          c.globalAlpha = 1;
          break;
        }
      case "flag":
        {
          px(c, dk ? "#cfd8ee" : "#333", x - 1, y - 22, 2, 22);
          c.fillStyle = o.blue ? "#2f6fe0" : "#e63946";
          c.beginPath();
          c.moveTo(x + 1, y - 22);
          c.lineTo(x + 13, y - 18 + Math.sin(t * 6 + x) * 1.5);
          c.lineTo(x + 1, y - 14);
          c.fill();
          break;
        }
      case "pup":
        {
          shadow(c, x, y, 9);
          var bob = o.bonk > 0 ? Math.sin(o.bonk * 30) * 2 : 0;
          E(c, "🐶", x + bob, y - 9, 18);
          if (o.bonk > 0) G.text(c, "?!", x + 13, y - 22, 10, "#ff5a5a");
          break;
        }
    }
  }
  function drawCat(c, k, x, y, dk, t) {
    if (y < -40 || y > G.H + 40) return;
    shadow(c, x, y, 9);
    if (k.fall > 0) {
      px(c, "#444", x - 12, y + 2, 10, 2);
      px(c, "#444", x + 3, y - 3, 10, 2);
      px(c, k.board ? "#7b2cbf" : "#2a9d8f", x - 6, y - 6, 12, 7);
      E(c, "😿", x + 9, y - 8, 14);
      return;
    }
    var lean = Math.cos(k.ph * 1.3);
    if (k.board) {
      c.save();
      c.translate(x, y);
      c.rotate(lean * 0.3);
      px(c, "#ff8c42", -11, -1, 22, 4);
      c.restore();
    } else {
      px(c, "#555", x - 5 + lean * 2, y - 8, 2, 14);
      px(c, "#555", x + 3 + lean * 2, y - 8, 2, 14);
    }
    px(c, k.board ? "#7b2cbf" : "#2a9d8f", x - 5, y - 12, 10, 9);
    E(c, "🐱", x, y - 18, 14);
  }
  function drawDog(G, c, s, x, y, dk) {
    var lift = s.air > 0 ? Math.sin(Math.PI * (1 - s.air / s.airMax)) * s.hopH : 0;
    shadow(c, x, y + 4, s.air > 0 ? 9 - lift * 0.08 : 10);
    if (s.inv > 0 && Math.floor(s.inv * 12) % 2 === 0) c.globalAlpha = 0.5;
    c.save();
    c.translate(x, y - lift);
    var sc = 1 + lift * 0.008;
    c.scale(sc, sc);
    if (s.down > 0) {
      var p = 1 - s.down / s.downMax;
      if (p < 0.55 && !s.small) c.rotate(p * 18);
      var _sk = dk ? "#9ec5ff" : "#1d3557";
      px(c, _sk, -15, 3, 13, 3);
      px(c, _sk, 4, -2, 13, 3);
      px(c, "#e63946", -6, -4, 12, 9);
      G.img(c, ":dawgpain:", 0, -10, 22);
      c.restore();
      c.globalAlpha = 1;
      return;
    }
    if (s.flip > 0) c.rotate((1 - s.flip / 0.5) * Math.PI * 2);
    var a = s.h * STEP,
      ah = Math.abs(s.h);
    c.save();
    c.rotate(-a);
    var sk = dk ? "#9ec5ff" : "#1d3557";
    px(c, sk, -5, -8, 3, 20);
    px(c, sk, 2, -8, 3, 20);
    px(c, "#ffd23f", -5, 10, 3, 2);
    px(c, "#ffd23f", 2, 10, 3, 2);
    c.restore();
    var lean = Math.sin(a) * 3;
    px(c, "#999", -9 + lean, -4, 2, 12);
    px(c, "#999", 7 + lean, -4, 2, 12);
    px(c, "#e63946", -6 + lean, -6, 12, 10);
    px(c, "#ffffff", -6 + lean, -2, 12, 2);
    var scared = s.beast && Math.hypot(s.beast.x - s.x, s.beast.y - s.wy) < 260;
    var face = scared ? ":dawgsweat:" : s.air > 0 && s.big || ah === 0 && s.v > 300 ? ":dawgpog:" : ":dawgW:";
    G.img(c, face, lean * 0.8, -13, 22, s.h * 0.08);
    c.restore();
    c.globalAlpha = 1;
  }
  function drawBeast(c, x, y, t, eatP) {
    var run = Math.sin(t * 12),
      ol = "#9fb3d1";
    c.save();
    c.translate(x, y);
    if (eatP >= 0.3) c.scale(1 + Math.sin(eatP * 20) * 0.03, 1);
    shadow(c, 0, 4, 26);
    var blob = function blob(bx, by, r, col) {
      c.fillStyle = ol;
      c.beginPath();
      c.arc(bx, by, r + 2, 0, 7);
      c.fill();
      c.fillStyle = col || "#ffffff";
      c.beginPath();
      c.arc(bx, by, r, 0, 7);
      c.fill();
    };
    blob(-11, -2 + (eatP < 0 ? run * 3 : 0), 8);
    blob(11, -2 - (eatP < 0 ? run * 3 : 0), 8);
    blob(0, -24, 22);
    blob(-16, -30, 10);
    blob(16, -30, 10);
    blob(-14, -14, 9);
    blob(14, -14, 9);
    var arm = eatP >= 0 ? 6 : run * 8;
    blob(-26, -40 + arm, 8);
    blob(26, -40 - arm, 8);
    blob(0, -52, 18);
    c.fillStyle = ol;
    c.beginPath();
    c.moveTo(-17, -58);
    c.lineTo(-14, -78);
    c.lineTo(-3, -66);
    c.fill();
    c.beginPath();
    c.moveTo(17, -58);
    c.lineTo(14, -78);
    c.lineTo(3, -66);
    c.fill();
    c.fillStyle = "#ffffff";
    c.beginPath();
    c.moveTo(-15, -60);
    c.lineTo(-13, -74);
    c.lineTo(-5, -65);
    c.fill();
    c.beginPath();
    c.moveTo(15, -60);
    c.lineTo(13, -74);
    c.lineTo(5, -65);
    c.fill();
    c.fillStyle = "#e63946";
    c.beginPath();
    c.arc(0, -62, 14, Math.PI, 0);
    c.fill();
    px(c, "#ffffff", -15, -64, 30, 5);
    blob(0, -78, 5, "#ffffff");
    if (eatP >= 0 && eatP < 0.3) {
      c.fillStyle = "#7a1f3d";
      c.beginPath();
      c.ellipse(0, -45, 10, 9, 0, 0, 7);
      c.fill();
      px(c, "#000", -8, -58, 4, 4);
      px(c, "#000", 4, -58, 4, 4);
    } else if (eatP >= 0.3) {
      c.strokeStyle = "#000";
      c.lineWidth = 2;
      c.beginPath();
      c.arc(-6, -54, 3, Math.PI, 0);
      c.stroke();
      c.beginPath();
      c.arc(6, -54, 3, Math.PI, 0);
      c.stroke();
      c.beginPath();
      c.arc(0, -46, 5, 0, Math.PI);
      c.stroke();
      c.fillStyle = "#ffb3c6";
      c.beginPath();
      c.arc(-11, -47, 3, 0, 7);
      c.fill();
      c.beginPath();
      c.arc(11, -47, 3, 0, 7);
      c.fill();
    } else {
      px(c, "#000", -8, -57, 4, 5);
      px(c, "#000", 4, -57, 4, 5);
      px(c, "#fff", -7, -57, 1, 1);
      px(c, "#fff", 5, -57, 1, 1);
      c.fillStyle = "#ff8fab";
      c.beginPath();
      c.moveTo(-3, -50);
      c.lineTo(3, -50);
      c.lineTo(0, -47);
      c.fill();
      c.strokeStyle = "#000";
      c.lineWidth = 1.5;
      c.beginPath();
      c.arc(-3, -46, 3, 0, Math.PI);
      c.stroke();
      c.beginPath();
      c.arc(3, -46, 3, 0, Math.PI);
      c.stroke();
      c.strokeStyle = ol;
      c.beginPath();
      c.moveTo(-8, -48);
      c.lineTo(-20, -50);
      c.moveTo(-8, -46);
      c.lineTo(-20, -44);
      c.moveTo(8, -48);
      c.lineTo(20, -50);
      c.moveTo(8, -46);
      c.lineTo(20, -44);
      c.stroke();
    }
    c.restore();
  }
})();