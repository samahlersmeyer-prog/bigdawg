function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
(function () {
  var TH = 38 * Math.PI / 180,
    GRAV = 10.7,
    SIMS = 1.55;
  var HW = 3.08,
    BAR = 3.33,
    UPH = 10,
    BR = 0.16,
    POST = 0.12;
  var WINDK = 0.12;
  var AMAX = 0.30;
  var P = {
    x: 0,
    y: 0,
    s: 0
  };
  var clamp = function clamp(v, a, b) {
    return v < a ? a : v > b ? b : v;
  };
  var rangeOf = function rangeOf(p) {
    return 16 + 68 * p;
  };
  function lay(G) {
    var H = G.H;
    return {
      hz: H * 0.45,
      f: H * 0.95,
      cz: 5,
      ch: 1.6
    };
  }
  var C3 = {
    x: 0,
    y: 0,
    z: 0
  };
  function cam(G, X, Y, Z) {
    var s = G.s,
      dx = X - s.bx,
      cs = s.yc,
      sn = s.ys;
    C3.x = dx * cs - Z * sn;
    C3.y = Y;
    C3.z = dx * sn + Z * cs + s.L.cz;
    return C3;
  }
  function scr(G, x, y, z) {
    var L = G.s.L,
      sc = L.f / Math.max(0.5, z);
    P.s = sc;
    P.x = G.W / 2 + x * sc;
    P.y = L.hz + (L.ch - y) * sc;
    return P;
  }
  function proj(G, X, Y, Z) {
    var q = cam(G, X, Y, Z);
    return scr(G, q.x, q.y, q.z);
  }
  var NEAR = 0.6;
  function clipPoly(pts) {
    var out = [];
    for (var i = 0; i < pts.length; i++) {
      var a = pts[i],
        b = pts[(i + 1) % pts.length],
        ai = a.z >= NEAR,
        bi = b.z >= NEAR;
      if (ai) out.push(a);
      if (ai !== bi) {
        var t = (NEAR - a.z) / (b.z - a.z);
        out.push({
          x: a.x + (b.x - a.x) * t,
          y: a.y + (b.y - a.y) * t,
          z: NEAR
        });
      }
    }
    return out;
  }
  function needP(D) {
    var R = D / Math.max(0.05, 1 - (BAR + 0.5) / (D * Math.tan(TH)));
    return clamp((R - 16) / 68, 0, 1);
  }
  function newKick(G) {
    var s = G.s,
      D = s.dist;
    s.phase = "aim";
    s.res = null;
    s.ft = 0;
    s.crossed = false;
    s.decided = false;
    s.doink = false;
    s.face = ":dawgW:";
    s.kickT = 0;
    s.lockT = 0.35;
    s.aim = 0;
    s.pow = 0;
    s.aph = Math.random() * 6.28;
    s.pph = 0;
    var lat = Math.min(11, 1.5 + s.makes * 1.1),
      side = Math.random() < 0.5 ? -1 : 1;
    s.bx = side * lat * (s.makes < 2 ? Math.random() : 0.45 + 0.55 * Math.random());
    var ang = Math.atan2(-s.bx, D);
    s.yc = Math.cos(ang);
    s.ys = Math.sin(ang);
    s.head = ang;
    s.spot = Math.abs(s.bx) < 1.2 ? "MIDDLE" : (Math.abs(s.bx) <= 3.6 ? "HASH" : Math.abs(s.bx) <= 7 ? "WIDE" : "SHARP ANGLE") + (s.bx < 0 ? " · LEFT" : " · RIGHT");
    s.bonus = Math.round(Math.abs(s.bx) * 2);
    s.camX = 0;
    s.pan = 0;
    s.ball = {
      x: s.bx,
      y: 0.22,
      z: 0,
      vx: 0,
      vy: 0,
      vz: 0,
      rot: 0,
      spin: 0,
      ax: 0,
      on: false
    };
    var pro = s.score >= 1000;
    if (pro && !s.pro) {
      s.pro = true;
      s.proT = 2.2;
    }
    var mx = pro ? Math.min(30, 18 + (s.score - 1000) / 100) : Math.min(16, 2 + (D - 20) * 0.28 + s.kicks * 0.08);
    var mph = Math.round(pro ? mx * (0.55 + 0.45 * Math.random()) : mx * (0.3 + 0.7 * Math.random()));
    s.wind = (Math.random() < 0.5 ? -1 : 1) * Math.max(1, mph);
    s.aspd = pro ? 2.2 : Math.min(2.0, 1.35 + s.kicks * 0.04);
    s.pspd = pro ? 1.0 : Math.min(0.95, 0.62 + s.kicks * 0.02);
  }
  function lockTap(G) {
    var s = G.s;
    if (G.state !== "play" || s.lockT > 0) return;
    if (s.phase === "aim") {
      s.phase = "power";
      s.pph = 0;
      s.pow = 0;
      s.lockT = 0.12;
      G.sfx("pop");
    } else if (s.phase === "power") kick(G);
  }
  function kick(G) {
    var s = G.s,
      b = s.ball,
      R = rangeOf(s.pow),
      v = Math.sqrt(R * GRAV / Math.sin(2 * TH));
    var vh = v * Math.cos(TH);
    b.vx = vh * Math.sin(s.head + s.aim);
    b.vz = vh * Math.cos(s.head + s.aim);
    b.vy = v * Math.sin(TH);
    b.ax = s.wind * WINDK;
    b.on = true;
    b.spin = 9 + s.pow * 6;
    s.phase = "fly";
    s.kickT = 0.2;
    s.ft = 0;
    s.kicks++;
    G.sfx("pop");
    G.buzz();
  }
  function decide(G, good, txt, sub) {
    var s = G.s;
    if (s.decided) return;
    s.decided = true;
    s.res = {
      good: good,
      txt: txt,
      sub: sub || "",
      t: 0
    };
    if (good) {
      s.gain = s.dist + s.bonus;
      s.score = Math.min(9999, s.score + s.gain);
      s.makes++;
      s.face = ":dawgpog:";
      s["long"] = Math.max(s["long"], s.dist);
      G.sfx("win");
    } else {
      s.miss++;
      s.face = s.miss >= 3 ? ":dawgpain:" : s.doink ? ":dawgsweat:" : Math.random() < 0.5 ? ":dawgcope:" : ":dawgL:";
      G.sfx("lose");
      G.buzz();
    }
  }
  defGame({
    key: "fg",
    name: "Kick Dawg",
    icon: "🏈",
    max: 9999,
    cat: "sports",
    blurb: "Field goals. Read the wind. Split the uprights.",
    how: "Two taps per kick. TAP to lock the swinging AIM arrow, then TAP to lock the POWER meter (the white line is about the least power that gets there). WIND (the box, and the flags on the posts) bends the ball, so aim into it. Kicks run 20 to 60 yards and move around the field: first the hashes, then wide angles from out by the numbers. Each make scores its yards plus an angle bonus. Hit 1,000 points and you're in PRO RANGE: nothing shorter than 40 yards and the wind really picks up. 3 misses and you're done.",
    reset: function reset(G) {
      G.s = {
        L: lay(G),
        dist: 20,
        score: 0,
        makes: 0,
        miss: 0,
        kicks: 0,
        "long": 0,
        face: ":dawgW:",
        wind: 0,
        camX: 0
      };
      newKick(G);
    },
    update: function update(G, dt) {
      var s = G.s,
        b = s.ball,
        D = s.dist;
      s.L = lay(G);
      if (s.lockT > 0) s.lockT -= dt;
      if (s.kickT > 0) s.kickT -= dt;
      if (s.phase === "aim") {
        s.aph += dt * s.aspd;
        s.aim = AMAX * Math.sin(s.aph);
      } else if (s.phase === "power") {
        s.pph = (s.pph + dt * s.pspd) % 2;
        s.pow = s.pph < 1 ? s.pph : 2 - s.pph;
      } else if (s.phase === "fly") {
        s.ft += dt;
        var n = 3,
          st = dt * SIMS / n;
        for (var i = 0; i < n && b.on; i++) {
          var pz = b.z,
            px = b.x,
            py = b.y;
          b.vx += b.ax * st;
          b.vy -= GRAV * st;
          b.x += b.vx * st;
          b.y += b.vy * st;
          b.z += b.vz * st;
          b.rot += b.spin * st;
          if (!s.crossed && pz < D && b.z >= D) {
            s.crossed = true;
            var f = (D - pz) / (b.z - pz),
              cx = px + (b.x - px) * f,
              cy = py + (b.y - py) * f,
              ax = Math.abs(cx);
            if (cy > BAR - BR && Math.abs(ax - HW) < POST + BR) {
              s.doink = true;
              b.vx = -b.vx * 0.6 - Math.sign(cx) * 2;
              b.vz = -Math.abs(b.vz) * 0.25;
              b.z = D - 0.05;
              decide(G, false, "DOINK!", "OFF THE UPRIGHT");
            } else if (ax < HW && Math.abs(cy - BAR) < BR + 0.05) {
              s.doink = true;
              if (cy >= BAR) {
                b.vy = Math.abs(b.vy) * 0.4 + 1;
                b.vz *= 0.5;
                decide(G, true, "DOINK! GOOD!", "OFF THE BAR AND IN");
              } else {
                b.vy = Math.abs(b.vy) * 0.3;
                b.vz = -Math.abs(b.vz) * 0.3;
                b.z = D - 0.05;
                decide(G, false, "DOINK!", "OFF THE CROSSBAR");
              }
            } else if (ax < HW && cy > BAR) decide(G, true, "GOOD!", "".concat(D, " YARDS"));else if (ax >= HW) decide(G, false, "NO GOOD", cx < 0 ? "WIDE LEFT" : "WIDE RIGHT");else decide(G, false, "NO GOOD", "SHORT");
          }
          if (b.y <= 0.12 && b.vy < 0) {
            b.y = 0.12;
            if (!s.crossed && !s.decided) decide(G, false, "NO GOOD", "SHORT");
            if (Math.abs(b.vy) > 3) {
              b.vy = -b.vy * 0.35;
              b.vz *= 0.5;
              b.vx *= 0.5;
              b.spin *= 0.5;
            } else {
              b.vy = 0;
              b.vz *= 0.9;
              b.vx *= 0.9;
              if (Math.abs(b.vz) < 0.5) b.on = false;
            }
          }
        }
        var bp = proj(G, b.x, b.y, b.z),
          want = clamp(70 - bp.y, 0, G.H * 0.5);
        s.pan += (want - s.pan) * Math.min(1, dt * (want > s.pan ? 9 : 2.5));
        if (s.decided) {
          s.res.t += dt;
          if (s.res.t > 1.7) {
            if (s.miss >= 3) {
              G.over(s.score, s.score >= 600 ? "Leg of a legend!" : s.score >= 250 ? "Big leg, bad wind." : "Wide right. Ruff.");
              return;
            }
            if (s.res.good) s.dist = s.score >= 1000 ? [40, 45, 50, 50, 55, 55, 60, 60][Math.floor(Math.random() * 8)] : s.makes < 8 ? 20 + s.makes * 5 : [35, 40, 45, 45, 50, 50, 55, 55, 60, 60][Math.floor(Math.random() * 10)];
            newKick(G);
          }
        } else if (s.ft > 6) decide(G, false, "NO GOOD", "SHORT");
      }
    },
    tap: function tap(G) {
      lockTap(G);
    },
    onKey: function onKey(G, k, isDown) {
      if (isDown && (k === " " || k === "ArrowUp" || k === "Enter")) lockTap(G);
    },
    draw: function draw(G, c) {
      var s = G.s,
        W = G.W,
        H = G.H,
        dark = G.dark(),
        D = s.dist,
        b = s.ball,
        t = G.t;
      var L = s.L = lay(G),
        hz = L.hz;
      var pan = s.pan || 0;
      c.save();
      c.translate(0, pan);
      var sky = c.createLinearGradient(0, -pan, 0, hz);
      if (dark) {
        sky.addColorStop(0, "#0b1030");
        sky.addColorStop(1, "#27306a");
      } else {
        sky.addColorStop(0, "#4aa8ff");
        sky.addColorStop(1, "#bfe6ff");
      }
      c.fillStyle = sky;
      c.fillRect(0, -pan, W, hz + pan);
      var sh = H * 0.11,
        st = hz - sh;
      for (var i = 0; i < 2; i++) {
        var lx = i ? W * 0.92 : W * 0.08;
        c.fillStyle = dark ? "#555b7a" : "#7a7f95";
        c.fillRect(lx - 2, st - H * 0.1, 4, H * 0.1);
        c.fillStyle = dark ? "#fff7c2" : "#e8e8e8";
        c.fillRect(lx - 16, st - H * 0.12, 32, 12);
        if (dark) {
          c.fillStyle = "rgba(255,247,190,0.12)";
          c.beginPath();
          c.arc(lx, st - H * 0.115, 40, 0, 7);
          c.fill();
        }
      }
      c.fillStyle = dark ? "#3a2f5a" : "#c0392b";
      c.fillRect(0, st, W, sh);
      var cols = ["#ffd23f", "#ffffff", "#2d8cff", "#ff6b6b", "#7cc35b", "#f7a1c4"];
      var cheer = s.res && s.res.good ? 1 : 0;
      c.globalAlpha = dark ? 0.55 : 0.8;
      for (var r = 0; r < 4; r++) for (var x = r % 2 * 5; x < W; x += 10) {
        c.fillStyle = cols[((x * 7 + r * 13) % 6 + 6) % 6];
        c.fillRect(x, st + 4 + r * (sh - 8) / 4 + (Math.sin(t * (6 + cheer * 10) + x) > 0.85 - cheer * 0.6 ? -2 - cheer * 2 : 0), 5, 4);
      }
      c.globalAlpha = 1;
      c.fillStyle = dark ? "#1d1838" : "#2c3e50";
      c.fillRect(0, hz - 5, W, 5);
      c.fillStyle = dark ? "#173a1a" : "#3f8f3a";
      c.fillRect(0, hz, W, H - hz);
      var FW = 26.67,
        zn = -L.cz + 0.6,
        gl = D - 10;
      for (var z = gl, k = 0; z > zn; z -= 5, k++) {
        quad(G, c, -FW, FW, Math.max(zn, z - 5), z, k % 2 ? dark ? "#1f5a24" : "#5fb14f" : dark ? "#24652a" : "#6cc25b");
      }
      quad(G, c, -FW, FW, gl, D, dark ? "#5a2a7a" : "#8e44ad");
      c.strokeStyle = dark ? "rgba(255,255,255,0.75)" : "#fff";
      for (var _z = gl; _z > zn; _z -= 5) line3(G, c, -FW, 0, _z, FW, 0, _z, _z === gl ? 3 : 1.5);
      line3(G, c, -FW, 0, D, FW, 0, D, 2);
      line3(G, c, -FW, 0, zn, -FW, 0, D, 2);
      line3(G, c, FW, 0, zn, FW, 0, D, 2);
      c.fillStyle = dark ? "rgba(255,255,255,0.7)" : "#fff";
      for (var _z2 = Math.ceil(zn + 1); _z2 < gl; _z2++) for (var _i = 0, _arr = [-HW, HW]; _i < _arr.length; _i++) {
        var hx = _arr[_i];
        if (cam(G, hx, 0, _z2).z < NEAR + 0.5) continue;
        var a = proj(G, hx, 0, _z2),
          w = Math.max(1, 0.5 * a.s);
        c.fillRect(a.x - w / 2, a.y - 0.5, w, Math.max(1, a.s * 0.06));
      }
      var ez = proj(G, 0, 0, D - 5);
      if (ez.s > 6) G.text(c, "DAWGS", ez.x, ez.y, clamp(ez.s * 0.9, 10, 22), dark ? "#e7c6ff" : "#fff");
      var ballFar = b.z > D;
      if (ballFar) drawBall(G, c);
      drawPosts(G, c, D, dark, t);
      if (!ballFar) drawBall(G, c);
      var bs = proj(G, s.bx, 0, 0),
        bsx = bs.x,
        bsy = bs.y;
      if (s.phase !== "fly") {
        c.fillStyle = "#ff8c1a";
        c.beginPath();
        c.moveTo(bsx - 9, bsy + 2);
        c.lineTo(bsx + 9, bsy + 2);
        c.lineTo(bsx + 4, bsy - 6);
        c.lineTo(bsx - 4, bsy - 6);
        c.fill();
      }
      var kx = bsx - 64 + (s.kickT > 0 ? 44 * (1 - s.kickT / 0.2) : s.phase === "fly" ? 34 : 0);
      if (!s.res) G.img(c, s.face, kx, bsy + 6, 60, s.kickT > 0 ? 0.35 : 0);
      if (s.phase === "aim" || s.phase === "power") drawArrow(G, c, bsx, bsy, s.aim, s.phase === "power", t);
      c.restore();
      if (s.phase === "aim" || s.phase === "power") {
        drawMeter(G, c, s.phase === "power" ? s.pow : 0, needP(Math.hypot(D, s.bx)), s.phase === "power");
      }
      if (s.res) {
        var _r = s.res,
          pop = Math.min(1, _r.t * 5),
          y = 96;
        var col = _r.good ? "#5be35b" : _r.txt === "DOINK!" ? "#ffb02e" : "#ff5a5a";
        c.save();
        c.translate(W / 2, y);
        c.scale(pop, pop);
        c.translate(-W / 2, -y);
        var bw = Math.min(W - 24, 330);
        c.fillStyle = "rgba(0,0,0,0.6)";
        c.beginPath();
        if (c.roundRect) c.roundRect(W / 2 - bw / 2, y - 34, bw, 90, 14);else c.rect(W / 2 - bw / 2, y - 34, bw, 90);
        c.fill();
        c.strokeStyle = col;
        c.lineWidth = 3;
        c.stroke();
        G.banner(c, _r.txt, col, y, _r.txt.length > 9 ? Math.min(24, W / 16) : undefined);
        c.restore();
        if (_r.sub) G.text(c, _r.sub, W / 2, y + 36, 12, "#fff");
        G.img(c, s.face, W / 2, H - 90, 96 + (_r.good ? Math.abs(Math.sin(t * 9)) * 8 : 0), _r.good ? Math.sin(t * 10) * 0.12 : 0);
        if (_r.good) G.text(c, "+".concat(s.gain), W / 2 + 70, H - 120 - Math.min(20, _r.t * 40), 16, "#ffd23f");
      }
      var lives = "";
      for (var _i2 = 0; _i2 < 3; _i2++) lives += _i2 < 3 - s.miss ? "🏈" : "✖️";
      G.hud(c, "SCORE ".concat(s.score || 0), s.pro ? "PRO \xB7 ".concat(D, " YD") : "".concat(D, " YD"), lives);
      if (s.proT > 0) {
        s.proT -= 1 / 60;
        G.banner(c, "PRO RANGE", "#ff6b6b", H * 0.36);
        G.text(c, "40+ YARDERS · BIG WIND", W / 2, H * 0.36 + 34, 11, "#fff");
      }
      if (!s.res) {
        drawWind(G, c, s.wind, t);
        if (s.phase !== "fly") G.text(c, s.bonus ? "".concat(s.spot, " \xB7 +").concat(s.bonus, " ANGLE") : s.spot, W / 2, 50, 10, "#fff");
      }
      if (!s.kicks && s.phase === "aim") G.hint(c, "TAP TO LOCK AIM", 99, H * 0.62);else if (!s.kicks && s.phase === "power") G.hint(c, "TAP TO LOCK POWER", 99, H * 0.62);
    }
  });
  function drawArrow(G, c, x, y, aim, locked, t) {
    var s = G.s,
      tg = proj(G, s.bx + s.dist * Math.tan(s.head + aim), BAR + 1.5, s.dist),
      tx = tg.x,
      ty = tg.y;
    var ang = Math.atan2(tx - x, -(ty - y)),
      len = Math.min(G.H * 0.2, 120),
      oy = y - 8;
    c.setLineDash([5, 7]);
    c.strokeStyle = locked ? "rgba(91,227,91,0.7)" : "rgba(255,240,120,0.55)";
    c.lineWidth = 2;
    c.beginPath();
    c.moveTo(x + Math.sin(ang) * len, oy - Math.cos(ang) * len);
    c.lineTo(tx, ty);
    c.stroke();
    c.setLineDash([]);
    c.save();
    c.translate(x, oy);
    c.rotate(ang);
    c.fillStyle = locked ? "#5be35b" : "#ffd23f";
    c.strokeStyle = "rgba(0,0,0,0.65)";
    c.lineWidth = 3;
    c.lineJoin = "round";
    var w = 9,
      hw = 22,
      hl = 30;
    c.beginPath();
    c.moveTo(-w, 0);
    c.lineTo(-w, -len + hl);
    c.lineTo(-hw, -len + hl);
    c.lineTo(0, -len);
    c.lineTo(hw, -len + hl);
    c.lineTo(w, -len + hl);
    c.lineTo(w, 0);
    c.closePath();
    c.stroke();
    c.fill();
    if (!locked) {
      c.fillStyle = "rgba(255,255,255,".concat(0.35 + 0.25 * Math.sin(t * 10), ")");
      c.fillRect(-w + 3, -len + hl, 5, len - hl - 4);
    }
    c.restore();
  }
  function drawMeter(G, c, pow, need, active) {
    var W = G.W,
      mw = Math.min(W - 40, 320),
      mh = 26,
      mx = W / 2 - mw / 2,
      my = G.H - 38 - mh / 2;
    c.save();
    c.globalAlpha = active ? 1 : 0.45;
    c.fillStyle = "rgba(0,0,0,0.65)";
    c.fillRect(mx - 5, my - 5, mw + 10, mh + 10);
    c.strokeStyle = "#fff";
    c.lineWidth = 2;
    c.strokeRect(mx - 5, my - 5, mw + 10, mh + 10);
    var gr = c.createLinearGradient(mx, 0, mx + mw, 0);
    gr.addColorStop(0, "#ffd23f");
    gr.addColorStop(0.6, "#ff9a2e");
    gr.addColorStop(1, "#ff3b3b");
    c.fillStyle = gr;
    c.fillRect(mx, my, mw * pow, mh);
    c.fillStyle = "#fff";
    c.fillRect(mx + mw * need - 1.5, my - 8, 3, mh + 16);
    G.text(c, "POWER", mx + 6, my + mh / 2 + 1, 10, "#fff", "left");
    c.restore();
  }
  function drawWind(G, c, wind, t) {
    var w = 124,
      h = 52,
      x = G.W - w - 8,
      y = G.H - 38 - 18 - 12 - h,
      wm = Math.abs(wind),
      wd = Math.sign(wind) || 1;
    var ac = wm >= 14 ? "#ff6b6b" : wm >= 7 ? "#ffd23f" : "#9fe89f";
    c.fillStyle = "rgba(0,0,0,0.6)";
    c.fillRect(x, y, w, h);
    c.strokeStyle = ac;
    c.lineWidth = 2;
    c.strokeRect(x, y, w, h);
    G.text(c, "WIND", x + 8, y + 12, 10, "#fff", "left");
    G.text(c, "".concat(wm), x + w - 8, y + 15, 16, ac, "right");
    G.text(c, "MPH", x + w - 8, y + 39, 10, ac, "right");
    var al = 22 + Math.min(1, wm / 22) * 30,
      cx = x + 40 + Math.sin(t * 6) * 2 * wd,
      cy = y + 34;
    c.save();
    c.translate(cx, cy);
    c.scale(wd, 1);
    c.fillStyle = ac;
    c.fillRect(-al / 2, -4, al - 8, 8);
    c.beginPath();
    c.moveTo(al / 2 + 4, 0);
    c.lineTo(al / 2 - 10, -11);
    c.lineTo(al / 2 - 10, 11);
    c.closePath();
    c.fill();
    c.restore();
  }
  function drawFlag(c, x, y, len, h, dir, mph, t, col) {
    var ext = clamp(0.25 + mph / 16, 0.25, 1),
      droop = (1 - ext) * h * 1.4,
      fl = Math.min(3, 1 + mph / 6);
    c.fillStyle = col;
    c.beginPath();
    c.moveTo(x, y);
    for (var i = 1; i <= 4; i++) {
      var u = i / 4;
      c.lineTo(x + dir * len * ext * u, y + droop * u + Math.sin(t * (4 + mph / 3) + u * 5) * fl * u);
    }
    for (var _i3 = 4; _i3 >= 1; _i3--) {
      var _u = _i3 / 4;
      c.lineTo(x + dir * len * ext * _u, y + h * (1 - _u * 0.35) + droop * _u + Math.sin(t * (4 + mph / 3) + _u * 5) * fl * _u);
    }
    c.lineTo(x, y + h);
    c.closePath();
    c.fill();
  }
  function quad(G, c, x0, x1, z0, z1, col) {
    var pts = clipPoly([[x0, z0], [x1, z0], [x1, z1], [x0, z1]].map(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 2),
        x = _ref2[0],
        z = _ref2[1];
      return Object.assign({}, cam(G, x, 0, z));
    }));
    if (pts.length < 3) return;
    c.fillStyle = col;
    c.beginPath();
    pts.forEach(function (q, i) {
      var p = scr(G, q.x, q.y, q.z);
      i ? c.lineTo(p.x, p.y) : c.moveTo(p.x, p.y);
    });
    c.closePath();
    c.fill();
  }
  function line3(G, c, x0, y0, z0, x1, y1, z1, w) {
    var a = Object.assign({}, cam(G, x0, y0, z0)),
      b = Object.assign({}, cam(G, x1, y1, z1));
    if (a.z < NEAR && b.z < NEAR) return;
    if (a.z < NEAR) {
      var t = (NEAR - a.z) / (b.z - a.z);
      a = {
        x: a.x + (b.x - a.x) * t,
        y: a.y + (b.y - a.y) * t,
        z: NEAR
      };
    }
    if (b.z < NEAR) {
      var _t = (NEAR - b.z) / (a.z - b.z);
      b = {
        x: b.x + (a.x - b.x) * _t,
        y: b.y + (a.y - b.y) * _t,
        z: NEAR
      };
    }
    var p = scr(G, a.x, a.y, a.z),
      ax = p.x,
      ay = p.y,
      q = scr(G, b.x, b.y, b.z);
    c.lineWidth = w;
    c.beginPath();
    c.moveTo(ax, ay);
    c.lineTo(q.x, q.y);
    c.stroke();
  }
  function drawPosts(G, c, D, dark, t) {
    var s = G.s,
      base = proj(G, 0, 0, D + 1.5),
      bx = base.x,
      by = base.y,
      sc = base.s;
    var bar = proj(G, 0, BAR, D),
      barx = bar.x,
      bry = bar.y,
      ps = bar.s;
    c.fillStyle = dark ? "#5c5c66" : "#444";
    var pw = Math.max(2, 0.3 * sc);
    c.fillRect(bx - pw / 2, by - (BAR - 0.4) * sc, pw, (BAR - 0.4) * sc);
    c.strokeStyle = "#ffd400";
    c.lineCap = "round";
    c.lineWidth = Math.max(2, 0.28 * ps);
    c.beginPath();
    c.moveTo(bx, by - (BAR - 0.4) * sc);
    c.lineTo(barx, bry);
    c.stroke();
    var pl = proj(G, -HW, BAR, D),
      lx = pl.x,
      ly = pl.y,
      pr = proj(G, HW, BAR, D),
      rx = pr.x,
      ry = pr.y;
    var tl = proj(G, -HW, BAR + UPH, D),
      tly = tl.y,
      tr = proj(G, HW, BAR + UPH, D),
      tryy = tr.y,
      top = Math.min(tly, tryy);
    c.lineWidth = Math.max(2, 0.24 * ps);
    c.beginPath();
    c.moveTo(lx, ly);
    c.lineTo(rx, ry);
    c.moveTo(lx, ly);
    c.lineTo(lx, tly);
    c.moveTo(rx, ry);
    c.lineTo(rx, tryy);
    c.stroke();
    c.lineCap = "butt";
    var wd = Math.sign(s.wind) || 1,
      wm = Math.abs(s.wind || 0),
      fl = Math.max(14, ps * 1.4),
      fh = Math.max(7, ps * 0.45);
    var fy = Math.max(top, 40);
    drawFlag(c, lx, fy, fl, fh, wd, wm, t, "#ff3b3b");
    drawFlag(c, rx, fy, fl, fh, wd, wm, t + 0.4, "#ff3b3b");
  }
  function drawBall(G, c) {
    var s = G.s,
      b = s.ball;
    var sp = proj(G, b.x, 0, b.z),
      sx = sp.x,
      sy = sp.y,
      ss = sp.s;
    c.fillStyle = "rgba(0,0,0,0.25)";
    c.beginPath();
    c.ellipse(sx, sy, Math.max(1.5, ss * 0.18), Math.max(0.8, ss * 0.06), 0, 0, 7);
    c.fill();
    var p = proj(G, b.x, b.y, b.z),
      len = Math.max(4, p.s * 0.34),
      wid = len * 0.6;
    c.save();
    c.translate(p.x, p.y);
    var r = b.on ? b.rot : -Math.PI / 2 + 0.1;
    c.rotate(r * 0.35);
    c.scale(1, b.on ? 0.45 + 0.55 * Math.abs(Math.cos(r)) : 1);
    c.fillStyle = "#8b4a1f";
    c.beginPath();
    c.ellipse(0, 0, len / 2, wid / 2, 0, 0, 7);
    c.fill();
    c.strokeStyle = "#4a230b";
    c.lineWidth = Math.max(0.8, len * 0.05);
    c.stroke();
    if (len > 9) {
      c.strokeStyle = "#fff";
      c.lineWidth = Math.max(1, len * 0.05);
      c.beginPath();
      c.moveTo(-len * 0.18, 0);
      c.lineTo(len * 0.18, 0);
      for (var i = -2; i <= 2; i++) {
        c.moveTo(i * len * 0.07, -wid * 0.12);
        c.lineTo(i * len * 0.07, wid * 0.12);
      }
      c.moveTo(-len * 0.38, -wid * 0.3);
      c.lineTo(-len * 0.38, wid * 0.3);
      c.moveTo(len * 0.38, -wid * 0.3);
      c.lineTo(len * 0.38, wid * 0.3);
      c.stroke();
    }
    c.restore();
  }
})();