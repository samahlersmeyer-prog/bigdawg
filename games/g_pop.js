// ---------- Pup Pop (dart-and-balloon popper) ----------
// Pull back like a slingshot and let a dart fly. It pierces through balloons. Pop enough to clear the level.
defGame({
  key: "pop", name: "Pup Pop", icon: "🎈", max: 99999,
  blurb: "Fling darts, pop balloons.",
  how: "Drag back anywhere and let go to fling a dart, like a slingshot. Darts arc and pop every balloon they fly through. Pop the target number before you run out of darts. 💣 balloons blow up their neighbors, 🎁 gives a bonus dart.",
  reset(G) { G.s = { lvl: 0, score: 0, darts: 0, need: 0, popped: 0, balls: [], dart: null, aim: null, fx: [], wait: 0, msg: null }; this.level(G); },
  level(G) {
    const s = G.s, W = G.W, H = G.H; s.lvl++; s.balls = []; s.popped = 0;
    const cols = Math.min(7, 3 + Math.floor(s.lvl / 2)), rows = Math.min(7, 3 + Math.floor((s.lvl + 1) / 2)), gap = Math.min(34, (W * 0.58) / cols);
    const x0 = W - 20 - cols * gap + gap / 2, y0 = 70 + Math.random() * Math.max(0, H * 0.5 - rows * gap);
    const cols8 = ["#ff4d4d", "#4da3ff", "#4dd96a", "#ffd23f", "#c86bff", "#ff8fc7"];
    for (let r = 0; r < rows; r++) for (let q = 0; q < cols; q++) {
      if (Math.random() < 0.18) continue;
      const k = Math.random(), sp = s.lvl >= 4 && r % 2 ? (r % 4 === 1 ? 1 : -1) * (14 + s.lvl * 2) : 0;
      s.balls.push({ x: x0 + q * gap, y: y0 + r * gap, bx: x0 + q * gap, ph: Math.random() * 6, sp, kind: k < 0.06 ? "bomb" : k < 0.1 ? "gift" : "", col: cols8[(r + q) % 6] });
    }
    s.darts = 3 + Math.min(3, Math.floor(s.lvl / 3)); s.need = Math.ceil(s.balls.length * Math.min(0.85, 0.55 + s.lvl * 0.03));
    s.msg = { txt: `LEVEL ${s.lvl}`, t: 1.2 };
  },
  launch(G) { return { x: 46, y: G.H - 96 }; },
  down(G, x, y) { const s = G.s; if (s.dart || s.darts <= 0 || s.wait) return; s.aim = { x0: x, y0: y, x, y }; },
  move(G, x, y) { if (G.s.aim) { G.s.aim.x = x; G.s.aim.y = y; } },
  up(G) {
    const s = G.s, a = s.aim; s.aim = null; if (!a) return;
    const v = this.vel(a); if (!v) return;
    const L = this.launch(G); s.dart = { x: L.x, y: L.y, vx: v.x, vy: v.y, hits: 0 }; s.darts--; G.sfx("pop");
  },
  vel(a) {
    let dx = a.x0 - a.x, dy = a.y0 - a.y; const d = Math.hypot(dx, dy); if (d < 12) return null;
    const p = Math.min(d, 150) / 150 * 820; return { x: dx / d * p, y: dy / d * p };
  },
  pop(G, b) {
    const s = G.s; if (b.dead) return; b.dead = true; s.popped++; s.score += 10; s.fx.push({ x: b.x, y: b.y, t: 0.35, c: b.col });
    if (b.kind === "gift") { s.darts++; s.fx.push({ x: b.x, y: b.y, t: 0.8, txt: "+1 DART" }); }
    if (b.kind === "bomb") s.balls.forEach(o => { if (!o.dead && Math.hypot(o.x - b.x, o.y - b.y) < 62) this.pop(G, o); });
  },
  update(G, dt) {
    const s = G.s;
    if (s.msg) { s.msg.t -= dt; if (s.msg.t <= 0) s.msg = null; }
    s.balls.forEach(b => { b.ph += dt * 2; if (b.sp) { b.bx += b.sp * dt; if (b.bx < G.W * 0.35 || b.bx > G.W - 16) b.sp *= -1; } b.x = b.bx; b.yy = b.y + Math.sin(b.ph) * 3; });
    const d = s.dart;
    if (d) {
      for (let k = 0; k < 3; k++) { // substeps so fast darts don't skip balloons
        d.vy += 560 * dt / 3; d.x += d.vx * dt / 3; d.y += d.vy * dt / 3;
        s.balls.forEach(b => { if (!b.dead && Math.hypot(b.x - d.x, b.yy - d.y) < 17 && d.hits < 6) { d.hits++; this.pop(G, b); } });
      }
      if (d.x > G.W + 30 || d.y > G.H + 30 || d.x < -30 || d.hits >= 6) { s.dart = null; s.wait = 0.35; }
    }
    s.balls = s.balls.filter(b => !b.dead);
    s.fx.forEach(e => e.t -= dt); s.fx = s.fx.filter(e => e.t > 0);
    if (s.wait) {
      s.wait = Math.max(0, s.wait - dt); if (s.wait) return;
      if (!s.balls.length || (s.popped >= s.need && !s.darts)) { s.score += 50 * s.lvl + 25 * s.darts; G.sfx("win"); this.level(G); }
      else if (!s.darts) G.over(Math.min(99999, s.score), s.popped >= s.need ? "Nice popping!" : `Level ${s.lvl}. Out of darts!`);
    }
    if (!s.dart && !s.wait && s.balls.length && s.popped >= s.need && s.darts && !s.cleared) { s.cleared = true; s.fx.push({ x: G.W / 2, y: G.H * 0.3, t: 1.2, txt: "TARGET HIT! KEEP POPPING" }); }
    if (s.cleared && s.popped < s.need) s.cleared = false;
  },
  draw(G, c) {
    const s = G.s, W = G.W, H = G.H, dark = G.dark();
    const g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, dark ? "#16213e" : "#8fd3ff"); g.addColorStop(1, dark ? "#1f3a1c" : "#d8f3ff"); c.fillStyle = g; c.fillRect(0, 0, W, H);
    c.fillStyle = dark ? "#244520" : "#7cc35b"; c.fillRect(0, H - 56, W, 56);
    s.balls.forEach(b => {
      c.strokeStyle = dark ? "#aaa" : "#555"; c.lineWidth = 1; c.beginPath(); c.moveTo(b.x, b.yy + 15); c.lineTo(b.x + 2, b.yy + 26); c.stroke();
      c.fillStyle = b.kind === "bomb" ? "#333" : b.col; c.beginPath(); c.ellipse(b.x, b.yy, 13, 15.5, 0, 0, 7); c.fill();
      c.fillStyle = "rgba(255,255,255,0.45)"; c.beginPath(); c.ellipse(b.x - 4, b.yy - 6, 3, 5, -0.4, 0, 7); c.fill();
      if (b.kind) G.emoji(c, b.kind === "bomb" ? "💣" : "🎁", b.x, b.yy + 1, 15);
    });
    const L = this.launch(G);
    // aim preview
    if (s.aim) { const v = this.vel(s.aim); if (v) { c.fillStyle = dark ? "#fff" : "#222"; let x = L.x, y = L.y, vx = v.x, vy = v.y; for (let i = 0; i < 14; i++) { for (let k = 0; k < 4; k++) { vy += 560 * 0.012; x += vx * 0.012; y += vy * 0.012; } c.globalAlpha = 1 - i / 14; c.beginPath(); c.arc(x, y, 3, 0, 7); c.fill(); } c.globalAlpha = 1; } }
    G.img(c, s.darts || s.dart ? ":dawgW:" : ":dawgsweat:", L.x - 8, L.y + 26, 54);
    const dd = s.dart; if (dd) { const an = Math.atan2(dd.vy, dd.vx); c.save(); c.translate(dd.x, dd.y); c.rotate(an); c.fillStyle = "#666"; c.fillRect(-14, -1.5, 18, 3); c.fillStyle = "#ddd"; c.beginPath(); c.moveTo(4, -4); c.lineTo(12, 0); c.lineTo(4, 4); c.fill(); c.fillStyle = "#ff4d4d"; c.fillRect(-18, -4, 6, 8); c.restore(); }
    s.fx.forEach(e => { if (e.txt) G.text(c, e.txt, e.x, e.y - (1 - e.t) * 30, 10, "#ffd23f"); else { c.strokeStyle = e.c; c.lineWidth = 3; c.beginPath(); c.arc(e.x, e.y, 16 + (0.35 - e.t) * 60, 0, 7); c.stroke(); } });
    G.hud(c, `LV ${s.lvl}`, `POP ${s.popped}/${s.need}`, `🎯${s.darts}`);
    G.text(c, `SCORE ${s.score}`, W / 2, 48, 10, dark ? "#fff" : "#222");
    if (s.msg) G.banner(c, s.msg.txt, "#fff", H * 0.45);
    G.hint(c, "DRAG BACK + LET GO", 5);
  }
});
