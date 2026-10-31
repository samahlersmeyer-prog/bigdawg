// ---------- Blumji Bounce (Arcade: platform-hop puzzles) ----------
// Pull back and let go to bounce the pup in an arc. Land on a platform to stand there, then bounce again.
// Reach the 🚩 platform to clear the stage. Miss and fall = back to the last platform you stood on (still counts).
// Pink pads bounce you back up, blue platforms slide side to side (you ride them).
// 12 stages. Each is worth up to 500 (par or better), 100 less per extra bounce, never below 100.
(function () {
  const GR = 140, FEET = 2.4;
  // ---- stages (a 100 x 150 screen, y grows downward) ----
  // p: platforms [x, top y, width, type, move range, move speed]; type "" normal, "b" pink bouncy pad, "m" moving.
  // The first platform is the start, the last one has the flag.
  const LV = [
    { p: [[6, 130, 20], [70, 130, 22]], par: 1, tip: "PULL BACK AND LET GO" },
    { p: [[6, 136, 18], [42, 112, 16], [76, 86, 18]], par: 2, tip: "HOP UP TO THE FLAG" },
    { p: [[4, 136, 16], [64, 98, 26]], par: 1, tip: "AIM HIGH" },
    { p: [[6, 92, 16], [38, 140, 18, "b"], [76, 70, 20]], par: 1, tip: "PINK PADS BOUNCE YOU" },
    { p: [[6, 136, 16], [42, 108, 14, "m", 18, 0.9], [78, 80, 18]], par: 2, tip: "RIDE THE BLUE ONES" },
    { p: [[72, 140, 22], [16, 114, 14], [66, 88, 14], [14, 60, 14], [58, 32, 26]], par: 2, tip: "ZIG ZAG UP" },
    { p: [[4, 136, 16], [48, 118, 6], [86, 118, 10]], par: 1, tip: "NARROW ONES" },
    { p: [[6, 50, 14], [26, 142, 14, "b"], [62, 142, 14, "b"], [80, 44, 16]], par: 1 },
    { p: [[6, 136, 16], [34, 108, 12, "m", 24, 1.1], [62, 78, 10, "m", 14, 1.6], [40, 44, 18]], par: 3 },
    { p: [[44, 140, 14], [6, 112, 12], [82, 104, 12], [40, 80, 20, "b"], [42, 50, 16]], par: 2 },
    { p: [[4, 136, 14], [34, 140, 10, "b"], [62, 112, 8, "m", 20, 1.3], [24, 72, 10, "m", 16, 1.0], [70, 40, 22]], par: 2 },
    { p: [[84, 140, 14], [56, 118, 8], [30, 96, 8, "m", 14, 1.4], [6, 70, 10], [40, 140, 10, "b"], [36, 30, 10, "m", 22, 0.8], [76, 20, 20]], par: 4 }
  ];
  // ---- physics (pure, so the stages can be checked off-screen) ----
  function plats(L, t) { return L.p.map((a, i) => { const off = a[3] === "m" ? a[4] * Math.sin(t * a[5]) : 0; return { i, x: a[0] + off, y: a[1], w: a[2], k: a[3] || "", flag: i === L.p.length - 1 }; }); }
  // one fixed step of a flying pup; returns { land: platform } / "out" / ""
  function step(L, b, t, dt) {
    const py = b.y; b.vy += GR * dt; b.x += b.vx * dt; b.y += b.vy * dt;
    if (b.x < FEET) { b.x = FEET; b.vx = -b.vx * 0.6; } if (b.x > 100 - FEET) { b.x = 100 - FEET; b.vx = -b.vx * 0.6; }
    if (b.vy > 0) for (const p of plats(L, t)) {
      if (py <= p.y && b.y >= p.y && b.x >= p.x - 1.5 && b.x <= p.x + p.w + 1.5) {
        b.y = p.y;
        if (p.k === "b") { b.vy = -Math.min(150, Math.max(105, b.vy * 1.08)); return { bounce: p }; }
        return { land: p };
      }
    }
    return b.y > 165 ? "out" : "";
  }
  const SPEED = p => 30 + 100 * p;
  const levelPts = (n, par) => Math.max(100, 500 - 100 * Math.max(0, n - par));
  const stars = (n, par) => n <= par ? 3 : n === par + 1 ? 2 : 1;
  const ENG = { LV, plats, step, SPEED, GR };

  function view(G) { const S = Math.min(G.W / 100, (G.H - 40) / 150); return { S, ox: (G.W - 100 * S) / 2, oy: G.H - 150 * S - 2 }; }

  const game = {
    key: "blumji", name: "Blumji Bounce", icon: "🚩", max: 99999,
    blurb: "Bounce platform to platform. Reach the flag. 12 stages.",
    how: "Press and pull back, then let go to bounce your pup (the dots show the path). Land on a platform to stand there, then bounce again. Reach the 🚩 flag platform to clear the stage. Miss and you drop back to the last platform you stood on (that bounce still counts). Pink pads bounce you back up, blue platforms slide side to side and carry you with them. Each stage is worth 500 if you make it in par bounces (the stars), 100 less for each extra bounce. Stuck? Tap ↺ to restart the stage. 12 stages.",
    reset(G) { G.s = { lv: 0, score: 0 }; this.newLevel(G); },
    newLevel(G) { const s = G.s; s.L = LV[s.lv]; s.n = 0; s.fx = []; s.clear = 0; s.tt = 0; s.tipT = 4; s.on = 0; this.home(G); },
    home(G) { const s = G.s, p = plats(s.L, s.tt)[s.on]; s.off = p.w / 2; s.pup = { x: p.x + s.off, y: p.y, vx: 0, vy: 0 }; s.phase = "aim"; s.flyT = 0; s.acc = 0; },
    restart(G) { const s = G.s; s.on = 0; this.home(G); },
    advance(G) { const s = G.s; s.lv++; if (s.lv >= LV.length) { s.done = true; return G.over(s.score, "Every flag captured! 🚩"); } this.newLevel(G); },
    save(G) { const s = G.s; if (s.done || s.phase === "clear") return null; return { label: `Stage ${s.lv + 1} · ${s.score} pts`, v: { lv: s.lv, score: s.score } }; },
    load(G, sv) { G.s.lv = sv.v.lv; G.s.score = sv.v.score; this.newLevel(G); },
    update(G, dt) {
      const s = G.s; s.fx.forEach(f => f.t += dt); s.fx = s.fx.filter(f => f.t < 0.6); if (s.tipT > 0) s.tipT -= dt;
      if (s.phase === "clear") { s.clear -= dt; if (s.clear <= 0) this.advance(G); return; }
      if (s.phase === "back") { s.bt -= dt; s.tt += dt; if (s.bt <= 0) this.home(G); return; }
      s.acc += dt;
      while (s.acc >= 1 / 60) { s.acc -= 1 / 60; s.tt += 1 / 60;
        if (s.phase === "aim") { const p = plats(s.L, s.tt)[s.on]; s.pup.x = p.x + s.off; s.pup.y = p.y; continue; }
        if (s.phase !== "fly") break;
        s.flyT += 1 / 60;
        const r = step(s.L, s.pup, s.tt, 1 / 60);
        if (r === "out" || s.flyT > 8) { G.sfx("lose"); s.fx.push({ k: "poof", x: Math.max(4, Math.min(96, s.pup.x)), y: 140, t: 0 }); s.phase = "back"; s.bt = 0.45; break; }
        if (r && r.bounce) { G.sfx("pop"); s.fx.push({ k: "boing", x: s.pup.x, y: s.pup.y, t: 0 }); }
        if (r && r.land) { const p = r.land; s.on = p.i; s.off = Math.max(0, Math.min(p.w, s.pup.x - p.x)); s.phase = "aim";
          if (p.flag) { s.score += levelPts(s.n, s.L.par); s.phase = "clear"; s.clear = 1.6; G.sfx("win"); s.fx.push({ k: "star", x: s.pup.x, y: p.y - 8, t: 0 }); }
          else G.sfx("pop");
          break; }
      }
    },
    shoot(G) { const s = G.s, d = s.drag; if (!d || d.p < 0.06) return; const v = SPEED(d.p);
      s.pup.vx = Math.cos(d.a) * v; s.pup.vy = -Math.sin(d.a) * v; s.phase = "fly"; s.n++; s.flyT = 0; G.sfx("pop"); },
    draw(G, c) {
      const s = G.s, V = view(G), S = V.S, X = x => V.ox + x * S, Y = y => V.oy + y * S, dk = G.dark();
      const sky = c.createLinearGradient(0, 0, 0, G.H); if (dk) { sky.addColorStop(0, "#151a3a"); sky.addColorStop(1, "#33265a"); } else { sky.addColorStop(0, "#9edcff"); sky.addColorStop(1, "#e7f7d9"); }
      c.fillStyle = sky; c.fillRect(0, 0, G.W, G.H);
      c.fillStyle = dk ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.55)"; [[18, 30], [64, 18], [40, 64]].forEach(([x, y]) => { c.beginPath(); c.arc(X(x), Y(y), 7 * S, 0, 7); c.arc(X(x + 7), Y(y - 2), 8 * S, 0, 7); c.arc(X(x + 14), Y(y), 6 * S, 0, 7); c.fill(); });
      plats(s.L, s.tt).forEach(p => {
        const th = 4;
        if (p.k === "b") { c.fillStyle = "#ff6fae"; c.fillRect(X(p.x), Y(p.y), p.w * S, th * S); c.strokeStyle = "#fff"; c.lineWidth = 2; c.beginPath(); for (let x = 0; x <= p.w; x += 3) c.lineTo(X(p.x + x), Y(p.y + (x / 3 % 2 ? 0.8 : th - 0.8))); c.stroke(); }
        else { c.fillStyle = p.k === "m" ? (dk ? "#3f7fbf" : "#4f9be8") : (dk ? "#5b4a3a" : "#9b6b43"); c.fillRect(X(p.x), Y(p.y), p.w * S, th * S);
          c.fillStyle = p.k === "m" ? "#bfe3ff" : (dk ? "#4c8a4c" : "#6cc24a"); c.fillRect(X(p.x), Y(p.y), p.w * S, 1.4 * S); }
        if (p.flag) { const fx = X(p.x + p.w - 3), fy = Y(p.y); c.strokeStyle = dk ? "#ddd" : "#555"; c.lineWidth = Math.max(2, S * 0.6); c.beginPath(); c.moveTo(fx, fy); c.lineTo(fx, fy - 16 * S); c.stroke();
          const wv = Math.sin(G.t * 6) * S; c.fillStyle = "#e53935"; c.beginPath(); c.moveTo(fx, fy - 16 * S); c.lineTo(fx - 9 * S, fy - 13 * S + wv); c.lineTo(fx, fy - 10 * S); c.closePath(); c.fill(); }
      });
      if (s.phase === "aim" && s.drag && s.drag.p > 0.06) { const v = SPEED(s.drag.p), vx = Math.cos(s.drag.a) * v, vy = -Math.sin(s.drag.a) * v;
        c.fillStyle = "rgba(255,255,255,0.9)"; for (let i = 1; i <= 16; i++) { const t = i * 0.05, x = s.pup.x + vx * t, y = s.pup.y + vy * t + 0.5 * GR * t * t; c.beginPath(); c.arc(X(x), Y(y), Math.max(1.5, S * 0.7 * (1 - i / 22)), 0, 7); c.fill(); } }
      if (s.phase !== "back") { const sq = s.phase === "aim" && s.drag ? 1 - 0.25 * s.drag.p : 1;
        c.save(); c.translate(X(s.pup.x), Y(s.pup.y)); c.scale(1 / Math.sqrt(sq), sq); G.img(c, s.phase === "clear" ? ":dawgpog:" : s.phase === "fly" ? ":dawgsus:" : ":dawgW:", 0, -5.5 * S, 11 * S); c.restore(); }
      s.fx.forEach(f => { c.globalAlpha = Math.max(0, 1 - f.t / 0.6); G.emoji(c, f.k === "star" ? "✨" : f.k === "boing" ? "💫" : "💨", X(f.x), Y(f.y), 10 * S * (1 + f.t)); c.globalAlpha = 1; });
      G.hud(c, `STAGE ${s.lv + 1}/${LV.length}`, `${s.score}`, `HOPS ${s.n}`);
      if (s.phase === "clear") { const st = stars(s.n, s.L.par); c.fillStyle = "rgba(0,0,0,0.45)"; c.fillRect(0, G.H * 0.3 - 40, G.W, 110);
        G.banner(c, s.n <= s.L.par ? "FLAWLESS!" : "FLAG!", "#ffd23f", G.H * 0.3); G.text(c, "★".repeat(st) + "☆".repeat(3 - st), G.W / 2, G.H * 0.3 + 34, 18, "#ffd23f"); G.text(c, `+${levelPts(s.n, s.L.par)}`, G.W / 2, G.H * 0.3 + 58, 11, "#fff"); }
      s.btns = [{ k: "reset", x: G.W - 50, y: 40, w: 44, h: 40 }]; c.fillStyle = "rgba(0,0,0,0.45)"; c.beginPath(); c.arc(G.W - 28, 60, 18, 0, 7); c.fill(); G.text(c, "↺", G.W - 28, 61, 14, "#fff");
      if (s.n >= s.L.par + 5) { s.btns.push({ k: "skip", x: 8, y: 40, w: 70, h: 36 }); c.fillStyle = "rgba(0,0,0,0.45)"; c.fillRect(8, 42, 70, 32); G.text(c, "SKIP", 43, 58, 10, "#fff"); }
      G.text(c, `PAR ${s.L.par}`, 12, 92, 9, dk ? "#ccd" : "#335", "left");
      if (s.tipT > 0 && s.L.tip) G.hint(c, s.L.tip, s.tipT, G.H * 0.2);
    },
    down(G, x, y) { const s = G.s, b = (s.btns || []).find(b => x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h);
      if (b) { if (s.phase === "clear") return; if (b.k === "reset") { s.n = 0; this.restart(G); } if (b.k === "skip") { s.n = 99; this.advance(G); } return; }
      if (s.phase === "aim") s.drag = { sx: x, sy: y, a: 0.8, p: 0 }; },
    move(G, x, y) { const d = G.s.drag; if (!d || G.s.phase !== "aim") return; const dx = d.sx - x, dy = d.sy - y; d.p = Math.min(1, Math.hypot(dx, dy) / 150); d.a = Math.atan2(-dy, dx); },
    up(G) { const s = G.s; if (s.phase === "aim" && s.drag) this.shoot(G); s.drag = null; }
  };
  game._eng = ENG;
  if (typeof defGame === "function") defGame(game); else if (typeof module !== "undefined") module.exports = game;
})();
