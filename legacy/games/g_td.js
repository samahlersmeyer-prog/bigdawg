function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
defGame({
  key: "td",
  name: "Yard Defense",
  icon: "🏰",
  max: 99999,
  blurb: "Tower defense. Post pups, guard the yard.",
  how: "Critters march down the path. Pick a dog at the bottom, then tap a round pad to post it. Tap a posted dog to see its range and UPGRADE it (up to ★3) or SELL it back for 75% of what you spent. Rack up points to unlock better dogs (Tennis Cannon, Sprinkler, Howler, then Frisbee Ace, Hydrant, Thunder Woof): tap a ★3 dog to swap it for the new model. A boss shows up every 5 waves, and every wave gets tougher. 10 lives; bosses take 4 if they get through.",
  reset: function reset(G) {
    var W = G.W,
      top = 44,
      bot = G.H - 78,
      ph = bot - top;
    var P = [[-0.08, 0.1], [0.76, 0.1], [0.76, 0.36], [0.2, 0.36], [0.2, 0.62], [0.8, 0.62], [0.8, 0.9], [1.08, 0.9]].map(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 2),
        x = _ref2[0],
        y = _ref2[1];
      return {
        x: x * W,
        y: top + y * ph
      };
    });
    var L = 0;
    var seg = [];
    for (var i = 0; i < P.length - 1; i++) {
      var l = Math.hypot(P[i + 1].x - P[i].x, P[i + 1].y - P[i].y);
      seg.push({
        a: P[i],
        b: P[i + 1],
        s: L,
        l: l
      });
      L += l;
    }
    var pads = [[0.22, 0.22], [0.5, 0.22], [0.92, 0.22], [0.07, 0.49], [0.48, 0.49], [0.75, 0.49], [0.38, 0.77], [0.6, 0.77], [0.93, 0.76]].map(function (_ref3) {
      var _ref4 = _slicedToArray(_ref3, 2),
        x = _ref4[0],
        y = _ref4[1];
      return {
        x: x * W,
        y: top + Math.min(0.97, y) * ph,
        t: null
      };
    });
    G.s = {
      P: P,
      seg: seg,
      L: L,
      pads: pads,
      foes: [],
      shots: [],
      fx: [],
      money: 110,
      lives: 10,
      score: 0,
      wave: 0,
      toSpawn: 0,
      spawnT: 0,
      breakT: 2.5,
      sel: 0,
      msg: null,
      bot: bot,
      unl: 0,
      boss: null
    };
  },
  LINES: [[{
    name: "BONE",
    cost: 40,
    range: 92,
    rate: 0.55,
    dmg: 1,
    em: "🦴",
    face: ":dawgW:"
  }, {
    name: "TENNIS",
    cost: 130,
    range: 105,
    rate: 0.35,
    dmg: 3,
    em: "🎾",
    face: ":dawgpog:"
  }, {
    name: "FRISBEE",
    cost: 320,
    range: 122,
    rate: 0.22,
    dmg: 7.5,
    em: "🥏",
    face: ":dawgW:"
  }], [{
    name: "HOSE",
    cost: 65,
    range: 78,
    rate: 0.9,
    dmg: 0.7,
    splash: 44,
    em: "💦",
    face: ":dawgpog:"
  }, {
    name: "SPRINKLR",
    cost: 170,
    range: 90,
    rate: 0.8,
    dmg: 2,
    splash: 60,
    em: "🚿",
    face: ":dawgsweat:"
  }, {
    name: "HYDRANT",
    cost: 400,
    range: 104,
    rate: 0.7,
    dmg: 5,
    splash: 76,
    em: "🧯",
    face: ":dawgpog:"
  }], [{
    name: "BARK",
    cost: 100,
    range: 150,
    rate: 1.5,
    dmg: 5,
    em: "📣",
    face: ":dawgsus:"
  }, {
    name: "HOWL",
    cost: 230,
    range: 178,
    rate: 1.25,
    dmg: 15,
    em: "🔊",
    face: ":dawgsus:"
  }, {
    name: "THUNDER",
    cost: 480,
    range: 215,
    rate: 1.05,
    dmg: 38,
    em: "⚡",
    face: ":dawgW:"
  }]],
  UNLOCK: [0, 1200, 3500],
  BOSSES: [{
    n: "MAILMAN MAX",
    em: "📮"
  }, {
    n: "THE VACUUM",
    em: "🧹"
  }, {
    n: "BATH TIME",
    em: "🛁"
  }, {
    n: "THE CAT KING",
    em: "😼"
  }],
  FOES: {
    sq: {
      hp: 2,
      sp: 54,
      val: 5,
      em: "🐿️",
      sz: 24
    },
    cat: {
      hp: 5,
      sp: 40,
      val: 9,
      em: "🐈",
      sz: 24
    },
    coon: {
      hp: 4,
      sp: 78,
      val: 10,
      em: "🦝",
      sz: 26
    },
    mail: {
      hp: 18,
      sp: 26,
      val: 30,
      em: "📮",
      sz: 30
    }
  },
  ty: function ty(t) {
    return this.LINES[t.k][t.tier];
  },
  save: function save(G) {
    var s = G.s;
    if (!s.wave || s.toSpawn || s.foes.length) return null;
    return {
      label: "Wave ".concat(s.wave + 1),
      money: s.money,
      lives: s.lives,
      score: s.score,
      wave: s.wave,
      unl: s.unl,
      sel: s.sel,
      pads: s.pads.map(function (p) {
        return p.t && {
          k: p.t.k,
          tier: p.t.tier,
          lv: p.t.lv,
          spent: p.t.spent
        };
      })
    };
  },
  load: function load(G, v) {
    var s = G.s;
    ["money", "lives", "score", "wave", "unl", "sel"].forEach(function (k) {
      return s[k] = v[k];
    });
    s.pads.forEach(function (p, i) {
      return p.t = v.pads[i] ? Object.assign({
        cd: 0
      }, v.pads[i]) : null;
    });
    s.paid = true;
    s.breakT = 2.5;
    s.msg = {
      txt: "WAVE ".concat(s.wave + 1, " NEXT"),
      t: 1.5
    };
  },
  pos: function pos(s, d) {
    var _iterator = _createForOfIteratorHelper(s.seg),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var g = _step.value;
        if (d <= g.s + g.l) {
          var f = (d - g.s) / g.l;
          return {
            x: g.a.x + (g.b.x - g.a.x) * f,
            y: g.a.y + (g.b.y - g.a.y) * f
          };
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
    return s.P[s.P.length - 1];
  },
  update: function update(G, dt) {
    var _this = this;
    var s = G.s;
    if (s.unl < 2 && s.score >= this.UNLOCK[s.unl + 1]) {
      s.unl++;
      s.msg = {
        txt: "NEW DOGS UNLOCKED!",
        t: 2.2
      };
      G.sfx("win");
    }
    if (s.msg) {
      s.msg.t -= dt;
      if (s.msg.t <= 0) s.msg = null;
    }
    if (!s.toSpawn && !s.foes.length) {
      if (s.wave && !s.paid) {
        s.paid = true;
        s.money += 15 + 3 * s.wave;
        s.score += 25 * s.wave;
      }
      s.breakT -= dt;
      if (s.breakT <= 0) {
        s.wave++;
        s.paid = false;
        s.toSpawn = Math.min(40, 6 + s.wave * 2) + (s.wave % 5 === 0 ? 1 : 0);
        s.spawnT = 0;
        s.msg = {
          txt: s.wave % 5 === 0 ? "BOSS WAVE ".concat(s.wave, "!") : "WAVE ".concat(s.wave),
          t: 1.4
        };
      }
    }
    if (s.toSpawn) {
      s.spawnT -= dt;
      if (s.spawnT <= 0) {
        var n = s.wave,
          r = Math.random(),
          mult = (1 + 0.32 * n) * Math.pow(1.09, n),
          spd = Math.min(1.5, 1 + 0.015 * n);
        if (n % 5 === 0 && s.toSpawn === 1) {
          var bi = (n / 5 - 1) % 4,
            B = this.BOSSES[bi],
            tier = Math.floor((n / 5 - 1) / 4),
            hp = 35 * mult * (1 + bi * 0.5) * (1 + tier);
          var f = {
            k: "boss",
            em: B.em,
            sz: 46,
            bn: B.n,
            d: 0,
            hp: hp,
            max: hp,
            sp: 22 * spd,
            slow: 0,
            val: 80 + 20 * bi,
            cost: 4
          };
          s.foes.push(f);
          s.boss = f;
          s.msg = {
            txt: "BOSS: ".concat(B.n, "!"),
            t: 2
          };
          G.sfx("lose");
        } else {
          var k = n >= 6 && r < 0.1 ? "mail" : n >= 7 && r < 0.3 ? "coon" : n >= 3 && r < 0.5 ? "cat" : "sq",
            F = this.FOES[k];
          var _hp = F.hp * mult;
          s.foes.push({
            k: k,
            em: F.em,
            sz: F.sz,
            d: 0,
            hp: _hp,
            max: _hp,
            sp: F.sp * spd,
            slow: 0,
            val: F.val,
            cost: 1
          });
        }
        s.toSpawn--;
        s.spawnT = Math.max(0.25, 1.0 - n * 0.04);
        if (!s.toSpawn) s.breakT = 3;
      }
    }
    s.foes.forEach(function (f) {
      f.d += f.sp * (f.slow > 0 ? 0.5 : 1) * dt;
      f.slow -= dt;
      var p = _this.pos(s, f.d);
      f.x = p.x;
      f.y = p.y;
    });
    var kill = function kill(f) {
      if (f.dead) return;
      f.dead = true;
      s.money += f.val;
      s.score += f.val * 2;
      s.fx.push({
        x: f.x,
        y: f.y,
        t: 0.4,
        txt: "+" + f.val
      });
    };
    s.foes.forEach(function (f) {
      if (!f.dead && f.d >= s.L) {
        f.dead = true;
        s.lives -= f.cost;
        G.buzz();
        G.sfx("lose");
      }
    });
    if (s.boss && s.boss.dead) {
      if (s.boss.hp <= 0) {
        s.msg = {
          txt: "BOSS DOWN!",
          t: 1.6
        };
        G.sfx("win");
      }
      s.boss = null;
    }
    if (s.lives <= 0) {
      s.foes = s.foes.filter(function (f) {
        return !f.dead;
      });
      G.over(Math.min(99999, s.score), "Wave ".concat(s.wave, ". The yard has fallen!"));
      return;
    }
    s.pads.forEach(function (p) {
      if (!p.t) return;
      var ty = _this.ty(p.t),
        lv = p.t.lv,
        rng = ty.range * (1 + 0.12 * (lv - 1));
      p.t.cd -= dt;
      if (p.t.cd > 0) return;
      var best = null;
      s.foes.forEach(function (f) {
        if (!f.dead && Math.hypot(f.x - p.x, f.y - p.y) < rng && (!best || f.d > best.d)) best = f;
      });
      if (!best) return;
      p.t.cd = ty.rate;
      var dmg = ty.dmg * Math.pow(1.7, lv - 1);
      if (p.t.k === 0) s.shots.push({
        x: p.x,
        y: p.y,
        f: best,
        dmg: dmg
      });else if (p.t.k === 1) {
        s.foes.forEach(function (f) {
          if (!f.dead && Math.hypot(f.x - best.x, f.y - best.y) < ty.splash) {
            f.hp -= dmg;
            f.slow = f.k === "boss" ? 0.5 : 1.5;
            if (f.hp <= 0) kill(f);
          }
        });
        s.fx.push({
          x: best.x,
          y: best.y,
          t: 0.25,
          splash: ty.splash,
          fx: p.x,
          fy: p.y
        });
      } else {
        best.hp -= dmg;
        if (best.hp <= 0) kill(best);
        s.fx.push({
          x: best.x,
          y: best.y,
          t: 0.2,
          line: 1,
          fx: p.x,
          fy: p.y
        });
      }
    });
    s.shots.forEach(function (b) {
      var f = b.f,
        dx = f.x - b.x,
        dy = f.y - b.y,
        d = Math.hypot(dx, dy),
        v = 420 * dt;
      if (f.dead && !b.gone) {
        b.gone = true;
        return;
      }
      if (d < v + 8) {
        b.gone = true;
        f.hp -= b.dmg;
        if (f.hp <= 0) kill(f);
      } else {
        b.x += dx / d * v;
        b.y += dy / d * v;
      }
    });
    s.shots = s.shots.filter(function (b) {
      return !b.gone;
    });
    s.foes = s.foes.filter(function (f) {
      return !f.dead;
    });
    s.fx.forEach(function (e) {
      return e.t -= dt;
    });
    s.fx = s.fx.filter(function (e) {
      return e.t > 0;
    });
  },
  next: function next(s, t) {
    if (t.lv < 3) return {
      c: Math.round(this.ty(t).cost * (t.lv === 1 ? 0.6 : 0.9))
    };
    if (t.tier < s.unl) return {
      c: Math.round(this.LINES[t.k][t.tier + 1].cost * 0.6),
      evolve: true
    };
    return null;
  },
  refund: function refund(t) {
    return Math.round((t.spent || this.ty(t).cost) * 0.75);
  },
  upgrade: function upgrade(G, p) {
    var s = G.s,
      nx = this.next(s, p.t);
    if (!nx) {
      s.msg = {
        txt: p.t.tier < 2 ? "NEXT DOG AT ".concat(this.UNLOCK[p.t.tier + 1], " PTS") : "MAXED OUT",
        t: 1
      };
      return;
    }
    if (s.money < nx.c) {
      s.msg = {
        txt: "NEED ".concat(nx.c, " \uD83C\uDF56"),
        t: 0.9
      };
      return;
    }
    s.money -= nx.c;
    p.t.spent = (p.t.spent || this.ty(p.t).cost) + nx.c;
    if (nx.evolve) {
      p.t.tier++;
      p.t.lv = 1;
      s.msg = {
        txt: "".concat(this.ty(p.t).name, "!"),
        t: 1
      };
    } else p.t.lv++;
    G.sfx("win");
  },
  sell: function sell(G, p) {
    var s = G.s,
      r = this.refund(p.t);
    s.money += r;
    p.t = null;
    s.pick = null;
    s.fx.push({
      x: p.x,
      y: p.y,
      t: 0.6,
      txt: "+".concat(r)
    });
    G.sfx("pop");
  },
  menu: function menu(G, p) {
    var w = 128,
      h = 46,
      y = p.y > G.s.bot - 120 ? p.y - 30 - h : p.y + 30,
      x = Math.max(6, Math.min(G.W - 2 * w - 12, p.x - w - 3));
    return {
      up: {
        x: x,
        y: y,
        w: w,
        h: h
      },
      sell: {
        x: x + w + 6,
        y: y,
        w: w,
        h: h
      }
    };
  },
  tap: function tap(G, x, y) {
    var s = G.s,
      hit = function hit(r) {
        return x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h;
      };
    if (s.pick != null) {
      var _p = s.pads[s.pick],
        m = this.menu(G, _p);
      if (_p.t && hit(m.up)) {
        this.upgrade(G, _p);
        return;
      }
      if (_p.t && hit(m.sell)) {
        this.sell(G, _p);
        return;
      }
      s.pick = null;
    }
    if (y > s.bot) {
      var i = Math.floor(x / (G.W / 3));
      if (this.LINES[i]) s.sel = i;
      return;
    }
    var pi = s.pads.findIndex(function (p) {
      return Math.hypot(p.x - x, p.y - y) < 30;
    });
    if (pi < 0) return;
    var p = s.pads[pi];
    if (!p.t) {
      var ty = this.LINES[s.sel][s.unl];
      if (s.money < ty.cost) {
        s.msg = {
          txt: "NEED ".concat(ty.cost, " \uD83C\uDF56"),
          t: 0.9
        };
        return;
      }
      s.money -= ty.cost;
      p.t = {
        k: s.sel,
        tier: s.unl,
        lv: 1,
        cd: 0,
        spent: ty.cost
      };
      G.sfx("pop");
    } else s.pick = pi;
  },
  draw: function draw(G, c) {
    var _this2 = this;
    var s = G.s,
      W = G.W,
      H = G.H,
      dark = G.dark(),
      T = this.LINES.map(function (l) {
        return l[s.unl || 0];
      });
    c.fillStyle = dark ? "#1f3a1c" : "#7cc35b";
    c.fillRect(0, 0, W, H);
    c.fillStyle = dark ? "#244520" : "#86cd64";
    for (var y = 0; y < H; y += 24) for (var x = y / 24 % 2 ? 12 : 0; x < W; x += 24) c.fillRect(x, y, 12, 12);
    c.lineJoin = "round";
    c.lineCap = "round";
    [[38, dark ? "#4a3420" : "#9b6b3c"], [30, dark ? "#6b4a2c" : "#c99a62"]].forEach(function (_ref5) {
      var _ref6 = _slicedToArray(_ref5, 2),
        w = _ref6[0],
        col = _ref6[1];
      c.strokeStyle = col;
      c.lineWidth = w;
      c.beginPath();
      s.P.forEach(function (p, i) {
        return i ? c.lineTo(p.x, p.y) : c.moveTo(p.x, p.y);
      });
      c.stroke();
    });
    var end = s.P[s.P.length - 2];
    G.emoji(c, "🏠", W - 22, end.y - 26, 34);
    s.pads.forEach(function (p) {
      c.fillStyle = dark ? "rgba(0,0,0,0.35)" : "rgba(60,40,20,0.25)";
      c.beginPath();
      c.arc(p.x, p.y, 22, 0, 7);
      c.fill();
      if (!p.t) {
        c.strokeStyle = "rgba(255,255,255,0.6)";
        c.lineWidth = 2;
        c.setLineDash([4, 4]);
        c.beginPath();
        c.arc(p.x, p.y, 20, 0, 7);
        c.stroke();
        c.setLineDash([]);
        G.text(c, "+", p.x, p.y + 1, 14, "rgba(255,255,255,0.8)");
        return;
      }
      var ty = _this2.ty(p.t),
        ring = ["#c98a4b", "#d9dee6", "#ffd23f"][p.t.tier];
      c.strokeStyle = ring;
      c.lineWidth = 3;
      c.beginPath();
      c.arc(p.x, p.y, 21, 0, 7);
      c.stroke();
      G.img(c, ty.face, p.x, p.y - 2, 36);
      c.fillStyle = "rgba(255,255,255,0.85)";
      c.beginPath();
      c.arc(p.x + 16, p.y + 14, 11, 0, 7);
      c.fill();
      G.emoji(c, ty.em, p.x + 16, p.y + 14, 16);
      G.text(c, "★".repeat(p.t.lv), p.x, p.y - 24, 10, ring);
      var nx = _this2.next(s, p.t);
      if (nx && s.money >= nx.c) {
        c.fillStyle = "#2e7d32";
        c.beginPath();
        c.arc(p.x - 16, p.y + 14, 9, 0, 7);
        c.fill();
        G.text(c, nx.evolve ? "⇪" : "▲", p.x - 16, p.y + 15, 10, "#fff");
      }
    });
    s.foes.forEach(function (f) {
      if (f.x == null) return;
      G.emoji(c, f.em, f.x, f.y - 4, f.sz);
      if (f.k === "boss") return;
      c.fillStyle = "#300";
      c.fillRect(f.x - 13, f.y - 22, 26, 4);
      c.fillStyle = f.slow > 0 ? "#5ab0ff" : "#5be35b";
      c.fillRect(f.x - 13, f.y - 22, 26 * Math.max(0, f.hp / f.max), 4);
    });
    s.shots.forEach(function (b) {
      return G.emoji(c, "🦴", b.x, b.y, 14);
    });
    s.fx.forEach(function (e) {
      if (e.splash) {
        c.fillStyle = "rgba(90,176,255,0.35)";
        c.beginPath();
        c.arc(e.x, e.y, e.splash, 0, 7);
        c.fill();
      } else if (e.line) {
        c.strokeStyle = "rgba(255,210,63,0.9)";
        c.lineWidth = 3;
        c.beginPath();
        c.moveTo(e.fx, e.fy);
        c.lineTo(e.x, e.y);
        c.stroke();
      } else G.text(c, e.txt, e.x, e.y - 20 - (0.4 - e.t) * 40, 10, "#ffd23f");
    });
    if (s.pick != null && s.pads[s.pick].t) {
      var p = s.pads[s.pick],
        ty = this.ty(p.t),
        rng = ty.range * (1 + 0.12 * (p.t.lv - 1)),
        m = this.menu(G, p),
        nx = this.next(s, p.t);
      c.fillStyle = "rgba(255,255,255,0.12)";
      c.strokeStyle = "rgba(255,255,255,0.7)";
      c.lineWidth = 2;
      c.beginPath();
      c.arc(p.x, p.y, rng, 0, 7);
      c.fill();
      c.stroke();
      var btn = function btn(r, l1, l2, bg, fg) {
        c.fillStyle = "rgba(0,0,0,0.35)";
        c.fillRect(r.x + 2, r.y + 3, r.w, r.h);
        c.fillStyle = bg;
        c.fillRect(r.x, r.y, r.w, r.h);
        G.text(c, l1, r.x + r.w / 2, r.y + 15, 10, fg);
        G.text(c, l2, r.x + r.w / 2, r.y + 32, 10, fg);
      };
      btn(m.up, nx ? nx.evolve ? "SWAP ".concat(this.LINES[p.t.k][p.t.tier + 1].name) : "UPGRADE \u2605".concat(p.t.lv + 1) : "MAXED", nx ? "".concat(nx.c, " \uD83C\uDF56") : "", nx && s.money >= nx.c ? "#ffd23f" : "#777", "#222");
      btn(m.sell, "SELL", "+".concat(this.refund(p.t), " \uD83C\uDF56"), "#e57373", "#222");
    }
    G.hud(c, "\uD83C\uDF56".concat(s.money), "WAVE ".concat(s.wave, " \xB7 ").concat(s.score), "\u2764\uFE0F".concat(Math.max(0, s.lives)));
    if (s.boss && !s.boss.dead) {
      var b = s.boss,
        bw = W - 40;
      c.fillStyle = "rgba(0,0,0,0.6)";
      c.fillRect(20, 40, bw, 16);
      c.fillStyle = "#e53935";
      c.fillRect(22, 42, (bw - 4) * Math.max(0, b.hp / b.max), 12);
      G.text(c, b.bn, W / 2, 48, 9, "#fff");
    } else if (s.unl < 2) {
      var a = this.UNLOCK[s.unl],
        _b = this.UNLOCK[s.unl + 1];
      c.fillStyle = "rgba(0,0,0,0.35)";
      c.fillRect(20, 40, W - 40, 6);
      c.fillStyle = "#ffd23f";
      c.fillRect(20, 40, (W - 40) * Math.min(1, (s.score - a) / (_b - a)), 6);
    }
    c.fillStyle = dark ? "#151515" : "#2b2b2b";
    c.fillRect(0, s.bot, W, H - s.bot);
    T.forEach(function (ty, i) {
      var bw = W / 3,
        x = i * bw,
        on = s.sel === i,
        ok = s.money >= ty.cost;
      c.fillStyle = on ? "#ffd23f" : "rgba(255,255,255,0.08)";
      c.fillRect(x + 5, s.bot + 6, bw - 10, H - s.bot - 12);
      G.emoji(c, ty.em, x + bw / 2 - 26, s.bot + (H - s.bot) / 2, 24);
      G.text(c, ty.name, x + bw / 2 + 14, s.bot + (H - s.bot) / 2 - 10, 10, on ? "#222" : "#fff");
      G.text(c, "".concat(ty.cost), x + bw / 2 + 14, s.bot + (H - s.bot) / 2 + 10, 10, on ? "#222" : ok ? "#ffd23f" : "#ff6b6b");
    });
    if (s.msg) G.banner(c, s.msg.txt, "#fff", H * 0.45, s.msg.txt.length > 9 ? 18 : undefined);
    G.hint(c, "PICK A DOG · TAP A PAD", 5, s.bot - 24);
  }
});