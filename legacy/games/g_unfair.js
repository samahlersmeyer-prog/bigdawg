function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
(function () {
  var TOUCH = typeof window !== "undefined" && "ontouchstart" in window;
  var SOLID = "#B?!uFK";
  var TROLL = ["Didn't see that coming?", "Unfair, right?", "LOL", "Bad dawg.", "Trust no block.", "Skill issue.", "That one's on you.", "Who put that there?", "Again!", "Nice try."];
  var LV = [{
    name: "Easy, right?",
    w: 64,
    f: function f(a) {
      a.gr(0, 14);
      a.gr(17, 26);
      a.ff(27, 29);
      a.gr(30, 30);
      a.gr(34, 63);
      a.s(2, 9, "P");
      a.row(5, 7, 6, "B");
      a.s(6, 6, "?");
      a.s(15, 8, "i");
      a.s(22, 9, "c");
      a.row(24, 25, 6, "b");
      a.s(28, 7, "b");
      a.s(38, 9, "h");
      a.row(41, 43, 6, "B");
      a.s(42, 6, "!");
      a.s(47, 2, "A");
      a.s(53, 9, "R");
      a.s(61, 9, "G");
    }
  }, {
    name: "Watch your head",
    w: 70,
    f: function f(a) {
      a.gr(0, 12);
      a.row(13, 15, 7, "B");
      a.gr(16, 30);
      a.gr(33, 44);
      a.ff(45, 48);
      a.gr(49, 69);
      a.s(2, 9, "P");
      a.s(19, 9, "^");
      a.s(19, 6, "i");
      a.s(24, 9, "c");
      a.s(26, 9, "c");
      a.s(28, 6, "?");
      a.s(37, 2, "A");
      a.s(39, 2, "A");
      a.s(41, 2, "A");
      a.row(46, 47, 8, "b");
      a.row(51, 53, 6, "B");
      a.s(52, 6, "!");
      a.s(57, 9, "h");
      a.s(58, 9, "h");
      a.s(66, 9, "G");
    }
  }, {
    name: "Trust nothing",
    w: 64,
    f: function f(a) {
      a.gr(0, 3);
      a.ff(4, 6);
      a.gr(7, 20);
      a.gr(24, 40);
      a.gr(44, 55);
      a.ff(56, 58);
      a.gr(59, 63);
      a.s(1, 9, "P");
      a.s(11, 6, "?");
      a.s(13, 6, "!");
      a.s(15, 6, "?");
      a.s(18, 9, "c");
      a.s(22, 7, "b");
      a.row(28, 29, 9, "^");
      a.col(33, 8, 9, "B");
      a.s(34, 9, "h");
      a.s(35, 9, "h");
      a.s(48, 9, "R");
      a.s(57, 7, "b");
      a.s(60, 9, "G");
    }
  }, {
    name: "Stairway to nope",
    w: 68,
    f: function f(a) {
      a.gr(0, 18);
      a.gr(22, 40);
      a.gr(45, 67);
      a.s(2, 9, "P");
      a.col(8, 9, 9, "B");
      a.col(9, 8, 9, "B");
      a.col(10, 7, 9, "B");
      a.col(11, 7, 9, "B");
      a.s(11, 6, "F");
      a.col(12, 8, 9, "B");
      a.col(13, 9, 9, "B");
      a.s(19, 8, "i");
      a.s(26, 9, "c");
      a.s(28, 9, "c");
      a.s(30, 9, "c");
      a.s(33, 6, "?");
      a.s(34, 6, "!");
      a.s(35, 6, "?");
      a.s(38, 2, "A");
      a.s(42, 8, "B");
      a.s(43, 8, "F");
      a.s(42, 6, "b");
      a.s(48, 9, "h");
      a.s(52, 9, "R");
      a.row(56, 57, 9, "^");
      a.s(62, 1, "A");
      a.s(63, 9, "G");
    }
  }, {
    name: "The flag hates you",
    w: 80,
    f: function f(a) {
      a.gr(0, 13);
      a.ff(14, 16);
      a.gr(17, 37);
      a.gr(41, 61);
      a.ff(64, 65);
      a.gr(66, 79);
      a.s(2, 9, "P");
      a.s(9, 9, "^");
      a.s(9, 6, "i");
      a.s(15, 7, "b");
      a.s(20, 9, "c");
      a.s(21, 9, "c");
      a.s(22, 9, "c");
      a.s(26, 2, "A");
      a.s(27, 2, "A");
      a.s(28, 2, "A");
      a.s(29, 2, "A");
      a.row(33, 35, 6, "!");
      a.s(38, 8, "i");
      a.s(44, 9, "h");
      a.s(46, 9, "h");
      a.s(50, 9, "R");
      a.s(58, 9, "R");
      a.s(72, 9, "h");
      a.s(74, 9, "G");
    }
  }];
  function build(L) {
    var g = [];
    for (var y = 0; y < 12; y++) {
      var r = [];
      for (var x = 0; x < L.w; x++) r.push(".");
      g.push(r);
    }
    var set = function set(x, y, ch) {
      if (x >= 0 && x < L.w && y >= 0 && y < 12) g[y][x] = ch;
    };
    L.f({
      s: set,
      gr: function gr(p, q) {
        for (var _x = p; _x <= q; _x++) {
          set(_x, 10, "#");
          set(_x, 11, "#");
        }
      },
      ff: function ff(p, q) {
        for (var _x2 = p; _x2 <= q; _x2++) {
          set(_x2, 10, "F");
          set(_x2, 11, ".");
        }
      },
      row: function row(p, q, y, ch) {
        for (var _x3 = p; _x3 <= q; _x3++) set(_x3, y, ch);
      },
      col: function col(x, p, q, ch) {
        for (var _y = p; _y <= q; _y++) set(x, _y, ch);
      }
    });
    return g;
  }
  defGame({
    key: "unfair",
    name: "Unfair Dawg",
    icon: "😈",
    max: 99999,
    blurb: "A cute little platformer. Totally fair. 9 lives.",
    how: "Run right and touch the flag. Hold the left quarter of the screen to walk left, the next quarter to walk right, and tap the right half to jump (hold it to jump higher). Arrow keys and space work too. Bonk ? blocks for bones (+25) and stomp cats (+50). Each level is +1000, or +1500 with no deaths. Fair warning: the level is out to get you. Blocks hide where you jump, the ground falls away, spikes pop up and not every flag is real. You get 9 lives, like a cat.",
    LV: LV,
    reset: function reset(G) {
      var s = G.s = {
        lv: 0,
        lives: 9,
        pts: 0,
        got: {},
        deaths: 0,
        keys: {},
        inL: 0,
        inR: 0,
        inJ: 0,
        jb: 0,
        coy: 0,
        cam: 0
      };
      this.size(G);
      this.load(G);
      this.hook();
    },
    size: function size(G) {
      var s = G.s,
        playH = G.H - 34 - 96;
      s.T = Math.max(18, Math.floor(Math.min(playH / 12, G.W / 10.5)));
      s.oy = G.H - 96 - 12 * s.T;
    },
    hook: function hook() {
      if (window._unfairT) return;
      window._unfairT = 1;
      var w = $("gwrap");
      if (!w) return;
      var f = function f(e) {
        if (G.key !== "unfair" || G.state !== "play" || !G.s) return;
        var r = w.getBoundingClientRect(),
          xs = [];
        for (var i = 0; i < e.touches.length; i++) xs.push(e.touches[i].clientX - r.left);
        GAMEDEFS.unfair.zone(G, xs);
      };
      ["touchstart", "touchmove", "touchend", "touchcancel"].forEach(function (n) {
        return w.addEventListener(n, f, {
          passive: true
        });
      });
    },
    zone: function zone(G, xs) {
      var s = G.s,
        W = G.W;
      s.inL = xs.some(function (x) {
        return x < W * 0.25;
      });
      s.inR = xs.some(function (x) {
        return x >= W * 0.25 && x < W * 0.5;
      });
      var j = xs.some(function (x) {
        return x >= W * 0.5;
      });
      if (j && !s.inJ) s.jb = 0.14;
      s.inJ = j;
    },
    down: function down(G, x) {
      if (!TOUCH) this.zone(G, [x]);
    },
    up: function up(G) {
      if (!TOUCH) this.zone(G, []);
    },
    onKey: function onKey(G, k, d) {
      var s = G.s,
        m = {
          ArrowLeft: "L",
          a: "L",
          ArrowRight: "R",
          d: "R",
          ArrowUp: "J",
          w: "J",
          " ": "J"
        }[k];
      if (!m) return;
      if (m === "J" && d && !s.keys.J) s.jb = 0.14;
      s.keys[m] = d;
    },
    load: function load(G) {
      var s = G.s,
        L = LV[s.lv],
        g = build(L);
      Object.assign(s, {
        w: L.w,
        g: g,
        cats: [],
        anv: [],
        flags: [],
        hs: [],
        bones: [],
        ff: [],
        deb: [],
        pops: [],
        goal: null,
        dead: 0,
        clear: 0,
        lt: 0,
        lvDeaths: s.lvDeaths || 0
      });
      var px = 2,
        py = 9;
      for (var y = 0; y < 12; y++) for (var x = 0; x < L.w; x++) {
        var ch = g[y][x],
          k = s.lv + ":" + x + "," + y;
        if (ch === "P") {
          px = x;
          py = y;
        } else if (ch === "c") s.cats.push({
          x: x + 0.1,
          y: y + 0.25,
          vx: -2,
          vy: 0,
          w: 0.8,
          h: 0.75
        });else if (ch === "b") {
          if (!s.got[k]) s.bones.push({
            x: x,
            y: y
          });
        } else if (ch === "A") s.anv.push({
          x: x,
          y: y,
          vy: 0,
          st: 0
        });else if (ch === "R") s.flags.push({
          x: x,
          y: y,
          oy: 0,
          vy: 0,
          st: 0
        });else if (ch === "G") s.goal = {
          x: x,
          y: y
        };else if (ch === "h") s.hs.push({
          x: x,
          y: y
        });else if (ch === "?" && s.got[k]) {
          g[y][x] = "u";
          continue;
        } else continue;
        g[y][x] = ".";
      }
      s.p = {
        x: px + 0.15,
        y: py + 0.15,
        vx: 0,
        vy: 0,
        w: 0.7,
        h: 0.85,
        gr: false,
        rot: 0
      };
      s.cam = Math.max(0, s.p.x * s.T - G.W * 0.42);
      s.clouds = [];
      for (var i = 0; i < L.w / 6; i++) s.clouds.push({
        x: i * 6 + Math.random() * 3,
        y: 0.5 + Math.random() * 3,
        s: 0.8 + Math.random() * 0.6
      });
    },
    tile: function tile(s, x, y) {
      return y < 0 || y >= 12 || x < 0 || x >= s.w ? "." : s.g[y][x];
    },
    solid: function solid(s, x, y) {
      if (x < 0 || x >= s.w) return true;
      if (y < 0 || y >= 12) return false;
      return SOLID.indexOf(s.g[y][x]) >= 0;
    },
    pop: function pop(s, x, y, txt, col) {
      s.pops.push({
        x: x,
        y: y,
        t: 1,
        txt: txt,
        col: col || "#fff"
      });
    },
    die: function die(G, why) {
      var s = G.s;
      if (s.dead || s.clear) return;
      s.dead = 1.5;
      s.p.vy = -13;
      s.p.vx = 0;
      s.lives--;
      s.deaths++;
      s.lvDeaths++;
      s.msg = why || TROLL[Math.floor(Math.random() * TROLL.length)];
      G.sfx("lose");
      G.buzz();
    },
    update: function update(G, dt) {
      var _this = this;
      var s = G.s,
        p = s.p;
      if (!s.T) this.size(G);
      s.lt += dt;
      s.jb = Math.max(0, s.jb - dt);
      s.pops.forEach(function (o) {
        o.t -= dt;
        o.y -= 1.2 * dt;
      });
      s.pops = s.pops.filter(function (o) {
        return o.t > 0;
      });
      s.deb.forEach(function (d) {
        d.vy += 40 * dt;
        d.y += d.vy * dt;
      });
      s.deb = s.deb.filter(function (d) {
        return d.y < 14;
      });
      if (s.dead) {
        p.vy += 40 * dt;
        p.y += p.vy * dt;
        p.rot += dt * 6;
        s.dead -= dt;
        if (s.dead <= 0) {
          if (s.lives <= 0) return G.over(s.pts, s.lv >= 3 ? "So close. Not really." : s.lv ? "Trolled!" : "Told you. Unfair.");
          this.load(G);
        }
        return;
      }
      if (s.clear) {
        s.clear -= dt;
        if (s.clear <= 0) {
          s.lv++;
          s.lvDeaths = 0;
          if (s.lv >= LV.length) {
            s.pts += s.lives * 250;
            s.lv = LV.length - 1;
            G.sfx("win");
            return G.over(s.pts, "You beat it?!");
          }
          this.load(G);
        }
        return;
      }
      var dir = (s.inR || s.keys.R ? 1 : 0) - (s.inL || s.keys.L ? 1 : 0);
      p.vx += (dir * 6.5 - p.vx) * Math.min(1, dt * (dir ? 10 : 14));
      s.coy = p.gr ? 0.09 : Math.max(0, s.coy - dt);
      if (s.jb > 0 && s.coy > 0) {
        p.vy = -15.5;
        s.jb = 0;
        s.coy = 0;
        p.gr = false;
        G.sfx("pass");
      }
      var held = s.inJ || s.keys.J;
      if (!held && p.vy < -6) p.vy = -6;
      p.vy = Math.min(22, p.vy + 48 * dt);
      p.x += p.vx * dt;
      var y0 = Math.floor(p.y + 0.02),
        y1 = Math.floor(p.y + p.h - 0.02);
      if (p.vx > 0) {
        var tx = Math.floor(p.x + p.w);
        for (var ty = y0; ty <= y1; ty++) if (this.solid(s, tx, ty)) {
          p.x = tx - p.w - 0.001;
          p.vx = 0;
          break;
        }
      } else if (p.vx < 0) {
        var _tx = Math.floor(p.x);
        for (var _ty = y0; _ty <= y1; _ty++) if (this.solid(s, _tx, _ty)) {
          p.x = _tx + 1.001;
          p.vx = 0;
          break;
        }
      }
      p.y += p.vy * dt;
      p.gr = false;
      var x0 = Math.floor(p.x + 0.04),
        x1 = Math.floor(p.x + p.w - 0.04);
      if (p.vy > 0) {
        var _ty2 = Math.floor(p.y + p.h);
        for (var _tx2 = x0; _tx2 <= x1; _tx2++) if (this.solid(s, _tx2, _ty2)) {
          p.y = _ty2 - p.h;
          p.vy = 0;
          p.gr = true;
          var _loop = function _loop(fx) {
            if (_this.tile(s, fx, _ty2) === "F" && !s.ff.some(function (f) {
              return f.x === fx && f.y === _ty2;
            })) s.ff.push({
              x: fx,
              y: _ty2,
              t: 0.16
            });
          };
          for (var fx = x0; fx <= x1; fx++) {
            _loop(fx);
          }
          break;
        }
      } else if (p.vy < 0) {
        var _ty3 = Math.floor(p.y);
        if (_ty3 >= 0) {
          var hit = -1;
          for (var _tx3 = x0; _tx3 <= x1; _tx3++) {
            if (this.tile(s, _tx3, _ty3) === "i") {
              s.g[_ty3][_tx3] = "u";
              this.pop(s, _tx3 + 0.5, _ty3, "lol", "#ff8fab");
            }
            if (this.solid(s, _tx3, _ty3)) {
              var c = Math.floor(p.x + p.w / 2);
              if (hit < 0 || _tx3 === c) hit = _tx3;
            }
          }
          if (hit >= 0) {
            p.y = _ty3 + 1;
            p.vy = 1;
            this.bonk(G, hit, _ty3);
          }
        }
      }
      var cx = p.x + p.w / 2;
      s.ff.forEach(function (f) {
        f.t -= dt;
        if (f.t <= 0 && s.g[f.y][f.x] === "F") {
          s.g[f.y][f.x] = ".";
          s.deb.push({
            x: f.x,
            y: f.y,
            vy: 0
          });
        }
      });
      s.ff = s.ff.filter(function (f) {
        return f.t > 0;
      });
      s.hs = s.hs.filter(function (h) {
        if (Math.abs(cx - (h.x + 0.5)) < 1.15 && p.y + p.h > h.y - 0.6) {
          s.g[h.y][h.x] = "^";
          _this.pop(s, h.x + 0.5, h.y - 0.5, "lol", "#ff8fab");
          G.sfx("pop");
          return false;
        }
        return true;
      });
      for (var _ty4 = Math.floor(p.y); _ty4 <= Math.floor(p.y + p.h); _ty4++) for (var _tx4 = Math.floor(p.x); _tx4 <= Math.floor(p.x + p.w); _tx4++) if (this.tile(s, _tx4, _ty4) === "^" && p.x + p.w > _tx4 + 0.15 && p.x < _tx4 + 0.85 && p.y + p.h > _ty4 + 0.45) return this.die(G);
      s.bones = s.bones.filter(function (b) {
        if (Math.abs(cx - (b.x + 0.5)) < 0.7 && Math.abs(p.y + p.h / 2 - (b.y + 0.5)) < 0.8) {
          s.got[s.lv + ":" + b.x + "," + b.y] = 1;
          s.pts += 25;
          _this.pop(s, b.x + 0.5, b.y, "+25", "#ffd23f");
          G.sfx("pop");
          return false;
        }
        return true;
      });
      var _iterator = _createForOfIteratorHelper(s.anv),
        _step;
      try {
        var _loop2 = function _loop2() {
            var a = _step.value;
            if (a.st === 0 && cx > a.x - 0.4 && cx < a.x + 1.4 && p.y > a.y) {
              a.st = 1;
              G.sfx("pass");
            }
            if (a.st !== 1) return 0;
            a.vy += 70 * dt;
            a.y += a.vy * dt;
            if (_this.solid(s, a.x, Math.floor(a.y + 1))) {
              a.y = Math.floor(a.y + 1) - 1;
              a.st = 2;
              if (a.y >= 0) s.g[a.y][a.x] = "K";
              s.shake = 0.25;
              G.sfx("pop");
            } else if (a.y > 13) a.st = 2;
            if (p.x + p.w > a.x + 0.1 && p.x < a.x + 0.9 && p.y < a.y + 0.95 && p.y + p.h > a.y + 0.1) return {
              v: _this.die(G, "Anvil'd.")
            };
            s.cats.forEach(function (k) {
              if (!k.dead && k.x + k.w > a.x && k.x < a.x + 1 && k.y < a.y + 1 && k.y + k.h > a.y) k.dead = 0.4;
            });
          },
          _ret;
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          _ret = _loop2();
          if (_ret === 0) continue;
          if (_ret) return _ret.v;
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
      s.anv = s.anv.filter(function (a) {
        return a.st !== 2;
      });
      var _iterator2 = _createForOfIteratorHelper(s.cats),
        _step2;
      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var k = _step2.value;
          if (k.dead) {
            k.dead -= dt;
            continue;
          }
          k.x += k.vx * dt;
          var ky0 = Math.floor(k.y + 0.05),
            ky1 = Math.floor(k.y + k.h - 0.05);
          var _tx5 = k.vx > 0 ? Math.floor(k.x + k.w) : Math.floor(k.x);
          for (var _ty5 = ky0; _ty5 <= ky1; _ty5++) if (this.solid(s, _tx5, _ty5)) {
            k.x = k.vx > 0 ? _tx5 - k.w - 0.001 : _tx5 + 1.001;
            k.vx = -k.vx;
            break;
          }
          k.vy = Math.min(22, k.vy + 48 * dt);
          k.y += k.vy * dt;
          var _ty6 = Math.floor(k.y + k.h);
          if (k.vy > 0 && (this.solid(s, Math.floor(k.x + 0.1), _ty6) || this.solid(s, Math.floor(k.x + k.w - 0.1), _ty6))) {
            k.y = _ty6 - k.h;
            k.vy = 0;
          }
          if (k.y > 13) k.dead = 0.01;
          if (p.x + p.w > k.x + 0.08 && p.x < k.x + k.w - 0.08 && p.y + p.h > k.y + 0.1 && p.y < k.y + k.h) {
            if (p.vy > 0 && p.y + p.h - k.y < 0.5) {
              k.dead = 0.45;
              k.flat = 1;
              p.vy = -10;
              s.pts += 50;
              this.pop(s, k.x + 0.4, k.y, "+50", "#ffd23f");
              G.sfx("pop");
            } else return this.die(G, "Cat got you.");
          }
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
      s.cats = s.cats.filter(function (k) {
        return !(k.dead && k.dead <= 0);
      });
      var _iterator3 = _createForOfIteratorHelper(s.flags),
        _step3;
      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var f = _step3.value;
          if (f.st === 0 && Math.abs(cx - (f.x + 0.5)) < 3.2) {
            f.st = 1;
            f.vy = -2;
            this.pop(s, f.x + 0.5, f.y - 5, "NOPE", "#ff8fab");
            G.sfx("pass");
          }
          if (f.st === 1) {
            f.vy -= 30 * dt;
            f.oy += f.vy * dt;
          }
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }
      if (s.goal && cx > s.goal.x + 0.15 && cx < s.goal.x + 1.2 && p.y + p.h > s.goal.y - 5) {
        var bonus = 1000 + (s.lvDeaths === 0 ? 500 : 0);
        s.pts += bonus;
        s.clear = 1.8;
        s.clearMsg = s.lvDeaths === 0 ? "FLAWLESS +1500" : "LEVEL CLEAR +1000";
        G.sfx("win");
        return;
      }
      if (p.y > 12.6) return this.die(G);
      p.rot = p.gr ? 0 : p.rot;
      s.shake = Math.max(0, (s.shake || 0) - dt);
    },
    bonk: function bonk(G, x, y) {
      var s = G.s,
        ch = s.g[y][x],
        k = s.lv + ":" + x + "," + y;
      if (ch === "?") {
        s.g[y][x] = "u";
        s.got[k] = 1;
        s.pts += 25;
        this.pop(s, x + 0.5, y - 0.6, "🦴 +25", "#ffd23f");
        G.sfx("pop");
      } else if (ch === "!") {
        s.g[y][x] = "u";
        var dir = s.p.x < x ? -1 : 1;
        s.cats.push({
          x: x + 0.1,
          y: y - 0.8,
          vx: 4 * (dir < 0 ? -1 : 1),
          vy: -6,
          w: 0.8,
          h: 0.75,
          mad: 1
        });
        this.pop(s, x + 0.5, y - 1, "lol", "#ff8fab");
        G.sfx("pass");
      } else {
        s.bump = {
          x: x,
          y: y,
          t: 0.15
        };
        G.sfx("pass");
      }
    },
    draw: function draw(G, c) {
      var s = G.s,
        W = G.W,
        H = G.H;
      if (!s.g) return;
      if (!s.T) this.size(G);
      var T = s.T,
        p = s.p,
        dark = G.dark();
      var want = Math.max(0, Math.min(s.w * T - W, (p.x + p.w / 2) * T - W * 0.42));
      s.cam += (want - s.cam) * 0.2;
      if (Math.abs(want - s.cam) > W) s.cam = want;
      var sk = s.shake ? (Math.random() - 0.5) * 6 : 0;
      var cam = Math.round(s.cam + sk),
        oy = s.oy;
      var sky = c.createLinearGradient(0, 0, 0, H);
      sky.addColorStop(0, dark ? "#1b2a55" : "#6ec6ff");
      sky.addColorStop(1, dark ? "#3b4f88" : "#bfe8ff");
      c.fillStyle = sky;
      c.fillRect(0, 0, W, H);
      c.fillStyle = dark ? "#24405a" : "#8fd694";
      for (var i = -1; i < W / 160 + 2; i++) {
        var hx = i * 160 - cam * 0.3 % 160;
        c.beginPath();
        c.ellipse(hx + 80, oy + 10 * T, 110, 3 * T, 0, Math.PI, 0);
        c.fill();
      }
      s.clouds.forEach(function (cl) {
        var x = cl.x * T - cam * 0.5,
          y = oy + cl.y * T,
          r = T * 0.55 * cl.s;
        if (x < -3 * T || x > W + 3 * T) return;
        c.fillStyle = dark ? "rgba(255,255,255,0.25)" : "#fff";
        c.beginPath();
        c.arc(x, y, r, 0, 7);
        c.arc(x + r, y - r * 0.4, r * 1.1, 0, 7);
        c.arc(x + r * 2, y, r, 0, 7);
        c.fill();
        c.fillStyle = "rgba(0,0,0,0.5)";
        c.fillRect(x + r * 0.7, y - r * 0.3, 2, 3);
        c.fillRect(x + r * 1.3, y - r * 0.3, 2, 3);
      });
      var tx0 = Math.max(0, Math.floor(cam / T)),
        tx1 = Math.min(s.w - 1, Math.ceil((cam + W) / T));
      var rr = function rr(x, y, w, h, r) {
        c.beginPath();
        if (c.roundRect) c.roundRect(x, y, w, h, r);else c.rect(x, y, w, h);
      };
      for (var y = 0; y < 12; y++) for (var x = tx0; x <= tx1; x++) {
        var ch = s.g[y][x];
        if (ch === ".") continue;
        var X = x * T - cam,
          Y = oy + y * T;
        if (s.bump && s.bump.x === x && s.bump.y === y) Y -= 4;
        if (ch === "#" || ch === "F") {
          c.fillStyle = dark ? "#7a4a22" : "#c8742c";
          c.fillRect(X, Y, T + 0.5, T + 0.5);
          c.fillStyle = "rgba(0,0,0,0.12)";
          c.fillRect(X + T * 0.2, Y + T * 0.55, 3, 3);
          c.fillRect(X + T * 0.65, Y + T * 0.3, 3, 3);
          var up = this.tile(s, x, y - 1);
          if (up !== "#" && up !== "F") {
            c.fillStyle = "#4caf50";
            c.fillRect(X, Y, T + 0.5, T * 0.24);
            c.fillStyle = "#7bd67f";
            c.fillRect(X, Y, T + 0.5, T * 0.08);
          }
        } else if (ch === "B") {
          c.fillStyle = "#b5502a";
          c.fillRect(X, Y, T, T);
          c.fillStyle = "#e6a07a";
          c.fillRect(X, Y + T / 2 - 1, T, 2);
          c.fillRect(X, Y, T, 2);
          c.fillRect(X + T / 2 - 1, Y, 2, T / 2);
          c.fillRect(X + T / 4 - 1, Y + T / 2, 2, T / 2);
          c.fillRect(X + T * 3 / 4 - 1, Y + T / 2, 2, T / 2);
        } else if (ch === "?" || ch === "!") {
          var bob = Math.sin(G.t * 4 + x) * 1.2;
          c.fillStyle = "#f5b52a";
          rr(X + 1, Y + 1 + bob, T - 2, T - 2, 4);
          c.fill();
          c.strokeStyle = "#a8660a";
          c.lineWidth = 2;
          c.stroke();
          G.text(c, "?", X + T / 2, Y + T / 2 + bob + 1, T * 0.45, "#7a3e00");
        } else if (ch === "u" || ch === "K") {
          c.fillStyle = ch === "K" ? "#55595f" : "#9a7b5a";
          rr(X + 1, Y + 1, T - 2, T - 2, 3);
          c.fill();
          if (ch === "K") G.text(c, "TON", X + T / 2, Y + T / 2, T * 0.22, "#ddd");
        } else if (ch === "^") {
          c.fillStyle = "#e8eef5";
          c.strokeStyle = "#7d8a99";
          c.lineWidth = 1;
          for (var _i = 0; _i < 2; _i++) {
            c.beginPath();
            c.moveTo(X + _i * T / 2, Y + T);
            c.lineTo(X + _i * T / 2 + T / 4, Y + T * 0.35);
            c.lineTo(X + (_i + 1) * T / 2, Y + T);
            c.fill();
            c.stroke();
          }
        }
      }
      if (s.bump) {
        s.bump.t -= 1 / 60;
        if (s.bump.t <= 0) s.bump = null;
      }
      s.deb.forEach(function (d) {
        c.fillStyle = "#c8742c";
        c.fillRect(d.x * T - cam, oy + d.y * T, T, T);
        c.fillStyle = "#4caf50";
        c.fillRect(d.x * T - cam, oy + d.y * T, T, T * 0.22);
      });
      s.bones.forEach(function (b) {
        return G.emoji(c, "🦴", (b.x + 0.5) * T - cam, oy + (b.y + 0.5) * T + Math.sin(G.t * 3 + b.x) * 2, T * 0.7);
      });
      s.anv.forEach(function (a) {
        var X = a.x * T - cam,
          Y = oy + a.y * T;
        c.fillStyle = "#3d4046";
        c.fillRect(X, Y, T, T * 0.3);
        c.fillRect(X + T * 0.25, Y + T * 0.3, T * 0.5, T * 0.4);
        c.fillRect(X + T * 0.1, Y + T * 0.7, T * 0.8, T * 0.3);
        if (a.st === 0) {
          c.strokeStyle = "rgba(0,0,0,0.35)";
          c.beginPath();
          c.moveTo(X + T / 2, Y);
          c.lineTo(X + T / 2, 0);
          c.stroke();
        }
      });
      var flag = function flag(x, y, oyy) {
        var X = (x + 0.5) * T - cam,
          top = oy + (y - 5) * T + oyy * T,
          bot = oy + (y + 1) * T + oyy * T;
        c.fillStyle = "#cfd8dc";
        c.fillRect(X - 2, top, 4, bot - top);
        c.fillStyle = "#ffd23f";
        c.beginPath();
        c.arc(X, top, 4, 0, 7);
        c.fill();
        c.fillStyle = "#2ecc71";
        c.beginPath();
        c.moveTo(X + 2, top + 4);
        c.lineTo(X + 2 + T * 1.3, top + 4 + T * 0.45);
        c.lineTo(X + 2, top + 4 + T * 0.9);
        c.fill();
        G.emoji(c, "🐾", X + T * 0.5, top + 4 + T * 0.45, T * 0.35);
      };
      s.flags.forEach(function (f) {
        return flag(f.x, f.y, f.oy);
      });
      if (s.goal) {
        flag(s.goal.x, s.goal.y, 0);
        var _X = (s.goal.x + 3) * T - cam,
          _Y = oy + (s.goal.y + 1) * T;
        c.fillStyle = "#e74c3c";
        c.beginPath();
        c.moveTo(_X - T * 1.2, _Y - T * 1.4);
        c.lineTo(_X, _Y - T * 2.4);
        c.lineTo(_X + T * 1.2, _Y - T * 1.4);
        c.fill();
        c.fillStyle = "#f4d03f";
        c.fillRect(_X - T, _Y - T * 1.4, T * 2, T * 1.4);
        c.fillStyle = "#3a2a1a";
        rr(_X - T * 0.35, _Y - T * 0.9, T * 0.7, T * 0.9, T * 0.35);
        c.fill();
      }
      s.cats.forEach(function (k) {
        var X = (k.x + k.w / 2) * T - cam,
          Y = oy + (k.y + k.h / 2) * T;
        c.save();
        c.translate(X, Y + (k.flat ? T * 0.25 : 0));
        if (k.flat) c.scale(1.2, 0.45);
        if (k.vx > 0) c.scale(-1, 1);
        G.emoji(c, k.mad ? "😾" : "🐱", 0, 0, T * 0.95);
        c.restore();
      });
      var face = s.dead ? ":dawgpain:" : !p.gr ? ":dawgpog:" : ":dawgW:";
      G.img(c, face, (p.x + p.w / 2) * T - cam, oy + (p.y + p.h / 2) * T - T * 0.08, T * 1.08, s.dead ? p.rot : 0);
      s.pops.forEach(function (o) {
        c.globalAlpha = Math.min(1, o.t * 2);
        G.text(c, o.txt, o.x * T - cam, oy + o.y * T, Math.max(10, T * 0.38), o.col);
        c.globalAlpha = 1;
      });
      var cy = H - 96;
      c.fillStyle = dark ? "#0d1220" : "#2b2d42";
      c.fillRect(0, cy, W, 96);
      c.fillStyle = "#4caf50";
      c.fillRect(0, cy, W, 3);
      var btn = function btn(x, w, on) {
        c.fillStyle = on ? "rgba(255,255,255,0.32)" : "rgba(255,255,255,0.12)";
        rr(x + 6, cy + 14, w - 12, 68, 16);
        c.fill();
      };
      var L_ = s.inL || s.keys.L,
        R_ = s.inR || s.keys.R,
        J_ = s.inJ || s.keys.J;
      btn(0, W * 0.25, L_);
      btn(W * 0.25, W * 0.25, R_);
      btn(W * 0.5, W * 0.5, J_);
      c.fillStyle = "#fff";
      var tri = function tri(x, d) {
        c.beginPath();
        c.moveTo(x + d * 12, cy + 48);
        c.lineTo(x - d * 10, cy + 34);
        c.lineTo(x - d * 10, cy + 62);
        c.fill();
      };
      tri(W * 0.125, -1);
      tri(W * 0.375, 1);
      G.text(c, "JUMP", W * 0.75, cy + 48, 13, "#fff");
      G.hud(c, "".concat(s.pts), "UNFAIR DAWG", "LIVES ".concat(s.lives));
      var ban = function ban(a, b, col) {
        c.fillStyle = "rgba(0,0,0,0.55)";
        c.fillRect(0, H * 0.3 - 34, W, b ? 72 : 48);
        G.text(c, a, W / 2, H * 0.3 - 10, Math.min(16, W / 22), col || "#ffd23f");
        if (b) G.text(c, b, W / 2, H * 0.3 + 18, Math.min(11, W / 34), "#fff");
      };
      if (s.dead) ban(s.msg, s.lives > 0 ? "".concat(s.lives, " ").concat(s.lives === 1 ? "life" : "lives", " left") : "Out of lives", "#ff8fab");else if (s.clear) ban(s.clearMsg, s.lv + 1 < LV.length ? "Next level..." : "Wait... you did it?");else if (s.lt < 1.8 && G.state === "play") ban("LEVEL ".concat(s.lv + 1), LV[s.lv].name);
    }
  });
})();