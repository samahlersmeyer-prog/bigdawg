// ---------- Dawg Ball (Doodle Baseball-style: you bat, the Alley Cats pitch and field) ----------
// One long inning: tap to swing and score as many runs as you can before 3 outs. No balls or walks -
// every pitch is hittable. Swing early to pull it to left, late to go the other way; nail the timing to
// launch it over the fence. The cats in the field chase down whatever you hit. Every 3 runs a nastier
// cat takes the mound (curves, knuckleballs, stop-and-go). Score = runs x10 (cap 999).
(function () {
  const rnd = (a, b) => a + Math.random() * (b - a);
  const D2R = Math.PI / 180;
  function pickW(pairs) { let t = 0; for (const p of pairs) t += p[1]; let r = Math.random() * t; for (const p of pairs) { r -= p[1]; if (r <= 0) return p[0]; } return pairs[pairs.length - 1][0]; }
  const HITS = ["", "SINGLE!", "DOUBLE!", "TRIPLE!", "HOME RUN!"];
  const RPP = 3;                                  // runs before the next pitcher comes in
  const LAG = 0.05, WIN = 0.1, PERF = 0.014;      // bat reaches the plate LAG s after the tap; contact window; barrel window (s)
  const PITCHERS = [
    { name: "TABBY", ico: "🐱", spd: 1.0, mix: [["fast", 65], ["change", 35]], says: "NICE AND EASY" },
    { name: "MITTENS", ico: "🐈", spd: 0.9, mix: [["fast", 50], ["change", 25], ["curve", 25]], says: "THROWS A CURVE" },
    { name: "SHADOW", ico: "🐈‍⬛", spd: 0.82, mix: [["fast", 40], ["curve", 25], ["knuckle", 20], ["change", 15]], says: "KNUCKLEBALL!" },
    { name: "TIGER", ico: "🐯", spd: 0.74, mix: [["fast", 45], ["curve", 20], ["knuckle", 15], ["change", 20]], says: "BRINGS THE HEAT" },
    { name: "KING LEO", ico: "🦁", spd: 0.67, mix: [["fast", 35], ["curve", 20], ["knuckle", 15], ["change", 15], ["stop", 15]], says: "STOP-AND-GO PITCH" },
  ];
  const MULT = { fast: 1, change: 1.5, curve: 1.15, knuckle: 1.3 };
  const PNAME = { fast: "HEAT", change: "CHANGE", curve: "CURVE", knuckle: "KNUCKLE", stop: "STOP+GO" };
  const PICO = { fast: "🔥", change: "🐢", curve: "🌀", knuckle: "🦋", stop: "✋" };

  // ---------- field + camera ----------
  // World units: home plate at (0,0), u = toward right field, v = toward center, 1 = the center-field fence, z = height.
  // A camera behind and above home plate makes the plate end big and the outfield small (like the Doodle).
  const CD = 0.35, CH = 0.7;
  const BASES = [[0, 0], [0.19, 0.19], [0, 0.38], [-0.19, 0.19]];          // home, 1B, 2B, 3B
  const FIELD = [ // [label, angle deg, r, speed (units/s), glove reach]
    ["P", 0, 0.19, 0.06, 0.025], ["1B", 38, 0.33, 0.08, 0.04], ["2B", 15, 0.46, 0.08, 0.035], ["SS", -15, 0.46, 0.08, 0.035],
    ["3B", -37, 0.33, 0.08, 0.04], ["LF", -28, 0.74, 0.09, 0.04], ["CF", 0, 0.8, 0.09, 0.04], ["RF", 28, 0.74, 0.09, 0.04]];
  const polar = (a, r) => [r * Math.sin(a * D2R), r * Math.cos(a * D2R)];
  const fenceR = a => 1 - 0.12 * Math.min(1, Math.abs(a) / 45);
  const HOME_F = FIELD.map(f => polar(f[1], f[2]));

  function lay(G) {
    const W = G.W, H = G.H, hy = H - 66, top = 34 + 22 + 30;   // HUD + count row + a strip of stands
    const F = Math.max(120, (hy - top) / (1 / CD - 1 / (1 + CD)));
    const fx = Math.min((W / 2 - 6) / 0.66, F * 1.7);
    return { W, H, hx: W / 2, hy, F, fx, hor: hy - F / CD };
  }
  function P(L, u, v, z) { const d = Math.max(0.12, v + CD); return [L.hx + L.fx * u / d, L.hor + L.F * (1 - (z || 0) / CH) / d, 1 / d]; }
  function poly(c, L, pts) { c.beginPath(); pts.forEach((p, i) => { const q = P(L, p[0], p[1], p[2]); if (i) c.lineTo(q[0], q[1]); else c.moveTo(q[0], q[1]); }); c.closePath(); }
  function circ(cu, cv, r, n) { const a = []; for (let i = 0; i < n; i++) { const t = i / n * Math.PI * 2; a.push([cu + Math.cos(t) * r, cv + Math.sin(t) * r]); } return a; }

  // ---------- pitching (the cats) ----------
  const pitcher = s => PITCHERS[s.stage];
  function windup(G) {
    const s = G.s, pc = pitcher(s), kind = pickW(pc.mix);
    let f = pc.spd * Math.pow(0.965, Math.max(0, s.lvl - (PITCHERS.length - 1)));
    f = Math.max(0.5, f) * (s.pitches < 3 ? 1.25 : 1);                         // first few pitches come in soft
    const b = { kind, ft: 0, cd: Math.random() < 0.5 ? -1 : 1 };
    if (kind === "stop") { b.d1 = 0.5 * f; b.pz = rnd(0.25, 0.5); b.d2 = 0.38 * f; b.dur = b.d1 + b.pz + b.d2; }
    else b.dur = f * MULT[kind];
    s.ball = b; s.sw = null; s.fb = null; s.msg = ""; s.sub = "";
    s.phase = "windup"; s.pt = 0; s.wdur = rnd(0.6, 1.1) + (s.pitches === 0 ? 0.5 : 0);
    s.face = ":dawgW:";
  }
  function prog(b, t) {   // 0 at release, 1 at the plate (keeps going past it)
    if (b.kind !== "stop") return t / b.dur;
    if (t < b.d1) return 0.5 * t / b.d1;
    if (t < b.d1 + b.pz) return 0.5;
    return 0.5 + 0.5 * (t - b.d1 - b.pz) / b.d2;
  }
  function pitchPos(b, t) {
    const p = Math.min(1.5, prog(b, t)), pp = Math.min(1, p);
    let u = 0, z = 0.05 - 0.045 * pp;
    if (b.kind === "curve") u = b.cd * 0.07 * Math.sin(Math.PI * pp);
    if (b.kind === "knuckle") { u = 0.014 * Math.sin(t * 23) * Math.min(1, p * 3) * (1.2 - pp); z += 0.008 * Math.sin(t * 17); }
    return [u, 0.185 - 0.165 * p, z];
  }

  // ---------- batting ----------
  function swing(G) {
    const s = G.s, b = s.ball;
    if (s.phase !== "pitch" || s.sw || !b) return;
    const e = b.ft + LAG - b.dur, a = Math.abs(e);
    s.sw = { t: 0, e, hit: a < WIN };
    if (s.sw.hit) { s.sw.res = judge(e, b); s.fb = a < PERF ? ["PERFECT!", "#7dff8a"] : [e < 0 ? "EARLY" : "LATE", a < WIN * 0.5 ? "#ffd23f" : "#ff8a6b"]; }
    else s.fb = [e < 0 ? "TOO EARLY" : "TOO LATE", "#ff6b6b"];
  }
  // Where the ball goes is decided at contact: timing sets the direction and how hard it's hit,
  // then we check whether any cat can get there in time.
  function judge(e, b) {
    const a = e / WIN, q = 1 - Math.abs(a), perfect = Math.abs(e) < PERF;
    const ang = a * 62 + rnd(-7, 7);                                            // early = pull (left), late = opposite field
    if (Math.abs(ang) > 45) return { type: "fly", foul: true, ang: (ang < 0 ? -1 : 1) * rnd(52, 78), r: rnd(0.45, 0.9), T: rnd(0.7, 1), peak: rnd(0.12, 0.3), reveal: 0.35 };
    const pf = b.kind === "fast" || b.kind === "stop" ? 1.05 : b.kind === "change" ? 0.93 : 1;
    const type = perfect ? pickW([["fly", 65], ["liner", 35]])
      : q > 0.8 ? pickW([["fly", 48], ["liner", 42], ["ground", 10]])
      : q > 0.55 ? pickW([["fly", 32], ["liner", 44], ["ground", 20], ["pop", 4]])
      : pickW([["ground", 40], ["pop", 16], ["liner", 26], ["fly", 18]]);
    let r = (0.18 + 0.85 * Math.pow(q, 1.8)) * rnd(0.88, 1.08) * pf;
    if (perfect) r = Math.max(r, rnd(0.98, 1.16));                              // barreled it: usually gone
    if (type === "pop") r = rnd(0.12, 0.42);
    const res = { type, ang, r, out: false, fi: -1, bases: 0, rbi: 0 };
    if (type === "ground") return ground(res);
    if (r > fenceR(ang) + 0.01) { res.bases = 4; res.r = r = Math.max(r, fenceR(ang) + 0.08); }
    res.T = type === "liner" ? 0.3 + 0.5 * r : type === "pop" ? rnd(1.3, 1.7) : 0.55 + 0.75 * r;
    res.peak = type === "liner" ? 0.03 + 0.04 * r : type === "pop" ? rnd(0.45, 0.6) : 0.2 + 0.22 * r;
    res.reveal = res.T;
    if (res.bases === 4) return res;
    const [lu, lv] = polar(ang, r);
    let bd = 9;
    FIELD.forEach((f, i) => {
      const d = Math.hypot(lu - HOME_F[i][0], lv - HOME_F[i][1]);
      if (d - f[4] <= f[3] * Math.max(0, res.T - 0.15) && d < bd) { bd = d; res.fi = i; }
    });
    if (res.fi >= 0) { res.out = true; res.tu = lu; res.tv = lv; return res; }
    res.bases = r < 0.62 ? 1 : r < 0.86 ? 2 : (Math.abs(ang) > 18 && Math.random() < 0.4 ? 3 : 2);
    return res;
  }
  function ground(res) {
    const rg = Math.min(0.85, res.r * 0.82), ang = res.ang;
    res.r = rg; res.T = 0.25 + 0.9 * rg; res.peak = 0;
    let bt = 9;
    for (let i = 0; i < 5; i++) {   // infielders + pitcher
      const f = FIELD[i]; let t, pt;
      if (rg <= f[2] + 0.02) { pt = polar(ang, rg); t = res.T + 0.25; }      // dies before reaching him: he charges it
      else { t = (1 - Math.sqrt(1 - f[2] / rg)) * res.T; pt = polar(ang, f[2]); }
      const d = Math.hypot(pt[0] - HOME_F[i][0], pt[1] - HOME_F[i][1]);
      if (d - f[4] <= f[3] * Math.max(0, t - 0.16) && t < bt) { bt = t; res.fi = i; res.tu = pt[0]; res.tv = pt[1]; }
    }
    if (res.fi >= 0) {
      res.out = true; res.ti = bt;
      res.throwT = 0.18 + Math.hypot(res.tu - BASES[1][0], res.tv - BASES[1][1]) * 1.3;
      res.reveal = bt + res.throwT;
      return res;
    }
    res.reveal = Math.min(res.T, 0.6);
    res.bases = Math.abs(ang) > 34 && rg > 0.6 ? 2 : 1;
    return res;
  }

  // ---------- the play ----------
  const spriteOn = (s, base) => s.runners.find(r => r.to === base && !r.bat);
  function launch(G) {
    const s = G.s, res = s.sw.res;
    s.sw.launched = true; s.pitches++;
    s.hit = Object.assign({ t: 0 }, res); s.phase = "play"; s.pt = 0; s.msg = ""; s.sub = "";
    G.sfx("pop");
    if (res.foul) return;
    s.strikes = 0;
    const h = s.hit, bat = { at: 0, to: 1, spd: 1.7, counts: false, bat: true };
    if (h.out) {
      const before = s.outs; s.outs++;
      bat.outAt = h.reveal;
      if (h.type === "ground") {
        const b = s.bases;
        const mv = i => { const sp = spriteOn(s, i); if (sp) { sp.to = i + 1; sp.spd = 1.5; sp.counts = i === 3; } };
        if (s.outs < 3 && b[0]) {     // force play at first: runners who have to move, move
          if (b[1]) { if (b[2]) { s.runs++; h.rbi = 1; mv(3); } b[2] = 1; mv(2); }
          b[1] = 1; mv(1); b[0] = 0;
        }
      } else if (before < 2 && s.bases[2] && h.type === "fly" && h.r > 0.55 && Math.random() < 0.6) {
        s.bases[2] = 0; s.runs++; h.rbi = 1; h.sac = true;              // tag up from third
        const sp = spriteOn(s, 3); if (sp) { sp.to = 4; sp.wait = h.reveal; sp.counts = true; sp.spd = 1.8; }
      }
      s.runners.push(bat);
      const f = s.fl[h.fi]; f.tu = h.tu; f.tv = h.tv;
      if (h.type === "ground" && h.fi !== 1) { s.fl[1].tu = BASES[1][0] - 0.015; s.fl[1].tv = BASES[1][1] + 0.01; }
    } else {
      const n = h.bases, b = s.bases, nb = [0, 0, 0];
      let r = 0;
      const spd = n === 4 ? 1.9 : 1.7, dest = {};
      for (let i = 2; i >= 0; i--) if (b[i]) {   // runners take the extra base: 2nd scores on a single, 1st usually scores on a double
        const extra = (n === 1 && i >= 1) || (n === 2 && i === 0 && Math.random() < 0.7) ? 1 : 0;
        const to = Math.min(4, i + 1 + n + extra); dest[i + 1] = to;
        if (to >= 4) r++; else nb[to - 1] = 1;
      }
      if (n >= 4) r++; else nb[n - 1] = 1;
      s.bases = nb; s.runs += r; h.rbi = r;
      s.runners.forEach(sp => { sp.to = dest[sp.to] || Math.min(4, sp.to + n); sp.counts = true; sp.spd = spd; });
      bat.to = n; bat.counts = true; bat.spd = spd;
      s.runners.push(bat);
      if (n < 4) {   // nearest cat chases it down
        const [lu, lv] = polar(h.ang, h.r + (h.type === "ground" ? 0 : 0.05));
        let bi = 1, bd = 9;
        for (let i = 1; i < FIELD.length; i++) { const d = Math.hypot(lu - s.fl[i].u, lv - s.fl[i].v); if (d < bd) { bd = d; bi = i; } }
        s.fl[bi].tu = lu; s.fl[bi].tv = lv;
      }
    }
  }
  function reveal(G) {
    const s = G.s, h = s.hit; h.shown = true;
    if (h.foul) { if (s.strikes < 2) s.strikes++; setMsg(s, "FOUL BALL", "#fff", ""); s.face = ":dawgsus:"; return; }
    if (h.out) {
      s.shOuts = s.outs;
      setMsg(s, { ground: "GROUND OUT", pop: "POP OUT", liner: "LINE OUT", fly: "FLY OUT" }[h.type], "#ff8a6b",
        h.sac ? "SAC FLY - 1 RUN" : h.rbi ? "1 RUN SCORES" : s.outs >= 3 ? "3 OUTS" : "");
      s.face = ":dawgcope:"; G.sfx("lose");
    } else {
      s.hits++; if (h.bases === 4) s.hrs++;
      setMsg(s, h.bases === 4 && h.rbi === 4 ? "GRAND SLAM!" : HITS[h.bases], h.bases === 4 ? "#ffd23f" : "#7dff8a",
        h.rbi ? (h.rbi === 1 ? "1 RUN SCORES" : h.rbi + " RUNS SCORE") : "");
      s.face = h.bases >= 2 ? ":dawgpog:" : ":dawgW:";
      G.sfx(h.bases === 4 ? "win" : "pop"); if (h.bases === 4) G.buzz();
    }
  }
  function setMsg(s, txt, col, sub) { s.msg = txt; s.msgC = col; s.sub = sub || ""; }
  function endPlay(G) {
    const s = G.s; s.hit = null;
    s.runners = []; for (let i = 0; i < 3; i++) if (s.bases[i]) s.runners.push({ at: i + 1, to: i + 1, spd: 1.7 });
    s.fl.forEach(f => { f.tu = null; f.tv = null; });
    next(G);
  }
  function strike(G) {   // pitch got by with no contact
    const s = G.s, swung = !!s.sw; s.strikes++; s.pitches++;
    if (s.strikes >= 3) { s.outs++; s.shOuts = s.outs; s.strikes = 0; setMsg(s, "STRIKE OUT!", "#ff6b6b", swung ? "SWINGING" : "LOOKING"); s.face = ":dawgsweat:"; G.sfx("lose"); G.buzz(); }
    else { setMsg(s, "STRIKE " + s.strikes, "#ff8a6b", swung ? "" : "SWING AWAY!"); s.face = ":dawgsus:"; }
    s.phase = "result"; s.pt = 0;
  }
  function next(G) {
    const s = G.s; s.ball = null; s.sw = null;
    if (s.outs >= 3) return finish(G);
    const lvl = Math.floor(s.runs / RPP);
    if (lvl > s.lvl) {
      s.lvl = lvl; const st = Math.min(PITCHERS.length - 1, lvl);
      s.newTxt = st !== s.stage ? "NOW PITCHING" : "HE'S STEAMED"; s.stage = st;
      s.phase = "newp"; s.pt = 0; s.msg = ""; G.sfx("pass"); return;
    }
    windup(G);
  }
  function finish(G) { const s = G.s; s.phase = "final"; s.pt = 0; s.msg = ""; s.face = s.runs >= 10 ? ":dawgpog:" : s.runs ? ":dawgW:" : ":dawgpain:"; G.sfx(s.runs >= 5 ? "win" : "lose"); }

  function moveFielders(s, dt) {
    s.fl.forEach((f, i) => {
      let tu = f.tu, tv = f.tv, sp = FIELD[i][3];
      if (tu == null) { tu = HOME_F[i][0]; tv = HOME_F[i][1]; sp = 0.3; }
      else if (s.hit && s.hit.t < 0.12) return;                             // reaction time
      const dx = tu - f.u, dy = tv - f.v, d = Math.hypot(dx, dy);
      if (d < 0.002) return; const st = Math.min(d, sp * dt); f.u += dx / d * st; f.v += dy / d * st;
    });
  }
  function moveRunners(G, dt) {
    const s = G.s, t = s.hit ? s.hit.t : 99;
    s.runners.forEach(r => {
      if (r.outAt != null && t >= r.outAt) { r.gone = true; return; }
      if (r.wait && t < r.wait) return;
      if (r.at < r.to) {
        r.at = Math.min(r.to, r.at + r.spd * dt);
        if (r.at >= 4) { r.gone = true; if (r.counts) { s.shown++; s.pops.push({ t: 0 }); G.sfx("pass"); } }
      }
    });
    s.runners = s.runners.filter(r => !r.gone);
  }
  function hitPos(h) {
    if (h.out && h.type === "ground" && h.t >= h.ti) {   // the throw to first
      const k = Math.min(1, (h.t - h.ti) / h.throwT);
      return [h.tu + (BASES[1][0] - h.tu) * k, h.tv + (BASES[1][1] - h.tv) * k, 0.02 + 0.05 * Math.sin(k * Math.PI)];
    }
    const tau = Math.min(1, h.t / h.T);
    let r, z;
    if (h.type === "ground") { r = h.r * (1 - (1 - tau) * (1 - tau)); z = 0.015 * Math.abs(Math.sin(tau * 10)) * (1 - tau); }
    else { r = h.r * tau; z = 0.02 + 4 * h.peak * tau * (1 - tau); if (tau >= 1 && !h.out) r += Math.min(0.06, (h.t - h.T) * 0.12); }
    const [u, v] = polar(h.ang, r); return [u, v + 0.02 * (1 - tau), z];
  }

  function act(G) {
    const s = G.s;
    if (s.phase === "pitch") swing(G);
    else if ((s.phase === "intro" || s.phase === "newp") && s.pt > 0.4) windup(G);
  }

  defGame({
    key: "dawgball", name: "Dawg Ball", icon: "🧢", max: 999, cat: "sports",
    blurb: "Doodle-style batting vs the Cats.",
    how: "You bat, the Alley Cats pitch. Tap anywhere to swing - score as many runs as you can before 3 outs. Every pitch is a strike, so swing away. Timing is everything: early pulls it to left, late goes to right, right on time crushes it to center. Cats in the field chase down fly balls and grounders. Every 3 runs a nastier pitcher comes in. Score: runs x10.",
    reset(G) {
      G.s = { runs: 0, shown: 0, outs: 0, shOuts: 0, strikes: 0, bases: [0, 0, 0], stage: 0, lvl: 0, phase: "intro", pt: 0,
        ball: null, sw: null, fb: null, hit: null, runners: [], pops: [], pitches: 0, hits: 0, hrs: 0, wdur: 1,
        fl: HOME_F.map(p => ({ u: p[0], v: p[1], tu: null, tv: null })), msg: "", msgC: "#fff", sub: "", newTxt: "", face: ":dawgW:" };
    },
    update(G, dt) {
      const s = G.s; s.pt += dt;
      s.pops.forEach(p => p.t += dt); s.pops = s.pops.filter(p => p.t < 1);
      if (s.sw) s.sw.t += dt;
      moveFielders(s, dt);
      switch (s.phase) {
        case "intro": if (s.pt >= 2.6) windup(G); break;
        case "newp": if (s.pt >= 2.2) windup(G); break;
        case "windup": if (s.pt >= s.wdur) { s.phase = "pitch"; s.pt = 0; } break;
        case "pitch": {
          const b = s.ball; b.ft += dt;
          if (s.sw && s.sw.hit) { if (s.sw.t >= LAG) launch(G); }
          else if (b.ft >= b.dur + 0.3) strike(G);
          break;
        }
        case "play": {
          const h = s.hit; h.t += dt;
          if (!h.shown && h.t >= h.reveal) reveal(G);
          moveRunners(G, dt);
          const endT = h.foul ? 1.1 : Math.max(h.reveal + 1, h.out ? 0 : h.T + 0.3);
          if (h.shown && h.t >= endT && s.runners.every(r => r.at >= r.to)) endPlay(G);
          break;
        }
        case "result": if (s.pt >= 1) next(G); break;
        case "final": if (s.pt >= 2) G.over(Math.min(999, s.runs * 10), s.runs ? `${s.runs} run${s.runs > 1 ? "s" : ""} off the Cats` + (s.hrs ? ` · ${s.hrs} HR` : "") + "!" : "Shut out by the Cats. Ruff."); break;
      }
    },
    tap(G) { if (G.s.phase !== "pitch") act(G); },   // swings happen on touch-down (below)
    down(G) { if (G.s.phase === "pitch") act(G); },   // swing on touch-down, not lift (timing!)
    onKey(G, k, down) { if (down && (k === " " || k === "ArrowUp" || k === "Enter" || k === "w")) act(G); },
    draw(G, c) {
      const s = G.s, W = G.W, H = G.H, dark = G.dark(), L = lay(G);
      drawField(G, c, L, dark);
      // --- people: fielders, pitcher, runners (far to near) ---
      const ppl = [];
      s.fl.forEach((f, i) => ppl.push({ v: f.v, i, u: f.u }));
      s.runners.forEach(r => { const k = Math.floor(r.at) % 4, f = r.at - Math.floor(r.at), a = BASES[k], b = BASES[(k + 1) % 4]; ppl.push({ v: a[1] + (b[1] - a[1]) * f, u: a[0] + (b[0] - a[0]) * f, run: r }); });
      ppl.sort((a, b) => b.v - a.v);
      const pc = pitcher(s);
      for (const p of ppl) {
        const [x, y, k] = P(L, p.u, p.v);
        if (p.run) { const sz = 17 * k * L.fx / 290; G.img(c, ":dawgW:", x, y - sz * 0.45, sz); continue; }
        if (p.i === 0) {   // pitcher
          let lift = 0, lean = 0;
          if (s.phase === "windup") lift = Math.max(0, Math.sin(s.pt / s.wdur * Math.PI)) * 10;
          if (s.phase === "pitch" && s.ball && s.ball.ft < 0.15) lean = 6;
          const sz = 24 * k * L.fx / 290;
          G.emoji(c, pc.ico, x, y - sz * 0.45 - lift + lean, sz);
          continue;
        }
        const sz = 19 * k * L.fx / 290;
        c.fillStyle = "rgba(0,0,0,0.22)"; c.beginPath(); c.ellipse(x, y, sz * 0.35, sz * 0.12, 0, 0, 7); c.fill();
        G.emoji(c, "🐈", x, y - sz * 0.4, sz);
      }
      drawBatter(G, c, s, L);
      drawBalls(G, c, s, L);

      // --- HUD ---
      const top = G.hud(c, `RUNS ${s.shown}`, pc.name, `HR ${s.hrs}`, { color: "#9ad7ff" });
      const rh = 22, ry = top + rh / 2;
      c.fillStyle = "rgba(10,10,20,0.62)"; c.fillRect(0, top, W, rh);
      G.text(c, "STRIKES", 10, ry, 9, "#fff", "left");
      for (let i = 0; i < 3; i++) { c.fillStyle = i < s.strikes ? "#ffd23f" : "rgba(255,255,255,0.25)"; c.beginPath(); c.arc(84 + i * 14, ry, 5, 0, 7); c.fill(); }
      G.text(c, "OUTS", W - 54, ry, 9, "#fff", "right");
      for (let i = 0; i < 3; i++) { c.fillStyle = i < s.shOuts ? "#ff5a4f" : "rgba(255,255,255,0.25)"; c.beginPath(); c.arc(W - 44 + i * 14, ry, 5, 0, 7); c.fill(); }

      // --- swing feedback + "+1" pops ---
      const [px, py] = P(L, 0, 0);
      if (s.sw && s.fb && s.sw.t < 0.8) { G.text(c, s.fb[0], px + 1, py - 92 + 1, 12, "#000"); G.text(c, s.fb[0], px, py - 92, 12, s.fb[1]); }
      s.pops.forEach(p => { c.globalAlpha = 1 - p.t; G.text(c, "+1", px + 34, py - 40 - p.t * 46, 16, "#7dff8a"); c.globalAlpha = 1; });

      // --- call banner ---
      if (s.msg && (s.phase === "play" || s.phase === "result")) {
        const y = P(L, 0, 0.62)[1], big = /HOME|SLAM/.test(s.msg);
        c.fillStyle = "rgba(10,14,30,0.42)"; c.fillRect(0, y - 24, W, 48);
        G.banner(c, s.msg, s.msgC, y, Math.min(big ? 28 : 22, (W * 0.9) / s.msg.length));
        if (s.sub) pill(G, c, s.sub, W / 2, y + 40, "#fff");
      }
      // --- hints for the first couple of pitches ---
      if ((s.phase === "windup" || s.phase === "pitch") && s.pitches < 2) {
        G.hint(c, "TAP TO SWING", G.t + 1, H - 24);
        G.hint(c, "EARLY = LEFT · LATE = RIGHT", G.t + 1, H - 58);
      }
      // --- overlays ---
      if (s.phase === "intro" || s.phase === "newp" || s.phase === "final") {
        const by = H * 0.36;
        c.fillStyle = "rgba(10,14,30,0.8)"; c.fillRect(0, by, W, 112);
        c.fillStyle = "#ffd23f"; c.fillRect(0, by, W, 3); c.fillRect(0, by + 109, W, 3);
        if (s.phase === "intro") {
          G.banner(c, "PLAY BALL!", "#ffd23f", by + 32, 22);
          G.text(c, "TAP TO SWING · 3 OUTS", W / 2, by + 64, 10, "#fff");
          G.text(c, "EVERY PITCH IS A STRIKE", W / 2, by + 86, 9, "#9ad7ff");
        } else if (s.phase === "newp") {
          G.emoji(c, pc.ico, W / 2, by - 30, 56);
          G.text(c, s.newTxt, W / 2, by + 24, 10, "#9ad7ff");
          G.banner(c, pc.name, "#ffd23f", by + 54, 22);
          G.text(c, s.newTxt === "NOW PITCHING" ? pc.says : "THROWING HARDER", W / 2, by + 88, 10, "#fff");
        } else {
          G.img(c, s.face, W / 2, by - 34, 60);
          G.banner(c, s.runs + (s.runs === 1 ? " RUN" : " RUNS"), s.runs >= 5 ? "#7dff8a" : "#fff", by + 38, 24);
          G.text(c, `${s.hits} HITS · ${s.hrs} HR`, W / 2, by + 78, 10, "#9ad7ff");
        }
      }
    }
  });

  function pill(G, c, msg, x, y, col) {
    const sz = 10; c.font = `${sz}px 'Press Start 2P', ui-monospace, monospace`; const w = c.measureText(msg).width + 24;
    c.fillStyle = "rgba(10,14,30,0.78)"; c.beginPath(); if (c.roundRect) c.roundRect(x - w / 2, y - 13, w, 26, 13); else c.rect(x - w / 2, y - 13, w, 26); c.fill();
    G.text(c, msg, x, y, sz, col || "#fff");
  }

  function drawField(G, c, L, dark) {
    const W = L.W, H = L.H;
    // sky + stands
    c.fillStyle = dark ? "#121a33" : "#8fd3ff"; c.fillRect(0, 0, W, H);
    const fyMax = P(L, ...polar(45, fenceR(45)))[1];
    c.fillStyle = dark ? "#1c2240" : "#3a4a6b"; c.fillRect(0, 50, W, fyMax - 40);
    const cols = ["#e8505b", "#f9d56e", "#5fb7e8", "#b98cf0", "#f3a35c", "#ffffff"];
    for (let y = 58, row = 0; y < fyMax + 6; y += 8, row++) for (let x = (row % 2) * 4, i = row; x < W; x += 9, i++) {
      c.fillStyle = cols[(i * 7 + row * 3) % 6]; c.globalAlpha = 0.75; c.fillRect(x, y + ((i * 5) % 3 === 0 ? 1 : 0), 5, 5);
    }
    c.globalAlpha = 1;
    if (dark) { c.fillStyle = "#fff6b0"; for (let i = 0; i < 4; i++) c.fillRect(W * (0.12 + i * 0.25) - 10, 60, 20, 4); }
    // grass (everything in front of the fence), with mowing stripes
    const fence = []; for (let a = -84; a <= 84; a += 3) { const p = polar(a, fenceR(Math.min(45, Math.abs(a)))); fence.push(p); }
    c.save();
    c.beginPath(); fence.forEach((p, i) => { const q = P(L, p[0], p[1]); if (i) c.lineTo(q[0], q[1]); else c.moveTo(q[0], q[1]); });
    c.lineTo(W + 400, H + 10); c.lineTo(-400, H + 10); c.closePath();
    c.fillStyle = dark ? "#1f5a26" : "#5cb84a"; c.fill(); c.clip();
    c.fillStyle = dark ? "#246630" : "#67c454";
    for (let v = -0.1, i = 0; v < 1.05; v += 0.07, i++) if (i % 2) { const y0 = P(L, 0, v + 0.07)[1], y1 = P(L, 0, v)[1]; c.fillRect(0, y0, W, y1 - y0); }
    // warning track
    const trk = []; for (let a = -45; a <= 45; a += 3) trk.push(polar(a, fenceR(a))); for (let a = 45; a >= -45; a -= 3) trk.push(polar(a, fenceR(a) - 0.045));
    c.fillStyle = dark ? "#6b4a2c" : "#b98450"; poly(c, L, trk); c.fill();
    c.restore();
    // outfield wall + foul poles
    const wall = (dy, col, lw) => { c.strokeStyle = col; c.lineWidth = lw; c.beginPath(); for (let a = -45; a <= 45; a += 3) { const q = P(L, ...polar(a, fenceR(a))); if (a > -45) c.lineTo(q[0], q[1] + dy); else c.moveTo(q[0], q[1] + dy); } c.stroke(); };
    wall(-3, dark ? "#16402a" : "#2f7a4f", 7); wall(-7, "#ffd23f", 2);
    for (const a of [-45, 45]) { const q = P(L, ...polar(a, fenceR(a))); c.fillStyle = "#ffd23f"; c.fillRect(q[0] - 1.5, q[1] - 30, 3, 30); }
    const lbl = (a, t) => { const q = P(L, ...polar(a, fenceR(a))); G.text(c, t, q[0], q[1] - 3, 7, "#fff"); };
    lbl(0, "400"); lbl(-38, "330"); lbl(38, "330");
    // infield dirt, infield grass, mound, home circle
    const dirt = dark ? "#7a5230" : "#c98a4b";
    const arc = [[-0.02, 0.0]]; for (let a = -45; a <= 45; a += 5) arc.push(polar(a, 0.47)); arc.push([0.02, 0.0]);
    c.fillStyle = dirt; poly(c, L, arc); c.fill();
    c.fillStyle = dark ? "#246630" : "#62bf50"; poly(c, L, [[0, 0.07], [0.155, 0.19], [0, 0.325], [-0.155, 0.19]]); c.fill();
    c.fillStyle = dark ? "#8a6038" : "#d89a5a"; poly(c, L, circ(0, 0.19, 0.03, 16)); c.fill();
    c.fillStyle = "#fff"; poly(c, L, [[-0.012, 0.183], [0.012, 0.183], [0.012, 0.188], [-0.012, 0.188]]); c.fill();
    c.fillStyle = dirt; poly(c, L, circ(0, 0.01, 0.055, 20)); c.fill();
    // foul lines
    c.strokeStyle = "rgba(255,255,255,0.9)"; c.lineWidth = 2;
    for (const a of [-45, 45]) { const p0 = P(L, 0, 0), p1 = P(L, ...polar(a, fenceR(a))); c.beginPath(); c.moveTo(p0[0], p0[1]); c.lineTo(p1[0], p1[1]); c.stroke(); }
    // batter's boxes
    c.lineWidth = 1.5; c.strokeStyle = "rgba(255,255,255,0.7)";
    for (const sx of [-1, 1]) { poly(c, L, [[sx * 0.016, -0.012], [sx * 0.045, -0.012], [sx * 0.045, 0.03], [sx * 0.016, 0.03]]); c.stroke(); }
    // bases + plate
    c.fillStyle = "#fff";
    for (let i = 1; i < 4; i++) { const [u, v] = BASES[i], b = 0.011; poly(c, L, [[u, v - b], [u + b, v], [u, v + b], [u - b, v]]); c.fill(); }
    poly(c, L, [[-0.009, 0.01], [0.009, 0.01], [0.009, 0.003], [0, -0.004], [-0.009, 0.003]]); c.fill();
  }

  function drawBatter(G, c, s, L) {
    const h = s.hit;
    if (s.phase === "play" && h && !h.foul && h.t > 0.25) return;   // he's running now
    const [px, py] = P(L, 0, 0), bx = px - L.fx * 0.075 / CD, by = py - 36;
    let ang = -2.25;
    if (s.sw) { const t = s.sw.t; ang = t < LAG ? -2.25 + (t / LAG) * 2.25 : Math.min(1.7, (t - LAG) / 0.1 * 1.7); }
    G.img(c, s.face, bx, by, 62);
    G.emoji(c, "🧢", bx + 2, by - 28, 24);
    const hx = bx + 18, hy = by + 10, len = Math.max(48, px - hx + 18);
    c.save(); c.translate(hx, hy); c.rotate(ang);
    c.fillStyle = "#7a4a1e"; c.fillRect(0, -2.5, len * 0.35, 5);
    c.fillStyle = "#c98a4b"; c.beginPath(); c.moveTo(len * 0.33, -3); c.lineTo(len - 4, -5.5); c.arc(len - 4, 0, 5.5, -Math.PI / 2, Math.PI / 2); c.lineTo(len * 0.33, 3); c.closePath(); c.fill();
    c.strokeStyle = "rgba(0,0,0,0.35)"; c.lineWidth = 1; c.stroke();
    c.restore();
  }

  function ballDot(c, x, y, r) { c.fillStyle = "#fff"; c.beginPath(); c.arc(x, y, r, 0, 7); c.fill(); c.strokeStyle = "#c33"; c.lineWidth = 1; c.stroke(); }
  function drawBalls(G, c, s, L) {
    const sc = L.fx / 290;
    // the pitch
    if (s.ball && s.phase === "pitch") {
      const b = s.ball;
      if (!(s.sw && s.sw.launched)) {
        const [u, v, z] = pitchPos(b, b.ft), [gx, gy, k] = P(L, u, v, 0), [x, y] = P(L, u, v, z), r = 3 * k * sc;
        c.fillStyle = "rgba(0,0,0,0.25)"; c.beginPath(); c.ellipse(gx, gy, r, r * 0.4, 0, 0, 7); c.fill();
        ballDot(c, x, y, r);
        if (b.ft < 0.6 * b.dur) {   // what's coming, by the mound
          const [mx, my] = P(L, 0.06, 0.19); c.globalAlpha = 0.85;
          G.emoji(c, PICO[b.kind], mx + 6, my - 30, 14); G.text(c, PNAME[b.kind], mx + 6, my - 12, 8, "#fff"); c.globalAlpha = 1;
        }
      }
    }
    // the ball in play
    const h = s.hit;
    if (h && !((h.bases === 4 || h.foul) && h.t >= h.T)) {
      const [u, v, z] = hitPos(h), [gx, gy, k] = P(L, u, v, 0), [x, y] = P(L, u, v, z), r = Math.max(2.5, 3 * k * sc);
      c.fillStyle = "rgba(0,0,0,0.28)"; c.beginPath(); c.ellipse(gx, gy, r, r * 0.4, 0, 0, 7); c.fill();
      ballDot(c, x, y, r + Math.min(3, z * 8));
    }
  }
})();
