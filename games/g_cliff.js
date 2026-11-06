// ---------- Cliff Dawg (cliff dive down a narrowing canyon) ----------
// Hold to charge, let go to leap off the cliff. Then steer (hold left/right) as you fall down a canyon
// that pinches tighter toward the bottom. Hit the walls and it's a splat; land in the pool to dive again,
// each canyon deeper and tighter. Score per dive = 100 + accuracy (up to 100) + depth bonus, +100 for a PERFECT.
// World: x = screen x, y grows down from the cliff top (y = 0). Camera only scrolls vertically (camY).
defGame({
  key: "cliff", name: "Cliff Dawg", icon: "🏞️", max: 99999,
  blurb: "Leap, steer, nail the tiny pool at the bottom.",
  how: "Hold anywhere to charge your jump (the meter swings up and down), then let go to leap off the cliff. Too weak and you hit the cliff, too strong and you hit the far wall. While you fall, hold the left or right side (or the arrow keys) to steer. The canyon gets narrower toward the bottom, and rocks stick out of the walls on deeper dives. Land in the pool to score, more for hitting the middle and +100 for a PERFECT. Every dive is deeper and tighter. Touch a wall and it's over.",
  R: 12, STEP: 30,
  reset(G) {
    G.s = { lvl: 1, pts: 0, streak: 0, keys: {}, hold: 0, pops: [], drops: [] };
    this.level(G);
  },
  level(G) {
    const s = G.s, W = G.W, H = G.H, lvl = s.lvl;
    const D = Math.min(3600, 1100 + lvl * 260);
    const pw = Math.max(40, 112 - lvl * 7);
    const cx = W * 0.5 + (Math.random() - 0.5) * W * Math.min(0.42, 0.12 + lvl * 0.05);
    const L0 = Math.min(90, W * 0.2), R0 = W - 24;
    const n = Math.ceil(D / this.STEP) + 1, L = [], Rt = [];
    for (let i = 0; i < n; i++) {
      const f = Math.min(1, (i * this.STEP) / D), e = Math.pow(f, 1.7); // pinches hardest near the bottom
      L.push(L0 + (cx - pw / 2 - L0) * e); Rt.push(R0 + (cx + pw / 2 - R0) * e);
    }
    // rocks sticking out of the walls (more and bigger as you go)
    const rocks = Math.min(8, lvl - 1 + Math.floor(lvl / 3));
    for (let k = 0; k < rocks; k++) {
      const i = Math.floor(n * (0.15 + Math.random() * 0.65)), span = 4 + Math.floor(Math.random() * 3), left = Math.random() < 0.5;
      const gap = Rt[i] - L[i], amp = Math.min(gap - pw - 46, 24 + Math.random() * (14 + lvl * 5));
      if (amp < 12) continue;
      for (let j = -span; j <= span; j++) {
        const q = i + j; if (q < 1 || q >= n - 4) continue;
        const a = amp * (1 - Math.abs(j) / (span + 1));
        if (left) L[q] = Math.max(L[q], Math.min(L[q] + a, Rt[q] - pw - 40)); else Rt[q] = Math.min(Rt[q], Math.max(Rt[q] - a, L[q] + pw + 40));
      }
    }
    // a few bones floating down the middle line
    const bones = [];
    for (let k = 0; k < 3 + Math.min(4, lvl); k++) { const y = D * (0.2 + 0.7 * Math.random()), w = this.walls(L, Rt, y); bones.push({ x: w[0] + (w[1] - w[0]) * (0.25 + Math.random() * 0.5), y, got: 0 }); }
    Object.assign(s, { D, pw, cx, L, Rt, bones, phase: "aim", charge: 0, ct: 0, splash: 0, p: { x: L0 - 26, y: -this.R, vx: 0, vy: 0, rot: 0 }, camY: -H * 0.42 });
  },
  walls(L, Rt, y) {
    const f = Math.max(0, y) / this.STEP, i = Math.min(L.length - 2, Math.floor(f)), t = Math.min(1, f - i);
    return [L[i] + (L[i + 1] - L[i]) * t, Rt[i] + (Rt[i + 1] - Rt[i]) * t];
  },
  jump(G) {
    const s = G.s; if (s.phase !== "aim" || !s.charging) return;
    s.charging = false; s.phase = "fall";
    s.p.vx = 40 + s.charge * (G.W * 0.75); s.p.vy = -300; G.sfx("pop");
  },
  update(G, dt) {
    const s = G.s, p = s.p, H = G.H, R = this.R;
    s.pops.forEach(o => { o.t -= dt; o.y -= 30 * dt; }); s.pops = s.pops.filter(o => o.t > 0);
    s.drops.forEach(d => { d.x += d.vx * dt; d.y += d.vy * dt; d.vy += 700 * dt; d.t -= dt; }); s.drops = s.drops.filter(d => d.t > 0);
    if (s.phase === "aim") {
      if (s.charging) { s.ct += dt; s.charge = 0.5 - 0.5 * Math.cos(s.ct * Math.PI / 0.9); } // swings 0 -> 1 -> 0
      s.camY += (-H * 0.42 - s.camY) * Math.min(1, dt * 5);
      return;
    }
    if (s.phase === "splash") {
      s.splash -= dt;
      if (s.splash <= 0) { s.lvl++; this.level(G); s.pops.push({ x: G.W / 2, y: s.camY + H * 0.35, t: 1.4, txt: `DIVE ${s.lvl}` }); }
      return;
    }
    // falling: steer, gravity, terminal speed
    const dir = s.hold || ((s.keys.ArrowRight ? 1 : 0) - (s.keys.ArrowLeft ? 1 : 0));
    p.vx += dir * 760 * dt; p.vx *= Math.pow(0.35, dt); p.vx = Math.max(-280, Math.min(280, p.vx));
    p.vy = Math.min(470 + s.lvl * 8, p.vy + 820 * dt);
    p.x += p.vx * dt; p.y += p.vy * dt; p.rot += (p.vx * 0.01 + 3) * dt;
    s.camY += (Math.min(p.y - H * 0.3, s.D + 90 - H) - s.camY) * Math.min(1, dt * 8);
    for (const b of s.bones) if (!b.got && Math.hypot(b.x - p.x, b.y - p.y) < 22) { b.got = 1; s.pts += 15; G.sfx("pop"); s.pops.push({ x: b.x, y: b.y - 14, t: 0.8, txt: "+15" }); }
    if (p.y + R > 0 && p.y < s.D) {
      const [l, r] = this.walls(s.L, s.Rt, p.y + R * 0.5);
      if (p.x - R < l || p.x + R > r) return this.splat(G);
    }
    if (p.y >= s.D) {
      const acc = Math.max(0, 1 - Math.abs(p.x - s.cx) / (s.pw / 2));
      const perfect = acc > 0.82;
      const pts = 100 + Math.round(acc * 100) + (s.lvl - 1) * 25 + (perfect ? 100 : 0);
      s.pts += pts; s.streak = perfect ? s.streak + 1 : 0;
      s.phase = "splash"; s.splash = 1.5; p.y = s.D + 6;
      for (let k = 0; k < 18; k++) s.drops.push({ x: p.x, y: s.D, vx: (Math.random() - 0.5) * 220, vy: -150 - Math.random() * 250, t: 0.9 });
      G.sfx("win");
      s.pops.push({ x: p.x, y: s.D - 40, t: 1.4, txt: perfect ? (s.streak > 1 ? `PERFECT x${s.streak}!` : "PERFECT!") : `+${pts}` });
    }
  },
  splat(G) {
    const s = G.s; s.phase = "dead"; G.sfx("lose"); G.buzz();
    const sc = s.pts;
    G.over(sc, s.lvl >= 6 ? "Cliff legend!" : s.lvl >= 3 ? "Splat!" : "Ouch. Steer!");
  },
  side(G, x) { G.s.hold = x < G.W / 2 ? -1 : 1; },
  down(G, x) { const s = G.s; if (s.phase === "aim") { s.charging = true; s.ct = 0; s.charge = 0; } else this.side(G, x); },
  move(G, x) { if (G.s.phase === "fall" && G.s.hold) this.side(G, x); },
  up(G) { const s = G.s; if (s.phase === "aim") this.jump(G); s.hold = 0; },
  onKey(G, k, isDown) {
    const s = G.s;
    if (k === "ArrowLeft" || k === "ArrowRight") s.keys[k] = isDown;
    if (k === " " || k === "ArrowUp" || k === "Enter") { if (isDown && s.phase === "aim" && !s.charging) { s.charging = true; s.ct = 0; } else if (!isDown) this.jump(G); }
  },
  draw(G, c) {
    const s = G.s, W = G.W, H = G.H, p = s.p, cy = s.camY, dark = G.dark();
    const sky = c.createLinearGradient(0, 0, 0, H);
    sky.addColorStop(0, dark ? "#0e1a33" : "#7cc4ff"); sky.addColorStop(1, dark ? "#1b2e4a" : "#cfeaff");
    c.fillStyle = sky; c.fillRect(0, 0, W, H);
    // canyon shadow gets darker as you go deeper
    const deep = Math.max(0, Math.min(1, (cy + H / 2) / s.D));
    c.fillStyle = `rgba(20,10,30,${0.15 + deep * 0.45})`; c.fillRect(0, Math.max(0, -cy), W, H);
    // rock walls
    const y0 = Math.max(0, cy - 10), y1 = Math.min(s.D, cy + H + 10);
    const rock = dark ? "#5a3d2b" : "#a0663f", rock2 = dark ? "#43291c" : "#7f4c2c";
    if (y1 > y0) {
      c.fillStyle = rock; c.beginPath(); c.moveTo(0, y0 - cy);
      for (let y = y0; y <= y1; y += 10) c.lineTo(this.walls(s.L, s.Rt, y)[0], y - cy);
      c.lineTo(0, y1 - cy); c.fill();
      c.beginPath(); c.moveTo(W, y0 - cy);
      for (let y = y0; y <= y1; y += 10) c.lineTo(this.walls(s.L, s.Rt, y)[1], y - cy);
      c.lineTo(W, y1 - cy); c.fill();
      // strata lines
      c.strokeStyle = rock2; c.lineWidth = 2;
      for (let y = Math.ceil(y0 / 70) * 70; y < y1; y += 70) {
        const [l, r] = this.walls(s.L, s.Rt, y);
        c.beginPath(); c.moveTo(0, y - cy); c.lineTo(l - 4, y - cy + 6); c.stroke();
        c.beginPath(); c.moveTo(W, y - cy); c.lineTo(r + 4, y - cy + 6); c.stroke();
      }
    }
    // the cliff top + grass where you jump from
    const [l0] = this.walls(s.L, s.Rt, 0);
    if (-cy > -40) { c.fillStyle = "#4caf50"; c.fillRect(0, -cy - 6, l0, 8); c.fillStyle = rock; c.fillRect(0, -cy + 2, l0, 4); }
    // pool + floor at the bottom
    const by = s.D - cy;
    if (by < H + 20) {
      const [l, r] = this.walls(s.L, s.Rt, s.D);
      c.fillStyle = rock2; c.fillRect(0, by, W, H - by + 10);
      c.fillStyle = "#29b6f6"; c.fillRect(l, by - 2, r - l, 26);
      c.fillStyle = "rgba(255,255,255,0.6)"; c.fillRect(s.cx - 3, by - 2, 6, 4); // bullseye mark
      c.fillStyle = rock; c.fillRect(0, by, l, H - by + 10); c.fillRect(r, by, W - r, H - by + 10);
    }
    s.bones.forEach(b => { if (!b.got && b.y - cy > -20 && b.y - cy < H + 20) G.emoji(c, "🦴", b.x, b.y - cy, 16); });
    c.fillStyle = "#4fc3f7"; s.drops.forEach(d => { c.beginPath(); c.arc(d.x, d.y - cy, 3, 0, 7); c.fill(); });
    if (s.phase !== "splash") G.img(c, s.phase === "dead" ? ":dawgpain:" : s.phase === "aim" ? ":dawgW:" : ":dawgpog:", p.x, p.y - cy, 26, s.phase === "fall" ? p.rot : 0);
    // charge meter while aiming
    if (s.phase === "aim") {
      const mx = W - 34, mh = Math.min(170, H * 0.3), my = H * 0.5 - mh / 2;
      c.fillStyle = "rgba(0,0,0,0.45)"; c.fillRect(mx - 3, my - 3, 20, mh + 6);
      const gg = c.createLinearGradient(0, my + mh, 0, my); gg.addColorStop(0, "#66bb6a"); gg.addColorStop(0.6, "#ffd23f"); gg.addColorStop(1, "#ff5252");
      c.fillStyle = gg; c.fillRect(mx, my + mh * (1 - s.charge), 14, mh * s.charge);
      G.text(c, "POWER", mx + 7, my - 14, 8, "#fff");
      // dotted guess at where this jump goes
      if (s.charging) {
        c.fillStyle = "rgba(255,255,255,0.8)";
        let x = p.x, y = p.y, vx = 40 + s.charge * (W * 0.75), vy = -300;
        for (let i = 0; i < 9; i++) { for (let k = 0; k < 4; k++) { x += vx * 0.02; y += vy * 0.02; vy += 820 * 0.02; } c.beginPath(); c.arc(x, y - cy, 2.5, 0, 7); c.fill(); }
      }
    }
    s.pops.forEach(o => { c.globalAlpha = Math.min(1, o.t * 2); G.text(c, o.txt, o.x, o.y - cy, 13, "#ffd23f"); c.globalAlpha = 1; });
    const depth = Math.max(0, Math.round((s.D - Math.max(0, p.y)) / 10));
    G.hud(c, `SCORE ${s.pts}`, `DIVE ${s.lvl}`, s.phase === "fall" ? `${depth}m` : "");
    if (G.state === "play" && s.phase === "aim") G.hint(c, "HOLD, THEN LET GO", 99);
    if (G.state === "play" && s.phase === "fall" && s.lvl === 1) G.hint(c, "HOLD LEFT / RIGHT TO STEER", 99, 80);
  }
});
