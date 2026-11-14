// ---------- Mad Dawg (side-view physics car levels, Drive Mad-style) ----------
// Hold the right half to drive (gas), the left half to brake / reverse. In the air, gas tips the nose up and brake tips it down.
// Get the car to the checkered flag. If the Big Dawg's head (or a closed car's roof) touches anything, or the car falls in a pit,
// the level restarts. Levels unlock one by one (☰ = level list, ↻ = restart). Each car is different.
// Score = career total: every level you've beaten counts once, 1000 + up to 500 for speed (your best time per level).
// Physics is a small hand-written rigid-body engine (boxes/polygons/circles, sequential impulses with warm starting,
// pin / wheel-suspension / rope joints). World units are meters, y points UP. Levels are built from a short op list (see LEVELS).
(function () {
  const TOUCH = typeof window !== "undefined" && "ontouchstart" in window;
  const REACT = 0.35; // share of the wheel motor's kick-back that twists the car body (less = fewer wheelies)
  const GRAV = -10, DT = 1 / 120, ITER = 8, SLOP = 0.01, BETA = 0.2, MARGIN = 0.02;

  // ======================= PHYSICS =======================
  let BID = 0;
  function body(kind, x, y, a) { return { id: ++BID, kind, x, y, a: a || 0, vx: 0, vy: 0, w: 0, m: 0, im: 0, I: 0, iI: 0, sh: [], group: 0, noG: false }; }
  function poly(b, v, o) {
    o = o || {}; const n = [];
    for (let i = 0; i < v.length; i++) { const p = v[i], q = v[(i + 1) % v.length], ex = q[0] - p[0], ey = q[1] - p[1], l = Math.hypot(ex, ey) || 1; n.push([ey / l, -ex / l]); }
    const s = { t: 1, v, n, wv: v.map(() => [0, 0]), wn: n.map(() => [0, 0]), f: o.f == null ? 0.7 : o.f, kill: !!o.kill, den: o.den == null ? 1 : o.den, b, bb: [0, 0, 0, 0] };
    s.si = b.sh.length; b.sh.push(s); return s;
  }
  function circ(b, x, y, r, o) { o = o || {}; const s = { t: 0, x, y, r, wx: 0, wy: 0, f: o.f == null ? 0.9 : o.f, kill: !!o.kill, den: o.den == null ? 1 : o.den, b, bb: [0, 0, 0, 0] }; s.si = b.sh.length; b.sh.push(s); return s; }
  const box = (b, hw, hh, cx, cy, o) => poly(b, [[cx - hw, cy - hh], [cx + hw, cy - hh], [cx + hw, cy + hh], [cx - hw, cy + hh]], o);
  function mass(b) {
    if (b.kind !== "dyn") { b.m = b.im = b.I = b.iI = 0; return; }
    let m = 0, I = 0;
    for (const s of b.sh) {
      if (s.t === 0) { const mm = Math.PI * s.r * s.r * s.den; m += mm; I += mm * (s.r * s.r / 2 + s.x * s.x + s.y * s.y); }
      else for (let i = 0; i < s.v.length; i++) {
        const p = s.v[i], q = s.v[(i + 1) % s.v.length], cr = (p[0] * q[1] - p[1] * q[0]) / 2;
        m += cr * s.den; I += cr * s.den * (p[0] * p[0] + p[1] * p[1] + p[0] * q[0] + p[1] * q[1] + q[0] * q[0] + q[1] * q[1]) / 6;
      }
    }
    b.m = m; b.im = m > 0 ? 1 / m : 0; b.I = I; b.iI = I > 0 ? 1 / I : 0;
  }
  function xform(b) {
    const c = Math.cos(b.a), sn = Math.sin(b.a);
    for (const s of b.sh) {
      const bb = s.bb;
      if (s.t === 0) { s.wx = b.x + c * s.x - sn * s.y; s.wy = b.y + sn * s.x + c * s.y; bb[0] = s.wx - s.r; bb[1] = s.wy - s.r; bb[2] = s.wx + s.r; bb[3] = s.wy + s.r; continue; }
      bb[0] = bb[1] = 1e9; bb[2] = bb[3] = -1e9;
      for (let i = 0; i < s.v.length; i++) {
        const p = s.v[i], w = s.wv[i], nn = s.n[i], wn = s.wn[i];
        w[0] = b.x + c * p[0] - sn * p[1]; w[1] = b.y + sn * p[0] + c * p[1];
        wn[0] = c * nn[0] - sn * nn[1]; wn[1] = sn * nn[0] + c * nn[1];
        if (w[0] < bb[0]) bb[0] = w[0]; if (w[0] > bb[2]) bb[2] = w[0]; if (w[1] < bb[1]) bb[1] = w[1]; if (w[1] > bb[3]) bb[3] = w[1];
      }
    }
  }
  const ovl = (a, b) => a[0] <= b[2] + MARGIN && b[0] <= a[2] + MARGIN && a[1] <= b[3] + MARGIN && b[1] <= a[3] + MARGIN;

  // --- narrow phase. Each returns contacts [px, py, nx, ny, sep, id] with the normal pointing from shape A to shape B ---
  function cc(A, B, out) {
    const dx = B.wx - A.wx, dy = B.wy - A.wy, d = Math.hypot(dx, dy), sep = d - A.r - B.r; if (sep > MARGIN) return;
    const nx = d > 1e-9 ? dx / d : 0, ny = d > 1e-9 ? dy / d : 1;
    out.push([A.wx + nx * A.r, A.wy + ny * A.r, nx, ny, sep, 0]);
  }
  function pc(A, B, out, flip) { // polygon A, circle B
    const v = A.wv, n = A.wn, cx = B.wx, cy = B.wy, r = B.r; let best = -1e9, bi = 0;
    for (let i = 0; i < v.length; i++) { const s = n[i][0] * (cx - v[i][0]) + n[i][1] * (cy - v[i][1]); if (s > r + MARGIN) return; if (s > best) { best = s; bi = i; } }
    const v1 = v[bi], v2 = v[(bi + 1) % v.length];
    let nx = n[bi][0], ny = n[bi][1], sep = best - r;
    if (best > 1e-6) {
      const u1 = (cx - v1[0]) * (v2[0] - v1[0]) + (cy - v1[1]) * (v2[1] - v1[1]), u2 = (cx - v2[0]) * (v1[0] - v2[0]) + (cy - v2[1]) * (v1[1] - v2[1]);
      const cn = u1 <= 0 ? v1 : u2 <= 0 ? v2 : null;
      if (cn) { const dx = cx - cn[0], dy = cy - cn[1], d = Math.hypot(dx, dy); if (d - r > MARGIN) return; nx = dx / (d || 1); ny = dy / (d || 1); sep = d - r; }
    }
    const px = cx - nx * r, py = cy - ny * r;
    out.push(flip ? [px, py, -nx, -ny, sep, 1] : [px, py, nx, ny, sep, 1]);
  }
  function maxSep(P, Q) {
    let best = -1e9, bi = 0;
    for (let i = 0; i < P.wv.length; i++) {
      const nx = P.wn[i][0], ny = P.wn[i][1], vx = P.wv[i][0], vy = P.wv[i][1]; let mn = 1e9;
      for (const q of Q.wv) { const d = nx * (q[0] - vx) + ny * (q[1] - vy); if (d < mn) mn = d; }
      if (mn > best) { best = mn; bi = i; }
    }
    return [best, bi];
  }
  function pp(A, B, out) {
    const [sa, ea] = maxSep(A, B); if (sa > MARGIN) return;
    const [sb, eb] = maxSep(B, A); if (sb > MARGIN) return;
    let R, I, e, flip;
    if (sb > sa * 0.98 + 0.001) { R = B; I = A; e = eb; flip = 1; } else { R = A; I = B; e = ea; flip = 0; }
    const n1x = R.wn[e][0], n1y = R.wn[e][1]; let mi = 1e9, ie = 0;
    for (let i = 0; i < I.wn.length; i++) { const d = n1x * I.wn[i][0] + n1y * I.wn[i][1]; if (d < mi) { mi = d; ie = i; } }
    const v11 = R.wv[e], v12 = R.wv[(e + 1) % R.wv.length];
    let tx = v12[0] - v11[0], ty = v12[1] - v11[1]; const tl = Math.hypot(tx, ty) || 1; tx /= tl; ty /= tl;
    let p0 = I.wv[ie], p1 = I.wv[(ie + 1) % I.wv.length];
    let c0 = [p0[0], p0[1]], c1 = [p1[0], p1[1]];
    // clip against the two side planes of the reference edge
    const clip = (nx, ny, off) => {
      const d0 = nx * c0[0] + ny * c0[1] - off, d1 = nx * c1[0] + ny * c1[1] - off;
      if (d0 > 0 && d1 > 0) return false;
      if (d0 > 0) { const t = d0 / (d0 - d1); c0 = [c0[0] + t * (c1[0] - c0[0]), c0[1] + t * (c1[1] - c0[1])]; }
      else if (d1 > 0) { const t = d0 / (d0 - d1); c1 = [c0[0] + t * (c1[0] - c0[0]), c0[1] + t * (c1[1] - c0[1])]; }
      return true;
    };
    if (!clip(-tx, -ty, -(tx * v11[0] + ty * v11[1]))) return;
    if (!clip(tx, ty, tx * v12[0] + ty * v12[1])) return;
    const fo = n1x * v11[0] + n1y * v11[1], nx = flip ? -n1x : n1x, ny = flip ? -n1y : n1y;
    const s0 = n1x * c0[0] + n1y * c0[1] - fo, s1 = n1x * c1[0] + n1y * c1[1] - fo, id = 2 + flip * 1000 + e * 37 + ie * 7;
    if (s0 <= MARGIN) out.push([c0[0], c0[1], nx, ny, s0, id]);
    if (s1 <= MARGIN) out.push([c1[0], c1[1], nx, ny, s1, id + 1]);
  }
  function collide(A, B, out) {
    if (A.t === 0 && B.t === 0) cc(A, B, out);
    else if (A.t === 1 && B.t === 0) pc(A, B, out, 0);
    else if (A.t === 0 && B.t === 1) pc(B, A, out, 1);
    else pp(A, B, out);
  }

  function World() {
    this.bodies = []; this.joints = []; this.arb = new Map(); this.grid = new Map();
    this.ground = body("static", 0, 0); this.ground.id = 0; this.onHit = null; this.carGroup = 1;
  }
  World.prototype.add = function (b) { mass(b); xform(b); this.bodies.push(b); return b; };
  World.prototype.seg = function (ax, ay, bx, by, f) { // static ground segment (two-sided)
    if (Math.hypot(bx - ax, by - ay) < 1e-4) return;
    const s = poly(this.ground, [[ax, ay], [bx, by]], { f: f == null ? 0.9 : f }); s.ground = 1; s.gi = this.ground.sh.length - 1;
    for (let i = 0; i < 2; i++) { s.wv[i][0] = s.v[i][0]; s.wv[i][1] = s.v[i][1]; s.wn[i][0] = s.n[i][0]; s.wn[i][1] = s.n[i][1]; }
    s.bb = [Math.min(ax, bx), Math.min(ay, by), Math.max(ax, bx), Math.max(ay, by)];
    for (let k = Math.floor(s.bb[0] / 4); k <= Math.floor(s.bb[2] / 4); k++) { if (!this.grid.has(k)) this.grid.set(k, []); this.grid.get(k).push(s); }
  };
  // pin joint (anchor given in world coords)
  World.prototype.pin = function (A, B, wx, wy) {
    const la = toLocal(A, wx, wy), lb = toLocal(B, wx, wy);
    const j = { t: "pin", A, B, la, lb, P: [0, 0] }; this.joints.push(j); return j;
  };
  // wheel suspension: chassis A, wheel B; mount = local point on A where the wheel center rests; axis = local unit vector (up)
  World.prototype.wheel = function (A, B, mx, my, hz, zeta, maxT) {
    const j = { t: "wheel", A, B, la: [mx, my], ax: [0, 1], hz, zeta, maxT, speed: 0, motor: false, Pp: 0, Ps: 0, Pm: 0 };
    this.joints.push(j); return j;
  };
  World.prototype.rope = function (A, B, wax, way, wbx, wby) {
    const j = { t: "rope", A, B, la: toLocal(A, wax, way), lb: toLocal(B, wbx, wby), L: Math.hypot(wbx - wax, wby - way), P: 0 };
    this.joints.push(j); return j;
  };
  function toLocal(b, wx, wy) { const c = Math.cos(b.a), s = Math.sin(b.a), dx = wx - b.x, dy = wy - b.y; return [c * dx + s * dy, -s * dx + c * dy]; }
  const rot = (b, l) => { const c = Math.cos(b.a), s = Math.sin(b.a); return [c * l[0] - s * l[1], s * l[0] + c * l[1]]; };

  World.prototype.step = function (dt) {
    const bs = this.bodies, idt = 1 / dt;
    // 1) forces -> velocities
    for (const b of bs) if (b.kind === "dyn") { b.vy += GRAV * dt; b.vx *= 0.9995; b.w *= 0.998; }
    // 2) contacts
    const seen = new Map(), tmp = [];
    const pair = (A, sa, B, sb, key) => {
      tmp.length = 0; collide(sa, sb, tmp); if (!tmp.length) return;
      if (this.onHit) this.onHit(sa, sb, tmp);
      const old = this.arb.get(key), f = Math.sqrt(sa.f * sb.f);
      const cs = tmp.map(c => {
        const o = { px: c[0], py: c[1], nx: c[2], ny: c[3], sep: c[4], id: c[5], Pn: 0, Pt: 0 };
        if (old) for (const q of old.cs) if (q.id === o.id) { o.Pn = q.Pn; o.Pt = q.Pt; break; }
        return o;
      });
      seen.set(key, { A, B, cs, f });
    };
    for (let i = 0; i < bs.length; i++) {
      const A = bs[i];
      if (A.kind === "dyn" && !A.noG) {
        for (const sa of A.sh) {
          const k0 = Math.floor(sa.bb[0] / 4), k1 = Math.floor(sa.bb[2] / 4), done = new Set();
          for (let k = k0; k <= k1; k++) { const L = this.grid.get(k); if (!L) continue; for (const g of L) { if (done.has(g) || !ovl(sa.bb, g.bb)) continue; done.add(g); pair(this.ground, g, A, sa, "g" + A.id + ":" + sa.si + ":" + g.gi); } }
        }
      }
      for (let j = i + 1; j < bs.length; j++) {
        const B = bs[j];
        if (A.kind !== "dyn" && B.kind !== "dyn") continue;
        if (A.group && A.group === B.group) continue;
        for (let p = 0; p < A.sh.length; p++) { const sa = A.sh[p]; for (let q = 0; q < B.sh.length; q++) { const sb = B.sh[q]; if (ovl(sa.bb, sb.bb)) pair(A, sa, B, sb, A.id + ":" + p + ":" + B.id + ":" + q); } }
      }
    }
    this.arb = seen;
    // 3) prestep
    for (const ar of seen.values()) {
      const A = ar.A, B = ar.B;
      for (const c of ar.cs) {
        const rax = c.px - A.x, ray = c.py - A.y, rbx = c.px - B.x, rby = c.py - B.y;
        const rna = rax * c.ny - ray * c.nx, rnb = rbx * c.ny - rby * c.nx, tx = c.ny, ty = -c.nx;
        const rta = rax * ty - ray * tx, rtb = rbx * ty - rby * tx;
        c.rax = rax; c.ray = ray; c.rbx = rbx; c.rby = rby;
        c.mn = 1 / (A.im + B.im + A.iI * rna * rna + B.iI * rnb * rnb || 1e9);
        c.mt = 1 / (A.im + B.im + A.iI * rta * rta + B.iI * rtb * rtb || 1e9);
        c.bias = c.sep > 0 ? -c.sep * idt : -BETA * idt * Math.min(0, c.sep + SLOP);
        const Px = c.Pn * c.nx + c.Pt * tx, Py = c.Pn * c.ny + c.Pt * ty;
        A.vx -= A.im * Px; A.vy -= A.im * Py; A.w -= A.iI * (rax * Py - ray * Px);
        B.vx += B.im * Px; B.vy += B.im * Py; B.w += B.iI * (rbx * Py - rby * Px);
      }
    }
    for (const j of this.joints) jPre(j, dt, idt);
    // 4) iterate
    for (let it = 0; it < ITER; it++) {
      for (const j of this.joints) jApply(j, dt);
      for (const ar of seen.values()) {
        const A = ar.A, B = ar.B;
        for (const c of ar.cs) {
          let dvx = B.vx - B.w * c.rby - A.vx + A.w * c.ray, dvy = B.vy + B.w * c.rbx - A.vy - A.w * c.rax;
          const vn = dvx * c.nx + dvy * c.ny;
          let dPn = c.mn * (-vn + c.bias); const P0 = c.Pn; c.Pn = Math.max(P0 + dPn, 0); dPn = c.Pn - P0;
          let Px = dPn * c.nx, Py = dPn * c.ny;
          A.vx -= A.im * Px; A.vy -= A.im * Py; A.w -= A.iI * (c.rax * Py - c.ray * Px);
          B.vx += B.im * Px; B.vy += B.im * Py; B.w += B.iI * (c.rbx * Py - c.rby * Px);
          dvx = B.vx - B.w * c.rby - A.vx + A.w * c.ray; dvy = B.vy + B.w * c.rbx - A.vy - A.w * c.rax;
          const tx = c.ny, ty = -c.nx, vt = dvx * tx + dvy * ty, mx = ar.f * c.Pn;
          let dPt = c.mt * -vt; const T0 = c.Pt; c.Pt = Math.max(-mx, Math.min(mx, T0 + dPt)); dPt = c.Pt - T0;
          Px = dPt * tx; Py = dPt * ty;
          A.vx -= A.im * Px; A.vy -= A.im * Py; A.w -= A.iI * (c.rax * Py - c.ray * Px);
          B.vx += B.im * Px; B.vy += B.im * Py; B.w += B.iI * (c.rbx * Py - c.rby * Px);
        }
      }
    }
    // 5) integrate positions
    for (const b of bs) if (b.kind !== "static") { b.x += b.vx * dt; b.y += b.vy * dt; b.a += b.w * dt; xform(b); }
  };
  function jPre(j, dt, idt) {
    const A = j.A, B = j.B;
    if (j.t === "pin") {
      const ra = rot(A, j.la), rb = rot(B, j.lb); j.ra = ra; j.rb = rb;
      const k11 = A.im + B.im + A.iI * ra[1] * ra[1] + B.iI * rb[1] * rb[1], k12 = -A.iI * ra[0] * ra[1] - B.iI * rb[0] * rb[1], k22 = A.im + B.im + A.iI * ra[0] * ra[0] + B.iI * rb[0] * rb[0];
      const det = k11 * k22 - k12 * k12 || 1e-9; j.M = [k22 / det, -k12 / det, k11 / det];
      j.bx = -BETA * idt * (B.x + rb[0] - A.x - ra[0]); j.by = -BETA * idt * (B.y + rb[1] - A.y - ra[1]);
      const P = j.P; A.vx -= A.im * P[0]; A.vy -= A.im * P[1]; A.w -= A.iI * (ra[0] * P[1] - ra[1] * P[0]);
      B.vx += B.im * P[0]; B.vy += B.im * P[1]; B.w += B.iI * (rb[0] * P[1] - rb[1] * P[0]);
    } else if (j.t === "rope") {
      const ra = rot(A, j.la), rb = rot(B, j.lb); j.ra = ra; j.rb = rb;
      let ux = B.x + rb[0] - A.x - ra[0], uy = B.y + rb[1] - A.y - ra[1]; const L = Math.hypot(ux, uy) || 1; ux /= L; uy /= L; j.u = [ux, uy];
      const ca = ra[0] * uy - ra[1] * ux, cb = rb[0] * uy - rb[1] * ux;
      j.m = 1 / (A.im + B.im + A.iI * ca * ca + B.iI * cb * cb || 1e9); j.bias = -BETA * idt * (L - j.L);
      const Px = j.P * ux, Py = j.P * uy;
      A.vx -= A.im * Px; A.vy -= A.im * Py; A.w -= A.iI * (ra[0] * Py - ra[1] * Px);
      B.vx += B.im * Px; B.vy += B.im * Py; B.w += B.iI * (rb[0] * Py - rb[1] * Px);
    } else { // wheel
      const ra = rot(A, j.la), ax = rot(A, j.ax), px = -ax[1], py = ax[0];
      const dx = B.x - A.x - ra[0], dy = B.y - A.y - ra[1];
      j.ra = ra; j.axw = ax; j.pw = [px, py];
      // perpendicular (rigid)
      j.sp = (dx + ra[0]) * py - (dy + ra[1]) * px;
      j.mp = 1 / (A.im + B.im + A.iI * j.sp * j.sp || 1e9); j.bp = -BETA * idt * (dx * px + dy * py);
      // spring along the axis (soft constraint)
      j.ss = (dx + ra[0]) * ax[1] - (dy + ra[1]) * ax[0];
      const inv = A.im + B.im + A.iI * j.ss * j.ss, m = inv > 0 ? 1 / inv : 0, om = 2 * Math.PI * j.hz;
      const k = m * om * om, c = 2 * m * j.zeta * om, C = dx * ax[0] + dy * ax[1];
      j.gam = dt * (c + dt * k); j.gam = j.gam > 0 ? 1 / j.gam : 0; j.bs = C * dt * k * j.gam; j.ms = inv + j.gam > 0 ? 1 / (inv + j.gam) : 0;
      j.mm = 1 / (REACT * A.iI + B.iI || 1e9);
      if (!j.motor) j.Pm = 0;
      const Px = j.Pp * px + j.Ps * ax[0], Py = j.Pp * py + j.Ps * ax[1];
      A.vx -= A.im * Px; A.vy -= A.im * Py; A.w -= A.iI * (j.Pp * j.sp + j.Ps * j.ss + REACT * j.Pm);
      B.vx += B.im * Px; B.vy += B.im * Py; B.w += B.iI * j.Pm;
    }
  }
  function jApply(j, dt) {
    const A = j.A, B = j.B;
    if (j.t === "pin") {
      const ra = j.ra, rb = j.rb;
      const dvx = B.vx - B.w * rb[1] - A.vx + A.w * ra[1], dvy = B.vy + B.w * rb[0] - A.vy - A.w * ra[0];
      const bx = j.bx - dvx, by = j.by - dvy, Px = j.M[0] * bx + j.M[1] * by, Py = j.M[1] * bx + j.M[2] * by;
      j.P[0] += Px; j.P[1] += Py;
      A.vx -= A.im * Px; A.vy -= A.im * Py; A.w -= A.iI * (ra[0] * Py - ra[1] * Px);
      B.vx += B.im * Px; B.vy += B.im * Py; B.w += B.iI * (rb[0] * Py - rb[1] * Px);
    } else if (j.t === "rope") {
      const ra = j.ra, rb = j.rb, u = j.u;
      const dvx = B.vx - B.w * rb[1] - A.vx + A.w * ra[1], dvy = B.vy + B.w * rb[0] - A.vy - A.w * ra[0];
      const P = j.m * (j.bias - (dvx * u[0] + dvy * u[1])); j.P += P;
      const Px = P * u[0], Py = P * u[1];
      A.vx -= A.im * Px; A.vy -= A.im * Py; A.w -= A.iI * (ra[0] * Py - ra[1] * Px);
      B.vx += B.im * Px; B.vy += B.im * Py; B.w += B.iI * (rb[0] * Py - rb[1] * Px);
    } else {
      // motor
      if (j.motor) {
        const Cd = B.w - A.w - j.speed, mx = j.maxT * dt; let P = -j.mm * Cd; const o = j.Pm; j.Pm = Math.max(-mx, Math.min(mx, o + P)); P = j.Pm - o;
        A.w -= REACT * A.iI * P; B.w += B.iI * P;
      }
      // spring
      const ax = j.axw, pw = j.pw;
      let Cd = (B.vx - A.vx) * ax[0] + (B.vy - A.vy) * ax[1] - A.w * j.ss;
      let P = -j.ms * (Cd + j.bs + j.gam * j.Ps); j.Ps += P;
      A.vx -= A.im * P * ax[0]; A.vy -= A.im * P * ax[1]; A.w -= A.iI * P * j.ss;
      B.vx += B.im * P * ax[0]; B.vy += B.im * P * ax[1];
      // perpendicular
      Cd = (B.vx - A.vx) * pw[0] + (B.vy - A.vy) * pw[1] - A.w * j.sp;
      P = j.mp * (j.bp - Cd); j.Pp += P;
      A.vx -= A.im * P * pw[0]; A.vy -= A.im * P * pw[1]; A.w -= A.iI * P * j.sp;
      B.vx += B.im * P * pw[0]; B.vy += B.im * P * pw[1];
    }
  }

  // ======================= CARS =======================
  // body: convex parts [verts, opts]; head: [x, y, r] (the Big Dawg, a kill zone); roof parts can be kill zones too.
  // wheels: [x, y, r, driven torque]; hz/zeta: suspension; speed: top wheel speed (rad/s); air: tilt power in the air.
  const CARS = {
    jeep: { name: "JEEP", col: "#e63946", den: 1, hz: 4.2, zeta: 0.7, speed: 30, air: 6, rim: "#ddd",
      body: [[[-1.55, -0.3], [1.55, -0.3], [1.6, 0.1], [1.05, 0.32], [-1.55, 0.35]]], head: [-0.2, 0.78, 0.3], wind: [0.35, 0.33, 0.12, 0.9],
      wheels: [[-1.05, -0.38, 0.48, 9], [1.05, -0.38, 0.48, 9]] },
    truck: { name: "PICKUP", col: "#2a9df4", den: 1, hz: 4, zeta: 0.7, speed: 28, air: 5, rim: "#eee",
      body: [[[-2.0, -0.3], [2.0, -0.3], [2.05, 0.25], [-2.0, 0.3]]], cab: [[-0.55, 0.28], [0.85, 0.28], [0.5, 1.0], [-0.55, 1.0]], head: [0.0, 0.7, 0.26],
      wheels: [[-1.35, -0.4, 0.5, 11], [1.35, -0.4, 0.5, 11]] },
    monster: { name: "MONSTER", col: "#8e44ad", den: 1, hz: 2.6, zeta: 0.55, speed: 20, air: 5, rim: "#f1c40f",
      body: [[[-1.6, -0.15], [1.7, -0.15], [1.75, 0.35], [-1.6, 0.4]]], cab: [[-0.6, 0.38], [0.6, 0.38], [0.35, 1.0], [-0.6, 1.0]], head: [-0.1, 0.72, 0.26],
      wheels: [[-1.25, -0.7, 0.85, 22], [1.25, -0.7, 0.85, 22]], wf: 1.3 },
    buggy: { name: "BUGGY", col: "#f4a300", den: 0.8, hz: 3.4, zeta: 0.6, speed: 34, air: 7, rim: "#333",
      body: [[[-1.2, -0.18], [1.3, -0.18], [1.05, 0.28], [-1.2, 0.3]]], head: [-0.25, 0.72, 0.28], cage: 1,
      wheels: [[-0.95, -0.38, 0.55, 8], [0.95, -0.38, 0.55, 8]] },
    racer: { name: "RACER", col: "#1abc9c", den: 1, hz: 5.5, zeta: 0.8, speed: 44, air: 5, rim: "#bbb",
      body: [[[-1.8, -0.2], [1.95, -0.2], [1.95, 0.0], [0.6, 0.28], [-1.8, 0.3]]], head: [-0.45, 0.57, 0.27], wind: [0.15, 0.3, -0.1, 0.62], spoiler: 1,
      wheels: [[-1.25, -0.28, 0.42, 9], [1.3, -0.28, 0.42, 9]] },
    bus: { name: "BUS", col: "#ffc93c", den: 1, hz: 3.5, zeta: 0.7, speed: 24, air: 3, rim: "#ccc",
      body: [[[-2.7, -0.35], [2.7, -0.35], [2.7, 1.3], [-2.7, 1.3]]], roof: [[-2.7, 1.3], [2.7, 1.3], [2.6, 1.5], [-2.6, 1.5]], head: [2.05, 0.75, 0.26],
      wheels: [[-1.85, -0.45, 0.52, 14], [1.85, -0.45, 0.52, 14]] },
    tank: { name: "TANK", col: "#5b7a3a", den: 1, hz: 5, zeta: 0.8, speed: 26, air: 3, rim: "#444", tread: 1,
      body: [[[-1.8, -0.15], [1.8, -0.15], [1.55, 0.42], [-1.65, 0.42]]], cab: [[-0.7, 0.4], [0.7, 0.4], [0.5, 0.85], [-0.5, 0.85]], head: [-0.1, 1.1, 0.27], gun: 1,
      wheels: [[-1.45, -0.42, 0.33, 7], [-0.73, -0.45, 0.33, 7], [0, -0.45, 0.33, 7], [0.73, -0.45, 0.33, 7], [1.45, -0.42, 0.33, 7]], wf: 1.4 },
    tractor: { name: "TRACTOR", col: "#27ae60", den: 1, hz: 3.5, zeta: 0.7, speed: 18, air: 4, rim: "#f39c12",
      body: [[[-1.1, -0.15], [1.45, -0.15], [1.45, 0.4], [-1.1, 0.45]]], cab: [[-1.05, 0.43], [0.0, 0.43], [-0.1, 1.25], [-1.0, 1.25]], head: [-0.55, 0.88, 0.27], open: 1,
      wheels: [[-0.75, -0.2, 0.85, 26], [1.05, -0.5, 0.45, 6]], wf: 1.3 }
  };
  function makeCar(W, kind, x, y) {
    const D = CARS[kind], ch = body("dyn", x, y); ch.group = W.carGroup; ch.car = D;
    D.body.forEach(v => poly(ch, v, { den: D.den, f: 0.5 }));
    if (D.cab) poly(ch, D.cab, { den: D.den * 0.4, f: 0.5, kill: true });
    if (D.roof) poly(ch, D.roof, { den: D.den * 0.4, f: 0.5, kill: true });
    const hd = circ(ch, D.head[0], D.head[1], D.head[2], { den: 0.2, kill: true, f: 0.5 }); hd.head = 1;
    W.add(ch);
    const wheels = D.wheels.map(w => {
      const b = body("dyn", x + w[0], y + w[1]); b.group = W.carGroup; circ(b, 0, 0, w[2], { den: 0.9, f: D.wf || 1.1 }); W.add(b);
      const j = W.wheel(ch, b, w[0], w[1], D.hz, D.zeta, w[3]); b.j = j; b.r = w[2]; return b;
    });
    return { ch, wheels, D };
  }

  // ======================= LEVELS =======================
  // ops (cursor walks right): f=flat, s=straight slope, c=smooth slope, h=hills, st=step, gap=pit, br=bridge (hinge|crumble),
  // see=seesaw over a pit, el=elevator, mv=sliding platform, bx=box stack, bl=balls, wr=wrecking ball, cr=crusher, sp=spring pad,
  // bo=boost strip, ce=low ceiling. The finish flag goes at the end automatically.
  const L = (name, car, th, ops) => ({ name, car, th, ops });
  const LEVELS = [
    L("First Drive", "jeep", 0, [["f", 25], ["h", 24, 0.5, 4], ["f", 8], ["c", 12, 2.5], ["f", 6], ["c", 12, -2.5], ["f", 10]]),
    L("Hill Hopper", "jeep", 0, [["f", 15], ["c", 14, 4], ["f", 4], ["c", 14, -4], ["f", 4], ["c", 16, 6], ["f", 6], ["c", 18, -6], ["h", 20, 0.8, 3]]),
    L("Mind the Gap", "jeep", 0, [["f", 22], ["s", 7, 1.6], ["gap", 4, -1.6], ["f", 14], ["s", 7, 1.8], ["gap", 6, -1.8], ["f", 14], ["c", 8, 2], ["gap", 5, -1], ["f", 10]]),
    L("Rope Bridge", "truck", 0, [["f", 18], ["br", 14, 10, "hinge"], ["f", 10], ["c", 8, 1.5], ["br", 18, 12, "hinge"], ["f", 12]]),
    L("Box Bash", "truck", 0, [["f", 16], ["bx", 6, 1, 0], ["f", 18], ["bx", 6, 1, 0], ["f", 14], ["c", 10, 3], ["f", 8], ["bx", 6, 1, 0], ["f", 12], ["c", 10, -3]]),
    L("Teeter Totter", "jeep", 0, [["f", 18], ["see", 10, 0], ["f", 12], ["see", 12, 2], ["f", 10], ["see", 12, 3], ["f", 8]]),
    L("Monster Steps", "monster", 1, [["f", 15], ["st", 0.5], ["f", 6], ["st", 0.6], ["f", 6], ["st", 0.7], ["f", 8], ["st", -1.8], ["f", 8], ["bl", 5, 0.5, 2], ["f", 16], ["h", 20, 1.4, 3]]),
    L("Crumbly Bridge", "buggy", 1, [["f", 22], ["br", 20, 14, "crumble"], ["f", 12], ["br", 24, 16, "crumble"], ["f", 12]]),
    L("Going Up", "jeep", 0, [["f", 16], ["el", 6, 4], ["f", 10], ["el", 6, 5], ["f", 8], ["c", 16, -9], ["f", 6]]),
    L("Wrecking Ball", "bus", 2, [["f", 20], ["wr", 6, 5], ["f", 18], ["wr", 8, 5], ["f", 14], ["wr", 6, 4.5], ["f", 14]]),
    L("Tank Hill", "tank", 2, [["f", 14], ["c", 10, 4], ["f", 3], ["bx", 6, 1, 0], ["f", 10], ["c", 10, 4], ["f", 6], ["st", -2], ["f", 8], ["c", 12, -6]]),
    L("Crusher Alley", "racer", 3, [["f", 22], ["cr", 4, 0], ["f", 14], ["cr", 4, 0.8], ["f", 14], ["cr", 4, 1.6], ["f", 12]]),
    L("Big Air", "racer", 1, [["f", 20], ["bo", 10], ["s", 10, 2.5], ["gap", 12, -2.5], ["f", 18], ["bo", 10], ["s", 10, 3], ["gap", 16, -3], ["f", 16]]),
    L("Boing!", "buggy", 0, [["f", 16], ["sp", 0, 13], ["f", 3], ["st", 3.5, "v"], ["f", 10], ["sp", 0, 13], ["f", 3], ["st", 3.5, "v"], ["f", 8], ["sp", 2, 12], ["gap", 7, 0], ["f", 12]]),
    L("Slider", "jeep", 3, [["f", 16], ["mv", 12], ["f", 8], ["mv", 16], ["f", 10]]),
    L("Low Bridge", "truck", 2, [["f", 14], ["ce", 26, 2.65], ["h", 26, 0.35, 3], ["f", 10], ["ce", 20, 2.7], ["h", 20, 0.3, 2], ["f", 10]]),
    L("Tractor Pull", "tractor", 0, [["f", 14], ["bx", 6, 1, 0], ["f", 12], ["c", 12, 5], ["f", 4], ["bl", 6, 0.6, 0], ["f", 10], ["c", 12, -5], ["st", 0.8], ["f", 8]]),
    L("Swing Set", "jeep", 1, [["f", 18], ["br", 16, 12, "hinge"], ["wr", -8, 5], ["f", 10], ["br", 16, 12, "hinge"], ["wr", -8, 5], ["f", 10]]),
    L("Monster Mash", "monster", 1, [["f", 14], ["bx", 6, 1, 0], ["f", 12], ["s", 6, 2], ["gap", 6, -2], ["f", 6], ["bx", 6, 1, 0], ["f", 10], ["st", 0.7], ["f", 5], ["st", 0.7], ["f", 8], ["c", 10, -1.4]]),
    L("Elevator Music", "buggy", 3, [["f", 16], ["el", 5, 3], ["f", 4], ["el", 5, 3], ["f", 4], ["el", 5, -6], ["f", 10], ["mv", 12], ["f", 10]]),
    L("Bus Route", "bus", 0, [["f", 16], ["c", 12, 3], ["f", 6], ["br", 16, 12, "hinge"], ["f", 6], ["see", 12, 0], ["f", 8], ["c", 12, -3], ["bx", 6, 1, 4], ["f", 16]]),
    L("Crush Hour", "jeep", 3, [["f", 18], ["cr", 4, 0], ["f", 10], ["cr", 4, 0.4], ["f", 12], ["el", 6, 3], ["f", 4], ["cr", 4, 0.7], ["f", 12]]),
    L("Tank Trap", "tank", 2, [["f", 14], ["c", 4, 1], ["f", 4], ["c", 4, 1], ["f", 4], ["br", 14, 10, "crumble"], ["f", 8], ["see", 12, 2], ["f", 10]]),
    L("Ski Jump", "racer", 4, [["f", 10], ["c", 24, -8], ["bo", 8], ["s", 8, 2], ["gap", 18, -6], ["c", 10, -2], ["f", 14], ["bo", 8], ["s", 8, 2.5], ["gap", 14, -2.5], ["f", 14]]),
    L("Snow Plow", "tractor", 4, [["f", 12], ["bx", 5, 1, 0], ["f", 16], ["c", 10, 3], ["f", 6], ["bl", 8, 0.5, 0], ["f", 12], ["c", 10, -3], ["f", 18]]),
    L("Double Trouble", "buggy", 4, [["f", 16], ["see", 12, 2], ["f", 4], ["wr", 3, 5], ["f", 6], ["br", 16, 12, "crumble"], ["f", 6], ["sp", 0, 13], ["f", 3], ["st", 3.5, "v"], ["f", 10]]),
    L("Night Drive", "jeep", 5, [["f", 16], ["h", 20, 1, 4], ["s", 6, 2], ["gap", 5, -2], ["f", 8], ["mv", 12], ["f", 6], ["el", 6, 4], ["f", 8], ["c", 14, -4]]),
    L("Monster Madness", "monster", 5, [["f", 14], ["st", 0.7], ["f", 5], ["st", 0.7], ["f", 6], ["see", 12, 0], ["f", 6], ["bx", 6, 1, 0], ["f", 10], ["s", 6, 2], ["gap", 7, -3.2], ["f", 12]]),
    L("Bus Stop", "bus", 5, [["f", 16], ["wr", 6, 5.5], ["f", 14], ["el", 7, 3], ["f", 8], ["cr", 6, 0], ["f", 10], ["br", 16, 12, "crumble"], ["f", 10]]),
    L("The Gauntlet", "racer", 5, [["f", 18], ["cr", 6, 0], ["f", 8], ["bo", 8], ["s", 8, 2], ["gap", 10, -2], ["f", 8], ["br", 16, 12, "crumble"], ["f", 6], ["wr", 4, 4.5], ["f", 8], ["mv", 14], ["f", 10], ["bo", 6], ["s", 6, 1.5], ["gap", 8, -1.5], ["f", 12]])
  ];
  const THEMES = [
    { sky: ["#6ec6ff", "#d6f0ff"], dirt: "#8a5a35", top: "#5cc142", hill: "#9ad38a", hill2: "#7cc06b" },
    { sky: ["#ffb36b", "#ffe2b8"], dirt: "#9b6b3e", top: "#7dbf3c", hill: "#e9b384", hill2: "#d99d6b" },
    { sky: ["#8ed1fc", "#e8f7ff"], dirt: "#6d6d74", top: "#a3a3ab", hill: "#b9c7d6", hill2: "#9fb0c2" },
    { sky: ["#f6d365", "#fda085"], dirt: "#b5723c", top: "#e0a458", hill: "#e8b06b", hill2: "#d4974f" },
    { sky: ["#a1c4fd", "#eef4ff"], dirt: "#7a8ea6", top: "#ffffff", hill: "#dfe9f5", hill2: "#c9d8ea" },
    { sky: ["#0f1a3a", "#2b3a67"], dirt: "#3b2a3f", top: "#6b4e8a", hill: "#26305a", hill2: "#1d2549", night: 1 }
  ];

  function build(li) {
    BID = 0;
    const W = new World(), lv = LEVELS[li], parts = [];
    const pieces = [], roofs = [], hz = [], springs = [], boosts = [], deco = [];
    let x = 0, y = 0, piece = [[-30, 20], [-30, 0], [0, 0]], minY = 0;
    const pt = (nx, ny) => { x = nx; y = ny; piece.push([x, y]); minY = Math.min(minY, y); };
    const endPiece = () => { piece.push([x, y - 40]); pieces.push(piece); };
    const newPiece = (nx, ny) => { x = nx; y = ny; piece = [[x, y - 40], [x, y]]; minY = Math.min(minY, y); };
    let grp = 10;
    for (const op of lv.ops) {
      const k = op[0];
      if (k === "f") pt(x + op[1], y);
      else if (k === "s") pt(x + op[1], y + op[2]);
      else if (k === "st") { if (op[1] > 0 && !op[2]) pt(x + op[1] * 0.45, y + op[1]); else if (op[1] > 0) { pt(x, y + op[1]); pt(x + 0.01, y); } else { pt(x, y + op[1]); pt(x + 0.01, y); } } // up-steps get a tiny bevel
      else if (k === "c") { const x0 = x, y0 = y, n = Math.max(4, Math.ceil(op[1] / 0.8)); for (let i = 1; i <= n; i++) pt(x0 + op[1] * i / n, y0 + op[2] * (1 - Math.cos(Math.PI * i / n)) / 2); }
      else if (k === "h") { const x0 = x, y0 = y, n = Math.ceil(op[1] / 0.6); for (let i = 1; i <= n; i++) pt(x0 + op[1] * i / n, y0 + op[2] * (1 - Math.cos(2 * Math.PI * op[3] * i / n)) / 2); }
      else if (k === "gap") { endPiece(); newPiece(x + op[1], y + (op[2] || 0)); }
      else if (k === "br") {
        const len = op[1], n = op[2], crum = op[3] === "crumble", w = len / n, x0 = x, g = ++grp; endPiece();
        let prev = W.ground;
        for (let i = 0; i < n; i++) {
          const b = body(crum ? "static" : "dyn", x0 + w * (i + 0.5), y - 0.13); b.group = g; b.noG = true; b.plank = 1;
          box(b, w / 2 - (crum ? 0.03 : 0), 0.13, 0, 0, { den: 0.6, f: 0.9 }); W.add(b); parts.push(b);
          if (crum) { b.crumble = 1; continue; }
          W.pin(prev, b, x0 + w * i, y - 0.13); prev = b;
        }
        if (!crum) W.pin(prev, W.ground, x0 + len, y - 0.13);
        newPiece(x0 + len, y);
      }
      else if (k === "see") {
        const len = op[1], dy = op[2], x0 = x, y0 = y; endPiece();
        const hy = Math.max(y0, y0 + dy) + 0.55, pl = len + 2.4, cx = x0 + len / 2;
        const a0 = Math.asin(Math.min(0.9, (hy - y0 - 0.15) / (pl / 2)));
        const b = body("dyn", cx, hy, a0); b.see = 1; box(b, pl / 2, 0.15, 0, 0, { den: 0.5, f: 0.9 }); W.add(b); parts.push(b);
        W.pin(W.ground, b, cx, hy);
        deco.push({ k: "pivot", x: cx, y: hy, y0: Math.min(y0, y0 + dy) - 2 });
        newPiece(x0 + len, y0 + dy);
      }
      else if (k === "el") {
        const len = op[1], dy = op[2], x0 = x, y0 = y; endPiece();
        const b = body("kin", x0 + len / 2, y0 - 0.2); b.elev = { y0: y0 - 0.2, dy, mv: 1 + Math.abs(dy) * 0.3 }; box(b, len / 2 - 0.12, 0.2, 0, 0, { f: 1 }); W.add(b); parts.push(b);
        newPiece(x0 + len, y0 + dy);
      }
      else if (k === "mv") {
        const len = op[1], x0 = x, y0 = y, pw = 5.2; endPiece();
        const b = body("kin", x0 + 0.15 + pw / 2, y0 - 0.2); b.slide = { x0: x0 + 0.15 + pw / 2, dx: len - 0.3 - pw, mv: 1 + len * 0.15 }; box(b, pw / 2, 0.2, 0, 0, { f: 1 }); W.add(b); parts.push(b);
        newPiece(x0 + len, y0);
      }
      else if (k === "bx") {
        const n = op[1], s = op[2], x0 = x + (op[3] || 0) + 0.5; let left = n, row = 0;
        while (left > 0) { const inRow = row ? left : Math.min(left, Math.ceil((n + 1) / 2)); for (let i = 0; i < inRow; i++) { const b = body("dyn", x0 + (i + row * 0.5) * (s + 0.02) + s / 2, y + s / 2 + row * s + 0.01); b.crate = s; box(b, s / 2, s / 2, 0, 0, { den: 0.08, f: 0.3 }); W.add(b); parts.push(b); } left -= inRow; row++; }
      }
      else if (k === "bl") {
        const n = op[1], r = op[2], x0 = x + (op[3] || 0) + r;
        for (let i = 0; i < n; i++) { const b = body("dyn", x0 + i * (2 * r + 0.05), y + r + 0.01); b.ball = r; circ(b, 0, 0, r, { den: 0.3, f: 0.8 }); W.add(b); parts.push(b); }
      }
      else if (k === "wr") {
        const ax = x + op[1], len = op[2], ay = y + len + 1.15, r = 0.75;
        const b = body("dyn", ax + len * Math.sin(1.1), ay - len * Math.cos(1.1)); b.wreck = { ax, ay, r }; b.noG = true; circ(b, 0, 0, r, { den: 2, f: 0.4 }); W.add(b); parts.push(b);
        W.rope(W.ground, b, ax, ay, b.x, b.y);
      }
      else if (k === "cr") {
        const w = op[1], cx = x + w / 2 + 1, top = y + 6.5, low = y + 1.45 + 1.5;
        const b = body("kin", cx, top); b.crush = { top, low, per: 4, t: op[2] || 0 }; box(b, w / 2, 1.5, 0, 0, { f: 0.5 }); W.add(b); parts.push(b);
      }
      else if (k === "sp") { const sx = x + op[1]; springs.push({ x0: sx, x1: sx + 1.8, y, v: op[2], t: 0 }); }
      else if (k === "bo") { boosts.push({ x0: x, x1: x + op[1], y }); pt(x + op[1], y); }
      else if (k === "ce") { roofs.push({ x0: x, x1: x + op[1], y: y + op[2] }); }
    }
    pt(x + 6, y); const fin = x; pt(x + 40, y); endPiece();
    // ground segments
    for (const p of pieces) for (let i = 0; i + 1 < p.length; i++) W.seg(p[i][0], p[i][1], p[i + 1][0], p[i + 1][1]);
    for (const r of roofs) { W.seg(r.x0, r.y, r.x1, r.y); W.seg(r.x0, r.y, r.x0, r.y + 20); W.seg(r.x1, r.y, r.x1, r.y + 20); }
    const car = makeCar(W, lv.car, 4, 0.2 - Math.min(...CARS[lv.car].wheels.map(w => w[1] - w[2])));
    return { W, lv, pieces, roofs, springs, boosts, deco, parts, car, fin, minY, th: THEMES[lv.th] };
  }

  // per-step level scripting (moving parts, springs, boosts, crumbling planks)
  function script(L, dt, t) {
    for (const b of L.parts) {
      if (b.elev) { const e = b.elev; b.vy = (e.y0 + e.dy * shuttle(t + dt, e.mv) - b.y) / dt; }
      else if (b.slide) { const e = b.slide; b.vx = (e.x0 + e.dx * shuttle(t + dt, e.mv) - b.x) / dt; }
      else if (b.crush) {
        const c = b.crush, p = ((t + dt) / c.per + c.t) % 1;
        // up (wait) -> slam down -> sit -> rise
        const f = p < 0.55 ? 0 : p < 0.62 ? Math.pow((p - 0.55) / 0.07, 2) : p < 0.75 ? 1 : 1 - (p - 0.75) / 0.25;
        b.vy = (c.top + (c.low - c.top) * f - b.y) / dt;
      }
      else if (b.crumble && b.hitT != null && b.kind === "static") { b.hitT -= dt; if (b.hitT <= 0) { b.kind = "dyn"; mass(b); b.w = (Math.random() - 0.5) * 0.6; } }
    }
  }
  // elevators / sliders: wait DWELL s at each end, then glide over mv s
  const DWELL = 2.2;
  function shuttle(t, mv) {
    const cyc = 2 * (DWELL + mv), p = ((t % cyc) + cyc) % cyc;
    const ease = u => (1 - Math.cos(Math.PI * u)) / 2;
    return p < DWELL ? 0 : p < DWELL + mv ? ease((p - DWELL) / mv) : p < 2 * DWELL + mv ? 1 : 1 - ease((p - 2 * DWELL - mv) / mv);
  }
  function carInfo(car) {
    const c = car.ch, up = [-Math.sin(c.a), Math.cos(c.a)];
    return { x: c.x, y: c.y, a: c.a, up, sp: Math.hypot(c.vx, c.vy) };
  }

  // ======================= GAME =======================
  const pkey = () => "bdd:mad:" + (typeof me !== "undefined" && me ? me.id : "");
  function prog() { let p = null; try { p = store.get(pkey()); } catch (e) {} if (!p || !p.b) p = { u: 0, b: {}, t: {}, last: 0 }; return p; }
  function saveProg(p) { try { store.set(pkey(), p); } catch (e) {} }
  const total = p => Object.keys(p.b).reduce((a, k) => a + (p.b[k] || 0), 0);
  // par times (seconds) for the speed bonus: about a clean, quick run
  const PAR = [10, 12, 10, 8, 10, 12, 20, 8, 30, 10, 12, 9, 9, 16, 33, 8, 15, 7, 10, 52, 12, 17, 12, 11, 14, 15, 28, 12, 24, 22];
  const ptsFor = (li, t) => { const par = PAR[li] || 20; return 1000 + Math.round(500 * Math.max(0, Math.min(1, 1 - (t - par) / (par * 1.5)))); };
  const stars = pts => !pts ? 0 : pts >= 1400 ? 3 : pts >= 1200 ? 2 : 1;

  const def = {
    key: "mad", name: "Mad Dawg", icon: "🛻", max: 99999,
    blurb: "Physics car levels. Don't flip!",
    how: "Get the car to the checkered flag. Hold the RIGHT side of the screen to drive and the LEFT side to brake and back up (arrow keys work too). In the air, gas tips the nose up and brake tips it down, so use them to land on your wheels. If the Big Dawg's head (or a closed car's roof) touches anything, or you fall in a pit, the level restarts. Bridges, seesaws, crushers, wrecking balls, elevators and a new car every few levels. ↻ restarts, ☰ picks a level. Score is your career total: every level you beat counts once, 1000 + up to 500 for a fast time.",
    _t: { build, script, LEVELS, CARS, DT, carInfo, ptsFor, DWELL },
    reset(G) {
      const p = prog(), li = Math.min(p.last || 0, p.u, LEVELS.length - 1);
      G.s = { p, li, gas: 0, brk: 0, keys: {}, pops: [], fx: [], menu: false };
      this.load(G, li);
      this.hook();
    },
    load(G, li) {
      const s = G.s; s.li = li; s.L = build(li); s.t = 0; s.acc = 0; s.phase = "go"; s.pt = 0; s.flip = 0; s.fx = []; s.done = 0;
      const ci = carInfo(s.L.car); s.cam = { x: ci.x + 4, y: ci.y + 1 };
      s.L.W.onHit = (a, b, cs) => this.hit(G, a, b, cs);
      s.p.last = li; saveProg(s.p);
    },
    hit(G, a, b, cs) {
      const s = G.s; if (s.phase !== "go") return;
      const isCar = sh => sh.b.group === 1;
      for (const [k, o] of [[a, b], [b, a]]) {
        if (k.kill && !isCar(o) && (o.ground || o.b.kind !== "dyn") && cs.some(c => c[4] < 0.005)) this.crash(G, k.head ? "BONK!" : "CRUNCH!");
        if (o.b.crumble && o.b.hitT == null && isCar(k)) o.b.hitT = 0.45;
      }
    },
    crash(G, msg) {
      const s = G.s; if (s.phase !== "go") return;
      s.phase = "crash"; s.pt = 0; G.sfx("lose"); G.buzz();
      s.pops.push({ t: 1.2, txt: msg });
      const c = s.L.car.ch; for (let i = 0; i < 14; i++) s.fx.push({ x: c.x, y: c.y + 0.5, vx: (Math.random() - 0.5) * 8, vy: Math.random() * 7, t: 0.9, col: "#ffd23f" });
    },
    win(G) {
      const s = G.s; s.phase = "win"; s.pt = 0; G.sfx("win");
      const pts = ptsFor(s.li, s.t), old = s.p.b[s.li] || 0;
      s.winPts = pts; s.winBest = pts > old;
      if (pts > old) s.p.b[s.li] = pts;
      if (!s.p.t[s.li] || s.t < s.p.t[s.li]) s.p.t[s.li] = Math.round(s.t * 10) / 10;
      s.p.u = Math.max(s.p.u, Math.min(LEVELS.length - 1, s.li + 1));
      saveProg(s.p);
      if (pts > old) G.postQuiet(total(s.p));
      const f = s.L.fin; for (let i = 0; i < 60; i++) s.fx.push({ x: f + (Math.random() - 0.3) * 6, y: s.L.car.ch.y + 4 + Math.random() * 3, vx: (Math.random() - 0.5) * 6, vy: Math.random() * 5, t: 2 + Math.random(), col: ["#e63946", "#ffd23f", "#2a9df4", "#5cc142", "#ff7ab6"][i % 5], conf: 1 });
    },
    update(G, dt) {
      const s = G.s; if (s.menu) return;
      s.pops.forEach(o => o.t -= dt); s.pops = s.pops.filter(o => o.t > 0);
      s.fx.forEach(f => { f.x += f.vx * dt; f.y += f.vy * dt; f.vy -= (f.conf ? 3 : 14) * dt; f.t -= dt; }); s.fx = s.fx.filter(f => f.t > 0);
      const L = s.L, car = L.car, D = car.D;
      if (s.phase === "crash") { s.pt += dt; if (s.pt > 1.3) this.load(G, s.li); }
      if (s.phase === "win") { s.pt += dt; if (s.pt > 2.6) this.load(G, Math.min(LEVELS.length - 1, s.li + 1)); }
      // controls
      const gas = s.phase === "go" && (s.gas || s.keys.gas) ? 1 : 0, brk = s.phase === "go" && (s.brk || s.keys.brk) ? 1 : 0;
      s.acc += dt;
      while (s.acc >= DT) {
        s.acc -= DT;
        const fwd = Math.cos(car.ch.a) * car.ch.vx + Math.sin(car.ch.a) * car.ch.vy;
        let ground = false;
        for (const w of car.wheels) {
          const j = w.j;
          if (gas && !brk) { j.motor = true; j.speed = -D.speed; j.maxT = D.wheels[car.wheels.indexOf(w)][3]; }
          else if (brk) { j.motor = true; j.maxT = D.wheels[car.wheels.indexOf(w)][3] * (fwd > 1 ? 2.2 : 1); j.speed = fwd > 1 ? 0 : D.speed * 0.55; }
          else { j.motor = true; j.speed = 0; j.maxT = Math.abs(w.w - car.ch.w) * w.r < 1.5 ? D.wheels[car.wheels.indexOf(w)][3] : 0.25; } // rolls free, but parks itself when nearly stopped
          for (const ar of L.W.arb.values()) if (ar.B === w || ar.A === w) { ground = true; break; }
        }
        s.air = !ground;
        if (!ground && (gas || brk)) { const c = car.ch; c.w += (gas ? 1 : -1) * D.air * DT; c.w = Math.max(-4.5, Math.min(4.5, c.w)); }
        // springs & boosts
        for (const sp of L.springs) {
          sp.t = Math.max(0, sp.t - DT);
          if (sp.t > 0) continue;
          if (car.wheels.some(w => w.x > sp.x0 - 0.2 && w.x < sp.x1 + 0.2 && w.y - w.r < sp.y + 0.3)) {
            sp.t = 0.6; sp.fire = 0.25; [car.ch].concat(car.wheels).forEach(b => b.vy = Math.max(b.vy, sp.v)); G.sfx("pop");
          }
        }
        for (const bo of L.boosts) if (ground && car.ch.x > bo.x0 && car.ch.x < bo.x1) { const ca = Math.cos(car.ch.a), sa = Math.sin(car.ch.a); [car.ch].concat(car.wheels).forEach(b => { if (b.vx * ca + b.vy * sa < 22) { b.vx += ca * 24 * DT; b.vy += sa * 24 * DT; } }); }
        script(L, DT, s.t);
        L.W.step(DT);
        if (s.phase === "go") s.t += DT;
      }
      L.springs.forEach(sp => sp.fire = Math.max(0, (sp.fire || 0) - dt));
      const ci = carInfo(car);
      if (s.phase === "go") {
        if (ci.y < L.minY - 12) this.crash(G, "SPLAT!");
        else if (ci.x > L.fin) this.win(G);
        if (ci.up[1] < -0.2 && ci.sp < 1.5) { s.flip += dt; if (s.flip > 1.5) this.crash(G, "FLIPPED!"); } else s.flip = 0;
      }
      // camera: ahead of the car, smooth
      const tx = ci.x + 3 + Math.max(-2, Math.min(4, car.ch.vx * 0.25)), ty = ci.y + 1;
      s.cam.x += (tx - s.cam.x) * Math.min(1, dt * 3); s.cam.y += (ty - s.cam.y) * Math.min(1, dt * 2.5);
    },
    // --- input ---
    btns(G) { const y = 50, r = 17; return { menu: { x: G.W - 26, y, r }, redo: { x: G.W - 66, y, r } }; },
    hook() {
      if (window._madT) return; window._madT = 1;
      const w = $("gwrap"); if (!w) return;
      const f = e => {
        if (G.key !== "mad" || G.state !== "play" || !G.s || G.s.menu) return;
        const r = w.getBoundingClientRect(), xs = [];
        for (let i = 0; i < e.touches.length; i++) { const t = e.touches[i]; if (t.clientY - r.top > 72) xs.push(t.clientX - r.left); }
        GAMEDEFS.mad.zone(G, xs);
      };
      ["touchstart", "touchmove", "touchend", "touchcancel"].forEach(n => w.addEventListener(n, f, { passive: true }));
    },
    zone(G, xs) { const s = G.s; s.brk = xs.some(x => x < G.W / 2) ? 1 : 0; s.gas = xs.some(x => x >= G.W / 2) ? 1 : 0; },
    down(G, x, y) {
      const s = G.s;
      if (s.menu) return this.menuTap(G, x, y);
      const b = this.btns(G);
      if (Math.hypot(x - b.menu.x, y - b.menu.y) < 24) { s.menu = true; s.gas = s.brk = 0; return; }
      if (Math.hypot(x - b.redo.x, y - b.redo.y) < 24) { if (s.phase !== "win") this.load(G, s.li); return; }
      if (!TOUCH && y > 72) this.zone(G, [x]);
    },
    up(G) { if (!TOUCH && G.s) this.zone(G, []); },
    onKey(G, k, d) {
      const s = G.s; if (!s) return;
      if (k === "ArrowRight" || k === "d" || k === "ArrowUp" || k === "w") s.keys.gas = d;
      if (k === "ArrowLeft" || k === "a" || k === "ArrowDown" || k === "s") s.keys.brk = d;
      if ((k === "r" || k === "R") && d && !s.menu && s.phase !== "win") this.load(G, s.li);
      if (k === "Escape" && d) s.menu = !s.menu;
    },
    menuLayout(G) {
      const cols = 5, pad = 14, top = 96, cw = (G.W - pad * 2) / cols, chh = Math.min(cw * 0.9, (G.H - top - 70) / Math.ceil(LEVELS.length / cols));
      return { cols, pad, top, cw, chh };
    },
    menuTap(G, x, y) {
      const s = G.s, m = this.menuLayout(G);
      if (y < 80 && x > G.W - 60) { s.menu = false; return; }
      const c = Math.floor((x - m.pad) / m.cw), r = Math.floor((y - m.top) / m.chh), i = r * m.cols + c;
      if (c < 0 || c >= m.cols || r < 0 || i >= LEVELS.length) { if (y > m.top + Math.ceil(LEVELS.length / m.cols) * m.chh + 10) s.menu = false; return; }
      if (i > s.p.u) { G.sfx("lose"); return; }
      s.menu = false; G.sfx("pop"); this.load(G, i);
    },

    // --- drawing ---
    draw(G, c) {
      const s = G.s; if (!s || !s.L) return;
      const W = G.W, H = G.H, L = s.L, th = L.th, S = Math.max(18, Math.min(W / 13, H / 9));
      const cx = s.cam.x, cy = s.cam.y, X = wx => (wx - cx) * S + W / 2, Y = wy => H * 0.55 - (wy - cy) * S;
      // sky
      const sk = c.createLinearGradient(0, 0, 0, H); sk.addColorStop(0, th.sky[0]); sk.addColorStop(1, th.sky[1]); c.fillStyle = sk; c.fillRect(0, 0, W, H);
      if (th.night) { c.fillStyle = "#fff"; for (let i = 0; i < 40; i++) { const sx = ((i * 97.3 - cx * 2) % W + W) % W, sy = (i * 53.7) % (H * 0.5); c.globalAlpha = 0.4 + (i % 3) * 0.2; c.fillRect(sx, sy, 2, 2); } c.globalAlpha = 1; c.fillStyle = "#fdf6c3"; c.beginPath(); c.arc(W * 0.8, H * 0.15, 22, 0, 7); c.fill(); }
      else { c.fillStyle = "rgba(255,255,255,0.85)"; for (let i = 0; i < 6; i++) { const px = ((i * 230 - cx * S * 0.15) % (W + 300) + W + 300) % (W + 300) - 150, py = 60 + (i * 47) % (H * 0.3); c.beginPath(); c.arc(px, py, 18, 0, 7); c.arc(px + 20, py - 8, 22, 0, 7); c.arc(px + 42, py, 17, 0, 7); c.fill(); } }
      // parallax hills
      for (const [col, f, amp, base] of [[th.hill, 0.25, 50, 0.62], [th.hill2, 0.45, 35, 0.72]]) {
        c.fillStyle = col; c.beginPath(); c.moveTo(0, H);
        for (let sx = 0; sx <= W + 20; sx += 20) { const wx = sx + cx * S * f; c.lineTo(sx, H * base - amp * (0.6 * Math.sin(wx / 160) + 0.4 * Math.sin(wx / 71 + 2)) - (cy * S * f * 0.3)); }
        c.lineTo(W, H); c.fill();
      }
      // pits fade to black below the lowest ground
      const py = Y(L.minY - 0.6); if (py < H) { const pg = c.createLinearGradient(0, py, 0, py + 3 * S); pg.addColorStop(0, "rgba(10,8,20,0)"); pg.addColorStop(1, "rgba(10,8,20,0.92)"); c.fillStyle = pg; c.fillRect(0, py, W, H - py); }
      // finish flag (behind the car)
      this.drawFinish(c, L, X, Y, S);
      // ceilings
      c.fillStyle = th.night ? "#2a2236" : "#5f5149";
      for (const r of L.roofs) { c.fillRect(X(r.x0), Y(r.y + 20), (r.x1 - r.x0) * S, 20 * S); c.fillStyle = "#3d342e"; c.fillRect(X(r.x0), Y(r.y) - 4, (r.x1 - r.x0) * S, 4); c.fillStyle = th.night ? "#2a2236" : "#5f5149"; }
      // seesaw pivots
      for (const d of L.deco) if (d.k === "pivot") { c.fillStyle = "#7f8c8d"; c.beginPath(); c.moveTo(X(d.x), Y(d.y)); c.lineTo(X(d.x) - 0.7 * S, Y(d.y0)); c.lineTo(X(d.x) + 0.7 * S, Y(d.y0)); c.fill(); c.fillStyle = "#555"; c.beginPath(); c.arc(X(d.x), Y(d.y), 0.15 * S, 0, 7); c.fill(); }
      // ground
      for (const p of L.pieces) {
        if (X(p[p.length - 1][0]) < -50 || X(p[0][0]) > W + 50) continue;
        c.fillStyle = th.dirt; c.beginPath(); c.moveTo(X(p[0][0]), H + 10);
        for (const q of p) c.lineTo(X(q[0]), Math.min(H + 10, Y(q[1])));
        c.lineTo(X(p[p.length - 1][0]), H + 10); c.fill();
        c.strokeStyle = th.top; c.lineWidth = Math.max(4, S * 0.3); c.lineJoin = "round"; c.beginPath();
        for (let i = 1; i < p.length - 1; i++) { const q = p[i]; if (i === 1) c.moveTo(X(q[0]), Y(q[1]) + c.lineWidth / 2 - 1); else c.lineTo(X(q[0]), Y(q[1]) + c.lineWidth / 2 - 1); }
        c.stroke();
      }
      // boosts & springs
      for (const b of L.boosts) { c.fillStyle = "#ff9f1c"; for (let x = b.x0 + 0.3; x < b.x1 - 0.6; x += 1.6) { const sx = X(x), sy = Y(b.y); c.beginPath(); c.moveTo(sx, sy - 3); c.lineTo(sx + 0.6 * S, sy - 3); c.lineTo(sx + 1.1 * S, sy - 0.25 * S - 3); c.lineTo(sx + 0.6 * S, sy - 0.5 * S - 3); c.lineTo(sx, sy - 0.5 * S - 3); c.lineTo(sx + 0.5 * S, sy - 0.25 * S - 3); c.fill(); } }
      for (const sp of L.springs) {
        const sx = X(sp.x0), sy = Y(sp.y), w = (sp.x1 - sp.x0) * S, h = (sp.fire > 0 ? 0.9 : 0.35) * S;
        c.strokeStyle = "#555"; c.lineWidth = 2; c.beginPath(); for (let i = 0; i <= 6; i++) c.lineTo(sx + w * (0.2 + 0.6 * (i % 2)), sy - h * i / 6); c.stroke();
        c.fillStyle = "#e63946"; c.fillRect(sx, sy - h - 0.18 * S, w, 0.18 * S);
      }
      // physics parts
      for (const b of L.parts) { const px = X(b.x); if (px > -12 * S && px < W + 12 * S) this.drawPart(c, b, X, Y, S, L); }
      this.drawCar(c, L.car, X, Y, S, s);
      // fx
      for (const f of s.fx) { c.globalAlpha = Math.min(1, f.t * 2); c.fillStyle = f.col; c.fillRect(X(f.x) - 3, Y(f.y) - 3, f.conf ? 6 : 5, f.conf ? 9 : 5); } c.globalAlpha = 1;
      // HUD
      const best = s.p.b[s.li];
      G.hud(c, `LVL ${s.li + 1}`, LEVELS[s.li].name.toUpperCase(), `${total(s.p)}`);
      // progress bar
      const bx = 14, bw = W - 120, by = 46, prog = Math.max(0, Math.min(1, (L.car.ch.x - 4) / (L.fin - 4)));
      c.fillStyle = "rgba(0,0,0,0.35)"; c.beginPath(); c.roundRect ? c.roundRect(bx, by, bw, 9, 5) : c.rect(bx, by, bw, 9); c.fill();
      c.fillStyle = "#ffd23f"; c.beginPath(); c.roundRect ? c.roundRect(bx, by, Math.max(9, bw * prog), 9, 5) : c.rect(bx, by, bw * prog, 9); c.fill();
      G.emoji(c, "🏁", bx + bw + 2, by + 4, 14);
      c.globalAlpha = 0.9; G.text(c, `${s.t.toFixed(1)}s`, bx, by + 22, 9, th.night ? "#fff" : "#1d2a3a", "left");
      if (best) G.text(c, "★".repeat(stars(best)) + "☆".repeat(3 - stars(best)), bx + bw, by + 22, 9, "#ffb300", "right");
      c.globalAlpha = 1;
      const bt = this.btns(G);
      for (const [k, ch] of [["redo", "↻"], ["menu", "☰"]]) { const o = bt[k]; c.fillStyle = "rgba(0,0,0,0.45)"; c.beginPath(); c.arc(o.x, o.y, o.r, 0, 7); c.fill(); c.fillStyle = "#fff"; c.font = `bold 18px system-ui`; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText(ch, o.x, o.y + 1); }
      // pedals
      if (G.state === "play" && !s.menu) this.drawPedals(c, G, s);
      // banners
      for (const o of s.pops) { c.globalAlpha = Math.min(1, o.t * 2); G.text(c, o.txt, W / 2 + 2, H * 0.32 + 2, 22, "rgba(0,0,0,0.6)"); G.text(c, o.txt, W / 2, H * 0.32, 22, "#ff5252"); } c.globalAlpha = 1;
      if (s.phase === "win") {
        const a = Math.min(1, s.pt * 3); c.globalAlpha = a; c.fillStyle = "rgba(0,0,0,0.55)"; c.fillRect(0, H * 0.24, W, 120);
        G.text(c, "LEVEL COMPLETE!", W / 2, H * 0.24 + 30, Math.min(20, W / 18), "#ffd23f");
        G.text(c, `${s.t.toFixed(1)}s  +${s.winPts}`, W / 2, H * 0.24 + 62, 13, "#fff");
        G.text(c, s.winBest ? "NEW BEST!" : "BEST " + (s.p.b[s.li] || 0), W / 2, H * 0.24 + 90, 10, s.winBest ? "#7CFC00" : "#ccc");
        G.emoji(c, "⭐".repeat(stars(s.winPts)), W / 2, H * 0.24 + 112, 16);
        c.globalAlpha = 1;
      }
      if (G.state === "play" && s.phase === "go" && s.li === 0 && s.t < 4) G.hint(c, "HOLD RIGHT = GAS · LEFT = BRAKE", 99, H - 175);
      if (s.menu) this.drawMenu(c, G, s);
    },
    drawPedals(c, G, s) {
      const W = G.W, H = G.H, pw = Math.min(70, W * 0.17), ph = pw * 1.25;
      const ped = (x, on, lbl, col) => {
        const y = H - ph - 16;
        c.save(); c.globalAlpha = on ? 0.95 : 0.55; c.translate(x + pw / 2, y + ph / 2); c.rotate(on ? 0.12 : 0); c.translate(-pw / 2, -ph / 2);
        c.fillStyle = "rgba(0,0,0,0.35)"; c.beginPath(); c.roundRect ? c.roundRect(3, 5, pw, ph, 12) : c.rect(3, 5, pw, ph); c.fill();
        c.fillStyle = on ? col : "#cfd6dd"; c.beginPath(); c.roundRect ? c.roundRect(0, 0, pw, ph, 12) : c.rect(0, 0, pw, ph); c.fill();
        c.fillStyle = "rgba(0,0,0,0.18)"; for (let i = 0; i < 5; i++) c.fillRect(pw * 0.18, ph * (0.18 + i * 0.15), pw * 0.64, ph * 0.06);
        c.restore(); G.text(c, lbl, x + pw / 2, y - 10, 8, "#fff");
      };
      ped(16, s.brk || s.keys.brk, "BRAKE", "#ff6b6b");
      ped(W - pw - 16, s.gas || s.keys.gas, "GAS", "#7bd389");
    },
    drawFinish(c, L, X, Y, S) {
      const p = L.pieces[L.pieces.length - 1]; let gy = 0; for (const q of p) if (q[0] <= L.fin) gy = q[1];
      const x = X(L.fin), y = Y(gy), h = 4.2 * S, sq = 0.35 * S;
      c.fillStyle = "#444"; c.fillRect(x - 3, y - h, 6, h); c.fillRect(x + 3 + 5 * sq, y - h, 6, h);
      for (let r = 0; r < 3; r++) for (let k = 0; k < 5; k++) { c.fillStyle = (r + k) % 2 ? "#111" : "#fff"; c.fillRect(x + 3 + k * sq, y - h + r * sq, sq, sq); }
      for (let r = 0; r < 4; r++) { c.fillStyle = r % 2 ? "#111" : "#fff"; c.fillRect(x - 0.15 * S, y - r * 0.3 * S - 0.3 * S, 0.3 * S, 0.3 * S); }
      // start line
      c.fillStyle = "rgba(255,255,255,0.7)"; c.fillRect(X(2.2), Y(0) - 2, 0.25 * S, 4);
    },
    drawPart(c, b, X, Y, S, L) {
      const sx = X(b.x), sy = Y(b.y);
      if (b.wreck) {
        c.strokeStyle = "#333"; c.lineWidth = 2; c.beginPath(); c.moveTo(X(b.wreck.ax), Y(b.wreck.ay)); c.lineTo(sx, sy); c.stroke();
        c.fillStyle = "#555"; c.fillRect(X(b.wreck.ax) - 0.5 * S, Y(b.wreck.ay) - 0.2 * S, S, 0.25 * S);
        const g = c.createRadialGradient(sx - 0.25 * S, sy - 0.25 * S, 2, sx, sy, b.wreck.r * S); g.addColorStop(0, "#777"); g.addColorStop(1, "#222");
        c.fillStyle = g; c.beginPath(); c.arc(sx, sy, b.wreck.r * S, 0, 7); c.fill(); return;
      }
      if (b.ball) { c.save(); c.translate(sx, sy); c.rotate(-b.a); c.fillStyle = "#8d5a2b"; c.beginPath(); c.arc(0, 0, b.ball * S, 0, 7); c.fill(); c.strokeStyle = "#5e3a1a"; c.lineWidth = 2; c.beginPath(); c.arc(0, 0, b.ball * S * 0.6, 0, 7); c.stroke(); c.beginPath(); c.arc(0, 0, b.ball * S * 0.25, 0, 7); c.stroke(); c.restore(); return; }
      const sh = b.sh[0]; if (!sh || sh.t !== 1) return;
      c.beginPath(); sh.wv.forEach((v, i) => i ? c.lineTo(X(v[0]), Y(v[1])) : c.moveTo(X(v[0]), Y(v[1]))); c.closePath();
      if (b.crate) { c.fillStyle = "#c98b4a"; c.fill(); c.strokeStyle = "#7a4f24"; c.lineWidth = 2; c.stroke(); const v = sh.wv; c.beginPath(); c.moveTo(X(v[0][0]), Y(v[0][1])); c.lineTo(X(v[2][0]), Y(v[2][1])); c.moveTo(X(v[1][0]), Y(v[1][1])); c.lineTo(X(v[3][0]), Y(v[3][1])); c.stroke(); }
      else if (b.plank) { c.fillStyle = b.crumble ? (b.hitT != null ? "#b07a4f" : "#c4915f") : "#a8723d"; c.fill(); c.strokeStyle = "#5e3a1a"; c.lineWidth = 1.5; c.stroke(); }
      else if (b.see) { c.fillStyle = "#e9c46a"; c.fill(); c.strokeStyle = "#8a6d1e"; c.lineWidth = 2; c.stroke(); }
      else if (b.crush) {
        c.fillStyle = "#6c757d"; c.fill(); c.strokeStyle = "#343a40"; c.lineWidth = 2; c.stroke();
        const v = sh.wv, bx0 = X(v[0][0]), by0 = Y(v[0][1]), w = X(v[1][0]) - bx0;
        c.save(); c.beginPath(); c.rect(bx0, by0 - 0.35 * S, w, 0.35 * S); c.clip(); c.fillStyle = "#ffd23f"; c.fillRect(bx0, by0 - 0.35 * S, w, 0.35 * S);
        c.fillStyle = "#111"; for (let k = -1; k < w / (0.4 * S) + 1; k++) { c.beginPath(); c.moveTo(bx0 + k * 0.4 * S, by0); c.lineTo(bx0 + k * 0.4 * S + 0.2 * S, by0); c.lineTo(bx0 + k * 0.4 * S + 0.55 * S, by0 - 0.35 * S); c.lineTo(bx0 + k * 0.4 * S + 0.35 * S, by0 - 0.35 * S); c.fill(); }
        c.restore(); c.fillStyle = "#495057"; c.fillRect(X(b.x) - 0.15 * S, 0, 0.3 * S, Y(b.y + 1.5)); }
      else { c.fillStyle = "#8395a7"; c.fill(); c.strokeStyle = "#3d4a5a"; c.lineWidth = 2; c.stroke(); c.fillStyle = "#ffd23f"; const v = sh.wv; c.fillRect(X(v[3][0]), Y(v[3][1]), X(v[2][0]) - X(v[3][0]), 3); }
    },
    drawCar(c, car, X, Y, S, s) {
      const D = car.D, ch = car.ch;
      // wheels / treads behind
      if (D.tread) {
        const w0 = car.wheels[0], w1 = car.wheels[car.wheels.length - 1], r = w0.r + 0.1;
        c.save(); c.strokeStyle = "#222"; c.lineWidth = 0.18 * S; c.lineCap = "round";
        const ang = Math.atan2(w1.y - w0.y, w1.x - w0.x), nx = -Math.sin(ang) * r, ny = Math.cos(ang) * r;
        c.beginPath(); c.moveTo(X(w0.x + nx), Y(w0.y + ny)); c.lineTo(X(w1.x + nx), Y(w1.y + ny)); c.stroke();
        c.beginPath(); c.moveTo(X(w0.x - nx), Y(w0.y - ny)); c.lineTo(X(w1.x - nx), Y(w1.y - ny)); c.stroke();
        c.beginPath(); c.arc(X(w0.x), Y(w0.y), r * S, 0, 7); c.stroke(); c.beginPath(); c.arc(X(w1.x), Y(w1.y), r * S, 0, 7); c.stroke(); c.restore();
      }
      // suspension struts
      c.strokeStyle = "#555"; c.lineWidth = Math.max(2, 0.1 * S);
      for (const w of car.wheels) { const m = rot(ch, w.j.la); c.beginPath(); c.moveTo(X(ch.x + m[0] - Math.sin(ch.a) * 0.3), Y(ch.y + m[1] + Math.cos(ch.a) * 0.3)); c.lineTo(X(w.x), Y(w.y)); c.stroke(); }
      for (const w of car.wheels) {
        const r = w.r * S; c.save(); c.translate(X(w.x), Y(w.y)); c.rotate(-w.a);
        c.fillStyle = "#1e1e1e"; c.beginPath(); c.arc(0, 0, r, 0, 7); c.fill();
        if (D.wf) { c.fillStyle = "#333"; for (let k = 0; k < 10; k++) { c.save(); c.rotate(k * Math.PI / 5); c.fillRect(-r * 0.12, -r - 1, r * 0.24, r * 0.2); c.restore(); } }
        c.fillStyle = D.rim; c.beginPath(); c.arc(0, 0, r * 0.55, 0, 7); c.fill();
        c.strokeStyle = "#555"; c.lineWidth = Math.max(1.5, r * 0.12); for (let k = 0; k < 3; k++) { c.beginPath(); c.moveTo(0, 0); c.lineTo(Math.cos(k * 2.094) * r * 0.5, Math.sin(k * 2.094) * r * 0.5); c.stroke(); }
        c.restore();
      }
      // body (drawn in the car's frame; local y is up, so flip)
      c.save(); c.translate(X(ch.x), Y(ch.y)); c.rotate(-ch.a); c.scale(S, -S);
      const P = (v) => { c.beginPath(); v.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.closePath(); };
      const dk = shade(D.col, -0.3);
      c.lineWidth = 0.06; c.strokeStyle = dk; c.lineJoin = "round";
      if (D.cab) { P(D.cab); c.fillStyle = shade(D.col, 0.1); c.fill(); c.stroke(); }
      if (D.cage) { c.strokeStyle = "#333"; c.lineWidth = 0.08; c.beginPath(); c.moveTo(-0.9, 0.28); c.lineTo(-0.7, 1.15); c.lineTo(0.35, 1.1); c.lineTo(0.75, 0.3); c.stroke(); c.lineWidth = 0.06; c.strokeStyle = dk; }
      for (const v of D.body) { P(v); c.fillStyle = D.col; c.fill(); c.stroke(); }
      if (D.roof) { P(D.roof); c.fillStyle = shade(D.col, -0.15); c.fill(); c.stroke(); }
      // details
      c.fillStyle = "rgba(255,255,255,0.35)";
      if (D.body[0][0][0] < -2.5) { for (let k = -2.3; k < 1.3; k += 0.9) c.fillRect(k, 0.55, 0.7, 0.5); c.fillStyle = "#333"; c.fillRect(-2.7, 0.05, 5.4, 0.12); }
      else c.fillRect(D.body[0][0][0] + 0.2, 0.0, (D.body[0][1][0] - D.body[0][0][0]) * 0.6, 0.08);
      if (D.cab) { c.fillStyle = "rgba(170,220,255,0.75)"; const v = D.cab; P([[v[0][0] + 0.12, v[0][1] + 0.12], [v[1][0] - 0.2, v[1][1] + 0.12], [v[2][0] - 0.12, v[2][1] - 0.12], [v[3][0] + 0.12, v[3][1] - 0.12]]); c.fill(); }
      if (D.gun) { c.fillStyle = shade(D.col, -0.2); c.fillRect(0.5, 0.58, 1.6, 0.14); }
      if (D.spoiler) { c.fillStyle = dk; c.fillRect(-1.95, 0.55, 0.55, 0.1); c.fillRect(-1.75, 0.3, 0.08, 0.27); }
      c.fillStyle = "#fff6a8"; c.fillRect(D.body[0][1][0] - 0.12, D.body[0][1][1] + 0.12, 0.12, 0.14);
      c.restore();
      // the Big Dawg
      const hd = ch.sh.find(q => q.head);
      const face = s.phase === "crash" ? ":dawgpain:" : s.phase === "win" ? ":dawgpog:" : ":dawgW:";
      if (D.cab || D.roof) { c.save(); c.beginPath(); c.arc(X(hd.wx), Y(hd.wy), hd.r * S * 1.25, 0, 7); c.clip(); G.img(c, face, X(hd.wx), Y(hd.wy), hd.r * S * 2.6, -ch.a); c.restore(); }
      else G.img(c, face, X(hd.wx), Y(hd.wy), hd.r * S * 2.6, -ch.a);
      if (D.wind) { c.save(); c.translate(X(ch.x), Y(ch.y)); c.rotate(-ch.a); c.scale(S, -S); c.strokeStyle = "rgba(170,220,255,0.9)"; c.lineWidth = 0.09; c.beginPath(); c.moveTo(D.wind[0], D.wind[1]); c.lineTo(D.wind[2], D.wind[3]); c.stroke(); c.restore(); }
    },
    drawMenu(c, G, s) {
      const W = G.W, H = G.H, m = this.menuLayout(G);
      c.fillStyle = "rgba(10,14,30,0.9)"; c.fillRect(0, 0, W, H);
      G.text(c, "PICK A LEVEL", W / 2, 50, 14, "#ffd23f");
      G.text(c, `TOTAL ${total(s.p)}`, W / 2, 74, 9, "#fff");
      c.fillStyle = "#fff"; c.font = "bold 22px system-ui"; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText("✕", W - 28, 48);
      LEVELS.forEach((lv, i) => {
        const col = i % m.cols, row = Math.floor(i / m.cols), x = m.pad + col * m.cw + 4, y = m.top + row * m.chh + 4, w = m.cw - 8, h = m.chh - 8;
        const lock = i > s.p.u, pts = s.p.b[i];
        c.fillStyle = lock ? "#2c3346" : i === s.li ? "#ffd23f" : pts ? "#3a7d44" : "#2f6fb3";
        c.beginPath(); c.roundRect ? c.roundRect(x, y, w, h, 10) : c.rect(x, y, w, h); c.fill();
        if (lock) G.emoji(c, "🔒", x + w / 2, y + h / 2, Math.min(18, h * 0.4));
        else {
          G.text(c, String(i + 1), x + w / 2, y + h * 0.4, Math.min(14, h * 0.28), i === s.li ? "#222" : "#fff");
          if (pts) G.text(c, "★".repeat(stars(pts)), x + w / 2, y + h * 0.75, Math.min(9, h * 0.18), i === s.li ? "#7a4f00" : "#ffd23f");
          
        }
      });
      const by = m.top + Math.ceil(LEVELS.length / m.cols) * m.chh + 26;
      G.text(c, "TAP OUTSIDE TO CLOSE", W / 2, Math.min(H - 20, by), 8, "#aaa");
    }
  };
  function shade(hex, f) {
    const n = parseInt(hex.slice(1), 16); let r = n >> 16, g = (n >> 8) & 255, b = n & 255;
    const t = f < 0 ? 0 : 255, p = Math.abs(f); r = Math.round((t - r) * p + r); g = Math.round((t - g) * p + g); b = Math.round((t - b) * p + b);
    return "rgb(" + r + "," + g + "," + b + ")";
  }
  defGame(def);
})();
