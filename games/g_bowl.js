// ---------- Bowl-a-Dawg (ten-pin bowling) ----------
// 10 frames, real scoring. Swipe up from the approach: where you start = position, the swipe's direction = aim,
// a bend in the swipe = hook, swipe speed = ball speed. Physics runs in lane inches (lane 42" wide, head pin 600" out).
(function () {
  const LANE = 21, GUT = 26, WALL = 29, HEAD = 600, DECK = 585, PIT = 664, VIEW = 668;
  const RB = 4.3, RP = 2.4, RPD = 3.0, MB = 16, MP = 3.5, SUB = 10;
  const ROW = 10.392;
  const RACK = [];
  for (let r = 0; r < 4; r++) for (let i = 0; i <= r; i++) RACK.push([(-r / 2 + i) * 12, HEAD + r * ROW]);

  // ---------- scoring ----------
  function frameInfo(rolls) {
    // returns [{marks:[..], total:number|null}] for 10 frames
    const out = []; let i = 0, run = 0, ok = true;
    for (let f = 0; f < 10; f++) {
      const fr = { marks: [], total: null };
      if (f < 9) {
        const a = rolls[i], b = rolls[i + 1];
        if (a === undefined) { out.push(fr); ok = false; continue; }
        if (a === 10) {
          fr.marks = ["", "X"];
          const n1 = rolls[i + 1], n2 = rolls[i + 2];
          if (ok && n1 !== undefined && n2 !== undefined) { run += 10 + n1 + n2; fr.total = run; } else ok = false;
          i += 1;
        } else {
          fr.marks = [a ? "" + a : "-", b === undefined ? "" : a + b === 10 ? "/" : b ? "" + b : "-"];
          if (b === undefined) ok = false;
          else if (a + b === 10) { const n = rolls[i + 2]; if (ok && n !== undefined) { run += 10 + n; fr.total = run; } else ok = false; }
          else if (ok) { run += a + b; fr.total = run; }
          i += 2;
        }
      } else {
        const t = rolls.slice(i, i + 3), m = [];
        const mk = (v, prev, fresh) => v === 10 && fresh ? "X" : !fresh && prev + v === 10 ? "/" : v ? "" + v : "-";
        if (t[0] !== undefined) m.push(mk(t[0], 0, true));
        if (t[1] !== undefined) m.push(t[0] === 10 ? mk(t[1], 0, true) : mk(t[1], t[0], false));
        if (t[2] !== undefined) {
          const fresh = t[0] === 10 ? (t[1] === 10) : (t[0] + t[1] === 10);
          m.push(fresh ? mk(t[2], 0, true) : mk(t[2], t[1], false));
        }
        fr.marks = m;
        const need = t[0] === 10 || (t[0] + t[1] === 10) ? 3 : 2;
        if (ok && t.length >= need && t.slice(0, need).every(v => v !== undefined)) { run += t.slice(0, need).reduce((x, y) => x + y, 0); fr.total = run; }
      }
      out.push(fr);
    }
    return out;
  }
  function total(rolls) { const fi = frameInfo(rolls); let t = 0; fi.forEach(f => { if (f.total !== null) t = f.total; }); return t; }
  function liveTotal(rolls) { // running pinfall for the HUD (bonuses counted once known)
    let t = 0; const fi = frameInfo(rolls); fi.forEach(f => { if (f.total !== null) t = f.total; }); return t;
  }

  // ---------- layout ----------
  function lay(G) {
    const s = G.s, W = G.W, H = G.H;
    s.hudH = 34;                                // shared top HUD, frame sheet sits right under it
    s.sheetH = Math.max(38, Math.min(46, H * 0.075));
    s.yTop = s.hudH + s.sheetH + 30;            // screen y of v = VIEW
    s.yF = H - Math.max(74, H * 0.14);          // foul line
    s.ppi = Math.min(W * 0.70, 300) / 42;       // px per inch at the foul line
  }
  const sc = v => 1 - 0.45 * Math.max(-0.2, Math.min(1, v / VIEW));
  const KNOT = 560, KF = 0.68; // the pin deck gets extra screen room so the rack reads well
  const Y = (s, v) => s.yF - (s.yF - s.yTop) * (v < KNOT ? KF * v / KNOT : KF + (1 - KF) * (v - KNOT) / (VIEW - KNOT));
  const X = (G, s, x, v) => G.W / 2 + x * s.ppi * sc(v);

  function rack(s) { s.pins = RACK.map((p, n) => ({ n: n + 1, x: p[0], v: p[1], vx: 0, vv: 0, down: 0, gone: 0, out: 0, a: 0, spin: 0, fade: 1 })); }
  function newBall(s) { s.b = { x: s.aimX, v: -12, vx: 0, vv: 0, hook: 0, rot: 0, gut: 0, live: 0 }; }

  function launch(G, x, slope, hook, speed) {
    const s = G.s; s.aimX = x;
    s.b = { x: x, v: 0, vx: slope * speed, vv: speed, hook: hook, rot: 0, gut: 0, live: 1 };
    s.phase = "roll"; s.rt = 0; s.atPins = -1; s.pts = null;
  }

  // ---------- physics ----------
  function step(s, h) {
    const b = s.b, P = s.pins;
    if (b.live) {
      if (!b.gut) {
        let r = Math.max(0, Math.min(1, (b.v - 140) / 260)); if (b.v > DECK) r *= 0.3;
        b.vx += b.hook * r * h;
      }
      b.x += b.vx * h; b.v += b.vv * h; b.rot += b.vv * h / RB;
      if (!b.gut && Math.abs(b.x) > LANE) { b.gut = Math.sign(b.x); b.vx = 0; b.hook = 0; }
      if (b.gut) b.x += (b.gut * 23.6 - b.x) * Math.min(1, h * 12);
      if (b.v > PIT + 10) b.live = 0;
      if (!b.gut && b.v > HEAD - 20) {
        for (let i = 0; i < 10; i++) {
          const p = P[i]; if (p.gone || p.out) continue;
          const dx = p.x - b.x, dy = p.v - b.v, rr = RB + (p.down ? RPD : RP), d2 = dx * dx + dy * dy;
          if (d2 >= rr * rr) continue;
          const d = Math.sqrt(d2) || 0.01, nx = dx / d, ny = dy / d;
          const rel = (b.vx - p.vx) * nx + (b.vv - p.vv) * ny;
          if (rel > 0) {
            const j = 1.75 * rel / (1 / MB + 1 / MP);
            b.vx -= j / MB * nx; b.vv -= j / MB * ny;
            p.vx += j / MP * nx; p.vv += j / MP * ny;
            const jit = (Math.random() - 0.5) * 0.35;
            const c = Math.cos(jit), sn = Math.sin(jit), vx = p.vx * c - p.vv * sn; p.vv = p.vx * sn + p.vv * c; p.vx = vx;
            if (!p.down) { p.down = 1; p.spin = (Math.random() - 0.5) * 18; s.hits++; }
          }
          const push = rr - d; p.x += nx * push; p.v += ny * push;
        }
      }
    }
    for (let i = 0; i < 10; i++) {
      const p = P[i]; if (!p.down || p.gone || p.out) continue;
      p.x += p.vx * h; p.v += p.vv * h; p.a += p.spin * h;
      const k = Math.exp(-2.4 * h); p.vx *= k; p.vv *= k; p.spin *= k;
      if (Math.abs(p.x) > WALL) { p.x = Math.sign(p.x) * WALL; p.vx = -p.vx * 0.55; }
      if (p.v > PIT) p.gone = 1;
      if (p.v < DECK - 30 && p.vv < 0) p.vv = -p.vv * 0.4;
    }
    for (let i = 0; i < 10; i++) {
      const A = P[i]; if (A.gone || A.out) continue;
      for (let j = i + 1; j < 10; j++) {
        const B = P[j]; if (B.gone || B.out) continue;
        if (!A.down && !B.down) continue;
        const dx = B.x - A.x, dy = B.v - A.v, rr = (A.down ? RPD : RP) + (B.down ? RPD : RP), d2 = dx * dx + dy * dy;
        if (d2 >= rr * rr) continue;
        const d = Math.sqrt(d2) || 0.01, nx = dx / d, ny = dy / d;
        const rel = (A.vx - B.vx) * nx + (A.vv - B.vv) * ny;
        if (rel > 0) {
          const j2 = 0.82 * rel; // (1+e)/2 with e≈0.64, equal masses
          A.vx -= j2 * nx; A.vv -= j2 * ny; B.vx += j2 * nx; B.vv += j2 * ny;
          const jit = (Math.random() - 0.5) * 0.5;
          const T = A.down && !B.down ? B : !A.down && B.down ? A : null;
          if (T && rel > 28) { T.down = 1; T.spin = (Math.random() - 0.5) * 16; const c = Math.cos(jit), sn = Math.sin(jit), vx = T.vx * c - T.vv * sn; T.vv = T.vx * sn + T.vv * c; T.vx = vx; }
          else if (T) { T.vx = 0; T.vv = 0; }
        }
        const push = (rr - d) / 2;
        if (A.down) { A.x -= nx * push; A.v -= ny * push; }
        if (B.down) { B.x += nx * push; B.v += ny * push; }
      }
    }
  }

  function moving(s) {
    for (let i = 0; i < 10; i++) { const p = s.pins[i]; if (p.down && !p.gone && !p.out && Math.abs(p.vx) + Math.abs(p.vv) > 10) return true; }
    return false;
  }

  // ---------- game flow ----------
  function standing(s) { let n = 0; s.pins.forEach(p => { if (!p.out && !p.down && !p.gone) n++; }); return n; }

  function settle(G) {
    const s = G.s, before = s.upBefore, now = standing(s), k = before - now;
    s.rolls.push(k);
    const f = s.frame, first = s.ball === 0;
    let flash = null;
    if (k === 10 && before === 10) flash = "STRIKE";
    else if (now === 0) flash = "SPARE";
    else if (s.b.gut && k === 0) flash = "GUTTER";
    else if (k === 0) flash = "MISS";
    s.flash = flash; s.flashT = flash ? 1.5 : 0; s.lastK = k;
    if (flash === "STRIKE") { G.sfx("win"); G.buzz(); } else if (flash === "SPARE") G.sfx("win"); else if (flash === "GUTTER") G.sfx("lose"); else if (k) G.sfx("pop");
    // decide next state
    let reset = false, done = false;
    if (f < 9) {
      if (first && now > 0) s.ball = 1; else { s.frame++; s.ball = 0; reset = true; }
    } else {
      if (s.ball === 0) { s.ball = 1; reset = now === 0; }
      else if (s.ball === 1) {
        const t = s.rolls.slice(-2);
        if (t[0] === 10 || t[0] + t[1] === 10) { s.ball = 2; reset = now === 0; } else done = true;
      } else done = true;
    }
    if (s.frame > 9) done = true;
    s.next = { reset, done }; s.phase = "sweep"; s.st = 0;
    s.total = liveTotal(s.rolls); s.fi = frameInfo(s.rolls);
  }

  function afterSweep(G) {
    const s = G.s;
    if (s.next.done) {
      const t = total(s.rolls);
      G.over(Math.min(300, t), t === 300 ? "PERFECT GAME!" : t >= 200 ? "Big Dawg bowler!" : t >= 150 ? "Strike dog!" : t >= 100 ? "Good boy roll." : t >= 60 ? "Paws in the gutter." : "Gutter pup.");
      s.phase = "end"; return;
    }
    if (s.next.reset) rack(s); else s.pins.forEach(p => { if (p.down || p.gone) p.out = 1; });
    s.upBefore = standing(s); newBall(s); s.phase = "aim"; s.flash = null;
  }

  // ---------- swipe -> roll ----------
  function laneXAtFoul(G, sx) { const s = G.s; return (sx - G.W / 2) / s.ppi; }
  function release(G) {
    const s = G.s, pts = s.pts; if (!pts || pts.length < 2) { s.pts = null; return; }
    const a = pts[0], z = pts[pts.length - 1], up = a.y - z.y;
    if (up < 40) { s.pts = null; return; } // not a real swipe: keep the new position
    // aim: extend the chord up to the head pin row
    const ratio = (z.x - a.x) / up, yP = Y(s, HEAD);
    const sxAtPin = a.x + ratio * (a.y - yP);
    const x0 = Math.max(-17, Math.min(17, laneXAtFoul(G, a.x)));
    const xT = (sxAtPin - G.W / 2) / (s.ppi * sc(HEAD));
    let slope = (x0 + (xT - x0) * 0.8 - x0) / HEAD; slope = Math.max(-0.07, Math.min(0.07, slope));
    // hook: signed max bow of the path away from the chord (right bow -> hooks left, like the arc you drew)
    const L = Math.hypot(z.x - a.x, up); let bow = 0;
    for (let i = 1; i < pts.length - 1; i++) {
      const p = pts[i], d = ((p.x - a.x) * (-up) - (p.y - a.y) * (z.x - a.x)) / L; // >0 = right of the chord (going up)
      if (Math.abs(d) > Math.abs(bow)) bow = d;
    }
    bow = Math.abs(bow) < 6 ? 0 : bow - Math.sign(bow) * 6;
    const hook = Math.max(-32, Math.min(32, -bow * 0.55));
    // speed from the last ~0.12s of the swipe
    let k = pts.length - 1; while (k > 0 && z.t - pts[k].t < 0.12) k--;
    const q = pts[k], dt = Math.max(0.016, z.t - q.t), pxs = Math.hypot(z.x - q.x, z.y - q.y) / dt;
    const speed = Math.max(200, Math.min(420, 170 + pxs * 0.14));
    launch(G, x0, slope, hook, speed); G.sfx("pop");
  }

  defGame({
    key: "bowl", name: "Bowl-a-Dawg", icon: "🎳", max: 300, cat: "sports",
    blurb: "10 frames. Swipe to roll. Curve it.",
    how: "Swipe up from the bottom to roll. Where you start = where you stand, the swipe's direction = your aim, bend the swipe to hook it, flick faster for more speed. Hit the pocket (just beside the head pin) for strikes. 10 frames, real scoring, 300 is perfect.",
    reset(G) {
      G.s = { rolls: [], frame: 0, ball: 0, phase: "aim", aimX: 6, pts: null, flash: null, flashT: 0, st: 0, rt: 0, hits: 0, total: 0, next: null, lastK: 0 };
      lay(G); rack(G.s); G.s.upBefore = 10; newBall(G.s); G.s.fi = frameInfo([]);
    },
    update(G, dt) {
      const s = G.s;
      if (s.flashT > 0) s.flashT -= dt;
      if (s.phase === "roll") {
        const h = dt / SUB; for (let i = 0; i < SUB; i++) step(s, h);
        s.rt += dt; const b = s.b;
        if (s.atPins < 0 && b.v > HEAD - 30) s.atPins = s.rt;
        const since = s.atPins < 0 ? 0 : s.rt - s.atPins;
        if ((!b.live || b.v > PIT) && s.atPins >= 0 && ((since > 1.0 && !moving(s)) || since > 2.6)) settle(G);
        if (s.rt > 8) settle(G);
      } else if (s.phase === "sweep") {
        const h = dt / SUB; for (let i = 0; i < SUB; i++) step(s, h);
        s.st += dt; s.pins.forEach(p => { if (p.down || p.gone) p.fade = Math.max(0, 1 - Math.max(0, s.st - 0.7) / 0.5); });
        if (s.st > 1.35) afterSweep(G);
      }
    },
    down(G, x, y) {
      const s = G.s; if (s.phase !== "aim" || y < s.yF - (s.yF - s.yTop) * 0.5) return;
      s.aimX = Math.max(-17, Math.min(17, laneXAtFoul(G, x))); s.b.x = s.aimX;
      s.pts = [{ x, y, t: performance.now() / 1000 }];
    },
    move(G, x, y) {
      const s = G.s; if (s.phase !== "aim" || !s.pts) return;
      if (s.pts.length < 240) s.pts.push({ x, y, t: performance.now() / 1000 });
      if (y > s.yF - 20) { s.aimX = Math.max(-17, Math.min(17, laneXAtFoul(G, x))); s.b.x = s.aimX; }
    },
    up(G, x, y) {
      const s = G.s; if (s.phase !== "aim" || !s.pts) return;
      s.pts.push({ x, y, t: performance.now() / 1000 }); release(G);
    },
    onKey(G, k, d) {
      const s = G.s; if (!d || s.phase !== "aim") return;
      if (k === "ArrowLeft" || k === "a") { s.aimX = Math.max(-17, s.aimX - 1); s.b.x = s.aimX; }
      else if (k === "ArrowRight" || k === "d") { s.aimX = Math.min(17, s.aimX + 1); s.b.x = s.aimX; }
      else if (k === "ArrowUp" || k === " " || k === "w") { launch(G, s.aimX, (2.5 + (Math.random() - 0.5) * 6 - s.aimX) / HEAD, 0, 330); G.sfx("pop"); }
    },
    draw(G, c) {
      const s = G.s, W = G.W, H = G.H, dark = G.dark();
      if (!s.pins) return;
      lay(G);
      const yv = v => Y(s, v), xv = (x, v) => X(G, s, x, v);
      // background
      c.fillStyle = dark ? "#14121c" : "#2c2440"; c.fillRect(0, 0, W, H);
      // side walls / kickbacks
      const quad = (x0, x1, v0, v1, col) => { c.fillStyle = col; c.beginPath(); c.moveTo(xv(x0, v0), yv(v0)); c.lineTo(xv(x1, v0), yv(v0)); c.lineTo(xv(x1, v1), yv(v1)); c.lineTo(xv(x0, v1), yv(v1)); c.closePath(); c.fill(); };
      quad(-WALL - 4, WALL + 4, -60, VIEW + 4, dark ? "#2a2236" : "#4a3d63");
      quad(-GUT, GUT, 0, VIEW, dark ? "#3c3a44" : "#7b7a86");                 // gutters
      c.fillStyle = dark ? "#2e2c35" : "#62616c";
      for (const sg of [-1, 1]) quad(sg > 0 ? LANE + 1.5 : -GUT, sg > 0 ? GUT : -LANE - 1.5, 0, VIEW, dark ? "#2e2c35" : "#686773");
      // lane wood
      quad(-LANE, LANE, 0, PIT, dark ? "#9a6a35" : "#e2ac68");
      quad(-LANE, LANE, DECK, PIT, dark ? "#a8773f" : "#efc183");             // pin deck
      c.strokeStyle = dark ? "rgba(60,30,10,0.35)" : "rgba(140,80,30,0.25)"; c.lineWidth = 1;
      c.beginPath(); for (let bx = -LANE + 3.5; bx < LANE; bx += 3.5) { c.moveTo(xv(bx, 0), yv(0)); c.lineTo(xv(bx, PIT), yv(PIT)); } c.stroke();
      // pit
      quad(-WALL - 4, WALL + 4, PIT, VIEW + 30, dark ? "#07060a" : "#16121e");
      // arrows + dots
      c.fillStyle = dark ? "#3a1e10" : "#8a4a1a";
      for (let i = -3; i <= 3; i++) {
        const bx = i * 5.25, av = 150 + Math.abs(i) * 14, px = xv(bx, av), py = yv(av), w = 4 * s.ppi * sc(av) * 0.5;
        c.beginPath(); c.moveTo(px, py - 9); c.lineTo(px + w, py + 5); c.lineTo(px - w, py + 5); c.closePath(); c.fill();
      }
      for (let i = -2; i <= 2; i++) { if (!i) continue; const bx = i * 5.25 * 1.5; c.beginPath(); c.arc(xv(bx, 40), yv(40), 2.5, 0, 7); c.fill(); }
      // foul line + approach
      c.fillStyle = dark ? "#7a5a3a" : "#f3d2a0"; c.fillRect(xv(-WALL - 4, 0), yv(0), xv(WALL + 4, 0) - xv(-WALL - 4, 0), H - yv(0));
      c.fillStyle = dark ? "#5c4128" : "#d9b07a"; for (let i = -2; i <= 2; i++) { c.beginPath(); c.arc(xv(i * 7, 0), yv(0) + 26, 2.5, 0, 7); c.fill(); }
      c.fillStyle = "#e0413a"; c.fillRect(xv(-LANE, 0), yv(0) - 2, xv(LANE, 0) - xv(-LANE, 0), 4);

      // ball in gutter / on lane, pins: draw far -> near
      const P = s.pins, b = s.b;
      // fallen pins lying (under everything standing)
      for (let i = 9; i >= 0; i--) {
        const p = P[i]; if (p.out || p.gone || !p.down || p.fade <= 0) continue;
        const k = s.ppi * sc(p.v), px = xv(p.x, p.v), py = yv(p.v);
        c.save(); c.globalAlpha = p.fade; c.translate(px, py); c.rotate(p.a);
        c.fillStyle = "#f6f2ea"; c.strokeStyle = "#5a4a3a"; c.lineWidth = 1;
        c.beginPath(); c.ellipse(0, 0, k * 6.5, k * 2.2, 0, 0, 7); c.fill(); c.stroke();
        c.beginPath(); c.arc(k * 6.8, 0, k * 1.3, 0, 7); c.fill(); c.stroke();
        c.fillStyle = "#d8262b"; c.fillRect(k * 3.2, -k * 1.6, k * 1.1, k * 3.2);
        c.restore();
      }
      const drawBall = () => {
        if (s.phase === "end") return;
        const v = b.v, k = s.ppi * sc(v), r = RB * k * (b.gut ? 0.9 : 1), px = xv(b.x, v), py = yv(v) - r * 0.55;
        if (v > PIT + 6) return;
        c.fillStyle = "rgba(0,0,0,0.25)"; c.beginPath(); c.ellipse(px, yv(v) + 1, r * 0.95, r * 0.35, 0, 0, 7); c.fill();
        c.save(); c.beginPath(); c.arc(px, py, r, 0, 7); c.clip();
        c.fillStyle = "#3d5bd8"; c.fillRect(px - r, py - r, 2 * r, 2 * r);
        c.fillStyle = "#6c86ff"; c.beginPath(); c.arc(px - r * 0.35, py - r * 0.4, r * 0.6, 0, 7); c.fill();
        G.img(c, ":dawgW:", px, py + Math.sin(b.rot) * r * 0.25, r * 1.55, b.rot * 0.08 + Math.sin(b.rot) * 0.2);
        c.restore();
        c.strokeStyle = "#1b2560"; c.lineWidth = 2; c.beginPath(); c.arc(px, py, r, 0, 7); c.stroke();
      };
      let ballDrawn = false;
      for (let i = 9; i >= 0; i--) {
        const p = P[i];
        if (!ballDrawn && b.v > p.v) { drawBall(); ballDrawn = true; }
        if (p.out || p.gone || p.down) continue;
        const k = s.ppi * sc(p.v), px = xv(p.x, p.v), py = yv(p.v), h = 11 * k, w = 4.8 * k;
        c.fillStyle = "rgba(0,0,0,0.22)"; c.beginPath(); c.ellipse(px, py, w * 0.55, w * 0.2, 0, 0, 7); c.fill();
        c.fillStyle = "#fbf8f2"; c.strokeStyle = "#4a3b30"; c.lineWidth = 1.2;
        c.beginPath();
        c.moveTo(px - w * 0.28, py);
        c.bezierCurveTo(px - w * 0.62, py - h * 0.25, px - w * 0.55, py - h * 0.5, px - w * 0.18, py - h * 0.66);
        c.bezierCurveTo(px - w * 0.36, py - h * 0.86, px - w * 0.2, py - h, px, py - h);
        c.bezierCurveTo(px + w * 0.2, py - h, px + w * 0.36, py - h * 0.86, px + w * 0.18, py - h * 0.66);
        c.bezierCurveTo(px + w * 0.55, py - h * 0.5, px + w * 0.62, py - h * 0.25, px + w * 0.28, py);
        c.closePath(); c.fill(); c.stroke();
        c.fillStyle = "#d8262b"; c.fillRect(px - w * 0.2, py - h * 0.74, w * 0.4, h * 0.05); c.fillRect(px - w * 0.21, py - h * 0.66, w * 0.42, h * 0.05);
      }
      if (!ballDrawn) drawBall();

      // swipe trail
      if (s.pts && s.pts.length > 1) {
        c.strokeStyle = "rgba(255,210,63,0.85)"; c.lineWidth = 5; c.lineCap = "round"; c.lineJoin = "round";
        c.beginPath(); s.pts.forEach((p, i) => i ? c.lineTo(p.x, p.y) : c.moveTo(p.x, p.y)); c.stroke();
      }
      // aim marker + how-to
      if (s.phase === "aim" && !s.pts) {
        const pulse = 0.6 + 0.4 * Math.sin(G.t * 5);
        G.text(c, "▲", xv(s.aimX, 0), yv(0) - 40 - pulse * 6, 14, "#ffd23f");
      }
      if (s.rolls.length < 2 && s.phase === "aim" && !s.pts) G.hint(c, G.t < 4.5 ? "SWIPE UP TO ROLL" : "BEND THE SWIPE TO HOOK", 9, H - 24);

      // shared HUD + frame score sheet as a compact second row
      const fin = s.frame > 9 || s.phase === "end";
      G.hud(c, fin ? "FINAL" : `FRAME ${s.frame + 1}`, fin ? "" : `BALL ${s.ball + 1}`, `SCORE ${s.total}`);
      const sh = s.sheetH, pad = 4, u = (W - pad * 2) / 10.5, top = s.hudH;
      c.save(); c.translate(0, top);
      c.fillStyle = dark ? "#1e1b29" : "#fffaf0"; c.fillRect(0, 0, W, sh + 4);
      const fi = s.fi || [];
      for (let f = 0; f < 10; f++) {
        const x0 = pad + f * u, w = f === 9 ? u * 1.5 : u, cur = f === s.frame && s.phase !== "end";
        if (cur) { c.fillStyle = dark ? "#3b3260" : "#ffe7a3"; c.fillRect(x0, 2, w, sh); }
        c.strokeStyle = dark ? "#6a6290" : "#8a7a60"; c.lineWidth = 1; c.strokeRect(x0 + 0.5, 2.5, w - 1, sh - 1);
        const bw = u * 0.42, by = 2.5, bh = sh * 0.44;
        const nb = f === 9 ? 3 : 2;
        for (let k = 0; k < nb; k++) { const bx = x0 + w - bw * (nb - k); c.strokeRect(bx + 0.5, by, bw, bh); }
        const fr = fi[f]; if (!fr) continue;
        const marks = fr.marks;
        for (let k = 0; k < marks.length; k++) {
          const m = marks[k]; if (!m) continue;
          const bx = x0 + w - bw * (nb - k);
          if (m === "X") { c.fillStyle = "#e0413a"; c.fillRect(bx + 1, by + 0.5, bw - 1, bh - 1); G.text(c, "X", bx + bw / 2 + 0.5, by + bh / 2 + 1, 10, "#fff"); }
          else if (m === "/") { c.fillStyle = "#3d5bd8"; c.beginPath(); c.moveTo(bx + bw, by); c.lineTo(bx + bw, by + bh); c.lineTo(bx, by + bh); c.closePath(); c.fill(); G.text(c, "/", bx + bw / 2 + 0.5, by + bh / 2 + 1, 10, dark ? "#fff" : "#1b2560"); }
          else G.text(c, m, bx + bw / 2 + 0.5, by + bh / 2 + 1, 10, dark ? "#eee" : "#222");
        }
        if (fr.total !== null) G.text(c, "" + fr.total, x0 + w / 2, by + bh + (sh - bh) / 2, 10, dark ? "#ffd23f" : "#222");
      }
      c.restore();

      // flash
      if (s.flash && s.flashT > 0) {
        const t = 1.5 - s.flashT, pop = Math.min(1, t * 6), cy = (s.yTop + s.yF) / 2 - 10;
        const col = s.flash === "STRIKE" ? "#ffd23f" : s.flash === "SPARE" ? "#7ee0ff" : "#ff8a6b";
        c.save(); c.globalAlpha = Math.min(1, s.flashT * 2);
        c.fillStyle = "rgba(0,0,0,0.5)"; c.fillRect(0, cy - 56, W, 112);
        const face = s.flash === "STRIKE" ? ":dawgpog:" : s.flash === "SPARE" ? ":dawgW:" : s.flash === "GUTTER" ? ":dawgclown:" : ":dawgsweat:";
        G.img(c, face, W / 2, cy - 22, 54 * pop, Math.sin(G.t * 9) * 0.15);
        const txt = s.flash === "MISS" ? "NOPE" : s.flash + "!";
        G.banner(c, txt, col, cy + 28, Math.max(10, Math.min(28, (W - 24) / txt.length) * pop));
        c.restore();
      } else if (s.phase === "sweep" && s.lastK > 0) {
        G.banner(c, `${s.lastK} PIN${s.lastK > 1 ? "S" : ""}`, "#fff", (s.yTop + s.yF) / 2, 18);
      }
    }
  });
  if (typeof module !== "undefined") module.exports = { frameInfo, total, step, launch, RACK };
})();
