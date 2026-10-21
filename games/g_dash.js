// ---------- Dawg Dash (3-lane endless runner) ----------
// Run the rail yard away from the dogcatcher. Swipe left/right to switch lanes, up to jump, down to slide.
defGame({
  key: "dash", name: "Dawg Dash", icon: "🛹", max: 999999,
  blurb: "Endless runner. Swipe to dodge trains.",
  how: "Swipe LEFT or RIGHT to switch tracks, UP to jump the low barriers, DOWN to slide under the high bars. Trains block a whole track: dodge them, or run up a ramp onto the roof and hop from car to car (and across to trains on other tracks). Grab bones for points. 🧲 pulls bones in, ⭐ doubles points, 🛹 lets you survive one crash. It gets faster the longer you go.",
  reset(G) {
    G.s = { lane: 0, lx: 0, y: 0, vy: 0, roll: 0, dist: 0, sp: 16, bones: 0, score: 0, objs: [], nextZ: 26, mag: 0, dbl: 0, shield: 0, flash: 0, dead: 0, pops: [] };
    this.spawnRow(G.s, 26, true); this.spawnRow(G.s, 42);
  },
  ZMAX: 70, TOP: 2.6, RL: 4,
  spawnRow(s, z, easy) {
    const free = Math.floor(Math.random() * 3) - 1, lvl = Math.min(1, s.dist / 3000);
    for (let ln = -1; ln <= 1; ln++) {
      if (ln === free) continue;
      const r = Math.random(); if (easy && r < 0.6) continue;
      const k = r < 0.25 - lvl * 0.1 ? null : r < 0.5 ? "low" : r < 0.72 ? "high" : "train";
      if (!k) continue;
      if (k !== "train") { s.objs.push({ k, lane: ln, z, len: 0.6 }); continue; }
      // trains: often with a ramp up front, sometimes coupled to a second car you can hop onto
      let zz = z; const cars = Math.random() < 0.45 ? 2 : 1, ramp = Math.random() < 0.6;
      for (let i = 0; i < cars; i++) { const len = 7 + Math.random() * 4; s.objs.push({ k: "train", lane: ln, z: zz, len, ramp: ramp && i === 0 }); if (ramp) for (let b = 1; b < 5; b++) s.objs.push({ k: "bone", lane: ln, z: zz + b * len / 5, len: 0.4, h: this.TOP }); zz += len + 1.4; }
      s.far = Math.max(s.far || 0, zz - z);
    }
    // bones: a line in the free lane, sometimes a power-up
    for (let i = 0; i < 5; i++) s.objs.push({ k: "bone", lane: free, z: z - 9 + i * 1.6, len: 0.4, h: 0 });
    if (Math.random() < 0.12) s.objs.push({ k: ["mag", "dbl", "shield"][Math.floor(Math.random() * 3)], lane: free, z: z - 11, len: 0.4, h: 0.4 });
  },
  swipe(G, dx, dy) {
    const s = G.s; if (s.dead) return;
    if (dx) s.lane = Math.max(-1, Math.min(1, s.lane + dx));
    else if (dy < 0 && s.y <= (s.gnd || 0) + 0.05) { s.vy = 9.2; s.roll = 0; }
    else if (dy > 0) { if (s.y > (s.gnd || 0) + 0.05) s.vy = -16; s.roll = 0.62; }
  },
  // Height of the surface under you in a lane: a train roof, a ramp, or the ground.
  ground(s, lane) {
    let g = 0;
    for (const o of s.objs) {
      if (o.k !== "train" || o.lane !== lane || o.gone) continue;
      if (o.z <= 0.15 && o.z + o.len >= -0.15) g = Math.max(g, this.TOP);
      else if (o.ramp && o.z > 0 && o.z < this.RL) g = Math.max(g, this.TOP * (1 - o.z / this.RL));
    }
    return g;
  },
  onKey(G, k, d) { if (!d) return; const m = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1], " ": [0, -1] }[k]; if (m) this.swipe(G, m[0], m[1]); },
  update(G, dt) {
    const s = G.s;
    if (s.dead) { s.dead -= dt; if (s.dead <= 0) G.over(Math.min(999999, s.score), s.dist > 2500 ? "The dogcatcher finally got you!" : "Caught by the dogcatcher!"); return; }
    s.sp = Math.min(40, 16 + s.dist / 140); const mv = s.sp * dt; s.dist += mv;
    s.lx += (s.lane - s.lx) * Math.min(1, dt * 14);
    const me0 = Math.round(s.lx), gnd = this.ground(s, me0);
    s.vy -= 26 * dt; s.y += s.vy * dt;
    if (s.y <= gnd + 0.02 && s.vy <= 0) { s.y = gnd; s.vy = 0; } // walk up ramps, ride roofs, fall off the end
    s.gnd = gnd;
    if (s.roll > 0) s.roll -= dt;
    ["mag", "dbl", "shield", "flash"].forEach(k => { if (s[k] > 0) s[k] -= dt; });
    s.score += Math.round(mv * (s.dbl > 0 ? 2 : 1));
    s.objs.forEach(o => o.z -= mv);
    s.nextZ -= mv; if (s.nextZ < this.ZMAX - 16) { const gap = Math.max(13, (s.far || 0) + 6) + Math.random() * 6; s.far = 0; s.nextZ += gap; this.spawnRow(s, s.nextZ); }
    const me = Math.round(s.lx);
    for (const o of s.objs) {
      if (o.gone) continue;
      if (o.k === "bone" || o.k === "mag" || o.k === "dbl" || o.k === "shield") {
        const pull = o.k === "bone" && s.mag > 0 && o.z < 6;
        if (o.z < 0.5 && o.z > -0.6 && (o.lane === me || pull) && Math.abs(s.y - (o.h || 0)) < 1.6) {
          o.gone = 1;
          if (o.k === "bone") { const v = s.dbl > 0 ? 20 : 10; s.bones++; s.score += v; G.sfx("pop"); }
          else { s[o.k] = o.k === "shield" ? 12 : 9; s.pops.push({ t: 1, txt: { mag: "MAGNET!", dbl: "2X POINTS!", shield: "BOARD UP!" }[o.k] }); G.sfx("win"); }
        }
        continue;
      }
      if (o.lane !== me || o.hit) continue;
      const inside = o.z < 0.35 && o.z + o.len > -0.35;
      if (!inside) continue;
      const crash = o.k === "train" ? s.y < this.TOP - 0.6 : o.k === "low" ? s.y < 0.65 : s.roll <= 0 && s.y < 1.3;
      if (!crash) continue;
      o.hit = 1;
      if (s.shield > 0) { s.shield = 0; s.flash = 0.8; G.buzz(); G.sfx("lose"); s.pops.push({ t: 1, txt: "SAVED BY THE BOARD!" }); if (o.k === "train") o.gone = 1; continue; }
      s.dead = 1.1; G.buzz(); G.sfx("lose"); return;
    }
    s.objs = s.objs.filter(o => !o.gone && o.z + o.len > -3);
    s.pops.forEach(p => p.t -= dt); s.pops = s.pops.filter(p => p.t > 0);
  },
  draw(G, c) {
    const s = G.s, W = G.W, H = G.H, dark = G.dark(), hy = H * 0.26, by = H - 80, LW = W * 0.3;
    const P = z => 1 / (1 + Math.max(-0.9, z) / 7), X = (ln, z) => W / 2 + ln * LW * P(z), Y = z => hy + (by - hy) * P(z), U = 58; // U = px per height unit at the front
    const sky = c.createLinearGradient(0, 0, 0, hy); sky.addColorStop(0, dark ? "#0d1530" : "#7ec8ff"); sky.addColorStop(1, dark ? "#2a2f55" : "#ffd9a8"); c.fillStyle = sky; c.fillRect(0, 0, W, hy);
    c.fillStyle = dark ? "#1b1d2a" : "#8d8f99"; for (let i = 0; i < 9; i++) { const bw = W / 9; c.fillRect(i * bw, hy - 20 - ((i * 37) % 50), bw - 4, 80); }
    c.fillStyle = dark ? "#2b2b33" : "#a89f91"; c.fillRect(0, hy, W, H - hy);
    // gravel lanes + ties
    for (let ln = -1; ln <= 1; ln++) {
      c.fillStyle = dark ? "#3a3740" : "#b9ae9d"; c.beginPath(); c.moveTo(X(ln - 0.45, this.ZMAX), hy); c.lineTo(X(ln + 0.45, this.ZMAX), hy); c.lineTo(X(ln + 0.45, -0.8), H); c.lineTo(X(ln - 0.45, -0.8), H); c.fill();
      c.fillStyle = dark ? "#4a3a2a" : "#6d5236";
      for (let k = 0; k < 30; k++) { const z = k * 2.4 - (s.dist % 2.4); if (z > this.ZMAX) break; const p = P(z), y = Y(z); c.fillRect(X(ln - 0.38, z), y, LW * 0.76 * p, Math.max(1, 5 * p)); }
      c.strokeStyle = dark ? "#9aa" : "#666"; c.lineWidth = 2; [-0.25, 0.25].forEach(o => { c.beginPath(); c.moveTo(X(ln + o, this.ZMAX), hy); c.lineTo(X(ln + o, -0.8), H); c.stroke(); });
    }
    // objects far -> near
    const key = o => o.k === "train" && o.z < 0 ? o.z + o.len : o.z; // a car you're riding draws under you
    const objs = s.objs.filter(o => o.z < this.ZMAX && o.z + o.len > -1.5).sort((a, b) => key(b) - key(a));
    const meZ = 0; let drewMe = false;
    const drawMe = () => {
      drewMe = true;
      const x = X(s.lx, 0), y = by - s.y * U, sz = s.roll > 0 ? 50 : 66;
      c.fillStyle = "rgba(0,0,0,0.25)"; c.beginPath(); c.ellipse(x, by + 6 - (s.gnd || 0) * U, 26, 8, 0, 0, 7); c.fill();
      if (s.shield > 0) G.emoji(c, "🛹", x, by + 2, 46);
      if (!(s.flash > 0 && Math.floor(G.t * 16) % 2)) G.img(c, s.dead ? ":dawgpain:" : s.roll > 0 ? ":dawgsweat:" : ":dawgW:", x, y - sz / 2 + (s.roll > 0 ? 12 : 0), sz);
    };
    for (const o of objs) {
      if (!drewMe && key(o) < meZ) drawMe();
      const p = P(o.z), x = X(o.lane, o.z), y = Y(o.z), w = LW * 0.82 * p;
      if (o.k === "bone") { G.emoji(c, "🦴", x, y - (22 + (o.h || 0) * U) * p, 30 * p); continue; }
      if (o.k === "mag" || o.k === "dbl" || o.k === "shield") { G.emoji(c, { mag: "🧲", dbl: "⭐", shield: "🛹" }[o.k], x, y - 40 * p + Math.sin(G.t * 5) * 4 * p, 36 * p); continue; }
      if (o.k === "low") { const h = 0.6 * U * p; c.fillStyle = "#fafafa"; c.fillRect(x - w / 2, y - h, w, h * 0.55); c.fillStyle = "#e53935"; for (let i = 0; i < 4; i++) c.fillRect(x - w / 2 + i * w / 4, y - h, w / 8, h * 0.55); c.fillStyle = "#555"; c.fillRect(x - w / 2 + 2, y - h * 0.45, 4 * p, h * 0.45); c.fillRect(x + w / 2 - 6 * p, y - h * 0.45, 4 * p, h * 0.45); }
      else if (o.k === "high") { const top = 1.55 * U * p, bh = 0.5 * U * p; c.fillStyle = "#444"; c.fillRect(x - w / 2, y - top, 5 * p, top); c.fillRect(x + w / 2 - 5 * p, y - top, 5 * p, top); c.fillStyle = "#ffb300"; c.fillRect(x - w / 2, y - top, w, bh); c.fillStyle = "#222"; for (let i = 0; i < 5; i++) c.fillRect(x - w / 2 + i * w / 5, y - top, w / 10, bh); }
      else if (o.k === "train") {
        const z2 = Math.min(this.ZMAX, o.z + o.len), p2 = P(z2), x2 = X(o.lane, z2), y2 = Y(z2), w2 = LW * 0.82 * p2, h = 2.6 * U * p, h2 = 2.6 * U * p2;
        c.fillStyle = dark ? "#5f6d8a" : "#90a4c8"; c.beginPath(); c.moveTo(x - w / 2, y - h); c.lineTo(x + w / 2, y - h); c.lineTo(x2 + w2 / 2, y2 - h2); c.lineTo(x2 - w2 / 2, y2 - h2); c.fill();
        c.fillStyle = dark ? "#3d4b6b" : "#4f6fa8"; c.fillRect(x - w / 2, y - h, w, h);
        c.fillStyle = "#cfe8ff"; c.fillRect(x - w * 0.36, y - h * 0.86, w * 0.72, h * 0.3);
        c.fillStyle = "#ffd23f"; c.fillRect(x - w / 2, y - h * 0.4, w, h * 0.06);
        c.fillStyle = "#fff9c4"; [-0.3, 0.3].forEach(o2 => { c.beginPath(); c.arc(x + o2 * w, y - h * 0.18, 5 * p, 0, 7); c.fill(); });
        if (o.ramp) { // sloped ramp in front of the car
          const zr = Math.max(-0.8, o.z - this.RL), pr = P(zr), xr = X(o.lane, zr), yr = Y(zr), wr = LW * 0.82 * pr;
          c.fillStyle = dark ? "#8d7a4a" : "#d9b45a"; c.beginPath(); c.moveTo(xr - wr / 2, yr); c.lineTo(xr + wr / 2, yr); c.lineTo(x + w / 2, y - h); c.lineTo(x - w / 2, y - h); c.fill();
          c.strokeStyle = "rgba(0,0,0,0.3)"; c.lineWidth = 2; for (let i = 1; i < 5; i++) { const f = i / 5, zz = zr + (o.z - zr) * f, pp = P(zz), yy = Y(zz) - this.TOP * U * pp * f, ww = LW * 0.82 * pp; c.beginPath(); c.moveTo(X(o.lane, zz) - ww / 2, yy); c.lineTo(X(o.lane, zz) + ww / 2, yy); c.stroke(); }
        }
      }
    }
    if (!drewMe) drawMe();
    // HUD
    G.hud(c, `🦴${s.bones}`, `${s.score}`, [s.mag > 0 ? "🧲" : "", s.dbl > 0 ? "⭐" : "", s.shield > 0 ? "🛹" : ""].join(""));
    s.pops.forEach((p, i) => G.text(c, p.txt, W / 2, H * 0.32 + i * 18 - (1 - p.t) * 12, p.txt.length > 4 ? 12 : 11, "#ffd23f"));
    if (s.dead) G.banner(c, "BUSTED!", "#ff5252");
    G.hint(c, "SWIPE ← → ↑ ↓", 4);
  }
});
