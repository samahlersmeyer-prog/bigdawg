function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
defGame({
  key: "pede",
  name: "Dawgipede",
  icon: "🐛",
  max: 999999,
  blurb: "Blast the Catterpillar before it reaches you.",
  how: "A Catterpillar winds down through the toadstools. Drag anywhere to move the Big Dawg (or use the arrow keys). Bones fire on their own, one at a time, so aim with your feet. Every segment you hit becomes a toadstool and splits the cat in two: heads are 100, body parts are 10. Squirrels zigzag through your area and eat toadstools: 300, 600 or 900 the closer they are. Birds dive-bomb and drop toadstools, 2 hits for 200. Touch anything and you lose a life. Clear the Catterpillar for a faster wave. Extra life every 12,000.",
  ZONE: 6,
  reset: function reset(G) {
    var W = G.W,
      H = G.H,
      cols = 15;
    var cell = Math.floor(Math.min(W / cols, (H - 44) / 18));
    var rows = Math.floor((H - 44) / cell);
    var s = G.s = {
      cols: cols,
      rows: rows,
      cell: cell,
      ox: Math.floor((W - cols * cell) / 2),
      oy: H - rows * cell - 4,
      m: [],
      segs: [],
      bul: null,
      sq: null,
      bird: null,
      wave: 1,
      pts: 0,
      lives: 3,
      next: 12000,
      acc: 0,
      sideT: 6,
      sqT: 4,
      pops: [],
      keys: {},
      dying: 0,
      drag: null
    };
    for (var y = 0; y < rows; y++) {
      s.m.push([]);
      for (var x = 0; x < cols; x++) s.m[y].push(y >= 1 && y < rows - 2 && Math.random() < (y >= rows - this.ZONE ? 0.035 : 0.085) ? 4 : 0);
    }
    s.p = {
      x: s.ox + cols * cell / 2,
      y: s.oy + (rows - 1.5) * cell
    };
    this.spawnWave(G, 12);
  },
  spd: function spd(G) {
    return Math.min(17, 8.5 + G.s.wave * 0.7);
  },
  spawnWave: function spawnWave(G, total) {
    var s = G.s,
      heads = Math.min(s.wave - 1, 6, total - 1),
      len = total - heads;
    s.segs = [];
    for (var i = 0; i < len; i++) s.segs.push({
      x: -i,
      y: 0,
      dx: 1,
      dy: 1,
      px: -i - 1,
      py: 0,
      head: i === 0
    });
    for (var _i = 0; _i < heads; _i++) {
      var x = 1 + Math.floor(Math.random() * (s.cols - 2));
      s.segs.push({
        x: x,
        y: 0,
        dx: Math.random() < 0.5 ? 1 : -1,
        dy: 1,
        px: x,
        py: -1,
        head: true
      });
    }
    s.acc = 0;
  },
  mush: function mush(s, x, y) {
    return x >= 0 && x < s.cols && y >= 0 && y < s.rows && s.m[y][x] > 0;
  },
  step: function step(G) {
    var s = G.s,
      top = s.rows - this.ZONE;
    var _iterator = _createForOfIteratorHelper(s.segs),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var g = _step.value;
        g.px = g.x;
        g.py = g.y;
        var nx = g.x + g.dx;
        var blocked = nx >= s.cols || nx < 0 && g.dx < 0 || this.mush(s, nx, g.y);
        if (!blocked) {
          g.x = nx;
          continue;
        }
        var ny = g.y + g.dy;
        if (ny > s.rows - 1) {
          g.dy = -1;
          ny = g.y - 1;
        }
        if (g.dy < 0 && ny < top) {
          g.dy = 1;
          ny = g.y + 1;
        }
        g.y = ny;
        g.dx = -g.dx;
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  },
  segPos: function segPos(G, g) {
    var s = G.s,
      f = Math.min(1, s.acc * this.spd(G));
    var x = g.px + (g.x - g.px) * f,
      y = g.py + (g.y - g.py) * f;
    return [s.ox + (x + 0.5) * s.cell, s.oy + (y + 0.5) * s.cell];
  },
  pop: function pop(s, x, y, txt) {
    s.pops.push({
      x: x,
      y: y,
      t: 0.9,
      txt: txt
    });
  },
  add: function add(G, n) {
    var s = G.s;
    s.pts += n;
    if (s.pts >= s.next) {
      s.next += 12000;
      s.lives++;
      G.sfx("win");
      this.pop(s, G.W / 2, G.H / 2, "EXTRA LIFE!");
    }
  },
  down: function down(G, x, y) {
    G.s.drag = {
      x: x,
      y: y,
      px: G.s.p.x,
      py: G.s.p.y
    };
  },
  move: function move(G, x, y) {
    var s = G.s,
      d = s.drag;
    if (!d) return;
    s.p.x = d.px + (x - d.x) * 1.35;
    s.p.y = d.py + (y - d.y) * 1.35;
    this.clampP(s);
  },
  up: function up(G) {
    G.s.drag = null;
  },
  onKey: function onKey(G, k, d) {
    G.s.keys[k] = d;
  },
  clampP: function clampP(s) {
    var c = s.cell;
    s.p.x = Math.max(s.ox + c / 2, Math.min(s.ox + s.cols * c - c / 2, s.p.x));
    s.p.y = Math.max(s.oy + (s.rows - this.ZONE) * c + c / 2, Math.min(s.oy + s.rows * c - c / 2, s.p.y));
  },
  die: function die(G) {
    var s = G.s;
    if (s.dying) return;
    s.dying = 1.3;
    s.lives--;
    G.sfx("lose");
    G.buzz();
  },
  update: function update(G, dt) {
    var s = G.s,
      c = s.cell,
      p = s.p;
    s.pops.forEach(function (o) {
      o.t -= dt;
      o.y -= 30 * dt;
    });
    s.pops = s.pops.filter(function (o) {
      return o.t > 0;
    });
    if (s.dying) {
      s.dying -= dt;
      if (s.dying <= 0) {
        s.dying = 0;
        if (s.lives <= 0) return G.over(s.pts, s.pts >= 30000 ? "Top dawg!" : s.pts >= 10000 ? "Bug zapper!" : "The cat won.");
        var fix = 0;
        s.m.forEach(function (r) {
          return r.forEach(function (v, x) {
            if (v > 0 && v < 4) {
              r[x] = 4;
              fix++;
            }
          });
        });
        if (fix) this.add(G, fix * 5);
        var left = s.segs.length;
        this.spawnWave(G, Math.max(1, left));
        s.sq = null;
        s.bird = null;
        s.bul = null;
        s.sideT = 6;
      }
      return;
    }
    var kx = (s.keys.ArrowRight || s.keys.d ? 1 : 0) - (s.keys.ArrowLeft || s.keys.a ? 1 : 0),
      ky = (s.keys.ArrowDown || s.keys.s ? 1 : 0) - (s.keys.ArrowUp || s.keys.w ? 1 : 0);
    if (kx || ky) {
      p.x += kx * 260 * dt;
      p.y += ky * 260 * dt;
      this.clampP(s);
    }
    if (!s.bul) s.bul = {
      x: p.x,
      y: p.y - c * 0.6
    };
    var iv = 1 / this.spd(G);
    s.acc += dt;
    while (s.acc >= iv) {
      s.acc -= iv;
      this.step(G);
    }
    var top = s.rows - this.ZONE;
    if (s.segs.some(function (g) {
      return g.y >= top;
    })) {
      s.sideT -= dt;
      if (s.sideT <= 0) {
        s.sideT = Math.max(2.5, 6 - s.wave * 0.3);
        var L = Math.random() < 0.5;
        s.segs.push({
          x: L ? -1 : s.cols,
          y: top,
          dx: L ? 1 : -1,
          dy: 1,
          px: L ? -2 : s.cols + 1,
          py: top,
          head: true
        });
      }
    }
    if (!s.sq) {
      s.sqT -= dt;
      if (s.sqT <= 0) {
        var _L = Math.random() < 0.5;
        s.sq = {
          x: _L ? s.ox - c : s.ox + s.cols * c + c,
          y: s.oy + (top + 1) * c,
          vx: (_L ? 1 : -1) * (70 + s.wave * 6),
          vy: 170
        };
      }
    } else {
      var q = s.sq;
      q.x += q.vx * dt;
      q.y += q.vy * dt;
      var yt = s.oy + top * c + c / 2,
        yb = s.oy + s.rows * c - c / 2;
      if (q.y < yt) {
        q.y = yt;
        q.vy = Math.abs(q.vy) * (0.7 + Math.random() * 0.6);
      }
      if (q.y > yb) {
        q.y = yb;
        q.vy = -Math.abs(q.vy) * (0.7 + Math.random() * 0.6);
      }
      if (Math.random() < dt * 0.6) q.vx = q.vx > 0 ? Math.max(30, q.vx * 0.3) : Math.min(-30, q.vx * 0.3);else if (Math.abs(q.vx) < 60) q.vx *= 1 + dt * 3;
      var mx = Math.floor((q.x - s.ox) / c),
        my = Math.floor((q.y - s.oy) / c);
      if (this.mush(s, mx, my)) s.m[my][mx] = 0;
      if (q.x < s.ox - 2 * c || q.x > s.ox + s.cols * c + 2 * c) {
        s.sq = null;
        s.sqT = 3 + Math.random() * 5;
      }
    }
    if (!s.bird && s.wave >= 2) {
      var n = 0;
      for (var y = top; y < s.rows; y++) for (var x = 0; x < s.cols; x++) if (s.m[y][x]) n++;
      if (n < 5 && Math.random() < dt * 0.35) s.bird = {
        x: s.ox + (Math.floor(Math.random() * s.cols) + 0.5) * c,
        y: s.oy - c,
        vy: 230 + s.wave * 8,
        hp: 2,
        row: -1
      };
    }
    if (s.bird) {
      var b = s.bird;
      b.y += b.vy * dt;
      var r = Math.floor((b.y - s.oy) / c);
      if (r !== b.row) {
        b.row = r;
        var bx = Math.floor((b.x - s.ox) / c);
        if (r >= 1 && r < s.rows - 1 && !s.m[r][bx] && Math.random() < 0.28) s.m[r][bx] = 4;
      }
      if (b.y > s.oy + s.rows * c + c) s.bird = null;
    }
    if (s.bul) {
      var dist = 980 * dt;
      while (dist > 0 && s.bul) {
        var st = Math.min(dist, c * 0.4);
        dist -= st;
        s.bul.y -= st;
        if (s.bul.y < s.oy - c) {
          s.bul = null;
          break;
        }
        this.hit(G);
      }
    }
    var R = c * 0.72;
    var _iterator2 = _createForOfIteratorHelper(s.segs),
      _step2;
    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        var g = _step2.value;
        var _this$segPos = this.segPos(G, g),
          _this$segPos2 = _slicedToArray(_this$segPos, 2),
          _x = _this$segPos2[0],
          _y = _this$segPos2[1];
        if (Math.hypot(_x - p.x, _y - p.y) < R) return this.die(G);
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }
    if (s.sq && Math.hypot(s.sq.x - p.x, s.sq.y - p.y) < R) return this.die(G);
    if (s.bird && Math.hypot(s.bird.x - p.x, s.bird.y - p.y) < R) return this.die(G);
    if (!s.segs.length) {
      this.add(G, 0);
      s.wave++;
      G.sfx("win");
      this.pop(s, G.W / 2, G.H * 0.4, "WAVE ".concat(s.wave));
      this.spawnWave(G, 12);
    }
  },
  hit: function hit(G) {
    var s = G.s,
      c = s.cell,
      b = s.bul;
    var mx = Math.floor((b.x - s.ox) / c),
      my = Math.floor((b.y - s.oy) / c);
    for (var i = 0; i < s.segs.length; i++) {
      var g = s.segs[i],
        _this$segPos3 = this.segPos(G, g),
        _this$segPos4 = _slicedToArray(_this$segPos3, 2),
        x = _this$segPos4[0],
        y = _this$segPos4[1];
      if (Math.abs(x - b.x) < c * 0.55 && Math.abs(y - b.y) < c * 0.55) {
        this.add(G, g.head ? 100 : 10);
        this.pop(s, x, y, g.head ? "100" : "10");
        G.sfx("pop");
        if (s.segs[i + 1] && !s.segs[i + 1].head) s.segs[i + 1].head = true;
        if (g.x >= 0 && g.x < s.cols && g.y >= 0 && g.y < s.rows - 1) s.m[g.y][g.x] = 4;
        s.segs.splice(i, 1);
        s.bul = null;
        return;
      }
    }
    if (this.mush(s, mx, my)) {
      s.m[my][mx]--;
      if (!s.m[my][mx]) this.add(G, 1);
      s.bul = null;
      return;
    }
    if (s.sq && Math.abs(s.sq.x - b.x) < c * 0.7 && Math.abs(s.sq.y - b.y) < c * 0.6) {
      var d = Math.abs(s.sq.y - s.p.y) / c,
        n = d < 1.6 ? 900 : d < 3.2 ? 600 : 300;
      this.add(G, n);
      this.pop(s, s.sq.x, s.sq.y, String(n));
      G.sfx("win");
      s.sq = null;
      s.sqT = 3 + Math.random() * 5;
      s.bul = null;
      return;
    }
    if (s.bird && Math.abs(s.bird.x - b.x) < c * 0.6 && Math.abs(s.bird.y - b.y) < c * 0.6) {
      s.bul = null;
      s.bird.hp--;
      if (s.bird.hp > 0) {
        s.bird.vy *= 2;
        G.sfx("pop");
      } else {
        this.add(G, 200);
        this.pop(s, s.bird.x, s.bird.y, "200");
        G.sfx("pop");
        s.bird = null;
      }
    }
  },
  draw: function draw(G, c) {
    var _this = this;
    var s = G.s,
      W = G.W,
      H = G.H,
      cs = s.cell,
      dark = G.dark(),
      p = s.p;
    var PAL = [["#e74c3c", "#fff3e0"], ["#9b59b6", "#f3e5f5"], ["#3498db", "#e3f2fd"], ["#e67e22", "#fff8e1"], ["#1abc9c", "#e0f2f1"], ["#f1c40f", "#fffde7"]];
    var pal = PAL[(s.wave - 1) % PAL.length];
    var bg = c.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, dark ? "#06120b" : "#0f2a1a");
    bg.addColorStop(1, dark ? "#0d2416" : "#1d4a2c");
    c.fillStyle = bg;
    c.fillRect(0, 0, W, H);
    var zt = s.oy + (s.rows - this.ZONE) * cs;
    c.fillStyle = "rgba(255,255,255,0.04)";
    c.fillRect(s.ox, zt, s.cols * cs, this.ZONE * cs);
    c.strokeStyle = "rgba(255,255,255,0.1)";
    c.setLineDash([4, 6]);
    c.beginPath();
    c.moveTo(s.ox, zt);
    c.lineTo(s.ox + s.cols * cs, zt);
    c.stroke();
    c.setLineDash([]);
    for (var y = 0; y < s.rows; y++) for (var x = 0; x < s.cols; x++) {
      var hp = s.m[y][x];
      if (!hp) continue;
      var X = s.ox + x * cs + cs / 2,
        Y = s.oy + y * cs,
        k = hp / 4;
      c.fillStyle = pal[1];
      c.fillRect(X - cs * 0.12, Y + cs * 0.45, cs * 0.24, cs * 0.45);
      c.fillStyle = pal[0];
      c.beginPath();
      c.ellipse(X, Y + cs * 0.5, cs * 0.44, cs * 0.42 * k, 0, Math.PI, 0);
      c.fill();
      if (k > 0.5) {
        c.fillStyle = "rgba(255,255,255,0.75)";
        c.beginPath();
        c.arc(X - cs * 0.15, Y + cs * 0.32, cs * 0.06, 0, 7);
        c.arc(X + cs * 0.14, Y + cs * 0.25, cs * 0.05, 0, 7);
        c.fill();
      }
    }
    var segDraw = function segDraw(head) {
      return s.segs.forEach(function (g) {
        if (g.head !== head) return;
        var _this$segPos5 = _this.segPos(G, g),
          _this$segPos6 = _slicedToArray(_this$segPos5, 2),
          x = _this$segPos6[0],
          y = _this$segPos6[1],
          r = cs * 0.46;
        if (x < s.ox - cs || x > s.ox + s.cols * cs + cs) return;
        c.fillStyle = head ? "#ff9f43" : "#f6b26b";
        c.beginPath();
        c.arc(x, y, r, 0, 7);
        c.fill();
        c.strokeStyle = "#b35900";
        c.lineWidth = 2;
        c.beginPath();
        c.arc(x, y, r * 0.65, -0.6, 0.6);
        c.stroke();
        c.beginPath();
        c.arc(x, y, r * 0.65, Math.PI - 0.6, Math.PI + 0.6);
        c.stroke();
        if (!head) return;
        c.fillStyle = "#ff9f43";
        [-1, 1].forEach(function (sd) {
          c.beginPath();
          c.moveTo(x + sd * r * 0.85, y - r * 0.3);
          c.lineTo(x + sd * r * 0.7, y - r * 1.25);
          c.lineTo(x + sd * r * 0.15, y - r * 0.8);
          c.fill();
        });
        var lk = g.dx * r * 0.15;
        c.fillStyle = "#fff";
        c.beginPath();
        c.arc(x - r * 0.35 + lk, y - r * 0.05, r * 0.26, 0, 7);
        c.arc(x + r * 0.35 + lk, y - r * 0.05, r * 0.26, 0, 7);
        c.fill();
        c.fillStyle = "#1b1b1b";
        c.beginPath();
        c.ellipse(x - r * 0.33 + lk * 1.6, y - r * 0.05, r * 0.08, r * 0.2, 0, 0, 7);
        c.ellipse(x + r * 0.37 + lk * 1.6, y - r * 0.05, r * 0.08, r * 0.2, 0, 0, 7);
        c.fill();
        c.fillStyle = "#ff6b9a";
        c.beginPath();
        c.moveTo(x + lk - r * 0.1, y + r * 0.28);
        c.lineTo(x + lk + r * 0.1, y + r * 0.28);
        c.lineTo(x + lk, y + r * 0.4);
        c.fill();
      });
    };
    segDraw(false);
    segDraw(true);
    if (s.sq) {
      c.save();
      c.translate(s.sq.x, s.sq.y);
      if (s.sq.vx > 0) c.scale(-1, 1);
      G.emoji(c, "🐿️", 0, 0, cs * 1.1);
      c.restore();
    }
    if (s.bird) G.emoji(c, "🐦", s.bird.x, s.bird.y, cs * (s.bird.hp > 1 ? 1 : 1.2));
    if (s.bul) {
      var b = s.bul;
      c.fillStyle = "#fffaf0";
      c.fillRect(b.x - 2, b.y - cs * 0.3, 4, cs * 0.6);
      [-1, 1].forEach(function (e) {
        c.beginPath();
        c.arc(b.x - 2.5, b.y + e * cs * 0.3, 2.6, 0, 7);
        c.arc(b.x + 2.5, b.y + e * cs * 0.3, 2.6, 0, 7);
        c.fill();
      });
    }
    G.img(c, s.dying ? ":dawgpain:" : s.bul && s.bul.y > p.y - cs * 1.2 ? ":dawgpog:" : ":dawgW:", p.x, p.y, cs * 1.25, s.dying ? (1.3 - s.dying) * 8 : 0);
    s.pops.forEach(function (o) {
      c.globalAlpha = Math.min(1, o.t * 2);
      G.text(c, o.txt, o.x, o.y, 10, "#ffd23f");
      c.globalAlpha = 1;
    });
    G.hud(c, "".concat(s.pts), "WAVE ".concat(s.wave), "LIVES ".concat(s.lives));
    if (G.state === "play") G.hint(c, "DRAG TO MOVE · AUTO-FIRE", 4);
  }
});