// ---------- Bow Wow (archery) ----------
// 10 arrows at a target that moves farther back. Drag to aim, let go to shoot. Mind the wind and the wobble.
defGame({
  key: "archery", name: "Bow Wow", icon: "🏹", max: 100, cat: "sports",
  blurb: "Archery. 10 arrows, mind the wind.",
  how: "Put your thumb down and drag to move the crosshair onto the target, then let go to shoot. The wind pushes your arrow (watch the flag), and if you hold too long your aim starts to wobble. 10 arrows, bullseye is 10. Perfect is 100.",
  dists: [20, 20, 20, 40, 40, 40, 60, 60, 60, 70],
  reset(G) { G.s = { n: 0, total: 0, shots: [], aim: null, fly: null, last: null, wind: 0 }; this.next(G); },
  next(G) { const s = G.s; s.wind = Math.round((Math.random() * 2 - 1) * Math.min(12, 3 + s.n * 1.2)); if (s.n && this.dists[s.n] !== this.dists[s.n - 1]) s.shots = []; },
  tgt(G) { const s = G.s, m = this.dists[Math.min(9, s.n)], r = Math.min(G.W * 0.42, 150) * (20 / m) ** 0.6; return { x: G.W / 2, y: 44 + (G.H - 170) * 0.48, r, m }; },
  down(G, x, y) { const s = G.s; if (s.fly || s.n >= 10) return; const t = this.tgt(G), an = Math.random() * 6.28, cx = t.x + Math.cos(an) * t.r * 0.9, cy = t.y + Math.sin(an) * t.r * 0.9; s.aim = { x0: x, y0: y, cx, cy, held: 0, x: cx, y: cy }; s.aim.bx = s.aim.cx; s.aim.by = s.aim.cy; },
  move(G, x, y) { const a = G.s.aim; if (!a) return; a.bx = a.cx + (x - a.x0) * 0.7; a.by = a.cy + (y - a.y0) * 0.7; },
  up(G) {
    const s = G.s, a = s.aim; s.aim = null; if (!a || s.fly) return;
    const t = this.tgt(G), drift = s.wind * t.r * 0.045 * (t.m / 20) ** 0.5;
    s.fly = { x: a.x + drift, y: a.y + 3, t: 0, sx: G.W / 2, sy: G.H - 60 }; G.sfx("pop");
  },
  update(G, dt) {
    const s = G.s, a = s.aim;
    if (a) { a.held += dt; const sway = 2 + Math.max(0, a.held - 2.2) * 12; a.x = a.bx + Math.sin(G.t * 3.1) * sway + Math.sin(G.t * 7.3) * sway * 0.4; a.y = a.by + Math.cos(G.t * 2.6) * sway; }
    const f = s.fly;
    if (f) {
      f.t += dt * 2.2;
      if (f.t >= 1) {
        const t = this.tgt(G), d = Math.hypot(f.x - t.x, f.y - t.y), pts = Math.max(0, 10 - Math.floor(d / (t.r / 10)));
        s.total += pts; s.shots.push({ dx: (f.x - t.x) / t.r, dy: (f.y - t.y) / t.r }); s.last = { pts, x: d < t.r / 20, t: 1.3 };
        G.sfx(pts >= 9 ? "win" : pts ? "pop" : "lose"); if (!pts) G.buzz();
        s.fly = null; s.n++;
        if (s.n >= 10) { s.endT = 1.2; } else this.next(G);
      }
    }
    if (s.last) { s.last.t -= dt; if (s.last.t <= 0) s.last = null; }
    if (s.endT != null) { s.endT -= dt; if (s.endT <= 0) { s.endT = null; G.over(s.total, s.total >= 90 ? "Robin Hound!" : s.total >= 70 ? "Sharp shooter." : "Keep practicing, pup."); } }
  },
  draw(G, c) {
    const s = G.s, W = G.W, H = G.H, dark = G.dark(), t = this.tgt(G);
    c.fillStyle = dark ? "#16213e" : "#9ed8ff"; c.fillRect(0, 0, W, H * 0.4);
    c.fillStyle = dark ? "#1f3a1c" : "#7cc35b"; c.fillRect(0, H * 0.4, W, H);
    c.fillStyle = dark ? "#2a4a26" : "#6bb34c"; for (let y = H * 0.4; y < H; y += 30) c.fillRect(0, y, W, 2);
    // target stand + rings
    c.fillStyle = "#8a5a2b"; c.fillRect(t.x - t.r * 0.6, t.y, 6, t.r * 1.4); c.fillRect(t.x + t.r * 0.6 - 6, t.y, 6, t.r * 1.4);
    const rc = ["#fff", "#fff", "#222", "#222", "#2f7de1", "#2f7de1", "#e53935", "#e53935", "#ffd23f", "#ffd23f"];
    for (let i = 0; i < 10; i++) { c.fillStyle = rc[i]; c.beginPath(); c.arc(t.x, t.y, t.r * (10 - i) / 10, 0, 7); c.fill(); c.strokeStyle = i === 2 || i === 3 ? "#666" : "#222"; c.lineWidth = 1; c.stroke(); }
    s.shots.forEach(p => { const x = t.x + p.dx * t.r, y = t.y + p.dy * t.r; c.fillStyle = "#5a3a22"; c.fillRect(x - 1, y - 1, 10, 3); c.fillStyle = "#ff4d4d"; c.fillRect(x + 7, y - 3, 5, 7); c.fillStyle = "#111"; c.beginPath(); c.arc(x, y, 2.5, 0, 7); c.fill(); });
    // wind flag
    const fx = W - 40, fy = 60, w = s.wind; c.fillStyle = dark ? "#ccc" : "#555"; c.fillRect(fx, fy, 3, 44);
    c.fillStyle = "#ff6b6b"; c.beginPath(); c.moveTo(fx + 2, fy + 2); c.lineTo(fx + 2 + w * 3, fy + 8 + Math.sin(G.t * 8) * 2); c.lineTo(fx + 2, fy + 14); c.fill();
    G.text(c, w ? `${Math.abs(w)} ${w > 0 ? "→" : "←"}` : "CALM", fx, fy + 56, 10, dark ? "#fff" : "#222");
    G.text(c, `${t.m}M`, 36, 60, 12, dark ? "#fff" : "#222");
    // archer pup
    G.img(c, s.aim ? ":dawgsus:" : ":dawgW:", W / 2, H - 52, 64); G.emoji(c, "🏹", W / 2 + 34, H - 56, 34);
    const f = s.fly; if (f) { const x = f.sx + (f.x - f.sx) * f.t, y = f.sy + (f.y - f.sy) * f.t - Math.sin(f.t * Math.PI) * 40, sc = 1 - f.t * 0.6; c.fillStyle = "#5a3a22"; c.fillRect(x - 1.5 * sc, y, 3 * sc, 26 * sc); c.fillStyle = "#ff4d4d"; c.fillRect(x - 4 * sc, y + 20 * sc, 8 * sc, 8 * sc); }
    const a = s.aim; if (a) { c.strokeStyle = "#ff1744"; c.lineWidth = 2.5; c.beginPath(); c.arc(a.x, a.y, 11, 0, 7); c.moveTo(a.x - 18, a.y); c.lineTo(a.x + 18, a.y); c.moveTo(a.x, a.y - 18); c.lineTo(a.x, a.y + 18); c.stroke(); }
    G.hud(c, `ARROW ${Math.min(10, s.n + 1)}/10`, `${s.total}`, s.last ? (s.last.x ? "X!" : `+${s.last.pts}`) : "");
    if (s.last) G.banner(c, s.last.x ? "BULLSEYE!" : s.last.pts >= 9 ? "NICE!" : s.last.pts ? `${s.last.pts}` : "MISS", s.last.pts >= 9 ? "#ffd23f" : "#fff", H * 0.82);
    G.hint(c, "DRAG TO AIM · LET GO", 5, H - 120);
  }
});
