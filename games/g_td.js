// ---------- Yard Defense (tower defense) ----------
// Critters march down the dirt path toward the house. Tap the round pads to post dogs along the path.
defGame({
  key: "td", name: "Yard Defense", icon: "🏰", max: 99999,
  blurb: "Tower defense. Post pups, guard the yard.",
  how: "Critters march down the path. Pick a dog at the bottom, then tap a round pad to post it. Tap a posted dog to upgrade it (up to ★3). Rack up points to unlock better dogs (Tennis Cannon, Sprinkler, Howler, then Frisbee Ace, Hydrant, Thunder Woof): tap a ★3 dog to swap it for the new model. A boss shows up every 5 waves, and every wave gets tougher. 10 lives; bosses take 4 if they get through.",
  reset(G) {
    const W = G.W, top = 44, bot = G.H - 78, ph = bot - top;
    const P = [[-0.08, 0.1], [0.76, 0.1], [0.76, 0.36], [0.2, 0.36], [0.2, 0.62], [0.8, 0.62], [0.8, 0.9], [1.08, 0.9]].map(([x, y]) => ({ x: x * W, y: top + y * ph }));
    let L = 0; const seg = [];
    for (let i = 0; i < P.length - 1; i++) { const l = Math.hypot(P[i + 1].x - P[i].x, P[i + 1].y - P[i].y); seg.push({ a: P[i], b: P[i + 1], s: L, l }); L += l; }
    const pads = [[0.22, 0.22], [0.5, 0.22], [0.92, 0.22], [0.07, 0.49], [0.48, 0.49], [0.75, 0.49], [0.38, 0.77], [0.6, 0.77], [0.93, 0.76]]
      .map(([x, y]) => ({ x: x * W, y: top + Math.min(0.97, y) * ph, t: null }));
    G.s = { P, seg, L, pads, foes: [], shots: [], fx: [], money: 110, lives: 10, score: 0, wave: 0, toSpawn: 0, spawnT: 0, breakT: 2.5, sel: 0, msg: null, bot, unl: 0, boss: null };
  },
  // Three lines of dogs. Each line has 3 models; better models unlock as your score climbs.
  LINES: [
    [{ name: "BONE", cost: 40, range: 92, rate: 0.55, dmg: 1, em: "🦴", face: ":dawgW:" },
     { name: "TENNIS", cost: 130, range: 105, rate: 0.35, dmg: 3, em: "🎾", face: ":dawgpog:" },
     { name: "FRISBEE", cost: 320, range: 122, rate: 0.22, dmg: 7.5, em: "🥏", face: ":dawgW:" }],
    [{ name: "HOSE", cost: 65, range: 78, rate: 0.9, dmg: 0.7, splash: 44, em: "💦", face: ":dawgpog:" },
     { name: "SPRINKLR", cost: 170, range: 90, rate: 0.8, dmg: 2, splash: 60, em: "🚿", face: ":dawgsweat:" },
     { name: "HYDRANT", cost: 400, range: 104, rate: 0.7, dmg: 5, splash: 76, em: "🧯", face: ":dawgpog:" }],
    [{ name: "BARK", cost: 100, range: 150, rate: 1.5, dmg: 5, em: "📣", face: ":dawgsus:" },
     { name: "HOWL", cost: 230, range: 178, rate: 1.25, dmg: 15, em: "🔊", face: ":dawgsus:" },
     { name: "THUNDER", cost: 480, range: 215, rate: 1.05, dmg: 38, em: "⚡", face: ":dawgW:" }]
  ],
  UNLOCK: [0, 1200, 3500],
  BOSSES: [{ n: "MAILMAN MAX", em: "📮" }, { n: "THE VACUUM", em: "🧹" }, { n: "BATH TIME", em: "🛁" }, { n: "THE CAT KING", em: "😼" }],
  FOES: { sq: { hp: 2, sp: 54, val: 5, em: "🐿️", sz: 24 }, cat: { hp: 5, sp: 40, val: 9, em: "🐈", sz: 24 }, coon: { hp: 4, sp: 78, val: 10, em: "🦝", sz: 26 }, mail: { hp: 18, sp: 26, val: 30, em: "📮", sz: 30 } },
  ty(t) { return this.LINES[t.k][t.tier]; },
  pos(s, d) { for (const g of s.seg) if (d <= g.s + g.l) { const f = (d - g.s) / g.l; return { x: g.a.x + (g.b.x - g.a.x) * f, y: g.a.y + (g.b.y - g.a.y) * f }; } return s.P[s.P.length - 1]; },
  update(G, dt) {
    const s = G.s;
    if (s.unl < 2 && s.score >= this.UNLOCK[s.unl + 1]) { s.unl++; s.msg = { txt: "NEW DOGS UNLOCKED!", t: 2.2 }; G.sfx("win"); }
    if (s.msg) { s.msg.t -= dt; if (s.msg.t <= 0) s.msg = null; }
    // waves
    if (!s.toSpawn && !s.foes.length) {
      if (s.wave && !s.paid) { s.paid = true; s.money += 15 + 3 * s.wave; s.score += 25 * s.wave; }
      s.breakT -= dt;
      if (s.breakT <= 0) { s.wave++; s.paid = false; s.toSpawn = Math.min(40, 6 + s.wave * 2) + (s.wave % 5 === 0 ? 1 : 0); s.spawnT = 0; s.msg = { txt: s.wave % 5 === 0 ? `BOSS WAVE ${s.wave}!` : `WAVE ${s.wave}`, t: 1.4 }; }
    }
    if (s.toSpawn) {
      s.spawnT -= dt;
      if (s.spawnT <= 0) {
        const n = s.wave, r = Math.random(), mult = (1 + 0.32 * n) * Math.pow(1.06, n), spd = Math.min(1.5, 1 + 0.015 * n);
        if (n % 5 === 0 && s.toSpawn === 1) { // boss closes out every 5th wave
          const bi = (n / 5 - 1) % 4, B = this.BOSSES[bi], tier = Math.floor((n / 5 - 1) / 4), hp = 35 * mult * (1 + bi * 0.5) * (1 + tier);
          const f = { k: "boss", em: B.em, sz: 46, bn: B.n, d: 0, hp, max: hp, sp: 22 * spd, slow: 0, val: 80 + 20 * bi, cost: 4 };
          s.foes.push(f); s.boss = f; s.msg = { txt: `BOSS: ${B.n}!`, t: 2 }; G.sfx("lose");
        } else {
          const k = n >= 6 && r < 0.1 ? "mail" : n >= 7 && r < 0.3 ? "coon" : n >= 3 && r < 0.5 ? "cat" : "sq", F = this.FOES[k];
          const hp = F.hp * mult;
          s.foes.push({ k, em: F.em, sz: F.sz, d: 0, hp, max: hp, sp: F.sp * spd, slow: 0, val: F.val, cost: 1 });
        }
        s.toSpawn--; s.spawnT = Math.max(0.25, 1.0 - n * 0.04);
        if (!s.toSpawn) s.breakT = 3;
      }
    }
    s.foes.forEach(f => { f.d += f.sp * (f.slow > 0 ? 0.5 : 1) * dt; f.slow -= dt; const p = this.pos(s, f.d); f.x = p.x; f.y = p.y; });
    const kill = f => { if (f.dead) return; f.dead = true; s.money += f.val; s.score += f.val * 2; s.fx.push({ x: f.x, y: f.y, t: 0.4, txt: "+" + f.val }); };
    s.foes.forEach(f => { if (!f.dead && f.d >= s.L) { f.dead = true; s.lives -= f.cost; G.buzz(); G.sfx("lose"); } });
    if (s.boss && s.boss.dead) { if (s.boss.hp <= 0) { s.msg = { txt: "BOSS DOWN!", t: 1.6 }; G.sfx("win"); } s.boss = null; }
    if (s.lives <= 0) { s.foes = s.foes.filter(f => !f.dead); G.over(Math.min(99999, s.score), `Wave ${s.wave}. The yard has fallen!`); return; }
    // towers
    s.pads.forEach(p => {
      if (!p.t) return; const ty = this.ty(p.t), lv = p.t.lv, rng = ty.range * (1 + 0.12 * (lv - 1));
      p.t.cd -= dt; if (p.t.cd > 0) return;
      let best = null; s.foes.forEach(f => { if (!f.dead && Math.hypot(f.x - p.x, f.y - p.y) < rng && (!best || f.d > best.d)) best = f; });
      if (!best) return;
      p.t.cd = ty.rate; const dmg = ty.dmg * Math.pow(1.7, lv - 1);
      if (p.t.k === 0) s.shots.push({ x: p.x, y: p.y, f: best, dmg });
      else if (p.t.k === 1) { s.foes.forEach(f => { if (!f.dead && Math.hypot(f.x - best.x, f.y - best.y) < ty.splash) { f.hp -= dmg; f.slow = f.k === "boss" ? 0.5 : 1.5; if (f.hp <= 0) kill(f); } }); s.fx.push({ x: best.x, y: best.y, t: 0.25, splash: ty.splash, fx: p.x, fy: p.y }); }
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
  next(s, t) { // what tapping a posted dog does next: {c: cost, evolve: bool} or null when maxed / not unlocked yet
    if (t.lv < 3) return { c: Math.round(this.ty(t).cost * (t.lv === 1 ? 1 : 1.8)) };
    if (t.tier < s.unl) return { c: Math.round(this.LINES[t.k][t.tier + 1].cost * 0.8), evolve: true };
    return null;
  },
  tap(G, x, y) {
    const s = G.s;
    if (y > s.bot) { const i = Math.floor(x / (G.W / 3)); if (this.LINES[i]) s.sel = i; return; }
    const p = s.pads.find(p => Math.hypot(p.x - x, p.y - y) < 30); if (!p) return;
    if (!p.t) {
      const ty = this.LINES[s.sel][s.unl]; if (s.money < ty.cost) { s.msg = { txt: `NEED ${ty.cost} 🍖`, t: 0.9 }; return; }
      s.money -= ty.cost; p.t = { k: s.sel, tier: s.unl, lv: 1, cd: 0 }; G.sfx("pop");
    } else {
      const nx = this.next(s, p.t);
      if (!nx) { s.msg = { txt: p.t.tier < 2 ? `NEXT DOG AT ${this.UNLOCK[p.t.tier + 1]} PTS` : "MAXED OUT", t: 1 }; return; }
      if (s.money < nx.c) { s.msg = { txt: `${nx.evolve ? "SWAP" : "UPGRADE"} ${nx.c} 🍖`, t: 0.9 }; return; }
      s.money -= nx.c; if (nx.evolve) { p.t.tier++; p.t.lv = 1; s.msg = { txt: `${this.ty(p.t).name}!`, t: 1 }; } else p.t.lv++; G.sfx("win");
    }
  },
  draw(G, c) {
    const s = G.s, W = G.W, H = G.H, dark = G.dark(), T = this.LINES.map(l => l[s.unl || 0]);
    c.fillStyle = dark ? "#1f3a1c" : "#7cc35b"; c.fillRect(0, 0, W, H);
    c.fillStyle = dark ? "#244520" : "#86cd64"; for (let y = 0; y < H; y += 24) for (let x = (y / 24) % 2 ? 12 : 0; x < W; x += 24) c.fillRect(x, y, 12, 12);
    c.lineJoin = "round"; c.lineCap = "round";
    [[38, dark ? "#4a3420" : "#9b6b3c"], [30, dark ? "#6b4a2c" : "#c99a62"]].forEach(([w, col]) => { c.strokeStyle = col; c.lineWidth = w; c.beginPath(); s.P.forEach((p, i) => i ? c.lineTo(p.x, p.y) : c.moveTo(p.x, p.y)); c.stroke(); });
    const end = s.P[s.P.length - 2]; G.emoji(c, "🏠", W - 22, end.y - 26, 34);
    s.pads.forEach(p => {
      c.fillStyle = dark ? "rgba(0,0,0,0.35)" : "rgba(60,40,20,0.25)"; c.beginPath(); c.arc(p.x, p.y, 22, 0, 7); c.fill();
      if (!p.t) { c.strokeStyle = "rgba(255,255,255,0.6)"; c.lineWidth = 2; c.setLineDash([4, 4]); c.beginPath(); c.arc(p.x, p.y, 20, 0, 7); c.stroke(); c.setLineDash([]); G.text(c, "+", p.x, p.y + 1, 14, "rgba(255,255,255,0.8)"); return; }
      const ty = this.ty(p.t), ring = ["#c98a4b", "#d9dee6", "#ffd23f"][p.t.tier];
      c.strokeStyle = ring; c.lineWidth = 3; c.beginPath(); c.arc(p.x, p.y, 21, 0, 7); c.stroke();
      G.img(c, ty.face, p.x, p.y - 2, 36); c.fillStyle = "rgba(255,255,255,0.85)"; c.beginPath(); c.arc(p.x + 16, p.y + 14, 11, 0, 7); c.fill(); G.emoji(c, ty.em, p.x + 16, p.y + 14, 16);
      G.text(c, "★".repeat(p.t.lv), p.x, p.y - 24, 10, ring);
      const nx = this.next(s, p.t); if (nx && s.money >= nx.c) { c.fillStyle = "#2e7d32"; c.beginPath(); c.arc(p.x - 16, p.y + 14, 9, 0, 7); c.fill(); G.text(c, nx.evolve ? "⇪" : "▲", p.x - 16, p.y + 15, 10, "#fff"); }
    });
    s.foes.forEach(f => {
      if (f.x == null) return;
      G.emoji(c, f.em, f.x, f.y - 4, f.sz);
      if (f.k === "boss") return;
      c.fillStyle = "#300"; c.fillRect(f.x - 13, f.y - 22, 26, 4); c.fillStyle = f.slow > 0 ? "#5ab0ff" : "#5be35b"; c.fillRect(f.x - 13, f.y - 22, 26 * Math.max(0, f.hp / f.max), 4);
    });
    s.shots.forEach(b => G.emoji(c, "🦴", b.x, b.y, 14));
    s.fx.forEach(e => {
      if (e.splash) { c.fillStyle = "rgba(90,176,255,0.35)"; c.beginPath(); c.arc(e.x, e.y, e.splash, 0, 7); c.fill(); }
      else if (e.line) { c.strokeStyle = "rgba(255,210,63,0.9)"; c.lineWidth = 3; c.beginPath(); c.moveTo(e.fx, e.fy); c.lineTo(e.x, e.y); c.stroke(); }
      else G.text(c, e.txt, e.x, e.y - 20 - (0.4 - e.t) * 40, 10, "#ffd23f");
    });
    G.hud(c, `🍖${s.money}`, `WAVE ${s.wave} · ${s.score}`, `❤️${Math.max(0, s.lives)}`);
    if (s.boss && !s.boss.dead) { const b = s.boss, bw = W - 40; c.fillStyle = "rgba(0,0,0,0.6)"; c.fillRect(20, 40, bw, 16); c.fillStyle = "#e53935"; c.fillRect(22, 42, (bw - 4) * Math.max(0, b.hp / b.max), 12); G.text(c, b.bn, W / 2, 48, 9, "#fff"); }
    else if (s.unl < 2) { const a = this.UNLOCK[s.unl], b = this.UNLOCK[s.unl + 1]; c.fillStyle = "rgba(0,0,0,0.35)"; c.fillRect(20, 40, W - 40, 6); c.fillStyle = "#ffd23f"; c.fillRect(20, 40, (W - 40) * Math.min(1, (s.score - a) / (b - a)), 6); }
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
