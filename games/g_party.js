// ---------- Dawg Party (party minigame gauntlet) ----------
// 5 random quick minigames per run, each worth up to ~200. Score = total.
(function () {
  const rnd = n => Math.floor(Math.random() * n);
  const DIRS = { up: [0, -1, "UP", "⬆️"], down: [0, 1, "DOWN", "⬇️"], left: [-1, 0, "LEFT", "⬅️"], right: [1, 0, "RIGHT", "➡️"] };
  const COLS = [["RED", "#e53935"], ["BLUE", "#1e88e5"], ["GREEN", "#43a047"], ["YELLOW", "#fdd835"]];
  const MOODS = [":dawgW:", ":dawgpog:", ":dawgsus:", ":dawgpain:"];
  const BANDS = [[0.2, 0.5], [0.5, 0.68], [0.68, 0.98]];
  const TOYS = ["🧸", "🎾", "🦴", "🧦", "🥏", "🐤", "🪀", "🧶"];
  const VALS = [5, 8, 12, 16, 20, 25, 30];

  const MG = {
    says: {
      name: "DAWG SAYS", how: "SWIPE ONLY WHEN DAWG SAYS!", dur: 25,
      init(G, m) { m.n = 0; m.strikes = 0; m.cmd = null; m.gap = 0.6; },
      next(m) { const k = Object.keys(DIRS)[rnd(4)]; m.cmd = { k, real: Math.random() < 0.72, t: 0, max: Math.max(0.85, 2.2 - m.n * 0.08) }; m.n++; },
      res(G, m, ok) { if (ok) { m.pts += 10; m.flash = { ok: 1, t: 0.4 }; G.sfx("pop"); } else { m.strikes++; m.flash = { ok: 0, t: 0.5 }; G.buzz(); if (m.strikes >= 3) m.end = 1; } m.cmd = null; m.gap = 0.35; },
      update(G, m, dt) {
        if (!m.cmd) { m.gap -= dt; if (m.gap <= 0) this.next(m); return; }
        m.cmd.t += dt; if (m.cmd.t >= m.cmd.max) this.res(G, m, !m.cmd.real);
      },
      swipe(G, m, dx, dy) { const c = m.cmd; if (!c) return; const d = DIRS[c.k]; this.res(G, m, c.real && dx === d[0] && dy === d[1]); },
      draw(G, c, m, ink) {
        const W = G.W, H = G.H, cx = W / 2, cy = H * 0.42;
        G.img(c, m.flash && !m.flash.ok ? ":dawgsus:" : ":dawgW:", cx, cy, 120);
        if (m.cmd) {
          const d = DIRS[m.cmd.k]; G.emoji(c, d[3], cx + d[0] * 95, cy + d[1] * 95, 46);
          if (m.cmd.real) G.text(c, "DAWG SAYS:", cx, H * 0.7, 14, "#ffd23f");
          G.text(c, `SWIPE ${d[2]}!`, cx, H * 0.7 + 28, 18, ink);
          c.fillStyle = "rgba(0,0,0,0.2)"; c.fillRect(40, H * 0.8, W - 80, 8); c.fillStyle = "#ff7043"; c.fillRect(40, H * 0.8, (W - 80) * (1 - m.cmd.t / m.cmd.max), 8);
        }
        G.text(c, "❌".repeat(m.strikes) + "▫️".repeat(3 - m.strikes), cx, H * 0.88, 14, ink);
      }
    },
    lava: {
      name: "FLOOR IS LAVA", how: "TAP A TILE OF THE CALLED COLOR!", dur: 40,
      init(G, m) { m.r = 0; this.color(G, m); m.px = G.W / 2; m.py = m.tiles[4].y; m.tx = m.px; m.ty = m.py; },
      color(G, m) {
        const gw = Math.min(G.W - 40, G.H - 220), sz = gw / 3, x0 = (G.W - gw) / 2, y0 = 110;
        m.call = rnd(4); m.tiles = [];
        for (let i = 0; i < 9; i++) m.tiles.push({ x: x0 + (i % 3) * sz + sz / 2, y: y0 + Math.floor(i / 3) * sz + sz / 2, sz: sz - 8, col: rnd(4) });
        const n = Math.max(1, 4 - Math.floor(m.r / 3)); // fewer safe tiles as rounds go on
        m.tiles.forEach(t => { if (t.col === m.call) t.col = (t.col + 1 + rnd(3)) % 4; });
        for (let k = 0; k < n; k++) m.tiles[rnd(9)].col = m.call;
        m.ct = Math.max(1.1, 2.6 - m.r * 0.15); m.drop = 0;
      },
      update(G, m, dt) {
        const dx = m.tx - m.px, dy = m.ty - m.py, d = Math.hypot(dx, dy), v = 650 * dt;
        if (d > v) { m.px += dx / d * v; m.py += dy / d * v; } else { m.px = m.tx; m.py = m.ty; }
        if (m.drop) { m.drop -= dt; if (m.drop <= 0) { if (m.fell) { m.end = 1; return; } m.r++; if (m.r >= 10) { m.end = 1; return; } this.color(G, m); } return; }
        m.ct -= dt;
        if (m.ct <= 0) {
          const t = m.tiles.reduce((a, b) => Math.hypot(b.x - m.px, b.y - m.py) < Math.hypot(a.x - m.px, a.y - m.py) ? b : a);
          m.fell = t.col !== m.call || Math.hypot(t.x - m.px, t.y - m.py) > t.sz / 2 + 6;
          if (m.fell) { G.sfx("lose"); G.buzz(); } else { m.pts += 20; G.sfx("pop"); }
          m.drop = 0.9;
        }
      },
      tap(G, m, x, y) { if (m.drop) return; const t = m.tiles.find(t => Math.abs(t.x - x) < t.sz / 2 + 4 && Math.abs(t.y - y) < t.sz / 2 + 4); if (t) { m.tx = t.x; m.ty = t.y; } },
      draw(G, c, m, ink) {
        m.tiles.forEach(t => {
          const gone = m.drop && t.col !== m.call; c.globalAlpha = gone ? Math.max(0, m.drop - 0.3) : 1;
          c.fillStyle = gone ? "#ff5722" : COLS[t.col][1]; c.fillRect(t.x - t.sz / 2, t.y - t.sz / 2, t.sz, t.sz); c.globalAlpha = 1;
        });
        G.img(c, m.drop && m.fell ? ":dawgpain:" : ":dawgpog:", m.px, m.py, 54);
        const [nm, col] = COLS[m.call];
        G.text(c, m.drop ? (m.fell ? "SPLASH!" : "SAFE!") : `GO TO ${nm}!`, G.W / 2, 72, 16, col);
        if (!m.drop) G.text(c, m.ct.toFixed(1), G.W / 2, G.H - 40, 16, ink);
        G.text(c, `ROUND ${m.r + 1}/10`, G.W / 2, G.H - 70, 10, ink);
      }
    },
    wake: {
      name: "DON'T WAKE BIG DAWG", how: "PICK TOYS. BANK BEFORE HE WAKES!", dur: 60,
      init(G, m) { m.set = 0; this.deal(m); },
      deal(m) { m.bad = rnd(8); m.open = []; m.pot = 0; m.woke = 0; m.pause = 0; },
      cells(G) { const w = (G.W - 40) / 4, out = []; for (let i = 0; i < 8; i++) out.push({ x: 20 + (i % 4) * w + w / 2, y: G.H * 0.5 + Math.floor(i / 4) * (w + 6), r: w / 2 - 4 }); return out; },
      after(G, m) { m.set++; m.pause = 1.3; },
      update(G, m, dt) { if (m.pause) { m.pause -= dt; if (m.pause <= 0) { m.pause = 0; if (m.set >= 3) m.end = 1; else this.deal(m); } } },
      tap(G, m, x, y) {
        if (m.pause) return;
        if (y > G.H - 80 && m.pot) { m.pts += m.pot; m.banked = m.pot; G.sfx("win"); this.after(G, m); return; }
        const i = this.cells(G).findIndex(p => Math.hypot(p.x - x, p.y - y) < p.r + 4); if (i < 0 || m.open.includes(i)) return;
        m.open.push(i);
        if (i === m.bad) { m.woke = 1; m.pot = 0; m.banked = 0; G.sfx("lose"); G.buzz(); this.after(G, m); return; }
        m.pot += VALS[m.open.length - 1]; G.sfx("pop");
        if (m.open.length === 7) { m.pts += m.pot; m.banked = m.pot; this.after(G, m); }
      },
      draw(G, c, m, ink) {
        const W = G.W, H = G.H;
        G.img(c, m.woke ? ":dawgsus:" : ":dawgW:", W / 2, H * 0.24, 100);
        G.emoji(c, m.woke ? "💢" : "💤", W / 2 + 56, H * 0.24 - 46 + (m.woke ? 0 : Math.sin(G.t * 3) * 4), 34);
        G.text(c, m.woke ? "HE'S AWAKE! POT LOST" : m.pause ? `BANKED ${m.banked}!` : `POT ${m.pot}  ·  NEXT +${VALS[m.open.length] || 0}`, W / 2, H * 0.4, 12, m.woke ? "#e53935" : ink);
        this.cells(G).forEach((p, i) => {
          const op = m.open.includes(i), bad = (m.woke || m.pause) && i === m.bad;
          c.fillStyle = bad ? "#e53935" : op ? "rgba(91,227,91,0.35)" : "rgba(0,0,0,0.18)"; c.beginPath(); c.arc(p.x, p.y, p.r, 0, 7); c.fill();
          G.emoji(c, bad ? "📣" : TOYS[i], p.x, p.y, p.r * 1.05); if (op && !bad) G.text(c, "✓", p.x + p.r * 0.6, p.y - p.r * 0.6, 12, "#2e7d32");
        });
        if (m.pot && !m.pause) { c.fillStyle = "#ffd23f"; c.fillRect(40, H - 70, W - 80, 50); G.text(c, `BANK ${m.pot}`, W / 2, H - 45, 14, "#222"); }
        G.text(c, `SET ${Math.min(3, m.set + 1)} OF 3`, W / 2, H * 0.4 + 22, 10, ink);
      }
    },
    face: {
      name: "FACE LIFT", how: "TAP EACH STRIP TO MATCH THE FACE!", dur: 25,
      init(G, m) { m.done = 0; this.newFace(m); },
      newFace(m) { m.tgt = [rnd(4), rnd(4), rnd(4)]; m.cur = m.tgt.map(v => (v + 1 + rnd(3)) % 4); m.ok = 0; },
      geo(G) { const S = Math.min(G.W - 90, G.H * 0.44); return { S, x: G.W / 2, y: G.H * 0.56 }; },
      update(G, m, dt) { if (m.ok) { m.ok -= dt; if (m.ok <= 0) this.newFace(m); } },
      tap(G, m, x, y) {
        if (m.ok) return; const g = this.geo(G), top = g.y - g.S / 2;
        const b = BANDS.findIndex(([a, z]) => y >= top + g.S * a - 6 && y <= top + g.S * z + 6); if (b < 0) return;
        m.cur[b] = (m.cur[b] + 1) % 4; G.sfx("pop");
        if (m.cur.every((v, i) => v === m.tgt[i])) { m.pts += 40; m.done++; m.ok = 0.5; G.sfx("win"); }
      },
      strip(G, c, code, x, y, S, a, z) { c.save(); c.beginPath(); c.rect(x - S / 2, y - S / 2 + S * a, S, S * (z - a)); c.clip(); G.img(c, code, x, y, S); c.restore(); },
      draw(G, c, m, ink) {
        G.text(c, "MATCH THIS:", G.W / 2 - 50, 62, 10, ink);
        const sm = 80; c.save(); this.strip(G, c, MOODS[m.tgt[0]], G.W / 2 + 40, 80, sm, 0, 0.2); BANDS.forEach(([a, z], i) => this.strip(G, c, MOODS[m.tgt[i]], G.W / 2 + 40, 80, sm, a, z)); c.restore();
        const g = this.geo(G); this.strip(G, c, MOODS[m.cur[0]], g.x, g.y, g.S, 0, 0.2); BANDS.forEach(([a, z], i) => this.strip(G, c, MOODS[m.cur[i]], g.x, g.y, g.S, a, z));
        c.strokeStyle = "rgba(0,0,0,0.35)"; c.lineWidth = 2; BANDS.slice(1).forEach(([a]) => { const yy = g.y - g.S / 2 + g.S * a; c.beginPath(); c.moveTo(g.x - g.S / 2, yy); c.lineTo(g.x + g.S / 2, yy); c.stroke(); });
        if (m.ok) G.banner(c, "MATCH!", "#5be35b", g.y);
        G.text(c, `FACES ${m.done}`, G.W / 2, G.H - 24, 11, ink);
      }
    },
    tug: {
      name: "TUG OF WOOF", how: "MASH THE SCREEN! PULL HIM OVER!", dur: 15,
      init(G, m) { m.p = 0; m.e = 0; },
      update(G, m, dt) { m.e += dt; m.p -= (0.12 + 0.02 * m.e) * dt; if (m.p <= -1) { m.p = -1; m.end = 1; G.sfx("lose"); } if (m.p >= 1) { m.p = 1; m.pts = Math.max(110, Math.round(200 - m.e * 6)); m.end = 1; G.sfx("win"); } m.pts = m.p >= 1 ? m.pts : Math.round((m.p + 1) * 50); },
      down(G, m) { m.p += 0.035; m.shake = 0.08; },
      draw(G, c, m, ink) {
        const W = G.W, H = G.H, mid = H / 2 - m.p * H * 0.28;
        c.fillStyle = "rgba(0,0,0,0.12)"; c.fillRect(0, H / 2 - 2, W, 4);
        c.strokeStyle = "#a1773f"; c.lineWidth = 8; c.beginPath(); c.moveTo(W / 2, mid - H * 0.25); c.lineTo(W / 2, mid + H * 0.25); c.stroke();
        c.fillStyle = "#e53935"; c.fillRect(W / 2 - 14, mid - 5, 28, 10);
        G.emoji(c, "😼", W / 2, mid - H * 0.25 - 26, 52); G.img(c, ":dawgpog:", W / 2 + (m.shake > 0 ? rnd(5) - 2 : 0), mid + H * 0.25 + 30, 64);
        if (m.shake > 0) m.shake -= 0.016;
        G.text(c, "TAP TAP TAP!", W / 2, H - 30, 14, "#ffd23f");
      }
    },
    rain: {
      name: "TREAT RAIN", how: "DRAG TO CATCH TREATS. DODGE BOMBS!", dur: 25,
      init(G, m) { m.x = G.W / 2; m.items = []; m.sp = 0; m.stun = 0; m.e = 0; m.pops = []; },
      update(G, m, dt) {
        m.e += dt; m.sp -= dt; if (m.stun > 0) m.stun -= dt;
        if (m.sp <= 0) { m.sp = Math.max(0.22, 0.6 - m.e * 0.015); const r = Math.random(); m.items.push({ x: 24 + Math.random() * (G.W - 48), y: 60, v: 150 + m.e * 8 + Math.random() * 60, k: r < 0.2 ? "bomb" : r < 0.3 ? "gold" : r < 0.6 ? "meat" : "bone" }); }
        const py = G.H - 70;
        m.items.forEach(it => { it.y += it.v * dt; if (!it.gone && Math.abs(it.y - py) < 28 && Math.abs(it.x - m.x) < 36) { it.gone = 1;
          if (it.k === "bomb") { m.pts = Math.max(0, m.pts - 15); m.stun = 0.8; G.buzz(); G.sfx("lose"); m.pops.push({ x: it.x, y: py - 40, t: 0.6, s: "-15" }); }
          else { const v = it.k === "gold" ? 25 : it.k === "meat" ? 10 : 5; m.pts += v; G.sfx("pop"); m.pops.push({ x: it.x, y: py - 40, t: 0.6, s: "+" + v }); } } });
        m.items = m.items.filter(it => !it.gone && it.y < G.H + 30); m.pops.forEach(p => p.t -= dt); m.pops = m.pops.filter(p => p.t > 0);
      },
      down(G, m, x) { if (m.stun <= 0) m.x = Math.max(30, Math.min(G.W - 30, x)); },
      move(G, m, x) { if (m.stun <= 0) m.x = Math.max(30, Math.min(G.W - 30, x)); },
      draw(G, c, m, ink) {
        m.items.forEach(it => G.emoji(c, it.k === "bomb" ? "💣" : it.k === "gold" ? "🌟" : it.k === "meat" ? "🍖" : "🦴", it.x, it.y, it.k === "bomb" ? 32 : 28));
        G.img(c, m.stun > 0 ? ":dawgpain:" : ":dawgpog:", m.x, G.H - 70, 62);
        m.pops.forEach(p => G.text(c, p.s, p.x, p.y - (0.6 - p.t) * 40, 12, p.s[0] === "-" ? "#e53935" : "#ffd23f"));
      }
    }
  };
  const KEYS = Object.keys(MG);

  defGame({
    key: "party", name: "Dawg Party", icon: "🎉", max: 1500,
    blurb: "5 random party minigames. One total score.",
    how: "Five quick minigames, picked at random every run: Dawg Says, Floor Is Lava, Don't Wake Big Dawg, Face Lift, Tug of Woof and Treat Rain. Each one tells you what to do at the start. Your score is the total of all five.",
    reset(G) {
      const order = KEYS.slice().sort(() => Math.random() - 0.5).slice(0, 5);
      G.s = { order, round: 0, total: 0, results: [], phase: "intro", pt: 2.4, m: null };
    },
    mg(G) { return MG[G.s.order[G.s.round]]; },
    start(G) { const s = G.s, g = this.mg(G); s.m = { pts: 0, t: 0, end: 0 }; g.init(G, s.m); s.phase = "play"; },
    update(G, dt) {
      const s = G.s;
      if (s.phase === "intro") { s.pt -= dt; if (s.pt <= 0) this.start(G); return; }
      if (s.phase === "result") { s.pt -= dt; if (s.pt <= 0) this.advance(G); return; }
      const g = this.mg(G), m = s.m; m.t += dt; if (m.flash) { m.flash.t -= dt; if (m.flash.t <= 0) m.flash = null; }
      g.update(G, m, dt);
      if (m.t >= g.dur) m.end = 1;
      if (m.end) { const p = Math.max(0, Math.min(300, Math.round(m.pts))); s.total += p; s.results.push([g.name, p]); s.phase = "result"; s.pt = 2.6; G.sfx(p >= 100 ? "win" : "pop"); }
    },
    advance(G) { const s = G.s; s.round++; if (s.round >= s.order.length) { G.over(Math.min(1500, s.total), s.total >= 700 ? "Party animal! 🎉" : s.total >= 450 ? "Good party." : "Party pooper."); return; } s.phase = "intro"; s.pt = 2.4; },
    route(G, fn, ...a) { const s = G.s; if (s.phase === "intro") { if (fn === "tap") this.start(G); return; } if (s.phase === "result") { if (fn === "tap" && s.pt < 1.8) this.advance(G); return; } const g = this.mg(G); if (g[fn]) g[fn](G, s.m, ...a); },
    tap(G, x, y) { this.route(G, "tap", x, y); },
    swipe(G, dx, dy) { this.route(G, "swipe", dx, dy); },
    down(G, x, y) { this.route(G, "down", x, y); },
    move(G, x, y) { this.route(G, "move", x, y); },
    onKey(G, k, isDown) { if (!isDown) return; const d = { ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0] }[k]; if (d) this.swipe(G, d[0], d[1]); else if (k === " ") this.down(G, G.W / 2, G.H / 2); },
    draw(G, c) {
      const s = G.s, W = G.W, H = G.H, dark = G.dark(), ink = dark ? "#fff" : "#222";
      const g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, dark ? "#2a1640" : "#ffe4f2"); g.addColorStop(1, dark ? "#141a3a" : "#dff1ff"); c.fillStyle = g; c.fillRect(0, 0, W, H);
      for (let i = 0; i < 14; i++) { c.fillStyle = ["#ff5c8a", "#ffd23f", "#4dd0e1", "#7cff6b"][i % 4]; c.globalAlpha = 0.25; c.fillRect((i * 67 + G.t * 20) % W, (i * 113 + G.t * 35) % H, 6, 10); } c.globalAlpha = 1;
      const g2 = s.order && this.mg(G); if (!g2) return;
      G.hud(c, `ROUND ${Math.min(5, s.round + 1)}/5`, "", `TOTAL ${s.total}`);
      if (s.phase === "intro") {
        G.img(c, ":dawgpog:", W / 2, H * 0.3, 96);
        G.banner(c, g2.name, "#ff5c8a", H * 0.5, Math.min(26, W / (g2.name.length * 0.85)));
        G.text(c, g2.how, W / 2, H * 0.6, Math.min(12, W / (g2.how.length * 0.9)), ink);
        G.text(c, "TAP TO START", W / 2, H * 0.75, 11, Math.floor(G.t * 3) % 2 ? "#ffd23f" : ink);
        return;
      }
      if (s.phase === "result") {
        const last = s.results[s.results.length - 1];
        G.banner(c, `+${last[1]}`, "#ffd23f", H * 0.28);
        s.results.forEach(([n, p], i) => { G.text(c, n, 40, H * 0.42 + i * 26, 10, ink, "left"); G.text(c, String(p), W - 40, H * 0.42 + i * 26, 11, "#ffd23f", "right"); });
        G.text(c, `TOTAL ${s.total}`, W / 2, H * 0.42 + 5 * 26 + 10, 13, "#ff5c8a");
        return;
      }
      const m = s.m; g2.draw(G, c, m, ink);
      G.text(c, `${Math.round(m.pts)} PTS`, 12, 50, 11, "#ff5c8a", "left");
      G.text(c, `${Math.max(0, Math.ceil(g2.dur - m.t))}s`, W - 12, 50, 11, ink, "right");
    }
  });
})();
