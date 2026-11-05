// ---------- Dawg Waffle (The Den, daily puzzle) ----------
// A waffle-shaped grid of 6 five-letter words (3 across, 3 down), all letters scrambled. Swap tiles to fix it.
// Every board can be solved in 10 swaps; you get 15. Each spare swap at the end is a star (up to 5).
(function () {
  const PUZ = [["BURSTUOOYACHTEKAROYAL","BOOSLKORYYCUTEARATHAU"],["QUEUEUXLELITESLCTREAT","XEUAUUTETLESLELCQRIET"],["BOARDAMISWIFTINCCLOTH","FOBLIDAISMCCTIAWNROTH"],["TRACTOLWPEACEIRECOMET","ECTCLOTWPECETIAOEAMRR"],["BLADEAMVTABLECERHURRY","EBALRAMHTYDLCEEURVARB"],["VAPORILESTUFFTMEAMBER","VRBOPALETEISFTMERUAFM"],["PRIMELNAACTORIETNORTH","MENPLEOAICTRRIHTNRATO"],["BLENDALETIDALCEAHURRY","RLAEUHLETIDANBYLACDRE"],["BLUNTASASHARKIGECLEAN","BSINTALCSLARUHEAEKAGN"],["STACKHUNRODEOUIWGROWN","RKTCUWUNNOREHWIAGSODO"],["PEARLLLAACTORNEGTHREE","CRHELLEAAPTRARGNTLOEE"],["NEEDSONTTODAYCELHEDGE","NEODTOHETASYDCDLNEEEG"],["STAIRUDUPEDALEEERADAR","STRIDRAEAEUALDERDPEAU"],["HYPERUUHMARRYASMNIECE","REPMYUUHMEENYAACRIRHS"],["EMBERARAGREETEAIRODEO","EADEAEREOMEEBRIAROTRG"],["TRAILAGISERUMTEIEVENT","EETULEGISARIETARTVINM"],["TRAPSIWIGUARDHRETREND","TARPRIWATUSDRHGENDERI"],["ENTRYXHEAROMACSSTHEFT","HAASYTROXREMFNHSTEECT"],["GOODSIUPVAGUEEHENOTED","TDGASOUEEOIUEPHGNVOED"],["THEREOXNWRISTESELATER","IREHSENEWXRSTETRLAOET"],["TRAILRMAAPPLYPLESPEAR","TRIEPALAMRPLPSPYLAEAR"],["VAGUEORNGRAPEUSMEMPTY","ASPREUVPYOGNRUAMEMETG"],["CRAMPALLNAIVEAEALINED","CNLMALNIRVADEAEALPAEI"],["SLACKIDNGRAVEHPETOTAL","SDPCNALKAGATEIHETOVLR"],["STANDEMRTRIBEUNSPROPS","BNDNAESRRPIREUTPTMOSS"],["AISLEWWAFLOATURELINEN","AELISWEEFAONTIRLLAUWN"],["DIRTYOEIUSAGEGLLHUMID","GIRTYAESULLOMDGDIUEIH"],["CLAIMIVAGLORYAIBRIDGE","ALAVLIRCGIOIDYBMRIGAE"],["BLANDARESTEEPENTSMASH","AAALDPSERETEMENBHNSST"],["WORKSOOUROBINSONENTRY","WSIKSYRNRNBTOOOUENOOR"],["TEENSARPSTATETSNEVENT","ENTEPREVSTETANSTASENT"],["VOGUEILLSCENETACADMIT","VMSLTULCCNAOEEEGADIIT"],["STEELIXAGLASSHCETUTOR","CEELLHXTGTAIRSSESTAOU"],["LEMONIEEVERGEEGDDRESS","EEEIMNLEGEREDOGEDRSSV"],["MACROERUAGINGNMHTREAT","MRAAOMRCUHINGARGNTETE"],["ARMEDLOATHORNEDCRHYME","ROMAELOAMHYENRRCTHDED"],["PHASEORNWHEREENMREADY","RSPREOMNWNEYAEHHERADE"],["PORCHRIOORDEROESFORCE","IDECSROEOROPRHEFORRCO"],["BOOTHLLOEXISTSVESPELL","HEOLSSEOEVILTBTPXOLSL"],["BLENDAXRSPITEELASTEAM","MLERSAASTXIDBELETNEAP"],["SCOUTTNEALIENIOSRINSE","TILUSTNESEEINACOOSNIR"],["BRAINONINAIVEUMCSCENE","ERAIIBANECVIEUCNOMNNS"],["WAISTINHTUTORCEEHORSE","WAETTSNETRRSHICEUOHOI"],["SHALEEDARADARUELMUDDY","SUDUADEAMALDREELRADHY"],["STORYTCIUNCLEFULFIRED","SETFYOTUUICLNERLICRFD"],["OCEANNROSHAFTESCTEETH","ESNENCTOSAHFTAEREOCTH"],["LIMITEAIMIGHTOILNICHE","LHEGIMIIOILTTENMIICHA"],["COUGHRNIOCCURSLESPEED","CODIHSGRLPCURSONEEEUC"],["CURVEIURVIGORIBOLAYER","GERVUIARRVIOCRBOLEIUY"],["AFTERGRUREALMEIOENTER","EERRRTTUGNALFEIEEAOMR"],["FLOURIPIBLESSERKREADY","DLSUIIORBELSKERRPEYAF"],["CLOUDYWOCRIEDLNGEAGLE","ULYCDGOOELIRWDAGENCLE"],["TEMPOOOTPOUCHISECLEAR","TUEAMOPTSOLCPIEHCOERO"],["CRANEOGVVOICEENRRUGBY","UIVREOARVGNEENRGCCOBY"],["FORTHOAERIVALUELMANGO","NAURALHERIVOMGELOOTFA"],["MARCHIEUCHARMRCOOUTER","CAUCHOEURMIRMERCROTHA"],["SWEEPTAEEIGHTEETPARTY","RAHEEPWTGIPTTEETYAESE"],["RISENOIUUNDERGESHEDGE","EEDHNNIOIRUURGESDSEGE"],["WORKSHIEELDERAGVTHEME","REVESEGOEADERKHLTHIMW"],["CORALREUONIONSGCSINGH","COCARGNGOHEORSSIUINLN"],["RISENELOSKIRTEDETREND","ENSSIEKOELETTRDRNRIDE"],["STRAPPIILADENIECTORCH","RCPARDCILIEENSIATTPOH"],["WITCHARAGIANTEICSINGH","RETTCAHAGIINGAISIWCNH"],["BROOMOUOOWNERTCASTEEL","BREOTOUNCWASOOOEETRML"],["BEARDARAGROWNEMCLEASE","BSERERDAWGNAAOMCLRAEE"],["PRESSILULYINGOTATHEIR","PRASTREITYIGLOSNLHUIE"],["COUCHORUALBUMCAOHONOR","UORCCHOUAUHAMCBOLOORN"],["STAKETBREMBERAEOMAYOR","OBAERABRMKEYREETMASOT"],["BEASTOFHOUTERSEETHROW","TEOSTREWOUEEHHSFTARBO"],["SOLIDOAEUNDERTEBHANDY","DIDOAUBEENNHRTASEOLDY"],["BEASTAGHGRACEEIILINER","BAAICREHGETLENISIAGER"],["PLACEAMMSCOOPTNTANGRY","NYTCGAMLRCSAPOTNAPOEM"],["BOOSTOLIWAISTLVLSIEGE","BIOEVSLIETOWSLTLAISGO"],["WIDTHEEAINPUTROCDITCH","IHITUEEDRCWHTPODAITCN"],["FIRSTAUIVALIDOEARURAL","RURAAAVSFALIDREIIULOT"],["SHELLTLIURBANNOETOWER","ERTSLNILBWAUNEOTLOHER"],["POWERLAAASSETZTEAMEND","POEREAAATWSETSEZMLDNA"],["ALBUMNREGLASSLSSESSAY","SLSASNMYGLABSLEUAESSR"],["STIFFPMLLEASEIGETHEFT","TIFFLLTEPTASEEGEMHSFI"],["VALVEOYACLIPSANELEGAL","LACEAGAEILOPSVNELVAYL"],["ANGLEWIAFAVORUETLUNCH","ANOAEGNLVALCRWETIUHUF"],["BURSTAOOSOUNDINASADLY","AIRSUBAOLOSNDTNAODUYS"],["COLOROEACRAFTOVEAHEAD","FTROEOEACRCADALAOHEVO"],["BLISSRMEAPARTSGUSLEEP","BLPEURPSIRSMTAGESLESA"],["ONSETRTIBLOOMIRETUMOR","OBMETOMIOITLUTRERSNOR"],["THICKIRNGROVEENEROYAL","AHINRIGLENRVETOEKOYRC"],["POUCHLTAALTARNESTORCH","RTHCHPEAALUTROTSONLCA"],["FROSTERRVIDEOEELRURAL","ERFSAVRRIEELDEOURORTL"],["BREADAQESKULLIAASILLY","LSBADIQLSKUAELEAAIRYL"],["SCARFONALEGITAETRALLY","SCENFLRAOERATALALGTIY"],["AMENDRXEMETERERBDIARY","DYDENRXEMRIEEETRBAARM"],["SLEPTPAUOFTENIEELINED","TLEPNEDUFTLEEIPIOANES"],["FIREDOOARAPIDUEDMESSY","SIDEROSDMAFDAIEPREUOY"],["SQUADTLEOFTENORSLEAVE","OQULLEERONSEFTDTESAVA"],["LATERAHIBRINGENHLIGHT","LNNBRAEIGEIHLTAHHIRGT"],["SHIRTCNAROPESAUTPETTY","SRERTOAAYPTUPSETNICTH"],["SNAKEHLXROASTURRGAMMA","LAAAKHMXROSNTREAGUSMR"],["ELBOWXUHCANOEENELOYAL","ELOWHEUYNBNOCXLAEOEAL"],["RESETETENOISEENNWAGES","EAEEOTEGERISNENTWSNES"],["POLARLYIAPRONIISNICHE","POICRIYAIRLONAHSNELPI"],["CLAMPAWLBLADELRAENDED","ADEEPLWMCDBALLRAENDLA"],["MEDALAWAJEANSOREREFER","DEEOAAALJEWANSRREEFMR"],["BLUESUNTRAINYNTLTHEME","BIUSEUMERETAYLTLTNNHN"],["FIFTHIREGRAINHMCTHESE","FEFIHTHMGERIRAECTNHSI"],["ALLOWSUOHONOREARSPRAY","LEUAOSOLWONOHARRSYRAP"],["CIVICLARAPPLESOEHIRED","CHORALERPPCVDAIEILIES"],["CRUDELNAOWINGTOLHINGE","CRWOIGDAUTIELNOEHLNGN"],["NEWEROOARAVENTEGHENCE","NGWTROEECNEENAOAREVHE"],["BURNTOAWWHITELSESLEPT","BLRUAEETWHNSOWTLPIEST"],["BLACKAGACHAIROIMNINJA","BOACARGCAHMIKANINALJI"],["RIGIDARRPROSEIAADENIM","IIARNDERRDOAEIGSIRAPM"],["THUMBRNRUNITESOETUNED","TTNMERERETIUHSONDUUBN"],["ASHESUIEDONORIGVTHERE","AEHOIOSEEVNERIRUTHDGS"],["CIDERLRIALONGSNHSWEET","INTERESRCLOANSDHGWLEI"],["FIBERORACLEANAEGLODGE","LEAILFRACEOANGERGDEBO"],["CUBICOALMACROEOSSENSE","NCEIUOMSAACBSROSLOEEC"],["SALTYOIENINJAIERCANON","SALNNCYNEINJIAEIOATRO"],["TRAITIWEGRAINHRSTHESE","REAEIIAWGEHHNRTSTTISR"],["DUSTYRUEALPHAMERAPRON","DSTYERUUALNHPERMPAROA"],["ALPHARRLGROWLUPEESSAY","OLSAAUSEERGWLPPRHRLAY"],["VIRUSAAILODGEIIGDRONE","DRVISAAIEOLIGRIOUDGNE"],["CARGOUOTBLUNTINECEDAR","GARAETUOBUNNCIOETDLCR"],["STORMOROBEGUNEATRANCH","MBOGSAERTOHRNUOTRANCE"],["SCRUBTAAALTARNIODROWN","ACRNBTWTROUAANLIDSORA"],["VIRUSIUUTIMERAOGLARGE","OTVULRUIIAMERARGIESGU"],["ADMITDEHMOTTOIARNYLON","OIMITDYHNNTMOLAOEATRD"],["CANALOOUROBINPLASPEAR","PAARLASULOBRNIONOCEAP"],["LOGICOROCHOIRAAPLINKS","CKGILIHOLAOORIAPNOCRS"],["JUMBOEETAUDITNAESOLAR","LSEUMEJTORDNTAAEBOAIU"],["MAGICEAUARMORNMVTRACE","MGAEAEACRRMCRVMATIUON"],["AUDIOSYTSMITHENETIGER","ITSTUNYSAMIODEHETEGIR"],["WHOLEIXIDYINGODHWHEAT","WHYXAIOIDNWOGLDEEHTIH"],["PEDALIRETYINGCFAHOTEL","RLGANCDETYPIAIFLHETEO"],["CHARMRRAARRAYWOOLOWER","OARWERROMRAHYWAOLCRAR"],["BEACHLRAANGERSUSTEETH","BLECHTATESGAAHUSRENER"],["ADMINROURIVEROISWHERE","WINMDEOVRRIRSUIOAHERE"],["BEACHRHEOPERAOAVMUDDY","AOEAHDEAOPERUHMVRDCBY"],["DOUBTEPAPUPILOEETURNS","POUETEPDUOSBLAPTIERNU"],["SHARPTVIALONEFICFUDGE","RSTHCUVPEALNEFIIFGDOA"],["YACHTOAAUSUALNSEGUESS","SGCUTESHUSANLOYEAASAU"],["CHIRPODACLEAROATALLEY","AOAOPHDRCLLRTAECIALEY"],["GRANTUIUEASELSLISLEEP","LLRNTUIEEGSIAASEELUSP"],["DEVILEIOBADLYUEATROLL","IOYEDEDITARLLLEALBOUV"],["FOCALRLEOMEGANRRTOKEN","LAONORCEOMRGANEKTRELF"],["ALLOWPEAADAPTRRCTENTH","TRLOTLAWADARAPTCEEPNH"],["CLASSANUBEGUNLENEARLY","CNESANAGBARUELLLSNUEY"],["TURNSUIULIVERIAGPULSE","SAURUSIULIVLTUEGPRINE"],["LEASTAWHBRAVOERSLEDGE","EESOBAEALRVHDTRALEGSW"],["SHIRTHNHOWNERREETHROW","SENHTHNRIWOHRRWHTEOER"],["METALUWISTINGICHCHEAT","UETTLIAISEMIAGCHHCNWT"]];
  const CELLS = []; for (let r = 0; r < 5; r++) for (let c = 0; c < 5; c++) if (!(r % 2 && c % 2)) CELLS.push([r, c]);
  const at = {}; CELLS.forEach(([r, c], i) => { at[r * 5 + c] = i; });
  const WORDS = [0, 2, 4].map(r => [0, 1, 2, 3, 4].map(c => at[r * 5 + c])).concat([0, 2, 4].map(c => [0, 1, 2, 3, 4].map(r => at[r * 5 + c])));
  const MAXS = 15;
  const dayN = () => { const [y, m, d] = KEY.split("-").map(Number); return Math.round((Date.UTC(y, m - 1, d) - Date.UTC(2026, 10, 4)) / 864e5); };
  const pIdx = () => ((dayN() % PUZ.length) + PUZ.length) % PUZ.length;
  const rk = () => "bdd:den:waffle:" + KEY + ":" + (me ? me.id : "");
  const rr = (c, x, y, w, h, r) => { c.beginPath(); if (c.roundRect) c.roundRect(x, y, w, h, r); else c.rect(x, y, w, h); };
  const stars = s => s.won ? Math.min(5, MAXS - s.used) : 0;
  // Solved: 500 + 100 per star. Out of swaps: 10 per green tile.
  const scoreOf = s => s.won ? 500 + 100 * stars(s) : 10 * s.cur.split("").filter((ch, i) => ch === s.sol[i]).length;
  function colors(cur, sol) {
    const col = cur.split("").map((ch, i) => ch === sol[i] ? 2 : 0);
    WORDS.forEach(w => {
      const left = {}; w.forEach(i => { if (col[i] !== 2) left[sol[i]] = (left[sol[i]] || 0) + 1; });
      w.forEach(i => { if (col[i] !== 2 && left[cur[i]] > 0) { left[cur[i]]--; col[i] = 1; } });
    });
    return col;
  }
  defGame({
    key: "waffle", name: "Dawg Waffle", icon: "🧇", max: 1000, cat: "den", puzzle: true,
    blurb: "Daily: swap letters to fix six words.",
    how: "The waffle holds six five-letter words: three across and three down. Every letter is already on the board, just in the wrong spots. Tap a tile, then tap another to swap them. Green means right letter, right spot (it locks). Yellow means that letter belongs somewhere else in its row or column (tiles where words cross count for both). Gray means it's not in that row or column. Every board can be solved in 10 swaps and you get 15; each swap you have left when you finish is a star, up to 5. One board a day. Score: 500 for solving plus 100 per star. Run out of swaps and you get 10 per green tile.",
    reset(G) {
      const [sol, start] = PUZ[pIdx()], s = G.s = { sol, sel: -1, msg: "", msgT: 0, btns: [], postT: 0, anim: null };
      const r = store.get(rk());
      if (r && r.cur) Object.assign(s, { cur: r.cur, used: r.used, done: r.done, won: r.won, posted: r.posted });
      else Object.assign(s, { cur: start, used: 0, done: false, won: false });
    },
    persist(G) { const s = G.s; store.set(rk(), { cur: s.cur, used: s.used, done: s.done, won: s.won, posted: s.posted, score: s.done ? scoreOf(s) : 0 }); },
    info(G) {
      const s = G.s, sc = scoreOf(s), col = colors(s.cur, s.sol), st = stars(s);
      const sq = [0, 1, 2, 3, 4].map(r => [0, 1, 2, 3, 4].map(c => at[r * 5 + c] === undefined ? "⬜" : col[at[r * 5 + c]] === 2 ? "🟩" : col[at[r * 5 + c]] === 1 ? "🟨" : "⬛").join("")).join("\n");
      return { score: sc, grid: sq,
        title: s.won ? (st === 5 ? "Perfect waffle! 🐶" : "Waffle fixed!") : "Out of swaps",
        sub: s.won ? `${s.used} swaps · ${"⭐".repeat(st) || "no stars"} · ${sc} pts.` : `So close. ${sc} pts.`,
        share: `Dawg Waffle #${dayN() + 1} ${s.won ? st + "/5 ⭐" : "X"}\n${sq}` };
    },
    swap(G, a, b) {
      const s = G.s, t = s.cur.split(""); [t[a], t[b]] = [t[b], t[a]]; s.cur = t.join(""); s.used++; s.anim = { a, b, t: 0.18 };
      if (s.cur === s.sol) { s.done = s.won = true; s.postT = 1.4; s.msg = stars(s) === 5 ? "Perfect!" : "Solved!"; s.msgT = 1.5; G.sfx("win"); }
      else if (s.used >= MAXS) { s.done = true; s.postT = 1.8; s.msg = "Out of swaps"; s.msgT = 1.8; G.sfx("lose"); }
      else G.sfx("pop");
      this.persist(G);
    },
    update(G, dt) {
      const s = G.s; if (s.msgT > 0) s.msgT -= dt; if (s.anim) { s.anim.t -= dt; if (s.anim.t <= 0) s.anim = null; }
      if (s.done && !s.posted && s.postT > 0) { s.postT -= dt; if (s.postT <= 0) { s.posted = true; this.persist(G); G.post(scoreOf(s), this.info(G)); } }
    },
    draw(G, c) {
      const s = G.s, dk = G.dark(), ink = dk ? "#fff" : "#121213", W = G.W, H = G.H; s.btns = [];
      c.fillStyle = dk ? "#121213" : "#fff"; c.fillRect(0, 0, W, H);
      const col = s.done && !s.won ? s.sol.split("").map(() => 2) : colors(s.cur, s.sol), show = s.done && !s.won ? s.sol : s.cur;
      const size = Math.min(W - 64, H - 220, 380), gap = size * 0.03, ts = (size - 4 * gap) / 5, gx = (W - size) / 2, gy = Math.max(70, (H - size) / 2 - 50);
      // waffle base
      c.fillStyle = dk ? "#5c4a2e" : "#f1cf8a"; rr(c, gx - gap * 2, gy - gap * 2, size + gap * 4, size + gap * 4, ts * 0.3); c.fill();
      c.fillStyle = ink; c.font = `600 15px ${G.UI}`; c.textAlign = "center"; c.textBaseline = "middle";
      c.fillText(s.done ? (s.won ? `Solved in ${s.used} swaps` : "Here's how it went:") : "Tap two tiles to swap them", W / 2, gy - 34);
      CELLS.forEach(([r, cc], i) => {
        const x = gx + cc * (ts + gap), y = gy + r * (ts + gap), k = col[i];
        let sc = 1; if (s.anim && (i === s.anim.a || i === s.anim.b)) sc = 0.88;
        const w = ts * sc, ox = x + (ts - w) / 2, oy = y + (ts - w) / 2;
        rr(c, ox, oy, w, w, ts * 0.16);
        c.fillStyle = k === 2 ? "#6fb05c" : k === 1 ? "#e9ba3a" : (dk ? "#5a5a5e" : "#dcdcd7"); c.fill();
        if (i === s.sel) { c.lineWidth = 4; c.strokeStyle = "#ff5c8a"; c.stroke(); }
        c.fillStyle = k ? "#fff" : (dk ? "#fff" : "#121213"); c.font = `800 ${Math.round(ts * 0.52)}px ${G.UI}`;
        c.fillText(show[i], x + ts / 2, y + ts / 2 + 2);
        if (!s.done && k !== 2) s.btns.push({ x, y, w: ts, h: ts, tile: i });
      });
      const by = gy + size + gap * 2 + 26;
      if (!s.done) {
        c.fillStyle = ink; c.font = `800 30px ${G.UI}`; c.fillText(MAXS - s.used, W / 2, by + 6);
        c.font = `500 14px ${G.UI}`; c.fillStyle = dk ? "#aaa" : "#666"; c.fillText("swaps left", W / 2, by + 32);
        c.fillText("Solvable in 10 · finish with 5 left for ⭐⭐⭐⭐⭐", W / 2, by + 56);
      } else {
        c.font = `30px ${G.UI}`; c.fillText(s.won ? "⭐".repeat(stars(s)) + "☆".repeat(5 - stars(s)) : "", W / 2, by + 6);
        if (s.posted) { const bw = Math.min(240, W - 60); s.btns.push(Object.assign(G.pill(c, W / 2 - bw / 2, by + 34, bw, 48, "See results", true), { k: "res" })); }
      }
      if (s.msgT > 0 && s.msg) { c.save(); c.globalAlpha = Math.min(1, s.msgT * 2); c.font = `600 15px ${G.UI}`; const mw = c.measureText(s.msg).width + 30;
        c.fillStyle = ink; rr(c, W / 2 - mw / 2, gy + size / 2 - 19, mw, 38, 6); c.fill(); c.fillStyle = dk ? "#121213" : "#fff"; c.fillText(s.msg, W / 2, gy + size / 2 + 1); c.restore(); }
    },
    tap(G, x, y) {
      const s = G.s, b = s.btns.find(b => x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h);
      if (!b) { s.sel = -1; return; }
      if (b.k === "res") return G.results(this.info(G));
      if (s.done || b.tile === undefined) return;
      if (s.sel < 0) { s.sel = b.tile; return; }
      if (s.sel === b.tile) { s.sel = -1; return; }
      const a = s.sel; s.sel = -1;
      if (s.cur[a] === s.cur[b.tile]) { s.sel = b.tile; return; } // same letter: just move the selection, no swap spent
      this.swap(G, a, b.tile);
    }
  });
})();
