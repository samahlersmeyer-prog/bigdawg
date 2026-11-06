function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
(function () {
  var WIN = 7,
    OFFY = 40;
  var bg = null;
  function lay(G) {
    var W = G.W,
      H = G.H,
      l = 8,
      r = W - 8,
      t = 44,
      b = H - 10;
    var tw = r - l,
      th = b - t,
      m = Math.min(tw, th * 0.62);
    var gw = tw * 0.4,
      mr = Math.max(22, m * 0.075);
    return {
      W: W,
      H: H,
      l: l,
      r: r,
      t: t,
      b: b,
      tw: tw,
      th: th,
      mid: (t + b) / 2,
      gl: W / 2 - gw / 2,
      gr: W / 2 + gw / 2,
      gw: gw,
      pr: Math.max(11, m * 0.04),
      mr: mr,
      pmr: mr * 1.2,
      vmax: Math.max(650, Math.min(1050, th * 1.65))
    };
  }
  function faceoff(G, side, pause) {
    var s = G.s,
      L = s.L,
      p = s.puck;
    p.x = L.W / 2 + (Math.random() - 0.5) * L.tw * 0.25;
    p.y = side === 0 ? L.mid : L.mid + side * L.th * 0.17;
    p.vx = 0;
    p.vy = 0;
    s.pause = pause == null ? 0.9 : pause;
    s.last = null;
    s.shotLive = false;
    s.ax = p.x;
    s.ay = p.y;
    s.stuckT = 0;
    s.spawnT = 0.5;
    s.catWait = s.pause + (side === -1 ? 1.3 - 0.8 * diff(G) : 0.3);
  }
  function diff(G) {
    var s = G.s,
      lead = s.pg - s.cg;
    var d = Math.min(1, (s.pg + s.cg) / 7) * 0.85 + Math.min(1, s.time / 150) * 0.15;
    if (lead >= 3) d += 0.15 + 0.05 * (lead - 3);else if (lead <= -3) d -= 0.15 + 0.05 * (-lead - 3);
    return Math.max(0, Math.min(1, d));
  }
  var mix = function mix(a, b, d) {
    return a + (b - a) * d;
  };
  function clampMallet(L, m, top, r) {
    var lo = top ? L.t + r : L.mid + r * 0.6,
      hi = top ? L.mid - r * 0.6 : L.b - r;
    if (m.x < L.l + r) m.x = L.l + r;
    if (m.x > L.r - r) m.x = L.r - r;
    if (m.y < lo) m.y = lo;
    if (m.y > hi) m.y = hi;
  }
  function crossX(L, p, y) {
    if (Math.abs(p.vy) < 1) return p.x;
    var tt = (y - p.y) / p.vy;
    if (tt < 0) return null;
    var a = L.l + L.pr,
      w = L.r - L.pr - a;
    var u = (p.x + p.vx * tt - a) % (2 * w);
    if (u < 0) u += 2 * w;
    return a + (u > w ? 2 * w - u : u);
  }
  function catTarget(G, dt, d) {
    var s = G.s,
      L = s.L,
      c = s.cat,
      P = s.puck;
    var react = mix(0.38, 0.2, d);
    s.seenT -= dt;
    s.catWait -= dt;
    s.recov -= dt;
    if (s.seenT <= 0) {
      s.seen.x = P.x;
      s.seen.y = P.y;
      s.seen.vx = P.vx;
      s.seen.vy = P.vy;
      s.seenT = react * (0.8 + Math.random() * 0.4);
      s.cerr = (Math.random() * 2 - 1) * L.gw * mix(0.45, 0.2, d);
      if (P.y > L.mid && Math.random() < mix(0.22, 0.05, d) * react * 3) s.creepT = mix(1.4, 0.5, d);
      if (P.y > L.mid - L.pr) s.aimX = Math.random() < mix(0.25, 0.85, d) ? L.W / 2 + (s.me.x > L.W / 2 ? -1 : 1) * L.gw * 0.2 : L.W / 2 + (Math.random() - 0.5) * L.gw * 0.7;
    }
    s.creepT -= dt;
    var p = s.seen,
      hold = L.t + L.mr + L.th * 0.04,
      reach = L.mr + L.pr;
    var fastIn = p.vy < -L.th * mix(0.45, 0.75, d) && p.y > L.t + L.th * 0.15;
    if (s.catWait <= 0 && s.recov <= 0 && P.y < L.mid - L.pr && p.y < L.mid - L.pr && !fastIn) {
      if (p.y < c.y + L.pr * 0.3) {
        var side = c.x >= p.x ? 1 : -1;
        if (p.x + side * (reach + 8) > L.r - L.mr || p.x + side * (reach + 8) < L.l + L.mr) side = -side;
        return {
          x: p.x + side * (reach + 10),
          y: Math.max(L.t + L.mr, p.y - reach * 0.9),
          sp: mix(0.6, 1, d)
        };
      }
      var gx = s.aimX + s.cerr * mix(0.8, 0.2, d),
        gy = L.b + 20;
      var dx = gx - p.x,
        dy = gy - p.y;
      var dl = Math.hypot(dx, dy) || 1;
      dx /= dl;
      dy /= dl;
      var ax = p.x - c.x,
        ay = p.y - c.y;
      var al = Math.hypot(ax, ay) || 1;
      ax /= al;
      ay /= al;
      if (ax * dx + ay * dy > 0.82 - 0.24 * d || al < reach * 1.15) return {
        x: p.x + dx * reach * 1.3,
        y: p.y + dy * reach * 1.3,
        sp: mix(0.7, 1, d),
        strike: true
      };
      return {
        x: p.x - dx * (reach + 6),
        y: p.y - dy * (reach + 6),
        sp: mix(0.6, 1, d)
      };
    }
    if (s.creepT > 0) return {
      x: L.W / 2 + (P.x - L.W / 2) * 0.6,
      y: L.mid - L.mr * 1.2,
      sp: 0.6
    };
    var x = L.W / 2 + (p.x - L.W / 2) * 0.5;
    if (p.vy < -20) {
      var cx = crossX(L, p, hold);
      if (cx != null) x = cx;
    }
    x += s.cerr;
    x = Math.max(L.gl - L.mr * 0.2, Math.min(L.gr + L.mr * 0.2, x));
    return {
      x: x,
      y: hold,
      sp: P.y > L.mid ? 0.5 : s.recov > 0 ? 0.55 : 0.8
    };
  }
  function steer(m, tx, ty, sp, dt) {
    var dx = tx - m.x,
      dy = ty - m.y,
      d = Math.hypot(dx, dy);
    if (d < 0.5) {
      m.vx = 0;
      m.vy = 0;
      return;
    }
    var v = Math.min(sp, d / dt);
    m.vx = dx / d * v;
    m.vy = dy / d * v;
  }
  function hitMallet(G, m, top, mr) {
    var s = G.s,
      L = s.L,
      p = s.puck,
      R = mr + L.pr;
    var dx = p.x - m.x,
      dy = p.y - m.y,
      d2 = dx * dx + dy * dy;
    if (d2 >= R * R) return;
    var d = Math.sqrt(d2) || 0.001,
      nx = d2 ? dx / d : 0,
      ny = d2 ? dy / d : top ? 1 : -1;
    p.x = m.x + nx * R;
    p.y = m.y + ny * R;
    var rvx = p.vx - m.vx,
      rvy = p.vy - m.vy,
      vn = rvx * nx + rvy * ny;
    if (vn < 0) {
      if (top && s.last === "me" && s.shotLive) {
        s.shots++;
        s.score = finalScore(s);
        s.shotLive = false;
        s.pops.push({
          x: p.x,
          y: p.y + 30,
          t: 0.8,
          txt: "SHOT +10",
          c: "#7df9ff"
        });
      }
      p.vx -= 1.9 * vn * nx;
      p.vy -= 1.9 * vn * ny;
      if (!top) {
        p.vx *= 1.18;
        p.vy *= 1.18;
      } else if (s.last !== "cat" || s.hitCd <= 0) s.recov = mix(0.7, 0.2, s.dif);
      s.last = top ? "cat" : "me";
      s.shotLive = false;
      if (-vn > 120 && s.hitCd <= 0) {
        G.sfx("pop");
        s.hitCd = 0.09;
        if (!top) {
          s.face = ":dawgpog:";
          s.faceT = 0.4;
        }
      }
      s.flash = Math.min(1, -vn / 900);
    }
  }
  function walls(G) {
    var s = G.s,
      L = s.L,
      p = s.puck,
      r = L.pr,
      e = 0.92;
    if (p.x < L.l + r) {
      p.x = L.l + r;
      p.vx = Math.abs(p.vx) * e;
    }
    if (p.x > L.r - r) {
      p.x = L.r - r;
      p.vx = -Math.abs(p.vx) * e;
    }
    var inSlot = p.x > L.gl && p.x < L.gr;
    if (!inSlot) {
      if (p.y < L.t + r) {
        p.y = L.t + r;
        p.vy = Math.abs(p.vy) * 0.75;
      }
      if (p.y > L.b - r) {
        p.y = L.b - r;
        p.vy = -Math.abs(p.vy) * 0.75;
      }
    }
    for (var _i = 0, _arr = [L.t, L.b]; _i < _arr.length; _i++) {
      var py = _arr[_i];
      for (var _i2 = 0, _arr2 = [L.gl, L.gr]; _i2 < _arr2.length; _i2++) {
        var px = _arr2[_i2];
        var dx = p.x - px,
          dy = p.y - py,
          d = Math.hypot(dx, dy);
        if (d < r && d > 0.001) {
          var nx = dx / d,
            ny = dy / d;
          p.x = px + nx * r;
          p.y = py + ny * r;
          var vn = p.vx * nx + p.vy * ny;
          if (vn < 0) {
            p.vx -= 1.9 * vn * nx;
            p.vy -= 1.9 * vn * ny;
          }
        }
      }
    }
    if (p.y < L.t || p.y > L.b) {
      if (p.x < L.gl + r) {
        p.x = L.gl + r;
        p.vx = Math.abs(p.vx);
      }
      if (p.x > L.gr - r) {
        p.x = L.gr - r;
        p.vx = -Math.abs(p.vx);
      }
    }
  }
  function finalScore(s) {
    return Math.min(9999, s.pg * 100 + (s.pg >= WIN ? 500 : 0) + Math.min(300, s.shots * 10));
  }
  function goal(G, mine) {
    var s = G.s,
      L = s.L;
    if (mine) {
      s.pg++;
      s.shots++;
      s.banner = {
        txt: "GOAL!",
        c: "#ffd23f",
        t: 1.2
      };
      s.face = ":dawgpog:";
      s.faceT = 1.3;
      G.sfx("win");
    } else {
      s.cg++;
      s.banner = {
        txt: "CAT SCORES",
        c: "#ff5fa2",
        t: 1.2
      };
      s.face = ":dawgsweat:";
      s.faceT = 1.3;
      G.sfx("lose");
      G.buzz();
    }
    s.gflash = 1;
    s.gmine = mine;
    s.score = finalScore(s);
    if (s.pg >= WIN || s.cg >= WIN) {
      var won = s.pg >= WIN;
      s.end = 1.6;
      s.puck.vx = s.puck.vy = 0;
      s.puck.y = -999;
      s.face = won ? ":dawgW:" : ":dawgpain:";
      s.faceT = 99;
      s.banner = won ? {
        txt: "DAWGS WIN ".concat(s.pg, "-").concat(s.cg),
        c: "#7dffb0",
        t: 9
      } : {
        txt: "CAT WINS ".concat(s.cg, "-").concat(s.pg),
        c: "#ff5fa2",
        t: 9
      };
      return;
    }
    faceoff(G, mine ? -1 : 1, 1.1);
  }
  defGame({
    key: "airhockey",
    name: "Paw Hockey",
    icon: "🏒",
    max: 9999,
    cat: "sports",
    blurb: "Air hockey vs the cat. First to 7.",
    how: "Drag anywhere in the bottom half and your bulldog mallet follows just above your thumb. Swing through the puck fast to hit it hard, and bank it off the walls into the cat's goal at the top. First to 7 wins. Each goal is 100, a win is +500, and every shot on goal adds a little bonus. The cat starts sleepy but wakes up as the game goes on.",
    reset: function reset(G) {
      var L = lay(G);
      G.s = {
        L: L,
        score: 0,
        pg: 0,
        cg: 0,
        shots: 0,
        time: 0,
        dif: 0,
        me: {
          x: L.W / 2,
          y: L.b - L.th * 0.13,
          vx: 0,
          vy: 0
        },
        cat: {
          x: L.W / 2,
          y: L.t + L.th * 0.12,
          vx: 0,
          vy: 0
        },
        puck: {
          x: 0,
          y: 0,
          vx: 0,
          vy: 0
        },
        tx: L.W / 2,
        ty: L.b - L.th * 0.13,
        keys: {},
        pause: 0,
        hitCd: 0,
        flash: 0,
        banner: null,
        face: ":dawgW:",
        faceT: 0,
        end: 0,
        touched: false,
        last: null,
        shotLive: false,
        seen: {
          x: L.W / 2,
          y: L.mid,
          vx: 0,
          vy: 0
        },
        seenT: 0,
        cerr: 0,
        aimX: L.W / 2,
        creepT: 0,
        recov: 0,
        catWait: 0,
        ax: 0,
        ay: 0,
        stuckT: 0,
        spawnT: 0,
        gflash: 0,
        gmine: true,
        pops: []
      };
      faceoff(G, 1, 0.6);
    },
    update: function update(G, dt) {
      var s = G.s,
        L = s.L,
        p = s.puck,
        me = s.me,
        cat = s.cat;
      if (s.banner) {
        s.banner.t -= dt;
        if (s.banner.t <= 0) s.banner = null;
      }
      if (s.faceT > 0) {
        s.faceT -= dt;
        if (s.faceT <= 0) s.face = ":dawgW:";
      }
      s.hitCd -= dt;
      s.flash = Math.max(0, s.flash - dt * 3);
      s.gflash = Math.max(0, s.gflash - dt * 1.6);
      s.spawnT = Math.max(0, s.spawnT - dt);
      var _iterator = _createForOfIteratorHelper(s.pops),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var q = _step.value;
          q.t -= dt;
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
      if (s.pops.length && s.pops[0].t <= 0) s.pops.shift();
      if (s.end > 0) {
        s.end -= dt;
        if (s.end <= 0) G.over(s.score, s.pg >= WIN ? "Dawgs win ".concat(s.pg, "-").concat(s.cg, "!") : "Cat wins ".concat(s.cg, "-").concat(s.pg, ". Ruff."));
        return;
      }
      s.time += dt;
      var k = s.keys,
        ks = L.th * 1.3 * dt;
      if (k.ArrowLeft || k.a) s.tx -= ks;
      if (k.ArrowRight || k.d) s.tx += ks;
      if (k.ArrowUp || k.w) s.ty -= ks;
      if (k.ArrowDown || k.s) s.ty += ks;
      s.tx = Math.max(L.l, Math.min(L.r, s.tx));
      s.ty = Math.max(L.mid, Math.min(L.b, s.ty));
      steer(me, s.tx, s.ty, 3600, dt);
      var d = s.dif = diff(G),
        ct = catTarget(G, dt, d);
      steer(cat, ct.x, ct.y, L.th * mix(0.7, 1.45, d) * ct.sp, dt);
      if (s.pause > 0) s.pause -= dt;
      var sp = Math.hypot(p.vx, p.vy),
        mv = Math.max(sp, Math.hypot(me.vx, me.vy), Math.hypot(cat.vx, cat.vy));
      var n = Math.max(1, Math.min(14, Math.ceil(mv * dt / (L.pr * 0.6)))),
        h = dt / n;
      for (var i = 0; i < n; i++) {
        me.x += me.vx * h;
        me.y += me.vy * h;
        clampMallet(L, me, false, L.pmr);
        cat.x += cat.vx * h;
        cat.y += cat.vy * h;
        clampMallet(L, cat, true, L.mr);
        if (s.pause > 0) continue;
        p.x += p.vx * h;
        p.y += p.vy * h;
        hitMallet(G, me, false, L.pmr);
        hitMallet(G, cat, true, L.mr);
        var v = Math.hypot(p.vx, p.vy);
        if (v > L.vmax) {
          p.vx *= L.vmax / v;
          p.vy *= L.vmax / v;
        }
        walls(G);
        for (var _i3 = 0, _arr3 = [me, cat]; _i3 < _arr3.length; _i3++) {
          var m = _arr3[_i3];
          var R = (m === me ? L.pmr : L.mr) + L.pr,
            dx = p.x - m.x,
            dy = p.y - m.y,
            dd = Math.hypot(dx, dy);
          if (dd < R) {
            var nx = dd ? dx / dd : 0,
              ny = dd ? dy / dd : 1;
            m.x = p.x - nx * R;
            m.y = p.y - ny * R;
          }
        }
        if (p.y < L.t - L.pr * 1.2) {
          goal(G, true);
          return;
        }
        if (p.y > L.b + L.pr * 1.2) {
          goal(G, false);
          return;
        }
      }
      if (s.last === "me" && p.vy < -150 && p.y < L.mid) {
        var cx = crossX(L, p, L.t);
        s.shotLive = cx != null && cx > L.gl + L.pr * 0.5 && cx < L.gr - L.pr * 0.5;
      } else if (p.vy >= 0) s.shotLive = false;
      var f = Math.exp(-0.28 * dt);
      p.vx *= f;
      p.vy *= f;
      if (!(p.x === p.x && p.y === p.y) || p.x < L.l - 4 || p.x > L.r + 4 || p.y < L.t - 60 || p.y > L.b + 60) faceoff(G, 0);
      if (s.pause <= 0) {
        if (Math.hypot(p.x - s.ax, p.y - s.ay) > L.mr * 1.5) {
          s.ax = p.x;
          s.ay = p.y;
          s.stuckT = 0;
        } else s.stuckT += dt;
        if (s.stuckT > 4) {
          var side = s.last === "me" ? -1 : s.last === "cat" ? 1 : p.y < L.mid ? 1 : -1;
          faceoff(G, side, 0.7);
          s.pops.push({
            x: L.W / 2,
            y: L.mid + side * L.th * 0.17 - 34,
            t: 1,
            txt: "RESET",
            c: "#fff"
          });
        }
      }
    },
    down: function down(G, x, y) {
      var s = G.s;
      s.tx = x;
      s.ty = y - OFFY;
      s.touched = true;
    },
    move: function move(G, x, y) {
      var s = G.s;
      s.tx = x;
      s.ty = y - OFFY;
    },
    onKey: function onKey(G, key, isDown) {
      G.s.keys[key] = isDown;
      if (isDown) G.s.touched = true;
    },
    draw: function draw(G, c) {
      var s = G.s,
        L = s.L,
        W = G.W,
        dark = G.dark();
      drawTable(G, c, L, dark);
      var p = s.puck,
        sp = Math.hypot(p.vx, p.vy),
        neon = dark ? "#7df9ff" : "#0077b6";
      if (p.y > -100) {
        if (sp > 300) {
          c.globalAlpha = Math.min(0.35, sp / 3000);
          c.fillStyle = neon;
          c.beginPath();
          c.arc(p.x - p.vx * 0.03, p.y - p.vy * 0.03, L.pr * 0.9, 0, 7);
          c.fill();
          c.globalAlpha = 1;
        }
        if (s.spawnT > 0) {
          c.globalAlpha = s.spawnT * 1.4;
          c.strokeStyle = neon;
          c.lineWidth = 2;
          c.beginPath();
          c.arc(p.x, p.y, L.pr + (0.5 - s.spawnT) * 40, 0, 7);
          c.stroke();
          c.globalAlpha = 1;
        }
        c.save();
        c.shadowColor = neon;
        c.shadowBlur = dark ? 14 : 6;
        c.fillStyle = dark ? "#10122a" : "#1b1e3a";
        c.beginPath();
        c.arc(p.x, p.y, L.pr, 0, 7);
        c.fill();
        c.restore();
        c.strokeStyle = neon;
        c.lineWidth = 3;
        c.beginPath();
        c.arc(p.x, p.y, L.pr - 1.5, 0, 7);
        c.stroke();
        c.fillStyle = "#ffd23f";
        c.beginPath();
        c.arc(p.x, p.y, L.pr * 0.3, 0, 7);
        c.fill();
      }
      drawMallet(G, c, s.cat, L.mr, "#ff4f9a", dark, false);
      drawMallet(G, c, s.me, L.pmr, "#2f8fff", dark, true);
      if (!s.touched && s.pg + s.cg === 0) {
        var bob = Math.sin(G.t * 5) * 4;
        c.fillStyle = "#000";
        G.emoji(c, "👆", s.me.x + 6, s.me.y + L.pmr + 22 + bob, 28);
      }
      G.hint(c, "DRAG TO MOVE · HIT IT HARD", 4, L.mid + L.th * 0.12);
      var _iterator2 = _createForOfIteratorHelper(s.pops),
        _step2;
      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var q = _step2.value;
          G.text(c, q.txt, q.x, q.y - (1 - q.t) * 24, 10, q.c);
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
      var hh = G.hud(c, "", "YOU ".concat(s.pg, " - ").concat(s.cg, " CAT"), "TO ".concat(WIN));
      G.img(c, s.face, 20, hh / 2, 24);
      if (s.gflash > 0) {
        c.save();
        if (dark) c.globalCompositeOperation = "lighter";
        c.globalAlpha = s.gflash * (dark ? 0.3 : 0.45);
        c.fillStyle = s.gmine ? "#ffd23f" : "#ff4f9a";
        c.fillRect(0, s.gmine ? L.t - 6 : L.mid, W, L.th / 2 + 6);
        c.restore();
      }
      if (s.banner) {
        var b = s.banner,
          by = L.mid,
          age = b.txt === "GOAL!" ? 1.2 - b.t : 1;
        var pop = age < 0.25 ? 0.6 + age * 2.4 : 1 + Math.sin(G.t * 10) * 0.03;
        c.fillStyle = "rgba(0,0,0,.6)";
        c.fillRect(0, by - 30, W, 60);
        var big = b.txt === "GOAL!" ? Math.min(40, W / 8) : Math.min(20, W / 15);
        G.banner(c, b.txt, b.c, by, big * pop);
      }
    }
  });
  function drawMallet(G, c, m, r, col, dark, dog) {
    c.save();
    c.shadowColor = col;
    c.shadowBlur = dark ? 18 : 8;
    c.shadowOffsetY = dark ? 0 : 3;
    c.fillStyle = col;
    c.beginPath();
    c.arc(m.x, m.y, r, 0, 7);
    c.fill();
    c.restore();
    c.fillStyle = dark ? "rgba(0,0,0,.35)" : "rgba(255,255,255,.35)";
    c.beginPath();
    c.arc(m.x, m.y, r * 0.8, 0, 7);
    c.fill();
    c.strokeStyle = "#fff";
    c.lineWidth = 2;
    c.beginPath();
    c.arc(m.x, m.y, r - 1, 0, 7);
    c.stroke();
    if (dog) G.img(c, G.s.face, m.x, m.y, r * 1.55);else {
      c.fillStyle = "#000";
      G.emoji(c, "🐈", m.x, m.y + 1, r * 1.2);
    }
  }
  function drawTable(G, c, L, dark) {
    var key = [L.W, L.H, dark, G.dpr].join();
    if (!bg || bg.key !== key) {
      var cv = document.createElement("canvas");
      cv.width = Math.round(L.W * G.dpr);
      cv.height = Math.round(L.H * G.dpr);
      var x = cv.getContext("2d");
      x.scale(G.dpr, G.dpr);
      paintTable(x, L, dark);
      bg = {
        key: key,
        cv: cv
      };
    }
    c.drawImage(bg.cv, 0, 0, L.W, L.H);
  }
  function paintTable(c, L, dark) {
    var W = L.W,
      H = L.H;
    var lineA = dark ? "#ff4fd8" : "#e0218a",
      lineB = dark ? "#38e8ff" : "#1f6fd1";
    c.fillStyle = dark ? "#05060f" : "#8fb4d9";
    c.fillRect(0, 0, W, H);
    c.fillStyle = dark ? "#1b2150" : "#24497e";
    rr(c, L.l - 6, L.t - 6, L.tw + 12, L.th + 12, 14);
    c.fill();
    var g = c.createLinearGradient(0, L.t, 0, L.b);
    if (dark) {
      g.addColorStop(0, "#0b1440");
      g.addColorStop(0.5, "#101c55");
      g.addColorStop(1, "#0b1440");
    } else {
      g.addColorStop(0, "#a9dcff");
      g.addColorStop(0.5, "#d4efff");
      g.addColorStop(1, "#a9dcff");
    }
    c.fillStyle = g;
    rr(c, L.l, L.t, L.tw, L.th, 9);
    c.fill();
    c.save();
    rr(c, L.l, L.t, L.tw, L.th, 9);
    c.clip();
    var gl = c.createLinearGradient(L.l, L.t, L.r, L.b);
    gl.addColorStop(0, "rgba(255,255,255,0)");
    gl.addColorStop(0.42, "rgba(255,255,255,0)");
    gl.addColorStop(0.5, dark ? "rgba(255,255,255,.06)" : "rgba(255,255,255,.45)");
    gl.addColorStop(0.58, "rgba(255,255,255,0)");
    c.fillStyle = gl;
    c.fillRect(L.l, L.t, L.tw, L.th);
    c.fillStyle = dark ? "rgba(140,200,255,.22)" : "rgba(30,80,150,.22)";
    var sp = 17;
    for (var y = L.t + sp / 2 + 2; y < L.b - 4; y += sp) for (var x = L.l + sp / 2 + Math.round((y - L.t) / sp) % 2 * sp / 2; x < L.r - 4; x += sp) c.fillRect(x - 1, y - 1, 2.2, 2.2);
    c.lineWidth = 3;
    c.shadowBlur = dark ? 10 : 0;
    c.strokeStyle = lineA;
    c.shadowColor = lineA;
    c.beginPath();
    c.moveTo(L.l, L.mid);
    c.lineTo(L.r, L.mid);
    c.stroke();
    c.beginPath();
    c.arc(W / 2, L.mid, L.tw * 0.16, 0, 7);
    c.stroke();
    c.strokeStyle = lineB;
    c.shadowColor = lineB;
    c.beginPath();
    c.arc(W / 2, L.t, L.gw * 0.62, 0, Math.PI);
    c.stroke();
    c.beginPath();
    c.arc(W / 2, L.b, L.gw * 0.62, Math.PI, Math.PI * 2);
    c.stroke();
    var ca = L.tw * 0.12;
    c.lineWidth = 2;
    c.beginPath();
    c.arc(L.l, L.t, ca, 0, Math.PI / 2);
    c.stroke();
    c.beginPath();
    c.arc(L.r, L.t, ca, Math.PI / 2, Math.PI);
    c.stroke();
    c.beginPath();
    c.arc(L.l, L.b, ca, -Math.PI / 2, 0);
    c.stroke();
    c.beginPath();
    c.arc(L.r, L.b, ca, Math.PI, Math.PI * 1.5);
    c.stroke();
    c.globalAlpha = 0.5;
    c.beginPath();
    c.moveTo(L.l, L.t + L.th * 0.25);
    c.lineTo(L.r, L.t + L.th * 0.25);
    c.moveTo(L.l, L.b - L.th * 0.25);
    c.lineTo(L.r, L.b - L.th * 0.25);
    c.stroke();
    c.globalAlpha = 1;
    c.shadowBlur = 0;
    c.fillStyle = lineA;
    c.beginPath();
    c.arc(W / 2, L.mid, 5, 0, 7);
    c.fill();
    c.restore();
    c.fillStyle = "#000";
    c.fillRect(L.gl, L.t - 8, L.gw, 9);
    c.fillRect(L.gl, L.b - 1, L.gw, 9);
    c.shadowBlur = dark ? 12 : 0;
    c.lineWidth = 3;
    c.strokeStyle = "#ff4f9a";
    c.shadowColor = "#ff4f9a";
    c.beginPath();
    c.moveTo(L.gl, L.t);
    c.lineTo(L.gl, L.t - 8);
    c.moveTo(L.gr, L.t);
    c.lineTo(L.gr, L.t - 8);
    c.stroke();
    c.strokeStyle = "#2f8fff";
    c.shadowColor = "#2f8fff";
    c.beginPath();
    c.moveTo(L.gl, L.b);
    c.lineTo(L.gl, L.b + 8);
    c.moveTo(L.gr, L.b);
    c.lineTo(L.gr, L.b + 8);
    c.stroke();
    c.strokeStyle = lineB;
    c.shadowColor = lineB;
    c.lineWidth = 2;
    rr(c, L.l, L.t, L.tw, L.th, 9);
    c.stroke();
    c.shadowBlur = 0;
    c.fillStyle = "#000";
    c.fillRect(L.gl + 2, L.t - 4, L.gw - 4, 6);
    c.fillRect(L.gl + 2, L.b - 2, L.gw - 4, 6);
  }
  function rr(c, x, y, w, h, r) {
    c.beginPath();
    c.moveTo(x + r, y);
    c.arcTo(x + w, y, x + w, y + h, r);
    c.arcTo(x + w, y + h, x, y + h, r);
    c.arcTo(x, y + h, x, y, r);
    c.arcTo(x, y, x + w, y, r);
    c.closePath();
  }
})();