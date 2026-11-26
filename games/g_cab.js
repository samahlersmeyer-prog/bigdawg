// ---------- Cab Dawg (City Cab Rush-style taxi rush) ----------
// Drive a cab around a small low-poly city: pull up to a waving rider, race them to their pin before their timer
// runs out, dodge traffic. 5 shifts (Mon-Fri) on a clock; between shifts spend the bank on upgrades (seats, engine,
// tires, longer shift, meter). Score = total dollars earned.
// The camera sits above the cab and turns with it; buildings are drawn leaning away from the cab for a 3D look.
// Touch: hold left / right half to steer (gas is automatic), hold both to brake and back up (raw touch events).
(function () {
  const N = 8, B = 150, R = 64, P = B + R, WORLD = N * P + R, SW = 12, DAYS = 5, ZR = 38;
  const TOUCH = typeof window !== "undefined" && "ontouchstart" in window;
  const clamp = (v, a, b) => v < a ? a : v > b ? b : v, hyp = Math.hypot;
  const hh = (a, b) => { let x = Math.imul((a * 374761 + b * 668265) ^ 0x9e3779b9, 2654435761); x ^= x >>> 15; x = Math.imul(x, 2246822519); x ^= x >>> 13; return (x >>> 0) / 4294967296; };
  const DAYN = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"];
  const PAL = ["#f4a261", "#e76f51", "#2a9d8f", "#e9c46a", "#8ecae6", "#b5838d", "#a8dadc", "#f6bd60", "#84a59d", "#cdb4db"];
  const SEAT = ["#22c55e", "#3b82f6", "#ec4899", "#f97316"];
  const FOLK = ["🙋", "🙋‍♀️", "🙋‍♂️", "💁", "🧑‍💼", "👵", "🧑‍🎤", "👷"];
  const CARC = ["#3b82f6", "#ef4444", "#a855f7", "#14b8a6", "#e5e7eb", "#f97316", "#64748b", "#ec4899"];
  const DIR = [[1, 0], [0, 1], [-1, 0], [0, -1]];
  const UPS = [
    { k: "seats", name: "SEATS", sub: "carry more riders at once", cost: [60, 150, 280] },
    { k: "engine", name: "ENGINE", sub: "higher top speed", cost: [40, 90, 150, 220] },
    { k: "tires", name: "TIRES", sub: "tighter turns, less sliding", cost: [40, 90, 150] },
    { k: "shift", name: "LONGER SHIFT", sub: "+8 seconds every day", cost: [50, 110, 180] },
    { k: "meter", name: "METER", sub: "+15% on every fare", cost: [60, 130, 210] }
  ];
  const shade = (hex, k) => { const n = parseInt(hex.slice(1), 16), f = v => clamp(Math.round(v * k), 0, 255); return "rgb(" + f(n >> 16) + "," + f((n >> 8) & 255) + "," + f(n & 255) + ")"; };

  // The city is the same every run so you can learn it. Each block: a park, or 1/2/4 buildings.
  const CITY = [];
  for (let k = 0; k < N; k++) for (let l = 0; l < N; l++) {
    const x = R + k * P, y = R + l * P, h = hh(k, l), b = { x, y, park: h < 0.14, bl: [] }, I = SW + 3, S = B - 2 * I;
    const add = (bx, by, bw, bh, i) => b.bl.push({ x: bx, y: by, w: bw, h: bh, ht: 16 + hh(k * 7 + i, l * 13 + i) * 54, col: PAL[Math.floor(hh(k + i * 3, l * 5 + i) * PAL.length)] });
    if (b.park) for (let i = 0; i < 5; i++) b.bl.push({ tree: 1, x: x + 30 + hh(k + i, l * 3) * (B - 60), y: y + 30 + hh(k * 3, l + i) * (B - 60) });
    else if (h < 0.4) add(x + I, y + I, S, S, 0);
    else if (h < 0.58) { add(x + I, y + I, S / 2 - 3, S, 0); add(x + I + S / 2 + 3, y + I, S / 2 - 3, S, 1); }
    else if (h < 0.76) { add(x + I, y + I, S, S / 2 - 3, 0); add(x + I, y + I + S / 2 + 3, S, S / 2 - 3, 1); }
    else for (let i = 0; i < 4; i++) add(x + I + (i % 2) * (S / 2 + 3), y + I + (i >> 1) * (S / 2 + 3), S / 2 - 3, S / 2 - 3, i);
    CITY.push(b);
  }
  // A curb spot: where the rider stands (x, y) and where the cab stops on the road beside them (zx, zy).
  function spot(k, l, side, t) {
    const x = R + k * P, y = R + l * P, a = t * B;
    return side === 0 ? { x: x + a, y: y + 5, zx: x + a, zy: y - 20, k, l } : side === 1 ? { x: x + B - 5, y: y + a, zx: x + B + 20, zy: y + a, k, l }
      : side === 2 ? { x: x + a, y: y + B - 5, zx: x + a, zy: y + B + 20, k, l } : { x: x + 5, y: y + a, zx: x - 20, zy: y + a, k, l };
  }
  const rspot = () => spot(Math.floor(Math.random() * N), Math.floor(Math.random() * N), Math.floor(Math.random() * 4), 0.2 + Math.random() * 0.6);
  const lv = (s, k) => s.up[k] || 0;
  const pop = (s, txt, col) => s.pops.push({ txt, col: col || "#fff", t: 1.6 });

  function addRider(s) {
    for (let n = 0; n < 40; n++) {
      const a = rspot(); if (hyp(a.x - s.car.x, a.y - s.car.y) < 200 || s.wait.some(w => hyp(w.x - a.x, w.y - a.y) < 120)) continue;
      const d = rspot(), blocks = Math.abs(d.k - a.k) + Math.abs(d.l - a.l); if (blocks < 2 || blocks > 2 + s.day) continue;
      const dist = Math.abs(d.zx - a.zx) + Math.abs(d.zy - a.zy), vip = Math.random() < 0.12;
      s.wait.push({ x: a.x, y: a.y, zx: a.zx, zy: a.zy, dest: d, vip, fare: Math.round((6 + dist / 45) * (vip ? 2 : 1)), limit: dist / (vip ? 135 : 110) + 7, em: FOLK[Math.floor(Math.random() * FOLK.length)] });
      return;
    }
  }
  function addTraffic(s) {
    const i = Math.floor(Math.random() * (N + 1)), j = Math.floor(Math.random() * (N + 1)), t = { i, j, d: 0, p: Math.random(), v: 0, top: 70 + Math.random() * 40, col: CARC[Math.floor(Math.random() * CARC.length)], x: 0, y: 0, a: 0 };
    turn(t, true); place(t, 1); if (hyp(t.x - s.car.x, t.y - s.car.y) > 160) s.cars.push(t);
  }
  function turn(t, any) { // pick the next street at a corner: mostly straight, never a U-turn unless it's a dead end
    const ok = []; for (let d = 0; d < 4; d++) { const ni = t.i + DIR[d][0], nj = t.j + DIR[d][1]; if (ni < 0 || nj < 0 || ni > N || nj > N || (!any && d === (t.d + 2) % 4)) continue; ok.push(d); if (d === t.d) ok.push(d, d); }
    t.d = ok.length ? ok[Math.floor(Math.random() * ok.length)] : (t.d + 2) % 4;
  }
  function place(t, k) { // lane position for its spot along the street (drives on the right)
    const dx = DIR[t.d][0], dy = DIR[t.d][1], x = (t.i + dx * t.p) * P + R / 2 - dy * R / 4, y = (t.j + dy * t.p) * P + R / 2 + dx * R / 4;
    t.x += (x - t.x) * k; t.y += (y - t.y) * k;
    let da = Math.atan2(dy, dx) - t.a; da = Math.atan2(Math.sin(da), Math.cos(da)); t.a += da * k;
  }
  function crash(G, s, big) {
    if (s.hitT > 0) return; s.hitT = 0.8; s.shake = 0.3; G.buzz(); G.sfx("lose");
    s.riders.forEach(r => r.bumps++);
    if (big) { s.clock = Math.max(0, s.clock - 2); pop(s, "CRASH! -2s", "#f87171"); }
  }
  function startDay(G) {
    const s = G.s; s.day++; s.mode = "ready"; s.mt = 1.6; s.clock = s.len = 75 + 8 * lv(s, "shift"); s.dayCash = 0; s.dayFares = 0;
    s.riders = []; s.wait = []; s.cars = []; s.zt = 0; s.zone = null;
    while (s.wait.length < 4 + s.day) addRider(s);
    for (let n = 0; n < 200 && s.cars.length < 7 + 2 * s.day; n++) addTraffic(s);
  }
  function drive(G, dt) {
    const s = G.s, car = s.car, k = s.keys;
    s.clock -= dt; s.hitT -= dt;
    if (s.clock <= 0) {
      s.clock = 0; G.sfx("pass");
      if (s.day >= DAYS) return G.over(s.total, s.total >= 1500 ? "Cab legend!" : s.total >= 800 ? "Big tipper week!" : "Meter's off. Go again!");
      s.mode = "shop"; return;
    }
    // input
    const auto = !s.kb && (TOUCH || s.ptr);
    const L = k.l || s.tL || s.ptr < 0, Rt = k.r || s.tR || s.ptr > 0;
    let gas = auto ? (s.tL && s.tR ? -1 : 1) : k.u ? 1 : k.d ? -1 : 0, steer = (Rt ? 1 : 0) - (L ? 1 : 0); if (auto && s.tL && s.tR) steer = 0;
    // stop zones: pull up next to a rider (if there's a seat) or a rider's pin and the cab stops by itself
    let zone = null;
    if (s.riders.length < 1 + lv(s, "seats")) s.wait.forEach(w => { if (!zone && hyp(w.zx - car.x, w.zy - car.y) < ZR) zone = w; });
    s.riders.forEach(r => { if (hyp(r.dest.zx - car.x, r.dest.zy - car.y) < ZR) zone = r; });
    const hx = Math.cos(car.a), hy = Math.sin(car.a);
    let f = car.vx * hx + car.vy * hy, l = -car.vx * hy + car.vy * hx;
    if (zone) {
      gas = 0; f -= f * Math.min(1, dt * 7);
      if (Math.abs(f) < 30) { s.zt += dt; if (s.zt > 0.4) { s.zt = 0; stop(G, s, zone); } }
    } else s.zt = 0;
    const grass = onGrass(car.x, car.y), top = (215 + 28 * lv(s, "engine")) * (grass ? 0.55 : 1) * (steer ? 0.62 : 1); // eases off in turns so corners fit
    if (gas > 0) f += (210 + 25 * lv(s, "engine")) * dt; else if (gas < 0) f -= (f > 0 ? 430 : 170) * dt; else f -= f * Math.min(1, dt * 0.8);
    f = clamp(f, -90, Math.max(top, f - 420 * dt));
    l -= l * Math.min(1, (4.5 + 1.6 * lv(s, "tires")) * dt);
    car.vx = hx * f - hy * l; car.vy = hy * f + hx * l; // rebuilt on the old heading, so turning leaves a little slide
    car.a += steer * (3 + 0.25 * lv(s, "tires")) * dt * (gas > 0 && f >= 0 ? Math.max(0.35, Math.min(1, f / 90)) : clamp(f / 90, -1, 1)); // still pivots when nosed into a wall
    car.x += car.vx * dt; car.y += car.vy * dt;
    // buildings (parks are open: slower, but a shortcut)
    const bk = Math.floor((car.x - R) / P), bl = Math.floor((car.y - R) / P), rad = 10;
    for (let a = bk - 1; a <= bk + 1; a++) for (let b = bl - 1; b <= bl + 1; b++) {
      if (a < 0 || b < 0 || a >= N || b >= N || CITY[a * N + b].park) continue;
      const rx = R + a * P + SW, ry = R + b * P + SW, rw = B - 2 * SW, cx = clamp(car.x, rx, rx + rw), cy = clamp(car.y, ry, ry + rw);
      let dx = car.x - cx, dy = car.y - cy; const d = hyp(dx, dy);
      if (d >= rad) continue;
      if (d === 0) { dx = car.x - (rx + rw / 2); dy = car.y - (ry + rw / 2); if (Math.abs(dx) > Math.abs(dy)) { car.x = dx > 0 ? rx + rw + rad : rx - rad; } else car.y = dy > 0 ? ry + rw + rad : ry - rad; car.vx *= -0.3; car.vy *= -0.3; continue; }
      const nx = dx / d, ny = dy / d, vn = car.vx * nx + car.vy * ny; car.x = cx + nx * rad; car.y = cy + ny * rad;
      if (vn < 0) { car.vx -= 1.4 * vn * nx; car.vy -= 1.4 * vn * ny; if (vn < -140) crash(G, s, false); }
    }
    if (car.x < rad || car.x > WORLD - rad) { car.x = clamp(car.x, rad, WORLD - rad); car.vx *= -0.4; }
    if (car.y < rad || car.y > WORLD - rad) { car.y = clamp(car.y, rad, WORLD - rad); car.vy *= -0.4; }
    // traffic
    s.cars.forEach(t => {
      const dx = DIR[t.d][0], dy = DIR[t.d][1];
      let blocked = false;
      const ahead = (ox, oy) => { const ax = ox - t.x, ay = oy - t.y, fw = ax * dx + ay * dy; return fw > 4 && fw < 46 && Math.abs(-ax * dy + ay * dx) < 14; };
      if (ahead(car.x, car.y)) blocked = true; else for (const o of s.cars) if (o !== t && ahead(o.x, o.y)) { blocked = true; break; }
      t.v += ((blocked ? 0 : t.top) - t.v) * Math.min(1, dt * 4);
      t.p += t.v * dt / P;
      if (t.p >= 1) { t.p -= 1; t.i += dx; t.j += dy; turn(t); }
      place(t, Math.min(1, dt * 7));
      const cx = car.x - t.x, cy = car.y - t.y, d = hyp(cx, cy) || 1;
      if (d < 20) { car.x = t.x + cx / d * 20; car.y = t.y + cy / d * 20; const sp = hyp(car.vx, car.vy); car.vx = cx / d * Math.max(60, sp * 0.4); car.vy = cy / d * Math.max(60, sp * 0.4); t.v = 0; crash(G, s, true); }
    });
    // riders on board
    for (let i = s.riders.length - 1; i >= 0; i--) { const r = s.riders[i]; r.t -= dt; if (r.t <= 0) { s.riders.splice(i, 1); pop(s, "TOO SLOW! " + r.em + " WALKED", "#f87171"); G.buzz(); } }
    while (s.wait.length < 4 + s.day) addRider(s);
  }
  function onGrass(x, y) { const k = Math.floor((x - R) / P), l = Math.floor((y - R) / P); if (k < 0 || l < 0 || k >= N || l >= N || !CITY[k * N + l].park) return false; const lx = x - R - k * P, ly = y - R - l * P; return lx > SW && ly > SW && lx < B - SW && ly < B - SW; }
  function stop(G, s, z) {
    const wi = s.wait.indexOf(z);
    if (wi >= 0) { // pickup
      s.wait.splice(wi, 1);
      const col = SEAT.find(c => !s.riders.some(r => r.col === c));
      s.riders.push({ dest: z.dest, fare: z.fare, limit: z.limit, t: z.limit, em: z.em, vip: z.vip, bumps: 0, col });
      pop(s, (z.vip ? "VIP! " : "") + "FARE $" + z.fare, z.vip ? "#fde047" : "#fff"); G.sfx("pop");
    } else { // drop-off
      s.riders.splice(s.riders.indexOf(z), 1);
      const tip = Math.round(z.fare * 0.6 * Math.max(0, z.t / z.limit) * Math.max(0, 1 - 0.25 * z.bumps)), pay = Math.round((z.fare + tip) * (1 + 0.15 * lv(s, "meter")));
      s.cash += pay; s.total += pay; s.dayCash += pay; s.dayFares++;
      pop(s, "+$" + pay + (tip > z.fare * 0.35 ? " GREAT TIP!" : ""), "#4ade80"); G.sfx("win");
    }
  }
  function buy(G, s, i) {
    const u = UPS[i], n = lv(s, u.k), cost = u.cost[n];
    if (cost === undefined || s.cash < cost) { G.buzz(); return; }
    s.cash -= cost; s.up[u.k] = n + 1; G.sfx("pop");
  }

  // ---- drawing: world -> screen, turned so the cab points up; `h` lifts a point toward the camera ----
  const pt = (s, x, y, h) => { const dx = x - s.car.x, dy = y - s.car.y, k = s.z * (1 + (h || 0) * 0.0045); return [s.ax + (dx * s.cs - dy * s.sn) * k, s.ay + (dx * s.sn + dy * s.cs) * k]; };
  function poly(c, pts, col) { c.fillStyle = col; c.beginPath(); c.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) c.lineTo(pts[i][0], pts[i][1]); c.closePath(); c.fill(); }
  const rect = (c, s, x, y, w, h, ht, col) => poly(c, [pt(s, x, y, ht), pt(s, x + w, y, ht), pt(s, x + w, y + h, ht), pt(s, x, y + h, ht)], col);
  function carShape(c, s, x, y, a, col, taxi) {
    const hx = Math.cos(a), hy = Math.sin(a), box = (x0, x1, w, h, cl) => poly(c, [[x0, -w], [x1, -w], [x1, w], [x0, w]].map(p => pt(s, x + hx * p[0] - hy * p[1], y + hy * p[0] + hx * p[1], h)), cl);
    box(-15, 15, 9, 0, "rgba(0,0,0,0.3)"); box(-14, 14, 7.5, 3, col); box(-8, 6, 6.5, 8, "#1f2937"); box(-6, 3, 5.5, 10, shade(col, 1.12));
    box(13, 14.5, 6, 3, "#fef9c3"); box(-14.5, -13, 6, 3, "#dc2626");
    if (taxi) { box(-3, 0, 3, 13, "#fff"); box(-14, 14, 1.2, 3.4, "#111"); }
  }
  function arrow(c, s, tx, ty, col, big) {
    const p = pt(s, tx, ty), dx = p[0] - s.ax, dy = p[1] - s.ay, d = hyp(dx, dy); if (d < 70) return;
    const a = Math.atan2(dy, dx), r = Math.min(d - 20, big ? 64 : 52), x = s.ax + Math.cos(a) * r, y = s.ay + Math.sin(a) * r, z = big ? 13 : 9;
    c.save(); c.translate(x, y); c.rotate(a); c.fillStyle = "rgba(0,0,0,0.5)"; c.beginPath(); c.moveTo(z + 3, 0); c.lineTo(-z, -z - 2); c.lineTo(-z + 4, 0); c.lineTo(-z, z + 2); c.fill();
    c.fillStyle = col; c.beginPath(); c.moveTo(z, 0); c.lineTo(-z + 2, -z + 1); c.lineTo(-z + 5, 0); c.lineTo(-z + 2, z - 1); c.fill(); c.restore();
  }

  defGame({
    key: "cab", name: "Cab Dawg", icon: "🚕", max: 99999,
    blurb: "Pick up riders, beat their clock, upgrade the cab.",
    how: "You drive a cab around the city for 5 days. Hold the left or right side of the screen to steer. The gas is automatic, and holding both sides brakes and backs up (on a keyboard: up arrow or W for gas, left and right to steer, down to brake). Pull up next to a waving rider and the cab stops to let them in. The matching arrow points to their pin: get there before their timer runs out or they walk. Faster rides tip better, and bumps cost you the tip. Hitting traffic costs 2 seconds. Gold riders are VIPs: double fare, tighter clock. Parks are a slow shortcut. When the day's clock runs out, spend what you made on more seats, a faster engine, grippier tires, a longer shift or a better meter. Your score is every dollar you earn Monday to Friday.",
    reset(G) {
      const s = G.s = { day: 0, cash: 0, total: 0, up: {}, keys: {}, tL: 0, tR: 0, ptr: 0, kb: false, pops: [], shake: 0, hitT: 0, btns: [], car: { x: R / 2 + R / 4, y: 3 * P + R / 2, a: Math.PI / 2, vx: 0, vy: 0 }, ca: Math.PI / 2 };
      startDay(G); this.hook();
    },
    hook() {
      if (window._cabT) return; window._cabT = 1;
      const w = $("gwrap"); if (!w) return;
      const f = e => {
        if (G.key !== "cab" || G.state !== "play" || !G.s || !G.s.car) return;
        const r = w.getBoundingClientRect(), s = G.s; s.tL = s.tR = 0;
        for (let i = 0; i < e.touches.length; i++) { if (e.touches[i].clientX - r.left < G.W / 2) s.tL = 1; else s.tR = 1; }
      };
      ["touchstart", "touchmove", "touchend", "touchcancel"].forEach(n => w.addEventListener(n, f, { passive: true }));
    },
    down(G, x) { if (!TOUCH) G.s.ptr = x < G.W / 2 ? -1 : 1; },
    move(G, x) { if (!TOUCH && G.s.ptr) G.s.ptr = x < G.W / 2 ? -1 : 1; },
    up(G) { G.s.ptr = 0; },
    tap(G, x, y) { const s = G.s; if (s.mode !== "shop") return; const b = s.btns.find(b => x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h); if (!b) return; if (b.i < 0) startDay(G); else buy(G, s, b.i); },
    onKey(G, k, isDown) {
      const s = G.s, m = { ArrowLeft: "l", a: "l", ArrowRight: "r", d: "r", ArrowUp: "u", w: "u", ArrowDown: "d", s: "d" }[k];
      if (m) { s.keys[m] = isDown; s.kb = true; return; }
      if (!isDown || s.mode !== "shop") return;
      if (k === " " || k === "Enter") startDay(G); else if (k >= "1" && k <= "5") buy(G, s, +k - 1);
    },
    update(G, dt) {
      const s = G.s;
      s.shake = Math.max(0, s.shake - dt); s.pops.forEach(o => o.t -= dt); s.pops = s.pops.filter(o => o.t > 0);
      let da = s.car.a - s.ca; da = Math.atan2(Math.sin(da), Math.cos(da)); s.ca += da * Math.min(1, dt * 5);
      if (s.mode === "ready") { s.mt -= dt; if (s.mt <= 0) s.mode = "drive"; }
      else if (s.mode === "drive") drive(G, dt);
    },
    draw(G, c) {
      const s = G.s, W = G.W, H = G.H, car = s.car, th = -Math.PI / 2 - s.ca;
      s.cs = Math.cos(th); s.sn = Math.sin(th); s.z = clamp(W / 340, 0.9, 1.4);
      s.ax = W / 2 + (s.shake > 0 ? (Math.random() - 0.5) * 30 * s.shake : 0); s.ay = H * 0.64 + (s.shake > 0 ? (Math.random() - 0.5) * 30 * s.shake : 0);
      c.fillStyle = "#38a3d1"; c.fillRect(0, 0, W, H);
      rect(c, s, -14, -14, WORLD + 28, WORLD + 28, 0, "#d6c9a8"); rect(c, s, 0, 0, WORLD, WORLD, 0, "#4b5563");
      c.strokeStyle = "rgba(255,255,255,0.45)"; c.lineWidth = 2 * s.z; c.setLineDash([10 * s.z, 12 * s.z]); c.beginPath();
      for (let k = 0; k <= N; k++) { const m = k * P + R / 2; let a = pt(s, m, 0), b = pt(s, m, WORLD); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); a = pt(s, 0, m); b = pt(s, WORLD, m); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); }
      c.stroke(); c.setLineDash([]);
      const far = (Math.max(W, H) * 0.8) / s.z + B, near = CITY.filter(b => hyp(b.x + B / 2 - car.x, b.y + B / 2 - car.y) < far);
      near.forEach(b => { rect(c, s, b.x, b.y, B, B, 0, "#cbd5e1"); rect(c, s, b.x + SW, b.y + SW, B - 2 * SW, B - 2 * SW, 0, b.park ? "#6cc04a" : "#9ca3af"); });
      // stop rings
      const ring = (x, y, col) => { const p = pt(s, x, y), r = (ZR - 12 + Math.sin(G.t * 5) * 3) * s.z; c.strokeStyle = col; c.lineWidth = 4; c.globalAlpha = 0.85; c.beginPath(); c.arc(p[0], p[1], r, 0, 7); c.stroke(); c.globalAlpha = 0.2; c.fillStyle = col; c.fill(); c.globalAlpha = 1; };
      const room = s.riders.length < 1 + lv(s, "seats");
      if (room) s.wait.forEach(w => ring(w.zx, w.zy, w.vip ? "#fde047" : "#ffffff"));
      s.riders.forEach(r => ring(r.dest.zx, r.dest.zy, r.col));
      s.cars.forEach(t => { if (hyp(t.x - car.x, t.y - car.y) < far) carShape(c, s, t.x, t.y, t.a, t.col); });
      carShape(c, s, car.x, car.y, car.a, "#facc15", true);
      // buildings, far ones first
      const bs = []; near.forEach(b => b.bl.forEach(o => bs.push(o)));
      bs.sort((a, b) => hyp(b.x + (b.w || 0) / 2 - car.x, b.y + (b.h || 0) / 2 - car.y) - hyp(a.x + (a.w || 0) / 2 - car.x, a.y + (a.h || 0) / 2 - car.y));
      bs.forEach(o => {
        if (o.tree) { const a = pt(s, o.x, o.y, 0), b = pt(s, o.x, o.y, 22); c.strokeStyle = "#7c5a3a"; c.lineWidth = 4 * s.z; c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); c.stroke(); c.fillStyle = "#2f8f46"; c.beginPath(); c.arc(b[0], b[1], 13 * s.z, 0, 7); c.fill(); c.fillStyle = "#46b05f"; c.beginPath(); c.arc(b[0] - 3, b[1] - 3, 7 * s.z, 0, 7); c.fill(); return; }
        const g = [[o.x, o.y], [o.x + o.w, o.y], [o.x + o.w, o.y + o.h], [o.x, o.y + o.h]], lo = g.map(p => pt(s, p[0], p[1], 0)), hi = g.map(p => pt(s, p[0], p[1], o.ht));
        for (let i = 0; i < 4; i++) { const j = (i + 1) % 4; poly(c, [lo[i], lo[j], hi[j], hi[i]], shade(o.col, i % 2 ? 0.62 : 0.76)); }
        poly(c, hi, o.col); const m = 6; rect(c, s, o.x + m, o.y + m, o.w - 2 * m, o.h - 2 * m, o.ht + 3, shade(o.col, 1.1));
      });
      // people and pins on top so you can always find them
      c.fillStyle = "#000";
      s.wait.forEach(w => { const p = pt(s, w.x, w.y, 4); if (w.vip) { c.fillStyle = "#fde047"; c.beginPath(); c.arc(p[0], p[1], 12 * s.z, 0, 7); c.fill(); c.fillStyle = "#000"; } G.emoji(c, w.em, p[0], p[1] - Math.abs(Math.sin(G.t * 4 + w.x)) * 4, 20 * s.z); });
      s.riders.forEach(r => { const p = pt(s, r.dest.zx, r.dest.zy, 0), y = p[1] - 16 - Math.abs(Math.sin(G.t * 4)) * 6; c.fillStyle = r.col; c.beginPath(); c.arc(p[0], y - 8, 13, 0, 7); c.moveTo(p[0] - 9, y); c.lineTo(p[0], y + 16); c.lineTo(p[0] + 9, y); c.fill(); c.fillStyle = "#000"; G.emoji(c, r.em, p[0], y - 8, 16); });
      G.img(c, ":dawgW:", s.ax, s.ay, 15 * s.z);
      // arrows: one per rider, plus a white one to the nearest pickup when there's a free seat
      if (s.mode !== "shop") {
        if (room) { let b = null, bd = 1e9; s.wait.forEach(w => { const d = hyp(w.zx - car.x, w.zy - car.y); if (d < bd) { bd = d; b = w; } }); if (b) arrow(c, s, b.zx, b.zy, b.vip ? "#fde047" : "#ffffff", !s.riders.length); }
        s.riders.forEach(r => arrow(c, s, r.dest.zx, r.dest.zy, r.col, true));
      }
      // top bar, seats, map
      const low = s.clock < 10 && s.mode === "drive";
      G.hud(c, "$" + s.cash, "DAY " + s.day + "/" + DAYS, "0:" + String(Math.ceil(s.clock)).padStart(2, "0"));
      if (low && Math.floor(G.t * 4) % 2) G.text(c, "0:" + String(Math.ceil(s.clock)).padStart(2, "0"), W - 10, 17, Math.max(10, Math.min(13, W / 30)), "#f87171", "right");
      for (let i = 0; i <= lv(s, "seats"); i++) {
        const r = s.riders[i], x = 8, y = 42 + i * 30, w = 92;
        c.fillStyle = r ? "rgba(10,10,20,0.7)" : "rgba(10,10,20,0.35)"; c.fillRect(x, y, w, 25);
        if (!r) { G.text(c, "EMPTY", x + w / 2, y + 13, 8, "rgba(255,255,255,0.6)"); continue; }
        c.fillStyle = r.col; c.fillRect(x, y, 4, 25); c.fillStyle = "#000"; G.emoji(c, r.em, x + 17, y + 13, 15);
        G.text(c, "$" + r.fare, x + 30, y + 9, 8, "#fff", "left");
        c.fillStyle = "rgba(255,255,255,0.2)"; c.fillRect(x + 30, y + 16, w - 36, 5); c.fillStyle = r.t / r.limit < 0.3 ? "#f87171" : r.col; c.fillRect(x + 30, y + 16, (w - 36) * clamp(r.t / r.limit, 0, 1), 5);
      }
      const M = 76, mx = W - M - 8, my = 42, q = M / WORLD;
      c.fillStyle = "rgba(10,10,20,0.6)"; c.fillRect(mx - 3, my - 3, M + 6, M + 6); c.fillStyle = "rgba(255,255,255,0.22)";
      CITY.forEach(b => c.fillRect(mx + b.x * q, my + b.y * q, B * q, B * q));
      if (room) s.wait.forEach(w => { c.fillStyle = w.vip ? "#fde047" : "#fff"; c.fillRect(mx + w.zx * q - 2, my + w.zy * q - 2, 4, 4); });
      s.riders.forEach(r => { c.fillStyle = r.col; c.beginPath(); c.arc(mx + r.dest.zx * q, my + r.dest.zy * q, 4, 0, 7); c.fill(); });
      c.save(); c.translate(mx + car.x * q, my + car.y * q); c.rotate(car.a); c.fillStyle = "#facc15"; c.beginPath(); c.moveTo(6, 0); c.lineTo(-4, -4); c.lineTo(-4, 4); c.fill(); c.restore();
      s.pops.forEach((o, i) => { c.globalAlpha = Math.min(1, o.t * 2); const y = H * 0.3 - (s.pops.length - 1 - i) * 22 - (1.6 - o.t) * 10; G.text(c, o.txt, W / 2 + 1, y + 1, 11, "#000"); G.text(c, o.txt, W / 2, y, 11, o.col); }); c.globalAlpha = 1;
      if (s.mode === "ready") { G.banner(c, DAYN[s.day - 1], "#ffd23f", H * 0.36); G.text(c, "DAY " + s.day + " OF " + DAYS, W / 2, H * 0.36 + 34, 11, "#fff"); }
      if (s.mode === "drive" && s.day === 1) G.hint(c, s.kb || !TOUCH ? "UP = GAS   LEFT / RIGHT = STEER" : "HOLD LEFT / RIGHT TO STEER", 6);
      if (s.mode === "shop") this.shop(G, c);
    },
    shop(G, c) {
      const s = G.s, W = G.W, H = G.H, pw = Math.min(W - 20, 360), x = (W - pw) / 2, rh = Math.min(52, (H - 230) / 5); let y = Math.max(40, (H - (150 + rh * 5)) / 2);
      c.fillStyle = "rgba(10,10,25,0.88)"; c.fillRect(0, 34, W, H - 34);
      G.text(c, DAYN[s.day - 1] + " DONE", W / 2, y + 12, 14, "#ffd23f");
      G.text(c, s.dayFares + " FARES   +$" + s.dayCash, W / 2, y + 38, 10, "#fff");
      G.text(c, "BANK $" + s.cash, W / 2, y + 62, 12, "#4ade80"); y += 84; s.btns = [];
      UPS.forEach((u, i) => {
        const n = lv(s, u.k), cost = u.cost[n], ok = cost !== undefined && s.cash >= cost, ry = y + i * rh;
        c.fillStyle = "rgba(255,255,255,0.08)"; c.fillRect(x, ry, pw, rh - 6);
        G.text(c, u.name, x + 10, ry + rh * 0.3, 9, "#fff", "left");
        c.font = "12px system-ui, sans-serif"; c.fillStyle = "rgba(255,255,255,0.65)"; c.textAlign = "left"; c.fillText(u.sub, x + 10, ry + rh * 0.62);
        for (let j = 0; j < u.cost.length; j++) { c.fillStyle = j < n ? "#facc15" : "rgba(255,255,255,0.2)"; c.fillRect(x + pw - 78 - (u.cost.length - j) * 9, ry + rh * 0.22, 6, 6); }
        const bw = 68, bx = x + pw - bw - 6, by = ry + 5, bh = rh - 16;
        c.fillStyle = cost === undefined ? "rgba(255,255,255,0.12)" : ok ? "#22c55e" : "rgba(255,255,255,0.18)"; c.fillRect(bx, by, bw, bh);
        G.text(c, cost === undefined ? "MAX" : "$" + cost, bx + bw / 2, by + bh / 2, 9, ok || cost === undefined ? "#fff" : "rgba(255,255,255,0.5)");
        s.btns.push({ x, y: ry, w: pw, h: rh - 6, i });
      });
      const by = y + 5 * rh + 8; c.fillStyle = "#facc15"; c.fillRect(x, by, pw, 46); G.text(c, "START " + DAYN[s.day], W / 2, by + 23, 12, "#111");
      s.btns.push({ x, y: by, w: pw, h: 46, i: -1 });
    },
    _t: { CITY, spot, N, P, R, WORLD }
  });
})();
