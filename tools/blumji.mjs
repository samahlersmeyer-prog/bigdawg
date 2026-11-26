// Blumji Bounce stage checker: finds the fewest bounces that reach the flag in every stage (breadth-first over hold
// lengths, and over launch moments when a stage has moving platforms) and compares it with the stage's par.
//   node tools/blumji.mjs        check every stage (exit 1 if one can't be finished in par)
import { createRequire } from "module"; const require = createRequire(import.meta.url);
const { LV, plats, step, SPEED, ANG, aimDir } = require("../games/g_blumji.js")._eng;
function hop(L, on, off, t, p) {
  const P = plats(L, t)[on], x = P.x + off, dir = aimDir(L, on, x, t), v = SPEED(p), b = { x, y: P.y, vx: dir * Math.cos(ANG) * v, vy: -Math.sin(ANG) * v };
  for (let i = 0; i < 480; i++) { t += 1 / 60; const r = step(L, b, t, 1 / 60); if (r === "out") return null; if (r && r.land) return { on: r.land.i, off: Math.max(0, Math.min(r.land.w, b.x - r.land.x)), t, flag: r.land.flag }; }
  return null;
}
export function solve(L, max = 7) {
  const moving = L.p.some(a => a[3] === "m"), waits = moving ? Array.from({ length: 24 }, (_, i) => i * 0.3) : [0];
  let front = [{ on: 0, off: L.p[0][2] / 2, t: 0 }], seen = new Set(["0"]), ways = 0;
  for (let n = 1; n <= max; n++) {
    const next = [];
    for (const s of front) for (const w of waits) for (let p = 0.08; p <= 1; p += 0.02) {
      const e = hop(L, s.on, s.off, s.t + w, p); if (!e) continue;
      if (e.flag) { ways++; continue; }
      const k = e.on + ":" + Math.round(e.off / 2) + (moving ? ":" + Math.round((e.t % 7) / 0.5) : ""); if (!seen.has(k)) { seen.add(k); next.push(e); }
    }
    if (ways) return [n, ways];
    front = next.slice(0, 400);
  }
  return [0, 0];
}
if (process.argv[1].endsWith("blumji.mjs")) {
  let bad = 0;
  LV.forEach((L, i) => { const [n, ways] = solve(L), ok = n && n <= L.par; if (!ok) bad++; console.log(`stage ${i + 1}: best ${n || "none"} (${ways} ways), par ${L.par}${ok ? "" : "  <-- FIX"}`); });
  process.exit(bad ? 1 : 0);
}
