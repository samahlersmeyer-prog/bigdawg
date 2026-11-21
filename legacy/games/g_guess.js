function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
(function () {
  var TV = "Friends|1994|sitcom|NBC|b;Seinfeld|1989|sitcom|NBC|b;The Office|2005|sitcom|NBC|b;Parks and Recreation|2009|sitcom|NBC|b;Cheers|1982|sitcom|NBC|b;Frasier|1993|sitcom|NBC|b;Full House|1987|sitcom|ABC|b;Family Matters|1989|sitcom|ABC|b;Home Improvement|1991|sitcom|ABC|b;Boy Meets World|1993|sitcom|ABC|b;Saved by the Bell|1989|sitcom|NBC|b;The Fresh Prince of Bel-Air|1990|sitcom|NBC|b;Everybody Loves Raymond|1996|sitcom|CBS|b;The King of Queens|1998|sitcom|CBS|b;Two and a Half Men|2003|sitcom|CBS|b;How I Met Your Mother|2005|sitcom|CBS|b;The Big Bang Theory|2007|sitcom|CBS|b;Modern Family|2009|sitcom|ABC|b;Arrested Development|2003|sitcom|Fox|b;Malcolm in the Middle|2000|sitcom|Fox|b;That '70s Show|1998|sitcom|Fox|b;Scrubs|2001|sitcom|NBC|b;30 Rock|2006|sitcom|NBC|b;Brooklyn Nine-Nine|2013|sitcom|Fox|b;The Wonder Years|1988|sitcom|ABC|b;Growing Pains|1985|sitcom|ABC|b;Step by Step|1991|sitcom|ABC|b;Happy Days|1974|sitcom|ABC|b;M*A*S*H|1972|sitcom|CBS|b;Ted Lasso|2020|sitcom|Apple TV+|s;Curb Your Enthusiasm|2000|sitcom|HBO|c;It's Always Sunny in Philadelphia|2005|sitcom|FX|c;Abbott Elementary|2021|sitcom|ABC|b;New Girl|2011|sitcom|Fox|b;The Middle|2009|sitcom|ABC|b;Last Man Standing|2011|sitcom|ABC|b;" + "The Simpsons|1989|cartoon|Fox|b;Family Guy|1999|cartoon|Fox|b;South Park|1997|cartoon|Comedy Central|c;King of the Hill|1997|cartoon|Fox|b;Futurama|1999|cartoon|Fox|b;Bob's Burgers|2011|cartoon|Fox|b;Rugrats|1991|cartoon|Nickelodeon|k;SpongeBob SquarePants|1999|cartoon|Nickelodeon|k;Hey Arnold!|1996|cartoon|Nickelodeon|k;Doug|1991|cartoon|Nickelodeon|k;Rocko's Modern Life|1993|cartoon|Nickelodeon|k;The Fairly OddParents|2001|cartoon|Nickelodeon|k;Avatar: The Last Airbender|2005|cartoon|Nickelodeon|k;Animaniacs|1993|cartoon|Fox|k;Batman: The Animated Series|1992|cartoon|Fox|k;X-Men: The Animated Series|1992|cartoon|Fox|k;Teenage Mutant Ninja Turtles|1987|cartoon|Syndicated|k;DuckTales|1987|cartoon|Disney|k;Pok\xE9mon|1997|cartoon|Kids' WB|k;Dexter's Laboratory|1996|cartoon|Cartoon Network|k;The Powerpuff Girls|1998|cartoon|Cartoon Network|k;Ed, Edd n Eddy|1999|cartoon|Cartoon Network|k;Adventure Time|2010|cartoon|Cartoon Network|k;Bluey|2018|cartoon|Disney|k;PAW Patrol|2013|cartoon|Nickelodeon|k;Peppa Pig|2004|cartoon|Nick Jr.|k;Phineas and Ferb|2007|cartoon|Disney|k;Gravity Falls|2012|cartoon|Disney|k;Scooby-Doo, Where Are You!|1969|cartoon|CBS|k;The Flintstones|1960|cartoon|ABC|b;The Jetsons|1962|cartoon|ABC|b;" + "Yellowstone|2018|drama|Paramount|c;Breaking Bad|2008|crime|AMC|c;The Sopranos|1999|crime|HBO|c;Game of Thrones|2011|fantasy|HBO|c;Lost|2004|scifi|ABC|b;Grey's Anatomy|2005|drama|ABC|b;ER|1994|drama|NBC|b;The West Wing|1999|drama|NBC|b;Friday Night Lights|2006|drama|NBC|b;This Is Us|2016|drama|NBC|b;Stranger Things|2016|scifi|Netflix|s;The Walking Dead|2010|scifi|AMC|c;Mad Men|2007|drama|AMC|c;The X-Files|1993|scifi|Fox|b;Prison Break|2005|crime|Fox|b;House|2004|drama|Fox|b;Law & Order|1990|crime|NBC|b;NCIS|2003|crime|CBS|b;CSI: Crime Scene Investigation|2000|crime|CBS|b;Criminal Minds|2005|crime|CBS|b;Dallas|1978|drama|CBS|b;Beverly Hills, 90210|1990|drama|Fox|b;Dawson's Creek|1998|drama|The WB|b;Gilmore Girls|2000|drama|The WB|b;Smallville|2001|scifi|The WB|b;Buffy the Vampire Slayer|1997|scifi|The WB|b;The Crown|2016|drama|Netflix|s;The Mandalorian|2019|scifi|Disney+|s;Succession|2018|drama|HBO|c;Ozark|2017|crime|Netflix|s;Squid Game|2021|drama|Netflix|s;The Wire|2002|crime|HBO|c;Star Trek: The Next Generation|1987|scifi|Syndicated|b;Baywatch|1989|drama|NBC|b;Walker, Texas Ranger|1993|crime|CBS|b;Little House on the Prairie|1974|drama|NBC|b;" + "Survivor|2000|reality|CBS|b;The Amazing Race|2001|reality|CBS|b;American Idol|2002|reality|Fox|b;The Bachelor|2002|reality|ABC|b;Dancing with the Stars|2005|reality|ABC|b;Shark Tank|2009|reality|ABC|b;Duck Dynasty|2012|reality|A&E|c;Pawn Stars|2009|reality|History|c;Cops|1989|reality|Fox|b;MythBusters|2003|reality|Discovery|c;Jeopardy!|1984|game|Syndicated|b;Wheel of Fortune|1975|game|Syndicated|b;The Price Is Right|1972|game|CBS|b;Family Feud|1976|game|ABC|b;America's Funniest Home Videos|1989|variety|ABC|b;Saturday Night Live|1975|variety|NBC|b;Sesame Street|1969|kids|PBS|p;Mister Rogers' Neighborhood|1968|kids|PBS|p;Barney & Friends|1992|kids|PBS|p;Blue's Clues|1996|kids|Nickelodeon|k;Bill Nye the Science Guy|1993|kids|PBS|p;Reading Rainbow|1983|kids|PBS|p;Arthur|1996|cartoon|PBS|p;SportsCenter|1979|sports|ESPN|c";
  var MOV = "Toy Story|1995|animated|f;Finding Nemo|2003|animated|f;The Incredibles|2004|animated|f;Up|2009|animated|f;Inside Out|2015|animated|f;Cars|2006|animated|f;Monsters, Inc.|2001|animated|f;WALL-E|2008|animated|f;Coco|2017|animated|f;Ratatouille|2007|animated|f;The Lion King|1994|animated|f;Aladdin|1992|animated|f;Beauty and the Beast|1991|animated|f;The Little Mermaid|1989|animated|f;Frozen|2013|animated|f;Moana|2016|animated|f;Encanto|2021|animated|f;Shrek|2001|animated|f;Kung Fu Panda|2008|animated|f;Madagascar|2005|animated|f;How to Train Your Dragon|2010|animated|f;Despicable Me|2010|animated|f;The Lego Movie|2014|animated|f;" + "Space Jam|1996|sports|f;Star Wars|1977|scifi|f;The Empire Strikes Back|1980|scifi|f;Jurassic Park|1993|scifi|a;Jaws|1975|thriller|a;E.T. the Extra-Terrestrial|1982|scifi|f;Back to the Future|1985|scifi|f;Raiders of the Lost Ark|1981|action|a;Top Gun|1986|action|a;Top Gun: Maverick|2022|action|a;Die Hard|1988|action|a;The Terminator|1984|scifi|a;Terminator 2: Judgment Day|1991|scifi|a;The Matrix|1999|scifi|a;Titanic|1997|drama|a;Avatar|2009|scifi|a;The Avengers|2012|superhero|a;Iron Man|2008|superhero|a;Black Panther|2018|superhero|a;Spider-Man|2002|superhero|a;The Dark Knight|2008|superhero|a;Batman|1989|superhero|a;Superman|1978|superhero|f;Ghostbusters|1984|comedy|a;Independence Day|1996|scifi|a;Men in Black|1997|scifi|a;Armageddon|1998|action|a;Twister|1996|action|a;Gladiator|2000|action|a;Braveheart|1995|war|a;Forrest Gump|1994|drama|a;The Shawshank Redemption|1994|drama|a;" + "Rocky|1976|sports|a;Hoosiers|1986|sports|f;Rudy|1993|sports|f;The Sandlot|1993|sports|f;Field of Dreams|1989|sports|f;A League of Their Own|1992|sports|f;Remember the Titans|2000|sports|f;Major League|1989|sports|a;The Mighty Ducks|1992|sports|f;Cool Runnings|1993|sports|f;Caddyshack|1980|comedy|a;Happy Gilmore|1996|comedy|a;Home Alone|1990|holiday|f;Elf|2003|holiday|f;National Lampoon's Christmas Vacation|1989|holiday|a;A Christmas Story|1983|holiday|f;Groundhog Day|1993|comedy|a;Dumb and Dumber|1994|comedy|a;Ferris Bueller's Day Off|1986|comedy|a;The Princess Bride|1987|fantasy|f;The Goonies|1985|action|f;Harry Potter and the Sorcerer's Stone|2001|fantasy|f;The Lord of the Rings: The Fellowship of the Ring|2001|fantasy|a;The Wizard of Oz|1939|musical|f;The Sound of Music|1965|musical|f;Grease|1978|musical|a;Mary Poppins|1964|musical|f;The Greatest Showman|2017|musical|f;Pirates of the Caribbean|2003|action|f;Jumanji|1995|fantasy|f;Night at the Museum|2006|comedy|f;" + "Napoleon Dynamite|2004|comedy|f;Anchorman|2004|comedy|a;Talladega Nights|2006|comedy|a;Nacho Libre|2006|comedy|f;School of Rock|2003|comedy|f;Mrs. Doubtfire|1993|comedy|f;Ace Ventura: Pet Detective|1994|comedy|a;The Mask|1994|comedy|a;Rain Man|1988|drama|a;Apollo 13|1995|drama|a;Saving Private Ryan|1998|war|a;Cast Away|2000|drama|a;The Sixth Sense|1999|thriller|a;Jerry Maguire|1996|sports|a;Good Will Hunting|1997|drama|a;Oppenheimer|2023|drama|a;Barbie|2023|comedy|a;Inception|2010|scifi|a;Interstellar|2014|scifi|a";
  var ANI = "Dog|mammal|home|2|o;Cat|mammal|home|1|c;Hamster|mammal|home|1|h;Rabbit|mammal|farm|1|h;Horse|mammal|farm|4|h;Cow|mammal|farm|4|h;Pig|mammal|farm|3|o;Sheep|mammal|farm|3|h;Goat|mammal|farm|2|h;Chicken|bird|farm|1|o;Turkey|bird|farm|2|o;Duck|bird|lake|1|o;Goose|bird|lake|2|h;Swan|bird|lake|2|h;Lion|mammal|savanna|4|c;Tiger|mammal|jungle|4|c;Leopard|mammal|savanna|3|c;Cheetah|mammal|savanna|3|c;Elephant|mammal|savanna|5|h;Giraffe|mammal|savanna|5|h;Zebra|mammal|savanna|4|h;Rhinoceros|mammal|savanna|5|h;Hippopotamus|mammal|river|5|h;Hyena|mammal|savanna|3|c;Gorilla|mammal|jungle|4|h;Chimpanzee|mammal|jungle|3|o;Orangutan|mammal|jungle|3|h;Sloth|mammal|jungle|2|h;Jaguar|mammal|jungle|3|c;Toucan|bird|jungle|1|o;Parrot|bird|jungle|1|h;Kangaroo|mammal|grassland|3|h;Koala|mammal|forest|2|h;Panda|mammal|forest|4|h;Grizzly Bear|mammal|forest|5|o;Polar Bear|mammal|arctic|5|c;Wolf|mammal|forest|3|c;Fox|mammal|forest|2|o;Deer|mammal|forest|3|h;Moose|mammal|forest|5|h;Raccoon|mammal|forest|2|o;Squirrel|mammal|forest|1|h;Skunk|mammal|forest|1|o;Beaver|mammal|river|2|h;Otter|mammal|river|2|c;Bat|mammal|cave|1|o;Owl|bird|forest|1|c;Bald Eagle|bird|mountains|2|c;Hawk|bird|grassland|1|c;Penguin|bird|arctic|2|c;Flamingo|bird|lake|2|o;Ostrich|bird|savanna|4|o;Peacock|bird|forest|2|o;Hummingbird|bird|garden|1|h;Cardinal|bird|garden|1|h;" + "Camel|mammal|desert|4|h;Scorpion|arachnid|desert|1|c;Rattlesnake|reptile|desert|2|c;Roadrunner|bird|desert|1|c;Coyote|mammal|desert|2|o;Mountain Goat|mammal|mountains|3|h;Snow Leopard|mammal|mountains|3|c;Walrus|mammal|arctic|5|c;Seal|mammal|arctic|3|c;Arctic Fox|mammal|arctic|2|c;Reindeer|mammal|arctic|4|h;Whale|mammal|ocean|5|c;Dolphin|mammal|ocean|4|c;Shark|fish|ocean|4|c;Octopus|mollusk|ocean|2|c;Jellyfish|other|ocean|1|c;Sea Turtle|reptile|ocean|3|o;Starfish|other|ocean|1|c;Crab|crustacean|ocean|1|o;Lobster|crustacean|ocean|1|o;Clownfish|fish|ocean|1|o;Seahorse|fish|ocean|1|c;Stingray|fish|ocean|3|c;Goldfish|fish|home|1|o;Salmon|fish|river|2|c;Catfish|fish|river|2|o;Bass|fish|lake|1|c;Frog|amphibian|pond|1|c;Toad|amphibian|garden|1|c;Salamander|amphibian|pond|1|c;Alligator|reptile|swamp|4|c;Crocodile|reptile|river|5|c;Turtle|reptile|pond|1|o;Iguana|reptile|jungle|2|h;Chameleon|reptile|jungle|1|c;Python|reptile|jungle|3|c;Komodo Dragon|reptile|grassland|4|c;Bee|insect|garden|1|h;Butterfly|insect|garden|1|h;Ladybug|insect|garden|1|c;Ant|insect|garden|1|o;Grasshopper|insect|grassland|1|h;Dragonfly|insect|pond|1|c;Firefly|insect|garden|1|c;Spider|arachnid|home|1|c;Snail|mollusk|garden|1|h;Worm|other|garden|1|h;Mouse|mammal|home|1|o;Hedgehog|mammal|garden|1|o;Armadillo|mammal|grassland|2|o;Llama|mammal|mountains|4|h;Platypus|mammal|river|2|c";
  var TEAMS = "Arizona Cardinals|NFL|33.5|-112.3;Atlanta Falcons|NFL|33.8|-84.4;Baltimore Ravens|NFL|39.3|-76.6;Buffalo Bills|NFL|42.8|-78.8;Carolina Panthers|NFL|35.2|-80.9;Chicago Bears|NFL|41.9|-87.6;Cincinnati Bengals|NFL|39.1|-84.5;Cleveland Browns|NFL|41.5|-81.7;Dallas Cowboys|NFL|32.7|-97.1;Denver Broncos|NFL|39.7|-105;Detroit Lions|NFL|42.3|-83;Green Bay Packers|NFL|44.5|-88;Houston Texans|NFL|29.7|-95.4;Indianapolis Colts|NFL|39.8|-86.2;Jacksonville Jaguars|NFL|30.3|-81.6;Kansas City Chiefs|NFL|39|-94.5;Las Vegas Raiders|NFL|36.1|-115.2;Los Angeles Chargers|NFL|33.9|-118.3;Los Angeles Rams|NFL|33.9|-118.3;Miami Dolphins|NFL|25.9|-80.2;Minnesota Vikings|NFL|45|-93.3;New England Patriots|NFL|42.1|-71.3;New Orleans Saints|NFL|29.9|-90.1;New York Giants|NFL|40.8|-74.1;New York Jets|NFL|40.8|-74.1;Philadelphia Eagles|NFL|39.9|-75.2;Pittsburgh Steelers|NFL|40.4|-80;San Francisco 49ers|NFL|37.4|-122;Seattle Seahawks|NFL|47.6|-122.3;Tampa Bay Buccaneers|NFL|28|-82.5;Tennessee Titans|NFL|36.2|-86.8;Washington Commanders|NFL|38.9|-76.9;" + "Atlanta Hawks|NBA|33.8|-84.4;Boston Celtics|NBA|42.4|-71.1;Brooklyn Nets|NBA|40.7|-74;Charlotte Hornets|NBA|35.2|-80.8;Chicago Bulls|NBA|41.9|-87.7;Cleveland Cavaliers|NBA|41.5|-81.7;Dallas Mavericks|NBA|32.8|-96.8;Denver Nuggets|NBA|39.7|-105;Detroit Pistons|NBA|42.3|-83;Golden State Warriors|NBA|37.8|-122.4;Houston Rockets|NBA|29.8|-95.4;Indiana Pacers|NBA|39.8|-86.2;LA Clippers|NBA|33.9|-118.3;Los Angeles Lakers|NBA|34|-118.3;Memphis Grizzlies|NBA|35.1|-90;Miami Heat|NBA|25.8|-80.2;Milwaukee Bucks|NBA|43|-87.9;Minnesota Timberwolves|NBA|45|-93.3;New Orleans Pelicans|NBA|29.9|-90.1;New York Knicks|NBA|40.8|-74;Oklahoma City Thunder|NBA|35.5|-97.5;Orlando Magic|NBA|28.5|-81.4;Philadelphia 76ers|NBA|39.9|-75.2;Phoenix Suns|NBA|33.4|-112.1;Portland Trail Blazers|NBA|45.5|-122.7;Sacramento Kings|NBA|38.6|-121.5;San Antonio Spurs|NBA|29.4|-98.4;Toronto Raptors|NBA|43.6|-79.4;Utah Jazz|NBA|40.8|-111.9;Washington Wizards|NBA|38.9|-77;" + "Arizona Diamondbacks|MLB|33.4|-112.1;Atlanta Braves|MLB|33.9|-84.5;Baltimore Orioles|MLB|39.3|-76.6;Boston Red Sox|MLB|42.3|-71.1;Chicago Cubs|MLB|41.9|-87.7;Chicago White Sox|MLB|41.8|-87.6;Cincinnati Reds|MLB|39.1|-84.5;Cleveland Guardians|MLB|41.5|-81.7;Colorado Rockies|MLB|39.8|-105;Detroit Tigers|MLB|42.3|-83;Houston Astros|MLB|29.8|-95.4;Kansas City Royals|MLB|39|-94.5;Los Angeles Angels|MLB|33.8|-117.9;Los Angeles Dodgers|MLB|34.1|-118.2;Miami Marlins|MLB|25.8|-80.2;Milwaukee Brewers|MLB|43|-87.97;Minnesota Twins|MLB|45|-93.3;New York Mets|MLB|40.8|-73.8;New York Yankees|MLB|40.8|-73.9;Athletics|MLB|38.6|-121.5;Philadelphia Phillies|MLB|39.9|-75.2;Pittsburgh Pirates|MLB|40.4|-80;San Diego Padres|MLB|32.7|-117.2;San Francisco Giants|MLB|37.8|-122.4;Seattle Mariners|MLB|47.6|-122.3;St. Louis Cardinals|MLB|38.6|-90.2;Tampa Bay Rays|MLB|27.8|-82.7;Texas Rangers|MLB|32.7|-97.1;Toronto Blue Jays|MLB|43.6|-79.4;Washington Nationals|MLB|38.9|-77";
  var parse = function parse(s) {
    return s.split(";").map(function (r) {
      return r.split("|");
    });
  };
  var yr = function yr(a, b, span, w) {
    return w * Math.max(0, 1 - Math.abs(a - b) / span);
  };
  var km = function km(a, b) {
    var R = Math.PI / 180,
      x = (b[3] - a[3]) * R * Math.cos((+a[2] + +b[2]) / 2 * R),
      y = (b[2] - a[2]) * R;
    return 6371 * Math.hypot(x, y);
  };
  var G_LBL = {
      scifi: "sci-fi",
      game: "game show"
    },
    gl = function gl(v) {
      return G_LBL[v] || v;
    };
  var yrClue = function yrClue(a, b, span, w) {
    var d = a - b;
    var m = Math.abs(d),
      dir = d > 0 ? "later" : "earlier";
    return ["year", m === 0 ? "same year" : m <= 3 ? "1\u20133 yrs ".concat(dir) : m <= 9 ? "4\u20139 yrs ".concat(dir) : "10+ yrs ".concat(dir), m === 0, w * Math.max(0, 1 - m / span)];
  };
  var TAGS = {
    "TV Shows": {
      "Friends": ["friends", "NYC", "romance", "90s"],
      "Seinfeld": ["friends", "NYC", "about nothing", "90s"],
      "The Office": ["workplace", "mockumentary", "romance", "cringe"],
      "Parks and Recreation": ["workplace", "mockumentary", "small town", "Indiana"],
      "Cheers": ["workplace", "bar", "Boston", "romance"],
      "Frasier": ["family", "Seattle", "radio", "spin-off"],
      "Full House": ["family", "TGIF", "San Francisco", "dads"],
      "Family Matters": ["family", "TGIF", "nerd", "catchphrase"],
      "Home Improvement": ["family", "tools", "dads", "catchphrase"],
      "Boy Meets World": ["family", "school", "TGIF", "coming of age"],
      "Saved by the Bell": ["high school", "friends", "teen", "Saturday morning"],
      "The Fresh Prince of Bel-Air": ["family", "LA", "music", "fish out of water"],
      "Everybody Loves Raymond": ["family", "in-laws", "married", "sports writer"],
      "The King of Queens": ["married", "NYC", "in-laws", "blue collar"],
      "Two and a Half Men": ["family", "brothers", "LA", "dads"],
      "How I Met Your Mother": ["friends", "NYC", "romance", "mystery"],
      "The Big Bang Theory": ["friends", "nerd", "science", "romance"],
      "Modern Family": ["family", "mockumentary", "LA", "dads"],
      "Arrested Development": ["family", "narrator", "cringe", "money"],
      "Malcolm in the Middle": ["family", "genius", "brothers", "chaos"],
      "That '70s Show": ["friends", "teen", "retro", "small town"],
      "Scrubs": ["workplace", "medical", "friends", "daydreams"],
      "30 Rock": ["workplace", "NYC", "TV business", "satire"],
      "Brooklyn Nine-Nine": ["workplace", "cops", "NYC", "heists"],
      "The Wonder Years": ["family", "narrator", "retro", "coming of age"],
      "Growing Pains": ["family", "dads", "teen", "80s"],
      "Step by Step": ["family", "TGIF", "blended family", "90s"],
      "Happy Days": ["retro", "teen", "diner", "catchphrase"],
      "M*A*S*H": ["war", "medical", "workplace", "classic"],
      "Ted Lasso": ["sports", "soccer", "coaching", "feel-good"],
      "Curb Your Enthusiasm": ["cringe", "LA", "improv", "about nothing"],
      "It's Always Sunny in Philadelphia": ["friends", "bar", "chaos", "cringe"],
      "Abbott Elementary": ["workplace", "school", "mockumentary", "teachers"],
      "New Girl": ["friends", "roommates", "LA", "romance"],
      "The Middle": ["family", "Indiana", "blue collar", "small town"],
      "Last Man Standing": ["family", "dads", "daughters", "sporting goods"],
      "The Simpsons": ["animated-adult", "family", "small town", "satire"],
      "Family Guy": ["animated-adult", "family", "cutaways", "dog"],
      "South Park": ["animated-adult", "kids", "satire", "small town"],
      "King of the Hill": ["animated-adult", "family", "Texas", "small town"],
      "Futurama": ["animated-adult", "sci-fi", "space", "workplace"],
      "Bob's Burgers": ["animated-adult", "family", "restaurant", "music"],
      "Rugrats": ["Nickelodeon", "babies", "adventure", "90s"],
      "SpongeBob SquarePants": ["Nickelodeon", "ocean", "workplace", "buddies"],
      "Hey Arnold!": ["Nickelodeon", "city", "school", "90s"],
      "Doug": ["Nickelodeon", "school", "diary", "90s"],
      "Rocko's Modern Life": ["Nickelodeon", "animals", "weird", "90s"],
      "The Fairly OddParents": ["Nickelodeon", "magic", "wishes", "school"],
      "Avatar: The Last Airbender": ["Nickelodeon", "chosen one", "martial arts", "adventure"],
      "Animaniacs": ["Saturday morning", "sketch", "siblings", "90s"],
      "Batman: The Animated Series": ["superheroes", "DC", "villains", "90s"],
      "X-Men: The Animated Series": ["superheroes", "Marvel", "team-up", "90s"],
      "Teenage Mutant Ninja Turtles": ["superheroes", "martial arts", "brothers", "team-up"],
      "DuckTales": ["Disney", "treasure", "adventure", "family"],
      "Pokémon": ["creatures", "adventure", "collecting", "anime"],
      "Dexter's Laboratory": ["Cartoon Network", "genius", "siblings", "science"],
      "The Powerpuff Girls": ["Cartoon Network", "superheroes", "siblings", "girls"],
      "Ed, Edd n Eddy": ["Cartoon Network", "friends", "scams", "weird"],
      "Adventure Time": ["Cartoon Network", "fantasy", "buddies", "weird"],
      "Bluey": ["preschool", "dogs", "family", "games"],
      "PAW Patrol": ["preschool", "dogs", "rescue", "team-up"],
      "Peppa Pig": ["preschool", "animals", "family", "British"],
      "Phineas and Ferb": ["Disney", "brothers", "summer", "inventions"],
      "Gravity Falls": ["Disney", "mystery", "siblings", "summer"],
      "Scooby-Doo, Where Are You!": ["mystery", "dogs", "ghosts", "classic"],
      "The Flintstones": ["classic", "family", "prehistoric", "blue collar"],
      "The Jetsons": ["classic", "family", "space", "robots"],
      "Yellowstone": ["western", "family", "ranch", "prestige"],
      "Breaking Bad": ["crime", "prestige", "teacher", "desert"],
      "The Sopranos": ["crime", "prestige", "family", "NJ"],
      "Game of Thrones": ["fantasy", "prestige", "dragons", "royalty"],
      "Lost": ["mystery", "island", "sci-fi", "survival"],
      "Grey's Anatomy": ["medical", "romance", "Seattle", "workplace"],
      "ER": ["medical", "Chicago", "workplace", "90s"],
      "The West Wing": ["politics", "workplace", "prestige", "DC"],
      "Friday Night Lights": ["football", "sports", "Texas", "small town"],
      "This Is Us": ["family", "tearjerker", "flashbacks", "siblings"],
      "Stranger Things": ["sci-fi", "kids on bikes", "retro", "monsters", "small town"],
      "The Walking Dead": ["monsters", "survival", "zombies", "group"],
      "Mad Men": ["retro", "workplace", "NYC", "prestige"],
      "The X-Files": ["sci-fi", "aliens", "mystery", "partners"],
      "Prison Break": ["prison", "escape", "brothers", "crime"],
      "House": ["medical", "genius", "mystery", "cranky"],
      "Law & Order": ["cops", "legal", "NYC", "procedural"],
      "NCIS": ["cops", "military", "procedural", "partners"],
      "CSI: Crime Scene Investigation": ["cops", "science", "procedural", "Las Vegas"],
      "Criminal Minds": ["cops", "procedural", "profilers", "mystery"],
      "Dallas": ["family", "Texas", "oil", "soap"],
      "Beverly Hills, 90210": ["teen", "high school", "LA", "soap"],
      "Dawson's Creek": ["teen", "small town", "romance", "soap"],
      "Gilmore Girls": ["family", "small town", "mother-daughter", "fast talk"],
      "Smallville": ["superheroes", "DC", "teen", "small town"],
      "Buffy the Vampire Slayer": ["monsters", "teen", "high school", "chosen one"],
      "The Crown": ["royalty", "history", "British", "prestige"],
      "The Mandalorian": ["space", "Star Wars", "western", "dads"],
      "Succession": ["family", "money", "prestige", "NYC"],
      "Ozark": ["crime", "family", "money", "prestige"],
      "Squid Game": ["games", "survival", "money", "Korea"],
      "The Wire": ["crime", "cops", "Baltimore", "prestige"],
      "Star Trek: The Next Generation": ["space", "sci-fi", "crew", "classic"],
      "Baywatch": ["beach", "rescue", "LA", "90s"],
      "Walker, Texas Ranger": ["cops", "Texas", "martial arts", "western"],
      "Little House on the Prairie": ["family", "western", "classic", "small town"],
      "Survivor": ["competition", "island", "survival", "voting"],
      "The Amazing Race": ["competition", "travel", "teams", "race"],
      "American Idol": ["competition", "music", "judges", "voting"],
      "The Bachelor": ["competition", "romance", "roses", "drama"],
      "Dancing with the Stars": ["competition", "dancing", "judges", "celebrities"],
      "Shark Tank": ["business", "money", "judges", "pitches"],
      "Duck Dynasty": ["family", "Louisiana", "hunting", "beards"],
      "Pawn Stars": ["business", "money", "Las Vegas", "history"],
      "Cops": ["cops", "real life", "catchphrase", "chase"],
      "MythBusters": ["science", "experiments", "explosions", "educational"],
      "Jeopardy!": ["game show", "trivia", "buzzers", "classic"],
      "Wheel of Fortune": ["game show", "puzzles", "spinning", "classic"],
      "The Price Is Right": ["game show", "prizes", "audience", "classic"],
      "Family Feud": ["game show", "family", "surveys", "teams"],
      "America's Funniest Home Videos": ["home videos", "family", "prizes", "funny"],
      "Saturday Night Live": ["sketch", "NYC", "music", "live"],
      "Sesame Street": ["PBS", "educational", "puppets", "NYC", "preschool"],
      "Mister Rogers' Neighborhood": ["PBS", "educational", "puppets", "kindness", "preschool"],
      "Barney & Friends": ["PBS", "educational", "dinosaurs", "music", "preschool"],
      "Blue's Clues": ["Nickelodeon", "educational", "dogs", "preschool", "clues"],
      "Bill Nye the Science Guy": ["PBS", "educational", "science", "experiments"],
      "Reading Rainbow": ["PBS", "educational", "books", "kids"],
      "Arthur": ["PBS", "educational", "animals", "school"],
      "SportsCenter": ["sports", "highlights", "news", "live"]
    },
    "Movies": {
      "Toy Story": ["Pixar", "toys", "buddies", "adventure"],
      "Finding Nemo": ["Pixar", "ocean", "animals", "adventure", "parents"],
      "The Incredibles": ["Pixar", "superheroes", "family", "action"],
      "Up": ["Pixar", "adventure", "old age", "tearjerker"],
      "Inside Out": ["Pixar", "feelings", "growing up", "tearjerker"],
      "Cars": ["Pixar", "racing", "small town", "buddies"],
      "Monsters, Inc.": ["Pixar", "monsters", "buddies", "comedy"],
      "WALL-E": ["Pixar", "robots", "space", "romance"],
      "Coco": ["Pixar", "music", "family", "tearjerker"],
      "Ratatouille": ["Pixar", "food", "animals", "Paris"],
      "The Lion King": ["Disney", "animals", "music", "royalty", "tearjerker"],
      "Aladdin": ["Disney", "music", "magic", "royalty", "romance"],
      "Beauty and the Beast": ["Disney", "music", "magic", "romance", "royalty"],
      "The Little Mermaid": ["Disney", "music", "ocean", "royalty", "romance"],
      "Frozen": ["Disney", "music", "magic", "royalty", "snow"],
      "Moana": ["Disney", "music", "ocean", "adventure"],
      "Encanto": ["Disney", "music", "magic", "family"],
      "Shrek": ["DreamWorks", "fairy tale", "comedy", "romance"],
      "Kung Fu Panda": ["DreamWorks", "martial arts", "animals", "underdog"],
      "Madagascar": ["DreamWorks", "animals", "comedy", "zoo"],
      "How to Train Your Dragon": ["DreamWorks", "dragons", "creatures", "adventure"],
      "Despicable Me": ["villains", "comedy", "family", "franchise"],
      "The Lego Movie": ["toys", "comedy", "adventure", "chosen one"],
      "Space Jam": ["basketball", "cartoons", "comedy", "sports"],
      "Star Wars": ["space", "franchise", "adventure", "chosen one", "effects"],
      "The Empire Strikes Back": ["space", "franchise", "adventure", "effects"],
      "Jurassic Park": ["dinosaurs", "creatures", "adventure", "effects", "Spielberg"],
      "Jaws": ["creatures", "ocean", "Spielberg", "suspense"],
      "E.T. the Extra-Terrestrial": ["aliens", "Spielberg", "kids on bikes", "tearjerker"],
      "Back to the Future": ["time travel", "comedy", "adventure", "80s"],
      "Raiders of the Lost Ark": ["adventure", "treasure", "Spielberg", "franchise"],
      "Top Gun": ["jets", "military", "80s", "rivals"],
      "Top Gun: Maverick": ["jets", "military", "sequel", "rivals"],
      "Die Hard": ["action", "holiday", "heist", "one man army"],
      "The Terminator": ["robots", "time travel", "action", "franchise"],
      "Terminator 2: Judgment Day": ["robots", "time travel", "action", "effects", "sequel"],
      "The Matrix": ["chosen one", "effects", "action", "computers"],
      "Titanic": ["romance", "ocean", "disaster", "true story", "tearjerker"],
      "Avatar": ["aliens", "effects", "adventure", "nature"],
      "The Avengers": ["superheroes", "Marvel", "team-up", "effects"],
      "Iron Man": ["superheroes", "Marvel", "robots", "effects"],
      "Black Panther": ["superheroes", "Marvel", "royalty", "effects"],
      "Spider-Man": ["superheroes", "Marvel", "coming of age", "effects"],
      "The Dark Knight": ["superheroes", "DC", "villains", "crime"],
      "Batman": ["superheroes", "DC", "villains", "80s"],
      "Superman": ["superheroes", "DC", "aliens", "classic"],
      "Ghostbusters": ["ghosts", "comedy", "effects", "team-up", "80s"],
      "Independence Day": ["aliens", "disaster", "effects", "action"],
      "Men in Black": ["aliens", "comedy", "buddies", "effects"],
      "Armageddon": ["space", "disaster", "effects", "action"],
      "Twister": ["disaster", "weather", "effects", "action"],
      "Gladiator": ["ancient times", "revenge", "action", "war"],
      "Braveheart": ["war", "history", "revenge", "epic"],
      "Forrest Gump": ["Tom Hanks", "history", "tearjerker", "running"],
      "The Shawshank Redemption": ["prison", "friendship", "escape", "tearjerker"],
      "Rocky": ["boxing", "underdog", "sports", "training montage"],
      "Hoosiers": ["basketball", "underdog", "sports", "Indiana", "true story"],
      "Rudy": ["football", "underdog", "sports", "true story", "Indiana"],
      "The Sandlot": ["baseball", "kids", "summer", "sports"],
      "Field of Dreams": ["baseball", "sports", "dads", "magic"],
      "A League of Their Own": ["baseball", "sports", "true story", "Tom Hanks"],
      "Remember the Titans": ["football", "sports", "true story", "team"],
      "Major League": ["baseball", "sports", "comedy", "Cleveland"],
      "The Mighty Ducks": ["hockey", "sports", "kids", "underdog"],
      "Cool Runnings": ["bobsled", "sports", "comedy", "underdog", "true story"],
      "Caddyshack": ["golf", "comedy", "sports", "quotable"],
      "Happy Gilmore": ["golf", "comedy", "Adam Sandler", "sports"],
      "Home Alone": ["holiday", "kids", "comedy", "family"],
      "Elf": ["holiday", "Will Ferrell", "comedy", "family"],
      "National Lampoon's Christmas Vacation": ["holiday", "comedy", "family", "quotable"],
      "A Christmas Story": ["holiday", "kids", "family", "quotable"],
      "Groundhog Day": ["time loop", "comedy", "small town", "romance"],
      "Dumb and Dumber": ["Jim Carrey", "comedy", "buddies", "road trip"],
      "Ferris Bueller's Day Off": ["high school", "comedy", "80s", "quotable"],
      "The Princess Bride": ["fairy tale", "romance", "adventure", "quotable"],
      "The Goonies": ["kids", "treasure", "adventure", "80s"],
      "Harry Potter and the Sorcerer's Stone": ["magic", "school", "chosen one", "franchise"],
      "The Lord of the Rings: The Fellowship of the Ring": ["fantasy", "epic", "quest", "franchise", "effects"],
      "The Wizard of Oz": ["magic", "music", "classic", "quest"],
      "The Sound of Music": ["music", "family", "classic", "true story"],
      "Grease": ["music", "high school", "romance", "classic"],
      "Mary Poppins": ["magic", "music", "family", "classic"],
      "The Greatest Showman": ["music", "circus", "true story", "dreams"],
      "Pirates of the Caribbean": ["pirates", "ocean", "adventure", "franchise"],
      "Jumanji": ["games", "creatures", "adventure", "effects", "kids"],
      "Night at the Museum": ["museum", "comedy", "effects", "family"],
      "Napoleon Dynamite": ["high school", "comedy", "small town", "quotable"],
      "Anchorman": ["Will Ferrell", "comedy", "quotable", "news"],
      "Talladega Nights": ["Will Ferrell", "racing", "comedy", "sports"],
      "Nacho Libre": ["wrestling", "comedy", "sports", "Jack Black"],
      "School of Rock": ["music", "school", "comedy", "Jack Black"],
      "Mrs. Doubtfire": ["family", "comedy", "disguise", "Robin Williams"],
      "Ace Ventura: Pet Detective": ["Jim Carrey", "animals", "comedy", "mystery"],
      "The Mask": ["Jim Carrey", "comedy", "effects", "magic"],
      "Rain Man": ["brothers", "road trip", "drama", "Tom Cruise"],
      "Apollo 13": ["space", "Tom Hanks", "true story", "survival"],
      "Saving Private Ryan": ["war", "Tom Hanks", "Spielberg", "history"],
      "Cast Away": ["Tom Hanks", "survival", "island", "ocean"],
      "The Sixth Sense": ["ghosts", "twist", "suspense", "kids"],
      "Jerry Maguire": ["football", "Tom Cruise", "sports", "romance"],
      "Good Will Hunting": ["genius", "friendship", "drama", "Boston"],
      "Oppenheimer": ["history", "war", "genius", "true story"],
      "Barbie": ["toys", "comedy", "music", "dreams"],
      "Inception": ["dreams", "effects", "heist", "twist"],
      "Interstellar": ["space", "effects", "time travel", "family"]
    }
  };
  var tagged = function tagged() {
    return KEY >= "2026-11-19";
  };
  var TAGN = {};
  Object.values(TAGS).forEach(function (m) {
    return Object.values(m).forEach(function (ts) {
      return ts.forEach(function (t) {
        TAGN[t] = (TAGN[t] || 0) + 1;
      });
    });
  });
  var tagClue = function tagClue(cat, A, x) {
    var ta = TAGS[cat][A[0]] || [],
      sh = (TAGS[cat][x[0]] || []).filter(function (t) {
        return ta.includes(t);
      });
    return ["tags", sh.length ? sh[0] + (sh.length > 1 ? " +".concat(sh.length - 1) : "") : "no tags", sh.length > 0, 2.5 * Math.min(sh.length, 3)];
  };
  var tagHint = function tagHint(cat, A) {
    var ts = (TAGS[cat][A[0]] || []).filter(function (t) {
      return TAGN[t] > 2;
    }).sort(function (a, b) {
      return TAGN[b] - TAGN[a];
    });
    return "one of its tags is \"".concat(ts[0] || (TAGS[cat][A[0]] || ["?"])[0], "\"");
  };
  var DIRS = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  var zone = function zone(lon) {
    return lon > -86.5 ? "the Eastern time zone" : lon > -101 ? "the Central time zone" : lon > -114.5 ? "the Mountain time zone" : "the Pacific time zone";
  };
  var CATS = [{
    name: "TV Shows",
    items: parse(TV),
    clues: function clues(A, x) {
      var g = A[2] === x[2],
        n = A[3] === x[3];
      var r = [["genre", gl(x[2]), g, g ? 5 : 0], ["network", x[3], n, n ? g ? 2 : 0.5 : 0], yrClue(+A[1], +x[1], 20, 3)];
      return tagged() ? r.concat([tagClue("TV Shows", A, x)]) : r;
    },
    hints: function hints(A) {
      return ["it's a ".concat(gl(A[2])), "it aired on ".concat(A[3]), "it started in the ".concat(Math.floor(A[1] / 10) * 10, "s")].concat(tagged() ? [tagHint("TV Shows", A)] : []);
    }
  }, {
    name: "Movies",
    items: parse(MOV),
    clues: function clues(A, x) {
      var g = A[2] === x[2],
        f = A[3] === x[3];
      var r = [["genre", gl(x[2]), g, g ? 5 : 0], ["audience", x[3] === "f" ? "family" : "grown-up", f, f ? 2 : 0], yrClue(+A[1], +x[1], 25, 4)];
      return tagged() ? r.concat([tagClue("Movies", A, x)]) : r;
    },
    hints: function hints(A) {
      return ["it's ".concat(/^[aeiou]/.test(gl(A[2])) ? "an" : "a", " ").concat(gl(A[2]), " movie"), "it's a ".concat(A[3] === "f" ? "family" : "grown-up", " movie"), "it came out in the ".concat(Math.floor(A[1] / 10) * 10, "s")].concat(tagged() ? [tagHint("Movies", A)] : []);
    }
  }, {
    name: "Animals",
    items: parse(ANI),
    clues: function clues(A, x) {
      var c = A[1] === x[1],
        h = A[2] === x[2],
        d = A[4] === x[4],
        z = A[3] - x[3];
      return [["class", x[1], c, c ? 4 : 0], ["habitat", x[2], h, h ? 4 : 0], ["diet", {
        c: "meat eater",
        h: "plant eater",
        o: "eats both"
      }[x[4]], d, d ? 1.5 : 0], ["size", z === 0 ? "same size" : z > 0 ? "bigger" : "smaller", z === 0, 2 * Math.max(0, 1 - Math.abs(z) / 3)]];
    },
    hints: function hints(A) {
      return ["it's ".concat(/^[aeiou]/.test(A[1]) ? "an" : "a", " ").concat(A[1]), "its habitat is ".concat(A[2]), {
        c: "it's a meat eater",
        h: "it's a plant eater",
        o: "it eats both plants and meat"
      }[A[4]]];
    }
  }, {
    name: "Pro Teams",
    items: parse(TEAMS),
    clues: function clues(A, x) {
      var l = A[1] === x[1],
        d = km(x, A),
        mi = d * 0.621 < 500 ? Math.round(d * 0.621 / 50) * 50 || 50 : Math.round(d * 0.621 / 100) * 100;
      var brg = Math.atan2((A[3] - x[3]) * Math.cos(A[2] * Math.PI / 180), A[2] - x[2]) * 180 / Math.PI;
      var where = d < 60 ? "same city" : "~".concat(mi, " mi ").concat(DIRS[Math.round((brg + 360) % 360 / 45) % 8]);
      return [["league", x[1], l, l ? 6 : 0], ["distance", where, d < 60, 4 * Math.max(0, 1 - d / 2500)]];
    },
    hints: function hints(A) {
      return ["it's ".concat(A[1] === "NFL" || A[1] === "NBA" || A[1] === "NHL" ? "an" : "a", " ").concat(A[1], " team"), "it plays in ".concat(zone(+A[3]))];
    }
  }];
  CATS.forEach(function (c) {
    c.sim = function (a, b) {
      return c.clues(a, b).reduce(function (t, k) {
        return t + k[3];
      }, 0);
    };
  });
  var MAXG = 15;
  var dayN = function dayN() {
    var _KEY$split$map = KEY.split("-").map(Number),
      _KEY$split$map2 = _slicedToArray(_KEY$split$map, 3),
      y = _KEY$split$map2[0],
      m = _KEY$split$map2[1],
      d = _KEY$split$map2[2];
    return Math.round((Date.UTC(y, m - 1, d) - Date.UTC(2026, 10, 4)) / 864e5);
  };
  var hash = function hash(s) {
    var h = 2166136261;
    for (var i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  };
  function today() {
    var n = (dayN() % 9999 + 9999) % 9999,
      cat = CATS[n % CATS.length],
      k = Math.floor(n / CATS.length);
    var order = cat.items.map(function (x) {
      return x[0];
    }).sort(function (a, b) {
      return hash("dawg" + a) - hash("dawg" + b);
    });
    return {
      cat: cat,
      ans: order[k % order.length]
    };
  }
  var norm = function norm(s) {
    return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/^the /, "").replace(/[^a-z0-9]/g, "");
  };
  var cmpName = function cmpName(a, b) {
    return norm(a) < norm(b) ? -1 : norm(a) > norm(b) ? 1 : 0;
  };
  function ranks(cat, ans) {
    var A = cat.items.find(function (x) {
        return x[0] === ans;
      }),
      R = {};
    var sc = cat.items.map(function (x) {
      return [x[0], x[0] === ans ? 1e9 : Math.round(cat.sim(A, x) * 100)];
    });
    sc.forEach(function (p) {
      R[p[0]] = 1 + sc.filter(function (q) {
        return q[1] > p[1];
      }).length;
    });
    return R;
  }
  var HINT_AT = 7;
  var rowOf = function rowOf(s, n) {
    return s.cat.items.find(function (x) {
      return x[0] === n;
    });
  };
  function hintOf(s) {
    if (s.done || s.guesses.length < HINT_AT) return "";
    var A = rowOf(s, s.ans),
      hs = s.cat.hints(A),
      got = function got(i) {
        return s.guesses.some(function (g) {
          return s.cat.clues(A, rowOf(s, g))[i][2];
        });
      };
    var i = hs.findIndex(function (h, i) {
      return !got(i);
    });
    return hs[i < 0 ? hs.length - 1 : i];
  }
  var rk = function rk() {
    return "bdd:den:guess:" + KEY + ":" + (me ? me.id : "");
  };
  var rr = function rr(c, x, y, w, h, r) {
    c.beginPath();
    if (c.roundRect) c.roundRect(x, y, w, h, r);else c.rect(x, y, w, h);
  };
  var scoreOf = function scoreOf(s) {
    return s.won ? 1000 - 50 * (s.guesses.length - 1) : Math.round(200 * Math.max(0, 1 - (Math.min.apply(Math, _toConsumableArray(s.guesses.map(function (g) {
      return s.R[g];
    }))) - 2) / 40));
  };
  var heat = function heat(n, tot) {
    return n === 1 ? "#6aaa64" : n <= Math.max(5, tot * 0.05) ? "#f5793a" : n <= tot * 0.2 ? "#e6b31e" : n <= tot * 0.5 ? "#7fa7d9" : "#9aa0a6";
  };
  var KB = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM<"];
  defGame({
    key: "guess",
    name: "Guess",
    icon: "🔍",
    max: 1000,
    cat: "den",
    puzzle: true,
    blurb: "Daily: hot or cold? Find the pick.",
    how: "Every day there's a hidden pick from a category: TV Shows, Movies, Animals or Pro Teams (it rotates). Start typing and tap a match to guess. Under each guess are its clues: ✓ means the answer shares it (same genre, same network, same league), ✗ means it doesn't, for movies and shows, \"tags\" names something they have in common (like adventure or Pixar), and things like \"4–9 yrs later\", \"bigger\" or \"~300 mi NE\" tell you which way the answer is from that guess. The number is how close the guess is, ranked against everything in the list: #1 is the answer, and lower is warmer. Things that are exactly as close share a number. Miss 7 and you get one free hint. All your guesses are listed closest first. 15 guesses, one game a day. Score: 1000 for getting it in one, 50 less for each extra guess. Miss it and you get up to 200 for how close you got.",
    reset: function reset(G) {
      var t = today(),
        s = G.s = {
          cat: t.cat,
          ans: t.ans,
          R: ranks(t.cat, t.ans),
          typed: "",
          msg: "",
          msgT: 0,
          btns: [],
          postT: 0,
          scroll: 0
        };
      var r = store.get(rk());
      if (r && r.guesses) Object.assign(s, {
        guesses: r.guesses,
        done: r.done,
        won: r.won,
        posted: r.posted
      });else Object.assign(s, {
        guesses: [],
        done: false,
        won: false
      });
    },
    persist: function persist(G) {
      var s = G.s;
      store.set(rk(), {
        guesses: s.guesses,
        done: s.done,
        won: s.won,
        posted: s.posted,
        score: s.done ? scoreOf(s) : 0
      });
    },
    info: function info(G) {
      var s = G.s,
        sc = scoreOf(s),
        tot = s.cat.items.length;
      var sq = s.guesses.map(function (g) {
        var n = s.R[g];
        return n === 1 ? "🟩" : n <= Math.max(5, tot * 0.05) ? "🟧" : n <= tot * 0.2 ? "🟨" : n <= tot * 0.5 ? "🟦" : "⬜";
      }).join("");
      return {
        score: sc,
        grid: sq,
        title: s.won ? s.guesses.length === 1 ? "First try! 🐶" : "Got it!" : "So close!",
        sub: (s.won ? "".concat(s.ans, " in ").concat(s.guesses.length, " guess").concat(s.guesses.length === 1 ? "" : "es", ".") : "It was ".concat(s.ans, ".")) + " ".concat(sc, " pts."),
        share: "Guess #".concat(dayN() + 1, " \xB7 ").concat(s.cat.name, " ").concat(s.won ? s.guesses.length : "X", "/").concat(MAXG, "\n").concat(sq)
      };
    },
    matches: function matches(s) {
      var q = norm(s.typed),
        t = s.typed.trim();
      if (!q) return [];
      var plain = function plain(n) {
        return n.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
      };
      var tier = function tier(n) {
        return norm(n) === q ? 0 : norm(n).startsWith(q) ? 1 : plain(n).split(/[\s\-:,.&!']+/).some(function (w) {
          return w.startsWith(t);
        }) ? 2 : norm(n).includes(q) ? 3 : 9;
      };
      return s.cat.items.map(function (x) {
        return x[0];
      }).filter(function (n) {
        return !s.guesses.includes(n) && tier(n) < 9;
      }).sort(function (a, b) {
        return tier(a) - tier(b) || cmpName(a, b);
      }).slice(0, 4);
    },
    guess: function guess(G, name) {
      var s = G.s;
      if (s.done || s.guesses.includes(name)) return;
      s.guesses.push(name);
      s.typed = "";
      if (name === s.ans) {
        s.done = true;
        s.won = true;
        s.msg = "Got it!";
        s.msgT = 1.4;
        G.sfx("win");
      } else if (s.guesses.length >= MAXG) {
        s.done = true;
        s.msg = "It was " + s.ans;
        s.msgT = 2.2;
        G.sfx("lose");
      } else G.sfx("pop");
      if (s.done) s.postT = 1.6;
      this.persist(G);
    },
    press: function press(G, k) {
      var s = G.s;
      if (s.done) return;
      if (k === "<") s.typed = s.typed.slice(0, -1);else if (k === " ") {
        if (s.typed && !s.typed.endsWith(" ")) s.typed += " ";
      } else if (s.typed.length < 24) s.typed += k.toLowerCase();
    },
    update: function update(G, dt) {
      var s = G.s;
      if (s.msgT > 0) s.msgT -= dt;
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
        H = G.H,
        tot = s.cat.items.length;
      s.btns = [];
      c.fillStyle = dk ? "#121213" : "#fff";
      c.fillRect(0, 0, W, H);
      c.fillStyle = ink;
      c.textAlign = "center";
      c.textBaseline = "middle";
      c.font = "800 26px ".concat(G.TITLE);
      c.fillText(s.cat.name, W / 2, 26);
      c.font = "500 14px ".concat(G.UI);
      c.fillStyle = dk ? "#aaa" : "#555";
      c.fillText(s.done ? s.won ? "Solved in ".concat(s.guesses.length) : "The answer: ".concat(s.ans) : "Guesses: ".concat(s.guesses.length, "/").concat(MAXG, " \xB7 ").concat(tot, " possible"), W / 2, 50);
      var kbH = s.done ? 0 : Math.min(156, H * 0.24),
        by = H - kbH - 46;
      var top = 66,
        listBot = s.done ? H - 90 : by - 8,
        n0 = s.guesses.length;
      var A = rowOf(s, s.ans),
        bw = 92,
        cw = W - 44 - bw,
        sep = " · ";
      var lay = {};
      s.guesses.forEach(function (g) {
        var parts = g === s.ans ? [["That's it! 🎉", true]] : s.cat.clues(A, rowOf(s, g)).map(function (k) {
          return [k[0] === "year" || k[0] === "size" || k[0] === "distance" ? (k[2] ? "✓ " : "") + k[1] : (k[2] ? "✓ " : "✗ ") + k[1], k[2]];
        });
        var fs = 12.5;
        var wOf = function wOf() {
          c.font = "600 ".concat(fs, "px ").concat(G.UI);
          return parts.reduce(function (t, q, i) {
            return t + c.measureText(q[0] + (i ? sep : "")).width;
          }, 0);
        };
        while (fs > 11 && wOf() > cw) fs -= 0.5;
        var lines = [parts];
        if (wOf() > cw) {
          var _loop = function _loop() {
            c.font = "600 ".concat(fs, "px ").concat(G.UI);
            lines = [[]];
            var x = 0;
            parts.forEach(function (q) {
              var w = c.measureText(q[0]).width,
                sw = c.measureText(sep).width,
                L = lines[lines.length - 1];
              if (L.length && x + sw + w > cw && lines.length < 2) {
                lines.push([q]);
                x = w;
              } else {
                x += (L.length ? sw : 0) + w;
                L.push(q);
              }
            });
            if (lines.every(function (L) {
              return L.reduce(function (t, q, i) {
                return t + c.measureText(q[0] + (i ? sep : "")).width;
              }, 0) <= cw;
            })) return 1;
          };
          for (fs = 12; fs >= 8; fs -= 0.5) {
            if (_loop()) break;
          }
        }
        lay[g] = {
          lines: lines,
          fs: fs
        };
      });
      var rh = Math.max(40, Math.min(48, (listBot - top - 26) / Math.max(n0, 1) - 4)),
        hOf = function hOf(g) {
          return lay[g].lines.length > 1 ? rh + 15 : rh;
        };
      var last = s.guesses[n0 - 1],
        room = listBot - top - 26;
      var rows = s.guesses.slice().sort(function (a, b) {
          return s.R[a] - s.R[b];
        }),
        more = 0;
      var sumH = function sumH(L) {
        return L.reduce(function (t, g) {
          return t + hOf(g) + 4;
        }, 0);
      };
      if (sumH(rows) > room) {
        var pin = s.done ? [] : [last],
          rest = rows.filter(function (g) {
            return s.done || g !== last;
          });
        var pick = pin.slice();
        var _iterator = _createForOfIteratorHelper(rest),
          _step;
        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var g = _step.value;
            if (sumH(pick.concat(g)) > room - 18) break;
            pick.push(g);
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
        if (!s.done && rows.indexOf(last) < pick.length) pick = rows.filter(function (g) {
          return pick.includes(g);
        });
        rows = pick.length ? pick : [last];
        more = n0 - rows.length;
      }
      var hint = hintOf(s);
      if (hint) {
        c.fillStyle = dk ? "#4a3d12" : "#fdf1c7";
        rr(c, 12, top, W - 24, 22, 6);
        c.fill();
        c.fillStyle = dk ? "#ffe08a" : "#6b5200";
        c.font = "700 12.5px ".concat(G.UI);
        c.textAlign = "center";
        c.fillText("\uD83D\uDCA1 Free hint: ".concat(hint), W / 2, top + 11, W - 36);
      } else {
        c.fillStyle = dk ? "#2a2a2c" : "#f1f1ee";
        c.fillRect(12, top, W - 24, 22);
        c.fillStyle = dk ? "#ccc" : "#444";
        c.font = "600 12px ".concat(G.UI);
        c.textAlign = "left";
        c.fillText(n0 ? "Closest first · ✓ = the answer shares it" : "Lower number = closer. #1 is the answer.", 18, top + 11);
        if (n0) {
          c.textAlign = "right";
          c.fillText("#1 = it", W - 18, top + 11);
        }
      }
      var y = top + 26;
      rows.forEach(function (g) {
        var n = s.R[g],
          hit = g === s.ans,
          isLast = g === last && !s.done,
          rh0 = hOf(g),
          L = lay[g];
        c.fillStyle = dk ? "#1e1e20" : "#fff";
        c.strokeStyle = isLast ? ink : dk ? "#3a3a3c" : "#ddd";
        c.lineWidth = isLast ? 2 : 1;
        rr(c, 12, y, W - 24, rh0, 6);
        c.fill();
        c.stroke();
        c.fillStyle = ink;
        c.textAlign = "left";
        var sz = Math.min(16, rh * 0.5);
        c.font = "".concat(isLast ? 800 : 600, " ").concat(sz, "px ").concat(G.UI);
        while (sz > 10 && c.measureText(g).width > W - 48 - bw) {
          sz--;
          c.font = "".concat(isLast ? 800 : 600, " ").concat(sz, "px ").concat(G.UI);
        }
        c.fillText(g, 20, y + rh * 0.34);
        c.font = "600 ".concat(L.fs, "px ").concat(G.UI);
        L.lines.forEach(function (parts, li) {
          var cx = 20;
          var ly = y + rh * 0.73 + li * 15;
          parts.forEach(function (q, i) {
            if (i) {
              c.fillStyle = dk ? "#666" : "#bbb";
              c.fillText(sep, cx, ly);
              cx += c.measureText(sep).width;
            }
            c.fillStyle = q[1] ? dk ? "#7fd27a" : "#3f8a3b" : dk ? "#9aa0a6" : "#80868b";
            c.fillText(q[0], cx, ly);
            cx += c.measureText(q[0]).width;
          });
        });
        c.fillStyle = heat(n, tot);
        rr(c, W - 12 - bw, y, bw, rh0, 6);
        c.fill();
        c.fillStyle = "#fff";
        c.font = "800 ".concat(Math.min(17, rh * 0.52), "px ").concat(G.UI);
        c.textAlign = "center";
        c.fillText(hit ? "✓" : "#" + n, W - 12 - bw / 2, y + rh0 / 2 + 1);
        y += rh0 + 4;
      });
      if (more > 0) {
        c.fillStyle = dk ? "#9aa0a6" : "#777";
        c.font = "600 13px ".concat(G.UI);
        c.textAlign = "center";
        c.fillText("+".concat(more, " more, farther away"), W / 2, y + 8);
      }
      if (!s.done) {
        var ms = this.matches(s);
        if (s.typed) {
          var ph = ms.length ? ms.length * 38 + 6 : 34,
            py = by - ph - 4;
          c.fillStyle = dk ? "#121213" : "#fff";
          c.fillRect(8, py - 4, W - 16, ph + 8);
          if (!ms.length) {
            c.fillStyle = dk ? "#aaa" : "#777";
            c.font = "500 14px ".concat(G.UI);
            c.textAlign = "left";
            c.fillText("No matches in the list", 22, py + 17);
          }
          ms.forEach(function (m, i) {
            var yy = py + 3 + (ms.length - 1 - i) * 38;
            c.fillStyle = dk ? "#2e4a6b" : "#e6f1fd";
            rr(c, 12, yy, W - 24, 34, 8);
            c.fill();
            c.fillStyle = ink;
            c.font = "600 15px ".concat(G.UI);
            c.textAlign = "left";
            c.fillText(m, 22, yy + 17, W - 44);
            s.btns.push({
              x: 12,
              y: yy,
              w: W - 24,
              h: 34,
              pick: m
            });
          });
        }
        c.strokeStyle = ink;
        c.lineWidth = 2;
        c.fillStyle = dk ? "#121213" : "#fff";
        rr(c, 12, by, W - 24, 38, 8);
        c.fill();
        c.stroke();
        c.fillStyle = s.typed ? ink : dk ? "#777" : "#999";
        c.font = "600 16px ".concat(G.UI);
        c.textAlign = "left";
        c.fillText(s.typed ? s.typed + "▏" : "Type a ".concat(s.cat.name === "Animals" ? "animal" : s.cat.name === "Movies" ? "movie" : s.cat.name === "Pro Teams" ? "team" : "show", "\u2026"), 22, by + 20);
        var ky = H - kbH,
          kh = (kbH - 12) / 3 - 6,
          kw = (W - 12) / 10 - 5;
        KB.forEach(function (row, r) {
          var keys = (r === 2 ? [" "] : []).concat(row.split("")),
            wide = function wide(k) {
              return k === "<" ? kw * 1.3 : k === " " ? kw * 1.6 : kw;
            };
          var tw = keys.reduce(function (a, k) {
            return a + wide(k) + 5;
          }, -5);
          var x = (W - tw) / 2;
          keys.forEach(function (k) {
            var ww = wide(k),
              yy = ky + 4 + r * (kh + 6);
            rr(c, x, yy, ww, kh, 5);
            c.fillStyle = dk ? "#818384" : "#d3d6da";
            c.fill();
            c.fillStyle = ink;
            c.font = "700 ".concat(k === " " ? 12 : 16, "px ").concat(G.UI);
            c.textAlign = "center";
            c.fillText(k === "<" ? "⌫" : k === " " ? "space" : k, x + ww / 2, yy + kh / 2 + 1);
            s.btns.push({
              x: x,
              y: yy,
              w: ww,
              h: kh,
              key: k
            });
            x += ww + 5;
          });
        });
      } else if (s.posted) {
        var _bw = Math.min(240, W - 60);
        s.btns.push(Object.assign(G.pill(c, W / 2 - _bw / 2, H - 70, _bw, 48, "See results", true), {
          k: "res"
        }));
      }
      if (s.msgT > 0 && s.msg) {
        c.save();
        c.globalAlpha = Math.min(1, s.msgT * 2);
        c.font = "600 15px ".concat(G.UI);
        var mw = c.measureText(s.msg).width + 30;
        c.fillStyle = ink;
        rr(c, W / 2 - mw / 2, H * 0.35, mw, 38, 6);
        c.fill();
        c.fillStyle = dk ? "#121213" : "#fff";
        c.textAlign = "center";
        c.fillText(s.msg, W / 2, H * 0.35 + 20);
        c.restore();
      }
    },
    tap: function tap(G, x, y) {
      var s = G.s,
        b = s.btns.find(function (b) {
          return x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h;
        });
      if (!b) return;
      if (b.k === "res") return G.results(this.info(G));
      if (s.done) return;
      if (b.pick) return this.guess(G, b.pick);
      if (b.key) this.press(G, b.key);
    },
    onKey: function onKey(G, k, d) {
      if (!d || G.s.done) return;
      if (k === "Backspace") this.press(G, "<");else if (k === "Enter") {
        var m = this.matches(G.s);
        if (m.length) this.guess(G, m[0]);
      } else if (k === " ") this.press(G, " ");else if (/^[a-z0-9]$/i.test(k)) this.press(G, k);
    }
  });
})();