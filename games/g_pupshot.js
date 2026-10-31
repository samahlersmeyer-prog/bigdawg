// ---------- Pup Shot (Arcade: basketball physics puzzles) ----------
// Pull back and let go to fling the ball. While it flies, TAP to warp the pup to the ball, then shoot
//   again from right there (even in mid-air). Get it through the hoop in as few shots as you can.
// 12 courts. Each court is worth up to 500 (par or better), 100 less per extra shot, never below 100.
(function () {
  const GR = 140, BR = 2.6, RIM = 13, FLOOR = [-30, 146, 160, 30];
  // ---- levels (a 100 x 150 court, y grows downward) ----
  // d: pup start, h: [rim-left x, rim y, backboard side], w: [x, y, w, h, bouncy?], par: shots, bombs/mags: [x, y], a: aim swing (deg)
  const SHOT = [
    { d: [18, 138], h: [68, 96, "r"], w: [], par: 1, tip: "PULL BACK AND LET GO" },
    { d: [15, 138], h: [72, 118, "r"], w: [[44, 96, 8, 50]], par: 1, tip: "LOB IT OVER THE WALL" },
    { d: [15, 138], h: [74, 112, "r"], w: [[30, 0, 70, 78]], par: 1, tip: "KEEP IT LOW" },
    { d: [15, 138], h: [70, 42, "r"], w: [[60, 58, 34, 4]], par: 2, tip: "TAP WHILE IT FLIES TO WARP" },
    { d: [85, 138], h: [12, 92, "l"], w: [[4, 106, 28, 4]], par: 1 },
    { d: [14, 138], h: [76, 112, "r"], w: [[54, 92, 4, 54], [93, 92, 4, 54]], par: 1, tip: "DROP IT IN THE BOX" },
    { d: [12, 138], h: [74, 108, "r"], w: [[48, 0, 8, 62], [48, 86, 8, 60]], par: 1, tip: "THREAD THE WINDOW" },
    { d: [15, 138], h: [68, 48, "r"], w: [[62, 66, 32, 80]], par: 2 },
    { d: [12, 138], h: [74, 118, "r"], w: [[40, 34, 10, 112]], par: 2 },
    { d: [12, 138], h: [14, 72, "l"], w: [[0, 96, 66, 5]], par: 2 },
    { d: [88, 138], h: [10, 120, "l"], w: [[30, 46, 8, 100], [30, 0, 8, 22]], par: 2 },
    { d: [50, 138], h: [80, 30, "r"], w: [[20, 100, 20, 4], [62, 70, 26, 4], [70, 46, 26, 4]], par: 2 }
  ];
  // ---- physics (pure, so it can be tested off-screen) ----
  function world(L) {
    const walls = L.w.map(a => ({ x: a[0], y: a[1], w: a[2], h: a[3], b: !!a[4] })).concat([{ x: FLOOR[0], y: FLOOR[1], w: FLOOR[2], h: FLOOR[3], b: false }]);
    const [hx, hy, side] = L.h; walls.push({ x: side === "l" ? hx - 2 : hx + RIM + 0.2, y: hy - 15, w: 1.8, h: 19, b: false, board: true });
    return { walls, rims: [{ x: hx, y: hy }, { x: hx + RIM, y: hy }], bombs: (L.bombs || []).map(b => ({ x: b[0], y: b[1], on: true })), mags: (L.mags || []).map(m => ({ x: m[0], y: m[1] })), hx, hy };
  }
  // advance the ball dt seconds; returns "score", "out", or "" ; ev collects bomb blasts
  function step(W, b, dt, bounce, ev) {
    const n = 4, h = dt / n;
    for (let k = 0; k < n; k++) {
      b.vy += GR * h;
      for (const m of W.mags) { const dx = m.x - b.x, dy = m.y - b.y, d = Math.hypot(dx, dy); if (d < 28 && d > 0.5) { const a = 1500 / (d + 8); b.vx += dx / d * a * h; b.vy += dy / d * a * h; } }
      const py = b.y; b.x += b.vx * h; b.y += b.vy * h;
      b.touch = false;
      for (const w of W.walls) {
        const cx = Math.max(w.x, Math.min(b.x, w.x + w.w)), cy = Math.max(w.y, Math.min(b.y, w.y + w.h)); let dx = b.x - cx, dy = b.y - cy, d = Math.hypot(dx, dy);
        if (d >= BR) continue;
        if (d < 1e-6) { // center inside: push out the short way
          const l = b.x - w.x, r = w.x + w.w - b.x, t = b.y - w.y, bt = w.y + w.h - b.y, m = Math.min(l, r, t, bt);
          if (m === t) { dx = 0; dy = -1; b.y = w.y - BR; } else if (m === bt) { dx = 0; dy = 1; b.y = w.y + w.h + BR; } else if (m === l) { dx = -1; dy = 0; b.x = w.x - BR; } else { dx = 1; dy = 0; b.x = w.x + w.w + BR; }
        } else { dx /= d; dy /= d; b.x = cx + dx * BR; b.y = cy + dy * BR; }
        const vn = b.vx * dx + b.vy * dy;
        if (vn < 0) { const e = w.b ? 1.12 : bounce; b.vx -= (1 + e) * vn * dx; b.vy -= (1 + e) * vn * dy; const tx = -dy, ty = dx, vt = b.vx * tx + b.vy * ty; b.vx -= vt * tx * 0.04; b.vy -= vt * ty * 0.04; if (w.b && ev) ev.push({ k: "boing", x: b.x, y: b.y }); }
        if (dy < -0.5) b.touch = true;
      }
      for (const r of W.rims) { const dx = b.x - r.x, dy = b.y - r.y, d = Math.hypot(dx, dy), rr = BR + 0.8;
        if (d < rr && d > 1e-6) { const nx = dx / d, ny = dy / d; b.x = r.x + nx * rr; b.y = r.y + ny * rr; const vn = b.vx * nx + b.vy * ny; if (vn < 0) { b.vx -= 1.5 * vn * nx; b.vy -= 1.5 * vn * ny; } } }
      for (const q of W.bombs) if (q.on && Math.hypot(b.x - q.x, b.y - q.y) < BR + 3.6) { q.on = false; const dx = b.x - q.x, dy = b.y - q.y, d = Math.hypot(dx, dy) || 1; b.vx = dx / d * 105; b.vy = dy / d * 105; if (ev) ev.push({ k: "boom", x: q.x, y: q.y }); }
      if (py < W.hy && b.y >= W.hy && b.vy > 0 && b.x > W.hx + 1.2 && b.x < W.hx + RIM - 1.2) return "score";
      if (b.y > 175 || b.x < -25 || b.x > 125) return "out";
    }
    return "";
  }
  const SPEED = p => 30 + 100 * p;
  const ENG = { SHOT, world, step, SPEED, BR };
  const levelPts = (shots, par) => Math.max(100, 500 - 100 * Math.max(0, shots - par));
  const stars = (shots, par) => shots <= par ? 3 : shots === par + 1 ? 2 : 1;

  // ---- shared drawing ----
  function view(G) { const S = Math.min(G.W / 100, (G.H - 40) / 150); return { S, ox: (G.W - 100 * S) / 2, oy: G.H - 150 * S - 2 }; }
  function drawCourt(G, c, s, V) {
    const dk = G.dark(), S = V.S, X = x => V.ox + x * S, Y = y => V.oy + y * S;
    const sky = c.createLinearGradient(0, 0, 0, G.H); if (dk) { sky.addColorStop(0, "#141a33"); sky.addColorStop(1, "#2b2350"); } else { sky.addColorStop(0, "#8fd3ff"); sky.addColorStop(1, "#ffe1b8"); }
    c.fillStyle = sky; c.fillRect(0, 0, G.W, G.H);
    c.fillStyle = dk ? "#3b2a1f" : "#d9a066"; c.fillRect(0, Y(146), G.W, G.H - Y(146)); // court floor
    c.fillStyle = dk ? "#5a4030" : "#c48850"; for (let x = 0; x < 100; x += 10) c.fillRect(X(x), Y(146), 1, G.H - Y(146));
    s.W.walls.forEach(w => { if (w.board || w.y >= 146) return;
      if (w.b) { c.fillStyle = "#ff6fae"; c.fillRect(X(w.x), Y(w.y), w.w * S, w.h * S); c.strokeStyle = "#fff"; c.lineWidth = 2; c.beginPath(); for (let x = 0; x <= w.w; x += 3) c.lineTo(X(w.x + x), Y(w.y + (x / 3 % 2 ? 1 : w.h - 1))); c.stroke(); return; }
      c.fillStyle = dk ? "#4b5675" : "#6b7a99"; c.fillRect(X(w.x), Y(w.y), w.w * S, w.h * S);
      c.fillStyle = dk ? "#5d6a8e" : "#8292b3"; c.fillRect(X(w.x), Y(w.y), w.w * S, Math.min(w.h * S, 3)); });
    s.W.mags.forEach(m => { c.strokeStyle = "rgba(255,80,80,0.25)"; c.setLineDash([4, 6]); c.beginPath(); c.arc(X(m.x), Y(m.y), 30 * S * (0.6 + 0.4 * ((G.t * 0.8) % 1)), 0, 7); c.stroke(); c.setLineDash([]); G.emoji(c, "🧲", X(m.x), Y(m.y), 9 * S); });
    s.W.bombs.forEach(q => { if (q.on) G.emoji(c, "💣", X(q.x), Y(q.y), 8 * S); });
    // hoop: backboard, rim, net
    const hx = s.W.hx, hy = s.W.hy, bd = s.W.walls.find(w => w.board);
    c.fillStyle = "#fff"; c.fillRect(X(bd.x), Y(bd.y), bd.w * S, bd.h * S); c.strokeStyle = "#e53935"; c.lineWidth = 2; c.strokeRect(X(bd.x), Y(bd.y), bd.w * S, bd.h * S);
    c.strokeStyle = "rgba(255,255,255,0.9)"; c.lineWidth = 1.5; c.beginPath();
    for (let i = 0; i <= 4; i++) { const a = hx + i * RIM / 4, b2 = hx + 2 + i * (RIM - 4) / 4; c.moveTo(X(a), Y(hy)); c.lineTo(X(b2), Y(hy + 8)); }
    c.moveTo(X(hx + 1), Y(hy + 4)); c.lineTo(X(hx + RIM - 1), Y(hy + 4)); c.moveTo(X(hx + 2), Y(hy + 8)); c.lineTo(X(hx + RIM - 2), Y(hy + 8)); c.stroke();
    c.strokeStyle = "#ff7a1a"; c.lineWidth = Math.max(3, S * 1.2); c.beginPath(); c.moveTo(X(hx), Y(hy)); c.lineTo(X(hx + RIM), Y(hy)); c.stroke();
    (s.fx || []).forEach(f => { c.globalAlpha = Math.max(0, 1 - f.t / 0.6); G.emoji(c, f.k === "boom" ? "💥" : f.k === "swish" ? "✨" : "💫", X(f.x), Y(f.y), (f.k === "boom" ? 16 : 10) * S * (1 + f.t)); c.globalAlpha = 1; });
  }
  function drawBall(G, c, V, b, rot) {
    const S = V.S, x = V.ox + b.x * S, y = V.oy + b.y * S, r = BR * S;
    c.save(); c.translate(x, y); c.rotate(rot || 0); c.fillStyle = "#ff8a1f"; c.beginPath(); c.arc(0, 0, r, 0, 7); c.fill();
    c.strokeStyle = "#7a3a00"; c.lineWidth = Math.max(1, r * 0.14); c.stroke(); c.beginPath(); c.moveTo(-r, 0); c.lineTo(r, 0); c.moveTo(0, -r); c.lineTo(0, r); c.stroke();
    c.beginPath(); c.arc(-r * 1.25, 0, r * 0.9, -0.9, 0.9); c.stroke(); c.beginPath(); c.arc(r * 1.25, 0, r * 0.9, Math.PI - 0.9, Math.PI + 0.9); c.stroke(); c.restore();
  }
  function hud(G, c, s, name) { G.hud(c, `COURT ${s.lv + 1}/12`, `${s.score}`, `SHOTS ${s.shots}`); }
  function banner(G, c, s) {
    if (s.clear > 0) { const st = stars(s.shots, s.L.par); c.fillStyle = "rgba(0,0,0,0.45)"; c.fillRect(0, G.H * 0.3 - 40, G.W, 110);
      G.banner(c, s.shots <= s.L.par ? "SWISH!" : "BUCKET!", "#ffd23f", G.H * 0.3); G.text(c, "★".repeat(st) + "☆".repeat(3 - st), G.W / 2, G.H * 0.3 + 34, 18, "#ffd23f"); G.text(c, `+${levelPts(s.shots, s.L.par)}`, G.W / 2, G.H * 0.3 + 58, 11, "#fff"); }
  }
  function common(key) {
    return {
      newLevel(G) { const s = G.s, L = SHOT[s.lv]; s.L = L; s.W = world(L); s.shots = 0; s.fx = []; s.clear = 0; this.home(G); s.tipT = 4; },
      home(G) { const s = G.s; s.dog = { x: s.L.d[0], y: s.L.d[1] - 4 }; s.ball = { x: s.dog.x + 3, y: s.dog.y - 2, vx: 0, vy: 0 }; s.phase = "aim"; s.rot = 0; s.rest = 0; s.flyT = 0; s.W.bombs.forEach(q => q.on = true); },
      cleared(G) { const s = G.s; s.score += levelPts(s.shots, s.L.par); s.clear = 1.6; s.phase = "clear"; G.sfx("win"); s.fx.push({ k: "swish", x: s.W.hx + RIM / 2, y: s.W.hy + 4, t: 0 }); },
      advance(G) { const s = G.s; s.lv++; if (s.lv >= 12) { s.done = true; return G.over(s.score, "All 12 courts cleared! 🏀"); } this.newLevel(G); },
      save(G) { const s = G.s; if (s.done || s.phase === "clear") return null; return { label: `Court ${s.lv + 1} · ${s.score} pts`, v: { lv: s.lv, score: s.score } }; },
      load(G, sv) { G.s.lv = sv.v.lv; G.s.score = sv.v.score; this.newLevel(G); },
      fly(G, dt) {
        // fixed 1/60 s steps so every throw flies exactly the same on every phone (and matches the level checker)
        const s = G.s, ev = []; let r = ""; s.acc = (s.acc || 0) + dt;
        while (s.acc >= 1 / 60 && !r) { s.acc -= 1 / 60; r = step(s.W, s.ball, 1 / 60, 0.55, ev); }
        if (r) s.acc = 0; s.rot += s.ball.vx * dt * 0.25; s.flyT += dt;
        ev.forEach(e => { s.fx.push(Object.assign(e, { t: 0 })); G.sfx("pop"); if (e.k === "boom") G.buzz(); });
        if (r === "score") return this.cleared(G);
        if (r === "out") { s.fx.push({ k: "poof", x: Math.max(4, Math.min(96, s.ball.x)), y: Math.min(140, s.ball.y), t: 0 }); return "out"; }
        const sp = Math.hypot(s.ball.vx, s.ball.vy); s.rest = sp < 7 && s.ball.touch ? s.rest + dt : 0;
        return s.rest > 0.9 ? "rest" : s.flyT > 9 ? "rest" : "";
      },
      tickFx(G, dt) { const s = G.s; s.fx.forEach(f => f.t += dt); s.fx = s.fx.filter(f => f.t < 0.6); if (s.tipT > 0) s.tipT -= dt; if (s.clear > 0) { s.clear -= dt; if (s.clear <= 0) this.advance(G); } }
    };
  }

  // ======== Pup Shot ========
  const pup = Object.assign(common("pupshot"), {
    key: "pupshot", name: "Pup Shot", icon: "🏀", max: 99999,
    blurb: "Fling it, warp to it, dunk it. 12 courts.",
    how: "Press and pull back, then let go to fling the ball (the dots show the path). While the ball is flying, TAP anywhere to warp your pup to the ball, then fling it again from right there, even in mid-air. Get it through the hoop. Each court is worth 500 if you make it in par shots (the stars), 100 less for each extra shot. If the ball flies off the court it comes back to the start. Stuck? Tap ↺ to restart the court. 12 courts.",
    reset(G) { G.s = { lv: 0, score: 0 }; this.newLevel(G); },
    update(G, dt) {
      const s = G.s; this.tickFx(G, dt);
      if (s.phase === "fly") { const r = this.fly(G, dt); if (r === "out") { G.sfx("lose"); this.home(G); } }
      if (s.phase === "warp") { s.wt -= dt; if (s.wt <= 0) s.phase = "aim"; }
    },
    shoot(G) { const s = G.s, d = s.drag; if (!d || d.p < 0.06) return; const v = ENG.SPEED(d.p);
      s.ball.x = s.dog.x + Math.cos(d.a) * 3; s.ball.y = s.dog.y - Math.sin(d.a) * 3; s.ball.vx = Math.cos(d.a) * v; s.ball.vy = -Math.sin(d.a) * v;
      s.phase = "fly"; s.shots++; s.rest = 0; s.flyT = 0; G.sfx("pop"); },
    warp(G) { const s = G.s; s.dog.x = s.ball.x - 2; s.dog.y = s.ball.y; s.ball.vx = s.ball.vy = 0; s.phase = "warp"; s.wt = 0.12; s.fx.push({ k: "poof", x: s.dog.x, y: s.dog.y, t: 0 }); G.sfx("pop"); },
    draw(G, c) {
      const s = G.s, V = view(G), S = V.S, X = x => V.ox + x * S, Y = y => V.oy + y * S;
      drawCourt(G, c, s, V);
      if (s.phase === "aim" && s.drag && s.drag.p > 0.06) { // trajectory dots
        const v = ENG.SPEED(s.drag.p), b = { x: s.dog.x, y: s.dog.y, vx: Math.cos(s.drag.a) * v, vy: -Math.sin(s.drag.a) * v };
        c.fillStyle = "rgba(255,255,255,0.85)"; for (let i = 1; i <= 16; i++) { const t = i * 0.045; const x = b.x + b.vx * t, y = b.y + b.vy * t + 0.5 * GR * t * t; c.beginPath(); c.arc(X(x), Y(y), Math.max(1.5, S * 0.7 * (1 - i / 22)), 0, 7); c.fill(); }
      }
      G.img(c, s.phase === "clear" ? ":dawgpog:" : s.phase === "fly" ? ":dawgsus:" : ":dawgW:", X(s.dog.x), Y(s.dog.y), 11 * S);
      if (s.phase !== "clear" || s.clear > 1.2) drawBall(G, c, V, s.phase === "aim" || s.phase === "warp" ? { x: s.dog.x + 3.5, y: s.dog.y - 3 } : s.ball, s.rot);
      hud(G, c, s); banner(G, c, s);
      s.btns = [{ k: "reset", x: G.W - 50, y: 40, w: 44, h: 40 }]; c.fillStyle = "rgba(0,0,0,0.45)"; c.beginPath(); c.arc(G.W - 28, 60, 18, 0, 7); c.fill(); G.text(c, "↺", G.W - 28, 61, 14, "#fff");
      if (s.shots >= s.L.par + 5) { s.btns.push({ k: "skip", x: 8, y: 40, w: 70, h: 36 }); c.fillStyle = "rgba(0,0,0,0.45)"; c.fillRect(8, 42, 70, 32); G.text(c, "SKIP", 43, 58, 10, "#fff"); }
      if (s.phase === "fly") G.hint(c, "TAP TO WARP", 99, G.H * 0.2);
      else if (s.tipT > 0 && s.L.tip) G.hint(c, s.L.tip, s.tipT, G.H * 0.2);
    },
    btnAt(G, x, y) { return (G.s.btns || []).find(b => x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h); },
    down(G, x, y) { const s = G.s, b = this.btnAt(G, x, y);
      if (b) { if (b.k === "reset" && s.phase !== "clear") this.home(G); if (b.k === "skip" && s.phase !== "clear") { s.shots = 99; this.advance(G); } return; }
      if (s.phase === "fly") { this.warp(G); return; }
      if (s.phase === "aim") s.drag = { sx: x, sy: y, a: 0.8, p: 0 }; },
    move(G, x, y) { const d = G.s.drag; if (!d || G.s.phase !== "aim") return; const dx = d.sx - x, dy = d.sy - y, L = Math.hypot(dx, dy); d.p = Math.min(1, L / 150); d.a = Math.atan2(-dy, dx); },
    up(G) { const s = G.s; if (s.phase === "aim" && s.drag) this.shoot(G); s.drag = null; },
    onKey(G, k, d) { if (!d) return; const s = G.s; if (k === " " && s.phase === "fly") this.warp(G); }
  });
  pup._eng = ENG; defGame(pup);

})();
