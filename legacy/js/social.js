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
function isMate(id) {
  return !!me && (id === me.id || crews.some(function (c) {
    return (c.ids || []).includes(id);
  }));
}
function crewName(c) {
  var x = crews.find(function (k) {
    return k.id === c;
  });
  return x ? x.name : "Everyone";
}
function setCrews(list, cur) {
  crews = list || [];
  store.set("bdd:crews", crews);
  if (crewSel === "" || crewSel !== "all" && !crews.some(function (c) {
    return c.id === crewSel;
  })) {
    crewSel = cur && cur !== "all" && crews.some(function (c) {
      return c.id === cur;
    }) ? cur : crews[0] ? crews[0].id : "all";
    store.set("bdd:crewSel", crewSel);
  }
  renderCrewBar();
}
function renderCrewBar() {
  var bar = $("crewbar");
  if (!bar) return;
  bar.innerHTML = "";
  bar.hidden = !me;
  var chip = function chip(id, label) {
    var b = el("button", crewSel === id ? "on" : "", label);
    b.addEventListener("click", function () {
      return switchCrew(id);
    });
    bar.appendChild(b);
  };
  crews.forEach(function (c) {
    return chip(c.id, c.name);
  });
  chip("all", "🌎 Everyone");
  var nreq = crews.reduce(function (a, c) {
    return a + (c.reqs || []).length;
  }, 0);
  var add = el("button", "add", nreq ? "\uD83D\uDE4B ".concat(nreq) : crews.length ? "＋" : "＋ Join a crew");
  add.setAttribute("aria-label", "Manage crews");
  add.addEventListener("click", openCrews);
  bar.appendChild(add);
  if ($("invite-link") && APP_URL) $("invite-link").textContent = inviteUrl();
  var n = $("crew-note");
  if (n) n.textContent = crews.length ? "You're in ".concat(crews.map(function (c) {
    return c.name;
  }).join(", "), ". Each crew has its own scoreboard, weekly league and champ.") : "You're not in a crew yet. Start one or join with a code to get your own scoreboard, league and champ.";
}
function switchCrew(id) {
  if (id === crewSel) return;
  crewSel = id;
  store.set("bdd:crewSel", id);
  board = null;
  stats = null;
  statsAt = 0;
  allTime = null;
  arcade = null;
  PRIME = null;
  renderCrewBar();
  if (active === "scores") renderScores();
  refreshBoard();
  refreshStats();
  refreshArcade();
  if (document.querySelector('#sc-tabs [data-tab="week"].on')) loadAllTime();
}
function crewLink(c) {
  var base = APP_URL || location.origin + location.pathname;
  return base + (base.includes("?") ? "&" : "?") + "crew=" + c.code;
}
function crewCall(fn) {
  for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }
  return API.apply(void 0, [fn, me.id].concat(args)).then(function (r) {
    setCrews(r.crews);
    if (r.crew) switchCrew(r.crew);
    return r;
  });
}
function openCrews() {
  if (!me) return;
  var nodes = [el("h2", null, "Crews"), el("p", "sub", "Invite-only groups. Each crew gets its own scoreboard, weekly league, crown and champ. Everyone still sees the same puzzles.")];
  crews.forEach(function (c) {
    var row = el("div", "crewrow");
    var hd = el("b", null, c.name + (crewSel === c.id ? "  ✓" : ""));
    var code = el("span", "crewcode", c.code);
    var sm = el("small");
    sm.append("".concat(c.n, " member").concat(c.n === 1 ? "" : "s", ": ").concat(c.members.join(", "), ". Code "), code);
    var btns = el("div", "inrow");
    var inv = el("button", "pill solid", "Copy invite link");
    inv.addEventListener("click", function () {
      return copy("Join my crew \"".concat(c.name, "\" on Big Dawg Daily: ").concat(crewLink(c)), null, "Invite copied. Text it to your people.");
    });
    var view = el("button", "pill", "Show scoreboard");
    view.addEventListener("click", function () {
      closeModal();
      switchCrew(c.id);
      show("scores");
    });
    var leave = el("button", "pill", "Leave");
    leave.addEventListener("click", function () {
      if (leave.dataset.sure) {
        crewCall("leaveCrew", c.id).then(function () {
          if (crewSel === c.id) switchCrew(crews[0] ? crews[0].id : "all");
          openCrews();
        })["catch"](function (e) {
          return toast(errMsg(e), 2400);
        });
      } else {
        leave.dataset.sure = 1;
        leave.textContent = "Tap again to leave";
      }
    });
    btns.append(inv, view, leave);
    row.append(hd, sm, btns);
    (c.reqs || []).forEach(function (q) {
      var rq = el("div", "crewreq");
      rq.append(el("small", null, "\uD83D\uDE4B ".concat(q.name, " wants in")), joinButtons(q.id, q.name, c.name));
      row.appendChild(rq);
    });
    if (c.owner && c.people) {
      var mg = el("details", "crewown");
      mg.append(el("summary", null, "👑 You own this crew: manage members"));
      var list = el("div", "chips");
      c.people.filter(function (x) {
        return x.id !== me.id;
      }).forEach(function (x) {
        var ch = el("button", "chip", x.name + "  ✕");
        ch.addEventListener("click", function () {
          if (!ch.dataset.sure) {
            ch.dataset.sure = 1;
            ch.textContent = "Remove ".concat(x.name, "?");
            ch.classList.add("warn");
            return;
          }
          ch.disabled = true;
          API("removeFromCrew", me.id, c.id, x.id).then(function (r) {
            setCrews(r.crews);
            toast("".concat(x.name, " is out of ").concat(c.name, "."), 2000);
            ch.remove();
            if (crewSel === c.id) switchCrew("all"), switchCrew(c.id);
          })["catch"](function (e) {
            ch.disabled = false;
            toast(errMsg(e), 2400);
          });
        });
        list.appendChild(ch);
      });
      var tools = el("div", "inrow");
      var rn = el("button", "pill", "Rename");
      rn.addEventListener("click", function () {
        var v = prompt("New crew name", c.name);
        if (v && v.trim()) API("renameCrew", me.id, c.id, v.trim()).then(function (r) {
          setCrews(r.crews);
          openCrews();
        })["catch"](function (e) {
          return toast(errMsg(e), 2400);
        });
      });
      var nc = el("button", "pill", "New code");
      nc.addEventListener("click", function () {
        if (!nc.dataset.sure) {
          nc.dataset.sure = 1;
          nc.textContent = "Old links stop working. Tap again";
          return;
        }
        API("newCrewCode", me.id, c.id).then(function (r) {
          setCrews(r.crews);
          toast("New code made. Old invite links no longer work.", 2400);
          openCrews();
        })["catch"](function (e) {
          return toast(errMsg(e), 2400);
        });
      });
      tools.append(rn, nc);
      var af = el("div", "crewform"),
        ai = el("input"),
        ares = el("div", "chips");
      ai.placeholder = "Add someone: type a name";
      ai.addEventListener("input", function () {
        var q = ai.value.trim().toLowerCase();
        ares.innerHTML = "";
        if (!q) return;
        (window.__allPlayers ? Promise.resolve(window.__allPlayers) : API("listPlayers").then(function (l) {
          return window.__allPlayers = l;
        })).then(function (list) {
          if (ai.value.trim().toLowerCase() !== q) return;
          ares.innerHTML = "";
          list.filter(function (x) {
            return !(c.ids || []).includes(x.id) && x.name.toLowerCase().includes(q);
          }).slice(0, 8).forEach(function (x) {
            var ch = el("button", "chip", "+ " + x.name);
            ch.addEventListener("click", function () {
              ch.replaceWith(addToCrewBtn(c.id, c.name, x.id, x.name, function () {
                return setTimeout(openCrews, 900);
              }));
            });
            ares.appendChild(ch);
          });
          if (!ares.children.length) ares.appendChild(el("small", null, "No one by that name outside the crew."));
        })["catch"](function () {});
      });
      af.appendChild(ai);
      mg.append(el("small", null, "Add someone who already plays:"), af, ares, el("small", null, "Tap a name, then tap again to remove them. Removed people can rejoin with the code, so tap New code if you need to lock it."), list, tools);
      row.appendChild(mg);
    }
    nodes.push(row);
  });
  var jf = el("div", "crewform"),
    ji = el("input");
  ji.placeholder = "Crew code";
  ji.maxLength = 8;
  ji.autocapitalize = "characters";
  var jb = el("button", "pill solid", "Join");
  jb.addEventListener("click", function () {
    if (!ji.value.trim()) return;
    crewCall("joinCrew", ji.value.trim()).then(function (r) {
      toast("You're in ".concat(r.name, " \uD83D\uDC36"), 2200);
      openCrews();
    })["catch"](function (e) {
      return toast(errMsg(e), 2600);
    });
  });
  jf.append(ji, jb);
  var cf = el("div", "crewform"),
    ci = el("input");
  ci.placeholder = "New crew name";
  ci.maxLength = 24;
  var cb = el("button", "pill", "Start");
  cb.addEventListener("click", function () {
    if (!ci.value.trim()) return;
    crewCall("createCrew", ci.value.trim()).then(function () {
      toast("Crew started. Copy the invite link and send it.", 2600);
      openCrews();
    })["catch"](function (e) {
      return toast(errMsg(e), 2600);
    });
  });
  cf.append(ci, cb);
  nodes.push(el("h3", null, "Join a crew"), jf, el("h3", null, "Start a crew"), cf);
  openModal(nodes);
}
function joinPending() {
  var code = store.get("bdd:pendcrew");
  if (!code || !me) return;
  store.del("bdd:pendcrew");
  API("joinCrew", me.id, code).then(function (r) {
    setCrews(r.crews);
    switchCrew(r.crew);
    toast("You joined ".concat(r.name, "! \uD83D\uDC36"), 2600);
  })["catch"](function (e) {
    return toast(errMsg(e), 2600);
  });
}
document.addEventListener("click", function (e) {
  if (e.target.closest("#crew-manage")) openCrews();
  if (e.target.closest("#wir-open")) openWeekReview();
});
renderCrewBar();
if (me) API("getCrews", me.id).then(function (l) {
  return setCrews(l);
})["catch"](function () {});
function weekKey() {
  var p = KEY.split("-").map(Number),
    d = new Date(p[0], p[1] - 1, p[2]);
  d.setDate(d.getDate() - (d.getDay() + 6) % 7);
  return "".concat(d.getFullYear(), "-").concat(String(d.getMonth() + 1).padStart(2, "0"), "-").concat(String(d.getDate()).padStart(2, "0"));
}
function showWeekReview(r) {
  if (!r || !r.podium || !r.podium.length) {
    toast("No league games last week.", 2000);
    return;
  }
  var fmtD = function fmtD(k) {
    return new Date(k + "T12:00:00").toLocaleDateString(undefined, {
      month: "short",
      day: "numeric"
    });
  };
  var box = el("div", "wir"),
    m = r.me,
    champ = r.podium[0];
  box.append(el("div", "kick", "Week in review \xB7 ".concat(fmtD(r.start), "\u2013").concat(fmtD(r.end).replace(/^[A-Za-z]+ /, "")).concat(r.crew ? " · " + r.crew : "")));
  box.append(el("h2", null, m && m.rank === 1 ? "You won the week! 🏆" : "\uD83C\uDFC6 ".concat(champ.name, " won the week")));
  var pod = el("div", "pod");
  [[1, "🥈", 70], [0, "🥇", 96], [2, "🥉", 54]].forEach(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 3),
      k = _ref2[0],
      md = _ref2[1],
      h = _ref2[2];
    var x = r.podium[k],
      d = el("div");
    if (x) {
      var bar = el("i", null, md);
      bar.style.height = h + "px";
      var nm = el("span", null, x.name);
      d.append(nm, el("small", null, x.pts + " pts"), bar);
    }
    pod.appendChild(d);
  });
  box.append(pod);
  if (m) {
    var yc = el("div", "card");
    yc.append(el("span", "lbl", "Your week"));
    yc.append(el("b", "big", "#".concat(m.rank, " of ").concat(r.players, " \xB7 ").concat(m.pts, " pts")), el("span", null, m.above ? "".concat(m.above.pts - m.pts, " pts behind ").concat(m.above.name, " for #").concat(m.rank - 1) : m.below ? "".concat(m.pts - m.below.pts, " pts ahead of ").concat(m.below.name) : "Top of the board."));
    var bars = el("div", "bars"),
      byD = {};
    (m.by || []).forEach(function (x) {
      return byD[x.d] = x;
    });
    var p = r.start.split("-").map(Number);
    ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].forEach(function (dn, i) {
      var dt = new Date(p[0], p[1] - 1, p[2] + i),
        dk = "".concat(dt.getFullYear(), "-").concat(String(dt.getMonth() + 1).padStart(2, "0"), "-").concat(String(dt.getDate()).padStart(2, "0")),
        x = byD[dk],
        v = x ? x.p : 0;
      var s = el("div"),
        e = el("em", x && x.k ? "in" : "");
      e.style.height = Math.max(4, v * 2.8) + "px";
      s.append(el("small", null, x ? String(v) : "–"), e, el("small", null, dn));
      bars.appendChild(s);
    });
    yc.append(bars, el("small", "sub", "Green = your best 5 days, the ones that counted"));
    box.append(yc);
    if (r.moment) {
      var mo = el("div", "card");
      mo.append(el("span", "lbl", "Your best moment"), el("span", "moment", r.moment));
      box.append(mo);
    }
  } else box.append(el("p", "sub", "You didn't play last week. This week's a fresh start."));
  if (r.awards && r.awards.length) {
    box.append(el("span", "lbl", "Awards"));
    var aw = el("div", "aw");
    r.awards.forEach(function (a) {
      var meta = AWARDS[a.key];
      if (!meta) return;
      var d = el("div"),
        h = el("b");
      h.append(emo(meta[0], 16), document.createTextNode(meta[1]));
      d.append(h, document.createTextNode("".concat((a.names || [a.name]).join(", "), " \xB7 ").concat(a.why)));
      aw.appendChild(d);
    });
    box.append(aw);
  }
  box.append(el("p", "sub", "".concat(r.players, " players \xB7 ").concat(r.games, " games played")));
  var go = el("button", "pill solid", "New week. Let's go 🐶");
  go.addEventListener("click", closeModal);
  var sh = el("button", "pill", "Share my week"),
    ta = el("textarea", "copybox");
  ta.rows = 5;
  ta.readOnly = true;
  ta.hidden = true;
  sh.addEventListener("click", function () {
    return copy(["Big Dawg Daily \xB7 week of ".concat(fmtD(r.start)).concat(r.crew ? " · " + r.crew : ""), r.podium.map(function (x, i) {
      return "".concat(["🏆", "🥈", "🥉"][i], " ").concat(x.name, " ").concat(x.pts);
    }).join("  "), m ? "Me: #".concat(m.rank, " of ").concat(r.players, " \xB7 ").concat(m.pts, " pts") : "", r.moment || "", APP_URL].filter(Boolean).join("\n"), ta);
  });
  openModal([box, go, sh, ta]);
}
function openWeekReview() {
  if (!me) return;
  API("getWeekReview", me.id, KEY).then(showWeekReview)["catch"](function (e) {
    return toast(errMsg(e), 2200);
  });
}
var wirAsked = "";
function maybeWeekReview() {
  if (!me || !crewSel) return;
  var k = "bdd:wir:" + weekKey() + ":" + crewSel;
  if (store.get(k) || wirAsked === k) return;
  wirAsked = k;
  API("getWeekReview", me.id, KEY).then(function (r) {
    if (!r || !r.podium || !r.podium.length || !(r.podium[0].pts > 0)) {
      store.set(k, 1);
      return;
    }
    var _tryShow = function tryShow(n) {
      if (active === "home" && $("modal").hidden && $("splash").hidden && !serving) {
        store.set(k, 1);
        showWeekReview(r);
      } else if (n < 40) setTimeout(function () {
        return _tryShow(n + 1);
      }, 3000);
    };
    _tryShow(0);
  })["catch"](function () {
    wirAsked = "";
  });
}
var board = null,
  postState = "init",
  writeChain = Promise.resolve(),
  synced = false;
function postStatus() {
  return {
    init: [false, "Connecting to the scoreboard…"],
    noname: [false, "Pick a name to post scores."],
    pending: [false, "Posting to the scoreboard…"],
    ok: [true, "✓ Posted to the scoreboard"],
    error: [false, "Couldn't post yet. It'll try again when you reopen the app."]
  }[postState];
}
function refreshPostLines() {
  var _postStatus = postStatus(),
    _postStatus2 = _slicedToArray(_postStatus, 2),
    ok = _postStatus2[0],
    t = _postStatus2[1];
  document.querySelectorAll(".postline").forEach(function (p) {
    p.textContent = t;
    p.classList.toggle("ok", ok);
  });
}
function setPost(s) {
  postState = s;
  refreshPostLines();
}
function todayEntry() {
  var t = {};
  if (fiveDone()) t.f = fiveSummary();
  if (groupsDone()) t.g = groupsSummary();
  if (S.mini.done) t.c = miniSummary();
  if (S.strands.done) t.s = strandsSummary();
  return t;
}
function pushResult() {
  if (!me) {
    setPost("noname");
    return;
  }
  var entry = todayEntry();
  if (!entry.f && !entry.g && !entry.c && !entry.s) return;
  setPost("pending");
  writeChain = writeChain.then(function () {
    return API("submit", me.id, KEY, entry).then(function (b) {
      var before = boardOrder(board);
      board = b;
      setPost("ok");
      announcePasses(before, boardOrder(b));
      refreshStats();
      if (active === "scores") renderScores();
    })["catch"](function () {
      return setPost("error");
    });
  });
}
function refreshBoard() {
  if (!me) return Promise.resolve();
  return API("getBoard", KEY, me.id).then(function (b) {
    board = b;
    store.set("bdd:board", {
      k: KEY,
      b: b,
      c: crewSel
    });
    if (!synced) {
      synced = true;
      var mine = (b.players.find(function (p) {
        return p.id === me.id;
      }) || {}).t || {};
      lockFromBoard(mine);
      if (fiveDone() && !mine.f || groupsDone() && !mine.g || S.mini.done && !mine.c || S.strands.done && !mine.s) pushResult();else if (mine.f || mine.g || mine.c || mine.s) setPost("ok");
    }
    if (active === "scores") renderScores();
    if (active === "home") renderHome();
    refreshShade();
    if (!statsAt || Date.now() - statsAt > 120000) refreshStats();
  })["catch"](function () {
    if (active === "scores") $("scores-note").textContent = "The scoreboard couldn't load. Tap refresh to try again.";
  });
}
function lockFromBoard(t) {
  var changed = false;
  if (t.f && !fiveDone()) {
    S.five.locked = {
      w: !!t.f.w,
      n: t.f.n,
      rows: t.f.rows.slice()
    };
    current = "";
    changed = true;
  }
  if (t.g && !groupsDone()) {
    S.groups.history = t.g.rows.slice();
    S.groups.mistakes = t.g.w ? t.g.m : 4;
    S.groups.solved = t.g.w ? [0, 1, 2, 3] : [];
    sel.clear();
    changed = true;
  }
  if (t.c && !S.mini.done) {
    TM.mini.start = null;
    Object.assign(S.mini, {
      started: true,
      done: true,
      el: t.c.t,
      checked: !!t.c.k,
      fill: SOL.map(function (x) {
        return x || "";
      }),
      wrong: []
    });
    changed = true;
  }
  if (t.s && !S.strands.done) {
    TM.strands.start = null;
    Object.assign(S.strands, {
      started: true,
      done: true,
      el: t.s.t,
      found: STW.map(function (x, k) {
        return k;
      }),
      hints: STW.map(function (x, k) {
        return k;
      }).slice(0, t.s.h || 0)
    });
    stPath = [];
    changed = true;
  }
  if (changed) {
    save();
    colorKeyboard();
    renderBoard();
    renderGroups();
    show(active);
  }
}
function stat(label, nodes) {
  var d = el("div", "stat");
  var v = el("span", "val");
  v.append.apply(v, _toConsumableArray(nodes));
  d.append(el("span", "lbl", label), v);
  return d;
}
var dash = function dash() {
  return el("span", "dim", "–");
};
var doneCount = function doneCount(x) {
  return (x.t.f ? 1 : 0) + (x.t.g ? 1 : 0) + (x.t.c ? 1 : 0) + (x.t.s ? 1 : 0);
};
var RANKPTS = {},
  PTSBY = {};
function rankCmp(a, b) {
  var cs = function cs(x) {
    return (x.t.c ? x.t.c.t + (x.t.c.k ? 30 : 0) : 5e8) + (x.t.s ? x.t.s.t + 30 * x.t.s.h : 5e8);
  };
  return (RANKPTS[b.id] || 0) - (RANKPTS[a.id] || 0) || doneCount(b) - doneCount(a) || cs(a) - cs(b);
}
var sortBoard = function sortBoard(list) {
  PTSBY = {};
  RANKPTS = dayPts(list, PTSBY);
  return list.sort(rankCmp);
};
var boardOrder = function boardOrder(b) {
  return b ? sortBoard(b.players.map(function (p) {
    return {
      id: p.id,
      name: p.name,
      t: p.t || {}
    };
  }).filter(function (x) {
    return doneCount(x);
  })) : [];
};
function renderScores() {
  $("scores-date").textContent = now.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric"
  }) + " · No. " + NUM;
  if (document.activeElement !== $("nick")) $("nick").value = me ? me.name : "";
  var body = $("scores-body");
  if (!board) {
    $("scores-note").textContent = "Loading the scoreboard…";
    return;
  }
  var list = board.players.map(function (p) {
    return {
      id: p.id,
      name: p.name,
      t: p.t || {},
      s: p.s || 0,
      z: !!p.z
    };
  });
  var mine = list.find(function (x) {
    return x.id === me.id;
  });
  if (!mine) {
    mine = {
      id: me.id,
      name: me.name,
      t: {},
      s: 0
    };
    list.push(mine);
  }
  mine.name = me.name;
  mine.t = Object.assign({}, mine.t, todayEntry());
  if (!mine.s && (mine.t.f || mine.t.g || mine.t.c || mine.t.s)) mine.s = 1;
  var rows = list.filter(function (x) {
    return x.id === me.id || x.t.f || x.t.g || x.t.c || x.t.s;
  });
  sortBoard(rows);
  body.innerHTML = "";
  rows.forEach(function (x, idx) {
    var li = el("li");
    var head = el("div", "phead");
    var nm = el("button", "pname tap", x.name);
    nm.dataset.card = x.id;
    head.append(el("span", "rank" + (idx === 0 && doneCount(x) ? " r1" : ""), idx + 1), nm);
    if (stats && stats.crown.some(function (c) {
      return c.id === x.id;
    })) {
      var c = el("span", "crown", "👑");
      c.title = "Yesterday's winner";
      head.appendChild(c);
    }
    if (gotds().some(function (gy) {
      return gy.y && gy.y.win && gy.y.win.id === x.id;
    })) {
      var _c = el("span", "crown", "🏆");
      _c.title = "Won yesterday's Game of the Day";
      head.appendChild(_c);
    }
    if (stats && stats.week.length && stats.week[0].id === x.id && stats.week[0].pts > 0) {
      var d = emo(":dawgW:", 20);
      d.classList.add("lead-dawg");
      d.title = "Leading the week";
      head.appendChild(d);
    }
    if (x.id === me.id) head.appendChild(el("span", "you", "You"));
    var sk = el("span", "streak", x.s ? "\uD83D\uDD25 ".concat(x.s, "-day streak") + (x.z ? " 🧊" : "") : "");
    if (x.z) sk.title = "Streak freeze used this week";
    head.appendChild(sk);
    head.appendChild(el("span", "ptot", (RANKPTS[x.id] || 0) + " pts"));
    if (x.id !== me.id && shadeLoaded) head.appendChild(shadeButton(x.id));
    var st = el("div", "stats");
    var tg = autoTags(x.t),
      pb = PTSBY[x.id] || {};
    var ord = function ord(n) {
      return n + ["th", "st", "nd", "rd"][n % 100 > 10 && n % 100 < 14 || n % 10 > 3 ? 0 : n % 10];
    };
    var L = function L(name, k) {
      return x.t[k] ? "".concat(name, " \xB7 +").concat(pb[k] || 0) + (pb[k + "r"] ? " (".concat(ord(pb[k + "r"]), ")") : "") : name;
    };
    st.appendChild(x.t.f ? stat(L("Five", "f"), [el("span", null, (x.t.f.w ? x.t.f.n : "X") + "/6"), squares(x.t.f.rows, "f")].concat(tg.f || [])) : stat("Five", [dash()]));
    st.appendChild(x.t.g ? stat(L("Groups", "g"), [el("span", null, x.t.g.w ? x.t.g.m === 0 ? "Perfect" : x.t.g.m + " miss" : "X"), squares(x.t.g.rows, "g")].concat(tg.g || [])) : stat("Groups", [dash()]));
    st.appendChild(stat(L("Strands", "s"), x.t.s ? [el("span", null, fmtTime(x.t.s.t) + (x.t.s.h ? " \xB7 ".concat(x.t.s.h, " hint").concat(x.t.s.h > 1 ? "s" : "") : ""))].concat(tg.s || []) : [dash()]));
    st.appendChild(stat(L("Mini", "c"), x.t.c ? [el("span", null, fmtTime(x.t.c.t) + (x.t.c.k ? "*" : ""))].concat(tg.c || []) : [dash()]));
    li.append(head, st);
    body.appendChild(li);
  });
  if (shadeLoaded) renderSlackers(rows.map(function (x) {
    return x.id;
  }));
  var others = rows.length - 1;
  $("scores-note").textContent = (others ? "Scores post here on their own the moment anyone finishes a game." : "Nobody else has played today yet. The invite link is under ⚙️.") + (rows.some(function (x) {
    return x.t.c && x.t.c.k;
  }) ? " * = used Check." : "") + " Points: Five 5 (in 1–2) down to 1 (in 6). Groups 5 minus mistakes. Strands and Mini by speed: 1st +6, 2nd +5… down to +1 (each hint or Check adds 30s).";
}
var pollId = null;
function scoresShown() {
  renderScores();
  refreshBoard();
  if (!arcade) refreshArcade();
  clearInterval(pollId);
  pollId = setInterval(function () {
    if (active === "scores" && document.visibilityState === "visible") refreshBoard();else {
      clearInterval(pollId);
      pollId = null;
    }
  }, 30000);
}
$("scores-refresh").addEventListener("click", function () {
  $("scores-note").textContent = "Refreshing…";
  refreshBoard();
});
document.addEventListener("visibilitychange", function () {
  if (document.visibilityState === "visible" && me) refreshBoard();
});
$("nick-save").addEventListener("click", function () {
  var v = $("nick").value.trim();
  if (!v || !me) return;
  API("register", me.id, v).then(function (r) {
    me = r;
    store.set("bdd:me", me);
    toast("Name saved");
    renderScores();
  })["catch"](function (e) {
    return toast(errMsg(e), 2600);
  });
});
$("invite-link").textContent = APP_URL || "Your app link";
function inviteUrl() {
  var c = crews.find(function (x) {
    return x.id === crewSel;
  });
  return c ? crewLink(c) : APP_URL;
}
$("invite-copy").addEventListener("click", function () {
  var c = crews.find(function (x) {
    return x.id === crewSel;
  });
  copy("Join me".concat(c ? " in ".concat(c.name) : "", " on Big Dawg Daily: four quick puzzles a day, with a scoreboard. ") + inviteUrl(), $("copy-fallback"), "Invite link copied");
});
$("share-all").addEventListener("click", function () {
  return copy(shareText(), $("copy-fallback"));
});
$("switch-player").addEventListener("click", function () {
  store.del("bdd:me");
  me = null;
  forgetUrl();
  shadeLoaded = false;
  showWho();
});
var STYLES = {
  greatest: {
    label: "🎖️ Greatest Gen",
    open: ["Now see here,", "Good grief!", "In my day we walked uphill both ways:", "Hogwash!", "Golly,"],
    ins: ["whippersnapper", "nincompoop", "goldbricker", "palooka", "lollygagger", "dingbat"],
    close: ["We stormed beaches. You can't solve a crossword.", "Back to the salt mines with you.", "Shape up or ship out.", "That's a dang shame.", "Go fetch me a Sanka."]
  },
  roaring: {
    label: "🎩 Roaring '20s",
    open: ["Applesauce!", "Horsefeathers!", "Says you!", "Well, ain't that the bee's knees:"],
    ins: ["flat tire", "wet blanket", "dumb Dora", "four-flusher", "bluenose", "egg"],
    close: ["Go chase yourself.", "Banana oil!", "You're all wet.", "Scram, you bum.", "That's the cat's pajamas… NOT."]
  },
  boomer: {
    label: "📻 Boomer",
    open: ["Back in my day…", "Listen here, kiddo:", "Well, I'll be!", "Lemme tell ya something:", "Kids today…"],
    ins: ["knucklehead", "bozo", "slacker", "goof", "participation-trophy kid", "screen zombie"],
    close: ["Kids these days.", "Put the phone down.", "Get a real job.", "Not in this house.", "Pull yourself up by your bootstraps.", "I'm calling your mother."]
  },
  genx: {
    label: "📼 Gen X",
    open: ["Whatever.", "As if.", "Psych!", "Talk to the hand:", "Grody.", "Like, totally:"],
    ins: ["poser", "dweeb", "doofus", "loser", "space cadet", "mall rat"],
    close: ["Not!", "Take a chill pill.", "Gag me with a spoon.", "Don't have a cow.", "Be kind, rewind.", "Eat my shorts."]
  },
  nineties: {
    label: "📟 '90s Kid",
    open: ["Boo-yah!", "Talk to the hand,", "Booyakasha.", "Oh snap!", "Da bomb… NOT:"],
    ins: ["Tamagotchi killer", "dial-up connection", "Pog-flipping poser", "slap-bracelet reject", "buffering VHS"],
    close: ["Psych!", "Not all that and a bag of chips.", "As if!", "Cowabunga, loser.", "Your mom called, she wants her Game Boy back.", "Phat FAIL."]
  },
  millennial: {
    label: "🥑 Millennial",
    open: ["I literally can't.", "I'm dead.", "OMG.", "Okay but hear me out:", "Not gonna lie,"],
    ins: ["n00b", "scrub", "try-hard", "basic", "Harambe truther", "planking enthusiast"],
    close: ["Epic fail.", "Pwned.", "Adulting is hard.", "That's so 2012.", "Do you even lift?", "Living your worst life. #blessed"]
  },
  genz: {
    label: "💀 Gen Z",
    open: ["Bestie…", "Be so fr:", "No cap:", "POV:", "It's the loss for me:", "Ratio incoming:"],
    ins: ["NPC", "bot", "side quest character", "background extra", "pick-me", "delulu"],
    close: ["Skill issue.", "Cooked.", "It's giving L.", "Touch grass.", "The ick.", "Rent free in your loss column.", "Mid."]
  },
  alpha: {
    label: "🧃 Gen Alpha",
    open: ["Bro…", "Chat:", "Nah.", "Skibidi alert:", "Fanum tax incoming:"],
    ins: ["noob", "bozo", "NPC", "Ohio final boss", "sussy baka"],
    close: ["Negative aura.", "-1000 aura.", "Not very sigma.", "L + no rizz.", "Gyatt-less performance.", "Go back to Roblox."]
  },
  discord: {
    label: "🎮 Discord brain",
    open: ["Chat, look:", "Bro really…", "W/L check:", "Kek.", "Ratio:", "Patch notes:"],
    ins: ["NPC", "lurker", "copium addict", "mid laner", "AFK andy", "bronze-ranked tourist"],
    close: ["gg ez.", "Skill issue.", "Ratio.", "Touch grass.", "Copium levels critical.", "L + ratio + who asked.", "Chat is this real?", "Uninstall."]
  },
  bard: {
    label: "🎭 The Bard",
    open: ["Hark!", "Fie!", "Zounds!", "Forsooth!", "Alack!", "Out, damned spot!"],
    ins: ["cream-faced loon", "lily-livered knave", "beef-witted clotpole", "rump-fed ronyon", "pribbling hedge-pig", "canker-blossom"],
    close: ["Get thee hence.", "Exit, pursued by shame.", "Thou art undone.", "Methinks thou stinks.", "To lose or to lose, that is thy question.", "A plague on thy scorecard."]
  },
  brit: {
    label: "🇬🇧 Brit",
    open: ["Oi!", "Blimey!", "Cor!", "Right then:", "Bloody hell,", "Innit:"],
    ins: ["muppet", "plonker", "numpty", "wally", "donut", "pillock", "absolute melt"],
    close: ["Bottled it.", "Shambolic.", "Absolute scenes.", "Have a word with yourself.", "Pop the kettle on and cry.", "Bit of a mare, that."]
  },
  southern: {
    label: "🤠 Southern",
    open: ["Well bless your heart,", "Lord have mercy,", "I declare,", "Y'all ain't gonna believe this:", "Well butter my biscuit,"],
    ins: ["one fry short of a Happy Meal", "all hat and no cattle", "dumber than a box of rocks", "useless as a screen door on a submarine"],
    close: ["Bless your heart.", "Sweeter than tea, slower than molasses.", "Go sit on the porch and think about it.", "Fixin' to lose again, huh?"]
  },
  midwest: {
    label: "🌽 Midwest Nice",
    open: ["Oh, ya know,", "Ope,", "Well that's different:", "Not to be rude but", "Oh for cute,"],
    ins: ["silly goose", "dingus", "hotdish with no tater tots", "goofball", "real piece of work, ya know"],
    close: ["But we're still friends, ya know?", "Gonna pray for ya.", "Interesting choice. Real interesting.", "That's a heckuva way to play.", "Ope, just gonna sneak past you on the leaderboard."]
  },
  pirate: {
    label: "🏴‍☠️ Pirate",
    open: ["Arrr!", "Shiver me timbers!", "Avast ye,", "Blow me down!"],
    ins: ["scallywag", "bilge rat", "landlubber", "barnacle-brained swab"],
    close: ["Walk the plank.", "Davy Jones wouldn't take that score.", "Ye be sleepin' with the fishes.", "Dead men tell no tales, and neither should ye."]
  },
  announcer: {
    label: "🎙️ Sports Announcer",
    open: ["AND THE CROWD GOES MILD!", "Folks, I've seen it all:", "Unbelievable scenes here:", "Let's go to the replay:"],
    ins: ["walking turnover", "benchwarmer", "first-round bust", "practice-squad legend"],
    close: ["That's going on the blooper reel.", "Somebody check the tape.", "Fire the coach.", "And that's why they don't let you start."]
  },
  corporate: {
    label: "💼 Corporate",
    open: ["Per my last email,", "Circling back:", "Quick sync:", "Let's take this offline:", "Just looping you in:"],
    ins: ["synergy vacuum", "low performer", "meeting that should've been an email", "reply-all disaster"],
    close: ["Let's put a pin in your dignity.", "Not a culture fit.", "See attached: your score.", "This is going in your performance review.", "Moving forward, please be better."]
  },
  dad: {
    label: "👨 Dad Jokes",
    open: ["Hi Hungry, I'm Dad.", "Fun fact:", "Here's the thing, champ:", "Did you hear the one about your score?"],
    ins: ["sport", "bud", "kiddo", "champ"],
    close: ["I'm not mad, just disappointed.", "Ask your mother.", "That score is un-BEE-lievable. Bad.", "Who turned off the lights? Oh, that's just your future.", "Someone call the dentist, that score needs a filling."]
  },
  mob: {
    label: "🎲 Mob Boss",
    open: ["Fuhgeddaboudit.", "Capisce?", "Lemme make you an offer:", "You come into my house…"],
    ins: ["mook", "goombah", "two-bit palooka", "cannoli without the filling"],
    close: ["Sleep with the fishes.", "It's not personal. It's business.", "Leave the gun, take the L.", "Badda bing, badda bust."]
  }
};
var STYLE_KEYS = Object.keys(STYLES);
var UNHINGED = ["A dictionary just filed a restraining order.", "Autocorrect guesses better.", "Scientists are studying you as a warning.", "Even the Magic 8-Ball said no.", "Your row needs a parental advisory."];
var pick = function pick(a) {
  return a[Math.floor(Math.random() * a.length)];
};
var plural = function plural(n, w) {
  return "".concat(n, " ").concat(w).concat(n === 1 ? "" : "s");
};
function burnsFor(name, t) {
  var b = [];
  var add = function add(w, arr) {
    return b.push({
      w: w,
      s: pick(arr)
    });
  };
  if (!t || !t.f && !t.g && !t.s && !t.c) {
    add(5, ["".concat(name, " hasn't played today. Scared?"), "Zero puzzles, ".concat(name, ". Bold."), "".concat(name, ": missing in action."), "Four dashes, ".concat(name, ". Iconic.")]);
    return b;
  }
  var skipped = [["f", "Five"], ["g", "Groups"], ["s", "Strands"], ["c", "the Mini"]].filter(function (_ref3) {
    var _ref4 = _slicedToArray(_ref3, 1),
      k = _ref4[0];
    return !t[k];
  }).map(function (_ref5) {
    var _ref6 = _slicedToArray(_ref5, 2),
      n = _ref6[1];
    return n;
  });
  if (skipped.length) add(1, ["".concat(name, " skipped ").concat(skipped[0], ". Chicken?"), "No ".concat(skipped[0], ", ").concat(name, "? Coward.")]);
  if (t.f) {
    var n = t.f.n;
    if (!t.f.w) add(6, ["".concat(name, " went X/6 on Five."), "Six guesses, zero answers, ".concat(name, "."), "".concat(name, " played Five like a slot machine.")]);else if (n >= 5) add(5, ["".concat(n, "/6 on Five, ").concat(name, "? Sweaty."), "".concat(name, " needed ").concat(n, " guesses. Yikes.")]);else if (n === 4) add(2, ["4/6, ".concat(name, ". Aggressively average.")]);else add(2, ["".concat(n, "/6, ").concat(name, "? Lucky guess."), "".concat(name, " got Five in ").concat(n, ". Suspicious.")]);
  }
  if (t.g) {
    var m = t.g.m;
    if (!t.g.w) add(6, ["".concat(name, " flunked Groups."), "".concat(name, " couldn't sort 16 words.")]);else if (m >= 2) add(4, ["".concat(plural(m, "mistake"), " in Groups, ").concat(name, "."), "".concat(name, " guessed their way through Groups.")]);else if (m === 1) add(2, ["One Groups oopsie, ".concat(name, ".")]);else add(1, ["Perfect Groups, ".concat(name, "? Get a hobby.")]);
  }
  if (t.s) {
    var h = t.s.h,
      T = fmtTime(t.s.t);
    if (h >= 2) add(5, ["".concat(h, " hints on Strands, ").concat(name, "?"), "".concat(name, " took the Strands guided tour.")]);else if (h === 1) add(3, ["".concat(name, " needed a Strands hint.")]);
    if (t.s.t > 240) add(3, ["".concat(T, " on Strands, ").concat(name, ". Glacial.")]);
  }
  if (t.c) {
    var _T = fmtTime(t.c.t);
    if (t.c.k) add(4, ["".concat(name, " hit Check on the Mini. Asterisk.")]);
    if (t.c.t > 150) add(4, ["".concat(_T, " on the Mini, ").concat(name, "? It's mini.")]);else if (t.c.t > 60) add(2, ["".concat(_T, " on the Mini. Slow, ").concat(name, ".")]);else add(1, ["".concat(_T, " on the Mini? Cheater vibes, ").concat(name, ".")]);
  }
  return b;
}
function versusFor(t, mine) {
  var out = [];
  if (!t || !mine) return out;
  if (mine.f && mine.f.w && (!t.f || !t.f.w || mine.f.n < t.f.n)) out.push("I got Five in ".concat(mine.f.n, ".") + (t.f ? t.f.w ? " You: ".concat(t.f.n, ".") : " You: X." : ""));
  if (mine.c && t.c && mine.c.t < t.c.t) out.push("My Mini: ".concat(fmtTime(mine.c.t), ". Yours: ").concat(fmtTime(t.c.t), "."));
  return out;
}
function weightedPick(arr) {
  var tot = arr.reduce(function (a, x) {
    return a + x.w;
  }, 0);
  var r = Math.random() * tot;
  var _iterator = _createForOfIteratorHelper(arr),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var x = _step.value;
      r -= x.w;
      if (r <= 0) return x;
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  return arr[0];
}
function makeShade(name, t, mine, spice, styleKey) {
  var opts = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};
  var st = STYLES[styleKey === "chaos" ? pick(STYLE_KEYS) : styleKey];
  if (opts.dare) {
    var d = opts.dare,
      g = d.gameName,
      n = d.target;
    var line = pick(["".concat(n, " in ").concat(g, "? That's my warm-up."), "Cute ".concat(n, ". Watch this."), "Bold of you to dare me with ".concat(n, "."), "".concat(n, "? A sleeping pug could beat that."), "I'll beat ".concat(n, " with my eyes closed."), "".concat(n, " in ").concat(g, ". Adorable."), "Clear your schedule, ".concat(name, ". ").concat(n, " is going down.")]);
    return [pick(st.open), line, spice === 1 ? pick(st.close) : "You ".concat(pick(st.ins), ".")].filter(Boolean).join(" ").replace(/\s+/g, " ").trim().slice(0, 160);
  }
  var parts = [];
  if (opts.fire) parts.push(pick(["Return fire!", "Oh, it's on.", "You started this."]));else if (spice >= 2 || Math.random() < 0.5) parts.push(pick(st.open));
  parts.push(weightedPick(burnsFor(name, t)).s);
  var vs = spice >= 2 ? versusFor(t, mine) : [];
  if (vs.length && Math.random() < 0.35) parts.push(pick(vs));
  if (opts.jokes && opts.jokes.length && Math.random() < 0.4) parts.push(pick(opts.jokes).replace(/\{name\}/gi, name));else if (spice === 1) parts.push(pick([pick(st.close), "Love you though."]));else if (spice === 2) parts.push(Math.random() < 0.5 ? "You ".concat(pick(st.ins), ".") : pick(st.close));else parts.push("You ".concat(pick(st.ins), ". ").concat(pick(UNHINGED)));
  return parts.filter(Boolean).join(" ").replace(/\s+/g, " ").trim().slice(0, 220);
}
var SPICE = {
  1: "Mild",
  2: "Medium",
  3: "Unhinged"
};
var SPICE_DESC = {
  1: "Gentle ribbing. Grandma-safe.",
  2: "Real burns, still friendly.",
  3: "Theatrical, merciless, still clean."
};
var shade = {
  inbox: [],
  sentToday: {},
  firedBack: [],
  board: null,
  settings: {
    spice: 0,
    jokes: false,
    mute: false
  },
  jokes: [],
  players: []
};
var shadeLoaded = false;
function refreshShade() {
  if (!me) return Promise.resolve();
  return API("getShadeState", me.id, KEY).then(function (st) {
    shade = st;
    shadeLoaded = true;
    renderShadeBits();
    maybeServe();
    if ((st.recent || []).some(function (x) {
      return (x.kind === "joinok" || x.kind === "join" || x.kind === "added") && !x.seen;
    })) API("getCrews", me.id).then(function (l) {
      return setCrews(l);
    })["catch"](function () {});
  })["catch"](function () {});
}
function playerInfo(id) {
  var p = (shade.players || []).find(function (x) {
    return x.id === id;
  }) || {};
  var b = board && board.players.find(function (x) {
    return x.id === id;
  });
  return {
    id: id,
    name: p.name || b && b.name || "Player",
    muted: !!p.muted,
    t: b && b.t || {}
  };
}
function openSpicePicker(then) {
  var nodes = [el("h2", null, "Pick your spice level"), el("p", "sub", "How hard should your shade hit? You can change this anytime in Settings.")];
  var wrap = el("div", "spicepick");
  [1, 2, 3].forEach(function (n) {
    var b = el("button", "spiceopt");
    b.append(el("b", null, ["🌶️", "🌶️🌶️", "🌶️🌶️🌶️"][n - 1] + " " + SPICE[n]), el("span", null, SPICE_DESC[n]));
    b.addEventListener("click", function () {
      saveShadeSettings({
        spice: n
      }).then(function () {
        closeModal();
        if (then) then();
      });
    });
    wrap.appendChild(b);
  });
  nodes.push(wrap);
  openModal(nodes);
}
function saveShadeSettings(patch) {
  shade.settings = Object.assign({}, shade.settings, patch);
  renderSettings();
  return API("saveSettings", me.id, shade.settings)["catch"](function (e) {
    return toast(errMsg(e), 2400);
  });
}
function openShade(targetId) {
  var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  if (!me || targetId === me.id) return;
  var tgt = playerInfo(targetId);
  if (tgt.muted && !opts.fire) {
    toast("".concat(tgt.name, " has shade muted"), 2200);
    return;
  }
  if (!opts.fire && !opts.game && !beating(targetId)) {
    openShadeLocked(targetId);
    return;
  }
  var used = shade.sentToday[targetId] || 0;
  if (!opts.fire && used >= 3) {
    toast("You've thrown 3 at ".concat(tgt.name, " today. Save some for tomorrow."), 2600);
    return;
  }
  var style = "chaos",
    text = "";
  var jokes = shade.settings.jokes ? shade.jokes.map(function (j) {
    return j.text;
  }) : [];
  var card = el("textarea", "shadecard shade-edit");
  card.rows = 4;
  card.maxLength = 300;
  card.setAttribute("aria-label", "Your shade (tap to edit)");
  var roll = function roll() {
    text = opts.game ? makeGameShade(tgt.name, opts.game, shade.settings.spice || 2, style) : makeShade(tgt.name, tgt.t, todayEntry(), shade.settings.spice || 2, style, {
      fire: !!opts.fire,
      jokes: jokes,
      dare: opts.dare
    });
    card.value = text;
  };
  var chips = el("div", "chips shade-chips");
  [["chaos", "🎲 Chaos"]].concat(STYLE_KEYS.map(function (k) {
    return [k, STYLES[k].label];
  })).forEach(function (_ref7) {
    var _ref8 = _slicedToArray(_ref7, 2),
      k = _ref8[0],
      label = _ref8[1];
    var c = el("button", "chip" + (k === style ? " on" : ""), label);
    c.addEventListener("click", function () {
      style = k;
      chips.querySelectorAll(".chip").forEach(function (x) {
        return x.classList.toggle("on", x === c);
      });
      roll();
    });
    chips.appendChild(c);
  });
  roll();
  var reroll = el("button", "pill", "🔄 Reroll");
  reroll.addEventListener("click", roll);
  var send = el("button", "pill solid", opts.dare ? "🗣️ Send it" : opts.fire ? "🔥 Fire back" : "🎯 Throw it");
  var status = el("p", "note center", opts.dare ? "Talk trash about ".concat(tgt.name, "'s dare. One reply per dare.") : opts.fire ? "Return fire at ".concat(tgt.name, ". One shot per shade.") : "".concat(3 - used, " of 3 throws left at ").concat(tgt.name, " today \xB7 Spice: ").concat(SPICE[shade.settings.spice || 2]));
  send.addEventListener("click", function () {
    send.disabled = true;
    status.textContent = "Delivering…";
    text = card.value.trim();
    if (!text) {
      send.disabled = false;
      status.textContent = "Write something first.";
      return;
    }
    API("sendShade", me.id, targetId, KEY, text, opts.fire ? "fire" : "shade", opts.replyTo || "", opts.game ? opts.game.key : "").then(function (st) {
      shade = st;
      renderShadeBits();
      closeModal();
      toast(opts.dare ? "Trash talk delivered 🗣️" : opts.fire ? "Fired back 🔥" : "Shade delivered to ".concat(tgt.name, " \uD83C\uDFAF"), 2000);
    })["catch"](function (e) {
      send.disabled = false;
      status.textContent = errMsg(e);
    });
  });
  var row = el("div", "inrow center");
  row.append(reroll, send);
  openModal([el("h2", null, (opts.dare ? "Talk trash at " : opts.fire ? "Fire back at " : "Throw shade at ") + tgt.name), opts.game ? el("p", "sub center", "Earned in ".concat(opts.game.name, ": your ").concat(fmtG(opts.game.key, opts.game.mine), " beats their ").concat(fmtG(opts.game.key, opts.game.theirs))) : null, card, el("p", "note center", "✏️ Tap the text to edit it"), chips, row, status]);
}
var serving = null;
function gameBeaten(game, myScore) {
  var ga = arcade && arcade.games && arcade.games[game];
  if (!ga || !me || !(myScore > 0)) return [];
  var mates = {};
  (shade.players || []).forEach(function (p) {
    return mates[p.id] = p;
  });
  var list = ga.daily ? ga.today || [] : ga.all || [];
  return list.filter(function (x) {
    return x.id !== me.id && mates[x.id] && x.n > 0 && betterG(game, myScore, x.n);
  }).map(function (x) {
    return {
      id: x.id,
      name: x.name || mates[x.id].name,
      n: x.n
    };
  });
}
function gameShadeOpts(game, mine, theirs) {
  return {
    game: {
      key: game,
      name: ARC[game] && ARC[game].name || "that game",
      mine: mine,
      theirs: theirs
    }
  };
}
function shadeUpRow(game, score, posted) {
  var box = el("div", "shadeup");
  box.hidden = true;
  var fill = function fill() {
    if (!box.isConnected && box.dataset.done) return;
    var beat = gameBeaten(game, score);
    box.innerHTML = "";
    box.dataset.done = 1;
    if (!beat.length || !shadeLoaded) {
      box.hidden = true;
      return;
    }
    var names = beat.slice(0, 3).map(function (b) {
      return b.name;
    });
    box.append(el("p", "sub", "\uD83C\uDFAF You beat ".concat(names.length > 2 ? names.slice(0, -1).join(", ") + " and " + names[names.length - 1] : names.join(" and ")).concat(beat.length > 3 ? " and more" : "", ". Shade earned.")));
    var chips = el("div", "chips center");
    beat.slice(0, 6).forEach(function (b) {
      var p = playerInfo(b.id),
        used = shade.sentToday[b.id] || 0;
      var c = el("button", "chip" + (p.muted || used >= 3 ? " off" : ""), (p.muted ? "🔕 " : "🎯 ") + b.name);
      c.addEventListener("click", function (e) {
        e.stopPropagation();
        openShade(b.id, gameShadeOpts(game, score, b.n));
      });
      chips.appendChild(c);
    });
    box.append(chips);
    box.hidden = false;
  };
  (posted && posted.then ? posted : Promise.resolve()).then(fill, fill);
  return box;
}
function makeGameShade(name, g, spice, styleKey) {
  var st = STYLES[styleKey === "chaos" ? pick(STYLE_KEYS) : styleKey];
  var m = fmtG(g.key, g.mine),
    t = fmtG(g.key, g.theirs),
    n = g.name;
  var line = pick(["".concat(n, ": me ").concat(m, ", ").concat(name, " ").concat(t, ". Read it and weep."), "Just passed your ".concat(t, " in ").concat(n, ". Didn't even break a sweat."), "".concat(t, " in ").concat(n, ", ").concat(name, "? I've seen better from a sleeping pug."), "".concat(m, " to ").concat(t, " in ").concat(n, ". Frame it, ").concat(name, "."), "Hey ".concat(name, ", your ").concat(n, " score called. It wants a rematch."), "".concat(n, " has a new top dawg, and it isn't you, ").concat(name, "."), "Somebody check on ".concat(name, ". ").concat(t, " in ").concat(n, " is a cry for help.")]);
  var parts = [];
  if (spice >= 2 || Math.random() < 0.5) parts.push(pick(st.open));
  parts.push(line);
  if (spice === 1) parts.push(pick([pick(st.close), "Love you though."]));else if (spice === 2) parts.push(Math.random() < 0.5 ? "You ".concat(pick(st.ins), ".") : pick(st.close));else parts.push("You ".concat(pick(st.ins), ". ").concat(pick(UNHINGED)));
  return parts.filter(Boolean).join(" ").replace(/\s+/g, " ").trim().slice(0, 220);
}
function openShadeLocked(id) {
  var tgt = playerInfo(id),
    list = todayList(),
    mine = list.find(function (x) {
      return x.id === me.id;
    }),
    them = list.find(function (x) {
      return x.id === id;
    });
  var played = function played(x) {
    return x && x.t && (x.t.f || x.t.g || x.t.c || x.t.s);
  };
  var nodes = [el("h2", null, "\uD83D\uDD12 Shade at ".concat(tgt.name, " is locked")), el("p", "sub", "Shade is earned: beat them first.")];
  var ul = el("ul", "rules");
  var NAMES = {
    f: "Five",
    g: "Groups",
    s: "Strands",
    c: "the Mini"
  };
  var and = function and(a) {
    return a.length > 1 ? a.slice(0, -1).join(", ") + " and " + a[a.length - 1] : a.join("");
  };
  if (!played(mine)) ul.appendChild(el("li", null, "Play today's puzzles. Once you're ahead of them on points, the 🎯 unlocks."));else {
    var by = {},
      pts = dayPts(list, by),
      a = by[me.id] || {},
      b = by[id] || {};
    nodes.push(el("p", null, "".concat(tgt.name, " is ahead of you today: ").concat(pts[id] || 0, " points to your ").concat(pts[me.id] || 0, ".")));
    var left = ["f", "g", "s", "c"].filter(function (k) {
      return !(mine.t && mine.t[k]);
    }).map(function (k) {
      return NAMES[k];
    });
    if (left.length) ul.appendChild(el("li", null, "You haven't played ".concat(and(left), " yet. Points there could put you ahead.")));
    var lost = ["f", "g", "s", "c"].filter(function (k) {
      return mine.t && mine.t[k] && them && them.t && them.t[k] && (b[k] || 0) > (a[k] || 0);
    }).map(function (k) {
      return NAMES[k];
    });
    if (lost.length) ul.appendChild(el("li", null, "".concat(tgt.name, " beat you on ").concat(and(lost), " today.")));
  }
  var ready = [],
    todo = [];
  Object.keys(arcade && arcade.games || {}).forEach(function (g) {
    var ga = arcade.games[g];
    if (!ga.daily || !ARC[g]) return;
    var t = (ga.today || []).find(function (x) {
        return x.id === id;
      }),
      m = (ga.today || []).find(function (x) {
        return x.id === me.id;
      });
    if (t && m && betterG(g, m.n, t.n)) ready.push([g, m.n, t.n]);else if (t && !m) todo.push([g, t.n]);
  });
  todo.slice(0, 3).forEach(function (_ref9) {
    var _ref0 = _slicedToArray(_ref9, 2),
      g = _ref0[0],
      n = _ref0[1];
    return ul.appendChild(el("li", null, "Beat ".concat(tgt.name, "'s ").concat(fmtG(g, n), " in ").concat(ARC[g].name, " (The Den) today.")));
  });
  ul.appendChild(el("li", null, "Or pass ".concat(tgt.name, "'s best in any Arcade or Sports game. You'll get a \uD83C\uDFAF right on the results screen.")));
  nodes.push(ul);
  if (ready.length && !tgt.muted) {
    nodes.push(el("p", "sub", "You're already beating them here:"));
    var chips = el("div", "chips");
    ready.forEach(function (_ref1) {
      var _ref10 = _slicedToArray(_ref1, 3),
        g = _ref10[0],
        m = _ref10[1],
        t = _ref10[2];
      var c = el("button", "chip", "\uD83C\uDFAF ".concat(ARC[g].name));
      c.addEventListener("click", function () {
        closeModal();
        openShade(id, gameShadeOpts(g, m, t));
      });
      chips.appendChild(c);
    });
    nodes.push(chips);
  }
  openModal(nodes);
}
var popOn = function popOn(k) {
  return (store.get("bdd:pop") || {})[k] !== false;
};
function worthy(x) {
  if (x.kind === "shade") return popOn("shade");
  if (x.kind === "dare") return popOn("dares");
  if (x.kind === "dareres") {
    var d = parseDare(x.text),
      _d$rest$split$map = d.rest.split("/").map(Number),
      _d$rest$split$map2 = _slicedToArray(_d$rest$split$map, 2),
      sc = _d$rest$split$map2[0],
      tg = _d$rest$split$map2[1];
    return popOn("dares") && betterG(d.game, sc, tg);
  }
  return false;
}
function renderBell() {
  var n = (shade.recent || []).filter(function (x) {
    return !x.seen;
  }).length || 0;
  $("bell-n").hidden = !n;
  $("bell-n").textContent = n > 9 ? "9+" : String(n);
}
var NOTE_ICON = {
  shade: "🎯",
  fire: "🔥",
  clap: "👏",
  dare: "🕹️",
  dareres: "🏁",
  join: "🙋",
  joinok: "🎉",
  added: "🎉",
  newbie: "👋"
};
function noteText(x) {
  if (x.kind === "dare") {
    var d = parseDare(x.text);
    return "".concat(x.fromName, " dared you to beat ").concat(fmtG(d.game, d.target), " in ").concat(ARC[d.game] ? ARC[d.game].name : "the arcade");
  }
  if (x.kind === "dareres") {
    var _d = parseDare(x.text),
      _d$rest$split$map3 = _d.rest.split("/").map(Number),
      _d$rest$split$map4 = _slicedToArray(_d$rest$split$map3, 2),
      sc = _d$rest$split$map4[0],
      tg = _d$rest$split$map4[1],
      nm = ARC[_d.game] ? ARC[_d.game].name : "the arcade";
    return betterG(_d.game, sc, tg) ? "".concat(x.fromName, " beat your ").concat(fmtG(_d.game, tg), " in ").concat(nm, " with ").concat(fmtG(_d.game, sc)) : "".concat(x.fromName, " took your ").concat(nm, " dare and fell short (").concat(fmtG(_d.game, sc), ")");
  }
  if (x.kind === "join") return "".concat(x.fromName, " wants into ").concat(x.crew || "your crew");
  if (x.kind === "newbie") return "".concat(x.fromName, " just joined Big Dawg Daily");
  if (x.kind === "added") return "".concat(x.fromName, " added you to ").concat(x.crew || "a crew", " \uD83D\uDC36");
  if (x.kind === "joinok") return "You're in ".concat(x.crew || "the crew", "! ").concat(x.fromName, " let you in.");
  if (x.kind === "clap") return "".concat(x.fromName, " clapped back");
  if (x.kind === "fire") return "".concat(x.fromName, " fired back: \u201C").concat(x.text, "\u201D");
  return "".concat(x.fromName, " threw shade: \u201C").concat(x.text, "\u201D");
}
function openBell() {
  var list = el("div", "notes"),
    rec = shade.recent || [];
  if (!rec.length) list.appendChild(el("p", "sub", "Nothing yet. Go beat somebody."));
  rec.forEach(function (x) {
    var r = el("div", "note-row" + (x.seen ? "" : " new")),
      ic = el("span", "ni");
    if (x.kind === "clap" && isDawg(x.text)) ic.appendChild(emo(x.text, 22));else ic.textContent = x.kind === "clap" ? x.text : NOTE_ICON[x.kind] || "🎯";
    var tx = el("div");
    tx.append(document.createTextNode(noteText(x)), el("small", null, x.date === KEY ? "Today" : x.date));
    r.append(ic, tx);
    if (x.kind === "join" && x.response !== "yes" && x.response !== "no") tx.appendChild(joinButtons(x.id, x.fromName, x.crew));
    if (x.kind === "newbie" && x.response !== "yes" && x.text && x.crew) {
      var row = el("div", "inrow");
      row.appendChild(addToCrewBtn(x.text, x.crew, x.from, x.fromName, function () {
        x.response = "yes";
      }));
      tx.appendChild(row);
    }
    list.appendChild(r);
  });
  var set = el("div", "col");
  [["shade", "Pop up when someone throws shade"], ["dares", "Pop up for dares and when someone beats your score"]].forEach(function (_ref11) {
    var _ref12 = _slicedToArray(_ref11, 2),
      k = _ref12[0],
      label = _ref12[1];
    var l = el("label", "toggle"),
      cb = el("input");
    cb.type = "checkbox";
    cb.checked = popOn(k);
    cb.addEventListener("change", function () {
      var p = store.get("bdd:pop") || {};
      p[k] = cb.checked;
      store.set("bdd:pop", p);
    });
    l.append(cb, document.createTextNode(" " + label));
    set.appendChild(l);
  });
  openModal([el("h2", null, "Notifications"), list, el("p", "lbl2", "Pop-ups"), set]);
  var ids = rec.filter(function (x) {
    return !x.seen && !(shade.inbox || []).some(function (i) {
      return i.id === x.id && worthy(i);
    });
  }).map(function (x) {
    return x.id;
  });
  rec.forEach(function (x) {
    if (ids.includes(x.id)) x.seen = true;
  });
  shade.inbox = (shade.inbox || []).filter(function (i) {
    return !ids.includes(i.id);
  });
  renderBell();
  if (ids.length && me) API("markSeen", me.id, ids)["catch"](function () {});
}
$("home-bell").addEventListener("click", openBell);
$("home-idea").addEventListener("click", function () {
  var ta = el("textarea", "copybox");
  ta.rows = 5;
  ta.maxLength = 1000;
  ta.placeholder = "What would make Big Dawg better? Bugs, ideas, game requests…";
  var go = el("button", "pill solid", "Send to Sam"),
    msg = el("p", "note center");
  go.addEventListener("click", function () {
    var t = ta.value.trim();
    if (!t || !me) {
      msg.textContent = "Type something first.";
      return;
    }
    go.disabled = true;
    msg.textContent = "Sending…";
    API("sendFeedback", me.id, t).then(function () {
      closeModal();
      toast("Sent! Thanks for the idea 🐶", 2000);
    })["catch"](function (e) {
      go.disabled = false;
      msg.textContent = errMsg(e);
    });
  });
  openModal([el("h2", null, "Ideas & feedback"), el("p", "sub", "Goes straight to Sam."), ta, go, msg]);
  setTimeout(function () {
    return ta.focus();
  }, 80);
});
function maybeServe() {
  renderBell();
  var next = (shade.inbox || []).find(worthy);
  if (serving || !next) return;
  if (!(active === "home" || active === "scores") || !$("modal").hidden || !$("splash").hidden) return;
  serving = next;
  var clap = serving.kind === "clap",
    dare = serving.kind === "dare",
    res = serving.kind === "dareres";
  $("served-from").textContent = "".concat(serving.fromName, " ").concat(dare ? "dared you" : res ? "took your dare" : clap ? "clapped back" : serving.kind === "fire" ? "fired back at you" : "threw shade at you");
  $("served-text").textContent = "";
  if (clap && isDawg(serving.text)) $("served-text").appendChild(emo(serving.text, 110));else if (dare) {
    var d = parseDare(serving.text);
    $("served-text").textContent = "Beat ".concat(fmtG(d.game, d.target), " in ").concat(ARC[d.game].name, ". \uD83D\uDC36");
  } else if (res) {
    var _d2 = parseDare(serving.text),
      _d$rest$split$map5 = _d2.rest.split("/").map(Number),
      _d$rest$split$map6 = _slicedToArray(_d$rest$split$map5, 2),
      sc = _d$rest$split$map6[0],
      tg = _d$rest$split$map6[1];
    $("served-text").textContent = betterG(_d2.game, sc, tg) ? "".concat(serving.fromName, " scored ").concat(fmtG(_d2.game, sc), " in ").concat(ARC[_d2.game].name, ", beating your ").concat(fmtG(_d2.game, tg), ". Run it back? \uD83D\uDE24") : "".concat(serving.fromName, " scored ").concat(fmtG(_d2.game, sc), " in ").concat(ARC[_d2.game].name, ". Your ").concat(fmtG(_d2.game, tg), " stands. \uD83D\uDE0E");
  } else $("served-text").textContent = serving.text;
  $("served-text").classList.toggle("big", clap);
  $("served-ok").textContent = res ? "GG" : "Noted 😤";
  $("served-acts").hidden = clap || dare || res;
  $("served-claps").hidden = clap || dare || res;
  $("served-okrow").hidden = !(clap || res);
  $("served-darerow").hidden = !dare;
  var more = shade.inbox.filter(worthy).length - 1;
  $("served-more").textContent = more ? "".concat(more, " more waiting") : "";
  $("served").hidden = false;
}
function finishServe(resp, emoji) {
  var sh = serving;
  if (!sh) return;
  $("served").hidden = true;
  serving = null;
  shade.inbox = shade.inbox.filter(function (x) {
    return x.id !== sh.id;
  });
  (shade.recent || []).forEach(function (x) {
    if (x.id === sh.id) x.seen = true;
  });
  renderBell();
  API("respondShade", me.id, sh.id, resp === "later" || resp === "trash" ? "ok" : resp).then(function () {
    if (resp === "L") refreshShade();
  })["catch"](function () {});
  if (resp === "play" || resp === "later" || resp === "trash") {
    var pd = parseDare(sh.text),
      d = {
        id: sh.id,
        from: sh.from,
        fromName: sh.fromName,
        target: pd.target,
        game: pd.game
      };
    aDares = aDares.filter(function (x) {
      return x.id !== d.id;
    }).concat([d]).slice(-10);
    store.set("bdd:dares", aDares);
    renderArcSub();
    if (resp === "play") {
      aDare = d;
      playGame(d.game);
    } else if (resp === "trash") {
      openShade(sh.from, {
        fire: true,
        replyTo: sh.id,
        dare: {
          target: fmtG(d.game, d.target),
          gameName: ARC[d.game].name
        }
      });
      toast("Dare saved in the Arcade too.", 1600);
    } else {
      toast("Saved. It's waiting in the Arcade.", 1800);
      setTimeout(maybeServe, 400);
    }
    renderShadeBits();
    return;
  }
  if (resp === "fire") openShade(sh.from, {
    fire: true,
    replyTo: sh.id
  });else if (resp === "clap") {
    chime("pop");
    toast("".concat(emoji, " sent to ").concat(sh.fromName), 1800);
    API("sendShade", me.id, sh.from, KEY, emoji, "clap", sh.id).then(function (s) {
      s.inbox = (s.inbox || []).filter(function (x) {
        return x.id !== sh.id;
      });
      shade = s;
      renderShadeBits();
    })["catch"](function (e) {
      return toast(errMsg(e), 2200);
    });
    setTimeout(maybeServe, 400);
  } else if (resp === "ok") setTimeout(maybeServe, 400);else {
    toast("L taken. Character building.", 1800);
    setTimeout(maybeServe, 400);
  }
  renderShadeBits();
}
$("served-fire").addEventListener("click", function () {
  return finishServe("fire");
});
$("served-l").addEventListener("click", function () {
  return finishServe("L");
});
$("served-ok").addEventListener("click", function () {
  return finishServe("ok");
});
$("served-play").addEventListener("click", function () {
  return finishServe("play");
});
$("served-later").addEventListener("click", function () {
  return finishServe("later");
});
$("served-trash").addEventListener("click", function () {
  return finishServe("trash");
});
["👏", "🫃", "🤡", "🖕", ":dawgpain:", ":dawgclown:"].forEach(function (c) {
  var b = el("button");
  b.dataset.clap = c;
  b.setAttribute("aria-label", "Clap back " + c);
  b.appendChild(emo(c, 36));
  b.addEventListener("click", function () {
    return finishServe("clap", c);
  });
  $("clap-row").appendChild(b);
});
function renderShadeBits() {
  var n = (shade.inbox || []).filter(worthy).length;
  if (n && $("sub-scores")) $("sub-scores").textContent = "\uD83C\uDFAF ".concat(n, " shade").concat(n > 1 ? "s" : "", " waiting for you");
  if (active === "scores") {
    renderScores();
  }
  renderShadeBoard();
  renderSettings();
}
function shadeButton(id) {
  var p = playerInfo(id);
  var used = shade.sentToday[id] || 0;
  var b = el("button", "shadebtn", p.muted ? "🔕" : "🎯");
  b.dataset.shade = id;
  var locked = !p.muted && !beating(id);
  b.setAttribute("aria-label", p.muted ? "".concat(p.name, " has shade muted") : locked ? "Shade at ".concat(p.name, " is locked. Tap to see how to earn it") : "Throw shade at ".concat(p.name));
  if (p.muted || used >= 3) b.classList.add("off");
  if (locked) b.classList.add("locked");
  return b;
}
document.addEventListener("click", function (e) {
  var b = e.target.closest("[data-shade]");
  if (b) openShade(b.dataset.shade);
});
function dayPts(list, by) {
  by = by || {};
  var pts = {};
  list.forEach(function (p) {
    var t = p.t || {},
      b = by[p.id] = {
        f: 0,
        g: 0,
        c: 0,
        s: 0
      };
    pts[p.id] = 0;
    if (t.f) b.f = t.f.w ? Math.min(5, 7 - t.f.n) : 0;
    if (t.g) b.g = t.g.w ? 5 - t.g.m : 0;
    pts[p.id] = b.f + b.g;
  });
  var ranked = function ranked(k, sc) {
    var L = list.filter(function (p) {
        return p.t && p.t[k];
      }),
      S = L.map(function (p) {
        return sc(p.t[k]);
      });
    L.forEach(function (p, i) {
      var r = S.filter(function (x) {
          return x < S[i];
        }).length,
        v = Math.max(1, 6 - r);
      by[p.id][k] = v;
      by[p.id][k + "r"] = r + 1;
      pts[p.id] += v;
    });
  };
  ranked("c", function (c) {
    return c.t + (c.k ? 30 : 0);
  });
  ranked("s", function (x) {
    return x.t + 30 * x.h;
  });
  return pts;
}
function todayList() {
  var list = (board && board.players || []).map(function (p) {
    return {
      id: p.id,
      t: p.t || {}
    };
  });
  if (me) {
    var m = list.find(function (x) {
      return x.id === me.id;
    });
    if (!m) {
      m = {
        id: me.id,
        t: {}
      };
      list.push(m);
    }
    m.t = Object.assign({}, m.t, todayEntry());
  }
  return list;
}
function beating(id) {
  if (!me) return false;
  var list = todayList(),
    mine = list.find(function (x) {
      return x.id === me.id;
    }),
    them = list.find(function (x) {
      return x.id === id;
    });
  var played = function played(x) {
    return x && x.t && (x.t.f || x.t.g || x.t.c || x.t.s);
  };
  if (!played(mine)) return false;
  if (!played(them)) return true;
  var pts = dayPts(list);
  return pts[me.id] > pts[id];
}
function renderSlackers(shown) {
  var box = $("slackers"),
    chips = $("slacker-chips");
  var ids = beating("__nobody__") ? (shade.players || []).map(function (p) {
    return p.id;
  }).filter(function (id) {
    return id !== (me && me.id) && !shown.includes(id);
  }) : [];
  box.hidden = !ids.length;
  chips.innerHTML = "";
  ids.forEach(function (id) {
    var c = el("button", "chip", "🎯 " + playerInfo(id).name);
    c.dataset.shade = id;
    chips.appendChild(c);
  });
}
function renderShadeBoard() {
  var b = shade.board;
  if (!b) return;
  var fill = function fill(ol, list, unit) {
    ol.innerHTML = "";
    if (!list.length) {
      ol.appendChild(el("li", "dim", "Nobody yet"));
      return;
    }
    list.forEach(function (x, i) {
      var li = el("li");
      li.append(el("span", "rk", i + 1), el("span", "nm", x.name), el("span", "ct", "".concat(x.n, " ").concat(unit)));
      ol.appendChild(li);
    });
  };
  fill($("sb-recv"), b.recv, "🎯");
  fill($("sb-sent"), b.sent, "🎯");
  fill($("sb-claps"), b.claps || [], "👏");
  $("sb-ls").textContent = b.ls.length ? "Most Ls taken: ".concat(b.ls[0].name, " (").concat(b.ls[0].n, "). ").concat(b.ls[0].n > 2 ? "A true martyr." : "Humble.") : "";
}
function renderSettings() {
  var s = shade.settings || {};
  document.querySelectorAll("#spice-seg button").forEach(function (b) {
    return b.classList.toggle("on", Number(b.dataset.spice) === (s.spice || 2));
  });
  $("opt-jokes").checked = !!s.jokes;
  $("opt-mute").checked = !!s.mute;
  $("jokes-box").hidden = !s.jokes;
  var ul = $("joke-list");
  ul.innerHTML = "";
  (shade.jokes || []).forEach(function (j) {
    var li = el("li");
    li.append(el("span", null, j.text), el("span", "dim", " · " + j.by));
    if (j.mine) {
      var x = el("button", "textbtn", "Remove");
      x.addEventListener("click", function () {
        return API("deleteJoke", me.id, j.id).then(function (list) {
          shade.jokes = list;
          renderSettings();
        });
      });
      li.appendChild(x);
    }
    ul.appendChild(li);
  });
  if (!(shade.jokes || []).length) ul.appendChild(el("li", "dim", "No inside jokes yet. Add the first one."));
}
document.querySelectorAll("#spice-seg button").forEach(function (b) {
  return b.addEventListener("click", function () {
    saveShadeSettings({
      spice: Number(b.dataset.spice)
    });
    toast("Spice: ".concat(SPICE[b.dataset.spice]));
  });
});
$("opt-jokes").addEventListener("change", function (e) {
  return saveShadeSettings({
    jokes: e.target.checked
  });
});
$("opt-mute").addEventListener("change", function (e) {
  saveShadeSettings({
    mute: e.target.checked
  });
  toast(e.target.checked ? "Shade muted. Peace and quiet." : "Shade unmuted. Brace yourself.");
});
$("joke-add").addEventListener("click", function () {
  var v = $("joke-in").value.trim();
  if (!v) return;
  API("addJoke", me.id, v).then(function (list) {
    shade.jokes = list;
    $("joke-in").value = "";
    renderSettings();
    toast("Inside joke added");
  })["catch"](function (e) {
    return toast(errMsg(e), 2400);
  });
});
function autoTags(t) {
  var out = {},
    tag = function tag(k, code, why) {
      var e = emo(code, 18);
      e.classList.add("tag");
      e.title = why;
      out[k] = [e];
    };
  if (t.f) {
    if (!t.f.w) tag("f", ":dawgL:", "X/6");else if (t.f.n === 6) tag("f", ":dawgsweat:", "Phew, 6/6");else if (t.f.n <= 2) tag("f", ":dawgW:", "Genius");
  }
  if (t.g) {
    if (!t.g.w) tag("g", ":dawgpain:", "Out of mistakes");else if (t.g.m === 0) tag("g", ":dawgpog:", "Perfect sort");
  }
  if (t.s && t.s.h >= 3) tag("s", ":dawgcope:", "Lots of hints");
  if (t.c) {
    if (!t.c.k && t.c.t < 30) tag("c", ":dawgsus:", "Suspiciously fast");else if (t.c.t > 300) tag("c", ":dawgskull:", "Over 5 minutes");
  }
  return out;
}
function openDawgPicker(toId) {
  var p = board && board.players.find(function (q) {
    return q.id === toId;
  });
  if (!p) return;
  var grid = el("div", "dawggrid");
  DAWG_KEYS.forEach(function (k) {
    var code = ":" + k + ":",
      on = (p.rm || []).includes(code);
    var b = el("button", on ? "on" : "");
    b.dataset.react = code;
    b.dataset.to = toId;
    b.append(emo(code, 48), el("span", null, code));
    grid.appendChild(b);
  });
  openModal([el("h2", null, "React to " + p.name), grid]);
}
var fxOn = function fxOn() {
  return store.get("bdd:fx") !== 0;
};
function confetti() {
  var n = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 90;
  if (!fxOn() || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  var box = el("div", "confetti");
  document.body.appendChild(box);
  var colors = ["#6aaa64", "#c9b458", "#b0c4ef", "#ba81c5", "#f9df6d", "#ff7b6b"];
  for (var i = 0; i < n; i++) {
    var p = el("i");
    p.style.left = Math.random() * 100 + "%";
    p.style.background = colors[i % colors.length];
    p.style.animationDelay = Math.random() * 0.5 + "s";
    p.style.animationDuration = 1.6 + Math.random() * 1.2 + "s";
    p.style.setProperty("--dx", Math.random() * 160 - 80 + "px");
    p.style.setProperty("--r", Math.random() * 900 - 450 + "deg");
    box.appendChild(p);
  }
  var DOGS = ["🐶", "🐕", "🐶", "🐩", "🦴", "🐾", ":dawgW:", ":dawgpog:"];
  for (var _i = 0; _i < Math.round(n / 4); _i++) {
    var code = DOGS[Math.floor(Math.random() * DOGS.length)];
    var d = el("span", "dog");
    d.appendChild(emo(code, 30 + Math.round(Math.random() * 14)));
    d.style.left = Math.random() * 94 + "%";
    d.style.animationDelay = Math.random() * 0.9 + "s";
    d.style.animationDuration = 2 + Math.random() * 1.4 + "s";
    d.style.setProperty("--dx", Math.random() * 80 - 40 + "px");
    d.style.setProperty("--r", Math.random() * 120 - 60 + "deg");
    box.appendChild(d);
  }
  setTimeout(function () {
    return box.remove();
  }, 4600);
}
var actx = null;
function chime() {
  var kind = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "win";
  if (!fxOn()) return;
  try {
    actx = actx || new (window.AudioContext || window.webkitAudioContext)();
    var notes = {
      win: [523, 659, 784, 1047],
      pass: [392, 523, 659, 784],
      pop: [880],
      lose: [330, 262]
    }[kind] || [660];
    notes.forEach(function (f, i) {
      var o = actx.createOscillator(),
        g = actx.createGain(),
        t = actx.currentTime + i * 0.11;
      o.type = "triangle";
      o.frequency.value = f;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.16, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);
      o.connect(g);
      g.connect(actx.destination);
      o.start(t);
      o.stop(t + 0.4);
    });
  } catch (e) {}
}
function celebrate() {
  confetti();
  chime("win");
}
function announcePasses(before, after) {
  if (!me || !before.length) return;
  var bi = function bi(id) {
    var i = before.findIndex(function (x) {
      return x.id === id;
    });
    return i < 0 ? before.length : i;
  };
  var ai = function ai(id) {
    var i = after.findIndex(function (x) {
      return x.id === id;
    });
    return i < 0 ? after.length : i;
  };
  var passed = before.filter(function (x) {
    return x.id !== me.id && bi(x.id) < bi(me.id) && ai(x.id) > ai(me.id);
  }).map(function (x) {
    return x.name;
  });
  if (!passed.length) return;
  var names = passed.length > 2 ? "".concat(passed.slice(0, 2).join(", "), " and ").concat(passed.length - 2, " more") : passed.join(" and ");
  setTimeout(function () {
    toast("\uD83D\uDE80 You just passed ".concat(names, "!"), 2600);
    chime("pass");
    confetti(40);
  }, 2400);
}
var stats = null,
  statsAt = 0;
function refreshStats() {
  if (!me) return Promise.resolve();
  statsAt = Date.now();
  return API("getStats", me.id, KEY).then(function (st) {
    stats = st;
    store.set("bdd:stats", {
      k: KEY,
      s: st,
      c: crewSel
    });
    setTimeout(maybeWeekReview, 1500);
    renderLeague();
    if (active === "scores") renderScores();
    if (active === "home") renderHome();
  })["catch"](function () {
    statsAt = 0;
  });
}
function bannerText() {
  if (!stats) return "";
  var d = now.getDay();
  if (stats.lastChamp && (d === 1 || d === 2)) return "\uD83C\uDFC6 ".concat(stats.lastChamp.name, " won last week");
  if (stats.crown.length) return "\uD83D\uDC51 ".concat(stats.crown.map(function (c) {
    return c.name;
  }).join(" & "));
  return stats.week.length ? "\uD83D\uDCC8 ".concat(stats.week[0].name, " leads") : "";
}
function weekMath(by, start) {
  var box = el("div", "wk-wrap"),
    tb = el("table", "wk-math"),
    hd = el("tr");
  ["Day", "Five", "Groups", "Mini", "Strands", "Pts"].forEach(function (h) {
    return hd.appendChild(el("th", null, h));
  });
  tb.appendChild(hd);
  var map = {};
  (by || []).forEach(function (x) {
    return map[x.d] = x;
  });
  var _loop = function _loop() {
    var p = start.split("-").map(Number),
      dt = new Date(p[0], p[1] - 1, p[2] + i),
      d = "".concat(dt.getFullYear(), "-").concat(String(dt.getMonth() + 1).padStart(2, "0"), "-").concat(String(dt.getDate()).padStart(2, "0"));
    if (d > KEY) return 1;
    var x = map[d],
      tr = el("tr", x ? x.k ? "in" : "out" : "na");
    tr.appendChild(el("td", null, dt.toLocaleDateString(undefined, {
      weekday: "short"
    })));
    if (x) [x.f, x.g, x.c, x.s, x.p].forEach(function (v) {
      return tr.appendChild(el("td", null, String(v)));
    });else {
      var td = el("td", null, "didn't play");
      td.colSpan = 5;
      tr.appendChild(td);
    }
    tb.appendChild(tr);
  };
  for (var i = 0; i < 7; i++) {
    if (_loop()) break;
  }
  var used = (by || []).filter(function (x) {
      return x.k;
    }).sort(function (a, b) {
      return b.p - a.p;
    }),
    cut = (by || []).filter(function (x) {
      return !x.k;
    });
  var sum = el("p", "wk-sum");
  sum.innerHTML = "Best ".concat(used.length, " day").concat(used.length === 1 ? "" : "s", ": ").concat(used.map(function (x) {
    return x.p;
  }).join(" + ") || "0", " = <b>").concat(used.reduce(function (a, x) {
    return a + x.p;
  }, 0), "</b>") + (cut.length ? " \xB7 ".concat(cut.length, " lower day").concat(cut.length > 1 ? "s" : "", " dropped") : "");
  box.append(tb, sum);
  return box;
}
var wkOpen = new Set();
function wkToggle(btn, li, key, by, start, tag) {
  btn.classList.add("ct-btn");
  var open = function open() {
    var d = el(tag || "li", "wk-li");
    d.appendChild(weekMath(by, start));
    li.after(d);
    btn.classList.add("open");
    return d;
  };
  var det = wkOpen.has(key) ? open() : null;
  btn.addEventListener("click", function (e) {
    e.stopPropagation();
    if (det) {
      det.remove();
      det = null;
      btn.classList.remove("open");
      wkOpen["delete"](key);
    } else {
      det = open();
      wkOpen.add(key);
    }
  });
}
function renderLeague() {
  var box = $("league");
  if (!stats) {
    box.hidden = true;
    return;
  }
  box.hidden = false;
  var fmt = function fmt(k) {
    var p = k.split("-").map(Number);
    return new Date(p[0], p[1] - 1, p[2]).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric"
    });
  };
  $("league-range").textContent = "Since ".concat(fmt(stats.weekStart));
  var ol = $("league-list");
  ol.innerHTML = "";
  if (!stats.week.length) ol.appendChild(el("li", "dim", "No points yet this week. Go get some."));
  stats.week.slice(0, 8).forEach(function (x) {
    var rk = 1 + stats.week.filter(function (y) {
      return y.pts > x.pts;
    }).length;
    var li = el("li", (rk === 1 && x.pts > 0 ? "lead" : "") + (me && x.id === me.id ? " league-me" : ""));
    var nm = el("button", "nm", x.name);
    nm.dataset.card = x.id;
    nm.style.textAlign = "left";
    var ct = el(x.by ? "button" : "span", "ct", "".concat(x.pts, " pts"));
    li.append(el("span", "rk", rk), nm, ct);
    ol.appendChild(li);
    if (x.by) wkToggle(ct, li, "w:" + x.id, x.by, stats.weekStart);
  });
  renderAwards();
  var lc = $("league-champ");
  lc.innerHTML = "";
  if (!stats.lastChamp) lc.textContent = "Weekly champ is crowned every Sunday night.";else {
    lc.append("\uD83C\uDFC6 Last week's champ: ".concat(stats.lastChamp.name, " with "));
    var pb = el(stats.lastChamp.by ? "button" : "span", null, "".concat(stats.lastChamp.pts, " pts"));
    lc.append(pb);
    if (stats.lastChamp.by) {
      var p = stats.weekStart.split("-").map(Number),
        w = new Date(p[0], p[1] - 1, p[2] - 7),
        ws = "".concat(w.getFullYear(), "-").concat(String(w.getMonth() + 1).padStart(2, "0"), "-").concat(String(w.getDate()).padStart(2, "0"));
      wkToggle(pb, lc, "lc", stats.lastChamp.by, ws, "div");
    }
  }
}
function scoreTab(t) {
  document.querySelectorAll("#sc-tabs button").forEach(function (b) {
    return b.classList.toggle("on", b.dataset.tab === t);
  });
  document.querySelectorAll("#v-scores .pane").forEach(function (p) {
    return p.hidden = p.dataset.pane !== t;
  });
  var sc = document.querySelector("#v-scores .scroll");
  if (sc) sc.scrollTop = 0;
}
$("home-settings").addEventListener("click", function () {
  show("scores");
  scoreTab("more");
});
document.querySelectorAll("#sc-tabs button").forEach(function (b) {
  return b.addEventListener("click", function () {
    scoreTab(b.dataset.tab);
    if (b.dataset.tab === "arcade") refreshArcade();
    if (b.dataset.tab === "week") loadAllTime();
  });
});
var allTime = null,
  allTimeK = "month";
function loadAllTime() {
  if (!me) return;
  API("getAllTime", me.id, KEY).then(function (r) {
    allTime = r || [];
    renderAllTime();
    renderPhof();
  })["catch"](function (e) {
    $("alltime-list").innerHTML = "";
    $("alltime-list").appendChild(el("li", "dim", /newest server|not a function/i.test(errMsg(e)) ? "Turns on after the next server update." : errMsg(e)));
  });
}
function renderAllTime() {
  var ol = $("alltime-list");
  if (!allTime) return;
  ol.innerHTML = "";
  if (Array.isArray(allTime)) {
    ol.appendChild(el("li", "dim", "Turns on after the next server update."));
    return;
  }
  var k = allTimeK,
    mName = function mName(d) {
      return new Date(d + "T12:00:00").toLocaleDateString(undefined, {
        month: "long"
      });
    };
  if (k === "champs") {
    var ch = allTime.champs || [];
    $("alltime-note").textContent = "Every weekly league champ (best 5 days, Monday to Sunday). Most titles listed first below the list.";
    $("alltime-sub").textContent = "".concat(ch.length, " week").concat(ch.length === 1 ? "" : "s");
    if (!ch.length) {
      ol.appendChild(el("li", "dim", "No finished weeks yet. First champ is crowned Sunday night."));
      return;
    }
    ch.forEach(function (c) {
      var li = el("li", "at-row" + (c.id === (me && me.id) ? " me" : "")),
        nmb = el("button", "pname tap", c.name);
      nmb.dataset.card = c.id;
      var d = new Date(c.week + "T12:00:00"),
        lab = "Week of " + d.toLocaleDateString(undefined, {
          month: "short",
          day: "numeric"
        });
      var left = el("span", "at-left");
      left.append(el("span", "rank r1", "🏆"), nmb);
      var right = el("span", "at-right"),
        pb = el(c.by ? "button" : "b", null, String(c.pts));
      right.append(pb, el("small", null, lab));
      li.append(left, right);
      ol.appendChild(li);
      if (c.by) {
        pb.style.fontWeight = "800";
        wkToggle(pb, li, "c:" + c.week, c.by, c.week);
      }
    });
    var tally = {};
    ch.forEach(function (c) {
      tally[c.name] = (tally[c.name] || 0) + 1;
    });
    $("alltime-note").textContent = "Weekly league champs, newest first. Most titles: " + Object.keys(tally).sort(function (a, b) {
      return tally[b] - tally[a];
    }).slice(0, 3).map(function (n) {
      return "".concat(n, " \xD7").concat(tally[n]);
    }).join(", ") + ".";
    return;
  }
  var list = (allTime[k] || []).filter(function (r) {
    return k !== "all" || r.days >= 3;
  });
  $("alltime-note").textContent = k === "month" ? "".concat(mName(allTime.monthKey), " standings: your best 20 days count, so days off won't sink you.") + (allTime.lastMonth ? " \uD83C\uDFC6 ".concat(mName(allTime.lastMonth.key), " champ: ").concat(allTime.lastMonth.name, " (").concat(allTime.lastMonth.pts, ").") : "") : k === "year" ? "".concat(allTime.yearKey, " standings: your best 200 days count.") : "All time ranks by average points per day played (10+ days to be ranked at the top), so newer players can compete. Tap a name for their stats.";
  if (!list.length) {
    ol.appendChild(el("li", "dim", "No games yet."));
    return;
  }
  list.slice(0, 25).forEach(function (r, i) {
    var li = el("li" + "", r.id === (me && me.id) ? "me" : null);
    var nmb = el("button", "pname tap", r.name);
    nmb.dataset.card = r.id;
    var main = k === "all" ? r.avg.toFixed(1) + "/day" : String(r.pts);
    var sub = "".concat(r.days, " day").concat(r.days === 1 ? "" : "s", " \xB7 ").concat(r.avg.toFixed(1), "/day \xB7 \uD83D\uDC51 ").concat(r.wins) + (r.titles ? " \xB7 \uD83C\uDFC6 ".concat(r.titles) : "") + (k === "all" ? " \xB7 ".concat(r.total, " pts") : "") + (k === "all" && r.days < 10 ? " · new" : "");
    var left = el("span", "at-left");
    left.append(el("span", "rank" + (i === 0 ? " r1" : ""), i + 1), nmb);
    var right = el("span", "at-right");
    right.append(el("b", null, main), el("small", null, sub));
    li.className = (li.className ? li.className + " " : "") + "at-row";
    li.append(left, right);
    ol.appendChild(li);
  });
  $("alltime-sub").textContent = k === "month" ? mName(allTime.monthKey) : k === "year" ? allTime.yearKey : "".concat(list.length, " players");
}
var phofK = "mini";
function renderPhof() {
  var ol = $("phof-list");
  ol.innerHTML = "";
  var h = allTime && !Array.isArray(allTime) && allTime.hof;
  if (!h) {
    ol.appendChild(el("li", "dim", allTime ? "Turns on after the next server update." : "Loading…"));
    return;
  }
  var k = phofK,
    list = h[k] || [],
    medal = ["🥇", "🥈", "🥉", "4", "5"];
  $("phof-note").textContent = k === "mini" ? "Fastest Mini ever, no Check. Personal bests." : k === "strands" ? "Fastest Strands ever, no hints. Personal bests." : k === "five" ? "Best average guesses (a miss counts as 7). 7+ games to qualify. 🧠 = solved in 1 or 2." : "Fewest mistakes on average (a loss counts as 4). 7+ games to qualify. 💎 = perfect games.";
  if (!list.length) {
    ol.appendChild(el("li", "dim", k === "five" || k === "groups" ? "Nobody has 7 games in yet." : "No records yet."));
    return;
  }
  list.forEach(function (r, i) {
    var li = el("li", "at-row" + (r.id === (me && me.id) ? " me" : "")),
      nmb = el("button", "pname tap", r.name);
    nmb.dataset.card = r.id;
    var left = el("span", "at-left");
    left.append(el("span", "rank" + (i === 0 ? " r1" : ""), medal[i]), nmb);
    var right = el("span", "at-right");
    if (k === "mini" || k === "strands") right.append(el("b", null, fmtTime(r.v)), el("small", null, new Date(r.d + "T12:00:00").toLocaleDateString(undefined, {
      month: "short",
      day: "numeric"
    })));else right.append(el("b", null, r.v.toFixed(2)), el("small", null, "".concat(r.n, " games \xB7 ").concat(k === "five" ? "🧠" : "💎", " ").concat(r.best)));
    li.append(left, right);
    ol.appendChild(li);
  });
}
document.querySelectorAll("#phof-seg button").forEach(function (b) {
  return b.addEventListener("click", function () {
    phofK = b.dataset.k;
    document.querySelectorAll("#phof-seg button").forEach(function (x) {
      return x.classList.toggle("on", x === b);
    });
    renderPhof();
  });
});
document.querySelectorAll("#alltime-seg button").forEach(function (b) {
  return b.addEventListener("click", function () {
    allTimeK = b.dataset.k;
    document.querySelectorAll("#alltime-seg button").forEach(function (x) {
      return x.classList.toggle("on", x === b);
    });
    renderAllTime();
  });
});
var AWARDS = {
  grinder: ["🐶", "Grinder"],
  speed: ["⚡", "Speed Demon"],
  sniper: ["🧵", "Strand Sniper"],
  brain: ["🧠", "Big Brain"],
  sweep: ["💎", "Clean Sweep"],
  choke: [":dawgL:", "Biggest Choke"],
  merchant: ["🎯", "Shade Merchant"],
  bag: [":dawgpain:", "Punching Bag"],
  clapper: ["👏", "Clapback King"],
  fav: ["😂", "Fan Favorite"]
};
function renderAwards() {
  var box = $("awards");
  if (!stats || !stats.awards) {
    box.hidden = true;
    return;
  }
  var d = now.getDay(),
    last = (d === 1 || d === 2) && stats.lastAwards && stats.lastAwards.length;
  var list = last ? stats.lastAwards : stats.awards;
  box.hidden = false;
  $("awards-title").textContent = last ? "Last week's awards" : "Weekly awards";
  $("awards-sub").textContent = last ? "Final" : "So far · final Sunday night";
  var ul = $("awards-list");
  ul.innerHTML = "";
  if (!list.length) {
    ul.appendChild(el("li", "dim", "Nothing yet. Play a game and grab one."));
    return;
  }
  list.forEach(function (a) {
    var m = AWARDS[a.key];
    if (!m) return;
    var ids = a.ids || [a.id],
      nms = a.names || [a.name];
    var li = el("li", "award" + (me && ids.includes(me.id) ? " mine" : ""));
    var ic = el("span", "ic");
    ic.appendChild(emo(m[0], 24));
    var tx = el("div", "tx"),
      who = el("div");
    ids.forEach(function (id, i) {
      if (i) who.appendChild(document.createTextNode(" & "));
      var nm = el("button", null, nms[i]);
      nm.dataset.card = id;
      who.appendChild(nm);
    });
    tx.append(el("span", null, m[1]), who, el("small", null, a.why));
    li.append(ic, tx);
    ul.appendChild(li);
  });
}
var BADGES = [["crowns", "👑", "Daily wins", function (v) {
  return v > 0;
}], ["titles", "🏆", "Weekly titles", function (v) {
  return v > 0;
}], ["genius", "🧠", "Five in 1 or 2", function (v) {
  return v > 0;
}], ["perfectGroups", "💎", "Perfect Groups", function (v) {
  return v > 0;
}], ["quickMini", "⚡", "Mini under 0:30", function (v) {
  return v > 0;
}], ["quickStrands", "🧵", "Strands under 2:00, no hints", function (v) {
  return v > 0;
}], ["bestStreak", "🔥", "Best streak (days)", function (v) {
  return v >= 3;
}], ["perfectWeek", "💯", "Perfect week: all 4 games, 7 days", function (v) {
  return !!v;
}]];
function statsBlock(s, mine, name) {
  var box = el("div", "pstats");
  box.appendChild(el("h3", "lbl2", "Stats"));
  var top = el("div", "pst-top");
  [[s.played, "Played"], [s.winPct + "%", "Five win %"], [s.cur || 0, "Streak"], [s.best || 0, "Best streak"]].forEach(function (_ref13) {
    var _ref14 = _slicedToArray(_ref13, 2),
      v = _ref14[0],
      l = _ref14[1];
    var d = el("div");
    d.append(el("b", null, String(v)), el("small", null, l));
    top.appendChild(d);
  });
  box.appendChild(top);
  if (mine) box.appendChild(el("p", "sub pst-key", "Solid = ".concat(name, " \xB7 light = you")));
  var bars = function bars(title, labels, a, b, goodIdx) {
    var sec = el("div", "pst-sec");
    sec.appendChild(el("h4", null, title));
    var max = Math.max.apply(Math, [1].concat(_toConsumableArray(a), _toConsumableArray(b || [])));
    labels.forEach(function (lb, i) {
      var row = el("div", "pst-row"),
        track = el("div", "pst-track");
      var bar = el("div", "pst-bar" + (i >= goodIdx ? " meh" : ""));
      bar.style.width = Math.max(a[i] ? 8 : 0, 100 * a[i] / max) + "%";
      bar.textContent = a[i] ? a[i] : "";
      if (!a[i]) {
        bar.style.padding = "0";
        bar.style.minHeight = "16px";
        bar.style.background = "transparent";
      }
      track.appendChild(bar);
      if (b) {
        var _g = el("div", "pst-ghost");
        _g.style.width = 100 * b[i] / max + "%";
        track.appendChild(_g);
      }
      row.append(el("span", null, lb), track);
      sec.appendChild(row);
    });
    return sec;
  };
  box.appendChild(bars("Five: solved in", ["1", "2", "3", "4", "5", "6", "X"], s.five, mine && mine.five, 6));
  box.appendChild(bars("Groups: mistakes", ["0", "1", "2", "3", "X"], s.groups, mine && mine.groups, 4));
  var timed = function timed(title, x, y, extra, extraY) {
    var sec = el("div", "pst-sec");
    sec.appendChild(el("h4", null, title));
    if (!x.n) {
      sec.appendChild(el("p", "sub", "Not played yet."));
      return sec;
    }
    var avg = Math.round(x.sum / x.n),
      line = "Avg ".concat(fmtTime(avg), " \xB7 Best ").concat(fmtTime(x.best), " \xB7 ").concat(extra) + (y && y.n ? "  (you: avg ".concat(fmtTime(Math.round(y.sum / y.n))).concat(extraY ? ", " + extraY : "", ")") : "");
    sec.appendChild(el("p", "pst-line", line));
    var tr = x.trend;
    if (tr.length >= 2) {
      var W = 260,
        H = 44,
        mx = Math.max.apply(Math, _toConsumableArray(tr)),
        mn = Math.min.apply(Math, _toConsumableArray(tr)),
        sp = Math.max(1, mx - mn);
      var pts = tr.map(function (v, i) {
        return "".concat((i / (tr.length - 1) * (W - 8) + 4).toFixed(1), ",").concat((4 + (v - mn) / sp * (H - 8)).toFixed(1));
      }).join(" ");
      var wrap = el("div", "pst-trend");
      wrap.innerHTML = "<svg viewBox=\"0 0 ".concat(W, " ").concat(H, "\" width=\"100%\" height=\"").concat(H, "\" preserveAspectRatio=\"none\"><polyline points=\"").concat(pts, "\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.5\" stroke-linejoin=\"round\" stroke-linecap=\"round\"/></svg><small>Last ").concat(tr.length, " days \xB7 higher = faster</small>");
      sec.appendChild(wrap);
    }
    return sec;
  };
  var flip = function flip(x) {
    return Object.assign({}, x, {
      trend: x.trend.map(function (v) {
        return -v;
      })
    });
  };
  box.appendChild(timed("Strands", flip(s.st), mine && mine.st, "hints ".concat(s.st.n ? Math.round(100 * s.st.hints / s.st.n) : 0, "% of days"), mine && mine.st.n ? "hints ".concat(Math.round(100 * mine.st.hints / mine.st.n), "%") : ""));
  box.appendChild(timed("Mini", flip(s.mi), mine && mine.mi, "Check ".concat(s.mi.n ? Math.round(100 * s.mi.checks / s.mi.n) : 0, "% of days"), mine && mine.mi.n ? "Check ".concat(Math.round(100 * mine.mi.checks / mine.mi.n), "%") : ""));
  var form = el("div", "pst-sec");
  form.appendChild(el("h4", null, "Last 7 days"));
  var g = el("div", "pst-form");
  g.appendChild(el("span"));
  ["F", "G", "S", "M"].forEach(function (h) {
    return g.appendChild(el("small", null, h));
  });
  var col = function col(v) {
    return v === 2 ? "good" : v === 1 ? "ok" : v === 0 ? "bad" : "none";
  };
  s.form.forEach(function (f) {
    var dt = new Date(f.d + "T12:00:00");
    g.appendChild(el("small", "pst-day", dt.toLocaleDateString(undefined, {
      weekday: "short"
    })));
    ["f", "g", "s", "c"].forEach(function (k) {
      return g.appendChild(el("i", "pst-sq " + col(f[k])));
    });
  });
  form.appendChild(g);
  form.appendChild(el("p", "sub pst-key", "🟩 great · 🟨 got it (more guesses, mistakes, hints or Check) · ⬛ missed · blank = didn't play"));
  box.appendChild(form);
  return box;
}
function joinButtons(reqId, who, crew) {
  var row = el("div", "inrow"),
    yes = el("button", "pill solid", "Let them in"),
    no = el("button", "pill", "No thanks");
  var go = function go(ok) {
    yes.disabled = no.disabled = true;
    API("answerJoin", me.id, reqId, ok, KEY).then(function (r) {
      setCrews(r.crews);
      shade = r.shade;
      renderBell();
      row.replaceWith(el("small", null, ok ? "\u2713 ".concat(who, " is in ").concat(crew || "the crew") : "Request closed"));
      if (ok) toast("".concat(who, " joined ").concat(crew || "the crew", " \uD83D\uDC36"), 2000);
    })["catch"](function (e) {
      yes.disabled = no.disabled = false;
      toast(errMsg(e), 2400);
    });
  };
  yes.addEventListener("click", function (e) {
    e.stopPropagation();
    go(true);
  });
  no.addEventListener("click", function (e) {
    e.stopPropagation();
    go(false);
  });
  row.append(yes, no);
  return row;
}
function addToCrewBtn(crewId, crewName, id, name, after) {
  var b = el("button", "pill solid", "\u2795 Add ".concat(name, " to ").concat(crewName));
  b.addEventListener("click", function (e) {
    e.stopPropagation();
    b.disabled = true;
    API("addToCrew", me.id, crewId, id, KEY).then(function (r) {
      setCrews(r.crews);
      b.textContent = "\u2713 ".concat(name, " is in ").concat(crewName);
      b.className = "pill";
      toast("".concat(name, " added to ").concat(crewName, " \uD83D\uDC36"), 2000);
      if (crewSel === crewId) {
        switchCrew("all");
        switchCrew(crewId);
      }
      if (after) after();
    })["catch"](function (err) {
      b.disabled = false;
      toast(errMsg(err), 2400);
    });
  });
  return b;
}
function askButtons(c) {
  var box = el("div", "col");
  (c.canAdd || []).forEach(function (k) {
    return box.appendChild(addToCrewBtn(k.id, k.name, c.id, c.name));
  });
  (c.canAsk || []).forEach(function (k) {
    var b = el("button", k.asked ? "pill" : "pill solid", k.asked ? "Asked to join ".concat(k.name, " \u2713") : "\uD83D\uDE4B Ask to join ".concat(k.name));
    b.disabled = !!k.asked;
    b.addEventListener("click", function () {
      b.disabled = true;
      API("requestJoin", me.id, k.id, KEY).then(function () {
        b.textContent = "Asked to join ".concat(k.name, " \u2713");
        b.className = "pill";
        toast("Request sent. The crew owner decides.", 2200);
      })["catch"](function (e) {
        b.disabled = false;
        toast(errMsg(e), 2400);
      });
    });
    box.appendChild(b);
  });
  return box;
}
function openCard(id) {
  if (!me) return;
  var p = playerInfo(id),
    isMe = id === me.id;
  var body = el("div", "stack");
  body.appendChild(el("p", "sub", "Loading trophies…"));
  openModal([el("h2", null, isMe ? "Your trophy case" : p.name), body]);
  API("getPlayerCard", me.id, id, KEY).then(function (c) {
    body.innerHTML = "";
    var b = c.badges;
    body.appendChild(el("p", "sub", "".concat(b.played, " day").concat(b.played === 1 ? "" : "s", " played")));
    var grid = el("div", "badges");
    BADGES.forEach(function (_ref15) {
      var _ref16 = _slicedToArray(_ref15, 4),
        k = _ref16[0],
        icon = _ref16[1],
        label = _ref16[2],
        earned = _ref16[3];
      var v = b[k],
        d = el("div", "badge" + (earned(v) ? "" : " off"));
      var txt = el("span", null, label);
      txt.appendChild(el("small", null, typeof v === "boolean" ? v ? "Earned" : "Locked" : String(v)));
      d.append(el("b", null, icon), txt);
      grid.appendChild(d);
    });
    body.appendChild(grid);
    if (c.canAsk && c.canAsk.length || c.canAdd && c.canAdd.length) body.appendChild(askButtons(c));
    if (c.stats) body.appendChild(statsBlock(c.stats, c.mine, isMe ? null : c.name));
    if (c.h2h) {
      var h = c.h2h,
        tot = [0, 1, 2].map(function (i) {
          return h.five[i] + h.groups[i] + h.mini[i] + h.strands[i];
        });
      var box = el("div", "h2h");
      box.appendChild(el("h3", "lbl2", "You vs ".concat(c.name, ", all time")));
      box.appendChild(el("div", "big", "".concat(tot[0], "\u2013").concat(tot[1]) + (tot[2] ? "\u2013".concat(tot[2]) : "")));
      box.appendChild(el("p", "sub", tot[0] + tot[1] + tot[2] === 0 ? "No games head-to-head yet." : tot[0] > tot[1] ? "You own ".concat(c.name, ". For now.") : tot[0] < tot[1] ? "".concat(c.name, " has your number.") : "Dead even. Settle it today."));
      [["five", "Five"], ["groups", "Groups"], ["strands", "Strands"], ["mini", "Mini"]].forEach(function (_ref17) {
        var _ref18 = _slicedToArray(_ref17, 2),
          k = _ref18[0],
          label = _ref18[1];
        var r = el("div", "row2");
        r.append(el("span", null, label), el("b", null, "".concat(h[k][0], "\u2013").concat(h[k][1]) + (h[k][2] ? "\u2013".concat(h[k][2]) : "")));
        box.appendChild(r);
      });
      body.appendChild(box);
      if (shadeLoaded && beating(id)) {
        var sb = el("button", "pill solid", "\uD83C\uDFAF Throw shade at ".concat(c.name));
        sb.addEventListener("click", function () {
          closeModal();
          setTimeout(function () {
            return openShade(id);
          }, 50);
        });
        body.appendChild(sb);
      }
    }
  })["catch"](function (e) {
    body.innerHTML = "";
    body.appendChild(el("p", "sub", errMsg(e)));
  });
}
document.addEventListener("click", function (e) {
  var b = e.target.closest("[data-card]");
  if (b) openCard(b.dataset.card);
});
document.addEventListener("click", function (e) {
  var b = e.target.closest("[data-dawgs]");
  if (b) openDawgPicker(b.dataset.dawgs);
});
var REACTS = ["😂", "🔥", "💀", "👏", "🤡"];
function reactBar(x) {
  var p = board && board.players.find(function (q) {
    return q.id === x.id;
  }) || {};
  var r = p.r || {},
    rm = p.rm || [];
  var bar = el("div", "reacts");
  var used = Object.keys(r).filter(function (e) {
    return r[e] && isDawg(e);
  });
  var chip = function chip(tag, e, n) {
    var c = el(tag, tag === "button" && rm.includes(e) ? "on" : "");
    c.appendChild(emo(e, 18));
    if (n) c.appendChild(document.createTextNode(String(n)));
    return c;
  };
  if (x.id === me.id || !isMate(x.id)) {
    REACTS.concat(used).filter(function (e) {
      return r[e];
    }).forEach(function (e) {
      return bar.appendChild(chip("span", e, r[e]));
    });
    return bar;
  }
  if (!doneCount(x)) return bar;
  REACTS.concat(used).forEach(function (e) {
    var b = chip("button", e, r[e]);
    b.dataset.react = e;
    b.dataset.to = x.id;
    b.setAttribute("aria-label", "React ".concat(e, " to ").concat(x.name));
    bar.appendChild(b);
  });
  var more = el("button", "more");
  more.append(emo(":dawgpog:", 18), document.createTextNode("+"));
  more.dataset.dawgs = x.id;
  more.setAttribute("aria-label", "More reactions for ".concat(x.name));
  bar.appendChild(more);
  return bar;
}
document.addEventListener("click", function (e) {
  var b = e.target.closest("[data-react]");
  if (!b || !me) return;
  var emoji = b.dataset.react,
    to = b.dataset.to;
  var p = board && board.players.find(function (q) {
    return q.id === to;
  });
  if (!p) return;
  p.r = p.r || {};
  p.rm = p.rm || [];
  if (p.rm.includes(emoji)) {
    p.rm = p.rm.filter(function (x) {
      return x !== emoji;
    });
    p.r[emoji] = Math.max(0, (p.r[emoji] || 1) - 1);
    if (!p.r[emoji]) delete p.r[emoji];
  } else {
    p.rm.push(emoji);
    p.r[emoji] = (p.r[emoji] || 0) + 1;
    chime("pop");
  }
  renderScores();
  if (b.closest(".dawggrid")) closeModal();
  API("react", me.id, to, KEY, emoji).then(function (nb) {
    board = nb;
    if (active === "scores") renderScores();
  })["catch"](function (err) {
    return toast(errMsg(err), 2200);
  });
});
$("opt-fx").checked = fxOn();
$("opt-fx").addEventListener("change", function (e) {
  store.set("bdd:fx", e.target.checked ? 1 : 0);
  if (e.target.checked) {
    chime("pop");
    confetti(30);
  }
});