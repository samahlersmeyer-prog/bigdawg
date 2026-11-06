function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
var APP_URL = "https://samahlersmeyer-prog.github.io/bigdawg/".indexOf("__") !== 0 ? "https://samahlersmeyer-prog.github.io/bigdawg/" : "__APP_URL__".indexOf("__") === 0 ? "" : "__APP_URL__";
var EPOCH = Date.UTC(2026, 9, 6);
var now = new Date();
var Y = now.getFullYear(),
  M = now.getMonth(),
  D = now.getDate();
var DAY = Math.round((Date.UTC(Y, M, D) - EPOCH) / 864e5);
var NUM = DAY + 1;
var KEY = "".concat(Y, "-").concat(String(M + 1).padStart(2, "0"), "-").concat(String(D).padStart(2, "0"));
var mod = function mod(a, n) {
  return (a % n + n) % n;
};
var ANSWER = ANSWERS[mod(DAY, ANSWERS.length)].toUpperCase();
var PUZ = PUZZLES[mod(DAY, PUZZLES.length)];
var LEVEL = {};
PUZ.forEach(function (g, i) {
  return g[1].forEach(function (w) {
    return LEVEL[w] = i;
  });
});
var CW = MINIS[mod(DAY, MINIS.length)];
var SP = STRANDS[mod(DAY, STRANDS.length)];
function rng(seed) {
  return function () {
    seed |= 0;
    seed = seed + 0x6D2B79F5 | 0;
    var t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
function shuffle(arr) {
  var r = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Math.random;
  var a = arr.slice();
  for (var i = a.length - 1; i > 0; i--) {
    var j = Math.floor(r() * (i + 1));
    var _ref = [a[j], a[i]];
    a[i] = _ref[0];
    a[j] = _ref[1];
  }
  return a;
}
var $ = function $(id) {
  return document.getElementById(id);
};
var el = function el(tag, cls, text) {
  var e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text != null) e.textContent = text;
  return e;
};
var DAWG_INK = "#2b1a10";
var DAWG_PARTS = {
  ears: '<path d="M16 18Q4 12 3 22Q4 28 11 25Z" fill="#8a5a3b"/><path d="M48 18Q60 12 61 22Q60 28 53 25Z" fill="#8a5a3b"/>',
  head: '<path d="M32 12C49 12 58 21 58 34C58 48 49 58 32 58C15 58 6 48 6 34C6 21 15 12 32 12Z" fill="#dca26a"/><path d="M28 18q4 2 8 0M29 22q3 1.5 6 0" fill="none" stroke-width="1.8"/>',
  patch: '<path d="M39 14C47 15 54 20 56 28C51 30 45 28 42 22Z" fill="#b97a48" stroke="none"/>',
  muzzle: '<path d="M32 34C45 34 54 40 54 47C54 54 47 58 41 56Q32 61 23 56C17 58 10 54 10 47C10 40 19 34 32 34Z" fill="#f5dcbc"/>',
  nose: '<path d="M26 39Q32 35 38 39Q36 44 32 44Q28 44 26 39Z" fill="' + DAWG_INK + '"/>',
  eyes: '<circle cx="22" cy="29" r="3.2" fill="' + DAWG_INK + '" stroke="none"/><circle cx="42" cy="29" r="3.2" fill="' + DAWG_INK + '" stroke="none"/>',
  wide: '<circle cx="22" cy="28" r="6" fill="#fff"/><circle cx="42" cy="28" r="6" fill="#fff"/><circle cx="22" cy="28.5" r="2.2" fill="' + DAWG_INK + '" stroke="none"/><circle cx="42" cy="28.5" r="2.2" fill="' + DAWG_INK + '" stroke="none"/>'
};
var DAWGS = {
  dawgW: {
    name: "W",
    face: '<path d="M12 25H52V30Q52 35 44 35Q37 35 35 29H29Q27 35 20 35Q12 35 12 30Z" fill="' + DAWG_INK + '"/><path d="M16 27h6" stroke="#fff" stroke-width="1.6"/><path d="M38 27h6" stroke="#fff" stroke-width="1.6"/><path d="M23 53Q32 50 41 53" fill="none"/><path d="M25 53l1.5-5l1.5 4M36 53l1.5-5l1.5 4" fill="#fff" stroke-width="1.6"/>'
  },
  dawgL: {
    name: "L",
    face: '<path d="M17 30Q22 26 27 30M37 30Q42 26 47 30" fill="none"/><path d="M19 32Q16 44 18 54" stroke="#5fb2ff" stroke-width="4" fill="none"/><path d="M45 32Q48 44 46 54" stroke="#5fb2ff" stroke-width="4" fill="none"/><path d="M25 53Q32 45 39 53Z" fill="' + DAWG_INK + '"/>'
  },
  dawgcope: {
    name: "cope",
    face: '<path d="M17 30Q22 25 27 30M37 30Q42 25 47 30" fill="none"/><path d="M22 47Q32 56 42 47Z" fill="#fff"/><path d="M27 48.5v3.5M32 49v4.5M37 48.5v3.5" stroke-width="1.5"/><path d="M48 34q2 5 0 7q-3-2 0-7z" fill="#5fb2ff" stroke-width="1.5"/>'
  },
  dawgsweat: {
    name: "sweat",
    face: DAWG_PARTS.wide + '<path d="M24 51q2-3 4 0t4 0t4 0t4 0" fill="none" stroke-width="2.2"/><path d="M53 13q4 7 1 10q-5-2-1-10z" fill="#5fb2ff" stroke-width="1.6"/><path d="M58 24q3 5 1 7q-4-1-1-7z" fill="#5fb2ff" stroke-width="1.6"/>'
  },
  dawgpog: {
    name: "pog",
    face: DAWG_PARTS.wide + '<path d="M15 19l9-3M49 19l-9-3" fill="none"/><ellipse cx="32" cy="51" rx="5" ry="6" fill="' + DAWG_INK + '"/>'
  },
  dawgpain: {
    name: "pain",
    face: '<path d="M17 30Q22 26 27 30M37 30Q42 26 47 30" fill="none"/><path d="M19 32Q15 44 17 55" stroke="#5fb2ff" stroke-width="4.5" fill="none"/><path d="M45 32Q49 44 47 55" stroke="#5fb2ff" stroke-width="4.5" fill="none"/><path d="M24 54Q32 44 40 54Z" fill="' + DAWG_INK + '"/><g transform="rotate(-22 9 18)"><path d="M3.5 28V14Q3.5 6 9 6Q14.5 6 14.5 14V28Z" fill="#dca26a"/><path d="M6.5 9v3M9 8.5v3.5M11.5 9v3" fill="none" stroke-width="1.5"/></g><g transform="rotate(22 55 18)"><path d="M49.5 28V14Q49.5 6 55 6Q60.5 6 60.5 14V28Z" fill="#dca26a"/><path d="M52.5 9v3M55 8.5v3.5M57.5 9v3" fill="none" stroke-width="1.5"/></g>'
  },
  dawgclown: {
    name: "clown",
    face: '<path d="M8 15q-6-4-2-10q4 2 6 4q0-6 6-6q0 5-2 8z" fill="#ff5d9e"/><path d="M56 15q6-4 2-10q-4 2-6 4q0-6-6-6q0 5 2 8z" fill="#5fb2ff"/><path d="M16 26l5-6l5 6l-5 6z" fill="#fff"/><path d="M38 26l5-6l5 6l-5 6z" fill="#fff"/>' + DAWG_PARTS.eyes + '<path d="M22 49Q32 58 42 49" fill="none" stroke="#e23b3b" stroke-width="3.2"/><circle cx="32" cy="40" r="6" fill="#e23b3b"/>'
  },
  dawgsus: {
    name: "sus",
    face: '<path d="M16 29h12" fill="none"/><path d="M36 20l12 3" fill="none"/><circle cx="42" cy="30" r="3.2" fill="' + DAWG_INK + '" stroke="none"/><path d="M24 53h16" fill="none"/><path d="M25 53l1.5-5l1.5 4M36 53l1.5-5l1.5 4" fill="#fff" stroke-width="1.6"/>'
  },
  dawgskull: {
    name: "dead",
    face: '<path d="M18 25l8 8M26 25l-8 8M38 25l8 8M46 25l-8 8" fill="none"/><path d="M24 49h14" fill="none"/><path d="M33 49v5q0 4 4 4t4-4v-5" fill="#ff7aa8"/>'
  }
};
var DAWG_KEYS = Object.keys(DAWGS);
var isDawg = function isDawg(c) {
  return !!DAWGS[String(c || "").replace(/:/g, "")];
};
function dawgSvg(code, px) {
  var d = DAWGS[String(code).replace(/:/g, "")];
  if (!d) return "";
  var nose = code.indexOf("clown") >= 0 ? "" : DAWG_PARTS.nose;
  var eyes = /dawg(W|L|cope|sweat|pog|pain|clown|sus|skull)/.test(code) ? "" : DAWG_PARTS.eyes;
  return "<svg class=\"dawg\" viewBox=\"0 0 64 64\" width=\"".concat(px, "\" height=\"").concat(px, "\" aria-hidden=\"true\"><g stroke=\"").concat(DAWG_INK, "\" stroke-width=\"2.6\" stroke-linejoin=\"round\" stroke-linecap=\"round\">").concat(DAWG_PARTS.ears).concat(DAWG_PARTS.head).concat(DAWG_PARTS.patch).concat(DAWG_PARTS.muzzle).concat(nose).concat(eyes).concat(d.face, "</g></svg>");
}
function emo(code) {
  var px = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 22;
  var s = el("span", "emo");
  if (isDawg(code)) {
    s.innerHTML = dawgSvg(code, px);
    s.title = code;
    s.setAttribute("aria-label", code);
  } else s.textContent = code;
  return s;
}
var store = {
  get: function get(k) {
    try {
      var v = localStorage.getItem(k);
      return v ? JSON.parse(v) : null;
    } catch (e) {
      return null;
    }
  },
  set: function set(k, v) {
    try {
      localStorage.setItem(k, JSON.stringify(v));
    } catch (e) {}
  },
  del: function del(k) {
    try {
      localStorage.removeItem(k);
    } catch (e) {}
  }
};
var hasServer = function hasServer() {
  return !!(window.google && google.script && google.script.run);
};
var FAST_URL = "https://samahlersmeyer-prog.github.io/bigdawg/".indexOf("__") === 0 ? "" : "https://samahlersmeyer-prog.github.io/bigdawg/";
var fastLink = function fastLink() {
  var id = "";
  try {
    var m = JSON.parse(localStorage.getItem("bdd:me") || "null");
    id = m && m.id || "";
  } catch (e) {}
  try {
    if (me && me.id) id = me.id;
  } catch (e) {}
  return FAST_URL + (id ? "?p=" + encodeURIComponent(id) : "");
};
if (FAST_URL && window.google && google.script && google.script.run) {
  var a = document.getElementById("fast-splash");
  if (a) {
    a.href = fastLink();
    a.hidden = false;
  }
}
var SERVER_URL = "https://script.google.com/macros/s/AKfycbxPfcr0_vWObUwDG5-ZjuVAmiCNNFqTXo38-YpkEPfOcsEq6iehAkjhtPNVf0Az_rh_/exec".indexOf("__") === 0 ? "" : "https://script.google.com/macros/s/AKfycbxPfcr0_vWObUwDG5-ZjuVAmiCNNFqTXo38-YpkEPfOcsEq6iehAkjhtPNVf0Az_rh_/exec";
var STATIC = !hasServer() && !!SERVER_URL;
function callServer(fn) {
  for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }
  if (hasServer()) {
    window.__crew = crewSel;
    window.__me = me ? me.id : "";
  }
  if (hasServer()) return new Promise(function (resolve, reject) {
    var _google$script$run$wi;
    return (_google$script$run$wi = google.script.run.withSuccessHandler(resolve).withFailureHandler(reject))[fn].apply(_google$script$run$wi, args);
  });
  if (!SERVER_URL) return Promise.reject(new Error("offline"));
  var ctl = window.AbortController ? new AbortController() : null;
  var t = ctl && setTimeout(function () {
    return ctl.abort();
  }, 25000);
  return fetch(SERVER_URL, {
    method: "POST",
    headers: {
      "Content-Type": "text/plain;charset=utf-8"
    },
    body: JSON.stringify({
      fn: fn,
      args: args,
      crew: crewSel,
      me: me ? me.id : ""
    }),
    redirect: "follow",
    signal: ctl && ctl.signal
  }).then(function (r) {
    return r.json();
  }).then(function (j) {
    if (t) clearTimeout(t);
    if (!j || !j.ok) throw new Error(j && j.error || "offline");
    return j.result;
  })["catch"](function (e) {
    if (t) clearTimeout(t);
    throw e && e.name === "AbortError" ? new Error("offline") : e;
  });
}
var PRIME = null;
function primeBoot() {
  if (!me) return;
  var p = callServer("bootData", me.id, KEY);
  var pick = function pick(k) {
    return p.then(function (r) {
      if (!r || !(k in r) || r[k] === null && k !== "progress") throw new Error("miss");
      return r[k];
    });
  };
  PRIME = {
    loadProgress: pick("progress"),
    getBoard: pick("board"),
    getShadeState: pick("shade"),
    getStats: pick("stats")
  };
  p.then(function (r) {
    if (r && r.crews) setCrews(r.crews, r.crew);
  })["catch"](function () {});
  Object.values(PRIME).forEach(function (x) {
    return x["catch"](function () {});
  });
}
var API = function API(fn) {
  for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
    args[_key2 - 1] = arguments[_key2];
  }
  if (PRIME && PRIME[fn]) {
    var pr = PRIME[fn];
    delete PRIME[fn];
    return pr["catch"](function () {
      return callServer.apply(void 0, [fn].concat(args));
    });
  }
  return callServer.apply(void 0, [fn].concat(args));
};
var errMsg = function errMsg(e) {
  return e && e.message && /is not a function/.test(e.message) ? "This needs the newest server update. Ask Sam to deploy a new version." : e && e.message && e.message !== "offline" ? e.message.replace(/^Exception:\s*/, "") : "Couldn't reach the scoreboard. Check your connection and try again.";
};
function getUrlParams() {
  return new Promise(function (res) {
    try {
      if (hasServer() && google.script.url) google.script.url.getLocation(function (loc) {
        return res(loc && loc.parameter || {});
      });else res(Object.fromEntries(new URLSearchParams(location.search)));
    } catch (e) {
      res({});
    }
    setTimeout(function () {
      return res({});
    }, 2500);
  });
}
function rememberInUrl(id) {
  try {
    if (hasServer() && google.script.history) google.script.history.replace(null, {
      p: id
    });else if (STATIC) history.replaceState(null, "", location.pathname + "?p=" + encodeURIComponent(id));
  } catch (e) {}
}
function forgetUrl() {
  try {
    if (hasServer() && google.script.history) google.script.history.replace(null, {});else if (STATIC) history.replaceState(null, "", location.pathname);
  } catch (e) {}
}
var skey = function skey() {
  return "bdd2:" + KEY + ":" + (me ? me.id : "anon");
};
var S = null,
  me = null;
var crews = store.get("bdd:crews") || [],
  crewSel = store.get("bdd:crewSel");
if (typeof crewSel !== "string") crewSel = "";
try {
  var inv = new URLSearchParams(location.search).get("crew");
  if (inv) store.set("bdd:pendcrew", inv.toUpperCase());
} catch (e) {}
var PID = [ANSWER, PUZ[0][0], CW.a[0], SP.t].join("|");
var freshState = function freshState() {
  return {
    v: 2,
    pid: PID,
    five: {
      guesses: []
    },
    groups: {
      order: shuffle(PUZ.flatMap(function (g) {
        return g[1];
      }), rng(DAY * 7919 + 13)),
      solved: [],
      history: [],
      tried: [],
      mistakes: 0
    },
    mini: {
      fill: Array(25).fill(""),
      el: 0,
      started: false,
      done: false,
      checked: false,
      wrong: []
    },
    strands: {
      g: SP.g,
      found: [],
      hints: [],
      bonus: [],
      el: 0,
      started: false,
      done: false
    }
  };
};
function fixGames(st) {
  var f = freshState();
  GAMES.forEach(function (g) {
    if (!st[g] || g === "strands" && st[g].g !== SP.g) st[g] = f[g];
  });
  return st;
}
var syncBusy = false,
  syncDirty = false,
  syncRetry = null;
function save() {
  if (S && S.five && S.five.guesses && (S.five.guesses.includes(ANSWER) || S.five.guesses.length >= 6)) S.five.fin = true;
  store.set(skey(), S);
  if (!me) return;
  syncDirty = true;
  pumpSync();
}
function pumpSync() {
  if (syncBusy || !syncDirty || !me || !S) return;
  syncBusy = true;
  syncDirty = false;
  clearTimeout(syncRetry);
  API("saveProgress", me.id, KEY, JSON.stringify(S)).then(function () {
    syncBusy = false;
    pumpSync();
  })["catch"](function () {
    syncBusy = false;
    syncDirty = true;
    syncRetry = setTimeout(pumpSync, 5000);
  });
}
var GAMES = ["five", "groups", "mini", "strands"];
function gameRank(g, x) {
  if (!x) return -1;
  if (g === "five") return (x.fin || (x.guesses || []).includes(ANSWER) || (x.guesses || []).length >= 6 ? 2000 : x.locked ? 1000 : 0) + (x.guesses || []).length;
  if (g === "groups") return ((x.solved || []).length === 4 || x.mistakes >= 4 ? 1000 : 0) + (x.history || []).length;
  if (g === "strands" && x.g !== SP.g) return -1;
  var done = x.done ? 1e9 : 0,
    el = Number(x.el) || 0;
  if (g === "mini") return done + (x.fill || []).filter(Boolean).length * 1e5 + (x.started ? 1 : 0) + el / 1e4;
  return done + ((x.found || []).length + (x.hints || []).length) * 1e5 + (x.started ? 1 : 0) + el / 1e4;
}
function mergeState(a, b) {
  var ok = function ok(x) {
    return x && x.v === 2 && x.pid === PID;
  };
  if (!ok(a)) return ok(b) ? b : null;
  if (!ok(b)) return a;
  var out = {
    v: 2,
    pid: PID
  };
  GAMES.forEach(function (g) {
    out[g] = gameRank(g, a[g]) >= gameRank(g, b[g]) ? a[g] : b[g];
  });
  return out;
}
var toastT;
function toast(msg) {
  var ms = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1400;
  var t = $("toast");
  t.textContent = msg;
  t.hidden = false;
  clearTimeout(toastT);
  toastT = setTimeout(function () {
    return t.hidden = true;
  }, ms);
}
var modalOnClose = null;
function openModal(nodes, onClose) {
  var body = $("modal-body");
  body.innerHTML = "";
  body.append.apply(body, _toConsumableArray(nodes.filter(Boolean)));
  $("modal").hidden = false;
  modalOnClose = onClose || null;
  syncTimer();
}
function closeModal() {
  $("modal").hidden = true;
  var f = modalOnClose;
  modalOnClose = null;
  syncTimer();
  if (f) f();
  setTimeout(maybeServe, 400);
}
$("modal-close").addEventListener("click", closeModal);
$("modal").addEventListener("click", function (e) {
  if (e.target === $("modal")) closeModal();
});
var VIEWS = ["home", "five", "groups", "strands", "mini", "scores", "zoomies", "snake", "fetch", "arcade", "sports", "den", "game"];
var active = "home",
  lastGame = "home";
function show(name) {
  if (name === "back") name = lastGame;
  if (name !== "scores") lastGame = name;
  active = name;
  VIEWS.forEach(function (v) {
    return $("v-" + v).hidden = v !== name;
  });
  if (name === "home") renderHome();
  if (name === "scores") scoresShown();
  if (name === "mini") miniShown();
  if (name === "strands") strandsShown();
  if (name === "five") renderBoard();
  if (name === "groups") renderGroups();
  if (name === "zoomies") zShown();else zHidden();
  if (name === "snake") sShown();else sHidden();
  if (name === "fetch") fShown();else fHidden();
  if (name === "game") gShown();else if (typeof gHidden === "function") gHidden();
  if (name === "arcade") renderArcHub("arcade");
  if (name === "sports") renderArcHub("sports");
  if (name === "den") renderArcHub("den");
  syncTimer();
  try {
    sessionStorage.setItem("bdd:view", name);
  } catch (e) {}
  setTimeout(maybeServe, 350);
}
document.addEventListener("click", function (e) {
  var go = e.target.closest("[data-go]");
  if (go) {
    show(go.dataset.go);
    return;
  }
  var h = e.target.closest("[data-help]");
  if (h) {
    openHelp(h.dataset.help);
    return;
  }
  var r = e.target.closest("[data-results]");
  if (r) {
    openResults(r.dataset.results);
    return;
  }
});