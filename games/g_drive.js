// ---------- Road Dawg (top-down road racer) ----------
// The pup drives a red convertible up a scrolling highway. Drag/hold anywhere: the car steers toward your finger's x.
// Quick tap = turbo boost (3 s cooldown). Dodge slower traffic (some signal, then change lanes), oil slicks spin you,
// off-road (grass/sand) slows you way down. Fuel drains: grab ⛽. Bones +50. Score = 1 per 5 m + bones.
// 3 bonks or an empty tank ends the run. Scenery: suburbs -> beach -> desert -> night city every 2000 m.
(function () {
  const PXM = 8;              // world px per meter
  const SEC = 2600;           // world px per road section (narrowing pattern)
  const ZONE = 2000 * PXM;    // scenery change distance
  const START = 400;          // starting world y
  const clamp = (v, a, b) => v < a ? a : v > b ? b : v;
  const rnd = (a, b) => a + Math.random() * (b - a);
  const hh = n => { let x = Math.imul((n | 0) ^ 0x9e3779b9, 2654435761); x ^= x >>> 15; x = Math.imul(x, 2246822519); x ^= x >>> 13; return (x >>> 0) / 4294967296; };
  const E = (c, ch, x, y, sz) => { c.fillStyle = "#000"; G.emoji(c, ch, x, y, sz); };
  const rr = (c, x, y, w, h, r) => { c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); };

  const THEMES = [
    { name: "SUBURBS", g1: "#6cc04a", g2: "#62b443", road: "#5a5f6b", rum1: "#e63946", rum2: "#f5f5f5", line: "#ffffff", deco: ["🌳", "🏡", "🌲", "🌳", "🏠", "🌷"], decoR: null },
    { name: "BEACH", g1: "#f2d58a", g2: "#ebcb7c", road: "#6b6f78", rum1: "#2a9df4", rum2: "#f5f5f5", line: "#ffffff", deco: ["🌴", "⛱️", "🌴", "🐚", "🦀"], decoR: ["⛵", "🐬", "🏄"] },
    { name: "DESERT", g1: "#e0b46c", g2: "#d6a85f", road: "#6e6258", rum1: "#c2410c", rum2: "#fde68a", line: "#fff3c4", deco: ["🌵", "🪨", "🌵", "🦂", "🏜️"], decoR: null },
    { name: "NIGHT CITY", g1: "#2b2d42", g2: "#30334a", road: "#24262f", rum1: "#facc15", rum2: "#3f3f46", line: "#fde047", deco: ["🏢", "🏬", "🏙️", "🏢", "🏨"], decoR: null }
  ];
  const zoneOf = wy => { const z = Math.floor(wy / ZONE); return ((z % 4) + 4) % 4; };

  // ---- road geometry (functions of world y; results in module vars to avoid allocations) ----
  let LW = 64, AMP = 40, NL = 0, NR = 0;
  function geo(G) { LW = Math.min(66, Math.floor((G.W - 64) / 4)); AMP = Math.max(0, (G.W - 4 * LW) / 2 - 18); }
  const cxAt = (G, wy) => G.W / 2 + AMP * (0.6 * Math.sin(wy / 900) + 0.4 * Math.sin(wy / 2300 + 1));
  function nar(wy) {
    NL = 0; NR = 0;
    const k = Math.floor(wy / SEC); if (k < 2) return;
    const h = hh(k * 7 + 3); if (h < 0.4) return;
    const p = wy - k * SEC, f = clamp(Math.min((p - 300) / 260, (SEC - 300 - p) / 260), 0, 1);
    if (h < 0.7) NL = f; else NR = f;
  }
  const laneX = (G, lp, wy) => cxAt(G, wy) + (lp - 1.5) * LW;
  function laneOk(i, wy) { nar(wy); return !((i === 0 && NL > 0.02) || (i === 3 && NR > 0.02)); }
  function laneOkSpan(i, wy, span) { for (let d = 0; d <= span; d += 150) if (!laneOk(i, wy + d)) return false; return true; }
  function nLanes(wy) { nar(wy); return 4 - (NL > 0.5 ? 1 : 0) - (NR > 0.5 ? 1 : 0); }

  const PYf = G => Math.round(G.H * 0.76);
  const score = s => Math.min(99999, Math.floor((s.py - START) / (PXM * 5)) + s.bones * 50);

  const CAR_COLS = ["#3b82f6", "#22c55e", "#a855f7", "#f97316", "#14b8a6", "#eab308", "#ec4899", "#e5e7eb", "#0ea5e9"];
  function newTraffic(s, kind, lane, wy) {
    const t = s.time, sp = 1 + Math.min(0.5, t / 200);
    const o = { kind, lane, lp: lane, tl: lane, wy, blink: 0, nc: rnd(1.5, 5), col: CAR_COLS[(Math.random() * CAR_COLS.length) | 0], w: 30, h: 50, bv: 170, cv: 170, chg: false, bump: 0 };
    if (kind === "car") { o.bv = rnd(150, 215) * sp; o.chg = Math.random() < (t < 20 ? 0.25 : 0.5); }
    else if (kind === "truck") { o.w = 36; o.h = 86; o.bv = rnd(130, 165) * sp; o.col = ["#dc2626", "#2563eb", "#16a34a", "#7c3aed"][(Math.random() * 4) | 0]; o.chg = Math.random() < 0.2; }
    else if (kind === "mail") { o.w = 32; o.h = 60; o.bv = rnd(135, 160) * sp; o.chg = Math.random() < 0.35; }
    else { o.w = 40; o.h = 58; o.bv = 75 * sp; } // sweeper
    o.cv = o.bv; return o;
  }
  function crowd(s, wy, r) { let n = 0; for (const o of s.cars) if (Math.abs(o.wy - wy) < r) n++; return n; }
  const lbits = lp => (1 << Math.floor(lp)) | (1 << Math.ceil(lp));
  const pop = m => (m & 1) + (m >> 1 & 1) + (m >> 2 & 1) + (m >> 3 & 1);
  function occ(s, wy, r, skip) { let m = 0; for (const o of s.cars) if (o !== skip && Math.abs(o.wy - wy) < r) m |= lbits(o.lp) | lbits(o.tl); return m; }
  function bandLimit(s, wy) { return Math.max(0, nLanes(wy) - (s.time < 25 ? 3 : 2)); }
  function spawnTraffic(G, wy) {
    const s = G.s;
    if (crowd(s, wy, 190) >= bandLimit(s, wy) + 1) return false;
    const ok = []; for (let i = 0; i < 4; i++) if (laneOkSpan(i, wy, 1500)) ok.push(i);
    for (let tries = 0; tries < 4 && ok.length; tries++) {
      const li = (Math.random() * ok.length) | 0, lane = ok[li];
      if (s.cars.some(o => Math.abs(o.lp - lane) < 0.9 && Math.abs(o.wy - wy) < 130) || pop(occ(s, wy, 200) | (1 << lane)) >= nLanes(wy)) { ok.splice(li, 1); continue; }
      const r = Math.random(), t = s.time;
      const kind = r < 0.62 ? "car" : r < 0.8 ? "truck" : r < 0.92 ? "mail" : (t > 15 ? "sweeper" : "car");
      s.cars.push(newTraffic(s, kind, lane, wy)); return true;
    }
    return false;
  }
  function spawnThing(G, type, wy) {
    const s = G.s, ok = [];
    for (let i = 0; i < 4; i++) if (laneOk(i, wy)) ok.push(i);
    const lane = ok[(Math.random() * ok.length) | 0];
    s.things.push({ type, lane, wy, got: false });
  }

  function bonk(G, o) {
    const s = G.s;
    s.lives--; s.inv = 2.2; s.dizzy = 1.3; s.v *= 0.35; s.turbo = 0;
    const ox = laneX(G, o.lp, o.wy);
    s.kx = (s.px < ox ? -1 : 1) * 260; o.wy += 40; o.bump = 0.4;
    G.sfx("lose"); G.buzz();
    s.pops.push({ x: s.px, y: PYf(G) - 50, txt: "BONK!", c: "#ffd23f", t: 0.9 });
    if (s.lives <= 0 && !s.dead) { s.dead = 1.1; s.why = "lives"; }
  }

  function turbo(G) {
    const s = G.s; if (s.dead || s.tcd > 0) return;
    s.turbo = 1.3; s.tcd = 3; G.sfx("pop");
    s.pops.push({ x: s.px, y: PYf(G) - 50, txt: "TURBO!", c: "#7df9ff", t: 0.7 });
  }

  // ---- drawing helpers ----
  function drawVehicle(G, c, o, x, y) {
    const w = o.w, h = o.h, l = x - w / 2, t = y - h / 2;
    c.fillStyle = "rgba(0,0,0,0.28)"; rr(c, l + 3, t + 4, w, h, 7); c.fill();
    c.fillStyle = "#111";
    c.fillRect(l - 3, t + 8, 5, 13); c.fillRect(l + w - 2, t + 8, 5, 13); c.fillRect(l - 3, t + h - 20, 5, 13); c.fillRect(l + w - 2, t + h - 20, 5, 13);
    c.strokeStyle = "#1a1a1a"; c.lineWidth = 2;
    if (o.kind === "car") {
      c.fillStyle = o.col; rr(c, l, t, w, h, 8); c.fill(); c.stroke();
      c.fillStyle = "#9fd8ff"; rr(c, l + 4, t + 11, w - 8, 9, 3); c.fill();
      c.fillStyle = "rgba(0,0,0,0.18)"; rr(c, l + 4, t + 21, w - 8, h * 0.34, 3); c.fill();
      c.fillStyle = "#7fb8e0"; rr(c, l + 5, t + h - 13, w - 10, 6, 2); c.fill();
    } else if (o.kind === "truck") {
      c.fillStyle = o.col; rr(c, l + 2, t, w - 4, 24, 6); c.fill(); c.stroke();
      c.fillStyle = "#9fd8ff"; c.fillRect(l + 6, t + 8, w - 12, 6);
      c.fillStyle = "#e5e7eb"; rr(c, l, t + 26, w, h - 26, 3); c.fill(); c.stroke();
      c.fillStyle = o.col; c.fillRect(l + 3, t + 40, w - 6, 5); c.fillRect(l + 3, t + 62, w - 6, 5);
    } else if (o.kind === "mail") {
      c.fillStyle = "#f8fafc"; rr(c, l, t, w, h, 6); c.fill(); c.stroke();
      c.fillStyle = "#9fd8ff"; rr(c, l + 4, t + 8, w - 8, 7, 2); c.fill();
      c.fillStyle = "#1d4ed8"; c.fillRect(l + 2, t + 22, w - 4, 6);
      c.fillStyle = "#dc2626"; c.fillRect(l + 2, t + 29, w - 4, 4);
      E(c, "📬", x, t + 45, 16);
    } else {
      c.fillStyle = "#f4c430"; rr(c, l, t + 8, w, h - 8, 7); c.fill(); c.stroke();
      c.fillStyle = "#9fd8ff"; c.fillRect(l + 7, t + 16, w - 14, 7);
      c.fillStyle = "#3f3f46"; c.fillRect(l + 5, t + 30, w - 10, h - 40);
      if ((G.t * 4 | 0) % 2) { c.fillStyle = "#ff8c00"; c.beginPath(); c.arc(x, t + 26, 4, 0, 7); c.fill(); }
      for (const bx of [l + 3, l + w - 3]) {
        c.fillStyle = "#94a3b8"; c.beginPath(); c.arc(bx, t + 6, 9, 0, 7); c.fill();
        c.strokeStyle = "#475569"; c.lineWidth = 2; c.beginPath();
        for (let k = 0; k < 3; k++) { const a = G.t * 14 + k * 2.094; c.moveTo(bx, t + 6); c.lineTo(bx + Math.cos(a) * 9, t + 6 + Math.sin(a) * 9); }
        c.stroke();
      }
    }
    // headlights & taillights
    c.fillStyle = "#fff7b0"; c.fillRect(l + 3, t + 1, 5, 3); c.fillRect(l + w - 8, t + 1, 5, 3);
    c.fillStyle = "#ef4444"; c.fillRect(l + 3, t + h - 4, 5, 3); c.fillRect(l + w - 8, t + h - 4, 5, 3);
    if (o.tl !== o.lane && (G.t * 6 | 0) % 2) {
      const sx = o.tl < o.lane ? l - 1 : l + w + 1;
      c.fillStyle = "#ffb703"; c.beginPath(); c.arc(sx, t + 5, 4, 0, 7); c.arc(sx, t + h - 5, 4, 0, 7); c.fill();
    }
  }

  function drawPlayer(G, c, s, x, y) {
    c.save(); c.translate(x, y); c.rotate(s.ang + clamp(s.vx * 0.0011, -0.25, 0.25));
    if (s.inv > 0 && (G.t * 12 | 0) % 2) c.globalAlpha = 0.45;
    c.fillStyle = "rgba(0,0,0,0.3)"; rr(c, -15, -26, 34, 58, 9); c.fill();
    if (s.turbo > 0) {
      for (const fx of [-8, 8]) {
        const fl = 12 + Math.random() * 12;
        c.fillStyle = "#ff8c00"; c.beginPath(); c.moveTo(fx - 5, 29); c.lineTo(fx + 5, 29); c.lineTo(fx, 29 + fl); c.fill();
        c.fillStyle = "#ffe066"; c.beginPath(); c.moveTo(fx - 3, 29); c.lineTo(fx + 3, 29); c.lineTo(fx, 29 + fl * 0.55); c.fill();
      }
    }
    c.fillStyle = "#111"; c.fillRect(-20, -22, 6, 14); c.fillRect(14, -22, 6, 14); c.fillRect(-20, 8, 6, 15); c.fillRect(14, 8, 6, 15);
    c.fillStyle = "#e63946"; c.strokeStyle = "#5c0f17"; c.lineWidth = 2; rr(c, -17, -29, 34, 58, 9); c.fill(); c.stroke();
    c.fillStyle = "#fff"; c.fillRect(-3, -28, 6, 15); // racing stripe on hood
    c.fillStyle = "#ff8f98"; c.fillRect(-14, -26, 4, 10); // shine
    c.fillStyle = "#9fd8ff"; c.strokeStyle = "#333"; rr(c, -14, -13, 28, 6, 2); c.fill(); c.stroke();
    c.fillStyle = "#3a2a22"; rr(c, -13, -6, 26, 27, 5); c.fill();
    // flapping ears (blown back by the wind)
    const fl = 0.35 + 0.3 * Math.sin(G.t * (s.turbo > 0 ? 40 : 24));
    c.fillStyle = "#8a5a3b";
    c.save(); c.translate(-10, 0); c.rotate(0.5 + fl); c.beginPath(); c.ellipse(0, 7, 4.5, 9, 0, 0, 7); c.fill(); c.restore();
    c.save(); c.translate(10, 0); c.rotate(-0.5 - fl); c.beginPath(); c.ellipse(0, 7, 4.5, 9, 0, 0, 7); c.fill(); c.restore();
    const face = s.dead ? ":dawgpain:" : s.dizzy > 0 ? ":dawgpain:" : s.spin > 0 ? ":dawgsus:" : s.turbo > 0 ? ":dawgpog:" : s.fuel < 20 ? ":dawgsweat:" : ":dawgW:";
    G.img(c, face, 0, 3, 28);
    c.fillStyle = "#c92a37"; rr(c, -14, 21, 28, 6, 2); c.fill();
    c.fillStyle = "#fff7b0"; c.fillRect(-14, -29, 6, 3); c.fillRect(8, -29, 6, 3);
    c.fillStyle = "#ff3b3b"; c.fillRect(-14, 26, 6, 3); c.fillRect(8, 26, 6, 3);
    c.restore();
    if (s.dizzy > 0 || s.dead) for (let k = 0; k < 3; k++) { const a = G.t * 6 + k * 2.094; E(c, "⭐", x + Math.cos(a) * 20, y - 2 + Math.sin(a) * 8, 13); }
  }

  defGame({
    key: "drive", name: "Road Dawg", icon: "🚙", max: 99999,
    blurb: "Floor it. Weave through traffic.",
    how: "Drag or hold anywhere: the car steers toward your finger. Quick tap = TURBO (3 s cooldown). Dodge traffic and oil slicks, stay off the grass, grab ⛽ before the tank runs dry. 🦴 = +50. 3 bonks and you're done.",
    reset(G) {
      geo(G);
      G.s = { py: START, px: 0, vx: 0, kx: 0, v: 300, ang: 0, spin: 0, spinDir: 1, dizzy: 0, inv: 0, lives: 3, fuel: 100, bones: 0,
        turbo: 0, tcd: 0, hold: false, tx: 0, kdir: 0, time: 0, cars: [], things: [], pops: [], dead: 0, why: "",
        nextCar: START + 700, nextBone: START + 900, nextFuel: START + 2600, nextOil: START + 5000, zone: 0, banner: "SUBURBS", bt: 2, off: false, shake: 0 };
      const s = G.s; s.px = laneX(G, 1.5, START + 0) + LW / 2;
      const PY = PYf(G);
      for (const d of [PY - 60, PY + 200]) spawnTraffic(G, START + d);
      s.nextCar = START + PY + 120;
    },
    update(G, dt) {
      const s = G.s, PY = PYf(G);
      s.time += dt;
      const cruise = 300 + Math.min(300, s.time * 2.6);
      // fuel
      if (!s.dead) { s.fuel -= dt * (1.7 + (s.turbo > 0 ? 1.3 : 0)); if (s.fuel <= 0) { s.fuel = 0; s.dead = 1.8; s.why = "gas"; G.sfx("lose"); } }
      // road at player
      nar(s.py);
      const cx = cxAt(G, s.py), le = cx - 2 * LW + NL * LW, re = cx + 2 * LW - NR * LW;
      s.le = le; s.re = re; s.off = s.px - 12 < le || s.px + 12 > re;
      // speed
      let tv = s.dead ? 0 : cruise * (s.turbo > 0 ? 1.55 : 1);
      if (s.off) tv = Math.min(tv, 115);
      if (s.spin > 0) tv *= 0.6;
      if (s.v < tv) s.v = Math.min(tv, s.v + (s.turbo > 0 ? 700 : 240) * dt);
      else s.v = Math.max(tv, s.v - (s.off ? 650 : s.dead ? 260 : 300) * dt);
      s.turbo -= dt; s.tcd -= dt; s.inv -= dt; s.dizzy -= dt;
      // steering
      if (s.spin > 0) {
        s.spin -= dt; s.ang += 13 * dt * s.spinDir; if (s.spin <= 0) s.ang = 0;
      } else if (!s.dead) {
        let dvx = 0;
        if (s.hold) dvx = clamp((s.tx - s.px) * 9, -(360 + s.v * 0.35), 360 + s.v * 0.35);
        else if (s.kdir) dvx = s.kdir * (300 + s.v * 0.3);
        s.vx += (dvx - s.vx) * Math.min(1, dt * 12);
      } else s.vx *= Math.exp(-4 * dt);
      s.px += (s.vx + s.kx) * dt; s.kx *= Math.exp(-6 * dt);
      s.px = clamp(s.px, 16, G.W - 16);
      s.py += s.v * dt;
      s.shake = s.off && s.v > 40 ? 1.5 : 0;
      // traffic AI
      for (const o of s.cars) {
        o.cv = o.bv; o.bump -= dt;
        let ahead = 0, minAhead = 1e9, am = lbits(o.lp) | lbits(o.tl);
        for (const p of s.cars) {
          if (p === o) continue;
          const d = p.wy - o.wy;
          if (d > 0 && d < 200) { ahead++; am |= lbits(p.lp) | lbits(p.tl); if (p.cv < minAhead) minAhead = p.cv; }
          if (d > 0 && d < 120 && Math.abs(p.lp - o.lp) < 0.95) o.cv = Math.min(o.cv, p.bv * 0.98);
        }
        if (ahead > 0 && (ahead >= bandLimit(s, o.wy) || pop(am) >= Math.min(nLanes(o.wy), nLanes(o.wy + 200)))) o.cv = Math.min(o.cv, minAhead);
        // lane changes
        if (o.tl !== o.lane) {
          if (o.blink > 0) o.blink -= dt;
          else { const dir = Math.sign(o.tl - o.lp); o.lp += dir * 1.5 * dt; if ((o.tl - o.lp) * dir <= 0) { o.lp = o.tl; o.lane = o.tl; o.nc = rnd(2, 6); } }
        } else {
          const mustMerge = !laneOk(o.lane, o.wy + 320);
          o.nc -= dt;
          if (mustMerge || (o.chg && o.nc <= 0)) {
            o.nc = rnd(1, 3);
            const dirs = o.lane === 0 ? [1] : o.lane === 3 ? [-1] : Math.random() < 0.5 ? [-1, 1] : [1, -1];
            for (const d of dirs) {
              const nl = o.lane + d;
              if (!laneOkSpan(nl, o.wy, 600)) continue;
              if (s.cars.some(p => p !== o && Math.abs(p.lp - nl) < 0.9 && Math.abs(p.wy - o.wy) < 140)) continue;
              if (!mustMerge && pop(occ(s, o.wy, 200, o) | lbits(o.lp) | (1 << nl)) >= nLanes(o.wy)) continue;
              // don't pull right in front of the player
              const sy = PY - (o.wy - s.py);
              if (sy > PY - 150 && sy < PY + 60 && Math.abs(laneX(G, nl, o.wy) - s.px) < LW * 0.8) continue;
              o.tl = nl; o.blink = mustMerge ? 0.6 : 1.0; break;
            }
          }
        }
        o.wy += o.cv * dt;
      }
      // collisions with traffic
      for (const o of s.cars) {
        const ox = o._x = laneX(G, o.lp, o.wy), oy = PY - (o.wy - s.py);
        if (s.dead) continue;
        if (s.inv <= 0 && Math.abs(s.px - ox) < (34 + o.w) / 2 - 5 && Math.abs(PY - oy) < (56 + o.h) / 2 - 7) { bonk(G, o); break; }
      }
      // pickups / oil
      for (const t of s.things) {
        if (t.got) continue;
        const tx = t._x = laneX(G, t.lane, t.wy), ty = PY - (t.wy - s.py);
        if (s.dead) continue;
        if (t.type === "oil") {
          if (s.spin <= 0 && s.inv <= 0 && Math.abs(s.px - tx) < 28 && Math.abs(PY - ty) < 34) {
            t.got = true; s.spin = 0.9; s.spinDir = Math.random() < 0.5 ? -1 : 1; s.vx = s.spinDir * 140; s.turbo = 0;
            G.sfx("lose"); s.pops.push({ x: s.px, y: PY - 50, txt: "WHOA!", c: "#c4b5fd", t: 0.8 });
          }
        } else if (Math.abs(s.px - tx) < 30 && Math.abs(PY - ty) < 36) {
          t.got = true; G.sfx("pop");
          if (t.type === "bone") { s.bones++; s.pops.push({ x: tx, y: ty - 20, txt: "+50", c: "#ffd23f", t: 0.7 }); }
          else { s.fuel = Math.min(100, s.fuel + 35); s.pops.push({ x: tx, y: ty - 20, txt: "FUEL!", c: "#7CFC8A", t: 0.8 }); }
        }
      }
      // spawning (world-distance based)
      const top = s.py + PY + 110;
      if (top >= s.nextCar) {
        spawnTraffic(G, top);
        const d = Math.min(1, s.time / 110);
        s.nextCar = top + rnd(330, 470) * (1 - d * 0.6);
      }
      if (top >= s.nextBone) { spawnThing(G, "bone", top); s.nextBone = top + rnd(500, 1100); }
      if (top >= s.nextFuel) { spawnThing(G, "fuel", top); s.nextFuel = top + rnd(3000, 4000) + s.time * 5; }
      if (s.time > 18 && top >= s.nextOil) { spawnThing(G, "oil", top + 30); s.nextOil = top + rnd(2200, 4200) * (s.time > 60 ? 0.7 : 1); }
      // cleanup
      s.cars = s.cars.filter(o => { const sy = PY - (o.wy - s.py); return sy < G.H + 160 && sy > -900; });
      s.things = s.things.filter(t => PY - (t.wy - s.py) < G.H + 80 && !(t.got && t.type !== "oil"));
      s.pops.forEach(p => p.t -= dt); s.pops = s.pops.filter(p => p.t > 0);
      // zone banner
      const z = Math.floor(s.py / ZONE);
      if (z !== s.zone) { s.zone = z; s.banner = THEMES[zoneOf(s.py)].name; s.bt = 2.2; G.sfx("win"); }
      s.bt -= dt;
      // end
      if (s.dead) {
        s.dead -= dt;
        if (s.dead <= 0) {
          const sc = score(s);
          G.over(sc, s.why === "gas" ? (sc >= 1500 ? "Ran dry. What a drive!" : "Out of gas!") : (sc >= 1500 ? "Road Dawg legend!" : "Bonked out!"));
        }
      }
    },
    down(G, x) { const s = G.s; s.hold = true; s.tx = x; s.downT = G.t; },
    move(G, x) { G.s.tx = x; },
    up(G) { G.s.hold = false; },
    tap(G) { if (G.t - (G.s.downT || 0) < 0.35) turbo(G); },
    onKey(G, k, d) {
      const s = G.s;
      if (k === "ArrowLeft" || k === "a") s.kdir = d ? -1 : (s.kdir === -1 ? 0 : s.kdir);
      else if (k === "ArrowRight" || k === "d") s.kdir = d ? 1 : (s.kdir === 1 ? 0 : s.kdir);
      else if (d && (k === " " || k === "ArrowUp" || k === "w")) turbo(G);
    },
    draw(G, c) {
      const s = G.s, W = G.W, H = G.H, PY = PYf(G), dark = G.dark();
      geo(G);
      const shx = s.shake ? (Math.random() - 0.5) * 2 * s.shake : 0;
      c.save(); c.translate(shx, 0);
      // ---- road, row by row ----
      const STEP = 4;
      for (let sy = 0; sy < H; sy += STEP) {
        const wy = s.py + (PY - sy), th = THEMES[zoneOf(wy)];
        nar(wy);
        const cx = cxAt(G, wy), fl = cx - 2 * LW, fr = cx + 2 * LW, le = fl + NL * LW, re = fr - NR * LW;
        const band = Math.floor(wy / 40) & 1;
        c.fillStyle = band ? th.g1 : th.g2; c.fillRect(-4, sy, W + 8, STEP);
        if (th === THEMES[1]) { // beach: ocean on the right
          const wx = fr + 44 + 10 * Math.sin(wy / 120);
          c.fillStyle = "#f8e7b5"; c.fillRect(wx - 6, sy, 6, STEP);
          c.fillStyle = (Math.floor((wy + 20 * Math.sin(wy / 50)) / 30) & 1) ? "#3fa7d6" : "#3a9bcc"; c.fillRect(wx, sy, W - wx + 4, STEP);
        } else if (th === THEMES[3]) { // night city sidewalks
          c.fillStyle = band ? "#4a4e69" : "#444862"; c.fillRect(fl - 30, sy, 22, STEP); c.fillRect(fr + 8, sy, 22, STEP);
        }
        // construction zone where a lane is closed
        const hz = (Math.floor(wy / 18) & 1) ? "#ff8c1a" : "#fafafa";
        if (NL > 0) { c.fillStyle = hz; c.fillRect(fl, sy, le - fl, STEP); }
        if (NR > 0) { c.fillStyle = hz; c.fillRect(re, sy, fr - re, STEP); }
        // rumble strips
        c.fillStyle = (Math.floor(wy / 24) & 1) ? th.rum1 : th.rum2;
        c.fillRect(le - 8, sy, 8, STEP); c.fillRect(re, sy, 8, STEP);
        // asphalt
        c.fillStyle = th.road; c.fillRect(le, sy, re - le, STEP);
        c.fillStyle = th.line; c.fillRect(le + 3, sy, 3, STEP); c.fillRect(re - 6, sy, 3, STEP);
        if ((wy % 64 + 64) % 64 < 32) {
          if (NL < 0.5) c.fillRect(cx - LW - 2, sy, 4, STEP);
          c.fillRect(cx - 2, sy, 4, STEP);
          if (NR < 0.5) c.fillRect(cx + LW - 2, sy, 4, STEP);
        }
      }
      // ---- roadside decor ----
      const CH = 86, k0 = Math.floor((s.py + PY - H - 40) / CH), k1 = Math.floor((s.py + PY + 40) / CH);
      for (let k = k0; k <= k1; k++) {
        const wy = k * CH + 30 * hh(k * 13 + 1), sy = PY - (wy - s.py), th = THEMES[zoneOf(wy)];
        const cx = cxAt(G, wy), fl = cx - 2 * LW, fr = cx + 2 * LW;
        if (th === THEMES[3]) { // city blocks with lit windows
          for (let side = 0; side < 2; side++) {
            const x0 = side ? fr + 30 : 0, x1 = side ? W : fl - 30;
            if (x1 - x0 < 10) continue;
            c.fillStyle = ["#1e1b4b", "#312e81", "#1f2937", "#3b0764"][(hh(k * 29 + side) * 4) | 0];
            c.fillRect(x0, sy - 40, x1 - x0, 76);
            c.fillStyle = "#fde68a";
            for (let ci = 0, wx = x0 + 5; wx < x1 - 6; ci++, wx += 11) for (let ri = 0; ri < 5; ri++)
              if (hh(k * 131 + ci * 17 + ri * 5 + side * 997) < 0.45) c.fillRect(wx, sy - 34 + ri * 13, 6, 7);
          }
        } else {
          const lspace = fl - 12;
          if (lspace > 26 && hh(k * 3 + 7) < 0.85) E(c, th.deco[(hh(k * 5 + 2) * th.deco.length) | 0], 13 + hh(k * 3 + 1) * (lspace - 26), sy, 26);
          if (th === THEMES[1]) {
            const wx = fr + 44; if (W - wx > 30 && hh(k * 11 + 5) < 0.3) E(c, th.decoR[(hh(k * 17) * 3) | 0], wx + 14 + hh(k * 19) * (W - wx - 28), sy, 22);
          } else {
            const r0 = fr + 12, rspace = W - r0;
            if (rspace > 26 && hh(k * 9 + 4) < 0.85) E(c, th.deco[(hh(k * 23 + 8) * th.deco.length) | 0], r0 + 13 + hh(k * 7 + 3) * (rspace - 26), sy, 26);
        }
        }
        nar(wy);
        if (NL > 0.05 && NL < 0.95) E(c, "🚧", fl + NL * LW * 0.5, sy, 20);
        if (NR > 0.05 && NR < 0.95) E(c, "🚧", fr - NR * LW * 0.5, sy, 20);
        if (th === THEMES[3] && (k & 1)) { // streetlamps
          c.fillStyle = "rgba(255,210,90,0.13)"; c.beginPath(); c.arc(fl + 10, sy, 34, 0, 7); c.arc(fr - 10, sy + 40, 34, 0, 7); c.fill();
          c.fillStyle = "#fde68a"; c.fillRect(fl - 14, sy - 2, 10, 4); c.fillRect(fr + 4, sy + 38, 10, 4);
        }
      }
      if (dark) { c.fillStyle = "rgba(5,8,30,0.28)"; c.fillRect(-4, 0, W + 8, H); }
      // ---- pickups & oil ----
      for (const t of s.things) {
        if (t.got && t.type !== "oil") continue;
        const tx = laneX(G, t.lane, t.wy), ty = PY - (t.wy - s.py);
        if (ty < -40 || ty > H + 40) continue;
        if (t.type === "oil") {
          c.fillStyle = "#0b0b12"; c.beginPath(); c.ellipse(tx, ty, 24, 14, 0.3, 0, 7); c.fill();
          c.beginPath(); c.ellipse(tx + 12, ty + 8, 10, 7, 0, 0, 7); c.fill();
          c.fillStyle = "rgba(160,120,255,0.45)"; c.beginPath(); c.ellipse(tx - 6, ty - 4, 9, 4, 0.3, 0, 7); c.fill();
          c.fillStyle = "rgba(80,220,255,0.35)"; c.beginPath(); c.ellipse(tx + 5, ty + 2, 6, 3, 0.3, 0, 7); c.fill();
        } else {
          const bob = Math.sin(G.t * 6 + t.wy) * 3;
          c.fillStyle = "rgba(255,255,255,0.35)"; c.beginPath(); c.arc(tx, ty + bob, 17, 0, 7); c.fill();
          E(c, t.type === "bone" ? "🦴" : "⛽", tx, ty + bob, t.type === "bone" ? 24 : 26);
        }
      }
      // ---- traffic ----
      const night = zoneOf(s.py) === 3;
      for (const o of s.cars) {
        const ox = laneX(G, o.lp, o.wy), oy = PY - (o.wy - s.py);
        if (oy < -100 || oy > H + 100) continue;
        if (night) { c.fillStyle = "rgba(255,240,170,0.1)"; c.beginPath(); c.moveTo(ox - o.w / 2 + 3, oy - o.h / 2); c.lineTo(ox + o.w / 2 - 3, oy - o.h / 2); c.lineTo(ox + o.w, oy - o.h / 2 - 90); c.lineTo(ox - o.w, oy - o.h / 2 - 90); c.fill(); }
        drawVehicle(G, c, o, ox, oy);
      }
      // ---- player ----
      if (night) { c.fillStyle = "rgba(255,245,190,0.22)"; c.beginPath(); c.moveTo(s.px - 14, PY - 29); c.lineTo(s.px + 14, PY - 29); c.lineTo(s.px + 40, PY - 150); c.lineTo(s.px - 40, PY - 150); c.fill(); }
      drawPlayer(G, c, s, s.px, PY);
      c.restore();
      // pops
      for (const p of s.pops) G.text(c, p.txt, p.x, p.y - (1 - p.t) * 30, 11, p.c);
      // ---- HUD ----
      c.fillStyle = "rgba(0,0,0,0.5)"; c.fillRect(0, 0, W, 52);
      G.text(c, `SCORE ${score(s)}`, 10, 15, 11, "#fff", "left");
      for (let i = 0; i < 3; i++) {
        c.globalAlpha = i < s.lives ? 1 : 0.25; G.img(c, ":dawgW:", W - 16 - i * 22, 15, 20); c.globalAlpha = 1;
      }
      // fuel gauge
      E(c, "⛽", 14, 37, 15);
      const fw = W / 2 - 40, fx = 26;
      c.fillStyle = "#222"; c.fillRect(fx, 31, fw, 12);
      const fc = s.fuel > 50 ? "#4ade80" : s.fuel > 22 ? "#facc15" : "#ef4444";
      if (!(s.fuel <= 22 && (G.t * 4 | 0) % 2)) { c.fillStyle = fc; c.fillRect(fx + 2, 33, (fw - 4) * clamp(s.fuel / 100, 0, 1), 8); }
      c.strokeStyle = "#fff"; c.lineWidth = 1; c.strokeRect(fx + 0.5, 31.5, fw - 1, 11);
      // turbo meter
      const tx0 = W / 2 + 8, tw = W / 2 - 18, ready = s.tcd <= 0;
      G.text(c, "TURBO", tx0, 38, 8, ready ? "#7df9ff" : "#9ca3af", "left");
      const bx = tx0 + 46, bw = tw - 46;
      c.fillStyle = "#222"; c.fillRect(bx, 31, bw, 12);
      c.fillStyle = s.turbo > 0 ? "#ff8c00" : ready ? ((G.t * 3 | 0) % 2 ? "#7df9ff" : "#38bdf8") : "#0ea5e9";
      c.fillRect(bx + 2, 33, (bw - 4) * (s.turbo > 0 ? clamp(s.turbo / 1.3, 0, 1) : clamp(1 - s.tcd / 3, 0, 1)), 8);
      c.strokeStyle = "#fff"; c.strokeRect(bx + 0.5, 31.5, bw - 1, 11);
      // speed / distance
      c.fillStyle = "rgba(0,0,0,0.45)"; c.fillRect(0, H - 24, W, 24);
      G.text(c, `${Math.max(0, Math.floor((s.py - START) / PXM))} M`, 10, H - 12, 9, "#fff", "left");
      G.text(c, `${Math.round(s.v / PXM * 3.6)} KM/H`, W - 10, H - 12, 9, s.turbo > 0 ? "#ff8c00" : s.off ? "#facc15" : "#fff", "right");
      if (s.off && !s.dead) G.text(c, "OFF ROAD!", W / 2, H - 12, 9, "#facc15");
      // banners / hints
      if (s.bt > 0) {
        c.fillStyle = "rgba(0,0,0,0.55)"; c.fillRect(0, H * 0.3 - 20, W, 40);
        G.text(c, s.banner, W / 2, H * 0.3, 16, "#ffd23f");
      }
      if (s.time < 5 && G.state === "play") {
        c.fillStyle = "rgba(0,0,0,0.55)"; c.fillRect(W / 2 - 130, H * 0.42 - 26, 260, 52);
        G.text(c, "DRAG TO STEER", W / 2, H * 0.42 - 9, 11, "#fff");
        G.text(c, "TAP = TURBO", W / 2, H * 0.42 + 11, 11, "#7df9ff");
      }
      if (s.fuel > 0 && s.fuel < 22 && !s.dead && (G.t * 2 | 0) % 2) G.text(c, "LOW FUEL!", W / 2, 66, 10, "#ef4444");
      if (s.dead && s.why === "gas") G.text(c, "OUT OF GAS!", W / 2, H * 0.45, 14, "#ef4444");
    }
  });
})();
