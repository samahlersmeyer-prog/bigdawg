function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
(function () {
  var rnd = function rnd(n) {
    return Math.floor(Math.random() * n);
  };
  var DIRS = {
    up: [0, -1, "UP", "⬆️"],
    down: [0, 1, "DOWN", "⬇️"],
    left: [-1, 0, "LEFT", "⬅️"],
    right: [1, 0, "RIGHT", "➡️"]
  };
  var COLS = [["RED", "#e53935"], ["BLUE", "#1e88e5"], ["GREEN", "#43a047"], ["YELLOW", "#fdd835"]];
  var MOODS = [":dawgW:", ":dawgpog:", ":dawgsus:", ":dawgpain:"];
  var BANDS = [[0.2, 0.5], [0.5, 0.68], [0.68, 0.98]];
  var TOYS = ["🧸", "🎾", "🦴", "🧦", "🥏", "🐤", "🪀", "🧶"];
  var VALS = [5, 8, 12, 16, 20, 25, 30];
  var MG = {
    says: {
      name: "DAWG SAYS",
      how: "SWIPE ONLY WHEN DAWG SAYS!",
      dur: 25,
      init: function init(G, m) {
        m.n = 0;
        m.strikes = 0;
        m.cmd = null;
        m.gap = 0.6;
      },
      next: function next(m) {
        var k = Object.keys(DIRS)[rnd(4)];
        m.cmd = {
          k: k,
          real: Math.random() < 0.72,
          t: 0,
          max: Math.max(0.85, 2.2 - m.n * 0.08)
        };
        m.n++;
      },
      res: function res(G, m, ok) {
        if (ok) {
          m.pts += 10;
          m.flash = {
            ok: 1,
            t: 0.4
          };
          G.sfx("pop");
        } else {
          m.strikes++;
          m.flash = {
            ok: 0,
            t: 0.5
          };
          G.buzz();
          if (m.strikes >= 3) m.end = 1;
        }
        m.cmd = null;
        m.gap = 0.35;
      },
      update: function update(G, m, dt) {
        if (!m.cmd) {
          m.gap -= dt;
          if (m.gap <= 0) this.next(m);
          return;
        }
        m.cmd.t += dt;
        if (m.cmd.t >= m.cmd.max) this.res(G, m, !m.cmd.real);
      },
      swipe: function swipe(G, m, dx, dy) {
        var c = m.cmd;
        if (!c) return;
        var d = DIRS[c.k];
        this.res(G, m, c.real && dx === d[0] && dy === d[1]);
      },
      draw: function draw(G, c, m, ink) {
        var W = G.W,
          H = G.H,
          cx = W / 2,
          cy = H * 0.42;
        G.img(c, m.flash && !m.flash.ok ? ":dawgsus:" : ":dawgW:", cx, cy, 120);
        if (m.cmd) {
          var d = DIRS[m.cmd.k];
          G.emoji(c, d[3], cx + d[0] * 95, cy + d[1] * 95, 46);
          if (m.cmd.real) G.text(c, "DAWG SAYS:", cx, H * 0.7, 14, "#ffd23f");
          G.text(c, "SWIPE ".concat(d[2], "!"), cx, H * 0.7 + 28, 18, ink);
          c.fillStyle = "rgba(0,0,0,0.2)";
          c.fillRect(40, H * 0.8, W - 80, 8);
          c.fillStyle = "#ff7043";
          c.fillRect(40, H * 0.8, (W - 80) * (1 - m.cmd.t / m.cmd.max), 8);
        }
        G.text(c, "❌".repeat(m.strikes) + "▫️".repeat(3 - m.strikes), cx, H * 0.88, 14, ink);
      }
    },
    lava: {
      name: "FLOOR IS LAVA",
      how: "TAP A TILE OF THE CALLED COLOR!",
      dur: 40,
      init: function init(G, m) {
        m.r = 0;
        this.color(G, m);
        m.px = G.W / 2;
        m.py = m.tiles[4].y;
        m.tx = m.px;
        m.ty = m.py;
      },
      color: function color(G, m) {
        var gw = Math.min(G.W - 40, G.H - 220),
          sz = gw / 3,
          x0 = (G.W - gw) / 2,
          y0 = 110;
        m.call = rnd(4);
        m.tiles = [];
        for (var i = 0; i < 9; i++) m.tiles.push({
          x: x0 + i % 3 * sz + sz / 2,
          y: y0 + Math.floor(i / 3) * sz + sz / 2,
          sz: sz - 8,
          col: rnd(4)
        });
        var n = Math.max(1, 4 - Math.floor(m.r / 3));
        m.tiles.forEach(function (t) {
          if (t.col === m.call) t.col = (t.col + 1 + rnd(3)) % 4;
        });
        for (var k = 0; k < n; k++) m.tiles[rnd(9)].col = m.call;
        m.ct = Math.max(1.1, 2.6 - m.r * 0.15);
        m.drop = 0;
      },
      update: function update(G, m, dt) {
        var dx = m.tx - m.px,
          dy = m.ty - m.py,
          d = Math.hypot(dx, dy),
          v = 650 * dt;
        if (d > v) {
          m.px += dx / d * v;
          m.py += dy / d * v;
        } else {
          m.px = m.tx;
          m.py = m.ty;
        }
        if (m.drop) {
          m.drop -= dt;
          if (m.drop <= 0) {
            if (m.fell) {
              m.end = 1;
              return;
            }
            m.r++;
            if (m.r >= 10) {
              m.end = 1;
              return;
            }
            this.color(G, m);
          }
          return;
        }
        m.ct -= dt;
        if (m.ct <= 0) {
          var t = m.tiles.reduce(function (a, b) {
            return Math.hypot(b.x - m.px, b.y - m.py) < Math.hypot(a.x - m.px, a.y - m.py) ? b : a;
          });
          m.fell = t.col !== m.call || Math.hypot(t.x - m.px, t.y - m.py) > t.sz / 2 + 6;
          if (m.fell) {
            G.sfx("lose");
            G.buzz();
          } else {
            m.pts += 20;
            G.sfx("pop");
          }
          m.drop = 0.9;
        }
      },
      tap: function tap(G, m, x, y) {
        if (m.drop) return;
        var t = m.tiles.find(function (t) {
          return Math.abs(t.x - x) < t.sz / 2 + 4 && Math.abs(t.y - y) < t.sz / 2 + 4;
        });
        if (t) {
          m.tx = t.x;
          m.ty = t.y;
        }
      },
      draw: function draw(G, c, m, ink) {
        m.tiles.forEach(function (t) {
          var gone = m.drop && t.col !== m.call;
          c.globalAlpha = gone ? Math.max(0, m.drop - 0.3) : 1;
          c.fillStyle = gone ? "#ff5722" : COLS[t.col][1];
          c.fillRect(t.x - t.sz / 2, t.y - t.sz / 2, t.sz, t.sz);
          c.globalAlpha = 1;
        });
        G.img(c, m.drop && m.fell ? ":dawgpain:" : ":dawgpog:", m.px, m.py, 54);
        var _COLS$m$call = _slicedToArray(COLS[m.call], 2),
          nm = _COLS$m$call[0],
          col = _COLS$m$call[1];
        G.text(c, m.drop ? m.fell ? "SPLASH!" : "SAFE!" : "GO TO ".concat(nm, "!"), G.W / 2, 72, 16, col);
        if (!m.drop) G.text(c, m.ct.toFixed(1), G.W / 2, G.H - 40, 16, ink);
        G.text(c, "ROUND ".concat(m.r + 1, "/10"), G.W / 2, G.H - 70, 10, ink);
      }
    },
    wake: {
      name: "DON'T WAKE BIG DAWG",
      how: "PICK TOYS. BANK BEFORE HE WAKES!",
      dur: 60,
      init: function init(G, m) {
        m.set = 0;
        this.deal(m);
      },
      deal: function deal(m) {
        m.bad = rnd(8);
        m.open = [];
        m.pot = 0;
        m.woke = 0;
        m.pause = 0;
      },
      cells: function cells(G) {
        var w = (G.W - 40) / 4,
          out = [];
        for (var i = 0; i < 8; i++) out.push({
          x: 20 + i % 4 * w + w / 2,
          y: G.H * 0.5 + Math.floor(i / 4) * (w + 6),
          r: w / 2 - 4
        });
        return out;
      },
      after: function after(G, m) {
        m.set++;
        m.pause = 1.3;
      },
      update: function update(G, m, dt) {
        if (m.pause) {
          m.pause -= dt;
          if (m.pause <= 0) {
            m.pause = 0;
            if (m.set >= 3) m.end = 1;else this.deal(m);
          }
        }
      },
      tap: function tap(G, m, x, y) {
        if (m.pause) return;
        if (y > G.H - 80 && m.pot) {
          m.pts += m.pot;
          m.banked = m.pot;
          G.sfx("win");
          this.after(G, m);
          return;
        }
        var i = this.cells(G).findIndex(function (p) {
          return Math.hypot(p.x - x, p.y - y) < p.r + 4;
        });
        if (i < 0 || m.open.includes(i)) return;
        m.open.push(i);
        if (i === m.bad) {
          m.woke = 1;
          m.pot = 0;
          m.banked = 0;
          G.sfx("lose");
          G.buzz();
          this.after(G, m);
          return;
        }
        m.pot += VALS[m.open.length - 1];
        G.sfx("pop");
        if (m.open.length === 7) {
          m.pts += m.pot;
          m.banked = m.pot;
          this.after(G, m);
        }
      },
      draw: function draw(G, c, m, ink) {
        var W = G.W,
          H = G.H;
        G.img(c, m.woke ? ":dawgsus:" : ":dawgW:", W / 2, H * 0.24, 100);
        G.emoji(c, m.woke ? "💢" : "💤", W / 2 + 56, H * 0.24 - 46 + (m.woke ? 0 : Math.sin(G.t * 3) * 4), 34);
        G.text(c, m.woke ? "HE'S AWAKE! POT LOST" : m.pause ? "BANKED ".concat(m.banked, "!") : "POT ".concat(m.pot, "  \xB7  NEXT +").concat(VALS[m.open.length] || 0), W / 2, H * 0.4, 12, m.woke ? "#e53935" : ink);
        this.cells(G).forEach(function (p, i) {
          var op = m.open.includes(i),
            bad = (m.woke || m.pause) && i === m.bad;
          c.fillStyle = bad ? "#e53935" : op ? "rgba(91,227,91,0.35)" : "rgba(0,0,0,0.18)";
          c.beginPath();
          c.arc(p.x, p.y, p.r, 0, 7);
          c.fill();
          G.emoji(c, bad ? "📣" : TOYS[i], p.x, p.y, p.r * 1.05);
          if (op && !bad) G.text(c, "✓", p.x + p.r * 0.6, p.y - p.r * 0.6, 12, "#2e7d32");
        });
        if (m.pot && !m.pause) {
          c.fillStyle = "#ffd23f";
          c.fillRect(40, H - 70, W - 80, 50);
          G.text(c, "BANK ".concat(m.pot), W / 2, H - 45, 14, "#222");
        }
        G.text(c, "SET ".concat(Math.min(3, m.set + 1), " OF 3"), W / 2, H * 0.4 + 22, 10, ink);
      }
    },
    face: {
      name: "FACE LIFT",
      how: "TAP EACH STRIP TO MATCH THE FACE!",
      dur: 25,
      init: function init(G, m) {
        m.done = 0;
        this.newFace(m);
      },
      newFace: function newFace(m) {
        m.tgt = [rnd(4), rnd(4), rnd(4)];
        m.cur = m.tgt.map(function (v) {
          return (v + 1 + rnd(3)) % 4;
        });
        m.ok = 0;
      },
      geo: function geo(G) {
        var S = Math.min(G.W - 90, G.H * 0.44);
        return {
          S: S,
          x: G.W / 2,
          y: G.H * 0.56
        };
      },
      update: function update(G, m, dt) {
        if (m.ok) {
          m.ok -= dt;
          if (m.ok <= 0) this.newFace(m);
        }
      },
      tap: function tap(G, m, x, y) {
        if (m.ok) return;
        var g = this.geo(G),
          top = g.y - g.S / 2;
        var b = BANDS.findIndex(function (_ref) {
          var _ref2 = _slicedToArray(_ref, 2),
            a = _ref2[0],
            z = _ref2[1];
          return y >= top + g.S * a - 6 && y <= top + g.S * z + 6;
        });
        if (b < 0) return;
        m.cur[b] = (m.cur[b] + 1) % 4;
        G.sfx("pop");
        if (m.cur.every(function (v, i) {
          return v === m.tgt[i];
        })) {
          m.pts += 40;
          m.done++;
          m.ok = 0.5;
          G.sfx("win");
        }
      },
      strip: function strip(G, c, code, x, y, S, a, z) {
        c.save();
        c.beginPath();
        c.rect(x - S / 2, y - S / 2 + S * a, S, S * (z - a));
        c.clip();
        G.img(c, code, x, y, S);
        c.restore();
      },
      draw: function draw(G, c, m, ink) {
        var _this = this;
        G.text(c, "MATCH THIS:", G.W / 2 - 50, 62, 10, ink);
        var sm = 80;
        c.save();
        this.strip(G, c, MOODS[m.tgt[0]], G.W / 2 + 40, 80, sm, 0, 0.2);
        BANDS.forEach(function (_ref3, i) {
          var _ref4 = _slicedToArray(_ref3, 2),
            a = _ref4[0],
            z = _ref4[1];
          return _this.strip(G, c, MOODS[m.tgt[i]], G.W / 2 + 40, 80, sm, a, z);
        });
        c.restore();
        var g = this.geo(G);
        this.strip(G, c, MOODS[m.cur[0]], g.x, g.y, g.S, 0, 0.2);
        BANDS.forEach(function (_ref5, i) {
          var _ref6 = _slicedToArray(_ref5, 2),
            a = _ref6[0],
            z = _ref6[1];
          return _this.strip(G, c, MOODS[m.cur[i]], g.x, g.y, g.S, a, z);
        });
        c.strokeStyle = "rgba(0,0,0,0.35)";
        c.lineWidth = 2;
        BANDS.slice(1).forEach(function (_ref7) {
          var _ref8 = _slicedToArray(_ref7, 1),
            a = _ref8[0];
          var yy = g.y - g.S / 2 + g.S * a;
          c.beginPath();
          c.moveTo(g.x - g.S / 2, yy);
          c.lineTo(g.x + g.S / 2, yy);
          c.stroke();
        });
        if (m.ok) G.banner(c, "MATCH!", "#5be35b", g.y);
        G.text(c, "FACES ".concat(m.done), G.W / 2, G.H - 24, 11, ink);
      }
    },
    tug: {
      name: "TUG OF WOOF",
      how: "MASH THE SCREEN! PULL HIM OVER!",
      dur: 15,
      init: function init(G, m) {
        m.p = 0;
        m.e = 0;
      },
      update: function update(G, m, dt) {
        m.e += dt;
        m.p -= (0.12 + 0.02 * m.e) * dt;
        if (m.p <= -1) {
          m.p = -1;
          m.end = 1;
          G.sfx("lose");
        }
        if (m.p >= 1) {
          m.p = 1;
          m.pts = Math.max(110, Math.round(200 - m.e * 6));
          m.end = 1;
          G.sfx("win");
        }
        m.pts = m.p >= 1 ? m.pts : Math.round((m.p + 1) * 50);
      },
      down: function down(G, m) {
        m.p += 0.035;
        m.shake = 0.08;
      },
      draw: function draw(G, c, m, ink) {
        var W = G.W,
          H = G.H,
          mid = H / 2 - m.p * H * 0.28;
        c.fillStyle = "rgba(0,0,0,0.12)";
        c.fillRect(0, H / 2 - 2, W, 4);
        c.strokeStyle = "#a1773f";
        c.lineWidth = 8;
        c.beginPath();
        c.moveTo(W / 2, mid - H * 0.25);
        c.lineTo(W / 2, mid + H * 0.25);
        c.stroke();
        c.fillStyle = "#e53935";
        c.fillRect(W / 2 - 14, mid - 5, 28, 10);
        G.emoji(c, "😼", W / 2, mid - H * 0.25 - 26, 52);
        G.img(c, ":dawgpog:", W / 2 + (m.shake > 0 ? rnd(5) - 2 : 0), mid + H * 0.25 + 30, 64);
        if (m.shake > 0) m.shake -= 0.016;
        G.text(c, "TAP TAP TAP!", W / 2, H - 30, 14, "#ffd23f");
      }
    },
    rain: {
      name: "TREAT RAIN",
      how: "DRAG TO CATCH TREATS. DODGE BOMBS!",
      dur: 25,
      init: function init(G, m) {
        m.x = G.W / 2;
        m.items = [];
        m.sp = 0;
        m.stun = 0;
        m.e = 0;
        m.pops = [];
      },
      update: function update(G, m, dt) {
        m.e += dt;
        m.sp -= dt;
        if (m.stun > 0) m.stun -= dt;
        if (m.sp <= 0) {
          m.sp = Math.max(0.22, 0.6 - m.e * 0.015);
          var r = Math.random();
          m.items.push({
            x: 24 + Math.random() * (G.W - 48),
            y: 60,
            v: 150 + m.e * 8 + Math.random() * 60,
            k: r < 0.2 ? "bomb" : r < 0.3 ? "gold" : r < 0.6 ? "meat" : "bone"
          });
        }
        var py = G.H - 70;
        m.items.forEach(function (it) {
          it.y += it.v * dt;
          if (!it.gone && Math.abs(it.y - py) < 28 && Math.abs(it.x - m.x) < 36) {
            it.gone = 1;
            if (it.k === "bomb") {
              m.pts = Math.max(0, m.pts - 15);
              m.stun = 0.8;
              G.buzz();
              G.sfx("lose");
              m.pops.push({
                x: it.x,
                y: py - 40,
                t: 0.6,
                s: "-15"
              });
            } else {
              var v = it.k === "gold" ? 25 : it.k === "meat" ? 10 : 5;
              m.pts += v;
              G.sfx("pop");
              m.pops.push({
                x: it.x,
                y: py - 40,
                t: 0.6,
                s: "+" + v
              });
            }
          }
        });
        m.items = m.items.filter(function (it) {
          return !it.gone && it.y < G.H + 30;
        });
        m.pops.forEach(function (p) {
          return p.t -= dt;
        });
        m.pops = m.pops.filter(function (p) {
          return p.t > 0;
        });
      },
      down: function down(G, m, x) {
        if (m.stun <= 0) m.x = Math.max(30, Math.min(G.W - 30, x));
      },
      move: function move(G, m, x) {
        if (m.stun <= 0) m.x = Math.max(30, Math.min(G.W - 30, x));
      },
      draw: function draw(G, c, m, ink) {
        m.items.forEach(function (it) {
          return G.emoji(c, it.k === "bomb" ? "💣" : it.k === "gold" ? "🌟" : it.k === "meat" ? "🍖" : "🦴", it.x, it.y, it.k === "bomb" ? 32 : 28);
        });
        G.img(c, m.stun > 0 ? ":dawgpain:" : ":dawgpog:", m.x, G.H - 70, 62);
        m.pops.forEach(function (p) {
          return G.text(c, p.s, p.x, p.y - (0.6 - p.t) * 40, 12, p.s[0] === "-" ? "#e53935" : "#ffd23f");
        });
      }
    }
  };
  var KEYS = Object.keys(MG);
  defGame({
    key: "party",
    name: "Dawg Party",
    icon: "🎉",
    max: 1500,
    blurb: "5 random party minigames. One total score.",
    how: "Five quick minigames, picked at random every run: Dawg Says, Floor Is Lava, Don't Wake Big Dawg, Face Lift, Tug of Woof and Treat Rain. Each one tells you what to do at the start. Your score is the total of all five.",
    reset: function reset(G) {
      var order = KEYS.slice().sort(function () {
        return Math.random() - 0.5;
      }).slice(0, 5);
      G.s = {
        order: order,
        round: 0,
        total: 0,
        results: [],
        phase: "intro",
        pt: 2.4,
        m: null
      };
    },
    mg: function mg(G) {
      return MG[G.s.order[G.s.round]];
    },
    start: function start(G) {
      var s = G.s,
        g = this.mg(G);
      s.m = {
        pts: 0,
        t: 0,
        end: 0
      };
      g.init(G, s.m);
      s.phase = "play";
    },
    update: function update(G, dt) {
      var s = G.s;
      if (s.phase === "intro") {
        s.pt -= dt;
        if (s.pt <= 0) this.start(G);
        return;
      }
      if (s.phase === "result") {
        s.pt -= dt;
        if (s.pt <= 0) this.advance(G);
        return;
      }
      var g = this.mg(G),
        m = s.m;
      m.t += dt;
      if (m.flash) {
        m.flash.t -= dt;
        if (m.flash.t <= 0) m.flash = null;
      }
      g.update(G, m, dt);
      if (m.t >= g.dur) m.end = 1;
      if (m.end) {
        var p = Math.max(0, Math.min(300, Math.round(m.pts)));
        s.total += p;
        s.results.push([g.name, p]);
        s.phase = "result";
        s.pt = 2.6;
        G.sfx(p >= 100 ? "win" : "pop");
      }
    },
    advance: function advance(G) {
      var s = G.s;
      s.round++;
      if (s.round >= s.order.length) {
        G.over(Math.min(1500, s.total), s.total >= 700 ? "Party animal! 🎉" : s.total >= 450 ? "Good party." : "Party pooper.");
        return;
      }
      s.phase = "intro";
      s.pt = 2.4;
    },
    route: function route(G, fn) {
      var s = G.s;
      if (s.phase === "intro") {
        if (fn === "tap") this.start(G);
        return;
      }
      if (s.phase === "result") {
        if (fn === "tap" && s.pt < 1.8) this.advance(G);
        return;
      }
      var g = this.mg(G);
      for (var _len = arguments.length, a = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        a[_key - 2] = arguments[_key];
      }
      if (g[fn]) g[fn].apply(g, [G, s.m].concat(a));
    },
    tap: function tap(G, x, y) {
      this.route(G, "tap", x, y);
    },
    swipe: function swipe(G, dx, dy) {
      this.route(G, "swipe", dx, dy);
    },
    down: function down(G, x, y) {
      this.route(G, "down", x, y);
    },
    move: function move(G, x, y) {
      this.route(G, "move", x, y);
    },
    onKey: function onKey(G, k, isDown) {
      if (!isDown) return;
      var d = {
        ArrowUp: [0, -1],
        ArrowDown: [0, 1],
        ArrowLeft: [-1, 0],
        ArrowRight: [1, 0]
      }[k];
      if (d) this.swipe(G, d[0], d[1]);else if (k === " ") this.down(G, G.W / 2, G.H / 2);
    },
    draw: function draw(G, c) {
      var s = G.s,
        W = G.W,
        H = G.H,
        dark = G.dark(),
        ink = dark ? "#fff" : "#222";
      var g = c.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, dark ? "#2a1640" : "#ffe4f2");
      g.addColorStop(1, dark ? "#141a3a" : "#dff1ff");
      c.fillStyle = g;
      c.fillRect(0, 0, W, H);
      for (var i = 0; i < 14; i++) {
        c.fillStyle = ["#ff5c8a", "#ffd23f", "#4dd0e1", "#7cff6b"][i % 4];
        c.globalAlpha = 0.25;
        c.fillRect((i * 67 + G.t * 20) % W, (i * 113 + G.t * 35) % H, 6, 10);
      }
      c.globalAlpha = 1;
      var g2 = s.order && this.mg(G);
      if (!g2) return;
      G.hud(c, "ROUND ".concat(Math.min(5, s.round + 1), "/5"), "", "TOTAL ".concat(s.total));
      if (s.phase === "intro") {
        G.img(c, ":dawgpog:", W / 2, H * 0.3, 96);
        G.banner(c, g2.name, "#ff5c8a", H * 0.5, Math.min(26, W / (g2.name.length * 0.85)));
        G.text(c, g2.how, W / 2, H * 0.6, Math.min(12, W / (g2.how.length * 0.9)), ink);
        G.text(c, "TAP TO START", W / 2, H * 0.75, 11, Math.floor(G.t * 3) % 2 ? "#ffd23f" : ink);
        return;
      }
      if (s.phase === "result") {
        var last = s.results[s.results.length - 1];
        G.banner(c, "+".concat(last[1]), "#ffd23f", H * 0.28);
        s.results.forEach(function (_ref9, i) {
          var _ref0 = _slicedToArray(_ref9, 2),
            n = _ref0[0],
            p = _ref0[1];
          G.text(c, n, 40, H * 0.42 + i * 26, 10, ink, "left");
          G.text(c, String(p), W - 40, H * 0.42 + i * 26, 11, "#ffd23f", "right");
        });
        G.text(c, "TOTAL ".concat(s.total), W / 2, H * 0.42 + 5 * 26 + 10, 13, "#ff5c8a");
        return;
      }
      var m = s.m;
      g2.draw(G, c, m, ink);
      G.text(c, "".concat(Math.round(m.pts), " PTS"), 12, 50, 11, "#ff5c8a", "left");
      G.text(c, "".concat(Math.max(0, Math.ceil(g2.dur - m.t)), "s"), W - 12, 50, 11, ink, "right");
    }
  });
})();