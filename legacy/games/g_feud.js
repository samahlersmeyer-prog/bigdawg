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
  defGame({
    key: "feud",
    name: "Feud",
    icon: "🦃",
    max: 1000,
    cat: "den",
    puzzle: true,
    blurb: "Survey says! Through Sunday.",
    how: "Five survey questions a day. Type an answer you think is on the board and hit Enter. Get it right and it flips over with its points. Miss and it's a strike, and three strikes ends the question (or tap Pass to move on). Thursday to Saturday use real polls, so you're guessing what America said, and the source is under each question. Sunday is the Crew Edition, built from the crew's own survey answers. Each question is worth up to 200: your share of the points on its board. Here through Sunday only.",
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
      if (k === "<") {
        s.typed = s.typed.slice(0, -1);
        return;
      }
      if (k === " ") {
        if (s.typed && !/ $/.test(s.typed) && s.typed.length < 26) s.typed += " ";
        return;
      }
      if (s.typed.length < 26) s.typed += k;
    },
    update: function update(G, dt) {
      var s = G.s;
      if (!s.qs) return;
      s.t += dt;
      if (!s.done) {
        s.el += dt;
        s.ck = (s.ck || 0) + dt;
        if (s.ck > 2) {
          s.ck = 0;
          this.persist(G);
        }
      }
      if (s.msgT > 0) s.msgT -= dt;
      if (s.shake > 0) s.shake -= dt;
      if (s.flashT > 0) s.flashT -= dt;
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
        bg = dk ? "#121213" : "#fff",
        mute = dk ? "#a3a3a8" : "#66666b",
        line = dk ? "#3a3a3c" : "#d3d6da",
        W = G.W,
        H = G.H;
      s.btns = [];
      c.fillStyle = bg;
      c.fillRect(0, 0, W, H);
      c.textBaseline = "middle";
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
      c.fillText("".concat(s.crew ? "Crew Edition" : "Survey says", " \xB7 ").concat(i + 1, " of ").concat(s.qs.length), 14, 16);
      c.textAlign = "right";
      c.fillText("".concat(scoreOf(s), " pts"), W - 14, 16);
      var qf = H < 560 ? 17 : 19;
      c.font = "700 ".concat(qf, "px ").concat(G.TITLE);
      c.fillStyle = ink;
      c.textAlign = "center";
      var y = 44;
      wrap(c, q.q, W - 32).slice(0, 3).forEach(function (l) {
        c.fillText(l, W / 2, y);
        y += qf + 4;
      });
      fit(c, q.src, W - 28, 11.5, 500, G.UI);
      c.fillStyle = mute;
      c.fillText(q.src, W / 2, y);
      y += 16;
      var kbH = typing ? Math.min(214, H * 0.34) : 0,
        rows = Math.ceil(q.a.length / 2),
        gap = 6;
      var sh = Math.max(26, Math.min(44, (H - y - kbH - 100) / rows - gap)),
        cw = (W - 24 - gap) / 2;
      q.a.forEach(function (a, j) {
        var col = j < rows ? 0 : 1,
          x = 12 + col * (cw + gap),
          yy = y + (j - col * rows) * (sh + gap);
        var hit = s.found[i].includes(j),
          shown = hit || over;
        rr(c, x, yy, cw, sh, 8);
        c.fillStyle = hit ? s.flash === j && s.flashT > 0 ? "#f8e3a1" : "#e9b949" : shown ? dk ? "#2c2c2e" : "#ecece6" : dk ? "#27386b" : "#1f3a8a";
        c.fill();
        if (shown) {
          var fg = hit ? "#2b1a10" : mute,
            pw = 30;
          c.fillStyle = fg;
          c.textAlign = "left";
          fit(c, a.label, cw - pw - 16, 14, 700, G.UI);
          c.fillText(a.label, x + 9, yy + sh / 2 + 1);
          c.textAlign = "right";
          c.font = "700 14px ".concat(G.UI);
          c.fillText(a.pts, x + cw - 9, yy + sh / 2 + 1);
        } else {
          c.fillStyle = "#fff";
          c.textAlign = "center";
          c.font = "700 ".concat(Math.min(16, sh * 0.5), "px ").concat(G.UI);
          c.fillText(j + 1, x + cw / 2, yy + sh / 2 + 1);
        }
      });
      y += rows * (sh + gap) + 6;
      var sq = 26,
        sx = typing ? 14 : W / 2 - (3 * sq + 12) / 2;
      for (var k = 0; k < 3; k++) {
        var x = sx + k * (sq + 6),
          used = k < s.strikes[i];
        rr(c, x, y, sq, sq, 6);
        if (used) {
          c.fillStyle = "#d64545";
          c.fill();
        } else {
          c.lineWidth = 1.5;
          c.strokeStyle = line;
          c.stroke();
        }
        c.fillStyle = used ? "#fff" : line;
        c.textAlign = "center";
        c.font = "700 15px ".concat(G.UI);
        c.fillText("✕", x + sq / 2, y + sq / 2 + 1);
      }
      if (typing) {
        s.btns.push(Object.assign(G.pill(c, W - 14 - 84, y - 4, 84, 34, "Pass"), {
          k: "pass"
        }));
        y += sq + 10;
        var bx = 14 + (s.shake > 0 ? Math.sin(s.shake * 60) * 5 : 0),
          bw = W - 28,
          bh = 42;
        rr(c, bx, y, bw, bh, 8);
        c.lineWidth = 2;
        c.strokeStyle = s.typed ? ink : line;
        c.stroke();
        c.textAlign = "left";
        c.font = "700 17px ".concat(G.UI);
        if (s.typed) {
          c.fillStyle = ink;
          c.fillText(s.typed, bx + 12, y + bh / 2 + 1);
        } else {
          var m = s.msgT > 0 && s.msg;
          c.fillStyle = m ? ink : mute;
          c.font = "".concat(m ? 600 : 500, " 15px ").concat(G.UI);
          c.fillText(m || "Type an answer", bx + 12, y + bh / 2 + 1);
        }
        if (s.t % 1 < 0.55 && (s.typed || !(s.msgT > 0))) {
          var tw = s.typed ? (c.font = "700 17px ".concat(G.UI), c.measureText(s.typed).width) : 0;
          c.fillStyle = ink;
          c.fillRect(bx + 13 + tw, y + 10, 2, bh - 20);
        }
        var ky = H - kbH,
          kh = (kbH - 12) / 4 - 6,
          kw = (W - 12) / 10 - 5;
        KB.forEach(function (row, r) {
          var keys = row.split(""),
            wide = function wide(k) {
              return k === " " ? kw * 5 + 20 : k === "<" || k === ">" ? kw * 1.5 + 2.5 : kw;
            };
          var tw = keys.reduce(function (a, k) {
            return a + wide(k) + 5;
          }, -5);
          var x = (W - tw) / 2;
          keys.forEach(function (k) {
            var w = wide(k),
              yy = ky + 6 + r * (kh + 6);
            rr(c, x, yy, w, kh, 5);
            c.fillStyle = dk ? "#818384" : "#d3d6da";
            c.fill();
            c.fillStyle = ink;
            c.font = "700 ".concat(k === "<" || k === ">" || k === " " ? 13 : 16, "px ").concat(G.UI);
            c.textAlign = "center";
            c.fillText(k === "<" ? "⌫" : k === ">" ? "ENTER" : k === " " ? "space" : k, x + w / 2, yy + kh / 2 + 1);
            s.btns.push({
              x: x,
              y: yy,
              w: w,
              h: kh,
              key: k
            });
            x += w + 5;
          });
        });
      } else {
        y += sq + 16;
        c.fillStyle = ink;
        c.textAlign = "center";
        c.font = "600 15px ".concat(G.UI);
        c.fillText("".concat(s.found[i].length, " of ").concat(q.a.length, " answers \xB7 ").concat(qScore(s, i), " of 200 pts"), W / 2, y);
        y += 22;
        var last = i === s.qs.length - 1,
          _bw = Math.min(240, W - 60);
        if (!s.done) s.btns.push(Object.assign(G.pill(c, W / 2 - _bw / 2, y, _bw, 48, "Next question", true), {
          k: "next"
        }));else if (s.posted) {
          var hw = (W - 40) / 2;
          s.btns.push(Object.assign(G.pill(c, 14, y, hw, 46, "‹ Previous", false, i === 0), {
            k: "prev"
          }));
          s.btns.push(Object.assign(G.pill(c, 26 + hw, y, hw, 46, "Next ›", false, last), {
            k: "next"
          }));
          s.btns.push(Object.assign(G.pill(c, W / 2 - _bw / 2, y + 58, _bw, 48, "See results", true), {
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
      if (!d || !G.s.qs) return;
      if (k === "Enter") this.press(G, ">");else if (k === "Backspace") this.press(G, "<");else if (k === " ") this.press(G, " ");else if (/^[a-z0-9]$/i.test(k)) this.press(G, k.toUpperCase());
    },
    _t: {
      norm: norm,
      match: match,
      alike: alike,
      crewBoard: crewBoard,
      DAYS: DAYS,
      SPARE: SPARE,
      scoreOf: scoreOf
    }
  });
})();