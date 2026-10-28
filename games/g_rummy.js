// ---------- Rummy Dawgs (The Den: the classic number-tile rummy game) ----------
// You vs Rex and Duke. 106 tiles: 1-13 in four colors (two of each) + 2 dog jokers. Make runs (3+ in a row, same color)
// and groups (3-4 of the same number, all different colors). Your first play must total 30+ from your own tiles.
// After that you can rework the table any way you like, as long as every set is valid when you tap Done.
(function () {
  const NAMES = ["YOU", "REX", "DUKE"], FACES = [null, "🐕", "🐶"];
  const TC = ["#d32f2f", "#1565c0", "#ef6c00", "#263238"], SHAPE = ["●", "■", "▲", "◆"];
  const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const rr = (c, x, y, w, h, r) => { c.beginPath(); if (c.roundRect) c.roundRect(x, y, w, h, r); else c.rect(x, y, w, h); };
  const tpts = t => t.j ? 30 : t.n;
  // Arrange a set: returns [{t, v}] in display order with each tile's value, or null if it isn't a valid set.
  function arrange(set) {
    if (set.length < 3) return null;
    const js = set.filter(t => t.j), nj = set.filter(t => !t.j);
    if (!nj.length) return set.length <= 13 ? set.map((t, i) => ({ t, v: i + 1 })) : null;
    // group
    if (set.length <= 4 && nj.every(t => t.n === nj[0].n) && new Set(nj.map(t => t.c)).size === nj.length)
      return nj.map(t => ({ t, v: t.n })).concat(js.map(t => ({ t, v: nj[0].n })));
    // run
    if (nj.every(t => t.c === nj[0].c) && new Set(nj.map(t => t.n)).size === nj.length && set.length <= 13) {
      const s = nj.slice().sort((a, b) => a.n - b.n), lo = s[0].n, hi = s[s.length - 1].n, gaps = hi - lo + 1 - s.length;
      if (gaps > js.length) return null;
      let extra = js.length - gaps, start = lo, end = hi;
      while (extra > 0 && end < 13) { end++; extra--; } while (extra > 0 && start > 1) { start--; extra--; }
      if (extra > 0) return null;
      const out = [], jq = js.slice(); let k = 0;
      for (let v = start; v <= end; v++) { if (k < s.length && s[k].n === v) out.push({ t: s[k++], v }); else out.push({ t: jq.pop(), v }); }
      return out;
    }
    return null;
  }
  const setPts = set => { const a = arrange(set); return a ? a.reduce((x, y) => x + y.v, 0) : 0; };
  const sortSet = set => { const a = arrange(set); return a ? a.map(x => x.t) : set.slice().sort((p, q) => (p.j - q.j) || p.c - q.c || p.n - q.n); };
  // All candidate melds from a rack (groups and runs, jokers fill one gap / one spot).
  function candidates(rack) {
    const out = [], nj = rack.filter(t => !t.j), js = rack.filter(t => t.j);
    const by = {}; nj.forEach(t => { (by[t.n] = by[t.n] || {})[t.c] = by[t.n][t.c] || t; });
    Object.keys(by).forEach(n => { const ts = Object.values(by[n]);
      if (ts.length >= 3) { out.push(ts.slice()); if (ts.length === 4) for (let i = 0; i < 4; i++) out.push(ts.filter((x, k) => k !== i)); }
      if (ts.length === 2 && js.length) out.push(ts.concat([js[0]])); if (ts.length === 3 && js.length) out.push(ts.concat([js[0]]));
    });
    for (let c = 0; c < 4; c++) {
      const m = {}; nj.filter(t => t.c === c).forEach(t => m[t.n] = m[t.n] || t);
      for (let a = 1; a <= 11; a++) for (let b = a + 2; b <= 13; b++) {
        const run = [], need = []; for (let v = a; v <= b; v++) { if (m[v]) run.push(m[v]); else need.push(v); }
        if (need.length <= js.length && need.length <= 1 && run.length >= 2) out.push(run.concat(js.slice(0, need.length)));
      }
    }
    return out.filter(s => arrange(s));
  }
  // Best set of disjoint melds (by points, then tile count). Small search with a cap.
  function bestMelds(rack) {
    const cand = candidates(rack).sort((a, b) => setPts(b) - setPts(a)).slice(0, 60);
    let best = { pts: 0, n: 0, sets: [] }, steps = 0;
    (function go(i, used, sets, pts, n) {
      if (++steps > 6000) return;
      if (pts > best.pts || (pts === best.pts && n > best.n)) best = { pts, n, sets: sets.slice() };
      for (let k = i; k < cand.length; k++) { const s = cand[k]; if (s.some(t => used.has(t.id))) continue;
        s.forEach(t => used.add(t.id)); sets.push(s); go(k + 1, used, sets, pts + setPts(s), n + s.length); sets.pop(); s.forEach(t => used.delete(t.id)); }
    })(0, new Set(), [], 0, 0);
    return best;
  }
  function tile(c, x, y, w, t, o = {}) {
    const h = w * 1.36; c.save(); c.translate(x, y - (o.up ? 6 : 0));
    c.fillStyle = "rgba(0,0,0,0.3)"; rr(c, -w / 2 + 1.5, -h / 2 + 2.5, w, h, w * 0.16); c.fill();
    c.fillStyle = o.glow ? "#fff6c7" : "#fbf6e9"; rr(c, -w / 2, -h / 2, w, h, w * 0.16); c.fill();
    c.strokeStyle = o.sel ? "#ffb300" : "rgba(0,0,0,0.18)"; c.lineWidth = o.sel ? 3 : 1; c.stroke();
    if (t.j) { G.img(c, ":dawgW:", 0, -h * 0.06, w * 0.72); c.fillStyle = "#d32f2f"; c.font = `800 ${Math.round(w * 0.24)}px system-ui, sans-serif`; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText(o.v ? String(o.v) : "J", 0, h * 0.34); }
    else {
      c.fillStyle = TC[t.c]; c.textAlign = "center"; c.textBaseline = "middle";
      c.font = `800 ${Math.round(w * 0.56)}px system-ui, -apple-system, sans-serif`; c.fillText(String(t.n), 0, -h * 0.08);
      c.font = `${Math.round(w * 0.24)}px system-ui, sans-serif`; c.fillText(SHAPE[t.c], 0, h * 0.3);
    }
    if (o.dim) { c.fillStyle = "rgba(0,0,0,0.35)"; rr(c, -w / 2, -h / 2, w, h, w * 0.16); c.fill(); }
    c.restore();
  }

  defGame({
    key: "rummy", name: "Rummy Dawgs", icon: "🧮", max: 800, cat: "den",
    blurb: "Number-tile rummy vs Rex and Duke.",
    how: "Get rid of all your tiles. Sets are RUNS (3+ in a row, same color, like 4-5-6 red) or GROUPS (3 or 4 of the same number, all different colors). The 🐶 joker can stand in for any tile. Your first play has to add up to 30+ using only your own tiles. After that, rework the table however you like: take tiles off sets, split them, combine them, as long as every set on the table is valid when you tap Done. Tap tiles to select them, then tap New set or the + at the end of a set to move them there. Undo puts the table back. Nothing to play? Tap Draw. Win: 200 + the tiles left in the pups' racks. Lose: 100 minus what's left in your rack.",
    save(G) {
      const s = G.s; if (s.phase !== "play" || s.turn !== 0) return null;
      return { label: `You ${s.racks[0].length} tiles · pool ${s.pool.length}`, v: JSON.parse(JSON.stringify(Object.assign({}, s, { btns: [], hl: null, say: [null, null, null] }))) };
    },
    load(G, sv) { Object.assign(G.s, sv.v); G.s.wait = 0.4; G.s.msg = "Welcome back. Your turn."; },
    reset(G) {
      const pool = []; let id = 0;
      for (let k = 0; k < 2; k++) for (let c = 0; c < 4; c++) for (let n = 1; n <= 13; n++) pool.push({ id: id++, n, c, j: false });
      pool.push({ id: id++, n: 0, c: 0, j: true }, { id: id++, n: 0, c: 0, j: true }); shuffle(pool);
      const racks = [[], [], []]; for (let r = 0; r < 14; r++) for (let p = 0; p < 3; p++) racks[p].push(pool.pop());
      G.s = { pool, racks, table: [], opened: [false, false, false], turn: 0, sel: [], placed: [], sortBy: "run", phase: "play", msg: "Your turn. Make 30+ from your own tiles, or Draw.", wait: 0, passes: 0, say: [null, null, null], hl: null, btns: [] };
      this.snapshot(G);
    },
    snapshot(G) { const s = G.s; s.snap = JSON.stringify({ table: s.table, rack: s.racks[0] }); s.placed = []; s.sel = []; },
    undo(G) { const s = G.s, v = JSON.parse(s.snap); s.table = v.table; s.racks[0] = v.rack; s.placed = []; s.sel = []; s.msg = "Table put back."; },
    find(s, id) { let i = s.racks[0].findIndex(t => t.id === id); if (i >= 0) return { where: "rack", i }; for (let k = 0; k < s.table.length; k++) { i = s.table[k].findIndex(t => t.id === id); if (i >= 0) return { where: "set", k, i }; } return null; },
    take(s, ids) {
      const out = []; ids.forEach(id => { const f = this.find(s, id); if (!f) return; if (f.where === "rack") { out.push(s.racks[0].splice(f.i, 1)[0]); if (!s.placed.includes(id)) s.placed.push(id); } else out.push(s.table[f.k].splice(f.i, 1)[0]); });
      return out;
    },
    clean(s) { s.table = s.table.filter(x => x.length).map(x => arrange(x) ? sortSet(x) : x); },
    newSet(G) { const s = G.s; if (!s.sel.length) { s.msg = "Select tiles first."; return; } const t = this.take(s, s.sel); s.table.push(t); s.sel = []; this.clean(s); G.sfx("pop"); },
    addTo(G, k) { const s = G.s, target = s.table[k]; if (!target || !s.sel.length) return; const t = this.take(s, s.sel); target.push(...t); s.sel = []; this.clean(s); G.sfx("pop"); },
    toRack(G) {
      const s = G.s, back = s.sel.filter(id => s.placed.includes(id)); if (!back.length) { s.msg = "Only tiles you played this turn can go back to your rack."; return; }
      back.forEach(id => { const f = this.find(s, id); if (f && f.where === "set") { s.racks[0].push(s.table[f.k].splice(f.i, 1)[0]); s.placed = s.placed.filter(x => x !== id); } });
      s.sel = s.sel.filter(id => !back.includes(id)); this.clean(s);
    },
    select(G, id) {
      const s = G.s, f = this.find(s, id); if (!f) return;
      if (f.where === "set" && !s.opened[0] && !s.placed.includes(id)) { s.msg = "Make your first 30 points from your own tiles before touching the table."; G.buzz(); return; }
      const i = s.sel.indexOf(id); if (i >= 0) s.sel.splice(i, 1); else s.sel.push(id);
    },
    sortedRack(s) {
      const r = s.racks[0].slice();
      return s.sortBy === "run" ? r.sort((a, b) => (a.j - b.j) || a.c - b.c || a.n - b.n) : r.sort((a, b) => (a.j - b.j) || a.n - b.n || a.c - b.c);
    },
    done(G) {
      const s = G.s;
      if (!s.placed.length) {
        // You have to play at least one tile from your rack; moving table tiles around doesn't count. Put it back and draw.
        if (JSON.stringify({ table: s.table, rack: s.racks[0] }) !== s.snap) { this.undo(G); s.msg = "No tiles from your rack played, so the table was put back. "; } else s.msg = "";
        return this.drawTile(G, 0);
      }
      const bad = s.table.filter(x => !arrange(x));
      if (bad.length) { s.msg = `${bad.length} set${bad.length > 1 ? "s aren't" : " isn't"} valid yet (red). Fix it or Undo.`; G.buzz(); return; }
      if (!s.opened[0]) {
        const old = JSON.parse(s.snap).table.map(x => x.map(t => t.id).sort().join(","));
        const now = s.table.map(x => x.map(t => t.id).sort().join(","));
        if (!old.every(k => now.includes(k))) { s.msg = "First play: don't change the sets already on the table."; G.buzz(); return; }
        const mine = s.table.filter(x => x.every(t => s.placed.includes(t.id))), pts = mine.reduce((a, x) => a + setPts(x), 0);
        if (pts < 30) { s.msg = `First play needs 30+ points. You have ${pts}.`; G.buzz(); return; }
        s.opened[0] = true;
      }
      const n = s.placed.length; s.hl = { ids: s.placed.slice(), t: 1.2 }; G.sfx("pop");
      s.passes = 0; s.msg = `You played ${n} tile${n > 1 ? "s" : ""}.`;
      if (!s.racks[0].length) return this.finish(G, 0);
      this.nextTurn(G);
    },
    drawTile(G, p) {
      const s = G.s;
      if (s.pool.length) { s.racks[p].push(s.pool.pop()); s.passes = 0; if (p === 0) s.msg = (s.msg || "") + "You drew a tile."; else s.say[p] = { txt: "Draws", t: 1.2 }; }
      else { s.passes++; if (p === 0) s.msg = "The pool is empty. You pass."; else s.say[p] = { txt: "Pass", t: 1.2 }; if (s.passes >= 3) return this.finish(G, -1); }
      if (p === 0) G.sfx("pop");
      this.nextTurn(G);
    },
    nextTurn(G) { const s = G.s; s.turn = (s.turn + 1) % 3; s.sel = []; s.wait = s.turn === 0 ? 0.3 : 0.9; if (s.turn === 0) { this.snapshot(G); s.msg = (s.msg ? s.msg + " " : "") + "Your turn."; } },
    cpu(G, p) {
      const s = G.s, rack = s.racks[p], played = [];
      const best = bestMelds(rack);
      if (!s.opened[p]) {
        if (best.pts >= 30) { best.sets.forEach(set => { set.forEach(t => rack.splice(rack.indexOf(t), 1)); s.table.push(sortSet(set)); played.push(...set); }); s.opened[p] = true; }
      } else {
        best.sets.forEach(set => { set.forEach(t => rack.splice(rack.indexOf(t), 1)); s.table.push(sortSet(set)); played.push(...set); });
        // lay off single tiles onto the ends of runs and onto groups of three
        let more = true; while (more) { more = false;
          for (const t of rack.slice()) { const k = s.table.findIndex(set => arrange(set.concat([t]))); if (k >= 0 && (!t.j || rack.length <= 2)) { rack.splice(rack.indexOf(t), 1); s.table[k] = sortSet(s.table[k].concat([t])); played.push(t); more = true; } } }
      }
      if (!played.length) return this.drawTile(G, p);
      s.passes = 0; s.hl = { ids: played.map(t => t.id), t: 2 }; s.say[p] = { txt: `Played ${played.length}`, t: 1.6 }; G.sfx("pop");
      s.msg = `${NAMES[p]} played ${played.length} tile${played.length > 1 ? "s" : ""}.`;
      if (rack.length === 1) s.say[p] = { txt: "One left!", t: 1.6 };
      if (!rack.length) return this.finish(G, p);
      this.nextTurn(G);
    },
    finish(G, w) {
      const s = G.s, left = s.racks.map(r => r.reduce((a, t) => a + tpts(t), 0));
      if (w < 0) w = left.indexOf(Math.min(...left)); // pool ran dry and nobody can play: lowest rack wins
      s.phase = "over"; s.winner = w; s.left = left;
      const score = w === 0 ? Math.min(800, 200 + left[1] + left[2]) : Math.max(0, 100 - left[0]);
      s.final = score; G.sfx(w === 0 ? "win" : "lose");
      setTimeout(() => G.over(score, w === 0 ? "Rummy! Top dog 🐶" : `${NAMES[w]} went out first.`), 1800);
    },
    update(G, dt) {
      const s = G.s;
      s.say.forEach((b, i) => { if (b) { b.t -= dt; if (b.t <= 0) s.say[i] = null; } });
      if (s.hl) { s.hl.t -= dt; if (s.hl.t <= 0) s.hl = null; }
      if (s.wait > 0) { s.wait -= dt; return; }
      if (s.phase === "play" && s.turn !== 0) this.cpu(G, s.turn);
    },
    // layout: table sets flow in rows; rack along the bottom
    L(G) {
      const s = G.s, W = G.W, H = G.H, n = s.racks[0].length, per = 10;
      let rw = Math.min(36, (W - 20) / per); const rrows = Math.max(1, Math.ceil(n / per)); if (rrows > 3) rw = Math.min(rw, (W - 20) / Math.ceil(n / 3));
      const rh = rw * 1.36, rackTop = H - Math.min(3, rrows) * (rh + 6) - 10, btnY = rackTop - 54, tableTop = 76, tableBot = btnY - 8;
      // table tile size: shrink until everything fits
      let tw = 30, rows;
      for (; tw >= 16; tw -= 1) { rows = this.flow(s.table, tw, W); if (rows.h <= tableBot - tableTop) break; }
      return { W, H, rw, rh, rackTop, btnY, tableTop, tw, rows, perRow: Math.max(per, Math.ceil(n / 3)) };
    },
    flow(table, tw, W) {
      const pos = [], gap = tw * 0.5, plus = tw * 0.9; let x = 10, y = 0; const rowH = tw * 1.36 + 10;
      table.forEach((set, k) => { const w = set.length * (tw + 2) + plus; if (x + w > W - 10 && x > 10) { x = 10; y += rowH; } pos.push({ k, x, y, w }); x += w + gap; });
      return { pos, h: y + rowH };
    },
    draw(G, c) {
      const s = G.s, L = this.L(G), W = L.W, H = L.H; s.btns = [];
      const g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, "#1f5f4a"); g.addColorStop(1, "#123a2e"); c.fillStyle = g; c.fillRect(0, 0, W, H);
      G.hud(c, `POOL ${s.pool.length}`, s.opened[0] ? "RUMMY DAWGS" : "FIRST PLAY: 30+", `YOU ${s.racks[0].length}`);
      // opponents strip
      [1, 2].forEach(p => {
        const x = p === 1 ? W * 0.27 : W * 0.73, y = 54, turn = s.turn === p && s.phase === "play";
        if (turn) { c.fillStyle = "rgba(255,210,63,0.3)"; rr(c, x - 70, y - 16, 140, 32, 16); c.fill(); }
        G.emoji(c, FACES[p], x - 50, y, 22); G.text(c, `${NAMES[p]} ${s.racks[p].length}`, x + 4, y, 10, s.racks[p].length <= 2 ? "#ff8a80" : "#fff");
        const b = s.say[p]; if (b) { c.fillStyle = "#fff"; rr(c, x - 50, y + 14, 100, 22, 11); c.fill(); c.fillStyle = "#222"; c.font = "700 12px system-ui, sans-serif"; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText(b.txt, x, y + 25); }
      });
      // table
      const myTurn = s.turn === 0 && s.phase === "play", hl = s.hl ? new Set(s.hl.ids) : null;
      if (!s.table.length) { c.fillStyle = "rgba(255,255,255,0.55)"; c.font = "600 14px system-ui, sans-serif"; c.textAlign = "center"; c.fillText("The table is empty. Sets you play go here.", W / 2, (L.tableTop + L.btnY) / 2); }
      L.rows.pos.forEach(({ k, x, y, w }) => {
        const set = s.table[k], arr = arrange(set), ty = L.tableTop + y, th = L.tw * 1.36;
        c.fillStyle = arr ? "rgba(255,255,255,0.08)" : "rgba(229,57,53,0.35)"; rr(c, x - 3, ty - 3, w - L.tw * 0.9 + 6, th + 6, 6); c.fill();
        if (!arr) { c.strokeStyle = "#ff5252"; c.lineWidth = 2; c.stroke(); }
        const vals = arr ? new Map(arr.map(a => [a.t.id, a.v])) : null;
        set.forEach((t, i) => { const tx = x + i * (L.tw + 2) + L.tw / 2, sel = s.sel.includes(t.id);
          tile(c, tx, ty + th / 2, L.tw, t, { sel, up: sel, glow: hl && hl.has(t.id), v: vals && t.j ? vals.get(t.id) : 0 });
          s.btns.push({ x: tx - L.tw / 2, y: ty, w: L.tw + 2, h: th, id: t.id }); });
        if (myTurn && s.sel.length) { const px = x + set.length * (L.tw + 2) + L.tw * 0.4; c.fillStyle = "#ffd23f"; c.beginPath(); c.arc(px, ty + th / 2, L.tw * 0.38, 0, 7); c.fill(); G.text(c, "+", px, ty + th / 2 + 1, Math.max(10, L.tw * 0.4), "#222"); s.btns.push({ x: px - L.tw * 0.5, y: ty - 4, w: L.tw, h: th + 8, add: k }); }
      });
      // message
      if (s.msg) { c.fillStyle = "rgba(0,0,0,0.35)"; rr(c, 8, L.btnY - 30, W - 16, 24, 12); c.fill(); c.fillStyle = "#fff"; c.font = "600 12.5px system-ui, sans-serif"; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText(s.msg, W / 2, L.btnY - 18, W - 28); }
      // buttons
      if (myTurn) {
        const labels = [["New set", "new", s.sel.length > 0], ["Undo", "undo", s.placed.length > 0 || JSON.stringify({ table: s.table, rack: s.racks[0] }) !== s.snap], [s.sortBy === "run" ? "Sort 777" : "Sort 789", "sort", true], [s.placed.length ? "Done ✓" : JSON.stringify({ table: s.table, rack: s.racks[0] }) !== s.snap ? "Reset+Draw" : (s.pool.length ? "Draw" : "Pass"), "main", true]];
        const bw = (W - 16 - 18) / 4;
        labels.forEach(([t, k, on], i) => { const x = 8 + i * (bw + 6), main = k === "main";
          c.globalAlpha = on ? 1 : 0.4; c.fillStyle = main ? (s.placed.length ? "#43a047" : "#ffd23f") : "rgba(255,255,255,0.92)"; rr(c, x, L.btnY, bw, 42, 21); c.fill(); c.globalAlpha = 1;
          c.fillStyle = main && s.placed.length ? "#fff" : "#1b1b1f"; c.font = "800 13.5px system-ui, sans-serif"; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText(t, x + bw / 2, L.btnY + 21);
          if (on) s.btns.push({ x, y: L.btnY, w: bw, h: 42, k }); });
      }
      // rack
      c.fillStyle = "#5d3a1a"; rr(c, 4, L.rackTop - 6, W - 8, H - L.rackTop + 2, 12); c.fill();
      const rack = this.sortedRack(s), per = L.perRow;
      s.btns.push({ x: 4, y: L.rackTop - 6, w: W - 8, h: H - L.rackTop + 2, rack: true });
      rack.forEach((t, i) => { const row = Math.floor(i / per), col = i % per, inRow = Math.min(per, rack.length - row * per), x = W / 2 + (col - (inRow - 1) / 2) * (L.rw + 2), y = L.rackTop + row * (L.rh + 6) + L.rh / 2, sel = s.sel.includes(t.id);
        tile(c, x, y, L.rw, t, { sel, up: sel, dim: !myTurn });
        s.btns.push({ x: x - L.rw / 2, y: y - L.rh / 2 - 6, w: L.rw + 2, h: L.rh + 6, id: t.id }); });
      G.hint(c, "TAP TILES, THEN NEW SET OR +", 5, L.btnY - 52);
      if (s.phase === "over") {
        c.fillStyle = "rgba(0,0,0,0.7)"; c.fillRect(0, 0, W, H);
        G.banner(c, s.winner === 0 ? "RUMMY! YOU WIN" : `${NAMES[s.winner]} WINS`, s.winner === 0 ? "#ffd23f" : "#fff", H * 0.35, 18);
        [0, 1, 2].forEach(p => G.text(c, `${NAMES[p]}: ${s.racks[p].length} tiles left (${s.left[p]})`, W / 2, H * 0.45 + p * 26, 11, p === 0 ? "#ffd23f" : "#fff"));
      }
    },
    tap(G, x, y) {
      const s = G.s; if (s.turn !== 0 || s.phase !== "play" || s.wait > 0) return;
      const hits = s.btns.filter(b => x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h); if (!hits.length) return;
      const b = hits.find(h => h.k) || hits.find(h => h.add !== undefined) || hits.find(h => h.id !== undefined) || hits[0];
      if (b.k === "new") return this.newSet(G);
      if (b.k === "undo") return this.undo(G);
      if (b.k === "sort") { s.sortBy = s.sortBy === "run" ? "num" : "run"; return; }
      if (b.k === "main") return this.done(G);
      if (b.add !== undefined) return this.addTo(G, b.add);
      if (b.id !== undefined) return this.select(G, b.id);
      if (b.rack && s.sel.length) return this.toRack(G);
    }
  });
})();
