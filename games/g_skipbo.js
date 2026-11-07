// ---------- Skip-Bo Dawgs (The Den: the classic stockpile card game) ----------
// You vs Rex and Duke. 162 cards: twelve each of 1-12 plus 18 wild Skip-Bo cards. Everyone has a stockpile (top card
// face up), a 5-card hand and 4 discard piles. Four shared building piles go 1 up to 12, then clear. Play from your
// hand, your stockpile top or your discard tops; if your hand runs out, draw 5 more. Discard one card to end your turn.
// First to empty their stockpile wins: 25 + 5 for every card left in the other stockpiles.
(function () {
  const NAMES = ["YOU", "REX", "DUKE"], FACES = [null, "🐕", "🐶"];
  const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const rr = (c, x, y, w, h, r) => { c.beginPath(); if (c.roundRect) c.roundRect(x, y, w, h, r); else c.rect(x, y, w, h); };
  const top = a => a[a.length - 1];
  const vcol = v => v <= 4 ? "#1e88e5" : v <= 8 ? "#2e9d47" : "#e53935";
  // A card is a number 1-12, or 0 for the wild Skip-Bo card. o.as = the number a wild counts as on a building pile.
  function sbCard(c, x, y, w, v, o = {}) {
    const h = w * 1.4, r = w * 0.12;
    c.save(); c.translate(x, y - (o.up ? 6 : 0));
    c.fillStyle = "rgba(0,0,0,0.3)"; rr(c, -w / 2 + 1.5, -h / 2 + 2.5, w, h, r); c.fill();
    if (v === 0) {
      const g = c.createLinearGradient(0, -h / 2, 0, h / 2); g.addColorStop(0, "#ffb300"); g.addColorStop(1, "#ef6c00");
      c.fillStyle = g; rr(c, -w / 2, -h / 2, w, h, r); c.fill();
      G.img(c, ":dawgW:", 0, -h * 0.08, w * 0.62);
      c.fillStyle = "#fff"; c.font = `900 ${Math.round(w * 0.2)}px system-ui, sans-serif`; c.textAlign = "center"; c.textBaseline = "middle";
      c.fillText(o.as ? String(o.as) : "WILD", 0, h * 0.32);
    } else {
      c.fillStyle = "#fffdf7"; rr(c, -w / 2, -h / 2, w, h, r); c.fill();
      const col = vcol(v); c.fillStyle = col; c.textAlign = "center"; c.textBaseline = "middle";
      c.font = `900 ${Math.round(w * (v > 9 ? 0.5 : 0.6))}px system-ui, -apple-system, sans-serif`; c.fillText(String(v), 0, 1);
      c.font = `800 ${Math.round(w * 0.2)}px system-ui, sans-serif`; c.fillText(String(v), -w / 2 + w * 0.18, -h / 2 + w * 0.2);
      c.fillRect(-w / 2 + w * 0.12, h / 2 - w * 0.16, w * 0.76, Math.max(2, w * 0.05));
    }
    c.strokeStyle = o.sel ? "#ffd23f" : o.hl ? "#69f0ae" : "rgba(0,0,0,0.22)"; c.lineWidth = o.sel || o.hl ? 3.5 : 1; rr(c, -w / 2, -h / 2, w, h, r); c.stroke();
    if (o.dim) { c.fillStyle = "rgba(0,0,0,0.35)"; rr(c, -w / 2, -h / 2, w, h, r); c.fill(); }
    c.restore();
  }
  function slot(c, x, y, w, txt, hl) {
    const h = w * 1.4; c.save(); c.setLineDash([5, 4]); c.strokeStyle = hl ? "#69f0ae" : "rgba(255,255,255,0.35)"; c.lineWidth = hl ? 3 : 1.5;
    rr(c, x - w / 2, y - h / 2, w, h, w * 0.12); c.stroke(); c.restore();
    if (txt) { c.fillStyle = "rgba(255,255,255,0.4)"; c.font = `700 ${Math.round(w * 0.26)}px system-ui, sans-serif`; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText(txt, x, y); }
  }

  defGame({
    key: "skipbo", name: "Skip-Bo Dawgs", icon: "🔢", max: 500, cat: "den",
    blurb: "The stockpile card game vs Rex and Duke.",
    how: "Be the first to empty your stockpile (left, top card face up). The 4 building piles in the middle go up from 1 to 12, any color; at 12 a pile clears. Orange 🐶 cards are wild and count as whatever the pile needs. On your turn you fill up to 5 cards, then play as many cards as you like from your hand, the top of your stockpile, or the tops of your 4 discard piles: tap a card, then tap a building pile. Use your whole hand and you draw 5 more. To end your turn, tap a hand card and then one of your discard piles. Only the top card of each discard pile can be played, so stack them high-to-low. Quick game: 20-card stockpiles; Classic: 30. Win = 25 + 5 for each card left in the pups' stockpiles. Score: win = 100 + that; lose = 5 for every stockpile card you got rid of.",
    save(G) {
      const s = G.s; if (s.phase !== "play" || s.turn !== 0) return null;
      return { label: `Your stock ${s.stock[0].length} · Rex ${s.stock[1].length} · Duke ${s.stock[2].length}`, v: JSON.parse(JSON.stringify(Object.assign({}, s, { btns: [], hl: null, sel: null, say: [null, null, null] }))) };
    },
    load(G, sv) { Object.assign(G.s, sv.v); G.s.wait = 0.4; G.s.msg = "Welcome back. Your turn."; },
    reset(G) { G.s = { phase: "setup", btns: [], say: [null, null, null], msg: "", wait: 0, sel: null, hl: null }; },
    deal(G, n) {
      const deck = []; for (let k = 0; k < 12; k++) for (let v = 1; v <= 12; v++) deck.push(v); for (let k = 0; k < 18; k++) deck.push(0); shuffle(deck);
      const stock = [[], [], []]; for (let r = 0; r < n; r++) for (let p = 0; p < 3; p++) stock[p].push(deck.pop());
      G.s = { phase: "play", deck, done: [], build: [[], [], [], []], stock, start: n, hand: [[], [], []], disc: [0, 1, 2].map(() => [[], [], [], []]),
        turn: 0, sel: null, hl: null, say: [null, null, null], msg: "", wait: 0.3, btns: [] };
      this.startTurn(G);
    },
    need(s, k) { return s.build[k].length + 1; },
    refill(s, p) {
      while (s.hand[p].length < 5) {
        if (!s.deck.length) { s.deck = shuffle(s.done); s.done = []; if (!s.deck.length) break; }
        s.hand[p].push(s.deck.pop());
      }
      if (p === 0) s.hand[0].sort((a, b) => (a || 99) - (b || 99));
    },
    startTurn(G) {
      const s = G.s; this.refill(s, s.turn); s.sel = null; s.played = false;
      if (s.turn === 0) s.msg = (s.msg ? s.msg + " " : "") + "Your turn.";
      s.wait = s.turn === 0 ? 0.2 : 0.8;
    },
    // A turn with an empty hand (deck and cleared piles used up) and no plays is a pass; three in a row ends the game.
    endTurn(G, pass) {
      const s = G.s; s.passes = pass && !s.played ? (s.passes || 0) + 1 : 0;
      if (s.passes >= 3) return this.finish(G, -1);
      s.turn = (s.turn + 1) % 3; this.startTurn(G);
    },
    // pull the card from where it lives
    takeFrom(s, p, src) {
      if (src.from === "stock") return s.stock[p].pop();
      if (src.from === "disc") return s.disc[p][src.i].pop();
      return s.hand[p].splice(src.i, 1)[0];
    },
    peek(s, p, src) { return src.from === "stock" ? top(s.stock[p]) : src.from === "disc" ? top(s.disc[p][src.i]) : s.hand[p][src.i]; },
    playTo(G, p, src, k) {
      const s = G.s, v = this.takeFrom(s, p, src), pile = s.build[k];
      pile.push(v); s.hl = { k, t: 0.9 }; s.played = true; G.sfx("pop");
      const as = pile.length;
      if (p !== 0) s.say[p] = { txt: v === 0 ? `Wild as ${as}` : `Plays ${v}`, t: 1 };
      if (pile.length === 12) { s.done.push(...pile); s.build[k] = []; s.say[p] = { txt: "12! Cleared", t: 1.2 }; }
      if (!s.stock[p].length) return this.finish(G, p);
      if (src.from === "hand" && !s.hand[p].length) { this.refill(s, p); if (p === 0) s.msg = "Hand empty: drew 5 more."; else s.say[p] = { txt: "Draws 5!", t: 1.2 }; }
      if (src.from === "stock" && p !== 0 && s.stock[p].length <= 3) s.say[p] = { txt: `${s.stock[p].length} left!`, t: 1.2 };
    },
    discard(G, p, i, d) {
      const s = G.s, v = s.hand[p].splice(i, 1)[0]; s.disc[p][d].push(v); G.sfx("pop");
      if (p === 0) s.msg = ""; else s.say[p] = { txt: "Discards", t: 0.9 };
      this.endTurn(G);
    },
    // ---- CPU ----
    // Value of the next card a pile wants once v lands on it (1 again after 12).
    after(s, k) { const n = s.build[k].length + 1; return n === 12 ? 1 : n + 1; },
    feeds(s, p, k) { return [0, 1, 2].some(q => q !== p && s.stock[q].length && top(s.stock[q]) === this.after(s, k)); },
    // Find a sequence of plays (hand + discard tops, wilds last) that lets the stock top go down. Returns the first move.
    findPath(s, p) {
      const t = top(s.stock[p]); let steps = 0, best = null;
      for (let k = 0; k < 4; k++) {
        const need = this.need(s, k); if (need > t) continue;
        const hand = s.hand[p].slice(), discs = s.disc[p].map(d => d.slice());
        const go = (n, wilds) => {
          if (++steps > 4000) return null;
          if (n === t) return { wilds, first: null };
          const tries = [];
          discs.forEach((d, i) => { if (d.length && top(d) === n) tries.push({ from: "disc", i }); });
          const hi = hand.indexOf(n); if (hi >= 0) tries.push({ from: "hand", i: hi });
          discs.forEach((d, i) => { if (d.length && top(d) === 0) tries.push({ from: "disc", i, w: 1 }); });
          const wi = hand.indexOf(0); if (wi >= 0) tries.push({ from: "hand", i: wi, w: 1 });
          for (const m of tries) {
            const card = m.from === "disc" ? discs[m.i].pop() : hand.splice(m.i, 1)[0];
            const r = go(n + 1, wilds + (m.w ? 1 : 0));
            if (m.from === "disc") discs[m.i].push(card); else hand.splice(m.i, 0, card);
            if (r) return { wilds: r.wilds, first: m };
          }
          return null;
        };
        const r = go(need, 0);
        if (r && (!best || r.wilds < best.wilds)) best = { wilds: r.wilds, move: { src: r.first, k } };
      }
      return best && best.move;
    },
    cpuStep(G, p) {
      const s = G.s, t = top(s.stock[p]);
      // 1. stockpile card
      const ks = [0, 1, 2, 3].filter(k => t === 0 || this.need(s, k) === t);
      if (ks.length) { const k = ks.find(k => !this.feeds(s, p, k)); return this.playTo(G, p, { from: "stock" }, k === undefined ? ks[0] : k); }
      // 2. a route that reaches the stockpile card
      const path = this.findPath(s, p); if (path) return this.playTo(G, p, path.src, path.k);
      // 3. free plays that don't hand a pup its stockpile card: discard tops first, then hand cards (no wilds)
      for (let i = 0; i < 4; i++) { const d = s.disc[p][i]; if (!d.length || top(d) === 0) continue;
        for (let k = 0; k < 4; k++) if (this.need(s, k) === top(d) && !this.feeds(s, p, k)) return this.playTo(G, p, { from: "disc", i }, k); }
      for (let i = 0; i < s.hand[p].length; i++) { const v = s.hand[p][i]; if (!v) continue;
        for (let k = 0; k < 4; k++) if (this.need(s, k) === v && !this.feeds(s, p, k)) return this.playTo(G, p, { from: "hand", i }, k); }
      // 4. discard and end the turn. With no hand left (nothing to draw), make any legal play, wilds included, or pass.
      if (!s.hand[p].length) {
        for (let i = 0; i < 4; i++) { const d = s.disc[p][i]; if (!d.length) continue;
          for (let k = 0; k < 4; k++) if (top(d) === 0 || this.need(s, k) === top(d)) return this.playTo(G, p, { from: "disc", i }, k); }
        s.say[p] = { txt: "Pass", t: 1 }; return this.endTurn(G, true);
      }
      let best = null;
      s.hand[p].forEach((v, i) => s.disc[p].forEach((d, k) => {
        let sc;
        if (v === 0) sc = -50 + (d.length ? 0 : 5);
        else if (!d.length) sc = 5;
        else { const tv = top(d); sc = tv === 0 ? -5 : tv === v ? 8 : tv === v + 1 ? 10 : tv > v ? 7 - (tv - v) * 0.6 : 1 - (v - tv) * 0.6; }
        sc += v * 0.15 + Math.random() * 0.5;
        if (!best || sc > best.sc) best = { sc, i, k };
      }));
      this.discard(G, p, best.i, best.k);
    },
    finish(G, w) {
      const s = G.s; s.phase = "over"; s.sel = null;
      if (w < 0) { const n = s.stock.map(x => x.length); w = n.indexOf(Math.min(...n)); s.stuck = true; } // nobody can move: smallest stockpile wins
      s.winner = w;
      const pts = 25 + 5 * [0, 1, 2].filter(p => p !== w).reduce((a, p) => a + s.stock[p].length, 0);
      s.pts = pts;
      const score = w === 0 ? Math.min(500, 100 + pts) : 5 * (s.start - s.stock[0].length);
      G.sfx(w === 0 ? "win" : "lose");
      setTimeout(() => G.over(score, w === 0 ? "Skip-Bo! Top dog 🐶" : `${NAMES[w]} ${s.stuck ? "had the smallest stockpile" : "emptied the stockpile first"}.`), 2000);
    },
    update(G, dt) {
      const s = G.s;
      s.say.forEach((b, i) => { if (b) { b.t -= dt; if (b.t <= 0) s.say[i] = null; } });
      if (s.hl) { s.hl.t -= dt; if (s.hl.t <= 0) s.hl = null; }
      if (s.phase !== "play") return;
      if (s.wait > 0) { s.wait -= dt; return; }
      if (s.turn !== 0) { this.cpuStep(G, s.turn); if (s.phase === "play") s.wait = Math.max(s.wait, 0.55); return; }
    },
    // ---- layout ----
    L(G) {
      const W = G.W, H = G.H;
      const ow = Math.min(34, (W / 2 - 22) / 5.8), oh = ow * 1.4, oppY = 54, oppCards = oppY + 20 + oh / 2;
      const bw = Math.min(62, (W - 30) / 5.5), bh = bw * 1.4, buildY = oppCards + oh / 2 + 24 + bh / 2;
      const msgY = buildY + bh / 2 + 34;
      const hw = Math.min(64, (W - 24) / 5.4), hh = hw * 1.4, handY = H - hh / 2 - 16;
      const dw = Math.min(66, (W - 24) / 5.4), dh = dw * 1.4, areaY = msgY + 18 + dh / 2;
      const room = handY - hh / 2 - 22 - (areaY + dh / 2), off = Math.max(5, Math.min(26, room / 7));
      const col = (w, i) => { const gap = (W - 5 * w) / 6; return gap + w / 2 + i * (w + gap); };
      return { W, H, ow, oh, oppY, oppCards, bw, bh, buildY, msgY, hw, hh, handY, dw, dh, areaY, off, col };
    },
    targets(s) {
      if (!s.sel || s.turn !== 0) return [];
      const v = this.peek(s, 0, s.sel); return [0, 1, 2, 3].filter(k => v === 0 || this.need(s, k) === v);
    },
    draw(G, c) {
      const s = G.s, W = G.W, H = G.H; s.btns = [];
      const g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, "#1d4f7a"); g.addColorStop(1, "#0f2742"); c.fillStyle = g; c.fillRect(0, 0, W, H);
      if (s.phase === "setup") {
        G.hud(c, "", "SKIP-BO DAWGS", "");
        G.emoji(c, "🐕", W / 2 - 40, H * 0.22, 44); G.emoji(c, "🐶", W / 2 + 40, H * 0.22, 44);
        G.text(c, "YOU VS REX & DUKE", W / 2, H * 0.31, 11, "#fff");
        [["QUICK GAME", "20-card stockpiles", 20, H * 0.4], ["CLASSIC", "30-card stockpiles", 30, H * 0.4 + 96]].forEach(([t, sub, n, y]) => {
          const bx = W / 2 - 120; c.fillStyle = n === 20 ? "#ffd23f" : "#fff"; rr(c, bx, y, 240, 76, 22); c.fill();
          G.text(c, t, W / 2, y + 28, 13, "#1b1b1f"); c.fillStyle = "#444"; c.font = "600 13px system-ui, sans-serif"; c.textAlign = "center"; c.fillText(sub, W / 2, y + 54);
          s.btns.push({ x: bx, y, w: 240, h: 76, k: "start", n });
        });
        return;
      }
      const L = this.L(G), myTurn = s.turn === 0 && s.phase === "play";
      G.hud(c, `DECK ${s.deck.length}`, "SKIP-BO DAWGS", `STOCK ${s.stock[0].length}`);
      // opponents
      [1, 2].forEach(p => {
        const cx = p === 1 ? W * 0.25 : W * 0.75, bwid = W / 2 - 12, x0 = cx - bwid / 2, turn = s.turn === p && s.phase === "play";
        c.fillStyle = turn ? "rgba(255,210,63,0.25)" : "rgba(0,0,0,0.18)"; rr(c, x0, L.oppY - 14, bwid, L.oppCards + L.oh / 2 + 14 - (L.oppY - 14), 12); c.fill();
        G.emoji(c, FACES[p], x0 + 16, L.oppY + 1, 18); G.text(c, `${NAMES[p]}`, x0 + 34, L.oppY + 1, 9, "#fff", "left");
        G.text(c, `${s.stock[p].length}`, x0 + bwid - 10, L.oppY + 1, 10, s.stock[p].length <= 3 ? "#ff8a80" : "#ffd23f", "right");
        const sx = x0 + 8 + L.ow / 2;
        if (s.stock[p].length) sbCard(c, sx, L.oppCards, L.ow, top(s.stock[p])); else slot(c, sx, L.oppCards, L.ow, "");
        for (let d = 0; d < 4; d++) { const dx = sx + L.ow * 1.25 + d * (L.ow * 0.98 + 3), pile = s.disc[p][d];
          if (pile.length) { sbCard(c, dx, L.oppCards, L.ow * 0.92, top(pile)); if (pile.length > 1) { c.fillStyle = "#fff"; c.font = "700 10px system-ui, sans-serif"; c.textAlign = "center"; c.fillText(`×${pile.length}`, dx, L.oppCards + L.oh / 2 + 8); } }
          else slot(c, dx, L.oppCards, L.ow * 0.92, ""); }
        const b = s.say[p]; if (b) { const w = Math.max(74, b.txt.length * 7 + 18); c.fillStyle = "#fff"; rr(c, cx - w / 2, L.oppCards + L.oh / 2 + 2, w, 22, 11); c.fill(); c.fillStyle = "#222"; c.font = "800 12px system-ui, sans-serif"; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText(b.txt, cx, L.oppCards + L.oh / 2 + 13); }
      });
      // deck + building piles
      const tg = this.targets(s);
      G.card(c, L.col(L.bw, 0), L.buildY, L.bw, null, false);
      c.fillStyle = "rgba(255,255,255,0.7)"; c.font = "700 11px system-ui, sans-serif"; c.textAlign = "center"; c.fillText(`${s.deck.length} left`, L.col(L.bw, 0), L.buildY + L.bh / 2 + 13);
      for (let k = 0; k < 4; k++) {
        const x = L.col(L.bw, k + 1), pile = s.build[k], on = tg.includes(k), flash = s.hl && s.hl.k === k;
        if (pile.length) { if (flash) { c.fillStyle = "rgba(255,210,63,0.45)"; rr(c, x - L.bw / 2 - 5, L.buildY - L.bh / 2 - 5, L.bw + 10, L.bh + 10, 10); c.fill(); }
          sbCard(c, x, L.buildY, L.bw, top(pile), { as: pile.length, hl: on }); }
        else slot(c, x, L.buildY, L.bw, "1-12", on);
        c.fillStyle = on ? "#69f0ae" : "rgba(255,255,255,0.7)"; c.font = "700 11px system-ui, sans-serif"; c.textAlign = "center";
        c.fillText(`needs ${this.need(s, k)}`, x, L.buildY + L.bh / 2 + 13);
        s.btns.push({ x: x - L.bw / 2 - 4, y: L.buildY - L.bh / 2 - 4, w: L.bw + 8, h: L.bh + 8, k: "build", i: k });
      }
      // message
      const msg = s.phase !== "play" ? "" : myTurn ? (s.sel ? (s.sel.from === "hand" ? "Tap a green pile, or a discard pile to end your turn." : "Tap a green pile to play it.") : s.msg || "Your turn.") : `${NAMES[s.turn]} is playing…`;
      if (msg) { c.fillStyle = "rgba(0,0,0,0.35)"; rr(c, 8, L.msgY - 12, W - 16, 24, 12); c.fill(); c.fillStyle = myTurn ? "#fff" : "#ffd23f"; c.font = "600 12.5px system-ui, sans-serif"; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText(msg, W / 2, L.msgY, W - 28); }
      // your stockpile + discard piles
      const sx = L.col(L.dw, 0), sel = s.sel;
      if (s.stock[0].length) { sbCard(c, sx, L.areaY, L.dw, top(s.stock[0]), { sel: sel && sel.from === "stock", up: sel && sel.from === "stock" }); }
      else slot(c, sx, L.areaY, L.dw, "");
      c.fillStyle = "#ffd23f"; c.font = "800 11px system-ui, sans-serif"; c.textAlign = "center"; c.fillText(`STOCK ${s.stock[0].length}`, sx, L.areaY + L.dh / 2 + 13);
      s.btns.push({ x: sx - L.dw / 2, y: L.areaY - L.dh / 2 - 6, w: L.dw, h: L.dh + 6, k: "stock" });
      const discTarget = myTurn && sel && sel.from === "hand";
      for (let d = 0; d < 4; d++) {
        const x = L.col(L.dw, d + 1), pile = s.disc[0][d], show = pile.slice(-8), base = L.areaY;
        if (!pile.length) slot(c, x, base, L.dw, discTarget ? "here" : "", discTarget);
        show.forEach((v, j) => { const last = j === show.length - 1, isSel = last && sel && sel.from === "disc" && sel.i === d;
          sbCard(c, x, base + j * L.off, L.dw, v, { sel: isSel, up: isSel, hl: last && discTarget }); });
        if (pile.length > show.length) { c.fillStyle = "rgba(255,255,255,0.7)"; c.font = "700 10px system-ui, sans-serif"; c.textAlign = "center"; c.fillText(`+${pile.length - show.length}`, x, base - L.dh / 2 - 6); }
        const hgt = L.dh + Math.max(0, show.length - 1) * L.off;
        s.btns.push({ x: x - L.dw / 2, y: base - L.dh / 2 - 6, w: L.dw, h: hgt + 6, k: "disc", i: d });
      }
      // hand
      c.fillStyle = "rgba(0,0,0,0.25)"; rr(c, 4, L.handY - L.hh / 2 - 10, W - 8, L.hh + 20, 14); c.fill();
      s.hand[0].forEach((v, i) => { const x = L.col(L.hw, i), isSel = sel && sel.from === "hand" && sel.i === i;
        sbCard(c, x, L.handY, L.hw, v, { sel: isSel, up: isSel, dim: !myTurn });
        s.btns.push({ x: x - L.hw / 2, y: L.handY - L.hh / 2 - 6, w: L.hw, h: L.hh + 6, k: "hand", i }); });
      if (myTurn && !s.hand[0].length) { const bx = W / 2 - 80; c.fillStyle = "#ffd23f"; rr(c, bx, L.handY - 22, 160, 44, 22); c.fill(); G.text(c, "END TURN", W / 2, L.handY, 11, "#222"); s.btns.unshift({ x: bx, y: L.handY - 22, w: 160, h: 44, k: "pass" });
        G.text(c, "NO CARDS LEFT TO DRAW", W / 2, L.handY - 36, 8, "#fff"); }
      G.hint(c, "TAP A CARD, THEN A PILE", 5, L.handY - L.hh / 2 - 26);
      if (s.phase === "over") {
        c.fillStyle = "rgba(0,0,0,0.72)"; c.fillRect(0, 0, W, H);
        G.banner(c, s.winner === 0 ? "SKIP-BO! YOU WIN" : `${NAMES[s.winner]} WINS`, s.winner === 0 ? "#ffd23f" : "#fff", H * 0.3, 17);
        G.text(c, `${NAMES[s.winner] === "YOU" ? "YOU SCORE" : NAMES[s.winner] + " SCORES"} ${s.pts}`, W / 2, H * 0.38, 11, "#fff");
        [0, 1, 2].forEach(p => G.text(c, `${NAMES[p]}: ${s.stock[p].length} left in stock`, W / 2, H * 0.46 + p * 26, 10, p === 0 ? "#ffd23f" : "#fff"));
      }
    },
    tap(G, x, y) {
      const s = G.s, hits = s.btns.filter(b => x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h); if (!hits.length) return;
      const b = hits[0];
      if (s.phase === "setup") { if (b.k === "start") { this.deal(G, b.n); G.sfx("pop"); } return; }
      if (s.phase !== "play" || s.turn !== 0 || s.wait > 0) return;
      if (b.k === "pass") { s.sel = null; s.msg = ""; return this.endTurn(G, true); }
      const same = a => s.sel && s.sel.from === a.from && s.sel.i === a.i;
      if (b.k === "hand") { const a = { from: "hand", i: b.i }; s.sel = same(a) ? null : a; return; }
      if (b.k === "stock") { if (!s.stock[0].length) return; const a = { from: "stock" }; s.sel = same(a) ? null : a; return; }
      if (b.k === "disc") {
        if (s.sel && s.sel.from === "hand") { const i = s.sel.i; s.sel = null; return this.discard(G, 0, i, b.i); }
        if (!s.disc[0][b.i].length) { s.msg = "Tap a hand card first, then a discard pile to end your turn."; return; }
        const a = { from: "disc", i: b.i }; s.sel = same(a) ? null : a; return;
      }
      if (b.k === "build") {
        if (!s.sel) { s.msg = `That pile needs a ${this.need(s, b.i)}. Pick a card first.`; return; }
        const v = this.peek(s, 0, s.sel);
        if (v !== 0 && v !== this.need(s, b.i)) { s.msg = `That pile needs a ${this.need(s, b.i)}.`; G.buzz(); return; }
        const src = s.sel; s.sel = null; s.msg = ""; this.playTo(G, 0, src, b.i);
      }
    }
  });
})();
