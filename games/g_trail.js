// ---------- Dawg Trail (wagon-trail adventure) ----------
// Lead a pack of 4 pups 1,200 miles to the Great Dog Park. Manage kibble, pace, rivers, sickness. Hunt squirrels for food.
defGame({
  key: "trail", name: "Dawg Trail", icon: "🐂", max: 9999,
  blurb: "Wagon-trail adventure. Get the pack west.",
  how: "Lead 4 pups 1,200 miles to the Great Dog Park. Tap TRAVEL to roll on a day. Fast pace covers more ground but eats more kibble and gets pups sick. HUNT to catch squirrels for kibble (tap them before they run off). REST heals sick pups. Cross rivers, shop at forts. Score: pups who make it, kibble and treats left, plus a speed bonus.",
  GOAL: 1200,
  STOPS: [{ m: 200, k: "river", n: "KIBBLE RIVER" }, { m: 420, k: "fort", n: "FORT FIDO" }, { m: 680, k: "river", n: "SNAKE CREEK" }, { m: 900, k: "fort", n: "FORT BARKLEY" }, { m: 1050, k: "river", n: "BIG MUDDY" }],
  reset(G) {
    G.s = { mi: 0, day: 1, food: 160, treats: 40, fast: false, wag: 0,
      pups: [{ n: "BISCUIT", hp: 100, sick: 0, ok: 1 }, { n: "TANK", hp: 100, sick: 0, ok: 1 }, { n: "PICKLES", hp: 100, sick: 0, ok: 1 }, { n: "GRAVY", hp: 100, sick: 0, ok: 1 }],
      log: ["THE PACK SETS OUT WEST!"], mode: "trail", stop: 0, hunt: null, btns: [], endT: null };
  },
  alive(s) { return s.pups.filter(p => p.ok); },
  say(s, m) { s.log.unshift(m); s.log.length = Math.min(s.log.length, 4); },
  day(G, kind) {
    const s = G.s, A = this.alive(s); s.day++;
    const eat = A.length * (kind === "rest" ? 2 : s.fast ? 3.2 : 2.4); s.food = Math.max(0, Math.round(s.food - eat));
    if (kind === "travel") { const go = Math.round((s.fast ? 30 : 20) * (0.85 + Math.random() * 0.3)); s.mi = Math.min(this.GOAL, s.mi + go); s.wag = 1; }
    A.forEach(p => {
      if (!s.food) p.hp -= 12;
      if (p.sick) { p.hp -= kind === "rest" ? 0 : 9; if (kind === "rest" && Math.random() < 0.55) { p.sick = 0; this.say(s, `${p.n} FEELS BETTER`); } }
      else if (kind === "rest") p.hp = Math.min(100, p.hp + 15);
      else if (Math.random() < (s.fast ? 0.06 : 0.025)) { p.sick = 1; this.say(s, `${p.n} HAS ${["THE SCOOTS", "FLEAS", "A TUMMY ACHE", "KENNEL COUGH"][Math.floor(Math.random() * 4)]}`); }
      if (p.hp <= 0 && p.ok) { p.ok = 0; this.say(s, `${p.n} WENT TO A FARM UPSTATE 🌾`); G.sfx("lose"); G.buzz(); }
    });
    if (!s.food) this.say(s, "OUT OF KIBBLE! HUNT!");
    if (kind === "travel" && Math.random() < 0.22) this.event(G);
    if (!this.alive(s).length) { s.mode = "end"; s.endT = 1.5; this.say(s, "THE WHOLE PACK IS GONE..."); return; }
    const st = this.STOPS[s.stop];
    if (st && s.mi >= st.m) { s.mi = st.m; s.mode = st.k; this.say(s, `ARRIVED AT ${st.n}`); }
    if (s.mi >= this.GOAL) { s.mode = "end"; s.endT = 1.5; s.won = true; this.say(s, "MADE IT TO THE GREAT DOG PARK!"); G.sfx("win"); }
  },
  event(G) {
    const s = G.s, A = this.alive(s), p = A[Math.floor(Math.random() * A.length)], r = Math.floor(Math.random() * 6);
    if (r === 0) { const l = Math.min(s.food, 20 + Math.floor(Math.random() * 30)); s.food -= l; this.say(s, `RACCOONS STOLE ${l} LB KIBBLE`); }
    else if (r === 1) { s.day++; this.say(s, "BROKEN WAGON WHEEL. LOST A DAY"); }
    else if (r === 2) { s.treats += 15; this.say(s, "FOUND A SQUEAKY TOY! +15 TREATS"); }
    else if (r === 3) { s.mi = Math.min(this.GOAL - 1, s.mi + 12); this.say(s, `${p.n} GOT THE ZOOMIES! +12 MI`); }
    else if (r === 4) { p.sick = 1; this.say(s, `${p.n} ATE SOMETHING WEIRD`); }
    else { s.food += 25; this.say(s, "A KIND MAILMAN GAVE 25 LB KIBBLE"); }
  },
  river(G, how) {
    const s = G.s, st = this.STOPS[s.stop];
    if (how === "ferry") { if (s.treats < 20) { this.say(s, "FERRY COSTS 20 TREATS"); return; } s.treats -= 20; this.say(s, "SAFE FERRY RIDE ACROSS"); }
    else {
      const risk = how === "ford" ? 0.4 : 0.2;
      if (Math.random() < risk) {
        const l = Math.min(s.food, 30 + Math.floor(Math.random() * 40)); s.food -= l; this.say(s, `WAGON TIPPED! LOST ${l} LB KIBBLE`); G.buzz();
        const A = this.alive(s); if (how === "ford" && Math.random() < 0.35 && A.length > 1) { const p = A[Math.floor(Math.random() * A.length)]; p.sick = 1; p.hp -= 30; this.say(s, `${p.n} GOT SOAKED AND SICK`); }
      } else this.say(s, how === "ford" ? "FORDED IT! WET PAWS" : "FLOATED ACROSS FINE");
    }
    s.stop++; s.mi += 1; s.mode = "trail";
  },
  update(G, dt) {
    const s = G.s; if (s.wag) s.wag = Math.max(0, s.wag - dt * 1.5);
    if (s.endT != null) { s.endT -= dt; if (s.endT <= 0) { s.endT = null; const A = this.alive(s).length; const sc = s.won ? A * 1000 + Math.min(500, s.food) + s.treats * 2 + Math.max(0, 120 - s.day) * 10 : Math.round(s.mi / 2); G.over(Math.min(9999, sc), s.won ? (A === 4 ? "Whole pack made it! 🏆" : `${A} of 4 pups made it.`) : "The trail wins this time."); } return; }
    const h = s.hunt; if (!h) return;
    h.t -= dt;
    if (h.t <= 0) { const g = Math.min(100, h.got); s.food += g; this.say(s, h.got > 100 ? `HUNT: CAN ONLY CARRY 100 LB BACK` : `HUNT: +${g} LB KIBBLE`); s.hunt = null; s.mode = "trail"; this.day(G, "hunt"); return; }
    h.sp -= dt; if (h.sp <= 0) { h.sp = 0.5 + Math.random() * 0.5; const L = Math.random() < 0.5, big = Math.random() < 0.25; h.c.push({ x: L ? -20 : G.W + 20, y: 140 + Math.random() * (G.H - 300), vx: (L ? 1 : -1) * (big ? 90 : 150 + Math.random() * 80), big }); }
    h.c.forEach(a => a.x += a.vx * dt); h.c = h.c.filter(a => !a.got && a.x > -40 && a.x < G.W + 40);
  },
  tap(G, x, y) {
    const s = G.s;
    if (s.mode === "hunt" && s.hunt) { const a = s.hunt.c.find(a => Math.hypot(a.x - x, a.y - y) < 34); if (a) { a.got = 1; s.hunt.got += a.big ? 25 : 12; s.hunt.fx.push({ x: a.x, y: a.y, t: 0.5, txt: a.big ? "+25" : "+12" }); G.sfx("pop"); } return; }
    const b = s.btns.find(b => x > b.x && x < b.x + b.w && y > b.y && y < b.y + b.h); if (!b || s.endT != null) return;
    G.sfx("pop");
    if (b.id === "travel") this.day(G, "travel");
    else if (b.id === "rest") { this.day(G, "rest"); this.say(s, "THE PACK RESTED A DAY"); }
    else if (b.id === "pace") s.fast = !s.fast;
    else if (b.id === "hunt") { s.mode = "hunt"; s.hunt = { t: 12, got: 0, c: [], sp: 0.3, fx: [] }; }
    else if (b.id === "ford" || b.id === "float" || b.id === "ferry") this.river(G, b.id);
    else if (b.id === "buy") { if (s.treats >= 10) { s.treats -= 10; s.food += 40; this.say(s, "BOUGHT 40 LB KIBBLE"); } else this.say(s, "NOT ENOUGH TREATS"); }
    else if (b.id === "vet") { const sk = this.alive(s).filter(p => p.sick || p.hp < 100); if (s.treats >= 15 && sk.length) { s.treats -= 15; sk.forEach(p => { p.sick = 0; p.hp = 100; }); this.say(s, "VET PATCHED EVERYONE UP"); } else this.say(s, sk.length ? "VET COSTS 15 TREATS" : "EVERYONE'S HEALTHY"); }
    else if (b.id === "leave") { s.stop++; s.mi += 1; s.mode = "trail"; }
  },
  btn(c, G, id, label, x, y, w, h, hot) {
    G.s.btns.push({ id, x, y, w, h });
    c.fillStyle = hot ? "#ffd23f" : "#2e2a24"; c.fillRect(x, y, w, h); c.strokeStyle = "#ffd23f"; c.lineWidth = 2; c.strokeRect(x + 1, y + 1, w - 2, h - 2);
    G.text(c, label, x + w / 2, y + h / 2 + 1, Math.min(12, w / (label.length * 0.95 + 1)), hot ? "#222" : "#ffd23f");
  },
  draw(G, c) {
    const s = G.s, W = G.W, H = G.H, dark = G.dark(); s.btns = [];
    if (s.mode === "hunt" && s.hunt) {
      c.fillStyle = dark ? "#1f3a1c" : "#8bc56a"; c.fillRect(0, 0, W, H);
      for (let i = 0; i < 9; i++) G.emoji(c, "🌲", (i * 97) % W + 20, 70 + (i * 131) % (H - 140), 30);
      s.hunt.c.forEach(a => { c.save(); c.translate(a.x, a.y); if (a.vx < 0) c.scale(-1, 1); G.emoji(c, a.big ? "🐇" : "🐿️", 0, 0, a.big ? 44 : 34); c.restore(); });
      s.hunt.fx.forEach(e => { e.t -= 0.016; if (e.t > 0) G.text(c, e.txt, e.x, e.y - (0.5 - e.t) * 40, 12, "#ffd23f"); });
      G.hud(c, `KIBBLE +${s.hunt.got}`, "HUNTING", `${Math.ceil(s.hunt.t)}s`);
      G.hint(c, "TAP THE CRITTERS!", 99, H - 40);
      return;
    }
    // sky + ground + wagon
    const gy = Math.round(H * 0.32);
    c.fillStyle = dark ? "#1b1f3a" : "#9ed8ff"; c.fillRect(0, 0, W, gy);
    c.fillStyle = dark ? "#4a3a24" : "#d9b77a"; c.fillRect(0, gy, W, H - gy);
    const off = (s.mi * 6) % 120; c.fillStyle = dark ? "#3a2c1a" : "#c39c5c"; for (let x = -off; x < W; x += 120) { c.beginPath(); c.moveTo(x, gy); c.lineTo(x + 50, gy - 40); c.lineTo(x + 100, gy); c.fill(); }
    const bob = Math.sin(G.t * 12) * 2 * s.wag, wx = W * 0.55;
    c.fillStyle = "#f4ead2"; c.beginPath(); c.ellipse(wx, gy - 10 + bob, 46, 30, 0, Math.PI, 0); c.fill();
    c.fillStyle = "#7a4a22"; c.fillRect(wx - 48, gy - 12 + bob, 96, 14);
    c.fillStyle = "#3b2414"; [wx - 32, wx + 32].forEach(x => { c.beginPath(); c.arc(x, gy + 6, 11, 0, 7); c.fill(); });
    G.img(c, ":dawgW:", wx - 76, gy - 8 + bob, 40);
    // progress bar with stops
    const py = gy + 30; c.fillStyle = "rgba(0,0,0,0.25)"; c.fillRect(16, py, W - 32, 8); c.fillStyle = "#5be35b"; c.fillRect(16, py, (W - 32) * s.mi / this.GOAL, 8);
    this.STOPS.forEach(t => G.emoji(c, t.k === "river" ? "🌊" : "🏰", 16 + (W - 32) * t.m / this.GOAL, py + 4, 14)); G.emoji(c, "🏞️", W - 16, py + 4, 16);
    // stats
    const ink = dark ? "#fff" : "#2b1d0e", sy = py + 30;
    G.text(c, `DAY ${s.day}`, 16, sy, 11, ink, "left"); G.text(c, `${s.mi}/${this.GOAL} MI`, W - 16, sy, 11, ink, "right");
    G.text(c, `🍖 ${s.food} LB`, 16, sy + 22, 11, s.food < 30 ? "#e53935" : ink, "left"); G.text(c, `🦴 ${s.treats} TREATS`, W - 16, sy + 22, 11, ink, "right");
    s.pups.forEach((p, i) => {
      const x = 16 + i * ((W - 32) / 4), w = (W - 32) / 4 - 6, y = sy + 40;
      c.fillStyle = "rgba(0,0,0,0.18)"; c.fillRect(x, y, w, 40);
      G.text(c, p.n, x + w / 2, y + 12, Math.min(10, w / 7.5), p.ok ? ink : "#888");
      if (p.ok) { c.fillStyle = "#300"; c.fillRect(x + 6, y + 26, w - 12, 6); c.fillStyle = p.sick ? "#ff9f43" : "#5be35b"; c.fillRect(x + 6, y + 26, (w - 12) * Math.max(0, p.hp) / 100, 6); }
      else G.text(c, "🌾", x + w / 2, y + 29, 10, ink);
    });
    // log
    const ly = sy + 96; s.log.forEach((m, i) => G.text(c, m, W / 2, ly + i * 18, Math.min(10, (W - 20) / (m.length * 0.95)), i ? (dark ? "#bbb" : "#6b5a40") : ink));
    // buttons
    const by = H - 132, bw = (W - 42) / 2;
    if (s.mode === "trail") {
      this.btn(c, G, "travel", "TRAVEL", 14, by, bw, 54, true); this.btn(c, G, "hunt", "HUNT", 28 + bw, by, bw, 54);
      this.btn(c, G, "rest", "REST", 14, by + 64, bw, 54); this.btn(c, G, "pace", s.fast ? "PACE: FAST" : "PACE: STEADY", 28 + bw, by + 64, bw, 54);
    } else if (s.mode === "river") {
      G.text(c, `${this.STOPS[s.stop].n}. HOW TO CROSS?`, W / 2, by - 20, Math.min(11, W / 28), ink);
      const w3 = (W - 48) / 3; this.btn(c, G, "ford", "FORD", 12, by, w3, 54); this.btn(c, G, "float", "FLOAT", 24 + w3, by, w3, 54); this.btn(c, G, "ferry", "FERRY 20", 36 + w3 * 2, by, w3, 54, true);
      G.text(c, "FORD = RISKY · FLOAT = SO-SO · FERRY = SAFE", W / 2, by + 74, Math.min(9.5, W / 46), ink);
    } else if (s.mode === "fort") {
      G.text(c, `${this.STOPS[s.stop].n} GENERAL STORE`, W / 2, by - 20, Math.min(11, W / 28), ink);
      this.btn(c, G, "buy", "40LB KIBBLE 10", 14, by, bw, 54); this.btn(c, G, "vet", "VET 15", 28 + bw, by, bw, 54);
      this.btn(c, G, "leave", "HIT THE TRAIL", 14, by + 64, W - 28, 54, true);
    }
    G.hud(c, "DAWG TRAIL", "", s.fast ? "FAST" : "STEADY");
  }
});
