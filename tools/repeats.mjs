// Repeat checker for the four daily puzzles (Five, Groups, Mini, Strands). Run from the repo root:
//
//   node tools/repeats.mjs          fail if any puzzle not played yet repeats an earlier one (stamp.py runs this)
//   node tools/repeats.mjs all      also list repeats among puzzles already played (for reference)
//
// A repeat is: Five - same word. Groups - same category name, or two groups sharing 2+ words.
// Mini - two grids sharing 3+ entries (across or down). Strands - same theme title, same spangram,
// or 2+ theme words in common. Puzzles already played (bank index <= today) are left alone.
// It also warns when a bank is about to run out and start over (that is a repeat too).
import fs from "node:fs";
import vm from "node:vm";

const ctx = { setTimeout() {}, fetch() {} };
vm.createContext(ctx);
vm.runInContext(fs.readFileSync("js/data.js", "utf8") + "\n;this.B={ANSWERS,PUZZLES,MINIS,STRANDS};", ctx);
const { ANSWERS, PUZZLES, MINIS, STRANDS } = ctx.B;

const EPOCH = Date.UTC(2026, 9, 6), now = new Date();
const DAY = Math.round((Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) - EPOCH) / 864e5);
const showAll = process.argv[2] === "all";
const out = [], past = [];
const flag = (game, i, j, why) => (j > DAY ? out : past).push(`${game} #${i} vs #${j}: ${why}`);
const shared = (a, b) => a.filter(x => b.includes(x));
const norm = s => s.toLowerCase().replace(/[^a-z_]/g, "");

ANSWERS.forEach((w, j) => { const i = ANSWERS.findIndex(x => x.toLowerCase() === w.toLowerCase()); if (i < j) flag("Five", i, j, w); });

const groups = PUZZLES.flatMap((p, i) => p.map(([n, w]) => ({ i, n, w })));
groups.forEach((x, a) => groups.slice(a + 1).forEach(y => {
  if (x.i === y.i) return;
  const s = shared(x.w, y.w);
  if (norm(x.n) === norm(y.n) || s.length >= 2) flag("Groups", x.i, y.i, `"${x.n}" / "${y.n}"${s.length ? " " + s.join(",") : ""}`);
}));

const BLACK = { A: [0, 24], B: [4, 20], C: [0, 4, 20, 24] };
const entries = m => {
  const g = Array(25).fill(""), bl = BLACK[m.p];
  for (let r = 0; r < 5; r++) { let k = 0; for (let c = 0; c < 5; c++) if (!bl.includes(r * 5 + c)) g[r * 5 + c] = m.a[r][k++]; }
  const downs = [0, 1, 2, 3, 4].map(c => [0, 1, 2, 3, 4].map(r => g[r * 5 + c]).join(""));
  return [...m.a, ...downs];
};
const E = MINIS.map(entries);
E.forEach((a, i) => E.slice(i + 1).forEach((b, k) => { const s = shared(a, b); if (s.length >= 3) flag("Mini", i, i + 1 + k, s.join(",")); }));

STRANDS.forEach((a, i) => STRANDS.slice(i + 1).forEach((b, k) => {
  const wa = a.w.map(x => x[0]), wb = b.w.map(x => x[0]), s = shared(wa, wb), why = [];
  if (norm(a.t) === norm(b.t)) why.push("same title");
  if (wa[0] === wb[0]) why.push("same spangram " + wa[0]);
  if (s.length >= 2) why.push(s.join(","));
  if (why.length) flag("Strands", i, i + 1 + k, `"${a.t}" / "${b.t}" ${why.join("; ")}`);
}));

if (showAll && past.length) console.log("Already played (left alone):\n  " + past.join("\n  "));
for (const [name, bank] of [["Five", ANSWERS], ["Groups", PUZZLES], ["Mini", MINIS], ["Strands", STRANDS]]) {
  const left = bank.length - 1 - DAY;
  if (left < 21) console.warn(`repeats: ${name} bank starts over in ${left + 1} day(s) (on day #${bank.length + 1}) - add more puzzles`);
}
if (out.length) { console.error("repeats: upcoming puzzles repeat earlier ones:\n  " + out.join("\n  ")); process.exit(1); }
console.log(`repeats: no repeats in upcoming puzzles (today is day #${DAY + 1})`);
