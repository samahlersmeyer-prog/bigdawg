// ================= HOME =================
function renderHome() {
  const hr = now.getHours();
  const part = hr < 12 ? "Good morning" : hr < 17 ? "Good afternoon" : "Good evening";
  const hello = $("hello"); hello.innerHTML = "";
  hello.append(document.createTextNode(part + (me ? ", " : "")));
  if (me) hello.append(el("b", null, me.name));
  hello.append(document.createTextNode(" · " + now.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" }) + " · No. " + NUM));
  const setStat = (id, text, done) => { const s = $("st-" + id); s.textContent = text; s.classList.toggle("done", !!done); };
  // Five
  if (fiveDone()) { $("sub-five").textContent = fiveWon() ? `Solved in ${fiveN()}` : `The word was ${ANSWER}`; setStat("five", "Results", true); }
  else if (S.five.guesses.length) { $("sub-five").textContent = `${S.five.guesses.length} of 6 guesses used`; setStat("five", "Continue"); }
  else { $("sub-five").textContent = "Guess the word in 6 tries"; setStat("five", "Play"); }
  // Groups
  if (groupsDone()) { $("sub-groups").textContent = groupsWon() ? (S.groups.mistakes ? `Solved with ${S.groups.mistakes} mistake${S.groups.mistakes > 1 ? "s" : ""}` : "Perfect sort") : "Out of mistakes"; setStat("groups", "Results", true); }
  else if (S.groups.history.length) { $("sub-groups").textContent = `${S.groups.solved.length} of 4 groups found`; setStat("groups", "Continue"); }
  else { $("sub-groups").textContent = "Find the four hidden groups"; setStat("groups", "Play"); }
  // Strands
  if (S.strands.done) { $("sub-strands").textContent = `Solved in ${fmtTime(S.strands.el)}` + (S.strands.hints.length ? ` · ${S.strands.hints.length} hint${S.strands.hints.length > 1 ? "s" : ""}` : ""); setStat("strands", "Results", true); }
  else if (S.strands.started) { $("sub-strands").textContent = `${S.strands.found.length} of ${SP.w.length} found · paused at ${fmtTime(S.strands.el)}`; setStat("strands", "Continue"); }
  else { $("sub-strands").textContent = "Find the theme words, timed"; setStat("strands", "Play"); }
  // Mini
  if (S.mini.done) { $("sub-mini").textContent = `Solved in ${fmtTime(S.mini.el)}`; setStat("mini", "Results", true); }
  else if (S.mini.started) { $("sub-mini").textContent = `Paused at ${fmtTime(S.mini.el)}`; setStat("mini", "Continue"); }
  else { $("sub-mini").textContent = "A quick crossword, timed"; setStat("mini", "Play"); }
  // Scores
  if (board) {
    const n = board.players.filter(p => p.t && (p.t.f || p.t.g || p.t.c || p.t.s)).length;
    $("sub-scores").textContent = n ? `${n} played today` : "Be the first on the board today";
  }
  const ban = bannerText(); if (ban) $("sub-scores").textContent = ban + (board ? ` · ${$("sub-scores").textContent}` : "");
  if (shade.inbox && shade.inbox.length) $("sub-scores").textContent = `🎯 ${shade.inbox.length} shade${shade.inbox.length > 1 ? "s" : ""} waiting for you`;
  let standalone = false; try { standalone = !!(window.navigator.standalone || window.matchMedia("(display-mode: standalone)").matches || (window.top && window.top.navigator && window.top.navigator.standalone)); } catch (e) {}
  const fast = hasServer() && FAST_URL;
  $("fast-tip").hidden = !fast;
  if (fast) $("fast-tip").href = fastLink();
  $("install-tip").hidden = fast || standalone || !!store.get("bdd:tipdone") || !/iPhone|iPad/.test(navigator.userAgent);
}
$("tip-close").addEventListener("click", () => { store.set("bdd:tipdone", 1); $("install-tip").hidden = true; });
const icMini = $("ic-mini");

// ================= FIVE =================
function evaluate(guess, answer) {
  const res = Array(5).fill("x"), left = {};
  for (let i = 0; i < 5; i++) { if (guess[i] === answer[i]) res[i] = "g"; else left[answer[i]] = (left[answer[i]] || 0) + 1; }
  for (let i = 0; i < 5; i++) { if (res[i] !== "g" && left[guess[i]]) { res[i] = "y"; left[guess[i]]--; } }
  return res;
}
let current = "", revealing = false;
const fiveDoneByGuesses = () => S.five.guesses.includes(ANSWER) || S.five.guesses.length >= 6;
const fiveDone = () => !!S.five.locked || S.five.guesses.includes(ANSWER) || S.five.guesses.length >= 6;
const fiveWon = () => S.five.locked ? !!S.five.locked.w : S.five.guesses.includes(ANSWER);
const fiveN = () => S.five.locked ? S.five.locked.n : S.five.guesses.length;
const fiveRows = () => S.five.locked ? S.five.locked.rows : S.five.guesses.map(g => evaluate(g, ANSWER).join(""));
function renderBoard(flipLast = false) {
  const boardEl = $("board"); boardEl.innerHTML = "";
  for (let r = 0; r < 6; r++) {
    const row = el("div", "row"); const g = S.five.guesses[r]; const ev = g ? evaluate(g, ANSWER) : null;
    const lockedRow = S.five.locked ? S.five.locked.rows[r] : null;
    for (let c = 0; c < 5; c++) {
      const t = el("div", "tile");
      if (lockedRow && !(g && fiveDoneByGuesses())) { t.classList.add(lockedRow[c]); t.textContent = g ? g[c] : lockedRow[c] === "g" ? ANSWER[c] : ""; }
      else if (g) {
        t.textContent = g[c];
        if (flipLast && r === S.five.guesses.length - 1) {
          t.classList.add("filled", "flip"); t.style.animationDelay = (c * 0.25) + "s";
          setTimeout(() => { t.classList.remove("filled"); t.classList.add(ev[c]); }, c * 250 + 250);
        } else t.classList.add(ev[c]);
      } else if (r === S.five.guesses.length && !fiveDone()) { t.textContent = current[c] || ""; if (current[c]) t.classList.add("filled"); }
      row.appendChild(t);
    }
    boardEl.appendChild(row);
  }
  $("keyboard").hidden = fiveDone(); $("five-done").hidden = !fiveDone();
  if (fiveDone()) $("five-done-text").textContent = fiveWon() ? `Solved in ${fiveN()}/6` : `The word was ${ANSWER}`;
}
const BKSP = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M21 5H9l-6 7 6 7h12z"/><path d="M12.5 9.5l5 5M17.5 9.5l-5 5" stroke-linecap="round"/></svg>';
function buildKeyboard(target, withEnter) {
  target.innerHTML = "";
  ["qwertyuiop", "asdfghjkl", (withEnter ? "+" : "") + "zxcvbnm-"].forEach((r, ri) => {
    const row = el("div", "krow");
    if (ri === 1) row.appendChild(el("div", "spacer"));
    for (const ch of r) {
      const b = el("button", "key");
      if (ch === "+") { b.textContent = "Enter"; b.classList.add("wide"); b.dataset.k = "Enter"; }
      else if (ch === "-") { b.innerHTML = BKSP; b.classList.add("wide"); b.dataset.k = "Backspace"; b.setAttribute("aria-label", "Delete"); }
      else { b.textContent = ch; b.dataset.k = ch; }
      row.appendChild(b);
    }
    if (ri === 1) row.appendChild(el("div", "spacer"));
    target.appendChild(row);
  });
}
function colorKeyboard() {
  const best = {}; const rank = { x: 1, y: 2, g: 3 };
  S.five.guesses.forEach(g => evaluate(g, ANSWER).forEach((e, i) => { const L = g[i]; if (!best[L] || rank[e] > rank[best[L]]) best[L] = e; }));
  $("keyboard").querySelectorAll(".key").forEach(k => { const L = (k.dataset.k || "").toUpperCase(); k.classList.remove("g", "y", "x"); if (L.length === 1 && best[L]) k.classList.add(best[L]); });
}
$("keyboard").addEventListener("click", e => { const b = e.target.closest(".key"); if (b) press(b.dataset.k); });
function shakeRow() { const row = $("board").children[S.five.guesses.length]; if (row) { row.classList.remove("shake"); void row.offsetWidth; row.classList.add("shake"); } }
// Win/loss shout-outs. Picked per day so the toast and the results card say the same thing.
const HYPE = {
  five: [
    ["Hacker. Absolutely hacker.", "Built different", "Goated", "Absolute cinema", "Psychic dawg"],
    ["Big Dawg energy", "Ate that", "Main character", "No crumbs left", "Cold blooded"],
    ["Let him cook", "Bussin'", "Clean as a whistle", "Big brain move", "Smooth operator"],
    ["W secured", "Solid dub", "We take those", "Respectable", "Vibes immaculate"],
    ["Sweaty, but a W", "Chaotic good", "Still counts", "Took the scenic route", "Ugly win is a win"],
    ["CLUTCH", "Heart attack", "By a whisker", "Phew. Barely.", "Sweat level: max"]
  ],
  lose: ["Cooked", "Down bad", "It's giving L", "Bad dog", "Ruff day"],
  perfect: ["Flawless. Big Dawg.", "Zero misses. Goated.", "Built different", "Not a single crumb"],
  win: ["W secured", "Let him cook", "Dub", "Big Dawg move", "Handled it"],
  fast: ["Speed demon", "Zoomies", "Light work", "Too easy", "Fast and furious"]
};
const hype = (list, salt) => list[Math.floor(rng(DAY * 97 + salt)() * list.length)];
const PRAISE = HYPE.five.map((l, i) => hype(l, i + 1));
function press(k) {
  if (fiveDone() || revealing) return;
  if (k === "Backspace") { current = current.slice(0, -1); renderBoard(); return; }
  if (k === "Enter") {
    if (current.length < 5) { toast("Not enough letters"); shakeRow(); return; }
    if (!VALID.has(current.toLowerCase())) { toast("Not in word list"); shakeRow(); return; }
    S.five.guesses.push(current); current = ""; if (S.five.guesses.includes(ANSWER) || S.five.guesses.length >= 6) S.five.fin = true; save();
    revealing = true;
    renderBoard(true);
    $("keyboard").hidden = false; $("five-done").hidden = true;
    setTimeout(() => {
      revealing = false; colorKeyboard();
      if (fiveDone()) {
        const won = fiveWon();
        if (won) { const row = $("board").children[S.five.guesses.length - 1]; row.classList.add("dance"); celebrate(); } else chime("lose");
        toast(won ? PRAISE[S.five.guesses.length - 1] : `${hype(HYPE.lose, 7)}. It was ${ANSWER}`, 2000);
        pushResult();
        setTimeout(() => { renderBoard(); openResults("five"); }, 1900);
      }
    }, 1500);
    return;
  }
  if (current.length < 5 && /^[a-zA-Z]$/.test(k)) { current += k.toUpperCase(); renderBoard(); }
}
function fiveSummary() { return { w: fiveWon(), n: fiveN(), rows: fiveRows() }; }

// ================= GROUPS =================
const sel = new Set();
const groupsLost = () => S.groups.mistakes >= 4;
const groupsWon = () => S.groups.solved.length === 4;
const groupsDone = () => groupsWon() || groupsLost();
function renderGroups(bump = false) {
  const grid = $("ggrid"); grid.innerHTML = "";
  const addBar = lvl => { const d = el("div", `solved l${lvl}`); d.append(el("b", null, PUZ[lvl][0]), el("span", null, PUZ[lvl][1].join(", "))); grid.appendChild(d); };
  S.groups.solved.forEach(addBar);
  if (groupsLost()) [0, 1, 2, 3].filter(l => !S.groups.solved.includes(l)).forEach(addBar);
  else S.groups.order.filter(w => !S.groups.solved.includes(LEVEL[w])).forEach(w => {
    const b = el("button", "gtile" + (w.length > 7 ? " long" : ""), w);
    b.setAttribute("aria-pressed", sel.has(w) ? "true" : "false");
    if (bump && sel.has(w)) b.classList.add("bump");
    b.addEventListener("click", () => {
      if (groupsDone()) return;
      if (sel.has(w)) sel.delete(w); else if (sel.size < 4) sel.add(w); else return;
      b.setAttribute("aria-pressed", sel.has(w) ? "true" : "false"); syncGroupButtons();
    });
    grid.appendChild(b);
  });
  const dots = $("dots"); dots.innerHTML = "";
  for (let i = 0; i < 4; i++) { const d = el("i"); if (i >= 4 - S.groups.mistakes) d.className = "used"; dots.appendChild(d); }
  $("mistakes-wrap").hidden = groupsDone(); $("gactions").hidden = groupsDone(); $("groups-done").hidden = !groupsDone();
  if (groupsDone()) $("groups-done-text").textContent = groupsWon() ? (S.groups.mistakes ? `Solved · ${S.groups.mistakes} mistake${S.groups.mistakes > 1 ? "s" : ""}` : "Perfect sort!") : "Out of mistakes";
  syncGroupButtons();
}
function syncGroupButtons() { $("g-submit").disabled = sel.size !== 4; $("g-clear").disabled = sel.size === 0; }
$("g-shuffle").addEventListener("click", () => {
  const rest = S.groups.order.filter(w => !S.groups.solved.includes(LEVEL[w]));
  const done = S.groups.order.filter(w => S.groups.solved.includes(LEVEL[w]));
  S.groups.order = done.concat(shuffle(rest)); save(); renderGroups();
});
$("g-clear").addEventListener("click", () => { sel.clear(); renderGroups(); });
$("g-submit").addEventListener("click", () => {
  if (sel.size !== 4 || groupsDone()) return;
  const pick = [...sel];
  const sig = pick.slice().sort().join("|");
  if (S.groups.tried.includes(sig)) { toast("Already guessed!"); return; }
  S.groups.tried.push(sig);
  const lvls = pick.map(w => LEVEL[w]);
  S.groups.history.push(lvls.join(""));
  if (lvls.every(l => l === lvls[0])) {
    const lvl = lvls[0];
    S.groups.order = S.groups.order.filter(w => LEVEL[w] !== lvl);
    S.groups.order = PUZ[lvl][1].concat(S.groups.order);
    S.groups.solved.push(lvl); sel.clear(); save(); renderGroups();
    if (groupsWon()) celebrate(); else chime("pop");
    if (groupsDone()) { pushResult(); setTimeout(() => openResults("groups"), 1100); }
  } else {
    S.groups.mistakes++;
    const counts = {}; lvls.forEach(l => counts[l] = (counts[l] || 0) + 1);
    const oneAway = Object.values(counts).includes(3);
    save();
    if (groupsLost()) { sel.clear(); renderGroups(); toast(hype(HYPE.lose, 13)); chime("lose"); pushResult(); setTimeout(() => openResults("groups"), 1500); }
    else { renderGroups(true); if (oneAway) toast("One away..."); }
  }
});
function groupsSummary() { return { w: groupsWon(), m: S.groups.mistakes, rows: S.groups.history.slice() }; }

// ================= MINI =================
const BLACK = { A: [0, 24], B: [4, 20], C: [0, 4, 20, 24] }[CW.p];
const isBlack = i => BLACK.includes(i);
const SOL = Array(25).fill(null);
const acrossCells = [], downCells = [];
for (let r = 0; r < 5; r++) { const c = []; for (let k = 0; k < 5; k++) { const i = r * 5 + k; if (!isBlack(i)) c.push(i); } acrossCells.push(c); }
for (let k = 0; k < 5; k++) { const c = []; for (let r = 0; r < 5; r++) { const i = r * 5 + k; if (!isBlack(i)) c.push(i); } downCells.push(c); }
acrossCells.forEach((cells, k) => cells.forEach((i, j) => SOL[i] = CW.a[k][j].toUpperCase()));
const NUMS = {}; { let n = 1; for (let i = 0; i < 25; i++) { if (isBlack(i)) continue; if (acrossCells.some(a => a[0] === i) || downCells.some(d => d[0] === i)) NUMS[i] = n++; } }
const ENTRIES = [
  ...acrossCells.map((cells, k) => ({ dir: "A", cells, num: NUMS[cells[0]], clue: CW.ca[k] })).sort((a, b) => a.num - b.num),
  ...downCells.map((cells, k) => ({ dir: "D", cells, num: NUMS[cells[0]], clue: CW.cd[k] })).sort((a, b) => a.num - b.num)
];
let cur = ENTRIES[0].cells[0], dir = "A", warnedSig = "";
const entryFor = (i, d) => ENTRIES.find(e => e.dir === d && e.cells.includes(i));
const fmtTime = s => { s = Math.floor(s); return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0"); };
for (let i = 0; i < 9; i++) { const g = el("i"); if ([0, 8].includes(i)) g.className = "b"; icMini.appendChild(g); }
const cellEls = [];
(function buildGrid() {
  const cw = $("cw");
  for (let i = 0; i < 25; i++) {
    const b = el("button", "cell" + (isBlack(i) ? " block" : ""));
    if (isBlack(i)) { b.disabled = true; b.setAttribute("aria-hidden", "true"); b.tabIndex = -1; }
    else {
      if (NUMS[i]) b.appendChild(el("span", "n", NUMS[i]));
      b.appendChild(el("span", "L"));
      b.addEventListener("click", () => tapCell(i));
    }
    cellEls.push(b); cw.appendChild(b);
  }
  const ghost = $("mini-ghost");
  for (let i = 0; i < 25; i++) { const g = el("i"); if (isBlack(i)) g.className = "b"; ghost.appendChild(g); }
})();
function paintCW() {
  const fill = S.mini.fill;
  const e = entryFor(cur, dir) || entryFor(cur, dir === "A" ? "D" : "A");
  if (e) dir = e.dir;
  for (let i = 0; i < 25; i++) {
    if (isBlack(i)) continue;
    const b = cellEls[i];
    b.querySelector(".L").textContent = fill[i] || "";
    b.classList.toggle("inword", !S.mini.done && e.cells.includes(i));
    b.classList.toggle("cur", !S.mini.done && i === cur);
    b.classList.toggle("wrong", S.mini.wrong.includes(i));
    const ent = ENTRIES.filter(x => x.cells.includes(i)).map(x => x.num + (x.dir === "A" ? " Across" : " Down")).join(", ");
    b.setAttribute("aria-label", `${ent}${fill[i] ? ", letter " + fill[i] : ", empty"}`);
  }
  const ct = $("clue-text"); ct.innerHTML = "";
  ct.append(el("b", null, e.num + (e.dir === "A" ? "A" : "D")), document.createTextNode(e.clue));
}
function tapCell(i) {
  if (S.mini.done) return;
  if (i === cur) { const other = dir === "A" ? "D" : "A"; if (entryFor(i, other)) dir = other; }
  else { cur = i; if (!entryFor(i, dir)) dir = dir === "A" ? "D" : "A"; }
  paintCW();
}
function moveEntry(step) {
  const fill = S.mini.fill;
  const e = entryFor(cur, dir); let k = ENTRIES.indexOf(e);
  for (let n = 0; n < ENTRIES.length; n++) {
    k = mod(k + step, ENTRIES.length);
    const x = ENTRIES[k], empty = x.cells.find(i => !fill[i]);
    if (empty !== undefined || ENTRIES.every(y => y.cells.every(i => fill[i]))) { dir = x.dir; cur = empty !== undefined ? empty : x.cells[0]; return; }
  }
}
function typeLetter(L) {
  if (S.mini.done || !S.mini.started) return;
  const fill = S.mini.fill;
  fill[cur] = L; S.mini.wrong = S.mini.wrong.filter(i => i !== cur);
  const e = entryFor(cur, dir), pos = e.cells.indexOf(cur);
  const after = e.cells.slice(pos + 1).find(i => !fill[i]);
  if (after !== undefined) cur = after;
  else { const anyEmpty = e.cells.find(i => !fill[i]); if (anyEmpty !== undefined) cur = anyEmpty; else moveEntry(1); }
  save(); paintCW(); checkMini();
}
function backspace() {
  if (S.mini.done || !S.mini.started) return;
  const fill = S.mini.fill;
  if (fill[cur]) fill[cur] = "";
  else { const e = entryFor(cur, dir), pos = e.cells.indexOf(cur); if (pos > 0) { cur = e.cells[pos - 1]; fill[cur] = ""; } }
  S.mini.wrong = S.mini.wrong.filter(i => i !== cur);
  save(); paintCW();
}
function arrow(dr, dc) {
  const want = dr === 0 ? "A" : "D";
  if (dir !== want && entryFor(cur, want)) { dir = want; paintCW(); return; }
  let r = Math.floor(cur / 5), c = cur % 5;
  for (;;) { r += dr; c += dc; if (r < 0 || r > 4 || c < 0 || c > 4) return; const i = r * 5 + c; if (!isBlack(i)) { cur = i; paintCW(); return; } }
}
function checkMini() {
  const fill = S.mini.fill;
  const open = [...Array(25).keys()].filter(i => !isBlack(i));
  if (!open.every(i => fill[i])) return;
  if (open.every(i => fill[i] === SOL[i])) { solveMini(); return; }
  const sig = fill.join("");
  if (sig !== warnedSig) { warnedSig = sig; toast("Not quite. Keep trying!", 1800); }
}
$("mini-check").addEventListener("click", () => {
  if (S.mini.done) return;
  const fill = S.mini.fill;
  S.mini.checked = true;
  S.mini.wrong = [...Array(25).keys()].filter(i => !isBlack(i) && fill[i] && fill[i] !== SOL[i]);
  save(); paintCW();
  toast(S.mini.wrong.length ? `${S.mini.wrong.length} square${S.mini.wrong.length === 1 ? " is" : "s are"} wrong` : "Everything so far is right");
});
$("clue-prev").addEventListener("click", () => { moveEntry(-1); paintCW(); });
$("clue-next").addEventListener("click", () => { moveEntry(1); paintCW(); });
$("clue-text").addEventListener("click", openClueList);
$("mini-list").addEventListener("click", openClueList);
function openClueList() {
  const e = entryFor(cur, dir);
  const wrap = el("div", "cluelist");
  [["A", "Across"], ["D", "Down"]].forEach(([d, label]) => {
    wrap.appendChild(el("h3", null, label));
    ENTRIES.filter(x => x.dir === d).forEach(x => {
      const b = el("button", x === e ? "on" : ""); b.append(el("b", null, x.num), el("span", null, x.clue));
      b.addEventListener("click", () => { dir = x.dir; cur = x.cells.find(i => !S.mini.fill[i]); if (cur === undefined) cur = x.cells[0]; closeModal(); paintCW(); });
      wrap.appendChild(b);
    });
  });
  openModal([el("h2", null, "Clues"), wrap]);
}
const miniKb = $("mini-kb");
miniKb.addEventListener("click", e => { const b = e.target.closest(".key"); if (!b) return; if (b.dataset.k === "Backspace") backspace(); else typeLetter(b.dataset.k.toUpperCase()); });

const TM = { mini: { start: null, base: 0 }, strands: { start: null, base: 0 } };
let timerId = null, lastSave = 0;
function elapsed(g) { const x = TM[g]; return x.start === null ? S[g].el : x.base + (performance.now() - x.start) / 1000; }
function drawTimers() { $("mini-timer").textContent = fmtTime(elapsed("mini")); $("st-timer").textContent = fmtTime(elapsed("strands")); }
function syncTimer() {
  if (!S) return;
  let anyRun = false;
  ["mini", "strands"].forEach(g => {
    const run = S[g].started && !S[g].done && active === g && $("modal").hidden && document.visibilityState === "visible";
    const x = TM[g];
    if (run) { anyRun = true; if (x.start === null) { x.start = performance.now(); x.base = S[g].el; } }
    else if (x.start !== null) { S[g].el = elapsed(g); x.start = null; save(); }
  });
  if (anyRun && !timerId) timerId = setInterval(() => {
    drawTimers();
    if (performance.now() - lastSave > 3000) {
      lastSave = performance.now();
      ["mini", "strands"].forEach(g => { const x = TM[g]; if (x.start !== null) { S[g].el = elapsed(g); x.base = S[g].el; x.start = performance.now(); } });
      store.set(skey(), S);
    }
  }, 250);
  if (!anyRun && timerId) { clearInterval(timerId); timerId = null; }
  drawTimers();
}
document.addEventListener("visibilitychange", syncTimer);
function miniShown() {
  const started = S.mini.started;
  $("mini-start").hidden = started;
  $("cw").hidden = !started;
  $("minibar").hidden = !started;
  $("cluebar").hidden = !started || S.mini.done;
  miniKb.hidden = !started || S.mini.done;
  $("mini-done").hidden = !S.mini.done;
  $("mini-check").hidden = S.mini.done;
  if (S.mini.done) $("mini-done-text").textContent = `Solved in ${fmtTime(S.mini.el)}`;
  $("cw").classList.toggle("won", S.mini.done);
  paintCW();
}
$("mini-go").addEventListener("click", () => { S.mini.started = true; save(); miniShown(); syncTimer(); });
function miniSummary() { return { t: Math.max(1, Math.floor(S.mini.el)), k: !!S.mini.checked }; }
function solveMini() {
  S.mini.el = elapsed("mini"); TM.mini.start = null; S.mini.done = true; S.mini.wrong = []; save();
  syncTimer(); miniShown(); toast(`${S.mini.el < 60 ? hype(HYPE.fast, 31) : hype(HYPE.win, 32)} · ${fmtTime(S.mini.el)}`, 1800); celebrate();
  pushResult();
  setTimeout(() => openResults("mini"), 1300);
}

// ================= STRANDS =================
const STW = SP.w; // [word, cells]; index 0 is the spangram
let stPath = [], stDrag = null;
const stGrid = $("stgrid");
const stCells = [];
for (let i = 0; i < 48; i++) { const d = el("div", "sl"); d.appendChild(el("span", null, SP.g[i])); stGrid.appendChild(d); stCells.push(d); }
$("st-theme").textContent = SP.t;
const stAdj = (a, b) => a !== b && Math.abs(Math.floor(a / 6) - Math.floor(b / 6)) <= 1 && Math.abs(a % 6 - b % 6) <= 1;
// Where each word currently sits. Usually the puzzle's own layout; if you find a word along a different
// valid path, the rest of the board is re-solved around it (S.strands.sol) so no letters get stranded.
const cellsOf = k => (S.strands.sol && S.strands.sol[k]) || STW[k][1];
function stOwner(i) { for (const k of S.strands.found) if (cellsOf(k).includes(i)) return k; return -1; }
function stHinted(i) { return S.strands.hints.some(k => !S.strands.found.includes(k) && cellsOf(k).includes(i)); }
// Paths may not cross: a diagonal step can't share a 2x2 square with the opposite diagonal.
const stEdge = (a, b) => a < b ? a + "-" + b : b + "-" + a;
function stCross(a, b) { const r1 = Math.floor(a / 6), c1 = a % 6, r2 = Math.floor(b / 6), c2 = b % 6; return r1 !== r2 && c1 !== c2 ? stEdge(r1 * 6 + c2, r2 * 6 + c1) : null; }
function stDiags(cells, set) { for (let i = 1; i < cells.length; i++) if (stCross(cells[i - 1], cells[i])) set.add(stEdge(cells[i - 1], cells[i])); return set; }
function stCrosses(cells, diags) { for (let i = 1; i < cells.length; i++) { const o = stCross(cells[i - 1], cells[i]); if (o && diags.has(o)) return true; } return false; }
const stSpans = cells => { const rs = cells.map(i => Math.floor(i / 6)), cs = cells.map(i => i % 6); return (rs.includes(0) && rs.includes(7)) || (cs.includes(0) && cs.includes(5)); };
// Fit the remaining words into the free cells (exact cover, no crossings). Returns {word: cells} or null.
function stSolve(free, ks, diags) {
  const cands = {};
  for (const k of ks) {
    const w = STW[k][0], out = [];
    const dfs = (path, own) => {
      if (out.length > 300) return;
      if (path.length === w.length) { if (k !== 0 || stSpans(path)) out.push(path.slice()); return; }
      const last = path[path.length - 1];
      const next = path.length ? [-7, -6, -5, -1, 1, 5, 6, 7].map(d => last + d).filter(y => y >= 0 && y < 48 && stAdj(last, y)) : [...free];
      for (const y of next) {
        if (!free.has(y) || path.includes(y) || SP.g[y] !== w[path.length]) continue;
        const o = path.length ? stCross(last, y) : null;
        if (o && (diags.has(o) || own.has(o))) continue;
        const e = path.length && o ? stEdge(last, y) : null;
        path.push(y); if (e) own.add(e); dfs(path, own); path.pop(); if (e) own.delete(e);
      }
    };
    dfs([], new Set());
    if (!out.length) return null;
    cands[k] = out;
  }
  const res = {}; let steps = 0;
  const go = (left, freeNow, dg) => {
    if (++steps > 20000) return false;
    if (!left.length) return freeNow.size === 0;
    let best = null;
    for (const c of freeNow) {
      const opts = [];
      for (const k of left) for (const pth of cands[k]) if (pth.includes(c) && pth.every(y => freeNow.has(y)) && !stCrosses(pth, dg)) opts.push([k, pth]);
      if (!opts.length) return false;
      if (!best || opts.length < best.length) best = opts;
      if (best.length === 1) break;
    }
    for (const [k, pth] of best) {
      const nf = new Set(freeNow); pth.forEach(y => nf.delete(y));
      res[k] = pth;
      if (go(left.filter(x => x !== k), nf, stDiags(pth, new Set(dg)))) return true;
      delete res[k];
    }
    return false;
  };
  return go(ks.slice(), new Set(free), diags) ? res : null;
}
function stLine(cells, color) {
  const pts = cells.map(i => `${(i % 6) + 0.5},${Math.floor(i / 6) + 0.5}`).join(" ");
  return `<polyline points="${pts}" fill="none" stroke="${color}" stroke-width="0.3" stroke-linecap="round" stroke-linejoin="round"/>`;
}
function renderStrands(msg) {
  for (let i = 0; i < 48; i++) {
    const o = stOwner(i), c = stCells[i];
    c.classList.toggle("found", o > 0); c.classList.toggle("span", o === 0);
    c.classList.toggle("sel", stPath.includes(i)); c.classList.toggle("hint", o < 0 && stHinted(i));
  }
  let svg = "";
  S.strands.found.forEach(k => svg += stLine(cellsOf(k), k === 0 ? "var(--st-span)" : "var(--st-word)"));
  if (stPath.length > 1) svg += stLine(stPath, "var(--st-sel)");
  $("st-lines").innerHTML = svg;
  const w = $("st-word");
  if (msg) { w.textContent = msg; w.classList.add("miss"); }
  else { w.textContent = stPath.map(i => SP.g[i]).join(""); w.classList.remove("miss"); }
  const theme = S.strands.found.filter(k => k > 0).length;
  $("st-count").textContent = `${theme} of ${STW.length - 1} words` + (S.strands.found.includes(0) ? " + spangram" : "");
  const left = STW.some((x, k) => !S.strands.found.includes(k) && !S.strands.hints.includes(k));
  const earned = stEarned(), hb = $("st-hint");
  hb.disabled = !left || S.strands.done || earned < 1;
  hb.textContent = S.strands.done || !left ? "Hint" : earned > 0 ? `💡 Hint${earned > 1 ? " ×" + earned : ""}` : `Hint ${(S.strands.bonus || []).length % 3}/3`;
  hb.classList.toggle("ready", earned > 0 && !S.strands.done);
  $("st-enter").disabled = stPath.length < 2; $("st-clear").disabled = !stPath.length;
}
let stMsgT = null;
function stFlash(msg) { clearTimeout(stMsgT); renderStrands(msg); stMsgT = setTimeout(() => renderStrands(), 1100); }
function stSubmit() {
  if (S.strands.done || !stPath.length) return;
  const word = stPath.map(i => SP.g[i]).join("");
  const path = stPath; stPath = [];
  if (word.length < 4) { stFlash("Too short"); return; }
  // A theme word counts where the puzzle put it, or along any other path that still lets every
  // remaining word fit the board without crossings. Then the board is re-solved around your path.
  const same = (a, b) => a.length === b.length && a.every(x => b.includes(x));
  const open = STW.map((x, i) => i).filter(i => !S.strands.found.includes(i) && STW[i][0] === word);
  let k = open.find(i => same(cellsOf(i), path));
  if (k === undefined && open.length) {
    const diags = new Set(); S.strands.found.forEach(f => stDiags(cellsOf(f), diags));
    if (!stCrosses(path, diags) && !stCrosses(path, stDiags(path, new Set()))) {
      const used = new Set(path); S.strands.found.forEach(f => cellsOf(f).forEach(y => used.add(y)));
      const free = new Set([...Array(48).keys()].filter(y => !used.has(y)));
      for (const cand of open) {
        if (cand === 0 && !stSpans(path)) continue;
        const rest = STW.map((x, i) => i).filter(i => i !== cand && !S.strands.found.includes(i));
        const fit = stSolve(free, rest, stDiags(path, new Set(diags)));
        if (fit) {
          const sol = STW.map((x, i) => cellsOf(i).slice());
          sol[cand] = path.slice(); Object.keys(fit).forEach(i => sol[i] = fit[i]);
          S.strands.sol = sol; k = cand; break;
        }
      }
    }
    if (k === undefined) { stFlash("Right word, wrong spot"); return; }
  }
  if (k !== undefined) {
    S.strands.found.push(k); save();
    stFlash(k === 0 ? "SPANGRAM!" : word); if (S.strands.found.length < STW.length) chime("pop");
    if (S.strands.found.length === STW.length) solveStrands();
    return;
  }
  if (STW.some((x, i) => S.strands.found.includes(i) && x[0] === word)) stFlash("Already found");
  else {
    const B = stBonus(), bl = S.strands.bonus || (S.strands.bonus = []);
    if (bl.includes(word)) stFlash("Already counted");
    else if (B && B.has(word)) { bl.push(word); save(); stFlash(bl.length % 3 === 0 ? "Hint earned! 💡" : `Nice word! ${bl.length % 3}/3 to a hint`); }
    else stFlash("Not a theme word");
  }
}
function stTap(i) {
  if (stOwner(i) >= 0) return;
  const last = stPath[stPath.length - 1];
  if (!stPath.length) stPath = [i];
  else if (i === last) { stSubmit(); return; }
  else if (stPath.includes(i)) stPath = stPath.slice(0, stPath.indexOf(i) + 1);
  else if (stAdj(last, i)) stPath.push(i);
  else stPath = [i];
  renderStrands();
}
function stCellAt(e) {
  const r = stGrid.getBoundingClientRect();
  const cw = r.width / 6, ch = r.height / 8;
  const c = Math.floor((e.clientX - r.left) / cw), rr = Math.floor((e.clientY - r.top) / ch);
  if (c < 0 || c > 5 || rr < 0 || rr > 7) return null;
  const dx = e.clientX - (r.left + (c + 0.5) * cw), dy = e.clientY - (r.top + (rr + 0.5) * ch);
  if (Math.hypot(dx, dy) > Math.min(cw, ch) * 0.42) return null;
  return rr * 6 + c;
}
stGrid.addEventListener("pointerdown", e => {
  if (S.strands.done || !S.strands.started) return;
  const i = stCellAt(e); if (i === null) return;
  e.preventDefault();
  try { stGrid.setPointerCapture(e.pointerId); } catch (x) {}
  stDrag = { start: i, moved: false };
});
stGrid.addEventListener("pointermove", e => {
  if (!stDrag) return;
  const i = stCellAt(e); if (i === null) return;
  if (!stDrag.moved) {
    if (i === stDrag.start) return;
    if (stOwner(stDrag.start) >= 0) return;
    stDrag.moved = true; stPath = [stDrag.start];
  }
  const last = stPath[stPath.length - 1];
  if (i === last || stOwner(i) >= 0) return;
  if (stPath.length > 1 && i === stPath[stPath.length - 2]) stPath.pop();
  else if (!stPath.includes(i) && stAdj(last, i)) stPath.push(i);
  else return;
  renderStrands();
});
const stEnd = () => { if (!stDrag) return; const d = stDrag; stDrag = null; if (d.moved) { if (stPath.length > 1) stSubmit(); else renderStrands(); } else stTap(d.start); };
stGrid.addEventListener("pointerup", stEnd);
stGrid.addEventListener("pointercancel", () => { stDrag = null; });
$("st-clear").addEventListener("click", () => { stPath = []; renderStrands(); });
$("st-enter").addEventListener("click", stSubmit);
$("st-hint").addEventListener("click", () => {
  if (S.strands.done) return;
  const order = STW.map((x, k) => k).filter(k => k > 0).concat([0]);
  const k = order.find(k => !S.strands.found.includes(k) && !S.strands.hints.includes(k));
  if (k === undefined || stEarned() < 1) return;
  S.strands.hints.push(k); save(); renderStrands();
  toast(k === 0 ? "Hint: the spangram is outlined" : "Hint: a theme word is outlined");
});
function strandsShown() {
  const started = S.strands.started;
  $("st-start").hidden = started; $("st-wrap").hidden = !started; $("st-bar").hidden = !started;
  $("st-actions").hidden = !started || S.strands.done; $("strands-done").hidden = !S.strands.done;
  if (S.strands.done) $("strands-done-text").textContent = `Solved in ${fmtTime(S.strands.el)}` + (S.strands.hints.length ? ` · ${S.strands.hints.length} hint${S.strands.hints.length > 1 ? "s" : ""}` : "");
  renderStrands();
}
$("st-go").addEventListener("click", () => { S.strands.started = true; save(); strandsShown(); syncTimer(); });
function strandsSummary() { return { t: Math.max(1, Math.floor(S.strands.el)), h: S.strands.hints.length }; }
function solveStrands() {
  S.strands.el = elapsed("strands"); TM.strands.start = null; S.strands.done = true; save();
  syncTimer(); strandsShown(); celebrate();
  pushResult();
  setTimeout(() => openResults("strands"), 1300);
}
document.addEventListener("keydown", e => {
  if (active !== "strands" || !$("modal").hidden || S.strands.done) return;
  if (e.key === "Enter") { e.preventDefault(); stSubmit(); }
  else if (e.key === "Escape" || e.key === "Backspace") { e.preventDefault(); stPath = []; renderStrands(); }
});

// ---------- keyboard input ----------
document.addEventListener("keydown", e => {
  if (e.metaKey || e.ctrlKey || e.altKey) return;
  if (e.target.closest && e.target.closest("input, textarea")) return;
  if (!$("modal").hidden) { if (e.key === "Escape") closeModal(); return; }
  const k = e.key;
  if (active === "five") { if (k === "Enter" || k === "Backspace" || /^[a-zA-Z]$/.test(k)) { e.preventDefault(); press(k); } return; }
  if (active === "mini" && S.mini.started && !S.mini.done) {
    if (/^[a-zA-Z]$/.test(k)) { e.preventDefault(); typeLetter(k.toUpperCase()); }
    else if (k === "Backspace" || k === "Delete") { e.preventDefault(); backspace(); }
    else if (k === "ArrowLeft") { e.preventDefault(); arrow(0, -1); }
    else if (k === "ArrowRight") { e.preventDefault(); arrow(0, 1); }
    else if (k === "ArrowUp") { e.preventDefault(); arrow(-1, 0); }
    else if (k === "ArrowDown") { e.preventDefault(); arrow(1, 0); }
    else if (k === "Tab" || k === "Enter") { e.preventDefault(); moveEntry(e.shiftKey ? -1 : 1); paintCW(); }
    else if (k === " ") { e.preventDefault(); tapCell(cur); }
  }
});

// ================= RESULTS, HELP, SHARING =================
const GAME_NAMES = { five: "Five", groups: "Groups", strands: "Strands", mini: "the Mini" };
function nextGame() { if (!fiveDone()) return "five"; if (!groupsDone()) return "groups"; if (!S.strands.done) return "strands"; if (!S.mini.done) return "mini"; return "scores"; }
function squares(rows, kind) {
  const s = el("span", "sq");
  s.style.gridTemplateColumns = `repeat(${kind === "g" ? 4 : 5}, auto)`;
  rows.forEach(r => [...r].forEach(c => s.appendChild(el("i", kind === "g" ? "l" + c : c))));
  return s;
}
function openResults(game) {
  const nodes = [];
  if (game === "five") {
    nodes.push(el("h2", null, fiveWon() ? PRAISE[fiveN() - 1] : hype(HYPE.lose, 7)));
    const p = el("p", "sub"); p.append(document.createTextNode(fiveWon() ? `You got it in ${fiveN()} of 6. The word was ` : "Out of guesses. The word was "), el("span", "answer", ANSWER), document.createTextNode("."));
    nodes.push(p);
    const pv = el("div", "preview"); pv.appendChild(squares(fiveSummary().rows, "f")); nodes.push(pv);
  } else if (game === "groups") {
    nodes.push(el("h2", null, groupsWon() ? (S.groups.mistakes ? hype(HYPE.win, 11) : hype(HYPE.perfect, 12)) : hype(HYPE.lose, 13)));
    nodes.push(el("p", "sub", groupsWon() ? `All four groups with ${S.groups.mistakes} mistake${S.groups.mistakes === 1 ? "" : "s"}.` : "You ran out of mistakes. The groups are shown on the board."));
    const pv = el("div", "preview"); pv.appendChild(squares(S.groups.history, "g")); nodes.push(pv);
  } else if (game === "strands") {
    const h = S.strands.hints.length;
    nodes.push(el("h2", null, h ? hype(HYPE.win, 21) : hype(HYPE.perfect, 22)));
    nodes.push(el("p", "sub", `Your time: ${fmtTime(S.strands.el)}${h ? ` with ${h} hint${h > 1 ? "s" : ""}` : ", no hints"}. The spangram was ${SP.w[0][0]}.`));
  } else {
    nodes.push(el("h2", null, S.mini.el < 60 ? hype(HYPE.fast, 31) : hype(HYPE.win, 32)));
    nodes.push(el("p", "sub", `Your time: ${fmtTime(S.mini.el)}${S.mini.checked ? " (with a check)" : ""}`));
  }
  const post = el("p", "postline"); nodes.push(post);
  const n = nextGame();
  const go = el("button", "pill solid", n === "scores" ? "See the scoreboard" : "Play " + GAME_NAMES[n]);
  go.addEventListener("click", () => { closeModal(); show(n); });
  const share = el("button", "pill", "Copy results");
  const ta = el("textarea", "copybox"); ta.rows = 6; ta.readOnly = true; ta.hidden = true;
  share.addEventListener("click", () => copy(shareText(), ta));
  nodes.push(go, share, ta);
  openModal(nodes);
  refreshPostLines();
}
function openHelp(game) {
  const nodes = [];
  if (game === "five") {
    nodes.push(el("h2", null, "How to play Five"));
    const ul = el("ul", "rules");
    ["Guess the hidden five-letter word in 6 tries.", "Each guess must be a real word. Tap Enter to submit.", "The colors show how close you were:"].forEach(t => ul.appendChild(el("li", null, t)));
    nodes.push(ul);
    const lg = el("div", "legend");
    [["g", "W", "In the word and in the right spot"], ["y", "I", "In the word, wrong spot"], ["x", "U", "Not in the word"]].forEach(([c, L, t]) => { const d = el("div"); const tile = el("div", "tile " + c, L); d.append(tile, el("span", null, t)); lg.appendChild(d); });
    nodes.push(lg);
  } else if (game === "groups") {
    nodes.push(el("h2", null, "How to play Groups"));
    const ul = el("ul", "rules");
    ["Find four groups of four words that share something.", "Tap four words, then Submit.", "Categories are tricky, so watch for words that seem to fit more than one group.", "Gold is the easiest group, then green, blue, and purple. You get 4 mistakes."].forEach(t => ul.appendChild(el("li", null, t)));
    nodes.push(ul);
  } else if (game === "strands") {
    nodes.push(el("h2", null, "How to play Strands"));
    const ul = el("ul", "rules");
    ["Find the theme words hidden in the grid. Every letter is used exactly once.", "Drag across letters, or tap them one at a time and tap the last letter again (or Enter) to submit. Letters connect in any direction, including diagonally.", "Theme words turn blue. The spangram, which describes the theme and stretches from one side of the grid to the other, turns yellow.", "Hints are earned: every 3 non-theme words you find (4+ letters, real words) unlocks one. A hint outlines a theme word. Your time and hint count go on the scoreboard."].forEach(t => ul.appendChild(el("li", null, t)));
    nodes.push(ul);
  } else if (game === "mini") {
    nodes.push(el("h2", null, "How to play the Mini"));
    const ul = el("ul", "rules");
    ["Fill the 5×5 grid using the Across and Down clues.", "Tap a square to pick it. Tap it again to switch between Across and Down.", "Tap the clue bar to see every clue.", "The clock pauses whenever you leave. Using Check marks your time with a *."].forEach(t => ul.appendChild(el("li", null, t)));
    nodes.push(ul);
  } else {
    nodes.push(el("h2", null, "Big Dawg Daily"));
    const ul = el("ul", "rules");
    ["Four new puzzles every day at midnight: Five, Groups, Strands, and the Mini.", "Everyone gets the same puzzles, and every finished game posts to the scoreboard automatically.", "Tap 🎯 next to a friend on the scoreboard to throw shade based on how they actually did. They can fire back, take the L, or clap back with an emoji.", "React to anyone's score with 😂 🔥 💀 👏 🤡, or tap + for the Big Dawg emote pack. Tap a name to see their trophies and your head-to-head record.", "Every game earns points for the weekly league. Yesterday's winner wears the 👑.", "Pick your name and PIN once. After that, open the app from the same link or home-screen icon and it remembers you. Your games save as you play, so you can leave and come back, or switch phones."].forEach(t => ul.appendChild(el("li", null, t)));
    nodes.push(ul);
  }
  openModal(nodes);
}
const EM = { g: "🟩", y: "🟨", x: "⬛" };
const GEM = ["🟨", "🟩", "🟦", "🟪"];
function shareText() {
  const lines = [`Big Dawg Daily No. ${NUM}`];
  if (fiveDone()) { lines.push("", `Five ${fiveWon() ? fiveN() : "X"}/6`); fiveRows().forEach(r => lines.push([...r].map(e => EM[e]).join(""))); }
  if (groupsDone()) { lines.push("", `Groups ${groupsWon() ? (S.groups.mistakes === 0 ? "perfect" : S.groups.mistakes + " mistake" + (S.groups.mistakes === 1 ? "" : "s")) : "X"}`); S.groups.history.forEach(r => lines.push([...r].map(l => GEM[+l]).join(""))); }
  if (S.strands.done) lines.push("", `Strands ${fmtTime(S.strands.el)}${S.strands.hints.length ? ` (${S.strands.hints.length} hint${S.strands.hints.length > 1 ? "s" : ""})` : ""}`);
  if (S.mini.done) lines.push("", `Mini ${fmtTime(S.mini.el)}${S.mini.checked ? "*" : ""}`);
  if (!fiveDone() && !groupsDone() && !S.mini.done && !S.strands.done) lines.push("", "Nothing finished yet today.");
  if (APP_URL) lines.push("", APP_URL);
  return lines.join("\n");
}
async function copy(text, ta, okMsg = "Copied") {
  try { await navigator.clipboard.writeText(text); toast(okMsg); if (ta) ta.hidden = true; }
  catch (e) { if (ta) { ta.value = text; ta.hidden = false; ta.focus(); ta.select(); } toast("Select the text and copy it", 2000); }
}


