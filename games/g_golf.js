// ---------- Dawg Golf (16-bit side-view golf) ----------
// 9 holes (par 36) on a side-scrolling course. Classic three-tap swing meter:
// tap to start, tap to set power on the way up, tap on the sweet spot on the way back.
// Stroke play: the score is the total strokes, lower is better (low: true). Max 8 per hole (pick up), so 9..72.
(function () {
  const SW = 0.16;    // accuracy sweet spot position on the swing meter
  const SWW = 0.24;   // sweet-spot half width scale (|acc-SW|/SWW = error; <=0.25 perfect)
  const ZONE = 0.08;  // power "good zone" half width, in bar units
  const SPD = 0.75;   // meter speed (bar per second)
  const CLUBS = [
    { n: "DRIVER", max: 250, loft: 0.12, roll: 0.14, wk: 1.0, head: "#8a5a2b" },
    { n: "3 WOOD", max: 220, loft: 0.14, roll: 0.12, wk: 1.05, head: "#8a5a2b" },
    { n: "5 IRON", max: 185, loft: 0.18, roll: 0.09, wk: 1.15, head: "#c9ced6" },
    { n: "7 IRON", max: 150, loft: 0.22, roll: 0.07, wk: 1.25, head: "#c9ced6" },
    { n: "9 IRON", max: 125, loft: 0.28, roll: 0.05, wk: 1.35, head: "#d6dae0" },
    { n: "WEDGE", max: 100, loft: 0.36, roll: 0.03, wk: 1.5, head: "#e3e6ea" },
    { n: "CHIP", max: 70, loft: 0.3, roll: 0.05, wk: 1.2, head: "#e3e6ea" },
    { n: "PUTTER", max: 0, loft: 0, roll: 0, wk: 0, head: "#555" }
  ];
  const WEDGE = 5, CHIP = 6, PUT = 7;
  const LIE = { t: "TEE", f: "FAIRWAY", r: "ROUGH", s: "BUNKER", g: "GREEN", w: "WATER" };
  // seg: [from, to, lie] in yards from the tee. amp = elevation bumpiness. wmax rises through the round.
  // seg: [from, to, lie] in yards from the tee. amp = terrain bumpiness. wmax (max wind) rises through the round.
  // lift: [from, to, +height, ramp] raised plateaus (elevated tees/greens). oaks: [x, height] tall trees the ball can hit.
  const R0 = [-9999, -12, "r"], T0 = [-12, 8, "t"];
  const FRONT = [
    { nm: "PUPPY PARK", par: 4, pin: 340, end: 420, ph: 0.4, amp: 0.8, wmax: 3, trees: [-46, -28, 22, 150, 300, 398, 414], oaks: [], lift: [],
      seg: [R0, T0, [8, 26, "r"], [26, 198, "f"], [198, 212, "s"], [212, 306, "f"], [306, 318, "r"], [318, 360, "g"], [360, 368, "r"], [368, 380, "s"], [380, 99999, "r"]] },
    { nm: "POND PUP", par: 3, pin: 150, end: 220, ph: 2.1, amp: 0.7, wmax: 4, trees: [-46, -30, 196, 214], oaks: [], lift: [[-80, 12, 4, 12]],
      seg: [R0, T0, [8, 30, "r"], [30, 68, "f"], [68, 112, "w"], [112, 124, "f"], [124, 135, "s"], [135, 166, "g"], [166, 172, "r"], [172, 182, "s"], [182, 99999, "r"]] },
    { nm: "CREEK RUN", par: 5, pin: 505, end: 585, ph: 4.0, amp: 1.0, wmax: 5, trees: [-46, -28, 22, 160, 350, 545, 566], oaks: [[440, 13]], lift: [],
      seg: [R0, T0, [8, 30, "r"], [30, 228, "f"], [228, 242, "s"], [242, 302, "f"], [302, 312, "w"], [312, 378, "f"], [378, 410, "w"], [410, 468, "f"], [468, 480, "r"], [480, 528, "g"], [528, 99999, "r"]] },
    { nm: "HIGH DAWG", par: 4, pin: 372, end: 450, ph: 1.3, amp: 1.1, wmax: 6, trees: [-46, -28, 22, 200, 300, 424, 442], oaks: [], lift: [[352, 470, 8, 12]],
      seg: [R0, T0, [8, 26, "r"], [26, 218, "f"], [218, 246, "w"], [246, 334, "f"], [334, 346, "s"], [346, 354, "f"], [354, 392, "g"], [392, 402, "s"], [402, 99999, "r"]] },
    { nm: "TIMBER TRAIL", par: 4, pin: 342, end: 420, ph: 5.2, amp: 2.0, wmax: 7, trees: [-46, -30, 236, 384, 404], oaks: [[150, 14], [296, 15]], lift: [[-80, 12, 6, 14]],
      seg: [R0, T0, [8, 34, "r"], [34, 140, "f"], [140, 162, "r"], [162, 262, "f"], [262, 276, "s"], [276, 312, "f"], [312, 372, "g"], [372, 99999, "r"]] },
    { nm: "SPLASH ZONE", par: 3, pin: 176, end: 250, ph: 3.3, amp: 0.9, wmax: 8, trees: [-46, -30, 232, 246], oaks: [], lift: [[-80, 12, 5, 14]],
      seg: [R0, T0, [8, 36, "r"], [36, 148, "w"], [148, 158, "s"], [158, 192, "g"], [192, 198, "r"], [198, 228, "w"], [228, 99999, "r"]] },
    { nm: "TWIN CREEKS", par: 4, pin: 400, end: 480, ph: 0.9, amp: 1.5, wmax: 9, trees: [-46, -28, 22, 230, 444, 464], oaks: [[340, 13]], lift: [],
      seg: [R0, T0, [8, 30, "r"], [30, 98, "f"], [98, 112, "w"], [112, 286, "f"], [286, 300, "w"], [300, 362, "f"], [362, 374, "s"], [374, 382, "f"], [382, 418, "g"], [418, 428, "r"], [428, 440, "s"], [440, 99999, "r"]] },
    { nm: "THE BEAST", par: 5, pin: 528, end: 610, ph: 2.7, amp: 1.7, wmax: 10, trees: [-46, -28, 22, 262, 566, 590], oaks: [[180, 13], [410, 14]], lift: [],
      seg: [R0, T0, [8, 30, "r"], [30, 228, "f"], [228, 246, "s"], [246, 268, "f"], [268, 280, "s"], [280, 338, "f"], [338, 360, "w"], [360, 436, "f"], [436, 470, "w"], [470, 492, "f"], [492, 502, "s"], [502, 548, "g"], [548, 99999, "r"]] },
    { nm: "HOME STRETCH", par: 4, pin: 418, end: 520, ph: 4.6, amp: 1.2, wmax: 12, trees: [-46, -28, 22, 200, 340, 506], oaks: [], lift: [[394, 446, 7, 10]],
      seg: [R0, T0, [8, 30, "r"], [30, 145, "f"], [145, 192, "w"], [192, 328, "f"], [328, 344, "s"], [344, 388, "f"], [388, 398, "r"], [398, 436, "g"], [436, 446, "r"], [446, 458, "s"], [458, 500, "w"], [500, 99999, "r"]] }
  ];
  // Back nine: the front nine's terrain remixed (stretched or squeezed, new names, stiffer wind), played in reverse.
  const BACKNM = ["BARK BAY", "FETCH FIELD", "BIG BONE", "HYDRANT HILL", "MUTT MARSH", "SQUIRREL RIDGE", "COLLAR CREEK", "THE KENNEL", "DAWG HOUSE"];
  const BACKF = [1.05, 1.1, 1.05, 1.2, 1.2, 0.85, 1.05, 1.1, 1.15];
  const BACK = FRONT.map((h, i) => {
    const f = BACKF[i], sc = v => v >= 26 && v < 99999 ? Math.round(v * f) : v, pin = sc(h.pin);
    return Object.assign({}, h, { nm: BACKNM[8 - i], pin, end: sc(h.end), par: pin < 230 ? 3 : pin <= 440 ? 4 : 5, ph: h.ph + 1.7, wmax: h.wmax + 3,
      trees: h.trees.map(sc), oaks: h.oaks.map(([x, r]) => [sc(x), r]), lift: h.lift.map(([a, b, c2, d]) => [sc(a), sc(b), c2, d]), seg: h.seg.map(s => s.length === 3 ? [sc(s[0]), sc(s[1]), s[2]] : s) });
  }).reverse();
  let HOLES = FRONT, PAR = 36;
  const useCourse = list => { HOLES = list; PAR = list.reduce((a, h) => a + h.par, 0); };
  const rel = d => d === 0 ? "E" : d > 0 ? "+" + d : String(d);
  const TRAIL = 14;

  const clamp = (v, a, b) => v < a ? a : v > b ? b : v;
  const gauss = () => (Math.random() + Math.random() + Math.random() - 1.5) * 1.15; // ~N(0,1), bounded
  const sm = t => { t = clamp(t, 0, 1); return t * t * (3 - 2 * t); };
  function hBase(H, x) { return (H.amp || 1) * 3.5 * Math.sin(x * 0.019 + H.ph) + (H.amp || 1) * 1.6 * Math.sin(x * 0.051 + H.ph * 2); }
  function hgt(H, x) {
    let h = hBase(H, x);
    const ng = sm(1 - (Math.abs(x - H.pin) - 20) / 25); h = h * (1 - ng) + hBase(H, H.pin) * ng;
    const nt = sm(1 - (Math.abs(x) - 10) / 15); h = h * (1 - nt) + hBase(H, 0) * nt;
    const L = H.lift; for (let i = 0; i < L.length; i++) { const l = L[i]; h += l[2] * sm((x - l[0] + l[3]) / l[3]) * sm((l[1] + l[3] - x) / l[3]); }
    return h;
  }
  function segAt(H, x) { const sg = H.seg; for (let i = 0; i < sg.length; i++) if (x >= sg[i][0] && x < sg[i][1]) return sg[i]; return sg[sg.length - 1]; }
  function hd(H, x) { // displayed ground height (ponds and bunkers dip)
    const g = segAt(H, x), h = hgt(H, x);
    if (g[2] === "w") return h - 6 * Math.sin(Math.PI * (x - g[0]) / (g[1] - g[0]));
    if (g[2] === "s") return h - 2 * Math.sin(Math.PI * (x - g[0]) / (g[1] - g[0]));
    return h;
  }
  function lieMult(lie, club) { return lie === "r" ? 0.85 : lie === "s" ? (club >= WEDGE ? 0.9 : 0.65) : 1; }
  // the chip is a soft wedge whose max auto-scales to the distance, so short shots keep a usable meter
  function cmax(s, club) { return club === CHIP ? clamp(Math.ceil(s.dist / 0.72 / 5) * 5, 10, 95) : CLUBS[club].max; }
  function puttLie(s) { const l = s.ball.lie; return l === "s" ? 0.4 : (l === "r" || l === "w") ? 1 / 3 : 1; }
  // power fraction (0..1 of the club's max, may exceed 1 when out of reach) that finishes at the pin,
  // counting the lie, wind push along the line of play, and the roll after landing on the green
  function needPow(s, club) {
    if (club === PUT) return (s.dist + 0.3) / puttLie(s) / s.pmax;
    const cl = CLUBS[club], M = cmax(s, club) * lieMult(s.ball.lie, club);
    const a = s.wind * s.wdir * s.dir * 0.55 * cl.wk;
    const D = (s.dist - 0.25 * a) / (1 + cl.roll * 0.5 + a / 200);
    return Math.max(0.02, D) / M;
  }
  function target(s) { return clamp(needPow(s, s.club), 0.02, 1); }
  // bar position (0..1 of the drawn meter) of the target marker
  function tBar(s) { return s.club === PUT ? target(s) : SW + (1 - SW) * target(s); }
  // smallest club whose full swing still reaches (with a little headroom); chip when close
  function autoClub(s) {
    if (s.ball.lie === "g") return PUT;
    if (s.dist < 72) return CHIP;
    for (let c = WEDGE; c >= 0; c--) if (needPow(s, c) <= 0.88) return c;
    return 0;
  }
  // forgiving power: inside the zone you get exactly the intended power; outside it scales smoothly
  function zonePow(s, bar) {
    const tb = tBar(s), e = bar - tb, span = s.club === PUT ? 1 : 1 - SW;
    if (Math.abs(e) <= ZONE) return { p: target(s), inZ: true, e: e / ZONE };
    return { p: clamp(target(s) + (e - Math.sign(e) * ZONE) / span, 0.01, 1), inZ: false, e: e / ZONE };
  }
  function camTarget(G) {
    const s = G.s, view = G.W / s.zoom, fr = (s.phase === "fly" || s.phase === "roll") ? 0.5 : 0.28;
    return s.ball.x - view * (s.dir > 0 ? fr : 1 - fr);
  }
  // bottom panel layout: club button (48px) + big swing meter
  function panelH(G) { return clamp(Math.round(G.H * 0.26), 140, 164); }
  function panelY(G) { return G.H - panelH(G); }
  function say(s, txt, col) { s.msg = txt; s.msgC = col || "#ffd23f"; s.msgT = 1.7; }

  function startHole(G, i) {
    const s = G.s, H = HOLES[i];
    s.hole = i; s.H = H; s.strokes = 0; s.card = null; s.inHole = false;
    s.wind = Math.round(Math.random() * H.wmax); s.wdir = Math.random() < 0.5 ? -1 : 1;
    s.ball.x = 0; s.ball.y = hd(H, 0); s.side = false;
    setupShot(G, true);
    say(s, `${i + 1}: ${H.nm}`, "#fff"); s.msgT = 2.2;
  }
  function setupShot(G, snap) {
    const s = G.s, H = s.H, b = s.ball;
    b.lie = segAt(H, b.x)[2];
    if (s.side && (b.lie === "f" || b.lie === "g" || b.lie === "t")) b.lie = "r";
    s.side = false; b.y = hd(H, b.x);
    s.dist = Math.abs(H.pin - b.x); s.dir = H.pin >= b.x ? 1 : -1; s.dogX = b.x;
    s.pmax = Math.max(2, (s.dist + 0.3) / puttLie(s) / 0.6); // putt meter auto-scales: the hole sits at 60%
    s.club = autoClub(s);
    s.phase = "aim"; s.meter = s.club === PUT ? 0 : SW; s.mt = 0; s.power = -1; s.pbar = -1; s.inZ = false; s.acc = -1; s.face = ":dawgW:"; s.swing = 0;
    s.zoomT = (b.lie === "g" || s.dist < 25) ? G.W / 45 : s.dist < 70 ? G.W / 110 : G.W / 200;
    s.tn = 0; s.ff = false;
    if (b.lie === "g" && s.dist < 1) { s.strokes++; b.x = H.pin; say(s, "GIMME! TAP-IN", "#7dff8a"); s.inHole = true; s.face = ":dawgW:"; G.sfx("pop"); s.phase = "wait"; s.wt = 0.6; }
    if (snap) { s.zoom = s.zoomT; s.cam = camTarget(G); s.camH = b.y; }
  }
  function cycleClub(G) {
    const s = G.s; if (s.phase !== "aim") return;
    s.club = (s.club + 1) % CLUBS.length; s.meter = s.club === PUT ? 0 : SW; s.mt = 0; G.sfx("pop");
  }
  function clubLabel(s) {
    if (s.club === PUT) return `CLUB: PUTTER · ${Math.round(s.pmax * 3)} FT MAX`;
    return `CLUB: ${CLUBS[s.club].n} · ${Math.round(cmax(s, s.club) * lieMult(s.ball.lie, s.club))} YD MAX`;
  }
  function action(G) {
    const s = G.s;
    if (s.phase === "card") { if (s.card.age > 0.3) s.card.t = 0; return; }
    if (s.phase === "fly" || s.phase === "roll") { s.ff = true; return; } // tap to fast-forward the ball
    if (s.phase === "wait") { s.wt = Math.min(s.wt, 0.12); return; }
    if (s.phase === "aim") {
      if (s.club === PUT) { lockPower(G); strike(G); }
      else { s.phase = "up"; s.meter = SW; }
    } else if (s.phase === "up") { lockPower(G); s.phase = "down"; }
    else if (s.phase === "down") { s.acc = s.meter; strike(G); }
  }
  function lockPower(G) {
    const s = G.s, z = zonePow(s, s.meter);
    s.pbar = s.meter; s.power = z.p; s.inZ = z.inZ; s.pe = z.e;
    if (z.inZ) G.sfx("pop");
  }
  function strike(G) {
    const s = G.s, H = s.H, b = s.ball, cl = CLUBS[s.club];
    s.strokes++; s.dogX = b.x; s.tn = 0; s.trailN = 0;
    if (s.club === PUT) {
      // in the zone: short putts drop, long putts finish close (error grows gently with length)
      // in the zone the pace is right; long putts still wander a little (more the further you are from the zone's middle)
      const tb = tBar(s), k = Math.max(0, s.dist - 1), off = s.pbar - tb;
      let travel = s.dist + 0.3 + clamp(off / ZONE, -1, 1) * k * 0.15 + gauss() * k * 0.05;
      if (!s.inZ) travel += (off - Math.sign(off) * ZONE) * s.pmax * puttLie(s);
      const r = Math.max(0.2, travel) / puttLie(s) * (b.lie === "s" ? 0.4 : 1);
      s.roll = { r, putt: true }; s.phase = "roll"; G.sfx("pop"); return;
    }
    let e = clamp((s.acc - SW) / SWW, -1, 1);
    const miss = Math.max(0, Math.abs(e) - 0.25) / 0.75;
    // natural shot-to-shot scatter (a few %), a touch more toward the edges of the zone or on a mishit
    const want = cmax(s, s.club) * s.power * lieMult(b.lie, s.club), sig = Math.max(0.04, 1.6 / Math.max(1, want));
    const scat = 1 + gauss() * sig + clamp(s.pe || 0, -1, 1) * Math.max(0.04, 1 / Math.max(1, want)) * (s.inZ ? 1 : 0);
    const D = Math.max(2, cmax(s, s.club) * s.power * lieMult(b.lie, s.club) * (1 - 0.18 * miss) * scat);
    s.side = Math.abs(e) > 0.6;
    if (s.side) { say(s, e > 0 ? "SLICE!" : "HOOK!", "#ff8a65"); s.face = ":dawgcope:"; }
    else if (Math.abs(e) <= 0.25) { say(s, "PERFECT!", "#7dff8a"); s.face = ":dawgpog:"; }
    else s.face = ":dawgW:";
    const drift = s.wind * s.wdir * 0.55 * (D / 200 + 0.25) * cl.wk;
    s.fly = { x0: b.x, D, drift, h0: hd(H, b.x), apex: D * cl.loft, T: 0.6 + D / 260, t: 0, hit: false };
    const xl = clamp(b.x + s.dir * D + drift, -55, H.end + 60);
    s.fly.drift = xl - b.x - s.dir * D; s.fly.h1 = hd(H, xl);
    s.phase = "fly"; G.sfx("pop");
  }
  function splash(G, g, dirTravel) {
    const s = G.s, b = s.ball;
    s.strokes++; say(s, "SPLASH! +1", "#8fd0ff"); s.face = ":dawgpain:"; G.sfx("lose"); G.buzz();
    b.x = dirTravel > 0 ? g[0] - 3 : g[1] + 3; b.y = hd(s.H, b.x);
    s.phase = "wait"; s.wt = 1.1; s.side = false;
  }
  function holed(G) {
    const s = G.s; s.ball.x = s.H.pin; s.inHole = true; s.side = false;
    const st = s.strokes;
    say(s, st === 1 ? "HOLE IN ONE!!" : "IN THE HOLE!", "#ffd23f"); s.face = ":dawgpog:"; G.sfx("win");
    s.phase = "wait"; s.wt = 0.8;
  }
  function stopBall(G, sand) {
    const s = G.s;
    if (sand) { say(s, "BUNKER!", "#f2dc8c"); s.face = ":dawgsweat:"; }
    s.phase = "wait"; s.wt = 0.55;
  }
  function land(G) {
    const s = G.s, H = s.H, b = s.ball, f = s.fly, g = segAt(H, b.x);
    if (g[2] === "g" && Math.abs(b.x - H.pin) < 0.2) { holed(G); return; }
    if (g[2] === "w") { splash(G, g, s.dir); return; }
    if (g[2] === "s") { b.y = hd(H, b.x); stopBall(G, true); return; }
    const cl = CLUBS[s.club];
    if (f.dead) { s.roll = { r: 0, putt: false }; s.phase = "roll"; return; }
    const k = ((g[2] === "r" || s.side) ? 0.35 : g[2] === "g" ? 0.5 : 1) * (f.bank ? 0.2 : 1);
    s.roll = { r: f.D * cl.roll * k, putt: false }; s.phase = "roll";
  }
  function holeName(st, d) {
    return st === 1 ? "HOLE IN ONE!" : d <= -3 ? "ALBATROSS!" : d === -2 ? "EAGLE!" : d === -1 ? "BIRDIE!" : d === 0 ? "PAR" : d === 1 ? "BOGEY" : d === 2 ? "DOUBLE BOGEY" : d === 3 ? "TRIPLE BOGEY" : `+${d}`;
  }
  function endHole(G, pickup) {
    const s = G.s, st = Math.min(8, s.strokes), d = st - s.H.par;
    s.totStrokes += st; s.parThru += s.H.par; s.scores.push(st);
    s.card = { name: pickup ? "PICKED UP" : holeName(st, d), d, st, t: s.hole < HOLES.length - 1 ? 3.2 : 4, age: 0 }; s.phase = "card";
    if (d <= -1) G.sfx("win");
  }
  function overTitle(tot, d) {
    if (d <= -2) return `${-d} under! Tour card incoming.`;
    if (d === -1) return "1 under. Dawg's got game.";
    if (d === 0) return "Even par. Clutch.";
    if (d <= 3) return `Shot ${tot}. So close to par!`;
    if (d <= 9) return `Shot ${tot}. Bogey golf!`;
    if (d <= 18) return `Shot ${tot}. Weekend hacker.`;
    return `Shot ${tot}. Grip it and rip it.`;
  }
  function nextHole(G) {
    const s = G.s;
    if (s.hole >= HOLES.length - 1) {
      const tot = s.totStrokes, d = tot - PAR;
      s.phase = "done";
      G.over(tot, overTitle(tot, d));
      return;
    }
    startHole(G, s.hole + 1);
  }

  function ballStep(G, dt) {
    const s = G.s, H = s.H, b = s.ball;
    if (s.phase === "fly") {
      const f = s.fly; f.t += dt; const u = Math.min(1, f.t / f.T), px = b.x;
      b.x = f.x0 + s.dir * f.D * u + f.drift * u * u;
      b.y = f.h0 + (f.h1 - f.h0) * u + 4 * f.apex * u * (1 - u);
      s.trailX[s.trailI] = b.x; s.trailY[s.trailI] = b.y; s.trailI = (s.trailI + 1) % TRAIL; s.trailN = Math.min(TRAIL, s.trailN + 1);
      if (!f.hit && !f.dead) {
        const ok = H.oaks;
        for (let i = 0; i < ok.length; i++) {
          const ox = ok[i][0], gy = hd(H, ox);
          if (Math.min(px, b.x) - 2.5 < ox && Math.max(px, b.x) + 2.5 > ox && b.y - gy < ok[i][1] && b.y - gy > 0.5 && Math.abs(ox - f.x0) > 15) {
            f.hit = true; say(s, "TIMBER!", "#ff8a65"); s.face = ":dawgsus:"; G.sfx("lose"); G.buzz();
            const back = 4 + Math.random() * 5, lx = clamp(ox - s.dir * back, -55, H.end + 60);
            s.fly = { x0: b.x, D: (lx - b.x) * s.dir, drift: 0, h0: b.y, h1: hd(H, lx), apex: 0.6, T: 0.4, t: 0, hit: true, dead: true };
            return;
          }
        }
        // ran into a rising bank (elevated green / hillside) on the way down
        if (u > 0.5 && u < 1 && b.y < hd(H, b.x) - 0.3) { b.y = hd(H, b.x); f.bank = true; land(G); return; }
      }
      if (u >= 1) { b.y = f.h1; land(G); }
    } else {
        const R = s.roll, px = b.x;
        const g0 = segAt(H, px)[2];
        const m = (g0 === "r" || (s.side && g0 !== "s")) ? 3 : 1;
        const v = (R.putt ? 3 : 6) + R.r * 2.6;
        const step = Math.min(v * dt, R.r / m);
        b.x = clamp(px + s.dir * step, -55, H.end + 60); R.r -= step * m;
        const g = segAt(H, b.x);
        b.y = hd(H, b.x);
        if (g[2] === "w") { splash(G, g, s.dir); return; }
        if ((px - H.pin) * (b.x - H.pin) <= 0 && px !== b.x && R.r < (R.putt ? 0.55 : 0.12)) { holed(G); return; }
        if (g[2] === "s") { stopBall(G, true); return; }
        if (R.r <= 0.001 || b.x <= -55 || b.x >= H.end + 60) {
          if (Math.abs(b.x - H.pin) < 0.25) { holed(G); return; }
          if (R.putt && Math.abs(b.x - H.pin) < 1.5) { say(s, "SO CLOSE!", "#ff8a65"); s.face = ":dawgsweat:"; }
          stopBall(G, false);
        }
    }
  }
  const golfDef = {
    key: "golf", name: "Dawg Golf", icon: "🏌️", max: 72, low: true, cat: "sports", course: FRONT,
    blurb: "Front nine, par 36. Three-tap swing. Mind the wind.",
    how: "Tap to start the swing, tap again while the marker is in the GREEN ZONE around the PIN flag (it already counts wind, lie and roll) to hit it the right distance, then tap the blue spot on the way back to hit it straight. On the green, one tap in the green zone putts. The club is picked for you; tap the yellow CLUB bar to switch. Water costs a stroke, trees knock the ball down, pick up at 8. Par 36: fewest strokes wins.",
    fmt(n) { return n > 0 ? `${n} (${rel(n - 36)})` : "—"; },
    // Checkpoint after each finished hole; resuming starts the next hole.
    save(G) { const s = G.s; if (s.phase !== "card" || s.hole >= HOLES.length - 1) return null;
      return { label: `Hole ${s.hole + 2}`, hole: s.hole, tot: s.totStrokes, par: s.parThru, scores: s.scores.slice() }; },
    load(G, v) { const s = G.s; s.totStrokes = v.tot; s.parThru = v.par; s.scores = v.scores.slice(); startHole(G, v.hole + 1); },
    reset(G) {
      useCourse(this.course);
      G.s = { hole: 0, parThru: 0, totStrokes: 0, scores: [], ball: { x: 0, y: 0, lie: "t" }, msg: "", msgT: 0, msgC: "#fff",
        trailX: new Float32Array(TRAIL), trailY: new Float32Array(TRAIL), trailN: 0, trailI: 0, tn: 0, zoom: 1, cam: 0, camH: 0 };
      startHole(G, 0);
    },
    update(G, dt) {
      const s = G.s, H = s.H, b = s.ball;
      s.tn += dt;
      if (s.msgT > 0) s.msgT -= dt;
      if (s.phase === "aim" || s.phase === "up") s.tbar = tBar(s); // where the PIN marker sits on the meter
      if (s.phase === "aim" && s.club === PUT) { s.mt += dt * SPD; const p = s.mt % 2; s.meter = p < 1 ? p : 2 - p; }
      else if (s.phase === "up") { s.meter += dt * SPD; if (s.meter >= 1) { s.meter = 1; lockPower(G); s.phase = "down"; } }
      else if (s.phase === "down") { s.meter -= dt * SPD; if (s.meter <= 0) { s.meter = 0; s.acc = 0; strike(G); } }
      else if (s.phase === "fly" || s.phase === "roll") { const n = s.ff ? 3 : 1; for (let i = 0; i < n && (s.phase === "fly" || s.phase === "roll"); i++) ballStep(G, dt); }
      else if (s.phase === "wait") {
        s.wt -= dt;
        if (s.wt <= 0) {
          if (s.inHole) endHole(G, false);
          else if (s.strokes >= 8) endHole(G, true);
          else setupShot(G, false);
        }
      } else if (s.phase === "card") {
        s.card.age += dt; s.card.t -= dt; if (s.card.t <= 0) nextHole(G);
      }
      // camera
      if (s.phase !== "card" && s.phase !== "done") {
        const k = 1 - Math.exp(-dt * (s.ff ? 7 : 3.5));
        s.zoom += (s.zoomT - s.zoom) * k;
        s.cam += (camTarget(G) - s.cam) * k;
        s.camH += (b.y - s.camH) * (1 - Math.exp(-dt * 2));
      }
    },
    tap(G, x, y) {
      const s = G.s;
      const py = panelY(G);
      if (s.phase === "aim" && y > py + 2 && y < py + 58) { cycleClub(G); return; }
      action(G);
    },
    onKey(G, k, isDown) {
      if (!isDown) return;
      if (k === " " || k === "ArrowDown" || k === "Enter") action(G);
      else if (k === "c" || k === "ArrowUp") cycleClub(G);
    },
    draw(G, c) {
      const s = G.s, W = G.W, Hh = G.H, H = s.H, dark = G.dark(), b = s.ball;
      const sc = s.zoom, cam = s.cam, baseY = Math.min(Hh * 0.66, Hh - panelH(G) - 34);
      const SX = x => (x - cam) * sc, SY = h => baseY - (h - s.camH) * sc;
      // sky
      const gr = c.createLinearGradient(0, 0, 0, baseY);
      gr.addColorStop(0, dark ? "#0d1b3d" : "#4fbef7"); gr.addColorStop(1, dark ? "#33497f" : "#c8eeff");
      c.fillStyle = gr; c.fillRect(0, 0, W, Hh);
      if (dark) { c.fillStyle = "#f4f1d0"; c.beginPath(); c.arc(W - 60, 128, 16, 0, 7); c.fill(); c.fillStyle = "#33497f"; c.beginPath(); c.arc(W - 52, 123, 14, 0, 7); c.fill(); }
      else { c.fillStyle = "#fff3a0"; c.fillRect(W - 76, 112, 32, 32); c.fillStyle = "#ffe066"; c.fillRect(W - 72, 116, 24, 24); }
      // clouds (parallax)
      c.fillStyle = dark ? "rgba(200,210,255,0.18)" : "rgba(255,255,255,0.9)";
      for (let i = 0; i < 5; i++) {
        const span = W + 140, cx = ((i * 157 - cam * sc * 0.15 - G.t * 6) % span + span) % span - 70, cy = 70 + (i * 37) % 70;
        c.fillRect(cx, cy, 60, 12); c.fillRect(cx + 12, cy - 8, 32, 8); c.fillRect(cx - 6, cy + 4, 72, 8);
      }
      // far hills (parallax)
      c.fillStyle = dark ? "#1d3550" : "#8fd19a";
      for (let sx = 0; sx < W; sx += 6) { const wx = sx + cam * sc * 0.3; const hy = baseY - 50 - 22 * Math.sin(wx * 0.011) - 10 * Math.sin(wx * 0.031); c.fillRect(sx, hy, 6, Hh - hy); }
      c.fillStyle = dark ? "#1a3a30" : "#67b874";
      for (let sx = 0; sx < W; sx += 6) { const wx = sx + cam * sc * 0.5; const hy = baseY - 22 - 14 * Math.sin(wx * 0.017 + 1) - 6 * Math.sin(wx * 0.05); c.fillRect(sx, hy, 6, Hh - hy); }
      // trees
      const tsz = clamp(sc * 14, 30, 56);
      for (let i = 0; i < H.trees.length; i++) { const tx = SX(H.trees[i]); if (tx > -40 && tx < W + 40) G.emoji(c, i % 2 ? "🌲" : "🌳", tx, SY(hd(H, H.trees[i])) - tsz * 0.42, tsz); }
      // ground columns
      const soil = dark ? "#4a3018" : "#8a5a2b", soil2 = dark ? "#3a2412" : "#734a22";
      for (let sx = 0; sx < W + 3; sx += 3) {
        const wx = cam + (sx + 1.5) / sc, g = segAt(H, wx), t = g[2], y = SY(hd(H, wx));
        if (t === "w") {
          const surf = SY(Math.min(hgt(H, g[0]), hgt(H, g[1])) - 0.8);
          c.fillStyle = soil; c.fillRect(sx, y, 3, Hh - y);
          if (surf < y) { c.fillStyle = dark ? "#1d4f99" : "#3a8ee8"; c.fillRect(sx, surf, 3, y - surf); c.fillStyle = dark ? "#4a7fd0" : "#9ad6ff"; if ((Math.floor(sx / 3) + Math.floor(G.t * 3)) % 4 === 0) c.fillRect(sx, surf, 3, 2); }
          continue;
        }
        let col;
        if (t === "f" || t === "t") col = Math.floor(wx / 8) % 2 ? (dark ? "#2f7a2a" : "#5fcf4a") : (dark ? "#29702a" : "#52bd3f");
        else if (t === "g") col = Math.floor(wx / 4) % 2 ? (dark ? "#3e9a36" : "#7ee36a") : (dark ? "#3a9032" : "#74d860");
        else if (t === "s") col = dark ? "#b8a660" : "#f2dc8c";
        else col = dark ? "#245a20" : "#3f9a35";
        c.fillStyle = col; c.fillRect(sx, y, 3, 9);
        c.fillStyle = soil; c.fillRect(sx, y + 9, 3, Hh - y - 9);
        c.fillStyle = soil2; if (Math.floor(wx * 1.7) % 5 === 0) c.fillRect(sx, y + 18 + (Math.floor(wx) % 3) * 8, 3, 3);
        if (t === "r" && Math.floor(wx * 1.3) % 3 === 0) { c.fillStyle = dark ? "#2e6d28" : "#2f7f27"; c.fillRect(sx, y - 3, 3, 3); }
      }
      // tall trees (obstacles, drawn to world scale)
      for (let i = 0; i < H.oaks.length; i++) {
        const ox = H.oaks[i][0], oh = H.oaks[i][1], X = SX(ox), R = Math.max(12, 3.6 * sc);
        if (X < -R - 10 || X > W + R + 10) continue;
        const Y = SY(hd(H, ox)), top = SY(hd(H, ox) + oh), tw = Math.max(4, 1.1 * sc);
        c.fillStyle = dark ? "#4a2e14" : "#6b4220"; c.fillRect(X - tw / 2, top + R, tw, Y - top - R);
        const rows = [[0, 0.7], [0.45, 1], [0.95, 1], [1.4, 0.75]];
        for (let r = 0; r < rows.length; r++) {
          const hw = R * rows[r][1], yy = top + r * R * 0.5;
          c.fillStyle = dark ? "#1f5a22" : "#2f8f34"; c.fillRect(X - hw, yy, hw * 2, R * 0.55);
          c.fillStyle = dark ? "#2b7230" : "#43ad47"; c.fillRect(X - hw, yy, hw * 0.9, R * 0.25);
        }
      }
      // tee markers
      for (const tx of [-9, 6]) { const X = SX(tx), Y = SY(hd(H, tx)); if (X > -10 && X < W + 10) { c.fillStyle = tx < 0 ? "#e84040" : "#3f6fe8"; c.fillRect(X - 3, Y - 6, 6, 6); } }
      // pin and flag
      const PX = SX(H.pin), PY = SY(hd(H, H.pin));
      c.fillStyle = "#111"; c.fillRect(PX - 5, PY - 1, 10, 3);
      c.fillStyle = "#fff"; c.fillRect(PX - 1, PY - 46, 3, 46);
      const fl = (s.wdir || 1) * (12 + s.wind * 0.9), wv = Math.sin(G.t * 6) * 2;
      c.fillStyle = "#ff3b3b"; c.beginPath(); c.moveTo(PX + 1, PY - 46); c.lineTo(PX + 1 + fl, PY - 40 + wv); c.lineTo(PX + 1, PY - 33); c.fill();
      // dog golfer
      const dX = SX(s.dogX), dY = SY(hd(H, s.dogX)), dir = s.dir;
      if (dX > -40 && dX < W + 40) {
        let k = 0;
        if (s.phase === "aim" && s.club === PUT) k = s.meter * 0.35;
        else if (s.phase === "up" || s.phase === "down") k = clamp((s.meter - SW) / (1 - SW), 0, 1);
        else if (s.phase === "fly" || ((s.phase === "roll" || s.phase === "wait") && !s.inHole && s.tn < 1.2)) k = -0.8;
        const base = dir > 0 ? Math.PI / 2 - 0.5 : Math.PI / 2 + 0.5, ang = base + dir * k * 2.6;
        const shx = dX - dir * 12, shy = dY - 22, len = s.club === PUT ? 20 : 25;
        const hx = shx + Math.cos(ang) * len, hy = shy + Math.sin(ang) * len;
        c.strokeStyle = "#ddd"; c.lineWidth = 2; c.beginPath(); c.moveTo(shx, shy); c.lineTo(hx, hy); c.stroke();
        c.fillStyle = CLUBS[s.club].head; c.fillRect(hx - 4, hy - 2, 8, 5);
        G.img(c, s.face || ":dawgW:", dX - dir * 18, dY - 21, 40);
      }
      // ball trail + ball
      if (s.phase === "fly" || (s.phase === "roll" && s.tn < 2)) {
        c.fillStyle = dark ? "rgba(255,255,255,0.35)" : "rgba(255,255,255,0.7)";
        for (let i = 0; i < s.trailN; i++) { const j = (s.trailI - 1 - i + TRAIL * 2) % TRAIL; if (i % 2) continue; c.fillRect(SX(s.trailX[j]) - 1, SY(s.trailY[j]) - 1, 3, 3); }
      }
      if (!s.inHole) {
        const bx = SX(b.x), by = SY(b.y), gy = SY(hd(H, b.x));
        if (s.phase === "fly") { c.fillStyle = "rgba(0,0,0,0.3)"; c.fillRect(bx - 4, gy - 1, 8, 3); }
        c.fillStyle = "#222"; c.fillRect(bx - 4, by - 8, 8, 8);
        c.fillStyle = "#fff"; c.fillRect(bx - 3, by - 7, 6, 6);
        // off-screen ball marker (high shots)
        if (by - 8 < 92) { c.fillStyle = "#fff"; c.beginPath(); c.moveTo(bx, 93); c.lineTo(bx - 6, 102); c.lineTo(bx + 6, 102); c.fill(); }
      }
      // pin pointer when off screen
      if (PX > W - 6 || PX < 6) {
        const ex = PX > W ? W - 24 : 24, ey = Math.min(baseY - 30, Hh - panelH(G) - 40);
        G.emoji(c, "⛳", ex, ey, 22);
        G.text(c, `${Math.round(s.dist || 0)}`, ex, ey + 20, 10, "#fff", "center");
      }
      // HUD
      const rd0 = s.totStrokes - s.parThru;
      G.hud(c, `HOLE ${s.hole + 1}/${HOLES.length}`, `PAR ${H.par}`, s.scores.length ? `TOT ${rel(rd0)}` : "TOT E");
      // hole map strip (whole hole, with elevation): tee .. green
      { const x0 = -20, x1 = H.end, mw = W - 20, mxp = x => 10 + (x - x0) / (x1 - x0) * mw, my = 62;
        c.fillStyle = "rgba(0,0,0,0.3)"; c.fillRect(6, 37, W - 12, 28);
        for (let px = 0; px < mw; px += 3) {
          const wx = x0 + (px + 1.5) / mw * (x1 - x0), t = segAt(H, wx)[2], hy = Math.round(hd(H, wx) * 0.45);
          c.fillStyle = t === "w" ? "#3a8ee8" : t === "s" ? "#f2dc8c" : t === "g" ? "#7ee36a" : t === "f" || t === "t" ? "#52bd3f" : "#2f7f27";
          c.fillRect(10 + px, my - 6 - hy, 3, 6 + hy);
        }
        c.fillStyle = "#1c4d1f"; for (let i = 0; i < H.oaks.length; i++) { const X = mxp(H.oaks[i][0]); c.fillRect(X - 2, my - 13 - hd(H, H.oaks[i][0]) * 0.45, 4, 6); }
        const fx = mxp(H.pin), fy = my - 6 - hd(H, H.pin) * 0.45; c.fillStyle = "#fff"; c.fillRect(fx, fy - 11, 1, 11); c.fillStyle = "#ff3b3b"; c.fillRect(fx + 1, fy - 11, 5, 4);
        if (!s.inHole) { const bx = mxp(clamp(b.x, x0, x1)), by = my - 6 - b.y * 0.45; c.fillStyle = "#000"; c.fillRect(bx - 3, by - 4, 7, 7); c.fillStyle = "#fff"; c.fillRect(bx - 2, by - 3, 5, 5); }
      }
      // info row: distance · shot number · wind
      c.fillStyle = "rgba(0,0,0,0.55)"; c.fillRect(0, 67, W, 22);
      const onG = s.club === PUT || (b.lie === "g" && s.dist < 25);
      G.text(c, onG ? `${Math.round(s.dist * 3)} FT` : `${Math.round(s.dist)} YD`, 10, 78, 10, "#7dff8a", "left");
      G.text(c, `SHOT ${Math.min(8, s.strokes + 1)}`, W / 2, 78, 10, "#fff", "center");
      if (s.wind === 0) G.text(c, "CALM", W - 10, 78, 10, "#bfe9ff", "right");
      else {
        G.text(c, `${s.wind}MPH`, W - 10, 78, 10, "#bfe9ff", "right");
        const ax = W - 72 - (s.wind > 9 ? 10 : 0), ay = 78;
        c.fillStyle = "#bfe9ff"; c.fillRect(ax - 9, ay - 2, 16, 4);
        c.beginPath(); if (s.wdir > 0) { c.moveTo(ax + 12, ay); c.lineTo(ax + 4, ay - 6); c.lineTo(ax + 4, ay + 6); } else { c.moveTo(ax - 14, ay); c.lineTo(ax - 6, ay - 6); c.lineTo(ax - 6, ay + 6); } c.fill();
      }
      // message
      if (s.msgT > 0 && s.phase !== "card") G.banner(c, s.msg, s.msgC, 116, s.msg.length > 12 ? 16 : 20);
      // bottom panel
      const PH = panelH(G), py = Hh - PH;
      c.fillStyle = dark ? "rgba(0,0,0,0.6)" : "rgba(0,0,0,0.45)"; c.fillRect(0, py, W, PH);
      const canClub = s.phase === "aim";
      c.fillStyle = canClub ? "#ffd23f" : "#8a7a3a"; c.fillRect(10, py + 6, W - 20, 48);
      c.fillStyle = canClub ? "#b8901a" : "#5a4f26"; c.fillRect(10, py + 50, W - 20, 4);
      const cl = clubLabel(s), csz = cl.length > 26 ? 10 : 11;
      G.text(c, cl, W / 2, py + 21, csz, "#2a1a00", "center");
      G.text(c, `${LIE[b.lie] || ""} LIE${canClub ? " · TAP TO SWITCH" : ""}`, W / 2, py + 39, 10, "#5a3d00", "center");
      // meter
      const mx = 14, mw = W - 28, my = py + 64, mh = Math.min(48, PH - 100), M = v => mx + clamp(v, 0, 1) * mw;
      const swinging = s.phase === "aim" || s.phase === "up" || s.phase === "down";
      c.fillStyle = "#111"; c.fillRect(mx - 3, my - 3, mw + 6, mh + 6);
      c.fillStyle = "#3a3a4a"; c.fillRect(mx, my, mw, mh);
      const tb = tBar(s), z0 = M(tb - ZONE), z1 = M(tb + ZONE);
      // green good zone (power)
      c.fillStyle = "#2f9e3a"; c.fillRect(z0, my, z1 - z0, mh);
      c.fillStyle = "#4fd35a"; c.fillRect(z0, my, z1 - z0, 5);
      if (s.club === PUT) {
        c.fillStyle = "rgba(255,210,63,0.75)"; c.fillRect(mx, my + mh * 0.3, s.meter * mw, mh * 0.4);
      } else {
        // blue accuracy sweet spot near the left end
        c.fillStyle = "#2a6fb8"; c.fillRect(M(SW - SWW * 0.5), my, SWW * mw, mh);
        c.fillStyle = "#5ec8ff"; c.fillRect(M(SW - SWW * 0.25), my, SWW * 0.5 * mw, mh);
        const fillTo = s.phase === "down" ? s.pbar : s.phase === "up" ? s.meter : 0;
        c.fillStyle = "rgba(255,210,63,0.75)"; c.fillRect(M(SW), my + mh * 0.3, Math.max(0, fillTo - SW) * mw, mh * 0.4);
      }
      // TARGET marker: where this club reaches the pin (wind + lie + roll included)
      const TX = M(tb);
      c.fillStyle = "#fff"; c.fillRect(TX - 1.5, my - 4, 3, mh + 8);
      c.fillStyle = "#ff3b3b"; c.beginPath(); c.moveTo(TX + 1, my - 18); c.lineTo(TX + 13, my - 13); c.lineTo(TX + 1, my - 8); c.fill();
      c.fillStyle = "#fff"; c.fillRect(TX, my - 20, 2, 16);
      const lblR = TX + 60 < W;
      G.text(c, "PIN", lblR ? TX + 16 : TX - 4, my - 13, 10, "#fff", lblR ? "left" : "right");
      // locked power mark
      if (s.phase === "down" && s.club !== PUT) { c.fillStyle = s.inZ ? "#7dff8a" : "#ff8a3b"; c.fillRect(M(s.pbar) - 3, my - 3, 6, mh + 6); }
      if (swinging) { c.fillStyle = "#111"; c.fillRect(M(s.meter) - 4, my - 7, 9, mh + 14); c.fillStyle = "#fff"; c.fillRect(M(s.meter) - 2, my - 5, 5, mh + 10); }
      const hint = s.phase === "aim" ? (s.club === PUT ? "TAP IN THE GREEN ZONE" : "TAP TO START SWING") : s.phase === "up" ? "TAP IN THE GREEN ZONE" : s.phase === "down" ? (s.inZ ? "NICE! NOW TAP THE BLUE" : "TAP ON THE BLUE SPOT") : "";
      if (hint) G.text(c, hint, W / 2, my + mh + 18, 10, Math.floor(G.t * 2.5) % 2 && s.phase === "aim" ? "#ffd23f" : "#fff", "center");
      if (s.hole === 0 && s.strokes === 0) G.hint(c, "3 TAPS: GO · POWER · AIM", 7, 152);
      // hole card + scorecard
      if (s.phase === "card" && s.card) {
        const cw = Math.min(W - 16, 350), cx = (W - cw) / 2, ch = 244, cy = Math.max(84, Hh * 0.2);
        c.fillStyle = "#ffd23f"; c.fillRect(cx - 4, cy - 4, cw + 8, ch + 8);
        c.fillStyle = dark ? "#111a33" : "#1d2a55"; c.fillRect(cx, cy, cw, ch);
        const cd = s.card.d, col = cd < 0 ? "#7dff8a" : cd === 0 ? "#fff" : "#ff8a65";
        G.img(c, cd <= 0 ? ":dawgpog:" : ":dawgcope:", cx + 24, cy + 26, 30);
        G.text(c, s.card.name, W / 2 + 14, cy + 26, s.card.name.length > 10 ? 12 : 15, "#ffd23f", "center");
        G.text(c, `${s.card.st} STROKES · PAR ${H.par}`, W / 2, cy + 54, 10, col, "center");
        // grid: HOLE / PAR / DAWG rows, 9 columns
        const lw = 48, colW = (cw - lw - 12) / 9, gx = cx + 6, gy = cy + 74, rh = 24;
        c.fillStyle = "rgba(255,255,255,0.08)"; c.fillRect(gx, gy, cw - 12, rh * 3);
        G.text(c, "HOLE", gx + 4, gy + rh * 0.5, 10, "#9fb0d8", "left");
        G.text(c, "PAR", gx + 4, gy + rh * 1.5, 10, "#9fb0d8", "left");
        G.text(c, "DAWG", gx + 4, gy + rh * 2.5, 10, "#ffd23f", "left");
        const nine = HOLES.length > 9 && s.hole >= 9 ? 9 : 0;
        for (let i = nine; i < Math.min(HOLES.length, nine + 9); i++) {
          const X = gx + lw + colW * (i - nine + 0.5);
          if (i === s.hole) { c.fillStyle = "rgba(255,210,63,0.18)"; c.fillRect(X - colW / 2, gy, colW, rh * 3); }
          G.text(c, String(i + 1), X, gy + rh * 0.5, 10, "#9fb0d8", "center");
          G.text(c, String(HOLES[i].par), X, gy + rh * 1.5, 10, "#fff", "center");
          if (i < s.scores.length) {
            const st = s.scores[i], dd = st - HOLES[i].par, Y = gy + rh * 2.5;
            const cc = dd < 0 ? "#7dff8a" : dd === 0 ? "#fff" : dd === 1 ? "#ffb08a" : "#ff6a5a";
            c.strokeStyle = cc; c.lineWidth = 1.5;
            if (dd < 0) { c.beginPath(); c.arc(X, Y, 8.5, 0, 7); c.stroke(); if (dd < -1) { c.beginPath(); c.arc(X, Y, 11, 0, 7); c.stroke(); } }
            else if (dd > 0) { c.strokeRect(X - 8, Y - 8, 16, 16); if (dd > 1) c.strokeRect(X - 10.5, Y - 10.5, 21, 21); }
            G.text(c, String(st), X + 0.5, Y + 1, 10, cc, "center");
          }
        }
        const rd = s.totStrokes - s.parThru, rc = rd < 0 ? "#7dff8a" : rd === 0 ? "#fff" : "#ff8a65";
        G.text(c, `TOTAL ${s.totStrokes}  (${rel(rd)})`, W / 2, cy + 168, 12, rc, "center");
        G.text(c, s.scores.length < HOLES.length ? `THRU ${s.scores.length} · NEXT: PAR ${HOLES[s.hole + 1].par}` : "ROUND COMPLETE", W / 2, cy + 192, 10, "#bbb", "center");
        if (s.card.age > 0.3) G.text(c, s.hole < HOLES.length - 1 ? "TAP FOR NEXT HOLE" : "TAP TO FINISH", W / 2, cy + 222, 10, Math.floor(G.t * 2.5) % 2 ? "#ffd23f" : "#fff", "center");
      }
    }
  };
  defGame(golfDef);
  const BPAR = 36 + BACK.reduce((a, h) => a + h.par, 0);
  defGame(Object.assign({}, golfDef, { key: "golf18", name: "Dawg Golf 18", icon: "🏌️", max: 144, course: FRONT.concat(BACK),
    blurb: `The full 18, par ${BPAR}. Back nine plays longer and windier.`,
    how: golfDef.how.replace("Par 36", `Par ${BPAR} over 18 holes`),
    fmt(n) { return n > 0 ? `${n} (${rel(n - BPAR)})` : "—"; } }));

})();
