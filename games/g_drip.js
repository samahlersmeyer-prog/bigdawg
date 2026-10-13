// ---------- Dawg Drip (runway dress-up) ----------
// Each round a theme card appears. Dress the pup (hat, top, eyewear, shoes, accessory, color) in 30 seconds,
// walk the runway, and three judges score the look on theme, color harmony and completeness. 5 rounds.
(function () {
  const COLS = [
    { n: "pink", c: "#ff8fc8", h: 330 }, { n: "red", c: "#ff5468", h: 355 }, { n: "orange", c: "#ff9f43", h: 30 },
    { n: "yellow", c: "#ffd93d", h: 50 }, { n: "green", c: "#5fd38d", h: 140 }, { n: "teal", c: "#3dd6d0", h: 178 },
    { n: "blue", c: "#4d8dff", h: 220 }, { n: "purple", c: "#a66bff", h: 270 }, { n: "black", c: "#2e2a3a", h: -1 },
    { n: "white", c: "#f7f3ff", h: -1 }, { n: "brown", c: "#a0683a", h: 25 }, { n: "gold", c: "#e8b923", h: -1 }
  ];
  const CI = {}; COLS.forEach((c, i) => CI[c.n] = i);
  const THEMES = [
    { n: "BEACH DAY", e: "🏖️", k: "beach", cols: ["yellow", "teal", "orange", "pink"] },
    { n: "PROM NIGHT", e: "🪩", k: "prom", cols: ["purple", "pink", "black", "red"] },
    { n: "SKI TRIP", e: "⛷️", k: "ski", cols: ["white", "blue", "red", "teal"] },
    { n: "RODEO", e: "🐴", k: "rodeo", cols: ["brown", "red", "orange", "blue"] },
    { n: "ROCK STAR", e: "🤘", k: "rock", cols: ["black", "red", "purple"] },
    { n: "ROYAL WEDDING", e: "💒", k: "royal", cols: ["white", "gold", "purple", "blue"] },
    { n: "GYM DAY", e: "🏋️", k: "gym", cols: ["green", "blue", "pink", "black"] },
    { n: "HALLOWEEN", e: "🎃", k: "hall", cols: ["orange", "black", "purple", "green"] },
    { n: "PAJAMA PARTY", e: "🛌", k: "pj", cols: ["pink", "purple", "blue", "white"] },
    { n: "FANCY BRUNCH", e: "🥂", k: "brunch", cols: ["pink", "yellow", "white", "green"] }
  ];
  const it = (e, n, t, c, s) => ({ e, n, t: t.split(" "), c, s });
  const NONE = { e: null, n: "none", t: [], c: null };
  const ITEMS = {
    hat: [NONE, it("👑", "crown", "royal prom hall", "gold"), it("🎀", "bow", "prom brunch pj royal", "pink"),
      it("🤠", "hat", "rodeo", "brown"), it("🧢", "cap", "gym beach rock", "blue"), it("🎩", "top hat", "royal prom brunch hall", "black"),
      it("🪖", "helmet", "ski hall rock", "green"), it("👒", "sun hat", "beach brunch royal", "yellow"), it("🌸", "flower", "beach brunch pj royal", "pink"),
      it("🎧", "headphones", "gym rock", "black"), it("🎃", "pumpkin", "hall", "orange"), it("🦄", "unicorn", "pj hall", "white")],
    top: [NONE, it("👗", "gown", "prom royal brunch", null, "gown"), it("👚", "blouse", "brunch beach royal", null, "blouse"),
      it("👕", "tee", "gym beach rock pj", null, "tee"), it("🥻", "drape", "royal prom brunch", null, "drape"),
      it("👘", "robe", "pj royal brunch", null, "robe"), it("🦺", "vest", "rodeo hall", null, "vest"),
      it("🧥", "coat", "ski rock rodeo", null, "coat"), it("🩱", "swimsuit", "beach gym", null, "swim"),
      it("🥼", "lab coat", "hall", null, "lab"), it("🎽", "tank", "gym beach rock", null, "tank"), it("🧶", "sweater", "ski pj", null, "sweater")],
    eyes: [NONE, it("🕶️", "shades", "beach rock gym rodeo", "black"), it("👓", "specs", "brunch pj hall", null),
      it("🥽", "goggles", "ski gym", "blue"), it("🎭", "mask", "hall royal prom", "gold"), it("⭐", "star specs", "rock prom beach", "yellow"),
      it("💖", "heart specs", "prom pj brunch", "pink")],
    shoes: [NONE, it("👠", "heels", "prom royal brunch", "red"), it("👟", "sneakers", "gym rock", "white"),
      it("🥾", "boots", "ski rodeo hall", "brown"), it("🩴", "flip-flops", "beach pj", "blue"), it("👢", "boots", "rodeo rock ski", "brown"),
      it("🩰", "slippers", "royal prom pj", "pink"), it("👞", "loafers", "brunch prom royal", "brown"), it("🛼", "skates", "rock gym beach", "white"),
      it("🧦", "socks", "pj ski", "red")],
    acc: [NONE, it("👜", "purse", "brunch prom royal", "brown"), it("🧣", "scarf", "ski rock", "red"), it("🎸", "guitar", "rock rodeo", "red"),
      it("🏄", "surfboard", "beach", "teal"), it("🎤", "mic", "rock prom", null), it("🌹", "rose", "prom royal brunch", "red"),
      it("🥤", "smoothie", "gym beach", "pink"), it("🪢", "lasso", "rodeo", "brown"), it("🧸", "teddy", "pj", "brown"),
      it("🦇", "bat", "hall", "black"), it("🥂", "bubbly", "brunch royal prom", "gold")]
  };
  const TABS = [
    { k: "hat", e: "🎩", n: "HAT" }, { k: "top", e: "👗", n: "TOP" }, { k: "eyes", e: "🕶️", n: "EYES" },
    { k: "shoes", e: "👠", n: "SHOES" }, { k: "acc", e: "👜", n: "EXTRA" }, { k: "color", e: "🎨", n: "COLOR" }
  ];
  const SLOTS = ["hat", "top", "eyes", "shoes", "acc"];
  const SLOTNAME = { hat: "hat", top: "outfit", eyes: "eyewear", shoes: "shoes", acc: "accessory" };
  const JUDGES = [
    { n: "Fifi", who: "🐩", w: [4.5, 3.2, 1.3], bias: 0 },
    { n: "Mittens", who: "🐈", w: [6.4, 1.6, 1.0], bias: -0.6 },
    { n: "Big Dawg", who: ":dawgW:", w: [5, 1.5, 2.5], bias: 0.5 }
  ];
  const ROUNDS = 5, STYLE_T = 30, WALK_T = 3.4;

  function hueOk(a, b) {
    if (a == null || b == null) return 1;
    const A = COLS[CI[a]], B = COLS[CI[b]];
    if (A.h < 0 || B.h < 0 || a === b) return 1;
    let d = Math.abs(A.h - B.h); if (d > 180) d = 360 - d;
    return d <= 45 ? 0.9 : d >= 150 ? 0.8 : 0.3;
  }
  function rr(c, x, y, w, h, r) { c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); }
  function shade(hex, f) {
    const n = parseInt(hex.slice(1), 16); let r = n >> 16, g = (n >> 8) & 255, b = n & 255;
    if (f < 0) { r *= 1 + f; g *= 1 + f; b *= 1 + f; } else { r += (255 - r) * f; g += (255 - g) * f; b += (255 - b) * f; }
    return `rgb(${r | 0},${g | 0},${b | 0})`;
  }
  function txt(c, s, x, y, size, col, align, weight) {
    c.font = `${weight || 800} ${size}px system-ui, -apple-system, "Segoe UI", sans-serif`; c.fillStyle = col; c.textAlign = align || "center"; c.textBaseline = "middle"; c.fillText(s, x, y);
  }
  function pal(G) {
    const d = G.dark();
    return d ? { bg1: "#2a1840", bg2: "#14182e", panel: "#2a2142", cell: "#3a2f58", cellOn: "#6b4fb0", ink: "#fff", sub: "#d9c8ff", line: "#8d74d6", card: "#3b2a5c", spark: "#ffe8ff" }
      : { bg1: "#ffd6ec", bg2: "#e3dcff", panel: "#fff7fd", cell: "#f6e9ff", cellOn: "#ffb3dc", ink: "#4a2a5e", sub: "#8a5aa8", line: "#e6a8d4", card: "#ffffff", spark: "#ffffff" };
  }
  function lay(G) {
    const W = G.W, H = G.H, small = H < 560;
    const tabH = 44, cellH = small ? 50 : 60, gridH = cellH * 2 + 8, btnH = 46;
    const tabY = H - tabH, gridY = tabY - gridH, btnY = gridY - btnH, panelY = btnY;
    const mTop = 78, mBot = panelY - 6;
    const k = Math.min(1.25, (mBot - mTop) / 250);
    return { W, H, tabH, cellH, gridH, tabY, gridY, btnY, btnH, panelY, mTop, mBot, k, cx: W / 2, feet: mBot - 4, cw: (W - 16) / 6 };
  }
  function newRound(G) {
    const s = G.s;
    s.round++; s.theme = s.deck[(s.round - 1) % s.deck.length];
    s.pick = { hat: 0, top: 0, eyes: 0, shoes: 0, acc: 0 }; s.color = Math.floor(Math.random() * 8);
    s.tab = 1; s.phase = "intro"; s.pt = 0; s.time = STYLE_T; s.judged = null; s.sparks.length = 0;
  }
  function judge(G) {
    const s = G.s, th = s.theme.k;
    let match = 0, miss = 0, filled = 0, worst = null, harmSum = 0, harmN = 0;
    const top = COLS[s.color].n;
    SLOTS.forEach(sl => {
      const item = ITEMS[sl][s.pick[sl]]; if (!item.e) return;
      filled++;
      if (item.t.indexOf(th) >= 0) match++; else { miss++; if (!worst || Math.random() < 0.5) worst = sl; }
      if (sl !== "top" && s.pick.top) { harmSum += hueOk(item.c, top); harmN++; }
    });
    const theme = Math.max(0, Math.min(1, (match - 0.5 * miss) / 5));
    let harm = 0;
    if (s.pick.top) {
      const topOk = s.theme.cols.indexOf(top) >= 0 ? 1 : 0.25;
      harm = 0.6 * topOk + 0.4 * (harmN ? harmSum / harmN : 0.6);
    } else harm = filled ? 0.35 : 0;
    const comp = filled / 5;
    const scores = JUDGES.map((j, i) => {
      let r = 1 + j.w[0] * theme + j.w[1] * harm + j.w[2] * comp + j.bias + (Math.random() - 0.5) * 1.4;
      if (filled === 0) r = 1;
      return Math.max(1, Math.min(10, Math.round(r)));
    });
    const quips = [];
    scores.forEach((sc, i) => { let q = quip(sc, i, theme, harm, comp, worst, s.theme); for (let n = 0; n < 6 && quips.indexOf(q) >= 0; n++) q = quip(sc, i, theme, harm, comp, worst, s.theme); quips.push(q); });
    return { scores, quips, theme, harm, comp };
  }
  const pickOne = a => a[Math.floor(Math.random() * a.length)];
  function quip(sc, i, theme, harm, comp, worst, T) {
    if (sc >= 10) return pickOne(["Serving looks!", "ICONIC. 10!", "Slay, pup!", "Perfection!", "I'm crying!"]);
    if (sc >= 8) return pickOne(i === 0 ? ["Très chic!", "Ooh la la!", "Fabulous!"] : i === 1 ? ["...Acceptable.", "Purr-fect-ish.", "I'll allow it."] : ["Tail's waggin'!", "Big drip!", "Sheesh!"]);
    const lows = [];
    if (comp < 0.6) lows.push("Where's the rest?", worst === null ? "Needs more pieces!" : "So bare!");
    if (worst) lows.push(`Not the ${SLOTNAME[worst]}…`, `${SLOTNAME[worst][0].toUpperCase() + SLOTNAME[worst].slice(1)}? For ${T.n.toLowerCase()}?`);
    if (harm < 0.6) lows.push("Colors are fighting!", "That color though…");
    if (theme < 0.4) lows.push("Did you read the card?", "Wrong party, pup!");
    if (!lows.length) lows.push(i === 1 ? "Meh." : "Almost there!", "Cute, not runway.");
    return pickOne(lows);
  }

  defGame({
    key: "drip", name: "Dawg Drip", icon: "👗", max: 9999,
    blurb: "Style the pup. Win the runway.",
    how: "Each round has a theme. You get 30 seconds: use the tabs at the bottom to pick a hat, top, eyewear, shoes, an accessory and a color. Hit WALK THE RUNWAY and 3 judges score theme match, color harmony and completeness. Perfect 10s earn bonus points. 5 rounds.",
    reset(G) {
      const deck = THEMES.slice(); for (let i = deck.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); const t = deck[i]; deck[i] = deck[j]; deck[j] = t; }
      const bg = []; for (let i = 0; i < 26; i++) bg.push({ x: Math.random(), y: Math.random(), p: Math.random() * 6, z: 6 + Math.random() * 10 });
      G.s = { deck, round: 0, score: 0, tens: 0, phase: "intro", pt: 0, time: STYLE_T, sparks: [], bg, flashes: [], history: [] };
      newRound(G);
    },
    update(G, dt) {
      const s = G.s; s.pt += dt;
      for (let i = s.sparks.length - 1; i >= 0; i--) { const p = s.sparks[i]; p.t -= dt; p.x += p.vx * dt; p.y += p.vy * dt; if (p.t <= 0) s.sparks.splice(i, 1); }
      if (s.phase === "intro") { if (s.pt > 1.8) { s.phase = "style"; s.pt = 0; } }
      else if (s.phase === "style") {
        s.time -= dt;
        if (s.time <= 0) { s.time = 0; startWalk(G); }
      } else if (s.phase === "walk") {
        if (Math.random() < dt * 9) { const L = Math.random() < 0.5; s.flashes.push({ x: L ? Math.random() * G.W * 0.22 : G.W - Math.random() * G.W * 0.22, y: G.H * (0.25 + Math.random() * 0.6), t: 0.25 }); if (Math.random() < 0.4) G.sfx("pop"); }
        for (let i = s.flashes.length - 1; i >= 0; i--) { s.flashes[i].t -= dt; if (s.flashes[i].t <= 0) s.flashes.splice(i, 1); }
        if (s.pt >= WALK_T) { s.phase = "judge"; s.pt = 0; s.flashes.length = 0; s.judged = judge(G); s.added = false; }
      } else if (s.phase === "judge") {
        const J = s.judged;
        if (!s.added && s.pt > 2.4) {
          s.added = true; const sum = J.scores.reduce((a, b) => a + b, 0), tens = J.scores.filter(x => x === 10).length;
          J.pts = sum * 10 + tens * 50 + (tens === 3 ? 100 : 0); s.tens += tens;
          s.score = Math.min(9999, s.score + J.pts); s.history.push(sum);
          G.sfx(sum >= 21 ? "win" : sum <= 12 ? "lose" : "pop");
          if (sum >= 24) for (let i = 0; i < 24; i++) spark(G, G.W / 2, G.H * 0.35, 1.2);
        }
        if (s.pt > 8) advance(G);
      } else if (s.phase === "final") {
        if (s.pt > 3.2) finish(G);
      }
    },
    tap(G, x, y) {
      const s = G.s, L = lay(G);
      if (s.phase === "intro") { if (s.pt > 0.4) { s.phase = "style"; s.pt = 0; } return; }
      if (s.phase === "judge") { if (s.pt > 2.6) advance(G); return; }
      if (s.phase === "final") { if (s.pt > 1.2) finish(G); return; }
      if (s.phase !== "style") return;
      if (y >= L.tabY) { const i = Math.max(0, Math.min(5, Math.floor(x / (G.W / 6)))); s.tab = i; G.sfx("pop"); return; }
      if (y >= L.gridY) {
        const col = Math.floor((x - 8) / L.cw), row = Math.floor((y - L.gridY - 4) / L.cellH);
        if (col < 0 || col > 5 || row < 0 || row > 1) return;
        const idx = row * 6 + col, tab = TABS[s.tab].k;
        if (tab === "color") { if (idx < COLS.length) { s.color = idx; placeSpark(G, "top"); G.sfx("pop"); } return; }
        const list = ITEMS[tab]; if (idx >= list.length) return;
        s.pick[tab] = idx; if (idx) placeSpark(G, tab); G.sfx("pop");
        return;
      }
      if (y >= L.btnY) { if (Math.abs(x - G.W / 2) < Math.min(150, G.W / 2 - 10)) startWalk(G); return; }
    },
    swipe(G, dx, dy) {
      const s = G.s; if (s.phase !== "style" || !dx) return;
      s.tab = (s.tab + (dx < 0 ? 1 : 5)) % 6;
    },
    onKey(G, k, down) {
      const s = G.s; if (!down) return;
      if (s.phase === "intro" && k === " ") { s.phase = "style"; s.pt = 0; return; }
      if (s.phase === "judge" && k === " " && s.pt > 2.6) { advance(G); return; }
      if (s.phase !== "style") return;
      if (k === "ArrowLeft") s.tab = (s.tab + 5) % 6;
      else if (k === "ArrowRight") s.tab = (s.tab + 1) % 6;
      else if (k === "ArrowUp" || k === "ArrowDown") {
        const tab = TABS[s.tab].k, d = k === "ArrowDown" ? 1 : -1;
        if (tab === "color") s.color = (s.color + d + COLS.length) % COLS.length;
        else { const n = ITEMS[tab].length; s.pick[tab] = (s.pick[tab] + d + n) % n; placeSpark(G, tab); }
      } else if (k === "Enter") startWalk(G);
    },
    draw(G, c) {
      const s = G.s, P = pal(G), L = lay(G), W = G.W, H = G.H;
      if (s.phase === "walk") { drawRunway(G, c, P, L); return; }
      // backdrop
      const g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, P.bg1); g.addColorStop(1, P.bg2); c.fillStyle = g; c.fillRect(0, 0, W, H);
      drawBgSparkles(G, c, P);
      // stage spotlight + podium
      c.fillStyle = G.dark() ? "rgba(255,220,255,0.08)" : "rgba(255,255,255,0.45)";
      c.beginPath(); c.moveTo(W / 2 - 30, 30); c.lineTo(W / 2 + 30, 30); c.lineTo(W / 2 + 120, L.feet + 6); c.lineTo(W / 2 - 120, L.feet + 6); c.fill();
      c.fillStyle = G.dark() ? "#6b4fb0" : "#ff9fd0"; c.beginPath(); c.ellipse(W / 2, L.feet + 2, 92 * Math.min(1, L.k + 0.1), 12, 0, 0, 7); c.fill();
      // pup
      const bob = s.phase === "judge" ? Math.sin(s.pt * 6) * 2 : Math.sin(G.t * 2.2) * 1.5;
      drawPup(G, c, L.cx, L.feet + bob, L.k, s.pick, s.color, 0);
      drawSparks(G, c);
      // HUD
      c.fillStyle = "rgba(60,20,80,0.55)"; c.fillRect(0, 0, W, 30);
      G.text(c, `SCORE ${s.score}`, 10, 15, 11, "#fff", "left");
      G.text(c, `R${Math.min(s.round, ROUNDS)}/${ROUNDS}`, W / 2, 15, 11, "#ffd6f0");
      if (s.phase === "style" || s.phase === "intro") G.text(c, `${Math.ceil(s.time)}s`, W - 10, 15, 11, s.time < 8 ? "#ff6b8b" : "#ffd23f", "right");
      // theme banner
      drawThemeBanner(G, c, P, W / 2, 54, Math.min(W - 24, 330), 38);
      if (s.phase === "style" || s.phase === "intro") drawPicker(G, c, P, L);
      if (s.phase === "judge") drawJudges(G, c, P, L);
      if (s.phase === "intro") drawIntro(G, c, P);
      if (s.phase === "final") drawFinal(G, c, P);
    }
  });

  function spark(G, x, y, life) { const a = Math.random() * 6.28, v = 40 + Math.random() * 120; G.s.sparks.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 30, t: life || 0.7, e: Math.random() < 0.5 ? "✨" : Math.random() < 0.5 ? "⭐" : "💖" }); }
  function slotPos(G, sl) {
    const L = lay(G), k = L.k, x = L.cx, f = L.feet;
    const head = f - 192 * k;
    return sl === "hat" ? [x, head - 46 * k] : sl === "eyes" ? [x, head - 6 * k] : sl === "shoes" ? [x, f - 8 * k] : sl === "acc" ? [x + 58 * k, f - 92 * k] : [x, f - 110 * k];
  }
  function placeSpark(G, sl) { const [x, y] = slotPos(G, sl); for (let i = 0; i < 7; i++) spark(G, x, y, 0.6); }
  function startWalk(G) { const s = G.s; if (s.phase !== "style") return; s.phase = "walk"; s.pt = 0; s.sparks.length = 0; G.sfx("win"); }
  function advance(G) {
    const s = G.s; if (s.phase !== "judge") return;
    if (!s.added) return;
    if (s.round >= ROUNDS) { s.phase = "final"; s.pt = 0; for (let i = 0; i < 30; i++) spark(G, G.W / 2, G.H * 0.4, 1.4); G.sfx("win"); }
    else newRound(G);
  }
  function tier(sc) {
    return sc >= 1500 ? "Supermodel Top Dawg!" : sc >= 1200 ? "Top Model!" : sc >= 950 ? "Runway Rising Star" : sc >= 700 ? "Fashion Pup" : sc >= 400 ? "Thrift Store Chic" : "Wardrobe Malfunction";
  }
  function finish(G) { const s = G.s; if (s.done) return; s.done = true; G.over(Math.min(9999, s.score), tier(s.score)); }

  function drawBgSparkles(G, c, P) {
    const s = G.s; c.fillStyle = P.spark;
    for (let i = 0; i < s.bg.length; i++) {
      const b = s.bg[i], a = 0.25 + 0.35 * Math.sin(G.t * 2 + b.p), x = b.x * G.W, y = 30 + b.y * (G.H - 30), r = b.z * 0.35 * (0.6 + a);
      c.globalAlpha = Math.max(0, a); c.beginPath(); c.moveTo(x, y - r * 2); c.lineTo(x + r * 0.5, y - r * 0.5); c.lineTo(x + r * 2, y); c.lineTo(x + r * 0.5, y + r * 0.5); c.lineTo(x, y + r * 2); c.lineTo(x - r * 0.5, y + r * 0.5); c.lineTo(x - r * 2, y); c.lineTo(x - r * 0.5, y - r * 0.5); c.fill();
    }
    c.globalAlpha = 1;
  }
  function drawSparks(G, c) {
    const s = G.s;
    for (let i = 0; i < s.sparks.length; i++) { const p = s.sparks[i]; c.globalAlpha = Math.min(1, p.t * 2); G.emoji(c, p.e, p.x, p.y, 16); }
    c.globalAlpha = 1;
  }
  function drawThemeBanner(G, c, P, x, y, w, h) {
    const s = G.s, T = s.theme;
    c.fillStyle = P.card; c.strokeStyle = P.line; c.lineWidth = 3; rr(c, x - w / 2, y - h / 2, w, h, 12); c.fill(); c.stroke();
    G.emoji(c, T.e, x - w / 2 + 22, y, 22);
    txt(c, "THEME", x - w / 2 + 42, y - 9, 9, P.sub, "left", 800);
    txt(c, T.n, x - w / 2 + 42, y + 7, 15, P.ink, "left", 900);
    for (let i = 0; i < T.cols.length; i++) {
      const cx = x + w / 2 - 16 - i * 17; c.fillStyle = COLS[CI[T.cols[i]]].c; c.strokeStyle = P.ink; c.lineWidth = 1.5;
      c.beginPath(); c.arc(cx, y, 7, 0, 7); c.fill(); c.stroke();
    }
  }
  function drawPicker(G, c, P, L) {
    const s = G.s, W = G.W;
    c.fillStyle = P.panel; c.fillRect(0, L.gridY - 2, W, G.H - L.gridY + 2);
    c.fillStyle = P.line; c.fillRect(0, L.gridY - 2, W, 3);
    // walk button
    const bw = Math.min(300, W - 20), bx = W / 2 - bw / 2, by = L.btnY + 5, bh = L.btnH - 10, pulse = 0.5 + 0.5 * Math.sin(G.t * 5);
    c.fillStyle = "rgba(120,40,120,0.25)"; rr(c, bx, by + 4, bw, bh, bh / 2); c.fill();
    const bg = c.createLinearGradient(bx, 0, bx + bw, 0); bg.addColorStop(0, "#ff6fb5"); bg.addColorStop(1, "#a66bff");
    c.fillStyle = bg; rr(c, bx, by, bw, bh, bh / 2); c.fill();
    c.strokeStyle = `rgba(255,255,255,${0.5 + 0.5 * pulse})`; c.lineWidth = 2.5; c.stroke();
    txt(c, "✨ WALK THE RUNWAY! ✨", W / 2, by + bh / 2 + 1, 15, "#fff", "center", 900);
    // grid
    const tab = TABS[s.tab].k, ch = L.cellH, cw = L.cw;
    const list = tab === "color" ? COLS : ITEMS[tab];
    for (let i = 0; i < 12; i++) {
      const col = i % 6, row = (i / 6) | 0, x = 8 + col * cw, y = L.gridY + 4 + row * ch;
      if (i >= list.length) continue;
      const on = tab === "color" ? s.color === i : s.pick[tab] === i;
      c.fillStyle = on ? P.cellOn : P.cell; rr(c, x + 3, y + 3, cw - 6, ch - 6, 12); c.fill();
      if (on) { c.strokeStyle = G.dark() ? "#ffd6f5" : "#ff4fa3"; c.lineWidth = 3; c.stroke(); }
      if (tab === "color") {
        c.fillStyle = COLS[i].c; c.strokeStyle = P.ink; c.lineWidth = 2; c.beginPath(); c.arc(x + cw / 2, y + ch / 2, Math.min(cw, ch) * 0.3, 0, 7); c.fill(); c.stroke();
      } else if (!list[i].e) {
        txt(c, "NONE", x + cw / 2, y + ch / 2, 11, P.sub, "center", 900);
      } else {
        G.emoji(c, list[i].e, x + cw / 2, y + ch / 2 + 1, Math.min(34, ch * 0.58));
        if (tab === "top") { c.fillStyle = COLS[s.color].c; c.strokeStyle = P.ink; c.lineWidth = 1; c.beginPath(); c.arc(x + cw - 12, y + 12, 5, 0, 7); c.fill(); c.stroke(); }
      }
    }
    // tabs
    const tw = W / 6;
    c.fillStyle = G.dark() ? "#1d1631" : "#ffe3f3"; c.fillRect(0, L.tabY, W, L.tabH);
    for (let i = 0; i < 6; i++) {
      const on = s.tab === i, x = i * tw;
      if (on) { c.fillStyle = P.cellOn; rr(c, x + 3, L.tabY + 3, tw - 6, L.tabH - 6, 10); c.fill(); }
      G.emoji(c, TABS[i].e, x + tw / 2, L.tabY + 16, 18);
      txt(c, TABS[i].n, x + tw / 2, L.tabY + 35, 9, on ? P.ink : P.sub, "center", 900);
      const k = TABS[i].k;
      if (k !== "color" && s.pick[k]) { c.fillStyle = "#3ccf7a"; c.beginPath(); c.arc(x + tw - 10, L.tabY + 9, 4, 0, 7); c.fill(); }
    }
  }
  function drawIntro(G, c, P) {
    const s = G.s, W = G.W, H = G.H, a = Math.min(1, s.pt * 4), sc = 0.6 + 0.4 * Math.min(1, s.pt * 3.5);
    c.fillStyle = `rgba(30,10,40,${0.45 * a})`; c.fillRect(0, 0, W, H);
    c.save(); c.translate(W / 2, H * 0.42); c.scale(sc, sc); c.rotate(Math.sin(s.pt * 3) * 0.03);
    const w = Math.min(300, W - 40), h = 190;
    c.fillStyle = P.card; c.strokeStyle = "#ff6fb5"; c.lineWidth = 5; rr(c, -w / 2, -h / 2, w, h, 20); c.fill(); c.stroke();
    txt(c, `ROUND ${s.round} OF ${ROUNDS}`, 0, -h / 2 + 24, 13, P.sub, "center", 900);
    G.emoji(c, s.theme.e, 0, -14, 56);
    txt(c, s.theme.n, 0, 42, 24, P.ink, "center", 900);
    txt(c, "30 seconds. Make it fashion.", 0, 70, 13, P.sub, "center", 700);
    c.restore();
  }
  function drawJudges(G, c, P, L) {
    const s = G.s, J = s.judged, W = G.W, y0 = L.panelY;
    c.fillStyle = P.panel; c.fillRect(0, y0, W, G.H - y0); c.fillStyle = P.line; c.fillRect(0, y0, W, 3);
    // judges table
    const tw = W / 3, hgt = G.H - y0;
    for (let i = 0; i < 3; i++) {
      const x = tw * i + tw / 2, rev = s.pt > 0.5 + i * 0.6, j = JUDGES[i];
      const fy = y0 + hgt * 0.62;
      // scorecard
      const up = rev ? Math.min(1, (s.pt - 0.5 - i * 0.6) * 5) : 0, cy = fy - 50 - up * 12;
      c.fillStyle = "#8a5a3a"; c.fillRect(x - 2, cy, 4, fy - cy - 10);
      c.fillStyle = "#fff"; c.strokeStyle = "#ff6fb5"; c.lineWidth = 3; rr(c, x - 26, cy - 30, 52, 40, 8); c.fill(); c.stroke();
      if (rev) txt(c, String(J.scores[i]), x, cy - 9, 28, J.scores[i] >= 8 ? "#e0228a" : J.scores[i] >= 5 ? "#6b3fb0" : "#555", "center", 900);
      else txt(c, "?", x, cy - 10, 22, "#c9a8de", "center", 900);
      if (rev && J.scores[i] === 10) G.emoji(c, "✨", x + 26, cy - 30, 16);
      if (j.who[0] === ":") G.img(c, j.who, x, fy, 54); else G.emoji(c, j.who, x, fy, 44);
      txt(c, j.n.toUpperCase(), x, fy + 30, 10, P.sub, "center", 900);
      if (rev) wrapQuip(c, J.quips[i], x, fy + 46, tw - 8, P.ink);
    }
    // table edge
    if (s.added) {
      const sum = J.scores[0] + J.scores[1] + J.scores[2];
      const by = L.mBot - 36, bw = Math.min(150, W / 2 - 20);
      c.fillStyle = "rgba(255,111,181,0.95)"; rr(c, 10, by, bw, 30, 15); c.fill();
      txt(c, `${sum}/30  +${J.pts}`, 10 + bw / 2, by + 16, 15, "#fff", "center", 900);
      if (s.pt > 2.6) {
        const blink = Math.sin(G.t * 6) > -0.4;
        if (blink) { c.fillStyle = "rgba(60,20,80,0.75)"; rr(c, W - 128, L.mBot - 34, 118, 28, 14); c.fill(); txt(c, s.round >= ROUNDS ? "RESULTS ▶" : "NEXT LOOK ▶", W - 69, L.mBot - 19, 12, "#fff", "center", 900); }
      }
    }
  }
  function wrapQuip(c, str, x, y, maxW, col) {
    c.font = `800 11px system-ui, -apple-system, "Segoe UI", sans-serif`;
    if (c.measureText(str).width <= maxW) { txt(c, str, x, y, 11, col, "center", 800); return; }
    const words = str.split(" "); let a = "", i = 0;
    for (; i < words.length; i++) { const t = a ? a + " " + words[i] : words[i]; if (c.measureText(t).width > maxW && a) break; a = t; }
    txt(c, a, x, y, 11, col, "center", 800); txt(c, words.slice(i).join(" "), x, y + 13, 11, col, "center", 800);
  }
  function drawFinal(G, c, P) {
    const s = G.s, W = G.W, H = G.H;
    c.fillStyle = "rgba(30,10,40,0.6)"; c.fillRect(0, 0, W, H);
    const w = Math.min(320, W - 30), h = 230, y = H * 0.4;
    c.fillStyle = P.card; c.strokeStyle = "#ffd23f"; c.lineWidth = 5; rr(c, W / 2 - w / 2, y - h / 2, w, h, 20); c.fill(); c.stroke();
    G.emoji(c, "👑", W / 2, y - h / 2 + 36, 40);
    txt(c, "SEASON FINALE", W / 2, y - h / 2 + 72, 12, P.sub, "center", 900);
    txt(c, tier(s.score), W / 2, y - 4, w < 300 ? 19 : 22, P.ink, "center", 900);
    G.text(c, `${s.score} PTS`, W / 2, y + 34, 16, "#ff4fa3");
    txt(c, `Perfect 10s: ${s.tens}`, W / 2, y + 66, 13, P.sub, "center", 800);
    drawSparks(G, c);
  }
  function drawRunway(G, c, P, L) {
    const s = G.s, W = G.W, H = G.H, d = G.dark(), p = Math.min(1, s.pt / (WALK_T - 0.5));
    c.fillStyle = d ? "#120c1f" : "#3a1f4f"; c.fillRect(0, 0, W, H);
    // back curtain + lights
    c.fillStyle = d ? "#3b1f55" : "#7a3d8c"; c.fillRect(0, 0, W, H * 0.3);
    for (let i = 0; i < 9; i++) { c.fillStyle = i % 2 ? "#ffd23f" : "#ff8fc8"; c.globalAlpha = 0.5 + 0.5 * Math.sin(G.t * 8 + i); c.beginPath(); c.arc(W * (i + 0.5) / 9, 14, 5, 0, 7); c.fill(); }
    c.globalAlpha = 1;
    G.text(c, "DAWG DRIP", W / 2, H * 0.12, 18, "#ffd6f0");
    G.text(c, s.theme.n, W / 2, H * 0.12 + 26, 10, "#ffd23f");
    // runway (perspective)
    const top = H * 0.3, bw = W * 0.18, fw = W * 0.86;
    const rg = c.createLinearGradient(0, top, 0, H); rg.addColorStop(0, "#ff9fd0"); rg.addColorStop(1, "#ff4fa3");
    c.fillStyle = rg; c.beginPath(); c.moveTo(W / 2 - bw / 2, top); c.lineTo(W / 2 + bw / 2, top); c.lineTo(W / 2 + fw / 2, H); c.lineTo(W / 2 - fw / 2, H); c.fill();
    c.fillStyle = "#fff6"; for (let i = 0; i < 8; i++) { const t = ((i / 8) + s.pt * 0.15) % 1, yy = top + (H - top) * t * t, ww = bw + (fw - bw) * t * t; c.fillRect(W / 2 - ww / 2, yy, 4, 3); c.fillRect(W / 2 + ww / 2 - 4, yy, 4, 3); }
    // audience silhouettes with cameras
    for (let i = 0; i < 7; i++) {
      const yy = H * 0.38 + i * H * 0.085;
      G.emoji(c, i % 2 ? "📸" : "🐶", W * 0.07, yy, 22); G.emoji(c, i % 2 ? "🐱" : "📸", W * 0.93, yy, 22);
    }
    // pup walking toward the camera
    const ep = p * p * (3 - 2 * p);
    const maxK = Math.min(L.k * 1.2, (H - 80) / 250), k = maxK * (0.45 + 0.55 * ep), feet = top + 40 + (H - 30 - top - 40) * ep;
    const step = Math.sin(s.pt * 10);
    drawPup(G, c, W / 2 + step * 4 * k, feet - Math.abs(step) * 4 * k, k, s.pick, s.color, step);
    // flashes
    for (let i = 0; i < s.flashes.length; i++) {
      const f = s.flashes[i], r = 30 * (f.t / 0.25) + 8; c.globalAlpha = f.t / 0.25;
      c.fillStyle = "#fff"; c.beginPath(); c.arc(f.x, f.y, r, 0, 7); c.fill();
      c.fillStyle = "rgba(255,255,255,0.12)"; c.fillRect(0, 0, W, H);
    }
    c.globalAlpha = 1;
    if (s.pt > WALK_T - 0.9) { G.text(c, "SERVE!", W / 2, H * 0.24, 22, "#ffd23f"); G.emoji(c, "💅", W / 2 + 90, H * 0.24, 26); }
  }

  // The model: a cream pup standing in a pose, with the bulldog face. Origin = feet center. k = scale.
  function drawPup(G, c, x, f, k, pick, colorIdx, step) {
    const fur = "#f2d3a8", furD = "#c99a63", ink = "#5a3a22";
    const topItem = ITEMS.top[pick.top], col = COLS[colorIdx].c, colD = shade(col, -0.3), colL = shade(col, 0.35);
    const sw = step || 0;
    c.save(); c.translate(x, f); c.scale(k, k);
    c.lineJoin = "round"; c.lineCap = "round";
    // tail
    c.strokeStyle = furD; c.lineWidth = 9; c.beginPath(); c.moveTo(-22, -84); c.quadraticCurveTo(-52, -96, -44, -122); c.stroke();
    // legs
    const leg = (lx, off) => { c.fillStyle = fur; c.strokeStyle = ink; c.lineWidth = 2.5; rr(c, lx - 9, -72 + off, 18, 70 - off, 8); c.fill(); c.stroke(); };
    leg(-15, Math.max(0, sw) * 6); leg(15, Math.max(0, -sw) * 6);
    // body
    c.fillStyle = fur; c.strokeStyle = ink; c.lineWidth = 2.5;
    c.beginPath(); c.ellipse(0, -112, 36, 50, 0, 0, 7); c.fill(); c.stroke();
    c.fillStyle = "#fff1dc"; c.beginPath(); c.ellipse(0, -104, 20, 32, 0, 0, 7); c.fill();
    // outfit
    if (topItem.e) drawTop(c, topItem.s, col, colD, colL, ink);
    // arms (left on hip, right out to hold accessory)
    c.strokeStyle = ink; c.lineWidth = 15; c.beginPath(); c.moveTo(-30, -142); c.lineTo(-50, -114); c.lineTo(-30, -94); c.stroke();
    c.strokeStyle = fur; c.lineWidth = 10; c.beginPath(); c.moveTo(-30, -142); c.lineTo(-50, -114); c.lineTo(-30, -94); c.stroke();
    c.strokeStyle = ink; c.lineWidth = 15; c.beginPath(); c.moveTo(30, -142); c.lineTo(52, -112); c.lineTo(58, -94); c.stroke();
    c.strokeStyle = fur; c.lineWidth = 10; c.beginPath(); c.moveTo(30, -142); c.lineTo(52, -112); c.lineTo(58, -94); c.stroke();
    if (topItem.e && sleeves(topItem.s)) {
      c.strokeStyle = col; c.lineWidth = 13; c.beginPath(); c.moveTo(-30, -142); c.lineTo(-44, -122); c.stroke(); c.beginPath(); c.moveTo(30, -142); c.lineTo(46, -120); c.stroke();
      if (topItem.s === "coat" || topItem.s === "sweater" || topItem.s === "lab" || topItem.s === "robe") { c.beginPath(); c.moveTo(-44, -122); c.lineTo(-50, -114); c.lineTo(-38, -100); c.stroke(); c.beginPath(); c.moveTo(46, -120); c.lineTo(52, -112); c.lineTo(56, -100); c.stroke(); }
    }
    // paws
    c.fillStyle = fur; c.strokeStyle = ink; c.lineWidth = 2.5;
    c.beginPath(); c.arc(-28, -93, 7, 0, 7); c.fill(); c.stroke(); c.beginPath(); c.arc(58, -92, 7, 0, 7); c.fill(); c.stroke();
    // shoes or feet
    const sh = ITEMS.shoes[pick.shoes];
    if (sh.e) {
      G.emoji(c, sh.e, -18, -10 + Math.max(0, sw) * -4, 30);
      c.save(); c.translate(18, -10 + Math.max(0, -sw) * -4); c.scale(-1, 1); G.emoji(c, sh.e, 0, 0, 30); c.restore();
    } else {
      c.fillStyle = fur; c.strokeStyle = ink; c.lineWidth = 2.5;
      c.beginPath(); c.ellipse(-17, -4, 12, 7, 0, 0, 7); c.fill(); c.stroke(); c.beginPath(); c.ellipse(17, -4, 12, 7, 0, 0, 7); c.fill(); c.stroke();
    }
    // accessory in right paw
    const ac = ITEMS.acc[pick.acc];
    if (ac.e) G.emoji(c, ac.e, 62, -84, ac.e === "🏄" || ac.e === "🎸" ? 46 : 36);
    // head
    const hy = -192;
    G.img(c, ":dawgpog:", 0, hy, 96);
    const ey = ITEMS.eyes[pick.eyes];
    if (ey.e) {
      if (ey.e === "⭐" || ey.e === "💖") { G.emoji(c, ey.e, -17, hy - 4, 28); G.emoji(c, ey.e, 17, hy - 4, 28); }
      else G.emoji(c, ey.e, 0, hy - 4, ey.e === "🎭" ? 50 : 52);
    }
    const hat = ITEMS.hat[pick.hat];
    if (hat.e) G.emoji(c, hat.e, 0, hy - 48, hat.e === "🎧" ? 66 : 54);
    c.restore();
  }
  function sleeves(st) { return st !== "gown" && st !== "swim" && st !== "tank" && st !== "vest" && st !== "drape"; }
  function drawTop(c, st, col, colD, colL, ink) {
    c.fillStyle = col; c.strokeStyle = colD; c.lineWidth = 3;
    if (st === "gown") {
      c.beginPath(); c.moveTo(-22, -150); c.lineTo(22, -150); c.lineTo(26, -110); c.lineTo(58, -8); c.quadraticCurveTo(0, 4, -58, -8); c.lineTo(-26, -110); c.closePath(); c.fill(); c.stroke();
      c.strokeStyle = colL; c.lineWidth = 2; for (let i = -2; i <= 2; i++) { c.beginPath(); c.moveTo(i * 6, -104); c.lineTo(i * 18, -10); c.stroke(); }
      c.fillStyle = colL; c.fillRect(-26, -114, 52, 6);
    } else if (st === "drape") {
      c.beginPath(); c.moveTo(-28, -148); c.lineTo(30, -150); c.lineTo(46, -6); c.quadraticCurveTo(0, 2, -46, -6); c.closePath(); c.fill(); c.stroke();
      c.fillStyle = colL; c.beginPath(); c.moveTo(30, -150); c.lineTo(-36, -60); c.lineTo(-24, -54); c.lineTo(36, -138); c.fill();
      c.fillStyle = "#e8b923"; c.fillRect(-46, -14, 92, 6);
    } else if (st === "robe") {
      c.beginPath(); c.moveTo(-34, -150); c.lineTo(34, -150); c.lineTo(42, -36); c.lineTo(-42, -36); c.closePath(); c.fill(); c.stroke();
      c.strokeStyle = colL; c.lineWidth = 4; c.beginPath(); c.moveTo(-14, -150); c.lineTo(10, -110); c.lineTo(10, -36); c.stroke();
      c.fillStyle = colD; c.fillRect(-38, -100, 76, 9);
    } else if (st === "coat" || st === "lab") {
      c.beginPath(); c.moveTo(-36, -150); c.lineTo(36, -150); c.lineTo(42, -48); c.lineTo(-42, -48); c.closePath(); c.fill(); c.stroke();
      c.strokeStyle = colD; c.lineWidth = 2; c.beginPath(); c.moveTo(0, -150); c.lineTo(0, -48); c.stroke();
      c.fillStyle = colD; for (let i = 0; i < 4; i++) { c.beginPath(); c.arc(6, -136 + i * 22, 3, 0, 7); c.fill(); }
      if (st === "coat") { c.fillStyle = "#fff"; c.fillRect(-36, -154, 72, 8); }
      else { c.fillStyle = colL; c.fillRect(-30, -96, 18, 12); }
    } else if (st === "vest") {
      c.beginPath(); c.moveTo(-32, -150); c.lineTo(32, -150); c.lineTo(36, -66); c.lineTo(-36, -66); c.closePath(); c.fill(); c.stroke();
      c.fillStyle = "#fff"; c.globalAlpha = 0.85; c.fillRect(-34, -112, 68, 7); c.fillRect(-35, -88, 70, 7); c.globalAlpha = 1;
      c.fillStyle = "#fff1dc"; c.beginPath(); c.moveTo(-10, -150); c.lineTo(10, -150); c.lineTo(0, -120); c.fill();
    } else if (st === "swim") {
      c.beginPath(); c.moveTo(-22, -148); c.lineTo(-14, -148); c.quadraticCurveTo(0, -128, 14, -148); c.lineTo(22, -148); c.lineTo(30, -96); c.lineTo(22, -64); c.lineTo(-22, -64); c.lineTo(-30, -96); c.closePath(); c.fill(); c.stroke();
      c.fillStyle = colL; for (let i = 0; i < 3; i++) { c.beginPath(); c.arc(-12 + i * 12, -100 + (i % 2) * 14, 4, 0, 7); c.fill(); }
    } else { // tee, tank, blouse, sweater
      const bot = st === "blouse" ? -58 : -68;
      c.beginPath(); c.moveTo(-32, -148); c.lineTo(32, -148); c.lineTo(36, bot); c.lineTo(-36, bot); c.closePath(); c.fill(); c.stroke();
      if (st === "tank") { c.fillStyle = "#fff1dc"; c.beginPath(); c.arc(0, -150, 14, 0, Math.PI); c.fill(); c.fillStyle = colL; c.font = "900 18px system-ui"; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText("23", 0, -104); }
      else if (st === "tee") { c.fillStyle = colL; c.beginPath(); c.arc(0, -108, 11, 0, 7); c.fill(); G_emojiStar(c, 0, -108, colD); }
      else if (st === "blouse") { c.fillStyle = colL; c.beginPath(); c.moveTo(-16, -148); c.lineTo(0, -130); c.lineTo(16, -148); c.fill(); c.fillStyle = "#fff"; for (let i = 0; i < 3; i++) { c.beginPath(); c.arc(0, -120 + i * 18, 2.5, 0, 7); c.fill(); } }
      else if (st === "sweater") { c.strokeStyle = colL; c.lineWidth = 4; c.beginPath(); for (let i = 0; i <= 8; i++) c.lineTo(-32 + i * 8, -112 + (i % 2) * 8); c.stroke(); c.fillStyle = colD; c.fillRect(-36, bot - 7, 72, 7); }
    }
  }
  function G_emojiStar(c, x, y, col) {
    c.fillStyle = col; c.beginPath();
    for (let i = 0; i < 10; i++) { const r = i % 2 ? 3.5 : 8, a = -Math.PI / 2 + i * Math.PI / 5; c.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r); }
    c.fill();
  }
})();
