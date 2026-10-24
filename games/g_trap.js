// ---------- Pup Trap (Rodent's Revenge-style block pusher) ----------
// You're the pup. Push rows of crates to box in the cats. When every cat on the board is stuck, they all turn to cheese.
(function () {
  const COLS = 11;
  const D4 = [[1, 0], [-1, 0], [0, 1], [0, -1]], D8 = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]];
  function geo(G) { const top = 44, cell = Math.floor(Math.min((G.W - 12) / COLS, (G.H - top - 10) / 13)); const rows = Math.floor((G.H - top - 10) / cell); return { cell, rows, x0: Math.floor((G.W - cell * COLS) / 2), y0: top + Math.floor((G.H - top - 10 - rows * cell) / 2) }; }
  // grid codes: 0 floor, 1 wall (border/rock, can't move), 2 crate (pushable), 3 cheese
  function level(G) {
    const s = G.s, g = geo(G), R = g.rows; s.R = R; s.grid = [];
    for (let r = 0; r < R; r++) { s.grid.push([]); for (let c = 0; c < COLS; c++) s.grid[r].push(r === 0 || c === 0 || r === R - 1 || c === COLS - 1 ? 1 : 0); }
    // a big block of crates with a free ring around it
    for (let r = 3; r < R - 3; r++) for (let c = 3; c < COLS - 3; c++) s.grid[r][c] = 2;
    // a few gaps in the crates, and from level 2 some rocks you can't push
    for (let i = 0; i < 4 + s.lvl; i++) { const r = 3 + Math.floor(Math.random() * (R - 6)), c = 3 + Math.floor(Math.random() * (COLS - 6)); s.grid[r][c] = 0; }
    for (let i = 0; i < Math.min(8, (s.lvl - 1) * 2); i++) { const r = 1 + Math.floor(Math.random() * (R - 2)), c = 1 + Math.floor(Math.random() * (COLS - 2)); if (s.grid[r][c] === 2 || Math.random() < 0.4) s.grid[r][c] = 1; }
    s.p = { r: Math.floor(R / 2), c: Math.floor(COLS / 2) }; s.grid[s.p.r][s.p.c] = 0;
    s.wave = 0; s.cats = []; this.spawn(G);
    s.msg = { txt: `LEVEL ${s.lvl}`, t: 1.4 };
  }
  function free(s, r, c) { return r >= 0 && c >= 0 && r < s.R && c < COLS && s.grid[r][c] === 0 && !s.cats.some(k => k.r === r && k.c === c); }
  function catMoves(s, k) { return D8.filter(([dc, dr]) => { const r = k.r + dr, c = k.c + dc; return (r === s.p.r && c === s.p.c) || (free(s, r, c) && !(s.grid[r][c] === 3)); }); }
  defGame({
    key: "trap", name: "Pup Trap", icon: "🧀", max: 999999,
    blurb: "Push crates. Trap the cats. Eat the cheese.",
    how: "You're the pup. Tap or hold on the side you want to move. Walk into crates to push the whole row (if there's room at the end). Box in the cats: when EVERY cat on the board is stuck, they all turn into 🧀 cheese. Eat cheese for points. Clear 3 waves to finish a level. Gray rocks don't move. Get caught 3 times and it's over.",
    spawn(G) {
      const s = G.s, n = Math.min(6, 1 + s.wave + Math.floor(s.lvl / 2)), spots = [];
      for (let r = 1; r < s.R - 1; r++) for (let c = 1; c < COLS - 1; c++) if (free(s, r, c) && Math.abs(r - s.p.r) + Math.abs(c - s.p.c) > 6) spots.push([r, c]);
      spots.sort(() => Math.random() - 0.5);
      for (let i = 0; i < n && i < spots.length; i++) s.cats.push({ r: spots[i][0], c: spots[i][1], stuck: 0 });
      s.ct = 1.2;
    },
    reset(G) { G.s = { lvl: 1, score: 0, lives: 3, hold: null, rep: 0, hurt: 0, pops: [], msg: null }; level.call(this, G); },
    step(G, dc, dr) {
      const s = G.s; if (s.hurt > 0) return;
      const r = s.p.r + dr, c = s.p.c + dc; if (r < 0 || c < 0 || r >= s.R || c >= COLS) return;
      const v = s.grid[r][c];
      if (s.cats.some(k => k.r === r && k.c === c)) return;
      if (v === 1) return;
      if (v === 2) { // push the whole row of crates
        let er = r, ec = c; while (s.grid[er] && s.grid[er][ec] === 2) { er += dr; ec += dc; }
        if (!s.grid[er] || s.grid[er][ec] !== 0 || s.cats.some(k => k.r === er && k.c === ec)) return; // blocked (wall, cheese or a cat at the end)
        s.grid[er][ec] = 2; s.grid[r][c] = 0; G.sfx("pop");
      }
      if (v === 3) { s.grid[r][c] = 0; s.score += 100; s.pops.push({ r, c, t: 0.7, txt: "+100" }); G.sfx("win"); }
      s.p.r = r; s.p.c = c;
      if (!s.cats.length && !s.grid.some(row => row.includes(3))) this.nextWave(G);
    },
    nextWave(G) {
      const s = G.s; s.wave++;
      if (s.wave >= 3) { s.score += 250 * s.lvl; s.lvl++; G.sfx("win"); level.call(this, G); s.msg = { txt: `LEVEL ${s.lvl}! +${250 * (s.lvl - 1)}`, t: 1.6 }; return; }
      this.spawn(G); s.msg = { txt: `WAVE ${s.wave + 1} OF 3`, t: 1.2 };
    },
    dirTo(G, x, y) { const g = geo(G), px = g.x0 + (G.s.p.c + 0.5) * g.cell, py = g.y0 + (G.s.p.r + 0.5) * g.cell, dx = x - px, dy = y - py; if (Math.max(Math.abs(dx), Math.abs(dy)) < g.cell * 0.4) return null; return Math.abs(dx) > Math.abs(dy) ? [Math.sign(dx), 0] : [0, Math.sign(dy)]; },
    down(G, x, y) { const s = G.s; s.hold = { x, y }; const d = this.dirTo(G, x, y); if (d) this.step(G, d[0], d[1]); s.rep = 0.28; },
    move(G, x, y) { if (G.s.hold) G.s.hold = { x, y }; },
    up(G) { G.s.hold = null; },
    onKey(G, k, d) { if (!d) return; const m = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[k]; if (m) this.step(G, m[0], m[1]); },
    update(G, dt) {
      const s = G.s; if (s.msg) { s.msg.t -= dt; if (s.msg.t <= 0) s.msg = null; }
      s.pops.forEach(p => p.t -= dt); s.pops = s.pops.filter(p => p.t > 0);
      if (s.hurt > 0) { s.hurt -= dt; return; }
      // cheese you can't reach (boxed in) goes stale after 20s so the game never gets stuck
      if (!s.cats.length && s.cheeseT > 0) { s.cheeseT -= dt; if (s.cheeseT <= 0) { s.grid.forEach(row => row.forEach((v, i) => { if (v === 3) row[i] = 0; })); s.msg = { txt: "THE CHEESE WENT STALE", t: 1.2 }; this.nextWave(G); } }
      if (s.hold) { s.rep -= dt; if (s.rep <= 0) { s.rep = 0.13; const d = this.dirTo(G, s.hold.x, s.hold.y); if (d) this.step(G, d[0], d[1]); } }
      // cats move on a beat
      s.ct -= dt; if (s.ct > 0) return;
      s.ct = Math.max(0.32, 0.75 - s.lvl * 0.05 - s.wave * 0.03);
      let allStuck = s.cats.length > 0;
      for (const k of s.cats) {
        const mv = catMoves(s, k);
        if (!mv.length) { k.stuck = 1; continue; }
        k.stuck = 0; allStuck = false;
        mv.sort((a, b) => Math.hypot(k.r + a[1] - s.p.r, k.c + a[0] - s.p.c) - Math.hypot(k.r + b[1] - s.p.r, k.c + b[0] - s.p.c));
        const pick = Math.random() < 0.15 && mv.length > 1 ? mv[1] : mv[0]; // a little randomness so they don't stack perfectly
        k.r += pick[1]; k.c += pick[0];
        if (k.r === s.p.r && k.c === s.p.c) {
          s.lives--; s.hurt = 1.2; G.buzz(); G.sfx("lose");
          if (s.lives <= 0) { G.over(Math.min(999999, s.score), s.lvl > 2 ? "The cats finally got you." : "Caught by a cat!"); return; }
          s.msg = { txt: "CAUGHT!", t: 1.1 };
          // that cat goes back to a far corner
          const far = [[1, 1], [1, COLS - 2], [s.R - 2, 1], [s.R - 2, COLS - 2]].filter(([r, c]) => free(s, r, c)).sort((a, b) => Math.hypot(b[0] - s.p.r, b[1] - s.p.c) - Math.hypot(a[0] - s.p.r, a[1] - s.p.c))[0];
          if (far) { k.r = far[0]; k.c = far[1]; }
          return;
        }
      }
      if (allStuck) { s.cats.forEach(k => { s.grid[k.r][k.c] = 3; s.pops.push({ r: k.r, c: k.c, t: 0.8, txt: "🧀" }); }); s.score += 50 * s.cats.length; s.cats = []; s.cheeseT = 20; G.sfx("win"); s.msg = { txt: "TRAPPED! EAT THE CHEESE", t: 1.5 }; }
    },
    draw(G, c) {
      const s = G.s, g = geo(G), dark = G.dark(), z = g.cell;
      c.fillStyle = dark ? "#1c1a26" : "#f3e9d2"; c.fillRect(0, 0, G.W, G.H);
      for (let r = 0; r < s.R; r++) for (let q = 0; q < COLS; q++) {
        const x = g.x0 + q * z, y = g.y0 + r * z, v = s.grid[r][q];
        c.fillStyle = (r + q) % 2 ? (dark ? "#2c2a3a" : "#fbf5e6") : (dark ? "#26243a" : "#efe3c8"); c.fillRect(x, y, z, z);
        if (v === 1) { c.fillStyle = dark ? "#55556a" : "#8d8d99"; c.fillRect(x + 1, y + 1, z - 2, z - 2); c.fillStyle = "rgba(255,255,255,0.18)"; c.fillRect(x + 1, y + 1, z - 2, 4); }
        else if (v === 2) { c.fillStyle = "#c98b4a"; c.fillRect(x + 2, y + 2, z - 4, z - 4); c.strokeStyle = "#8a5a2b"; c.lineWidth = 2; c.strokeRect(x + 3, y + 3, z - 6, z - 6); c.beginPath(); c.moveTo(x + 4, y + 4); c.lineTo(x + z - 4, y + z - 4); c.moveTo(x + z - 4, y + 4); c.lineTo(x + 4, y + z - 4); c.stroke(); }
        else if (v === 3) G.emoji(c, "🧀", x + z / 2, y + z / 2 + 1, z * 0.8);
      }
      s.cats.forEach(k => { const x = g.x0 + (k.c + 0.5) * z, y = g.y0 + (k.r + 0.5) * z; c.fillStyle = k.stuck ? "rgba(80,140,255,0.35)" : "rgba(226,72,61,0.3)"; c.beginPath(); c.arc(x, y, z * 0.42, 0, 7); c.fill(); G.emoji(c, "🐈", x, y + 1, z * 0.85); if (k.stuck) G.emoji(c, "💦", x + z * 0.3, y - z * 0.3, z * 0.4); });
      const px = g.x0 + (s.p.c + 0.5) * z, py = g.y0 + (s.p.r + 0.5) * z;
      if (!(s.hurt > 0 && Math.floor(G.t * 12) % 2)) G.img(c, s.hurt > 0 ? ":dawgpain:" : ":dawgW:", px, py, z * 1.05);
      s.pops.forEach(p => G.text(c, p.txt, g.x0 + (p.c + 0.5) * z, g.y0 + (p.r + 0.5) * z - 14 - (0.8 - p.t) * 24, 11, "#e07b00"));
      G.hud(c, `${s.score}`, `LV ${s.lvl} · WAVE ${Math.min(3, s.wave + 1)}/3`, "🐶".repeat(Math.max(0, s.lives)));
      if (s.msg) G.banner(c, s.msg.txt, "#fff", G.H * 0.45, s.msg.txt.length > 12 ? 15 : undefined);
      G.hint(c, "TAP / HOLD WHERE YOU WANT TO GO", 5);
    }
  });
})();
