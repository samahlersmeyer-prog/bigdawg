// ---------- Dawg Pool (8-ball vs the pool shark cat) ----------
// Top-down 8-ball. Drag anywhere to swing the cue around the cue ball (tap to aim straight at a spot),
// pull the POWER slider on the right down and let go to shoot. Fouls give ball-in-hand (drag the cue ball).
// One rack vs the cat. Score: 50 per ball of yours you sink, +300 for the rack, +500 for the match win.
(function () {
  const COL = ["#fafafa", "#f5c400", "#1d4ed8", "#d42a2a", "#6b2fa0", "#f07a12", "#108a3e", "#8a1f1f", "#111"];
  const bcol = n => n === 8 ? "#111" : COL[n > 8 ? n - 8 : n];
  const grp = n => n >= 1 && n <= 7 ? "s" : n >= 9 ? "t" : null;
  const OTHER = { p: "c", c: "p" };
  const NEED = 1;                    // racks needed to win the match (one rack keeps it to ~3-5 minutes)
  const AIMERR = [0.032, 0.014];     // cat aim error (radians): sloppy on the break, sharpens as the table clears
  const TOP = 78;

  function layout(G) {
    const W = G.W, H = G.H, rail = Math.max(12, Math.min(18, W * 0.04));
    const slW = 46, aw = W - slW - 18, ah = H - TOP - 8;
    let w = Math.min(aw - 2 * rail, (ah - 2 * rail) / 1.5), h = Math.min(ah - 2 * rail, w * 2);
    const ox = 6 + (aw - (w + 2 * rail)) / 2 + rail, oy = TOP + (ah - (h + 2 * rail)) / 2 + rail;
    const R = Math.max(7, w * 0.034);
    const pc = R * 1.85, ps = R * 1.65, so = R * 0.3;
    const pockets = [
      { x: 0, y: 0, r: pc }, { x: w, y: 0, r: pc }, { x: -so, y: h / 2, r: ps, side: 1 },
      { x: w + so, y: h / 2, r: ps, side: 1 }, { x: 0, y: h, r: pc }, { x: w, y: h, r: pc }];
    return { ox, oy, w, h, rail, R, pockets, slX: W - slW - 6, slW, slY: oy - rail, slH: h + 2 * rail,
      headY: h * 0.75, footY: h * 0.25, A: w * 0.8, VMAX: w * 5.2 };
  }

  function rack(G, breaker) {
    const s = G.s, L = s.L, R = L.R, b = [];
    b.push({ n: 0, x: L.w / 2, y: L.headY + L.h * 0.06, vx: 0, vy: 0, in: true, sink: 0 });
    // standard-ish rack: 8 in the middle, mixed corners
    const order = [1, 9, 2, 10, 8, 3, 11, 4, 12, 5, 13, 6, 14, 7, 15];
    // shuffle all but the 8 (index 4) a bit, keep back corners one of each
    const rest = order.filter(n => n !== 8).sort(() => Math.random() - 0.5);
    const slots = [];
    for (let r = 0; r < 5; r++) for (let j = 0; j <= r; j++) slots.push([r, j]);
    let k = 0;
    const cornA = rest.find(n => n < 8), cornB = rest.find(n => n > 8);
    const pool = rest.filter(n => n !== cornA && n !== cornB);
    slots.forEach(([r, j], i) => {
      let n;
      if (r === 2 && j === 1) n = 8; else if (r === 4 && j === 0) n = cornA; else if (r === 4 && j === 4) n = cornB; else n = pool[k++];
      const dx = (j - r / 2) * (2 * R + 0.3), dy = -r * (2 * R + 0.3) * 0.866;
      b.push({ n, x: L.w / 2 + dx, y: L.footY + dy, vx: 0, vy: 0, in: true, sink: 0 });
    });
    s.balls = b; s.cue = b[0];
    s.groups = { p: null, c: null }; s.turn = breaker; s.breakShot = true; s.bih = true;
    s.phase = "aim"; s.power = 0; s.aim = -Math.PI / 2; s.cpu = null; s.shot = null;
    s.potted = { p: [], c: [] };
    say(s, breaker === "p" ? "YOUR BREAK" : "SHARK BREAKS", "#ffd23f", 1.6);
  }

  function say(s, msg, col, t) { s.msg = msg; s.msgC = col || "#ffd23f"; s.msgT = t || 1.6; }

  function legal(s, who) {
    const g = s.groups[who], out = [];
    s.balls.forEach(b => { if (b.in && b.n !== 0 && b.n !== 8 && (!g || grp(b.n) === g)) out.push(b); });
    if (g && !out.length) { const e = s.balls.find(b => b.n === 8 && b.in); if (e) out.push(e); }
    if (!g && !out.length) { const e = s.balls.find(b => b.n === 8 && b.in); if (e) out.push(e); }
    return out;
  }
  const cleared = (s, who) => !!s.groups[who] && !s.balls.some(b => b.in && grp(b.n) === s.groups[who]);

  // distance from point to segment
  function segD(px, py, ax, ay, bx, by) {
    const dx = bx - ax, dy = by - ay, l2 = dx * dx + dy * dy || 1;
    let t = ((px - ax) * dx + (py - ay) * dy) / l2; t = Math.max(0, Math.min(1, t));
    return Math.hypot(px - ax - t * dx, py - ay - t * dy);
  }
  function clear(s, ax, ay, bx, by, skipA, skipB, rr) {
    for (const b of s.balls) { if (!b.in || b === skipA || b === skipB) continue; if (segD(b.x, b.y, ax, ay, bx, by) < rr) return false; }
    return true;
  }

  // best pot for `who` with the cue ball at (cx, cy)
  function plan(s, who, cx, cy) {
    const L = s.L, R = L.R, cue = s.cue, tg = legal(s, who);
    let best = null;
    for (const b of tg) for (const P of L.pockets) {
      const px = P.side ? (P.x < 0 ? -R * 0.2 : L.w + R * 0.2) : P.x, py = P.y;
      const d2 = Math.hypot(px - b.x, py - b.y); if (d2 < 1) continue;
      const ux = (px - b.x) / d2, uy = (py - b.y) / d2;
      if (P.side && Math.abs(ux) < 0.4) continue;
      const gx = b.x - ux * 2 * R, gy = b.y - uy * 2 * R;
      if (gx < R * 0.9 || gx > L.w - R * 0.9 || gy < R * 0.9 || gy > L.h - R * 0.9) continue;
      const vx = gx - cx, vy = gy - cy, d1 = Math.hypot(vx, vy); if (d1 < 1) continue;
      const cosc = (vx * ux + vy * uy) / d1; if (cosc < 0.3) continue;
      if (!clear(s, cx, cy, gx, gy, cue, b, 2 * R - 0.5)) continue;
      if (!clear(s, b.x, b.y, px, py, cue, b, 2 * R - 0.5)) continue;
      const vObj = Math.sqrt(2 * L.A * d2) * 1.3 + L.w * 0.25;
      const vC = vObj / (cosc * 0.95), v0 = Math.sqrt(vC * vC + 2 * L.A * d1) * 1.12;
      const pow = Math.max(0.12, Math.min(1, v0 / L.VMAX));
      const sc = cosc * cosc * cosc / (1 + (d1 + 1.6 * d2) / L.w) * (v0 > L.VMAX ? 0.4 : 1);
      if (!best || sc > best.sc) best = { sc, ang: Math.atan2(vy, vx), pow, b };
    }
    return best;
  }
  function fallback(s, who) {
    const cue = s.cue, tg = legal(s, who); let best = null;
    for (const b of tg) {
      const d = Math.hypot(b.x - cue.x, b.y - cue.y);
      const ok = clear(s, cue.x, cue.y, b.x, b.y, cue, b, 2 * s.L.R - 0.5);
      const sc = (ok ? 2 : 1) / (1 + d / s.L.w);
      if (!best || sc > best.sc) best = { sc, ang: Math.atan2(b.y - cue.y, b.x - cue.x), pow: 0.45, b };
    }
    return best || { ang: s.aim, pow: 0.5 };
  }
  function cueOk(s, x, y) {
    const L = s.L, R = L.R;
    if (x < R || x > L.w - R || y < R || y > L.h - R) return false;
    if (s.breakShot && y < L.headY) return false;
    for (const b of s.balls) if (b.in && b !== s.cue && Math.hypot(b.x - x, b.y - y) < 2 * R + 1) return false;
    return true;
  }
  function placeCue(s, who) { // pick a ball-in-hand spot
    const L = s.L; let best = null;
    for (let i = 0; i < 40; i++) {
      const x = L.R + Math.random() * (L.w - 2 * L.R), y = s.breakShot ? L.headY + Math.random() * (L.h - L.headY - L.R) : L.R + Math.random() * (L.h - 2 * L.R);
      if (!cueOk(s, x, y)) continue;
      const p = plan(s, who, x, y); const sc = p ? p.sc : 0;
      if (!best || sc > best.sc) best = { x, y, sc };
    }
    if (best) { s.cue.x = best.x; s.cue.y = best.y; }
  }
  function cpuChoose(s, who, err) {
    if (s.breakShot) {
      const apex = s.balls.reduce((m, b) => b.n && b.in && (!m || b.y > m.y) ? b : m, null);
      return { ang: Math.atan2(apex.y - s.cue.y, apex.x - s.cue.x) + (Math.random() - 0.5) * 0.03, pow: 0.95 + Math.random() * 0.05 };
    }
    const p = plan(s, who, s.cue.x, s.cue.y) || fallback(s, who);
    const g = (Math.random() + Math.random() + Math.random() - 1.5) * 1.41; // ~N(0,0.5)*1.41 -> sigma ~0.7
    return { ang: p.ang + g * err * 1.4, pow: Math.min(1, p.pow * (0.95 + Math.random() * 0.12)) };
  }

  function shoot(G, ang, pow) {
    const s = G.s, L = s.L; if (s.phase !== "aim" || !s.cue.in) return;
    s.aim = ang; const v = L.VMAX * Math.max(0.05, Math.min(1, pow));
    s.cue.vx = Math.cos(ang) * v; s.cue.vy = Math.sin(ang) * v;
    s.phase = "roll"; s.power = 0; s.bih = false; s.cpu = null; s.drag = null;
    s.shot = { first: null, pots: [], scratch: false, clr: cleared(s, s.turn), rt: 0 };
    G.sfx("pop");
  }

  function physics(G, dt) {
    const s = G.s, L = s.L, R = L.R, B = s.balls;
    let vm = 0; for (const b of B) if (b.in) vm = Math.max(vm, Math.abs(b.vx) + Math.abs(b.vy));
    const n = Math.max(4, Math.min(40, Math.ceil(vm * dt / (R * 0.25)))), h = dt / n;
    const mc = L.pockets[0].r * 0.95, ms = L.pockets[2].r * 0.95;
    for (let k = 0; k < n; k++) {
      for (const b of B) {
        if (!b.in || (b.vx === 0 && b.vy === 0)) continue;
        b.x += b.vx * h; b.y += b.vy * h;
        let sunk = false;
        for (const P of L.pockets) if (Math.hypot(b.x - P.x, b.y - P.y) < P.r) {
          b.in = false; b.sink = 0.3; b.sx = P.x; b.sy = P.y; b.vx = b.vy = 0; sunk = true;
          if (b.n === 0) s.shot.scratch = true; else s.shot.pots.push(b.n);
          G.sfx(b.n === 0 ? "lose" : "pop"); break;
        }
        if (sunk) continue;
        const e = 0.78;
        const mouthX = b.y < mc || b.y > L.h - mc || Math.abs(b.y - L.h / 2) < ms, mouthY = b.x < mc || b.x > L.w - mc;
        if (!mouthX) { if (b.x < R) { b.x = R; b.vx = -b.vx * e; b.vy *= 0.94; } else if (b.x > L.w - R) { b.x = L.w - R; b.vx = -b.vx * e; b.vy *= 0.94; } }
        if (!mouthY) { if (b.y < R) { b.y = R; b.vy = -b.vy * e; b.vx *= 0.94; } else if (b.y > L.h - R) { b.y = L.h - R; b.vy = -b.vy * e; b.vx *= 0.94; } }
        if (b.x < -R || b.x > L.w + R || b.y < -R || b.y > L.h + R) { // escaped through a mouth: it's in
          const P = L.pockets.reduce((m, q) => Math.hypot(q.x - b.x, q.y - b.y) < Math.hypot(m.x - b.x, m.y - b.y) ? q : m);
          b.in = false; b.sink = 0.3; b.sx = P.x; b.sy = P.y; b.vx = b.vy = 0;
          if (b.n === 0) s.shot.scratch = true; else s.shot.pots.push(b.n);
        }
      }
      for (let i = 0; i < B.length; i++) {
        const a = B[i]; if (!a.in) continue;
        for (let j = i + 1; j < B.length; j++) {
          const b = B[j]; if (!b.in) continue;
          const dx = b.x - a.x, dy = b.y - a.y, d2 = dx * dx + dy * dy;
          if (d2 >= 4 * R * R || d2 === 0) continue;
          // rewind to the moment of contact so the hit angle is exact
          const rvx = b.vx - a.vx, rvy = b.vy - a.vy, vv = rvx * rvx + rvy * rvy;
          let tau = 0;
          if (vv > 1e-6) { const pb = dx * rvx + dy * rvy, disc = pb * pb - vv * (d2 - 4 * R * R); if (disc >= 0) tau = Math.max(0, Math.min(h * 2, (pb + Math.sqrt(disc)) / vv)); }
          a.x -= a.vx * tau; a.y -= a.vy * tau; b.x -= b.vx * tau; b.y -= b.vy * tau;
          let ex = b.x - a.x, ey = b.y - a.y, d = Math.hypot(ex, ey) || 1; const nx = ex / d, ny = ey / d;
          if (d < 2 * R) { const ov = (2 * R - d) / 2; a.x -= nx * ov; a.y -= ny * ov; b.x += nx * ov; b.y += ny * ov; }
          const vn = (a.vx - b.vx) * nx + (a.vy - b.vy) * ny;
          if (vn > 0) {
            const im = vn * 0.97; a.vx -= im * nx; a.vy -= im * ny; b.vx += im * nx; b.vy += im * ny;
            if (s.shot && s.shot.first === null && (a.n === 0 || b.n === 0)) s.shot.first = a.n === 0 ? b.n : a.n;
          }
          a.x += a.vx * tau; a.y += a.vy * tau; b.x += b.vx * tau; b.y += b.vy * tau;
        }
      }
    }
    for (const b of B) {
      if (!b.in) continue; const sp = Math.hypot(b.vx, b.vy); if (!sp) continue;
      const ns = Math.max(0, sp - L.A * dt) * (1 - 0.25 * dt);
      if (ns < L.w * 0.012) { b.vx = b.vy = 0; } else { b.vx *= ns / sp; b.vy *= ns / sp; }
    }
  }

  function resolve(G) {
    const s = G.s, L = s.L, sh = s.turn, op = OTHER[sh], sht = s.shot, pots = sht.pots;
    let foul = sht.scratch || sht.first === null, why = sht.first === null ? "NO BALL HIT!" : "SCRATCH!";
    if (!foul && !s.breakShot) {
      const f = sht.first, g = s.groups[sh];
      if (g ? (sht.clr ? f !== 8 : (f === 8 || grp(f) !== g)) : f === 8) { foul = true; why = "WRONG BALL FIRST!"; }
    }
    if (pots.includes(8)) {
      if (s.breakShot) { // re-spot the 8 on the break
        const e = s.balls.find(b => b.n === 8); e.in = true; e.sink = 0; e.x = L.w / 2; e.y = L.footY;
        for (let t = 0; t < 30 && s.balls.some(b => b !== e && b.in && Math.hypot(b.x - e.x, b.y - e.y) < 2 * L.R); t++) e.y -= L.R;
        pots.splice(pots.indexOf(8), 1);
      } else {
        const won = sht.clr && !sht.scratch && !foul;
        endRack(G, won ? sh : op, won ? (sh === "p" ? "YOU SANK THE 8!" : "SHARK SANK THE 8") : (sh === "p" ? (sht.clr ? "YOU FOULED ON THE 8" : "YOU SANK THE 8 EARLY") : (sht.clr ? "SHARK FOULED ON THE 8!" : "SHARK SANK THE 8 EARLY!")));
        return;
      }
    }
    if (!s.groups.p && !foul) {
      const f = pots.find(n => n !== 8); if (f) { s.groups[sh] = grp(f); s.groups[op] = grp(f) === "s" ? "t" : "s"; say(s, (sh === "p" ? "YOU: " : "SHARK: ") + (grp(f) === "s" ? "SOLIDS" : "STRIPES"), "#7fe08a", 1.4); }
    }
    pots.forEach(n => { const owner = s.groups.p && grp(n) === s.groups.p ? "p" : s.groups.c && grp(n) === s.groups.c ? "c" : null; if (owner) s.potted[owner].push(n); });
    if (sh === "p" && s.groups.p) pots.forEach(n => { if (grp(n) === s.groups.p) s.score += 50; });
    const keep = !foul && pots.some(n => n !== 8 && (!s.groups[sh] || grp(n) === s.groups[sh]));
    s.breakShot = false; s.shot = null;
    if (!s.cue.in) { s.cue.in = true; s.cue.sink = 0; s.cue.vx = s.cue.vy = 0; s.cue.x = L.w / 2; s.cue.y = L.headY; let t = 0; while (!cueOk(s, s.cue.x, s.cue.y) && t++ < 40) { s.cue.x = L.R + Math.random() * (L.w - 2 * L.R); s.cue.y = L.R + Math.random() * (L.h - 2 * L.R); } }
    if (foul) { s.turn = op; s.bih = true; say(s, why + (op === "p" ? " BALL IN HAND" : ""), "#ff6b6b", 1.8); G.buzz(); }
    else if (!keep) { s.turn = op; s.bih = false; if (s.msgT <= 0) say(s, op === "p" ? "YOUR SHOT" : "SHARK'S SHOT", "#ffd23f", 1.0); }
    s.phase = "aim"; s.power = 0;
    if (s.turn === "p") { const p = fallback(s, "p"); s.aim = p.ang; }
  }

  function endRack(G, who, why) {
    const s = G.s; s.wins[who]++; s.phase = "end"; s.endT = 2.6; s.shot = null;
    if (who === "p") { s.score += 300 + (why.includes("8") ? 50 : 0); G.sfx("win"); } else G.sfx("lose");
    say(s, who === "p" ? "YOU WIN!" : "SHARK WINS", who === "p" ? "#7fe08a" : "#ff6b6b", 2.6); s.sub = why;
  }

  // screen <-> table
  const tx = (s, x) => x - s.L.ox, ty = (s, y) => y - s.L.oy;

  defGame({
    key: "pool", name: "Dawg Pool", icon: "🎱", max: 9999, cat: "sports",
    blurb: "8-ball vs the pool shark cat.",
    how: "One rack of 8-ball vs the pool shark cat. Drag anywhere to swing the cue (or tap a spot to aim at it). Pull the POWER slider down and let go to shoot. Sink your group (solids or stripes), then the 8. Scratch or miss = ball in hand: drag the cue ball. Early 8 loses the rack. 50 per ball, 300 per rack, 500 for the match.",
    reset(G) {
      G.s = { L: layout(G), wins: { p: 0, c: 0 }, rackN: 1, score: 0, msg: "", msgT: 0, sub: "", drag: null, power: 0 };
      rack(G, "p");
    },
    update(G, dt) {
      const s = G.s, L = s.L;
      if (s.msgT > 0) s.msgT -= dt;
      s.balls.forEach(b => { if (b.sink > 0) b.sink = Math.max(0, b.sink - dt); });
      if (s.phase === "roll") {
        physics(G, dt); s.shot.rt += dt;
        if (s.balls.every(b => !b.in || (b.vx === 0 && b.vy === 0)) && s.balls.every(b => b.sink <= 0) || s.shot.rt > 14) {
          if (s.shot.rt > 14) s.balls.forEach(b => b.vx = b.vy = 0);
          resolve(G);
        }
      } else if (s.phase === "end") {
        s.endT -= dt;
        if (s.endT <= 0) {
          if (s.wins.p >= NEED || s.wins.c >= NEED) {
            const won = s.wins.p >= NEED; if (won) s.score += 500;
            G.over(Math.min(9999, s.score), won ? "Table cleared. Good dawg!" : "Hustled by the cat.");
            return;
          }
          s.rackN++; s.sub = ""; rack(G, s.rackN % 2 ? "p" : "c");
        }
      } else if (s.phase === "aim" && s.turn === "c") {
        if (!s.cpu) {
          if (s.bih && !s.breakShot) placeCue(s, "c");
          const left = s.balls.filter(b => b.in && b.n).length, k = Math.min(1, (15 - left) / 12);
          const ch = cpuChoose(s, "c", AIMERR[0] + (AIMERR[1] - AIMERR[0]) * k);
          let d = ch.ang - s.aim; d = Math.atan2(Math.sin(d), Math.cos(d));
          s.cpu = { t: 0, from: s.aim, d, ang: ch.ang, pow: ch.pow };
        }
        const c = s.cpu; c.t += dt;
        const T1 = 0.6, T2 = 1.25, T3 = 1.75;
        if (c.t < T1) { /* think */ }
        else if (c.t < T2) { const k = (c.t - T1) / (T2 - T1), e = k * k * (3 - 2 * k); s.aim = c.from + c.d * e; }
        else if (c.t < T3) { s.aim = c.ang; s.power = c.pow * (c.t - T2) / (T3 - T2); }
        else shoot(G, c.ang, c.pow);
      }
    },
    down(G, x, y) {
      const s = G.s, L = s.L; if (s.phase !== "aim" || s.turn !== "p") return;
      if (x >= L.slX - 8) { s.drag = { k: "sl", y0: y }; return; }
      const cx = L.ox + s.cue.x, cy = L.oy + s.cue.y;
      if (s.bih && Math.hypot(x - cx, y - cy) < Math.max(30, L.R * 3)) { s.drag = { k: "cue", dx: cx - x, dy: cy - y }; return; }
      s.drag = { k: "aim", a0: Math.atan2(y - cy, x - cx), aim0: s.aim };
    },
    move(G, x, y) {
      const s = G.s, L = s.L, d = s.drag; if (!d || s.phase !== "aim" || s.turn !== "p") return;
      if (d.k === "sl") s.power = Math.max(0, Math.min(1, (y - d.y0) / (L.slH * 0.8)));
      else if (d.k === "cue") {
        let nx = tx(s, x + d.dx), ny = ty(s, y + d.dy);
        nx = Math.max(L.R, Math.min(L.w - L.R, nx)); ny = Math.max(s.breakShot ? L.headY : L.R, Math.min(L.h - L.R, ny));
        if (cueOk(s, nx, ny)) { s.cue.x = nx; s.cue.y = ny; }
      } else {
        const cx = L.ox + s.cue.x, cy = L.oy + s.cue.y;
        if (Math.hypot(x - cx, y - cy) < L.R * 1.5) return;
        const a = Math.atan2(y - cy, x - cx); s.aim = d.aim0 + (a - d.a0);
      }
    },
    up(G) {
      const s = G.s, d = s.drag; s.drag = null; if (!d || s.phase !== "aim" || s.turn !== "p") return;
      if (d.k === "sl") { if (s.power > 0.04) shoot(G, s.aim, s.power); else s.power = 0; }
      s.lastDrag = d.k;
    },
    tap(G, x, y) {
      const s = G.s, L = s.L; if (s.phase !== "aim" || s.turn !== "p" || s.lastDrag !== "aim") return;
      const cx = L.ox + s.cue.x, cy = L.oy + s.cue.y;
      if (Math.hypot(x - cx, y - cy) > L.R * 1.5) s.aim = Math.atan2(y - cy, x - cx);
    },
    onKey(G, k, isDown) {
      const s = G.s; if (!isDown || s.phase !== "aim" || s.turn !== "p") return;
      if (k === "ArrowLeft") s.aim -= 0.02; else if (k === "ArrowRight") s.aim += 0.02;
      else if (k === "ArrowDown") s.power = Math.min(1, s.power + 0.1); else if (k === "ArrowUp") s.power = Math.max(0, s.power - 0.1);
      else if (k === " " && s.power > 0.04) shoot(G, s.aim, s.power);
    },
    // test hooks
    _plan(G) { const s = G.s; if (s.bih && !s.breakShot) placeCue(s, "p"); return cpuChoose(s, "p", 0.006); },
    _shoot(G, a, p) { shoot(G, a, p); },
    _raw(G) { return plan(G.s, "p", G.s.cue.x, G.s.cue.y); },

    draw(G, c) {
      const s = G.s, L = s.L, W = G.W, H = G.H, dark = G.dark(), R = L.R;
      c.fillStyle = dark ? "#15110e" : "#d9c6a5"; c.fillRect(0, 0, W, H);
      c.fillStyle = dark ? "#1c1713" : "#cfb995"; for (let y = 0; y < H; y += 28) c.fillRect(0, y, W, 14);
      // table
      const ox = L.ox, oy = L.oy, rl = L.rail;
      c.fillStyle = "rgba(0,0,0,0.35)"; c.fillRect(ox - rl + 4, oy - rl + 6, L.w + 2 * rl, L.h + 2 * rl);
      c.fillStyle = dark ? "#5e3818" : "#8a5226"; rr(c, ox - rl, oy - rl, L.w + 2 * rl, L.h + 2 * rl, 10); c.fill();
      c.fillStyle = dark ? "#74461f" : "#a3652f"; rr(c, ox - rl + 3, oy - rl + 3, L.w + 2 * rl - 6, L.h + 2 * rl - 6, 8); c.fill();
      c.fillStyle = dark ? "#0f5a32" : "#15894a"; c.fillRect(ox - 3, oy - 3, L.w + 6, L.h + 6);
      c.fillStyle = dark ? "#137040" : "#1fa05a"; c.fillRect(ox, oy, L.w, L.h);
      c.strokeStyle = "rgba(255,255,255,0.12)"; c.lineWidth = 1; c.beginPath(); c.moveTo(ox, oy + L.headY); c.lineTo(ox + L.w, oy + L.headY); c.stroke();
      c.fillStyle = "rgba(255,255,255,0.25)"; c.beginPath(); c.arc(ox + L.w / 2, oy + L.footY, 2, 0, 7); c.fill();
      // diamonds
      c.fillStyle = "#f3e6c4";
      const dia = (x, y) => { c.beginPath(); c.moveTo(x, y - 3); c.lineTo(x + 2.5, y); c.lineTo(x, y + 3); c.lineTo(x - 2.5, y); c.fill(); };
      for (const k of [1, 2, 3, 5, 6, 7]) { dia(ox - rl / 2 - 1, oy + L.h * k / 8); dia(ox + L.w + rl / 2 + 1, oy + L.h * k / 8); }
      for (const k of [1, 2, 3]) { dia(ox + L.w * k / 4, oy - rl / 2 - 1); dia(ox + L.w * k / 4, oy + L.h + rl / 2 + 1); }
      // pockets
      L.pockets.forEach(P => { c.fillStyle = "#0a0a0a"; c.beginPath(); c.arc(ox + P.x, oy + P.y, P.r * (P.side ? 0.95 : 0.92), 0, 7); c.fill(); c.strokeStyle = "#3a2a1a"; c.lineWidth = 2; c.stroke(); });
      // balls
      s.balls.forEach(b => {
        if (b.in) ball(c, b.n, ox + b.x, oy + b.y, R);
        else if (b.sink > 0) ball(c, b.n, ox + b.sx, oy + b.sy, R * (b.sink / 0.3) * 0.9);
      });
      // aim guide + cue
      const aiming = s.phase === "aim" && s.cue.in, mine = s.turn === "p";
      if (aiming && (mine || (s.cpu && s.cpu.t > 0.6))) {
        const cx = ox + s.cue.x, cy = oy + s.cue.y, dx = Math.cos(s.aim), dy = Math.sin(s.aim);
        if (mine) guide(c, s, dx, dy);
        const off = R + 3 + s.power * 70, len = Math.min(L.h * 0.85, 260);
        c.save(); c.beginPath(); c.rect(0, TOP - 4, L.slX - 4, H); c.clip(); c.translate(cx, cy); c.rotate(s.aim);
        c.fillStyle = "rgba(0,0,0,0.25)"; c.beginPath(); c.moveTo(-off, 4); c.lineTo(-off - len, 8); c.lineTo(-off - len, 14); c.lineTo(-off, 7); c.fill();
        c.fillStyle = "#e9c88f"; c.beginPath(); c.moveTo(-off, -2); c.lineTo(-off - len, -4.5); c.lineTo(-off - len, 4.5); c.lineTo(-off, 2); c.fill();
        c.fillStyle = "#3a1f10"; c.beginPath(); c.moveTo(-off - len * 0.62, -3.6); c.lineTo(-off - len, -4.5); c.lineTo(-off - len, 4.5); c.lineTo(-off - len * 0.62, 3.6); c.fill();
        c.fillStyle = "#fafafa"; c.fillRect(-off - 5, -2, 5, 4); c.fillStyle = "#4aa0ff"; c.fillRect(-off - 1.5, -2, 1.5, 4);
        c.restore();
      }
      if (aiming && mine && s.bih) {
        const cx = ox + s.cue.x, cy = oy + s.cue.y, p = 0.5 + 0.5 * Math.sin(G.t * 6);
        c.strokeStyle = `rgba(255,210,63,${0.5 + 0.5 * p})`; c.lineWidth = 2.5; c.beginPath(); c.arc(cx, cy, R + 5 + p * 3, 0, 7); c.stroke();
        G.emoji(c, "✋", cx + R + 12, cy - R - 10, 18);
      }
      // power slider
      const sx = L.slX, sy = L.slY, sw = L.slW, sh = L.slH;
      c.fillStyle = dark ? "#2a2018" : "#5a3a20"; rr(c, sx, sy, sw, sh, 12); c.fill();
      c.fillStyle = "#0e0e14"; rr(c, sx + 8, sy + 26, sw - 16, sh - 40, 8); c.fill();
      const ph = (sh - 44) * s.power;
      if (ph > 0) { const gr = c.createLinearGradient(0, sy + 28, 0, sy + sh - 16); gr.addColorStop(0, "#5fe07a"); gr.addColorStop(0.55, "#ffd23f"); gr.addColorStop(1, "#ff4d4d"); c.fillStyle = gr; rr(c, sx + 10, sy + 28, sw - 20, ph, 6); c.fill(); }
      const hy = sy + 28 + ph;
      c.fillStyle = (s.turn === "p" && s.phase === "aim") ? "#ffd23f" : "#8a8a8a"; rr(c, sx + 3, hy - 8, sw - 6, 16, 6); c.fill();
      c.fillStyle = "rgba(0,0,0,0.35)"; c.fillRect(sx + 10, hy - 2, sw - 20, 1.5); c.fillRect(sx + 10, hy + 1.5, sw - 20, 1.5);
      G.text(c, "PWR", sx + sw / 2, sy + 14, 10, "#ffd23f");
      G.text(c, "▼", sx + sw / 2, sy + sh - 8, 10, "rgba(255,255,255,0.6)");
      // turn strip
      const pw = (W - 18) / 2;
      side(G, c, s, "p", 6, pw); side(G, c, s, "c", 12 + pw, pw);
      G.hud(c, `SCORE ${s.score}`, "8-BALL", `${s.potted.p.length}/7`);
      if (s.msgT > 0) {
        c.save(); c.globalAlpha = Math.min(1, s.msgT * 2.5);
        const yy = oy + L.h * 0.5;
        G.banner(c, s.msg, s.msgC, yy, Math.max(14, Math.min(22, L.w / 13)));
        if (s.phase === "end" && s.sub) G.text(c, s.sub, ox + L.w / 2 + 0, yy + 30, 10, "#fff");
        c.restore();
      }
      if (G.state === "play" && s.turn === "p" && s.phase === "aim") {
        if (s.bih && G.t > 6) G.hint(c, "DRAG CUE BALL TO MOVE", G.t + 1, H - 30);
        else G.hint(c, "DRAG TO AIM, PULL PWR DOWN", 7, H - 30);
      }
    }
  });

  function side(G, c, s, who, x, w) {
    const on = s.turn === who && s.phase !== "end", y = 38, h = 36;
    c.save(); c.globalAlpha = on ? 1 : 0.55;
    c.fillStyle = on ? "rgba(255,210,63,0.22)" : "rgba(0,0,0,0.25)"; rr(c, x, y, w, h, 10); c.fill();
    if (on) { c.strokeStyle = "#ffd23f"; c.lineWidth = 2; rr(c, x, y, w, h, 10); c.stroke(); }
    if (who === "p") G.img(c, on ? ":dawgW:" : ":dawgsus:", x + 19, y + h / 2, 30); else G.emoji(c, "🐈", x + 19, y + h / 2 + 1, 24);
    const dark = G.dark();
    G.text(c, who === "p" ? "YOU" : "SHARK", x + 38, y + 12, 10, dark || on ? "#fff" : "#2a1a0a", "left");
    const g = s.groups[who];
    if (!g) G.text(c, "OPEN", x + 38, y + 27, 10, dark ? "#bbb" : "#4a3a2a", "left");
    else {
      const left = s.balls.filter(b => b.in && grp(b.n) === g).map(b => b.n);
      if (!left.length) { ball(c, 8, x + 44, y + 26, 6); }
      else { const step = Math.min(13, (w - 46) / left.length); left.forEach((n, i) => ball(c, n, x + 44 + i * step, y + 26, 5.5)); }
    }
    c.restore();
  }

  function guide(c, s, dx, dy) {
    const L = s.L, R = L.R, ox = L.ox, oy = L.oy, cx = s.cue.x, cy = s.cue.y;
    let t = 1e9, hit = null;
    for (const b of s.balls) {
      if (!b.in || b === s.cue) continue;
      const fx = cx - b.x, fy = cy - b.y, bb = fx * dx + fy * dy, cc = fx * fx + fy * fy - 4 * R * R, disc = bb * bb - cc;
      if (disc < 0) continue; const tt = -bb - Math.sqrt(disc);
      if (tt > 0 && tt < t) { t = tt; hit = b; }
    }
    const tw = Math.min(dx > 0 ? (L.w - R - cx) / dx : dx < 0 ? (R - cx) / dx : 1e9, dy > 0 ? (L.h - R - cy) / dy : dy < 0 ? (R - cy) / dy : 1e9);
    if (tw < t) { t = tw; hit = null; }
    const ex = cx + dx * t, ey = cy + dy * t;
    c.save(); c.strokeStyle = "rgba(255,255,255,0.85)"; c.lineWidth = 2; c.setLineDash([5, 5]);
    c.beginPath(); c.moveTo(ox + cx, oy + cy); c.lineTo(ox + ex, oy + ey); c.stroke(); c.setLineDash([]);
    c.beginPath(); c.arc(ox + ex, oy + ey, R, 0, 7); c.stroke();
    if (hit) {
      const nx = (hit.x - ex) / (2 * R), ny = (hit.y - ey) / (2 * R), dot = dx * nx + dy * ny, gl = 18 + 46 * dot;
      const s8 = s.turn === "p" ? legal(s, "p").includes(hit) : true;
      c.strokeStyle = s8 ? "rgba(255,255,255,0.9)" : "rgba(255,90,90,0.95)"; c.lineWidth = 2.5;
      c.beginPath(); c.moveTo(ox + hit.x, oy + hit.y); c.lineTo(ox + hit.x + nx * gl, oy + hit.y + ny * gl); c.stroke();
      const tx2 = dx - dot * nx, ty2 = dy - dot * ny, tl = 40 * Math.hypot(tx2, ty2);
      if (tl > 4) { c.strokeStyle = "rgba(255,255,255,0.4)"; c.lineWidth = 1.5; c.beginPath(); c.moveTo(ox + ex, oy + ey); c.lineTo(ox + ex + tx2 / Math.hypot(tx2, ty2) * tl, oy + ey + ty2 / Math.hypot(tx2, ty2) * tl); c.stroke(); }
      if (!s8) { c.strokeStyle = "rgba(255,90,90,0.95)"; c.lineWidth = 2; c.beginPath(); c.moveTo(ox + ex - 5, oy + ey - 5); c.lineTo(ox + ex + 5, oy + ey + 5); c.moveTo(ox + ex + 5, oy + ey - 5); c.lineTo(ox + ex - 5, oy + ey + 5); c.stroke(); }
    }
    c.restore();
  }

  function ball(c, n, x, y, r) {
    if (r <= 0.5) return;
    c.fillStyle = "rgba(0,0,0,0.3)"; c.beginPath(); c.arc(x + r * 0.18, y + r * 0.25, r, 0, 7); c.fill();
    const col = bcol(n);
    if (n >= 9) {
      c.fillStyle = "#f6f3ea"; c.beginPath(); c.arc(x, y, r, 0, 7); c.fill();
      c.save(); c.beginPath(); c.arc(x, y, r, 0, 7); c.clip(); c.fillStyle = col; c.fillRect(x - r, y - r * 0.55, 2 * r, r * 1.1); c.restore();
    } else { c.fillStyle = col; c.beginPath(); c.arc(x, y, r, 0, 7); c.fill(); }
    if (n > 0 && r > 6) {
      c.fillStyle = "#fff"; c.beginPath(); c.arc(x, y, r * 0.48, 0, 7); c.fill();
      c.fillStyle = "#111"; c.font = `bold ${Math.round(r * 0.66)}px system-ui, sans-serif`; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText(n, x, y + r * 0.04);
    }
    c.fillStyle = "rgba(255,255,255,0.55)"; c.beginPath(); c.arc(x - r * 0.38, y - r * 0.38, r * 0.25, 0, 7); c.fill();
    c.strokeStyle = "rgba(0,0,0,0.35)"; c.lineWidth = 1; c.beginPath(); c.arc(x, y, r, 0, 7); c.stroke();
  }
  function rr(c, x, y, w, h, r) { c.beginPath(); if (c.roundRect) c.roundRect(x, y, w, h, r); else c.rect(x, y, w, h); }
})();
