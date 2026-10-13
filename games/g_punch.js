// ---------- Pup Punch (behind-the-boxer boxing) ----------
// You're the bulldog seen from behind. Four cartoon opponents telegraph every punch with a glowing, shaking glove.
// Tap left/right half = jab. Swipe left/right = dodge, swipe down = block (swipe up = jab too).
// Punches only land when they're open: after a missed swing (big window), while a 🎯 shows on one side, or right after a clean hit.
// Score: damage dealt + 1000 per KO + 10 x seconds left on the clock. 3 knockdowns = KO. Get KO'd: mash to get up once per fight.
(function () {
  const OPP = [
    { name: "TABBY TYSON", head: "😼", line: "Scratch-weight champ", body: "#f39c34", belly: "#ffd9a0", trunks: "#7b2fbf", glove: "#e0342c",
      wind: 0.95, gap: [1.6, 2.6], rec: 1.55, mix: [0.65, 0.35, 0], combo: 0, tell: 0.35, feint: 0, pow: 1, cnt: 0.2 },
    { name: "MR. WHISKERS", head: "🐱", line: "Nine lives, zero mercy", body: "#a7adb6", belly: "#eceef2", trunks: "#d33a2c", glove: "#2f6fd6",
      wind: 0.85, gap: [1.3, 2.2], rec: 1.4, mix: [0.45, 0.4, 0.15], combo: 0.15, tell: 0.3, feint: 0, pow: 1.1, cnt: 0.28 },
    { name: "ROCKY RACCOON", head: "🦝", line: "Trash-can tough", body: "#6d6a78", belly: "#c4bfcd", trunks: "#2e9d4a", glove: "#f2b705",
      wind: 0.74, gap: [1.0, 1.8], rec: 1.25, mix: [0.35, 0.4, 0.25], combo: 0.3, tell: 0.25, feint: 0.15, pow: 1.2, cnt: 0.35 },
    { name: "THE MAILMAN", head: "📬", line: "Always delivers", body: "#2f5fbf", belly: "#a9c0f0", trunks: "#1d2d5c", glove: "#e0342c",
      wind: 0.64, gap: [0.8, 1.5], rec: 1.1, mix: [0.3, 0.4, 0.3], combo: 0.45, tell: 0.2, feint: 0.12, pow: 1.35, cnt: 0.42 }
  ];
  const ROUND = 90, DODGE = 0.45, BLOCK = 0.6, STRIKE = 0.16, PUNCH = 0.2, HURT = 0.4, MAXS = 99999;
  const DMG = { jab: 10, hook: 14, upper: 22 };
  const TCOL = { jab: "#ffd23f", hook: "#ff8a1f", upper: "#ff3b3b" };
  const rnd = (a, b) => a + Math.random() * (b - a);

  function pop(s, txt, x, y, col, size) { s.pops.push({ txt, x, y, c: col || "#fff", t: 0.8, sz: size || 12 }); if (s.pops.length > 12) s.pops.shift(); }
  function banner(s, txt, col, face, t) { s.ban = { txt, c: col || "#ffd23f", face: face || null, t: t || 1.1, T: t || 1.1 }; }

  function newFight(G, i) {
    const s = G.s, d = OPP[i];
    s.oi = i; s.phase = "intro"; s.pt = 2.2; s.clock = ROUND; s.fdealt = 0; s.ftaken = 0;
    s.o = { hp: 100, kd: 0, st: "idle", t: rnd(d.gap[0], d.gap[1]) + 0.6, wt: 1, atk: null, hitT: 0, hitSide: 1, hits: 0, vul: 0, chain: 0, tside: 1, combo: 0, feint: false };
    s.ban = null; s.pops.length = 0;
    s.p = { hp: 100, st: "idle", t: 0, dir: 0, pt: 0, ps: -1, pc: 0, getups: 0, alt: 1, hurtT: 0 };
  }
  function startAttack(G, fast) {
    const s = G.s, o = s.o, d = OPP[s.oi], r = Math.random();
    const type = r < d.mix[0] ? "jab" : r < d.mix[0] + d.mix[1] ? "hook" : "upper";
    o.atk = { type, side: Math.random() < 0.5 ? -1 : 1 };
    o.st = "wind"; o.wt = o.t = d.wind * (fast ? 0.8 : 1) * (type === "upper" ? 1.15 : 1);
    o.feint = !fast && Math.random() < d.feint;
    if (!fast && o.combo <= 0 && Math.random() < d.combo) o.combo = Math.random() < 0.4 ? 2 : 1;
  }
  function resolve(G) {
    const s = G.s, o = s.o, p = s.p, a = o.atk, d = OPP[s.oi], W = G.W, H = G.H;
    let res;
    if (p.st === "dodge") res = a.type === "hook" && p.dir === a.side ? "hit" : "miss";
    else if (p.st === "block") res = a.type === "upper" ? "hit" : a.type === "hook" ? "chip" : "blocked";
    else res = "hit";
    if (res === "miss") {
      o.st = "open"; o.t = d.rec; o.hits = 0; o.combo = 0;
      pop(s, "MISS! HIT 'EM!", W / 2, H * 0.6, "#7CFC6B", 11); G.sfx("pop");
    } else if (res === "hit") {
      const dmg = Math.round(DMG[a.type] * d.pow);
      const msg = p.st === "block" ? "GUARD BROKEN!" : p.st === "dodge" ? "WRONG WAY!" : "OOF!";
      p.hp -= dmg; s.ftaken += dmg; p.st = "hurt"; p.t = HURT; p.hurtT = HURT; s.shake = 0.3; G.buzz();
      pop(s, msg + " -" + dmg, W / 2, H * 0.66, "#ff6b6b", 12);
      o.st = "recover"; o.t = 0.45;
      if (p.hp <= 0) playerDown(G);
    } else {
      const dmg = res === "chip" ? 3 : 0;
      p.hp -= dmg; s.ftaken += dmg;
      pop(s, dmg ? "BLOCK -3" : "BLOCKED", W / 2, H * 0.66, "#cfd8ff", 11);
      o.st = "recover"; o.t = 0.4;
      if (p.hp <= 0) playerDown(G);
    }
  }
  function playerDown(G) {
    const s = G.s, p = s.p;
    p.hp = 0; p.st = "down"; s.phase = "pdown"; s.pops.length = 0; s.ban = null; s.mash = 0; s.need = 10 + s.oi * 3; s.shake = 0.5;
    if (p.getups > 0) { s.final = true; s.pt = 2.2; } else { s.final = false; s.pt = 5; }
    G.sfx("lose");
  }
  function oppDown(G) {
    const s = G.s, o = s.o;
    o.kd++; o.hp = 0; o.atk = null; o.combo = 0; o.vul = 0;
    if (o.kd >= 3) {
      s.score += 1000 + Math.ceil(Math.max(0, s.clock)) * 10;
      s.phase = "ko"; s.pt = 3.2; s.kos++; o.st = "down"; o.t = 99;
      banner(s, "K.O.!", "#ffd23f", ":dawgpog:", 3.2); G.sfx("win"); G.buzz();
    } else {
      o.st = "down"; o.t = 2.6; banner(s, "DOWN!", "#ffd23f", null, 1.3); G.sfx("win");
    }
  }
  function punch(G, side) {
    const s = G.s, p = s.p, o = s.o, W = G.W, H = G.H;
    if (s.phase !== "fight" || p.st === "hurt" || p.st === "down" || p.pc > 0) return;
    if (p.st === "dodge" || p.st === "block") { p.st = "idle"; p.t = 0; }
    p.pt = PUNCH; p.ps = side; p.pc = PUNCH;
    let dmg = 0, tag = "";
    if (o.st === "open") {
      dmg = 6; o.hits++; tag = o.hits >= 3 ? "x" + o.hits : "";
      if (o.hits >= 5) { o.st = "recover"; o.t = 0.35; }
    } else if (o.st === "tell") {
      if (side === o.tside) { dmg = 10; tag = "COUNTER!"; o.st = "idle"; o.t = 0.9; o.vul = 0.5; o.chain = 0; }
      else { pop(s, "OTHER SIDE!", W / 2, H * 0.62, "#cfd8ff", 11); }
    } else if (o.st === "idle" && o.vul > 0) {
      dmg = 6; o.chain++; o.vul = 0.45;
      if (o.chain >= 4) { o.vul = 0; o.t = 0.1; }
    } else if (o.st !== "down") {
      pop(s, "GUARD", W / 2 + side * 40, H * 0.4, "#cfd8ff", 10);
      if (o.st === "idle" && Math.random() < OPP[s.oi].cnt) o.t = Math.min(o.t, 0.12);
    }
    if (dmg) {
      o.hp -= dmg; o.hitT = 0.18; o.hitSide = side; s.score += dmg; s.fdealt += dmg;
      pop(s, tag ? tag : "+" + dmg, W / 2 + side * 50, H * 0.26, tag === "COUNTER!" ? "#7CFC6B" : "#ffd23f", tag === "COUNTER!" ? 12 : 13);
      G.sfx("pop");
      if (o.hp <= 0) oppDown(G);
    }
  }
  function dodge(G, dir) {
    const s = G.s, p = s.p;
    if (s.phase !== "fight" || p.st === "hurt" || p.st === "down" || p.st === "cool" || p.st === "dodge") return;
    p.st = "dodge"; p.dir = dir; p.t = DODGE;
  }
  function block(G) {
    const s = G.s, p = s.p;
    if (s.phase !== "fight" || p.st === "hurt" || p.st === "down" || p.st === "dodge") return;
    p.st = "block"; p.t = BLOCK;
  }
  function mash(G) {
    const s = G.s, p = s.p;
    if (s.phase !== "pdown" || s.final) return;
    s.mash++; G.sfx("pop");
    if (s.mash >= s.need) {
      p.hp = 45; p.getups++; p.st = "idle"; p.t = 0; s.phase = "fight";
      s.o.st = "idle"; s.o.t = 1.6; s.o.atk = null; s.o.combo = 0;
      banner(s, "BACK UP!", "#7CFC6B", ":dawgW:", 1.1);
    }
  }

  defGame({
    key: "punch", name: "Pup Punch", icon: "🥊", max: MAXS, cat: "sports",
    blurb: "Dodge, counter, knock 'em out.",
    how: "Tap the left or right half to jab. Swipe left/right to dodge, swipe down to block. Watch the glowing glove: yellow = jab (dodge or block), orange = hook (dodge AWAY from that glove), red = uppercut (dodge, don't block). Hit back after they miss, or when a 🎯 shows on one side. 3 knockdowns = KO. Beat all 4 to be champ.",
    reset(G) {
      G.s = { score: 0, kos: 0, pops: [], ban: null, shake: 0, mash: 0, need: 10, final: false, t: 0 };
      newFight(G, 0);
    },
    update(G, dt) {
      const s = G.s, p = s.p, o = s.o, d = OPP[s.oi];
      s.t += dt;
      for (const q of s.pops) q.t -= dt;
      if (s.pops.length && s.pops[0].t <= 0) s.pops = s.pops.filter(q => q.t > 0);
      if (s.ban) { s.ban.t -= dt; if (s.ban.t <= 0) s.ban = null; }
      if (s.shake > 0) s.shake -= dt;
      p.pt = Math.max(0, p.pt - dt); p.pc = Math.max(0, p.pc - dt); p.hurtT = Math.max(0, p.hurtT - dt);
      o.hitT = Math.max(0, o.hitT - dt);

      if (s.phase === "intro") {
        s.pt -= dt;
        if (s.pt <= 0) { s.phase = "fight"; banner(s, "FIGHT!", "#ffd23f", null, 0.9); G.sfx("pop"); }
        return;
      }
      if (s.phase === "ko") {
        s.pt -= dt;
        if (s.pt <= 0) {
          if (s.oi >= OPP.length - 1) { G.over(Math.min(MAXS, s.score), "Champ of the yard!"); return; }
          newFight(G, s.oi + 1);
        }
        return;
      }
      if (s.phase === "pdown") {
        s.pt -= dt;
        if (s.pt <= 0) G.over(Math.min(MAXS, s.score), s.final ? "Down for the count!" : "Couldn't beat the count!");
        return;
      }
      // ---- fight ----
      s.clock -= dt;
      if (s.clock <= 0) {
        s.clock = 0;
        if (s.fdealt > s.ftaken) {
          s.score += 300; s.kos++; s.phase = "ko"; s.pt = 2.6; o.st = "idle"; o.atk = null;
          banner(s, "DECISION!", "#7CFC6B", ":dawgW:", 2.6); G.sfx("win");
        } else { G.over(Math.min(MAXS, s.score), "Lost on points."); }
        return;
      }
      if (p.st !== "idle") {
        p.t -= dt;
        if (p.t <= 0) { if (p.st === "dodge") { p.st = "cool"; p.t = 0.12; } else { p.st = "idle"; p.t = 0; } }
      }
      o.vul = Math.max(0, o.vul - dt);
      o.t -= dt;
      switch (o.st) {
        case "idle":
          if (o.t <= 0) {
            if (o.combo <= 0 && Math.random() < d.tell) { o.st = "tell"; o.t = 0.9; o.tside = Math.random() < 0.5 ? -1 : 1; }
            else startAttack(G, false);
          }
          break;
        case "tell": if (o.t <= 0) { o.st = "idle"; o.t = rnd(d.gap[0], d.gap[1]) * 0.6; } break;
        case "wind":
          if (o.feint && o.t < o.wt * 0.35) { o.st = "idle"; o.t = 0.45; o.atk = null; pop(s, "FAKE!", G.W / 2, G.H * 0.18, "#cfd8ff", 11); }
          else if (o.t <= 0) { o.st = "strike"; o.t = STRIKE; }
          break;
        case "strike": if (o.t <= 0) resolve(G); break;
        case "open": if (o.t <= 0) { o.st = "idle"; o.t = rnd(d.gap[0], d.gap[1]) * 0.7; } break;
        case "recover":
          if (o.t <= 0) {
            if (o.combo > 0 && s.phase === "fight") { o.combo--; startAttack(G, true); }
            else { o.combo = 0; o.st = "idle"; o.t = rnd(d.gap[0], d.gap[1]); }
          }
          break;
        case "down":
          if (o.t <= 0) { o.hp = o.kd === 1 ? 60 : 40; o.st = "idle"; o.t = 1.2; p.hp = Math.min(100, p.hp + 15); banner(s, "HE'S UP!", "#ff8a1f", null, 0.9); }
          break;
      }
    },
    tap(G, x) { if (G.s.phase === "pdown") mash(G); else punch(G, x < G.W / 2 ? -1 : 1); },
    swipe(G, dx, dy) {
      if (G.s.phase === "pdown") { mash(G); return; }
      if (dx) dodge(G, dx); else if (dy > 0) block(G); else { G.s.p.alt *= -1; punch(G, G.s.p.alt); }
    },
    onKey(G, k, isDown) {
      if (!isDown) return;
      if (G.s.phase === "pdown") { mash(G); return; }
      if (k === "ArrowLeft") dodge(G, -1);
      else if (k === "ArrowRight") dodge(G, 1);
      else if (k === "ArrowDown" || k === "s") block(G);
      else if (k === "a") punch(G, -1);
      else if (k === "d") punch(G, 1);
      else if (k === "ArrowUp" || k === " " || k === "w") { G.s.p.alt *= -1; punch(G, G.s.p.alt); }
    },
    draw(G, c) {
      const s = G.s, W = G.W, H = G.H, dark = G.dark(), o = s.o, p = s.p, d = OPP[s.oi], t = s.t;
      c.save();
      if (s.shake > 0) c.translate((Math.random() - 0.5) * 12 * s.shake / 0.3, (Math.random() - 0.5) * 8 * s.shake / 0.3);
      // --- arena: crowd ---
      const ringY = H * 0.47;
      c.fillStyle = dark ? "#120f1f" : "#2b2350"; c.fillRect(-10, -10, W + 20, ringY + 20);
      const cc = ["#ff6b6b", "#ffd23f", "#7cc35b", "#5aa9ff", "#c78bff", "#ffffff"];
      for (let r = 0; r < 6; r++) {
        const yy = 52 + r * 22;
        if (yy > ringY - 50) break;
        for (let x = (r % 2) * 11; x < W; x += 22) {
          const i = (x * 7 + r * 13) % 6, bob = Math.sin(t * 6 + x * 0.3 + r) * (s.phase === "ko" ? 4 : 1);
          c.fillStyle = cc[i]; c.globalAlpha = dark ? 0.35 : 0.5;
          c.beginPath(); c.arc(x + 6, yy + bob, 6, 0, 7); c.fill(); c.fillRect(x, yy + 5 + bob, 12, 10);
        }
      }
      c.globalAlpha = 1;
      // spotlight
      const gr = c.createRadialGradient(W / 2, ringY, 10, W / 2, ringY, W * 0.7);
      gr.addColorStop(0, dark ? "rgba(255,240,200,0.18)" : "rgba(255,250,220,0.35)"); gr.addColorStop(1, "rgba(0,0,0,0)");
      c.fillStyle = gr; c.fillRect(0, 0, W, H);
      // mat
      c.fillStyle = dark ? "#3a4560" : "#d9e4f2";
      c.beginPath(); c.moveTo(W * 0.12, ringY); c.lineTo(W * 0.88, ringY); c.lineTo(W + 60, H + 10); c.lineTo(-60, H + 10); c.closePath(); c.fill();
      c.fillStyle = dark ? "#2c3550" : "#c3d2e6";
      c.beginPath(); c.moveTo(-60, H + 10); c.lineTo(W * 0.12, ringY); c.lineTo(0, ringY); c.lineTo(0, H); c.fill();
      c.beginPath(); c.moveTo(W + 60, H + 10); c.lineTo(W * 0.88, ringY); c.lineTo(W, ringY); c.lineTo(W, H); c.fill();
      // posts + ropes (behind the opponent)
      c.fillStyle = dark ? "#aab" : "#eee"; c.fillRect(W * 0.12 - 5, ringY - 82, 10, 84); c.fillRect(W * 0.88 - 5, ringY - 82, 10, 84);
      ["#e0342c", "#ffffff", "#2f6fd6"].forEach((col, i) => { c.fillStyle = col; c.fillRect(W * 0.12, ringY - 74 + i * 24, W * 0.76, 5); });

      drawOpp(G, c, s, d, W, H, t, dark);
      drawPup(G, c, s, W, H, t);
      c.restore();

      // pops
      for (const q of s.pops) { if (q.t <= 0) continue; const a = Math.min(1, q.t * 3); c.globalAlpha = a; G.text(c, q.txt, q.x + 2, q.y - (0.8 - q.t) * 40 + 2, q.sz, "#000"); G.text(c, q.txt, q.x, q.y - (0.8 - q.t) * 40, q.sz, q.c); }
      c.globalAlpha = 1;

      // --- overlays ---
      if (s.phase === "intro") {
        c.fillStyle = "rgba(8,6,20,0.92)"; c.fillRect(0, 0, W, H);
        const y0 = Math.max(110, H * 0.3);
        G.text(c, `FIGHT ${s.oi + 1} OF 4`, W / 2, y0, 12, "#cfd8ff");
        G.emoji(c, d.head, W / 2, y0 + 66, 80);
        G.text(c, d.name, W / 2 + 2, y0 + 134, 18, "#000"); G.text(c, d.name, W / 2, y0 + 132, 18, "#ffd23f");
        G.text(c, d.line.toUpperCase(), W / 2, y0 + 162, 10, "#fff");
        G.text(c, "VS", W / 2, y0 + 194, 13, "#ff6b6b");
        G.img(c, ":dawgW:", W / 2, y0 + 240, 60);
      }
      if (s.phase === "pdown") {
        c.fillStyle = "rgba(60,0,0,0.6)"; c.fillRect(0, 0, W, H);
        G.img(c, ":dawgpain:", W / 2, H * 0.3, 90);
        if (s.final) {
          G.banner(c, "DOWN FOR GOOD", "#ff6b6b", H * 0.5, 18);
        } else {
          const n = Math.min(10, Math.floor((5 - s.pt) / 0.5) + 1);
          G.banner(c, String(n), "#fff", H * 0.48, 40);
          G.text(c, "GET UP! TAP TAP TAP!", W / 2, H * 0.6, 12, "#ffd23f");
          bar(c, W * 0.2, H * 0.66, W * 0.6, 14, s.mash / s.need, "#7CFC6B");
        }
      }
      if (s.ban) {
        const b = s.ban, k = 1 - b.t / b.T, big = b.txt === "K.O.!" || b.txt === "DECISION!";
        const zoom = k < 0.12 ? 0.5 + k * 4.2 : 1;
        if (b.txt === "K.O.!" && Math.floor(t * 8) % 2) { c.fillStyle = "rgba(255,210,63,0.18)"; c.fillRect(0, 0, W, H); }
        const by = big ? H * 0.34 : H * 0.42, sz = (big ? Math.min(44, W / 8) : 28) * zoom;
        if (b.face) G.img(c, b.face, W / 2, by - 66, 72);
        G.banner(c, b.txt, b.c, by, sz);
        if (big) {
          const bonus = b.txt === "K.O.!" ? "+1000 KO BONUS" : "+300 DECISION";
          c.fillStyle = "rgba(0,0,0,0.6)"; c.fillRect(W / 2 - 100, by + 30, 200, 26); G.text(c, bonus, W / 2, by + 43, 10, "#fff");
        }
      }

      // --- HUD: shared top bar + a compact health row ---
      const cl = Math.ceil(s.clock), top = G.hud(c, `SCORE ${s.score}`, `${Math.floor(cl / 60)}:${String(cl % 60).padStart(2, "0")}`, `FIGHT ${s.oi + 1}/4`, { color: s.clock < 15 ? "#ff6b6b" : "#ffd23f" });
      const rh = 36, bw = Math.max(80, (W - 72 - 64) / 2);
      c.fillStyle = "rgba(10,10,20,0.62)"; c.fillRect(0, top, W, rh);
      G.img(c, p.hp < 30 ? ":dawgsweat:" : p.hurtT > 0 ? ":dawgpain:" : ":dawgW:", 18, top + rh / 2, 28);
      bar(c, 36, top + 7, bw, 9, p.hp / 100, p.hp < 30 ? "#ff6b6b" : "#7CFC6B");
      G.text(c, "PUP", 36, top + 27, 10, "#fff", "left");
      G.emoji(c, d.head, W - 18, top + rh / 2, 24);
      bar(c, W - 36 - bw, top + 7, bw, 9, Math.max(0, o.hp) / 100, "#ffd23f", true);
      G.text(c, d.name, W - 36, top + 27, 10, "#fff", "right");
      for (let i = 0; i < 3; i++) { c.globalAlpha = i < o.kd ? 1 : 0.3; G.emoji(c, "⭐", W / 2 - 16 + i * 16, top + 12, 13); }
      c.globalAlpha = 1;
      // controls hint at the start of the first fight
      if (s.oi === 0 && s.phase === "fight") {
        G.hint(c, "TAP LEFT/RIGHT = JAB", 8, H - 70);
        G.hint(c, "SWIPE ◀▶ DODGE  ▼ BLOCK", 8, H - 32);
      }
    }
  });

  function bar(c, x, y, w, h, f, col, rtl) {
    f = Math.max(0, Math.min(1, f));
    c.fillStyle = "#000"; c.fillRect(x - 2, y - 2, w + 4, h + 4);
    c.fillStyle = "#3a3a46"; c.fillRect(x, y, w, h);
    c.fillStyle = col; if (rtl) c.fillRect(x + w * (1 - f), y, w * f, h); else c.fillRect(x, y, w * f, h);
    c.fillStyle = "rgba(255,255,255,0.35)"; c.fillRect(x, y, w, 2);
  }

  function glove(c, x, y, r, col) {
    c.fillStyle = "#000"; c.beginPath(); c.arc(x, y, r + 2, 0, 7); c.fill();
    c.fillStyle = col; c.beginPath(); c.arc(x, y, r, 0, 7); c.fill();
    c.fillStyle = "rgba(255,255,255,0.45)"; c.beginPath(); c.arc(x - r * 0.35, y - r * 0.35, r * 0.28, 0, 7); c.fill();
    c.fillStyle = "#fff"; c.fillRect(x - r * 0.6, y + r * 0.7, r * 1.2, r * 0.35);
  }

  function drawOpp(G, c, s, d, W, H, t, dark) {
    const o = s.o, hs = Math.min(W * 0.3, H * 0.2), cy = H * 0.24 + 20;
    if (o.st === "down") {
      // lying on the mat with a count
      const y = H * 0.5;
      c.fillStyle = d.body; c.beginPath(); c.ellipse(W / 2 + hs * 0.2, y, hs * 0.8, hs * 0.3, 0, 0, 7); c.fill();
      c.fillStyle = d.trunks; c.fillRect(W / 2 + hs * 0.55, y - hs * 0.28, hs * 0.35, hs * 0.56);
      c.save(); c.translate(W / 2 - hs * 0.7, y - 4); c.rotate(-1.4); G.emoji(c, d.head, 0, 0, hs * 0.85); c.restore();
      G.emoji(c, "💫", W / 2 - hs * 0.7, y - hs * 0.55 + Math.sin(t * 5) * 4, 26);
      if (s.phase === "fight") {
        const n = Math.min(10, Math.floor((2.6 - o.t) / 0.26) + 1);
        G.text(c, String(n), W / 2 + 3, H * 0.28 + 3, 34, "#000"); G.text(c, String(n), W / 2, H * 0.28, 34, "#fff");
      }
      return;
    }
    let x = W / 2 + Math.sin(t * 1.7) * 6, y = cy + Math.abs(Math.sin(t * 3.4)) * 3, rot = 0;
    if (o.hitT > 0) { x += o.hitSide * 14 * (o.hitT / 0.18); rot = o.hitSide * 0.25 * (o.hitT / 0.18); }
    if (o.st === "open") rot += Math.sin(t * 8) * 0.12;
    const winding = o.st === "wind" && o.atk, k = winding ? 1 - o.t / o.wt : 0;
    if (winding) x += (Math.random() - 0.5) * 3 * (0.5 + k);
    // body
    c.fillStyle = "#000"; c.beginPath(); c.ellipse(x, y + hs * 1.0, hs * 0.66, hs * 0.66, 0, 0, 7); c.fill();
    c.fillStyle = d.body; c.beginPath(); c.ellipse(x, y + hs * 1.0, hs * 0.62, hs * 0.62, 0, 0, 7); c.fill();
    c.fillStyle = d.belly; c.beginPath(); c.ellipse(x, y + hs * 1.1, hs * 0.36, hs * 0.42, 0, 0, 7); c.fill();
    c.fillStyle = d.trunks; c.fillRect(x - hs * 0.6, y + hs * 1.38, hs * 1.2, hs * 0.42);
    c.fillStyle = "#fff"; c.fillRect(x - hs * 0.6, y + hs * 1.38, hs * 1.2, 4);
    // tell: 🎯 on the open side
    if (o.st === "tell") {
      const tx = x + o.tside * hs * 0.32, ty = y + hs * 1.0, pu = 1 + Math.sin(t * 16) * 0.12;
      c.fillStyle = "rgba(255,240,120,0.5)"; c.beginPath(); c.arc(tx, ty, hs * 0.32 * pu, 0, 7); c.fill();
      G.emoji(c, "🎯", tx, ty, hs * 0.38 * pu);
    }
    // head glow during wind
    if (winding && k > 0.5 && Math.floor(t * 14) % 2) {
      c.fillStyle = TCOL[o.atk.type]; c.globalAlpha = 0.45; c.beginPath(); c.arc(x, y, hs * 0.62, 0, 7); c.fill(); c.globalAlpha = 1;
    }
    // head
    c.save(); c.translate(x, y); c.rotate(rot); G.emoji(c, d.head, 0, 0, hs); c.restore();
    if (o.hitT > 0) G.emoji(c, "💥", x + o.hitSide * hs * 0.25, y + hs * 0.1, hs * 0.5);
    if (o.st === "open") {
      for (let i = 0; i < 3; i++) { const a = t * 4 + i * 2.1; G.emoji(c, "💫", x + Math.cos(a) * hs * 0.55, y - hs * 0.45 + Math.sin(a) * hs * 0.15, 18); }
      if (Math.floor(t * 6) % 2) { G.text(c, "OPEN!", x + 2, y - hs * 0.6 + 2, 13, "#000"); G.text(c, "OPEN!", x, y - hs * 0.6, 13, "#7CFC6B"); }
    }
    // gloves
    for (const side of [-1, 1]) {
      let gx = x + side * hs * 0.5, gy = y + hs * 0.62, r = hs * 0.21;
      if (o.st === "open") { gx += side * hs * 0.18; gy += hs * 0.5; }
      else if (o.st === "tell" && side === o.tside) { gx += side * hs * 0.25; gy += hs * 0.55; }
      const atk = o.atk, me = atk && atk.side === side;
      if (winding && me) {
        if (atk.type === "jab") { gx += side * hs * 0.1 * k; gy -= hs * 0.12 * k; }
        else if (atk.type === "hook") { gx += side * hs * 0.5 * k; gy -= hs * 0.15 * k; }
        else { gx += side * hs * 0.12 * k; gy += hs * 0.5 * k; }
        gx += (Math.random() - 0.5) * 5; gy += (Math.random() - 0.5) * 5;
        const pu = 1 + Math.sin(t * 20) * 0.12;
        c.fillStyle = TCOL[atk.type]; c.globalAlpha = 0.35 + 0.35 * k; c.beginPath(); c.arc(gx, gy, (r + 12) * pu, 0, 7); c.fill(); c.globalAlpha = 1;
        c.strokeStyle = TCOL[atk.type]; c.lineWidth = 4; c.beginPath(); c.arc(gx, gy, (r + 8) * pu, 0, 7); c.stroke();
        const marks = atk.type === "jab" ? "!" : atk.type === "hook" ? "!!" : "!!!";
        G.text(c, marks, gx + 2, gy - r - 20 + 2, 14, "#000"); G.text(c, marks, gx, gy - r - 20, 14, TCOL[atk.type]);
      } else if (o.st === "strike" && me) {
        const q = 1 - o.t / STRIKE;
        let sx = gx + side * hs * (atk.type === "hook" ? 0.5 : 0.1), sy = gy + (atk.type === "upper" ? hs * 0.5 : -hs * 0.12);
        const tx = W / 2 + (atk.type === "hook" ? side * hs * 0.15 : 0), ty = H - 120;
        gx = sx + (tx - sx) * q; gy = sy + (ty - sy) * q; r *= 1 + 1.8 * q;
      }
      glove(c, gx, gy, r, d.glove);
    }
  }

  function drawPup(G, c, s, W, H, t) {
    const p = s.p;
    let off = 0, tilt = 0;
    if (p.st === "dodge") { const k = Math.sin(Math.PI * Math.min(1, (DODGE - p.t) / DODGE)); off = p.dir * W * 0.26 * Math.min(1, k * 1.6); tilt = p.dir * 0.22 * Math.min(1, k * 1.6); }
    const blocking = p.st === "block", hurt = p.st === "hurt", down = p.st === "down";
    const px = W / 2 + off, base = H + 6;
    c.save(); c.translate(px, base); c.rotate(tilt + (hurt ? Math.sin(t * 40) * 0.05 : 0)); if (down) c.translate(0, 60);
    const fawn = "#d9a46a", dk = "#8a5a2b";
    // shoulders / back
    c.fillStyle = "#000"; c.beginPath(); c.ellipse(0, 0, 104, 74, 0, Math.PI, 0); c.fill();
    c.fillStyle = fawn; c.beginPath(); c.ellipse(0, 0, 100, 70, 0, Math.PI, 0); c.fill();
    c.fillStyle = "#c08a52"; c.fillRect(-3, -60, 6, 60);
    // collar
    c.fillStyle = "#e0342c"; c.beginPath(); c.ellipse(0, -62, 48, 14, 0, 0, 7); c.fill();
    c.fillStyle = "#ffd23f"; for (let i = -2; i <= 2; i++) { c.beginPath(); c.arc(i * 18, -60 + Math.abs(i) * -2, 3.5, 0, 7); c.fill(); }
    // head (back view)
    c.fillStyle = "#000"; c.beginPath(); c.ellipse(0, -100, 50, 44, 0, 0, 7); c.fill();
    c.fillStyle = fawn; c.beginPath(); c.ellipse(0, -100, 47, 41, 0, 0, 7); c.fill();
    // ears
    for (const sd of [-1, 1]) {
      c.fillStyle = dk; c.beginPath(); c.moveTo(sd * 30, -134); c.lineTo(sd * 52, -142); c.lineTo(sd * 46, -112); c.closePath(); c.fill();
    }
    c.strokeStyle = "#b07a44"; c.lineWidth = 3;
    c.beginPath(); c.arc(0, -82, 22, 0.2, Math.PI - 0.2); c.stroke();
    c.beginPath(); c.arc(0, -76, 30, 0.35, Math.PI - 0.35); c.stroke();
    if (hurt) { c.fillStyle = "rgba(255,60,60,0.35)"; c.beginPath(); c.ellipse(0, -100, 47, 41, 0, 0, 7); c.fill(); }
    c.restore();
    if (down) return;
    // gloves
    const gs = 62;
    for (const side of [-1, 1]) {
      let gx = px + side * 74, gy = H - 118 + Math.sin(t * 5 + side) * 3, sz = gs;
      if (blocking) { gx = px + side * 26; gy = H - 158; sz = gs * 1.12; }
      if (p.pt > 0 && p.ps === side) {
        const k = Math.sin(Math.PI * (1 - p.pt / PUNCH));
        gx += (W / 2 + side * 26 - gx) * k; gy += (H * 0.37 - gy) * k; sz = gs * (1 - 0.35 * k);
      }
      c.save(); c.translate(gx, gy); c.scale(side > 0 ? -1 : 1, 1); c.rotate(side > 0 ? 0.3 : 0.3); G.emoji(c, "🥊", 0, 0, sz); c.restore();
    }
  }
})();
