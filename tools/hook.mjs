// Hook Dawg level builder + checker.  node tools/hook.mjs        check the levels in games/g_hook.js with the bot
//                                     node tools/hook.mjs gen    build a fresh set and print LEVELS / PAR to paste in
// The bot tries a few hundred random "when to grab / when to let go" styles per level. The share that finish is the
// level's forgiveness; levels are ordered easiest first and PAR is 1.15x the bot's time.
import fs from "fs"; import vm from "vm";
const ctx = { GAMEDEFS: {}, defGame(d) { ctx.GAMEDEFS[d.key] = d; }, store: { get() {}, set() {} } }; vm.createContext(ctx);
vm.runInContext(fs.readFileSync(new URL("../games/g_hook.js", import.meta.url), "utf8"), ctx);
const { LEVELS, PAR, mk, step, target } = ctx.GAMEDEFS.hook._t;
const rng = seed => () => (seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296;

// One random play style from a saved moment (hanging on a hook), until the dawg hangs on a later hook, finishes or dies.
function run(from, r) {
  const st = Object.assign({}, from), L = st.L, h0 = st.hk, up = 0.1 + r() * 1.0, off = -60 + r() * 200, fall = 100 + r() * 700, jit = r() * 0.25;
  let held = true, wait = r() * 0.3;
  for (let i = 0; i < 120 * 10 && !st.done && !st.dead; i++) {
    if (wait > 0) wait -= 1 / 120;
    else if (st.hk >= 0) { if (st.vx > 60 && Math.atan2(-st.vy, st.vx) > up + (r() - 0.5) * jit && st.x > L.h[st.hk][0] - 40) { held = false; wait = 0.08; } }
    else { const t = target(st); if (t >= 0 && (L.h[t][0] > st.x + off || st.vy > fall)) { held = true; wait = 0.12; } }
    step(st, held); if (st.hk < 0 && held) held = false;
    if (st.hk > h0) return st;
  }
  return st.done ? st : null;
}
// Walk the level hook to hook. Returns [forgiveness, time]: the share of random styles that get past the hardest hook
// (0 = the bot can't finish), and the time of the run it pieced together.
function rate(L, n = 120) {
  const r = rng(7); let beam = [mk(L)], worst = 1; beam[0].was = true;
  for (let guard = 0; guard < 60; guard++) {
    const wins = [];
    for (let i = 0; i < n; i++) { const e = run(beam[i % beam.length], r); if (e) wins.push(e); }
    if (!wins.length) return [0, 1e9];
    worst = Math.min(worst, wins.length / n);
    const fin = wins.filter(e => e.done).sort((a, c) => a.t - c.t);
    if (fin.length * 4 >= wins.length) return [worst, fin[0].t];
    beam = wins.filter(e => !e.done).sort((a, c) => c.hk - a.hk || a.t - c.t).slice(0, 8); // several ways of hanging on the next hook
  }
  return [0, 1e9];
}

function gen(seed, lv, T = "bpw") { // lv 0..1
  const r = rng(seed), R = Math.round, h = [[150, 0, 235]], b = [], k = [];
  let x = 150, y = 0; const n = 6 + R(lv * 9), ring = R(235 - lv * 20);
  for (let i = 0; i < n; i++) {
    const q = r(); let dy = R((r() - 0.5) * (90 + lv * 100)); const x0 = x;
    if (q < 0.22 && lv > 0.08 && T.includes("b")) { b.push([x + 210, y + 260]); x += 445 + R(r() * 35); }                                   // bumper bridges a long gap
    else if (q < 0.4 && lv > 0.25 && T.includes("p")) { const dx = 290; k.push([x + dx / 2 - 22, y + 140 + R(r() * 50), 44, 700]); x += dx; } // pillar to clear
    else if (q < 0.52 && lv > 0.45 && T.includes("w")) { const dx = 300; k.push([x + dx / 2 - 22, y - 620, 44, 620 + 85 + R(r() * 30)]); x += dx; } // wall to duck under
    else x += R(205 + r() * (40 + lv * 45));
    if (x - x0 > 260) dy = R(dy * 0.3); // keep the hook after an obstacle near the same height
    y += dy; h.push([x, y, ring]);
  }
  const ys = h.map(q => q[1]);
  k.push([x + 330, y + 200, 260, 40]);
  return { h, b, k, fin: x + 380, bot: Math.max(...ys) + 420 };
}

if (process.argv[2] === "gen") {
  const N = 24, out = [];
  for (let i = 0; i < N; i++) {
    const lv = i / (N - 1); let pick = null;
    const want = 0.45 - 0.37 * lv; // forgiveness to aim for: easy early, tight late
    for (let s = 1; s <= 40 && !(pick && Math.abs(pick.p - want) < 0.08); s++) { const L = gen(i * 1000 + s, lv), [p, t] = rate(L); if (p >= 0.05 && (!pick || Math.abs(p - want) < Math.abs(pick.p - want))) pick = { L, p, t }; }
    if (!pick) throw new Error("no level for slot " + i);
    out.push(pick);
  }
  out.sort((a, c) => c.p - a.p);
  console.log("  const LEVELS = " + JSON.stringify(out.map(o => o.L)).replace(/"/g, "") + ";");
  console.log("  const PAR = " + JSON.stringify(out.map(o => Math.round(o.t * 11.5) / 10)) + ";");
  console.error(out.map((o, i) => `${i + 1}: ${(o.p * 100).toFixed(0)}% ${o.t.toFixed(1)}s`).join("  "));
} else {
  let bad = 0;
  LEVELS.forEach((L, i) => { const [p, t] = rate(L); const ok = p >= 0.05 && PAR[i] >= t; if (!ok) bad++; console.log(`level ${i + 1}: bot finishes ${(p * 100).toFixed(0)}%, best ${t.toFixed(1)}s, par ${PAR[i]}${ok ? "" : "  <-- FIX"}`); });
  if (!LEVELS.length || bad) { console.error("hook: levels need fixing"); process.exit(1); }
}
