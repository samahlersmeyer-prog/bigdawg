// ---------- Dawg Open (behind-the-baseline tennis vs the cat) ----------
// The dawg auto-runs to the ball; you only time and aim. Tap to swing: early = cross-court, late = down the line,
// on time = deep and hard. Swipe left/right to aim, swipe up to lob. Serve: tap to toss, tap again at the top.
// Real game scoring (15/30/40/deuce/ad), one short set: first to 4 games. The cat gets sharper every game.
// Score = points won x10 + games won x100 + 500 for taking the set (cap 9999).
(function () {
  const GR = 1.6, NETH = 0.05, WIN = 0.19, PERF = 0.06, TOSSV = 1.15, BNC = 0.66, SET = 4;
  const ME_V = -0.05, CAT_V = 1.06, ME_SPD = 0.92;
  let PX = 0, PY = 0, PS = 1;           // projection scratch (no per-frame allocations)

  function geo(G) {
    const s = G.s, W = G.W, H = G.H;
    s.yBot = H * 0.79; s.yTop = Math.max(64, H * 0.2);
    s.K = (s.yBot - s.yTop) / (1 - 1 / 1.9); s.hy = s.yBot - s.K;
    s.hw = Math.min(W * 0.33, H * 0.31); s.Z0 = H * 0.55;
  }
  function P(s, u, v, z) {
    PS = 1 / (1 + 0.9 * v);
    PX = s.W2 + u * s.hw * PS; PY = s.hy + s.K * PS - z * s.Z0 * PS;
  }

  function lvl(s) { return s.games[0] + s.games[1]; }
  function catParams(s) {
    const l = lvl(s);
    return { spd: 0.76 + 0.07 * l, reach: 0.22 + 0.015 * l, react: Math.max(0.06, 0.2 - 0.02 * l),
      err: Math.max(0.035, 0.12 - 0.014 * l), T: Math.max(0.8, 1.0 - 0.035 * l), wide: Math.min(0.97, 0.75 + 0.04 * l) };
  }
  function total(s) { return Math.min(9999, s.won * 10 + s.games[0] * 100 + (s.setWon ? 500 : 0)); }

  function launch(b, tu, tv, T, clear) {
    for (let i = 0; i < 30; i++) {
      b.vu = (tu - b.u) / T; b.vv = (tv - b.v) / T; b.vz = (-b.z + 0.5 * GR * T * T) / T;
      if (!clear) return;
      const tn = (0.5 - b.v) / b.vv;
      if (!(tn > 0 && tn < T)) return;
      if (b.z + b.vz * tn - 0.5 * GR * tn * tn > NETH + 0.035) return;
      T += 0.07;
    }
  }
  function launchNet(b, tu, tv, T) {            // a shot that clips the tape and dies
    b.vu = (tu - b.u) / T; b.vv = (tv - b.v) / T;
    const tn = (0.5 - b.v) / b.vv;
    b.vz = (0.02 - b.z + 0.5 * GR * tn * tn) / tn;
  }

  // where (and when) the receiver can strike the ball after its first bounce
  function predict(s, recvMe) {
    const b = s.ball; let u = b.u, v = b.v, z = b.z, vu = b.vu, vv = b.vv, vz = b.vz, bc = 0, t = 0;
    const dt = 1 / 120;
    while (t < 4) {
      t += dt; u += vu * dt; v += vv * dt; z += vz * dt; vz -= GR * dt;
      if (z <= 0 && vz < 0) { z = 0; bc++; if (bc >= 2) break; vz = -vz * BNC; }
      if (bc === 1) {
        if (recvMe ? v <= ME_V : v >= CAT_V) break;
        if (vz < 0 && z < 0.08) break;
        if (Math.abs(u) > 1.28) break;
      }
    }
    s.hit.t = s.clock + t; s.hit.u = u; s.hit.v = v; s.hit.z = Math.max(0, z);
  }

  function say(s, a, b, t) { s.call.a = a; s.call.b = b || ""; s.call.t = t || 1.5; }
  function pop(s, txt, col) { s.pops.push({ txt, c: col, t: 0.8 }); }

  function scoreLine(s) {
    const a = s.pts[s.server], r = s.pts[1 - s.server], N = ["0", "15", "30", "40"];
    if (a >= 3 && r >= 3) {
      if (a === r) return "DEUCE";
      const lead = s.pts[0] > s.pts[1] ? 0 : 1;
      return "AD " + (lead === 0 ? "DAWG" : "CAT");
    }
    if (a === r) return (a === 0 ? "LOVE" : N[a]) + "-ALL";
    return N[a].replace(/^0$/, "LOVE") + "-" + N[r].replace(/^0$/, "LOVE");
  }
  function ptName(s, i) {
    const a = s.pts[i], o = s.pts[1 - i];
    if (a >= 3 && o >= 3) return a > o ? "AD" : "40";
    return ["0", "15", "30", "40"][Math.min(3, a)];
  }

  function award(G, w, why) {
    const s = G.s;
    s.phase = "dead"; s.deadT = 1.05; s.second = false; s.lastW = w;
    s.pts[w]++; if (w === 0) s.won++;
    if (w === 0) G.sfx("pop"); else G.buzz();
    const p = s.pts[w], o = s.pts[1 - w];
    if (p >= 4 && p - o >= 2) {
      s.games[w]++; s.pts[0] = s.pts[1] = 0; s.server = 1 - s.server; s.deadT = 1.9;
      if (s.games[w] >= SET) {
        s.done = true; s.setWon = w === 0; s.deadT = 2.4;
        say(s, why, w === 0 ? "GAME, SET, DAWG!" : "GAME, SET, CAT", 3);
        G.sfx(w === 0 ? "win" : "lose");
        return;
      }
      say(s, why, (w === 0 ? "GAME DAWG " : "GAME CAT ") + s.games[0] + "-" + s.games[1], 2.1);
      if (w === 0) G.sfx("win");
      return;
    }
    say(s, why, scoreLine(s));
  }
  function fault(G, why) {
    const s = G.s;
    if (s.second) { award(G, 1 - s.server, "DOUBLE FAULT"); return; }
    s.second = true; s.phase = "dead"; s.deadT = 1.1; say(s, why, "FAULT", 1.1); G.buzz();
  }

  function startPoint(G) {
    const s = G.s, b = s.ball, deuce = (s.pts[0] + s.pts[1]) % 2 === 0;
    s.me.v = ME_V; s.cat.v = CAT_V; s.me.swing = 0; s.cat.swing = 0;
    s.toss = 0; s.cpuDone = false; s.myDone = false; s.hit.t = -9;
    b.vu = b.vv = b.vz = 0; b.b = 0; b.serve = true; b.live = false;
    if (s.server === 0) {
      s.me.u = deuce ? 0.3 : -0.3; s.cat.u = deuce ? -0.45 : 0.45;
      s.box.u0 = deuce ? -1 : 0; s.box.u1 = deuce ? 0 : 1; s.box.v0 = 0.5; s.box.v1 = 0.77;
      s.phase = "serve";
      b.u = s.me.u + 0.08; b.v = ME_V; b.z = 0.12; b.from = 0;
    } else {
      s.cat.u = deuce ? -0.3 : 0.3; s.me.u = deuce ? 0.45 : -0.45;
      s.box.u0 = deuce ? 0 : -1; s.box.u1 = deuce ? 1 : 0; s.box.v0 = 0.23; s.box.v1 = 0.5;
      s.phase = "cpuserve"; s.srvT = 0.95;
      b.u = s.cat.u - 0.08; b.v = CAT_V; b.z = 0.12; b.from = 1;
    }
  }

  function afterHit(s, from) {
    const b = s.ball; b.from = from; b.b = 0; b.serve = false; b.live = true;
    s.cpuDone = false; s.myDone = false;
    predict(s, from === 1);
    s.react = from === 0 ? catParams(s).react : 0;
  }

  function myServe(G) {
    const s = G.s, b = s.ball, q = Math.abs(b.vz) / TOSSV, bx = s.box, side = bx.u0 < 0 ? -1 : 1;
    const lim = s.second ? 0.72 : 0.6;
    s.me.swing = 0.28; s.toss = 0; b.serve = true; b.from = 0; b.b = 0; b.live = true; s.phase = "rally";
    if (q < 0.2) {           // big serve
      const wide = Math.random() < 0.5;
      launch(b, side * (wide ? 0.8 : 0.14), 0.71, 0.72, true); pop(s, "BOOM!", "#ffd23f");
    } else if (q < lim) {
      launch(b, side * (0.35 + Math.random() * 0.3), 0.66, 0.95, true);
    } else if (Math.random() < 0.5) launchNet(b, side * 0.5, 0.6, 0.8);
    else launch(b, side * 0.5, 0.86 + Math.random() * 0.06, 0.8, true);
    s.cpuDone = false; predict(s, false); s.react = catParams(s).react + 0.08;
    G.sfx("pop");
  }
  function cpuServe(G) {
    const s = G.s, b = s.ball, cp = catParams(s), side = s.box.u0 < 0 ? -1 : 1;
    s.cat.swing = 0.28; s.toss = 0; b.serve = true; b.from = 1; b.b = 0; b.live = true;
    const fp = s.second ? 0.04 : Math.max(0.06, 0.15 - 0.012 * lvl(s));
    if (Math.random() < fp) {
      if (Math.random() < 0.5) launchNet(b, side * 0.5, 0.4, 0.85); else launch(b, side * 0.5, 0.12, 0.85, true);
    } else launch(b, side * (0.15 + Math.random() * 0.7), 0.27 + Math.random() * 0.15, Math.max(0.8, 1.0 - 0.025 * lvl(s)), true);
    s.myDone = false; predict(s, true);
  }

  function myShot(G, aim, off) {
    const s = G.s, b = s.ball, frac = Math.min(1, Math.abs(off) / WIN), perfect = Math.abs(off) < PERF;
    const away = s.cat.u > 0 ? -1 : 1;
    let tu, tv, T = 1.0;
    if (aim && aim.dy < 0) { tu = (Math.random() - 0.5) * 0.6; tv = 0.87 + Math.random() * 0.06; T = 1.75; pop(s, "LOB!", "#8fd8ff"); }
    else if (aim && aim.dx) { tu = aim.dx * (0.7 + 0.28 * frac + Math.random() * 0.05); tv = 0.78 + Math.random() * 0.12; T = perfect ? 0.9 : 1.0; pop(s, aim.dx < 0 ? "<<" : ">>", "#ffd23f"); }
    else if (aim) { tu = away * 0.3; tv = 0.88; T = 0.95; }
    else if (perfect) { tu = away * (0.4 + Math.random() * 0.25); tv = 0.87 + Math.random() * 0.06; T = 0.84; pop(s, "PERFECT!", "#7dff8a"); }
    else {
      const cross = s.me.u >= 0 ? -1 : 1, dir = off < 0 ? cross : -cross;
      tu = dir * (0.38 + 0.66 * frac) + (Math.random() - 0.5) * 0.08; tv = 0.74 + Math.random() * 0.14;
      pop(s, off < 0 ? "EARLY" : "LATE", "#ffffff");
    }
    if (frac > 0.55) { tv += Math.random() * 0.24 * frac; tu *= 1 + Math.random() * 0.22 * frac; }
    launch(b, tu, tv, T, true);
    afterHit(s, 0); G.sfx("pop");
  }
  function cpuShot(G, dist) {
    const s = G.s, b = s.ball, cp = catParams(s), l = lvl(s);
    let err = cp.err + (dist > cp.reach * 0.6 ? 0.12 : 0) + (s.ballPace > 1.25 ? 0.08 : 0);
    s.cat.swing = 0.28;
    if (Math.random() < err) {
      const r = Math.random(), sg = Math.random() < 0.5 ? -1 : 1;
      if (r < 0.45) launchNet(b, sg * 0.4, 0.3, 0.9);
      else if (r < 0.75) launch(b, sg * (1.07 + Math.random() * 0.15), 0.2, 1.0, true);
      else launch(b, sg * 0.4, -0.05 - Math.random() * 0.1, 1.0, true);
    } else if (Math.random() < 0.08) launch(b, (Math.random() - 0.5) * 0.8, 0.1, 1.8, true);
    else {
      const away = s.me.u > 0 ? -1 : 1, side = Math.random() < 0.55 + 0.04 * l ? away : -away;
      if (Math.random() < 0.1 + 0.02 * l) launch(b, side * (0.82 + Math.random() * 0.16), 0.27 + Math.random() * 0.1, cp.T * 0.95, true);   // sharp angle
      else launch(b, side * (0.25 + Math.random() * (cp.wide - 0.25)), 0.06 + Math.random() * 0.22, cp.T, true);
    }
    afterHit(s, 1); G.sfx("pop");
  }

  function swing(G, aim) {
    const s = G.s, b = s.ball;
    if (s.phase === "serve") {
      if (!s.toss) { s.toss = 1; b.vz = TOSSV; b.z = 0.12; return; }
      myServe(G); return;
    }
    if (s.phase !== "rally" || s.swingCd > 0) return;
    s.me.swing = 0.28; s.swingCd = 0.3;
    if (b.from !== 1 || s.myDone) return;
    const off = s.clock - s.hit.t;
    if (Math.abs(off) <= WIN && Math.hypot(s.me.u - b.u, (s.me.v - b.v) * 1.4) < 0.3) myShot(G, aim, off);
    else if (off < -WIN) pop(s, "TOO EARLY", "#ff8a8a");
  }

  function moveTo(p, tu, tv, su, sv, dt) {
    const du = tu - p.u, dv = tv - p.v;
    p.u += Math.sign(du) * Math.min(Math.abs(du), su * dt);
    p.v += Math.sign(dv) * Math.min(Math.abs(dv), sv * dt);
  }

  defGame({
    key: "tennis", name: "Dawg Open", icon: "🎾", max: 9999, cat: "sports",
    blurb: "Tennis vs the cat. Time your swings.",
    how: "Your dawg runs to the ball by himself. Tap to swing as the ball reaches the ring: early = cross-court, late = down the line, right on time = a deep rocket. Swipe left/right to aim, swipe up to lob. Serve: tap to toss, tap again at the top. Real tennis scoring, first to 4 games takes the set.",
    reset(G) {
      G.s = { clock: 0, games: [0, 0], pts: [0, 0], won: 0, server: 0, second: false, done: false, setWon: false,
        me: { u: 0.3, v: ME_V, swing: 0 }, cat: { u: -0.45, v: CAT_V, swing: 0 },
        ball: { u: 0, v: 0, z: 0, vu: 0, vv: 0, vz: 0, b: 0, from: 0, serve: true, live: false },
        hit: { t: -9, u: 0, v: 0, z: 0 }, box: { u0: -1, u1: 0, v0: 0.5, v1: 0.77 },
        call: { a: "", b: "", t: 0 }, pops: [], phase: "serve", deadT: 0, srvT: 0, toss: 0, swingCd: 0,
        cpuDone: false, myDone: false, react: 0, ballPace: 1, W2: G.W / 2 };
      geo(G); startPoint(G);
      say(G.s, "DAWG OPEN", "FIRST TO 4 GAMES", 2);
    },
    update(G, dt) {
      const s = G.s, b = s.ball, me = s.me, cat = s.cat;
      if (s.phase === "rally") dt *= 1.15;   // play runs a touch faster than real time
      s.clock += dt; s.call.t -= dt; s.swingCd -= dt;
      me.swing = Math.max(0, me.swing - dt); cat.swing = Math.max(0, cat.swing - dt);
      for (let i = s.pops.length - 1; i >= 0; i--) { s.pops[i].t -= dt; if (s.pops[i].t <= 0) s.pops.splice(i, 1); }

      if (s.phase === "dead") {
        b.u += b.vu * dt; b.v += b.vv * dt; b.z += b.vz * dt; b.vz -= GR * dt;
        if (b.z <= 0 && b.vz < 0) { b.z = 0; b.vz = -b.vz * 0.5; b.vu *= 0.7; b.vv *= 0.7; if (b.vz < 0.05) b.vz = 0; }
        moveTo(me, me.u * 0.98, ME_V, 0.6, 0.6, dt); moveTo(cat, cat.u * 0.98, CAT_V, 0.5, 0.5, dt);
        s.deadT -= dt;
        if (s.deadT <= 0) {
          if (s.done) { G.over(total(s), s.setWon ? "Game, set, Dawg!" : "The cat takes the set."); return; }
          startPoint(G);
        }
        return;
      }
      if (s.phase === "serve") {
        if (s.toss) {
          b.z += b.vz * dt; b.vz -= GR * dt;
          if (b.z < 0.1 && b.vz < 0) { s.toss = 0; b.z = 0.12; b.vz = 0; pop(s, "TOSS AGAIN", "#ffffff"); }
        } else { b.u = me.u + 0.08; b.v = ME_V; b.z = 0.12 + Math.sin(s.clock * 6) * 0.01; }
        return;
      }
      if (s.phase === "cpuserve") {
        s.srvT -= dt;
        if (!s.toss && s.srvT < 0.72) { s.toss = 1; b.vz = TOSSV; }
        if (s.toss) { b.z += b.vz * dt; b.vz -= GR * dt; }
        if (s.srvT <= 0) { cpuServe(G); s.phase = "rally"; }
        return;
      }
      // ---- rally ----
      const pv = b.v;
      b.u += b.vu * dt; b.v += b.vv * dt; b.z += b.vz * dt; b.vz -= GR * dt;
      s.ballPace = Math.abs(b.vv);
      if ((pv - 0.5) * (b.v - 0.5) <= 0 && pv !== b.v && b.z < NETH) {
        b.v = 0.5 + (pv > 0.5 ? 0.012 : -0.012); b.vv *= -0.12; b.vu *= 0.2; b.vz = Math.min(b.vz, 0);
        if (b.serve) fault(G, "NET"); else award(G, 1 - b.from, "NET");
        return;
      }
      if (b.z <= 0 && b.vz < 0) {
        b.z = 0; b.b++;
        if (b.b === 1) {
          let ok;
          if (b.serve) ok = b.u >= s.box.u0 - 0.02 && b.u <= s.box.u1 + 0.02 && b.v >= s.box.v0 - 0.02 && b.v <= s.box.v1 + 0.02;
          else ok = Math.abs(b.u) <= 1.02 && (b.from === 0 ? b.v >= 0.5 && b.v <= 1.02 : b.v <= 0.5 && b.v >= -0.02);
          if (!ok) { b.vz = -b.vz * BNC; if (b.serve) fault(G, "OUT!"); else award(G, 1 - b.from, "OUT!"); return; }
          b.vz = -b.vz * BNC;
        } else { b.vz = -b.vz * 0.5; award(G, b.from, b.serve ? "ACE!" : "WINNER!"); return; }
      }
      // receivers
      const cp = catParams(s);
      if (b.from === 1) {
        moveTo(me, s.hit.u, s.hit.v, ME_SPD, 1.2, dt);
        moveTo(cat, cat.u * 0.4, CAT_V, cp.spd * 0.7, 0.6, dt);
        if (!s.myDone && s.clock > s.hit.t + WIN + 0.04) { s.myDone = true; award(G, 1, b.serve ? "ACE!" : "WINNER!"); return; }
      } else {
        moveTo(me, me.u * 0.5, ME_V, 1.2, 0.8, dt);
        s.react -= dt;
        if (s.react <= 0) moveTo(cat, s.hit.u, s.hit.v, cp.spd, cp.spd * 0.7, dt);
        if (!s.cpuDone && s.clock >= s.hit.t) {
          s.cpuDone = true;
          const dist = Math.hypot(cat.u - b.u, cat.v - b.v);
          if (dist <= cp.reach) cpuShot(G, dist); else { cat.swing = 0.28; s.lateT = s.clock; }
        }
        if (s.cpuDone && b.from === 0 && s.clock > s.hit.t + 0.25) { award(G, 0, b.serve ? "ACE!" : "WINNER!"); return; }
      }
    },
    tap(G) { swing(G, null); },
    swipe(G, dx, dy) { swing(G, { dx, dy }); },
    onKey(G, k, d) {
      if (!d) return;
      if (k === " " || k === "Enter") swing(G, null);
      else if (k === "ArrowLeft" || k === "a") swing(G, { dx: -1, dy: 0 });
      else if (k === "ArrowRight" || k === "d") swing(G, { dx: 1, dy: 0 });
      else if (k === "ArrowUp" || k === "w") swing(G, { dx: 0, dy: -1 });
      else if (k === "ArrowDown" || k === "s") swing(G, { dx: 0, dy: 1 });
    },
    draw(G, c) {
      const s = G.s, W = G.W, H = G.H, dark = G.dark();
      if (!s.me) return;
      s.W2 = W / 2; geo(G);
      // stands + backdrop
      c.fillStyle = dark ? "#16213a" : "#5aa9e6"; c.fillRect(0, 0, W, H);
      const standB = s.yTop - 26;
      c.fillStyle = dark ? "#26304d" : "#3b5f8a"; c.fillRect(0, 30, W, Math.max(0, standB - 30));
      const crowd = dark ? ["#5b6890", "#7d5a6a", "#6c7f5a"] : ["#ffd23f", "#ff7a7a", "#ffffff", "#9fe07a"];
      for (let y = 38, r = 0; y < standB - 4; y += 10, r++) for (let x = (r % 2) * 6 + 3; x < W; x += 12) {
        c.fillStyle = crowd[(x * 7 + y * 3 + r) % crowd.length]; c.fillRect(x, y + (Math.sin(G.t * 3 + x) > 0.85 ? -2 : 0), 6, 6);
      }
      c.fillStyle = dark ? "#1e5a3c" : "#2f9a5a"; c.fillRect(0, standB, W, H - standB);
      c.fillStyle = dark ? "#123a28" : "#1f6e41"; c.fillRect(0, standB, W, 4);
      // court surface
      const quad = (u0, v0, u1, v1, col) => {
        c.fillStyle = col; c.beginPath();
        P(s, u0, v0, 0); c.moveTo(PX, PY); P(s, u1, v0, 0); c.lineTo(PX, PY);
        P(s, u1, v1, 0); c.lineTo(PX, PY); P(s, u0, v1, 0); c.lineTo(PX, PY); c.closePath(); c.fill();
      };
      quad(-1.55, -0.32, 1.55, 1.2, dark ? "#24456e" : "#3a6fb5");
      quad(-1.27, 0, 1.27, 1, dark ? "#2d5f99" : "#4a8ee0");
      c.strokeStyle = dark ? "#d8e2f0" : "#ffffff"; c.lineWidth = 2;
      const line = (u0, v0, u1, v1) => { c.beginPath(); P(s, u0, v0, 0); c.moveTo(PX, PY); P(s, u1, v1, 0); c.lineTo(PX, PY); c.stroke(); };
      line(-1.27, 0, 1.27, 0); line(-1.27, 1, 1.27, 1);
      line(-1.27, 0, -1.27, 1); line(1.27, 0, 1.27, 1); line(-1, 0, -1, 1); line(1, 0, 1, 1);
      line(-1, 0.23, 1, 0.23); line(-1, 0.77, 1, 0.77); line(0, 0.23, 0, 0.77);
      line(0, 0, 0, 0.02); line(0, 1, 0, 0.98);
      // serve target box highlight
      if (s.phase === "serve" || s.phase === "cpuserve") quad(s.box.u0, s.box.v0, s.box.u1, s.box.v1, "rgba(255,230,80,0.18)");
      const b = s.ball, me = s.me, cat = s.cat;
      // shadows
      c.fillStyle = "rgba(0,0,0,0.28)";
      P(s, cat.u, cat.v, 0); c.beginPath(); c.ellipse(PX, PY, 22 * PS, 7 * PS, 0, 0, 7); c.fill();
      P(s, me.u, me.v, 0); c.beginPath(); c.ellipse(PX, PY, 26 * PS, 8 * PS, 0, 0, 7); c.fill();
      P(s, b.u, b.v, 0); c.beginPath(); c.ellipse(PX, PY, 7 * PS, 3 * PS, 0, 0, 7); c.fill();
      // timing ring at the predicted contact point
      if (s.phase === "rally" && b.from === 1 && !s.myDone) {
        const dtc = s.hit.t - s.clock;
        if (dtc < 0.9 && dtc > -WIN) {
          P(s, s.hit.u, s.hit.v, s.hit.z);
          const col = Math.abs(dtc) < PERF ? "#7dff8a" : Math.abs(dtc) < WIN ? "#ffd23f" : "rgba(255,255,255,0.8)";
          c.lineWidth = 3; c.strokeStyle = col;
          c.beginPath(); c.arc(PX, PY, 13, 0, 7); c.stroke();
          if (dtc > 0) { c.lineWidth = 2; c.beginPath(); c.arc(PX, PY, 13 + 70 * dtc, 0, 7); c.stroke(); }
        }
      }
      const drawBall = () => {
        P(s, b.u, b.v, b.z); const r = 3 + 4.5 * PS;
        c.fillStyle = "#d9f23a"; c.strokeStyle = "#5a6a10"; c.lineWidth = 1.5;
        c.beginPath(); c.arc(PX, PY, r, 0, 7); c.fill(); c.stroke();
        c.strokeStyle = "#ffffff"; c.lineWidth = 1; c.beginPath(); c.arc(PX - r * 0.6, PY, r * 0.8, -0.9, 0.9); c.stroke();
      };
      const racket = (x, y, len, ang, frame) => {
        c.save(); c.translate(x, y); c.rotate(ang);
        c.strokeStyle = "#3a2a1a"; c.lineWidth = Math.max(2, len * 0.09);
        c.beginPath(); c.moveTo(0, 0); c.lineTo(0, -len * 0.45); c.stroke();
        c.fillStyle = "rgba(255,255,255,0.35)"; c.strokeStyle = frame; c.lineWidth = Math.max(2, len * 0.08);
        c.beginPath(); c.ellipse(0, -len * 0.72, len * 0.22, len * 0.29, 0, 0, 7); c.fill(); c.stroke();
        c.restore();
      };
      const swAng = sw => sw > 0 ? 1.5 - (1 - sw / 0.28) * 3.2 : 0.55;
      const drawCat = () => {
        P(s, cat.u, cat.v, 0); const sz = 74 * PS;
        racket(PX - sz * 0.32, PY - sz * 0.42, sz * 0.75, -swAng(cat.swing), "#e04a8a");
        c.fillStyle = "#000"; G.emoji(c, "🐈", PX, PY - sz * 0.38, sz);
      };
      const drawMe = () => {
        P(s, me.u, me.v, 0); const sz = 58 * PS, fx = PX, fy = PY;
        c.fillStyle = "#3b2a20"; c.fillRect(fx - sz * 0.2, fy - sz * 0.22, sz * 0.13, sz * 0.22); c.fillRect(fx + sz * 0.07, fy - sz * 0.22, sz * 0.13, sz * 0.22);
        c.fillStyle = "#ffffff"; c.fillRect(fx - sz * 0.23, fy - sz * 0.06, sz * 0.18, sz * 0.07); c.fillRect(fx + sz * 0.05, fy - sz * 0.06, sz * 0.18, sz * 0.07);
        c.fillStyle = "#e8423f"; c.fillRect(fx - sz * 0.3, fy - sz * 0.62, sz * 0.6, sz * 0.42);
        c.fillStyle = "#ffffff"; c.fillRect(fx - sz * 0.3, fy - sz * 0.46, sz * 0.6, sz * 0.06);
        racket(fx + sz * 0.32, fy - sz * 0.42, sz * 0.95, swAng(me.swing), "#2aa1e0");
        G.img(c, s.phase === "dead" && s.lastW === 1 ? ":dawgsweat:" : ":dawgW:", fx, fy - sz * 0.95, sz);
      };
      const drawNet = () => {
        P(s, -1.42, 0.5, 0); const x0 = PX, y0 = PY; P(s, 1.42, 0.5, 0); const x1 = PX;
        P(s, -1.42, 0.5, NETH); const yt = PY;
        c.fillStyle = "rgba(20,20,30,0.55)"; c.fillRect(x0, yt, x1 - x0, y0 - yt);
        c.strokeStyle = "rgba(255,255,255,0.25)"; c.lineWidth = 1;
        for (let x = x0; x < x1; x += 6) { c.beginPath(); c.moveTo(x, yt); c.lineTo(x, y0); c.stroke(); }
        c.fillStyle = "#ffffff"; c.fillRect(x0, yt - 2, x1 - x0, 3);
        c.fillStyle = dark ? "#9aa" : "#334"; c.fillRect(x0 - 3, yt - 3, 4, y0 - yt + 3); c.fillRect(x1 - 1, yt - 3, 4, y0 - yt + 3);
      };
      if (b.v > cat.v) drawBall();
      drawCat();
      if (b.v > 0.5 && b.v <= cat.v) drawBall();
      drawNet();
      if (b.v <= 0.5 && b.v > me.v) drawBall();
      drawMe();
      if (b.v <= me.v) drawBall();
      // pops
      for (let i = 0; i < s.pops.length; i++) {
        const p = s.pops[i]; P(s, me.u, me.v, 0);
        G.text(c, p.txt, Math.max(50, Math.min(W - 50, PX)), PY - 90 - (0.8 - p.t) * 40 - i * 14, 10, p.c);
      }
      // call: big banner + a sub-line pill
      if (s.call.t > 0 && s.call.a) {
        const y = H * 0.42, bad = s.call.a === "OUT!" || s.call.a === "NET" || s.call.a === "DOUBLE FAULT";
        const big = s.call.a === "ACE!" || s.call.a === "WINNER!" || s.call.a === "DAWG OPEN";
        G.banner(c, s.call.a, bad ? "#ff6b6b" : big ? "#ffd23f" : "#ffffff", y, Math.min(big ? 30 : 24, W / 13, (W * 0.88) / s.call.a.length));
        if (s.call.b) {
          const sz = Math.max(10, Math.min(12, W / 30)); c.font = `${sz}px 'Press Start 2P', ui-monospace, monospace`;
          const w = c.measureText(s.call.b).width + 28;
          c.fillStyle = "rgba(0,0,0,0.62)"; c.beginPath(); if (c.roundRect) c.roundRect(W / 2 - w / 2, y + 24, w, 28, 14); else c.rect(W / 2 - w / 2, y + 24, w, 28); c.fill();
          G.text(c, s.call.b, W / 2, y + 38, sz, s.call.b.indexOf("DAWG") >= 0 ? "#ffd23f" : s.call.b.indexOf("CAT") >= 0 ? "#ffb0d0" : "#ffffff");
        }
      }
      // HUD: games on the sides, the point score in the middle, a slim info row underneath
      const pa = s.pts[0], pb = s.pts[1];
      const pts = pa >= 3 && pb >= 3 ? (pa === pb ? "DEUCE" : pa > pb ? "AD DAWG" : "AD CAT") : `${ptName(s, 0)}-${ptName(s, 1)}`;
      const top = G.hud(c, `DAWG ${s.games[0]}`, pts, `CAT ${s.games[1]}`);
      c.fillStyle = "rgba(10,10,20,0.62)"; c.fillRect(0, top, W, 22);
      G.text(c, `SCORE ${total(s)}`, 10, top + 11, 10, "#ffffff", "left");
      G.text(c, `${s.server === 0 ? "DAWG" : "CAT"} SERVES${s.second ? " (2ND)" : ""}`, W - 10, top + 11, 10, s.server === 0 ? "#ffd23f" : "#ffb0d0", "right");
      // how-to pills (contextual, so they stay up while they matter)
      let hint = "";
      if (s.phase === "serve") hint = s.toss ? "TAP AT THE TOP!" : (s.second ? "2ND SERVE: TAP TO TOSS" : "TAP TO TOSS");
      else if (lvl(s) < 2 && s.phase === "rally" && b.from === 1) hint = "TAP IN THE RING · SWIPE AIMS";
      if (hint) G.hint(c, hint, G.t + 1, H - 30);
    }
  });
})();
