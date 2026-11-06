function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
(function () {
  var NAMES = ["YOU", "REX", "BISCUIT", "DUKE"],
    FACES = [null, "🐕", ":dawgpog:", "🐶"];
  var COLS = ["#e53935", "#fbc02d", "#43a047", "#1e88e5"],
    CNAME = ["RED", "YELLOW", "GREEN", "BLUE"];
  var TARGET = 200;
  var shuffle = function shuffle(a) {
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var _ref = [a[j], a[i]];
      a[i] = _ref[0];
      a[j] = _ref[1];
    }
    return a;
  };
  function newDeck() {
    var d = [];
    for (var c = 0; c < 4; c++) {
      d.push({
        c: c,
        v: 0
      });
      for (var k = 0; k < 2; k++) {
        for (var v = 1; v <= 9; v++) d.push({
          c: c,
          v: v
        });
        d.push({
          c: c,
          v: "S"
        }, {
          c: c,
          v: "R"
        }, {
          c: c,
          v: "D"
        });
      }
    }
    for (var _k = 0; _k < 4; _k++) d.push({
      c: 4,
      v: "W"
    }, {
      c: 4,
      v: "F"
    });
    return shuffle(d);
  }
  var pts = function pts(k) {
    return typeof k.v === "number" ? k.v : k.c === 4 ? 50 : 20;
  };
  var label = function label(k) {
    return k.v === "S" ? "⊘" : k.v === "R" ? "⇄" : k.v === "D" ? "+2" : k.v === "W" ? "W" : k.v === "F" ? "+4" : String(k.v);
  };
  var _long = function _long(k) {
    return k.v === "S" ? "Skip" : k.v === "R" ? "Reverse" : k.v === "D" ? "+2" : k.v === "W" ? "Wild" : k.v === "F" ? "Wild +4" : String(k.v);
  };
  var rr = function rr(c, x, y, w, h, r) {
    c.beginPath();
    if (c.roundRect) c.roundRect(x, y, w, h, r);else c.rect(x, y, w, h);
  };
  function card(c, x, y, w, k, up) {
    var o = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : {};
    var h = w * 1.5;
    c.save();
    c.translate(x, y);
    if (o.rot) c.rotate(o.rot);
    c.fillStyle = "rgba(0,0,0,0.3)";
    rr(c, -w / 2 + 2, -h / 2 + 3, w, h, w * 0.14);
    c.fill();
    c.fillStyle = "#fff";
    rr(c, -w / 2, -h / 2, w, h, w * 0.14);
    c.fill();
    if (o.hl) {
      c.strokeStyle = "#ffd23f";
      c.lineWidth = 3;
      c.stroke();
    }
    var ins = Math.max(2, w * 0.07);
    if (!up) {
      c.fillStyle = "#1b1b1f";
      rr(c, -w / 2 + ins, -h / 2 + ins, w - 2 * ins, h - 2 * ins, w * 0.1);
      c.fill();
      c.save();
      c.rotate(-0.5);
      c.fillStyle = "#e53935";
      c.beginPath();
      c.ellipse(0, 0, w * 0.34, h * 0.24, 0, 0, 7);
      c.fill();
      c.restore();
      G.emoji(c, "🐾", 0, 1, w * 0.36);
      c.restore();
      return;
    }
    if (k.c === 4) {
      var iw = w - 2 * ins,
        ih = h - 2 * ins;
      c.save();
      rr(c, -iw / 2, -ih / 2, iw, ih, w * 0.1);
      c.clip();
      var sc = o.chosen != null ? [o.chosen, o.chosen, o.chosen, o.chosen] : [0, 1, 3, 2];
      c.fillStyle = COLS[sc[0]];
      c.fillRect(-iw / 2, -ih / 2, iw / 2, ih / 2);
      c.fillStyle = COLS[sc[1]];
      c.fillRect(0, -ih / 2, iw / 2, ih / 2);
      c.fillStyle = COLS[sc[2]];
      c.fillRect(-iw / 2, 0, iw / 2, ih / 2);
      c.fillStyle = COLS[sc[3]];
      c.fillRect(0, 0, iw / 2, ih / 2);
      if (o.chosen == null) {
        c.fillStyle = "#1b1b1f";
        c.globalAlpha = 0.25;
        c.fillRect(-iw / 2, -ih / 2, iw, ih);
        c.globalAlpha = 1;
      }
      c.restore();
    } else {
      c.fillStyle = COLS[k.c];
      rr(c, -w / 2 + ins, -h / 2 + ins, w - 2 * ins, h - 2 * ins, w * 0.1);
      c.fill();
    }
    c.save();
    c.rotate(-0.5);
    c.fillStyle = "#fff";
    c.beginPath();
    c.ellipse(0, 0, w * 0.33, h * 0.25, 0, 0, 7);
    c.fill();
    c.restore();
    var t = label(k),
      big = t.length > 1 ? 0.36 : 0.5;
    c.fillStyle = k.c === 4 ? "#1b1b1f" : COLS[k.c];
    c.font = "900 ".concat(Math.round(w * big), "px system-ui, -apple-system, sans-serif");
    c.textAlign = "center";
    c.textBaseline = "middle";
    c.fillText(t, 0, 1);
    c.fillStyle = "#fff";
    c.font = "800 ".concat(Math.round(w * 0.2), "px system-ui, sans-serif");
    c.fillText(t, -w / 2 + w * 0.2, -h / 2 + w * 0.22);
    c.save();
    c.rotate(Math.PI);
    c.fillText(t, -w / 2 + w * 0.2, -h / 2 + w * 0.22);
    c.restore();
    if (o.dim) {
      c.fillStyle = "rgba(20,10,40,0.45)";
      rr(c, -w / 2, -h / 2, w, h, w * 0.14);
      c.fill();
    }
    c.restore();
  }
  defGame({
    key: "crazy",
    name: "Crazy Dawgs",
    icon: "🎴",
    max: 2000,
    cat: "den",
    blurb: "The color-matching card game vs 3 pups.",
    how: "You vs Rex, Biscuit and Duke. Match the top card by color or by number/symbol. Skip ⊘ skips the next player, Reverse ⇄ flips direction, +2 makes the next player draw 2 and lose their turn, Wild lets you pick the color, Wild +4 picks the color and makes the next player draw 4. Can't play? Tap the deck to draw one (play it if it fits). Down to 2 cards? Tap BARK! before you play, or get caught and draw 2. Win a hand to score the cards left in everyone's hands (numbers = face value, action cards 20, wilds 50). First to 200 wins. Score: your points, +100 for winning the match.",
    save: function save(G) {
      var s = G.s;
      if (s.phase === "handEnd" || s.phase === "over") return null;
      var v = JSON.parse(JSON.stringify(Object.assign({}, s, {
        btns: [],
        fly: null,
        say: [null, null, null, null]
      })));
      return {
        label: "You ".concat(s.score[0], " \xB7 best pup ").concat(Math.max(s.score[1], s.score[2], s.score[3])),
        v: v
      };
    },
    load: function load(G, sv) {
      Object.assign(G.s, sv.v);
      G.s.wait = 0.6;
      G.s.msg = "Welcome back.";
    },
    reset: function reset(G) {
      G.s = {
        score: [0, 0, 0, 0],
        dealer: Math.floor(Math.random() * 4),
        hand: 0,
        say: [null, null, null, null],
        btns: [],
        msg: "",
        fly: null,
        t: 0
      };
      this.deal(G);
    },
    deal: function deal(G) {
      var s = G.s;
      s.hand++;
      s.deck = newDeck();
      s.hands = [[], [], [], []];
      for (var r = 0; r < 7; r++) for (var p = 0; p < 4; p++) s.hands[p].push(s.deck.pop());
      var top;
      do {
        top = s.deck.pop();
        if (typeof top.v !== "number") {
          s.deck.unshift(top);
          top = null;
        }
      } while (!top);
      s.pile = [top];
      s.color = top.c;
      s.dir = 1;
      s.turn = (s.dealer + 1) % 4;
      s.phase = "play";
      s.drawn = null;
      s.barked = false;
      s.caught = false;
      s.pick = false;
      s.wait = 0.9;
      s.winner = -1;
      this.sortMine(s);
      s.msg = s.turn === 0 ? "Your turn" : "".concat(NAMES[s.turn], " starts");
    },
    sortMine: function sortMine(s) {
      s.hands[0].sort(function (a, b) {
        return a.c - b.c || (typeof a.v === "number" ? a.v : 10 + "SRDWF".indexOf(a.v)) - (typeof b.v === "number" ? b.v : 10 + "SRDWF".indexOf(b.v));
      });
    },
    top: function top(s) {
      return s.pile[s.pile.length - 1];
    },
    fits: function fits(s, k) {
      var t = this.top(s);
      return k.c === 4 || k.c === s.color || k.v === t.v;
    },
    legal: function legal(s, p, k) {
      if (!this.fits(s, k)) return false;
      if (k.v === "F") return !s.hands[p].some(function (x) {
        return x !== k && x.c === s.color;
      });
      return true;
    },
    next: function next(s, n) {
      return ((s.turn + s.dir * (n || 1)) % 4 + 4) % 4;
    },
    say: function say(s, p, txt) {
      s.say[p] = {
        txt: txt,
        t: 1.6
      };
    },
    drawCards: function drawCards(s, p, n) {
      for (var i = 0; i < n; i++) {
        if (!s.deck.length) {
          var t = s.pile.pop();
          s.deck = shuffle(s.pile);
          s.pile = [t];
          if (!s.deck.length) break;
        }
        s.hands[p].push(s.deck.pop());
      }
      if (p === 0) this.sortMine(s);
    },
    pos: function pos(G, p) {
      var W = G.W;
      return p === 0 ? [W / 2, G.H - 70] : p === 1 ? [46, G.H * 0.33] : p === 2 ? [W / 2, 76] : [W - 46, G.H * 0.33];
    },
    play: function play(G, p, i, chosen) {
      var s = G.s,
        k = s.hands[p].splice(i, 1)[0];
      var from = this.pos(G, p);
      s.fly = {
        k: k,
        x: from[0],
        y: from[1],
        t: 0
      };
      s.pile.push(k);
      s.color = k.c === 4 ? chosen : k.c;
      s.drawn = null;
      if (k.c === 4) k.chosen = chosen;
      G.sfx("pop");
      if (s.hands[p].length === 1) {
        if (p === 0) {
          if (!s.barked) s.caught = true;
        } else if (Math.random() < 0.9) this.say(s, p, "BARK!");else s.cpuForgot = p;
      }
      s.barked = false;
      if (!s.hands[p].length) {
        s.winner = p;
        s.phase = "handEnd";
      }
      var skip = 1,
        msg = "".concat(NAMES[p] === "YOU" ? "You" : NAMES[p], " played ").concat(k.c === 4 ? _long(k) + " → " + CNAME[chosen] : CNAME[k.c] + " " + _long(k));
      if (k.v === "R") {
        s.dir = -s.dir;
        skip = 1;
      }
      if (k.v === "S") skip = 2;
      if (k.v === "D" || k.v === "F") {
        var v = this.next(s, 1),
          n = k.v === "D" ? 2 : 4;
        this.drawCards(s, v, n);
        this.say(s, v, "+".concat(n, " \uD83D\uDE29"));
        skip = 2;
        msg += " \xB7 ".concat(NAMES[v] === "YOU" ? "you draw" : NAMES[v] + " draws", " ").concat(n);
      }
      if (k.v === "S") {
        var _v = this.next(s, 1);
        this.say(s, _v, "Skipped!");
      }
      s.msg = msg;
      if (s.phase === "handEnd") {
        s.wait = 1.4;
        return;
      }
      s.turn = this.next(s, skip);
      s.wait = p === 0 ? 0.7 : 0.9;
    },
    cpu: function cpu(G, p) {
      var _this = this;
      var s = G.s,
        h = s.hands[p],
        nextN = s.hands[this.next(s, 1)].length;
      if (s.caught && s.hands[0].length === 1 && Math.random() < 0.75) {
        this.drawCards(s, 0, 2);
        this.say(s, p, "You didn't BARK! +2");
        s.msg = "".concat(NAMES[p], " caught you! Draw 2.");
        s.caught = false;
        G.buzz();
        s.wait = 1.1;
        return;
      }
      s.caught = false;
      if (s.cpuForgot != null && s.cpuForgot !== p && s.hands[s.cpuForgot].length === 1 && Math.random() < 0.6) {
        var q = s.cpuForgot;
        this.drawCards(s, q, 2);
        this.say(s, p, "".concat(NAMES[q], " forgot! +2"));
        s.cpuForgot = null;
        s.wait = 1;
        return;
      }
      var opts = h.map(function (k, i) {
        return {
          k: k,
          i: i
        };
      }).filter(function (o) {
        return _this.legal(s, p, o.k);
      });
      if (!opts.length) {
        if (s.drawn === p) {
          s.drawn = null;
          s.msg = "".concat(NAMES[p], " passes");
          s.turn = this.next(s, 1);
          s.wait = 0.7;
          return;
        }
        this.drawCards(s, p, 1);
        s.drawn = p;
        s.msg = "".concat(NAMES[p], " draws");
        s.wait = 0.6;
        return;
      }
      var score = function score(o) {
        var k = o.k;
        var v = 0;
        if (k.c === 4) v -= 30;else v += 10;
        if (k.c === s.color) v += 3;
        if (typeof k.v !== "number") v += nextN <= 2 ? 25 : 4;
        if (typeof k.v === "number") v += k.v * 0.5;
        if (k.v === "F") v += nextN <= 2 ? 40 : -10;
        return v + Math.random() * 3;
      };
      opts.sort(function (a, b) {
        return score(b) - score(a);
      });
      var pick = opts[0],
        cnt = [0, 0, 0, 0];
      h.forEach(function (k) {
        if (k.c < 4) cnt[k.c]++;
      });
      var chosen = pick.k.c === 4 ? cnt.indexOf(Math.max.apply(Math, cnt)) : undefined;
      if (h.length === 2) s.barked = true;
      this.play(G, p, pick.i, chosen);
    },
    endHand: function endHand(G) {
      var s = G.s,
        w = s.winner;
      var gain = 0;
      s.hands.forEach(function (h, p) {
        if (p !== w) h.forEach(function (k) {
          return gain += pts(k);
        });
      });
      s.score[w] += gain;
      s.last = {
        w: w,
        gain: gain
      };
      if (w === 0) G.sfx("win");else G.sfx("lose");
      if (Math.max.apply(Math, _toConsumableArray(s.score)) >= TARGET) {
        s.phase = "over";
        var won = s.score[0] >= TARGET && s.score[0] === Math.max.apply(Math, _toConsumableArray(s.score));
        setTimeout(function () {
          return G.over(Math.min(2000, s.score[0] + (won ? 100 : 0)), won ? "Top dog! 🐶" : "".concat(NAMES[s.score.indexOf(Math.max.apply(Math, _toConsumableArray(s.score)))], " wins the match."));
        }, 1400);
        return;
      }
      s.phase = "between";
      s.dealer = (s.dealer + 1) % 4;
    },
    update: function update(G, dt) {
      var s = G.s;
      s.t += dt;
      s.say.forEach(function (b, i) {
        if (b) {
          b.t -= dt;
          if (b.t <= 0) s.say[i] = null;
        }
      });
      if (s.fly) {
        s.fly.t += dt * 4;
        if (s.fly.t >= 1) s.fly = null;
      }
      if (s.wait > 0) {
        s.wait -= dt;
        if (s.wait > 0) return;
      }
      if (s.phase === "handEnd") {
        s.phase = "scoring";
        return this.endHand(G);
      }
      if (s.phase !== "play" || s.pick) return;
      if (s.turn !== 0) this.cpu(G, s.turn);
    },
    L: function L(G) {
      var W = G.W,
        H = G.H,
        n = G.s.hands ? G.s.hands[0].length : 7;
      var cw = Math.min(62, Math.max(44, (W - 20) / 6.5)),
        avail = W - 20 - cw,
        step = n > 1 ? Math.min(cw * 0.78, avail / (n - 1)) : 0;
      var rows = step < cw * 0.42 && n > 9 ? 2 : 1;
      return {
        W: W,
        H: H,
        cw: cw,
        step: step,
        rows: rows,
        cx: W / 2,
        cy: H * 0.43
      };
    },
    handPos: function handPos(G, i) {
      var s = G.s,
        L = this.L(G),
        n = s.hands[0].length;
      if (L.rows === 2) {
        var per = Math.ceil(n / 2),
          r = i < per ? 0 : 1,
          j = r ? i - per : i,
          m = r ? n - per : per,
          st = m > 1 ? Math.min(L.cw * 0.78, (L.W - 20 - L.cw) / (m - 1)) : 0;
        return [L.W / 2 + (j - (m - 1) / 2) * st, L.H - 118 + r * 52, L.cw * 0.9];
      }
      return [L.W / 2 + (i - (n - 1) / 2) * L.step, L.H - 92, L.cw];
    },
    draw: function draw(G, c) {
      var _this2 = this;
      var s = G.s,
        L = this.L(G),
        W = L.W,
        H = L.H;
      s.btns = [];
      var g = c.createRadialGradient(W / 2, H * 0.42, 30, W / 2, H * 0.42, H * 0.8);
      g.addColorStop(0, "#5b3a9c");
      g.addColorStop(1, "#24133f");
      c.fillStyle = g;
      c.fillRect(0, 0, W, H);
      G.hud(c, "YOU ".concat(s.score[0]), "HAND ".concat(s.hand, " \xB7 TO ").concat(TARGET), "".concat(s.dir > 0 ? "↻" : "↺"));
      [1, 2, 3].forEach(function (p) {
        var _this2$pos = _this2.pos(G, p),
          _this2$pos2 = _slicedToArray(_this2$pos, 2),
          x = _this2$pos2[0],
          y = _this2$pos2[1],
          turn = s.turn === p && s.phase === "play";
        if (turn) {
          c.fillStyle = "rgba(255,210,63,0.35)";
          c.beginPath();
          c.arc(x, y, 30, 0, 7);
          c.fill();
        }
        if (FACES[p][0] === ":") G.img(c, FACES[p], x, y, 46);else G.emoji(c, FACES[p], x, y, 38);
        G.text(c, "".concat(NAMES[p], " ").concat(s.score[p]), x, y + 32, 9, "#fff");
        var n = s.hands[p].length,
          show = Math.min(n, 10);
        for (var i = 0; i < show; i++) {
          if (p === 2) card(c, x + 56 + i * 7, y - 6, 22, null, false);else card(c, x + (p === 1 ? 6 : -6), y + 50 + i * 6, 22, null, false, {
            rot: p === 1 ? 1.57 : -1.57
          });
        }
        c.fillStyle = n === 1 ? "#ff5252" : "#fff";
        c.font = "800 13px system-ui, sans-serif";
        c.textAlign = "center";
        c.textBaseline = "middle";
        c.fillText(n === 1 ? "1 card!" : "".concat(n, " cards"), p === 2 ? x + 56 + show * 3.5 : x, p === 2 ? y + 22 : y + 50 + show * 6 + 30);
        var b = s.say[p];
        if (b) {
          var bw = Math.max(70, b.txt.length * 7.5 + 18),
            bx = Math.max(4, Math.min(W - bw - 4, x - bw / 2)),
            _by = p === 2 ? y + 52 : y - 46;
          c.fillStyle = "#fff";
          rr(c, bx, _by - 13, bw, 26, 13);
          c.fill();
          c.fillStyle = "#222";
          c.font = "800 13px system-ui, sans-serif";
          c.fillText(b.txt, bx + bw / 2, _by + 1);
        }
      });
      var dx = L.cx - 46,
        px = L.cx + 46,
        cy = L.cy,
        pw = 64;
      c.strokeStyle = COLS[s.color] || "#fff";
      c.lineWidth = 6;
      c.beginPath();
      c.arc(px, cy, pw * 0.95, 0, 7);
      c.stroke();
      card(c, dx, cy, pw, null, false, {
        hl: s.turn === 0 && s.phase === "play" && !s.pick && !s.hands[0].some(function (k) {
          return _this2.legal(s, 0, k);
        })
      });
      s.btns.push({
        x: dx - pw / 2,
        y: cy - pw * 0.75,
        w: pw,
        h: pw * 1.5,
        k: "deck"
      });
      var pl = s.pile.slice(-3);
      pl.forEach(function (k, i) {
        var last = i === pl.length - 1;
        if (last && s.fly) return;
        card(c, px + (i - pl.length + 1) * 3, cy + (i - pl.length + 1) * 2, pw, k, true, {
          chosen: k.chosen,
          rot: ((k.v === "W" ? 3 : String(k.v).charCodeAt(0)) % 7 - 3) * 0.04
        });
      });
      if (s.fly) {
        var e = 1 - Math.pow(1 - Math.min(1, s.fly.t), 3);
        card(c, s.fly.x + (px - s.fly.x) * e, s.fly.y + (cy - s.fly.y) * e, pw * (0.8 + 0.2 * e), s.fly.k, true, {
          chosen: s.fly.k.chosen
        });
      }
      G.text(c, "COLOR: ".concat(CNAME[s.color] || "?"), L.cx, cy + pw * 0.95 + 18, 10, COLS[s.color] || "#fff");
      if (s.msg) {
        c.fillStyle = "rgba(255,255,255,0.9)";
        c.font = "700 13px system-ui, sans-serif";
        c.textAlign = "center";
        c.fillText(s.msg, W / 2, cy - pw * 0.95 - 16, W - 20);
      }
      var myTurn = s.turn === 0 && s.phase === "play" && !s.pick;
      s.hands[0].forEach(function (k, i) {
        var _this2$handPos = _this2.handPos(G, i),
          _this2$handPos2 = _slicedToArray(_this2$handPos, 3),
          x = _this2$handPos2[0],
          y = _this2$handPos2[1],
          w = _this2$handPos2[2],
          ok = myTurn && _this2.legal(s, 0, k);
        card(c, x, y - (ok ? 12 : 0), w, k, true, {
          chosen: null,
          dim: myTurn && !ok,
          hl: ok
        });
        s.btns.push({
          x: x - L.step / 2 - (i === s.hands[0].length - 1 ? w / 2 : 0),
          y: y - w * 0.75 - 12,
          w: i === s.hands[0].length - 1 ? w : Math.max(L.step, 18),
          h: w * 1.5 + 12,
          i: i,
          cx: x
        });
      });
      if (s.say[0]) G.text(c, s.say[0].txt, W / 2, H - 170, 12, "#ffd23f");
      var by = H - 30;
      if (myTurn && s.hands[0].length === 2) {
        var on = s.barked;
        c.fillStyle = on ? "#43a047" : "#ff5252";
        rr(c, 10, by - 20, 100, 40, 20);
        c.fill();
        G.text(c, on ? "BARKED ✓" : "BARK!", 60, by, 11, "#fff");
        s.btns.push({
          x: 10,
          y: by - 20,
          w: 100,
          h: 40,
          k: "bark"
        });
      }
      if (myTurn && s.drawn === 0) {
        c.fillStyle = "#fff";
        rr(c, W - 110, by - 20, 100, 40, 20);
        c.fill();
        G.text(c, "PASS", W - 60, by, 11, "#222");
        s.btns.push({
          x: W - 110,
          y: by - 20,
          w: 100,
          h: 40,
          k: "pass"
        });
      }
      if (myTurn) G.text(c, "YOUR TURN", W / 2, by, 10, "#ffd23f");
      G.hint(c, "TAP A GLOWING CARD · TAP THE DECK TO DRAW", 5, cy + pw * 0.95 + 46);
      if (s.pick) {
        c.fillStyle = "rgba(0,0,0,0.6)";
        c.fillRect(0, 0, W, H);
        G.text(c, "PICK A COLOR", W / 2, H * 0.3, 14, "#fff");
        var sz = Math.min(120, (W - 60) / 2);
        for (var q = 0; q < 4; q++) {
          var x = W / 2 + (q % 2 ? 6 : -sz - 6),
            y = H * 0.36 + (q > 1 ? sz + 12 : 0);
          c.fillStyle = COLS[q];
          rr(c, x, y, sz, sz, 16);
          c.fill();
          G.text(c, CNAME[q], x + sz / 2, y + sz / 2, 11, "#fff");
          s.btns.unshift({
            x: x,
            y: y,
            w: sz,
            h: sz,
            color: q
          });
        }
      }
      if (s.phase === "between" || s.phase === "scoring" || s.phase === "over") {
        c.fillStyle = "rgba(0,0,0,0.65)";
        c.fillRect(0, 0, W, H);
        var w = s.last ? s.last.w : s.winner;
        G.banner(c, w === 0 ? "YOU WIN THE HAND!" : "".concat(NAMES[w], " WINS THE HAND"), w === 0 ? "#ffd23f" : "#fff", H * 0.3, 16);
        if (s.last) G.text(c, "+".concat(s.last.gain, " POINTS"), W / 2, H * 0.37, 12, "#fff");
        [0, 1, 2, 3].forEach(function (p, i) {
          return G.text(c, "".concat(NAMES[p], "  ").concat(s.score[p]), W / 2, H * 0.45 + i * 26, 12, p === 0 ? "#ffd23f" : "#fff");
        });
        if (s.phase === "between") {
          c.fillStyle = "#ffd23f";
          rr(c, W / 2 - 90, H * 0.67, 180, 48, 24);
          c.fill();
          G.text(c, "NEXT HAND", W / 2, H * 0.67 + 24, 12, "#222");
          s.btns.unshift({
            x: W / 2 - 90,
            y: H * 0.67,
            w: 180,
            h: 48,
            k: "nexthand"
          });
        }
      }
    },
    tap: function tap(G, x, y) {
      var _this3 = this;
      var s = G.s;
      var hits = s.btns.filter(function (b) {
        return x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h;
      });
      if (!hits.length) return;
      var b = hits[0];
      if (b.i !== undefined) {
        var cards = hits.filter(function (h) {
          return h.i !== undefined;
        });
        b = cards.reduce(function (a, h) {
          return Math.abs(h.cx - x) < Math.abs(a.cx - x) ? h : a;
        }, cards[0]);
      }
      if (b.k === "nexthand") {
        this.deal(G);
        return;
      }
      if (s.pick) {
        if (b.color !== undefined) {
          var i = s.pick.i;
          s.pick = false;
          this.play(G, 0, i, b.color);
        }
        return;
      }
      if (s.turn !== 0 || s.phase !== "play" || s.wait > 0) return;
      if (b.k === "bark") {
        s.barked = true;
        this.say(s, 0, "BARK! 🐶");
        G.sfx("pop");
        return;
      }
      if (b.k === "pass") {
        s.drawn = null;
        s.msg = "You pass";
        s.turn = this.next(s, 1);
        s.wait = 0.6;
        return;
      }
      if (b.k === "deck") {
        if (s.drawn === 0) {
          s.msg = "Play the card you drew or PASS";
          return;
        }
        this.drawCards(s, 0, 1);
        s.drawn = 0;
        G.sfx("pop");
        if (!s.hands[0].some(function (k) {
          return _this3.legal(s, 0, k);
        })) {
          s.msg = "Nothing fits. Your turn passes.";
          s.drawn = null;
          s.turn = this.next(s, 1);
          s.wait = 0.9;
        } else s.msg = "You drew. Play a glowing card or PASS.";
        return;
      }
      if (b.i !== undefined) {
        var k = s.hands[0][b.i];
        if (!this.legal(s, 0, k)) {
          s.msg = k.v === "F" && this.fits(s, k) ? "Wild +4 only when you have no " + CNAME[s.color] : "Doesn't match ".concat(CNAME[s.color], " or ").concat(_long(this.top(s)));
          G.buzz();
          return;
        }
        if (k.c === 4) {
          s.pick = {
            i: b.i
          };
          return;
        }
        this.play(G, 0, b.i);
      }
    },
    onKey: function onKey(G, k, d) {
      if (d && k === " " && G.s.turn === 0) this.tap(G, G.W / 2 - 46, G.H * 0.43);
    }
  });
})();