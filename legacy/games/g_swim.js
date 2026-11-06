function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
(function () {
  var BEAT = 0.4,
    PERF = 0.075,
    GOOD_LO = 0.23,
    GOOD_HI = 0.62,
    TOO_FAST = 0.12;
  var LEN = 25,
    DIST = 50,
    BREATH_N = 6;
  var PTS = [1000, 600, 300, 100];
  var ORD = ["1ST", "2ND", "3RD", "4TH"];
  var HEATS = ["HEAT 1", "SEMIFINAL", "FINAL"];
  var SPEEDS = [[1.42, 1.54, 1.66], [1.66, 1.8, 1.92], [1.92, 2.04, 2.14]];
  var rnd = function rnd(a, b) {
    return a + Math.random() * (b - a);
  };
  var clamp = function clamp(v, a, b) {
    return v < a ? a : v > b ? b : v;
  };
  function lay(G) {
    var W = G.W,
      H = G.H;
    var cH = clamp(H * 0.17, 82, 104),
      ctrlTop = H - cH;
    var poolTop = 38,
      poolBot = ctrlTop - 4,
      px = 6,
      pw = W - 12;
    var br = Math.min(38, cH * 0.42);
    return {
      cH: cH,
      ctrlTop: ctrlTop,
      poolTop: poolTop,
      poolBot: poolBot,
      px: px,
      pw: pw,
      laneW: pw / 4,
      top: poolTop + 22,
      bot: poolBot - 30,
      bx: W / 2,
      by: ctrlTop + cH * 0.56,
      br: br
    };
  }
  var laneX = function laneX(L, lane) {
    return L.px + L.laneW * (lane + 0.5);
  };
  function yAt(L, pos) {
    var leg = pos <= LEN ? pos : DIST - pos;
    return L.bot - leg / LEN * (L.bot - L.top);
  }
  function newHeat(G) {
    var s = G.s,
      h = s.heat;
    s.phase = "ready";
    s.pt = 2.6;
    s.time = 0;
    s.pos = 0;
    s.v = 0;
    s.p = 0.3;
    s.last = "";
    s.lastT = -9;
    s.stum = 0;
    s.brT = 0;
    s.sb = 0;
    s.burst = 0;
    s.turned = false;
    s.wall = 0;
    s.fin = -1;
    s.finWait = 0;
    s.stroke = 0;
    s.strokeSide = 0;
    s.face = ":dawgW:";
    s.msg = null;
    s.pops = [];
    s.splash = [];
    s.results = null;
    s.perfects = 0;
    var sp = SPEEDS[h].map(function (v) {
      return v + rnd(-0.03, 0.03);
    }).sort(function () {
      return Math.random() - 0.5;
    });
    s.riv = [{
      lane: 0,
      e: "🐈",
      name: "CAT",
      base: sp[0]
    }, {
      lane: 2,
      e: "🦆",
      name: "DUCK",
      base: sp[1]
    }, {
      lane: 3,
      e: "🦦",
      name: "OTTER",
      base: sp[2]
    }];
    var _iterator = _createForOfIteratorHelper(s.riv),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var r = _step.value;
        r.pos = 0;
        r.v = 0;
        r.fin = -1;
        r.turned = false;
        r.tw = 0;
        r.ph = rnd(0, 6);
        r.str = 0;
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  }
  function say(G, txt, col, t) {
    G.s.msg = {
      txt: txt,
      col: col,
      t: t || 0.9
    };
  }
  function pop(G, txt, col) {
    var s = G.s,
      L = lay(G);
    if (s.pops.length < 8) s.pops.push({
      txt: txt,
      col: col,
      x: laneX(L, 1) + 34,
      y: yAt(L, s.pos),
      t: 0.7
    });
  }
  function splashAt(G, x, y, n, big) {
    var sp = G.s.splash;
    for (var i = 0; i < n && sp.length < 90; i++) {
      var a = rnd(0, 6.283),
        v = rnd(20, big ? 110 : 60);
      sp.push({
        x: x,
        y: y,
        vx: Math.cos(a) * v,
        vy: Math.sin(a) * v,
        t: rnd(0.25, big ? 0.7 : 0.45)
      });
    }
  }
  var swimming = function swimming(s) {
    return s.phase === "swim" && s.fin < 0 && s.wall <= 0;
  };
  function slip(G, why) {
    var s = G.s,
      L = lay(G);
    s.stum = 0.45;
    s.p *= 0.6;
    s.v *= 0.6;
    s.last = "";
    s.burst = 0;
    splashAt(G, laneX(L, 1), yAt(L, s.pos), 14, true);
    say(G, "SLIP!", "#ff6b6b", 0.7);
    s.sub = why;
    s.face = ":dawgsweat:";
    G.sfx("lose");
    G.buzz();
  }
  function stroke(G, side) {
    var s = G.s;
    if (s.phase === "res") {
      advance(G);
      return;
    }
    if (!swimming(s) || s.stum > 0) return;
    var i = s.time - s.lastT;
    if (side === s.last) {
      slip(G, "SAME PAW TWICE");
      return;
    }
    if (s.last && i < TOO_FAST) {
      slip(G, "TOO FAST - FIND THE BEAT");
      return;
    }
    var q;
    if (!s.last) q = 0.6;else if (Math.abs(i - BEAT) <= PERF) {
      q = 1;
      s.burst = 0.35;
      s.perfects++;
      pop(G, "PERFECT", "#7dff7a");
      G.sfx("pop");
    } else if (i >= GOOD_LO && i <= GOOD_HI) q = 0.68;else {
      q = 0.42;
      pop(G, i < BEAT ? "EARLY" : "LATE", "#ffd23f");
    }
    s.p += (q - s.p) * 0.24;
    s.v += 0.1 * q;
    s.last = side;
    s.lastT = s.time;
    s.stroke = 0.22;
    s.strokeSide = side === "L" ? -1 : 1;
    s.sb++;
    var L = lay(G);
    splashAt(G, laneX(L, 1) + s.strokeSide * 16, yAt(L, s.pos) + (s.pos > LEN ? 14 : -14), 4, false);
    if (s.face === ":dawgsweat:" && s.sb < BREATH_N + 2) s.face = ":dawgW:";
  }
  function breath(G) {
    var s = G.s;
    if (s.phase === "res") {
      advance(G);
      return;
    }
    if (!swimming(s) || s.brT > 0) return;
    var early = s.sb < 3;
    s.sb = 0;
    s.brT = 0.25;
    s.v *= early ? 0.82 : 0.93;
    s.last = "";
    s.lastT = s.time;
    s.face = ":dawgpog:";
    say(G, early ? "TOO SOON" : "GULP!", early ? "#ff9f43" : "#5ad1ff", 0.55);
    G.sfx("pop");
  }
  function turn(G) {
    var s = G.s,
      L = lay(G);
    if (s.phase !== "swim" || s.turned || s.fin >= 0) return;
    var d = LEN - s.pos;
    if (s.wall <= 0 && d > 3.2) return;
    var q = s.wall > 0 ? 0.15 : d < 1.1 ? 1 : d < 2.1 ? 0.6 : 0.3;
    s.turned = true;
    s.wall = 0;
    s.pos = LEN + 0.01;
    s.v = 1.1 + 1.9 * q;
    s.last = "";
    s.lastT = s.time;
    splashAt(G, laneX(L, 1), L.top, 18, true);
    if (q === 1) {
      say(G, "FLIP TURN!", "#7dff7a", 0.9);
      G.sfx("win");
      s.face = ":dawgpog:";
    } else if (q >= 0.6) {
      say(G, "GOOD TURN", "#ffd23f", 0.8);
      G.sfx("pop");
    } else {
      say(G, q > 0.2 ? "EARLY TURN" : "SLOW TURN", "#ff9f43", 0.8);
      G.sfx("lose");
    }
  }
  function finishHeat(G) {
    var s = G.s;
    var proj = function proj(pos, v) {
      return s.time + (DIST - pos) / Math.max(0.5, v);
    };
    var all = [{
      name: "YOU",
      you: true,
      time: s.fin >= 0 ? s.fin : proj(s.pos, s.v)
    }];
    var _iterator2 = _createForOfIteratorHelper(s.riv),
      _step2;
    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        var r = _step2.value;
        all.push({
          name: r.name,
          e: r.e,
          time: r.fin >= 0 ? r.fin : proj(r.pos, r.v)
        });
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }
    all.sort(function (a, b) {
      return a.time - b.time;
    });
    var place = all.findIndex(function (o) {
        return o.you;
      }),
      yt = all[place].time;
    var bonus = Math.max(0, Math.round((40 - yt) * 15));
    var pts = PTS[place] + bonus;
    s.score = Math.min(9999, s.score + pts);
    s.results = {
      all: all,
      place: place,
      pts: pts,
      bonus: bonus
    };
    s.phase = "res";
    s.pt = 0;
    s.flash = 0.3;
    s.face = place === 0 ? ":dawgpog:" : place === 1 ? ":dawgW:" : ":dawgpain:";
    if (place <= 1) G.sfx("win");else {
      G.sfx("lose");
      G.buzz();
    }
  }
  function advance(G) {
    var s = G.s;
    if (s.phase !== "res" || s.pt < 1.2) return;
    var r = s.results;
    if (r.place > 1 || s.heat >= 2) {
      end(G);
      return;
    }
    s.heat++;
    newHeat(G);
  }
  function end(G) {
    var s = G.s,
      r = s.results,
      h = s.heat;
    var t;
    if (h === 2 && r.place === 0) t = "Gold medal pup!";else if (h === 2 && r.place === 1) t = "Silver dawg!";else if (h === 2) t = "Finalist. Proud pup.";else if (r.place === 3) t = "Sank like a stone.";else t = h === 0 ? "Out in the heats." : "So close. Semifinalist.";
    G.over(Math.min(9999, s.score), t);
  }
  defGame({
    key: "swim",
    name: "Doggy Paddle",
    icon: "🏊",
    max: 9999,
    cat: "sports",
    blurb: "Race the pool. Tap left, right, left, right.",
    how: "Tap the LEFT and RIGHT halves of the screen one after the other. Same side twice or mashing = SLIP. Tap when the shrinking ring hits your pup for a PERFECT stroke. Every 6 strokes tap the blue BREATH button or you slow down. At the far wall, SWIPE DOWN for a flip turn. 50m per heat: Heat 1, Semifinal, Final. Top 2 advance. 1000/600/300/100 per heat + time bonus. Keys: ← → strokes, space = breath, ↓ = turn.",
    reset: function reset(G) {
      G.s = {
        heat: 0,
        score: 0,
        flash: 0,
        sub: ""
      };
      newHeat(G);
    },
    update: function update(G, dt) {
      var s = G.s,
        L = lay(G);
      if (s.flash > 0) s.flash -= dt;
      if (s.msg) {
        s.msg.t -= dt;
        if (s.msg.t <= 0) s.msg = null;
      }
      for (var i = s.splash.length - 1; i >= 0; i--) {
        var q = s.splash[i];
        q.t -= dt;
        q.x += q.vx * dt;
        q.y += q.vy * dt;
        q.vx *= 0.92;
        q.vy *= 0.92;
        if (q.t <= 0) s.splash.splice(i, 1);
      }
      for (var _i = s.pops.length - 1; _i >= 0; _i--) {
        s.pops[_i].t -= dt;
        if (s.pops[_i].t <= 0) s.pops.splice(_i, 1);
      }
      if (s.stroke > 0) s.stroke -= dt;
      if (s.phase === "ready") {
        s.pt -= dt;
        if (s.pt <= 0) {
          s.phase = "swim";
          s.time = 0;
          s.lastT = -9;
          say(G, "GO!", "#7dff7a", 0.7);
          G.sfx("pop");
        }
        return;
      }
      if (s.phase === "res") {
        s.pt += dt;
        var lim = s.results.place > 1 || s.heat >= 2 ? 7 : 5;
        if (s.pt > lim) advance(G);
        return;
      }
      s.time += dt;
      var ramp = Math.min(1, s.time / 2);
      var _iterator3 = _createForOfIteratorHelper(s.riv),
        _step3;
      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var r = _step3.value;
          if (r.fin >= 0) {
            r.v = 0;
            continue;
          }
          if (r.tw > 0) {
            r.tw -= dt;
            r.v = 0.3;
            if (r.tw <= 0) r.v = r.base * 1.25;
          } else r.v += (r.base * ramp * (1 + 0.06 * Math.sin(s.time * 0.8 + r.ph)) - r.v) * Math.min(1, dt * 2.5);
          r.pos += r.v * dt;
          r.str += dt * (3 + r.v * 2);
          if (!r.turned && r.pos >= LEN) {
            r.turned = true;
            r.pos = LEN + 0.01;
            r.tw = 0.5;
          }
          if (r.pos >= DIST) {
            r.fin = s.time - (r.pos - DIST) / Math.max(0.1, r.v);
            r.pos = DIST;
          }
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }
      if (s.fin < 0) {
        if (s.stum > 0) s.stum -= dt;
        if (s.brT > 0) s.brT -= dt;
        if (s.burst > 0) s.burst -= dt;
        if (s.time - s.lastT > 0.75) s.p = Math.max(0, s.p - 0.6 * dt);
        if (s.wall > 0) {
          s.wall -= dt;
          s.v = 0;
          if (s.wall <= 0) {
            s.wall = 0.001;
            turn(G);
          }
        } else {
          var tgt = 0.55 + 2.0 * s.p;
          if (s.burst > 0) tgt += 0.3;
          if (s.sb >= BREATH_N + 2) tgt *= 0.55;
          if (s.stum > 0) tgt = 0.3;
          if (s.brT > 0) tgt *= 0.8;
          if (s.time < 0.5 && !s.last && s.sb === 0) tgt = Math.min(tgt, 0.2);
          s.v += (tgt - s.v) * Math.min(1, dt * 2.6);
          s.pos += s.v * dt;
          if (s.sb >= BREATH_N + 2 && s.face !== ":dawgsweat:") s.face = ":dawgsweat:";
          if (!s.turned && s.pos >= LEN) {
            s.pos = LEN;
            s.wall = 0.7;
            s.v = 0;
            say(G, "MISSED TURN", "#ff6b6b", 0.8);
            G.buzz();
          }
          if (s.pos >= DIST) {
            s.fin = s.time - (s.pos - DIST) / Math.max(0.1, s.v);
            s.pos = DIST;
            s.v = 0;
            splashAt(G, laneX(L, 1), yAt(L, DIST), 20, true);
            G.sfx("pop");
          }
        }
      }
      var done = 0;
      var _iterator4 = _createForOfIteratorHelper(s.riv),
        _step4;
      try {
        for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
          var _r = _step4.value;
          if (_r.fin >= 0) done++;
        }
      } catch (err) {
        _iterator4.e(err);
      } finally {
        _iterator4.f();
      }
      if (s.fin >= 0) {
        s.finWait += dt;
        if (done === 3 || s.finWait > 2.2) finishHeat(G);
      } else if (done === 3) finishHeat(G);else if (s.time > 90) finishHeat(G);
    },
    tap: function tap(G, x, y) {
      var s = G.s,
        L = lay(G);
      if (s.phase === "res") {
        advance(G);
        return;
      }
      if (Math.hypot(x - L.bx, y - L.by) < L.br + 14) {
        breath(G);
        return;
      }
      stroke(G, x < G.W / 2 ? "L" : "R");
    },
    swipe: function swipe(G, dx, dy) {
      var s = G.s;
      if (s.phase === "res") {
        advance(G);
        return;
      }
      if (dy !== 0) turn(G);
    },
    onKey: function onKey(G, k, d) {
      if (!d) return;
      if (k === "ArrowLeft" || k === "a") stroke(G, "L");else if (k === "ArrowRight" || k === "d") stroke(G, "R");else if (k === " " || k === "ArrowUp" || k === "w") breath(G);else if (k === "ArrowDown" || k === "s") {
        if (G.s.phase === "res") advance(G);else turn(G);
      }
    },
    draw: function draw(G, c) {
      var s = G.s,
        W = G.W,
        H = G.H,
        dark = G.dark(),
        L = lay(G);
      c.fillStyle = dark ? "#2a2f45" : "#e9dcc3";
      c.fillRect(0, 0, W, H);
      c.fillStyle = dark ? "#353b56" : "#dccdaf";
      for (var y = 0; y < L.poolBot + 6; y += 16) for (var x = y / 16 % 2 * 8; x < W; x += 16) c.fillRect(x, y, 8, 8);
      var ph = L.poolBot - L.poolTop;
      c.fillStyle = dark ? "#0d4f8a" : "#2fa7e6";
      c.fillRect(L.px, L.poolTop, L.pw, ph);
      c.fillStyle = dark ? "#11609f" : "#4bb8ef";
      for (var i = 0; i < 10; i++) {
        var _y = L.poolTop + (i * 37 + G.t * 14) % ph;
        for (var _x = L.px + i * 23 % 40; _x < L.px + L.pw - 20; _x += 46) c.fillRect(_x, _y, 20, 3);
      }
      c.strokeStyle = dark ? "#cfd8ff" : "#fff";
      c.lineWidth = 4;
      c.strokeRect(L.px, L.poolTop, L.pw, ph);
      c.fillStyle = dark ? "rgba(0,20,60,0.55)" : "rgba(10,60,120,0.35)";
      for (var _i2 = 0; _i2 < 4; _i2++) {
        var _x2 = laneX(L, _i2);
        c.fillRect(_x2 - 3, L.top, 6, L.bot - L.top);
        c.fillRect(_x2 - 12, L.top, 24, 5);
        c.fillRect(_x2 - 12, L.bot - 5, 24, 5);
      }
      for (var _i3 = 1; _i3 < 4; _i3++) {
        var _x3 = L.px + L.laneW * _i3;
        for (var _y2 = L.poolTop + 4, j = 0; _y2 < L.poolBot - 4; _y2 += 9, j++) {
          var endz = _y2 < L.poolTop + 40 || _y2 > L.poolBot - 44;
          c.fillStyle = endz ? "#ff4d4d" : j % 2 ? "#ffd23f" : "#fff";
          c.beginPath();
          c.arc(_x3, _y2 + 4, 3.5, 0, 7);
          c.fill();
        }
      }
      var flagY = L.top + 26;
      c.strokeStyle = "rgba(255,255,255,0.5)";
      c.lineWidth = 1;
      c.beginPath();
      c.moveTo(L.px, flagY);
      c.lineTo(L.px + L.pw, flagY);
      c.stroke();
      for (var _x4 = L.px + 6, _j = 0; _x4 < L.px + L.pw; _x4 += 14, _j++) {
        c.fillStyle = _j % 2 ? "#ff4d4d" : "#fff";
        c.beginPath();
        c.moveTo(_x4, flagY);
        c.lineTo(_x4 + 8, flagY);
        c.lineTo(_x4 + 4, flagY + 7);
        c.fill();
      }
      for (var _i4 = 0; _i4 < 4; _i4++) {
        var _x5 = laneX(L, _i4);
        c.fillStyle = _i4 === 1 ? "#ffd23f" : dark ? "#c8cde0" : "#f4f4f4";
        c.fillRect(_x5 - 13, L.poolBot - 15, 26, 15);
        G.text(c, String(_i4 + 1), _x5, L.poolBot - 7, 10, "#333");
      }
      if (s.phase === "swim" && !s.turned && s.fin < 0 && LEN - s.pos < 3.2) {
        var _x6 = laneX(L, 1),
          y1 = yAt(L, LEN - 1.1),
          y2 = yAt(L, LEN);
        c.fillStyle = Math.sin(G.t * 16) > 0 ? "rgba(125,255,122,0.45)" : "rgba(125,255,122,0.25)";
        c.fillRect(_x6 - L.laneW / 2 + 4, y2 - 14, L.laneW - 8, y1 - y2 + 14);
      }
      var rs = Math.min(30, L.laneW * 0.55);
      var _iterator5 = _createForOfIteratorHelper(s.riv),
        _step5;
      try {
        for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
          var _r2 = _step5.value;
          var _x7 = laneX(L, _r2.lane),
            _y4 = yAt(L, _r2.pos),
            fy = _r2.pos > LEN ? 1 : -1;
          if (_r2.v > 0.3 && _r2.fin < 0) wake(c, _x7, _y4, fy, _r2.v);
          var sw = Math.sin(_r2.str * 3);
          if (_r2.fin < 0 && s.phase !== "ready") {
            c.fillStyle = "rgba(255,255,255,0.85)";
            c.beginPath();
            c.arc(_x7 - 13, _y4 + fy * 9 + sw * 5, 3.5, 0, 7);
            c.fill();
            c.beginPath();
            c.arc(_x7 + 13, _y4 + fy * 9 - sw * 5, 3.5, 0, 7);
            c.fill();
          }
          G.emoji(c, _r2.e, _x7, _y4 + Math.sin(G.t * 6 + _r2.ph) * 1.5, rs);
          if (s.phase === "ready") G.text(c, _r2.name, _x7, _y4 - 26, 10, "#fff");
        }
      } catch (err) {
        _iterator5.e(err);
      } finally {
        _iterator5.f();
      }
      var px = laneX(L, 1),
        py = yAt(L, s.pos),
        fwd = s.pos > LEN ? 1 : -1,
        sz = Math.min(42, L.laneW * 0.62);
      if (s.v > 0.3) wake(c, px, py, fwd, s.v);
      c.fillStyle = dark ? "#b07b48" : "#c98f55";
      c.beginPath();
      c.ellipse(px, py - fwd * sz * 0.45, sz * 0.3, sz * 0.48, 0, 0, 7);
      c.fill();
      var k = s.stroke > 0 ? s.stroke / 0.22 : 0,
        idle = Math.sin(G.t * 5) * 2;
      c.fillStyle = dark ? "#e5c9a8" : "#f2dcc0";
      c.strokeStyle = "#6b4423";
      c.lineWidth = 1.5;
      for (var sd = -1; sd <= 1; sd += 2) {
        var _rr = s.strokeSide === sd ? k : 0;
        var ax = px + sd * sz * 0.5,
          ay = py + fwd * (sz * 0.18 + _rr * sz * 0.35) + sd * idle;
        c.beginPath();
        c.arc(ax, ay, sz * 0.13, 0, 7);
        c.fill();
        c.stroke();
      }
      if (swimming(s) && s.last && s.stum <= 0) {
        var _i5 = s.time - s.lastT,
          r0 = sz * 0.62;
        if (_i5 < BEAT + PERF + 0.15) {
          var perfect = Math.abs(_i5 - BEAT) <= PERF;
          c.strokeStyle = "rgba(255,255,255,0.7)";
          c.lineWidth = 2;
          c.beginPath();
          c.arc(px, py, r0, 0, 7);
          c.stroke();
          var _rr2 = r0 + Math.max(0, 1 - _i5 / BEAT) * sz * 1.1;
          c.strokeStyle = perfect ? "#7dff7a" : _i5 > BEAT ? "#ff9f43" : "#ffd23f";
          c.lineWidth = perfect ? 5 : 3;
          c.beginPath();
          c.arc(px, py, _rr2, 0, 7);
          c.stroke();
        }
      }
      G.img(c, s.face, px, py, sz);
      if (s.stum > 0) G.text(c, "!!", px + sz * 0.5, py - sz * 0.5, 10, "#ff6b6b");
      if (s.phase === "swim" && s.fin < 0) {
        var pl = 1;
        var _iterator6 = _createForOfIteratorHelper(s.riv),
          _step6;
        try {
          for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
            var r = _step6.value;
            if (r.pos > s.pos || r.fin >= 0) pl++;
          }
        } catch (err) {
          _iterator6.e(err);
        } finally {
          _iterator6.f();
        }
        var ly = py - fwd * sz * 1.05;
        if (ly < L.poolTop + 12) ly = py + sz * 1.05;
        G.text(c, ORD[pl - 1], px, ly, 10, pl <= 2 ? "#7dff7a" : "#ffd23f");
      }
      if (s.phase === "ready") G.text(c, "YOU", px, py - 28, 10, "#ffd23f");
      c.fillStyle = "#fff";
      var _iterator7 = _createForOfIteratorHelper(s.splash),
        _step7;
      try {
        for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
          var q = _step7.value;
          c.globalAlpha = Math.min(1, q.t * 3);
          c.fillRect(q.x - 2, q.y - 2, 4, 4);
        }
      } catch (err) {
        _iterator7.e(err);
      } finally {
        _iterator7.f();
      }
      c.globalAlpha = 1;
      var _iterator8 = _createForOfIteratorHelper(s.pops),
        _step8;
      try {
        for (_iterator8.s(); !(_step8 = _iterator8.n()).done;) {
          var p = _step8.value;
          c.globalAlpha = Math.min(1, p.t * 3);
          G.text(c, p.txt, p.x, p.y - (0.7 - p.t) * 30, 10, p.col, "left");
        }
      } catch (err) {
        _iterator8.e(err);
      } finally {
        _iterator8.f();
      }
      c.globalAlpha = 1;
      var midY = (L.top + L.bot) / 2;
      if (s.phase === "ready") {
        var t = s.pt,
          txt = t > 1.7 ? "ON YOUR MARKS" : t > 0.8 ? "SET..." : "...";
        c.fillStyle = "rgba(0,0,0,0.6)";
        c.fillRect(0, midY - 48, W, 96);
        G.banner(c, HEATS[s.heat], "#ffd23f", midY - 24, 20);
        G.text(c, "50M · TOP 2 ADVANCE", W / 2, midY + 2, 10, "#fff");
        G.text(c, txt, W / 2, midY + 26, 13, "#7dff7a");
      } else if (s.phase === "swim" && !s.turned && s.fin < 0 && (LEN - s.pos < 3.2 || s.wall > 0)) {
        var by = midY - 40;
        c.fillStyle = "rgba(0,0,0,0.6)";
        c.fillRect(0, by - 24, W, 56);
        G.banner(c, "TURN! SWIPE ⬇", LEN - s.pos < 1.1 ? "#7dff7a" : "#ffd23f", by - 4, 18);
        G.text(c, "FLIP IN THE GREEN ZONE", W / 2, by + 20, 10, "#fff");
      } else if (s.msg) {
        var m = s.msg,
          _y3 = midY + (s.pos > 15 && s.pos < 35 ? 60 : 0),
          _slip = m.txt === "SLIP!";
        c.fillStyle = "rgba(0,0,0,0.45)";
        c.fillRect(0, _y3 - 24, W, _slip ? 60 : 46);
        G.banner(c, m.txt, m.col, _y3 - 2, 22);
        if (_slip) G.text(c, s.sub, W / 2, _y3 + 24, 10, "#fff");
      }
      if (s.heat === 0 && s.phase !== "res") G.hint(c, "TAP LEFT, RIGHT, LEFT, RIGHT", 6.5, midY + 76);
      if (s.phase === "res" && s.results) results(G, c, L, s);
      if (s.flash > 0) {
        c.fillStyle = "rgba(255,255,255,".concat(s.flash * 2, ")");
        c.fillRect(0, 0, W, H);
      }
      controls(G, c, L, s, dark);
      var tm = s.phase === "ready" ? 0 : s.fin >= 0 ? s.fin : s.phase === "res" ? s.results.all.find(function (o) {
        return o.you;
      }).time : s.time;
      G.hud(c, HEATS[s.heat], tm.toFixed(2) + "s", "SCORE ".concat(s.score));
    }
  });
  function wake(c, x, y, fwd, v) {
    c.strokeStyle = "rgba(255,255,255,0.5)";
    c.lineWidth = 2;
    var len = 8 + v * 7;
    c.beginPath();
    c.moveTo(x - 9, y - fwd * 10);
    c.lineTo(x - 9 - len * 0.45, y - fwd * (10 + len));
    c.moveTo(x + 9, y - fwd * 10);
    c.lineTo(x + 9 + len * 0.45, y - fwd * (10 + len));
    c.stroke();
  }
  function rr(c, x, y, w, h, r) {
    c.beginPath();
    c.moveTo(x + r, y);
    c.lineTo(x + w - r, y);
    c.quadraticCurveTo(x + w, y, x + w, y + r);
    c.lineTo(x + w, y + h - r);
    c.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    c.lineTo(x + r, y + h);
    c.quadraticCurveTo(x, y + h, x, y + h - r);
    c.lineTo(x, y + r);
    c.quadraticCurveTo(x, y, x + r, y);
    c.closePath();
  }
  function controls(G, c, L, s, dark) {
    var W = G.W,
      y = L.ctrlTop,
      h = L.cH;
    c.fillStyle = dark ? "#151827" : "#cbbd9f";
    c.fillRect(0, y, W, G.H - y);
    var sw = swimming(s);
    var next = sw ? s.last === "L" ? "R" : s.last === "R" ? "L" : "" : "";
    var pad = function pad(x0, side, label) {
      var bw = W / 2 - 10,
        hot = sw && (next === side || !next && Math.sin(G.t * 6) * (side === "L" ? 1 : -1) > 0);
      var pressed = s.stroke > 0.1 && s.strokeSide === (side === "L" ? -1 : 1);
      c.fillStyle = "rgba(0,0,0,0.3)";
      rr(c, x0 + 2, y + 8, bw, h - 12, 14);
      c.fill();
      c.fillStyle = hot ? "#e63946" : dark ? "#5a2a33" : "#b9737a";
      rr(c, x0, y + (pressed ? 8 : 5), bw, h - 12, 14);
      c.fill();
      if (hot) {
        c.strokeStyle = "#fff";
        c.lineWidth = 3;
        rr(c, x0, y + 5, bw, h - 12, 14);
        c.stroke();
      }
      var cx = side === "L" ? x0 + (bw - L.br) / 2 - 4 : x0 + L.br + (bw - L.br) / 2 + 4;
      G.text(c, label, cx, y + h * 0.36, 10, "#fff");
      G.emoji(c, "🐾", cx, y + h * 0.66, 18);
    };
    pad(6, "L", "◀ LEFT");
    pad(W / 2 + 4, "R", "RIGHT ▶");
    var need = sw && s.sb >= BREATH_N,
      gasp = sw && s.sb >= BREATH_N + 2,
      blink = need && Math.sin(G.t * 14) > 0;
    c.fillStyle = "rgba(0,0,0,0.35)";
    c.beginPath();
    c.arc(L.bx + 2, L.by + 3, L.br + 2, 0, 7);
    c.fill();
    c.fillStyle = gasp ? blink ? "#ff4d4d" : "#ff9f43" : need ? blink ? "#ff9f43" : "#1d6fb8" : "#1d6fb8";
    c.beginPath();
    c.arc(L.bx, L.by + (s.brT > 0 ? 2 : 0), L.br, 0, 7);
    c.fill();
    c.strokeStyle = "#fff";
    c.lineWidth = need ? 4 : 2;
    c.stroke();
    G.text(c, "BREATH", L.bx, L.by - 8, 10, "#fff");
    G.emoji(c, "🫧", L.bx, L.by + 13, 16);
    var left = Math.max(0, BREATH_N - s.sb),
      pw = 7,
      gx = L.bx - BREATH_N * (pw + 2) / 2 + 1,
      gy = L.by - L.br - 14;
    c.fillStyle = "#11141f";
    rr(c, gx - 5, gy - 4, BREATH_N * (pw + 2) + 8, 13, 6);
    c.fill();
    for (var i = 0; i < BREATH_N; i++) {
      c.fillStyle = i < left ? "#5ad1ff" : gasp ? "#ff4d4d" : "#3a3f55";
      c.fillRect(gx + i * (pw + 2), gy, pw, 5);
    }
  }
  function results(G, c, L, s) {
    var W = G.W,
      r = s.results,
      bx = 14,
      bw = W - 28,
      _final = s.heat === 2;
    var pod = _final ? 96 : 0,
      bh = 54 + 4 * 24 + 46 + pod;
    var by = Math.max(L.poolTop + 4, (L.poolTop + L.poolBot) / 2 - bh / 2);
    c.fillStyle = "rgba(0,0,0,0.5)";
    c.fillRect(bx + 4, by + 4, bw, bh);
    c.fillStyle = "#f3e6c8";
    c.fillRect(bx, by, bw, bh);
    c.strokeStyle = "#5a4630";
    c.lineWidth = 3;
    c.strokeRect(bx, by, bw, bh);
    G.text(c, _final ? "FINAL RESULTS" : HEATS[s.heat] + " RESULTS", W / 2, by + 17, 12, "#5a4630");
    var y0 = by + 34;
    if (_final) {
      var cx = W / 2,
        pwid = Math.min(70, bw / 3.6),
        base = y0 + pod - 6;
      var spots = [[1, cx - pwid, 34, "#c0c0c0"], [0, cx, 50, "#ffd23f"], [2, cx + pwid, 22, "#cd7f32"]];
      for (var _i6 = 0, _spots = spots; _i6 < _spots.length; _i6++) {
        var _spots$_i = _slicedToArray(_spots[_i6], 4),
          i = _spots$_i[0],
          x = _spots$_i[1],
          hh = _spots$_i[2],
          col = _spots$_i[3];
        c.fillStyle = col;
        c.fillRect(x - pwid / 2 + 2, base - hh, pwid - 4, hh);
        G.text(c, String(i + 1), x, base - hh / 2, 12, "#3a2a18");
        var o = r.all[i],
          fy = base - hh - 16;
        if (o.you) G.img(c, ":dawgpog:", x, fy, 30);else G.emoji(c, o.e, x, fy, 26);
      }
      y0 += pod;
    }
    for (var _i7 = 0; _i7 < 4; _i7++) {
      var _o = r.all[_i7],
        y = y0 + 12 + _i7 * 24;
      if (_o.you) {
        c.fillStyle = _i7 <= 1 ? "rgba(61,220,104,0.35)" : "rgba(255,107,107,0.3)";
        c.fillRect(bx + 6, y - 11, bw - 12, 22);
      }
      G.text(c, ORD[_i7], bx + 12, y, 10, _i7 === 0 ? "#a06e00" : "#5a4630", "left");
      if (_o.you) G.img(c, _i7 <= 1 ? ":dawgpog:" : ":dawgpain:", bx + 66, y, 20);else G.emoji(c, _o.e, bx + 66, y, 16);
      G.text(c, _o.name, bx + 82, y, 10, "#3a2a18", "left");
      G.text(c, _o.time.toFixed(2) + "s", bx + bw - 10, y, 10, "#3a2a18", "right");
    }
    var yb = y0 + 12 + 4 * 24 + 2;
    G.text(c, "+".concat(PTS[r.place], " PLACE  +").concat(r.bonus, " TIME"), W / 2, yb, 10, "#3a2a18");
    var msg;
    if (r.place > 1) msg = "ELIMINATED";else if (_final) msg = r.place === 0 ? "GOLD MEDAL!" : "SILVER MEDAL!";else msg = s.pt > 1.2 ? s.heat === 0 ? "TAP: ON TO THE SEMIS" : "TAP: ON TO THE FINAL" : "YOU ADVANCE!";
    G.text(c, msg, W / 2, yb + 22, 11, r.place <= 1 ? Math.sin(G.t * 6) > 0 ? "#1f7a44" : "#2fb35a" : "#c0392b");
  }
})();