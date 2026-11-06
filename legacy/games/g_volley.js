function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
(function () {
  var TO = 11;
  var lerp = function lerp(a, b, t) {
    return a + (b - a) * t;
  };
  var clamp = function clamp(v, a, b) {
    return v < a ? a : v > b ? b : v;
  };
  var rnd = function rnd(a, b) {
    return a + Math.random() * (b - a);
  };
  function geo(G) {
    var s = G.s,
      W = G.W,
      H = G.H;
    s.PR = Math.max(15, Math.min(W * 0.058, H * 0.042));
    s.BR = s.PR * 0.62;
    s.gy = H * 0.8;
    s.nx = W / 2;
    s.half = W / 2;
    s.netTop = s.gy - 4.6 * s.PR;
    s.g = H * 1.25 / (0.85 * 0.85);
    s.gP = H * 2.4;
    s.JV = Math.sqrt(2 * s.gP * 3.3 * s.PR);
    s.tApex = s.JV / s.gP;
    s.SPD = W * 0.72;
    s.atkY = s.gy - 6.3 * s.PR;
    s.dots = [];
    for (var i = 0; i < 70; i++) s.dots.push([Math.random() * W, s.gy - 1.2 * s.PR + Math.random() * (H - s.gy + 1.2 * s.PR)]);
  }
  function mk(s, team, kind, x) {
    return {
      team: team,
      kind: kind,
      x: x,
      y: s.gy,
      vx: 0,
      vy: 0,
      gr: true,
      tx: x,
      face: team === "D" ? 1 : -1,
      sc: kind === "pup" ? 0.88 : 1,
      run: 0,
      arm: 0,
      pose: "idle",
      swung: false,
      jumped: false,
      willMiss: false,
      cd: 0,
      lean: 0,
      fur: kind === "dog" ? "#d9a066" : kind === "pup" ? "#f0c890" : kind === "cat1" ? "#f2a33a" : "#a7adb8"
    };
  }
  var lvl = function lvl(s) {
    return Math.min(1, (s.ds + s.cs) / 14);
  };
  var setSpot = function setSpot(s, team) {
    return team === "D" ? s.nx - 0.24 * s.half : s.nx + 0.24 * s.half;
  };
  var courtLo = function courtLo(s, team) {
    return team === "D" ? s.PR : s.nx + 1.0 * s.PR;
  };
  var courtHi = function courtHi(s, team) {
    return team === "D" ? s.nx - 1.0 * s.PR : s.nx * 2 - s.PR;
  };
  var headTop = function headTop(s, p) {
    return p.y - 3.0 * s.PR * p.sc;
  };
  var other = function other(t) {
    return t === "D" ? "C" : "D";
  };
  function timeToY(s, yT) {
    var b = s.b,
      disc = b.vy * b.vy - 2 * s.g * (b.y - yT);
    if (disc < 0) return null;
    var t = (-b.vy + Math.sqrt(disc)) / s.g;
    return t >= 0 ? t : null;
  }
  function landX(s) {
    var t = timeToY(s, s.gy - s.BR);
    return t == null ? s.b.x : s.b.x + s.b.vx * t;
  }
  function launch(s, x1, y1, T) {
    var b = s.b;
    T *= 0.85;
    b.vx = (x1 - b.x) / T;
    b.vy = (y1 - b.y) / T - 0.5 * s.g * T;
  }
  function clearsNet(s) {
    var b = s.b;
    if (Math.abs(b.vx) < 1) return false;
    var t = (s.nx - b.x) / b.vx;
    if (t <= 0) return false;
    return b.y + b.vy * t + 0.5 * s.g * t * t < s.netTop - s.BR * 1.3;
  }
  function puff(s, x, y, n, col) {
    for (var i = 0; i < n; i++) {
      var p = s.parts[s.pi];
      s.pi = (s.pi + 1) % s.parts.length;
      p.x = x;
      p.y = y;
      p.vx = rnd(-120, 120);
      p.vy = rnd(-220, -60);
      p.l = rnd(0.35, 0.7);
      p.c = col;
    }
  }
  function say(s, txt, x, y, col) {
    var f = s.floats[s.fi];
    s.fi = (s.fi + 1) % s.floats.length;
    f.txt = txt;
    f.x = x;
    f.y = y;
    f.t = 0.8;
    f.c = col;
  }
  function banner(s, txt, col, t) {
    s.ban = {
      txt: txt,
      col: col,
      t: t || 1.1
    };
  }
  function newPoint(G, server) {
    var s = G.s,
      h = s.half,
      nx = s.nx;
    s.dog = mk(s, "D", "dog", nx - 0.55 * h);
    s.pup = mk(s, "D", "pup", setSpot(s, "D"));
    s.c1 = mk(s, "C", "cat1", nx + 0.6 * h);
    s.c2 = mk(s, "C", "cat2", setSpot(s, "C"));
    s.pl = [s.pup, s.c2, s.c1, s.dog];
    s.server = server;
    s.plan = null;
    s.lastAtk = null;
    s.trN = 0;
    s.lastQ = 1;
    s.b = {
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      spin: 0
    };
    if (server === "D") {
      s.dog.x = s.dog.tx = G.W * 0.12;
      s.phase = "serveD";
      s.serveT = 6;
    } else {
      s.c1.x = s.c1.tx = G.W * 0.88;
      s.phase = "serveC";
      s.serveT = 0.9;
    }
    holdBall(s);
  }
  function holdBall(s) {
    var p = s.server === "D" ? s.dog : s.c1;
    s.b.x = p.x + p.face * 0.5 * s.PR;
    s.b.y = p.y - 3.7 * s.PR + Math.sin(s.clock * 5) * 3;
    s.b.vx = s.b.vy = 0;
  }
  function serve(G) {
    var s = G.s,
      team = s.server,
      p = team === "D" ? s.dog : s.c1,
      opp = other(team),
      h = s.half;
    var f = rnd(0.35, 0.85),
      x1 = opp === "C" ? s.nx + f * h : s.nx - f * h;
    var T = 1.3;
    launch(s, x1, s.gy - s.BR, T);
    while (!clearsNet(s) && T < 2.4) {
      T += 0.15;
      launch(s, x1, s.gy - s.BR, T);
    }
    p.arm = 0.3;
    p.pose = "spike";
    p.vy = -s.JV * 0.5;
    p.gr = false;
    s.phase = "rally";
    s.lastAtk = {
      team: team,
      kind: "serve",
      q: 0
    };
    G.sfx("pop");
    setReceive(G, opp);
  }
  function setReceive(G, team) {
    var s = G.s;
    if (team === "D") {
      s.plan = {
        team: team,
        kind: "bump",
        hitter: s.dog
      };
      s.pup.tx = setSpot(s, "D");
      return;
    }
    var tc = timeToY(s, s.gy - 2.9 * s.PR),
      xc = clamp(tc == null ? s.b.x : s.b.x + s.b.vx * tc, courtLo(s, "C"), courtHi(s, "C"));
    var r = Math.abs(s.c1.x - xc) <= Math.abs(s.c2.x - xc) ? s.c1 : s.c2,
      o = r === s.c1 ? s.c2 : s.c1;
    var L = lvl(s),
      la = s.lastAtk || {
        kind: "lob",
        q: 0
      };
    var near = Math.min(Math.abs(s.c1.x - xc), Math.abs(s.c2.x - xc)) < 1.6 * s.PR ? 0.3 : 0;
    var pMiss = la.kind === "spike" ? 1 - clamp(0.26 + 0.38 * L - 0.3 * la.q + near, 0.1, 0.8) : la.kind === "serve" ? 0.06 : 0.04;
    r.willMiss = Math.random() < pMiss;
    o.willMiss = false;
    r.jumped = o.jumped = false;
    r.tx = r.willMiss ? xc - Math.sign(xc - r.x || 1) * 1.9 * s.PR : xc + 0.2 * s.PR;
    o.tx = setSpot(s, "C");
    s.plan = {
      team: team,
      kind: "bump",
      hitter: r
    };
  }
  function hit(G, p, kind, q) {
    var s = G.s,
      team = p.team,
      h = s.half;
    p.arm = 0.28;
    p.pose = kind;
    s.trN = 0;
    if (kind === "bump") {
      var setter = team === "D" ? s.pup : p === s.c1 ? s.c2 : s.c1;
      var x1 = setSpot(s, team);
      if (q < 0.45) x1 += (Math.random() - 0.5) * 0.5 * h;
      x1 = clamp(x1, courtLo(s, team) + s.PR, courtHi(s, team) - s.PR);
      launch(s, x1, s.gy - 2.9 * s.PR * setter.sc, q >= 0.45 ? 1.05 : 0.9);
      setter.tx = x1;
      s.lastQ = q;
      s.plan = {
        team: team,
        kind: "set",
        hitter: setter
      };
      if (team === "C") p.tx = s.nx + rnd(0.25, 0.42) * h;
      puff(s, p.x, s.gy, 4, "#e9cf8f");
      G.sfx("pop");
    } else if (kind === "set") {
      var atk = team === "D" ? s.dog : p === s.c1 ? s.c2 : s.c1;
      var ax;
      if (team === "D") ax = s.lastQ >= 0.45 ? clamp(s.dog.x + 0.5 * s.PR, s.nx - 0.6 * h, s.nx - 0.14 * h) : s.nx - 0.35 * h;else {
        ax = s.nx + rnd(0.16, 0.4) * h;
        atk.tx = ax + 0.5 * s.PR;
        atk.jumped = false;
      }
      launch(s, ax, s.atkY + (s.lastQ >= 0.45 ? 0 : 0.6 * s.PR), 0.98);
      p.tx = team === "D" ? s.nx - 0.62 * h : s.nx + 0.62 * h;
      s.plan = {
        team: team,
        kind: "atk",
        hitter: atk
      };
      G.sfx("pop");
    }
  }
  function attack(G, p, q, forceLob) {
    var s = G.s,
      team = p.team,
      opp = other(team),
      b = s.b,
      h = s.half,
      L = lvl(s);
    p.arm = 0.3;
    p.pose = "spike";
    s.trN = 0;
    var lo = courtLo(s, opp) + 0.4 * s.PR,
      hi = courtHi(s, opp) - 0.4 * s.PR;
    var spike = !forceLob && b.y < s.netTop - 0.2 * s.PR && Math.abs(p.x - s.nx) < 0.78 * h;
    if (team === "C") spike = spike && Math.random() < 0.65 + 0.3 * L;else spike = spike && q >= 0.2;
    var ok = false;
    if (spike) {
      var foes = opp === "C" ? [s.c1, s.c2] : [s.dog],
        fspd = opp === "C" ? lerp(G.W * 0.62, G.W * 0.85, L) : s.SPD;
      var aim = team === "D" ? true : Math.random() < 0.6 + 0.35 * L;
      var T0 = team === "D" ? lerp(0.66, 0.4, q) : lerp(0.52, 0.36, L) * (1.1 - 0.2 * q);
      var bx = b.x,
        by = b.y;
      var best = null,
        bs = 1e9;
      for (var _i = 0, _arr = [0.18, 0.32, 0.46, 0.6, 0.74, 0.88, 0.96]; _i < _arr.length; _i++) {
        var f = _arr[_i];
        var x1 = clamp(opp === "C" ? s.nx + f * h : s.nx - f * h, lo, hi);
        var T = T0,
          good = false;
        for (; T < 1.15; T += 0.04) {
          b.x = bx;
          b.y = by;
          launch(s, x1, s.gy - s.BR, T);
          if (clearsNet(s)) {
            good = true;
            break;
          }
        }
        if (!good) continue;
        var d = 1e9;
        var _iterator = _createForOfIteratorHelper(foes),
          _step;
        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var e = _step.value;
            d = Math.min(d, Math.abs(e.x - x1));
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
        var sc = aim ? T - d / fspd + Math.random() * (team === "D" ? (1 - q) * 0.35 : 0.06) : Math.random();
        if (sc < bs) {
          bs = sc;
          best = [x1, T];
        }
      }
      b.x = bx;
      b.y = by;
      if (best) {
        launch(s, best[0], s.gy - s.BR, best[1]);
        ok = true;
      }
    }
    if (ok) {
      s.lastAtk = {
        team: team,
        kind: "spike",
        q: q
      };
      if (team === "D") {
        if (q >= 0.55) {
          banner(s, "SPIKE!", "#ffd23f", 0.9);
          s.shake = 0.15;
        } else say(s, "SPIKE", p.x, p.y - 4 * s.PR, "#fff");
        G.sfx("pop");
        G.buzz();
      } else {
        say(s, "SPIKE!", p.x, p.y - 4 * s.PR, "#e8b4ff");
        G.sfx("pop");
      }
      puff(s, b.x, b.y, 6, "#fff3c4");
    } else {
      var _x = opp === "C" ? s.nx + rnd(0.35, 0.85) * h : s.nx - rnd(0.3, 0.85) * h;
      if (opp === "D" && Math.random() < 0.5 + 0.3 * L) _x = s.dog.x < s.nx - 0.5 * h ? s.nx - rnd(0.2, 0.32) * h : s.nx - rnd(0.82, 0.92) * h;
      var _T = 1.1;
      launch(s, _x, s.gy - s.BR, _T);
      while (!clearsNet(s) && _T < 2.6) {
        _T += 0.12;
        launch(s, _x, s.gy - s.BR, _T);
      }
      s.lastAtk = {
        team: team,
        kind: "lob",
        q: 0
      };
      if (team === "D") say(s, "TIP", p.x, p.y - 4 * s.PR, "#fff");
      G.sfx("pop");
    }
    setReceive(G, opp);
  }
  function point(G, winner) {
    var s = G.s,
      b = s.b;
    s.phase = "dead";
    s.deadT = 1.25;
    s.plan = null;
    s.winner = winner;
    puff(s, b.x, s.gy, 14, "#e9cf8f");
    b.y = s.gy - s.BR;
    b.vy = -Math.abs(b.vy) * 0.3;
    b.vx *= 0.35;
    if (winner === "D") {
      s.ds++;
      if (s.lastAtk && s.lastAtk.team === "D" && s.lastAtk.kind === "spike") {
        s.kills++;
        banner(s, "KILL!", "#ffd23f", 1.3);
        s.shake = 0.45;
        s.mood = ":dawgpog:";
        s.moodT = 1.6;
        G.buzz();
        puff(s, b.x, s.gy, 10, "#ffd23f");
      } else banner(s, "POINT DAWGS!", "#7dff8a", 1.2);
      G.sfx("win");
    } else {
      s.cs++;
      banner(s, "CATS SCORE", "#e8b4ff", 1.2);
      G.sfx("lose");
      s.mood = ":dawgsweat:";
      s.moodT = 1.6;
    }
  }
  var total = function total(s) {
    return Math.min(9999, s.ds * 100 + (s.ds >= TO ? 500 : 0) + s.kills * 25);
  };
  function action(G) {
    var s = G.s,
      d = s.dog,
      b = s.b;
    if (s.phase === "serveD") {
      serve(G);
      return;
    }
    if (s.phase !== "rally" || d.cd > 0) return;
    var pl = s.plan,
      mine = pl && pl.hitter === d && b.x < s.nx;
    if (mine && pl.kind === "bump") {
      var ht = headTop(s, d),
        ideal = ht - s.BR,
        dx = Math.abs(b.x - d.x);
      if (dx < 2.4 * s.PR && b.y > ht - 4.2 * s.PR && b.y < d.y - 0.4 * s.PR) {
        var q = clamp(1 - Math.abs(b.y - ideal) / (2.6 * s.PR) - 0.25 * dx / (2.4 * s.PR), 0, 1);
        hit(G, d, "bump", q);
        if (q > 0.72) say(s, "PERFECT!", d.x, ht - 1.4 * s.PR, "#7dff8a");else if (q > 0.45) say(s, "NICE", d.x, ht - 1.4 * s.PR, "#fff");else say(s, b.y < ideal ? "EARLY" : "LATE", d.x, ht - 1.4 * s.PR, "#ffb46b");
      } else {
        d.arm = 0.18;
        d.pose = "bump";
        d.cd = 0.22;
      }
      return;
    }
    if (d.gr) {
      d.vy = -s.JV * (mine ? 1 : 0.8);
      d.gr = false;
      d.swung = false;
      d.pose = "ready";
      d.cd = 0.25;
    }
  }
  function movePlayer(s, p, dt, spd) {
    var dx = p.tx - p.x,
      st = spd * dt;
    var m = Math.abs(dx) <= st ? dx : Math.sign(dx) * st;
    p.x += m;
    p.vx = m / Math.max(dt, 1e-4);
    p.x = clamp(p.x, courtLo(s, p.team), courtHi(s, p.team));
  }
  function physPlayer(s, p, dt) {
    if (!p.gr) {
      p.y += p.vy * dt + 0.5 * s.gP * dt * dt;
      p.vy += s.gP * dt;
      if (p.y >= s.gy) {
        p.y = s.gy;
        p.vy = 0;
        p.gr = true;
        p.jumped = false;
        if (p.pose === "ready") p.pose = "idle";
      }
    }
    if (p.gr && Math.abs(p.vx) > 5) p.run += Math.abs(p.vx) * dt * 0.09;
    if (p.arm > 0) {
      p.arm -= dt;
      if (p.arm <= 0 && p.pose !== "ready") p.pose = "idle";
    }
    if (p.cd > 0) p.cd -= dt;
    p.lean *= Math.pow(0.02, dt);
  }
  var bodyHit = function bodyHit(s, p, b) {
    return Math.abs(b.x - p.x) < 0.8 * s.PR * p.sc + s.BR && b.y > headTop(s, p) - s.BR && b.y < p.y - 0.3 * s.PR && b.vy > 0;
  };
  function pawHit(s, p, b) {
    var px = p.x + p.face * 0.5 * s.PR,
      py = p.y - 3.25 * s.PR * p.sc;
    return Math.hypot(b.x - px, b.y - py) < 1.5 * s.PR + s.BR;
  }
  function aiTouch(G, p) {
    var s = G.s,
      b = s.b,
      pl = s.plan;
    if (!pl || pl.hitter !== p || p.willMiss) return;
    if (p.team === "D" !== b.x < s.nx) return;
    if (pl.kind === "atk") {
      if (p.gr && !p.jumped && b.y < s.atkY) {
        var t = timeToY(s, s.atkY);
        if (t != null && b.vy > -50 && t <= s.tApex + 0.03 && Math.abs(b.x + b.vx * t - (p.x + p.face * 0.5 * s.PR)) < 1.6 * s.PR) {
          p.vy = -s.JV;
          p.gr = false;
          p.jumped = true;
          p.pose = "ready";
        }
      }
      if (!p.gr && pawHit(s, p, b)) {
        attack(G, p, clamp(0.35 + 0.5 * lvl(s) + Math.random() * 0.3, 0, 1));
        return;
      }
      if (bodyHit(s, p, b)) attack(G, p, 0, true);
      return;
    }
    var ht = headTop(s, p);
    if (b.vy > 0 && b.y >= ht - 0.5 * s.PR && b.y < p.y - 0.8 * s.PR && Math.abs(b.x - p.x) < 1.4 * s.PR + s.BR) hit(G, p, pl.kind, p.team === "C" ? rnd(0.5, 1) : 1);
  }
  defGame({
    key: "volley",
    name: "Beach Dawgs",
    icon: "🏐",
    max: 9999,
    cat: "sports",
    blurb: "2-on-2 beach volleyball. Bump, set, SPIKE.",
    how: "Hold and drag anywhere to run: your dawg follows your finger. The big shadow on the sand shows where the ball will land, so get under it. Tap when the ball reaches your head to BUMP it to your pup. The pup sets it up by the net: tap to jump and SPIKE (hit it at the top of your jump). Tap to serve. Rally scoring, first to 11. Points x100, +500 for a win, +25 per spike kill.",
    reset: function reset(G) {
      G.s = {
        ds: 0,
        cs: 0,
        kills: 0,
        clock: 0,
        hold: null,
        kl: false,
        kr: false,
        ban: null,
        shake: 0,
        mood: ":dawgW:",
        moodT: 0,
        parts: [],
        pi: 0,
        floats: [],
        fi: 0,
        trx: new Float32Array(10),
        try_: new Float32Array(10),
        trN: 0,
        trI: 0,
        ended: false
      };
      var s = G.s;
      for (var i = 0; i < 48; i++) s.parts.push({
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        l: 0,
        c: "#fff"
      });
      for (var _i2 = 0; _i2 < 4; _i2++) s.floats.push({
        txt: "",
        x: 0,
        y: 0,
        t: 0,
        c: "#fff"
      });
      geo(G);
      newPoint(G, "D");
    },
    update: function update(G, dt) {
      var s = G.s,
        d = s.dog;
      s.clock += dt;
      if (s.moodT > 0) {
        s.moodT -= dt;
        if (s.moodT <= 0) s.mood = ":dawgW:";
      }
      if (s.ban) {
        s.ban.t -= dt;
        if (s.ban.t <= 0) s.ban = null;
      }
      if (s.shake > 0) s.shake = Math.max(0, s.shake - dt);
      var _iterator2 = _createForOfIteratorHelper(s.parts),
        _step2;
      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var _p2 = _step2.value;
          if (_p2.l > 0) {
            _p2.l -= dt;
            _p2.x += _p2.vx * dt;
            _p2.y += _p2.vy * dt;
            _p2.vy += 600 * dt;
          }
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
      var _iterator3 = _createForOfIteratorHelper(s.floats),
        _step3;
      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var f = _step3.value;
          if (f.t > 0) f.t -= dt;
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }
      if (s.phase !== "serveD") {
        if (s.kl || s.kr) d.tx = d.x + (s.kr ? 60 : 0) - (s.kl ? 60 : 0);else if (s.hold) {
          s.hold.t += dt;
          d.tx = s.hold.t > 0.1 || s.hold.moved ? s.hold.x : d.x;
        } else d.tx = d.x;
        movePlayer(s, d, dt, s.SPD);
      } else d.vx = 0;
      var L = lvl(s);
      movePlayer(s, s.pup, dt, G.W * 0.9);
      var cs = lerp(G.W * 0.62, G.W * 0.85, L);
      movePlayer(s, s.c1, dt, cs);
      movePlayer(s, s.c2, dt, cs);
      var _iterator4 = _createForOfIteratorHelper(s.pl),
        _step4;
      try {
        for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
          var _p3 = _step4.value;
          physPlayer(s, _p3, dt);
        }
      } catch (err) {
        _iterator4.e(err);
      } finally {
        _iterator4.f();
      }
      if (s.phase === "serveD" || s.phase === "serveC") {
        holdBall(s);
        s.serveT -= dt;
        if (s.serveT <= 0) serve(G);
        return;
      }
      var b = s.b;
      b.x += b.vx * dt;
      b.y += b.vy * dt + 0.5 * s.g * dt * dt;
      b.vy += s.g * dt;
      b.spin += b.vx * dt * 0.06;
      if (b.x < s.BR) {
        b.x = s.BR;
        b.vx = Math.abs(b.vx) * 0.5;
      }
      if (b.x > G.W - s.BR) {
        b.x = G.W - s.BR;
        b.vx = -Math.abs(b.vx) * 0.5;
      }
      s.trI = (s.trI + 1) % 10;
      s.trx[s.trI] = b.x;
      s.try_[s.trI] = b.y;
      s.trN = Math.min(10, s.trN + 1);
      if (s.phase === "dead") {
        if (b.y >= s.gy - s.BR) {
          b.y = s.gy - s.BR;
          b.vy = -Math.abs(b.vy) * 0.35;
          b.vx *= 0.6;
          if (Math.abs(b.vy) < 40) b.vy = 0;
        }
        s.deadT -= dt;
        if (s.deadT <= 0) {
          if (s.ds >= TO || s.cs >= TO) {
            if (s.ended) return;
            s.ended = true;
            G.over(total(s), s.ds >= TO ? "Beach Dawgs win ".concat(s.ds, "-").concat(s.cs, "!") : "Cats win ".concat(s.cs, "-").concat(s.ds, ". Ruff."));
            return;
          }
          newPoint(G, s.winner);
        }
        return;
      }
      var pl = s.plan;
      if (pl && pl.hitter === d && b.x < s.nx) {
        if (pl.kind === "atk" && !d.gr && !d.swung && pawHit(s, d, b)) {
          d.swung = true;
          attack(G, d, clamp(1 - Math.abs(d.vy) / s.JV, 0, 1));
        } else if (bodyHit(s, d, b)) {
          if (pl.kind === "bump") {
            hit(G, d, "bump", 0.15);
            say(s, "OOF", d.x, headTop(s, d) - 1.4 * s.PR, "#ffb46b");
          } else attack(G, d, 0, true);
        }
      } else {
        var _iterator5 = _createForOfIteratorHelper(s.pl),
          _step5;
        try {
          for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
            var p = _step5.value;
            if (p !== d) aiTouch(G, p);
          }
        } catch (err) {
          _iterator5.e(err);
        } finally {
          _iterator5.f();
        }
      }
      if (s.plan && s.plan.team === "C" && s.plan.hitter.willMiss && b.y > s.gy - 4 * s.PR) {
        var _p = s.plan.hitter;
        _p.lean = clamp(_p.lean + Math.sign(b.x - _p.x) * dt * 6, -1, 1);
      }
      if (b.y >= s.gy - s.BR) point(G, b.x < s.nx ? "C" : "D");
    },
    down: function down(G, x) {
      var s = G.s;
      s.hold = {
        x: x,
        x0: x,
        t: 0,
        moved: false
      };
      action(G);
    },
    move: function move(G, x) {
      var s = G.s;
      if (!s.hold) return;
      s.hold.x = x;
      if (Math.abs(x - s.hold.x0) > 10) s.hold.moved = true;
    },
    up: function up(G) {
      G.s.hold = null;
    },
    onKey: function onKey(G, k, isDown) {
      var s = G.s;
      if (k === "ArrowLeft" || k === "a") s.kl = isDown;else if (k === "ArrowRight" || k === "d") s.kr = isDown;else if ((k === " " || k === "ArrowUp" || k === "w") && isDown) action(G);
    },
    draw: function draw(G, c) {
      var s = G.s,
        W = G.W,
        H = G.H,
        dark = G.dark(),
        PR = s.PR,
        b = s.b;
      c.save();
      if (s.shake > 0) c.translate((Math.random() - 0.5) * 22 * s.shake, (Math.random() - 0.5) * 22 * s.shake);
      var hz = s.gy - 3.4 * PR;
      if (!s.bg || s.bg.k !== "".concat(W, "|").concat(H, "|").concat(dark)) {
        var sk = c.createLinearGradient(0, 0, 0, hz);
        if (dark) {
          sk.addColorStop(0, "#0d1033");
          sk.addColorStop(1, "#3a2d6b");
        } else {
          sk.addColorStop(0, "#5cc8ff");
          sk.addColorStop(1, "#c9f1ff");
        }
        s.bg = {
          k: "".concat(W, "|").concat(H, "|").concat(dark),
          sk: sk
        };
      }
      c.fillStyle = s.bg.sk;
      c.fillRect(-20, -20, W + 40, hz + 20);
      if (dark) {
        c.fillStyle = "#fff";
        for (var i = 0; i < 24; i++) c.fillRect(i * 97 % W, 40 + i * 53 % (hz * 0.6), 2, 2);
        c.fillStyle = "#f4f1c9";
        c.beginPath();
        c.arc(W * 0.8, H * 0.16, PR * 1.4, 0, 7);
        c.fill();
        c.fillStyle = "#151640";
        c.beginPath();
        c.arc(W * 0.8 + PR * 0.6, H * 0.16 - PR * 0.3, PR * 1.2, 0, 7);
        c.fill();
      } else {
        c.fillStyle = "#ffe066";
        c.beginPath();
        c.arc(W * 0.8, H * 0.17, PR * 1.8, 0, 7);
        c.fill();
        c.fillStyle = "rgba(255,255,255,0.85)";
        for (var k = 0; k < 2; k++) {
          var cx = k ? W * 0.5 : W * 0.18,
            cy = k ? H * 0.24 : H * 0.14,
            r = k ? 0.8 : 1;
          c.beginPath();
          c.ellipse(cx, cy, PR * 2.2 * r, PR * 0.8 * r, 0, 0, 7);
          c.ellipse(cx + PR * r, cy - PR * 0.5 * r, PR * 1.3 * r, PR * 0.8 * r, 0, 0, 7);
          c.fill();
        }
      }
      c.fillStyle = dark ? "#1b3a6e" : "#1e90d6";
      c.fillRect(-20, hz, W + 40, s.gy - 1.2 * PR - hz);
      c.fillStyle = dark ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.35)";
      for (var _i3 = 0; _i3 < 9; _i3++) {
        var yy = hz + 6 + _i3 % 3 * 9,
          xx = (_i3 * 71 + s.clock * 14) % (W + 60) - 30;
        c.fillRect(xx, yy, 26, 3);
      }
      c.fillStyle = dark ? "#8a7448" : "#f3d98e";
      c.fillRect(-20, s.gy - 1.2 * PR, W + 40, H - s.gy + 1.2 * PR + 20);
      c.fillStyle = dark ? "#7a653c" : "#e6c877";
      var _iterator6 = _createForOfIteratorHelper(s.dots),
        _step6;
      try {
        for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
          var dd = _step6.value;
          c.fillRect(dd[0], dd[1], 3, 3);
        }
      } catch (err) {
        _iterator6.e(err);
      } finally {
        _iterator6.f();
      }
      c.fillStyle = dark ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.7)";
      c.fillRect(PR * 0.5, s.gy + 0.35 * PR, W - PR, 3);
      G.emoji(c, "⛱️", W * 0.07, s.gy - 2.4 * PR, PR * 2.2);
      G.emoji(c, "🌴", W * 0.94, s.gy - 3 * PR, PR * 3.2);
      var nx = s.nx,
        nt = s.netTop,
        nh = (s.gy - nt) * 0.5;
      var nw = Math.max(8, PR * 0.55);
      c.fillStyle = "#6b5440";
      c.fillRect(nx - nw / 2 - 4, nt - 6, 5, s.gy - nt + 8);
      c.fillRect(nx + nw / 2 - 1, nt - 6, 5, s.gy - nt + 8);
      c.fillStyle = dark ? "rgba(10,10,25,0.5)" : "rgba(30,30,40,0.22)";
      c.fillRect(nx - nw / 2, nt, nw, nh);
      c.strokeStyle = dark ? "rgba(255,255,255,0.4)" : "rgba(30,30,30,0.6)";
      c.lineWidth = 1;
      c.beginPath();
      for (var _yy = nt; _yy <= nt + nh + 0.5; _yy += 6) {
        c.moveTo(nx - nw / 2, _yy);
        c.lineTo(nx + nw / 2, _yy);
      }
      for (var _xx = nx - nw / 2; _xx <= nx + nw / 2 + 0.5; _xx += nw / 2) {
        c.moveTo(_xx, nt);
        c.lineTo(_xx, nt + nh);
      }
      c.stroke();
      c.fillStyle = "#fff";
      c.fillRect(nx - nw / 2 - 3, nt - 4, nw + 6, 6);
      c.fillRect(nx - nw / 2 - 1, nt + nh - 2, nw + 2, 3);
      if (s.phase === "rally") {
        var lx = landX(s),
          hgt = clamp((s.gy - b.y) / (H * 0.55), 0, 1),
          _r = s.BR * (2.3 - 1.2 * hgt);
        c.fillStyle = "rgba(0,0,0,".concat(0.22 + 0.2 * (1 - hgt), ")");
        c.beginPath();
        c.ellipse(lx, s.gy + 0.15 * PR, _r, _r * 0.38, 0, 0, 7);
        c.fill();
        if (s.plan && s.plan.team === "D" && s.plan.hitter === s.dog) {
          c.strokeStyle = s.plan.kind === "atk" ? "#ffd23f" : "#ff5a5f";
          c.lineWidth = 2.5;
          c.globalAlpha = 0.6 + 0.4 * Math.sin(s.clock * 14);
          c.beginPath();
          c.ellipse(lx, s.gy + 0.15 * PR, _r + 5, _r * 0.38 + 3, 0, 0, 7);
          c.stroke();
          c.globalAlpha = 1;
        }
      }
      var _iterator7 = _createForOfIteratorHelper(s.pl),
        _step7;
      try {
        for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
          var p = _step7.value;
          drawPlayer(G, c, s, p);
        }
      } catch (err) {
        _iterator7.e(err);
      } finally {
        _iterator7.f();
      }
      if (s.phase !== "serveD" && s.phase !== "serveC" && s.trN > 2) {
        var fast = Math.hypot(b.vx, b.vy) > H * 0.75;
        for (var _k = 1; _k < s.trN; _k++) {
          var _i4 = (s.trI - _k + 10) % 10,
            a = (1 - _k / s.trN) * (fast ? 0.5 : 0.22);
          c.fillStyle = fast ? "rgba(255,140,40,".concat(a, ")") : "rgba(255,255,255,".concat(a, ")");
          c.beginPath();
          c.arc(s.trx[_i4], s.try_[_i4], s.BR * (1 - _k / 14), 0, 7);
          c.fill();
        }
      }
      c.save();
      c.translate(b.x, b.y);
      c.rotate(b.spin);
      c.fillStyle = "#fffbe8";
      c.beginPath();
      c.arc(0, 0, s.BR, 0, 7);
      c.fill();
      c.save();
      c.beginPath();
      c.arc(0, 0, s.BR, 0, 7);
      c.clip();
      c.lineWidth = s.BR * 0.32;
      c.strokeStyle = "#ffcc33";
      c.beginPath();
      c.arc(-s.BR * 0.9, 0, s.BR * 1.05, -0.9, 0.9);
      c.stroke();
      c.strokeStyle = "#2f7de1";
      c.beginPath();
      c.arc(s.BR * 0.9, 0, s.BR * 1.05, Math.PI - 0.9, Math.PI + 0.9);
      c.stroke();
      c.restore();
      c.lineWidth = 1.5;
      c.strokeStyle = "#333";
      c.beginPath();
      c.arc(0, 0, s.BR, 0, 7);
      c.stroke();
      c.restore();
      var _iterator8 = _createForOfIteratorHelper(s.parts),
        _step8;
      try {
        for (_iterator8.s(); !(_step8 = _iterator8.n()).done;) {
          var _p4 = _step8.value;
          if (_p4.l > 0) {
            c.globalAlpha = Math.min(1, _p4.l * 2);
            c.fillStyle = _p4.c;
            c.fillRect(_p4.x - 3, _p4.y - 3, 6, 6);
          }
        }
      } catch (err) {
        _iterator8.e(err);
      } finally {
        _iterator8.f();
      }
      c.globalAlpha = 1;
      var _iterator9 = _createForOfIteratorHelper(s.floats),
        _step9;
      try {
        for (_iterator9.s(); !(_step9 = _iterator9.n()).done;) {
          var f = _step9.value;
          if (f.t > 0) {
            c.globalAlpha = Math.min(1, f.t * 2.5);
            var fy = f.y - (0.8 - f.t) * 30;
            G.text(c, f.txt, f.x + 1, fy + 2, 11, "rgba(0,0,0,0.6)");
            G.text(c, f.txt, f.x, fy, 11, f.c);
          }
        }
      } catch (err) {
        _iterator9.e(err);
      } finally {
        _iterator9.f();
      }
      c.globalAlpha = 1;
      var d = s.dog;
      if (s.phase === "rally" && s.ds + s.cs < 3 && s.plan && s.plan.hitter === d && b.x < nx) {
        var show = false;
        if (s.plan.kind === "atk" && d.gr) {
          var t = timeToY(s, s.atkY);
          show = t != null && b.y < s.atkY && t < s.tApex + 0.16;
        }
        if (s.plan.kind === "bump") show = b.vy > 0 && Math.abs(b.x - d.x) < 2.4 * PR && b.y > headTop(s, d) - 2.8 * PR && b.y < headTop(s, d) + 0.5 * PR;
        if (show) {
          G.text(c, "TAP!", d.x + 1, headTop(s, d) - 1.6 * PR + 2, 13, "rgba(0,0,0,0.6)");
          G.text(c, "TAP!", d.x, headTop(s, d) - 1.6 * PR, 13, "#ffd23f");
        }
      }
      c.restore();
      G.hud(c, "DAWGS ".concat(s.ds), "TO ".concat(TO), "".concat(s.cs, " CATS"));
      if (s.ban) G.banner(c, s.ban.txt, s.ban.col, H * 0.3);
      if (s.phase === "serveD") pill(G, c, "TAP TO SERVE", H - 34);else G.hint(c, "DRAG TO RUN · TAP TO HIT", 5);
    }
  });
  function pill(G, c, msg, yy) {
    c.save();
    var sz = Math.max(10, Math.min(12, G.W / 34));
    c.font = "".concat(sz, "px 'Press Start 2P', ui-monospace, monospace");
    var w = c.measureText(msg).width + 28;
    c.globalAlpha = 0.75 + 0.25 * Math.sin(G.s.clock * 6);
    c.fillStyle = "rgba(0,0,0,0.6)";
    c.beginPath();
    if (c.roundRect) c.roundRect(G.W / 2 - w / 2, yy - 15, w, 30, 15);else c.rect(G.W / 2 - w / 2, yy - 15, w, 30);
    c.fill();
    G.text(c, msg, G.W / 2, yy, sz, "#fff");
    c.restore();
  }
  function drawPlayer(G, c, s, p) {
    var PR = s.PR * p.sc,
      x = p.x,
      y = p.y,
      f = p.face,
      dog = p.team === "D";
    var air = clamp((s.gy - y) / (3 * s.PR), 0, 1);
    c.fillStyle = "rgba(0,0,0,0.22)";
    c.beginPath();
    c.ellipse(x, s.gy + 0.1 * s.PR, PR * (1.1 - 0.4 * air), PR * 0.3, 0, 0, 7);
    c.fill();
    c.save();
    c.translate(x, y);
    if (p.lean) c.rotate(p.lean * 0.6);
    c.lineCap = "round";
    c.strokeStyle = p.fur;
    c.lineWidth = PR * 0.42;
    var sw = p.gr ? Math.sin(p.run) * 0.32 * PR : 0,
      tuck = p.gr ? 0 : 0.25 * PR;
    c.beginPath();
    c.moveTo(-0.28 * PR, -0.85 * PR);
    c.lineTo(-0.28 * PR + sw, -0.12 * PR - tuck);
    c.moveTo(0.28 * PR, -0.85 * PR);
    c.lineTo(0.28 * PR - sw, -0.12 * PR - tuck);
    c.stroke();
    c.fillStyle = dog ? "#1d3557" : "#2b2d42";
    c.beginPath();
    c.ellipse(0, -0.95 * PR, 0.62 * PR, 0.32 * PR, 0, 0, 7);
    c.fill();
    c.fillStyle = dog ? "#e63946" : "#7b3fe4";
    c.beginPath();
    c.ellipse(0, -1.45 * PR, 0.72 * PR, 0.62 * PR, 0, 0, 7);
    c.fill();
    G.text(c, dog ? p.kind === "dog" ? "1" : "2" : p.kind === "cat1" ? "9" : "6", 0, -1.32 * PR, 10, "#fff");
    c.strokeStyle = p.fur;
    c.lineWidth = PR * 0.34;
    var sy = -1.75 * PR;
    var ax, ay, bx2, by2;
    if (p.pose === "bump" && p.arm > 0) {
      ax = bx2 = f * 0.85 * PR;
      ay = by2 = -1.15 * PR;
    } else if (p.pose === "set" && p.arm > 0) {
      ax = f * 0.15 * PR;
      bx2 = f * 0.45 * PR;
      ay = by2 = -3.3 * PR;
    } else if (p.pose === "spike" && p.arm > 0) {
      var k = p.arm / 0.3;
      ax = f * (0.2 + 0.8 * (1 - k)) * PR;
      ay = -1.6 * PR - 1.8 * k * PR;
      bx2 = -f * 0.6 * PR;
      by2 = -1.2 * PR;
    } else if (p.pose === "ready" || !p.gr) {
      ax = -f * 0.25 * PR;
      ay = -3.4 * PR;
      bx2 = f * 0.5 * PR;
      by2 = -2.6 * PR;
    } else {
      ax = 0.75 * PR;
      ay = -0.95 * PR;
      bx2 = -0.75 * PR;
      by2 = -0.95 * PR;
    }
    c.beginPath();
    c.moveTo(0.4 * PR * Math.sign(ax || 1), sy);
    c.lineTo(ax, ay);
    c.moveTo(0.4 * PR * Math.sign(bx2 || -1), sy);
    c.lineTo(bx2, by2);
    c.stroke();
    var hy = -2.25 * PR;
    if (p.kind === "dog") G.img(c, s.mood, 0, hy, PR * 2.3);else if (p.kind === "pup") G.emoji(c, "🐶", 0, hy, PR * 1.9);else {
      c.save();
      c.scale(-1, 1);
      G.emoji(c, p.kind === "cat1" ? "🐱" : "😼", 0, hy, PR * 1.9);
      c.restore();
    }
    c.restore();
  }
})();