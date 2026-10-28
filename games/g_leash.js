// ---------- Leash (The Den, daily logic puzzle) ----------
// Walk the dog: draw one path from 1 through every number in order that fills every square.
(function () {
  const PUZ = [{"n":6,"nums":{"0":12,"1":11,"2":4,"6":10,"9":3,"10":1,"12":9,"13":8,"20":5,"21":6,"26":7,"35":2}},{"n":7,"nums":{"1":5,"3":6,"6":7,"12":8,"23":9,"28":4,"31":12,"34":10,"35":2,"37":3,"38":15,"39":13,"40":11,"44":1,"45":14}},{"n":6,"nums":{"2":3,"4":4,"5":5,"7":10,"9":11,"13":9,"14":12,"17":1,"21":13,"22":6,"27":8,"28":7,"34":2}},{"n":7,"nums":{"2":1,"4":2,"15":6,"19":5,"20":3,"29":13,"30":12,"31":9,"32":7,"36":14,"42":10,"44":11,"46":8,"48":4}},{"n":7,"nums":{"0":8,"6":4,"7":7,"17":11,"20":3,"24":13,"25":9,"27":2,"30":12,"34":1,"35":6,"39":10,"42":5}},{"n":6,"nums":{"4":3,"13":4,"14":5,"16":7,"21":6,"24":2,"26":1,"27":10,"28":8,"33":9}},{"n":7,"nums":{"2":1,"6":8,"8":2,"11":3,"19":7,"21":4,"37":9,"38":11,"41":13,"42":5,"43":6,"44":10,"46":12,"48":14}},{"n":6,"nums":{"2":3,"8":4,"10":2,"12":5,"16":1,"19":7,"22":11,"27":9,"28":10,"30":6,"32":8,"34":12}},{"n":7,"nums":{"7":3,"8":9,"9":8,"19":7,"21":4,"24":12,"30":13,"32":10,"36":11,"41":2,"43":5,"46":6,"48":1}},{"n":6,"nums":{"6":10,"7":11,"11":9,"13":1,"14":7,"18":2,"21":6,"25":4,"27":5,"28":8,"30":3}},{"n":7,"nums":{"0":4,"1":5,"5":6,"6":1,"11":12,"17":14,"19":7,"22":11,"24":15,"31":13,"34":2,"36":10,"39":9,"40":8,"44":3}},{"n":7,"nums":{"1":5,"8":4,"13":6,"14":3,"18":11,"21":2,"22":1,"25":14,"28":7,"31":12,"32":15,"36":8,"37":9,"40":13,"46":10}},{"n":6,"nums":{"1":1,"3":3,"5":2,"9":8,"14":9,"16":7,"19":4,"21":10,"22":6,"27":5}},{"n":7,"nums":{"7":2,"14":1,"15":9,"16":10,"17":12,"18":13,"20":3,"21":5,"25":11,"33":8,"36":6,"38":7,"46":4}},{"n":6,"nums":{"5":2,"6":4,"8":8,"10":1,"12":5,"13":7,"16":3,"21":13,"22":11,"23":10,"24":6,"28":12,"34":9}},{"n":7,"nums":{"1":5,"3":6,"9":9,"10":8,"13":7,"16":15,"18":13,"20":1,"24":16,"29":10,"32":14,"33":12,"35":4,"40":11,"42":3,"45":2}},{"n":6,"nums":{"0":1,"2":5,"4":6,"6":2,"8":8,"10":7,"16":11,"18":3,"22":13,"28":12,"29":10,"31":4,"35":9}},{"n":7,"nums":{"0":1,"6":2,"14":3,"15":4,"16":5,"20":6,"22":10,"29":13,"30":14,"31":12,"39":11,"45":9,"46":8,"47":7}},{"n":7,"nums":{"4":3,"9":11,"12":13,"13":4,"15":10,"17":14,"18":15,"19":12,"21":2,"28":1,"29":9,"31":8,"33":7,"41":5,"42":6}},{"n":6,"nums":{"3":4,"7":7,"17":3,"23":1,"24":8,"25":10,"26":6,"28":2,"30":9,"32":5}},{"n":7,"nums":{"1":2,"8":5,"11":7,"12":8,"26":1,"37":6,"39":10,"40":11,"42":3,"43":4,"46":9}},{"n":6,"nums":{"3":1,"10":3,"13":4,"19":6,"26":7,"28":5,"29":2}},{"n":7,"nums":{"2":9,"4":10,"6":5,"7":2,"8":1,"10":12,"11":11,"16":8,"18":13,"24":15,"26":6,"30":14,"38":7,"43":3,"47":4}},{"n":6,"nums":{"4":4,"6":2,"12":1,"14":3,"15":5,"16":6,"21":7,"24":8,"26":9,"28":11,"29":12,"32":10,"34":13}},{"n":7,"nums":{"4":1,"8":9,"12":6,"13":5,"18":8,"20":4,"22":11,"28":2,"30":12,"31":10,"40":7,"45":3}},{"n":7,"nums":{"6":1,"7":6,"11":14,"16":11,"18":15,"25":13,"26":12,"28":5,"29":7,"32":10,"33":9,"39":8,"41":2,"44":4,"46":3}},{"n":6,"nums":{"3":2,"4":3,"10":5,"13":1,"14":6,"18":8,"19":9,"26":7,"28":4}},{"n":7,"nums":{"2":6,"3":7,"4":8,"8":2,"9":5,"17":12,"18":14,"19":13,"24":11,"30":4,"32":16,"34":9,"36":3,"39":15,"44":1,"45":10}},{"n":6,"nums":{"3":5,"4":4,"7":9,"14":6,"16":1,"17":2,"19":8,"20":7,"22":3,"26":10,"28":11,"29":13,"34":12}},{"n":7,"nums":{"0":1,"5":2,"12":3,"18":5,"23":10,"26":8,"30":11,"32":9,"35":4,"37":7,"41":6}},{"n":6,"nums":{"0":1,"9":5,"10":4,"12":6,"18":10,"19":9,"20":8,"22":3,"26":7,"29":2,"30":12,"31":11}},{"n":7,"nums":{"0":9,"5":4,"6":3,"11":11,"18":13,"22":10,"25":12,"28":8,"31":7,"32":5,"40":1,"41":2,"43":6}},{"n":7,"nums":{"1":7,"8":16,"9":13,"11":11,"12":10,"14":8,"15":15,"16":14,"17":12,"28":9,"30":4,"33":6,"38":1,"41":5,"43":3,"45":2}},{"n":6,"nums":{"1":5,"2":4,"8":6,"11":3,"13":12,"15":10,"18":11,"23":2,"24":7,"25":8,"26":9,"35":1}},{"n":7,"nums":{"1":3,"6":1,"8":7,"17":8,"18":6,"22":12,"23":11,"24":9,"29":10,"33":4,"35":2,"40":5}},{"n":6,"nums":{"5":2,"6":3,"11":1,"13":9,"15":6,"18":8,"20":7,"24":5,"28":4}},{"n":7,"nums":{"0":1,"5":2,"14":4,"18":5,"21":10,"25":6,"28":9,"29":13,"30":12,"36":14,"37":11,"41":3,"44":8,"46":7}},{"n":6,"nums":{"1":3,"3":4,"8":6,"11":5,"12":2,"13":7,"17":10,"20":9,"21":12,"25":8,"28":13,"30":1,"35":11}},{"n":7,"nums":{"0":1,"4":3,"6":4,"9":5,"17":8,"25":10,"26":9,"31":7,"33":13,"37":6,"40":14,"43":2,"46":11,"48":12}},{"n":7,"nums":{"1":9,"13":5,"14":1,"16":12,"19":6,"22":11,"24":10,"25":8,"26":7,"36":4,"40":3,"46":2}},{"n":6,"nums":{"2":2,"4":3,"6":1,"10":8,"15":11,"18":9,"22":7,"28":6,"31":10,"32":12,"33":13,"34":5,"35":4}},{"n":7,"nums":{"3":4,"9":8,"10":12,"15":7,"16":9,"18":13,"21":5,"25":11,"35":6,"40":1,"41":2,"44":10,"46":3}},{"n":6,"nums":{"1":2,"5":5,"8":1,"9":4,"11":6,"15":3,"16":7,"25":8,"29":11,"30":9,"31":10,"35":12}},{"n":7,"nums":{"7":2,"10":6,"11":7,"14":3,"18":9,"19":8,"20":1,"23":10,"31":14,"33":12,"36":5,"38":15,"39":13,"40":11,"43":4}},{"n":6,"nums":{"0":6,"1":7,"8":12,"10":14,"12":5,"13":11,"16":13,"19":4,"21":10,"24":3,"26":1,"28":9,"32":2,"33":8}},{"n":7,"nums":{"7":2,"10":3,"15":6,"17":5,"19":4,"23":10,"25":8,"30":12,"31":11,"34":1,"37":9,"47":7}},{"n":7,"nums":{"1":2,"9":9,"10":11,"13":10,"14":1,"17":12,"22":3,"31":14,"32":15,"33":13,"36":4,"38":8,"41":7,"43":5,"47":6}},{"n":6,"nums":{"2":4,"4":5,"20":9,"21":10,"23":8,"24":3,"25":6,"28":7,"29":1,"35":2}},{"n":7,"nums":{"2":1,"5":2,"7":7,"8":8,"9":9,"19":10,"24":13,"25":15,"26":14,"30":12,"32":16,"35":6,"37":11,"41":3,"42":5,"43":4}},{"n":6,"nums":{"1":6,"2":11,"3":9,"7":7,"8":10,"15":8,"17":1,"23":2,"25":4,"28":5,"35":3}},{"n":7,"nums":{"0":5,"2":7,"9":6,"10":8,"17":4,"20":9,"22":1,"23":2,"32":3,"33":10,"36":13,"42":14,"44":12,"45":11}},{"n":6,"nums":{"1":6,"3":9,"4":1,"7":7,"14":10,"15":11,"17":2,"20":12,"23":3,"28":8,"32":5,"35":4}},{"n":7,"nums":{"0":6,"4":12,"10":14,"13":10,"16":11,"17":13,"27":9,"29":7,"30":8,"37":5,"39":4,"41":3,"44":1,"46":2}},{"n":7,"nums":{"6":1,"8":2,"14":8,"15":7,"21":9,"23":11,"24":12,"26":6,"30":14,"38":15,"39":13,"41":3,"42":10,"47":5,"48":4}},{"n":6,"nums":{"7":7,"11":4,"12":3,"15":10,"17":5,"20":9,"29":6,"30":2,"31":1,"33":8}},{"n":7,"nums":{"2":11,"8":9,"10":12,"11":10,"13":6,"14":8,"16":13,"19":7,"20":5,"35":3,"37":4,"47":2,"48":1}},{"n":6,"nums":{"0":6,"1":5,"7":13,"10":3,"13":11,"14":12,"16":4,"17":2,"22":1,"26":10,"28":9,"32":7,"33":8}},{"n":7,"nums":{"0":11,"5":12,"6":14,"13":13,"17":7,"20":5,"22":10,"24":6,"29":9,"32":1,"36":8,"38":2,"39":4,"46":3}},{"n":6,"nums":{"1":2,"5":8,"9":10,"10":9,"12":1,"17":11,"21":7,"22":12,"31":3,"32":4,"33":5,"35":6}},{"n":7,"nums":{"3":4,"4":5,"7":3,"12":6,"15":2,"17":9,"22":1,"26":10,"33":13,"34":12,"37":8,"40":14,"43":7,"46":11}}];
  const dayN = () => { const [y, m, d] = KEY.split("-").map(Number); return Math.round((Date.UTC(y, m - 1, d) - Date.UTC(2026, 9, 27)) / 864e5); };
  const pz = () => PUZ[((dayN() % PUZ.length) + PUZ.length) % PUZ.length];
  const rk = () => "bdd:den:leash:" + KEY + ":" + (me ? me.id : "");
  const rr = (c, x, y, w, h, r) => { c.beginPath(); if (c.roundRect) c.roundRect(x, y, w, h, r); else c.rect(x, y, w, h); };
  const mmss = t => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, "0")}`;
  // Chill scoring: solving is most of it; a speed bonus fades over a few minutes and never goes negative.
  const speed = (sec, limit, pts) => Math.round(pts * Math.max(0, 1 - sec / limit));
  const scoreOf = el => 700 + speed(el, 300, 300);
  defGame({
    key: "leash", name: "Leash", icon: "🦮", max: 1000, cat: "den", puzzle: true,
    blurb: "Daily: one path through every square.",
    how: "Walk the dog! Drag from 1 and draw a single path that hits the numbers in order (1, 2, 3…) and fills every square on the board. Move up, down, left or right, never diagonally. Drag back over your path to undo, or tap any square on it to cut the path there. A new board every day, one go, and there's only one answer. Score: 700 for solving, plus a bonus of up to 300 for going quick. No clock on screen, so take your time.",
    reset(G) {
      const p = pz(), n = p.n, nums = {}; Object.keys(p.nums).forEach(k => nums[+k] = p.nums[k]);
      const s = G.s = { n, nums, last: Math.max(...Object.values(nums)), start: +Object.keys(nums).find(k => nums[k] === 1), btns: [], msg: "", msgT: 0, postT: 0, drag: false };
      const r = store.get(rk());
      Object.assign(s, r && r.path ? { path: r.path.slice(), el: r.el || 0, done: !!r.done, posted: !!r.posted } : { path: [], el: 0, done: false, posted: false });
    },
    persist(G) { const s = G.s; store.set(rk(), { path: s.path, el: s.el, done: s.done, posted: s.posted, score: s.done ? scoreOf(s.el) : 0 }); },
    info(G) { const s = G.s, sc = scoreOf(s.el); return { score: sc, title: s.el < 45 ? "Speedy! 🦮" : "Walked!", sub: `Leash in ${mmss(s.el)} · ${sc} pts.`, share: `Leash #${dayN() + 1} · ${mmss(s.el)} 🦮` }; },
    nextNum(s) { let k = 1; s.path.forEach(i => { if (s.nums[i] === k) k++; }); return k; },
    adj(s, a, b) { const n = s.n; return (Math.abs(a - b) === 1 && Math.floor(a / n) === Math.floor(b / n)) || Math.abs(a - b) === n; },
    cellAt(G, x, y) { const L = G.s.L; if (!L) return -1; const [ox, oy, cs] = L, col = Math.floor((x - ox) / cs), row = Math.floor((y - oy) / cs); return col < 0 || row < 0 || col >= G.s.n || row >= G.s.n ? -1 : row * G.s.n + col; },
    step(G, i) {
      const s = G.s, p = s.path; if (i < 0) return;
      if (!p.length) { if (i === s.start) { p.push(i); G.sfx("pop"); } else { s.msg = "Start at 1"; s.msgT = 1; } return; }
      const last = p[p.length - 1]; if (i === last) return;
      if (p.length > 1 && i === p[p.length - 2]) { p.pop(); return; }           // drag back = undo
      const at = p.indexOf(i); if (at >= 0) { p.length = at + 1; return; }       // jump back onto the path = cut it there
      if (!this.adj(s, last, i)) return;
      const nv = s.nums[i]; if (nv && nv !== this.nextNum(s)) { s.msg = `Get to ${this.nextNum(s)} first`; s.msgT = 1; G.buzz(); return; }
      p.push(i);
      if (p.length === s.n * s.n && s.nums[i] === s.last && this.nextNum(s) > s.last) { s.done = true; s.drag = false; s.postT = 1.2; G.sfx("win"); s.msg = "Walked! 🦮"; s.msgT = 1.5; this.persist(G); }
    },
    down(G, x, y) {
      const s = G.s, b = s.btns.find(b => b.k && x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h);
      if (b) { if (b.k === "res") return G.results(this.info(G)); if (s.done) return; if (b.k === "undo") { s.path.pop(); this.persist(G); } if (b.k === "clear") { s.path = []; this.persist(G); } return; }
      if (s.done) return; const i = this.cellAt(G, x, y); if (i < 0) return;
      s.drag = true; const at = s.path.indexOf(i); if (at >= 0) s.path.length = at + 1; else this.step(G, i);
    },
    move(G, x, y) { const s = G.s; if (!s.drag || s.done) return; this.step(G, this.cellAt(G, x, y)); },
    up(G) { const s = G.s; if (s.drag) { s.drag = false; this.persist(G); } },
    update(G, dt) {
      const s = G.s; if (s.msgT > 0) s.msgT -= dt;
      if (!s.done) { s.el += dt; s.ck = (s.ck || 0) + dt; if (s.ck > 2) { s.ck = 0; this.persist(G); } }
      if (s.done && !s.posted && s.postT > 0) { s.postT -= dt; if (s.postT <= 0) { s.posted = true; this.persist(G); G.post(scoreOf(s.el), this.info(G)); } }
    },
    draw(G, c) {
      const s = G.s, dk = G.dark(), n = s.n, ink = dk ? "#fff" : "#121213";
      c.fillStyle = dk ? "#121213" : "#fff"; c.fillRect(0, 0, G.W, G.H); s.btns = [];
      c.fillStyle = ink; c.font = `500 15px ${G.UI}`; c.textAlign = "left"; c.textBaseline = "middle";
      c.fillText(s.done ? "Walked! 🦮" : `Fill every square · next: ${Math.min(this.nextNum(s), s.last)}`, 14, 22);
      const N = Math.min(G.W - 24, G.H - 170), cs = N / n, ox = (G.W - N) / 2, oy = 46; s.L = [ox, oy, cs];
      const inPath = new Set(s.path), col = s.done ? "#2e9e4f" : "#ff7a1a";
      c.fillStyle = dk ? "#1e1e22" : "#f4f2ee"; rr(c, ox, oy, N, N, 10); c.fill();
      for (let i = 0; i < n * n; i++) { const x = ox + (i % n) * cs, y = oy + Math.floor(i / n) * cs;
        if (inPath.has(i)) { c.fillStyle = s.done ? "rgba(46,158,79,0.18)" : "rgba(255,122,26,0.16)"; c.fillRect(x, y, cs, cs); }
        c.strokeStyle = dk ? "#333" : "#dedad2"; c.lineWidth = 1; c.strokeRect(x, y, cs, cs); }
      const ctr = i => [ox + (i % n + 0.5) * cs, oy + (Math.floor(i / n) + 0.5) * cs];
      if (s.path.length) { c.strokeStyle = col; c.lineWidth = cs * 0.42; c.lineCap = "round"; c.lineJoin = "round"; c.beginPath(); s.path.forEach((i, k) => { const [x, y] = ctr(i); k ? c.lineTo(x, y) : c.moveTo(x, y); }); if (s.path.length === 1) { const [x, y] = ctr(s.path[0]); c.lineTo(x + 0.1, y); } c.stroke(); }
      Object.keys(s.nums).forEach(k => { const i = +k, [x, y] = ctr(i), v = s.nums[i];
        c.fillStyle = "#121213"; c.beginPath(); c.arc(x, y, cs * 0.3, 0, 7); c.fill(); if (dk) { c.strokeStyle = "#fff"; c.lineWidth = 1.5; c.stroke(); }
        c.fillStyle = "#fff"; c.font = `800 ${Math.round(cs * 0.3)}px ${G.UI}`; c.textAlign = "center"; c.fillText(String(v), x, y + 1); });
      if (s.path.length && !s.done) { const [x, y] = ctr(s.path[s.path.length - 1]); G.img(c, ":dawgpog:", x, y - cs * 0.02, cs * 0.55); }
      if (s.done) { const [x, y] = ctr(s.path[s.path.length - 1]); G.img(c, ":dawgW:", x, y, cs * 0.6); }
      const by = oy + N + 16, bw = (G.W - 40) / 2;
      if (!s.done) {
        s.btns.push(Object.assign(G.pill(c, 16, by, bw, 46, "Undo", false, !s.path.length), { k: "undo" }));
        s.btns.push(Object.assign(G.pill(c, 24 + bw, by, bw, 46, "Clear", false, !s.path.length), { k: "clear" }));
        c.fillStyle = dk ? "#aaa" : "#666"; c.font = `400 13px ${G.UI}`; c.textAlign = "center"; c.fillText(s.path.length ? `${s.path.length} of ${n * n} squares` : "Drag from 1", G.W / 2, by + 66);
      } else if (s.posted) { const w = Math.min(260, G.W - 40); s.btns.push(Object.assign(G.pill(c, G.W / 2 - w / 2, by, w, 46, `See results · ${mmss(s.el)}`, true), { k: "res" })); }
      if (s.msgT > 0 && s.msg) { c.save(); c.globalAlpha = Math.min(1, s.msgT * 2); c.font = `600 15px ${G.UI}`; c.textAlign = "center"; const w = c.measureText(s.msg).width + 30; c.fillStyle = dk ? "#fff" : "#121213"; rr(c, G.W / 2 - w / 2, 34, w, 34, 8); c.fill(); c.fillStyle = dk ? "#121213" : "#fff"; c.fillText(s.msg, G.W / 2, 51); c.restore(); }
    }
  });
})();
