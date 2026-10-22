// ---------- Harvest Dawg (giant combine, clear the field) ----------
// Hold and drag: the combine steers toward your finger. Its wide header cuts everything it rolls over.
(function () {
  const CELL = 10, OY = 40, HEAD = 96, SC = 1.35, SPEED = 140, TURN = 2.6; // SC scales the combine up: it's HUGE
  const CROPS = [
    { n: "WHEAT", a: "#e8c35a", b: "#c99a2e", stub: "#b89a5a", pts: 1 },
    { n: "CORN", a: "#7fb93d", b: "#f2d04a", stub: "#9a8a52", pts: 2 },
    { n: "SUNFLOWERS", a: "#f7c531", b: "#6b3d12", stub: "#a28552", pts: 3 }
  ];
  const rnd = (a, b) => a + Math.random() * (b - a);
  function field(G) {
    const s = G.s, cols = Math.ceil(G.W / CELL), rows = Math.ceil((G.H - OY) / CELL), crop = CROPS[(s.lvl - 1) % 3];
    s.cols = cols; s.rows = rows; s.crop = crop; s.cut = new Uint8Array(cols * rows); s.left = cols * rows; s.total = cols * rows;
    // pre-render the standing crop once; cutting paints stubble onto it
    const cv = s.cv || (s.cv = document.createElement("canvas")); cv.width = Math.ceil(G.W); cv.height = Math.ceil(G.H - OY);
    const c = cv.getContext("2d"); s.fc = c;
    for (let r = 0; r < rows; r++) for (let q = 0; q < cols; q++) {
      c.fillStyle = q % 2 ? crop.a : shade(crop.a, -10); c.fillRect(q * CELL, r * CELL, CELL, CELL);
      c.fillStyle = shade(crop.a, -38); c.fillRect(q * CELL + (q % 2 ? 2 : 6), r * CELL, 1, CELL); // stalks in rows
      c.fillStyle = crop.b; if ((r * 7 + q * 3) % 3 === 0) c.fillRect(q * CELL + 2 + (r % 3) * 2, r * CELL + 2, 3, 4); // heads of grain
    }
    // obstacles: rocks (stop you cold) and cows (wander, moo)
    s.rocks = []; s.cows = [];
    const nr = Math.min(7, 1 + s.lvl), nc = Math.min(4, Math.floor(s.lvl / 2));
    for (let i = 0; i < nr; i++) s.rocks.push({ x: rnd(40, G.W - 40), y: rnd(OY + 60, G.H - 170), r: 15 });
    for (let i = 0; i < nc; i++) s.cows.push({ x: rnd(40, G.W - 40), y: rnd(OY + 80, G.H - 60), a: rnd(0, 6.28), t: 0, r: 18 });
    s.rocks.forEach(k => cutAt(G, k.x, k.y, 2, true));
    s.x = G.W / 2; s.y = G.H - 40; s.a = -Math.PI / 2; s.v = 0; s.msg = { txt: `FIELD ${s.lvl}: ${crop.n}`, t: 1.6 };
  }
  function shade(hex, d) { const n = parseInt(hex.slice(1), 16), f = v => Math.max(0, Math.min(255, v + d)); return `rgb(${f(n >> 16)},${f((n >> 8) & 255)},${f(n & 255)})`; }
  function cutAt(G, x, y, rad, silent) {
    const s = G.s, q0 = Math.floor(x / CELL), r0 = Math.floor((y - OY) / CELL); let got = 0;
    for (let r = r0 - rad; r <= r0 + rad; r++) for (let q = q0 - rad; q <= q0 + rad; q++) {
      if (q < 0 || r < 0 || q >= s.cols || r >= s.rows) continue;
      const i = r * s.cols + q; if (s.cut[i]) continue;
      s.cut[i] = 1; s.left--; got++;
      s.fc.fillStyle = (r + q) % 2 ? s.crop.stub : shade(s.crop.stub, -10); s.fc.fillRect(q * CELL, r * CELL, CELL, CELL);
      s.fc.fillStyle = "rgba(0,0,0,0.12)"; s.fc.fillRect(q * CELL, r * CELL + 4, CELL, 1);
    }
    if (!silent && got) {
      s.score += got * s.crop.pts; s.combo = Math.min(5, s.combo + got * 0.002);
      if (s.chaff.length < 140) for (let k = 0; k < Math.min(4, got); k++) s.chaff.push({ x: x + rnd(-6, 6), y: y + rnd(-6, 6), vx: rnd(-60, 60) - Math.cos(s.a) * 120, vy: rnd(-60, 60) - Math.sin(s.a) * 120, t: rnd(0.4, 0.9), c: Math.random() < 0.5 ? s.crop.a : s.crop.b });
    }
    return got;
  }
  defGame({
    key: "harvest", name: "Harvest Dawg", icon: "🚜", max: 99999,
    blurb: "Drive a giant combine. Clear the crops.",
    how: "Hold your thumb down and drag: the combine drives toward your finger and its giant header cuts everything it rolls over. Clear 90% of the field before the clock runs out to move on (plus bonus time). Rocks stop you dead and cost 3 seconds. Don't run over the cows. Wheat, then corn, then sunflowers: worth more each field.",
    // Checkpoint at the start of each field after the first.
    save(G) { const s = G.s; if (s.lvl < 2 || s.left < s.total - 60) return null; return { label: `Field ${s.lvl}`, lvl: s.lvl, time: s.time, score: s.score }; },
    load(G, v) { const s = G.s; s.lvl = v.lvl; s.time = v.time; s.score = v.score; s.nextBale = 0.12; field(G); },
    reset(G) { G.s = { lvl: 1, time: 60, score: 0, combo: 0, chaff: [], bales: [], hold: null, shake: 0, stall: 0 }; field(G); },
    down(G, x, y) { G.s.hold = { x, y }; }, move(G, x, y) { if (G.s.hold) G.s.hold = { x, y }; }, up(G) { G.s.hold = null; },
    update(G, dt) {
      const s = G.s; s.time -= dt; if (s.msg) { s.msg.t -= dt; if (s.msg.t <= 0) s.msg = null; }
      if (s.time <= 0) { G.over(Math.min(99999, s.score), s.lvl > 3 ? "Harvest legend!" : "Sun's down. Park it."); return; }
      if (s.stall > 0) s.stall -= dt;
      // steer + throttle
      if (s.hold && s.stall <= 0) {
        const want = Math.atan2(s.hold.y - s.y, s.hold.x - s.x); let d = want - s.a; d = Math.atan2(Math.sin(d), Math.cos(d));
        s.a += Math.max(-TURN * dt, Math.min(TURN * dt, d)); s.v = Math.min(SPEED, s.v + 300 * dt);
        if (Math.hypot(s.hold.x - s.x, s.hold.y - s.y) < 26) s.v *= 0.9;
      } else s.v = Math.max(0, s.v - 260 * dt);
      const ca = Math.cos(s.a), sa = Math.sin(s.a);
      s.x = Math.max(20, Math.min(G.W - 20, s.x + ca * s.v * dt)); s.y = Math.max(OY + 20, Math.min(G.H - 20, s.y + sa * s.v * dt));
      // header: a wide bar in front of the combine
      if (s.v > 5) { let got = 0; for (let k = -HEAD / 2; k <= HEAD / 2; k += CELL * 0.8) got += cutAt(G, s.x + ca * 34 * SC - sa * k * SC, s.y + sa * 34 * SC + ca * k * SC, 0); if (got) { s.tick = (s.tick || 0) - dt; if (s.tick <= 0) { G.sfx("pop"); s.tick = 0.12; } } else s.combo = Math.max(0, s.combo - dt); }
      // rocks
      for (const k of s.rocks) if (Math.hypot(k.x - (s.x + ca * 40 * SC), k.y - (s.y + sa * 40 * SC)) < k.r + 22 && s.stall <= 0 && s.v > 20) { s.stall = 0.8; s.v = 0; s.time -= 3; s.shake = 0.4; s.x -= ca * 18; s.y -= sa * 18; G.buzz(); G.sfx("lose"); s.msg = { txt: "CLUNK! -3s", t: 0.8 }; }
      // cows wander; hitting one costs points
      for (const w of s.cows) {
        w.t -= dt; if (w.t <= 0) { w.a = rnd(0, 6.28); w.t = rnd(1, 3); }
        w.x = Math.max(20, Math.min(G.W - 20, w.x + Math.cos(w.a) * 22 * dt)); w.y = Math.max(OY + 20, Math.min(G.H - 20, w.y + Math.sin(w.a) * 22 * dt));
        if (Math.hypot(w.x - s.x, w.y - s.y) < w.r + 36 && !w.hurt) { w.hurt = 1.5; s.score = Math.max(0, s.score - 50); w.a = Math.atan2(w.y - s.y, w.x - s.x); w.t = 1.5; G.buzz(); s.msg = { txt: "MOOO! -50", t: 0.9 }; }
        if (w.hurt) { w.hurt -= dt; if (w.hurt <= 0) w.hurt = 0; }
      }
      s.chaff.forEach(p => { p.x += p.vx * dt; p.y += p.vy * dt; p.vx *= 0.94; p.vy *= 0.94; p.t -= dt; }); s.chaff = s.chaff.filter(p => p.t > 0);
      // drop a hay bale every so often for that satisfying trail
      s.baleN = (s.baleN || 0) + 0; const done = 1 - s.left / s.total;
      if (done >= (s.nextBale || 0.12)) { s.nextBale = (s.nextBale || 0.12) + 0.12; s.bales.push({ x: s.x - ca * 60, y: s.y - sa * 60, a: s.a }); s.score += 25; }
      if (s.shake > 0) s.shake -= dt;
      if (done >= 0.9) { const bonus = Math.round(s.time) * 5 + 200 * s.lvl; s.score += bonus; s.lvl++; s.time = Math.min(60, s.time + 15); s.bales = []; s.nextBale = 0.12; G.sfx("win"); field(G); s.msg = { txt: `FIELD CLEARED! +${bonus}`, t: 1.8 }; }
    },
    draw(G, c) {
      const s = G.s, W = G.W, H = G.H; if (!s.fc) return;
      c.save(); if (s.shake > 0) c.translate((Math.random() - 0.5) * 8, (Math.random() - 0.5) * 8);
      c.drawImage(s.cv, 0, OY, W, H - OY);
      s.bales.forEach(b => { c.save(); c.translate(b.x, b.y); c.rotate(b.a); c.fillStyle = "#d9b45a"; c.fillRect(-10, -14, 20, 28); c.strokeStyle = "#a4802f"; c.lineWidth = 2; c.strokeRect(-10, -14, 20, 28); c.beginPath(); c.moveTo(-10, -5); c.lineTo(10, -5); c.moveTo(-10, 5); c.lineTo(10, 5); c.stroke(); c.restore(); });
      s.rocks.forEach(k => G.emoji(c, "🪨", k.x, k.y, 30));
      s.cows.forEach(w => { c.save(); c.translate(w.x, w.y); if (Math.cos(w.a) < 0) c.scale(-1, 1); G.emoji(c, "🐄", 0, 0, 36); c.restore(); });
      s.chaff.forEach(p => { c.globalAlpha = Math.min(1, p.t * 2); c.fillStyle = p.c; c.fillRect(p.x, p.y, 3, 3); }); c.globalAlpha = 1;
      // the combine
      c.save(); c.translate(s.x, s.y); c.rotate(s.a + Math.PI / 2); c.scale(SC, SC);
      c.fillStyle = "rgba(0,0,0,0.25)"; c.fillRect(-26, -20, 56, 64);
      c.fillStyle = "#222"; [[-30, -10], [20, -10], [-28, 22], [18, 22]].forEach(([x, y]) => c.fillRect(x, y, 12, 22));
      c.fillStyle = "#2e8b3a"; c.fillRect(-22, -22, 44, 60); c.fillStyle = "#1f6b2a"; c.fillRect(-22, 26, 44, 12);
      c.fillStyle = "#f2c230"; c.fillRect(-HEAD / 2, -40, HEAD, 14); // header
      c.fillStyle = "#c79a14"; const sp = (G.t * 18) % 12; for (let k = -HEAD / 2 + sp; k < HEAD / 2; k += 12) c.fillRect(k, -40, 4, 14); // spinning reel
      c.fillStyle = "#333"; c.fillRect(-HEAD / 2 - 2, -28, HEAD + 4, 4);
      c.fillStyle = "#cfe8ff"; c.fillRect(-14, -16, 28, 22);
      c.scale(1 / SC, 1 / SC); c.rotate(-(s.a + Math.PI / 2)); G.img(c, s.stall > 0 ? ":dawgpain:" : s.v > 60 ? ":dawgW:" : ":dawgpog:", 0, 0, 30);
      c.restore();
      c.restore();
      const done = Math.round((1 - s.left / s.total) * 100);
      G.hud(c, `${s.score}`, `${s.crop.n} ${done}%`, `${Math.max(0, Math.ceil(s.time))}s`, { color: done >= 80 ? "#7cff6b" : "#ffd23f" });
      c.fillStyle = "rgba(0,0,0,0.3)"; c.fillRect(0, 34, W, 6); c.fillStyle = "#7cff6b"; c.fillRect(0, 34, W * Math.min(1, done / 90), 6);
      if (s.msg) G.banner(c, s.msg.txt, "#fff", H * 0.42, s.msg.txt.length > 14 ? 16 : undefined);
      G.hint(c, "HOLD + DRAG TO DRIVE", 4);
    }
  });
})();
