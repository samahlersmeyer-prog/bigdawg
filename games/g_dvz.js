// ---------- Dawgs vs Zombies (lane defense) ----------
// Zombies shuffle in from the right across 5 lanes. Collect falling bones, spend them to post defenders on the grid.
(function () {
  const ROWS = 5, COLS = 7, TOP = 112;
  const UNITS = [
    { k: "bowl", n: "BOWL", e: "🥣", cost: 50, hp: 5, cd: 6, desc: "MAKES BONES" },
    { k: "ball", n: "LAUNCHER", e: "🎾", face: ":dawgW:", cost: 100, hp: 5, cd: 6, rate: 1.0, dmg: 1 },
    { k: "house", n: "DOGHOUSE", e: "🏠", cost: 50, hp: 30, cd: 18 },
    { k: "snow", n: "SNOW PUP", e: "❄️", face: ":dawgpog:", cost: 175, hp: 5, cd: 8, rate: 1.4, dmg: 1, slow: 1 },
    { k: "bomb", n: "BARK BOMB", e: "💣", cost: 150, hp: 99, cd: 30, fuse: 1 }
  ];
  const ZOMB = { walk: { hp: 10, sp: 13, e: "🧟", v: 10 }, cone: { hp: 26, sp: 13, e: "🧟", hat: "🎃", v: 20 }, run: { hp: 8, sp: 26, e: "🧟‍♀️", v: 15 }, big: { hp: 70, sp: 8, e: "🧟‍♂️", hat: "📮", v: 60, sz: 1.35 } };
  const rnd = (a, b) => a + Math.random() * (b - a);
  function geo(G) { const cw = Math.min(G.W / (COLS + 0.6), (G.H - TOP - 10) / ROWS); return { cw, ch: (G.H - TOP - 10) / ROWS, x0: 4 }; }
  defGame({
    key: "dvz", name: "Dawgs vs Zombies", icon: "🧟", max: 99999,
    blurb: "Lane defense. Hold the yard.",
    how: "Zombies shuffle in from the right. Tap falling 🦴 to collect bones. Tap a card at the top, then tap a square to post it: 🥣 Bowls make bones, 🎾 Launchers shoot, 🏠 Doghouses block, ❄️ Snow Pups slow them down, 💣 Bark Bombs blow up everything nearby. Each lane has one lawn mower for emergencies. If a zombie gets past it, game over.",
    reset(G) {
      G.s = { bones: 150, score: 0, t: 0, grid: [], zs: [], shots: [], drops: [], fx: [], sel: null, cool: UNITS.map(() => 0), mowers: [1, 1, 1, 1, 1], mow: [], spawn: 18, wave: 1, waveT: 90, flag: 0, msg: { txt: "HERE THEY COME...", t: 2 }, dropT: 4 };
      for (let r = 0; r < ROWS; r++) G.s.grid.push(new Array(COLS).fill(null));
    },
    cell(G, x, y) { const g = geo(G), c = Math.floor((x - g.x0) / g.cw), r = Math.floor((y - TOP) / g.ch); return r >= 0 && r < ROWS && c >= 0 && c < COLS ? [r, c] : null; },
    cx(G, c) { const g = geo(G); return g.x0 + c * g.cw + g.cw / 2; },
    cy(G, r) { const g = geo(G); return TOP + r * g.ch + g.ch / 2; },
    tap(G, x, y) {
      const s = G.s;
      // bones first (they float on top)
      const d = s.drops.find(d => Math.hypot(d.x - x, d.y - y) < 30); if (d) { d.got = 1; s.bones += 25; G.sfx("pop"); return; }
      if (y < TOP - 4 && y > 38) { const i = Math.floor(x / (G.W / UNITS.length)); const u = UNITS[i]; if (!u) return; if (s.cool[i] > 0) { s.msg = { txt: "RECHARGING", t: 0.7 }; return; } if (s.bones < u.cost) { s.msg = { txt: `NEED ${u.cost} 🦴`, t: 0.8 }; return; } s.sel = s.sel === i ? null : i; return; }
      const cl = this.cell(G, x, y); if (!cl || s.sel == null) return;
      const [r, c] = cl; if (s.grid[r][c]) { s.msg = { txt: "TAKEN", t: 0.6 }; return; }
      const u = UNITS[s.sel]; if (s.bones < u.cost) return;
      s.bones -= u.cost; s.cool[s.sel] = u.cd; s.grid[r][c] = { u, hp: u.hp, t: u.k === "bowl" ? 5 : 0, fuse: u.fuse || 0 }; s.sel = null; G.sfx("pop");
    },
    update(G, dt) {
      const s = G.s, g = geo(G); s.t += dt;
      if (s.msg) { s.msg.t -= dt; if (s.msg.t <= 0) s.msg = null; }
      s.cool = s.cool.map(v => Math.max(0, v - dt));
      // free bones fall from the sky
      s.dropT -= dt; if (s.dropT <= 0) { s.dropT = 7; s.drops.push({ x: rnd(30, G.W - 30), y: TOP, ty: rnd(TOP + 40, G.H - 40), t: 9 }); }
      s.drops.forEach(d => { if (d.y < d.ty) d.y += 60 * dt; d.t -= dt; }); s.drops = s.drops.filter(d => !d.got && d.t > 0);
      // spawning: steady trickle that speeds up, plus a big wave every 50s
      s.spawn -= dt; s.waveT -= dt;
      const lvl = 1 + s.t / 60;
      if (s.waveT <= 0) { s.waveT = 55; s.wave++; s.msg = { txt: "A HUGE WAVE IS COMING!", t: 2 }; for (let i = 0; i < 1 + s.wave * 2; i++) this.addZ(G, i * 1.2, lvl); }
      if (s.spawn <= 0) { s.spawn = Math.max(2.8, 14 - s.t / 25) * rnd(0.7, 1.2); this.addZ(G, 0, lvl); }
      // defenders
      for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
        const p = s.grid[r][c]; if (!p) continue; const x = this.cx(G, c), y = this.cy(G, r);
        if (p.u.k === "bowl") { p.t -= dt; if (p.t <= 0) { p.t = 10; s.drops.push({ x: x + rnd(-10, 10), y: y - 10, ty: y + 6, t: 9 }); } }
        if (p.u.rate) { p.t -= dt; if (p.t <= 0 && s.zs.some(z => z.r === r && z.x > x - 10 && z.x < G.W + 10)) { p.t = p.u.rate; s.shots.push({ r, x: x + 14, y: y - 4, dmg: p.u.dmg, slow: p.u.slow }); } }
        if (p.u.k === "bomb") { p.fuse -= dt; if (p.fuse <= 0) { s.grid[r][c] = null; s.fx.push({ x, y, t: 0.5, boom: g.cw * 1.6 }); G.sfx("lose"); G.buzz(); s.zs.forEach(z => { if (Math.abs(z.r - r) <= 1 && Math.abs(z.x - x) < g.cw * 1.6) z.hp -= 90; }); } }
      }
      // tennis balls
      s.shots.forEach(b => { b.x += 300 * dt; const z = s.zs.find(z => z.r === b.r && Math.abs(z.x - b.x) < 16 && z.hp > 0); if (z) { z.hp -= b.dmg; if (b.slow) z.slow = 3; b.gone = 1; } if (b.x > G.W + 20) b.gone = 1; });
      s.shots = s.shots.filter(b => !b.gone);
      // zombies walk, or chew on whatever's in front of them
      s.zs.forEach(z => {
        if (z.delay > 0) { z.delay -= dt; return; }
        const c = Math.floor((z.x - 14 - g.x0) / g.cw), p = c >= 0 && c < COLS ? s.grid[z.r][c] : null;
        const sp = z.sp * (z.slow > 0 ? 0.5 : 1); if (z.slow > 0) z.slow -= dt;
        if (p && p.u.k !== "bomb" && z.x - this.cx(G, c) < g.cw * 0.55) { p.hp -= dt * (z.slow > 0 ? 0.5 : 1); z.chew = (z.chew || 0) + dt; if (p.hp <= 0) s.grid[z.r][c] = null; }
        else z.x -= sp * dt;
        if (z.x < 8) {
          if (s.mowers[z.r]) { s.mowers[z.r] = 0; s.mow.push({ r: z.r, x: 0 }); G.sfx("win"); s.msg = { txt: "LAWN MOWER!", t: 1 }; }
          else if (!s.mow.some(m => m.r === z.r)) { G.over(Math.min(99999, Math.round(s.score)), `They got in! Survived ${Math.floor(s.t / 60)}:${String(Math.floor(s.t % 60)).padStart(2, "0")}.`); }
        }
      });
      s.mow.forEach(m => { m.x += 380 * dt; s.zs.forEach(z => { if (z.r === m.r && Math.abs(z.x - m.x) < 24) z.hp = 0; }); });
      s.mow = s.mow.filter(m => m.x < G.W + 40);
      s.zs.forEach(z => { if (z.hp <= 0 && !z.dead) { z.dead = 1; s.score += z.v; s.fx.push({ x: z.x, y: this.cy(G, z.r), t: 0.5, txt: "+" + z.v }); } });
      s.zs = s.zs.filter(z => !z.dead);
      s.score += dt; // a point per second survived
      s.fx.forEach(e => e.t -= dt); s.fx = s.fx.filter(e => e.t > 0);
    },
    addZ(G, delay, lvl) {
      const s = G.s, r = Math.floor(Math.random() * ROWS), q = Math.random();
      const k = s.t > 150 && q < 0.12 ? "big" : s.t > 60 && q < 0.35 ? "run" : s.t > 30 && q < 0.6 ? "cone" : "walk", Z = ZOMB[k], hpm = 1 + (lvl - 1) * 0.3;
      s.zs.push({ r, x: G.W + 20 + Math.random() * 20, hp: Z.hp * hpm, max: Z.hp * hpm, sp: Z.sp * rnd(0.9, 1.1), e: Z.e, hat: Z.hat, v: Z.v, sz: Z.sz || 1, delay, slow: 0 });
    },
    draw(G, c) {
      const s = G.s, W = G.W, H = G.H, dark = G.dark(), g = geo(G);
      c.fillStyle = dark ? "#16251a" : "#5f9e45"; c.fillRect(0, 0, W, H);
      for (let r = 0; r < ROWS; r++) for (let q = 0; q < COLS; q++) { c.fillStyle = (r + q) % 2 ? (dark ? "#24432a" : "#7cc35b") : (dark ? "#2a4d30" : "#8bd168"); c.fillRect(g.x0 + q * g.cw, TOP + r * g.ch, g.cw, g.ch); }
      c.fillStyle = dark ? "#3a3340" : "#9b8f7f"; c.fillRect(g.x0 + COLS * g.cw, TOP, W - g.x0 - COLS * g.cw, ROWS * g.ch); // street where they come from
      // seed cards
      const bw = W / UNITS.length;
      UNITS.forEach((u, i) => {
        const x = i * bw, on = s.sel === i, cool = s.cool[i] > 0, ok = s.bones >= u.cost && !cool;
        c.fillStyle = on ? "#ffd23f" : dark ? "#2b2b33" : "#f4ead2"; c.fillRect(x + 3, 40, bw - 6, TOP - 46);
        if (cool) { c.fillStyle = "rgba(0,0,0,0.45)"; c.fillRect(x + 3, 40, bw - 6, (TOP - 46) * (s.cool[i] / u.cd)); }
        c.globalAlpha = ok ? 1 : 0.45; G.emoji(c, u.e, x + bw / 2, 62, 26); c.globalAlpha = 1;
        G.text(c, String(u.cost), x + bw / 2, 92, 10, on ? "#222" : ok ? (dark ? "#ffd23f" : "#8a5a00") : "#e53935");
      });
      // mowers
      for (let r = 0; r < ROWS; r++) if (s.mowers[r]) G.emoji(c, "🚜", 12, this.cy(G, r) + 14, 18);
      s.mow.forEach(m => G.emoji(c, "🚜", m.x, this.cy(G, m.r), 34));
      // defenders
      for (let r = 0; r < ROWS; r++) for (let q = 0; q < COLS; q++) {
        const p = s.grid[r][q]; if (!p) continue; const x = this.cx(G, q), y = this.cy(G, r), sz = Math.min(g.cw, g.ch) * 0.7;
        if (p.u.face) { G.img(c, p.u.face, x, y, sz); G.emoji(c, p.u.e, x + sz * 0.35, y + sz * 0.3, sz * 0.45); }
        else G.emoji(c, p.u.e, x, y, p.u.k === "bomb" ? sz * (1 + 0.15 * Math.sin(G.t * 20)) : sz);
        if (p.hp < p.u.hp && p.u.k !== "bomb") { c.fillStyle = "#300"; c.fillRect(x - 14, y + sz / 2, 28, 3); c.fillStyle = "#5be35b"; c.fillRect(x - 14, y + sz / 2, 28 * p.hp / p.u.hp, 3); }
      }
      s.shots.forEach(b => G.emoji(c, b.slow ? "❄️" : "🎾", b.x, b.y, 14));
      // zombies (sorted by lane so lower lanes overlap upper)
      s.zs.slice().sort((a, b) => a.r - b.r).forEach(z => {
        if (z.delay > 0) return; const y = this.cy(G, z.r), sz = Math.min(g.cw, g.ch) * 0.85 * z.sz, wob = Math.sin(G.t * 5 + z.x) * 0.08;
        c.save(); c.translate(z.x, y); c.rotate(wob); if (z.slow > 0) { c.globalAlpha = 0.85; } G.emoji(c, z.e, 0, 0, sz); if (z.hat) G.emoji(c, z.hat, 2, -sz * 0.45, sz * 0.42); c.restore(); c.globalAlpha = 1;
        if (z.slow > 0) G.emoji(c, "❄️", z.x + sz * 0.3, y - sz * 0.3, 12);
        c.fillStyle = "#300"; c.fillRect(z.x - 14, y - sz / 2 - 6, 28, 3); c.fillStyle = "#e53935"; c.fillRect(z.x - 14, y - sz / 2 - 6, 28 * Math.max(0, z.hp / z.max), 3);
      });
      s.drops.forEach(d => { const a = d.t < 2 ? (Math.floor(G.t * 8) % 2 ? 0.4 : 1) : 1; c.globalAlpha = a; c.fillStyle = "rgba(255,210,63,0.35)"; c.beginPath(); c.arc(d.x, d.y, 20, 0, 7); c.fill(); G.emoji(c, "🦴", d.x, d.y, 26); c.globalAlpha = 1; });
      s.fx.forEach(e => { if (e.boom) { c.fillStyle = `rgba(255,140,40,${e.t})`; c.beginPath(); c.arc(e.x, e.y, e.boom * (1.2 - e.t), 0, 7); c.fill(); } else G.text(c, e.txt, e.x, e.y - 20 - (0.5 - e.t) * 30, 10, "#ffd23f"); });
      G.hud(c, `🦴${s.bones}`, `WAVE ${s.wave}`, `${Math.round(s.score)}`);
      if (s.sel != null) G.text(c, `TAP A SQUARE FOR ${UNITS[s.sel].n}`, W / 2, TOP + 8, 9, "#fff");
      if (s.msg) G.banner(c, s.msg.txt, "#fff", H * 0.5, s.msg.txt.length > 12 ? 15 : undefined);
      G.hint(c, "TAP A CARD, THEN A SQUARE", 5);
    }
  });
})();
