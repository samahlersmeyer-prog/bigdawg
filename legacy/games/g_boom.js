function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
(function () {
  var COLS = 11,
    ROWS = 13,
    GOAL = 10,
    HUD = 40,
    CTRL = 112;
  var TOUCH = typeof window !== "undefined" && "ontouchstart" in window;
  var clamp = function clamp(v, a, b) {
      return v < a ? a : v > b ? b : v;
    },
    hyp = Math.hypot;
  var D4 = [[1, 0], [0, 1], [-1, 0], [0, -1]];
  var MAPS = [["2.........3", "...........", "..##...##..", "..#.....#..", ".....b.....", "....~~~....", ".b..~~~..b.", "....~~~....", ".....b.....", "..#.....#..", "..##...##..", "...........", "1.........4"], ["2....#....3", ".....#.....", "..b.....b..", "...........", "##..~.~..##", "...........", "....###....", "...........", "##..~.~..##", "...........", "..b.....b..", ".....#.....", "1....#....4"], ["2.........3", ".###...###.", "...........", ".....#.....", "~~~..#..~~~", "...........", ".b...b...b.", "...........", "~~~..#..~~~", ".....#.....", "...........", ".###...###.", "1.........4"], ["2.........3", ".#..#.#..#.", "...........", "...b...b...", ".#.......#.", "....~~~....", ".#..~~~..#.", "....~~~....", ".#.......#.", "...b...b...", "...........", ".#..#.#..#.", "1.........4"]];
  var WHO = [{
    name: "YOU",
    face: ":dawgW:",
    col: "#ffd23f"
  }, {
    name: "MITTENS",
    em: "🐱",
    col: "#ef4444"
  }, {
    name: "RUSTY",
    em: "🦊",
    col: "#fb923c"
  }, {
    name: "BAO",
    em: "🐼",
    col: "#38bdf8"
  }];
  var PW = {
    multi: ["🖐️", "MULTI x5"],
    extra: ["➕", "EXTRA RANG"],
    boom: ["💣", "EXPLOSIVE"],
    fire: ["🔥", "FIRE"],
    ice: ["❄️", "ICE"],
    shield: ["🛡️", "SHIELD"],
    speed: ["☕", "CAFFEINATED"],
    tele: ["🌀", "WARP"],
    wall: ["👻", "GHOST DASH"],
    tk: ["🧠", "TELEKINESIS"],
    decoy: ["🎭", "DECOY"],
    disguise: ["🥸", "DISGUISE"],
    royale: ["🌩️", "BATTLE ROYALE"],
    bam: ["😵", "BAMBOOZLED"]
  };
  var DIFF = [{
    t: "PUP",
    base: 0,
    max: 0.4,
    cool: 1.8,
    spd: 0.82,
    mult: 0.75
  }, {
    t: "DAWG",
    base: 0.12,
    max: 0.65,
    cool: 1.3,
    spd: 0.92,
    mult: 1
  }, {
    t: "BIG DAWG",
    base: 0.25,
    max: 0.95,
    cool: 1,
    spd: 1,
    mult: 1.5
  }];
  var MODES = [{
    m: "ffa",
    t: "FREE FOR ALL",
    d: "+1 per knockout, +1 last one standing"
  }, {
    m: "teams",
    t: "TEAMS",
    d: "You + Bao vs Mittens + Rusty"
  }, {
    m: "gold",
    t: "GOLDEN BOOMERANG",
    d: "Hold the gold to fill your score"
  }, {
    m: "seek",
    t: "HIDE & SEEK",
    d: "Hiders become bushes. Swap each round"
  }];
  var PWK = Object.keys(PW);
  var tileAt = function tileAt(s, x, y) {
    var cx = Math.floor(x / s.T),
      cy = Math.floor(y / s.T);
    return cx < 0 || cy < 0 || cx >= COLS || cy >= ROWS ? "#" : s.map[cy][cx];
  };
  var hasP = function hasP(f, k) {
    return f.pw.indexOf(k) >= 0;
  };
  var lethal = function lethal(r, f) {
    return r.st !== "ground" && f.team !== (r.safe || r.o).team;
  };
  var counting = function counting(s, f) {
    return s.mode === "seek" && s.rt < 2.5 && !f.hider;
  };
  var edge = function edge(s, x, y) {
    var cx = Math.floor(x / s.T),
      cy = Math.floor(y / s.T);
    return Math.min(cx, cy, COLS - 1 - cx, ROWS - 1 - cy);
  };
  var stormAt = function stormAt(s, x, y) {
    return s.storm ? edge(s, x, y) < Math.min(3, s.storm.n + 1) : false;
  };
  function freeSpot(s, x, y) {
    var b = [x, y],
      bd = 1e9;
    for (var cy = 0; cy < ROWS; cy++) for (var cx = 0; cx < COLS; cx++) {
      var ch = s.map[cy][cx],
        px = (cx + 0.5) * s.T,
        py = (cy + 0.5) * s.T,
        d = hyp(px - x, py - y);
      if (ch !== "#" && ch !== "~" && !stormAt(s, px, py) && d < bd) {
        bd = d;
        b = [px, py];
      }
    }
    return b;
  }
  function leader(s) {
    var t = s.tp.map(function (v, i) {
      return [Math.floor(v), i];
    }).filter(function (a) {
      return s.f.some(function (f) {
        return f.team === a[1];
      });
    }).sort(function (a, b) {
      return b[0] - a[0];
    });
    return [t[0][0], t[1][0], s.f.find(function (f) {
      return f.team === t[0][1];
    })];
  }
  var pop = function pop(s, x, y, txt, col) {
    return s.pops.push({
      x: x,
      y: y,
      txt: txt,
      col: col || "#fff",
      t: 1
    });
  };
  function puff(s, x, y, col, n) {
    for (var i = 0; i < n; i++) {
      var a = Math.random() * 6.28,
        v = (1 + Math.random() * 4) * s.T;
      s.fx.push({
        x: x,
        y: y,
        vx: Math.cos(a) * v,
        vy: Math.sin(a) * v,
        t: 0.5,
        col: col
      });
    }
  }
  function moveF(s, f, dx, dy) {
    var r = s.T * 0.34,
      wet = f.cpu,
      ghost = f.dashT > 0 && hasP(f, "wall");
    var bad = function bad(x, y, solid) {
      var cx = Math.floor(x / s.T),
        cy = Math.floor(y / s.T);
      if (cx < 0 || cy < 0 || cx >= COLS || cy >= ROWS) return true;
      var t = s.map[cy][cx];
      return t === "#" && (solid || !ghost) || wet && t === "~";
    };
    var blocked = function blocked(x, y, solid) {
      return bad(x - r, y - r, solid) || bad(x + r, y - r, solid) || bad(x - r, y + r, solid) || bad(x + r, y + r, solid);
    };
    if (!blocked(f.x + dx, f.y)) f.x += dx;
    if (!blocked(f.x, f.y + dy)) f.y += dy;
    if (!ghost && hasP(f, "wall") && blocked(f.x, f.y, true)) {
      var p = freeSpot(s, f.x, f.y);
      f.x = p[0];
      f.y = p[1];
    }
  }
  function los(s, x0, y0, x1, y1) {
    var n = Math.ceil(hyp(x1 - x0, y1 - y0) / (s.T * 0.4));
    for (var i = 1; i < n; i++) if (tileAt(s, x0 + (x1 - x0) * i / n, y0 + (y1 - y0) * i / n) === "#") return false;
    return true;
  }
  function path(s, f, gx, gy) {
    var T = s.T,
      sx = Math.floor(f.x / T),
      sy = Math.floor(f.y / T),
      tx = clamp(Math.floor(gx / T), 0, COLS - 1),
      ty = clamp(Math.floor(gy / T), 0, ROWS - 1);
    if (sx === tx && sy === ty) return [gx, gy];
    var prev = [],
      q = [tx + ty * COLS],
      start = sx + sy * COLS;
    prev[q[0]] = q[0];
    for (var h = 0; h < q.length && prev[start] === undefined; h++) {
      var cur = q[h],
        cx = cur % COLS,
        cy = cur / COLS | 0;
      for (var d = 0; d < 4; d++) {
        var nx = cx + D4[d][0],
          ny = cy + D4[d][1];
        if (nx < 0 || ny < 0 || nx >= COLS || ny >= ROWS) continue;
        var ch = s.map[ny][nx],
          id = nx + ny * COLS;
        if (ch === "#" || ch === "~" || prev[id] !== undefined || id !== start && stormAt(s, (nx + 0.5) * T, (ny + 0.5) * T)) continue;
        prev[id] = cur;
        q.push(id);
      }
    }
    var n = prev[start];
    if (n === undefined) return [gx, gy];
    return [(n % COLS + 0.5) * T, ((n / COLS | 0) + 0.5) * T];
  }
  function hit(s, f, by) {
    if (!f.alive || f.inv > 0) return;
    var i = f.pw.indexOf("shield");
    if (i >= 0) {
      f.pw.splice(i, 1);
      f.inv = 0.7;
      f.burn = null;
      pop(s, f.x, f.y - s.T * 0.7, "BLOCKED!", "#7dd3fc");
      G.sfx("pop");
      return;
    }
    f.alive = false;
    f.charge = -1;
    f.recall = false;
    f.burn = null;
    f.rs = 2.5;
    puff(s, f.x, f.y, f.who.col, 16);
    s.shake = 0.25;
    if (by && by.team !== f.team) {
      if (s.mode !== "gold") s.tp[by.team] += s.mode === "seek" ? 2 : 1;
      if (by === s.f[0]) s.kos++;
      pop(s, f.x, f.y - s.T * 0.7, (s.mode === "gold" ? "KO! " : s.mode === "seek" ? "FOUND! +2 " : "+1 ") + by.who.name, by.who.col);
    }
    if (f === s.f[0]) {
      G.sfx("lose");
      G.buzz();
    } else G.sfx("pop");
  }
  function give(s, f, k) {
    pop(s, f.x, f.y - s.T * 0.8, PW[k][1] + "!", "#fde047");
    if (f === s.f[0]) G.sfx("pass");
    if (k === "royale") {
      if (!s.storm) s.storm = {
        n: 0,
        t: 2.5
      };
      return;
    }
    if (k === "bam") {
      s.f.forEach(function (o) {
        if (o.team !== f.team) o.conf = 4;
      });
      return;
    }
    if (hasP(f, k)) return;
    if (k === "fire" || k === "ice") f.pw = f.pw.filter(function (p) {
      return p !== "fire" && p !== "ice";
    });
    f.pw.push(k);
    if (f.pw.length > 3) f.pw.shift();
    var max = hasP(f, "extra") ? 2 : 1;
    if (max > f.max) f.has++;
    f.max = max;
    f.has = Math.min(f.has, max);
  }
  function throwR(s, f) {
    var T = s.T,
      ch = clamp(f.charge, 0, 0.8) / 0.8;
    f.charge = -1;
    if (f.has <= 0) return;
    f.has--;
    var ang = Math.atan2(f.fy, f.fx);
    if (!f.cpu) {
      var best = 0.3;
      s.f.forEach(function (e) {
        if (e.team === f.team || !e.alive || e.hid) return;
        var d = Math.atan2(e.y - f.y, e.x - f.x) - ang;
        d = Math.atan2(Math.sin(d), Math.cos(d));
        if (Math.abs(d) < Math.abs(best)) best = d;
      });
      if (Math.abs(best) < 0.3) ang += best;
    }
    var n = hasP(f, "multi") ? 5 : 1,
      g = {
        n: n
      },
      kind = hasP(f, "fire") ? "fire" : hasP(f, "ice") ? "ice" : null;
    for (var i = 0; i < n; i++) {
      var a = ang + (i - (n - 1) / 2) * 0.2;
      s.rangs.push({
        o: f,
        g: g,
        x: f.x + Math.cos(a) * T * 0.4,
        y: f.y + Math.sin(a) * T * 0.4,
        vx: Math.cos(a) * 11 * T,
        vy: Math.sin(a) * 11 * T,
        range: (4.5 + 7 * ch) * T,
        st: "fly",
        rot: 0,
        b: 0,
        tr: 0,
        kind: kind,
        boom: hasP(f, "boom"),
        safe: null,
        defl: false,
        ph: false
      });
    }
    if (!f.cpu) G.sfx("throw");
  }
  function caught(s, i) {
    var r = s.rangs.splice(i, 1)[0];
    if (--r.g.n <= 0) r.o.has = Math.min(r.o.max, r.o.has + 1);
  }
  function explode(s, r) {
    var T = s.T;
    s.booms.push({
      x: r.x,
      y: r.y,
      t: 0.4
    });
    s.shake = 0.3;
    G.sfx("lose");
    s.f.forEach(function (f) {
      if (f.alive && f.team !== (r.safe || r.o).team && hyp(f.x - r.x, f.y - r.y) < T * 1.5) hit(s, f, r.safe || r.o);
    });
    s.decoys.forEach(function (d) {
      if (hyp(d.x - r.x, d.y - r.y) < T * 1.5) d.t = 0;
    });
    r.st = "return";
    r.ph = true;
    r.defl = false;
    r.safe = null;
  }
  function act(s, f, kind, down) {
    if (!f.alive || s.phase !== "fight") {
      if (kind === "throw" && !down) {
        f.charge = -1;
        f.recall = false;
      }
      return;
    }
    if (f.frozen > 0) {
      if (kind === "dash" && down) f.frozen -= 0.4;
      return;
    }
    if (counting(s, f)) return;
    if (kind === "throw") {
      if (down) {
        if (f.has > 0) f.charge = 0;else f.recall = true;
      } else {
        if (f.charge >= 0) throwR(s, f);
        f.recall = false;
      }
    } else if (kind === "slash" && down) {
      if (f.has > 0 && f.slashCd <= 0) {
        f.slashT = 0.16;
        f.slashCd = 0.45;
        f.charge = -1;
      }
    } else if (kind === "dash" && down && f.dashCd <= 0) {
      f.dashCd = 0.9;
      var r = hasP(f, "tele") && s.rangs.find(function (r) {
          return r.o === f;
        }),
        t = r && tileAt(s, r.x, r.y);
      if (r && t !== "#" && t !== "~") {
        puff(s, f.x, f.y, "#c4b5fd", 8);
        f.x = r.x;
        f.y = r.y;
        puff(s, f.x, f.y, "#c4b5fd", 8);
        caught(s, s.rangs.indexOf(r));
      } else {
        f.dashT = 0.15;
        if (hasP(f, "decoy") && !s.decoys.some(function (d) {
          return d.o === f;
        })) s.decoys.push({
          o: f,
          team: f.team,
          who: f.who,
          x: f.x,
          y: f.y,
          fx: f.fx,
          fy: f.fy,
          t: 4,
          alive: true,
          hid: false,
          mvx: 0,
          mvy: 0
        });
      }
    }
  }
  function stepF(s, f, mx, my, dt) {
    var T = s.T;
    f.slashT -= dt;
    f.slashCd -= dt;
    f.dashCd -= dt;
    f.inv -= dt;
    if (f.charge >= 0) f.charge += dt;
    if (f.conf > 0) {
      f.conf -= dt;
      mx = -mx;
      my = -my;
    }
    f.still = mx || my || f.charge >= 0 || f.slashT > 0 || f.dashT > 0 ? 0 : f.still + dt;
    if (f.frozen > 0) {
      f.frozen -= dt;
      mx = my = 0;
      f.charge = -1;
      f.dashT = 0;
    } else if ((mx || my) && f.dashT <= 0) {
      var n = hyp(mx, my);
      f.fx = mx / n;
      f.fy = my / n;
    }
    var ice = false;
    var _iterator = _createForOfIteratorHelper(s.patches),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var q = _step.value;
        if (q.o.team === f.team || hyp(q.x - f.x, q.y - f.y) > T * 0.45) continue;
        if (q.k === "fire") {
          if (!f.burn) f.burn = {
            t: 3,
            by: q.o
          };
        } else ice = true;
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
    if (ice) {
      f.chill += dt;
      if (f.chill > 1.1 && f.frozen <= 0) {
        f.frozen = 3;
        f.chill = 0;
        pop(s, f.x, f.y - T * 0.7, "FROZEN!", "#bae6fd");
      }
    } else f.chill = Math.max(0, f.chill - dt * 0.5);
    if (f.burn) {
      f.burn.t -= dt;
      if ([[0, 0], [T, 0], [-T, 0], [0, T], [0, -T]].some(function (o) {
        return tileAt(s, f.x + o[0], f.y + o[1]) === "~";
      })) f.burn = null;else if (f.burn.t <= 0) hit(s, f, f.burn.by);else s.f.forEach(function (o) {
        if (o !== f && o.alive && !o.burn && hyp(o.x - f.x, o.y - f.y) < T * 0.75) o.burn = {
          t: 3,
          by: f.burn.by
        };
      });
    }
    if (!f.alive) return;
    var sp = 4.3 * T * (f.cpu ? s.diff.spd : 1) * (hasP(f, "speed") ? 1.35 : 1) * (f.charge >= 0 ? 0.6 : 1) * (ice ? 0.55 : 1);
    var vx = mx * sp,
      vy = my * sp;
    if (f.dashT > 0) {
      f.dashT -= dt;
      vx = f.fx * 13 * T;
      vy = f.fy * 13 * T;
    }
    f.mvx = vx;
    f.mvy = vy;
    var kd = 1 - Math.min(1, dt * 8);
    vx += f.kx;
    vy += f.ky;
    f.kx *= kd;
    f.ky *= kd;
    moveF(s, f, vx * dt, vy * dt);
    var t = tileAt(s, f.x, f.y);
    f.fake = f.hider ? f.still > 0.4 : hasP(f, "disguise") && f.still > 0.7;
    f.hid = t === "b" || f.fake;
    if (t === "~" && f.dashT <= 0) {
      pop(s, f.x, f.y - T * 0.6, "SPLASH!", "#7dd3fc");
      puff(s, f.x, f.y, "#7dd3fc", 12);
      f.pw = f.pw.filter(function (p) {
        return p !== "shield";
      });
      f.inv = 0;
      hit(s, f, null);
      return;
    }
    if (f.slashT > 0) s.decoys.forEach(function (d) {
      if (d.team !== f.team && hyp(d.x - f.x, d.y - f.y) < T * 1.15) d.t = 0;
    });
    if (f.slashT > 0) s.f.forEach(function (o) {
      if (o.team === f.team || !o.alive) return;
      var dx = o.x - f.x,
        dy = o.y - f.y,
        d = hyp(dx, dy) || 1;
      if (d > T * 1.15 || (dx * f.fx + dy * f.fy) / d < 0.3) return;
      if (o.slashT > 0 && (-dx * o.fx - dy * o.fy) / d > 0.3) {
        f.kx = -dx / d * 9 * T;
        f.ky = -dy / d * 9 * T;
        o.kx = dx / d * 9 * T;
        o.ky = dy / d * 9 * T;
        f.slashT = o.slashT = 0;
        pop(s, (f.x + o.x) / 2, (f.y + o.y) / 2, "CLANG!", "#e5e7eb");
        return;
      }
      hit(s, o, f);
    });
  }
  function stepRangs(s, dt) {
    var T = s.T,
      wall = function wall(x, y) {
        return tileAt(s, x, y) === "#";
      };
    var _loop = function _loop() {
        var r = s.rangs[i],
          o = r.o;
        if (o.recall && o.alive && r.st !== "return") {
          r.st = "return";
          r.ph = true;
          r.defl = false;
          r.safe = null;
        }
        if (r.st === "ground") {
          if (o.alive && hyp(o.x - r.x, o.y - r.y) < T * 0.7) caught(s, i);
          return 0;
        }
        r.rot += dt * 22;
        var sp = hyp(r.vx, r.vy);
        if (r.st === "fly") {
          if (!r.safe && o.alive && hasP(o, "tk")) {
            var g = o.ai.tg,
              want = o.cpu ? g && g.alive ? Math.atan2(g.y - r.y, g.x - r.x) : null : s.inx || s.iny ? Math.atan2(s.iny, s.inx) : null;
            if (want !== null) {
              var a = Math.atan2(r.vy, r.vx),
                d = want - a;
              d = Math.atan2(Math.sin(d), Math.cos(d));
              a += clamp(d, -5 * dt, 5 * dt);
              r.vx = Math.cos(a) * sp;
              r.vy = Math.sin(a) * sp;
            }
          }
          var nx = r.x + r.vx * dt,
            ny = r.y + r.vy * dt,
            bounced = false;
          if (wall(nx, r.y)) {
            r.vx = -r.vx;
            nx = r.x;
            bounced = true;
          }
          if (wall(nx, ny)) {
            r.vy = -r.vy;
            ny = r.y;
            bounced = true;
          }
          r.x = nx;
          r.y = ny;
          r.range -= sp * dt;
          if (bounced) {
            r.b++;
            if (r.boom) {
              explode(s, r);
              return 0;
            }
            if (r.b > 2) {
              r.st = "ground";
              return 0;
            }
          }
          if (r.range <= 0) {
            if (r.boom) {
              explode(s, r);
              return 0;
            }
            r.st = "return";
            r.defl = false;
            r.safe = null;
          }
        } else {
          if (!o.alive) {
            r.st = "ground";
            return 0;
          }
          var dx = o.x - r.x,
            dy = o.y - r.y,
            _d = hyp(dx, dy) || 1,
            k = Math.min(1, dt * 6);
          r.vx += (dx / _d * 12 * T - r.vx) * k;
          r.vy += (dy / _d * 12 * T - r.vy) * k;
          var _nx = r.x + r.vx * dt,
            _ny = r.y + r.vy * dt;
          if (!r.ph && wall(_nx, _ny)) {
            r.st = "ground";
            return 0;
          }
          r.x = _nx;
          r.y = _ny;
          if (_d < T * 0.6) {
            caught(s, i);
            return 0;
          }
        }
        if (r.kind && (r.tr += sp * dt) > T * 0.45) {
          r.tr = 0;
          s.patches.push({
            x: r.x,
            y: r.y,
            k: r.kind,
            o: o,
            t: r.kind === "fire" ? 2.2 : 3.5
          });
        }
        var dc = s.decoys.find(function (d) {
          return d.t > 0 && d.team !== (r.safe || o).team && hyp(d.x - r.x, d.y - r.y) < T * 0.52;
        });
        if (dc) {
          dc.t = 0;
          if (r.boom) explode(s, r);else r.st = "ground";
          return 0;
        }
        var _iterator2 = _createForOfIteratorHelper(s.f),
          _step2;
        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var f = _step2.value;
            if (!f.alive || !lethal(r, f) || hyp(f.x - r.x, f.y - r.y) > T * 0.52) continue;
            if (f.slashT > 0 && (r.x - f.x) * f.fx + (r.y - f.y) * f.fy > 0) {
              r.vx = f.fx * 11 * T;
              r.vy = f.fy * 11 * T;
              r.st = "fly";
              r.range = 5 * T;
              r.b = 0;
              r.safe = f;
              r.defl = true;
              r.ph = false;
              pop(s, f.x, f.y - T * 0.7, "DEFLECT!", "#e5e7eb");
              G.sfx("pop");
            } else {
              hit(s, f, r.safe || o);
              if (r.boom) explode(s, r);else r.st = "ground";
            }
            break;
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }
      },
      _ret;
    for (var i = s.rangs.length - 1; i >= 0; i--) {
      _ret = _loop();
      if (_ret === 0) continue;
    }
  }
  function think(s, f, dt) {
    var T = s.T,
      A = f.ai,
      sk = s.skill,
      to = function to(x, y) {
        var dx = x - f.x,
          dy = y - f.y,
          d = hyp(dx, dy) || 1;
        return [dx / d, dy / d];
      };
    A.cool -= dt;
    if (f.frozen > 0) {
      if (Math.random() < dt * 4) act(s, f, "dash", true);
      return [0, 0];
    }
    if (counting(s, f)) return [0, 0];
    if (stormAt(s, f.x, f.y)) {
      var c = freeSpot(s, COLS * T / 2, ROWS * T / 2),
        _p = path(s, f, c[0], c[1]);
      if (f.charge >= 0) act(s, f, "throw", false);
      return to(_p[0], _p[1]);
    }
    var th = null,
      thd = 3.2 * T;
    var _iterator3 = _createForOfIteratorHelper(s.rangs),
      _step3;
    try {
      for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
        var r = _step3.value;
        if (!lethal(r, f)) continue;
        var dx = f.x - r.x,
          dy = f.y - r.y,
          _d4 = hyp(dx, dy) || 1,
          _sp = hyp(r.vx, r.vy) || 1;
        if (_d4 < thd && (dx * r.vx + dy * r.vy) / (_d4 * _sp) > 0.8) {
          th = r;
          thd = _d4;
        }
      }
    } catch (err) {
      _iterator3.e(err);
    } finally {
      _iterator3.f();
    }
    A.aware = th ? A.aware + dt : 0;
    if (th && A.aware > 0.4 - 0.32 * sk) {
      var sp = hyp(th.vx, th.vy) || 1;
      if (f.has > 0 && thd < 1.4 * T && f.slashCd <= 0 && Math.random() < 0.3 + 0.6 * sk) {
        f.fx = (th.x - f.x) / thd;
        f.fy = (th.y - f.y) / thd;
        f.charge = -1;
        A.aim = 0;
        act(s, f, "slash", true);
        return [0, 0];
      }
      var side = (f.x - th.x) * -th.vy + (f.y - th.y) * th.vx > 0 ? 1 : -1,
        mx = -th.vy / sp * side,
        my = th.vx / sp * side;
      if (thd < 2 * T && f.dashCd <= 0 && f.charge < 0 && Math.random() < sk) {
        f.fx = mx;
        f.fy = my;
        act(s, f, "dash", true);
      }
      return [mx, my];
    }
    var e = null,
      ed = 1e9;
    s.f.concat(s.decoys).forEach(function (o) {
      if (o.team === f.team || !o.alive) return;
      var d = hyp(o.x - f.x, o.y - f.y);
      if (o.hid && d > (o.fake ? 1.2 : 2.5) * T) return;
      if (d < ed) {
        ed = d;
        e = o;
      }
    });
    var gd = s.mode === "gold" ? s.gold : null;
    if (gd && gd.held && gd.held.team !== f.team && !(gd.held.hid && hyp(gd.held.x - f.x, gd.held.y - f.y) > 2.5 * T)) {
      e = gd.held;
      ed = hyp(e.x - f.x, e.y - f.y);
    }
    if (f.charge >= 0) {
      A.aim -= dt;
      if (A.tg && A.tg.alive) {
        var _g = A.tg,
          _lead = hyp(_g.x - f.x, _g.y - f.y) / (11 * T) * sk,
          a = Math.atan2(_g.y + _g.mvy * _lead - f.y, _g.x + _g.mvx * _lead - f.x) + A.err;
        f.fx = Math.cos(a);
        f.fy = Math.sin(a);
      }
      if (A.aim <= 0) act(s, f, "throw", false);
      return [0, 0];
    }
    if (f.hider) {
      if (!A.set) {
        if (!A.spot) A.spot = freeSpot(s, (1 + Math.random() * (COLS - 2)) * T, (1 + Math.random() * (ROWS - 2)) * T);
        if (hyp(A.spot[0] - f.x, A.spot[1] - f.y) < 4 || s.rt > 2.3) A.set = true;else {
          var q = path(s, f, A.spot[0], A.spot[1]);
          return to(q[0], q[1]);
        }
      }
      if (e && ed < 1.7 * T) A.flee = 1.4;
      if ((A.flee -= dt) > 0 && e) {
        var b = null,
          bd = -1;
        [[1.5, 1.5], [COLS - 1.5, 1.5], [1.5, ROWS - 1.5], [COLS - 1.5, ROWS - 1.5], [COLS / 2, 1.5], [COLS / 2, ROWS - 1.5]].forEach(function (c) {
          var d = hyp(c[0] * T - e.x, c[1] * T - e.y);
          if (d > bd) {
            bd = d;
            b = c;
          }
        });
        var _g2 = freeSpot(s, b[0] * T, b[1] * T),
          _p2 = path(s, f, _g2[0], _g2[1]);
        if (ed < 1.3 * T && f.dashCd <= 0 && Math.random() < sk) {
          var d = to(_p2[0], _p2[1]);
          f.fx = d[0];
          f.fy = d[1];
          act(s, f, "dash", true);
        }
        return hyp(_p2[0] - f.x, _p2[1] - f.y) < 3 ? [0, 0] : to(_p2[0], _p2[1]);
      }
      return [0, 0];
    }
    if (f.has === 0) {
      A.noR += dt;
      f.recall = A.noR > 0.5 + 1.2 * (1 - sk);
      var best = null,
        _bd = 1e9;
      s.rangs.forEach(function (r) {
        if (r.o !== f || r.st !== "ground") return;
        var d = hyp(r.x - f.x, r.y - f.y);
        if (d < _bd) {
          _bd = d;
          best = r;
        }
      });
      if (best) {
        var _p3 = path(s, f, best.x, best.y);
        return to(_p3[0], _p3[1]);
      }
      if (e && ed < 3 * T) {
        var _d2 = to(e.x, e.y);
        return [-_d2[0], -_d2[1]];
      }
      return [0, 0];
    }
    A.noR = 0;
    f.recall = false;
    var it = null,
      itd = 4 * T;
    s.items.forEach(function (o) {
      var d = hyp(o.x - f.x, o.y - f.y);
      if (d < itd) {
        itd = d;
        it = o;
      }
    });
    if (gd && !gd.held && !(e && ed < 2 * T)) it = gd;
    if (e) {
      if (ed < 1.25 * T) {
        var _d3 = to(e.x, e.y);
        f.fx = _d3[0];
        f.fy = _d3[1];
        if (f.slashCd <= 0 && Math.random() < dt * (3 + 8 * sk)) act(s, f, "slash", true);
      } else if (A.cool <= 0 && ed < 8.5 * T && los(s, f.x, f.y, e.x, e.y)) {
        A.tg = e;
        A.err = (Math.random() - 0.5) * (0.7 * (1 - sk) + (f.conf > 0 ? 3 : 0));
        A.aim = 0.12 + clamp((ed / T - 4.5) / 7, 0, 1) * 0.8;
        A.cool = (1.2 + (1 - sk) * 1.8 + Math.random() * 0.8) * s.diff.cool;
        act(s, f, "throw", true);
        return [0, 0];
      }
    }
    if (!it && !e) {
      A.wt -= dt;
      if (A.wt <= 0) {
        A.wt = 2;
        A.wx = (1 + Math.random() * (COLS - 2)) * T;
        A.wy = (1 + Math.random() * (ROWS - 2)) * T;
        var h = s.mode === "seek" && s.f.filter(function (o) {
          return o.hider && o.alive;
        })[0];
        if (h && Math.random() < 0.3 + 0.5 * sk) {
          var _c = freeSpot(s, h.x + (Math.random() - 0.5) * 5 * T, h.y + (Math.random() - 0.5) * 5 * T);
          A.wx = _c[0];
          A.wy = _c[1];
        }
      }
    }
    var g = it || e || {
        x: A.wx,
        y: A.wy
      },
      p = path(s, f, g.x, g.y);
    return hyp(p[0] - f.x, p[1] - f.y) < 3 ? [0, 0] : to(p[0], p[1]);
  }
  var lead = function lead(s) {
    return s.tp[s.f[0].team] - Math.max.apply(null, s.f.filter(function (f) {
      return f.team !== s.f[0].team;
    }).map(function (f) {
      return s.tp[f.team];
    }));
  };
  function spawn(s, f) {
    var T = s.T,
      i = s.f.indexOf(f);
    for (var y = 0; y < ROWS; y++) {
      var x = s.map[y].indexOf(String(i + 1));
      if (x >= 0) {
        f.x = (x + 0.5) * T;
        f.y = (y + 0.5) * T;
      }
    }
    var d = hyp(COLS * T / 2 - f.x, ROWS * T / 2 - f.y);
    f.fx = (COLS * T / 2 - f.x) / d;
    f.fy = (ROWS * T / 2 - f.y) / d;
    Object.assign(f, {
      alive: true,
      has: f.max,
      charge: -1,
      recall: false,
      slashT: 0,
      slashCd: 0,
      dashT: 0,
      dashCd: 0,
      inv: 0,
      frozen: 0,
      chill: 0,
      burn: null,
      kx: 0,
      ky: 0,
      mvx: 0,
      mvy: 0,
      hid: false,
      fake: false,
      conf: 0,
      still: 0,
      rs: 0
    });
    f.ai = {
      cool: (1 + Math.random() * 1.5) * s.diff.cool,
      aware: 0,
      aim: 0,
      noR: 0,
      err: 0,
      tg: null,
      wt: 0,
      wx: f.x,
      wy: f.y,
      flee: 0
    };
    f.hider = s.mode === "seek" && f.team === s.hide;
    if (f.hider) f.has = 0;
  }
  function startRound(G) {
    var s = G.s,
      T = s.T;
    s.round++;
    s.map = MAPS[(s.round - 1) % MAPS.length];
    s.rangs = [];
    s.items = [];
    s.patches = [];
    s.booms = [];
    s.fx = [];
    s.pops = [];
    s.decoys = [];
    s.storm = null;
    s.rt = 0;
    s.phase = "intro";
    s.pt = 1.4;
    s.skill = clamp(s.diff.base + s.round * 0.03 + lead(s) * 0.04, 0.05, s.diff.max);
    if (s.mode === "seek") {
      s.hide = s.round % 2;
      var rows = s.map.map(function (r) {
        return r.split("");
      });
      for (var n = 0, k = 0; n < 10 && k < 200; k++) {
        var cx = Math.floor(Math.random() * COLS),
          cy = Math.floor(Math.random() * ROWS);
        if (rows[cy][cx] === "." && edge(s, (cx + 0.5) * T, (cy + 0.5) * T) > 0) {
          rows[cy][cx] = "b";
          n++;
        }
      }
      s.map = rows.map(function (r) {
        return r.join("");
      });
    }
    s.f.forEach(function (f) {
      return spawn(s, f);
    });
    if (s.mode === "gold") {
      var c = freeSpot(s, COLS * T / 2, ROWS * T / 2);
      s.gold = {
        x: c[0],
        y: c[1],
        held: null
      };
    }
  }
  function setDiff(G, i) {
    G.s.di = i;
    G.s.diff = DIFF[i];
    try {
      localStorage.setItem("bdd:boomdiff", String(i));
    } catch (e) {}
  }
  function pick(G, mode) {
    var s = G.s;
    s.mode = mode;
    s.f.forEach(function (f, i) {
      return f.team = mode === "teams" || mode === "seek" ? i === 0 || i === 3 ? 0 : 1 : i;
    });
    G.sfx("pop");
    startRound(G);
  }
  function finish(G) {
    var s = G.s,
      p = s.f[0],
      L = leader(s),
      won = L[2].team === p.team,
      mine = Math.floor(s.tp[p.team]);
    G.over(Math.round((mine * 100 + (won ? 1000 + (mine - L[1]) * 150 : 0)) * s.diff.mult), won ? s.kos >= 8 ? "Boomerang master!" : "Top dawg!" : (s.mode === "teams" || s.mode === "seek" ? "Mittens and Rusty win" : L[2].who.name + " wins") + ". Rematch?");
  }
  function step(G, dt) {
    var s = G.s,
      T = s.T,
      p = s.f[0];
    if (s.phase === "menu") return;
    s.shake = Math.max(0, s.shake - dt);
    s.fx.forEach(function (o) {
      o.t -= dt;
      o.x += o.vx * dt;
      o.y += o.vy * dt;
      o.vx *= 0.92;
      o.vy *= 0.92;
    });
    s.fx = s.fx.filter(function (o) {
      return o.t > 0;
    });
    s.pops.forEach(function (o) {
      o.t -= dt;
      o.y -= T * 0.6 * dt;
    });
    s.pops = s.pops.filter(function (o) {
      return o.t > 0;
    });
    s.booms.forEach(function (o) {
      return o.t -= dt;
    });
    s.booms = s.booms.filter(function (o) {
      return o.t > 0;
    });
    if (s.phase !== "fight") {
      s.pt -= dt;
      if (s.pt > 0) return;
      if (s.phase === "intro") {
        s.phase = "fight";
        return;
      }
      var L = leader(s);
      return L[0] >= GOAL && L[0] > L[1] ? finish(G) : startRound(G);
    }
    s.rt += dt;
    s.patches.forEach(function (q) {
      return q.t -= dt;
    });
    s.patches = s.patches.filter(function (q) {
      return q.t > 0;
    });
    s.itemT -= dt;
    if (s.itemT <= 0 && s.items.length < 2 && s.mode !== "seek") {
      s.itemT = 5 + Math.random() * 3;
      var _loop2 = function _loop2() {
          var cx = Math.floor(Math.random() * COLS),
            cy = Math.floor(Math.random() * ROWS),
            x = (cx + 0.5) * T,
            y = (cy + 0.5) * T;
          if (s.map[cy][cx] !== "." || stormAt(s, x, y) || s.f.some(function (f) {
            return f.alive && hyp(f.x - x, f.y - y) < 2 * T;
          })) return 0;
          var pool = PWK.filter(function (k) {
            return !(k === "royale" && (s.mode === "gold" || s.storm));
          });
          s.items.push({
            x: x,
            y: y,
            k: pool[Math.floor(Math.random() * pool.length)],
            t: 0
          });
          return 1;
        },
        _ret2;
      for (var _k = 0; _k < 30; _k++) {
        _ret2 = _loop2();
        if (_ret2 === 0) continue;
        if (_ret2 === 1) break;
      }
    }
    s.items.forEach(function (o) {
      return o.t += dt;
    });
    var k = s.keys,
      kx = (k.r ? 1 : 0) - (k.l ? 1 : 0),
      ky = (k.d ? 1 : 0) - (k.u ? 1 : 0);
    var mx = s.stick.x,
      my = s.stick.y;
    if (kx || ky) {
      var n = hyp(kx, ky);
      mx = kx / n;
      my = ky / n;
    }
    s.inx = mx;
    s.iny = my;
    s.decoys.forEach(function (d) {
      d.t -= dt;
      if (d.t <= 0) {
        d.alive = false;
        puff(s, d.x, d.y, "#e5e7eb", 8);
      }
    });
    s.decoys = s.decoys.filter(function (d) {
      return d.alive;
    });
    if (s.storm) {
      var st = s.storm;
      st.t -= dt;
      if (st.t <= 0 && st.n < 3) {
        st.n++;
        st.t = 2.5;
        s.shake = 0.2;
      }
      s.f.forEach(function (f) {
        if (f.alive && edge(s, f.x, f.y) < st.n) {
          pop(s, f.x, f.y - T * 0.6, "ZAPPED!", "#c4b5fd");
          f.pw = f.pw.filter(function (k) {
            return k !== "shield";
          });
          f.inv = 0;
          hit(s, f, null);
        }
      });
      s.rangs.forEach(function (r) {
        if (r.st === "ground" && edge(s, r.x, r.y) < st.n) {
          var c = freeSpot(s, r.x, r.y);
          r.x = c[0];
          r.y = c[1];
        }
      });
    }
    if (s.mode === "gold") {
      var g = s.gold;
      s.skill = clamp(s.diff.base + 0.2 + lead(s) * 0.04, 0.05, s.diff.max);
      if (g.held && !g.held.alive) {
        var c = freeSpot(s, g.held.x, g.held.y);
        g.x = c[0];
        g.y = c[1];
        g.held = null;
      }
      if (!g.held) {
        var f = s.f.find(function (f) {
          return f.alive && hyp(f.x - g.x, f.y - g.y) < T * 0.6;
        });
        if (f) {
          g.held = f;
          pop(s, f.x, f.y - T * 0.8, "GOT THE GOLD!", "#fde047");
          if (f === p) G.sfx("pass");
        }
      }
      if (g.held) {
        s.tp[g.held.team] += dt / 2.5;
        if (s.tp[g.held.team] >= GOAL) {
          s.phase = "end";
          s.pt = 1.7;
          s.last = g.held;
          if (g.held.team === p.team) G.sfx("win");
          return;
        }
      }
      s.f.forEach(function (f) {
        if (!f.alive && (f.rs -= dt) <= 0) {
          s.rangs = s.rangs.filter(function (r) {
            return r.o !== f;
          });
          spawn(s, f);
          f.inv = 1.2;
        }
      });
    }
    if (p.alive) stepF(s, p, counting(s, p) ? 0 : mx, counting(s, p) ? 0 : my, dt);
    s.f.forEach(function (f) {
      if (f.cpu && f.alive) {
        var m = think(s, f, dt);
        stepF(s, f, m[0], m[1], dt);
      }
    });
    s.f.forEach(function (f) {
      if (!f.alive) return;
      for (var i = s.items.length - 1; i >= 0; i--) if (hyp(s.items[i].x - f.x, s.items[i].y - f.y) < T * 0.6) give(s, f, s.items.splice(i, 1)[0].k);
    });
    stepRangs(s, dt);
    if (s.mode === "gold") return;
    if (s.mode === "seek") {
      var left = s.f.filter(function (f) {
        return f.hider && f.alive;
      });
      if (!left.length || s.rt > 32.5) {
        s.phase = "end";
        s.pt = 1.9;
        s.left = left.length;
        s.tp[s.hide] += left.length * 2;
        s.last = left[0] || s.f.find(function (f) {
          return !f.hider;
        });
        if (left.length > 0 === (p.team === s.hide)) G.sfx("win");
      }
      return;
    }
    var alive = s.f.filter(function (f) {
        return f.alive;
      }),
      sides = alive.map(function (f) {
        return f.team;
      }).filter(function (t, i, a) {
        return a.indexOf(t) === i;
      });
    if (sides.length <= 1 || s.rt > 60) {
      s.phase = "end";
      s.pt = 1.7;
      s.last = sides.length === 1 ? alive[0] : null;
      if (s.last) {
        s.tp[s.last.team]++;
        if (s.last.team === p.team) G.sfx("win");
      }
    }
  }
  function rang(c, x, y, rot, sz, col) {
    c.save();
    c.translate(x, y);
    c.rotate(rot);
    c.lineCap = "round";
    c.lineJoin = "round";
    var d = function d() {
      c.beginPath();
      c.moveTo(-sz * 0.5, sz * 0.28);
      c.lineTo(0, -sz * 0.28);
      c.lineTo(sz * 0.5, sz * 0.28);
      c.stroke();
    };
    c.strokeStyle = "#2b1d0e";
    c.lineWidth = sz * 0.44;
    d();
    c.strokeStyle = col;
    c.lineWidth = sz * 0.26;
    d();
    c.restore();
  }
  defGame({
    key: "boom",
    name: "Boomerang Dawgs",
    icon: "🪃",
    max: 9999,
    blurb: "Throw, slash, dash. One hit and you're out.",
    how: "A boomerang brawl against Mittens, Rusty and Bao. One hit knocks anyone out. Drag the left side of the screen to move. THROW: hold for a longer throw. It bounces off walls and comes back, and if you're empty-handed, holding THROW calls it home. SLASH cuts whoever is in front of you and bats boomerangs away. DASH is a quick burst that gets you over water (walk in and you're out). Scrolls are power-ups: hold 3, kept all match. Pick how tough the CPUs are and a mode when it starts. Keyboard: arrows or WASD, Space throw, Z slash, X dash.",
    lay: function lay(G) {
      var s = G.s;
      s.T = Math.max(16, Math.floor(Math.min(G.W / COLS, (G.H - HUD - CTRL) / ROWS)));
      s.ox = Math.round((G.W - COLS * s.T) / 2);
      s.oy = HUD + Math.round((G.H - HUD - CTRL - ROWS * s.T) / 2);
      var y = G.H - CTRL / 2;
      var mw = Math.min(G.W - 36, 330),
        mh = Math.min(74, (G.H - 250) / 4 - 10),
        mx = (G.W - mw) / 2;
      s.dbtn = DIFF.map(function (o, i) {
        return {
          i: i,
          t: o.t,
          x: mx + i * (mw + 8) / 3,
          y: 84,
          w: (mw + 8) / 3 - 8,
          h: 46
        };
      });
      s.menu = MODES.map(function (o, i) {
        return {
          m: o.m,
          t: o.t,
          d: o.d,
          x: mx,
          y: 196 + i * (mh + 10),
          w: mw,
          h: mh
        };
      });
      s.btn = [{
        k: "throw",
        x: G.W - 54,
        y: y,
        r: 42,
        em: "🪃"
      }, {
        k: "slash",
        x: G.W - 138,
        y: y - 26,
        r: 27,
        em: "⚔️"
      }, {
        k: "dash",
        x: G.W - 138,
        y: y + 30,
        r: 25,
        em: "💨"
      }];
    },
    reset: function reset(G) {
      G.s = {
        phase: "menu",
        mode: "ffa",
        round: 0,
        kos: 0,
        shake: 0,
        itemT: 2,
        tp: [0, 0, 0, 0],
        keys: {},
        fx: [],
        pops: [],
        booms: [],
        stick: {
          x: 0,
          y: 0,
          on: 0,
          ox: 0,
          oy: 0,
          kx: 0,
          ky: 0
        },
        f: WHO.map(function (w, i) {
          return {
            who: w,
            cpu: i > 0,
            team: i,
            pw: [],
            max: 1,
            ai: {}
          };
        })
      };
      var di = 1;
      try {
        di = clamp(parseInt(localStorage.getItem("bdd:boomdiff") || "1", 10) || 0, 0, 2);
      } catch (e) {}
      setDiff(G, di);
      this.lay(G);
      this.hook();
    },
    hook: function hook() {
      if (window._boomT) return;
      window._boomT = 1;
      var w = $("gwrap");
      if (!w) return;
      var ids = {};
      var f = function f(e) {
        if (G.key !== "boom" || G.state !== "play" || !G.s || !G.s.btn) return;
        var s = G.s,
          r = w.getBoundingClientRect(),
          st = s.stick,
          end = e.type !== "touchstart" && e.type !== "touchmove";
        var _loop3 = function _loop3() {
            var t = e.changedTouches[i],
              x = t.clientX - r.left,
              y = t.clientY - r.top;
            if (e.type === "touchstart") {
              var b = s.btn.find(function (b) {
                  return hyp(x - b.x, y - b.y) < b.r + 10;
                }),
                _kind = b ? b.k : x < G.W * 0.55 ? "stick" : "throw";
              ids[t.identifier] = _kind;
              if (_kind === "stick") {
                st.on = 1;
                st.ox = x;
                st.oy = y;
                st.x = st.y = st.kx = st.ky = 0;
              } else act(s, s.f[0], _kind, true);
              return 0;
            }
            var kind = ids[t.identifier];
            if (!kind) return 0;
            if (kind === "stick") {
              if (end) {
                st.on = 0;
                st.x = st.y = 0;
              } else {
                var dx = x - st.ox,
                  dy = y - st.oy,
                  d = hyp(dx, dy),
                  m = d < 6 ? 0 : Math.min(1, d / 34);
                st.x = d ? dx / d * m : 0;
                st.y = d ? dy / d * m : 0;
                st.kx = d ? dx / d * Math.min(d, 34) : 0;
                st.ky = d ? dy / d * Math.min(d, 34) : 0;
              }
            } else if (end) act(s, s.f[0], kind, false);
            if (end) delete ids[t.identifier];
          },
          _ret3;
        for (var i = 0; i < e.changedTouches.length; i++) {
          _ret3 = _loop3();
          if (_ret3 === 0) continue;
        }
      };
      ["touchstart", "touchmove", "touchend", "touchcancel"].forEach(function (n) {
        return w.addEventListener(n, f, {
          passive: true
        });
      });
    },
    tap: function tap(G, x, y) {
      var s = G.s;
      if (s.phase !== "menu") return;
      var b = s.menu.concat(s.dbtn).find(function (b) {
        return x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h;
      });
      if (!b) return;
      if (b.m) pick(G, b.m);else {
        setDiff(G, b.i);
        G.sfx("pop");
      }
    },
    onKey: function onKey(G, k, isDown) {
      if (G.s.phase === "menu") {
        if (!isDown) return;
        if (k >= "1" && k <= "4") pick(G, MODES[+k - 1].m);else if (k === "ArrowLeft" || k === "ArrowRight") setDiff(G, clamp(G.s.di + (k === "ArrowLeft" ? -1 : 1), 0, 2));
        return;
      }
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
        return;
      }
      var a = {
        " ": "throw",
        z: "slash",
        j: "slash",
        x: "dash",
        k: "dash",
        Shift: "dash"
      }[k];
      if (!a) return;
      if (isDown && s.keys[a]) return;
      s.keys[a] = isDown;
      act(s, s.f[0], a, isDown);
    },
    update: function update(G, dt) {
      var s = G.s,
        n = s.f[0].alive || s.phase !== "fight" || s.mode === "gold" ? 1 : 3;
      for (var i = 0; i < n && G.state === "play"; i++) step(G, dt);
    },
    draw: function draw(G, c) {
      var s = G.s,
        T = s.T,
        W = G.W,
        H = G.H,
        p = s.f[0];
      c.fillStyle = "#1c2a1e";
      c.fillRect(0, 0, W, H);
      if (s.phase === "menu") {
        G.text(c, "HOW TOUGH?", W / 2, 58, 12, "#ffd23f");
        s.dbtn.forEach(function (b) {
          var on = b.i === s.di;
          c.fillStyle = on ? "#ffd23f" : "rgba(255,255,255,0.1)";
          c.fillRect(b.x, b.y, b.w, b.h);
          G.text(c, b.t, b.x + b.w / 2, b.y + b.h / 2, 10, on ? "#111" : "#fff");
        });
        G.text(c, "SCORE x" + s.diff.mult, W / 2, 144, 8, "rgba(255,255,255,0.6)");
        G.text(c, "PICK A MODE TO START", W / 2, 176, 12, "#ffd23f");
        s.menu.forEach(function (b, i) {
          c.fillStyle = "rgba(255,255,255,0.1)";
          c.fillRect(b.x, b.y, b.w, b.h);
          c.fillStyle = WHO[i].col;
          c.fillRect(b.x, b.y, 5, b.h);
          G.text(c, b.t, b.x + 18, b.y + b.h * 0.36, 11, "#fff", "left");
          c.font = "13px system-ui, sans-serif";
          c.textAlign = "left";
          c.textBaseline = "middle";
          c.fillStyle = "rgba(255,255,255,0.7)";
          c.fillText(b.d, b.x + 18, b.y + b.h * 0.7);
        });
        return;
      }
      var bush = function bush(px, py) {
        c.fillStyle = "#2f8f46";
        c.beginPath();
        c.arc(px - T * 0.2, py + T * 0.1, T * 0.36, 0, 7);
        c.arc(px + T * 0.2, py + T * 0.1, T * 0.36, 0, 7);
        c.arc(px, py - T * 0.15, T * 0.4, 0, 7);
        c.fill();
        c.fillStyle = "#46b05f";
        c.beginPath();
        c.arc(px - T * 0.05, py - T * 0.2, T * 0.2, 0, 7);
        c.fill();
      };
      c.save();
      c.translate(s.ox + (s.shake > 0 ? (Math.random() - 0.5) * 8 * s.shake * 4 : 0), s.oy + (s.shake > 0 ? (Math.random() - 0.5) * 8 * s.shake * 4 : 0));
      for (var y = 0; y < ROWS; y++) for (var x = 0; x < COLS; x++) {
        var ch = s.map[y][x],
          px = x * T,
          py = y * T;
        if (ch === "~") {
          c.fillStyle = "#38bdf8";
          c.fillRect(px, py, T, T);
          c.fillStyle = "rgba(255,255,255,0.35)";
          var o = Math.sin(G.t * 2 + x * 1.3 + y) * T * 0.15;
          c.fillRect(px + T * 0.2 + o, py + T * 0.3, T * 0.35, 2);
          c.fillRect(px + T * 0.45 - o, py + T * 0.65, T * 0.3, 2);
        } else {
          c.fillStyle = (x + y) % 2 ? "#e6d3a3" : "#dcc68f";
          c.fillRect(px, py, T, T);
        }
      }
      if (s.storm) for (var _y = 0; _y < ROWS; _y++) for (var _x = 0; _x < COLS; _x++) {
        var e = Math.min(_x, _y, COLS - 1 - _x, ROWS - 1 - _y);
        if (e < s.storm.n) {
          c.fillStyle = Math.random() < 0.04 ? "rgba(233,213,255,0.9)" : "rgba(46,16,101,0.78)";
          c.fillRect(_x * T, _y * T, T, T);
        } else if (e === s.storm.n && s.storm.n < 3 && Math.floor(G.t * 5) % 2) {
          c.fillStyle = "rgba(239,68,68,0.35)";
          c.fillRect(_x * T, _y * T, T, T);
        }
      }
      if (s.mode === "gold" && !s.gold.held) {
        var g = s.gold;
        c.fillStyle = "rgba(253,224,71," + (0.3 + 0.2 * Math.sin(G.t * 6)) + ")";
        c.beginPath();
        c.arc(g.x, g.y, T * 0.55, 0, 7);
        c.fill();
        rang(c, g.x, g.y, G.t * 3, T * 0.7, "#facc15");
      }
      s.decoys.forEach(function (d) {
        c.fillStyle = d.who.col;
        c.beginPath();
        c.arc(d.x, d.y, T * 0.36, 0, 7);
        c.fill();
        if (d.who.face) G.img(c, d.who.face, d.x, d.y, T * 0.76);else {
          c.fillStyle = "#000";
          G.emoji(c, d.who.em, d.x, d.y + 1, T * 0.61);
        }
      });
      s.patches.forEach(function (q) {
        c.globalAlpha = Math.min(1, q.t) * 0.75;
        c.fillStyle = q.k === "fire" ? Math.random() < 0.5 ? "#fb923c" : "#ef4444" : "#bae6fd";
        c.beginPath();
        c.arc(q.x, q.y, T * 0.3, 0, 7);
        c.fill();
      });
      c.globalAlpha = 1;
      for (var _y2 = 0; _y2 < ROWS; _y2++) for (var _x2 = 0; _x2 < COLS; _x2++) if (s.map[_y2][_x2] === "#") {
        var _px = _x2 * T,
          _py = _y2 * T;
        c.fillStyle = "#5b4630";
        c.fillRect(_px, _py, T, T);
        c.fillStyle = "#8a6b47";
        c.fillRect(_px + 2, _py + 2, T - 4, T - 7);
        c.fillStyle = "rgba(255,255,255,0.18)";
        c.fillRect(_px + 4, _py + 4, T - 8, 3);
      }
      s.items.forEach(function (o) {
        var b = Math.sin(o.t * 4) * 2;
        c.fillStyle = "rgba(253,224,71,0.35)";
        c.beginPath();
        c.arc(o.x, o.y, T * 0.42, 0, 7);
        c.fill();
        c.fillStyle = "#000";
        G.emoji(c, "📜", o.x, o.y + b, T * 0.6);
      });
      s.rangs.forEach(function (r) {
        if (r.st === "ground") rang(c, r.x, r.y, r.rot, T * 0.5, r.o.who.col);
      });
      s.f.slice().sort(function (a, b) {
        return a.y - b.y;
      }).forEach(function (f) {
        if (!f.alive) return;
        if (f.fake) return bush(f.x, f.y);
        var a = Math.atan2(f.fy, f.fx),
          R = T * 0.36;
        if (s.mode === "gold" && s.gold.held === f) {
          c.strokeStyle = "#facc15";
          c.lineWidth = 4;
          c.beginPath();
          c.arc(f.x, f.y, R * 1.6 + Math.sin(G.t * 8) * 2, 0, 7);
          c.stroke();
          rang(c, f.x, f.y - R * 2, G.t * 3, T * 0.45, "#facc15");
        }
        if (f.conf > 0) {
          c.fillStyle = "#000";
          G.emoji(c, "😵", f.x + R, f.y - R * 1.3, R * 1.1);
        }
        if (f.dashT > 0) {
          c.strokeStyle = "rgba(255,255,255,0.6)";
          c.lineWidth = R;
          c.lineCap = "round";
          c.beginPath();
          c.moveTo(f.x, f.y);
          c.lineTo(f.x - f.fx * T * 0.9, f.y - f.fy * T * 0.9);
          c.stroke();
        }
        c.fillStyle = "rgba(0,0,0,0.25)";
        c.beginPath();
        c.ellipse(f.x, f.y + R * 0.8, R, R * 0.4, 0, 0, 7);
        c.fill();
        if (f === p && f.charge >= 0) {
          var len = (4.5 + 7 * clamp(f.charge, 0, 0.8) / 0.8) * T * 0.5;
          c.strokeStyle = "rgba(255,255,255,0.75)";
          c.lineWidth = 3;
          c.setLineDash([6, 6]);
          c.beginPath();
          c.moveTo(f.x, f.y);
          c.lineTo(f.x + f.fx * len, f.y + f.fy * len);
          c.stroke();
          c.setLineDash([]);
        }
        c.fillStyle = f.who.col;
        c.beginPath();
        c.arc(f.x, f.y, R, 0, 7);
        c.fill();
        c.fillStyle = f.who.col;
        c.beginPath();
        c.moveTo(f.x + f.fx * R * 1.5, f.y + f.fy * R * 1.5);
        c.lineTo(f.x + Math.cos(a + 0.6) * R, f.y + Math.sin(a + 0.6) * R);
        c.lineTo(f.x + Math.cos(a - 0.6) * R, f.y + Math.sin(a - 0.6) * R);
        c.fill();
        if (f.who.face) G.img(c, f.who.face, f.x, f.y, R * 2.1);else {
          c.fillStyle = "#000";
          G.emoji(c, f.who.em, f.x, f.y + 1, R * 1.7);
        }
        if (f.has > 0) {
          var w = f.charge >= 0 ? -1.2 - Math.min(f.charge, 0.8) : 0.7;
          rang(c, f.x + Math.cos(a + w) * R * 1.25, f.y + Math.sin(a + w) * R * 1.25, a + 1.57, T * 0.42, "#fef3c7");
        }
        if (f.slashT > 0) {
          var k = 1 - f.slashT / 0.16;
          c.strokeStyle = "rgba(255,255,255,0.9)";
          c.lineWidth = 5;
          c.lineCap = "round";
          c.beginPath();
          c.arc(f.x, f.y, T * 0.95, a - 1.1 + k * 1.2, a - 0.3 + k * 1.4);
          c.stroke();
        }
        if (hasP(f, "shield") || f.inv > 0) {
          c.strokeStyle = "rgba(125,211,252,0.9)";
          c.lineWidth = 3;
          c.beginPath();
          c.arc(f.x, f.y, R * 1.35, 0, 7);
          c.stroke();
        }
        if (f.frozen > 0) {
          c.fillStyle = "rgba(186,230,253,0.7)";
          c.fillRect(f.x - R * 1.2, f.y - R * 1.2, R * 2.4, R * 2.4);
        }
        if (f.burn) {
          c.fillStyle = "#000";
          G.emoji(c, "🔥", f.x, f.y - R * 1.4, R * 1.2);
        }
      });
      s.rangs.forEach(function (r) {
        if (r.st !== "ground") {
          if (r.boom) {
            c.fillStyle = "#ef4444";
            c.beginPath();
            c.arc(r.x, r.y, T * 0.16, 0, 7);
            c.fill();
          }
          rang(c, r.x, r.y, r.rot, T * 0.55, r.o.who.col);
        }
      });
      for (var _y3 = 0; _y3 < ROWS; _y3++) for (var _x3 = 0; _x3 < COLS; _x3++) if (s.map[_y3][_x3] === "b") {
        bush((_x3 + 0.5) * T, (_y3 + 0.5) * T);
      }
      if (p.alive && p.hid) {
        c.strokeStyle = p.who.col;
        c.lineWidth = 2;
        c.setLineDash([4, 4]);
        c.beginPath();
        c.arc(p.x, p.y, T * 0.4, 0, 7);
        c.stroke();
        c.setLineDash([]);
      }
      s.booms.forEach(function (o) {
        var k = 1 - o.t / 0.4;
        c.globalAlpha = 1 - k;
        c.fillStyle = "#fb923c";
        c.beginPath();
        c.arc(o.x, o.y, T * 1.5 * (0.4 + k * 0.6), 0, 7);
        c.fill();
        c.fillStyle = "#fde047";
        c.beginPath();
        c.arc(o.x, o.y, T * 0.9 * (0.4 + k * 0.6), 0, 7);
        c.fill();
      });
      c.globalAlpha = 1;
      s.fx.forEach(function (o) {
        c.globalAlpha = Math.min(1, o.t * 2);
        c.fillStyle = o.col;
        c.fillRect(o.x - 3, o.y - 3, 6, 6);
      });
      c.globalAlpha = 1;
      s.pops.forEach(function (o) {
        c.globalAlpha = Math.min(1, o.t * 2);
        G.text(c, o.txt, clamp(o.x, 50, COLS * T - 50) + 1, o.y + 1, 9, "#000");
        G.text(c, o.txt, clamp(o.x, 50, COLS * T - 50), o.y, 9, o.col);
      });
      c.globalAlpha = 1;
      c.restore();
      G.hud(c, "", "", "", {
        h: HUD
      });
      var duo = s.mode === "teams" || s.mode === "seek";
      (duo ? [s.f[0], s.f[3], s.f[1], s.f[2]] : s.f).forEach(function (f, i) {
        var x = W * (i + 0.5) / 4 + (duo ? i < 2 ? -6 : 6 : 0);
        c.globalAlpha = f.alive ? 1 : 0.4;
        c.fillStyle = f.who.col;
        c.beginPath();
        c.arc(x - 22, HUD / 2, 12, 0, 7);
        c.fill();
        if (f.who.face) G.img(c, f.who.face, x - 22, HUD / 2, 22);else {
          c.fillStyle = "#000";
          G.emoji(c, f.who.em, x - 22, HUD / 2 + 1, 17);
        }
        G.text(c, String(Math.floor(s.tp[f.team])), x, HUD / 2 - 5, 12, "#fff", "left");
        c.fillStyle = "#000";
        f.pw.forEach(function (k, j) {
          return G.emoji(c, PW[k][0], x + 5 + j * 12, HUD / 2 + 11, 10);
        });
        c.globalAlpha = 1;
      });
      var st = s.stick,
        jx = st.on ? st.ox : 74,
        jy = st.on ? st.oy : H - CTRL / 2;
      if (TOUCH) {
        c.strokeStyle = "rgba(255,255,255,0.35)";
        c.lineWidth = 3;
        c.beginPath();
        c.arc(jx, jy, 40, 0, 7);
        c.stroke();
        c.fillStyle = "rgba(255,255,255,0.45)";
        c.beginPath();
        c.arc(jx + st.kx, jy + st.ky, 20, 0, 7);
        c.fill();
        s.btn.forEach(function (b) {
          var off = b.k === "dash" ? p.dashCd > 0 : b.k === "slash" ? p.has <= 0 || p.slashCd > 0 : false;
          c.globalAlpha = off ? 0.35 : 1;
          c.fillStyle = b.k === "throw" ? "rgba(255,210,63,0.9)" : "rgba(255,255,255,0.22)";
          c.beginPath();
          c.arc(b.x, b.y, b.r, 0, 7);
          c.fill();
          c.fillStyle = "#000";
          G.emoji(c, b.k === "throw" && p.hider ? "🌳" : b.k === "throw" && p.has <= 0 ? "↩️" : b.em, b.x, b.y + 1, b.r * 0.9);
          c.globalAlpha = 1;
        });
      } else {
        G.text(c, "ARROWS MOVE   SPACE THROW", W / 2, H - CTRL / 2 - 12, 9, "rgba(255,255,255,0.7)");
        G.text(c, "Z SLASH   X DASH", W / 2, H - CTRL / 2 + 12, 9, "rgba(255,255,255,0.7)");
      }
      var my = s.oy + ROWS * T * 0.42;
      var seek = s.mode === "seek",
        mine = s.last && s.last.team === p.team;
      if (duo) G.text(c, "VS", W / 2, HUD / 2, 9, "rgba(255,255,255,0.6)");
      if (s.phase === "intro") {
        G.banner(c, seek ? p.hider ? "YOU HIDE!" : "YOU SEEK!" : s.mode === "gold" ? "GRAB THE GOLD" : "ROUND " + s.round, "#ffd23f", my);
        G.text(c, seek ? p.hider ? "STAND STILL TO BE A BUSH" : "FIND THEM IN 30 SECONDS" : s.mode === "gold" ? "HOLD IT TO FILL UP TO " + GOAL : "FIRST TO " + GOAL, W / 2, my + 34, 10, "#fff");
      } else if (s.phase === "end") {
        G.banner(c, !s.last ? "DRAW!" : seek ? s.left ? s.left + " STILL HIDDEN!" : "ALL FOUND!" : s.mode === "gold" ? mine ? "GOLD IS YOURS!" : s.last.who.name + " WINS!" : mine ? duo ? "YOUR TEAM!" : "YOU WIN IT!" : s.last.who.name + "!", s.last ? s.last.who.col : "#fff", my);
        if (s.last && s.mode !== "gold") G.text(c, seek ? s.left ? "HIDERS +" + s.left * 2 : "SEEKERS GOT THEM" : "LAST ONE STANDING +1", W / 2, my + 34, 10, "#fff");
      } else {
        if (seek) G.text(c, (p.hider ? "HIDE  0:" : "SEEK  0:") + String(clamp(Math.ceil(32.5 - s.rt), 0, 30)).padStart(2, "0"), W / 2, s.oy - 12 > HUD + 8 ? s.oy - 12 : s.oy + 12, 11, s.rt > 26.5 ? "#f87171" : "#fff");
        if (counting(s, p)) {
          c.fillStyle = "rgba(10,14,12,0.96)";
          c.fillRect(s.ox, s.oy, COLS * T, ROWS * T);
          G.banner(c, "NO PEEKING  " + Math.ceil(2.5 - s.rt), "#ffd23f", my);
        }
        if (!p.alive) G.text(c, s.mode === "gold" ? "BACK IN " + Math.max(1, Math.ceil(p.rs)) : "YOU'RE OUT  >>", W / 2, s.oy + (seek ? 30 : 14), 10, "#fff");
      }
    }
  });
})();