(function () {
  var GRAV = 2300,
    JUMP = 780,
    JUMP2 = 700;
  var hash = function hash(i) {
    var v = Math.sin(i * 127.1 + 311.7) * 43758.5453;
    return v - Math.floor(v);
  };
  var HOUSE = [["#e76f51", "#8d3b2a"], ["#f4d35e", "#a8862a"], ["#7fb7be", "#3d6f75"], ["#c9a7eb", "#6c4f8f"], ["#f2f2f2", "#8c8c8c"], ["#9ccc65", "#4f7a2a"]];
  var DEATH = {
    hydrant: "Hydrant'd.",
    puddle: "Splash! Soggy dog.",
    mailbox: "Mailbox to the face.",
    pigeon: "Bonked by a pigeon!",
    frisbee: "Frisbee to the face.",
    mailman: "Caught by the mailman!"
  };
  function speedAt(t) {
    return 230 + 300 * (1 - Math.exp(-t / 75));
  }
  function gy(G) {
    return Math.round(G.H * 0.75);
  }
  function dogX(G) {
    return Math.round(G.W * 0.24);
  }
  function spawn(G) {
    var s = G.s,
      sp = s.speed,
      t = s.time,
      x0 = G.W + 40;
    var early = t < 20,
      r = Math.random();
    var kind;
    if (early) kind = r < 0.6 ? "hydrant" : r < 0.85 ? "puddle" : "mailbox";else if (r < 0.3) kind = "hydrant";else if (r < 0.45) kind = "puddle";else if (r < 0.6) kind = "mailbox";else if (r < 0.72 && t > 30) kind = "pair";else if (r < 0.88) kind = Math.random() < 0.5 ? "pigeon" : "frisbee";else if (t > 25 && !s.mailmanCd) kind = "mailman";else kind = "hydrant";
    if (kind === "pigeon" && t < 22) kind = "hydrant";
    var pre = 0,
      w = 0,
      post = 0;
    var g = gy(G);
    if (kind === "hydrant") {
      w = 28;
      s.obs.push({
        k: "hydrant",
        x: x0,
        w: w,
        h: 44,
        v: 0
      });
    } else if (kind === "pair") {
      w = 28 + 34 + 28;
      s.obs.push({
        k: "hydrant",
        x: x0,
        w: 28,
        h: 44,
        v: 0
      }, {
        k: "hydrant",
        x: x0 + 62,
        w: 28,
        h: 44,
        v: 0
      });
      post = 40;
    } else if (kind === "puddle") {
      w = 46 + Math.round(Math.random() * 20);
      s.obs.push({
        k: "puddle",
        x: x0,
        w: w,
        h: 6,
        v: 0
      });
    } else if (kind === "mailbox") {
      w = 30;
      s.obs.push({
        k: "mailbox",
        x: x0,
        w: w,
        h: 58,
        v: 0
      });
    } else if (kind === "pigeon" || kind === "frisbee") {
      pre = 150;
      w = 34;
      post = 60;
      var o = {
        k: kind,
        x: x0 + pre,
        w: 34,
        h: 18,
        v: kind === "pigeon" ? 70 : 110,
        y: g - 104 - Math.random() * 10
      };
      s.obs.push(o);
      s.bones.push({
        x: x0 + pre + 30,
        y: g - 30,
        v: 0
      });
    } else if (kind === "mailman") {
      pre = 240;
      w = 30;
      post = 140;
      s.mailmanCd = 3;
      s.obs.push({
        k: "mailman",
        x: x0 + pre,
        w: 30,
        h: 62,
        v: 120
      });
    }
    if (s.mailmanCd && kind !== "mailman") s.mailmanCd--;
    if ((kind === "hydrant" || kind === "mailbox" || kind === "puddle") && Math.random() < 0.45) s.bones.push({
      x: x0 + w / 2,
      y: g - (kind === "mailbox" ? 130 : 115),
      v: 0
    });
    var gap = sp * 0.85 + 90 + sp * Math.random() * 0.9;
    if (early) gap += sp * 0.9 * (1 - t / 20) + 60;
    gap += post;
    if (Math.random() < 0.4 && gap > 220) {
      var bx = x0 + pre + w + gap * 0.4;
      for (var i = 0; i < 3; i++) s.bones.push({
        x: bx + i * 34,
        y: g - 30,
        v: 0
      });
    }
    s.gap = pre + w + gap;
  }
  function jump(G) {
    var s = G.s;
    if (s.dead) return;
    if (s.ground || s.coyote > 0) {
      s.vy = -JUMP;
      s.ground = false;
      s.coyote = 0;
      s.dbl = true;
      s.squash = 0.12;
      G.sfx("pop");
    } else if (s.dbl) {
      s.vy = -JUMP2;
      s.dbl = false;
      s.spin = 1;
      G.sfx("pop");
    } else s.buffer = 0.12;
  }
  function die(G, kind) {
    var s = G.s;
    if (s.dead) return;
    s.dead = 0.75;
    s.cause = kind;
    s.vy = -520;
    G.sfx("lose");
    G.buzz();
  }
  function drawHydrant(c, x, b, dark) {
    var red = "#d62828",
      sh = "#8f1414",
      hi = "#ff6b5b";
    c.fillStyle = sh;
    c.fillRect(x - 2, b - 6, 32, 6);
    c.fillStyle = red;
    c.fillRect(x + 4, b - 32, 20, 26);
    c.fillStyle = hi;
    c.fillRect(x + 7, b - 30, 4, 22);
    c.fillStyle = sh;
    c.fillRect(x + 2, b - 34, 24, 4);
    c.fillStyle = red;
    c.beginPath();
    c.arc(x + 14, b - 34, 10, Math.PI, 0);
    c.fill();
    c.fillStyle = sh;
    c.fillRect(x + 11, b - 47, 6, 5);
    c.fillStyle = red;
    c.fillRect(x - 3, b - 24, 7, 8);
    c.fillRect(x + 24, b - 24, 7, 8);
    c.fillStyle = sh;
    c.fillRect(x - 5, b - 23, 3, 6);
    c.fillRect(x + 30, b - 23, 3, 6);
    c.fillStyle = "#ffd23f";
    c.fillRect(x + 12, b - 19, 4, 4);
    if (dark) {
      c.fillStyle = "rgba(255,240,180,0.18)";
      c.fillRect(x + 4, b - 32, 20, 26);
    }
  }
  function drawMailbox(c, x, b) {
    c.fillStyle = "#6b4423";
    c.fillRect(x + 11, b - 34, 8, 34);
    c.fillStyle = "#4a2e17";
    c.fillRect(x + 17, b - 34, 2, 34);
    c.fillStyle = "#2b59c3";
    c.fillRect(x - 2, b - 52, 34, 18);
    c.beginPath();
    c.arc(x + 15, b - 52, 17, Math.PI, 0);
    c.fill();
    c.fillStyle = "#1b3a85";
    c.fillRect(x - 2, b - 38, 34, 4);
    c.fillStyle = "#e9ecef";
    c.fillRect(x - 2, b - 50, 3, 14);
    c.fillStyle = "#e63946";
    c.fillRect(x + 30, b - 64, 4, 18);
    c.fillRect(x + 30, b - 64, 10, 7);
  }
  function drawPuddle(c, x, w, b, t) {
    c.fillStyle = "#2f6fb5";
    c.beginPath();
    c.ellipse(x + w / 2, b - 2, w / 2 + 2, 7, 0, 0, 7);
    c.fill();
    c.fillStyle = "#5fa8e8";
    c.beginPath();
    c.ellipse(x + w / 2, b - 3, w / 2 - 4, 4, 0, 0, 7);
    c.fill();
    c.fillStyle = "#cfe9ff";
    c.fillRect(x + w * 0.25 + Math.sin(t * 4) * 3, b - 5, 10, 2);
    c.fillRect(x + w * 0.6, b - 3, 6, 2);
  }
  function drawPigeon(c, x, y, t) {
    var f = Math.sin(t * 22) > 0;
    c.fillStyle = "#8e9aaf";
    c.beginPath();
    c.ellipse(x + 18, y, 16, 9, 0, 0, 7);
    c.fill();
    c.fillStyle = "#6c7a92";
    c.fillRect(x + 28, y - 3, 10, 6);
    c.fillStyle = "#5b6b84";
    c.beginPath();
    c.arc(x + 5, y - 4, 7, 0, 7);
    c.fill();
    c.fillStyle = "#4caf8f";
    c.fillRect(x + 6, y + 1, 7, 4);
    c.fillStyle = "#f4a261";
    c.fillRect(x - 5, y - 4, 5, 3);
    c.fillStyle = "#111";
    c.fillRect(x + 2, y - 7, 2, 2);
    c.fillStyle = "#b8c2d6";
    if (f) {
      c.beginPath();
      c.moveTo(x + 12, y - 4);
      c.lineTo(x + 28, y - 4);
      c.lineTo(x + 22, y - 18);
      c.fill();
    } else {
      c.beginPath();
      c.moveTo(x + 12, y + 2);
      c.lineTo(x + 28, y + 2);
      c.lineTo(x + 22, y + 15);
      c.fill();
    }
  }
  function drawFrisbee(c, x, y, t) {
    c.fillStyle = "rgba(255,255,255,0.35)";
    c.fillRect(x + 34, y - 1, 16, 2);
    c.fillRect(x + 38, y + 4, 10, 2);
    c.fillStyle = "#c2410c";
    c.beginPath();
    c.ellipse(x + 17, y + 2, 17, 6, 0, 0, 7);
    c.fill();
    c.fillStyle = "#fb923c";
    c.beginPath();
    c.ellipse(x + 17, y, 17, 5, 0, 0, 7);
    c.fill();
    c.fillStyle = "#fde68a";
    c.fillRect(x + 10 + Math.sin(t * 30) * 6, y - 1, 6, 2);
  }
  function drawMailman(c, x, b, t) {
    var ph = Math.sin(t * 18) * 6;
    c.fillStyle = "#1f2a44";
    c.fillRect(x + 6 + ph, b - 22, 7, 22);
    c.fillRect(x + 17 - ph, b - 22, 7, 22);
    c.fillStyle = "#111";
    c.fillRect(x + 3 + ph, b - 4, 11, 4);
    c.fillRect(x + 14 - ph, b - 4, 11, 4);
    c.fillStyle = "#4f7cc9";
    c.fillRect(x + 4, b - 46, 22, 26);
    c.fillStyle = "#3a5ea0";
    c.fillRect(x + 4, b - 30, 22, 3);
    c.fillStyle = "#8b5a2b";
    c.fillRect(x + 16, b - 38, 14, 14);
    c.fillRect(x + 4, b - 46, 4, 20);
    c.fillStyle = "#fff";
    c.fillRect(x + 19, b - 36, 8, 5);
    c.fillStyle = "#e0ac69";
    c.fillRect(x - 3, b - 42 - ph / 2, 8, 6);
    c.fillStyle = "#f1c27d";
    c.fillRect(x + 7, b - 60, 16, 14);
    c.fillStyle = "#111";
    c.fillRect(x + 9, b - 55, 3, 3);
    c.fillStyle = "#6b3e1f";
    c.fillRect(x + 8, b - 49, 8, 2);
    c.fillStyle = "#1f3b73";
    c.fillRect(x + 6, b - 64, 18, 6);
    c.fillRect(x + 1, b - 60, 10, 3);
  }
  function drawDog(G, c, x, fy, s) {
    var air = !s.ground && !s.dead,
      run = s.run;
    var leg = air ? 0 : Math.sin(run) * 5;
    c.save();
    if (s.spin > 0) {
      c.translate(x, fy - 26);
      c.rotate(-(1 - s.spin) * Math.PI * 2);
      c.translate(-x, -(fy - 26));
    }
    var tan = "#c98b4f",
      dk = "#8a5a2e";
    c.fillStyle = dk;
    if (air) {
      c.fillRect(x - 22, fy - 14, 7, 9);
      c.fillRect(x - 12, fy - 14, 7, 9);
      c.fillRect(x + 4, fy - 16, 7, 9);
      c.fillRect(x + 12, fy - 16, 7, 9);
    } else {
      c.fillRect(x - 22 + leg, fy - 12, 7, 12);
      c.fillRect(x - 12 - leg, fy - 12, 7, 12);
      c.fillRect(x + 4 - leg, fy - 12, 7, 12);
      c.fillRect(x + 12 + leg, fy - 12, 7, 12);
    }
    c.fillStyle = tan;
    c.fillRect(x - 26, fy - 32, 44, 22);
    c.fillStyle = "#e8c39a";
    c.fillRect(x - 18, fy - 16, 28, 6);
    c.fillStyle = dk;
    c.fillRect(x - 31, fy - 33, 7, 6);
    c.fillStyle = "#e63946";
    c.fillRect(x + 6, fy - 34, 12, 5);
    var bob = s.ground && !s.dead ? Math.abs(Math.sin(run)) * -2 : 0;
    var face = s.dead ? ":dawgpain:" : s.flash > 0 ? ":dawgpog:" : s.time > 45 && s.speed > 420 ? ":dawgsweat:" : ":dawgW:";
    G.img(c, face, x + 16, fy - 40 + bob, 44);
    c.restore();
  }
  defGame({
    key: "hop",
    name: "Hydrant Hop",
    icon: "🧯",
    max: 99999,
    blurb: "Run, jump the hydrants, grab the bones.",
    how: "The pup runs on his own. Tap anywhere to jump, tap again in the air to double jump. Hop hydrants, puddles, mailboxes and the mailman. Stay LOW under pigeons and frisbees. Bones are +10. One bonk and it's over.",
    reset: function reset(G) {
      var stars = [];
      for (var i = 0; i < 70; i++) stars.push({
        x: hash(i) * 1000,
        y: hash(i + 99) * 0.55,
        tw: hash(i + 7) * 6
      });
      G.s = {
        y: 0,
        vy: 0,
        ground: true,
        dbl: true,
        coyote: 0,
        buffer: 0,
        spin: 0,
        squash: 0,
        run: 0,
        flash: 0,
        dist: 0,
        speed: speedAt(0),
        time: 0,
        gap: 120,
        obs: [],
        bones: [],
        pops: [],
        nbones: 0,
        dead: 0,
        cause: null,
        mailmanCd: 0,
        stars: stars,
        score: 0
      };
    },
    update: function update(G, dt) {
      var s = G.s,
        g = gy(G),
        dx = dogX(G);
      if (s.dead) {
        s.vy += GRAV * dt;
        s.y += s.vy * dt;
        s.dead -= dt;
        if (s.dead <= 0) {
          s.dead = 0.0001;
          G.over(Math.min(99999, s.score), DEATH[s.cause] || "Ruff.");
        }
        return;
      }
      s.time += dt;
      s.speed = speedAt(s.time);
      var mv = s.speed * dt;
      s.dist += mv;
      s.run += dt * (8 + s.speed / 40);
      if (!s.ground) {
        s.vy += GRAV * dt;
        s.y -= s.vy * dt;
        if (s.y <= 0) {
          s.y = 0;
          s.vy = 0;
          s.ground = true;
          s.dbl = true;
          if (s.buffer > 0) {
            s.buffer = 0;
            jump(G);
          }
        }
      }
      s.coyote = Math.max(0, s.coyote - dt);
      s.buffer = Math.max(0, s.buffer - dt);
      if (s.spin > 0) s.spin = Math.max(0, s.spin - dt * 2.6);
      if (s.flash > 0) s.flash -= dt;
      s.gap -= mv;
      if (s.gap <= 0) spawn(G);
      var fy = g - s.y;
      var hx0 = dx - 22,
        hx1 = dx + 30,
        hy0 = fy - 52,
        hy1 = fy - 2;
      for (var i = s.obs.length - 1; i >= 0; i--) {
        var o = s.obs[i];
        o.x -= mv + o.v * dt;
        if (o.x + o.w < -60) {
          s.obs.splice(i, 1);
          continue;
        }
        var ox0 = void 0,
          ox1 = void 0,
          oy0 = void 0,
          oy1 = void 0;
        if (o.k === "pigeon" || o.k === "frisbee") {
          ox0 = o.x + 4;
          ox1 = o.x + o.w - 4;
          oy0 = o.y - 7;
          oy1 = o.y + 7;
        } else if (o.k === "puddle") {
          ox0 = o.x + 12;
          ox1 = o.x + o.w - 12;
          oy0 = g - 4;
          oy1 = g + 4;
        } else {
          ox0 = o.x + 4;
          ox1 = o.x + o.w - 4;
          oy0 = g - o.h + 6;
          oy1 = g;
        }
        if (ox1 > hx0 && ox0 < hx1 && oy1 > hy0 && oy0 < hy1) {
          die(G, o.k);
          return;
        }
      }
      for (var _i = s.bones.length - 1; _i >= 0; _i--) {
        var b = s.bones[_i];
        b.x -= mv;
        if (b.x < -30) {
          s.bones.splice(_i, 1);
          continue;
        }
        if (Math.abs(b.x - (dx + 6)) < 30 && Math.abs(b.y - (fy - 30)) < 34) {
          s.bones.splice(_i, 1);
          s.nbones++;
          s.flash = 0.35;
          G.sfx("win");
          s.pops.push({
            x: b.x,
            y: b.y,
            t: 0.6
          });
        }
      }
      for (var _i2 = s.pops.length - 1; _i2 >= 0; _i2--) {
        s.pops[_i2].t -= dt;
        if (s.pops[_i2].t <= 0) s.pops.splice(_i2, 1);
      }
      s.score = Math.min(99999, Math.floor(s.dist / 10) + s.nbones * 10);
    },
    tap: function tap(G) {
      jump(G);
    },
    onKey: function onKey(G, k, d) {
      if (d && (k === " " || k === "ArrowUp" || k === "w")) jump(G);
    },
    draw: function draw(G, c) {
      var s = G.s,
        W = G.W,
        H = G.H,
        dark = G.dark(),
        g = gy(G),
        t = G.t,
        dist = s.dist || 0;
      var sky = c.createLinearGradient(0, 0, 0, g);
      if (dark) {
        sky.addColorStop(0, "#0b1033");
        sky.addColorStop(1, "#2a2f6b");
      } else {
        sky.addColorStop(0, "#5ec4ff");
        sky.addColorStop(1, "#c8ecff");
      }
      c.fillStyle = sky;
      c.fillRect(0, 0, W, g);
      if (dark) {
        c.fillStyle = "#fff";
        (s.stars || []).forEach(function (st) {
          var x = ((st.x - dist * 0.03) % 1000 + 1000) % 1000;
          if (x < W) {
            var on = Math.sin(t * 2 + st.tw) > -0.6;
            if (on) c.fillRect(x, 34 + st.y * (g - 160), 2, 2);
          }
        });
        c.fillStyle = "#fdf6c8";
        c.beginPath();
        c.arc(W - 70, 80, 22, 0, 7);
        c.fill();
        c.fillStyle = "#e7dea0";
        c.fillRect(W - 78, 72, 6, 6);
        c.fillRect(W - 64, 88, 5, 5);
      } else {
        c.fillStyle = "#ffe066";
        c.beginPath();
        c.arc(W - 64, 78, 22, 0, 7);
        c.fill();
        c.fillStyle = "#fff";
        var co = dist * 0.06;
        for (var i = 0; i < 4; i++) {
          var x = ((i * 170 - co) % 680 + 680) % 680 - 80,
            y = 60 + i % 3 * 38;
          c.fillRect(x, y, 56, 12);
          c.fillRect(x + 10, y - 8, 30, 8);
          c.fillRect(x + 30, y - 4, 18, 4);
        }
      }
      var tOff = dist * 0.12;
      c.fillStyle = dark ? "#16304a" : "#7fbf7f";
      for (var _i3 = Math.floor(tOff / 60) - 1; _i3 * 60 - tOff < W + 60; _i3++) {
        var _x = _i3 * 60 - tOff,
          hh = 30 + hash(_i3 * 3.1) * 60;
        c.beginPath();
        c.arc(_x + 30, g - 70 - hh * 0.6, 30 + hash(_i3) * 12, 0, 7);
        c.fill();
      }
      c.fillRect(0, g - 76, W, 70);
      var hOff = dist * 0.3,
        TW = 160;
      for (var _i4 = Math.floor(hOff / TW) - 1; _i4 * TW - hOff < W + TW; _i4++) {
        var _x2 = Math.round(_i4 * TW - hOff),
          r = hash(_i4),
          base = g - 14;
        if (r < 0.2) {
          c.fillStyle = dark ? "#3b2a1c" : "#7a4e2d";
          c.fillRect(_x2 + 72, base - 40, 12, 40);
          c.fillStyle = dark ? "#1e4d2b" : "#3fa34d";
          c.fillRect(_x2 + 52, base - 86, 52, 48);
          c.fillRect(_x2 + 60, base - 100, 36, 14);
          c.fillStyle = dark ? "#245c33" : "#58bf63";
          c.fillRect(_x2 + 58, base - 82, 16, 12);
          continue;
        }
        var pal = HOUSE[Math.floor(hash(_i4 + 50) * HOUSE.length)],
          hw = 104 + Math.round(hash(_i4 + 3) * 30),
          _hh = 70 + Math.round(hash(_i4 + 4) * 40);
        var hx = _x2 + 10;
        c.fillStyle = dark ? pal[1] : pal[0];
        c.fillRect(hx, base - _hh, hw, _hh);
        c.fillStyle = dark ? "#2b1d2e" : "#5c3a3a";
        c.beginPath();
        c.moveTo(hx - 8, base - _hh);
        c.lineTo(hx + hw / 2, base - _hh - 34);
        c.lineTo(hx + hw + 8, base - _hh);
        c.fill();
        c.fillStyle = dark ? "#3a2a3e" : "#7a4f4f";
        c.fillRect(hx + hw * 0.7, base - _hh - 30, 12, 20);
        c.fillStyle = dark ? "#2a1a10" : "#6b4423";
        c.fillRect(hx + hw / 2 - 9, base - 30, 18, 30);
        var lit = dark ? hash(_i4 + 9) > 0.3 ? "#ffd166" : "#334" : "#bde0fe";
        c.fillStyle = lit;
        c.fillRect(hx + 12, base - _hh + 14, 20, 16);
        c.fillRect(hx + hw - 32, base - _hh + 14, 20, 16);
        c.fillStyle = dark ? "#1a1a2a" : "#fff";
        c.fillRect(hx + 21, base - _hh + 14, 2, 16);
        c.fillRect(hx + hw - 23, base - _hh + 14, 2, 16);
      }
      c.fillStyle = dark ? "#1d4a26" : "#5cb85c";
      c.fillRect(0, g - 16, W, 10);
      var fOff = dist * 0.6;
      c.fillStyle = dark ? "#8b8fa8" : "#ffffff";
      for (var _i5 = Math.floor(fOff / 20) - 1; _i5 * 20 - fOff < W + 20; _i5++) {
        var _x3 = Math.round(_i5 * 20 - fOff);
        c.fillRect(_x3, g - 44, 12, 34);
        c.fillRect(_x3 + 2, g - 48, 8, 4);
        c.fillRect(_x3 + 4, g - 51, 4, 3);
      }
      c.fillRect(0, g - 38, W, 5);
      c.fillRect(0, g - 22, W, 5);
      c.fillStyle = dark ? "rgba(0,0,0,0.18)" : "rgba(0,0,0,0.08)";
      c.fillRect(0, g - 33, W, 2);
      var LW = 300;
      for (var _i6 = Math.floor(fOff / LW) - 1; _i6 * LW - fOff < W + LW; _i6++) {
        var _x4 = Math.round(_i6 * LW - fOff + 140);
        if (dark) {
          var gl = c.createRadialGradient(_x4 + 14, g - 116, 4, _x4 + 14, g - 60, 90);
          gl.addColorStop(0, "rgba(255,220,120,0.45)");
          gl.addColorStop(1, "rgba(255,220,120,0)");
          c.fillStyle = gl;
          c.beginPath();
          c.moveTo(_x4 + 6, g - 112);
          c.lineTo(_x4 + 22, g - 112);
          c.lineTo(_x4 + 70, g - 4);
          c.lineTo(_x4 - 42, g - 4);
          c.fill();
        }
        c.fillStyle = dark ? "#3c4258" : "#4a4f63";
        c.fillRect(_x4, g - 120, 5, 116);
        c.fillRect(_x4, g - 120, 22, 4);
        c.fillStyle = dark ? "#ffe9a8" : "#d9d9d9";
        c.fillRect(_x4 + 12, g - 116, 12, 5);
      }
      c.fillStyle = dark ? "#6e7183" : "#c9c6bd";
      c.fillRect(0, g - 6, W, 22);
      c.fillStyle = dark ? "#5a5d6e" : "#aeaaa0";
      c.fillRect(0, g - 6, W, 2);
      var sOff = dist % 64;
      for (var _x5 = -sOff; _x5 < W; _x5 += 64) c.fillRect(Math.round(_x5), g - 6, 2, 22);
      c.fillStyle = dark ? "#9497a8" : "#e2dfd6";
      c.fillRect(0, g + 16, W, 6);
      c.fillStyle = dark ? "#23252f" : "#4a4c56";
      c.fillRect(0, g + 22, W, H - g - 22);
      c.fillStyle = "#f4d35e";
      var rOff = dist % 80;
      for (var _x6 = -rOff; _x6 < W; _x6 += 80) c.fillRect(Math.round(_x6), g + 22 + (H - g - 22) / 2 - 2, 40, 4);
      if (dark) {
        c.fillStyle = "rgba(10,12,40,0.22)";
        c.fillRect(0, 0, W, H);
      }
      c.fillStyle = "#fff";
      (s.bones || []).forEach(function (b) {
        if (b.x < W + 30) G.emoji(c, "🦴", b.x, b.y + Math.sin(t * 5 + b.x * 0.05) * 3, 24);
      });
      (s.obs || []).forEach(function (o) {
        if (o.x > W + 10) {
          if (o.k === "mailman" && o.x < W + 260) {
            var blink = Math.sin(t * 16) > 0;
            G.text(c, "!", W - 18, g - 72, 18, blink ? "#ff4d4d" : "#ffd23f");
            G.text(c, "MAILMAN", W - 32, g - 72, 8, "#ffd23f", "right");
          }
          return;
        }
        if (o.k === "hydrant") drawHydrant(c, o.x, g + 2, dark);else if (o.k === "mailbox") drawMailbox(c, o.x, g + 2);else if (o.k === "puddle") drawPuddle(c, o.x, o.w, g + 2, t);else if (o.k === "pigeon") drawPigeon(c, o.x, o.y, t);else if (o.k === "frisbee") drawFrisbee(c, o.x, o.y, t);else if (o.k === "mailman") drawMailman(c, o.x, g + 2, t);
      });
      var dx = dogX(G),
        fy = g - (s.y || 0);
      c.fillStyle = "rgba(0,0,0,0.25)";
      var sw = Math.max(10, 26 - (s.y || 0) / 8);
      c.beginPath();
      c.ellipse(dx, g + 2, sw, 4, 0, 0, 7);
      c.fill();
      drawDog(G, c, dx, fy, s);
      c.fillStyle = "#fff";
      if (s.dead) G.emoji(c, "💥", dx + 30, fy - 40, 30);
      (s.pops || []).forEach(function (p) {
        return G.text(c, "+10", p.x, p.y - 20 - (0.6 - p.t) * 50, 10, "#ffd23f");
      });
      c.fillStyle = "rgba(0,0,0,0.38)";
      c.fillRect(0, 0, W, 30);
      G.text(c, "SCORE ".concat(s.score || 0), 10, 15, 11, "#fff", "left");
      c.fillStyle = "#fff";
      G.emoji(c, "🦴", W - 66, 15, 16);
      G.text(c, "x".concat(s.nbones || 0), W - 10, 15, 11, "#ffd23f", "right");
      if ((s.time || 0) < 4 && G.state === "play") {
        G.text(c, "TAP TO JUMP", W / 2, 70, 12, dark ? "#fff" : "#1b2a4a");
        G.text(c, "TAP AGAIN = DOUBLE JUMP", W / 2, 92, 8, dark ? "#ffd23f" : "#1b2a4a");
      }
      if (s.speed > 300 && s.time > 20 && s.time < 23) G.text(c, "SPEED UP!", W / 2, 70, 12, "#ff6b6b");
    }
  });
})();