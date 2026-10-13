// ---------- Shred Dawg (classic top-down downhill skiing) ----------
// The bulldog skis near the top-middle while the mountain scrolls up. Hold anywhere: the skier turns to
// face your finger (7 headings: sideways = nearly stopped, straight down = fastest); release keeps the heading.
// Tap = hop (clears rocks, stumps, moguls, small trees, pups). Ramps launch big air: tap in the air to flip.
// Crashes cost time, not lives. Past 2000 m the giant snow-cat chases you and eventually gulps you up.
// Score = meters + style points.
(function () {
  const PXM = 14;                 // world px per meter
  const CELL = 170;               // world generation cell size
  const BEAST_M = 2000;
  const STEP = Math.PI / 6;       // 30 degrees per heading step
  const SPD = [1, 0.82, 0.5, 0];  // speed factor per |heading|
  const rnd = (a, b) => a + Math.random() * (b - a);
  const clamp = (v, a, b) => v < a ? a : v > b ? b : v;
  const E = (c, ch, x, y, sz) => { c.fillStyle = "#000"; G.emoji(c, ch, x, y, sz); };
  const PY = G => Math.round(G.H * 0.3);

  const meters = s => Math.floor(Math.max(0, s.wy) / PXM);
  const total = s => Math.min(99999, meters(s) + s.style);
  const pop = (s, x, y, txt, col) => s.pops.push({ x, y, txt, col, t: 1.1 });

  // ---------- world generation (cells keyed "cx,cy") ----------
  function genCell(G, cx, cy) {
    const s = G.s, list = [], x0 = cx * CELL, y0 = cy * CELL;
    const m = Math.max(0, y0 / PXM), d = clamp(m / 2500, 0, 1);
    const near = (x, y) => Math.abs(x) < 80 && y < 260; // keep the start clear
    const n = Math.floor(rnd(1, 2.4 + d * 3));
    for (let i = 0; i < n; i++) {
      const x = x0 + rnd(10, CELL - 10), y = y0 + rnd(10, CELL - 10);
      if (near(x, y)) continue;
      const q = Math.random();
      if (q < 0.42) { const sz = Math.random() < 0.45 ? 0 : Math.random() < 0.6 ? 1 : 2; list.push({ t: "tree", x, y, sz, r: 5 + sz * 3 }); }
      else if (q < 0.54) list.push({ t: "rock", x, y, r: 8 });
      else if (q < 0.64) list.push({ t: "stump", x, y, r: 7 });
      else if (q < 0.82) list.push({ t: "mogul", x, y, r: 11 });
      else if (q < 0.87) list.push({ t: "pup", x, y, r: 9 });
      else list.push({ t: "tree", x, y, sz: 0, r: 5 });
    }
    if (Math.random() < 0.16 && !near(x0 + 85, y0 + 85)) list.push({ t: "ramp", x: x0 + rnd(30, CELL - 30), y: y0 + rnd(20, CELL - 20), r: 20 });
    if (Math.random() < 0.12 && !near(x0 + 85, y0 + 85)) {
      const fx = x0 + rnd(40, CELL - 40), fy = y0 + rnd(20, CELL - 20), blue = Math.random() < 0.5;
      list.push({ t: "flag", x: fx - 34, y: fy, r: 4, blue });
      list.push({ t: "flag", x: fx + 34, y: fy, r: 4, blue });
      list.push({ t: "gate", x: fx, y: fy, r: 30 });
    }
    s.cells.set(cx + "," + cy, list);
  }
  function ensureCells(G) {
    const s = G.s, cx0 = Math.floor((s.x - G.W) / CELL), cx1 = Math.floor((s.x + G.W) / CELL);
    const cy0 = Math.floor((s.wy - PY(G) - 40) / CELL), cy1 = Math.floor((s.wy + G.H + 120) / CELL);
    for (let cy = cy0; cy <= cy1; cy++) for (let cx = cx0; cx <= cx1; cx++) if (!s.cells.has(cx + "," + cy)) genCell(G, cx, cy);
    if (++s.gc > 60) { // drop cells far behind / far off to the side
      s.gc = 0;
      for (const k of s.cells.keys()) { const p = k.split(","), cx = +p[0], cy = +p[1]; if ((cy + 1) * CELL < s.wy - G.H || Math.abs(cx * CELL - s.x) > G.W * 3) s.cells.delete(k); }
    }
  }

  // ---------- player actions ----------
  function crash(G, small, why) {
    const s = G.s;
    if (s.down > 0 || s.inv > 0) return;
    s.down = small ? 0.6 : 1.15; s.downMax = s.down; s.small = small; s.air = 0; s.big = false; s.flip = 0;
    s.crashes++; G.sfx("lose"); G.buzz();
    pop(s, s.x, s.wy - 34, why || (small ? "BONK!" : "OOF!"), "#ff5a5a");
  }
  function hop(G) {
    const s = G.s;
    if (s.down > 0 || s.eat > 0) return;
    if (s.air > 0) { // in big air: flip
      if (s.big && s.flip <= 0) { s.flip = 0.5; G.sfx("pop"); }
      return;
    }
    s.air = s.airMax = 0.55; s.big = false; s.hopH = 15; G.sfx("pop");
  }
  function setHeading(s, h) { s.h = clamp(h, -3, 3); }

  // ---------- moving cats (skiers / snowboarders) ----------
  function spawnCat(G) {
    const s = G.s, board = Math.random() < 0.4;
    s.cats.push({ x: s.x + rnd(-G.W * 0.6, G.W * 0.6), y: s.wy + G.H - PY(G) + 40, vy: rnd(90, 160), ph: rnd(0, 6), sw: rnd(20, 60), board, fall: 0, hit: false });
  }

  defGame({
    key: "shred", name: "Shred Dawg", icon: "⛷️", max: 99999, cat: "sports",
    blurb: "Ski the endless mountain. Outrun the snow-cat.",
    how: "Hold anywhere and the dog turns to face your finger: straight down is fastest, sideways nearly stops you. Let go to keep your heading. Tap to hop over rocks, stumps, moguls, pups and small trees. Hit a ramp for big air and tap in the air to flip (+40 style), but finish the flip before you land. Ski between two flags for +10. Crashing just costs time. Past 2000 m the giant snow-cat chases you and it keeps getting faster. Score = meters + style.",
    reset(G) {
      G.s = {
        x: 0, wy: 0, pwy: 0, h: 0, v: 0, time: 0, style: 0, crashes: 0,
        air: 0, airMax: 0, big: false, hopH: 15, flip: 0, flips: 0, down: 0, downMax: 1, small: false, inv: 0,
        hold: false, holdT: 0, fx: 0, fy: 0, cells: new Map(), gc: 0, cats: [], catT: 3,
        pops: [], trail: [], trailT: 0, beast: null, eat: 0, banner: 0, slowT: 0,
      };
      ensureCells(G);
    },
    down(G, x, y) { const s = G.s; s.hold = true; s.holdT = 0; s.fx = x; s.fy = y; },
    move(G, x, y) { const s = G.s; s.fx = x; s.fy = y; },
    up(G) { G.s.hold = false; },
    tap(G) { if (G.s.holdT < 0.22) hop(G); },
    onKey(G, k, d) {
      if (!d) return; const s = G.s;
      if (k === "ArrowLeft" || k === "a") setHeading(s, s.h - 1);
      else if (k === "ArrowRight" || k === "d") setHeading(s, s.h + 1);
      else if (k === "ArrowDown" || k === "s") setHeading(s, 0);
      else if (k === "ArrowUp" || k === " " || k === "w") hop(G);
    },
    update(G, dt) {
      const s = G.s, py = PY(G);
      s.time += dt; s.inv = Math.max(0, s.inv - dt); s.slowT = Math.max(0, s.slowT - dt);
      if (s.hold) s.holdT += dt;

      // the snow-cat eating you
      if (s.eat > 0) {
        s.eat -= dt;
        for (const p of s.pops) { p.t -= dt; p.y -= 20 * dt; }
        if (s.eat <= 0) G.over(total(s), "Gulp! The snow-cat got you.");
        return;
      }

      // steering toward the finger (held, not a quick tap)
      if (s.hold && s.holdT > 0.1 && s.down <= 0 && !(s.air > 0 && s.big)) {
        const dx = s.fx - G.W / 2, dy = s.fy - py;
        if (Math.abs(dx) > 6 || Math.abs(dy) > 6) {
          const ang = dy <= 0 ? (dx < 0 ? -Math.PI / 2 : Math.PI / 2) : Math.atan2(dx, dy);
          setHeading(s, Math.round(ang / STEP));
        }
      }

      const m = meters(s), vmax = 270 + Math.min(110, m * 0.05);
      s.pwy = s.wy;
      if (s.down > 0) {
        s.down -= dt; s.v = Math.max(0, s.v - 900 * dt);
        if (s.down <= 0) { s.inv = 0.7; s.v = 0; }
      } else {
        const ah = Math.abs(s.h);
        let target = ah === 3 ? 42 : vmax * SPD[ah];
        if (s.slowT > 0) target *= 0.55;
        if (s.air > 0) target = Math.max(target, s.v); // no braking in the air
        s.v += clamp(target - s.v, -520 * dt, (s.v < 120 ? 260 : 170) * dt);
      }
      const a = s.h * STEP, dirx = Math.sin(a), diry = Math.abs(s.h) === 3 ? 0 : Math.cos(a);
      if (s.down <= 0) { s.x += s.v * dirx * dt; s.wy += s.v * diry * dt; }
      else if (s.v > 0) s.wy += s.v * 0.6 * dt; // slide a little while tumbling

      // air
      if (s.air > 0) {
        s.air -= dt;
        if (s.flip > 0) { s.flip -= dt; if (s.flip <= 0) { s.flips++; s.style += 40; pop(s, s.x, s.wy - 50, "FLIP! +40", "#ffd23f"); G.sfx("win"); } }
        if (s.air <= 0) {
          s.air = 0;
          if (s.flip > 0) { s.flip = 0; s.big = false; crash(G, false, "FACEPLANT!"); }
          else if (s.big) { s.big = false; pop(s, s.x, s.wy - 40, "STOMPED!", "#4cc9f0"); }
        }
      }

      ensureCells(G);

      // collisions with static stuff (swept along this frame's movement)
      if (s.down <= 0) {
        const ccx = Math.floor(s.x / CELL), ccy = Math.floor(s.wy / CELL), hopping = s.air > 0 && !s.big, flying = s.air > 0 && s.big;
        for (let cy = ccy - 1; cy <= ccy + 1; cy++) for (let cx = ccx - 1; cx <= ccx + 1; cx++) {
          const list = s.cells.get(cx + "," + cy); if (!list) continue;
          for (const o of list) {
            if (o.hit) continue;
            const ddx = Math.abs(o.x - s.x);
            if (o.t === "gate") { if (o.y > s.pwy - 1 && o.y <= s.wy + 1 && ddx < 30) { o.hit = true; s.style += 10; pop(s, s.x, s.wy - 40, "+10", "#4cc9f0"); G.sfx("pop"); } continue; }
            if (ddx > o.r + 6 || o.y < s.pwy - 7 || o.y > s.wy + 7) continue;
            if (o.t === "ramp") { if (s.air <= 0) { o.hit = true; s.air = s.airMax = 1.35; s.big = true; s.hopH = 46; s.v = Math.max(s.v, vmax * 0.8); s.style += 10; pop(s, s.x, s.wy - 44, "AIR! TAP TO FLIP", "#ffd23f"); G.sfx("pop"); } continue; }
            if (flying || s.inv > 0) continue;
            if (o.t === "mogul") { o.hit = true; if (!hopping) { s.slowT = 0.45; s.air = s.airMax = 0.3; s.big = false; s.hopH = 7; s.style += 1; } continue; }
            if (hopping && (o.t !== "tree" || o.sz === 0)) continue;
            o.hit = true;
            if (o.t === "pup") { o.bonk = 1.2; crash(G, true, "BONK! SORRY PUP"); }
            else if (o.t === "flag") crash(G, true, "BONK!");
            else crash(G, false, o.t === "tree" ? "TIMBER!" : "OOF!");
          }
        }
      }

      // cats skiing/snowboarding downhill
      if (m > 80) { s.catT -= dt; if (s.catT <= 0) { spawnCat(G); s.catT = rnd(2.2, 4.5) - Math.min(1.5, m / 1500); } }
      for (let i = s.cats.length - 1; i >= 0; i--) {
        const k = s.cats[i];
        if (k.fall > 0) k.fall -= dt;
        else { k.ph += dt; k.y += k.vy * dt; k.x += Math.cos(k.ph * 1.3) * k.sw * dt; }
        if (k.y < s.wy - py - 80 || k.y > s.wy + G.H * 2) { s.cats.splice(i, 1); continue; }
        if (!k.hit && s.down <= 0 && s.inv <= 0 && !(s.air > 0) && Math.abs(k.x - s.x) < 13 && Math.abs(k.y - s.wy) < 10) {
          k.hit = true; k.fall = 1.5; crash(G, false, "CAT CRASH!");
        }
      }

      // the snow-cat
      if (!s.beast && m >= BEAST_M) {
        s.beast = { x: s.x - G.W * 0.4, y: s.wy - py - 140, spd: 250, t: 0 };
        s.banner = 2.2;
      }
      if (s.banner > 0) s.banner -= dt;
      if (s.beast) {
        const b = s.beast; b.t += dt; b.spd += 6 * dt;
        const dx = s.x - b.x, dy = s.wy - b.y, dist = Math.hypot(dx, dy) || 1;
        b.x += dx / dist * b.spd * dt; b.y += dy / dist * b.spd * dt;
        if (dist > G.H * 1.6) { b.x = s.x - dx / dist * G.H * 1.6; b.y = s.wy - dy / dist * G.H * 1.6; } // never too far behind
        if (dist < 22 && !(s.air > 0 && s.big)) { s.eat = 1.5; b.x = s.x; b.y = s.wy + 6; G.sfx("lose"); G.buzz(); }
      }

      // ski tracks
      s.trailT -= dt;
      if (s.trailT <= 0) {
        s.trailT = 0.035; const gap = s.air > 0 || s.down > 0 || s.v < 5;
        s.trail.push({ x: s.x, y: s.wy, a, gap }); if (s.trail.length > 70) s.trail.shift();
      }
      for (let i = s.pops.length - 1; i >= 0; i--) { const p = s.pops[i]; p.t -= dt; p.y -= 26 * dt; if (p.t <= 0) s.pops.splice(i, 1); }
      for (const list of s.cells.values()) for (const o of list) if (o.bonk > 0) o.bonk -= dt;

      if (total(s) >= 99999) G.over(99999, "Legend of the mountain!");
    },
    draw(G, c) {
      const s = G.s, W = G.W, H = G.H, py = PY(G), dk = G.dark(), t = G.t;
      const ox = W / 2 - s.x, oy = py - s.wy; // world -> screen offset
      // snow
      c.fillStyle = dk ? "#25304a" : "#ffffff"; c.fillRect(0, 0, W, H);
      c.fillStyle = dk ? "#33405f" : "#e3eaf4";
      for (let gy = Math.floor((s.wy - py) / 46) * 46; gy < s.wy - py + H + 46; gy += 46)
        for (let gx = Math.floor((s.x - W / 2) / 46) * 46; gx < s.x + W / 2 + 46; gx += 46) {
          const hsh = Math.abs((gx * 73856093) ^ (gy * 19349663)) % 997;
          c.fillRect(Math.round(gx + (hsh % 40) + ox), Math.round(gy + ((hsh >> 3) % 40) + oy), 2, 2);
        }
      if (dk) { c.fillStyle = "rgba(255,255,255,0.55)"; for (let i = 0; i < 26; i++) { const fx = (i * 97 + t * 20 * (1 + i % 3)) % W, fy = (i * 151 + t * 40 * (1 + i % 2)) % H; c.fillRect(fx, fy, 2, 2); } }

      // tracks
      c.strokeStyle = dk ? "#4a5a80" : "#cdd7e6"; c.lineWidth = 1.5; c.beginPath();
      for (let i = 1; i < s.trail.length; i++) {
        const p0 = s.trail[i - 1], p1 = s.trail[i]; if (p1.gap || p0.gap) continue;
        for (let off = -3; off <= 3; off += 6) {
          c.moveTo(p0.x + ox + Math.cos(p0.a) * off, p0.y + oy - Math.sin(p0.a) * off);
          c.lineTo(p1.x + ox + Math.cos(p1.a) * off, p1.y + oy - Math.sin(p1.a) * off);
        }
      }
      c.stroke();

      // objects (two passes so things in front of the skier draw over him; flat moguls/ramps always first)
      const cy0 = Math.floor((s.wy - py - 60) / CELL), cy1 = Math.floor((s.wy - py + H + 60) / CELL);
      const cx0 = Math.floor((s.x - W / 2 - 40) / CELL), cx1 = Math.floor((s.x + W / 2 + 40) / CELL);
      for (let pass = 0; pass < 2; pass++) {
        for (let cy = cy0; cy <= cy1; cy++) for (let cx = cx0; cx <= cx1; cx++) {
          const list = s.cells.get(cx + "," + cy); if (!list) continue;
          for (const o of list) {
            const flat = o.t === "mogul" || o.t === "ramp";
            if (flat ? pass === 1 : (o.y > s.wy) !== (pass === 1)) continue;
            drawObj(c, o, o.x + ox, o.y + oy, dk, t);
          }
        }
        for (const k of s.cats) if ((k.y > s.wy) === (pass === 1)) drawCat(c, k, k.x + ox, k.y + oy, dk, t);
        if (pass === 0 && !(s.eat > 0 && s.eat < 1.2)) drawDog(G, c, s, W / 2, py, dk);
      }

      // the snow-cat
      if (s.beast) {
        const b = s.beast, bx = b.x + ox, by = b.y + oy;
        if (by < -10 || bx < -30 || bx > W + 30) { // off-screen pointer
          const ax = clamp(bx, 16, W - 16), ay = clamp(by, 14, H - 30);
          c.fillStyle = "#ff5a5a"; c.beginPath(); c.arc(ax, ay, 11, 0, 7); c.fill();
          G.text(c, "!", ax + 1, ay + 1, 12, "#fff");
        } else drawBeast(c, bx, by, t, s.eat > 0 ? 1 - s.eat / 1.5 : -1);
      }

      // pops
      for (const p of s.pops) {
        c.globalAlpha = clamp(p.t, 0, 1);
        G.text(c, p.txt, p.x + ox + 1, p.y + oy + 1, 10, dk ? "#000" : "rgba(0,0,0,0.35)");
        G.text(c, p.txt, p.x + ox, p.y + oy, 10, p.col);
      }
      c.globalAlpha = 1;

      // classic stats box (top right)
      const bw = 132, bh = 66, bx = W - bw - 8, by = 8;
      c.fillStyle = dk ? "#11182a" : "#ffffff"; c.fillRect(bx, by, bw, bh);
      c.strokeStyle = dk ? "#8fa3cc" : "#000"; c.lineWidth = 2; c.strokeRect(bx, by, bw, bh);
      const sec = Math.floor(s.time), tm = `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, "0")}`;
      const tc = dk ? "#e8eefc" : "#000";
      G.text(c, "TIME", bx + 7, by + 11, 10, tc, "left"); G.text(c, tm, bx + bw - 7, by + 11, 10, tc, "right");
      G.text(c, "DIST", bx + 7, by + 26, 10, tc, "left"); G.text(c, meters(s) + "m", bx + bw - 7, by + 26, 10, tc, "right");
      G.text(c, "SPEED", bx + 7, by + 41, 10, tc, "left"); G.text(c, Math.round(s.v / PXM) + "", bx + bw - 7, by + 41, 10, tc, "right");
      G.text(c, "STYLE", bx + 7, by + 56, 10, tc, "left"); G.text(c, String(s.style), bx + bw - 7, by + 56, 10, tc, "right");

      if (s.banner > 0 && s.eat <= 0) G.banner(c, "SNOW-CAT!", "#ff5a5a", H * 0.62);
      if (s.eat > 0) G.banner(c, "GULP!", "#ff5a5a", H * 0.62);
      if (s.beast && s.eat <= 0 && s.banner <= 0) G.text(c, "RUN!", 12, 20, 12, "#ff5a5a", "left");
      if (G.state === "play") G.hint(c, "HOLD TO STEER · TAP TO HOP", 5);
    },
  });

  // ---------- sprites ----------
  function px(c, col, x, y, w, h) { c.fillStyle = col; c.fillRect(Math.round(x), Math.round(y), w, h); }
  function shadow(c, x, y, w) { c.fillStyle = "rgba(40,60,100,0.18)"; c.beginPath(); c.ellipse(x, y, w, w * 0.35, 0, 0, Math.PI * 2); c.fill(); }

  function drawObj(c, o, x, y, dk, t) {
    if (y < -80 || y > G.H + 60 || x < -40 || x > G.W + 40) return;
    switch (o.t) {
      case "tree": {
        const u = [2, 3, 4][o.sz], g1 = dk ? "#2f7d55" : "#1f8a3a", g2 = dk ? "#3f9a6a" : "#38b04f";
        shadow(c, x + 3, y, 5 + o.sz * 3);
        px(c, "#7a4a20", x - u, y - u * 3, u * 2, u * 3);
        for (let i = 0; i < 6; i++) {
          const w = (6 - i) * u * 1.5 + ((i % 2) ? 0 : u), yy = y - u * 3 - (i + 1) * u * 1.8;
          px(c, g1, x - w / 2, yy, w, u * 1.8 + 1);
          px(c, g2, x - w / 2, yy, Math.max(u, w * 0.3), u * 1.8 + 1);
        }
        if (dk) px(c, "#dfe8ff", x - u, y - u * 3 - 6 * u * 1.8 - 1, u * 2, u);
        break;
      }
      case "rock": {
        const g = dk ? "#7d8599" : "#8e949e", hl = dk ? "#a4adc2" : "#b9bec6";
        shadow(c, x + 2, y, 9);
        px(c, "#4a4f58", x - 9, y - 9, 18, 9); px(c, g, x - 8, y - 9, 16, 8); px(c, "#4a4f58", x - 6, y - 12, 12, 3); px(c, g, x - 5, y - 11, 10, 2); px(c, hl, x - 6, y - 8, 6, 3);
        break;
      }
      case "stump": {
        shadow(c, x + 2, y, 8);
        px(c, "#5a3412", x - 7, y - 9, 14, 9); px(c, "#8a5a2b", x - 6, y - 9, 12, 8); px(c, "#c99a5f", x - 7, y - 12, 14, 4); px(c, "#8a5a2b", x - 3, y - 11, 6, 2);
        break;
      }
      case "mogul": {
        c.fillStyle = dk ? "#3a4870" : "#d5dfee"; c.beginPath(); c.ellipse(x, y, 13, 6, 0, Math.PI, 0); c.fill();
        c.fillStyle = dk ? "#4e5f8f" : "#f3f6fb"; c.beginPath(); c.ellipse(x - 2, y - 2, 8, 3, 0, Math.PI, 0); c.fill();
        break;
      }
      case "ramp": {
        c.globalAlpha = o.hit ? 0.7 : 1;
        c.fillStyle = dk ? "#6b7fae" : "#a9c3e6"; c.beginPath(); c.moveTo(x - 20, y + 6); c.lineTo(x + 20, y + 6); c.lineTo(x + 15, y - 8); c.lineTo(x - 15, y - 8); c.fill();
        px(c, "#ffd23f", x - 15, y - 9, 30, 4); px(c, "#ff8c42", x - 15, y - 9, 6, 4); px(c, "#ff8c42", x - 3, y - 9, 6, 4); px(c, "#ff8c42", x + 9, y - 9, 6, 4);
        c.globalAlpha = 1; break;
      }
      case "flag": {
        px(c, dk ? "#cfd8ee" : "#333", x - 1, y - 22, 2, 22);
        c.fillStyle = o.blue ? "#2f6fe0" : "#e63946"; c.beginPath(); c.moveTo(x + 1, y - 22); c.lineTo(x + 13, y - 18 + Math.sin(t * 6 + x) * 1.5); c.lineTo(x + 1, y - 14); c.fill();
        break;
      }
      case "pup": {
        shadow(c, x, y, 9);
        const bob = o.bonk > 0 ? Math.sin(o.bonk * 30) * 2 : 0;
        E(c, "🐶", x + bob, y - 9, 18);
        if (o.bonk > 0) G.text(c, "?!", x + 13, y - 22, 10, "#ff5a5a");
        break;
      }
    }
  }

  function drawCat(c, k, x, y, dk, t) {
    if (y < -40 || y > G.H + 40) return;
    shadow(c, x, y, 9);
    if (k.fall > 0) {
      px(c, "#444", x - 12, y + 2, 10, 2); px(c, "#444", x + 3, y - 3, 10, 2);
      px(c, k.board ? "#7b2cbf" : "#2a9d8f", x - 6, y - 6, 12, 7);
      E(c, "😿", x + 9, y - 8, 14); return;
    }
    const lean = Math.cos(k.ph * 1.3);
    if (k.board) { c.save(); c.translate(x, y); c.rotate(lean * 0.3); px(c, "#ff8c42", -11, -1, 22, 4); c.restore(); }
    else { px(c, "#555", x - 5 + lean * 2, y - 8, 2, 14); px(c, "#555", x + 3 + lean * 2, y - 8, 2, 14); }
    px(c, k.board ? "#7b2cbf" : "#2a9d8f", x - 5, y - 12, 10, 9);
    E(c, "🐱", x, y - 18, 14);
  }

  function drawDog(G, c, s, x, y, dk) {
    const lift = s.air > 0 ? Math.sin(Math.PI * (1 - s.air / s.airMax)) * s.hopH : 0;
    shadow(c, x, y + 4, s.air > 0 ? 9 - lift * 0.08 : 10);
    if (s.inv > 0 && Math.floor(s.inv * 12) % 2 === 0) c.globalAlpha = 0.5;
    c.save(); c.translate(x, y - lift);
    const sc = 1 + lift * 0.008; c.scale(sc, sc);
    if (s.down > 0) { // tumble, then sit in the snow
      const p = 1 - s.down / s.downMax;
      if (p < 0.55 && !s.small) c.rotate(p * 18);
      const sk = dk ? "#9ec5ff" : "#1d3557"; px(c, sk, -15, 3, 13, 3); px(c, sk, 4, -2, 13, 3);
      px(c, "#e63946", -6, -4, 12, 9);
      G.img(c, ":dawgpain:", 0, -10, 22);
      c.restore(); c.globalAlpha = 1; return;
    }
    if (s.flip > 0) c.rotate((1 - s.flip / 0.5) * Math.PI * 2);
    const a = s.h * STEP, ah = Math.abs(s.h);
    // skis point along the heading (sideways = horizontal)
    c.save(); c.rotate(-a);
    const sk = dk ? "#9ec5ff" : "#1d3557"; px(c, sk, -5, -8, 3, 20); px(c, sk, 2, -8, 3, 20);
    px(c, "#ffd23f", -5, 10, 3, 2); px(c, "#ffd23f", 2, 10, 3, 2);
    c.restore();
    const lean = Math.sin(a) * 3;
    px(c, "#999", -9 + lean, -4, 2, 12); px(c, "#999", 7 + lean, -4, 2, 12);
    px(c, "#e63946", -6 + lean, -6, 12, 10);
    px(c, "#ffffff", -6 + lean, -2, 12, 2);
    const scared = s.beast && Math.hypot(s.beast.x - s.x, s.beast.y - s.wy) < 260;
    const face = scared ? ":dawgsweat:" : (s.air > 0 && s.big) || (ah === 0 && s.v > 300) ? ":dawgpog:" : ":dawgW:";
    G.img(c, face, lean * 0.8, -13, 22, s.h * 0.08);
    c.restore(); c.globalAlpha = 1;
  }

  // giant fluffy snow-cat with a beanie (eatP: -1 chasing, 0..1 eating)
  function drawBeast(c, x, y, t, eatP) {
    const run = Math.sin(t * 12), ol = "#9fb3d1";
    c.save(); c.translate(x, y);
    if (eatP >= 0.3) c.scale(1 + Math.sin(eatP * 20) * 0.03, 1);
    shadow(c, 0, 4, 26);
    const blob = (bx, by, r, col) => { c.fillStyle = ol; c.beginPath(); c.arc(bx, by, r + 2, 0, 7); c.fill(); c.fillStyle = col || "#ffffff"; c.beginPath(); c.arc(bx, by, r, 0, 7); c.fill(); };
    blob(-11, -2 + (eatP < 0 ? run * 3 : 0), 8); blob(11, -2 - (eatP < 0 ? run * 3 : 0), 8);
    blob(0, -24, 22); blob(-16, -30, 10); blob(16, -30, 10); blob(-14, -14, 9); blob(14, -14, 9);
    const arm = eatP >= 0 ? 6 : run * 8;
    blob(-26, -40 + arm, 8); blob(26, -40 - arm, 8);
    blob(0, -52, 18);
    // ears
    c.fillStyle = ol; c.beginPath(); c.moveTo(-17, -58); c.lineTo(-14, -78); c.lineTo(-3, -66); c.fill(); c.beginPath(); c.moveTo(17, -58); c.lineTo(14, -78); c.lineTo(3, -66); c.fill();
    c.fillStyle = "#ffffff"; c.beginPath(); c.moveTo(-15, -60); c.lineTo(-13, -74); c.lineTo(-5, -65); c.fill(); c.beginPath(); c.moveTo(15, -60); c.lineTo(13, -74); c.lineTo(5, -65); c.fill();
    // beanie
    c.fillStyle = "#e63946"; c.beginPath(); c.arc(0, -62, 14, Math.PI, 0); c.fill();
    px(c, "#ffffff", -15, -64, 30, 5); blob(0, -78, 5, "#ffffff");
    if (eatP >= 0 && eatP < 0.3) { // big mouth open
      c.fillStyle = "#7a1f3d"; c.beginPath(); c.ellipse(0, -45, 10, 9, 0, 0, 7); c.fill();
      px(c, "#000", -8, -58, 4, 4); px(c, "#000", 4, -58, 4, 4);
    } else if (eatP >= 0.3) { // happy, full
      c.strokeStyle = "#000"; c.lineWidth = 2; c.beginPath(); c.arc(-6, -54, 3, Math.PI, 0); c.stroke(); c.beginPath(); c.arc(6, -54, 3, Math.PI, 0); c.stroke();
      c.beginPath(); c.arc(0, -46, 5, 0, Math.PI); c.stroke();
      c.fillStyle = "#ffb3c6"; c.beginPath(); c.arc(-11, -47, 3, 0, 7); c.fill(); c.beginPath(); c.arc(11, -47, 3, 0, 7); c.fill();
    } else {
      px(c, "#000", -8, -57, 4, 5); px(c, "#000", 4, -57, 4, 5); px(c, "#fff", -7, -57, 1, 1); px(c, "#fff", 5, -57, 1, 1);
      c.fillStyle = "#ff8fab"; c.beginPath(); c.moveTo(-3, -50); c.lineTo(3, -50); c.lineTo(0, -47); c.fill();
      c.strokeStyle = "#000"; c.lineWidth = 1.5; c.beginPath(); c.arc(-3, -46, 3, 0, Math.PI); c.stroke(); c.beginPath(); c.arc(3, -46, 3, 0, Math.PI); c.stroke();
      c.strokeStyle = ol; c.beginPath(); c.moveTo(-8, -48); c.lineTo(-20, -50); c.moveTo(-8, -46); c.lineTo(-20, -44); c.moveTo(8, -48); c.lineTo(20, -50); c.moveTo(8, -46); c.lineTo(20, -44); c.stroke();
    }
    c.restore();
  }
})();
