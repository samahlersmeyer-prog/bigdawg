// ---------- Squirrel Squadron (Arcade: formation space shooter) ----------
// Squirrels, cats and big raccoons swoop in and line up across the sky. Slide your thumb to steer the bulldog;
// he fires bones on his own. Formation fliers dive at you dropping acorns. Clear the sky for the next wave.
// Scoring: squirrel 50 (100 diving), cat 80 (160 diving), raccoon 150 (400 diving, takes two hits). 3 lives.
(function () {
  const KINDS = { sq: { e: "🐿️", pts: 50, dive: 100, hp: 1 }, cat: { e: "🐈", pts: 80, dive: 160, hp: 1 }, boss: { e: "🦝", pts: 150, dive: 400, hp: 2 } };
  const COLS = 8;
  const bez = (a, b, c, t) => (1 - t) * (1 - t) * a + 2 * (1 - t) * t * b + t * t * c;
  defGame({
    key: "squad", name: "Squirrel Squadron", icon: "🚀", max: 999999,
    blurb: "Blast the swooping squadron out of the sky.",
    how: "Slide your thumb anywhere to move the bulldog left and right. He fires bones on his own. Squirrels, cats and big raccoons fly in and line up; then they peel off and dive at you, dropping acorns. Don't get hit! Raccoons take two bones. Hitting a flier while it's diving is worth double (raccoons 400). Clear the sky to start the next wave. 3 lives, plus a bonus life at 20,000.",
    reset(G) {
      const stars = []; for (let i = 0; i < 60; i++) stars.push({ x: Math.random(), y: Math.random(), v: 0.2 + Math.random() * 0.8, c: Math.random() < 0.3 ? "#ffd23f" : "#fff" });
      G.s = { px: G.W / 2, tx: null, keys: 0, lives: 3, score: 0, stage: 0, shots: [], nuts: [], en: [], fireT: 0, diveT: 3, inv: 2, dead: 0, stars, sway: 0, fx: [], banner: 0, extra: false, msg: "" };
      this.wave(G);
    },
    gap(G) { return Math.min(42, (G.W - 50) / COLS); },
    slot(G, e) { const s = G.s, g = this.gap(G); return [G.W / 2 + (e.c - (COLS - 1) / 2) * g + Math.sin(s.sway) * Math.min(24, G.W * 0.05), 64 + e.r * g * 0.92]; },
    wave(G) {
      const s = G.s; s.stage++; s.en = []; s.banner = 2; s.diveT = 3.5;
      const rows = [["boss", [2, 3, 4, 5]], ["cat", [0, 1, 2, 3, 4, 5, 6, 7]], ["cat", [0, 1, 2, 3, 4, 5, 6, 7]], ["sq", [0, 1, 2, 3, 4, 5, 6, 7]], ["sq", [0, 1, 2, 3, 4, 5, 6, 7]]];
      let n = 0;
      rows.forEach(([k, cs], r) => cs.forEach(c => {
        const grp = Math.floor(n / 6), left = grp % 2 === 0;
        s.en.push({ k, r, c, hp: KINDS[k].hp, st: "enter", t: -grp * 0.9 - (n % 6) * 0.13, sx: left ? -30 : G.W + 30, sy: G.H * 0.35, cx: left ? G.W * 0.85 : G.W * 0.15, cy: G.H * 0.62, x: -99, y: -99, shot: 0 });
        n++; }));
    },
    hurt(G) { const s = G.s; if (s.inv > 0 || s.dead > 0) return; s.lives--; s.dead = 1.6; G.sfx("lose"); G.buzz(); s.fx.push({ x: s.px, y: G.H - 70, t: 0, e: "💥" }); s.nuts = []; },
    update(G, dt) {
      const s = G.s, W = G.W, H = G.H, py = H - 70, lvl = s.stage - 1;
      s.sway += dt * 0.9; s.banner = Math.max(0, s.banner - dt);
      s.stars.forEach(st => { st.y += st.v * dt * 0.12; if (st.y > 1) st.y -= 1; });
      // player
      if (s.dead > 0) { s.dead -= dt; if (s.dead <= 0) { if (s.lives <= 0) return G.over(s.score, s.stage > 3 ? `Wave ${s.stage}. Good dog.` : "Acorned! 🌰"); s.px = W / 2; s.inv = 2; s.dead = 0; } }
      else {
        s.inv = Math.max(0, s.inv - dt);
        const want = s.keys ? s.px + s.keys * 400 * dt : s.tx; if (want != null) { const d = want - s.px, mv = 460 * dt; s.px += Math.abs(d) < mv ? d : Math.sign(d) * mv; }
        s.px = Math.max(22, Math.min(W - 22, s.px));
        s.fireT -= dt; if (s.fireT <= 0 && s.shots.length < 3 && s.banner < 1.2) { s.shots.push({ x: s.px, y: py - 22 }); s.fireT = 0.32; }
      }
      s.shots.forEach(b => b.y -= 520 * dt); s.shots = s.shots.filter(b => b.y > 30);
      s.nuts.forEach(b => { b.x += b.vx * dt; b.y += b.vy * dt; }); s.nuts = s.nuts.filter(b => b.y < H + 20);
      // enemies
      const inForm = s.en.filter(e => e.st === "form");
      s.diveT -= dt;
      if (s.diveT <= 0 && inForm.length && !s.dead) {
        const n = Math.min(inForm.length, 1 + (lvl > 1 && Math.random() < 0.5 ? 1 : 0) + (lvl > 3 && Math.random() < 0.4 ? 1 : 0));
        for (let i = 0; i < n; i++) { const e = inForm[Math.floor(Math.random() * inForm.length)]; if (e.st !== "form") continue; e.st = "dive"; e.t = 0; e.dir = e.x < s.px ? 1 : -1; e.shot = 0; }
        s.diveT = Math.max(0.7, 2.6 - lvl * 0.25 - (s.en.length < 10 ? 0.8 : 0)) * (0.7 + Math.random() * 0.6);
      }
      const spd = 1 + lvl * 0.08;
      s.en.forEach(e => {
        const [tx, ty] = this.slot(G, e);
        if (e.st === "enter") { e.t += dt * 0.75 * spd; if (e.t < 0) return; const t = Math.min(1, e.t);
          e.x = bez(e.sx, e.cx, tx, t); e.y = bez(e.sy, e.cy, ty, t); if (t >= 1) e.st = "form"; }
        else if (e.st === "form") { e.x = tx; e.y = ty; }
        else if (e.st === "dive") { e.t += dt;
          const vy = (150 + lvl * 14) * (e.t < 0.5 ? -0.5 + e.t * 2.4 : 1), steer = (s.px - e.x) * (e.k === "boss" ? 1.6 : 1.1);
          e.x += (e.t < 0.6 ? e.dir * 110 : steer + Math.sin(e.t * 3) * 60) * dt; e.y += vy * dt;
          if (e.shot < 1 + (lvl > 2 ? 1 : 0) && e.y > H * 0.28 + e.shot * 60 && e.y < H * 0.6) { e.shot++; const a = Math.atan2(py - e.y, s.px - e.x); const v = 190 + lvl * 15; s.nuts.push({ x: e.x, y: e.y + 10, vx: Math.cos(a) * v * 0.45, vy: Math.max(140, Math.sin(a) * v) }); }
          if (e.y > H + 30) { e.st = "back"; e.y = -30; e.x = tx; } }
        else if (e.st === "back") { e.y += 200 * dt; e.x += (tx - e.x) * Math.min(1, dt * 4); if (e.y >= ty) e.st = "form"; }
      });
      // hits
      s.shots.forEach(b => { for (const e of s.en) { if (e.hp <= 0 || e.st === "enter" && e.t < 0) continue;
        if (Math.abs(b.x - e.x) < 17 && Math.abs(b.y - e.y) < 17) { b.y = -99; e.hp--;
          if (e.hp <= 0) { const k = KINDS[e.k], p = e.st === "form" ? k.pts : k.dive; s.score += p; s.fx.push({ x: e.x, y: e.y, t: 0, txt: e.st !== "form" ? String(p) : null, e: "✨" }); G.sfx("pop"); }
          else G.sfx("pop");
          break; } } });
      s.en = s.en.filter(e => e.hp > 0);
      if (!s.dead && s.inv <= 0) {
        for (const e of s.en) if ((e.st === "dive" || e.st === "back") && Math.abs(e.x - s.px) < 26 && Math.abs(e.y - py) < 24) { e.hp = 0; this.hurt(G); break; }
        for (const b of s.nuts) if (Math.abs(b.x - s.px) < 16 && Math.abs(b.y - py) < 18) { this.hurt(G); break; }
        s.en = s.en.filter(e => e.hp > 0);
      }
      if (!s.extra && s.score >= 20000) { s.extra = true; s.lives++; s.fx.push({ x: W / 2, y: H / 2, t: 0, txt: "1UP!" }); G.sfx("win"); }
      s.fx.forEach(f => f.t += dt); s.fx = s.fx.filter(f => f.t < 0.7);
      if (!s.en.length && !s.dead) { s.score += 500 * s.stage; G.sfx("win"); s.shots = []; s.nuts = []; this.wave(G); }
    },
    draw(G, c) {
      const s = G.s, W = G.W, H = G.H, py = H - 70;
      c.fillStyle = "#0b0b22"; c.fillRect(0, 0, W, H);
      s.stars.forEach(st => { c.fillStyle = st.c; c.globalAlpha = 0.35 + st.v * 0.5; c.fillRect(st.x * W, st.y * H, 2, 2); }); c.globalAlpha = 1;
      s.en.forEach(e => { if (e.st === "enter" && e.t < 0) return; const bob = e.st === "form" ? Math.sin(G.t * 6 + e.c) * 0.12 : 0;
        if (e.k === "boss" && e.hp === 1) { c.fillStyle = "rgba(255,80,80,0.35)"; c.beginPath(); c.arc(e.x, e.y, 15, 0, 7); c.fill(); }
        c.save(); c.translate(e.x, e.y); c.rotate(e.st === "dive" ? Math.PI : bob); G.emoji(c, KINDS[e.k].e, 0, 0, e.k === "boss" ? 30 : 25); c.restore(); });
      c.fillStyle = "#fff8e1"; s.shots.forEach(b => G.emoji(c, "🦴", b.x, b.y, 15));
      s.nuts.forEach(b => G.emoji(c, "🌰", b.x, b.y, 14));
      if (s.dead <= 0 && (s.inv <= 0 || Math.floor(G.t * 10) % 2)) G.img(c, ":dawgW:", s.px, py, 44);
      else if (s.dead > 0) G.img(c, ":dawgpain:", s.px, py, 44 * Math.max(0, s.dead - 0.6));
      s.fx.forEach(f => { c.globalAlpha = 1 - f.t / 0.7; if (f.e) G.emoji(c, f.e, f.x, f.y, 22 + f.t * 30); if (f.txt) G.text(c, f.txt, f.x, f.y - 18 - f.t * 30, 10, "#ffd23f"); }); c.globalAlpha = 1;
      G.hud(c, `${s.score}`, `WAVE ${s.stage}`, "🐶".repeat(Math.max(0, Math.min(5, s.lives))));
      if (s.banner > 0) G.banner(c, `WAVE ${s.stage}`, "#ffd23f");
      G.hint(c, "SLIDE TO MOVE · AUTO-FIRE", 4);
    },
    down(G, x) { G.s.tx = x; }, move(G, x) { G.s.tx = x; }, up(G) { },
    onKey(G, k, d) { const s = G.s; if (k === "ArrowLeft") s.keys = d ? -1 : (s.keys < 0 ? 0 : s.keys); if (k === "ArrowRight") s.keys = d ? 1 : (s.keys > 0 ? 0 : s.keys); if (d && s.keys) s.tx = null; }
  });
})();
