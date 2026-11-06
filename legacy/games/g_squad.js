function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
(function () {
  var KINDS = {
    sq: {
      e: "🐿️",
      pts: 50,
      dive: 100,
      hp: 1
    },
    cat: {
      e: "🐈",
      pts: 80,
      dive: 160,
      hp: 1
    },
    boss: {
      e: "🦝",
      pts: 150,
      dive: 400,
      hp: 2
    }
  };
  var COLS = 8;
  var bez = function bez(a, b, c, t) {
    return (1 - t) * (1 - t) * a + 2 * (1 - t) * t * b + t * t * c;
  };
  defGame({
    key: "squad",
    name: "Squirrel Squadron",
    icon: "🚀",
    max: 999999,
    blurb: "Blast the swooping squadron out of the sky.",
    how: "Slide your thumb anywhere to move the bulldog left and right. He fires bones on his own. Squirrels, cats and big raccoons fly in and line up; then they peel off and dive at you, dropping acorns. Don't get hit! Raccoons take two bones. Hitting a flier while it's diving is worth double (raccoons 400). Clear the sky to start the next wave. 3 lives, plus a bonus life at 20,000.",
    reset: function reset(G) {
      var stars = [];
      for (var i = 0; i < 60; i++) stars.push({
        x: Math.random(),
        y: Math.random(),
        v: 0.2 + Math.random() * 0.8,
        c: Math.random() < 0.3 ? "#ffd23f" : "#fff"
      });
      G.s = {
        px: G.W / 2,
        tx: null,
        keys: 0,
        lives: 3,
        score: 0,
        stage: 0,
        shots: [],
        nuts: [],
        en: [],
        fireT: 0,
        diveT: 3,
        inv: 2,
        dead: 0,
        stars: stars,
        sway: 0,
        fx: [],
        banner: 0,
        extra: false,
        msg: ""
      };
      this.wave(G);
    },
    gap: function gap(G) {
      return Math.min(42, (G.W - 50) / COLS);
    },
    slot: function slot(G, e) {
      var s = G.s,
        g = this.gap(G);
      return [G.W / 2 + (e.c - (COLS - 1) / 2) * g + Math.sin(s.sway) * Math.min(24, G.W * 0.05), 64 + e.r * g * 0.92];
    },
    wave: function wave(G) {
      var s = G.s;
      s.stage++;
      s.en = [];
      s.banner = 2;
      s.diveT = 3.5;
      var rows = [["boss", [2, 3, 4, 5]], ["cat", [0, 1, 2, 3, 4, 5, 6, 7]], ["cat", [0, 1, 2, 3, 4, 5, 6, 7]], ["sq", [0, 1, 2, 3, 4, 5, 6, 7]], ["sq", [0, 1, 2, 3, 4, 5, 6, 7]]];
      var n = 0;
      rows.forEach(function (_ref, r) {
        var _ref2 = _slicedToArray(_ref, 2),
          k = _ref2[0],
          cs = _ref2[1];
        return cs.forEach(function (c) {
          var grp = Math.floor(n / 6),
            left = grp % 2 === 0;
          s.en.push({
            k: k,
            r: r,
            c: c,
            hp: KINDS[k].hp,
            st: "enter",
            t: -grp * 0.9 - n % 6 * 0.13,
            sx: left ? -30 : G.W + 30,
            sy: G.H * 0.35,
            cx: left ? G.W * 0.85 : G.W * 0.15,
            cy: G.H * 0.62,
            x: -99,
            y: -99,
            shot: 0
          });
          n++;
        });
      });
    },
    hurt: function hurt(G) {
      var s = G.s;
      if (s.inv > 0 || s.dead > 0) return;
      s.lives--;
      s.dead = 1.6;
      G.sfx("lose");
      G.buzz();
      s.fx.push({
        x: s.px,
        y: G.H - 70,
        t: 0,
        e: "💥"
      });
      s.nuts = [];
    },
    update: function update(G, dt) {
      var _this = this;
      var s = G.s,
        W = G.W,
        H = G.H,
        py = H - 70,
        lvl = s.stage - 1;
      s.sway += dt * 0.9;
      s.banner = Math.max(0, s.banner - dt);
      s.stars.forEach(function (st) {
        st.y += st.v * dt * 0.12;
        if (st.y > 1) st.y -= 1;
      });
      if (s.dead > 0) {
        s.dead -= dt;
        if (s.dead <= 0) {
          if (s.lives <= 0) return G.over(s.score, s.stage > 3 ? "Wave ".concat(s.stage, ". Good dog.") : "Acorned! 🌰");
          s.px = W / 2;
          s.inv = 2;
          s.dead = 0;
        }
      } else {
        s.inv = Math.max(0, s.inv - dt);
        var want = s.keys ? s.px + s.keys * 400 * dt : s.tx;
        if (want != null) {
          var d = want - s.px,
            mv = 460 * dt;
          s.px += Math.abs(d) < mv ? d : Math.sign(d) * mv;
        }
        s.px = Math.max(22, Math.min(W - 22, s.px));
        s.fireT -= dt;
        if (s.fireT <= 0 && s.shots.length < 3 && s.banner < 1.2) {
          s.shots.push({
            x: s.px,
            y: py - 22
          });
          s.fireT = 0.32;
        }
      }
      s.shots.forEach(function (b) {
        return b.y -= 520 * dt;
      });
      s.shots = s.shots.filter(function (b) {
        return b.y > 30;
      });
      s.nuts.forEach(function (b) {
        b.x += b.vx * dt;
        b.y += b.vy * dt;
      });
      s.nuts = s.nuts.filter(function (b) {
        return b.y < H + 20;
      });
      var inForm = s.en.filter(function (e) {
        return e.st === "form";
      });
      s.diveT -= dt;
      if (s.diveT <= 0 && inForm.length && !s.dead) {
        var n = Math.min(inForm.length, 1 + (lvl > 1 && Math.random() < 0.5 ? 1 : 0) + (lvl > 3 && Math.random() < 0.4 ? 1 : 0));
        for (var i = 0; i < n; i++) {
          var e = inForm[Math.floor(Math.random() * inForm.length)];
          if (e.st !== "form") continue;
          e.st = "dive";
          e.t = 0;
          e.dir = e.x < s.px ? 1 : -1;
          e.shot = 0;
        }
        s.diveT = Math.max(0.7, 2.6 - lvl * 0.25 - (s.en.length < 10 ? 0.8 : 0)) * (0.7 + Math.random() * 0.6);
      }
      var spd = 1 + lvl * 0.08;
      s.en.forEach(function (e) {
        var _this$slot = _this.slot(G, e),
          _this$slot2 = _slicedToArray(_this$slot, 2),
          tx = _this$slot2[0],
          ty = _this$slot2[1];
        if (e.st === "enter") {
          e.t += dt * 0.75 * spd;
          if (e.t < 0) return;
          var t = Math.min(1, e.t);
          e.x = bez(e.sx, e.cx, tx, t);
          e.y = bez(e.sy, e.cy, ty, t);
          if (t >= 1) e.st = "form";
        } else if (e.st === "form") {
          e.x = tx;
          e.y = ty;
        } else if (e.st === "dive") {
          e.t += dt;
          var vy = (150 + lvl * 14) * (e.t < 0.5 ? -0.5 + e.t * 2.4 : 1),
            steer = (s.px - e.x) * (e.k === "boss" ? 1.6 : 1.1);
          e.x += (e.t < 0.6 ? e.dir * 110 : steer + Math.sin(e.t * 3) * 60) * dt;
          e.y += vy * dt;
          if (e.shot < 1 + (lvl > 2 ? 1 : 0) && e.y > H * 0.28 + e.shot * 60 && e.y < H * 0.6) {
            e.shot++;
            var a = Math.atan2(py - e.y, s.px - e.x);
            var v = 190 + lvl * 15;
            s.nuts.push({
              x: e.x,
              y: e.y + 10,
              vx: Math.cos(a) * v * 0.45,
              vy: Math.max(140, Math.sin(a) * v)
            });
          }
          if (e.y > H + 30) {
            e.st = "back";
            e.y = -30;
            e.x = tx;
          }
        } else if (e.st === "back") {
          e.y += 200 * dt;
          e.x += (tx - e.x) * Math.min(1, dt * 4);
          if (e.y >= ty) e.st = "form";
        }
      });
      s.shots.forEach(function (b) {
        var _iterator = _createForOfIteratorHelper(s.en),
          _step;
        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var _e = _step.value;
            if (_e.hp <= 0 || _e.st === "enter" && _e.t < 0) continue;
            if (Math.abs(b.x - _e.x) < 17 && Math.abs(b.y - _e.y) < 17) {
              b.y = -99;
              _e.hp--;
              if (_e.hp <= 0) {
                var k = KINDS[_e.k],
                  p = _e.st === "form" ? k.pts : k.dive;
                s.score += p;
                s.fx.push({
                  x: _e.x,
                  y: _e.y,
                  t: 0,
                  txt: _e.st !== "form" ? String(p) : null,
                  e: "✨"
                });
                G.sfx("pop");
              } else G.sfx("pop");
              break;
            }
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      });
      s.en = s.en.filter(function (e) {
        return e.hp > 0;
      });
      if (!s.dead && s.inv <= 0) {
        var _iterator2 = _createForOfIteratorHelper(s.en),
          _step2;
        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var _e2 = _step2.value;
            if ((_e2.st === "dive" || _e2.st === "back") && Math.abs(_e2.x - s.px) < 26 && Math.abs(_e2.y - py) < 24) {
              _e2.hp = 0;
              this.hurt(G);
              break;
            }
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }
        var _iterator3 = _createForOfIteratorHelper(s.nuts),
          _step3;
        try {
          for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
            var b = _step3.value;
            if (Math.abs(b.x - s.px) < 16 && Math.abs(b.y - py) < 18) {
              this.hurt(G);
              break;
            }
          }
        } catch (err) {
          _iterator3.e(err);
        } finally {
          _iterator3.f();
        }
        s.en = s.en.filter(function (e) {
          return e.hp > 0;
        });
      }
      if (!s.extra && s.score >= 20000) {
        s.extra = true;
        s.lives++;
        s.fx.push({
          x: W / 2,
          y: H / 2,
          t: 0,
          txt: "1UP!"
        });
        G.sfx("win");
      }
      s.fx.forEach(function (f) {
        return f.t += dt;
      });
      s.fx = s.fx.filter(function (f) {
        return f.t < 0.7;
      });
      if (!s.en.length && !s.dead) {
        s.score += 500 * s.stage;
        G.sfx("win");
        s.shots = [];
        s.nuts = [];
        this.wave(G);
      }
    },
    draw: function draw(G, c) {
      var s = G.s,
        W = G.W,
        H = G.H,
        py = H - 70;
      c.fillStyle = "#0b0b22";
      c.fillRect(0, 0, W, H);
      s.stars.forEach(function (st) {
        c.fillStyle = st.c;
        c.globalAlpha = 0.35 + st.v * 0.5;
        c.fillRect(st.x * W, st.y * H, 2, 2);
      });
      c.globalAlpha = 1;
      s.en.forEach(function (e) {
        if (e.st === "enter" && e.t < 0) return;
        var bob = e.st === "form" ? Math.sin(G.t * 6 + e.c) * 0.12 : 0;
        if (e.k === "boss" && e.hp === 1) {
          c.fillStyle = "rgba(255,80,80,0.35)";
          c.beginPath();
          c.arc(e.x, e.y, 15, 0, 7);
          c.fill();
        }
        c.save();
        c.translate(e.x, e.y);
        c.rotate(e.st === "dive" ? Math.PI : bob);
        G.emoji(c, KINDS[e.k].e, 0, 0, e.k === "boss" ? 30 : 25);
        c.restore();
      });
      c.fillStyle = "#fff8e1";
      s.shots.forEach(function (b) {
        return G.emoji(c, "🦴", b.x, b.y, 15);
      });
      s.nuts.forEach(function (b) {
        return G.emoji(c, "🌰", b.x, b.y, 14);
      });
      if (s.dead <= 0 && (s.inv <= 0 || Math.floor(G.t * 10) % 2)) G.img(c, ":dawgW:", s.px, py, 44);else if (s.dead > 0) G.img(c, ":dawgpain:", s.px, py, 44 * Math.max(0, s.dead - 0.6));
      s.fx.forEach(function (f) {
        c.globalAlpha = 1 - f.t / 0.7;
        if (f.e) G.emoji(c, f.e, f.x, f.y, 22 + f.t * 30);
        if (f.txt) G.text(c, f.txt, f.x, f.y - 18 - f.t * 30, 10, "#ffd23f");
      });
      c.globalAlpha = 1;
      G.hud(c, "".concat(s.score), "WAVE ".concat(s.stage), "🐶".repeat(Math.max(0, Math.min(5, s.lives))));
      if (s.banner > 0) G.banner(c, "WAVE ".concat(s.stage), "#ffd23f");
      G.hint(c, "SLIDE TO MOVE · AUTO-FIRE", 4);
    },
    down: function down(G, x) {
      G.s.tx = x;
    },
    move: function move(G, x) {
      G.s.tx = x;
    },
    up: function up(G) {},
    onKey: function onKey(G, k, d) {
      var s = G.s;
      if (k === "ArrowLeft") s.keys = d ? -1 : s.keys < 0 ? 0 : s.keys;
      if (k === "ArrowRight") s.keys = d ? 1 : s.keys > 0 ? 0 : s.keys;
      if (d && s.keys) s.tx = null;
    }
  });
})();