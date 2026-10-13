// ---------- Mow Dawg (top-down lawn mowing) ----------
// Drag anywhere: the mower steers toward your finger and keeps rolling straight when you let go.
// Mow 85% of each yard before the clock runs out. Avoid flower beds, the gnome, the sprinkler and the cat.
(function () {
  const OY = 58, CUT = 18, MR = 14, SPEED = 165, TURN = 3.6, LAST = 10;
  const FLOWERS = ["🌷", "🌻", "🌼", "🌸"];
  const rnd = (a, b) => a + Math.random() * (b - a);
  function cfg(lv) {
    const k = (lv - 1) % 5, loop = Math.floor((lv - 1) / 5);
    return {
      k, loop,
      ts: Math.max(14, [22, 20, 19, 18, 17][k] - loop * 2),
      trees: [1, 1, 2, 2, 3][k] + loop,
      beds: [1, 2, 2, 3, 3][k] + loop,
      gnomes: [0, 1, 1, 2, 2][k] + loop,
      sprinklers: [0, 0, 1, 1, 2][k],
      cats: [0, 0, 0, 1, 1][k] + loop,
      items: [2, 2, 3, 3, 4][k],
      factor: [2.2, 2.1, 2.0, 1.9, 1.85][k] - loop * 0.15,
      catSpeed: 55 + k * 6 + loop * 25
    };
  }
  const PAL = {
    light: { tall: ["#3e8a2c", "#428f2f"], blade: "#2c6b1f", tip: "#5fae42", m: ["#a2de7c", "#76bb52", "#acE486", "#7dc059"], line: "rgba(255,255,255,0.18)", soil: "#7a4e2b", soil2: "#62391c", edge: "#2d5a1f" },
    dark: { tall: ["#1d4a17", "#20501a"], blade: "#123510", tip: "#2f6e25", m: ["#4f8f3c", "#3d7a2e", "#559842", "#437f33"], line: "rgba(255,255,255,0.10)", soil: "#4e321c", soil2: "#3c2414", edge: "#132a0e" }
  };

  function drawTile(s, i) {
    const cx = s.cx, P = s.dk ? PAL.dark : PAL.light, ts = s.ts;
    const col = i % s.cols, row = (i / s.cols) | 0;
    const x0 = Math.floor(col * ts), x1 = Math.floor((col + 1) * ts), y0 = Math.floor(row * ts), y1 = Math.floor((row + 1) * ts);
    const w = x1 - x0, h = y1 - y0, v = s.g[i], hs = s.hash[i];
    if (v === 0) {
      cx.fillStyle = P.tall[hs & 1]; cx.fillRect(x0, y0, w, h);
      cx.lineWidth = 2; cx.lineCap = "round";
      for (let b = 0; b < 3; b++) {
        const bx = x0 + w * (0.2 + 0.3 * b) + ((hs >> (b + 1)) & 3) - 1.5, lean = (((hs >> (b * 2)) & 3) - 1.5) * 1.6;
        cx.strokeStyle = b === 1 ? P.tip : P.blade;
        cx.beginPath(); cx.moveTo(bx, y1 - 1); cx.lineTo(bx + lean, y0 + 2 + ((hs >> b) & 3)); cx.stroke();
      }
    } else if (v >= 1 && v <= 4) {
      cx.fillStyle = P.m[v - 1]; cx.fillRect(x0, y0, w, h);
      cx.fillStyle = P.line;
      if (v <= 2) cx.fillRect(x0, y0 + (h >> 1), w, 1); else cx.fillRect(x0 + (w >> 1), y0, 1, h);
    } else if (v === 9) {
      cx.fillStyle = P.edge; cx.fillRect(x0, y0, w, h);
    } else {
      cx.fillStyle = (row + col) & 1 ? P.soil : P.soil2; cx.fillRect(x0, y0, w, h);
      if (v === 10) G.emoji(cx, FLOWERS[hs & 3], x0 + w / 2, y0 + h / 2 + 1, ts * 0.8);
      else { cx.fillStyle = "#c06a9a"; cx.fillRect(x0 + w * 0.3, y0 + h * 0.5, 3, 2); cx.fillStyle = "#5a8a3a"; cx.fillRect(x0 + w * 0.55, y0 + h * 0.35, 3, 2); }
    }
  }
  function drawAll(G) {
    const s = G.s; s.dk = G.dark();
    s.cx.setTransform(G.dpr, 0, 0, G.dpr, 0, 0);
    for (let i = 0; i < s.g.length; i++) drawTile(s, i);
  }

  function build(G, lv) {
    const s = G.s, c = cfg(lv), W = G.W, H = G.H;
    const cols = Math.max(10, Math.round(W / c.ts)), ts = W / cols, rows = Math.max(10, Math.floor((H - OY - 4) / ts));
    s.lv = lv; s.c = c; s.ts = ts; s.cols = cols; s.rows = rows; s.yh = rows * ts;
    s.g = new Uint8Array(cols * rows); s.hash = new Uint8Array(cols * rows);
    for (let i = 0; i < s.hash.length; i++) s.hash[i] = (Math.random() * 256) | 0;
    const Y1 = OY + s.yh;
    // the house sits along the top edge
    const hw = Math.round(cols * rnd(0.42, 0.6)), hh = 2 + (c.k >= 2 ? 1 : 0), left = Math.random() < 0.5;
    s.house = { x: left ? 0 : (cols - hw) * ts, y: OY, w: hw * ts, h: hh * ts, left };
    for (let r = 0; r < hh; r++) for (let q = 0; q < hw; q++) s.g[r * cols + (left ? q : cols - hw + q)] = 9;
    const start = { x: W / 2, y: Y1 - 26 };
    const taken = [{ x: start.x, y: start.y, r: 50 }];
    const free = (x, y, r) => {
      if (x - r < 4 || x + r > W - 4 || y - r < OY + 4 || y + r > Y1 - 4) return false;
      const hz = s.house; if (x + r > hz.x - 8 && x - r < hz.x + hz.w + 8 && y - r < hz.y + hz.h + 8) return false;
      for (const t of taken) if (Math.hypot(t.x - x, t.y - y) < t.r + r + 16) return false;
      return true;
    };
    const place = r => { for (let n = 0; n < 300; n++) { const x = rnd(r + 6, W - r - 6), y = rnd(OY + r + 6, Y1 - r - 6); if (free(x, y, r)) { taken.push({ x, y, r }); return { x, y }; } } return null; };
    const blockCircle = (x, y, r) => {
      for (let i = 0; i < s.g.length; i++) { const tx = (i % cols + 0.5) * ts, ty = OY + (((i / cols) | 0) + 0.5) * ts; if (Math.hypot(tx - x, ty - y) < r) s.g[i] = 9; }
    };
    s.obs = []; s.trees = []; s.gnomes = []; s.sprs = []; s.cats = []; s.items = [];
    // flower beds (rectangles of tiles)
    for (let b = 0; b < c.beds; b++) {
      const bw = 2 + ((Math.random() * 3) | 0), bh = 1 + ((Math.random() * 2) | 0);
      const r = Math.hypot(bw, bh) * ts / 2;
      const p = place(r); if (!p) continue;
      const c0 = Math.max(0, Math.min(cols - bw, Math.round(p.x / ts - bw / 2))), r0 = Math.max(0, Math.min(rows - bh, Math.round((p.y - OY) / ts - bh / 2)));
      for (let rr = 0; rr < bh; rr++) for (let q = 0; q < bw; q++) s.g[(r0 + rr) * cols + c0 + q] = 10;
    }
    for (let n = 0; n < c.trees; n++) { const r = 18, p = place(r + 10); if (!p) continue; s.trees.push({ x: p.x, y: p.y, r }); s.obs.push({ x: p.x, y: p.y, r, kind: "tree" }); blockCircle(p.x, p.y, r); }
    for (let n = 0; n < c.gnomes; n++) { const r = 10, p = place(r); if (!p) continue; s.gnomes.push({ x: p.x, y: p.y }); s.obs.push({ x: p.x, y: p.y, r, kind: "gnome" }); blockCircle(p.x, p.y, r); }
    for (let n = 0; n < c.sprinklers; n++) { const r = 7, p = place(30); if (!p) continue; s.sprs.push({ x: p.x, y: p.y, base: rnd(0, 6.28), ph: rnd(0, 6.28), sp: rnd(0.9, 1.3) }); s.obs.push({ x: p.x, y: p.y, r, kind: "spr" }); blockCircle(p.x, p.y, r); }
    for (let n = 0; n < c.cats; n++) { const p = place(14); if (!p) continue; s.cats.push({ x: p.x, y: p.y, st: "sleep", t: 0, tx: p.x, ty: p.y, fast: 0, face: 1 }); }
    const goodies = [["⚾", 50], ["🦴", 100]];
    for (let n = 0; n < c.items; n++) { const p = place(10); if (!p) continue; const g = goodies[n % 2]; s.items.push({ x: p.x, y: p.y, e: g[0], v: g[1], got: false, bob: rnd(0, 6) }); }
    s.total = 0; for (let i = 0; i < s.g.length; i++) if (s.g[i] === 0) s.total++;
    s.mowed = 0; s.pct = 0; s.flowersHit = 0;
    s.time = Math.max(25, Math.round(s.total * ts * ts / (2 * CUT * SPEED) * c.factor)); s.T0 = s.time;
    s.m = { x: start.x, y: start.y, a: -Math.PI / 2, v: 0, stun: 0, go: false, wet: 0, bonk: 0 };
    s.hold = false; s.kl = s.kr = false;
    s.cv = document.createElement("canvas");
    s.cv.width = Math.max(1, Math.ceil(W * G.dpr)); s.cv.height = Math.max(1, Math.ceil(s.yh * G.dpr));
    s.cx = s.cv.getContext("2d");
    drawAll(G);
    s.phase = "intro"; s.pt = 1.5; s.yardScore = 0;
  }

  function addParticle(s, x, y, vx, vy, col) {
    const p = s.parts[s.pi]; s.pi = (s.pi + 1) % s.parts.length;
    p.x = x; p.y = y; p.vx = vx; p.vy = vy; p.t = 0.5; p.c = col;
  }
  function pop(s, x, y, txt, col, emo) { if (s.pops.length < 20) s.pops.push({ x, y, t: 0.9, txt, c: col, e: emo }); }

  function finishYard(G) {
    const s = G.s; if (s.phase !== "play") return;
    const perfect = s.mowed >= s.total;
    const tb = Math.max(0, Math.ceil(s.time)) * 10, pb = perfect ? 500 : 0;
    s.score += tb + pb;
    s.res = { pct: Math.floor(s.pct * 100), tb, pb, flowers: s.flowersHit };
    s.phase = "clear"; s.pt = 2.8; s.m.v = 0; s.hold = false;
    G.sfx("win");
  }
  function nextYard(G) {
    const s = G.s;
    if (s.lv >= LAST) { G.over(Math.min(99999, s.score), "Lawn legend!"); return; }
    build(G, s.lv + 1);
  }

  function collide(G, m) {
    const s = G.s, W = G.W, Y1 = OY + s.yh;
    m.x = Math.max(MR, Math.min(W - MR, m.x)); m.y = Math.max(OY + MR, Math.min(Y1 - MR, m.y));
    const h = s.house;
    if (m.x > h.x - MR && m.x < h.x + h.w + MR && m.y < h.y + h.h + MR) {
      const dB = h.y + h.h + MR - m.y, dL = m.x - (h.x - MR), dR = h.x + h.w + MR - m.x;
      const dl = h.x <= 0 ? 1e9 : dL, dr = h.x + h.w >= W - 1 ? 1e9 : dR;
      if (dB <= dl && dB <= dr) m.y += dB; else if (dl < dr) m.x -= dl; else m.x += dr;
    }
    for (const o of s.obs) {
      const dx = m.x - o.x, dy = m.y - o.y, d = Math.hypot(dx, dy), rr = o.r + MR;
      if (d < rr && d > 0.01) {
        m.x = o.x + dx / d * rr; m.y = o.y + dy / d * rr;
        if (o.kind === "gnome" && m.bonk <= 0 && m.v > 100) { m.bonk = 0.8; pop(s, o.x, o.y - 20, "BONK", "#fff"); }
      }
    }
  }

  function mowAt(G, m) {
    const s = G.s, ts = s.ts, cols = s.cols;
    const R = CUT + ts * 0.22;
    const c0 = Math.max(0, Math.floor((m.x - R) / ts)), c1 = Math.min(cols - 1, Math.floor((m.x + R) / ts));
    const r0 = Math.max(0, Math.floor((m.y - OY - R) / ts)), r1 = Math.min(s.rows - 1, Math.floor((m.y - OY + R) / ts));
    const ca = Math.cos(m.a), sa = Math.sin(m.a);
    const dir = Math.abs(ca) > Math.abs(sa) ? (ca > 0 ? 1 : 2) : (sa > 0 ? 3 : 4);
    let fresh = 0;
    for (let r = r0; r <= r1; r++) for (let q = c0; q <= c1; q++) {
      const i = r * cols + q, v = s.g[i]; if (v === 9 || v === 11) continue;
      const tx = (q + 0.5) * ts, ty = OY + (r + 0.5) * ts, d = Math.hypot(tx - m.x, ty - m.y);
      if (v === 10) {
        if (d < CUT * 0.55) {
          s.g[i] = 11; drawTile(s, i); s.flowersHit++;
          s.score = Math.max(0, s.score - 15); pop(s, tx, ty - 8, "-15", "#ff6b6b", "💐");
          for (let n = 0; n < 5; n++) addParticle(s, tx, ty, rnd(-80, 80), rnd(-80, 80), n & 1 ? "#ff7eb6" : "#ffd23f");
          G.buzz(); if (s.sfxCD <= 0) { G.sfx("lose"); s.sfxCD = 0.5; }
        }
        continue;
      }
      if (d > R) continue;
      if (v === 0) { s.mowed++; s.score++; fresh++; s.g[i] = dir; drawTile(s, i); }
      else if (v !== dir && m.v > 60) { s.g[i] = dir; drawTile(s, i); }
    }
    if (fresh) {
      const P = s.dk ? PAL.dark : PAL.light;
      for (let n = 0; n < Math.min(4, fresh * 2); n++) {
        const side = n & 1 ? 1 : -1, sp = rnd(40, 110);
        addParticle(s, m.x - ca * 6 + rnd(-6, 6), m.y - sa * 6 + rnd(-6, 6), -sa * side * sp - ca * 40, ca * side * sp - sa * 40, n % 3 ? P.tip : P.m[0]);
      }
    }
  }

  function drawMower(G, c, m) {
    c.save(); c.translate(m.x, m.y); c.rotate(m.a + (m.stun > 0 ? Math.sin(G.t * 40) * 0.2 : 0));
    // shadow
    c.fillStyle = "rgba(0,0,0,0.25)"; c.beginPath(); c.ellipse(2, 3, 20, 16, 0, 0, 7); c.fill();
    // wheels
    c.fillStyle = "#222";
    c.fillRect(-16, -17, 10, 6); c.fillRect(-16, 11, 10, 6); c.fillRect(8, -15, 7, 5); c.fillRect(8, 10, 7, 5);
    // deck (front) with spinning blade
    c.fillStyle = "#9aa3ad"; c.beginPath(); c.arc(9, 0, 13, 0, 7); c.fill();
    c.strokeStyle = "#5d6670"; c.lineWidth = 2; c.stroke();
    const ba = G.t * 30;
    c.strokeStyle = "#dfe6ec"; c.beginPath(); c.moveTo(9 + Math.cos(ba) * 9, Math.sin(ba) * 9); c.lineTo(9 - Math.cos(ba) * 9, -Math.sin(ba) * 9); c.stroke();
    // body
    c.fillStyle = "#e23b3b"; c.beginPath(); c.roundRect ? c.roundRect(-17, -11, 22, 22, 5) : c.rect(-17, -11, 22, 22); c.fill();
    c.fillStyle = "#b02626"; c.fillRect(-17, -11, 4, 22);
    // steering wheel nub
    c.fillStyle = "#333"; c.fillRect(2, -5, 3, 10);
    c.restore();
    const face = m.stun > 0 ? ":dawgsweat:" : m.wet > 0 ? ":dawgcope:" : G.s.phase === "clear" ? ":dawgpog:" : ":dawgW:";
    G.img(c, face, m.x - Math.cos(m.a) * 5, m.y - Math.sin(m.a) * 5 - 2, 26);
  }

  function drawGnome(c, x, y) {
    c.fillStyle = "rgba(0,0,0,0.25)"; c.beginPath(); c.ellipse(x + 2, y + 3, 10, 8, 0, 0, 7); c.fill();
    c.fillStyle = "#2f6fd6"; c.beginPath(); c.arc(x, y + 2, 9, 0, 7); c.fill();
    c.fillStyle = "#fff"; c.beginPath(); c.arc(x, y + 4, 6, 0, Math.PI); c.fill();
    c.fillStyle = "#f2c9a0"; c.beginPath(); c.arc(x, y - 1, 4, 0, 7); c.fill();
    c.fillStyle = "#e23b3b"; c.beginPath(); c.moveTo(x - 7, y - 3); c.lineTo(x + 7, y - 3); c.lineTo(x + 2, y - 17); c.closePath(); c.fill();
  }

  function drawHouse(G, c, h) {
    const dark = G.dark();
    // roof (top-down): shingles with a ridge
    c.fillStyle = dark ? "#5b3a3a" : "#a8503f"; c.fillRect(h.x, h.y, h.w, h.h - 6);
    c.fillStyle = dark ? "#4a2f2f" : "#8f4033";
    for (let yy = h.y + 6; yy < h.y + h.h - 8; yy += 8) for (let xx = h.x + ((yy / 8) & 1 ? 0 : 7); xx < h.x + h.w; xx += 14) c.fillRect(xx, yy, 12, 2);
    c.fillStyle = dark ? "#7a5050" : "#c76b58"; c.fillRect(h.x, h.y + (h.h - 6) / 2 - 2, h.w, 4);
    // gutter / wall edge
    c.fillStyle = dark ? "#bfb7a6" : "#f4ead2"; c.fillRect(h.x, h.y + h.h - 6, h.w, 6);
    c.fillStyle = "rgba(0,0,0,0.25)"; c.fillRect(h.x, h.y + h.h, h.w, 3);
    G.emoji(c, "🏠", h.left ? h.x + h.w - 16 : h.x + 16, h.y + 14, 16);
  }

  defGame({
    key: "mow", name: "Mow Dawg", icon: "🌱", max: 99999,
    blurb: "Mow the lawn. Miss the flowers.",
    how: "Hold and drag anywhere: the mower drives toward your finger. Let go and it keeps rolling straight; hold right on it to park. Mow 85% of each yard before time runs out. Don't mow the flower beds (-15), dodge the gnome, sprinkler and cat. Grab ⚾ and 🦴 for bonus points. Tap DONE once you pass 85% to bank 10 pts per second left. A perfect 100% yard = +500.",
    reset(G) {
      G.s = { score: 0, parts: [], pi: 0, pops: [], sfxCD: 0, pctMark: 0 };
      for (let i = 0; i < 70; i++) G.s.parts.push({ x: 0, y: 0, vx: 0, vy: 0, t: 0, c: "#fff" });
      build(G, 1);
    },
    update(G, dt) {
      const s = G.s, m = s.m;
      if (s.dk !== G.dark()) drawAll(G);
      for (const p of s.parts) if (p.t > 0) { p.t -= dt; p.x += p.vx * dt; p.y += p.vy * dt; p.vx *= 0.92; p.vy *= 0.92; }
      for (const p of s.pops) p.t -= dt;
      if (s.pops.length && s.pops[0].t <= 0) s.pops = s.pops.filter(p => p.t > 0);
      s.sfxCD -= dt;
      if (s.phase === "intro") { s.pt -= dt; if (s.pt <= 0) s.phase = "play"; return; }
      if (s.phase === "clear") { s.pt -= dt; if (s.pt <= 0) nextYard(G); return; }
      s.time -= dt;
      // steering
      m.bonk -= dt; m.wet = Math.max(0, m.wet - dt);
      let target = m.go ? SPEED : 0;
      if (m.stun > 0) { m.stun -= dt; target = 0; m.v = Math.min(m.v, 30); }
      else {
        if (s.hold) {
          const dx = s.fx - m.x, dy = s.fy - m.y, d = Math.hypot(dx, dy);
          if (d > 24) {
            let da = Math.atan2(dy, dx) - m.a; da = Math.atan2(Math.sin(da), Math.cos(da));
            const tr = TURN * dt; m.a += Math.max(-tr, Math.min(tr, da)); m.go = true; target = SPEED;
            if (Math.abs(da) > 2.2) target = SPEED * 0.6; // tight u-turn: ease off a bit
          } else { m.go = false; target = 0; }
        }
        if (s.kl) m.a -= TURN * dt;
        if (s.kr) m.a += TURN * dt;
      }
      // sprinklers: slow you down and push your heading along the spray
      for (const sp of s.sprs) {
        sp.ang = sp.base + Math.sin(G.t * sp.sp + sp.ph) * 1.2;
        const dx = m.x - sp.x, dy = m.y - sp.y, d = Math.hypot(dx, dy);
        if (d < 100 && d > 4) {
          let da = Math.atan2(dy, dx) - sp.ang; da = Math.atan2(Math.sin(da), Math.cos(da));
          if (Math.abs(da) < 0.3) {
            if (m.wet <= 0) pop(s, m.x, m.y - 24, "", "#fff", "💦");
            m.wet = 0.4; let ta = sp.ang - m.a; ta = Math.atan2(Math.sin(ta), Math.cos(ta)); m.a += Math.sign(ta) * Math.min(Math.abs(ta), 1.4 * dt);
          }
        }
      }
      if (m.wet > 0) target *= 0.45;
      m.v += Math.max(-600 * dt, Math.min(500 * dt, target - m.v));
      m.x += Math.cos(m.a) * m.v * dt; m.y += Math.sin(m.a) * m.v * dt;
      collide(G, m);
      if (m.v > 10) mowAt(G, m);
      // items in the grass
      for (const it of s.items) if (!it.got && Math.hypot(it.x - m.x, it.y - m.y) < MR + 12) {
        it.got = true; s.score += it.v; pop(s, it.x, it.y - 10, "+" + it.v, "#ffd23f", it.e); G.sfx("pop");
      }
      // cats nap until the mower gets close, then wander
      const Y1 = OY + s.yh, h = s.house;
      for (const ct of s.cats) {
        const dm = Math.hypot(ct.x - m.x, ct.y - m.y);
        if (ct.st === "sleep") { if (dm < 80) { ct.st = "run"; ct.t = rnd(4, 7); ct.tx = ct.x; ct.ty = ct.y; pop(s, ct.x, ct.y - 18, "", "#fff", "❗"); } }
        else {
          ct.t -= dt; ct.fast = Math.max(0, ct.fast - dt);
          if (Math.hypot(ct.tx - ct.x, ct.ty - ct.y) < 6) { ct.tx = rnd(20, G.W - 20); ct.ty = rnd(h.y + h.h + 20, Y1 - 20); }
          const dx = ct.tx - ct.x, dy = ct.ty - ct.y, d = Math.hypot(dx, dy) || 1, sp = s.c.catSpeed * (ct.fast > 0 ? 2.2 : 1);
          ct.x += dx / d * sp * dt; ct.y += dy / d * sp * dt; if (Math.abs(dx) > 2) ct.face = dx > 0 ? -1 : 1;
          if (ct.t <= 0 && dm > 90) ct.st = "sleep";
        }
        if (dm < MR + 12 && m.stun <= 0) {
          m.stun = 0.6; s.score = Math.max(0, s.score - 20);
          const dx = m.x - ct.x, dy = m.y - ct.y, d = Math.hypot(dx, dy) || 1;
          m.x += dx / d * 12; m.y += dy / d * 12; collide(G, m);
          ct.st = "run"; ct.t = Math.max(ct.t, 3); ct.fast = 1.2; ct.tx = Math.max(20, Math.min(G.W - 20, ct.x - dx / d * 140)); ct.ty = Math.max(h.y + h.h + 20, Math.min(Y1 - 20, ct.y - dy / d * 140));
          pop(s, ct.x, ct.y - 20, "-20", "#ff6b6b", "🙀"); G.buzz();
        }
      }
      s.pct = s.total ? s.mowed / s.total : 1;
      const mark = Math.floor(s.pct * 4);
      if (mark > s.pctMark && s.pct < 1) { s.pctMark = mark; if (s.pct >= 0.85 || mark >= 2) G.sfx("pop"); }
      if (s.mowed >= s.total) { finishYard(G); return; }
      if (s.time <= 0) {
        s.time = 0;
        if (s.pct >= 0.85) finishYard(G);
        else G.over(Math.min(99999, s.score), `Still shaggy! (${Math.floor(s.pct * 100)}%)`);
      }
    },
    down(G, x, y) {
      const s = G.s;
      if (s.phase === "clear") { if (s.pt < 2.2) s.pt = 0; return; }
      if (y < OY) {
        if (s.phase === "play" && s.pct >= 0.85 && x > G.W - 96) finishYard(G);
        return;
      }
      s.hold = true; s.fx = x; s.fy = y;
    },
    move(G, x, y) { const s = G.s; if (s.hold) { s.fx = x; s.fy = Math.max(OY, y); } },
    up(G) { G.s.hold = false; },
    onKey(G, k, d) {
      const s = G.s;
      if (k === "ArrowLeft" || k === "a") s.kl = d;
      else if (k === "ArrowRight" || k === "d") s.kr = d;
      else if ((k === "ArrowUp" || k === "w") && d) s.m.go = true;
      else if ((k === "ArrowDown" || k === "s") && d) s.m.go = false;
      else if (k === " " && d) { if (s.phase === "play" && s.pct >= 0.85) finishYard(G); else if (s.phase === "clear") s.pt = 0; }
    },
    draw(G, c) {
      const s = G.s, W = G.W, H = G.H, dark = G.dark();
      if (!s.cv) return;
      if (s.dk !== dark) drawAll(G);
      const Y1 = OY + s.yh;
      c.fillStyle = dark ? "#0f220c" : "#2f6b22"; c.fillRect(0, 0, W, H);
      c.drawImage(s.cv, 0, OY, W, s.yh);
      // hedge strip below the yard
      c.fillStyle = dark ? "#163312" : "#2a5e1e";
      for (let x = 0; x < W; x += 14) { c.beginPath(); c.arc(x + 7, Y1 + 6, 8, 0, 7); c.fill(); }
      // items peeking out of the grass
      for (const it of s.items) if (!it.got) G.emoji(c, it.e, it.x, it.y + Math.sin(G.t * 3 + it.bob) * 1.5, 18);
      // sprinkler spray
      for (const sp of s.sprs) {
        const a = sp.ang == null ? sp.base : sp.ang;
        c.fillStyle = dark ? "rgba(120,180,255,0.16)" : "rgba(170,215,255,0.35)";
        c.beginPath(); c.moveTo(sp.x, sp.y); c.arc(sp.x, sp.y, 100, a - 0.3, a + 0.3); c.closePath(); c.fill();
        c.fillStyle = dark ? "#8cc4ff" : "#4aa3ff";
        for (let n = 0; n < 9; n++) {
          const d = ((G.t * 140 + n * 11) % 100), aa = a + Math.sin(n * 2.3) * 0.22;
          c.fillRect(sp.x + Math.cos(aa) * d - 1.5, sp.y + Math.sin(aa) * d - 1.5, 3, 3);
        }
        c.fillStyle = "#555"; c.beginPath(); c.arc(sp.x, sp.y, 6, 0, 7); c.fill();
        c.fillStyle = "#ffd23f"; c.beginPath(); c.arc(sp.x, sp.y, 3, 0, 7); c.fill();
      }
      for (const g of s.gnomes) drawGnome(c, g.x, g.y);
      // tree trunks + canopies
      for (const t of s.trees) {
        c.fillStyle = "rgba(0,0,0,0.25)"; c.beginPath(); c.arc(t.x + 4, t.y + 5, t.r + 6, 0, 7); c.fill();
        c.fillStyle = dark ? "#1e5a1a" : "#2e8a2a"; c.beginPath(); c.arc(t.x, t.y, t.r + 6, 0, 7); c.fill();
        c.fillStyle = dark ? "#287022" : "#43a83a";
        c.beginPath(); c.arc(t.x - 6, t.y - 6, t.r * 0.6, 0, 7); c.fill(); c.beginPath(); c.arc(t.x + 7, t.y - 2, t.r * 0.5, 0, 7); c.fill(); c.beginPath(); c.arc(t.x - 1, t.y + 8, t.r * 0.5, 0, 7); c.fill();
        c.fillStyle = dark ? "#3a8a30" : "#6cc95a"; c.beginPath(); c.arc(t.x - 8, t.y - 9, 4, 0, 7); c.fill();
      }
      drawHouse(G, c, s.house);
      // cats
      for (const ct of s.cats) {
        if (ct.st === "sleep") {
          c.fillStyle = "rgba(0,0,0,0.2)"; c.beginPath(); c.ellipse(ct.x + 2, ct.y + 8, 13, 5, 0, 0, 7); c.fill();
          G.emoji(c, "🐈", ct.x, ct.y, 24); G.emoji(c, "💤", ct.x + 12, ct.y - 14 + Math.sin(G.t * 2) * 2, 13);
        } else {
          c.save(); c.translate(ct.x, ct.y); c.scale(ct.face, 1); G.emoji(c, "🐈", 0, Math.sin(G.t * 18) * 1.5, 26); c.restore();
        }
      }
      // grass clippings
      for (const p of s.parts) if (p.t > 0) { c.globalAlpha = Math.min(1, p.t * 3); c.fillStyle = p.c; c.fillRect(p.x - 1.5, p.y - 1.5, 3, 3); }
      c.globalAlpha = 1;
      drawMower(G, c, s.m);
      for (const p of s.pops) {
        const yy = p.y - (0.9 - p.t) * 30;
        if (p.e) G.emoji(c, p.e, p.x, yy, 20 + (0.9 - p.t) * 10);
        if (p.txt) G.text(c, p.txt, p.x, yy - 16, 10, p.c);
      }
      // HUD
      c.fillStyle = "rgba(0,0,0,0.55)"; c.fillRect(0, 0, W, OY);
      G.text(c, `YARD ${s.lv}`, 10, 14, 10, "#9ef08a", "left");
      G.text(c, `SCORE ${s.score}`, W / 2, 14, 10, "#fff");
      const tl = Math.max(0, Math.ceil(s.time));
      G.text(c, `${tl}s`, W - 10, 14, 11, tl <= 10 && s.phase === "play" ? "#ff6b6b" : "#ffd23f", "right");
      const bx = 10, by = 28, bw = W - 116, bh = 20, ok = s.pct >= 0.85;
      c.fillStyle = "#1a1a1a"; c.fillRect(bx, by, bw, bh);
      c.fillStyle = ok ? "#5fd35a" : "#3fa0e0"; c.fillRect(bx, by, bw * Math.min(1, s.pct), bh);
      c.fillStyle = "#fff"; c.fillRect(bx + bw * 0.85 - 1, by - 2, 2, bh + 4);
      G.text(c, `${Math.floor(s.pct * 100)}%`, bx + bw * 0.42, by + bh / 2 + 1, 10, "#fff");
      const dx = W - 96;
      c.fillStyle = ok && s.phase === "play" ? (Math.sin(G.t * 6) > 0 ? "#ffd23f" : "#ffbf1f") : "#444";
      c.fillRect(dx, 24, 86, 28);
      G.text(c, "DONE", dx + 43, 39, 10, ok && s.phase === "play" ? "#3b2414" : "#888");
      // overlays
      if (s.phase === "intro") {
        c.fillStyle = "rgba(0,0,0,0.5)"; c.fillRect(0, H * 0.36, W, 96);
        G.text(c, `YARD ${s.lv}`, W / 2, H * 0.36 + 26, 18, "#ffd23f");
        G.text(c, `MOW 85% IN ${s.T0}s`, W / 2, H * 0.36 + 54, 10, "#fff");
        G.text(c, s.lv === 1 ? "DRAG TO STEER" : s.c.loop ? "FASTER CATS!" : "WATCH THE FLOWERS", W / 2, H * 0.36 + 76, 9, "#9ef08a");
      } else if (s.phase === "clear" && s.res) {
        c.fillStyle = "rgba(0,0,0,0.6)"; c.fillRect(0, H * 0.3, W, 150);
        G.text(c, s.res.pb ? "PERFECT YARD!" : "YARD CLEAR!", W / 2, H * 0.3 + 26, 16, "#ffd23f");
        G.text(c, `MOWED ${s.res.pct}%`, W / 2, H * 0.3 + 56, 10, "#fff");
        G.text(c, `TIME BONUS +${s.res.tb}`, W / 2, H * 0.3 + 76, 10, "#9ef08a");
        if (s.res.pb) G.text(c, "PERFECT +500", W / 2, H * 0.3 + 96, 10, "#ffd23f");
        if (s.res.flowers) G.text(c, `FLOWERS MOWED ${s.res.flowers}`, W / 2, H * 0.3 + 116, 9, "#ff9a9a");
        G.text(c, s.lv >= LAST ? "LAST YARD!" : "TAP FOR NEXT YARD", W / 2, H * 0.3 + 136, 8, "#ccc");
      }
    }
  });
})();
