// ---------- Hook Dawg (swing-and-fling, Stickman Hook style) ----------
// A stick-figure dawg swings from hooks. Hold to grab the nearest hook ahead, let go to fling.
// Don't fall in the pit. Score = distance + bones + flips.
// World x grows right, world y is screen y (down) shifted by camY (camera only rises when you fly high).
defGame({
  key: "hook", name: "Hook Dawg", icon: "🪝", max: 99999,
  blurb: "Hold to hook, let go to fling. Swing forever.",
  how: "Hold anywhere to grab the glowing hook and swing. Let go to fling yourself forward. Let go on the upswing to fly far. Bounce pads at the bottom save you, but miss them and you're in the pit. Grab bones for +25, and do a full flip in the air for +50 (more for doubles). Hooks get farther apart and start to drift the farther you go.",
  reset(G) {
    const W = G.W, H = G.H;
    const s = G.s = {
      p: { x: 70, y: H * 0.42, vx: 0, vy: 0, rot: 0, spin: 0 },
      hooks: [], pads: [], bones: [], pops: [], trail: [],
      hook: null, held: false, auto: true, len: 0,
      camX: 0, camY: 0, lastX: 0, maxX: 0, bonus: 0, airRot: 0, flips: 0, n: 0,
      hills: [], clouds: []
    };
    for (let i = 0; i < 7; i++) s.clouds.push({ x: Math.random() * W * 2, y: 20 + Math.random() * H * 0.35, w: 40 + Math.random() * 60 });
    for (let i = 0; i < 12; i++) s.hills.push({ x: i * 140 + Math.random() * 60, h: 40 + Math.random() * 70, w: 120 + Math.random() * 80 });
    // first hook right above the start so the dawg is already swinging
    s.hooks.push({ x: 150, y: H * 0.16, by: H * 0.16, bob: 0, ph: 0 });
    s.lastX = 150;
    s.hook = s.hooks[0];
    s.len = Math.hypot(s.p.x - s.hook.x, s.p.y - s.hook.y);
    s.p.vx = 260;
    this.gen(G);
  },
  gen(G) {
    const s = G.s, W = G.W, H = G.H;
    while (s.lastX < s.camX + W + 400) {
      s.n++;
      const lvl = Math.min(1, s.lastX / 30000);
      const gap = 170 + lvl * 110 + Math.random() * (50 + lvl * 40);
      const x = s.lastX + gap;
      const y = H * (0.12 + Math.random() * (0.26 + lvl * 0.08));
      const bob = s.lastX > 5000 && Math.random() < 0.25 + lvl * 0.45 ? 25 + Math.random() * 35 * (0.5 + lvl) : 0;
      s.hooks.push({ x, y, by: y, bob, ph: Math.random() * 6 });
      // bones along the arc between hooks
      if (Math.random() < 0.55) {
        const mx = s.lastX + gap / 2, my = H * (0.38 + Math.random() * 0.2);
        for (let i = -1; i <= 1; i++) s.bones.push({ x: mx + i * 26, y: my - (i === 0 ? 14 : 0), got: 0 });
      }
      // bounce pads in the pit (rarer the farther you go)
      if (Math.random() < 0.45 - lvl * 0.3) s.pads.push({ x: s.lastX + gap * (0.3 + Math.random() * 0.4), w: 70 - lvl * 20, sq: 0 });
      s.lastX = x;
    }
  },
  // the hook you'd grab right now: nearest one in reach, preferring ones ahead of you
  target(G) {
    const s = G.s, p = s.p; let best = null, bd = 1e9;
    for (const h of s.hooks) {
      if (h.x < p.x - 60) continue;
      const d = Math.hypot(h.x - p.x, h.y - p.y);
      if (d > 360 || d < 30) continue;
      const score = d - (h.x > p.x ? 60 : 0);
      if (score < bd) { bd = score; best = h; }
    }
    return best;
  },
  grab(G) {
    const s = G.s, p = s.p; s.held = true;
    if (s.auto && s.hook) return; // already hanging on the first hook
    const h = this.target(G); if (!h) return;
    s.hook = h; s.len = Math.max(70, Math.hypot(p.x - h.x, p.y - h.y)); s.auto = false;
    s.airRot = 0; G.sfx("pop");
  },
  release(G) {
    const s = G.s, p = s.p; s.held = false;
    if (!s.hook) return;
    s.hook = null; s.auto = false; s.airRot = 0;
    p.spin = Math.max(-14, Math.min(14, (p.vx * 0.006) + (p.vy < 0 ? 4 : 1) * Math.sign(p.vx || 1)));
  },
  update(G, dt) {
    const s = G.s, p = s.p, W = G.W, H = G.H;
    // drifting hooks
    for (const h of s.hooks) if (h.bob) { h.ph += dt * 1.6; h.y = h.by + Math.sin(h.ph) * h.bob; }
    const steps = 3, h = dt / steps;
    for (let i = 0; i < steps; i++) {
      p.vy += 1500 * h;
      if (s.hook) {
        // a little swing assist so momentum doesn't die
        const dx = p.x - s.hook.x, dy = p.y - s.hook.y, d = Math.hypot(dx, dy) || 1;
        const tx = -dy / d, ty = dx / d, along = p.vx * tx + p.vy * ty;
        const push = Math.sign(along) * 260 * h;
        p.vx += tx * push; p.vy += ty * push;
      }
      p.x += p.vx * h; p.y += p.vy * h;
      if (s.hook) {
        const dx = p.x - s.hook.x, dy = p.y - s.hook.y, d = Math.hypot(dx, dy) || 1;
        if (d > s.len) {
          const nx = dx / d, ny = dy / d;
          p.x = s.hook.x + nx * s.len; p.y = s.hook.y + ny * s.len;
          const out = p.vx * nx + p.vy * ny;
          if (out > 0) { p.vx -= out * nx; p.vy -= out * ny; }
        }
      }
    }
    const sp = Math.hypot(p.vx, p.vy); if (sp > 1400) { p.vx *= 1400 / sp; p.vy *= 1400 / sp; }
    // body rotation: hang along the rope, tumble in the air
    if (s.hook) {
      const want = Math.atan2(p.x - s.hook.x, -(p.y - s.hook.y)) + Math.PI;
      let dr = want - p.rot; dr = Math.atan2(Math.sin(dr), Math.cos(dr));
      p.rot += dr * Math.min(1, dt * 14);
    } else {
      const dr = p.spin * dt; p.rot += dr; s.airRot += dr;
      p.spin *= Math.pow(0.6, dt);
      if (Math.abs(s.airRot) >= Math.PI * 2) {
        s.airRot -= Math.sign(s.airRot) * Math.PI * 2; s.flips++;
        const pts = 50 * s.flips; s.bonus += pts; G.sfx("win");
        s.pops.push({ x: p.x, y: p.y - 40, t: 1, txt: (s.flips > 1 ? s.flips + "x FLIP +" : "FLIP +") + pts });
      }
    }
    if (s.hook) s.flips = 0;
    const bx = p.x - Math.sin(p.rot) * 32, by = p.y + Math.cos(p.rot) * 32; // body center
    // bones
    for (const b of s.bones) if (!b.got && Math.abs(b.x - bx) < 26 && Math.abs(b.y - by) < 34) {
      b.got = 1; s.bonus += 25; G.sfx("pop"); s.pops.push({ x: b.x, y: b.y - 16, t: 0.8, txt: "+25" });
    }
    // bounce pads at the bottom of the pit
    const padY = H - 34;
    for (const pd of s.pads) {
      pd.sq = Math.max(0, pd.sq - dt * 4);
      if (!s.hook && p.vy > 0 && by > padY - 26 && by < padY + 14 && Math.abs(bx - pd.x) < pd.w / 2 + 10) {
        p.y -= by - (padY - 26); p.vy = -Math.max(950, p.vy * 0.95); p.vx = Math.max(p.vx, 280);
        p.spin = 6 * Math.sign(p.vx); s.airRot = 0; pd.sq = 1; G.sfx("win");
        s.pops.push({ x: pd.x, y: padY - 40, t: 0.7, txt: "BOING" });
      }
    }
    // trail
    s.trail.push({ x: p.x, y: p.y, t: 0.35 });
    for (const t of s.trail) t.t -= dt;
    if (s.trail.length) s.trail = s.trail.filter(t => t.t > 0);
    for (const q of s.pops) q.t -= dt;
    if (s.pops.length) s.pops = s.pops.filter(q => q.t > 0);
    // camera
    const wantX = p.x - W * 0.36;
    s.camX += (wantX - s.camX) * Math.min(1, dt * 5);
    const wantY = Math.min(0, p.y - H * 0.18);
    s.camY += (wantY - s.camY) * Math.min(1, dt * 4);
    s.maxX = Math.max(s.maxX, p.x - 70);
    this.gen(G);
    const lo = s.camX - 300;
    if (s.hooks.length > 3 && s.hooks[0].x < lo && s.hooks[0] !== s.hook) s.hooks.shift();
    if (s.bones.length && s.bones[0].x < lo) s.bones = s.bones.filter(b => b.x >= lo);
    if (s.pads.length && s.pads[0].x < lo) s.pads = s.pads.filter(pd => pd.x >= lo);
    // fell in the pit
    if (by > H + 10) {
      G.sfx("lose"); G.buzz();
      const sc = this.score(s), m = Math.floor(s.maxX / 10);
      G.over(sc, m > 2000 ? "Swing legend!" : m > 600 ? "Into the pit!" : "Hold on tighter!");
    }
  },
  score(s) { return Math.min(99999, Math.floor(s.maxX / 10) + s.bonus); },
  down(G) { this.grab(G); },
  up(G) { this.release(G); },
  onKey(G, k, isDown) {
    if (k !== " " && k !== "ArrowUp" && k !== "w") return;
    if (isDown && !G.s.held) this.grab(G); else if (!isDown && G.s.held) this.release(G);
  },
  draw(G, c) {
    const s = G.s, W = G.W, H = G.H, dark = G.dark();
    if (!s.p) return;
    const cx = s.camX || 0, cy = s.camY || 0;
    const X = x => x - cx, Y = y => y - cy;
    // sky
    const gr = c.createLinearGradient(0, 0, 0, H);
    if (dark) { gr.addColorStop(0, "#141a46"); gr.addColorStop(1, "#3a2d6e"); }
    else { gr.addColorStop(0, "#5fb6ff"); gr.addColorStop(1, "#ffd9a8"); }
    c.fillStyle = gr; c.fillRect(0, 0, W, H);
    // sun / moon
    c.fillStyle = dark ? "rgba(240,240,255,0.85)" : "rgba(255,240,170,0.9)";
    c.beginPath(); c.arc(W * 0.8, Y(H * 0.14) * 0.5 + 40, 26, 0, Math.PI * 2); c.fill();
    // clouds (slow parallax)
    c.fillStyle = dark ? "rgba(190,200,240,0.16)" : "rgba(255,255,255,0.85)";
    const span = W + 200;
    for (const cl of s.clouds) {
      const xx = ((cl.x - cx * 0.2) % span + span) % span - 100, yy = cl.y - cy * 0.3;
      c.beginPath(); c.roundRect(xx - cl.w / 2, yy, cl.w, 16, 8); c.fill();
      c.beginPath(); c.roundRect(xx - cl.w / 4, yy - 10, cl.w * 0.5, 16, 8); c.fill();
    }
    // hills (mid parallax)
    c.fillStyle = dark ? "#2a2556" : "#7fcf8a";
    const hspan = 12 * 140;
    for (const hl of s.hills) {
      const xx = ((hl.x - cx * 0.45) % hspan + hspan) % hspan - 120, base = H - 30 - cy * 0.5;
      c.beginPath(); c.ellipse(xx, base, hl.w / 2, hl.h, 0, Math.PI, 0); c.fill();
    }
    // pit
    const pitY = Y(H - 24);
    c.fillStyle = dark ? "#0b0a1c" : "#3b2a4d"; c.fillRect(0, pitY, W, H - pitY + 50);
    c.fillStyle = dark ? "#e0446a" : "#ff5a7a";
    for (let x = -((cx * 1) % 20); x < W + 20; x += 20) { c.beginPath(); c.moveTo(x, pitY); c.lineTo(x + 10, pitY - 12); c.lineTo(x + 20, pitY); c.fill(); }
    // bounce pads
    for (const pd of s.pads) {
      const x = X(pd.x); if (x < -60 || x > W + 60) continue;
      const y = Y(H - 34), q = pd.sq;
      c.fillStyle = "#222"; c.fillRect(x - pd.w / 2 + 4, y + 4, 4, 20); c.fillRect(x + pd.w / 2 - 8, y + 4, 4, 20);
      c.fillStyle = "#1f9d55"; c.beginPath(); c.ellipse(x, y + 4 + q * 5, pd.w / 2, 7 - q * 3, 0, 0, Math.PI * 2); c.fill();
      c.fillStyle = "#6cf0a0"; c.fillRect(x - pd.w / 2 + 8, y + 1 + q * 5, pd.w - 16, 2);
    }
    // bones
    for (const b of s.bones) { if (b.got) continue; const x = X(b.x); if (x < -30 || x > W + 30) continue; G.emoji(c, "🦴", x, Y(b.y) + Math.sin(G.t * 4 + b.x) * 3, 22); }
    // hooks
    const tgt = !s.hook && G.state === "play" ? this.target(G) : null;
    for (const hk of s.hooks) {
      const x = X(hk.x), y = Y(hk.y); if (x < -40 || x > W + 40) continue;
      if (hk === tgt) { c.strokeStyle = "rgba(255,210,63," + (0.5 + 0.3 * Math.sin(G.t * 8)) + ")"; c.lineWidth = 3; c.beginPath(); c.arc(x, y, 18, 0, Math.PI * 2); c.stroke(); }
      c.fillStyle = hk.bob ? "#7b5cff" : "#ff8a1e"; c.beginPath(); c.arc(x, y, 10, 0, Math.PI * 2); c.fill();
      c.fillStyle = "#fff"; c.beginPath(); c.arc(x - 3, y - 3, 3, 0, Math.PI * 2); c.fill();
      c.strokeStyle = "rgba(0,0,0,0.35)"; c.lineWidth = 2; c.beginPath(); c.arc(x, y, 10, 0, Math.PI * 2); c.stroke();
    }
    // trail
    for (const t of s.trail) { c.fillStyle = `rgba(255,255,255,${t.t * 0.8})`; c.fillRect(X(t.x) - 2, Y(t.y) - 2, 4, 4); }
    // rope
    const p = s.p, px = X(p.x), py = Y(p.y);
    if (s.hook) {
      c.strokeStyle = dark ? "#e8e2ff" : "#3b2a1a"; c.lineWidth = 2.5;
      c.beginPath(); c.moveTo(px, py); c.lineTo(X(s.hook.x), Y(s.hook.y)); c.stroke();
    }
    // the stick dawg hangs from its hands at p; local +y points away from the hook
    c.save(); c.translate(px, py); c.rotate(p.rot);
    const ink = dark ? "#f2f2f2" : "#1d1d1d", fl = Math.sin(G.t * 12) * (s.hook ? 0.15 : 0.6);
    c.strokeStyle = ink; c.lineWidth = 3.5; c.lineCap = "round"; c.lineJoin = "round";
    c.beginPath();
    if (s.hook) { c.moveTo(-2, 0); c.lineTo(-13, 11); c.lineTo(0, 24); c.moveTo(2, 0); c.lineTo(13, 11); c.lineTo(0, 24); } // arms up to the rope
    else { c.moveTo(0, 24); c.lineTo(-14, 20 + fl * 10); c.lineTo(-20, 10 + fl * 14); c.moveTo(0, 24); c.lineTo(14, 20 - fl * 10); c.lineTo(20, 10 - fl * 14); }
    c.moveTo(0, 22); c.lineTo(0, 42);                        // body
    c.moveTo(0, 42); c.lineTo(-7 - fl * 6, 50); c.lineTo(-9 - fl * 8, 60); // legs
    c.moveTo(0, 42); c.lineTo(7 + fl * 6, 50); c.lineTo(9 + fl * 8, 60);
    c.stroke();
    c.restore();
    // head between the arms, kept fairly upright so the face reads
    const hx = px - Math.sin(p.rot) * 12, hy = py + Math.cos(p.rot) * 12;
    const face = G.state === "over" ? ":dawgpain:" : s.flips > 0 && !s.hook ? ":dawgpog:" : p.vy > 700 && !s.hook ? ":dawgsweat:" : ":dawgW:";
    G.img(c, face, hx, hy, 24, p.rot * 0.35);
    for (const q of s.pops) { c.globalAlpha = Math.min(1, q.t * 2); G.text(c, q.txt, X(q.x), Y(q.y) - (1 - q.t) * 30, 10, "#ffd23f"); c.globalAlpha = 1; }
    // off the top of the screen: little arrow
    if (py < 0) G.text(c, "▲", px, 40, 12, "#ffd23f");
    if (G.state === "play" && G.t < 4) {
      c.globalAlpha = 0.6 * Math.min(1, 4 - G.t);
      G.text(c, "HOLD = HOOK", W / 2, H * 0.62, 11, "#fff"); G.text(c, "LET GO = FLING", W / 2, H * 0.62 + 20, 11, "#fff");
      c.globalAlpha = 1;
    }
    // HUD
    c.fillStyle = "rgba(0,0,0,0.35)"; c.fillRect(0, 0, W, 30);
    G.text(c, `SCORE ${this.score(s)}`, 10, 15, 11, "#fff", "left");
    G.text(c, `${Math.floor(s.maxX / 10)}m`, W - 10, 15, 11, "#ffd23f", "right");
  }
});
