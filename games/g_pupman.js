// ---------- Pup-Man (maze chase) ----------
// The bulldog gobbles kibble in a maze while the mailman, vacuum, cat and bath tub give chase.
// Big bones in the corners make the chasers scared for a few seconds, and then they can be eaten.
const PUP_MAZE = [
  "###############",
  "#o...........o#",
  "#.###.###.###.#",
  "#.............#",
  "#.###.#.#.###.#",
  "#.....#.#.....#",
  "#####.#.#.#####",
  "####.......####",
  "####.##-##.####",
  "    .#HHH#.    ",
  "####.#####.####",
  "####.......####",
  "#####.#.#.#####",
  "#.............#",
  "#.##.#.#.#.##.#",
  "#.............#",
  "#.#.###.###.#.#",
  "#o...........o#",
  "###############"
];
const PUP_COLS = 15, PUP_ROWS = 19, PUP_TUN = 9;
const PUP_DIRS = [[0, -1], [-1, 0], [0, 1], [1, 0]]; // arcade tie-break order: up, left, down, right
const PUP_FOES = [
  { e: "📬", col: "#ff4d4d", name: "mailman", corner: [14, -2], line: "Caught by the mailman!" },
  { e: "🧹", col: "#ff8fd0", name: "vacuum", corner: [0, -2], line: "Sucked up by the vacuum!" },
  { e: "🐈", col: "#ffa53a", name: "cat", corner: [14, 20], line: "Swatted by the cat!" },
  { e: "🛁", col: "#3fd5e8", name: "tub", corner: [0, 20], line: "Bath time. Nooo!" }
];
function pupCell(s, x, y) {
  if (y === PUP_TUN) x = ((x % PUP_COLS) + PUP_COLS) % PUP_COLS;
  if (x < 0 || x >= PUP_COLS || y < 0 || y >= PUP_ROWS) return "#";
  return s.grid[y][x];
}
function pupWrap(x, y) { return y === PUP_TUN ? ((x % PUP_COLS) + PUP_COLS) % PUP_COLS : x; }
function pupDogOk(s, x, y) { const c = pupCell(s, x, y); return c !== "#" && c !== "-" && c !== "H"; }
function pupFoeOk(s, f, x, y) {
  const c = pupCell(s, x, y);
  if (c === "#") return false;
  if (c === "-" || c === "H") return f.st === "exit" || f.st === "eyes";
  return true;
}
function pupPlace(G) {
  // put everyone at their start spots for a new life / level
  const s = G.s, lv = s.level;
  s.dog = { tx: 7, ty: 15, dx: 0, dy: 0, p: 0, qx: -1, qy: 0, face: -1 };
  const rel = Math.max(0.35, 1 - 0.2 * (lv - 1));
  const starts = [[7, 7], [7, 9], [6, 9], [8, 9]], wait = [0, 1.5, 5, 9];
  s.foes = PUP_FOES.map((d, i) => ({
    i, tx: starts[i][0], ty: starts[i][1], dx: i === 0 ? -1 : 0, dy: 0, p: 0,
    st: i === 0 ? "out" : "house", wait: wait[i] * rel, scared: false, tgx: 7, tgy: 15, reroll: 0
  }));
  s.fright = 0; s.chain = 0; s.ready = 1.6; s.dying = 0;
  s.mode = "scatter"; s.modeI = 0; s.modeT = 7;
}
function pupNewMaze(G) {
  const s = G.s; s.grid = PUP_MAZE.map(r => r.split("")); s.left = 0;
  for (let y = 0; y < PUP_ROWS; y++) for (let x = 0; x < PUP_COLS; x++) { const c = s.grid[y][x]; if (c === "." || c === "o") s.left++; }
  if (s.grid[15][7] === ".") { s.grid[15][7] = " "; s.left--; }
  s.clear = 0;
}
function pupReverse(m) {
  if (!m.dx && !m.dy) return;
  m.tx = pupWrap(m.tx + m.dx, m.ty); m.ty += m.dy; m.p = Math.max(0, 1 - m.p); m.dx = -m.dx; m.dy = -m.dy;
}
function pupSpeeds(s) {
  const lv = s.level;
  return { dog: 6.4 + Math.min(0.8, (lv - 1) * 0.15), foe: Math.min(7.0, 5.3 + (lv - 1) * 0.45), scared: 3.5, eyes: 11, tun: 3.2 };
}
function pupTarget(G, f) {
  const s = G.s, d = s.dog, P = PUP_FOES[f.i];
  if (f.st === "eyes") return [7, 7];
  if (s.mode === "scatter") return P.corner;
  if (f.i === 0) return [d.tx, d.ty];                                  // mailman: straight at you
  if (f.i === 1) return [d.tx + d.dx * 4, d.ty + d.dy * 4];            // vacuum: cuts you off
  if (f.i === 2) return [f.tgx, f.tgy];                                // cat: wanders, sometimes hunts
  const dist = Math.hypot(d.tx - f.tx, d.ty - f.ty);                   // tub: shy, backs off up close
  return dist > 6 ? [d.tx, d.ty] : P.corner;
}
function pupChoose(G, f) {
  // called when a chaser arrives at a tile center: pick the next direction
  const s = G.s;
  if (f.st === "exit") {
    if (f.ty === 7 && f.tx === 7) { f.st = "out"; f.dx = Math.random() < 0.5 ? -1 : 1; f.dy = 0; return; }
    if (f.tx !== 7) { f.dx = f.tx < 7 ? 1 : -1; f.dy = 0; } else { f.dx = 0; f.dy = -1; }
    return;
  }
  if (f.st === "eyes") {
    if (f.tx === 7 && f.ty === 7) { f.dx = 0; f.dy = 1; return; }
    if (f.tx === 7 && f.ty === 8) { f.dx = 0; f.dy = 1; return; }
    if (f.tx === 7 && f.ty === 9) { f.st = "house"; f.wait = 0.6; f.scared = false; f.dx = 0; f.dy = 0; f.p = 0; return; }
  }
  const opts = [];
  for (const [ddx, ddy] of PUP_DIRS) {
    if (ddx === -f.dx && ddy === -f.dy && (f.dx || f.dy)) continue;
    const nx = f.tx + ddx, ny = f.ty + ddy;
    if (!pupFoeOk(s, f, nx, ny)) continue;
    if (f.st !== "eyes" && pupCell(s, nx, ny) === "-") continue;
    opts.push([ddx, ddy]);
  }
  if (!opts.length) { f.dx = -f.dx; f.dy = -f.dy; return; }
  let pick = opts[0];
  if (f.scared && f.st === "out") pick = opts[Math.floor(Math.random() * opts.length)];
  else {
    const [gx, gy] = pupTarget(G, f); let best = 1e9;
    for (const o of opts) { const dd = (f.tx + o[0] - gx) ** 2 + (f.ty + o[1] - gy) ** 2; if (dd < best) { best = dd; pick = o; } }
  }
  f.dx = pick[0]; f.dy = pick[1];
}
function pupEat(G) {
  const s = G.s, d = s.dog, c = s.grid[d.ty][d.tx];
  if (c === ".") { s.grid[d.ty][d.tx] = " "; s.score += 10; s.left--; s.munch = 0.12; }
  else if (c === "o") {
    s.grid[d.ty][d.tx] = " "; s.score += 50; s.left--;
    s.fright = Math.max(2.2, 6.2 - (s.level - 1) * 0.7); s.chain = 0; G.sfx("pop");
    s.foes.forEach(f => { if (f.st === "out") { f.scared = true; pupReverse(f); } else if (f.st !== "eyes") f.scared = true; });
  }
  if (s.left <= 0) { s.clear = 2; G.sfx("win"); }
}
function pupMoveDog(G, dt) {
  const s = G.s, d = s.dog, sp = pupSpeeds(s).dog;
  if (!d.dx && !d.dy) {
    if ((d.qx || d.qy) && pupDogOk(s, d.tx + d.qx, d.ty + d.qy)) { d.dx = d.qx; d.dy = d.qy; d.p = 0; }
    else return;
  }
  if (d.qx === -d.dx && d.qy === -d.dy) pupReverse(d);
  d.p += sp * dt;
  while (d.p >= 1) {
    d.p -= 1; d.tx = pupWrap(d.tx + d.dx, d.ty); d.ty += d.dy;
    pupEat(G); if (s.clear) return;
    if ((d.qx || d.qy) && pupDogOk(s, d.tx + d.qx, d.ty + d.qy)) { d.dx = d.qx; d.dy = d.qy; }
    else if (!pupDogOk(s, d.tx + d.dx, d.ty + d.dy)) { d.dx = 0; d.dy = 0; d.p = 0; break; }
  }
  if (d.dx) d.face = d.dx;
}
function pupMoveFoe(G, f, dt) {
  const s = G.s, V = pupSpeeds(s);
  if (f.st === "house") {
    f.wait -= dt; if (f.wait > 0) return;
    f.st = "exit"; f.p = 0; pupChoose(G, f);
  }
  let sp = f.st === "eyes" ? V.eyes : f.st === "exit" ? 3 : f.scared ? V.scared : V.foe;
  if (f.st === "out" && f.ty === PUP_TUN && (f.tx <= 3 || f.tx >= 11)) sp = Math.min(sp, V.tun);
  f.p += sp * dt;
  let guard = 0;
  while (f.p >= 1 && guard++ < 4) {
    f.p -= 1; f.tx = pupWrap(f.tx + f.dx, f.ty); f.ty += f.dy;
    pupChoose(G, f);
    if (f.st === "house") return;
  }
}
defGame({
  key: "pupman", name: "Pup-Man", icon: ":dawgW:", max: 999999,
  blurb: "Gobble kibble. Dodge the mailmen.",
  how: "Swipe (or tap a side of the dog) to steer through the maze and gobble every kibble. Turns are saved until the next opening. Big bones in the corners scare the chasers, so chomp them for 200, 400, 800, 1600. 3 lives.",
  reset(G) {
    G.s = { score: 0, lives: 3, level: 1, pops: [], munch: 0, flash: 0 };
    pupNewMaze(G); pupPlace(G);
    const s = G.s, top = 34, avail = G.H - top - 6;
    s.T = Math.max(10, Math.floor(Math.min(G.W / PUP_COLS, avail / PUP_ROWS)));
    s.ox = Math.floor((G.W - PUP_COLS * s.T) / 2); s.oy = Math.floor(top + (avail - PUP_ROWS * s.T) / 2);
  },
  update(G, dt) {
    const s = G.s;
    s.pops.forEach(p => p.t -= dt); if (s.pops.length && s.pops[0].t <= 0) s.pops = s.pops.filter(p => p.t > 0);
    if (s.munch > 0) s.munch -= dt;
    if (s.clear) {
      s.clear -= dt; s.flash += dt;
      if (s.clear <= 0) { s.level++; s.score = Math.min(999999, s.score); pupNewMaze(G); pupPlace(G); }
      return;
    }
    if (s.dying) {
      s.dying -= dt;
      if (s.dying <= 0) {
        s.lives--;
        if (s.lives <= 0) { G.over(Math.min(999999, s.score), PUP_FOES[s.killer].line); return; }
        pupPlace(G);
      }
      return;
    }
    if (s.ready > 0) { s.ready -= dt; return; }
    // scatter / chase rhythm (paused while scared)
    if (s.fright > 0) {
      s.fright -= dt;
      if (s.fright <= 0) { s.fright = 0; s.foes.forEach(f => f.scared = false); }
    } else {
      s.modeT -= dt;
      if (s.modeT <= 0) {
        const plan = [7, 20, 7, 20, 5, 20, 5, 1e9];
        s.modeI++; s.mode = s.modeI % 2 ? "chase" : "scatter"; s.modeT = plan[Math.min(s.modeI, plan.length - 1)];
        s.foes.forEach(f => { if (f.st === "out") pupReverse(f); });
      }
    }
    const cat = s.foes[2];
    cat.reroll -= dt;
    if (cat.reroll <= 0) {
      cat.reroll = 1.6;
      if (Math.random() < 0.45) { cat.tgx = s.dog.tx; cat.tgy = s.dog.ty; } else { cat.tgx = Math.floor(Math.random() * PUP_COLS); cat.tgy = Math.floor(Math.random() * PUP_ROWS); }
    }
    pupMoveDog(G, dt);
    if (s.clear) return;
    for (const f of s.foes) pupMoveFoe(G, f, dt);
    // collisions
    const d = s.dog, dx = d.tx + d.dx * d.p, dy = d.ty + d.dy * d.p;
    for (const f of s.foes) {
      if (f.st !== "out") continue;
      let fx = f.tx + f.dx * f.p, fy = f.ty + f.dy * f.p, ex = Math.abs(fx - dx);
      if (ex > PUP_COLS / 2) ex = PUP_COLS - ex;
      if (ex * ex + (fy - dy) ** 2 > 0.36) continue;
      if (f.scared) {
        const pts = 200 * Math.pow(2, Math.min(3, s.chain)); s.chain++; s.score += pts;
        f.st = "eyes"; f.scared = false;
        s.pops.push({ x: fx, y: fy, t: 0.9, txt: "" + pts }); G.sfx("pop"); G.buzz();
      } else {
        s.dying = 1.6; s.killer = f.i; G.sfx("lose"); G.buzz(); return;
      }
    }
  },
  swipe(G, dx, dy) { const d = G.s.dog; if (d) { d.qx = dx; d.qy = dy; } },
  tap(G, x, y) {
    // tap relative to the dog steers too (forgiving for thumbs)
    const s = G.s, d = s.dog; if (!d) return;
    const px = s.ox + (d.tx + d.dx * d.p + 0.5) * s.T, py = s.oy + (d.ty + d.dy * d.p + 0.5) * s.T;
    const ax = x - px, ay = y - py;
    if (Math.max(Math.abs(ax), Math.abs(ay)) < s.T * 0.5) return;
    if (Math.abs(ax) > Math.abs(ay)) { d.qx = ax > 0 ? 1 : -1; d.qy = 0; } else { d.qx = 0; d.qy = ay > 0 ? 1 : -1; }
  },
  onKey(G, k, down) {
    if (!down) return; const d = G.s.dog; if (!d) return;
    const m = { ArrowUp: [0, -1], w: [0, -1], ArrowDown: [0, 1], s: [0, 1], ArrowLeft: [-1, 0], a: [-1, 0], ArrowRight: [1, 0], d: [1, 0] }[k];
    if (m) { d.qx = m[0]; d.qy = m[1]; }
  },
  draw(G, c) {
    const s = G.s, W = G.W, H = G.H, dark = G.dark(), T = s.T, ox = s.ox, oy = s.oy;
    c.fillStyle = dark ? "#0d0f1e" : "#fff3dc"; c.fillRect(0, 0, W, H);
    // walls: chunky connected pipes
    const flashOn = s.clear && Math.floor(s.flash * 6) % 2;
    const wall = flashOn ? "#ffffff" : dark ? "#3858e0" : "#2f5bd6", wallHi = dark ? "#6f8bff" : "#7fa0ff";
    const ins = Math.max(2, Math.round(T * 0.2)), grid = s.grid;
    const isW = (x, y) => x < 0 || x >= PUP_COLS || y < 0 || y >= PUP_ROWS ? false : grid[y][x] === "#";
    for (let y = 0; y < PUP_ROWS; y++) for (let x = 0; x < PUP_COLS; x++) {
      if (grid[y][x] !== "#") continue;
      const l = isW(x - 1, y) ? 0 : ins, r = isW(x + 1, y) ? 0 : ins, t = isW(x, y - 1) ? 0 : ins, b = isW(x, y + 1) ? 0 : ins;
      const px = ox + x * T, py = oy + y * T;
      c.fillStyle = wall; c.fillRect(px + l, py + t, T - l - r, T - t - b);
      if (!t) continue;
      c.fillStyle = wallHi; c.fillRect(px + l, py + t, T - l - r, Math.max(2, T * 0.1));
    }
    // ghost-house door
    c.fillStyle = "#ff9fd6"; c.fillRect(ox + 7 * T, oy + 8 * T + T * 0.4, T, Math.max(3, T * 0.18));
    // kibble + big bones
    const kib = dark ? "#e6a95c" : "#8a5426", pulse = 0.85 + 0.15 * Math.sin(G.t * 8);
    for (let y = 0; y < PUP_ROWS; y++) for (let x = 0; x < PUP_COLS; x++) {
      const ch = grid[y][x], cx = ox + x * T + T / 2, cy = oy + y * T + T / 2;
      if (ch === ".") { c.fillStyle = kib; c.fillRect(cx - T * 0.1, cy - T * 0.1, T * 0.2, T * 0.2); }
      else if (ch === "o") {
        c.fillStyle = dark ? "rgba(255,210,63,.28)" : "rgba(255,170,40,.45)";
        c.beginPath(); c.arc(cx, cy, T * 0.48 * pulse, 0, 7); c.fill();
        G.emoji(c, "🦴", cx, cy, T * 0.95 * pulse);
      }
    }
    c.save(); c.beginPath(); c.rect(ox, oy, PUP_COLS * T, PUP_ROWS * T); c.clip();
    // chasers
    const ending = s.fright > 0 && s.fright < 1.8 && Math.floor(G.t * 8) % 2;
    (s.foes || []).forEach(f => {
      if (s.dying && s.dying < 1.1) return;
      if (s.clear) return;
      let fx = ox + (f.tx + f.dx * f.p + 0.5) * T, fy = oy + (f.ty + f.dy * f.p + 0.5) * T;
      if (f.st === "house") fy += Math.sin(G.t * 6 + f.i) * T * 0.15;
      if (f.st === "eyes") { G.emoji(c, "👀", fx, fy, T * 0.8); return; }
      const P = PUP_FOES[f.i], sc = f.scared;
      c.fillStyle = sc ? (ending ? "#ffffff" : "#2a3cff") : P.col;
      c.beginPath(); c.arc(fx, fy, T * 0.55, 0, 7); c.fill();
      c.strokeStyle = dark ? "rgba(255,255,255,.5)" : "rgba(0,0,0,.35)"; c.lineWidth = 2; c.stroke();
      if (sc) { c.globalAlpha = 0.75; G.emoji(c, P.e, fx, fy + T * 0.08, T * 0.7); c.globalAlpha = 1; G.emoji(c, "😱", fx + T * 0.32, fy - T * 0.36, T * 0.5); }
      else G.emoji(c, P.e, fx, fy + T * 0.04, T * 0.8);
    });
    // the dog
    const d = s.dog;
    if (d) {
      const px = ox + (d.tx + d.dx * d.p + 0.5) * T, py = oy + (d.ty + d.dy * d.p + 0.5) * T;
      const code = s.dying ? ":dawgpain:" : s.fright > 0 ? ":dawgpog:" : ":dawgW:";
      const sz = T * (s.dying ? 1.25 + (1.6 - s.dying) * 0.3 : 1.25) * (s.munch > 0 ? 1.08 : 1);
      G.img(c, code, px, py, sz, s.dying ? Math.sin(G.t * 20) * 0.2 : 0);
    }
    (s.pops || []).forEach(p => G.text(c, p.txt, ox + (p.x + 0.5) * T, oy + (p.y + 0.5) * T - (0.9 - p.t) * 20, Math.max(8, T * 0.4), "#7dfcff"));
    c.restore();
    // messages
    const midY = oy + 11.5 * T, msgC = dark ? "#ffd23f" : "#d94b00";
    if (s.ready > 0 && !s.dying && !s.clear) G.text(c, s.level > 1 ? `LEVEL ${s.level}` : "READY!", W / 2, midY, Math.max(10, T * 0.55), msgC);
    if (s.clear) G.text(c, "MAZE CLEAR!", W / 2, midY, Math.max(10, T * 0.55), msgC);
    // HUD
    c.fillStyle = "rgba(0,0,0,0.35)"; c.fillRect(0, 0, W, 30);
    G.text(c, `${s.score || 0}`, 10, 15, 11, "#fff", "left");
    G.text(c, `LV ${s.level || 1}`, W / 2, 15, 10, "#ffd23f");
    for (let i = 0; i < (s.lives || 0); i++) G.img(c, ":dawgW:", W - 14 - i * 22, 15, 20);
    if (s.fright > 0) { c.fillStyle = "#2a3cff"; c.fillRect(0, 28, W * Math.min(1, s.fright / 6.2), 3); }
  }
});
