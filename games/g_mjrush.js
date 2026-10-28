// ---------- Mahjong Rush (Arcade: endless tile matching against the clock) ----------
// Clear board after board before the clock runs out. Every match adds time; quick matches build a combo;
// clearing a board is a big time + score bonus and deals a bigger, faster next board.
(function () {
  const FACES = ["🐶", "🦴", "🎾", "🐾", "🏈", "⚾", "🏀", "⚽", "🏒", "⛳", "🌭", "🍕", "🍔", "🌮", "🍩", "🍪", "🧀", "🥨", "🍿", "🏆"];
  const BG = ["#fff4d6", "#e8f4ff", "#eaf7e4", "#fde8ef", "#efe8ff"];
  // layout in tile units: [col, row, layer]
  const POS = [];
  for (let r = 0; r < 6; r++) for (let c = 0; c < 8; c++) if (!((r === 0 || r === 5) && (c === 0 || c === 7))) POS.push([c, r, 0]);
  for (let r = 1; r < 5; r++) for (let c = 1; c < 7; c++) POS.push([c, r, 1]);
  for (let r = 2; r < 4; r++) for (let c = 2; c < 6; c++) POS.push([c, r, 2]);
  POS.push([3, 2.5, 3], [4, 2.5, 3]);
  const _unused = () => { const [y, m, d] = KEY.split("-").map(Number); return Math.round((Date.UTC(y, m - 1, d) - Date.UTC(2026, 9, 27)) / 864e5); };
  const _rk = () => "bdd:den:mahjong:" + KEY + ":" + (me ? me.id : "");
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

  const START = 90;
  defGame({
    key: "mjrush", name: "Mahjong Rush", icon: "🀄", max: 999999,
    blurb: "Endless tile matching vs the clock.",
    how: "Match pairs of free tiles (nothing on top, left or right side open) before the clock runs out. Every match adds 2 seconds. Match again within 3 seconds to build a combo (x2, x3, up to x5) for bigger points. Clear the board for +25 seconds and a level bonus, then a new board deals. Out of matches? Shuffle is free but costs 5 seconds. Hint costs 5 seconds too.",
    reset(G) {
      G.s = { level: 0, score: 0, time: START, combo: 0, lastMatch: -99, t: 0, sel: -1, hint: null, msg: "", msgT: 0, btns: [], pops: [], best: 0 };
      this.newBoard(G);
    },
    newBoard(G) {
      const s = G.s; s.level++; const all = POS.map((p, i) => i), R = rng("rush" + Math.random());
      const f = deal(R, all); s.face = all.map(i => f[i]); s.alive = all; s.sel = -1; s.hint = null;
      s.msg = s.level > 1 ? `Level ${s.level}!` : "Go!"; s.msgT = 1.3;
    },
    moves(s) { const free = s.alive.filter(i => isFree(i, s.alive)), out = []; for (let a = 0; a < free.length; a++) for (let b = a + 1; b < free.length; b++) if (s.face[free[a]] === s.face[free[b]]) out.push([free[a], free[b]]); return out; },
    shuffle(G, paid) {
      const s = G.s; if (paid) s.time -= 5; s.sel = -1; s.hint = null;
      redeal(s, rng("rs" + Math.random()));
      s.msg = paid ? "Shuffled −5s" : "No matches: shuffled"; s.msgT = 1.1;
    },
    pick(G, i) {
      const s = G.s; s.hint = null;
      if (!isFree(i, s.alive)) { G.buzz(); return; }
      if (s.sel < 0 || s.sel === i) { s.sel = s.sel === i ? -1 : i; return; }
      if (s.face[s.sel] !== s.face[i]) { s.sel = i; return; }
      const quick = s.t - s.lastMatch < 3; s.combo = quick ? Math.min(5, s.combo + 1) : 1; s.lastMatch = s.t;
      const pts = 10 * s.combo * s.level; s.score += pts; s.time = Math.min(s.time + 2, 180);
      const h = s.hit && s.hit.find(x => x.i === i); if (h) s.pops.push({ x: h.x + h.w / 2, y: h.y, txt: `+${pts}${s.combo > 1 ? " x" + s.combo : ""}`, t: 0.9 });
      s.alive = s.alive.filter(j => j !== i && j !== s.sel); s.sel = -1; G.sfx("pop");
      if (!s.alive.length) { const bonus = 250 * s.level + Math.floor(s.time) * 5; s.score += bonus; s.time = Math.min(s.time + 25, 180); G.sfx("win"); s.msg = `Board clear! +${bonus}`; s.msgT = 1.6; s.wait = 1.2; return; }
      if (!this.moves(s).length) this.shuffle(G, false);
    },
    update(G, dt) {
      const s = G.s; s.t += dt; if (s.msgT > 0) s.msgT -= dt; if (s.hint && (s.hint.t -= dt) <= 0) s.hint = null;
      s.pops.forEach(p => { p.t -= dt; p.y -= 30 * dt; }); s.pops = s.pops.filter(p => p.t > 0);
      if (s.wait > 0) { s.wait -= dt; if (s.wait <= 0) this.newBoard(G); return; }
      s.time -= dt * (1 + (s.level - 1) * 0.12); // later levels drain a little faster
      if (s.t - s.lastMatch > 3) s.combo = 0;
      if (s.time <= 0) { s.time = 0; G.sfx("lose"); G.over(s.score, `Level ${s.level} · out of time`); }
    },
    geo(G) {
      const tw = Math.min((G.W - 28) / 8.3, (G.H - 200) / 6 / 1.28), th = tw * 1.28, dep = Math.max(3, tw * 0.09);
      return { tw, th, dep, ox: (G.W - 8 * tw) / 2 + dep * 1.5, oy: 84 + dep * 3 };
    },
    draw(G, c) {
      const s = G.s, g = this.geo(G);
      const bg = c.createLinearGradient(0, 0, 0, G.H); bg.addColorStop(0, "#14532d"); bg.addColorStop(1, "#0b2e1a"); c.fillStyle = bg; c.fillRect(0, 0, G.W, G.H);
      G.hud(c, `SCORE ${s.score}`, `LEVEL ${s.level}`, s.combo > 1 ? `COMBO x${s.combo}` : "");
      // time bar
      const bw = G.W - 24, frac = Math.max(0, Math.min(1, s.time / 120));
      c.fillStyle = "rgba(255,255,255,0.15)"; rr(c, 12, 46, bw, 14, 7); c.fill();
      c.fillStyle = s.time < 15 ? "#ff5252" : s.time < 35 ? "#ffd23f" : "#69f0ae"; rr(c, 12, 46, Math.max(14, bw * frac), 14, 7); c.fill();
      G.text(c, `${Math.ceil(s.time)}s`, G.W / 2, 72, 10, "#fff");
      const order = s.alive.slice().sort((a, b) => POS[a][2] - POS[b][2] || POS[a][1] - POS[b][1] || POS[a][0] - POS[b][0]), hint = s.hint ? new Set(s.hint.pair) : null;
      order.forEach(i => {
        const [col, row, l] = POS[i], x = g.ox + col * g.tw - l * g.dep, y = g.oy + row * g.th - l * g.dep, free = isFree(i, s.alive), sel = s.sel === i;
        c.fillStyle = "#8a7350"; rr(c, x + g.dep, y + g.dep, g.tw - 2, g.th - 2, 6); c.fill();
        c.fillStyle = sel ? "#ffd23f" : hint && hint.has(i) ? "#b6f0c2" : BG[s.face[i] % BG.length]; rr(c, x, y, g.tw - 2, g.th - 2, 6); c.fill();
        c.strokeStyle = sel ? "#e0a800" : "rgba(0,0,0,0.3)"; c.lineWidth = sel ? 2.5 : 1; c.stroke();
        G.emoji(c, FACES[s.face[i]], x + (g.tw - 2) / 2, y + (g.th - 2) / 2 + 1, g.tw * 0.62);
        if (!free) { c.fillStyle = "rgba(10,30,15,0.38)"; rr(c, x, y, g.tw - 2, g.th - 2, 6); c.fill(); }
      });
      s.hit = order.slice().reverse().map(i => { const [col, row, l] = POS[i]; return { i, x: g.ox + col * g.tw - l * g.dep, y: g.oy + row * g.th - l * g.dep, w: g.tw - 2, h: g.th - 2 }; });
      s.pops.forEach(p => { c.globalAlpha = Math.min(1, p.t * 2); G.text(c, p.txt, p.x, p.y, 11, "#ffd23f"); c.globalAlpha = 1; });
      const by = g.oy + 6 * g.th + 16, w2 = (G.W - 40) / 2; s.btns = [];
      [["HINT −5s", "hint"], ["SHUFFLE −5s", "shuf"]].forEach(([t, k], i) => { const x = 16 + i * (w2 + 8); c.fillStyle = "rgba(255,255,255,0.92)"; rr(c, x, by, w2, 44, 22); c.fill(); G.text(c, t, x + w2 / 2, by + 22, 10, "#14532d"); s.btns.push({ x, y: by, w: w2, h: 44, k }); });
      if (s.msgT > 0 && s.msg) G.banner(c, s.msg, "#ffd23f", G.H * 0.42, 18);
      G.hint(c, "MATCH FREE PAIRS · BEAT THE CLOCK", 4, by + 70);
    },
    tap(G, x, y) {
      const s = G.s; if (s.wait > 0) return;
      const b = s.btns.find(b => x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h);
      if (b) { if (b.k === "shuf") return this.shuffle(G, true); const m = this.moves(s); if (m.length) { s.time -= 5; s.hint = { pair: m[Math.floor(Math.random() * m.length)], t: 2 }; } return; }
      const t = s.hit && s.hit.find(h => x >= h.x && x <= h.x + h.w && y >= h.y && y <= h.y + h.h); if (t) this.pick(G, t.i);
    }
  });

  // ---------- Mahjong Zen: the relaxed version. No clock, board after board, play as long as you like. ----------
  defGame({
    key: "mjzen", name: "Mahjong Zen", icon: "🍵", max: 999999,
    blurb: "Relaxed endless tile matching. No clock.",
    how: "The relaxed one: no clock, ever. Match pairs of free tiles (nothing on top, and the left or right side open). Clear a board and a new one deals. Hints and shuffles are free, and it reshuffles for you if you run out of matches. Leave any time; your board is saved. Tap Finish when you want to post your score: 10 per match and 200 per board cleared.",
    save(G) { const s = G.s; return { label: `Board ${s.level} · ${s.score} pts`, v: { level: s.level, score: s.score, face: s.face, alive: s.alive, cleared: s.cleared } }; },
    load(G, sv) { Object.assign(G.s, sv.v); G.s.msg = "Welcome back"; G.s.msgT = 1.2; },
    reset(G) { G.s = { level: 0, score: 0, cleared: 0, t: 0, sel: -1, hint: null, msg: "", msgT: 0, btns: [], pops: [] }; this.newBoard(G); },
    newBoard(G) { const s = G.s; s.level++; const all = POS.map((p, i) => i), f = deal(rng("zen" + Math.random()), all); s.face = all.map(i => f[i]); s.alive = all; s.sel = -1; s.hint = null; s.msg = s.level > 1 ? `Board ${s.level}` : "Take your time 🍵"; s.msgT = 1.4; },
    moves(s) { const free = s.alive.filter(i => isFree(i, s.alive)), out = []; for (let a = 0; a < free.length; a++) for (let b = a + 1; b < free.length; b++) if (s.face[free[a]] === s.face[free[b]]) out.push([free[a], free[b]]); return out; },
    pick(G, i) {
      const s = G.s; s.hint = null;
      if (!isFree(i, s.alive)) { G.buzz(); return; }
      if (s.sel < 0 || s.sel === i) { s.sel = s.sel === i ? -1 : i; return; }
      if (s.face[s.sel] !== s.face[i]) { s.sel = i; return; }
      s.score += 10; s.alive = s.alive.filter(j => j !== i && j !== s.sel); s.sel = -1; G.sfx("pop");
      if (!s.alive.length) { s.cleared++; s.score += 200; G.sfx("win"); s.msg = "Board cleared! +200"; s.msgT = 1.6; s.wait = 1.4; return; }
      if (!this.moves(s).length) { redeal(s, rng("zs" + Math.random())); s.msg = "Reshuffled for you"; s.msgT = 1.3; }
    },
    update(G, dt) {
      const s = G.s; s.t += dt; if (s.msgT > 0) s.msgT -= dt; if (s.hint && (s.hint.t -= dt) <= 0) s.hint = null;
      if (s.wait > 0) { s.wait -= dt; if (s.wait <= 0) this.newBoard(G); }
    },
    geo(G) { const tw = Math.min((G.W - 28) / 8.3, (G.H - 190) / 6 / 1.28), th = tw * 1.28, dep = Math.max(3, tw * 0.09); return { tw, th, dep, ox: (G.W - 8 * tw) / 2 + dep * 1.5, oy: 56 + dep * 3 }; },
    draw(G, c) {
      const s = G.s, g = this.geo(G);
      const bg = c.createLinearGradient(0, 0, 0, G.H); bg.addColorStop(0, "#2f4f4f"); bg.addColorStop(1, "#1f3535"); c.fillStyle = bg; c.fillRect(0, 0, G.W, G.H);
      G.hud(c, `SCORE ${s.score}`, `BOARD ${s.level}`, `${s.alive.length} LEFT`);
      const order = s.alive.slice().sort((a, b) => POS[a][2] - POS[b][2] || POS[a][1] - POS[b][1] || POS[a][0] - POS[b][0]), hint = s.hint ? new Set(s.hint.pair) : null;
      order.forEach(i => {
        const [col, row, l] = POS[i], x = g.ox + col * g.tw - l * g.dep, y = g.oy + row * g.th - l * g.dep, free = isFree(i, s.alive), sel = s.sel === i;
        c.fillStyle = "#8a7350"; rr(c, x + g.dep, y + g.dep, g.tw - 2, g.th - 2, 6); c.fill();
        c.fillStyle = sel ? "#ffd23f" : hint && hint.has(i) ? "#b6f0c2" : BG[s.face[i] % BG.length]; rr(c, x, y, g.tw - 2, g.th - 2, 6); c.fill();
        c.strokeStyle = sel ? "#e0a800" : "rgba(0,0,0,0.3)"; c.lineWidth = sel ? 2.5 : 1; c.stroke();
        G.emoji(c, FACES[s.face[i]], x + (g.tw - 2) / 2, y + (g.th - 2) / 2 + 1, g.tw * 0.62);
        if (!free) { c.fillStyle = "rgba(10,25,25,0.38)"; rr(c, x, y, g.tw - 2, g.th - 2, 6); c.fill(); }
      });
      s.hit = order.slice().reverse().map(i => { const [col, row, l] = POS[i]; return { i, x: g.ox + col * g.tw - l * g.dep, y: g.oy + row * g.th - l * g.dep, w: g.tw - 2, h: g.th - 2 }; });
      const by = g.oy + 6 * g.th + 16, w3 = (G.W - 48) / 3; s.btns = [];
      [["HINT", "hint"], ["SHUFFLE", "shuf"], ["FINISH", "fin"]].forEach(([tx, k], i) => { const x = 16 + i * (w3 + 8); c.fillStyle = k === "fin" ? "#ffd23f" : "rgba(255,255,255,0.92)"; rr(c, x, by, w3, 44, 22); c.fill(); G.text(c, tx, x + w3 / 2, by + 22, 10, "#1f3535"); s.btns.push({ x, y: by, w: w3, h: 44, k }); });
      if (s.msgT > 0 && s.msg) G.banner(c, s.msg, "#ffd23f", G.H * 0.42, 18);
      G.hint(c, "NO CLOCK · TAP FINISH TO POST YOUR SCORE", 5, by + 70);
    },
    tap(G, x, y) {
      const s = G.s; if (s.wait > 0) return;
      const b = s.btns.find(b => x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h);
      if (b) {
        if (b.k === "fin") return G.over(s.score, s.cleared ? `${s.cleared} board${s.cleared > 1 ? "s" : ""} cleared 🍵` : "Nice and easy 🍵");
        if (b.k === "shuf") { redeal(s, rng("zs" + Math.random())); s.sel = -1; s.msg = "Shuffled"; s.msgT = 1; return; }
        const m = this.moves(s); if (m.length) s.hint = { pair: m[Math.floor(Math.random() * m.length)], t: 2.5 }; return;
      }
      const tl = s.hit && s.hit.find(h => x >= h.x && x <= h.x + h.w && y >= h.y && y <= h.y + h.h); if (tl) this.pick(G, tl.i);
    }
  });
})();
