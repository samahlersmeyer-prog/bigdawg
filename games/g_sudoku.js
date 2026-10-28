// ---------- Dawg Sudoku (The Den, daily) ----------
// Three daily sudokus (Easy / Medium / Hard), same for everyone. One try each per day; your best counts.
(function () {
  const DIFF = [["EASY", 1000, 38], ["MEDIUM", 2000, 30], ["HARD", 3000, 25]];
  const dayIdx = () => { const [y, m, d] = KEY.split("-").map(Number); return Math.round((Date.UTC(y, m - 1, d) - Date.UTC(2026, 9, 26)) / 864e5); };
  const rk = d => "bdd:den:sudoku:" + KEY + ":" + d + ":" + (me ? me.id : "");
  const rr = (c, x, y, w, h, r) => { c.beginPath(); if (c.roundRect) c.roundRect(x, y, w, h, r); else c.rect(x, y, w, h); };
  const RC = []; for (let i = 0; i < 81; i++) { const r = Math.floor(i / 9), cc = i % 9, b = Math.floor(r / 3) * 3 + Math.floor(cc / 3); RC.push([r, cc, b]); }
  const PEERS = RC.map(([r, cc, b], i) => RC.map((x, j) => j).filter(j => j !== i && (RC[j][0] === r || RC[j][1] === cc || RC[j][2] === b)));
  function rng(str) { let h = 1779033703 ^ str.length; for (let i = 0; i < str.length; i++) { h = Math.imul(h ^ str.charCodeAt(i), 3432918353); h = h << 13 | h >>> 19; }
    let a = h >>> 0; return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  // count solutions (stops at lim); fills g in place with the first solution if fill=true
  function solve(g, lim, rand) {
    let n = 0; const rows = new Array(9).fill(0), cols = new Array(9).fill(0), boxes = new Array(9).fill(0);
    for (let i = 0; i < 81; i++) if (g[i]) { const m = 1 << g[i], [r, cc, b] = RC[i]; rows[r] |= m; cols[cc] |= m; boxes[b] |= m; }
    const out = g.slice();
    (function go() {
      let best = -1, bm = 0, bc = 10;
      for (let i = 0; i < 81; i++) if (!g[i]) { const [r, cc, b] = RC[i], m = ~(rows[r] | cols[cc] | boxes[b]) & 0x3fe; let k = 0; for (let x = m; x; x &= x - 1) k++; if (k < bc) { bc = k; best = i; bm = m; if (k <= 1) break; } }
      if (best < 0) { if (!n && rand) for (let i = 0; i < 81; i++) out[i] = g[i]; n++; return; }
      const ds = []; for (let d = 1; d <= 9; d++) if (bm & (1 << d)) ds.push(d);
      if (rand) for (let i = ds.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [ds[i], ds[j]] = [ds[j], ds[i]]; }
      const [r, cc, b] = RC[best];
      for (const d of ds) { const m = 1 << d; g[best] = d; rows[r] |= m; cols[cc] |= m; boxes[b] |= m; go(); rows[r] &= ~m; cols[cc] &= ~m; boxes[b] &= ~m; g[best] = 0; if (n >= lim) return; }
    })();
    return { n, out };
  }
  function makePuzzle(d) {
    const rand = rng("dawg-sudoku-" + KEY + "-" + d), sol = solve(new Array(81).fill(0), 1, rand).out, g = sol.slice();
    const order = [...Array(81).keys()]; for (let i = 80; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [order[i], order[j]] = [order[j], order[i]]; }
    let clues = 81;
    for (const i of order) { if (clues <= DIFF[d][2]) break; const v = g[i]; g[i] = 0; if (solve(g.slice(), 2).n !== 1) g[i] = v; else clues--; }
    return { sol, giv: g };
  }
  // Chill scoring: solving is most of it; a speed bonus fades over a few minutes and never goes negative.
  const speed = (sec, limit, pts) => Math.round(pts * Math.max(0, 1 - sec / limit));
  const LIM = [900, 1500, 2400];
  const scoreOf = (d, st) => Math.max(Math.round(DIFF[d][1] * 0.3), Math.round(DIFF[d][1] * 0.7) + speed(st.el, LIM[d], DIFF[d][1] * 0.3) - Math.round(DIFF[d][1] * 0.03) * st.mist);
  defGame({
    key: "sudoku", name: "Dawg Sudoku", icon: "🔢", max: 3000, cat: "den", puzzle: true,
    blurb: "Daily: Easy, Medium and Hard sudoku.",
    how: "Three new sudokus every day, the same for everyone. Fill the grid so every row, column and 3x3 box has 1-9. Tap a square, then a number. NOTES lets you pencil in options. A wrong number counts as a mistake. One try at each per day; your progress is saved if you leave. Score: solving is worth most of Easy 1000 / Medium 2000 / Hard 3000, with a small bonus for going quick and a small cost per mistake. No clock on screen, so take your time. Your best of the three counts.",
    reset(G) { this.reset0(G); const cur = typeof store !== "undefined" && me ? store.get(this.curKey()) : null; if (cur !== null && cur !== undefined && !(this.rec(cur) || {}).done && this.rec(cur)) this.open(G, cur); },
    reset0(G) { G.s = { phase: "pick", btns: [], sel: -1, notes: false, msg: "", msgT: 0, bad: -1, badT: 0, endT: 0 }; },
    rec(d) { return store.get(rk(d)); },
    curKey() { return rk("cur"); },
    info(d) {
      const r = this.rec(d) || {}, t = Math.floor(r.el || 0), mm = `${Math.floor(t / 60)}:${String(t % 60).padStart(2, "0")}`, nm = DIFF[d][0][0] + DIFF[d][0].slice(1).toLowerCase();
      const done = [0, 1, 2].filter(k => (this.rec(k) || {}).done).length;
      const nx = [d + 1, d + 2, d - 1, d - 2].map(k => (k + 3) % 3).find(k => k !== d && !(this.rec(k) || {}).done);
      const next = nx === undefined ? null : { label: `Play ${DIFF[nx][0][0] + DIFF[nx][0].slice(1).toLowerCase()} →`, go: () => this.open(G, nx) };
      return { next, score: r.score || 0, title: `${nm} solved!`, sub: `${mm}${r.mist ? `, ${r.mist} mistake${r.mist > 1 ? "s" : ""}` : ""} · ${r.score || 0} pts. ${done === 3 ? "All three done today. 🐶" : `${done} of 3 done today.`}`, share: `Dawg Sudoku #${dayIdx() + 1} · ${nm} ${mm}${r.mist ? ` (${r.mist}✗)` : ""}` };
    },
    open(G, d) {
      const s = G.s, r = this.rec(d);
      if (r && r.done) return G.results(this.info(d));
      try { store.set(this.curKey(), d); } catch (e) {}
      const p = makePuzzle(d);
      Object.assign(s, { phase: "play", d, sol: p.sol, giv: p.giv, g: r && r.g ? r.g.slice() : p.giv.slice(), n: r && r.n ? r.n.slice() : new Array(81).fill(0), el: r ? r.el : 0, mist: r ? r.mist : 0, sel: -1, notes: false });
      G.sfx("pop");
    },
    persist(G, extra) { const s = G.s; store.set(rk(s.d), Object.assign({ g: s.g, n: s.n, el: s.el, mist: s.mist }, extra || {})); },
    put(G, v) {
      const s = G.s, i = s.sel; if (i < 0 || s.giv[i] || s.phase !== "play") return;
      if (v === 0) { s.g[i] = 0; s.n[i] = 0; return this.persist(G); }
      if (s.notes) { if (!s.g[i]) s.n[i] ^= 1 << v; return this.persist(G); }
      if (s.g[i] === v) return;
      if (s.sol[i] !== v) { s.mist++; s.bad = i; s.badV = v; s.badT = 0.8; G.buzz(); s.msg = "Not quite! +30s"; s.msgT = 1.2; return this.persist(G); }
      s.g[i] = v; s.n[i] = 0; PEERS[i].forEach(j => s.n[j] &= ~(1 << v)); G.sfx("pop");
      if (s.g.every((x, k) => x === s.sol[k])) { s.phase = "won"; s.endT = 1.3; const sc = scoreOf(s.d, s); s.final = sc; this.persist(G, { done: true, score: sc }); G.sfx("win"); }
      else this.persist(G);
    },
    update(G, dt) {
      const s = G.s; if (s.msgT > 0) s.msgT -= dt; if (s.badT > 0) s.badT -= dt;
      if (s.phase === "play") { s.el += dt; s.ck = (s.ck || 0) + dt; if (s.ck > 2) { s.ck = 0; this.persist(G); } }
      if (s.phase === "won") { s.endT -= dt; if (s.endT <= 0) { s.phase = "pick"; s.sel = -1; try { store.set(this.curKey(), null); } catch (e) {} G.post(s.final, this.info(s.d)); } }
    },
    draw(G, c) {
      const s = G.s, dk = G.dark(), fg = dk ? "#fff" : "#111";
      c.fillStyle = dk ? "#121213" : "#ffffff"; c.fillRect(0, 0, G.W, G.H); s.btns = [];
      if (s.phase === "pick") {
        c.fillStyle = fg; c.textAlign = "center"; c.textBaseline = "middle"; c.font = `700 26px ${G.TITLE}`; c.fillText("Today's puzzles", G.W / 2, 44);
        c.font = `400 14px ${G.UI}`; c.fillStyle = dk ? "#aaa" : "#6b6b6b"; c.fillText("Same for everyone. One go at each.", G.W / 2, 72);
        const bw = Math.min(340, G.W - 32);
        DIFF.forEach(([nm], d) => {
          const r = this.rec(d), y = 100 + d * 92, x = G.W / 2 - bw / 2, label = nm[0] + nm.slice(1).toLowerCase();
          c.fillStyle = [dk ? "#22382a" : "#e3f1e0", dk ? "#3a3420" : "#fbefc9", dk ? "#3d2629" : "#f6dcdc"][d]; rr(c, x, y, bw, 78, 14); c.fill();
          c.textAlign = "left"; c.fillStyle = fg; c.font = `700 22px ${G.TITLE}`; c.fillText(label, x + 18, y + 28);
          c.font = `400 14px ${G.UI}`; c.fillStyle = dk ? "#ccc" : "#444";
          c.fillText(r && r.done ? `Solved · ${r.score} pts` : r ? "In progress" : `Up to ${DIFF[d][1]} pts`, x + 18, y + 54);
          G.pill(c, x + bw - 100, y + 19, 86, 40, r && r.done ? "Results" : r ? "Resume" : "Play", !(r && r.done));
          s.btns.push({ x, y, w: bw, h: 78, d });
        });
      } else {
        const N = Math.min(G.W - 16, G.H - 230), cs = N / 9, ox = (G.W - N) / 2, oy = 44;
        G.pbar(c, DIFF[s.d][0][0] + DIFF[s.d][0].slice(1).toLowerCase(), "", s.mist ? `Mistakes: ${s.mist}` : "");
        const sv = s.sel >= 0 ? s.g[s.sel] : 0;
        for (let i = 0; i < 81; i++) {
          const [r, cc, b] = RC[i], x = ox + cc * cs, y = oy + r * cs;
          let bg = dk ? "#1e1e22" : "#fff";
          if (s.sel >= 0) { const [sr, sc, sb] = RC[s.sel]; if (r === sr || cc === sc || b === sb) bg = dk ? "#2c2c36" : "#e8eef8"; if (sv && s.g[i] === sv) bg = dk ? "#3d4766" : "#c9d8f2"; if (i === s.sel) bg = dk ? "#5a6aa0" : "#a9c3f0"; }
          if (s.phase !== "play") bg = dk ? "#22382a" : "#e6f4e6";
          c.fillStyle = bg; c.fillRect(x, y, cs, cs);
          const v = s.g[i];
          if (v) { c.fillStyle = s.giv[i] ? fg : (dk ? "#8fb4ff" : "#2456c8"); c.font = `${s.giv[i] ? 700 : 500} ${Math.round(cs * 0.6)}px system-ui, sans-serif`; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText(v, x + cs / 2, y + cs / 2 + 1); }
          else if (s.n[i]) { c.fillStyle = dk ? "#aaa" : "#666"; c.font = `500 ${Math.round(cs * 0.26)}px system-ui, sans-serif`; c.textAlign = "center"; c.textBaseline = "middle";
            for (let k = 1; k <= 9; k++) if (s.n[i] & (1 << k)) c.fillText(k, x + ((k - 1) % 3 + 0.5) * cs / 3, y + (Math.floor((k - 1) / 3) + 0.5) * cs / 3 + 1); }
          if (i === s.bad && s.badT > 0) { c.fillStyle = "rgba(230,40,40,0.35)"; c.fillRect(x, y, cs, cs); c.fillStyle = "#e53935"; c.font = `700 ${Math.round(cs * 0.6)}px system-ui, sans-serif`; c.textAlign = "center"; c.fillText(s.badV, x + cs / 2, y + cs / 2 + 1); }
        }
        c.strokeStyle = dk ? "#444" : "#c8c8c8"; c.lineWidth = 1;
        for (let k = 1; k < 9; k++) if (k % 3) { c.beginPath(); c.moveTo(ox + k * cs, oy); c.lineTo(ox + k * cs, oy + N); c.moveTo(ox, oy + k * cs); c.lineTo(ox + N, oy + k * cs); c.stroke(); }
        c.strokeStyle = fg; c.lineWidth = 2.5; for (let k = 0; k <= 9; k += 3) { c.beginPath(); c.moveTo(ox + k * cs, oy); c.lineTo(ox + k * cs, oy + N); c.moveTo(ox, oy + k * cs); c.lineTo(ox + N, oy + k * cs); c.stroke(); }
        s.btns.push({ x: ox, y: oy, w: N, h: N, grid: [ox, oy, cs] });
        if (s.phase === "play") {
          const py = oy + N + 12, pw = (G.W - 16) / 9, ph = Math.min(58, G.H - py - 80), cnt = new Array(10).fill(0); s.g.forEach(v => cnt[v]++);
          for (let k = 1; k <= 9; k++) { const x = 8 + (k - 1) * pw; c.fillStyle = dk ? "#2a2a2e" : "#eef0f4"; rr(c, x + 2, py, pw - 4, ph, 8); c.fill();
            c.fillStyle = cnt[k] >= 9 ? (dk ? "#555" : "#bbb") : (s.notes ? (dk ? "#aaa" : "#777") : fg); c.font = `${s.notes ? 500 : 700} ${Math.round(Math.min(pw, ph) * 0.55)}px system-ui, sans-serif`; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText(k, x + pw / 2, py + ph / 2 + 1);
            s.btns.push({ x, y: py, w: pw, h: ph, v: k }); }
          const by = py + ph + 10, bw = (G.W - 32) / 3;
          [["All puzzles", "menu"], [s.notes ? "Notes: on" : "Notes: off", "notes"], ["Erase", "erase"]].forEach(([t, k], i) => { const x = 8 + i * (bw + 8), on = k === "notes" ? s.notes : k === "rot" && s.sel >= 0; s.btns.push(Object.assign(G.pill(c, x, by, bw, 46, t, on), { k })); });
        } else { c.fillStyle = fg; c.font = `700 24px ${G.TITLE}`; c.textAlign = "center"; c.fillText(`Solved! ${s.final} pts`, G.W / 2, oy + N + 50); }
      }
      if (s.msgT > 0 && s.msg) { c.save(); c.globalAlpha = Math.min(1, s.msgT * 2); c.font = `600 14px ${G.UI}`; c.textAlign = "center"; c.textBaseline = "middle"; const w = c.measureText(s.msg).width + 26;
        c.fillStyle = dk ? "#fff" : "#111"; rr(c, G.W / 2 - w / 2, G.H * 0.45, w, 32, 8); c.fill(); c.fillStyle = dk ? "#111" : "#fff"; c.fillText(s.msg, G.W / 2, G.H * 0.45 + 16); c.restore(); }
    },
    tap(G, x, y) {
      const s = G.s, b = s.btns.find(b => x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h); if (!b) return;
      if (b.d !== undefined) return this.open(G, b.d);
      if (s.phase !== "play") return;
      if (b.grid) { const [ox, oy, cs] = b.grid, i = Math.min(8, Math.floor((y - oy) / cs)) * 9 + Math.min(8, Math.floor((x - ox) / cs)); s.sel = i; return; }
      if (b.v) return this.put(G, b.v);
      if (b.k === "erase") return this.put(G, 0);
      if (b.k === "notes") { s.notes = !s.notes; return; }
      if (b.k === "menu") { this.persist(G); s.phase = "pick"; s.sel = -1; }
    },
    swipe(G, dx, dy) { const s = G.s; if (s.phase !== "play" || s.sel < 0) return; const r = Math.max(0, Math.min(8, Math.floor(s.sel / 9) + dy)), cc = Math.max(0, Math.min(8, s.sel % 9 + dx)); s.sel = r * 9 + cc; },
    onKey(G, k, d) {
      if (!d) return; const s = G.s; if (s.phase !== "play") return;
      if (/^[1-9]$/.test(k)) this.put(G, +k); else if (k === "Backspace" || k === "0") this.put(G, 0); else if (k === "n") s.notes = !s.notes;
      else if (/^Arrow/.test(k)) { if (s.sel < 0) s.sel = 0; else this.swipe(G, k === "ArrowLeft" ? -1 : k === "ArrowRight" ? 1 : 0, k === "ArrowUp" ? -1 : k === "ArrowDown" ? 1 : 0); }
    }
  });
})();
