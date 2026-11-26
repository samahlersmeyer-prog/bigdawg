// ---------- Dawg Dash (3-lane endless runner) ----------
// Run the rail yard away from the dogcatcher. Swipe left/right to switch lanes, up to jump, down to slide.
// Subway Surfers rules: parked trains (some with ramps) and red trains that drive at you, a sideswipe into a train
// only makes you stumble (the dogcatcher closes in; a second stumble before he drops back and you're caught),
// and power-ups: magnet, 2x, board, rocket (fly over everything) and spring shoes (jump onto train roofs).
defGame({
  key: "dash", name: "Dawg Dash", icon: "🛹", max: 999999,
  blurb: "Endless runner. Swipe to dodge trains.",
  how: "Swipe LEFT or RIGHT to switch tracks, UP to jump the low barriers, DOWN to slide under the high bars. Trains block a whole track: dodge them, or run up a ramp onto the roof and hop from car to car (and across to trains on other tracks). Grab bones for points. Red trains are moving and come at you fast. Swipe sideways into the side of a train and you only stumble, but the dogcatcher closes in, and a second stumble before he drops back gets you caught. 🧲 pulls bones in, ⭐ doubles points, 🛹 lets you survive one crash, 🚀 flies you over everything for a few seconds, 👟 lets you jump right onto train roofs. It gets faster the longer you go.",
  // Missions: 3 at a time, each "in one run". Finish all 3 and your score multiplier goes up for good (x1 -> x2 ...).
  MISS: { bones: ["GRAB {n} BONES", 30, 25], jumps: ["JUMP {n} TIMES", 10, 6], slides: ["SLIDE {n} TIMES", 8, 5], roofs: ["LAND ON {n} TRAIN ROOFS", 3, 2], dist: ["RUN {n}M", 400, 300], pups: ["GRAB {n} POWER-UPS", 1, 1] },
  mkey() { return "bdd:dash:" + (typeof me !== "undefined" && me ? me.id : ""); },
  mload() {
    let m = null; try { m = store.get(this.mkey()); } catch (e) {}
    if (!m || !m.set) { m = { mult: 1, set: null }; m.set = this.newSet(1); }
    return m;
  },
  newSet(mult) { const ks = Object.keys(this.MISS).sort(() => Math.random() - 0.5).slice(0, 3); return ks.map(k => ({ k, n: this.MISS[k][1] + this.MISS[k][2] * (mult - 1), done: false })); },
  mlabel(q) { return this.MISS[q.k][0].replace("{n}", q.n).replace("1 POWER-UPS", "A POWER-UP").replace("1 TRAIN ROOFS", "A TRAIN ROOF"); },
  bump(G, k, n) {
    const s = G.s; s.st[k] = (s.st[k] || 0) + (n || 1); const m = s.miss;
    m.set.forEach(q => { if (!q.done && q.k === k && s.st[k] >= q.n) { q.done = true; s.pops.push({ t: 1.6, txt: "MISSION DONE!" }); G.sfx("win"); } });
    if (m.set.every(q => q.done)) { m.mult = Math.min(30, m.mult + 1); m.set = this.newSet(m.mult); s.pops.push({ t: 2, txt: `MULTIPLIER x${m.mult}!` }); }
    try { store.set(this.mkey(), m); } catch (e) {}
  },
  reset(G) {
    G.s = { st: {}, miss: this.mload(), lane: 0, lx: 0, y: 0, vy: 0, roll: 0, dist: 0, sp: 16, bones: 0, score: 0, objs: [], nextZ: 26, rows: [], mag: 0, dbl: 0, shield: 0, flash: 0, jet: 0, shoes: 0, stum: 0, safe: 0, dead: 0, pops: [] };
    this.spawnRow(G.s, 26, true); this.spawnRow(G.s, 42);
  },
  ZMAX: 70, TOP: 2.6, RL: 4,
  spawnRow(s, z, easy) {
    const free = Math.floor(Math.random() * 3) - 1, lvl = Math.min(1, s.dist / 3000); let end = z; const mvL = (s.objs.find(o => o.mv && o.z > z - 12) || {}).lane; // keep a moving train's lane clear ahead of it
    for (let ln = -1; ln <= 1; ln++) {
      if (ln === free || ln === mvL) continue;
      const r = Math.random(); if (easy && r < 0.6) continue;
      const k = r < 0.25 - lvl * 0.1 ? null : r < 0.5 ? "low" : r < 0.72 ? "high" : "train";
      if (!k) continue;
      if (k !== "train") { s.objs.push({ k, lane: ln, z, len: 0.6 }); continue; }
      // trains: often with a ramp up front, sometimes coupled to a second car you can hop onto
      let zz = z; const cars = Math.random() < 0.45 ? 2 : 1, ramp = Math.random() < 0.6;
      for (let i = 0; i < cars; i++) { const len = 7 + Math.random() * 4; s.objs.push({ k: "train", lane: ln, z: zz, len, ramp: ramp && i === 0 }); if (ramp) for (let b = 1; b < 5; b++) s.objs.push({ k: "bone", lane: ln, z: zz + b * len / 5, len: 0.4, h: this.TOP }); zz += len + 1.4; }
      s.far = Math.max(s.far || 0, zz - z); end = Math.max(end, zz);
    }
    // bones: a line in the free lane, sometimes a power-up
    for (let i = 0; i < 5; i++) s.objs.push({ k: "bone", lane: free, z: z - 9 + i * 1.6, len: 0.4, h: 0 });
    if (Math.random() < 0.14) s.objs.push({ k: ["mag", "dbl", "shield", "jet", "shoes"][Math.floor(Math.random() * 5)], lane: free, z: z - 11, len: 0.4, h: 0.4 });
    s.rows.push({ z, free, end });
    if (!easy && s.dist > 250 && Math.random() < 0.3 + lvl * 0.25) this.spawnMover(s);
  },
  MV: 1.7, // a moving train closes on you this many times faster than the ground does
  // A red train driving toward you from the horizon. It reaches you together with whatever is now about ZMAX / MV away,
  // so it takes a lane that isn't the open lane of those rows and has no parked train, and the barriers it would drive through are removed.
  spawnMover(s) {
    const len = 8, a = this.ZMAX / this.MV - 7, b = a + 14 + len / this.MV, open = s.rows.filter(r => r.end > a - 2 && r.z - 11 < b).map(r => r.free);
    const lanes = [-1, 0, 1].filter(l => !open.includes(l) && !s.objs.some(o => o.k === "train" && o.lane === l && !o.gone)); // never through a parked train
    if (!lanes.length || s.objs.some(o => o.mv)) return;
    const lane = lanes[Math.floor(Math.random() * lanes.length)];
    s.objs.forEach(o => { if (o.lane === lane && o.z > a - 8) o.gone = 1; }); // everything it will drive over before it passes you
    s.objs.push({ k: "train", lane, z: this.ZMAX, len, mv: 1 });
  },
  swipe(G, dx, dy) {
    const s = G.s; if (s.dead) return;
    if (dx) {
      const to = Math.max(-1, Math.min(1, s.lane + dx));
      // sideswiping a train: bounce back and stumble; a second stumble while the dogcatcher is close and he has you
      if (to !== s.lane && s.safe <= 0 && s.objs.some(o => o.k === "train" && !o.gone && o.lane === to && o.z < 0.35 && o.z + o.len > -0.35 && s.y < this.TOP - 0.6)) {
        G.buzz(); G.sfx("lose");
        if (s.stum > 0) { s.dead = 1.1; return; }
        s.stum = 6; s.flash = 0.6; s.pops.push({ t: 1, txt: "OOF! HE'S CLOSE!" }); return;
      }
      s.lane = to;
    }
    else if (s.jet > 0) return;
    else if (dy < 0 && s.y <= (s.gnd || 0) + 0.05) { s.vy = s.shoes > 0 ? 12.2 : 9.2; s.roll = 0; this.bump(G, "jumps"); }
    else if (dy > 0) { if (s.y > (s.gnd || 0) + 0.05) s.vy = -16; s.roll = 0.62; this.bump(G, "slides"); }
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
    if (s.jet > 0) { s.vy = 0; s.y += (5.2 - s.y) * Math.min(1, dt * 6); if (s.jet <= dt) s.safe = 1.3; } // rocket: over everything, soft landing after
    else { s.vy -= 26 * dt; s.y += s.vy * dt; }
    if (s.y <= gnd + 0.02 && s.vy <= 0) { s.y = gnd; s.vy = 0; } // walk up ramps, ride roofs, fall off the end
    if (gnd >= this.TOP && (s.gnd || 0) < this.TOP && s.y >= this.TOP - 0.01) this.bump(G, "roofs");
    s.gnd = gnd;
    const m10 = Math.floor(s.dist / 10); if (m10 > (s.lastM || 0)) { s.lastM = m10; s.st.dist = Math.floor(s.dist); this.bump(G, "dist", 0); }
    if (s.roll > 0) s.roll -= dt;
    ["mag", "dbl", "shield", "flash", "jet", "shoes", "stum", "safe"].forEach(k => { if (s[k] > 0) s[k] -= dt; });
    s.acc = (s.acc || 0) + mv * (s.dbl > 0 ? 2 : 1) * s.miss.mult; const add = Math.floor(s.acc); s.acc -= add; s.score += add;
    s.objs.forEach(o => o.z -= o.mv ? mv * this.MV : mv); s.rows.forEach(r => { r.z -= mv; r.end -= mv; }); if (s.rows.length && s.rows[0].end < 0) s.rows.shift();
    s.nextZ -= mv; if (s.nextZ < this.ZMAX - 16) { const gap = Math.max(13, (s.far || 0) + 6) + Math.random() * 6; s.far = 0; s.nextZ += gap; this.spawnRow(s, s.nextZ); }
    const me = Math.round(s.lx);
    for (const o of s.objs) {
      if (o.gone) continue;
      if (o.k !== "train" && o.k !== "low" && o.k !== "high") {
        const pull = o.k === "bone" && s.mag > 0 && o.z < 6;
        if (o.z < 0.5 && o.z > -0.6 && (pull || (o.lane === me && (s.jet > 0 || Math.abs(s.y - (o.h || 0)) < 1.6)))) {
          o.gone = 1;
          if (o.k === "bone") { const v = (s.dbl > 0 ? 20 : 10) * s.miss.mult; s.bones++; s.score += v; G.sfx("pop"); this.bump(G, "bones"); }
          else { this.bump(G, "pups"); s[o.k] = { shield: 12, jet: 7, shoes: 10 }[o.k] || 9; s.pops.push({ t: 1, txt: { mag: "MAGNET!", dbl: "2X POINTS!", shield: "BOARD UP!", jet: "ROCKET!", shoes: "SPRING SHOES!" }[o.k] }); G.sfx("win"); }
        }
        continue;
      }
      if (o.lane !== me || o.hit) continue;
      const inside = o.z < 0.35 && o.z + o.len > -0.35;
      if (!inside) continue;
      const crash = o.k === "train" ? s.y < this.TOP - 0.6 : o.k === "low" ? s.y < 0.65 : s.roll <= 0 && s.y < 1.3;
      if (!crash || s.safe > 0) continue;
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
      if (s.stum > 0 || (G.t < 2.5 && !s.dead)) G.emoji(c, "👮", x + 6, by + (s.stum > 0 ? 30 : 30 + G.t * 40), 50); // the dogcatcher, right behind you
      if (s.shield > 0) G.emoji(c, "🛹", x, by + 2, 46);
      if (s.jet > 0) G.emoji(c, "🚀", x, y + 10, 34);
      if (!(s.flash > 0 && Math.floor(G.t * 16) % 2)) G.img(c, s.dead ? ":dawgpain:" : s.roll > 0 ? ":dawgsweat:" : ":dawgW:", x, y - sz / 2 + (s.roll > 0 ? 12 : 0), sz);
    };
    for (const o of objs) {
      if (!drewMe && key(o) < meZ) drawMe();
      const p = P(o.z), x = X(o.lane, o.z), y = Y(o.z), w = LW * 0.82 * p;
      if (o.k === "bone") { G.emoji(c, "🦴", x, y - (22 + (o.h || 0) * U) * p, 30 * p); continue; }
      if (o.k !== "low" && o.k !== "high" && o.k !== "train") { G.emoji(c, { mag: "🧲", dbl: "⭐", shield: "🛹", jet: "🚀", shoes: "👟" }[o.k], x, y - 40 * p + Math.sin(G.t * 5) * 4 * p, 36 * p); continue; }
      if (o.k === "low") { const h = 0.6 * U * p; c.fillStyle = "#fafafa"; c.fillRect(x - w / 2, y - h, w, h * 0.55); c.fillStyle = "#e53935"; for (let i = 0; i < 4; i++) c.fillRect(x - w / 2 + i * w / 4, y - h, w / 8, h * 0.55); c.fillStyle = "#555"; c.fillRect(x - w / 2 + 2, y - h * 0.45, 4 * p, h * 0.45); c.fillRect(x + w / 2 - 6 * p, y - h * 0.45, 4 * p, h * 0.45); }
      else if (o.k === "high") { const top = 1.55 * U * p, bh = 0.5 * U * p; c.fillStyle = "#444"; c.fillRect(x - w / 2, y - top, 5 * p, top); c.fillRect(x + w / 2 - 5 * p, y - top, 5 * p, top); c.fillStyle = "#ffb300"; c.fillRect(x - w / 2, y - top, w, bh); c.fillStyle = "#222"; for (let i = 0; i < 5; i++) c.fillRect(x - w / 2 + i * w / 5, y - top, w / 10, bh); }
      else if (o.k === "train") {
        const z2 = Math.min(this.ZMAX, o.z + o.len), p2 = P(z2), x2 = X(o.lane, z2), y2 = Y(z2), w2 = LW * 0.82 * p2, h = 2.6 * U * p, h2 = 2.6 * U * p2;
        c.fillStyle = dark ? "#5f6d8a" : "#90a4c8"; c.beginPath(); c.moveTo(x - w / 2, y - h); c.lineTo(x + w / 2, y - h); c.lineTo(x2 + w2 / 2, y2 - h2); c.lineTo(x2 - w2 / 2, y2 - h2); c.fill();
        c.fillStyle = o.mv ? "#c62828" : dark ? "#3d4b6b" : "#4f6fa8"; c.fillRect(x - w / 2, y - h, w, h);
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
    // missions card for the first few seconds of each run
    if (G.t < 4.5 && !s.dead) {
      const a = Math.min(1, 4.5 - G.t); c.globalAlpha = a; c.fillStyle = "rgba(0,0,0,0.6)"; c.fillRect(16, 48, W - 32, 96);
      G.text(c, `MISSIONS · MULTIPLIER x${s.miss.mult}`, W / 2, 62, 10, "#ffd23f");
      s.miss.set.forEach((q, i) => G.text(c, (q.done ? "✓ " : "· ") + this.mlabel(q) + (q.done ? "" : ` (${Math.min(q.n, s.st[q.k] || 0)}/${q.n})`), W / 2, 84 + i * 20, 10, q.done ? "#7cff6b" : "#fff"));
      c.globalAlpha = 1;
    }
    G.hud(c, `🦴${s.bones} x${s.miss.mult}`, `${s.score}`, [s.mag > 0 ? "🧲" : "", s.dbl > 0 ? "⭐" : "", s.shield > 0 ? "🛹" : "", s.jet > 0 ? "🚀" : "", s.shoes > 0 ? "👟" : ""].join(""));
    s.pops.forEach((p, i) => G.text(c, p.txt, W / 2, H * 0.32 + i * 18 - (1 - p.t) * 12, p.txt.length > 4 ? 12 : 11, "#ffd23f"));
    if (s.dead) G.banner(c, "BUSTED!", "#ff5252");
    G.hint(c, "SWIPE ← → ↑ ↓", 4);
  }
});
