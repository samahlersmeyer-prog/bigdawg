// ================= CREWS =================
function isMate(id) { return !!me && (id === me.id || crews.some(c => (c.ids || []).includes(id))); }
function crewName(c) { const x = crews.find(k => k.id === c); return x ? x.name : "Everyone"; }
function setCrews(list, cur) {
  crews = list || []; store.set("bdd:crews", crews);
  if (crewSel === "" || (crewSel !== "all" && !crews.some(c => c.id === crewSel))) { crewSel = cur && cur !== "all" && crews.some(c => c.id === cur) ? cur : crews[0] ? crews[0].id : "all"; store.set("bdd:crewSel", crewSel); }
  renderCrewBar();
}
function renderCrewBar() {
  const bar = $("crewbar"); if (!bar) return; bar.innerHTML = ""; bar.hidden = !me;
  const chip = (id, label) => { const b = el("button", crewSel === id ? "on" : "", label); b.addEventListener("click", () => switchCrew(id)); bar.appendChild(b); };
  crews.forEach(c => chip(c.id, c.name)); chip("all", "🌎 Everyone");
  const nreq = crews.reduce((a, c) => a + ((c.reqs || []).length), 0);
  const add = el("button", "add", nreq ? `🙋 ${nreq}` : crews.length ? "＋" : "＋ Join a crew"); add.setAttribute("aria-label", "Manage crews"); add.addEventListener("click", openCrews); bar.appendChild(add);
  if ($("invite-link") && APP_URL) $("invite-link").textContent = inviteUrl();
  const n = $("crew-note"); if (n) n.textContent = crews.length ? `You're in ${crews.map(c => c.name).join(", ")}. Each crew has its own scoreboard, weekly league and champ.` : "You're not in a crew yet. Start one or join with a code to get your own scoreboard, league and champ.";
}
function switchCrew(id) {
  if (id === crewSel) return; crewSel = id; store.set("bdd:crewSel", id);
  board = null; stats = null; statsAt = 0; allTime = null; arcade = null; PRIME = null;
  renderCrewBar(); if (active === "scores") renderScores();
  refreshBoard(); refreshStats(); refreshArcade(); if (document.querySelector('#sc-tabs [data-tab="week"].on')) loadAllTime();
}
function crewLink(c) { const base = APP_URL || (location.origin + location.pathname); return base + (base.includes("?") ? "&" : "?") + "crew=" + c.code; }
function crewCall(fn, ...args) {
  return API(fn, me.id, ...args).then(r => { setCrews(r.crews); if (r.crew) switchCrew(r.crew); return r; });
}
function openCrews() {
  if (!me) return;
  const nodes = [el("h2", null, "Crews"), el("p", "sub", "Invite-only groups. Each crew gets its own scoreboard, weekly league, crown and champ. Everyone still sees the same puzzles.")];
  crews.forEach(c => {
    const row = el("div", "crewrow");
    const hd = el("b", null, c.name + (crewSel === c.id ? "  ✓" : ""));
    const code = el("span", "crewcode", c.code);
    const sm = el("small"); sm.append(`${c.n} member${c.n === 1 ? "" : "s"}: ${c.members.join(", ")}. Code `, code);
    const btns = el("div", "inrow");
    const inv = el("button", "pill solid", "Copy invite link"); inv.addEventListener("click", () => copy(`Join my crew "${c.name}" on Big Dawg Daily: ${crewLink(c)}`, null, "Invite copied. Text it to your people."));
    const view = el("button", "pill", "Show scoreboard"); view.addEventListener("click", () => { closeModal(); switchCrew(c.id); show("scores"); });
    const leave = el("button", "pill", "Leave"); leave.addEventListener("click", () => { if (leave.dataset.sure) { crewCall("leaveCrew", c.id).then(() => { if (crewSel === c.id) switchCrew(crews[0] ? crews[0].id : "all"); openCrews(); }).catch(e => toast(errMsg(e), 2400)); } else { leave.dataset.sure = 1; leave.textContent = "Tap again to leave"; } });
    btns.append(inv, view, leave); row.append(hd, sm, btns);
    (c.reqs || []).forEach(q => { const rq = el("div", "crewreq"); rq.append(el("small", null, `🙋 ${q.name} wants in`), joinButtons(q.id, q.name, c.name)); row.appendChild(rq); });
    if (c.owner && c.people) {
      // Owner tools: remove people, rename, fresh code.
      const mg = el("details", "crewown"); mg.append(el("summary", null, "👑 You own this crew: manage members"));
      const list = el("div", "chips");
      c.people.filter(x => x.id !== me.id).forEach(x => {
        const ch = el("button", "chip", x.name + "  ✕");
        ch.addEventListener("click", () => {
          if (!ch.dataset.sure) { ch.dataset.sure = 1; ch.textContent = `Remove ${x.name}?`; ch.classList.add("warn"); return; }
          ch.disabled = true; API("removeFromCrew", me.id, c.id, x.id).then(r => { setCrews(r.crews); toast(`${x.name} is out of ${c.name}.`, 2000); ch.remove(); if (crewSel === c.id) switchCrew("all"), switchCrew(c.id); }).catch(e => { ch.disabled = false; toast(errMsg(e), 2400); });
        });
        list.appendChild(ch);
      });
      const tools = el("div", "inrow");
      const rn = el("button", "pill", "Rename"); rn.addEventListener("click", () => { const v = prompt("New crew name", c.name); if (v && v.trim()) API("renameCrew", me.id, c.id, v.trim()).then(r => { setCrews(r.crews); openCrews(); }).catch(e => toast(errMsg(e), 2400)); });
      const nc = el("button", "pill", "New code"); nc.addEventListener("click", () => { if (!nc.dataset.sure) { nc.dataset.sure = 1; nc.textContent = "Old links stop working. Tap again"; return; } API("newCrewCode", me.id, c.id).then(r => { setCrews(r.crews); toast("New code made. Old invite links no longer work.", 2400); openCrews(); }).catch(e => toast(errMsg(e), 2400)); });
      tools.append(rn, nc);
      const af = el("div", "crewform"), ai = el("input"), ares = el("div", "chips"); ai.placeholder = "Add someone: type a name";
      ai.addEventListener("input", () => {
        const q = ai.value.trim().toLowerCase(); ares.innerHTML = ""; if (!q) return;
        (window.__allPlayers ? Promise.resolve(window.__allPlayers) : API("listPlayers").then(l => window.__allPlayers = l)).then(list => {
          if (ai.value.trim().toLowerCase() !== q) return; ares.innerHTML = "";
          list.filter(x => !(c.ids || []).includes(x.id) && x.name.toLowerCase().includes(q)).slice(0, 8).forEach(x => {
            const ch = el("button", "chip", "+ " + x.name); ch.addEventListener("click", () => { ch.replaceWith(addToCrewBtn(c.id, c.name, x.id, x.name, () => setTimeout(openCrews, 900))); }); ares.appendChild(ch);
          });
          if (!ares.children.length) ares.appendChild(el("small", null, "No one by that name outside the crew."));
        }).catch(() => {});
      });
      af.appendChild(ai);
      mg.append(el("small", null, "Add someone who already plays:"), af, ares, el("small", null, "Tap a name, then tap again to remove them. Removed people can rejoin with the code, so tap New code if you need to lock it."), list, tools);
      row.appendChild(mg);
    }
    nodes.push(row);
  });
  const jf = el("div", "crewform"), ji = el("input"); ji.placeholder = "Crew code"; ji.maxLength = 8; ji.autocapitalize = "characters";
  const jb = el("button", "pill solid", "Join"); jb.addEventListener("click", () => { if (!ji.value.trim()) return; crewCall("joinCrew", ji.value.trim()).then(r => { toast(`You're in ${r.name} 🐶`, 2200); openCrews(); }).catch(e => toast(errMsg(e), 2600)); });
  jf.append(ji, jb);
  const cf = el("div", "crewform"), ci = el("input"); ci.placeholder = "New crew name"; ci.maxLength = 24;
  const cb = el("button", "pill", "Start"); cb.addEventListener("click", () => { if (!ci.value.trim()) return; crewCall("createCrew", ci.value.trim()).then(() => { toast("Crew started. Copy the invite link and send it.", 2600); openCrews(); }).catch(e => toast(errMsg(e), 2600)); });
  cf.append(ci, cb);
  nodes.push(el("h3", null, "Join a crew"), jf, el("h3", null, "Start a crew"), cf);
  openModal(nodes);
}
function joinPending() {
  const code = store.get("bdd:pendcrew"); if (!code || !me) return;
  store.del("bdd:pendcrew");
  API("joinCrew", me.id, code).then(r => { setCrews(r.crews); switchCrew(r.crew); toast(`You joined ${r.name}! 🐶`, 2600); }).catch(e => toast(errMsg(e), 2600));
}
document.addEventListener("click", e => { if (e.target.closest("#crew-manage")) openCrews(); if (e.target.closest("#wir-open")) openWeekReview(); });
renderCrewBar();
if (me) API("getCrews", me.id).then(l => setCrews(l)).catch(() => {});


// ================= WEEK IN REVIEW =================
// Pops up once per crew the first time you open the app after the week ends; reopen it from the Week tab.
function weekKey() { const p = KEY.split("-").map(Number), d = new Date(p[0], p[1] - 1, p[2]); d.setDate(d.getDate() - (d.getDay() + 6) % 7); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; }
function showWeekReview(r) {
  if (!r || !r.podium || !r.podium.length) { toast("No league games last week.", 2000); return; }
  const fmtD = k => new Date(k + "T12:00:00").toLocaleDateString(undefined, { month: "short", day: "numeric" });
  const box = el("div", "wir"), m = r.me, champ = r.podium[0];
  box.append(el("div", "kick", `Week in review · ${fmtD(r.start)}–${fmtD(r.end).replace(/^[A-Za-z]+ /, "")}${r.crew ? " · " + r.crew : ""}`));
  box.append(el("h2", null, m && m.rank === 1 ? "You won the week! 🏆" : `🏆 ${champ.name} won the week`));
  const pod = el("div", "pod");
  [[1, "🥈", 70], [0, "🥇", 96], [2, "🥉", 54]].forEach(([k, md, h]) => { const x = r.podium[k], d = el("div"); if (x) { const bar = el("i", null, md); bar.style.height = h + "px"; const nm = el("span", null, x.name); d.append(nm, el("small", null, x.pts + " pts"), bar); } pod.appendChild(d); });
  box.append(pod);
  if (m) {
    const yc = el("div", "card"); yc.append(el("span", "lbl", "Your week"));
    yc.append(el("b", "big", `#${m.rank} of ${r.players} · ${m.pts} pts`), el("span", null, m.above ? `${m.above.pts - m.pts} pts behind ${m.above.name} for #${m.rank - 1}` : m.below ? `${m.pts - m.below.pts} pts ahead of ${m.below.name}` : "Top of the board."));
    const bars = el("div", "bars"), byD = {}; (m.by || []).forEach(x => byD[x.d] = x);
    const p = r.start.split("-").map(Number);
    ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].forEach((dn, i) => { const dt = new Date(p[0], p[1] - 1, p[2] + i), dk = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(dt.getDate()).padStart(2, "0")}`, x = byD[dk], v = x ? x.p : 0;
      const s = el("div"), e = el("em", x && x.k ? "in" : ""); e.style.height = Math.max(4, v * 2.8) + "px"; s.append(el("small", null, x ? String(v) : "–"), e, el("small", null, dn)); bars.appendChild(s); });
    yc.append(bars, el("small", "sub", "Green = your best 5 days, the ones that counted"));
    box.append(yc);
    if (r.moment) { const mo = el("div", "card"); mo.append(el("span", "lbl", "Your best moment"), el("span", "moment", r.moment)); box.append(mo); }
  } else box.append(el("p", "sub", "You didn't play last week. This week's a fresh start."));
  if (r.awards && r.awards.length) {
    box.append(el("span", "lbl", "Awards")); const aw = el("div", "aw");
    r.awards.forEach(a => { const meta = AWARDS[a.key]; if (!meta) return; const d = el("div"), h = el("b"); h.append(emo(meta[0], 16), document.createTextNode(meta[1])); d.append(h, document.createTextNode(`${(a.names || [a.name]).join(", ")} · ${a.why}`)); aw.appendChild(d); });
    box.append(aw);
  }
  box.append(el("p", "sub", `${r.players} players · ${r.games} games played`));
  const go = el("button", "pill solid", "New week. Let's go 🐶"); go.addEventListener("click", closeModal);
  const sh = el("button", "pill", "Share my week"), ta = el("textarea", "copybox"); ta.rows = 5; ta.readOnly = true; ta.hidden = true;
  sh.addEventListener("click", () => copy([`Big Dawg Daily · week of ${fmtD(r.start)}${r.crew ? " · " + r.crew : ""}`, r.podium.map((x, i) => `${["🏆", "🥈", "🥉"][i]} ${x.name} ${x.pts}`).join("  "), m ? `Me: #${m.rank} of ${r.players} · ${m.pts} pts` : "", r.moment || "", APP_URL].filter(Boolean).join("\n"), ta));
  openModal([box, go, sh, ta]);
}
function openWeekReview() { if (!me) return; API("getWeekReview", me.id, KEY).then(showWeekReview).catch(e => toast(errMsg(e), 2200)); }
let wirAsked = "";
function maybeWeekReview() {
  if (!me || !crewSel) return;
  const k = "bdd:wir:" + weekKey() + ":" + crewSel; if (store.get(k) || wirAsked === k) return; wirAsked = k;
  API("getWeekReview", me.id, KEY).then(r => {
    if (!r || !r.podium || !r.podium.length || !(r.podium[0].pts > 0)) { store.set(k, 1); return; }
    const tryShow = (n) => { if (active === "home" && $("modal").hidden && $("splash").hidden && !serving) { store.set(k, 1); showWeekReview(r); } else if (n < 40) setTimeout(() => tryShow(n + 1), 3000); };
    tryShow(0);
  }).catch(() => { wirAsked = ""; });
}

// ================= SCOREBOARD =================
let board = null, postState = "init", writeChain = Promise.resolve(), synced = false;
function postStatus() {
  return {
    init: [false, "Connecting to the scoreboard…"], noname: [false, "Pick a name to post scores."], pending: [false, "Posting to the scoreboard…"],
    ok: [true, "✓ Posted to the scoreboard"], error: [false, "Couldn't post yet. It'll try again when you reopen the app."]
  }[postState];
}
function refreshPostLines() { const [ok, t] = postStatus(); document.querySelectorAll(".postline").forEach(p => { p.textContent = t; p.classList.toggle("ok", ok); }); }
function setPost(s) { postState = s; refreshPostLines(); }
function todayEntry() { const t = {}; if (fiveDone()) t.f = fiveSummary(); if (groupsDone()) t.g = groupsSummary(); if (S.mini.done) t.c = miniSummary(); if (S.strands.done) t.s = strandsSummary(); return t; }
function pushResult() {
  if (!me) { setPost("noname"); return; }
  const entry = todayEntry();
  if (!entry.f && !entry.g && !entry.c && !entry.s) return;
  setPost("pending");
  writeChain = writeChain.then(() => API("submit", me.id, KEY, entry)
    .then(b => { const before = boardOrder(board); board = b; setPost("ok"); announcePasses(before, boardOrder(b)); refreshStats(); if (active === "scores") renderScores(); })
    .catch(() => setPost("error")));
}
function refreshBoard() {
  if (!me) return Promise.resolve();
  return API("getBoard", KEY, me.id).then(b => {
    board = b; store.set("bdd:board", { k: KEY, b, c: crewSel });
    if (!synced) {
      synced = true;
      const mine = (b.players.find(p => p.id === me.id) || {}).t || {};
      lockFromBoard(mine);
      if ((fiveDone() && !mine.f) || (groupsDone() && !mine.g) || (S.mini.done && !mine.c) || (S.strands.done && !mine.s)) pushResult();
      else if (mine.f || mine.g || mine.c || mine.s) setPost("ok");
    }
    if (active === "scores") renderScores();
    if (active === "home") renderHome();
    refreshShade();
    if (!statsAt || Date.now() - statsAt > 120000) refreshStats();
  }).catch(() => { if (active === "scores") $("scores-note").textContent = "The scoreboard couldn't load. Tap refresh to try again."; });
}
// One attempt per puzzle: if the scoreboard already has your result for a game
// (say, you finished it on another phone), that game opens as finished here too.
function lockFromBoard(t) {
  let changed = false;
  if (t.f && !fiveDone()) { S.five.locked = { w: !!t.f.w, n: t.f.n, rows: t.f.rows.slice() }; current = ""; changed = true; }
  if (t.g && !groupsDone()) { S.groups.history = t.g.rows.slice(); S.groups.mistakes = t.g.w ? t.g.m : 4; S.groups.solved = t.g.w ? [0, 1, 2, 3] : []; sel.clear(); changed = true; }
  if (t.c && !S.mini.done) { TM.mini.start = null; Object.assign(S.mini, { started: true, done: true, el: t.c.t, checked: !!t.c.k, fill: SOL.map(x => x || ""), wrong: [] }); changed = true; }
  if (t.s && !S.strands.done) { TM.strands.start = null; Object.assign(S.strands, { started: true, done: true, el: t.s.t, found: STW.map((x, k) => k), hints: STW.map((x, k) => k).slice(0, t.s.h || 0) }); stPath = []; changed = true; }
  if (changed) { save(); colorKeyboard(); renderBoard(); renderGroups(); show(active); }
}
function stat(label, nodes) { const d = el("div", "stat"); const v = el("span", "val"); v.append(...nodes); d.append(el("span", "lbl", label), v); return d; }
const dash = () => el("span", "dim", "–");
// Scoreboard order: most games finished, then fewest Five guesses + Groups mistakes, then fastest Mini + Strands.
const doneCount = x => (x.t.f ? 1 : 0) + (x.t.g ? 1 : 0) + (x.t.c ? 1 : 0) + (x.t.s ? 1 : 0);
// Daily board order = the same points as the league (Five 5, Groups 5, Mini 6, Strands 6), ties by total time.
let RANKPTS = {}, PTSBY = {};
function rankCmp(a, b) {
  const cs = x => (x.t.c ? x.t.c.t + (x.t.c.k ? 30 : 0) : 5e8) + (x.t.s ? x.t.s.t + 30 * x.t.s.h : 5e8);
  return (RANKPTS[b.id] || 0) - (RANKPTS[a.id] || 0) || doneCount(b) - doneCount(a) || cs(a) - cs(b);
}
const sortBoard = list => { PTSBY = {}; RANKPTS = dayPts(list, PTSBY); return list.sort(rankCmp); };
const boardOrder = b => b ? sortBoard(b.players.map(p => ({ id: p.id, name: p.name, t: p.t || {} })).filter(x => doneCount(x))) : [];
function renderScores() {
  $("scores-date").textContent = now.toLocaleDateString(undefined, { month: "short", day: "numeric" }) + " · No. " + NUM;
  if (document.activeElement !== $("nick")) $("nick").value = me ? me.name : "";
  const body = $("scores-body");
  if (!board) { $("scores-note").textContent = "Loading the scoreboard…"; return; }
  const list = board.players.map(p => ({ id: p.id, name: p.name, t: p.t || {}, s: p.s || 0, z: !!p.z }));
  let mine = list.find(x => x.id === me.id);
  if (!mine) { mine = { id: me.id, name: me.name, t: {}, s: 0 }; list.push(mine); }
  mine.name = me.name;
  mine.t = Object.assign({}, mine.t, todayEntry());
  if (!mine.s && (mine.t.f || mine.t.g || mine.t.c || mine.t.s)) mine.s = 1;
  const rows = list.filter(x => x.id === me.id || x.t.f || x.t.g || x.t.c || x.t.s);
  sortBoard(rows);
  body.innerHTML = "";
  rows.forEach((x, idx) => {
    const li = el("li"); const head = el("div", "phead");
    const nm = el("button", "pname tap", x.name); nm.dataset.card = x.id;
    head.append(el("span", "rank" + (idx === 0 && doneCount(x) ? " r1" : ""), idx + 1), nm);
    if (stats && stats.crown.some(c => c.id === x.id)) { const c = el("span", "crown", "👑"); c.title = "Yesterday's winner"; head.appendChild(c); }
    if (gotds().some(gy => gy.y && gy.y.win && gy.y.win.id === x.id)) { const c = el("span", "crown", "🏆"); c.title = "Won yesterday's Game of the Day"; head.appendChild(c); }
    if (stats && stats.week.length && stats.week[0].id === x.id && stats.week[0].pts > 0) { const d = emo(":dawgW:", 20); d.classList.add("lead-dawg"); d.title = "Leading the week"; head.appendChild(d); }
    if (x.id === me.id) head.appendChild(el("span", "you", "You"));
    const sk = el("span", "streak", x.s ? `🔥 ${x.s}-day streak` + (x.z ? " 🧊" : "") : ""); if (x.z) sk.title = "Streak freeze used this week";
    head.appendChild(sk);
    head.appendChild(el("span", "ptot", (RANKPTS[x.id] || 0) + " pts"));
    if (x.id !== me.id && shadeLoaded && beating(x.id)) head.appendChild(shadeButton(x.id));
    const st = el("div", "stats");
    const tg = autoTags(x.t), pb = PTSBY[x.id] || {};
    const ord = n => n + (["th", "st", "nd", "rd"][(n % 100 > 10 && n % 100 < 14) || n % 10 > 3 ? 0 : n % 10]);
    const L = (name, k) => x.t[k] ? `${name} · +${pb[k] || 0}` + (pb[k + "r"] ? ` (${ord(pb[k + "r"])})` : "") : name;
    st.appendChild(x.t.f ? stat(L("Five", "f"), [el("span", null, (x.t.f.w ? x.t.f.n : "X") + "/6"), squares(x.t.f.rows, "f")].concat(tg.f || [])) : stat("Five", [dash()]));
    st.appendChild(x.t.g ? stat(L("Groups", "g"), [el("span", null, x.t.g.w ? (x.t.g.m === 0 ? "Perfect" : x.t.g.m + " miss") : "X"), squares(x.t.g.rows, "g")].concat(tg.g || [])) : stat("Groups", [dash()]));
    st.appendChild(stat(L("Strands", "s"), x.t.s ? [el("span", null, fmtTime(x.t.s.t) + (x.t.s.h ? ` · ${x.t.s.h} hint${x.t.s.h > 1 ? "s" : ""}` : ""))].concat(tg.s || []) : [dash()]));
    st.appendChild(stat(L("Mini", "c"), x.t.c ? [el("span", null, fmtTime(x.t.c.t) + (x.t.c.k ? "*" : ""))].concat(tg.c || []) : [dash()]));
    li.append(head, st); body.appendChild(li); // reactions removed to keep the board clean
  });
  if (shadeLoaded) renderSlackers(rows.map(x => x.id));
  const others = rows.length - 1;
  $("scores-note").textContent = (others ? "Scores post here on their own the moment anyone finishes a game." : "Nobody else has played today yet. The invite link is under ⚙️.") + (rows.some(x => x.t.c && x.t.c.k) ? " * = used Check." : "") + " Points: Five 5 (in 1–2) down to 1 (in 6). Groups 5 minus mistakes. Strands and Mini by speed: 1st +6, 2nd +5… down to +1 (each hint or Check adds 30s).";
}
let pollId = null;
function scoresShown() {
  renderScores(); refreshBoard(); if (!arcade) refreshArcade();
  clearInterval(pollId);
  pollId = setInterval(() => { if (active === "scores" && document.visibilityState === "visible") refreshBoard(); else { clearInterval(pollId); pollId = null; } }, 30000);
}
$("scores-refresh").addEventListener("click", () => { $("scores-note").textContent = "Refreshing…"; refreshBoard(); });
document.addEventListener("visibilitychange", () => { if (document.visibilityState === "visible" && me) refreshBoard(); });
$("nick-save").addEventListener("click", () => {
  const v = $("nick").value.trim(); if (!v || !me) return;
  API("register", me.id, v).then(r => { me = r; store.set("bdd:me", me); toast("Name saved"); renderScores(); }).catch(e => toast(errMsg(e), 2600));
});
$("invite-link").textContent = APP_URL || "Your app link";
// The invite link brings friends into the crew you're looking at (or just the app when you're on Everyone).
function inviteUrl() { const c = crews.find(x => x.id === crewSel); return c ? crewLink(c) : APP_URL; }
$("invite-copy").addEventListener("click", () => { const c = crews.find(x => x.id === crewSel); copy(`Join me${c ? ` in ${c.name}` : ""} on Big Dawg Daily: four quick puzzles a day, with a scoreboard. ` + inviteUrl(), $("copy-fallback"), "Invite link copied"); });
$("share-all").addEventListener("click", () => copy(shareText(), $("copy-fallback")));
$("switch-player").addEventListener("click", () => {
  store.del("bdd:me"); me = null; forgetUrl(); shadeLoaded = false;
  showWho();
});

// ================= SHADE: roast generator =================
// Short, stat-aware one-liners with a generational (or Shakespearean, or British) flavor.
const STYLES = {
  greatest: { label: "🎖️ Greatest Gen",
    open: ["Now see here,", "Good grief!", "In my day we walked uphill both ways:", "Hogwash!", "Golly,"],
    ins: ["whippersnapper", "nincompoop", "goldbricker", "palooka", "lollygagger", "dingbat"],
    close: ["We stormed beaches. You can't solve a crossword.", "Back to the salt mines with you.", "Shape up or ship out.", "That's a dang shame.", "Go fetch me a Sanka."] },
  roaring: { label: "🎩 Roaring '20s",
    open: ["Applesauce!", "Horsefeathers!", "Says you!", "Well, ain't that the bee's knees:"],
    ins: ["flat tire", "wet blanket", "dumb Dora", "four-flusher", "bluenose", "egg"],
    close: ["Go chase yourself.", "Banana oil!", "You're all wet.", "Scram, you bum.", "That's the cat's pajamas… NOT."] },
  boomer: { label: "📻 Boomer",
    open: ["Back in my day…", "Listen here, kiddo:", "Well, I'll be!", "Lemme tell ya something:", "Kids today…"],
    ins: ["knucklehead", "bozo", "slacker", "goof", "participation-trophy kid", "screen zombie"],
    close: ["Kids these days.", "Put the phone down.", "Get a real job.", "Not in this house.", "Pull yourself up by your bootstraps.", "I'm calling your mother."] },
  genx: { label: "📼 Gen X",
    open: ["Whatever.", "As if.", "Psych!", "Talk to the hand:", "Grody.", "Like, totally:"],
    ins: ["poser", "dweeb", "doofus", "loser", "space cadet", "mall rat"],
    close: ["Not!", "Take a chill pill.", "Gag me with a spoon.", "Don't have a cow.", "Be kind, rewind.", "Eat my shorts."] },
  nineties: { label: "📟 '90s Kid",
    open: ["Boo-yah!", "Talk to the hand,", "Booyakasha.", "Oh snap!", "Da bomb… NOT:"],
    ins: ["Tamagotchi killer", "dial-up connection", "Pog-flipping poser", "slap-bracelet reject", "buffering VHS"],
    close: ["Psych!", "Not all that and a bag of chips.", "As if!", "Cowabunga, loser.", "Your mom called, she wants her Game Boy back.", "Phat FAIL."] },
  millennial: { label: "🥑 Millennial",
    open: ["I literally can't.", "I'm dead.", "OMG.", "Okay but hear me out:", "Not gonna lie,"],
    ins: ["n00b", "scrub", "try-hard", "basic", "Harambe truther", "planking enthusiast"],
    close: ["Epic fail.", "Pwned.", "Adulting is hard.", "That's so 2012.", "Do you even lift?", "Living your worst life. #blessed"] },
  genz: { label: "💀 Gen Z",
    open: ["Bestie…", "Be so fr:", "No cap:", "POV:", "It's the loss for me:", "Ratio incoming:"],
    ins: ["NPC", "bot", "side quest character", "background extra", "pick-me", "delulu"],
    close: ["Skill issue.", "Cooked.", "It's giving L.", "Touch grass.", "The ick.", "Rent free in your loss column.", "Mid."] },
  alpha: { label: "🧃 Gen Alpha",
    open: ["Bro…", "Chat:", "Nah.", "Skibidi alert:", "Fanum tax incoming:"],
    ins: ["noob", "bozo", "NPC", "Ohio final boss", "sussy baka"],
    close: ["Negative aura.", "-1000 aura.", "Not very sigma.", "L + no rizz.", "Gyatt-less performance.", "Go back to Roblox."] },
  discord: { label: "🎮 Discord brain",
    open: ["Chat, look:", "Bro really…", "W/L check:", "Kek.", "Ratio:", "Patch notes:"],
    ins: ["NPC", "lurker", "copium addict", "mid laner", "AFK andy", "bronze-ranked tourist"],
    close: ["gg ez.", "Skill issue.", "Ratio.", "Touch grass.", "Copium levels critical.", "L + ratio + who asked.", "Chat is this real?", "Uninstall."] },
  bard: { label: "🎭 The Bard",
    open: ["Hark!", "Fie!", "Zounds!", "Forsooth!", "Alack!", "Out, damned spot!"],
    ins: ["cream-faced loon", "lily-livered knave", "beef-witted clotpole", "rump-fed ronyon", "pribbling hedge-pig", "canker-blossom"],
    close: ["Get thee hence.", "Exit, pursued by shame.", "Thou art undone.", "Methinks thou stinks.", "To lose or to lose, that is thy question.", "A plague on thy scorecard."] },
  brit: { label: "🇬🇧 Brit",
    open: ["Oi!", "Blimey!", "Cor!", "Right then:", "Bloody hell,", "Innit:"],
    ins: ["muppet", "plonker", "numpty", "wally", "donut", "pillock", "absolute melt"],
    close: ["Bottled it.", "Shambolic.", "Absolute scenes.", "Have a word with yourself.", "Pop the kettle on and cry.", "Bit of a mare, that."] },
  southern: { label: "🤠 Southern",
    open: ["Well bless your heart,", "Lord have mercy,", "I declare,", "Y'all ain't gonna believe this:", "Well butter my biscuit,"],
    ins: ["one fry short of a Happy Meal", "all hat and no cattle", "dumber than a box of rocks", "useless as a screen door on a submarine"],
    close: ["Bless your heart.", "Sweeter than tea, slower than molasses.", "Go sit on the porch and think about it.", "Fixin' to lose again, huh?"] },
  midwest: { label: "🌽 Midwest Nice",
    open: ["Oh, ya know,", "Ope,", "Well that's different:", "Not to be rude but", "Oh for cute,"],
    ins: ["silly goose", "dingus", "hotdish with no tater tots", "goofball", "real piece of work, ya know"],
    close: ["But we're still friends, ya know?", "Gonna pray for ya.", "Interesting choice. Real interesting.", "That's a heckuva way to play.", "Ope, just gonna sneak past you on the leaderboard."] },
  pirate: { label: "🏴‍☠️ Pirate",
    open: ["Arrr!", "Shiver me timbers!", "Avast ye,", "Blow me down!"],
    ins: ["scallywag", "bilge rat", "landlubber", "barnacle-brained swab"],
    close: ["Walk the plank.", "Davy Jones wouldn't take that score.", "Ye be sleepin' with the fishes.", "Dead men tell no tales, and neither should ye."] },
  announcer: { label: "🎙️ Sports Announcer",
    open: ["AND THE CROWD GOES MILD!", "Folks, I've seen it all:", "Unbelievable scenes here:", "Let's go to the replay:"],
    ins: ["walking turnover", "benchwarmer", "first-round bust", "practice-squad legend"],
    close: ["That's going on the blooper reel.", "Somebody check the tape.", "Fire the coach.", "And that's why they don't let you start."] },
  corporate: { label: "💼 Corporate",
    open: ["Per my last email,", "Circling back:", "Quick sync:", "Let's take this offline:", "Just looping you in:"],
    ins: ["synergy vacuum", "low performer", "meeting that should've been an email", "reply-all disaster"],
    close: ["Let's put a pin in your dignity.", "Not a culture fit.", "See attached: your score.", "This is going in your performance review.", "Moving forward, please be better."] },
  dad: { label: "👨 Dad Jokes",
    open: ["Hi Hungry, I'm Dad.", "Fun fact:", "Here's the thing, champ:", "Did you hear the one about your score?"],
    ins: ["sport", "bud", "kiddo", "champ"],
    close: ["I'm not mad, just disappointed.", "Ask your mother.", "That score is un-BEE-lievable. Bad.", "Who turned off the lights? Oh, that's just your future.", "Someone call the dentist, that score needs a filling."] },
  mob: { label: "🎲 Mob Boss",
    open: ["Fuhgeddaboudit.", "Capisce?", "Lemme make you an offer:", "You come into my house…"],
    ins: ["mook", "goombah", "two-bit palooka", "cannoli without the filling"],
    close: ["Sleep with the fishes.", "It's not personal. It's business.", "Leave the gun, take the L.", "Badda bing, badda bust."] }
};
const STYLE_KEYS = Object.keys(STYLES);
const UNHINGED = [
  "A dictionary just filed a restraining order.",
  "Autocorrect guesses better.",
  "Scientists are studying you as a warning.",
  "Even the Magic 8-Ball said no.",
  "Your row needs a parental advisory."
];
const pick = a => a[Math.floor(Math.random() * a.length)];
const plural = (n, w) => `${n} ${w}${n === 1 ? "" : "s"}`;
function burnsFor(name, t) {
  const b = [];
  const add = (w, arr) => b.push({ w, s: pick(arr) });
  if (!t || (!t.f && !t.g && !t.s && !t.c)) {
    add(5, [`${name} hasn't played today. Scared?`, `Zero puzzles, ${name}. Bold.`, `${name}: missing in action.`, `Four dashes, ${name}. Iconic.`]);
    return b;
  }
  const skipped = [["f", "Five"], ["g", "Groups"], ["s", "Strands"], ["c", "the Mini"]].filter(([k]) => !t[k]).map(([, n]) => n);
  if (skipped.length) add(1, [`${name} skipped ${skipped[0]}. Chicken?`, `No ${skipped[0]}, ${name}? Coward.`]);
  if (t.f) {
    const n = t.f.n;
    if (!t.f.w) add(6, [`${name} went X/6 on Five.`, `Six guesses, zero answers, ${name}.`, `${name} played Five like a slot machine.`]);
    else if (n >= 5) add(5, [`${n}/6 on Five, ${name}? Sweaty.`, `${name} needed ${n} guesses. Yikes.`]);
    else if (n === 4) add(2, [`4/6, ${name}. Aggressively average.`]);
    else add(2, [`${n}/6, ${name}? Lucky guess.`, `${name} got Five in ${n}. Suspicious.`]);
  }
  if (t.g) {
    const m = t.g.m;
    if (!t.g.w) add(6, [`${name} flunked Groups.`, `${name} couldn't sort 16 words.`]);
    else if (m >= 2) add(4, [`${plural(m, "mistake")} in Groups, ${name}.`, `${name} guessed their way through Groups.`]);
    else if (m === 1) add(2, [`One Groups oopsie, ${name}.`]);
    else add(1, [`Perfect Groups, ${name}? Get a hobby.`]);
  }
  if (t.s) {
    const h = t.s.h, T = fmtTime(t.s.t);
    if (h >= 2) add(5, [`${h} hints on Strands, ${name}?`, `${name} took the Strands guided tour.`]);
    else if (h === 1) add(3, [`${name} needed a Strands hint.`]);
    if (t.s.t > 240) add(3, [`${T} on Strands, ${name}. Glacial.`]);
  }
  if (t.c) {
    const T = fmtTime(t.c.t);
    if (t.c.k) add(4, [`${name} hit Check on the Mini. Asterisk.`]);
    if (t.c.t > 150) add(4, [`${T} on the Mini, ${name}? It's mini.`]);
    else if (t.c.t > 60) add(2, [`${T} on the Mini. Slow, ${name}.`]);
    else add(1, [`${T} on the Mini? Cheater vibes, ${name}.`]);
  }
  return b;
}
function versusFor(t, mine) {
  const out = [];
  if (!t || !mine) return out;
  if (mine.f && mine.f.w && (!t.f || !t.f.w || mine.f.n < t.f.n)) out.push(`I got Five in ${mine.f.n}.` + (t.f ? (t.f.w ? ` You: ${t.f.n}.` : " You: X.") : ""));
  if (mine.c && t.c && mine.c.t < t.c.t) out.push(`My Mini: ${fmtTime(mine.c.t)}. Yours: ${fmtTime(t.c.t)}.`);
  return out;
}
function weightedPick(arr) { const tot = arr.reduce((a, x) => a + x.w, 0); let r = Math.random() * tot; for (const x of arr) { r -= x.w; if (r <= 0) return x; } return arr[0]; }
// One burn plus a quick flavor line. Mild is a tease, Medium adds an insult, Unhinged adds a haymaker.
function makeShade(name, t, mine, spice, styleKey, opts = {}) {
  const st = STYLES[styleKey === "chaos" ? pick(STYLE_KEYS) : styleKey];
  if (opts.dare) { // short trash talk back at someone who dared you
    const d = opts.dare, g = d.gameName, n = d.target;
    const line = pick([`${n} in ${g}? That's my warm-up.`, `Cute ${n}. Watch this.`, `Bold of you to dare me with ${n}.`, `${n}? A sleeping pug could beat that.`, `I'll beat ${n} with my eyes closed.`, `${n} in ${g}. Adorable.`, `Clear your schedule, ${name}. ${n} is going down.`]);
    return [pick(st.open), line, spice === 1 ? pick(st.close) : `You ${pick(st.ins)}.`].filter(Boolean).join(" ").replace(/\s+/g, " ").trim().slice(0, 160);
  }
  const parts = [];
  if (opts.fire) parts.push(pick(["Return fire!", "Oh, it's on.", "You started this."]));
  else if (spice >= 2 || Math.random() < 0.5) parts.push(pick(st.open));
  parts.push(weightedPick(burnsFor(name, t)).s);
  const vs = spice >= 2 ? versusFor(t, mine) : [];
  if (vs.length && Math.random() < 0.35) parts.push(pick(vs));
  if (opts.jokes && opts.jokes.length && Math.random() < 0.4) parts.push(pick(opts.jokes).replace(/\{name\}/gi, name));
  else if (spice === 1) parts.push(pick([pick(st.close), "Love you though."]));
  else if (spice === 2) parts.push(Math.random() < 0.5 ? `You ${pick(st.ins)}.` : pick(st.close));
  else parts.push(`You ${pick(st.ins)}. ${pick(UNHINGED)}`);
  return parts.filter(Boolean).join(" ").replace(/\s+/g, " ").trim().slice(0, 220);
}

// ================= SHADE: UI =================
const SPICE = { 1: "Mild", 2: "Medium", 3: "Unhinged" };
const SPICE_DESC = { 1: "Gentle ribbing. Grandma-safe.", 2: "Real burns, still friendly.", 3: "Theatrical, merciless, still clean." };
let shade = { inbox: [], sentToday: {}, firedBack: [], board: null, settings: { spice: 0, jokes: false, mute: false }, jokes: [], players: [] };
let shadeLoaded = false;
function refreshShade() {
  if (!me) return Promise.resolve();
  return API("getShadeState", me.id, KEY).then(st => { shade = st; shadeLoaded = true; renderShadeBits(); maybeServe(); if ((st.recent || []).some(x => (x.kind === "joinok" || x.kind === "join" || x.kind === "added") && !x.seen)) API("getCrews", me.id).then(l => setCrews(l)).catch(() => {}); }).catch(() => {});
}
function playerInfo(id) {
  const p = (shade.players || []).find(x => x.id === id) || {};
  const b = board && board.players.find(x => x.id === id);
  return { id, name: p.name || (b && b.name) || "Player", muted: !!p.muted, t: (b && b.t) || {} };
}
function openSpicePicker(then) {
  const nodes = [el("h2", null, "Pick your spice level"), el("p", "sub", "How hard should your shade hit? You can change this anytime in Settings.")];
  const wrap = el("div", "spicepick");
  [1, 2, 3].forEach(n => {
    const b = el("button", "spiceopt");
    b.append(el("b", null, ["🌶️", "🌶️🌶️", "🌶️🌶️🌶️"][n - 1] + " " + SPICE[n]), el("span", null, SPICE_DESC[n]));
    b.addEventListener("click", () => { saveShadeSettings({ spice: n }).then(() => { closeModal(); if (then) then(); }); });
    wrap.appendChild(b);
  });
  nodes.push(wrap);
  openModal(nodes);
}
function saveShadeSettings(patch) {
  shade.settings = Object.assign({}, shade.settings, patch);
  renderSettings();
  return API("saveSettings", me.id, shade.settings).catch(e => toast(errMsg(e), 2400));
}
function openShade(targetId, opts = {}) {
  if (!me || targetId === me.id) return;
  const tgt = playerInfo(targetId);
  if (tgt.muted && !opts.fire) { toast(`${tgt.name} has shade muted`, 2200); return; }
  if (!opts.fire && !beating(targetId)) { toast(`You're not beating ${tgt.name} today. Shade is earned. 😤`, 2600); return; }
  const used = shade.sentToday[targetId] || 0;
  if (!opts.fire && used >= 3) { toast(`You've thrown 3 at ${tgt.name} today. Save some for tomorrow.`, 2600); return; }
  let style = "chaos", text = "";
  const jokes = shade.settings.jokes ? shade.jokes.map(j => j.text) : [];
  // Editable: the generator writes a draft, you can tweak it before sending.
  const card = el("textarea", "shadecard shade-edit"); card.rows = 4; card.maxLength = 300; card.setAttribute("aria-label", "Your shade (tap to edit)");
  const roll = () => { text = makeShade(tgt.name, tgt.t, todayEntry(), shade.settings.spice || 2, style, { fire: !!opts.fire, jokes, dare: opts.dare }); card.value = text; };
  const chips = el("div", "chips shade-chips");
  [["chaos", "🎲 Chaos"]].concat(STYLE_KEYS.map(k => [k, STYLES[k].label])).forEach(([k, label]) => {
    const c = el("button", "chip" + (k === style ? " on" : ""), label);
    c.addEventListener("click", () => { style = k; chips.querySelectorAll(".chip").forEach(x => x.classList.toggle("on", x === c)); roll(); });
    chips.appendChild(c);
  });
  roll();
  const reroll = el("button", "pill", "🔄 Reroll"); reroll.addEventListener("click", roll);
  const send = el("button", "pill solid", opts.dare ? "🗣️ Send it" : opts.fire ? "🔥 Fire back" : "🎯 Throw it");
  const status = el("p", "note center", opts.dare ? `Talk trash about ${tgt.name}'s dare. One reply per dare.` : opts.fire ? `Return fire at ${tgt.name}. One shot per shade.` : `${3 - used} of 3 throws left at ${tgt.name} today · Spice: ${SPICE[shade.settings.spice || 2]}`);
  send.addEventListener("click", () => {
    send.disabled = true; status.textContent = "Delivering…";
    text = card.value.trim(); if (!text) { send.disabled = false; status.textContent = "Write something first."; return; }
    API("sendShade", me.id, targetId, KEY, text, opts.fire ? "fire" : "shade", opts.replyTo || "")
      .then(st => { shade = st; renderShadeBits(); closeModal(); toast(opts.dare ? "Trash talk delivered 🗣️" : opts.fire ? "Fired back 🔥" : `Shade delivered to ${tgt.name} 🎯`, 2000); })
      .catch(e => { send.disabled = false; status.textContent = errMsg(e); });
  });
  const row = el("div", "inrow center"); row.append(reroll, send);
  openModal([el("h2", null, (opts.dare ? "Talk trash at " : opts.fire ? "Fire back at " : "Throw shade at ") + tgt.name), card, el("p", "note center", "✏️ Tap the text to edit it"), chips, row, status]);
}
let serving = null;
// Pop-ups are only for things that were earned: shade (only throwable when beating you), dares,
// and dare results where they actually beat your score. Everything else waits quietly in the bell.
const popOn = k => (store.get("bdd:pop") || {})[k] !== false;
function worthy(x) {
  if (x.kind === "shade") return popOn("shade");
  if (x.kind === "dare") return popOn("dares");
  if (x.kind === "dareres") { const d = parseDare(x.text), [sc, tg] = d.rest.split("/").map(Number); return popOn("dares") && betterG(d.game, sc, tg); }
  return false;
}
function renderBell() {
  const n = ((shade.recent || []).filter(x => !x.seen).length) || 0;
  $("bell-n").hidden = !n; $("bell-n").textContent = n > 9 ? "9+" : String(n);
}
const NOTE_ICON = { shade: "🎯", fire: "🔥", clap: "👏", dare: "🕹️", dareres: "🏁", join: "🙋", joinok: "🎉", added: "🎉", newbie: "👋" };
function noteText(x) {
  if (x.kind === "dare") { const d = parseDare(x.text); return `${x.fromName} dared you to beat ${fmtG(d.game, d.target)} in ${ARC[d.game] ? ARC[d.game].name : "the arcade"}`; }
  if (x.kind === "dareres") { const d = parseDare(x.text), [sc, tg] = d.rest.split("/").map(Number), nm = ARC[d.game] ? ARC[d.game].name : "the arcade"; return betterG(d.game, sc, tg) ? `${x.fromName} beat your ${fmtG(d.game, tg)} in ${nm} with ${fmtG(d.game, sc)}` : `${x.fromName} took your ${nm} dare and fell short (${fmtG(d.game, sc)})`; }
  if (x.kind === "join") return `${x.fromName} wants into ${x.crew || "your crew"}`;
  if (x.kind === "newbie") return `${x.fromName} just joined Big Dawg Daily`;
  if (x.kind === "added") return `${x.fromName} added you to ${x.crew || "a crew"} 🐶`;
  if (x.kind === "joinok") return `You're in ${x.crew || "the crew"}! ${x.fromName} let you in.`;
  if (x.kind === "clap") return `${x.fromName} clapped back`;
  if (x.kind === "fire") return `${x.fromName} fired back: “${x.text}”`;
  return `${x.fromName} threw shade: “${x.text}”`;
}
function openBell() {
  const list = el("div", "notes"), rec = shade.recent || [];
  if (!rec.length) list.appendChild(el("p", "sub", "Nothing yet. Go beat somebody."));
  rec.forEach(x => {
    const r = el("div", "note-row" + (x.seen ? "" : " new")), ic = el("span", "ni");
    if (x.kind === "clap" && isDawg(x.text)) ic.appendChild(emo(x.text, 22)); else ic.textContent = x.kind === "clap" ? x.text : NOTE_ICON[x.kind] || "🎯";
    const tx = el("div"); tx.append(document.createTextNode(noteText(x)), el("small", null, x.date === KEY ? "Today" : x.date));
    r.append(ic, tx);
    if (x.kind === "join" && x.response !== "yes" && x.response !== "no") tx.appendChild(joinButtons(x.id, x.fromName, x.crew));
    if (x.kind === "newbie" && x.response !== "yes" && x.text && x.crew) { const row = el("div", "inrow"); row.appendChild(addToCrewBtn(x.text, x.crew, x.from, x.fromName, () => { x.response = "yes"; })); tx.appendChild(row); }
    list.appendChild(r);
  });
  const set = el("div", "col");
  [["shade", "Pop up when someone throws shade"], ["dares", "Pop up for dares and when someone beats your score"]].forEach(([k, label]) => {
    const l = el("label", "toggle"), cb = el("input"); cb.type = "checkbox"; cb.checked = popOn(k);
    cb.addEventListener("change", () => { const p = store.get("bdd:pop") || {}; p[k] = cb.checked; store.set("bdd:pop", p); });
    l.append(cb, document.createTextNode(" " + label)); set.appendChild(l);
  });
  openModal([el("h2", null, "Notifications"), list, el("p", "lbl2", "Pop-ups"), set]);
  // opening the bell counts as seeing everything that isn't waiting to pop up
  const ids = rec.filter(x => !x.seen && !(shade.inbox || []).some(i => i.id === x.id && worthy(i))).map(x => x.id);
  rec.forEach(x => { if (ids.includes(x.id)) x.seen = true; });
  shade.inbox = (shade.inbox || []).filter(i => !ids.includes(i.id));
  renderBell();
  if (ids.length && me) API("markSeen", me.id, ids).catch(() => {});
}
$("home-bell").addEventListener("click", openBell);
$("home-idea").addEventListener("click", () => {
  const ta = el("textarea", "copybox"); ta.rows = 5; ta.maxLength = 1000; ta.placeholder = "What would make Big Dawg better? Bugs, ideas, game requests…";
  const go = el("button", "pill solid", "Send to Sam"), msg = el("p", "note center");
  go.addEventListener("click", () => {
    const t = ta.value.trim(); if (!t || !me) { msg.textContent = "Type something first."; return; }
    go.disabled = true; msg.textContent = "Sending…";
    API("sendFeedback", me.id, t).then(() => { closeModal(); toast("Sent! Thanks for the idea 🐶", 2000); }).catch(e => { go.disabled = false; msg.textContent = errMsg(e); });
  });
  openModal([el("h2", null, "Ideas & feedback"), el("p", "sub", "Goes straight to Sam."), ta, go, msg]);
  setTimeout(() => ta.focus(), 80);
});
function maybeServe() {
  renderBell();
  const next = (shade.inbox || []).find(worthy);
  if (serving || !next) return;
  if (!(active === "home" || active === "scores") || !$("modal").hidden || !$("splash").hidden) return;
  serving = next;
  const clap = serving.kind === "clap", dare = serving.kind === "dare", res = serving.kind === "dareres";
  $("served-from").textContent = `${serving.fromName} ${dare ? "dared you" : res ? "took your dare" : clap ? "clapped back" : serving.kind === "fire" ? "fired back at you" : "threw shade at you"}`;
  $("served-text").textContent = "";
  if (clap && isDawg(serving.text)) $("served-text").appendChild(emo(serving.text, 110));
  else if (dare) { const d = parseDare(serving.text); $("served-text").textContent = `Beat ${fmtG(d.game, d.target)} in ${ARC[d.game].name}. 🐶`; }
  else if (res) { const d = parseDare(serving.text), [sc, tg] = d.rest.split("/").map(Number); $("served-text").textContent = betterG(d.game, sc, tg) ? `${serving.fromName} scored ${fmtG(d.game, sc)} in ${ARC[d.game].name}, beating your ${fmtG(d.game, tg)}. Run it back? 😤` : `${serving.fromName} scored ${fmtG(d.game, sc)} in ${ARC[d.game].name}. Your ${fmtG(d.game, tg)} stands. 😎`; }
  else $("served-text").textContent = serving.text;
  $("served-text").classList.toggle("big", clap);
  $("served-ok").textContent = res ? "GG" : "Noted 😤";
  $("served-acts").hidden = clap || dare || res; $("served-claps").hidden = clap || dare || res; $("served-okrow").hidden = !(clap || res); $("served-darerow").hidden = !dare;
  const more = shade.inbox.filter(worthy).length - 1;
  $("served-more").textContent = more ? `${more} more waiting` : "";
  $("served").hidden = false;
}
function finishServe(resp, emoji) {
  const sh = serving; if (!sh) return;
  $("served").hidden = true; serving = null;
  shade.inbox = shade.inbox.filter(x => x.id !== sh.id);
  (shade.recent || []).forEach(x => { if (x.id === sh.id) x.seen = true; }); renderBell();
  API("respondShade", me.id, sh.id, resp === "later" || resp === "trash" ? "ok" : resp).then(() => { if (resp === "L") refreshShade(); }).catch(() => {});
  if (resp === "play" || resp === "later" || resp === "trash") {
    const pd = parseDare(sh.text), d = { id: sh.id, from: sh.from, fromName: sh.fromName, target: pd.target, game: pd.game };
    aDares = aDares.filter(x => x.id !== d.id).concat([d]).slice(-10); store.set("bdd:dares", aDares);
    renderArcSub();
    if (resp === "play") { aDare = d; playGame(d.game); }
    else if (resp === "trash") { openShade(sh.from, { fire: true, replyTo: sh.id, dare: { target: fmtG(d.game, d.target), gameName: ARC[d.game].name } }); toast("Dare saved in the Arcade too.", 1600); }
    else { toast("Saved. It's waiting in the Arcade.", 1800); setTimeout(maybeServe, 400); }
    renderShadeBits(); return;
  }
  if (resp === "fire") openShade(sh.from, { fire: true, replyTo: sh.id });
  else if (resp === "clap") {
    chime("pop"); toast(`${emoji} sent to ${sh.fromName}`, 1800);
    API("sendShade", me.id, sh.from, KEY, emoji, "clap", sh.id).then(s => { s.inbox = (s.inbox || []).filter(x => x.id !== sh.id); shade = s; renderShadeBits(); }).catch(e => toast(errMsg(e), 2200));
    setTimeout(maybeServe, 400);
  }
  else if (resp === "ok") setTimeout(maybeServe, 400);
  else { toast("L taken. Character building.", 1800); setTimeout(maybeServe, 400); }
  renderShadeBits();
}
$("served-fire").addEventListener("click", () => finishServe("fire"));
$("served-l").addEventListener("click", () => finishServe("L"));
$("served-ok").addEventListener("click", () => finishServe("ok"));
$("served-play").addEventListener("click", () => finishServe("play"));
$("served-later").addEventListener("click", () => finishServe("later"));
$("served-trash").addEventListener("click", () => finishServe("trash"));
["👏", "🫃", "🤡", "🖕", ":dawgpain:", ":dawgclown:"].forEach(c => {
  const b = el("button"); b.dataset.clap = c; b.setAttribute("aria-label", "Clap back " + c); b.appendChild(emo(c, 36));
  b.addEventListener("click", () => finishServe("clap", c)); $("clap-row").appendChild(b);
});
function renderShadeBits() {
  // home badge
  const n = (shade.inbox || []).filter(worthy).length;
  if (n && $("sub-scores")) $("sub-scores").textContent = `🎯 ${n} shade${n > 1 ? "s" : ""} waiting for you`;
  // scoreboard buttons + slackers + boards + settings
  if (active === "scores") { renderScores(); }
  renderShadeBoard(); renderSettings();
}
function shadeButton(id) {
  const p = playerInfo(id);
  const used = shade.sentToday[id] || 0;
  const b = el("button", "shadebtn", p.muted ? "🔕" : "🎯");
  b.dataset.shade = id;
  b.setAttribute("aria-label", p.muted ? `${p.name} has shade muted` : `Throw shade at ${p.name}`);
  if (p.muted || used >= 3) b.classList.add("off");
  return b;
}
document.addEventListener("click", e => { const b = e.target.closest("[data-shade]"); if (b) openShade(b.dataset.shade); });
// Shade is earned: you can only throw it at someone you're beating today (same points as the league).
function dayPts(list, by) {
  by = by || {};
  const pts = {}; list.forEach(p => { const t = p.t || {}, b = by[p.id] = { f: 0, g: 0, c: 0, s: 0 }; pts[p.id] = 0; if (t.f) b.f = t.f.w ? Math.min(5, 7 - t.f.n) : 0; if (t.g) b.g = t.g.w ? 5 - t.g.m : 0; pts[p.id] = b.f + b.g; });
  const ranked = (k, sc) => { const L = list.filter(p => p.t && p.t[k]), S = L.map(p => sc(p.t[k])); L.forEach((p, i) => { const r = S.filter(x => x < S[i]).length, v = Math.max(1, 6 - r); by[p.id][k] = v; by[p.id][k + "r"] = r + 1; pts[p.id] += v; }); };
  ranked("c", c => c.t + (c.k ? 30 : 0)); ranked("s", x => x.t + 30 * x.h);
  return pts;
}
function todayList() {
  const list = ((board && board.players) || []).map(p => ({ id: p.id, t: p.t || {} }));
  if (me) { let m = list.find(x => x.id === me.id); if (!m) { m = { id: me.id, t: {} }; list.push(m); } m.t = Object.assign({}, m.t, todayEntry()); }
  return list;
}
function beating(id) {
  if (!me) return false;
  const list = todayList(), mine = list.find(x => x.id === me.id), them = list.find(x => x.id === id);
  const played = x => x && x.t && (x.t.f || x.t.g || x.t.c || x.t.s);
  if (!played(mine)) return false;
  if (!played(them)) return true;
  const pts = dayPts(list); return pts[me.id] > pts[id];
}
function renderSlackers(shown) {
  const box = $("slackers"), chips = $("slacker-chips");
  const ids = beating("__nobody__") ? (shade.players || []).map(p => p.id).filter(id => id !== (me && me.id) && !shown.includes(id)) : [];
  box.hidden = !ids.length; chips.innerHTML = "";
  ids.forEach(id => { const c = el("button", "chip", "🎯 " + playerInfo(id).name); c.dataset.shade = id; chips.appendChild(c); });
}
function renderShadeBoard() {
  const b = shade.board; if (!b) return;
  const fill = (ol, list, unit) => {
    ol.innerHTML = "";
    if (!list.length) { ol.appendChild(el("li", "dim", "Nobody yet")); return; }
    list.forEach((x, i) => { const li = el("li"); li.append(el("span", "rk", i + 1), el("span", "nm", x.name), el("span", "ct", `${x.n} ${unit}`)); ol.appendChild(li); });
  };
  fill($("sb-recv"), b.recv, "🎯"); fill($("sb-sent"), b.sent, "🎯"); fill($("sb-claps"), b.claps || [], "👏");
  $("sb-ls").textContent = b.ls.length ? `Most Ls taken: ${b.ls[0].name} (${b.ls[0].n}). ${b.ls[0].n > 2 ? "A true martyr." : "Humble."}` : "";
}
function renderSettings() {
  const s = shade.settings || {};
  document.querySelectorAll("#spice-seg button").forEach(b => b.classList.toggle("on", Number(b.dataset.spice) === (s.spice || 2)));
  $("opt-jokes").checked = !!s.jokes; $("opt-mute").checked = !!s.mute;
  $("jokes-box").hidden = !s.jokes;
  const ul = $("joke-list"); ul.innerHTML = "";
  (shade.jokes || []).forEach(j => {
    const li = el("li"); li.append(el("span", null, j.text), el("span", "dim", " · " + j.by));
    if (j.mine) { const x = el("button", "textbtn", "Remove"); x.addEventListener("click", () => API("deleteJoke", me.id, j.id).then(list => { shade.jokes = list; renderSettings(); })); li.appendChild(x); }
    ul.appendChild(li);
  });
  if (!(shade.jokes || []).length) ul.appendChild(el("li", "dim", "No inside jokes yet. Add the first one."));
}
document.querySelectorAll("#spice-seg button").forEach(b => b.addEventListener("click", () => { saveShadeSettings({ spice: Number(b.dataset.spice) }); toast(`Spice: ${SPICE[b.dataset.spice]}`); }));
$("opt-jokes").addEventListener("change", e => saveShadeSettings({ jokes: e.target.checked }));
$("opt-mute").addEventListener("change", e => { saveShadeSettings({ mute: e.target.checked }); toast(e.target.checked ? "Shade muted. Peace and quiet." : "Shade unmuted. Brace yourself."); });
$("joke-add").addEventListener("click", () => {
  const v = $("joke-in").value.trim(); if (!v) return;
  API("addJoke", me.id, v).then(list => { shade.jokes = list; $("joke-in").value = ""; renderSettings(); toast("Inside joke added"); }).catch(e => toast(errMsg(e), 2400));
});

// ================= BIG DAWG EMOTES: auto tags & picker =================
// The app tags notable results with a dawg face on its own.
function autoTags(t) {
  const out = {}, tag = (k, code, why) => { const e = emo(code, 18); e.classList.add("tag"); e.title = why; out[k] = [e]; };
  if (t.f) { if (!t.f.w) tag("f", ":dawgL:", "X/6"); else if (t.f.n === 6) tag("f", ":dawgsweat:", "Phew, 6/6"); else if (t.f.n <= 2) tag("f", ":dawgW:", "Genius"); }
  if (t.g) { if (!t.g.w) tag("g", ":dawgpain:", "Out of mistakes"); else if (t.g.m === 0) tag("g", ":dawgpog:", "Perfect sort"); }
  if (t.s && t.s.h >= 3) tag("s", ":dawgcope:", "Lots of hints");
  if (t.c) { if (!t.c.k && t.c.t < 30) tag("c", ":dawgsus:", "Suspiciously fast"); else if (t.c.t > 300) tag("c", ":dawgskull:", "Over 5 minutes"); }
  return out;
}
function openDawgPicker(toId) {
  const p = board && board.players.find(q => q.id === toId); if (!p) return;
  const grid = el("div", "dawggrid");
  DAWG_KEYS.forEach(k => {
    const code = ":" + k + ":", on = (p.rm || []).includes(code);
    const b = el("button", on ? "on" : ""); b.dataset.react = code; b.dataset.to = toId;
    b.append(emo(code, 48), el("span", null, code)); grid.appendChild(b);
  });
  openModal([el("h2", null, "React to " + p.name), grid]);
}

// ================= FUN: confetti, sounds, crown, league, player cards, reactions =================
const fxOn = () => store.get("bdd:fx") !== 0;
function confetti(n = 90) {
  if (!fxOn() || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const box = el("div", "confetti"); document.body.appendChild(box);
  const colors = ["#6aaa64", "#c9b458", "#b0c4ef", "#ba81c5", "#f9df6d", "#ff7b6b"];
  for (let i = 0; i < n; i++) {
    const p = el("i");
    p.style.left = Math.random() * 100 + "%"; p.style.background = colors[i % colors.length];
    p.style.animationDelay = Math.random() * 0.5 + "s"; p.style.animationDuration = 1.6 + Math.random() * 1.2 + "s";
    p.style.setProperty("--dx", Math.random() * 160 - 80 + "px"); p.style.setProperty("--r", Math.random() * 900 - 450 + "deg");
    box.appendChild(p);
  }
  // It's raining dogs.
  const DOGS = ["🐶", "🐕", "🐶", "🐩", "🦴", "🐾", ":dawgW:", ":dawgpog:"];
  for (let i = 0; i < Math.round(n / 4); i++) {
    const code = DOGS[Math.floor(Math.random() * DOGS.length)];
    const d = el("span", "dog"); d.appendChild(emo(code, 30 + Math.round(Math.random() * 14)));
    d.style.left = Math.random() * 94 + "%";
    d.style.animationDelay = Math.random() * 0.9 + "s"; d.style.animationDuration = 2 + Math.random() * 1.4 + "s";
    d.style.setProperty("--dx", Math.random() * 80 - 40 + "px"); d.style.setProperty("--r", Math.random() * 120 - 60 + "deg");
    box.appendChild(d);
  }
  setTimeout(() => box.remove(), 4600);
}
let actx = null;
function chime(kind = "win") {
  if (!fxOn()) return;
  try {
    actx = actx || new (window.AudioContext || window.webkitAudioContext)();
    const notes = { win: [523, 659, 784, 1047], pass: [392, 523, 659, 784], pop: [880], lose: [330, 262] }[kind] || [660];
    notes.forEach((f, i) => {
      const o = actx.createOscillator(), g = actx.createGain(), t = actx.currentTime + i * 0.11;
      o.type = "triangle"; o.frequency.value = f;
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.16, t + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);
      o.connect(g); g.connect(actx.destination); o.start(t); o.stop(t + 0.4);
    });
  } catch (e) {}
}
function celebrate() { confetti(); chime("win"); }
// "You passed Ben!" when a finished game moves you up the scoreboard.
function announcePasses(before, after) {
  if (!me || !before.length) return;
  const bi = id => { const i = before.findIndex(x => x.id === id); return i < 0 ? before.length : i; };
  const ai = id => { const i = after.findIndex(x => x.id === id); return i < 0 ? after.length : i; };
  const passed = before.filter(x => x.id !== me.id && bi(x.id) < bi(me.id) && ai(x.id) > ai(me.id)).map(x => x.name);
  if (!passed.length) return;
  const names = passed.length > 2 ? `${passed.slice(0, 2).join(", ")} and ${passed.length - 2} more` : passed.join(" and ");
  setTimeout(() => { toast(`🚀 You just passed ${names}!`, 2600); chime("pass"); confetti(40); }, 2400);
}
let stats = null, statsAt = 0;
function refreshStats() {
  if (!me) return Promise.resolve();
  statsAt = Date.now();
  return API("getStats", me.id, KEY).then(st => { stats = st; store.set("bdd:stats", { k: KEY, s: st, c: crewSel }); setTimeout(maybeWeekReview, 1500); renderLeague(); if (active === "scores") renderScores(); if (active === "home") renderHome(); }).catch(() => { statsAt = 0; });
}
// Short headline for the Scoreboard card: Monday-Tuesday it's last week's champ, otherwise yesterday's crown.
function bannerText() {
  if (!stats) return "";
  const d = now.getDay();
  if (stats.lastChamp && (d === 1 || d === 2)) return `🏆 ${stats.lastChamp.name} won last week`;
  if (stats.crown.length) return `👑 ${stats.crown.map(c => c.name).join(" & ")}`;
  return stats.week.length ? `📈 ${stats.week[0].name} leads` : "";
}
// "The math" behind a weekly score: every day Mon-Sun with points per game; the best 5 days (bold, green) count.
function weekMath(by, start) {
  const box = el("div", "wk-wrap"), tb = el("table", "wk-math"), hd = el("tr");
  ["Day", "Five", "Groups", "Mini", "Strands", "Pts"].forEach(h => hd.appendChild(el("th", null, h))); tb.appendChild(hd);
  const map = {}; (by || []).forEach(x => map[x.d] = x);
  for (let i = 0; i < 7; i++) {
    const p = start.split("-").map(Number), dt = new Date(p[0], p[1] - 1, p[2] + i), d = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(dt.getDate()).padStart(2, "0")}`;
    if (d > KEY) break;
    const x = map[d], tr = el("tr", x ? (x.k ? "in" : "out") : "na");
    tr.appendChild(el("td", null, dt.toLocaleDateString(undefined, { weekday: "short" })));
    if (x) [x.f, x.g, x.c, x.s, x.p].forEach(v => tr.appendChild(el("td", null, String(v))));
    else { const td = el("td", null, "didn't play"); td.colSpan = 5; tr.appendChild(td); }
    tb.appendChild(tr);
  }
  const used = (by || []).filter(x => x.k).sort((a, b) => b.p - a.p), cut = (by || []).filter(x => !x.k);
  const sum = el("p", "wk-sum"); sum.innerHTML = `Best ${used.length} day${used.length === 1 ? "" : "s"}: ${used.map(x => x.p).join(" + ") || "0"} = <b>${used.reduce((a, x) => a + x.p, 0)}</b>` + (cut.length ? ` · ${cut.length} lower day${cut.length > 1 ? "s" : ""} dropped` : "");
  box.append(tb, sum); return box;
}
// A points button that opens the math right under its row.
const wkOpen = new Set();
function wkToggle(btn, li, key, by, start, tag) {
  btn.classList.add("ct-btn");
  const open = () => { const d = el(tag || "li", "wk-li"); d.appendChild(weekMath(by, start)); li.after(d); btn.classList.add("open"); return d; };
  let det = wkOpen.has(key) ? open() : null;
  btn.addEventListener("click", e => { e.stopPropagation(); if (det) { det.remove(); det = null; btn.classList.remove("open"); wkOpen.delete(key); } else { det = open(); wkOpen.add(key); } });
}
function renderLeague() {
  const box = $("league"); if (!stats) { box.hidden = true; return; }
  box.hidden = false;
  const fmt = k => { const p = k.split("-").map(Number); return new Date(p[0], p[1] - 1, p[2]).toLocaleDateString(undefined, { month: "short", day: "numeric" }); };
  $("league-range").textContent = `Since ${fmt(stats.weekStart)}`;
  const ol = $("league-list"); ol.innerHTML = "";
  if (!stats.week.length) ol.appendChild(el("li", "dim", "No points yet this week. Go get some."));
  stats.week.slice(0, 8).forEach(x => {
    const rk = 1 + stats.week.filter(y => y.pts > x.pts).length; // ties share a spot
    const li = el("li", (rk === 1 && x.pts > 0 ? "lead" : "") + (me && x.id === me.id ? " league-me" : ""));
    const nm = el("button", "nm", x.name); nm.dataset.card = x.id; nm.style.textAlign = "left";
    const ct = el(x.by ? "button" : "span", "ct", `${x.pts} pts`); li.append(el("span", "rk", rk), nm, ct); ol.appendChild(li);
    if (x.by) wkToggle(ct, li, "w:" + x.id, x.by, stats.weekStart);
  });
  renderAwards();
  const lc = $("league-champ"); lc.innerHTML = "";
  if (!stats.lastChamp) lc.textContent = "Weekly champ is crowned every Sunday night.";
  else {
    lc.append(`🏆 Last week's champ: ${stats.lastChamp.name} with `);
    const pb = el(stats.lastChamp.by ? "button" : "span", null, `${stats.lastChamp.pts} pts`); lc.append(pb);
    if (stats.lastChamp.by) { const p = stats.weekStart.split("-").map(Number), w = new Date(p[0], p[1] - 1, p[2] - 7), ws = `${w.getFullYear()}-${String(w.getMonth() + 1).padStart(2, "0")}-${String(w.getDate()).padStart(2, "0")}`; wkToggle(pb, lc, "lc", stats.lastChamp.by, ws, "div"); }
  }
}
function scoreTab(t) {
  document.querySelectorAll("#sc-tabs button").forEach(b => b.classList.toggle("on", b.dataset.tab === t));
  document.querySelectorAll("#v-scores .pane").forEach(p => p.hidden = p.dataset.pane !== t);
  const sc = document.querySelector("#v-scores .scroll"); if (sc) sc.scrollTop = 0;
}
$("home-settings").addEventListener("click", () => { show("scores"); scoreTab("more"); });
document.querySelectorAll("#sc-tabs button").forEach(b => b.addEventListener("click", () => { scoreTab(b.dataset.tab); if (b.dataset.tab === "arcade") refreshArcade(); if (b.dataset.tab === "week") loadAllTime(); }));
// All-time puzzle leaderboard (Week tab): total points, points per day, or daily wins.
let allTime = null, allTimeK = "month";
function loadAllTime() { if (!me) return; API("getAllTime", me.id, KEY).then(r => { allTime = r || []; renderAllTime(); renderPhof(); }).catch(e => { $("alltime-list").innerHTML = ""; $("alltime-list").appendChild(el("li", "dim", /newest server|not a function/i.test(errMsg(e)) ? "Turns on after the next server update." : errMsg(e))); }); }
function renderAllTime() {
  const ol = $("alltime-list"); if (!allTime) return; ol.innerHTML = "";
  if (Array.isArray(allTime)) { ol.appendChild(el("li", "dim", "Turns on after the next server update.")); return; }
  const k = allTimeK, mName = d => new Date(d + "T12:00:00").toLocaleDateString(undefined, { month: "long" });
  if (k === "champs") {
    const ch = allTime.champs || [];
    $("alltime-note").textContent = "Every weekly league champ (best 5 days, Monday to Sunday). Most titles listed first below the list.";
    $("alltime-sub").textContent = `${ch.length} week${ch.length === 1 ? "" : "s"}`;
    if (!ch.length) { ol.appendChild(el("li", "dim", "No finished weeks yet. First champ is crowned Sunday night.")); return; }
    ch.forEach(c => {
      const li = el("li", "at-row" + (c.id === (me && me.id) ? " me" : "")), nmb = el("button", "pname tap", c.name); nmb.dataset.card = c.id;
      const d = new Date(c.week + "T12:00:00"), lab = "Week of " + d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
      const left = el("span", "at-left"); left.append(el("span", "rank r1", "🏆"), nmb);
      const right = el("span", "at-right"), pb = el(c.by ? "button" : "b", null, String(c.pts)); right.append(pb, el("small", null, lab)); li.append(left, right); ol.appendChild(li);
      if (c.by) { pb.style.fontWeight = "800"; wkToggle(pb, li, "c:" + c.week, c.by, c.week); }
    });
    const tally = {}; ch.forEach(c => { tally[c.name] = (tally[c.name] || 0) + 1; });
    $("alltime-note").textContent = "Weekly league champs, newest first. Most titles: " + Object.keys(tally).sort((a, b) => tally[b] - tally[a]).slice(0, 3).map(n => `${n} ×${tally[n]}`).join(", ") + ".";
    return;
  }
  const list = (allTime[k] || []).filter(r => k !== "all" || r.days >= 3);
  $("alltime-note").textContent = k === "month" ? `${mName(allTime.monthKey)} standings: your best 20 days count, so days off won't sink you.` + (allTime.lastMonth ? ` 🏆 ${mName(allTime.lastMonth.key)} champ: ${allTime.lastMonth.name} (${allTime.lastMonth.pts}).` : "")
    : k === "year" ? `${allTime.yearKey} standings: your best 200 days count.` : "All time ranks by average points per day played (10+ days to be ranked at the top), so newer players can compete. Tap a name for their stats.";
  if (!list.length) { ol.appendChild(el("li", "dim", "No games yet.")); return; }
  list.slice(0, 25).forEach((r, i) => {
    const li = el("li" + "", r.id === (me && me.id) ? "me" : null);
    const nmb = el("button", "pname tap", r.name); nmb.dataset.card = r.id;
    const main = k === "all" ? r.avg.toFixed(1) + "/day" : String(r.pts);
    const sub = `${r.days} day${r.days === 1 ? "" : "s"} · ${r.avg.toFixed(1)}/day · 👑 ${r.wins}` + (r.titles ? ` · 🏆 ${r.titles}` : "") + (k === "all" ? ` · ${r.total} pts` : "") + (k === "all" && r.days < 10 ? " · new" : "");
    const left = el("span", "at-left"); left.append(el("span", "rank" + (i === 0 ? " r1" : ""), i + 1), nmb);
    const right = el("span", "at-right"); right.append(el("b", null, main), el("small", null, sub));
    li.className = (li.className ? li.className + " " : "") + "at-row"; li.append(left, right); ol.appendChild(li);
  });
  $("alltime-sub").textContent = k === "month" ? mName(allTime.monthKey) : k === "year" ? allTime.yearKey : `${list.length} players`;
}
// Puzzle Hall of Fame (Week tab, under Standings)
let phofK = "mini";
function renderPhof() {
  const ol = $("phof-list"); ol.innerHTML = "";
  const h = allTime && !Array.isArray(allTime) && allTime.hof; if (!h) { ol.appendChild(el("li", "dim", allTime ? "Turns on after the next server update." : "Loading…")); return; }
  const k = phofK, list = h[k] || [], medal = ["🥇", "🥈", "🥉", "4", "5"];
  $("phof-note").textContent = k === "mini" ? "Fastest Mini ever, no Check. Personal bests." : k === "strands" ? "Fastest Strands ever, no hints. Personal bests." : k === "five" ? "Best average guesses (a miss counts as 7). 7+ games to qualify. 🧠 = solved in 1 or 2." : "Fewest mistakes on average (a loss counts as 4). 7+ games to qualify. 💎 = perfect games.";
  if (!list.length) { ol.appendChild(el("li", "dim", k === "five" || k === "groups" ? "Nobody has 7 games in yet." : "No records yet.")); return; }
  list.forEach((r, i) => {
    const li = el("li", "at-row" + (r.id === (me && me.id) ? " me" : "")), nmb = el("button", "pname tap", r.name); nmb.dataset.card = r.id;
    const left = el("span", "at-left"); left.append(el("span", "rank" + (i === 0 ? " r1" : ""), medal[i]), nmb);
    const right = el("span", "at-right");
    if (k === "mini" || k === "strands") right.append(el("b", null, fmtTime(r.v)), el("small", null, new Date(r.d + "T12:00:00").toLocaleDateString(undefined, { month: "short", day: "numeric" })));
    else right.append(el("b", null, r.v.toFixed(2)), el("small", null, `${r.n} games · ${k === "five" ? "🧠" : "💎"} ${r.best}`));
    li.append(left, right); ol.appendChild(li);
  });
}
document.querySelectorAll("#phof-seg button").forEach(b => b.addEventListener("click", () => { phofK = b.dataset.k; document.querySelectorAll("#phof-seg button").forEach(x => x.classList.toggle("on", x === b)); renderPhof(); }));
document.querySelectorAll("#alltime-seg button").forEach(b => b.addEventListener("click", () => { allTimeK = b.dataset.k; document.querySelectorAll("#alltime-seg button").forEach(x => x.classList.toggle("on", x === b)); renderAllTime(); }));
const AWARDS = {
  grinder: ["🐶", "Grinder"], speed: ["⚡", "Speed Demon"], sniper: ["🧵", "Strand Sniper"], brain: ["🧠", "Big Brain"],
  sweep: ["💎", "Clean Sweep"], choke: [":dawgL:", "Biggest Choke"], merchant: ["🎯", "Shade Merchant"],
  bag: [":dawgpain:", "Punching Bag"], clapper: ["👏", "Clapback King"], fav: ["😂", "Fan Favorite"]
};
function renderAwards() {
  const box = $("awards");
  if (!stats || !stats.awards) { box.hidden = true; return; }
  const d = now.getDay(), last = (d === 1 || d === 2) && stats.lastAwards && stats.lastAwards.length;
  const list = last ? stats.lastAwards : stats.awards;
  box.hidden = false;
  $("awards-title").textContent = last ? "Last week's awards" : "Weekly awards";
  $("awards-sub").textContent = last ? "Final" : "So far · final Sunday night";
  const ul = $("awards-list"); ul.innerHTML = "";
  if (!list.length) { ul.appendChild(el("li", "dim", "Nothing yet. Play a game and grab one.")); return; }
  list.forEach(a => {
    const m = AWARDS[a.key]; if (!m) return;
    const ids = a.ids || [a.id], nms = a.names || [a.name];
    const li = el("li", "award" + (me && ids.includes(me.id) ? " mine" : ""));
    const ic = el("span", "ic"); ic.appendChild(emo(m[0], 24));
    const tx = el("div", "tx"), who = el("div");
    ids.forEach((id, i) => { if (i) who.appendChild(document.createTextNode(" & ")); const nm = el("button", null, nms[i]); nm.dataset.card = id; who.appendChild(nm); });
    tx.append(el("span", null, m[1]), who, el("small", null, a.why));
    li.append(ic, tx); ul.appendChild(li);
  });
}
const BADGES = [
  ["crowns", "👑", "Daily wins", v => v > 0],
  ["titles", "🏆", "Weekly titles", v => v > 0],
  ["genius", "🧠", "Five in 1 or 2", v => v > 0],
  ["perfectGroups", "💎", "Perfect Groups", v => v > 0],
  ["quickMini", "⚡", "Mini under 0:30", v => v > 0],
  ["quickStrands", "🧵", "Strands under 2:00, no hints", v => v > 0],
  ["bestStreak", "🔥", "Best streak (days)", v => v >= 3],
  ["perfectWeek", "💯", "Perfect week: all 4 games, 7 days", v => !!v]
];
// Stats on the player card: Wordle-style bars, times with a 14-day trend, and the last 7 days.
// On a friend's card, your own numbers show as a lighter bar underneath for comparison.
function statsBlock(s, mine, name) {
  const box = el("div", "pstats");
  box.appendChild(el("h3", "lbl2", "Stats"));
  const top = el("div", "pst-top");
  [[s.played, "Played"], [s.winPct + "%", "Five win %"], [s.cur || 0, "Streak"], [s.best || 0, "Best streak"]].forEach(([v, l]) => { const d = el("div"); d.append(el("b", null, String(v)), el("small", null, l)); top.appendChild(d); });
  box.appendChild(top);
  if (mine) box.appendChild(el("p", "sub pst-key", `Solid = ${name} · light = you`));
  const bars = (title, labels, a, b, goodIdx) => {
    const sec = el("div", "pst-sec"); sec.appendChild(el("h4", null, title));
    const max = Math.max(1, ...a, ...(b || []));
    labels.forEach((lb, i) => {
      const row = el("div", "pst-row"), track = el("div", "pst-track");
      const bar = el("div", "pst-bar" + (i >= goodIdx ? " meh" : "")); bar.style.width = Math.max(a[i] ? 8 : 0, 100 * a[i] / max) + "%"; bar.textContent = a[i] ? a[i] : ""; if (!a[i]) { bar.style.padding = "0"; bar.style.minHeight = "16px"; bar.style.background = "transparent"; }
      track.appendChild(bar);
      if (b) { const g = el("div", "pst-ghost"); g.style.width = 100 * b[i] / max + "%"; track.appendChild(g); }
      row.append(el("span", null, lb), track); sec.appendChild(row);
    });
    return sec;
  };
  box.appendChild(bars("Five: solved in", ["1", "2", "3", "4", "5", "6", "X"], s.five, mine && mine.five, 6));
  box.appendChild(bars("Groups: mistakes", ["0", "1", "2", "3", "X"], s.groups, mine && mine.groups, 4));
  const timed = (title, x, y, extra, extraY) => {
    const sec = el("div", "pst-sec"); sec.appendChild(el("h4", null, title));
    if (!x.n) { sec.appendChild(el("p", "sub", "Not played yet.")); return sec; }
    const avg = Math.round(x.sum / x.n), line = `Avg ${fmtTime(avg)} · Best ${fmtTime(x.best)} · ${extra}` + (y && y.n ? `  (you: avg ${fmtTime(Math.round(y.sum / y.n))}${extraY ? ", " + extraY : ""})` : "");
    sec.appendChild(el("p", "pst-line", line));
    const tr = x.trend; if (tr.length >= 2) {
      const W = 260, H = 44, mx = Math.max(...tr), mn = Math.min(...tr), sp = Math.max(1, mx - mn);
      const pts = tr.map((v, i) => `${(i / (tr.length - 1) * (W - 8) + 4).toFixed(1)},${(4 + (v - mn) / sp * (H - 8)).toFixed(1)}`).join(" ");
      const wrap = el("div", "pst-trend"); wrap.innerHTML = `<svg viewBox="0 0 ${W} ${H}" width="100%" height="${H}" preserveAspectRatio="none"><polyline points="${pts}" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/></svg><small>Last ${tr.length} days · higher = faster</small>`;
      sec.appendChild(wrap);
    }
    return sec;
  };
  // flip times so the line goes UP when you get faster
  const flip = x => Object.assign({}, x, { trend: x.trend.map(v => -v) });
  box.appendChild(timed("Strands", flip(s.st), mine && mine.st, `hints ${s.st.n ? Math.round(100 * s.st.hints / s.st.n) : 0}% of days`, mine && mine.st.n ? `hints ${Math.round(100 * mine.st.hints / mine.st.n)}%` : ""));
  box.appendChild(timed("Mini", flip(s.mi), mine && mine.mi, `Check ${s.mi.n ? Math.round(100 * s.mi.checks / s.mi.n) : 0}% of days`, mine && mine.mi.n ? `Check ${Math.round(100 * mine.mi.checks / mine.mi.n)}%` : ""));
  // last 7 days
  const form = el("div", "pst-sec"); form.appendChild(el("h4", null, "Last 7 days"));
  const g = el("div", "pst-form"); g.appendChild(el("span")); ["F", "G", "S", "M"].forEach(h => g.appendChild(el("small", null, h)));
  const col = v => v === 2 ? "good" : v === 1 ? "ok" : v === 0 ? "bad" : "none";
  s.form.forEach(f => {
    const dt = new Date(f.d + "T12:00:00"); g.appendChild(el("small", "pst-day", dt.toLocaleDateString(undefined, { weekday: "short" })));
    ["f", "g", "s", "c"].forEach(k => g.appendChild(el("i", "pst-sq " + col(f[k]))));
  });
  form.appendChild(g); form.appendChild(el("p", "sub pst-key", "🟩 great · 🟨 got it (more guesses, mistakes, hints or Check) · ⬛ missed · blank = didn't play"));
  box.appendChild(form);
  return box;
}
// Crew join requests: the owner answers from the bell or the Crews screen.
function joinButtons(reqId, who, crew) {
  const row = el("div", "inrow"), yes = el("button", "pill solid", "Let them in"), no = el("button", "pill", "No thanks");
  const go = ok => { yes.disabled = no.disabled = true; API("answerJoin", me.id, reqId, ok, KEY).then(r => { setCrews(r.crews); shade = r.shade; renderBell(); row.replaceWith(el("small", null, ok ? `✓ ${who} is in ${crew || "the crew"}` : "Request closed")); if (ok) toast(`${who} joined ${crew || "the crew"} 🐶`, 2000); }).catch(e => { yes.disabled = no.disabled = false; toast(errMsg(e), 2400); }); };
  yes.addEventListener("click", e => { e.stopPropagation(); go(true); }); no.addEventListener("click", e => { e.stopPropagation(); go(false); });
  row.append(yes, no); return row;
}
function addToCrewBtn(crewId, crewName, id, name, after) {
  const b = el("button", "pill solid", `➕ Add ${name} to ${crewName}`);
  b.addEventListener("click", e => { e.stopPropagation(); b.disabled = true; API("addToCrew", me.id, crewId, id, KEY).then(r => { setCrews(r.crews); b.textContent = `✓ ${name} is in ${crewName}`; b.className = "pill"; toast(`${name} added to ${crewName} 🐶`, 2000); if (crewSel === crewId) { switchCrew("all"); switchCrew(crewId); } if (after) after(); }).catch(err => { b.disabled = false; toast(errMsg(err), 2400); }); });
  return b;
}
function askButtons(c) {
  const box = el("div", "col");
  (c.canAdd || []).forEach(k => box.appendChild(addToCrewBtn(k.id, k.name, c.id, c.name)));
  (c.canAsk || []).forEach(k => {
    const b = el("button", k.asked ? "pill" : "pill solid", k.asked ? `Asked to join ${k.name} ✓` : `🙋 Ask to join ${k.name}`); b.disabled = !!k.asked;
    b.addEventListener("click", () => { b.disabled = true; API("requestJoin", me.id, k.id, KEY).then(() => { b.textContent = `Asked to join ${k.name} ✓`; b.className = "pill"; toast("Request sent. The crew owner decides.", 2200); }).catch(e => { b.disabled = false; toast(errMsg(e), 2400); }); });
    box.appendChild(b);
  });
  return box;
}
function openCard(id) {
  if (!me) return;
  const p = playerInfo(id), isMe = id === me.id;
  const body = el("div", "stack"); body.appendChild(el("p", "sub", "Loading trophies…"));
  openModal([el("h2", null, isMe ? "Your trophy case" : p.name), body]);
  API("getPlayerCard", me.id, id, KEY).then(c => {
    body.innerHTML = "";
    const b = c.badges;
    body.appendChild(el("p", "sub", `${b.played} day${b.played === 1 ? "" : "s"} played`));
    const grid = el("div", "badges");
    BADGES.forEach(([k, icon, label, earned]) => {
      const v = b[k], d = el("div", "badge" + (earned(v) ? "" : " off"));
      const txt = el("span", null, label); txt.appendChild(el("small", null, typeof v === "boolean" ? (v ? "Earned" : "Locked") : String(v)));
      d.append(el("b", null, icon), txt); grid.appendChild(d);
    });
    body.appendChild(grid);
    if ((c.canAsk && c.canAsk.length) || (c.canAdd && c.canAdd.length)) body.appendChild(askButtons(c));
    if (c.stats) body.appendChild(statsBlock(c.stats, c.mine, isMe ? null : c.name));
    if (c.h2h) {
      const h = c.h2h, tot = [0, 1, 2].map(i => h.five[i] + h.groups[i] + h.mini[i] + h.strands[i]);
      const box = el("div", "h2h");
      box.appendChild(el("h3", "lbl2", `You vs ${c.name}, all time`));
      box.appendChild(el("div", "big", `${tot[0]}–${tot[1]}` + (tot[2] ? `–${tot[2]}` : "")));
      box.appendChild(el("p", "sub", tot[0] + tot[1] + tot[2] === 0 ? "No games head-to-head yet." : tot[0] > tot[1] ? `You own ${c.name}. For now.` : tot[0] < tot[1] ? `${c.name} has your number.` : "Dead even. Settle it today."));
      [["five", "Five"], ["groups", "Groups"], ["strands", "Strands"], ["mini", "Mini"]].forEach(([k, label]) => {
        const r = el("div", "row2"); r.append(el("span", null, label), el("b", null, `${h[k][0]}–${h[k][1]}` + (h[k][2] ? `–${h[k][2]}` : ""))); box.appendChild(r);
      });
      body.appendChild(box);
      if (shadeLoaded && beating(id)) { const sb = el("button", "pill solid", `🎯 Throw shade at ${c.name}`); sb.addEventListener("click", () => { closeModal(); setTimeout(() => openShade(id), 50); }); body.appendChild(sb); }
    }
  }).catch(e => { body.innerHTML = ""; body.appendChild(el("p", "sub", errMsg(e))); });
}
document.addEventListener("click", e => { const b = e.target.closest("[data-card]"); if (b) openCard(b.dataset.card); });
document.addEventListener("click", e => { const b = e.target.closest("[data-dawgs]"); if (b) openDawgPicker(b.dataset.dawgs); });
// Emoji reactions on today's scores.
const REACTS = ["😂", "🔥", "💀", "👏", "🤡"];
function reactBar(x) {
  const p = (board && board.players.find(q => q.id === x.id)) || {};
  const r = p.r || {}, rm = p.rm || [];
  const bar = el("div", "reacts");
  const used = Object.keys(r).filter(e => r[e] && isDawg(e));
  const chip = (tag, e, n) => { const c = el(tag, tag === "button" && rm.includes(e) ? "on" : ""); c.appendChild(emo(e, 18)); if (n) c.appendChild(document.createTextNode(String(n))); return c; };
  if (x.id === me.id || !isMate(x.id)) {
    REACTS.concat(used).filter(e => r[e]).forEach(e => bar.appendChild(chip("span", e, r[e])));
    return bar;
  }
  if (!doneCount(x)) return bar;
  REACTS.concat(used).forEach(e => {
    const b = chip("button", e, r[e]);
    b.dataset.react = e; b.dataset.to = x.id; b.setAttribute("aria-label", `React ${e} to ${x.name}`);
    bar.appendChild(b);
  });
  const more = el("button", "more"); more.append(emo(":dawgpog:", 18), document.createTextNode("+")); more.dataset.dawgs = x.id; more.setAttribute("aria-label", `More reactions for ${x.name}`); bar.appendChild(more);
  return bar;
}
document.addEventListener("click", e => {
  const b = e.target.closest("[data-react]"); if (!b || !me) return;
  const emoji = b.dataset.react, to = b.dataset.to;
  const p = board && board.players.find(q => q.id === to); if (!p) return;
  p.r = p.r || {}; p.rm = p.rm || [];
  if (p.rm.includes(emoji)) { p.rm = p.rm.filter(x => x !== emoji); p.r[emoji] = Math.max(0, (p.r[emoji] || 1) - 1); if (!p.r[emoji]) delete p.r[emoji]; }
  else { p.rm.push(emoji); p.r[emoji] = (p.r[emoji] || 0) + 1; chime("pop"); }
  renderScores(); if (b.closest(".dawggrid")) closeModal();
  API("react", me.id, to, KEY, emoji).then(nb => { board = nb; if (active === "scores") renderScores(); }).catch(err => toast(errMsg(err), 2200));
});
$("opt-fx").checked = fxOn();
$("opt-fx").addEventListener("change", e => { store.set("bdd:fx", e.target.checked ? 1 : 0); if (e.target.checked) { chime("pop"); confetti(30); } });


