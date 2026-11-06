function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
(function () {
  var NAMES = ["YOU", "REX", "DUKE"],
    FACES = [null, "🐕", "🐶"];
  var TC = ["#d32f2f", "#1565c0", "#ef6c00", "#263238"],
    SHAPE = ["●", "■", "▲", "◆"];
  var shuffle = function shuffle(a) {
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var _ref = [a[j], a[i]];
      a[i] = _ref[0];
      a[j] = _ref[1];
    }
    return a;
  };
  var rr = function rr(c, x, y, w, h, r) {
    c.beginPath();
    if (c.roundRect) c.roundRect(x, y, w, h, r);else c.rect(x, y, w, h);
  };
  var tpts = function tpts(t) {
    return t.j ? 30 : t.n;
  };
  function arrange(set) {
    if (set.length < 3) return null;
    var js = set.filter(function (t) {
        return t.j;
      }),
      nj = set.filter(function (t) {
        return !t.j;
      });
    if (!nj.length) return set.length <= 13 ? set.map(function (t, i) {
      return {
        t: t,
        v: i + 1
      };
    }) : null;
    if (set.length <= 4 && nj.every(function (t) {
      return t.n === nj[0].n;
    }) && new Set(nj.map(function (t) {
      return t.c;
    })).size === nj.length) return nj.map(function (t) {
      return {
        t: t,
        v: t.n
      };
    }).concat(js.map(function (t) {
      return {
        t: t,
        v: nj[0].n
      };
    }));
    if (nj.every(function (t) {
      return t.c === nj[0].c;
    }) && new Set(nj.map(function (t) {
      return t.n;
    })).size === nj.length && set.length <= 13) {
      var s = nj.slice().sort(function (a, b) {
          return a.n - b.n;
        }),
        lo = s[0].n,
        hi = s[s.length - 1].n,
        gaps = hi - lo + 1 - s.length;
      if (gaps > js.length) return null;
      var extra = js.length - gaps,
        start = lo,
        end = hi;
      while (extra > 0 && end < 13) {
        end++;
        extra--;
      }
      while (extra > 0 && start > 1) {
        start--;
        extra--;
      }
      if (extra > 0) return null;
      var out = [],
        jq = js.slice();
      var k = 0;
      for (var v = start; v <= end; v++) {
        if (k < s.length && s[k].n === v) out.push({
          t: s[k++],
          v: v
        });else out.push({
          t: jq.pop(),
          v: v
        });
      }
      return out;
    }
    return null;
  }
  var setPts = function setPts(set) {
    var a = arrange(set);
    return a ? a.reduce(function (x, y) {
      return x + y.v;
    }, 0) : 0;
  };
  var sortSet = function sortSet(set) {
    var a = arrange(set);
    return a ? a.map(function (x) {
      return x.t;
    }) : set.slice().sort(function (p, q) {
      return p.j - q.j || p.c - q.c || p.n - q.n;
    });
  };
  function candidates(rack) {
    var out = [],
      nj = rack.filter(function (t) {
        return !t.j;
      }),
      js = rack.filter(function (t) {
        return t.j;
      });
    var by = {};
    nj.forEach(function (t) {
      (by[t.n] = by[t.n] || {})[t.c] = by[t.n][t.c] || t;
    });
    Object.keys(by).forEach(function (n) {
      var ts = Object.values(by[n]);
      if (ts.length >= 3) {
        out.push(ts.slice());
        if (ts.length === 4) {
          var _loop = function _loop(i) {
            out.push(ts.filter(function (x, k) {
              return k !== i;
            }));
          };
          for (var i = 0; i < 4; i++) {
            _loop(i);
          }
        }
      }
      if (ts.length === 2 && js.length) out.push(ts.concat([js[0]]));
      if (ts.length === 3 && js.length) out.push(ts.concat([js[0]]));
    });
    var _loop2 = function _loop2(c) {
      var m = {};
      nj.filter(function (t) {
        return t.c === c;
      }).forEach(function (t) {
        return m[t.n] = m[t.n] || t;
      });
      for (var a = 1; a <= 11; a++) for (var b = a + 2; b <= 13; b++) {
        var run = [],
          need = [];
        for (var v = a; v <= b; v++) {
          if (m[v]) run.push(m[v]);else need.push(v);
        }
        if (need.length <= js.length && need.length <= 1 && run.length >= 2) out.push(run.concat(js.slice(0, need.length)));
      }
    };
    for (var c = 0; c < 4; c++) {
      _loop2(c);
    }
    return out.filter(function (s) {
      return arrange(s);
    });
  }
  function bestMelds(rack) {
    var cand = candidates(rack).sort(function (a, b) {
      return setPts(b) - setPts(a);
    }).slice(0, 60);
    var best = {
        pts: 0,
        n: 0,
        sets: []
      },
      steps = 0;
    (function go(i, used, sets, pts, n) {
      if (++steps > 6000) return;
      if (pts > best.pts || pts === best.pts && n > best.n) best = {
        pts: pts,
        n: n,
        sets: sets.slice()
      };
      for (var k = i; k < cand.length; k++) {
        var s = cand[k];
        if (s.some(function (t) {
          return used.has(t.id);
        })) continue;
        s.forEach(function (t) {
          return used.add(t.id);
        });
        sets.push(s);
        go(k + 1, used, sets, pts + setPts(s), n + s.length);
        sets.pop();
        s.forEach(function (t) {
          return used["delete"](t.id);
        });
      }
    })(0, new Set(), [], 0, 0);
    return best;
  }
  function tile(c, x, y, w, t) {
    var o = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};
    var h = w * 1.36;
    c.save();
    c.translate(x, y - (o.up ? 6 : 0));
    c.fillStyle = "rgba(0,0,0,0.3)";
    rr(c, -w / 2 + 1.5, -h / 2 + 2.5, w, h, w * 0.16);
    c.fill();
    c.fillStyle = o.glow ? "#fff6c7" : "#fbf6e9";
    rr(c, -w / 2, -h / 2, w, h, w * 0.16);
    c.fill();
    c.strokeStyle = o.sel ? "#ffb300" : "rgba(0,0,0,0.18)";
    c.lineWidth = o.sel ? 3 : 1;
    c.stroke();
    if (t.j) {
      G.img(c, ":dawgW:", 0, -h * 0.06, w * 0.72);
      c.fillStyle = "#d32f2f";
      c.font = "800 ".concat(Math.round(w * 0.24), "px system-ui, sans-serif");
      c.textAlign = "center";
      c.textBaseline = "middle";
      c.fillText(o.v ? String(o.v) : "J", 0, h * 0.34);
    } else {
      c.fillStyle = TC[t.c];
      c.textAlign = "center";
      c.textBaseline = "middle";
      c.font = "800 ".concat(Math.round(w * 0.56), "px system-ui, -apple-system, sans-serif");
      c.fillText(String(t.n), 0, -h * 0.08);
      c.font = "".concat(Math.round(w * 0.24), "px system-ui, sans-serif");
      c.fillText(SHAPE[t.c], 0, h * 0.3);
    }
    if (o.dim) {
      c.fillStyle = "rgba(0,0,0,0.35)";
      rr(c, -w / 2, -h / 2, w, h, w * 0.16);
      c.fill();
    }
    c.restore();
  }
  defGame({
    key: "rummy",
    name: "Rummy Dawgs",
    icon: "🧮",
    max: 800,
    cat: "den",
    blurb: "Number-tile rummy vs Rex and Duke.",
    how: "Get rid of all your tiles. Sets are RUNS (3+ in a row, same color, like 4-5-6 red) or GROUPS (3 or 4 of the same number, all different colors). The 🐶 joker can stand in for any tile. Your first play has to add up to 30+ using only your own tiles. After that, rework the table however you like: take tiles off sets, split them, combine them, as long as every set on the table is valid when you tap Done. Tap tiles to select them, then tap New set or the + at the end of a set to move them there. Undo puts the table back. Nothing to play? Tap Draw. Win: 200 + the tiles left in the pups' racks. Lose: 100 minus what's left in your rack.",
    save: function save(G) {
      var s = G.s;
      if (s.phase !== "play" || s.turn !== 0) return null;
      return {
        label: "You ".concat(s.racks[0].length, " tiles \xB7 pool ").concat(s.pool.length),
        v: JSON.parse(JSON.stringify(Object.assign({}, s, {
          btns: [],
          hl: null,
          say: [null, null, null]
        })))
      };
    },
    load: function load(G, sv) {
      Object.assign(G.s, sv.v);
      G.s.wait = 0.4;
      G.s.msg = "Welcome back. Your turn.";
    },
    reset: function reset(G) {
      var pool = [];
      var id = 0;
      for (var k = 0; k < 2; k++) for (var c = 0; c < 4; c++) for (var n = 1; n <= 13; n++) pool.push({
        id: id++,
        n: n,
        c: c,
        j: false
      });
      pool.push({
        id: id++,
        n: 0,
        c: 0,
        j: true
      }, {
        id: id++,
        n: 0,
        c: 0,
        j: true
      });
      shuffle(pool);
      var racks = [[], [], []];
      for (var r = 0; r < 14; r++) for (var p = 0; p < 3; p++) racks[p].push(pool.pop());
      G.s = {
        pool: pool,
        racks: racks,
        table: [],
        opened: [false, false, false],
        turn: 0,
        sel: [],
        placed: [],
        sortBy: "run",
        phase: "play",
        msg: "Your turn. Make 30+ from your own tiles, or Draw.",
        wait: 0,
        passes: 0,
        say: [null, null, null],
        hl: null,
        btns: []
      };
      this.snapshot(G);
    },
    snapshot: function snapshot(G) {
      var s = G.s;
      s.snap = JSON.stringify({
        table: s.table,
        rack: s.racks[0]
      });
      s.placed = [];
      s.sel = [];
    },
    undo: function undo(G) {
      var s = G.s,
        v = JSON.parse(s.snap);
      s.table = v.table;
      s.racks[0] = v.rack;
      s.placed = [];
      s.sel = [];
      s.msg = "Table put back.";
    },
    find: function find(s, id) {
      var i = s.racks[0].findIndex(function (t) {
        return t.id === id;
      });
      if (i >= 0) return {
        where: "rack",
        i: i
      };
      for (var k = 0; k < s.table.length; k++) {
        i = s.table[k].findIndex(function (t) {
          return t.id === id;
        });
        if (i >= 0) return {
          where: "set",
          k: k,
          i: i
        };
      }
      return null;
    },
    take: function take(s, ids) {
      var _this = this;
      var out = [];
      ids.forEach(function (id) {
        var f = _this.find(s, id);
        if (!f) return;
        if (f.where === "rack") {
          out.push(s.racks[0].splice(f.i, 1)[0]);
          if (!s.placed.includes(id)) s.placed.push(id);
        } else out.push(s.table[f.k].splice(f.i, 1)[0]);
      });
      return out;
    },
    clean: function clean(s) {
      s.table = s.table.filter(function (x) {
        return x.length;
      }).map(function (x) {
        return arrange(x) ? sortSet(x) : x;
      });
    },
    newSet: function newSet(G) {
      var s = G.s;
      if (!s.sel.length) {
        s.msg = "Select tiles first.";
        return;
      }
      var t = this.take(s, s.sel);
      s.table.push(t);
      s.sel = [];
      this.clean(s);
      G.sfx("pop");
    },
    addTo: function addTo(G, k) {
      var s = G.s,
        target = s.table[k];
      if (!target || !s.sel.length) return;
      var t = this.take(s, s.sel);
      target.push.apply(target, _toConsumableArray(t));
      s.sel = [];
      this.clean(s);
      G.sfx("pop");
    },
    toRack: function toRack(G) {
      var _this2 = this;
      var s = G.s,
        back = s.sel.filter(function (id) {
          return s.placed.includes(id);
        });
      if (!back.length) {
        s.msg = "Only tiles you played this turn can go back to your rack.";
        return;
      }
      back.forEach(function (id) {
        var f = _this2.find(s, id);
        if (f && f.where === "set") {
          s.racks[0].push(s.table[f.k].splice(f.i, 1)[0]);
          s.placed = s.placed.filter(function (x) {
            return x !== id;
          });
        }
      });
      s.sel = s.sel.filter(function (id) {
        return !back.includes(id);
      });
      this.clean(s);
    },
    select: function select(G, id) {
      var s = G.s,
        f = this.find(s, id);
      if (!f) return;
      if (f.where === "set" && !s.opened[0] && !s.placed.includes(id)) {
        s.msg = "Make your first 30 points from your own tiles before touching the table.";
        G.buzz();
        return;
      }
      var i = s.sel.indexOf(id);
      if (i >= 0) s.sel.splice(i, 1);else s.sel.push(id);
    },
    sortedRack: function sortedRack(s) {
      var r = s.racks[0].slice();
      return s.sortBy === "run" ? r.sort(function (a, b) {
        return a.j - b.j || a.c - b.c || a.n - b.n;
      }) : r.sort(function (a, b) {
        return a.j - b.j || a.n - b.n || a.c - b.c;
      });
    },
    done: function done(G) {
      var s = G.s;
      if (!s.placed.length) {
        if (JSON.stringify({
          table: s.table,
          rack: s.racks[0]
        }) !== s.snap) {
          this.undo(G);
          s.msg = "No tiles from your rack played, so the table was put back. ";
        } else s.msg = "";
        return this.drawTile(G, 0);
      }
      var bad = s.table.filter(function (x) {
        return !arrange(x);
      });
      if (bad.length) {
        s.msg = "".concat(bad.length, " set").concat(bad.length > 1 ? "s aren't" : " isn't", " valid yet (red). Fix it or Undo.");
        G.buzz();
        return;
      }
      if (!s.opened[0]) {
        var old = JSON.parse(s.snap).table.map(function (x) {
          return x.map(function (t) {
            return t.id;
          }).sort().join(",");
        });
        var now = s.table.map(function (x) {
          return x.map(function (t) {
            return t.id;
          }).sort().join(",");
        });
        if (!old.every(function (k) {
          return now.includes(k);
        })) {
          s.msg = "First play: don't change the sets already on the table.";
          G.buzz();
          return;
        }
        var mine = s.table.filter(function (x) {
            return x.every(function (t) {
              return s.placed.includes(t.id);
            });
          }),
          pts = mine.reduce(function (a, x) {
            return a + setPts(x);
          }, 0);
        if (pts < 30) {
          s.msg = "First play needs 30+ points. You have ".concat(pts, ".");
          G.buzz();
          return;
        }
        s.opened[0] = true;
      }
      var n = s.placed.length;
      s.hl = {
        ids: s.placed.slice(),
        t: 1.2
      };
      G.sfx("pop");
      s.passes = 0;
      s.msg = "You played ".concat(n, " tile").concat(n > 1 ? "s" : "", ".");
      if (!s.racks[0].length) return this.finish(G, 0);
      this.nextTurn(G);
    },
    drawTile: function drawTile(G, p) {
      var s = G.s;
      if (s.pool.length) {
        s.racks[p].push(s.pool.pop());
        s.passes = 0;
        if (p === 0) s.msg = (s.msg || "") + "You drew a tile.";else s.say[p] = {
          txt: "Draws",
          t: 1.2
        };
      } else {
        s.passes++;
        if (p === 0) s.msg = "The pool is empty. You pass.";else s.say[p] = {
          txt: "Pass",
          t: 1.2
        };
        if (s.passes >= 3) return this.finish(G, -1);
      }
      if (p === 0) G.sfx("pop");
      this.nextTurn(G);
    },
    nextTurn: function nextTurn(G) {
      var s = G.s;
      s.turn = (s.turn + 1) % 3;
      s.sel = [];
      s.wait = s.turn === 0 ? 0.3 : 0.9;
      if (s.turn === 0) {
        this.snapshot(G);
        s.msg = (s.msg ? s.msg + " " : "") + "Your turn.";
      }
    },
    cpu: function cpu(G, p) {
      var s = G.s,
        rack = s.racks[p],
        played = [];
      var best = bestMelds(rack);
      if (!s.opened[p]) {
        if (best.pts >= 30) {
          best.sets.forEach(function (set) {
            set.forEach(function (t) {
              return rack.splice(rack.indexOf(t), 1);
            });
            s.table.push(sortSet(set));
            played.push.apply(played, _toConsumableArray(set));
          });
          s.opened[p] = true;
        }
      } else {
        best.sets.forEach(function (set) {
          set.forEach(function (t) {
            return rack.splice(rack.indexOf(t), 1);
          });
          s.table.push(sortSet(set));
          played.push.apply(played, _toConsumableArray(set));
        });
        var more = true;
        while (more) {
          more = false;
          var _iterator = _createForOfIteratorHelper(rack.slice()),
            _step;
          try {
            var _loop3 = function _loop3() {
              var t = _step.value;
              var k = s.table.findIndex(function (set) {
                return arrange(set.concat([t]));
              });
              if (k >= 0 && (!t.j || rack.length <= 2)) {
                rack.splice(rack.indexOf(t), 1);
                s.table[k] = sortSet(s.table[k].concat([t]));
                played.push(t);
                more = true;
              }
            };
            for (_iterator.s(); !(_step = _iterator.n()).done;) {
              _loop3();
            }
          } catch (err) {
            _iterator.e(err);
          } finally {
            _iterator.f();
          }
        }
      }
      if (!played.length) return this.drawTile(G, p);
      s.passes = 0;
      s.hl = {
        ids: played.map(function (t) {
          return t.id;
        }),
        t: 2
      };
      s.say[p] = {
        txt: "Played ".concat(played.length),
        t: 1.6
      };
      G.sfx("pop");
      s.msg = "".concat(NAMES[p], " played ").concat(played.length, " tile").concat(played.length > 1 ? "s" : "", ".");
      if (rack.length === 1) s.say[p] = {
        txt: "One left!",
        t: 1.6
      };
      if (!rack.length) return this.finish(G, p);
      this.nextTurn(G);
    },
    finish: function finish(G, w) {
      var s = G.s,
        left = s.racks.map(function (r) {
          return r.reduce(function (a, t) {
            return a + tpts(t);
          }, 0);
        });
      if (w < 0) w = left.indexOf(Math.min.apply(Math, _toConsumableArray(left)));
      s.phase = "over";
      s.winner = w;
      s.left = left;
      var score = w === 0 ? Math.min(800, 200 + left[1] + left[2]) : Math.max(0, 100 - left[0]);
      s["final"] = score;
      G.sfx(w === 0 ? "win" : "lose");
      setTimeout(function () {
        return G.over(score, w === 0 ? "Rummy! Top dog 🐶" : "".concat(NAMES[w], " went out first."));
      }, 1800);
    },
    update: function update(G, dt) {
      var s = G.s;
      s.say.forEach(function (b, i) {
        if (b) {
          b.t -= dt;
          if (b.t <= 0) s.say[i] = null;
        }
      });
      if (s.hl) {
        s.hl.t -= dt;
        if (s.hl.t <= 0) s.hl = null;
      }
      if (s.wait > 0) {
        s.wait -= dt;
        return;
      }
      if (s.phase === "play" && s.turn !== 0) this.cpu(G, s.turn);
    },
    L: function L(G) {
      var s = G.s,
        W = G.W,
        H = G.H,
        n = s.racks[0].length,
        per = 10;
      var rw = Math.min(36, (W - 20) / per);
      var rrows = Math.max(1, Math.ceil(n / per));
      if (rrows > 3) rw = Math.min(rw, (W - 20) / Math.ceil(n / 3));
      var rh = rw * 1.36,
        rackTop = H - Math.min(3, rrows) * (rh + 6) - 10,
        btnY = rackTop - 54,
        tableTop = 76,
        tableBot = btnY - 8;
      var tw = 30,
        rows;
      for (; tw >= 16; tw -= 1) {
        rows = this.flow(s.table, tw, W);
        if (rows.h <= tableBot - tableTop) break;
      }
      return {
        W: W,
        H: H,
        rw: rw,
        rh: rh,
        rackTop: rackTop,
        btnY: btnY,
        tableTop: tableTop,
        tw: tw,
        rows: rows,
        perRow: Math.max(per, Math.ceil(n / 3))
      };
    },
    flow: function flow(table, tw, W) {
      var pos = [],
        gap = tw * 0.5,
        plus = tw * 0.9;
      var x = 10,
        y = 0;
      var rowH = tw * 1.36 + 10;
      table.forEach(function (set, k) {
        var w = set.length * (tw + 2) + plus;
        if (x + w > W - 10 && x > 10) {
          x = 10;
          y += rowH;
        }
        pos.push({
          k: k,
          x: x,
          y: y,
          w: w
        });
        x += w + gap;
      });
      return {
        pos: pos,
        h: y + rowH
      };
    },
    draw: function draw(G, c) {
      var s = G.s,
        L = this.L(G),
        W = L.W,
        H = L.H;
      s.btns = [];
      var g = c.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, "#1f5f4a");
      g.addColorStop(1, "#123a2e");
      c.fillStyle = g;
      c.fillRect(0, 0, W, H);
      G.hud(c, "POOL ".concat(s.pool.length), s.opened[0] ? "RUMMY DAWGS" : "FIRST PLAY: 30+", "YOU ".concat(s.racks[0].length));
      [1, 2].forEach(function (p) {
        var x = p === 1 ? W * 0.27 : W * 0.73,
          y = 54,
          turn = s.turn === p && s.phase === "play";
        if (turn) {
          c.fillStyle = "rgba(255,210,63,0.3)";
          rr(c, x - 70, y - 16, 140, 32, 16);
          c.fill();
        }
        G.emoji(c, FACES[p], x - 50, y, 22);
        G.text(c, "".concat(NAMES[p], " ").concat(s.racks[p].length), x + 4, y, 10, s.racks[p].length <= 2 ? "#ff8a80" : "#fff");
        var b = s.say[p];
        if (b) {
          c.fillStyle = "#fff";
          rr(c, x - 50, y + 14, 100, 22, 11);
          c.fill();
          c.fillStyle = "#222";
          c.font = "700 12px system-ui, sans-serif";
          c.textAlign = "center";
          c.textBaseline = "middle";
          c.fillText(b.txt, x, y + 25);
        }
      });
      var myTurn = s.turn === 0 && s.phase === "play",
        hl = s.hl ? new Set(s.hl.ids) : null;
      if (!s.table.length) {
        c.fillStyle = "rgba(255,255,255,0.55)";
        c.font = "600 14px system-ui, sans-serif";
        c.textAlign = "center";
        c.fillText("The table is empty. Sets you play go here.", W / 2, (L.tableTop + L.btnY) / 2);
      }
      L.rows.pos.forEach(function (_ref2) {
        var k = _ref2.k,
          x = _ref2.x,
          y = _ref2.y,
          w = _ref2.w;
        var set = s.table[k],
          arr = arrange(set),
          ty = L.tableTop + y,
          th = L.tw * 1.36;
        c.fillStyle = arr ? "rgba(255,255,255,0.08)" : "rgba(229,57,53,0.35)";
        rr(c, x - 3, ty - 3, w - L.tw * 0.9 + 6, th + 6, 6);
        c.fill();
        if (!arr) {
          c.strokeStyle = "#ff5252";
          c.lineWidth = 2;
          c.stroke();
        }
        var vals = arr ? new Map(arr.map(function (a) {
          return [a.t.id, a.v];
        })) : null;
        set.forEach(function (t, i) {
          var tx = x + i * (L.tw + 2) + L.tw / 2,
            sel = s.sel.includes(t.id);
          tile(c, tx, ty + th / 2, L.tw, t, {
            sel: sel,
            up: sel,
            glow: hl && hl.has(t.id),
            v: vals && t.j ? vals.get(t.id) : 0
          });
          s.btns.push({
            x: tx - L.tw / 2,
            y: ty,
            w: L.tw + 2,
            h: th,
            id: t.id
          });
        });
        if (myTurn && s.sel.length) {
          var px = x + set.length * (L.tw + 2) + L.tw * 0.4;
          c.fillStyle = "#ffd23f";
          c.beginPath();
          c.arc(px, ty + th / 2, L.tw * 0.38, 0, 7);
          c.fill();
          G.text(c, "+", px, ty + th / 2 + 1, Math.max(10, L.tw * 0.4), "#222");
          s.btns.push({
            x: px - L.tw * 0.5,
            y: ty - 4,
            w: L.tw,
            h: th + 8,
            add: k
          });
        }
      });
      if (s.msg) {
        c.fillStyle = "rgba(0,0,0,0.35)";
        rr(c, 8, L.btnY - 30, W - 16, 24, 12);
        c.fill();
        c.fillStyle = "#fff";
        c.font = "600 12.5px system-ui, sans-serif";
        c.textAlign = "center";
        c.textBaseline = "middle";
        c.fillText(s.msg, W / 2, L.btnY - 18, W - 28);
      }
      if (myTurn) {
        var labels = [["New set", "new", s.sel.length > 0], ["Undo", "undo", s.placed.length > 0 || JSON.stringify({
          table: s.table,
          rack: s.racks[0]
        }) !== s.snap], [s.sortBy === "run" ? "Sort 777" : "Sort 789", "sort", true], [s.placed.length ? "Done ✓" : JSON.stringify({
          table: s.table,
          rack: s.racks[0]
        }) !== s.snap ? "Reset+Draw" : s.pool.length ? "Draw" : "Pass", "main", true]];
        var bw = (W - 16 - 18) / 4;
        labels.forEach(function (_ref3, i) {
          var _ref4 = _slicedToArray(_ref3, 3),
            t = _ref4[0],
            k = _ref4[1],
            on = _ref4[2];
          var x = 8 + i * (bw + 6),
            main = k === "main";
          c.globalAlpha = on ? 1 : 0.4;
          c.fillStyle = main ? s.placed.length ? "#43a047" : "#ffd23f" : "rgba(255,255,255,0.92)";
          rr(c, x, L.btnY, bw, 42, 21);
          c.fill();
          c.globalAlpha = 1;
          c.fillStyle = main && s.placed.length ? "#fff" : "#1b1b1f";
          c.font = "800 13.5px system-ui, sans-serif";
          c.textAlign = "center";
          c.textBaseline = "middle";
          c.fillText(t, x + bw / 2, L.btnY + 21);
          if (on) s.btns.push({
            x: x,
            y: L.btnY,
            w: bw,
            h: 42,
            k: k
          });
        });
      }
      c.fillStyle = "#5d3a1a";
      rr(c, 4, L.rackTop - 6, W - 8, H - L.rackTop + 2, 12);
      c.fill();
      var rack = this.sortedRack(s),
        per = L.perRow;
      s.btns.push({
        x: 4,
        y: L.rackTop - 6,
        w: W - 8,
        h: H - L.rackTop + 2,
        rack: true
      });
      rack.forEach(function (t, i) {
        var row = Math.floor(i / per),
          col = i % per,
          inRow = Math.min(per, rack.length - row * per),
          x = W / 2 + (col - (inRow - 1) / 2) * (L.rw + 2),
          y = L.rackTop + row * (L.rh + 6) + L.rh / 2,
          sel = s.sel.includes(t.id);
        tile(c, x, y, L.rw, t, {
          sel: sel,
          up: sel,
          dim: !myTurn
        });
        s.btns.push({
          x: x - L.rw / 2,
          y: y - L.rh / 2 - 6,
          w: L.rw + 2,
          h: L.rh + 6,
          id: t.id
        });
      });
      G.hint(c, "TAP TILES, THEN NEW SET OR +", 5, L.btnY - 52);
      if (s.phase === "over") {
        c.fillStyle = "rgba(0,0,0,0.7)";
        c.fillRect(0, 0, W, H);
        G.banner(c, s.winner === 0 ? "RUMMY! YOU WIN" : "".concat(NAMES[s.winner], " WINS"), s.winner === 0 ? "#ffd23f" : "#fff", H * 0.35, 18);
        [0, 1, 2].forEach(function (p) {
          return G.text(c, "".concat(NAMES[p], ": ").concat(s.racks[p].length, " tiles left (").concat(s.left[p], ")"), W / 2, H * 0.45 + p * 26, 11, p === 0 ? "#ffd23f" : "#fff");
        });
      }
    },
    tap: function tap(G, x, y) {
      var s = G.s;
      if (s.turn !== 0 || s.phase !== "play" || s.wait > 0) return;
      var hits = s.btns.filter(function (b) {
        return x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h;
      });
      if (!hits.length) return;
      var b = hits.find(function (h) {
        return h.k;
      }) || hits.find(function (h) {
        return h.add !== undefined;
      }) || hits.find(function (h) {
        return h.id !== undefined;
      }) || hits[0];
      if (b.k === "new") return this.newSet(G);
      if (b.k === "undo") return this.undo(G);
      if (b.k === "sort") {
        s.sortBy = s.sortBy === "run" ? "num" : "run";
        return;
      }
      if (b.k === "main") return this.done(G);
      if (b.add !== undefined) return this.addTo(G, b.add);
      if (b.id !== undefined) return this.select(G, b.id);
      if (b.rack && s.sel.length) return this.toRack(G);
    }
  });
})();