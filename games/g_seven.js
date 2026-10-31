// ---------- Dawg 7s (Sports: 7-on-7 passing football) ----------
// Top-down 7-on-7: no linemen, no running plays. Pick a play, then TAP a receiver to throw to him before the
// 4-second pass clock runs out. After the catch, drag to steer him through the cats. 4 downs to gain 10 yards. Touchdown = 7 and the cats get quicker. Lose 3 drives and it's over.
(function () {
  const FW = 30, TEAM = "#2f6fe0", TEAM2 = "#ffd23f", OPP = "#e2483d", OPP2 = "#fff";
  const XS = [3, 8.5, 12, 21.5, 27];                // receiver starting spots across the field (QB in the middle at 15)
  // routes: list of [dx, dy] legs; "in" means toward the middle. dy < 0 is upfield. stop:true = sits down at the end.
  const R = {
    go: { n: "GO", legs: [[0, -40]] },
    slant: { n: "SLANT", legs: [[0, -3], ["in", 9, -10]], keep: true },
    out: { n: "OUT", legs: [[0, -7], ["out", 12, 0]], keep: true },
    curl: { n: "CURL", legs: [[0, -9], ["in", 1, 2]], stop: true },
    post: { n: "POST", legs: [[0, -8], ["in", 9, -22]], keep: true },
    corner: { n: "CORNER", legs: [[0, -8], ["out", 9, -14]], keep: true },
    drag: { n: "DRAG", legs: [[0, -3], ["in", 26, -2]], keep: true },
    flat: { n: "FLAT", legs: [[0, -1], ["out", 10, -2]], keep: true },
    hitch: { n: "HITCH", legs: [[0, -5]], stop: true },
    wheel: { n: "WHEEL", legs: [["out", 5, -1], [0, -30]], keep: true }
  };
  const PLAYS = [
    { n: "FOUR VERTS", r: ["go", "go", "flat", "go", "go"] },
    { n: "SLANTS", r: ["slant", "slant", "hitch", "slant", "slant"] },
    { n: "MESH", r: ["drag", "out", "curl", "drag", "go"] },
    { n: "POSTS", r: ["post", "curl", "flat", "corner", "post"] },
    { n: "OUTS", r: ["out", "hitch", "go", "curl", "out"] },
    { n: "SMASH", r: ["hitch", "corner", "wheel", "corner", "hitch"] },
    { n: "SHOT PLAY", r: ["post", "go", "drag", "go", "corner"] },
    { n: "QUICK", r: ["hitch", "slant", "flat", "slant", "hitch"] }
  ];
  const RSPD = 7.2;                                  // receiver speed, yards/second
  const clamp = (v, a, b) => v < a ? a : v > b ? b : v;
  const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
  // turn a route into absolute waypoints from a starting spot
  function path(x0, y0, key) {
    const r = R[key], side = x0 < 15 ? 1 : -1, pts = [[x0, y0]]; let x = x0, y = y0;
    r.legs.forEach(l => { let dx, dy; if (typeof l[0] === "string") { dx = (l[0] === "in" ? side : -side) * l[1]; dy = l[2]; } else { dx = l[0]; dy = l[1]; }
      x = clamp(x + dx, 0.8, FW - 0.8); y += dy; pts.push([x, y]); });
    if (r.keep) { const a = pts[pts.length - 2], b = pts[pts.length - 1], L = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
      pts.push([clamp(b[0] + (b[0] - a[0]) / L * 40, 0.8, FW - 0.8), b[1] + (b[1] - a[1]) / L * 40]); }
    return { pts, stop: !!r.stop };
  }
  // where a receiver will be after running t more seconds along his path
  function along(rc, t) {
    let x = rc.x, y = rc.y, k = rc.leg, left = t * RSPD;
    while (k < rc.path.pts.length && left > 0) { const p = rc.path.pts[k], d = Math.hypot(p[0] - x, p[1] - y);
      if (d <= left) { x = p[0]; y = p[1]; left -= d; k++; } else { x += (p[0] - x) / d * left; y += (p[1] - y) / d * left; left = 0; } }
    return { x, y, k };
  }
  defGame({
    key: "seven", name: "Dawg 7s", icon: "🏈", max: 999, cat: "sports",
    blurb: "7-on-7 passing football. Pick a play, hit the open dog.",
    how: "7-on-7: no linemen, every play is a pass. Pick one of three plays, and your receivers run their routes. TAP a receiver to throw to him. Green ring = open, yellow = tight, red = covered (picks happen!). Throw within 4 seconds or you get sacked. After the catch, DRAG to steer him through the cats. 4 downs to reach the yellow line 10 yards ahead, like real football. Touchdown = 7 points and the cats get quicker; every first down is +1. Turn it over 3 times and the game's over.",
    reset(G) { G.s = { score: 0, tds: 0, lives: 3, lv: 0, pops: [], drive: 0 }; this.drive(G); },
    drive(G) { const s = G.s; s.los = 40; s.togo = 30; s.down = 1; s.drive++; this.call(G); },
    call(G) { // offer three plays
      const s = G.s, pool = PLAYS.slice().sort(() => Math.random() - 0.5); s.offer = pool.slice(0, 3); s.phase = "call"; s.pick = null; s.pt = 0; s.ball = null; s.carrier = null;
      this.lineup(G, PLAYS[0]);
    },
    lineup(G, play) {
      const s = G.s, L = s.los, lv = s.lv;
      s.rec = XS.map((x, i) => { const p = path(x, L, play.r[i]); return { x, y: L, path: p, leg: 1, num: [11, 84, 3, 88, 1][i], route: play.r[i] }; });
      s.qb = { x: 15, y: L + 5 };
      // man coverage on every receiver, two safeties deep; cushion shrinks as the cats get better
      const cush = Math.max(1.6, 4 - lv * 0.35);
      s.def = s.rec.map((r, i) => ({ x: r.x + (r.x < 15 ? 0.8 : -0.8), y: L - cush, man: i, hist: [] }));
      s.def.push({ x: 8, y: L - 13, safety: true }, { x: 22, y: L - 13, safety: true });
      s.dspd = RSPD * Math.min(0.99, 0.86 + lv * 0.025); s.react = Math.max(0.12, 0.32 - lv * 0.03);
    },
    choose(G, play) { const s = G.s; s.pick = play; this.lineup(G, play); s.phase = "pre"; s.pt = 1.1; G.sfx("pop"); },
    openness(G, r) { const s = G.s; let d = 99; s.def.forEach(q => d = Math.min(d, dist(q, r))); return d; },
    throwTo(G, i) {
      const s = G.s, r = s.rec[i], qb = s.qb;
      // lead the receiver: solve for flight time against where he'll be
      let t = dist(qb, r) / 22; for (let k = 0; k < 4; k++) { const f = along(r, t); t = Math.hypot(f.x - qb.x, f.y - qb.y) / 22 + 0.05; }
      const tg = along(r, t);
      s.ball = { x: qb.x, y: qb.y, sx: qb.x, sy: qb.y, tx: tg.x, ty: tg.y, t: 0, T: t, to: i };
      s.phase = "air"; G.sfx("pop");
    },
    endPlay(G, txt, col, gain, opts = {}) {
      const s = G.s; s.phase = "dead"; s.pt = 1.6; s.res = { txt, col, sub: opts.sub || "" };
      if (opts.turnover) { s.lives--; s.res.next = "drive"; return; }
      if (opts.td) { s.score = Math.min(999, s.score + 7); s.tds++; s.lv++; s.res.next = "drive"; return; }
      s.los = Math.max(0.5, s.los - gain); const need = s.los - (s.togo === 0 ? 0 : s.togo);
      if (s.togo > 0 && s.los <= s.togo) { s.togo = s.los - 10 <= 0 ? 0 : Math.round(s.los - 10); s.down = 1; s.score++; s.res.sub = (s.res.sub ? s.res.sub + " · " : "") + "FIRST DOWN +1"; }
      else { s.down++; if (s.down > 4) { s.lives--; s.res.next = "drive"; s.res.sub = "TURNOVER ON DOWNS"; } }
      void need;
    },
    update(G, dt) {
      const s = G.s;
      s.pops.forEach(p => p.t -= dt); s.pops = s.pops.filter(p => p.t > 0);
      if (s.phase === "pre") { s.pt -= dt; if (s.pt <= 0) { s.phase = "live"; s.clock = 4; G.sfx("pop"); } return; }
      if (s.phase === "dead") { s.pt -= dt; if (s.pt <= 0) {
        if (s.lives <= 0) return G.over(s.score, s.tds ? `${s.tds} TD${s.tds > 1 ? "s" : ""}. Good dawgs!` : "Shut out by the cats.");
        if (s.res.next === "drive") this.drive(G); else this.call(G); } return; }
      if (s.phase === "call") return;
      // receivers run their routes (until a catch)
      if (s.phase === "live" || s.phase === "air") {
        s.rec.forEach(r => { const f = along(r, dt); r.x = f.x; r.y = f.y; r.leg = f.k; });
        // coverage: each man defender chases where his receiver was a moment ago, staying a step upfield
        s.def.forEach(d => {
          let tx, ty, sp = s.dspd;
          const breakOn = s.phase === "air" && s.ball.t > s.react + 0.1 && Math.hypot(d.x - s.ball.tx, d.y - s.ball.ty) < 4.5;
          if (breakOn) { tx = s.ball.tx; ty = s.ball.ty; sp *= 0.9; }            // only nearby cats break on the ball, a beat late
          else if (d.safety) { const deep = s.rec.filter(r => r.y < s.los - 6).sort((a, b) => dist(a, d) - dist(b, d))[0]; if (deep) { tx = deep.x; ty = deep.y - 2; } else { tx = d.x; ty = Math.min(d.y, s.los - 12); } sp *= 0.92; }
          else { const r = s.rec[d.man]; d.hist.push([r.x, r.y]); const lag = Math.round(s.react * 60), h = d.hist.length > lag ? d.hist[d.hist.length - 1 - lag] : d.hist[0]; tx = h[0]; ty = h[1] - 1.1; if (d.hist.length > 90) d.hist.shift(); }
          const L = Math.hypot(tx - d.x, ty - d.y); if (L > 0.05) { const m = Math.min(L, sp * dt); d.x += (tx - d.x) / L * m; d.y += (ty - d.y) / L * m; }
        });
      }
      if (s.phase === "live") { s.clock -= dt; if (s.clock <= 0) { G.sfx("lose"); G.buzz(); this.endPlay(G, "SACKED!", "#ff6b6b", -3, { sub: "TOO LONG IN THE POCKET" }); } return; }
      if (s.phase === "air") {
        const b = s.ball; b.t += dt; const u = Math.min(1, b.t / b.T); b.x = b.sx + (b.tx - b.sx) * u; b.y = b.sy + (b.ty - b.sy) * u;
        if (u >= 1) {
          const r = s.rec[b.to], off = Math.hypot(r.x - b.tx, r.y - b.ty); let dd = 99, near = null; s.def.forEach(q => { const k = Math.hypot(q.x - b.tx, q.y - b.ty); if (k < dd) { dd = k; near = q; } });
          const pCatch = off > 1.6 ? 0 : clamp((dd - 0.55) / 1.5, 0.12, 0.97);
          if (Math.random() < pCatch) { s.phase = "run"; s.carrier = r; r.vx = 0; s.fx = null; G.sfx("pop"); s.pops.push({ txt: "CAUGHT!", x: r.x, y: r.y, t: 0.8 });
            s.def.forEach(q => q.hist = []); }
          else if (dd < 0.7 && Math.random() < 0.25) { G.sfx("lose"); G.buzz(); this.endPlay(G, "PICKED OFF!", "#ff6b6b", 0, { turnover: true, sub: "INTERCEPTION" }); }
          else { G.sfx("lose"); this.endPlay(G, "INCOMPLETE", "#ffd23f", 0, { sub: dd < 1.6 ? "BROKEN UP" : "OFF HIS HANDS" }); }
        }
        return;
      }
      if (s.phase === "run") {
        const r = s.carrier, sp = RSPD * 1.14;
        const want = s.fx != null ? clamp(s.fx, 0.5, FW - 0.5) : r.x, dx = clamp((want - r.x) * 3, -sp * 0.8, sp * 0.8);
        const vy = -Math.sqrt(Math.max(0, sp * sp - dx * dx));
        r.x += dx * dt; r.y += vy * dt;
        s.def.forEach(d => { const lead = 0.35, tx = r.x + dx * lead, ty = r.y + vy * lead, L = Math.hypot(tx - d.x, ty - d.y), m = Math.min(L, s.dspd * 0.98 * dt); if (L > 0.01) { d.x += (tx - d.x) / L * m; d.y += (ty - d.y) / L * m; } });
        if (r.y <= 0) { G.sfx("win"); return this.endPlay(G, "TOUCHDOWN!", "#5be35b", 0, { td: true, sub: "+7 · CATS GET QUICKER" }); }
        if (r.x <= 0.3 || r.x >= FW - 0.3) { const g = Math.round(s.los - r.y); G.sfx("pop"); return this.endPlay(G, "OUT OF BOUNDS", "#fff", g, { sub: `${g} YD GAIN` }); }
        for (const d of s.def) if (dist(d, r) < 0.85) { const g = Math.round(s.los - r.y); G.sfx("lose"); return this.endPlay(G, "TAGGED!", "#fff", g, { sub: `${g} YD GAIN` }); }
      }
    },
    draw(G, c) {
      const s = G.s, W = G.W, H = G.H, dk = G.dark(), ppy = (W - 16) / (FW + 2), fl = 8 + ppy;
      const camY = s.phase === "run" && s.carrier ? Math.min(s.los - 6, s.carrier.y + 8) : s.los - 6;
      const X = x => fl + x * ppy, Y = y => H * 0.62 + (y - camY) * ppy;
      c.fillStyle = dk ? "#2a2f3a" : "#8a6d4f"; c.fillRect(0, 0, W, H);
      const yTop = camY - H * 0.62 / ppy - 6, yBot = camY + H * 0.4 / ppy + 6;
      for (let yd = Math.floor(yTop / 5) * 5; yd < yBot; yd += 5) {
        if (yd < -10 || yd >= 50) continue;
        c.fillStyle = yd < 0 ? (dk ? "#5a2a7a" : "#8e44ad") : ((yd / 5) & 1) ? (dk ? "#1f5a24" : "#4caf50") : (dk ? "#236828" : "#5cbf5f");
        c.fillRect(X(0), Y(yd), FW * ppy, 5 * ppy + 1);
      }
      if (yTop < 0) { c.save(); c.globalAlpha = 0.85; G.text(c, "DAWGS", W / 2, Y(-5), Math.min(26, W / 13), TEAM2); c.restore(); }
      c.fillStyle = "rgba(255,255,255,0.9)";
      for (let yd = Math.max(0, Math.ceil(yTop)); yd <= Math.min(50, yBot); yd++) { const y = Y(yd);
        if (yd % 5 === 0) c.fillRect(X(0), y - 1, FW * ppy, yd === 0 ? 4 : 2); else { c.fillRect(X(11.5), y, 6, 2); c.fillRect(X(18.5) - 6, y, 6, 2); }
        if (yd % 10 === 0 && yd > 0) { G.text(c, String(yd), X(2.2), y, 12, "rgba(255,255,255,0.85)"); G.text(c, String(yd), X(FW - 2.2), y, 12, "rgba(255,255,255,0.85)"); } }
      c.fillStyle = "#fff"; c.fillRect(X(0) - 3, 0, 3, H); c.fillRect(X(FW), 0, 3, H);
      // line of scrimmage (blue) and line to gain (yellow)
      c.fillStyle = "rgba(60,140,255,0.9)"; c.fillRect(X(0), Y(s.los) - 2, FW * ppy, 4);
      if (s.togo > 0) { c.fillStyle = "#ffd23f"; c.fillRect(X(0), Y(s.togo) - 2, FW * ppy, 4); }
      // routes preview
      if (s.phase === "pre" || s.phase === "call" && s.pick) {
        c.strokeStyle = "rgba(255,255,255,0.75)"; c.lineWidth = 2; c.setLineDash([6, 5]);
        s.rec.forEach(r => { c.beginPath(); r.path.pts.forEach((p, k) => { const yy = Math.max(p[1], s.los - 22); k ? c.lineTo(X(p[0]), Y(yy)) : c.moveTo(X(p[0]), Y(p[1])); }); c.stroke(); }); c.setLineDash([]);
      }
      const body = (x, y, col, col2, r) => { c.fillStyle = "rgba(0,0,0,0.25)"; c.beginPath(); c.ellipse(x + 2, y + 4, r, r * 0.7, 0, 0, 7); c.fill(); c.fillStyle = col; c.beginPath(); c.arc(x, y, r, 0, 7); c.fill(); c.strokeStyle = col2; c.lineWidth = 2; c.stroke(); };
      const rr = Math.max(11, ppy * 0.95);
      s.def.forEach(d => { body(X(d.x), Y(d.y), OPP, OPP2, rr); G.emoji(c, "🐈", X(d.x), Y(d.y) - 1, rr * 1.25); });
      s.rec.forEach((r, i) => {
        const x = X(r.x), y = Y(r.y);
        if (s.phase === "live" && r !== s.carrier) { const o = this.openness(G, r); c.strokeStyle = o > 2.6 ? "#5be35b" : o > 1.4 ? "#ffd23f" : "#ff5a5a"; c.lineWidth = 4; c.beginPath(); c.arc(x, y, rr + 6, 0, 7); c.stroke(); }
        body(x, y, TEAM, TEAM2, rr); G.emoji(c, "🐶", x, y - 2, rr * 1.25);
        G.text(c, String(r.num), x, y + rr + 7, 8, "#fff");
      });
      if (s.phase !== "run") { const q = s.qb; body(X(q.x), Y(q.y), TEAM, TEAM2, rr + 3); G.img(c, s.phase === "dead" && s.res && /SACK|PICK/.test(s.res.txt) ? ":dawgpain:" : ":dawgW:", X(q.x), Y(q.y) - 1, (rr + 3) * 2); }
      if (s.carrier) G.emoji(c, "🏈", X(s.carrier.x) + rr * 0.8, Y(s.carrier.y) + rr * 0.4, rr);
      if (s.ball && s.phase === "air") { const b = s.ball, u = b.t / b.T, hgt = Math.sin(u * Math.PI) * Math.min(40, b.T * 30);
        c.fillStyle = "rgba(0,0,0,0.25)"; c.beginPath(); c.ellipse(X(b.x), Y(b.y), 6, 3, 0, 0, 7); c.fill();
        G.emoji(c, "🏈", X(b.x), Y(b.y) - hgt, 16 + hgt * 0.15); }
      s.pops.forEach(p => G.text(c, p.txt, X(p.x), Y(p.y) - 24 - (0.8 - p.t) * 30, 10, "#ffd23f"));
      // HUD
      const dn = ["", "1ST", "2ND", "3RD", "4TH"][Math.min(4, s.down)] || "4TH", tg = s.togo > 0 ? Math.max(1, Math.round(s.los - s.togo)) : "GOAL";
      G.hud(c, `PTS ${s.score}`, `${dn} & ${tg}`, "🏈".repeat(Math.max(0, s.lives)) || "-");
      if (s.phase === "live") { const w = Math.min(220, W - 120), x0 = W / 2 - w / 2, f = clamp(s.clock / 4, 0, 1);
        c.fillStyle = "rgba(0,0,0,0.55)"; c.fillRect(x0 - 3, 41, w + 6, 14); c.fillStyle = f > 0.4 ? "#5be35b" : f > 0.2 ? "#ffd23f" : "#ff5a5a"; c.fillRect(x0, 44, w * f, 8); }
      if (s.phase === "call") {
        s.btns = []; const bh = 52, gap = 8, bw = (W - 24 - gap * 2) / 3, y0 = H - bh - 14;
        c.fillStyle = "rgba(0,0,0,0.55)"; c.fillRect(0, y0 - 34, W, bh + 48);
        G.text(c, s.drive > 1 || s.down > 1 ? "CALL THE NEXT PLAY" : "PICK A PLAY", W / 2, y0 - 17, 10, "#fff");
        s.offer.forEach((p, i) => { const x = 12 + i * (bw + gap); c.fillStyle = TEAM; c.beginPath(); if (c.roundRect) c.roundRect(x, y0, bw, bh, 10); else c.rect(x, y0, bw, bh); c.fill(); c.strokeStyle = TEAM2; c.lineWidth = 2; c.stroke();
          const words = p.n.split(" "); words.forEach((w, k) => G.text(c, w, x + bw / 2, y0 + bh / 2 + (k - (words.length - 1) / 2) * 13, Math.min(10, bw / 8), "#fff")); s.btns.push({ x, y: y0, w: bw, h: bh, play: p }); });
      }
      if (s.phase === "pre" && s.pick) G.banner(c, s.pick.n, "#fff", H * 0.3);
      if (s.phase === "dead" && s.res) { const by = Math.max(110, H * 0.3); c.fillStyle = "rgba(0,0,0,0.45)"; c.fillRect(0, by - 34, W, 80); G.banner(c, s.res.txt, s.res.col, by, s.res.txt.length > 11 ? Math.min(22, W / 15) : undefined); if (s.res.sub) G.text(c, s.res.sub, W / 2, by + 30, 10, "#fff"); }
      if (s.phase === "live" && s.drive === 1 && s.down === 1) G.hint(c, "TAP A RECEIVER TO THROW", 99, H - 30);
      if (s.phase === "run" && s.tds === 0 && s.drive === 1) G.hint(c, "DRAG TO STEER", 99, H - 30);
    },
    hitRec(G, x, y) { const s = G.s, W = G.W, H = G.H, ppy = (W - 16) / (FW + 2), fl = 8 + ppy, camY = s.los - 6;
      let best = -1, bd = 46; s.rec.forEach((r, i) => { const d = Math.hypot(fl + r.x * ppy - x, H * 0.62 + (r.y - camY) * ppy - y); if (d < bd) { bd = d; best = i; } }); return best; },
    down(G, x, y) {
      const s = G.s, ppy = (G.W - 16) / (FW + 2), fl = 8 + ppy;
      if (s.phase === "call") { const b = (s.btns || []).find(b => x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h); if (b) this.choose(G, b.play); return; }
      if (s.phase === "live") { const i = this.hitRec(G, x, y); if (i >= 0) this.throwTo(G, i); return; }
      if (s.phase === "run") s.fx = (x - fl) / ppy;
    },
    move(G, x) { const s = G.s; if (s.phase === "run") { const ppy = (G.W - 16) / (FW + 2); s.fx = (x - 8 - ppy) / ppy; } },
    up(G) { },
    onKey(G, k, d) { const s = G.s; if (!d) return; if (s.phase === "call" && /^[123]$/.test(k)) this.choose(G, s.offer[+k - 1]);
      if (s.phase === "live" && /^[1-5]$/.test(k)) this.throwTo(G, +k - 1);
      if (s.phase === "run" && s.carrier) { if (k === "ArrowLeft") s.fx = s.carrier.x - 4; if (k === "ArrowRight") s.fx = s.carrier.x + 4; } }
  });
})();
