// ---------- Dawg Hoops (boardwalk basketball shootout) ----------
// Flick up from the ball to shoot at the hoop. 60 seconds. +2 a make, +3 in the last 15s (fire mode),
// +1 swish bonus, x2 after 3 in a row (x3 after 6). From 20 points the hoop slides side to side.
(function () {
  const GRAV = 1600, TIME = 60, FIRE = 15;

  function geo(G) {
    const s = G.s, W = G.W, H = G.H;
    s.R = Math.min(W * 0.15, 56);                 // rim half-width
    s.rimY = Math.max(118, H * 0.3);
    s.bx0 = W / 2; s.by0 = H - Math.max(70, H * 0.13);
    s.br0 = Math.min(32, W * 0.08);               // ball radius up close
  }

  function shoot(G, f, dxRatio) {
    const s = G.s;
    if (!s.ready || s.balls.length >= 5) return;
    const ff = Math.max(0.35, Math.min(1.9, 1 + (f - 1) * 0.4)); // soften power error: wide sweet spot
    const d = ff - 1;
    const rise = s.by0 - s.rimY;
    const hIdeal = rise + Math.max(90, rise * 0.42);
    const vy0 = Math.sqrt(2 * GRAV * hIdeal) * ff;  // up speed (positive = up)
    // time until it comes back down through the rim height
    const disc = vy0 * vy0 - 2 * GRAV * rise;
    const T = disc > 0 ? (vy0 + Math.sqrt(disc)) / GRAV : (2 * vy0) / GRAV;
    const Tapex = vy0 / GRAV;
    // aim: extend the flick line to the rim height, then help it toward the hoop
    let aimX = s.bx0 + dxRatio * rise;
    const pred = (s.hx + hoopX(G, s.hp + s.hsp * T)) / 2;
    if (Math.abs(aimX - pred) < s.R * 1.9) aimX += (pred - aimX) * 0.55;
    s.balls.push({ x: s.bx0, y: s.by0, vx: (aimX - s.bx0) / T, vy: -vy0, t: 0, T: disc > 0 ? T : Tapex * 1.6, d,
      air: d < -0.42, nocoll: false, active: false, touched: false, crossed: false, done: false, banked: false, spin: 0, fade: 1 });
    s.shots++; s.ready = false; s.respawn = 0.28; s.drag = null;
    G.sfx("pop");
  }

  function hoopX(G, p) { const s = G.s; return G.W / 2 + s.amp * Math.sin(p); }

  function make(G, b) {
    const s = G.s;
    b.done = true; b.crossed = true;
    s.streak++;
    const fire = s.time <= FIRE;
    let pts = fire ? 3 : 2;
    const swish = !b.touched && !b.banked;
    if (swish) pts += 1;
    const mult = s.streak >= 6 ? 3 : s.streak >= 3 ? 2 : 1;
    pts *= mult;
    s.score = Math.min(9999, s.score + pts);
    s.makes++;
    s.pops.length = 0;
    s.net = 1; s.mood = ":dawgpog:"; s.moodT = 0.9;
    s.pops.push({ x: s.hx, y: s.rimY + s.R * 1.05 + 34, t: 0.9, txt: (swish ? "SWISH! " : "") + "+" + pts, c: swish ? "#7df9ff" : "#ffd23f" });
    if (mult > 1) s.pops.push({ x: s.hx, y: s.rimY + s.R * 1.05 + 56, t: 0.9, txt: "x" + mult + " STREAK", c: "#ff8a3d" });
    G.sfx(swish ? "win" : "pop");
  }

  function miss(G, b) {
    const s = G.s;
    b.done = true;
    s.streak = 0; s.mood = ":dawgsweat:"; s.moodT = 0.9;
  }

  defGame({
    key: "hoops", name: "Dawg Hoops", icon: "🏀", max: 9999, cat: "sports",
    blurb: "60 seconds. Flick it in.",
    how: "Flick up from the ball toward the hoop to shoot. Faster flick = more power, aim with the angle. 2 points a bucket, 3 in the last 15 seconds, +1 for a swish, and 3 in a row doubles your points. Past 20 points the hoop starts moving!",
    reset(G) {
      G.s = { time: TIME, score: 0, streak: 0, makes: 0, shots: 0, balls: [], pops: [], ready: true, respawn: 0,
        drag: null, hp: 0, hsp: 0, amp: 0, hx: G.W / 2, net: 0, mood: ":dawgW:", moodT: 0, flash: 0 };
      geo(G);
    },
    update(G, dt) {
      const s = G.s;
      s.time -= dt;
      if (s.time <= 0) {
        s.time = 0;
        G.over(s.score, s.score >= 120 ? "Unstoppable!" : s.score >= 70 ? "On fire!" : s.score >= 35 ? "Buckets!" : s.score > 0 ? "Brick city." : "Air dawg.");
        return;
      }
      // moving hoop from 20 points on, faster as the score climbs
      if (s.score >= 20) {
        const lvl = Math.min(1, (s.score - 20) / 80);
        const ampT = Math.min(G.W / 2 - s.R * 1.9, G.W * (0.16 + 0.12 * lvl));
        s.amp += (ampT - s.amp) * Math.min(1, dt * 1.5);
        s.hsp = 0.9 + 1.4 * lvl;
      }
      s.hp += s.hsp * dt;
      s.hx = hoopX(G, s.hp);
      if (!s.ready) { s.respawn -= dt; if (s.respawn <= 0) s.ready = true; }
      const R = s.R, rimY = s.rimY;
      for (const b of s.balls) {
        const py = b.y;
        b.t += dt; b.vy += GRAV * dt; b.x += b.vx * dt; b.y += b.vy * dt; b.spin += dt * 8;
        const p = Math.min(1, b.t / b.T);
        b.r = s.br0 * (1 - 0.55 * Math.min(1, p * 1.25));
        const near = Math.abs(b.x - s.hx) < R + b.r + 6;
        if (!b.active && !b.air && b.vy > 0 && p > 0.7) b.active = true;
        if (b.active && !b.nocoll && !b.done) {
          // long shot: bank off the backboard, drop toward the rim
          if (!b.banked && b.d > 0.18 && b.d <= 0.5 && py < rimY - R * 0.8 && b.y >= rimY - R * 0.8 && Math.abs(b.x - s.hx) < R * 1.75) {
            b.banked = true; b.vy = -Math.abs(b.vy) * 0.18; b.vx = b.vx * 0.4 + (s.hx - b.x) * 1.2; b.d = 0; G.sfx("pop");
          }
          // crossing the rim plane with a depth error: front/back iron
          if (py < rimY - 2 && b.y >= rimY - 2 && near) {
            if (b.d > 0.5) {
              if (b.d > 0.75) { b.nocoll = true; b.behind = true; b.vy = -260; b.vx += (b.x < s.hx ? -1 : 1) * 120; }
              else { b.vy = -(320 + Math.random() * 160); b.vx = (s.hx - b.x) * (Math.random() < 0.5 ? 2 : -3) + (b.x < s.hx ? -1 : 1) * 60 * Math.random(); b.d = 0; b.touched = true; }
              G.sfx("pop");
            } else if (b.d < -0.18) {
              b.vy = -(260 + Math.random() * 200); b.vx = (s.hx - b.x) * (Math.random() < 0.45 ? 2.2 : -2.5) + (Math.random() - 0.5) * 120;
              b.d = 0; b.touched = true; G.sfx("pop");
            }
          }
          // lateral rim ends: circle bounces
          if (!b.nocoll && b.y > rimY - b.r - 6 && b.y < rimY + b.r + 6) {
            for (let k = -1; k <= 1; k += 2) {
              const rx = s.hx + k * R, ddx = b.x - rx, ddy = b.y - rimY, dist = Math.hypot(ddx, ddy), m = b.r + 4;
              if (dist < m && dist > 0.01) {
                const nx = ddx / dist, ny = ddy / dist, vn = b.vx * nx + b.vy * ny;
                b.x = rx + nx * m; b.y = rimY + ny * m;
                if (vn < 0) { b.vx -= 1.55 * vn * nx; b.vy -= 1.55 * vn * ny; b.touched = true; if (Math.abs(vn) > 120) G.sfx("pop"); }
              }
            }
          }
          // the make: center passes down through the rim (generous window)
          if (!b.done && py < rimY && b.y >= rimY && Math.abs(b.x - s.hx) < R - b.r * 0.25 && b.d >= -0.18 && b.d <= 0.5) make(G, b);
        }
        if (b.done && b.crossed) { b.vx *= 0.9; }       // drop straight through the net
        if (b.y > G.H + 60 || b.x < -80 || b.x > G.W + 80) { if (!b.done) miss(G, b); b.gone = true; }
        if (b.behind) { b.fade -= dt * 1.5; if (b.fade <= 0) { if (!b.done) miss(G, b); b.gone = true; } }
      }
      if (s.balls.some(b => b.gone)) s.balls = s.balls.filter(b => !b.gone);
      s.net = Math.max(0, s.net - dt * 2.5);
      if (s.moodT > 0) { s.moodT -= dt; if (s.moodT <= 0) s.mood = ":dawgW:"; }
      for (const p of s.pops) p.t -= dt;
      if (s.pops.length && s.pops[0].t <= 0) s.pops = s.pops.filter(p => p.t > 0);
    },
    down(G, x, y) {
      const s = G.s;
      if (!s.ready || y < s.rimY + 40) return;
      s.drag = { x0: x, y0: y, x, y, pts: [[x, y, performance.now()]] };
    },
    move(G, x, y) {
      const d = G.s.drag; if (!d) return;
      d.x = x; d.y = y; d.pts.push([x, y, performance.now()]);
      if (d.pts.length > 12) d.pts.shift();
    },
    up(G, x, y) {
      const s = G.s, d = s.drag; s.drag = null;
      if (!d) return;
      const now = performance.now();
      d.pts.push([x, y, now]);
      const dy = y - d.y0, dx = x - d.x0;
      if (dy > -30) return;                             // needs an upward flick
      // peak upward speed over ~40ms spans, blended with the drag length (forgiving for slow or short flicks)
      let vUp = 0;
      for (let i = d.pts.length - 1; i > 0; i--) {
        const q = d.pts[i];
        for (let j = i - 1; j >= 0; j--) {
          const o = d.pts[j], dtm = (q[2] - o[2]) / 1000;
          if (dtm >= 0.04) { vUp = Math.max(vUp, (o[1] - q[1]) / dtm); break; }
        }
      }
      if (vUp === 0) vUp = -dy / 0.04;
      const f = Math.min(3, 0.5 * vUp / 1400 + 0.5 * -dy / Math.max(150, (s.by0 - s.rimY) * 0.6));
      shoot(G, f, dx / -dy);
    },
    onKey(G, k, isDown) {
      if (!isDown) return;
      const s = G.s;
      if (k === " " || k === "ArrowUp" || k === "w") {
        const rise = s.by0 - s.rimY;
        shoot(G, 0.9 + Math.random() * 0.2, (s.hx - s.bx0) / rise + (Math.random() - 0.5) * 0.15);
      }
    },
    draw(G, c) {
      const s = G.s, W = G.W, H = G.H, dark = G.dark(), R = s.R, rimY = s.rimY, hx = s.hx;
      const fire = s.time <= FIRE && s.time > 0 && G.state === "play";
      // boardwalk arcade booth
      c.fillStyle = dark ? "#1a1033" : "#ffd9a8"; c.fillRect(0, 0, W, H);
      c.fillStyle = dark ? "#251548" : "#ffc98a";
      for (let x = 0; x < W; x += 40) c.fillRect(x, 0, 20, H * 0.62);
      // marquee lights
      for (let x = 10, i = 0; x < W; x += 24, i++) {
        const on = ((i + Math.floor(G.t * 4)) % 3) === 0;
        c.fillStyle = on ? (fire ? "#ff5a1f" : "#ffe14d") : (dark ? "#5a4a2a" : "#c9a060");
        c.beginPath(); c.arc(x, 46, 4, 0, 7); c.fill();
      }
      // floor: ramp lane
      const fy = H * 0.62;
      c.fillStyle = dark ? "#3a2416" : "#c98a4b"; c.fillRect(0, fy, W, H - fy);
      c.fillStyle = dark ? "#2c1a10" : "#b4773c";
      for (let y = fy + 14; y < H; y += 26) c.fillRect(0, y, W, 4);
      c.fillStyle = dark ? "#0e5c3a" : "#2fa36b";
      c.beginPath(); c.moveTo(W * 0.3, fy); c.lineTo(W * 0.7, fy); c.lineTo(W * 0.92, H); c.lineTo(W * 0.08, H); c.closePath(); c.fill();
      c.strokeStyle = dark ? "#1b8a5c" : "#55c48c"; c.lineWidth = 3; c.stroke();
      // pole + backboard
      const bw = R * 1.75, bt = rimY - R * 1.5, bb = rimY + R * 0.25;
      c.fillStyle = dark ? "#55556a" : "#7a7a8c"; c.fillRect(hx - 5, bb, 10, fy - bb);
      c.fillStyle = dark ? "#e8eef7" : "#ffffff"; c.fillRect(hx - bw, bt, bw * 2, bb - bt);
      c.strokeStyle = fire ? "#ff5a1f" : "#d83a3a"; c.lineWidth = 4; c.strokeRect(hx - bw, bt, bw * 2, bb - bt);
      c.lineWidth = 3; c.strokeRect(hx - R * 0.6, rimY - R * 0.75, R * 1.2, R * 0.7);
      // back half of the rim
      const rimCol = fire ? "#ff5a1f" : "#ff7a1a";
      if (fire) { c.shadowColor = "#ffb000"; c.shadowBlur = 14 + 6 * Math.sin(G.t * 12); }
      c.strokeStyle = rimCol; c.lineWidth = 5;
      c.beginPath(); c.ellipse(hx, rimY, R, R * 0.28, 0, Math.PI, Math.PI * 2); c.stroke();
      c.shadowBlur = 0;
      // balls behind the front rim (coming down into the hoop)
      for (const b of s.balls) if (b.active || b.behind) drawBall(c, b);
      // net
      const nh = R * 1.05, sw = s.net * 6 * Math.sin(G.t * 30);
      c.strokeStyle = dark ? "#e6e6f0" : "#ffffff"; c.lineWidth = 2;
      for (let i = 0; i <= 6; i++) {
        const u = i / 6, x1 = hx - R + u * 2 * R, x2 = hx - R * 0.6 + u * 1.2 * R + sw;
        c.beginPath(); c.moveTo(x1, rimY); c.lineTo(x2, rimY + nh + s.net * 8); c.stroke();
      }
      for (let j = 1; j <= 3; j++) {
        const v = j / 3, w = R * (1 - 0.4 * v);
        c.beginPath(); c.ellipse(hx + sw * v, rimY + nh * v + s.net * 8 * v, w, R * 0.12, 0, 0, Math.PI); c.stroke();
      }
      // front half of the rim
      if (fire) { c.shadowColor = "#ffb000"; c.shadowBlur = 14 + 6 * Math.sin(G.t * 12); }
      c.strokeStyle = rimCol; c.lineWidth = 5;
      c.beginPath(); c.ellipse(hx, rimY, R, R * 0.28, 0, 0, Math.PI); c.stroke();
      c.shadowBlur = 0;
      if (fire) G.emoji(c, "🔥", hx + R + 8, rimY - 4, 20);
      // rising balls are in front of everything
      for (const b of s.balls) if (!b.active && !b.behind) drawBall(c, b);
      // ball waiting at the bottom
      if (s.ready && G.state !== "over") {
        let bx = s.bx0, by = s.by0;
        if (s.drag) { bx += Math.max(-30, Math.min(30, (s.drag.x - s.drag.x0) * 0.3)); by += Math.max(-30, Math.min(10, (s.drag.y - s.drag.y0) * 0.3)); }
        c.fillStyle = "rgba(0,0,0,0.25)"; c.beginPath(); c.ellipse(s.bx0, s.by0 + s.br0 + 4, s.br0 * 0.9, 6, 0, 0, 7); c.fill();
        drawBall(c, { x: bx, y: by, r: s.br0, spin: 0, fade: 1 });
        if (!s.drag && s.shots === 0) {
          const bob = Math.sin(G.t * 5) * 6;
          G.emoji(c, "👆", W / 2 + s.br0 + 18, s.by0 + 4 + bob, 26);
        }
      }
      // the dog cheering on the side
      const dy = Math.sin(G.t * (s.mood === ":dawgpog:" ? 14 : 3)) * (s.mood === ":dawgpog:" ? 6 : 2);
      const ds = Math.min(78, W * 0.2);
      G.img(c, s.mood || ":dawgW:", ds * 0.55, fy + ds * 0.45 + dy, ds);
      if (s.mood === ":dawgpog:") G.emoji(c, "🙌", ds * 0.55 + ds * 0.55, fy + ds * 0.1 + dy, 22);
      // popups
      for (const p of s.pops) { const py = p.y - (0.9 - p.t) * 18; c.globalAlpha = Math.min(1, p.t * 4); c.fillStyle = "rgba(25,12,45,0.82)"; const w = p.txt.length * 12 + 14; c.fillRect(p.x - w / 2, py - 11, w, 22); G.text(c, p.txt, p.x, py + 1, 12, p.c); c.globalAlpha = 1; }
      G.hint(c, "FLICK UP TO SHOOT", s.shots === 0 && !fire ? Math.max(5, G.t + 1) : 5, s.by0 - s.br0 - 30);
      // big moment: fire mode kicks in
      if (fire && s.time > FIRE - 1.6) G.banner(c, "FIRE MODE!", "#ff5a1f", (fy + s.by0 - s.br0) / 2, Math.max(16, Math.min(20, W / 19)));
      // HUD
      const tl = Math.max(0, Math.ceil(s.time || 0));
      G.hud(c, `${s.score || 0} PTS`, s.streak >= 3 ? `x${s.streak >= 6 ? 3 : 2} STREAK` : s.streak >= 2 ? `STREAK ${s.streak}` : "", `${tl}s`, { color: s.streak >= 3 ? "#ff8a3d" : "#fff" });
      const sub = fire ? "FIRE! 3 PTS" : s.score >= 20 && s.score < 26 ? "HOOP ON THE MOVE!" : "";
      if (sub) { // small status pill just above the floor line, clear of the backboard
        c.font = "11px 'Press Start 2P', ui-monospace, monospace"; const sw = c.measureText(sub).width + 22;
        c.fillStyle = "rgba(20,10,40,0.7)"; c.beginPath(); if (c.roundRect) c.roundRect(W / 2 - sw / 2, fy - 30, sw, 22, 11); else c.rect(W / 2 - sw / 2, fy - 30, sw, 22); c.fill();
        G.text(c, sub, W / 2, fy - 19, 11, fire ? "#ff8a3d" : "#ffe14d");
      }
    }
  });

  function drawBall(c, b) {
    c.save(); c.globalAlpha = Math.max(0, b.fade);
    c.translate(b.x, b.y); c.rotate(b.spin);
    const r = b.r;
    c.fillStyle = "#f26b1d"; c.beginPath(); c.arc(0, 0, r, 0, 7); c.fill();
    c.strokeStyle = "#5a2200"; c.lineWidth = Math.max(1.5, r * 0.09);
    c.stroke();
    c.beginPath(); c.moveTo(-r, 0); c.lineTo(r, 0); c.moveTo(0, -r); c.lineTo(0, r); c.stroke();
    c.beginPath(); c.arc(-r * 1.25, 0, r * 0.85, -0.85, 0.85); c.stroke();
    c.beginPath(); c.arc(r * 1.25, 0, r * 0.85, Math.PI - 0.85, Math.PI + 0.85); c.stroke();
    c.fillStyle = "rgba(255,255,255,0.25)"; c.beginPath(); c.arc(-r * 0.35, -r * 0.35, r * 0.3, 0, 7); c.fill();
    c.restore();
  }
})();
