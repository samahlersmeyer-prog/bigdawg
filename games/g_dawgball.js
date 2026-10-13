// ---------- Dawg Ball (3-inning baseball vs the Alley Cats) ----------
// Top half: the Cats bat and you PITCH (pick a pitch, tap to stop the aim reticle; corners + variety = outs).
// Bottom half: the Big Dawgs bat (tap to swing; timing decides strike/foul/out/hit).
// Score = your runs x10 + 50 for a win + 10 per strikeout pitched (cap 999).
(function () {
  const PITCHES = [
    { name: "FAST", full: "FASTBALL", fly: 0.42, bat: 0.95, curve: 0, ico: "🔥", wind: 0.6 },
    { name: "CURVE", full: "CURVEBALL", fly: 0.58, bat: 1.15, curve: 1, ico: "🌀", wind: 0.7 },
    { name: "CHANGE", full: "CHANGEUP", fly: 0.66, bat: 1.55, curve: 0, ico: "🐢", wind: 1.0 },
  ];
  const HITS = ["", "SINGLE!", "DOUBLE!", "TRIPLE!", "HOME RUN!"];
  const rnd = (a, b) => a + Math.random() * (b - a);
  function pickW(pairs) { let t = 0; for (const p of pairs) t += p[1]; let r = Math.random() * t; for (const p of pairs) { r -= p[1]; if (r <= 0) return p[0]; } return pairs[pairs.length - 1][0]; }

  // ---------- layout ----------
  function lay(G) {
    const W = G.W, H = G.H;
    return {
      mound: [W / 2, H * 0.36], plate: [W / 2, H * 0.86],
      zc: [W / 2, H * 0.75], zw: 34, zh: 40,                        // batting strike zone (half sizes)
      ac: [W / 2, H * 0.36 + (H - 72 - H * 0.36) * 0.55], aw: Math.min(66, W * 0.17), ah: Math.min(76, H * 0.13), // pitching aim box
      by: H - 64, bh: 54, bw: (W - 24 - 16) / 3,
    };
  }

  // ---------- game flow ----------
  function setMsg(s, txt, col, sub) { s.msg = txt; s.msgC = col; s.sub = sub || ""; }
  function newBatter(s) { if (s.half === 1 && s.phase !== "banner") s.pa++; s.balls = 0; s.strikes = 0; }
  function score(s, n) {
    if (n <= 0) return;
    const bt = s.half === 1 ? 0 : 1;
    s.runs[bt] += n; s.halfRuns += n;
    if (s.half === 1 && s.inning >= 3 && s.runs[0] > s.runs[1]) s.end = true;   // walk-off
    if (s.halfRuns >= (s.half === 0 ? 5 : 7)) s.mercy = true;            // keep halves snappy
  }
  function advance(s, n) {
    let r = 0; const b = s.bases, nb = [0, 0, 0];
    for (let i = 2; i >= 0; i--) if (b[i]) { const to = i + n; if (to >= 3) r++; else nb[to] = 1; }
    if (n >= 4) r++; else nb[n - 1] = 1;
    s.bases = nb; score(s, r); return r;
  }
  function walk(s) {
    const b = s.bases; let r = 0;
    if (b[0]) { if (b[1]) { if (b[2]) r = 1; b[2] = 1; } b[1] = 1; } b[0] = 1;
    score(s, r); newBatter(s); return r;
  }
  function out(s) { s.outs++; newBatter(s); }
  function runsTxt(r) { return r ? (r === 1 ? "1 RUN SCORES" : r + " RUNS SCORE") : ""; }

  function startHalf(G) {
    const s = G.s;
    s.outs = 0; s.bases = [0, 0, 0]; s.halfRuns = 0; s.mercy = false; newBatter(s);
    s.face = ":dawgW:";
    if (s.half === 1) windup(G); else { s.phase = "choose"; s.pt = 0; }
  }
  function banner(G, txt, sub) { const s = G.s; s.phase = "banner"; s.pt = 0; s.btxt = txt; s.bsub = sub; }
  function halfBanner(G) {
    const s = G.s;
    banner(G, (s.half ? "BOTTOM " : "TOP ") + s.inning + (s.inning === 4 ? " (XTRA)" : ""), s.half ? "DAWGS BAT - SWING ON GREEN" : "YOU PITCH - CATS BAT");
  }
  function endHalf(G) {
    const s = G.s, d = s.runs[0], c = s.runs[1];
    if (s.half === 0) {
      if (s.inning >= 3 && d > c) return finish(G);
      s.half = 1;
    } else {
      if (s.inning >= 3 && (d !== c || s.inning >= 4)) return finish(G);
      s.inning++; s.half = 0;
    }
    halfBanner(G);
  }
  function finish(G) {
    const s = G.s, d = s.runs[0], c = s.runs[1];
    s.result = d > c ? "win" : d < c ? "lose" : "tie";
    s.phase = "final"; s.pt = 0;
    s.face = d > c ? ":dawgpog:" : d < c ? ":dawgpain:" : ":dawgsus:";
    G.sfx(d > c ? "win" : "lose");
  }
  function next(G) {
    const s = G.s;
    s.hitBall = null; s.ball = null; s.sw = null; s.catSw = 0;
    if (s.end) return finish(G);
    if (s.outs >= 3 || s.mercy) return endHalf(G);
    if (s.half === 1) { s.face = ":dawgW:"; windup(G); } else { s.phase = "choose"; s.pt = 0; }
  }
  function toResult(G, quick) { G.s.phase = "result"; G.s.pt = 0; G.s.rdur = quick ? 0.8 : 1.15; }

  // ---------- batting ----------
  // The CPU picks the pitch at the start of the wind-up so the pitcher can "show" it (changeup = slow, exaggerated wind-up).
  // A target ring sits where the ball will cross the plate; an outer ring shrinks onto it and lands exactly at contact time.
  // Ring is red when the pitch will be a ball (take it), yellow while incoming, green inside the hit window.
  function winScale(s) { return s.inning <= 1 ? 1.45 : s.inning === 2 ? 1.2 : 1; }   // timing window widens early
  function windows(s) { const w = winScale(s); return [0.045 * (1 + (w - 1) * 0.5), 0.1 * w, 0.16 * w]; }  // perfect / solid / foul-tip (seconds)
  function windup(G) {
    const s = G.s, k = Math.floor(Math.random() * 3), P = PITCHES[k];
    const ramp = 1 - 0.07 * (Math.min(4, s.inning) - 1);
    const slow = s.bp < 3 ? 1.45 : s.bp < 6 ? 1.22 : s.inning === 1 ? 1.08 : 1;   // first pitches of the game come in soft
    const strike = Math.random() < 0.68;
    let tx, ty;
    if (strike) { tx = rnd(-0.8, 0.8); ty = rnd(-0.8, 0.8); }
    else if (Math.random() < 0.5) { tx = (Math.random() < 0.5 ? -1 : 1) * rnd(1.4, 1.65); ty = rnd(-0.9, 0.9); }
    else { tx = rnd(-0.9, 0.9); ty = (Math.random() < 0.5 ? -1 : 1) * rnd(1.4, 1.65); }
    s.ball = { k, dur: Math.min(1.95, P.bat * ramp * slow), ft: 0, tx, ty, inZ: strike, cd: Math.random() < 0.5 ? -1 : 1 };
    s.wdur = P.wind + (s.pa === 0 && s.balls + s.strikes === 0 ? 1.1 : 0);    // first at-bat: time to read the hint
    s.phase = "windup"; s.pt = 0; s.fb = null;
  }
  function newPitch(G) { const s = G.s; s.bp++; s.phase = "flight"; s.pt = 0; s.ball.ft = 0; }
  function swing(G) {
    const s = G.s, b = s.ball;
    if (s.phase !== "flight" || s.sw || !b) return;
    const e = b.ft - b.dur, a = Math.abs(e), [w1, w2, w3] = windows(s);
    let res;
    if (a >= w3) res = "whiff";
    else if (!b.inZ) res = pickW([["foul", 45], ["ground", 32], ["fly", 18], [1, 5]]);   // chased a ball: weak contact at best
    else if (a < w1) res = pickW([[4, 24], [3, 6], [2, 26], [1, 28], ["fly", 16]]);
    else if (a < w2) res = pickW([[1, 34], [2, 14], [4, 4], ["fly", 24], ["ground", 24]]);
    else res = pickW([["foul", 45], ["ground", 25], ["fly", 20], [1, 10]]);
    s.sw = { t: 0, res, early: e < 0 };
    s.fb = a < w1 ? ["PERFECT!", "#7dff8a"] : [e < 0 ? "EARLY" : "LATE", a < w2 ? "#ffd23f" : "#ff8a6b"];
    s.fbSub = !b.inZ ? "THAT WAS A BALL" : "";
    if (res !== "whiff") contact(G);
  }
  function contact(G) {
    const s = G.s, res = s.sw.res, L = lay(G);
    const bx = L.zc[0] + s.ball.tx * L.zw, by = L.zc[1] + s.ball.ty * L.zh;
    let msg, col = "#ffd23f", sub = "";
    if (typeof res === "number") {
      const r = advance(s, res); newBatter(s);
      msg = HITS[res]; sub = runsTxt(r); col = res === 4 ? "#ffd23f" : "#7dff8a";
      s.face = res >= 2 ? ":dawgpog:" : ":dawgW:"; G.sfx(res === 4 ? "win" : "pop");
      s.hitBall = { x: bx, y: by, vx: rnd(-160, 160), vy: -rnd(260, 420) - res * 40, t: 0, hr: res === 4 };
      if (s.mercy && !s.end) sub = "7-RUN LIMIT! SIDE RETIRED";
    } else if (res === "foul") {
      if (s.strikes < 2) s.strikes++;
      msg = "FOUL BALL"; col = "#fff"; G.sfx("pop");
      s.hitBall = { x: bx, y: by, vx: (Math.random() < 0.5 ? -1 : 1) * rnd(260, 360), vy: -rnd(160, 260), t: 0 };
    } else if (res === "fly") {
      let r = 0;
      if (s.outs < 2 && s.bases[2] && Math.random() < 0.6) { s.bases[2] = 0; score(s, 1); r = 1; }
      out(s); msg = "FLY OUT"; col = "#ff8a6b"; sub = r ? "SAC FLY - 1 RUN" : "";
      s.face = ":dawgcope:"; G.sfx("lose");
      s.hitBall = { x: bx, y: by, vx: rnd(-80, 80), vy: -rnd(380, 460), t: 0 };
    } else {
      out(s); msg = "GROUND OUT"; col = "#ff8a6b"; s.face = ":dawgcope:"; G.sfx("lose");
      s.hitBall = { x: bx, y: by, vx: rnd(-120, 120), vy: -rnd(140, 200), t: 0, gr: true };
    }
    setMsg(s, msg, col, sub); toResult(G);
  }
  function judgeTake(G) {   // ball reached the catcher with no contact
    const s = G.s, b = s.ball;
    if (s.sw || b.inZ) {
      s.strikes++;
      if (s.strikes >= 3) { out(s); setMsg(s, "STRUCK OUT", "#ff6b6b", s.sw ? "SWINGING" : "LOOKING"); s.face = ":dawgsweat:"; G.sfx("lose"); G.buzz(); }
      else setMsg(s, s.sw ? "SWING + MISS" : "STRIKE " + s.strikes, "#ff8a6b", s.sw ? "" : "GREEN RING = SWING!");
    } else {
      s.balls++;
      if (s.balls >= 4) { const r = walk(s); setMsg(s, "WALK!", "#7dff8a", s.mercy && !s.end ? "7-RUN LIMIT! SIDE RETIRED" : runsTxt(r)); G.sfx("pop"); }
      else setMsg(s, "BALL", "#9ad7ff", "GOOD EYE! (" + s.balls + " BALL" + (s.balls > 1 ? "S)" : ")"));
    }
    toResult(G, s.balls + s.strikes > 0);   // plain ball/strike: shorter pause
  }

  // ---------- pitching ----------
  function choose(G, k) {
    const s = G.s; if (s.phase !== "choose") return;
    s.rep = s.lastP === k ? s.rep + 1 : 0; s.lastP = k; s.pk = k;
    s.phase = "aim"; s.pt = 0; s.rt = rnd(0, 6); G.sfx("pop");
  }
  function throwIt(G) {
    const s = G.s; if (s.phase !== "aim" || s.pt < 0.2) return;
    const x = s.rx, y = s.ry, P = PITCHES[s.pk];
    const ax = Math.abs(x), ay = Math.abs(y), inZ = ax <= 1 && ay <= 1;
    const q = Math.min(1, 0.5 * Math.max(ax, ay) + 0.5 * (ax + ay) / 2) ;  // 0 = middle-middle, 1 = corner
    const rep = Math.min(3, s.rep), ramp = 0.04 * (s.inning - 1), soft = s.pk > 0 ? 0.05 : 0;
    let res;
    if (!inZ) {
      const chase = 0.28 + soft - rep * 0.06;
      res = Math.random() < chase ? (Math.random() < 0.65 ? "whiff" : "ground") : "ball";
    } else {
      const heat = Math.max(0.05, Math.min(0.95, 0.12 + (1 - q) * 0.55 + rep * 0.18 + ramp));
      const whiff = Math.max(0.04, 0.14 + 0.3 * q + soft - 0.08 * rep), look = Math.max(0.03, 0.1 + 0.14 * q - 0.04 * rep);
      const r = Math.random();
      if (r < whiff) res = "whiff";
      else if (r < whiff + look) res = "look";
      else if (r < whiff + look + 0.16) res = "foul";
      else if (Math.random() < heat) res = pickW([[1, 55], [2, 25], [3, 5], [4, 6 + heat * 25]]);
      else res = Math.random() < 0.5 ? "fly" : "ground";
    }
    s.ball = { k: s.pk, tx: x, ty: y, ft: 0, dur: P.fly, cd: x < 0 ? 1 : -1, res };
    s.phase = "throw"; s.pt = 0;
  }
  function resolveThrow(G) {
    const s = G.s, res = s.ball.res, L = lay(G);
    const bx = L.ac[0] + s.ball.tx * L.aw, by = L.ac[1] + s.ball.ty * L.ah;
    s.catSw = res === "ball" || res === "look" ? 0 : 0.35;
    if (res === "ball") {
      s.balls++;
      if (s.balls >= 4) { const r = walk(s); setMsg(s, "CAT WALKS", "#ff8a6b", s.mercy ? "MERCY! 5-RUN LIMIT" : runsTxt(r)); }
      else setMsg(s, "BALL " + s.balls, "#9ad7ff");
    } else if (res === "whiff" || res === "look") {
      s.strikes++;
      if (s.strikes >= 3) { out(s); s.ks++; setMsg(s, "STRIKEOUT!", "#7dff8a", "+10 PTS"); G.sfx("win"); }
      else { setMsg(s, res === "look" ? "CALLED STRIKE" : "SWING + MISS", "#7dff8a"); G.sfx("pop"); }
    } else if (res === "foul") {
      if (s.strikes < 2) s.strikes++;
      setMsg(s, "FOUL BALL", "#fff");
      s.hitBall = { x: bx, y: by, vx: (Math.random() < 0.5 ? -1 : 1) * rnd(260, 360), vy: -rnd(160, 260), t: 0 };
    } else if (res === "fly" || res === "ground") {
      let r = 0;
      if (res === "fly" && s.outs < 2 && s.bases[2] && Math.random() < 0.5) { s.bases[2] = 0; score(s, 1); r = 1; }
      out(s); setMsg(s, res === "fly" ? "FLY OUT" : "GROUND OUT", "#7dff8a", r ? "SAC FLY - 1 RUN" : ""); G.sfx("pop");
      s.hitBall = { x: bx, y: by, vx: rnd(-100, 100), vy: res === "fly" ? -rnd(380, 460) : -rnd(140, 200), t: 0, gr: res === "ground" };
    } else {
      const r = advance(s, res); newBatter(s);
      setMsg(s, res === 4 ? "CAT HOMER!" : "CAT " + HITS[res], "#ff6b6b", runsTxt(r)); G.sfx("lose"); G.buzz();
      s.hitBall = { x: bx, y: by, vx: rnd(-160, 160), vy: -rnd(260, 420) - res * 40, t: 0, hr: res === 4 };
      if (s.mercy) s.sub = "MERCY! 5-RUN LIMIT";
    }
    toResult(G);
  }

  // ---------- input ----------
  function act(G, x, y) {
    const s = G.s;
    if (s.phase === "banner") { if (s.pt > 0.35) startHalf(G); }
    else if (s.phase === "result") { if (s.pt > 0.4) next(G); }
    else if (s.phase === "flight") swing(G);
    else if (s.phase === "aim") throwIt(G);
    else if (s.phase === "choose" && y != null) {
      const L = lay(G);
      if (y > L.by - 20) choose(G, Math.max(0, Math.min(2, Math.floor((x - 12) / (L.bw + 8)))));
    }
  }

  defGame({
    key: "dawgball", name: "Dawg Ball", icon: "🧢", max: 999, cat: "sports",
    blurb: "3-inning baseball vs the Cats.",
    how: "3 innings vs the Alley Cats. When you PITCH: pick Fastball, Curve or Changeup, then tap to stop the aim circle. Paint the corners and mix your pitches - the same pitch twice gets hit harder. When you BAT: a ring shows where the pitch will cross - tap anywhere when the shrinking ring closes on it (green = swing now). A RED ring is a ball: let it go. Score: runs x10, +50 for a win, +10 per strikeout.",
    reset(G) {
      G.s = { inning: 1, half: 0, runs: [0, 0], outs: 0, balls: 0, strikes: 0, bases: [0, 0, 0], halfRuns: 0, ks: 0,
        phase: "banner", pt: 0, bp: 0, pa: 0, wdur: 0.7, fb: null, fbSub: "", btxt: "", bsub: "", msg: "", msgC: "#fff", sub: "", ball: null, sw: null, hitBall: null,
        lastP: -1, rep: 0, pk: 0, rt: 0, rx: 0, ry: 0, catSw: 0, face: ":dawgW:", end: false, mercy: false, result: null };
      halfBanner(G);
    },
    update(G, dt) {
      const s = G.s; s.pt += dt;
      if (s.hitBall) { const h = s.hitBall; h.t += dt; h.x += h.vx * dt; h.y += h.vy * dt; if (!h.gr) h.vy += 240 * dt; }
      if (s.catSw > 0) s.catSw = Math.max(0, s.catSw - dt);
      switch (s.phase) {
        case "banner": if (s.pt >= 1.7) startHalf(G); break;
        case "windup": if (s.pt >= s.wdur) newPitch(G); break;
        case "flight": {
          const b = s.ball; b.ft += dt;
          if (s.sw) s.sw.t += dt;
          if (b.ft >= b.dur + 0.28) judgeTake(G);
          break;
        }
        case "aim": { s.rt += dt * (1 + 0.12 * (s.inning - 1)); s.rx = 1.3 * Math.sin(s.rt * 2.2); s.ry = 1.3 * Math.sin(s.rt * 3.1 + 1); break; }
        case "throw": s.ball.ft += dt; if (s.ball.ft >= s.ball.dur) resolveThrow(G); break;
        case "result": if (s.pt >= (s.rdur || 1.15)) next(G); break;
        case "final": {
          if (s.pt >= 1.8) {
            const d = s.runs[0], c = s.runs[1];
            const pts = Math.min(999, d * 10 + (d > c ? 50 : 0) + s.ks * 10);
            G.over(pts, d > c ? `Big Dawgs win ${d}-${c}!` : d < c ? `Cats win ${c}-${d}. Ruff.` : `Tie game ${d}-${c}. Meh.`);
          }
          break;
        }
      }
    },
    tap(G, x, y) { act(G, x, y); },
    onKey(G, k, down) {
      if (!down) return; const s = G.s;
      if (s.phase === "choose") {
        const m = { ArrowLeft: 0, a: 0, "1": 0, ArrowUp: 1, w: 1, "2": 1, ArrowRight: 2, d: 2, "3": 2 }[k];
        if (m != null) choose(G, m);
        return;
      }
      if (k === " " || k === "ArrowUp" || k === "Enter") act(G, null, null);
    },
    draw(G, c) {
      const s = G.s, W = G.W, H = G.H, dark = G.dark(), L = lay(G);
      const batting = s.half === 1;
      // --- stadium ---
      c.fillStyle = dark ? "#121a33" : "#8fd3ff"; c.fillRect(0, 0, W, H * 0.2);
      // crowd
      for (let x = 0, i = 0; x < W; x += 10, i++) { c.fillStyle = ["#e8505b", "#f9d56e", "#5fb7e8", "#b98cf0", "#f3a35c"][i % 5]; c.fillRect(x + 2, H * 0.1 + ((i * 7) % 3) * 3, 6, 8); }
      if (dark) { c.fillStyle = "#fff6b0"; for (let i = 0; i < 4; i++) { const lx = W * (0.12 + i * 0.25); c.fillRect(lx - 10, 54, 20, 6); } }
      // outfield wall
      c.fillStyle = dark ? "#1d4a33" : "#2f7a4f"; c.fillRect(0, H * 0.17, W, H * 0.04);
      c.fillStyle = "#ffd23f"; c.fillRect(0, H * 0.21 - 3, W, 3);
      // grass with mowing stripes
      c.fillStyle = dark ? "#1f5a26" : "#5cb84a"; c.fillRect(0, H * 0.21, W, H);
      c.fillStyle = dark ? "#246630" : "#67c454"; for (let y = H * 0.21, i = 0; y < H; y += 26, i++) if (i % 2) c.fillRect(0, y, W, 26);
      // infield dirt
      c.fillStyle = dark ? "#7a5230" : "#c98a4b";
      c.beginPath(); c.moveTo(W / 2, H * 0.3); c.lineTo(W * 0.98, H * 0.6); c.lineTo(W / 2, H * 0.98); c.lineTo(W * 0.02, H * 0.6); c.closePath(); c.fill();
      c.fillStyle = dark ? "#1f5a26" : "#5cb84a";
      c.beginPath(); c.moveTo(W / 2, H * 0.42); c.lineTo(W * 0.8, H * 0.6); c.lineTo(W / 2, H * 0.8); c.lineTo(W * 0.2, H * 0.6); c.closePath(); c.fill();
      // mound + plate
      c.fillStyle = dark ? "#8a6038" : "#d89a5a"; c.beginPath(); c.ellipse(L.mound[0], L.mound[1] + 14, 32, 11, 0, 0, 7); c.fill();
      c.fillStyle = "#fff"; c.fillRect(L.mound[0] - 8, L.mound[1] + 12, 16, 4);
      c.beginPath(); const px = L.plate[0], py = L.plate[1]; c.moveTo(px - 14, py - 6); c.lineTo(px + 14, py - 6); c.lineTo(px + 14, py + 2); c.lineTo(px, py + 9); c.lineTo(px - 14, py + 2); c.closePath(); c.fill();
      // fielders
      if (batting) { G.emoji(c, "🐈", W * 0.2, H * 0.27, 22); G.emoji(c, "🐈", W * 0.8, H * 0.27, 22); G.emoji(c, "🐈", W / 2, H * 0.245, 20); G.emoji(c, "🐈", W * 0.78, H * 0.52, 22); G.emoji(c, "🐈", W * 0.22, H * 0.52, 22); }
      else { G.img(c, ":dawgW:", W * 0.36, H * 0.25, 22); G.img(c, ":dawgW:", W * 0.8, H * 0.27, 22); G.img(c, ":dawgW:", W * 0.78, H * 0.52, 24); G.img(c, ":dawgW:", W * 0.22, H * 0.52, 24); }

      if (batting) drawBatting(G, c, s, L); else drawPitching(G, c, s, L);

      // hit ball flying away
      if (s.hitBall) { const h = s.hitBall, sz = Math.max(3, 12 - h.t * 8); c.fillStyle = "#fff"; c.beginPath(); c.arc(h.x, h.y, sz, 0, 7); c.fill(); c.strokeStyle = "#c33"; c.lineWidth = 1; c.stroke(); }


      // --- HUD: shared top bar + a slim count row (balls/strikes, outs, runners, Ks) ---
      const top = G.hud(c, `DAWGS ${s.runs[0]}`, `${s.half ? "BOT" : "TOP"} ${s.inning}`, `CATS ${s.runs[1]}`, { color: "#9ad7ff" });
      const rh = 26, ry = top + rh / 2;
      c.fillStyle = "rgba(10,10,20,0.62)"; c.fillRect(0, top, W, rh);
      G.text(c, `B${s.balls} S${s.strikes}`, 10, ry, 10, "#fff", "left");
      G.text(c, "OUT", W / 2 - 14, ry, 10, "#fff", "right");
      for (let i = 0; i < 3; i++) { c.fillStyle = i < s.outs ? "#ff5a4f" : "rgba(255,255,255,0.25)"; c.beginPath(); c.arc(W / 2 - 2 + i * 14, ry, 5, 0, 7); c.fill(); }
      drawDiamond(G, c, s, W - 86, ry);
      G.text(c, `K ${s.ks}`, W - 10, ry, 10, "#7dff8a", "right");

      // --- overlays ---
      if (s.phase === "result" && s.msg) {
        const y = H * 0.27, big = s.msg === "HOME RUN!" || s.msg === "STRIKEOUT!" || s.msg === "CAT HOMER!";
        c.fillStyle = "rgba(10,14,30,0.4)"; c.fillRect(0, y - 24, W, 48);
        G.banner(c, s.msg, s.msgC, y, Math.min(big ? 30 : 22, (W * 0.9) / s.msg.length));
        if (batting && s.fb) {
          const t = s.fb[0] + (s.fbSub ? " - " + s.fbSub : "");
          pill(c, t, W / 2, y - 40, s.fbSub ? "#ff8a6b" : s.fb[1]);
        }
        if (s.sub) pill(c, s.sub, W / 2, y + 40, "#fff");
      }
      if (s.phase === "banner" || s.phase === "final") {
        c.fillStyle = "rgba(10,14,30,0.78)"; c.fillRect(0, H * 0.38, W, 104);
        c.fillStyle = "#ffd23f"; c.fillRect(0, H * 0.38, W, 3); c.fillRect(0, H * 0.38 + 101, W, 3);
        if (s.phase === "banner") {
          G.banner(c, s.btxt, "#ffd23f", H * 0.38 + 30, 22);
          G.text(c, s.bsub, W / 2, H * 0.38 + 60, 10, "#fff");
          G.text(c, `DAWGS ${s.runs[0]} - CATS ${s.runs[1]}`, W / 2, H * 0.38 + 82, 10, "#9ad7ff");
        } else {
          const d = s.runs[0], k = s.runs[1];
          G.banner(c, d > k ? "DAWGS WIN!" : d < k ? "CATS WIN" : "TIE GAME", d > k ? "#7dff8a" : d < k ? "#ff6b6b" : "#fff", H * 0.38 + 34, 24);
          G.text(c, `FINAL ${d} - ${k}`, W / 2, H * 0.38 + 72, 12, "#fff");
          G.img(c, s.face, W / 2, H * 0.38 - 34, 60);
        }
      }
    }
  });

  function drawDiamond(G, c, s, cx, cy) {     // compact runners diamond (fits the HUD count row)
    const r = 10, pts = [[cx + r, cy], [cx, cy - r], [cx - r, cy]];
    c.strokeStyle = "rgba(255,255,255,0.45)"; c.lineWidth = 1.5;
    c.beginPath(); c.moveTo(cx, cy + r); c.lineTo(cx + r, cy); c.lineTo(cx, cy - r); c.lineTo(cx - r, cy); c.closePath(); c.stroke();
    for (let i = 0; i < 3; i++) {
      const [x, y] = pts[i]; c.save(); c.translate(x, y); c.rotate(Math.PI / 4);
      c.fillStyle = s.bases[i] ? "#ffd23f" : "#3a405a"; c.fillRect(-4, -4, 8, 8);
      c.strokeStyle = "#fff"; c.lineWidth = 1; c.strokeRect(-4, -4, 8, 8); c.restore();
    }
    c.fillStyle = "#fff"; c.fillRect(cx - 3, cy + r - 3, 6, 6);
  }
  function pill(c, msg, x, y, col) {
    const sz = 10; c.font = `${sz}px 'Press Start 2P', ui-monospace, monospace`; const w = c.measureText(msg).width + 24;
    c.fillStyle = "rgba(10,14,30,0.78)"; c.beginPath(); if (c.roundRect) c.roundRect(x - w / 2, y - 13, w, 26, 13); else c.rect(x - w / 2, y - 13, w, 26); c.fill();
    G.text(c, msg, x, y, sz, col || "#fff");
  }

  function ballAt(b, p, x0, y0, x1, y1) {
    const curve = PITCHES[b.k].curve ? Math.sin(Math.min(1, p) * Math.PI) * 34 * b.cd : 0;
    return [x0 + (x1 - x0) * p + curve, y0 + (y1 - y0) * p];
  }

  function ring(c, x, y, r, col, lw) {
    c.lineWidth = lw + 3; c.strokeStyle = "rgba(0,0,0,0.55)"; c.beginPath(); c.arc(x, y, r, 0, 7); c.stroke();
    c.lineWidth = lw; c.strokeStyle = col; c.beginPath(); c.arc(x, y, r, 0, 7); c.stroke();
  }
  function drawBatting(G, c, s, L) {
    const W = G.W, H = G.H, [zx, zy] = L.zc, b = s.ball;
    const P = b ? PITCHES[b.k] : null, isCh = b && b.k === 2;
    // pitcher cat: wind-up shows the pitch (changeup = slow, big, lazy rock)
    let wind = 0, lift = 0;
    if (s.phase === "windup") {
      const sp = isCh ? 4 : b && b.k === 1 ? 8 : 12;
      wind = Math.sin(s.pt * sp); lift = Math.max(0, wind) * (isCh ? 12 : 6);
    }
    G.emoji(c, "🐈", L.mound[0], L.mound[1] - 4 - lift, 44 + Math.abs(wind) * (isCh ? 10 : 4));
    if ((s.phase === "windup" || s.phase === "flight") && P) {
      // pitch call next to the mound
      const lx = L.mound[0] + 58, ly = L.mound[1] - 10;
      c.fillStyle = "rgba(10,14,30,0.75)"; c.fillRect(lx - 34, ly - 22, 68, 42);
      G.emoji(c, P.ico, lx, ly - 8, 16);
      G.text(c, isCh ? "SLOW" : P.name, lx, ly + 10, 10, isCh ? "#9ad7ff" : k1(b.k));
    }
    // strike zone
    c.strokeStyle = "rgba(255,255,255,0.8)"; c.lineWidth = 2; c.setLineDash([6, 4]);
    c.strokeRect(zx - L.zw, zy - L.zh, L.zw * 2, L.zh * 2); c.setLineDash([]);
    // batter (dawg) + bat
    const bx = zx - L.zw - 48, by = zy + 6;
    let ang = -2.3;
    if (s.sw) ang = -2.3 + Math.min(1, s.sw.t / 0.12) * 2.9;
    else if (s.phase === "result" && s.hitBall && s.half === 1) ang = 0.6;
    c.save(); c.translate(bx + 14, by + 16); c.rotate(ang);
    c.fillStyle = "#b5773a"; c.fillRect(0, -4, 70, 8); c.fillStyle = "#7a4a1e"; c.fillRect(0, -3, 14, 6); c.restore();
    G.img(c, s.face, bx, by, 66);
    G.emoji(c, "🧢", bx + 2, by - 32, 26);
    // contact ring (where the ball will cross the plate)
    const live = b && (s.phase === "windup" || s.phase === "flight");
    if (live) {
      const tx = zx + b.tx * L.zw, ty = zy + b.ty * L.zh, R = 16, [w1, w2] = windows(s);
      const e = s.phase === "flight" ? b.ft - b.dur : -b.dur - 1;
      const inWin = Math.abs(e) < w2 && !s.sw, past = e >= w2;
      const col = !b.inZ ? "#ff4d4d" : inWin ? "#3dff6a" : past ? "rgba(255,255,255,0.45)" : "#ffd23f";
      if (s.phase === "windup") c.globalAlpha = 0.55;
      if (inWin && b.inZ) { c.fillStyle = "rgba(61,255,106,0.35)"; c.beginPath(); c.arc(tx, ty, R, 0, 7); c.fill(); }
      ring(c, tx, ty, R, col, 4);
      if (!b.inZ) {   // red X: this one's a ball
        c.lineWidth = 3; c.strokeStyle = "#ff4d4d"; c.beginPath();
        c.moveTo(tx - 7, ty - 7); c.lineTo(tx + 7, ty + 7); c.moveTo(tx + 7, ty - 7); c.lineTo(tx - 7, ty + 7); c.stroke();
      }
      if (s.phase === "flight" && !s.sw && e < w2) {
        const p = Math.max(0, -e) / b.dur;            // 1 at release -> 0 at contact
        ring(c, tx, ty, R + p * 74, col, 3);
      }
      c.globalAlpha = 1;
      if (!b.inZ && s.phase === "flight" && !s.sw) {   // label above the zone (below it for high pitches)
        const ly = b.ty < -1 ? zy + L.zh + 26 : zy - L.zh - 24;
        pill(c, "BALL - TAKE IT", zx, ly, "#ff6b6b");
      }
    }
    // pitch in flight
    if (s.phase === "flight" && b) {
      const p = b.ft / b.dur;
      const [x, y] = ballAt(b, p, L.mound[0], L.mound[1] - 14, zx + b.tx * L.zw, zy + b.ty * L.zh);
      const sz = 4 + Math.min(1.2, p) * 9;
      c.fillStyle = "rgba(0,0,0,0.25)"; c.beginPath(); c.ellipse(x, L.mound[1] + (L.plate[1] - L.mound[1]) * Math.min(1.2, p) + 4, sz, sz * 0.4, 0, 0, 7); c.fill();
      c.fillStyle = "#fff"; c.beginPath(); c.arc(x, y, sz, 0, 7); c.fill(); c.strokeStyle = "#c33"; c.lineWidth = 1.2; c.stroke();
    }
    // swing feedback right away (EARLY / LATE / PERFECT!)
    if (s.phase === "flight" && s.sw && s.fb) { G.text(c, s.fb[0], zx + 1, zy - L.zh - 22 + 1, 14, "#000"); G.text(c, s.fb[0], zx, zy - L.zh - 22, 14, s.fb[1]); }
    // how-to pills (bottom, clear of the batter and plate)
    if (s.phase === "windup" || (s.phase === "flight" && !s.sw)) {
      if (s.pa === 0) {
        G.hint(c, "TAP WHEN BALL HITS THE RING", G.t + 1, H - 58);
        G.hint(c, "GREEN = SWING · RED = TAKE", G.t + 1, H - 24);
      } else if (s.phase === "windup") G.hint(c, "TAP WHEN BALL HITS THE RING", G.t + 1, H - 24);
    }
  }
  function k1(k) { return ["#ffb36b", "#c9a6ff", "#9ad7ff"][k]; }

  function drawPitching(G, c, s, L) {
    const W = G.W, H = G.H, [ax, ay] = L.ac, aw = L.aw, ah = L.ah;
    // pitcher dawg
    const wind = s.phase === "throw" ? -0.3 : s.phase === "aim" ? Math.sin(s.pt * 6) * 0.08 : 0;
    G.img(c, s.result === "lose" ? ":dawgpain:" : ":dawgW:", L.mound[0], L.mound[1] - 6, 52, wind);
    // cat batter
    const catX = ax - aw - 40, catY = ay + ah * 0.3;
    c.save(); c.translate(catX, catY); c.rotate(s.catSw > 0 ? (0.35 - s.catSw) * 4 - 0.6 : -0.15);
    c.fillStyle = "#b5773a"; c.fillRect(6, -6, 50, 7); c.restore();
    G.emoji(c, "🐱", catX, catY, 54);
    // aim box: ball zone + strike zone grid
    c.fillStyle = "rgba(0,0,0,0.2)"; c.fillRect(ax - aw * 1.3, ay - ah * 1.3, aw * 2.6, ah * 2.6);
    c.fillStyle = "rgba(255,255,255,0.14)"; c.fillRect(ax - aw, ay - ah, aw * 2, ah * 2);
    // corner highlights
    c.fillStyle = "rgba(125,255,138,0.28)";
    const cw = aw * 0.55, ch = ah * 0.55;
    c.fillRect(ax - aw, ay - ah, cw, ch); c.fillRect(ax + aw - cw, ay - ah, cw, ch); c.fillRect(ax - aw, ay + ah - ch, cw, ch); c.fillRect(ax + aw - cw, ay + ah - ch, cw, ch);
    c.fillStyle = "rgba(255,90,79,0.22)"; c.fillRect(ax - aw * 0.35, ay - ah * 0.35, aw * 0.7, ah * 0.7);
    c.strokeStyle = "#fff"; c.lineWidth = 2; c.strokeRect(ax - aw, ay - ah, aw * 2, ah * 2);
    c.lineWidth = 1; c.strokeStyle = "rgba(255,255,255,0.4)";
    c.beginPath(); for (let i = 1; i < 3; i++) { c.moveTo(ax - aw + aw * 2 * i / 3, ay - ah); c.lineTo(ax - aw + aw * 2 * i / 3, ay + ah); c.moveTo(ax - aw, ay - ah + ah * 2 * i / 3); c.lineTo(ax + aw, ay - ah + ah * 2 * i / 3); } c.stroke();
    // reticle
    if (s.phase === "aim" || s.phase === "throw" || (s.phase === "result" && s.ball)) {
      const rx = ax + (s.phase === "aim" ? s.rx : s.ball.tx) * aw, ry = ay + (s.phase === "aim" ? s.ry : s.ball.ty) * ah;
      c.strokeStyle = s.phase === "aim" ? "#ffd23f" : "rgba(255,210,63,0.6)"; c.lineWidth = 3;
      c.beginPath(); c.arc(rx, ry, 11, 0, 7); c.stroke();
      c.beginPath(); c.moveTo(rx - 17, ry); c.lineTo(rx - 6, ry); c.moveTo(rx + 6, ry); c.lineTo(rx + 17, ry); c.moveTo(rx, ry - 17); c.lineTo(rx, ry - 6); c.moveTo(rx, ry + 6); c.lineTo(rx, ry + 17); c.stroke();
    }
    // pitch in flight
    if (s.phase === "throw" && s.ball) {
      const b = s.ball, p = b.ft / b.dur;
      const [x, y] = ballAt(b, p, L.mound[0], L.mound[1] - 14, ax + b.tx * aw, ay + b.ty * ah);
      const sz = 4 + p * 9; c.fillStyle = "#fff"; c.beginPath(); c.arc(x, y, sz, 0, 7); c.fill(); c.strokeStyle = "#c33"; c.lineWidth = 1.2; c.stroke();
    }
    // pitch buttons
    for (let i = 0; i < 3; i++) {
      const x = 12 + i * (L.bw + 8), y = L.by, on = s.phase === "choose", sel = s.pk === i && (s.phase === "aim" || s.phase === "throw");
      c.globalAlpha = on || sel ? 1 : 0.45;
      c.fillStyle = "#1b2240"; c.fillRect(x, y + 4, L.bw, L.bh);
      c.fillStyle = sel ? "#ffd23f" : ["#e8505b", "#5f8ff0", "#3fb37f"][i]; c.fillRect(x, y, L.bw, L.bh);
      c.fillStyle = "rgba(255,255,255,0.25)"; c.fillRect(x, y, L.bw, 4);
      G.text(c, PITCHES[i].name, x + L.bw / 2, y + 20, 10, sel ? "#1b2240" : "#fff");
      G.text(c, ["HEAT", "BREAKS", "SLOW"][i], x + L.bw / 2, y + 38, 10, sel ? "#1b2240" : "rgba(255,255,255,0.9)");
      if (on && s.lastP === i) { c.fillStyle = "#ff5a4f"; c.fillRect(x + L.bw - 30, y - 10, 34, 18); G.text(c, "x" + (s.rep + 2), x + L.bw - 13, y - 1, 10, "#fff"); }
      c.globalAlpha = 1;
    }
    const hy = L.by - 24;
    if (s.phase === "choose") G.hint(c, "PICK A PITCH", G.t + 1, hy);
    else if (s.phase === "aim") G.hint(c, "TAP TO THROW · HIT CORNERS", G.t + 1, hy);
  }
})();
