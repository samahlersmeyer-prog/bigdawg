// ---------- Dawg Crossing (street + creek crossing) ----------
// Hop the bulldog across 5 lanes of traffic, a grassy median and 4 creek lanes of logs/floats,
// then into one of 5 dog houses. Fill all 5 to clear the level (traffic gets faster).
defGame({
  key: "cross", name: "Dawg Crossing", icon: "🚗", max: 99999,
  blurb: "Cross the street. Don't get flattened.",
  how: "Swipe (or tap above/below/left/right of the pup) to hop one square. Dodge the traffic, ride the logs and floats across the creek (no swimming!), and hop into an empty dog house. Fill all 5 houses to level up. 30 seconds per crossing, 3 lives.",
  reset(G) {
    const s = G.s = { score: 0, lives: 3, level: 1, time: 30, best: 12, houses: [0, 0, 0, 0, 0], lanes: [],
      dog: null, q: null, dead: null, pops: [], banner: 0, face: ":dawgW:" };
    s.lay = this.layout(G);
    this.build(s);
    this.spawn(s);
  },
  ROWS: 13, COLS: 9, HOP: 0.12,
  layout(G) {
    const T = Math.floor(Math.min(G.W / 9, (G.H - 50) / 13));
    return { T, ox: Math.round((G.W - 9 * T) / 2), oy: 32 };
  },
  // row -> kind: 0 houses, 1-4 creek, 5 median, 6-10 road, 11 sidewalk, 12 start grass
  build(s) {
    const lv = s.level, mult = 1 + 0.2 * (lv - 1), more = lv >= 3 ? 1 : 0;
    const spec = [
      [10, "car", 1, 0.9, -1, 3], [9, "taxi", 1, 1.3, 1, 2 + more], [8, "jeep", 1, 1.0, -1, 3],
      [7, "bus", 2, 0.75, 1, 2], [6, "mail", 2, 1.6, -1, 1 + more],
      [4, "log", 3, 0.7, 1, 2], [3, "donut", 2, 1.0, -1, 3], [2, "log", 4, 1.1, 1, 2], [1, "turtle", 2, 0.85, -1, 3]
    ];
    s.lanes = [];
    spec.forEach(([row, kind, len, sp, dir, n]) => {
      const P = 12 + len, objs = [];
      for (let i = 0; i < n; i++) objs.push({ x: -len - 2 + i * P / n + Math.random() * 0.6, len });
      s.lanes[row] = { kind, len, v: sp * dir * mult, P, objs, water: row <= 4 };
    });
  },
  spawn(s) {
    s.dog = { x: 4.5, r: 12, hop: 0, fx: 4.5, fr: 12, face: 0 };
    s.time = 30; s.best = 12; s.q = null; s.dead = null;
  },
  die(G, kind) {
    const s = G.s; if (s.dead) return;
    s.lives--; s.dead = { t: 1.1, kind }; s.q = null;
    G.sfx("lose"); G.buzz();
  },
  hop(G, dx, dy) {
    const s = G.s; if (!s.dog || s.dead || G.state !== "play") return;
    if (s.dog.hop > 0) { s.q = [dx, dy]; return; }
    const d = s.dog, nr = d.r + dy;
    let nx = d.x + dx;
    if (nr > 12) return;
    if (dx) {
      if (nr >= 5 && (nx < 0.4 || nx > 8.6)) return; // edge of the land
      if (nr < 5 && (nx < 0.15 || nx > 8.85)) return;
    }
    if (nr === 0) {
      // only into an empty house (columns 0,2,4,6,8)
      const col = Math.round((d.x - 0.5) / 2), cx = col * 2 + 0.5;
      if (col < 0 || col > 4 || Math.abs(d.x - cx) > 0.75 || s.houses[col]) { d.face = 0.25; return; }
      nx = cx;
    } else if (nr >= 5) nx = Math.min(8.5, Math.max(0.5, Math.round(nx - 0.5) + 0.5)); // snap on land
    d.fx = d.x; d.fr = d.r; d.x = nx; d.r = nr; d.hop = this.HOP; d.dir = dx;
    G.sfx("pop");
  },
  update(G, dt) {
    const s = G.s, d = s.dog;
    s.pops.forEach(p => p.t -= dt); s.pops = s.pops.filter(p => p.t > 0);
    if (s.banner > 0) s.banner -= dt;
    if (d.face > 0) d.face -= dt;
    // traffic + water
    const ramp = 1 + Math.min(0.25, G.t / 240);
    for (let r = 1; r <= 10; r++) {
      const L = s.lanes[r]; if (!L) continue;
      const v = L.v * ramp * dt;
      L.objs.forEach(o => {
        o.x += v;
        if (L.v > 0 && o.x >= 10) o.x -= L.P;
        else if (L.v < 0 && o.x + o.len <= -1) o.x += L.P;
      });
    }
    if (s.dead) {
      s.dead.t -= dt;
      if (s.dead.t <= 0) {
        if (s.lives <= 0) {
          const k = s.dead.kind;
          G.over(Math.min(99999, s.score), k === "car" ? "Flattened!" : k === "water" ? "Sploosh." : k === "time" ? "Out of time!" : "Ruff.");
          return;
        }
        this.spawn(s);
      }
      return;
    }
    s.time -= dt;
    if (s.time <= 0) { this.die(G, "time"); return; }
    if (d.hop > 0) {
      d.hop -= dt;
      if (d.hop > 0) return;
      d.hop = 0;
      // landed
      if (d.r < s.best) { s.score += 10 * (s.best - d.r); s.best = d.r; }
      if (d.r === 0) {
        const col = Math.round((d.x - 0.5) / 2); s.houses[col] = 1;
        const bonus = 100 + Math.floor(s.time) * 5;
        s.score += bonus; s.pops.push({ x: Math.min(8, Math.max(1, d.x)), r: 1.2, t: 0.9, txt: "+" + bonus });
        G.sfx("win");
        if (s.houses.every(h => h)) {
          s.score += 500; s.level++; s.houses = [0, 0, 0, 0, 0]; s.banner = 1.8;
          s.pops.push({ x: 4.5, r: 7, t: 1.4, txt: "+500" });
          this.build(s);
        }
        this.spawn(s); return;
      }
      if (s.q) { const q = s.q; s.q = null; this.hop(G, q[0], q[1]); if (d.hop > 0) return; }
    }
    // collisions / riding
    const L = s.lanes[d.r];
    if (L && !L.water) {
      for (const o of L.objs) if (d.x + 0.3 > o.x + 0.08 && d.x - 0.3 < o.x + o.len - 0.08) { this.die(G, "car"); return; }
    } else if (L && L.water) {
      let on = null;
      for (const o of L.objs) if (d.x > o.x - 0.12 && d.x < o.x + o.len + 0.12) { on = o; break; }
      if (!on) { this.die(G, "water"); return; }
      d.x += L.v * ramp * dt;
      if (d.x < 0 || d.x > 9) { this.die(G, "edge"); return; }
    }
  },
  swipe(G, dx, dy) { this.hop(G, dx, dy); },
  tap(G, x, y) {
    const s = G.s, { T, ox, oy } = s.lay, d = s.dog; if (!d) return;
    const px = ox + d.x * T, py = oy + (d.r + 0.5) * T, ddx = x - px, ddy = y - py;
    if (Math.abs(ddx) < T * 0.5 && Math.abs(ddy) < T * 0.5) { this.hop(G, 0, -1); return; }
    if (Math.abs(ddy) >= Math.abs(ddx)) this.hop(G, 0, ddy < 0 ? -1 : 1); else this.hop(G, ddx < 0 ? -1 : 1, 0);
  },
  onKey(G, k, down) {
    if (!down) return;
    const m = { ArrowUp: [0, -1], w: [0, -1], ArrowDown: [0, 1], s: [0, 1], ArrowLeft: [-1, 0], a: [-1, 0], ArrowRight: [1, 0], d: [1, 0], " ": [0, -1] }[k];
    if (m) this.hop(G, m[0], m[1]);
  },
  draw(G, c) {
    const s = G.s, W = G.W, H = G.H, dark = G.dark(), { T, ox, oy } = s.lay;
    const Y = r => oy + r * T, X = x => ox + x * T;
    c.fillStyle = dark ? "#10141c" : "#2b3a2a"; c.fillRect(0, 0, W, H);
    const pal = dark
      ? { g1: "#24502a", g2: "#2a5a30", hedge: "#173d1d", road: "#2a2a30", line: "#c9b44a", walk: "#5a5a64", w1: "#173e66", w2: "#1d4a78", wave: "#3d78b0" }
      : { g1: "#6fc04f", g2: "#7cca5c", hedge: "#2f8a3a", road: "#4a4a52", line: "#ffd23f", walk: "#b9b9c2", w1: "#3a8de0", w2: "#479ae8", wave: "#a9d8ff" };
    // rows
    for (let r = 0; r < 13; r++) {
      const y = Y(r);
      if (r === 0) { c.fillStyle = pal.hedge; c.fillRect(0, y, W, T); }
      else if (r <= 4) {
        c.fillStyle = r % 2 ? pal.w1 : pal.w2; c.fillRect(0, y, W, T);
        c.strokeStyle = pal.wave; c.lineWidth = 2; c.beginPath();
        const off = ((G.t * 14 * (r % 2 ? 1 : -1)) % 28 + 28) % 28;
        for (let x = -28 + off; x < W; x += 28) { c.moveTo(x, y + T * 0.55); c.quadraticCurveTo(x + 7, y + T * 0.42, x + 14, y + T * 0.55); }
        c.stroke();
      } else if (r === 5 || r === 12) {
        for (let x = 0, i = 0; x < W; x += T / 2, i++) { c.fillStyle = (i + r) % 2 ? pal.g1 : pal.g2; c.fillRect(x, y, T / 2 + 1, T); }
        if (r === 5) G.emoji(c, "🌼", X(0.25), y + T * 0.3, T * 0.3), G.emoji(c, "🌷", X(8.7), y + T * 0.7, T * 0.3);
      } else if (r === 11) {
        c.fillStyle = pal.walk; c.fillRect(0, y, W, T);
        c.fillStyle = "rgba(0,0,0,0.15)"; for (let x = ox % T; x < W; x += T) c.fillRect(x, y, 2, T);
        c.fillRect(0, y, W, 3);
      } else {
        c.fillStyle = pal.road; c.fillRect(0, y, W, T);
        if (r > 6) { c.fillStyle = r === 7 ? pal.line : "rgba(255,255,255,0.55)"; for (let x = 4; x < W; x += T) c.fillRect(x, y - 1, T * 0.45, 3); }
      }
    }
    // curb lines
    c.fillStyle = "rgba(255,255,255,0.7)"; c.fillRect(0, Y(6) - 2, W, 3); c.fillRect(0, Y(11) - 2, W, 3);
    // houses
    for (let i = 0; i < 5; i++) {
      const cx = X(i * 2 + 0.5), y = Y(0), w = T * 0.86;
      c.fillStyle = "#8a5a32"; c.fillRect(cx - w / 2, y + T * 0.38, w, T * 0.58);
      c.fillStyle = "#d8443c"; c.beginPath(); c.moveTo(cx - w / 2 - 3, y + T * 0.42); c.lineTo(cx, y + T * 0.04); c.lineTo(cx + w / 2 + 3, y + T * 0.42); c.fill();
      c.fillStyle = "#2a1a10"; c.beginPath(); c.arc(cx, y + T * 0.72, T * 0.2, Math.PI, 0); c.rect(cx - T * 0.2, y + T * 0.72, T * 0.4, T * 0.24); c.fill();
      if (s.houses && s.houses[i]) G.img(c, ":dawgW:", cx, y + T * 0.68, T * 0.62);
    }
    // bushes between houses
    for (let i = 0; i < 4; i++) G.emoji(c, "🌳", X(i * 2 + 1.5), Y(0) + T * 0.55, T * 0.62);
    // lanes
    c.save(); c.beginPath(); c.rect(0, Y(1), W, T * 10); c.clip();
    for (let r = 1; r <= 10; r++) {
      const L = s.lanes && s.lanes[r]; if (!L) continue;
      const y = Y(r), right = L.v > 0;
      L.objs.forEach(o => {
        const x0 = X(o.x), w = o.len * T;
        if (x0 > W + 4 || x0 + w < -4) return;
        this.drawThing(G, c, L.kind, x0, y, w, T, right);
      });
    }
    c.restore();
    // dog
    const d = s.dog;
    if (d) {
      let k = d.hop > 0 ? d.hop / this.HOP : 0;
      const dx = d.x + (d.fx - d.x) * k, dr = d.r + (d.fr - d.r) * k, lift = Math.sin(k * Math.PI) * T * 0.3;
      const px = X(dx), py = Y(dr) + T * 0.5;
      if (s.dead) {
        const kd = s.dead.kind;
        if (kd === "water" || kd === "edge") G.emoji(c, "💦", px, py, T * 0.9);
        else if (kd === "car") G.emoji(c, "💥", px, py, T * 1.0);
        G.img(c, ":dawgpain:", px, py - (1.1 - s.dead.t) * 10, T * 0.8);
      } else {
        c.fillStyle = "rgba(0,0,0,0.25)"; c.beginPath(); c.ellipse(px, py + T * 0.3, T * 0.3, T * 0.1, 0, 0, 7); c.fill();
        const face = d.face > 0 ? ":dawgsus:" : s.time < 6 ? ":dawgsweat:" : ":dawgW:";
        G.img(c, face, px, py - lift, T * 0.86 * (1 + 0.12 * Math.sin(k * Math.PI)), d.hop > 0 ? (d.dir || 0) * 0.2 : 0);
      }
    }
    // pops
    (s.pops || []).forEach(p => G.text(c, p.txt, X(p.x), Y(p.r) - (1 - p.t) * 30, 12, "#ffd23f"));
    if (s.banner > 0) {
      c.fillStyle = "rgba(0,0,0,0.55)"; c.fillRect(0, Y(5), W, T);
      G.text(c, `LEVEL ${s.level}!`, W / 2, Y(5.5), 16, "#ffd23f");
    }
    // HUD
    c.fillStyle = "rgba(0,0,0,0.55)"; c.fillRect(0, 0, W, 30);
    G.text(c, `SCORE ${s.score || 0}`, 10, 15, 11, "#fff", "left");
    G.text(c, `LV${s.level || 1}`, W / 2, 15, 11, "#7fd6ff");
    for (let i = 0; i < 3; i++) {
      c.globalAlpha = i < (s.lives || 0) ? 1 : 0.2; G.img(c, ":dawgW:", W - 16 - i * 24, 15, 22);
    }
    c.globalAlpha = 1;
    // timer bar
    const by = Y(13) + 5, bw = W - 20, frac = Math.max(0, Math.min(1, (s.time || 0) / 30));
    c.fillStyle = "rgba(0,0,0,0.5)"; c.fillRect(10, by, bw, 9);
    c.fillStyle = frac < 0.2 ? "#ff6b6b" : frac < 0.45 ? "#ffd23f" : "#5be37a"; c.fillRect(11, by + 1, (bw - 2) * frac, 7);
  },
  drawThing(G, c, kind, x, y, w, T, right) {
    const pad = T * 0.1, h = T - pad * 2, yy = y + pad;
    const rr = (x1, y1, ww, hh, rad) => { c.beginPath(); c.roundRect ? c.roundRect(x1, y1, ww, hh, rad) : c.rect(x1, y1, ww, hh); };
    if (kind === "log") {
      c.fillStyle = "#7a4a22"; rr(x + 2, yy + 2, w - 4, h - 4, h / 2); c.fill();
      c.fillStyle = "#94602f"; c.fillRect(x + h / 2, yy + h * 0.3, w - h, 3); c.fillRect(x + h / 2, yy + h * 0.62, w - h, 3);
      c.fillStyle = "#d9a86a"; c.beginPath(); c.ellipse(x + w - h / 2 + 1, yy + h / 2, h * 0.28, h * 0.4, 0, 0, 7); c.fill();
      c.strokeStyle = "#94602f"; c.lineWidth = 2; c.beginPath(); c.ellipse(x + w - h / 2 + 1, yy + h / 2, h * 0.14, h * 0.2, 0, 0, 7); c.stroke();
    } else if (kind === "donut") {
      for (let i = 0; i < w / T - 0.01; i++) {
        const cx = x + T * (i + 0.5), cy = y + T / 2;
        c.fillStyle = i % 2 ? "#ffd23f" : "#ff7ab8"; c.beginPath(); c.arc(cx, cy, T * 0.42, 0, 7); c.fill();
        c.fillStyle = "#fff"; c.fillRect(cx - 2, cy - T * 0.42, 4, T * 0.84);
        c.fillStyle = "rgba(20,60,120,0.85)"; c.beginPath(); c.arc(cx, cy, T * 0.16, 0, 7); c.fill();
      }
    } else if (kind === "turtle") {
      c.fillStyle = "#3e8f5a"; rr(x + 3, yy + 3, w - 6, h - 6, 6); c.fill();
      for (let i = 0; i < w / T - 0.01; i++) G.emoji(c, "🐢", x + T * (i + 0.5), y + T / 2, T * 0.7);
    } else if (kind === "bus" || kind === "mail") {
      const bus = kind === "bus";
      c.fillStyle = bus ? "#f4b82e" : "#f2f2f2"; rr(x + 2, yy + 2, w - 4, h - 4, 5); c.fill();
      c.fillStyle = "rgba(0,0,0,0.25)"; c.fillRect(x + 3, yy + h - 7, w - 6, 3);
      if (bus) { c.fillStyle = "#3d5a80"; for (let i = 0; i < 4; i++) c.fillRect(x + 8 + i * (w - 16) / 4, yy + 6, (w - 16) / 4 - 4, h * 0.32); }
      else { c.fillStyle = "#2a5bd7"; c.fillRect(x + 4, yy + h * 0.45, w - 8, 4); c.fillStyle = "#d8443c"; c.fillRect(x + 4, yy + h * 0.45 + 4, w - 8, 3); G.emoji(c, "✉️", x + w * 0.42, yy + h * 0.3, h * 0.36); }
      c.fillStyle = "#9fd8ff"; c.fillRect(right ? x + w - 10 : x + 4, yy + 5, 6, h - 14); // windshield on the front
      c.fillStyle = "#222"; [0.22, 0.78].forEach(f => { c.beginPath(); c.arc(x + w * f, yy + h - 2, 4, 0, 7); c.fill(); });
    } else {
      const ch = kind === "taxi" ? "🚕" : kind === "jeep" ? "🚙" : "🚗";
      c.save(); c.translate(x + w / 2, y + T / 2); if (right) c.scale(-1, 1);
      G.emoji(c, ch, 0, 0, T * 0.82); c.restore();
    }
  }
});
