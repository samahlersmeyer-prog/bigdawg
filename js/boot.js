// ================= IDENTITY & BOOT =================
function newId() { const a = "abcdefghijkmnpqrstuvwxyz23456789"; let s = ""; const r = new Uint32Array(16); crypto.getRandomValues(r); r.forEach(x => s += a[x % a.length]); return s; }
function splashMode(mode) { $("splash").hidden = mode === "none"; $("splash-load").hidden = mode !== "load"; $("who").hidden = mode !== "who"; $("pin-form").hidden = mode !== "pin"; $("join-form").hidden = mode !== "join"; $("confirm").hidden = mode !== "confirm"; }
function signedIn(r) { setMe(r); afterIdentity(); }
// "Who's playing?": tap your name, then your PIN. New players add a name and PIN.
let whoList = [], pinFor = null;
function showWho() {
  splashMode("load");
  return API("listPlayers").then(list => {
    whoList = list || [];
    if (!whoList.length) { showJoin(); return; }
    $("who-q").value = ""; drawWho();
    splashMode("who");
    setTimeout(() => $("who-q").focus(), 60);
  }).catch(() => showJoin());
}
// Type a few letters of your name instead of scrolling a long list.
function drawWho() {
  const box = $("who-list"); box.innerHTML = "";
  const q = $("who-q").value.trim().toLowerCase();
  const all = whoList.slice().sort((a, b) => a.name.localeCompare(b.name));
  const few = all.length <= 6;
  const hits = q ? all.filter(p => p.name.toLowerCase().startsWith(q)).concat(all.filter(p => !p.name.toLowerCase().startsWith(q) && p.name.toLowerCase().includes(q))) : few ? all : [];
  hits.slice(0, 8).forEach(p => {
    const b = el("button", null, p.name); b.type = "button";
    b.addEventListener("click", () => showPin(p));
    box.appendChild(b);
  });
  $("who-hint").textContent = q && !hits.length ? "No one by that name yet. Tap \u201cI'm new here\u201d below." : !q && !few ? `${all.length} players. Type your name to find yours.` : "";
}
$("who-q").addEventListener("input", drawWho);
$("who-q").addEventListener("keydown", e => { if (e.key === "Enter") { const b = $("who-list").querySelector("button"); if (b) b.click(); } });
function showPin(p) {
  pinFor = p;
  $("pin-q").textContent = p.hasPin ? `Hi ${p.name}! Enter your PIN` : `Hi ${p.name}! Pick a 4-digit PIN`;
  $("pin-sub").textContent = p.hasPin ? "Forgot it? Ask Sam to clear it on the Players tab." : "You'll use it if the app ever forgets you. It keeps anyone else from playing as you.";
  $("pin-msg").textContent = ""; $("pin-in").value = "";
  splashMode("pin"); setTimeout(() => $("pin-in").focus(), 50);
}
function showJoin() { splashMode("join"); $("join-back").hidden = !whoList.length; setTimeout(() => $("join-name").focus(), 50); }
$("who-new").addEventListener("click", showJoin);
$("pin-back").addEventListener("click", showWho);
$("join-back").addEventListener("click", showWho);
const goodPin = v => /^\d{4}$/.test(v);
$("pin-form").addEventListener("submit", ev => {
  ev.preventDefault();
  const v = $("pin-in").value.trim(), msg = $("pin-msg");
  if (!goodPin(v)) { msg.textContent = "Your PIN is 4 numbers."; return; }
  $("pin-go").disabled = true; msg.textContent = "Checking…";
  API("claimPlayer", pinFor.id, v).then(signedIn)
    .catch(e => { msg.textContent = errMsg(e); $("pin-in").value = ""; }).finally(() => { $("pin-go").disabled = false; });
});
$("join-form").addEventListener("submit", ev => {
  ev.preventDefault();
  const v = $("join-name").value.trim(), pin = $("join-pin").value.trim(), msg = $("join-msg");
  if (!v) { msg.textContent = "Type a name your friends will recognize."; return; }
  if (!goodPin(pin)) { msg.textContent = "Pick a PIN: 4 numbers."; return; }
  $("join-go").disabled = true; msg.textContent = "Joining…";
  API("register", newId(), v, pin).then(signedIn)
    .catch(e => { msg.textContent = errMsg(e); }).finally(() => { $("join-go").disabled = false; });
});
function setMe(r) { me = { id: r.id, name: r.name }; store.set("bdd:me", me); rememberInUrl(me.id); }
function confirmWho(who) {
  splashMode("confirm");
  $("confirm-q").textContent = `Welcome back! Are you ${who.name}?`;
  $("confirm-yes").textContent = `Yes, I'm ${who.name}`;
  return new Promise(res => {
    $("confirm-yes").onclick = () => res(true);
    $("confirm-no").onclick = () => { forgetUrl(); res(false); };
  });
}
async function loadState() {
  const local = store.get(skey());
  let remote = null;
  if (me) { try { const r = await API("loadProgress", me.id, KEY); if (r) remote = JSON.parse(r); } catch (e) {} }
  const st = mergeState(local, remote) || freshState();
  const fresh = freshState();
  GAMES.forEach(g => { if (!st[g]) st[g] = fresh[g]; });
  return st;
}
let started = false;
async function afterIdentity() {
  // If this phone already has today's progress, open right away and sync with the server in the background.
  const local = store.get(skey());
  if (me) {
    primeBoot();
    const ok = local && local.v === 2 && local.pid === PID;
    const st = ok ? local : freshState(), fresh = freshState(); GAMES.forEach(g => { if (!st[g]) st[g] = fresh[g]; });
    S = st; store.set(skey(), S);
    const cb = store.get("bdd:board"); if (cb && cb.k === KEY && cb.c === crewSel && !board) board = cb.b;
    const cs = store.get("bdd:stats"); if (cs && cs.k === KEY && cs.c === crewSel && !stats) stats = cs.s;
    joinPending();
    if (!started) start(); else { renderBoard(); colorKeyboard(); renderGroups(); stPath = []; show(active); }
    splashMode("none");
    refreshBoard();
    API("loadProgress", me.id, KEY).then(r => {
      if (!r) return;
      const rem = JSON.parse(r), merged = mergeState(S, rem); // merge with whatever you've done since opening
      if (merged && merged.five && merged.five.guesses && merged.five.guesses.length && rem && rem.five && !rem.five.fin && fiveDoneByGuesses()) save(); // put this phone's real board back on the server
      if (!merged || JSON.stringify(merged) === JSON.stringify(S)) return;
      GAMES.forEach(g => { if (!merged[g]) merged[g] = S[g]; });
      S = merged; store.set(skey(), S); save();
      renderBoard(); colorKeyboard(); renderGroups(); show(active);
    }).catch(() => {});
    return;
  }
  splashMode("load");
  const st = await loadState();
  S = st; store.set(skey(), S); save();
  if (!started) start(); else { renderBoard(); colorKeyboard(); renderGroups(); stPath = []; show(active); }
  splashMode("none");
  refreshBoard();
}
function start() {
  started = true;
  buildKeyboard($("keyboard"), true); buildKeyboard(miniKb, false);
  colorKeyboard(); renderBoard(); renderGroups();
  let v = "home"; try { const s = sessionStorage.getItem("bdd:view"); if (VIEWS.includes(s)) v = s; } catch (e) {}
  show(v);
}
async function boot() {
  me = store.get("bdd:me");
  if (!me) {
    const params = await getUrlParams();
    if (params.p) {
      try { const who = await API("whoami", params.p); if (who && await confirmWho(who)) setMe(who); } catch (e) {}
    }
  } else rememberInUrl(me.id);
  if (!me) { if (hasServer() || STATIC) { showWho(); return; } }
  await afterIdentity();
}
boot();
