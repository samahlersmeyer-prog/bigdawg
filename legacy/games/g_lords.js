function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
(function () {
  var PERKS = [{
    k: "rate",
    n: "BIG CANNON",
    e: "⚡",
    max: 10,
    c: function c(l) {
      return Math.round(30 * Math.pow(1.45, l));
    },
    d: "+8% fire rate"
  }, {
    k: "lucky",
    n: "LUCKY SHOTS",
    e: "🍀",
    max: 10,
    c: function c(l) {
      return Math.round(30 * Math.pow(1.45, l));
    },
    d: "6% shots are x3"
  }, {
    k: "slow",
    n: "MUDDY ROAD",
    e: "🟫",
    max: 5,
    c: function c(l) {
      return Math.round(60 * Math.pow(1.7, l));
    },
    d: "Horde marches 5% slower"
  }, {
    k: "side",
    n: "ARMORY",
    e: "🏰",
    max: 5,
    c: function c(l) {
      return Math.round(50 * Math.pow(1.6, l));
    },
    d: "Start with +2 cannons"
  }, {
    k: "treas",
    n: "TREASURY",
    e: "🪙",
    max: 10,
    c: function c(l) {
      return Math.round(35 * Math.pow(1.4, l));
    },
    d: "+10% coins"
  }];
  var BOSSES = [{
    n: "FAT CAT",
    e: "😾"
  }, {
    n: "TOMCAT KING",
    e: "🦁"
  }, {
    n: "TIGER LORD",
    e: "🐯"
  }, {
    n: "THE BIG MEOW",
    e: "🙀"
  }];
  var T = {
    march: 9,
    marchT: 0.025,
    unit: 10,
    unitG: 48,
    fire: 2.5,
    boss1: 40,
    bossEvery: 55,
    bossHp: 2500,
    gate: 99,
    belt: 34,
    gap: 30,
    c0: 2,
    k: [6, 4],
    hp0: [5, 888],
    hpg: [3.5, 3.5]
  };
  var SP = 7.2;
  var fmtN = function fmtN(n) {
    return n >= 1e9 ? (n / 1e9).toFixed(1) + "B" : n >= 1e6 ? (n / 1e6).toFixed(1) + "M" : n >= 1e4 ? Math.round(n / 1e3) + "K" : String(Math.max(0, Math.round(n)));
  };
  var fmtT = function fmtT(t) {
    return "".concat(Math.floor(t / 60), ":").concat(String(Math.floor(t % 60)).padStart(2, "0"));
  };
  var mkey = function mkey() {
    return "bdd:lords3:" + (typeof me !== "undefined" && me ? me.id : "");
  };
  var today = function today() {
    return new Date().toDateString();
  };
  var loadMeta = function loadMeta() {
    return Object.assign({
      coins: 0,
      bestT: 0,
      runs: 0,
      lastDay: ""
    }, store.get(mkey()) || {});
  };
  var saveMeta = function saveMeta(m) {
    return store.set(mkey(), m);
  };
  var rr = function rr(c, x, y, w, h, r) {
    c.beginPath();
    if (c.roundRect) c.roundRect(x, y, w, h, r);else c.rect(x, y, w, h);
  };
  var inR = function inR(r, x, y) {
    return r && x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h;
  };
  defGame({
    key: "dlords",
    name: "Dawg Lords",
    icon: "👑",
    max: 99999,
    T: T,
    blurb: "Hold back an endless cat horde. x99 gate. Bosses.",
    how: "An endless cat horde marches down the road and keeps getting bigger. Drag to move your cannon; each cannon fires one pup at a time. The middle of the road is one big x99 gate: every pup through it becomes 99, and every pup that hits the horde knocks out a cat and pushes them back. Each side lane is a conveyor held back by a barrier, and the barrier's number is how many pups it takes to break. Break it and the tiles behind it (+1s on the left, +99s on the right) keep rolling down to you until the next barrier rolls in. Slide under them to catch them: each one adds that many cannons. Missed tiles are gone. The next barrier is tougher, but the tiles behind it are worth more. The catch: time spent on the sides is time not feeding the x99. Every so often a boss marches in with the horde; knock it out and catch its gold drop for extra cannons. If the horde reaches your cannon it's over. Score is 10 points a second plus 250 per boss; coins buy permanent upgrades at camp, and the first battle each day pays double.",
    reset: function reset(G) {
      var W = G.W,
        H = G.H;
      G.s = {
        mode: "camp",
        meta: loadMeta(),
        W: W,
        H: H,
        gy: Math.round(H * 0.5),
        cy: H - 64,
        ax0: W * 0.22,
        ax1: W * 0.78,
        cols: [{
          x0: W * 0.035,
          x1: W * 0.2
        }, {
          x0: W * 0.8,
          x1: W * 0.965
        }],
        t: 0,
        score: 0,
        kills: 0,
        cx: W / 2,
        tx: W / 2,
        cd: 0,
        pups: [],
        fx: [],
        drops: [],
        more: 0,
        start: 0,
        lanes: [],
        front: 60,
        boss: null,
        bossN: 0,
        nextBoss: T.boss1,
        gateOn: true,
        gflash: 0,
        msg: null,
        sfxT: 0,
        recoil: 0
      };
    },
    begin: function begin(G) {
      var s = G.s;
      s.mode = "play";
      s.daily = s.meta.lastDay !== today();
      G.t = 0;
      s.start = 2 * (s.meta.side || 0);
      s.more = 0;
      this.fillBelts(s);
      s.msg = {
        txt: s.daily ? "DAILY 2X COINS!" : "HOLD THE ROAD!",
        t: 2
      };
    },
    per: function per(s) {
      return Math.max(1, Math.floor((s.ax1 - s.ax0) / SP));
    },
    unit: function unit(s) {
      return Math.max(1, Math.round(T.unit * Math.exp(s.t / T.unitG)));
    },
    march: function march(s) {
      return (T.march + T.marchT * s.t) * Math.pow(0.95, s.meta.slow || 0) * (s.boss ? 1.25 : 1);
    },
    onScreen: function onScreen(s) {
      return Math.max(0, Math.round((s.front - 36) / SP + 1)) * this.per(s) * this.unit(s);
    },
    tileV: function tileV(i, lvl) {
      return i ? 99 * (lvl + 1) : lvl + 1;
    },
    nextItem: function nextItem(s, i) {
      var q = s.lanes[i].q;
      if (q.n === 0) {
        q.n = 1;
        var hp = Math.round(T.hp0[i] * Math.pow(T.hpg[i], q.lvl));
        return {
          b: 1,
          hp: hp,
          hp0: hp,
          lvl: q.lvl
        };
      }
      var it = {
        v: this.tileV(i, q.lvl)
      };
      if (q.n++ >= T.k[i]) {
        q.lvl++;
        q.n = 0;
      }
      return it;
    },
    blockY: function blockY(s) {
      return s.gy;
    },
    cannons: function cannons(s) {
      return T.c0 + (s.start || 0) + s.more;
    },
    fillBelts: function fillBelts(s, lv) {
      s.lanes = [0, 1].map(function (i) {
        return {
          items: [],
          q: {
            lvl: lv ? lv[i] : 0,
            n: 0
          },
          flash: 0
        };
      });
      for (var i = 0; i < 2; i++) for (var y = this.blockY(s); y >= 40; y -= T.gap) s.lanes[i].items.push(Object.assign(this.nextItem(s, i), {
        y: y
      }));
    },
    save: function save(G) {
      var s = G.s;
      if (s.mode !== "play" || s.t < 5) return null;
      return {
        label: "\u23F1 ".concat(fmtT(s.t)),
        t: s.t,
        kills: s.kills,
        daily: s.daily,
        more: s.more,
        start: s.start,
        lv: s.lanes.map(function (L) {
          return (L.items.find(function (x) {
            return x.b;
          }) || {
            lvl: L.q.lvl
          }).lvl;
        }),
        bossN: s.bossN,
        nextBoss: s.nextBoss
      };
    },
    load: function load(G, v) {
      if (v.more == null || v.t == null) throw new Error("old save");
      var s = G.s;
      s.mode = "play";
      ["t", "kills", "daily", "start", "bossN", "nextBoss", "more"].forEach(function (k) {
        return s[k] = v[k];
      });
      this.fillBelts(s, v.lv);
      s.front = 60;
      s.msg = {
        txt: "BACK TO THE ROAD!",
        t: 1.5
      };
    },
    add: function add(s, x, y, w, vx) {
      if (w <= 0) return;
      if (s.pups.length > 700) {
        s.pups[s.pups.length - 1].w += w;
        return;
      }
      s.pups.push({
        x: x,
        y: y,
        w: w,
        vx: vx || 0,
        vy: -230
      });
    },
    hitHorde: function hitHorde(s, w) {
      s.kills += w;
      s.front = Math.max(60, s.front - w / (this.per(s) * this.unit(s)) * SP);
    },
    catchAt: function catchAt(s, x, half) {
      return Math.abs(s.cx - x) < half;
    },
    gain: function gain(G, v, col, txt) {
      var s = G.s;
      s.recoil = 0.6;
      s.fx.push({
        txt: txt || "+".concat(fmtN(v), " \uD83D\uDD2B"),
        x: Math.max(70, Math.min(s.W - 70, s.cx)),
        y: s.cy - 44,
        t: 1,
        col: col
      });
      if (s.sfxT <= 0) {
        s.sfxT = 0.07;
        G.sfx("pop");
      }
    },
    update: function update(G, dt) {
      var _this = this;
      var s = G.s;
      if (s.mode !== "play") return;
      if (s.msg) {
        s.msg.t -= dt;
        if (s.msg.t <= 0) s.msg = null;
      }
      var W = s.W,
        m = s.meta;
      s.t += dt;
      s.score = Math.floor(s.t * 10) + 250 * s.bossN;
      s.sfxT -= dt;
      s.recoil = Math.max(0, s.recoil - dt * 6);
      s.gflash = Math.max(0, s.gflash - dt);
      var dx = s.tx - s.cx;
      s.cx += Math.sign(dx) * Math.min(Math.abs(dx), 520 * dt);
      s.cd -= dt;
      if (s.cd <= 0) {
        s.cd = 1 / (T.fire * (1 + 0.08 * (m.rate || 0)));
        var C = this.cannons(s),
          k = Math.min(6, C);
        var w = C * (Math.random() < 0.06 * (m.lucky || 0) ? 3 : 1) / k,
          sp = Math.min(12, 64 / k);
        for (var i = 0; i < k; i++) this.add(s, s.cx + (i - (k - 1) / 2) * sp, s.cy - 26, w, (Math.random() - 0.5) * 18);
        s.recoil = 1;
      }
      for (var _i = 0; _i < 2; _i++) {
        var L = s.lanes[_i],
          It = L.items,
          c = s.cols[_i],
          cxm = (c.x0 + c.x1) / 2,
          by = this.blockY(s);
        L.flash = Math.max(0, L.flash - dt);
        for (var j = 0; j < It.length; j++) {
          var y = It[j].y + T.belt * dt;
          if (j) y = Math.min(y, It[j - 1].y - T.gap);
          if (It[j].b) y = Math.min(y, by);
          It[j].y = y;
        }
        var top = It[It.length - 1];
        if (!top || top.y >= 40 + T.gap) It.push(Object.assign(this.nextItem(s, _i), {
          y: top ? top.y - T.gap : 40
        }));
        while (It.length && !It[0].b && It[0].y >= s.cy - 24) {
          var t = It.shift();
          if (this.catchAt(s, cxm, (c.x1 - c.x0) / 2 + 16)) {
            s.more += t.v;
            this.gain(G, t.v, _i ? "#ffd23f" : "#82b1ff");
          } else s.fx.push({
            txt: "MISSED",
            x: cxm,
            y: s.cy - 10,
            t: 0.6,
            col: "#ff8a80"
          });
        }
      }
      s.drops.forEach(function (d) {
        d.y += 95 * dt;
        if (d.y >= s.cy - 24) {
          d.done = true;
          if (_this.catchAt(s, d.x, 38)) {
            s.more += d.v;
            _this.gain(G, d.v, "#ffd23f");
            s.msg = {
              txt: "+".concat(d.v, " CANNONS!"),
              t: 1.2
            };
            G.sfx("win");
          } else s.fx.push({
            txt: "MISSED",
            x: d.x,
            y: s.cy - 10,
            t: 0.7,
            col: "#ff8a80"
          });
        }
      });
      s.drops = s.drops.filter(function (d) {
        return !d.done;
      });
      s.front += this.march(s) * dt;
      if (!s.boss && s.t >= s.nextBoss) {
        var B = BOSSES[s.bossN % 4],
          hp = Math.round(T.bossHp * Math.exp(s.t / T.unitG));
        s.boss = {
          n: B.n,
          e: B.e,
          x: s.ax0 + 34 + Math.random() * (s.ax1 - s.ax0 - 68),
          r: 28,
          hp: hp,
          max: hp,
          flash: 0
        };
        s.msg = {
          txt: "BOSS: ".concat(B.n, "!"),
          t: 2
        };
        G.sfx("lose");
        G.buzz();
      }
      if (s.boss) s.boss.flash = Math.max(0, s.boss.flash - dt);
      var gOn = s.front < s.gy - 13;
      if (gOn !== s.gateOn) {
        s.gateOn = gOn;
        if (!gOn) {
          s.fx.push({
            txt: "GATE OVERRUN!",
            x: W / 2,
            y: s.gy + 24,
            t: 1,
            col: "#ff8a80"
          });
          G.buzz();
        }
      }
      var _iterator = _createForOfIteratorHelper(s.pups),
        _step;
      try {
        var _loop = function _loop() {
            var p = _step.value;
            var py = p.y;
            p.x += p.vx * dt;
            p.y += p.vy * dt;
            if (s.gateOn && py > s.gy && p.y <= s.gy && p.x >= s.ax0 && p.x <= s.ax1) {
              var full = s.pups.length > 600,
                tot = p.w * T.gate,
                _k = full ? 1 : 4;
              p.w = tot / _k;
              for (var _i2 = 1; _i2 < _k; _i2++) s.pups.push({
                x: p.x + (Math.random() - 0.5) * 24,
                y: p.y - Math.random() * 10,
                w: p.w,
                vx: (Math.random() - 0.5) * 50,
                vy: -230
              });
              s.gflash = 0.1;
            }
            for (var _i3 = 0; _i3 < 2; _i3++) {
              var _c = s.cols[_i3],
                _L = s.lanes[_i3];
              if (p.x < _c.x0 || p.x > _c.x1) continue;
              var _b = _L.items.find(function (x) {
                return x.b && p.y <= x.y + 18 && py > x.y - 18;
              });
              if (!_b) continue;
              p.dead = true;
              _b.hp -= p.w;
              _L.flash = 0.06;
              if (_b.hp <= 0) {
                _L.items.splice(_L.items.indexOf(_b), 1);
                s.fx.push({
                  txt: "BROKE FREE!",
                  x: (_c.x0 + _c.x1) / 2,
                  y: _b.y - 26,
                  t: 0.9,
                  col: "#80ff9c"
                });
                G.sfx("win");
              }
            }
            if (p.dead) return 0;
            var b = s.boss;
            if (b && p.y <= s.front + 8 && Math.abs(p.x - b.x) < b.r) {
              var _k2 = Math.min(b.hp, p.w);
              b.hp -= _k2;
              p.w -= _k2;
              b.flash = 0.06;
              s.kills += _k2;
              if (b.hp <= 0) {
                var v = 2 + s.bossN;
                s.bossN++;
                s.boss = null;
                s.nextBoss = s.t + T.bossEvery;
                s.drops.push({
                  x: Math.max(s.cx - 60, Math.min(s.cx + 60, b.x)),
                  y: s.front,
                  v: v
                });
                s.msg = {
                  txt: "BOSS DOWN! CATCH THE GOLD!",
                  t: 1.8
                };
                G.sfx("win");
              }
              if (p.w <= 0.0001) {
                p.dead = true;
                return 0;
              }
            }
            if (p.y <= s.front + 3 && p.x >= s.ax0 - 4 && p.x <= s.ax1 + 4) {
              _this.hitHorde(s, p.w);
              p.dead = true;
              if (s.sfxT <= 0) {
                s.sfxT = 0.07;
                G.sfx("pop");
              }
              if (s.fx.length < 60 && Math.random() < 0.25) s.fx.push({
                pop: 1,
                x: p.x,
                y: s.front,
                t: 0.2
              });
            }
            if (p.y < 30 || p.x < -10 || p.x > W + 10) p.dead = true;
          },
          _ret;
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          _ret = _loop();
          if (_ret === 0) continue;
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
      s.pups = s.pups.filter(function (p) {
        return !p.dead;
      });
      s.fx.forEach(function (e) {
        return e.t -= dt;
      });
      s.fx = s.fx.filter(function (e) {
        return e.t > 0;
      });
      if (s.front >= s.cy - 36) this.end(G);
    },
    end: function end(G) {
      var s = G.s,
        m = s.meta,
        score = Math.round(s.score),
        nb = s.t > (m.bestT || 0);
      var coins = Math.round((s.t / 3 + s.bossN * 6) * (1 + 0.1 * (m.treas || 0)) * (s.daily ? 2 : 1));
      m.coins += coins;
      m.runs = (m.runs || 0) + 1;
      m.bestT = Math.max(m.bestT || 0, s.t);
      if (s.daily) m.lastDay = today();
      saveMeta(m);
      G.over(score, "".concat(nb ? "NEW BEST! " : "", "Held ").concat(fmtT(s.t), ", ").concat(s.bossN, " boss").concat(s.bossN === 1 ? "" : "es", ", ").concat(fmtN(s.kills), " cats. +").concat(coins, " \uD83E\uDE99"));
    },
    campLayout: function campLayout(G) {
      var W = G.W,
        H = G.H,
        top = 132,
        btnH = 56,
        rh = Math.min(56, Math.max(40, (H - top - btnH - 30) / PERKS.length));
      return {
        rows: PERKS.map(function (p, i) {
          return {
            x: 12,
            y: top + i * rh,
            w: W - 24,
            h: rh - 6
          };
        }),
        go: {
          x: 24,
          y: Math.min(H - btnH - 14, top + PERKS.length * rh + 10),
          w: W - 48,
          h: btnH
        }
      };
    },
    down: function down(G, x) {
      var s = G.s;
      if (s.mode === "play") s.tx = Math.max(s.W * 0.1, Math.min(s.W * 0.9, x));
    },
    move: function move(G, x) {
      this.down(G, x);
    },
    tap: function tap(G, x, y) {
      var s = G.s;
      if (s.mode !== "camp") return;
      var L = this.campLayout(G);
      if (inR(L.go, x, y)) {
        this.begin(G);
        G.sfx("win");
        return;
      }
      L.rows.forEach(function (r, i) {
        if (!inR(r, x, y)) return;
        var p = PERKS[i],
          l = s.meta[p.k] || 0;
        if (l >= p.max) return;
        var c = p.c(l);
        if (s.meta.coins < c) {
          s.campMsg = {
            txt: "NEED ".concat(c, " \uD83E\uDE99"),
            t: 1
          };
          G.buzz();
          return;
        }
        s.meta.coins -= c;
        s.meta[p.k] = l + 1;
        saveMeta(s.meta);
        s.campMsg = {
          txt: "".concat(p.n, " ").concat(l + 1, "!"),
          t: 1
        };
        G.sfx("win");
      });
    },
    draw: function draw(G, c) {
      var _this2 = this;
      var s = G.s,
        W = G.W,
        H = G.H,
        dk = G.dark();
      if (s.mode === "camp") return this.drawCamp(G, c);
      c.fillStyle = dk ? "#1d2229" : "#eef3f8";
      c.fillRect(0, 0, W, H);
      c.fillStyle = dk ? "#2a3039" : "#d5dae1";
      c.fillRect(s.ax0 - 8, 0, s.ax1 - s.ax0 + 16, H);
      c.fillStyle = dk ? "#323944" : "#e3e7ec";
      c.fillRect(s.cols[0].x1 + 3, s.gy + 30, s.cols[1].x0 - s.cols[0].x1 - 6, H);
      s.cols.forEach(function (cl) {
        c.fillStyle = dk ? "#3b434f" : "#c3c9d2";
        c.fillRect(cl.x0 - 3, 0, cl.x1 - cl.x0 + 6, H);
        c.fillStyle = dk ? "#4a5361" : "#f7f9fb";
        c.fillRect(cl.x0 - 3, 0, 3, H);
        c.fillRect(cl.x1, 0, 3, H);
        c.fillStyle = dk ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.06)";
        for (var y = G.t * 40 % 24 - 24; y < H; y += 24) c.fillRect(cl.x0 + 2, y, cl.x1 - cl.x0 - 4, 2);
      });
      s.cols.forEach(function (cl, i) {
        return s.lanes[i].items.forEach(function (t) {
          var w = cl.x1 - cl.x0 - 4,
            x = cl.x0 + 2;
          if (t.b) {
            var bx = cl.x0 - 1,
              _bw = cl.x1 - cl.x0 + 2,
              h = 32,
              by = t.y;
            c.fillStyle = "#5d3a1a";
            rr(c, bx, by - h / 2 + 3, _bw, h, 4);
            c.fill();
            c.fillStyle = s.lanes[i].flash && t.y >= _this2.blockY(s) - 1 ? "#d7a86e" : "#a0682f";
            rr(c, bx, by - h / 2, _bw, h, 4);
            c.fill();
            c.fillStyle = "#7a4a1f";
            c.fillRect(bx + 3, by - 6, _bw - 6, 2);
            c.fillRect(bx + 3, by + 5, _bw - 6, 2);
            c.fillStyle = "#4e342e";
            [bx + 5, bx + _bw - 5].forEach(function (px) {
              c.beginPath();
              c.arc(px, by - 10, 2, 0, 7);
              c.arc(px, by + 10, 2, 0, 7);
              c.fill();
            });
            G.text(c, fmtN(Math.ceil(t.hp)), bx + _bw / 2, by + 1, Math.min(13, _bw / 4), "#fff");
            return;
          }
          c.fillStyle = i ? "#c99a00" : "#1e5fc2";
          rr(c, x, t.y - 11, w, 24, 4);
          c.fill();
          c.fillStyle = i ? "#ffd23f" : "#2f80ed";
          rr(c, x, t.y - 13, w, 22, 4);
          c.fill();
          G.text(c, "+" + fmtN(t.v), x + w / 2, t.y - 1, Math.min(10, w / 5), i ? "#3a2c00" : "#fff");
        });
      });
      {
        var x = s.ax0,
          w = s.ax1 - s.ax0,
          y = s.gy - 13,
          on = s.gateOn;
        c.globalAlpha = on ? 1 : 0.35;
        c.fillStyle = "#5e1fa8";
        rr(c, x, y + 3, w, 26, 4);
        c.fill();
        c.fillStyle = s.gflash ? "#c79bff" : "#8e3fe6";
        rr(c, x, y, w, 26, 4);
        c.fill();
        c.fillStyle = "#e0a96d";
        c.fillRect(x - 3, y - 2, 4, 30);
        c.fillRect(x + w - 1, y - 2, 4, 30);
        G.text(c, "x" + T.gate, x + w / 2, y + 14, 15, "#fff");
        c.globalAlpha = 1;
      }
      var per = this.per(s),
        rows = Math.max(0, Math.ceil((s.front - 30) / SP) + 1),
        bob = Math.sin(G.t * 9) * 0.8;
      var body = new Path2DShim(c),
        head = new Path2DShim(c),
        x0 = (s.ax0 + s.ax1) / 2 - (per - 1) * SP / 2;
      for (var r = 0; r < rows; r++) {
        var _y = s.front - r * SP;
        for (var k = 0; k < per; k++) {
          var jx = ((k * 7 + r * 13) % 5 - 2) * 0.5,
            _x = x0 + k * SP + jx,
            yy = _y + ((k + r) % 2 ? bob : -bob);
          body.dot(_x, yy, 3.3);
          head.dot(_x - 0.8, yy - 2, 1.5);
        }
      }
      c.fillStyle = "#c62828";
      body.fill();
      c.fillStyle = "#ff6f60";
      head.fill();
      if (s.boss) {
        var b = s.boss,
          by = s.front - 4;
        c.fillStyle = "rgba(0,0,0,0.25)";
        c.beginPath();
        c.ellipse(b.x, by + 22, 30, 8, 0, 0, 7);
        c.fill();
        c.fillStyle = b.flash ? "#ffffff" : "#8e0000";
        c.beginPath();
        c.arc(b.x, by, b.r, 0, 7);
        c.fill();
        G.emoji(c, b.e, b.x, by + 1, 44);
        G.emoji(c, "👑", b.x, by - b.r - 6, 20);
        c.fillStyle = "rgba(0,0,0,0.6)";
        c.fillRect(b.x - 34, by + b.r + 4, 68, 7);
        c.fillStyle = "#ffd23f";
        c.fillRect(b.x - 33, by + b.r + 5, 66 * Math.max(0, b.hp / b.max), 5);
      }
      c.fillStyle = "rgba(0,0,0,0.55)";
      rr(c, W / 2 - 56, 42, 112, 22, 11);
      c.fill();
      G.text(c, "🐱" + fmtN(this.onScreen(s)), W / 2, 53, 10, "#fff");
      s.drops.forEach(function (d) {
        c.fillStyle = "#c99a00";
        rr(c, d.x - 26, d.y - 11, 52, 26, 6);
        c.fill();
        c.fillStyle = "#ffd23f";
        rr(c, d.x - 26, d.y - 13, 52, 24, 6);
        c.fill();
        G.text(c, "+".concat(d.v), d.x, d.y - 1, 11, "#3a2c00");
      });
      var pb = new Path2DShim(c),
        ph = new Path2DShim(c);
      s.pups.forEach(function (p) {
        var r = Math.min(8, 3.8 + Math.log10(Math.max(1, p.w)) * 1.2);
        pb.dot(p.x, p.y, r);
        ph.dot(p.x - r * 0.25, p.y - r * 0.5, r * 0.45);
      });
      c.fillStyle = "#1565c0";
      pb.fill();
      c.fillStyle = "#64b5f6";
      ph.fill();
      s.fx.forEach(function (e) {
        if (e.pop) {
          c.strokeStyle = "rgba(255,255,255,".concat(e.t * 4, ")");
          c.lineWidth = 2;
          c.beginPath();
          c.arc(e.x, e.y, 10 * (1.2 - e.t * 4), 0, 7);
          c.stroke();
        } else G.text(c, e.txt, e.x, e.y - (0.7 - e.t) * 30, 10, e.col);
      });
      var C = this.cannons(s),
        cx = s.cx,
        cy = s.cy,
        rc = s.recoil * 4,
        n = Math.min(6, C),
        bsp = Math.min(14, 64 / n),
        bw = Math.min(14, bsp + 1);
      c.fillStyle = "rgba(0,0,0,0.18)";
      c.beginPath();
      c.ellipse(cx, cy + 18, 30, 7, 0, 0, 7);
      c.fill();
      c.fillStyle = "#8d5a3b";
      rr(c, cx - 22, cy + 2, 44, 14, 4);
      c.fill();
      [-15, 15].forEach(function (o) {
        c.fillStyle = "#3e2723";
        c.beginPath();
        c.arc(cx + o, cy + 15, 6, 0, 7);
        c.fill();
      });
      for (var i = 0; i < n; i++) {
        var bx = cx + (i - (n - 1) / 2) * bsp;
        c.fillStyle = "#78909c";
        rr(c, bx - bw / 2, cy - 28 + rc, bw, 34, 5);
        c.fill();
        c.fillStyle = "#b0bec5";
        rr(c, bx - bw / 4, cy - 26 + rc, bw / 4, 28, 2);
        c.fill();
        c.fillStyle = "#37474f";
        rr(c, bx - bw / 2 - 1, cy - 30 + rc, bw + 2, 6, 3);
        c.fill();
      }
      var lx = Math.max(54, Math.min(W - 54, cx));
      c.fillStyle = "rgba(0,0,0,0.55)";
      rr(c, lx - 50, cy + 24, 100, 18, 9);
      c.fill();
      G.text(c, "\uD83D\uDD2B x".concat(fmtN(C)), lx, cy + 33, 9, "#fff");
      G.img(c, ":dawgW:", cx, cy + 4, 22);
      G.hud(c, "\u23F1".concat(fmtT(s.t)), fmtN(s.score), "BEST ".concat(fmtT(s.meta.bestT || 0)));
      var dng = Math.min(1, Math.max(0, (s.front - 60) / (s.cy - 96)));
      c.fillStyle = "rgba(0,0,0,0.35)";
      c.fillRect(0, 34, W, 5);
      c.fillStyle = dng > 0.6 ? "#e53935" : "#ffb300";
      c.fillRect(0, 34, W * dng, 5);
      if (dng > 0.7) {
        c.fillStyle = "rgba(229,57,53,".concat(0.1 + 0.07 * Math.sin(G.t * 8), ")");
        c.fillRect(0, 0, W, H);
      }
      if (s.msg) G.banner(c, s.msg.txt, "#fff", H * 0.62, s.msg.txt.length > 14 ? 13 : 18);
      G.hint(c, "BREAK THE SIDE BARRIERS, CATCH THE TILES", 5, s.cy - 60);
    },
    drawCamp: function drawCamp(G, c) {
      var s = G.s,
        W = G.W,
        H = G.H,
        m = s.meta,
        L = this.campLayout(G),
        dk = G.dark();
      var gr = c.createLinearGradient(0, 0, 0, H);
      gr.addColorStop(0, dk ? "#1a1430" : "#3b2a6b");
      gr.addColorStop(1, dk ? "#0d0a18" : "#1c1338");
      c.fillStyle = gr;
      c.fillRect(0, 0, W, H);
      G.img(c, ":dawgW:", 40, 46, 50);
      G.emoji(c, "👑", 40, 16, 22);
      G.text(c, "DAWG LORDS", 76, 32, 15, "#ffd23f", "left");
      G.text(c, "BEST: HELD ".concat(fmtT(m.bestT || 0)), 76, 54, 8, "#fff", "left");
      G.text(c, "RUNS: ".concat(m.runs || 0), 76, 70, 8, "rgba(255,255,255,0.6)", "left");
      c.fillStyle = "rgba(255,210,63,0.15)";
      rr(c, 12, 86, W - 24, 34, 10);
      c.fill();
      G.text(c, "\uD83E\uDE99 ".concat(m.coins), 24, 104, 13, "#ffd23f", "left");
      var dbl = m.lastDay !== today();
      G.text(c, dbl ? "🎁 2X TODAY" : "CAMP UPGRADES", W - 24, 104, 8, dbl ? "#80ff9c" : "rgba(255,255,255,0.6)", "right");
      PERKS.forEach(function (p, i) {
        var r = L.rows[i],
          l = m[p.k] || 0,
          maxed = l >= p.max,
          cost = maxed ? 0 : p.c(l),
          ok = !maxed && m.coins >= cost;
        c.fillStyle = ok ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.05)";
        rr(c, r.x, r.y, r.w, r.h, 10);
        c.fill();
        if (ok) {
          c.strokeStyle = "rgba(255,210,63,0.6)";
          c.lineWidth = 1.5;
          rr(c, r.x, r.y, r.w, r.h, 10);
          c.stroke();
        }
        G.emoji(c, p.e, r.x + 22, r.y + r.h / 2, Math.min(22, r.h * 0.5));
        G.text(c, p.n, r.x + 44, r.y + r.h * 0.34, 9, "#fff", "left");
        G.text(c, "".concat(p.d, " \xB7 ").concat(l, "/").concat(p.max), r.x + 44, r.y + r.h * 0.7, 7, "rgba(255,255,255,0.65)", "left");
        G.text(c, maxed ? "MAX" : "".concat(cost, "\uD83E\uDE99"), r.x + r.w - 10, r.y + r.h / 2, 9, maxed ? "#80ff9c" : ok ? "#ffd23f" : "#ff8a80", "right");
      });
      var g = L.go;
      c.fillStyle = "#c62828";
      rr(c, g.x, g.y + 4, g.w, g.h, 16);
      c.fill();
      c.fillStyle = "#ef5350";
      rr(c, g.x, g.y, g.w, g.h, 16);
      c.fill();
      G.text(c, "💥 FIRE THE CANNON!", W / 2, g.y + g.h / 2 + 1, 12, "#fff");
      if (s.campMsg) {
        s.campMsg.t -= 1 / 60;
        if (s.campMsg.t <= 0) s.campMsg = null;else G.banner(c, s.campMsg.txt, "#ffd23f", g.y - 18, 14);
      }
      if (!m.runs) G.hint(c, "COINS BUY UPGRADES. NOW FIRE!", 6, g.y - 18);
    }
  });
  function Path2DShim(c) {
    this.c = c;
    this.p = typeof Path2D !== "undefined" ? new Path2D() : null;
  }
  Path2DShim.prototype.dot = function (x, y, r) {
    if (this.p) {
      this.p.moveTo(x + r, y);
      this.p.arc(x, y, r, 0, 6.283);
    }
  };
  Path2DShim.prototype.fill = function () {
    if (this.p) this.c.fill(this.p);
  };
})();