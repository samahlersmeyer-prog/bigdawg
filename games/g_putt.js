// ---------- Putt Pup (backyard mini golf) ----------
// Two leaderboard entries share one engine:
//   "putt"   = the 9 front holes (max 450)
//   "putt18" = the front 9 + a new back 9 (max 900)
// Drag back from the tennis ball like a slingshot and let go.
// Score per hole: ace 50, 2 strokes 40, 3 = 30, 4 = 20, 5 = 10, 6 (or picked up) = 5.
(function () {
  const PTS = [0, 50, 40, 30, 20, 10, 5];
  const MAXS = 6;
  const FLASH = 2.8; // seconds the result + scorecard stays up (tap to skip)
  const R = (a, b, c, d) => [[a, b], [c, b], [c, d], [a, d]];

  // ---- course data (all coordinates are 0..1 fractions of the course box) ----
  const FRONT = [
    { name: "STRAIGHT SHOT", par: 2, out: R(.22, .08, .78, .94), tee: [.5, .84], cup: [.5, .2], tip: "NICE AND EASY",
      deco: [["dog", .11, .6], ["🌻", .89, .28], ["🦴", .9, .78], ["🌼", .1, .2]] },
    { name: "DOG-LEG", par: 3, out: [[.1, .94], [.42, .94], [.42, .42], [.9, .42], [.9, .08], [.1, .08]], tee: [.26, .84], cup: [.76, .24], tip: "BANK IT AROUND THE CORNER",
      deco: [["🌷", .7, .62], ["🐿️", .8, .84], ["🌼", .58, .76], ["🥏", .92, .95]] },
    { name: "BANK SHOT", par: 3, out: R(.1, .08, .9, .94), blocks: [[.1, .47, .62, .53]], tee: [.26, .84], cup: [.24, .2], tip: "USE THE WALLS" },
    { name: "DOG HOUSE", par: 2, out: R(.18, .08, .82, .94), movers: [{ kind: "house", u: .5, v: .5, w: .3, h: .09, amp: .11, sp: 1.6 }], tee: [.5, .85], cup: [.5, .18], tip: "TIME IT PAST THE HOUSE",
      deco: [["🌻", .08, .3], ["🦴", .91, .7], ["🌷", .09, .82]] },
    { name: "NAP TIME", par: 3, out: R(.12, .08, .88, .94), sand: [[.28, .26, .72, .36]], dogs: [[.5, .58, .11]], tee: [.5, .86], cup: [.5, .17], tip: "LET SLEEPING DOGS LIE" },
    { name: "THE POND", par: 3, out: R(.1, .08, .9, .94), water: [[.1, .42, .64, .6]], tee: [.3, .85], cup: [.3, .18], tip: "WATER COSTS A STROKE" },
    { name: "BOUNCE HOUSE", par: 2, out: R(.14, .08, .86, .94), bump: [[.5, .5, .07], [.3, .36, .06], [.7, .36, .06], [.32, .67, .05], [.68, .67, .05]], tee: [.5, .86], cup: [.5, .17], tip: "BOING BOING" },
    { name: "THE BRIDGE", par: 2, out: R(.1, .08, .9, .94), water: [[.1, .4, .9, .6]], bridges: [[.42, .4, .58, .6]], tee: [.5, .86], cup: [.36, .18], tip: "STAY ON THE BRIDGE" },
    { name: "WINDMILL BONE", par: 3, out: R(.12, .08, .88, .94), blocks: [[.12, .48, .36, .54], [.64, .48, .88, .54]], bone: { u: .5, v: .51, len: .085, sp: 1.8 },
      sand: [[.5, .27, .88, .35]], water: [[.12, .66, .34, .8]], bump: [[.3, .22, .05]], tee: [.5, .86], cup: [.72, .18], tip: "WATCH THE SPINNING BONE" },
  ];
  const BACK = [
    { name: "LOOP-DE-LOOP", par: 3, out: R(.2, .06, .8, .94), tee: [.5, .86], cup: [.5, .17], tip: "TOO SLOW & IT ROLLS BACK",
      ramp: [.2, .4, .8, .68], loop: [.38, .34, .62, .4], blocks: [[.2, .34, .38, .4], [.62, .34, .8, .4]],
      deco: [["🌻", .1, .8], ["🐿️", .9, .22], ["🦴", .9, .74]] },
    { name: "UNDER THE DECK", par: 2, out: R(.12, .06, .88, .94), tee: [.32, .86], cup: [.72, .18], tip: "PICK A TUNNEL",
      deck: { r: [.12, .36, .88, .6], tunnels: [[.2, .31], [.45, .55], [.69, .8]] }, bump: [[.5, .74, .045]] },
    { name: "SPRINKLER", par: 3, out: R(.1, .06, .9, .94), tee: [.5, .87], cup: [.5, .17], tip: "DODGE THE SPRAY",
      sprink: { u: .5, v: .5, R: .42, sp: 1.3, F: 640 }, deco: [["🐸", .05, .3], ["🌷", .95, .62]] },
    { name: "SEESAW", par: 3, out: R(.18, .06, .82, .94), tee: [.5, .86], cup: [.5, .17], tip: "CROSS WHEN IT'S LEVEL",
      water: [[.18, .36, .82, .64]], seesaw: { r: [.39, .36, .61, .64], A: 340, sp: 1.5 }, deco: [["🦆", .1, .5], ["🌼", .9, .3]] },
    { name: "MOW DOWN", par: 3, out: R(.12, .06, .88, .94), tee: [.5, .87], cup: [.5, .17], tip: "DON'T GET MOWED",
      movers: [{ kind: "mower", u: .5, v: .58, w: .2, h: .075, amp: .2, sp: 1.3 }, { kind: "mower", u: .5, v: .34, w: .2, h: .075, amp: .2, sp: 1.7, ph: 2 }] },
    { name: "ISLAND GREEN", par: 3, out: R(.1, .06, .9, .94), tee: [.5, .86], cup: [.5, .22], tip: "TAKE THE BRIDGE",
      water: [[.1, .06, .9, .52]], islands: [[.28, .12, .72, .34]], bridges: [[.44, .34, .56, .52]], deco: [["🐢", .05, .7], ["🌻", .95, .76]] },
    { name: "ZIG-ZAG", par: 3, out: R(.12, .06, .88, .94), tee: [.5, .87], cup: [.72, .17], tip: "PINBALL TIME",
      bump: [[.3, .72, .05], [.7, .72, .05], [.5, .6, .05], [.3, .48, .05], [.7, .48, .05], [.5, .36, .05], [.3, .24, .05]] },
    { name: "SHORTCUT", par: 3, out: R(.1, .06, .9, .94), tee: [.28, .86], cup: [.72, .82], tip: "THE DOGGY DOOR IS FASTER",
      blocks: [[.46, .26, .54, .6], [.46, .67, .54, .94]], sand: [[.6, .1, .86, .2]] },
    { name: "THE DOGHOUSE", par: 3, out: R(.12, .06, .88, .94), tee: [.5, .87], cup: [.5, .2], tip: "PUTT IT THROUGH THE DOOR",
      dh: { r: [.34, .1, .66, .3], door: [.44, .56] }, bump: [[.5, .58, .055], [.28, .44, .045], [.72, .44, .045]] },
  ];

  const inR = (r, x, y) => x > r.x && x < r.x + r.w && y > r.y && y < r.y + r.h;
  function inPoly(P, x, y) {
    let c = false;
    for (let i = 0, j = P.length - 1; i < P.length; j = i++) {
      const xi = P[i][0], yi = P[i][1], xj = P[j][0], yj = P[j][1];
      if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) c = !c;
    }
    return c;
  }
  const rectSegs = (segs, r, th) => segs.push([r.x, r.y, r.x + r.w, r.y, th], [r.x + r.w, r.y, r.x + r.w, r.y + r.h, th], [r.x + r.w, r.y + r.h, r.x, r.y + r.h, th], [r.x, r.y + r.h, r.x, r.y, th]);

  function load(G, i) {
    const s = G.s, h = s.holes[i];
    const X = u => s.x0 + u * s.cw, Y = v => s.y0 + v * s.ch;
    const rect = q => ({ x: X(q[0]), y: Y(q[1]), w: X(q[2]) - X(q[0]), h: Y(q[3]) - Y(q[1]) });
    s.hi = i; s.hole = h; s.strokes = 0; s.phase = "aim"; s.drag = null; s.intro = 2.2; s.rt = 0; s.loopA = null;
    s.out = h.out.map(p => [X(p[0]), Y(p[1])]);
    s.path = typeof Path2D !== "undefined" ? new Path2D() : null;
    if (s.path) { s.out.forEach((p, k) => k ? s.path.lineTo(p[0], p[1]) : s.path.moveTo(p[0], p[1])); s.path.closePath(); }
    s.segs = [];
    for (let k = 0; k < s.out.length; k++) { const a = s.out[k], b = s.out[(k + 1) % s.out.length]; s.segs.push([a[0], a[1], b[0], b[1], 4]); }
    s.blocks = (h.blocks || []).map(rect);
    s.solid = s.blocks.slice();
    // deck: solid between the tunnels, drawn as a wooden deck over the top
    s.deck = null;
    if (h.deck) {
      const d = h.deck, r = d.r; s.deck = { ...rect(r), tun: d.tunnels.map(t => [X(t[0]), X(t[1])]) };
      let u = r[0];
      for (const t of d.tunnels.concat([[r[2], r[2]]])) { if (t[0] - u > 0.001) s.solid.push(rect([u, r[1], t[0], r[3]])); u = t[1]; }
    }
    s.solid.forEach(r => rectSegs(s.segs, r, 0));
    // doghouse: walls on all sides except a door in the bottom
    s.dh = null;
    if (h.dh) {
      const r = rect(h.dh.r), d0 = X(h.dh.door[0]), d1 = X(h.dh.door[1]); s.dh = { ...r, d0, d1 };
      s.segs.push([r.x, r.y, r.x + r.w, r.y, 3], [r.x + r.w, r.y, r.x + r.w, r.y + r.h, 3], [r.x, r.y + r.h, r.x, r.y, 3],
        [r.x, r.y + r.h, d0, r.y + r.h, 3], [d1, r.y + r.h, r.x + r.w, r.y + r.h, 3]);
    }
    s.sand = (h.sand || []).map(rect); s.water = (h.water || []).map(rect);
    s.bridges = (h.bridges || []).map(rect); s.islands = (h.islands || []).map(rect);
    s.seesaw = h.seesaw ? { ...rect(h.seesaw.r), A: h.seesaw.A * s.k, sp: h.seesaw.sp, ax: 0 } : null;
    s.safe = s.bridges.concat(s.islands, s.seesaw ? [s.seesaw] : []);
    s.ramp = h.ramp ? rect(h.ramp) : null;
    s.loop = h.loop ? rect(h.loop) : null;
    if (s.loop) { s.loop.exitY = s.loop.y - s.br - 4; s.segs.push([s.loop.x, s.loop.y, s.loop.x + s.loop.w, s.loop.y, 0]); }
    s.spr = h.sprink ? { x: X(h.sprink.u), y: Y(h.sprink.v), R: h.sprink.R * s.cw, r: s.cw * 0.035, sp: h.sprink.sp, F: h.sprink.F * s.k, a: 0 } : null;
    s.bump = (h.bump || []).map(b => ({ x: X(b[0]), y: Y(b[1]), r: b[2] * s.cw, hit: 0 }));
    s.dogs = (h.dogs || []).map(b => ({ x: X(b[0]), y: Y(b[1]), r: b[2] * s.cw }));
    s.movers = (h.movers || []).map(m => ({ kind: m.kind, cx: X(m.u), y: Y(m.v) - m.h * s.ch / 2, w: m.w * s.cw, h: m.h * s.ch, amp: m.amp * s.cw, sp: m.sp, ph: m.ph || 0, x: 0, vx: 0 }));
    s.bone = h.bone ? { x: X(h.bone.u), y: Y(h.bone.v), len: h.bone.len * s.cw, sp: h.bone.sp, a: 0 } : null;
    s.cup = { x: X(h.cup[0]), y: Y(h.cup[1]) };
    s.ball = { x: X(h.tee[0]), y: Y(h.tee[1]), vx: 0, vy: 0, r: s.br, sc: 1 };
    s.last = { x: s.ball.x, y: s.ball.y };
    s.deco = (h.deco || []).map(d => [d[0], X(d[1]), Y(d[2])]);
    s.kang = -Math.PI / 2; s.kpow = 0.5; s.kshow = false;
    moveObstacles(s);
  }

  function moveObstacles(s) {
    for (const m of s.movers) { const t = s.ot * m.sp + m.ph; m.x = m.cx + Math.sin(t) * m.amp - m.w / 2; m.vx = Math.cos(t) * m.amp * m.sp; }
    if (s.bone) s.bone.a = s.ot * s.bone.sp;
    if (s.spr) s.spr.a = s.ot * s.spr.sp;
    if (s.seesaw) s.seesaw.ax = s.seesaw.A * Math.sin(s.ot * s.seesaw.sp);
  }

  // ball vs segment (optionally moving: translation sv, or rotating about px,py with omega om)
  function hitSeg(b, ax, ay, bx, by, th, svx, svy, e, om, px, py) {
    const dx = bx - ax, dy = by - ay, L2 = dx * dx + dy * dy;
    let t = L2 ? ((b.x - ax) * dx + (b.y - ay) * dy) / L2 : 0; t = t < 0 ? 0 : t > 1 ? 1 : t;
    const qx = ax + dx * t, qy = ay + dy * t; let nx = b.x - qx, ny = b.y - qy;
    const d = Math.hypot(nx, ny), m = b.r + th;
    if (d >= m) return false;
    if (d < 1e-6) { const l = Math.sqrt(L2) || 1; nx = -dy / l; ny = dx / l; } else { nx /= d; ny /= d; }
    b.x = qx + nx * m; b.y = qy + ny * m;
    if (om) { svx += -om * (qy - py); svy += om * (qx - px); }
    const vn = (b.vx - svx) * nx + (b.vy - svy) * ny;
    if (vn < 0) { b.vx -= (1 + e) * vn * nx; b.vy -= (1 + e) * vn * ny; }
    return vn < -60;
  }
  function hitCircle(b, cx, cy, cr, e, kick) {
    let nx = b.x - cx, ny = b.y - cy; const d = Math.hypot(nx, ny), m = cr + b.r;
    if (d >= m) return false;
    if (d < 1e-6) { nx = 0; ny = 1; } else { nx /= d; ny /= d; }
    b.x = cx + nx * m; b.y = cy + ny * m;
    const vn = b.vx * nx + b.vy * ny;
    if (vn < 0) { b.vx -= (1 + e) * vn * nx; b.vy -= (1 + e) * vn * ny; b.vx += nx * kick; b.vy += ny * kick; return true; }
    return false;
  }
  function movingHits(s, b, e) {
    let hit = false;
    for (const H of s.movers) { const x0 = H.x, y0 = H.y, x1 = H.x + H.w, y1 = H.y + H.h;
      hit = hitSeg(b, x0, y0, x1, y0, 0, H.vx, 0, e) | hitSeg(b, x1, y0, x1, y1, 0, H.vx, 0, e) | hitSeg(b, x1, y1, x0, y1, 0, H.vx, 0, e) | hitSeg(b, x0, y1, x0, y0, 0, H.vx, 0, e) || hit; }
    if (s.bone) { const B = s.bone, cx = Math.cos(B.a) * B.len, cy = Math.sin(B.a) * B.len;
      hit = hitSeg(b, B.x - cx, B.y - cy, B.x + cx, B.y + cy, 6, 0, 0, e, B.sp, B.x, B.y) || hit; }
    return hit;
  }
  function escaped(s, b) {
    if (!isFinite(b.x) || !isFinite(b.y) || !inPoly(s.out, b.x, b.y)) return true;
    for (const r of s.solid) if (inR(r, b.x, b.y)) return true;
    for (const m of s.movers) if (inR(m, b.x, b.y)) return true;
    for (const d of s.dogs) if (Math.hypot(b.x - d.x, b.y - d.y) < d.r * 0.8) return true;
    if (s.spr && Math.hypot(b.x - s.spr.x, b.y - s.spr.y) < s.spr.r * 0.8) return true;
    return false;
  }
  // is the ball inside the spray of the sprinkler? returns push strength 0..1
  function spray(s, x, y) {
    const S = s.spr, dx = x - S.x, dy = y - S.y, d = Math.hypot(dx, dy);
    if (d > S.R || d < 1) return 0;
    let best = 0;
    for (let j = 0; j < 2; j++) { // two jets, opposite each other
      let da = Math.atan2(dy, dx) - S.a - j * Math.PI; da = Math.atan2(Math.sin(da), Math.cos(da));
      const c = 1 - Math.abs(da) / 0.42; if (c > best) best = c;
    }
    return best > 0 ? best * (1 - 0.5 * d / S.R) : 0;
  }

  function pop(s, txt, x, y, col) { s.pops.push({ txt, x, y, t: 0.9, c: col }); }

  function shoot(G, ux, uy, p) {
    const s = G.s, b = s.ball;
    if (s.phase !== "aim" || p < 0.04) return;
    const v = p * s.vmax; b.vx = ux * v; b.vy = uy * v;
    s.last.x = b.x; s.last.y = b.y; s.strokes++; s.phase = "roll"; s.rt = 0; s.drag = null; s.kshow = false; s.intro = 0;
    G.sfx("pop");
  }

  function finishHole(G, n, picked) {
    const s = G.s, h = s.hole; n = Math.min(MAXS, n);
    const pts = PTS[n]; s.total += pts; s.cards.push(n);
    const d = n - h.par;
    let t, face, col = "#ffd23f";
    if (picked) { t = "PICKED UP"; face = ":dawgL:"; col = "#ff9f6b"; }
    else if (n === 1) { t = "HOLE IN ONE!"; face = ":dawgpog:"; }
    else if (d <= -2) { t = "EAGLE!"; face = ":dawgpog:"; }
    else if (d === -1) { t = "BIRDIE!"; face = ":dawgW:"; }
    else if (d === 0) { t = "PAR"; face = ":dawgW:"; col = "#9be7ff"; }
    else if (d === 1) { t = "BOGEY"; face = ":dawgsweat:"; col = "#ffb36b"; }
    else { t = "+" + d + " OVER"; face = ":dawgcope:"; col = "#ff8f8f"; }
    s.flash = { t, face, col, pts, n };
    s.phase = "flash"; s.pt = FLASH; s.drag = null;
    if (!picked && d <= 0) G.sfx("win"); else if (picked) { G.sfx("lose"); G.buzz(); }
  }

  function stopBall(G) {
    const s = G.s, b = s.ball; b.vx = b.vy = 0;
    if (s.strokes >= MAXS) { finishHole(G, MAXS, true); return; }
    s.phase = "aim"; s.last.x = b.x; s.last.y = b.y;
  }

  function physics(G, dt) {
    const s = G.s, b = s.ball;
    const sp0 = Math.hypot(b.vx, b.vy);
    const n = Math.min(24, Math.max(1, Math.ceil(sp0 * dt / (b.r * 0.4))));
    const h = dt / n; let inSand = false, onSlope = false;
    for (let i = 0; i < n; i++) {
      // slopes and pushes
      if (s.ramp && inR(s.ramp, b.x, b.y)) { b.vy += s.grav * h; onSlope = true; }
      if (s.seesaw && inR(s.seesaw, b.x, b.y)) { b.vx += s.seesaw.ax * h; onSlope = true; }
      if (s.spr) { const k = spray(s, b.x, b.y); if (k > 0) { const dx = b.x - s.spr.x, dy = b.y - s.spr.y, d = Math.hypot(dx, dy); b.vx += dx / d * s.spr.F * k * h; b.vy += dy / d * s.spr.F * k * h; if (s.wet <= 0) { s.wet = 0.7; pop(s, "SPLOOSH", b.x, b.y - 18, "#9be7ff"); } } }
      b.x += b.vx * h; b.y += b.vy * h;
      let clack = false;
      for (const g of s.segs) clack = hitSeg(b, g[0], g[1], g[2], g[3], g[4], 0, 0, 0.72) || clack;
      for (const u of s.bump) if (hitCircle(b, u.x, u.y, u.r, 0.95, 70)) { u.hit = 0.2; clack = true; }
      for (const d of s.dogs) if (hitCircle(b, d.x, d.y, d.r, 0.5, 0)) { clack = true; if (s.snort <= 0) { s.snort = 0.8; pop(s, "SNRK!", d.x, d.y - d.r - 8, "#fff"); } }
      if (s.spr) hitCircle(b, s.spr.x, s.spr.y, s.spr.r, 0.5, 0);
      clack = movingHits(s, b, 0.7) || clack;
      if (clack && s.clack <= 0) { s.clack = 0.15; }
      // loop-de-loop: made it to the top of the ramp
      if (s.loop && b.vy < 0 && inR(s.loop, b.x, b.y)) {
        const L = s.loop;
        s.phase = "loop"; s.loopA = { t: 0, x: Math.max(L.x + b.r + 2, Math.min(L.x + L.w - b.r - 2, b.x)), v: Math.hypot(b.vx, b.vy) };
        b.vx = b.vy = 0; pop(s, "WHEEE!", L.x + L.w / 2, L.y - 30, "#ffd23f"); G.sfx("pop"); return;
      }
      // water (bridges, islands and the seesaw are safe)
      for (const w of s.water) if (inR(w, b.x, b.y)) {
        let ok = false; for (const q of s.safe) if (inR(q, b.x, b.y)) { ok = true; break; }
        if (ok) continue;
        s.phase = "splash"; s.pt = 0.9; s.splash = { x: b.x, y: b.y }; b.vx = b.vy = 0; s.strokes++;
        pop(s, "SPLASH! +1", b.x, b.y - 20, "#9be7ff"); G.sfx("lose"); G.buzz(); return;
      }
      for (const r of s.sand) if (inR(r, b.x, b.y)) inSand = true;
      // cup
      const cx = s.cup.x - b.x, cy = s.cup.y - b.y, cd = Math.hypot(cx, cy), sp = Math.hypot(b.vx, b.vy);
      if (cd < s.cr) {
        if (sp < s.sinkV || cd < s.cr * 0.35 && sp < s.sinkV * 1.6) { s.phase = "sink"; s.pt = 0.45; s.sinkFrom = { x: b.x, y: b.y }; b.vx = b.vy = 0; G.sfx("win"); return; }
        b.vx += cx / (cd || 1) * 1400 * h; b.vy += cy / (cd || 1) * 1400 * h;
      }
    }
    if (escaped(s, b)) { b.x = s.last.x; b.y = s.last.y; b.vx = b.vy = 0; s.oops = (s.oops || 0) + 1; pop(s, "OOPS", b.x, b.y - 20, "#fff"); stopBall(G); return; }
    // friction
    const sp = Math.hypot(b.vx, b.vy);
    let ns = sp * Math.exp(-(1.25 + (inSand ? 5 : 0)) * dt) - (inSand ? 120 : 30) * dt;
    if (ns < 0) ns = 0;
    s.inSand = inSand;
    if ((ns < s.stopV && !onSlope) || s.rt > 14) { stopBall(G); return; }
    if (sp > 0) { b.vx *= ns / sp; b.vy *= ns / sp; }
  }

  function nextHole(G) {
    const s = G.s;
    if (s.hi >= s.holes.length - 1) {
      s.phase = "done";
      const t = s.total, m = s.holes.length * 50;
      G.over(t, t >= m * 0.8 ? "Top dog of the yard!" : t >= m * 0.6 ? "Good boy!" : t >= m * 0.4 ? "Ruff round." : "Lost it in the hedges.");
      return;
    }
    load(G, s.hi + 1);
  }

  // ---------------- drawing ----------------
  function drawMower(G, c, m, dark) {
    const t = G.t;
    c.fillStyle = "#222"; for (const wx of [m.x + 5, m.x + m.w - 13]) for (const wy of [m.y - 3, m.y + m.h - 5]) c.fillRect(wx, wy, 8, 8);
    c.fillStyle = "#e0453a"; c.beginPath(); c.roundRect(m.x, m.y, m.w, m.h, 8); c.fill();
    c.strokeStyle = "#7a1d16"; c.lineWidth = 2; c.stroke();
    c.fillStyle = "#3a3a3a"; c.beginPath(); c.arc(m.x + m.w / 2, m.y + m.h / 2, m.h * 0.32, 0, 7); c.fill();
    c.strokeStyle = "#bbb"; c.lineWidth = 2; const a = t * 20;
    c.beginPath(); c.moveTo(m.x + m.w / 2 - Math.cos(a) * m.h * 0.28, m.y + m.h / 2 - Math.sin(a) * m.h * 0.28); c.lineTo(m.x + m.w / 2 + Math.cos(a) * m.h * 0.28, m.y + m.h / 2 + Math.sin(a) * m.h * 0.28); c.stroke();
    // handle trails behind the direction of travel
    const dir = m.vx >= 0 ? -1 : 1, hx = dir < 0 ? m.x : m.x + m.w;
    c.strokeStyle = dark ? "#aaa" : "#555"; c.lineWidth = 3;
    c.beginPath(); c.moveTo(hx, m.y + 4); c.lineTo(hx + dir * 16, m.y - 2); c.moveTo(hx, m.y + m.h - 4); c.lineTo(hx + dir * 16, m.y + m.h + 2); c.lineTo(hx + dir * 16, m.y - 2); c.stroke();
    // clippings
    c.fillStyle = dark ? "#5c9e46" : "#3f8a2a";
    for (let i = 0; i < 4; i++) { const k = (t * 3 + i / 4) % 1; c.fillRect(hx + dir * (6 + k * 26), m.y + m.h / 2 + Math.sin(i * 2.1 + t * 9) * 10, 3, 3); }
  }
  function drawHouse(G, c, h) {
    c.fillStyle = "#c0392b"; c.fillRect(h.x, h.y, h.w, h.h);
    c.fillStyle = "#8e2a1f"; c.fillRect(h.x, h.y, h.w, h.h * 0.32);
    c.fillStyle = "#2b1a12"; c.beginPath(); c.roundRect(h.x + h.w * 0.38, h.y + h.h * 0.35, h.w * 0.24, h.h * 0.65, [8, 8, 0, 0]); c.fill();
    c.strokeStyle = "#5e1a12"; c.lineWidth = 2; c.strokeRect(h.x, h.y, h.w, h.h);
    G.text(c, "WOOF", h.x + h.w * 0.19, h.y + h.h * 0.64, 10, "#ffe9a8");
  }
  function drawBall(c, b, r) {
    c.fillStyle = "rgba(0,0,0,0.25)"; c.beginPath(); c.ellipse(b.x + 2, b.y + 3, r, r * 0.8, 0, 0, 7); c.fill();
    c.fillStyle = "#d8f033"; c.beginPath(); c.arc(b.x, b.y, r, 0, 7); c.fill();
    c.strokeStyle = "#fff"; c.lineWidth = 1.5;
    c.beginPath(); c.arc(b.x - r * 0.9, b.y, r * 0.75, -1.1, 1.1); c.stroke();
    c.beginPath(); c.arc(b.x + r * 0.9, b.y, r * 0.75, Math.PI - 1.1, Math.PI + 1.1); c.stroke();
  }
  function loopRing(s) { const L = s.loop; return { x: L.x + L.w / 2, y: L.y - s.ch * 0.035, rx: L.w * 0.42, ry: s.ch * 0.06 }; }

  function scorecard(G, c, s, x, y, w) {
    const n = s.holes.length, rows = n > 9 ? 2 : 1, lab = 34, cw = (w - lab) / 9, rh = 17;
    for (let r = 0; r < rows; r++) {
      const yy = y + r * (rh * 2 + 6);
      G.text(c, r ? "IN" : "OUT", x + 2, yy + rh / 2, 10, "#bbb", "left");
      let sum = 0;
      for (let k = 0; k < 9; k++) {
        const hi = r * 9 + k, cx = x + lab + cw * k + cw / 2, v = s.cards[hi], par = s.holes[hi].par;
        c.fillStyle = hi === s.cards.length - 1 ? "rgba(255,210,63,0.28)" : k % 2 ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.12)";
        c.fillRect(cx - cw / 2 + 1, yy, cw - 2, rh * 2);
        G.text(c, String(hi + 1), cx, yy + rh / 2 + 1, 10, "#999");
        if (v != null) { sum += v; G.text(c, String(v), cx, yy + rh * 1.5 + 1, 10, v < par ? "#7CFC6B" : v === par ? "#9be7ff" : v >= MAXS ? "#ff8f8f" : "#ffb36b"); }
        else G.text(c, "·", cx, yy + rh * 1.5 + 1, 10, "#666");
      }
      if (sum) G.text(c, String(sum), x + 2, yy + rh * 1.5 + 1, 10, "#fff", "left");
    }
    return rows * (rh * 2 + 6);
  }

  function draw(G, c) {
    const s = G.s, W = G.W, H = G.H, dark = G.dark(), b = s.ball, t = G.t;
    // yard
    c.fillStyle = dark ? "#173016" : "#5fa845"; c.fillRect(0, 0, W, H);
    c.fillStyle = dark ? "#1b3819" : "#67b14c";
    for (let y = 0; y < H; y += 24) for (let x = (y / 24) % 2 ? 12 : 0; x < W; x += 24) c.fillRect(x, y, 12, 12);
    if (!s.path) return;
    for (const d of s.deco) {
      if (d[0] === "dog") {
        c.fillStyle = dark ? "#5a3b2a" : "#b0754a"; c.beginPath(); c.ellipse(d[1], d[2] + 16, 34, 13, 0, 0, 7); c.fill();
        G.img(c, ":dawgW:", d[1], d[2], Math.min(56, s.cw * 0.17));
        const z = (t * 0.7) % 1; G.text(c, "z", d[1] + 18 + z * 10, d[2] - 26 - z * 18, 10 + z * 5, dark ? "#cfe" : "#fff");
      } else G.emoji(c, d[0], d[1], d[2], 24);
    }
    // course turf with mowed stripes
    c.save(); c.clip(s.path);
    c.fillStyle = dark ? "#2f6b2a" : "#8fdc6a"; c.fillRect(0, 0, W, H);
    c.fillStyle = dark ? "#2a6226" : "#83d35d"; for (let y = s.y0; y < H; y += 44) c.fillRect(0, y, W, 22);
    if (s.ramp) { // uphill ramp, darker toward the top, with chevrons
      const r = s.ramp, gr = c.createLinearGradient(0, r.y, 0, r.y + r.h);
      gr.addColorStop(0, dark ? "#1f4d1c" : "#5fb43f"); gr.addColorStop(1, dark ? "#2f6b2a" : "#8fdc6a");
      c.fillStyle = gr; c.fillRect(r.x, r.y, r.w, r.h);
      c.strokeStyle = dark ? "rgba(255,255,255,0.22)" : "rgba(255,255,255,0.5)"; c.lineWidth = 3;
      for (let k = 0; k < 3; k++) { const yy = r.y + r.h * (0.3 + k * 0.25) - ((t * 20) % 14); c.beginPath(); c.moveTo(r.x + r.w / 2 - 22, yy + 10); c.lineTo(r.x + r.w / 2, yy); c.lineTo(r.x + r.w / 2 + 22, yy + 10); c.stroke(); }
      G.text(c, "UPHILL", r.x + 8, r.y + r.h - 12, 10, dark ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.8)", "left");
    }
    for (const r of s.sand) {
      c.fillStyle = dark ? "#a8925a" : "#ecd48e"; c.beginPath(); c.roundRect(r.x, r.y, r.w, r.h, 12); c.fill();
      c.fillStyle = dark ? "#8f7a48" : "#d6b96c"; for (let i = 0; i < 14; i++) c.fillRect(r.x + ((i * 37) % r.w), r.y + ((i * 23) % r.h), 3, 3);
    }
    for (const r of s.water) {
      c.fillStyle = dark ? "#1f5f94" : "#4fb3f0"; c.beginPath(); c.roundRect(r.x, r.y, r.w, r.h, 14); c.fill();
      c.strokeStyle = dark ? "#4c8ec4" : "#a9e0ff"; c.lineWidth = 2;
      for (let i = 0; i < 5; i++) { const wx = r.x + 16 + ((i * 61 + t * 14) % Math.max(20, r.w - 40)), wy = r.y + 14 + ((i * 29) % Math.max(10, r.h - 24)); c.beginPath(); c.arc(wx, wy, 7, Math.PI * 1.15, Math.PI * 1.85); c.stroke(); }
      if (r.w > 120 && !s.bridges.length && !s.seesaw) G.emoji(c, "🦆", r.x + r.w * 0.3 + Math.sin(t * 0.6) * 20, r.y + r.h * 0.55, 22);
    }
    for (const r of s.islands) {
      c.fillStyle = dark ? "#c2a865" : "#f3dc95"; c.beginPath(); c.roundRect(r.x - 4, r.y - 4, r.w + 8, r.h + 8, 22); c.fill();
      c.fillStyle = dark ? "#2f6b2a" : "#8fdc6a"; c.beginPath(); c.roundRect(r.x, r.y, r.w, r.h, 18); c.fill();
      c.fillStyle = dark ? "#2a6226" : "#83d35d"; c.fillRect(r.x + 10, r.y + r.h * 0.33, r.w - 20, r.h * 0.33);
      G.emoji(c, "🌴", r.x + 16, r.y + 18, 22);
    }
    for (const r of s.bridges) {
      c.fillStyle = dark ? "#7a5530" : "#b77b45"; c.fillRect(r.x, r.y - 4, r.w, r.h + 8);
      c.fillStyle = dark ? "#5e3b1a" : "#8b5a2b"; for (let y = r.y; y < r.y + r.h; y += 10) c.fillRect(r.x, y, r.w, 2);
      c.fillRect(r.x, r.y - 4, 3, r.h + 8); c.fillRect(r.x + r.w - 3, r.y - 4, 3, r.h + 8);
    }
    if (s.seesaw) { // plank over the pond, the low side drawn darker
      const r = s.seesaw, k = s.seesaw.ax / (s.seesaw.A || 1);
      const gr = c.createLinearGradient(r.x, 0, r.x + r.w, 0);
      const hi = dark ? "#a0703f" : "#d79a5c", lo = dark ? "#4e3016" : "#7a4b22", mid = dark ? "#7a5530" : "#b77b45";
      gr.addColorStop(0, k > 0.1 ? hi : k < -0.1 ? lo : mid); gr.addColorStop(0.5, mid); gr.addColorStop(1, k > 0.1 ? lo : k < -0.1 ? hi : mid);
      c.fillStyle = gr; c.fillRect(r.x, r.y, r.w, r.h);
      c.fillStyle = dark ? "#3a2412" : "#6e4723"; for (let y = r.y + 12; y < r.y + r.h; y += 18) c.fillRect(r.x, y, r.w, 2);
      c.strokeStyle = dark ? "#3a2412" : "#5e3b1a"; c.lineWidth = 2; c.strokeRect(r.x, r.y, r.w, r.h);
      c.fillStyle = "#555"; c.beginPath(); c.arc(r.x + r.w / 2, r.y + r.h / 2, 6, 0, 7); c.fill();
      if (Math.abs(k) > 0.25) { // arrow toward the low side
        const dx = Math.sign(k) * Math.min(r.w * 0.32, 10 + Math.abs(k) * 18), ay = r.y + r.h * 0.3;
        c.strokeStyle = "#fff"; c.lineWidth = 3; c.beginPath(); c.moveTo(r.x + r.w / 2 - dx * 0.4, ay); c.lineTo(r.x + r.w / 2 + dx, ay); c.lineTo(r.x + r.w / 2 + dx * 0.5, ay - 6); c.moveTo(r.x + r.w / 2 + dx, ay); c.lineTo(r.x + r.w / 2 + dx * 0.5, ay + 6); c.stroke();
      } else G.text(c, "LEVEL", r.x + r.w / 2, r.y + r.h * 0.3, 10, "#fff");
    }
    if (s.dh) { const d = s.dh; c.fillStyle = dark ? "#3b2416" : "#6b4428"; c.fillRect(d.x, d.y, d.w, d.h); c.fillStyle = dark ? "#4a2e1c" : "#7f5232"; for (let y = d.y + 10; y < d.y + d.h; y += 14) c.fillRect(d.x, y, d.w, 2); }
    c.restore();
    // loop ring sits behind the ball
    if (s.loop) {
      const L = loopRing(s);
      c.strokeStyle = dark ? "#2c4f7a" : "#4b7bc0"; c.lineWidth = 12; c.beginPath(); c.ellipse(L.x, L.y, L.rx, L.ry, 0, 0, 7); c.stroke();
      c.strokeStyle = dark ? "#7fa8de" : "#a9d0ff"; c.lineWidth = 4; c.beginPath(); c.ellipse(L.x, L.y, L.rx, L.ry, 0, 0, 7); c.stroke();
      c.fillStyle = dark ? "#2c4f7a" : "#4b7bc0"; c.fillRect(s.loop.x, s.loop.y, s.loop.w, s.loop.h);
      c.fillStyle = dark ? "#7fa8de" : "#a9d0ff"; for (let x = s.loop.x + 6; x < s.loop.x + s.loop.w - 4; x += 12) c.fillRect(x, s.loop.y + 4, 6, s.loop.h - 8);
    }
    // cup + flag
    c.fillStyle = "#1a1a1a"; c.beginPath(); c.arc(s.cup.x, s.cup.y, s.cr, 0, 7); c.fill();
    c.strokeStyle = dark ? "#ddd" : "#fff"; c.lineWidth = 2; c.stroke();
    if (!s.dh) { c.fillStyle = "#555"; c.fillRect(s.cup.x - 1, s.cup.y - 34, 2.5, 34); G.emoji(c, "🚩", s.cup.x + 8, s.cup.y - 34, 22); }
    // inner wood blocks
    for (const r of s.blocks) {
      c.fillStyle = dark ? "#6e4723" : "#a86c35"; c.fillRect(r.x, r.y, r.w, r.h);
      c.fillStyle = dark ? "#4d3118" : "#7a4b22"; for (let x = r.x + 26; x < r.x + r.w; x += 26) c.fillRect(x, r.y, 2, r.h);
      c.strokeStyle = dark ? "#3a2412" : "#5e3b1a"; c.lineWidth = 2; c.strokeRect(r.x, r.y, r.w, r.h);
    }
    // plank walls
    c.lineJoin = "round";
    c.strokeStyle = dark ? "#3a2412" : "#5e3b1a"; c.lineWidth = 10; c.stroke(s.path);
    c.strokeStyle = dark ? "#8a5c30" : "#c48a4f"; c.lineWidth = 6; c.stroke(s.path);
    c.setLineDash([2, 16]); c.strokeStyle = dark ? "#3a2412" : "#6e4723"; c.stroke(s.path); c.setLineDash([]);
    // doghouse walls with the door gap, roof on top
    if (s.dh) {
      const d = s.dh, wc = "#c0392b", wd = "#7a1d16";
      c.lineCap = "round";
      for (const [lw, col] of [[10, wd], [6, wc]]) {
        c.strokeStyle = col; c.lineWidth = lw; c.beginPath();
        c.moveTo(d.d0, d.y + d.h); c.lineTo(d.x, d.y + d.h); c.lineTo(d.x, d.y); c.lineTo(d.x + d.w, d.y); c.lineTo(d.x + d.w, d.y + d.h); c.lineTo(d.d1, d.y + d.h); c.stroke();
      }
      c.lineCap = "butt";
      c.fillStyle = "#8e2a1f"; c.beginPath(); c.moveTo(d.x - 8, d.y + 2); c.lineTo(d.x + d.w / 2, d.y - s.ch * 0.045); c.lineTo(d.x + d.w + 8, d.y + 2); c.closePath(); c.fill();
      c.strokeStyle = wd; c.lineWidth = 2; c.stroke();
      G.text(c, "BIG DAWG", d.x + d.w / 2, d.y + d.h + 14, 10, "#ffe9a8");
      G.emoji(c, "🥣", d.x + d.w - 16, d.y + 16, 16);
      c.fillStyle = "#555"; c.fillRect(s.cup.x - 1, s.cup.y - 22, 2.5, 22); G.emoji(c, "🚩", s.cup.x + 7, s.cup.y - 22, 18);
    }
    // bumpers
    for (const u of s.bump) {
      const k = u.hit > 0 ? 1.12 : 1;
      c.fillStyle = "#e0453a"; c.beginPath(); c.arc(u.x, u.y, u.r * k, 0, 7); c.fill();
      c.fillStyle = "#fff"; c.beginPath(); c.arc(u.x, u.y, u.r * k * 0.68, 0, 7); c.fill();
      c.fillStyle = "#e0453a"; c.beginPath(); c.arc(u.x, u.y, u.r * k * 0.4, 0, 7); c.fill();
      G.emoji(c, "🐾", u.x, u.y, u.r * 0.7);
    }
    // sleeping bulldog obstacle
    for (const d of s.dogs) {
      c.fillStyle = dark ? "#5a3b2a" : "#b0754a"; c.beginPath(); c.ellipse(d.x, d.y + d.r * 0.2, d.r * 1.15, d.r * 0.95, 0, 0, 7); c.fill();
      c.fillStyle = dark ? "#7a5440" : "#d9a06d"; c.beginPath(); c.ellipse(d.x, d.y + d.r * 0.2, d.r * 0.95, d.r * 0.75, 0, 0, 7); c.fill();
      G.img(c, ":dawgW:", d.x, d.y, d.r * 1.7, Math.sin(t * 1.3) * 0.04);
      const z = (t * 0.6) % 1; G.text(c, "Z", d.x + d.r * 0.7 + z * 12, d.y - d.r * 0.8 - z * 20, 10 + z * 6, "#fff");
    }
    for (const m of s.movers) { if (m.kind === "mower") drawMower(G, c, m, dark); else drawHouse(G, c, m); }
    // windmill bone
    if (s.bone) {
      const B = s.bone;
      c.save(); c.translate(B.x, B.y); c.rotate(B.a);
      c.fillStyle = dark ? "#e8e0cc" : "#fffaf0"; c.strokeStyle = "#8a7a5a"; c.lineWidth = 2;
      c.beginPath(); c.roundRect(-B.len, -5, B.len * 2, 10, 4); c.fill(); c.stroke();
      for (const e of [-1, 1]) for (const f of [-1, 1]) { c.beginPath(); c.arc(e * B.len, f * 5, 6, 0, 7); c.fill(); c.stroke(); }
      c.fillStyle = dark ? "#e8e0cc" : "#fffaf0"; c.fillRect(-B.len + 2, -4, B.len * 2 - 4, 8);
      c.restore();
      c.fillStyle = "#8b5a2b"; c.beginPath(); c.arc(B.x, B.y, 4, 0, 7); c.fill();
    }
    // sprinkler: two rotating jets of droplets
    if (s.spr) {
      const S = s.spr;
      c.fillStyle = dark ? "rgba(140,200,255,0.6)" : "rgba(235,248,255,0.85)";
      for (let j = 0; j < 2; j++) for (let k = 1; k <= 14; k++) {
        const f = ((k / 14) + t * 0.9) % 1, d = S.r + f * (S.R - S.r), a = S.a + j * Math.PI + Math.sin(k * 7.3) * 0.32;
        c.beginPath(); c.arc(S.x + Math.cos(a) * d, S.y + Math.sin(a) * d, 2.5 + (1 - f) * 2, 0, 7); c.fill();
      }
      c.fillStyle = "#6b6b6b"; c.beginPath(); c.arc(S.x, S.y, S.r, 0, 7); c.fill();
      c.fillStyle = "#3fa34d"; c.beginPath(); c.arc(S.x, S.y, S.r * 0.6, 0, 7); c.fill();
      c.strokeStyle = "#ddd"; c.lineWidth = 3; c.beginPath(); c.moveTo(S.x - Math.cos(S.a) * S.r, S.y - Math.sin(S.a) * S.r); c.lineTo(S.x + Math.cos(S.a) * S.r, S.y + Math.sin(S.a) * S.r); c.stroke();
    }
    // splash ripple
    if (s.phase === "splash" && s.splash) {
      const k = 1 - s.pt / 0.9; c.strokeStyle = "#fff"; c.lineWidth = 2;
      c.beginPath(); c.arc(s.splash.x, s.splash.y, 6 + k * 22, 0, 7); c.stroke();
      c.beginPath(); c.arc(s.splash.x, s.splash.y, 3 + k * 12, 0, 7); c.stroke();
    }
    // aim
    let aim = null;
    if (s.phase === "aim") {
      if (s.drag) { const dx = s.drag.x0 - s.drag.x, dy = s.drag.y0 - s.drag.y, L = Math.hypot(dx, dy); if (L >= 14) aim = [dx / L, dy / L, Math.min(1, L / s.maxDrag)]; }
      else if (s.kshow) aim = [Math.cos(s.kang), Math.sin(s.kang), s.kpow];
    }
    if (aim) {
      const [ux, uy, p] = aim, len = 30 + p * s.ch * 0.42;
      c.strokeStyle = "rgba(255,255,255,0.55)"; c.lineWidth = 3;
      c.beginPath(); c.moveTo(b.x, b.y); c.lineTo(b.x - ux * p * 50, b.y - uy * p * 50); c.stroke();
      const col = p < 0.45 ? "#7CFC6B" : p < 0.8 ? "#ffd23f" : "#ff5a4f";
      c.fillStyle = col;
      for (let d = 16; d < len; d += 11) { c.beginPath(); c.arc(b.x + ux * d, b.y + uy * d, Math.max(1.5, 3.2 - d / len * 1.8), 0, 7); c.fill(); }
      const mw = 74, mh = 10, mx = Math.min(W - mw - 50, Math.max(6, b.x - mw / 2)), my = b.y > s.y0 + 60 ? b.y - 36 : b.y + 22;
      c.fillStyle = "rgba(0,0,0,0.55)"; c.fillRect(mx - 2, my - 2, mw + 46, mh + 4);
      c.fillStyle = col; c.fillRect(mx, my, mw * p, mh);
      G.text(c, Math.round(p * 100) + "%", mx + mw + 4, my + mh / 2 + 1, 10, "#fff", "left");
    }
    // tennis ball (or riding the loop)
    if (s.phase === "loop" && s.loopA) {
      const L = loopRing(s), a = Math.PI / 2 - s.loopA.t / 0.6 * Math.PI * 2;
      drawBall(c, { x: L.x + Math.cos(a) * L.rx, y: L.y + Math.sin(a) * L.ry }, b.r);
    } else if (s.phase !== "splash" && s.phase !== "flash" && s.phase !== "done") drawBall(c, b, b.r * (b.sc || 1));
    // deck goes over the tunnels (ball shows through faintly while underneath)
    if (s.deck) {
      const d = s.deck;
      c.fillStyle = dark ? "#6e4723" : "#b77b45"; c.fillRect(d.x, d.y, d.w, d.h);
      c.fillStyle = dark ? "#4d3118" : "#8b5a2b"; for (let y = d.y + 14; y < d.y + d.h; y += 14) c.fillRect(d.x, y, d.w, 2);
      c.strokeStyle = dark ? "#3a2412" : "#5e3b1a"; c.lineWidth = 3; c.strokeRect(d.x, d.y, d.w, d.h);
      for (const [a0, a1] of d.tun) { // dark tunnel mouths on both edges + dashed guide
        c.fillStyle = "#1d130c";
        c.beginPath(); c.roundRect(a0, d.y - 2, a1 - a0, 12, [0, 0, 8, 8]); c.fill();
        c.beginPath(); c.roundRect(a0, d.y + d.h - 10, a1 - a0, 12, [8, 8, 0, 0]); c.fill();
        c.strokeStyle = dark ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.2)"; c.setLineDash([4, 6]); c.lineWidth = 2;
        c.beginPath(); c.moveTo(a0 + 3, d.y + 14); c.lineTo(a0 + 3, d.y + d.h - 14); c.moveTo(a1 - 3, d.y + 14); c.lineTo(a1 - 3, d.y + d.h - 14); c.stroke(); c.setLineDash([]);
      }
      G.emoji(c, "🪑", d.x + d.w * 0.4, d.y + d.h * 0.4, 22); G.emoji(c, "🪴", d.x + d.w * 0.92, d.y + d.h * 0.3, 22);
      G.emoji(c, "☂️", d.x + d.w * 0.62, d.y + d.h * 0.62, 24);
      if (inR(d, b.x, b.y) && (s.phase === "roll" || s.phase === "aim")) { c.globalAlpha = 0.55; drawBall(c, b, b.r); c.globalAlpha = 1; }
    }
    // pops
    for (const p of s.pops) G.text(c, p.txt, p.x, p.y - (0.9 - p.t) * 30, 10, p.c);
    // HUD
    const N = s.holes.length, hh = G.hud(c, `HOLE ${s.hi + 1}/${N}`, "", `SCORE ${s.total}`);
    c.fillStyle = "rgba(10,10,20,0.45)"; c.fillRect(0, hh, W, 20);
    G.text(c, `PAR ${s.hole.par}`, 10, hh + 10, 10, "#9be7ff", "left");
    const st = Math.min(s.strokes, MAXS);
    G.text(c, `STROKES ${st}`, W - 10, hh + 10, 10, st >= 5 ? "#ff8f8f" : "#fff", "right");
    // hole intro card
    if (s.intro > 0 && s.phase === "aim" && G.state === "play") {
      const a = Math.min(1, s.intro / 0.35), pw = Math.min(W - 40, 310), ph = 104, px = (W - pw) / 2, py = s.y0 + s.ch * 0.42 - ph / 2;
      c.globalAlpha = a;
      c.fillStyle = "rgba(12,16,24,0.82)"; c.beginPath(); c.roundRect(px, py, pw, ph, 16); c.fill();
      c.strokeStyle = s.hi >= 9 ? "#ff9f6b" : "#ffd23f"; c.lineWidth = 3; c.stroke();
      G.text(c, `HOLE ${s.hi + 1}`, W / 2, py + 22, 16, "#ffd23f");
      G.text(c, s.hole.name, W / 2, py + 48, 12, "#fff");
      G.text(c, `PAR ${s.hole.par}`, W / 2, py + 70, 10, "#9be7ff");
      G.text(c, s.hole.tip || "", W / 2, py + 88, 10, "#ccc");
      c.globalAlpha = 1;
    }
    if (s.hi === 0 && s.strokes === 0 && G.state === "play") G.hint(c, "PULL BACK & LET GO", 7, s.y0 + s.ch * 0.66);
    // between holes: result + quick scorecard
    if ((s.phase === "flash" || s.phase === "done") && s.flash) {
      const f = s.flash, rows = N > 9 ? 2 : 1, pw = Math.min(W - 24, 350), ph = 136 + rows * 40 + 24, px = (W - pw) / 2, py = Math.max(s.y0 + 4, H * 0.45 - ph / 2);
      c.fillStyle = "rgba(10,12,20,0.88)"; c.beginPath(); c.roundRect(px, py, pw, ph, 16); c.fill();
      c.strokeStyle = f.col; c.lineWidth = 3; c.stroke();
      G.img(c, f.face, W / 2, py + 34, 48, Math.sin(t * 6) * 0.08);
      G.banner(c, f.t, f.col, py + 78, Math.min(22, pw / 13));
      G.text(c, `HOLE ${s.hi + 1}: ${f.n} STROKE${f.n > 1 ? "S" : ""}  +${f.pts}`, W / 2, py + 106, 10, "#fff");
      scorecard(G, c, s, px + 12, py + 124, pw - 24);
      G.text(c, `TOTAL ${s.total}`, W / 2, py + ph - 16, 12, "#ffd23f");
    }
  }

  // ---------------- game definitions ----------------
  function makeGame(o) {
    const holes = o.holes;
    return {
      key: o.key, name: o.name, icon: "⛳", max: holes.length * 50, blurb: o.blurb,
      how: `${holes.length} holes. Drag back from the tennis ball like a slingshot, then let go to putt. The further you pull, the harder the shot. Ace = 50, 2 strokes = 40, 3 = 30, 4 = 20, 5 = 10, 6 = 5. Water costs a stroke. Max 6 strokes per hole.` + (o.extra || ""),
      // Checkpoint at the start of each hole after the first.
      save(G) { const s = G.s; if (!s.hi || s.strokes || s.phase !== "aim") return null; return { label: `Hole ${s.hi + 1}`, hi: s.hi, total: s.total, cards: s.cards.slice() }; },
      load(G, v) { const s = G.s; s.total = v.total; s.cards = v.cards.slice(); load(G, v.hi); },
      reset(G) {
        const top = 34 + 20 + 6, pad = 8;
        G.s = { holes, x0: pad, y0: top, cw: G.W - pad * 2, ch: G.H - top - pad, total: 0, cards: [], pops: [], ot: 0, clack: 0, snort: 0, wet: 0, flash: null, movers: [] };
        const s = G.s;
        s.br = Math.max(6, Math.min(8.5, s.cw * 0.02)); s.cr = s.br * 1.75;
        s.vmax = Math.max(560, s.ch * 1.6); s.sinkV = Math.max(200, s.ch * 0.48); s.stopV = 8;
        s.k = s.vmax / 860; // scales pushes/slopes to the screen size
        s.grav = s.ch * 0.85;
        s.maxDrag = Math.max(110, Math.min(G.W, G.H) * 0.36);
        load(G, 0);
      },
      update(G, dt) {
        const s = G.s;
        s.ot += dt; moveObstacles(s);
        if (s.intro > 0) s.intro -= dt;
        if (s.clack > 0) s.clack -= dt;
        if (s.snort > 0) s.snort -= dt;
        if (s.wet > 0) s.wet -= dt;
        for (const u of s.bump) if (u.hit > 0) u.hit -= dt;
        for (const p of s.pops) p.t -= dt;
        if (s.pops.length && s.pops[0].t <= 0) s.pops = s.pops.filter(p => p.t > 0);
        const b = s.ball;
        if (s.phase === "aim") {
          // a moving obstacle can nudge a resting ball
          if (movingHits(s, b, 0.5) && Math.hypot(b.vx, b.vy) > s.stopV) { s.phase = "roll"; s.rt = 0; s.drag = null; s.last.x = b.x; s.last.y = b.y; }
          else { b.vx = b.vy = 0; if (escaped(s, b)) { b.x = s.last.x; b.y = s.last.y; } }
        } else if (s.phase === "roll") {
          s.rt += dt; physics(G, dt);
        } else if (s.phase === "loop") {
          s.loopA.t += dt;
          if (s.loopA.t >= 0.6) { const L = s.loop; b.x = s.loopA.x; b.y = L.exitY; b.vx = (Math.random() - 0.5) * 50 * s.k; b.vy = -Math.max(160 * s.k, Math.min(560 * s.k, s.loopA.v)); s.loopA = null; s.phase = "roll"; s.rt = 0; }
        } else if (s.phase === "sink") {
          s.pt -= dt; const k = Math.max(0, s.pt / 0.45);
          b.x = s.cup.x + (s.sinkFrom.x - s.cup.x) * k; b.y = s.cup.y + (s.sinkFrom.y - s.cup.y) * k; b.sc = 0.4 + 0.6 * k;
          if (s.pt <= 0) { b.sc = 1; finishHole(G, s.strokes, false); }
        } else if (s.phase === "splash") {
          s.pt -= dt;
          if (s.pt <= 0) { b.x = s.last.x; b.y = s.last.y; b.vx = b.vy = 0; s.splash = null; if (s.strokes >= MAXS) finishHole(G, MAXS, true); else s.phase = "aim"; }
        } else if (s.phase === "flash") {
          s.pt -= dt; if (s.pt <= 0) nextHole(G);
        }
      },
      down(G, x, y) {
        const s = G.s;
        if (s.phase === "flash") { if (s.pt < FLASH - 0.5) s.pt = 0; return; }
        if (s.phase !== "aim") return;
        if (s.intro > 0.3) s.intro = 0.3;
        s.drag = { x0: x, y0: y, x, y }; s.kshow = false;
      },
      move(G, x, y) { const d = G.s.drag; if (d) { d.x = x; d.y = y; } },
      up(G, x, y) {
        const s = G.s, d = s.drag; if (!d) return; s.drag = null; d.x = x; d.y = y;
        const dx = d.x0 - d.x, dy = d.y0 - d.y, L = Math.hypot(dx, dy);
        if (L < 14) return;
        shoot(G, dx / L, dy / L, Math.min(1, L / s.maxDrag));
      },
      onKey(G, k, isDown) {
        const s = G.s; if (!isDown) return;
        if (s.phase === "flash" && k === " ") { if (s.pt < FLASH - 0.5) s.pt = 0; return; }
        if (s.phase !== "aim") return;
        if (k === "ArrowLeft" || k === "a") { s.kang -= 0.08; s.kshow = true; }
        else if (k === "ArrowRight" || k === "d") { s.kang += 0.08; s.kshow = true; }
        else if (k === "ArrowUp" || k === "w") { s.kpow = Math.min(1, s.kpow + 0.05); s.kshow = true; }
        else if (k === "ArrowDown" || k === "s") { s.kpow = Math.max(0.05, s.kpow - 0.05); s.kshow = true; }
        else if (k === " ") shoot(G, Math.cos(s.kang), Math.sin(s.kang), s.kpow);
      },
      draw,
    };
  }

  defGame(makeGame({ key: "putt", name: "Putt Pup", holes: FRONT, blurb: "9 holes of backyard mini golf." }));
  defGame(makeGame({ key: "putt18", name: "Putt Pup 18", holes: FRONT.concat(BACK), blurb: "The full 18. Back nine included.",
    extra: " The back nine adds a loop-de-loop, deck tunnels, a sprinkler, a seesaw, lawnmowers, an island green and the doghouse." }));
})();
