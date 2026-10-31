// ---------- Blumji Bounce (Arcade: platform-hop puzzles) ----------
// Hold (thumb on the screen, or the space bar) to charge, let go to bounce. The angle is fixed; the pup always
// faces the next platform. How long you hold = how far you go. Land on a platform to stand there, then bounce again.
// Reach the 🚩 platform to clear the stage. Miss and fall = back to the last platform you stood on (still counts).
// Pink pads bounce you back up, blue platforms slide side to side (you ride them).
// 12 stages. Each is worth up to 500 (par or better), 100 less per extra bounce, never below 100.
(function () {
  const GR = 140, FEET = 2.4;
  // ---- stages (a 100 x 150 screen, y grows downward) ----
  // p: platforms [x, top y, width, type, move range, move speed]; type "" normal, "b" pink bouncy pad, "m" moving.
  // The first platform is the start, the last one has the flag.
  const LV = [
    { p: [[6, 130, 20], [70, 130, 22]], par: 1, tip: "HOLD TO CHARGE, LET GO" },
    { p: [[6, 136, 18], [42, 112, 16], [76, 86, 18]], par: 2, tip: "HOP UP TO THE FLAG" },
    { p: [[4, 136, 16], [64, 98, 26]], par: 1, tip: "HOLD LONGER TO GO FARTHER" },
    { p: [[6, 92, 16], [38, 140, 18, "b"], [76, 70, 20]], par: 1, tip: "PINK PADS BOUNCE YOU" },
    { p: [[6, 136, 16], [42, 108, 14, "m", 18, 0.9], [78, 80, 18]], par: 2, tip: "RIDE THE BLUE ONES" },
    { p: [[72, 140, 22], [16, 114, 14], [66, 88, 14], [14, 60, 14], [58, 32, 26]], par: 4, tip: "ZIG ZAG UP" },
    { p: [[4, 136, 16], [48, 118, 6], [86, 118, 10]], par: 1, tip: "NARROW ONES" },
    { p: [[6, 50, 14], [26, 142, 14, "b"], [62, 142, 14, "b"], [80, 44, 16]], par: 1 },
    { p: [[6, 136, 16], [34, 108, 12, "m", 24, 1.1], [62, 78, 10, "m", 14, 1.6], [36, 48, 22]], par: 3 },
    { p: [[44, 140, 14], [6, 112, 12], [82, 104, 12], [52, 92, 16, "b"], [14, 52, 20]], par: 2 },
    { p: [[4, 136, 14], [34, 140, 10, "b"], [62, 112, 8, "m", 20, 1.3], [24, 72, 10, "m", 16, 1.0], [70, 40, 22]], par: 3 },
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
  const ANG = 60 * Math.PI / 180, CHARGE = 1.1; // fixed launch angle; seconds of holding to reach full power
  // which way the pup faces: toward the next platform in the stage's order
  function aimDir(L, on, x, t) { const P = plats(L, t), n = P[Math.min(on + 1, P.length - 1)]; return n.x + n.w / 2 >= x ? 1 : -1; }
  const levelPts = (n, par) => Math.max(100, 500 - 100 * Math.max(0, n - par));
  const stars = (n, par) => n <= par ? 3 : n === par + 1 ? 2 : 1;
  const ENG = { LV, plats, step, SPEED, GR, ANG, aimDir };

  function view(G) { const S = Math.min(G.W / 100, (G.H - 40) / 150); return { S, ox: (G.W - 100 * S) / 2, oy: G.H - 150 * S - 2 }; }

  const game = {
    key: "blumji", name: "Blumji Bounce", icon: "🚩", max: 99999,
    blurb: "Bounce platform to platform. Reach the flag. 12 stages.",
    how: "Hold your thumb on the screen (or hold the space bar) to charge, then let go to bounce. The angle is always the same and your pup faces the next platform, so it's all about how long you hold: watch the power meter. Land on a platform to stand there, then bounce again. Reach the 🚩 flag platform to clear the stage. Miss and you drop back to the last platform you stood on (that bounce still counts). Pink pads bounce you back up, blue platforms slide side to side and carry you with them. Each stage is worth 500 if you make it in par bounces (the stars), 100 less for each extra bounce. Stuck? Tap ↺ to restart the stage. 12 stages.",
    reset(G) { G.s = { lv: 0, score: 0 }; this.newLevel(G); },
    newLevel(G) { const s = G.s; s.L = LV[s.lv]; s.n = 0; s.fx = []; s.clear = 0; s.tt = 0; s.tipT = 4; s.on = 0; this.home(G); },
    home(G) { const s = G.s, p = plats(s.L, s.tt)[s.on]; s.off = p.w / 2; s.pup = { x: p.x + s.off, y: p.y, vx: 0, vy: 0 }; s.phase = "aim"; s.flyT = 0; s.acc = 0; s.charge = null; s.dir = aimDir(s.L, s.on, s.pup.x, s.tt); },
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
        if (s.phase === "aim") { const p = plats(s.L, s.tt)[s.on]; s.pup.x = p.x + s.off; s.pup.y = p.y; s.dir = aimDir(s.L, s.on, s.pup.x, s.tt);
          if (s.charge) s.charge.p = Math.min(1, s.charge.p + 1 / 60 / CHARGE); continue; }
        if (s.phase !== "fly") break;
        s.flyT += 1 / 60;
        const r = step(s.L, s.pup, s.tt, 1 / 60);
        if (r === "out" || s.flyT > 8) { G.sfx("lose"); s.fx.push({ k: "poof", x: Math.max(4, Math.min(96, s.pup.x)), y: 140, t: 0 }); s.phase = "back"; s.bt = 0.45; break; }
        if (r && r.bounce) { G.sfx("pop"); s.fx.push({ k: "boing", x: s.pup.x, y: s.pup.y, t: 0 }); }
        if (r && r.land) { const p = r.land; s.on = p.i; s.off = Math.max(0, Math.min(p.w, s.pup.x - p.x)); s.phase = "aim"; s.charge = null; s.dir = aimDir(s.L, s.on, s.pup.x, s.tt);
          if (p.flag) { s.score += levelPts(s.n, s.L.par); s.phase = "clear"; s.clear = 1.6; G.sfx("win"); s.fx.push({ k: "star", x: s.pup.x, y: p.y - 8, t: 0 }); }
          else G.sfx("pop");
          break; }
      }
    },
    shoot(G) { const s = G.s, d = s.charge; s.charge = null; if (!d || d.p < 0.06) return; const v = SPEED(d.p);
      s.pup.vx = s.dir * Math.cos(ANG) * v; s.pup.vy = -Math.sin(ANG) * v; s.phase = "fly"; s.n++; s.flyT = 0; G.sfx("pop"); },
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
      if (s.phase === "aim") { const p = s.charge ? s.charge.p : 0, ca = Math.cos(ANG) * s.dir, sa = Math.sin(ANG), px = X(s.pup.x), py = Y(s.pup.y - 6);
        // fixed-angle arrow (grows as you charge)
        const len = (7 + 13 * p) * S, ex = px + ca * len, ey = py - sa * len; c.strokeStyle = s.charge ? "#ffd23f" : "rgba(255,255,255,0.75)"; c.lineWidth = Math.max(2, S * 0.7); c.lineCap = "round";
        c.beginPath(); c.moveTo(px + ca * 6 * S, py - sa * 6 * S); c.lineTo(ex, ey); c.stroke();
        const hx = -ca, hy = sa; c.beginPath(); c.moveTo(ex, ey); c.lineTo(ex + (hx * 0.9 - hy * 0.5) * 3 * S, ey + (hy * 0.9 + hx * 0.5) * 3 * S); c.moveTo(ex, ey); c.lineTo(ex + (hx * 0.9 + hy * 0.5) * 3 * S, ey + (hy * 0.9 - hx * 0.5) * 3 * S); c.stroke();
        // power meter beside the pup
        const mx = X(s.pup.x) - s.dir * 8 * S - 3, mh = 18 * S, my = Y(s.pup.y) - mh; c.fillStyle = "rgba(0,0,0,0.4)"; c.fillRect(mx, my, 6, mh);
        c.fillStyle = p >= 1 ? "#ff5a5a" : p > 0.66 ? "#ffb13f" : "#6cdc6c"; c.fillRect(mx, my + mh * (1 - p), 6, mh * p); c.strokeStyle = "rgba(255,255,255,0.8)"; c.lineWidth = 1; c.strokeRect(mx, my, 6, mh); }
      if (s.phase !== "back") { const sq = s.phase === "aim" && s.charge ? 1 - 0.25 * s.charge.p : 1;
        c.save(); c.translate(X(s.pup.x), Y(s.pup.y)); c.scale((s.dir || 1) / Math.sqrt(sq), sq); G.img(c, s.phase === "clear" ? ":dawgpog:" : s.phase === "fly" ? ":dawgsus:" : ":dawgW:", 0, -5.5 * S, 11 * S); c.restore(); }
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
      if (s.phase === "aim" && !s.charge) s.charge = { p: 0 }; },
    up(G) { const s = G.s; if (s.phase === "aim" && s.charge) this.shoot(G); s.charge = null; },
    onKey(G, k, d) { const s = G.s; if (k !== " ") return;
      if (d) { if (s.phase === "aim" && !s.charge) s.charge = { p: 0 }; } // key repeat while held is ignored
      else if (s.phase === "aim" && s.charge) this.shoot(G); }
  };
  game._eng = ENG;
  if (typeof defGame === "function") defGame(game); else if (typeof module !== "undefined") module.exports = game;
})();
