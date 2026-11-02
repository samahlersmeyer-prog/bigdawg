// ---------- Dawg Lords (crowd cannon) ----------
// A giant red cat army marches down the road. Your cannon at the bottom fires a stream of blue pups; drag to aim it.
// Pups that pass through a gate get multiplied (x3, +20...). Each pup that reaches the army takes out a cat.
// Side columns: shoot down the stone block (its number is the hits it needs) to unlock a side cannon, which
// then blasts the +N tiles above it, each tile sending N more pups into the fight. Clear a wave, pick an upgrade.
(function () {
  const UPS = [
    { k: "rate", n: "FAST CANNON", e: "⚡", max: 8, d: "+25% fire rate" },
    { k: "power", n: "BIG SHOTS", e: "🐶", max: 6, d: "+1 pup every shot" },
    { k: "twin", n: "TWIN BARREL", e: "🔫", max: 2, d: "Fire another stream" },
    { k: "gate", n: "GATE POWER", e: "🚪", max: 6, d: "+1 on every gate" },
    { k: "side", n: "SIDE GUNS", e: "🏰", max: 3, d: "Side cannons fire 2x" },
    { k: "tile", n: "RICH TILES", e: "💎", max: 3, d: "Tiles send 2x pups" },
    { k: "slow", n: "MUD ROAD", e: "🟫", max: 3, d: "Cats march 12% slower" }
  ];
  const UPM = {}; UPS.forEach(u => UPM[u.k] = u);
  const PERKS = [
    { k: "rate", n: "BIG CANNON", e: "⚡", max: 10, c: l => Math.round(30 * Math.pow(1.45, l)), d: "+8% fire rate" },
    { k: "lucky", n: "LUCKY SHOTS", e: "🍀", max: 10, c: l => Math.round(30 * Math.pow(1.45, l)), d: "6% shots are x3" },
    { k: "gate", n: "GATE MASTER", e: "🚪", max: 5, c: l => Math.round(80 * Math.pow(1.8, l)), d: "+1 on every gate" },
    { k: "side", n: "SIDE GUNS", e: "🏰", max: 5, c: l => Math.round(50 * Math.pow(1.6, l)), d: "Blocks need 15% fewer" },
    { k: "treas", n: "TREASURY", e: "🪙", max: 10, c: l => Math.round(35 * Math.pow(1.4, l)), d: "+10% coins" }
  ];
  const fmtN = n => n >= 1e6 ? (n / 1e6).toFixed(1) + "M" : n >= 1e4 ? Math.round(n / 1e3) + "K" : String(Math.max(0, Math.round(n)));
  const mkey = () => "bdd:lords2:" + (typeof me !== "undefined" && me ? me.id : "");
  const today = () => new Date().toDateString();
  const loadMeta = () => Object.assign({ coins: 0, bestWave: 0, runs: 0, lastDay: "" }, store.get(mkey()) || {});
  const saveMeta = m => store.set(mkey(), m);
  const rr = (c, x, y, w, h, r) => { c.beginPath(); if (c.roundRect) c.roundRect(x, y, w, h, r); else c.rect(x, y, w, h); };
  const inR = (r, x, y) => r && x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h;
  const armyOf = n => Math.round(100 * Math.pow(1.5, n - 1));

  defGame({
    key: "lords", name: "Dawg Lords", icon: "👑", max: 999999,
    blurb: "Cannon vs a cat army. Gates multiply your pups.",
    how: "A huge cat army marches down the road. Drag to aim your cannon; it fires a stream of pups. Pups that pass through a gate multiply (x3 means three times as many, +20 adds twenty). Every pup that reaches the army knocks out a cat. On the sides, shoot the stone block down to 0 to unlock a side cannon: it blasts the +N tiles above it and every tile sends N more pups at the cats. If the army reaches the gates they get smashed, and if it reaches your cannon it's over. Clear a wave to pick an upgrade. Your score is cats knocked out; coins you earn buy permanent upgrades at camp, and the first battle each day pays double.",
    reset(G) {
      const W = G.W, H = G.H;
      G.s = { mode: "camp", meta: loadMeta(), W, H, gy: Math.round(H * 0.5), cy: H - 64, ax0: W * 0.22, ax1: W * 0.78,
        cols: [{ x0: W * 0.035, x1: W * 0.2, side: 0 }, { x0: W * 0.8, x1: W * 0.965, side: 1 }],
        wave: 0, ups: {}, score: 0, cx: W / 2, tx: W / 2, cd: 0, pups: [], fx: [], peds: [null, null], tiles: [[], []], gates: [], R: 0, R0: 0, front: 50, choice: null, msg: null, sfxT: 0, recoil: 0 };
    },
    begin(G) {
      const s = G.s; s.mode = "play"; s.daily = s.meta.lastDay !== today(); G.t = 0;
      const sf = 1 - 0.15 * (s.meta.side || 0);
      s.peds = [{ n: Math.round(20 * sf), n0: Math.round(20 * sf), on: false, cd: 0 }, { n: Math.round(400 * sf), n0: Math.round(400 * sf), on: false, cd: 0 }];
      this.startWave(G, 1);
    },
    startWave(G, n) {
      const s = G.s, W = s.W, gb = (s.ups.gate || 0) + (s.meta.gate || 0);
      s.wave = n; s.R0 = s.R = armyOf(n); s.front = 46; s.pups = [];
      const xv = 2 + Math.floor(n / 3) + gb, pv = 5 * n + 2 * gb, a = s.ax0, b = s.ax1, m = (a + b) / 2;
      const L = [
        [{ x0: m - (b - a) * 0.2, x1: m + (b - a) * 0.2, op: "x", v: xv }],
        [{ x0: a, x1: m - 3, op: "+", v: pv }, { x0: m + 3, x1: b, op: "x", v: xv }],
        [{ x0: a, x1: m - 3, op: "x", v: xv }, { x0: m + 3, x1: b, op: "+", v: pv }],
        [{ x0: a, x1: a + (b - a) * 0.3, op: "x", v: Math.max(2, xv - 1) }, { x0: b - (b - a) * 0.3, x1: b, op: "x", v: xv + 1 }]
      ];
      s.gates = (n === 1 ? L[0] : L[Math.floor(Math.random() * L.length)]).map(g => Object.assign({ alive: true, id: Math.random() }, g));
      const th = 26, tm = 1 + (s.ups.tile || 0);
      s.tiles = [0, 1].map(side => { const t = []; for (let y = s.gy - 40; y > 56; y -= th + 3) t.push({ y, v: (side ? 8 * n : n) * tm }); return t; });
      s.msg = { txt: n === 1 && s.daily ? "DAILY 2X COINS!" : `WAVE ${n}: ${fmtN(s.R)} CATS`, t: 1.8 };
    },
    save(G) {
      const s = G.s; if (s.mode !== "play" || s.choice || s.wave < 2) return null;
      return { label: `Wave ${s.wave}`, wave: s.wave, ups: s.ups, score: s.score, daily: s.daily, peds: s.peds };
    },
    load(G, v) {
      if (!v.peds || !v.wave) throw new Error("old save");
      const s = G.s; s.mode = "play"; s.ups = Object.assign({}, v.ups); s.score = v.score; s.daily = v.daily;
      s.peds = v.peds.map(p => Object.assign({}, p, { cd: 0 })); this.startWave(G, v.wave);
    },
    offer(s) {
      const pool = UPS.filter(u => (s.ups[u.k] || 0) < u.max), out = [];
      while (out.length < 3 && pool.length) out.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0].k);
      return out;
    },
    take(G, k) { const s = G.s; s.ups[k] = (s.ups[k] || 0) + 1; s.choice = null; G.sfx("pop"); this.startWave(G, s.wave + 1); },
    // A clump of pups. One dot can stand for many pups (w) so huge multipliers stay smooth on a phone.
    add(s, x, y, w, vx, o) {
      if (w <= 0) return;
      if (s.pups.length > 650) { const p = s.pups[Math.floor(Math.random() * s.pups.length)]; p.w += w; return; }
      s.pups.push(Object.assign({ x, y, w, vx: vx || 0, vy: -330, g: [] }, o || {}));
    },
    update(G, dt) {
      const s = G.s; if (s.mode !== "play") return;
      if (s.msg) { s.msg.t -= dt; if (s.msg.t <= 0) s.msg = null; }
      if (s.choice) return;
      const W = s.W, u = s.ups, m = s.meta; s.sfxT -= dt; s.recoil = Math.max(0, s.recoil - dt * 6);
      // cannon
      const dx = s.tx - s.cx; s.cx += Math.sign(dx) * Math.min(Math.abs(dx), 900 * dt);
      s.cd -= dt;
      if (s.cd <= 0) {
        s.cd = 1 / (6 * (1 + 0.25 * (u.rate || 0)) * (1 + 0.08 * (m.rate || 0)));
        const w = (1 + (u.power || 0)) * (Math.random() < 0.06 * (m.lucky || 0) ? 3 : 1), n = 1 + (u.twin || 0);
        for (let i = 0; i < n; i++) this.add(s, s.cx + (i - (n - 1) / 2) * 14, s.cy - 26, w, (Math.random() - 0.5) * 18);
        s.recoil = 1;
      }
      // side cannons
      s.peds.forEach((p, i) => {
        if (!p.on) return; p.cd -= dt; if (p.cd > 0) return;
        p.cd = (i ? 0.5 : 0.3) / (1 + (u.side || 0)); const c = s.cols[i];
        this.add(s, (c.x0 + c.x1) / 2 + (Math.random() - 0.5) * 10, s.gy - 26, (1 + (u.power || 0)) * (i ? 5 : 1), 0, { col: i });
      });
      // march
      s.front += (12 + 1.3 * s.wave) * Math.pow(0.88, u.slow || 0) * dt;
      s.gates.forEach(g => { if (g.alive && s.front >= s.gy - 13) { g.alive = false; s.fx.push({ txt: "SMASHED!", x: (g.x0 + g.x1) / 2, y: s.gy, t: 0.9, col: "#ff8a80" }); G.buzz(); } });
      // pups
      const ped = [], ty = s.gy - 24;
      for (const p of s.pups) {
        const py = p.y; p.x += p.vx * dt; p.y += p.vy * dt;
        if (p.bonus) { p.vx *= Math.pow(0.2, dt); }
        // gates
        if (!p.col && py > s.gy && p.y <= s.gy) for (const g of s.gates) if (g.alive && p.x >= g.x0 && p.x <= g.x1) {
          if (g.op === "x") { const tot = p.w * g.v, k = Math.min(4, g.v); p.w = tot / k; for (let i = 1; i < k; i++) this.add(s, p.x + (Math.random() - 0.5) * 22, p.y - Math.random() * 8, p.w, (Math.random() - 0.5) * 40, { g: [] }); }
          else this.add(s, p.x + (Math.random() - 0.5) * 16, p.y - 4, g.v, (Math.random() - 0.5) * 30);
          g.flash = 0.12; break;
        }
        // side columns: blocks, then tiles
        for (let i = 0; i < 2; i++) {
          const c = s.cols[i]; if (p.bonus || p.x < c.x0 || p.x > c.x1) continue; const pd = s.peds[i];
          if (!pd.on && !p.col && p.y <= s.gy + 22 && py > s.gy - 22) {
            pd.n -= p.w; p.dead = true; pd.flash = 0.08;
            if (pd.n <= 0) { pd.on = true; pd.n = 0; s.msg = { txt: i ? "BIG CANNON UNLOCKED!" : "SIDE CANNON UNLOCKED!", t: 1.6 }; G.sfx("win"); }
          } else if (s.tiles[i].length && p.y <= s.tiles[i][0].y + 13) {
            const t = s.tiles[i].shift(); p.dead = true;
            this.add(s, (c.x0 + c.x1) / 2, t.y, t.v, i ? -150 : 150, { bonus: 1, vy: -220 });
            s.fx.push({ txt: "+" + fmtN(t.v), x: (c.x0 + c.x1) / 2, y: t.y, t: 0.6, col: i ? "#ffd23f" : "#82b1ff" });
          }
        }
        if (p.dead) continue;
        // the army
        if (s.R > 0 && p.y <= s.front + 3 && p.x >= s.ax0 - 4 && p.x <= s.ax1 + 4) {
          const k = Math.min(s.R, p.w); s.R -= k; s.score += k; p.w -= k;
          if (p.w <= 0.0001) p.dead = true;
          if (s.sfxT <= 0) { s.sfxT = 0.07; G.sfx("pop"); }
          if (s.fx.length < 60 && Math.random() < 0.25) s.fx.push({ pop: 1, x: p.x, y: s.front, t: 0.2 });
        }
        if (p.y < 30 || p.x < -10 || p.x > W + 10) p.dead = true;
      }
      s.pups = s.pups.filter(p => !p.dead);
      s.gates.forEach(g => { if (g.flash) g.flash = Math.max(0, g.flash - dt); });
      s.peds.forEach(p => { if (p.flash) p.flash = Math.max(0, p.flash - dt); });
      s.fx.forEach(e => e.t -= dt); s.fx = s.fx.filter(e => e.t > 0);
      if (s.R <= 0) { s.R = 0; s.score = Math.round(s.score); s.pups = []; s.choice = this.offer(s); s.msg = { txt: `WAVE ${s.wave} CLEARED!`, t: 99 }; G.sfx("win"); return; }
      if (s.front >= s.cy - 36) this.end(G);
    },
    end(G) {
      const s = G.s, m = s.meta, score = Math.round(s.score);
      const coins = Math.round((Math.sqrt(score) * 0.35 + s.wave * 5) * (1 + 0.1 * (m.treas || 0)) * (s.daily ? 2 : 1));
      const nb = s.wave > (m.bestWave || 0);
      m.coins += coins; m.runs = (m.runs || 0) + 1; m.bestWave = Math.max(m.bestWave || 0, s.wave); if (s.daily) m.lastDay = today(); saveMeta(m);
      G.over(Math.min(999999, score), `${nb ? "NEW BEST! " : ""}Overrun on wave ${s.wave}. +${coins} 🪙 for camp`);
    },
    campLayout(G) {
      const W = G.W, H = G.H, top = 132, btnH = 56, rh = Math.min(56, Math.max(40, (H - top - btnH - 30) / PERKS.length));
      return { rows: PERKS.map((p, i) => ({ x: 12, y: top + i * rh, w: W - 24, h: rh - 6 })), go: { x: 24, y: Math.min(H - btnH - 14, top + PERKS.length * rh + 10), w: W - 48, h: btnH } };
    },
    cardLayout(G) {
      const W = G.W, H = G.H, ch = Math.min(84, (H - 240) / 3), y0 = Math.max(130, H / 2 - (ch * 3 + 20) / 2);
      return [0, 1, 2].map(i => ({ x: 22, y: y0 + i * (ch + 10), w: W - 44, h: ch }));
    },
    down(G, x) { const s = G.s; if (s.mode === "play" && !s.choice) s.tx = Math.max(s.W * 0.06, Math.min(s.W * 0.94, x)); },
    move(G, x) { this.down(G, x); },
    tap(G, x, y) {
      const s = G.s;
      if (s.mode === "camp") {
        const L = this.campLayout(G);
        if (inR(L.go, x, y)) { this.begin(G); G.sfx("win"); return; }
        L.rows.forEach((r, i) => {
          if (!inR(r, x, y)) return; const p = PERKS[i], l = s.meta[p.k] || 0; if (l >= p.max) return;
          const c = p.c(l); if (s.meta.coins < c) { s.campMsg = { txt: `NEED ${c} 🪙`, t: 1 }; G.buzz(); return; }
          s.meta.coins -= c; s.meta[p.k] = l + 1; saveMeta(s.meta); s.campMsg = { txt: `${p.n} ${l + 1}!`, t: 1 }; G.sfx("win");
        });
        return;
      }
      if (s.choice) this.cardLayout(G).forEach((r, i) => { if (s.choice && inR(r, x, y)) this.take(G, s.choice[i]); });
    },
    draw(G, c) {
      const s = G.s, W = G.W, H = G.H, dk = G.dark();
      if (s.mode === "camp") return this.drawCamp(G, c);
      // snowy ground, road, walls
      c.fillStyle = dk ? "#1d2229" : "#eef3f8"; c.fillRect(0, 0, W, H);
      c.fillStyle = dk ? "#2a3039" : "#d5dae1"; c.fillRect(s.ax0 - 8, 0, s.ax1 - s.ax0 + 16, H);
      c.fillStyle = dk ? "#323944" : "#e3e7ec"; c.fillRect(s.cols[0].x1 + 2, s.gy + 30, s.cols[1].x0 - s.cols[0].x1 - 4, H);
      s.cols.forEach(cl => { c.fillStyle = dk ? "#3b434f" : "#c3c9d2"; c.fillRect(cl.x0 - 3, 0, cl.x1 - cl.x0 + 6, s.gy + 30); c.fillStyle = dk ? "#4a5361" : "#f7f9fb"; c.fillRect(cl.x0 - 3, 0, 3, s.gy + 30); c.fillRect(cl.x1, 0, 3, s.gy + 30); });
      // tiles
      s.cols.forEach((cl, i) => s.tiles[i].forEach(t => {
        const w = cl.x1 - cl.x0 - 4, x = cl.x0 + 2;
        c.fillStyle = i ? "#c99a00" : "#1e5fc2"; rr(c, x, t.y - 11, w, 24, 4); c.fill();
        c.fillStyle = i ? "#ffd23f" : "#2f80ed"; rr(c, x, t.y - 13, w, 22, 4); c.fill();
        G.text(c, "+" + fmtN(t.v), x + w / 2, t.y - 1, Math.min(10, w / 5), i ? "#3a2c00" : "#fff");
      }));
      // side blocks / side cannons
      s.peds.forEach((p, i) => {
        const cl = s.cols[i], x = cl.x0, w = cl.x1 - cl.x0, y = s.gy - 22, cxm = x + w / 2;
        c.fillStyle = dk ? "#59606b" : "#9aa1ab"; rr(c, x, y + 26, w, 22, 4); c.fill();
        G.text(c, p.on ? "ON" : fmtN(Math.ceil(p.n)), cxm, y + 38, 9, p.on ? "#80ff9c" : "#fff");
        if (!p.on) {
          c.fillStyle = p.flash ? "#ffffff" : dk ? "#cfd8dc" : "#fafafa"; rr(c, x + 2, y - 4, w - 4, 30, 8); c.fill();
          c.strokeStyle = "rgba(0,0,0,0.15)"; c.lineWidth = 1; for (let k = 0; k < 3; k++) { c.beginPath(); c.arc(cxm - 8 + k * 8, y + 11, 5, 0, 7); c.stroke(); }
          c.fillStyle = "rgba(0,0,0,0.12)"; c.fillRect(x + 6, y + 21, (w - 12) * (1 - p.n / p.n0), 3);
        } else {
          const n = i ? 3 : 1; for (let k = 0; k < n; k++) { const bx = cxm + (k - (n - 1) / 2) * 9; c.fillStyle = "#546e7a"; rr(c, bx - 4, y - 6 + Math.sin(G.t * 30 + k) * 1.5, 8, 26, 3); c.fill(); }
          c.fillStyle = "#795548"; rr(c, x + 4, y + 16, w - 8, 10, 3); c.fill();
        }
      });
      // gates
      s.gates.forEach(g => {
        if (!g.alive) return; const x = g.x0, w = g.x1 - g.x0, y = s.gy - 13, purple = g.op === "x";
        c.fillStyle = purple ? "#5e1fa8" : "#0d5fb8"; rr(c, x, y + 3, w, 26, 4); c.fill();
        c.fillStyle = g.flash ? "#fff" : purple ? "#8e3fe6" : "#1e88e5"; rr(c, x, y, w, 26, 4); c.fill();
        c.fillStyle = "#e0a96d"; c.fillRect(x - 3, y - 2, 4, 30); c.fillRect(x + w - 1, y - 2, 4, 30);
        G.text(c, (purple ? "x" : "+") + g.v, x + w / 2, y + 14, Math.min(15, w / 4), "#fff");
      });
      // the cat army: a block of little red soldiers marching down
      if (s.R > 0) {
        const sp = 7.2, per = Math.max(1, Math.floor((s.ax1 - s.ax0) / sp)), rows = Math.ceil(s.R / per), first = s.R - (rows - 1) * per, bob = Math.sin(G.t * 9) * 0.8;
        const maxRows = Math.min(rows, Math.ceil((s.front - 30) / sp) + 1);
        const body = new Path2DShim(c), head = new Path2DShim(c);
        for (let r = 0; r < maxRows; r++) {
          const y = s.front - r * sp, cnt = r === 0 ? first : per, x0 = (s.ax0 + s.ax1) / 2 - (cnt - 1) * sp / 2;
          for (let k = 0; k < cnt; k++) { const jx = ((k * 7 + r * 13) % 5 - 2) * 0.5, x = x0 + k * sp + jx, yy = y + ((k + r) % 2 ? bob : -bob); body.dot(x, yy, 3.3); head.dot(x - 0.8, yy - 2, 1.5); }
        }
        c.fillStyle = "#c62828"; body.fill(); c.fillStyle = "#ff6f60"; head.fill();
        c.fillStyle = "rgba(0,0,0,0.55)"; rr(c, W / 2 - 52, Math.max(44, s.front - 34), 104, 24, 12); c.fill();
        G.text(c, "🐱" + fmtN(s.R), W / 2, Math.max(44, s.front - 34) + 12, 11, "#fff");
      }
      // pups
      const pb = new Path2DShim(c), ph = new Path2DShim(c);
      s.pups.forEach(p => { const r = Math.min(8, 3.8 + Math.log10(Math.max(1, p.w)) * 1.5); pb.dot(p.x, p.y, r); ph.dot(p.x - r * 0.25, p.y - r * 0.5, r * 0.45); });
      c.fillStyle = "#1565c0"; pb.fill(); c.fillStyle = "#64b5f6"; ph.fill();
      s.fx.forEach(e => {
        if (e.pop) { c.strokeStyle = `rgba(255,255,255,${e.t * 4})`; c.lineWidth = 2; c.beginPath(); c.arc(e.x, e.y, 10 * (1.2 - e.t * 4), 0, 7); c.stroke(); }
        else G.text(c, e.txt, e.x, e.y - (0.7 - e.t) * 30, 10, e.col);
      });
      // cannon
      const cx = s.cx, cy = s.cy, rc = s.recoil * 4, n = 1 + (s.ups.twin || 0);
      c.fillStyle = "rgba(0,0,0,0.18)"; c.beginPath(); c.ellipse(cx, cy + 18, 30, 7, 0, 0, 7); c.fill();
      c.fillStyle = "#8d5a3b"; rr(c, cx - 22, cy + 2, 44, 14, 4); c.fill();
      [-15, 15].forEach(o => { c.fillStyle = "#3e2723"; c.beginPath(); c.arc(cx + o, cy + 15, 6, 0, 7); c.fill(); });
      for (let i = 0; i < n; i++) { const bx = cx + (i - (n - 1) / 2) * 14; c.fillStyle = "#78909c"; rr(c, bx - 7, cy - 28 + rc, 14, 34, 6); c.fill(); c.fillStyle = "#b0bec5"; rr(c, bx - 4, cy - 26 + rc, 4, 28, 2); c.fill(); c.fillStyle = "#37474f"; rr(c, bx - 8, cy - 30 + rc, 16, 6, 3); c.fill(); }
      G.img(c, ":dawgW:", cx, cy + 4, 22);
      // HUD
      G.hud(c, `WAVE ${s.wave}`, fmtN(s.score), `BEST ${s.meta.bestWave || 0}`);
      c.fillStyle = "rgba(0,0,0,0.35)"; c.fillRect(0, 34, W, 5); c.fillStyle = "#e53935"; c.fillRect(0, 34, W * (1 - s.R / Math.max(1, s.R0)), 5);
      if (s.front > s.gy + 40 && s.R > 0) { c.fillStyle = `rgba(229,57,53,${0.1 + 0.07 * Math.sin(G.t * 8)})`; c.fillRect(0, 0, W, H); }
      if (s.choice) this.drawCards(G, c);
      else { if (s.msg) G.banner(c, s.msg.txt, "#fff", H * 0.62, s.msg.txt.length > 14 ? 14 : 18); G.hint(c, "DRAG TO AIM THROUGH THE GATES", 4, s.cy - 60); }
    },
    drawCards(G, c) {
      const s = G.s, W = G.W, H = G.H, L = this.cardLayout(G);
      c.fillStyle = "rgba(8,8,16,0.8)"; c.fillRect(0, 0, W, H);
      G.banner(c, `WAVE ${s.wave} CLEARED!`, "#ffd23f", L[0].y - 56, 17);
      G.text(c, `NEXT: ${fmtN(armyOf(s.wave + 1))} CATS · PICK ONE`, W / 2, L[0].y - 24, 8, "#fff");
      s.choice.forEach((k, i) => {
        const r = L[i], u = UPM[k], l = s.ups[k] || 0;
        c.fillStyle = "#1d2333"; rr(c, r.x, r.y, r.w, r.h, 14); c.fill(); c.strokeStyle = "rgba(255,255,255,0.7)"; c.lineWidth = 1.5; rr(c, r.x, r.y, r.w, r.h, 14); c.stroke();
        G.emoji(c, u.e, r.x + 36, r.y + r.h / 2, Math.min(34, r.h * 0.45));
        G.text(c, u.n, r.x + 70, r.y + r.h * 0.34, 11, "#fff", "left");
        G.text(c, u.d, r.x + 70, r.y + r.h * 0.6, 8, "rgba(255,255,255,0.8)", "left");
        G.text(c, `LV ${l}→${l + 1}`, r.x + 70, r.y + r.h * 0.82, 8, "#4fc3f7", "left");
      });
    },
    drawCamp(G, c) {
      const s = G.s, W = G.W, H = G.H, m = s.meta, L = this.campLayout(G), dk = G.dark();
      const gr = c.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, dk ? "#1a1430" : "#3b2a6b"); gr.addColorStop(1, dk ? "#0d0a18" : "#1c1338");
      c.fillStyle = gr; c.fillRect(0, 0, W, H);
      G.img(c, ":dawgW:", 40, 46, 50); G.emoji(c, "👑", 40, 16, 22);
      G.text(c, "DAWG LORDS", 76, 32, 15, "#ffd23f", "left");
      G.text(c, `BEST: WAVE ${m.bestWave || 0}`, 76, 54, 8, "#fff", "left");
      G.text(c, `RUNS: ${m.runs || 0}`, 76, 70, 8, "rgba(255,255,255,0.6)", "left");
      c.fillStyle = "rgba(255,210,63,0.15)"; rr(c, 12, 86, W - 24, 34, 10); c.fill();
      G.text(c, `🪙 ${m.coins}`, 24, 104, 13, "#ffd23f", "left");
      const dbl = m.lastDay !== today(); G.text(c, dbl ? "🎁 2X TODAY" : "CAMP UPGRADES", W - 24, 104, 8, dbl ? "#80ff9c" : "rgba(255,255,255,0.6)", "right");
      PERKS.forEach((p, i) => {
        const r = L.rows[i], l = m[p.k] || 0, maxed = l >= p.max, cost = maxed ? 0 : p.c(l), ok = !maxed && m.coins >= cost;
        c.fillStyle = ok ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.05)"; rr(c, r.x, r.y, r.w, r.h, 10); c.fill();
        if (ok) { c.strokeStyle = "rgba(255,210,63,0.6)"; c.lineWidth = 1.5; rr(c, r.x, r.y, r.w, r.h, 10); c.stroke(); }
        G.emoji(c, p.e, r.x + 22, r.y + r.h / 2, Math.min(22, r.h * 0.5));
        G.text(c, p.n, r.x + 44, r.y + r.h * 0.34, 9, "#fff", "left");
        G.text(c, `${p.d} · ${l}/${p.max}`, r.x + 44, r.y + r.h * 0.7, 7, "rgba(255,255,255,0.65)", "left");
        G.text(c, maxed ? "MAX" : `${cost}🪙`, r.x + r.w - 10, r.y + r.h / 2, 9, maxed ? "#80ff9c" : ok ? "#ffd23f" : "#ff8a80", "right");
      });
      const g = L.go; c.fillStyle = "#c62828"; rr(c, g.x, g.y + 4, g.w, g.h, 16); c.fill(); c.fillStyle = "#ef5350"; rr(c, g.x, g.y, g.w, g.h, 16); c.fill();
      G.text(c, "💥 FIRE THE CANNON!", W / 2, g.y + g.h / 2 + 1, 12, "#fff");
      if (s.campMsg) { s.campMsg.t -= 1 / 60; if (s.campMsg.t <= 0) s.campMsg = null; else G.banner(c, s.campMsg.txt, "#ffd23f", g.y - 18, 14); }
      if (!m.runs) G.hint(c, "COINS BUY UPGRADES. NOW FIRE!", 6, g.y - 18);
    }
  });
  // Batches thousands of little circles into one fill, so a giant army still draws fast.
  function Path2DShim(c) { this.c = c; this.p = typeof Path2D !== "undefined" ? new Path2D() : null; }
  Path2DShim.prototype.dot = function (x, y, r) { if (this.p) { this.p.moveTo(x + r, y); this.p.arc(x, y, r, 0, 6.283); } };
  Path2DShim.prototype.fill = function () { if (this.p) this.c.fill(this.p); };
})();
