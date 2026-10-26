// ---------- Crazy Dawgs (The Den: the classic color-matching card game) ----------
// You vs three CPU pups. Match the color or the number/symbol, use Skip / Reverse / +2 / Wild / Wild +4,
// yell BARK! when you're down to one card. Each hand's winner scores the cards left in everyone else's hands.
// First to 200 wins the match.
(function () {
  const NAMES = ["YOU", "REX", "BISCUIT", "DUKE"], FACES = [null, "🐕", ":dawgpog:", "🐶"];
  const COLS = ["#e53935", "#fbc02d", "#43a047", "#1e88e5"], CNAME = ["RED", "YELLOW", "GREEN", "BLUE"];
  const TARGET = 200;
  const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  // card: { c: 0-3 (color) or 4 (wild), v: 0-9 | "S" skip | "R" reverse | "D" draw two | "W" wild | "F" wild draw four }
  function newDeck() {
    const d = [];
    for (let c = 0; c < 4; c++) { d.push({ c, v: 0 }); for (let k = 0; k < 2; k++) { for (let v = 1; v <= 9; v++) d.push({ c, v }); d.push({ c, v: "S" }, { c, v: "R" }, { c, v: "D" }); } }
    for (let k = 0; k < 4; k++) d.push({ c: 4, v: "W" }, { c: 4, v: "F" });
    return shuffle(d);
  }
  const pts = k => typeof k.v === "number" ? k.v : k.c === 4 ? 50 : 20;
  const label = k => k.v === "S" ? "⊘" : k.v === "R" ? "⇄" : k.v === "D" ? "+2" : k.v === "W" ? "W" : k.v === "F" ? "+4" : String(k.v);
  const long = k => k.v === "S" ? "Skip" : k.v === "R" ? "Reverse" : k.v === "D" ? "+2" : k.v === "W" ? "Wild" : k.v === "F" ? "Wild +4" : String(k.v);
  const rr = (c, x, y, w, h, r) => { c.beginPath(); if (c.roundRect) c.roundRect(x, y, w, h, r); else c.rect(x, y, w, h); };
  // Draw one card centered at x,y. w = width (height 1.5w).
  function card(c, x, y, w, k, up, o = {}) {
    const h = w * 1.5; c.save(); c.translate(x, y); if (o.rot) c.rotate(o.rot);
    c.fillStyle = "rgba(0,0,0,0.3)"; rr(c, -w / 2 + 2, -h / 2 + 3, w, h, w * 0.14); c.fill();
    c.fillStyle = "#fff"; rr(c, -w / 2, -h / 2, w, h, w * 0.14); c.fill();
    if (o.hl) { c.strokeStyle = "#ffd23f"; c.lineWidth = 3; c.stroke(); }
    const ins = Math.max(2, w * 0.07);
    if (!up) {
      c.fillStyle = "#1b1b1f"; rr(c, -w / 2 + ins, -h / 2 + ins, w - 2 * ins, h - 2 * ins, w * 0.1); c.fill();
      c.save(); c.rotate(-0.5); c.fillStyle = "#e53935"; c.beginPath(); c.ellipse(0, 0, w * 0.34, h * 0.24, 0, 0, 7); c.fill(); c.restore();
      G.emoji(c, "🐾", 0, 1, w * 0.36); c.restore(); return;
    }
    if (k.c === 4) {
      const iw = w - 2 * ins, ih = h - 2 * ins; c.save(); rr(c, -iw / 2, -ih / 2, iw, ih, w * 0.1); c.clip();
      const sc = o.chosen != null ? [o.chosen, o.chosen, o.chosen, o.chosen] : [0, 1, 3, 2];
      c.fillStyle = COLS[sc[0]]; c.fillRect(-iw / 2, -ih / 2, iw / 2, ih / 2); c.fillStyle = COLS[sc[1]]; c.fillRect(0, -ih / 2, iw / 2, ih / 2);
      c.fillStyle = COLS[sc[2]]; c.fillRect(-iw / 2, 0, iw / 2, ih / 2); c.fillStyle = COLS[sc[3]]; c.fillRect(0, 0, iw / 2, ih / 2);
      if (o.chosen == null) { c.fillStyle = "#1b1b1f"; c.globalAlpha = 0.25; c.fillRect(-iw / 2, -ih / 2, iw, ih); c.globalAlpha = 1; }
      c.restore();
    } else { c.fillStyle = COLS[k.c]; rr(c, -w / 2 + ins, -h / 2 + ins, w - 2 * ins, h - 2 * ins, w * 0.1); c.fill(); }
    c.save(); c.rotate(-0.5); c.fillStyle = "#fff"; c.beginPath(); c.ellipse(0, 0, w * 0.33, h * 0.25, 0, 0, 7); c.fill(); c.restore();
    const t = label(k), big = t.length > 1 ? 0.36 : 0.5;
    c.fillStyle = k.c === 4 ? "#1b1b1f" : COLS[k.c]; c.font = `900 ${Math.round(w * big)}px system-ui, -apple-system, sans-serif`; c.textAlign = "center"; c.textBaseline = "middle";
    c.fillText(t, 0, 1);
    c.fillStyle = "#fff"; c.font = `800 ${Math.round(w * 0.2)}px system-ui, sans-serif`; c.fillText(t, -w / 2 + w * 0.2, -h / 2 + w * 0.22);
    c.save(); c.rotate(Math.PI); c.fillText(t, -w / 2 + w * 0.2, -h / 2 + w * 0.22); c.restore();
    if (o.dim) { c.fillStyle = "rgba(20,10,40,0.45)"; rr(c, -w / 2, -h / 2, w, h, w * 0.14); c.fill(); }
    c.restore();
  }

  defGame({
    key: "crazy", name: "Crazy Dawgs", icon: "🎴", max: 2000, cat: "den",
    blurb: "The color-matching card game vs 3 pups.",
    how: "You vs Rex, Biscuit and Duke. Match the top card by color or by number/symbol. Skip ⊘ skips the next player, Reverse ⇄ flips direction, +2 makes the next player draw 2 and lose their turn, Wild lets you pick the color, Wild +4 picks the color and makes the next player draw 4. Can't play? Tap the deck to draw one (play it if it fits). Down to 2 cards? Tap BARK! before you play, or get caught and draw 2. Win a hand to score the cards left in everyone's hands (numbers = face value, action cards 20, wilds 50). First to 200 wins. Score: your points, +100 for winning the match.",
    save(G) {
      const s = G.s; if (s.phase === "handEnd" || s.phase === "over") return null;
      const v = JSON.parse(JSON.stringify(Object.assign({}, s, { btns: [], fly: null, say: [null, null, null, null] })));
      return { label: `You ${s.score[0]} · best pup ${Math.max(s.score[1], s.score[2], s.score[3])}`, v };
    },
    load(G, sv) { Object.assign(G.s, sv.v); G.s.wait = 0.6; G.s.msg = "Welcome back."; },
    reset(G) {
      G.s = { score: [0, 0, 0, 0], dealer: Math.floor(Math.random() * 4), hand: 0, say: [null, null, null, null], btns: [], msg: "", fly: null, t: 0 };
      this.deal(G);
    },
    deal(G) {
      const s = G.s; s.hand++; s.deck = newDeck(); s.hands = [[], [], [], []];
      for (let r = 0; r < 7; r++) for (let p = 0; p < 4; p++) s.hands[p].push(s.deck.pop());
      let top; do { top = s.deck.pop(); if (typeof top.v !== "number") { s.deck.unshift(top); top = null; } } while (!top);
      s.pile = [top]; s.color = top.c; s.dir = 1; s.turn = (s.dealer + 1) % 4; s.phase = "play";
      s.drawn = null; s.barked = false; s.caught = false; s.pick = false; s.wait = 0.9; s.winner = -1;
      this.sortMine(s); s.msg = s.turn === 0 ? "Your turn" : `${NAMES[s.turn]} starts`;
    },
    sortMine(s) { s.hands[0].sort((a, b) => a.c - b.c || (typeof a.v === "number" ? a.v : 10 + "SRDWF".indexOf(a.v)) - (typeof b.v === "number" ? b.v : 10 + "SRDWF".indexOf(b.v))); },
    top(s) { return s.pile[s.pile.length - 1]; },
    fits(s, k) { const t = this.top(s); return k.c === 4 || k.c === s.color || k.v === t.v; },
    // A Wild +4 is only allowed when you have nothing in the current color (house-standard rule, no challenges).
    legal(s, p, k) { if (!this.fits(s, k)) return false; if (k.v === "F") return !s.hands[p].some(x => x !== k && x.c === s.color); return true; },
    next(s, n) { return (((s.turn + s.dir * (n || 1)) % 4) + 4) % 4; },
    say(s, p, txt) { s.say[p] = { txt, t: 1.6 }; },
    drawCards(s, p, n) {
      for (let i = 0; i < n; i++) {
        if (!s.deck.length) { const t = s.pile.pop(); s.deck = shuffle(s.pile); s.pile = [t]; if (!s.deck.length) break; }
        s.hands[p].push(s.deck.pop());
      }
      if (p === 0) this.sortMine(s);
    },
    pos(G, p) { const W = G.W; return p === 0 ? [W / 2, G.H - 70] : p === 1 ? [46, G.H * 0.33] : p === 2 ? [W / 2, 76] : [W - 46, G.H * 0.33]; },
    play(G, p, i, chosen) {
      const s = G.s, k = s.hands[p].splice(i, 1)[0];
      const from = this.pos(G, p); s.fly = { k, x: from[0], y: from[1], t: 0 };
      s.pile.push(k); s.color = k.c === 4 ? chosen : k.c; s.drawn = null;
      if (k.c === 4) k.chosen = chosen;
      G.sfx("pop");
      // forgot to bark?
      if (s.hands[p].length === 1) { if (p === 0) { if (!s.barked) s.caught = true; } else if (Math.random() < 0.9) this.say(s, p, "BARK!"); else s.cpuForgot = p; }
      s.barked = false;
      if (!s.hands[p].length) { s.winner = p; s.phase = "handEnd"; }
      let skip = 1, msg = `${NAMES[p] === "YOU" ? "You" : NAMES[p]} played ${k.c === 4 ? long(k) + " → " + CNAME[chosen] : CNAME[k.c] + " " + long(k)}`;
      if (k.v === "R") { s.dir = -s.dir; skip = 1; }
      if (k.v === "S") skip = 2;
      if (k.v === "D" || k.v === "F") { const v = this.next(s, 1), n = k.v === "D" ? 2 : 4; this.drawCards(s, v, n); this.say(s, v, `+${n} 😩`); skip = 2; msg += ` · ${NAMES[v] === "YOU" ? "you draw" : NAMES[v] + " draws"} ${n}`; }
      if (k.v === "S") { const v = this.next(s, 1); this.say(s, v, "Skipped!"); }
      s.msg = msg;
      if (s.phase === "handEnd") { s.wait = 1.4; return; }
      s.turn = this.next(s, skip); s.wait = p === 0 ? 0.7 : 0.9;
    },
    // CPU: play a sensible card, else draw.
    cpu(G, p) {
      const s = G.s, h = s.hands[p], nextN = s.hands[this.next(s, 1)].length;
      // catch you if you forgot to bark
      if (s.caught && s.hands[0].length === 1 && Math.random() < 0.75) { this.drawCards(s, 0, 2); this.say(s, p, "You didn't BARK! +2"); s.msg = `${NAMES[p]} caught you! Draw 2.`; s.caught = false; G.buzz(); s.wait = 1.1; return; }
      s.caught = false;
      if (s.cpuForgot != null && s.cpuForgot !== p && s.hands[s.cpuForgot].length === 1 && Math.random() < 0.6) { const q = s.cpuForgot; this.drawCards(s, q, 2); this.say(s, p, `${NAMES[q]} forgot! +2`); s.cpuForgot = null; s.wait = 1; return; }
      const opts = h.map((k, i) => ({ k, i })).filter(o => this.legal(s, p, o.k));
      if (!opts.length) {
        if (s.drawn === p) { s.drawn = null; s.msg = `${NAMES[p]} passes`; s.turn = this.next(s, 1); s.wait = 0.7; return; }
        this.drawCards(s, p, 1); s.drawn = p; s.msg = `${NAMES[p]} draws`; s.wait = 0.6; return;
      }
      const score = o => { const k = o.k; let v = 0;
        if (k.c === 4) v -= 30; else v += 10;
        if (k.c === s.color) v += 3;
        if (typeof k.v !== "number") v += nextN <= 2 ? 25 : 4;
        if (typeof k.v === "number") v += k.v * 0.5;
        if (k.v === "F") v += nextN <= 2 ? 40 : -10;
        return v + Math.random() * 3; };
      opts.sort((a, b) => score(b) - score(a));
      const pick = opts[0], cnt = [0, 0, 0, 0]; h.forEach(k => { if (k.c < 4) cnt[k.c]++; });
      const chosen = pick.k.c === 4 ? cnt.indexOf(Math.max(...cnt)) : undefined;
      if (h.length === 2) s.barked = true;
      this.play(G, p, pick.i, chosen);
    },
    endHand(G) {
      const s = G.s, w = s.winner; let gain = 0;
      s.hands.forEach((h, p) => { if (p !== w) h.forEach(k => gain += pts(k)); });
      s.score[w] += gain; s.last = { w, gain };
      if (w === 0) G.sfx("win"); else G.sfx("lose");
      if (Math.max(...s.score) >= TARGET) {
        s.phase = "over"; const won = s.score[0] >= TARGET && s.score[0] === Math.max(...s.score);
        setTimeout(() => G.over(Math.min(2000, s.score[0] + (won ? 100 : 0)), won ? "Top dog! 🐶" : `${NAMES[s.score.indexOf(Math.max(...s.score))]} wins the match.`), 1400);
        return;
      }
      s.phase = "between"; s.dealer = (s.dealer + 1) % 4;
    },
    update(G, dt) {
      const s = G.s; s.t += dt;
      s.say.forEach((b, i) => { if (b) { b.t -= dt; if (b.t <= 0) s.say[i] = null; } });
      if (s.fly) { s.fly.t += dt * 4; if (s.fly.t >= 1) s.fly = null; }
      if (s.wait > 0) { s.wait -= dt; if (s.wait > 0) return; }
      if (s.phase === "handEnd") { s.phase = "scoring"; return this.endHand(G); }
      if (s.phase !== "play" || s.pick) return;
      if (s.turn !== 0) this.cpu(G, s.turn);
    },
    L(G) {
      const W = G.W, H = G.H, n = G.s.hands ? G.s.hands[0].length : 7;
      const cw = Math.min(62, Math.max(44, (W - 20) / 6.5)), avail = W - 20 - cw, step = n > 1 ? Math.min(cw * 0.78, avail / (n - 1)) : 0;
      const rows = step < cw * 0.42 && n > 9 ? 2 : 1;
      return { W, H, cw, step, rows, cx: W / 2, cy: H * 0.43 };
    },
    handPos(G, i) {
      const s = G.s, L = this.L(G), n = s.hands[0].length;
      if (L.rows === 2) { const per = Math.ceil(n / 2), r = i < per ? 0 : 1, j = r ? i - per : i, m = r ? n - per : per, st = m > 1 ? Math.min(L.cw * 0.78, (L.W - 20 - L.cw) / (m - 1)) : 0;
        return [L.W / 2 + (j - (m - 1) / 2) * st, L.H - 118 + r * 52, L.cw * 0.9]; }
      return [L.W / 2 + (i - (n - 1) / 2) * L.step, L.H - 92, L.cw];
    },
    draw(G, c) {
      const s = G.s, L = this.L(G), W = L.W, H = L.H; s.btns = [];
      const g = c.createRadialGradient(W / 2, H * 0.42, 30, W / 2, H * 0.42, H * 0.8); g.addColorStop(0, "#5b3a9c"); g.addColorStop(1, "#24133f"); c.fillStyle = g; c.fillRect(0, 0, W, H);
      G.hud(c, `YOU ${s.score[0]}`, `HAND ${s.hand} · TO ${TARGET}`, `${s.dir > 0 ? "↻" : "↺"}`);
      // opponents
      [1, 2, 3].forEach(p => {
        const [x, y] = this.pos(G, p), turn = s.turn === p && s.phase === "play";
        if (turn) { c.fillStyle = "rgba(255,210,63,0.35)"; c.beginPath(); c.arc(x, y, 30, 0, 7); c.fill(); }
        if (FACES[p][0] === ":") G.img(c, FACES[p], x, y, 46); else G.emoji(c, FACES[p], x, y, 38);
        G.text(c, `${NAMES[p]} ${s.score[p]}`, x, y + 32, 9, "#fff");
        const n = s.hands[p].length, show = Math.min(n, 10);
        for (let i = 0; i < show; i++) { if (p === 2) card(c, x + 56 + i * 7, y - 6, 22, null, false); else card(c, x + (p === 1 ? 6 : -6), y + 50 + i * 6, 22, null, false, { rot: p === 1 ? 1.57 : -1.57 }); }
        c.fillStyle = n === 1 ? "#ff5252" : "#fff"; c.font = "800 13px system-ui, sans-serif"; c.textAlign = "center"; c.textBaseline = "middle";
        c.fillText(n === 1 ? "1 card!" : `${n} cards`, p === 2 ? x + 56 + show * 3.5 : x, p === 2 ? y + 22 : y + 50 + show * 6 + 30);
        const b = s.say[p]; if (b) { const bw = Math.max(70, b.txt.length * 7.5 + 18), bx = Math.max(4, Math.min(W - bw - 4, x - bw / 2)), by = p === 2 ? y + 52 : y - 46; c.fillStyle = "#fff"; rr(c, bx, by - 13, bw, 26, 13); c.fill(); c.fillStyle = "#222"; c.font = "800 13px system-ui, sans-serif"; c.fillText(b.txt, bx + bw / 2, by + 1); }
      });
      // center: deck + discard + current color
      const dx = L.cx - 46, px = L.cx + 46, cy = L.cy, pw = 64;
      c.strokeStyle = COLS[s.color] || "#fff"; c.lineWidth = 6; c.beginPath(); c.arc(px, cy, pw * 0.95, 0, 7); c.stroke();
      card(c, dx, cy, pw, null, false, { hl: s.turn === 0 && s.phase === "play" && !s.pick && !s.hands[0].some(k => this.legal(s, 0, k)) });
      s.btns.push({ x: dx - pw / 2, y: cy - pw * 0.75, w: pw, h: pw * 1.5, k: "deck" });
      const pl = s.pile.slice(-3);
      pl.forEach((k, i) => { const last = i === pl.length - 1; if (last && s.fly) return; card(c, px + (i - pl.length + 1) * 3, cy + (i - pl.length + 1) * 2, pw, k, true, { chosen: k.chosen, rot: ((k.v === "W" ? 3 : String(k.v).charCodeAt(0)) % 7 - 3) * 0.04 }); });
      if (s.fly) { const e = 1 - Math.pow(1 - Math.min(1, s.fly.t), 3); card(c, s.fly.x + (px - s.fly.x) * e, s.fly.y + (cy - s.fly.y) * e, pw * (0.8 + 0.2 * e), s.fly.k, true, { chosen: s.fly.k.chosen }); }
      G.text(c, `COLOR: ${CNAME[s.color] || "?"}`, L.cx, cy + pw * 0.95 + 18, 10, COLS[s.color] || "#fff");
      if (s.msg) { c.fillStyle = "rgba(255,255,255,0.9)"; c.font = "700 13px system-ui, sans-serif"; c.textAlign = "center"; c.fillText(s.msg, W / 2, cy - pw * 0.95 - 16, W - 20); }
      // your hand
      const myTurn = s.turn === 0 && s.phase === "play" && !s.pick;
      s.hands[0].forEach((k, i) => {
        const [x, y, w] = this.handPos(G, i), ok = myTurn && this.legal(s, 0, k);
        card(c, x, y - (ok ? 12 : 0), w, k, true, { chosen: null, dim: myTurn && !ok, hl: ok });
        s.btns.push({ x: x - L.step / 2 - (i === s.hands[0].length - 1 ? w / 2 : 0), y: y - w * 0.75 - 12, w: i === s.hands[0].length - 1 ? w : Math.max(L.step, 18), h: w * 1.5 + 12, i, cx: x });
      });
      if (s.say[0]) G.text(c, s.say[0].txt, W / 2, H - 170, 12, "#ffd23f");
      // buttons: BARK! and pass (after drawing a card you can't or won't play)
      const by = H - 30;
      if (myTurn && s.hands[0].length === 2) { const on = s.barked; c.fillStyle = on ? "#43a047" : "#ff5252"; rr(c, 10, by - 20, 100, 40, 20); c.fill(); G.text(c, on ? "BARKED ✓" : "BARK!", 60, by, 11, "#fff"); s.btns.push({ x: 10, y: by - 20, w: 100, h: 40, k: "bark" }); }
      if (myTurn && s.drawn === 0) { c.fillStyle = "#fff"; rr(c, W - 110, by - 20, 100, 40, 20); c.fill(); G.text(c, "PASS", W - 60, by, 11, "#222"); s.btns.push({ x: W - 110, y: by - 20, w: 100, h: 40, k: "pass" }); }
      if (myTurn) G.text(c, "YOUR TURN", W / 2, by, 10, "#ffd23f");
      G.hint(c, "TAP A GLOWING CARD · TAP THE DECK TO DRAW", 5, cy + pw * 0.95 + 46);
      // wild color picker
      if (s.pick) {
        c.fillStyle = "rgba(0,0,0,0.6)"; c.fillRect(0, 0, W, H); G.text(c, "PICK A COLOR", W / 2, H * 0.3, 14, "#fff");
        const sz = Math.min(120, (W - 60) / 2);
        for (let q = 0; q < 4; q++) { const x = W / 2 + (q % 2 ? 6 : -sz - 6), y = H * 0.36 + (q > 1 ? sz + 12 : 0); c.fillStyle = COLS[q]; rr(c, x, y, sz, sz, 16); c.fill(); G.text(c, CNAME[q], x + sz / 2, y + sz / 2, 11, "#fff"); s.btns.unshift({ x, y, w: sz, h: sz, color: q }); }
      }
      // between hands
      if (s.phase === "between" || s.phase === "scoring" || s.phase === "over") {
        c.fillStyle = "rgba(0,0,0,0.65)"; c.fillRect(0, 0, W, H);
        const w = s.last ? s.last.w : s.winner;
        G.banner(c, w === 0 ? "YOU WIN THE HAND!" : `${NAMES[w]} WINS THE HAND`, w === 0 ? "#ffd23f" : "#fff", H * 0.3, 16);
        if (s.last) G.text(c, `+${s.last.gain} POINTS`, W / 2, H * 0.37, 12, "#fff");
        [0, 1, 2, 3].forEach((p, i) => G.text(c, `${NAMES[p]}  ${s.score[p]}`, W / 2, H * 0.45 + i * 26, 12, p === 0 ? "#ffd23f" : "#fff"));
        if (s.phase === "between") { c.fillStyle = "#ffd23f"; rr(c, W / 2 - 90, H * 0.67, 180, 48, 24); c.fill(); G.text(c, "NEXT HAND", W / 2, H * 0.67 + 24, 12, "#222"); s.btns.unshift({ x: W / 2 - 90, y: H * 0.67, w: 180, h: 48, k: "nexthand" }); }
      }
    },
    tap(G, x, y) {
      const s = G.s;
      const hits = s.btns.filter(b => x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h); if (!hits.length) return;
      let b = hits[0];
      if (b.i !== undefined) { const cards = hits.filter(h => h.i !== undefined); b = cards.reduce((a, h) => Math.abs(h.cx - x) < Math.abs(a.cx - x) ? h : a, cards[0]); }
      if (b.k === "nexthand") { this.deal(G); return; }
      if (s.pick) { if (b.color !== undefined) { const i = s.pick.i; s.pick = false; this.play(G, 0, i, b.color); } return; }
      if (s.turn !== 0 || s.phase !== "play" || s.wait > 0) return;
      if (b.k === "bark") { s.barked = true; this.say(s, 0, "BARK! 🐶"); G.sfx("pop"); return; }
      if (b.k === "pass") { s.drawn = null; s.msg = "You pass"; s.turn = this.next(s, 1); s.wait = 0.6; return; }
      if (b.k === "deck") {
        if (s.drawn === 0) { s.msg = "Play the card you drew or PASS"; return; }
        this.drawCards(s, 0, 1); s.drawn = 0; G.sfx("pop");
        if (!s.hands[0].some(k => this.legal(s, 0, k))) { s.msg = "Nothing fits. Your turn passes."; s.drawn = null; s.turn = this.next(s, 1); s.wait = 0.9; }
        else s.msg = "You drew. Play a glowing card or PASS.";
        return;
      }
      if (b.i !== undefined) {
        const k = s.hands[0][b.i];
        if (!this.legal(s, 0, k)) { s.msg = k.v === "F" && this.fits(s, k) ? "Wild +4 only when you have no " + CNAME[s.color] : `Doesn't match ${CNAME[s.color]} or ${long(this.top(s))}`; G.buzz(); return; }
        if (k.c === 4) { s.pick = { i: b.i }; return; }
        this.play(G, 0, b.i);
      }
    },
    onKey(G, k, d) { if (d && k === " " && G.s.turn === 0) this.tap(G, G.W / 2 - 46, G.H * 0.43); }
  });
})();
