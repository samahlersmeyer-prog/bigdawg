// Strands puzzle checker and board builder. Run from the repo root:
//
//   node tools/strands.mjs check            validate every puzzle in js/data.js (stamp.py runs this; it fails on errors)
//   node tools/strands.mjs fix              re-lay out every broken puzzle (same theme + words), rebuild its bonus words
//   node tools/strands.mjs relayout 30 31   force a fresh layout for those puzzle numbers (bank index)
//
// A good board: 6 wide x 8 tall, every one of the 48 cells used by exactly one word, each word a path of
// touching cells, no two paths crossing (a diagonal step can't share a 2x2 square with the opposite
// diagonal), and the spangram (word 0) touching opposite sides. Same rules the game itself plays by.
import fs from "node:fs";

const DATA = "js/data.js", BONUS = "strands_x.json";
const src = fs.readFileSync(DATA, "utf8");
const a = src.indexOf("const STRANDS = ["), b = src.indexOf("\n];", a);
const lines = src.slice(a, b).split("\n").slice(1).filter(l => l.trim().startsWith("{"));
const P = lines.map(l => JSON.parse(l.trim().replace(/,$/, "")));

const W = 6, H = 8, N = W * H;
const adj = (p, q) => p !== q && Math.abs((p / W | 0) - (q / W | 0)) <= 1 && Math.abs(p % W - q % W) <= 1;
const edge = (p, q) => p < q ? p + "-" + q : q + "-" + p;
const cross = (p, q) => { const r1 = p / W | 0, c1 = p % W, r2 = q / W | 0, c2 = q % W; return r1 !== r2 && c1 !== c2 ? edge(r1 * W + c2, r2 * W + c1) : null; };
const spans = c => { const rs = c.map(i => i / W | 0), cs = c.map(i => i % W); return (rs.includes(0) && rs.includes(H - 1)) || (cs.includes(0) && cs.includes(W - 1)); };
const nbrs = p => [-7, -6, -5, -1, 1, 5, 6, 7].map(d => p + d).filter(q => q >= 0 && q < N && adj(p, q));

function problems(p) {
  const errs = [], owner = new Map(), diag = new Map();
  if (p.g.length !== N) errs.push(`grid has ${p.g.length} letters, needs ${N}`);
  p.w.forEach(([w, c], k) => {
    if (w.length !== c.length) errs.push(`${w}: ${c.length} cells for ${w.length} letters`);
    c.forEach((x, q) => {
      if (p.g[x] !== w[q]) errs.push(`${w}: cell ${x} is ${p.g[x]}, not ${w[q]}`);
      if (owner.has(x)) errs.push(`${w} overlaps ${owner.get(x)} at cell ${x}`);
      owner.set(x, w);
      if (q) {
        if (!adj(c[q - 1], x)) errs.push(`${w}: cells ${c[q - 1]} and ${x} don't touch`);
        const o = cross(c[q - 1], x);
        if (o) { if (diag.has(o)) errs.push(`${w} crosses ${diag.get(o)}`); diag.set(edge(c[q - 1], x), w); }
      }
    });
    if (k === 0 && !spans(c)) errs.push(`spangram ${w} doesn't touch opposite sides`);
  });
  if (owner.size !== N) errs.push(`words cover ${owner.size} of ${N} cells`);
  return errs;
}

// Split the board into non-crossing paths with the words' lengths, then write the letters in.
function layout(words, seed) {
  let s = seed >>> 0; const rnd = () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296;
  const shuf = x => { x = x.slice(); for (let i = x.length - 1; i > 0; i--) { const j = rnd() * (i + 1) | 0; [x[i], x[j]] = [x[j], x[i]]; } return x; };
  const lens = words.map(w => w.length), cells = Array(words.length), free = new Set([...Array(N).keys()]), diags = new Set();
  let steps = 0;
  const regionsOk = left => { // every pocket of free cells must be big enough for some remaining word
    const min = Math.min(...left.map(k => lens[k])), seen = new Set();
    for (const c of free) {
      if (seen.has(c)) continue;
      let n = 0; const st = [c]; seen.add(c);
      while (st.length) { const x = st.pop(); n++; for (const y of nbrs(x)) if (free.has(y) && !seen.has(y)) { seen.add(y); st.push(y); } }
      if (n < min) return false;
    }
    return true;
  };
  const place = left => {
    if (!left.length) return free.size === 0;
    if (++steps > 200000) return false;
    const start = Math.min(...free); // the first open cell starts the next word
    for (const k of shuf(left)) {
      const L = lens[k], path = [start], own = [];
      free.delete(start);
      const grow = () => {
        if (path.length === L) {
          if (k === 0 && !spans(path)) return false;
          const rest = left.filter(x => x !== k);
          if (rest.length && !regionsOk(rest)) return false;
          cells[k] = path.slice(); return place(rest);
        }
        if (++steps > 200000) return false;
        const last = path[path.length - 1];
        for (const y of shuf(nbrs(last))) {
          if (!free.has(y)) continue;
          const o = cross(last, y);
          if (o && diags.has(o)) continue;
          const e = o ? edge(last, y) : null;
          free.delete(y); path.push(y); if (e) diags.add(e);
          if (grow()) return true;
          free.add(y); path.pop(); if (e) diags.delete(e);
        }
        return false;
      };
      if (grow()) return true;
      free.add(start);
    }
    return false;
  };
  if (!place([...words.keys()])) return null;
  const g = Array(N);
  cells.forEach((c, k) => { if (rnd() < 0.5) c.reverse(); c.forEach((x, q) => g[x] = words[k][q]); });
  return { g: g.join(""), cells };
}

// Ordinary words (4+ letters) you can trace on the board; they earn hints. Dictionary = every bonus word already listed.
function bonusWords(p, dict) {
  const theme = new Set(p.w.map(x => x[0])), out = [];
  const can = w => { const go = (i, at, used) => { if (i === w.length) return true; for (const y of i ? nbrs(at) : [...Array(N).keys()]) if (!used.has(y) && p.g[y] === w[i]) { used.add(y); if (go(i + 1, y, used)) return true; used.delete(y); } return false; }; return go(0, -1, new Set()); };
  for (const w of dict) if (!theme.has(w) && can(w)) out.push(w);
  return out.sort().join(" ");
}

const cmd = process.argv[2] || "check";
const bad = P.map((p, i) => [i, problems(p)]).filter(x => x[1].length);
if (cmd === "check") {
  bad.forEach(([i, e]) => console.error(`Strands #${i} "${P[i].t}": ${e.slice(0, 3).join("; ")}`));
  if (bad.length) { console.error(`strands: ${bad.length} broken puzzle(s). Fix with: node tools/strands.mjs fix`); process.exit(1); }
  console.log(`strands: all ${P.length} puzzles OK`);
} else if (cmd === "fix" || cmd === "relayout") {
  const which = cmd === "fix" ? bad.map(x => x[0]) : process.argv.slice(3).map(Number);
  const X = JSON.parse(fs.readFileSync(BONUS, "utf8"));
  const dict = [...new Set(X.join(" ").split(" ").filter(Boolean))];
  for (const i of which) {
    const p = P[i], words = p.w.map(x => x[0]);
    let r = null;
    for (let t = 0; !r && t < 500; t++) r = layout(words, i * 7919 + t * 104729 + 1);
    if (!r) { console.error(`#${i} "${p.t}": couldn't find a layout`); process.exit(1); }
    p.g = r.g; p.w = words.map((w, k) => [w, r.cells[k]]);
    const e = problems(p); if (e.length) { console.error(`#${i}: ${e.join("; ")}`); process.exit(1); }
    X[i] = bonusWords(p, dict);
    console.log(`#${i} "${p.t}": new layout, ${X[i].split(" ").length} bonus words`);
  }
  const body = P.map(p => JSON.stringify(p)).join(",\n");
  fs.writeFileSync(DATA, src.slice(0, a) + "const STRANDS = [\n" + body + src.slice(b));
  fs.writeFileSync(BONUS, JSON.stringify(X));
} else { console.error("usage: node tools/strands.mjs [check|fix|relayout N...]"); process.exit(2); }
