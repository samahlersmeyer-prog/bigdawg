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
  // Host-only boards: never a solo daily, so hosting them spoils nothing. Same rule as above: real published polls only.
  const MORE = [
    P("Name America's favorite Halloween candy.", "Monmouth University Poll, 2019", [["Reese's Peanut Butter Cups", 36], ["Snickers", 18], ["M&M's", 11, "mms|mm|m and m"], ["Hershey bar", 6], ["Candy corn", 6], ["Skittles", 5], ["Starburst", 4], ["Tootsie Pops", 2]]),
    P("Name America's favorite Christmas cookie.", "Monmouth University Poll, 2023", [["Frosted sugar cookies", 32], ["Gingerbread", 12], ["Chocolate chip", 11], ["Snickerdoodles", 6]]),
    P("Name America's favorite season.", "Morning Consult, 2022", [["Fall", 41, "autumn"], ["Spring", 24], ["Summer", 24], ["Winter", 11]]),
    P("Name America's favorite day of the week.", "YouGov, 2021", [["Saturday", 35], ["Friday", 29], ["Sunday", 14]]),
    P("Name a New Year's resolution people are making.", "YouGov, Dec 2025", [["Exercise more", 25, "work out|gym|get in shape|lose weight|go to gym"], ["Be happy", 23, "happiness|happier|be happier"], ["Eat healthier", 22, "eat better|eat healthy|diet"], ["Save more money", 21, "save money|money|save"], ["Improve my health", 21, "health|get healthy|be healthy|get healthier"]]),
    P("Name a vegetable people say they don't like.", "OnePoll for Dr. Praeger's, 2019", [["Turnips", 27], ["Beets", 26], ["Radishes", 23], ["Brussels sprouts", 21], ["Artichokes", 20], ["Eggplant", 20], ["Butternut squash", 20]]),
    P("Name a vegetable almost everybody likes.", "OnePoll for Dr. Praeger's, 2019", [["Corn", 91], ["Potatoes", 91], ["Carrots", 89], ["Tomatoes", 89], ["Onions", 87], ["Green beans", 87], ["Cucumbers", 86], ["Broccoli", 85]]),
    P("Name something people plan to do this holiday season.", "YouGov holiday survey", [["Listen to holiday music", 75, "music|christmas music|carol|sing carol|listen music|listen christmas music"], ["Watch a holiday movie", 72, "movie|christmas movie|watch movie|watch christmas movie"], ["Look at holiday lights", 70, "lights|christmas lights|look lights|see lights|look christmas lights"], ["Exchange presents", 70, "presents|gifts|open presents|give gifts|give presents|exchange gifts|open gifts"], ["Drink hot chocolate", 67, "hot chocolate|hot cocoa|cocoa"], ["Decorate a tree", 66, "tree|christmas tree|decorate tree|put up tree|decorate|decorate christmas tree"]]),
    P("Name a favorite breakfast food.", "National Honey Board survey", [["Eggs", 69], ["Bacon or sausage", 46, "bacon|sausage"], ["Cereal", 44], ["Fruit", 42], ["Oatmeal", 39], ["Hash browns", 30, "hashbrown|potato"], ["Biscuits and gravy", 17, "biscuit|gravy"]]),
    P("Name America's favorite ice cream flavor.", "YouGov, 2022", [["Vanilla", 11], ["Chocolate", 10], ["Cookies and cream", 7, "oreo|cookies cream"], ["Strawberry", 6], ["Cookie dough", 6]]),
    P("Name a favorite ice cream topping.", "YouGov, 2022", [["Hot fudge", 40], ["Chocolate syrup", 33, "chocolate|chocolate sauce|syrup"], ["Whipped cream", 32, "whip cream|cool whip"], ["Caramel", 32]]),
    P("Name something people put on a hamburger.", "YouGov", [["Ketchup", 71, "catsup"], ["Onions", 64], ["Mustard", 50], ["Mayonnaise", 48, "mayo"]]),
    P("Name a household chore people hate.", "TaskRabbit survey, 2019", [["Cleaning the bathroom", 63, "bathroom|toilet|clean toilet|scrub toilet"], ["Yard work", 43, "mow|mow lawn|lawn|rake|rake leaves|yardwork|cut grass"], ["Cleaning up after the pet", 42, "pet|dog poop|poop|litter box|pick up poop|clean up after dog|cat litter"], ["Laundry", 31, "fold laundry|wash clothes|clothes|fold clothes"], ["Vacuuming", 31, "sweep|sweeping"]]),
    P("Name a food Americans say they hate.", "YouGov, 2025", [["Liver", 40], ["Anchovies", 36], ["Sardines", 35]]),
    P("Name a favorite winter holiday drink.", "Harris Poll for Instacart", [["Hot chocolate", 58, "cocoa|hot cocoa"], ["Eggnog", 42], ["Cider", 26], ["Mulled wine", 13, "wine"], ["Hot toddy", 13]]),
    P("Name America's favorite meal of the day.", "YouGov, Jan 2025", [["Dinner", 50, "supper"], ["Breakfast", 23], ["Lunch", 19]])
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
  const TOP = 34; // room for the Solo | Host | TV switch
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
  const HK = "bdd:feud:host", CODE = "bdd:feud:code", USED = "bdd:feud:used", TM = "bdd:feud:tm", TEAMS = ["Team Turkey", "Team Gravy"], TSEC = 15; // TSEC: seconds on the answer clock
  let MODE = "solo", HS = null, HD = null, hist = [];
  // Host boards always add up to 100, like the show: each answer's share of its board, rounded so the total is exact.
  const to100 = b => {
    const t = tot(b) || 1, raw = b.a.map(a => 100 * a.pts / t), fl = raw.map(Math.floor); let left = 100 - fl.reduce((x, y) => x + y, 0);
    raw.map((r, j) => [r - fl[j], j]).sort((x, y) => y[0] - x[0]).forEach(p => { if (left-- > 0) fl[p[1]]++; });
    return { q: b.q, src: b.src + " · scaled to 100", a: b.a.map((a, j) => ({ label: a.label, pts: fl[j], k: a.k })).sort((x, y) => y.pts - x.pts) };
  };
  // n boards this phone hasn't hosted yet, in random order; when the pile runs short it starts over.
  function pick(list, n) {
    let used = store.get(USED) || [], f = list.filter(b => !used.includes(b.q));
    if (f.length < n) { used = used.filter(q => !list.some(b => b.q === q)); f = list.slice(); }
    f = f.map(b => [Math.random(), b]).sort((x, y) => x[0] - y[0]).slice(0, n).map(p => p[1]);
    store.set(USED, used.concat(f.map(b => b.q))); return f;
  }
  // Every game is 5 rounds. Polls = the daily boards already out (so hosting never spoils an upcoming solo board), the spare
  // board and the host-only ones. Party mix puts two of the crew's questions 2nd and 4th. The biggest poll board is the
  // triple round at the end. Crew = all of the crew's questions.
  function newDeck(name, raw) {
    const cb = raw ? crewBoard(raw).filter(b => b.a.length > 1) : [];
    if (name === "crew") return cb.map(to100);
    const c = name === "mix" ? pick(cb, Math.min(2, cb.length)) : [];
    const d = pick([].concat(...Object.keys(DAYS).filter(d => d <= KEY && Array.isArray(DAYS[d])).map(d => DAYS[d]), SPARE, MORE), 5 - c.length).sort((x, y) => x.a.length - y.a.length);
    c.forEach((b, i) => d.splice(1 + 2 * i, 0, b)); return d.map(to100);
  }
  // A game started before decks were saved with the game (Nov 26) keeps its old boards and points.
  const oldDeck = h => {
    if (h.name === "polls") return [].concat(...Object.keys(DAYS).filter(d => d <= h.day && Array.isArray(DAYS[d])).map(d => DAYS[d]), SPARE);
    const cb = crewBoard(h.raw), T = DAYS["2026-11-26"];
    return h.name === "mix" ? [T[1], cb[4], T[2], cb[0], T[0]] : cb;
  };
  const hLoad = () => { HS = store.get(HK); hist = []; if (HS && !HS.deck) { HS.deck = oldDeck(HS); delete HS.raw; } HD = HS ? HS.deck : null; if (HS) { HD.forEach(b => b.a.forEach(a => { a.k = a.k || [norm(a.label)]; })); askCode(); hPush(); } };
  const hSave = () => { store.set(HK, HS); hPush(); };
  // Undo: every host action saves the game first. The TV's strike and ding counters keep counting up, so undo never replays a sound.
  const snap = () => { hist.push(JSON.stringify(HS)); if (hist.length > 30) hist.shift(); };
  function undo() { if (!hist.length) return; const o = HS; HS = Object.assign(JSON.parse(hist.pop()), { code: o.code, nx: o.nx, nd: o.nd, tm: o.tm, tn: o.tn, tl: 0 }); HD = HS.deck; hSave(); }
  const mult = i => i === HD.length - 1 ? 3 : i === HD.length - 2 ? 2 : 1;
  // ---- TV link: the host's phone pushes what the room may see (feudPush); a second device, say a computer on the TV,
  // shows it (TV mode, feudWatch). Only flipped answers ever leave the phone. ----
  const view = () => {
    const h = HS, i = h.qi, q = HD[i];
    return { r: i + 1, of: HD.length, m: mult(i), q: q.q, a: q.a.map((a, j) => h.shown[i].includes(j) ? [a.label, a.pts, h.free[i].includes(j) ? 1 : 0] : 0),
      st: h.strikes[i], x: h.nx || 0, xn: h.xn || 1, d: h.nd || 0, pot: h.pot, sc: h.score, tm: h.tm || TEAMS, tn: h.tn || 0, tl: h.tl || 0, won: h.won[i], over: h.over };
  };
  // A push that fails is sent again (the newest view, up to 5 tries, 2 s apart) so the TV never sticks on an old screen.
  let pushing = false, dirty = false, fails = 0, asking = false;
  function hPush() {
    if (!HS || !me) return;
    if (!HS.code) return askCode();
    if (pushing) { dirty = true; return; }
    pushing = true; dirty = false;
    API("feudPush", me.id, HS.code, view()).then(() => { fails = 0; return 0; }, e => {
      if (/No game/.test(errMsg(e)) && HS) { HS.code = ""; store.set(CODE, null); store.set(HK, HS); return 1; } // code expired: get a new one
      return ++fails < 5 ? 2000 : 0;
    }).then(wait => { pushing = false; if (wait > 1) setTimeout(hPush, wait); else if (wait || dirty) hPush(); });
  }
  // Ask the server for a TV code for a game that doesn't have one yet (a polls game starts before the code arrives).
  function askCode() {
    const h = HS; if (!h || h.code || asking || !me) return; asking = true;
    API("feudHost", me.id, "").then(r => { asking = false; if (HS && !HS.code && r && r.code) { HS.code = r.code; store.set(CODE, r.code); hSave(); } }, () => { asking = false; });
  }
  let TV = null;
  function tvClose() {
    if (!TV) return; TV.alive = false; clearTimeout(TV.xt); clearInterval(TV.tick);
    try { if (document.fullscreenElement) document.exitFullscreen(); } catch (e) {}
    try { if (TV.wake) TV.wake.release(); } catch (e) {}
    TV.root.remove(); TV = null;
  }
  function tvOpen(code, v) {
    tvClose();
    const root = el("div", "ftv"), mk = (cls, parent, text) => { const n = el("div", cls, text); (parent || root).append(n); return n; };
    const top = mk("ftv-top"), t0 = mk("ftv-team", top), mid = mk("ftv-mid", top), t1 = mk("ftv-team", top);
    const T = TV = { root, alive: true, last: null, key: "", n0: mk("ftv-tn", t0), s0: mk("ftv-ts", t0), rd: mk("ftv-rd", mid), pot: mk("ftv-pot", mid), n1: mk("ftv-tn", t1), s1: mk("ftv-ts", t1),
      q: mk("ftv-q", null, "Waiting for the host…"), board: mk("ftv-board"), st: mk("ftv-st"), clock: mk("ftv-clock"), x: mk("ftv-x"), win: mk("ftv-win") };
    T.tick = setInterval(() => {
      if (!T.end) return; const left = Math.ceil((T.end - Date.now()) / 1000);
      T.clock.textContent = Math.max(0, left); T.clock.classList.toggle("low", left <= 5);
      if (left <= 0) { T.end = 0; timesUp(); setTimeout(() => { if (!T.end) T.clock.classList.remove("go"); }, 2500); }
    }, 200);
    const foot = mk("ftv-foot"); mk("ftv-code", foot, `Big Dawg Feud · TV code ${code}`);
    const fs = el("button", "ftv-btn", "Full screen"), ex = el("button", "ftv-btn", "Exit"); foot.append(fs, ex);
    fs.addEventListener("click", () => { try { (root.requestFullscreen || root.webkitRequestFullscreen).call(root); } catch (e) {} });
    ex.addEventListener("click", tvClose);
    document.body.append(root);
    try { navigator.wakeLock.request("screen").then(w => { T.wake = w; }).catch(() => {}); } catch (e) {}
    tvRender(v);
    const poll = () => { if (T.alive) API("feudWatch", code).then(tvRender).catch(() => {}).then(() => setTimeout(poll, 700)); };
    setTimeout(poll, 700);
  }
  function tvRender(v) {
    const T = TV; if (!T || !T.alive || !v) return;
    const L = T.last;
    T.n0.textContent = v.tm[0]; T.n1.textContent = v.tm[1]; T.s0.textContent = v.sc[0]; T.s1.textContent = v.sc[1]; T.pot.textContent = v.pot;
    T.rd.textContent = `ROUND ${v.r} OF ${v.of}` + (v.m > 1 ? (v.m === 2 ? " · DOUBLE" : " · TRIPLE") : "");
    const key = v.r + "|" + v.q;
    if (key !== T.key) {
      T.key = key; T.q.textContent = v.q; T.board.textContent = "";
      const rows = Math.ceil(v.a.length / 2), cols = [el("div", "ftv-col"), el("div", "ftv-col")]; T.board.append(cols[0], cols[1]);
      T.slots = v.a.map((a, j) => { const n = el("div", "ftv-slot"); cols[j < rows ? 0 : 1].append(n); return n; }); T.sig = v.a.map(() => null);
    }
    v.a.forEach((a, j) => {
      const sig = a ? a.join("|") : "", n = T.slots[j]; if (T.sig[j] === sig) return; T.sig[j] = sig; n.textContent = "";
      if (a) { n.className = "ftv-slot on" + (a[2] ? " free" : ""); n.append(el("span", "ftv-al", a[0]), el("span", "ftv-ap", a[1])); }
      else { n.className = "ftv-slot"; n.append(el("span", "ftv-num", j + 1)); }
    });
    T.st.textContent = "✕".repeat(v.st);
    if (L && v.x > L.x) { T.x.textContent = "✕".repeat(v.xn || 1); T.x.classList.add("go"); buzzer(); clearTimeout(T.xt); T.xt = setTimeout(() => T.x.classList.remove("go"), 1500); }
    if (L && v.d > L.d) ding();
    if (L && v.tn > (L.tn || 0) && v.tl) { T.end = Date.now() + v.tl * 1000; T.clock.textContent = v.tl; T.clock.classList.remove("low"); T.clock.classList.add("go"); }
    else if (!v.tl && T.end) { T.end = 0; T.clock.classList.remove("go"); }
    if (L && v.won >= 0 && L.won < 0 && L.r === v.r && typeof chime === "function") chime("win");
    T.win.textContent = v.over ? (v.sc[0] === v.sc[1] ? "It's a tie!" : `${v.tm[v.sc[0] > v.sc[1] ? 0 : 1]} wins! 🦃`) : ""; T.win.classList.toggle("go", !!v.over);
    if (v.over && L && !L.over && typeof celebrate === "function") celebrate();
    T.last = v;
  }
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
  const timesUp = () => { tone("square", 196, 0.9, 0.16); tone("square", 147, 0.9, 0.12); };
  const buzzer = () => { tone("sawtooth", 130, 0.8, 0.2); tone("square", 137, 0.8, 0.1); };
  defGame({
    key: "feud", name: "Feud", icon: "🦃", max: 1000, cat: "den", puzzle: true,
    blurb: "Survey says! Through Sunday.",
    how: "Five survey questions a day. Type an answer you think is on the board and hit Enter. Get it right and it flips over with its points. Miss and it's a strike, and three strikes ends the question (or tap Pass to move on). Thursday to Saturday use real polls, so you're guessing what America said, and the source is under each question. Sunday is the Crew Edition, built from the crew's own survey answers. Each question is worth up to 200: your share of the points on its board. Got a room full of people? Flip the switch at the top to Host: two teams on one screen, you flip the answers, hit Strike, and hand the pot to the team that wins the round. To put the board on a TV, open Feud on a computer, tap TV and type the code from the host's phone. Here through Sunday only.",
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
      if (s.upT > 0) s.upT -= dt;
      if (s.timer > 0) {
        const was = Math.ceil(s.timer); s.timer -= dt;
        if (s.timer <= 0) { s.timer = 0; s.upT = 3; timesUp(); G.buzz(); } else if (Math.ceil(s.timer) < was && s.timer <= 5) tone("sine", 880, 0.08, 0.1);
      }
      if (MODE !== "solo" || !s.qs) return;
      if (!s.done) { s.el += dt; s.ck = (s.ck || 0) + dt; if (s.ck > 2) { s.ck = 0; this.persist(G); } }
      if (s.done && !s.posted && s.postT > 0) { s.postT -= dt; if (s.postT <= 0) { s.posted = true; this.persist(G); G.post(scoreOf(s), this.info(G)); } }
    },
    draw(G, c) {
      const s = G.s, P = pal(G), { ink, mute } = P, W = G.W, H = G.H; s.btns = [];
      c.fillStyle = P.bg; c.fillRect(0, 0, W, H); c.textBaseline = "middle";
      // Solo | Host | TV switch
      const gw = 216, sw = gw / 3, gx = W / 2 - gw / 2;
      rr(c, gx, 4, gw, 28, 14); c.fillStyle = P.dk ? "#2c2c2e" : "#ecece6"; c.fill();
      ["solo", "host", "tv"].forEach((m, k) => {
        const on = MODE === m, x = gx + k * sw;
        if (on) { rr(c, x + 2, 6, sw - 4, 24, 12); c.fillStyle = ink; c.fill(); }
        c.fillStyle = on ? P.bg : mute; c.textAlign = "center"; c.font = `700 13px ${G.UI}`; c.fillText(["Solo", "Host", "TV"][k], x + sw / 2, 19);
        s.btns.push({ x, y: 0, w: sw, h: 36, k: "mode", m });
      });
      if (MODE === "host") return this.hostDraw(G, c, P);
      if (MODE === "tv") { // this device becomes the room's screen
        c.fillStyle = ink; c.textAlign = "center"; c.font = `700 24px ${G.TITLE}`; c.fillText("Put the game on this screen", W / 2, TOP + 44);
        c.font = `500 14.5px ${G.UI}`; c.fillStyle = mute; let y = TOP + 80;
        wrap(c, "Start a game in Host mode on your phone, then type its TV code here. This screen shows the board for the room, and the phone runs the game.", W - 48).forEach(l => { c.fillText(l, W / 2, y); y += 21; });
        inputBox(G, c, P, y + 8, "TV code"); keys(G, c, P, Math.min(214, H * 0.34));
        return;
      }
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
      if (MODE === "tv") { if (b.key) this.tvPress(G, b.key); return; }
      if (b.k === "retry") { s.err = false; s.loading = true; return this.fetchCrew(G); }
      if (b.k === "res") return G.results(this.info(G));
      if (b.k === "prev") { if (s.qi > 0) s.qi--; return; }
      if (b.k === "next") { if (s.qi < s.qs.length - 1 && s.over[s.qi]) { s.qi++; if (!s.done) this.persist(G); } return; }
      if (b.k === "pass") return this.endQ(G, s.qi);
      if (b.key) return this.press(G, b.key);
    },
    onKey(G, k, d) {
      if (!d) return;
      const tv = MODE === "tv", key = k === "Enter" ? ">" : k === "Backspace" ? "<" : k === " " ? " " : /^[a-z0-9]$/i.test(k) ? k.toUpperCase() : "";
      if (tv) { if (key) this.tvPress(G, key); return; }
      if (!key) return;
      if (MODE === "host") { if (HS && !HS.over && G.s.hide && G.s.kb) this.hPress(G, key); } else if (G.s.qs) this.press(G, key);
    },

    // ---- Host mode: run like the show. Two teams; the host's phone shows every answer (Hide covers them when the phone
    // is also the room's screen), the host taps one to flip it, hits Strike on a miss, then gives the pot to the team that won the round.
    // Last round is triple points, the one before it double. Nothing here touches the daily solo score. ----
    tvPress(G, k) {
      const s = G.s; if (k !== ">") return typeKey(s, k);
      const code = s.typed.replace(/[^A-Z]/g, ""); s.typed = ""; if (code.length !== 4) return this.say(G, "The code is 4 letters", 2.5);
      tone("sine", 30, 0.02, 0.0001); if (ac && ac.resume) ac.resume(); // this key press is what lets the TV play sound later
      this.say(G, "Connecting…", 20);
      API("feudWatch", code).then(v => { s.msgT = 0; tvOpen(code, v); }).catch(e => this.say(G, /No game/.test(errMsg(e)) ? "No game with that code" : /Unknown call/.test(errMsg(e)) ? "Server is updating. Try again in a few minutes." : "Couldn't connect. Try again.", 4));
    },
    hostNew(G, name, raw, code) {
      code = store.get(CODE) || code || ""; if (code) store.set(CODE, code); fails = 0; hist = [];
      HS = { name, deck: newDeck(name, raw), code, day: KEY, qi: 0, pot: 0, score: [0, 0], over: false, tm: store.get(TM) || TEAMS.slice() }; HD = HS.deck;
      ["shown", "free"].forEach(k => { HS[k] = HD.map(() => []); }); HS.strikes = HD.map(() => 0); HS.won = HD.map(() => -1);
      hSave(); askCode();
    },
    hReveal(G, j) {
      const s = G.s, h = HS, i = h.qi; if (h.shown[i].includes(j)) return;
      snap(); s.timer = 0; h.tl = 0; h.shown[i].push(j); if (h.won[i] < 0) h.pot += HD[i].a[j].pts * mult(i);
      s.flash = j; s.flashT = 0.7; h.nd = (h.nd || 0) + 1; ding(); hSave();
    },
    hStrike(G) {
      const s = G.s, h = HS, i = h.qi; snap(); s.timer = 0; s.upT = 0; h.tl = 0;
      if (h.strikes[i] < 3) { h.strikes[i]++; s.bigN = h.strikes[i]; } else s.bigN = 1; // after three, a miss is the other team's failed steal
      h.nx = (h.nx || 0) + 1; h.xn = s.bigN;
      s.bigX = 1.3; buzzer(); G.buzz(); hSave();
    },
    // Host plays too: with the answers hidden, the host types what was said and the game flips it or strikes by itself.
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
      if (b.k === "hcrew" || b.k === "hmix") {
        if (s.hload) return; s.hload = true; s.hmsg = "";
        // the crew's answers only ever come down as part of a host game, and the server logs who started it
        API("feudHost", me ? me.id : "", "crew").then(r => {
          s.hload = false;
          if (r.n < 3) s.hmsg = "Need at least 3 survey answers first."; else this.hostNew(G, b.k === "hmix" ? "mix" : "crew", r.answers, r.code);
        }).catch(e => { s.hload = false; s.hmsg = /Unknown call/.test(errMsg(e)) ? "The server is still updating. Try again in a few minutes." : "Couldn't load the crew's answers. Check your connection."; });
        return;
      }
      if (!h) return;
      const quit = () => { HS = HD = null; hist = []; store.set(HK, null); s.quitT = 0; s.hmsg = ""; };
      if (b.k === "hnew") return quit();
      if (b.k === "hquit") { if (s.quitT > 0) quit(); else s.quitT = 3; return; }
      if (b.k === "hundo") { s.timer = 0; return undo(); }
      if (h.over) return;
      const i = h.qi, q = HD[i];
      if (b.k === "hname") { const v = (prompt("Team name", h.tm[b.t]) || "").replace(/[<>]/g, "").replace(/\s+/g, " ").trim().slice(0, 12); if (v) { h.tm[b.t] = v; store.set(TM, h.tm); hSave(); } return; }
      if (b.slot != null) return this.hReveal(G, b.slot);
      if (b.k === "hstrike") return this.hStrike(G);
      if (b.k === "hhide") { s.hide = !s.hide; s.kb = s.hide; s.typed = ""; return; }
      if (b.k === "htime") { // start the answer clock, or stop it
        if (s.timer > 0) { s.timer = 0; h.tl = 0; } else { s.timer = TSEC; s.upT = 0; h.tn = (h.tn || 0) + 1; h.tl = TSEC; tone("sine", 660, 0.12, 0.12); }
        return hSave();
      }
      if (b.k === "hkb") { s.kb = !s.kb; s.typed = ""; return; }
      if (b.key) return this.hPress(G, b.key);
      if (b.k === "hwin0" || b.k === "hwin1") {
        if (h.won[i] >= 0 || !h.pot) return;
        const t = b.k === "hwin0" ? 0 : 1; snap(); s.timer = 0; h.tl = 0; h.score[t] += h.pot; h.pot = 0; h.won[i] = t; G.sfx("win"); return hSave();
      }
      if (b.k === "hall") { if (h.shown[i].length === q.a.length) return; snap(); q.a.forEach((a, j) => { if (!h.shown[i].includes(j)) { h.shown[i].push(j); h.free[i].push(j); } }); return hSave(); }
      if (b.k === "hnext") {
        if (h.won[i] < 0 && h.pot) return;
        snap(); s.timer = 0; h.tl = 0; if (i === HD.length - 1) { h.over = true; G.sfx("win"); } else h.qi++;
        return hSave();
      }
    },
    hostDraw(G, c, P) {
      const s = G.s, W = G.W, H = G.H, h = HS, { ink, mute } = P;
      const lines = (t, y, font, col) => { c.font = font; c.fillStyle = col; c.textAlign = "center"; wrap(c, t, W - 48).forEach(l => { c.fillText(l, W / 2, y); y += 21; }); return y; };
      const bw = Math.min(280, W - 60), bx = W / 2 - bw / 2;
      if (!h) {
        lines("Host a game", TOP + 44, `700 24px ${G.TITLE}`, ink);
        let y = lines("Two teams, five rounds. Your phone shows every answer: read the question out loud, tap an answer when someone says it, hit Strike on a miss, then give the pot to the team that won the round. Every board adds up to 100, and each new game uses surveys you haven't played yet.", TOP + 80, `500 14.5px ${G.UI}`, mute) + 14;
        s.btns.push(Object.assign(G.pill(c, bx, y, bw, 50, "Party mix · polls + crew", true, s.hload), { k: "hmix" }));
        s.btns.push(Object.assign(G.pill(c, bx, y + 60, bw, 46, "America's polls only", false, s.hload), { k: "hpolls" }));
        s.btns.push(Object.assign(G.pill(c, bx, y + 114, bw, 46, "Crew answers only", false, s.hload), { k: "hcrew" }));
        if (s.hload || s.hmsg) lines(s.hload ? "Loading the crew's answers…" : s.hmsg, y + 190, `600 14px ${G.UI}`, ink);
        return;
      }
      const tm = h.tm || TEAMS;
      if (h.over) {
        const [a, b] = h.score;
        lines(a === b ? "It's a tie!" : `${tm[a > b ? 0 : 1]} wins! 🦃`, TOP + 60, `700 26px ${G.TITLE}`, ink);
        lines(`${tm[0]} ${a}  ·  ${tm[1]} ${b}`, TOP + 100, `600 16px ${G.UI}`, mute);
        s.btns.push(Object.assign(G.pill(c, bx, TOP + 134, bw, 50, "New game", true), { k: "hnew" }));
        s.btns.push(Object.assign(G.pill(c, bx, TOP + 194, bw, 44, "↩ Undo", false, !hist.length), { k: "hundo" }));
        return;
      }
      const i = h.qi, q = HD[i], m = mult(i), won = h.won[i], st = h.strikes[i], n = q.a.length, left = n - h.shown[i].length, last = i === HD.length - 1, T = TOP + 6;
      const kb = !!(s.hide && s.kb && won < 0 && left), kbH = kb ? Math.min(214, H * 0.34) : 0; // the keyboard, while a hidden round is live
      // scoreboard: team, pot, team (tap a team to rename it)
      const pw = 88, tw = (W - 24 - pw - 12) / 2;
      [0, 1].forEach(t => {
        const x = t ? W - 12 - tw : 12; rr(c, x, T, tw, 50, 10); c.fillStyle = P.dk ? "#2c2c2e" : "#ecece6"; c.fill();
        c.textAlign = "center"; c.fillStyle = mute; fit(c, tm[t] + " ✎", tw - 12, 11.5, 600, G.UI); c.fillText(tm[t] + " ✎", x + tw / 2, T + 15);
        c.fillStyle = ink; c.font = `700 22px ${G.UI}`; c.fillText(h.score[t], x + tw / 2, T + 35);
        s.btns.push({ x, y: T, w: tw, h: 50, k: "hname", t });
      });
      rr(c, W / 2 - pw / 2, T, pw, 50, 10); c.fillStyle = "#1f3a8a"; c.fill();
      c.fillStyle = "#e9b949"; c.font = `700 11.5px ${G.UI}`; c.fillText("POT", W / 2, T + 15); c.font = `700 22px ${G.UI}`; c.fillText(h.pot, W / 2, T + 35);
      let y = T + 68;
      c.font = `600 13px ${G.UI}`; c.fillStyle = mute; c.textAlign = "left"; c.fillText(`Round ${i + 1} of ${HD.length}${m > 1 ? (m === 2 ? " · DOUBLE" : " · TRIPLE") : ""}${h.code ? " · TV code " + h.code : ""}`, 14, y);
      c.textAlign = "right"; c.fillStyle = s.quitT > 0 ? "#d64545" : mute; c.fillText(s.quitT > 0 ? "Tap again to end" : "End game", W - 14, y);
      s.btns.push({ x: W - 140, y: y - 16, w: 140, h: 32, k: "hquit" });
      y = question(G, c, P, q, y + 28);
      // what the host does next
      const tip = s.upT > 0 ? "Time's up! Hit Strike."
        : won >= 0 ? (left ? "Tap Show rest, then " : "Tap ") + (last ? "Final score." : "Next round.")
        : !left ? "Board cleared! Give out the pot."
        : st >= 3 ? (s.hide ? "3 strikes! Type the ONE steal guess." : "3 strikes! Other team: ONE steal guess.")
        : kb ? "Type what they said, then Enter."
        : s.hide ? "Hidden. Tap Type to enter a guess."
        : !h.shown[i].length && !st ? "Face-off! Tap an answer when it's said."
        : "Tap answers as said. Wrong? Hit Strike.";
      const cw0 = 76, run = s.timer > 0, low = run && s.timer <= 5; // the clock: tap to start 15 seconds, tap again to stop
      rr(c, 12, y - 10, W - 24 - cw0 - 6, 32, 8); c.fillStyle = P.dk ? "#3a3320" : "#fbf1d0"; c.fill();
      c.fillStyle = ink; c.textAlign = "center"; fit(c, tip, W - 44 - cw0, 12.5, 600, G.UI); c.fillText(tip, 12 + (W - 30 - cw0) / 2, y + 7);
      rr(c, W - 12 - cw0, y - 10, cw0, 32, 16); c.fillStyle = low || s.upT > 0 ? "#d64545" : run ? "#1f3a8a" : P.bg; c.fill(); if (!run && !(s.upT > 0)) { c.lineWidth = 1.5; c.strokeStyle = ink; c.stroke(); }
      c.fillStyle = run || s.upT > 0 ? "#fff" : ink; c.font = `700 ${run ? 17 : 14}px ${G.UI}`; c.fillText(run ? Math.ceil(s.timer) : s.upT > 0 ? "0" : `⏱ ${TSEC}s`, W - 12 - cw0 / 2, y + 7);
      s.btns.push({ x: W - 18 - cw0, y: y - 16, w: cw0 + 12, h: 44, k: "htime" }); y += 32;
      // the answers: one tall column when they fit, else two (numbered down the left column first)
      const bot = kb ? H - kbH - 116 : H - 170, cols = (bot - y) / n >= 36 ? 1 : 2, rows = Math.ceil(n / cols), gap = 5, rh = Math.max(22, Math.min(46, (bot - y) / rows - gap)), cw = (W - 24 - (cols - 1) * 6) / cols;
      q.a.forEach((a, j) => {
        const col = j < rows ? 0 : 1, x = 12 + col * (cw + 6), yy = y + (j - col * rows) * (rh + gap), mid = yy + rh / 2 + 1, on = h.shown[i].includes(j), free = on && h.free[i].includes(j);
        rr(c, x, yy, cw, rh, 8); c.fillStyle = free ? (P.dk ? "#2c2c2e" : "#ecece6") : on ? (s.flash === j && s.flashT > 0 ? "#f8e3a1" : "#e9b949") : s.hide ? (P.dk ? "#27386b" : "#1f3a8a") : P.bg; c.fill();
        if (!on && !s.hide) { c.lineWidth = 1.5; c.strokeStyle = P.dk ? "#6d87d8" : "#1f3a8a"; c.stroke(); }
        if (!on && s.hide) { c.fillStyle = "#fff"; c.textAlign = "center"; c.font = `700 ${Math.min(16, rh * 0.5)}px ${G.UI}`; c.fillText(j + 1, x + cw / 2, mid); return; }
        const col2 = free ? mute : on ? "#2b1a10" : ink, ps = (on && !free ? "✓ " : "") + a.pts;
        c.fillStyle = on ? col2 : mute; c.textAlign = "left"; c.font = `700 12px ${G.UI}`; c.fillText(j + 1, x + 9, mid);
        c.fillStyle = col2; c.textAlign = "right"; c.font = `700 15px ${G.UI}`; c.fillText(ps, x + cw - 9, mid); const pwid = c.measureText(ps).width;
        c.textAlign = "left"; fit(c, a.label, cw - 44 - pwid, 15, 700, G.UI); c.fillText(a.label, x + 26, mid);
        if (!on) s.btns.push({ x, y: yy, w: cw, h: rh, slot: j });
      });
      if (s.bigX > 0) { // the big red X
        const k2 = s.bigN || 1, z = Math.min(84, (W - 60) / 3), bh = rows * (rh + gap), x0 = W / 2 - (k2 * z + (k2 - 1) * 10) / 2;
        c.save(); c.globalAlpha = Math.min(1, s.bigX * 3);
        for (let k = 0; k < k2; k++) { const x = x0 + k * (z + 10), yy = y + bh / 2 - z / 2; rr(c, x, yy, z, z, 12); c.fillStyle = P.bg; c.fill(); c.lineWidth = 6; c.strokeStyle = "#d64545"; c.stroke(); c.fillStyle = "#d64545"; c.textAlign = "center"; c.font = `700 ${z * 0.72}px ${G.UI}`; c.fillText("✕", x + z / 2, yy + z / 2 + 3); }
        c.restore();
      }
      // controls, fixed at the bottom: Strike and Undo, the pot, then the round
      const strike = (x, yy, w) => {
        rr(c, x, yy, w, 52, 14); c.fillStyle = "#d64545"; c.fill();
        c.fillStyle = "#fff"; c.textAlign = "center"; c.font = `700 ${w < 200 ? 15 : 18}px ${G.UI}`; c.fillText(`✕ STRIKE  ${"●".repeat(st)}${"○".repeat(3 - st)}`, x + w / 2, yy + 27);
        s.btns.push({ x, y: yy, w, h: 52, k: "hstrike" });
      };
      const hw = (W - 36) / 2;
      if (kb) { // Strike, Undo, a way out to the pot buttons, then the answer box and keys
        const y2 = bot + 6, pw2 = 78, sw2 = W - 24 - 2 * (pw2 + 6);
        strike(12, y2, sw2);
        s.btns.push(Object.assign(G.pill(c, 18 + sw2, y2 + 3, pw2, 46, "↩ Undo", false, !hist.length), { k: "hundo" }));
        s.btns.push(Object.assign(G.pill(c, 24 + sw2 + pw2, y2 + 3, pw2, 46, "Pot ›", false), { k: "hkb" }));
        inputBox(G, c, P, y2 + 60, "Type what they said"); keys(G, c, P, kbH); return;
      }
      let by = H - 164; const uw = 96, sw = W - 24 - uw - 8;
      strike(12, by, sw);
      s.btns.push(Object.assign(G.pill(c, 12 + sw + 8, by + 3, uw, 46, "↩ Undo", false, !hist.length), { k: "hundo" }));
      by += 60;
      if (won < 0) [0, 1].forEach(t => s.btns.push(Object.assign(G.pill(c, 12 + t * (hw + 12), by, hw, 46, `Pot → ${tm[t]}`, true, !h.pot), { k: "hwin" + t })));
      else lines(`${tm[won]} banked it`, by + 23, `600 15px ${G.UI}`, ink);
      by += 54;
      const row = [[s.hide ? "👀 Show" : "🙈 Hide", "hhide", s.hide, false], ["Show rest", "hall", false, !left], [last ? "Final score" : "Next ›", "hnext", false, won < 0 && h.pot > 0]];
      if (s.hide) row.unshift(["⌨ Type", "hkb", false, won >= 0 || !left]);
      const wn = (W - 24 - 8 * (row.length - 1)) / row.length;
      row.forEach((r, k) => s.btns.push(Object.assign(G.pill(c, 12 + k * (wn + 8), by, wn, 44, r[0], r[2], r[3]), { k: r[1] })));
    },
    _t: { norm, match, alike, crewBoard, DAYS, SPARE, MORE, to100, newDeck, scoreOf, host: () => HS, deck: () => HD, mode: m => { MODE = m; }, view, tvOpen, tvRender }
  });
})();
