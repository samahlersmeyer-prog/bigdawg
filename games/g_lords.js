// ---------- Dawg Lords (castle defense roguelite) ----------
// Hordes pour down the field at your castle wall. Your Lord throws bones on his own; drag to slide him along the wall.
// Kills drop XP. Every level you pick 1 of 3 power-ups; maxed skills unlock evolutions. When the wall falls you
// earn crowns to spend on permanent upgrades at camp, so every run makes the next one go further.
(function () {
  const SK = [
    { k: "multi", n: "MULTI BONE", e: "🦴", max: 5, d: l => `Throw ${l + 2} bones at once` },
    { k: "rate", n: "QUICK PAWS", e: "⚡", max: 6, d: () => "Throw 15% faster" },
    { k: "dmg", n: "BIG BONES", e: "💪", max: 8, d: () => "+35% damage" },
    { k: "pierce", n: "PIERCE", e: "🗡️", max: 4, d: () => "Bones go through +1 foe" },
    { k: "crit", n: "CRIT CHANCE", e: "🎯", max: 4, d: () => "+12% chance to hit x2.5" },
    { k: "boom", n: "TENNIS BOMBS", e: "🎾", max: 5, d: l => l ? "Bigger, faster blasts" : "Lob exploding balls" },
    { k: "zap", n: "THUNDER WOOF", e: "🌩️", max: 5, d: l => l ? "+1 chain, more damage" : "Lightning chains foes" },
    { k: "frost", n: "FROST BREATH", e: "❄️", max: 4, d: () => "Slow foes near wall 15%" },
    { k: "orbit", n: "SPIN BONES", e: "🌀", max: 5, d: l => l ? "+1 spinning bone" : "Bones circle your Lord" },
    { k: "pup", n: "ARCHER PUP", e: "🐶", max: 4, d: l => l ? "+1 pup on the wall" : "A pup joins the wall" },
    { k: "wall", n: "STONE WALL", e: "🧱", max: 5, d: () => "+30% wall HP, full fix" },
    { k: "xp", n: "WISDOM", e: "📜", max: 3, d: () => "+25% XP" },
    { k: "gold", n: "TREASURY", e: "💰", max: 3, d: () => "+25% crowns this run" },
    { k: "heal", n: "MEND", e: "🩹", max: 99, d: () => "Repair 40% of the wall" },
    { k: "storm", n: "STORM LORD", e: "⛈️", max: 1, evo: "zap", d: () => "Lightning hits EVERYTHING" },
    { k: "tornado", n: "BONE TORNADO", e: "🌪️", max: 1, evo: "orbit", d: () => "Double ring, 3x hits" },
    { k: "mega", n: "MEGATON", e: "☄️", max: 1, evo: "boom", d: () => "Huge blasts that burn" },
    { k: "volley", n: "BONE STORM", e: "🌠", max: 1, evo: "multi", d: () => "Every 4s, rain 20 bones" }
  ];
  const SKM = {}; SK.forEach(x => SKM[x.k] = x);
  const PERKS = [
    { k: "hp", n: "CASTLE WALLS", e: "🏰", max: 10, c: l => Math.round(25 * Math.pow(1.45, l)), d: "+15% wall HP" },
    { k: "atk", n: "SHARP BONES", e: "🦴", max: 10, c: l => Math.round(30 * Math.pow(1.45, l)), d: "+12% damage" },
    { k: "spd", n: "QUICK PAWS", e: "⚡", max: 8, c: l => Math.round(40 * Math.pow(1.5, l)), d: "+6% throw speed" },
    { k: "gold", n: "ROYAL VAULT", e: "👑", max: 10, c: l => Math.round(35 * Math.pow(1.4, l)), d: "+10% crowns" },
    { k: "reroll", n: "REROLLS", e: "🎲", max: 3, c: l => [60, 180, 500][l], d: "+1 card reroll a run" },
    { k: "start", n: "HEAD START", e: "📈", max: 3, c: l => [120, 400, 1200][l], d: "+1 free pick at start" },
    { k: "revive", n: "SECOND WIND", e: "💖", max: 1, c: () => 600, d: "Wall rebuilds once" }
  ];
  const FOES = {
    rat: { e: "🐀", hp: 2, sp: 36, r: 13, xp: 1, pts: 10, dps: 2 },
    coon: { e: "🦝", hp: 2, sp: 66, r: 13, xp: 1, pts: 14, dps: 2 },
    bat: { e: "🦇", hp: 1.6, sp: 48, r: 12, xp: 1, pts: 14, dps: 2, fly: 1 },
    boar: { e: "🐗", hp: 14, sp: 24, r: 17, xp: 4, pts: 40, dps: 6 },
    croc: { e: "🐊", hp: 30, sp: 18, r: 19, xp: 7, pts: 80, dps: 10 }
  };
  const BOSSES = [{ n: "RAT KING", e: "🐀" }, { n: "BOAR CHIEF", e: "🐗" }, { n: "BEAR BARON", e: "🐻" }, { n: "THE DRAGON", e: "🐉" }];
  const RANKS = [[0, "PEASANT"], [60, "SQUIRE"], [150, "KNIGHT"], [240, "BARON"], [360, "COUNT"], [480, "DUKE"], [600, "KING"], [900, "EMPEROR"]];
  const rankOf = t => RANKS.filter(r => t >= r[0]).pop()[1];
  const nextRank = t => RANKS.find(r => r[0] > t);
  const fmt = t => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, "0")}`;
  const mkey = () => "bdd:lords:" + (typeof me !== "undefined" && me ? me.id : "");
  const today = () => new Date().toDateString();
  const loadMeta = () => Object.assign({ crowns: 0, best: 0, runs: 0, lastDay: "" }, store.get(mkey()) || {});
  const saveMeta = m => store.set(mkey(), m);
  // Emoji drawn once into little canvases: much faster than fillText for a screen full of critters.
  const SPR = {};
  const spr = (c, e, x, y, sz) => {
    const k = e + "|" + Math.round(sz), dpr = G.dpr || 1;
    let im = SPR[k];
    if (!im) {
      if (typeof document === "undefined") return;
      im = document.createElement("canvas"); const p = Math.ceil(sz * 1.3 * dpr); im.width = im.height = p;
      const x2 = im.getContext("2d"); x2.font = `${Math.round(sz * dpr)}px system-ui, "Apple Color Emoji", "Segoe UI Emoji"`;
      x2.textAlign = "center"; x2.textBaseline = "middle"; x2.fillText(e, p / 2, p / 2 + sz * dpr * 0.06); SPR[k] = im;
    }
    const w = im.width / dpr; c.drawImage(im, x - w / 2, y - w / 2, w, w);
  };
  const rr = (c, x, y, w, h, r) => { c.beginPath(); if (c.roundRect) c.roundRect(x, y, w, h, r); else c.rect(x, y, w, h); };
  const inR = (r, x, y) => r && x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h;

  defGame({
    key: "lords", name: "Dawg Lords", icon: "👑", max: 999999,
    blurb: "Defend the castle. Level up. Go again.",
    how: "Hordes charge your castle wall. Your Lord throws bones by himself; drag anywhere to slide him along the wall. Every kill drops XP, and each level you pick 1 of 3 power-ups: more bones, lightning, tennis bombs, spinning bones, archer pups and more. Max out a skill to unlock its EVOLUTION. Hordes hit every 40 seconds and a boss every 90 (beating one gives a free pick). When the wall falls you earn 👑 crowns, and at camp you spend them on permanent upgrades so every run goes further. First battle each day pays double crowns. Score is points from kills (keep a combo going for a bigger multiplier).",
    reset(G) {
      const W = G.W, H = G.H, wallY = H - 92;
      G.s = { mode: "camp", meta: loadMeta(), W, H, wallY, t: 0, lv: 1, xp: 0, need: 6, ups: {}, foes: [], bones: [], gems: [], fx: [], balls: [], burns: [],
        cd: 0, score: 0, kills: 0, combo: 0, comboT: 0, lx: W / 2, tx: W / 2, spawnT: 1, nextHorde: 40, nextBoss: 90, bossI: 0, horde: 0, hordeT: 0,
        pend: 0, choice: null, rerolls: 0, revived: false, boss: null, shake: 0, bossKills: 0, boomT: 2, zapT: 2, volT: 4, pupT: [0, 0.3, 0.6, 0.15], orbA: 0, msg: null, sfxT: 0, id: 0, wall: 100, wallMax: 100 };
    },
    begin(G) {
      const s = G.s, m = s.meta;
      s.mode = "play"; s.wallMax = s.wall = Math.round(100 * (1 + 0.15 * (m.hp || 0)));
      s.rerolls = m.reroll || 0; s.pend = m.start || 0; s.daily = m.lastDay !== today();
      s.msg = { txt: s.daily ? "DAILY 2X CROWNS!" : "DEFEND THE WALL!", t: 1.8 }; G.t = 0;
    },
    save(G) {
      const s = G.s; if (s.mode !== "play" || s.choice || s.t < 3) return null;
      const keep = ["t", "lv", "xp", "need", "ups", "score", "kills", "wall", "wallMax", "nextHorde", "nextBoss", "bossI", "pend", "rerolls", "revived", "bossKills", "daily"];
      const o = { label: `Lv ${s.lv} · ${fmt(s.t)}` }; keep.forEach(k => o[k] = s[k]); return o;
    },
    load(G, v) { const s = G.s; Object.keys(v).forEach(k => { if (k !== "label") s[k] = v[k]; }); s.mode = "play"; s.ups = Object.assign({}, v.ups); s.msg = { txt: "BACK TO THE WALL!", t: 1.4 }; },
    stats(s) {
      const u = s.ups, m = s.meta;
      return { dmg: (1 + 0.12 * (m.atk || 0)) * (1 + 0.35 * (u.dmg || 0)), rate: 0.45 * Math.pow(0.85, u.rate || 0) / (1 + 0.06 * (m.spd || 0)),
        n: 1 + (u.multi || 0), pierce: u.pierce || 0, crit: 0.05 + 0.12 * (u.crit || 0) };
    },
    // Three cards to pick from. Evolutions show up once their base skill is maxed and are weighted heavily.
    offer(s) {
      const pool = SK.filter(k => {
        const l = s.ups[k.k] || 0; if (l >= k.max) return false;
        if (k.evo) return (s.ups[k.evo] || 0) >= SKM[k.evo].max;
        if (k.k === "heal") return s.wall < s.wallMax * 0.7;
        return true;
      });
      const out = [];
      while (out.length < 3 && pool.length) {
        const tot = pool.reduce((a, k) => a + (k.evo ? 4 : 1), 0); let r = Math.random() * tot, i = 0;
        for (; i < pool.length; i++) { r -= pool[i].evo ? 4 : 1; if (r <= 0) break; }
        const k = pool.splice(Math.min(i, pool.length - 1), 1)[0], l = s.ups[k.k] || 0;
        out.push({ k: k.k, epic: !k.evo && k.k !== "heal" && k.max - l >= 2 && Math.random() < 0.12 });
      }
      while (out.length < 3) out.push({ k: "heal", epic: false });
      return out;
    },
    take(G, card) {
      const s = G.s, k = SKM[card.k], n = card.epic ? 2 : 1;
      if (card.k === "heal") s.wall = Math.min(s.wallMax, s.wall + s.wallMax * 0.4);
      else s.ups[card.k] = Math.min(k.max, (s.ups[card.k] || 0) + n);
      if (card.k === "wall") { s.wallMax = Math.round(s.wallMax * (1 + 0.3 * n)); s.wall = s.wallMax; }
      s.choice = null; s.pend--; G.sfx("pop");
      if (k.evo) { s.msg = { txt: `${k.n}!`, t: 1.6 }; s.shake = 0.3; G.sfx("win"); }
    },
    spawn(s, k, elite) {
      const F = FOES[k], t = s.t, hpM = 1 + t / 45 + Math.pow(t / 100, 2.6), e = elite ? 6 : 1;
      const r = F.r * (elite ? 1.4 : 1), x = r + Math.random() * (s.W - 2 * r);
      s.foes.push({ id: ++s.id, k, e: F.e, x, x0: x, y: 40, r, hp: F.hp * hpM * e, max: F.hp * hpM * e, sp: F.sp * (1 + Math.min(0.5, t / 600)), xp: F.xp * (elite ? 5 : 1),
        pts: F.pts * (elite ? 5 : 1), dps: F.dps * (elite ? 3 : 1), fly: F.fly, ph: Math.random() * 6, elite, flash: 0, ohit: 0, burn: 0 });
    },
    spawnBoss(G) {
      const s = G.s, B = BOSSES[s.bossI % 4], tier = Math.floor(s.bossI / 4), hpM = 1 + s.t / 45 + Math.pow(s.t / 100, 2.6);
      const hp = 90 * hpM * (1 + 0.6 * (s.bossI % 4)) * (1 + tier);
      const f = { id: ++s.id, k: "boss", e: B.e, bn: B.n, x: s.W / 2, x0: s.W / 2, y: 30, r: 32, hp, max: hp, sp: 14, xp: 30, pts: 1000 * (s.bossI + 1), dps: 25 * (1 + s.bossI * 0.4), ph: 0, flash: 0, ohit: 0, burn: 0 };
      s.foes.push(f); s.boss = f; s.bossI++; s.msg = { txt: `BOSS: ${B.n}!`, t: 2 }; s.shake = 0.4; G.sfx("lose");
    },
    hit(G, f, d, crit) {
      const s = G.s; if (f.dead) return;
      f.hp -= d; f.flash = 0.08;
      if ((crit || f.k === "boss") && s.fx.length < 110) s.fx.push({ txt: String(Math.round(d * 10)), x: f.x + (Math.random() - 0.5) * 16, y: f.y - f.r, t: 0.6, col: crit ? "#ff5252" : "#fff", sz: crit ? 11 : 9 });
      if (f.hp <= 0) this.kill(G, f);
    },
    kill(G, f) {
      const s = G.s; if (f.dead) return; f.dead = true;
      s.combo++; s.comboT = 2.2; const mult = 1 + Math.min(2, s.combo * 0.02);
      const p = Math.round(f.pts * mult); s.score += p; s.kills++;
      const gn = f.k === "boss" ? 10 : f.elite ? 4 : 1; for (let i = 0; i < gn; i++) s.gems.push({ x: f.x + (Math.random() - 0.5) * f.r * 2, y: f.y + (Math.random() - 0.5) * f.r, v: f.xp / gn, t: -Math.random() * 0.2, big: f.xp >= 4 });
      if (s.fx.length < 110) s.fx.push({ pop: 1, x: f.x, y: f.y, r: f.r, t: 0.25 });
      if (f.k === "boss") { s.bossKills++; s.pend++; s.boss = null; s.msg = { txt: "BOSS DOWN! FREE PICK", t: 2 }; s.shake = 0.5; G.sfx("win"); }
      else if (f.elite) { s.pend++; s.msg = { txt: "ELITE! FREE PICK", t: 1.2 }; }
      if (s.sfxT <= 0) { G.sfx("pop"); s.sfxT = 0.09; }
    },
    front(s, n) { // foes closest to the wall
      const a = s.foes.filter(f => !f.dead && f.y > 36); a.sort((p, q) => q.y - p.y); return n ? a.slice(0, n) : a[0];
    },
    throwAt(s, x, y, f, dmg, n, pierce, crit) {
      const lead = Math.min(0.5, Math.hypot(f.x - x, f.y - y) / 560), ty = f.y + f.sp * lead * (f.atk ? 0 : 1);
      const a0 = Math.atan2(ty - y, f.x - x);
      for (let i = 0; i < n; i++) {
        const a = a0 + (i - (n - 1) / 2) * 0.13, c = Math.random() < crit;
        s.bones.push({ x, y, vx: Math.cos(a) * 560, vy: Math.sin(a) * 560, d: dmg * (c ? 2.5 : 1), crit: c, p: pierce, hit: [], rot: Math.random() * 6 });
      }
    },
    update(G, dt) {
      const s = G.s; if (s.mode !== "play") return;
      if (s.msg) { s.msg.t -= dt; if (s.msg.t <= 0) s.msg = null; }
      s.shake = Math.max(0, s.shake - dt); s.sfxT -= dt;
      if (s.pend > 0 && !s.choice) { s.choice = this.offer(s); G.sfx("win"); }
      if (s.choice) return; // paused while picking
      const W = s.W, wy = s.wallY, u = s.ups, st = this.stats(s);
      s.t += dt;
      // ---- spawns ----
      const t = s.t;
      if (s.foes.length < 120) {
        s.spawnT -= dt;
        if (s.spawnT <= 0) {
          s.spawnT = Math.max(0.15, 1.25 - t * 0.0045) * (0.7 + Math.random() * 0.6);
          const r = Math.random(), k = t > 100 && r < 0.07 ? "croc" : t > 60 && r < 0.2 ? "boar" : t > 40 && r < 0.36 ? "bat" : t > 18 && r < 0.56 ? "coon" : "rat";
          this.spawn(s, k, t > 75 && Math.random() < 0.035);
        }
      }
      if (t >= s.nextHorde) { s.horde = Math.round(12 + t / 12); s.nextHorde += 40; s.msg = { txt: "HORDE INCOMING!", t: 1.6 }; G.sfx("lose"); }
      if (s.horde > 0) { s.hordeT -= dt; if (s.hordeT <= 0) { s.hordeT = 0.06; s.horde--; this.spawn(s, t > 60 && Math.random() < 0.25 ? "boar" : Math.random() < 0.5 ? "coon" : "rat"); } }
      if (t >= s.nextBoss) { s.nextBoss += 90; this.spawnBoss(G); }
      if (s.comboT > 0) { s.comboT -= dt; if (s.comboT <= 0) s.combo = 0; }
      // ---- the Lord ----
      const dx = s.tx - s.lx; s.lx += Math.sign(dx) * Math.min(Math.abs(dx), 620 * dt);
      const lx = s.lx, ly = wy - 18;
      s.cd -= dt;
      if (s.cd <= 0) { const f = this.front(s); if (f) { s.cd = st.rate; this.throwAt(s, lx, ly, f, st.dmg, st.n, st.pierce, st.crit); } }
      // archer pups
      const PX = [0.1, 0.9, 0.3, 0.7];
      for (let i = 0; i < (u.pup || 0); i++) { s.pupT[i] -= dt; if (s.pupT[i] <= 0) { const f = this.front(s); if (f) { s.pupT[i] = 0.85; this.throwAt(s, PX[i] * W, wy - 12, f, st.dmg * 0.7, 1, 0, st.crit); } } }
      // bone storm evolution: a rain of bones down the whole field
      if (u.volley) { s.volT -= dt; if (s.volT <= 0) { s.volT = 4; for (let i = 0; i < 20; i++) { const x = (i + 0.5) * W / 20; s.bones.push({ x, y: wy - 10 - Math.random() * 30, vx: 0, vy: -480, d: st.dmg * 1.5, p: 2, hit: [], rot: 0 }); } } }
      // tennis bombs
      if (u.boom) {
        s.boomT -= dt;
        if (s.boomT <= 0) {
          s.boomT = u.mega ? 0.8 : Math.max(0.9, 2.8 - 0.35 * u.boom);
          const c = this.front(s, 6); if (c.length) { const f = c[Math.floor(Math.random() * c.length)]; s.balls.push({ x0: lx, y0: ly, x1: f.x, y1: f.y + f.sp * 0.35, t: 0 }); }
        }
      }
      s.balls.forEach(b => {
        b.t += dt / 0.4; if (b.t < 1) return; b.done = true;
        const R = (40 + 8 * u.boom) * (u.mega ? 1.6 : 1), D = st.dmg * (2 + 0.8 * u.boom) * (u.mega ? 2 : 1);
        s.foes.forEach(f => { if (!f.dead && Math.hypot(f.x - b.x1, f.y - b.y1) < R + f.r * 0.5) this.hit(G, f, D); });
        s.fx.push({ ring: 1, x: b.x1, y: b.y1, r: R, t: 0.3 }); if (u.mega) s.burns.push({ x: b.x1, y: b.y1, r: R * 0.8, t: 2, d: st.dmg * 2 });
        s.shake = Math.max(s.shake, 0.08);
      });
      s.balls = s.balls.filter(b => !b.done);
      s.burns.forEach(b => { b.t -= dt; s.foes.forEach(f => { if (!f.dead && Math.hypot(f.x - b.x, f.y - b.y) < b.r) { f.hp -= b.d * dt; if (f.hp <= 0) this.kill(G, f); } }); });
      s.burns = s.burns.filter(b => b.t > 0);
      // lightning
      if (u.zap) {
        s.zapT -= dt;
        if (s.zapT <= 0) {
          if (u.storm) {
            s.zapT = 1.6; const D = st.dmg * 2.5; const all = s.foes.filter(f => !f.dead).slice(0, 45);
            all.forEach(f => { s.fx.push({ zap: [[f.x + 8, 40], [f.x - 6, (f.y + 40) / 2], [f.x, f.y]], t: 0.15 }); this.hit(G, f, D); });
            if (all.length) s.shake = Math.max(s.shake, 0.12);
          } else {
            s.zapT = Math.max(1, 2.4 - 0.25 * u.zap); let cur = this.front(s); const D = st.dmg * (1.6 + 0.4 * u.zap), hit = [], pts = [[lx, ly]];
            for (let i = 0; i < 2 + u.zap && cur; i++) {
              hit.push(cur); pts.push([cur.x, cur.y]); this.hit(G, cur, D);
              let nb = null, bd = 130; s.foes.forEach(f => { if (!f.dead && !hit.includes(f)) { const d = Math.hypot(f.x - cur.x, f.y - cur.y); if (d < bd) { bd = d; nb = f; } } }); cur = nb;
            }
            if (pts.length > 1) s.fx.push({ zap: pts, t: 0.18 });
          }
        }
      }
      // spinning bones
      if (u.orbit) {
        s.orbA += dt * (u.tornado ? 5 : 3.2);
        const rings = u.tornado ? [[62, u.orbit], [104, u.orbit]] : [[62, u.orbit]], D = st.dmg * (u.tornado ? 3.6 : 1.3);
        s.orbs = [];
        rings.forEach(([R, n], ri) => { for (let i = 0; i < n; i++) { const a = s.orbA * (ri ? -1 : 1) + i * Math.PI * 2 / n; s.orbs.push([lx + Math.cos(a) * R, ly + Math.sin(a) * R * 0.75]); } });
        s.foes.forEach(f => { f.ohit -= dt; if (f.dead || f.ohit > 0) return; if (s.orbs.some(o => Math.hypot(o[0] - f.x, o[1] - f.y) < 14 + f.r * 0.6)) { f.ohit = 0.35; this.hit(G, f, D); } });
      } else s.orbs = null;
      // ---- bones in flight ----
      s.bones.forEach(b => {
        b.x += b.vx * dt; b.y += b.vy * dt; b.rot += dt * 14;
        if (b.y < 30 || b.x < -20 || b.x > W + 20 || b.y > s.H) { b.gone = true; return; }
        for (const f of s.foes) {
          if (f.dead || b.hit.includes(f.id)) continue;
          if (Math.abs(f.x - b.x) < f.r + 5 && Math.abs(f.y - b.y) < f.r + 5) {
            b.hit.push(f.id); this.hit(G, f, b.d, b.crit);
            if (b.p-- <= 0) { b.gone = true; break; }
          }
        }
      });
      s.bones = s.bones.filter(b => !b.gone);
      // ---- foes ----
      const fz = u.frost ? 1 - 0.15 * u.frost : 1;
      s.foes.forEach(f => {
        f.flash -= dt; if (f.dead) return;
        const slow = u.frost && f.y > wy - 150 ? (f.k === "boss" ? (1 + fz) / 2 : fz) : 1; f.slowed = slow < 1;
        if (f.y + f.r * 0.6 < wy) { f.y += f.sp * slow * dt; f.atk = false; if (f.fly) { f.ph += dt * 3; f.x = Math.max(f.r, Math.min(W - f.r, f.x0 + Math.sin(f.ph) * 40)); } }
        else { f.atk = true; s.wall -= f.dps * (1 + s.t / 150) * slow * dt; f.ph += dt * 10; if (f.k === "boss") s.shake = Math.max(s.shake, 0.05); }
      });
      s.foes = s.foes.filter(f => !f.dead || f.flash > 0);
      if (s.boss && s.boss.dead) s.boss = null;
      // ---- XP gems fly to the Lord ----
      const xm = 2 * (1 + 0.25 * (u.xp || 0));
      s.gems.forEach(g => {
        g.t += dt; if (g.t < 0.3) return;
        const ddx = lx - g.x, ddy = ly - g.y, d = Math.hypot(ddx, ddy), v = (220 + 900 * (g.t - 0.3)) * dt;
        if (d < v + 14) { g.got = true; s.xp += g.v * xm; } else { g.x += ddx / d * v; g.y += ddy / d * v; }
      });
      s.gems = s.gems.filter(g => !g.got);
      while (s.xp >= s.need) { s.xp -= s.need; s.lv++; s.need = Math.round(3 + s.lv * 2 + Math.pow(s.lv, 1.5)); s.pend++; }
      s.fx.forEach(e => e.t -= dt); s.fx = s.fx.filter(e => e.t > 0);
      // ---- the wall ----
      if (s.wall <= 0) {
        if (s.meta.revive && !s.revived) {
          s.revived = true; s.wall = s.wallMax * 0.5; s.msg = { txt: "SECOND WIND!", t: 2 }; s.shake = 0.5; G.sfx("win");
          s.foes.forEach(f => { if (f.atk && f.k !== "boss") this.kill(G, f); else if (f.atk) f.y -= 120; });
          return;
        }
        this.end(G);
      }
    },
    end(G) {
      const s = G.s, m = s.meta, u = s.ups, oldBest = m.best || 0;
      let cr = Math.floor(s.t / 4 + Math.sqrt(s.score) / 2 + s.bossKills * 20);
      cr = Math.round(cr * (1 + 0.1 * (m.gold || 0)) * (1 + 0.25 * (u.gold || 0)) * (s.daily ? 2 : 1));
      m.crowns += cr; m.runs = (m.runs || 0) + 1; m.best = Math.max(oldBest, Math.floor(s.t)); if (s.daily) m.lastDay = today(); saveMeta(m);
      const rk = rankOf(s.t), up = rankOf(s.t) !== rankOf(oldBest) && s.t > oldBest;
      G.over(Math.min(999999, s.score), `${up ? "NEW RANK: " : ""}${rk}. Held ${fmt(s.t)}. +${cr} 👑 for camp`);
    },
    // ---- camp (the permanent upgrade shop) ----
    campLayout(G) {
      const W = G.W, H = G.H, top = 132, btnH = 54, rh = Math.min(50, Math.max(38, (H - top - btnH - 26) / PERKS.length));
      return { rows: PERKS.map((p, i) => ({ x: 12, y: top + i * rh, w: W - 24, h: rh - 6 })), go: { x: 24, y: Math.min(H - btnH - 12, top + PERKS.length * rh + 8), w: W - 48, h: btnH } };
    },
    down(G, x) { const s = G.s; if (s.mode === "play" && !s.choice) s.tx = Math.max(24, Math.min(s.W - 24, x)); },
    move(G, x) { this.down(G, x); },
    tap(G, x, y) {
      const s = G.s;
      if (s.mode === "camp") {
        const L = this.campLayout(G);
        if (inR(L.go, x, y)) { this.begin(G); G.sfx("win"); return; }
        L.rows.forEach((r, i) => {
          if (!inR(r, x, y)) return; const p = PERKS[i], l = s.meta[p.k] || 0;
          if (l >= p.max) return; const c = p.c(l);
          if (s.meta.crowns < c) { s.campMsg = { txt: `NEED ${c} 👑`, t: 1 }; G.buzz(); return; }
          s.meta.crowns -= c; s.meta[p.k] = l + 1; saveMeta(s.meta); s.campMsg = { txt: `${p.n} ${l + 1}!`, t: 1 }; G.sfx("win");
        });
        return;
      }
      if (s.choice) {
        const L = this.cardLayout(G);
        L.cards.forEach((r, i) => { if (inR(r, x, y)) this.take(G, s.choice[i]); });
        if (s.choice && s.rerolls > 0 && inR(L.re, x, y)) { s.rerolls--; s.choice = this.offer(s); G.sfx("pop"); }
      }
    },
    cardLayout(G) {
      const W = G.W, H = G.H, ch = Math.min(96, (H - 260) / 3), y0 = Math.max(120, H / 2 - (ch * 3 + 20) / 2 - 10);
      return { cards: [0, 1, 2].map(i => ({ x: 18, y: y0 + i * (ch + 10), w: W - 36, h: ch })), re: { x: W / 2 - 90, y: y0 + 3 * (ch + 10) + 6, w: 180, h: 40 } };
    },
    draw(G, c) {
      const s = G.s, W = G.W, H = G.H, dark = G.dark(), wy = s.wallY || H - 92;
      if (s.mode === "camp") return this.drawCamp(G, c);
      c.save();
      if (s.shake > 0) c.translate((Math.random() - 0.5) * 10 * s.shake * 2, (Math.random() - 0.5) * 10 * s.shake * 2);
      // field
      const gr = c.createLinearGradient(0, 0, 0, wy);
      gr.addColorStop(0, dark ? "#1b2a16" : "#5f9a45"); gr.addColorStop(1, dark ? "#2c4422" : "#86c35f");
      c.fillStyle = gr; c.fillRect(-10, -10, W + 20, wy + 10);
      c.fillStyle = dark ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.08)";
      for (let i = 0; i < 18; i++) { const x = (i * 97) % W, y = 60 + ((i * 53) % Math.max(1, wy - 90)); c.fillRect(x, y, 3, 8); c.fillRect(x + 4, y + 2, 3, 6); }
      if (s.ups.frost) { const fg = c.createLinearGradient(0, wy - 150, 0, wy); fg.addColorStop(0, "rgba(140,210,255,0)"); fg.addColorStop(1, `rgba(140,210,255,${0.12 + 0.06 * s.ups.frost})`); c.fillStyle = fg; c.fillRect(0, wy - 150, W, 150); }
      s.burns.forEach(b => { c.fillStyle = `rgba(255,120,40,${0.25 * Math.min(1, b.t)})`; c.beginPath(); c.arc(b.x, b.y, b.r, 0, 7); c.fill(); });
      // gems
      s.gems.forEach(g => { c.fillStyle = g.big ? "#b388ff" : "#4fc3f7"; c.beginPath(); c.moveTo(g.x, g.y - 6); c.lineTo(g.x + 5, g.y); c.lineTo(g.x, g.y + 6); c.lineTo(g.x - 5, g.y); c.fill(); });
      // foes
      s.foes.forEach(f => {
        const sz = f.r * 2.1, bob = f.atk ? Math.sin(f.ph) * 3 : Math.sin(f.y * 0.15) * 1.5;
        if (f.elite) { c.strokeStyle = "#ffd23f"; c.lineWidth = 3; c.beginPath(); c.arc(f.x, f.y, f.r + 4, 0, 7); c.stroke(); }
        if (f.k === "boss") { c.fillStyle = "rgba(229,57,53,0.25)"; c.beginPath(); c.arc(f.x, f.y, f.r + 10 + Math.sin(s.t * 6) * 3, 0, 7); c.fill(); }
        spr(c, f.e, f.x, f.y + bob, sz);
        if (f.k === "boss") spr(c, "👑", f.x, f.y - f.r - 8, 22);
        if (f.flash > 0) { c.fillStyle = "rgba(255,255,255,0.55)"; c.beginPath(); c.arc(f.x, f.y, f.r, 0, 7); c.fill(); }
        if (f.slowed) { c.fillStyle = "rgba(140,210,255,0.3)"; c.beginPath(); c.arc(f.x, f.y, f.r * 0.9, 0, 7); c.fill(); }
        if (f.k !== "boss" && f.hp < f.max && !f.dead) { c.fillStyle = "#300"; c.fillRect(f.x - f.r, f.y - f.r - 6, f.r * 2, 3); c.fillStyle = "#5be35b"; c.fillRect(f.x - f.r, f.y - f.r - 6, f.r * 2 * Math.max(0, f.hp / f.max), 3); }
      });
      // tennis balls in the air
      s.balls.forEach(b => { const x = b.x0 + (b.x1 - b.x0) * b.t, y = b.y0 + (b.y1 - b.y0) * b.t - Math.sin(b.t * Math.PI) * 60; spr(c, "🎾", x, y, 16 + Math.sin(b.t * Math.PI) * 6); });
      // bones
      s.bones.forEach(b => { c.save(); c.translate(b.x, b.y); c.rotate(b.rot); c.fillStyle = b.crit ? "#ff8a80" : "#fff8e1"; c.fillRect(-6, -1.5, 12, 3);
        [[-6, -2], [-6, 2], [6, -2], [6, 2]].forEach(([px, py]) => { c.beginPath(); c.arc(px, py, 2.4, 0, 7); c.fill(); }); c.restore(); });
      // fx
      s.fx.forEach(e => {
        if (e.ring) { c.strokeStyle = `rgba(255,214,90,${e.t / 0.3})`; c.lineWidth = 4; c.beginPath(); c.arc(e.x, e.y, e.r * (1.1 - e.t), 0, 7); c.stroke(); c.fillStyle = `rgba(255,170,60,${e.t})`; c.fill(); }
        else if (e.zap) { c.strokeStyle = `rgba(180,230,255,${e.t / 0.18})`; c.lineWidth = 3; c.beginPath(); e.zap.forEach((p, i) => { const jx = i ? (Math.random() - 0.5) * 10 : 0; i ? c.lineTo(p[0] + jx, p[1]) : c.moveTo(p[0], p[1]); }); c.stroke(); }
        else if (e.pop) { c.strokeStyle = `rgba(255,255,255,${e.t * 3})`; c.lineWidth = 2; c.beginPath(); c.arc(e.x, e.y, e.r * (1.6 - e.t * 2), 0, 7); c.stroke(); }
        else G.text(c, e.txt, e.x, e.y - (0.6 - e.t) * 30, e.sz, e.col);
      });
      // wall
      const hpF = Math.max(0, s.wall / s.wallMax);
      c.fillStyle = dark ? "#4a4a52" : "#8d8d96"; c.fillRect(-10, wy, W + 20, 26);
      for (let x = 0; x < W; x += 30) { c.fillRect(x, wy - 10, 18, 12); }
      c.fillStyle = dark ? "#3a3a40" : "#77777f";
      for (let row = 0; row < 2; row++) for (let x = row ? -15 : 0; x < W; x += 30) c.fillRect(x + 1, wy + 2 + row * 12, 28, 1);
      if (hpF < 0.5) { c.strokeStyle = "rgba(0,0,0,0.5)"; c.lineWidth = 2; for (let i = 0; i < 5; i++) { const x = (i * 83 + 30) % W; c.beginPath(); c.moveTo(x, wy); c.lineTo(x + 6, wy + 9); c.lineTo(x - 2, wy + 18); c.stroke(); } }
      // ground under the wall + wall HP
      c.fillStyle = dark ? "#151515" : "#2b2b2b"; c.fillRect(-10, wy + 26, W + 20, H - wy);
      c.fillStyle = "rgba(255,255,255,0.15)"; c.fillRect(14, wy + 34, W - 28, 12);
      c.fillStyle = hpF > 0.5 ? "#66bb6a" : hpF > 0.25 ? "#ffb300" : "#e53935"; c.fillRect(14, wy + 34, (W - 28) * hpF, 12);
      G.text(c, `🧱 ${Math.ceil(Math.max(0, s.wall))}/${s.wallMax}`, W / 2, wy + 41, 8, "#fff");
      // owned skills strip
      const own = SK.filter(k => s.ups[k.k] && k.k !== "heal"), sw = Math.min(40, (W - 20) / Math.max(1, own.length));
      own.forEach((k, i) => { const x = 10 + sw * i + sw / 2, y = wy + 66; spr(c, k.e, x, y, Math.min(20, sw * 0.6)); if (!k.evo) G.text(c, String(s.ups[k.k]), x + sw * 0.3, y + 9, 7, s.ups[k.k] >= k.max ? "#ffd23f" : "#fff"); });
      // pups + lord
      const PX = [0.1, 0.9, 0.3, 0.7];
      for (let i = 0; i < (s.ups.pup || 0); i++) G.img(c, ":dawgpog:", PX[i] * W, wy - 12, 26);
      if (s.orbs) s.orbs.forEach(o => { c.save(); c.translate(o[0], o[1]); c.rotate(s.orbA * 4); c.fillStyle = s.ups.tornado ? "#ffe082" : "#fff8e1"; c.fillRect(-7, -2, 14, 4); [[-7, -2], [-7, 2], [7, -2], [7, 2]].forEach(([px, py]) => { c.beginPath(); c.arc(px, py, 2.8, 0, 7); c.fill(); }); c.restore(); });
      c.fillStyle = "rgba(0,0,0,0.3)"; c.beginPath(); c.ellipse(s.lx, wy - 2, 18, 5, 0, 0, 7); c.fill();
      G.img(c, ":dawgW:", s.lx, wy - 20, 42); spr(c, "👑", s.lx, wy - 44, 20);
      c.restore();
      // HUD + XP bar
      G.hud(c, `LV${s.lv}`, String(s.score), fmt(s.t));
      c.fillStyle = "rgba(0,0,0,0.5)"; c.fillRect(0, 34, W, 7); c.fillStyle = "#4fc3f7"; c.fillRect(0, 34, W * Math.min(1, s.xp / s.need), 7);
      if (s.combo >= 10) G.text(c, `COMBO ${s.combo} x${(1 + Math.min(2, s.combo * 0.02)).toFixed(1)}`, 10, 54, 9, s.combo >= 50 ? "#ff5252" : "#ffd23f", "left");
      const nb = Math.ceil(s.nextBoss - s.t); if (!s.boss && nb <= 10) G.text(c, `BOSS IN ${nb}`, W - 10, 54, 9, "#ff8a80", "right");
      if (s.boss) { const b = s.boss, bw = W - 40; c.fillStyle = "rgba(0,0,0,0.6)"; c.fillRect(20, 62, bw, 14); c.fillStyle = "#e53935"; c.fillRect(22, 64, (bw - 4) * Math.max(0, b.hp / b.max), 10); G.text(c, b.bn, W / 2, 69, 8, "#fff"); }
      if (s.msg && !s.choice) G.banner(c, s.msg.txt, "#fff", H * 0.38, s.msg.txt.length > 11 ? 16 : undefined);
      if (s.wall / s.wallMax < 0.25) { c.fillStyle = `rgba(229,57,53,${0.12 + 0.08 * Math.sin(s.t * 8)})`; c.fillRect(0, 0, W, H); }
      if (s.choice) this.drawCards(G, c);
      else G.hint(c, "DRAG TO MOVE YOUR LORD", 4, wy - 70);
    },
    drawCards(G, c) {
      const s = G.s, W = G.W, H = G.H, L = this.cardLayout(G);
      c.fillStyle = "rgba(8,8,16,0.78)"; c.fillRect(0, 0, W, H);
      G.banner(c, s.pend > 1 ? `LEVEL UP! (${s.pend})` : "LEVEL UP!", "#ffd23f", L.cards[0].y - 30, 20);
      s.choice.forEach((cd, i) => {
        const r = L.cards[i], k = SKM[cd.k], l = s.ups[cd.k] || 0, gold = !!k.evo, col = gold ? "#ffd23f" : cd.epic ? "#ce93d8" : "rgba(255,255,255,0.75)";
        c.fillStyle = gold ? "#3a2c00" : cd.epic ? "#2e1238" : "#1d2333"; rr(c, r.x, r.y, r.w, r.h, 14); c.fill();
        c.strokeStyle = col; c.lineWidth = gold || cd.epic ? 3 : 1.5; rr(c, r.x, r.y, r.w, r.h, 14); c.stroke();
        spr(c, k.e, r.x + 38, r.y + r.h / 2, Math.min(40, r.h * 0.5));
        const tx = r.x + 74;
        G.text(c, k.n, tx, r.y + r.h * 0.3, 11, gold ? "#ffd23f" : "#fff", "left");
        G.text(c, k.d(l), tx, r.y + r.h * 0.56, 8, "rgba(255,255,255,0.8)", "left");
        const tag = gold ? "EVOLUTION" : cd.k === "heal" ? "" : cd.epic ? `EPIC! LV ${l}→${Math.min(k.max, l + 2)}` : `LV ${l}→${l + 1}`;
        if (tag) G.text(c, tag, tx, r.y + r.h * 0.8, 8, gold ? "#ffd23f" : cd.epic ? "#ce93d8" : "#4fc3f7", "left");
      });
      if (s.rerolls > 0) { const r = L.re; c.fillStyle = "#37474f"; rr(c, r.x, r.y, r.w, r.h, 20); c.fill(); G.text(c, `🎲 REROLL (${s.rerolls})`, r.x + r.w / 2, r.y + r.h / 2 + 1, 9, "#fff"); }
    },
    drawCamp(G, c) {
      const s = G.s, W = G.W, H = G.H, m = s.meta, L = this.campLayout(G), dark = G.dark();
      const gr = c.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, dark ? "#1a1430" : "#3b2a6b"); gr.addColorStop(1, dark ? "#0d0a18" : "#1c1338");
      c.fillStyle = gr; c.fillRect(0, 0, W, H);
      G.img(c, ":dawgW:", 40, 44, 50); spr(c, "👑", 40, 14, 22);
      G.text(c, "DAWG LORDS", 76, 32, 15, "#ffd23f", "left");
      G.text(c, `RANK: ${rankOf(m.best || 0)} · BEST ${fmt(m.best || 0)}`, 76, 54, 8, "#fff", "left");
      const nr = nextRank(m.best || 0); if (nr) G.text(c, `NEXT: ${nr[1]} AT ${fmt(nr[0])}`, 76, 70, 8, "rgba(255,255,255,0.6)", "left");
      c.fillStyle = "rgba(255,210,63,0.15)"; rr(c, 12, 86, W - 24, 34, 10); c.fill();
      G.text(c, `👑 ${m.crowns}`, 24, 104, 13, "#ffd23f", "left");
      G.text(c, m.lastDay !== today() ? "🎁 2X TODAY" : "CAMP UPGRADES", W - 24, 104, 8, m.lastDay !== today() ? "#80ff9c" : "rgba(255,255,255,0.6)", "right");
      PERKS.forEach((p, i) => {
        const r = L.rows[i], l = m[p.k] || 0, maxed = l >= p.max, cost = maxed ? 0 : p.c(l), ok = !maxed && m.crowns >= cost;
        c.fillStyle = ok ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.05)"; rr(c, r.x, r.y, r.w, r.h, 10); c.fill();
        if (ok) { c.strokeStyle = "rgba(255,210,63,0.6)"; c.lineWidth = 1.5; rr(c, r.x, r.y, r.w, r.h, 10); c.stroke(); }
        spr(c, p.e, r.x + 22, r.y + r.h / 2, Math.min(24, r.h * 0.55));
        G.text(c, p.n, r.x + 44, r.y + r.h * 0.34, 9, "#fff", "left");
        G.text(c, `${p.d} · ${l}/${p.max}`, r.x + 44, r.y + r.h * 0.7, 7, "rgba(255,255,255,0.65)", "left");
        G.text(c, maxed ? "MAX" : `${cost}👑`, r.x + r.w - 10, r.y + r.h / 2, 9, maxed ? "#80ff9c" : ok ? "#ffd23f" : "#ff8a80", "right");
      });
      const g = L.go; c.fillStyle = "#c62828"; rr(c, g.x, g.y + 4, g.w, g.h, 16); c.fill(); c.fillStyle = "#ef5350"; rr(c, g.x, g.y, g.w, g.h, 16); c.fill();
      G.text(c, "⚔️ TO THE WALL!", W / 2, g.y + g.h / 2 + 1, 13, "#fff");
      if (s.campMsg) { s.campMsg.t -= 1 / 60; if (s.campMsg.t <= 0) s.campMsg = null; else G.banner(c, s.campMsg.txt, "#ffd23f", g.y - 18, 14); }
      if (!m.runs) G.hint(c, "BUY UPGRADES WITH CROWNS, THEN FIGHT", 6, g.y - 18);
    }
  });
})();
