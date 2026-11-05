// ---------- The Midi (The Den, daily puzzle) ----------
// A 7x7 crossword: bigger than the Mini, quicker than a full one. One per day, timed, no penalty for taking your time.
(function () {
  const PUZ = [{"g":"###RAFT##MAPLE#RATIONLAD#EATADDICT#NIECE##DONE###","a":["River floater","Syrup tree","Limited share","Young fella","Have lunch","Hooked person","Sister's daughter","Finished"],"d":["Snitch","Each","Parade vehicle","Campsite shelter","Make angry","Car stereo","Touch down","Rink surface"]},{"g":"FUSE###INTER##SCALES#TUG#ACT#TEASER##DRONE###KNEE","a":["Join together","Bury","Piano practice","Pull","Play part","Movie preview","Flying camera","Leg joint"],"d":["Clenched hand","Full-length","Put on, as a play","Slippery swimmer","Why","Movie part","Oak or maple","Noah's boat"]},{"g":"PALE###ALIAS##PASTOR#ART#NAG#MENACE##DETER###WARM","a":["Ghostly white","Fake name","Church leader","Museum display","Pester","Dennis the ___","Discourage","Toasty"],"d":["Daddy","Morning wake-up call","On the roster","Have lunch","Piano piece","Speedster","Bug that makes you sick","Brand-___"]},{"g":"SHAH###TOWER##ENAMEL#WOK#FEW#REFUGE##NASAL###BELL","a":["Old Iranian ruler","Tall building","Tooth coating","Stir-fry pan","Not many","Shelter","Of the nose","Ring-a-ling maker"],"d":["Beef ___","Respect","Stir from sleep","Skirt edge","Say no","Allowed by law","Water source","Fabulous, for short"]},{"g":"###WISH##PENCE#HOTTERLIT#ANDENTICE#AGENT##PERK###","a":["Birthday candle hope","British coins","More sizzling","Turned on, as a lamp","Plus","Lure","Sports rep or spy","Job bonus"],"d":["Soaked","Unbroken","Movie part","Group of cattle","Clay worker","Door swinger","Jump","Pen filler"]},{"g":"###MESH##SEINE#DENTALBAN#HIMENAMEL#ACTOR##KEEP###","a":["Netting","River in Paris","Of teeth","Forbid","That guy","Tooth coating","Oscar nominee","Hold onto"],"d":["Guys","One or the other","Slow mover","Ship's steering wheel","Congress chamber","Prom activity","Bird's bill","Floor cleaner"]},{"g":"###SPAM##BULGE#CAMERAPAN#NETORNATE#EVERY##MERE###","a":["Junk email","Swell out","Phone feature for selfies","Frying ___","Hoop's dangler","Fancy","Each","Just a"],"d":["Total","Lots","See eye to eye","Burger patty","Big sign at a game","Slice, as a turkey","Verse","\"We ___ the champions\""]},{"g":"ALUM###LUNAR##ACIDIC#SIT#DUD#DESIRE##DENSE###AGED","a":["Graduate, for short","Of the moon","Sour, like lemon juice","Dog command","Firework that fizzles","Want","Thick","Like fine cheese"],"d":["\"Sadly...\"","Clear-headed","Joined","Angry","Horseback ___","Hex","Good ___ (kind act)","Ocean"]},{"g":"RAGE###ALARM##STRAIT#HAD#SOY#REFUTE##NASAL###TELL","a":["Fury","Morning wake-up call","Narrow waterway","Owned","Tofu bean","Prove wrong","Of the nose","Say"],"d":["Poison ivy result","Wedding spot at church","Veggie patch","Time period","Use the wrong way","Sum","Shout","Plump"]},{"g":"###MESA##BASIC#HITTERFAR#AGEUPDATE#SPINE##EYED###","a":["Flat-topped hill","Simple","Batter","Not near","Birthday number","Phone download","Backbone","Looked at"],"d":["Yoga need","Big property","Castle attack","Farm measure","One under par","Glad","Join together","Plus"]},{"g":"###OPAL##CARVE#MOTIONBOY#MIDERODED#EATER##SLEW###","a":["October birthstone","Slice, as a turkey","Movement","Son","Halfway","Worn away","Picky ___","Lots"],"d":["Granola grain","First coat of paint","Steer clear of","Loan","Road Runner's foe","Lesson of a story","Hive dwellers","Morning moisture on grass"]},{"g":"###ITCH##SNARE#CENSORNOW#TWOERASED#WAGED##SLEW###","a":["Mosquito bite result","Trap","Bleep out","Right away","Pair","Wiped out","Fought, as a war","Lots"],"d":["Place to stay","Tried, as food","Stadium throng","Superman, e.g.","Sewer contents","Reef material","Headlines","Use a needle"]},{"g":"###POST##CIRCA#SENIORRAN#GUTOUTFIT#OCEAN##FERN###","a":["Mail","Around, with a date","Twelfth grader","Sprinted","Instinct","Clothes for the day","Atlantic, e.g.","Leafy shade plant"],"d":["Bowling target","Starting point","Talent finder","Sour","Middle","Pasta topper","Top of a house","Big supporter"]},{"g":"###BATS##MERIT#REGIMEGOD#SEWRUINED#AGAIN##YELL###","a":["Cave dwellers","Deserve","Government","Zeus, e.g.","Use a needle","Wrecked","One more time","Shout"],"d":["Plead","Gotten up","Clocked","Beef ___","Middle","Blush","Like an elephant","Zero"]},{"g":"###WISH##PENCE#CUTTERFAR#ENDINSANE#ROUND##MEET###","a":["Birthday candle hope","British coins","Paper slicer, e.g.","Not near","Finish","Wild","Like a ball","Track event"],"d":["Soaked","Mean to","Movie part","Group of cattle","Chase","Paddled boat","Solid","Picnic pest"]},{"g":"ECHO###ALOUD##SEPTIC#YAP#VET#RESIDE##RADAR###PERM","a":["Canyon sound","Out loud","___ tank","Little dog's bark","Pet doctor","Live","Speed trap device","Curly hairdo"],"d":["A piece of cake","See-through","Grass-___","Not safe","Split up","Closet wood","School semester","Maple tree fluid"]},{"g":"###TENT##HONOR#POTATOARM#METLOADED#ANGEL##SEEN###","a":["Campsite shelter","Respect","French fry source","Bicep's place","Ran into","Full","Christmas tree topper","Spotted"],"d":["Toddler","Tooth coating","Famous","Horse gait","Tribute","Lying face down","\"Sadly...\"","Lion's home"]},{"g":"###PAST##TASTE#CENTERFAN#RAMANNUAL#DAISY##ELSE###","a":["History","Flavor","Middle","Big supporter","Male sheep","Once a year","\"He loves me\" flower","Otherwise"],"d":["Frying ___","Off course","Swipe a base","School semester","Sport with love and deuce","Panama waterway","Grow dim","Employ"]},{"g":"###FISH##HENCE#VIEWERPIG#ANDASHORE#STEAD##TART###","a":["Goldfish, e.g.","Therefore","TV watcher","Oinker","Plus","On the beach","Place, in a way","Sour"],"d":["Charge","Toward the inside","Movie part","Group of cattle","Farther up","View","History","Granola grain"]},{"g":"###PEEP##CANAL#POTATOCRY#METLOOSEN#UNTIL##BEES###","a":["Chick's sound","Panama waterway","French fry source","Weep","Ran into","Untie a bit","Up to","Hive dwellers"],"d":["Gentle tap","Tooth coating","Gobbled up","Story line","Road Runner's foe","Lying face down","Golf bag item","Bro's sibling"]},{"g":"###SURF##DINER#RETINAKEG#SETNARROW#OCEAN##THEM###","a":["Ride waves","Burger joint","Part of the eye","Barrel","Volleyball move","Not wide","Atlantic, e.g.","Those people"],"d":["Dog command","All together","Extend, as a library book","College house","Diploma or thermometer unit","Get to","Tie in a rope","Male sheep"]},{"g":"###ROAM##MAPLE#TEMPERWED#OREAMIDST#SPARE##HOLY###","a":["Wander","Syrup tree","Short fuse","Marry","Mine find","Surrounded by","Bowling score","Sacred"],"d":["Male sheep","Be against","Wide awake","Just a","Middle","Song speed","Laundry","Not wet"]},{"g":"###SASH##CIRCA#MORTALRAP#ILLOPPOSE#ALERT##MERE###","a":["Pageant ribbon","Around, with a date","Human","Hip-hop music","Sick","Be against","Wide awake","Just a"],"d":["Knight's title","Painter, e.g.","Fish covering","School corridor","Penny metal","Syrup tree","Wander","Mine find"]},{"g":"TALE###AVIAN##COTTON#KIT#VET#DERIVE##RACER###GERM","a":["Story","Birdlike","T-shirt fabric","First-aid ___","Pet doctor","Get from a source","Speedster","Bug that makes you sick"],"d":["Thumb ___","Steer clear of","Puppies born together","Have lunch","Beginner","Not ever","School semester","Cleaning cloth"]},{"g":"EATS###ALIAS##COMPEL#HUB#RAN#DELETE##RENEW###TEXT","a":["Chows down","Fake name","Force","Wheel's center","Sprinted","Erase","Extend, as a library book","Phone message"],"d":["Every one","Out loud","Logger's cry","Maple tree fluid","Calm","Paint type","Little salamander","Allow"]},{"g":"###BASS##RURAL#MOTIVECAB#SEWUNUSED#RISEN##LATE###","a":["Low voice","Country","Reason for a crime","Taxi","Use a needle","Brand new","Up, like dough","Tardy"],"d":["However","Gotten up","Rescued","Lots","Strong","Craze","Bicep exercise","Look"]},{"g":"###CASH##MANIA#BANNERBID#AGEUSABLE#COMES##KNEE###","a":["Bills and coins","Craze","Big sign at a game","Auction offer","Birthday number","Workable","Arrives","Leg joint"],"d":["Soda container","Historical records","Castle attack","Tortoise's racer","Ma'am, in Paris","Buffalo","Male deer","Spelling contest"]},{"g":"###PLAN##BRAVE#HOODIEMIX#DADARISEN#TENOR##EDGY###","a":["Game ___","Fearless","Sweatshirt with a hood","Stir together","Pop","Gotten up","Singing voice","Nervous"],"d":["Expert","Firefighter's tool","Birdlike","Must have","Sport with gloves and a ring","Given the job","Buddy","Tofu bean"]},{"g":"###PUTT##GENIE#TRAUMAZOO#SIRERODED#SAVED##THEN###","a":["Golf tap","Wish granter","ER case","Animal park","Knight's title","Worn away","Rescued","After that"],"d":["Pod veggie","Brand new","Shy","Rip","Record track","Hebrew scripture","Lemon peel","Lion's home"]},{"g":"ECHO###ALOUD##ROSTER#NUT#RIB#DEVISE##LEVEL###TENT","a":["Canyon sound","Out loud","Team list","Squirrel's snack","Barbecue bone","Come up with","Flat","Campsite shelter"],"d":["Make, as money","Sky puff","Cheap place to stay","Not safe","Get from a source","Up, like dough","Pants holder-upper","Pet doctor"]},{"g":"###SENT##PIXIE#VORTEXTIN#ACTIODINE#ELECT##RARE###","a":["Mailed","Short haircut","Whirlpool","Can metal","Play part","Element in table salt","Vote in","Barely cooked"],"d":["Knight's title","Still around","Sister's daughter","Phone message","Think over","Big violin","Cake layer","Rink surface"]},{"g":"###MUCH##VENUE#SONATASKY#BIDLIABLE#ALGAE##BLED###","a":["A lot","Concert hall, e.g.","Piano piece","Where clouds float","Auction offer","Responsible","Pond scum","Ran, like dye"],"d":["Guys","Can't","Adorable one","Coach, e.g.","Sea trip","Talent","Concrete block","Not good"]},{"g":"###HASH##CASTE#FASTERHIS#REDANIMAL#RENAL##DROP###","a":["Corned beef ___","Social class","Quicker","Belonging to him","Stop sign color","Zoo resident","Of the kidneys","Let fall"],"d":["Owns","Of the stars","Strong metal","Group of cattle","Vegas place","More refined","Not easy","Road guide"]},{"g":"###HASH##VISTA#LETTERDEN#REDRADIAL#IVORY##PERK###","a":["Corned beef ___","View","Mail item","Lion's home","Stop sign color","Kind of tire","Piano key material","Job bonus"],"d":["Single or double","Off course","Strong metal","Not easy","Seller","Go away","Leaky faucet sound","Annoy"]},{"g":"VISA###ADORE##SERENE#TAR#GAG#LOCATE##WAGER###PERM","a":["Travel stamp","Love to pieces","Calm","Road goo","Joke","Find","Bet","Curly hairdo"],"d":["Huge","Perfect","Sadness","\"We ___ the champions\"","Take part","Picky ___","Bug that makes you sick","Baseball hat"]},{"g":"###FAST##TORAH#THRIVEORE#SEEDASHED#OCEAN##REST###","a":["Quick","Hebrew scripture","Flourish","Mine find","Look","Ran quickly","Atlantic, e.g.","Nap"],"d":["In favor of","Gotten up","Rescued","You, old-style","Big research papers","Copy over","Smell","Head topper"]},{"g":"###SPUR##PIANO#FOSSILOIL#TOEUNISON#RACER##SLEW###","a":["Cowboy boot add-on","Instrument with 88 keys","Dinosaur bone","Car fluid","Foot digit","All together","Speedster","Lots"],"d":["Bro's sibling","Church leader","Labor group","Part in a play","Cops","Last","Not yours","Use a needle"]}];
  const N = 7;
  const dayN = () => { const [y, m, d] = KEY.split("-").map(Number); return Math.round((Date.UTC(y, m - 1, d) - Date.UTC(2026, 10, 4)) / 864e5); };
  const pIdx = () => ((dayN() % PUZ.length) + PUZ.length) % PUZ.length;
  const rk = () => "bdd:den:midi:" + KEY + ":" + (me ? me.id : "");
  const rr = (c, x, y, w, h, r) => { c.beginPath(); if (c.roundRect) c.roundRect(x, y, w, h, r); else c.rect(x, y, w, h); };
  const mmss = t => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, "0")}`;
  const KB = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM<"];
  // 700 for solving + up to 300 for speed (fades over 15 minutes). Using Check costs 150.
  const scoreOf = s => Math.max(100, 700 + Math.round(300 * Math.max(0, 1 - s.el / 900)) - (s.checked ? 150 : 0));
  // Words: each has cells, a clue, a number and a direction. Built from the grid so clues line up with numbering.
  function words(p) {
    const blk = i => p.g[i] === "#", W = [], num = {}; let n = 0;
    for (let i = 0; i < N * N; i++) {
      if (blk(i)) continue; const r = Math.floor(i / N), c = i % N;
      const ac = (c === 0 || blk(i - 1)) && c + 2 < N && !blk(i + 1) && !blk(i + 2);
      const dn = (r === 0 || blk(i - N)) && r + 2 < N && !blk(i + N) && !blk(i + 2 * N);
      if (ac || dn) num[i] = ++n;
      if (ac) { const cells = []; for (let k = c; k < N && !blk(r * N + k); k++) cells.push(r * N + k); W.push({ dir: 0, cells, n }); }
      if (dn) { const cells = []; for (let k = r; k < N && !blk(k * N + c); k++) cells.push(k * N + c); W.push({ dir: 1, cells, n }); }
    }
    let a = 0, d = 0; W.forEach(w => { w.clue = w.dir ? p.d[d++] : p.a[a++]; });
    return { W, num };
  }
  defGame({
    key: "midi", name: "The Midi", icon: "📰", max: 1000, cat: "den", puzzle: true,
    blurb: "Daily: a 7×7 crossword. Bigger than the Mini.",
    how: "A 7×7 crossword, a step up from the Mini. Tap a square to pick it; tap it again to switch between Across and Down. The clue shows above the keyboard; tap the arrows on either side to jump between clues. Type to fill in. Check marks any wrong squares red, but it costs 150 points, so only if you're stuck. One puzzle a day, the same for everyone. Score: 700 for solving plus up to 300 for speed (it fades over 15 minutes).",
    reset(G) {
      const p = PUZ[pIdx()], { W, num } = words(p), s = G.s = { p, W, num, cur: 0, dir: 0, msg: "", msgT: 0, btns: [], postT: 0, wrong: [] };
      const r = store.get(rk());
      if (r && r.fill) Object.assign(s, { fill: r.fill, el: r.el || 0, done: r.done, posted: r.posted, checked: r.checked });
      else Object.assign(s, { fill: Array(N * N).fill(""), el: 0, done: false, checked: false });
      s.cur = W[0].cells.find(i => !s.fill[i]); if (s.cur === undefined) s.cur = W[0].cells[0];
    },
    persist(G) { const s = G.s; store.set(rk(), { fill: s.fill, el: s.el, done: s.done, posted: s.posted, checked: s.checked, score: s.done ? scoreOf(s) : 0 }); },
    word(s, i, dir) { return s.W.find(w => w.dir === dir && w.cells.includes(i)); },
    curWord(s) { return this.word(s, s.cur, s.dir) || this.word(s, s.cur, 1 - s.dir); },
    info(G) {
      const s = G.s, sc = scoreOf(s);
      return { score: sc, title: s.checked ? "Solved!" : "Solved it clean! 🐶",
        sub: `The Midi in ${mmss(s.el)}${s.checked ? " (used Check)" : ""}. ${sc} pts.`,
        share: `The Midi #${dayN() + 1} ⏱️ ${mmss(s.el)}${s.checked ? " ✔️" : ""}` };
    },
    jump(G, step) {
      const s = G.s, w = this.curWord(s), k = s.W.indexOf(w), nw = s.W[(k + step + s.W.length) % s.W.length];
      s.dir = nw.dir; s.cur = nw.cells.find(i => !s.fill[i]); if (s.cur === undefined) s.cur = nw.cells[0];
    },
    advance(G) {
      const s = G.s, w = this.curWord(s), at = w.cells.indexOf(s.cur);
      const nxt = w.cells.slice(at + 1).find(i => !s.fill[i]);
      if (nxt !== undefined) { s.cur = nxt; return; }
      if (w.cells.every(i => s.fill[i])) {
        // word full: go to the next word with a blank, if any
        for (let d = 1; d <= s.W.length; d++) { const nw = s.W[(s.W.indexOf(w) + d) % s.W.length], b = nw.cells.find(i => !s.fill[i]); if (b !== undefined) { s.dir = nw.dir; s.cur = b; return; } }
      } else if (at < w.cells.length - 1) s.cur = w.cells[at + 1];
    },
    press(G, k) {
      const s = G.s; if (s.done) return;
      if (k === "<") {
        if (s.fill[s.cur]) s.fill[s.cur] = "";
        else { const w = this.curWord(s), at = w.cells.indexOf(s.cur); if (at > 0) { s.cur = w.cells[at - 1]; s.fill[s.cur] = ""; } }
        s.wrong = s.wrong.filter(i => i !== s.cur); return this.persist(G);
      }
      s.fill[s.cur] = k; s.wrong = s.wrong.filter(i => i !== s.cur);
      if (s.fill.every((f, i) => s.p.g[i] === "#" || f)) {
        if (s.fill.every((f, i) => s.p.g[i] === "#" || f === s.p.g[i])) { s.done = true; s.postT = 1.2; s.msg = "Solved!"; s.msgT = 1.5; G.sfx("win"); this.persist(G); return; }
        s.msg = "Not quite. Something's off."; s.msgT = 1.8; G.buzz();
      }
      this.advance(G); this.persist(G);
    },
    check(G) {
      const s = G.s; if (s.done) return; s.checked = true;
      s.wrong = s.fill.map((f, i) => f && f !== s.p.g[i] ? i : -1).filter(i => i >= 0);
      s.msg = s.wrong.length ? `${s.wrong.length} square${s.wrong.length === 1 ? " is" : "s are"} wrong` : "Everything so far is right"; s.msgT = 1.8; this.persist(G);
    },
    update(G, dt) {
      const s = G.s;
      if (!s.done) { s.el += dt; s.ck = (s.ck || 0) + dt; if (s.ck > 2) { s.ck = 0; this.persist(G); } }
      if (s.msgT > 0) s.msgT -= dt;
      if (s.done && !s.posted && s.postT > 0) { s.postT -= dt; if (s.postT <= 0) { s.posted = true; this.persist(G); G.post(scoreOf(s), this.info(G)); } }
    },
    draw(G, c) {
      const s = G.s, dk = G.dark(), ink = dk ? "#fff" : "#121213", W = G.W, H = G.H; s.btns = [];
      c.fillStyle = dk ? "#121213" : "#fff"; c.fillRect(0, 0, W, H);
      const kbH = s.done ? 0 : Math.min(176, H * 0.27), clueH = 54, barH = 34;
      const size = Math.min(W - 24, H - kbH - clueH - barH - 24), cs = size / N, gx = (W - size) / 2, gy = barH + 4;
      // top bar: timer + check
      c.fillStyle = ink; c.font = `600 15px ${G.UI}`; c.textAlign = "left"; c.textBaseline = "middle"; c.fillText("⏱ " + mmss(s.el), 14, barH / 2 + 2);
      if (!s.done) s.btns.push(Object.assign(G.pill(c, W - 96, 4, 84, barH - 6, "Check"), { k: "chk" }));
      const w = s.done ? null : this.curWord(s);
      for (let i = 0; i < N * N; i++) {
        const r = Math.floor(i / N), col = i % N, x = gx + col * cs, y = gy + r * cs;
        if (s.p.g[i] === "#") { c.fillStyle = dk ? "#000" : "#121213"; c.fillRect(x, y, cs, cs); continue; }
        c.fillStyle = i === s.cur && !s.done ? "#ffda00" : w && w.cells.includes(i) ? (dk ? "#2e4a6b" : "#a7d8ff") : (dk ? "#1e1e20" : "#fff");
        c.fillRect(x, y, cs, cs);
        if (s.num[i]) { c.fillStyle = i === s.cur && !s.done ? "#121213" : ink; c.font = `500 ${Math.round(cs * 0.26)}px ${G.UI}`; c.textAlign = "left"; c.textBaseline = "top"; c.fillText(s.num[i], x + 2.5, y + 2); }
        if (s.fill[i]) {
          c.fillStyle = s.wrong.includes(i) ? "#e0312b" : s.done ? "#2b6cb0" : (i === s.cur ? "#121213" : ink);
          c.font = `600 ${Math.round(cs * 0.58)}px ${G.UI}`; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText(s.fill[i], x + cs / 2, y + cs * 0.58);
          if (s.wrong.includes(i)) { c.strokeStyle = "#e0312b"; c.lineWidth = 1.5; c.beginPath(); c.moveTo(x + 3, y + cs - 3); c.lineTo(x + cs - 3, y + 3); c.stroke(); }
        }
        s.btns.push({ x, y, w: cs, h: cs, cell: i });
      }
      c.strokeStyle = dk ? "#555" : "#121213"; c.lineWidth = 1;
      for (let k = 0; k <= N; k++) { c.beginPath(); c.moveTo(gx + k * cs, gy); c.lineTo(gx + k * cs, gy + size); c.stroke(); c.beginPath(); c.moveTo(gx, gy + k * cs); c.lineTo(gx + size, gy + k * cs); c.stroke(); }
      c.lineWidth = 2; c.strokeRect(gx, gy, size, size);
      const cy = s.done ? gy + size + 10 : Math.max(gy + size + 10, H - kbH - clueH + 2);
      if (!s.done) {
        // clue bar with prev / next
        c.fillStyle = dk ? "#2e4a6b" : "#dbeefe"; rr(c, 12, cy, W - 24, clueH - 6, 8); c.fill();
        c.fillStyle = ink; c.font = `700 22px ${G.UI}`; c.textAlign = "center"; c.textBaseline = "middle";
        c.fillText("‹", 30, cy + (clueH - 6) / 2); c.fillText("›", W - 30, cy + (clueH - 6) / 2);
        s.btns.push({ x: 12, y: cy, w: 40, h: clueH - 6, k: "prev" }, { x: W - 52, y: cy, w: 40, h: clueH - 6, k: "next" });
        const lab = `${w.n}${w.dir ? "D" : "A"}  ${w.clue}`; let sz = 16; for (; sz > 11; sz--) { c.font = `600 ${sz}px ${G.UI}`; if (c.measureText(lab).width < W - 110) break; }
        c.fillText(lab, W / 2, cy + (clueH - 6) / 2, W - 110);
        s.btns.push({ x: 52, y: cy, w: W - 104, h: clueH - 6, k: "flip" });
        const ky = H - kbH, kh = (kbH - 12) / 3 - 6, kw = (W - 12) / 10 - 5;
        KB.forEach((row, r) => {
          const keys = row.split(""), wide = k => k === "<" ? kw * 1.5 + 2.5 : kw;
          const tw = keys.reduce((a, k) => a + wide(k) + 5, -5); let x = (W - tw) / 2;
          keys.forEach(k => {
            const ww = wide(k), yy = ky + 4 + r * (kh + 6);
            rr(c, x, yy, ww, kh, 5); c.fillStyle = dk ? "#818384" : "#d3d6da"; c.fill();
            c.fillStyle = ink; c.font = `700 16px ${G.UI}`; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText(k === "<" ? "⌫" : k, x + ww / 2, yy + kh / 2 + 1);
            s.btns.push({ x, y: yy, w: ww, h: kh, key: k }); x += ww + 5;
          });
        });
      } else if (s.posted) {
        const bw = Math.min(240, W - 60); s.btns.push(Object.assign(G.pill(c, W / 2 - bw / 2, cy + 6, bw, 48, "See results", true), { k: "res" }));
      }
      if (s.msgT > 0 && s.msg) { c.save(); c.globalAlpha = Math.min(1, s.msgT * 2); c.font = `600 15px ${G.UI}`; const mw = c.measureText(s.msg).width + 30;
        c.fillStyle = ink; rr(c, W / 2 - mw / 2, gy + size / 2 - 19, mw, 38, 6); c.fill(); c.fillStyle = dk ? "#121213" : "#fff"; c.textAlign = "center"; c.fillText(s.msg, W / 2, gy + size / 2 + 1); c.restore(); }
    },
    tap(G, x, y) {
      const s = G.s, b = s.btns.find(b => x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h); if (!b) return;
      if (b.k === "res") return G.results(this.info(G));
      if (s.done) return;
      if (b.cell !== undefined) {
        if (b.cell === s.cur) { if (this.word(s, s.cur, 1 - s.dir)) s.dir = 1 - s.dir; }
        else { s.cur = b.cell; if (!this.word(s, s.cur, s.dir)) s.dir = 1 - s.dir; }
        return;
      }
      if (b.key) return this.press(G, b.key);
      if (b.k === "chk") return this.check(G);
      if (b.k === "prev") return this.jump(G, -1);
      if (b.k === "next") return this.jump(G, 1);
      if (b.k === "flip" && this.word(s, s.cur, 1 - s.dir)) s.dir = 1 - s.dir;
    },
    onKey(G, k, d) {
      if (!d) return; const s = G.s; if (s.done) return;
      if (k === "Backspace") return this.press(G, "<");
      if (/^[a-z]$/i.test(k)) return this.press(G, k.toUpperCase());
      if (k === "Enter" || k === "Tab") return this.jump(G, 1);
      const mv = { ArrowLeft: [0, -1], ArrowRight: [0, 1], ArrowUp: [1, -N], ArrowDown: [1, N] }[k];
      if (mv) { if (s.dir !== mv[0] && this.word(s, s.cur, mv[0])) { s.dir = mv[0]; return; } let i = s.cur + mv[1]; while (i >= 0 && i < N * N && s.p.g[i] === "#" && (mv[0] || Math.floor(i / N) === Math.floor(s.cur / N))) i += mv[1]; if (i >= 0 && i < N * N && s.p.g[i] !== "#" && (mv[0] || Math.floor(i / N) === Math.floor(s.cur / N))) s.cur = i; }
    }
  });
})();
