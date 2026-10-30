// ---------- Sports Groups (The Den, daily puzzle) ----------
// Like Groups, with sports categories. One go per day, 4 mistakes. Plays like the main four (puzzle mode).
(function () {
  const PUZ = [[["Golf scores",["BIRDIE","EAGLE","BOGEY","PAR"]],["NBA teams",["HEAT","JAZZ","MAGIC","SUNS"]],["Bowling terms",["STRIKE","SPARE","GUTTER","SPLIT"]],["___BALL sports",["HAND","FOOT","BASKET","DODGE"]]],[["Punches",["JAB","HOOK","UPPERCUT","CROSS"]],["MLB teams, minus the S",["CUB","MET","RAY","TIGER"]],["Tennis terms",["LOVE","DEUCE","ACE","LET"]],["Famous Michaels",["JORDAN","PHELPS","STRAHAN","VICK"]]],[["Soccer positions",["STRIKER","KEEPER","WINGER","SWEEPER"]],["Football penalties",["HOLDING","OFFSIDE","CLIPPING","FACEMASK"]],["NHL teams",["KINGS","STARS","BLUES","JETS"]],["Olympic host cities",["ATHENS","PARIS","TOKYO","LONDON"]]],[["Teams named for weather",["HEAT","THUNDER","LIGHTNING","AVALANCHE"]],["WNBA teams",["STORM","SKY","SUN","FEVER"]],["Golf clubs",["WEDGE","PUTTER","IRON","WOOD"]],["Team names that are also cars & trucks",["CHARGER","BRONCO","RAM","MUSTANG"]]],[["Holy team names",["SAINTS","ANGELS","PADRES","CARDINALS"]],["NHL teams",["DEVILS","KINGS","DUCKS","WILD"]],["NFL birds",["RAVENS","FALCONS","SEAHAWKS","EAGLES"]],["Teams named for jobs",["PACKERS","BREWERS","STEELERS","OILERS"]]],[["Cricket terms",["WICKET","OVER","BOWLER","INNINGS"]],["Volleyball",["DIG","SET","SPIKE","BUMP"]],["Sports slang that's food",["BAGEL","PANCAKE","TATER","MEATBALL"]],["Pitching roles",["ACE","CLOSER","STARTER","OPENER"]]],[["Basketball positions",["CENTER","GUARD","FORWARD","WING"]],["Hockey terms",["ICING","PUCK","CREASE","BLUE LINE"]],["On a football field",["HASH","PYLON","END ZONE","GOALPOST"]],["___BACK",["QUARTER","HALF","FULL","LINE"]]],[["In a boxing ring",["ROPES","BELL","CANVAS","STOOL"]],["Fishing",["CAST","REEL","LURE","HOOK"]],["Soccer",["HEADER","NUTMEG","CORNER","CROSS"]],["LEFT ___",["FIELD","WING","TACKLE","GUARD"]]],[["Things you can steal",["BASE","SIGNS","SHOW","SCENE"]],["Baseball stats",["RBI","ERA","OPS","WHIP"]],["Hoops slang",["BRICK","SWISH","DIME","AND ONE"]],["___ ROOM",["LOCKER","PRESS","WAR","WEIGHT"]]],[["The Masters",["GREEN JACKET","AMEN CORNER","AZALEAS","PIMENTO CHEESE"]],["Wimbledon",["STRAWBERRIES","ALL WHITE","CENTRE COURT","ROYAL BOX"]],["Kentucky Derby",["MINT JULEP","ROSES","BIG HATS","CHURCHILL"]],["Indy 500",["MILK","BRICKYARD","PAGODA","BORG-WARNER"]]],[["The Mannings",["PEYTON","ELI","ARCHIE","COOPER"]],["QB first names",["PATRICK","JOSH","LAMAR","JALEN"]],["Golfers' first names",["TIGER","RORY","SCOTTIE","PHIL"]],["Colts QBs",["LUCK","MANNING","UNITAS","RICHARDSON"]]],[["___ Bowl",["ROSE","SUGAR","ORANGE","COTTON"]],["___ Cup",["STANLEY","RYDER","DAVIS","WORLD"]],["___ Games",["OLYMPIC","X","PAN AM","COMMONWEALTH"]],["Tour de France jerseys",["YELLOW","GREEN","POLKA DOT","WHITE"]]],[["Old team names",["SONICS","BULLETS","EXPOS","WHALERS"]],["Cat teams",["LIONS","TIGERS","JAGUARS","PANTHERS"]],["College mascots",["BULLDOGS","HUSKIES","GATORS","WOLVERINES"]],["Teams with no S",["JAZZ","MAGIC","WILD","FIRE"]]],[["Horse racing",["FURLONG","TRIFECTA","PADDOCK","SILKS"]],["Fencing",["EPEE","FOIL","SABRE","LUNGE"]],["Gymnastics events",["VAULT","BEAM","RINGS","BARS"]],["___ HORSE",["DARK","TROJAN","CHARLEY","IRON"]]],[["Darts",["OCHE","BULLSEYE","TREBLE","FLIGHT"]],["Archery",["QUIVER","NOCK","ARROW","FLETCHING"]],["Pool hall",["CUE","RACK","BREAK","SCRATCH"]],["___ TIE",["BOLO","ZIP","NECK","BOW"]]],[["Skateboard tricks",["OLLIE","KICKFLIP","GRIND","MANUAL"]],["Surfing",["BARREL","WIPEOUT","HANG TEN","CUTBACK"]],["Skiing",["MOGUL","SLALOM","POWDER","CHAIRLIFT"]],["Cartoon dogs",["GOOFY","PLUTO","ODIE","SNOOPY"]]],[["Super Bowl MVP QBs",["AIKMAN","YOUNG","ELWAY","BRADY"]],["Famous Joes",["MONTANA","NAMATH","BURROW","FLACCO"]],["Hall of Fame RBs",["SANDERS","PAYTON","SMITH","DICKERSON"]],["Kickers",["VINATIERI","TUCKER","JANIKOWSKI","BUTKER"]]],[["Wore #23",["JORDAN","LEBRON","BECKHAM","DRAYMOND"]],["Wore #99",["GRETZKY","WATT","DONALD","JUDGE"]],["Wore #12",["BRADY","RODGERS","BRADSHAW","STAUBACH"]],["Wore #3",["RUTH","IVERSON","WADE","EARNHARDT"]]],[["Rugby",["SCRUM","TRY","RUCK","LINEOUT"]],["Lacrosse",["FACEOFF","CREASE","LONG POLE","RIDE"]],["Parts of a pool table",["RAIL","CUSHION","FELT","POCKET"]],["Baby gear",["CRADLE","CRIB","RATTLE","BOTTLE"]]],[["Cycling",["PELOTON","BREAKAWAY","SPRINT","DRAFT"]],["NFL Draft",["PICK","TRADE","MOCK","WAR ROOM"]],["Farm equipment",["TRACTOR","BALER","PLOW","COMBINE"]],["Comes in rounds",["BOXING","GOLF","AMMO","DRINKS"]]],[["Ballpark food",["HOT DOG","PRETZEL","NACHOS","CRACKER JACK"]],["At a tailgate",["CORNHOLE","GRILL","COOLER","CANOPY"]],["Backyard games",["HORSESHOES","LADDER BALL","KAN JAM","BOCCE"]],["___DOG",["BIG","TOP","UNDER","BULL"]]],[["Spurs dynasty",["DUNCAN","PARKER","GINOBILI","POPOVICH"]],["2008 Celtics",["PIERCE","GARNETT","ALLEN","RONDO"]],["Heatles",["LEBRON","WADE","BOSH","RILEY"]],["Warriors dynasty",["CURRY","THOMPSON","GREEN","KERR"]]],[["March Madness",["BRACKET","SWEET 16","UPSET","BUZZER BEATER"]],["Tournament formats",["ROUND ROBIN","SWISS","LADDER","KNOCKOUT"]],["Blue bloods",["KENTUCKY","DUKE","KANSAS","UNC"]],["Princesses",["CINDERELLA","ARIEL","BELLE","JASMINE"]]],[["Football plays",["BLITZ","SCREEN","DRAW","BOOTLEG"]],["Poker",["BLIND","RIVER","TURN","ANTE"]],["Refs hate these",["FLOP","DIVE","TRAVEL","CHARGE"]],["___ SHOT",["MUG","MOON","SLAP","JUMP"]]],[["Winter Olympic sports",["LUGE","SKELETON","BIATHLON","BOBSLED"]],["Halloween",["GHOST","WITCH","PUMPKIN","MUMMY"]],["Baseball gear",["BAT","GLOVE","HELMET","CLEATS"]],["Curling",["STONE","HOUSE","HAMMER","BROOM"]]],[["Hoops shots",["FLOATER","JUMPER","LAYUP","TEARDROP"]],["Swim events",["BACKSTROKE","FREESTYLE","BREASTSTROKE","MEDLEY"]],["Insects",["CRICKET","HORNET","BEETLE","BUTTERFLY"]],["Captain ___",["MORGAN","AMERICA","CRUNCH","HOOK"]]],[["Filmed in Indiana",["HOOSIERS","RUDY","BREAKING AWAY","A LEAGUE OF THEIR OWN"]],["Boxing movies",["ROCKY","CREED","RAGING BULL","CINDERELLA MAN"]],["Baseball movies",["MONEYBALL","SANDLOT","MAJOR LEAGUE","BULL DURHAM"]],["Football movies",["THE BLIND SIDE","WATERBOY","VARSITY BLUES","FRIDAY NIGHT LIGHTS"]]],[["NASCAR",["DRAFTING","CAUTION","POLE","LAP"]],["Racing flags",["GREEN","YELLOW","WHITE","CHECKERED"]],["Golf course",["FAIRWAY","BUNKER","ROUGH","TEE BOX"]],["___ PIT",["CHERRY","ARM","MOSH","BULL"]]],[["Nicknames",["THE MAILMAN","PRIME TIME","SWEETNESS","MR. OCTOBER"]],["Streaming sports",["PRIME","PEACOCK","ESPN+","PARAMOUNT+"]],["Candy bars",["BABY RUTH","PAYDAY","CLARK","MOUNDS"]],["Hall of Fame towns",["CANTON","COOPERSTOWN","SPRINGFIELD","TORONTO"]]],[["QB cadence",["HUT","HIKE","SET","OMAHA"]],["Volleyball",["DIG","BUMP","SPIKE","ACE"]],["Playing cards",["KING","QUEEN","JOKER","DEUCE"]],["___POT",["JACK","CROCK","HOT","TEA"]]],[["Sea creature teams",["MARLINS","DOLPHINS","KRAKEN","SHARKS"]],["Florida teams",["MAGIC","HEAT","PANTHERS","INTER MIAMI"]],["Detroit teams",["LIONS","TIGERS","PISTONS","RED WINGS"]],["___ TANK",["THINK","FISH","GAS","SEPTIC"]]],[["Hockey penalties",["HOOKING","TRIPPING","SLASHING","ROUGHING"]],["Golf shot shapes",["HOOK","SLICE","DRAW","FADE"]],["Pizza",["PIE","CRUST","PEPPERONI","DEEP DISH"]],["Haircuts",["MULLET","BUZZ","CREW","MOHAWK"]]],[["Track",["HURDLES","RELAY","BATON","SPRINT"]],["Marathon",["BIB","PACE","WALL","CORRAL"]],["Banana ___",["SPLIT","BREAD","BOAT","REPUBLIC"]],["Rodeo",["BRONC","LASSO","BARREL","CHUTE"]]],[["Halftime shows",["PRINCE","BEYONCE","RIHANNA","BRUNO"]],["Super Bowl snacks",["CHILI","NACHOS","QUESO","GUAC"]],["RED ___",["WINGS","SOX","ZONE","CARPET"]],["Wedding party",["USHER","BEST MAN","FLOWER GIRL","RING BEARER"]]],[["Dream Team",["JORDAN","BIRD","BARKLEY","EWING"]],["Famous Johnsons",["MAGIC","RANDY","JIMMIE","DUSTIN"]],["AIR ___",["BUD","FORCE ONE","GUITAR","HOCKEY"]],["Sesame Street",["BIG BIRD","ELMO","OSCAR","GROVER"]]],[["Ways to get on base",["WALK","ERROR","HIT","HOMER"]],["Music",["SINGLE","ALBUM","DEMO","TRACK"]],["Dog commands",["SIT","STAY","HEEL","FETCH"]],["Hotel rooms",["QUEEN","KING","SUITE","DOUBLE"]]],[["NFL coaches",["REID","TOMLIN","MCVAY","HARBAUGH"]],["Wide receivers",["HILL","JEFFERSON","CHASE","LAMB"]],["Baby animals",["CUB","KID","FAWN","FOAL"]],["Presidents",["WASHINGTON","LINCOLN","GRANT","MADISON"]]],[["Wrestling moves",["SUPLEX","HEADLOCK","TAKEDOWN","NELSON"]],["Sewing kit",["PIN","NEEDLE","THREAD","THIMBLE"]],["Wrestling legends",["CENA","HOGAN","THE ROCK","UNDERTAKER"]],["Rock, paper, ___",["ROCK","PAPER","SCISSORS","SHOOT"]]],[["Golf nicknames",["GOLDEN BEAR","THE KING","THE SHARK","LEFTY"]],["Nicknamed King",["LEBRON","FELIX","HENRIK","RICHARD"]],["City nicknames",["BIG APPLE","WINDY CITY","MOTOR CITY","BIG EASY"]],["GOLDEN ___",["STATE","KNIGHTS","GLOVE","BOOT"]]]];
  const COL = ["#f9df6d", "#a0c35a", "#b0c4ef", "#ba81c5"], EMO = ["🟨", "🟩", "🟦", "🟪"];
  const dayN = () => { const [y, m, d] = KEY.split("-").map(Number); return Math.round((Date.UTC(y, m - 1, d) - Date.UTC(2026, 9, 25)) / 864e5); };
  const pIdx = () => ((dayN() % PUZ.length) + PUZ.length) % PUZ.length;
  const rk = () => "bdd:den:sgroups:" + KEY + ":" + (me ? me.id : "");
  const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const rr = (c, x, y, w, h, r) => { c.beginPath(); if (c.roundRect) c.roundRect(x, y, w, h, r); else c.rect(x, y, w, h); };
  const mmss = t => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, "0")}`;
  // Chill scoring: solving is most of it; a speed bonus fades over a few minutes and never goes negative.
  const speed = (sec, limit, pts) => Math.round(pts * Math.max(0, 1 - sec / limit));
  // Mistakes matter most (like the main Groups); time is only a small tiebreaker. A miss still beats nothing.
  const scoreOf = s => s.won ? 900 - 100 * s.mist + speed(s.el, 600, 100) : 50 + 100 * s.found;
  function fitText(c, str, x, y, w, maxSz, col, one) {
    c.fillStyle = col; c.textAlign = "center"; c.textBaseline = "middle";
    const lines = !one && str.length > 9 && str.includes(" ") ? str.split(" ") : [str];
    const ln = lines.length > 2 ? [lines.slice(0, Math.ceil(lines.length / 2)).join(" "), lines.slice(Math.ceil(lines.length / 2)).join(" ")] : lines;
    let sz = maxSz; for (; sz > 9; sz--) { c.font = `700 ${sz}px ${G.UI}`; if (ln.every(l => c.measureText(l).width <= w)) break; }
    ln.forEach((l, i) => c.fillText(l, x, y + (i - (ln.length - 1) / 2) * sz * 1.1));
  }
  defGame({
    key: "sgroups", name: "Sports Groups", icon: "🏟️", max: 1000, cat: "den", puzzle: true,
    blurb: "Daily: find four groups of four, sports edition.",
    how: "Find four groups of four sports things that share something. Tap four tiles, then Submit. Watch for tiles that seem to fit more than one group. Gold is the easiest group, then green, blue, and purple. You get 4 mistakes and one go per day. Score: a solve is 900, minus 100 per mistake, plus a small bonus (up to 100) for going quick, so a perfect solve beats a fast sloppy one. Missing it is 50, plus 100 per group you found. No clock on screen, so take your time.",
    reset(G) {
      const p = PUZ[pIdx()], s = G.s = { p, sel: [], msg: "", msgT: 0, shake: 0, btns: [], postT: 0 };
      const r = store.get(rk());
      if (r && r.order) Object.assign(s, { order: r.order, solved: r.solved, mist: r.mist, el: r.el, guesses: r.guesses || [], done: r.done, won: r.won, found: r.found || 0, posted: r.posted, score: r.score || 0 });
      else Object.assign(s, { order: shuffle(p.flatMap(g => g[1])), solved: [], mist: 0, el: 0, guesses: [], done: false, won: false, found: 0 });
    },
    persist(G) { const s = G.s; store.set(rk(), { order: s.order, solved: s.solved, mist: s.mist, el: s.el, guesses: s.guesses, done: s.done, won: s.won, found: s.found, posted: s.posted, score: s.done ? scoreOf(s) : 0 }); },
    info(G) {
      const s = G.s, grid = s.guesses.map(k => k.split("|").map(w => EMO[s.p.findIndex(g => g[1].includes(w))]).join("")).join("\n");
      return { score: scoreOf(s), grid,
        title: !s.won ? "Next time!" : s.mist ? "Solved it!" : "Perfect! 🐶",
        sub: s.won ? `All four groups with ${s.mist} mistake${s.mist === 1 ? "" : "s"} in ${mmss(s.el)}. ${scoreOf(s)} pts.` : `You found ${s.found} of 4 groups. ${scoreOf(s)} pts.`,
        share: `Sports Groups #${dayN() + 1} ${s.won ? (s.mist ? s.mist + " mistake" + (s.mist > 1 ? "s" : "") : "perfect") : "X"}\n${grid}` };
    },
    finish(G, won) {
      const s = G.s; s.done = true; s.won = won; s.found = s.solved.length;
      if (!won) for (let g = 0; g < 4; g++) if (!s.solved.includes(g)) s.solved.push(g);
      s.order = []; s.sel = []; s.postT = 1.4; this.persist(G);
      G.sfx(won ? "win" : "lose"); s.msg = !won ? "Next time!" : s.mist ? "Nice!" : "Perfect!"; s.msgT = 1.4;
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
        s.mist++; s.shake = 0.4; G.buzz(); s.msg = close ? "One away..." : "Not quite"; s.msgT = 1.6;
        if (s.mist >= 4) return this.finish(G, false);
      }
      this.persist(G);
    },
    update(G, dt) {
      const s = G.s;
      if (!s.done) { s.el += dt; s.ck = (s.ck || 0) + dt; if (s.ck > 2) { s.ck = 0; this.persist(G); } }
      if (s.msgT > 0) s.msgT -= dt; if (s.shake > 0) s.shake -= dt;
      if (s.done && !s.posted && s.postT > 0) { s.postT -= dt; if (s.postT <= 0) { s.posted = true; this.persist(G); G.post(scoreOf(s), this.info(G)); } }
    },
    layout(G) { const top = 46, gap = 8, w = (G.W - 24 - gap * 3) / 4, h = Math.min(76, (G.H - top - 160) / 4 - gap); return { top, gap, w, h }; },
    draw(G, c) {
      const s = G.s, dk = G.dark(), L = this.layout(G), ink = dk ? "#fff" : "#121213";
      c.fillStyle = dk ? "#121213" : "#ffffff"; c.fillRect(0, 0, G.W, G.H);
      c.fillStyle = ink; c.font = `500 16px ${G.UI}`; c.textAlign = "center"; c.textBaseline = "middle";
      c.fillText(s.done ? (s.won ? "Solved!" : "The groups were:") : "Create four groups of four!", G.W / 2, 22);
      let y = L.top;
      s.solved.forEach(g => {
        const cat = s.p[g]; c.fillStyle = COL[g]; rr(c, 12, y, G.W - 24, L.h, 8); c.fill();
        fitText(c, cat[0].toUpperCase(), G.W / 2, y + L.h * 0.34, G.W - 40, 16, "#121213", true);
        c.font = `400 ${Math.min(15, L.h * 0.22)}px ${G.UI}`; c.fillStyle = "#121213"; c.fillText(cat[1].join(", "), G.W / 2, y + L.h * 0.68, G.W - 30);
        y += L.h + L.gap;
      });
      const off = s.shake > 0 ? Math.sin(s.shake * 60) * 5 : 0; s.btns = [];
      s.order.forEach((wd, i) => {
        const col = i % 4, row = Math.floor(i / 4), x = 12 + col * (L.w + L.gap), yy = y + row * (L.h + L.gap), on = s.sel.includes(wd), dx = on ? off : 0;
        c.fillStyle = on ? "#5a594e" : (dk ? "#3a3a3c" : "#efefe6"); rr(c, x + dx, yy, L.w, L.h, 8); c.fill();
        fitText(c, wd, x + L.w / 2 + dx, yy + L.h / 2, L.w - 8, 16, on ? "#fff" : ink);
        s.btns.push({ x, y: yy, w: L.w, h: L.h, wd });
      });
      y = L.top + 4 * (L.h + L.gap) + 4;
      if (!s.done) {
        c.fillStyle = ink; c.font = `400 15px ${G.UI}`; c.textAlign = "right"; c.fillText("Mistakes remaining:", G.W / 2 + 30, y + 14);
        for (let i = 0; i < 4 - s.mist; i++) { c.fillStyle = "#5a594e"; c.beginPath(); c.arc(G.W / 2 + 46 + i * 20, y + 14, 7, 0, 7); c.fill(); }
        const bw = (G.W - 24 - 16) / 3, by = y + 40;
        s.btns.push(Object.assign(G.pill(c, 12, by, bw, 48, "Shuffle"), { k: "shuf" }));
        s.btns.push(Object.assign(G.pill(c, 20 + bw, by, bw, 48, "Deselect all", false, !s.sel.length), { k: "clr" }));
        s.btns.push(Object.assign(G.pill(c, 28 + 2 * bw, by, bw, 48, "Submit", s.sel.length === 4, s.sel.length !== 4), { k: "go" }));
      } else if (s.posted) {
        const bw = Math.min(240, G.W - 60); s.btns.push(Object.assign(G.pill(c, G.W / 2 - bw / 2, y + 20, bw, 48, "See results", true), { k: "res" }));
      }
      if (s.msgT > 0 && s.msg) { c.save(); c.globalAlpha = Math.min(1, s.msgT * 2); c.font = `600 15px ${G.UI}`; const w = c.measureText(s.msg).width + 30;
        c.fillStyle = dk ? "#fff" : "#121213"; rr(c, G.W / 2 - w / 2, 54, w, 38, 6); c.fill(); c.fillStyle = dk ? "#121213" : "#fff"; c.textAlign = "center"; c.fillText(s.msg, G.W / 2, 74); c.restore(); }
    },
    tap(G, x, y) {
      const s = G.s, b = s.btns.find(b => x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h); if (!b) return;
      if (b.k === "res") return G.results(this.info(G));
      if (s.done) return;
      if (b.wd) { const i = s.sel.indexOf(b.wd); if (i >= 0) s.sel.splice(i, 1); else if (s.sel.length < 4) s.sel.push(b.wd); }
      else if (b.k === "shuf") shuffle(s.order);
      else if (b.k === "clr") s.sel = [];
      else if (b.k === "go") this.submit(G);
    },
    onKey(G, k, d) { if (d && k === "Enter") this.submit(G); }
  });
})();
