// ---------- Duck Dawg (light-gun duck pop) ----------
// Ducks flap out of the tall grass and zig-zag around. Tap them with the tennis-ball launcher before they fly off.
(function () {
  const HUDH = 56, TOPH = 34, GRASSH = 66;
  const need = r => r <= 3 ? 6 : r <= 5 ? 7 : r <= 7 ? 8 : 9;
  const pts = r => Math.min(1500, 500 + 100 * (r - 1));
  const speed = (s) => Math.min(380, 105 + 26 * (s.round - 1) + 2.5 * s.released);
  const flyTime = r => Math.max(3.2, 5.2 - 0.3 * (r - 1));
  const DIRS = [-2.6, -2.2, -0.95, -0.55, 0.5, 2.65, -1.25, -1.9];

  function lay(G) { const s = G.s; s.grassY = G.H - HUDH - GRASSH; }
  function turn(d, sp) {
    const a = DIRS[Math.floor(Math.random() * DIRS.length)];
    d.vx = Math.cos(a) * sp; d.vy = Math.sin(a) * sp; d.turn = 0.45 + Math.random() * 0.8;
  }
  function release(G) {
    const s = G.s, n = s.round >= 3 ? 2 : 1, sp = speed(s);
    s.ducks = []; s.shots = 3; s.phase = "fly"; s.flyAway = 0;
    for (let i = 0; i < n && s.released < 10; i++) {
      const x = G.W * (n === 2 ? (i ? 0.58 : 0.22) + Math.random() * 0.2 : 0.2 + Math.random() * 0.6);
      const d = { x, y: s.grassY + 8, vx: 0, vy: 0, turn: 0, st: "fly", t: 0, idx: s.released, rot: 0, hit: 0, sp };
      const a = -Math.PI / 2 + (n === 2 ? (i ? 0.6 : -0.6) : Math.random() < 0.5 ? -0.6 : 0.6) * (0.6 + Math.random() * 0.6);
      d.vx = Math.cos(a) * sp; d.vy = Math.sin(a) * sp; d.turn = 0.7 + Math.random() * 0.5;
      s.ducks.push(d); s.hits[s.released] = null; s.released++;
    }
  }
  function startRound(G) {
    const s = G.s; s.round++; s.released = 0; s.hits = new Array(10).fill(undefined);
    s.phase = "intro"; s.pt = 1.8; s.ducks = []; s.shots = 3;
  }
  function escape(G) {
    const s = G.s; let any = false;
    s.ducks.forEach(d => { if (d.st === "fly") { d.st = "esc"; d.vx *= 0.25; d.vy = -Math.max(280, d.sp * 1.5); any = true; } });
    if (any) { s.flyAway = 1.2; G.sfx("lose"); }
  }

  defGame({
    key: "duck", name: "Duck Dawg", icon: "🦆", max: 99999, cat: "sports",
    blurb: "Tap the ducks before they fly off.",
    how: "Ducks flap up out of the grass. Tap them to pop them with the tennis-ball launcher. 3 shots per release, 10 ducks a round (2 at a time from round 3). Hit at least 6 of 10 to pass (it goes up later). 500+ points a duck, more each round, 10/10 = perfect bonus.",
    reset(G) {
      G.s = { round: 0, score: 0, phase: "intro", pt: 1.8, ducks: [], hits: [], shots: 3, released: 0,
        fx: [], pops: [], dog: null, flyAway: 0, msg: "", msgT: 0, endT: 0, clouds: [] };
      lay(G);
      for (let i = 0; i < 3; i++) G.s.clouds.push({ x: Math.random() * G.W, y: 60 + i * 55 + Math.random() * 20, w: 50 + Math.random() * 40, v: 6 + Math.random() * 6 });
      startRound(G);
    },
    update(G, dt) {
      const s = G.s; lay(G);
      const W = G.W, top = TOPH + 26, low = s.grassY - 22;
      s.clouds.forEach(c => { c.x += c.v * dt; if (c.x - c.w > W) c.x = -c.w; });
      if (s.flyAway > 0) s.flyAway -= dt;
      if (s.msgT > 0) s.msgT -= dt;
      for (let i = s.fx.length - 1; i >= 0; i--) {
        const f = s.fx[i]; f.t -= dt;
        if (f.k === "feather") { f.x += f.vx * dt; f.y += f.vy * dt; f.vy += 60 * dt; f.vx *= 0.97; f.r += f.vr * dt; }
        if (f.t <= 0) s.fx.splice(i, 1);
      }
      for (let i = s.pops.length - 1; i >= 0; i--) { s.pops[i].t -= dt; if (s.pops[i].t <= 0) s.pops.splice(i, 1); }

      if (s.phase === "intro") { s.pt -= dt; if (s.pt <= 0) release(G); return; }
      if (s.phase === "fly") {
        const ft = flyTime(s.round);
        s.ducks.forEach(d => {
          d.t += dt;
          if (d.st === "fly") {
            d.turn -= dt; if (d.turn <= 0) turn(d, d.sp);
            d.x += d.vx * dt; d.y += d.vy * dt;
            if (d.x < 26) { d.x = 26; d.vx = Math.abs(d.vx); }
            if (d.x > W - 26) { d.x = W - 26; d.vx = -Math.abs(d.vx); }
            if (d.y < top) { d.y = top; d.vy = Math.abs(d.vy); }
            if (d.y > low && d.t > 0.6) { d.y = low; d.vy = -Math.abs(d.vy); }
            if (d.t > ft) escape(G);
          } else if (d.st === "hit") {
            d.hit -= dt; if (d.hit <= 0) { d.st = "fall"; d.vy = 40; }
          } else if (d.st === "fall") {
            d.vy += 520 * dt; d.y += d.vy * dt; d.rot += 9 * dt;
            if (d.y > s.grassY + 30) { d.st = "down"; }
          } else if (d.st === "esc") {
            d.x += d.vx * dt; d.y += d.vy * dt;
            if (d.y < -50) { d.st = "gone"; s.hits[d.idx] = false; }
          }
        });
        if (s.ducks.every(d => d.st === "down" || d.st === "gone")) {
          const got = s.ducks.filter(d => d.st === "down");
          s.phase = "dog"; s.pt = 1.6;
          const dx = got.length ? got.reduce((a, d) => a + d.x, 0) / got.length : W / 2;
          s.dog = { x: Math.max(W * 0.32, Math.min(W * 0.62, dx)), n: got.length };
          if (got.length) G.sfx("win");
        }
        return;
      }
      if (s.phase === "dog") {
        s.pt -= dt;
        if (s.pt <= 0) {
          s.dog = null;
          if (s.released < 10) { s.phase = "gap"; s.pt = 0.35; }
          else {
            const h = s.hits.filter(v => v === true).length, nd = need(s.round);
            s.phase = "tally"; s.pt = 2.2;
            if (h >= nd) {
              if (h === 10) { const b = Math.min(5000, 1000 * s.round); s.score = Math.min(99999, s.score + b); s.msg = `PERFECT! +${b}`; }
              else s.msg = `${h}/10  NICE!`;
              s.passed = true; G.sfx("win");
            } else { s.msg = `${h}/10  NEED ${nd}`; s.passed = false; G.sfx("lose"); G.buzz(); s.dog = { x: W / 2, n: -1 }; }
          }
        }
        return;
      }
      if (s.phase === "gap") { s.pt -= dt; if (s.pt <= 0) release(G); return; }
      if (s.phase === "tally") {
        s.pt -= dt;
        if (s.pt <= 0) {
          if (s.passed) startRound(G);
          else G.over(Math.min(99999, s.score), s.round >= 6 ? "Top duck dawg!" : s.round >= 3 ? "The ducks got away!" : "Quack quack. Ha ha.");
        }
      }
    },
    tap(G, x, y) {
      const s = G.s;
      if (s.phase !== "fly" || s.shots <= 0 || !s.ducks.some(d => d.st === "fly")) return;
      s.shots--;
      s.fx.push({ k: "cross", x, y, t: 0.18 });
      let best = null, bd = 40;
      s.ducks.forEach(d => { if (d.st !== "fly") return; const dd = Math.hypot(d.x - x, d.y - y); if (dd < bd) { bd = dd; best = d; } });
      if (best) {
        best.st = "hit"; best.hit = 0.35; s.hits[best.idx] = true;
        const p = pts(s.round); s.score = Math.min(99999, s.score + p);
        s.pops.push({ x: best.x, y: best.y - 28, t: 0.8, txt: "+" + p });
        s.fx.push({ k: "boom", x: best.x, y: best.y, t: 0.3 });
        for (let i = 0; i < 6; i++) s.fx.push({ k: "feather", x: best.x, y: best.y, vx: (Math.random() - 0.5) * 160, vy: -40 - Math.random() * 80, r: Math.random() * 6, vr: (Math.random() - 0.5) * 8, t: 0.8 + Math.random() * 0.4 });
        G.sfx("pop");
      } else {
        s.fx.push({ k: "miss", x, y, t: 0.3 });
        if (s.shots <= 0) escape(G);
      }
      if (s.shots <= 0 && s.ducks.some(d => d.st === "fly")) escape(G);
    },
    draw(G, c) {
      const s = G.s, W = G.W, H = G.H, dark = G.dark();
      lay(G);
      const gy = s.grassY;
      // sky
      const g = c.createLinearGradient(0, 0, 0, gy);
      if (dark) { g.addColorStop(0, "#1d1a45"); g.addColorStop(0.6, "#4a3570"); g.addColorStop(1, "#c96d5a"); }
      else { g.addColorStop(0, "#4fa8f0"); g.addColorStop(1, "#a6dcff"); }
      c.fillStyle = g; c.fillRect(0, 0, W, gy + 10);
      if (s.flyAway > 0) { c.fillStyle = `rgba(255,140,170,${Math.min(0.45, s.flyAway * 0.5)})`; c.fillRect(0, 0, W, gy + 10); }
      if (dark) { c.fillStyle = "#fff6c8"; c.beginPath(); c.arc(W - 60, 70, 18, 0, 7); c.fill(); c.fillStyle = "rgba(255,255,255,0.7)"; for (let i = 0; i < 14; i++) c.fillRect((i * 97) % W, 40 + (i * 53) % 140, 2, 2); }
      c.fillStyle = dark ? "rgba(220,200,255,0.25)" : "rgba(255,255,255,0.85)";
      s.clouds.forEach(cl => { c.fillRect(cl.x - cl.w / 2, cl.y, cl.w, 10); c.fillRect(cl.x - cl.w / 3, cl.y - 8, cl.w * 0.55, 8); c.fillRect(cl.x - cl.w / 2 + 6, cl.y + 10, cl.w - 12, 5); });
      // tree (left)
      const tx = Math.max(46, W * 0.14);
      c.fillStyle = dark ? "#4a2f22" : "#7a4a2a"; c.fillRect(tx - 9, gy - 150, 18, 160);
      c.fillRect(tx, gy - 110, 34, 8); c.fillRect(tx + 26, gy - 124, 8, 18);
      c.fillStyle = dark ? "#1f4a2a" : "#2f9a3c";
      [[0, -190, 46], [-30, -165, 32], [30, -168, 34], [0, -150, 30], [40, -132, 20]].forEach(([dx, dy, r]) => { c.beginPath(); c.arc(tx + dx, gy + dy, r, 0, 7); c.fill(); });
      c.fillStyle = dark ? "#2a5c34" : "#45b552";
      [[-12, -200, 18], [18, -180, 14], [-34, -170, 12]].forEach(([dx, dy, r]) => { c.beginPath(); c.arc(tx + dx, gy + dy, r, 0, 7); c.fill(); });
      // dog (behind grass)
      if (s.dog) {
        const total = s.dog.n < 0 ? 2.2 : 1.6, el = total - s.pt, up = Math.min(1, el * 4, Math.max(0, s.pt) * 4);
        const dy = gy + 50 - 85 * up, dx = s.dog.x;
        if (s.dog.n > 0) {
          G.img(c, ":dawgW:", dx, dy, 70);
          G.emoji(c, "🦆", dx + 34, dy - 8, 30);
          if (s.dog.n > 1) G.emoji(c, "🦆", dx - 34, dy - 8, 30);
        } else {
          G.img(c, ":dawgclown:", dx, dy + Math.sin(G.t * 30) * 3, 70);
          if (up > 0.9) G.text(c, "HA HA", dx, dy - 50, 12, dark ? "#ffd23f" : "#c0392b");
        }
      }
      // ducks
      (s.ducks || []).forEach(d => {
        if (d.st === "gone" || d.st === "down") return;
        c.save(); c.translate(d.x, d.y);
        if (d.st === "fall") { c.rotate(d.rot); G.emoji(c, "🦆", 0, 0, 40); }
        else {
          const flip = d.vx > 0 ? -1 : 1, flap = d.st === "hit" ? 1 : 1 + 0.16 * Math.sin(d.t * 22);
          c.scale(flip, flap); G.emoji(c, "🦆", 0, 0, 44);
        }
        c.restore();
        if (d.st === "hit") G.emoji(c, "💥", d.x, d.y, 46);
      });
      // grass + bush (front)
      c.fillStyle = dark ? "#1e5a24" : "#3fae3a";
      for (let x = 0; x < W; x += 9) { const h = 14 + ((x * 7) % 13); c.beginPath(); c.moveTo(x, gy + 6); c.lineTo(x + 4, gy - h); c.lineTo(x + 9, gy + 6); c.fill(); }
      c.fillRect(0, gy, W, GRASSH - 14);
      c.fillStyle = dark ? "#164a1c" : "#2e9230";
      for (let x = 5; x < W; x += 14) { const h = 10 + ((x * 5) % 9); c.beginPath(); c.moveTo(x, gy + 18); c.lineTo(x + 3, gy + 18 - h); c.lineTo(x + 7, gy + 18); c.fill(); }
      c.fillStyle = dark ? "#4a3220" : "#9a6a3a"; c.fillRect(0, gy + GRASSH - 14, W, 14);
      c.fillStyle = dark ? "#3a2618" : "#7c5228"; for (let x = 0; x < W; x += 16) c.fillRect(x + ((x / 16) % 2) * 6, gy + GRASSH - 9, 6, 3);
      const bx = W - Math.max(50, W * 0.14);
      c.fillStyle = dark ? "#1a4e22" : "#2c8f35";
      [[0, -6, 30], [-26, 4, 22], [26, 4, 22], [0, 10, 24]].forEach(([dx, dy, r]) => { c.beginPath(); c.arc(bx + dx, gy + dy, r, 0, 7); c.fill(); });
      c.fillStyle = dark ? "#2a6a30" : "#4cc052"; c.beginPath(); c.arc(bx - 8, gy - 16, 10, 0, 7); c.fill();
      // effects
      s.fx.forEach(f => {
        if (f.k === "feather") { c.save(); c.translate(f.x, f.y); c.rotate(f.r); G.emoji(c, "🪶", 0, 0, 16); c.restore(); }
        else if (f.k === "cross") {
          const a = f.t / 0.18; c.strokeStyle = `rgba(255,${dark ? 230 : 40},${dark ? 80 : 40},${a})`; c.lineWidth = 3;
          c.beginPath(); c.arc(f.x, f.y, 18, 0, 7); c.moveTo(f.x - 28, f.y); c.lineTo(f.x - 8, f.y); c.moveTo(f.x + 8, f.y); c.lineTo(f.x + 28, f.y);
          c.moveTo(f.x, f.y - 28); c.lineTo(f.x, f.y - 8); c.moveTo(f.x, f.y + 8); c.lineTo(f.x, f.y + 28); c.stroke();
          G.emoji(c, "🎾", f.x, f.y, 10 + 14 * a);
        } else if (f.k === "miss") { c.globalAlpha = Math.max(0, f.t / 0.3); G.emoji(c, "💨", f.x, f.y - 6, 22); c.globalAlpha = 1; }
      });
      s.pops.forEach(p => { const py = Math.max(TOPH + 14, p.y - (0.8 - p.t) * 30); G.text(c, p.txt, p.x + 1, py + 1, 12, "rgba(0,0,0,0.6)"); G.text(c, p.txt, p.x, py, 12, "#ffd23f"); });
      // top HUD (shared look): score | round | shots left
      G.hud(c, `${s.score || 0} PTS`, `ROUND ${s.round || 1}`, ["", "🎾", "🎾 🎾", "🎾 🎾 🎾"][Math.max(0, Math.min(3, s.shots))] || "NO SHOTS");
      // center messages
      const my = Math.max(TOPH + 60, gy * 0.38);
      if (s.phase === "intro") {
        G.banner(c, `ROUND ${s.round}`, "#fff", my);
        G.text(c, `HIT ${need(s.round)} OF 10`, W / 2 + 1, my + 33, 12, "rgba(0,0,0,0.6)");
        G.text(c, `HIT ${need(s.round)} OF 10`, W / 2, my + 32, 12, "#ffd23f");
      } else if (s.phase === "tally") {
        G.banner(c, s.passed ? "ROUND CLEAR!" : "GAME OVER", s.passed ? "#7CFC6a" : "#ff6b6b", my);
        G.text(c, s.msg, W / 2 + 1, my + 33, 12, "rgba(0,0,0,0.6)");
        G.text(c, s.msg, W / 2, my + 32, 12, "#ffd23f");
      } else if (s.flyAway > 0) {
        G.banner(c, "FLY AWAY!", "#fff", my);
      }
      if (s.round === 1) G.hint(c, "TAP THE DUCKS", 5, gy + 26);
      // bottom bar: hit tracker (blue bar = ducks needed to pass)
      const hy = H - HUDH;
      c.fillStyle = "#111"; c.fillRect(0, hy, W, HUDH);
      c.fillStyle = "#1c1c1c"; c.fillRect(6, hy + 6, W - 12, HUDH - 12);
      c.strokeStyle = "#7CFC6a"; c.lineWidth = 2; c.strokeRect(7, hy + 7, W - 14, HUDH - 14);
      const nh = (s.hits || []).filter(v => v === true).length, nd = need(s.round || 1);
      G.text(c, "HIT", 18, hy + 20, 10, "#7CFC6a", "left");
      G.text(c, `${nh}/${nd}`, 18, hy + 38, 10, nh >= nd ? "#7CFC6a" : "#fff", "left");
      const sx = 72, step = Math.min(26, (W - sx - 16) / 10);
      const blink = Math.floor(G.t * 4) % 2 === 0;
      for (let i = 0; i < 10; i++) {
        const v = s.hits ? s.hits[i] : undefined, x = sx + i * step, y = hy + 24;
        let col = "#f4f4f4";
        if (v === true) col = "#ff4d4d"; else if (v === false) col = "#444";
        else if (v === null && s.phase === "fly" && !blink) col = "#1c1c1c";
        c.fillStyle = col; c.fillRect(x, y - 2, 9, 6); c.fillRect(x + 6, y - 6, 5, 5);
        if (v !== false) { c.fillStyle = col === "#1c1c1c" ? col : "#ffb02e"; c.fillRect(x + 11, y - 4, 3, 2); }
        if (i < nd) { c.fillStyle = "#3a8cff"; c.fillRect(x, hy + 36, step - 4, 5); }
      }
    }
  });
})();
