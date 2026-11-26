// ---------- Feud (The Den, Thanksgiving weekend 2026 only: Nov 26-29) ----------
// Family Feud-style: 5 survey questions a day, type what the survey said, 3 strikes per question.
// Thu-Sat boards are real published polls (source shown under each question; points = the poll's percent).
// Sunday is the Crew Edition: the board is built from the crew's own answers to the 5-question survey
// (FEUD_QS in js/arcade.js, stored by sendFeudSurvey in Code.gs). Fewer than 3 crew answers = the SPARE poll board.
(function () {
  const STOP = /^(the|a|an|my|some|your|our|their|his|her|and|n|or|of|to|with|in|on|at)$/;
  const stem = w => w.length < 4 ? w : w.length > 5 && /ing$/.test(w) ? w.slice(0, -3) : /ies$/.test(w) ? w.slice(0, -3) + "y" : /(oes|ches|shes|sses|xes)$/.test(w) ? w.slice(0, -2) : /[^su]s$/.test(w) ? w.slice(0, -1) : w;
  const norm = t => String(t).toLowerCase().replace(/['’]/g, "").replace(/[^a-z0-9]+/g, " ").split(" ").filter(w => w && !STOP.test(w)).map(stem).join(" ");
  function lev(a, b) {
    let prev = []; for (let j = 0; j <= b.length; j++) prev[j] = j;
    for (let i = 1; i <= a.length; i++) { const cur = [i]; for (let j = 1; j <= b.length; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)); prev = cur; }
    return prev[b.length];
  }
  // Loose match: a typo or two, or one is a whole-word piece of the other ("cranberry" ~ "cranberry sauce").
  const alike = (a, b) => { const L = Math.max(a.length, b.length); return a === b || (L >= 5 && lev(a, b) <= (L >= 9 ? 2 : 1)) || (Math.min(a.length, b.length) >= 3 && ((" " + a + " ").includes(" " + b + " ") || (" " + b + " ").includes(" " + a + " "))); };
  // Answers a guess could mean: exact alias hits win; otherwise every loose hit (2+ = "be more specific").
  function match(q, n) {
    const ex = q.a.map((a, j) => a.k.includes(n) ? j : -1).filter(j => j >= 0); if (ex.length) return ex;
    return q.a.map((a, j) => a.k.some(k => alike(k, n)) ? j : -1).filter(j => j >= 0);
  }
  const P = (q, src, a) => ({ q, src, a: a.map(([label, pts, al]) => ({ label, pts, k: [label].concat(al ? al.split("|") : []).map(norm) })) });
  const DAYS = {
    "2026-11-26": [
      P("Name a Thanksgiving food people admit they don't actually like.", "Poll: The Vacationer, 2023", [["Cranberry sauce", 31, "cranberry|canned cranberry"], ["Sweet potatoes", 29, "yam|sweet potato casserole|candied yam"], ["Green bean casserole", 28, "green bean"], ["Turkey", 28], ["Stuffing", 27, "dressing"], ["Ham", 26], ["Coleslaw", 26, "cole slaw|slaw"], ["Pumpkin pie", 24]]),
      P("Name America's favorite Thanksgiving pie.", "Poll: Kelton Global", [["Pumpkin", 37], ["Apple", 16], ["Pecan", 14], ["Sweet potato", 10], ["Chocolate", 6], ["Cherry", 5], ["Lemon meringue", 4, "lemon"], ["Blueberry", 4]]),
      P("Name something people say they'll do on Thanksgiving.", "Poll: RMG Research, Nov 2025", [["Eat turkey", 74, "turkey"], ["Eat too much", 55, "eat|overeat|eat lot|stuff face|stuff myself|pig out|eat too much food"], ["Watch the parade", 49, "parade|macys parade"], ["Watch football", 35, "football|nfl|watch nfl|watch game|watch lions"], ["Play football", 19, "turkey bowl|backyard football|throw football"], ["Christmas shopping", 8, "shop|shopping|black friday shopping"]]),
      P("Name something that goes on a Thanksgiving leftover sandwich.", "Harris Poll for Alpha Baking, 2023", [["Turkey", 81], ["Gravy", 42], ["Ham", 41], ["Stuffing", 39, "dressing"], ["Mac and cheese", 21, "macaroni|mac"], ["Green bean casserole", 14, "green bean"], ["Pumpkin pie", 11, "pie"]]),
      P("Name a topic people want to avoid at Thanksgiving dinner.", "Talker Research, 2025 · ranked list, points by rank", [["Politics", 28, "election|trump|president|government|political"], ["Money", 20, "income|salary|finances|debt|how much i make"], ["Weight or looks", 15, "weight|appearance|diet|body|looks"], ["Religion", 11, "church|god|faith"], ["An ex", 9, "ex|ex wife|ex husband|ex girlfriend|ex boyfriend"], ["Mental health", 7, "therapy|depression|anxiety"], ["Work problems", 6, "work|job|career"], ["Relationship status", 4, "relationship|marriage|dating|love life|single|getting married|when getting married"]])
    ],
    "2026-11-27": [
      P("Name America's favorite food at Thanksgiving dinner.", "Gallup poll, open-ended", [["Turkey", 49], ["Stuffing", 14, "dressing"], ["Ham", 5], ["Mashed potatoes", 5, "potato"], ["Pumpkin pie", 5, "pie"]]),
      P("Name a top-rated Thanksgiving side dish.", "YouGov, 2020 · % of head-to-head matchups won", [["Mashed potatoes", 78], ["Stuffing", 77, "dressing"], ["Bread or rolls", 74, "roll|bread|dinner roll|biscuit|crescent roll"], ["Scalloped potatoes", 66, "au gratin potato|cheesy potato"], ["Sweet potatoes", 65, "yam"], ["Green beans", 64, "green bean casserole"], ["Mac and cheese", 62, "macaroni|mac"]]),
      P("Name a food that makes the best Thanksgiving leftovers.", "OnePoll for Stasher · 2,000 people", [["Turkey", 62], ["Mashed potatoes", 46, "potato"], ["Stuffing", 46, "dressing"], ["Pumpkin pie", 45, "pie"]]),
      P("Name a gift people want to get this holiday season.", "NRF holiday survey, 2025", [["Gift cards", 50, "giftcard|gift certificate"], ["Clothing", 46, "clothes|accessories|shoes|apparel"], ["Books and media", 27, "book|movie|music|video game|game"], ["Beauty or personal care", 23, "beauty|makeup|perfume|cologne|skincare|personal care"], ["Electronics", 22, "phone|tv|laptop|tablet|headphone|computer|tech|gadget|iphone|ipad"]]),
      P("Name something Americans say they're thankful for.", "Lifeway Research, 2020", [["Family", 84], ["Health", 69], ["Friends", 63], ["Memories", 63], ["Personal freedom", 53, "freedom|liberty"], ["Achievements", 33, "accomplishment|success"], ["Wealth", 21, "money|finances"]])
    ],
    "2026-11-28": [
      P("Name America's favorite Christmas movie.", "Axios / SurveyMonkey, 2018", [["It's a Wonderful Life", 14, "wonderful life"], ["A Christmas Story", 12, "ralphie"], ["Home Alone", 11], ["Christmas Vacation", 11, "national lampoon|national lampoons christmas vacation|griswold"], ["The Grinch", 10, "how grinch stole christmas"], ["Elf", 9], ["Miracle on 34th Street", 7, "miracle"]]),
      P("Name America's favorite Christmas song.", "AP-NORC poll, 2018, open-ended", [["Silent Night", 12], ["Jingle Bells", 8], ["White Christmas", 5], ["Baby, It's Cold Outside", 5, "cold outside"], ["O Holy Night", 4, "oh holy night|holy night"], ["The Christmas Song", 2, "chestnuts roasting on an open fire|chestnut"], ["Let It Snow", 2], ["Joy to the World", 2]]),
      P("Name America's favorite sport to watch.", "Gallup, Dec 2023", [["Football", 41, "nfl|college football"], ["Baseball", 10, "mlb"], ["Basketball", 9, "nba|hoop"], ["Soccer", 5], ["Hockey", 4, "ice hockey|nhl"], ["Auto racing", 3, "nascar|racing|f1|formula 1|indycar|car racing"], ["Figure skating", 2, "ice skating|skating"], ["Tennis", 2]]),
      P("Name America's favorite pizza topping.", "YouGov, 2023", [["Pepperoni", 24], ["Sausage", 13], ["Extra cheese", 11, "cheese|plain"], ["Mushrooms", 9], ["Chicken", 6]]),
      P("Name a pizza topping people can't stand.", "YouGov, 2019 · in their bottom three", [["Anchovies", 49], ["Eggplant", 30], ["Pineapple", 24], ["Artichokes", 24]])
    ],
    "2026-11-29": "crew"
  };
  const SPARE = [
    P("Besides turkey, name a Thanksgiving main dish.", "YouGov, 2020 · % of head-to-head matchups won", [["Ham", 67], ["Beef", 54, "roast beef|prime rib|steak|brisket|roast"], ["Chicken", 53]]),
    P("Name something people expect to talk about at Thanksgiving dinner.", "Pew Research Center, 2024", [["Work or school", 35, "work|school|job|class"], ["The election", 26, "politics|election|trump|president"], ["Pop culture", 24, "movie|tv|show|music|celebrity|sport"]]),
    P("Name a kind of gift card people give.", "NRF holiday survey", [["Restaurant", 30, "food|dinner"], ["Visa or bank card", 26, "visa|bank|mastercard|amex|prepaid"], ["Department store", 26, "store|macys|kohls|target|walmart"], ["Coffee shop", 21, "coffee|starbucks|dunkin"]]),
    P("Name where people do their holiday shopping.", "NRF holiday survey, 2026", [["Online", 53, "amazon|internet|web"], ["Grocery stores", 43, "grocery|supermarket|kroger|meijer"], ["Discount stores", 43, "discount|walmart|target|dollar store"], ["Department stores", 42, "department|macys|kohls|mall"]]),
    P("Name a common Thanksgiving hosting fail.", "OnePoll for Omaha Steaks, 2019", [["Food isn't done on time", 31, "late|food late|not ready|running late|dinner late|behind"], ["Dishes done at different times", 29, "timing|cold food|food cold|cold"], ["Ran out of wine", 28, "wine|out of wine|alcohol|booze|beer|drink"], ["Spilled a dish", 28, "spill|spilled|drop|dropped|dropped food|dropped turkey"], ["Forgot an ingredient", 28, "forgot|forgot something|missing ingredient|forgot ingredient"]])
  ];
  const CK = "bdd:feud:crew"; // Sunday's crew answers, cached once the survey has closed
  const tidy = t => { t = String(t).trim().slice(0, 24); return t.charAt(0).toUpperCase() + t.slice(1); };
  const crewBoard = lists => FEUD_QS.map((q, i) => {
    const gs = [];
    (lists[i] || []).forEach(raw => { const n = norm(raw); if (!n) return; const g = gs.find(g => g.k.some(k => alike(k, n))); if (g) { g.c++; if (!g.k.includes(n)) g.k.push(n); } else gs.push({ label: tidy(raw), k: [n], c: 1 }); });
    const tot = gs.reduce((a, g) => a + g.c, 0) || 1;
    return { q, src: `The crew's own answers · ${tot} in`, a: gs.sort((a, b) => b.c - a.c).slice(0, 8).map(g => ({ label: g.label, pts: Math.round(100 * g.c / tot), k: g.k })) };
  });
  const rk = () => "bdd:den:feud:" + KEY + ":" + (me ? me.id : "");
  const rr = (c, x, y, w, h, r) => { c.beginPath(); if (c.roundRect) c.roundRect(x, y, w, h, r); else c.rect(x, y, w, h); };
  const wrap = (c, text, maxW) => { const out = []; let line = ""; text.split(" ").forEach(w => { const t = line ? line + " " + w : w; if (line && c.measureText(t).width > maxW) { out.push(line); line = w; } else line = t; }); if (line) out.push(line); return out; };
  const fit = (c, text, maxW, size, wt, fam) => { let f = size; do { c.font = `${wt} ${f}px ${fam}`; } while (c.measureText(text).width > maxW && --f > 9); };
  const KB = ["QWERTYUIOP", "ASDFGHJKL", ">ZXCVBNM<", " "];
  // Each question is worth 200: your share of the points on its board. Max 1000.
  const tot = q => q.a.reduce((a, x) => a + x.pts, 0);
  const got = (s, i) => s.found[i].reduce((a, j) => a + s.qs[i].a[j].pts, 0);
  const qScore = (s, i) => tot(s.qs[i]) ? Math.round(200 * got(s, i) / tot(s.qs[i])) : 0;
  const scoreOf = s => s.qs.reduce((a, q, i) => a + qScore(s, i), 0);
  // ---- shared drawing and typing bits (solo and host) ----
  const TOP = 34; // room for the Solo | Host switch
  const pal = G => { const dk = G.dark(); return { dk, ink: dk ? "#fff" : "#121213", bg: dk ? "#121213" : "#fff", mute: dk ? "#a3a3a8" : "#66666b", line: dk ? "#3a3a3c" : "#d3d6da" }; };
  const typeKey = (s, k) => { if (k === "<") s.typed = s.typed.slice(0, -1); else if (k === " ") { if (s.typed && !/ $/.test(s.typed) && s.typed.length < 26) s.typed += " "; } else if (s.typed.length < 26) s.typed += k; };
  // Question and its source line; returns the y where the board starts.
  function question(G, c, P, q, y) {
    const qf = G.H < 560 ? 17 : 19; c.font = `700 ${qf}px ${G.TITLE}`; c.fillStyle = P.ink; c.textAlign = "center";
    wrap(c, q.q, G.W - 32).slice(0, 3).forEach(l => { c.fillText(l, G.W / 2, y); y += qf + 4; });
    fit(c, q.src, G.W - 28, 11.5, 500, G.UI); c.fillStyle = P.mute; c.fillText(q.src, G.W / 2, y); return y + 16;
  }
  // The answer board: two columns, numbered down the left column first.
  // st(j): 0 hidden, 1 found, 2 shown but missed, 3 hidden with the host's peek. Returns the slot rectangles.
  function board(G, c, P, q, y, sh, st) {
    const s = G.s, rows = Math.ceil(q.a.length / 2), gap = 6, cw = (G.W - 24 - gap) / 2;
    return q.a.map((a, j) => {
      const col = j < rows ? 0 : 1, x = 12 + col * (cw + gap), yy = y + (j - col * rows) * (sh + gap), v = st(j), mid = yy + sh / 2 + 1;
      rr(c, x, yy, cw, sh, 8); c.fillStyle = v === 1 ? (s.flash === j && s.flashT > 0 ? "#f8e3a1" : "#e9b949") : v === 2 ? (P.dk ? "#2c2c2e" : "#ecece6") : (P.dk ? "#27386b" : "#1f3a8a"); c.fill();
      if (v) {
        c.fillStyle = v === 1 ? "#2b1a10" : v === 2 ? P.mute : "rgba(255,255,255,.72)"; c.textAlign = "left"; fit(c, a.label, cw - 46, 14, 700, G.UI); c.fillText(a.label, x + 9, mid);
        c.textAlign = "right"; c.font = `700 14px ${G.UI}`; c.fillText(a.pts, x + cw - 9, mid);
      } else { c.fillStyle = "#fff"; c.textAlign = "center"; c.font = `700 ${Math.min(16, sh * 0.5)}px ${G.UI}`; c.fillText(j + 1, x + cw / 2, mid); }
      return { x, y: yy, w: cw, h: sh, slot: j };
    });
  }
  function strikes(c, P, n, x, y) {
    for (let k = 0; k < 3; k++) {
      const xx = x + k * 32, used = k < n;
      rr(c, xx, y, 26, 26, 6); if (used) { c.fillStyle = "#d64545"; c.fill(); } else { c.lineWidth = 1.5; c.strokeStyle = P.line; c.stroke(); }
      c.fillStyle = used ? "#fff" : P.line; c.textAlign = "center"; c.font = "700 15px sans-serif"; c.fillText("✕", xx + 13, y + 14);
    }
  }
  // The answer box. Feedback on the last guess shows in the box itself until the next letter.
  function inputBox(G, c, P, y, hint) {
    const s = G.s, bx = 14 + (s.shake > 0 ? Math.sin(s.shake * 60) * 5 : 0), bw = G.W - 28, bh = 42;
    rr(c, bx, y, bw, bh, 8); c.lineWidth = 2; c.strokeStyle = s.typed ? P.ink : P.line; c.stroke();
    c.textAlign = "left"; c.font = `700 17px ${G.UI}`;
    if (s.typed) { c.fillStyle = P.ink; c.fillText(s.typed, bx + 12, y + bh / 2 + 1); } else { const m = s.msgT > 0 && s.msg; c.fillStyle = m ? P.ink : P.mute; c.font = `${m ? 600 : 500} 15px ${G.UI}`; c.fillText(m || hint, bx + 12, y + bh / 2 + 1); }
    if (s.t % 1 < 0.55 && (s.typed || !(s.msgT > 0))) { const tw = s.typed ? (c.font = `700 17px ${G.UI}`, c.measureText(s.typed).width) : 0; c.fillStyle = P.ink; c.fillRect(bx + 13 + tw, y + 10, 2, bh - 20); }
  }
  function keys(G, c, P, kbH) {
    const W = G.W, ky = G.H - kbH, kh = (kbH - 12) / 4 - 6, kw = (W - 12) / 10 - 5;
    KB.forEach((row, r) => {
      const ks = row.split(""), wide = k => k === " " ? kw * 5 + 20 : (k === "<" || k === ">") ? kw * 1.5 + 2.5 : kw;
      let x = (W - ks.reduce((a, k) => a + wide(k) + 5, -5)) / 2;
      ks.forEach(k => {
        const w = wide(k), yy = ky + 6 + r * (kh + 6);
        rr(c, x, yy, w, kh, 5); c.fillStyle = P.dk ? "#818384" : "#d3d6da"; c.fill();
        c.fillStyle = P.ink; c.font = `700 ${k === "<" || k === ">" || k === " " ? 13 : 16}px ${G.UI}`; c.textAlign = "center";
        c.fillText(k === "<" ? "⌫" : k === ">" ? "ENTER" : k === " " ? "space" : k, x + w / 2, yy + kh / 2 + 1);
        G.s.btns.push({ x, y: yy, w, h: kh, key: k }); x += w + 5;
      });
    });
  }
  // ---- host mode state: one game at a time, kept on this device so a reload picks it back up ----
  const HK = "bdd:feud:host", TEAMS = ["Team Turkey", "Team Gravy"];
  let MODE = "solo", HS = null, HD = null;
  // Crew deck = the crew's survey answers so far. Polls deck = every daily board up to the day
  // the game started plus the spare board, so hosting never spoils a solo board that hasn't come out yet.
  const deckOf = h => h.name === "crew" ? crewBoard(h.raw) : [].concat(...Object.keys(DAYS).filter(d => d <= h.day && Array.isArray(DAYS[d])).map(d => DAYS[d]), SPARE);
  const hLoad = () => { HS = store.get(HK); HD = HS ? deckOf(HS) : null; };
  const hSave = () => store.set(HK, HS);
  const mult = i => i === HD.length - 1 ? 3 : i === HD.length - 2 ? 2 : 1;
  let ac;
  function tone(type, f, dur, vol) {
    if (typeof fxOn === "function" && !fxOn()) return;
    try {
      ac = ac || new (window.AudioContext || window.webkitAudioContext)();
      const o = ac.createOscillator(), g = ac.createGain(), t = ac.currentTime; o.type = type; o.frequency.value = f;
      g.gain.setValueAtTime(vol, t); g.gain.setValueAtTime(vol, t + dur * 0.6); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g); g.connect(ac.destination); o.start(t); o.stop(t + dur);
    } catch (e) {}
  }
  const ding = () => { tone("sine", 1568, 0.9, 0.18); tone("sine", 2093, 0.6, 0.09); };
  const buzzer = () => { tone("sawtooth", 130, 0.8, 0.2); tone("square", 137, 0.8, 0.1); };
  defGame({
    key: "feud", name: "Feud", icon: "🦃", max: 1000, cat: "den", puzzle: true,
    blurb: "Survey says! Through Sunday.",
    how: "Five survey questions a day. Type an answer you think is on the board and hit Enter. Get it right and it flips over with its points. Miss and it's a strike, and three strikes ends the question (or tap Pass to move on). Thursday to Saturday use real polls, so you're guessing what America said, and the source is under each question. Sunday is the Crew Edition, built from the crew's own survey answers. Each question is worth up to 200: your share of the points on its board. Got a room full of people? Flip the switch at the top to Host: two teams on one screen, you flip the answers, hit Strike, and hand the pot to the team that wins the round. Here through Sunday only.",
    reset(G) {
      const s = G.s = { typed: "", msg: "", msgT: 0, btns: [], postT: 0, flash: -1, flashT: 0, shake: 0, t: 0 };
      let qs = DAYS[KEY] || DAYS["2026-11-26"];
      if (qs === "crew") {
        const c = store.get(CK);
        if (!c) { s.loading = true; return this.fetchCrew(G); }
        s.crew = c !== "none"; qs = s.crew ? crewBoard(c) : SPARE;
      }
      s.qs = qs;
      const r = store.get(rk());
      if (r && r.found) Object.assign(s, { qi: r.qi, found: r.found, strikes: r.strikes, over: r.over, el: r.el || 0, done: r.done, posted: r.posted });
      else Object.assign(s, { qi: 0, found: qs.map(() => []), strikes: qs.map(() => 0), over: qs.map(q => !q.a.length), el: 0, done: false });
    },
    fetchCrew(G) {
      const s = G.s;
      API("getFeudSurvey", me ? me.id : "").then(r => {
        if (!r || r.open) throw new Error("early");
        store.set(CK, r.n >= 3 ? r.answers : "none"); if (G.s === s) this.reset(G);
      }).catch(() => { if (G.s === s) { s.loading = false; s.err = true; } });
    },
    persist(G) { const s = G.s; store.set(rk(), { qi: s.qi, found: s.found, strikes: s.strikes, over: s.over, el: s.el, done: s.done, posted: s.posted, score: s.done ? scoreOf(s) : 0 }); },
    info(G) {
      const s = G.s, sc = scoreOf(s), top = s.qs.filter((q, i) => s.found[i].includes(0)).length;
      const grid = s.qs.map((q, i) => { const f = s.found[i].length, n = q.a.length; return f === n ? "🟩" : f * 2 >= n ? "🟨" : f ? "🟧" : "⬛"; }).join("");
      const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][new Date(KEY + "T12:00:00").getDay()];
      return { score: sc, grid,
        title: sc >= 800 ? "Survey says: Big Dawg! 🦃" : sc >= 500 ? "Good answer! Good answer!" : "Survey says…",
        sub: `${top} of ${s.qs.length} number-one answers. ${sc} pts.`,
        share: `Feud 🦃 ${s.crew ? "Crew Edition" : day} · ${sc} pts\n${grid}` };
    },
    say(G, m, t) { G.s.msg = m; G.s.msgT = t || 1.8; },
    endQ(G, i) {
      const s = G.s; s.over[i] = true; s.typed = "";
      if (s.over.every(Boolean)) { s.done = true; s.postT = 1.2; G.sfx("win"); }
      this.persist(G);
    },
    enter(G) {
      const s = G.s, i = s.qi, q = s.qs[i]; if (s.done || s.over[i]) return;
      const n = norm(s.typed); if (n.length < 2) return this.say(G, "Type an answer first");
      const hits = match(q, n), open = hits.filter(j => !s.found[i].includes(j)); s.typed = "";
      if (open.length > 1) return this.say(G, "Could be a couple. Be more specific.", 1.8);
      if (!open.length && hits.length) return this.say(G, "Already on the board");
      if (open.length) {
        s.found[i].push(open[0]); s.flash = open[0]; s.flashT = 0.7; G.sfx("pop"); this.say(G, open[0] === 0 ? "Number one answer!" : "Good answer!");
        if (s.found[i].length === q.a.length) return this.endQ(G, i);
      } else {
        s.strikes[i]++; s.shake = 0.4; G.buzz(); this.say(G, "Not on the board");
        if (s.strikes[i] >= 3) return this.endQ(G, i);
      }
      this.persist(G);
    },
    press(G, k) {
      const s = G.s; if (s.done || s.over[s.qi]) return;
      if (k === ">") return this.enter(G);
      typeKey(s, k);
    },
    update(G, dt) {
      const s = G.s; s.t += dt;
      if (s.msgT > 0) s.msgT -= dt; if (s.shake > 0) s.shake -= dt; if (s.flashT > 0) s.flashT -= dt; if (s.bigX > 0) s.bigX -= dt; if (s.quitT > 0) s.quitT -= dt;
      if (MODE === "host" || !s.qs) return;
      if (!s.done) { s.el += dt; s.ck = (s.ck || 0) + dt; if (s.ck > 2) { s.ck = 0; this.persist(G); } }
      if (s.done && !s.posted && s.postT > 0) { s.postT -= dt; if (s.postT <= 0) { s.posted = true; this.persist(G); G.post(scoreOf(s), this.info(G)); } }
    },
    draw(G, c) {
      const s = G.s, P = pal(G), { ink, mute } = P, W = G.W, H = G.H; s.btns = [];
      c.fillStyle = P.bg; c.fillRect(0, 0, W, H); c.textBaseline = "middle";
      // Solo | Host switch
      const gw = 168, gx = W / 2 - gw / 2;
      rr(c, gx, 4, gw, 28, 14); c.fillStyle = P.dk ? "#2c2c2e" : "#ecece6"; c.fill();
      ["solo", "host"].forEach((m, k) => {
        const on = MODE === m, x = gx + k * gw / 2;
        if (on) { rr(c, x + 2, 6, gw / 2 - 4, 24, 12); c.fillStyle = ink; c.fill(); }
        c.fillStyle = on ? P.bg : mute; c.textAlign = "center"; c.font = `700 13px ${G.UI}`; c.fillText(k ? "Host" : "Solo", x + gw / 4, 19);
        s.btns.push({ x, y: 0, w: gw / 2, h: 36, k: "mode", m });
      });
      if (MODE === "host") return this.hostDraw(G, c, P);
      if (!s.qs) {
        c.fillStyle = ink; c.textAlign = "center"; c.font = `600 16px ${G.UI}`;
        c.fillText(s.err ? "Couldn't load the crew's answers." : "Loading the crew's answers…", W / 2, H * 0.4);
        if (s.err) s.btns.push(Object.assign(G.pill(c, W / 2 - 80, H * 0.4 + 28, 160, 46, "Try again", true), { k: "retry" }));
        return;
      }
      const i = s.qi, q = s.qs[i], over = s.over[i], typing = !over && !s.done;
      c.font = `600 13px ${G.UI}`; c.fillStyle = mute; c.textAlign = "left"; c.fillText(`${s.crew ? "Crew Edition" : "Survey says"} · ${i + 1} of ${s.qs.length}`, 14, TOP + 14);
      c.textAlign = "right"; c.fillText(`${scoreOf(s)} pts`, W - 14, TOP + 14);
      let y = question(G, c, P, q, TOP + 40);
      const kbH = typing ? Math.min(214, H * 0.34) : 0, rows = Math.ceil(q.a.length / 2);
      const sh = Math.max(26, Math.min(44, (H - y - kbH - 100) / rows - 6));
      board(G, c, P, q, y, sh, j => s.found[i].includes(j) ? 1 : over ? 2 : 0);
      y += rows * (sh + 6) + 6;
      strikes(c, P, s.strikes[i], typing ? 14 : W / 2 - 45, y);
      if (typing) {
        s.btns.push(Object.assign(G.pill(c, W - 14 - 84, y - 4, 84, 34, "Pass"), { k: "pass" }));
        inputBox(G, c, P, y + 36, "Type an answer"); keys(G, c, P, kbH);
      } else {
        y += 42;
        c.fillStyle = ink; c.textAlign = "center"; c.font = `600 15px ${G.UI}`;
        c.fillText(`${s.found[i].length} of ${q.a.length} answers · ${qScore(s, i)} of 200 pts`, W / 2, y); y += 22;
        const last = i === s.qs.length - 1, bw = Math.min(240, W - 60);
        if (!s.done) s.btns.push(Object.assign(G.pill(c, W / 2 - bw / 2, y, bw, 48, "Next question", true), { k: "next" }));
        else if (s.posted) {
          const hw = (W - 40) / 2;
          s.btns.push(Object.assign(G.pill(c, 14, y, hw, 46, "‹ Previous", false, i === 0), { k: "prev" }));
          s.btns.push(Object.assign(G.pill(c, 26 + hw, y, hw, 46, "Next ›", false, last), { k: "next" }));
          s.btns.push(Object.assign(G.pill(c, W / 2 - bw / 2, y + 58, bw, 48, "See results", true), { k: "res" }));
        }
      }
    },
    tap(G, x, y) {
      const s = G.s, b = s.btns.find(b => x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h); if (!b) return;
      if (b.k === "mode") { if (MODE !== b.m) { MODE = b.m; s.typed = ""; s.msgT = 0; if (MODE === "host" && !HS) hLoad(); } return; }
      if (MODE === "host") return this.hostTap(G, b);
      if (b.k === "retry") { s.err = false; s.loading = true; return this.fetchCrew(G); }
      if (b.k === "res") return G.results(this.info(G));
      if (b.k === "prev") { if (s.qi > 0) s.qi--; return; }
      if (b.k === "next") { if (s.qi < s.qs.length - 1 && s.over[s.qi]) { s.qi++; if (!s.done) this.persist(G); } return; }
      if (b.k === "pass") return this.endQ(G, s.qi);
      if (b.key) return this.press(G, b.key);
    },
    onKey(G, k, d) {
      if (!d) return;
      const host = MODE === "host", key = k === "Enter" ? ">" : k === "Backspace" ? "<" : k === " " ? " " : /^[a-z0-9]$/i.test(k) ? k.toUpperCase() : "";
      if (!key || (host ? !HS || HS.over : !G.s.qs)) return;
      if (host) { G.s.hkb = true; this.hPress(G, key); } else this.press(G, key);
    },

    // ---- Host mode: one screen for the room, run like the show. Two teams; the host flips answers (tap with Peek on,
    // or type what a player said), hits Strike on a miss, then gives the pot to the team that won the round.
    // Last round is triple points, the one before it double. Nothing here touches the daily solo score. ----
    hostNew(G, name, raw) {
      HS = { name, raw: raw || null, day: KEY, qi: 0, pot: 0, score: [0, 0], over: false }; HD = deckOf(HS);
      ["shown", "free"].forEach(k => { HS[k] = HD.map(() => []); }); HS.strikes = HD.map(() => 0); HS.won = HD.map(() => -1);
      G.s.peek = false; G.s.hkb = false; hSave();
    },
    hReveal(G, j) {
      const s = G.s, h = HS, i = h.qi; if (h.shown[i].includes(j)) return;
      h.shown[i].push(j); if (h.won[i] < 0) h.pot += HD[i].a[j].pts * mult(i);
      s.flash = j; s.flashT = 0.7; ding(); hSave();
    },
    hStrike(G) {
      const s = G.s, h = HS, i = h.qi;
      if (h.strikes[i] < 3) { h.strikes[i]++; s.bigN = h.strikes[i]; } else s.bigN = 1; // after three, a miss is the other team's failed steal
      s.bigX = 1.3; buzzer(); G.buzz(); hSave();
    },
    hEnter(G) {
      const s = G.s, h = HS, i = h.qi, n = norm(s.typed); if (n.length < 2) return; s.typed = "";
      const hits = match(HD[i], n), open = hits.filter(j => !h.shown[i].includes(j));
      if (open.length > 1) return this.say(G, "Could be a couple. Be more specific.", 2.2);
      if (!open.length && hits.length) return this.say(G, "Already on the board");
      if (open.length) { this.say(G, open[0] === 0 ? "Number one answer!" : "Good answer!"); return this.hReveal(G, open[0]); }
      this.say(G, "Not on the board"); this.hStrike(G);
    },
    hPress(G, k) { if (k === ">") return this.hEnter(G); typeKey(G.s, k); },
    hostTap(G, b) {
      const s = G.s, h = HS;
      if (b.k === "hpolls") return this.hostNew(G, "polls");
      if (b.k === "hcrew") {
        if (s.hload) return; s.hload = true; s.hmsg = "";
        API("getFeudSurvey", me ? me.id : "", true).then(r => {
          s.hload = false;
          if (!r || !r.answers) s.hmsg = "The crew's answers aren't ready on the server yet. Try again in a few minutes.";
          else if (r.n < 3) s.hmsg = "Need at least 3 survey answers first.";
          else this.hostNew(G, "crew", r.answers);
        }).catch(() => { s.hload = false; s.hmsg = "Couldn't load the crew's answers. Check your connection."; });
        return;
      }
      if (!h) return;
      const quit = () => { HS = HD = null; store.set(HK, null); s.quitT = 0; s.hmsg = ""; };
      if (b.k === "hnew") return quit();
      if (b.k === "hquit") { if (s.quitT > 0) quit(); else s.quitT = 3; return; }
      const i = h.qi, q = HD[i];
      if (b.slot != null) return this.hReveal(G, b.slot);
      if (b.k === "hstrike") return this.hStrike(G);
      if (b.k === "hpeek") { s.peek = !s.peek; return; }
      if (b.k === "hkb") { s.hkb = !s.hkb; s.typed = ""; return; }
      if (b.k === "hwin0" || b.k === "hwin1") {
        if (h.won[i] >= 0 || !h.pot) return;
        const t = b.k === "hwin0" ? 0 : 1; h.score[t] += h.pot; h.pot = 0; h.won[i] = t; G.sfx("win"); return hSave();
      }
      if (b.k === "hall") { q.a.forEach((a, j) => { if (!h.shown[i].includes(j)) { h.shown[i].push(j); h.free[i].push(j); } }); return hSave(); }
      if (b.k === "hnext") {
        if (h.won[i] < 0 && h.pot) return;
        s.peek = false; s.typed = ""; if (i === HD.length - 1) { h.over = true; G.sfx("win"); } else h.qi++;
        return hSave();
      }
      if (b.key) return this.hPress(G, b.key);
    },
    hostDraw(G, c, P) {
      const s = G.s, W = G.W, H = G.H, h = HS, { ink, mute } = P;
      const lines = (t, y, font, col) => { c.font = font; c.fillStyle = col; c.textAlign = "center"; wrap(c, t, W - 48).forEach(l => { c.fillText(l, W / 2, y); y += 21; }); return y; };
      const bw = Math.min(280, W - 60), bx = W / 2 - bw / 2;
      if (!h) {
        lines("Host a game", TOP + 44, `700 24px ${G.TITLE}`, ink);
        let y = lines("One screen for the whole room, two teams. Read the question out loud, flip answers as they're guessed, hit Strike on a miss, then give the pot to the team that won the round.", TOP + 80, `500 14.5px ${G.UI}`, mute) + 14;
        s.btns.push(Object.assign(G.pill(c, bx, y, bw, 50, "Play the crew's answers", true, s.hload), { k: "hcrew" }));
        s.btns.push(Object.assign(G.pill(c, bx, y + 62, bw, 50, "Play America's polls", false, s.hload), { k: "hpolls" }));
        if (s.hload || s.hmsg) lines(s.hload ? "Loading the crew's answers…" : s.hmsg, y + 144, `600 14px ${G.UI}`, ink);
        return;
      }
      if (h.over) {
        const [a, b] = h.score;
        lines(a === b ? "It's a tie!" : `${TEAMS[a > b ? 0 : 1]} wins! 🦃`, TOP + 60, `700 26px ${G.TITLE}`, ink);
        lines(`${TEAMS[0]} ${a}  ·  ${TEAMS[1]} ${b}`, TOP + 100, `600 16px ${G.UI}`, mute);
        s.btns.push(Object.assign(G.pill(c, bx, TOP + 134, bw, 50, "New game", true), { k: "hnew" }));
        return;
      }
      const i = h.qi, q = HD[i], m = mult(i), won = h.won[i], kb = s.hkb, T = TOP + 6;
      // scoreboard: team, pot, team
      const pw = 88, tw = (W - 24 - pw - 12) / 2;
      [0, 1].forEach(t => {
        const x = t ? W - 12 - tw : 12; rr(c, x, T, tw, 50, 10); c.fillStyle = P.dk ? "#2c2c2e" : "#ecece6"; c.fill();
        c.textAlign = "center"; c.fillStyle = mute; c.font = `600 11.5px ${G.UI}`; c.fillText(TEAMS[t], x + tw / 2, T + 15);
        c.fillStyle = ink; c.font = `700 22px ${G.UI}`; c.fillText(h.score[t], x + tw / 2, T + 35);
      });
      rr(c, W / 2 - pw / 2, T, pw, 50, 10); c.fillStyle = "#1f3a8a"; c.fill();
      c.fillStyle = "#e9b949"; c.font = `700 11.5px ${G.UI}`; c.fillText("POT", W / 2, T + 15); c.font = `700 22px ${G.UI}`; c.fillText(h.pot, W / 2, T + 35);
      let y = T + 68;
      c.font = `600 13px ${G.UI}`; c.fillStyle = mute; c.textAlign = "left"; c.fillText(`Round ${i + 1} of ${HD.length}${m > 1 ? (m === 2 ? " · DOUBLE" : " · TRIPLE") : ""}`, 14, y);
      c.textAlign = "right"; c.fillStyle = s.quitT > 0 ? "#d64545" : mute; c.fillText(s.quitT > 0 ? "Tap again to end" : "End game", W - 14, y);
      s.btns.push({ x: W - 140, y: y - 16, w: 140, h: 32, k: "hquit" });
      y = question(G, c, P, q, y + 28);
      const kbH = kb ? Math.min(214, H * 0.34) : 0, rows = Math.ceil(q.a.length / 2);
      const sh = Math.max(26, Math.min(44, (H - y - kbH - (kb ? 96 : 160)) / rows - 6));
      const slots = board(G, c, P, q, y, sh, j => h.shown[i].includes(j) ? (h.free[i].includes(j) ? 2 : 1) : s.peek ? 3 : 0);
      if (s.peek) slots.forEach(b => s.btns.push(b));
      if (s.bigX > 0) { // the big red X
        const n = s.bigN || 1, z = Math.min(84, (W - 60) / 3), bh = rows * (sh + 6), x0 = W / 2 - (n * z + (n - 1) * 10) / 2;
        c.save(); c.globalAlpha = Math.min(1, s.bigX * 3);
        for (let k = 0; k < n; k++) { const x = x0 + k * (z + 10), yy = y + bh / 2 - z / 2; rr(c, x, yy, z, z, 12); c.fillStyle = P.bg; c.fill(); c.lineWidth = 6; c.strokeStyle = "#d64545"; c.stroke(); c.fillStyle = "#d64545"; c.textAlign = "center"; c.font = `700 ${z * 0.72}px ${G.UI}`; c.fillText("✕", x + z / 2, yy + z / 2 + 3); }
        c.restore();
      }
      y += rows * (sh + 6) + 6;
      strikes(c, P, h.strikes[i], 14, y);
      const aw = W - 28 - 104, w1 = aw * 0.4, w2 = (aw - w1 - 12) / 2; let x = 14 + 104;
      s.btns.push(Object.assign(G.pill(c, x, y - 4, w1, 34, "Strike"), { k: "hstrike" })); x += w1 + 6;
      s.btns.push(Object.assign(G.pill(c, x, y - 4, w2, 34, "Peek", s.peek), { k: "hpeek" })); x += w2 + 6;
      s.btns.push(Object.assign(G.pill(c, x, y - 4, w2, 34, "Keys", kb), { k: "hkb" }));
      if (kb) { inputBox(G, c, P, y + 36, "Type what they said"); keys(G, c, P, kbH); return; }
      y += 42; const hw = (W - 36) / 2, last = i === HD.length - 1;
      if (won < 0) [0, 1].forEach(t => s.btns.push(Object.assign(G.pill(c, 12 + t * (hw + 12), y, hw, 46, `Pot → ${TEAMS[t].slice(5)}`, true, !h.pot), { k: "hwin" + t })));
      else lines(`${TEAMS[won]} banked it`, y + 23, `600 15px ${G.UI}`, ink);
      y += 56;
      s.btns.push(Object.assign(G.pill(c, 12, y, hw, 46, "Reveal all", false, h.shown[i].length === q.a.length), { k: "hall" }));
      s.btns.push(Object.assign(G.pill(c, 24 + hw, y, hw, 46, last ? "Final score" : "Next round ›", false, won < 0 && h.pot > 0), { k: "hnext" }));
    },
    _t: { norm, match, alike, crewBoard, DAYS, SPARE, scoreOf, host: () => HS, deck: () => HD, mode: m => { MODE = m; } }
  });
})();
