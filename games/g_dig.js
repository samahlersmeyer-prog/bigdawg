// ---------- Dig Dawg (Arcade: tunnel digging) ----------
// The bulldog digs through the backyard. Moles and badgers chase him through his tunnels.
// Hold and drag to dig in a direction; tap to BARK. Bark at a critter until it puffs up and pops (4 barks).
// Dig under a rock and it falls, squashing whatever's below. Clear every critter to go deeper.
(function () {
  const C = 11, DIRS = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  const BANDS = [["#c98c4a", "#8a5a2b"], ["#b5703a", "#7a4a22"], ["#9c5a32", "#64381c"], ["#7f4630", "#4f2a18"]];
  defGame({
    key: "dig", name: "Dig Dawg", icon: "⛏️", max: 999999,
    blurb: "Dig tunnels, bark critters until they pop.",
    how: "Press and drag in a direction to dig that way; let go to stop. Tap anywhere to BARK in the direction you're facing. Each bark puffs a mole or badger up a little; four barks and it pops. Stop barking and it shrinks back. Critters chase you through your tunnels and can sneak through dirt as ghostly eyes. Dig out the dirt under a 🪨 rock and it falls, squashing anything below (big points, and watch your own head). Deeper critters are worth more. Clear them all to go to the next yard. 3 lives.",
    reset(G) {
      const cs = Math.floor(Math.min(G.W / C, (G.H - 34 - 54) / 14)), R = Math.floor((G.H - 34 - 54) / cs);
      G.s = { cs, R, ox: Math.floor((G.W - cs * C) / 2), oy: 34, lvl: 0, lives: 3, score: 0, fx: [], bark: null, held: null, face: [1, 0], msgT: 0, dead: 0, rocksDropped: 0, bonus: null };
      this.level(G);
    },
    level(G) {
      const s = G.s, R = s.R; s.lvl++; s.msgT = 1.8; s.dug = []; for (let y = 0; y < R; y++) { s.dug.push(new Array(C).fill(y === 0)); }
      const mid = Math.floor(C / 2), half = Math.floor(R / 2);
      for (let y = 0; y <= half; y++) s.dug[y][mid] = true;
      s.start = [mid, half]; s.p = { x: mid, y: half, dir: [0, 0] };
      const n = Math.min(8, 3 + s.lvl), spots = [], used = new Set();
      for (let k = 0; k < 60 && spots.length < n; k++) {
        const horiz = Math.random() < 0.5, x = 1 + Math.floor(Math.random() * (C - 4)), y = 3 + Math.floor(Math.random() * (R - 6));
        if (Math.abs(x + 1 - mid) + Math.abs(y - half) < 6 || (Math.abs(x + 1 - mid) < 3 && y <= half + 2)) continue; // keep critters away from the pup's start
        const cells = horiz ? [[x, y], [x + 1, y], [x + 2, y]] : [[x + 1, y - 1], [x + 1, y], [x + 1, y + 1]];
        if (cells.some(([a, b]) => used.has(a + "," + b) || used.has(a + "," + (b - 1)) || used.has(a + "," + (b + 1)))) continue;
        cells.forEach(([a, b]) => { s.dug[b][a] = true; used.add(a + "," + b); });
        spots.push(cells[1]);
      }
      s.en = spots.map(([x, y], i) => ({ x, y, hx: x, hy: y, k: i % 3 === 2 ? "badger" : "mole", tx: x, ty: y, puff: 0, ghost: 0, gT: 6 + Math.random() * 6, dead: 0 }));
      s.rocks = []; for (let k = 0; k < 40 && s.rocks.length < 3 + Math.min(2, s.lvl - 1); k++) {
        const x = Math.floor(Math.random() * C), y = 2 + Math.floor(Math.random() * (R - 4));
        if (s.dug[y][x] || s.dug[y + 1][x] || s.rocks.some(r => Math.abs(r.x - x) + Math.abs(r.y - y) < 3) || used.has(x + "," + (y - 1))) continue;
        s.rocks.push({ x, y, st: "rest", t: 0 }); }
      s.bark = null; s.held = null; s.rocksDropped = 0; s.bonus = null; s.grace = 2;
    },
    pts(s, e) { return (e.k === "badger" ? 2 : 1) * [200, 300, 400, 500][Math.min(3, Math.floor(e.y / (s.R / 4)))]; },
    free(s, x, y) { return x >= 0 && x < C && y >= 0 && y < s.R && s.dug[y][x] && !s.rocks.some(r => r.st !== "gone" && Math.round(r.x) === x && Math.round(r.y) === y); },
    die(G) { const s = G.s; if (s.dead) return; s.lives--; s.dead = 1.8; G.sfx("lose"); G.buzz(); s.bark = null; },
    update(G, dt) {
      const s = G.s, lv = s.lvl - 1; s.msgT = Math.max(0, s.msgT - dt);
      s.fx.forEach(f => f.t += dt); s.fx = s.fx.filter(f => f.t < 0.9);
      if (s.dead > 0) { s.dead -= dt; if (s.dead <= 0) { s.dead = 0; if (s.lives <= 0) return G.over(s.score, s.lvl > 2 ? `Yard ${s.lvl}. Good digging!` : "Caught in the tunnels!");
        s.p = { x: s.start[0], y: s.start[1], dir: [0, 0] }; s.grace = 2; s.en.forEach(e => { e.x = e.tx = e.hx; e.y = e.ty = e.hy; e.puff = 0; e.ghost = 0; }); } return; }
      // player: grid-aligned movement, digs as it goes
      const p = s.p, sp = 3.4 * dt, d = s.held;
      if (d) {
        const isI = v => Math.abs(v - Math.round(v)) < 1e-3, step = (dv) => Math.abs(dv) <= sp ? dv : Math.sign(dv) * sp;
        if (d[0] && !isI(p.y)) p.y += step(Math.round(p.y) - p.y);          // finish lining up with the row first
        else if (d[1] && !isI(p.x)) p.x += step(Math.round(p.x) - p.x);
        else {
          if (isI(p.x)) p.x = Math.round(p.x); if (isI(p.y)) p.y = Math.round(p.y);
          const nx = Math.max(0, Math.min(C - 1, p.x + d[0] * sp)), ny = Math.max(0, Math.min(s.R - 1, p.y + d[1] * sp));
          const rock = s.rocks.find(r => r.st !== "gone" && Math.abs(nx - r.x) < 1 && Math.abs(ny - r.y) < 1);
          if (rock) { if (d[0]) p.x = Math.round(p.x); else p.y = Math.round(p.y); } else { p.x = nx; p.y = ny; }
          s.face = d.slice();
        }
        [[Math.floor(p.x), Math.floor(p.y)], [Math.ceil(p.x), Math.ceil(p.y)]].forEach(([x, y]) => { if (!s.dug[y][x]) { s.dug[y][x] = true; s.score += 10; } });
      }
      // bark wave
      if (s.bark) { s.bark.t += dt; if (s.bark.t > 0.28) s.bark = null; }
      // bonus bone
      if (s.bonus) { s.bonus.t -= dt; if (s.bonus.t <= 0) s.bonus = null; else if (Math.abs(p.x - s.bonus.x) < 0.6 && Math.abs(p.y - s.bonus.y) < 0.6) { s.score += 500 * s.lvl; s.fx.push({ x: s.bonus.x, y: s.bonus.y, t: 0, txt: String(500 * s.lvl) }); s.bonus = null; G.sfx("win"); } }
      // rocks
      s.rocks.forEach(r => {
        if (r.st === "rest") { const bx = r.x, by = r.y + 1; if (by < s.R && s.dug[by][bx] && !(Math.abs(p.x - bx) < 0.6 && Math.abs(p.y - by) < 0.9 && Math.round(p.x) === bx)) { r.st = "wob"; r.t = 0.6; } }
        else if (r.st === "wob") { r.t -= dt; if (r.t <= 0) { r.st = "fall"; r.kills = 0; } }
        else if (r.st === "fall") { r.y += 7 * dt; const below = Math.floor(r.y) + 1;
          s.en.forEach(e => { if (!e.dead && Math.abs(e.x - r.x) < 0.7 && e.y > r.y - 0.2 && e.y < r.y + 0.9) { e.dead = 1; r.kills++; } });
          if (Math.abs(p.x - r.x) < 0.7 && p.y > r.y - 0.2 && p.y < r.y + 0.9) this.die(G);
          if (below >= s.R || !s.dug[below][Math.round(r.x)]) { r.y = Math.floor(r.y); r.st = "gone"; r.t = 0.4; s.rocksDropped++;
            if (r.kills) { const pts = [0, 1000, 2500, 4000, 6000][Math.min(4, r.kills)]; s.score += pts; s.fx.push({ x: r.x, y: r.y, t: 0, txt: String(pts) }); G.sfx("win"); }
            if (s.rocksDropped === 2 && !s.bonus) s.bonus = { x: s.start[0], y: s.start[1], t: 9 }; } }
        else if (r.st === "gone") r.t -= dt; });
      s.rocks = s.rocks.filter(r => r.st !== "gone" || r.t > 0);
      // critters
      if (s.grace > 0) s.grace -= dt;   // a short head start: critters wait at first and after each life
      const espd = s.grace > 0 ? 0 : (1.7 + lv * 0.18) * dt;
      s.en.forEach(e => {
        if (e.dead) { e.dead += dt; return; }
        if (e.puff > 0) { e.pT = (e.pT || 0) + dt; if (e.pT > 0.9) { e.pT = 0; e.puff--; } return; }
        if (e.ghost) {
          const dx = p.x - e.x, dy = p.y - e.y, L = Math.hypot(dx, dy) || 1, gs = espd * 0.7; e.x += dx / L * gs; e.y += dy / L * gs; e.ghost += dt;
          const gx = Math.round(e.x), gy = Math.round(e.y);
          if (e.ghost > 1.6 && this.free(s, gx, gy) && Math.abs(e.x - gx) < 0.15 && Math.abs(e.y - gy) < 0.15) { e.ghost = 0; e.x = e.tx = gx; e.y = e.ty = gy; e.gT = 7 + Math.random() * 7 - lv * 0.4; }
          return;
        }
        e.gT -= dt;
        if (Math.abs(e.x - e.tx) < 0.001 && Math.abs(e.y - e.ty) < 0.001) {
          if (e.gT <= 0 && s.lvl + (s.en.length < 2 ? 3 : 0) > 0 && Math.random() < 0.02 + lv * 0.004) { e.ghost = 0.01; return; }
          const opts = DIRS.filter(([a, b]) => this.free(s, e.x + a, e.y + b));
          if (!opts.length) { if (e.gT <= 0) e.ghost = 0.01; return; }
          const back = opts.length > 1 ? opts.filter(([a, b]) => !(e.lx === -a && e.ly === -b)) : opts;
          back.sort((A, B) => (Math.hypot(e.x + A[0] - p.x, e.y + A[1] - p.y) - Math.hypot(e.x + B[0] - p.x, e.y + B[1] - p.y)) + (Math.random() - 0.5) * 1.2);
          const [a, b] = back[0]; e.tx = e.x + a; e.ty = e.y + b; e.lx = a; e.ly = b;
        }
        const dx = e.tx - e.x, dy = e.ty - e.y, L = Math.hypot(dx, dy); if (L <= espd) { e.x = e.tx; e.y = e.ty; } else { e.x += dx / L * espd; e.y += dy / L * espd; }
      });
      s.en = s.en.filter(e => !e.dead || e.dead < 0.5);
      for (const e of s.en) if (!e.dead && !e.puff && Math.abs(e.x - p.x) < 0.6 && Math.abs(e.y - p.y) < 0.6) { this.die(G); break; }
      if (!s.en.length && !s.dead) { s.score += 1000 * s.lvl; G.sfx("win"); this.level(G); }
    },
    barkNow(G) {
      const s = G.s, p = s.p; if (s.dead || s.bark) return;
      const [fx, fy] = s.face; s.bark = { t: 0 }; G.sfx("pop");
      let hit = null, best = 9;
      s.en.forEach(e => { if (e.dead || e.ghost) return; const rx = e.x - p.x, ry = e.y - p.y, along = rx * fx + ry * fy, side = Math.abs(rx * fy - ry * fx);
        if (along > -0.2 && along < 3.2 && side < 0.6 && along < best) {
          // the bark only carries through open tunnel
          let clear = true; for (let k = 1; k < Math.round(along); k++) if (!s.dug[Math.round(p.y + fy * k)] || !s.dug[Math.round(p.y + fy * k)][Math.round(p.x + fx * k)]) clear = false;
          if (clear) { best = along; hit = e; } } });
      if (hit) { hit.puff++; hit.pT = 0; G.buzz();
        if (hit.puff >= 4) { hit.dead = 0.01; const pts = this.pts(s, hit); s.score += pts; s.fx.push({ x: hit.x, y: hit.y, t: 0, txt: String(pts) }); } }
    },
    draw(G, c) {
      const s = G.s, cs = s.cs, ox = s.ox, oy = s.oy, dk = G.dark(), X = x => ox + x * cs + cs / 2, Y = y => oy + y * cs + cs / 2;
      c.fillStyle = dk ? "#0f1522" : "#7ec8f0"; c.fillRect(0, 0, G.W, G.H);
      for (let y = 1; y < s.R; y++) { const b = BANDS[Math.min(3, Math.floor((y - 1) / ((s.R - 1) / 4)))];
        for (let x = 0; x < C; x++) { if (s.dug[y][x]) continue; c.fillStyle = b[0]; c.fillRect(ox + x * cs, oy + y * cs, cs, cs);
          c.fillStyle = b[1]; if ((x * 7 + y * 3) % 4 === 0) c.fillRect(ox + x * cs + cs * 0.25, oy + y * cs + cs * 0.3, 3, 3); if ((x * 5 + y * 11) % 5 === 0) c.fillRect(ox + x * cs + cs * 0.65, oy + y * cs + cs * 0.7, 3, 3); } }
      c.fillStyle = BANDS[3][1]; c.fillRect(0, oy + s.R * cs, G.W, G.H - oy - s.R * cs); c.fillRect(0, oy + cs, ox, s.R * cs); c.fillRect(ox + C * cs, oy + cs, G.W, s.R * cs);
      c.fillStyle = dk ? "#1d2a12" : "#4caf50"; c.fillRect(0, oy + cs - 5, G.W, 5);
      c.fillStyle = dk ? "#161616" : "#2a1a10"; for (let y = 1; y < s.R; y++) for (let x = 0; x < C; x++) if (s.dug[y][x]) c.fillRect(ox + x * cs, oy + y * cs, cs, cs);
      G.emoji(c, "🌳", ox + cs * 0.8, oy + cs * 0.45, cs * 0.9); G.emoji(c, "🏠", ox + cs * (C - 0.9), oy + cs * 0.45, cs * 0.9);
      s.rocks.forEach(r => { const wob = r.st === "wob" ? Math.sin(G.t * 40) * 2 : 0; c.globalAlpha = r.st === "gone" ? Math.max(0, r.t / 0.4) : 1; G.emoji(c, "🪨", X(r.x) + wob, Y(r.y), cs * 0.9); c.globalAlpha = 1; });
      if (s.bonus) G.emoji(c, "🦴", X(s.bonus.x), Y(s.bonus.y), cs * 0.8);
      s.en.forEach(e => {
        if (e.dead) { G.emoji(c, "💨", X(e.x), Y(e.y), cs * (1 + e.dead * 2)); return; }
        if (e.ghost) { c.globalAlpha = 0.85; G.emoji(c, "👀", X(e.x), Y(e.y), cs * 0.7); c.globalAlpha = 1; return; }
        const sz = cs * (0.85 + e.puff * 0.22);
        if (e.puff) { c.fillStyle = "rgba(255,255,255,0.35)"; c.beginPath(); c.arc(X(e.x), Y(e.y), sz * 0.55, 0, 7); c.fill(); }
        G.emoji(c, e.k === "badger" ? "🦡" : "🐭", X(e.x), Y(e.y), sz); });
      const p = s.p;
      if (s.dead > 0) G.img(c, ":dawgpain:", X(p.x), Y(p.y), cs * 1.05 * Math.min(1, s.dead));
      else G.img(c, s.bark ? ":dawgpog:" : ":dawgW:", X(p.x), Y(p.y), cs * 1.05, s.face[0] < 0 ? -0.15 : s.face[0] > 0 ? 0.15 : 0);
      if (s.bark) { const [fx, fy] = s.face; c.strokeStyle = "#ffd23f"; c.lineWidth = 3; c.globalAlpha = 1 - s.bark.t / 0.28;
        for (let k = 1; k <= 3; k++) { const r = cs * (0.4 + k * 0.45) * Math.min(1, s.bark.t / 0.12 + 0.3); c.beginPath(); c.arc(X(p.x), Y(p.y), r, Math.atan2(fy, fx) - 0.5, Math.atan2(fy, fx) + 0.5); c.stroke(); }
        c.globalAlpha = 1; }
      s.fx.forEach(f => { c.globalAlpha = 1 - f.t / 0.9; G.text(c, f.txt, X(f.x), Y(f.y) - f.t * 30, 10, "#ffd23f"); }); c.globalAlpha = 1;
      G.hud(c, `${s.score}`, `YARD ${s.lvl}`, "🐶".repeat(Math.max(0, Math.min(5, s.lives))));
      const by = G.H - 27; c.fillStyle = "#f3e0c8"; c.font = `600 13px ${G.UI}`; c.textAlign = "center"; c.textBaseline = "middle";
      c.fillText("Drag to dig · Tap to BARK 🗯️", G.W / 2, by);
      if (s.msgT > 0) G.banner(c, `YARD ${s.lvl}`, "#ffd23f");
    },
    down(G, x, y) { const s = G.s; s.touch = { x, y, t: G.t, dragged: false }; },
    move(G, x, y) { const s = G.s, t = s.touch; if (!t) return; const dx = x - t.x, dy = y - t.y;
      if (Math.hypot(dx, dy) > 14) { t.dragged = true; s.held = Math.abs(dx) > Math.abs(dy) ? [Math.sign(dx), 0] : [0, Math.sign(dy)];
        // keep the joystick centered under the finger so a long hold can change direction easily
        if (Math.hypot(dx, dy) > 60) { t.x = x - Math.sign(dx) * (Math.abs(dx) > Math.abs(dy) ? 40 : 0); t.y = y - Math.sign(dy) * (Math.abs(dy) >= Math.abs(dx) ? 40 : 0); } } },
    up(G) { const s = G.s, t = s.touch; s.touch = null; s.held = null; if (t && !t.dragged) this.barkNow(G); },
    onKey(G, k, d) { const s = G.s, m = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[k];
      if (m) { if (d) s.held = m; else if (s.held && s.held[0] === m[0] && s.held[1] === m[1]) s.held = null; }
      if (k === " " && d) this.barkNow(G); }
  });
})();
