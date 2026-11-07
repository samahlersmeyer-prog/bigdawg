// ---------- Cube Dawg (Q*bert-style) ----------
// Hop around a pyramid of cubes and change every top to the target color. Yarn balls roll down, a purple ball hatches
// into an alley cat that chases you, squirrels undo your work. Frisbees on the sides fly you to the top (lure the cat off!).
// Levels: 1 = one hop changes a cube, 2 = two hops, 3 = hopping again flips it back, 4 = two hops and flips back. 4 rounds each.
(function () {
  const N = 7;
  const DIRS = [[-1, -1], [-1, 0], [1, 0], [1, 1]]; // up-left, up-right, down-left, down-right
  const LVLS = [{ need: 1, flip: false, tip: "Hop on every cube once." }, { need: 2, flip: false, tip: "Two hops per cube." }, { need: 1, flip: true, tip: "Careful: hop again and it flips back." }, { need: 2, flip: true, tip: "Two hops, and done cubes flip back." }];
  const PALS = [
    { top: ["#5b8def", "#f7d046", "#e9505a"], l: "#c58b5a", r: "#7b4f2c" },
    { top: ["#e9505a", "#7ed957", "#f7d046"], l: "#7f8fa6", r: "#4b5568" },
    { top: ["#f7d046", "#b07cf0", "#4dd0e1"], l: "#4e8f6a", r: "#2d5a3f" },
    { top: ["#ffffff", "#ff9f43", "#3d7cf5"], l: "#a35d7a", r: "#6b3550" }
  ];
  defGame({
    key: "cube", name: "Cube Dawg", icon: "🧊", max: 999999,
    blurb: "Hop the pyramid. Change every cube. Dodge the cat.",
    how: "Tap the corner of the screen you want to hop toward: up-left, up-right, down-left or down-right of the Big Dawg (or use the arrow keys: up = up-right, right = down-right, down = down-left, left = up-left). Landing on a cube changes its color (+25). Turn every cube to the target color shown at the top to clear the round. Red yarn balls roll down the pyramid. The purple ball hatches into an alley cat at the bottom that chases you. Hop off the edge onto a spinning frisbee to fly back to the top, and if the cat is right behind you it jumps off after you (+500). Catch a tennis ball to freeze everything (+100) and catch squirrels before they undo your cubes (+300). Hop off the pyramid anywhere else and you fall. 4 lives.",
    reset(G) {
      const s = G.s = { lvl: 0, rnd: 0, pts: 0, lives: 4, pops: [], ens: [], loop: 0 };
      this.size(G); this.round(G);
    },
    size(G) {
      const s = G.s, W = G.W, H = G.H;
      s.cw = Math.floor(Math.min((W - 28) / N, (H - 34 - 150) / (6 * 0.77 + 1.05)));
      s.q = s.cw * 0.27; s.d = s.cw * 0.5; s.step = s.q + s.d;
      const tot = 6 * s.step + 2 * s.q + s.d;
      s.y0 = 34 + Math.max(70, (H - 34 - tot) / 2 + 10) + s.q;
    },
    round(G) {
      const s = G.s;
      s.cubes = []; for (let r = 0; r < N; r++) { s.cubes.push([]); for (let c = 0; c <= r; c++) s.cubes[r].push(0); }
      s.L = LVLS[s.lvl % LVLS.length]; s.pal = PALS[(s.lvl + s.rnd) % PALS.length];
      s.p = { r: 0, c: 0, fr: 0, fc: 0, t: 1, q: null };
      s.ens = []; s.freeze = 0; s.spawnT = 1.6; s.spawned = 0; s.won = 0; s.dead = 0; s.fall = null; s.ride = null; s.lure = null;
      const rows = [2, 3, 4, 5]; const pick = () => rows.splice(Math.floor(Math.random() * rows.length), 1)[0];
      s.discs = [{ side: -1, r: pick() }, { side: 1, r: pick() }];
      if (s.rnd >= 2) s.discs.push({ side: Math.random() < 0.5 ? -1 : 1, r: pick() });
      s.intro = 1.8;
    },
    speed(G) { const s = G.s; return 1 + Math.min(0.9, (s.lvl * 4 + s.rnd) * 0.04); },
    pos(G, r, c) { const s = G.s; return [G.W / 2 + (c - r / 2) * s.cw, s.y0 + r * s.step]; },
    on(r, c) { return r >= 0 && r < N && c >= 0 && c <= r; },
    // where a hopping thing is on screen (with the arc)
    where(G, o, lift) {
      const [x0, y0] = this.pos(G, o.fr, o.fc), [x1, y1] = this.pos(G, o.r, o.c), t = Math.min(1, o.t);
      return [x0 + (x1 - x0) * t, y0 + (y1 - y0) * t - Math.sin(Math.PI * t) * G.s.cw * 0.42 - (lift || 0)];
    },
    pop(s, x, y, txt, col) { s.pops.push({ x, y, t: 1, txt, col: col || "#ffd23f" }); },
    input(G, d) {
      const s = G.s, p = s.p;
      if (s.dead || s.fall || s.ride || s.won || s.intro > 0.6) return;
      if (p.t < 1) { if (p.t > 0.45) p.q = d; return; }
      this.hop(G, d);
    },
    hop(G, d) {
      const s = G.s, p = s.p, [dr, dc] = DIRS[d], r = p.r + dr, c = p.c + dc;
      p.fr = p.r; p.fc = p.c; p.r = r; p.c = c; p.t = 0; p.d = d; p.q = null;
      G.sfx("pass");
    },
    down(G, x, y) {
      const s = G.s, [px, py] = this.where(G, s.p, s.cw * 0.3);
      this.input(G, x < px ? (y < py ? 0 : 2) : (y < py ? 1 : 3));
    },
    onKey(G, k, d) { if (!d) return; const m = { ArrowLeft: 0, q: 0, ArrowUp: 1, e: 1, ArrowDown: 2, z: 2, ArrowRight: 3, c: 3 }[k]; if (m !== undefined) this.input(G, m); },
    land(G) {
      const s = G.s, p = s.p;
      if (!this.on(p.r, p.c)) {
        const disc = s.discs.find(dd => dd.r === p.r && ((dd.side < 0 && p.c === -1) || (dd.side > 0 && p.c === p.r + 1)));
        if (disc) {
          s.discs = s.discs.filter(dd => dd !== disc);
          const [x, y] = this.pos(G, p.r, p.c); s.ride = { t: 0, x, y };
          const cat = s.ens.find(e => e.k === "cat");
          if (cat && Math.abs(cat.r - p.fr) + Math.abs(cat.c - p.fc) <= 2) s.lure = { r: p.fr, c: p.fc, d: p.d, t: 3 };
          G.sfx("win"); return;
        }
        s.fall = { t: 0 }; G.sfx("lose"); return;
      }
      const L = s.L, v = s.cubes[p.r][p.c];
      if (v < L.need) { s.cubes[p.r][p.c] = v + 1; s.pts += 25; }
      else if (L.flip) s.cubes[p.r][p.c] = v - 1;
      if (s.cubes.every(row => row.every(x => x === L.need))) {
        const bonus = 1000 + 250 * (s.lvl * 4 + s.rnd) + 50 * s.discs.length;
        s.pts += bonus; s.won = 2.2; s.bonus = bonus; s.ens = []; G.sfx("win");
      }
    },
    spawn(G) {
      const s = G.s, n = s.spawned++, has = k => s.ens.some(e => e.k === k);
      let k = "red";
      if (n === 1 || (n > 3 && !has("egg") && !has("cat") && Math.random() < 0.35)) k = "egg";
      else if (n > 2 && !has("green") && Math.random() < 0.12) k = "green";
      else if ((s.lvl > 0 || s.rnd > 1) && n > 2 && !has("sq") && Math.random() < 0.2) k = "sq";
      if (k === "egg" && (has("egg") || has("cat"))) k = "red";
      const c = Math.random() < 0.5 ? 0 : 1;
      s.ens.push({ k, r: 1, c, fr: -3, fc: c - 1.5, t: 0, wait: 0.35, drop: 1 });
    },
    stepEnemy(G, e) {
      const s = G.s;
      e.fr = e.r; e.fc = e.c; e.t = 0; e.drop = 0;
      if (e.k === "cat") {
        let best = 0, bd = 1e9;
        const lure = s.lure && e.r === s.lure.r && e.c === s.lure.c;
        if (lure) { const [dr, dc] = DIRS[s.lure.d]; e.r += dr; e.c += dc; e.off = 1; return; }
        const tr = s.lure ? s.lure.r : s.p.r, tc = s.lure ? s.lure.c : s.p.c, [tx, ty] = this.pos(G, tr, tc);
        DIRS.forEach(([dr, dc], i) => { const r = e.r + dr, c = e.c + dc; if (!this.on(r, c)) return; const [x, y] = this.pos(G, r, c), dd = Math.hypot(x - tx, y - ty); if (dd < bd) { bd = dd; best = i; } });
        e.r += DIRS[best][0]; e.c += DIRS[best][1]; return;
      }
      if (e.k === "egg" && e.r === N - 1) { e.k = "cat"; e.wait = 0.8; e.t = 1; e.fr = e.r; e.fc = e.c; return; }
      e.r += 1; e.c += Math.random() < 0.5 ? 0 : 1;
      if (e.r >= N) e.off = 1;
    },
    die(G) {
      const s = G.s; if (s.dead) return;
      s.dead = 1.6; s.lives--; s.ens = []; s.lure = null; G.sfx("lose"); G.buzz();
    },
    update(G, dt) {
      const s = G.s, p = s.p, sp = this.speed(G);
      if (!s.cw) this.size(G);
      s.pops.forEach(o => { o.t -= dt; o.y -= 26 * dt; }); s.pops = s.pops.filter(o => o.t > 0);
      if (s.intro > 0) s.intro -= dt;
      if (s.won) {
        s.won -= dt;
        if (s.won <= 0) { s.rnd++; if (s.rnd >= 4) { s.rnd = 0; s.lvl++; } this.round(G); }
        return;
      }
      if (s.dead) {
        s.dead -= dt;
        if (s.dead <= 0) {
          s.dead = 0;
          if (s.lives <= 0) return G.over(s.pts, s.lvl >= 2 ? "Pyramid pro!" : s.lvl ? "@!#?@!" : "Cat got you.");
          if (!this.on(p.r, p.c)) { p.r = 0; p.c = 0; } p.fr = p.r; p.fc = p.c; p.t = 1; s.spawnT = 1.4;
        }
        return;
      }
      if (s.fall) { s.fall.t += dt; if (s.fall.t > 1.1) { s.fall = null; p.r = p.c = p.fr = p.fc = 0; p.t = 1; this.die(G); } return; }
      if (s.ride) {
        s.ride.t += dt / 1.1;
        if (s.ride.t >= 1) { s.ride = null; p.r = 0; p.c = 0; p.fr = -2; p.fc = 0; p.t = 0; p.drop = 1; }
      } else if (p.t < 1) {
        p.t += dt / (0.3 / sp);
        if (p.t >= 1) { p.t = 1; p.drop = 0; this.land(G); if (p.q !== null && !s.fall && !s.ride && !s.won) this.hop(G, p.q); }
      }
      if (s.lure) { s.lure.t -= dt; if (s.lure.t <= 0) s.lure = null; }
      // enemies
      if (s.freeze > 0) s.freeze -= dt;
      else {
        if (s.intro <= 0) { s.spawnT -= dt; if (s.spawnT <= 0) { this.spawn(G); s.spawnT = Math.max(1.3, 3.2 - (s.lvl * 4 + s.rnd) * 0.1); } }
        for (const e of s.ens) {
          if (e.t < 1) {
            e.t += dt / ((e.drop ? 0.45 : 0.32) / sp);
            if (e.t >= 1) {
              e.t = 1;
              if (e.off) { e.gone = 1; if (e.k === "cat" && s.lure) { s.pts += 500; this.pop(s, G.W / 2, s.y0 - s.cw, "+500 BYE CAT!"); s.lure = null; G.sfx("win"); } continue; }
              if (e.k === "sq" && this.on(e.r, e.c) && s.cubes[e.r][e.c] > 0) s.cubes[e.r][e.c]--;
              e.wait = (e.k === "cat" ? 0.42 : 0.5) / sp;
            }
          } else { e.wait -= dt; if (e.wait <= 0) this.stepEnemy(G, e); }
        }
        s.ens = s.ens.filter(e => !e.gone);
      }
      // collisions
      if (s.ride || s.fall) return;
      const [px, py] = this.where(G, p);
      for (const e of s.ens) {
        if (e.drop && e.t < 0.7) continue;
        const [x, y] = this.where(G, e);
        if (Math.hypot(x - px, y - py) > s.cw * 0.42) continue;
        if (e.k === "green") { e.gone = 1; s.freeze = 3.2; s.pts += 100; this.pop(s, x, y - 20, "+100 FREEZE"); G.sfx("win"); }
        else if (e.k === "sq") { e.gone = 1; s.pts += 300; this.pop(s, x, y - 20, "+300"); G.sfx("pop"); }
        else return this.die(G);
      }
      s.ens = s.ens.filter(e => !e.gone);
    },
    cube(G, c, x, y, top, pal, sc) {
      const s = G.s, hw = s.cw / 2 * (sc || 1), q = s.q * (sc || 1), d = s.d * (sc || 1);
      c.fillStyle = pal.l; c.beginPath(); c.moveTo(x - hw, y); c.lineTo(x, y + q); c.lineTo(x, y + q + d); c.lineTo(x - hw, y + d); c.fill();
      c.fillStyle = pal.r; c.beginPath(); c.moveTo(x + hw, y); c.lineTo(x, y + q); c.lineTo(x, y + q + d); c.lineTo(x + hw, y + d); c.fill();
      c.fillStyle = top; c.beginPath(); c.moveTo(x, y - q); c.lineTo(x + hw, y); c.lineTo(x, y + q); c.lineTo(x - hw, y); c.fill();
      c.strokeStyle = "rgba(0,0,0,0.35)"; c.lineWidth = 1; c.stroke();
    },
    ball(c, x, y, r, col, line) {
      c.fillStyle = col; c.beginPath(); c.arc(x, y, r, 0, 7); c.fill();
      c.strokeStyle = line; c.lineWidth = 1.5; c.beginPath(); c.arc(x - r * 0.3, y, r * 0.8, -1, 1); c.stroke(); c.beginPath(); c.arc(x + r * 0.4, y, r * 0.7, 2, 4.3); c.stroke();
    },
    draw(G, c) {
      const s = G.s, W = G.W, H = G.H, dark = G.dark(); if (!s.cubes) return;
      if (!s.cw) this.size(G);
      const bg = c.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, dark ? "#05051a" : "#14143a"); bg.addColorStop(1, dark ? "#120a2a" : "#2a1650");
      c.fillStyle = bg; c.fillRect(0, 0, W, H);
      c.fillStyle = "rgba(255,255,255,0.5)"; for (let i = 0; i < 40; i++) { const x = (i * 97.3) % W, y = 34 + (i * 53.7) % (H - 34); c.fillRect(x, y, 1.5, 1.5); }
      const flash = s.won && Math.floor(s.won * 8) % 2;
      for (let r = 0; r < N; r++) for (let cc = 0; cc <= r; cc++) {
        const [x, y] = this.pos(G, r, cc), v = s.cubes[r][cc];
        this.cube(G, c, x, y, flash ? s.pal.top[(v + 1) % s.pal.top.length] : s.pal.top[v], s.pal);
      }
      // frisbees
      s.discs.forEach(dd => {
        const [x, y] = this.pos(G, dd.r, dd.side < 0 ? -1 : dd.r + 1), sp = Math.cos(G.t * 6);
        c.save(); c.translate(x, y - s.cw * 0.1); c.scale(Math.max(0.25, Math.abs(sp)), 1);
        const gr = c.createLinearGradient(-s.cw * 0.3, 0, s.cw * 0.3, 0); ["#ff5e5e", "#ffd23f", "#4cd964", "#4d9dff", "#b45cff"].forEach((col, i) => gr.addColorStop(i / 4, col));
        c.fillStyle = gr; c.beginPath(); c.ellipse(0, 0, s.cw * 0.3, s.cw * 0.12, 0, 0, 7); c.fill(); c.restore();
      });
      // enemies
      for (const e of s.ens) {
        const [x, y] = this.where(G, e, s.cw * 0.12), rr = s.cw * 0.15;
        if (s.freeze > 0) c.globalAlpha = 0.6 + 0.4 * Math.sin(G.t * 12);
        if (e.k === "red") this.ball(c, x, y, rr, "#e53950", "#ff9aa8");
        else if (e.k === "egg") this.ball(c, x, y, rr * 1.1, "#8e44ad", "#d7a6ee");
        else if (e.k === "green") { c.fillStyle = "#c6e83a"; c.beginPath(); c.arc(x, y, rr, 0, 7); c.fill(); c.strokeStyle = "#fff"; c.lineWidth = 1.5; c.beginPath(); c.arc(x - rr, y, rr * 0.8, -0.9, 0.9); c.stroke(); }
        else if (e.k === "sq") G.emoji(c, "🐿️", x, y - rr * 0.6, s.cw * 0.5);
        else if (e.k === "cat") { G.emoji(c, "😼", x, y - rr * 0.8, s.cw * 0.55); }
        c.globalAlpha = 1;
      }
      // the dawg
      const p = s.p;
      let px, py;
      if (s.ride) { const t = s.ride.t, [tx, ty] = this.pos(G, 0, 0); px = s.ride.x + (tx - s.ride.x) * t; py = s.ride.y + (ty - s.cw * 1.4 - s.ride.y) * t; }
      else { [px, py] = this.where(G, p, s.cw * 0.3); if (s.fall) py += s.fall.t * s.fall.t * H * 0.9; }
      if (s.ride) { c.save(); c.translate(px, py + s.cw * 0.28); const gr = c.createLinearGradient(-s.cw * 0.3, 0, s.cw * 0.3, 0); ["#ff5e5e", "#ffd23f", "#4cd964", "#4d9dff"].forEach((col, i) => gr.addColorStop(i / 3, col)); c.fillStyle = gr; c.beginPath(); c.ellipse(0, 0, s.cw * 0.3, s.cw * 0.1, 0, 0, 7); c.fill(); c.restore(); }
      if (!(s.fall && py > H + 40)) G.img(c, s.dead || s.fall ? ":dawgpain:" : p.t < 1 || s.ride ? ":dawgpog:" : ":dawgW:", px, py, s.cw * 0.62);
      if (s.dead) {
        const bx = px + s.cw * 0.2, by = py - s.cw * 0.75, bw = Math.max(86, s.cw * 1.6);
        c.fillStyle = "#fff"; c.beginPath(); if (c.roundRect) c.roundRect(bx - bw / 2, by - 16, bw, 32, 10); else c.rect(bx - bw / 2, by - 16, bw, 32); c.fill();
        c.beginPath(); c.moveTo(bx - 8, by + 14); c.lineTo(px, py - s.cw * 0.3); c.lineTo(bx + 4, by + 14); c.fill();
        G.text(c, "@!#?@!", bx, by, 11, "#111");
      }
      s.pops.forEach(o => { c.globalAlpha = Math.min(1, o.t * 2); G.text(c, o.txt, o.x, o.y, 11, o.col); c.globalAlpha = 1; });
      G.hud(c, `${s.pts}`, "CUBE DAWG", `LV ${s.lvl + 1}-${s.rnd + 1}`);
      // target + lives
      G.text(c, "GOAL", 12, 54, 9, "#fff", "left"); this.cube(G, c, 70, 52, s.pal.top[s.L.need], s.pal, 0.42);
      for (let i = 0; i < Math.min(6, s.lives - (s.dead ? 0 : 1)); i++) G.img(c, ":dawgW:", W - 18 - i * 22, 54, 18);
      if (s.won) { G.text(c, "ROUND CLEAR!", W / 2, H - 70, 14, "#ffd23f"); G.text(c, `+${s.bonus}`, W / 2, H - 46, 12, "#fff"); }
      else if (s.intro > 0) { G.text(c, `LEVEL ${s.lvl + 1} · ROUND ${s.rnd + 1}`, W / 2, H - 70, Math.min(13, W / 28), "#ffd23f"); G.text(c, s.L.tip, W / 2, H - 46, Math.min(10, W / 40), "#fff"); }
      else if (G.state === "play") G.hint(c, "TAP A CORNER TO HOP", 6);
    }
  });
})();
