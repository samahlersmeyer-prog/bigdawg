function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
(function () {
  var ROWS = 5,
    COLS = 7,
    TOP = 112;
  var UNITS = [{
    k: "bowl",
    n: "BOWL",
    e: "🥣",
    cost: 50,
    hp: 5,
    cd: 6,
    desc: "MAKES BONES"
  }, {
    k: "ball",
    n: "LAUNCHER",
    e: "🎾",
    face: ":dawgW:",
    cost: 100,
    hp: 5,
    cd: 5,
    rate: 0.9,
    dmg: 1
  }, {
    k: "house",
    n: "DOGHOUSE",
    e: "🏠",
    cost: 50,
    hp: 30,
    cd: 18
  }, {
    k: "snow",
    n: "SNOW PUP",
    e: "❄️",
    face: ":dawgpog:",
    cost: 175,
    hp: 5,
    cd: 8,
    rate: 1.4,
    dmg: 1,
    slow: 1
  }, {
    k: "bomb",
    n: "BARK BOMB",
    e: "💣",
    cost: 150,
    hp: 99,
    cd: 30,
    fuse: 1
  }];
  var ZOMB = {
    walk: {
      hp: 8,
      sp: 12,
      e: "🧟",
      v: 10
    },
    cone: {
      hp: 26,
      sp: 13,
      e: "🧟",
      hat: "🎃",
      v: 20
    },
    run: {
      hp: 8,
      sp: 26,
      e: "🧟‍♀️",
      v: 15
    },
    big: {
      hp: 70,
      sp: 8,
      e: "🧟‍♂️",
      hat: "📮",
      v: 60,
      sz: 1.35
    }
  };
  var rnd = function rnd(a, b) {
    return a + Math.random() * (b - a);
  };
  var UPWAVE = [0, 0, 2, 4];
  var upCost = function upCost(p) {
    return p.u.cost * p.lv;
  };
  var maxHp = function maxHp(p) {
    return p.u.hp * (p.u.k === "house" ? p.lv * 1.8 : 1 + (p.lv - 1) * 0.5);
  };
  function geo(G) {
    var cw = Math.min(G.W / (COLS + 0.6), (G.H - TOP - 10) / ROWS);
    return {
      cw: cw,
      ch: (G.H - TOP - 10) / ROWS,
      x0: 4
    };
  }
  defGame({
    key: "dvz",
    name: "Dawgs vs Zombies",
    icon: "🧟",
    max: 99999,
    blurb: "Lane defense. Hold the yard.",
    how: "Zombies shuffle in from the right. Tap a defender you've placed to UPGRADE it (★2 from wave 2, ★3 from wave 4) or DIG it up for half your bones back. Tap falling 🦴 to collect bones. Tap a card at the top, then tap a square to post it: 🥣 Bowls make bones, 🎾 Launchers shoot, 🏠 Doghouses block, ❄️ Snow Pups slow them down, 💣 Bark Bombs blow up everything nearby. Each lane has one lawn mower for emergencies. If a zombie gets past it, game over.",
    save: function save(G) {
      var s = G.s;
      if (!s.t || s.t < 3) return null;
      return {
        label: "Wave ".concat(s.wave, " \xB7 ").concat(Math.floor(s.t / 60), ":").concat(String(Math.floor(s.t % 60)).padStart(2, "0")),
        v: {
          bones: s.bones,
          score: s.score,
          t: s.t,
          wave: s.wave,
          waveT: s.waveT,
          spawn: s.spawn,
          dropT: s.dropT,
          mowers: s.mowers.slice(),
          cool: s.cool.slice(),
          grid: s.grid.map(function (row) {
            return row.map(function (p) {
              return p && {
                k: p.u.k,
                hp: p.hp,
                t: p.t,
                fuse: p.fuse,
                lv: p.lv || 1
              };
            });
          }),
          zs: s.zs.map(function (z) {
            return {
              r: z.r,
              x: z.x,
              hp: z.hp,
              max: z.max,
              sp: z.sp,
              e: z.e,
              hat: z.hat,
              v: z.v,
              sz: z.sz,
              delay: z.delay,
              slow: z.slow
            };
          })
        }
      };
    },
    load: function load(G, sv) {
      var s = G.s,
        v = sv.v;
      ["bones", "score", "t", "wave", "waveT", "spawn", "dropT", "mowers", "cool", "zs"].forEach(function (k) {
        return s[k] = v[k];
      });
      s.grid = v.grid.map(function (row) {
        return row.map(function (p) {
          return p && Object.assign({
            u: UNITS.find(function (u) {
              return u.k === p.k;
            }),
            lv: 1
          }, p);
        });
      });
      s.msg = {
        txt: "WELCOME BACK!",
        t: 1.5
      };
    },
    reset: function reset(G) {
      G.s = {
        bones: 200,
        score: 0,
        t: 0,
        grid: [],
        zs: [],
        shots: [],
        drops: [],
        fx: [],
        sel: null,
        cool: UNITS.map(function () {
          return 0;
        }),
        mowers: [1, 1, 1, 1, 1],
        mow: [],
        spawn: 25,
        wave: 1,
        waveT: 120,
        flag: 0,
        msg: {
          txt: "HERE THEY COME...",
          t: 2
        },
        dropT: 4
      };
      for (var r = 0; r < ROWS; r++) G.s.grid.push(new Array(COLS).fill(null));
    },
    cell: function cell(G, x, y) {
      var g = geo(G),
        c = Math.floor((x - g.x0) / g.cw),
        r = Math.floor((y - TOP) / g.ch);
      return r >= 0 && r < ROWS && c >= 0 && c < COLS ? [r, c] : null;
    },
    cx: function cx(G, c) {
      var g = geo(G);
      return g.x0 + c * g.cw + g.cw / 2;
    },
    cy: function cy(G, r) {
      var g = geo(G);
      return TOP + r * g.ch + g.ch / 2;
    },
    menu: function menu(G, r, c) {
      var g = geo(G),
        w = 118,
        h = 44,
        cx = this.cx(G, c),
        cy = this.cy(G, r),
        y = r >= 3 ? cy - g.ch / 2 - h - 4 : cy + g.ch / 2 + 4,
        x = Math.max(4, Math.min(G.W - 2 * w - 10, cx - w));
      return {
        up: {
          x: x,
          y: y,
          w: w,
          h: h
        },
        dig: {
          x: x + w + 6,
          y: y,
          w: w,
          h: h
        }
      };
    },
    tap: function tap(G, x, y) {
      var s = G.s,
        hit = function hit(q) {
          return x >= q.x && x <= q.x + q.w && y >= q.y && y <= q.y + q.h;
        };
      if (s.pick) {
        var _s$pick = _slicedToArray(s.pick, 2),
          _r = _s$pick[0],
          _c = _s$pick[1],
          p = s.grid[_r][_c],
          m = this.menu(G, _r, _c);
        s.pick = null;
        if (p && hit(m.up)) {
          if (p.u.k === "bomb" || p.lv >= 3) {
            s.msg = {
              txt: "MAXED OUT",
              t: 0.8
            };
            return;
          }
          if (s.wave < UPWAVE[p.lv + 1]) {
            s.msg = {
              txt: "\u2605".concat(p.lv + 1, " UNLOCKS WAVE ").concat(UPWAVE[p.lv + 1]),
              t: 1
            };
            return;
          }
          if (s.bones < upCost(p)) {
            s.msg = {
              txt: "NEED ".concat(upCost(p), " \uD83E\uDDB4"),
              t: 0.8
            };
            return;
          }
          s.bones -= upCost(p);
          p.lv++;
          p.hp = maxHp(p);
          G.sfx("win");
          s.fx.push({
            x: this.cx(G, _c),
            y: this.cy(G, _r),
            t: 0.5,
            txt: "★".repeat(p.lv)
          });
          return;
        }
        if (p && hit(m.dig)) {
          var back = Math.floor(p.u.cost * (p.lv * (p.lv + 1) / 2) / 2);
          s.bones += back;
          s.grid[_r][_c] = null;
          G.sfx("pop");
          s.fx.push({
            x: this.cx(G, _c),
            y: this.cy(G, _r),
            t: 0.5,
            txt: "+".concat(back)
          });
          return;
        }
      }
      var d = s.drops.find(function (d) {
        return Math.hypot(d.x - x, d.y - y) < 40;
      });
      if (d) {
        d.got = 1;
        s.bones += 25;
        G.sfx("pop");
        return;
      }
      if (y < TOP - 4 && y > 38) {
        var i = Math.floor(x / (G.W / UNITS.length));
        var _u = UNITS[i];
        if (!_u) return;
        if (s.cool[i] > 0) {
          s.msg = {
            txt: "RECHARGING",
            t: 0.7
          };
          return;
        }
        if (s.bones < _u.cost) {
          s.msg = {
            txt: "NEED ".concat(_u.cost, " \uD83E\uDDB4"),
            t: 0.8
          };
          return;
        }
        s.sel = s.sel === i ? null : i;
        return;
      }
      var cl = this.cell(G, x, y);
      if (!cl) return;
      var _cl = _slicedToArray(cl, 2),
        r = _cl[0],
        c = _cl[1];
      if (s.grid[r][c]) {
        if (s.sel == null) s.pick = [r, c];else s.msg = {
          txt: "TAKEN",
          t: 0.6
        };
        return;
      }
      if (s.sel == null) return;
      var u = UNITS[s.sel];
      if (s.bones < u.cost) return;
      s.bones -= u.cost;
      s.cool[s.sel] = u.cd;
      s.grid[r][c] = {
        u: u,
        hp: u.hp,
        lv: 1,
        t: u.k === "bowl" ? 5 : 0,
        fuse: u.fuse || 0
      };
      s.sel = null;
      G.sfx("pop");
    },
    update: function update(G, dt) {
      var _this = this;
      var s = G.s,
        g = geo(G);
      s.t += dt;
      if (s.msg) {
        s.msg.t -= dt;
        if (s.msg.t <= 0) s.msg = null;
      }
      s.cool = s.cool.map(function (v) {
        return Math.max(0, v - dt);
      });
      s.dropT -= dt;
      if (s.dropT <= 0) {
        s.dropT = 6;
        s.drops.push({
          x: rnd(30, G.W - 30),
          y: TOP,
          ty: rnd(TOP + 40, G.H - 40),
          t: 12
        });
      }
      s.drops.forEach(function (d) {
        if (d.y < d.ty) d.y += 60 * dt;
        d.t -= dt;
      });
      s.drops = s.drops.filter(function (d) {
        return !d.got && d.t > 0;
      });
      s.spawn -= dt;
      s.waveT -= dt;
      var lvl = 1 + s.t / 60;
      if (s.waveT <= 0) {
        s.waveT = 55;
        s.wave++;
        s.msg = {
          txt: "A HUGE WAVE IS COMING!",
          t: 2
        };
        for (var i = 0; i < 1 + s.wave * 2; i++) this.addZ(G, i * 1.2, lvl);
      }
      if (s.spawn <= 0) {
        s.spawn = Math.max(3, 16 - s.t / 35) * rnd(0.7, 1.2);
        this.addZ(G, 0, lvl);
      }
      var _loop = function _loop(r) {
        var _loop2 = function _loop2() {
          var p = s.grid[r][c];
          if (!p) return 1;
          var x = _this.cx(G, c),
            y = _this.cy(G, r);
          if (p.u.k === "bowl") {
            p.t -= dt;
            if (p.t <= 0) {
              p.t = [10, 10, 7, 5][p.lv || 1];
              s.drops.push({
                x: x + rnd(-10, 10),
                y: y - 10,
                ty: y + 6,
                t: 12
              });
            }
          }
          if (p.u.rate) {
            p.t -= dt;
            if (p.t <= 0 && s.zs.some(function (z) {
              return z.r === r && z.x > x - 10 && z.x < G.W + 10;
            })) {
              var lv = p.lv || 1;
              p.t = p.u.rate * (p.u.slow ? [1, 1, 0.8, 0.65][lv] : 1);
              var n = p.u.slow ? 1 : lv;
              for (var _i = 0; _i < n; _i++) s.shots.push({
                r: r,
                x: x + 14 - _i * 16,
                y: y - 4,
                dmg: p.u.dmg * (p.u.slow && lv === 3 ? 2 : 1),
                slow: p.u.slow
              });
            }
          }
          if (p.u.k === "bomb") {
            p.fuse -= dt;
            if (p.fuse <= 0) {
              s.grid[r][c] = null;
              s.fx.push({
                x: x,
                y: y,
                t: 0.5,
                boom: g.cw * 1.6
              });
              G.sfx("lose");
              G.buzz();
              s.zs.forEach(function (z) {
                if (Math.abs(z.r - r) <= 1 && Math.abs(z.x - x) < g.cw * 1.6) z.hp -= 90;
              });
            }
          }
        };
        for (var c = 0; c < COLS; c++) {
          if (_loop2()) continue;
        }
      };
      for (var r = 0; r < ROWS; r++) {
        _loop(r);
      }
      s.shots.forEach(function (b) {
        b.x += 300 * dt;
        var z = s.zs.find(function (z) {
          return z.r === b.r && Math.abs(z.x - b.x) < 16 && z.hp > 0;
        });
        if (z) {
          z.hp -= b.dmg;
          if (b.slow) z.slow = 3;
          b.gone = 1;
        }
        if (b.x > G.W + 20) b.gone = 1;
      });
      s.shots = s.shots.filter(function (b) {
        return !b.gone;
      });
      s.zs.forEach(function (z) {
        if (z.delay > 0) {
          z.delay -= dt;
          return;
        }
        var c = Math.floor((z.x - 14 - g.x0) / g.cw),
          p = c >= 0 && c < COLS ? s.grid[z.r][c] : null;
        var sp = z.sp * (z.slow > 0 ? 0.5 : 1);
        if (z.slow > 0) z.slow -= dt;
        if (p && p.u.k !== "bomb" && z.x - _this.cx(G, c) < g.cw * 0.55) {
          p.hp -= dt * (z.slow > 0 ? 0.5 : 1);
          z.chew = (z.chew || 0) + dt;
          if (p.u.k === "house" && p.lv === 3) z.hp -= dt * 1.5;
          if (p.hp <= 0) s.grid[z.r][c] = null;
        } else z.x -= sp * dt;
        if (z.x < 8) {
          if (s.mowers[z.r]) {
            s.mowers[z.r] = 0;
            s.mow.push({
              r: z.r,
              x: 0
            });
            G.sfx("win");
            s.msg = {
              txt: "LAWN MOWER!",
              t: 1
            };
          } else if (!s.mow.some(function (m) {
            return m.r === z.r;
          })) {
            G.over(Math.min(99999, Math.round(s.score)), "They got in! Survived ".concat(Math.floor(s.t / 60), ":").concat(String(Math.floor(s.t % 60)).padStart(2, "0"), "."));
          }
        }
      });
      s.mow.forEach(function (m) {
        m.x += 380 * dt;
        s.zs.forEach(function (z) {
          if (z.r === m.r && Math.abs(z.x - m.x) < 24) z.hp = 0;
        });
      });
      s.mow = s.mow.filter(function (m) {
        return m.x < G.W + 40;
      });
      s.zs.forEach(function (z) {
        if (z.hp <= 0 && !z.dead) {
          z.dead = 1;
          s.score += z.v;
          s.fx.push({
            x: z.x,
            y: _this.cy(G, z.r),
            t: 0.5,
            txt: "+" + z.v
          });
        }
      });
      s.zs = s.zs.filter(function (z) {
        return !z.dead;
      });
      s.score += dt;
      s.fx.forEach(function (e) {
        return e.t -= dt;
      });
      s.fx = s.fx.filter(function (e) {
        return e.t > 0;
      });
    },
    addZ: function addZ(G, delay, lvl) {
      var s = G.s,
        r = Math.floor(Math.random() * ROWS),
        q = Math.random();
      var k = s.t > 240 && q < 0.12 ? "big" : s.t > 150 && q < 0.35 ? "run" : s.t > 75 && q < 0.6 ? "cone" : "walk",
        Z = ZOMB[k],
        hpm = 1 + (lvl - 1) * 0.25;
      s.zs.push({
        r: r,
        x: G.W + 20 + Math.random() * 20,
        hp: Z.hp * hpm,
        max: Z.hp * hpm,
        sp: Z.sp * rnd(0.9, 1.1),
        e: Z.e,
        hat: Z.hat,
        v: Z.v,
        sz: Z.sz || 1,
        delay: delay,
        slow: 0
      });
    },
    draw: function draw(G, c) {
      var _this2 = this;
      var s = G.s,
        W = G.W,
        H = G.H,
        dark = G.dark(),
        g = geo(G);
      c.fillStyle = dark ? "#16251a" : "#5f9e45";
      c.fillRect(0, 0, W, H);
      for (var r = 0; r < ROWS; r++) for (var q = 0; q < COLS; q++) {
        c.fillStyle = (r + q) % 2 ? dark ? "#24432a" : "#7cc35b" : dark ? "#2a4d30" : "#8bd168";
        c.fillRect(g.x0 + q * g.cw, TOP + r * g.ch, g.cw, g.ch);
      }
      c.fillStyle = dark ? "#3a3340" : "#9b8f7f";
      c.fillRect(g.x0 + COLS * g.cw, TOP, W - g.x0 - COLS * g.cw, ROWS * g.ch);
      var bw = W / UNITS.length;
      UNITS.forEach(function (u, i) {
        var x = i * bw,
          on = s.sel === i,
          cool = s.cool[i] > 0,
          ok = s.bones >= u.cost && !cool;
        c.fillStyle = on ? "#ffd23f" : dark ? "#2b2b33" : "#f4ead2";
        c.fillRect(x + 3, 40, bw - 6, TOP - 46);
        if (cool) {
          c.fillStyle = "rgba(0,0,0,0.45)";
          c.fillRect(x + 3, 40, bw - 6, (TOP - 46) * (s.cool[i] / u.cd));
        }
        c.globalAlpha = ok ? 1 : 0.45;
        G.emoji(c, u.e, x + bw / 2, 62, 26);
        c.globalAlpha = 1;
        G.text(c, String(u.cost), x + bw / 2, 92, 10, on ? "#222" : ok ? dark ? "#ffd23f" : "#8a5a00" : "#e53935");
      });
      for (var _r2 = 0; _r2 < ROWS; _r2++) if (s.mowers[_r2]) G.emoji(c, "🚜", 12, this.cy(G, _r2) + 14, 18);
      s.mow.forEach(function (m) {
        return G.emoji(c, "🚜", m.x, _this2.cy(G, m.r), 34);
      });
      for (var _r3 = 0; _r3 < ROWS; _r3++) for (var _q = 0; _q < COLS; _q++) {
        var p = s.grid[_r3][_q];
        if (!p) continue;
        var x = this.cx(G, _q),
          y = this.cy(G, _r3),
          sz = Math.min(g.cw, g.ch) * 0.7;
        if (p.u.face) {
          G.img(c, p.u.face, x, y, sz);
          G.emoji(c, p.u.e, x + sz * 0.35, y + sz * 0.3, sz * 0.45);
        } else G.emoji(c, p.u.e, x, y, p.u.k === "bomb" ? sz * (1 + 0.15 * Math.sin(G.t * 20)) : sz);
        if (p.hp < maxHp(p) && p.u.k !== "bomb") {
          c.fillStyle = "#300";
          c.fillRect(x - 14, y + sz / 2, 28, 3);
          c.fillStyle = "#5be35b";
          c.fillRect(x - 14, y + sz / 2, 28 * p.hp / maxHp(p), 3);
        }
        if (p.lv > 1) G.text(c, "★".repeat(p.lv), x, y - sz / 2 - 2, 9, "#ffd23f");
        var can = p.u.k !== "bomb" && p.lv < 3 && s.wave >= UPWAVE[p.lv + 1] && s.bones >= upCost(p);
        if (can) {
          c.fillStyle = "#2e7d32";
          c.beginPath();
          c.arc(x - sz * 0.42, y + sz * 0.32, 8, 0, 7);
          c.fill();
          G.text(c, "▲", x - sz * 0.42, y + sz * 0.33, 8, "#fff");
        }
      }
      s.shots.forEach(function (b) {
        return G.emoji(c, b.slow ? "❄️" : "🎾", b.x, b.y, 14);
      });
      s.zs.slice().sort(function (a, b) {
        return a.r - b.r;
      }).forEach(function (z) {
        if (z.delay > 0) return;
        var y = _this2.cy(G, z.r),
          sz = Math.min(g.cw, g.ch) * 0.85 * z.sz,
          wob = Math.sin(G.t * 5 + z.x) * 0.08;
        c.save();
        c.translate(z.x, y);
        c.rotate(wob);
        if (z.slow > 0) {
          c.globalAlpha = 0.85;
        }
        G.emoji(c, z.e, 0, 0, sz);
        if (z.hat) G.emoji(c, z.hat, 2, -sz * 0.45, sz * 0.42);
        c.restore();
        c.globalAlpha = 1;
        if (z.slow > 0) G.emoji(c, "❄️", z.x + sz * 0.3, y - sz * 0.3, 12);
        c.fillStyle = "#300";
        c.fillRect(z.x - 14, y - sz / 2 - 6, 28, 3);
        c.fillStyle = "#e53935";
        c.fillRect(z.x - 14, y - sz / 2 - 6, 28 * Math.max(0, z.hp / z.max), 3);
      });
      s.drops.forEach(function (d) {
        var a = d.t < 2 ? Math.floor(G.t * 8) % 2 ? 0.4 : 1 : 1;
        c.globalAlpha = a;
        c.fillStyle = "rgba(255,210,63,0.35)";
        c.beginPath();
        c.arc(d.x, d.y, 20, 0, 7);
        c.fill();
        G.emoji(c, "🦴", d.x, d.y, 26);
        c.globalAlpha = 1;
      });
      s.fx.forEach(function (e) {
        if (e.boom) {
          c.fillStyle = "rgba(255,140,40,".concat(e.t, ")");
          c.beginPath();
          c.arc(e.x, e.y, e.boom * (1.2 - e.t), 0, 7);
          c.fill();
        } else G.text(c, e.txt, e.x, e.y - 20 - (0.5 - e.t) * 30, 10, "#ffd23f");
      });
      if (s.msg) G.banner(c, s.msg.txt, "#fff", H * 0.5, s.msg.txt.length > 12 ? 15 : undefined);
      if (s.pick && s.grid[s.pick[0]][s.pick[1]]) {
        var _s$pick2 = _slicedToArray(s.pick, 2),
          _r4 = _s$pick2[0],
          _q2 = _s$pick2[1],
          _p = s.grid[_r4][_q2],
          m = this.menu(G, _r4, _q2),
          lock = s.wave < UPWAVE[Math.min(3, _p.lv + 1)],
          max = _p.u.k === "bomb" || _p.lv >= 3;
        c.strokeStyle = "#ffd23f";
        c.lineWidth = 3;
        c.strokeRect(g.x0 + _q2 * g.cw + 2, TOP + _r4 * g.ch + 2, g.cw - 4, g.ch - 4);
        var btn = function btn(b, l1, l2, bg) {
          c.fillStyle = "rgba(0,0,0,0.35)";
          c.fillRect(b.x + 2, b.y + 3, b.w, b.h);
          c.fillStyle = bg;
          c.fillRect(b.x, b.y, b.w, b.h);
          G.text(c, l1, b.x + b.w / 2, b.y + 14, 10, "#222");
          G.text(c, l2, b.x + b.w / 2, b.y + 31, 10, "#222");
        };
        btn(m.up, max ? "MAXED" : "UPGRADE \u2605".concat(_p.lv + 1), max ? "" : lock ? "WAVE ".concat(UPWAVE[_p.lv + 1]) : "".concat(upCost(_p), " \uD83E\uDDB4"), !max && !lock && s.bones >= upCost(_p) ? "#ffd23f" : "#9e9e9e");
        btn(m.dig, "DIG UP", "+".concat(Math.floor(_p.u.cost * (_p.lv * (_p.lv + 1) / 2) / 2), " \uD83E\uDDB4"), "#e57373");
      }
      G.hud(c, "\uD83E\uDDB4".concat(s.bones), "WAVE ".concat(s.wave), "".concat(Math.round(s.score)));
      if (s.sel != null) G.text(c, "TAP A SQUARE FOR ".concat(UNITS[s.sel].n), W / 2, TOP + 8, 9, "#fff");
      G.hint(c, "TAP A CARD, THEN A SQUARE", 5);
    }
  });
})();