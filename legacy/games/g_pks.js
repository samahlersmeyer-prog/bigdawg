function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
(function () {
  var DUR = 0.55,
    RES = 1.35;
  var lay = function lay(G) {
    var W = G.W,
      H = G.H,
      gw = Math.min(W * 0.8, 420),
      gt = H * 0.2,
      gb = H * 0.43;
    return {
      W: W,
      H: H,
      gw: gw,
      gt: gt,
      gb: gb,
      gh: gb - gt,
      gl: W / 2 - gw / 2,
      gr: W / 2 + gw / 2,
      bx: W / 2,
      by: H * 0.8,
      hz: gb - (gb - gt) * 0.28
    };
  };
  var ease = function ease(a) {
    return a < 0 ? 0 : a > 1 ? 1 : 1 - (1 - a) * (1 - a);
  };
  var fit = function fit(G, t, mx) {
    return Math.min(mx, (G.W - 24) / t.length);
  };
  var zoneOf = function zoneOf(u) {
    return u < -0.33 ? -1 : u > 0.33 ? 1 : 0;
  };
  function newShot(G) {
    var s = G.s;
    s.phase = "aim";
    s.ft = 0;
    s.rt = 0;
    s.drag = null;
    s.res = null;
    s.face = ":dawgW:";
    s.ball = {
      x: s.L.bx,
      y: s.L.by,
      r: 16
    };
    s.kdive = null;
    s.ka = 0;
    s.krot = 0;
  }
  function shoot(G, u, v, curve) {
    var s = G.s,
      L = s.L;
    if (s.phase !== "aim") return;
    var n = 0.06 + 0.015 * Math.min(s.streak, 8);
    u += (Math.random() * 2 - 1) * n;
    v += (Math.random() * 2 - 1) * n;
    if (v < 0.04) v = 0.04;
    var tx = L.bx + u * L.gw / 2 + 0,
      ty = L.gb - v * L.gh;
    s.shots++;
    var res,
      save = false;
    var top = v > 0.6 && Math.abs(u) > 0.6;
    if (v > 1.07) res = "OVER";else if (Math.abs(u) > 1.06) res = "WIDE";else if (v > 0.94 || Math.abs(u) > 0.94) res = Math.random() < 0.45 ? "POSTIN" : "POST";else res = "IN";
    var zone = zoneOf(u),
      smart = Math.min(0.72, 0.12 + s.shots * 0.035),
      read = Math.min(0.3, s.shots * 0.012);
    var guess;
    if (Math.random() < read) guess = zone;else if (s.hist.length >= 2 && Math.random() < smart) guess = s.hist[s.hist.length - 1] === s.hist[s.hist.length - 2] ? s.hist[s.hist.length - 1] : s.hist[s.hist.length - 1 - Math.floor(Math.random() * 2)];else {
      var r = Math.random();
      guess = r < 0.42 ? -1 : r < 0.84 ? 1 : 0;
    }
    s.hist.push(zone);
    if (s.hist.length > 4) s.hist.shift();
    if (res === "IN") {
      var p;
      if (guess === zone) p = top ? Math.min(0.5, 0.25 + s.shots * 0.008) : Math.abs(u) > 0.75 ? 0.62 : 0.88;else p = zone === 0 && v < 0.45 ? 0.25 : guess === 0 && Math.abs(u) < 0.5 ? 0.3 : 0.04;
      if (Math.abs(curve) > 18) p -= 0.15;
      p *= Math.min(1, 0.45 + s.shots * 0.06);
      save = Math.random() < p;
      if (save) res = "SAVE";
    }
    var dx, dy;
    if (save) {
      dx = tx;
      dy = ty;
    } else if (guess === zone && res === "IN") {
      dx = L.bx + (tx - L.bx) * 0.62;
      dy = L.gb - (L.gb - ty) * 0.75;
    } else {
      dx = L.bx + guess * L.gw * 0.32;
      dy = L.gb - L.gh * (guess === 0 ? 0.95 : 0.4 + Math.random() * 0.3);
    }
    s.kdive = {
      x: dx,
      y: dy
    };
    s.shot = {
      sx: L.bx,
      sy: L.by,
      tx: tx,
      ty: ty,
      cx: (L.bx + tx) / 2 + curve * 1.8,
      cy: (L.by + ty) / 2 - 24,
      u: u,
      v: v,
      top: top
    };
    s.res = res;
    s.phase = "fly";
    s.ft = 0;
    G.sfx("pop");
  }
  function settle(G) {
    var s = G.s,
      sh = s.shot,
      b = s.ball;
    var goal = s.res === "IN" || s.res === "POSTIN";
    s.phase = "res";
    s.rt = 0;
    var vx = (sh.tx - sh.cx) * 2 / DUR,
      vy = (sh.ty - sh.cy) * 2 / DUR;
    if (goal) {
      s.goals++;
      s.streak++;
      var pts = 100;
      if (sh.top && s.res === "IN") pts += 50;
      if (s.streak > 2) pts += Math.min(250, 25 * (s.streak - 2));
      s.score = Math.min(9999, s.score + pts);
      s.banner = {
        txt: sh.top && s.res === "IN" ? "TOP BINS!" : s.res === "POSTIN" ? "OFF THE POST!" : "GOAL!",
        sub: "+" + pts,
        c: "#ffd23f"
      };
      s.face = ":dawgpog:";
      s.ripple = 0.5;
      b.vx = vx * 0.05;
      b.vy = vy * 0.05;
      b.g = 0;
      G.sfx("win");
    } else {
      s.misses++;
      s.streak = 0;
      s.face = ":dawgpain:";
      var side = sh.tx < s.L.bx ? -1 : 1;
      if (s.res === "SAVE") {
        s.banner = {
          txt: "SAVED!",
          sub: "",
          c: "#ff6b6b"
        };
        b.vx = side * 220 * (Math.random() * 0.6 + 0.6);
        b.vy = -60;
        b.g = 600;
      } else if (s.res === "POST") {
        s.banner = {
          txt: "POST!",
          sub: "",
          c: "#ff6b6b"
        };
        b.vx = side * 260;
        b.vy = 40;
        b.g = 500;
      } else if (s.res === "OVER") {
        s.banner = {
          txt: "OVER THE BAR!",
          sub: "",
          c: "#ff6b6b"
        };
        b.vx = vx * 0.6;
        b.vy = Math.min(vy, -120) * 0.6;
        b.g = 0;
      } else {
        s.banner = {
          txt: "WIDE!",
          sub: "",
          c: "#ff6b6b"
        };
        b.vx = vx * 0.6;
        b.vy = vy * 0.4;
        b.g = 0;
      }
      G.sfx("lose");
      G.buzz();
    }
  }
  defGame({
    key: "pks",
    name: "Pup Kicks",
    icon: "⚽",
    max: 9999,
    cat: "sports",
    blurb: "Penalty kicks. Beat the cat keeper.",
    how: "Flick up from the ball toward the goal. Aim left or right, flick longer to shoot higher (too long sails over). Bend your flick to curl it. Top corners are worth +50. The cat keeper learns your favorite side, so mix it up. 3 misses and you're out.",
    reset: function reset(G) {
      G.s = {
        L: lay(G),
        score: 0,
        goals: 0,
        misses: 0,
        streak: 0,
        shots: 0,
        hist: [],
        kx: 0,
        ripple: 0,
        banner: null
      };
      newShot(G);
    },
    update: function update(G, dt) {
      var s = G.s,
        L = s.L,
        b = s.ball;
      if (s.ripple > 0) s.ripple -= dt;
      var sp = 1.6 + Math.min(2, s.shots * 0.08);
      if (s.phase === "aim") s.kx = Math.sin(G.t * sp) * L.gw * 0.12 + Math.sin(G.t * sp * 2.3) * L.gw * 0.03;
      if (s.phase === "fly") {
        s.ft += dt;
        var p = Math.min(1, s.ft / DUR),
          q = 1 - p,
          sh = s.shot;
        b.x = q * q * sh.sx + 2 * q * p * sh.cx + p * p * sh.tx;
        b.y = q * q * sh.sy + 2 * q * p * sh.cy + p * p * sh.ty;
        b.r = 16 - 9.5 * ease(p * 1.1);
        s.ka = ease((s.ft - 0.1) / 0.4);
        if (p >= 1) settle(G);
      } else if (s.phase === "res") {
        s.rt += dt;
        s.ka = 1;
        b.vy += (b.g || 0) * dt;
        b.x += b.vx * dt;
        b.y += b.vy * dt;
        if (s.rt >= RES) {
          if (s.misses >= 3) {
            G.over(s.score, s.goals >= 15 ? "Golden paw!" : s.goals >= 5 ? "Cat got lucky." : "Ruff day at the spot.");
            return;
          }
          newShot(G);
        }
      }
    },
    down: function down(G, x, y) {
      var s = G.s;
      if (s.phase !== "aim" || y < s.L.gb + 10) return;
      s.drag = {
        x0: x,
        y0: y,
        x: x,
        y: y,
        pts: [[x, y]]
      };
    },
    move: function move(G, x, y) {
      var d = G.s.drag;
      if (!d) return;
      d.x = x;
      d.y = y;
      if (d.pts.length < 60) d.pts.push([x, y]);
    },
    up: function up(G, x, y) {
      var s = G.s,
        d = s.drag,
        L = s.L;
      if (!d) return;
      s.drag = null;
      d.x = x;
      d.y = y;
      var dx = x - d.x0,
        dy = y - d.y0,
        len = Math.hypot(dx, dy);
      if (dy > -25 || len < 30) return;
      var ex = dx / len,
        ey = dy / len;
      var curve = 0;
      d.pts.forEach(function (p) {
        var dev = (p[0] - d.x0) * -ey + (p[1] - d.y0) * ex;
        if (Math.abs(dev) > Math.abs(curve)) curve = dev;
      });
      curve = Math.max(-60, Math.min(60, curve));
      var a = aimOf(L, dx, dy);
      shoot(G, a.u, a.v, curve);
    },
    onKey: function onKey(G, k, down) {
      if (!down) return;
      var m = {
        ArrowLeft: [-0.72, 0.45],
        ArrowRight: [0.72, 0.45],
        ArrowUp: [0, 0.75],
        ArrowDown: [0.1, 0.15],
        " ": [-0.75, 0.8]
      }[k];
      if (m) shoot(G, m[0], m[1], 0);
    },
    draw: function draw(G, c) {
      var s = G.s,
        L = s.L,
        W = G.W,
        H = G.H,
        dark = G.dark();
      c.fillStyle = dark ? "#151a2e" : "#3d4a7a";
      c.fillRect(0, 0, W, L.hz);
      var cols = dark ? ["#3b4570", "#6a4d7a", "#7a6a3b", "#2f5f6a"] : ["#c9a640", "#d0735a", "#c8cfe0", "#6fa8cc"];
      for (var _y = 60, r = 0; _y < L.hz - 6; _y += 12, r++) for (var x = r % 2 * 7, _i = r; x < W; x += 14, _i++) {
        c.fillStyle = cols[(_i * 7 + r * 3) % 4];
        c.fillRect(x, _y + Math.sin(G.t * 6 + _i) * (s.ripple > 0 ? 3 : 0.5), 8, 8);
      }
      c.fillStyle = dark ? "#2a2f45" : "#e9eef7";
      c.fillRect(0, L.hz - 10, W, 10);
      var g1 = dark ? "#1f5a24" : "#4fb04a",
        g2 = dark ? "#184a1d" : "#43a03f";
      var y = L.hz,
        h = 8,
        i = 0;
      while (y < H) {
        c.fillStyle = i++ % 2 ? g1 : g2;
        c.fillRect(0, y, W, h + 1);
        y += h;
        h *= 1.28;
      }
      c.strokeStyle = dark ? "rgba(255,255,255,.55)" : "rgba(255,255,255,.85)";
      c.lineWidth = 2;
      var bw = Math.min(W - 30, L.gw * 1.2),
        bb = L.gb + (L.by - L.gb) * 0.55;
      c.beginPath();
      c.moveTo(W / 2 - bw / 2, L.gb + 2);
      c.lineTo(W / 2 - bw / 2 - 12, bb);
      c.lineTo(W / 2 + bw / 2 + 12, bb);
      c.lineTo(W / 2 + bw / 2, L.gb + 2);
      c.stroke();
      c.beginPath();
      c.moveTo(0, L.gb + 2);
      c.lineTo(W, L.gb + 2);
      c.stroke();
      c.fillStyle = "#fff";
      c.beginPath();
      c.ellipse(L.bx, L.by + 12, 9, 3, 0, 0, 7);
      c.fill();
      var inset = L.gw * 0.06,
        nt = L.gt + L.gh * 0.1;
      c.fillStyle = dark ? "rgba(0,0,0,.35)" : "rgba(255,255,255,.18)";
      c.fillRect(L.gl, L.gt, L.gw, L.gh);
      c.strokeStyle = dark ? "rgba(220,230,255,.35)" : "rgba(255,255,255,.7)";
      c.lineWidth = 1;
      c.beginPath();
      var bulge = s.ripple > 0 && s.shot ? s.ripple * 2 : 0;
      for (var _x = L.gl + inset; _x <= L.gr - inset + 1; _x += 10) {
        c.moveTo(_x, nt);
        c.lineTo(_x, L.gb);
      }
      for (var yy = nt; yy <= L.gb; yy += 10) {
        c.moveTo(L.gl + inset, yy);
        c.lineTo(L.gr - inset, yy);
      }
      c.moveTo(L.gl, L.gt);
      c.lineTo(L.gl + inset, nt);
      c.moveTo(L.gr, L.gt);
      c.lineTo(L.gr - inset, nt);
      c.stroke();
      if (bulge > 0) {
        c.strokeStyle = "rgba(255,255,255,.8)";
        c.lineWidth = 2;
        for (var k = 1; k <= 3; k++) {
          c.beginPath();
          c.arc(s.shot.tx, s.shot.ty, (1 - s.ripple * 2) * 14 * k + 4, 0, 7);
          c.stroke();
        }
      }
      var inNet = s.phase === "res" && (s.res === "IN" || s.res === "POSTIN");
      if (inNet) drawBall(G, c);
      drawKeeper(G, c);
      c.fillStyle = "#fff";
      c.strokeStyle = "#9aa";
      c.lineWidth = 1;
      var pw = Math.max(5, L.gw * 0.022);
      c.fillRect(L.gl - pw, L.gt - pw, pw, L.gh + pw);
      c.fillRect(L.gr, L.gt - pw, pw, L.gh + pw);
      c.fillRect(L.gl - pw, L.gt - pw, L.gw + pw * 2, pw);
      var d = s.drag;
      if (d && s.phase === "aim") {
        var dx = d.x - d.x0,
          dy = d.y - d.y0;
        if (dy < -15) {
          var a = aimOf(L, dx, dy),
            tx = L.bx + a.u * L.gw / 2,
            ty = L.gb - Math.max(0.04, a.v) * L.gh;
          var over = a.v > 1.07 || Math.abs(a.u) > 1.06;
          c.fillStyle = over ? "#ff6b6b" : "#ffd23f";
          for (var _k = 1; _k <= 6; _k++) {
            var p = _k / 11;
            c.beginPath();
            c.arc(L.bx + (tx - L.bx) * p, L.by + (ty - L.by) * p, 4 - _k * 0.35, 0, 7);
            c.fill();
          }
        }
      }
      if (!inNet) drawBall(G, c);
      var kick = s.phase === "fly" ? Math.min(1, s.ft * 6) : s.phase === "res" ? 1 : 0;
      G.img(c, s.face, L.bx - 62 + kick * 26, L.by + 30 - kick * 18, Math.min(82, H * 0.13), s.phase === "aim" ? Math.sin(G.t * 3) * 0.06 : 0.15);
      if (s.phase === "aim" && s.shots < 2 && !d) {
        var bob = Math.sin(G.t * 5) * 4;
        c.fillStyle = "#000";
        G.emoji(c, "👆", L.bx + 54, L.by + 6 + bob, 26);
      }
      if (s.phase === "res" && s.banner) {
        var sc = Math.min(1, s.rt * 6),
          by = L.gb + (L.by - L.gb) * 0.32,
          sub = !!s.banner.sub;
        c.fillStyle = "rgba(0,0,0,.55)";
        c.fillRect(0, by - 26 * sc, W, (52 + (sub ? 20 : 0)) * sc);
        G.banner(c, s.banner.txt, s.banner.c, by, Math.max(10, fit(G, s.banner.txt, 26) * sc));
        if (sub && sc >= 1) G.text(c, s.banner.sub + (s.streak > 2 ? "  STREAK x".concat(s.streak) : ""), W / 2, by + 30, 12, "#fff");
      }
      G.hud(c, "SCORE ".concat(s.score), s.streak >= 2 ? "\uD83D\uDD25x".concat(s.streak) : "\uD83E\uDD45 ".concat(s.goals), "");
      for (var _k2 = 0; _k2 < 3; _k2++) {
        var _x2 = W - 18 - _k2 * 24,
          out = _k2 >= 3 - s.misses;
        c.globalAlpha = out ? 0.3 : 1;
        c.fillStyle = "#000";
        G.emoji(c, "⚽", _x2, 17, 18);
        c.globalAlpha = 1;
        if (out) G.text(c, "X", _x2, 18, 13, "#ff6b6b");
      }
      G.hint(c, "FLICK UP FROM THE BALL", 5, L.by - 52);
    }
  });
  function aimOf(L, dx, dy) {
    var k = 1.6;
    return {
      u: dx * k / (L.gw / 2) * 0.9,
      v: (L.gb - (L.by + dy * k)) / L.gh
    };
  }
  function drawBall(G, c) {
    var s = G.s,
      b = s.ball,
      L = s.L;
    if (s.phase === "fly") {
      var p = Math.min(1, s.ft / DUR),
        sx = L.bx + (s.shot.tx - L.bx) * p,
        sy = L.by + 12 + (L.gb - L.by - 12) * p;
      c.fillStyle = "rgba(0,0,0,.25)";
      c.beginPath();
      c.ellipse(sx, sy, b.r * 0.9, b.r * 0.3, 0, 0, 7);
      c.fill();
    } else if (s.phase === "aim") {
      c.fillStyle = "rgba(0,0,0,.25)";
      c.beginPath();
      c.ellipse(b.x, b.y + 13, 14, 4, 0, 0, 7);
      c.fill();
    }
    if (b.x < -40 || b.x > G.W + 40 || b.y < -40 || b.y > G.H + 40) return;
    c.fillStyle = "#fff";
    c.beginPath();
    c.arc(b.x, b.y, b.r * 0.95, 0, 7);
    c.fill();
    c.fillStyle = "#000";
    G.emoji(c, "⚽", b.x, b.y, b.r * 2.3);
  }
  function drawKeeper(G, c) {
    var s = G.s,
      L = s.L,
      gh = L.gh;
    var reach = gh * 0.42,
      baseX = L.bx + s.kx,
      baseY = L.gb - gh * 0.3;
    var x = baseX,
      y = baseY,
      rot = 0;
    if (s.kdive && s.ka > 0) {
      var t = s.kdive,
        side = Math.sign(t.x - baseX) || 0;
      rot = side * Math.min(1.35, Math.abs(t.x - baseX) / (L.gw * 0.3)) * s.ka;
      var fx = t.x - reach * Math.sin(rot / Math.max(0.001, s.ka) * 1),
        fy = t.y + reach * Math.cos(rot / Math.max(0.001, s.ka));
      x = baseX + (fx - baseX) * s.ka;
      y = baseY + (Math.min(fy, L.gb - gh * 0.1) - baseY) * s.ka;
    }
    var hop = s.phase === "aim" ? Math.abs(Math.sin(G.t * 6)) * 3 : 0;
    c.save();
    c.translate(x, y - hop);
    c.rotate(rot);
    var bw = gh * 0.3,
      bh = gh * 0.34;
    c.fillStyle = "#222";
    c.fillRect(-bw * 0.4, bh * 0.35, bw * 0.3, bh * 0.45);
    c.fillRect(bw * 0.1, bh * 0.35, bw * 0.3, bh * 0.45);
    c.strokeStyle = "#f28c28";
    c.lineWidth = Math.max(5, gh * 0.06);
    c.lineCap = "round";
    var spread = s.phase === "aim" ? 0.55 : 0.22;
    c.beginPath();
    c.moveTo(-bw * 0.4, -bh * 0.3);
    c.lineTo(-reach * Math.sin(spread), -reach * Math.cos(spread));
    c.moveTo(bw * 0.4, -bh * 0.3);
    c.lineTo(reach * Math.sin(spread), -reach * Math.cos(spread));
    c.stroke();
    c.fillStyle = "#f28c28";
    c.fillRect(-bw / 2, -bh * 0.45, bw, bh * 0.85);
    c.fillStyle = "#1b1b1b";
    c.font = "".concat(Math.round(gh * 0.14), "px 'Press Start 2P', monospace");
    c.textAlign = "center";
    c.textBaseline = "middle";
    c.fillText("1", 0, -bh * 0.03);
    c.fillStyle = "#fff";
    c.strokeStyle = "#333";
    c.lineWidth = 2;
    [[-1], [1]].forEach(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 1),
        sd = _ref2[0];
      c.beginPath();
      c.arc(sd * reach * Math.sin(spread), -reach * Math.cos(spread), gh * 0.07, 0, 7);
      c.fill();
      c.stroke();
    });
    c.fillStyle = "#000";
    G.emoji(c, "🐱", 0, -bh * 0.62, gh * 0.3);
    c.restore();
  }
})();