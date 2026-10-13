// ---------- Dawg Derby (home run derby) ----------
// TV angle from behind the plate. A cat pitches, the bulldog bats. Tap to swing.
// 10 outs; any swing that isn't a homer is an out, and so is a called strike. Balls are free.
// Score = total home-run feet.
(function () {
  const PERFECT = 0.045, GOOD = 0.095, CONTACT = 0.17; // timing windows (seconds from ideal)
  const OUTS = 10;
  const rnd = (a, b) => a + Math.random() * (b - a);
  const lerp = (a, b, t) => a + (b - a) * t;

  function lay(G) {
    const W = G.W, H = G.H;
    return {
      sky: Math.max(H * 0.12, 76), wall: H * 0.27, grass: H * 0.30,
      moundX: W / 2, moundY: H * 0.50, relY: H * 0.455,
      plateX: W / 2, plateY: H * 0.87, zoneY: H * 0.79,
      batX: W / 2 - 58, batY: H * 0.78,
    };
  }

  function nextPitch(G) {
    const s = G.s, n = s.n;
    s.phase = "wait"; s.pt = rnd(0.9, 1.4); s.p = 0; s.swung = false;
    const change = n >= 3 && Math.random() < 0.3;
    const fast = Math.max(0.56, 0.95 - n * 0.022);
    s.type = change ? "CHANGEUP" : "FASTBALL";
    s.T = change ? fast * 1.45 : fast;
    s.mph = change ? Math.round(rnd(72, 80)) : Math.round(80 + (0.95 - fast) * 45 + rnd(0, 3));
    s.isBall = n >= 2 && Math.random() < 0.18;
    s.endX = G.W / 2 + (s.isBall ? (Math.random() < 0.5 ? -1 : 1) * rnd(58, 78) : rnd(-12, 12));
    s.curve = n >= 7 && !change && Math.random() < 0.5 ? (Math.random() < 0.5 ? -1 : 1) * Math.min(34, 14 + n * 1.2) : 0;
    if (s.curve) s.type = "CURVE";
  }

  function result(G, txt, sub, col, out, face) {
    const s = G.s;
    s.banner = { txt, sub, col, t: 1.5 }; s.phase = "result"; s.pt = out ? 1.7 : 1.4;
    if (out) { s.outs++; s.face = ":dawgcope:"; }
    if (face) s.face = face;
  }

  function launch(G, kind, ft, e) {
    const s = G.s, L = lay(G), W = G.W, H = G.H;
    const side = Math.max(-1, Math.min(1, -e / CONTACT)); // early = pulled to the left
    const f = { kind, ft, t: 0, x0: s.bx, y0: s.by, size0: 16 };
    if (kind === "hr") { f.x1 = W / 2 + side * W * 0.34 + rnd(-20, 20); f.y1 = lerp(L.sky, L.wall, rnd(0.2, 0.75)); f.arc = H * 0.38; f.dur = 1.8; f.size1 = 4; }
    else if (kind === "fly") { f.x1 = W / 2 + side * W * 0.3 + rnd(-20, 20); f.y1 = L.grass + H * 0.03; f.arc = H * 0.32; f.dur = 1.6; f.size1 = 5; }
    else if (kind === "foul") { f.x1 = W / 2 + (side < 0 ? -1 : 1) * W * 0.75; f.y1 = H * 0.35; f.arc = H * 0.22; f.dur = 1.1; f.size1 = 6; }
    else { f.x1 = W / 2 + side * W * 0.25 + rnd(-30, 30); f.y1 = H * 0.56; f.arc = 14; f.dur = 0.7; f.size1 = 9; }
    s.fly = f;
  }

  function burst(G, x, y, n) {
    const cols = ["#ffd23f", "#ff6b6b", "#5ad1ff", "#7dff7a", "#ff9cf2", "#fff"];
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2, v = rnd(40, 170);
      G.s.parts.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, t: rnd(0.9, 1.5), c: cols[i % cols.length] });
    }
  }

  function swing(G) {
    const s = G.s;
    if (s.phase !== "pitch" || s.swung) return;
    s.swung = true; s.swingT = 0.22;
    const e = (s.p - 1) * s.T, a = Math.abs(e);
    s.timing = a <= PERFECT ? "PERFECT!" : e < 0 ? "EARLY" : "LATE";
    if (a > CONTACT) { G.sfx("lose"); result(G, "WHIFF!", "OUT", "#ff6b6b", true); s.ballGone = true; return; }
    if (s.isBall) { // chased a ball off the plate: weak contact at best
      launch(G, "ground", 0, e); G.sfx("lose");
      result(G, "CHASED IT", "GROUNDOUT", "#ff9f43", true); return;
    }
    if (a <= PERFECT) {
      const ft = Math.round(480 - (a / PERFECT) * 60 + rnd(-6, 0));
      hr(G, ft, e);
    } else if (a <= GOOD) {
      const q = 1 - (a - PERFECT) / (GOOD - PERFECT);
      if (Math.random() < 0.25 + 0.5 * q) hr(G, Math.round(380 + q * 30 + rnd(0, 10)), e);
      else { const ft = Math.round(rnd(330, 375)); launch(G, "fly", ft, e); G.sfx("lose"); result(G, "FLY OUT", ft + " FT", "#ff9f43", true); }
    } else {
      const foul = Math.random() < 0.6;
      launch(G, foul ? "foul" : "ground", 0, e); G.sfx("lose");
      result(G, foul ? "FOUL BALL" : "GROUNDER", "OUT · " + (e < 0 ? "TOO EARLY" : "TOO LATE"), "#ff9f43", true);
    }
  }

  function hr(G, ft, e) {
    const s = G.s;
    launch(G, "hr", ft, e);
    s.hrs++; s.feet += ft; s.pending = ft;
    G.sfx("win"); G.buzz();
    result(G, "HOME RUN!", ft + " FT", ft >= 450 ? "#ff9cf2" : "#ffd23f", false, ft >= 450 ? ":dawgpog:" : ":dawgW:");
    s.pt = 2.1; s.banner.t = 2.0;
  }

  defGame({
    key: "derby", name: "Dawg Derby", icon: "⚾", max: 99999, cat: "sports",
    blurb: "Home run derby. Time your swing.",
    how: "The cat pitches, you tap anywhere to swing when the ball reaches the plate. Perfect timing = a moonshot. Any swing that isn't a homer is an out, and so is taking a strike. Balls wide of the plate are free: let them go. 10 outs. Score = total home-run feet.",
    reset(G) {
      G.s = { n: 0, outs: 0, hrs: 0, feet: 0, phase: "wait", pt: 1.2, p: 0, T: 0.95, type: "FASTBALL", mph: 80, isBall: false, endX: G.W / 2, curve: 0,
        swung: false, swingT: 0, bx: 0, by: 0, bsize: 0, fly: null, banner: null, parts: [], face: ":dawgW:", timing: "", ballGone: false, flash: 0, wind: 0 };
      nextPitch(G); G.s.pt = 1.2;
    },
    update(G, dt) {
      const s = G.s, L = lay(G);
      if (s.swingT > 0) s.swingT -= dt;
      if (s.flash > 0) s.flash -= dt;
      for (let i = s.parts.length - 1; i >= 0; i--) { const q = s.parts[i]; q.t -= dt; q.x += q.vx * dt; q.y += q.vy * dt; q.vy += 90 * dt; if (q.t <= 0) s.parts.splice(i, 1); }
      if (s.banner) { s.banner.t -= dt; if (s.banner.t <= 0) s.banner = null; }
      if (s.fly) {
        const f = s.fly; f.t += dt / f.dur;
        if (f.t >= 1) {
          if (f.kind === "hr" && f.ft >= 450) { burst(G, f.x1, f.y1 - 30, 50); burst(G, G.W * 0.25, L.sky + 10, 30); burst(G, G.W * 0.75, L.sky + 10, 30); s.flash = 0.25; G.buzz(); }
          s.fly = null;
        }
      }
      if (s.phase === "wait") { s.pt -= dt; if (s.pt <= 0) { s.phase = "windup"; s.pt = 0.55; } }
      else if (s.phase === "windup") { s.pt -= dt; if (s.pt <= 0) { s.phase = "pitch"; s.p = 0; s.ballGone = false; } }
      else if (s.phase === "pitch") {
        s.p += dt / s.T;
        const p = Math.min(s.p, 1.35);
        s.bx = lerp(L.moundX + 8, s.endX, p) + s.curve * Math.sin(Math.min(p, 1) * Math.PI) * 0.6 - s.curve * 0.3 * Math.max(0, p - 0.5);
        s.by = lerp(L.relY, L.zoneY, p) - Math.sin(Math.min(p, 1) * Math.PI) * 18;
        s.bsize = 4 + 19 * p * p;
        if (s.p >= 1.35) {
          s.ballGone = true;
          if (s.isBall) { G.sfx("pop"); result(G, "BALL", "NO PENALTY", "#5ad1ff", false); s.pt = 1.0; s.banner.t = 1.0; }
          else { G.sfx("lose"); G.buzz(); result(G, "STRIKE!", "OUT · SWING!", "#ff6b6b", true); }
        }
      } else if (s.phase === "result") {
        s.pt -= dt;
        if (s.pt <= 0 && !s.fly) {
          if (s.outs >= OUTS) {
            const sc = Math.min(99999, s.feet);
            s.face = ":dawgpain:";
            G.over(sc, sc >= 4000 ? "Tape-measure king!" : sc >= 2000 ? "Big Dawg power!" : sc > 0 ? "Nice pokes." : "Ruff. Golden sombrero.");
            return;
          }
          s.n++; nextPitch(G); s.face = s.outs >= 8 ? ":dawgsweat:" : ":dawgW:";
        }
      }
    },
    tap(G) { swing(G); },
    down() {},
    onKey(G, k, d) { if (d && (k === " " || k === "ArrowUp")) swing(G); },
    draw(G, c) {
      const s = G.s, W = G.W, H = G.H, dark = G.dark(), L = lay(G);
      // sky
      const g = c.createLinearGradient(0, 0, 0, L.wall);
      g.addColorStop(0, dark ? "#0b1030" : "#4aa8ff"); g.addColorStop(1, dark ? "#26306a" : "#bfe6ff");
      c.fillStyle = g; c.fillRect(0, 0, W, L.wall);
      if (dark) { c.fillStyle = "#fff"; let sd = 7; for (let i = 0; i < 26; i++) { sd = (sd * 16807) % 2147483647; const sx = sd % 1000 / 1000 * W; sd = (sd * 16807) % 2147483647; c.fillRect(sx, 34 + sd % 1000 / 1000 * Math.max(10, L.sky - 40), 2, 2); } }
      // light towers
      c.fillStyle = dark ? "#9aa0b8" : "#5b6278";
      [W * 0.08, W * 0.92].forEach(x => { c.fillRect(x - 2, L.sky - 26, 4, 30); c.fillStyle = dark ? "#fff7c2" : "#e8ecf5"; c.fillRect(x - 14, L.sky - 36, 28, 12); c.fillStyle = dark ? "#9aa0b8" : "#5b6278"; });
      // stands with crowd
      c.fillStyle = dark ? "#3a2f52" : "#8a7aa8"; c.fillRect(0, L.sky, W, L.wall - L.sky);
      const crowd = ["#ff6b6b", "#ffd23f", "#5ad1ff", "#ffffff", "#7dff7a", "#ff9cf2", "#f4a261"];
      const rowH = 7, rows = Math.floor((L.wall - L.sky - 4) / rowH);
      for (let r = 0; r < rows; r++) for (let x = (r % 2) * 4, i = 0; x < W; x += 8, i++) {
        const bob = (s.banner && s.banner.txt === "HOME RUN!") ? Math.round(Math.sin(G.t * 18 + i + r) * 1.5) : 0;
        c.fillStyle = crowd[(i * 7 + r * 3) % crowd.length]; c.fillRect(x, L.sky + 3 + r * rowH + bob, 5, 4);
      }
      // outfield wall
      c.fillStyle = dark ? "#0f4a2a" : "#1f7a44"; c.fillRect(0, L.wall, W, L.grass - L.wall);
      c.fillStyle = "#ffd23f"; c.fillRect(0, L.wall, W, 2);
      G.text(c, "400", W / 2, (L.wall + L.grass) / 2 + 1, 10, "#fff");
      G.text(c, "375", W * 0.2, (L.wall + L.grass) / 2 + 1, 10, "#fff"); G.text(c, "375", W * 0.8, (L.wall + L.grass) / 2 + 1, 10, "#fff");
      // grass with mowing stripes
      c.fillStyle = dark ? "#1d5a28" : "#4cae4f"; c.fillRect(0, L.grass, W, H - L.grass);
      c.fillStyle = dark ? "#226a2f" : "#58bd5b";
      for (let i = 0, y = L.grass; y < H; i++) { const h = 6 + i * 3; if (i % 2) c.fillRect(0, y, W, h); y += h; }
      // foul lines
      c.strokeStyle = "#fff"; c.lineWidth = 2;
      c.beginPath(); c.moveTo(L.plateX, L.plateY); c.lineTo(-W * 0.2, L.grass); c.moveTo(L.plateX, L.plateY); c.lineTo(W * 1.2, L.grass); c.stroke();
      // infield dirt + grass
      const dirt = dark ? "#8a5a32" : "#c98a52";
      c.fillStyle = dirt; c.beginPath();
      c.moveTo(L.plateX, L.plateY + 18); c.lineTo(W * 0.92, H * 0.62); c.lineTo(W / 2, H * 0.40); c.lineTo(W * 0.08, H * 0.62); c.closePath(); c.fill();
      c.fillStyle = dark ? "#1f6a2c" : "#52b555"; c.beginPath();
      c.moveTo(L.plateX, H * 0.80); c.lineTo(W * 0.74, H * 0.615); c.lineTo(W / 2, H * 0.46); c.lineTo(W * 0.26, H * 0.615); c.closePath(); c.fill();
      // bases
      c.fillStyle = "#fff";
      [[W * 0.8, H * 0.61], [W / 2, H * 0.425], [W * 0.2, H * 0.61]].forEach(b => c.fillRect(b[0] - 5, b[1] - 3, 10, 6));
      // mound
      c.fillStyle = dirt; c.beginPath(); c.ellipse(L.moundX, L.moundY, 30, 10, 0, 0, 7); c.fill();
      c.fillStyle = "#fff"; c.fillRect(L.moundX - 7, L.moundY - 2, 14, 3);
      // batter's box dirt + plate
      c.fillStyle = dirt; c.beginPath(); c.ellipse(L.plateX, L.plateY, W * 0.36, H * 0.07, 0, 0, 7); c.fill();
      c.strokeStyle = "rgba(255,255,255,0.7)"; c.lineWidth = 2;
      c.strokeRect(L.plateX - 78, L.plateY - 24, 50, 40); c.strokeRect(L.plateX + 28, L.plateY - 24, 50, 40);
      c.fillStyle = "#fff"; c.beginPath();
      c.moveTo(L.plateX - 16, L.plateY - 6); c.lineTo(L.plateX + 16, L.plateY - 6); c.lineTo(L.plateX + 16, L.plateY + 2); c.lineTo(L.plateX, L.plateY + 10); c.lineTo(L.plateX - 16, L.plateY + 2); c.closePath(); c.fill();
      // pitcher (cat), leaning during windup
      let lean = 0, lift = 0;
      if (s.phase === "windup") { const k = 1 - s.pt / 0.55; lean = -0.35 * Math.sin(k * Math.PI); lift = 6 * Math.sin(k * Math.PI); }
      else if (s.phase === "pitch" && s.p < 0.25) lean = 0.3 * (1 - s.p / 0.25);
      c.save(); c.translate(L.moundX, L.moundY - 18 - lift); c.rotate(lean); G.emoji(c, "🐈", 0, 0, 36); c.restore();
      // strike zone guide
      c.strokeStyle = s.phase === "pitch" ? "rgba(255,210,63,0.9)" : "rgba(255,255,255,0.35)"; c.lineWidth = 2;
      c.setLineDash([5, 4]); c.strokeRect(L.plateX - 22, L.zoneY - 22, 44, 44); c.setLineDash([]);
      // pitched ball (with shadow)
      if (s.phase === "pitch" && !s.ballGone) {
        {
          const shY = lerp(L.moundY, L.plateY, Math.min(1, s.p));
          c.fillStyle = "rgba(0,0,0,0.25)"; c.beginPath(); c.ellipse(s.bx, shY, s.bsize * 0.5, s.bsize * 0.18, 0, 0, 7); c.fill();
          ball(c, s.bx, s.by, s.bsize);
        }
      }
      // dog body (jersey) + face
      c.fillStyle = "#e63946"; c.beginPath(); c.ellipse(L.batX, L.batY + 40, 30, 24, 0, 0, 7); c.fill();
      G.text(c, "K9", L.batX, L.batY + 42, 10, "#fff");
      G.img(c, s.face, L.batX, L.batY, 72);
      // helmet brim
      c.fillStyle = "#1d3557"; c.beginPath(); c.ellipse(L.batX, L.batY - 30, 26, 9, 0, Math.PI, 0); c.fill(); c.fillRect(L.batX - 4, L.batY - 31, 30, 4);
      // batter: bat behind/in front depending on swing
      const swingK = s.swingT > 0 ? 1 - s.swingT / 0.22 : s.swung ? 1 : 0;
      const ang = lerp(-1.1, 0.95, swingK);
      const hx = L.batX + 30, hy = L.batY + 28;
      c.save(); c.translate(hx, hy); c.rotate(ang);
      c.fillStyle = "#b5773c"; c.strokeStyle = "#5a3a1a"; c.lineWidth = 2;
      c.beginPath(); c.moveTo(0, -3); c.lineTo(58, -6); c.arc(58, 0, 6, -Math.PI / 2, Math.PI / 2); c.lineTo(0, 3); c.closePath(); c.fill(); c.stroke();
      c.restore();
      if (s.swingT > 0) { c.strokeStyle = "rgba(255,255,255,0.6)"; c.lineWidth = 3; c.beginPath(); c.arc(hx, hy, 60, ang - 0.9, ang); c.stroke(); }
      // ball in flight
      if (s.fly) {
        const f = s.fly, t = Math.min(1, f.t), e = f.kind === "ground" ? t : 1 - (1 - t) * (1 - t) * 0.6;
        const x = lerp(f.x0, f.x1, e), y = lerp(f.y0, f.y1, e) - Math.sin(t * Math.PI) * f.arc, sz = lerp(f.size0, f.size1, t);
        c.fillStyle = "rgba(0,0,0,0.2)"; c.beginPath(); c.ellipse(x, lerp(f.y0 + 30, f.y1, e), sz * 0.5, sz * 0.2, 0, 0, 7); c.fill();
        ball(c, x, y, sz);
        if (f.kind === "hr" || f.kind === "fly") { const ly = Math.max(48, y - sz - 10); G.text(c, Math.round(f.ft * t) + " FT", x + 1, ly + 1, 11, "rgba(0,0,0,0.6)"); G.text(c, Math.round(f.ft * t) + " FT", x, ly, 11, "#ffd23f"); }
      }
      // fireworks
      for (let i = 0; i < s.parts.length; i++) { const q = s.parts[i]; c.globalAlpha = Math.min(1, q.t); c.fillStyle = q.c; c.fillRect(q.x - 2, q.y - 2, 4, 4); }
      c.globalAlpha = 1;
      if (s.flash > 0) { c.fillStyle = `rgba(255,255,255,${s.flash * 1.6})`; c.fillRect(0, 0, W, H); }
      // pitch info (just under the wall)
      if (s.phase === "pitch" || s.phase === "windup") {
        const msg = s.phase === "pitch" ? `${s.type} ${s.mph} MPH` : "HERE IT COMES...";
        G.text(c, msg, W / 2 + 1, L.grass + 19, 10, "rgba(0,0,0,0.5)"); G.text(c, msg, W / 2, L.grass + 18, 10, "#fff");
      }
      // banner
      if (s.banner) {
        const b = s.banner, pop = Math.min(1, (2.0 - b.t) * 6 + 0.4), y = H * 0.62;
        c.fillStyle = "rgba(0,0,0,0.38)"; c.fillRect(0, y - 46, W, 86);
        G.banner(c, b.txt, b.col, y, Math.round(Math.max(18, Math.min(28, W / 14)) * Math.min(1, pop)));
        G.text(c, b.sub, W / 2 + 1, y + 29, 12, "rgba(0,0,0,0.6)"); G.text(c, b.sub, W / 2, y + 28, 12, "#fff");
        if (s.timing && s.swung) {
          const tc = s.timing === "PERFECT!" ? "#7dff7a" : "#fff";
          if (b.txt !== "HOME RUN!" || s.timing === "PERFECT!") { G.text(c, s.timing, W / 2 + 1, y - 31, 12, "rgba(0,0,0,0.6)"); G.text(c, s.timing, W / 2, y - 32, 12, tc); }
        }
      }
      G.hint(c, "TAP TO SWING", 5, H - 22);
      // HUD
      const left = OUTS - (s.outs || 0);
      G.hud(c, `HR ${s.hrs || 0}`, `${s.feet || 0} FT`, `OUTS ${left}`);
    }
  });

  function ball(c, x, y, r) {
    c.fillStyle = "#fff"; c.beginPath(); c.arc(x, y, r / 2, 0, 7); c.fill();
    c.strokeStyle = "#333"; c.lineWidth = 1; c.stroke();
    if (r > 9) { c.strokeStyle = "#e63946"; c.lineWidth = 1.5; c.beginPath(); c.arc(x - r * 0.45, y, r * 0.35, -0.9, 0.9); c.stroke(); c.beginPath(); c.arc(x + r * 0.45, y, r * 0.35, Math.PI - 0.9, Math.PI + 0.9); c.stroke(); }
  }
})();
