// ---------- Dawg Cribbage (you vs Old Tom the cat) ----------
// Two-player cribbage to 121: discard 2 to the crib, cut, peg to 31, count hands and crib. Skunks pay extra.
(function () {
  const WIN = 121, OPP = "OLD TOM";
  const val = c => Math.min(10, c.r);
  const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const nm = c => G.rankTxt(c.r) + G.SUIT[c.s];
  // score a 4-card hand (+ starter). Returns { total, items: [[label, pts]] }
  function count(hand, st, crib) {
    const all = st ? hand.concat([st]) : hand.slice(), items = []; let total = 0;
    const add = (l, p) => { items.push([l, p]); total += p; };
    let f = 0; const n = all.length;
    for (let m = 1; m < (1 << n); m++) { let sum = 0; for (let i = 0; i < n; i++) if (m & (1 << i)) sum += val(all[i]); if (sum === 15) f++; }
    for (let i = 0; i < f; i++) add(`Fifteen ${total + 2}`, 2);
    const byR = {}; all.forEach(c => byR[c.r] = (byR[c.r] || 0) + 1);
    Object.keys(byR).forEach(r => { const k = byR[r]; if (k === 2) add(`Pair of ${G.rankTxt(+r)}s`, 2); if (k === 3) add(`Three ${G.rankTxt(+r)}s`, 6); if (k === 4) add(`Four ${G.rankTxt(+r)}s!`, 12); });
    for (let lo = 1; lo <= 13; lo++) { if (!byR[lo] || byR[lo - 1]) continue; let len = 0, mult = 1; while (byR[lo + len]) { mult *= byR[lo + len]; len++; } if (len >= 3) for (let i = 0; i < mult; i++) add(`Run of ${len}`, len); }
    const s0 = hand[0].s; if (hand.every(c => c.s === s0)) { if (st && st.s === s0) add("Flush of 5", 5); else if (!crib) add("Flush", 4); }
    if (st && hand.some(c => c.r === 11 && c.s === st.s)) add("His nobs", 1);
    return { total, items };
  }
  // points for the card just played in pegging
  function pegPts(seq, cnt) {
    const out = []; if (cnt === 15) out.push(["Fifteen", 2]); if (cnt === 31) out.push(["Thirty-one", 2]);
    let k = 1; while (k < seq.length && seq[seq.length - 1 - k].r === seq[seq.length - 1].r) k++;
    if (k >= 2) out.push([k === 2 ? "Pair" : k === 3 ? "Three of a kind" : "Four of a kind", k === 2 ? 2 : k === 3 ? 6 : 12]);
    for (let L = seq.length; L >= 3; L--) { const t = seq.slice(-L).map(c => c.r).sort((a, b) => a - b); if (t.every((r, i) => i === 0 || r === t[i - 1] + 1)) { out.push([`Run of ${L}`, L]); break; } }
    return out;
  }
  defGame({
    key: "crib", name: "Dawg Cribbage", icon: "🎯", max: 500,
    blurb: "Cribbage vs Old Tom the cat. First to 121.",
    how: "Two-player cribbage against Old Tom. Tap 2 cards to send to the crib, then TO CRIB. Then peg: take turns playing cards without going over 31 (15 and 31 = 2, pairs, runs, last card = 1). If you can't play, it's a Go. Then hands and the crib are counted for you, step by step. First to 121 wins; win before Tom reaches 91 for a skunk. Score: win = 100 + what you win by (+100 for a skunk).",
    // Save & continue at the start of each deal.
    save(G) { const s = G.s; if (s.phase !== "discard" || s.hand < 2 || s.sel.length) return null; return { label: `${s.score[0]}–${s.score[1]}`, score: s.score.slice(), dealer: s.dealer, hand: s.hand }; },
    load(G, v) { const s = G.s; s.score = v.score.slice(); s.back = v.score.slice(); s.dealer = 1 - v.dealer; s.hand = v.hand - 1; this.deal(G); },
    reset(G) { G.s = { score: [0, 0], back: [0, 0], dealer: 0, pops: [], btns: [], hand: 0, sel: [], crib: [], hands: [[], []] }; this.cutForDeal(G); },
    // Cut for deal: everyone picks a card from the spread; low card deals (aces are low). Ties cut again.
    cutForDeal(G) {
      const s = G.s, d = []; for (let su = 0; su < 4; su++) for (let r = 1; r <= 13; r++) d.push({ r, s: su }); shuffle(d);
      s.spread = d.slice(0, 18); s.picks = [null, null]; s.phase = "cutdeal"; s.wait = 0; s.msg = "Cut for deal: pick a card. Low card deals.";
    },
    pickCut(G, i) {
      const s = G.s; if (s.picks[0] || !s.spread[i]) return;
      s.picks[0] = s.spread[i]; s.spread[i] = null; G.sfx("pop");
      const left = s.spread.map((c, k) => c ? k : -1).filter(k => k >= 0), j = left[Math.floor(Math.random() * left.length)];
      s.picks[1] = s.spread[j]; s.spread[j] = null; s.wait = 2.2;
      const a = s.picks[0].r, b = s.picks[1].r;
      s.msg = a === b ? "Tie! Cut again." : a < b ? "You cut low. Your deal (and your crib)!" : "Tom cut low. Tom deals.";
    },
    deal(G) {
      const s = G.s; s.dealer = 1 - s.dealer; s.hand++;
      const d = []; for (let su = 0; su < 4; su++) for (let r = 1; r <= 13; r++) d.push({ r, s: su }); shuffle(d);
      s.deck = d; s.hands = [d.slice(0, 6), d.slice(6, 12)]; s.sel = []; s.crib = []; s.starter = null; s.show = null;
      s.hands[0].sort((a, b) => a.r - b.r || a.s - b.s);
      s.phase = "discard"; s.wait = 0; s.msg = s.dealer === 0 ? "Your crib. Pick 2 cards to keep for yourself." : "Tom's crib. Pick 2 cards to give away.";
      this.cpuDiscard(G);
    },
    cpuDiscard(G) {
      const s = G.s, h = s.hands[1], mine = s.dealer === 1, rest = s.deck.slice(12);
      let best = null, bv = -1e9;
      for (let i = 0; i < 6; i++) for (let j = i + 1; j < 6; j++) {
        const keep = h.filter((_, k) => k !== i && k !== j), toss = [h[i], h[j]];
        let ev = 0; for (let k = 0; k < rest.length; k += 2) ev += count(keep, rest[k], false).total; ev /= Math.ceil(rest.length / 2);
        let cv = (val(toss[0]) + val(toss[1]) === 15 ? 2 : 0) + (toss[0].r === toss[1].r ? 2 : 0) + (toss.filter(c => c.r === 5).length * 1.5) + (Math.abs(toss[0].r - toss[1].r) === 1 ? 0.6 : 0);
        const v = ev + (mine ? cv : -cv); if (v > bv) { bv = v; best = { keep, toss }; }
      }
      s.cpuToss = best.toss; s.cpuKeep = best.keep;
    },
    toCrib(G) {
      const s = G.s; if (s.sel.length !== 2) return;
      s.crib = s.sel.slice().concat(s.cpuToss); s.hands[0] = s.hands[0].filter(c => !s.sel.includes(c)); s.hands[1] = s.cpuKeep;
      s.sel = []; G.sfx("pop");
      s.starter = s.deck[12 + Math.floor(Math.random() * 40)]; s.phase = "cut"; s.wait = 1.2;
      s.msg = `Cut: ${nm(s.starter)}`;
      if (s.starter.r === 11) { this.peg(G, s.dealer, 2, "His heels"); }
    },
    peg(G, p, pts, why) {
      const s = G.s; if (!pts || s.phase === "over") return;
      s.back[p] = s.score[p]; s.score[p] = Math.min(WIN, s.score[p] + pts);
      s.pops.push({ p, txt: `${why} +${pts}`, t: 1.6 }); G.sfx(p === 0 ? "win" : "pop");
      if (s.score[p] >= WIN) this.finish(G, p);
    },
    finish(G, p) {
      const s = G.s; s.phase = "over"; s.wait = 2.2; s.winner = p;
      const o = s.score[1 - p]; s.skunk = o < 61 ? 2 : o < 91 ? 1 : 0;
    },
    startPeg(G) {
      const s = G.s; s.phase = "peg"; s.cnt = 0; s.seq = []; s.pile = []; s.played = [[], []]; s.left = [s.hands[0].slice(), s.hands[1].slice()];
      s.turn = 1 - s.dealer; s.goSaid = [false, false]; s.last = -1; s.wait = 0.8; s.msg = s.turn === 0 ? "You lead." : `${OPP} leads.`;
      s.left[0].sort((a, b) => a.r - b.r);
    },
    canPlay(G, p) { const s = G.s; return s.left[p].some(c => s.cnt + val(c) <= 31); },
    playPeg(G, p, c) {
      const s = G.s; s.left[p].splice(s.left[p].indexOf(c), 1); s.cnt += val(c); s.seq.push(c); s.pile.push({ c, p, a: 0 }); s.last = p;
      pegPts(s.seq, s.cnt).forEach(([l, v]) => this.peg(G, p, v, l)); if (s.phase === "over") return;
      G.sfx("pop");
      if (s.cnt === 31) return this.resetCount(G, p, true);
      this.advance(G, 1 - p);
    },
    advance(G, nx) {
      const s = G.s;
      if (!s.left[0].length && !s.left[1].length) { if (s.cnt !== 31) this.peg(G, s.last, 1, "Last card"); if (s.phase === "over") return; s.phase = "pegdone"; s.wait = 1.4; return; }
      if (this.canPlay(G, nx)) { s.turn = nx; s.wait = nx === 1 ? 0.9 : 0; return; }
      if (this.canPlay(G, 1 - nx)) { s.pops.push({ p: nx, txt: "Go", t: 1 }); s.turn = 1 - nx; s.wait = 0.9; return; }
      // nobody can play: last player gets 1 for the go
      this.peg(G, s.last, 1, "Go"); if (s.phase === "over") return; this.resetCount(G, s.last, false);
    },
    resetCount(G, p, was31) {
      const s = G.s; s.cnt = 0; s.seq = []; s.wait = 1.0; s.clearPile = true;
      const nx = 1 - p; if (!s.left[0].length && !s.left[1].length) { s.phase = "pegdone"; s.wait = 1.4; return; }
      s.turn = s.left[nx].length ? nx : p;
    },
    cpuPeg(G) {
      const s = G.s, opts = s.left[1].filter(c => s.cnt + val(c) <= 31);
      let best = null, bv = -1e9;
      opts.forEach(c => {
        const cnt = s.cnt + val(c); let v = pegPts(s.seq.concat([c]), cnt).reduce((a, b) => a + b[1], 0) * 10;
        if (cnt === 5 || cnt === 21) v -= 4; if (cnt < 15 && cnt + 10 === 15) v -= 3; if (s.cnt === 0 && c.r === 5) v -= 5; v -= val(c) * 0.15;
        if (v > bv) { bv = v; best = c; }
      });
      this.playPeg(G, 1, best);
    },
    startShow(G) {
      const s = G.s, nd = 1 - s.dealer;
      s.steps = [{ who: nd, cards: s.hands[nd], crib: false }, { who: s.dealer, cards: s.hands[s.dealer], crib: false }, { who: s.dealer, cards: s.crib, crib: true }];
      s.phase = "show"; s.step = 0; this.showStep(G);
    },
    showStep(G) {
      const s = G.s, st = s.steps[s.step], r = count(st.cards, s.starter, st.crib);
      s.show = { who: st.who, cards: st.cards, crib: st.crib, items: r.items, total: r.total, rev: 0, revT: 0.5 };
      s.wait = 0.2;
    },
    nextShow(G) {
      const s = G.s, sh = s.show; this.peg(G, sh.who, sh.total, sh.crib ? "Crib" : "Hand"); if (s.phase === "over") return;
      s.step++; if (s.step < 3) this.showStep(G); else { s.show = null; this.deal(G); }
    },
    update(G, dt) {
      const s = G.s; s.pops.forEach(q => q.t -= dt); s.pops = s.pops.filter(q => q.t > 0);
      (s.pile || []).forEach(q => q.a = Math.min(1, q.a + dt * 4));
      if (s.show && s.show.rev < s.show.items.length) { s.show.revT -= dt; if (s.show.revT <= 0) { s.show.rev++; s.show.revT = 0.55; G.sfx("pop"); } }
      if (s.wait > 0) { s.wait -= dt; if (s.wait > 0) return; }
      if (s.phase === "over") { const p = s.winner, m = s.score[p] - s.score[1 - p]; G.over(p === 0 ? Math.min(500, 100 + m + 100 * s.skunk) : Math.floor(s.score[0] / 2), p === 0 ? (s.skunk === 2 ? "DOUBLE SKUNK! 🦨🦨" : s.skunk ? "SKUNKED HIM! 🦨" : `You win by ${m}!`) : (s.skunk ? "Tom skunked you. 🦨" : `Tom wins by ${m}.`)); return; }
      if (s.phase === "cut") return this.startPeg(G);
      if (s.phase === "cutdeal" && s.picks[1]) { const a = s.picks[0].r, b = s.picks[1].r; if (a === b) return this.cutForDeal(G); s.dealer = a < b ? 1 : 0; return this.deal(G); } // deal() flips the dealer
      if (s.phase === "pegdone") return this.startShow(G);
      if (s.clearPile) { s.clearPile = false; s.pile = []; }
      if (s.phase === "peg") {
        if (s.turn === 1) this.cpuPeg(G);
        else if (!this.canPlay(G, 0)) { s.pops.push({ p: 0, txt: "Go", t: 1 }); this.advance(G, 1); }
      }
    },
    L(G) { const W = G.W, H = G.H, cw = Math.min(66, (W - 24) / 4.6); return { W, H, cw, ch: cw * 1.4, hy: H - cw * 0.7 - 14, cy: H * 0.5 }; },
    handPos(G) {
      const s = G.s, L = this.L(G), h = s.phase === "discard" ? s.hands[0] : s.phase === "peg" || s.phase === "pegdone" ? s.left[0] : s.hands[0], n = h.length;
      const gap = Math.min(L.cw * 1.02, (L.W - 20 - L.cw) / Math.max(1, n - 1)), x0 = L.W / 2 - gap * (n - 1) / 2;
      return h.map((c, i) => { const ok = s.phase !== "peg" || (s.turn === 0 && s.cnt + val(c) <= 31); return { c, x: x0 + i * gap, y: L.hy - (s.sel.includes(c) ? 22 : 0) - (s.phase === "peg" && s.turn === 0 && ok && !(s.wait > 0) ? 10 : 0), ok }; });
    },
    tap(G, x, y) {
      const s = G.s;
      if (s.phase === "show" && s.show && s.show.rev >= s.show.items.length && !(s.wait > 0)) { this.nextShow(G); return; }
      if (s.phase === "show" && s.show) { s.show.rev = s.show.items.length; return; }
      const b = s.btns.find(b => x > b.x && x < b.x + b.w && y > b.y && y < b.y + b.h); if (b) { b.fn(); return; }
      if (s.phase === "cutdeal") { const sp = this.spreadPos(G); for (let i = sp.length - 1; i >= 0; i--) { const q = sp[i]; if (q.c && Math.abs(x - q.x) < 16 && Math.abs(y - q.y) < 34) { this.pickCut(G, i); return; } } return; }
      const L = this.L(G), pos = this.handPos(G);
      for (let i = pos.length - 1; i >= 0; i--) {
        const q = pos[i]; if (Math.abs(x - q.x) > L.cw / 2 || Math.abs(y - q.y) > L.ch / 2) continue;
        if (s.phase === "discard") { const k = s.sel.indexOf(q.c); if (k >= 0) s.sel.splice(k, 1); else if (s.sel.length < 2) s.sel.push(q.c); G.sfx("pop"); }
        else if (s.phase === "peg" && s.turn === 0 && !(s.wait > 0)) { if (q.ok) this.playPeg(G, 0, q.c); else s.pops.push({ p: 0, txt: "Over 31", t: 0.8 }); }
        return;
      }
    },
    board(G, c, y) {
      const s = G.s, W = G.W, x0 = 16, x1 = W - 16, w = x1 - x0;
      c.fillStyle = "#8a5a2b"; c.beginPath(); if (c.roundRect) c.roundRect(x0 - 8, y - 6, w + 16, 52, 10); else c.rect(x0 - 8, y - 6, w + 16, 52); c.fill();
      c.fillStyle = "#a8743c"; c.fillRect(x0 - 4, y - 2, w + 8, 44);
      const X = v => x0 + w * v / WIN;
      [[0, y + 10, "#1e88e5"], [1, y + 30, "#e53935"]].forEach(([p, ty, col]) => {
        c.fillStyle = "rgba(0,0,0,0.25)"; for (let k = 0; k <= WIN; k += 1) if (k % 5 === 0) c.fillRect(X(k) - 0.5, ty - 4, 1, 8); else c.fillRect(X(k) - 0.5, ty - 1, 1, 2);
        // back peg + front peg
        const peg = (v, a) => { c.globalAlpha = a; c.fillStyle = col; c.beginPath(); c.arc(X(v), ty, 5, 0, 7); c.fill(); c.strokeStyle = "#fff"; c.lineWidth = 1.5; c.stroke(); c.globalAlpha = 1; };
        peg(s.back[p], 0.4); peg(s.score[p], 1);
      });
      c.fillStyle = "rgba(255,255,255,0.5)"; c.fillRect(X(90) - 1, y - 2, 2, 44); c.fillRect(X(WIN) - 1, y - 2, 2, 44);
      G.text(c, "90", X(90), y + 50, 8, "#fff"); G.text(c, "121", X(WIN) - 6, y + 50, 8, "#fff");
    },
    spreadPos(G) { const s = G.s, n = s.spread.length, W = G.W, gap = (W - 70) / (n - 1), cy = G.H * 0.5; return s.spread.map((c, i) => ({ c, x: 35 + i * gap, y: cy + Math.abs(i - (n - 1) / 2) * 3, rot: (i - (n - 1) / 2) * 0.03 })); },
    btn(c, G, x, y, w, h, label, fn, hot) {
      G.s.btns.push({ x, y, w, h, fn });
      c.fillStyle = "rgba(0,0,0,0.3)"; c.beginPath(); if (c.roundRect) c.roundRect(x + 1, y + 3, w, h, 12); else c.rect(x + 1, y + 3, w, h); c.fill();
      c.fillStyle = hot ? "#ffd23f" : "#ccc"; c.beginPath(); if (c.roundRect) c.roundRect(x, y, w, h, 12); else c.rect(x, y, w, h); c.fill();
      c.fillStyle = "#1a1a1a"; c.font = "800 15px system-ui, sans-serif"; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText(label, x + w / 2, y + h / 2 + 1);
    },
    draw(G, c) {
      const s = G.s, L = this.L(G), W = L.W, H = L.H; s.btns = [];
      const g = c.createRadialGradient(W / 2, H * 0.5, 30, W / 2, H * 0.5, H * 0.75); g.addColorStop(0, "#1f6f8b"); g.addColorStop(1, "#0d3b4c"); c.fillStyle = g; c.fillRect(0, 0, W, H);
      const cutting = s.phase === "cutdeal";
      G.hud(c, `YOU ${s.score[0]}`, cutting ? "CUT FOR DEAL" : `HAND ${s.hand}`, `TOM ${s.score[1]}`);
      this.board(G, c, 44);
      // Old Tom
      const ty = 150; G.emoji(c, "😼", 44, ty, 40); G.text(c, OPP, 44, ty + 30, 9, "#fff");
      const oc = cutting ? 0 : s.phase === "peg" || s.phase === "pegdone" ? s.left[1].length : s.phase === "discard" ? 6 : 4;
      for (let i = 0; i < oc; i++) G.card(c, 96 + i * 16, ty, 30, null, false, { rot: (i - oc / 2) * 0.05 });
      if (s.dealer === 1 && !cutting) { c.fillStyle = "#fff"; c.beginPath(); c.arc(66, ty - 18, 9, 0, 7); c.fill(); G.text(c, "D", 66, ty - 17, 8, "#222"); }
      // starter + crib
      const sx = W - 46, sy = ty;
      if (!cutting) { if (s.starter) G.card(c, sx, sy, 40, s.starter, true); else G.card(c, sx, sy, 40, null, false); G.text(c, "CUT", sx, sy + 36, 8, "#fff"); }
      if (s.crib.length && s.phase !== "show") { for (let i = 0; i < 4; i++) G.card(c, sx - 54 + i * 3, sy, 40, null, false); G.text(c, s.dealer === 0 ? "YOUR CRIB" : "TOM'S CRIB", sx - 50, sy + 36, 8, "#fff"); }
      // pegging pile + count
      if (s.phase === "peg" || s.phase === "pegdone") {
        const pile = s.pile || [], n = pile.length, gap = Math.min(34, (W - 90) / Math.max(1, n));
        pile.forEach((q, i) => { const tx = W / 2 - gap * (n - 1) / 2 + i * gap, fy = q.p === 0 ? L.hy : ty, e = 1 - Math.pow(1 - q.a, 3); G.card(c, tx, fy + (L.cy - fy) * e + (q.p === 0 ? 8 : -8), 52, q.c, true); });
        c.fillStyle = "rgba(0,0,0,0.45)"; c.beginPath(); c.arc(W / 2, L.cy - 70, 26, 0, 7); c.fill();
        G.text(c, String(s.cnt), W / 2, L.cy - 72, 18, s.cnt === 15 || s.cnt === 31 ? "#ffd23f" : "#fff"); G.text(c, "COUNT", W / 2, L.cy - 54, 7, "#ccc");
      }
      if (s.phase === "cutdeal") {
        this.spreadPos(G).forEach(q => { if (q.c) G.card(c, q.x, q.y, 44, null, false, { rot: q.rot }); });
        if (!s.picks[0]) G.text(c, "TAP A CARD", W / 2, H * 0.5 + 56, 11, Math.floor(G.t * 2.5) % 2 ? "#fff" : "#ffd23f");
        if (s.picks[0]) { G.card(c, W / 2 - 60, H * 0.72, 64, s.picks[0], true, { hl: s.picks[1] && s.picks[0].r < s.picks[1].r }); G.text(c, "YOU", W / 2 - 60, H * 0.72 + 58, 10, "#fff"); }
        if (s.picks[1]) { G.card(c, W / 2 + 60, H * 0.72, 64, s.picks[1], true, { hl: s.picks[1].r < s.picks[0].r }); G.text(c, "TOM", W / 2 + 60, H * 0.72 + 58, 10, "#fff"); }
      }
      // your hand
      if (s.phase !== "show" && s.phase !== "cutdeal") this.handPos(G).forEach((q, i) => G.card(c, q.x, q.y, L.cw, q.c, true, { dim: !q.ok && s.phase === "peg", hl: s.sel.includes(q.c) }));
      if (s.dealer === 0 && !cutting) { c.fillStyle = "#fff"; c.beginPath(); c.arc(20, L.hy - L.ch / 2 - 14, 9, 0, 7); c.fill(); G.text(c, "D", 20, L.hy - L.ch / 2 - 13, 8, "#222"); }
      if (s.phase === "discard") this.btn(c, G, W / 2 - 80, L.hy - L.ch / 2 - 80, 160, 46, s.sel.length === 2 ? (s.dealer === 0 ? "TO MY CRIB" : "TO TOM'S CRIB") : `PICK ${2 - s.sel.length} MORE`, () => this.toCrib(G), s.sel.length === 2);
      // show (counting) panel
      if (s.show) {
        const sh = s.show, py = 214, ph = H - py - 20;
        c.fillStyle = "rgba(0,0,0,0.55)"; c.beginPath(); if (c.roundRect) c.roundRect(12, py, W - 24, ph, 16); else c.rect(12, py, W - 24, ph); c.fill();
        G.text(c, (sh.who === 0 ? "YOUR " : "TOM'S ") + (sh.crib ? "CRIB" : "HAND"), W / 2, py + 18, 12, "#ffd23f");
        const cw = Math.min(54, (W - 60) / 5.4); sh.cards.concat([s.starter]).forEach((cd, i) => G.card(c, W / 2 - cw * 2.3 + i * cw * 1.15 + (i === 4 ? 8 : 0), py + 40 + cw * 0.7, cw, cd, true, { hl: i === 4 }));
        let ly = py + 60 + cw * 1.4;
        sh.items.slice(0, sh.rev).forEach(([l, p], i) => { c.fillStyle = "#fff"; c.font = "600 15px system-ui, sans-serif"; c.textAlign = "left"; c.fillText(l, 32, ly + i * 22); c.textAlign = "right"; c.fillStyle = "#ffd23f"; c.fillText("+" + p, W - 32, ly + i * 22); });
        if (!sh.items.length) G.text(c, "NINETEEN (NOTHING)", W / 2, ly + 6, 11, "#ccc");
        if (sh.rev >= sh.items.length) { G.banner(c, `${sh.total} POINT${sh.total === 1 ? "" : "S"}`, sh.who === 0 ? "#7cff6b" : "#ff8a80", py + ph - 52, 22); G.text(c, "TAP TO CONTINUE", W / 2, py + ph - 18, 10, Math.floor(G.t * 2.5) % 2 ? "#fff" : "#ffd23f"); }
      }
      // message + pops
      c.fillStyle = "rgba(0,0,0,0.35)"; c.fillRect(0, 186, W, 22); c.fillStyle = "#fff"; c.font = "600 12.5px system-ui, sans-serif"; c.textAlign = "center"; c.textBaseline = "middle";
      c.fillText(s.phase === "peg" ? (s.turn === 0 ? "Your play" : `${OPP} is thinking…`) : s.phase === "show" ? "Counting" : s.msg, W / 2, 197);
      s.pops.forEach((q, i) => { const yy = q.p === 0 ? L.hy - L.ch / 2 - 40 - i * 18 : ty + 46 + i * 18; G.text(c, q.txt, q.p === 0 ? W / 2 : 140, yy - (1.6 - q.t) * 10, 12, q.p === 0 ? "#7cff6b" : "#ff8a80"); });
    }
  });
})();
