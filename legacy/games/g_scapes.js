function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
(function () {
  var PUZ = [["RCMEHO", [["CHROME", 0, 3, 0], ["CORE", 0, 3, 1], ["MORE", 0, 7, 1], ["ORE", 3, 5, 0], ["COME", 2, 5, 1], ["HERO", 5, 4, 0], ["ECHO", 1, 0, 0], ["HOME", 3, 0, 0], ["HER", 3, 0, 1], ["ROE", 5, 0, 0]], "chore comer emo hem homer meh ohm orc rho"], ["ADSEYT", [["STEADY", 2, 0, 0], ["EAST", 2, 2, 1], ["DAYS", 2, 4, 1], ["SET", 5, 0, 0], ["DAY", 0, 5, 1], ["DATE", 0, 5, 0], ["EASY", 0, 8, 1], ["SAY", 4, 2, 0], ["YES", 0, 0, 1], ["STAY", 5, 4, 0]], "ads ate aye dates dye dyes eat eats eta sad sat sate sated sea seat stayed stead sty tad tea teas yea yeast yet"], ["VEREDIS", [["REVISED", 1, 2, 0], ["SERVED", 0, 7, 1], ["SIDE", 5, 5, 0], ["SERVE", 3, 4, 0], ["DRIVE", 0, 2, 1], ["EVER", 4, 0, 0], ["SEE", 3, 0, 1], ["RIDE", 0, 5, 1], ["RED", 0, 0, 0], ["RISE", 4, 3, 1]], "deer derive derives desire devise dire dis dive diver divers diverse dives dries drives ere eve ides ids ire reds reed reeds reside rev revise revs rid rides seed seer sever sieve sir sire sired veer veers verse versed vie vied vise"], ["AROIGLL", [["GORILLA", 3, 0, 0], ["ROLL", 0, 5, 1], ["RAIL", 1, 3, 1], ["GIRL", 3, 0, 1], ["AGO", 3, 6, 1], ["LOG", 6, 0, 0], ["AIR", 1, 1, 0], ["GOAL", 5, 5, 0], ["ILL", 3, 8, 1], ["OIL", 1, 5, 0]], "all gal gall gill grail grill lag lair largo liar lira oar oral rag rig"], ["IGIWNND", [["WINDING", 2, 0, 0], ["DINING", 1, 4, 1], ["WIND", 4, 3, 0], ["DIN", 4, 6, 1], ["WING", 6, 1, 0], ["WIN", 2, 0, 1], ["INN", 1, 2, 1], ["DIG", 5, 2, 1], ["WIG", 0, 6, 1]], "ding wining"], ["AGIFMRN", [["FARMING", 4, 0, 0], ["FAIR", 4, 0, 1], ["FAN", 2, 5, 1], ["FAR", 2, 2, 1], ["MAN", 4, 3, 1], ["GAIN", 4, 6, 1], ["FIRM", 2, 5, 0], ["RING", 7, 4, 0], ["MAIN", 2, 8, 1], ["AIR", 0, 7, 1]], "aim arm arming fain fang faring farm fig fin fir framing grain gram grim grin mar margin nag rag rain ram ran rang rig rim"], ["UOCCLIN", [["COUNCIL", 0, 0, 0], ["COIL", 0, 0, 1], ["LION", 3, 0, 0], ["ICON", 0, 5, 1], ["COIN", 2, 2, 1], ["CON", 5, 0, 0], ["NIL", 3, 5, 0], ["OIL", 1, 7, 1], ["ION", 3, 6, 1]], "colic conic loci loin"], ["SECDENT", [["DESCENT", 6, 0, 0], ["SCENE", 2, 1, 1], ["NEEDS", 4, 0, 0], ["SEND", 2, 1, 0], ["SENT", 3, 6, 1], ["TEN", 0, 3, 1], ["END", 4, 6, 0], ["NEED", 1, 8, 1], ["SET", 0, 1, 0], ["SEEN", 1, 5, 0]], "cede cent cents decent den dens dense dent dents ends nest nested net nets scent scented sect see seed steed tee teed teen teens tees tend tends tens tense tensed"], ["GLOYOIB", [["BIOLOGY", 0, 1, 0], ["BLOG", 0, 1, 1], ["LOGO", 0, 4, 1], ["BOO", 3, 3, 0], ["OILY", 3, 5, 1], ["LOG", 5, 5, 0], ["BOIL", 3, 3, 1], ["BOY", 2, 0, 0], ["GOO", 0, 6, 1], ["BIG", 3, 7, 1]], "bog glib glob gob igloo lib lob oil yogi"], ["IACPTAL", [["CAPITAL", 4, 0, 0], ["PAT", 4, 2, 1], ["CLIP", 3, 6, 1], ["ACT", 3, 0, 1], ["LIT", 2, 4, 1], ["TAIL", 2, 1, 0], ["TAP", 6, 2, 0], ["CAP", 3, 6, 0], ["PIT", 6, 6, 0], ["CAT", 0, 1, 1]], "apt clap lap lip pact pail pal pica pita plait talc tic tip"], ["SOFETF", [["OFFSET", 2, 1, 0], ["FOES", 2, 2, 1], ["TOES", 2, 6, 1], ["FOE", 4, 4, 0], ["SOFT", 2, 4, 1], ["OFF", 0, 3, 1], ["SET", 5, 2, 0], ["OFFS", 0, 3, 0], ["TOE", 4, 0, 0]], "fest oft sot"], ["ASAULST", [["ASSAULT", 2, 0, 0], ["LASTS", 1, 0, 1], ["SALTS", 5, 0, 0], ["ATLAS", 1, 6, 1], ["ALAS", 0, 3, 1], ["LAST", 0, 2, 0], ["SALT", 4, 5, 0], ["SAT", 2, 8, 1]], "lass lusts salsa slats"], ["SERMEGE", [["EMERGES", 5, 2, 0], ["MERGE", 1, 2, 1], ["EMERGE", 2, 2, 0], ["MERE", 0, 5, 1], ["GEMS", 0, 3, 0], ["SEEM", 4, 4, 1], ["GERMS", 7, 1, 0], ["GEESE", 1, 7, 1], ["GEM", 1, 0, 0], ["SEE", 5, 8, 1]], "ems ere erg gee gees germ meg merges mes seer serge"], ["NROUJI", [["JUNIOR", 0, 0, 0], ["JOIN", 0, 0, 1], ["IRON", 2, 0, 0], ["ION", 0, 3, 1], ["RUIN", 0, 5, 1], ["OUR", 2, 2, 1], ["NOR", 3, 5, 0], ["RUN", 4, 2, 0]], "urn"], ["INCEPST", [["INSPECT", 4, 2, 0], ["SPENT", 0, 8, 1], ["NICE", 1, 6, 1], ["STEP", 4, 4, 1], ["SINCE", 3, 2, 1], ["SITE", 2, 5, 0], ["ICE", 7, 0, 0], ["ITS", 3, 0, 0], ["TEN", 5, 0, 0], ["SENT", 0, 1, 1]], "cent cents cite cites epic epics ices inept ins insect inset nest net nets nicest nip nips nit pecs pectin pen pens pent pest pet pets pie pies pin pine pines pins pint pints pit pits scent sect septic set sic sin sine sip sit snip snipe spec spice spin spine spit spite stein tens tic tics tie ties tin tine tins tip tips"], ["KEINTA", [["INTAKE", 2, 0, 0], ["TANK", 2, 2, 1], ["TAKEN", 5, 0, 0], ["TEN", 1, 5, 1], ["TEA", 0, 3, 1], ["TAKE", 1, 5, 0], ["ATE", 0, 2, 0], ["NET", 3, 5, 0], ["TIE", 1, 0, 1], ["KIT", 1, 7, 1]], "akin ant ante anti eat eta ink ken kin kite knit neat nit tan teak tin tine"], ["EPESCI", [["PIECES", 2, 0, 0], ["PIECE", 0, 2, 1], ["SPICE", 0, 1, 0], ["PIE", 2, 0, 1], ["EPIC", 4, 2, 0], ["SIC", 2, 5, 1], ["PIES", 4, 3, 1], ["ICE", 6, 1, 0], ["SIP", 5, 1, 1], ["SEE", 7, 3, 0]], "epics ices pecs seep spec specie"], ["LPSEAM", [["SAMPLE", 2, 0, 0], ["MALE", 2, 2, 1], ["MALES", 4, 0, 0], ["SAME", 2, 0, 1], ["SEAL", 4, 4, 1], ["MAPS", 6, 3, 0], ["MAP", 0, 3, 1], ["PALM", 0, 0, 0], ["SEA", 1, 5, 1], ["SALE", 1, 5, 0]], "ale ales alms amp ample amps ape apes asp elm elms ems lam lame lamp lamps lap laps lapse lea leap leaps maple maples mas meal meals mes mesa pal pale pales palms pals pas pea peal peas plea pleas psalm sap seam slam slap spa spam"], ["DMLEOS", [["SELDOM", 4, 0, 0], ["MODELS", 2, 3, 1], ["MODE", 4, 5, 1], ["SOLD", 4, 0, 1], ["MODEL", 2, 3, 0], ["LOSE", 2, 7, 1], ["DOES", 7, 0, 0], ["SOME", 1, 1, 1], ["OLD", 0, 5, 1], ["LED", 6, 3, 0]], "demo demos doe dole dome domes dos dose elm elms emo ems lode meld mes mod modes mods mold molds mole moles ode odes sled sod sol sole"], ["EFIGNR", [["FRINGE", 5, 1, 0], ["FIRE", 4, 3, 1], ["FINGER", 2, 5, 1], ["RING", 3, 4, 0], ["REIGN", 0, 7, 1], ["GRIEF", 1, 1, 1], ["GRIN", 1, 1, 0], ["RIG", 7, 5, 0], ["FIG", 0, 3, 1], ["FINE", 7, 0, 0]], "erg feign fen fer fern fie fin finer fir infer ire ref rein rife"], ["TDSIOU", [["STUDIO", 6, 3, 0], ["DOTS", 3, 3, 1], ["OUTS", 4, 3, 0], ["SUIT", 1, 5, 1], ["DUST", 2, 4, 0], ["STUD", 3, 0, 0], ["SIT", 5, 1, 0], ["DUO", 4, 8, 1], ["ITS", 1, 0, 1], ["OUT", 0, 7, 1]], "dis dos dot duos ids oust sod sot"], ["KDERAR", [["DARKER", 2, 0, 0], ["RARE", 2, 5, 1], ["READ", 2, 2, 1], ["DARK", 2, 0, 1], ["REAR", 4, 0, 0], ["ERA", 0, 1, 1], ["EAR", 0, 1, 0], ["ARE", 3, 5, 0], ["DEAR", 5, 4, 0], ["DARE", 0, 7, 1]], "ark drake err rake raked red"], ["SDBDUIE", [["BUDDIES", 2, 0, 0], ["SIDE", 2, 6, 1], ["USED", 2, 1, 1], ["BID", 4, 4, 0], ["BED", 4, 0, 0], ["DUE", 0, 5, 1], ["BUS", 4, 4, 1], ["SUB", 0, 0, 1], ["USE", 6, 3, 0], ["DID", 0, 3, 0]], "beds bide bids bud buds deb debs dis dub dubs dud dude dudes duds dues ides ids sided sue sued"], ["XIMRTA", [["MATRIX", 4, 0, 0], ["TAXI", 1, 4, 1], ["ART", 1, 2, 0], ["MIX", 4, 0, 1], ["RAT", 4, 3, 1], ["AIM", 2, 4, 0], ["TAX", 6, 3, 0], ["MAR", 0, 2, 1], ["AIR", 2, 0, 0], ["RAM", 0, 0, 0]], "arm mart mat rim tam tar tram trim"], ["SAREHNS", [["HARNESS", 6, 0, 0], ["SHARE", 2, 4, 1], ["NEAR", 3, 2, 1], ["HAS", 4, 6, 1], ["RAN", 3, 0, 0], ["ERA", 4, 2, 0], ["HEAR", 0, 0, 1], ["SHE", 2, 4, 0], ["HER", 0, 0, 0], ["ARE", 0, 6, 1]], "ares ash ashen ashes ear earn earns ears eras hare hares hears hen hens hers hes nears rash rashes rhea sane sans sash sea sear sears seas shares shear shears shes snare snares"], ["OPOSNSR", [["SPONSOR", 4, 0, 0], ["SNOOP", 0, 1, 1], ["SONS", 0, 1, 0], ["SPOON", 1, 5, 1], ["SOON", 2, 0, 0], ["PROS", 2, 5, 0], ["PRO", 0, 7, 1], ["NOR", 4, 3, 1], ["POOR", 6, 0, 0], ["SON", 2, 8, 1]], "oops porno sop spoons"], ["PNIATCA", [["CAPTAIN", 2, 0, 0], ["PAINT", 2, 2, 1], ["PAIN", 4, 0, 0], ["CAP", 2, 0, 1], ["CANT", 0, 6, 1], ["ACT", 0, 3, 1], ["CAT", 6, 0, 0], ["PAN", 0, 2, 0], ["TIP", 3, 6, 0], ["CAN", 0, 6, 0]], "ant anti apt catnip nap nip nit pact panic pant pat patina pica pin pint pit pita tan tap tic tin"], ["ENSUMRB", [["NUMBERS", 1, 0, 0], ["NUMBER", 1, 0, 1], ["SURE", 1, 6, 1], ["RUNS", 6, 0, 0], ["SUN", 4, 2, 1], ["MEN", 0, 4, 1], ["USER", 4, 4, 0], ["RUN", 4, 7, 1], ["BUS", 4, 0, 0], ["USE", 2, 6, 0]], "berm bum bums bun buns bur burn burns ems emu menu menus mes muse nub numb nurse rebus rub rube rubs rue rune runes ruse serum snub sub sue sum urn urns"], ["RTTUCE", [["CUTTER", 3, 0, 0], ["TRUCE", 3, 3, 1], ["CUTE", 5, 2, 0], ["UTTER", 7, 0, 0], ["CUE", 3, 0, 1], ["CUT", 1, 2, 1], ["RUE", 3, 5, 1], ["CURE", 1, 2, 0], ["TRUE", 0, 4, 1]], "cur curt cuter rut"], ["DESVERE", [["DESERVE", 1, 0, 0], ["SERVED", 0, 3, 1], ["VERSE", 0, 6, 1], ["SEVERE", 0, 1, 1], ["SEED", 5, 0, 0], ["SERVE", 3, 0, 0], ["REV", 4, 5, 0], ["RED", 4, 5, 1], ["SEE", 5, 0, 1], ["EVE", 5, 2, 1]], "deer ere ever reds reed reeds reeve reeves revs seer sever severed veer veered veers versed"], ["EDTERS", [["DESERT", 3, 0, 0], ["TREES", 3, 5, 1], ["DEER", 3, 0, 1], ["SEED", 3, 2, 1], ["TREE", 0, 1, 1], ["REST", 1, 1, 0], ["REDS", 6, 0, 0], ["REED", 5, 4, 0], ["RED", 3, 7, 1], ["SET", 7, 5, 0]], "deter ere ester reeds reset rested see seer steed steer tee teed tees terse"], ["LNESILS", [["ILLNESS", 6, 0, 0], ["SELLS", 2, 6, 1], ["SELL", 3, 1, 1], ["LINES", 2, 2, 0], ["LENS", 4, 0, 0], ["LINE", 0, 4, 1], ["LIES", 0, 4, 0], ["LIE", 4, 6, 0], ["LESS", 3, 8, 1], ["SIN", 4, 3, 1]], "ell ill ills ins isle isles lei lien liens lisle nil sill sills sine sins sis"], ["XTPREE", [["EXPERT", 4, 0, 0], ["EXERT", 2, 3, 1], ["TREE", 2, 0, 0], ["PETER", 6, 1, 0], ["PER", 0, 1, 1], ["PEER", 0, 1, 0], ["TEE", 2, 0, 1], ["PET", 2, 5, 1]], "ere pert rep"], ["WOINGKN", [["KNOWING", 2, 2, 0], ["WING", 2, 5, 1], ["KNOWN", 4, 4, 0], ["KING", 2, 2, 1], ["ION", 0, 7, 1], ["NOW", 4, 8, 1], ["WON", 0, 3, 1], ["KNOW", 0, 0, 0], ["OWN", 4, 0, 0], ["WIN", 0, 6, 0]], "gown ink inn kin non owing owning wig wink wok"], ["SEIMENM", [["IMMENSE", 3, 0, 0], ["MINE", 0, 6, 1], ["MINES", 0, 3, 1], ["MEN", 3, 1, 1], ["SEEM", 0, 0, 0], ["SEE", 3, 5, 1], ["SEEN", 5, 4, 0], ["INS", 5, 0, 0], ["SIN", 1, 5, 0]], "ems ism meme memes mes mime semi sim sine"], ["KCSTRU", [["STRUCK", 4, 1, 0], ["TRUCK", 2, 4, 1], ["TRUCKS", 6, 0, 0], ["CRUST", 2, 0, 0], ["STUCK", 0, 6, 1], ["CUTS", 0, 3, 0], ["RUST", 1, 2, 1], ["CUT", 3, 6, 0], ["TUCK", 3, 8, 1]], "cur curt rusk rut tucks tusk"], ["ANSILG", [["SIGNAL", 5, 0, 0], ["GAINS", 2, 3, 1], ["NAILS", 2, 5, 1], ["SANG", 2, 0, 0], ["SING", 4, 1, 1], ["NAIL", 2, 5, 0], ["SIGN", 6, 5, 0], ["GAIN", 0, 7, 1], ["SIN", 0, 2, 1], ["SAIL", 0, 2, 0]], "ails align aligns gal gals gas gins ins lag lags lain nag nags nil sag slag slang sling snag snail"], ["PAEELXM", [["EXAMPLE", 3, 2, 0], ["MALE", 0, 2, 1], ["PALE", 0, 8, 1], ["MEAL", 0, 2, 0], ["MAP", 1, 6, 1], ["PALM", 2, 4, 1], ["EXAM", 5, 1, 0], ["LAMP", 3, 7, 1], ["LAP", 6, 5, 0], ["PAL", 2, 0, 0]], "ale amp ample ape apex axle eel elm expel lam lame lax lea leap lee maple pea peal peel plea"], ["SEASAGU", [["SAUSAGE", 5, 0, 0], ["USAGE", 1, 6, 1], ["GUESS", 1, 0, 1], ["AGE", 5, 1, 1], ["USES", 4, 3, 1], ["SEAS", 7, 0, 0], ["SEA", 3, 4, 0], ["AGES", 0, 4, 1], ["USE", 2, 0, 0], ["GAS", 5, 5, 1]], "assuage gases sag saga sagas sage sages sue sues usages"], ["HTGBIR", [["BRIGHT", 4, 0, 0], ["BIRTH", 1, 5, 1], ["GRIT", 2, 2, 1], ["RIGHT", 2, 4, 0], ["HIT", 2, 7, 1], ["BIG", 2, 0, 0], ["RIB", 0, 0, 1], ["RIG", 0, 0, 0], ["BIT", 0, 8, 1]], "bight brig girth trig"], ["EAITRW", [["WAITER", 2, 0, 0], ["WATER", 2, 0, 1], ["WAIT", 0, 2, 1], ["WRITE", 1, 5, 1], ["ART", 4, 3, 0], ["ARE", 4, 3, 1], ["RATE", 6, 0, 0], ["EAT", 5, 5, 0], ["WEAR", 1, 5, 0], ["AIR", 1, 7, 1]], "ate awe ear era eta irate ire rat raw rite tar tea tear tie tier tire war ware wart weir wet wire wit writ"], ["LCTKEA", [["TACKLE", 3, 2, 0], ["TALK", 3, 2, 1], ["LATE", 3, 6, 1], ["TAKE", 0, 7, 1], ["CAT", 3, 4, 1], ["LACK", 0, 5, 1], ["LAKE", 6, 0, 0], ["TEA", 1, 3, 1], ["ACT", 1, 1, 0], ["EAT", 0, 1, 1]], "ace ale ate cake elk eta kale lace lea leak let tack talc tale teak teal"], ["GUHTHO", [["THOUGH", 0, 2, 0], ["OUGHT", 0, 4, 1], ["TOUGH", 0, 2, 1], ["THOU", 4, 4, 0], ["GUT", 2, 4, 0], ["HOT", 4, 5, 1], ["HUH", 3, 7, 1], ["UGH", 4, 0, 0], ["HUG", 3, 0, 1], ["GOT", 0, 6, 1]], "gout hog hut out tho tog tug"], ["SDAZRAH", [["HAZARDS", 2, 0, 0], ["HAZARD", 0, 2, 1], ["RASH", 2, 4, 1], ["DASH", 0, 6, 1], ["HARD", 2, 0, 1], ["HAD", 0, 4, 0], ["ADS", 1, 6, 0], ["ASH", 0, 0, 0], ["HAS", 3, 6, 0], ["SAD", 3, 8, 1]], "aha shad shard"], ["NERSOI", [["SENIOR", 0, 3, 0], ["NOISE", 0, 5, 1], ["ONES", 4, 3, 0], ["IRON", 2, 5, 0], ["NOSE", 2, 8, 1], ["ROSE", 3, 3, 1], ["RISE", 6, 0, 0], ["NOR", 4, 0, 1], ["SON", 4, 6, 1], ["ONE", 5, 6, 0]], "eon eons ins ion ions ire irons noes ore ores rein reins resin rinse risen roe rosin sin sine sir sire siren snore sore"], ["DPLEHE", [["HELPED", 0, 3, 0], ["DEEP", 0, 8, 1], ["HELD", 0, 3, 1], ["HELP", 3, 5, 0], ["HEEL", 2, 6, 1], ["HEED", 3, 0, 0], ["PEEL", 2, 1, 1], ["LED", 5, 1, 0], ["LEE", 5, 6, 0]], "eel hep peed"], ["FRALKNY", [["FRANKLY", 3, 1, 0], ["FRANK", 3, 1, 1], ["RAN", 2, 3, 1], ["FRY", 1, 7, 1], ["LAY", 3, 6, 1], ["RANK", 0, 5, 1], ["FAN", 5, 0, 0], ["RAY", 5, 4, 0], ["ANY", 5, 5, 1], ["FLY", 7, 3, 0]], "ark far flak flaky flan flank flay fray lanky lark nary nay yak yank yarn"], ["MNIEDA", [["MEDIAN", 2, 3, 0], ["MIND", 0, 8, 1], ["NAME", 0, 3, 1], ["IDEA", 1, 5, 1], ["MEAN", 0, 0, 0], ["MEDIA", 0, 0, 1], ["MADE", 4, 4, 0], ["END", 4, 7, 1], ["MAN", 4, 4, 1], ["MEN", 6, 2, 0]], "aid aide aim aimed amen amend amid and anime dam dame dean den denim dim dime din dine mad maid maiden main mane mead mend mid mine mined named"], ["MSEAEOW", [["AWESOME", 2, 0, 0], ["SOME", 2, 3, 1], ["SEEM", 4, 0, 0], ["EASE", 5, 3, 0], ["OWE", 0, 2, 1], ["SEA", 0, 0, 1], ["SAME", 0, 5, 1], ["WEE", 2, 1, 1], ["SAW", 4, 0, 1], ["SEE", 4, 6, 1]], "awe emo ems ewe ewes mas maw meow mes mesa mew mews mow owes seam sew sow swam was woe woes"], ["TOPNOI", [["OPTION", 3, 3, 0], ["POINT", 1, 6, 1], ["ONTO", 5, 4, 0], ["TOO", 2, 3, 1], ["INTO", 4, 0, 0], ["TOP", 1, 4, 0], ["TIP", 3, 0, 1], ["NOT", 2, 1, 0], ["TON", 1, 8, 1], ["PIN", 0, 1, 1]], "ion nip nit opt pint pinto pit poi potion tin"], ["IEGLFEN", [["FLEEING", 7, 1, 0], ["FEELING", 1, 7, 1], ["FINE", 2, 4, 0], ["FEEL", 4, 2, 1], ["LIE", 5, 4, 1], ["LINE", 1, 5, 1], ["LIFE", 4, 0, 0], ["FILE", 2, 0, 1], ["FEE", 2, 0, 0], ["LEE", 0, 2, 1]], "eel elf feign feline fen fie fig fin flee fling gee gel gene genie glee glen leg lei liege lien nil"], ["IAHBTS", [["HABITS", 4, 1, 0], ["HITS", 2, 5, 1], ["HIS", 4, 1, 1], ["THIS", 2, 4, 0], ["ITS", 0, 7, 1], ["SAT", 0, 4, 1], ["SIT", 6, 1, 0], ["HAS", 0, 2, 0], ["HIT", 0, 2, 1], ["BIT", 4, 3, 1]], "ash bah bait baits bash bast bat bath baths bats bias bits habit hat hats sahib saith stab tab tabs"], ["WEHTAER", [["WEATHER", 4, 0, 0], ["WATER", 0, 6, 1], ["WHERE", 0, 1, 1], ["THREE", 1, 0, 0], ["THERE", 3, 4, 1], ["WHAT", 4, 0, 1], ["ARE", 6, 0, 0], ["WERE", 7, 3, 0], ["HER", 0, 3, 1], ["THE", 2, 6, 0]], "art ate awe ear earth eat eater era ere eta ether ewe hare hart hat hater haw hear heart heat heater here hew rat rate raw reheat rhea tar tea tear tee thaw thee threw tree twee war ware wart wear wee wet wheat whet wrath wreath"], ["PLEESY", [["SLEEPY", 5, 3, 0], ["SLEEP", 1, 7, 1], ["ELSE", 1, 5, 0], ["EYES", 2, 3, 1], ["PEEL", 3, 5, 0], ["SEE", 2, 2, 0], ["YES", 0, 2, 1], ["SLY", 0, 0, 0], ["EYE", 4, 1, 0], ["SPY", 0, 0, 1]], "eel eels lee lees lye peels ply seep yelp yep"], ["EESACP", [["ESCAPE", 3, 0, 0], ["CASE", 3, 2, 1], ["EASE", 3, 0, 1], ["PEACE", 3, 4, 1], ["SPACE", 5, 2, 0], ["CAPE", 0, 5, 1], ["CAPS", 0, 1, 1], ["PACE", 0, 3, 0], ["SEA", 7, 3, 0], ["CAP", 1, 0, 0]], "ace aces ape apes asp capes cease paces pas pea peas pecs sac sap see seep spa spec"], ["OEBBYRR", [["ROBBERY", 6, 0, 0], ["ROBE", 4, 3, 1], ["BERRY", 4, 0, 0], ["BORE", 4, 0, 1], ["RYE", 5, 6, 1], ["ORE", 2, 1, 1], ["BOY", 2, 0, 0], ["OBEY", 1, 4, 1], ["ROB", 1, 3, 0], ["BOB", 0, 0, 1]], "borer bye ebb err orb robber roe yore"], ["VOLIATE", [["VIOLATE", 4, 0, 0], ["LOVE", 1, 6, 1], ["LIVE", 2, 0, 1], ["LATE", 2, 0, 0], ["LIE", 0, 3, 1], ["VIA", 0, 1, 1], ["VOTE", 2, 5, 0], ["LET", 1, 8, 1], ["LOT", 0, 3, 0], ["OIL", 4, 2, 1]], "ale alive aloe alto ate eat eta evil iota lea lei lit lite oat olive ova oval tail tale tea teal tie tile toe toil vale valet vat veal veil vet veto vial vie vile viola violet vital vole volt"], ["KCRQUIE", [["QUICKER", 0, 0, 0], ["QUICK", 0, 0, 1], ["RUE", 0, 6, 1], ["CURE", 2, 3, 0], ["RICE", 2, 5, 1], ["ICE", 5, 3, 0], ["CUE", 3, 0, 0]], "cur curie ire quirk rick uric"], ["EOADLD", [["LOADED", 4, 2, 0], ["LEAD", 1, 5, 1], ["LOAD", 1, 7, 1], ["LED", 4, 2, 1], ["DOE", 2, 3, 0], ["LAD", 0, 3, 1], ["OLD", 0, 2, 0], ["ADD", 4, 4, 1], ["DEAL", 6, 4, 0], ["DAD", 6, 0, 0]], "ado ale aloe dale dole lea lode odd ode"], ["CACODR", [["ACCORD", 4, 2, 0], ["CORD", 1, 7, 1], ["ROAD", 2, 2, 1], ["COD", 3, 5, 1], ["CARD", 2, 0, 0], ["ROD", 5, 0, 0], ["CAD", 0, 3, 1], ["CAR", 0, 3, 0], ["ARC", 0, 0, 1]], "ado coda doc oar orc"], ["NPOMYCA", [["COMPANY", 2, 2, 0], ["MANY", 0, 7, 1], ["CAMP", 0, 5, 0], ["MAP", 2, 4, 1], ["PAY", 4, 4, 0], ["COPY", 2, 2, 1], ["CAP", 0, 5, 1], ["MAY", 5, 0, 0], ["MAN", 5, 0, 1], ["ANY", 4, 5, 1]], "amp cam campy can canopy coma con cop coy mayo moan mop nap nay pan pony yam yap yon"], ["ICATRG", [["TRAGIC", 3, 0, 0], ["RAT", 3, 1, 1], ["ACT", 2, 5, 1], ["ARC", 2, 5, 0], ["RIG", 1, 3, 1], ["ART", 1, 2, 0], ["TAG", 5, 1, 0], ["AIR", 0, 6, 1], ["CART", 2, 7, 1], ["CAT", 1, 0, 1]], "car cigar crag gait grit rag tar tic trig"], ["OGSPLE", [["GOSPEL", 6, 0, 0], ["POLE", 3, 4, 1], ["SLOPE", 3, 1, 0], ["LOG", 4, 0, 1], ["EGO", 1, 3, 1], ["POSE", 1, 0, 0], ["SOLE", 0, 5, 1], ["GOES", 0, 1, 1], ["LOSE", 2, 5, 0], ["LEGS", 3, 2, 1]], "egos gel gels leg logs lop lope lopes ogle peg pegs peso pol poles slog slop sol sop"], ["HIRBBUS", [["RUBBISH", 2, 1, 0], ["BRUSH", 2, 3, 1], ["BUSH", 4, 2, 0], ["BUS", 0, 6, 1], ["RUB", 0, 4, 1], ["RUSH", 6, 0, 0], ["SUB", 5, 1, 1], ["RIBS", 0, 4, 0], ["HUB", 2, 7, 1], ["HIS", 4, 5, 1]], "bib bibs bur hubris hubs rib rubs shrub sir"], ["ULFUSE", [["USEFUL", 3, 3, 0], ["FUELS", 0, 8, 1], ["FUEL", 1, 5, 1], ["SELF", 1, 2, 0], ["USE", 0, 2, 1], ["ELF", 0, 6, 0], ["FLU", 0, 0, 0], ["FUSE", 0, 0, 1], ["SUE", 2, 0, 0]], "flue"], ["YSRLPHA", [["SHARPLY", 4, 2, 0], ["PLAYS", 0, 2, 1], ["SHARP", 0, 6, 1], ["PAYS", 2, 5, 0], ["RAY", 3, 4, 1], ["PRAY", 2, 0, 0], ["PLAY", 2, 0, 1], ["LAY", 4, 7, 1], ["HAS", 0, 4, 0], ["PAY", 6, 5, 0]], "ash ashy asp harp harps harpy hay hays lap laps lash lays pal pals palsy par pars pas ply prays pry rap raps rash rasp raspy rays sap say shy slap sly spa spar spay spray spry spy yap"], ["ESRSAHP", [["PHRASES", 0, 2, 0], ["PRESS", 0, 2, 1], ["SHARE", 0, 6, 1], ["HEAR", 4, 5, 0], ["PASS", 2, 5, 0], ["HER", 4, 5, 1], ["SEA", 3, 2, 0], ["ARE", 4, 7, 1], ["HAS", 4, 0, 0], ["PER", 6, 3, 0]], "ape apes ares ash ashes asp ear ears era eras hare hares harp harps heap heaps hears hep hers hes par pare pars parse pas passer pea pear pears peas phase phases phrase rap raps rash rashes rasp reap rep reps rhea sap saps sash sear sears seas seraph shape shapes shares sharp sharps she shear shears shes spa spar spare spares spars sparse spas spear spears"], ["OFUINS", [["FUSION", 4, 2, 0], ["IONS", 2, 7, 1], ["INFO", 2, 2, 1], ["SIN", 3, 5, 1], ["SUN", 3, 0, 0], ["FIN", 2, 6, 0], ["FINS", 0, 0, 1], ["ION", 2, 2, 0], ["SON", 0, 8, 1], ["FUN", 0, 4, 1]], "ifs ins nous onus"], ["UFSNRGI", [["SURFING", 3, 2, 0], ["RING", 1, 7, 1], ["RUNS", 0, 2, 1], ["USING", 3, 3, 1], ["RUN", 0, 2, 0], ["SIGN", 5, 2, 0], ["SUN", 2, 0, 0], ["SING", 7, 0, 0], ["SIR", 1, 5, 0], ["FUN", 3, 5, 1]], "fig figs fin fins fir firs fungi fur furs fusing gins gnu grin grins ifs ins rig rigs rings rug rugs ruin ruins rung rungs sin snug suing sung surf urn urns"], ["ULAOLFT", [["FALLOUT", 4, 2, 0], ["FAULT", 0, 8, 1], ["TALL", 1, 4, 1], ["AUTO", 1, 6, 1], ["FALL", 4, 2, 1], ["OUT", 1, 2, 0], ["FLAT", 6, 1, 0], ["LOT", 0, 2, 1], ["FAT", 2, 0, 0], ["FULL", 2, 0, 1]], "afoul aft all allot aloft alto atoll float flu foal foul loaf loft oat oft tofu toll"], ["NPTTIAE", [["PATIENT", 2, 0, 0], ["PAIN", 2, 0, 1], ["PAINT", 0, 3, 1], ["TAPE", 2, 6, 1], ["TEA", 0, 1, 1], ["TIP", 0, 1, 0], ["EAT", 5, 6, 0], ["TEN", 0, 5, 1], ["TIE", 0, 5, 0], ["PET", 3, 8, 1]], "ant ante anti ape apt ate eta inept nap nape neat net nip nit pan pane pant pat pate patent pea peat pen pent pie pin pine pint pit pita taint tan tap tat teat tent tin tine tint titan"], ["SOERPN", [["PERSON", 4, 2, 0], ["OPENS", 0, 5, 1], ["ROSE", 2, 2, 0], ["NOSE", 0, 4, 0], ["PRO", 4, 2, 1], ["ONES", 3, 7, 1], ["PER", 0, 2, 1], ["OPEN", 6, 2, 0], ["ONE", 2, 3, 1], ["NOR", 5, 0, 0]], "eon eons noes nope ore ores pen pens peso pore pores pose poser prone pros prose rep reps roe rope ropes snore son sop sore spore"], ["KICIPGN", [["PICKING", 4, 0, 0], ["NICK", 2, 2, 1], ["PICK", 3, 4, 1], ["PINK", 2, 0, 0], ["ICING", 0, 6, 1], ["PIG", 4, 0, 1], ["NIP", 0, 0, 1], ["PIN", 2, 5, 0], ["KING", 6, 4, 0], ["KIN", 0, 5, 0]], "ink ping"], ["EOYCNV", [["CONVEY", 4, 2, 0], ["ENVOY", 0, 7, 1], ["COVE", 0, 4, 0], ["ONCE", 2, 2, 1], ["CON", 0, 4, 1], ["YEN", 3, 0, 0], ["ENVY", 0, 0, 1], ["OVEN", 3, 5, 1], ["ONE", 5, 0, 0], ["CONE", 6, 3, 0]], "coven covey coy eon yon"], ["TPOICLA", [["OPTICAL", 4, 0, 0], ["PILOT", 0, 2, 1], ["LOT", 2, 2, 0], ["CAT", 0, 4, 1], ["TIP", 0, 0, 0], ["TOP", 0, 0, 1], ["CAP", 0, 4, 0], ["COAL", 4, 4, 1], ["PLOT", 3, 6, 1], ["OIL", 7, 2, 0]], "act alto apt atop capitol clap clip clot coat coil cola colt cop cot iota lap lip lit loci lop oat opal opt optic pact pail pal pat patio pica pit pita plait poi pol taco tail talc tap tic toil topic topical"], ["PARPEA", [["APPEAR", 3, 0, 0], ["PAPER", 0, 3, 1], ["PAPA", 0, 0, 1], ["AREA", 1, 0, 0], ["ERA", 2, 5, 1], ["PAR", 0, 3, 0], ["ARE", 4, 5, 0], ["EAR", 2, 5, 0], ["PEA", 3, 1, 1], ["PER", 0, 7, 1]], "ape pap pare pear pep prep rap reap rep"], ["IOOMNT", [["MOTION", 5, 2, 0], ["MOON", 2, 7, 1], ["ONTO", 2, 3, 1], ["TOO", 3, 5, 0], ["MINT", 0, 5, 1], ["INTO", 2, 0, 0], ["ION", 2, 0, 1], ["NOT", 0, 2, 1], ["TON", 0, 0, 0], ["TIN", 1, 4, 0]], "mono moo moot nit omit tom"], ["ISFTRU", [["FRUITS", 3, 2, 0], ["STIR", 0, 3, 1], ["SUIT", 0, 6, 1], ["FIRST", 0, 0, 0], ["FUR", 1, 5, 0], ["FRUIT", 0, 0, 1], ["SIT", 3, 7, 1], ["FITS", 3, 2, 1], ["FIT", 5, 5, 0], ["SIR", 6, 2, 0]], "fir firs fist furs ifs its rift rifts rust rut sift surf turf"], ["OCBAOTC", [["TOBACCO", 4, 0, 0], ["BOAT", 2, 3, 1], ["BOOT", 2, 3, 0], ["TAB", 4, 0, 1], ["BOO", 2, 1, 1], ["COAT", 4, 5, 1], ["CAB", 6, 4, 0], ["CAT", 0, 6, 1], ["BAT", 6, 0, 0], ["TOO", 0, 4, 1]], "act boa cob cocoa coo coot cot oat taboo taco"], ["CARTHIU", [["HAIRCUT", 4, 2, 0], ["RICH", 1, 2, 1], ["HAIR", 1, 5, 1], ["AIR", 2, 5, 0], ["ART", 4, 3, 1], ["CAT", 4, 6, 1], ["CAR", 0, 7, 1], ["CUT", 6, 1, 0], ["HURT", 1, 0, 0], ["HIT", 1, 0, 1]], "act arc arch cart chair char chart chat chi chit cur curt hart hat hut itch rat rut tar thru tic uric"], ["TMUSBH", [["THUMBS", 2, 1, 0], ["THUS", 1, 2, 1], ["BUST", 2, 5, 1], ["BUSH", 4, 0, 0], ["BUT", 4, 0, 1], ["HUB", 4, 3, 1], ["SHUT", 4, 5, 0], ["MUST", 3, 7, 1], ["SUM", 0, 4, 1], ["SUB", 0, 4, 0]], "bum bums bus buts hubs hum hums hut huts mush stub thumb tub tubs"], ["NTOAIC", [["ACTION", 4, 3, 0], ["COIN", 2, 6, 1], ["CON", 2, 6, 0], ["TON", 0, 8, 1], ["COAT", 2, 3, 1], ["CANT", 0, 5, 0], ["INTO", 3, 0, 0], ["CAN", 1, 1, 1], ["ACT", 1, 0, 0], ["CAT", 5, 1, 0]], "ant anti canto cation cot icon ion iota nit not oat taco tan tic tin tonic"], ["RALENIM", [["MINERAL", 5, 1, 0], ["REAL", 2, 7, 1], ["NAME", 3, 4, 0], ["LINE", 4, 2, 1], ["NEAR", 7, 1, 0], ["MEAN", 0, 4, 1], ["ARE", 1, 2, 0], ["MAIN", 0, 4, 0], ["AIR", 3, 5, 1], ["MAN", 0, 2, 1]], "aim airmen ale alien amen anime arm ear earl earn elm email emir era ire lain lair lam lame lane lea lean learn lei liar lie lien lime linear liner lira lire mail mailer male mane mar mare marine marlin meal men menial mil mile miler mine miner mire nail nil rail rain ram ran realm ream rein remain renal rile rim rime"], ["SENTOH", [["HONEST", 2, 0, 0], ["SHOT", 1, 0, 1], ["THOSE", 4, 0, 0], ["THE", 0, 3, 1], ["NOT", 0, 5, 1], ["SENT", 4, 3, 1], ["SON", 6, 1, 0], ["THEN", 7, 3, 0], ["SET", 0, 1, 0], ["ONE", 5, 5, 1]], "eon eons ethos hen hens hes hone hose host hot nest net nets noes nose note notes nth ones onset she shoe shone snot sot stone ten tens tho toe toes ton tone tones tons"], ["BELTTO", [["BOTTLE", 0, 0, 0], ["BOLT", 0, 0, 1], ["TOE", 3, 0, 0], ["LOT", 0, 4, 1], ["BELT", 2, 2, 1], ["LOBE", 4, 2, 0], ["BET", 2, 2, 0], ["LET", 3, 5, 1]], "blot bole lob tot tote"], ["KCRCSA", [["CRACKS", 2, 1, 0], ["CARS", 2, 4, 1], ["RACKS", 2, 2, 1], ["SACK", 2, 6, 1], ["ARC", 4, 0, 0], ["CAR", 3, 0, 1], ["RACK", 4, 4, 0], ["ARK", 0, 5, 1], ["SCAR", 0, 3, 0], ["ASK", 6, 1, 0]], "arcs cask sac"], ["ESLEEVS", [["SLEEVES", 5, 1, 0], ["SLEEVE", 2, 4, 1], ["SELVES", 3, 2, 0], ["SEES", 7, 3, 0], ["LESS", 0, 7, 1], ["VESSEL", 0, 2, 1], ["ELVES", 0, 0, 0], ["SEE", 5, 1, 1], ["ELSE", 0, 0, 1], ["LEE", 1, 5, 0]], "eel eels eve lees lessee levee levees"], ["RTWSAE", [["WATERS", 2, 0, 0], ["WATER", 2, 0, 1], ["REST", 2, 4, 1], ["ART", 5, 2, 0], ["WAR", 4, 2, 1], ["STAR", 4, 4, 0], ["SAW", 3, 6, 1], ["SET", 0, 2, 1], ["WEST", 0, 0, 0], ["WAS", 0, 5, 1]], "are ares arts aster ate awe ear ears east eat eats era eras eta rat rate rates rats raw sat sate sea sear seat sew stare stew straw swat swear sweat tar tars tea tear tears teas ware wares wars wart warts waste wear wears wet wrest"], ["TDEXNE", [["EXTEND", 3, 3, 0], ["TEND", 2, 3, 1], ["DENT", 5, 3, 0], ["TEEN", 0, 7, 1], ["NEED", 1, 5, 0], ["NEXT", 2, 0, 0], ["NET", 1, 5, 1], ["TEN", 4, 1, 0], ["DEN", 3, 8, 1], ["END", 1, 0, 1]], "tee teed"], ["RTKEHIC", [["THICKER", 4, 0, 0], ["TRICK", 3, 6, 1], ["THEIR", 3, 1, 1], ["RICE", 6, 0, 0], ["THICK", 0, 4, 1], ["RICH", 1, 1, 0], ["HIT", 0, 2, 1], ["THE", 0, 4, 0], ["TIE", 3, 6, 0], ["HER", 2, 8, 1]], "chi chit cite etch ethic heck heir hick hie hike hiker hire ice ire itch kit kite rick rite thrice tic tick ticker tier tire trek trice trike"], ["VILYEL", [["LIVELY", 3, 3, 0], ["LIVE", 0, 6, 1], ["VILE", 1, 5, 0], ["YELL", 0, 3, 1], ["EVIL", 2, 0, 0], ["LIE", 0, 0, 1], ["LILY", 0, 0, 0], ["LEVY", 0, 8, 1], ["VEIL", 2, 1, 1], ["IVY", 3, 4, 1]], "ell ill lei lye vie"], ["FUHOTR", [["FOURTH", 1, 1, 0], ["FOUR", 0, 2, 1], ["HOUR", 1, 6, 1], ["TOUR", 4, 3, 0], ["FORTH", 3, 4, 1], ["FORT", 6, 1, 0], ["OUR", 3, 0, 0], ["HURT", 7, 4, 0], ["OUT", 3, 0, 1], ["FOR", 5, 2, 1]], "fro froth fur hot hut oft rho rot rout rut tho thou thru tofu tor turf"], ["RPSPUE", [["SUPPER", 3, 1, 0], ["UPPER", 3, 2, 1], ["SUPER", 5, 0, 0], ["PURSE", 3, 4, 1], ["PER", 7, 0, 0], ["USER", 0, 6, 1], ["SURE", 6, 4, 0], ["PURE", 0, 5, 0], ["UPS", 1, 1, 1], ["USE", 4, 7, 1]], "pep prep preps pup pups pus rep reps rue ruse spur sue sup uppers"], ["WNUAREA", [["UNAWARE", 4, 0, 0], ["AREA", 1, 4, 1], ["NEAR", 2, 1, 0], ["WAR", 4, 3, 1], ["AWARE", 6, 0, 0], ["RUN", 0, 1, 1], ["WEAR", 3, 6, 1], ["RAN", 0, 1, 0], ["NEW", 4, 1, 1], ["ERA", 2, 2, 1]], "anew are arena aura awe ear earn raw rue rune urea urn wan wane ware warn wean wen wren"], ["HCRAGE", [["CHARGE", 5, 0, 0], ["RACE", 3, 0, 1], ["REACH", 3, 0, 0], ["HEAR", 4, 5, 1], ["ARE", 5, 2, 1], ["CAR", 3, 3, 1], ["ERA", 7, 4, 0], ["EACH", 0, 4, 1], ["CARE", 1, 3, 0], ["AGE", 1, 1, 1]], "ace ache acre arc arch cage char crag ear erg gear grace hag hare her rag rage rhea"], ["URSGTEE", [["GESTURE", 3, 2, 0], ["TREES", 0, 8, 1], ["REST", 0, 5, 0], ["TRUE", 0, 3, 1], ["SURE", 2, 6, 1], ["TREE", 5, 4, 0], ["GETS", 3, 2, 1], ["GET", 0, 1, 0], ["SEE", 4, 0, 0], ["SET", 3, 4, 1]], "ere erg ester gee gees greet greets guest gust gut guts reset reuse rue rug rugs ruse rust rut seer segue serge steer sue suet surge tee tees terse tug tugs urge urges use user"], ["RESDCAN", [["DANCERS", 3, 0, 0], ["READ", 3, 5, 1], ["CARE", 3, 3, 1], ["NEAR", 5, 0, 0], ["ARE", 3, 1, 1], ["RED", 1, 0, 1], ["CASE", 0, 4, 1], ["CAR", 0, 4, 0], ["END", 6, 3, 0], ["AND", 5, 5, 0]], "ace aced aces acne acre acres ads arc arcs ares ascend cad cadre cadres can cane canes cans card cards cared cares cars cased cedar cedars crane cranes dance dancer dances dare dares darn dean deans dear dears den dens ear earn earns ears ends era eras narc nears nerd nerds race raced races ran reads reds rend sac sacred sad sand sander sane scan scar scare scared sea sear sedan send snare"], ["ERHLDA", [["HERALD", 3, 0, 0], ["HEARD", 0, 2, 1], ["HARD", 0, 2, 0], ["DEAL", 3, 5, 1], ["READ", 5, 3, 0], ["ARE", 1, 0, 0], ["HER", 3, 0, 1], ["RED", 5, 3, 1], ["REAL", 0, 4, 1], ["HAD", 7, 1, 0]], "alder ale dale dare dear ear earl era hale hare head heal hear held herd lad lard lea lead led rhea"], ["RIDGNIV", [["DRIVING", 6, 0, 0], ["VIRGIN", 2, 2, 1], ["DIVING", 3, 1, 0], ["GRIND", 0, 5, 1], ["RIDING", 0, 0, 0], ["RING", 1, 5, 0], ["DIG", 5, 4, 1], ["GRID", 1, 8, 1], ["RIG", 0, 0, 1], ["RID", 4, 0, 1]], "din ding grin rigid rind"], ["UNETRCR", [["CURRENT", 4, 0, 0], ["RETURN", 0, 3, 1], ["CUTE", 1, 0, 0], ["RENT", 0, 3, 0], ["CUT", 0, 1, 1], ["TURN", 2, 3, 0], ["TEN", 0, 6, 1], ["RUN", 2, 5, 1], ["TRUE", 4, 6, 1], ["CENT", 4, 0, 1]], "cue cur cure curt cuter err net nut recur rerun rue rune runt rut tern truce truer tun tune tuner turner urn"], ["IDAVSE", [["ADVISE", 4, 3, 0], ["SAVED", 1, 8, 1], ["SIDE", 2, 4, 1], ["SAID", 2, 6, 1], ["IDEAS", 2, 0, 0], ["IDEA", 2, 0, 1], ["SEA", 2, 6, 0], ["SAD", 0, 1, 1], ["SAVE", 0, 1, 0], ["VIA", 0, 3, 1]], "ads aid aide aides aids aside avid dais dis diva divas dive dives ides ids vase vie vied visa vise"], ["RROEMF", [["FORMER", 3, 2, 0], ["REFORM", 0, 3, 1], ["FORM", 0, 5, 1], ["ROE", 3, 7, 1], ["MORE", 1, 0, 0], ["FORE", 0, 5, 0], ["ERR", 0, 8, 1], ["FROM", 5, 0, 0], ["FOE", 5, 5, 0], ["FOR", 0, 1, 1]], "emo fer fro ore ref"], ["RENIPS", [["SNIPER", 3, 0, 0], ["SPIN", 0, 1, 1], ["RISE", 0, 4, 1], ["PINE", 1, 3, 0], ["PEN", 0, 6, 1], ["PER", 3, 3, 1], ["PIE", 0, 6, 0], ["RIP", 3, 5, 1], ["PIN", 5, 5, 0], ["SIR", 5, 1, 0]], "ins ire nip nips pens pier piers pies pines pins rein reins rep reps resin rinse ripe ripen rips risen sin sine sip sire siren snip snipe spine spire"], ["BRMCAEE", [["EMBRACE", 1, 0, 0], ["BECAME", 0, 6, 1], ["CAME", 0, 4, 1], ["BEAR", 0, 0, 1], ["ERA", 3, 4, 0], ["RACE", 5, 3, 0], ["ARE", 4, 3, 1], ["BAR", 1, 2, 1], ["CARE", 6, 0, 0], ["CAR", 5, 5, 1]], "ace acme acre amber arc arm bare beam bee berm brace cab cam camber crab cram cream ear ember ere mace mar mare mere ram ream"], ["ROEKCOD", [["CROOKED", 4, 0, 0], ["COOKED", 2, 2, 1], ["DOOR", 4, 6, 1], ["DECK", 2, 0, 0], ["ROCK", 6, 5, 0], ["COOK", 3, 8, 1], ["ROD", 7, 0, 0], ["CODE", 1, 5, 1], ["CORE", 1, 5, 0], ["ORE", 0, 7, 1]], "cod coed coke coo cooker cord cork credo crook decor doc dock doe doer dork ode odor orc red redo rocked rode rodeo roe rood rook"], ["RCTTATA", [["ATTRACT", 4, 0, 0], ["ART", 2, 2, 1], ["TRACT", 2, 0, 0], ["ARC", 0, 3, 1], ["CART", 0, 2, 0], ["TART", 1, 6, 1], ["CAT", 0, 0, 1], ["CAR", 4, 5, 1], ["RAT", 4, 3, 1], ["TAR", 6, 3, 0]], "act carat tact tat"], ["TVPECAI", [["CAPTIVE", 2, 0, 0], ["ACTIVE", 1, 0, 1], ["VICE", 5, 0, 0], ["ACT", 4, 2, 1], ["VIA", 2, 5, 1], ["EAT", 4, 4, 0], ["CAT", 0, 3, 1], ["ICE", 0, 6, 1], ["TIE", 4, 6, 1], ["TIP", 0, 5, 0]], "ace ape apt ate cap cape cave cite epic eta evict pace pact pat pate pave pea peat pet pica pie pit pita tap tape tea tic vat vet vie"], ["STNFAIN", [["INFANTS", 0, 0, 0], ["SAINT", 0, 6, 1], ["FAST", 0, 2, 1], ["FIT", 3, 0, 0], ["FAN", 3, 4, 0], ["FANS", 3, 4, 1], ["SIN", 5, 2, 0], ["FAT", 3, 0, 1], ["SIT", 6, 4, 0], ["SAT", 5, 2, 1]], "aft ant anti ants fain faint faints fats fiat fin fins fist fits ifs infant inn inns ins its nit satin sift stain tan tans tin tins"], ["RDNBSA", [["BRANDS", 2, 0, 0], ["BAND", 0, 3, 1], ["SAND", 2, 5, 1], ["BAD", 2, 0, 1], ["BAR", 0, 1, 1], ["BRAND", 5, 1, 0], ["BARS", 0, 3, 0], ["AND", 3, 5, 0], ["SAD", 1, 7, 1], ["RAN", 5, 2, 1]], "ads ban bands bans bard bards barn barns brad bran dab dabs darn drab nab"], ["ERAYLP", [["REPLAY", 4, 0, 0], ["EARLY", 2, 0, 1], ["PLAYER", 1, 5, 1], ["REAL", 2, 2, 0], ["PAY", 4, 2, 1], ["ARE", 0, 3, 1], ["PER", 1, 5, 0], ["PLAY", 0, 1, 0], ["RAY", 1, 7, 1], ["YEAR", 6, 2, 0]], "ale ape aye ear earl era lap lay layer lea leap lye lyre pal pale paler par pare parley payer pea peal pear pearl pearly plea ply pray prey pry pyre rap reap relay rely rep repay reply rye yap yea yelp yep"], ["HTDCEWA", [["WATCHED", 7, 1, 0], ["WATCH", 3, 5, 1], ["EACH", 4, 4, 0], ["EAT", 5, 3, 1], ["THE", 5, 1, 0], ["HEAD", 4, 7, 1], ["HEAT", 2, 1, 1], ["WHAT", 2, 0, 0], ["DATE", 0, 3, 1], ["HAD", 0, 1, 0]], "ace aced ache ached act acted ate awe awed cad cadet cat caw chat cheat chew detach dew eta etch hat hated haw hew tad tea teach thaw thawed wad wade wed wet wheat whet"], ["NRMAUUI", [["URANIUM", 2, 2, 0], ["RUIN", 1, 7, 1], ["RAIN", 4, 4, 0], ["MAN", 0, 5, 1], ["RAM", 0, 3, 0], ["RUN", 1, 2, 1], ["AIM", 4, 5, 1], ["MAIN", 6, 5, 0], ["RAN", 3, 0, 0], ["ARM", 3, 1, 1]], "air mar rim urn"], ["WTOKOUR", [["WORKOUT", 4, 0, 0], ["ROOT", 1, 6, 1], ["TOUR", 1, 3, 0], ["TOOK", 1, 3, 1], ["TOO", 2, 1, 0], ["ROW", 4, 2, 1], ["WORK", 6, 2, 0], ["OUT", 0, 1, 1], ["TWO", 3, 0, 1], ["OUR", 4, 4, 1]], "rook rot rout rut tor tow wok woo wot"], ["WDNOER", [["WONDER", 2, 0, 0], ["DONE", 2, 3, 1], ["DOWN", 4, 0, 0], ["ONE", 4, 1, 1], ["NOW", 0, 0, 1], ["WORD", 0, 5, 1], ["END", 5, 3, 0], ["RED", 6, 0, 0], ["WON", 0, 2, 1], ["OWN", 0, 4, 0]], "den dew doe doer don downer drew drone drown endow eon nerd new nod node nor ode ore owe owed owned owner redo rend rod rode roe row rowed wed wen woe wore worn wren"], ["LSLOAW", [["ALLOWS", 2, 0, 0], ["LAWS", 2, 2, 1], ["ALLOW", 2, 0, 1], ["ALSO", 0, 5, 1], ["ALL", 0, 1, 1], ["LOW", 4, 0, 0], ["SLOW", 5, 2, 0], ["WALL", 0, 0, 0], ["WAS", 5, 5, 1], ["LAW", 5, 3, 1]], "awl lows owl owls saw slaw sol sow walls"], ["UPAROLP", [["POPULAR", 4, 0, 0], ["POLAR", 0, 6, 1], ["ORAL", 1, 4, 1], ["POUR", 2, 1, 0], ["POP", 0, 1, 1], ["PAR", 0, 1, 0], ["PRO", 4, 0, 1], ["PAL", 4, 2, 1], ["LAP", 6, 2, 0], ["OUR", 1, 6, 0]], "lop oar opal pap plop pol poplar prop pulp pup pupa rap"], ["YOLULD", [["LOUDLY", 7, 0, 0], ["LOUD", 4, 3, 1], ["DOLLY", 4, 0, 0], ["DULL", 4, 0, 1], ["DOLL", 1, 2, 1], ["DUO", 2, 0, 0], ["DULY", 1, 2, 0], ["OLD", 0, 0, 1], ["YOU", 1, 5, 1]], ""], ["HBPOIS", [["BISHOP", 0, 1, 0], ["HIPS", 0, 4, 1], ["SHIP", 2, 1, 0], ["SIP", 3, 4, 0], ["HOPS", 2, 2, 1], ["SHOP", 5, 2, 0], ["HIP", 4, 0, 0], ["HIS", 4, 0, 1], ["HOP", 5, 3, 1], ["BOP", 7, 1, 0]], "bosh hob poi posh sob sop"], ["OEATFOG", [["FOOTAGE", 2, 2, 0], ["AGE", 2, 6, 1], ["EAT", 4, 6, 0], ["FOOT", 2, 2, 1], ["GET", 0, 5, 1], ["FAT", 5, 0, 0], ["GATE", 0, 5, 0], ["TOO", 3, 0, 0], ["AGO", 0, 3, 1], ["TEA", 0, 1, 0]], "afoot aft ate ego eta fate feat feta foe fog goat goo goof got oat oft tag toe tog toga"], ["KCRLEO", [["LOCKER", 2, 0, 0], ["ROLE", 2, 5, 1], ["CLERK", 2, 2, 1], ["CORK", 5, 0, 0], ["ORE", 0, 4, 1], ["CORE", 0, 3, 0], ["LORE", 4, 5, 0], ["COKE", 1, 8, 1], ["ROCK", 4, 7, 1], ["ELK", 1, 0, 1]], "lock orc roe"], ["TUECBJS", [["SUBJECT", 2, 2, 0], ["BEST", 0, 2, 1], ["SUB", 0, 4, 1], ["SET", 0, 8, 1], ["BUS", 0, 2, 0], ["USE", 0, 6, 1], ["JUST", 2, 5, 1], ["CUT", 5, 3, 0], ["CUTE", 2, 7, 1], ["BUT", 3, 0, 0]], "bet bets bust buts cub cube cubes cubs cue cues cuts jest jet jets jut jute sect stub sue suet tub tube tubes tubs"], ["OETVYLN", [["NOVELTY", 3, 0, 0], ["LOVE", 0, 3, 1], ["ONLY", 0, 6, 1], ["ONE", 2, 0, 1], ["NOTE", 0, 5, 0], ["NOT", 1, 2, 0], ["VOTE", 3, 2, 1], ["YET", 6, 1, 0], ["LET", 3, 4, 1], ["TEN", 5, 4, 0]], "envoy envy eon lent levy lone lot lye net noel novel oven toe ton tone tony toy vent vet veto vole volt yen yon"], ["NRCOAB", [["CARBON", 2, 0, 0], ["BORN", 2, 3, 1], ["CAR", 2, 0, 1], ["CAN", 5, 1, 0], ["ROB", 4, 3, 0], ["ARC", 5, 2, 1], ["BAR", 4, 5, 1], ["BAN", 0, 5, 1], ["CON", 7, 2, 0], ["NOR", 0, 2, 1]], "acorn bacon barn baron boa boar bran cab cob cobra corn crab nab narc oar orb orc ran roan"], ["KEBCDA", [["BACKED", 2, 0, 0], ["BAKED", 0, 3, 1], ["DECK", 2, 5, 1], ["CAKE", 1, 1, 1], ["BEAD", 4, 0, 0], ["BAKE", 0, 3, 0], ["BAD", 4, 0, 1], ["CAB", 4, 5, 0], ["BED", 4, 7, 1], ["ACE", 4, 2, 1]], "abed aced back bade beak beck cad caked dab deb"], ["GTLSIH", [["SLIGHT", 2, 1, 0], ["LIGHTS", 0, 4, 1], ["SIGHT", 4, 0, 0], ["THIS", 2, 6, 1], ["LIST", 0, 4, 0], ["LIGHT", 2, 2, 1], ["HITS", 6, 0, 0], ["SIT", 5, 6, 0], ["HIT", 3, 8, 1], ["HIS", 0, 1, 1]], "gilt gist hilt its lit sigh silt slit"], ["STLCOEO", [["COOLEST", 2, 0, 0], ["CLOSE", 0, 2, 1], ["TOO", 2, 6, 1], ["LET", 1, 4, 1], ["COOL", 2, 0, 1], ["LOST", 4, 5, 0], ["LOSE", 4, 5, 1], ["COST", 1, 8, 1], ["LOTS", 6, 2, 0], ["SET", 4, 7, 1]], "closet clot clots colt colts coo cools coos coot coots cot cote cots lest lets loco loose loot lot scoot sect slot sol sole solo soot sot stole stool toe toes tool tools"], ["ISLTFHG", [["FLIGHTS", 5, 1, 0], ["FIGHT", 1, 6, 1], ["THIS", 2, 4, 0], ["FISH", 4, 3, 1], ["HIS", 5, 5, 1], ["HIT", 0, 4, 1], ["LIGHT", 0, 1, 0], ["FIT", 5, 1, 1], ["LIST", 0, 1, 1], ["ITS", 3, 0, 0]], "fig fights figs filth fist fits flight flit gift gifts gilt gist hilt hits ifs lift lifts lights lit shift sift sigh sight silt sit slight slit"], ["NGBIOOK", [["BOOKING", 4, 2, 0], ["BINGO", 0, 4, 1], ["KING", 2, 2, 0], ["KIN", 2, 7, 1], ["ION", 4, 6, 1], ["BOO", 4, 2, 1], ["BOOK", 0, 4, 0], ["KNOB", 6, 5, 0], ["INK", 0, 2, 1], ["BIN", 1, 0, 0]], "big bog bongo booing boon gob goo goon nib nook"], ["OTDSOCR", [["DOCTORS", 2, 0, 0], ["DOORS", 0, 4, 1], ["DOCTOR", 0, 2, 1], ["STOOD", 2, 6, 1], ["ROOTS", 4, 0, 0], ["COST", 5, 5, 0], ["SORT", 2, 8, 1], ["ROOT", 4, 0, 1], ["TOO", 7, 0, 0], ["DOOR", 0, 4, 0]], "cod coo coos coot coots cord cords cot cots doc docs dos dot dots odor odors orc orcs rod rods rood roost rot rots scoot sod soot sot tor torso trod"], ["SSETAT", [["TASTES", 2, 0, 0], ["STATES", 1, 0, 1], ["STATE", 2, 2, 1], ["TASTE", 5, 2, 0], ["TEST", 0, 5, 1], ["SEAT", 0, 2, 0], ["SET", 4, 6, 1], ["EAST", 1, 5, 0], ["SEA", 1, 7, 1], ["EAT", 0, 3, 1]], "asset ate eats eta sat sate seas seats sets stats tat tats tea teas teat tests"]];
  var dayN = function dayN() {
    var _KEY$split$map = KEY.split("-").map(Number),
      _KEY$split$map2 = _slicedToArray(_KEY$split$map, 3),
      y = _KEY$split$map2[0],
      m = _KEY$split$map2[1],
      d = _KEY$split$map2[2];
    return Math.round((Date.UTC(y, m - 1, d) - Date.UTC(2026, 10, 8)) / 864e5);
  };
  var pIdx = function pIdx() {
    return (dayN() % PUZ.length + PUZ.length) % PUZ.length;
  };
  var rk = function rk() {
    return "bdd:den:scapes:" + KEY + ":" + (me ? me.id : "");
  };
  var rr = function rr(c, x, y, w, h, r) {
    c.beginPath();
    if (c.roundRect) c.roundRect(x, y, w, h, r);else c.rect(x, y, w, h);
  };
  var cellsOf = function cellsOf(_ref) {
    var _ref2 = _slicedToArray(_ref, 4),
      w = _ref2[0],
      r = _ref2[1],
      c = _ref2[2],
      d = _ref2[3];
    return w.split("").map(function (ch, k) {
      return (d ? r + k : r) + "," + (d ? c : c + k);
    });
  };
  var BMAX = 6;
  var scoreOf = function scoreOf(s) {
    return s.done ? Math.max(300, 700 - 50 * s.hints) + 50 * Math.min(BMAX, s.bonus.length) : 0;
  };
  var seeded = function seeded(n) {
    var x = n * 2654435761 % 4294967296;
    return function () {
      return (x = (x * 1664525 + 1013904223) % 4294967296) / 4294967296;
    };
  };
  defGame({
    key: "scapes",
    name: "Dawgscapes",
    icon: "🍂",
    max: 1000,
    cat: "den",
    puzzle: true,
    blurb: "Daily: swipe the letters to fill the crossword.",
    how: "Drag your finger from letter to letter on the wheel to spell a word, then let go. Words that fit the crossword drop into place. Every word uses only the wheel's letters, each letter once. Slide back over a letter to undo it. Real words that aren't in the crossword count as bonus words (🔍). 🔀 shuffles the wheel for a fresh look. 💡 shows one letter (it costs 50 pts). One board a day. Score: 700 for filling the board, minus 50 per hint (never below 300), plus 50 per bonus word, up to 6.",
    reset: function reset(G) {
      var _PUZ$pIdx = _slicedToArray(PUZ[pIdx()], 3),
        wheel = _PUZ$pIdx[0],
        words = _PUZ$pIdx[1],
        bonus = _PUZ$pIdx[2];
      var s = G.s = {
        wheel: wheel.split(""),
        words: words,
        bonusSet: new Set(bonus ? bonus.split(" ") : []),
        path: [],
        px: 0,
        py: 0,
        drag: false,
        msg: "",
        msgT: 0,
        btns: [],
        spots: [],
        postT: 0,
        pop: {},
        shake: 0,
        flash: null
      };
      var r = store.get(rk());
      Object.assign(s, {
        found: [],
        shown: [],
        bonus: [],
        hints: 0,
        done: false,
        posted: false,
        order: null
      });
      if (r && r.found) Object.assign(s, {
        found: r.found,
        shown: r.shown || [],
        bonus: r.bonus || [],
        hints: r.hints || 0,
        done: r.done,
        posted: r.posted,
        order: r.order || null
      });
      if (s.order && s.order.length === s.wheel.length) s.wheel = s.order.slice();
      s.cell = {};
      words.forEach(function (wd) {
        return cellsOf(wd).forEach(function (k, i) {
          s.cell[k] = wd[0][i];
        });
      });
      s.rows = Math.max.apply(null, words.map(function (_ref3) {
        var _ref4 = _slicedToArray(_ref3, 4),
          w = _ref4[0],
          r = _ref4[1],
          c = _ref4[2],
          d = _ref4[3];
        return r + (d ? w.length : 1);
      }));
      s.cols = Math.max.apply(null, words.map(function (_ref5) {
        var _ref6 = _slicedToArray(_ref5, 4),
          w = _ref6[0],
          r = _ref6[1],
          c = _ref6[2],
          d = _ref6[3];
        return c + (d ? 1 : w.length);
      }));
    },
    persist: function persist(G) {
      var s = G.s;
      store.set(rk(), {
        found: s.found,
        shown: s.shown,
        bonus: s.bonus,
        hints: s.hints,
        done: s.done,
        posted: s.posted,
        order: s.wheel,
        n: s.words.length,
        score: scoreOf(s)
      });
    },
    open: function open(s) {
      var o = new Set(s.shown);
      s.words.forEach(function (wd) {
        if (s.found.indexOf(wd[0]) >= 0) cellsOf(wd).forEach(function (k) {
          return o.add(k);
        });
      });
      return o;
    },
    settle: function settle(G) {
      var s = G.s,
        o = this.open(s);
      s.words.forEach(function (wd) {
        if (s.found.indexOf(wd[0]) < 0 && cellsOf(wd).every(function (k) {
          return o.has(k);
        })) s.found.push(wd[0]);
      });
      if (!s.done && s.found.length === s.words.length) {
        s.done = true;
        s.postT = 1.3;
        s.msg = s.hints ? "Board filled!" : "No hints. Big Dawg!";
        s.msgT = 1.6;
        G.sfx("win");
      }
      this.persist(G);
    },
    info: function info(G) {
      var s = G.s,
        sc = scoreOf(s),
        nb = s.bonus.length;
      return {
        score: sc,
        title: s.hints ? "Board filled!" : "Clean sweep! 🐶",
        sub: "".concat(s.words.length, " words \xB7 ").concat(nb, " bonus \xB7 ").concat(s.hints, " hint").concat(s.hints === 1 ? "" : "s", " \xB7 ").concat(sc, " pts."),
        share: "Dawgscapes #".concat(dayN() + 1, " \uD83C\uDF42\n\u2705 ").concat(s.words.length, " words \xB7 \uD83D\uDD0D ").concat(nb, " bonus \xB7 \uD83D\uDCA1 ").concat(s.hints, "\n").concat(sc, " pts")
      };
    },
    submit: function submit(G) {
      var s = G.s,
        w = s.path.map(function (i) {
          return s.wheel[i];
        }).join("");
      s.path = [];
      if (w.length < 3) return;
      var lw = w.toLowerCase(),
        wd = s.words.find(function (x) {
          return x[0] === w;
        });
      if (wd) {
        if (s.found.indexOf(w) >= 0) {
          s.msg = "Already found";
          s.msgT = 0.9;
          s.flash = {
            w: w,
            t: 0.5
          };
          return;
        }
        s.found.push(w);
        cellsOf(wd).forEach(function (k, i) {
          s.pop[k] = 0.35 + i * 0.05;
        });
        G.sfx("pop");
        this.settle(G);
        return;
      }
      if (s.bonusSet.has(lw)) {
        if (s.bonus.indexOf(lw) >= 0) {
          s.msg = "Already found";
          s.msgT = 0.9;
          return;
        }
        s.bonus.push(lw);
        s.msg = s.bonus.length <= BMAX ? "Bonus word! +50" : "Bonus word!";
        s.msgT = 1.1;
        G.sfx("pass");
        this.persist(G);
        return;
      }
      s.shake = 0.35;
      s.msg = "Not a word here";
      s.msgT = 0.8;
      s.bad = w;
    },
    hint: function hint(G) {
      var s = G.s;
      if (s.done) return;
      var o = this.open(s);
      var left = s.words.filter(function (wd) {
        return s.found.indexOf(wd[0]) < 0;
      });
      if (!left.length) return;
      left.sort(function (a, b) {
        return a[0].length - b[0].length;
      });
      var k = cellsOf(left[0]).find(function (k) {
        return !o.has(k);
      });
      if (!k) return;
      s.shown.push(k);
      s.hints++;
      s.pop[k] = 0.4;
      G.sfx("pop");
      this.settle(G);
    },
    shuffle: function shuffle(G) {
      var s = G.s;
      if (s.path.length) return;
      var rnd = seeded(Date.now() % 100000 + 7);
      for (var i = s.wheel.length - 1; i > 0; i--) {
        var j = Math.floor(rnd() * (i + 1));
        var _ref7 = [s.wheel[j], s.wheel[i]];
        s.wheel[i] = _ref7[0];
        s.wheel[j] = _ref7[1];
      }
      this.persist(G);
    },
    update: function update(G, dt) {
      var s = G.s;
      if (s.msgT > 0) s.msgT -= dt;
      if (s.shake > 0) s.shake -= dt;
      if (s.flash) {
        s.flash.t -= dt;
        if (s.flash.t <= 0) s.flash = null;
      }
      Object.keys(s.pop).forEach(function (k) {
        s.pop[k] -= dt;
        if (s.pop[k] <= 0) delete s.pop[k];
      });
      if (s.done && !s.posted && s.postT > 0) {
        s.postT -= dt;
        if (s.postT <= 0) {
          s.posted = true;
          this.persist(G);
          G.post(scoreOf(s), this.info(G));
        }
      }
    },
    draw: function draw(G, c) {
      var s = G.s,
        dk = G.dark(),
        ink = dk ? "#fff" : "#121213",
        W = G.W,
        H = G.H;
      s.btns = [];
      s.spots = [];
      var g = c.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, dk ? "#3a2412" : "#f6c27a");
      g.addColorStop(0.55, dk ? "#2b2a14" : "#e8a24a");
      g.addColorStop(1, dk ? "#14200f" : "#6d8f3c");
      c.fillStyle = g;
      c.fillRect(0, 0, W, H);
      c.textAlign = "center";
      c.textBaseline = "middle";
      var o = this.open(s),
        wheelH = Math.min(H * 0.42, 330),
        topY = 16,
        gridH = H - wheelH - topY - 70;
      var cs = Math.min(46, (W - 28) / s.cols, gridH / s.rows),
        gap = cs * 0.08;
      var gx = (W - s.cols * cs) / 2,
        gy = topY + Math.max(0, (gridH - s.rows * cs) / 2);
      Object.keys(s.cell).forEach(function (k) {
        var _k$split$map = k.split(",").map(Number),
          _k$split$map2 = _slicedToArray(_k$split$map, 2),
          r = _k$split$map2[0],
          cc = _k$split$map2[1],
          x = gx + cc * cs + gap / 2,
          y = gy + r * cs + gap / 2,
          w = cs - gap;
        var p = s.pop[k] > 0 ? 1 + Math.sin(Math.min(1, s.pop[k] / 0.35) * Math.PI) * 0.12 : 1;
        var ww = w * p,
          ox = x + (w - ww) / 2,
          oy = y + (w - ww) / 2;
        rr(c, ox, oy, ww, ww, w * 0.14);
        var isOpen = o.has(k),
          isHint = isOpen && s.shown.indexOf(k) >= 0 && !s.words.some(function (wd) {
            return s.found.indexOf(wd[0]) >= 0 && cellsOf(wd).indexOf(k) >= 0;
          });
        c.fillStyle = isOpen ? isHint ? "#e9ba3a" : "#5bbd4a" : "rgba(255,255,255,0.82)";
        c.fill();
        if (isOpen) {
          c.fillStyle = "#fff";
          c.font = "800 ".concat(Math.round(w * 0.6), "px ").concat(G.UI);
          c.fillText(s.cell[k], x + w / 2, y + w / 2 + 1);
        }
      });
      var cur = s.path.map(function (i) {
          return s.wheel[i];
        }).join(""),
        wy = H - wheelH - 34;
      if (cur || s.shake > 0 && s.bad) {
        var t = cur || s.bad,
          dx = s.shake > 0 ? Math.sin(s.shake * 60) * 6 : 0;
        c.font = "800 26px ".concat(G.UI);
        var tw = c.measureText(t).width + 28;
        c.fillStyle = s.shake > 0 ? "#d9534f" : "#ff8a2a";
        rr(c, W / 2 - tw / 2 + dx, wy - 20, tw, 40, 12);
        c.fill();
        c.fillStyle = "#fff";
        c.fillText(t, W / 2 + dx, wy + 1);
      } else if (s.msgT > 0 && s.msg) {
        c.save();
        c.globalAlpha = Math.min(1, s.msgT * 2);
        c.font = "700 16px ".concat(G.UI);
        var mw = c.measureText(s.msg).width + 28;
        c.fillStyle = "rgba(0,0,0,0.55)";
        rr(c, W / 2 - mw / 2, wy - 18, mw, 36, 18);
        c.fill();
        c.fillStyle = "#fff";
        c.fillText(s.msg, W / 2, wy + 1);
        c.restore();
      }
      var R = Math.min(W * 0.28, wheelH * 0.38, W / 2 - 86),
        cx = W / 2,
        cy = H - wheelH / 2 - 8;
      if (s.done) {
        c.fillStyle = "rgba(255,255,255,0.9)";
        c.beginPath();
        c.arc(cx, cy, R + 26, 0, Math.PI * 2);
        c.fill();
        c.fillStyle = "#121213";
        c.font = "800 22px ".concat(G.UI);
        c.fillText(s.hints ? "Board filled!" : "Clean sweep! 🐶", cx, cy - 40);
        c.font = "600 15px ".concat(G.UI);
        c.fillText("\uD83D\uDD0D ".concat(s.bonus.length, " bonus \xB7 \uD83D\uDCA1 ").concat(s.hints, " hint").concat(s.hints === 1 ? "" : "s"), cx, cy - 10);
        c.font = "800 20px ".concat(G.UI);
        c.fillText("".concat(scoreOf(s), " pts"), cx, cy + 16);
        if (s.posted) {
          var bw = Math.min(200, R * 1.6);
          s.btns.push(Object.assign(G.pill(c, cx - bw / 2, cy + 38, bw, 42, "See results", true), {
            k: "res"
          }));
        }
        return;
      }
      c.fillStyle = "rgba(255,255,255,0.9)";
      c.beginPath();
      c.arc(cx, cy, R + 26, 0, Math.PI * 2);
      c.fill();
      var n = s.wheel.length,
        lr = Math.max(18, Math.min(30, R * 0.36));
      var pos = s.wheel.map(function (ch, i) {
        var a = -Math.PI / 2 + i * 2 * Math.PI / n;
        return [cx + Math.cos(a) * R, cy + Math.sin(a) * R];
      });
      if (s.path.length) {
        c.strokeStyle = "#ff8a2a";
        c.lineWidth = 10;
        c.lineCap = "round";
        c.lineJoin = "round";
        c.beginPath();
        s.path.forEach(function (i, k) {
          return k ? c.lineTo(pos[i][0], pos[i][1]) : c.moveTo(pos[i][0], pos[i][1]);
        });
        if (s.drag) c.lineTo(s.px, s.py);
        c.stroke();
      }
      s.wheel.forEach(function (ch, i) {
        var _pos$i = _slicedToArray(pos[i], 2),
          x = _pos$i[0],
          y = _pos$i[1],
          on = s.path.indexOf(i) >= 0;
        if (on) {
          c.fillStyle = "#ff8a2a";
          c.beginPath();
          c.arc(x, y, lr, 0, Math.PI * 2);
          c.fill();
        }
        c.fillStyle = on ? "#fff" : "#121213";
        c.font = "800 ".concat(Math.round(lr * 1.35), "px ").concat(G.UI);
        c.fillText(ch, x, y + 2);
        s.spots.push({
          x: x,
          y: y,
          r: lr * 1.05,
          i: i
        });
      });
      var br = 22,
        bx1 = Math.max(br + 10, cx - R - 26 - br - 14),
        bx2 = Math.min(W - br - 10, cx + R + 26 + br + 14);
      var btn = function btn(x, y, label, k, sub) {
        c.fillStyle = "rgba(255,255,255,0.92)";
        c.beginPath();
        c.arc(x, y, br, 0, Math.PI * 2);
        c.fill();
        c.fillStyle = "#121213";
        c.font = "20px ".concat(G.UI);
        c.fillText(label, x, y + 1);
        if (sub) {
          c.font = "700 11px ".concat(G.UI);
          c.fillStyle = dk ? "#fff" : "#121213";
          c.fillText(sub, x, y + br + 10);
        }
        s.btns.push({
          x: x - br,
          y: y - br,
          w: br * 2,
          h: br * 2,
          k: k
        });
      };
      btn(bx1, cy - 30, "🔀", "shuf");
      btn(bx2, cy - 30, "💡", "hint", "−50");
      btn(bx1, cy + 40, "🔍", "bonus", "".concat(s.bonus.length));
      c.font = "600 13px ".concat(G.UI);
      c.fillStyle = dk ? "#fff" : "#121213";
      c.fillText("".concat(s.found.length, " of ").concat(s.words.length), bx2, cy + 40);
    },
    hit: function hit(G, x, y) {
      var s = G.s;
      return s.spots.find(function (p) {
        return Math.hypot(x - p.x, y - p.y) <= p.r;
      });
    },
    down: function down(G, x, y) {
      var s = G.s;
      if (s.done) return;
      var p = this.hit(G, x, y);
      if (p) {
        s.drag = true;
        s.path = [p.i];
        s.px = x;
        s.py = y;
        s.shake = 0;
      }
    },
    move: function move(G, x, y) {
      var s = G.s;
      if (!s.drag) return;
      s.px = x;
      s.py = y;
      var p = this.hit(G, x, y);
      if (!p) return;
      var L = s.path.length;
      if (L >= 2 && s.path[L - 2] === p.i) {
        s.path.pop();
        return;
      }
      if (s.path.indexOf(p.i) < 0) s.path.push(p.i);
    },
    up: function up(G) {
      var s = G.s;
      if (!s.drag) return;
      s.drag = false;
      this.submit(G);
    },
    tap: function tap(G, x, y) {
      var s = G.s,
        b = s.btns.find(function (b) {
          return x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h;
        });
      if (!b) return;
      if (b.k === "res") return G.results(this.info(G));
      if (b.k === "shuf") return this.shuffle(G);
      if (b.k === "hint") return this.hint(G);
      if (b.k === "bonus") {
        s.msg = s.bonus.length ? s.bonus.slice(-4).join(" · ").toUpperCase() : "No bonus words yet";
        s.msgT = 2;
      }
    }
  });
})();