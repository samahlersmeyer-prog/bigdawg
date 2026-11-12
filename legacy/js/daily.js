function _regenerator() { var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n2 = 0, F = function F() {}; return { s: F, n: function n() { return _n2 >= r.length ? { done: !0 } : { done: !1, value: r[_n2++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function renderHome() {
  var hr = now.getHours();
  var part = hr < 12 ? "Good morning" : hr < 17 ? "Good afternoon" : "Good evening";
  var hello = $("hello");
  hello.innerHTML = "";
  hello.append(document.createTextNode(part + (me ? ", " : "")));
  if (me) hello.append(el("b", null, me.name));
  hello.append(document.createTextNode(" · " + now.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric"
  }) + " · No. " + NUM));
  var setStat = function setStat(id, text, done) {
    var s = $("st-" + id);
    s.textContent = text;
    s.classList.toggle("done", !!done);
  };
  if (fiveDone()) {
    $("sub-five").textContent = fiveWon() ? "Solved in ".concat(fiveN()) : "The word was ".concat(ANSWER);
    setStat("five", "Results", true);
  } else if (S.five.guesses.length) {
    $("sub-five").textContent = "".concat(S.five.guesses.length, " of 6 guesses used");
    setStat("five", "Continue");
  } else {
    $("sub-five").textContent = "Guess the word in 6 tries";
    setStat("five", "Play");
  }
  if (groupsDone()) {
    $("sub-groups").textContent = groupsWon() ? S.groups.mistakes ? "Solved with ".concat(S.groups.mistakes, " mistake").concat(S.groups.mistakes > 1 ? "s" : "") : "Perfect sort" : "Out of mistakes";
    setStat("groups", "Results", true);
  } else if (S.groups.history.length) {
    $("sub-groups").textContent = "".concat(S.groups.solved.length, " of 4 groups found");
    setStat("groups", "Continue");
  } else {
    $("sub-groups").textContent = "Find the four hidden groups";
    setStat("groups", "Play");
  }
  if (S.strands.done) {
    $("sub-strands").textContent = "Solved in ".concat(fmtTime(S.strands.el)) + (S.strands.hints.length ? " \xB7 ".concat(S.strands.hints.length, " hint").concat(S.strands.hints.length > 1 ? "s" : "") : "");
    setStat("strands", "Results", true);
  } else if (S.strands.started) {
    $("sub-strands").textContent = "".concat(S.strands.found.length, " of ").concat(SP.w.length, " found \xB7 paused at ").concat(fmtTime(S.strands.el));
    setStat("strands", "Continue");
  } else {
    $("sub-strands").textContent = "Find the theme words, timed";
    setStat("strands", "Play");
  }
  if (S.mini.done) {
    $("sub-mini").textContent = "Solved in ".concat(fmtTime(S.mini.el));
    setStat("mini", "Results", true);
  } else if (S.mini.started) {
    $("sub-mini").textContent = "Paused at ".concat(fmtTime(S.mini.el));
    setStat("mini", "Continue");
  } else {
    $("sub-mini").textContent = "A quick crossword, timed";
    setStat("mini", "Play");
  }
  if (board && me) {
    var others = board.players.filter(function (p) {
      return p.id !== me.id && p.t;
    });
    var best = function best(k, ok, val) {
      var b = null;
      others.forEach(function (p) {
        var x = p.t[k];
        if (x && ok(x) && (!b || val(x) < val(b.t[k]))) b = p;
      });
      return b;
    };
    var f = best("f", function (x) {
        return x.w;
      }, function (x) {
        return x.n;
      }),
      g = best("g", function (x) {
        return x.w;
      }, function (x) {
        return x.m;
      }),
      c = best("c", function (x) {
        return x.t;
      }, function (x) {
        return x.t + (x.k ? 30 : 0);
      }),
      st = best("s", function (x) {
        return x.t;
      }, function (x) {
        return x.t + 30 * (x.h || 0);
      });
    var beat = function beat(id, p, txt) {
      if (p && !$("st-" + id).classList.contains("done") && $("st-" + id).textContent === "Play") $("sub-" + id).textContent = "\uD83D\uDC51 ".concat(p.name, " \xB7 ").concat(txt);
    };
    beat("five", f, f && "".concat(f.t.f.n, " guess").concat(f.t.f.n > 1 ? "es" : ""));
    beat("groups", g, g && (g.t.g.m ? "".concat(g.t.g.m, " mistake").concat(g.t.g.m > 1 ? "s" : "") : "perfect"));
    beat("mini", c, c && fmtTime(c.t.c.t));
    beat("strands", st, st && fmtTime(st.t.s.t));
  }
  var db = $("daybar");
  if (db) {
    db.innerHTML = "";
    var done = [fiveDone(), groupsDone(), S.strands.done, S.mini.done].filter(Boolean).length;
    db.appendChild(el("span", "dchip" + (done === 4 ? " all" : ""), done === 4 ? "✓ All 4 done" : "".concat(done, " of 4 done")));
    if (board && me && typeof todayList === "function") {
      var mine = board.players.find(function (p) {
          return p.id === me.id;
        }),
        sk = mine && mine.s || (done ? 1 : 0);
      if (sk > 1) db.appendChild(el("span", "dchip", "\uD83D\uDD25 ".concat(sk, "-day streak")));
      if (done) {
        var list = todayList().filter(function (x) {
            return x.t.f || x.t.g || x.t.c || x.t.s;
          }),
          pts = dayPts(list),
          myP = pts[me.id] || 0;
        var pl = list.filter(function (x) {
          return (pts[x.id] || 0) > myP;
        }).length + 1;
        db.appendChild(el("span", "dchip" + (pl === 1 ? " lead" : ""), "".concat(pl === 1 ? "👑 " : "").concat(pl).concat(pl === 1 ? "st" : pl === 2 ? "nd" : pl === 3 ? "rd" : "th", " of ").concat(list.length, " \xB7 ").concat(myP, " pts")));
      }
    }
  }
  if (board) {
    var n = board.players.filter(function (p) {
      return p.t && (p.t.f || p.t.g || p.t.c || p.t.s);
    }).length;
    $("sub-scores").textContent = n ? "".concat(n, " played today") : "Be the first on the board today";
  }
  var ban = bannerText();
  if (ban) $("sub-scores").textContent = ban + (board ? " \xB7 ".concat($("sub-scores").textContent) : "");
  if (shade.inbox && shade.inbox.length) $("sub-scores").textContent = "\uD83C\uDFAF ".concat(shade.inbox.length, " shade").concat(shade.inbox.length > 1 ? "s" : "", " waiting for you");
  var standalone = false;
  try {
    standalone = !!(window.navigator.standalone || window.matchMedia("(display-mode: standalone)").matches || window.top && window.top.navigator && window.top.navigator.standalone);
  } catch (e) {}
  var fast = hasServer() && FAST_URL;
  $("fast-tip").hidden = !fast;
  if (fast) $("fast-tip").href = fastLink();
  if (typeof renderArcSub === "function") renderArcSub();
  if (typeof renderDenStrip === "function") renderDenStrip();
  $("install-tip").hidden = fast || standalone || !!store.get("bdd:tipdone") || !/iPhone|iPad/.test(navigator.userAgent);
}
$("tip-close").addEventListener("click", function () {
  store.set("bdd:tipdone", 1);
  $("install-tip").hidden = true;
});
var icMini = $("ic-mini");
function evaluate(guess, answer) {
  var res = Array(5).fill("x"),
    left = {};
  for (var i = 0; i < 5; i++) {
    if (guess[i] === answer[i]) res[i] = "g";else left[answer[i]] = (left[answer[i]] || 0) + 1;
  }
  for (var _i = 0; _i < 5; _i++) {
    if (res[_i] !== "g" && left[guess[_i]]) {
      res[_i] = "y";
      left[guess[_i]]--;
    }
  }
  return res;
}
var current = "",
  revealing = false;
var fiveDoneByGuesses = function fiveDoneByGuesses() {
  return S.five.guesses.includes(ANSWER) || S.five.guesses.length >= 6;
};
var fiveDone = function fiveDone() {
  return !!S.five.locked || S.five.guesses.includes(ANSWER) || S.five.guesses.length >= 6;
};
var fiveWon = function fiveWon() {
  return S.five.locked ? !!S.five.locked.w : S.five.guesses.includes(ANSWER);
};
var fiveN = function fiveN() {
  return S.five.locked ? S.five.locked.n : S.five.guesses.length;
};
var fiveRows = function fiveRows() {
  return S.five.locked ? S.five.locked.rows : S.five.guesses.map(function (g) {
    return evaluate(g, ANSWER).join("");
  });
};
function renderBoard() {
  var flipLast = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
  var boardEl = $("board");
  boardEl.innerHTML = "";
  var _loop = function _loop() {
    var row = el("div", "row");
    var g = S.five.guesses[r];
    var ev = g ? evaluate(g, ANSWER) : null;
    var lockedRow = S.five.locked ? S.five.locked.rows[r] : null;
    var _loop2 = function _loop2(c) {
      var t = el("div", "tile");
      if (lockedRow && !(g && fiveDoneByGuesses())) {
        t.classList.add(lockedRow[c]);
        t.textContent = g ? g[c] : lockedRow[c] === "g" ? ANSWER[c] : "";
      } else if (g) {
        t.textContent = g[c];
        if (flipLast && r === S.five.guesses.length - 1) {
          t.classList.add("filled", "flip");
          t.style.animationDelay = c * 0.25 + "s";
          setTimeout(function () {
            t.classList.remove("filled");
            t.classList.add(ev[c]);
          }, c * 250 + 250);
        } else t.classList.add(ev[c]);
      } else if (r === S.five.guesses.length && !fiveDone()) {
        t.textContent = current[c] || "";
        if (current[c]) t.classList.add("filled");
      }
      row.appendChild(t);
    };
    for (var c = 0; c < 5; c++) {
      _loop2(c);
    }
    boardEl.appendChild(row);
  };
  for (var r = 0; r < 6; r++) {
    _loop();
  }
  $("keyboard").hidden = fiveDone();
  $("five-done").hidden = !fiveDone();
  if (fiveDone()) $("five-done-text").textContent = fiveWon() ? "Solved in ".concat(fiveN(), "/6") : "The word was ".concat(ANSWER);
}
var BKSP = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M21 5H9l-6 7 6 7h12z"/><path d="M12.5 9.5l5 5M17.5 9.5l-5 5" stroke-linecap="round"/></svg>';
function buildKeyboard(target, withEnter) {
  target.innerHTML = "";
  ["qwertyuiop", "asdfghjkl", (withEnter ? "+" : "") + "zxcvbnm-"].forEach(function (r, ri) {
    var row = el("div", "krow");
    if (ri === 1) row.appendChild(el("div", "spacer"));
    var _iterator = _createForOfIteratorHelper(r),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var ch = _step.value;
        var b = el("button", "key");
        if (ch === "+") {
          b.textContent = "Enter";
          b.classList.add("wide");
          b.dataset.k = "Enter";
        } else if (ch === "-") {
          b.innerHTML = BKSP;
          b.classList.add("wide");
          b.dataset.k = "Backspace";
          b.setAttribute("aria-label", "Delete");
        } else {
          b.textContent = ch;
          b.dataset.k = ch;
        }
        row.appendChild(b);
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
    if (ri === 1) row.appendChild(el("div", "spacer"));
    target.appendChild(row);
  });
}
function colorKeyboard() {
  var best = {};
  var rank = {
    x: 1,
    y: 2,
    g: 3
  };
  S.five.guesses.forEach(function (g) {
    return evaluate(g, ANSWER).forEach(function (e, i) {
      var L = g[i];
      if (!best[L] || rank[e] > rank[best[L]]) best[L] = e;
    });
  });
  $("keyboard").querySelectorAll(".key").forEach(function (k) {
    var L = (k.dataset.k || "").toUpperCase();
    k.classList.remove("g", "y", "x");
    if (L.length === 1 && best[L]) k.classList.add(best[L]);
  });
}
$("keyboard").addEventListener("click", function (e) {
  var b = e.target.closest(".key");
  if (b) press(b.dataset.k);
});
function shakeRow() {
  var row = $("board").children[S.five.guesses.length];
  if (row) {
    row.classList.remove("shake");
    void row.offsetWidth;
    row.classList.add("shake");
  }
}
var HYPE = {
  five: [["Hacker. Absolutely hacker.", "Built different", "Goated", "Absolute cinema", "Psychic dawg"], ["Big Dawg energy", "Ate that", "Main character", "No crumbs left", "Cold blooded"], ["Let him cook", "Bussin'", "Clean as a whistle", "Big brain move", "Smooth operator"], ["W secured", "Solid dub", "We take those", "Respectable", "Vibes immaculate"], ["Sweaty, but a W", "Chaotic good", "Still counts", "Took the scenic route", "Ugly win is a win"], ["CLUTCH", "Heart attack", "By a whisker", "Phew. Barely.", "Sweat level: max"]],
  lose: ["Cooked", "Down bad", "It's giving L", "Bad dog", "Ruff day"],
  perfect: ["Flawless. Big Dawg.", "Zero misses. Goated.", "Built different", "Not a single crumb"],
  win: ["W secured", "Let him cook", "Dub", "Big Dawg move", "Handled it"],
  fast: ["Speed demon", "Zoomies", "Light work", "Too easy", "Fast and furious"]
};
var hype = function hype(list, salt) {
  return list[Math.floor(rng(DAY * 97 + salt)() * list.length)];
};
var PRAISE = HYPE.five.map(function (l, i) {
  return hype(l, i + 1);
});
function press(k) {
  if (fiveDone() || revealing) return;
  if (k === "Backspace") {
    current = current.slice(0, -1);
    renderBoard();
    return;
  }
  if (k === "Enter") {
    if (current.length < 5) {
      toast("Not enough letters");
      shakeRow();
      return;
    }
    if (!VALID.has(current.toLowerCase())) {
      toast("Not in word list");
      shakeRow();
      return;
    }
    S.five.guesses.push(current);
    current = "";
    if (S.five.guesses.includes(ANSWER) || S.five.guesses.length >= 6) S.five.fin = true;
    save();
    revealing = true;
    renderBoard(true);
    $("keyboard").hidden = false;
    $("five-done").hidden = true;
    setTimeout(function () {
      revealing = false;
      colorKeyboard();
      if (fiveDone()) {
        var won = fiveWon();
        if (won) {
          var row = $("board").children[S.five.guesses.length - 1];
          row.classList.add("dance");
          celebrate();
        } else chime("lose");
        toast(won ? PRAISE[S.five.guesses.length - 1] : "".concat(hype(HYPE.lose, 7), ". It was ").concat(ANSWER), 2000);
        pushResult();
        setTimeout(function () {
          renderBoard();
          openResults("five");
        }, 1900);
      }
    }, 1500);
    return;
  }
  if (current.length < 5 && /^[a-zA-Z]$/.test(k)) {
    current += k.toUpperCase();
    renderBoard();
  }
}
function fiveSummary() {
  return {
    w: fiveWon(),
    n: fiveN(),
    rows: fiveRows()
  };
}
var sel = new Set();
var groupsLost = function groupsLost() {
  return S.groups.mistakes >= 4;
};
var groupsWon = function groupsWon() {
  return S.groups.solved.length === 4;
};
var groupsDone = function groupsDone() {
  return groupsWon() || groupsLost();
};
function renderGroups() {
  var bump = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
  var grid = $("ggrid");
  grid.innerHTML = "";
  var addBar = function addBar(lvl) {
    var d = el("div", "solved l".concat(lvl));
    d.append(el("b", null, PUZ[lvl][0]), el("span", null, PUZ[lvl][1].join(", ")));
    grid.appendChild(d);
  };
  S.groups.solved.forEach(addBar);
  if (groupsLost()) [0, 1, 2, 3].filter(function (l) {
    return !S.groups.solved.includes(l);
  }).forEach(addBar);else S.groups.order.filter(function (w) {
    return !S.groups.solved.includes(LEVEL[w]);
  }).forEach(function (w) {
    var b = el("button", "gtile" + (w.length > 7 ? " long" : ""), w);
    b.setAttribute("aria-pressed", sel.has(w) ? "true" : "false");
    if (bump && sel.has(w)) b.classList.add("bump");
    b.addEventListener("click", function () {
      if (groupsDone()) return;
      if (sel.has(w)) sel["delete"](w);else if (sel.size < 4) sel.add(w);else return;
      b.setAttribute("aria-pressed", sel.has(w) ? "true" : "false");
      syncGroupButtons();
    });
    grid.appendChild(b);
  });
  var dots = $("dots");
  dots.innerHTML = "";
  for (var i = 0; i < 4; i++) {
    var d = el("i");
    if (i >= 4 - S.groups.mistakes) d.className = "used";
    dots.appendChild(d);
  }
  $("mistakes-wrap").hidden = groupsDone();
  $("gactions").hidden = groupsDone();
  $("groups-done").hidden = !groupsDone();
  if (groupsDone()) $("groups-done-text").textContent = groupsWon() ? S.groups.mistakes ? "Solved \xB7 ".concat(S.groups.mistakes, " mistake").concat(S.groups.mistakes > 1 ? "s" : "") : "Perfect sort!" : "Out of mistakes";
  syncGroupButtons();
}
function syncGroupButtons() {
  $("g-submit").disabled = sel.size !== 4;
  $("g-clear").disabled = sel.size === 0;
}
$("g-shuffle").addEventListener("click", function () {
  var rest = S.groups.order.filter(function (w) {
    return !S.groups.solved.includes(LEVEL[w]);
  });
  var done = S.groups.order.filter(function (w) {
    return S.groups.solved.includes(LEVEL[w]);
  });
  S.groups.order = done.concat(shuffle(rest));
  save();
  renderGroups();
});
$("g-clear").addEventListener("click", function () {
  sel.clear();
  renderGroups();
});
$("g-submit").addEventListener("click", function () {
  if (sel.size !== 4 || groupsDone()) return;
  var pick = _toConsumableArray(sel);
  var sig = pick.slice().sort().join("|");
  if (S.groups.tried.includes(sig)) {
    toast("Already guessed!");
    return;
  }
  S.groups.tried.push(sig);
  var lvls = pick.map(function (w) {
    return LEVEL[w];
  });
  S.groups.history.push(lvls.join(""));
  if (lvls.every(function (l) {
    return l === lvls[0];
  })) {
    var lvl = lvls[0];
    S.groups.order = S.groups.order.filter(function (w) {
      return LEVEL[w] !== lvl;
    });
    S.groups.order = PUZ[lvl][1].concat(S.groups.order);
    S.groups.solved.push(lvl);
    sel.clear();
    save();
    renderGroups();
    if (groupsWon()) celebrate();else chime("pop");
    if (groupsDone()) {
      pushResult();
      setTimeout(function () {
        return openResults("groups");
      }, 1100);
    }
  } else {
    S.groups.mistakes++;
    var counts = {};
    lvls.forEach(function (l) {
      return counts[l] = (counts[l] || 0) + 1;
    });
    var oneAway = Object.values(counts).includes(3);
    save();
    if (groupsLost()) {
      sel.clear();
      renderGroups();
      toast(hype(HYPE.lose, 13));
      chime("lose");
      pushResult();
      setTimeout(function () {
        return openResults("groups");
      }, 1500);
    } else {
      renderGroups(true);
      if (oneAway) toast("One away...");
    }
  }
});
function groupsSummary() {
  return {
    w: groupsWon(),
    m: S.groups.mistakes,
    rows: S.groups.history.slice()
  };
}
var BLACK = {
  A: [0, 24],
  B: [4, 20],
  C: [0, 4, 20, 24]
}[CW.p];
var isBlack = function isBlack(i) {
  return BLACK.includes(i);
};
var SOL = Array(25).fill(null);
var acrossCells = [],
  downCells = [];
for (var r = 0; r < 5; r++) {
  var c = [];
  for (var k = 0; k < 5; k++) {
    var i = r * 5 + k;
    if (!isBlack(i)) c.push(i);
  }
  acrossCells.push(c);
}
for (var _k = 0; _k < 5; _k++) {
  var _c = [];
  for (var _r = 0; _r < 5; _r++) {
    var _i2 = _r * 5 + _k;
    if (!isBlack(_i2)) _c.push(_i2);
  }
  downCells.push(_c);
}
acrossCells.forEach(function (cells, k) {
  return cells.forEach(function (i, j) {
    return SOL[i] = CW.a[k][j].toUpperCase();
  });
});
var NUMS = {};
{
  var n = 1;
  var _loop3 = function _loop3(_i3) {
    if (isBlack(_i3)) return 1;
    if (acrossCells.some(function (a) {
      return a[0] === _i3;
    }) || downCells.some(function (d) {
      return d[0] === _i3;
    })) NUMS[_i3] = n++;
  };
  for (var _i3 = 0; _i3 < 25; _i3++) {
    if (_loop3(_i3)) continue;
  }
}
var ENTRIES = [].concat(_toConsumableArray(acrossCells.map(function (cells, k) {
  return {
    dir: "A",
    cells: cells,
    num: NUMS[cells[0]],
    clue: CW.ca[k]
  };
}).sort(function (a, b) {
  return a.num - b.num;
})), _toConsumableArray(downCells.map(function (cells, k) {
  return {
    dir: "D",
    cells: cells,
    num: NUMS[cells[0]],
    clue: CW.cd[k]
  };
}).sort(function (a, b) {
  return a.num - b.num;
})));
var cur = ENTRIES[0].cells[0],
  dir = "A",
  warnedSig = "";
var entryFor = function entryFor(i, d) {
  return ENTRIES.find(function (e) {
    return e.dir === d && e.cells.includes(i);
  });
};
var fmtTime = function fmtTime(s) {
  s = Math.floor(s);
  return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0");
};
for (var _i4 = 0; _i4 < 9; _i4++) {
  var g = el("i");
  if ([0, 8].includes(_i4)) g.className = "b";
  icMini.appendChild(g);
}
var cellEls = [];
(function buildGrid() {
  var cw = $("cw");
  var _loop4 = function _loop4(_i5) {
    var b = el("button", "cell" + (isBlack(_i5) ? " block" : ""));
    if (isBlack(_i5)) {
      b.disabled = true;
      b.setAttribute("aria-hidden", "true");
      b.tabIndex = -1;
    } else {
      if (NUMS[_i5]) b.appendChild(el("span", "n", NUMS[_i5]));
      b.appendChild(el("span", "L"));
      b.addEventListener("click", function () {
        return tapCell(_i5);
      });
    }
    cellEls.push(b);
    cw.appendChild(b);
  };
  for (var _i5 = 0; _i5 < 25; _i5++) {
    _loop4(_i5);
  }
  var ghost = $("mini-ghost");
  for (var _i6 = 0; _i6 < 25; _i6++) {
    var _g = el("i");
    if (isBlack(_i6)) _g.className = "b";
    ghost.appendChild(_g);
  }
})();
function paintCW() {
  var fill = S.mini.fill;
  var e = entryFor(cur, dir) || entryFor(cur, dir === "A" ? "D" : "A");
  if (e) dir = e.dir;
  var _loop5 = function _loop5(_i7) {
    if (isBlack(_i7)) return 1;
    var b = cellEls[_i7];
    b.querySelector(".L").textContent = fill[_i7] || "";
    b.classList.toggle("inword", !S.mini.done && e.cells.includes(_i7));
    b.classList.toggle("cur", !S.mini.done && _i7 === cur);
    b.classList.toggle("wrong", S.mini.wrong.includes(_i7));
    var ent = ENTRIES.filter(function (x) {
      return x.cells.includes(_i7);
    }).map(function (x) {
      return x.num + (x.dir === "A" ? " Across" : " Down");
    }).join(", ");
    b.setAttribute("aria-label", "".concat(ent).concat(fill[_i7] ? ", letter " + fill[_i7] : ", empty"));
  };
  for (var _i7 = 0; _i7 < 25; _i7++) {
    if (_loop5(_i7)) continue;
  }
  var ct = $("clue-text");
  ct.innerHTML = "";
  ct.append(el("b", null, e.num + (e.dir === "A" ? "A" : "D")), document.createTextNode(e.clue));
}
function tapCell(i) {
  if (S.mini.done) return;
  if (i === cur) {
    var other = dir === "A" ? "D" : "A";
    if (entryFor(i, other)) dir = other;
  } else {
    cur = i;
    if (!entryFor(i, dir)) dir = dir === "A" ? "D" : "A";
  }
  paintCW();
}
function moveEntry(step) {
  var fill = S.mini.fill;
  var e = entryFor(cur, dir);
  var k = ENTRIES.indexOf(e);
  for (var _n = 0; _n < ENTRIES.length; _n++) {
    k = mod(k + step, ENTRIES.length);
    var x = ENTRIES[k],
      empty = x.cells.find(function (i) {
        return !fill[i];
      });
    if (empty !== undefined || ENTRIES.every(function (y) {
      return y.cells.every(function (i) {
        return fill[i];
      });
    })) {
      dir = x.dir;
      cur = empty !== undefined ? empty : x.cells[0];
      return;
    }
  }
}
function typeLetter(L) {
  if (S.mini.done || !S.mini.started) return;
  var fill = S.mini.fill;
  fill[cur] = L;
  S.mini.wrong = S.mini.wrong.filter(function (i) {
    return i !== cur;
  });
  var e = entryFor(cur, dir),
    pos = e.cells.indexOf(cur);
  var after = e.cells.slice(pos + 1).find(function (i) {
    return !fill[i];
  });
  if (after !== undefined) cur = after;else {
    var anyEmpty = e.cells.find(function (i) {
      return !fill[i];
    });
    if (anyEmpty !== undefined) cur = anyEmpty;else moveEntry(1);
  }
  save();
  paintCW();
  checkMini();
}
function backspace() {
  if (S.mini.done || !S.mini.started) return;
  var fill = S.mini.fill;
  if (fill[cur]) fill[cur] = "";else {
    var e = entryFor(cur, dir),
      pos = e.cells.indexOf(cur);
    if (pos > 0) {
      cur = e.cells[pos - 1];
      fill[cur] = "";
    }
  }
  S.mini.wrong = S.mini.wrong.filter(function (i) {
    return i !== cur;
  });
  save();
  paintCW();
}
function arrow(dr, dc) {
  var want = dr === 0 ? "A" : "D";
  if (dir !== want && entryFor(cur, want)) {
    dir = want;
    paintCW();
    return;
  }
  var r = Math.floor(cur / 5),
    c = cur % 5;
  for (;;) {
    r += dr;
    c += dc;
    if (r < 0 || r > 4 || c < 0 || c > 4) return;
    var _i8 = r * 5 + c;
    if (!isBlack(_i8)) {
      cur = _i8;
      paintCW();
      return;
    }
  }
}
function checkMini() {
  var fill = S.mini.fill;
  var open = _toConsumableArray(Array(25).keys()).filter(function (i) {
    return !isBlack(i);
  });
  if (!open.every(function (i) {
    return fill[i];
  })) return;
  if (open.every(function (i) {
    return fill[i] === SOL[i];
  })) {
    solveMini();
    return;
  }
  var sig = fill.join("");
  if (sig !== warnedSig) {
    warnedSig = sig;
    toast("Not quite. Keep trying!", 1800);
  }
}
$("mini-check").addEventListener("click", function () {
  if (S.mini.done) return;
  var fill = S.mini.fill;
  S.mini.checked = true;
  S.mini.wrong = _toConsumableArray(Array(25).keys()).filter(function (i) {
    return !isBlack(i) && fill[i] && fill[i] !== SOL[i];
  });
  save();
  paintCW();
  toast(S.mini.wrong.length ? "".concat(S.mini.wrong.length, " square").concat(S.mini.wrong.length === 1 ? " is" : "s are", " wrong") : "Everything so far is right");
});
$("clue-prev").addEventListener("click", function () {
  moveEntry(-1);
  paintCW();
});
$("clue-next").addEventListener("click", function () {
  moveEntry(1);
  paintCW();
});
$("clue-text").addEventListener("click", openClueList);
$("mini-list").addEventListener("click", openClueList);
function openClueList() {
  var e = entryFor(cur, dir);
  var wrap = el("div", "cluelist");
  [["A", "Across"], ["D", "Down"]].forEach(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
      d = _ref2[0],
      label = _ref2[1];
    wrap.appendChild(el("h3", null, label));
    ENTRIES.filter(function (x) {
      return x.dir === d;
    }).forEach(function (x) {
      var b = el("button", x === e ? "on" : "");
      b.append(el("b", null, x.num), el("span", null, x.clue));
      b.addEventListener("click", function () {
        dir = x.dir;
        cur = x.cells.find(function (i) {
          return !S.mini.fill[i];
        });
        if (cur === undefined) cur = x.cells[0];
        closeModal();
        paintCW();
      });
      wrap.appendChild(b);
    });
  });
  openModal([el("h2", null, "Clues"), wrap]);
}
var miniKb = $("mini-kb");
miniKb.addEventListener("click", function (e) {
  var b = e.target.closest(".key");
  if (!b) return;
  if (b.dataset.k === "Backspace") backspace();else typeLetter(b.dataset.k.toUpperCase());
});
var TM = {
  mini: {
    start: null,
    base: 0
  },
  strands: {
    start: null,
    base: 0
  }
};
var timerId = null,
  lastSave = 0;
function elapsed(g) {
  var x = TM[g];
  return x.start === null ? S[g].el : x.base + (performance.now() - x.start) / 1000;
}
function drawTimers() {
  $("mini-timer").textContent = fmtTime(elapsed("mini"));
  $("st-timer").textContent = fmtTime(elapsed("strands"));
}
function syncTimer() {
  if (!S) return;
  var anyRun = false;
  ["mini", "strands"].forEach(function (g) {
    var run = S[g].started && !S[g].done && active === g && $("modal").hidden && document.visibilityState === "visible";
    var x = TM[g];
    if (run) {
      anyRun = true;
      if (x.start === null) {
        x.start = performance.now();
        x.base = S[g].el;
      }
    } else if (x.start !== null) {
      S[g].el = elapsed(g);
      x.start = null;
      save();
    }
  });
  if (anyRun && !timerId) timerId = setInterval(function () {
    drawTimers();
    if (performance.now() - lastSave > 3000) {
      lastSave = performance.now();
      ["mini", "strands"].forEach(function (g) {
        var x = TM[g];
        if (x.start !== null) {
          S[g].el = elapsed(g);
          x.base = S[g].el;
          x.start = performance.now();
        }
      });
      store.set(skey(), S);
    }
  }, 250);
  if (!anyRun && timerId) {
    clearInterval(timerId);
    timerId = null;
  }
  drawTimers();
}
document.addEventListener("visibilitychange", syncTimer);
function miniShown() {
  var started = S.mini.started;
  $("mini-start").hidden = started;
  $("cw").hidden = !started;
  $("minibar").hidden = !started;
  $("cluebar").hidden = !started || S.mini.done;
  miniKb.hidden = !started || S.mini.done;
  $("mini-done").hidden = !S.mini.done;
  $("mini-check").hidden = S.mini.done;
  if (S.mini.done) $("mini-done-text").textContent = "Solved in ".concat(fmtTime(S.mini.el));
  $("cw").classList.toggle("won", S.mini.done);
  paintCW();
}
$("mini-go").addEventListener("click", function () {
  S.mini.started = true;
  save();
  miniShown();
  syncTimer();
});
function miniSummary() {
  return {
    t: Math.max(1, Math.floor(S.mini.el)),
    k: !!S.mini.checked
  };
}
function solveMini() {
  S.mini.el = elapsed("mini");
  TM.mini.start = null;
  S.mini.done = true;
  S.mini.wrong = [];
  save();
  syncTimer();
  miniShown();
  toast("".concat(S.mini.el < 60 ? hype(HYPE.fast, 31) : hype(HYPE.win, 32), " \xB7 ").concat(fmtTime(S.mini.el)), 1800);
  celebrate();
  pushResult();
  setTimeout(function () {
    return openResults("mini");
  }, 1300);
}
var STW = SP.w;
var stPath = [],
  stDrag = null;
var stGrid = $("stgrid");
var stCells = [];
for (var _i9 = 0; _i9 < 48; _i9++) {
  var d = el("div", "sl");
  d.appendChild(el("span", null, SP.g[_i9]));
  stGrid.appendChild(d);
  stCells.push(d);
}
$("st-theme").textContent = SP.t;
var stAdj = function stAdj(a, b) {
  return a !== b && Math.abs(Math.floor(a / 6) - Math.floor(b / 6)) <= 1 && Math.abs(a % 6 - b % 6) <= 1;
};
var cellsOf = function cellsOf(k) {
  return S.strands.sol && S.strands.sol[k] || STW[k][1];
};
function stOwner(i) {
  var _iterator2 = _createForOfIteratorHelper(S.strands.found),
    _step2;
  try {
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      var _k2 = _step2.value;
      if (cellsOf(_k2).includes(i)) return _k2;
    }
  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }
  return -1;
}
function stHinted(i) {
  return S.strands.hints.some(function (k) {
    return !S.strands.found.includes(k) && cellsOf(k).includes(i);
  });
}
var stEdge = function stEdge(a, b) {
  return a < b ? a + "-" + b : b + "-" + a;
};
function stCross(a, b) {
  var r1 = Math.floor(a / 6),
    c1 = a % 6,
    r2 = Math.floor(b / 6),
    c2 = b % 6;
  return r1 !== r2 && c1 !== c2 ? stEdge(r1 * 6 + c2, r2 * 6 + c1) : null;
}
function stDiags(cells, set) {
  for (var _i0 = 1; _i0 < cells.length; _i0++) if (stCross(cells[_i0 - 1], cells[_i0])) set.add(stEdge(cells[_i0 - 1], cells[_i0]));
  return set;
}
function stCrosses(cells, diags) {
  for (var _i1 = 1; _i1 < cells.length; _i1++) {
    var o = stCross(cells[_i1 - 1], cells[_i1]);
    if (o && diags.has(o)) return true;
  }
  return false;
}
var stSpans = function stSpans(cells) {
  var rs = cells.map(function (i) {
      return Math.floor(i / 6);
    }),
    cs = cells.map(function (i) {
      return i % 6;
    });
  return rs.includes(0) && rs.includes(7) || cs.includes(0) && cs.includes(5);
};
function stSolve(free, ks, diags) {
  var cands = {};
  var _iterator3 = _createForOfIteratorHelper(ks),
    _step3;
  try {
    var _loop7 = function _loop7() {
        var k = _step3.value;
        var w = STW[k][0],
          out = [];
        var _dfs = function dfs(path, own) {
          if (out.length > 300) return;
          if (path.length === w.length) {
            if (k !== 0 || stSpans(path)) out.push(path.slice());
            return;
          }
          var last = path[path.length - 1];
          var next = path.length ? [-7, -6, -5, -1, 1, 5, 6, 7].map(function (d) {
            return last + d;
          }).filter(function (y) {
            return y >= 0 && y < 48 && stAdj(last, y);
          }) : _toConsumableArray(free);
          var _iterator8 = _createForOfIteratorHelper(next),
            _step8;
          try {
            for (_iterator8.s(); !(_step8 = _iterator8.n()).done;) {
              var y = _step8.value;
              if (!free.has(y) || path.includes(y) || SP.g[y] !== w[path.length]) continue;
              var o = path.length ? stCross(last, y) : null;
              if (o && (diags.has(o) || own.has(o))) continue;
              var e = path.length && o ? stEdge(last, y) : null;
              path.push(y);
              if (e) own.add(e);
              _dfs(path, own);
              path.pop();
              if (e) own["delete"](e);
            }
          } catch (err) {
            _iterator8.e(err);
          } finally {
            _iterator8.f();
          }
        };
        _dfs([], new Set());
        if (!out.length) return {
          v: null
        };
        cands[k] = out;
      },
      _ret2;
    for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
      _ret2 = _loop7();
      if (_ret2) return _ret2.v;
    }
  } catch (err) {
    _iterator3.e(err);
  } finally {
    _iterator3.f();
  }
  var res = {};
  var steps = 0;
  var _go = function go(left, freeNow, dg) {
    if (++steps > 20000) return false;
    if (!left.length) return freeNow.size === 0;
    var best = null;
    var _iterator4 = _createForOfIteratorHelper(freeNow),
      _step4;
    try {
      for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
        var _c2 = _step4.value;
        var opts = [];
        var _iterator6 = _createForOfIteratorHelper(left),
          _step6;
        try {
          for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
            var _k3 = _step6.value;
            var _iterator7 = _createForOfIteratorHelper(cands[_k3]),
              _step7;
            try {
              for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
                var pth = _step7.value;
                if (pth.includes(_c2) && pth.every(function (y) {
                  return freeNow.has(y);
                }) && !stCrosses(pth, dg)) opts.push([_k3, pth]);
              }
            } catch (err) {
              _iterator7.e(err);
            } finally {
              _iterator7.f();
            }
          }
        } catch (err) {
          _iterator6.e(err);
        } finally {
          _iterator6.f();
        }
        if (!opts.length) return false;
        if (!best || opts.length < best.length) best = opts;
        if (best.length === 1) break;
      }
    } catch (err) {
      _iterator4.e(err);
    } finally {
      _iterator4.f();
    }
    var _iterator5 = _createForOfIteratorHelper(best),
      _step5;
    try {
      var _loop6 = function _loop6() {
          var _step5$value = _slicedToArray(_step5.value, 2),
            k = _step5$value[0],
            pth = _step5$value[1];
          var nf = new Set(freeNow);
          pth.forEach(function (y) {
            return nf["delete"](y);
          });
          res[k] = pth;
          if (_go(left.filter(function (x) {
            return x !== k;
          }), nf, stDiags(pth, new Set(dg)))) return {
            v: true
          };
          delete res[k];
        },
        _ret;
      for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
        _ret = _loop6();
        if (_ret) return _ret.v;
      }
    } catch (err) {
      _iterator5.e(err);
    } finally {
      _iterator5.f();
    }
    return false;
  };
  return _go(ks.slice(), new Set(free), diags) ? res : null;
}
function stLine(cells, color) {
  var pts = cells.map(function (i) {
    return "".concat(i % 6 + 0.5, ",").concat(Math.floor(i / 6) + 0.5);
  }).join(" ");
  return "<polyline points=\"".concat(pts, "\" fill=\"none\" stroke=\"").concat(color, "\" stroke-width=\"0.3\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>");
}
function renderStrands(msg) {
  for (var _i10 = 0; _i10 < 48; _i10++) {
    var o = stOwner(_i10),
      _c3 = stCells[_i10];
    _c3.classList.toggle("found", o > 0);
    _c3.classList.toggle("span", o === 0);
    _c3.classList.toggle("sel", stPath.includes(_i10));
    _c3.classList.toggle("hint", o < 0 && stHinted(_i10));
  }
  var svg = "";
  S.strands.found.forEach(function (k) {
    return svg += stLine(cellsOf(k), k === 0 ? "var(--st-span)" : "var(--st-word)");
  });
  if (stPath.length > 1) svg += stLine(stPath, "var(--st-sel)");
  $("st-lines").innerHTML = svg;
  var w = $("st-word");
  if (msg) {
    w.textContent = msg;
    w.classList.add("miss");
  } else {
    w.textContent = stPath.map(function (i) {
      return SP.g[i];
    }).join("");
    w.classList.remove("miss");
  }
  var theme = S.strands.found.filter(function (k) {
    return k > 0;
  }).length;
  $("st-count").textContent = "".concat(theme, " of ").concat(STW.length - 1, " words") + (S.strands.found.includes(0) ? " + spangram" : "");
  var left = STW.some(function (x, k) {
    return !S.strands.found.includes(k) && !S.strands.hints.includes(k);
  });
  var earned = stEarned(),
    hb = $("st-hint");
  hb.disabled = !left || S.strands.done || earned < 1;
  hb.textContent = S.strands.done || !left ? "Hint" : earned > 0 ? "\uD83D\uDCA1 Hint".concat(earned > 1 ? " ×" + earned : "") : "Hint ".concat((S.strands.bonus || []).length % 3, "/3");
  hb.classList.toggle("ready", earned > 0 && !S.strands.done);
  $("st-enter").disabled = stPath.length < 2;
  $("st-clear").disabled = !stPath.length;
}
var stMsgT = null;
function stFlash(msg) {
  clearTimeout(stMsgT);
  renderStrands(msg);
  stMsgT = setTimeout(function () {
    return renderStrands();
  }, 1100);
}
function stSubmit() {
  if (S.strands.done || !stPath.length) return;
  var word = stPath.map(function (i) {
    return SP.g[i];
  }).join("");
  var path = stPath;
  stPath = [];
  if (word.length < 4) {
    stFlash("Too short");
    return;
  }
  var same = function same(a, b) {
    return a.length === b.length && a.every(function (x) {
      return b.includes(x);
    });
  };
  var open = STW.map(function (x, i) {
    return i;
  }).filter(function (i) {
    return !S.strands.found.includes(i) && STW[i][0] === word;
  });
  var k = open.find(function (i) {
    return same(cellsOf(i), path);
  });
  if (k === undefined && open.length) {
    var diags = new Set();
    S.strands.found.forEach(function (f) {
      return stDiags(cellsOf(f), diags);
    });
    if (!stCrosses(path, diags) && !stCrosses(path, stDiags(path, new Set()))) {
      var used = new Set(path);
      S.strands.found.forEach(function (f) {
        return cellsOf(f).forEach(function (y) {
          return used.add(y);
        });
      });
      var free = new Set(_toConsumableArray(Array(48).keys()).filter(function (y) {
        return !used.has(y);
      }));
      var _iterator9 = _createForOfIteratorHelper(open),
        _step9;
      try {
        var _loop8 = function _loop8() {
            var cand = _step9.value;
            if (cand === 0 && !stSpans(path)) return 0;
            var rest = STW.map(function (x, i) {
              return i;
            }).filter(function (i) {
              return i !== cand && !S.strands.found.includes(i);
            });
            var fit = stSolve(free, rest, stDiags(path, new Set(diags)));
            if (fit) {
              var sol = STW.map(function (x, i) {
                return cellsOf(i).slice();
              });
              sol[cand] = path.slice();
              Object.keys(fit).forEach(function (i) {
                return sol[i] = fit[i];
              });
              S.strands.sol = sol;
              k = cand;
              return 1;
            }
          },
          _ret3;
        for (_iterator9.s(); !(_step9 = _iterator9.n()).done;) {
          _ret3 = _loop8();
          if (_ret3 === 0) continue;
          if (_ret3 === 1) break;
        }
      } catch (err) {
        _iterator9.e(err);
      } finally {
        _iterator9.f();
      }
    }
    if (k === undefined) {
      stFlash("Right word, wrong spot");
      return;
    }
  }
  if (k !== undefined) {
    S.strands.found.push(k);
    save();
    stFlash(k === 0 ? "SPANGRAM!" : word);
    if (S.strands.found.length < STW.length) chime("pop");
    if (S.strands.found.length === STW.length) solveStrands();
    return;
  }
  if (STW.some(function (x, i) {
    return S.strands.found.includes(i) && x[0] === word;
  })) stFlash("Already found");else {
    var B = stBonus(),
      bl = S.strands.bonus || (S.strands.bonus = []);
    if (bl.includes(word)) stFlash("Already counted");else if (B && B.has(word)) {
      bl.push(word);
      save();
      stFlash(bl.length % 3 === 0 ? "Hint earned! 💡" : "Nice word! ".concat(bl.length % 3, "/3 to a hint"));
    } else stFlash("Not a theme word");
  }
}
function stTap(i) {
  if (stOwner(i) >= 0) return;
  var last = stPath[stPath.length - 1];
  if (!stPath.length) stPath = [i];else if (i === last) {
    stSubmit();
    return;
  } else if (stPath.includes(i)) stPath = stPath.slice(0, stPath.indexOf(i) + 1);else if (stAdj(last, i)) stPath.push(i);else stPath = [i];
  renderStrands();
}
function stCellAt(e) {
  var r = stGrid.getBoundingClientRect();
  var cw = r.width / 6,
    ch = r.height / 8;
  var c = Math.floor((e.clientX - r.left) / cw),
    rr = Math.floor((e.clientY - r.top) / ch);
  if (c < 0 || c > 5 || rr < 0 || rr > 7) return null;
  var dx = e.clientX - (r.left + (c + 0.5) * cw),
    dy = e.clientY - (r.top + (rr + 0.5) * ch);
  if (Math.hypot(dx, dy) > Math.min(cw, ch) * 0.42) return null;
  return rr * 6 + c;
}
stGrid.addEventListener("pointerdown", function (e) {
  if (S.strands.done || !S.strands.started) return;
  var i = stCellAt(e);
  if (i === null) return;
  e.preventDefault();
  try {
    stGrid.setPointerCapture(e.pointerId);
  } catch (x) {}
  stDrag = {
    start: i,
    moved: false
  };
});
stGrid.addEventListener("pointermove", function (e) {
  if (!stDrag) return;
  var i = stCellAt(e);
  if (i === null) return;
  if (!stDrag.moved) {
    if (i === stDrag.start) return;
    if (stOwner(stDrag.start) >= 0) return;
    stDrag.moved = true;
    stPath = [stDrag.start];
  }
  var last = stPath[stPath.length - 1];
  if (i === last || stOwner(i) >= 0) return;
  if (stPath.length > 1 && i === stPath[stPath.length - 2]) stPath.pop();else if (!stPath.includes(i) && stAdj(last, i)) stPath.push(i);else return;
  renderStrands();
});
var stEnd = function stEnd() {
  if (!stDrag) return;
  var d = stDrag;
  stDrag = null;
  if (d.moved) {
    if (stPath.length > 1) stSubmit();else renderStrands();
  } else stTap(d.start);
};
stGrid.addEventListener("pointerup", stEnd);
stGrid.addEventListener("pointercancel", function () {
  stDrag = null;
});
$("st-clear").addEventListener("click", function () {
  stPath = [];
  renderStrands();
});
$("st-enter").addEventListener("click", stSubmit);
$("st-hint").addEventListener("click", function () {
  if (S.strands.done) return;
  var order = STW.map(function (x, k) {
    return k;
  }).filter(function (k) {
    return k > 0;
  }).concat([0]);
  var k = order.find(function (k) {
    return !S.strands.found.includes(k) && !S.strands.hints.includes(k);
  });
  if (k === undefined || stEarned() < 1) return;
  S.strands.hints.push(k);
  save();
  renderStrands();
  toast(k === 0 ? "Hint: the spangram is outlined" : "Hint: a theme word is outlined");
});
function strandsShown() {
  var started = S.strands.started;
  $("st-start").hidden = started;
  $("st-wrap").hidden = !started;
  $("st-bar").hidden = !started;
  $("st-actions").hidden = !started || S.strands.done;
  $("strands-done").hidden = !S.strands.done;
  if (S.strands.done) $("strands-done-text").textContent = "Solved in ".concat(fmtTime(S.strands.el)) + (S.strands.hints.length ? " \xB7 ".concat(S.strands.hints.length, " hint").concat(S.strands.hints.length > 1 ? "s" : "") : "");
  renderStrands();
}
$("st-go").addEventListener("click", function () {
  S.strands.started = true;
  save();
  strandsShown();
  syncTimer();
});
function strandsSummary() {
  return {
    t: Math.max(1, Math.floor(S.strands.el)),
    h: S.strands.hints.length
  };
}
function solveStrands() {
  S.strands.el = elapsed("strands");
  TM.strands.start = null;
  S.strands.done = true;
  save();
  syncTimer();
  strandsShown();
  celebrate();
  pushResult();
  setTimeout(function () {
    return openResults("strands");
  }, 1300);
}
document.addEventListener("keydown", function (e) {
  if (active !== "strands" || !$("modal").hidden || S.strands.done) return;
  if (e.key === "Enter") {
    e.preventDefault();
    stSubmit();
  } else if (e.key === "Escape" || e.key === "Backspace") {
    e.preventDefault();
    stPath = [];
    renderStrands();
  }
});
document.addEventListener("keydown", function (e) {
  if (e.metaKey || e.ctrlKey || e.altKey) return;
  if (e.target.closest && e.target.closest("input, textarea")) return;
  if (!$("modal").hidden) {
    if (e.key === "Escape") closeModal();
    return;
  }
  var k = e.key;
  if (active === "five") {
    if (k === "Enter" || k === "Backspace" || /^[a-zA-Z]$/.test(k)) {
      e.preventDefault();
      press(k);
    }
    return;
  }
  if (active === "mini" && S.mini.started && !S.mini.done) {
    if (/^[a-zA-Z]$/.test(k)) {
      e.preventDefault();
      typeLetter(k.toUpperCase());
    } else if (k === "Backspace" || k === "Delete") {
      e.preventDefault();
      backspace();
    } else if (k === "ArrowLeft") {
      e.preventDefault();
      arrow(0, -1);
    } else if (k === "ArrowRight") {
      e.preventDefault();
      arrow(0, 1);
    } else if (k === "ArrowUp") {
      e.preventDefault();
      arrow(-1, 0);
    } else if (k === "ArrowDown") {
      e.preventDefault();
      arrow(1, 0);
    } else if (k === "Tab" || k === "Enter") {
      e.preventDefault();
      moveEntry(e.shiftKey ? -1 : 1);
      paintCW();
    } else if (k === " ") {
      e.preventDefault();
      tapCell(cur);
    }
  }
});
var GAME_NAMES = {
  five: "Five",
  groups: "Groups",
  strands: "Strands",
  mini: "the Mini"
};
function nextGame() {
  if (!fiveDone()) return "five";
  if (!groupsDone()) return "groups";
  if (!S.strands.done) return "strands";
  if (!S.mini.done) return "mini";
  return "scores";
}
function squares(rows, kind) {
  var s = el("span", "sq");
  s.style.gridTemplateColumns = "repeat(".concat(kind === "g" ? 4 : 5, ", auto)");
  rows.forEach(function (r) {
    return _toConsumableArray(r).forEach(function (c) {
      return s.appendChild(el("i", kind === "g" ? "l" + c : c));
    });
  });
  return s;
}
function openResults(game) {
  var nodes = [];
  if (game === "five") {
    nodes.push(el("h2", null, fiveWon() ? PRAISE[fiveN() - 1] : hype(HYPE.lose, 7)));
    var p = el("p", "sub");
    p.append(document.createTextNode(fiveWon() ? "You got it in ".concat(fiveN(), " of 6. The word was ") : "Out of guesses. The word was "), el("span", "answer", ANSWER), document.createTextNode("."));
    nodes.push(p);
    var pv = el("div", "preview");
    pv.appendChild(squares(fiveSummary().rows, "f"));
    nodes.push(pv);
  } else if (game === "groups") {
    nodes.push(el("h2", null, groupsWon() ? S.groups.mistakes ? hype(HYPE.win, 11) : hype(HYPE.perfect, 12) : hype(HYPE.lose, 13)));
    nodes.push(el("p", "sub", groupsWon() ? "All four groups with ".concat(S.groups.mistakes, " mistake").concat(S.groups.mistakes === 1 ? "" : "s", ".") : "You ran out of mistakes. The groups are shown on the board."));
    var _pv = el("div", "preview");
    _pv.appendChild(squares(S.groups.history, "g"));
    nodes.push(_pv);
  } else if (game === "strands") {
    var h = S.strands.hints.length;
    nodes.push(el("h2", null, h ? hype(HYPE.win, 21) : hype(HYPE.perfect, 22)));
    nodes.push(el("p", "sub", "Your time: ".concat(fmtTime(S.strands.el)).concat(h ? " with ".concat(h, " hint").concat(h > 1 ? "s" : "") : ", no hints", ". The spangram was ").concat(SP.w[0][0], ".")));
  } else {
    nodes.push(el("h2", null, S.mini.el < 60 ? hype(HYPE.fast, 31) : hype(HYPE.win, 32)));
    nodes.push(el("p", "sub", "Your time: ".concat(fmtTime(S.mini.el)).concat(S.mini.checked ? " (with a check)" : "")));
  }
  var post = el("p", "postline");
  nodes.push(post);
  var n = nextGame();
  var go = el("button", "pill solid", n === "scores" ? "See the scoreboard" : "Play " + GAME_NAMES[n]);
  go.addEventListener("click", function () {
    closeModal();
    show(n);
  });
  var share = el("button", "pill", "Copy results");
  var ta = el("textarea", "copybox");
  ta.rows = 6;
  ta.readOnly = true;
  ta.hidden = true;
  share.addEventListener("click", function () {
    return copy(shareText(), ta);
  });
  nodes.push(go, share, ta);
  var dp = typeof denPairEl === "function" && denPairEl(game);
  if (dp) nodes.push(dp);
  openModal(nodes);
  refreshPostLines();
}
function openHelp(game) {
  var nodes = [];
  if (game === "five") {
    nodes.push(el("h2", null, "How to play Five"));
    var ul = el("ul", "rules");
    ["Guess the hidden five-letter word in 6 tries.", "Each guess must be a real word. Tap Enter to submit.", "The colors show how close you were:"].forEach(function (t) {
      return ul.appendChild(el("li", null, t));
    });
    nodes.push(ul);
    var lg = el("div", "legend");
    [["g", "W", "In the word and in the right spot"], ["y", "I", "In the word, wrong spot"], ["x", "U", "Not in the word"]].forEach(function (_ref3) {
      var _ref4 = _slicedToArray(_ref3, 3),
        c = _ref4[0],
        L = _ref4[1],
        t = _ref4[2];
      var d = el("div");
      var tile = el("div", "tile " + c, L);
      d.append(tile, el("span", null, t));
      lg.appendChild(d);
    });
    nodes.push(lg);
  } else if (game === "groups") {
    nodes.push(el("h2", null, "How to play Groups"));
    var _ul = el("ul", "rules");
    ["Find four groups of four words that share something.", "Tap four words, then Submit.", "Categories are tricky, so watch for words that seem to fit more than one group.", "Gold is the easiest group, then green, blue, and purple. You get 4 mistakes."].forEach(function (t) {
      return _ul.appendChild(el("li", null, t));
    });
    nodes.push(_ul);
  } else if (game === "strands") {
    nodes.push(el("h2", null, "How to play Strands"));
    var _ul2 = el("ul", "rules");
    ["Find the theme words hidden in the grid. Every letter is used exactly once.", "Drag across letters, or tap them one at a time and tap the last letter again (or Enter) to submit. Letters connect in any direction, including diagonally.", "Theme words turn blue. The spangram, which describes the theme and stretches from one side of the grid to the other, turns yellow.", "Hints are earned: every 3 non-theme words you find (4+ letters, real words) unlocks one. A hint outlines a theme word. Your time and hint count go on the scoreboard."].forEach(function (t) {
      return _ul2.appendChild(el("li", null, t));
    });
    nodes.push(_ul2);
  } else if (game === "mini") {
    nodes.push(el("h2", null, "How to play the Mini"));
    var _ul3 = el("ul", "rules");
    ["Fill the 5×5 grid using the Across and Down clues.", "Tap a square to pick it. Tap it again to switch between Across and Down.", "Tap the clue bar to see every clue.", "The clock pauses whenever you leave. Using Check marks your time with a *."].forEach(function (t) {
      return _ul3.appendChild(el("li", null, t));
    });
    nodes.push(_ul3);
  } else {
    nodes.push(el("h2", null, "Big Dawg Daily"));
    var _ul4 = el("ul", "rules");
    ["Four new puzzles every day at midnight: Five, Groups, Strands, and the Mini.", "Everyone gets the same puzzles, and every finished game posts to the scoreboard automatically.", "Tap 🎯 next to a friend on the scoreboard to throw shade based on how they actually did. Shade is earned: it unlocks when you're beating them today. A 🔒 means not yet; tap it to see how to earn it. Beating someone in the Den, Arcade or Sports earns shade too, right on the results screen. They can fire back, take the L, or clap back with an emoji.", "React to anyone's score with 😂 🔥 💀 👏 🤡, or tap + for the Big Dawg emote pack. Tap a name to see their trophies and your head-to-head record.", "Every game earns points for the weekly league. Yesterday's winner wears the 👑.", "Pick your name and PIN once. After that, open the app from the same link or home-screen icon and it remembers you. Your games save as you play, so you can leave and come back, or switch phones."].forEach(function (t) {
      return _ul4.appendChild(el("li", null, t));
    });
    nodes.push(_ul4);
  }
  openModal(nodes);
}
var EM = {
  g: "🟩",
  y: "🟨",
  x: "⬛"
};
var GEM = ["🟨", "🟩", "🟦", "🟪"];
function shareText() {
  var lines = ["Big Dawg Daily No. ".concat(NUM)];
  if (fiveDone()) {
    lines.push("", "Five ".concat(fiveWon() ? fiveN() : "X", "/6"));
    fiveRows().forEach(function (r) {
      return lines.push(_toConsumableArray(r).map(function (e) {
        return EM[e];
      }).join(""));
    });
  }
  if (groupsDone()) {
    lines.push("", "Groups ".concat(groupsWon() ? S.groups.mistakes === 0 ? "perfect" : S.groups.mistakes + " mistake" + (S.groups.mistakes === 1 ? "" : "s") : "X"));
    S.groups.history.forEach(function (r) {
      return lines.push(_toConsumableArray(r).map(function (l) {
        return GEM[+l];
      }).join(""));
    });
  }
  if (S.strands.done) lines.push("", "Strands ".concat(fmtTime(S.strands.el)).concat(S.strands.hints.length ? " (".concat(S.strands.hints.length, " hint").concat(S.strands.hints.length > 1 ? "s" : "", ")") : ""));
  if (S.mini.done) lines.push("", "Mini ".concat(fmtTime(S.mini.el)).concat(S.mini.checked ? "*" : ""));
  if (!fiveDone() && !groupsDone() && !S.mini.done && !S.strands.done) lines.push("", "Nothing finished yet today.");
  if (APP_URL) lines.push("", APP_URL);
  return lines.join("\n");
}
function copy(_x, _x2) {
  return _copy.apply(this, arguments);
}
function _copy() {
  _copy = _asyncToGenerator(_regenerator().m(function _callee(text, ta) {
    var okMsg,
      _args = arguments,
      _t;
    return _regenerator().w(function (_context) {
      while (1) switch (_context.p = _context.n) {
        case 0:
          okMsg = _args.length > 2 && _args[2] !== undefined ? _args[2] : "Copied";
          _context.p = 1;
          _context.n = 2;
          return navigator.clipboard.writeText(text);
        case 2:
          toast(okMsg);
          if (ta) ta.hidden = true;
          _context.n = 4;
          break;
        case 3:
          _context.p = 3;
          _t = _context.v;
          if (ta) {
            ta.value = text;
            ta.hidden = false;
            ta.focus();
            ta.select();
          }
          toast("Select the text and copy it", 2000);
        case 4:
          return _context.a(2);
      }
    }, _callee, null, [[1, 3]]);
  }));
  return _copy.apply(this, arguments);
}