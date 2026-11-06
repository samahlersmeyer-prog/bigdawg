function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
defGame({
  key: "jump",
  name: "Pup Jump",
  icon: "🐶",
  max: 999999,
  blurb: "Bounce up forever. Don't look down.",
  how: "The pup bounces by itself. Hold the left or right side of the screen (or drag) to steer. Fly off one edge to come out the other. Bones launch you sky high, boxes break after one bounce. Land on cats and squirrels to bop them (+50), but don't bump into them. Don't fall!",
  reset: function reset(G) {
    var W = G.W,
      H = G.H;
    var s = G.s = {
      p: {
        x: W / 2,
        y: 40,
        vx: 0,
        vy: 0,
        sq: 0,
        face: ":dawgW:",
        spr: 0
      },
      plats: [],
      foes: [],
      pops: [],
      bits: [],
      cam: 0,
      top: 0,
      maxY: 0,
      bonus: 0,
      dir: 0,
      keyL: false,
      keyR: false,
      hold: 0,
      ax: 0,
      dragging: false,
      stars: [],
      clouds: []
    };
    s.GRAV = 1500;
    s.JUMP = 800;
    s.SPRING = 1450;
    for (var i = 0; i < 70; i++) s.stars.push({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() < 0.2 ? 2 : 1,
      tw: Math.random() * 6
    });
    for (var _i = 0; _i < 6; _i++) s.clouds.push({
      x: Math.random() * W,
      y: Math.random() * (H + 200),
      w: 50 + Math.random() * 50
    });
    s.plats.push({
      x: W / 2,
      y: 20,
      w: W * 0.5,
      t: "n",
      style: 0,
      vx: 0,
      broken: 0,
      spring: 0,
      fall: 0
    });
    s.top = 20;
    this.gen(G);
  },
  gen: function gen(G) {
    var s = G.s,
      W = G.W;
    while (s.top < s.cam + G.H + 260) {
      var h = s.top,
        lvl = Math.min(1, h / 22000);
      var maxGap = 165;
      var gap = Math.min(maxGap, 55 + lvl * 95 + Math.random() * (25 + lvl * 25));
      var y = h + gap;
      var w = Math.max(54, 84 - lvl * 30);
      var r = Math.random();
      var t = "n";
      if (h > 600 && r < 0.12 + lvl * 0.28) t = "m";else if (h > 1200 && r < 0.22 + lvl * 0.4) t = "c";
      var pl = {
        x: w / 2 + Math.random() * (W - w),
        y: y,
        w: w,
        t: t,
        style: Math.random() < 0.5 ? 0 : 1,
        vx: 0,
        broken: 0,
        spring: 0,
        fall: 0
      };
      if (t === "m") pl.vx = (Math.random() < 0.5 ? -1 : 1) * (50 + lvl * 90);
      if (t !== "c" && h > 300 && Math.random() < 0.07) pl.spring = 1;
      s.plats.push(pl);
      if (Math.random() < 0.35 - lvl * 0.15) {
        var w2 = w * 0.9,
          x2 = (pl.x + W / 2 + Math.random() * W * 0.3) % W;
        s.plats.push({
          x: Math.min(W - w2 / 2, Math.max(w2 / 2, x2)),
          y: y - gap * 0.5,
          w: w2,
          t: Math.random() < 0.4 ? "c" : "n",
          style: 1,
          vx: 0,
          broken: 0,
          spring: 0,
          fall: 0
        });
      }
      if (h > 2500 && Math.random() < 0.05 + lvl * 0.1 && h - (s.lastFoe || 0) > 500) {
        s.lastFoe = h;
        if (Math.random() < 0.5) {
          var cw = 64,
            cx = (pl.x + W / 2) % W,
            cp = {
              x: Math.min(W - cw / 2, Math.max(cw / 2, cx)),
              y: y - gap * 0.5,
              w: cw,
              t: "n",
              style: 0,
              vx: 0,
              broken: 0,
              spring: 0,
              fall: 0
            };
          s.plats.push(cp);
          s.foes.push({
            k: "cat",
            x: cp.x,
            y: cp.y + 18,
            vx: 0,
            pl: cp,
            dead: 0
          });
        } else s.foes.push({
          k: "sq",
          x: Math.random() * W,
          y: y + gap * 0.5 + 10,
          vx: (Math.random() < 0.5 ? -1 : 1) * (60 + lvl * 60),
          dead: 0,
          ph: Math.random() * 6
        });
      }
      s.top = y;
    }
  },
  update: function update(G, dt) {
    var s = G.s,
      p = s.p,
      W = G.W,
      H = G.H;
    var dir = s.dir;
    if (s.keyL && !s.keyR) dir = -1;else if (s.keyR && !s.keyL) dir = 1;
    var target = dir * 330;
    p.vx += (target - p.vx) * Math.min(1, dt * (dir ? 10 : 6));
    p.x += p.vx * dt;
    if (p.x < 0) p.x += W;else if (p.x >= W) p.x -= W;
    var oy = p.y;
    p.vy -= s.GRAV * dt;
    p.y += p.vy * dt;
    p.sq = Math.max(0, p.sq - dt * 3);
    p.spr = Math.max(0, p.spr - dt);
    var _iterator = _createForOfIteratorHelper(s.plats),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var _pl = _step.value;
        if (_pl.vx) {
          _pl.x += _pl.vx * dt;
          if (_pl.x < _pl.w / 2) {
            _pl.x = _pl.w / 2;
            _pl.vx = -_pl.vx;
          } else if (_pl.x > W - _pl.w / 2) {
            _pl.x = W - _pl.w / 2;
            _pl.vx = -_pl.vx;
          }
        }
        if (_pl.broken) {
          _pl.fall += dt;
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
    if (p.vy < 0) {
      var _iterator2 = _createForOfIteratorHelper(s.plats),
        _step2;
      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var pl = _step2.value;
          if (pl.broken) continue;
          if (oy >= pl.y - 1 && p.y <= pl.y) {
            var dx = Math.abs(p.x - pl.x);
            dx = Math.min(dx, W - dx);
            if (dx < pl.w / 2 + 14) {
              p.y = pl.y;
              p.sq = 1;
              var springHit = pl.spring && Math.abs(p.x - pl.x) < pl.w / 2 + 6;
              if (springHit) {
                p.vy = s.SPRING;
                p.spr = 1.2;
                pl.spring = 2;
                pl.sprT = 0.3;
                G.sfx("win");
              } else {
                p.vy = s.JUMP;
                G.sfx("pop");
              }
              if (pl.t === "c") {
                pl.broken = 1;
                for (var i = 0; i < 4; i++) s.bits.push({
                  x: pl.x + (i - 1.5) * pl.w / 4,
                  y: pl.y,
                  vx: (i - 1.5) * 40,
                  vy: 60,
                  r: (i - 1.5) * 0.3,
                  t: 1
                });
              }
              break;
            }
          }
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
    }
    var _iterator3 = _createForOfIteratorHelper(s.foes),
      _step3;
    try {
      for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
        var f = _step3.value;
        if (f.dead) {
          f.dead += dt;
          f.y -= 300 * dt;
          continue;
        }
        if (f.k === "cat") {
          f.x = f.pl.x;
          f.y = f.pl.y + 18;
          if (f.pl.broken) f.dead = 0.01;
        } else {
          f.ph += dt * 3;
          f.x += f.vx * dt;
          if (f.x < 20 || f.x > W - 20) {
            f.vx = -f.vx;
            f.x = Math.max(20, Math.min(W - 20, f.x));
          }
        }
        var cy = p.y + 20,
          fy = f.y + (f.k === "sq" ? Math.sin(f.ph) * 6 : 0);
        var _dx = Math.abs(p.x - f.x);
        _dx = Math.min(_dx, W - _dx);
        if (_dx < 27 && Math.abs(cy - fy) < 30) {
          if (p.vy < 0 && p.y > fy - 6) {
            f.dead = 0.01;
            p.vy = s.JUMP * 1.1;
            p.sq = 1;
            s.bonus += 50;
            G.sfx("win");
            s.pops.push({
              x: f.x,
              y: fy + 30,
              t: 0.9,
              txt: "+50"
            });
          } else {
            G.sfx("lose");
            G.buzz();
            p.face = ":dawgpain:";
            G.over(this.score(s), f.k === "cat" ? "Swatted by a cat!" : "Squirrel strike!");
            return;
          }
        }
      }
    } catch (err) {
      _iterator3.e(err);
    } finally {
      _iterator3.f();
    }
    s.maxY = Math.max(s.maxY, p.y);
    var want = p.y - H * 0.45;
    if (want > s.cam) s.cam = want;
    this.gen(G);
    var lo = s.cam - 120;
    if (s.plats.length && s.plats[0].y < lo) s.plats = s.plats.filter(function (pl) {
      return pl.y >= lo && pl.fall < 1.5;
    });
    if (s.foes.length) s.foes = s.foes.filter(function (f) {
      return f.y >= lo && f.dead < 1;
    });
    var _iterator4 = _createForOfIteratorHelper(s.bits),
      _step4;
    try {
      for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
        var b = _step4.value;
        b.t -= dt;
        b.vy -= 900 * dt;
        b.x += b.vx * dt;
        b.y += b.vy * dt;
      }
    } catch (err) {
      _iterator4.e(err);
    } finally {
      _iterator4.f();
    }
    if (s.bits.length) s.bits = s.bits.filter(function (b) {
      return b.t > 0;
    });
    var _iterator5 = _createForOfIteratorHelper(s.pops),
      _step5;
    try {
      for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
        var q = _step5.value;
        q.t -= dt;
      }
    } catch (err) {
      _iterator5.e(err);
    } finally {
      _iterator5.f();
    }
    if (s.pops.length) s.pops = s.pops.filter(function (q) {
      return q.t > 0;
    });
    var _iterator6 = _createForOfIteratorHelper(s.plats),
      _step6;
    try {
      for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
        var _pl2 = _step6.value;
        if (_pl2.sprT) {
          _pl2.sprT -= dt;
          if (_pl2.sprT <= 0) {
            _pl2.sprT = 0;
            _pl2.spring = 1;
          }
        }
      }
    } catch (err) {
      _iterator6.e(err);
    } finally {
      _iterator6.f();
    }
    p.face = p.spr > 0 ? ":dawgpog:" : p.vy < -900 ? ":dawgsweat:" : ":dawgW:";
    if (p.y < s.cam - 50) {
      p.face = ":dawgpain:";
      G.sfx("lose");
      G.buzz();
      var sc = this.score(s);
      G.over(sc, sc > 3000 ? "What a climb!" : sc > 1000 ? "Ruff landing." : "Don't look down!");
    }
  },
  score: function score(s) {
    return Math.min(999999, Math.floor(s.maxY / 10) + s.bonus);
  },
  down: function down(G, x) {
    var s = G.s;
    s.dir = x < G.W / 2 ? -1 : 1;
    s.ax = x;
    s.dragging = false;
  },
  move: function move(G, x) {
    var s = G.s,
      d = x - s.ax;
    if (Math.abs(d) > 16) {
      s.dragging = true;
      s.dir = d > 0 ? 1 : -1;
      s.ax = x - Math.sign(d) * 16;
    }
  },
  up: function up(G) {
    G.s.dir = 0;
    G.s.dragging = false;
  },
  onKey: function onKey(G, k, isDown) {
    if (k === "ArrowLeft" || k === "a") G.s.keyL = isDown;
    if (k === "ArrowRight" || k === "d") G.s.keyR = isDown;
  },
  draw: function draw(G, c) {
    var s = G.s,
      W = G.W,
      H = G.H,
      dark = G.dark(),
      cam = s.cam || 0;
    var sy = function sy(wy) {
      return H - (wy - cam);
    };
    var k = Math.min(1, cam / 25000);
    var mix = function mix(a, b, t) {
      return "rgb(".concat(a.map(function (v, i) {
        return Math.round(v + (b[i] - v) * t);
      }).join(","), ")");
    };
    var top0 = dark ? [20, 26, 70] : [70, 160, 240],
      top1 = dark ? [3, 3, 14] : [18, 16, 60];
    var bot0 = dark ? [45, 52, 110] : [170, 225, 255],
      bot1 = dark ? [14, 12, 40] : [70, 50, 130];
    var gr = c.createLinearGradient(0, 0, 0, H);
    gr.addColorStop(0, mix(top0, top1, k));
    gr.addColorStop(1, mix(bot0, bot1, k));
    c.fillStyle = gr;
    c.fillRect(0, 0, W, H);
    var sa = dark ? 0.35 + k * 0.65 : Math.max(0, (k - 0.25) * 1.4);
    if (sa > 0) {
      c.fillStyle = "#fff";
      var _iterator7 = _createForOfIteratorHelper(s.stars),
        _step7;
      try {
        for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
          var st = _step7.value;
          var yy = ((st.y + cam * 0.15) % H + H) % H;
          c.globalAlpha = sa * (0.6 + 0.4 * Math.sin(G.t * 2 + st.tw));
          c.fillRect(st.x, yy, st.r, st.r);
        }
      } catch (err) {
        _iterator7.e(err);
      } finally {
        _iterator7.f();
      }
      c.globalAlpha = 1;
    }
    var ca = (dark ? 0.18 : 0.85) * (1 - k * 0.8);
    if (ca > 0.02) {
      c.fillStyle = dark ? "rgba(180,190,230,".concat(ca, ")") : "rgba(255,255,255,".concat(ca, ")");
      var span = H + 200;
      var _iterator8 = _createForOfIteratorHelper(s.clouds),
        _step8;
      try {
        for (_iterator8.s(); !(_step8 = _iterator8.n()).done;) {
          var cl = _step8.value;
          var _yy = ((cl.y + cam * 0.35) % span + span) % span - 100;
          c.fillRect(cl.x - cl.w / 2, _yy, cl.w, 14);
          c.fillRect(cl.x - cl.w / 3, _yy - 10, cl.w * 0.55, 12);
          c.fillRect(cl.x - cl.w / 2 + 8, _yy + 14, cl.w - 16, 6);
        }
      } catch (err) {
        _iterator8.e(err);
      } finally {
        _iterator8.f();
      }
    }
    var _iterator9 = _createForOfIteratorHelper(s.plats),
      _step9;
    try {
      for (_iterator9.s(); !(_step9 = _iterator9.n()).done;) {
        var pl = _step9.value;
        var x = pl.x - pl.w / 2,
          y = sy(pl.y);
        if (y < -40 || y > H + 40) continue;
        if (pl.broken) continue;
        if (pl.t === "c") {
          c.fillStyle = "#6b4a24";
          c.fillRect(x, y, pl.w, 16);
          c.fillStyle = "#c99a5b";
          c.fillRect(x + 2, y + 2, pl.w - 4, 12);
          c.fillStyle = "#e6c48c";
          c.fillRect(x + 2, y + 2, pl.w - 4, 3);
          c.fillStyle = "#a07848";
          c.fillRect(pl.x - 5, y + 2, 10, 12);
          c.fillStyle = "#6b4a24";
          c.fillRect(x + 8, y + 9, 6, 1);
          c.fillRect(x + pl.w - 14, y + 7, 5, 1);
        } else if (pl.t === "m" || pl.style === 1) {
          var rim = pl.t === "m" ? "#2f6fd6" : "#d64a6b",
            cush = pl.t === "m" ? "#8fc0ff" : "#ffb3c6";
          c.fillStyle = "#222";
          c.beginPath();
          c.roundRect(x - 2, y - 2, pl.w + 4, 18, 9);
          c.fill();
          c.fillStyle = rim;
          c.beginPath();
          c.roundRect(x, y, pl.w, 14, 7);
          c.fill();
          c.fillStyle = cush;
          c.fillRect(x + 7, y + 2, pl.w - 14, 6);
          if (pl.t === "m") {
            c.fillStyle = "#fff";
            c.fillRect(x + 3, y + 5, 3, 3);
            c.fillRect(x + pl.w - 6, y + 5, 3, 3);
          }
        } else {
          c.fillStyle = "#4a2c12";
          c.fillRect(x - 1, y - 1, pl.w + 2, 15);
          c.fillStyle = "#b9773a";
          c.fillRect(x + 1, y + 1, pl.w - 2, 11);
          c.fillStyle = "#d8995a";
          c.fillRect(x + 1, y + 1, pl.w - 2, 3);
          c.fillStyle = "#7a4a1e";
          c.fillRect(x + pl.w * 0.33, y + 5, 2, 7);
          c.fillRect(x + pl.w * 0.66, y + 5, 2, 7);
          c.fillRect(x + 4, y + 6, 3, 3);
        }
        if (pl.spring) {
          var pr = pl.spring === 2 ? 0.75 : 1;
          c.save();
          c.translate(pl.x, y - 8 * pr);
          c.scale(1, pr);
          G.emoji(c, "🦴", 0, 0, 24);
          c.restore();
        }
      }
    } catch (err) {
      _iterator9.e(err);
    } finally {
      _iterator9.f();
    }
    c.fillStyle = "#c99a5b";
    var _iterator0 = _createForOfIteratorHelper(s.bits),
      _step0;
    try {
      for (_iterator0.s(); !(_step0 = _iterator0.n()).done;) {
        var b = _step0.value;
        c.globalAlpha = Math.max(0, b.t);
        c.save();
        c.translate(b.x, sy(b.y));
        c.rotate(b.r * (1 - b.t) * 4);
        c.fillRect(-8, 0, 16, 12);
        c.restore();
      }
    } catch (err) {
      _iterator0.e(err);
    } finally {
      _iterator0.f();
    }
    c.globalAlpha = 1;
    var _iterator1 = _createForOfIteratorHelper(s.foes),
      _step1;
    try {
      for (_iterator1.s(); !(_step1 = _iterator1.n()).done;) {
        var f = _step1.value;
        var _yy2 = sy(f.y + (f.k === "sq" && !f.dead ? Math.sin(f.ph) * 6 : 0));
        if (_yy2 < -40 || _yy2 > H + 40) continue;
        if (f.dead) c.globalAlpha = Math.max(0, 1 - f.dead);
        if (f.k === "cat") G.emoji(c, "🐈", f.x, _yy2, 34);else {
          G.emoji(c, "🐿️", f.x, _yy2, 32);
          if (!f.dead) {
            c.fillStyle = "rgba(170,110,60,0.8)";
            var fl = Math.sin(f.ph * 3) * 3;
            c.fillRect(f.x - 22, _yy2 - 2 + fl, 10, 4);
            c.fillRect(f.x + 12, _yy2 - 2 - fl, 10, 4);
          }
        }
        if (f.dead) {
          G.emoji(c, "💫", f.x, _yy2 - 20, 18);
          c.globalAlpha = 1;
        }
      }
    } catch (err) {
      _iterator1.e(err);
    } finally {
      _iterator1.f();
    }
    var p = s.p;
    if (p) {
      var size = 46,
        py = sy(p.y) - size / 2 + 4,
        q = p.sq * p.sq * 0.28;
      var drawDog = function drawDog(x) {
        c.save();
        c.translate(x, py + q * size * 0.5);
        c.scale(1 + q, 1 - q);
        G.img(c, p.face, 0, 0, size, p.vx * 0.0006);
        c.restore();
      };
      drawDog(p.x);
      if (p.x < size / 2) drawDog(p.x + W);else if (p.x > W - size / 2) drawDog(p.x - W);
      if (p.spr > 0.6) G.emoji(c, "✨", p.x + 20, py + 26, 16);
    }
    var _iterator10 = _createForOfIteratorHelper(s.pops),
      _step10;
    try {
      for (_iterator10.s(); !(_step10 = _iterator10.n()).done;) {
        var _q = _step10.value;
        G.text(c, _q.txt, _q.x, sy(_q.y) - (0.9 - _q.t) * 40, 12, "#ffd23f");
      }
    } catch (err) {
      _iterator10.e(err);
    } finally {
      _iterator10.f();
    }
    if (G.state === "play" && G.t < 4) {
      c.globalAlpha = 0.5 * Math.min(1, 4 - G.t);
      G.text(c, "◀ HOLD", 14, H - 22, 10, "#fff", "left");
      G.text(c, "HOLD ▶", W - 14, H - 22, 10, "#fff", "right");
      c.globalAlpha = 1;
    } else if (s.dir && G.state === "play") {
      c.fillStyle = "rgba(255,255,255,0.05)";
      c.fillRect(s.dir < 0 ? 0 : W / 2, 30, W / 2, H - 30);
    }
    c.fillStyle = "rgba(0,0,0,0.35)";
    c.fillRect(0, 0, W, 30);
    G.text(c, "SCORE ".concat(this.score(s)), 10, 15, 11, "#fff", "left");
    G.text(c, "".concat(Math.floor((s.maxY || 0) / 10), "m"), W - 10, 15, 11, "#ffd23f", "right");
  }
});