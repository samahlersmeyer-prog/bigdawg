function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
(function () {
  var shuffle = function shuffle(a) {
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var _ref = [a[j], a[i]];
      a[i] = _ref[0];
      a[j] = _ref[1];
    }
    return a;
  };
  var red = function red(k) {
    return k.s === 1 || k.s === 2;
  };
  var rr = function rr(c, x, y, w, h, r) {
    c.beginPath();
    if (c.roundRect) c.roundRect(x, y, w, h, r);else c.rect(x, y, w, h);
  };
  var homeN = function homeN(s) {
    return s.found.reduce(function (a, f) {
      return a + f.length;
    }, 0);
  };
  var scoreOf = function scoreOf(s) {
    var n = homeN(s);
    return n * 10 + (n === 52 ? 300 + Math.round(180 * Math.max(0, 1 - s.el / 900)) : 0);
  };
  var snap = function snap(s) {
    return JSON.stringify({
      stock: s.stock,
      waste: s.waste,
      found: s.found,
      tab: s.tab,
      moves: s.moves
    });
  };
  defGame({
    key: "solitaire",
    name: "Solitaire",
    icon: "🂡",
    max: 1000,
    cat: "den",
    blurb: "Classic solitaire. Get every card home.",
    how: "Build four piles at the top, one per suit, from Ace up to King. Down below, stack cards in descending order, alternating red and black (a red 7 on a black 8). Only a King can go in an empty column. Tap the deck to flip a card; tap the empty deck to turn the pile back over (as many times as you like). Tap any card to send it to its best spot, or drag it where you want. Undo as much as you want. Score: 10 for every card you get home, plus 300 for clearing the board and a small bonus for finishing quick. Max 1000.",
    reset: function reset(G) {
      var d = [];
      for (var s = 0; s < 4; s++) for (var r = 1; r <= 13; r++) d.push({
        r: r,
        s: s,
        up: false
      });
      shuffle(d);
      var tab = [];
      for (var i = 0; i < 7; i++) {
        tab.push(d.splice(0, i + 1));
        tab[i][i].up = true;
      }
      G.s = {
        stock: d,
        waste: [],
        found: [[], [], [], []],
        tab: tab,
        moves: 0,
        el: 0,
        hist: [],
        drag: null,
        btns: [],
        msg: "",
        msgT: 0,
        auto: 0,
        endT: 0,
        ended: false
      };
    },
    save: function save(G) {
      var s = G.s;
      if (s.ended) return null;
      return {
        label: "".concat(homeN(s), " of 52 home"),
        v: JSON.parse(snap(s)),
        el: s.el
      };
    },
    load: function load(G, sv) {
      Object.assign(G.s, sv.v);
      G.s.el = sv.el || 0;
      G.s.hist = [];
      G.s.msg = "Welcome back";
      G.s.msgT = 1.2;
    },
    L: function L(G) {
      var pad = 6,
        w = Math.min(64, (G.W - 8 * pad) / 7),
        h = w * 1.4,
        x = function x(i) {
          return pad + w / 2 + i * (w + pad) + (G.W - (7 * w + 8 * pad)) / 2;
        };
      var ty = 34 + 10 + h / 2,
        y0 = ty + h + 12,
        bot = G.H - 60;
      return {
        w: w,
        h: h,
        x: x,
        ty: ty,
        y0: y0,
        bot: bot
      };
    },
    offs: function offs(G, L, col) {
      var dd = L.h * 0.16,
        du = L.h * 0.3;
      var nd = col.filter(function (k) {
          return !k.up;
        }).length,
        nu = col.length - nd;
      var need = nd * dd + Math.max(0, nu - 1) * du,
        room = L.bot - L.h / 2 - L.y0;
      if (need > room && need > 0) {
        var f = room / need;
        dd *= f;
        du *= f;
      }
      var ys = [];
      var y = L.y0;
      col.forEach(function (k, i) {
        ys.push(y);
        y += k.up ? du : dd;
      });
      return ys;
    },
    push: function push(G) {
      var s = G.s;
      s.hist.push(snap(s));
      if (s.hist.length > 300) s.hist.shift();
    },
    canTab: function canTab(col, k) {
      var t = col[col.length - 1];
      return t ? t.up && red(t) !== red(k) && t.r === k.r + 1 : k.r === 13;
    },
    canHome: function canHome(s, k) {
      return s.found[k.s].length === k.r - 1;
    },
    cards: function cards(s, src) {
      return src.p === "w" ? [s.waste[s.waste.length - 1]] : src.p === "f" ? [s.found[src.i][s.found[src.i].length - 1]] : s.tab[src.i].slice(src.j);
    },
    take: function take(s, src) {
      if (src.p === "w") s.waste.pop();else if (src.p === "f") s.found[src.i].pop();else s.tab[src.i].splice(src.j);
    },
    flipTop: function flipTop(s, src) {
      if (src.p === "t") {
        var col = s.tab[src.i],
          t = col[col.length - 1];
        if (t && !t.up) t.up = true;
      }
    },
    tryMove: function tryMove(G, src, dst) {
      var s = G.s,
        cs = this.cards(s, src);
      if (!cs.length || !cs[0]) return false;
      if (dst.p === "f") {
        if (cs.length !== 1 || !this.canHome(s, cs[0])) return false;
        this.push(G);
        this.take(s, src);
        s.found[cs[0].s].push(cs[0]);
      } else {
        var _s$tab$dst$i;
        if (src.p === "t" && src.i === dst.i) return false;
        if (!this.canTab(s.tab[dst.i], cs[0])) return false;
        this.push(G);
        this.take(s, src);
        (_s$tab$dst$i = s.tab[dst.i]).push.apply(_s$tab$dst$i, _toConsumableArray(cs));
      }
      this.flipTop(s, src);
      s.moves++;
      G.sfx("pop");
      this.after(G);
      return true;
    },
    autoMove: function autoMove(G, src) {
      var _this = this,
        _ok$find;
      var s = G.s,
        cs = this.cards(s, src);
      if (!cs.length || !cs[0]) return false;
      if (cs.length === 1 && src.p !== "f" && this.tryMove(G, src, {
        p: "f",
        i: cs[0].s
      })) return true;
      var start = src.p === "t" ? src.i + 1 : 0,
        order = [];
      for (var k = 0; k < 7; k++) order.push((start + k) % 7);
      var ok = order.filter(function (i) {
        return !(src.p === "t" && src.i === i) && _this.canTab(s.tab[i], cs[0]);
      });
      if (cs[0].r === 13 && src.p === "t" && src.j === 0) return false;
      var pick = (_ok$find = ok.find(function (i) {
        return s.tab[i].length;
      })) !== null && _ok$find !== void 0 ? _ok$find : ok[0];
      if (pick != null) return this.tryMove(G, src, {
        p: "t",
        i: pick
      });
      return false;
    },
    deal: function deal(G) {
      var s = G.s;
      if (!s.stock.length && !s.waste.length) return;
      this.push(G);
      if (s.stock.length) {
        var k = s.stock.pop();
        k.up = true;
        s.waste.push(k);
      } else {
        s.stock = s.waste.reverse().map(function (k) {
          return Object.assign(k, {
            up: false
          });
        });
        s.waste = [];
      }
      s.moves++;
      G.sfx("pop");
    },
    after: function after(G) {
      var s = G.s;
      if (homeN(s) === 52) {
        if (!s.ended) {
          s.ended = true;
          s.endT = 1.4;
          G.sfx("win");
          s.msg = "Cleared! 🐶";
          s.msgT = 2;
        }
        return;
      }
      if (!s.stock.length && !s.waste.length && s.tab.every(function (col) {
        return col.every(function (k) {
          return k.up;
        });
      }) && !s.auto) {
        s.auto = 0.2;
        s.msg = "Finishing up…";
        s.msgT = 1;
      }
    },
    update: function update(G, dt) {
      var s = G.s;
      if (s.msgT > 0) s.msgT -= dt;
      if (!s.ended) s.el += dt;
      if (s.auto > 0) {
        s.auto -= dt;
        if (s.auto <= 0) {
          var done = false;
          for (var i = 0; i < 7 && !done; i++) {
            var col = s.tab[i];
            if (col.length) done = this.tryMove(G, {
              p: "t",
              i: i,
              j: col.length - 1
            }, {
              p: "f",
              i: col[col.length - 1].s
            });
          }
          s.auto = s.ended ? 0 : done ? 0.09 : 0;
        }
      }
      if (s.ended && s.endT > 0) {
        s.endT -= dt;
        if (s.endT <= 0) G.over(scoreOf(s), s.el < 300 ? "Cleared in a flash! 🐶" : "Cleared the board! 🐶");
      }
    },
    draw: function draw(G, c) {
      var _this2 = this;
      var s = G.s,
        dk = G.dark(),
        L = this.L(G);
      s.btns = [];
      c.fillStyle = dk ? "#123524" : "#1f7a4a";
      c.fillRect(0, 0, G.W, G.H);
      G.hud(c, "".concat(homeN(s), "/52 HOME"), "", "".concat(scoreOf(s), " PTS"));
      var slot = function slot(x, y, label) {
        c.strokeStyle = "rgba(255,255,255,0.35)";
        c.lineWidth = 2;
        rr(c, x - L.w / 2, y - L.h / 2, L.w, L.h, L.w * 0.12);
        c.stroke();
        if (label) {
          c.fillStyle = "rgba(255,255,255,0.35)";
          c.font = "".concat(Math.round(L.w * 0.42), "px ").concat(G.UI);
          c.textAlign = "center";
          c.textBaseline = "middle";
          c.fillText(label, x, y);
        }
      };
      var dr = s.drag && s.drag.moved ? s.drag : null,
        hide = function hide(p, i, j) {
          return dr && dr.src.p === p && (p !== "t" ? dr.src.i === i || p === "w" : dr.src.i === i && j >= dr.src.j);
        };
      if (s.stock.length) {
        G.card(c, L.x(0), L.ty, L.w, null, false);
        if (s.stock.length > 1) {
          c.fillStyle = "#fff";
          c.font = "700 11px ".concat(G.UI);
          c.textAlign = "center";
          c.fillText(s.stock.length, L.x(0), L.ty + L.h / 2 + 8 > L.y0 - L.h / 2 ? L.ty : L.ty + L.h / 2 - 9);
        }
      } else slot(L.x(0), L.ty, s.waste.length ? "↻" : "");
      if (s.waste.length) {
        var n = s.waste.length;
        if (n > 1 && !hide("w")) {}
        var top = hide("w") ? s.waste[n - 2] : s.waste[n - 1];
        if (top) G.card(c, L.x(1), L.ty, L.w, top, true);else slot(L.x(1), L.ty);
      } else slot(L.x(1), L.ty);
      for (var f = 0; f < 4; f++) {
        var pile = s.found[f],
          x = L.x(3 + f);
        var _top = hide("f", f) ? pile[pile.length - 2] : pile[pile.length - 1];
        if (_top) G.card(c, x, L.ty, L.w, _top, true);else slot(x, L.ty, G.SUIT[f]);
      }
      var _loop = function _loop(i) {
        var col = s.tab[i],
          ys = _this2.offs(G, L, col);
        if (!col.length) slot(L.x(i), L.y0, "K");
        col.forEach(function (k, j) {
          if (!hide("t", i, j)) G.card(c, L.x(i), ys[j], L.w, k, k.up);
        });
      };
      for (var i = 0; i < 7; i++) {
        _loop(i);
      }
      if (dr) {
        var cs = this.cards(s, dr.src),
          du = L.h * 0.3;
        cs.forEach(function (k, j) {
          return G.card(c, dr.x - dr.ox, dr.y - dr.oy + j * du, L.w, k, true, {
            hl: true
          });
        });
      }
      var by = G.H - 52,
        bw = (G.W - 40) / 2;
      s.btns.push(Object.assign(G.pill(c, 16, by, bw, 42, "Undo", false, !s.hist.length || s.ended), {
        k: "undo"
      }));
      s.btns.push(Object.assign(G.pill(c, 24 + bw, by, bw, 42, "Fold & score", false, s.ended), {
        k: "fold"
      }));
      if (s.msgT > 0 && s.msg) {
        c.save();
        c.globalAlpha = Math.min(1, s.msgT * 2);
        c.font = "600 15px ".concat(G.UI);
        c.textAlign = "center";
        c.textBaseline = "middle";
        var w = c.measureText(s.msg).width + 30;
        c.fillStyle = "rgba(0,0,0,0.75)";
        rr(c, G.W / 2 - w / 2, G.H / 2 - 19, w, 38, 8);
        c.fill();
        c.fillStyle = "#fff";
        c.fillText(s.msg, G.W / 2, G.H / 2);
        c.restore();
      }
      G.hint(c, "TAP A CARD TO MOVE IT", 4, by - 26);
    },
    hit: function hit(G, x, y) {
      var s = G.s,
        L = this.L(G),
        inC = function inC(cx, cy, h) {
          return Math.abs(x - cx) <= L.w / 2 + 3 && y >= cy - L.h / 2 - 3 && y <= cy - L.h / 2 + (h || L.h) + 3;
        };
      if (inC(L.x(0), L.ty)) return {
        p: "s"
      };
      if (inC(L.x(1), L.ty)) return {
        p: "w"
      };
      for (var f = 0; f < 4; f++) if (inC(L.x(3 + f), L.ty)) return {
        p: "f",
        i: f
      };
      for (var i = 0; i < 7; i++) {
        var col = s.tab[i],
          ys = this.offs(G, L, col);
        if (Math.abs(x - L.x(i)) > L.w / 2 + 3) continue;
        for (var j = col.length - 1; j >= 0; j--) {
          var h = j === col.length - 1 ? L.h : ys[j + 1] - ys[j];
          if (inC(L.x(i), ys[j], h)) return {
            p: "t",
            i: i,
            j: j,
            up: col[j].up
          };
        }
        if (!col.length && inC(L.x(i), L.y0)) return {
          p: "t",
          i: i,
          j: 0,
          empty: true
        };
        return {
          p: "col",
          i: i
        };
      }
      return null;
    },
    down: function down(G, x, y) {
      var s = G.s;
      if (s.ended || s.auto) return;
      var b = s.btns.find(function (b) {
        return x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h;
      });
      if (b) {
        s.press = b.k;
        return;
      }
      var h = this.hit(G, x, y);
      s.press = null;
      if (!h) return;
      if (h.p === "s") {
        s.press = "deal";
        return;
      }
      var ok = h.p === "w" && s.waste.length || h.p === "f" && s.found[h.i].length || h.p === "t" && !h.empty && h.up;
      if (!ok) return;
      var L = this.L(G),
        cy = h.p === "t" ? this.offs(G, L, s.tab[h.i])[h.j] : L.ty,
        cx = h.p === "t" ? L.x(h.i) : h.p === "w" ? L.x(1) : L.x(3 + h.i);
      s.drag = {
        src: h.p === "t" ? {
          p: "t",
          i: h.i,
          j: h.j
        } : {
          p: h.p,
          i: h.i
        },
        x: x,
        y: y,
        sx: x,
        sy: y,
        ox: x - cx,
        oy: y - cy,
        moved: false
      };
    },
    move: function move(G, x, y) {
      var d = G.s.drag;
      if (!d) return;
      d.x = x;
      d.y = y;
      if (Math.hypot(x - d.sx, y - d.sy) > 10) d.moved = true;
    },
    up: function up(G, x, y) {
      var s = G.s,
        d = s.drag;
      s.drag = null;
      if (s.press) {
        var k = s.press;
        s.press = null;
        var b = s.btns.find(function (b) {
          return x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h;
        });
        if (k === "deal") return this.deal(G);
        if (!b || b.k !== k) return;
        if (k === "undo" && s.hist.length) {
          Object.assign(s, JSON.parse(s.hist.pop()));
          s.moves++;
          return;
        }
        if (k === "fold") {
          s.ended = true;
          return G.over(scoreOf(s), homeN(s) ? "".concat(homeN(s), " cards home") : "Tough deal");
        }
        return;
      }
      if (!d) return;
      if (!d.moved) {
        if (!this.autoMove(G, d.src)) {
          s.msg = "No move for that one";
          s.msgT = 0.9;
        }
        return;
      }
      var L = this.L(G),
        cx = x - d.ox,
        cy = y - d.oy;
      if (cy < L.ty + L.h * 0.7) {
        for (var f = 0; f < 4; f++) if (Math.abs(cx - L.x(3 + f)) < L.w * 0.8 && this.tryMove(G, d.src, {
          p: "f",
          i: f
        })) return;
        var _k = this.cards(s, d.src)[0];
        if (_k && this.tryMove(G, d.src, {
          p: "f",
          i: _k.s
        })) return;
      }
      var best = -1,
        bd = 1e9;
      for (var i = 0; i < 7; i++) {
        var dx = Math.abs(cx - L.x(i));
        if (dx < bd) {
          bd = dx;
          best = i;
        }
      }
      if (bd < L.w && this.tryMove(G, d.src, {
        p: "t",
        i: best
      })) return;
    },
    onKey: function onKey(G, k, isDown) {
      if (isDown && k === " ") this.deal(G);
    }
  });
})();