// ---------- 7 Up 7 Down (The Den: the Sevens / Fan Tan card game) ----------
// You vs three CPU pups, 13 cards each. The 7 of diamonds opens. On your turn play a 7 to start a suit, or the next card
// up or down on a suit that's already out (8, 9 ... K going up, 6, 5 ... A going down). If you can play you must; if not, you knock.
// First one out wins the hand and everyone else takes a point per card left. 3 hands, lowest total wins.
(function () {
  const NAMES = ["YOU", "REX", "BISCUIT", "DUKE"], FACES = [null, "🐕", ":dawgpog:", "🐶"];
  const HANDS = 3, COLS = [0, 1, 3, 2];              // board columns left to right: ♠ ♥ ♣ ♦ (suit numbers follow G.SUIT)
  const who = p => p === 0 ? "You" : NAMES[p];
  const rr = (c, x, y, w, h, r) => { c.beginPath(); if (c.roundRect) c.roundRect(x, y, w, h, r); else c.rect(x, y, w, h); };

  defGame({
    key: "sevens", name: "7 Up 7 Down", icon: "7️⃣", max: 1000, cat: "den",
    blurb: "Build up and down from the 7s. First one out wins.",
    how: "You vs Rex, Biscuit and Duke, 13 cards each. Whoever holds the 7 of diamonds starts with it. On your turn, play a 7 to open a new suit, or add the next card to a suit that's already on the table: up from the 7 (8, 9, 10, J, Q, K) or down from it (6, 5, 4, 3, 2, A). If you have a card that fits you have to play one, but you pick which, so hang on to the cards the pups are waiting for. Nothing fits? You knock and it moves on. First one out of cards wins the hand, and everyone else takes 1 point for each card they're stuck with. Three hands, lowest total wins. Score: 900 minus 25 per card you got stuck with, +100 for winning the match.",
    save(G) {
      const s = G.s; if (s.phase !== "play") return null;
      const v = JSON.parse(JSON.stringify(Object.assign({}, s, { btns: [], fly: null, say: [null, null, null, null] })));
      return { label: `Hand ${s.hand} of ${HANDS} · you ${s.score[0]}`, v };
    },
    load(G, sv) { Object.assign(G.s, sv.v); G.s.wait = 0.6; G.s.msg = "Welcome back."; },
    reset(G) {
      G.s = { score: [0, 0, 0, 0], hand: 0, say: [null, null, null, null], btns: [], msg: "", fly: null, t: 0 };
      this.deal(G);
    },
    deal(G) {
      const s = G.s, d = []; s.hand++;
      for (let su = 0; su < 4; su++) for (let r = 1; r <= 13; r++) d.push({ s: su, r });
      for (let i = d.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [d[i], d[j]] = [d[j], d[i]]; }
      s.hands = [0, 1, 2, 3].map(p => d.slice(p * 13, p * 13 + 13));
      s.hands[0].sort((a, b) => COLS.indexOf(a.s) - COLS.indexOf(b.s) || a.r - b.r);
      s.lo = [0, 0, 0, 0]; s.hi = [0, 0, 0, 0]; s.first = true; s.lastK = null; s.winner = -1; s.phase = "play"; s.wait = 0.9;
      s.turn = s.hands.findIndex(h => h.some(k => k.s === 2 && k.r === 7));
      s.msg = `${who(s.turn)} ${s.turn ? "has" : "have"} the 7♦ and ${s.turn ? "starts" : "start"}`;
    },
    legal(s, k) {
      if (s.first) return k.s === 2 && k.r === 7;
      return s.lo[k.s] ? k.r === s.lo[k.s] - 1 || k.r === s.hi[k.s] + 1 : k.r === 7;
    },
    say(s, p, txt) { s.say[p] = { txt, t: 1.4 }; },
    seat(G, p) { return p === 0 ? [G.W / 2, G.H - 90] : [G.W * (2 * p - 1) / 6, 60]; },
    play(G, p, i) {
      const s = G.s, k = s.hands[p].splice(i, 1)[0], from = p === 0 ? this.handPos(G, Math.min(i, s.hands[0].length)) : this.seat(G, p);
      if (k.r === 7) s.lo[k.s] = s.hi[k.s] = 7; else if (k.r < 7) s.lo[k.s] = k.r; else s.hi[k.s] = k.r;
      s.first = false; s.lastK = k; s.fly = { k, x: from[0], y: from[1], t: 0 }; G.sfx("pop");
      s.msg = `${who(p)} played ${G.rankTxt(k.r)}${G.SUIT[k.s]}`;
      if (!s.hands[p].length) { s.winner = p; s.phase = "handEnd"; s.wait = 1.3; return; }
      if (s.hands[p].length === 1 && p) this.say(s, p, "1 left!");
      s.turn = (s.turn + 1) % 4; s.wait = p === 0 ? 0.7 : 0.9;
    },
    knock(G, p) { const s = G.s; this.say(s, p, "Knock ✊"); s.msg = `${who(p)} can't play`; s.turn = (s.turn + 1) % 4; s.wait = p === 0 ? 1.2 : 0.8; },
    // CPU: play the card that opens the most road for its own cards; when a card only helps the others, give away as little as possible.
    worth(h, k) {
      const mine = h.filter(x => x !== k && x.s === k.s && (k.r === 7 || (k.r > 7 ? x.r > k.r : x.r < k.r)));
      if (mine.length) return mine.length * 3 + Math.max(...mine.map(x => Math.abs(x.r - k.r)));
      return k.r === 7 ? -6 : k.r === 1 || k.r === 13 ? 2 : -(k.r > 7 ? 13 - k.r : k.r - 1);
    },
    cpu(G, p) {
      const s = G.s, h = s.hands[p], opts = h.filter(k => this.legal(s, k));
      if (!opts.length) return this.knock(G, p);
      opts.sort((a, b) => this.worth(h, b) - this.worth(h, a) + (Math.random() - 0.5) * 0.5);
      this.play(G, p, h.indexOf(opts[0]));
    },
    endHand(G) {
      const s = G.s, w = s.winner, left = s.hands.map(h => h.length);
      left.forEach((n, p) => s.score[p] += n); s.last = { w, left };
      G.sfx(w === 0 ? "win" : "lose");
      if (s.hand >= HANDS) {
        s.phase = "over"; const low = Math.min(...s.score), won = s.score[0] === low;
        setTimeout(() => G.over(Math.max(0, 900 - 25 * s.score[0]) + (won ? 100 : 0), won ? "Top dog! 🐶" : `${NAMES[s.score.indexOf(low)]} wins the match.`), 1600);
        return;
      }
      s.phase = "between";
    },
    update(G, dt) {
      const s = G.s; s.t += dt;
      s.say.forEach((b, i) => { if (b) { b.t -= dt; if (b.t <= 0) s.say[i] = null; } });
      if (s.fly) { s.fly.t += dt * 4; if (s.fly.t >= 1) s.fly = null; }
      if (s.wait > 0) { s.wait -= dt; if (s.wait > 0) return; }
      if (s.phase === "handEnd") { s.phase = "scoring"; return this.endHand(G); }
      if (s.phase !== "play") return;
      if (s.turn !== 0) this.cpu(G, s.turn);
      else if (!s.hands[0].some(k => this.legal(s, k))) this.knock(G, 0);
    },
    // Board: one column per suit, king at the top down to the ace, each card showing its top strip (like the table at home).
    L(G) {
      const W = G.W, H = G.H, top = 122, bh = H - 190 - top;
      const cw = Math.max(30, Math.min(56, (W - 32) / 4 - 10, bh / 5)), ch = cw * 1.4, step = Math.min(ch * 0.32, (bh - ch) / 12);
      const y0 = top + (bh - ch - step * 12) / 2 + ch / 2, gap = Math.min(cw + 26, (W - 16) / 4);
      const hw = Math.min(62, Math.max(44, (W - 20) / 6.5));
      return { W, H, cw, ch, step, y0, gap, hw };
    },
    slot(G, k) { const L = this.L(G); return [L.W / 2 + (COLS.indexOf(k.s) - 1.5) * L.gap, L.y0 + (13 - k.r) * L.step]; },
    handPos(G, i) {
      const L = this.L(G), n = Math.max(1, G.s.hands[0].length), st = n > 1 ? Math.min(L.hw * 0.78, (L.W - 20 - L.hw) / (n - 1)) : 0;
      return [L.W / 2 + (i - (n - 1) / 2) * st, L.H - 90, L.hw, st];
    },
    draw(G, c) {
      const s = G.s, L = this.L(G), W = L.W, H = L.H; s.btns = [];
      const g = c.createRadialGradient(W / 2, H * 0.45, 30, W / 2, H * 0.45, H * 0.8); g.addColorStop(0, "#1f7a4d"); g.addColorStop(1, "#0c3a26"); c.fillStyle = g; c.fillRect(0, 0, W, H);
      G.hud(c, `YOU ${s.score[0]}`, `HAND ${s.hand} OF ${HANDS}`, "LOW WINS");
      [1, 2, 3].forEach(p => {
        const [x, y] = this.seat(G, p), n = s.hands[p].length;
        if (s.turn === p && s.phase === "play") { c.fillStyle = "rgba(255,210,63,0.4)"; c.beginPath(); c.arc(x, y, 24, 0, 7); c.fill(); }
        if (FACES[p][0] === ":") G.img(c, FACES[p], x, y, 38); else G.emoji(c, FACES[p], x, y, 32);
        G.text(c, `${NAMES[p]} ${s.score[p]}`, x, y + 28, 8, "#fff");
        c.fillStyle = n === 1 ? "#ff8a80" : "rgba(255,255,255,0.85)"; c.font = "800 12px system-ui, sans-serif"; c.textAlign = "center"; c.textBaseline = "middle";
        c.fillText(n === 1 ? "1 card!" : `${n} cards`, x, y + 44);
        const b = s.say[p]; if (b) { const bw = b.txt.length * 7.5 + 20; c.fillStyle = "#fff"; rr(c, x - bw / 2, y - 13, bw, 26, 13); c.fill(); c.fillStyle = "#222"; c.font = "800 13px system-ui, sans-serif"; c.fillText(b.txt, x, y + 1); }
      });
      // the four suit columns
      COLS.forEach(su => {
        if (!s.lo[su]) {
          const [x, y] = this.slot(G, { s: su, r: 7 });
          c.strokeStyle = "rgba(255,255,255,0.3)"; c.lineWidth = 2; c.setLineDash([5, 4]); rr(c, x - L.cw / 2, y - L.ch / 2, L.cw, L.ch, L.cw * 0.12); c.stroke(); c.setLineDash([]);
          c.fillStyle = "rgba(255,255,255,0.4)"; c.font = `800 ${Math.round(L.cw * 0.34)}px system-ui, sans-serif`; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText("7" + G.SUIT[su], x, y);
          return;
        }
        for (let r = s.hi[su]; r >= s.lo[su]; r--) {
          const k = { s: su, r }, last = s.lastK && s.lastK.s === su && s.lastK.r === r;
          if (last && s.fly) continue;
          const [x, y] = this.slot(G, k); G.card(c, x, y, L.cw, k, true, { hl: last });
        }
      });
      if (s.fly) { const [tx, ty] = this.slot(G, s.fly.k), e = 1 - Math.pow(1 - Math.min(1, s.fly.t), 3); G.card(c, s.fly.x + (tx - s.fly.x) * e, s.fly.y + (ty - s.fly.y) * e, L.cw, s.fly.k, true, { hl: true }); }
      if (s.msg) { c.fillStyle = "rgba(255,255,255,0.92)"; c.font = "700 13px system-ui, sans-serif"; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText(s.msg, W / 2, H - 172, W - 20); }
      // your hand
      const myTurn = s.turn === 0 && s.phase === "play", n = s.hands[0].length;
      s.hands[0].forEach((k, i) => {
        const [x, y, w, st] = this.handPos(G, i), ok = myTurn && this.legal(s, k), end = i === n - 1;
        G.card(c, x, y - (ok ? 14 : 0), w, k, true, { dim: myTurn && !ok, hl: ok });
        s.btns.push({ x: x - w / 2, y: y - w * 0.7 - 14, w: end ? w : Math.max(st, 18), h: w * 1.4 + 14, i });
      });
      if (s.say[0]) G.text(c, s.say[0].txt, W / 2, H - 150, 11, "#ffd23f");
      if (myTurn) G.text(c, "YOUR TURN · TAP A GLOWING CARD", W / 2, H - 22, 8, "#ffd23f");
      if (s.phase === "between" || s.phase === "scoring" || s.phase === "over") {
        c.fillStyle = "rgba(0,0,0,0.7)"; c.fillRect(0, 0, W, H);
        const w = s.last ? s.last.w : s.winner;
        G.banner(c, w === 0 ? "YOU WENT OUT!" : `${NAMES[w]} WENT OUT`, w === 0 ? "#ffd23f" : "#fff", H * 0.28, 15);
        if (s.last) [0, 1, 2, 3].forEach((p, i) => G.text(c, `${NAMES[p]}  +${s.last.left[p]}  =  ${s.score[p]}`, W / 2, H * 0.4 + i * 28, 11, p === 0 ? "#ffd23f" : "#fff"));
        if (s.phase === "between") { c.fillStyle = "#ffd23f"; rr(c, W / 2 - 90, H * 0.66, 180, 48, 24); c.fill(); G.text(c, "NEXT HAND", W / 2, H * 0.66 + 24, 12, "#222"); s.btns = [{ x: W / 2 - 90, y: H * 0.66, w: 180, h: 48, k: "nexthand" }]; }
      }
    },
    tap(G, x, y) {
      const s = G.s, hits = s.btns.filter(b => x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h); if (!hits.length) return;
      const b = hits[hits.length - 1];                // cards overlap left to right, so the last hit is the one on top
      if (b.k === "nexthand") return this.deal(G);
      if (s.turn !== 0 || s.phase !== "play" || s.wait > 0) return;
      const k = s.hands[0][b.i];
      if (!this.legal(s, k)) { s.msg = s.first ? "The 7♦ has to go first" : `${G.rankTxt(k.r)}${G.SUIT[k.s]} doesn't fit yet`; G.buzz(); return; }
      this.play(G, 0, b.i);
    }
  });
})();
