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
  var STOP = /^(the|a|an|my|some|your|our|their|his|her|and|n|or|of|to|with|in|on|at)$/;
  var stem = function stem(w) {
    return w.length < 4 ? w : w.length > 5 && /ing$/.test(w) ? w.slice(0, -3) : /ies$/.test(w) ? w.slice(0, -3) + "y" : /(oes|ches|shes|sses|xes)$/.test(w) ? w.slice(0, -2) : /[^su]s$/.test(w) ? w.slice(0, -1) : w;
  };
  var norm = function norm(t) {
    return String(t).toLowerCase().replace(/['’]/g, "").replace(/[^a-z0-9]+/g, " ").split(" ").filter(function (w) {
      return w && !STOP.test(w);
    }).map(stem).join(" ");
  };
  function lev(a, b) {
    var prev = [];
    for (var j = 0; j <= b.length; j++) prev[j] = j;
    for (var i = 1; i <= a.length; i++) {
      var cur = [i];
      for (var _j = 1; _j <= b.length; _j++) cur[_j] = Math.min(prev[_j] + 1, cur[_j - 1] + 1, prev[_j - 1] + (a[i - 1] === b[_j - 1] ? 0 : 1));
      prev = cur;
    }
    return prev[b.length];
  }
  var alike = function alike(a, b) {
    var L = Math.max(a.length, b.length);
    return a === b || L >= 5 && lev(a, b) <= (L >= 9 ? 2 : 1) || Math.min(a.length, b.length) >= 3 && ((" " + a + " ").includes(" " + b + " ") || (" " + b + " ").includes(" " + a + " "));
  };
  function match(q, n) {
    var ex = q.a.map(function (a, j) {
      return a.k.includes(n) ? j : -1;
    }).filter(function (j) {
      return j >= 0;
    });
    if (ex.length) return ex;
    return q.a.map(function (a, j) {
      return a.k.some(function (k) {
        return alike(k, n);
      }) ? j : -1;
    }).filter(function (j) {
      return j >= 0;
    });
  }
  var P = function P(q, src, a) {
    return {
      q: q,
      src: src,
      a: a.map(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 3),
          label = _ref2[0],
          pts = _ref2[1],
          al = _ref2[2];
        return {
          label: label,
          pts: pts,
          k: [label].concat(al ? al.split("|") : []).map(norm)
        };
      })
    };
  };
  var DAYS = {
    "2026-11-26": [P("Name a Thanksgiving food people admit they don't actually like.", "Poll: The Vacationer, 2023", [["Cranberry sauce", 31, "cranberry|canned cranberry"], ["Sweet potatoes", 29, "yam|sweet potato casserole|candied yam"], ["Green bean casserole", 28, "green bean"], ["Turkey", 28], ["Stuffing", 27, "dressing"], ["Ham", 26], ["Coleslaw", 26, "cole slaw|slaw"], ["Pumpkin pie", 24]]), P("Name America's favorite Thanksgiving pie.", "Poll: Kelton Global", [["Pumpkin", 37], ["Apple", 16], ["Pecan", 14], ["Sweet potato", 10], ["Chocolate", 6], ["Cherry", 5], ["Lemon meringue", 4, "lemon"], ["Blueberry", 4]]), P("Name something people say they'll do on Thanksgiving.", "Poll: RMG Research, Nov 2025", [["Eat turkey", 74, "turkey"], ["Eat too much", 55, "eat|overeat|eat lot|stuff face|stuff myself|pig out|eat too much food"], ["Watch the parade", 49, "parade|macys parade"], ["Watch football", 35, "football|nfl|watch nfl|watch game|watch lions"], ["Play football", 19, "turkey bowl|backyard football|throw football"], ["Christmas shopping", 8, "shop|shopping|black friday shopping"]]), P("Name something that goes on a Thanksgiving leftover sandwich.", "Harris Poll for Alpha Baking, 2023", [["Turkey", 81], ["Gravy", 42], ["Ham", 41], ["Stuffing", 39, "dressing"], ["Mac and cheese", 21, "macaroni|mac"], ["Green bean casserole", 14, "green bean"], ["Pumpkin pie", 11, "pie"]]), P("Name a topic people want to avoid at Thanksgiving dinner.", "Talker Research, 2025 · ranked list, points by rank", [["Politics", 28, "election|trump|president|government|political"], ["Money", 20, "income|salary|finances|debt|how much i make"], ["Weight or looks", 15, "weight|appearance|diet|body|looks"], ["Religion", 11, "church|god|faith"], ["An ex", 9, "ex|ex wife|ex husband|ex girlfriend|ex boyfriend"], ["Mental health", 7, "therapy|depression|anxiety"], ["Work problems", 6, "work|job|career"], ["Relationship status", 4, "relationship|marriage|dating|love life|single|getting married|when getting married"]])],
    "2026-11-27": [P("Name America's favorite food at Thanksgiving dinner.", "Gallup poll, open-ended", [["Turkey", 49], ["Stuffing", 14, "dressing"], ["Ham", 5], ["Mashed potatoes", 5, "potato"], ["Pumpkin pie", 5, "pie"]]), P("Name a top-rated Thanksgiving side dish.", "YouGov, 2020 · % of head-to-head matchups won", [["Mashed potatoes", 78], ["Stuffing", 77, "dressing"], ["Bread or rolls", 74, "roll|bread|dinner roll|biscuit|crescent roll"], ["Scalloped potatoes", 66, "au gratin potato|cheesy potato"], ["Sweet potatoes", 65, "yam"], ["Green beans", 64, "green bean casserole"], ["Mac and cheese", 62, "macaroni|mac"]]), P("Name a food that makes the best Thanksgiving leftovers.", "OnePoll for Stasher · 2,000 people", [["Turkey", 62], ["Mashed potatoes", 46, "potato"], ["Stuffing", 46, "dressing"], ["Pumpkin pie", 45, "pie"]]), P("Name a gift people want to get this holiday season.", "NRF holiday survey, 2025", [["Gift cards", 50, "giftcard|gift certificate"], ["Clothing", 46, "clothes|accessories|shoes|apparel"], ["Books and media", 27, "book|movie|music|video game|game"], ["Beauty or personal care", 23, "beauty|makeup|perfume|cologne|skincare|personal care"], ["Electronics", 22, "phone|tv|laptop|tablet|headphone|computer|tech|gadget|iphone|ipad"]]), P("Name something Americans say they're thankful for.", "Lifeway Research, 2020", [["Family", 84], ["Health", 69], ["Friends", 63], ["Memories", 63], ["Personal freedom", 53, "freedom|liberty"], ["Achievements", 33, "accomplishment|success"], ["Wealth", 21, "money|finances"]])],
    "2026-11-28": [P("Name America's favorite Christmas movie.", "Axios / SurveyMonkey, 2018", [["It's a Wonderful Life", 14, "wonderful life"], ["A Christmas Story", 12, "ralphie"], ["Home Alone", 11], ["Christmas Vacation", 11, "national lampoon|national lampoons christmas vacation|griswold"], ["The Grinch", 10, "how grinch stole christmas"], ["Elf", 9], ["Miracle on 34th Street", 7, "miracle"]]), P("Name America's favorite Christmas song.", "AP-NORC poll, 2018, open-ended", [["Silent Night", 12], ["Jingle Bells", 8], ["White Christmas", 5], ["Baby, It's Cold Outside", 5, "cold outside"], ["O Holy Night", 4, "oh holy night|holy night"], ["The Christmas Song", 2, "chestnuts roasting on an open fire|chestnut"], ["Let It Snow", 2], ["Joy to the World", 2]]), P("Name America's favorite sport to watch.", "Gallup, Dec 2023", [["Football", 41, "nfl|college football"], ["Baseball", 10, "mlb"], ["Basketball", 9, "nba|hoop"], ["Soccer", 5], ["Hockey", 4, "ice hockey|nhl"], ["Auto racing", 3, "nascar|racing|f1|formula 1|indycar|car racing"], ["Figure skating", 2, "ice skating|skating"], ["Tennis", 2]]), P("Name America's favorite pizza topping.", "YouGov, 2023", [["Pepperoni", 24], ["Sausage", 13], ["Extra cheese", 11, "cheese|plain"], ["Mushrooms", 9], ["Chicken", 6]]), P("Name a pizza topping people can't stand.", "YouGov, 2019 · in their bottom three", [["Anchovies", 49], ["Eggplant", 30], ["Pineapple", 24], ["Artichokes", 24]])],
    "2026-11-29": "crew"
  };
  var SPARE = [P("Besides turkey, name a Thanksgiving main dish.", "YouGov, 2020 · % of head-to-head matchups won", [["Ham", 67], ["Beef", 54, "roast beef|prime rib|steak|brisket|roast"], ["Chicken", 53]]), P("Name something people expect to talk about at Thanksgiving dinner.", "Pew Research Center, 2024", [["Work or school", 35, "work|school|job|class"], ["The election", 26, "politics|election|trump|president"], ["Pop culture", 24, "movie|tv|show|music|celebrity|sport"]]), P("Name a kind of gift card people give.", "NRF holiday survey", [["Restaurant", 30, "food|dinner"], ["Visa or bank card", 26, "visa|bank|mastercard|amex|prepaid"], ["Department store", 26, "store|macys|kohls|target|walmart"], ["Coffee shop", 21, "coffee|starbucks|dunkin"]]), P("Name where people do their holiday shopping.", "NRF holiday survey, 2026", [["Online", 53, "amazon|internet|web"], ["Grocery stores", 43, "grocery|supermarket|kroger|meijer"], ["Discount stores", 43, "discount|walmart|target|dollar store"], ["Department stores", 42, "department|macys|kohls|mall"]]), P("Name a common Thanksgiving hosting fail.", "OnePoll for Omaha Steaks, 2019", [["Food isn't done on time", 31, "late|food late|not ready|running late|dinner late|behind"], ["Dishes done at different times", 29, "timing|cold food|food cold|cold"], ["Ran out of wine", 28, "wine|out of wine|alcohol|booze|beer|drink"], ["Spilled a dish", 28, "spill|spilled|drop|dropped|dropped food|dropped turkey"], ["Forgot an ingredient", 28, "forgot|forgot something|missing ingredient|forgot ingredient"]])];
  var MORE = [P("Name America's favorite Halloween candy.", "Monmouth University Poll, 2019", [["Reese's Peanut Butter Cups", 36], ["Snickers", 18], ["M&M's", 11, "mms|mm|m and m"], ["Hershey bar", 6], ["Candy corn", 6], ["Skittles", 5], ["Starburst", 4], ["Tootsie Pops", 2]]), P("Name America's favorite Christmas cookie.", "Monmouth University Poll, 2023", [["Frosted sugar cookies", 32], ["Gingerbread", 12], ["Chocolate chip", 11], ["Snickerdoodles", 6]]), P("Name America's favorite season.", "Morning Consult, 2022", [["Fall", 41, "autumn"], ["Spring", 24], ["Summer", 24], ["Winter", 11]]), P("Name America's favorite day of the week.", "YouGov, 2021", [["Saturday", 35], ["Friday", 29], ["Sunday", 14]]), P("Name a New Year's resolution people are making.", "YouGov, Dec 2025", [["Exercise more", 25, "work out|gym|get in shape|lose weight|go to gym"], ["Be happy", 23, "happiness|happier|be happier"], ["Eat healthier", 22, "eat better|eat healthy|diet"], ["Save more money", 21, "save money|money|save"], ["Improve my health", 21, "health|get healthy|be healthy|get healthier"]]), P("Name a vegetable people say they don't like.", "OnePoll for Dr. Praeger's, 2019", [["Turnips", 27], ["Beets", 26], ["Radishes", 23], ["Brussels sprouts", 21], ["Artichokes", 20], ["Eggplant", 20], ["Butternut squash", 20]]), P("Name a vegetable almost everybody likes.", "OnePoll for Dr. Praeger's, 2019", [["Corn", 91], ["Potatoes", 91], ["Carrots", 89], ["Tomatoes", 89], ["Onions", 87], ["Green beans", 87], ["Cucumbers", 86], ["Broccoli", 85]]), P("Name something people plan to do this holiday season.", "YouGov holiday survey", [["Listen to holiday music", 75, "music|christmas music|carol|sing carol|listen music|listen christmas music"], ["Watch a holiday movie", 72, "movie|christmas movie|watch movie|watch christmas movie"], ["Look at holiday lights", 70, "lights|christmas lights|look lights|see lights|look christmas lights"], ["Exchange presents", 70, "presents|gifts|open presents|give gifts|give presents|exchange gifts|open gifts"], ["Drink hot chocolate", 67, "hot chocolate|hot cocoa|cocoa"], ["Decorate a tree", 66, "tree|christmas tree|decorate tree|put up tree|decorate|decorate christmas tree"]]), P("Name a favorite breakfast food.", "National Honey Board survey", [["Eggs", 69], ["Bacon or sausage", 46, "bacon|sausage"], ["Cereal", 44], ["Fruit", 42], ["Oatmeal", 39], ["Hash browns", 30, "hashbrown|potato"], ["Biscuits and gravy", 17, "biscuit|gravy"]]), P("Name America's favorite ice cream flavor.", "YouGov, 2022", [["Vanilla", 11], ["Chocolate", 10], ["Cookies and cream", 7, "oreo|cookies cream"], ["Strawberry", 6], ["Cookie dough", 6]]), P("Name a favorite ice cream topping.", "YouGov, 2022", [["Hot fudge", 40], ["Chocolate syrup", 33, "chocolate|chocolate sauce|syrup"], ["Whipped cream", 32, "whip cream|cool whip"], ["Caramel", 32]]), P("Name something people put on a hamburger.", "YouGov", [["Ketchup", 71, "catsup"], ["Onions", 64], ["Mustard", 50], ["Mayonnaise", 48, "mayo"]]), P("Name a household chore people hate.", "TaskRabbit survey, 2019", [["Cleaning the bathroom", 63, "bathroom|toilet|clean toilet|scrub toilet"], ["Yard work", 43, "mow|mow lawn|lawn|rake|rake leaves|yardwork|cut grass"], ["Cleaning up after the pet", 42, "pet|dog poop|poop|litter box|pick up poop|clean up after dog|cat litter"], ["Laundry", 31, "fold laundry|wash clothes|clothes|fold clothes"], ["Vacuuming", 31, "sweep|sweeping"]]), P("Name a food Americans say they hate.", "YouGov, 2025", [["Liver", 40], ["Anchovies", 36], ["Sardines", 35]]), P("Name a favorite winter holiday drink.", "Harris Poll for Instacart", [["Hot chocolate", 58, "cocoa|hot cocoa"], ["Eggnog", 42], ["Cider", 26], ["Mulled wine", 13, "wine"], ["Hot toddy", 13]]), P("Name America's favorite meal of the day.", "YouGov, Jan 2025", [["Dinner", 50, "supper"], ["Breakfast", 23], ["Lunch", 19]]), P("Name America's least favorite meal of the day.", "YouGov, Jan 2025", [["Breakfast", 35], ["Lunch", 31], ["Dinner", 11, "supper"]]), P("Name a common excuse for being late to work.", "CareerBuilder / Harris Poll", [["Traffic", 49, "car|bad traffic|stuck in traffic|accident|construction"], ["Overslept", 32, "oversleep|slept in|alarm|alarm didnt go off|snooze|sleep"], ["Bad weather", 26, "weather|snow|rain|ice|storm"], ["Too tired to get up", 25, "tired|too tired|couldnt get up|exhausted"], ["Procrastination", 17, "procrastinate|lazy|lost track of time|running late"]]), P("Name a superpower Americans wish they had.", "Marist Poll, 2018", [["Time travel", 29, "travel in time|go back in time|time machine"], ["Read minds", 20, "mind reading|read people minds|telepathy|mind reader"], ["Fly", 17, "flying|flight|ability to fly"], ["Teleport", 15, "teleportation|teleporting"], ["Invisibility", 12, "invisible|be invisible"]]), P("Name a superpower people would pick.", "Rasmussen Reports, 2014", [["See the future", 24, "future|predict future|tell future|psychic"], ["Fly", 19, "flying|flight"], ["X-ray vision", 14, "xray|xray vision|see through walls"], ["Live forever", 14, "immortal|immortality|never die"], ["Super strength", 10, "strength|strong|super strong"], ["Super speed", 4, "speed|fast|run fast|super fast"]]), P("Name the worst holiday gift.", "Wish survey, 2022", [["Broken discount stuff", 28, "defective|cheap|broken|defective items|discount items"], ["Fruitcake", 23], ["Weight-loss stuff", 21, "weight loss|diet|diet book|gym membership|exercise"], ["Political gifts", 20, "political|politics"], ["Out-of-style clothes", 16, "clothes|clothing|ugly sweater|ugly clothes|old clothes"], ["Cheap chocolates", 13, "chocolate|candy"], ["Christmas tie", 13, "tie|ties|necktie"], ["Bathroom scale", 12, "scale|weight scale"]]), P("Name a gift people hated getting.", "Merchoid survey of 3,000 Americans", [["Diet book", 28, "diet|weight loss|weight loss program|gym membership"], ["Donation to a cause", 18, "donation|charity"], ["Hygiene products", 16, "deodorant|soap|toiletries|hygiene|shampoo"], ["Self-help book", 11, "self help|book"], ["Cleaning supplies", 10, "vacuum|cleaning|vacuum cleaner|mop"], ["Manners book", 8, "manners|etiquette|social skills"], ["Socks or batteries", 4, "socks|batteries"], ["Office supplies", 3, "pens|stapler|office"]]), P("Name a favorite breakfast cereal.", "Mashed poll of 603 Americans", [["Cinnamon Toast Crunch", 23, "cinnamon toast"], ["Reese's Puffs", 12, "reeses|reeses puffs|puffs"], ["Fruity Pebbles", 11, "pebbles|fruity"], ["Lucky Charms", 10, "charms"]]), P("Name a favorite vacation spot.", "Florida Panhandle survey of 1,000 Americans", [["Beach", 48, "ocean|sea|coast|shore|beach vacation"], ["Mountains", 27, "mountain|ski|skiing|hills"], ["Lake", 15, "lakes|lake house|cabin"], ["Pool", 10, "swimming pool|resort pool"]]), P("Name something people put on top of a Christmas tree.", "YouGov, 2019", [["Star", 39], ["Angel", 23], ["Santa hat", 1, "santa|hat"]]), P("Name a favorite fruit.", "Mashed reader poll", [["Watermelon", 36, "melon"], ["Strawberries", 22, "strawberry"], ["Pineapple", 21], ["Apples", 12, "apple"]]), P("Name the fast food place with the best burger.", "YouGov", [["Five Guys", 15, "5 guys"], ["Burger King", 15, "bk|whopper"], ["Wendy's", 14, "wendys"], ["McDonald's", 7, "mcdonalds|mcdonald|big mac"]]), P("Name the fast food place with the best fries.", "YouGov Best Bites, 2026", [["McDonald's", 39, "mcdonalds|mcdonald"], ["Five Guys", 9, "5 guys"], ["Chick-fil-A", 7, "chick fil a|chickfila|chik fil a"]]), P("Name the best-tasting pizza chain.", "YouGov Best Bites, 2026", [["Pizza Hut", 19, "hut"], ["Domino's", 17, "dominos|domino"], ["Papa John's", 11, "papa johns|papa john"], ["Little Caesars", 5, "little caesar|caesars"], ["Marco's", 5, "marcos"]]), P("Name something other drivers do that drives people crazy.", "LendingTree survey", [["No turn signal", 44, "turn signal|blinker|no blinker|not signaling|not using turn signal"], ["Texting while driving", 42, "texting|phone|on phone|text"], ["Tailgating", 42, "tailgate|following too close|riding bumper"], ["High beams", 36, "brights|bright lights|headlights"]]), P("Name something that bugs people.", "Harris Poll", [["Kids running wild", 86, "kids|unruly kids|bad kids|screaming kids|misbehaving kids"], ["Rude people", 85, "rude|rudeness"], ["Typing in all caps", 60, "all caps|caps|caps lock|yelling in text"], ["Tailgaters", 53, "tailgating|tailgate"], ["Slow drivers", 47, "slow driver|slow driving|slowpokes"]]), P("Name kids' favorite Halloween candy.", "YouGov kids poll, ages 8-14", [["Peanut butter cups", 18, "reeses|reeses cups|reese"], ["Kit Kat", 8, "kitkat"], ["Snickers", 7], ["M&M's", 7, "mms|mm|m and m"], ["Sour Patch Kids", 7, "sour patch"]]), P("Name a pet people have.", "YouGov, pet owners", [["Dog", 70, "puppy|pup"], ["Cat", 50, "kitten|kitty"], ["Fish", 6, "goldfish"], ["Bird", 4, "parrot|parakeet"]]), P("Name a reason people get a pet.", "YouGov, pet owners", [["Company", 52, "companionship|lonely|keep company|friend|best friend"], ["Give it a good home", 49, "rescue|save it|good home|home"], ["Mental health", 40, "stress|anxiety|happiness|happy|emotional support|therapy"]]), P("Name America's favorite month.", "Gallup", [["May", 14], ["October", 13], ["June", 12], ["December", 12]]), P("Name the worst day of the week.", "YouGov, 2021", [["Monday", 58], ["Tuesday", 12], ["Sunday", 9]]), P("Name how people like to eat their ice cream.", "YouGov, 2022", [["In a bowl", 41, "bowl|cup|dish"], ["Waffle cone", 33, "waffle"], ["Sugar cone", 12, "sugar"], ["Cake cone", 5, "cake|regular cone"]]), P("Name the one condiment people would keep.", "YouGov, 2026", [["Mayonnaise", 16, "mayo"], ["Ketchup", 15, "catsup"], ["Peanut butter", 14, "pb"]]), P("Name a breakfast people love.", "Mashed poll", [["Eggs", 43, "egg|scrambled eggs|omelet|omelette"], ["Pancakes", 18, "pancake|flapjacks"], ["French toast", 16], ["Waffles", 13, "waffle"]]), P("Name the cleaning job people dread most.", "American Cleaning Institute", [["Bathroom", 52, "toilet|clean bathroom|scrub toilet|shower"], ["Kitchen", 23, "clean kitchen|stove|oven"], ["Dusting", 21, "dust"], ["Mopping", 20, "mop|floors"], ["Laundry", 17, "clothes|folding"]]), P("Name how people take their coffee.", "YouGov", [["Lots of cream", 50, "cream|milk|with milk|creamer|light|lots of milk"], ["Black", 21, "plain|no cream"], ["Don't drink it", 19, "dont drink coffee|dont|none|no coffee|tea"], ["A splash of milk", 10, "splash|little milk|bit of milk"]]), P("Name the scariest animal.", "Public Policy Polling, 2013", [["Snakes", 21, "snake"], ["Alligators", 19, "alligator|gator|crocodile"], ["Sharks", 18, "shark"]]), P("Name an exotic animal people would want as a pet.", "Public Policy Polling, 2013", [["Tiger", 26], ["Giraffe", 20], ["Dinosaur", 16, "dino|t rex"], ["Alligator", 6, "gator|crocodile"]]), P("Name America's favorite superhero.", "Survey of 2,000 Americans", [["Superman", 47], ["Spider-Man", 46, "spiderman|spider man|spidey"], ["Batman", 45], ["Captain America", 42, "cap"], ["Iron Man", 41, "ironman|tony stark"]]), P("Name a place people hide Christmas presents.", "Neighbor / Pollfish survey, 2021", [["Bedroom closet", 53, "closet|my closet|bedroom"], ["Spare room", 32, "guest room|extra room|spare bedroom"], ["Coat closet", 26, "hall closet|front closet"], ["Under the bed", 26, "bed|under bed"], ["Car trunk", 25, "trunk|car|in car"], ["A drawer or cabinet", 17, "drawer|cabinet|cupboard"], ["Basement", 16], ["Garage", 15]]), P("Name the first place kids look for hidden presents.", "Neighbor / Pollfish survey, 2021", [["Bedroom closet", 25, "closet|parents closet|bedroom"], ["Under the bed", 22, "bed|under bed"], ["Car trunk", 15, "trunk|car"], ["Coat closet", 9, "hall closet"], ["Kid's room", 6, "kids room|their room"], ["Spare room", 6, "guest room|extra room"]]), P("Name the most delicious Christmas treat.", "Mashed reader poll", [["Cookies", 36, "cookie|christmas cookies|sugar cookies"], ["Fudge", 17], ["Pecan pie", 14, "pie|pecan"]]), P("Name a sound that drives people crazy.", "The Daily Meal reader poll", [["Slurping soup", 25, "slurping|slurp|soup"], ["Snapping gum", 18, "gum|chewing gum|gum popping|smacking gum"], ["Sniffling", 17, "sniffing|runny nose|sniff"], ["Clipping nails", 10, "nail clipping|nails|clipping toenails"], ["Cracking knuckles", 8, "knuckles|knuckle cracking"]]), P("Name something people like to do in winter.", "YouGov", [["Go to the movies", 42, "movies|movie theater|movie"], ["See friends and family", 42, "family|friends|visit family"], ["Go shopping", 38, "shopping|shop|mall"], ["Indoor events", 38, "concerts|shows|events"], ["Work out", 30, "gym|exercise"], ["Go for walks", 29, "walk|walking"], ["Travel", 26, "trip|vacation"]]), P("Name a way people stay active in winter.", "NRPA Park Pulse poll", [["Walking or running", 46, "walk|run|jog|jogging|running|walking"], ["Home workout", 28, "treadmill|exercise bike|peloton|home gym|work out at home"], ["Go to the gym", 25, "gym|rec center|ymca"]]), P("Name the turkey meat people like best.", "YouGov", [["White meat", 41, "white|breast"], ["Both", 32, "either|all of it"], ["Dark meat", 19, "dark|leg|drumstick|thigh"]]), P("Name a favorite Thanksgiving pie.", "YouGov, 2022", [["Pumpkin", 23], ["Pecan", 14], ["Apple", 12], ["Sweet potato", 8]]), P("Name a favorite Christmas movie.", "YouGov, 2020, open-ended", [["Home Alone", 15], ["It's a Wonderful Life", 12, "wonderful life"], ["Christmas Vacation", 12, "national lampoon|griswold|lampoon"], ["Elf", 11], ["A Christmas Story", 11, "ralphie|christmas story"]]), P("Name a favorite Christmas song.", "YouGov, 2020", [["Silent Night", 13], ["All I Want for Christmas Is You", 13, "all i want for christmas|mariah carey|mariah"], ["O Holy Night", 12, "oh holy night|holy night"], ["Jingle Bell Rock", 12], ["White Christmas", 10], ["Carol of the Bells", 7, "carol of bells"], ["The Christmas Song", 7, "chestnuts|chestnuts roasting"], ["Mary, Did You Know?", 7, "mary did you know"]]), P("Name a Christmas song people can't stand.", "YouGov, 2020", [["Grandma Got Run Over by a Reindeer", 17, "grandma got run over|grandma"], ["I Want a Hippopotamus for Christmas", 15, "hippopotamus|hippo"], ["Santa Baby", 8]]), P("Name where people ring in the New Year.", "AP-NORC poll", [["At home", 72, "home|my house|couch"], ["At a friend's or family's house", 21, "friends house|family house|party at a friends|friends|family"], ["Bar or restaurant", 5, "bar|restaurant|club|party|event"]]), P("Name when families open Christmas presents.", "Gallup", [["Christmas morning", 65, "christmas day|christmas|morning"], ["Christmas Eve", 21, "eve|night before"], ["Both days", 12, "both"]]), P("Name a favorite animated Christmas special.", "Monmouth University Poll", [["Rudolph", 32, "rudolph red nosed reindeer|rudolph the red nosed reindeer"], ["A Charlie Brown Christmas", 24, "charlie brown|peanuts"], ["The Grinch", 14, "grinch|how grinch stole christmas"], ["Frosty the Snowman", 12, "frosty"]]), P("Name a favorite holiday character.", "Siena College poll of New Yorkers", [["The Grinch", 16, "grinch"], ["Rudolph", 13, "reindeer"], ["Buddy the Elf", 7, "elf|buddy"], ["Frosty the Snowman", 7, "frosty|snowman"]]), P("Name something people do on a snow day.", "Nestle Sno-Caps survey", [["Read a book", 56, "read|reading|book"], ["Watch old movies", 45, "movies|watch movies|watch tv|tv"], ["Cook or bake", 44, "bake|baking|cook|cooking|cookies"]]), P("Name something people forget to pack for vacation.", "Statista survey", [["Phone charger", 24, "charger|cell phone charger"], ["Sunscreen", 20, "sunblock|sun screen"], ["Razor", 18, "shaver"], ["Toothbrush", 15, "tooth brush|toothpaste"], ["Sunglasses", 14, "shades"]]), P("Name something people leave at home by accident.", "OnePoll for DoorDash", [["Phone", 31, "cell phone|cellphone|iphone"], ["Water bottle", 28, "water|drink|coffee"], ["Deodorant or makeup", 25, "deodorant|makeup|lotion|beauty products"], ["Sunscreen", 21, "sunblock"]]), P("Name the kind of pizza crust people like best.", "YouGov", [["Thin crust", 39, "thin|new york"], ["Thick crust", 30, "thick|deep dish|pan"], ["Stuffed crust", 16, "stuffed"]]), P("Name a favorite holiday tradition.", "Saint Leo University poll", [["Family gatherings", 75, "family|seeing family|being with family"], ["Giving presents", 65, "giving gifts|giving|gifts"], ["Christmas music", 54, "music|carols|songs"], ["Decorating the tree", 48, "tree|decorating|christmas tree|decorate"], ["Opening presents", 45, "presents|opening gifts|unwrapping"]]), P("Name America's favorite holiday.", "Saint Leo University poll", [["Christmas", 34, "xmas"], ["Thanksgiving", 15, "turkey day"], ["Fourth of July", 9, "july 4th|4th of july|independence day|july"], ["New Year's", 8, "new years|new years eve|new years day"], ["Halloween", 8]]), P("Name how people deal with snow in the driveway.", "YouGov", [["Shovel it myself", 59, "shovel|myself|snowblower|snow blower|plow it myself"], ["Wait for it to melt", 12, "wait|let it melt|melt|nothing"], ["Pay someone", 10, "hire someone|plow service|pay|neighbor kid"]]), P("Name something Americans are afraid of.", "YouGov, 2022", [["Snakes", 30, "snake"], ["Heights", 28, "falling|high places"], ["Spiders", 24, "spider|bugs"], ["Public speaking", 23, "speaking|speech|giving a speech|talking in front of people"], ["Disease", 21, "getting sick|sickness|illness|germs"], ["Crowds", 17, "crowded places|crowded spaces"], ["Small spaces", 17, "enclosed spaces|tight spaces|elevators|closed in"]]), P("Name a favorite kind of cookie.", "The Daily Meal poll of 567 people", [["Chocolate chip", 51, "chocolate|chocolate chip cookie"], ["Oatmeal raisin", 19, "oatmeal"], ["Peanut butter", 14, "pb"], ["Sugar", 9, "sugar cookie"]]), P("Name a cookie people bake for the holidays.", "Parade \"America Voted\" poll", [["Chocolate chip", 40, "chocolate"], ["Peanut butter", 26, "pb"], ["Sugar cookies", 25, "sugar|cutout"], ["Gingerbread", 21, "gingerbread men|ginger"], ["Snickerdoodles", 20, "snickerdoodle"], ["Oatmeal raisin", 20, "oatmeal"], ["Shortbread", 20], ["Peanut butter blossoms", 19, "blossoms|kiss cookies|hershey kiss"]]), P("Name America's favorite potato chip flavor.", "Utz / Censuswide survey, 2026", [["Original", 19, "plain|regular|classic|salted"], ["Sour cream and onion", 19, "sour cream|sour cream onion"], ["Barbecue", 18, "bbq"], ["Salt and vinegar", 13, "vinegar"]]), P("Name how people like their steak cooked.", "YouGov", [["Well done", 24, "well"], ["Medium rare", 23], ["Medium well", 16], ["Medium", 13], ["Rare", 11, "bloody|blue"]]), P("Name a sauce people put on steak.", "Meats by Linz survey", [["A.1.", 40, "a1|a 1|steak sauce"], ["Barbecue sauce", 13, "bbq|barbecue|bbq sauce"], ["Worcestershire", 10, "worcester|worcestershire sauce"]]), P("Name a favorite cut of steak.", "Meats by Linz survey", [["Ribeye", 61, "rib eye"], ["Filet", 47, "filet mignon|tenderloin"], ["T-bone", 43, "tbone|t bone|porterhouse"]]), P("Name America's favorite kind of music.", "CBS News poll", [["Country", 21, "country music"], ["Rock", 18, "rock and roll|classic rock|rock n roll"], ["Pop", 14, "popular|pop music"], ["Classical", 10], ["R&B", 9, "r and b|rnb|soul|r b"], ["Hip hop", 7, "rap|hiphop"], ["Jazz", 7], ["Gospel", 5, "christian|church music|worship"]]), P("Name a soda people reach for.", "YouGov beverage rankings, 2026", [["Coca-Cola", 36, "coke|coca cola"], ["Pepsi", 27], ["Sprite", 25], ["Dr Pepper", 23, "dr pepper|doctor pepper"]]), P("Name a fast food place people think of first.", "YouGov Best Bites, 2026", [["McDonald's", 40, "mcdonalds|mcdonald|mickey ds"], ["Chick-fil-A", 36, "chick fil a|chickfila"], ["Wendy's", 33, "wendys"], ["Burger King", 32, "bk"], ["Taco Bell", 31]]), P("Name something that annoys people on an airplane.", "YouGov", [["Seat kicking", 56, "kicking my seat|kicking seat|kicked"], ["Smelly passengers", 51, "smell|body odor|stinky|bo"], ["Bratty kids", 49, "kids|children|crying kids|screaming kids|crying baby"]]), P("Name the most annoying thing on a plane.", "YouGov for The Points Guy", [["Loud calls or videos", 27, "loud|noise|no headphones|phone calls|talking loud"], ["Seat reclining", 21, "reclining|recline|leaning back"], ["Bare feet", 8, "barefoot|shoes off|feet"]]), P("Name something people hate others doing at the movies.", "YouGov", [["Taking phone calls", 87, "phone call|calls|answering phone"], ["Talking", 81, "chatting|talking during movie"], ["Bringing babies", 78, "babies|baby|crying baby|kids"], ["Using their phone", 66, "phone|texting|scrolling|phone light"], ["Noisy snacks", 51, "chewing|loud food|crunching|slurping|eating"]]), P("Name a gadget people want for Christmas.", "Talker Research, 5,000 Americans", [["Smartphone", 45, "phone|iphone|cell phone"], ["Laptop", 43, "computer"], ["Headphones", 41, "earbuds|airpods|earphones"], ["TV", 39, "television|smart tv"], ["Smartwatch", 38, "watch|apple watch"], ["Gaming system", 37, "video game|playstation|xbox|nintendo|switch|game console"]]), P("Name a favorite homemade holiday cookie.", "Finlandia Butter survey of 2,000 adults", [["Chocolate chip", 31, "chocolate"], ["Sugar", 18, "sugar cookie|cutout"], ["Oatmeal", 11, "oatmeal raisin"]]), P("Name the cereal mascot who'd win a fight.", "Shopkick survey", [["Tony the Tiger", 80, "tony|tiger|frosted flakes"], ["Cap'n Crunch", 10, "captain crunch|capn crunch"], ["Trix Rabbit", 7, "trix|rabbit"]]), P("Name a state most Americans like.", "YouGov, 2025", [["Hawaii", 68], ["North Carolina", 62, "nc|carolina"], ["Alaska", 61], ["Tennessee", 60], ["Colorado", 59]]), P("Name something people do for Halloween.", "YouGov", [["Watch scary movies", 40, "movies|halloween movies|horror movies|scary movies"], ["Decorate", 39, "decorations|decorate house|decorating"], ["Trick-or-treat", 31, "trick or treating|candy|trick or treat"]]), P("Name something you see at a Thanksgiving Day parade.", "Big Dawg guess", [["Giant balloons", 38, "balloons|balloon"], ["Floats", 22, "float"], ["Marching bands", 15, "band|bands"], ["Santa", 10, "santa claus"], ["Clowns", 6, "clown"], ["Dancers", 4, "rockettes|cheerleaders"]]), P("Name something people do after Thanksgiving dinner.", "Big Dawg guess", [["Take a nap", 35, "nap|sleep|fall asleep"], ["Watch football", 25, "football|watch the game"], ["Eat dessert", 12, "pie|dessert"], ["Do the dishes", 10, "dishes|clean up|wash dishes"], ["Go for a walk", 7, "walk"], ["Play games", 5, "board games|cards|games"]]), P("Name something kids ask Santa for.", "Big Dawg guess", [["Toys", 30, "toy"], ["Video games", 22, "video game|game system|xbox|playstation|nintendo|switch"], ["A bike", 15, "bike|bicycle"], ["A puppy", 12, "puppy|dog|pet|kitten"], ["A phone", 9, "phone|iphone|cell phone"], ["Lego", 6, "legos"]]), P("Name something that goes in a Christmas stocking.", "Big Dawg guess", [["Candy", 34, "chocolate|candy canes|sweets"], ["Small toys", 20, "toys|toy"], ["Socks", 12, "sock"], ["Coal", 10], ["Gift cards", 9, "gift card|money|cash"], ["An orange", 7, "orange|oranges|fruit|clementine"]]), P("Name one of Santa's reindeer.", "Big Dawg guess", [["Rudolph", 40], ["Dasher", 14], ["Comet", 11], ["Blitzen", 9], ["Prancer", 8], ["Cupid", 7], ["Vixen", 5]]), P("Name something people lose all the time.", "Big Dawg guess", [["Keys", 40, "car keys"], ["Phone", 22, "cell phone"], ["TV remote", 14, "remote|clicker"], ["Wallet", 9, "purse"], ["Glasses", 7, "sunglasses"], ["Socks", 5, "sock"]]), P("Name something you find in a junk drawer.", "Big Dawg guess", [["Batteries", 28, "battery"], ["Rubber bands", 18, "rubber band"], ["Pens", 16, "pen|pencils|pencil"], ["Tape", 12, "scotch tape"], ["Scissors", 10], ["Takeout menus", 6, "menus|menu"]]), P("Name a reason the family dog barks.", "Big Dawg guess", [["Mailman", 34, "mail carrier|mail man|postman|delivery"], ["Doorbell", 24, "door|someone at the door|knock"], ["Squirrel", 18, "squirrels|animals"], ["Wants food", 10, "hungry|food|dinner"], ["Wants to go out", 8, "go outside|potty|pee"]]), P("Name something people do while stuck in traffic.", "Big Dawg guess", [["Listen to music", 32, "music|radio|sing"], ["Check their phone", 20, "phone|text|texting"], ["Honk", 14, "horn|honking"], ["Yell", 12, "complain|scream"], ["Eat a snack", 8, "snack|snacks|eat"], ["Pick their nose", 5, "nose"]]), P("Name something you need to build a snowman.", "Big Dawg guess", [["Snow", 35], ["Carrot", 25, "carrot nose"], ["Coal", 12, "rocks|buttons"], ["Hat", 10, "top hat"], ["Scarf", 8], ["Sticks", 6, "stick|arms|branches"]]), P("Name something people bring to a potluck.", "Big Dawg guess", [["Casserole", 28], ["Dessert", 22, "cookies|brownies|pie|cake"], ["Salad", 15], ["Chips and dip", 12, "chips|dip"], ["Mac and cheese", 10, "macaroni"], ["Deviled eggs", 6, "eggs"]]), P("Name a board game families play.", "Big Dawg guess", [["Monopoly", 32], ["Uno", 18], ["Sorry", 14], ["Scrabble", 12], ["Clue", 10], ["Candy Land", 8, "candyland"]]), P("Name something people do on New Year's Eve.", "Big Dawg guess", [["Watch the ball drop", 30, "ball drop|countdown|count down"], ["Kiss someone", 20, "kiss|midnight kiss"], ["Go to a party", 18, "party"], ["Fireworks", 14, "firework"], ["Make a toast", 10, "toast|champagne|cheers"], ["Go to bed early", 6, "sleep|bed"]]), P("Name something that's hard to do with mittens on.", "Big Dawg guess", [["Text", 30, "phone|texting|use phone"], ["Tie shoes", 22, "shoes|tie|shoelaces"], ["Zip a coat", 15, "zipper|zip"], ["Open a door", 10, "door|doorknob"], ["Unlock the car", 9, "keys|car"], ["Eat", 7, "food"]]), P("Name a word that rhymes with dawg.", "Big Dawg guess", [["Log", 30], ["Fog", 22], ["Frog", 18], ["Hog", 12], ["Jog", 9], ["Blog", 5]]), P("Name a breed of dog.", "Big Dawg guess", [["Labrador", 32, "lab|labs"], ["Golden retriever", 22, "golden|retriever"], ["German shepherd", 15, "shepherd"], ["Poodle", 11], ["Bulldog", 9], ["Beagle", 7]]), P("Name something people do to stay warm.", "Big Dawg guess", [["Blanket", 30, "blankets|covers"], ["Sit by the fire", 22, "fire|fireplace|campfire"], ["Hot drink", 15, "hot chocolate|coffee|tea|cocoa"], ["Wear layers", 13, "layers|sweater|coat|jacket"], ["Turn up the heat", 10, "heat|thermostat|heater"], ["Cuddle", 6, "snuggle|hug"]]), P("Name something you'd find in a school cafeteria.", "Big Dawg guess", [["Pizza", 30], ["Chocolate milk", 20, "milk"], ["Tater tots", 14, "tots"], ["Chicken nuggets", 12, "nuggets|chicken"], ["Lunch lady", 10, "lunch ladies"], ["Mystery meat", 8, "meatloaf|sloppy joes"]]), P("Name something parents yell at their kids.", "Big Dawg guess", [["Clean your room", 30, "clean|room"], ["Stop it", 18, "stop"], ["Go to bed", 15, "bed|bedtime"], ["Turn that off", 12, "turn it off"], ["Do your homework", 10, "homework"], ["Shut the door", 8, "door"]]), P("Name something people do on a long car ride.", "Big Dawg guess", [["Sleep", 28, "nap"], ["Sing", 18, "music|singing"], ["Snack", 15, "eat|food|snacks"], ["Play car games", 13, "i spy|license plate|games"], ["Watch movies", 12, "movie|tablet|ipad"], ["Ask are we there yet", 9, "are we there yet"]]), P("Name a famous dog.", "Big Dawg guess", [["Lassie", 30], ["Scooby-Doo", 26, "scooby"], ["Snoopy", 18], ["Clifford", 12], ["Air Bud", 6, "buddy"], ["Beethoven", 5]]), P("Name something people do on Black Friday.", "Big Dawg guess", [["Go shopping", 40, "shop|shopping|buy"], ["Wait in line", 20, "line|lines|camp out"], ["Eat leftovers", 14, "leftovers"], ["Stay home", 12, "avoid stores|nothing"], ["Online deals", 8, "online|amazon|internet"]]), P("Name something on the Christmas dinner table.", "Big Dawg guess", [["Ham", 32], ["Mashed potatoes", 18, "potatoes"], ["Rolls", 14, "bread|dinner rolls"], ["Green beans", 12, "beans"], ["Turkey", 10], ["Pie", 8, "dessert"]]), P("Name a Christmas decoration.", "Big Dawg guess", [["Lights", 34, "christmas lights"], ["Tree", 22, "christmas tree"], ["Wreath", 14], ["Ornaments", 12, "ornament|balls"], ["Stockings", 9, "stocking"], ["Inflatables", 5, "blow up|inflatable"]]), P("Name something people put off doing.", "Big Dawg guess", [["Laundry", 26, "wash clothes"], ["Dishes", 20], ["Going to the doctor", 16, "doctor|dentist"], ["Taxes", 14], ["Exercise", 12, "working out|gym"], ["Cleaning the garage", 6, "garage"]]), P("Name something people do when they can't sleep.", "Big Dawg guess", [["Look at their phone", 30, "phone|scroll"], ["Watch TV", 22, "tv"], ["Count sheep", 15, "sheep|count"], ["Read", 12, "book"], ["Get a snack", 10, "eat|snack"], ["Toss and turn", 6, "toss|turn"]]), P("Name a sport kids play.", "Big Dawg guess", [["Soccer", 30], ["Baseball", 24, "softball|tee ball"], ["Basketball", 20, "hoops"], ["Football", 12, "flag football"], ["Hockey", 6], ["Swimming", 5, "swim"]]), P("Name something you take to the beach.", "Big Dawg guess", [["Towel", 32, "beach towel"], ["Sunscreen", 24, "sunblock|lotion"], ["Umbrella", 14], ["Cooler", 10, "drinks"], ["Chair", 8, "beach chair"], ["Bucket and shovel", 6, "bucket|shovel|pail"]]), P("Name something a dog chews that it shouldn't.", "Big Dawg guess", [["Shoes", 40, "shoe|sneakers"], ["Socks", 18], ["Furniture", 12, "couch|chair|table legs"], ["Remote", 10], ["Homework", 8], ["Kids' toys", 6, "toys"]]), P("Name something people buy at a gas station.", "Big Dawg guess", [["Gas", 30, "fuel"], ["Snacks", 24, "chips|candy"], ["Drinks", 20, "soda|pop|energy drink"], ["Coffee", 10], ["Lottery tickets", 9, "lottery|scratch offs|scratchers"], ["Hot dog", 4, "roller"]]), P("Name something kids do at a sleepover.", "Big Dawg guess", [["Watch movies", 30, "movie"], ["Stay up late", 22, "stay up|no sleep"], ["Eat junk food", 15, "snacks|popcorn|candy|pizza"], ["Play games", 12, "truth or dare|games"], ["Pillow fight", 10, "pillows"], ["Tell scary stories", 6, "ghost stories|stories"]]), P("Name a reason you'd be late to Thanksgiving dinner.", "Big Dawg guess", [["Traffic", 34], ["Bad weather", 18, "weather|snow|ice|storm"], ["Overslept", 14, "sleep"], ["Watching football", 10, "football|game"], ["Forgot the food", 9, "forgot"], ["Car trouble", 8, "flat tire|car broke"]]), P("Name a job Santa's elves do.", "Big Dawg guess", [["Make toys", 40, "toys|build toys"], ["Wrap presents", 22, "wrap|wrapping"], ["Check the list", 12, "naughty list|list"], ["Feed the reindeer", 10, "reindeer"], ["Load the sleigh", 8, "sleigh"], ["Bake cookies", 4, "cookies"]]), P("Name something in a first aid kit.", "Big Dawg guess", [["Bandages", 40, "band aids|band-aids|bandaid"], ["Gauze", 15], ["Tape", 10], ["Ointment", 10, "neosporin|cream"], ["Scissors", 8], ["Tweezers", 6]]), P("Name a pie that isn't pumpkin.", "Big Dawg guess", [["Apple", 38], ["Pecan", 20], ["Cherry", 14], ["Sweet potato", 10], ["Key lime", 8, "lime"], ["Chocolate", 6, "chocolate cream"]]), P("Name something Grandma always says.", "Big Dawg guess", [["Have you eaten?", 26, "eat|hungry|eat more"], ["You've grown", 22, "grown|so big|getting big"], ["Put a coat on", 14, "coat|jacket|cold"], ["Call more", 12, "call me|visit|call"], ["Back in my day", 10, "my day"], ["I love you", 8, "love you"]]), P("Name something you can't do in a library.", "Big Dawg guess", [["Talk loud", 36, "talk|yell|be loud|noise"], ["Eat", 20, "food|snacks"], ["Use your phone", 14, "phone|calls"], ["Run", 10], ["Sleep", 6], ["Play music", 5, "music"]]), P("Name a topping for a baked potato.", "Big Dawg guess", [["Butter", 34], ["Sour cream", 26], ["Cheese", 18], ["Bacon bits", 10, "bacon"], ["Chives", 7, "green onions|onion"]]), P("Name something always found in a teenager's room.", "Big Dawg guess", [["Dirty clothes", 32, "clothes|laundry"], ["Phone charger", 15, "charger"], ["Dirty dishes", 14, "dishes|plates|cups"], ["Gaming system", 12, "video games|xbox|playstation"], ["Posters", 10], ["Snack wrappers", 7, "food|wrappers|snacks"]]), P("Name something people do when the power goes out.", "Big Dawg guess", [["Light candles", 34, "candles|candle"], ["Grab a flashlight", 24, "flashlight"], ["Check their phone", 12, "phone"], ["Go to bed", 10, "sleep|bed"], ["Play board games", 8, "games|cards"], ["Call the power company", 6, "call|power company"]]), P("Name something used to decorate Christmas cookies.", "Big Dawg guess", [["Sprinkles", 34], ["Icing", 28, "frosting"], ["M&Ms", 10, "m and ms|mms"], ["Red hots", 8, "cinnamon"], ["Chocolate chips", 8], ["Crushed candy canes", 6, "candy canes|peppermint"]]), P("Name something you hear at a football game.", "Big Dawg guess", [["Crowd cheering", 30, "cheering|cheers|crowd"], ["Whistle", 22, "referee|refs"], ["Marching band", 15, "band|fight song"], ["Announcer", 12], ["Booing", 10, "boo"], ["Air horn", 5, "horn"]])];
  var CK = "bdd:feud:crew";
  var tidy = function tidy(t) {
    t = String(t).trim().slice(0, 24);
    return t.charAt(0).toUpperCase() + t.slice(1);
  };
  var crewBoard = function crewBoard(lists) {
    return FEUD_QS.map(function (q, i) {
      var gs = [];
      (lists[i] || []).forEach(function (raw) {
        var n = norm(raw);
        if (!n) return;
        var g = gs.find(function (g) {
          return g.k.some(function (k) {
            return alike(k, n);
          });
        });
        if (g) {
          g.c++;
          if (!g.k.includes(n)) g.k.push(n);
        } else gs.push({
          label: tidy(raw),
          k: [n],
          c: 1
        });
      });
      var tot = gs.reduce(function (a, g) {
        return a + g.c;
      }, 0) || 1;
      return {
        q: q,
        src: "The crew's own answers \xB7 ".concat(tot, " in"),
        a: gs.sort(function (a, b) {
          return b.c - a.c;
        }).slice(0, 8).map(function (g) {
          return {
            label: g.label,
            pts: Math.round(100 * g.c / tot),
            k: g.k
          };
        })
      };
    });
  };
  var rk = function rk() {
    return "bdd:den:feud:" + KEY + ":" + (me ? me.id : "");
  };
  var rr = function rr(c, x, y, w, h, r) {
    c.beginPath();
    if (c.roundRect) c.roundRect(x, y, w, h, r);else c.rect(x, y, w, h);
  };
  var wrap = function wrap(c, text, maxW) {
    var out = [];
    var line = "";
    text.split(" ").forEach(function (w) {
      var t = line ? line + " " + w : w;
      if (line && c.measureText(t).width > maxW) {
        out.push(line);
        line = w;
      } else line = t;
    });
    if (line) out.push(line);
    return out;
  };
  var fit = function fit(c, text, maxW, size, wt, fam) {
    var f = size;
    do {
      c.font = "".concat(wt, " ").concat(f, "px ").concat(fam);
    } while (c.measureText(text).width > maxW && --f > 9);
  };
  var KB = ["QWERTYUIOP", "ASDFGHJKL", ">ZXCVBNM<", " "];
  var tot = function tot(q) {
    return q.a.reduce(function (a, x) {
      return a + x.pts;
    }, 0);
  };
  var got = function got(s, i) {
    return s.found[i].reduce(function (a, j) {
      return a + s.qs[i].a[j].pts;
    }, 0);
  };
  var qScore = function qScore(s, i) {
    return tot(s.qs[i]) ? Math.round(200 * got(s, i) / tot(s.qs[i])) : 0;
  };
  var scoreOf = function scoreOf(s) {
    return s.qs.reduce(function (a, q, i) {
      return a + qScore(s, i);
    }, 0);
  };
  var TOP = 34;
  var pal = function pal(G) {
    var dk = G.dark();
    return {
      dk: dk,
      ink: dk ? "#fff" : "#121213",
      bg: dk ? "#121213" : "#fff",
      mute: dk ? "#a3a3a8" : "#66666b",
      line: dk ? "#3a3a3c" : "#d3d6da"
    };
  };
  var typeKey = function typeKey(s, k) {
    if (k === "<") s.typed = s.typed.slice(0, -1);else if (k === " ") {
      if (s.typed && !/ $/.test(s.typed) && s.typed.length < 26) s.typed += " ";
    } else if (s.typed.length < 26) s.typed += k;
  };
  function question(G, c, P, q, y) {
    var qf = G.H < 560 ? 17 : 19;
    c.font = "700 ".concat(qf, "px ").concat(G.TITLE);
    c.fillStyle = P.ink;
    c.textAlign = "center";
    wrap(c, q.q, G.W - 32).slice(0, 3).forEach(function (l) {
      c.fillText(l, G.W / 2, y);
      y += qf + 4;
    });
    fit(c, q.src, G.W - 28, 11.5, 500, G.UI);
    c.fillStyle = P.mute;
    c.fillText(q.src, G.W / 2, y);
    return y + 16;
  }
  function board(G, c, P, q, y, sh, st) {
    var s = G.s,
      rows = Math.ceil(q.a.length / 2),
      gap = 6,
      cw = (G.W - 24 - gap) / 2;
    return q.a.map(function (a, j) {
      var col = j < rows ? 0 : 1,
        x = 12 + col * (cw + gap),
        yy = y + (j - col * rows) * (sh + gap),
        v = st(j),
        mid = yy + sh / 2 + 1;
      rr(c, x, yy, cw, sh, 8);
      c.fillStyle = v === 1 ? s.flash === j && s.flashT > 0 ? "#f8e3a1" : "#e9b949" : v === 2 ? P.dk ? "#2c2c2e" : "#ecece6" : P.dk ? "#27386b" : "#1f3a8a";
      c.fill();
      if (v) {
        c.fillStyle = v === 1 ? "#2b1a10" : v === 2 ? P.mute : "rgba(255,255,255,.72)";
        c.textAlign = "left";
        fit(c, a.label, cw - 46, 14, 700, G.UI);
        c.fillText(a.label, x + 9, mid);
        c.textAlign = "right";
        c.font = "700 14px ".concat(G.UI);
        c.fillText(a.pts, x + cw - 9, mid);
      } else {
        c.fillStyle = "#fff";
        c.textAlign = "center";
        c.font = "700 ".concat(Math.min(16, sh * 0.5), "px ").concat(G.UI);
        c.fillText(j + 1, x + cw / 2, mid);
      }
      return {
        x: x,
        y: yy,
        w: cw,
        h: sh,
        slot: j
      };
    });
  }
  function strikes(c, P, n, x, y) {
    for (var k = 0; k < 3; k++) {
      var xx = x + k * 32,
        used = k < n;
      rr(c, xx, y, 26, 26, 6);
      if (used) {
        c.fillStyle = "#d64545";
        c.fill();
      } else {
        c.lineWidth = 1.5;
        c.strokeStyle = P.line;
        c.stroke();
      }
      c.fillStyle = used ? "#fff" : P.line;
      c.textAlign = "center";
      c.font = "700 15px sans-serif";
      c.fillText("✕", xx + 13, y + 14);
    }
  }
  function inputBox(G, c, P, y, hint) {
    var s = G.s,
      bx = 14 + (s.shake > 0 ? Math.sin(s.shake * 60) * 5 : 0),
      bw = G.W - 28,
      bh = 42;
    rr(c, bx, y, bw, bh, 8);
    c.lineWidth = 2;
    c.strokeStyle = s.typed ? P.ink : P.line;
    c.stroke();
    c.textAlign = "left";
    c.font = "700 17px ".concat(G.UI);
    if (s.typed) {
      c.fillStyle = P.ink;
      c.fillText(s.typed, bx + 12, y + bh / 2 + 1);
    } else {
      var m = s.msgT > 0 && s.msg;
      c.fillStyle = m ? P.ink : P.mute;
      c.font = "".concat(m ? 600 : 500, " 15px ").concat(G.UI);
      c.fillText(m || hint, bx + 12, y + bh / 2 + 1);
    }
    if (s.t % 1 < 0.55 && (s.typed || !(s.msgT > 0))) {
      var tw = s.typed ? (c.font = "700 17px ".concat(G.UI), c.measureText(s.typed).width) : 0;
      c.fillStyle = P.ink;
      c.fillRect(bx + 13 + tw, y + 10, 2, bh - 20);
    }
  }
  function keys(G, c, P, kbH) {
    var W = G.W,
      ky = G.H - kbH,
      kh = (kbH - 12) / 4 - 6,
      kw = (W - 12) / 10 - 5;
    KB.forEach(function (row, r) {
      var ks = row.split(""),
        wide = function wide(k) {
          return k === " " ? kw * 5 + 20 : k === "<" || k === ">" ? kw * 1.5 + 2.5 : kw;
        };
      var x = (W - ks.reduce(function (a, k) {
        return a + wide(k) + 5;
      }, -5)) / 2;
      ks.forEach(function (k) {
        var w = wide(k),
          yy = ky + 6 + r * (kh + 6);
        rr(c, x, yy, w, kh, 5);
        c.fillStyle = P.dk ? "#818384" : "#d3d6da";
        c.fill();
        c.fillStyle = P.ink;
        c.font = "700 ".concat(k === "<" || k === ">" || k === " " ? 13 : 16, "px ").concat(G.UI);
        c.textAlign = "center";
        c.fillText(k === "<" ? "⌫" : k === ">" ? "ENTER" : k === " " ? "space" : k, x + w / 2, yy + kh / 2 + 1);
        G.s.btns.push({
          x: x,
          y: yy,
          w: w,
          h: kh,
          key: k
        });
        x += w + 5;
      });
    });
  }
  var HK = "bdd:feud:host",
    CODE = "bdd:feud:code",
    USED = "bdd:feud:used",
    TM = "bdd:feud:tm",
    TEAMS = ["Team Turkey", "Team Gravy"],
    TSEC = 15,
    FMT = 200;
  var MODE = "solo",
    HS = null,
    HD = null,
    hist = [];
  var to100 = function to100(b) {
    var t = tot(b) || 1,
      raw = b.a.map(function (a) {
        return 100 * a.pts / t;
      }),
      fl = raw.map(Math.floor);
    var left = 100 - fl.reduce(function (x, y) {
      return x + y;
    }, 0);
    raw.map(function (r, j) {
      return [r - fl[j], j];
    }).sort(function (x, y) {
      return y[0] - x[0];
    }).forEach(function (p) {
      if (left-- > 0) fl[p[1]]++;
    });
    return {
      q: b.q,
      src: b.src + " · scaled to 100",
      a: b.a.map(function (a, j) {
        return {
          label: a.label,
          pts: fl[j],
          k: a.k
        };
      }).sort(function (x, y) {
        return y.pts - x.pts;
      })
    };
  };
  function pick(list, n) {
    if (!store.get(USED)) store.set(USED, DAYS["2026-11-26"].slice(0, 3).map(function (b) {
      return b.q;
    }));
    var used = store.get(USED) || [],
      f = list.filter(function (b) {
        return !used.includes(b.q);
      });
    if (f.length < n) {
      used = used.filter(function (q) {
        return !list.some(function (b) {
          return b.q === q;
        });
      });
      f = list.slice();
    }
    f = f.map(function (b) {
      return [Math.random(), b];
    }).sort(function (x, y) {
      return x[0] - y[0];
    }).slice(0, n).map(function (p) {
      return p[1];
    });
    store.set(USED, used.concat(f.map(function (b) {
      return b.q;
    })));
    return f;
  }
  var pile = function pile() {
    var _ref3;
    return (_ref3 = []).concat.apply(_ref3, _toConsumableArray(Object.keys(DAYS).filter(function (d) {
      return d <= KEY && Array.isArray(DAYS[d]);
    }).map(function (d) {
      return DAYS[d];
    })).concat([SPARE, MORE]));
  };
  var newFm = function newFm(team) {
    return {
      qs: pick(pile().filter(function (b) {
        return b.a.length > 3;
      }), 5).map(to100),
      team: team,
      p: 0,
      ans: [[], []],
      rev: [0, 0]
    };
  };
  var fmTot = function fmTot(f) {
    return [0, 1].reduce(function (t, p) {
      return t + f.ans[p].slice(0, f.rev[p]).reduce(function (x, j, i) {
        return x + (j >= 0 ? f.qs[i].a[j].pts : 0);
      }, 0);
    }, 0);
  };
  function newDeck(name, raw) {
    if (name === "fm") return [];
    var cb = raw ? crewBoard(raw).filter(function (b) {
      return b.a.length > 1;
    }) : [];
    if (name === "crew") return cb.map(to100);
    var c = name === "mix" ? pick(cb, Math.min(2, cb.length)) : [];
    var d = pick(pile(), 5 - c.length).sort(function (x, y) {
      return x.a.length - y.a.length;
    });
    c.forEach(function (b, i) {
      return d.splice(1 + 2 * i, 0, b);
    });
    return d.map(to100);
  }
  var oldDeck = function oldDeck(h) {
    var _ref4;
    if (h.name === "polls") return (_ref4 = []).concat.apply(_ref4, _toConsumableArray(Object.keys(DAYS).filter(function (d) {
      return d <= h.day && Array.isArray(DAYS[d]);
    }).map(function (d) {
      return DAYS[d];
    })).concat([SPARE]));
    var cb = crewBoard(h.raw),
      T = DAYS["2026-11-26"];
    return h.name === "mix" ? [T[1], cb[4], T[2], cb[0], T[0]] : cb;
  };
  var hLoad = function hLoad() {
    HS = store.get(HK);
    hist = [];
    if (HS && !HS.deck) {
      HS.deck = oldDeck(HS);
      delete HS.raw;
    }
    HD = HS ? HS.deck : null;
    if (HS) {
      HD.forEach(function (b) {
        return b.a.forEach(function (a) {
          a.k = a.k || [norm(a.label)];
        });
      });
      HS.ctl = HS.ctl || HD.map(function (b, i) {
        return HS.won[i] >= 0 ? HS.won[i] : -1;
      });
      HS.amt = HS.amt || HD.map(function () {
        return 0;
      });
      askCode();
      hPush();
    }
  };
  var hSave = function hSave() {
    store.set(HK, HS);
    hPush();
  };
  var snap = function snap() {
    hist.push(JSON.stringify(HS));
    if (hist.length > 30) hist.shift();
  };
  function undo() {
    if (!hist.length) return;
    var o = HS;
    HS = Object.assign(JSON.parse(hist.pop()), {
      code: o.code,
      nx: o.nx,
      nd: o.nd,
      tm: o.tm,
      tn: o.tn,
      tl: 0
    });
    HD = HS.deck;
    hSave();
  }
  var mult = function mult(i) {
    return i === HD.length - 1 ? 3 : i === HD.length - 2 ? 2 : 1;
  };
  var view = function view() {
    var h = HS,
      i = h.qi,
      q = HD[i],
      f = h.fm;
    if (f) {
      var live = f.ans[f.p].length < 5,
        done = f.rev[1] === 5,
        _tot = fmTot(f),
        a = [];
      if (f.top) f.qs.forEach(function (b) {
        return a.push([b.a[0].label, b.a[0].pts, 0]);
      });else [0, 1].forEach(function (p) {
        return f.qs.forEach(function (b, k) {
          var j = f.ans[p][k];
          a.push(k < f.rev[p] && !(p === 0 && f.p === 1 && live) ? j >= 0 ? [b.a[j].label, b.a[j].pts, 0] : ["✕", 0, 1] : 0);
        });
      });
      return {
        fm: 1,
        rd: "FAST MONEY \xB7 ".concat(FMT, " TO WIN"),
        q: f.top ? "The number one answers" : done ? "Fast Money" : "Player ".concat(f.p + 1, ": ").concat(f.qs[live ? f.ans[f.p].length : Math.min(4, f.rev[f.p])].q),
        a: a,
        st: 0,
        x: h.nx || 0,
        xn: 1,
        d: h.nd || 0,
        pot: _tot,
        sc: h.score,
        tm: h.tm || TEAMS,
        tn: h.tn || 0,
        tl: h.tl || 0,
        won: -1,
        over: done && !f.top,
        win: _tot >= FMT,
        msg: done ? _tot >= FMT ? "".concat(_tot, " points! ").concat((h.tm || TEAMS)[f.team], " wins Fast Money! \uD83C\uDF89") : "".concat(_tot, " points. So close!") : ""
      };
    }
    var ctl = h.ctl ? h.ctl[i] : -1,
      turn = h.over || h.won[i] >= 0 || ctl < 0 ? -1 : h.strikes[i] >= 3 ? 1 - ctl : ctl;
    return {
      tu: turn,
      r: i + 1,
      of: HD.length,
      m: mult(i),
      q: q.q,
      a: q.a.map(function (a, j) {
        return h.shown[i].includes(j) ? [a.label, a.pts, h.free[i].includes(j) ? 1 : 0] : 0;
      }),
      st: h.strikes[i],
      x: h.nx || 0,
      xn: h.xn || 1,
      d: h.nd || 0,
      pot: h.pot,
      sc: h.score,
      tm: h.tm || TEAMS,
      tn: h.tn || 0,
      tl: h.tl || 0,
      won: h.won[i],
      over: h.over
    };
  };
  var pushing = false,
    dirty = false,
    fails = 0,
    asking = false;
  function hPush() {
    if (!HS || !me) return;
    if (!HS.code) return askCode();
    if (pushing) {
      dirty = true;
      return;
    }
    pushing = true;
    dirty = false;
    API("feudPush", me.id, HS.code, view()).then(function () {
      fails = 0;
      return 0;
    }, function (e) {
      if (/No game/.test(errMsg(e)) && HS) {
        HS.code = "";
        store.set(CODE, null);
        store.set(HK, HS);
        return 1;
      }
      return ++fails < 5 ? 2000 : 0;
    }).then(function (wait) {
      pushing = false;
      if (wait > 1) setTimeout(hPush, wait);else if (wait || dirty) hPush();
    });
  }
  function askCode() {
    var h = HS;
    if (!h || h.code || asking || !me) return;
    asking = true;
    API("feudHost", me.id, "").then(function (r) {
      asking = false;
      if (HS && !HS.code && r && r.code) {
        HS.code = r.code;
        store.set(CODE, r.code);
        hSave();
      }
    }, function () {
      asking = false;
    });
  }
  var TV = null;
  function tvClose() {
    if (!TV) return;
    TV.alive = false;
    clearTimeout(TV.xt);
    clearInterval(TV.tick);
    try {
      if (document.fullscreenElement) document.exitFullscreen();
    } catch (e) {}
    try {
      if (TV.wake) TV.wake.release();
    } catch (e) {}
    TV.root.remove();
    TV = null;
  }
  function tvOpen(code, v) {
    tvClose();
    var root = el("div", "ftv"),
      mk = function mk(cls, parent, text) {
        var n = el("div", cls, text);
        (parent || root).append(n);
        return n;
      };
    var top = mk("ftv-top"),
      t0 = mk("ftv-team", top),
      mid = mk("ftv-mid", top),
      t1 = mk("ftv-team", top);
    var T = TV = {
      t0: t0,
      t1: t1,
      root: root,
      alive: true,
      last: null,
      key: "",
      n0: mk("ftv-tn", t0),
      s0: mk("ftv-ts", t0),
      rd: mk("ftv-rd", mid),
      pot: mk("ftv-pot", mid),
      n1: mk("ftv-tn", t1),
      s1: mk("ftv-ts", t1),
      q: mk("ftv-q", null, "Waiting for the host…"),
      board: mk("ftv-board"),
      st: mk("ftv-st"),
      clock: mk("ftv-clock"),
      x: mk("ftv-x"),
      win: mk("ftv-win")
    };
    T.tick = setInterval(function () {
      if (!T.end) return;
      var left = Math.ceil((T.end - Date.now()) / 1000);
      T.clock.textContent = Math.max(0, left);
      T.clock.classList.toggle("low", left <= 5);
      if (left <= 0) {
        T.end = 0;
        timesUp();
        setTimeout(function () {
          if (!T.end) T.clock.classList.remove("go");
        }, 2500);
      }
    }, 200);
    var foot = mk("ftv-foot");
    mk("ftv-code", foot, "Big Dawg Feud \xB7 TV code ".concat(code));
    var fs = el("button", "ftv-btn", "Full screen"),
      ex = el("button", "ftv-btn", "Exit");
    foot.append(fs, ex);
    fs.addEventListener("click", function () {
      try {
        (root.requestFullscreen || root.webkitRequestFullscreen).call(root);
      } catch (e) {}
    });
    ex.addEventListener("click", tvClose);
    document.body.append(root);
    try {
      navigator.wakeLock.request("screen").then(function (w) {
        T.wake = w;
      })["catch"](function () {});
    } catch (e) {}
    tvRender(v);
    var _poll = function poll() {
      if (T.alive) API("feudWatch", code).then(tvRender)["catch"](function () {}).then(function () {
        return setTimeout(_poll, 700);
      });
    };
    setTimeout(_poll, 700);
  }
  function tvRender(v) {
    var T = TV;
    if (!T || !T.alive || !v) return;
    var L = T.last;
    T.t0.classList.toggle("turn", v.tu === 0);
    T.t1.classList.toggle("turn", v.tu === 1);
    T.n0.textContent = v.tm[0];
    T.n1.textContent = v.tm[1];
    T.s0.textContent = v.sc[0];
    T.s1.textContent = v.sc[1];
    T.pot.textContent = v.pot;
    T.rd.textContent = v.rd || "ROUND ".concat(v.r, " OF ").concat(v.of) + (v.m > 1 ? v.m === 2 ? " · DOUBLE" : " · TRIPLE" : "");
    var key = v.fm ? "fm" + v.a.length : v.r + "|" + v.q;
    T.q.textContent = v.q;
    if (key !== T.key) {
      T.key = key;
      T.board.textContent = "";
      var rows = Math.ceil(v.a.length / 2),
        cols = [el("div", "ftv-col"), el("div", "ftv-col")];
      T.board.append(cols[0], cols[1]);
      T.slots = v.a.map(function (a, j) {
        var n = el("div", "ftv-slot");
        cols[j < rows ? 0 : 1].append(n);
        return n;
      });
      T.sig = v.a.map(function () {
        return null;
      });
    }
    v.a.forEach(function (a, j) {
      var sig = a ? a.join("|") : "",
        n = T.slots[j];
      if (T.sig[j] === sig) return;
      T.sig[j] = sig;
      n.textContent = "";
      if (a) {
        n.className = "ftv-slot on" + (a[2] ? " free" : "");
        n.append(el("span", "ftv-al", a[0]), el("span", "ftv-ap", a[1]));
      } else {
        n.className = "ftv-slot";
        n.append(el("span", "ftv-num", j + 1));
      }
    });
    T.st.textContent = "✕".repeat(v.st);
    if (L && v.x > L.x) {
      T.x.textContent = "✕".repeat(v.xn || 1);
      T.x.classList.add("go");
      buzzer();
      clearTimeout(T.xt);
      T.xt = setTimeout(function () {
        return T.x.classList.remove("go");
      }, 1500);
    }
    if (L && v.d > L.d) ding();
    if (L && v.tn > (L.tn || 0) && v.tl) {
      T.end = Date.now() + v.tl * 1000;
      T.clock.textContent = v.tl;
      T.clock.classList.remove("low");
      T.clock.classList.add("go");
    } else if (!v.tl && T.end) {
      T.end = 0;
      T.clock.classList.remove("go");
    }
    if (L && v.won >= 0 && L.won < 0 && L.r === v.r && typeof chime === "function") chime("win");
    T.win.textContent = v.over ? v.msg || (v.sc[0] === v.sc[1] ? "It's a tie!" : "".concat(v.tm[v.sc[0] > v.sc[1] ? 0 : 1], " wins! \uD83E\uDD83")) : "";
    T.win.classList.toggle("go", !!v.over);
    if (v.over && L && !L.over && (!v.fm || v.win) && typeof celebrate === "function") celebrate();
    T.last = v;
  }
  var ac;
  function tone(type, f, dur, vol) {
    if (typeof fxOn === "function" && !fxOn()) return;
    try {
      ac = ac || new (window.AudioContext || window.webkitAudioContext)();
      var o = ac.createOscillator(),
        g = ac.createGain(),
        t = ac.currentTime;
      o.type = type;
      o.frequency.value = f;
      g.gain.setValueAtTime(vol, t);
      g.gain.setValueAtTime(vol, t + dur * 0.6);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g);
      g.connect(ac.destination);
      o.start(t);
      o.stop(t + dur);
    } catch (e) {}
  }
  var ding = function ding() {
    tone("sine", 1568, 0.9, 0.18);
    tone("sine", 2093, 0.6, 0.09);
  };
  var timesUp = function timesUp() {
    tone("square", 196, 0.9, 0.16);
    tone("square", 147, 0.9, 0.12);
  };
  var buzzer = function buzzer() {
    tone("sawtooth", 130, 0.8, 0.2);
    tone("square", 137, 0.8, 0.1);
  };
  defGame({
    key: "feud",
    name: "Feud",
    icon: "🦃",
    max: 1000,
    cat: "den",
    puzzle: true,
    blurb: "Survey says! Through Sunday.",
    how: "Five survey questions a day. Type an answer you think is on the board and hit Enter. Get it right and it flips over with its points. Miss and it's a strike, and three strikes ends the question (or tap Pass to move on). Thursday to Saturday use real polls, so you're guessing what America said, and the source is under each question. Sunday is the Crew Edition, built from the crew's own survey answers. Each question is worth up to 200: your share of the points on its board. Got a room full of people? Flip the switch at the top to Host: two teams on one screen, you flip the answers, hit Strike, and hand the pot to the team that wins the round. To put the board on a TV, open Feud on a computer, tap TV and type the code from the host's phone. Here through Sunday only.",
    reset: function reset(G) {
      var s = G.s = {
        typed: "",
        msg: "",
        msgT: 0,
        btns: [],
        postT: 0,
        flash: -1,
        flashT: 0,
        shake: 0,
        t: 0
      };
      var qs = DAYS[KEY] || DAYS["2026-11-26"];
      if (qs === "crew") {
        var c = store.get(CK);
        if (!c) {
          s.loading = true;
          return this.fetchCrew(G);
        }
        s.crew = c !== "none";
        qs = s.crew ? crewBoard(c) : SPARE;
      }
      s.qs = qs;
      var r = store.get(rk());
      if (r && r.found) Object.assign(s, {
        qi: r.qi,
        found: r.found,
        strikes: r.strikes,
        over: r.over,
        el: r.el || 0,
        done: r.done,
        posted: r.posted
      });else Object.assign(s, {
        qi: 0,
        found: qs.map(function () {
          return [];
        }),
        strikes: qs.map(function () {
          return 0;
        }),
        over: qs.map(function (q) {
          return !q.a.length;
        }),
        el: 0,
        done: false
      });
    },
    fetchCrew: function fetchCrew(G) {
      var _this = this;
      var s = G.s;
      API("getFeudSurvey", me ? me.id : "").then(function (r) {
        if (!r || r.open) throw new Error("early");
        store.set(CK, r.n >= 3 ? r.answers : "none");
        if (G.s === s) _this.reset(G);
      })["catch"](function () {
        if (G.s === s) {
          s.loading = false;
          s.err = true;
        }
      });
    },
    persist: function persist(G) {
      var s = G.s;
      store.set(rk(), {
        qi: s.qi,
        found: s.found,
        strikes: s.strikes,
        over: s.over,
        el: s.el,
        done: s.done,
        posted: s.posted,
        score: s.done ? scoreOf(s) : 0
      });
    },
    info: function info(G) {
      var s = G.s,
        sc = scoreOf(s),
        top = s.qs.filter(function (q, i) {
          return s.found[i].includes(0);
        }).length;
      var grid = s.qs.map(function (q, i) {
        var f = s.found[i].length,
          n = q.a.length;
        return f === n ? "🟩" : f * 2 >= n ? "🟨" : f ? "🟧" : "⬛";
      }).join("");
      var day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][new Date(KEY + "T12:00:00").getDay()];
      return {
        score: sc,
        grid: grid,
        title: sc >= 800 ? "Survey says: Big Dawg! 🦃" : sc >= 500 ? "Good answer! Good answer!" : "Survey says…",
        sub: "".concat(top, " of ").concat(s.qs.length, " number-one answers. ").concat(sc, " pts."),
        share: "Feud \uD83E\uDD83 ".concat(s.crew ? "Crew Edition" : day, " \xB7 ").concat(sc, " pts\n").concat(grid)
      };
    },
    say: function say(G, m, t) {
      G.s.msg = m;
      G.s.msgT = t || 1.8;
    },
    endQ: function endQ(G, i) {
      var s = G.s;
      s.over[i] = true;
      s.typed = "";
      if (s.over.every(Boolean)) {
        s.done = true;
        s.postT = 1.2;
        G.sfx("win");
      }
      this.persist(G);
    },
    enter: function enter(G) {
      var s = G.s,
        i = s.qi,
        q = s.qs[i];
      if (s.done || s.over[i]) return;
      var n = norm(s.typed);
      if (n.length < 2) return this.say(G, "Type an answer first");
      var hits = match(q, n),
        open = hits.filter(function (j) {
          return !s.found[i].includes(j);
        });
      s.typed = "";
      if (open.length > 1) return this.say(G, "Could be a couple. Be more specific.", 1.8);
      if (!open.length && hits.length) return this.say(G, "Already on the board");
      if (open.length) {
        s.found[i].push(open[0]);
        s.flash = open[0];
        s.flashT = 0.7;
        G.sfx("pop");
        this.say(G, open[0] === 0 ? "Number one answer!" : "Good answer!");
        if (s.found[i].length === q.a.length) return this.endQ(G, i);
      } else {
        s.strikes[i]++;
        s.shake = 0.4;
        G.buzz();
        this.say(G, "Not on the board");
        if (s.strikes[i] >= 3) return this.endQ(G, i);
      }
      this.persist(G);
    },
    press: function press(G, k) {
      var s = G.s;
      if (s.done || s.over[s.qi]) return;
      if (k === ">") return this.enter(G);
      typeKey(s, k);
    },
    update: function update(G, dt) {
      var s = G.s;
      s.t += dt;
      if (s.msgT > 0) s.msgT -= dt;
      if (s.shake > 0) s.shake -= dt;
      if (s.flashT > 0) s.flashT -= dt;
      if (s.bigX > 0) s.bigX -= dt;
      if (s.quitT > 0) s.quitT -= dt;
      if (s.upT > 0) s.upT -= dt;
      if (s.timer > 0) {
        var was = Math.ceil(s.timer);
        s.timer -= dt;
        if (s.timer <= 0) {
          s.timer = 0;
          s.upT = 3;
          timesUp();
          G.buzz();
        } else if (Math.ceil(s.timer) < was && s.timer <= 5) tone("sine", 880, 0.08, 0.1);
      }
      if (MODE !== "solo" || !s.qs) return;
      if (!s.done) {
        s.el += dt;
        s.ck = (s.ck || 0) + dt;
        if (s.ck > 2) {
          s.ck = 0;
          this.persist(G);
        }
      }
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
        P = pal(G),
        ink = P.ink,
        mute = P.mute,
        W = G.W,
        H = G.H;
      s.btns = [];
      c.fillStyle = P.bg;
      c.fillRect(0, 0, W, H);
      c.textBaseline = "middle";
      var gw = 216,
        sw = gw / 3,
        gx = W / 2 - gw / 2;
      rr(c, gx, 4, gw, 28, 14);
      c.fillStyle = P.dk ? "#2c2c2e" : "#ecece6";
      c.fill();
      ["solo", "host", "tv"].forEach(function (m, k) {
        var on = MODE === m,
          x = gx + k * sw;
        if (on) {
          rr(c, x + 2, 6, sw - 4, 24, 12);
          c.fillStyle = ink;
          c.fill();
        }
        c.fillStyle = on ? P.bg : mute;
        c.textAlign = "center";
        c.font = "700 13px ".concat(G.UI);
        c.fillText(["Solo", "Host", "TV"][k], x + sw / 2, 19);
        s.btns.push({
          x: x,
          y: 0,
          w: sw,
          h: 36,
          k: "mode",
          m: m
        });
      });
      if (MODE === "host") return this.hostDraw(G, c, P);
      if (MODE === "tv") {
        c.fillStyle = ink;
        c.textAlign = "center";
        c.font = "700 24px ".concat(G.TITLE);
        c.fillText("Put the game on this screen", W / 2, TOP + 44);
        c.font = "500 14.5px ".concat(G.UI);
        c.fillStyle = mute;
        var _y = TOP + 80;
        wrap(c, "Start a game in Host mode on your phone, then type its TV code here. This screen shows the board for the room, and the phone runs the game.", W - 48).forEach(function (l) {
          c.fillText(l, W / 2, _y);
          _y += 21;
        });
        inputBox(G, c, P, _y + 8, "TV code");
        keys(G, c, P, Math.min(214, H * 0.34));
        return;
      }
      if (!s.qs) {
        c.fillStyle = ink;
        c.textAlign = "center";
        c.font = "600 16px ".concat(G.UI);
        c.fillText(s.err ? "Couldn't load the crew's answers." : "Loading the crew's answers…", W / 2, H * 0.4);
        if (s.err) s.btns.push(Object.assign(G.pill(c, W / 2 - 80, H * 0.4 + 28, 160, 46, "Try again", true), {
          k: "retry"
        }));
        return;
      }
      var i = s.qi,
        q = s.qs[i],
        over = s.over[i],
        typing = !over && !s.done;
      c.font = "600 13px ".concat(G.UI);
      c.fillStyle = mute;
      c.textAlign = "left";
      c.fillText("".concat(s.crew ? "Crew Edition" : "Survey says", " \xB7 ").concat(i + 1, " of ").concat(s.qs.length), 14, TOP + 14);
      c.textAlign = "right";
      c.fillText("".concat(scoreOf(s), " pts"), W - 14, TOP + 14);
      var y = question(G, c, P, q, TOP + 40);
      var kbH = typing ? Math.min(214, H * 0.34) : 0,
        rows = Math.ceil(q.a.length / 2);
      var sh = Math.max(26, Math.min(44, (H - y - kbH - 100) / rows - 6));
      board(G, c, P, q, y, sh, function (j) {
        return s.found[i].includes(j) ? 1 : over ? 2 : 0;
      });
      y += rows * (sh + 6) + 6;
      strikes(c, P, s.strikes[i], typing ? 14 : W / 2 - 45, y);
      if (typing) {
        s.btns.push(Object.assign(G.pill(c, W - 14 - 84, y - 4, 84, 34, "Pass"), {
          k: "pass"
        }));
        inputBox(G, c, P, y + 36, "Type an answer");
        keys(G, c, P, kbH);
      } else {
        y += 42;
        c.fillStyle = ink;
        c.textAlign = "center";
        c.font = "600 15px ".concat(G.UI);
        c.fillText("".concat(s.found[i].length, " of ").concat(q.a.length, " answers \xB7 ").concat(qScore(s, i), " of 200 pts"), W / 2, y);
        y += 22;
        var last = i === s.qs.length - 1,
          bw = Math.min(240, W - 60);
        if (!s.done) s.btns.push(Object.assign(G.pill(c, W / 2 - bw / 2, y, bw, 48, "Next question", true), {
          k: "next"
        }));else if (s.posted) {
          var hw = (W - 40) / 2;
          s.btns.push(Object.assign(G.pill(c, 14, y, hw, 46, "‹ Previous", false, i === 0), {
            k: "prev"
          }));
          s.btns.push(Object.assign(G.pill(c, 26 + hw, y, hw, 46, "Next ›", false, last), {
            k: "next"
          }));
          s.btns.push(Object.assign(G.pill(c, W / 2 - bw / 2, y + 58, bw, 48, "See results", true), {
            k: "res"
          }));
        }
      }
    },
    tap: function tap(G, x, y) {
      var s = G.s,
        b = s.btns.find(function (b) {
          return x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h;
        });
      if (!b) return;
      if (b.k === "mode") {
        if (MODE !== b.m) {
          MODE = b.m;
          s.typed = "";
          s.msgT = 0;
          if (MODE === "host" && !HS) hLoad();
        }
        return;
      }
      if (MODE === "host") return this.hostTap(G, b);
      if (MODE === "tv") {
        if (b.key) this.tvPress(G, b.key);
        return;
      }
      if (b.k === "retry") {
        s.err = false;
        s.loading = true;
        return this.fetchCrew(G);
      }
      if (b.k === "res") return G.results(this.info(G));
      if (b.k === "prev") {
        if (s.qi > 0) s.qi--;
        return;
      }
      if (b.k === "next") {
        if (s.qi < s.qs.length - 1 && s.over[s.qi]) {
          s.qi++;
          if (!s.done) this.persist(G);
        }
        return;
      }
      if (b.k === "pass") return this.endQ(G, s.qi);
      if (b.key) return this.press(G, b.key);
    },
    onKey: function onKey(G, k, d) {
      if (!d) return;
      var tv = MODE === "tv",
        key = k === "Enter" ? ">" : k === "Backspace" ? "<" : k === " " ? " " : /^[a-z0-9]$/i.test(k) ? k.toUpperCase() : "";
      if (tv) {
        if (key) this.tvPress(G, key);
        return;
      }
      if (!key) return;
      if (MODE === "host") {
        if (HS && !HS.over && G.s.hide && G.s.kb) this.hPress(G, key);
      } else if (G.s.qs) this.press(G, key);
    },
    tvPress: function tvPress(G, k) {
      var _this2 = this;
      var s = G.s;
      if (k !== ">") return typeKey(s, k);
      var code = s.typed.replace(/[^A-Z]/g, "");
      s.typed = "";
      if (code.length !== 4) return this.say(G, "The code is 4 letters", 2.5);
      tone("sine", 30, 0.02, 0.0001);
      if (ac && ac.resume) ac.resume();
      this.say(G, "Connecting…", 20);
      API("feudWatch", code).then(function (v) {
        s.msgT = 0;
        tvOpen(code, v);
      })["catch"](function (e) {
        return _this2.say(G, /No game/.test(errMsg(e)) ? "No game with that code" : /Unknown call/.test(errMsg(e)) ? "Server is updating. Try again in a few minutes." : "Couldn't connect. Try again.", 4);
      });
    },
    hostNew: function hostNew(G, name, raw, code) {
      code = store.get(CODE) || code || "";
      if (code) store.set(CODE, code);
      fails = 0;
      hist = [];
      HS = {
        name: name,
        deck: newDeck(name, raw),
        code: code,
        day: KEY,
        qi: 0,
        pot: 0,
        score: [0, 0],
        over: false,
        tm: store.get(TM) || TEAMS.slice()
      };
      HD = HS.deck;
      if (name === "fm") {
        HS.over = true;
        HS.fm = newFm(0);
      }
      ["shown", "free"].forEach(function (k) {
        HS[k] = HD.map(function () {
          return [];
        });
      });
      HS.strikes = HD.map(function () {
        return 0;
      });
      HS.won = HD.map(function () {
        return -1;
      });
      HS.ctl = HD.map(function () {
        return -1;
      });
      HS.amt = HD.map(function () {
        return 0;
      });
      hSave();
      askCode();
    },
    hAward: function hAward(G, t) {
      var h = HS,
        i = h.qi;
      if (t < 2) h.score[t] += h.pot;
      h.amt[i] = h.pot;
      h.pot = 0;
      h.won[i] = t;
      if (t < 2) G.sfx("win");
    },
    hReveal: function hReveal(G, j) {
      var s = G.s,
        h = HS,
        i = h.qi,
        c = h.ctl[i];
      if (h.shown[i].includes(j)) return;
      if (h.won[i] >= 0) {
        snap();
        h.shown[i].push(j);
        h.free[i].push(j);
        s.flash = j;
        s.flashT = 0.7;
        h.nd = (h.nd || 0) + 1;
        ding();
        return hSave();
      }
      snap();
      s.timer = 0;
      h.tl = 0;
      h.shown[i].push(j);
      h.pot += HD[i].a[j].pts * mult(i);
      s.flash = j;
      s.flashT = 0.7;
      h.nd = (h.nd || 0) + 1;
      ding();
      if (c >= 0 && h.strikes[i] >= 3) this.hAward(G, 1 - c);else if (c >= 0 && h.shown[i].length === HD[i].a.length) this.hAward(G, c);
      hSave();
    },
    hStrike: function hStrike(G) {
      var s = G.s,
        h = HS,
        i = h.qi,
        c = h.ctl[i];
      if (h.won[i] >= 0) return;
      snap();
      s.timer = 0;
      s.upT = 0;
      h.tl = 0;
      if (c < 0) s.bigN = 1;else if (h.strikes[i] < 3) {
        h.strikes[i]++;
        s.bigN = h.strikes[i];
      } else {
        s.bigN = 1;
        this.hAward(G, c);
      }
      h.nx = (h.nx || 0) + 1;
      h.xn = s.bigN;
      s.bigX = 1.3;
      buzzer();
      G.buzz();
      hSave();
    },
    hEnter: function hEnter(G) {
      var s = G.s,
        h = HS,
        i = h.qi,
        n = norm(s.typed);
      if (n.length < 2) return;
      s.typed = "";
      var hits = match(HD[i], n),
        open = hits.filter(function (j) {
          return !h.shown[i].includes(j);
        });
      if (open.length > 1) return this.say(G, "Could be a couple. Be more specific.", 2.2);
      if (!open.length && hits.length) return this.say(G, "Already on the board");
      if (open.length) {
        this.say(G, open[0] === 0 ? "Number one answer!" : "Good answer!");
        return this.hReveal(G, open[0]);
      }
      this.say(G, "Not on the board");
      this.hStrike(G);
    },
    hPress: function hPress(G, k) {
      if (k === ">") return this.hEnter(G);
      typeKey(G.s, k);
    },
    hostTap: function hostTap(G, b) {
      var _this3 = this;
      var s = G.s,
        h = HS;
      if (b.k === "hpolls") return this.hostNew(G, "polls");
      if (b.k === "hfmonly") return this.hostNew(G, "fm");
      if (b.k === "hcrew" || b.k === "hmix") {
        if (s.hload) return;
        s.hload = true;
        s.hmsg = "";
        API("feudHost", me ? me.id : "", "crew").then(function (r) {
          s.hload = false;
          if (r.n < 3) s.hmsg = "Need at least 3 survey answers first.";else _this3.hostNew(G, b.k === "hmix" ? "mix" : "crew", r.answers, r.code);
        })["catch"](function (e) {
          s.hload = false;
          s.hmsg = /Unknown call/.test(errMsg(e)) ? "The server is still updating. Try again in a few minutes." : "Couldn't load the crew's answers. Check your connection.";
        });
        return;
      }
      if (!h) return;
      var quit = function quit() {
        HS = HD = null;
        hist = [];
        store.set(HK, null);
        s.quitT = 0;
        s.hmsg = "";
      };
      if (b.k === "hnew") return quit();
      if (b.k === "hquit") {
        if (s.quitT > 0) quit();else s.quitT = 3;
        return;
      }
      if (b.k === "hundo") {
        s.timer = 0;
        return undo();
      }
      if (b.k === "htime") {
        var dur = h.fm ? h.fm.p ? 25 : 20 : TSEC;
        if (s.timer > 0) {
          s.timer = 0;
          h.tl = 0;
        } else {
          s.timer = dur;
          s.upT = 0;
          h.tn = (h.tn || 0) + 1;
          h.tl = dur;
          tone("sine", 660, 0.12, 0.12);
        }
        return hSave();
      }
      if (b.k === "hfm" && h.over && !h.fm) {
        snap();
        h.fm = newFm(h.score[1] > h.score[0] ? 1 : 0);
        return hSave();
      }
      if (h.fm) return this.fmTap(G, b);
      if (h.over) return;
      var i = h.qi,
        q = HD[i];
      if (b.k === "hname") {
        var v = (prompt("Team name", h.tm[b.t]) || "").replace(/[<>]/g, "").replace(/\s+/g, " ").trim().slice(0, 12);
        if (v) {
          h.tm[b.t] = v;
          store.set(TM, h.tm);
          hSave();
        }
        return;
      }
      if (b.slot != null) return this.hReveal(G, b.slot);
      if (b.k === "hstrike") return this.hStrike(G);
      if (b.k === "hhide") {
        s.hide = !s.hide;
        s.kb = s.hide;
        s.typed = "";
        return;
      }
      if (b.k === "hkb") {
        s.kb = !s.kb;
        s.typed = "";
        return;
      }
      if (b.key) return this.hPress(G, b.key);
      if ((b.k === "hctl0" || b.k === "hctl1") && h.ctl[i] < 0 && h.won[i] < 0) {
        var t = b.k === "hctl0" ? 0 : 1;
        snap();
        h.ctl[i] = t;
        if (h.shown[i].length === q.a.length) this.hAward(G, t);
        return hSave();
      }
      if (b.k === "hswap" && h.won[i] >= 0 && h.won[i] < 2) {
        snap();
        var w = h.won[i];
        h.score[w] -= h.amt[i];
        h.score[1 - w] += h.amt[i];
        h.won[i] = 1 - w;
        return hSave();
      }
      if (b.k === "hrest" && h.won[i] >= 0) {
        var j = q.a.findIndex(function (a, j) {
          return !h.shown[i].includes(j);
        });
        if (j >= 0) this.hReveal(G, j);
        return;
      }
      if (b.k === "hskip" && h.won[i] < 0) {
        snap();
        s.timer = 0;
        h.tl = 0;
        h.pot = 0;
        this.hAward(G, 2);
        return hSave();
      }
      if (b.k === "hnext") {
        if (h.won[i] < 0) return;
        snap();
        s.timer = 0;
        h.tl = 0;
        if (i === HD.length - 1) {
          h.over = true;
          G.sfx("win");
        } else h.qi++;
        return hSave();
      }
    },
    tipClock: function tipClock(G, c, P, y, tip, dur) {
      var s = G.s,
        W = G.W,
        ink = P.ink,
        cw0 = 76,
        run = s.timer > 0,
        low = run && s.timer <= 5;
      rr(c, 12, y - 10, W - 24 - cw0 - 6, 32, 8);
      c.fillStyle = P.dk ? "#3a3320" : "#fbf1d0";
      c.fill();
      c.fillStyle = ink;
      c.textAlign = "center";
      fit(c, tip, W - 44 - cw0, 12.5, 600, G.UI);
      c.fillText(tip, 12 + (W - 30 - cw0) / 2, y + 7);
      rr(c, W - 12 - cw0, y - 10, cw0, 32, 16);
      c.fillStyle = low || s.upT > 0 ? "#d64545" : run ? "#1f3a8a" : P.bg;
      c.fill();
      if (!run && !(s.upT > 0)) {
        c.lineWidth = 1.5;
        c.strokeStyle = ink;
        c.stroke();
      }
      c.fillStyle = run || s.upT > 0 ? "#fff" : ink;
      c.font = "700 ".concat(run ? 17 : 14, "px ").concat(G.UI);
      c.fillText(run ? Math.ceil(s.timer) : s.upT > 0 ? "0" : "\u23F1 ".concat(dur, "s"), W - 12 - cw0 / 2, y + 7);
      s.btns.push({
        x: W - 18 - cw0,
        y: y - 16,
        w: cw0 + 12,
        h: 44,
        k: "htime"
      });
      return y + 32;
    },
    fmTap: function fmTap(G, b) {
      var s = G.s,
        h = HS,
        f = h.fm,
        p = f.p,
        i = f.ans[p].length;
      if (i < 5) {
        if (b.slot == null && b.k !== "fpass") return;
        var j = b.slot == null ? -1 : b.slot;
        if (p && j >= 0 && f.ans[0][i] === j) {
          buzzer();
          G.buzz();
          return this.say(G, "Already said! Need another answer.", 2.5);
        }
        snap();
        f.ans[p].push(j);
        if (i === 4) {
          s.timer = 0;
          s.upT = 0;
          h.tl = 0;
        }
        return hSave();
      }
      if (b.k === "frev" && f.rev[p] < 5) {
        snap();
        var _j2 = f.ans[p][f.rev[p]++];
        if (_j2 >= 0) {
          h.nd = (h.nd || 0) + 1;
          ding();
        } else {
          h.nx = (h.nx || 0) + 1;
          h.xn = 1;
          buzzer();
        }
        if (p && f.rev[1] === 5 && fmTot(f) >= FMT) G.sfx("win");
        return hSave();
      }
      if (b.k === "fp2" && !p && f.rev[0] === 5) {
        snap();
        f.p = 1;
        return hSave();
      }
      if (b.k === "ftop" && f.rev[1] === 5) {
        snap();
        f.top = !f.top;
        if (f.top) {
          h.nd = (h.nd || 0) + 1;
          ding();
        }
        return hSave();
      }
    },
    fmDraw: function fmDraw(G, c, P) {
      var s = G.s,
        W = G.W,
        H = G.H,
        h = HS,
        f = h.fm,
        ink = P.ink,
        mute = P.mute,
        tm = h.tm || TEAMS,
        p = f.p,
        i = f.ans[p].length,
        tot = fmTot(f),
        done = f.rev[1] === 5,
        T = TOP + 6;
      rr(c, 12, T, W - 24, 50, 10);
      c.fillStyle = "#1f3a8a";
      c.fill();
      c.textAlign = "left";
      c.fillStyle = "#e9b949";
      c.font = "700 12px ".concat(G.UI);
      c.fillText("FAST MONEY \xB7 ".concat(tm[f.team]), 24, T + 16);
      c.fillStyle = "#fff";
      c.font = "700 18px ".concat(G.UI);
      c.fillText(done ? tot >= FMT ? "They win! 🎉" : "So close!" : "Player ".concat(p + 1), 24, T + 37);
      c.textAlign = "right";
      c.fillStyle = "#e9b949";
      c.font = "700 24px ".concat(G.UI);
      c.fillText("".concat(tot, " / ").concat(FMT), W - 24, T + 27);
      var y = T + 68;
      c.font = "600 13px ".concat(G.UI);
      c.fillStyle = mute;
      c.textAlign = "left";
      c.fillText(h.code ? "TV code " + h.code : "", 14, y);
      c.textAlign = "right";
      c.fillStyle = s.quitT > 0 ? "#d64545" : mute;
      c.fillText(s.quitT > 0 ? "Tap again to end" : "End game", W - 14, y);
      s.btns.push({
        x: W - 140,
        y: y - 16,
        w: 140,
        h: 32,
        k: "hquit"
      });
      var uw = 96,
        bw2 = W - 24 - uw - 8,
        by = H - 62,
        undo = function undo() {
          return s.btns.push(Object.assign(G.pill(c, 12 + bw2 + 8, by + 3, uw, 46, "↩ Undo", false, !hist.length), {
            k: "hundo"
          }));
        };
      if (i < 5) {
        var q = f.qs[i],
          n = q.a.length;
        y = question(G, c, P, {
          q: "".concat(i + 1, " of 5 \xB7 ").concat(q.q),
          src: q.src
        }, y + 28);
        y = this.tipClock(G, c, P, y, s.upT > 0 ? "Time's up! No answer for the rest." : s.msgT > 0 && s.msg ? s.msg : s.timer > 0 ? "Tap what they say. Keep it moving!" : "Start the clock, then read question ".concat(i + 1, "."), p ? 25 : 20);
        var bot = by - 8,
          cols = (bot - y) / n >= 36 ? 1 : 2,
          rows = Math.ceil(n / cols),
          gap = 5,
          rh = Math.max(22, Math.min(46, (bot - y) / rows - gap)),
          cw = (W - 24 - (cols - 1) * 6) / cols;
        q.a.forEach(function (a, j) {
          var col = j < rows ? 0 : 1,
            x = 12 + col * (cw + 6),
            yy = y + (j - col * rows) * (rh + gap),
            mid = yy + rh / 2 + 1,
            dup = p === 1 && f.ans[0][i] === j;
          rr(c, x, yy, cw, rh, 8);
          c.fillStyle = dup ? P.dk ? "#2c2c2e" : "#ecece6" : P.bg;
          c.fill();
          if (!dup) {
            c.lineWidth = 1.5;
            c.strokeStyle = P.dk ? "#6d87d8" : "#1f3a8a";
            c.stroke();
          }
          var ps = dup ? "said" : String(a.pts);
          c.fillStyle = dup ? mute : ink;
          c.textAlign = "right";
          c.font = "700 ".concat(dup ? 12 : 15, "px ").concat(G.UI);
          c.fillText(ps, x + cw - 9, mid);
          var pwid = c.measureText(ps).width;
          c.textAlign = "left";
          fit(c, a.label, cw - 30 - pwid, 15, 700, G.UI);
          c.fillText(a.label, x + 10, mid);
          s.btns.push({
            x: x,
            y: yy,
            w: cw,
            h: rh,
            slot: j
          });
        });
        rr(c, 12, by, bw2, 52, 14);
        c.fillStyle = "#d64545";
        c.fill();
        c.fillStyle = "#fff";
        c.textAlign = "center";
        c.font = "700 16px ".concat(G.UI);
        c.fillText("✕  No answer / not up there", 12 + bw2 / 2, by + 27);
        s.btns.push({
          x: 12,
          y: by,
          w: bw2,
          h: 52,
          k: "fpass"
        });
        undo();
        return;
      }
      y += 16;
      var rv = f.rev[p];
      c.textAlign = "center";
      c.fillStyle = ink;
      c.font = "700 17px ".concat(G.UI);
      c.fillText(f.top ? "The number one answers" : done ? "Fast Money is over" : rv < 5 ? "Player ".concat(p + 1, ": reveal the answers") : "Cover the TV before player 2 comes in", W / 2, y + 6);
      y += 26;
      f.qs.forEach(function (q, k) {
        var j = f.top ? 0 : f.ans[p][k],
          on = f.top || k < rv,
          yy = y + k * 56,
          mid = yy + 18,
          t1 = "#1: ".concat(q.a[0].label, " \xB7 ").concat(q.a[0].pts);
        rr(c, 12, yy, W - 24, 50, 8);
        c.fillStyle = on ? j >= 0 ? "#e9b949" : P.dk ? "#2c2c2e" : "#ecece6" : P.dk ? "#27386b" : "#1f3a8a";
        c.fill();
        c.fillStyle = on ? j >= 0 ? "#2b1a10" : mute : "#fff";
        c.textAlign = "right";
        c.font = "700 16px ".concat(G.UI);
        c.fillText(on ? j >= 0 ? q.a[j].pts : 0 : "?", W - 24, mid);
        c.textAlign = "left";
        fit(c, "".concat(k + 1, ". ").concat(j >= 0 ? q.a[j].label : "✕ no answer"), W - 90, 15, 700, G.UI);
        c.fillText("".concat(k + 1, ". ").concat(j >= 0 ? q.a[j].label : "✕ no answer"), 24, mid);
        if (!f.top) {
          c.fillStyle = on ? j >= 0 ? "rgba(43,26,16,.75)" : mute : "rgba(255,255,255,.75)";
          fit(c, t1, W - 60, 12, 600, G.UI);
          c.fillText(t1, 38, yy + 38);
        }
      });
      if (done) {
        s.btns.push(Object.assign(G.pill(c, 12, by - 58, W - 24, 50, f.top ? "‹ Back to their answers" : "Show the #1 answers on TV ›", !f.top), {
          k: "ftop"
        }));
        s.btns.push(Object.assign(G.pill(c, 12, by + 3, bw2, 46, "New game", f.top), {
          k: "hnew"
        }));
      } else if (rv < 5) s.btns.push(Object.assign(G.pill(c, 12, by, bw2, 52, "Reveal next ›", true), {
        k: "frev"
      }));else s.btns.push(Object.assign(G.pill(c, 12, by, bw2, 52, "Cover answers · Player 2 ›", true), {
        k: "fp2"
      }));
      undo();
    },
    hostDraw: function hostDraw(G, c, P) {
      var s = G.s,
        W = G.W,
        H = G.H,
        h = HS,
        ink = P.ink,
        mute = P.mute;
      var lines = function lines(t, y, font, col) {
        c.font = font;
        c.fillStyle = col;
        c.textAlign = "center";
        wrap(c, t, W - 48).forEach(function (l) {
          c.fillText(l, W / 2, y);
          y += 21;
        });
        return y;
      };
      var bw = Math.min(280, W - 60),
        bx = W / 2 - bw / 2;
      if (!h) {
        lines("Host a game", TOP + 44, "700 24px ".concat(G.TITLE), ink);
        var _y2 = lines("Two teams, five rounds. Your phone shows every answer: read the question out loud, tap an answer when someone says it, hit Strike on a miss, then give the pot to the team that won the round. Every board adds up to 100, and each new game uses surveys you haven't played yet.", TOP + 80, "500 14.5px ".concat(G.UI), mute) + 14;
        s.btns.push(Object.assign(G.pill(c, bx, _y2, bw, 50, "Party mix · polls + crew", true, s.hload), {
          k: "hmix"
        }));
        s.btns.push(Object.assign(G.pill(c, bx, _y2 + 60, bw, 46, "America's polls only", false, s.hload), {
          k: "hpolls"
        }));
        s.btns.push(Object.assign(G.pill(c, bx, _y2 + 114, bw, 46, "Crew answers only", false, s.hload), {
          k: "hcrew"
        }));
        s.btns.push(Object.assign(G.pill(c, bx, _y2 + 168, bw, 46, "Fast Money only", false, s.hload), {
          k: "hfmonly"
        }));
        if (s.hload || s.hmsg) lines(s.hload ? "Loading the crew's answers…" : s.hmsg, _y2 + 240, "600 14px ".concat(G.UI), ink);
        return;
      }
      var tm = h.tm || TEAMS;
      if (h.fm) return this.fmDraw(G, c, P);
      if (h.over) {
        var _h$score = _slicedToArray(h.score, 2),
          a = _h$score[0],
          b = _h$score[1];
        lines(a === b ? "It's a tie!" : "".concat(tm[a > b ? 0 : 1], " wins! \uD83E\uDD83"), TOP + 60, "700 26px ".concat(G.TITLE), ink);
        lines("".concat(tm[0], " ").concat(a, "  \xB7  ").concat(tm[1], " ").concat(b), TOP + 100, "600 16px ".concat(G.UI), mute);
        s.btns.push(Object.assign(G.pill(c, bx, TOP + 134, bw, 54, "Fast Money ›", true), {
          k: "hfm"
        }));
        s.btns.push(Object.assign(G.pill(c, bx, TOP + 198, bw, 46, "New game"), {
          k: "hnew"
        }));
        s.btns.push(Object.assign(G.pill(c, bx, TOP + 254, bw, 44, "↩ Undo", false, !hist.length), {
          k: "hundo"
        }));
        return;
      }
      var i = h.qi,
        q = HD[i],
        m = mult(i),
        won = h.won[i],
        st = h.strikes[i],
        n = q.a.length,
        left = n - h.shown[i].length,
        last = i === HD.length - 1,
        T = TOP + 6;
      var ctl = h.ctl[i],
        steal = won < 0 && ctl >= 0 && st >= 3,
        turn = won >= 0 || ctl < 0 ? -1 : steal ? 1 - ctl : ctl,
        pickT = won < 0 && ctl < 0 && h.shown[i].length > 0;
      var kb = !!(s.hide && s.kb && won < 0 && left),
        kbH = kb ? Math.min(214, H * 0.34) : 0;
      var pw = 88,
        tw = (W - 24 - pw - 12) / 2;
      [0, 1].forEach(function (t) {
        var x = t ? W - 12 - tw : 12,
          on = turn === t,
          lab = on ? (steal ? "STEAL · " : "▶ ") + tm[t] : tm[t] + " ✎";
        rr(c, x, T, tw, 50, 10);
        c.fillStyle = P.dk ? "#2c2c2e" : "#ecece6";
        c.fill();
        if (on) {
          c.lineWidth = 3;
          c.strokeStyle = steal ? "#d64545" : "#e9b949";
          c.stroke();
        }
        c.textAlign = "center";
        c.fillStyle = on ? ink : mute;
        fit(c, lab, tw - 12, 11.5, on ? 700 : 600, G.UI);
        c.fillText(lab, x + tw / 2, T + 15);
        c.fillStyle = ink;
        c.font = "700 22px ".concat(G.UI);
        c.fillText(h.score[t], x + tw / 2, T + 35);
        s.btns.push({
          x: x,
          y: T,
          w: tw,
          h: 50,
          k: "hname",
          t: t
        });
      });
      rr(c, W / 2 - pw / 2, T, pw, 50, 10);
      c.fillStyle = "#1f3a8a";
      c.fill();
      c.fillStyle = "#e9b949";
      c.font = "700 11.5px ".concat(G.UI);
      c.fillText("POT", W / 2, T + 15);
      c.font = "700 22px ".concat(G.UI);
      c.fillText(h.pot, W / 2, T + 35);
      var y = T + 68;
      c.font = "600 13px ".concat(G.UI);
      c.fillStyle = mute;
      c.textAlign = "left";
      c.fillText("Round ".concat(i + 1, " of ").concat(HD.length).concat(m > 1 ? m === 2 ? " · DOUBLE" : " · TRIPLE" : "").concat(h.code ? " · TV code " + h.code : ""), 14, y);
      c.textAlign = "right";
      c.fillStyle = s.quitT > 0 ? "#d64545" : mute;
      c.fillText(s.quitT > 0 ? "Tap again to end" : "End game", W - 14, y);
      s.btns.push({
        x: W - 140,
        y: y - 16,
        w: 140,
        h: 32,
        k: "hquit"
      });
      y = question(G, c, P, q, y + 28);
      var tip = won === 2 ? left ? "No points. Reveal the rest, one at a time." : "No points this round. Tap Next." : won >= 0 && left ? "".concat(tm[won], " wins ").concat(h.amt[i], "! Reveal the rest, one at a time.") : won >= 0 ? "".concat(tm[won], " wins ").concat(h.amt[i], "! Tap ").concat(last ? "Final score" : "Next round", ".") : s.upT > 0 ? "Time's up! Hit Strike." : steal ? "".concat(tm[1 - ctl], " can STEAL: one answer!") : pickT ? "Who won the face-off? Pick the team." : ctl < 0 ? kb ? "Face-off! Type what they say." : s.hide ? "Hidden. Tap Type to enter a guess." : "Face-off! Tap the answer they say." : kb ? "".concat(tm[ctl], " playing. Type what they say.") : "".concat(tm[ctl], " playing. Tap answers or Strike.");
      y = this.tipClock(G, c, P, y, tip, TSEC);
      var bot = kb ? H - kbH - 116 : won >= 0 ? H - 118 : pickT ? H - 170 : H - 118,
        cols = (bot - y) / n >= 36 ? 1 : 2,
        rows = Math.ceil(n / cols),
        gap = 5,
        rh = Math.max(22, Math.min(46, (bot - y) / rows - gap)),
        cw = (W - 24 - (cols - 1) * 6) / cols;
      q.a.forEach(function (a, j) {
        var col = j < rows ? 0 : 1,
          x = 12 + col * (cw + 6),
          yy = y + (j - col * rows) * (rh + gap),
          mid = yy + rh / 2 + 1,
          on = h.shown[i].includes(j),
          free = on && h.free[i].includes(j);
        rr(c, x, yy, cw, rh, 8);
        c.fillStyle = free ? P.dk ? "#2c2c2e" : "#ecece6" : on ? s.flash === j && s.flashT > 0 ? "#f8e3a1" : "#e9b949" : s.hide ? P.dk ? "#27386b" : "#1f3a8a" : P.bg;
        c.fill();
        if (!on && !s.hide) {
          c.lineWidth = 1.5;
          c.strokeStyle = P.dk ? "#6d87d8" : "#1f3a8a";
          c.stroke();
        }
        if (!on && s.hide) {
          c.fillStyle = "#fff";
          c.textAlign = "center";
          c.font = "700 ".concat(Math.min(16, rh * 0.5), "px ").concat(G.UI);
          c.fillText(j + 1, x + cw / 2, mid);
          return;
        }
        var col2 = free ? mute : on ? "#2b1a10" : ink,
          ps = (on && !free ? "✓ " : "") + a.pts;
        c.fillStyle = on ? col2 : mute;
        c.textAlign = "left";
        c.font = "700 12px ".concat(G.UI);
        c.fillText(j + 1, x + 9, mid);
        c.fillStyle = col2;
        c.textAlign = "right";
        c.font = "700 15px ".concat(G.UI);
        c.fillText(ps, x + cw - 9, mid);
        var pwid = c.measureText(ps).width;
        c.textAlign = "left";
        fit(c, a.label, cw - 44 - pwid, 15, 700, G.UI);
        c.fillText(a.label, x + 26, mid);
        if (!on) s.btns.push({
          x: x,
          y: yy,
          w: cw,
          h: rh,
          slot: j
        });
      });
      if (s.bigX > 0) {
        var k2 = s.bigN || 1,
          z = Math.min(84, (W - 60) / 3),
          bh = rows * (rh + gap),
          x0 = W / 2 - (k2 * z + (k2 - 1) * 10) / 2;
        c.save();
        c.globalAlpha = Math.min(1, s.bigX * 3);
        for (var k = 0; k < k2; k++) {
          var x = x0 + k * (z + 10),
            yy = y + bh / 2 - z / 2;
          rr(c, x, yy, z, z, 12);
          c.fillStyle = P.bg;
          c.fill();
          c.lineWidth = 6;
          c.strokeStyle = "#d64545";
          c.stroke();
          c.fillStyle = "#d64545";
          c.textAlign = "center";
          c.font = "700 ".concat(z * 0.72, "px ").concat(G.UI);
          c.fillText("✕", x + z / 2, yy + z / 2 + 3);
        }
        c.restore();
      }
      var strike = function strike(x, yy, w) {
        var lab = ctl < 0 ? "✕  WRONG (no strike)" : steal ? "✕  STEAL MISSED" : "\u2715 STRIKE  ".concat("●".repeat(st)).concat("○".repeat(3 - st));
        rr(c, x, yy, w, 52, 14);
        c.fillStyle = "#d64545";
        c.fill();
        c.fillStyle = "#fff";
        c.textAlign = "center";
        fit(c, lab, w - 16, w < 200 ? 15 : 18, 700, G.UI);
        c.fillText(lab, x + w / 2, yy + 27);
        s.btns.push({
          x: x,
          y: yy,
          w: w,
          h: 52,
          k: "hstrike"
        });
      };
      var hw = (W - 36) / 2,
        teams = function teams(yy) {
          return [0, 1].forEach(function (t) {
            var lab = "".concat(tm[t], " plays"),
              x = 12 + t * (hw + 12);
            rr(c, x, yy, hw, 52, 14);
            c.fillStyle = "#e9b949";
            c.fill();
            c.fillStyle = "#2b1a10";
            c.textAlign = "center";
            fit(c, lab, hw - 14, 16, 700, G.UI);
            c.fillText(lab, x + hw / 2, yy + 27);
            s.btns.push({
              x: x,
              y: yy,
              w: hw,
              h: 52,
              k: "hctl" + t
            });
          });
        };
      if (kb) {
        var y2 = bot + 6,
          pw2 = 78,
          sw2 = W - 24 - 2 * (pw2 + 6);
        if (pickT) teams(y2);else {
          strike(12, y2, sw2);
          s.btns.push(Object.assign(G.pill(c, 18 + sw2, y2 + 3, pw2, 46, "↩ Undo", false, !hist.length), {
            k: "hundo"
          }));
          s.btns.push(Object.assign(G.pill(c, 24 + sw2 + pw2, y2 + 3, pw2, 46, "Keys ✕", false), {
            k: "hkb"
          }));
        }
        inputBox(G, c, P, y2 + 60, "Type what they said");
        keys(G, c, P, kbH);
        return;
      }
      var uw = 96,
        sw = W - 24 - uw - 8;
      var by = H - 112;
      if (pickT) {
        teams(by - 60);
      }
      if (won >= 0 && left) s.btns.push(Object.assign(G.pill(c, 12, by, sw, 52, "Reveal next \xB7 ".concat(left, " left"), true), {
        k: "hrest"
      }));else if (won >= 0) s.btns.push(Object.assign(G.pill(c, 12, by, sw, 52, last ? "Final score ›" : "Next round ›", true), {
        k: "hnext"
      }));else strike(12, by, sw);
      s.btns.push(Object.assign(G.pill(c, 12 + sw + 8, by + 3, uw, 46, "↩ Undo", false, !hist.length), {
        k: "hundo"
      }));
      by += 62;
      var row = [[s.hide ? "👀 Show" : "🙈 Hide", "hhide", s.hide, false]];
      if (s.hide && won < 0) row.push(["⌨ Type", "hkb", false, !left]);
      row.push(won >= 0 ? ["⇄ Other team", "hswap", false, won === 2] : ["Skip round ›", "hskip", false, false]);
      if (won >= 0 && left) row.push([last ? "Final ›" : "Skip ›", "hnext", false, false]);
      var wn = (W - 24 - 8 * (row.length - 1)) / row.length;
      row.forEach(function (r, k) {
        return s.btns.push(Object.assign(G.pill(c, 12 + k * (wn + 8), by, wn, 40, r[0], r[2], r[3]), {
          k: r[1]
        }));
      });
    },
    _t: {
      norm: norm,
      match: match,
      alike: alike,
      crewBoard: crewBoard,
      DAYS: DAYS,
      SPARE: SPARE,
      MORE: MORE,
      to100: to100,
      newDeck: newDeck,
      scoreOf: scoreOf,
      host: function host() {
        return HS;
      },
      deck: function deck() {
        return HD;
      },
      mode: function mode(m) {
        MODE = m;
      },
      view: view,
      tvOpen: tvOpen,
      tvRender: tvRender
    }
  });
})();