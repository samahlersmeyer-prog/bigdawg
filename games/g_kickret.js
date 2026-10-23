// ---------- Dawg Return (top-down kick return) ----------
// Catch the kickoff at your own goal line and run it back. Hold/drag to steer (the dog follows your finger's x
// and runs a little faster while you hold). Cats in helmets pursue; your pups block. TD = +7 and it gets harder.
// 3 returns (lives). Tackled returns score yards gained / 10.
(function () {
  const TEAM = "#2f6fe0", TEAM2 = "#ffd23f", OPP = "#e2483d", OPP2 = "#fff";

  function newReturn(G) {
    const s = G.s, W = G.W, Y = s.ypx, lv = s.tds;
    s.phase = "kick"; s.pt = 1.1; s.msg = 0;
    s.p = { x: W / 2, y: 0, vx: 0, f: 0 };
    s.ball = 1;
    const n = Math.min(15, 5 + lv * 2);
    const sp = Math.min(1.15, 0.7 + 0.08 * lv);
    s.cats = [];
    for (let i = 0; i < n; i++) {
      const lane = (i + 0.5) / n;
      s.cats.push({
        x: W * (0.1 + 0.8 * lane) + (Math.random() - 0.5) * 30,
        y: Y * (34 + (i % 3) * 18 + Math.random() * 14),
        vx: 0, vy: -Y * 5,
        sp: Y * (5.2 + Math.random() * 1.6) * sp,
        acc: Y * (7 + Math.random() * 4) * (1 + 0.06 * lv),
        lead: 0.15 + Math.random() * 0.45,
        off: (Math.random() - 0.5) * 50,
        down: 0, num: 10 + Math.floor(Math.random() * 89)
      });
    }
    s.pups = [-1, 1].map(d => ({ x: W / 2 + d * W * 0.2, y: Y * 4, vx: 0, eng: 0, num: d < 0 ? 21 : 34, sp: Y * 6.6 }));
  }

  function endReturn(G, td) {
    const s = G.s;
    if (td) {
      s.tds++; s.score += 7; s.phase = "td"; s.pt = 2.2; G.sfx("win");
    } else {
      const yds = Math.max(0, Math.floor(s.p.y / s.ypx));
      s.lastYds = yds; s.score += Math.floor(yds / 10); s.lives--; s.phase = "tackle"; s.pt = 1.8; G.sfx("lose"); G.buzz();
    }
  }

  defGame({
    key: "kickret", name: "Dawg Return", icon: "🏈", max: 9999, cat: "sports",
    blurb: "Return the kick. Juke the cats. Score.",
    how: "Catch the kickoff and run it back. Hold and drag anywhere to steer: the dog runs toward your finger and speeds up while you hold. Your pups block cats they touch. DOUBLE-TAP to juke: a quick spin move that makes any cat who dives at you whiff (+1 point each), then it recharges for a few seconds. Touchdown = 7 points and the cats get faster. Tackled = yards/10 points. 3 returns.",
    reset(G) {
      const Y = Math.max(18, Math.min(28, G.H / 25));
      G.s = { ypx: Y, tds: 0, score: 0, lives: 3, ret: 1, hold: false, fx: G.W / 2, kl: 0, kr: 0, pops: [], lastYds: 0 };
      newReturn(G);
    },
    update(G, dt) {
      const s = G.s, W = G.W, Y = s.ypx, p = s.p;
      s.pops.forEach(q => q.t -= dt); s.pops = s.pops.filter(q => q.t > 0);
      if (s.phase === "td" || s.phase === "tackle") {
        s.pt -= dt;
        if (s.phase === "td") p.y += Y * 3 * dt;
        if (s.pt <= 0) {
          if (s.phase === "tackle") {
            if (s.lives <= 0) { G.over(s.score, s.tds >= 3 ? "Return man of the year!" : s.tds ? "Pick-six energy." : "Swarmed by cats."); return; }
            s.ret++;
          }
          newReturn(G);
        }
        return;
      }
      const lo = W * 0.06 + 14, hi = W * 0.94 - 14;
      // player
      if (s.phase === "kick") {
        s.pt -= dt; s.ball = Math.max(0, s.pt / 1.1);
        if (s.pt <= 0) { s.phase = "run"; s.ball = 0; G.sfx("pop"); }
      } else {
        if (s.juke > 0) s.juke -= dt; if (s.jukeCd > 0) s.jukeCd -= dt;
        const boost = (s.hold || s.kl || s.kr ? 1.16 : 1) * (s.juke > 0 ? 1.3 : 1);
        p.f = Y * 6.9 * boost;
        let tx = p.x;
        if (s.hold) tx = s.fx; else if (s.kl || s.kr) tx = p.x + (s.kr - s.kl) * 200;
        const want = Math.max(-1, Math.min(1, (tx - p.x) / 40)) * W * 0.85;
        p.vx += (want - p.vx) * Math.min(1, dt * 12);
        p.x = Math.max(lo, Math.min(hi, p.x + p.vx * dt));
        p.y += p.f * dt;
        if (p.y >= Y * 100) { p.y = Y * 100; endReturn(G, true); return; }
      }
      // blockers
      s.pups.forEach(u => {
        if (u.eng > 0) { u.eng -= dt; return; }
        let tg = null, bd = 1e9;
        s.cats.forEach(k => { if (k.down > 0) return; const d = Math.hypot(k.x - u.x, k.y - u.y); if (k.y > u.y - Y && d < bd) { bd = d; tg = k; } });
        const fwd = s.phase === "kick" ? Y * 2 : u.sp;
        if (tg) {
          const dx = tg.x - u.x, dy = tg.y - u.y, d = Math.hypot(dx, dy) || 1;
          u.x += dx / d * fwd * dt; u.y += Math.max(0, dy / d) * fwd * dt;
          if (d < 26) { tg.down = 2.6; tg.vx = tg.vy = 0; u.eng = 0.5; s.pops.push({ x: tg.x, y: tg.y, t: 0.6, txt: "BLOCK!" }); G.sfx("pop"); }
        } else u.y += fwd * dt;
        u.x = Math.max(lo, Math.min(hi, u.x));
      });
      // defenders
      for (const k of s.cats) {
        if (k.down > 0) { k.down -= dt; continue; }
        let tx, ty;
        if (s.phase === "kick") { tx = k.x; ty = k.y - 100; }
        else { tx = p.x + p.vx * k.lead + k.off * Math.min(1, Math.max(0, (k.y - p.y) / (Y * 12))); ty = p.y + p.f * k.lead * 0.5; }
        const dx = tx - k.x, dy = ty - k.y, d = Math.hypot(dx, dy) || 1;
        const sp = s.phase === "kick" ? Y * 4.5 : k.sp;
        const wx = dx / d * sp, wy = dy / d * sp;
        const ax = wx - k.vx, ay = wy - k.vy, am = Math.hypot(ax, ay), m = Math.min(am, k.acc * dt);
        if (am > 0) { k.vx += ax / am * m; k.vy += ay / am * m; }
        k.x += k.vx * dt; k.y += k.vy * dt;
        if (s.phase === "run" && Math.hypot(k.x - p.x, k.y - p.y) < 20) {
          if (s.juke > 0) { k.down = 1.4; k.vx = k.vy = 0; s.score += 1; s.broke = (s.broke || 0) + 1; s.pops.push({ x: k.x, y: k.y, t: 0.7, txt: "WHIFF! +1" }); G.sfx("pop"); continue; }
          endReturn(G, false); return;
        }
      }
    },
    down(G, x) {
      const s = G.s; s.hold = true; s.fx = x;
      if (G.t - (s.lastTap || -9) < 0.32 && s.phase === "run" && !(s.jukeCd > 0)) { s.juke = 0.55; s.jukeCd = 3.2; s.pops.push({ x: s.p.x, y: s.p.y, t: 0.6, txt: "JUKE!" }); G.sfx("pop"); }
      s.lastTap = G.t;
    },
    move(G, x) { G.s.fx = x; },
    up(G) { G.s.hold = false; },
    onKey(G, k, d) { if (k === " " && d) { const s = G.s; if (s.phase === "run" && !(s.jukeCd > 0)) { s.juke = 0.55; s.jukeCd = 3.2; } } if (k === "ArrowLeft" || k === "a") G.s.kl = d ? 1 : 0; if (k === "ArrowRight" || k === "d") G.s.kr = d ? 1 : 0; },
    draw(G, c) {
      const s = G.s, W = G.W, H = G.H, Y = s.ypx, p = s.p, dark = G.dark();
      const camY = H * 0.8 + Math.min(p.y, Y * 104);
      const sy = wy => camY - wy;
      const fl = W * 0.06, fr = W * 0.94;
      // sideline / stands
      c.fillStyle = dark ? "#2a2f3a" : "#8a6d4f"; c.fillRect(0, 0, W, H);
      // grass stripes (5-yard bands)
      const y0 = Math.floor((camY - H) / Y / 5) * 5 - 5, y1 = Math.ceil(camY / Y / 5) * 5 + 5;
      for (let yd = y0; yd < y1; yd += 5) {
        const a = sy(yd * Y), b = sy((yd + 5) * Y);
        if (yd < -10 || yd >= 110) continue;
        if (yd < 0 || yd >= 100) c.fillStyle = yd < 0 ? (dark ? "#1d3f86" : TEAM) : (dark ? "#8a2620" : OPP);
        else c.fillStyle = ((yd / 5) & 1) ? (dark ? "#1f5a24" : "#4caf50") : (dark ? "#236828" : "#5cbf5f");
        c.fillRect(fl, b, fr - fl, a - b);
      }
      // end zone text
      if (camY - H < 0 && camY > -10 * Y) { c.save(); c.globalAlpha = 0.85; G.text(c, "DAWGS", W / 2, sy(-5 * Y), Math.min(28, W / 12), TEAM2); c.restore(); }
      if (camY > 100 * Y) { c.save(); c.globalAlpha = 0.85; G.text(c, "CATS", W / 2, sy(105 * Y), Math.min(28, W / 12), OPP2); c.restore(); }
      // yard lines, hashes, numbers
      c.fillStyle = "rgba(255,255,255,0.9)";
      for (let yd = Math.max(0, y0); yd <= Math.min(100, y1); yd++) {
        const y = sy(yd * Y);
        if (yd % 5 === 0) c.fillRect(fl, y - (yd % 50 === 0 ? 2 : 1), fr - fl, yd === 0 || yd === 100 ? 4 : 2);
        else { c.fillRect(fl + 4, y, 8, 2); c.fillRect(fr - 12, y, 8, 2); c.fillRect(W * 0.36, y, 8, 2); c.fillRect(W * 0.64 - 8, y, 8, 2); }
        if (yd % 10 === 0 && yd > 0 && yd < 100) {
          const n = String(yd <= 50 ? yd : 100 - yd);
          G.text(c, n, fl + 26, y, 14, "rgba(255,255,255,0.85)"); G.text(c, n, fr - 26, y, 14, "rgba(255,255,255,0.85)");
        }
      }
      c.fillStyle = "#fff"; c.fillRect(fl, sy(110 * Y) - 3, fr - fl, 4); c.fillRect(fl, sy(-10 * Y), fr - fl, 4);
      // sideline border
      c.fillStyle = "#fff"; c.fillRect(fl - 3, 0, 3, H); c.fillRect(fr, 0, 3, H);
      // shadows + bodies
      const body = (x, y, col, col2, num, r) => {
        c.fillStyle = "rgba(0,0,0,0.25)"; c.beginPath(); c.ellipse(x + 3, y + 5, r, r * 0.7, 0, 0, 7); c.fill();
        c.fillStyle = col; c.beginPath(); c.arc(x, y, r, 0, 7); c.fill();
        c.strokeStyle = col2; c.lineWidth = 2; c.stroke();
      };
      (s.pups || []).forEach(u => {
        const y = sy(u.y); if (y < -30 || y > H + 30) return;
        body(u.x, y, TEAM, TEAM2, u.num, 15); G.emoji(c, "🐶", u.x, y - 3, 20);
      });
      (s.cats || []).forEach(k => {
        const y = sy(k.y); if (y < -30 || y > H + 30) return;
        if (k.down > 0) {
          c.save(); c.translate(k.x, y); c.rotate(1.3); body(0, 0, OPP, OPP2, 0, 14); G.emoji(c, "🐈", 0, -2, 18); c.restore();
          G.emoji(c, "💫", k.x + 10, y - 14, 12);
        } else {
          body(k.x, y, OPP, OPP2, k.num, 15);
          c.fillStyle = OPP2; c.fillRect(k.x - 2, y - 15, 4, 8); // helmet stripe
          G.emoji(c, "🐈", k.x, y - 2, 20);
        }
      });
      // player
      const py = sy(p.y), bob = s.phase === "run" ? Math.sin(G.t * 22) * 2 : 0;
      c.fillStyle = "rgba(0,0,0,0.28)"; c.beginPath(); c.ellipse(p.x + 3, py + 8, 17, 11, 0, 0, 7); c.fill();
      c.fillStyle = TEAM; c.beginPath(); c.arc(p.x, py + bob * 0.5, 17, 0, 7); c.fill(); c.strokeStyle = TEAM2; c.lineWidth = 3; c.stroke();
      const face = s.phase === "tackle" ? ":dawgpain:" : s.phase === "td" ? ":dawgpog:" : ":dawgW:";
      if (s.juke > 0) { c.strokeStyle = "rgba(255,210,63,0.8)"; c.lineWidth = 3; c.beginPath(); c.arc(p.x, py, 24 + (0.55 - s.juke) * 20, 0, 7); c.stroke(); }
      G.img(c, face, p.x, py - 4 + bob, 36, s.phase === "tackle" ? 0.5 : s.juke > 0 ? (0.55 - s.juke) * 22 : p.vx / W * 0.25);
      if (s.phase === "kick") {
        const bh = s.ball; // ball falling from the sky
        c.fillStyle = "rgba(0,0,0,0.25)"; c.beginPath(); c.ellipse(p.x, py - 30 + 10, 8 * (1 - bh) + 3, 4, 0, 0, 7); c.fill();
        c.fillStyle = "#000"; G.emoji(c, "🏈", p.x + bh * 40, py - 22 - bh * H * 0.55, 20 + bh * 14);
      } else G.emoji(c, "🏈", p.x + 16, py + 6 + bob, 16);
      // pops
      s.pops.forEach(q => { const qy = Math.max(70, sy(q.y) - 26 - (0.6 - q.t) * 30); G.text(c, q.txt, q.x + 1, qy + 1, 11, "rgba(0,0,0,0.6)"); G.text(c, q.txt, q.x, qy, 11, "#ffd23f"); });
      // banners
      const by = Math.max(110, H * 0.32);
      if (s.phase === "kick") {
        G.banner(c, "KICKOFF!", "#fff", by);
        if (s.ret > 1) { G.text(c, `RETURN ${s.ret} OF 3`, W / 2 + 1, by + 33, 12, "rgba(0,0,0,0.6)"); G.text(c, `RETURN ${s.ret} OF 3`, W / 2, by + 32, 12, "#ffd23f"); }
      } else if (s.phase === "td") {
        const fl2 = Math.floor(G.t * 8) % 2;
        c.fillStyle = "rgba(0,0,0,0.45)"; c.fillRect(0, by - 92, W, 150);
        G.img(c, ":dawgpog:", W / 2, by - 50, 64, Math.sin(G.t * 10) * 0.15);
        G.banner(c, "TOUCHDOWN!", fl2 ? "#ffd23f" : "#fff", by + 4, Math.max(18, Math.min(26, W / 14)));
        G.text(c, "+7  CATS GET FASTER", W / 2, by + 36, 11, "#fff");
      } else if (s.phase === "tackle") {
        c.fillStyle = "rgba(0,0,0,0.45)"; c.fillRect(0, by - 34, W, 84);
        G.banner(c, "TACKLED!", "#ff6b6b", by);
        G.text(c, `${s.lastYds} YDS  +${Math.floor(s.lastYds / 10)}`, W / 2, by + 32, 12, "#fff");
      }
      G.hint(c, G.t < 5 ? "HOLD + DRAG TO STEER" : "DOUBLE-TAP = JUKE", 9, H - 26);
      // juke meter (bottom-left): fills while recharging
      if (s.phase === "run") { const r = s.jukeCd > 0 ? 1 - s.jukeCd / 3.2 : 1; c.fillStyle = "rgba(0,0,0,0.5)"; c.beginPath(); c.arc(30, H - 70, 20, 0, 7); c.fill(); c.strokeStyle = r >= 1 ? "#ffd23f" : "#888"; c.lineWidth = 4; c.beginPath(); c.arc(30, H - 70, 18, -Math.PI / 2, -Math.PI / 2 + r * 6.283); c.stroke(); G.text(c, "JUKE", 30, H - 70, 8, r >= 1 ? "#ffd23f" : "#bbb"); }
      // HUD: TDs | points | returns left, then a small yard-line pill
      G.hud(c, `TD ${s.tds}`, `PTS ${s.score}`, "🏈".repeat(Math.max(0, s.lives)) || "-");
      const yd = Math.floor(p.y / Y), yl = yd >= 100 ? "TD" : yd <= 50 ? (yd === 50 ? "MID 50" : "OWN " + yd) : "OPP " + (100 - yd);
      c.fillStyle = "rgba(0,0,0,0.5)"; c.beginPath(); if (c.roundRect) c.roundRect(W / 2 - 54, 40, 108, 24, 12); else c.rect(W / 2 - 54, 40, 108, 24); c.fill();
      G.text(c, yl, W / 2, 52, 10, "#fff");
    }
  });
})();
