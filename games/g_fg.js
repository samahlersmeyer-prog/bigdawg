// ---------- Kick Dawg (field goals in the wind) ----------
// View from behind the kicker. Two taps per kick: (1) an AIM arrow swings left/right - tap to lock it,
// (2) a POWER meter fills up and down - tap to lock it. Wind bends the ball in flight, so lock the aim off-center.
// Score = total yards of made kicks. Start at 20 yds, +5 after every make. 3 misses ends it.
(function () {
  const TH = 38 * Math.PI / 180, GRAV = 10.7, SIMS = 1.55;           // launch angle, gravity (yd/s^2), sim speed-up
  const HW = 3.08, BAR = 3.33, UPH = 10, BR = 0.16, POST = 0.12;     // half gap, crossbar height, upright height (yards)
  const WINDK = 0.12;                                                  // yd/s^2 of sideways push per mph
  const AMAX = 0.30;                                                   // aim arrow swing (radians each side)
  const P = { x: 0, y: 0, s: 0 };
  const clamp = (v, a, b) => v < a ? a : v > b ? b : v;
  const rangeOf = p => 16 + 68 * p;                                    // carry (yards) at a given power 0..1
  function lay(G) { const H = G.H; return { hz: H * 0.45, f: H * 0.95, cz: 5, ch: 1.6 }; }
  function proj(G, X, Y, Z) {
    const L = G.s.L, s = L.f / Math.max(0.5, Z + L.cz);
    P.s = s; P.x = G.W / 2 + (X - G.s.camX) * s; P.y = L.hz + (L.ch - Y) * s; return P;
  }
  function needP(D) { // power that just clears the bar with zero wind
    const R = D / Math.max(0.05, 1 - (BAR + 0.5) / (D * Math.tan(TH)));
    return clamp((R - 16) / 68, 0, 1);
  }

  function newKick(G) {
    const s = G.s, D = s.dist;
    s.phase = "aim"; s.res = null; s.ft = 0; s.crossed = false; s.decided = false; s.doink = false;
    s.face = ":dawgW:"; s.kickT = 0; s.lockT = 0.35; s.aim = 0; s.pow = 0;
    s.aph = Math.random() * 6.28; s.pph = 0;
    // hash mark: the ball sits a little left or right of center (more on longer kicks)
    s.bx = (Math.random() * 2 - 1) * Math.min(3, 1 + D * 0.04);
    s.camX = s.bx * 0.85;
    s.pan = 0;
    s.ball = { x: s.bx, y: 0.22, z: 0, vx: 0, vy: 0, vz: 0, rot: 0, spin: 0, ax: 0, on: false };
    // wind grows with distance (and a touch with every kick)
    const mx = Math.min(24, 3 + (D - 20) * 0.42 + s.kicks * 0.15);
    const mph = Math.round(mx * (0.3 + 0.7 * Math.random()));
    s.wind = (Math.random() < 0.5 ? -1 : 1) * Math.max(1, mph);
    s.aspd = 2.3 + (D - 20) * 0.035;   // arrow swing speed (rad/s of phase)
    s.pspd = 1.15 + (D - 20) * 0.018;  // meter speed (full sweeps per second)
  }

  function lockTap(G) {
    const s = G.s;
    if (G.state !== "play" || s.lockT > 0) return;
    if (s.phase === "aim") { s.phase = "power"; s.pph = 0; s.pow = 0; s.lockT = 0.12; G.sfx("pop"); }
    else if (s.phase === "power") kick(G);
  }

  function kick(G) {
    const s = G.s, b = s.ball, R = rangeOf(s.pow), v = Math.sqrt(R * GRAV / Math.sin(2 * TH));
    const vh = v * Math.cos(TH);
    b.vx = vh * Math.sin(s.aim); b.vz = vh * Math.cos(s.aim); b.vy = v * Math.sin(TH);
    b.ax = s.wind * WINDK; b.on = true; b.spin = 9 + s.pow * 6;
    s.phase = "fly"; s.kickT = 0.2; s.ft = 0; s.kicks++;
    G.sfx("pop"); G.buzz();
  }

  function decide(G, good, txt, sub) {
    const s = G.s; if (s.decided) return;
    s.decided = true; s.res = { good, txt, sub: sub || "", t: 0 };
    if (good) {
      s.score = Math.min(9999, s.score + s.dist); s.makes++; s.face = ":dawgpog:";
      s.long = Math.max(s.long, s.dist);
      G.sfx("win");
    } else {
      s.miss++; s.face = s.miss >= 3 ? ":dawgpain:" : s.doink ? ":dawgsweat:" : (Math.random() < 0.5 ? ":dawgcope:" : ":dawgL:");
      G.sfx("lose"); G.buzz();
    }
  }

  defGame({
    key: "fg", name: "Kick Dawg", icon: "🏈", max: 9999, cat: "sports",
    blurb: "Field goals. Read the wind. Split the uprights.",
    how: "Two taps per kick. TAP to lock the swinging AIM arrow, then TAP to lock the POWER meter. WIND (top left, and the flags on the posts) bends the ball, so aim into it. Every make scores its yards and moves you back 5. 3 misses and you're done.",
    reset(G) {
      G.s = { L: lay(G), dist: 20, score: 0, makes: 0, miss: 0, kicks: 0, long: 0, face: ":dawgW:", wind: 0, camX: 0 };
      newKick(G);
    },
    update(G, dt) {
      const s = G.s, b = s.ball, D = s.dist;
      s.L = lay(G);
      if (s.lockT > 0) s.lockT -= dt;
      if (s.kickT > 0) s.kickT -= dt;
      if (s.phase === "aim") { s.aph += dt * s.aspd; s.aim = AMAX * Math.sin(s.aph); }
      else if (s.phase === "power") {
        s.pph = (s.pph + dt * s.pspd) % 2;               // 0..2 : up then down
        s.pow = s.pph < 1 ? s.pph : 2 - s.pph;
      } else if (s.phase === "fly") {
        s.ft += dt;
        const n = 3, st = dt * SIMS / n;
        for (let i = 0; i < n && b.on; i++) {
          const pz = b.z, px = b.x, py = b.y;
          b.vx += b.ax * st; b.vy -= GRAV * st;
          b.x += b.vx * st; b.y += b.vy * st; b.z += b.vz * st; b.rot += b.spin * st;
          if (!s.crossed && pz < D && b.z >= D) {      // reaching the plane of the uprights
            s.crossed = true;
            const f = (D - pz) / (b.z - pz), cx = px + (b.x - px) * f, cy = py + (b.y - py) * f, ax = Math.abs(cx);
            if (cy > BAR - BR && Math.abs(ax - HW) < POST + BR) {           // off an upright
              s.doink = true; b.vx = -b.vx * 0.6 - Math.sign(cx) * 2; b.vz = -Math.abs(b.vz) * 0.25; b.z = D - 0.05;
              decide(G, false, "DOINK!", "OFF THE UPRIGHT");
            } else if (ax < HW && Math.abs(cy - BAR) < BR + 0.05) {        // off the crossbar
              s.doink = true;
              if (cy >= BAR) { b.vy = Math.abs(b.vy) * 0.4 + 1; b.vz *= 0.5; decide(G, true, "DOINK! GOOD!", "OFF THE BAR AND IN"); }
              else { b.vy = Math.abs(b.vy) * 0.3; b.vz = -Math.abs(b.vz) * 0.3; b.z = D - 0.05; decide(G, false, "DOINK!", "OFF THE CROSSBAR"); }
            } else if (ax < HW && cy > BAR) decide(G, true, "GOOD!", `${D} YARDS`);
            else if (ax >= HW) decide(G, false, "NO GOOD", cx < 0 ? "WIDE LEFT" : "WIDE RIGHT");
            else decide(G, false, "NO GOOD", "SHORT");
          }
          if (b.y <= 0.12 && b.vy < 0) {
            b.y = 0.12;
            if (!s.crossed && !s.decided) decide(G, false, "NO GOOD", "SHORT");
            if (Math.abs(b.vy) > 3) { b.vy = -b.vy * 0.35; b.vz *= 0.5; b.vx *= 0.5; b.spin *= 0.5; }
            else { b.vy = 0; b.vz *= 0.9; b.vx *= 0.9; if (Math.abs(b.vz) < 0.5) b.on = false; }
          }
        }
        // camera tilts up to follow a high ball
        const bp = proj(G, b.x, b.y, b.z), want = clamp(70 - bp.y, 0, G.H * 0.5);
        s.pan += (want - s.pan) * Math.min(1, dt * (want > s.pan ? 9 : 2.5));
        if (s.decided) {
          s.res.t += dt;
          if (s.res.t > 1.7) {
            if (s.miss >= 3) {
              G.over(s.score, s.score >= 600 ? "Leg of a legend!" : s.score >= 250 ? "Big leg, bad wind." : "Wide right. Ruff.");
              return;
            }
            if (s.res.good) s.dist += 5;
            newKick(G);
          }
        } else if (s.ft > 6) decide(G, false, "NO GOOD", "SHORT");
      }
    },
    tap(G) { lockTap(G); },
    onKey(G, k, isDown) { if (isDown && (k === " " || k === "ArrowUp" || k === "Enter")) lockTap(G); },
    draw(G, c) {
      const s = G.s, W = G.W, H = G.H, dark = G.dark(), D = s.dist, b = s.ball, t = G.t;
      const L = s.L = lay(G), hz = L.hz;
      // ---- sky + stadium ----
      const pan = s.pan || 0;
      c.save(); c.translate(0, pan);
      const sky = c.createLinearGradient(0, -pan, 0, hz);
      if (dark) { sky.addColorStop(0, "#0b1030"); sky.addColorStop(1, "#27306a"); }
      else { sky.addColorStop(0, "#4aa8ff"); sky.addColorStop(1, "#bfe6ff"); }
      c.fillStyle = sky; c.fillRect(0, -pan, W, hz + pan);
      const sh = H * 0.11, st = hz - sh;
      for (let i = 0; i < 2; i++) {      // light towers
        const lx = i ? W * 0.92 : W * 0.08;
        c.fillStyle = dark ? "#555b7a" : "#7a7f95"; c.fillRect(lx - 2, st - H * 0.1, 4, H * 0.1);
        c.fillStyle = dark ? "#fff7c2" : "#e8e8e8"; c.fillRect(lx - 16, st - H * 0.12, 32, 12);
        if (dark) { c.fillStyle = "rgba(255,247,190,0.12)"; c.beginPath(); c.arc(lx, st - H * 0.115, 40, 0, 7); c.fill(); }
      }
      c.fillStyle = dark ? "#3a2f5a" : "#c0392b"; c.fillRect(0, st, W, sh);
      const cols = ["#ffd23f", "#ffffff", "#2d8cff", "#ff6b6b", "#7cc35b", "#f7a1c4"];
      const cheer = s.res && s.res.good ? 1 : 0;
      c.globalAlpha = dark ? 0.55 : 0.8;
      for (let r = 0; r < 4; r++) for (let x = (r % 2) * 5; x < W; x += 10) {
        c.fillStyle = cols[((x * 7 + r * 13) % 6 + 6) % 6];
        c.fillRect(x, st + 4 + r * (sh - 8) / 4 + (Math.sin(t * (6 + cheer * 10) + x) > 0.85 - cheer * 0.6 ? -2 - cheer * 2 : 0), 5, 4);
      }
      c.globalAlpha = 1;
      c.fillStyle = dark ? "#1d1838" : "#2c3e50"; c.fillRect(0, hz - 5, W, 5);
      // ---- field ----
      c.fillStyle = dark ? "#173a1a" : "#3f8f3a"; c.fillRect(0, hz, W, H - hz);
      const FW = 26.67, zn = -L.cz + 0.6, gl = D - 10;
      for (let z = gl, k = 0; z > zn; z -= 5, k++) {
        quad(G, c, -FW, FW, Math.max(zn, z - 5), z, k % 2 ? (dark ? "#1f5a24" : "#5fb14f") : (dark ? "#24652a" : "#6cc25b"));
      }
      quad(G, c, -FW, FW, gl, D, dark ? "#5a2a7a" : "#8e44ad"); // end zone
      c.strokeStyle = dark ? "rgba(255,255,255,0.75)" : "#fff";
      for (let z = gl; z > zn; z -= 5) line3(G, c, -FW, 0, z, FW, 0, z, z === gl ? 3 : 1.5);
      line3(G, c, -FW, 0, D, FW, 0, D, 2);
      line3(G, c, -FW, 0, zn, -FW, 0, D, 2); line3(G, c, FW, 0, zn, FW, 0, D, 2);
      c.fillStyle = dark ? "rgba(255,255,255,0.7)" : "#fff";
      for (let z = Math.ceil(zn + 1); z < gl; z++) for (const hx of [-HW, HW]) {
        const a = proj(G, hx, 0, z), w = Math.max(1, 0.5 * a.s);
        c.fillRect(a.x - w / 2, a.y - 0.5, w, Math.max(1, a.s * 0.06));
      }
      const ez = proj(G, 0, 0, D - 5);
      if (ez.s > 6) G.text(c, "DAWGS", ez.x, ez.y, clamp(ez.s * 0.9, 10, 22), dark ? "#e7c6ff" : "#fff");
      // ---- posts + ball (depth sorted) ----
      const ballFar = b.z > D;
      if (ballFar) drawBall(G, c);
      drawPosts(G, c, D, dark, t);
      if (!ballFar) drawBall(G, c);
      // tee + kicker
      const bs = proj(G, s.bx, 0, 0), bsx = bs.x, bsy = bs.y;
      if (s.phase !== "fly") {
        c.fillStyle = "#ff8c1a"; c.beginPath(); c.moveTo(bsx - 9, bsy + 2); c.lineTo(bsx + 9, bsy + 2); c.lineTo(bsx + 4, bsy - 6); c.lineTo(bsx - 4, bsy - 6); c.fill();
      }
      const kx = bsx - 64 + (s.kickT > 0 ? 44 * (1 - s.kickT / 0.2) : s.phase === "fly" ? 34 : 0);
      if (!s.res) G.img(c, s.face, kx, bsy + 6, 60, s.kickT > 0 ? 0.35 : 0);
      if (s.phase === "aim" || s.phase === "power") drawArrow(G, c, bsx, bsy, s.aim, s.phase === "power", t);
      c.restore();
      // ---- aim arrow + power meter ----
      if (s.phase === "aim" || s.phase === "power") {
        drawMeter(G, c, s.phase === "power" ? s.pow : 0, needP(D), s.phase === "power");
      }
      // ---- result ----
      if (s.res) {
        const r = s.res, pop = Math.min(1, r.t * 5), y = 96;
        const col = r.good ? "#5be35b" : r.txt === "DOINK!" ? "#ffb02e" : "#ff5a5a";
        c.save(); c.translate(W / 2, y); c.scale(pop, pop); c.translate(-W / 2, -y);
        const bw = Math.min(W - 24, 330); c.fillStyle = "rgba(0,0,0,0.6)";
        c.beginPath(); if (c.roundRect) c.roundRect(W / 2 - bw / 2, y - 34, bw, 90, 14); else c.rect(W / 2 - bw / 2, y - 34, bw, 90); c.fill();
        c.strokeStyle = col; c.lineWidth = 3; c.stroke();
        G.banner(c, r.txt, col, y, r.txt.length > 9 ? Math.min(24, W / 16) : undefined);
        c.restore();
        if (r.sub) G.text(c, r.sub, W / 2, y + 36, 12, "#fff");
        G.img(c, s.face, W / 2, H - 90, 96 + (r.good ? Math.abs(Math.sin(t * 9)) * 8 : 0), r.good ? Math.sin(t * 10) * 0.12 : 0);
        if (r.good) G.text(c, `+${D}`, W / 2 + 70, H - 120 - Math.min(20, r.t * 40), 16, "#ffd23f");
      }
      // ---- HUD + wind ----
      let lives = ""; for (let i = 0; i < 3; i++) lives += i < 3 - s.miss ? "🏈" : "✖️";
      G.hud(c, `SCORE ${s.score || 0}`, `${D} YD`, lives);
      if (!s.res) drawWind(G, c, s.wind, t);
      if (!s.kicks && s.phase === "aim") G.hint(c, "TAP TO LOCK AIM", 99, H * 0.62);
      else if (!s.kicks && s.phase === "power") G.hint(c, "TAP TO LOCK POWER", 99, H * 0.62);
    }
  });

  function drawArrow(G, c, x, y, aim, locked, t) {
    const s = G.s, tg = proj(G, s.bx + s.dist * Math.tan(aim), BAR + 1.5, s.dist), tx = tg.x, ty = tg.y;
    const ang = Math.atan2(tx - x, -(ty - y)), len = Math.min(G.H * 0.2, 120), oy = y - 8;
    // faint aim line out to the posts (no wind - that's on you)
    c.setLineDash([5, 7]); c.strokeStyle = locked ? "rgba(91,227,91,0.7)" : "rgba(255,240,120,0.55)";
    c.lineWidth = 2; c.beginPath(); c.moveTo(x + Math.sin(ang) * len, oy - Math.cos(ang) * len); c.lineTo(tx, ty); c.stroke(); c.setLineDash([]);
    c.save(); c.translate(x, oy); c.rotate(ang);
    c.fillStyle = locked ? "#5be35b" : "#ffd23f"; c.strokeStyle = "rgba(0,0,0,0.65)"; c.lineWidth = 3; c.lineJoin = "round";
    const w = 9, hw = 22, hl = 30;
    c.beginPath(); c.moveTo(-w, 0); c.lineTo(-w, -len + hl); c.lineTo(-hw, -len + hl); c.lineTo(0, -len); c.lineTo(hw, -len + hl);
    c.lineTo(w, -len + hl); c.lineTo(w, 0); c.closePath(); c.stroke(); c.fill();
    if (!locked) { c.fillStyle = `rgba(255,255,255,${0.35 + 0.25 * Math.sin(t * 10)})`; c.fillRect(-w + 3, -len + hl, 5, len - hl - 4); }
    c.restore();
  }
  function drawMeter(G, c, pow, need, active) {
    const W = G.W, mw = Math.min(W - 40, 320), mh = 26, mx = W / 2 - mw / 2, my = G.H - 38 - mh / 2;
    c.save(); c.globalAlpha = active ? 1 : 0.45;
    c.fillStyle = "rgba(0,0,0,0.65)"; c.fillRect(mx - 5, my - 5, mw + 10, mh + 10);
    c.strokeStyle = "#fff"; c.lineWidth = 2; c.strokeRect(mx - 5, my - 5, mw + 10, mh + 10);
    const gr = c.createLinearGradient(mx, 0, mx + mw, 0);
    gr.addColorStop(0, "#ffd23f"); gr.addColorStop(0.6, "#ff9a2e"); gr.addColorStop(1, "#ff3b3b");
    c.fillStyle = gr; c.fillRect(mx, my, mw * pow, mh);
    c.fillStyle = "#fff"; c.fillRect(mx + mw * need - 1.5, my - 8, 3, mh + 16);  // about the least power that gets there
    G.text(c, "POWER", mx + 6, my + mh / 2 + 1, 10, "#fff", "left");
    c.restore();
  }
  function drawWind(G, c, wind, t) {
    const w = 124, h = 52, x = G.W - w - 8, y = G.H - 38 - 18 - 12 - h, wm = Math.abs(wind), wd = Math.sign(wind) || 1;
    const ac = wm >= 14 ? "#ff6b6b" : wm >= 7 ? "#ffd23f" : "#9fe89f";
    c.fillStyle = "rgba(0,0,0,0.6)"; c.fillRect(x, y, w, h);
    c.strokeStyle = ac; c.lineWidth = 2; c.strokeRect(x, y, w, h);
    G.text(c, "WIND", x + 8, y + 12, 10, "#fff", "left");
    G.text(c, `${wm}`, x + w - 8, y + 15, 16, ac, "right");
    G.text(c, "MPH", x + w - 8, y + 39, 10, ac, "right");
    const al = 22 + Math.min(1, wm / 22) * 30, cx = x + 40 + Math.sin(t * 6) * 2 * wd, cy = y + 34; // big arrow, longer = stronger
    c.save(); c.translate(cx, cy); c.scale(wd, 1); c.fillStyle = ac;
    c.fillRect(-al / 2, -4, al - 8, 8);
    c.beginPath(); c.moveTo(al / 2 + 4, 0); c.lineTo(al / 2 - 10, -11); c.lineTo(al / 2 - 10, 11); c.closePath(); c.fill();
    c.restore();
  }
  function drawFlag(c, x, y, len, h, dir, mph, t, col) {
    const ext = clamp(0.25 + mph / 16, 0.25, 1), droop = (1 - ext) * h * 1.4, fl = Math.min(3, 1 + mph / 6);
    c.fillStyle = col; c.beginPath(); c.moveTo(x, y);
    for (let i = 1; i <= 4; i++) { const u = i / 4; c.lineTo(x + dir * len * ext * u, y + droop * u + Math.sin(t * (4 + mph / 3) + u * 5) * fl * u); }
    for (let i = 4; i >= 1; i--) { const u = i / 4; c.lineTo(x + dir * len * ext * u, y + h * (1 - u * 0.35) + droop * u + Math.sin(t * (4 + mph / 3) + u * 5) * fl * u); }
    c.lineTo(x, y + h); c.closePath(); c.fill();
  }
  function quad(G, c, x0, x1, z0, z1, col) {
    const a = proj(G, x0, 0, z0), ax = a.x, ay = a.y; const b = proj(G, x1, 0, z0), bx = b.x;
    const d = proj(G, x1, 0, z1), dx = d.x, dy = d.y; const e = proj(G, x0, 0, z1), ex = e.x;
    c.fillStyle = col; c.beginPath(); c.moveTo(ax, ay); c.lineTo(bx, ay); c.lineTo(dx, dy); c.lineTo(ex, dy); c.closePath(); c.fill();
  }
  function line3(G, c, x0, y0, z0, x1, y1, z1, w) {
    const a = proj(G, x0, y0, z0), ax = a.x, ay = a.y; const b = proj(G, x1, y1, z1);
    c.lineWidth = w; c.beginPath(); c.moveTo(ax, ay); c.lineTo(b.x, b.y); c.stroke();
  }
  function drawPosts(G, c, D, dark, t) {
    const s = G.s, base = proj(G, 0, 0, D + 1.5), bx = base.x, by = base.y, sc = base.s;
    const bar = proj(G, 0, BAR, D), barx = bar.x, bry = bar.y, ps = bar.s;
    c.fillStyle = dark ? "#5c5c66" : "#444";
    const pw = Math.max(2, 0.3 * sc); c.fillRect(bx - pw / 2, by - (BAR - 0.4) * sc, pw, (BAR - 0.4) * sc);
    c.strokeStyle = "#ffd400"; c.lineCap = "round"; c.lineWidth = Math.max(2, 0.28 * ps);
    c.beginPath(); c.moveTo(bx, by - (BAR - 0.4) * sc); c.lineTo(barx, bry); c.stroke();
    const lx = barx - HW * ps, rx = barx + HW * ps, top = bry - UPH * ps;
    c.lineWidth = Math.max(2, 0.24 * ps);
    c.beginPath(); c.moveTo(lx, bry); c.lineTo(rx, bry); c.moveTo(lx, bry); c.lineTo(lx, top); c.moveTo(rx, bry); c.lineTo(rx, top); c.stroke();
    c.lineCap = "butt";
    const wd = Math.sign(s.wind) || 1, wm = Math.abs(s.wind || 0), fl = Math.max(14, ps * 1.4), fh = Math.max(7, ps * 0.45);
    const fy = Math.max(top, 40);   // keep the flags below the HUD on short kicks
    drawFlag(c, lx, fy, fl, fh, wd, wm, t, "#ff3b3b");
    drawFlag(c, rx, fy, fl, fh, wd, wm, t + 0.4, "#ff3b3b");
  }
  function drawBall(G, c) {
    const s = G.s, b = s.ball;
    const sp = proj(G, b.x, 0, b.z), sx = sp.x, sy = sp.y, ss = sp.s;
    c.fillStyle = "rgba(0,0,0,0.25)"; c.beginPath(); c.ellipse(sx, sy, Math.max(1.5, ss * 0.18), Math.max(0.8, ss * 0.06), 0, 0, 7); c.fill();
    const p = proj(G, b.x, b.y, b.z), len = Math.max(4, p.s * 0.34), wid = len * 0.6;
    c.save(); c.translate(p.x, p.y);
    const r = b.on ? b.rot : -Math.PI / 2 + 0.1;
    c.rotate(r * 0.35);
    c.scale(1, b.on ? 0.45 + 0.55 * Math.abs(Math.cos(r)) : 1);
    c.fillStyle = "#8b4a1f"; c.beginPath(); c.ellipse(0, 0, len / 2, wid / 2, 0, 0, 7); c.fill();
    c.strokeStyle = "#4a230b"; c.lineWidth = Math.max(0.8, len * 0.05); c.stroke();
    if (len > 9) {
      c.strokeStyle = "#fff"; c.lineWidth = Math.max(1, len * 0.05);
      c.beginPath(); c.moveTo(-len * 0.18, 0); c.lineTo(len * 0.18, 0);
      for (let i = -2; i <= 2; i++) { c.moveTo(i * len * 0.07, -wid * 0.12); c.lineTo(i * len * 0.07, wid * 0.12); }
      c.moveTo(-len * 0.38, -wid * 0.3); c.lineTo(-len * 0.38, wid * 0.3); c.moveTo(len * 0.38, -wid * 0.3); c.lineTo(len * 0.38, wid * 0.3);
      c.stroke();
    }
    c.restore();
  }
})();
