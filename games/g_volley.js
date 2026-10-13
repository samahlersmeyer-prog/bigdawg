// ---------- Beach Dawgs (2-on-2 side-view beach volleyball) ----------
// You are the bulldog (left) with a CPU pup setter. Two cats on the right.
// Hold + drag anywhere to run (the dawg follows your finger). Tap to play the ball: the game picks
// bump / spike. Ball comes over -> stand under the big shadow and tap as it reaches your head (BUMP to the pup).
// Pup sets it up near the net -> tap to jump and SPIKE (best at the top of your jump).
// Rally scoring to 11, winner of a point serves. Tap to serve.
// Score = your points x100 + 500 for a win + 25 per spike kill (cap 9999).
(function () {
  const TO = 11;
  const lerp = (a, b, t) => a + (b - a) * t;
  const clamp = (v, a, b) => v < a ? a : v > b ? b : v;
  const rnd = (a, b) => a + Math.random() * (b - a);

  function geo(G) {
    const s = G.s, W = G.W, H = G.H;
    s.PR = Math.max(15, Math.min(W * 0.058, H * 0.042));
    s.BR = s.PR * 0.62;
    s.gy = H * 0.8;
    s.nx = W / 2; s.half = W / 2;
    s.netTop = s.gy - 4.6 * s.PR;
    s.g = H * 1.25 / (0.85 * 0.85);      // ball gravity (flight times are scaled by 0.85 in launch)
    s.gP = H * 2.4;                       // player gravity
    s.JV = Math.sqrt(2 * s.gP * 3.3 * s.PR);
    s.tApex = s.JV / s.gP;
    s.SPD = W * 0.72;
    s.atkY = s.gy - 6.3 * s.PR;           // where sets come down to (paw height at the top of a jump)
    s.dots = [];
    for (let i = 0; i < 70; i++) s.dots.push([Math.random() * W, s.gy - 1.2 * s.PR + Math.random() * (H - s.gy + 1.2 * s.PR)]);
  }

  function mk(s, team, kind, x) {
    return { team, kind, x, y: s.gy, vx: 0, vy: 0, gr: true, tx: x, face: team === "D" ? 1 : -1, sc: kind === "pup" ? 0.88 : 1,
      run: 0, arm: 0, pose: "idle", swung: false, jumped: false, willMiss: false, cd: 0, lean: 0,
      fur: kind === "dog" ? "#d9a066" : kind === "pup" ? "#f0c890" : kind === "cat1" ? "#f2a33a" : "#a7adb8" };
  }
  const lvl = s => Math.min(1, (s.ds + s.cs) / 14);
  const setSpot = (s, team) => team === "D" ? s.nx - 0.24 * s.half : s.nx + 0.24 * s.half;
  const courtLo = (s, team) => team === "D" ? s.PR : s.nx + 1.0 * s.PR;
  const courtHi = (s, team) => team === "D" ? s.nx - 1.0 * s.PR : s.nx * 2 - s.PR;
  const headTop = (s, p) => p.y - 3.0 * s.PR * p.sc;
  const other = t => t === "D" ? "C" : "D";

  function timeToY(s, yT) {   // time until the ball (falling) reaches height yT, or null
    const b = s.b, disc = b.vy * b.vy - 2 * s.g * (b.y - yT);
    if (disc < 0) return null;
    const t = (-b.vy + Math.sqrt(disc)) / s.g;
    return t >= 0 ? t : null;
  }
  function landX(s) { const t = timeToY(s, s.gy - s.BR); return t == null ? s.b.x : s.b.x + s.b.vx * t; }
  function launch(s, x1, y1, T) { const b = s.b; T *= 0.85; b.vx = (x1 - b.x) / T; b.vy = (y1 - b.y) / T - 0.5 * s.g * T; }
  function clearsNet(s) {
    const b = s.b; if (Math.abs(b.vx) < 1) return false;
    const t = (s.nx - b.x) / b.vx; if (t <= 0) return false;
    return b.y + b.vy * t + 0.5 * s.g * t * t < s.netTop - s.BR * 1.3;
  }

  function puff(s, x, y, n, col) {
    for (let i = 0; i < n; i++) {
      const p = s.parts[s.pi]; s.pi = (s.pi + 1) % s.parts.length;
      p.x = x; p.y = y; p.vx = rnd(-120, 120); p.vy = rnd(-220, -60); p.l = rnd(0.35, 0.7); p.c = col;
    }
  }
  function say(s, txt, x, y, col) { const f = s.floats[s.fi]; s.fi = (s.fi + 1) % s.floats.length; f.txt = txt; f.x = x; f.y = y; f.t = 0.8; f.c = col; }
  function banner(s, txt, col, t) { s.ban = { txt, col, t: t || 1.1 }; }

  function newPoint(G, server) {
    const s = G.s, h = s.half, nx = s.nx;
    s.dog = mk(s, "D", "dog", nx - 0.55 * h); s.pup = mk(s, "D", "pup", setSpot(s, "D"));
    s.c1 = mk(s, "C", "cat1", nx + 0.6 * h); s.c2 = mk(s, "C", "cat2", setSpot(s, "C"));
    s.pl = [s.pup, s.c2, s.c1, s.dog];
    s.server = server; s.plan = null; s.lastAtk = null; s.trN = 0; s.lastQ = 1;
    s.b = { x: 0, y: 0, vx: 0, vy: 0, spin: 0 };
    if (server === "D") { s.dog.x = s.dog.tx = G.W * 0.12; s.phase = "serveD"; s.serveT = 6; }
    else { s.c1.x = s.c1.tx = G.W * 0.88; s.phase = "serveC"; s.serveT = 0.9; }
    holdBall(s);
  }
  function holdBall(s) {
    const p = s.server === "D" ? s.dog : s.c1;
    s.b.x = p.x + p.face * 0.5 * s.PR; s.b.y = p.y - 3.7 * s.PR + Math.sin(s.clock * 5) * 3; s.b.vx = s.b.vy = 0;
  }

  function serve(G) {
    const s = G.s, team = s.server, p = team === "D" ? s.dog : s.c1, opp = other(team), h = s.half;
    const f = rnd(0.35, 0.85), x1 = opp === "C" ? s.nx + f * h : s.nx - f * h;
    let T = 1.3; launch(s, x1, s.gy - s.BR, T);
    while (!clearsNet(s) && T < 2.4) { T += 0.15; launch(s, x1, s.gy - s.BR, T); }
    p.arm = 0.3; p.pose = "spike"; p.vy = -s.JV * 0.5; p.gr = false;
    s.phase = "rally"; s.lastAtk = { team, kind: "serve", q: 0 };
    G.sfx("pop"); setReceive(G, opp);
  }

  // The team `team` now has to deal with a ball coming over the net.
  function setReceive(G, team) {
    const s = G.s;
    if (team === "D") { s.plan = { team, kind: "bump", hitter: s.dog }; s.pup.tx = setSpot(s, "D"); return; }
    const tc = timeToY(s, s.gy - 2.9 * s.PR), xc = clamp(tc == null ? s.b.x : s.b.x + s.b.vx * tc, courtLo(s, "C"), courtHi(s, "C"));
    const r = Math.abs(s.c1.x - xc) <= Math.abs(s.c2.x - xc) ? s.c1 : s.c2, o = r === s.c1 ? s.c2 : s.c1;
    const L = lvl(s), la = s.lastAtk || { kind: "lob", q: 0 };
    const near = Math.min(Math.abs(s.c1.x - xc), Math.abs(s.c2.x - xc)) < 1.6 * s.PR ? 0.3 : 0;   // spiked right at a cat
    const pMiss = la.kind === "spike" ? 1 - clamp(0.26 + 0.38 * L - 0.3 * la.q + near, 0.1, 0.8) : la.kind === "serve" ? 0.06 : 0.04;
    r.willMiss = Math.random() < pMiss; o.willMiss = false; r.jumped = o.jumped = false;
    r.tx = r.willMiss ? xc - Math.sign(xc - r.x || 1) * 1.9 * s.PR : xc + 0.2 * s.PR;
    o.tx = setSpot(s, "C"); s.plan = { team, kind: "bump", hitter: r };
  }

  function hit(G, p, kind, q) {
    const s = G.s, team = p.team, h = s.half;
    p.arm = 0.28; p.pose = kind; s.trN = 0;
    if (kind === "bump") {
      const setter = team === "D" ? s.pup : (p === s.c1 ? s.c2 : s.c1);
      let x1 = setSpot(s, team); if (q < 0.45) x1 += (Math.random() - 0.5) * 0.5 * h;
      x1 = clamp(x1, courtLo(s, team) + s.PR, courtHi(s, team) - s.PR);
      launch(s, x1, s.gy - 2.9 * s.PR * setter.sc, q >= 0.45 ? 1.05 : 0.9);
      setter.tx = x1; s.lastQ = q; s.plan = { team, kind: "set", hitter: setter };
      if (team === "C") p.tx = s.nx + rnd(0.25, 0.42) * h;
      puff(s, p.x, s.gy, 4, "#e9cf8f"); G.sfx("pop");
    } else if (kind === "set") {
      const atk = team === "D" ? s.dog : (p === s.c1 ? s.c2 : s.c1);
      let ax;
      if (team === "D") ax = s.lastQ >= 0.45 ? clamp(s.dog.x + 0.5 * s.PR, s.nx - 0.6 * h, s.nx - 0.14 * h) : s.nx - 0.35 * h;
      else { ax = s.nx + rnd(0.16, 0.4) * h; atk.tx = ax + 0.5 * s.PR; atk.jumped = false; }
      launch(s, ax, s.atkY + (s.lastQ >= 0.45 ? 0 : 0.6 * s.PR), 0.98);
      p.tx = team === "D" ? s.nx - 0.62 * h : s.nx + 0.62 * h;
      s.plan = { team, kind: "atk", hitter: atk }; G.sfx("pop");
    }
  }

  // Third touch: spike if possible, else a lob over the net.
  function attack(G, p, q, forceLob) {
    const s = G.s, team = p.team, opp = other(team), b = s.b, h = s.half, L = lvl(s);
    p.arm = 0.3; p.pose = "spike"; s.trN = 0;
    const lo = courtLo(s, opp) + 0.4 * s.PR, hi = courtHi(s, opp) - 0.4 * s.PR;
    let spike = !forceLob && b.y < s.netTop - 0.2 * s.PR && Math.abs(p.x - s.nx) < 0.78 * h;
    if (team === "C") spike = spike && Math.random() < 0.65 + 0.3 * L;
    else spike = spike && q >= 0.2;
    let ok = false;
    if (spike) {
      // try a spread of landing spots; for each find the fastest flight that clears the net, then pick the one the
      // defence is least likely to reach in time (the CPU sometimes just hits it anywhere)
      const foes = opp === "C" ? [s.c1, s.c2] : [s.dog], fspd = opp === "C" ? lerp(G.W * 0.62, G.W * 0.85, L) : s.SPD;
      const aim = team === "D" ? true : Math.random() < 0.6 + 0.35 * L;
      const T0 = team === "D" ? lerp(0.66, 0.4, q) : lerp(0.52, 0.36, L) * (1.1 - 0.2 * q);
      const bx = b.x, by = b.y; let best = null, bs = 1e9;
      for (const f of [0.18, 0.32, 0.46, 0.6, 0.74, 0.88, 0.96]) {
        const x1 = clamp(opp === "C" ? s.nx + f * h : s.nx - f * h, lo, hi);
        let T = T0, good = false;
        for (; T < 1.15; T += 0.04) { b.x = bx; b.y = by; launch(s, x1, s.gy - s.BR, T); if (clearsNet(s)) { good = true; break; } }
        if (!good) continue;
        let d = 1e9; for (const e of foes) d = Math.min(d, Math.abs(e.x - x1));
        const sc = aim ? T - d / fspd + Math.random() * (team === "D" ? (1 - q) * 0.35 : 0.06) : Math.random();
        if (sc < bs) { bs = sc; best = [x1, T]; }
      }
      b.x = bx; b.y = by;
      if (best) { launch(s, best[0], s.gy - s.BR, best[1]); ok = true; }
    }
    if (ok) {
      s.lastAtk = { team, kind: "spike", q };
      if (team === "D") {
        if (q >= 0.55) { banner(s, "SPIKE!", "#ffd23f", 0.9); s.shake = 0.15; } else say(s, "SPIKE", p.x, p.y - 4 * s.PR, "#fff");
        G.sfx("pop"); G.buzz();
      } else { say(s, "SPIKE!", p.x, p.y - 4 * s.PR, "#e8b4ff"); G.sfx("pop"); }
      puff(s, b.x, b.y, 6, "#fff3c4");
    } else {
      let x1 = opp === "C" ? s.nx + rnd(0.35, 0.85) * h : s.nx - rnd(0.3, 0.85) * h;
      if (opp === "D" && Math.random() < 0.5 + 0.3 * L) x1 = s.dog.x < s.nx - 0.5 * h ? s.nx - rnd(0.2, 0.32) * h : s.nx - rnd(0.82, 0.92) * h;   // cats place it away from the dawg
      let T = 1.1; launch(s, x1, s.gy - s.BR, T);
      while (!clearsNet(s) && T < 2.6) { T += 0.12; launch(s, x1, s.gy - s.BR, T); }
      s.lastAtk = { team, kind: "lob", q: 0 };
      if (team === "D") say(s, "TIP", p.x, p.y - 4 * s.PR, "#fff");
      G.sfx("pop");
    }
    setReceive(G, opp);
  }

  function point(G, winner) {
    const s = G.s, b = s.b;
    s.phase = "dead"; s.deadT = 1.25; s.plan = null; s.winner = winner;
    puff(s, b.x, s.gy, 14, "#e9cf8f");
    b.y = s.gy - s.BR; b.vy = -Math.abs(b.vy) * 0.3; b.vx *= 0.35;
    if (winner === "D") {
      s.ds++;
      if (s.lastAtk && s.lastAtk.team === "D" && s.lastAtk.kind === "spike") {
        s.kills++; banner(s, "KILL!", "#ffd23f", 1.3); s.shake = 0.45; s.mood = ":dawgpog:"; s.moodT = 1.6; G.buzz();
        puff(s, b.x, s.gy, 10, "#ffd23f");
      } else banner(s, "POINT DAWGS!", "#7dff8a", 1.2);
      G.sfx("win");
    } else {
      s.cs++; banner(s, "CATS SCORE", "#e8b4ff", 1.2); G.sfx("lose");
      s.mood = ":dawgsweat:"; s.moodT = 1.6;
    }
  }
  const total = s => Math.min(9999, s.ds * 100 + (s.ds >= TO ? 500 : 0) + s.kills * 25);

  // ---- the player's one button ----
  function action(G) {
    const s = G.s, d = s.dog, b = s.b;
    if (s.phase === "serveD") { serve(G); return; }
    if (s.phase !== "rally" || d.cd > 0) return;
    const pl = s.plan, mine = pl && pl.hitter === d && b.x < s.nx;
    if (mine && pl.kind === "bump") {
      const ht = headTop(s, d), ideal = ht - s.BR, dx = Math.abs(b.x - d.x);
      if (dx < 2.4 * s.PR && b.y > ht - 4.2 * s.PR && b.y < d.y - 0.4 * s.PR) {
        const q = clamp(1 - Math.abs(b.y - ideal) / (2.6 * s.PR) - 0.25 * dx / (2.4 * s.PR), 0, 1);
        hit(G, d, "bump", q);
        if (q > 0.72) say(s, "PERFECT!", d.x, ht - 1.4 * s.PR, "#7dff8a");
        else if (q > 0.45) say(s, "NICE", d.x, ht - 1.4 * s.PR, "#fff");
        else say(s, b.y < ideal ? "EARLY" : "LATE", d.x, ht - 1.4 * s.PR, "#ffb46b");
      } else { d.arm = 0.18; d.pose = "bump"; d.cd = 0.22; }
      return;
    }
    if (d.gr) { d.vy = -s.JV * (mine ? 1 : 0.8); d.gr = false; d.swung = false; d.pose = "ready"; d.cd = 0.25; }
  }

  function movePlayer(s, p, dt, spd) {
    const dx = p.tx - p.x, st = spd * dt;
    const m = Math.abs(dx) <= st ? dx : Math.sign(dx) * st;
    p.x += m; p.vx = m / Math.max(dt, 1e-4);
    p.x = clamp(p.x, courtLo(s, p.team), courtHi(s, p.team));
  }
  function physPlayer(s, p, dt) {
    if (!p.gr) { p.y += p.vy * dt + 0.5 * s.gP * dt * dt; p.vy += s.gP * dt; if (p.y >= s.gy) { p.y = s.gy; p.vy = 0; p.gr = true; p.jumped = false; if (p.pose === "ready") p.pose = "idle"; } }
    if (p.gr && Math.abs(p.vx) > 5) p.run += Math.abs(p.vx) * dt * 0.09;
    if (p.arm > 0) { p.arm -= dt; if (p.arm <= 0 && p.pose !== "ready") p.pose = "idle"; }
    if (p.cd > 0) p.cd -= dt;
    p.lean *= Math.pow(0.02, dt);
  }
  const bodyHit = (s, p, b) => Math.abs(b.x - p.x) < 0.8 * s.PR * p.sc + s.BR && b.y > headTop(s, p) - s.BR && b.y < p.y - 0.3 * s.PR && b.vy > 0;
  function pawHit(s, p, b) {
    const px = p.x + p.face * 0.5 * s.PR, py = p.y - 3.25 * s.PR * p.sc;
    return Math.hypot(b.x - px, b.y - py) < 1.5 * s.PR + s.BR;
  }

  function aiTouch(G, p) {
    const s = G.s, b = s.b, pl = s.plan;
    if (!pl || pl.hitter !== p || p.willMiss) return;
    if ((p.team === "D") !== (b.x < s.nx)) return;
    if (pl.kind === "atk") {
      if (p.gr && !p.jumped && b.y < s.atkY) {
        const t = timeToY(s, s.atkY);
        if (t != null && b.vy > -50 && t <= s.tApex + 0.03 && Math.abs(b.x + b.vx * t - (p.x + p.face * 0.5 * s.PR)) < 1.6 * s.PR) {
          p.vy = -s.JV; p.gr = false; p.jumped = true; p.pose = "ready";
        }
      }
      if (!p.gr && pawHit(s, p, b)) { attack(G, p, clamp(0.35 + 0.5 * lvl(s) + Math.random() * 0.3, 0, 1)); return; }
      if (bodyHit(s, p, b)) attack(G, p, 0, true);
      return;
    }
    const ht = headTop(s, p);
    if (b.vy > 0 && b.y >= ht - 0.5 * s.PR && b.y < p.y - 0.8 * s.PR && Math.abs(b.x - p.x) < 1.4 * s.PR + s.BR)
      hit(G, p, pl.kind, p.team === "C" ? rnd(0.5, 1) : 1);
  }

  defGame({
    key: "volley", name: "Beach Dawgs", icon: "🏐", max: 9999, cat: "sports",
    blurb: "2-on-2 beach volleyball. Bump, set, SPIKE.",
    how: "Hold and drag anywhere to run: your dawg follows your finger. The big shadow on the sand shows where the ball will land, so get under it. Tap when the ball reaches your head to BUMP it to your pup. The pup sets it up by the net: tap to jump and SPIKE (hit it at the top of your jump). Tap to serve. Rally scoring, first to 11. Points x100, +500 for a win, +25 per spike kill.",
    reset(G) {
      G.s = { ds: 0, cs: 0, kills: 0, clock: 0, hold: null, kl: false, kr: false, ban: null, shake: 0, mood: ":dawgW:", moodT: 0,
        parts: [], pi: 0, floats: [], fi: 0, trx: new Float32Array(10), try_: new Float32Array(10), trN: 0, trI: 0, ended: false };
      const s = G.s;
      for (let i = 0; i < 48; i++) s.parts.push({ x: 0, y: 0, vx: 0, vy: 0, l: 0, c: "#fff" });
      for (let i = 0; i < 4; i++) s.floats.push({ txt: "", x: 0, y: 0, t: 0, c: "#fff" });
      geo(G); newPoint(G, "D");
    },
    update(G, dt) {
      const s = G.s, d = s.dog;
      s.clock += dt;
      if (s.moodT > 0) { s.moodT -= dt; if (s.moodT <= 0) s.mood = ":dawgW:"; }
      if (s.ban) { s.ban.t -= dt; if (s.ban.t <= 0) s.ban = null; }
      if (s.shake > 0) s.shake = Math.max(0, s.shake - dt);
      for (const p of s.parts) if (p.l > 0) { p.l -= dt; p.x += p.vx * dt; p.y += p.vy * dt; p.vy += 600 * dt; }
      for (const f of s.floats) if (f.t > 0) f.t -= dt;

      // your dawg: follow the finger (after a short hold, so quick taps don't drag it around) or arrow keys
      if (s.phase !== "serveD") {
        if (s.kl || s.kr) d.tx = d.x + (s.kr ? 60 : 0) - (s.kl ? 60 : 0);
        else if (s.hold) { s.hold.t += dt; d.tx = (s.hold.t > 0.1 || s.hold.moved) ? s.hold.x : d.x; }
        else d.tx = d.x;
        movePlayer(s, d, dt, s.SPD);
      } else d.vx = 0;
      const L = lvl(s);
      movePlayer(s, s.pup, dt, G.W * 0.9);
      const cs = lerp(G.W * 0.62, G.W * 0.85, L);
      movePlayer(s, s.c1, dt, cs); movePlayer(s, s.c2, dt, cs);
      for (const p of s.pl) physPlayer(s, p, dt);

      if (s.phase === "serveD" || s.phase === "serveC") { holdBall(s); s.serveT -= dt; if (s.serveT <= 0) serve(G); return; }

      // ball
      const b = s.b;
      b.x += b.vx * dt; b.y += b.vy * dt + 0.5 * s.g * dt * dt; b.vy += s.g * dt; b.spin += b.vx * dt * 0.06;
      if (b.x < s.BR) { b.x = s.BR; b.vx = Math.abs(b.vx) * 0.5; } if (b.x > G.W - s.BR) { b.x = G.W - s.BR; b.vx = -Math.abs(b.vx) * 0.5; }
      s.trI = (s.trI + 1) % 10; s.trx[s.trI] = b.x; s.try_[s.trI] = b.y; s.trN = Math.min(10, s.trN + 1);

      if (s.phase === "dead") {
        if (b.y >= s.gy - s.BR) { b.y = s.gy - s.BR; b.vy = -Math.abs(b.vy) * 0.35; b.vx *= 0.6; if (Math.abs(b.vy) < 40) b.vy = 0; }
        s.deadT -= dt;
        if (s.deadT <= 0) {
          if (s.ds >= TO || s.cs >= TO) {
            if (s.ended) return; s.ended = true;
            G.over(total(s), s.ds >= TO ? `Beach Dawgs win ${s.ds}-${s.cs}!` : `Cats win ${s.cs}-${s.ds}. Ruff.`);
            return;
          }
          newPoint(G, s.winner);
        }
        return;
      }

      // touches
      const pl = s.plan;
      if (pl && pl.hitter === d && b.x < s.nx) {
        if (pl.kind === "atk" && !d.gr && !d.swung && pawHit(s, d, b)) {
          d.swung = true; attack(G, d, clamp(1 - Math.abs(d.vy) / s.JV, 0, 1));
        } else if (bodyHit(s, d, b)) {
          if (pl.kind === "bump") { hit(G, d, "bump", 0.15); say(s, "OOF", d.x, headTop(s, d) - 1.4 * s.PR, "#ffb46b"); }
          else attack(G, d, 0, true);
        }
      } else for (const p of s.pl) if (p !== d) aiTouch(G, p);

      // the cat that was going to miss dives at it
      if (s.plan && s.plan.team === "C" && s.plan.hitter.willMiss && b.y > s.gy - 4 * s.PR) {
        const p = s.plan.hitter; p.lean = clamp(p.lean + Math.sign(b.x - p.x) * dt * 6, -1, 1);
      }

      if (b.y >= s.gy - s.BR) point(G, b.x < s.nx ? "C" : "D");
    },
    down(G, x) { const s = G.s; s.hold = { x, x0: x, t: 0, moved: false }; action(G); },
    move(G, x) { const s = G.s; if (!s.hold) return; s.hold.x = x; if (Math.abs(x - s.hold.x0) > 10) s.hold.moved = true; },
    up(G) { G.s.hold = null; },
    onKey(G, k, isDown) {
      const s = G.s;
      if (k === "ArrowLeft" || k === "a") s.kl = isDown;
      else if (k === "ArrowRight" || k === "d") s.kr = isDown;
      else if ((k === " " || k === "ArrowUp" || k === "w") && isDown) action(G);
    },
    draw(G, c) {
      const s = G.s, W = G.W, H = G.H, dark = G.dark(), PR = s.PR, b = s.b;
      c.save();
      if (s.shake > 0) c.translate((Math.random() - 0.5) * 22 * s.shake, (Math.random() - 0.5) * 22 * s.shake);
      // sky
      const hz = s.gy - 3.4 * PR;
      if (!s.bg || s.bg.k !== `${W}|${H}|${dark}`) {
        const sk = c.createLinearGradient(0, 0, 0, hz);
        if (dark) { sk.addColorStop(0, "#0d1033"); sk.addColorStop(1, "#3a2d6b"); } else { sk.addColorStop(0, "#5cc8ff"); sk.addColorStop(1, "#c9f1ff"); }
        s.bg = { k: `${W}|${H}|${dark}`, sk };
      }
      c.fillStyle = s.bg.sk; c.fillRect(-20, -20, W + 40, hz + 20);
      if (dark) {
        c.fillStyle = "#fff"; for (let i = 0; i < 24; i++) c.fillRect((i * 97) % W, 40 + (i * 53) % (hz * 0.6), 2, 2);
        c.fillStyle = "#f4f1c9"; c.beginPath(); c.arc(W * 0.8, H * 0.16, PR * 1.4, 0, 7); c.fill();
        c.fillStyle = "#151640"; c.beginPath(); c.arc(W * 0.8 + PR * 0.6, H * 0.16 - PR * 0.3, PR * 1.2, 0, 7); c.fill();
      } else {
        c.fillStyle = "#ffe066"; c.beginPath(); c.arc(W * 0.8, H * 0.17, PR * 1.8, 0, 7); c.fill();
        c.fillStyle = "rgba(255,255,255,0.85)";
        for (let k = 0; k < 2; k++) { const cx = k ? W * 0.5 : W * 0.18, cy = k ? H * 0.24 : H * 0.14, r = k ? 0.8 : 1; c.beginPath(); c.ellipse(cx, cy, PR * 2.2 * r, PR * 0.8 * r, 0, 0, 7); c.ellipse(cx + PR * r, cy - PR * 0.5 * r, PR * 1.3 * r, PR * 0.8 * r, 0, 0, 7); c.fill(); }
      }
      // sea
      c.fillStyle = dark ? "#1b3a6e" : "#1e90d6"; c.fillRect(-20, hz, W + 40, s.gy - 1.2 * PR - hz);
      c.fillStyle = dark ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.35)";
      for (let i = 0; i < 9; i++) { const yy = hz + 6 + (i % 3) * 9, xx = ((i * 71 + s.clock * 14) % (W + 60)) - 30; c.fillRect(xx, yy, 26, 3); }
      // sand
      c.fillStyle = dark ? "#8a7448" : "#f3d98e"; c.fillRect(-20, s.gy - 1.2 * PR, W + 40, H - s.gy + 1.2 * PR + 20);
      c.fillStyle = dark ? "#7a653c" : "#e6c877"; for (const dd of s.dots) c.fillRect(dd[0], dd[1], 3, 3);
      c.fillStyle = dark ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.7)"; c.fillRect(PR * 0.5, s.gy + 0.35 * PR, W - PR, 3);
      G.emoji(c, "⛱️", W * 0.07, s.gy - 2.4 * PR, PR * 2.2); G.emoji(c, "🌴", W * 0.94, s.gy - 3 * PR, PR * 3.2);

      // net
      const nx = s.nx, nt = s.netTop, nh = (s.gy - nt) * 0.5;
      const nw = Math.max(8, PR * 0.55);
      c.fillStyle = "#6b5440"; c.fillRect(nx - nw / 2 - 4, nt - 6, 5, s.gy - nt + 8); c.fillRect(nx + nw / 2 - 1, nt - 6, 5, s.gy - nt + 8);
      c.fillStyle = dark ? "rgba(10,10,25,0.5)" : "rgba(30,30,40,0.22)"; c.fillRect(nx - nw / 2, nt, nw, nh);
      c.strokeStyle = dark ? "rgba(255,255,255,0.4)" : "rgba(30,30,30,0.6)"; c.lineWidth = 1; c.beginPath();
      for (let yy = nt; yy <= nt + nh + 0.5; yy += 6) { c.moveTo(nx - nw / 2, yy); c.lineTo(nx + nw / 2, yy); }
      for (let xx = nx - nw / 2; xx <= nx + nw / 2 + 0.5; xx += nw / 2) { c.moveTo(xx, nt); c.lineTo(xx, nt + nh); } c.stroke();
      c.fillStyle = "#fff"; c.fillRect(nx - nw / 2 - 3, nt - 4, nw + 6, 6); c.fillRect(nx - nw / 2 - 1, nt + nh - 2, nw + 2, 3);

      // the big landing shadow
      if (s.phase === "rally") {
        const lx = landX(s), hgt = clamp((s.gy - b.y) / (H * 0.55), 0, 1), r = s.BR * (2.3 - 1.2 * hgt);
        c.fillStyle = `rgba(0,0,0,${0.22 + 0.2 * (1 - hgt)})`; c.beginPath(); c.ellipse(lx, s.gy + 0.15 * PR, r, r * 0.38, 0, 0, 7); c.fill();
        if (s.plan && s.plan.team === "D" && s.plan.hitter === s.dog) {
          c.strokeStyle = s.plan.kind === "atk" ? "#ffd23f" : "#ff5a5f"; c.lineWidth = 2.5; c.globalAlpha = 0.6 + 0.4 * Math.sin(s.clock * 14);
          c.beginPath(); c.ellipse(lx, s.gy + 0.15 * PR, r + 5, r * 0.38 + 3, 0, 0, 7); c.stroke(); c.globalAlpha = 1;
        }
      }
      for (const p of s.pl) drawPlayer(G, c, s, p);
      // ball trail + ball
      if (s.phase !== "serveD" && s.phase !== "serveC" && s.trN > 2) {
        const fast = Math.hypot(b.vx, b.vy) > H * 0.75;
        for (let k = 1; k < s.trN; k++) {
          const i = (s.trI - k + 10) % 10, a = (1 - k / s.trN) * (fast ? 0.5 : 0.22);
          c.fillStyle = fast ? `rgba(255,140,40,${a})` : `rgba(255,255,255,${a})`;
          c.beginPath(); c.arc(s.trx[i], s.try_[i], s.BR * (1 - k / 14), 0, 7); c.fill();
        }
      }
      c.save(); c.translate(b.x, b.y); c.rotate(b.spin);
      c.fillStyle = "#fffbe8"; c.beginPath(); c.arc(0, 0, s.BR, 0, 7); c.fill();
      c.save(); c.beginPath(); c.arc(0, 0, s.BR, 0, 7); c.clip();
      c.lineWidth = s.BR * 0.32; c.strokeStyle = "#ffcc33"; c.beginPath(); c.arc(-s.BR * 0.9, 0, s.BR * 1.05, -0.9, 0.9); c.stroke();
      c.strokeStyle = "#2f7de1"; c.beginPath(); c.arc(s.BR * 0.9, 0, s.BR * 1.05, Math.PI - 0.9, Math.PI + 0.9); c.stroke();
      c.restore();
      c.lineWidth = 1.5; c.strokeStyle = "#333"; c.beginPath(); c.arc(0, 0, s.BR, 0, 7); c.stroke();
      c.restore();
      // particles + floating words
      for (const p of s.parts) if (p.l > 0) { c.globalAlpha = Math.min(1, p.l * 2); c.fillStyle = p.c; c.fillRect(p.x - 3, p.y - 3, 6, 6); }
      c.globalAlpha = 1;
      for (const f of s.floats) if (f.t > 0) { c.globalAlpha = Math.min(1, f.t * 2.5); const fy = f.y - (0.8 - f.t) * 30; G.text(c, f.txt, f.x + 1, fy + 2, 11, "rgba(0,0,0,0.6)"); G.text(c, f.txt, f.x, fy, 11, f.c); }
      c.globalAlpha = 1;
      // first-points coaching
      const d = s.dog;
      if (s.phase === "rally" && s.ds + s.cs < 3 && s.plan && s.plan.hitter === d && b.x < nx) {
        let show = false;
        if (s.plan.kind === "atk" && d.gr) { const t = timeToY(s, s.atkY); show = t != null && b.y < s.atkY && t < s.tApex + 0.16; }
        if (s.plan.kind === "bump") show = b.vy > 0 && Math.abs(b.x - d.x) < 2.4 * PR && b.y > headTop(s, d) - 2.8 * PR && b.y < headTop(s, d) + 0.5 * PR;
        if (show) { G.text(c, "TAP!", d.x + 1, headTop(s, d) - 1.6 * PR + 2, 13, "rgba(0,0,0,0.6)"); G.text(c, "TAP!", d.x, headTop(s, d) - 1.6 * PR, 13, "#ffd23f"); }
      }
      c.restore();

      G.hud(c, `DAWGS ${s.ds}`, `TO ${TO}`, `${s.cs} CATS`);
      if (s.ban) G.banner(c, s.ban.txt, s.ban.col, H * 0.3);
      if (s.phase === "serveD") pill(G, c, "TAP TO SERVE", H - 34);
      else G.hint(c, "DRAG TO RUN · TAP TO HIT", 5);
    }
  });

  function pill(G, c, msg, yy) {
    c.save(); const sz = Math.max(10, Math.min(12, G.W / 34));
    c.font = `${sz}px 'Press Start 2P', ui-monospace, monospace`; const w = c.measureText(msg).width + 28;
    c.globalAlpha = 0.75 + 0.25 * Math.sin(G.s.clock * 6);
    c.fillStyle = "rgba(0,0,0,0.6)"; c.beginPath(); if (c.roundRect) c.roundRect(G.W / 2 - w / 2, yy - 15, w, 30, 15); else c.rect(G.W / 2 - w / 2, yy - 15, w, 30); c.fill();
    G.text(c, msg, G.W / 2, yy, sz, "#fff"); c.restore();
  }

  function drawPlayer(G, c, s, p) {
    const PR = s.PR * p.sc, x = p.x, y = p.y, f = p.face, dog = p.team === "D";
    const air = clamp((s.gy - y) / (3 * s.PR), 0, 1);
    c.fillStyle = "rgba(0,0,0,0.22)"; c.beginPath(); c.ellipse(x, s.gy + 0.1 * s.PR, PR * (1.1 - 0.4 * air), PR * 0.3, 0, 0, 7); c.fill();
    c.save(); c.translate(x, y); if (p.lean) c.rotate(p.lean * 0.6);
    // legs
    c.lineCap = "round"; c.strokeStyle = p.fur; c.lineWidth = PR * 0.42;
    const sw = p.gr ? Math.sin(p.run) * 0.32 * PR : 0, tuck = p.gr ? 0 : 0.25 * PR;
    c.beginPath(); c.moveTo(-0.28 * PR, -0.85 * PR); c.lineTo(-0.28 * PR + sw, -0.12 * PR - tuck);
    c.moveTo(0.28 * PR, -0.85 * PR); c.lineTo(0.28 * PR - sw, -0.12 * PR - tuck); c.stroke();
    // shorts + jersey
    c.fillStyle = dog ? "#1d3557" : "#2b2d42"; c.beginPath(); c.ellipse(0, -0.95 * PR, 0.62 * PR, 0.32 * PR, 0, 0, 7); c.fill();
    c.fillStyle = dog ? "#e63946" : "#7b3fe4"; c.beginPath(); c.ellipse(0, -1.45 * PR, 0.72 * PR, 0.62 * PR, 0, 0, 7); c.fill();
    G.text(c, dog ? (p.kind === "dog" ? "1" : "2") : (p.kind === "cat1" ? "9" : "6"), 0, -1.32 * PR, 10, "#fff");
    // arms
    c.strokeStyle = p.fur; c.lineWidth = PR * 0.34;
    const sy = -1.75 * PR; let ax, ay, bx2, by2;
    if (p.pose === "bump" && p.arm > 0) { ax = bx2 = f * 0.85 * PR; ay = by2 = -1.15 * PR; }
    else if (p.pose === "set" && p.arm > 0) { ax = f * 0.15 * PR; bx2 = f * 0.45 * PR; ay = by2 = -3.3 * PR; }
    else if (p.pose === "spike" && p.arm > 0) { const k = p.arm / 0.3; ax = f * (0.2 + 0.8 * (1 - k)) * PR; ay = -1.6 * PR - 1.8 * k * PR; bx2 = -f * 0.6 * PR; by2 = -1.2 * PR; }
    else if (p.pose === "ready" || !p.gr) { ax = -f * 0.25 * PR; ay = -3.4 * PR; bx2 = f * 0.5 * PR; by2 = -2.6 * PR; }
    else { ax = 0.75 * PR; ay = -0.95 * PR; bx2 = -0.75 * PR; by2 = -0.95 * PR; }
    c.beginPath(); c.moveTo(0.4 * PR * Math.sign(ax || 1), sy); c.lineTo(ax, ay); c.moveTo(0.4 * PR * Math.sign(bx2 || -1), sy); c.lineTo(bx2, by2); c.stroke();
    // head
    const hy = -2.25 * PR;
    if (p.kind === "dog") G.img(c, s.mood, 0, hy, PR * 2.3);
    else if (p.kind === "pup") G.emoji(c, "🐶", 0, hy, PR * 1.9);
    else { c.save(); c.scale(-1, 1); G.emoji(c, p.kind === "cat1" ? "🐱" : "😼", 0, hy, PR * 1.9); c.restore(); }
    c.restore();
  }
})();
