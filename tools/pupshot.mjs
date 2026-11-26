// Pup Shot court checker: fewest shots that score on every court (breadth-first over hold lengths and warp moments),
// compared with the court's par.   node tools/pupshot.mjs   (exit 1 if a court can't be made in par)
import fs from "fs"; import vm from "vm";
const ctx = { GAMEDEFS: {}, defGame(d) { ctx.GAMEDEFS[d.key] = d; } }; vm.createContext(ctx);
vm.runInContext(fs.readFileSync(new URL("../games/g_pupshot.js", import.meta.url), "utf8"), ctx);
const { SHOT, world, step, SPEED, ANG, aimDir } = ctx.GAMEDEFS.pupshot._eng;
export function solve(L, max = 4) {
  const W0 = world(L); let front = [{ x: L.d[0], y: L.d[1] - 4, on: W0.bombs.map(() => true) }], ways = 0;
  for (let n = 1; n <= max; n++) {
    const next = [], seen = new Set();
    for (const s of front) for (let p = 0.08; p <= 1; p += 0.02) {
      const W = world(L); W.bombs.forEach((q, i) => q.on = s.on[i]);
      const dir = aimDir(W, s.x), v = SPEED(p), b = { x: s.x + Math.cos(ANG) * dir * 3, y: s.y - Math.sin(ANG) * 3, vx: Math.cos(ANG) * dir * v, vy: -Math.sin(ANG) * v };
      for (let i = 1; i <= 420; i++) {
        const r = step(W, b, 1 / 60, 0.55); if (r === "score") { ways++; break; } if (r === "out") break;
        if (i % 6 === 0) { const k = Math.round(b.x / 3) + ":" + Math.round(b.y / 3) + ":" + W.bombs.map(q => +q.on).join(""); if (!seen.has(k)) { seen.add(k); next.push({ x: b.x - 2, y: b.y, on: W.bombs.map(q => q.on) }); } }
      }
    }
    if (ways) return [n, ways];
    front = next.length > 500 ? next.filter((_, i) => i % Math.ceil(next.length / 500) === 0) : next;
  }
  return [0, 0];
}
if (process.argv[1].endsWith("pupshot.mjs")) {
  let bad = 0;
  SHOT.forEach((L, i) => { const [n, ways] = solve(L), ok = n && n <= L.par; if (!ok) bad++; console.log(`court ${i + 1}: best ${n || "none"} (${ways} ways), par ${L.par}${ok ? "" : "  <-- FIX"}`); });
  process.exit(bad ? 1 : 0);
}
