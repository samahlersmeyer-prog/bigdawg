// ---------- Dawg Euchre (you + Biscuit vs two cats) ----------
// Standard euchre: 24 cards (9-A), bowers, order up / call trump, go alone, stick the dealer, first team to 10.
(function () {
  const NAMES = ["YOU", "WHISKERS", "BISCUIT", "MITTENS"];
  const team = p => p % 2;
  const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const es = (c, tr) => c.r === 11 && c.s === 3 - tr ? tr : c.s;                      // left bower counts as trump
  const pow = (c, tr, led) => es(c, tr) === tr ? (c.r === 11 && c.s === tr ? 100 : c.r === 11 ? 99 : 50 + c.r) : es(c, tr) === led ? c.r : 0;
  const legal = (h, tr, led) => { if (led == null) return h.slice(); const f = h.filter(c => es(c, tr) === led); return f.length ? f : h.slice(); };
  const keep = c => (c.r === 11 ? 0.5 : 0) + c.r;                                      // rough value for sorting
  function strength(h, tr) {
    let v = 0, nt = 0; const suits = new Set();
    h.forEach(c => { if (es(c, tr) === tr) { nt++; v += c.r === 11 ? (c.s === tr ? 3.2 : 2.6) : { 14: 2.2, 13: 1.9, 12: 1.7, 10: 1.5, 9: 1.4 }[c.r]; } else { suits.add(c.s); v += c.r === 14 ? 1 : c.r === 13 ? 0.3 : 0; } });
    if (nt >= 2) v += (3 - suits.size) * 0.4; return v;
  }
  function sortHand(h, tr) { const order = tr == null ? [0, 1, 3, 2] : [tr, (tr + 1) % 4, (tr + 3) % 4, (tr + 2) % 4]; h.sort((a, b) => { const sa = order.indexOf(tr == null ? a.s : es(a, tr)), sb = order.indexOf(tr == null ? b.s : es(b, tr)); return sa - sb || (tr == null ? b.r - a.r : pow(b, tr, es(b, tr)) - pow(a, tr, es(a, tr))); }); }

  defGame({
    key: "euchre", name: "Dawg Euchre", icon: "🃏", max: 300,
    blurb: "You + Biscuit vs the cats. First to 10.",
    how: "Classic euchre with you and your partner Biscuit (top) against two cats. Round 1: order up the turned card for trump, or pass. Round 2: name a different suit (the dealer has to call: stick the dealer). Tap ALONE to play without your partner for 4 points. Follow suit if you can; the jack of trump (right bower) and the other jack of the same color (left bower) are the top trumps. 3-4 tricks = 1 point, all 5 = 2, euchred = 2 for the other team. First to 10. Score: win = 100 + 10 for every point you win by.",
    // Save & continue between hands.
    save(G) { const s = G.s; if (s.phase !== "bid1" || s.passes || s.hand < 2) return null; return { label: `${s.score[0]}–${s.score[1]}`, score: s.score.slice(), dealer: s.dealer, hand: s.hand }; },
    load(G, v) { const s = G.s; s.score = v.score.slice(); s.dealer = (v.dealer + 3) % 4; s.hand = v.hand - 1; this.deal(G); },
    reset(G) {
      G.s = { score: [0, 0], dealer: 0, say: [null, null, null, null], btns: [], msg: "", t: 0, hands: [[], [], [], []], trick: [], gone: [], hand: 0, tricks: [0, 0] };
      this.jacks(G);
    },
    // Old-school start: cards go face up around the table, one at a time. First black jack deals.
    jacks(G) {
      const s = G.s, d = []; for (let su = 0; su < 4; su++) for (let r = 9; r <= 14; r++) d.push({ r, s: su }); shuffle(d);
      s.phase = "jacks"; s.jdeck = d; s.jpiles = [[], [], [], []]; s.jto = Math.floor(Math.random() * 4); s.jwho = -1; s.wait = 0.6;
      s.msg = "Dealing for deal: first black jack deals.";
    },
    jackStep(G) {
      const s = G.s, c = s.jdeck.pop(); s.jpiles[s.jto].push({ c, a: 0 }); G.sfx("pop");
      if (c.r === 11 && (c.s === 0 || c.s === 3)) {
        s.jwho = s.jto; s.wait = 2.4; this.sayAt(G, s.jto, "Black jack!");
        s.msg = s.jto === 0 ? "You got the black jack. You deal first!" : `${NAMES[s.jto]} got the black jack and deals first.`;
        return;
      }
      s.jto = (s.jto + 1) % 4; s.wait = 0.38;
    },
    deal(G) {
      const s = G.s; s.dealer = (s.dealer + 1) % 4; s.hand++;
      const deck = []; for (let su = 0; su < 4; su++) for (let r = 9; r <= 14; r++) deck.push({ r, s: su }); shuffle(deck);
      s.hands = [0, 1, 2, 3].map(i => deck.slice(i * 5, i * 5 + 5)); s.up = deck[20];
      s.trump = null; s.maker = -1; s.alone = -1; s.tricks = [0, 0]; s.trick = []; s.led = null; s.passes = 0; s.aloneTog = false;
      sortHand(s.hands[0], null);
      s.phase = "bid1"; s.turn = (s.dealer + 1) % 4; s.wait = 1.0;
      s.msg = `${s.dealer === 0 ? "You deal" : NAMES[s.dealer] + " deals"}. Turned up: ${G.rankTxt(s.up.r)}${G.SUIT[s.up.s]}`;
    },
    sayAt(G, p, txt) { G.s.say[p] = { txt, t: 1.6 }; },
    next(G, p) { const s = G.s; let n = (p + 1) % 4; if (s.alone >= 0 && n === (s.alone + 2) % 4) n = (n + 1) % 4; return n; },
    // ---- bidding ----
    bid(G, p, act, suit, alone) {
      const s = G.s;
      if (act === "pass") {
        this.sayAt(G, p, "Pass"); s.passes++;
        if (s.phase === "bid1" && s.passes === 4) { s.phase = "bid2"; s.passes = 0; s.turn = (s.dealer + 1) % 4; s.msg = `Turned down. Name a suit other than ${G.SUIT[s.up.s]}.`; }
        else s.turn = (p + 1) % 4;
        s.wait = 0.8; return;
      }
      s.trump = act === "order" ? s.up.s : suit; s.maker = p; s.alone = alone ? p : -1;
      this.sayAt(G, p, (act === "order" ? (p === s.dealer ? "Picking it up" : "Order it up!") : `${G.SUIT[suit]} trump`) + (alone ? " — ALONE!" : ""));
      G.sfx("pop");
      if (act === "order") {
        s.hands[s.dealer].push(s.up);
        if (s.dealer === 0 && s.alone !== 2) { s.phase = "discard"; sortHand(s.hands[0], s.trump); s.msg = "Tap a card to discard."; return; }
        if (s.alone === (s.dealer + 2) % 4) s.hands[s.dealer].pop(); // partner of a lone caller doesn't pick up
        else this.cpuDiscard(G, s.dealer);
      }
      this.startPlay(G);
    },
    cpuDiscard(G, p) {
      const s = G.s, h = s.hands[p], tr = s.trump;
      const off = h.filter(c => es(c, tr) !== tr && c.r !== 14);
      const pool = off.length ? off : h;
      pool.sort((a, b) => { const ca = h.filter(c => es(c, tr) === es(a, tr)).length, cb = h.filter(c => es(c, tr) === es(b, tr)).length; return (ca - cb) || (pow(a, tr, es(a, tr)) - pow(b, tr, es(b, tr))); });
      h.splice(h.indexOf(pool[0]), 1);
    },
    startPlay(G) {
      const s = G.s; sortHand(s.hands[0], s.trump);
      s.phase = "play"; s.trick = []; s.led = null; s.turn = this.next(G, s.dealer); s.wait = 1.1;
      const who = s.maker === 0 ? "You" : NAMES[s.maker][0] + NAMES[s.maker].slice(1).toLowerCase();
      s.msg = `${who} called ${G.SUIT[s.trump]}${s.alone >= 0 ? " and went ALONE" : ""}.`;
    },
    cpuBid(G, p) {
      const s = G.s;
      if (s.phase === "bid1") {
        let v = strength(s.hands[p], s.up.s), uv = strength([s.up], s.up.s);
        if (p === s.dealer) v = strength(s.hands[p].concat([s.up]).sort((a, b) => strength([b], s.up.s) - strength([a], s.up.s)).slice(0, 5), s.up.s);
        else if (p === (s.dealer + 2) % 4) v += uv * 0.6; else v -= uv * 0.5;
        if (v >= 7.4) return this.bid(G, p, "order", null, v >= 11.5);
        return this.bid(G, p, "pass");
      }
      let best = -1, bv = -1; for (let su = 0; su < 4; su++) { if (su === s.up.s) continue; const v = strength(s.hands[p], su); if (v > bv) { bv = v; best = su; } }
      if (bv >= 7 || p === s.dealer) return this.bid(G, p, "call", best, bv >= 11.5);
      this.bid(G, p, "pass");
    },
    // ---- play ----
    winner(G) { const s = G.s; let b = s.trick[0]; s.trick.forEach(t => { if (pow(t.c, s.trump, s.led) > pow(b.c, s.trump, s.led)) b = t; }); return b; },
    play(G, p, card) {
      const s = G.s, h = s.hands[p]; h.splice(h.indexOf(card), 1);
      if (!s.trick.length) s.led = es(card, s.trump);
      s.trick.push({ p, c: card, a: 0 }); G.sfx("pop");
      const need = s.alone >= 0 ? 3 : 4;
      if (s.trick.length === need) { const w = this.winner(G); s.win = w.p; s.phase = "trickEnd"; s.wait = 1.3; }
      else { s.turn = this.next(G, p); s.wait = 0.7; }
    },
    cpuPlay(G, p) {
      const s = G.s, tr = s.trump, h = s.hands[p], L = legal(h, tr, s.led);
      const low = arr => arr.slice().sort((a, b) => (es(a, tr) === tr) - (es(b, tr) === tr) || pow(a, tr, es(a, tr)) - pow(b, tr, es(b, tr)))[0];
      if (!s.trick.length) {
        const trumps = L.filter(c => es(c, tr) === tr).sort((a, b) => pow(b, tr, tr) - pow(a, tr, tr));
        if (team(p) === team(s.maker) && trumps.length && (pow(trumps[0], tr, tr) === 100 || trumps.length >= 2)) return this.play(G, p, trumps[0]);
        const aces = L.filter(c => es(c, tr) !== tr && c.r === 14); if (aces.length) return this.play(G, p, aces[0]);
        return this.play(G, p, low(L));
      }
      const w = this.winner(G), wp = pow(w.c, tr, s.led), last = s.trick.length === (s.alone >= 0 ? 2 : 3);
      if (team(w.p) === team(p) && (wp >= 99 || last || wp >= 64)) return this.play(G, p, low(L));
      const beats = L.filter(c => pow(c, tr, s.led) > wp).sort((a, b) => pow(a, tr, s.led) - pow(b, tr, s.led));
      if (beats.length) return this.play(G, p, beats[0]);
      this.play(G, p, low(L));
    },
    endTrick(G) {
      const s = G.s; s.tricks[team(s.win)]++; s.gone = s.trick.map(t => ({ c: t.c, p: t.p, to: s.win })); s.goneT = 0.45;
      s.trick = []; s.led = null;
      if (s.tricks[0] + s.tricks[1] === 5) return this.scoreHand(G);
      s.phase = "play"; s.turn = s.win; s.wait = 0.6;
    },
    scoreHand(G) {
      const s = G.s, mt = team(s.maker), mk = s.tricks[mt];
      let pts, t;
      if (mk >= 3) { pts = mk === 5 ? (s.alone >= 0 ? 4 : 2) : 1; s.score[mt] += pts; t = mk === 5 ? (s.alone >= 0 ? "LONER! +4" : "MARCH! +2") : "+1"; }
      else { pts = 2; s.score[1 - mt] += 2; t = "EUCHRED! +2"; }
      const us = (mk >= 3) === (mt === 0);
      s.handMsg = { t, us, tricks: s.tricks.slice() }; G.sfx(us ? "win" : "lose");
      s.phase = "handEnd"; s.wait = 2.6;
    },
    afterHand(G) {
      const s = G.s;
      if (s.score[0] >= 10 || s.score[1] >= 10) {
        const won = s.score[0] >= 10, sc = won ? 100 + 10 * (s.score[0] - s.score[1]) : 5 * s.score[0];
        G.over(Math.min(300, sc), won ? `You win ${s.score[0]}–${s.score[1]}! Good dawgs.` : `The cats win ${s.score[1]}–${s.score[0]}.`); return;
      }
      this.deal(G);
    },
    update(G, dt) {
      const s = G.s; s.t += dt;
      s.say.forEach((b, i) => { if (b) { b.t -= dt; if (b.t <= 0) s.say[i] = null; } });
      s.trick.forEach(t => t.a = Math.min(1, t.a + dt * 4));
      if (s.jpiles) s.jpiles.forEach(p => p.forEach(q => q.a = Math.min(1, q.a + dt * 5)));
      if (s.goneT > 0) { s.goneT -= dt; if (s.goneT <= 0) s.gone = []; }
      if (s.wait > 0) { s.wait -= dt; if (s.wait > 0) return; }
      if (s.phase === "jacks") { if (s.jwho >= 0) { s.dealer = (s.jwho + 3) % 4; s.jpiles = null; return this.deal(G); } return this.jackStep(G); }
      if (s.phase === "trickEnd") return this.endTrick(G);
      if (s.phase === "handEnd") return this.afterHand(G);
      if (s.turn === 0 || s.phase === "discard") return; // waiting on you
      if (s.phase === "bid1" || s.phase === "bid2") this.cpuBid(G, s.turn);
      else if (s.phase === "play") this.cpuPlay(G, s.turn);
    },
    // ---- layout ----
    L(G) { const W = G.W, H = G.H, cw = Math.min(70, (W - 24) / 5.2); return { W, H, cw, ch: cw * 1.4, hy: H - cw * 0.7 - 16, cx: W / 2, cy: H * 0.43, seat: [[W / 2, H - 30], [40, H * 0.43], [W / 2, 96], [W - 40, H * 0.43]] }; },
    handPos(G) {
      const s = G.s, L = this.L(G), h = s.hands[0], n = h.length, gap = Math.min(L.cw * 0.95, (L.W - 20 - L.cw) / Math.max(1, n - 1));
      const x0 = L.W / 2 - gap * (n - 1) / 2, ok = s.phase === "play" && s.turn === 0 && !(s.wait > 0) ? legal(h, s.trump, s.led) : null;
      return h.map((c, i) => ({ c, x: x0 + i * gap, y: L.hy - (ok && ok.includes(c) ? 14 : 0), ok: !ok || ok.includes(c) }));
    },
    tap(G, x, y) {
      const s = G.s;
      if (s.phase === "handEnd") { s.wait = 0; return; }
      if (s.phase === "jacks") { if (s.jwho < 0) { while (s.jwho < 0) this.jackStep(G); s.jpiles.forEach(p => p.forEach(q => q.a = 1)); } else s.wait = 0; return; } // tap to hurry it along
      const b = s.btns.find(b => x > b.x && x < b.x + b.w && y > b.y && y < b.y + b.h); if (b) { b.fn(); return; }
      const L = this.L(G), pos = this.handPos(G);
      for (let i = pos.length - 1; i >= 0; i--) {
        const q = pos[i]; if (Math.abs(x - q.x) > L.cw / 2 || Math.abs(y - q.y) > L.ch / 2) continue;
        if (s.phase === "discard") { s.hands[0].splice(s.hands[0].indexOf(q.c), 1); G.sfx("pop"); this.startPlay(G); return; }
        if (s.phase === "play" && s.turn === 0 && !(s.wait > 0) && q.ok) { this.play(G, 0, q.c); return; }
        if (s.phase === "play" && s.turn === 0 && !q.ok) { s.msg = "You have to follow suit."; return; }
        return;
      }
    },
    btn(c, G, x, y, w, h, label, fn, hot) {
      G.s.btns.push({ x, y, w, h, fn });
      c.fillStyle = "rgba(0,0,0,0.3)"; c.beginPath(); if (c.roundRect) c.roundRect(x + 1, y + 3, w, h, 12); else c.rect(x + 1, y + 3, w, h); c.fill();
      c.fillStyle = hot ? "#ffd23f" : "#fffdf7"; c.beginPath(); if (c.roundRect) c.roundRect(x, y, w, h, 12); else c.rect(x, y, w, h); c.fill();
      c.fillStyle = label === "♥" || label === "♦" ? "#d32f2f" : "#1a1a1a"; c.font = `800 ${label.length <= 2 ? 22 : 14}px system-ui, sans-serif`; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText(label, x + w / 2, y + h / 2 + 1);
    },
    draw(G, c) {
      const s = G.s, L = this.L(G), W = L.W, H = L.H; s.btns = [];
      const g = c.createRadialGradient(W / 2, H * 0.45, 30, W / 2, H * 0.45, H * 0.75); g.addColorStop(0, "#2e8b57"); g.addColorStop(1, "#14532d"); c.fillStyle = g; c.fillRect(0, 0, W, H);
      c.strokeStyle = "rgba(255,255,255,0.08)"; c.lineWidth = 2; c.beginPath(); c.ellipse(W / 2, H * 0.43, W * 0.36, H * 0.2, 0, 0, 7); c.stroke();
      // seats
      [1, 2, 3].forEach(p => {
        const [x, y] = L.seat[p], out = s.alone >= 0 && p === (s.alone + 2) % 4, turn = s.turn === p && (s.phase === "play" || s.phase.startsWith("bid"));
        c.globalAlpha = out ? 0.4 : 1;
        if (turn) { c.fillStyle = "rgba(255,210,63,0.35)"; c.beginPath(); c.arc(x, y, 30, 0, 7); c.fill(); }
        if (p === 2) G.img(c, ":dawgpog:", x, y, 46); else G.emoji(c, p === 1 ? "😼" : "🐱", x, y, 40);
        G.text(c, NAMES[p], x, y + 32, 9, "#fff");
        const n = s.hands[p].length; for (let i = 0; i < n; i++) { const off = (i - (n - 1) / 2) * 7; if (p === 2) G.card(c, x + 40 + off, y - 4, 20, null, false); else G.card(c, x + off * 0.3, y - 44 - (p === 1 ? 0 : 0), 18, null, false, { rot: p === 1 ? 0.15 * (i - 2) : -0.15 * (i - 2) }); }
        if (s.dealer === p && s.phase !== "jacks") { c.fillStyle = "#fff"; c.beginPath(); c.arc(x + 22, y + 16, 9, 0, 7); c.fill(); G.text(c, "D", x + 22, y + 17, 8, "#222"); }
        if (s.maker === p && s.trump != null) G.text(c, "★", x - 24, y - 18, 12, "#ffd23f");
        c.globalAlpha = 1;
        const b = s.say[p]; if (b) { const by = p === 2 ? y + 52 : y - 74, bw = Math.max(64, b.txt.length * 7.4 + 16), bx = Math.max(4, Math.min(W - bw - 4, x - bw / 2)); c.fillStyle = "#fff"; c.beginPath(); if (c.roundRect) c.roundRect(bx, by - 13, bw, 26, 13); else c.rect(bx, by - 13, bw, 26); c.fill(); c.fillStyle = "#222"; c.font = "700 13px system-ui, sans-serif"; c.textAlign = "center"; c.fillText(b.txt, bx + bw / 2, by + 1); }
      });
      if (s.dealer === 0 && s.phase !== "jacks") { c.fillStyle = "#fff"; c.beginPath(); c.arc(22, H - L.ch - 50, 9, 0, 7); c.fill(); G.text(c, "D", 22, H - L.ch - 49, 8, "#222"); }
      if (s.say[0]) G.text(c, s.say[0].txt, W / 2, L.hy - L.ch / 2 - 74, 11, "#ffd23f");
      // center: turned-up card while bidding, or the trick
      const slot = [[0, 46], [-50, 0], [0, -46], [50, 0]];
      if (s.phase === "bid1") { G.card(c, L.cx, L.cy, 58, s.up, true); G.text(c, "ORDER IT UP?", L.cx, L.cy + 58, 10, "#fff"); }
      if (s.phase === "bid2") { G.card(c, L.cx, L.cy, 58, s.up, false, { rot: 1.4 }); G.text(c, `NO ${G.SUIT[s.up.s]} — CALL A SUIT`, L.cx, L.cy + 58, 10, "#fff"); }
      s.trick.forEach(t => { const [sx, sy] = L.seat[t.p], e = 1 - Math.pow(1 - t.a, 3); G.card(c, sx + (L.cx + slot[t.p][0] - sx) * e, sy + (L.cy + slot[t.p][1] - sy) * e, 56, t.c, true, { hl: s.phase === "trickEnd" && t.p === s.win, rot: (t.p - 1.5) * 0.06 }); });
      (s.gone || []).forEach(t => { const k = 1 - Math.max(0, s.goneT) / 0.45, [tx, ty] = L.seat[t.to]; G.card(c, L.cx + (tx - L.cx) * k, L.cy + (ty - L.cy) * k, 56 * (1 - k * 0.5), t.c, true); });
      // dealing for deal: face-up piles in front of each seat
      if (s.jpiles) {
        const spot = [[W / 2, H - 150], [96, L.cy], [W / 2, 170], [W - 96, L.cy]];
        s.jpiles.forEach((pile, p) => pile.forEach((q, i) => {
          const e = 1 - Math.pow(1 - q.a, 3), tx = spot[p][0] + (p % 2 ? 0 : (i - 1) * 12), ty = spot[p][1] + (p % 2 ? (i - 1) * 12 : 0);
          const isJ = s.jwho === p && i === pile.length - 1;
          G.card(c, L.cx + (tx - L.cx) * e, L.cy + (ty - L.cy) * e, isJ ? 54 : 46, q.c, true, { hl: isJ, rot: (p - 1.5) * 0.05 });
        }));
        if (s.jwho < 0) { G.card(c, L.cx, L.cy, 46, null, false); G.text(c, "TAP TO SKIP", W / 2, H - 60, 10, "#fff"); }
        else G.banner(c, s.jwho === 0 ? "YOU DEAL!" : `${NAMES[s.jwho]} DEALS`, "#ffd23f", H - 70, 20);
      }
      // your hand
      this.handPos(G).forEach((q, i) => G.card(c, q.x, q.y, L.cw, q.c, true, { dim: !q.ok, rot: (i - (s.hands[0].length - 1) / 2) * 0.04 }));
      if (s.turn === 0 && (s.phase === "play" || s.phase.startsWith("bid")) && !(s.wait > 0)) { c.fillStyle = "#ffd23f"; c.fillRect(W / 2 - 30, H - 6, 60, 4); }
      // buttons for your bid
      const by = L.hy - L.ch / 2 - 62;
      if (s.turn === 0 && !(s.wait > 0) && (s.phase === "bid1" || s.phase === "bid2")) {
        if (s.phase === "bid1") {
          const w3 = (W - 40) / 3;
          this.btn(c, G, 12, by, w3, 46, "PASS", () => this.bid(G, 0, "pass"));
          this.btn(c, G, 20 + w3, by, w3, 46, s.dealer === 0 ? "PICK UP" : "ORDER UP", () => this.bid(G, 0, "order", null, s.aloneTog), true);
          this.btn(c, G, 28 + 2 * w3, by, w3, 46, s.aloneTog ? "ALONE ✓" : "ALONE?", () => { s.aloneTog = !s.aloneTog; }, s.aloneTog);
        } else {
          const su = [0, 1, 2, 3].filter(x => x !== s.up.s), canPass = s.dealer !== 0, n = su.length + (canPass ? 1 : 0) + 1, bw = (W - 24 - 6 * (n - 1)) / n;
          let x = 12;
          if (canPass) { this.btn(c, G, x, by, bw, 46, "PASS", () => this.bid(G, 0, "pass")); x += bw + 6; }
          su.forEach(v => { this.btn(c, G, x, by, bw, 46, G.SUIT[v], () => this.bid(G, 0, "call", v, s.aloneTog), true); x += bw + 6; });
          this.btn(c, G, x, by, bw, 46, s.aloneTog ? "✓" : "ALONE", () => { s.aloneTog = !s.aloneTog; }, s.aloneTog);
          if (!canPass) G.text(c, "STICK THE DEALER: YOU MUST CALL", W / 2, by - 12, 9, "#ffd23f");
        }
      }
      // HUD
      G.hud(c, `US ${s.score[0]}`, s.phase === "jacks" ? "WHO DEALS?" : s.trump != null ? `TRUMP ${G.SUIT[s.trump]} · ${s.tricks[0]}–${s.tricks[1]}` : `HAND ${s.hand}`, `THEM ${s.score[1]}`);
      if (s.trump != null) { const red = s.trump === 1 || s.trump === 2; c.fillStyle = "#fffdf7"; c.beginPath(); c.arc(W / 2 + 70, 17, 0, 0, 7); c.fill(); }
      // message strip
      c.fillStyle = "rgba(0,0,0,0.35)"; c.fillRect(0, 36, W, 22); c.fillStyle = "#fff"; c.font = "600 12.5px system-ui, sans-serif"; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText(s.phase === "play" && s.turn === 0 && !(s.wait > 0) ? "Your play" + (s.led != null ? ` — ${G.SUIT[s.led]} led` : " — you lead") : s.msg, W / 2, 47);
      if (s.phase === "handEnd" && s.handMsg) {
        c.fillStyle = "rgba(0,0,0,0.55)"; c.fillRect(0, L.cy - 60, W, 120);
        G.banner(c, s.handMsg.t, s.handMsg.us ? "#7cff6b" : "#ff6b6b", L.cy - 10);
        G.text(c, `TRICKS ${s.handMsg.tricks[0]}–${s.handMsg.tricks[1]} · SCORE ${s.score[0]}–${s.score[1]}`, W / 2, L.cy + 30, 11, "#fff");
      }
    }
  });
})();
