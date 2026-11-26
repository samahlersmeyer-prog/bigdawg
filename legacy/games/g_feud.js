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
    TEAMS = ["Team Turkey", "Team Gravy"];
  var MODE = "solo",
    HS = null,
    HD = null;
  var deckOf = function deckOf(h) {
    var _ref3;
    if (h.name === "polls") return (_ref3 = []).concat.apply(_ref3, _toConsumableArray(Object.keys(DAYS).filter(function (d) {
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
    HD = HS ? deckOf(HS) : null;
    if (HS) {
      askCode();
      hPush();
    }
  };
  var hSave = function hSave() {
    store.set(HK, HS);
    hPush();
  };
  var mult = function mult(i) {
    return i === HD.length - 1 ? 3 : i === HD.length - 2 ? 2 : 1;
  };
  var view = function view() {
    var h = HS,
      i = h.qi,
      q = HD[i];
    return {
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
      tm: TEAMS,
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
      if (HS === h && r && r.code) {
        h.code = r.code;
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
      x: mk("ftv-x"),
      win: mk("ftv-win")
    };
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
    T.n0.textContent = v.tm[0];
    T.n1.textContent = v.tm[1];
    T.s0.textContent = v.sc[0];
    T.s1.textContent = v.sc[1];
    T.pot.textContent = v.pot;
    T.rd.textContent = "ROUND ".concat(v.r, " OF ").concat(v.of) + (v.m > 1 ? v.m === 2 ? " · DOUBLE" : " · TRIPLE" : "");
    var key = v.r + "|" + v.q;
    if (key !== T.key) {
      T.key = key;
      T.q.textContent = v.q;
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
    if (L && v.won >= 0 && L.won < 0 && L.r === v.r && typeof chime === "function") chime("win");
    T.win.textContent = v.over ? v.sc[0] === v.sc[1] ? "It's a tie!" : "".concat(v.tm[v.sc[0] > v.sc[1] ? 0 : 1], " wins! \uD83E\uDD83") : "";
    T.win.classList.toggle("go", !!v.over);
    if (v.over && L && !L.over && typeof celebrate === "function") celebrate();
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
      var host = MODE === "host",
        tv = MODE === "tv",
        key = k === "Enter" ? ">" : k === "Backspace" ? "<" : k === " " ? " " : /^[a-z0-9]$/i.test(k) ? k.toUpperCase() : "";
      if (tv) {
        if (key) this.tvPress(G, key);
        return;
      }
      if (!key || (host ? !HS || HS.over : !G.s.qs)) return;
      if (host) {
        G.s.hkb = true;
        this.hPress(G, key);
      } else this.press(G, key);
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
      HS = {
        name: name,
        raw: raw || null,
        code: code,
        day: KEY,
        qi: 0,
        pot: 0,
        score: [0, 0],
        over: false
      };
      HD = deckOf(HS);
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
      G.s.peek = false;
      G.s.hkb = false;
      hSave();
      askCode();
    },
    hReveal: function hReveal(G, j) {
      var s = G.s,
        h = HS,
        i = h.qi;
      if (h.shown[i].includes(j)) return;
      h.shown[i].push(j);
      if (h.won[i] < 0) h.pot += HD[i].a[j].pts * mult(i);
      s.flash = j;
      s.flashT = 0.7;
      h.nd = (h.nd || 0) + 1;
      ding();
      hSave();
    },
    hStrike: function hStrike(G) {
      var s = G.s,
        h = HS,
        i = h.qi;
      if (h.strikes[i] < 3) {
        h.strikes[i]++;
        s.bigN = h.strikes[i];
      } else s.bigN = 1;
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
        store.set(HK, null);
        s.quitT = 0;
        s.hmsg = "";
      };
      if (b.k === "hnew") return quit();
      if (b.k === "hquit") {
        if (s.quitT > 0) quit();else s.quitT = 3;
        return;
      }
      var i = h.qi,
        q = HD[i];
      if (b.slot != null) return this.hReveal(G, b.slot);
      if (b.k === "hstrike") return this.hStrike(G);
      if (b.k === "hpeek") {
        s.peek = !s.peek;
        return;
      }
      if (b.k === "hkb") {
        s.hkb = !s.hkb;
        s.typed = "";
        return;
      }
      if (b.k === "hwin0" || b.k === "hwin1") {
        if (h.won[i] >= 0 || !h.pot) return;
        var t = b.k === "hwin0" ? 0 : 1;
        h.score[t] += h.pot;
        h.pot = 0;
        h.won[i] = t;
        G.sfx("win");
        return hSave();
      }
      if (b.k === "hall") {
        q.a.forEach(function (a, j) {
          if (!h.shown[i].includes(j)) {
            h.shown[i].push(j);
            h.free[i].push(j);
          }
        });
        return hSave();
      }
      if (b.k === "hnext") {
        if (h.won[i] < 0 && h.pot) return;
        s.peek = false;
        s.typed = "";
        if (i === HD.length - 1) {
          h.over = true;
          G.sfx("win");
        } else h.qi++;
        return hSave();
      }
      if (b.key) return this.hPress(G, b.key);
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
        var _y2 = lines("Two teams. Read the question out loud, flip answers as they're guessed, hit Strike on a miss, then give the pot to the team that won the round. Party mix is America's polls with the crew's own answers mixed in.", TOP + 80, "500 14.5px ".concat(G.UI), mute) + 14;
        s.btns.push(Object.assign(G.pill(c, bx, _y2, bw, 50, "Party mix · 5 rounds", true, s.hload), {
          k: "hmix"
        }));
        s.btns.push(Object.assign(G.pill(c, bx, _y2 + 60, bw, 46, "Crew answers only", false, s.hload), {
          k: "hcrew"
        }));
        s.btns.push(Object.assign(G.pill(c, bx, _y2 + 114, bw, 46, "America's polls only", false, s.hload), {
          k: "hpolls"
        }));
        if (s.hload || s.hmsg) lines(s.hload ? "Loading the crew's answers…" : s.hmsg, _y2 + 190, "600 14px ".concat(G.UI), ink);
        return;
      }
      if (h.over) {
        var _h$score = _slicedToArray(h.score, 2),
          a = _h$score[0],
          b = _h$score[1];
        lines(a === b ? "It's a tie!" : "".concat(TEAMS[a > b ? 0 : 1], " wins! \uD83E\uDD83"), TOP + 60, "700 26px ".concat(G.TITLE), ink);
        lines("".concat(TEAMS[0], " ").concat(a, "  \xB7  ").concat(TEAMS[1], " ").concat(b), TOP + 100, "600 16px ".concat(G.UI), mute);
        s.btns.push(Object.assign(G.pill(c, bx, TOP + 134, bw, 50, "New game", true), {
          k: "hnew"
        }));
        return;
      }
      var i = h.qi,
        q = HD[i],
        m = mult(i),
        won = h.won[i],
        kb = s.hkb,
        T = TOP + 6;
      var pw = 88,
        tw = (W - 24 - pw - 12) / 2;
      [0, 1].forEach(function (t) {
        var x = t ? W - 12 - tw : 12;
        rr(c, x, T, tw, 50, 10);
        c.fillStyle = P.dk ? "#2c2c2e" : "#ecece6";
        c.fill();
        c.textAlign = "center";
        c.fillStyle = mute;
        c.font = "600 11.5px ".concat(G.UI);
        c.fillText(TEAMS[t], x + tw / 2, T + 15);
        c.fillStyle = ink;
        c.font = "700 22px ".concat(G.UI);
        c.fillText(h.score[t], x + tw / 2, T + 35);
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
      var kbH = kb ? Math.min(214, H * 0.34) : 0,
        rows = Math.ceil(q.a.length / 2);
      var sh = Math.max(26, Math.min(44, (H - y - kbH - (kb ? 96 : 160)) / rows - 6));
      var slots = board(G, c, P, q, y, sh, function (j) {
        return h.shown[i].includes(j) ? h.free[i].includes(j) ? 2 : 1 : s.peek ? 3 : 0;
      });
      if (s.peek) slots.forEach(function (b) {
        return s.btns.push(b);
      });
      if (s.bigX > 0) {
        var n = s.bigN || 1,
          z = Math.min(84, (W - 60) / 3),
          bh = rows * (sh + 6),
          x0 = W / 2 - (n * z + (n - 1) * 10) / 2;
        c.save();
        c.globalAlpha = Math.min(1, s.bigX * 3);
        for (var k = 0; k < n; k++) {
          var _x = x0 + k * (z + 10),
            yy = y + bh / 2 - z / 2;
          rr(c, _x, yy, z, z, 12);
          c.fillStyle = P.bg;
          c.fill();
          c.lineWidth = 6;
          c.strokeStyle = "#d64545";
          c.stroke();
          c.fillStyle = "#d64545";
          c.textAlign = "center";
          c.font = "700 ".concat(z * 0.72, "px ").concat(G.UI);
          c.fillText("✕", _x + z / 2, yy + z / 2 + 3);
        }
        c.restore();
      }
      y += rows * (sh + 6) + 6;
      strikes(c, P, h.strikes[i], 14, y);
      var aw = W - 28 - 104,
        w1 = aw * 0.4,
        w2 = (aw - w1 - 12) / 2;
      var x = 14 + 104;
      s.btns.push(Object.assign(G.pill(c, x, y - 4, w1, 34, "Strike"), {
        k: "hstrike"
      }));
      x += w1 + 6;
      s.btns.push(Object.assign(G.pill(c, x, y - 4, w2, 34, "Peek", s.peek), {
        k: "hpeek"
      }));
      x += w2 + 6;
      s.btns.push(Object.assign(G.pill(c, x, y - 4, w2, 34, "Keys", kb), {
        k: "hkb"
      }));
      if (kb) {
        inputBox(G, c, P, y + 36, "Type what they said");
        keys(G, c, P, kbH);
        return;
      }
      y += 42;
      var hw = (W - 36) / 2,
        last = i === HD.length - 1;
      if (won < 0) [0, 1].forEach(function (t) {
        return s.btns.push(Object.assign(G.pill(c, 12 + t * (hw + 12), y, hw, 46, "Pot \u2192 ".concat(TEAMS[t].slice(5)), true, !h.pot), {
          k: "hwin" + t
        }));
      });else lines("".concat(TEAMS[won], " banked it"), y + 23, "600 15px ".concat(G.UI), ink);
      y += 56;
      s.btns.push(Object.assign(G.pill(c, 12, y, hw, 46, "Reveal all", false, h.shown[i].length === q.a.length), {
        k: "hall"
      }));
      s.btns.push(Object.assign(G.pill(c, 24 + hw, y, hw, 46, last ? "Final score" : "Next round ›", false, won < 0 && h.pot > 0), {
        k: "hnext"
      }));
    },
    _t: {
      norm: norm,
      match: match,
      alike: alike,
      crewBoard: crewBoard,
      DAYS: DAYS,
      SPARE: SPARE,
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