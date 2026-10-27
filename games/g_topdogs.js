// ---------- Top Dogs (The Den, daily logic puzzle) ----------
// Put one dog in every row, every column and every color. No two dogs can touch, not even diagonally.
(function () {
  const PUZ = [{"n":7,"r":"gcccadbgcccddbggccdddgccfdddgeffdddggfffffggfffff"},{"n":8,"r":"aaabbbeeabbbeeeecbbbbeeefbbddeeefffeeeeefffeeeegfffeeeegffeehhhg"},{"n":8,"r":"eeeeaaaaeeeaaaabeeeeccaaeeeddddaeeeeddffeeeeefffgeeeefffghhheeff"},{"n":9,"r":"aabbbddddaabbdddddacdbdddddadddddddgaeedddddgeeddddfggeedddhhgghhhddhhhhhhhhhhhii"},{"n":8,"r":"accdddddcccccbddeecccdddeeeefdddeeeefdddeeeffhddggeefhddgggghhhd"},{"n":7,"r":"caaaabbcccaabbcccddbbcccddbfcceddffcdddddfccggddf"},{"n":8,"r":"ccdaaaabccdaaabbcfdddddbffdddgdbffffegggffffggggffffggggfffffggh"},{"n":7,"r":"dbbccaadbbbccadbbecccdffeecedffeeeeffffeeeffffeeg"},{"n":8,"r":"bbbbbaaabbbbbaaabbbbddcabbdddgggggeeffgggggfffgggggggggghggggggg"},{"n":8,"r":"bbbbacddbbbbacddebbcccddeeecddddeeeeedddefeeedddffeeedgghheegggg"},{"n":9,"r":"aaaaaddddaaaabddddcaaafddddcfffffdddeeffffggdiiifffgggiiifhhgggiiiihhhggiiiiigggg"},{"n":8,"r":"caabbeeeccbbeeeeccbbeeeecgdeeeeegggeeeeeggggggefgggggghhgggggghh"},{"n":7,"r":"ebbbbacebbbbccebbbbcceeffddcgefffffgffffffggggfff"},{"n":8,"r":"acccccbbacccccebccccceeeccddeeeeccfdeeegccfeegggccheegggcchhhhgg"},{"n":7,"r":"ccbbaaccccbccccccccccdddeeeeddeeeeegdffeeegggfffe"},{"n":8,"r":"cccccbbacccccbbbccccebdbffceeeddffeeeeeefffeegggffeegggghfeegggg"},{"n":8,"r":"eeebccaadeebccaadeebcccadeeeeccaddeeeccaffhheccgfhhheccghhheeggg"},{"n":9,"r":"bbbbbbaaadbbbbbbbcdbbbbbbbcdddddbbbbfdfddbebbfffgbbebbhffgbbebbhhhggbggghhigggggg"},{"n":8,"r":"cbbaaabdcbbbbbbdcccbbbbdcccbddddcccddddefgcgdeeefgggddeehhggdddd"},{"n":7,"r":"abbcdddbbbccddeeeccddeeeecddeeeeeffgeeefffggeefff"},{"n":8,"r":"bbbbbaaabbbbbaaedbbbbgcedfggggeedfggggeeffhhggeehhhhgggghhhhgggg"},{"n":7,"r":"aaaaaabaaaaabbdaeccbbdeeeccedeeeeeedefeeeedeeeeeg"},{"n":8,"r":"eeeebaaaeeebbbaaeeedbbaceeedffffeeffffffefffffffhfffggffhhhggggg"},{"n":8,"r":"bcccaaaebcccfffeddccffeeddccffeedfffffeedhfffeeehhhhfegehhhhfeee"},{"n":9,"r":"aaaaaaaaabaaaaaaccaaeeegccceeeeggdcceeeegggggeeefgggggeeeggggghegggggghhggggigggh"},{"n":8,"r":"bbbbbccabbbbccccbbbcccccbbdccccceedcgccfgggggfffggggffffgggggfhh"},{"n":7,"r":"caaaeeeccfbbeeccfbdeeccffdeeffffeeefffffeefffggge"},{"n":8,"r":"bbbbbaaabbbbbbaaddbbbecaddbbeeeaddbbeeeaffbeeeeeffggeeeeggggheee"},{"n":7,"r":"aabbccebbbbccebcccceeddeeccedeeeeeeddefeegdfffeeg"},{"n":8,"r":"dddbbbcafddbbbccfddbbbccfddbbcccfdddbeeefffeeeeeffggeeeehggggeee"},{"n":8,"r":"cccccbaaccccfbbbccccffddccccffddecffffddggfffhddgggffhhhggffhhhh"},{"n":9,"r":"ccccccaccbbbbcccccbbfbcccccbdffccccefffffffeehfffffeeehfffffggehhhffffgeihhfffeee"},{"n":8,"r":"aaaaaabbaaaaacbbaaaaacbbaaadcccbeeeecfffegeecfffggghffffghhhffff"},{"n":7,"r":"bbbaaadbbaaaadbbcdaddeedddddeeeddddeeedffgeeeddgg"},{"n":8,"r":"bbbeeeaabbbeeeaabbbeeecabbdeeecefeeeeeeefeeeegggffeeegggffhhhggg"},{"n":7,"r":"aaaabbbaacabbbaacabbbaeaabdbgefffdbgfffffbggffffb"},{"n":8,"r":"ddddaccbdddddccbddddcccbddddccceddddcceegddffceeggghfceegghhccce"},{"n":8,"r":"bbbaccccbbbfffccbbbfffccdbeeffffeeeefgggfffefgggfffffgggfffffhgg"},{"n":9,"r":"aaaaccccceaaaccccbeeeeecccceedeeeccceeggccccceeggffiiieeggggiiieeggiiihhgggiiiiih"},{"n":8,"r":"eebbbaaaeebbbbaaecdbbbaaeedddggaeddddgggeddfdggghhhfgggghhhggggg"},{"n":7,"r":"aaabbbbaccbbbbcccbbbbdcfffeefffffeefffffeeffffffg"},{"n":8,"r":"aaabbbbbaddbbbbbccdbbbbbcdddebbbddddeeeedddddeffddddgghhdddggghh"},{"n":7,"r":"daaaaabdaaaabbddaecebfddeeeefddeeeefddeeeeffgeeee"},{"n":8,"r":"bbccacccbdcccccfdddccfffddffffffddffggegddffggggdfffggggffffgggh"},{"n":8,"r":"aabdddccbbbddddcdddddeecddddeeeeddddffeeddffffeedgfffffedgfffhhe"},{"n":9,"r":"dddfbbbaadddffbbcaddfffbbcaddffffbeeggffffeeegffffffeegggfiffiihggfiiiiihhiiiiiii"},{"n":8,"r":"faaaaabbfffffddbcefffdddgeffffddgeffffddgggggfffgggggfffggghhhhh"},{"n":7,"r":"fcccbaaffccbaeffccceedfccceedffceeefffffeefffgggg"},{"n":8,"r":"cccccabbccccccbbcccccceeccdcceeefggceeeeffggeeeeffgggeeehffggeee"},{"n":7,"r":"ddddbaaddddbbbcdddbbbddddddddeeddddggggfffgggggff"},{"n":8,"r":"cccccaaaccccbbaacccccbbbeecccbdbeeefffffgggfffffgggfffffhgggggff"},{"n":8,"r":"aabbbbbbaabbbbbbcbbbbbbbcbbbdeeecbbbbeeecbgbfffeggggghhhggggghhh"},{"n":9,"r":"ccddaaaaaccddaaabfcddddffffdddddffffeeeeeffffeeeegffffeeggggfffgggghhfffgggghhiif"},{"n":8,"r":"bbbbaaaabbbbcaaabbbcceeedbfceeeefffffeeefffffeeefffffgggffffgggh"},{"n":7,"r":"aaaebbbcaeebbbcaeebbbcceebbdgggeebdffggeedggggeee"},{"n":8,"r":"bbbbbaacbbbbbaacffbbeaacffbbedddffbeeeedfeeeeeeeffgeehhhfhhhhhhh"},{"n":7,"r":"aaabbbbcaadbbbccddbbbccdddddccdddeefddddeefddddge"},{"n":8,"r":"ffaabbbcffadbbbcffddeeccffdgeeeeffgggeeeffgggggghffggggghggggggg"},{"n":8,"r":"bbaabbbbbbbbbbbbbecbddddeeebddddeeeegdddeegggddfeegggghheegggghh"},{"n":9,"r":"bbbbbaaaabbbbaaaaabbbbbbcaabbbbbedddbbbbeeeddfffbeeeeeffffegeeehfffeeeeehiifeeeee"}];
  const TINT = ["#f7b2b2", "#a8d8f0", "#b8e3a3", "#f9dd8a", "#d4bff2", "#f8c49b", "#9fe3d4", "#f2b6dc", "#d7d7a8"];
  const TINT_DK = ["#7a4b4b", "#3e6378", "#4f6e42", "#7a6a35", "#5d4c7a", "#7a5838", "#35706a", "#7a4a66", "#66663f"];
  const dayN = () => { const [y, m, d] = KEY.split("-").map(Number); return Math.round((Date.UTC(y, m - 1, d) - Date.UTC(2026, 9, 27)) / 864e5); };
  const pz = () => PUZ[((dayN() % PUZ.length) + PUZ.length) % PUZ.length];
  const rk = () => "bdd:den:topdogs:" + KEY + ":" + (me ? me.id : "");
  const rr = (c, x, y, w, h, r) => { c.beginPath(); if (c.roundRect) c.roundRect(x, y, w, h, r); else c.rect(x, y, w, h); };
  const mmss = t => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, "0")}`;
  const scoreOf = el => Math.max(100, 1000 - 3 * Math.floor(el));
  defGame({
    key: "topdogs", name: "Top Dogs", icon: "👑", max: 1000, cat: "den", puzzle: true,
    blurb: "Daily: one dog per row, column and color.",
    how: "Place a 🐶 so every row, every column and every colored area has exactly one dog. Dogs can't touch each other, not even diagonally. Tap a square once to mark it ✕ (no dog here), twice for a dog, three times to clear. A new board every day, one go, and there's only one answer. Score: 1000 minus 3 points per second (min 100).",
    reset(G) {
      const p = pz(), n = p.n, s = G.s = { n, reg: p.r.split("").map(ch => ch.charCodeAt(0) - 97), btns: [], hist: [], msg: "", msgT: 0, postT: 0 };
      const r = store.get(rk());
      Object.assign(s, r && r.g ? { g: r.g.slice(), el: r.el || 0, done: !!r.done, posted: !!r.posted } : { g: new Array(n * n).fill(0), el: 0, done: false, posted: false });
    },
    persist(G) { const s = G.s; store.set(rk(), { g: s.g, el: s.el, done: s.done, posted: s.posted, score: s.done ? scoreOf(s.el) : 0 }); },
    info(G) { const s = G.s, sc = scoreOf(s.el); return { score: sc, title: s.el < 60 ? "Speedy! 🐶" : "Solved!", sub: `Top Dogs in ${mmss(s.el)} · ${sc} pts.`, share: `Top Dogs #${dayN() + 1} · ${mmss(s.el)} 👑` }; },
    bad(s) { // cells whose dog breaks a rule
      const n = s.n, out = new Set(), dogs = []; s.g.forEach((v, i) => { if (v === 2) dogs.push(i); });
      for (let a = 0; a < dogs.length; a++) for (let b = a + 1; b < dogs.length; b++) {
        const i = dogs[a], j = dogs[b], ri = Math.floor(i / n), ci = i % n, rj = Math.floor(j / n), cj = j % n;
        if (ri === rj || ci === cj || s.reg[i] === s.reg[j] || (Math.abs(ri - rj) <= 1 && Math.abs(ci - cj) <= 1)) { out.add(i); out.add(j); }
      }
      return out;
    },
    check(G) {
      const s = G.s, dogs = s.g.filter(v => v === 2).length;
      if (dogs === s.n && !this.bad(s).size) { s.done = true; s.postT = 1.2; G.sfx("win"); s.msg = "Solved!"; s.msgT = 1.5; }
      this.persist(G);
    },
    update(G, dt) {
      const s = G.s; if (s.msgT > 0) s.msgT -= dt;
      if (!s.done) { s.el += dt; s.ck = (s.ck || 0) + dt; if (s.ck > 2) { s.ck = 0; this.persist(G); } }
      if (s.done && !s.posted && s.postT > 0) { s.postT -= dt; if (s.postT <= 0) { s.posted = true; this.persist(G); G.post(scoreOf(s.el), this.info(G)); } }
    },
    draw(G, c) {
      const s = G.s, dk = G.dark(), n = s.n, ink = dk ? "#fff" : "#121213";
      c.fillStyle = dk ? "#121213" : "#fff"; c.fillRect(0, 0, G.W, G.H); s.btns = [];
      c.fillStyle = ink; c.font = `500 15px ${G.UI}`; c.textAlign = "left"; c.textBaseline = "middle";
      c.fillText(s.done ? "Solved! 🐶" : "One 🐶 per row, column & color", 14, 22);
      c.textAlign = "right"; c.font = `700 15px ${G.UI}`; c.fillText(mmss(s.el), G.W - 14, 22);
      const N = Math.min(G.W - 24, G.H - 170), cs = N / n, ox = (G.W - N) / 2, oy = 46, bad = this.bad(s);
      for (let i = 0; i < n * n; i++) {
        const x = ox + (i % n) * cs, y = oy + Math.floor(i / n) * cs;
        c.fillStyle = (dk ? TINT_DK : TINT)[s.reg[i] % 9]; c.fillRect(x, y, cs, cs);
        if (bad.has(i)) { c.fillStyle = "rgba(229,57,53,0.45)"; c.fillRect(x, y, cs, cs); }
        if (s.g[i] === 1) { c.strokeStyle = dk ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.45)"; c.lineWidth = 2; const k = cs * 0.16; c.beginPath(); c.moveTo(x + cs / 2 - k, y + cs / 2 - k); c.lineTo(x + cs / 2 + k, y + cs / 2 + k); c.moveTo(x + cs / 2 + k, y + cs / 2 - k); c.lineTo(x + cs / 2 - k, y + cs / 2 + k); c.stroke(); }
        if (s.g[i] === 2) G.img(c, s.done ? ":dawgW:" : ":dawgpog:", x + cs / 2, y + cs / 2, cs * 0.78);
      }
      // thin grid, thick region borders
      c.strokeStyle = dk ? "rgba(0,0,0,0.35)" : "rgba(0,0,0,0.12)"; c.lineWidth = 1;
      for (let k = 1; k < n; k++) { c.beginPath(); c.moveTo(ox + k * cs, oy); c.lineTo(ox + k * cs, oy + N); c.moveTo(ox, oy + k * cs); c.lineTo(ox + N, oy + k * cs); c.stroke(); }
      c.strokeStyle = ink; c.lineWidth = 2.5; c.beginPath();
      for (let i = 0; i < n * n; i++) { const r = Math.floor(i / n), q = i % n, x = ox + q * cs, y = oy + r * cs;
        if (q < n - 1 && s.reg[i] !== s.reg[i + 1]) { c.moveTo(x + cs, y); c.lineTo(x + cs, y + cs); }
        if (r < n - 1 && s.reg[i] !== s.reg[i + n]) { c.moveTo(x, y + cs); c.lineTo(x + cs, y + cs); } }
      c.stroke(); c.lineWidth = 3; c.strokeRect(ox, oy, N, N);
      s.btns.push({ x: ox, y: oy, w: N, h: N, grid: [ox, oy, cs] });
      const by = oy + N + 16, bw = (G.W - 40) / 2;
      if (!s.done) {
        s.btns.push(Object.assign(G.pill(c, 16, by, bw, 46, "Undo", false, !s.hist.length), { k: "undo" }));
        s.btns.push(Object.assign(G.pill(c, 24 + bw, by, bw, 46, "Clear", false, !s.g.some(v => v)), { k: "clear" }));
        c.fillStyle = dk ? "#aaa" : "#666"; c.font = `400 13px ${G.UI}`; c.textAlign = "center"; c.fillText("Tap once for ✕, twice for a dog", G.W / 2, by + 66);
      } else if (s.posted) { const w = Math.min(260, G.W - 40); s.btns.push(Object.assign(G.pill(c, G.W / 2 - w / 2, by, w, 46, `See results · ${mmss(s.el)}`, true), { k: "res" })); }
      if (s.msgT > 0 && s.msg) { c.save(); c.globalAlpha = Math.min(1, s.msgT * 2); c.font = `600 15px ${G.UI}`; c.textAlign = "center"; const w = c.measureText(s.msg).width + 30; c.fillStyle = dk ? "#fff" : "#121213"; rr(c, G.W / 2 - w / 2, oy + N / 2 - 19, w, 38, 8); c.fill(); c.fillStyle = dk ? "#121213" : "#fff"; c.fillText(s.msg, G.W / 2, oy + N / 2); c.restore(); }
    },
    tap(G, x, y) {
      const s = G.s, b = s.btns.find(b => x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h); if (!b) return;
      if (b.k === "res") return G.results(this.info(G));
      if (s.done) return;
      if (b.grid) { const [ox, oy, cs] = b.grid, i = Math.min(s.n - 1, Math.floor((y - oy) / cs)) * s.n + Math.min(s.n - 1, Math.floor((x - ox) / cs));
        s.hist.push([i, s.g[i]]); s.g[i] = (s.g[i] + 1) % 3; if (s.g[i] === 2) G.sfx("pop"); return this.check(G); }
      if (b.k === "undo") { const h = s.hist.pop(); if (h) s.g[h[0]] = h[1]; return this.persist(G); }
      if (b.k === "clear") { s.hist = []; s.g = s.g.map(() => 0); return this.persist(G); }
    }
  });
})();
