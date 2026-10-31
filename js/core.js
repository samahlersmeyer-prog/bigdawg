const APP_URL = "https://samahlersmeyer-prog.github.io/bigdawg/".indexOf("__") !== 0 ? "https://samahlersmeyer-prog.github.io/bigdawg/" : "__APP_URL__".indexOf("__") === 0 ? "" : "__APP_URL__";

// ---------- date & puzzle ----------
const EPOCH = Date.UTC(2026, 9, 6);
const now = new Date();
const Y = now.getFullYear(), M = now.getMonth(), D = now.getDate();
const DAY = Math.round((Date.UTC(Y, M, D) - EPOCH) / 864e5);
const NUM = DAY + 1;
const KEY = `${Y}-${String(M + 1).padStart(2, "0")}-${String(D).padStart(2, "0")}`;
const mod = (a, n) => ((a % n) + n) % n;
const ANSWER = ANSWERS[mod(DAY, ANSWERS.length)].toUpperCase();
const PUZ = PUZZLES[mod(DAY, PUZZLES.length)];
const LEVEL = {}; PUZ.forEach((g, i) => g[1].forEach(w => LEVEL[w] = i));
const CW = MINIS[mod(DAY, MINIS.length)];
const SP = STRANDS[mod(DAY, STRANDS.length)];
function rng(seed) { return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
function shuffle(arr, r = Math.random) { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
const $ = id => document.getElementById(id);
const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };
// Big Dawg emote pack: original cartoon bulldog faces, drawn as tiny SVGs.
const DAWG_INK = "#2b1a10";
const DAWG_PARTS = {
  ears: '<path d="M16 18Q4 12 3 22Q4 28 11 25Z" fill="#8a5a3b"/><path d="M48 18Q60 12 61 22Q60 28 53 25Z" fill="#8a5a3b"/>',
  head: '<path d="M32 12C49 12 58 21 58 34C58 48 49 58 32 58C15 58 6 48 6 34C6 21 15 12 32 12Z" fill="#dca26a"/><path d="M28 18q4 2 8 0M29 22q3 1.5 6 0" fill="none" stroke-width="1.8"/>',
  patch: '<path d="M39 14C47 15 54 20 56 28C51 30 45 28 42 22Z" fill="#b97a48" stroke="none"/>',
  muzzle: '<path d="M32 34C45 34 54 40 54 47C54 54 47 58 41 56Q32 61 23 56C17 58 10 54 10 47C10 40 19 34 32 34Z" fill="#f5dcbc"/>',
  nose: '<path d="M26 39Q32 35 38 39Q36 44 32 44Q28 44 26 39Z" fill="' + DAWG_INK + '"/>',
  eyes: '<circle cx="22" cy="29" r="3.2" fill="' + DAWG_INK + '" stroke="none"/><circle cx="42" cy="29" r="3.2" fill="' + DAWG_INK + '" stroke="none"/>',
  wide: '<circle cx="22" cy="28" r="6" fill="#fff"/><circle cx="42" cy="28" r="6" fill="#fff"/><circle cx="22" cy="28.5" r="2.2" fill="' + DAWG_INK + '" stroke="none"/><circle cx="42" cy="28.5" r="2.2" fill="' + DAWG_INK + '" stroke="none"/>'
};
const DAWGS = {
  dawgW: { name: "W", face: '<path d="M12 25H52V30Q52 35 44 35Q37 35 35 29H29Q27 35 20 35Q12 35 12 30Z" fill="' + DAWG_INK + '"/><path d="M16 27h6" stroke="#fff" stroke-width="1.6"/><path d="M38 27h6" stroke="#fff" stroke-width="1.6"/><path d="M23 53Q32 50 41 53" fill="none"/><path d="M25 53l1.5-5l1.5 4M36 53l1.5-5l1.5 4" fill="#fff" stroke-width="1.6"/>' },
  dawgL: { name: "L", face: '<path d="M17 30Q22 26 27 30M37 30Q42 26 47 30" fill="none"/><path d="M19 32Q16 44 18 54" stroke="#5fb2ff" stroke-width="4" fill="none"/><path d="M45 32Q48 44 46 54" stroke="#5fb2ff" stroke-width="4" fill="none"/><path d="M25 53Q32 45 39 53Z" fill="' + DAWG_INK + '"/>' },
  dawgcope: { name: "cope", face: '<path d="M17 30Q22 25 27 30M37 30Q42 25 47 30" fill="none"/><path d="M22 47Q32 56 42 47Z" fill="#fff"/><path d="M27 48.5v3.5M32 49v4.5M37 48.5v3.5" stroke-width="1.5"/><path d="M48 34q2 5 0 7q-3-2 0-7z" fill="#5fb2ff" stroke-width="1.5"/>' },
  dawgsweat: { name: "sweat", face: DAWG_PARTS.wide + '<path d="M24 51q2-3 4 0t4 0t4 0t4 0" fill="none" stroke-width="2.2"/><path d="M53 13q4 7 1 10q-5-2-1-10z" fill="#5fb2ff" stroke-width="1.6"/><path d="M58 24q3 5 1 7q-4-1-1-7z" fill="#5fb2ff" stroke-width="1.6"/>' },
  dawgpog: { name: "pog", face: DAWG_PARTS.wide + '<path d="M15 19l9-3M49 19l-9-3" fill="none"/><ellipse cx="32" cy="51" rx="5" ry="6" fill="' + DAWG_INK + '"/>' },
  dawgpain: { name: "pain", face: '<path d="M17 30Q22 26 27 30M37 30Q42 26 47 30" fill="none"/><path d="M19 32Q15 44 17 55" stroke="#5fb2ff" stroke-width="4.5" fill="none"/><path d="M45 32Q49 44 47 55" stroke="#5fb2ff" stroke-width="4.5" fill="none"/><path d="M24 54Q32 44 40 54Z" fill="' + DAWG_INK + '"/><g transform="rotate(-22 9 18)"><path d="M3.5 28V14Q3.5 6 9 6Q14.5 6 14.5 14V28Z" fill="#dca26a"/><path d="M6.5 9v3M9 8.5v3.5M11.5 9v3" fill="none" stroke-width="1.5"/></g><g transform="rotate(22 55 18)"><path d="M49.5 28V14Q49.5 6 55 6Q60.5 6 60.5 14V28Z" fill="#dca26a"/><path d="M52.5 9v3M55 8.5v3.5M57.5 9v3" fill="none" stroke-width="1.5"/></g>' },
  dawgclown: { name: "clown", face: '<path d="M8 15q-6-4-2-10q4 2 6 4q0-6 6-6q0 5-2 8z" fill="#ff5d9e"/><path d="M56 15q6-4 2-10q-4 2-6 4q0-6-6-6q0 5 2 8z" fill="#5fb2ff"/><path d="M16 26l5-6l5 6l-5 6z" fill="#fff"/><path d="M38 26l5-6l5 6l-5 6z" fill="#fff"/>' + DAWG_PARTS.eyes + '<path d="M22 49Q32 58 42 49" fill="none" stroke="#e23b3b" stroke-width="3.2"/><circle cx="32" cy="40" r="6" fill="#e23b3b"/>' },
  dawgsus: { name: "sus", face: '<path d="M16 29h12" fill="none"/><path d="M36 20l12 3" fill="none"/><circle cx="42" cy="30" r="3.2" fill="' + DAWG_INK + '" stroke="none"/><path d="M24 53h16" fill="none"/><path d="M25 53l1.5-5l1.5 4M36 53l1.5-5l1.5 4" fill="#fff" stroke-width="1.6"/>' },
  dawgskull: { name: "dead", face: '<path d="M18 25l8 8M26 25l-8 8M38 25l8 8M46 25l-8 8" fill="none"/><path d="M24 49h14" fill="none"/><path d="M33 49v5q0 4 4 4t4-4v-5" fill="#ff7aa8"/>' }
};
const DAWG_KEYS = Object.keys(DAWGS);
const isDawg = c => !!DAWGS[String(c || "").replace(/:/g, "")];
function dawgSvg(code, px) {
  const d = DAWGS[String(code).replace(/:/g, "")]; if (!d) return "";
  const nose = code.indexOf("clown") >= 0 ? "" : DAWG_PARTS.nose;
  const eyes = /dawg(W|L|cope|sweat|pog|pain|clown|sus|skull)/.test(code) ? "" : DAWG_PARTS.eyes;
  return `<svg class="dawg" viewBox="0 0 64 64" width="${px}" height="${px}" aria-hidden="true"><g stroke="${DAWG_INK}" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round">${DAWG_PARTS.ears}${DAWG_PARTS.head}${DAWG_PARTS.patch}${DAWG_PARTS.muzzle}${nose}${eyes}${d.face}</g></svg>`;
}
// Any reaction or clap-back code as an element: a dawg face or a plain emoji.
function emo(code, px = 22) {
  const s = el("span", "emo");
  if (isDawg(code)) { s.innerHTML = dawgSvg(code, px); s.title = code; s.setAttribute("aria-label", code); }
  else s.textContent = code;
  return s;
}

// ---------- storage & server ----------
const store = {
  get(k) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : null; } catch (e) { return null; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} },
  del(k) { try { localStorage.removeItem(k); } catch (e) {} }
};
const hasServer = () => !!(window.google && google.script && google.script.run);
// When the page is hosted outside Google (GitHub Pages), it talks to the script's JSON API instead.
const FAST_URL = "https://samahlersmeyer-prog.github.io/bigdawg/".indexOf("__") === 0 ? "" : "https://samahlersmeyer-prog.github.io/bigdawg/"; // the GitHub Pages copy, once it exists
const fastLink = () => { let id = ""; try { const m = JSON.parse(localStorage.getItem("bdd:me") || "null"); id = (m && m.id) || ""; } catch (e) {} try { if (me && me.id) id = me.id; } catch (e) {} return FAST_URL + (id ? "?p=" + encodeURIComponent(id) : ""); };
if (FAST_URL && window.google && google.script && google.script.run) { const a = document.getElementById("fast-splash"); if (a) { a.href = fastLink(); a.hidden = false; } }
const SERVER_URL = "https://script.google.com/macros/s/AKfycbxPfcr0_vWObUwDG5-ZjuVAmiCNNFqTXo38-YpkEPfOcsEq6iehAkjhtPNVf0Az_rh_/exec".indexOf("__") === 0 ? "" : "https://script.google.com/macros/s/AKfycbxPfcr0_vWObUwDG5-ZjuVAmiCNNFqTXo38-YpkEPfOcsEq6iehAkjhtPNVf0Az_rh_/exec";
const STATIC = !hasServer() && !!SERVER_URL;
function callServer(fn, ...args) {
  if (hasServer()) { window.__crew = crewSel; window.__me = me ? me.id : ""; }
  if (hasServer()) return new Promise((resolve, reject) => google.script.run.withSuccessHandler(resolve).withFailureHandler(reject)[fn](...args));
  if (!SERVER_URL) return Promise.reject(new Error("offline"));
  const ctl = window.AbortController ? new AbortController() : null;
  const t = ctl && setTimeout(() => ctl.abort(), 25000);
  return fetch(SERVER_URL, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify({ fn, args, crew: crewSel, me: me ? me.id : "" }), redirect: "follow", signal: ctl && ctl.signal })
    .then(r => r.json())
    .then(j => { if (t) clearTimeout(t); if (!j || !j.ok) throw new Error((j && j.error) || "offline"); return j.result; })
    .catch(e => { if (t) clearTimeout(t); throw (e && e.name === "AbortError") ? new Error("offline") : e; });
}
// The first calls after opening are answered by one combined bootData request.
let PRIME = null;
function primeBoot() {
  if (!me) return;
  const p = callServer("bootData", me.id, KEY);
  const pick = k => p.then(r => { if (!r || !(k in r) || (r[k] === null && k !== "progress")) throw new Error("miss"); return r[k]; });
  PRIME = { loadProgress: pick("progress"), getBoard: pick("board"), getShadeState: pick("shade"), getStats: pick("stats") };
  p.then(r => { if (r && r.crews) setCrews(r.crews, r.crew); }).catch(() => {});
  Object.values(PRIME).forEach(x => x.catch(() => {}));
}
const API = (fn, ...args) => {
  if (PRIME && PRIME[fn]) { const pr = PRIME[fn]; delete PRIME[fn]; return pr.catch(() => callServer(fn, ...args)); }
  return callServer(fn, ...args);
};
const errMsg = e => (e && e.message && /is not a function/.test(e.message)) ? "This needs the newest server update. Ask Sam to deploy a new version." : (e && e.message && e.message !== "offline") ? e.message.replace(/^Exception:\s*/, "") : "Couldn't reach the scoreboard. Check your connection and try again.";
function getUrlParams() {
  return new Promise(res => {
    try { if (hasServer() && google.script.url) google.script.url.getLocation(loc => res((loc && loc.parameter) || {})); else res(Object.fromEntries(new URLSearchParams(location.search))); }
    catch (e) { res({}); }
    setTimeout(() => res({}), 2500);
  });
}
function rememberInUrl(id) { try { if (hasServer() && google.script.history) google.script.history.replace(null, { p: id }); else if (STATIC) history.replaceState(null, "", location.pathname + "?p=" + encodeURIComponent(id)); } catch (e) {} }
function forgetUrl() { try { if (hasServer() && google.script.history) google.script.history.replace(null, {}); else if (STATIC) history.replaceState(null, "", location.pathname); } catch (e) {} }

const skey = () => "bdd2:" + KEY + ":" + (me ? me.id : "anon");
let S = null, me = null;
// Crews: invite-only groups. crewSel is the crew the scoreboard is showing ("all" = everyone, "" = my first crew).
let crews = store.get("bdd:crews") || [], crewSel = store.get("bdd:crewSel");
if (typeof crewSel !== "string") crewSel = "";
try { const inv = new URLSearchParams(location.search).get("crew"); if (inv) store.set("bdd:pendcrew", inv.toUpperCase()); } catch (e) {}
// Tags saved progress with today's puzzle set, so progress from a swapped-out puzzle is never reused.
const PID = [ANSWER, PUZ[0][0], CW.a[0], SP.t].join("|");
const freshState = () => ({
  v: 2, pid: PID,
  five: { guesses: [] },
  groups: { order: shuffle(PUZ.flatMap(g => g[1]), rng(DAY * 7919 + 13)), solved: [], history: [], tried: [], mistakes: 0 },
  mini: { fill: Array(25).fill(""), el: 0, started: false, done: false, checked: false, wrong: [] },
  strands: { found: [], hints: [], bonus: [], el: 0, started: false, done: false }
});
// Every change goes to the server right away (one request at a time, latest state wins), so
// leaving the app or switching phones never loses progress.
let syncBusy = false, syncDirty = false, syncRetry = null;
function save() {
  if (S && S.five && S.five.guesses && (S.five.guesses.includes(ANSWER) || S.five.guesses.length >= 6)) S.five.fin = true;
  store.set(skey(), S);
  if (!me) return;
  syncDirty = true; pumpSync();
}
function pumpSync() {
  if (syncBusy || !syncDirty || !me || !S) return;
  syncBusy = true; syncDirty = false; clearTimeout(syncRetry);
  API("saveProgress", me.id, KEY, JSON.stringify(S))
    .then(() => { syncBusy = false; pumpSync(); })
    .catch(() => { syncBusy = false; syncDirty = true; syncRetry = setTimeout(pumpSync, 5000); });
}
// The furthest-along copy of each game wins (same rule the server uses).
const GAMES = ["five", "groups", "mini", "strands"];
function gameRank(g, x) {
  if (!x) return -1;
  if (g === "five") return ((x.fin || (x.guesses || []).includes(ANSWER) || (x.guesses || []).length >= 6) ? 2000 : x.locked ? 1000 : 0) + (x.guesses || []).length; // a real finished board beats a colors-only one
  if (g === "groups") return (((x.solved || []).length === 4 || x.mistakes >= 4) ? 1000 : 0) + (x.history || []).length;
  const done = x.done ? 1e9 : 0, el = Number(x.el) || 0;
  if (g === "mini") return done + (x.fill || []).filter(Boolean).length * 1e5 + (x.started ? 1 : 0) + el / 1e4;
  return done + ((x.found || []).length + (x.hints || []).length) * 1e5 + (x.started ? 1 : 0) + el / 1e4;
}
function mergeState(a, b) {
  const ok = x => x && x.v === 2 && x.pid === PID;
  if (!ok(a)) return ok(b) ? b : null;
  if (!ok(b)) return a;
  const out = { v: 2, pid: PID };
  GAMES.forEach(g => { out[g] = gameRank(g, a[g]) >= gameRank(g, b[g]) ? a[g] : b[g]; });
  return out;
}

// ---------- toast & modal ----------
let toastT;
function toast(msg, ms = 1400) { const t = $("toast"); t.textContent = msg; t.hidden = false; clearTimeout(toastT); toastT = setTimeout(() => t.hidden = true, ms); }
let modalOnClose = null;
function openModal(nodes, onClose) {
  const body = $("modal-body"); body.innerHTML = ""; body.append(...nodes);
  $("modal").hidden = false; modalOnClose = onClose || null;
  syncTimer();
}
function closeModal() { $("modal").hidden = true; const f = modalOnClose; modalOnClose = null; syncTimer(); if (f) f(); setTimeout(maybeServe, 400); }
$("modal-close").addEventListener("click", closeModal);
$("modal").addEventListener("click", e => { if (e.target === $("modal")) closeModal(); });

// ---------- navigation ----------
const VIEWS = ["home", "five", "groups", "strands", "mini", "scores", "zoomies", "snake", "fetch", "arcade", "sports", "den", "game"];
let active = "home", lastGame = "home";
function show(name) {
  if (name === "back") name = lastGame;
  if (name !== "scores") lastGame = name;
  active = name;
  VIEWS.forEach(v => $("v-" + v).hidden = v !== name);
  if (name === "home") renderHome();
  if (name === "scores") scoresShown();
  if (name === "mini") miniShown();
  if (name === "strands") strandsShown();
  if (name === "five") renderBoard();
  if (name === "groups") renderGroups();
  if (name === "zoomies") zShown(); else zHidden();
  if (name === "snake") sShown(); else sHidden();
  if (name === "fetch") fShown(); else fHidden();
  if (name === "game") gShown(); else if (typeof gHidden === "function") gHidden();
  if (name === "arcade") renderArcHub("arcade");
  if (name === "sports") renderArcHub("sports");
  if (name === "den") renderArcHub("den");
  syncTimer();
  try { sessionStorage.setItem("bdd:view", name); } catch (e) {}
  setTimeout(maybeServe, 350);
}
document.addEventListener("click", e => {
  const go = e.target.closest("[data-go]"); if (go) { show(go.dataset.go); return; }
  const h = e.target.closest("[data-help]"); if (h) { openHelp(h.dataset.help); return; }
  const r = e.target.closest("[data-results]"); if (r) { openResults(r.dataset.results); return; }
});

