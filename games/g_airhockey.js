// ---------- Paw Hockey (top-down air hockey vs a CPU cat) ----------
// Drag anywhere in the bottom half: your bulldog mallet follows your finger, drawn ~40px ABOVE the touch point so your
// thumb never hides it. Velocity is tracked, so a fast swipe smacks the puck hard (player hits get a little extra pop).
// Goals are slots in the middle of the top/bottom rails (40% of the table width). First to 7.
// Score = your goals x100 + 500 for a win + 10 per shot on goal (bonus capped at 300), max 9999.
// The cat starts slow and sloppy (late reactions, bad reads, leaves gaps) and sharpens as goals are scored,
// with rubber-banding: a bit sharper if you lead by 3+, a bit softer if you trail by 3+.
(function () {
  const WIN = 7, OFFY = 40;
  let bg = null; // cached table background {key, cv}

  function lay(G) {
    const W = G.W, H = G.H, l = 8, r = W - 8, t = 44, b = H - 10;
    const tw = r - l, th = b - t, m = Math.min(tw, th * 0.62);
    const gw = tw * 0.4, mr = Math.max(22, m * 0.075);
    return { W, H, l, r, t, b, tw, th, mid: (t + b) / 2, gl: W / 2 - gw / 2, gr: W / 2 + gw / 2, gw,
      pr: Math.max(11, m * 0.04), mr, pmr: mr * 1.2, vmax: Math.max(650, Math.min(1050, th * 1.65)) };
  }

  // side 1 = puck on the player's half, -1 = cat's half, 0 = center
  function faceoff(G, side, pause) {
    const s = G.s, L = s.L, p = s.puck;
    p.x = L.W / 2 + (Math.random() - 0.5) * L.tw * 0.25; p.y = side === 0 ? L.mid : L.mid + side * L.th * 0.17;
    p.vx = 0; p.vy = 0; s.pause = pause == null ? 0.9 : pause; s.last = null; s.shotLive = false;
    s.ax = p.x; s.ay = p.y; s.stuckT = 0; s.spawnT = 0.5;
    // the cat doesn't snipe straight off a faceoff: it sits back for a beat first (shorter as it gets better)
    s.catWait = s.pause + (side === -1 ? 1.3 - 0.8 * diff(G) : 0.3);
  }

  // difficulty 0..1: grows with goals scored (and a little with time), rubber-banded by the score gap
  function diff(G) {
    const s = G.s, lead = s.pg - s.cg;
    let d = Math.min(1, (s.pg + s.cg) / 7) * 0.85 + Math.min(1, s.time / 150) * 0.15;
    if (lead >= 3) d += 0.15 + 0.05 * (lead - 3); else if (lead <= -3) d -= 0.15 + 0.05 * (-lead - 3);
    return Math.max(0, Math.min(1, d));
  }
  const mix = (a, b, d) => a + (b - a) * d;

  function clampMallet(L, m, top, r) {
    const lo = top ? L.t + r : L.mid + r * 0.6, hi = top ? L.mid - r * 0.6 : L.b - r;
    if (m.x < L.l + r) m.x = L.l + r; if (m.x > L.r - r) m.x = L.r - r;
    if (m.y < lo) m.y = lo; if (m.y > hi) m.y = hi;
  }

  // where (x) a puck moving up/down will cross line y, with wall reflections
  function crossX(L, p, y) {
    if (Math.abs(p.vy) < 1) return p.x;
    const tt = (y - p.y) / p.vy; if (tt < 0) return null;
    const a = L.l + L.pr, w = L.r - L.pr - a; let u = (p.x + p.vx * tt - a) % (2 * w); if (u < 0) u += 2 * w;
    return a + (u > w ? 2 * w - u : u);
  }

  // ---- CPU cat brain ----
  function catTarget(G, dt, d) {
    const s = G.s, L = s.L, c = s.cat, P = s.puck;
    const react = mix(0.38, 0.2, d); // how often it re-reads the puck
    s.seenT -= dt; s.catWait -= dt; s.recov -= dt;
    if (s.seenT <= 0) {
      s.seen.x = P.x; s.seen.y = P.y; s.seen.vx = P.vx; s.seen.vy = P.vy; s.seenT = react * (0.8 + Math.random() * 0.4);
      s.cerr = (Math.random() * 2 - 1) * L.gw * mix(0.45, 0.2, d); // misreads where the puck is going
      // sometimes it gets greedy and creeps up toward center ice, leaving its goal open
      if (P.y > L.mid && Math.random() < mix(0.22, 0.05, d) * react * 3) s.creepT = mix(1.4, 0.5, d);
      // shot aim: a sleepy cat shoots at random spots, a sharp one picks the side your mallet isn't covering
      if (P.y > L.mid - L.pr) s.aimX = Math.random() < mix(0.25, 0.85, d) ? L.W / 2 + (s.me.x > L.W / 2 ? -1 : 1) * L.gw * 0.2 : L.W / 2 + (Math.random() - 0.5) * L.gw * 0.7;
    }
    s.creepT -= dt;
    const p = s.seen, hold = L.t + L.mr + L.th * 0.04, reach = L.mr + L.pr;
    const fastIn = p.vy < -L.th * mix(0.45, 0.75, d) && p.y > L.t + L.th * 0.15;
    if (s.catWait <= 0 && s.recov <= 0 && P.y < L.mid - L.pr && p.y < L.mid - L.pr && !fastIn) {
      if (p.y < c.y + L.pr * 0.3) { // puck is between us and our goal: circle around it
        let side = c.x >= p.x ? 1 : -1;
        if (p.x + side * (reach + 8) > L.r - L.mr || p.x + side * (reach + 8) < L.l + L.mr) side = -side;
        return { x: p.x + side * (reach + 10), y: Math.max(L.t + L.mr, p.y - reach * 0.9), sp: mix(0.6, 1, d) };
      }
      const gx = s.aimX + s.cerr * mix(0.8, 0.2, d), gy = L.b + 20;
      let dx = gx - p.x, dy = gy - p.y; const dl = Math.hypot(dx, dy) || 1; dx /= dl; dy /= dl;
      let ax = p.x - c.x, ay = p.y - c.y; const al = Math.hypot(ax, ay) || 1; ax /= al; ay /= al;
      if (ax * dx + ay * dy > 0.82 - 0.24 * d || al < reach * 1.15) return { x: p.x + dx * reach * 1.3, y: p.y + dy * reach * 1.3, sp: mix(0.7, 1, d), strike: true };
      return { x: p.x - dx * (reach + 6), y: p.y - dy * (reach + 6), sp: mix(0.6, 1, d) };
    }
    if (s.creepT > 0) return { x: L.W / 2 + (P.x - L.W / 2) * 0.6, y: L.mid - L.mr * 1.2, sp: 0.6 };
    // defend: slide to where the puck will cross our guard line (with a misread)
    let x = L.W / 2 + (p.x - L.W / 2) * 0.5;
    if (p.vy < -20) { const cx = crossX(L, p, hold); if (cx != null) x = cx; }
    x += s.cerr;
    x = Math.max(L.gl - L.mr * 0.2, Math.min(L.gr + L.mr * 0.2, x));
    return { x, y: hold, sp: P.y > L.mid ? 0.5 : (s.recov > 0 ? 0.55 : 0.8) };
  }

  function steer(m, tx, ty, sp, dt) {
    const dx = tx - m.x, dy = ty - m.y, d = Math.hypot(dx, dy);
    if (d < 0.5) { m.vx = 0; m.vy = 0; return; }
    const v = Math.min(sp, d / dt); m.vx = dx / d * v; m.vy = dy / d * v;
  }

  function hitMallet(G, m, top, mr) {
    const s = G.s, L = s.L, p = s.puck, R = mr + L.pr;
    const dx = p.x - m.x, dy = p.y - m.y, d2 = dx * dx + dy * dy;
    if (d2 >= R * R) return;
    const d = Math.sqrt(d2) || 0.001, nx = d2 ? dx / d : 0, ny = d2 ? dy / d : (top ? 1 : -1);
    p.x = m.x + nx * R; p.y = m.y + ny * R;
    const rvx = p.vx - m.vx, rvy = p.vy - m.vy, vn = rvx * nx + rvy * ny;
    if (vn < 0) {
      // the cat touching a live shot heading into its goal mouth = a saved shot on goal
      if (top && s.last === "me" && s.shotLive) { s.shots++; s.score = finalScore(s); s.shotLive = false; s.pops.push({ x: p.x, y: p.y + 30, t: 0.8, txt: "SHOT +10", c: "#7df9ff" }); }
      p.vx -= 1.9 * vn * nx; p.vy -= 1.9 * vn * ny;
      if (!top) { p.vx *= 1.18; p.vy *= 1.18; } // dawg hits pack a little extra punch
      else if (s.last !== "cat" || s.hitCd <= 0) s.recov = mix(0.7, 0.2, s.dif); // the cat backs off after a swing
      s.last = top ? "cat" : "me"; s.shotLive = false;
      if (-vn > 120 && s.hitCd <= 0) { G.sfx("pop"); s.hitCd = 0.09; if (!top) { s.face = ":dawgpog:"; s.faceT = 0.4; } }
      s.flash = Math.min(1, -vn / 900);
    }
  }

  function walls(G) {
    const s = G.s, L = s.L, p = s.puck, r = L.pr, e = 0.92;
    if (p.x < L.l + r) { p.x = L.l + r; p.vx = Math.abs(p.vx) * e; }
    if (p.x > L.r - r) { p.x = L.r - r; p.vx = -Math.abs(p.vx) * e; }
    const inSlot = p.x > L.gl && p.x < L.gr;
    if (!inSlot) {
      if (p.y < L.t + r) { p.y = L.t + r; p.vy = Math.abs(p.vy) * 0.75; }
      if (p.y > L.b - r) { p.y = L.b - r; p.vy = -Math.abs(p.vy) * 0.75; }
    }
    for (const py of [L.t, L.b]) for (const px of [L.gl, L.gr]) { // goal posts
      const dx = p.x - px, dy = p.y - py, d = Math.hypot(dx, dy);
      if (d < r && d > 0.001) {
        const nx = dx / d, ny = dy / d; p.x = px + nx * r; p.y = py + ny * r;
        const vn = p.vx * nx + p.vy * ny; if (vn < 0) { p.vx -= 1.9 * vn * nx; p.vy -= 1.9 * vn * ny; }
      }
    }
    if (p.y < L.t || p.y > L.b) { if (p.x < L.gl + r) { p.x = L.gl + r; p.vx = Math.abs(p.vx); } if (p.x > L.gr - r) { p.x = L.gr - r; p.vx = -Math.abs(p.vx); } }
  }

  function finalScore(s) { return Math.min(9999, s.pg * 100 + (s.pg >= WIN ? 500 : 0) + Math.min(300, s.shots * 10)); }

  function goal(G, mine) {
    const s = G.s, L = s.L;
    if (mine) {
      s.pg++; s.shots++; s.banner = { txt: "GOAL!", c: "#ffd23f", t: 1.2 }; s.face = ":dawgpog:"; s.faceT = 1.3; G.sfx("win");
    } else {
      s.cg++; s.banner = { txt: "CAT SCORES", c: "#ff5fa2", t: 1.2 }; s.face = ":dawgsweat:"; s.faceT = 1.3; G.sfx("lose"); G.buzz();
    }
    s.gflash = 1; s.gmine = mine;
    s.score = finalScore(s);
    if (s.pg >= WIN || s.cg >= WIN) {
      const won = s.pg >= WIN;
      s.end = 1.6; s.puck.vx = s.puck.vy = 0; s.puck.y = -999;
      s.face = won ? ":dawgW:" : ":dawgpain:"; s.faceT = 99;
      s.banner = won ? { txt: `DAWGS WIN ${s.pg}-${s.cg}`, c: "#7dffb0", t: 9 } : { txt: `CAT WINS ${s.cg}-${s.pg}`, c: "#ff5fa2", t: 9 };
      return;
    }
    faceoff(G, mine ? -1 : 1, 1.1); // whoever got scored on gets the puck
  }

  defGame({
    key: "airhockey", name: "Paw Hockey", icon: "🏒", max: 9999, cat: "sports",
    blurb: "Air hockey vs the cat. First to 7.",
    how: "Drag anywhere in the bottom half and your bulldog mallet follows just above your thumb. Swing through the puck fast to hit it hard, and bank it off the walls into the cat's goal at the top. First to 7 wins. Each goal is 100, a win is +500, and every shot on goal adds a little bonus. The cat starts sleepy but wakes up as the game goes on.",
    reset(G) {
      const L = lay(G);
      G.s = { L, score: 0, pg: 0, cg: 0, shots: 0, time: 0, dif: 0,
        me: { x: L.W / 2, y: L.b - L.th * 0.13, vx: 0, vy: 0 }, cat: { x: L.W / 2, y: L.t + L.th * 0.12, vx: 0, vy: 0 },
        puck: { x: 0, y: 0, vx: 0, vy: 0 }, tx: L.W / 2, ty: L.b - L.th * 0.13, keys: {}, pause: 0, hitCd: 0, flash: 0,
        banner: null, face: ":dawgW:", faceT: 0, end: 0, touched: false, last: null, shotLive: false,
        seen: { x: L.W / 2, y: L.mid, vx: 0, vy: 0 }, seenT: 0, cerr: 0, aimX: L.W / 2, creepT: 0, recov: 0, catWait: 0,
        ax: 0, ay: 0, stuckT: 0, spawnT: 0, gflash: 0, gmine: true, pops: [] };
      faceoff(G, 1, 0.6);
    },
    update(G, dt) {
      const s = G.s, L = s.L, p = s.puck, me = s.me, cat = s.cat;
      if (s.banner) { s.banner.t -= dt; if (s.banner.t <= 0) s.banner = null; }
      if (s.faceT > 0) { s.faceT -= dt; if (s.faceT <= 0) s.face = ":dawgW:"; }
      s.hitCd -= dt; s.flash = Math.max(0, s.flash - dt * 3); s.gflash = Math.max(0, s.gflash - dt * 1.6); s.spawnT = Math.max(0, s.spawnT - dt);
      for (const q of s.pops) q.t -= dt; if (s.pops.length && s.pops[0].t <= 0) s.pops.shift();
      if (s.end > 0) {
        s.end -= dt;
        if (s.end <= 0) G.over(s.score, s.pg >= WIN ? `Dawgs win ${s.pg}-${s.cg}!` : `Cat wins ${s.cg}-${s.pg}. Ruff.`);
        return;
      }
      s.time += dt;
      // keyboard nudges the target (desktop testing)
      const k = s.keys, ks = L.th * 1.3 * dt;
      if (k.ArrowLeft || k.a) s.tx -= ks; if (k.ArrowRight || k.d) s.tx += ks;
      if (k.ArrowUp || k.w) s.ty -= ks; if (k.ArrowDown || k.s) s.ty += ks;
      s.tx = Math.max(L.l, Math.min(L.r, s.tx)); s.ty = Math.max(L.mid, Math.min(L.b, s.ty));
      steer(me, s.tx, s.ty, 3600, dt);
      const d = s.dif = diff(G), ct = catTarget(G, dt, d);
      steer(cat, ct.x, ct.y, L.th * mix(0.7, 1.45, d) * ct.sp, dt);
      if (s.pause > 0) s.pause -= dt;
      // substepped physics
      const sp = Math.hypot(p.vx, p.vy), mv = Math.max(sp, Math.hypot(me.vx, me.vy), Math.hypot(cat.vx, cat.vy));
      const n = Math.max(1, Math.min(14, Math.ceil(mv * dt / (L.pr * 0.6)))), h = dt / n;
      for (let i = 0; i < n; i++) {
        me.x += me.vx * h; me.y += me.vy * h; clampMallet(L, me, false, L.pmr);
        cat.x += cat.vx * h; cat.y += cat.vy * h; clampMallet(L, cat, true, L.mr);
        if (s.pause > 0) continue;
        p.x += p.vx * h; p.y += p.vy * h;
        hitMallet(G, me, false, L.pmr); hitMallet(G, cat, true, L.mr);
        const v = Math.hypot(p.vx, p.vy); if (v > L.vmax) { p.vx *= L.vmax / v; p.vy *= L.vmax / v; }
        walls(G);
        for (const m of [me, cat]) { // squeezed against a wall: shove the mallet off instead of tunneling
          const R = (m === me ? L.pmr : L.mr) + L.pr, dx = p.x - m.x, dy = p.y - m.y, dd = Math.hypot(dx, dy);
          if (dd < R) { const nx = dd ? dx / dd : 0, ny = dd ? dy / dd : 1; m.x = p.x - nx * R; m.y = p.y - ny * R; }
        }
        if (p.y < L.t - L.pr * 1.2) { goal(G, true); return; }
        if (p.y > L.b + L.pr * 1.2) { goal(G, false); return; }
      }
      // a player shot is "on goal" while it is headed up into the cat's goal mouth
      if (s.last === "me" && p.vy < -150 && p.y < L.mid) { const cx = crossX(L, p, L.t); s.shotLive = cx != null && cx > L.gl + L.pr * 0.5 && cx < L.gr - L.pr * 0.5; }
      else if (p.vy >= 0) s.shotLive = false;
      // air table: low friction
      const f = Math.exp(-0.28 * dt); p.vx *= f; p.vy *= f;
      if (!(p.x === p.x && p.y === p.y) || p.x < L.l - 4 || p.x > L.r + 4 || p.y < L.t - 60 || p.y > L.b + 60) faceoff(G, 0);
      // stuck (pinned behind a mallet / dead in a corner / barely moving) for 4s -> reset to the side that didn't touch it last
      if (s.pause <= 0) {
        if (Math.hypot(p.x - s.ax, p.y - s.ay) > L.mr * 1.5) { s.ax = p.x; s.ay = p.y; s.stuckT = 0; }
        else s.stuckT += dt;
        if (s.stuckT > 4) {
          const side = s.last === "me" ? -1 : s.last === "cat" ? 1 : (p.y < L.mid ? 1 : -1);
          faceoff(G, side, 0.7);
          s.pops.push({ x: L.W / 2, y: L.mid + side * L.th * 0.17 - 34, t: 1, txt: "RESET", c: "#fff" });
        }
      }
    },
    // the mallet sits OFFY px above the finger so the thumb doesn't hide it
    down(G, x, y) { const s = G.s; s.tx = x; s.ty = y - OFFY; s.touched = true; },
    move(G, x, y) { const s = G.s; s.tx = x; s.ty = y - OFFY; },
    onKey(G, key, isDown) { G.s.keys[key] = isDown; if (isDown) G.s.touched = true; },
    draw(G, c) {
      const s = G.s, L = s.L, W = G.W, dark = G.dark();
      drawTable(G, c, L, dark);
      const p = s.puck, sp = Math.hypot(p.vx, p.vy), neon = dark ? "#7df9ff" : "#0077b6";
      if (p.y > -100) {
        if (sp > 300) { c.globalAlpha = Math.min(0.35, sp / 3000); c.fillStyle = neon; c.beginPath(); c.arc(p.x - p.vx * 0.03, p.y - p.vy * 0.03, L.pr * 0.9, 0, 7); c.fill(); c.globalAlpha = 1; }
        if (s.spawnT > 0) { c.globalAlpha = s.spawnT * 1.4; c.strokeStyle = neon; c.lineWidth = 2; c.beginPath(); c.arc(p.x, p.y, L.pr + (0.5 - s.spawnT) * 40, 0, 7); c.stroke(); c.globalAlpha = 1; }
        c.save(); c.shadowColor = neon; c.shadowBlur = dark ? 14 : 6;
        c.fillStyle = dark ? "#10122a" : "#1b1e3a"; c.beginPath(); c.arc(p.x, p.y, L.pr, 0, 7); c.fill();
        c.restore();
        c.strokeStyle = neon; c.lineWidth = 3; c.beginPath(); c.arc(p.x, p.y, L.pr - 1.5, 0, 7); c.stroke();
        c.fillStyle = "#ffd23f"; c.beginPath(); c.arc(p.x, p.y, L.pr * 0.3, 0, 7); c.fill();
      }
      drawMallet(G, c, s.cat, L.mr, "#ff4f9a", dark, false);
      drawMallet(G, c, s.me, L.pmr, "#2f8fff", dark, true);
      if (!s.touched && s.pg + s.cg === 0) { // pointing finger below the mallet = where to put your thumb
        const bob = Math.sin(G.t * 5) * 4;
        c.fillStyle = "#000"; G.emoji(c, "👆", s.me.x + 6, s.me.y + L.pmr + 22 + bob, 28);
      }
      G.hint(c, "DRAG TO MOVE · HIT IT HARD", 4, L.mid + L.th * 0.12);
      for (const q of s.pops) G.text(c, q.txt, q.x, q.y - (1 - q.t) * 24, 10, q.c);
      // HUD
      const hh = G.hud(c, "", `YOU ${s.pg} - ${s.cg} CAT`, `TO ${WIN}`);
      G.img(c, s.face, 20, hh / 2, 24);
      // goal flash
      if (s.gflash > 0) {
        c.save(); if (dark) c.globalCompositeOperation = "lighter";
        c.globalAlpha = s.gflash * (dark ? 0.3 : 0.45); c.fillStyle = s.gmine ? "#ffd23f" : "#ff4f9a";
        c.fillRect(0, s.gmine ? L.t - 6 : L.mid, W, L.th / 2 + 6); c.restore();
      }
      if (s.banner) {
        const b = s.banner, by = L.mid, age = (b.txt === "GOAL!" ? 1.2 - b.t : 1);
        const pop = age < 0.25 ? 0.6 + age * 2.4 : 1 + Math.sin(G.t * 10) * 0.03;
        c.fillStyle = "rgba(0,0,0,.6)"; c.fillRect(0, by - 30, W, 60);
        const big = b.txt === "GOAL!" ? Math.min(40, W / 8) : Math.min(20, W / 15);
        G.banner(c, b.txt, b.c, by, big * pop);
      }
    }
  });

  function drawMallet(G, c, m, r, col, dark, dog) {
    c.save(); c.shadowColor = col; c.shadowBlur = dark ? 18 : 8; c.shadowOffsetY = dark ? 0 : 3;
    c.fillStyle = col; c.beginPath(); c.arc(m.x, m.y, r, 0, 7); c.fill(); c.restore();
    c.fillStyle = dark ? "rgba(0,0,0,.35)" : "rgba(255,255,255,.35)"; c.beginPath(); c.arc(m.x, m.y, r * 0.8, 0, 7); c.fill();
    c.strokeStyle = "#fff"; c.lineWidth = 2; c.beginPath(); c.arc(m.x, m.y, r - 1, 0, 7); c.stroke();
    if (dog) G.img(c, G.s.face, m.x, m.y, r * 1.55);
    else { c.fillStyle = "#000"; G.emoji(c, "🐈", m.x, m.y + 1, r * 1.2); }
  }

  function drawTable(G, c, L, dark) {
    const key = [L.W, L.H, dark, G.dpr].join();
    if (!bg || bg.key !== key) {
      const cv = document.createElement("canvas"); cv.width = Math.round(L.W * G.dpr); cv.height = Math.round(L.H * G.dpr);
      const x = cv.getContext("2d"); x.scale(G.dpr, G.dpr); paintTable(x, L, dark); bg = { key, cv };
    }
    c.drawImage(bg.cv, 0, 0, L.W, L.H);
  }

  function paintTable(c, L, dark) {
    const W = L.W, H = L.H;
    const lineA = dark ? "#ff4fd8" : "#e0218a", lineB = dark ? "#38e8ff" : "#1f6fd1";
    c.fillStyle = dark ? "#05060f" : "#8fb4d9"; c.fillRect(0, 0, W, H);
    // rail
    c.fillStyle = dark ? "#1b2150" : "#24497e"; rr(c, L.l - 6, L.t - 6, L.tw + 12, L.th + 12, 14); c.fill();
    // surface
    const g = c.createLinearGradient(0, L.t, 0, L.b);
    if (dark) { g.addColorStop(0, "#0b1440"); g.addColorStop(0.5, "#101c55"); g.addColorStop(1, "#0b1440"); }
    else { g.addColorStop(0, "#a9dcff"); g.addColorStop(0.5, "#d4efff"); g.addColorStop(1, "#a9dcff"); }
    c.fillStyle = g; rr(c, L.l, L.t, L.tw, L.th, 9); c.fill();
    // gloss streak
    c.save(); rr(c, L.l, L.t, L.tw, L.th, 9); c.clip();
    const gl = c.createLinearGradient(L.l, L.t, L.r, L.b);
    gl.addColorStop(0, "rgba(255,255,255,0)"); gl.addColorStop(0.42, "rgba(255,255,255,0)"); gl.addColorStop(0.5, dark ? "rgba(255,255,255,.06)" : "rgba(255,255,255,.45)"); gl.addColorStop(0.58, "rgba(255,255,255,0)");
    c.fillStyle = gl; c.fillRect(L.l, L.t, L.tw, L.th);
    // air holes
    c.fillStyle = dark ? "rgba(140,200,255,.22)" : "rgba(30,80,150,.22)";
    const sp = 17;
    for (let y = L.t + sp / 2 + 2; y < L.b - 4; y += sp) for (let x = L.l + sp / 2 + ((Math.round((y - L.t) / sp) % 2) * sp / 2); x < L.r - 4; x += sp) c.fillRect(x - 1, y - 1, 2.2, 2.2);
    // lines
    c.lineWidth = 3; c.shadowBlur = dark ? 10 : 0;
    c.strokeStyle = lineA; c.shadowColor = lineA;
    c.beginPath(); c.moveTo(L.l, L.mid); c.lineTo(L.r, L.mid); c.stroke();
    c.beginPath(); c.arc(W / 2, L.mid, L.tw * 0.16, 0, 7); c.stroke();
    c.strokeStyle = lineB; c.shadowColor = lineB;
    c.beginPath(); c.arc(W / 2, L.t, L.gw * 0.62, 0, Math.PI); c.stroke();
    c.beginPath(); c.arc(W / 2, L.b, L.gw * 0.62, Math.PI, Math.PI * 2); c.stroke();
    // corner arcs
    const ca = L.tw * 0.12; c.lineWidth = 2;
    c.beginPath(); c.arc(L.l, L.t, ca, 0, Math.PI / 2); c.stroke();
    c.beginPath(); c.arc(L.r, L.t, ca, Math.PI / 2, Math.PI); c.stroke();
    c.beginPath(); c.arc(L.l, L.b, ca, -Math.PI / 2, 0); c.stroke();
    c.beginPath(); c.arc(L.r, L.b, ca, Math.PI, Math.PI * 1.5); c.stroke();
    c.globalAlpha = 0.5;
    c.beginPath(); c.moveTo(L.l, L.t + L.th * 0.25); c.lineTo(L.r, L.t + L.th * 0.25); c.moveTo(L.l, L.b - L.th * 0.25); c.lineTo(L.r, L.b - L.th * 0.25); c.stroke();
    c.globalAlpha = 1; c.shadowBlur = 0;
    c.fillStyle = lineA; c.beginPath(); c.arc(W / 2, L.mid, 5, 0, 7); c.fill();
    c.restore();
    // goal slots
    c.fillStyle = "#000";
    c.fillRect(L.gl, L.t - 8, L.gw, 9); c.fillRect(L.gl, L.b - 1, L.gw, 9);
    c.shadowBlur = dark ? 12 : 0; c.lineWidth = 3;
    c.strokeStyle = "#ff4f9a"; c.shadowColor = "#ff4f9a"; c.beginPath(); c.moveTo(L.gl, L.t); c.lineTo(L.gl, L.t - 8); c.moveTo(L.gr, L.t); c.lineTo(L.gr, L.t - 8); c.stroke();
    c.strokeStyle = "#2f8fff"; c.shadowColor = "#2f8fff"; c.beginPath(); c.moveTo(L.gl, L.b); c.lineTo(L.gl, L.b + 8); c.moveTo(L.gr, L.b); c.lineTo(L.gr, L.b + 8); c.stroke();
    c.strokeStyle = lineB; c.shadowColor = lineB; c.lineWidth = 2; rr(c, L.l, L.t, L.tw, L.th, 9); c.stroke();
    c.shadowBlur = 0;
    c.fillStyle = "#000"; c.fillRect(L.gl + 2, L.t - 4, L.gw - 4, 6); c.fillRect(L.gl + 2, L.b - 2, L.gw - 4, 6);
  }

  function rr(c, x, y, w, h, r) {
    c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r);
    c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath();
  }
})();
