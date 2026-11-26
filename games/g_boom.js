// ---------- Boomerang Dawgs (top-down boomerang brawl, Boomerang Fu-style) ----------
// You vs 3 CPU critters in a small arena. One hit and you're out. Throw (hold to charge), slash, dash.
// Boomerangs bounce off walls and curve home; hold throw empty-handed to call yours back.
// Power-ups stack (3 max, fire and ice don't mix) and last the whole match. +1 per KO, +1 last one standing. First to 10.
// Touch: left side = joystick, right side = THROW / SLASH / DASH buttons (raw touch events, so thumbs work together).
(function () {
  const COLS = 11, ROWS = 13, GOAL = 10, HUD = 40, CTRL = 112;
  const TOUCH = typeof window !== "undefined" && "ontouchstart" in window;
  const clamp = (v, a, b) => v < a ? a : v > b ? b : v, hyp = Math.hypot;
  const D4 = [[1, 0], [0, 1], [-1, 0], [0, -1]];
  // . floor  # wall  ~ water (step in = splash, dash over it)  b bush (hides you)  1-4 corners to start in
  const MAPS = [
    ["2.........3", "...........", "..##...##..", "..#.....#..", ".....b.....", "....~~~....", ".b..~~~..b.", "....~~~....", ".....b.....", "..#.....#..", "..##...##..", "...........", "1.........4"],
    ["2....#....3", ".....#.....", "..b.....b..", "...........", "##..~.~..##", "...........", "....###....", "...........", "##..~.~..##", "...........", "..b.....b..", ".....#.....", "1....#....4"],
    ["2.........3", ".###...###.", "...........", ".....#.....", "~~~..#..~~~", "...........", ".b...b...b.", "...........", "~~~..#..~~~", ".....#.....", "...........", ".###...###.", "1.........4"],
    ["2.........3", ".#..#.#..#.", "...........", "...b...b...", ".#.......#.", "....~~~....", ".#..~~~..#.", "....~~~....", ".#.......#.", "...b...b...", "...........", ".#..#.#..#.", "1.........4"]
  ];
  const WHO = [
    { name: "YOU", face: ":dawgW:", col: "#ffd23f" },
    { name: "MITTENS", em: "🐱", col: "#ef4444" },
    { name: "RUSTY", em: "🦊", col: "#fb923c" },
    { name: "BAO", em: "🐼", col: "#38bdf8" }
  ];
  const PW = { multi: ["🖐️", "MULTI x5"], extra: ["➕", "EXTRA RANG"], boom: ["💣", "EXPLOSIVE"], fire: ["🔥", "FIRE"], ice: ["❄️", "ICE"], shield: ["🛡️", "SHIELD"], speed: ["☕", "CAFFEINATED"], tele: ["🌀", "WARP"] };
  const PWK = Object.keys(PW);

  const tileAt = (s, x, y) => { const cx = Math.floor(x / s.T), cy = Math.floor(y / s.T); return cx < 0 || cy < 0 || cx >= COLS || cy >= ROWS ? "#" : s.map[cy][cx]; };
  const hasP = (f, k) => f.pw.indexOf(k) >= 0;
  const lethal = (r, f) => r.st !== "ground" && f !== r.safe && (f !== r.o || r.defl);
  const pop = (s, x, y, txt, col) => s.pops.push({ x, y, txt, col: col || "#fff", t: 1 });
  function puff(s, x, y, col, n) { for (let i = 0; i < n; i++) { const a = Math.random() * 6.28, v = (1 + Math.random() * 4) * s.T; s.fx.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, t: 0.5, col }); } }

  function moveF(s, f, dx, dy) {
    const r = s.T * 0.34, wet = f.cpu; // CPUs never walk into the water
    const bad = (x, y) => { const t = tileAt(s, x, y); return t === "#" || (wet && t === "~"); };
    const blocked = (x, y) => bad(x - r, y - r) || bad(x + r, y - r) || bad(x - r, y + r) || bad(x + r, y + r);
    if (!blocked(f.x + dx, f.y)) f.x += dx;
    if (!blocked(f.x, f.y + dy)) f.y += dy;
  }
  function los(s, x0, y0, x1, y1) {
    const n = Math.ceil(hyp(x1 - x0, y1 - y0) / (s.T * 0.4));
    for (let i = 1; i < n; i++) if (tileAt(s, x0 + (x1 - x0) * i / n, y0 + (y1 - y0) * i / n) === "#") return false;
    return true;
  }
  // Next spot to walk to on the way to (gx, gy): flood fill out from the goal, around walls and water.
  function path(s, f, gx, gy) {
    const T = s.T, sx = Math.floor(f.x / T), sy = Math.floor(f.y / T), tx = clamp(Math.floor(gx / T), 0, COLS - 1), ty = clamp(Math.floor(gy / T), 0, ROWS - 1);
    if (sx === tx && sy === ty) return [gx, gy];
    const prev = [], q = [tx + ty * COLS], start = sx + sy * COLS; prev[q[0]] = q[0];
    for (let h = 0; h < q.length && prev[start] === undefined; h++) {
      const cur = q[h], cx = cur % COLS, cy = (cur / COLS) | 0;
      for (let d = 0; d < 4; d++) {
        const nx = cx + D4[d][0], ny = cy + D4[d][1]; if (nx < 0 || ny < 0 || nx >= COLS || ny >= ROWS) continue;
        const ch = s.map[ny][nx], id = nx + ny * COLS; if (ch === "#" || ch === "~" || prev[id] !== undefined) continue;
        prev[id] = cur; q.push(id);
      }
    }
    const n = prev[start]; if (n === undefined) return [gx, gy];
    return [(n % COLS + 0.5) * T, (((n / COLS) | 0) + 0.5) * T];
  }

  function hit(s, f, by) {
    if (!f.alive || f.inv > 0) return;
    const i = f.pw.indexOf("shield");
    if (i >= 0) { f.pw.splice(i, 1); f.inv = 0.7; f.burn = null; pop(s, f.x, f.y - s.T * 0.7, "BLOCKED!", "#7dd3fc"); G.sfx("pop"); return; }
    f.alive = false; f.charge = -1; f.recall = false; f.burn = null;
    puff(s, f.x, f.y, f.who.col, 16); s.shake = 0.25;
    if (by && by !== f) { by.pts++; if (by === s.f[0]) s.kos++; pop(s, f.x, f.y - s.T * 0.7, "+1 " + by.who.name, by.who.col); }
    if (f === s.f[0]) { G.sfx("lose"); G.buzz(); } else G.sfx("pop");
  }
  function give(s, f, k) {
    pop(s, f.x, f.y - s.T * 0.8, PW[k][1] + "!", "#fde047"); if (f === s.f[0]) G.sfx("pass");
    if (hasP(f, k)) return;
    if (k === "fire" || k === "ice") f.pw = f.pw.filter(p => p !== "fire" && p !== "ice");
    f.pw.push(k); if (f.pw.length > 3) f.pw.shift();
    const max = hasP(f, "extra") ? 2 : 1; if (max > f.max) f.has++; f.max = max; f.has = Math.min(f.has, max);
  }
  function throwR(s, f) {
    const T = s.T, ch = clamp(f.charge, 0, 0.8) / 0.8; f.charge = -1;
    if (f.has <= 0) return; f.has--;
    let ang = Math.atan2(f.fy, f.fx);
    if (!f.cpu) { // a little aim help for thumbs: snap to a rival who's nearly lined up
      let best = 0.3;
      s.f.forEach(e => { if (e === f || !e.alive || e.hid) return; let d = Math.atan2(e.y - f.y, e.x - f.x) - ang; d = Math.atan2(Math.sin(d), Math.cos(d)); if (Math.abs(d) < Math.abs(best)) best = d; });
      if (Math.abs(best) < 0.3) ang += best;
    }
    const n = hasP(f, "multi") ? 5 : 1, g = { n }, kind = hasP(f, "fire") ? "fire" : hasP(f, "ice") ? "ice" : null;
    for (let i = 0; i < n; i++) {
      const a = ang + (i - (n - 1) / 2) * 0.2;
      s.rangs.push({ o: f, g, x: f.x + Math.cos(a) * T * 0.4, y: f.y + Math.sin(a) * T * 0.4, vx: Math.cos(a) * 11 * T, vy: Math.sin(a) * 11 * T, range: (4.5 + 7 * ch) * T, st: "fly", rot: 0, b: 0, tr: 0, kind, boom: hasP(f, "boom"), safe: null, defl: false, ph: false });
    }
    if (!f.cpu) G.sfx("throw");
  }
  function caught(s, i) { const r = s.rangs.splice(i, 1)[0]; if (--r.g.n <= 0) r.o.has = Math.min(r.o.max, r.o.has + 1); }
  function explode(s, r) {
    const T = s.T; s.booms.push({ x: r.x, y: r.y, t: 0.4 }); s.shake = 0.3; G.sfx("lose");
    s.f.forEach(f => { if (f.alive && f !== r.o && hyp(f.x - r.x, f.y - r.y) < T * 1.5) hit(s, f, r.safe || r.o); });
    r.st = "return"; r.ph = true; r.defl = false; r.safe = null;
  }
  // kind: "throw" (hold to charge, let go to throw; empty-handed it calls your boomerang back), "slash", "dash"
  function act(s, f, kind, down) {
    if (!f.alive || s.phase !== "fight") { if (kind === "throw" && !down) { f.charge = -1; f.recall = false; } return; }
    if (f.frozen > 0) { if (kind === "dash" && down) f.frozen -= 0.4; return; }
    if (kind === "throw") {
      if (down) { if (f.has > 0) f.charge = 0; else f.recall = true; }
      else { if (f.charge >= 0) throwR(s, f); f.recall = false; }
    } else if (kind === "slash" && down) {
      if (f.has > 0 && f.slashCd <= 0) { f.slashT = 0.16; f.slashCd = 0.45; f.charge = -1; }
    } else if (kind === "dash" && down && f.dashCd <= 0) {
      f.dashCd = 0.9;
      const r = hasP(f, "tele") && s.rangs.find(r => r.o === f), t = r && tileAt(s, r.x, r.y);
      if (r && t !== "#" && t !== "~") { puff(s, f.x, f.y, "#c4b5fd", 8); f.x = r.x; f.y = r.y; puff(s, f.x, f.y, "#c4b5fd", 8); caught(s, s.rangs.indexOf(r)); }
      else f.dashT = 0.15;
    }
  }

  function stepF(s, f, mx, my, dt) {
    const T = s.T;
    f.slashT -= dt; f.slashCd -= dt; f.dashCd -= dt; f.inv -= dt;
    if (f.charge >= 0) f.charge += dt;
    if (f.frozen > 0) { f.frozen -= dt; mx = my = 0; f.charge = -1; f.dashT = 0; }
    else if ((mx || my) && f.dashT <= 0) { const n = hyp(mx, my); f.fx = mx / n; f.fy = my / n; }
    // fire and ice on the floor (your own trail is safe for you)
    let ice = false;
    for (const q of s.patches) {
      if (q.o === f || hyp(q.x - f.x, q.y - f.y) > T * 0.45) continue;
      if (q.k === "fire") { if (!f.burn) f.burn = { t: 3, by: q.o }; } else ice = true;
    }
    if (ice) { f.chill += dt; if (f.chill > 1.1 && f.frozen <= 0) { f.frozen = 3; f.chill = 0; pop(s, f.x, f.y - T * 0.7, "FROZEN!", "#bae6fd"); } }
    else f.chill = Math.max(0, f.chill - dt * 0.5);
    if (f.burn) {
      f.burn.t -= dt;
      if ([[0, 0], [T, 0], [-T, 0], [0, T], [0, -T]].some(o => tileAt(s, f.x + o[0], f.y + o[1]) === "~")) f.burn = null; // water puts it out
      else if (f.burn.t <= 0) hit(s, f, f.burn.by);
      else s.f.forEach(o => { if (o !== f && o.alive && !o.burn && hyp(o.x - f.x, o.y - f.y) < T * 0.75) o.burn = { t: 3, by: f.burn.by }; });
    }
    if (!f.alive) return;
    const sp = 4.3 * T * (hasP(f, "speed") ? 1.35 : 1) * (f.charge >= 0 ? 0.6 : 1) * (ice ? 0.55 : 1);
    let vx = mx * sp, vy = my * sp;
    if (f.dashT > 0) { f.dashT -= dt; vx = f.fx * 13 * T; vy = f.fy * 13 * T; }
    f.mvx = vx; f.mvy = vy;
    const kd = 1 - Math.min(1, dt * 8); vx += f.kx; vy += f.ky; f.kx *= kd; f.ky *= kd;
    moveF(s, f, vx * dt, vy * dt);
    const t = tileAt(s, f.x, f.y); f.hid = t === "b";
    if (t === "~" && f.dashT <= 0) { pop(s, f.x, f.y - T * 0.6, "SPLASH!", "#7dd3fc"); puff(s, f.x, f.y, "#7dd3fc", 12); f.pw = f.pw.filter(p => p !== "shield"); f.inv = 0; hit(s, f, null); return; }
    // slash: cuts anyone in front of you; two slashes meeting just clang
    if (f.slashT > 0) s.f.forEach(o => {
      if (o === f || !o.alive) return;
      const dx = o.x - f.x, dy = o.y - f.y, d = hyp(dx, dy) || 1;
      if (d > T * 1.15 || (dx * f.fx + dy * f.fy) / d < 0.3) return;
      if (o.slashT > 0 && (-dx * o.fx - dy * o.fy) / d > 0.3) { f.kx = -dx / d * 9 * T; f.ky = -dy / d * 9 * T; o.kx = dx / d * 9 * T; o.ky = dy / d * 9 * T; f.slashT = o.slashT = 0; pop(s, (f.x + o.x) / 2, (f.y + o.y) / 2, "CLANG!", "#e5e7eb"); return; }
      hit(s, o, f);
    });
  }

  function stepRangs(s, dt) {
    const T = s.T, wall = (x, y) => tileAt(s, x, y) === "#";
    for (let i = s.rangs.length - 1; i >= 0; i--) {
      const r = s.rangs[i], o = r.o;
      if (o.recall && o.alive && r.st !== "return") { r.st = "return"; r.ph = true; r.defl = false; r.safe = null; } // called back: flies straight home
      if (r.st === "ground") { if (o.alive && hyp(o.x - r.x, o.y - r.y) < T * 0.7) caught(s, i); continue; }
      r.rot += dt * 22;
      const sp = hyp(r.vx, r.vy);
      if (r.st === "fly") {
        let nx = r.x + r.vx * dt, ny = r.y + r.vy * dt, bounced = false;
        if (wall(nx, r.y)) { r.vx = -r.vx; nx = r.x; bounced = true; }
        if (wall(nx, ny)) { r.vy = -r.vy; ny = r.y; bounced = true; }
        r.x = nx; r.y = ny; r.range -= sp * dt;
        if (bounced) { r.b++; if (r.boom) { explode(s, r); continue; } if (r.b > 2) { r.st = "ground"; continue; } }
        if (r.range <= 0) { if (r.boom) { explode(s, r); continue; } r.st = "return"; r.defl = false; r.safe = null; }
      } else {
        if (!o.alive) { r.st = "ground"; continue; }
        const dx = o.x - r.x, dy = o.y - r.y, d = hyp(dx, dy) || 1, k = Math.min(1, dt * 6);
        r.vx += (dx / d * 12 * T - r.vx) * k; r.vy += (dy / d * 12 * T - r.vy) * k;
        const nx = r.x + r.vx * dt, ny = r.y + r.vy * dt;
        if (!r.ph && wall(nx, ny)) { r.st = "ground"; continue; }
        r.x = nx; r.y = ny;
        if (d < T * 0.6) { caught(s, i); continue; }
      }
      if (r.kind && (r.tr += sp * dt) > T * 0.45) { r.tr = 0; s.patches.push({ x: r.x, y: r.y, k: r.kind, o, t: r.kind === "fire" ? 2.2 : 3.5 }); }
      for (const f of s.f) {
        if (!f.alive || !lethal(r, f) || hyp(f.x - r.x, f.y - r.y) > T * 0.52) continue;
        if (f.slashT > 0 && (r.x - f.x) * f.fx + (r.y - f.y) * f.fy > 0) { // batted away: now it's the slasher's shot
          r.vx = f.fx * 11 * T; r.vy = f.fy * 11 * T; r.st = "fly"; r.range = 5 * T; r.b = 0; r.safe = f; r.defl = true; r.ph = false;
          pop(s, f.x, f.y - T * 0.7, "DEFLECT!", "#e5e7eb"); G.sfx("pop");
        } else { hit(s, f, r.safe || o); if (r.boom) explode(s, r); else r.st = "ground"; }
        break;
      }
    }
  }

  // CPU brain: dodge what's coming, fetch a lost boomerang, grab power-ups, otherwise hunt the nearest rival.
  function think(s, f, dt) {
    const T = s.T, A = f.ai, sk = s.skill, to = (x, y) => { const dx = x - f.x, dy = y - f.y, d = hyp(dx, dy) || 1; return [dx / d, dy / d]; };
    A.cool -= dt;
    if (f.frozen > 0) { if (Math.random() < dt * 4) act(s, f, "dash", true); return [0, 0]; }
    let th = null, thd = 3.2 * T;
    for (const r of s.rangs) {
      if (!lethal(r, f)) continue;
      const dx = f.x - r.x, dy = f.y - r.y, d = hyp(dx, dy) || 1, sp = hyp(r.vx, r.vy) || 1;
      if (d < thd && (dx * r.vx + dy * r.vy) / (d * sp) > 0.8) { th = r; thd = d; }
    }
    A.aware = th ? A.aware + dt : 0;
    if (th && A.aware > 0.4 - 0.32 * sk) {
      const sp = hyp(th.vx, th.vy) || 1;
      if (f.has > 0 && thd < 1.4 * T && f.slashCd <= 0 && Math.random() < 0.3 + 0.6 * sk) { f.fx = (th.x - f.x) / thd; f.fy = (th.y - f.y) / thd; f.charge = -1; A.aim = 0; act(s, f, "slash", true); return [0, 0]; }
      const side = (f.x - th.x) * -th.vy + (f.y - th.y) * th.vx > 0 ? 1 : -1, mx = -th.vy / sp * side, my = th.vx / sp * side;
      if (thd < 2 * T && f.dashCd <= 0 && f.charge < 0 && Math.random() < sk) { f.fx = mx; f.fy = my; act(s, f, "dash", true); }
      return [mx, my];
    }
    let e = null, ed = 1e9;
    s.f.forEach(o => { if (o === f || !o.alive) return; const d = hyp(o.x - f.x, o.y - f.y); if (o.hid && d > 2.5 * T) return; if (d < ed) { ed = d; e = o; } });
    if (f.charge >= 0) { // winding up a throw
      A.aim -= dt;
      if (A.tg && A.tg.alive) { const g = A.tg, lead = hyp(g.x - f.x, g.y - f.y) / (11 * T) * sk, a = Math.atan2(g.y + g.mvy * lead - f.y, g.x + g.mvx * lead - f.x) + A.err; f.fx = Math.cos(a); f.fy = Math.sin(a); }
      if (A.aim <= 0) act(s, f, "throw", false);
      return [0, 0];
    }
    if (f.has === 0) {
      A.noR += dt; f.recall = A.noR > 0.5 + 1.2 * (1 - sk);
      let best = null, bd = 1e9;
      s.rangs.forEach(r => { if (r.o !== f || r.st !== "ground") return; const d = hyp(r.x - f.x, r.y - f.y); if (d < bd) { bd = d; best = r; } });
      if (best) { const p = path(s, f, best.x, best.y); return to(p[0], p[1]); }
      if (e && ed < 3 * T) { const d = to(e.x, e.y); return [-d[0], -d[1]]; }
      return [0, 0];
    }
    A.noR = 0; f.recall = false;
    let it = null, itd = 4 * T;
    s.items.forEach(o => { const d = hyp(o.x - f.x, o.y - f.y); if (d < itd) { itd = d; it = o; } });
    if (e) {
      if (ed < 1.25 * T) { const d = to(e.x, e.y); f.fx = d[0]; f.fy = d[1]; if (f.slashCd <= 0 && Math.random() < dt * (3 + 8 * sk)) act(s, f, "slash", true); }
      else if (A.cool <= 0 && ed < 8.5 * T && los(s, f.x, f.y, e.x, e.y)) {
        A.tg = e; A.err = (Math.random() - 0.5) * 0.7 * (1 - sk); A.aim = 0.12 + clamp((ed / T - 4.5) / 7, 0, 1) * 0.8; A.cool = 1.2 + (1 - sk) * 1.8 + Math.random() * 0.8;
        act(s, f, "throw", true); return [0, 0];
      }
    }
    if (!it && !e) { A.wt -= dt; if (A.wt <= 0) { A.wt = 2; A.wx = (1 + Math.random() * (COLS - 2)) * T; A.wy = (1 + Math.random() * (ROWS - 2)) * T; } }
    const g = it || e || { x: A.wx, y: A.wy }, p = path(s, f, g.x, g.y);
    return hyp(p[0] - f.x, p[1] - f.y) < 3 ? [0, 0] : to(p[0], p[1]);
  }

  function startRound(G) {
    const s = G.s, T = s.T; s.round++; s.map = MAPS[(s.round - 1) % MAPS.length];
    s.rangs = []; s.items = []; s.patches = []; s.booms = []; s.fx = []; s.pops = []; s.rt = 0; s.phase = "intro"; s.pt = 1.4;
    const best = Math.max.apply(null, s.f.slice(1).map(f => f.pts));
    s.skill = clamp(0.2 + s.round * 0.04 + (s.f[0].pts - best) * 0.05, 0.15, 0.95);
    s.f.forEach((f, i) => {
      for (let y = 0; y < ROWS; y++) { const x = s.map[y].indexOf(String(i + 1)); if (x >= 0) { f.x = (x + 0.5) * T; f.y = (y + 0.5) * T; } }
      const d = hyp(COLS * T / 2 - f.x, ROWS * T / 2 - f.y); f.fx = (COLS * T / 2 - f.x) / d; f.fy = (ROWS * T / 2 - f.y) / d;
      Object.assign(f, { alive: true, has: f.max, charge: -1, recall: false, slashT: 0, slashCd: 0, dashT: 0, dashCd: 0, inv: 0, frozen: 0, chill: 0, burn: null, kx: 0, ky: 0, mvx: 0, mvy: 0, hid: false });
      f.ai = { cool: 1 + Math.random() * 1.5, aware: 0, aim: 0, noR: 0, err: 0, tg: null, wt: 0, wx: f.x, wy: f.y };
    });
  }
  function step(G, dt) {
    const s = G.s, T = s.T, p = s.f[0];
    s.shake = Math.max(0, s.shake - dt);
    s.fx.forEach(o => { o.t -= dt; o.x += o.vx * dt; o.y += o.vy * dt; o.vx *= 0.92; o.vy *= 0.92; }); s.fx = s.fx.filter(o => o.t > 0);
    s.pops.forEach(o => { o.t -= dt; o.y -= T * 0.6 * dt; }); s.pops = s.pops.filter(o => o.t > 0);
    s.booms.forEach(o => o.t -= dt); s.booms = s.booms.filter(o => o.t > 0);
    if (s.phase !== "fight") {
      s.pt -= dt; if (s.pt > 0) return;
      if (s.phase === "intro") { s.phase = "fight"; return; }
      const top = s.f.slice().sort((a, b) => b.pts - a.pts);
      if (top[0].pts >= GOAL && top[0].pts > top[1].pts) {
        const won = top[0] === p, sc = p.pts * 100 + (won ? 1000 + (p.pts - top[1].pts) * 150 : 0);
        return G.over(sc, won ? (s.kos >= 8 ? "Boomerang master!" : "Top dawg!") : top[0].who.name + " wins. Rematch?");
      }
      return startRound(G);
    }
    s.rt += dt;
    s.patches.forEach(q => q.t -= dt); s.patches = s.patches.filter(q => q.t > 0);
    // power-up scrolls
    s.itemT -= dt;
    if (s.itemT <= 0 && s.items.length < 2) {
      s.itemT = 5 + Math.random() * 3;
      for (let k = 0; k < 30; k++) {
        const cx = Math.floor(Math.random() * COLS), cy = Math.floor(Math.random() * ROWS), x = (cx + 0.5) * T, y = (cy + 0.5) * T;
        if (s.map[cy][cx] !== "." || s.f.some(f => f.alive && hyp(f.x - x, f.y - y) < 2 * T)) continue;
        s.items.push({ x, y, k: PWK[Math.floor(Math.random() * PWK.length)], t: 0 }); break;
      }
    }
    s.items.forEach(o => o.t += dt);
    // you
    const k = s.keys, kx = (k.r ? 1 : 0) - (k.l ? 1 : 0), ky = (k.d ? 1 : 0) - (k.u ? 1 : 0);
    let mx = s.stick.x, my = s.stick.y; if (kx || ky) { const n = hyp(kx, ky); mx = kx / n; my = ky / n; }
    if (p.alive) stepF(s, p, mx, my, dt);
    s.f.forEach(f => { if (f.cpu && f.alive) { const m = think(s, f, dt); stepF(s, f, m[0], m[1], dt); } });
    s.f.forEach(f => { if (!f.alive) return; for (let i = s.items.length - 1; i >= 0; i--) if (hyp(s.items[i].x - f.x, s.items[i].y - f.y) < T * 0.6) give(s, f, s.items.splice(i, 1)[0].k); });
    stepRangs(s, dt);
    const alive = s.f.filter(f => f.alive);
    if (alive.length <= 1 || s.rt > 60) {
      s.phase = "end"; s.pt = 1.7; s.last = alive.length === 1 ? alive[0] : null;
      if (s.last) { s.last.pts++; if (s.last === p) G.sfx("win"); }
    }
  }

  function rang(c, x, y, rot, sz, col) {
    c.save(); c.translate(x, y); c.rotate(rot); c.lineCap = "round"; c.lineJoin = "round";
    const d = () => { c.beginPath(); c.moveTo(-sz * 0.5, sz * 0.28); c.lineTo(0, -sz * 0.28); c.lineTo(sz * 0.5, sz * 0.28); c.stroke(); };
    c.strokeStyle = "#2b1d0e"; c.lineWidth = sz * 0.44; d(); c.strokeStyle = col; c.lineWidth = sz * 0.26; d(); c.restore();
  }

  defGame({
    key: "boom", name: "Boomerang Dawgs", icon: "🪃", max: 9999,
    blurb: "Throw, slash, dash. One hit and you're out. First to 10.",
    how: "A boomerang brawl against Mittens, Rusty and Bao. One hit knocks anyone out. Drag the left side of the screen to move. THROW: hold to wind up a longer throw and let go to fling it the way you're facing. It bounces off walls and curves back to you. Empty-handed? Hold THROW to call it back, and it can hit someone on the way home. SLASH cuts anyone right in front of you and bats flying boomerangs away. DASH is a quick burst that also gets you across water (walk into water and you're out). Bushes hide you. Grab scrolls for power-ups that last the whole match: you can hold 3, and fire and ice don't mix. +1 for every knockout and +1 for being the last one standing. First to 10 wins. On a keyboard: arrows or WASD to move, Space to throw, Z to slash, X to dash.",
    lay(G) {
      const s = G.s; s.T = Math.max(16, Math.floor(Math.min(G.W / COLS, (G.H - HUD - CTRL) / ROWS)));
      s.ox = Math.round((G.W - COLS * s.T) / 2); s.oy = HUD + Math.round((G.H - HUD - CTRL - ROWS * s.T) / 2);
      const y = G.H - CTRL / 2;
      s.btn = [{ k: "throw", x: G.W - 54, y, r: 42, em: "🪃" }, { k: "slash", x: G.W - 138, y: y - 26, r: 27, em: "⚔️" }, { k: "dash", x: G.W - 138, y: y + 30, r: 25, em: "💨" }];
    },
    reset(G) {
      const s = G.s = { round: 0, kos: 0, shake: 0, itemT: 2, keys: {}, stick: { x: 0, y: 0, on: 0, ox: 0, oy: 0, kx: 0, ky: 0 }, f: WHO.map((w, i) => ({ who: w, cpu: i > 0, pts: 0, pw: [], max: 1 })) };
      this.lay(G); startRound(G); this.hook();
    },
    hook() {
      if (window._boomT) return; window._boomT = 1;
      const w = $("gwrap"); if (!w) return;
      const ids = {};
      const f = e => {
        if (G.key !== "boom" || G.state !== "play" || !G.s || !G.s.btn) return;
        const s = G.s, r = w.getBoundingClientRect(), st = s.stick, end = e.type !== "touchstart" && e.type !== "touchmove";
        for (let i = 0; i < e.changedTouches.length; i++) {
          const t = e.changedTouches[i], x = t.clientX - r.left, y = t.clientY - r.top;
          if (e.type === "touchstart") {
            const b = s.btn.find(b => hyp(x - b.x, y - b.y) < b.r + 10), kind = b ? b.k : x < G.W * 0.55 ? "stick" : "throw";
            ids[t.identifier] = kind;
            if (kind === "stick") { st.on = 1; st.ox = x; st.oy = y; st.x = st.y = st.kx = st.ky = 0; } else act(s, s.f[0], kind, true);
            continue;
          }
          const kind = ids[t.identifier]; if (!kind) continue;
          if (kind === "stick") {
            if (end) { st.on = 0; st.x = st.y = 0; }
            else { const dx = x - st.ox, dy = y - st.oy, d = hyp(dx, dy), m = d < 6 ? 0 : Math.min(1, d / 34); st.x = d ? dx / d * m : 0; st.y = d ? dy / d * m : 0; st.kx = d ? dx / d * Math.min(d, 34) : 0; st.ky = d ? dy / d * Math.min(d, 34) : 0; }
          } else if (end) act(s, s.f[0], kind, false);
          if (end) delete ids[t.identifier];
        }
      };
      ["touchstart", "touchmove", "touchend", "touchcancel"].forEach(n => w.addEventListener(n, f, { passive: true }));
    },
    onKey(G, k, isDown) {
      const s = G.s, m = { ArrowLeft: "l", a: "l", ArrowRight: "r", d: "r", ArrowUp: "u", w: "u", ArrowDown: "d", s: "d" }[k];
      if (m) { s.keys[m] = isDown; return; }
      const a = { " ": "throw", z: "slash", j: "slash", x: "dash", k: "dash", Shift: "dash" }[k]; if (!a) return;
      if (isDown && s.keys[a]) return; // key repeat
      s.keys[a] = isDown; act(s, s.f[0], a, isDown);
    },
    update(G, dt) {
      const s = G.s, n = s.f[0].alive || s.phase !== "fight" ? 1 : 3; // you're out: fast-forward the rest of the round
      for (let i = 0; i < n && G.state === "play"; i++) step(G, dt);
    },
    draw(G, c) {
      const s = G.s, T = s.T, W = G.W, H = G.H, p = s.f[0];
      c.fillStyle = "#1c2a1e"; c.fillRect(0, 0, W, H);
      c.save();
      c.translate(s.ox + (s.shake > 0 ? (Math.random() - 0.5) * 8 * s.shake * 4 : 0), s.oy + (s.shake > 0 ? (Math.random() - 0.5) * 8 * s.shake * 4 : 0));
      for (let y = 0; y < ROWS; y++) for (let x = 0; x < COLS; x++) {
        const ch = s.map[y][x], px = x * T, py = y * T;
        if (ch === "~") { c.fillStyle = "#38bdf8"; c.fillRect(px, py, T, T); c.fillStyle = "rgba(255,255,255,0.35)"; const o = Math.sin(G.t * 2 + x * 1.3 + y) * T * 0.15; c.fillRect(px + T * 0.2 + o, py + T * 0.3, T * 0.35, 2); c.fillRect(px + T * 0.45 - o, py + T * 0.65, T * 0.3, 2); }
        else { c.fillStyle = (x + y) % 2 ? "#e6d3a3" : "#dcc68f"; c.fillRect(px, py, T, T); }
      }
      s.patches.forEach(q => { c.globalAlpha = Math.min(1, q.t) * 0.75; c.fillStyle = q.k === "fire" ? (Math.random() < 0.5 ? "#fb923c" : "#ef4444") : "#bae6fd"; c.beginPath(); c.arc(q.x, q.y, T * 0.3, 0, 7); c.fill(); }); c.globalAlpha = 1;
      for (let y = 0; y < ROWS; y++) for (let x = 0; x < COLS; x++) if (s.map[y][x] === "#") {
        const px = x * T, py = y * T; c.fillStyle = "#5b4630"; c.fillRect(px, py, T, T); c.fillStyle = "#8a6b47"; c.fillRect(px + 2, py + 2, T - 4, T - 7); c.fillStyle = "rgba(255,255,255,0.18)"; c.fillRect(px + 4, py + 4, T - 8, 3);
      }
      s.items.forEach(o => { const b = Math.sin(o.t * 4) * 2; c.fillStyle = "rgba(253,224,71,0.35)"; c.beginPath(); c.arc(o.x, o.y, T * 0.42, 0, 7); c.fill(); c.fillStyle = "#000"; G.emoji(c, "📜", o.x, o.y + b, T * 0.6); });
      s.rangs.forEach(r => { if (r.st === "ground") rang(c, r.x, r.y, r.rot, T * 0.5, r.o.who.col); });
      // fighters
      s.f.slice().sort((a, b) => a.y - b.y).forEach(f => {
        if (!f.alive) return;
        const a = Math.atan2(f.fy, f.fx), R = T * 0.36;
        if (f.dashT > 0) { c.strokeStyle = "rgba(255,255,255,0.6)"; c.lineWidth = R; c.lineCap = "round"; c.beginPath(); c.moveTo(f.x, f.y); c.lineTo(f.x - f.fx * T * 0.9, f.y - f.fy * T * 0.9); c.stroke(); }
        c.fillStyle = "rgba(0,0,0,0.25)"; c.beginPath(); c.ellipse(f.x, f.y + R * 0.8, R, R * 0.4, 0, 0, 7); c.fill();
        if (f === p && f.charge >= 0) { const len = (4.5 + 7 * clamp(f.charge, 0, 0.8) / 0.8) * T * 0.5; c.strokeStyle = "rgba(255,255,255,0.75)"; c.lineWidth = 3; c.setLineDash([6, 6]); c.beginPath(); c.moveTo(f.x, f.y); c.lineTo(f.x + f.fx * len, f.y + f.fy * len); c.stroke(); c.setLineDash([]); }
        c.fillStyle = f.who.col; c.beginPath(); c.arc(f.x, f.y, R, 0, 7); c.fill();
        c.fillStyle = f.who.col; c.beginPath(); c.moveTo(f.x + f.fx * R * 1.5, f.y + f.fy * R * 1.5); c.lineTo(f.x + Math.cos(a + 0.6) * R, f.y + Math.sin(a + 0.6) * R); c.lineTo(f.x + Math.cos(a - 0.6) * R, f.y + Math.sin(a - 0.6) * R); c.fill();
        if (f.who.face) G.img(c, f.who.face, f.x, f.y, R * 2.1); else { c.fillStyle = "#000"; G.emoji(c, f.who.em, f.x, f.y + 1, R * 1.7); }
        if (f.has > 0) { const w = f.charge >= 0 ? -1.2 - Math.min(f.charge, 0.8) : 0.7; rang(c, f.x + Math.cos(a + w) * R * 1.25, f.y + Math.sin(a + w) * R * 1.25, a + 1.57, T * 0.42, "#fef3c7"); }
        if (f.slashT > 0) { const k = 1 - f.slashT / 0.16; c.strokeStyle = "rgba(255,255,255,0.9)"; c.lineWidth = 5; c.lineCap = "round"; c.beginPath(); c.arc(f.x, f.y, T * 0.95, a - 1.1 + k * 1.2, a - 0.3 + k * 1.4); c.stroke(); }
        if (hasP(f, "shield") || f.inv > 0) { c.strokeStyle = "rgba(125,211,252,0.9)"; c.lineWidth = 3; c.beginPath(); c.arc(f.x, f.y, R * 1.35, 0, 7); c.stroke(); }
        if (f.frozen > 0) { c.fillStyle = "rgba(186,230,253,0.7)"; c.fillRect(f.x - R * 1.2, f.y - R * 1.2, R * 2.4, R * 2.4); }
        if (f.burn) { c.fillStyle = "#000"; G.emoji(c, "🔥", f.x, f.y - R * 1.4, R * 1.2); }
      });
      s.rangs.forEach(r => { if (r.st !== "ground") { if (r.boom) { c.fillStyle = "#ef4444"; c.beginPath(); c.arc(r.x, r.y, T * 0.16, 0, 7); c.fill(); } rang(c, r.x, r.y, r.rot, T * 0.55, r.o.who.col); } });
      for (let y = 0; y < ROWS; y++) for (let x = 0; x < COLS; x++) if (s.map[y][x] === "b") {
        const px = (x + 0.5) * T, py = (y + 0.5) * T; c.fillStyle = "#2f8f46"; c.beginPath(); c.arc(px - T * 0.2, py + T * 0.1, T * 0.36, 0, 7); c.arc(px + T * 0.2, py + T * 0.1, T * 0.36, 0, 7); c.arc(px, py - T * 0.15, T * 0.4, 0, 7); c.fill(); c.fillStyle = "#46b05f"; c.beginPath(); c.arc(px - T * 0.05, py - T * 0.2, T * 0.2, 0, 7); c.fill();
      }
      if (p.alive && p.hid) { c.strokeStyle = p.who.col; c.lineWidth = 2; c.setLineDash([4, 4]); c.beginPath(); c.arc(p.x, p.y, T * 0.4, 0, 7); c.stroke(); c.setLineDash([]); }
      s.booms.forEach(o => { const k = 1 - o.t / 0.4; c.globalAlpha = 1 - k; c.fillStyle = "#fb923c"; c.beginPath(); c.arc(o.x, o.y, T * 1.5 * (0.4 + k * 0.6), 0, 7); c.fill(); c.fillStyle = "#fde047"; c.beginPath(); c.arc(o.x, o.y, T * 0.9 * (0.4 + k * 0.6), 0, 7); c.fill(); }); c.globalAlpha = 1;
      s.fx.forEach(o => { c.globalAlpha = Math.min(1, o.t * 2); c.fillStyle = o.col; c.fillRect(o.x - 3, o.y - 3, 6, 6); }); c.globalAlpha = 1;
      s.pops.forEach(o => { c.globalAlpha = Math.min(1, o.t * 2); G.text(c, o.txt, clamp(o.x, 50, COLS * T - 50) + 1, o.y + 1, 9, "#000"); G.text(c, o.txt, clamp(o.x, 50, COLS * T - 50), o.y, 9, o.col); }); c.globalAlpha = 1;
      c.restore();
      // scores
      G.hud(c, "", "", "", { h: HUD });
      s.f.forEach((f, i) => {
        const x = W * (i + 0.5) / 4; c.globalAlpha = f.alive ? 1 : 0.4;
        c.fillStyle = f.who.col; c.beginPath(); c.arc(x - 22, HUD / 2, 12, 0, 7); c.fill();
        if (f.who.face) G.img(c, f.who.face, x - 22, HUD / 2, 22); else { c.fillStyle = "#000"; G.emoji(c, f.who.em, x - 22, HUD / 2 + 1, 17); }
        G.text(c, String(f.pts), x, HUD / 2 - 5, 12, "#fff", "left");
        c.fillStyle = "#000"; f.pw.forEach((k, j) => G.emoji(c, PW[k][0], x + 5 + j * 12, HUD / 2 + 11, 10));
        c.globalAlpha = 1;
      });
      // controls
      const st = s.stick, jx = st.on ? st.ox : 74, jy = st.on ? st.oy : H - CTRL / 2;
      if (TOUCH) {
        c.strokeStyle = "rgba(255,255,255,0.35)"; c.lineWidth = 3; c.beginPath(); c.arc(jx, jy, 40, 0, 7); c.stroke();
        c.fillStyle = "rgba(255,255,255,0.45)"; c.beginPath(); c.arc(jx + st.kx, jy + st.ky, 20, 0, 7); c.fill();
        s.btn.forEach(b => {
          const off = b.k === "dash" ? p.dashCd > 0 : b.k === "slash" ? p.has <= 0 || p.slashCd > 0 : false;
          c.globalAlpha = off ? 0.35 : 1; c.fillStyle = b.k === "throw" ? "rgba(255,210,63,0.9)" : "rgba(255,255,255,0.22)"; c.beginPath(); c.arc(b.x, b.y, b.r, 0, 7); c.fill();
          c.fillStyle = "#000"; G.emoji(c, b.k === "throw" && p.has <= 0 ? "↩️" : b.em, b.x, b.y + 1, b.r * 0.9); c.globalAlpha = 1;
        });
      } else { G.text(c, "ARROWS MOVE   SPACE THROW", W / 2, H - CTRL / 2 - 12, 9, "rgba(255,255,255,0.7)"); G.text(c, "Z SLASH   X DASH", W / 2, H - CTRL / 2 + 12, 9, "rgba(255,255,255,0.7)"); }
      const my = s.oy + ROWS * T * 0.42;
      if (s.phase === "intro") { G.banner(c, "ROUND " + s.round, "#ffd23f", my); G.text(c, "FIRST TO " + GOAL, W / 2, my + 34, 11, "#fff"); }
      else if (s.phase === "end") { G.banner(c, s.last ? (s.last === p ? "YOU WIN IT!" : s.last.who.name + "!") : "DRAW!", s.last ? s.last.who.col : "#fff", my); if (s.last) G.text(c, "LAST ONE STANDING +1", W / 2, my + 34, 10, "#fff"); }
      else if (!p.alive) G.text(c, "YOU'RE OUT  >>", W / 2, s.oy + 14, 10, "#fff");
    }
  });
})();
