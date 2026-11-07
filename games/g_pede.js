// ---------- Dawgipede (Centipede-style) ----------
// A Catterpillar snakes down through a yard full of toadstools. Drag to move the Big Dawg along the bottom;
// bones fire on their own. Shoot a segment and it turns into a toadstool and the cat splits in two.
// Heads 100, body 10, toadstool 1, squirrel 300/600/900 (closer = more), dive-bombing bird 200. Extra life every 12,000.
defGame({
  key: "pede", name: "Dawgipede", icon: "🐛", max: 999999,
  blurb: "Blast the Catterpillar before it reaches you.",
  how: "A Catterpillar winds down through the toadstools. Drag anywhere to move the Big Dawg (or use the arrow keys). Bones fire on their own, one at a time, so aim with your feet. Every segment you hit becomes a toadstool and splits the cat in two: heads are 100, body parts are 10. Squirrels zigzag through your area and eat toadstools: 300, 600 or 900 the closer they are. Birds dive-bomb and drop toadstools, 2 hits for 200. Touch anything and you lose a life. Clear the Catterpillar for a faster wave. Extra life every 12,000.",
  ZONE: 6,
  reset(G) {
    const W = G.W, H = G.H, cols = 15;
    const cell = Math.floor(Math.min(W / cols, (H - 44) / 18));
    const rows = Math.floor((H - 44) / cell);
    const s = G.s = { cols, rows, cell, ox: Math.floor((W - cols * cell) / 2), oy: H - rows * cell - 4, m: [], segs: [], bul: null, sq: null, bird: null,
      wave: 1, pts: 0, lives: 3, next: 12000, acc: 0, sideT: 6, sqT: 4, pops: [], keys: {}, dying: 0, drag: null };
    for (let y = 0; y < rows; y++) { s.m.push([]); for (let x = 0; x < cols; x++) s.m[y].push(y >= 1 && y < rows - 2 && Math.random() < (y >= rows - this.ZONE ? 0.035 : 0.085) ? 4 : 0); }
    s.p = { x: s.ox + cols * cell / 2, y: s.oy + (rows - 1.5) * cell };
    this.spawnWave(G, 12);
  },
  spd(G) { return Math.min(11, 4 + G.s.wave * 0.5); }, // cells per second: 4.5 on wave 1, +0.5 a wave, tops out at 11 (wave 14)
  spawnWave(G, total) {
    const s = G.s, heads = Math.min(s.wave - 1, 6, total - 1), len = total - heads;
    s.segs = [];
    for (let i = 0; i < len; i++) s.segs.push({ x: -i, y: 0, dx: 1, dy: 1, px: -i - 1, py: 0, head: i === 0 });
    for (let i = 0; i < heads; i++) { const x = 1 + Math.floor(Math.random() * (s.cols - 2)); s.segs.push({ x, y: 0, dx: Math.random() < 0.5 ? 1 : -1, dy: 1, px: x, py: -1, head: true }); }
    s.acc = 0;
  },
  mush(s, x, y) { return x >= 0 && x < s.cols && y >= 0 && y < s.rows && s.m[y][x] > 0; },
  step(G) {
    const s = G.s, top = s.rows - this.ZONE;
    for (const g of s.segs) {
      g.px = g.x; g.py = g.y;
      const nx = g.x + g.dx;
      const blocked = nx >= s.cols || (nx < 0 && g.dx < 0) || this.mush(s, nx, g.y);
      if (!blocked) { g.x = nx; continue; }
      let ny = g.y + g.dy;
      if (ny > s.rows - 1) { g.dy = -1; ny = g.y - 1; }
      if (g.dy < 0 && ny < top) { g.dy = 1; ny = g.y + 1; }
      g.y = ny; g.dx = -g.dx;
    }
  },
  segPos(G, g) {
    const s = G.s, f = Math.min(1, s.acc * this.spd(G));
    const x = g.px + (g.x - g.px) * f, y = g.py + (g.y - g.py) * f;
    return [s.ox + (x + 0.5) * s.cell, s.oy + (y + 0.5) * s.cell];
  },
  pop(s, x, y, txt) { s.pops.push({ x, y, t: 0.9, txt }); },
  add(G, n) { const s = G.s; s.pts += n; if (s.pts >= s.next) { s.next += 12000; s.lives++; G.sfx("win"); this.pop(s, G.W / 2, G.H / 2, "EXTRA LIFE!"); } },
  down(G, x, y) { G.s.drag = { x, y, px: G.s.p.x, py: G.s.p.y }; },
  move(G, x, y) { const s = G.s, d = s.drag; if (!d) return; s.p.x = d.px + (x - d.x) * 1.35; s.p.y = d.py + (y - d.y) * 1.35; this.clampP(s); },
  up(G) { G.s.drag = null; },
  onKey(G, k, d) { G.s.keys[k] = d; },
  clampP(s) {
    const c = s.cell;
    s.p.x = Math.max(s.ox + c / 2, Math.min(s.ox + s.cols * c - c / 2, s.p.x));
    s.p.y = Math.max(s.oy + (s.rows - this.ZONE) * c + c / 2, Math.min(s.oy + s.rows * c - c / 2, s.p.y));
  },
  die(G) {
    const s = G.s; if (s.dying) return;
    s.dying = 1.3; s.lives--; G.sfx("lose"); G.buzz();
  },
  update(G, dt) {
    const s = G.s, c = s.cell, p = s.p;
    s.pops.forEach(o => { o.t -= dt; o.y -= 30 * dt; }); s.pops = s.pops.filter(o => o.t > 0);
    if (s.dying) {
      s.dying -= dt;
      if (s.dying <= 0) {
        s.dying = 0;
        if (s.lives <= 0) return G.over(s.pts, s.pts >= 30000 ? "Top dawg!" : s.pts >= 10000 ? "Bug zapper!" : "The cat won.");
        // regrow damaged toadstools (5 each), restart the cat from the top
        let fix = 0; s.m.forEach(r => r.forEach((v, x) => { if (v > 0 && v < 4) { r[x] = 4; fix++; } })); if (fix) this.add(G, fix * 5);
        const left = s.segs.length; this.spawnWave(G, Math.max(1, left));
        s.sq = null; s.bird = null; s.bul = null; s.sideT = 6;
      }
      return;
    }
    // move the dog
    const kx = (s.keys.ArrowRight || s.keys.d ? 1 : 0) - (s.keys.ArrowLeft || s.keys.a ? 1 : 0), ky = (s.keys.ArrowDown || s.keys.s ? 1 : 0) - (s.keys.ArrowUp || s.keys.w ? 1 : 0);
    if (kx || ky) { p.x += kx * 260 * dt; p.y += ky * 260 * dt; this.clampP(s); }
    // auto-fire
    if (!s.bul) s.bul = { x: p.x, y: p.y - c * 0.6 };
    // centipede
    const iv = 1 / this.spd(G);
    s.acc += dt; while (s.acc >= iv) { s.acc -= iv; this.step(G); }
    const top = s.rows - this.ZONE;
    if (s.segs.some(g => g.y >= top)) {
      s.sideT -= dt;
      if (s.sideT <= 0) { s.sideT = Math.max(2.5, 6 - s.wave * 0.3); const L = Math.random() < 0.5; s.segs.push({ x: L ? -1 : s.cols, y: top, dx: L ? 1 : -1, dy: 1, px: L ? -2 : s.cols + 1, py: top, head: true }); }
    }
    // squirrel
    if (!s.sq) { s.sqT -= dt; if (s.sqT <= 0) { const L = Math.random() < 0.5; s.sq = { x: L ? s.ox - c : s.ox + s.cols * c + c, y: s.oy + (top + 1) * c, vx: (L ? 1 : -1) * (55 + s.wave * 5), vy: 170 }; } }
    else {
      const q = s.sq; q.x += q.vx * dt; q.y += q.vy * dt;
      const yt = s.oy + top * c + c / 2, yb = s.oy + s.rows * c - c / 2;
      if (q.y < yt) { q.y = yt; q.vy = Math.abs(q.vy) * (0.7 + Math.random() * 0.6); } if (q.y > yb) { q.y = yb; q.vy = -Math.abs(q.vy) * (0.7 + Math.random() * 0.6); }
      if (Math.random() < dt * 0.6) q.vx = q.vx > 0 ? Math.max(30, q.vx * 0.3) : Math.min(-30, q.vx * 0.3); else if (Math.abs(q.vx) < 60) q.vx *= 1 + dt * 3;
      const mx = Math.floor((q.x - s.ox) / c), my = Math.floor((q.y - s.oy) / c); if (this.mush(s, mx, my)) s.m[my][mx] = 0;
      if (q.x < s.ox - 2 * c || q.x > s.ox + s.cols * c + 2 * c) { s.sq = null; s.sqT = 3 + Math.random() * 5; }
    }
    // bird
    if (!s.bird && s.wave >= 2) {
      let n = 0; for (let y = top; y < s.rows; y++) for (let x = 0; x < s.cols; x++) if (s.m[y][x]) n++;
      if (n < 5 && Math.random() < dt * 0.35) s.bird = { x: s.ox + (Math.floor(Math.random() * s.cols) + 0.5) * c, y: s.oy - c, vy: 230 + s.wave * 8, hp: 2, row: -1 };
    }
    if (s.bird) {
      const b = s.bird; b.y += b.vy * dt; const r = Math.floor((b.y - s.oy) / c);
      if (r !== b.row) { b.row = r; const bx = Math.floor((b.x - s.ox) / c); if (r >= 1 && r < s.rows - 1 && !s.m[r][bx] && Math.random() < 0.28) s.m[r][bx] = 4; }
      if (b.y > s.oy + s.rows * c + c) s.bird = null;
    }
    // bullet (sub-stepped so it can't skip a cell)
    if (s.bul) {
      let dist = 980 * dt;
      while (dist > 0 && s.bul) {
        const st = Math.min(dist, c * 0.4); dist -= st; s.bul.y -= st;
        if (s.bul.y < s.oy - c) { s.bul = null; break; }
        this.hit(G);
      }
    }
    // touching anything hurts
    const R = c * 0.72;
    for (const g of s.segs) { const [x, y] = this.segPos(G, g); if (Math.hypot(x - p.x, y - p.y) < R) return this.die(G); }
    if (s.sq && Math.hypot(s.sq.x - p.x, s.sq.y - p.y) < R) return this.die(G);
    if (s.bird && Math.hypot(s.bird.x - p.x, s.bird.y - p.y) < R) return this.die(G);
    // wave clear
    if (!s.segs.length) { this.add(G, 0); s.wave++; G.sfx("win"); this.pop(s, G.W / 2, G.H * 0.4, `WAVE ${s.wave}`); this.spawnWave(G, 12); }
  },
  hit(G) {
    const s = G.s, c = s.cell, b = s.bul;
    const mx = Math.floor((b.x - s.ox) / c), my = Math.floor((b.y - s.oy) / c);
    for (let i = 0; i < s.segs.length; i++) {
      const g = s.segs[i], [x, y] = this.segPos(G, g);
      if (Math.abs(x - b.x) < c * 0.55 && Math.abs(y - b.y) < c * 0.55) {
        this.add(G, g.head ? 100 : 10); this.pop(s, x, y, g.head ? "100" : "10"); G.sfx("pop");
        if (s.segs[i + 1] && !s.segs[i + 1].head) s.segs[i + 1].head = true;
        if (g.x >= 0 && g.x < s.cols && g.y >= 0 && g.y < s.rows - 1) s.m[g.y][g.x] = 4;
        s.segs.splice(i, 1); s.bul = null; return;
      }
    }
    if (this.mush(s, mx, my)) { s.m[my][mx]--; if (!s.m[my][mx]) this.add(G, 1); s.bul = null; return; }
    if (s.sq && Math.abs(s.sq.x - b.x) < c * 0.7 && Math.abs(s.sq.y - b.y) < c * 0.6) {
      const d = Math.abs(s.sq.y - s.p.y) / c, n = d < 1.6 ? 900 : d < 3.2 ? 600 : 300;
      this.add(G, n); this.pop(s, s.sq.x, s.sq.y, String(n)); G.sfx("win"); s.sq = null; s.sqT = 3 + Math.random() * 5; s.bul = null; return;
    }
    if (s.bird && Math.abs(s.bird.x - b.x) < c * 0.6 && Math.abs(s.bird.y - b.y) < c * 0.6) {
      s.bul = null; s.bird.hp--;
      if (s.bird.hp > 0) { s.bird.vy *= 2; G.sfx("pop"); } else { this.add(G, 200); this.pop(s, s.bird.x, s.bird.y, "200"); G.sfx("pop"); s.bird = null; }
    }
  },
  draw(G, c) {
    const s = G.s, W = G.W, H = G.H, cs = s.cell, dark = G.dark(), p = s.p;
    const PAL = [["#e74c3c", "#fff3e0"], ["#9b59b6", "#f3e5f5"], ["#3498db", "#e3f2fd"], ["#e67e22", "#fff8e1"], ["#1abc9c", "#e0f2f1"], ["#f1c40f", "#fffde7"]];
    const pal = PAL[(s.wave - 1) % PAL.length];
    const bg = c.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, dark ? "#06120b" : "#0f2a1a"); bg.addColorStop(1, dark ? "#0d2416" : "#1d4a2c");
    c.fillStyle = bg; c.fillRect(0, 0, W, H);
    const zt = s.oy + (s.rows - this.ZONE) * cs;
    c.fillStyle = "rgba(255,255,255,0.04)"; c.fillRect(s.ox, zt, s.cols * cs, this.ZONE * cs);
    c.strokeStyle = "rgba(255,255,255,0.1)"; c.setLineDash([4, 6]); c.beginPath(); c.moveTo(s.ox, zt); c.lineTo(s.ox + s.cols * cs, zt); c.stroke(); c.setLineDash([]);
    // toadstools
    for (let y = 0; y < s.rows; y++) for (let x = 0; x < s.cols; x++) {
      const hp = s.m[y][x]; if (!hp) continue;
      const X = s.ox + x * cs + cs / 2, Y = s.oy + y * cs, k = hp / 4;
      c.fillStyle = pal[1]; c.fillRect(X - cs * 0.12, Y + cs * 0.45, cs * 0.24, cs * 0.45);
      c.fillStyle = pal[0]; c.beginPath(); c.ellipse(X, Y + cs * 0.5, cs * 0.44, cs * 0.42 * k, 0, Math.PI, 0); c.fill();
      if (k > 0.5) { c.fillStyle = "rgba(255,255,255,0.75)"; c.beginPath(); c.arc(X - cs * 0.15, Y + cs * 0.32, cs * 0.06, 0, 7); c.arc(X + cs * 0.14, Y + cs * 0.25, cs * 0.05, 0, 7); c.fill(); }
    }
    // catterpillar: draw bodies first, heads on top
    const segDraw = head => s.segs.forEach(g => {
      if (g.head !== head) return;
      const [x, y] = this.segPos(G, g), r = cs * 0.46;
      if (x < s.ox - cs || x > s.ox + s.cols * cs + cs) return;
      c.fillStyle = head ? "#ff9f43" : "#f6b26b"; c.beginPath(); c.arc(x, y, r, 0, 7); c.fill();
      c.strokeStyle = "#b35900"; c.lineWidth = 2; c.beginPath(); c.arc(x, y, r * 0.65, -0.6, 0.6); c.stroke(); c.beginPath(); c.arc(x, y, r * 0.65, Math.PI - 0.6, Math.PI + 0.6); c.stroke();
      if (!head) return;
      c.fillStyle = "#ff9f43";
      [-1, 1].forEach(sd => { c.beginPath(); c.moveTo(x + sd * r * 0.85, y - r * 0.3); c.lineTo(x + sd * r * 0.7, y - r * 1.25); c.lineTo(x + sd * r * 0.15, y - r * 0.8); c.fill(); });
      const lk = g.dx * r * 0.15;
      c.fillStyle = "#fff"; c.beginPath(); c.arc(x - r * 0.35 + lk, y - r * 0.05, r * 0.26, 0, 7); c.arc(x + r * 0.35 + lk, y - r * 0.05, r * 0.26, 0, 7); c.fill();
      c.fillStyle = "#1b1b1b"; c.beginPath(); c.ellipse(x - r * 0.33 + lk * 1.6, y - r * 0.05, r * 0.08, r * 0.2, 0, 0, 7); c.ellipse(x + r * 0.37 + lk * 1.6, y - r * 0.05, r * 0.08, r * 0.2, 0, 0, 7); c.fill();
      c.fillStyle = "#ff6b9a"; c.beginPath(); c.moveTo(x + lk - r * 0.1, y + r * 0.28); c.lineTo(x + lk + r * 0.1, y + r * 0.28); c.lineTo(x + lk, y + r * 0.4); c.fill();
    });
    segDraw(false); segDraw(true);
    if (s.sq) { c.save(); c.translate(s.sq.x, s.sq.y); if (s.sq.vx > 0) c.scale(-1, 1); G.emoji(c, "🐿️", 0, 0, cs * 1.1); c.restore(); }
    if (s.bird) G.emoji(c, "🐦", s.bird.x, s.bird.y, cs * (s.bird.hp > 1 ? 1 : 1.2));
    if (s.bul) {
      const b = s.bul; c.fillStyle = "#fffaf0";
      c.fillRect(b.x - 2, b.y - cs * 0.3, 4, cs * 0.6);
      [-1, 1].forEach(e => { c.beginPath(); c.arc(b.x - 2.5, b.y + e * cs * 0.3, 2.6, 0, 7); c.arc(b.x + 2.5, b.y + e * cs * 0.3, 2.6, 0, 7); c.fill(); });
    }
    G.img(c, s.dying ? ":dawgpain:" : s.bul && s.bul.y > p.y - cs * 1.2 ? ":dawgpog:" : ":dawgW:", p.x, p.y, cs * 1.25, s.dying ? (1.3 - s.dying) * 8 : 0);
    s.pops.forEach(o => { c.globalAlpha = Math.min(1, o.t * 2); G.text(c, o.txt, o.x, o.y, 10, "#ffd23f"); c.globalAlpha = 1; });
    G.hud(c, `${s.pts}`, `WAVE ${s.wave}`, `LIVES ${s.lives}`);
    if (G.state === "play") G.hint(c, "DRAG TO MOVE · AUTO-FIRE", 4);
  }
});
