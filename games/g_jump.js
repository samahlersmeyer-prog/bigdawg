// ---------- Pup Jump (vertical bouncer) ----------
// The pup bounces on every platform it lands on. Steer left/right, wrap around the edges, climb forever.
// World y grows UPWARD; screen y = H - (wy - cam).
defGame({
  key: "jump", name: "Pup Jump", icon: "🐶", max: 999999,
  blurb: "Bounce up forever. Don't look down.",
  how: "The pup bounces by itself. Hold the left or right side of the screen (or drag) to steer. Fly off one edge to come out the other. Bones launch you sky high, boxes break after one bounce. Land on cats and squirrels to bop them (+50), but don't bump into them. Don't fall!",
  reset(G) {
    const W = G.W, H = G.H;
    const s = G.s = {
      p: { x: W / 2, y: 40, vx: 0, vy: 0, sq: 0, face: ":dawgW:", spr: 0 },
      plats: [], foes: [], pops: [], bits: [],
      cam: 0, top: 0, maxY: 0, bonus: 0, dir: 0, keyL: false, keyR: false,
      hold: 0, ax: 0, dragging: false, stars: [], clouds: []
    };
    s.GRAV = 1500; s.JUMP = 800; s.SPRING = 1450; // max jump height = JUMP^2/(2*GRAV) ~ 213px
    for (let i = 0; i < 70; i++) s.stars.push({ x: Math.random() * W, y: Math.random() * H, r: Math.random() < 0.2 ? 2 : 1, tw: Math.random() * 6 });
    for (let i = 0; i < 6; i++) s.clouds.push({ x: Math.random() * W, y: Math.random() * (H + 200), w: 50 + Math.random() * 50 });
    // ground floor plank so the start is safe
    s.plats.push({ x: W / 2, y: 20, w: W * 0.5, t: "n", style: 0, vx: 0, broken: 0, spring: 0, fall: 0 });
    s.top = 20;
    this.gen(G);
  },
  gen(G) {
    const s = G.s, W = G.W;
    while (s.top < s.cam + G.H + 260) {
      const h = s.top, lvl = Math.min(1, h / 22000);
      const maxGap = 165; // well under the ~213px max jump
      const gap = Math.min(maxGap, 55 + lvl * 95 + Math.random() * (25 + lvl * 25));
      const y = h + gap;
      const w = Math.max(54, 84 - lvl * 30);
      const r = Math.random();
      let t = "n";
      if (h > 600 && r < 0.12 + lvl * 0.28) t = "m";
      else if (h > 1200 && r < 0.22 + lvl * 0.4) t = "c";
      const pl = { x: w / 2 + Math.random() * (W - w), y, w, t, style: Math.random() < 0.5 ? 0 : 1, vx: 0, broken: 0, spring: 0, fall: 0 };
      if (t === "m") pl.vx = (Math.random() < 0.5 ? -1 : 1) * (50 + lvl * 90);
      if (t !== "c" && h > 300 && Math.random() < 0.07) pl.spring = 1;
      s.plats.push(pl);
      // sometimes add a decoy / alternate platform on a nearby row (never a requirement)
      if (Math.random() < 0.35 - lvl * 0.15) {
        const w2 = w * 0.9, x2 = (pl.x + W / 2 + Math.random() * W * 0.3) % W;
        s.plats.push({ x: Math.min(W - w2 / 2, Math.max(w2 / 2, x2)), y: y - gap * 0.5, w: w2, t: Math.random() < 0.4 ? "c" : "n", style: 1, vx: 0, broken: 0, spring: 0, fall: 0 });
      }
      // hazards after the easy start
      if (h > 2500 && Math.random() < 0.05 + lvl * 0.1 && h - (s.lastFoe || 0) > 500) {
        s.lastFoe = h;
        if (Math.random() < 0.5) { // cat sits on its own extra platform, so it's never required
          const cw = 64, cx = (pl.x + W / 2) % W, cp = { x: Math.min(W - cw / 2, Math.max(cw / 2, cx)), y: y - gap * 0.5, w: cw, t: "n", style: 0, vx: 0, broken: 0, spring: 0, fall: 0 };
          s.plats.push(cp); s.foes.push({ k: "cat", x: cp.x, y: cp.y + 18, vx: 0, pl: cp, dead: 0 });
        }
        else s.foes.push({ k: "sq", x: Math.random() * W, y: y + gap * 0.5 + 10, vx: (Math.random() < 0.5 ? -1 : 1) * (60 + lvl * 60), dead: 0, ph: Math.random() * 6 });
      }
      s.top = y;
    }
  },
  update(G, dt) {
    const s = G.s, p = s.p, W = G.W, H = G.H;
    // steering
    let dir = s.dir;
    if (s.keyL && !s.keyR) dir = -1; else if (s.keyR && !s.keyL) dir = 1;
    const target = dir * 330;
    p.vx += (target - p.vx) * Math.min(1, dt * (dir ? 10 : 6));
    p.x += p.vx * dt;
    if (p.x < 0) p.x += W; else if (p.x >= W) p.x -= W;
    // vertical
    const oy = p.y;
    p.vy -= s.GRAV * dt; p.y += p.vy * dt;
    p.sq = Math.max(0, p.sq - dt * 3);
    p.spr = Math.max(0, p.spr - dt);
    // moving platforms
    for (const pl of s.plats) {
      if (pl.vx) { pl.x += pl.vx * dt; if (pl.x < pl.w / 2) { pl.x = pl.w / 2; pl.vx = -pl.vx; } else if (pl.x > W - pl.w / 2) { pl.x = W - pl.w / 2; pl.vx = -pl.vx; } }
      if (pl.broken) { pl.fall += dt; }
    }
    // landing
    if (p.vy < 0) {
      for (const pl of s.plats) {
        if (pl.broken) continue;
        if (oy >= pl.y - 1 && p.y <= pl.y) {
          let dx = Math.abs(p.x - pl.x); dx = Math.min(dx, W - dx);
          if (dx < pl.w / 2 + 14) {
            p.y = pl.y; p.sq = 1;
            const springHit = pl.spring && Math.abs(p.x - pl.x) < pl.w / 2 + 6;
            if (springHit) { p.vy = s.SPRING; p.spr = 1.2; pl.spring = 2; pl.sprT = 0.3; G.sfx("win"); }
            else { p.vy = s.JUMP; G.sfx("pop"); }
            if (pl.t === "c") { pl.broken = 1; for (let i = 0; i < 4; i++) s.bits.push({ x: pl.x + (i - 1.5) * pl.w / 4, y: pl.y, vx: (i - 1.5) * 40, vy: 60, r: (i - 1.5) * 0.3, t: 1 }); }
            break;
          }
        }
      }
    }
    // foes
    for (const f of s.foes) {
      if (f.dead) { f.dead += dt; f.y -= 300 * dt; continue; }
      if (f.k === "cat") { f.x = f.pl.x; f.y = f.pl.y + 18; if (f.pl.broken) f.dead = 0.01; }
      else { f.ph += dt * 3; f.x += f.vx * dt; if (f.x < 20 || f.x > W - 20) { f.vx = -f.vx; f.x = Math.max(20, Math.min(W - 20, f.x)); } }
      const cy = p.y + 20, fy = f.y + (f.k === "sq" ? Math.sin(f.ph) * 6 : 0);
      let dx = Math.abs(p.x - f.x); dx = Math.min(dx, W - dx);
      if (dx < 27 && Math.abs(cy - fy) < 30) {
        if (p.vy < 0 && p.y > fy - 6) {
          f.dead = 0.01; p.vy = s.JUMP * 1.1; p.sq = 1; s.bonus += 50; G.sfx("win");
          s.pops.push({ x: f.x, y: fy + 30, t: 0.9, txt: "+50" });
        } else {
          G.sfx("lose"); G.buzz(); p.face = ":dawgpain:";
          G.over(this.score(s), f.k === "cat" ? "Swatted by a cat!" : "Squirrel strike!");
          return;
        }
      }
    }
    // camera follows upward only
    s.maxY = Math.max(s.maxY, p.y);
    const want = p.y - H * 0.45;
    if (want > s.cam) s.cam = want;
    this.gen(G);
    // cleanup
    const lo = s.cam - 120;
    if (s.plats.length && s.plats[0].y < lo) s.plats = s.plats.filter(pl => pl.y >= lo && pl.fall < 1.5);
    if (s.foes.length) s.foes = s.foes.filter(f => f.y >= lo && f.dead < 1);
    for (const b of s.bits) { b.t -= dt; b.vy -= 900 * dt; b.x += b.vx * dt; b.y += b.vy * dt; }
    if (s.bits.length) s.bits = s.bits.filter(b => b.t > 0);
    for (const q of s.pops) q.t -= dt;
    if (s.pops.length) s.pops = s.pops.filter(q => q.t > 0);
    for (const pl of s.plats) if (pl.sprT) { pl.sprT -= dt; if (pl.sprT <= 0) { pl.sprT = 0; pl.spring = 1; } }
    p.face = p.spr > 0 ? ":dawgpog:" : p.vy < -900 ? ":dawgsweat:" : ":dawgW:";
    if (p.y < s.cam - 50) {
      p.face = ":dawgpain:"; G.sfx("lose"); G.buzz();
      const sc = this.score(s);
      G.over(sc, sc > 3000 ? "What a climb!" : sc > 1000 ? "Ruff landing." : "Don't look down!");
    }
  },
  score(s) { return Math.min(999999, Math.floor(s.maxY / 10) + s.bonus); },
  down(G, x) { const s = G.s; s.dir = x < G.W / 2 ? -1 : 1; s.ax = x; s.dragging = false; },
  move(G, x) {
    const s = G.s, d = x - s.ax;
    if (Math.abs(d) > 16) { s.dragging = true; s.dir = d > 0 ? 1 : -1; s.ax = x - Math.sign(d) * 16; }
  },
  up(G) { G.s.dir = 0; G.s.dragging = false; },
  onKey(G, k, isDown) {
    if (k === "ArrowLeft" || k === "a") G.s.keyL = isDown;
    if (k === "ArrowRight" || k === "d") G.s.keyR = isDown;
  },
  draw(G, c) {
    const s = G.s, W = G.W, H = G.H, dark = G.dark(), cam = s.cam || 0;
    const sy = wy => H - (wy - cam);
    // sky: gets darker / starrier the higher you go
    const k = Math.min(1, cam / 25000);
    const mix = (a, b, t) => `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * t)).join(",")})`;
    const top0 = dark ? [20, 26, 70] : [70, 160, 240], top1 = dark ? [3, 3, 14] : [18, 16, 60];
    const bot0 = dark ? [45, 52, 110] : [170, 225, 255], bot1 = dark ? [14, 12, 40] : [70, 50, 130];
    const gr = c.createLinearGradient(0, 0, 0, H);
    gr.addColorStop(0, mix(top0, top1, k)); gr.addColorStop(1, mix(bot0, bot1, k));
    c.fillStyle = gr; c.fillRect(0, 0, W, H);
    // stars
    const sa = dark ? 0.35 + k * 0.65 : Math.max(0, (k - 0.25) * 1.4);
    if (sa > 0) {
      c.fillStyle = "#fff";
      for (const st of s.stars) {
        const yy = ((st.y + cam * 0.15) % H + H) % H;
        c.globalAlpha = sa * (0.6 + 0.4 * Math.sin(G.t * 2 + st.tw));
        c.fillRect(st.x, yy, st.r, st.r);
      }
      c.globalAlpha = 1;
    }
    // clouds (fade out up high)
    const ca = (dark ? 0.18 : 0.85) * (1 - k * 0.8);
    if (ca > 0.02) {
      c.fillStyle = dark ? `rgba(180,190,230,${ca})` : `rgba(255,255,255,${ca})`;
      const span = H + 200;
      for (const cl of s.clouds) {
        const yy = ((cl.y + cam * 0.35) % span + span) % span - 100;
        c.fillRect(cl.x - cl.w / 2, yy, cl.w, 14); c.fillRect(cl.x - cl.w / 3, yy - 10, cl.w * 0.55, 12); c.fillRect(cl.x - cl.w / 2 + 8, yy + 14, cl.w - 16, 6);
      }
    }
    // platforms
    for (const pl of s.plats) {
      const x = pl.x - pl.w / 2, y = sy(pl.y);
      if (y < -40 || y > H + 40) continue;
      if (pl.broken) continue;
      if (pl.t === "c") { // cardboard box
        c.fillStyle = "#6b4a24"; c.fillRect(x, y, pl.w, 16);
        c.fillStyle = "#c99a5b"; c.fillRect(x + 2, y + 2, pl.w - 4, 12);
        c.fillStyle = "#e6c48c"; c.fillRect(x + 2, y + 2, pl.w - 4, 3);
        c.fillStyle = "#a07848"; c.fillRect(pl.x - 5, y + 2, 10, 12);
        c.fillStyle = "#6b4a24"; c.fillRect(x + 8, y + 9, 6, 1); c.fillRect(x + pl.w - 14, y + 7, 5, 1);
      } else if (pl.t === "m" || pl.style === 1) { // dog bed (moving ones are blue)
        const rim = pl.t === "m" ? "#2f6fd6" : "#d64a6b", cush = pl.t === "m" ? "#8fc0ff" : "#ffb3c6";
        c.fillStyle = "#222"; c.beginPath(); c.roundRect(x - 2, y - 2, pl.w + 4, 18, 9); c.fill();
        c.fillStyle = rim; c.beginPath(); c.roundRect(x, y, pl.w, 14, 7); c.fill();
        c.fillStyle = cush; c.fillRect(x + 7, y + 2, pl.w - 14, 6);
        if (pl.t === "m") { c.fillStyle = "#fff"; c.fillRect(x + 3, y + 5, 3, 3); c.fillRect(x + pl.w - 6, y + 5, 3, 3); }
      } else { // wooden plank
        c.fillStyle = "#4a2c12"; c.fillRect(x - 1, y - 1, pl.w + 2, 15);
        c.fillStyle = "#b9773a"; c.fillRect(x + 1, y + 1, pl.w - 2, 11);
        c.fillStyle = "#d8995a"; c.fillRect(x + 1, y + 1, pl.w - 2, 3);
        c.fillStyle = "#7a4a1e"; c.fillRect(x + pl.w * 0.33, y + 5, 2, 7); c.fillRect(x + pl.w * 0.66, y + 5, 2, 7); c.fillRect(x + 4, y + 6, 3, 3);
      }
      if (pl.spring) {
        const pr = pl.spring === 2 ? 0.75 : 1;
        c.save(); c.translate(pl.x, y - 8 * pr); c.scale(1, pr); G.emoji(c, "🦴", 0, 0, 24); c.restore();
      }
    }
    // breaking box bits
    c.fillStyle = "#c99a5b";
    for (const b of s.bits) { c.globalAlpha = Math.max(0, b.t); c.save(); c.translate(b.x, sy(b.y)); c.rotate(b.r * (1 - b.t) * 4); c.fillRect(-8, 0, 16, 12); c.restore(); }
    c.globalAlpha = 1;
    // foes
    for (const f of s.foes) {
      const yy = sy(f.y + (f.k === "sq" && !f.dead ? Math.sin(f.ph) * 6 : 0));
      if (yy < -40 || yy > H + 40) continue;
      if (f.dead) c.globalAlpha = Math.max(0, 1 - f.dead);
      if (f.k === "cat") G.emoji(c, "🐈", f.x, yy, 34);
      else { G.emoji(c, "🐿️", f.x, yy, 32); if (!f.dead) { c.fillStyle = "rgba(170,110,60,0.8)"; const fl = Math.sin(f.ph * 3) * 3; c.fillRect(f.x - 22, yy - 2 + fl, 10, 4); c.fillRect(f.x + 12, yy - 2 - fl, 10, 4); } }
      if (f.dead) { G.emoji(c, "💫", f.x, yy - 20, 18); c.globalAlpha = 1; }
    }
    // the pup (squash on landing, drawn twice near the edges for wrap)
    const p = s.p;
    if (p) {
      const size = 46, py = sy(p.y) - size / 2 + 4, q = p.sq * p.sq * 0.28;
      const drawDog = x => { c.save(); c.translate(x, py + q * size * 0.5); c.scale(1 + q, 1 - q); G.img(c, p.face, 0, 0, size, p.vx * 0.0006); c.restore(); };
      drawDog(p.x);
      if (p.x < size / 2) drawDog(p.x + W); else if (p.x > W - size / 2) drawDog(p.x - W);
      if (p.spr > 0.6) G.emoji(c, "✨", p.x + 20, py + 26, 16);
    }
    for (const q of s.pops) G.text(c, q.txt, q.x, sy(q.y) - (0.9 - q.t) * 40, 12, "#ffd23f");
    // touch hint arrows (subtle)
    if (G.state === "play" && G.t < 4) {
      c.globalAlpha = 0.5 * Math.min(1, 4 - G.t);
      G.text(c, "◀ HOLD", 14, H - 22, 10, "#fff", "left"); G.text(c, "HOLD ▶", W - 14, H - 22, 10, "#fff", "right");
      c.globalAlpha = 1;
    } else if (s.dir && G.state === "play") { c.fillStyle = "rgba(255,255,255,0.05)"; c.fillRect(s.dir < 0 ? 0 : W / 2, 30, W / 2, H - 30); }
    // HUD
    c.fillStyle = "rgba(0,0,0,0.35)"; c.fillRect(0, 0, W, 30);
    G.text(c, `SCORE ${this.score(s)}`, 10, 15, 11, "#fff", "left");
    G.text(c, `${Math.floor((s.maxY || 0) / 10)}m`, W - 10, 15, 11, "#ffd23f", "right");
  }
});
