function _regenerator() { var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function newId() {
  var a = "abcdefghijkmnpqrstuvwxyz23456789";
  var s = "";
  var r = new Uint32Array(16);
  crypto.getRandomValues(r);
  r.forEach(function (x) {
    return s += a[x % a.length];
  });
  return s;
}
function splashMode(mode) {
  $("splash").hidden = mode === "none";
  $("splash-load").hidden = mode !== "load";
  $("who").hidden = mode !== "who";
  $("pin-form").hidden = mode !== "pin";
  $("join-form").hidden = mode !== "join";
  $("confirm").hidden = mode !== "confirm";
}
function signedIn(r) {
  setMe(r);
  afterIdentity();
}
var whoList = [],
  pinFor = null;
function showWho() {
  splashMode("load");
  return API("listPlayers").then(function (list) {
    whoList = list || [];
    if (!whoList.length) {
      showJoin();
      return;
    }
    $("who-q").value = "";
    drawWho();
    splashMode("who");
    setTimeout(function () {
      return $("who-q").focus();
    }, 60);
  })["catch"](function () {
    return showJoin();
  });
}
function drawWho() {
  var box = $("who-list");
  box.innerHTML = "";
  var q = $("who-q").value.trim().toLowerCase();
  var all = whoList.slice().sort(function (a, b) {
    return a.name.localeCompare(b.name);
  });
  var few = all.length <= 6;
  var hits = q ? all.filter(function (p) {
    return p.name.toLowerCase().startsWith(q);
  }).concat(all.filter(function (p) {
    return !p.name.toLowerCase().startsWith(q) && p.name.toLowerCase().includes(q);
  })) : few ? all : [];
  hits.slice(0, 8).forEach(function (p) {
    var b = el("button", null, p.name);
    b.type = "button";
    b.addEventListener("click", function () {
      return showPin(p);
    });
    box.appendChild(b);
  });
  $("who-hint").textContent = q && !hits.length ? "No one by that name yet. Tap \u201CI'm new here\u201D below." : !q && !few ? "".concat(all.length, " players. Type your name to find yours.") : "";
}
$("who-q").addEventListener("input", drawWho);
$("who-q").addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    var b = $("who-list").querySelector("button");
    if (b) b.click();
  }
});
function showPin(p) {
  pinFor = p;
  $("pin-q").textContent = p.hasPin ? "Hi ".concat(p.name, "! Enter your PIN") : "Hi ".concat(p.name, "! Pick a 4-digit PIN");
  $("pin-sub").textContent = p.hasPin ? "Forgot it? Ask Sam to clear it on the Players tab." : "You'll use it if the app ever forgets you. It keeps anyone else from playing as you.";
  $("pin-msg").textContent = "";
  $("pin-in").value = "";
  splashMode("pin");
  setTimeout(function () {
    return $("pin-in").focus();
  }, 50);
}
function showJoin() {
  splashMode("join");
  $("join-back").hidden = !whoList.length;
  setTimeout(function () {
    return $("join-name").focus();
  }, 50);
}
$("who-new").addEventListener("click", showJoin);
$("pin-back").addEventListener("click", showWho);
$("join-back").addEventListener("click", showWho);
var goodPin = function goodPin(v) {
  return /^\d{4}$/.test(v);
};
$("pin-form").addEventListener("submit", function (ev) {
  ev.preventDefault();
  var v = $("pin-in").value.trim(),
    msg = $("pin-msg");
  if (!goodPin(v)) {
    msg.textContent = "Your PIN is 4 numbers.";
    return;
  }
  $("pin-go").disabled = true;
  msg.textContent = "Checking…";
  API("claimPlayer", pinFor.id, v).then(signedIn)["catch"](function (e) {
    msg.textContent = errMsg(e);
    $("pin-in").value = "";
  })["finally"](function () {
    $("pin-go").disabled = false;
  });
});
$("join-form").addEventListener("submit", function (ev) {
  ev.preventDefault();
  var v = $("join-name").value.trim(),
    pin = $("join-pin").value.trim(),
    msg = $("join-msg");
  if (!v) {
    msg.textContent = "Type a name your friends will recognize.";
    return;
  }
  if (!goodPin(pin)) {
    msg.textContent = "Pick a PIN: 4 numbers.";
    return;
  }
  $("join-go").disabled = true;
  msg.textContent = "Joining…";
  API("register", newId(), v, pin).then(signedIn)["catch"](function (e) {
    msg.textContent = errMsg(e);
  })["finally"](function () {
    $("join-go").disabled = false;
  });
});
function setMe(r) {
  me = {
    id: r.id,
    name: r.name
  };
  store.set("bdd:me", me);
  rememberInUrl(me.id);
}
function confirmWho(who) {
  splashMode("confirm");
  $("confirm-q").textContent = "Welcome back! Are you ".concat(who.name, "?");
  $("confirm-yes").textContent = "Yes, I'm ".concat(who.name);
  return new Promise(function (res) {
    $("confirm-yes").onclick = function () {
      return res(true);
    };
    $("confirm-no").onclick = function () {
      forgetUrl();
      res(false);
    };
  });
}
function loadState() {
  return _loadState.apply(this, arguments);
}
function _loadState() {
  _loadState = _asyncToGenerator(_regenerator().m(function _callee() {
    var local, remote, r, st, fresh, _t;
    return _regenerator().w(function (_context) {
      while (1) switch (_context.p = _context.n) {
        case 0:
          local = store.get(skey());
          remote = null;
          if (!me) {
            _context.n = 4;
            break;
          }
          _context.p = 1;
          _context.n = 2;
          return API("loadProgress", me.id, KEY);
        case 2:
          r = _context.v;
          if (r) remote = JSON.parse(r);
          _context.n = 4;
          break;
        case 3:
          _context.p = 3;
          _t = _context.v;
        case 4:
          st = mergeState(local, remote) || freshState();
          fresh = freshState();
          GAMES.forEach(function (g) {
            if (!st[g]) st[g] = fresh[g];
          });
          return _context.a(2, st);
      }
    }, _callee, null, [[1, 3]]);
  }));
  return _loadState.apply(this, arguments);
}
var started = false;
function afterIdentity() {
  return _afterIdentity.apply(this, arguments);
}
function _afterIdentity() {
  _afterIdentity = _asyncToGenerator(_regenerator().m(function _callee2() {
    var local, ok, _st, fresh, cb, cs, st;
    return _regenerator().w(function (_context2) {
      while (1) switch (_context2.n) {
        case 0:
          local = store.get(skey());
          if (!me) {
            _context2.n = 1;
            break;
          }
          primeBoot();
          ok = local && local.v === 2 && local.pid === PID;
          _st = ok ? local : freshState(), fresh = freshState();
          GAMES.forEach(function (g) {
            if (!_st[g]) _st[g] = fresh[g];
          });
          S = _st;
          store.set(skey(), S);
          cb = store.get("bdd:board");
          if (cb && cb.k === KEY && cb.c === crewSel && !board) board = cb.b;
          cs = store.get("bdd:stats");
          if (cs && cs.k === KEY && cs.c === crewSel && !stats) stats = cs.s;
          joinPending();
          if (!started) start();else {
            renderBoard();
            colorKeyboard();
            renderGroups();
            stPath = [];
            show(active);
          }
          splashMode("none");
          refreshBoard();
          API("loadProgress", me.id, KEY).then(function (r) {
            if (!r) return;
            var rem = JSON.parse(r),
              merged = mergeState(S, rem);
            if (merged && merged.five && merged.five.guesses && merged.five.guesses.length && rem && rem.five && !rem.five.fin && fiveDoneByGuesses()) save();
            if (!merged || JSON.stringify(merged) === JSON.stringify(S)) return;
            GAMES.forEach(function (g) {
              if (!merged[g]) merged[g] = S[g];
            });
            S = merged;
            store.set(skey(), S);
            save();
            renderBoard();
            colorKeyboard();
            renderGroups();
            show(active);
          })["catch"](function () {});
          return _context2.a(2);
        case 1:
          splashMode("load");
          _context2.n = 2;
          return loadState();
        case 2:
          st = _context2.v;
          S = st;
          store.set(skey(), S);
          save();
          if (!started) start();else {
            renderBoard();
            colorKeyboard();
            renderGroups();
            stPath = [];
            show(active);
          }
          splashMode("none");
          refreshBoard();
        case 3:
          return _context2.a(2);
      }
    }, _callee2);
  }));
  return _afterIdentity.apply(this, arguments);
}
function start() {
  started = true;
  buildKeyboard($("keyboard"), true);
  buildKeyboard(miniKb, false);
  colorKeyboard();
  renderBoard();
  renderGroups();
  var v = "home";
  try {
    var s = sessionStorage.getItem("bdd:view");
    if (VIEWS.includes(s)) v = s;
  } catch (e) {}
  show(v);
}
function boot() {
  return _boot.apply(this, arguments);
}
function _boot() {
  _boot = _asyncToGenerator(_regenerator().m(function _callee3() {
    var params, who, _t2, _t3;
    return _regenerator().w(function (_context3) {
      while (1) switch (_context3.p = _context3.n) {
        case 0:
          me = store.get("bdd:me");
          if (me) {
            _context3.n = 9;
            break;
          }
          _context3.n = 1;
          return getUrlParams();
        case 1:
          params = _context3.v;
          if (!params.p) {
            _context3.n = 8;
            break;
          }
          _context3.p = 2;
          _context3.n = 3;
          return API("whoami", params.p);
        case 3:
          who = _context3.v;
          _t2 = who;
          if (!_t2) {
            _context3.n = 5;
            break;
          }
          _context3.n = 4;
          return confirmWho(who);
        case 4:
          _t2 = _context3.v;
        case 5:
          if (!_t2) {
            _context3.n = 6;
            break;
          }
          setMe(who);
        case 6:
          _context3.n = 8;
          break;
        case 7:
          _context3.p = 7;
          _t3 = _context3.v;
        case 8:
          _context3.n = 10;
          break;
        case 9:
          rememberInUrl(me.id);
        case 10:
          if (me) {
            _context3.n = 11;
            break;
          }
          if (!(hasServer() || STATIC)) {
            _context3.n = 11;
            break;
          }
          showWho();
          return _context3.a(2);
        case 11:
          _context3.n = 12;
          return afterIdentity();
        case 12:
          return _context3.a(2);
      }
    }, _callee3, null, [[2, 7]]);
  }));
  return _boot.apply(this, arguments);
}
boot();