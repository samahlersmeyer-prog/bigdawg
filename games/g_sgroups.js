// ---------- Sports Groups (The Den, daily) ----------
// A daily sports grouping puzzle: find four groups of four. One try per day, 4 mistakes allowed.
(function () {
  const PUZ = [[["Golf scores",["BIRDIE","EAGLE","BOGEY","PAR"]],["NBA teams",["HEAT","JAZZ","MAGIC","SUNS"]],["Bowling terms",["STRIKE","SPARE","GUTTER","SPLIT"]],["___BALL sports",["HAND","FOOT","BASKET","DODGE"]]],[["Punches",["JAB","HOOK","UPPERCUT","CROSS"]],["MLB teams, minus the S",["CUB","MET","RAY","TIGER"]],["Tennis terms",["LOVE","DEUCE","ACE","LET"]],["Famous Michaels",["JORDAN","PHELPS","STRAHAN","VICK"]]],[["Soccer positions",["STRIKER","KEEPER","WINGER","SWEEPER"]],["Football penalties",["HOLDING","OFFSIDE","CLIPPING","FACEMASK"]],["NHL teams",["KINGS","STARS","BLUES","JETS"]],["Olympic host cities",["ATHENS","PARIS","TOKYO","LONDON"]]],[["Basketball moves",["CROSSOVER","LAYUP","DUNK","ALLEY-OOP"]],["Horse racing",["FURLONG","TRIFECTA","JOCKEY","DERBY"]],["Super Bowl QBs",["BRADY","MANNING","MAHOMES","ELWAY"]],["Track events",["HURDLES","RELAY","SPRINT","MARATHON"]]],[["NFL teams",["BEARS","LIONS","RAMS","COLTS"]],["Pitches",["SLIDER","CURVE","SINKER","CUTTER"]],["Golf clubs",["DRIVER","WEDGE","PUTTER","IRON"]],["Skate park features",["RAMP","RAIL","BOWL","HALFPIPE"]]],[["Golfers' first names",["TIGER","PHIL","RORY","SCOTTIE"]],["Hockey terms",["SLAPSHOT","ICING","POWER PLAY","FACEOFF"]],["MLB teams",["ORIOLES","ROYALS","PADRES","MARINERS"]],["Played over a net",["TENNIS","VOLLEYBALL","BADMINTON","PICKLEBALL"]]],[["Wrestling moves",["SUPLEX","PIN","HEADLOCK","TAKEDOWN"]],["College mascots",["BUCKEYE","HOOSIER","BADGER","WOLVERINE"]],["Volleyball moves",["SPIKE","SET","DIG","BUMP"]],["___BACK",["QUARTER","HALF","FULL","LINE"]]],[["NBA first names",["SHAQ","KOBE","LEBRON","STEPH"]],["Pool hall",["CUE","BREAK","SCRATCH","CHALK"]],["Football scoring",["SAFETY","TOUCHDOWN","FIELD GOAL","CONVERSION"]],["___ Bowl",["ROSE","SUGAR","ORANGE","COTTON"]]],[["Gymnastics events",["VAULT","BEAM","RINGS","BARS"]],["Skiing",["SLALOM","MOGUL","CHAIRLIFT","POWDER"]],["NBA teams",["KNICKS","BULLS","NETS","SPURS"]],["Home run slang",["DINGER","TATER","MOONSHOT","BOMB"]]],[["Racing terms",["PIT","POLE","LAP","DRAFT"]],["Grand Slam cities",["LONDON","PARIS","NEW YORK","MELBOURNE"]],["Football formations",["SHOTGUN","PISTOL","WILDCAT","SPREAD"]],["Dog breed college mascots",["BULLDOG","HUSKY","TERRIER","SALUKI"]]],[["Baseball stats",["RBI","ERA","OPS","WAR"]],["Football O-line and ends",["CENTER","GUARD","TACKLE","END"]],["Soccer clubs",["ARSENAL","CHELSEA","BARCELONA","JUVENTUS"]],["Famous racehorses",["SECRETARIAT","SEABISCUIT","JUSTIFY","SEATTLE SLEW"]]],[["Played with a stick",["HOCKEY","LACROSSE","POLO","HURLING"]],["Boxing ___weight",["FLY","BANTAM","WELTER","HEAVY"]],["Legendary NFL coaches",["BELICHICK","REID","LOMBARDI","SHULA"]],["Parts of a golf hole",["ROUGH","BUNKER","FAIRWAY","GREEN"]]],[["NBA teams",["GRIZZLIES","HAWKS","RAPTORS","BUCKS"]],["Swim strokes",["FREESTYLE","BACKSTROKE","BREASTSTROKE","BUTTERFLY"]],["Darts terms",["BULLSEYE","OCHE","TREBLE","FLIGHT"]],["Kinds of kicks",["PUNT","ONSIDE","SQUIB","DROP"]]],[["On a baseball field",["MOUND","PLATE","DUGOUT","BULLPEN"]],["Soccer legends",["PELE","MESSI","RONALDO","MARADONA"]],["Throwing events",["SHOT PUT","DISCUS","JAVELIN","HAMMER"]],["AFC West teams, minus the S",["CHIEF","RAIDER","CHARGER","BRONCO"]]],[["Hockey positions",["GOALIE","DEFENSEMAN","CENTER","WINGER"]],["Ways to make an out",["STRIKEOUT","FLYOUT","GROUNDOUT","TAG"]],["Tennis greats",["FEDERER","NADAL","DJOKOVIC","SERENA"]],["Sports movies",["RUDY","ROCKY","HOOSIERS","MIRACLE"]]],[["Basketball violations",["TRAVEL","CHARGE","GOALTEND","CARRY"]],["NFL bird teams",["EAGLES","RAVENS","FALCONS","CARDINALS"]],["Martial arts",["KARATE","JUDO","TAEKWONDO","JIU-JITSU"]],["Sets of three",["HAT TRICK","TRIPLE CROWN","TRIFECTA","THREE-PEAT"]]],[["Surfing",["WAVE","BARREL","WIPEOUT","HANG TEN"]],["Basketball shots",["HOOK SHOT","FLOATER","JUMPER","BANK SHOT"]],["Baseball positions, short",["SS","CF","RF","DH"]],["Famous trophies",["STANLEY CUP","LOMBARDI","CLARET JUG","GREEN JACKET"]]],[["Soccer terms",["CORNER","PENALTY","HEADER","CROSS"]],["Golf course talk",["MULLIGAN","FORE","CADDIE","DIVOT"]],["Hockey penalties",["HOOKING","TRIPPING","SLASHING","ROUGHING"]],["___ Zone",["END","RED","NEUTRAL","TWILIGHT"]]],[["Ways to score a bucket",["DUNK","LAYUP","THREE","FREE THROW"]],["Rugby terms",["SCRUM","TRY","RUCK","LINEOUT"]],["Famous ballparks",["WRIGLEY","FENWAY","LAMBEAU","YANKEE"]],["Played on a court",["TENNIS","SQUASH","HANDBALL","PICKLEBALL"]]],[["Ref's gear",["WHISTLE","FLAG","STRIPES","CARD"]],["Sports families",["MANNING","KELCE","WATT","HARBAUGH"]],["Fantasy football",["WAIVER","FLEX","BYE","DRAFT"]],["Olympic sports ending in -ING",["BOXING","ROWING","CURLING","FENCING"]]],[["Marathon talk",["BIB","PACE","SPLIT","WALL"]],["NFL Hall of Famers",["SANDERS","RICE","PAYTON","TAYLOR"]],["Baseball legends",["RUTH","AARON","MAYS","GEHRIG"]],["Hoops slang",["BRICK","SWISH","DIME","AND ONE"]]],[["Golf shots",["CHIP","PITCH","PUTT","DRIVE"]],["Ump calls",["STRIKE","BALL","SAFE","OUT"]],["Stadium snacks",["HOT DOG","NACHOS","PRETZEL","PEANUTS"]],["NHL teams",["BRUINS","CANUCKS","FLYERS","OILERS"]]],[["In a boxing ring",["ROPES","CORNER","BELL","CANVAS"]],["Football plays",["BLITZ","SCREEN","DRAW","BOOTLEG"]],["NBA MVPs",["JOKIC","CURRY","DURANT","NASH"]],["___ Cup",["WORLD","STANLEY","RYDER","DAVIS"]]],[["Bowling talk",["TURKEY","FRAME","PIN","LANE"]],["World Cup winners",["BRAZIL","GERMANY","ITALY","ARGENTINA"]],["Skateboard tricks",["OLLIE","KICKFLIP","GRIND","MANUAL"]],["___ Shot",["SLAP","JUMP","MOON","HOOK"]]],[["Things you swing",["BAT","RACKET","CLUB","STICK"]],["College conferences",["BIG TEN","SEC","ACC","PAC-12"]],["Defenses",["ZONE","MAN","PRESS","BOX AND ONE"]],["___ Kick",["FREE","BICYCLE","CORNER","GOAL"]]],[["Tennis shots",["SERVE","VOLLEY","LOB","SMASH"]],["Winter Olympic sports",["BOBSLED","LUGE","SKELETON","BIATHLON"]],["NBA teams",["CELTICS","LAKERS","WARRIORS","CLIPPERS"]],["___ Play",["POWER","FAIR","DOUBLE","SCREEN"]]],[["Box score stats",["POINTS","REBOUNDS","ASSISTS","STEALS"]],["Shoe brands",["NIKE","ADIDAS","PUMA","REEBOK"]],["QB first names",["PEYTON","TOM","PATRICK","AARON"]],["Golf scores that are birds",["BIRDIE","EAGLE","ALBATROSS","CONDOR"]]],[["On a football field",["HASH MARK","GOALPOST","PYLON","SIDELINE"]],["Racing series",["NASCAR","INDYCAR","F1","RALLY"]],["Tumbling",["HANDSTAND","CARTWHEEL","ROUNDOFF","SPLITS"]],["Chicago teams",["BEARS","BULLS","CUBS","BLACKHAWKS"]]],[["Hockey gear",["PUCK","SKATES","PADS","MASK"]],["Wrestling legends",["HOGAN","THE ROCK","CENA","UNDERTAKER"]],["Racket sports",["TENNIS","SQUASH","BADMINTON","PADEL"]],["___ season",["PRE","OFF","POST","REGULAR"]]],[["How fights end",["KO","TKO","DECISION","SUBMISSION"]],["Base hits",["SINGLE","DOUBLE","TRIPLE","HOMER"]],["Hockey legends",["GRETZKY","LEMIEUX","ORR","HOWE"]],["Big ___",["TEN","EAST","SKY","DAWG"]]]];
  const COL = ["#f9df6d", "#a0c35a", "#b0c4ef", "#ba81c5"];
  const dayN = () => { const [y, m, d] = KEY.split("-").map(Number); return Math.round((Date.UTC(y, m - 1, d) - Date.UTC(2026, 9, 25)) / 864e5); };
  const pIdx = () => ((dayN() % PUZ.length) + PUZ.length) % PUZ.length;
  const rk = () => "bdd:den:sgroups:" + KEY + ":" + (me ? me.id : "");
  const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const rr = (c, x, y, w, h, r) => { c.beginPath(); if (c.roundRect) c.roundRect(x, y, w, h, r); else c.rect(x, y, w, h); };
  const scoreOf = s => s.solved.length === 4 ? Math.max(100, 600 - 100 * s.mist + Math.max(0, 300 - Math.floor(s.el))) : 100 * s.solved.length;
  function fitText(c, str, x, y, w, maxSz, col, one) {
    c.fillStyle = col; c.textAlign = "center"; c.textBaseline = "middle";
    let sz = maxSz; const lines = !one && str.length > 9 && str.includes(" ") ? str.split(" ") : [str];
    const ln = lines.length > 2 ? [lines.slice(0, Math.ceil(lines.length / 2)).join(" "), lines.slice(Math.ceil(lines.length / 2)).join(" ")] : lines;
    for (; sz > 9; sz--) { c.font = `800 ${sz}px system-ui, -apple-system, sans-serif`; if (ln.every(l => c.measureText(l).width <= w)) break; }
    ln.forEach((l, i) => c.fillText(l, x, y + (i - (ln.length - 1) / 2) * sz * 1.1));
  }
  defGame({
    key: "sgroups", name: "Sports Groups", icon: "🏟️", max: 1000, cat: "den",
    blurb: "Daily: find 4 groups of 4 sports things.",
    how: "A new puzzle every day. Tap 4 tiles that share a sports connection, then SUBMIT. Four mistakes and you're out. One try per day. Score: solve it = 600, minus 100 per mistake, plus a speed bonus (up to 300). Miss it = 100 per group found.",
    reset(G) {
      const p = PUZ[pIdx()], s = G.s = { p, sel: [], msg: "", msgT: 0, shake: 0, btns: [], endT: 0, over: false };
      const r = store.get(rk());
      if (r && r.order) Object.assign(s, { order: r.order, solved: r.solved, mist: r.mist, el: r.el, guesses: r.guesses || [], done: r.done });
      else Object.assign(s, { order: shuffle(p.flatMap(g => g[1])), solved: [], mist: 0, el: 0, guesses: [], done: false });
      if (s.done) s.endT = 2.4;
    },
    persist(G) { const s = G.s; store.set(rk(), { order: s.order, solved: s.solved, mist: s.mist, el: s.el, guesses: s.guesses, done: s.done, score: s.done ? scoreOf(s) : 0 }); },
    finish(G, won) {
      const s = G.s; s.done = true;
      if (!won) for (let g = 0; g < 4; g++) if (!s.solved.includes(g)) s.solved.push(g);
      s.lost = !won; s.order = []; s.sel = []; s.endT = 3; this.persist(G);
      if (won) { G.sfx("win"); s.msg = s.mist ? "Nice!" : "Perfect! 🐶"; } else { G.sfx("lose"); s.msg = "Next time!"; } s.msgT = 3;
    },
    submit(G) {
      const s = G.s; if (s.sel.length !== 4 || s.done) return;
      const key = s.sel.slice().sort().join("|");
      if (s.guesses.includes(key)) { s.msg = "Already guessed!"; s.msgT = 1.6; return; }
      s.guesses.push(key);
      const hit = s.p.findIndex(g => s.sel.every(w => g[1].includes(w)));
      if (hit >= 0) {
        s.solved.push(hit); s.order = s.order.filter(w => !s.sel.includes(w)); s.sel = []; G.sfx("pop");
        if (s.solved.length === 4) return this.finish(G, true);
      } else {
        const close = s.p.some(g => s.sel.filter(w => g[1].includes(w)).length === 3);
        s.mist++; s.shake = 0.4; G.buzz(); s.msg = close ? "One away..." : "Nope."; s.msgT = 1.6;
        if (s.mist >= 4) { s.finalMist = true; return this.finish(G, false); }
      }
      this.persist(G);
    },
    update(G, dt) {
      const s = G.s;
      if (!s.done) { s.el += dt; s.ck = (s.ck || 0) + dt; if (s.ck > 2) { s.ck = 0; this.persist(G); } }
      if (s.msgT > 0) s.msgT -= dt; if (s.shake > 0) s.shake -= dt;
      if (s.done && s.endT > 0) { s.endT -= dt; if (s.endT <= 0 && !s.over) { s.over = true; G.over(scoreOf(s), s.lost ? "Next time!" : s.mist ? "Solved it!" : "Perfect! 🐶"); } }
    },
    layout(G) {
      const top = 44, gap = 7, w = (G.W - 16 - gap * 3) / 4, h = Math.min(72, (G.H - top - 150) / 4 - gap);
      return { top, gap, w, h };
    },
    draw(G, c) {
      const s = G.s, dk = G.dark(), L = this.layout(G);
      c.fillStyle = dk ? "#121213" : "#ffffff"; c.fillRect(0, 0, G.W, G.H);
      G.hud(c, "SPORTS", `#${dayN() + 1}`, `${Math.floor(s.el / 60)}:${String(Math.floor(s.el % 60)).padStart(2, "0")}`);
      let y = L.top;
      s.solved.forEach(g => {
        const cat = s.p[g]; c.fillStyle = COL[g]; rr(c, 8, y, G.W - 16, L.h, 8); c.fill();
        c.fillStyle = "#111"; c.textAlign = "center"; c.textBaseline = "middle";
        fitText(c, cat[0].toUpperCase(), G.W / 2, y + L.h * 0.33, G.W - 40, 16, "#111", true);
        c.font = `500 ${Math.min(14, L.h * 0.22)}px system-ui, sans-serif`; c.fillStyle = "#222";
        c.fillText(cat[1].join(", "), G.W / 2, y + L.h * 0.68, G.W - 30);
        y += L.h + L.gap;
      });
      const off = s.shake > 0 ? Math.sin(s.shake * 60) * 5 : 0;
      s.btns = [];
      s.order.forEach((wd, i) => {
        const col = i % 4, row = Math.floor(i / 4), x = 8 + col * (L.w + L.gap), yy = y + row * (L.h + L.gap), on = s.sel.includes(wd);
        c.fillStyle = on ? (dk ? "#d8d8d0" : "#5a594e") : (dk ? "#3a3a3c" : "#efefe6"); rr(c, x + (on ? off : 0), yy, L.w, L.h, 8); c.fill();
        fitText(c, wd, x + L.w / 2 + (on ? off : 0), yy + L.h / 2, L.w - 8, 15, on ? (dk ? "#111" : "#fff") : (dk ? "#fff" : "#111"));
        s.btns.push({ x, y: yy, w: L.w, h: L.h, wd });
      });
      y = L.top + 4 * (L.h + L.gap) + 6;
      if (!s.done) {
        G.text(c, "MISTAKES LEFT", G.W / 2 - 40, y + 10, 10, dk ? "#ccc" : "#555");
        for (let i = 0; i < 4; i++) { c.fillStyle = i < 4 - s.mist ? (dk ? "#ddd" : "#5a594e") : "rgba(128,128,128,0.25)"; c.beginPath(); c.arc(G.W / 2 + 50 + i * 18, y + 10, 6, 0, 7); c.fill(); }
        const bw = (G.W - 16 - 16) / 3, by = y + 30, labels = [["SHUFFLE", "shuf"], ["DESELECT", "clr"], ["SUBMIT", "go"]];
        labels.forEach(([t, k], i) => {
          const x = 8 + i * (bw + 8), act = k !== "go" || s.sel.length === 4;
          c.strokeStyle = dk ? "#ddd" : "#333"; c.lineWidth = 2; c.fillStyle = k === "go" && act ? (dk ? "#fff" : "#111") : "transparent";
          rr(c, x, by, bw, 46, 23); c.fill(); c.stroke();
          G.text(c, t, x + bw / 2, by + 23, 10, k === "go" && act ? (dk ? "#111" : "#fff") : (dk ? "#ddd" : "#333"));
          s.btns.push({ x, y: by, w: bw, h: 46, k });
        });
      } else G.text(c, s.lost ? "SEE YOU TOMORROW" : `SCORE ${scoreOf(s)}`, G.W / 2, y + 26, 13, dk ? "#ffd23f" : "#b8860b");
      if (s.msgT > 0 && s.msg) { c.save(); c.globalAlpha = Math.min(1, s.msgT * 2); c.font = "700 15px system-ui, sans-serif"; const w = c.measureText(s.msg).width + 30;
        c.fillStyle = dk ? "#fff" : "#111"; rr(c, G.W / 2 - w / 2, G.H * 0.08 + 30, w, 34, 8); c.fill(); c.fillStyle = dk ? "#111" : "#fff"; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText(s.msg, G.W / 2, G.H * 0.08 + 47); c.restore(); }
      G.hint(c, "TAP 4 THAT GO TOGETHER", 3, G.H - 24);
    },
    tap(G, x, y) {
      const s = G.s; if (s.done) return;
      const b = s.btns.find(b => x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h); if (!b) return;
      if (b.wd) { const i = s.sel.indexOf(b.wd); if (i >= 0) s.sel.splice(i, 1); else if (s.sel.length < 4) { s.sel.push(b.wd); G.sfx("pop"); } }
      else if (b.k === "shuf") shuffle(s.order);
      else if (b.k === "clr") s.sel = [];
      else if (b.k === "go") this.submit(G);
    },
    onKey(G, k, d) { if (d && k === "Enter") this.submit(G); }
  });
})();
