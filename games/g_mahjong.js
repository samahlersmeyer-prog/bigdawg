// ---------- Dawg Mahjong (The Den, daily tile-matching puzzle) ----------
// Mahjong solitaire: match pairs of free tiles until the board is clear. A tile is free when nothing sits on top of it
// and its left or right side is open. Same board for everyone each day, always solvable.
(function () {
  const FACES = ["🐶", "🦴", "🎾", "🐾", "🏈", "⚾", "🏀", "⚽", "🏒", "⛳", "🌭", "🍕", "🍔", "🌮", "🍩", "🍪", "🧀", "🥨", "🍿", "🏆"];
  const BG = ["#fff4d6", "#e8f4ff", "#eaf7e4", "#fde8ef", "#efe8ff"];
  // layout in tile units: [col, row, layer]
  const POS = [];
  for (let r = 0; r < 6; r++) for (let c = 0; c < 8; c++) if (!((r === 0 || r === 5) && (c === 0 || c === 7))) POS.push([c, r, 0]);
  for (let r = 1; r < 5; r++) for (let c = 1; c < 7; c++) POS.push([c, r, 1]);
  for (let r = 2; r < 4; r++) for (let c = 2; c < 6; c++) POS.push([c, r, 2]);
  POS.push([3, 2.5, 3], [4, 2.5, 3]);
  const dayN = () => { const [y, m, d] = KEY.split("-").map(Number); return Math.round((Date.UTC(y, m - 1, d) - Date.UTC(2026, 9, 27)) / 864e5); };
  const rk = () => "bdd:den:mahjong:" + KEY + ":" + (me ? me.id : "");
  const rr = (c, x, y, w, h, r) => { c.beginPath(); if (c.roundRect) c.roundRect(x, y, w, h, r); else c.rect(x, y, w, h); };
  const mmss = t => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, "0")}`;
  function rng(str) { let h = 1779033703 ^ str.length; for (let i = 0; i < str.length; i++) { h = Math.imul(h ^ str.charCodeAt(i), 3432918353); h = h << 13 | h >>> 19; }
    let a = h >>> 0; return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  // free = nothing on top and an open left or right side (among the tiles still on the board)
  function isFree(i, alive) {
    const [c, r, l] = POS[i];
    let left = false, right = false;
    for (const j of alive) { if (j === i) continue; const [c2, r2, l2] = POS[j];
      if (l2 > l && Math.abs(c2 - c) < 1 && Math.abs(r2 - r) < 1) return false;
      if (l2 === l && Math.abs(r2 - r) < 1) { if (c2 === c - 1) left = true; if (c2 === c + 1) right = true; } }
    return !(left && right);
  }
  // Deal faces onto the given positions so the board can be cleared: remove random free pairs in turn, giving each pair a face.
  // Re-deal the tiles that are left so the board can still be cleared. If the leftover tiles are stuck in a shape that can
  // never be cleared (say, two matching tiles stacked on each other), lay them out flat on the bottom layer instead.
  function redeal(s, R) {
    const cnt = {}; s.alive.forEach(i => cnt[s.face[i]] = (cnt[s.face[i]] || 0) + 1);
    const kinds = []; Object.keys(cnt).forEach(k => { for (let n = 0; n < cnt[k] / 2; n++) kinds.push(+k); });
    let at = s.alive, f = deal(R, at, kinds);
    if (!f) {
      const mid = [3.5, 2.5], flat = POS.map((p, i) => i).filter(i => POS[i][2] === 0).sort((a, b) => Math.hypot(POS[a][0] - mid[0], (POS[a][1] - mid[1]) * 1.6) - Math.hypot(POS[b][0] - mid[0], (POS[b][1] - mid[1]) * 1.6));
      at = flat.slice(0, s.alive.length); f = deal(R, at, kinds);
    }
    if (!f) return false;
    s.alive = at.slice(); at.forEach(i => s.face[i] = f[i]); return true;
  }
  function deal(R, alive, kindsIn) {
    for (let tries = 0; tries < 200; tries++) {
      const left = alive.slice(), face = {}; let k = 0, ok = true;
      const kinds = kindsIn ? kindsIn.slice() : []; if (!kindsIn) for (let p = 0; p < alive.length / 2; p++) kinds.push(p % FACES.length);
      for (let i = kinds.length - 1; i > 0; i--) { const j = Math.floor(R() * (i + 1)); [kinds[i], kinds[j]] = [kinds[j], kinds[i]]; }
      while (left.length) {
        const free = left.filter(i => isFree(i, left)); if (free.length < 2) { ok = false; break; }
        const a = free.splice(Math.floor(R() * free.length), 1)[0], b = free[Math.floor(R() * free.length)];
        face[a] = face[b] = kinds[k++]; left.splice(left.indexOf(a), 1); left.splice(left.indexOf(b), 1);
      }
      if (ok) return face;
    }
    return null;
  }
  // Chill scoring: solving is most of it; a speed bonus fades over a few minutes and never goes negative.
  const speed = (sec, limit, pts) => Math.round(pts * Math.max(0, 1 - sec / limit));
  const scoreOf = s => Math.max(100, 1000 + speed(s.el, 600, 500) - Math.round(s.pen * 1.5));
  defGame({
    key: "mahjong", name: "Dawg Mahjong", icon: "🀄", max: 1500, cat: "den", puzzle: true,
    blurb: "Daily: match pairs to clear the board.",
    how: "Clear the board by matching pairs of the same tile. You can only take a tile that's free: nothing stacked on top of it, and its left or right side open. Free tiles are bright; blocked ones are shaded. Stuck? Hint shows a pair and Shuffle mixes the tiles left; each costs a few points. Same board for everyone, one go per day, always solvable. Score: 1000 for clearing the board, plus a bonus of up to 500 for going quick, minus a little for each hint or shuffle. No clock on screen, so take your time.",
    reset(G) {
      const s = G.s = { btns: [], sel: -1, msg: "", msgT: 0, postT: 0, hint: null };
      const r = store.get(rk());
      if (r && r.face) Object.assign(s, { face: r.face, alive: r.alive.slice(), el: r.el || 0, pen: r.pen || 0, done: !!r.done, posted: !!r.posted, shuf: r.shuf || 0 });
      else { const all = POS.map((p, i) => i), f = deal(rng("dawg-mahjong-" + KEY), all), face = all.map(i => f[i]); Object.assign(s, { face, alive: all, el: 0, pen: 0, done: false, posted: false, shuf: 0 }); }
    },
    persist(G) { const s = G.s; store.set(rk(), { face: s.face, alive: s.alive, el: s.el, pen: s.pen, done: s.done, posted: s.posted, shuf: s.shuf, score: s.done ? scoreOf(s) : 0 }); },
    info(G) { const s = G.s, t = s.el + s.pen, sc = scoreOf(s); return { score: sc, title: t < 180 ? "Cleared! Speedy 🐶" : "Board cleared! 🀄", sub: `${mmss(t)}${s.pen ? " · with a little help" : ""} · ${sc} pts.`, share: `Dawg Mahjong #${dayN() + 1} · ${mmss(t)} 🀄` }; },
    moves(s) { const free = s.alive.filter(i => isFree(i, s.alive)), out = []; for (let a = 0; a < free.length; a++) for (let b = a + 1; b < free.length; b++) if (s.face[free[a]] === s.face[free[b]]) out.push([free[a], free[b]]); return out; },
    pick(G, i) {
      const s = G.s; s.hint = null;
      if (!isFree(i, s.alive)) { s.msg = "That tile is blocked"; s.msgT = 0.9; G.buzz(); return; }
      if (s.sel < 0 || s.sel === i) { s.sel = s.sel === i ? -1 : i; return; }
      if (s.face[s.sel] !== s.face[i]) { s.sel = i; return; }
      s.alive = s.alive.filter(j => j !== i && j !== s.sel); s.sel = -1; G.sfx("pop");
      if (!s.alive.length) { s.done = true; s.postT = 1.2; G.sfx("win"); s.msg = "Board cleared! 🐶"; s.msgT = 1.6; }
      else if (!this.moves(s).length) { this.shuffle(G, true); s.msg = "No matches left, so we reshuffled"; s.msgT = 2; }
      this.persist(G);
    },
    shuffle(G, free) {
      const s = G.s; s.shuf++; if (!free) s.pen += 30; s.sel = -1; s.hint = null;
      // same tiles, new spots, and still clearable: re-deal the remaining pairs onto the remaining positions
      redeal(s, rng("dawg-mahjong-" + KEY + "-" + s.shuf + "-" + s.alive.length));
      s.msg = "Shuffled"; s.msgT = 1.2; this.persist(G);
    },
    update(G, dt) {
      const s = G.s; if (s.msgT > 0) s.msgT -= dt; if (s.hint && (s.hint.t -= dt) <= 0) s.hint = null;
      if (!s.done) { s.el += dt; s.ck = (s.ck || 0) + dt; if (s.ck > 2) { s.ck = 0; this.persist(G); } }
      if (s.done && !s.posted && s.postT > 0) { s.postT -= dt; if (s.postT <= 0) { s.posted = true; this.persist(G); G.post(scoreOf(s), this.info(G)); } }
    },
    geo(G) {
      const tw = Math.min((G.W - 28) / 8.3, (G.H - 190) / 6 / 1.28), th = tw * 1.28, dep = Math.max(3, tw * 0.09);
      const ox = (G.W - 8 * tw) / 2 + dep * 1.5, oy = 52 + dep * 3;
      return { tw, th, dep, ox, oy };
    },
    draw(G, c) {
      const s = G.s, dk = G.dark(), ink = dk ? "#fff" : "#121213", g = this.geo(G);
      c.fillStyle = dk ? "#121213" : "#fff"; c.fillRect(0, 0, G.W, G.H); s.btns = [];
      c.fillStyle = ink; c.font = `500 15px ${G.UI}`; c.textAlign = "left"; c.textBaseline = "middle";
      c.fillText(s.done ? "Board cleared! 🐶" : `${s.alive.length} tiles left`, 14, 22);
      const order = s.alive.slice().sort((a, b) => POS[a][2] - POS[b][2] || POS[a][1] - POS[b][1] || POS[a][0] - POS[b][0]);
      const hint = s.hint ? new Set(s.hint.pair) : null;
      order.forEach(i => {
        const [col, row, l] = POS[i], x = g.ox + col * g.tw - l * g.dep, y = g.oy + row * g.th - l * g.dep, free = isFree(i, s.alive), sel = s.sel === i;
        c.fillStyle = dk ? "#5b4a33" : "#c9b48a"; rr(c, x + g.dep, y + g.dep, g.tw - 2, g.th - 2, 6); c.fill();
        c.fillStyle = sel ? "#ffd23f" : hint && hint.has(i) ? "#b6f0c2" : BG[s.face[i] % BG.length]; rr(c, x, y, g.tw - 2, g.th - 2, 6); c.fill();
        c.strokeStyle = sel ? "#e0a800" : "rgba(0,0,0,0.28)"; c.lineWidth = sel ? 2.5 : 1; c.stroke();
        G.emoji(c, FACES[s.face[i]], x + (g.tw - 2) / 2, y + (g.th - 2) / 2 + 1, g.tw * 0.62);
        if (!free) { c.fillStyle = "rgba(20,20,30,0.32)"; rr(c, x, y, g.tw - 2, g.th - 2, 6); c.fill(); }
      });
      // hit order: top layer first
      s.hit = order.slice().reverse().map(i => { const [col, row, l] = POS[i]; return { i, x: g.ox + col * g.tw - l * g.dep, y: g.oy + row * g.th - l * g.dep, w: g.tw - 2, h: g.th - 2 }; });
      const by = g.oy + 6 * g.th + 18, bw = (G.W - 48) / 3;
      if (!s.done) {
        s.btns.push(Object.assign(G.pill(c, 16, by, bw, 46, "Hint"), { k: "hint" }));
        s.btns.push(Object.assign(G.pill(c, 24 + bw, by, bw, 46, "Shuffle"), { k: "shuf" }));
        c.fillStyle = dk ? "#aaa" : "#666"; c.font = `500 13px ${G.UI}`; c.textAlign = "center"; c.fillText(`${this.moves(s).length} matches open`, 32 + 2.5 * bw, by + 23);
      } else if (s.posted) { const w = Math.min(260, G.W - 40); s.btns.push(Object.assign(G.pill(c, G.W / 2 - w / 2, by, w, 46, `See results · ${mmss(s.el + s.pen)}`, true), { k: "res" })); }
      if (s.msgT > 0 && s.msg) { c.save(); c.globalAlpha = Math.min(1, s.msgT * 2); c.font = `600 15px ${G.UI}`; c.textAlign = "center"; const w = c.measureText(s.msg).width + 30; c.fillStyle = dk ? "#fff" : "#121213"; rr(c, G.W / 2 - w / 2, 34, w, 34, 8); c.fill(); c.fillStyle = dk ? "#121213" : "#fff"; c.fillText(s.msg, G.W / 2, 51); c.restore(); }
    },
    tap(G, x, y) {
      const s = G.s, b = s.btns.find(b => x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h);
      if (b) { if (b.k === "res") return G.results(this.info(G)); if (s.done) return;
        if (b.k === "hint") { const m = this.moves(s); if (!m.length) { s.msg = "No matches. Tap Shuffle."; s.msgT = 1.5; return; } s.pen += 15; s.hint = { pair: m[Math.floor(Math.random() * m.length)], t: 2.5 }; this.persist(G); return; }
        if (b.k === "shuf") return this.shuffle(G); return; }
      if (s.done || !s.hit) return;
      const t = s.hit.find(h => x >= h.x && x <= h.x + h.w && y >= h.y && y <= h.y + h.h); if (t) this.pick(G, t.i);
    }
  });
})();
