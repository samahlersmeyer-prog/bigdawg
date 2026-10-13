// ---------- Doggy Paddle (swim race) ----------
// Top-down 4-lane pool. The bulldog swims lane 2 against a cat, a duck and an otter.
// Tap LEFT half / RIGHT half alternately. Same side twice (or mashing) = slip. Tap when the shrinking
// ring hits the paw circle for a PERFECT stroke boost. Every ~6 strokes tap BREATH (bottom center).
// At the far wall swipe down for a flip turn. 50m (2 lengths) per heat: Heat 1, Semifinal, Final.
// Top 2 advances. Per heat: 1000/600/300/100 + time bonus. Total capped at 9999.
(function () {
  const BEAT = 0.4, PERF = 0.075, GOOD_LO = 0.23, GOOD_HI = 0.62, TOO_FAST = 0.12;
  const LEN = 25, DIST = 50, BREATH_N = 6;
  const PTS = [1000, 600, 300, 100];
  const ORD = ["1ST", "2ND", "3RD", "4TH"];
  const HEATS = ["HEAT 1", "SEMIFINAL", "FINAL"];
  const SPEEDS = [[1.42, 1.54, 1.66], [1.66, 1.8, 1.92], [1.92, 2.04, 2.14]];
  const rnd = (a, b) => a + Math.random() * (b - a);
  const clamp = (v, a, b) => v < a ? a : v > b ? b : v;

  function lay(G) {
    const W = G.W, H = G.H;
    const cH = clamp(H * 0.17, 82, 104), ctrlTop = H - cH;
    const poolTop = 38, poolBot = ctrlTop - 4, px = 6, pw = W - 12;
    const br = Math.min(38, cH * 0.42);
    return { cH, ctrlTop, poolTop, poolBot, px, pw, laneW: pw / 4, top: poolTop + 22, bot: poolBot - 30, bx: W / 2, by: ctrlTop + cH * 0.56, br };
  }
  const laneX = (L, lane) => L.px + L.laneW * (lane + 0.5);
  function yAt(L, pos) { const leg = pos <= LEN ? pos : DIST - pos; return L.bot - (leg / LEN) * (L.bot - L.top); }

  function newHeat(G) {
    const s = G.s, h = s.heat;
    s.phase = "ready"; s.pt = 2.6; s.time = 0;
    s.pos = 0; s.v = 0; s.p = 0.3; s.last = ""; s.lastT = -9; s.stum = 0; s.brT = 0; s.sb = 0; s.burst = 0;
    s.turned = false; s.wall = 0; s.fin = -1; s.finWait = 0; s.stroke = 0; s.strokeSide = 0; s.face = ":dawgW:";
    s.msg = null; s.pops = []; s.splash = []; s.results = null; s.perfects = 0;
    const sp = SPEEDS[h].map(v => v + rnd(-0.03, 0.03)).sort(() => Math.random() - 0.5);
    s.riv = [
      { lane: 0, e: "🐈", name: "CAT", base: sp[0] },
      { lane: 2, e: "🦆", name: "DUCK", base: sp[1] },
      { lane: 3, e: "🦦", name: "OTTER", base: sp[2] },
    ];
    for (const r of s.riv) { r.pos = 0; r.v = 0; r.fin = -1; r.turned = false; r.tw = 0; r.ph = rnd(0, 6); r.str = 0; }
  }

  function say(G, txt, col, t) { G.s.msg = { txt, col, t: t || 0.9 }; }
  function pop(G, txt, col) { const s = G.s, L = lay(G); if (s.pops.length < 8) s.pops.push({ txt, col, x: laneX(L, 1) + 34, y: yAt(L, s.pos), t: 0.7 }); }
  function splashAt(G, x, y, n, big) {
    const sp = G.s.splash;
    for (let i = 0; i < n && sp.length < 90; i++) { const a = rnd(0, 6.283), v = rnd(20, big ? 110 : 60); sp.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, t: rnd(0.25, big ? 0.7 : 0.45) }); }
  }
  const swimming = s => s.phase === "swim" && s.fin < 0 && s.wall <= 0;

  function slip(G, why) {
    const s = G.s, L = lay(G);
    s.stum = 0.45; s.p *= 0.6; s.v *= 0.6; s.last = ""; s.burst = 0;
    splashAt(G, laneX(L, 1), yAt(L, s.pos), 14, true);
    say(G, "SLIP!", "#ff6b6b", 0.7); s.sub = why; s.face = ":dawgsweat:";
    G.sfx("lose"); G.buzz();
  }

  function stroke(G, side) {
    const s = G.s;
    if (s.phase === "res") { advance(G); return; }
    if (!swimming(s) || s.stum > 0) return;
    const i = s.time - s.lastT;
    if (side === s.last) { slip(G, "SAME PAW TWICE"); return; }
    if (s.last && i < TOO_FAST) { slip(G, "TOO FAST - FIND THE BEAT"); return; }
    let q;
    if (!s.last) q = 0.6;
    else if (Math.abs(i - BEAT) <= PERF) { q = 1; s.burst = 0.35; s.perfects++; pop(G, "PERFECT", "#7dff7a"); G.sfx("pop"); }
    else if (i >= GOOD_LO && i <= GOOD_HI) q = 0.68;
    else { q = 0.42; pop(G, i < BEAT ? "EARLY" : "LATE", "#ffd23f"); }
    s.p += (q - s.p) * 0.24;
    s.v += 0.1 * q;
    s.last = side; s.lastT = s.time; s.stroke = 0.22; s.strokeSide = side === "L" ? -1 : 1;
    s.sb++;
    const L = lay(G);
    splashAt(G, laneX(L, 1) + s.strokeSide * 16, yAt(L, s.pos) + (s.pos > LEN ? 14 : -14), 4, false);
    if (s.face === ":dawgsweat:" && s.sb < BREATH_N + 2) s.face = ":dawgW:";
  }

  function breath(G) {
    const s = G.s;
    if (s.phase === "res") { advance(G); return; }
    if (!swimming(s) || s.brT > 0) return;
    const early = s.sb < 3;
    s.sb = 0; s.brT = 0.25; s.v *= early ? 0.82 : 0.93; s.last = ""; s.lastT = s.time;
    s.face = ":dawgpog:";
    say(G, early ? "TOO SOON" : "GULP!", early ? "#ff9f43" : "#5ad1ff", 0.55);
    G.sfx("pop");
  }

  function turn(G) {
    const s = G.s, L = lay(G);
    if (s.phase !== "swim" || s.turned || s.fin >= 0) return;
    const d = LEN - s.pos;
    if (s.wall <= 0 && d > 3.2) return; // not near the wall yet
    const q = s.wall > 0 ? 0.15 : d < 1.1 ? 1 : d < 2.1 ? 0.6 : 0.3;
    s.turned = true; s.wall = 0; s.pos = LEN + 0.01;
    s.v = 1.1 + 1.9 * q; s.last = ""; s.lastT = s.time;
    splashAt(G, laneX(L, 1), L.top, 18, true);
    if (q === 1) { say(G, "FLIP TURN!", "#7dff7a", 0.9); G.sfx("win"); s.face = ":dawgpog:"; }
    else if (q >= 0.6) { say(G, "GOOD TURN", "#ffd23f", 0.8); G.sfx("pop"); }
    else { say(G, q > 0.2 ? "EARLY TURN" : "SLOW TURN", "#ff9f43", 0.8); G.sfx("lose"); }
  }

  function finishHeat(G) {
    const s = G.s;
    const proj = (pos, v) => s.time + (DIST - pos) / Math.max(0.5, v);
    const all = [{ name: "YOU", you: true, time: s.fin >= 0 ? s.fin : proj(s.pos, s.v) }];
    for (const r of s.riv) all.push({ name: r.name, e: r.e, time: r.fin >= 0 ? r.fin : proj(r.pos, r.v) });
    all.sort((a, b) => a.time - b.time);
    const place = all.findIndex(o => o.you), yt = all[place].time;
    const bonus = Math.max(0, Math.round((40 - yt) * 15));
    const pts = PTS[place] + bonus;
    s.score = Math.min(9999, s.score + pts);
    s.results = { all, place, pts, bonus };
    s.phase = "res"; s.pt = 0; s.flash = 0.3;
    s.face = place === 0 ? ":dawgpog:" : place === 1 ? ":dawgW:" : ":dawgpain:";
    if (place <= 1) G.sfx("win"); else { G.sfx("lose"); G.buzz(); }
  }

  function advance(G) {
    const s = G.s;
    if (s.phase !== "res" || s.pt < 1.2) return;
    const r = s.results;
    if (r.place > 1 || s.heat >= 2) { end(G); return; }
    s.heat++; newHeat(G);
  }
  function end(G) {
    const s = G.s, r = s.results, h = s.heat;
    let t;
    if (h === 2 && r.place === 0) t = "Gold medal pup!";
    else if (h === 2 && r.place === 1) t = "Silver dawg!";
    else if (h === 2) t = "Finalist. Proud pup.";
    else if (r.place === 3) t = "Sank like a stone.";
    else t = h === 0 ? "Out in the heats." : "So close. Semifinalist.";
    G.over(Math.min(9999, s.score), t);
  }

  defGame({
    key: "swim", name: "Doggy Paddle", icon: "🏊", max: 9999, cat: "sports",
    blurb: "Race the pool. Tap left, right, left, right.",
    how: "Tap the LEFT and RIGHT halves of the screen one after the other. Same side twice or mashing = SLIP. Tap when the shrinking ring hits your pup for a PERFECT stroke. Every 6 strokes tap the blue BREATH button or you slow down. At the far wall, SWIPE DOWN for a flip turn. 50m per heat: Heat 1, Semifinal, Final. Top 2 advance. 1000/600/300/100 per heat + time bonus. Keys: ← → strokes, space = breath, ↓ = turn.",
    reset(G) {
      G.s = { heat: 0, score: 0, flash: 0, sub: "" };
      newHeat(G);
    },
    update(G, dt) {
      const s = G.s, L = lay(G);
      if (s.flash > 0) s.flash -= dt;
      if (s.msg) { s.msg.t -= dt; if (s.msg.t <= 0) s.msg = null; }
      for (let i = s.splash.length - 1; i >= 0; i--) { const q = s.splash[i]; q.t -= dt; q.x += q.vx * dt; q.y += q.vy * dt; q.vx *= 0.92; q.vy *= 0.92; if (q.t <= 0) s.splash.splice(i, 1); }
      for (let i = s.pops.length - 1; i >= 0; i--) { s.pops[i].t -= dt; if (s.pops[i].t <= 0) s.pops.splice(i, 1); }
      if (s.stroke > 0) s.stroke -= dt;
      if (s.phase === "ready") {
        s.pt -= dt;
        if (s.pt <= 0) { s.phase = "swim"; s.time = 0; s.lastT = -9; say(G, "GO!", "#7dff7a", 0.7); G.sfx("pop"); }
        return;
      }
      if (s.phase === "res") {
        s.pt += dt;
        const lim = s.results.place > 1 || s.heat >= 2 ? 7 : 5;
        if (s.pt > lim) advance(G);
        return;
      }
      s.time += dt;
      // CPU swimmers
      const ramp = Math.min(1, s.time / 2);
      for (const r of s.riv) {
        if (r.fin >= 0) { r.v = 0; continue; }
        if (r.tw > 0) { r.tw -= dt; r.v = 0.3; if (r.tw <= 0) r.v = r.base * 1.25; }
        else r.v += (r.base * ramp * (1 + 0.06 * Math.sin(s.time * 0.8 + r.ph)) - r.v) * Math.min(1, dt * 2.5);
        r.pos += r.v * dt; r.str += dt * (3 + r.v * 2);
        if (!r.turned && r.pos >= LEN) { r.turned = true; r.pos = LEN + 0.01; r.tw = 0.5; }
        if (r.pos >= DIST) { r.fin = s.time - (r.pos - DIST) / Math.max(0.1, r.v); r.pos = DIST; }
      }
      // player
      if (s.fin < 0) {
        if (s.stum > 0) s.stum -= dt;
        if (s.brT > 0) s.brT -= dt;
        if (s.burst > 0) s.burst -= dt;
        if (s.time - s.lastT > 0.75) s.p = Math.max(0, s.p - 0.6 * dt);
        if (s.wall > 0) {
          s.wall -= dt; s.v = 0;
          if (s.wall <= 0) { s.wall = 0.001; turn(G); }
        } else {
          let tgt = 0.55 + 2.0 * s.p;
          if (s.burst > 0) tgt += 0.3;
          if (s.sb >= BREATH_N + 2) tgt *= 0.55;
          if (s.stum > 0) tgt = 0.3;
          if (s.brT > 0) tgt *= 0.8;
          if (s.time < 0.5 && !s.last && s.sb === 0) tgt = Math.min(tgt, 0.2); // need to start stroking
          s.v += (tgt - s.v) * Math.min(1, dt * 2.6);
          s.pos += s.v * dt;
          if (s.sb >= BREATH_N + 2 && s.face !== ":dawgsweat:") s.face = ":dawgsweat:";
          if (!s.turned && s.pos >= LEN) { s.pos = LEN; s.wall = 0.7; s.v = 0; say(G, "MISSED TURN", "#ff6b6b", 0.8); G.buzz(); }
          if (s.pos >= DIST) { s.fin = s.time - (s.pos - DIST) / Math.max(0.1, s.v); s.pos = DIST; s.v = 0; splashAt(G, laneX(L, 1), yAt(L, DIST), 20, true); G.sfx("pop"); }
        }
      }
      let done = 0; for (const r of s.riv) if (r.fin >= 0) done++;
      if (s.fin >= 0) { s.finWait += dt; if (done === 3 || s.finWait > 2.2) finishHeat(G); }
      else if (done === 3) finishHeat(G);
      else if (s.time > 90) finishHeat(G); // safety net
    },
    tap(G, x, y) {
      const s = G.s, L = lay(G);
      if (s.phase === "res") { advance(G); return; }
      if (Math.hypot(x - L.bx, y - L.by) < L.br + 14) { breath(G); return; }
      stroke(G, x < G.W / 2 ? "L" : "R");
    },
    swipe(G, dx, dy) {
      const s = G.s;
      if (s.phase === "res") { advance(G); return; }
      if (dy !== 0) turn(G);
    },
    onKey(G, k, d) {
      if (!d) return;
      if (k === "ArrowLeft" || k === "a") stroke(G, "L");
      else if (k === "ArrowRight" || k === "d") stroke(G, "R");
      else if (k === " " || k === "ArrowUp" || k === "w") breath(G);
      else if (k === "ArrowDown" || k === "s") { if (G.s.phase === "res") advance(G); else turn(G); }
    },
    draw(G, c) {
      const s = G.s, W = G.W, H = G.H, dark = G.dark(), L = lay(G);
      // deck tiles
      c.fillStyle = dark ? "#2a2f45" : "#e9dcc3"; c.fillRect(0, 0, W, H);
      c.fillStyle = dark ? "#353b56" : "#dccdaf";
      for (let y = 0; y < L.poolBot + 6; y += 16) for (let x = (y / 16 % 2) * 8; x < W; x += 16) c.fillRect(x, y, 8, 8);
      // water
      const ph = L.poolBot - L.poolTop;
      c.fillStyle = dark ? "#0d4f8a" : "#2fa7e6"; c.fillRect(L.px, L.poolTop, L.pw, ph);
      c.fillStyle = dark ? "#11609f" : "#4bb8ef";
      for (let i = 0; i < 10; i++) {
        const y = L.poolTop + ((i * 37 + G.t * 14) % ph);
        for (let x = L.px + (i * 23) % 40; x < L.px + L.pw - 20; x += 46) c.fillRect(x, y, 20, 3);
      }
      c.strokeStyle = dark ? "#cfd8ff" : "#fff"; c.lineWidth = 4; c.strokeRect(L.px, L.poolTop, L.pw, ph);
      // lane floor lines with T marks
      c.fillStyle = dark ? "rgba(0,20,60,0.55)" : "rgba(10,60,120,0.35)";
      for (let i = 0; i < 4; i++) { const x = laneX(L, i); c.fillRect(x - 3, L.top, 6, L.bot - L.top); c.fillRect(x - 12, L.top, 24, 5); c.fillRect(x - 12, L.bot - 5, 24, 5); }
      // lane ropes
      for (let i = 1; i < 4; i++) {
        const x = L.px + L.laneW * i;
        for (let y = L.poolTop + 4, j = 0; y < L.poolBot - 4; y += 9, j++) {
          const endz = y < L.poolTop + 40 || y > L.poolBot - 44;
          c.fillStyle = endz ? "#ff4d4d" : j % 2 ? "#ffd23f" : "#fff"; c.beginPath(); c.arc(x, y + 4, 3.5, 0, 7); c.fill();
        }
      }
      // backstroke flags near turn wall
      const flagY = L.top + 26;
      c.strokeStyle = "rgba(255,255,255,0.5)"; c.lineWidth = 1; c.beginPath(); c.moveTo(L.px, flagY); c.lineTo(L.px + L.pw, flagY); c.stroke();
      for (let x = L.px + 6, j = 0; x < L.px + L.pw; x += 14, j++) { c.fillStyle = j % 2 ? "#ff4d4d" : "#fff"; c.beginPath(); c.moveTo(x, flagY); c.lineTo(x + 8, flagY); c.lineTo(x + 4, flagY + 7); c.fill(); }
      // lane numbers at the blocks
      for (let i = 0; i < 4; i++) {
        const x = laneX(L, i);
        c.fillStyle = i === 1 ? "#ffd23f" : (dark ? "#c8cde0" : "#f4f4f4"); c.fillRect(x - 13, L.poolBot - 15, 26, 15);
        G.text(c, String(i + 1), x, L.poolBot - 7, 10, "#333");
      }
      // turn zone highlight in my lane
      if (s.phase === "swim" && !s.turned && s.fin < 0 && LEN - s.pos < 3.2) {
        const x = laneX(L, 1), y1 = yAt(L, LEN - 1.1), y2 = yAt(L, LEN);
        c.fillStyle = Math.sin(G.t * 16) > 0 ? "rgba(125,255,122,0.45)" : "rgba(125,255,122,0.25)";
        c.fillRect(x - L.laneW / 2 + 4, y2 - 14, L.laneW - 8, y1 - y2 + 14);
      }
      // rivals
      const rs = Math.min(30, L.laneW * 0.55);
      for (const r of s.riv) {
        const x = laneX(L, r.lane), y = yAt(L, r.pos), fy = r.pos > LEN ? 1 : -1;
        if (r.v > 0.3 && r.fin < 0) wake(c, x, y, fy, r.v);
        const sw = Math.sin(r.str * 3);
        if (r.fin < 0 && s.phase !== "ready") {
          c.fillStyle = "rgba(255,255,255,0.85)";
          c.beginPath(); c.arc(x - 13, y + fy * 9 + sw * 5, 3.5, 0, 7); c.fill();
          c.beginPath(); c.arc(x + 13, y + fy * 9 - sw * 5, 3.5, 0, 7); c.fill();
        }
        G.emoji(c, r.e, x, y + Math.sin(G.t * 6 + r.ph) * 1.5, rs);
        if (s.phase === "ready") G.text(c, r.name, x, y - 26, 10, "#fff");
      }
      // player
      const px = laneX(L, 1), py = yAt(L, s.pos), fwd = s.pos > LEN ? 1 : -1, sz = Math.min(42, L.laneW * 0.62);
      if (s.v > 0.3) wake(c, px, py, fwd, s.v);
      c.fillStyle = dark ? "#b07b48" : "#c98f55";
      c.beginPath(); c.ellipse(px, py - fwd * sz * 0.45, sz * 0.3, sz * 0.48, 0, 0, 7); c.fill();
      const k = s.stroke > 0 ? s.stroke / 0.22 : 0, idle = Math.sin(G.t * 5) * 2;
      c.fillStyle = dark ? "#e5c9a8" : "#f2dcc0"; c.strokeStyle = "#6b4423"; c.lineWidth = 1.5;
      for (let sd = -1; sd <= 1; sd += 2) {
        const rr = s.strokeSide === sd ? k : 0;
        const ax = px + sd * sz * 0.5, ay = py + fwd * (sz * 0.18 + rr * sz * 0.35) + sd * idle;
        c.beginPath(); c.arc(ax, ay, sz * 0.13, 0, 7); c.fill(); c.stroke();
      }
      // rhythm ring
      if (swimming(s) && s.last && s.stum <= 0) {
        const i = s.time - s.lastT, r0 = sz * 0.62;
        if (i < BEAT + PERF + 0.15) {
          const perfect = Math.abs(i - BEAT) <= PERF;
          c.strokeStyle = "rgba(255,255,255,0.7)"; c.lineWidth = 2; c.beginPath(); c.arc(px, py, r0, 0, 7); c.stroke();
          const rr = r0 + Math.max(0, 1 - i / BEAT) * sz * 1.1;
          c.strokeStyle = perfect ? "#7dff7a" : i > BEAT ? "#ff9f43" : "#ffd23f"; c.lineWidth = perfect ? 5 : 3;
          c.beginPath(); c.arc(px, py, rr, 0, 7); c.stroke();
        }
      }
      G.img(c, s.face, px, py, sz);
      if (s.stum > 0) G.text(c, "!!", px + sz * 0.5, py - sz * 0.5, 10, "#ff6b6b");
      if (s.phase === "swim" && s.fin < 0) {
        let pl = 1; for (const r of s.riv) if (r.pos > s.pos || r.fin >= 0) pl++;
        let ly = py - fwd * sz * 1.05; if (ly < L.poolTop + 12) ly = py + sz * 1.05; // keep clear of the HUD after the turn
        G.text(c, ORD[pl - 1], px, ly, 10, pl <= 2 ? "#7dff7a" : "#ffd23f");
      }
      if (s.phase === "ready") G.text(c, "YOU", px, py - 28, 10, "#ffd23f");
      // splashes
      c.fillStyle = "#fff";
      for (const q of s.splash) { c.globalAlpha = Math.min(1, q.t * 3); c.fillRect(q.x - 2, q.y - 2, 4, 4); }
      c.globalAlpha = 1;
      for (const p of s.pops) { c.globalAlpha = Math.min(1, p.t * 3); G.text(c, p.txt, p.x, p.y - (0.7 - p.t) * 30, 10, p.col, "left"); }
      c.globalAlpha = 1;
      // banners
      const midY = (L.top + L.bot) / 2;
      if (s.phase === "ready") {
        const t = s.pt, txt = t > 1.7 ? "ON YOUR MARKS" : t > 0.8 ? "SET..." : "...";
        c.fillStyle = "rgba(0,0,0,0.6)"; c.fillRect(0, midY - 48, W, 96);
        G.banner(c, HEATS[s.heat], "#ffd23f", midY - 24, 20);
        G.text(c, "50M · TOP 2 ADVANCE", W / 2, midY + 2, 10, "#fff");
        G.text(c, txt, W / 2, midY + 26, 13, "#7dff7a");
      } else if (s.phase === "swim" && !s.turned && s.fin < 0 && (LEN - s.pos < 3.2 || s.wall > 0)) {
        const by = midY - 40;
        c.fillStyle = "rgba(0,0,0,0.6)"; c.fillRect(0, by - 24, W, 56);
        G.banner(c, "TURN! SWIPE ⬇", LEN - s.pos < 1.1 ? "#7dff7a" : "#ffd23f", by - 4, 18);
        G.text(c, "FLIP IN THE GREEN ZONE", W / 2, by + 20, 10, "#fff");
      } else if (s.msg) {
        const m = s.msg, y = midY + (s.pos > 15 && s.pos < 35 ? 60 : 0), slip = m.txt === "SLIP!";
        c.fillStyle = "rgba(0,0,0,0.45)"; c.fillRect(0, y - 24, W, slip ? 60 : 46);
        G.banner(c, m.txt, m.col, y - 2, 22);
        if (slip) G.text(c, s.sub, W / 2, y + 24, 10, "#fff");
      }
      if (s.heat === 0 && s.phase !== "res") G.hint(c, "TAP LEFT, RIGHT, LEFT, RIGHT", 6.5, midY + 76);
      if (s.phase === "res" && s.results) results(G, c, L, s);
      if (s.flash > 0) { c.fillStyle = `rgba(255,255,255,${s.flash * 2})`; c.fillRect(0, 0, W, H); }
      controls(G, c, L, s, dark);
      // HUD
      const tm = s.phase === "ready" ? 0 : s.fin >= 0 ? s.fin : s.phase === "res" ? s.results.all.find(o => o.you).time : s.time;
      G.hud(c, HEATS[s.heat], tm.toFixed(2) + "s", `SCORE ${s.score}`);
    }
  });

  function wake(c, x, y, fwd, v) {
    c.strokeStyle = "rgba(255,255,255,0.5)"; c.lineWidth = 2;
    const len = 8 + v * 7;
    c.beginPath(); c.moveTo(x - 9, y - fwd * 10); c.lineTo(x - 9 - len * 0.45, y - fwd * (10 + len));
    c.moveTo(x + 9, y - fwd * 10); c.lineTo(x + 9 + len * 0.45, y - fwd * (10 + len)); c.stroke();
  }

  function rr(c, x, y, w, h, r) {
    c.beginPath(); c.moveTo(x + r, y); c.lineTo(x + w - r, y); c.quadraticCurveTo(x + w, y, x + w, y + r);
    c.lineTo(x + w, y + h - r); c.quadraticCurveTo(x + w, y + h, x + w - r, y + h); c.lineTo(x + r, y + h);
    c.quadraticCurveTo(x, y + h, x, y + h - r); c.lineTo(x, y + r); c.quadraticCurveTo(x, y, x + r, y); c.closePath();
  }

  function controls(G, c, L, s, dark) {
    const W = G.W, y = L.ctrlTop, h = L.cH;
    c.fillStyle = dark ? "#151827" : "#cbbd9f"; c.fillRect(0, y, W, G.H - y);
    const sw = swimming(s);
    const next = sw ? (s.last === "L" ? "R" : s.last === "R" ? "L" : "") : "";
    const pad = (x0, side, label) => {
      const bw = W / 2 - 10, hot = sw && (next === side || (!next && Math.sin(G.t * 6) * (side === "L" ? 1 : -1) > 0));
      const pressed = s.stroke > 0.1 && s.strokeSide === (side === "L" ? -1 : 1);
      c.fillStyle = "rgba(0,0,0,0.3)"; rr(c, x0 + 2, y + 8, bw, h - 12, 14); c.fill();
      c.fillStyle = hot ? "#e63946" : (dark ? "#5a2a33" : "#b9737a"); rr(c, x0, y + (pressed ? 8 : 5), bw, h - 12, 14); c.fill();
      if (hot) { c.strokeStyle = "#fff"; c.lineWidth = 3; rr(c, x0, y + 5, bw, h - 12, 14); c.stroke(); }
      const cx = side === "L" ? x0 + (bw - L.br) / 2 - 4 : x0 + L.br + (bw - L.br) / 2 + 4;
      G.text(c, label, cx, y + h * 0.36, 10, "#fff");
      G.emoji(c, "🐾", cx, y + h * 0.66, 18);
    };
    pad(6, "L", "◀ LEFT");
    pad(W / 2 + 4, "R", "RIGHT ▶");
    // breath button
    const need = sw && s.sb >= BREATH_N, gasp = sw && s.sb >= BREATH_N + 2, blink = need && Math.sin(G.t * 14) > 0;
    c.fillStyle = "rgba(0,0,0,0.35)"; c.beginPath(); c.arc(L.bx + 2, L.by + 3, L.br + 2, 0, 7); c.fill();
    c.fillStyle = gasp ? (blink ? "#ff4d4d" : "#ff9f43") : need ? (blink ? "#ff9f43" : "#1d6fb8") : "#1d6fb8";
    c.beginPath(); c.arc(L.bx, L.by + (s.brT > 0 ? 2 : 0), L.br, 0, 7); c.fill();
    c.strokeStyle = "#fff"; c.lineWidth = need ? 4 : 2; c.stroke();
    G.text(c, "BREATH", L.bx, L.by - 8, 10, "#fff");
    G.emoji(c, "🫧", L.bx, L.by + 13, 16);
    // air pips (strokes left before you need air)
    const left = Math.max(0, BREATH_N - s.sb), pw = 7, gx = L.bx - (BREATH_N * (pw + 2)) / 2 + 1, gy = L.by - L.br - 14;
    c.fillStyle = "#11141f"; rr(c, gx - 5, gy - 4, BREATH_N * (pw + 2) + 8, 13, 6); c.fill();
    for (let i = 0; i < BREATH_N; i++) {
      c.fillStyle = i < left ? "#5ad1ff" : gasp ? "#ff4d4d" : "#3a3f55";
      c.fillRect(gx + i * (pw + 2), gy, pw, 5);
    }
  }

  function results(G, c, L, s) {
    const W = G.W, r = s.results, bx = 14, bw = W - 28, final = s.heat === 2;
    const pod = final ? 96 : 0, bh = 54 + 4 * 24 + 46 + pod;
    const by = Math.max(L.poolTop + 4, (L.poolTop + L.poolBot) / 2 - bh / 2);
    c.fillStyle = "rgba(0,0,0,0.5)"; c.fillRect(bx + 4, by + 4, bw, bh);
    c.fillStyle = "#f3e6c8"; c.fillRect(bx, by, bw, bh);
    c.strokeStyle = "#5a4630"; c.lineWidth = 3; c.strokeRect(bx, by, bw, bh);
    G.text(c, final ? "FINAL RESULTS" : HEATS[s.heat] + " RESULTS", W / 2, by + 17, 12, "#5a4630");
    let y0 = by + 34;
    if (final) {
      // podium: 2nd | 1st | 3rd
      const cx = W / 2, pwid = Math.min(70, bw / 3.6), base = y0 + pod - 6;
      const spots = [[1, cx - pwid, 34, "#c0c0c0"], [0, cx, 50, "#ffd23f"], [2, cx + pwid, 22, "#cd7f32"]];
      for (const [i, x, hh, col] of spots) {
        c.fillStyle = col; c.fillRect(x - pwid / 2 + 2, base - hh, pwid - 4, hh);
        G.text(c, String(i + 1), x, base - hh / 2, 12, "#3a2a18");
        const o = r.all[i], fy = base - hh - 16;
        if (o.you) G.img(c, ":dawgpog:", x, fy, 30); else G.emoji(c, o.e, x, fy, 26);
      }
      y0 += pod;
    }
    for (let i = 0; i < 4; i++) {
      const o = r.all[i], y = y0 + 12 + i * 24;
      if (o.you) { c.fillStyle = i <= 1 ? "rgba(61,220,104,0.35)" : "rgba(255,107,107,0.3)"; c.fillRect(bx + 6, y - 11, bw - 12, 22); }
      G.text(c, ORD[i], bx + 12, y, 10, i === 0 ? "#a06e00" : "#5a4630", "left");
      if (o.you) G.img(c, i <= 1 ? ":dawgpog:" : ":dawgpain:", bx + 66, y, 20); else G.emoji(c, o.e, bx + 66, y, 16);
      G.text(c, o.name, bx + 82, y, 10, "#3a2a18", "left");
      G.text(c, o.time.toFixed(2) + "s", bx + bw - 10, y, 10, "#3a2a18", "right");
    }
    const yb = y0 + 12 + 4 * 24 + 2;
    G.text(c, `+${PTS[r.place]} PLACE  +${r.bonus} TIME`, W / 2, yb, 10, "#3a2a18");
    let msg;
    if (r.place > 1) msg = "ELIMINATED";
    else if (final) msg = r.place === 0 ? "GOLD MEDAL!" : "SILVER MEDAL!";
    else msg = s.pt > 1.2 ? (s.heat === 0 ? "TAP: ON TO THE SEMIS" : "TAP: ON TO THE FINAL") : "YOU ADVANCE!";
    G.text(c, msg, W / 2, yb + 22, 11, r.place <= 1 ? (Math.sin(G.t * 6) > 0 ? "#1f7a44" : "#2fb35a") : "#c0392b");
  }
})();
