// ---------- Yard Defense (tower defense) ----------
// Critters march down the dirt path toward the house. Tap the round pads to post dogs along the path.
defGame({
  key: "td", name: "Yard Defense", icon: "🏰", max: 99999,
  blurb: "Tower defense. Post pups, guard the yard.",
  how: "Squirrels, cats and mailmen march down the path. Pick a dog at the bottom, then tap a round pad to post it. Tap a posted dog to upgrade it (up to ★3). Kills earn treats to spend. 10 critters get through and it's over.",
  reset(G) {
    const W = G.W, top = 44, bot = G.H - 78, ph = bot - top;
    const P = [[-0.08, 0.1], [0.76, 0.1], [0.76, 0.36], [0.2, 0.36], [0.2, 0.62], [0.8, 0.62], [0.8, 0.9], [1.08, 0.9]].map(([x, y]) => ({ x: x * W, y: top + y * ph }));
    let L = 0; const seg = [];
    for (let i = 0; i < P.length - 1; i++) { const l = Math.hypot(P[i + 1].x - P[i].x, P[i + 1].y - P[i].y); seg.push({ a: P[i], b: P[i + 1], s: L, l }); L += l; }
    const pads = [[0.22, 0.22], [0.5, 0.22], [0.92, 0.22], [0.07, 0.49], [0.48, 0.49], [0.75, 0.49], [0.38, 0.77], [0.6, 0.77], [0.93, 0.76]]
      .map(([x, y]) => ({ x: x * W, y: top + Math.min(0.97, y) * ph, t: null }));
    G.s = { P, seg, L, pads, foes: [], shots: [], fx: [], money: 110, lives: 10, score: 0, wave: 0, toSpawn: 0, spawnT: 0, breakT: 2.5, sel: 0, msg: null, bot };
  },
  types: [
    { name: "BONE", cost: 40, range: 92, rate: 0.55, dmg: 1, em: "🦴", face: ":dawgW:" },
    { name: "HOSE", cost: 65, range: 78, rate: 0.9, dmg: 0.7, splash: 44, slow: true, em: "💦", face: ":dawgpog:" },
    { name: "BARK", cost: 100, range: 150, rate: 1.5, dmg: 5, em: "📣", face: ":dawgsus:" }
  ],
  pos(s, d) { for (const g of s.seg) if (d <= g.s + g.l) { const f = (d - g.s) / g.l; return { x: g.a.x + (g.b.x - g.a.x) * f, y: g.a.y + (g.b.y - g.a.y) * f }; } return s.P[s.P.length - 1]; },
  update(G, dt) {
    const s = G.s, T = this.types;
    if (s.msg) { s.msg.t -= dt; if (s.msg.t <= 0) s.msg = null; }
    // waves
    if (!s.toSpawn && !s.foes.length) {
      s.breakT -= dt;
      if (s.breakT <= 0) { s.wave++; s.toSpawn = 6 + s.wave * 2; s.spawnT = 0; s.msg = { txt: `WAVE ${s.wave}`, t: 1.4 }; }
    }
    if (s.toSpawn) {
      s.spawnT -= dt;
      if (s.spawnT <= 0) {
        const n = s.wave, boss = n % 5 === 0 && s.toSpawn === 1, r = Math.random();
        const k = boss || (n >= 6 && r < 0.08) ? "mail" : n >= 3 && r < 0.3 ? "cat" : "sq";
        const hp = k === "mail" ? 18 + n * 4 : k === "cat" ? 5 + n * 1.3 : 2 + n * 0.75;
        s.foes.push({ k, d: 0, hp, max: hp, sp: k === "mail" ? 26 : k === "cat" ? 40 : 54 + Math.min(20, n * 1.5), slow: 0, val: k === "mail" ? 30 : k === "cat" ? 9 : 5 });
        s.toSpawn--; s.spawnT = Math.max(0.32, 1.0 - n * 0.04);
        if (!s.toSpawn) s.breakT = 3;
      }
    }
    s.foes.forEach(f => { f.d += f.sp * (f.slow > 0 ? 0.5 : 1) * dt; f.slow -= dt; const p = this.pos(s, f.d); f.x = p.x; f.y = p.y; });
    const kill = f => { if (f.dead) return; f.dead = true; s.money += f.val; s.score += f.val * 2; s.fx.push({ x: f.x, y: f.y, t: 0.4, txt: "+" + f.val }); };
    s.foes.forEach(f => { if (!f.dead && f.d >= s.L) { f.dead = true; s.lives--; G.buzz(); G.sfx("lose"); } });
    if (s.lives <= 0) { s.foes = s.foes.filter(f => !f.dead); G.over(Math.min(99999, s.score), `Wave ${s.wave}. The yard has fallen!`); return; }
    // towers
    s.pads.forEach(p => {
      if (!p.t) return; const ty = T[p.t.k], lv = p.t.lv, rng = ty.range * (1 + 0.12 * (lv - 1));
      p.t.cd -= dt; if (p.t.cd > 0) return;
      let best = null; s.foes.forEach(f => { if (!f.dead && Math.hypot(f.x - p.x, f.y - p.y) < rng && (!best || f.d > best.d)) best = f; });
      if (!best) return;
      p.t.cd = ty.rate; const dmg = ty.dmg * Math.pow(1.7, lv - 1);
      if (p.t.k === 0) s.shots.push({ x: p.x, y: p.y, f: best, dmg });
      else if (p.t.k === 1) { s.foes.forEach(f => { if (!f.dead && Math.hypot(f.x - best.x, f.y - best.y) < ty.splash) { f.hp -= dmg; f.slow = 1.5; if (f.hp <= 0) kill(f); } }); s.fx.push({ x: best.x, y: best.y, t: 0.25, splash: ty.splash, fx: p.x, fy: p.y }); }
      else { best.hp -= dmg; if (best.hp <= 0) kill(best); s.fx.push({ x: best.x, y: best.y, t: 0.2, line: 1, fx: p.x, fy: p.y }); }
    });
    s.shots.forEach(b => {
      const f = b.f, dx = f.x - b.x, dy = f.y - b.y, d = Math.hypot(dx, dy), v = 420 * dt;
      if (f.dead && !b.gone) { b.gone = true; return; }
      if (d < v + 8) { b.gone = true; f.hp -= b.dmg; if (f.hp <= 0) kill(f); } else { b.x += dx / d * v; b.y += dy / d * v; }
    });
    s.shots = s.shots.filter(b => !b.gone); s.foes = s.foes.filter(f => !f.dead);
    s.fx.forEach(e => e.t -= dt); s.fx = s.fx.filter(e => e.t > 0);
  },
  tap(G, x, y) {
    const s = G.s, T = this.types;
    if (y > s.bot) { const i = Math.floor(x / (G.W / 3)); if (T[i]) s.sel = i; return; }
    const p = s.pads.find(p => Math.hypot(p.x - x, p.y - y) < 30); if (!p) return;
    if (!p.t) {
      const ty = T[s.sel]; if (s.money < ty.cost) { s.msg = { txt: `NEED ${ty.cost} 🍖`, t: 0.9 }; return; }
      s.money -= ty.cost; p.t = { k: s.sel, lv: 1, cd: 0 }; G.sfx("pop");
    } else if (p.t.lv < 3) {
      const c = Math.round(T[p.t.k].cost * (p.t.lv === 1 ? 1 : 1.8)); if (s.money < c) { s.msg = { txt: `UPGRADE ${c} 🍖`, t: 0.9 }; return; }
      s.money -= c; p.t.lv++; G.sfx("win");
    }
  },
  draw(G, c) {
    const s = G.s, W = G.W, H = G.H, dark = G.dark(), T = this.types;
    c.fillStyle = dark ? "#1f3a1c" : "#7cc35b"; c.fillRect(0, 0, W, H);
    c.fillStyle = dark ? "#244520" : "#86cd64"; for (let y = 0; y < H; y += 24) for (let x = (y / 24) % 2 ? 12 : 0; x < W; x += 24) c.fillRect(x, y, 12, 12);
    c.lineJoin = "round"; c.lineCap = "round";
    [[38, dark ? "#4a3420" : "#9b6b3c"], [30, dark ? "#6b4a2c" : "#c99a62"]].forEach(([w, col]) => { c.strokeStyle = col; c.lineWidth = w; c.beginPath(); s.P.forEach((p, i) => i ? c.lineTo(p.x, p.y) : c.moveTo(p.x, p.y)); c.stroke(); });
    const end = s.P[s.P.length - 2]; G.emoji(c, "🏠", W - 22, end.y - 26, 34);
    s.pads.forEach(p => {
      c.fillStyle = dark ? "rgba(0,0,0,0.35)" : "rgba(60,40,20,0.25)"; c.beginPath(); c.arc(p.x, p.y, 22, 0, 7); c.fill();
      if (!p.t) { c.strokeStyle = "rgba(255,255,255,0.6)"; c.lineWidth = 2; c.setLineDash([4, 4]); c.beginPath(); c.arc(p.x, p.y, 20, 0, 7); c.stroke(); c.setLineDash([]); G.text(c, "+", p.x, p.y + 1, 14, "rgba(255,255,255,0.8)"); return; }
      const ty = T[p.t.k]; G.img(c, ty.face, p.x, p.y, 38); G.emoji(c, ty.em, p.x + 14, p.y + 12, 16);
      G.text(c, "★".repeat(p.t.lv), p.x, p.y - 24, 10, "#ffd23f");
    });
    s.foes.forEach(f => {
      if (f.x == null) return;
      G.emoji(c, f.k === "mail" ? "📮" : f.k === "cat" ? "🐈" : "🐿️", f.x, f.y - 4, f.k === "mail" ? 30 : 24);
      c.fillStyle = "#300"; c.fillRect(f.x - 13, f.y - 22, 26, 4); c.fillStyle = f.slow > 0 ? "#5ab0ff" : "#5be35b"; c.fillRect(f.x - 13, f.y - 22, 26 * Math.max(0, f.hp / f.max), 4);
    });
    s.shots.forEach(b => G.emoji(c, "🦴", b.x, b.y, 14));
    s.fx.forEach(e => {
      if (e.splash) { c.fillStyle = "rgba(90,176,255,0.35)"; c.beginPath(); c.arc(e.x, e.y, e.splash, 0, 7); c.fill(); }
      else if (e.line) { c.strokeStyle = "rgba(255,210,63,0.9)"; c.lineWidth = 3; c.beginPath(); c.moveTo(e.fx, e.fy); c.lineTo(e.x, e.y); c.stroke(); }
      else G.text(c, e.txt, e.x, e.y - 20 - (0.4 - e.t) * 40, 10, "#ffd23f");
    });
    G.hud(c, `🍖${s.money}`, `WAVE ${s.wave}`, `❤️${s.lives}`);
    // tower picker
    c.fillStyle = dark ? "#151515" : "#2b2b2b"; c.fillRect(0, s.bot, W, H - s.bot);
    T.forEach((ty, i) => {
      const bw = W / 3, x = i * bw, on = s.sel === i, ok = s.money >= ty.cost;
      c.fillStyle = on ? "#ffd23f" : "rgba(255,255,255,0.08)"; c.fillRect(x + 5, s.bot + 6, bw - 10, H - s.bot - 12);
      G.emoji(c, ty.em, x + bw / 2 - 26, s.bot + (H - s.bot) / 2, 24);
      G.text(c, ty.name, x + bw / 2 + 14, s.bot + (H - s.bot) / 2 - 10, 10, on ? "#222" : "#fff");
      G.text(c, `${ty.cost}`, x + bw / 2 + 14, s.bot + (H - s.bot) / 2 + 10, 10, on ? "#222" : ok ? "#ffd23f" : "#ff6b6b");
    });
    if (s.msg) G.banner(c, s.msg.txt, "#fff", H * 0.45, s.msg.txt.length > 9 ? 18 : undefined);
    G.hint(c, "PICK A DOG · TAP A PAD", 5, s.bot - 24);
  }
});
