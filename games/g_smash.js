// ---------- Squirrel Smash (whack-a-mole) ----------
// Squirrels pop out of 9 holes in the yard. Tap them before they duck. Don't bop the pup.
defGame({
  key: "smash", name: "Squirrel Smash", icon: "🐿️", max: 9999,
  blurb: "Whack-a-mole. Bop squirrels, not pups.",
  how: "Squirrels pop out of the holes. Tap them fast. Golden ones are worth extra. Don't bop the pups. 30 seconds on the clock.",
  reset(G) {
    G.s = { holes: [], time: 30, score: 0, combo: 0, spawn: 0.6, pops: [] };
    const cols = 3, rows = 3, top = 90, gw = G.W / cols, gh = (G.H - top - 30) / rows;
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) G.s.holes.push({ x: gw * c + gw / 2, y: top + gh * r + gh * 0.62, who: null, t: 0, up: 0, hit: 0 });
  },
  update(G, dt) {
    const s = G.s; s.time -= dt;
    if (s.time <= 0) { G.over(s.score, s.score >= 300 ? "Squirrel menace!" : "Time!"); return; }
    s.spawn -= dt;
    const pace = 1 - (30 - s.time) / 45; // gets faster as the clock runs down
    if (s.spawn <= 0) {
      s.spawn = 0.35 + Math.random() * 0.5 * pace;
      const free = s.holes.filter(h => !h.who);
      if (free.length) {
        const h = free[Math.floor(Math.random() * free.length)], r = Math.random();
        h.who = r < 0.12 ? "gold" : r < 0.3 ? "pup" : "sq"; h.t = 0.7 + Math.random() * 0.6 * pace; h.up = 0; h.hit = 0;
      }
    }
    s.holes.forEach(h => {
      if (!h.who) return;
      h.up = Math.min(1, h.up + dt * 7);
      if (h.hit) { h.hit -= dt; if (h.hit <= 0) h.who = null; return; }
      h.t -= dt; if (h.t <= 0) { if (h.who !== "pup") s.combo = 0; h.who = null; }
    });
    s.pops.forEach(p => p.t -= dt); s.pops = s.pops.filter(p => p.t > 0);
  },
  tap(G, x, y) {
    const s = G.s;
    const h = s.holes.find(h => h.who && !h.hit && Math.abs(x - h.x) < 46 && y > h.y - 80 && y < h.y + 24);
    if (!h) return;
    if (h.who === "pup") { s.score = Math.max(0, s.score - 15); s.combo = 0; s.pops.push({ x: h.x, y: h.y - 60, t: 0.6, txt: "-15", c: "#ff6b6b" }); G.sfx("lose"); G.buzz(); }
    else { s.combo++; const pts = (h.who === "gold" ? 30 : 10) + Math.min(20, (s.combo - 1) * 2); s.score += pts; s.pops.push({ x: h.x, y: h.y - 60, t: 0.6, txt: "+" + pts, c: "#ffd23f" }); G.sfx("pop"); }
    h.hit = 0.25;
  },
  draw(G, c) {
    const s = G.s, W = G.W, H = G.H, dark = G.dark();
    c.fillStyle = dark ? "#1f3a1c" : "#7cc35b"; c.fillRect(0, 0, W, H);
    c.fillStyle = dark ? "#244520" : "#86cd64"; for (let y = 0; y < H; y += 24) for (let x = (y / 24) % 2 ? 12 : 0; x < W; x += 24) c.fillRect(x, y, 12, 12);
    // picket fence
    c.fillStyle = dark ? "#9a9aa8" : "#fafafa"; for (let x = 4; x < W; x += 22) { c.fillRect(x, 44, 14, 34); c.beginPath(); c.moveTo(x, 44); c.lineTo(x + 7, 36); c.lineTo(x + 14, 44); c.fill(); }
    c.fillRect(0, 54, W, 6); c.fillRect(0, 68, W, 6);
    (s.holes || []).forEach(h => {
      c.fillStyle = "#3b2414"; c.beginPath(); c.ellipse(h.x, h.y, 40, 14, 0, 0, 7); c.fill();
      if (h.who) {
        c.save(); c.beginPath(); c.rect(h.x - 50, h.y - 110, 100, 110); c.clip();
        const yy = h.y - 10 - 36 * h.up + (h.hit ? 8 : 0);
        if (h.who === "pup") G.img(c, ":dawgpog:", h.x, yy, 54); else G.emoji(c, "🐿️", h.x, yy, 46);
        if (h.who === "gold") G.emoji(c, "✨", h.x + 22, yy - 22, 20);
        if (h.hit && h.who !== "pup") G.emoji(c, "💥", h.x, yy - 6, 34);
        c.restore();
      }
      c.fillStyle = "#5a3a22"; c.beginPath(); c.ellipse(h.x, h.y + 3, 42, 8, 0, 0, Math.PI); c.fill();
    });
    (s.pops || []).forEach(p => G.text(c, p.txt, p.x, p.y - (0.6 - p.t) * 40, 12, p.c));
    c.fillStyle = "rgba(0,0,0,0.35)"; c.fillRect(0, 0, W, 30);
    G.text(c, `SCORE ${s.score || 0}`, 10, 15, 11, "#fff", "left");
    G.text(c, `${Math.max(0, Math.ceil(s.time || 0))}s`, W - 10, 15, 11, (s.time || 30) < 6 ? "#ff6b6b" : "#ffd23f", "right");
    if (s.combo > 2) G.text(c, `x${s.combo}`, W / 2, 15, 11, "#ffd23f");
  }
});
