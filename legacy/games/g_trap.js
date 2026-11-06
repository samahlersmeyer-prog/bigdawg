function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
(function () {
  var COLS = 11;
  var D4 = [[1, 0], [-1, 0], [0, 1], [0, -1]],
    D8 = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]];
  function geo(G) {
    var top = 44,
      cell = Math.floor(Math.min((G.W - 12) / COLS, (G.H - top - 10) / 13));
    var rows = Math.floor((G.H - top - 10) / cell);
    return {
      cell: cell,
      rows: rows,
      x0: Math.floor((G.W - cell * COLS) / 2),
      y0: top + Math.floor((G.H - top - 10 - rows * cell) / 2)
    };
  }
  function level(G) {
    var s = G.s,
      g = geo(G),
      R = g.rows;
    s.R = R;
    s.grid = [];
    for (var r = 0; r < R; r++) {
      s.grid.push([]);
      for (var c = 0; c < COLS; c++) s.grid[r].push(r === 0 || c === 0 || r === R - 1 || c === COLS - 1 ? 1 : 0);
    }
    for (var _r = 3; _r < R - 3; _r++) for (var _c = 3; _c < COLS - 3; _c++) s.grid[_r][_c] = 2;
    for (var i = 0; i < 4 + s.lvl; i++) {
      var _r2 = 3 + Math.floor(Math.random() * (R - 6)),
        _c2 = 3 + Math.floor(Math.random() * (COLS - 6));
      s.grid[_r2][_c2] = 0;
    }
    for (var _i = 0; _i < Math.min(8, (s.lvl - 1) * 2); _i++) {
      var _r3 = 1 + Math.floor(Math.random() * (R - 2)),
        _c3 = 1 + Math.floor(Math.random() * (COLS - 2));
      if (s.grid[_r3][_c3] === 2 || Math.random() < 0.4) s.grid[_r3][_c3] = 1;
    }
    s.p = {
      r: Math.floor(R / 2),
      c: Math.floor(COLS / 2)
    };
    s.grid[s.p.r][s.p.c] = 0;
    s.wave = 0;
    s.cats = [];
    this.spawn(G);
    s.msg = {
      txt: "LEVEL ".concat(s.lvl),
      t: 1.4
    };
  }
  function free(s, r, c) {
    return r >= 0 && c >= 0 && r < s.R && c < COLS && s.grid[r][c] === 0 && !s.cats.some(function (k) {
      return k.r === r && k.c === c;
    });
  }
  function catMoves(s, k) {
    return D8.filter(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 2),
        dc = _ref2[0],
        dr = _ref2[1];
      var r = k.r + dr,
        c = k.c + dc;
      return r === s.p.r && c === s.p.c || free(s, r, c) && !(s.grid[r][c] === 3);
    });
  }
  defGame({
    key: "trap",
    name: "Pup Trap",
    icon: "🧀",
    max: 999999,
    blurb: "Push crates. Trap the cats. Eat the cheese.",
    how: "You're the pup. Tap or hold on the side you want to move. Walk into crates to push the whole row (if there's room at the end). Box in the cats: when EVERY cat on the board is stuck, they all turn into 🧀 cheese. Eat cheese for points. Clear 3 waves to finish a level. Gray rocks don't move. Get caught 3 times and it's over.",
    spawn: function spawn(G) {
      var s = G.s,
        n = Math.min(6, 1 + s.wave + Math.floor(s.lvl / 2)),
        spots = [];
      for (var r = 1; r < s.R - 1; r++) for (var c = 1; c < COLS - 1; c++) if (free(s, r, c) && Math.abs(r - s.p.r) + Math.abs(c - s.p.c) > 6) spots.push([r, c]);
      spots.sort(function () {
        return Math.random() - 0.5;
      });
      for (var i = 0; i < n && i < spots.length; i++) s.cats.push({
        r: spots[i][0],
        c: spots[i][1],
        stuck: 0
      });
      s.ct = 1.2;
    },
    reset: function reset(G) {
      G.s = {
        lvl: 1,
        score: 0,
        lives: 3,
        hold: null,
        rep: 0,
        hurt: 0,
        pops: [],
        msg: null
      };
      level.call(this, G);
    },
    step: function step(G, dc, dr) {
      var s = G.s;
      if (s.hurt > 0) return;
      var r = s.p.r + dr,
        c = s.p.c + dc;
      if (r < 0 || c < 0 || r >= s.R || c >= COLS) return;
      var v = s.grid[r][c];
      if (s.cats.some(function (k) {
        return k.r === r && k.c === c;
      })) return;
      if (v === 1) return;
      if (v === 2) {
        var er = r,
          ec = c;
        while (s.grid[er] && s.grid[er][ec] === 2) {
          er += dr;
          ec += dc;
        }
        if (!s.grid[er] || s.grid[er][ec] !== 0 || s.cats.some(function (k) {
          return k.r === er && k.c === ec;
        })) return;
        s.grid[er][ec] = 2;
        s.grid[r][c] = 0;
        G.sfx("pop");
      }
      if (v === 3) {
        s.grid[r][c] = 0;
        s.score += 100;
        s.pops.push({
          r: r,
          c: c,
          t: 0.7,
          txt: "+100"
        });
        G.sfx("win");
      }
      s.p.r = r;
      s.p.c = c;
      if (!s.cats.length && !s.grid.some(function (row) {
        return row.includes(3);
      })) this.nextWave(G);
    },
    nextWave: function nextWave(G) {
      var s = G.s;
      s.wave++;
      if (s.wave >= 3) {
        s.score += 250 * s.lvl;
        s.lvl++;
        G.sfx("win");
        level.call(this, G);
        s.msg = {
          txt: "LEVEL ".concat(s.lvl, "! +").concat(250 * (s.lvl - 1)),
          t: 1.6
        };
        return;
      }
      this.spawn(G);
      s.msg = {
        txt: "WAVE ".concat(s.wave + 1, " OF 3"),
        t: 1.2
      };
    },
    dirTo: function dirTo(G, x, y) {
      var g = geo(G),
        px = g.x0 + (G.s.p.c + 0.5) * g.cell,
        py = g.y0 + (G.s.p.r + 0.5) * g.cell,
        dx = x - px,
        dy = y - py;
      if (Math.max(Math.abs(dx), Math.abs(dy)) < g.cell * 0.4) return null;
      return Math.abs(dx) > Math.abs(dy) ? [Math.sign(dx), 0] : [0, Math.sign(dy)];
    },
    down: function down(G, x, y) {
      var s = G.s;
      s.hold = {
        x: x,
        y: y
      };
      var d = this.dirTo(G, x, y);
      if (d) this.step(G, d[0], d[1]);
      s.rep = 0.28;
    },
    move: function move(G, x, y) {
      if (G.s.hold) G.s.hold = {
        x: x,
        y: y
      };
    },
    up: function up(G) {
      G.s.hold = null;
    },
    onKey: function onKey(G, k, d) {
      if (!d) return;
      var m = {
        ArrowLeft: [-1, 0],
        ArrowRight: [1, 0],
        ArrowUp: [0, -1],
        ArrowDown: [0, 1]
      }[k];
      if (m) this.step(G, m[0], m[1]);
    },
    update: function update(G, dt) {
      var s = G.s;
      if (s.msg) {
        s.msg.t -= dt;
        if (s.msg.t <= 0) s.msg = null;
      }
      s.pops.forEach(function (p) {
        return p.t -= dt;
      });
      s.pops = s.pops.filter(function (p) {
        return p.t > 0;
      });
      if (s.hurt > 0) {
        s.hurt -= dt;
        return;
      }
      if (!s.cats.length && s.cheeseT > 0) {
        s.cheeseT -= dt;
        if (s.cheeseT <= 0) {
          s.grid.forEach(function (row) {
            return row.forEach(function (v, i) {
              if (v === 3) row[i] = 0;
            });
          });
          s.msg = {
            txt: "THE CHEESE WENT STALE",
            t: 1.2
          };
          this.nextWave(G);
        }
      }
      if (s.hold) {
        s.rep -= dt;
        if (s.rep <= 0) {
          s.rep = 0.13;
          var d = this.dirTo(G, s.hold.x, s.hold.y);
          if (d) this.step(G, d[0], d[1]);
        }
      }
      s.ct -= dt;
      if (s.ct > 0) return;
      s.ct = Math.max(0.32, 0.75 - s.lvl * 0.05 - s.wave * 0.03);
      var allStuck = s.cats.length > 0;
      var _iterator = _createForOfIteratorHelper(s.cats),
        _step;
      try {
        var _loop = function _loop() {
            var k = _step.value;
            var mv = catMoves(s, k);
            if (!mv.length) {
              k.stuck = 1;
              return 0;
            }
            k.stuck = 0;
            allStuck = false;
            mv.sort(function (a, b) {
              return Math.hypot(k.r + a[1] - s.p.r, k.c + a[0] - s.p.c) - Math.hypot(k.r + b[1] - s.p.r, k.c + b[0] - s.p.c);
            });
            var pick = Math.random() < 0.15 && mv.length > 1 ? mv[1] : mv[0];
            k.r += pick[1];
            k.c += pick[0];
            if (k.r === s.p.r && k.c === s.p.c) {
              s.lives--;
              s.hurt = 1.2;
              G.buzz();
              G.sfx("lose");
              if (s.lives <= 0) {
                G.over(Math.min(999999, s.score), s.lvl > 2 ? "The cats finally got you." : "Caught by a cat!");
                return {
                  v: void 0
                };
              }
              s.msg = {
                txt: "CAUGHT!",
                t: 1.1
              };
              var far = [[1, 1], [1, COLS - 2], [s.R - 2, 1], [s.R - 2, COLS - 2]].filter(function (_ref3) {
                var _ref4 = _slicedToArray(_ref3, 2),
                  r = _ref4[0],
                  c = _ref4[1];
                return free(s, r, c);
              }).sort(function (a, b) {
                return Math.hypot(b[0] - s.p.r, b[1] - s.p.c) - Math.hypot(a[0] - s.p.r, a[1] - s.p.c);
              })[0];
              if (far) {
                k.r = far[0];
                k.c = far[1];
              }
              return {
                v: void 0
              };
            }
          },
          _ret;
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          _ret = _loop();
          if (_ret === 0) continue;
          if (_ret) return _ret.v;
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
      if (allStuck) {
        s.cats.forEach(function (k) {
          s.grid[k.r][k.c] = 3;
          s.pops.push({
            r: k.r,
            c: k.c,
            t: 0.8,
            txt: "🧀"
          });
        });
        s.score += 50 * s.cats.length;
        s.cats = [];
        s.cheeseT = 20;
        G.sfx("win");
        s.msg = {
          txt: "TRAPPED! EAT THE CHEESE",
          t: 1.5
        };
      }
    },
    draw: function draw(G, c) {
      var s = G.s,
        g = geo(G),
        dark = G.dark(),
        z = g.cell;
      c.fillStyle = dark ? "#1c1a26" : "#f3e9d2";
      c.fillRect(0, 0, G.W, G.H);
      for (var r = 0; r < s.R; r++) for (var q = 0; q < COLS; q++) {
        var x = g.x0 + q * z,
          y = g.y0 + r * z,
          v = s.grid[r][q];
        c.fillStyle = (r + q) % 2 ? dark ? "#2c2a3a" : "#fbf5e6" : dark ? "#26243a" : "#efe3c8";
        c.fillRect(x, y, z, z);
        if (v === 1) {
          c.fillStyle = dark ? "#55556a" : "#8d8d99";
          c.fillRect(x + 1, y + 1, z - 2, z - 2);
          c.fillStyle = "rgba(255,255,255,0.18)";
          c.fillRect(x + 1, y + 1, z - 2, 4);
        } else if (v === 2) {
          c.fillStyle = "#c98b4a";
          c.fillRect(x + 2, y + 2, z - 4, z - 4);
          c.strokeStyle = "#8a5a2b";
          c.lineWidth = 2;
          c.strokeRect(x + 3, y + 3, z - 6, z - 6);
          c.beginPath();
          c.moveTo(x + 4, y + 4);
          c.lineTo(x + z - 4, y + z - 4);
          c.moveTo(x + z - 4, y + 4);
          c.lineTo(x + 4, y + z - 4);
          c.stroke();
        } else if (v === 3) G.emoji(c, "🧀", x + z / 2, y + z / 2 + 1, z * 0.8);
      }
      s.cats.forEach(function (k) {
        var x = g.x0 + (k.c + 0.5) * z,
          y = g.y0 + (k.r + 0.5) * z;
        c.fillStyle = k.stuck ? "rgba(80,140,255,0.35)" : "rgba(226,72,61,0.3)";
        c.beginPath();
        c.arc(x, y, z * 0.42, 0, 7);
        c.fill();
        G.emoji(c, "🐈", x, y + 1, z * 0.85);
        if (k.stuck) G.emoji(c, "💦", x + z * 0.3, y - z * 0.3, z * 0.4);
      });
      var px = g.x0 + (s.p.c + 0.5) * z,
        py = g.y0 + (s.p.r + 0.5) * z;
      if (!(s.hurt > 0 && Math.floor(G.t * 12) % 2)) G.img(c, s.hurt > 0 ? ":dawgpain:" : ":dawgW:", px, py, z * 1.05);
      s.pops.forEach(function (p) {
        return G.text(c, p.txt, g.x0 + (p.c + 0.5) * z, g.y0 + (p.r + 0.5) * z - 14 - (0.8 - p.t) * 24, 11, "#e07b00");
      });
      G.hud(c, "".concat(s.score), "LV ".concat(s.lvl, " \xB7 WAVE ").concat(Math.min(3, s.wave + 1), "/3"), "🐶".repeat(Math.max(0, s.lives)));
      if (s.msg) G.banner(c, s.msg.txt, "#fff", G.H * 0.45, s.msg.txt.length > 12 ? 15 : undefined);
      G.hint(c, "TAP / HOLD WHERE YOU WANT TO GO", 5);
    }
  });
})();