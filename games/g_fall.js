// ---------- Fall Dawg (FallDown!-style) ----------
// Rows of bars keep rising. Hold the left or right side to roll the Big Dawg through the gaps.
// Get pushed up into the spikes and you're done. Score = rows dropped (x10) + bones (+25).
defGame({
  key: "fall", name: "Fall Dawg", icon: "⬇️", max: 99999,
  blurb: "Roll through the gaps. Don't hit the spikes.",
  how: "The bars keep rising. Hold the left or right side of the screen (or use the arrow keys) to roll the Big Dawg into a gap and drop through. Every row you drop is +10, and bones in the gaps are +25. If the bars push you up into the spikes at the top, it's over. It gets faster the longer you last.",
  ROWGAP: 92, TOP: 48,
  reset(G) {
    const W = G.W, H = G.H;
    const s = G.s = { p: { x: W / 2, y: H * 0.3, vx: 0, vy: 0, rot: 0 }, rows: [], hold: 0, keys: {}, t: 0, spd: 62, pts: 0, pops: [], stars: [], lastSpd: 0 };
    for (let i = 0; i < 40; i++) s.stars.push({ x: Math.random() * W, y: Math.random() * H, r: Math.random() * 1.6 + 0.3 });
    let y = H * 0.48;
    while (y < H + this.ROWGAP * 2) { s.rows.push(this.row(G, y)); y += this.ROWGAP; }
  },
  row(G, y) {
    const s = G.s, W = G.W;
    const gw = Math.max(50, 86 - s.t * 0.55);
    const gaps = [];
    const two = s.t < 25 && Math.random() < 0.35;
    const n = two ? 2 : 1;
    for (let k = 0; k < n; k++) {
      let x, tries = 0;
      do { x = 8 + Math.random() * (W - gw - 16); tries++; } while (tries < 20 && gaps.some(g => Math.abs(g.x - x) < gw + 40));
      gaps.push({ x, w: gw });
    }
    const g0 = gaps[0];
    return { y, gaps, hue: (y * 0.7 + s.t * 20) % 360, bone: Math.random() < 0.28 ? { x: g0.x + g0.w / 2, got: 0 } : null, passed: false };
  },
  inGap(row, x, r) { return row.gaps.some(g => x - r * 0.55 >= g.x && x + r * 0.55 <= g.x + g.w); },
  update(G, dt) {
    const s = G.s, p = s.p, W = G.W, H = G.H, R = 14;
    s.t += dt;
    s.spd = Math.min(250, 62 + s.t * 3.1);
    if (Math.floor(s.spd / 40) > s.lastSpd) { if (s.lastSpd) s.pops.push({ x: W / 2, y: H * 0.5, t: 1.1, txt: "FASTER!" }); s.lastSpd = Math.floor(s.spd / 40); }
    const d = s.spd * dt;
    s.rows.forEach(r => r.y -= d);
    s.stars.forEach(st => { st.y -= d * 0.25; if (st.y < 0) { st.y += H; st.x = Math.random() * W; } });
    while (s.rows.length && s.rows[0].y < this.TOP - 20) s.rows.shift();
    while (s.rows[s.rows.length - 1].y < H + this.ROWGAP) s.rows.push(this.row(G, s.rows[s.rows.length - 1].y + this.ROWGAP));
    // roll left/right
    const dir = s.hold || ((s.keys.ArrowRight ? 1 : 0) - (s.keys.ArrowLeft ? 1 : 0));
    p.vx += (dir * 300 - p.vx) * Math.min(1, dt * 8);
    p.x = Math.max(R, Math.min(W - R, p.x + p.vx * dt));
    p.rot += p.vx * dt / R;
    // fall, land on bars that aren't a gap
    const prevBottom = p.y + R;
    p.vy = Math.min(620, p.vy + 1500 * dt);
    p.y += p.vy * dt;
    for (const r of s.rows) {
      if (this.inGap(r, p.x, R)) continue;
      if (prevBottom <= r.y + d + 0.5 && p.y + R >= r.y) { p.y = r.y - R; p.vy = 0; break; }
    }
    if (p.y > H - R) { p.y = H - R; p.vy = 0; }
    // dropped through a row
    for (const r of s.rows) {
      if (!r.passed && p.y - R > r.y + 6) { r.passed = true; s.pts += 10; }
      if (r.bone && !r.bone.got && Math.abs(p.x - r.bone.x) < 20 && Math.abs(p.y - (r.y - 4)) < 22) {
        r.bone.got = 1; s.pts += 25; G.sfx("pop"); s.pops.push({ x: r.bone.x, y: r.y - 20, t: 0.8, txt: "+25" });
      }
    }
    s.pops.forEach(o => { o.t -= dt; o.y -= 30 * dt; }); s.pops = s.pops.filter(o => o.t > 0);
    if (p.y - R < this.TOP) {
      G.sfx("lose"); G.buzz();
      const sc = s.pts;
      G.over(sc, sc >= 1500 ? "Bottomless dawg!" : sc >= 500 ? "Spiked!" : "Keep rolling!");
    }
  },
  side(G, x) { G.s.hold = x < G.W / 2 ? -1 : 1; },
  down(G, x) { this.side(G, x); },
  move(G, x) { if (G.s.hold) this.side(G, x); },
  up(G) { G.s.hold = 0; },
  onKey(G, k, isDown) { if (k === "ArrowLeft" || k === "ArrowRight") G.s.keys[k] = isDown; },
  draw(G, c) {
    const s = G.s, W = G.W, H = G.H, p = s.p, dark = G.dark();
    const g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, dark ? "#0b0b1e" : "#1d1b4a"); g.addColorStop(1, dark ? "#1a1236" : "#4a2a7a");
    c.fillStyle = g; c.fillRect(0, 0, W, H);
    c.fillStyle = "rgba(255,255,255,0.7)"; s.stars.forEach(st => { c.beginPath(); c.arc(st.x, st.y, st.r, 0, 7); c.fill(); });
    // bars
    for (const r of s.rows) {
      const segs = []; let x = 0;
      r.gaps.slice().sort((a, b) => a.x - b.x).forEach(gp => { segs.push([x, gp.x]); x = gp.x + gp.w; }); segs.push([x, W]);
      segs.forEach(([a, b]) => {
        if (b - a < 1) return;
        c.fillStyle = `hsl(${r.hue},70%,58%)`;
        c.beginPath(); if (c.roundRect) c.roundRect(a, r.y, b - a, 12, 6); else c.rect(a, r.y, b - a, 12); c.fill();
        c.fillStyle = "rgba(255,255,255,0.35)"; c.fillRect(a + 4, r.y + 2, Math.max(0, b - a - 8), 3);
      });
      if (r.bone && !r.bone.got) G.emoji(c, "🦴", r.bone.x, r.y - 4, 18);
    }
    // spikes under the HUD
    c.fillStyle = "#ff4d6d";
    for (let x = 0; x < W; x += 14) { c.beginPath(); c.moveTo(x, this.TOP - 12); c.lineTo(x + 7, this.TOP); c.lineTo(x + 14, this.TOP - 12); c.fill(); }
    c.fillStyle = "#ff4d6d"; c.fillRect(0, 34, W, this.TOP - 46);
    // danger glow when close to the spikes
    const near = Math.max(0, 1 - (p.y - this.TOP) / 120);
    if (near > 0) { c.fillStyle = `rgba(255,60,90,${0.25 * near})`; c.fillRect(0, 0, W, H); }
    G.img(c, G.state === "over" ? ":dawgpain:" : near > 0.5 ? ":dawgpog:" : ":dawgW:", p.x, p.y, 30, p.rot);
    s.pops.forEach(o => { c.globalAlpha = Math.min(1, o.t * 2); G.text(c, o.txt, o.x, o.y, 12, "#ffd23f"); c.globalAlpha = 1; });
    G.hud(c, `SCORE ${s.pts}`, "FALL DAWG", `${Math.round(s.spd)}`);
    if (G.state === "play") G.hint(c, "HOLD LEFT / RIGHT", 4);
  }
});
