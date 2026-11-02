// ---------- Dawg Lords (crowd cannon) ----------
// An endless red cat horde marches down the road and keeps getting bigger. Your cannon at the bottom fires pups,
// one per cannon per shot; drag to move it. The x99 gate in the middle multiplies every pup that goes through.
// Pups that hit the horde knock cats out and push the front back. On the sides, shoot a crate down to 0 and the
// +N tiles behind it roll down the side lane: slide under them to catch them, and each adds N cannons. The crates
// keep restocking. Every so often a boss marches in with the horde: beat it and catch the gold tile it drops.
(function () {
  const PERKS = [
    { k: "rate", n: "BIG CANNON", e: "⚡", max: 10, c: l => Math.round(30 * Math.pow(1.45, l)), d: "+8% fire rate" },
    { k: "lucky", n: "LUCKY SHOTS", e: "🍀", max: 10, c: l => Math.round(30 * Math.pow(1.45, l)), d: "6% shots are x3" },
    { k: "slow", n: "MUDDY ROAD", e: "🟫", max: 5, c: l => Math.round(60 * Math.pow(1.7, l)), d: "Horde marches 5% slower" },
    { k: "side", n: "ARMORY", e: "🏰", max: 5, c: l => Math.round(50 * Math.pow(1.6, l)), d: "Start with +2 cannons" },
    { k: "treas", n: "TREASURY", e: "🪙", max: 10, c: l => Math.round(35 * Math.pow(1.4, l)), d: "+10% coins" }
  ];
  const BOSSES = [{ n: "FAT CAT", e: "😾" }, { n: "TOMCAT KING", e: "🦁" }, { n: "TIGER LORD", e: "🐯" }, { n: "THE BIG MEOW", e: "🙀" }];
  // Tuning knobs (kept together so balance changes are one-line edits).
  const T = { march: 9, marchT: 0.025, unit: 10, unitG: 60, fire: 1.5, lhp: 3, rhp: 15, hpg: 1.7, boss1: 40, bossEvery: 55, bossHp: 2500, gate: 99, rv0: 2 };
  const SP = 7.2; // spacing of the little soldiers in the horde
  const fmtN = n => n >= 1e6 ? (n / 1e6).toFixed(1) + "M" : n >= 1e4 ? Math.round(n / 1e3) + "K" : String(Math.max(0, Math.round(n)));
  const fmtT = t => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, "0")}`;
  const mkey = () => "bdd:lords3:" + (typeof me !== "undefined" && me ? me.id : "");
  const today = () => new Date().toDateString();
  const loadMeta = () => Object.assign({ coins: 0, bestT: 0, runs: 0, lastDay: "" }, store.get(mkey()) || {});
  const saveMeta = m => store.set(mkey(), m);
  const rr = (c, x, y, w, h, r) => { c.beginPath(); if (c.roundRect) c.roundRect(x, y, w, h, r); else c.rect(x, y, w, h); };
  const inR = (r, x, y) => r && x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h;

  defGame({
    key: "lords", name: "Dawg Lords", icon: "👑", max: 99999, T,
    blurb: "Hold back an endless cat horde. x99 gate. Bosses.",
    how: "An endless cat horde marches down the road, and it keeps getting bigger. Drag to move your cannon; every cannon fires one pup at a time. Pups that go through the x99 gate in the middle become 99 pups, and every pup that hits the horde knocks out a cat and pushes the front back. To power up, move to a side and shoot the crate until its number hits 0. The +N tiles behind it then roll down that side lane: slide your cannon under them to catch them, and each one adds N cannons. Missed tiles are gone, and a new crate restocks right away. Every so often a boss marches in with the horde. Knock it out and it drops a gold tile worth a lot of cannons: catch it! If the horde reaches the gate, the gate stops working until you push them back, and if it reaches your cannon it's over. Score is 10 points a second you hold the road plus 250 for every boss; coins buy permanent upgrades at camp, and the first battle each day pays double.",
    reset(G) {
      const W = G.W, H = G.H;
      G.s = { mode: "camp", meta: loadMeta(), W, H, gy: Math.round(H * 0.5), cy: H - 64, ax0: W * 0.22, ax1: W * 0.78,
        cols: [{ x0: W * 0.035, x1: W * 0.2 }, { x0: W * 0.8, x1: W * 0.965 }],
        t: 0, score: 0, kills: 0, cx: W / 2, tx: W / 2, cd: 0, pups: [], fx: [], drops: [], bank: [0, 0], start: 0, tiles: [[], []], lock: [null, null],
        front: 60, boss: null, bossN: 0, nextBoss: T.boss1, gateOn: true, gflash: 0, msg: null, sfxT: 0, recoil: 0 };
    },
    begin(G) {
      const s = G.s; s.mode = "play"; s.daily = s.meta.lastDay !== today(); G.t = 0;
      s.start = 2 * (s.meta.side || 0); this.fillBelts(s);
      s.msg = { txt: s.daily ? "DAILY 2X COINS!" : "HOLD THE ROAD!", t: 2 };
    },
    per(s) { return Math.max(1, Math.floor((s.ax1 - s.ax0) / SP)); },
    unit(s) { return Math.max(1, Math.round(T.unit * Math.exp(s.t / T.unitG))); }, // cats per little soldier: the horde keeps growing
    march(s) { return (T.march + T.marchT * s.t) * Math.pow(0.95, s.meta.slow || 0) * (s.boss ? 1.25 : 1); },
    onScreen(s) { return Math.max(0, Math.round((s.front - 36) / SP + 1)) * this.per(s) * this.unit(s); },
    // Each side lane: a crate (hp = pups needed) with a batch of tiles stacked behind it. Crates restock forever.
    newSeg(s, i) {
      const old = s.lock[i], lvl = old ? old.lvl + 1 : 0, hp = Math.round((i ? T.rhp : T.lhp) * Math.pow(T.hpg, lvl));
      s.lock[i] = { hp, hp0: hp, lvl, open: false, flash: 0 };
      const n = i ? 4 : 6, v = i ? T.rv0 + lvl : 1 + Math.floor(lvl / 3), by = this.blockY(s);
      s.tiles[i] = []; for (let k = 0; k < n; k++) { const ty = by - 34 - k * 29; if (ty < 50) break; s.tiles[i].push({ ty, y: ty - 260, v }); }
    },
    blockY(s) { return s.gy - 64; },
    cannons(s) { return 1 + (s.start || 0) + s.bank[0] + s.bank[1]; },
    fillBelts(s) { s.lock = [null, null]; s.tiles = [[], []]; this.newSeg(s, 0); this.newSeg(s, 1); },
    save(G) {
      const s = G.s; if (s.mode !== "play" || s.t < 5) return null;
      return { label: `⏱ ${fmtT(s.t)}`, t: s.t, kills: s.kills, daily: s.daily, bank: s.bank, start: s.start, lv: s.lock.map(l => l.lvl), bossN: s.bossN, nextBoss: s.nextBoss };
    },
    load(G, v) {
      if (!v.bank || v.t == null) throw new Error("old save");
      const s = G.s; s.mode = "play"; ["t", "kills", "daily", "start", "bossN", "nextBoss"].forEach(k => s[k] = v[k]); s.bank = v.bank.slice();
      this.fillBelts(s); if (v.lv) [0, 1].forEach(i => { s.lock[i].lvl = v.lv[i] - 1; this.newSeg(s, i); });
      s.front = 60; s.msg = { txt: "BACK TO THE ROAD!", t: 1.5 };
    },
    // A clump of pups. One dot can stand for many pups (w) so huge multipliers stay smooth on a phone.
    add(s, x, y, w, vx) {
      if (w <= 0) return;
      if (s.pups.length > 700) { s.pups[s.pups.length - 1].w += w; return; } // merge into the newest (still behind the gate)
      s.pups.push({ x, y, w, vx: vx || 0, vy: -230 });
    },
    // Knock out cats at the front; every row cleared pushes the horde back a step.
    hitHorde(s, w) { s.kills += w; s.front = Math.max(60, s.front - w / (this.per(s) * this.unit(s)) * SP); },
    catchAt(s, x, half) { return Math.abs(s.cx - x) < half; },
    gain(G, v, col) {
      const s = G.s; s.recoil = 0.6;
      s.fx.push({ txt: `+${fmtN(v)} 🔫`, x: s.cx, y: s.cy - 40, t: 0.8, col });
      if (s.sfxT <= 0) { s.sfxT = 0.07; G.sfx("pop"); }
    },
    update(G, dt) {
      const s = G.s; if (s.mode !== "play") return;
      if (s.msg) { s.msg.t -= dt; if (s.msg.t <= 0) s.msg = null; }
      const W = s.W, m = s.meta; s.t += dt; s.score = Math.floor(s.t * 10) + 250 * s.bossN; s.sfxT -= dt; s.recoil = Math.max(0, s.recoil - dt * 6); s.gflash = Math.max(0, s.gflash - dt);
      // cannon
      const dx = s.tx - s.cx; s.cx += Math.sign(dx) * Math.min(Math.abs(dx), 520 * dt);
      s.cd -= dt;
      if (s.cd <= 0) {
        s.cd = 1 / (T.fire * (1 + 0.08 * (m.rate || 0)));
        const C = this.cannons(s), k = Math.min(6, C); // one pup per cannon; past 6 cannons each dot carries several
        const w = C * (Math.random() < 0.06 * (m.lucky || 0) ? 3 : 1) / k, sp = Math.min(12, 64 / k);
        for (let i = 0; i < k; i++) this.add(s, s.cx + (i - (k - 1) / 2) * sp, s.cy - 26, w, (Math.random() - 0.5) * 18);
        s.recoil = 1;
      }
      // side lanes
      for (let i = 0; i < 2; i++) {
        const Tl = s.tiles[i], c = s.cols[i], L = s.lock[i], cxm = (c.x0 + c.x1) / 2; L.flash = Math.max(0, L.flash - dt);
        if (!L.open) { Tl.forEach(t => t.y = Math.min(t.ty, t.y + 130 * dt)); continue; }
        Tl.forEach(t => t.y += 80 * dt);
        while (Tl.length && Tl[0].y >= s.cy - 24) {
          const t = Tl.shift();
          if (this.catchAt(s, cxm, (c.x1 - c.x0) / 2 + 16)) { s.bank[i] += t.v; this.gain(G, t.v, i ? "#ffd23f" : "#82b1ff"); }
          else s.fx.push({ txt: "MISSED", x: cxm, y: s.cy - 10, t: 0.6, col: "#ff8a80" });
        }
        if (!Tl.length) this.newSeg(s, i);
      }
      // boss gold drops fall down the road
      s.drops.forEach(d => { d.y += 95 * dt; if (d.y >= s.cy - 24) { d.done = true; if (this.catchAt(s, d.x, 38)) { s.bank[0] += d.v; this.gain(G, d.v, "#ffd23f"); s.msg = { txt: `+${d.v} CANNONS!`, t: 1.2 }; G.sfx("win"); } else s.fx.push({ txt: "MISSED", x: d.x, y: s.cy - 10, t: 0.7, col: "#ff8a80" }); } });
      s.drops = s.drops.filter(d => !d.done);
      // the horde marches; bosses join every so often
      s.front += this.march(s) * dt;
      if (!s.boss && s.t >= s.nextBoss) {
        const B = BOSSES[s.bossN % 4], hp = Math.round(T.bossHp * Math.exp(s.t / T.unitG));
        s.boss = { n: B.n, e: B.e, x: s.ax0 + 34 + Math.random() * (s.ax1 - s.ax0 - 68), r: 28, hp, max: hp, flash: 0 };
        s.msg = { txt: `BOSS: ${B.n}!`, t: 2 }; G.sfx("lose"); G.buzz();
      }
      if (s.boss) s.boss.flash = Math.max(0, s.boss.flash - dt);
      const gOn = s.front < s.gy - 13; if (gOn !== s.gateOn) { s.gateOn = gOn; if (!gOn) { s.fx.push({ txt: "GATE OVERRUN!", x: W / 2, y: s.gy + 24, t: 1, col: "#ff8a80" }); G.buzz(); } }
      // pups
      for (const p of s.pups) {
        const py = p.y; p.x += p.vx * dt; p.y += p.vy * dt;
        // the x99 gate
        if (s.gateOn && py > s.gy && p.y <= s.gy && p.x >= s.ax0 && p.x <= s.ax1) {
          const full = s.pups.length > 600, tot = p.w * T.gate, k = full ? 1 : 4; p.w = tot / k;
          for (let i = 1; i < k; i++) s.pups.push({ x: p.x + (Math.random() - 0.5) * 24, y: p.y - Math.random() * 10, w: p.w, vx: (Math.random() - 0.5) * 50, vy: -230 });
          s.gflash = 0.1;
        }
        // side crates
        for (let i = 0; i < 2; i++) {
          const c = s.cols[i], L = s.lock[i], by = this.blockY(s); if (p.x < c.x0 || p.x > c.x1 || L.open) continue;
          if (p.y <= by + 16 && py > by - 16) {
            p.dead = true; L.hp -= p.w; L.flash = 0.06;
            if (L.hp <= 0) { L.hp = 0; L.open = true; s.fx.push({ txt: "OPEN!", x: (c.x0 + c.x1) / 2, y: by, t: 0.8, col: "#80ff9c" }); G.sfx("win"); }
          }
        }
        if (p.dead) continue;
        // the boss walks at the front of the horde and soaks up whatever hits it
        const b = s.boss;
        if (b && p.y <= s.front + 8 && Math.abs(p.x - b.x) < b.r) {
          const k = Math.min(b.hp, p.w); b.hp -= k; p.w -= k; b.flash = 0.06; s.kills += k;
          if (b.hp <= 0) {
            const v = 5 + 5 * s.bossN; s.bossN++; s.boss = null; s.nextBoss = s.t + T.bossEvery;
            s.drops.push({ x: Math.max(s.cx - 60, Math.min(s.cx + 60, b.x)), y: s.front, v });
            s.msg = { txt: "BOSS DOWN! CATCH THE GOLD!", t: 1.8 }; G.sfx("win");
          }
          if (p.w <= 0.0001) { p.dead = true; continue; }
        }
        // the horde
        if (p.y <= s.front + 3 && p.x >= s.ax0 - 4 && p.x <= s.ax1 + 4) {
          this.hitHorde(s, p.w); p.dead = true;
          if (s.sfxT <= 0) { s.sfxT = 0.07; G.sfx("pop"); }
          if (s.fx.length < 60 && Math.random() < 0.25) s.fx.push({ pop: 1, x: p.x, y: s.front, t: 0.2 });
        }
        if (p.y < 30 || p.x < -10 || p.x > W + 10) p.dead = true;
      }
      s.pups = s.pups.filter(p => !p.dead);
      s.fx.forEach(e => e.t -= dt); s.fx = s.fx.filter(e => e.t > 0);
      if (s.front >= s.cy - 36) this.end(G);
    },
    end(G) {
      const s = G.s, m = s.meta, score = Math.round(s.score), nb = s.t > (m.bestT || 0);
      const coins = Math.round((s.t / 3 + s.bossN * 6) * (1 + 0.1 * (m.treas || 0)) * (s.daily ? 2 : 1));
      m.coins += coins; m.runs = (m.runs || 0) + 1; m.bestT = Math.max(m.bestT || 0, s.t); if (s.daily) m.lastDay = today(); saveMeta(m);
      G.over(score, `${nb ? "NEW BEST! " : ""}Held ${fmtT(s.t)}, ${s.bossN} boss${s.bossN === 1 ? "" : "es"}, ${fmtN(s.kills)} cats. +${coins} 🪙`);
    },
    campLayout(G) {
      const W = G.W, H = G.H, top = 132, btnH = 56, rh = Math.min(56, Math.max(40, (H - top - btnH - 30) / PERKS.length));
      return { rows: PERKS.map((p, i) => ({ x: 12, y: top + i * rh, w: W - 24, h: rh - 6 })), go: { x: 24, y: Math.min(H - btnH - 14, top + PERKS.length * rh + 10), w: W - 48, h: btnH } };
    },
    down(G, x) { const s = G.s; if (s.mode === "play") s.tx = Math.max(s.W * 0.1, Math.min(s.W * 0.9, x)); },
    move(G, x) { this.down(G, x); },
    tap(G, x, y) {
      const s = G.s; if (s.mode !== "camp") return;
      const L = this.campLayout(G);
      if (inR(L.go, x, y)) { this.begin(G); G.sfx("win"); return; }
      L.rows.forEach((r, i) => {
        if (!inR(r, x, y)) return; const p = PERKS[i], l = s.meta[p.k] || 0; if (l >= p.max) return;
        const c = p.c(l); if (s.meta.coins < c) { s.campMsg = { txt: `NEED ${c} 🪙`, t: 1 }; G.buzz(); return; }
        s.meta.coins -= c; s.meta[p.k] = l + 1; saveMeta(s.meta); s.campMsg = { txt: `${p.n} ${l + 1}!`, t: 1 }; G.sfx("win");
      });
    },
    draw(G, c) {
      const s = G.s, W = G.W, H = G.H, dk = G.dark();
      if (s.mode === "camp") return this.drawCamp(G, c);
      // snowy ground, road, side lanes
      c.fillStyle = dk ? "#1d2229" : "#eef3f8"; c.fillRect(0, 0, W, H);
      c.fillStyle = dk ? "#2a3039" : "#d5dae1"; c.fillRect(s.ax0 - 8, 0, s.ax1 - s.ax0 + 16, H);
      c.fillStyle = dk ? "#323944" : "#e3e7ec"; c.fillRect(s.cols[0].x1 + 3, s.gy + 30, s.cols[1].x0 - s.cols[0].x1 - 6, H);
      s.cols.forEach(cl => { c.fillStyle = dk ? "#3b434f" : "#c3c9d2"; c.fillRect(cl.x0 - 3, 0, cl.x1 - cl.x0 + 6, H); c.fillStyle = dk ? "#4a5361" : "#f7f9fb"; c.fillRect(cl.x0 - 3, 0, 3, H); c.fillRect(cl.x1, 0, 3, H);
        c.fillStyle = dk ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.06)"; for (let y = (G.t * 40) % 24 - 24; y < H; y += 24) c.fillRect(cl.x0 + 2, y, cl.x1 - cl.x0 - 4, 2); });
      // tiles
      s.cols.forEach((cl, i) => s.tiles[i].forEach(t => {
        const w = cl.x1 - cl.x0 - 4, x = cl.x0 + 2;
        c.fillStyle = i ? "#c99a00" : "#1e5fc2"; rr(c, x, t.y - 11, w, 24, 4); c.fill();
        c.fillStyle = i ? "#ffd23f" : "#2f80ed"; rr(c, x, t.y - 13, w, 22, 4); c.fill();
        G.text(c, "+" + fmtN(t.v), x + w / 2, t.y - 1, Math.min(10, w / 5), i ? "#3a2c00" : "#fff");
      }));
      // crates
      s.cols.forEach((cl, i) => {
        const L = s.lock[i]; if (!L || L.open) return;
        const x = cl.x0 - 1, w = cl.x1 - cl.x0 + 2, by = this.blockY(s), h = 32;
        c.fillStyle = "#5d3a1a"; rr(c, x, by - h / 2 + 3, w, h, 4); c.fill();
        c.fillStyle = L.flash ? "#d7a86e" : "#a0682f"; rr(c, x, by - h / 2, w, h, 4); c.fill();
        c.fillStyle = "#7a4a1f"; c.fillRect(x + 3, by - 6, w - 6, 2); c.fillRect(x + 3, by + 5, w - 6, 2);
        c.fillStyle = "#4e342e"; [x + 5, x + w - 5].forEach(px => { c.beginPath(); c.arc(px, by - 10, 2, 0, 7); c.arc(px, by + 10, 2, 0, 7); c.fill(); });
        G.text(c, fmtN(Math.ceil(L.hp)), x + w / 2, by + 1, Math.min(13, w / 4), "#fff");
      });
      // the x99 gate
      { const x = s.ax0, w = s.ax1 - s.ax0, y = s.gy - 13, on = s.gateOn;
        c.globalAlpha = on ? 1 : 0.35;
        c.fillStyle = "#5e1fa8"; rr(c, x, y + 3, w, 26, 4); c.fill();
        c.fillStyle = s.gflash ? "#c79bff" : "#8e3fe6"; rr(c, x, y, w, 26, 4); c.fill();
        c.fillStyle = "#e0a96d"; c.fillRect(x - 3, y - 2, 4, 30); c.fillRect(x + w - 1, y - 2, 4, 30);
        G.text(c, "x" + T.gate, x + w / 2, y + 14, 15, "#fff"); c.globalAlpha = 1; }
      // the horde: rows of little red soldiers from the front all the way back up the road
      const per = this.per(s), rows = Math.max(0, Math.ceil((s.front - 30) / SP) + 1), bob = Math.sin(G.t * 9) * 0.8;
      const body = new Path2DShim(c), head = new Path2DShim(c), x0 = (s.ax0 + s.ax1) / 2 - (per - 1) * SP / 2;
      for (let r = 0; r < rows; r++) {
        const y = s.front - r * SP;
        for (let k = 0; k < per; k++) { const jx = ((k * 7 + r * 13) % 5 - 2) * 0.5, x = x0 + k * SP + jx, yy = y + ((k + r) % 2 ? bob : -bob); body.dot(x, yy, 3.3); head.dot(x - 0.8, yy - 2, 1.5); }
      }
      c.fillStyle = "#c62828"; body.fill(); c.fillStyle = "#ff6f60"; head.fill();
      // boss
      if (s.boss) {
        const b = s.boss, by = s.front - 4;
        c.fillStyle = "rgba(0,0,0,0.25)"; c.beginPath(); c.ellipse(b.x, by + 22, 30, 8, 0, 0, 7); c.fill();
        c.fillStyle = b.flash ? "#ffffff" : "#8e0000"; c.beginPath(); c.arc(b.x, by, b.r, 0, 7); c.fill();
        G.emoji(c, b.e, b.x, by + 1, 44); G.emoji(c, "👑", b.x, by - b.r - 6, 20);
        c.fillStyle = "rgba(0,0,0,0.6)"; c.fillRect(b.x - 34, by + b.r + 4, 68, 7); c.fillStyle = "#ffd23f"; c.fillRect(b.x - 33, by + b.r + 5, 66 * Math.max(0, b.hp / b.max), 5);
      }
      c.fillStyle = "rgba(0,0,0,0.55)"; rr(c, W / 2 - 56, 42, 112, 22, 11); c.fill();
      G.text(c, "🐱" + fmtN(this.onScreen(s)), W / 2, 53, 10, "#fff");
      // gold drops from bosses
      s.drops.forEach(d => { c.fillStyle = "#c99a00"; rr(c, d.x - 26, d.y - 11, 52, 26, 6); c.fill(); c.fillStyle = "#ffd23f"; rr(c, d.x - 26, d.y - 13, 52, 24, 6); c.fill(); G.text(c, `+${d.v}`, d.x, d.y - 1, 11, "#3a2c00"); });
      // pups
      const pb = new Path2DShim(c), ph = new Path2DShim(c);
      s.pups.forEach(p => { const r = Math.min(8, 3.8 + Math.log10(Math.max(1, p.w)) * 1.2); pb.dot(p.x, p.y, r); ph.dot(p.x - r * 0.25, p.y - r * 0.5, r * 0.45); });
      c.fillStyle = "#1565c0"; pb.fill(); c.fillStyle = "#64b5f6"; ph.fill();
      s.fx.forEach(e => {
        if (e.pop) { c.strokeStyle = `rgba(255,255,255,${e.t * 4})`; c.lineWidth = 2; c.beginPath(); c.arc(e.x, e.y, 10 * (1.2 - e.t * 4), 0, 7); c.stroke(); }
        else G.text(c, e.txt, e.x, e.y - (0.7 - e.t) * 30, 10, e.col);
      });
      // cannon
      const C = this.cannons(s), cx = s.cx, cy = s.cy, rc = s.recoil * 4, n = Math.min(6, C), bsp = Math.min(14, 64 / n), bw = Math.min(14, bsp + 1);
      c.fillStyle = "rgba(0,0,0,0.18)"; c.beginPath(); c.ellipse(cx, cy + 18, 30, 7, 0, 0, 7); c.fill();
      c.fillStyle = "#8d5a3b"; rr(c, cx - 22, cy + 2, 44, 14, 4); c.fill();
      [-15, 15].forEach(o => { c.fillStyle = "#3e2723"; c.beginPath(); c.arc(cx + o, cy + 15, 6, 0, 7); c.fill(); });
      for (let i = 0; i < n; i++) { const bx = cx + (i - (n - 1) / 2) * bsp; c.fillStyle = "#78909c"; rr(c, bx - bw / 2, cy - 28 + rc, bw, 34, 5); c.fill(); c.fillStyle = "#b0bec5"; rr(c, bx - bw / 4, cy - 26 + rc, bw / 4, 28, 2); c.fill(); c.fillStyle = "#37474f"; rr(c, bx - bw / 2 - 1, cy - 30 + rc, bw + 2, 6, 3); c.fill(); }
      const lx = Math.max(48, Math.min(W - 48, cx)); c.fillStyle = "rgba(0,0,0,0.55)"; rr(c, lx - 46, cy + 24, 92, 18, 9); c.fill(); G.text(c, `🔫 x${fmtN(C)}`, lx, cy + 33, 9, "#fff");
      G.img(c, ":dawgW:", cx, cy + 4, 22);
      // HUD + danger bar (how close the horde is to your cannon)
      G.hud(c, `⏱${fmtT(s.t)}`, fmtN(s.score), `BEST ${fmtT(s.meta.bestT || 0)}`);
      const dng = Math.min(1, Math.max(0, (s.front - 60) / (s.cy - 96)));
      c.fillStyle = "rgba(0,0,0,0.35)"; c.fillRect(0, 34, W, 5); c.fillStyle = dng > 0.6 ? "#e53935" : "#ffb300"; c.fillRect(0, 34, W * dng, 5);
      if (dng > 0.7) { c.fillStyle = `rgba(229,57,53,${0.1 + 0.07 * Math.sin(G.t * 8)})`; c.fillRect(0, 0, W, H); }
      if (s.msg) G.banner(c, s.msg.txt, "#fff", H * 0.62, s.msg.txt.length > 14 ? 13 : 18);
      G.hint(c, "BREAK SIDE CRATES, THEN CATCH THE TILES", 5, s.cy - 60);
    },
    drawCamp(G, c) {
      const s = G.s, W = G.W, H = G.H, m = s.meta, L = this.campLayout(G), dk = G.dark();
      const gr = c.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, dk ? "#1a1430" : "#3b2a6b"); gr.addColorStop(1, dk ? "#0d0a18" : "#1c1338");
      c.fillStyle = gr; c.fillRect(0, 0, W, H);
      G.img(c, ":dawgW:", 40, 46, 50); G.emoji(c, "👑", 40, 16, 22);
      G.text(c, "DAWG LORDS", 76, 32, 15, "#ffd23f", "left");
      G.text(c, `BEST: HELD ${fmtT(m.bestT || 0)}`, 76, 54, 8, "#fff", "left");
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
  // Batches thousands of little circles into one fill, so a giant horde still draws fast.
  function Path2DShim(c) { this.c = c; this.p = typeof Path2D !== "undefined" ? new Path2D() : null; }
  Path2DShim.prototype.dot = function (x, y, r) { if (this.p) { this.p.moveTo(x + r, y); this.p.arc(x, y, r, 0, 6.283); } };
  Path2DShim.prototype.fill = function () { if (this.p) this.c.fill(this.p); };
})();
