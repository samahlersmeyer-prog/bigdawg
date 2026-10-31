// ================= ARCADE: ZOOMIES =================
// A one-tap flyer. Just for fun: it never touches the daily scoreboard, league, awards or streaks.
// ---------- shared arcade bits ----------
const ARC = {
  zoomies: { name: "Zoomies", icon: ":dawgpog:", how: "Tap anywhere to flap. Fly through the gaps, don't touch the bones." },
  snake: { name: "Long Dawg", icon: "🦴", how: "Swipe to steer. Eat bones to grow longer. Don't hit the fence or your own tail." },
  fetch: { name: "Fetch Breakout", icon: "🎾", how: "Drag to move the dog bed. Tap to launch the ball. Smash every treat brick and don't let the ball get by you." }
};
function parseDare(text) { const m = String(text).match(/^(?:([a-z]+):)?(\d+)(.*)$/) || []; const game = ARC[m[1]] ? m[1] : "zoomies"; return { game, target: Number(m[2]) || 0, rest: (m[2] || "0") + (m[3] || "") }; }
let aDares = (store.get("bdd:dares") || []).map(d => Object.assign({ game: "zoomies" }, d)), aDare = null, arcade = null, arcTab = "zoomies";
const aBest = Object.assign({ zoomies: Number(store.get("bdd:zbest")) || 0, snake: 0, fetch: 0 }, store.get("bdd:abest") || {});
// Oct 10 glitch: other games' scores were filed under Zoomies. Real Zoomies runs never get near 300.
if (aBest.zoomies > 300) { aBest.zoomies = 0; store.set("bdd:zbest", 0); store.set("bdd:abest", aBest); }
// Golf is lower-is-better (strokes); everything else is higher-is-better.
const lowG = g => !!(typeof GAMEDEFS !== "undefined" && GAMEDEFS[g] && GAMEDEFS[g].low);
const fmtG = (g, n) => (typeof GAMEDEFS !== "undefined" && GAMEDEFS[g] && GAMEDEFS[g].fmt && n > 0) ? GAMEDEFS[g].fmt(n) : String(n || 0);
const betterG = (g, a, b) => lowG(g) ? (a > 0 && (!(b > 0) || a < b)) : a > b;
function setBest(g, v) { if (betterG(g, v, aBest[g] || 0)) { aBest[g] = v; store.set("bdd:abest", aBest); return true; } return false; }
// Arcade bests and saved dares live on the phone, so tie them to whoever is signed in:
// if a different player signs in on this phone, start them clean (their real bests come back from the server).
function ownLocal() {
  if (!me) return;
  if (store.get("bdd:aowner") !== me.id) {
    if (store.get("bdd:aowner")) { aDares = []; Object.keys(aBest).forEach(k => aBest[k] = 0); store.set("bdd:dares", aDares); store.set("bdd:abest", aBest); store.set("bdd:zbest", 0); }
    store.set("bdd:aowner", me.id);
  }
  const n = aDares.length; aDares = aDares.filter(d => d.from !== me.id);
  if (aDares.length !== n) store.set("bdd:dares", aDares);
  if (aDare && aDare.from === me.id) aDare = null;
}
function dropDare(d) { aDares = aDares.filter(x => x.id !== d.id); store.set("bdd:dares", aDares); renderArcSub(); }
// Medals: bronze / silver / gold score targets per game (golf: strokes, lower is better).
const MEDALS = { zoomies: [10, 30, 60], snake: [10, 25, 45], fetch: [500, 1500, 3500], pupman: [1000, 3000, 6000], putt: [330, 380, 420], putt18: [650, 750, 830],
  hop: [1000, 5000, 12000], blocks: [300, 1500, 5000], cross: [500, 1500, 4000], jump: [300, 800, 2000], smash: [300, 700, 1200], duck: [20000, 50000, 85000],
  derby: [2000, 6000, 10000], dawgball: [50, 150, 300], kickret: [20, 45, 80], hoops: [60, 110, 160], pks: [500, 1000, 1600], golf: [45, 36, 30], golf18: [90, 76, 68],
  darts: [500, 900, 1300], bowl: [100, 150, 200], punch: [500, 3000, 6000], volley: [1000, 2000, 3000], swim: [1500, 3000, 4000], shred: [1000, 2500, 4500],
  fg: [200, 400, 550], airhockey: [300, 700, 1200], tennis: [500, 1000, 1500], drive: [400, 900, 1500], drip: [700, 1200, 1600], pool: [800, 1500, 2200],
  td: [5000, 20000, 40000], pop: [500, 1500, 3000], trail: [1000, 2500, 4000], archery: [60, 80, 92], party: [400, 650, 850], dash: [2000, 8000, 20000],
  harvest: [3000, 10000, 20000], dvz: [500, 1500, 3000], trap: [500, 1500, 3500],  mjrush: [2000, 6000, 15000],
  };
const MEDAL_ICON = ["", "🥉", "🥈", "🥇"], MEDAL_NAME = ["", "BRONZE", "SILVER", "GOLD"];
function medalOf(g, v) { const m = MEDALS[g]; if (!m || !(v > 0)) return 0; let n = 0; m.forEach((t, i) => { if (lowG(g) ? v <= t : v >= t) n = i + 1; }); return n; }
// Game of the Day (from the server): today's game, its daily board, and yesterday's champ.
const gotds = () => arcade ? (arcade.gotds ? Object.values(arcade.gotds) : arcade.gotd ? [arcade.gotd] : []).filter(g => g && ARC[g.game]) : [];
const gotd = game => gotds().find(g => g.game === game) || null;           // the Game of the Day entry for this game, if it is one
const gotdFor = cat => cat === "den" ? null : gotds().find(g => (g.cat || arcCat(g.game)) === cat) || null; // the Den stays chill: no Game of the Day
// Start screen for a game: your best, any dares waiting for this game, and a Go button.
// The Den's card games keep it chill: no medals, dares or Game of the Day, just your best and a deal button.
function denStart(game, panel, onGo) {
  panel.innerHTML = ""; panel.hidden = false;
  panel.append(el("h2", null, ARC[game].name), el("p", null, (ARC[game].blurb || ARC_BLURB[game] || "").replace(/\.$/, "") + "."));
  if (aBest[game]) panel.append(el("p", null, `Your best: ${fmtG(game, aBest[game])}`));
  const how = el("button", "textbtn", "How to play"); how.addEventListener("click", e => { e.stopPropagation(); openModal([el("h2", null, "How to play " + ARC[game].name), el("p", "sub", ARC[game].how)]); }); panel.append(how);
  const sv = typeof G !== "undefined" && G.saved ? G.saved(game) : null;
  if (sv) { const cb = el("button", "pill solid", `▶ Continue · ${sv.label}`); cb.addEventListener("click", e => { e.stopPropagation(); onGo(sv); }); panel.append(cb); }
  const go = el("button", sv ? "pill" : "pill solid", sv ? "New game" : "Deal me in 🐶"); go.addEventListener("click", e => { e.stopPropagation(); if (sv) G.dropSave(game); onGo(); });
  panel.append(go);
}
function denOver(game, score, panel, onAgain, title) {
  const newBest = setBest(game, score) && score > 0;
  if (score > 0 && me) postArcade(game, score, KEY);
  panel.innerHTML = ""; panel.hidden = false;
  panel.append(el("h2", null, title || (newBest ? "New best! 🐶" : "Good game")), el("div", "zbig", fmtG(game, score)), el("p", null, newBest ? "That's your best yet." : `Best: ${fmtG(game, aBest[game] || 0)}`));
  const col = el("div", "col"), again = el("button", "pill solid", "Play again"); again.addEventListener("click", e => { e.stopPropagation(); onAgain(); });
  const back = el("button", "pill", "Back to The Den"); back.addEventListener("click", e => { e.stopPropagation(); show("den"); });
  col.append(again, back); panel.append(col);
}
function arcStart(game, panel, onGo) {
  ownLocal(); if (arcCat(game) === "den") return denStart(game, panel, onGo);
  panel.innerHTML = ""; panel.hidden = false;
  const dare = aDare && aDare.game === game ? aDare : null;
  panel.append(el("h2", null, dare ? `Beat ${fmtG(game, dare.target)}` : ARC[game].name));
  panel.append(el("p", null, dare ? `${dare.fromName} dared you. Your next run counts.` : ARC[game].how));
  const md = medalOf(game, aBest[game]);
  panel.append(el("p", null, `Your best: ${aBest[game] ? fmtG(game, aBest[game]) + (md ? " " + MEDAL_ICON[md] : "") : "none yet"}`));
  if (MEDALS[game]) panel.append(el("p", "medals", MEDALS[game].map((v, i) => `${MEDAL_ICON[i + 1]} ${fmtG(game, v)}`).join("   ")));
  const gd = gotd(game); if (gd) panel.append(el("p", "gotdline", gd.board.length ? `🎯 Game of the Day! Leader: ${gd.board[0].name} ${fmtG(game, gd.board[0].n)}` : "🎯 Game of the Day! Nobody's played it yet today."));
  if (!dare) aDares.filter(d => d.game === game).slice(-3).forEach(d => {
    const row = el("div", "zdare"); row.append(el("span", null, `${d.fromName} dared you: beat ${fmtG(game, d.target)}`));
    const b = el("button", "pill", "Take it"); b.addEventListener("click", e => { e.stopPropagation(); aDare = d; arcStart(game, panel, onGo); });
    row.append(b); panel.append(row);
  });
  const sv = typeof G !== "undefined" && G.saved ? G.saved(game) : null;
  if (sv) { const cb = el("button", "pill solid", `▶ Continue · ${sv.label}`); cb.addEventListener("click", e => { e.stopPropagation(); onGo(sv); }); panel.append(cb); }
  const go = el("button", sv ? "pill" : "pill solid", sv ? "New game" : dare ? "🐶 Let's go" : "🐶 Start"); go.addEventListener("click", e => { e.stopPropagation(); if (sv) G.dropSave(game); onGo(); });
  panel.append(go);
}
// Game over: saves your best, answers a dare if you took one, offers a rematch or a dare.
// "So close": how far from your best, and who you'd pass next on the all-time board.
function soClose(game, score, prev) {
  const lines = [], low = lowG(game), gap = (a, b) => Math.abs(a - b);
  const all = arcade && arcade.games && arcade.games[game] ? arcade.games[game].all.filter(x => !me || x.id !== me.id) : [];
  if (score > 0 && prev > 0 && !betterG(game, score, prev)) lines.push(score === prev ? "Tied your best!" : `${gap(score, prev)} away from your best.`);
  if (score > 0 && all.length) {
    const above = all.filter(x => !betterG(game, score, x.n) && x.n !== score), beat = all.length - above.length;
    if (!above.length) lines.push(`👑 That beats everyone. You're #1!`);
    else { const t = above[above.length - 1]; lines.push(`${gap(score, t.n)}${low ? " fewer strokes" : " more"} to pass ${t.name} for #${above.length}.`); }
  }
  const gd = gotd(game); if (gd && score > 0) {
    const lead = gd.board.filter(x => !me || x.id !== me.id)[0];
    lines.push(!lead || betterG(game, score, lead.n) ? "🎯 You lead today's Game of the Day!" : `🎯 Today's leader: ${lead.name} ${fmtG(game, lead.n)}`);
  }
  return lines;
}
function arcOver(game, score, panel, onAgain, title) {
  if (arcCat(game) === "den") return denOver(game, score, panel, onAgain, title);
  const prev = aBest[game] || 0, prevMedal = medalOf(game, prev);
  const newBest = setBest(game, score) && score > 0;
  // Older servers only know Zoomies; don't let other games' scores land on its board.
  // Post the score. If the leaderboard hasn't loaded yet or the network hiccups, keep it and retry later
  // (it used to be skipped silently, which could lose a great round).
  if (score > 0 && me && (game === "zoomies" || !arcade || !arcade.games || arcade.games[game])) postArcade(game, score, KEY);
  panel.innerHTML = ""; panel.hidden = false;
  panel.append(el("h2", null, newBest ? "New best! 🐶" : title || (score === 0 ? "Bonk." : "Ruff.")));
  panel.append(el("div", "zbig", fmtG(game, score)), el("p", null, `Best: ${fmtG(game, aBest[game] || 0)}`));
  const nm = medalOf(game, score); if (nm > prevMedal) panel.append(el("p", "medalwin", `${MEDAL_ICON[nm]} ${MEDAL_NAME[nm]} MEDAL!`));
  soClose(game, score, prev).forEach(s => panel.append(el("p", "soclose", s)));
  const msg = el("p"); panel.append(msg);
  const dare = aDare && aDare.game === game ? aDare : null;
  if (dare) {
    aDare = null; dropDare(dare);
    const won = betterG(game, score, dare.target);
    msg.textContent = won ? `You beat ${dare.fromName}'s ${fmtG(game, dare.target)}. They'll hear about it. 😎` : `${dare.fromName}'s ${fmtG(game, dare.target)} stands. Ouch.`;
    if (won) celebrate();
    if (me) API("answerDare", me.id, KEY, dare.id, score).catch(e => toast(errMsg(e), 2200));
  } else if (newBest && score >= 5) celebrate();
  const col = el("div", "col");
  const again = el("button", "pill solid", "Run it back"); again.addEventListener("click", e => { e.stopPropagation(); onAgain(); });
  col.append(again);
  const known = game === "zoomies" || (arcade && arcade.games && arcade.games[game]);
  if (score > 0 && me && arcade && !known) col.append(el("p", "sub", "This game is brand new: leaderboard scores and dares turn on once the server is updated."));
  if (score > 0 && me && (known || !arcade)) { const d = el("button", "pill", `🎯 Dare someone to beat ${fmtG(game, score)}`); d.addEventListener("click", e => { e.stopPropagation(); openDarePicker(game, score); }); col.append(d); }
  panel.append(col);
}
function postArcade(game, score, day) {
  const pend = (store.get("bdd:apend") || []).filter(p => !(p.g === game && p.d === day && !betterG(game, score, p.s)));
  pend.push({ g: game, s: score, d: day, id: me.id }); store.set("bdd:apend", pend.slice(-30));
  return API("submitArcade", me.id, day, score, game).then(a => {
    store.set("bdd:apend", (store.get("bdd:apend") || []).filter(p => !(p.g === game && p.d === day && p.s === score)));
    arcade = a; syncBests(); renderArcade(); renderArcSub();
  }).catch(e => { if (/newest server/.test(errMsg(e))) store.set("bdd:apend", (store.get("bdd:apend") || []).filter(p => p.g !== game)); });
}
function retryArcade() { if (!me) return; (store.get("bdd:apend") || []).filter(p => p.id === me.id).slice(0, 5).forEach(p => postArcade(p.g, p.s, p.d)); }
function syncBests() { if (!arcade) return; const g = arcade.games || { zoomies: { myBest: arcade.myBest } }; Object.keys(g).forEach(k => setBest(k, g[k].myBest || 0)); }
const Z = { state: "idle", raf: 0, last: 0, W: 0, H: 0, dpr: 1, y: 0, vy: 0, pipes: [], score: 0, t: 0, dist: 0, dead: 0 };
const ZC = { grav: 1500, flap: -440, r: 18, pw: 62, space: 210 };
const zImg = {};
function zFace(code) {
  if (zImg[code]) return zImg[code];
  const img = new Image(); img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(dawgSvg(code, 64).replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" '));
  return zImg[code] = img;
}
[":dawgW:", ":dawgpog:", ":dawgpain:"].forEach(k => { zFace(k).onload = () => { if (active === "zoomies" && Z.state !== "play" && Z.state !== "dying" && Z.W) zDraw(); }; });
function zDark() { const c = getComputedStyle(document.documentElement).getPropertyValue("--bg").trim(); return c && parseInt(c.replace("#", "").slice(0, 2), 16) < 80; }
function zSize() {
  const w = $("zwrap"), c = $("zc"), r = w.getBoundingClientRect();
  Z.dpr = Math.min(window.devicePixelRatio || 1, 2); Z.W = r.width; Z.H = r.height;
  c.width = Math.round(r.width * Z.dpr); c.height = Math.round(r.height * Z.dpr);
}
function zGap() { return Math.max(150, Math.min(190, Z.H * 0.27)); }
function zSpeed() { return Math.min(235, 150 + Z.score * 4); }
function zReset() {
  Z.y = Z.H * 0.42; Z.vy = 0; Z.pipes = []; Z.score = 0; Z.t = 0; Z.dist = 0; Z.dead = 0;
  for (let x = Z.W + 120; x < Z.W * 2.5; x += ZC.space) zAddPipe(x);
}
function zAddPipe(x) {
  const g = zGap(), ground = Z.H - 56, top = 70, gy = top + Math.random() * Math.max(10, ground - top - g);
  Z.pipes.push({ x, gy, g, passed: false });
}
function zFlap() {
  if (Z.state === "over") return;
  if (Z.state !== "play") { Z.state = "play"; $("zpanel").hidden = true; $("zhud").hidden = false; $("zhud").textContent = "0"; Z.last = performance.now(); zLoop(); }
  Z.vy = ZC.flap; chime("pop");
}
function zLoop() {
  cancelAnimationFrame(Z.raf);
  Z.raf = requestAnimationFrame(now => {
    const dt = Math.min(1 / 30, (now - Z.last) / 1000); Z.last = now;
    if (Z.state === "play" || Z.state === "dying") zStep(dt);
    zDraw();
    if (Z.state === "play" || Z.state === "dying") zLoop();
  });
}
function zStep(dt) {
  Z.t += dt; Z.vy += ZC.grav * dt; Z.y += Z.vy * dt;
  const ground = Z.H - 56, dx = Z.W * 0.3;
  if (Z.state === "dying") { if (Z.y >= ground - ZC.r) { Z.y = ground - ZC.r; zOver(); } return; }
  const sp = zSpeed() * dt; Z.dist += sp;
  Z.pipes.forEach(p => p.x -= sp);
  if (Z.pipes.length && Z.pipes[0].x < -ZC.pw - 20) Z.pipes.shift();
  const lastX = Z.pipes.length ? Z.pipes[Z.pipes.length - 1].x : Z.W;
  if (lastX < Z.W + 40) zAddPipe(lastX + ZC.space);
  if (Z.y < ZC.r) { Z.y = ZC.r; Z.vy = 0; }
  let hit = Z.y >= ground - ZC.r;
  Z.pipes.forEach(p => {
    if (!p.passed && p.x + ZC.pw < dx - ZC.r) { p.passed = true; Z.score++; $("zhud").textContent = Z.score; if (Z.score % 10 === 0) chime("win"); }
    const r = ZC.r - 3; // a little forgiveness
    if (dx + r > p.x && dx - r < p.x + ZC.pw && (Z.y - r < p.gy || Z.y + r > p.gy + p.g)) hit = true;
  });
  if (hit) { Z.state = "dying"; Z.vy = Math.max(Z.vy, 120); chime("lose"); if (navigator.vibrate) try { navigator.vibrate(40); } catch (e) {} if (Z.y >= ground - ZC.r) zOver(); }
}
function zBone(c, x, y, w, h, up) {
  const bone = "#f3ead7", edge = "#c9b99a";
  c.fillStyle = bone; c.strokeStyle = edge; c.lineWidth = 3;
  c.beginPath(); if (c.roundRect) c.roundRect(x + 8, y, w - 16, h, 6); else c.rect(x + 8, y, w - 16, h); c.fill(); c.stroke();
  const ky = up ? y + h - 4 : y + 4; // knobby end at the gap
  [x + 12, x + w - 12].forEach(kx => { c.beginPath(); c.arc(kx, ky, 15, 0, Math.PI * 2); c.fill(); c.stroke(); });
  c.fillStyle = bone; c.fillRect(x + 10, up ? y + h - 22 : y + 6, w - 20, 16);
}
function zDraw() {
  const c = $("zc").getContext("2d"), W = Z.W, H = Z.H, dark = zDark(), ground = H - 56;
  c.setTransform(Z.dpr, 0, 0, Z.dpr, 0, 0);
  const sky = c.createLinearGradient(0, 0, 0, H);
  sky.addColorStop(0, dark ? "#1b2340" : "#8fd3ff"); sky.addColorStop(1, dark ? "#3a2f4f" : "#d9f1ff");
  c.fillStyle = sky; c.fillRect(0, 0, W, H);
  // clouds / stars drift slowly
  c.fillStyle = dark ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.85)";
  for (let i = 0; i < 5; i++) {
    const x = ((i * 157 - Z.dist * 0.2) % (W + 120) + W + 120) % (W + 120) - 60, y = 40 + (i * 73) % (H * 0.45);
    if (dark) { c.beginPath(); c.arc(x, y, 1.6, 0, 7); c.fill(); }
    else { c.beginPath(); c.arc(x, y, 16, 0, 7); c.arc(x + 18, y - 6, 20, 0, 7); c.arc(x + 38, y, 15, 0, 7); c.fill(); }
  }
  Z.pipes.forEach(p => { zBone(c, p.x, -20, ZC.pw, p.gy + 20, true); zBone(c, p.x, p.gy + p.g, ZC.pw, ground - p.gy - p.g + 4, false); });
  // ground: grass + dirt with moving stripes
  c.fillStyle = dark ? "#3b5d2e" : "#7cc35b"; c.fillRect(0, ground, W, 12);
  c.fillStyle = dark ? "#4a3626" : "#c99a63"; c.fillRect(0, ground + 12, W, H - ground - 12);
  c.fillStyle = dark ? "rgba(0,0,0,0.18)" : "rgba(0,0,0,0.08)";
  for (let x = -(Z.dist % 28); x < W; x += 28) c.fillRect(x, ground + 20, 14, 6);
  // the dawg
  const img = zFace(Z.state === "dying" || Z.state === "over" ? ":dawgpain:" : Z.vy < -150 ? ":dawgpog:" : ":dawgW:");
  const ang = Z.state === "idle" ? 0 : Math.max(-0.45, Math.min(1.1, Z.vy / 600));
  const by = Z.state === "idle" ? Z.y + Math.sin(performance.now() / 260) * 6 : Z.y;
  c.save(); c.translate(W * 0.3, by); c.rotate(ang);
  if (img.complete) c.drawImage(img, -26, -26, 52, 52); else { c.fillStyle = "#c98b4f"; c.beginPath(); c.arc(0, 0, ZC.r, 0, 7); c.fill(); }
  c.restore();
}
function zIdle() {
  cancelAnimationFrame(Z.raf); Z.state = "idle"; zSize(); zReset();
  const idle = () => { if (Z.state !== "idle" || active !== "zoomies") return; zDraw(); Z.raf = requestAnimationFrame(idle); };
  idle();
}
function zPanelStart() { $("zhud").hidden = true; arcStart("zoomies", $("zpanel"), zFlap); }
function zOver() {
  Z.state = "over"; cancelAnimationFrame(Z.raf); zDraw();
  arcOver("zoomies", Z.score, $("zpanel"), () => { zIdle(); zPanelStart(); }, Z.score >= 10 ? hype(HYPE.win, 40 + Z.score) : null);
  Z.dead = performance.now();
}
function openDarePicker(game, score) {
  const others = (shade.players || []).filter(x => me && x.id !== me.id);
  if (!others.length) { toast("Nobody in your crews to dare yet. Invite some friends.", 2400); return; }
  const list = el("div", "pickgrid");
  const q = el("input"); q.placeholder = "Search names"; q.setAttribute("aria-label", "Search names");
  const draw = () => {
    list.innerHTML = ""; const t = q.value.trim().toLowerCase();
    others.filter(o => !t || o.name.toLowerCase().includes(t)).sort((a, b) => a.name.localeCompare(b.name)).slice(0, 30).forEach(o => {
      const ga = arcade && arcade.games && arcade.games[game], theirs = ga ? ((ga.all || []).find(x => x.id === o.id) || {}).n || 0 : 0;
      const beaten = theirs > 0 && !betterG(game, score, theirs);
      const b = el("button", "pill", beaten ? `${o.name} · already has ${fmtG(game, theirs)}` : o.name);
      if (beaten) { b.disabled = true; b.style.opacity = "0.45"; }
      b.addEventListener("click", () => {
        b.disabled = true; b.textContent = "Sending…";
        API("sendDare", me.id, o.id, KEY, score, game).then(st => { shade = st; closeModal(); toast(`Dare sent to ${o.name} 🎯`, 1800); })
          .catch(e => { b.disabled = false; b.textContent = o.name; toast(errMsg(e), 2400); });
      });
      list.appendChild(b);
    });
  };
  q.addEventListener("input", draw); draw();
  openModal([el("h2", null, `Dare someone to beat ${fmtG(game, score)}`), el("p", "sub", `In ${ARC[game].name}. They get it next time they open the app.`), others.length > 6 ? q : el("span"), list]);
}
function zShown() { requestAnimationFrame(() => { zIdle(); zPanelStart(); }); if (!arcade) refreshArcade(); }
function zHidden() { if (Z.state === "play" || Z.state === "dying") { Z.state = "idle"; } cancelAnimationFrame(Z.raf); }
$("zwrap").addEventListener("pointerdown", e => { if (e.target.closest("button") || e.target.closest(".zpanel")) return; e.preventDefault(); zFlap(); });
document.addEventListener("keydown", e => { if (active === "zoomies" && (e.code === "Space" || e.key === "ArrowUp") && Z.state !== "over") { e.preventDefault(); zFlap(); } });
window.addEventListener("resize", () => { if (active === "zoomies" && Z.state === "idle") zIdle(); });
document.querySelectorAll(".arc-board").forEach(b => b.addEventListener("click", () => { arcTab = active === "game" ? G.key : ARC[active] ? active : arcTab; hofCat = active === "sports" || active === "den" ? active : active === "game" && ARC[arcTab] ? arcCat(arcTab) : "arcade"; hofOpen = ARC[arcTab] && (active === "game" || ARC[active]) ? arcTab : null; show("scores"); scoreTab("arcade"); refreshArcade(); renderArcade(); }));
function refreshArcade() {
  if (!me) return;
  ownLocal(); retryArcade(); API("getArcade", me.id, KEY).then(a => { arcade = a; syncBests(); renderArcade(); renderArcSub(); if (active === "scores") renderScores(); if (active === "arcade" || active === "sports" || active === "den") renderArcHub(active); }).catch(() => {});
}
// Hall of Fame: every game as one row with its champion and your best; tap a row for the top 10.
let hofCat = "arcade", hofOpen = null;
function renderArcade() {
  const box = $("hof"); if (!box) return;
  document.querySelectorAll("#hof-seg button").forEach(b => b.classList.toggle("on", b.dataset.cat === hofCat));
  box.innerHTML = "";
  const games = arcade && arcade.games;
  let keys = arcOrder().filter(k => hofCat === "mine" ? aBest[k] > 0 : arcCat(k) === hofCat);
  if (hofCat === "mine" && !keys.length) { box.appendChild(el("p", "note", "Play any arcade or sports game and your bests show up here.")); return; }
  keys.forEach(k => {
    if (games && games[k] && games[k].daily) return box.appendChild(dailyHof(k, games[k]));
    const g = games && games[k], list = (g && g.all) || [], top = list[0];
    const row = el("button", "hof-row" + (hofOpen === k ? " open" : ""));
    const ic = el("span", "gicon"); ic.appendChild(emo(ARC[k].icon, 24));
    const mid = el("span"); mid.append(el("b", null, ARC[k].name));
    const myRank = me ? list.findIndex(x => x.id === me.id) : -1;
    mid.appendChild(el("small", null, aBest[k] ? `You: ${fmtG(k, aBest[k])}${myRank >= 0 ? ` · #${myRank + 1}` : ""}` : "You: not played"));
    const ch = el("span", "champ");
    if (top) { ch.append(el("b", null, `👑 ${top.name}`)); ch.appendChild(el("small", null, fmtG(k, top.n))); }
    else ch.appendChild(el("small", null, arcade ? "No champ yet" : "…"));
    row.append(ic, mid, ch);
    row.addEventListener("click", () => { hofOpen = hofOpen === k ? null : k; arcTab = k; renderArcade(); });
    box.appendChild(row);
    if (hofOpen === k) {
      const d = el("div", "hof-detail"), ol = el("ol", "rank-list");
      if (!list.length) ol.appendChild(el("li", "dim", arcade ? "No scores yet. Be the first." : "Loading…"));
      list.forEach(x => { const rk = 1 + list.filter(y => betterG(k, y.n, x.n)).length; const li = el("li", (rk === 1 ? "lead" : "") + (me && x.id === me.id ? " league-me" : "")); li.append(el("span", "rk", rk), el("span", "nm", x.name), el("span", "ct", fmtG(k, x.n))); ol.appendChild(li); });
      const play = el("button", "pill solid", `🐶 Play ${ARC[k].name}`); play.dataset.play = k;
      d.append(ol, play); box.appendChild(d);
    }
  });
}
// Daily Den puzzles: Today · This week (best 5 days) · All time (average day, 5+ days to rank).
function dailyHof(k, g) {
  const wrap = el("div"), top = g.week[0], mw = g.myWeek;
  const row = el("button", "hof-row" + (hofOpen === k ? " open" : ""));
  const ic = el("span", "gicon"); ic.appendChild(emo(ARC[k].icon, 24));
  const mid = el("span"); mid.append(el("b", null, ARC[k].name));
  const wr = mw ? 1 + g.week.filter(x => x.n > mw.n).length : 0;
  mid.appendChild(el("small", null, mw ? `You: ${mw.n} this week · #${wr}` : "You: not played this week"));
  const ch = el("span", "champ");
  if (top) { ch.append(el("b", null, `👑 ${top.name}`)); ch.appendChild(el("small", null, `${top.n} this week`)); } else ch.appendChild(el("small", null, "No one yet this week"));
  row.append(ic, mid, ch); row.addEventListener("click", () => { hofOpen = hofOpen === k ? null : k; arcTab = k; renderArcade(); });
  wrap.appendChild(row);
  if (hofOpen === k) {
    const d = el("div", "hof-detail");
    const sect = (title, list, fmt, empty) => { d.appendChild(el("div", "arc-sec", title)); const ol = el("ol", "rank-list");
      if (!list.length) ol.appendChild(el("li", "dim", empty));
      list.forEach((x, i) => { const rk = i + 1; const li = el("li", (rk === 1 ? "lead" : "") + (me && x.id === me.id ? " league-me" : "")); li.append(el("span", "rk", rk), el("span", "nm", x.name), el("span", "ct", fmt(x))); ol.appendChild(li); });
      d.appendChild(ol); };
    sect("Today", g.today || [], x => `${x.n}`, "Nobody's played today yet.");
    sect("This week · best 5 days", g.week, x => `${x.n} · ${x.days}d`, "Nobody's played this week yet.");
    sect("All time · average day", g.all, x => x.days >= 5 ? `${x.n} avg · ${x.days}d` : `${x.n} avg · ${x.days}d (needs 5)`, "No scores yet.");
    const play = el("button", "pill solid", `Play ${ARC[k].name}`); play.dataset.play = k; d.appendChild(play);
    wrap.appendChild(d);
  }
  return wrap;
}
document.querySelectorAll("#hof-seg button").forEach(b => b.addEventListener("click", () => { hofCat = b.dataset.cat; hofOpen = null; renderArcade(); }));
const ARC_BLURB = { zoomies: "Tap to fly. Dodge the bones.", snake: "Swipe to steer. Eat bones, grow longer.", fetch: "Bounce the ball. Smash the treats." };
const ARC_ORDER = ["sgroups", "hive", "pips", "sudoku", "euchre", "crib", "crazy", "rummy", "solitaire", "topdogs", "leash", "boneball", "mahjong", "party", "pupman", "pupshot", "blumji", "squad", "dig", "mjrush", "mjzen", "trap", "dash", "zoomies", "snake", "fetch", "drive", "hop", "blocks", "cross", "harvest", "td", "dvz", "pop", "trail", "putt", "putt18", "smash", "jump", "drip",
  "seven", "duck", "derby", "dawgball", "kickret", "fg", "hoops", "pks", "tennis", "volley", "punch", "airhockey", "golf", "golf18", "archery", "darts", "bowl", "pool", "swim", "shred"];
const arcOrder = () => ARC_ORDER.filter(k => ARC[k]).concat(Object.keys(ARC).filter(k => !ARC_ORDER.includes(k)));
const arcCat = k => (ARC[k] && ARC[k].cat) || "arcade";
function renderArcSub() {
  ownLocal();
  ["arcade", "sports", "den"].forEach(cat => {
    const n = aDares.filter(d => ARC[d.game] && arcCat(d.game) === cat).length, total = arcOrder().filter(k => arcCat(k) === cat).length;
    if ($("sub-" + cat)) $("sub-" + cat).textContent = n ? `🎯 ${n} dare${n > 1 ? "s" : ""}` : `${total} games`;
  });
}
// ---- The Den's daily puzzles: home-style cards with today's status, and a NYT-style results card ----
const DEN_PUZ = ["sgroups", "hive", "pips", "sudoku"];
function denRec(k, d) { return me ? store.get("bdd:den:" + k + ":" + KEY + (d === undefined ? "" : ":" + d) + ":" + me.id) : null; }
function denStatus(k) {
  if (k === "sgroups") { const r = denRec(k); return r && r.done ? ["Done", true, r.score ? `Solved · ${r.score} pts` : "Done for today"] : r && r.order ? ["Continue", false, "In progress"] : ["Play", false, null]; }
  if (k === "hive") { const r = denRec(k); return r && r.found && r.found.length ? ["Continue", false, `${r.score} pts · ${r.found.length} words`] : ["Play", false, null]; }
  const n = [0, 1, 2].filter(d => { const r = denRec(k, d); return r && r.done; }).length;
  return n === 3 ? ["Done", true, "All 3 solved"] : n ? ["Continue", false, `${n} of 3 solved`] : ["Play", false, null];
}
function renderDenPuz() {
  const box = $("den-puz"); if (!box) return; box.innerHTML = "";
  DEN_PUZ.filter(k => ARC[k]).forEach((k, i) => {
    const [st, done, line] = denStatus(k), td = arcade && arcade.games && arcade.games[k] && arcade.games[k].today;
    const b = el("button", "gcard c-den" + i); b.dataset.play = k;
    const ic = el("span", "gicon den"); ic.appendChild(emo(ARC[k].icon, 36));
    const tx = el("span", "gtext"); tx.append(el("b", null, ARC[k].name), el("span", "gsub", [line || ARC[k].blurb.replace(/^Daily: (.)/, (m, ch) => ch.toUpperCase()), td && td[0] ? `👑 ${td[0].name}` : ""].filter(Boolean).join(" · ")));
    b.append(ic, tx, el("span", "gstat" + (done ? " done" : ""), st)); box.appendChild(b);
  });
}
function puzzleResults(game, info) {
  const nodes = [el("h2", null, info.title || ARC[game].name)];
  if (info.sub) nodes.push(el("p", "sub", info.sub));
  if (info.grid) nodes.push(el("div", "preview pshare", info.grid));
  nodes.push(el("h3", null, "Today's leaderboard"));
  const ol = el("ol", "rank-list pboard"); nodes.push(ol);
  const fill = () => {
    ol.innerHTML = ""; let list = ((arcade && arcade.games && arcade.games[game] && arcade.games[game].today) || []).slice();
    if (me && info.score > 0) { const m = list.find(x => x.id === me.id); if (!m) list.push({ id: me.id, name: me.name, n: info.score }); else if (info.score > m.n) m.n = info.score; }
    list.sort((a, b) => b.n - a.n);
    if (!list.length) ol.appendChild(el("li", "dim", "Nobody's on the board yet today."));
    list.slice(0, 10).forEach((x, i) => { const li = el("li", me && x.id === me.id ? "me" : ""); const nm = el("button", "nm", x.name); nm.dataset.card = x.id; nm.style.textAlign = "left"; li.append(el("span", "rk", i + 1), nm, el("span", "ct", `${x.n} pts`)); ol.appendChild(li); });
  };
  fill();
  if (info.next) { const nb = el("button", "pill solid", info.next.label); nb.addEventListener("click", () => { closeModal(); info.next.go(); }); nodes.push(nb); }
  const back = el("button", info.next ? "pill" : "pill solid", "Back to The Den"); back.addEventListener("click", () => { closeModal(); show("den"); });
  nodes.push(back);
  if (info.share) {
    const share = el("button", "pill", "Copy results"), ta = el("textarea", "copybox"); ta.rows = 5; ta.readOnly = true; ta.hidden = true;
    share.addEventListener("click", () => copy(info.share + (APP_URL ? "\n" + APP_URL : ""), ta)); nodes.push(share, ta);
  }
  openModal(nodes); return fill;
}
$("g-help").addEventListener("click", () => { if (!G.def) return; openModal([el("h2", null, "How to play " + G.def.name), el("p", "sub", G.def.how)]); });
function renderArcHub(cat) {
  ownLocal();
  cat = cat || "arcade";
  const box = $(cat === "sports" ? "sp-dares" : cat === "den" ? "den-dares" : "arc-dares"); box.innerHTML = "";
  aDares.filter(d => ARC[d.game] && arcCat(d.game) === cat).slice(-5).reverse().forEach(d => {
    const row = el("div", "zdare"); row.append(el("span", null, `${d.fromName} dared you: beat ${d.target} in ${ARC[d.game].name}`));
    const b = el("button", "pill", "Take it"); b.addEventListener("click", () => { aDare = d; playGame(d.game); });
    row.append(b); box.appendChild(row);
  });
  // Compact 3-across grid: icon, name, your best. Badges: 🎯 dares waiting, ▶ a saved game to continue.
  const gd = gotdFor(cat);
  if (gd) {
    const card = el("button", "gotd"); card.dataset.play = gd.game;
    const lead = gd.board[0];
    card.append(el("b", null, `🎯 GAME OF THE DAY: ${ARC[gd.game].name}`), el("span", null, lead ? `Today's leader: ${lead.name} ${fmtG(gd.game, lead.n)} · resets at midnight` : "Nobody's played it yet today. Be first."));
    if (gd.y && gd.y.win && ARC[gd.y.game]) card.append(el("small", null, `🏆 Yesterday: ${gd.y.win.name} won ${ARC[gd.y.game].name}`));
    box.prepend(card);
  }
  const list = $(cat === "sports" ? "sp-list" : cat === "den" ? "den-list" : "arc-list"); list.innerHTML = "";
  let all = arcOrder().filter(k => arcCat(k) === cat);
  if (cat === "den") { renderDenPuz(); all = all.filter(k => !DEN_PUZ.includes(k)); }
  const recent = (store.get("bdd:recent") || []).filter(k => all.includes(k)).slice(0, 3);
  const cell = k => {
    const r = el("button", "arc-cell"); r.dataset.play = k;
    const ic = el("span", "gicon"); ic.appendChild(emo(ARC[k].icon, 28));
    const dr = ARC[k].puzzle && denRec(k);
    if (ARC[k].puzzle) r.append(ic, el("b", null, ARC[k].name), el("small", null, dr && dr.done ? `✓ Today · ${dr.score} pts` : dr ? "In progress" : "Daily puzzle"));
    else r.append(ic, el("b", null, ARC[k].name), el("small", null, aBest[k] ? "Best " + fmtG(k, aBest[k]) + (medalOf(k, aBest[k]) ? " " + MEDAL_ICON[medalOf(k, aBest[k])] : "") : "\u00a0"));
    if (gd && gd.game === k) r.classList.add("isgotd");
    const td = arcade && arcade.games && arcade.games[k] && arcade.games[k].today; if (cat === "den" && td && td[0]) r.appendChild(el("small", "today", `👑 ${td[0].name}`));
    const n = aDares.filter(d => d.game === k).length, sv = me && store.get("bdd:gsave:" + k + ":" + me.id);
    if (n) r.appendChild(el("span", "badge", `🎯${n}`)); else if (sv) r.appendChild(el("span", "badge go", "▶"));
    return r;
  };
  if (recent.length >= 2 && cat !== "den") { list.appendChild(el("div", "arc-sec", "Jump back in")); recent.forEach(k => list.appendChild(cell(k))); list.appendChild(el("div", "arc-sec", "All games")); }
  all.forEach(k => list.appendChild(cell(k)));
  if (!arcade) refreshArcade();
}
$("ab-icon").appendChild(emo(":dawgpog:", 34)); $("sb-icon").appendChild(emo("🏆", 30)); $("db-icon").appendChild(emo("🧩", 28));

// ================= ARCADE: LONG DAWG (snake) =================
const SN = { state: "idle", W: 0, H: 0, dpr: 1, cols: 15, rows: 20, cell: 20, ox: 0, oy: 0, body: [], dir: [1, 0], q: [], bone: null, score: 0, acc: 0, last: 0, raf: 0 };
function sSize() {
  const w = $("swrap"), c = $("sc"), r = w.getBoundingClientRect();
  SN.dpr = Math.min(window.devicePixelRatio || 1, 2); SN.W = r.width; SN.H = r.height;
  c.width = Math.round(r.width * SN.dpr); c.height = Math.round(r.height * SN.dpr);
  SN.cols = 15; SN.cell = Math.floor((r.width - 16) / SN.cols); SN.rows = Math.max(12, Math.floor((r.height - 16) / SN.cell));
  SN.ox = Math.round((r.width - SN.cols * SN.cell) / 2); SN.oy = Math.round((r.height - SN.rows * SN.cell) / 2);
}
function sReset() {
  const y = Math.floor(SN.rows / 2); SN.body = [[5, y], [4, y], [3, y]]; SN.dir = [1, 0]; SN.q = []; SN.score = 0; SN.acc = 0; sBone();
}
function sBone() {
  const free = []; for (let x = 0; x < SN.cols; x++) for (let y = 0; y < SN.rows; y++) if (!SN.body.some(b => b[0] === x && b[1] === y)) free.push([x, y]);
  SN.bone = free[Math.floor(Math.random() * free.length)];
}
function sTick() { return Math.max(95, 195 - SN.score * 3); } // a bit slower than the classic
function sTurn(dx, dy) {
  if (SN.state === "idle") return;
  const last = SN.q.length ? SN.q[SN.q.length - 1] : SN.dir;
  if ((dx === -last[0] && dy === -last[1]) || (dx === last[0] && dy === last[1])) return;
  if (SN.q.length < 2) SN.q.push([dx, dy]);
}
function sGo() { $("spanel").hidden = true; $("shud").hidden = false; sSize(); sReset(); SN.lives = 3; sHud(); SN.state = "play"; SN.last = performance.now(); sLoop(); }
function sLoop() {
  cancelAnimationFrame(SN.raf);
  SN.raf = requestAnimationFrame(now => {
    if (SN.state !== "play") return;
    SN.acc += Math.min(250, now - SN.last); SN.last = now;
    while (SN.acc >= sTick() && SN.state === "play") { SN.acc -= sTick(); sStep(); }
    sDraw(); if (SN.state === "play") sLoop();
  });
}
function sStep() {
  if (SN.q.length) SN.dir = SN.q.shift();
  const h = SN.body[0], n = [h[0] + SN.dir[0], h[1] + SN.dir[1]];
  const eat = SN.bone && n[0] === SN.bone[0] && n[1] === SN.bone[1];
  const tail = eat ? SN.body : SN.body.slice(0, -1);
  if (n[0] < 0 || n[1] < 0 || n[0] >= SN.cols || n[1] >= SN.rows || tail.some(b => b[0] === n[0] && b[1] === n[1])) { sDie(); return; }
  SN.body.unshift(n); if (!eat) SN.body.pop();
  if (eat) { SN.score++; sHud(); chime("pop"); if (SN.score % 10 === 0) chime("win"); sBone(); }
}
function sHud() { $("shud").textContent = `${SN.score}  ${"❤️".repeat(Math.max(0, SN.lives || 0))}`; }
function sDie() {
  chime("lose"); if (navigator.vibrate) try { navigator.vibrate(40); } catch (e) {}
  SN.lives = (SN.lives || 1) - 1;
  if (SN.lives > 0) { // lose a life: keep the score, start a fresh short dog after a beat
    SN.state = "pause"; sDraw(); toast(`Ouch! ${SN.lives} ${SN.lives > 1 ? "lives" : "life"} left`, 1100);
    setTimeout(() => { if (SN.state !== "pause" || active !== "snake") return; const sc = SN.score; sReset(); SN.score = sc; sHud(); SN.state = "play"; SN.last = performance.now(); sLoop(); }, 1100);
    return;
  }
  SN.state = "over";
  sDraw();
  arcOver("snake", SN.score, $("spanel"), () => { sIdle(); }, SN.score >= 15 ? hype(HYPE.win, 60 + SN.score) : SN.score === 0 ? "Bonk." : "Ruff.");
}
function sDraw() {
  const c = $("sc").getContext("2d"), dark = zDark(), k = SN.cell;
  c.setTransform(SN.dpr, 0, 0, SN.dpr, 0, 0);
  c.fillStyle = dark ? "#1d2a1a" : "#cfe8b8"; c.fillRect(0, 0, SN.W, SN.H);
  for (let x = 0; x < SN.cols; x++) for (let y = 0; y < SN.rows; y++) { c.fillStyle = (x + y) % 2 ? (dark ? "#24361f" : "#b9dd9c") : (dark ? "#2a3f24" : "#c6e5aa"); c.fillRect(SN.ox + x * k, SN.oy + y * k, k, k); }
  c.strokeStyle = dark ? "#6b4f33" : "#8a5a2b"; c.lineWidth = 4; c.strokeRect(SN.ox - 2, SN.oy - 2, SN.cols * k + 4, SN.rows * k + 4);
  if (SN.bone) { c.font = `${Math.round(k * 1.15)}px system-ui, "Apple Color Emoji"`; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText("🦴", SN.ox + SN.bone[0] * k + k / 2, SN.oy + SN.bone[1] * k + k / 2 + 1); }
  // the long dawg: a dachshund body with a bulldog head
  const pts = SN.body.map(b => [SN.ox + b[0] * k + k / 2, SN.oy + b[1] * k + k / 2]);
  if (pts.length > 1) {
    c.lineCap = "round"; c.lineJoin = "round";
    c.strokeStyle = "#7a4a22"; c.lineWidth = k * 0.86; c.beginPath(); pts.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.stroke();
    c.strokeStyle = "#b8763d"; c.lineWidth = k * 0.66; c.stroke();
    const t = pts[pts.length - 1]; c.fillStyle = "#7a4a22"; c.beginPath(); c.arc(t[0], t[1], k * 0.18, 0, 7); c.fill();
  }
  const h = pts[0]; if (h) { const img = zFace(SN.state === "over" || SN.state === "pause" ? ":dawgpain:" : ":dawgW:"); const s = k * 1.45; if (img.complete) c.drawImage(img, h[0] - s / 2, h[1] - s / 2, s, s); }
}
function sIdle() { cancelAnimationFrame(SN.raf); SN.state = "idle"; sSize(); sReset(); sDraw(); $("shud").hidden = true; arcStart("snake", $("spanel"), sGo); }
function sShown() { requestAnimationFrame(sIdle); if (!arcade) refreshArcade(); }
function sHidden() { if (SN.state === "play" || SN.state === "pause") { SN.state = "idle"; } cancelAnimationFrame(SN.raf); }
// Swipe anywhere on the board to steer (or use the arrow keys).
function swipe(elm, fn) {
  let sx = 0, sy = 0, on = false;
  elm.addEventListener("pointerdown", e => { if (e.target.closest("button") || e.target.closest(".zpanel")) return; on = true; sx = e.clientX; sy = e.clientY; e.preventDefault(); });
  elm.addEventListener("pointermove", e => { if (!on) return; const dx = e.clientX - sx, dy = e.clientY - sy; if (Math.max(Math.abs(dx), Math.abs(dy)) < 22) return; on = false; Math.abs(dx) > Math.abs(dy) ? fn(dx > 0 ? 1 : -1, 0) : fn(0, dy > 0 ? 1 : -1); });
  elm.addEventListener("pointerup", () => on = false); elm.addEventListener("pointercancel", () => on = false);
}
swipe($("swrap"), sTurn);
const KEYDIR = { ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0], w: [0, -1], s: [0, 1], a: [-1, 0], d: [1, 0] };
document.addEventListener("keydown", e => { const d = KEYDIR[e.key]; if (!d) return; if (active === "snake") { e.preventDefault(); sTurn(d[0], d[1]); } else if (active === "fetch" && d[1] === 0) { e.preventDefault(); FB.key = d[0]; } });
window.addEventListener("resize", () => { if (active === "snake" && SN.state !== "play") sIdle(); });

// ================= ARCADE: FETCH BREAKOUT =================
// Arkanoid-style: drag the dog bed, bounce the tennis ball, smash rows of treat bricks.
const FB = { state: "idle", W: 0, H: 0, dpr: 1, raf: 0, last: 0, px: 0, tx: 0, pw: 84, key: 0, balls: [], caps: [], shots: [], fx: {}, stuck: true, bricks: [], level: 1, score: 0, lives: 3, hurt: 0, pops: [] };
const TREATS = [["🦴", "#f3ead7"], ["🥓", "#f2a6a0"], ["🧀", "#f6d36b"], ["🍪", "#d9a86c"], ["🍖", "#e98d6b"], ["🥩", "#e57a7a"]];
function fSize() {
  const w = $("fwrap"), c = $("fc"), r = w.getBoundingClientRect();
  FB.dpr = Math.min(window.devicePixelRatio || 1, 2); FB.W = r.width; FB.H = r.height;
  c.width = Math.round(r.width * FB.dpr); c.height = Math.round(r.height * FB.dpr);
  FB.pw = Math.max(70, Math.min(110, r.width * 0.22));
}
// Power-ups drop from smashed treats: catch the capsule with the bed.
const FPUPS = [
  { k: "multi", e: "🎾", c: "#7cff6b", n: "MULTI BALL", w: 3 },
  { k: "wide", e: "↔️", c: "#4dd0e1", n: "BIG BED", w: 3, dur: 12 },
  { k: "fire", e: "🔥", c: "#ff7043", n: "FIRE BALL", w: 2, dur: 8 },
  { k: "laser", e: "📣", c: "#ffd23f", n: "BARK BLASTER", w: 2, dur: 8 },
  { k: "slow", e: "🐌", c: "#b39ddb", n: "SLOW-MO", w: 2, dur: 10 },
  { k: "life", e: "❤️", c: "#ff5c8a", n: "EXTRA BALL", w: 1 },
  { k: "tiny", e: "🔻", c: "#9e9e9e", n: "TINY BED", w: 2, dur: 10 }
];
function fPick() { const tot = FPUPS.reduce((a, p) => a + p.w, 0); let r = Math.random() * tot; for (const p of FPUPS) { r -= p.w; if (r <= 0) return p; } return FPUPS[0]; }
function fLevel() {
  const cols = 7, rows = Math.min(8, 3 + FB.level), gap = 5, bw = (FB.W - 20 - gap * (cols - 1)) / cols, bh = 22, pat = (FB.level - 1) % 4;
  FB.bricks = [];
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    if (pat === 1 && Math.abs(c - 3) > r) continue;          // pyramid
    if (pat === 2 && (r + c) % 2) continue;                    // checkerboard
    if (pat === 3 && (c === 1 || c === 5) && r % 3 !== 0) continue; // pillars
    const hp = FB.level >= 4 && r === 0 ? 3 : FB.level >= 2 && r <= (FB.level >= 5 ? 1 : 0) ? 2 : 1;
    FB.bricks.push({ x: 10 + c * (bw + gap), y: 54 + r * (bh + gap), w: bw, h: bh, hp, max: hp, t: TREATS[(r + FB.level - 1) % TREATS.length] });
  }
  FB.caps = []; FB.shots = []; FB.fx = {}; fStick();
}
function fStick() { const py = FB.H - 64; FB.stuck = true; FB.balls = [{ x: FB.px, y: py - 9, vx: 0, vy: 0 }]; }
function fReset() { FB.level = 1; FB.score = 0; FB.lives = 3; FB.px = FB.tx = FB.W / 2; FB.pops = []; FB.msg = null; FB.fx = {}; fLevel(); }
function fSpeed() { return Math.min(580, 350 + FB.level * 30); }
function fLaunch() { if (FB.state !== "play" || !FB.stuck) return; FB.stuck = false; const a = -Math.PI / 2 + (Math.random() - 0.5) * 0.7, sp = fSpeed(); FB.balls.forEach(b => { b.vx = Math.cos(a) * sp; b.vy = Math.sin(a) * sp; }); chime("pop"); }
function fGo() { $("fpanel").hidden = true; fSize(); fReset(); FB.state = "play"; FB.last = performance.now(); fLoop(); }
function fLoop() {
  cancelAnimationFrame(FB.raf);
  FB.raf = requestAnimationFrame(now => { const dt = Math.min(0.033, (now - FB.last) / 1000); FB.last = now; if (FB.state === "play") fStep(dt); fDraw(); if (FB.state === "play") fLoop(); });
}
function fBedW() { return FB.pw * (FB.fx.wide > 0 ? 1.6 : FB.fx.tiny > 0 ? 0.6 : 1); }
function fBreak(b, by) {
  b.hp--; if (b.hp > 0) return;
  FB.score += 10 * FB.level; FB.pops.push({ x: b.x + b.w / 2, y: b.y + b.h / 2, t: 0.4, e: b.t[0] }); chime("pop");
  if (Math.random() < 0.17 && FB.caps.length < 3) FB.caps.push(Object.assign({ x: b.x + b.w / 2, y: b.y + b.h / 2 }, { p: fPick() }));
}
function fPower(p) {
  FB.msg = { t: 1.3, txt: p.n, c: p.c }; chime("win");
  if (p.k === "multi") { const add = []; FB.balls.forEach(b => { const sp = Math.hypot(b.vx, b.vy) || fSpeed(), a = Math.atan2(b.vy || -1, b.vx); [-0.4, 0.4].forEach(d => add.push({ x: b.x, y: b.y, vx: Math.cos(a + d) * sp, vy: Math.sin(a + d) * sp })); }); FB.balls = FB.balls.concat(add).slice(0, 12); if (FB.stuck) fLaunch(); }
  else if (p.k === "life") FB.lives = Math.min(5, FB.lives + 1);
  else { FB.fx[p.k] = p.dur; if (p.k === "wide") FB.fx.tiny = 0; if (p.k === "tiny") FB.fx.wide = 0; }
}
function fStep(dt) {
  const py = FB.H - 64, R = 9;
  Object.keys(FB.fx).forEach(k => { if (FB.fx[k] > 0) FB.fx[k] -= dt; });
  if (FB.msg) { FB.msg.t -= dt; if (FB.msg.t <= 0) FB.msg = null; }
  const pw = fBedW();
  if (FB.key) FB.tx += FB.key * 420 * dt;
  FB.tx = Math.max(pw / 2 + 4, Math.min(FB.W - pw / 2 - 4, FB.tx));
  FB.px += (FB.tx - FB.px) * Math.min(1, dt * 18);
  // falling power-up capsules
  FB.caps.forEach(cp => { cp.y += 150 * dt; if (!cp.got && cp.y + 10 >= py && cp.y - 10 <= py + 14 && Math.abs(cp.x - FB.px) <= pw / 2 + 14) { cp.got = 1; fPower(cp.p); } });
  FB.caps = FB.caps.filter(cp => !cp.got && cp.y < FB.H + 20);
  // bark blaster: the bed shoots bones up
  if (FB.fx.laser > 0 && !FB.stuck) { FB.shotT = (FB.shotT || 0) - dt; if (FB.shotT <= 0) { FB.shotT = 0.32; FB.shots.push({ x: FB.px - pw / 2 + 8, y: py }, { x: FB.px + pw / 2 - 8, y: py }); } }
  FB.shots.forEach(s => { s.y -= 620 * dt; const b = FB.bricks.find(b => b.hp > 0 && s.x >= b.x && s.x <= b.x + b.w && s.y >= b.y && s.y <= b.y + b.h); if (b) { s.gone = 1; fBreak(b); } });
  FB.shots = FB.shots.filter(s => !s.gone && s.y > 30);
  if (FB.stuck) { FB.balls[0].x = FB.px; FB.balls[0].y = py - R; }
  else {
    const slow = FB.fx.slow > 0 ? 0.65 : 1, fire = FB.fx.fire > 0, n = 4;
    for (const ball of FB.balls) for (let i = 0; i < n && !ball.lost; i++) {
      const ox = ball.x, oy = ball.y; ball.x += ball.vx * slow * dt / n; ball.y += ball.vy * slow * dt / n;
      if (ball.x < R) { ball.x = R; ball.vx = Math.abs(ball.vx); } if (ball.x > FB.W - R) { ball.x = FB.W - R; ball.vx = -Math.abs(ball.vx); }
      if (ball.y < 30 + R) { ball.y = 30 + R; ball.vy = Math.abs(ball.vy); }
      if (ball.vy > 0 && ball.y + R >= py && ball.y + R <= py + 14 && Math.abs(ball.x - FB.px) <= pw / 2 + R) {
        const off = (ball.x - FB.px) / (pw / 2), sp = Math.min(fSpeed() + 40, Math.hypot(ball.vx, ball.vy) * 1.01), a = -Math.PI / 2 + Math.max(-1, Math.min(1, off)) * 1.05;
        ball.vx = Math.cos(a) * sp; ball.vy = Math.sin(a) * sp; ball.y = py - R; chime("pop");
      }
      for (const b of FB.bricks) {
        if (b.hp <= 0 || ball.x + R < b.x || ball.x - R > b.x + b.w || ball.y + R < b.y || ball.y - R > b.y + b.h) continue;
        if (fire) { b.hp = 1; fBreak(b); continue; } // fire ball plows straight through
        if (oy + R <= b.y || oy - R >= b.y + b.h) ball.vy = -ball.vy; else ball.vx = -ball.vx;
        ball.x = ox; ball.y = oy; fBreak(b);
        break;
      }
      if (ball.y > FB.H + R) ball.lost = 1;
    }
    FB.balls = FB.balls.filter(b => !b.lost);
    if (!FB.balls.length) {
      FB.lives--; chime("lose"); if (navigator.vibrate) try { navigator.vibrate(40); } catch (e) {}
      FB.fx = {}; FB.caps = []; FB.shots = [];
      if (FB.lives <= 0) { fDie(); return; }
      toast(`${FB.lives} ball${FB.lives > 1 ? "s" : ""} left`, 1000); fStick(); return;
    }
  }
  FB.pops.forEach(p => p.t -= dt); FB.pops = FB.pops.filter(p => p.t > 0);
  if (!FB.bricks.some(b => b.hp > 0)) { FB.score += 100 * FB.level; FB.level++; chime("win"); toast(`Level ${FB.level}! 🎾`, 1200); fLevel(); }
}
function fDie() { FB.state = "over"; fDraw(); arcOver("fetch", FB.score, $("fpanel"), fIdle, FB.level >= 3 ? hype(HYPE.win, 70 + FB.level) : "Ball's gone."); }
function fDraw() {
  const c = $("fc").getContext("2d"), W = FB.W, H = FB.H, py = H - 64, pw = fBedW();
  c.setTransform(FB.dpr, 0, 0, FB.dpr, 0, 0);
  const g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, "#1f3b73"); g.addColorStop(1, "#3c6fb0"); c.fillStyle = g; c.fillRect(0, 0, W, H);
  c.fillStyle = "rgba(255,255,255,0.06)"; for (let y = 0; y < H; y += 4) c.fillRect(0, y, W, 2); // CRT scanlines
  c.textAlign = "center"; c.textBaseline = "middle";
  FB.bricks.forEach(b => {
    if (b.hp <= 0) return;
    c.fillStyle = b.hp >= 3 ? "#8e8e9c" : b.hp > 1 ? "#c7c7d1" : b.t[1]; c.fillRect(b.x, b.y, b.w, b.h);
    c.fillStyle = "rgba(255,255,255,0.45)"; c.fillRect(b.x, b.y, b.w, 3); c.fillStyle = "rgba(0,0,0,0.22)"; c.fillRect(b.x, b.y + b.h - 3, b.w, 3);
    c.font = '14px system-ui, "Apple Color Emoji"'; c.fillText(b.hp > 1 ? "🔩" : b.t[0], b.x + b.w / 2, b.y + b.h / 2 + 1);
  });
  FB.pops.forEach(p => { c.globalAlpha = p.t / 0.4; c.font = '20px system-ui, "Apple Color Emoji"'; c.fillText(p.e, p.x, p.y - (0.4 - p.t) * 40); c.globalAlpha = 1; });
  (FB.caps || []).forEach(cp => { c.fillStyle = cp.p.c; c.beginPath(); if (c.roundRect) c.roundRect(cp.x - 17, cp.y - 11, 34, 22, 11); else c.rect(cp.x - 17, cp.y - 11, 34, 22); c.fill(); c.strokeStyle = "#fff"; c.lineWidth = 2; c.stroke(); c.font = '14px system-ui, "Apple Color Emoji"'; c.fillText(cp.p.e, cp.x, cp.y + 1); });
  (FB.shots || []).forEach(s => { c.font = '13px system-ui, "Apple Color Emoji"'; c.fillText("🦴", s.x, s.y); });
  // dog bed paddle with the Big Dawg riding it
  c.fillStyle = FB.fx.wide > 0 ? "#2a7f8a" : FB.fx.tiny > 0 ? "#6b6b6b" : "#8a4b2a"; c.beginPath(); if (c.roundRect) c.roundRect(FB.px - pw / 2, py, pw, 14, 7); else c.rect(FB.px - pw / 2, py, pw, 14); c.fill();
  c.fillStyle = "#e9c48f"; c.fillRect(FB.px - pw / 2 + 8, py + 3, pw - 16, 5);
  if (FB.fx.laser > 0) { c.font = '14px system-ui, "Apple Color Emoji"'; c.fillText("📣", FB.px - pw / 2 + 8, py - 6); c.fillText("📣", FB.px + pw / 2 - 8, py - 6); }
  const img = zFace(FB.state === "over" ? ":dawgpain:" : FB.stuck ? ":dawgpog:" : ":dawgW:"); if (img.complete) c.drawImage(img, FB.px - 15, py + 12, 30, 30);
  (FB.balls || []).forEach(b => { if (FB.fx.fire > 0) { c.fillStyle = "rgba(255,112,67,0.45)"; c.beginPath(); c.arc(b.x, b.y, 14, 0, 7); c.fill(); } c.font = '18px system-ui, "Apple Color Emoji"'; c.fillText("🎾", b.x, b.y + 1); });
  c.font = "11px 'Press Start 2P', monospace"; c.fillStyle = "#fff"; c.textAlign = "left"; c.fillText(`SCORE ${FB.score}`, 10, 16);
  c.textAlign = "right"; c.fillText("🎾".repeat(Math.max(0, FB.lives)), W - 8, 16);
  c.textAlign = "center"; c.fillStyle = "#ffd23f"; c.fillText(`LEVEL ${FB.level}`, W / 2, 16);
  const act = FPUPS.filter(p => p.dur && FB.fx && FB.fx[p.k] > 0); if (act.length) { c.font = '12px system-ui, "Apple Color Emoji"'; c.textAlign = "left"; act.forEach((p, i) => { c.fillStyle = "#fff"; c.fillText(`${p.e}${Math.ceil(FB.fx[p.k])}`, 10 + i * 44, 38); }); c.textAlign = "center"; }
  if (FB.msg) { c.font = "14px 'Press Start 2P', monospace"; c.fillStyle = "rgba(0,0,0,0.5)"; c.fillText(FB.msg.txt, W / 2 + 2, H * 0.55 + 2); c.fillStyle = FB.msg.c; c.fillText(FB.msg.txt, W / 2, H * 0.55); }
  if (FB.state === "play" && FB.stuck) { c.fillStyle = "#fff"; c.font = "10px 'Press Start 2P', monospace"; c.fillText("TAP TO LAUNCH", W / 2, py - 60); }
}
function fIdle() { cancelAnimationFrame(FB.raf); FB.state = "idle"; fSize(); fReset(); fDraw(); arcStart("fetch", $("fpanel"), fGo); }
function fShown() { requestAnimationFrame(fIdle); if (!arcade) refreshArcade(); }
function fHidden() { if (FB.state === "play") FB.state = "idle"; cancelAnimationFrame(FB.raf); }
(function () {
  const w = $("fwrap"); let drag = false, moved = 0, sx = 0;
  const at = e => { const r = w.getBoundingClientRect(); FB.tx = e.clientX - r.left; };
  w.addEventListener("pointerdown", e => { if (e.target.closest("button") || e.target.closest(".zpanel")) return; drag = true; moved = 0; sx = e.clientX; at(e); e.preventDefault(); });
  w.addEventListener("pointermove", e => { if (!drag) return; moved = Math.max(moved, Math.abs(e.clientX - sx)); at(e); });
  w.addEventListener("pointerup", () => { if (drag && moved < 12) fLaunch(); drag = false; });
  w.addEventListener("pointercancel", () => drag = false);
  document.addEventListener("keyup", e => { if (KEYDIR[e.key] && KEYDIR[e.key][1] === 0) FB.key = 0; });
  document.addEventListener("keydown", e => { if (active === "fetch" && (e.code === "Space" || e.key === "ArrowUp")) { e.preventDefault(); fLaunch(); } });
})();
window.addEventListener("resize", () => { if (active === "fetch" && FB.state !== "play") fIdle(); });

// ================= ARCADE ENGINE (shared by the newer games) =================
// Each game registers with defGame({...}). The engine handles the canvas, sizing, the game loop,
// touch/keyboard input, start/game-over screens, best scores and dares.
//
// Game definition fields:
//   key, name, icon, blurb, how, max   (max = highest believable score)
//   reset(G)            set up a fresh game (also used for the idle preview behind the start panel)
//   update(G, dt)       advance one frame (dt in seconds, already clamped)
//   draw(G, c)          paint the canvas (c is a 2D context already scaled to CSS pixels)
//   down/move/up(G,x,y) optional pointer handlers (x,y in CSS px inside the canvas)
//   swipe(G, dx, dy)    optional: called with -1/0/1 direction when the finger flicks 22px+
//   tap(G, x, y)        optional: a press that didn't turn into a swipe
//   onKey(G, k, isDown) optional: keyboard (k is e.key)
//   G.over(score, title) ends the run.  G.W/G.H are the canvas size in CSS px.
const GAMEDEFS = {};
function defGame(d) { const m = GAMEDEFS[d.key]; GAMEDEFS[d.key] = d; if (m && m.lazy) d.loaded = true; }
// Fast site: the menu only needs each game's name/icon; the game code itself is fetched the first time you open it.
function defGameMeta(list) { list.forEach(m => { if (!GAMEDEFS[m.key]) GAMEDEFS[m.key] = Object.assign({ lazy: m.file }, m); }); }
const gLoading = {};
function loadGame(key) {
  const d = GAMEDEFS[key]; if (!d || !d.lazy || d.update) return Promise.resolve(GAMEDEFS[key]);
  if (gLoading[d.lazy]) return gLoading[d.lazy];
  return gLoading[d.lazy] = new Promise((res, rej) => {
    const sc = document.createElement("script"); sc.src = "games/" + d.lazy + (window.GAMES_V ? "?v=" + GAMES_V : "");
    sc.onload = () => { const r = GAMEDEFS[key]; if (r && r.update) res(r); else rej(new Error("bad game file")); };
    sc.onerror = () => { delete gLoading[d.lazy]; rej(new Error("offline")); };
    document.head.appendChild(sc);
  });
}
const G = { key: null, def: null, state: "idle", W: 0, H: 0, dpr: 1, raf: 0, last: 0, t: 0, s: {} };
G.face = code => zFace(code);
G.dark = () => zDark();
G.sfx = k => chime(k);
G.buzz = () => { if (navigator.vibrate) try { navigator.vibrate(35); } catch (e) {} };
G.emoji = (c, ch, x, y, size) => { c.font = `${Math.round(size)}px system-ui, "Apple Color Emoji", "Segoe UI Emoji"`; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText(ch, x, y); };
G.text = (c, str, x, y, size, color, align) => { c.font = `${Math.round(size)}px 'Press Start 2P', ui-monospace, monospace`; c.fillStyle = color || "#fff"; c.textAlign = align || "center"; c.textBaseline = "middle"; c.fillText(str, x, y); };
G.img = (c, code, x, y, size, rot) => { const im = zFace(code); if (!im.complete) return; c.save(); c.translate(x, y); if (rot) c.rotate(rot); c.drawImage(im, -size / 2, -size / 2, size, size); c.restore(); };
// Shared look for every game's top bar: G.hud(c, left, center, right, {h, color}) draws a dark translucent bar
// with three pixel-font labels. Use it instead of hand-placing HUD text so all games look consistent.
G.hud = (c, left, center, right, o = {}) => {
  const h = o.h || 34;
  c.save(); c.fillStyle = o.bg || "rgba(10,10,20,0.62)"; c.fillRect(0, 0, G.W, h);
  c.fillStyle = "rgba(255,255,255,0.12)"; c.fillRect(0, h - 2, G.W, 2);
  const sz = Math.max(10, Math.min(13, G.W / 30));
  if (left) G.text(c, left, 10, h / 2, sz, "#fff", "left");
  if (center) G.text(c, center, G.W / 2, h / 2, sz, o.color || "#ffd23f");
  if (right) G.text(c, right, G.W - 10, h / 2, sz, "#fff", "right");
  c.restore(); return h;
};
// A rounded hint pill near the bottom (e.g. "SWIPE UP TO KICK") that fades out after `secs` seconds of play.
G.hint = (c, msg, secs = 4, y) => {
  const a = Math.max(0, Math.min(1, secs - G.t)); if (a <= 0 || !msg) return;
  c.save(); c.globalAlpha = a; const sz = Math.max(10, Math.min(12, G.W / 34));
  c.font = `${sz}px 'Press Start 2P', ui-monospace, monospace`; const w = c.measureText(msg).width + 28, yy = y || G.H - 34;
  c.fillStyle = "rgba(0,0,0,0.6)"; c.beginPath(); if (c.roundRect) c.roundRect(G.W / 2 - w / 2, yy - 15, w, 30, 15); else c.rect(G.W / 2 - w / 2, yy - 15, w, 30); c.fill();
  G.text(c, msg, G.W / 2, yy, sz, "#fff"); c.restore();
};
// Playing cards for the card games. card = { r: 1..14 (11 J, 12 Q, 13 K, 14 or 1 = A), s: 0 ♠ 1 ♥ 2 ♦ 3 ♣ }.
// G.card(c, x, y, w, card, faceUp, { hl, dim, rot }) draws a card centered at x,y (height = 1.4 * width).
G.SUIT = ["♠", "♥", "♦", "♣"];
G.rankTxt = r => r === 1 || r === 14 ? "A" : r === 11 ? "J" : r === 12 ? "Q" : r === 13 ? "K" : String(r);
G.card = (c, x, y, w, card, up, o = {}) => {
  const h = w * 1.4, r = w * 0.12;
  c.save(); c.translate(x, y); if (o.rot) c.rotate(o.rot); if (o.dim) c.globalAlpha = 0.45;
  const rr = (x0, y0, ww, hh, rad) => { c.beginPath(); if (c.roundRect) c.roundRect(x0, y0, ww, hh, rad); else c.rect(x0, y0, ww, hh); };
  c.fillStyle = "rgba(0,0,0,0.28)"; rr(-w / 2 + 2, -h / 2 + 3, w, h, r); c.fill();
  if (!up) {
    c.fillStyle = "#fff"; rr(-w / 2, -h / 2, w, h, r); c.fill();
    const gr = c.createLinearGradient(-w / 2, -h / 2, w / 2, h / 2); gr.addColorStop(0, "#c62828"); gr.addColorStop(1, "#8e1b1b");
    c.fillStyle = gr; rr(-w / 2 + 3, -h / 2 + 3, w - 6, h - 6, r * 0.7); c.fill();
    c.save(); rr(-w / 2 + 3, -h / 2 + 3, w - 6, h - 6, r * 0.7); c.clip();
    c.strokeStyle = "rgba(255,255,255,0.3)"; c.lineWidth = 1;
    for (let k = -h; k < h; k += 7) { c.beginPath(); c.moveTo(-w / 2, k); c.lineTo(w / 2, k + w); c.stroke(); }
    c.restore();
    G.emoji(c, "🐾", 0, 0, w * 0.42);
  } else {
    c.fillStyle = "#fffdf7"; rr(-w / 2, -h / 2, w, h, r); c.fill();
    c.strokeStyle = o.hl ? "#ffb300" : "rgba(0,0,0,0.25)"; c.lineWidth = o.hl ? 3 : 1; rr(-w / 2, -h / 2, w, h, r); c.stroke();
    const red = card.s === 1 || card.s === 2, col = red ? "#d32f2f" : "#1a1a1a", rk = G.rankTxt(card.r), su = G.SUIT[card.s];
    c.fillStyle = col; c.textAlign = "center"; c.textBaseline = "middle";
    const fs = Math.round(w * 0.3);
    c.font = `800 ${fs}px system-ui, -apple-system, sans-serif`; c.fillText(rk, -w / 2 + w * 0.2, -h / 2 + fs * 0.75);
    c.font = `${Math.round(fs * 0.9)}px system-ui, sans-serif`; c.fillText(su, -w / 2 + w * 0.2, -h / 2 + fs * 1.65);
    c.save(); c.rotate(Math.PI); c.font = `800 ${fs}px system-ui, sans-serif`; c.fillText(rk, -w / 2 + w * 0.2, -h / 2 + fs * 0.75); c.font = `${Math.round(fs * 0.9)}px system-ui, sans-serif`; c.fillText(su, -w / 2 + w * 0.2, -h / 2 + fs * 1.65); c.restore();
    if (card.r >= 11 && card.r <= 13) {
      c.fillStyle = red ? "rgba(211,47,47,0.1)" : "rgba(0,0,0,0.07)"; rr(-w * 0.28, -h * 0.28, w * 0.56, h * 0.56, 6); c.fill();
      G.img(c, card.r === 11 ? ":dawgsus:" : card.r === 12 ? ":dawgpog:" : ":dawgW:", 0, h * 0.02, w * 0.5);
      if (card.r === 13) G.emoji(c, "👑", 0, -h * 0.2, w * 0.24);
      if (card.r === 12) G.emoji(c, "🎀", w * 0.14, -h * 0.17, w * 0.2);
    } else { c.fillStyle = col; c.font = `${Math.round(w * 0.55)}px system-ui, sans-serif`; c.fillText(su, 0, h * 0.04); }
  }
  c.restore();
};
// Big centered banner text with a shadow ("GOAL!", "STRIKE!").
G.banner = (c, msg, color, y, size) => {
  c.save(); const sz = size || Math.max(18, Math.min(30, G.W / 13));
  G.text(c, msg, G.W / 2 + 2, (y || G.H * 0.42) + 3, sz, "rgba(0,0,0,0.55)"); G.text(c, msg, G.W / 2, y || G.H * 0.42, sz, color || "#ffd23f"); c.restore();
};
// ---- Puzzle mode (The Den's daily puzzles: `puzzle: true`) ----
// These look and behave like the main four: no start screen, no replays, no dares or medals. The game posts its
// score once with G.post(score, info) and shows a results card; G.results(info) re-opens it without posting.
// info = { title, sub, share, score }.  G.pbar / G.pill draw the clean NYT-style top bar and buttons.
G.UI = 'system-ui, -apple-system, "Segoe UI", sans-serif';
G.TITLE = '"Zilla Slab", Rockwell, Georgia, serif';
G.pbar = (c, left, center, right) => {
  const dk = G.dark(), h = 40; c.save(); c.fillStyle = dk ? "#121213" : "#fff"; c.fillRect(0, 0, G.W, h);
  c.fillStyle = dk ? "#2c2c2e" : "#e3e3e3"; c.fillRect(0, h - 1, G.W, 1);
  c.fillStyle = dk ? "#fff" : "#121213"; c.textBaseline = "middle"; c.font = `600 15px ${G.UI}`;
  if (left) { c.textAlign = "left"; c.fillText(left, 14, h / 2); }
  if (center) { c.textAlign = "center"; c.font = `700 15px ${G.UI}`; c.fillText(center, G.W / 2, h / 2); c.font = `600 15px ${G.UI}`; }
  if (right) { c.textAlign = "right"; c.fillText(right, G.W - 14, h / 2); }
  c.restore(); return h;
};
G.pill = (c, x, y, w, h, label, solid, off) => {
  const dk = G.dark(), ink = dk ? "#fff" : "#121213", bg = dk ? "#121213" : "#fff";
  c.save(); if (off) c.globalAlpha = 0.35; c.beginPath(); if (c.roundRect) c.roundRect(x + 0.75, y + 0.75, w - 1.5, h - 1.5, h / 2); else c.rect(x, y, w, h);
  c.fillStyle = solid ? ink : bg; c.fill(); c.strokeStyle = ink; c.lineWidth = 1.5; c.stroke();
  c.fillStyle = solid ? bg : ink; c.font = `600 ${Math.min(15, h * 0.36)}px ${G.UI}`; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText(label, x + w / 2, y + h / 2 + 1);
  c.restore(); return { x, y, w, h };
};
G.post = (score, info) => {
  score = Math.max(0, Math.floor(score || 0)); info = Object.assign({ score }, info || {});
  let refresh = null; try { setBest(G.key, score); } catch (e) {}
  refresh = puzzleResults(G.key, info);
  if (score > 0 && me) { const pr = postArcade(G.key, score, KEY); if (pr && pr.then) pr.then(() => refresh && refresh()); }
};
G.results = info => puzzleResults(G.key, info || {});
G.postQuiet = score => { score = Math.max(0, Math.floor(score || 0)); try { setBest(G.key, score); } catch (e) {} if (score > 0 && me) postArcade(G.key, score, KEY); };
// Save & continue: a game with save(G) -> {label, ...} (or null when it's not a good moment) and load(G, snap)
// gets a checkpoint per player, written about once a second and when the app is hidden. Cleared when the run ends.
const gSaveKey = k => "bdd:gsave:" + k + ":" + (me ? me.id : "");
function gCheckpoint() { if (G.state !== "play" || !G.def || !G.def.save) return; try { const sn = G.def.save(G); if (sn) store.set(gSaveKey(G.key), sn); } catch (e) {} }
G.saved = k => GAMEDEFS[k] && GAMEDEFS[k].save ? store.get(gSaveKey(k)) : null;
G.dropSave = k => store.del(gSaveKey(k));
G.over = (score, title) => {
  if (G.state !== "play") return;
  G.dropSave(G.key);
  G.state = "over"; cancelAnimationFrame(G.raf); gPaint();
  arcOver(G.key, Math.max(0, Math.floor(score || 0)), $("gpanel"), gIdle, title);
};
function gSize() {
  const w = $("gwrap"), c = $("gc"), r = w.getBoundingClientRect();
  G.dpr = Math.min(window.devicePixelRatio || 1, 2); G.W = r.width; G.H = r.height;
  c.width = Math.round(r.width * G.dpr); c.height = Math.round(r.height * G.dpr);
}
function gPaint() { const c = $("gc").getContext("2d"); c.setTransform(G.dpr, 0, 0, G.dpr, 0, 0); c.save(); try { G.def.draw(G, c); } finally { c.restore(); } }
function gIdle() {
  cancelAnimationFrame(G.raf); G.state = "idle"; gSize(); G.s = {}; G.t = 0;
  if (G.def.puzzle) { $("gpanel").hidden = true; return gGo(); } // puzzles open straight to today's board
  G.def.reset(G); gPaint();
  arcStart(G.key, $("gpanel"), gGo);
}
function gGo(resume) {
  $("gpanel").hidden = true; gSize(); G.s = {}; G.t = 0; G.def.reset(G);
  if (resume && G.def.load) { try { G.def.load(G, resume); G.t = 99; } catch (e) { G.def.reset(G); } }
  G.ck = 0;
  G.state = "play"; G.last = performance.now(); gLoop();
}
function gLoop() {
  cancelAnimationFrame(G.raf);
  G.raf = requestAnimationFrame(now => {
    if (G.state !== "play") return;
    const dt = Math.min(0.033, Math.max(0, (now - G.last) / 1000)); G.last = now; G.t += dt;
    G.def.update(G, dt);
    G.ck = (G.ck || 0) + dt; if (G.ck > 1) { G.ck = 0; gCheckpoint(); }
    if (G.state === "play") { gPaint(); gLoop(); }
  });
}
function gShown() { requestAnimationFrame(gIdle); if (!arcade) refreshArcade(); }
function gHidden() { try { if (G.state === "play" && G.def && G.def.leave) G.def.leave(G); } catch (e) {} gCheckpoint(); if (G.state === "play") G.state = "idle"; cancelAnimationFrame(G.raf); }
// Open any arcade game by key (the three original games keep their own screens).
function playGame(key) {
  try { store.set("bdd:recent", [key].concat((store.get("bdd:recent") || []).filter(k => k !== key)).slice(0, 6)); } catch (e) {}
  if (key === "zoomies" || key === "snake" || key === "fetch") { show(key); return; }
  let d = GAMEDEFS[key]; if (!d) return;
  if (!d.update) { toast("Loading " + d.name + "…", 1500); loadGame(key).then(() => playGame(key)).catch(() => toast("Couldn't load the game. Check your connection.", 2400)); return; }
  if (G.state === "play") gHidden();
  G.key = key; G.def = d; $("g-title").textContent = d.name; $("g-back").dataset.go = d.cat || "arcade";
  $("v-game").classList.toggle("puzzle", !!d.puzzle); if ($("g-help")) $("g-help").hidden = !d.puzzle;
  if (active === "game") gShown(); else show("game");
}
document.addEventListener("click", e => { const b = e.target.closest("[data-play]"); if (b) playGame(b.dataset.play); });
(function () {
  const w = $("gwrap"); let on = false, sx = 0, sy = 0, swiped = false;
  const pt = e => { const r = w.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
  w.addEventListener("pointerdown", e => {
    if (e.target.closest("button") || e.target.closest(".zpanel") || G.state !== "play") return;
    e.preventDefault(); on = true; swiped = false; sx = e.clientX; sy = e.clientY;
    const [x, y] = pt(e); if (G.def.down) G.def.down(G, x, y);
  });
  w.addEventListener("pointermove", e => {
    if (!on || G.state !== "play") return;
    const [x, y] = pt(e); if (G.def.move) G.def.move(G, x, y);
    if (!swiped && G.def.swipe) { const dx = e.clientX - sx, dy = e.clientY - sy; if (Math.max(Math.abs(dx), Math.abs(dy)) >= 22) { swiped = true; Math.abs(dx) > Math.abs(dy) ? G.def.swipe(G, dx > 0 ? 1 : -1, 0) : G.def.swipe(G, 0, dy > 0 ? 1 : -1); } }
  });
  const end = e => {
    if (!on) return; on = false; if (G.state !== "play") return;
    const [x, y] = pt(e); if (G.def.up) G.def.up(G, x, y);
    if (!swiped && G.def.tap && Math.hypot(e.clientX - sx, e.clientY - sy) < 12) G.def.tap(G, x, y);
  };
  w.addEventListener("pointerup", end); w.addEventListener("pointercancel", () => on = false);
  const k = (e, d) => { if (active !== "game" || G.state !== "play" || !G.def.onKey) return; if (/^Arrow|^ $|^[wasd]$/.test(e.key)) e.preventDefault(); G.def.onKey(G, e.key, d); };
  document.addEventListener("keydown", e => k(e, true)); document.addEventListener("keyup", e => k(e, false));
  window.addEventListener("resize", () => { if (active === "game" && G.state !== "play") gIdle(); });
})();

defGameMeta([{"file": "g_airhockey.js", "key": "airhockey", "name": "Paw Hockey", "icon": "🏒", "blurb": "Air hockey vs the cat. First to 7.", "how": "Drag anywhere in the bottom half and your bulldog mallet follows just above your thumb. Swing through the puck fast to hit it hard, and bank it off the walls into the cat's goal at the top. First to 7 wins. Each goal is 100, a win is +500, and every shot on goal adds a little bonus. The cat starts sleepy but wakes up as the game goes on.", "cat": "sports", "max": 9999},
{"file": "g_archery.js", "key": "archery", "name": "Bow Wow", "icon": "🏹", "blurb": "Archery. 10 arrows, mind the wind.", "how": "Put your thumb down and drag to move the crosshair onto the target, then let go to shoot. The wind pushes your arrow (watch the flag), and if you hold too long your aim starts to wobble. 10 arrows, bullseye is 10. Perfect is 100.", "cat": "sports", "max": 100},
{"file": "g_blocks.js", "key": "blocks", "name": "Block Dawg", "icon": "🧱", "blurb": "Stack the blocks. Clear the lines.", "how": "Shapes fall into the well. Fill a whole row to clear it. Buttons: move ◀ ▶, rotate ⟳, drop ⤓. Or swipe left/right to move, swipe down to drop, tap the well to rotate. Tap the HOLD box to stash a piece for later (once per piece). The outline shows where it will land. 4 lines at once = big points. Don't let the stack reach the top!", "max": 9999999},
{"file": "g_boneball.js", "key": "boneball", "name": "Bone Ball", "icon": "🎾", "blurb": "Daily: balance the bones and balls.", "how": "Fill every square with a 🦴 or a 🎾. Each row and each column needs three of each. No more than two of the same can sit next to each other in a row or column. An = between two squares means they're the same; an × means they're different. Tap a square for a bone, again for a ball, again to clear. Gray squares are given. A new board every day, one go, one answer, and you never need to guess. Score: 700 for solving plus up to 300 for going quick. No clock on screen.", "cat": "den", "max": 1000, "puzzle": true},
{"file": "g_bowl.js", "key": "bowl", "name": "Bowl-a-Dawg", "icon": "🎳", "blurb": "10 frames. Swipe to roll. Curve it.", "how": "Swipe up from the bottom to roll. Where you start = where you stand, the swipe's direction = your aim, bend the swipe to hook it, flick faster for more speed. Hit the pocket (just beside the head pin) for strikes. 10 frames, real scoring, 300 is perfect.", "cat": "sports", "max": 300},
{"file": "g_crazy.js", "key": "crazy", "name": "Crazy Dawgs", "icon": "🎴", "blurb": "The color-matching card game vs 3 pups.", "how": "You vs Rex, Biscuit and Duke. Match the top card by color or by number/symbol. Skip ⊘ skips the next player, Reverse ⇄ flips direction, +2 makes the next player draw 2 and lose their turn, Wild lets you pick the color, Wild +4 picks the color and makes the next player draw 4. Can't play? Tap the deck to draw one (play it if it fits). Down to 2 cards? Tap BARK! before you play, or get caught and draw 2. Win a hand to score the cards left in everyone's hands (numbers = face value, action cards 20, wilds 50). First to 200 wins. Score: your points, +100 for winning the match.", "cat": "den", "max": 2000},
{"file": "g_crib.js", "key": "crib", "name": "Dawg Cribbage", "icon": "🎯", "blurb": "Cribbage vs Old Tom the cat. First to 121.", "how": "Two-player cribbage against Old Tom. Tap 2 cards to send to the crib, then TO CRIB. Then peg: take turns playing cards without going over 31 (15 and 31 = 2, pairs, runs, last card = 1). If you can't play, it's a Go. Then hands and the crib are counted for you, step by step. First to 121 wins; win before Tom reaches 91 for a skunk. Score: win = 100 + what you win by (+100 for a skunk).", "cat": "den", "max": 500},
{"file": "g_cross.js", "key": "cross", "name": "Dawg Crossing", "icon": "🚗", "blurb": "Cross the street. Don't get flattened.", "how": "Swipe (or tap above/below/left/right of the pup) to hop one square. Dodge the traffic, ride the logs and floats across the creek (no swimming!), and hop into an empty dog house. Fill all 5 houses to level up. 30 seconds per crossing, 3 lives.", "max": 99999},
{"file": "g_darts.js", "key": "darts", "name": "Dawg Darts", "icon": "🎯", "blurb": "10 rounds, 3 darts. Steady paws.", "how": "Touch and hold to aim (the crosshair floats just above your thumb). It wobbles like a shaky paw, worse the longer you hold. Let go to throw. 10 rounds of 3 darts. Triple ring x3, double ring x2, bull 50. Same number 3 times in a round = +50 hat trick.", "cat": "sports", "max": 9999},
{"file": "g_dash.js", "key": "dash", "name": "Dawg Dash", "icon": "🛹", "blurb": "Endless runner. Swipe to dodge trains.", "how": "Swipe LEFT or RIGHT to switch tracks, UP to jump the low barriers, DOWN to slide under the high bars. Trains block a whole track: dodge them, or run up a ramp onto the roof and hop from car to car (and across to trains on other tracks). Grab bones for points. 🧲 pulls bones in, ⭐ doubles points, 🛹 lets you survive one crash. It gets faster the longer you go.", "max": 999999},
{"file": "g_dawgball.js", "key": "dawgball", "name": "Dawg Ball", "icon": "🧢", "blurb": "3-inning baseball vs the Cats.", "how": "3 innings vs the Alley Cats. When you PITCH: pick Fastball, Curve or Changeup, then tap to stop the aim circle. Paint the corners and mix your pitches - the same pitch twice gets hit harder. When you BAT: a ring shows where the pitch will cross - tap anywhere when the shrinking ring closes on it (green = swing now). A RED ring is a ball: let it go. Score: runs x10, +50 for a win, +10 per strikeout.", "cat": "sports", "max": 999},
{"file": "g_derby.js", "key": "derby", "name": "Dawg Derby", "icon": "⚾", "blurb": "Home run derby. Time your swing.", "how": "The cat pitches, you tap anywhere to swing when the ball reaches the plate. Perfect timing = a moonshot. Any swing that isn't a homer is an out, and so is taking a strike. Balls wide of the plate are free: let them go. 10 outs. Score = total home-run feet.", "cat": "sports", "max": 99999},
{"file": "g_dig.js", "key": "dig", "name": "Dig Dawg", "icon": "⛏️", "blurb": "Dig tunnels, bark critters until they pop.", "how": "Press and drag in a direction to dig that way; let go to stop. Tap anywhere to BARK in the direction you're facing. Each bark puffs a mole or badger up a little; four barks and it pops. Stop barking and it shrinks back. Critters chase you through your tunnels and can sneak through dirt as ghostly eyes. Dig out the dirt under a 🪨 rock and it falls, squashing anything below (big points, and watch your own head). Deeper critters are worth more. Clear them all to go to the next yard. 3 lives.", "max": 999999},
{"file": "g_drip.js", "key": "drip", "name": "Dawg Drip", "icon": "👗", "blurb": "Style the pup. Win the runway.", "how": "Each round has a theme. You get 30 seconds: use the tabs at the bottom to pick a hat, top, eyewear, shoes, an accessory and a color. Hit WALK THE RUNWAY and 3 judges score theme match, color harmony and completeness. Perfect 10s earn bonus points. 5 rounds.", "max": 9999},
{"file": "g_drive.js", "key": "drive", "name": "Road Dawg", "icon": "🚙", "blurb": "Floor it. Weave through traffic.", "how": "Drag or hold anywhere: the car steers toward your finger. Quick tap = TURBO (3 s cooldown). Dodge traffic and oil slicks, stay off the grass, grab ⛽ before the tank runs dry. 🦴 = +50. 3 bonks and you're done.", "max": 99999},
{"file": "g_duck.js", "key": "duck", "name": "Duck Dawg", "icon": "🦆", "blurb": "Tap the ducks before they fly off.", "how": "Ducks flap up out of the grass. Tap them to pop them with the tennis-ball launcher. 3 shots per release, 10 ducks a round (2 at a time from round 3). Hit at least 6 of 10 to pass (it goes up later). 500+ points a duck, more each round, 10/10 = perfect bonus.", "cat": "sports", "max": 99999},
{"file": "g_dvz.js", "key": "dvz", "name": "Dawgs vs Zombies", "icon": "🧟", "blurb": "Lane defense. Hold the yard.", "how": "Zombies shuffle in from the right. Tap a defender you've placed to UPGRADE it (★2 from wave 2, ★3 from wave 4) or DIG it up for half your bones back. Tap falling 🦴 to collect bones. Tap a card at the top, then tap a square to post it: 🥣 Bowls make bones, 🎾 Launchers shoot, 🏠 Doghouses block, ❄️ Snow Pups slow them down, 💣 Bark Bombs blow up everything nearby. Each lane has one lawn mower for emergencies. If a zombie gets past it, game over.", "max": 99999},
{"file": "g_euchre.js", "key": "euchre", "name": "Dawg Euchre", "icon": "🃏", "blurb": "You + Biscuit vs the cats. First to 10.", "how": "Classic euchre with you and your partner Biscuit (top) against two cats. Round 1: order up the turned card for trump, or pass. Round 2: name a different suit (the dealer has to call: stick the dealer). Tap ALONE to play without your partner for 4 points. Follow suit if you can; the jack of trump (right bower) and the other jack of the same color (left bower) are the top trumps. 3-4 tricks = 1 point, all 5 = 2, euchred = 2 for the other team. First to 10. Score: win = 100 + 10 for every point you win by.", "cat": "den", "max": 300},
{"file": "g_fg.js", "key": "fg", "name": "Kick Dawg", "icon": "🏈", "blurb": "Field goals. Read the wind. Split the uprights.", "how": "Two taps per kick. TAP to lock the swinging AIM arrow, then TAP to lock the POWER meter (the white line is about the least power that gets there). WIND (the box, and the flags on the posts) bends the ball, so aim into it. Kicks run 20 to 60 yards and move around the field: first the hashes, then wide angles from out by the numbers. Each make scores its yards plus an angle bonus. Hit 1,000 points and you're in PRO RANGE: nothing shorter than 40 yards and the wind really picks up. 3 misses and you're done.", "cat": "sports", "max": 9999},
{"file": "g_golf.js", "key": "golf", "name": "Dawg Golf", "icon": "🏌️", "blurb": "Front nine, par 36. Three-tap swing. Mind the wind.", "how": "Tap to start the swing, tap again while the marker is in the GREEN ZONE around the PIN flag (it already counts wind, lie and roll) to hit it the right distance, then tap the blue spot on the way back to hit it straight. On the green, one tap in the green zone putts. The club is picked for you; tap the yellow CLUB bar to switch. Water costs a stroke, trees knock the ball down, pick up at 8. Par 36: fewest strokes wins.", "cat": "sports", "max": 72, "low": true, "fmt": n => n > 0 ? n + " (" + (n === 36 ? "E" : (n > 36 ? "+" : "") + (n - 36)) + ")" : "—"},
{"file": "g_golf.js", "key": "golf18", "name": "Dawg Golf 18", "icon": "🏌️", "blurb": "The full 18, par 74. Back nine plays longer and windier.", "how": "Tap to start the swing, tap again while the marker is in the GREEN ZONE around the PIN flag (it already counts wind, lie and roll) to hit it the right distance, then tap the blue spot on the way back to hit it straight. On the green, one tap in the green zone putts. The club is picked for you; tap the yellow CLUB bar to switch. Water costs a stroke, trees knock the ball down, pick up at 8. Par 74 over 18 holes: fewest strokes wins.", "cat": "sports", "max": 144, "low": true, "fmt": n => n > 0 ? n + " (" + (n === 74 ? "E" : (n > 74 ? "+" : "") + (n - 74)) + ")" : "—"},
{"file": "g_harvest.js", "key": "harvest", "name": "Harvest Dawg", "icon": "🚜", "blurb": "Drive a giant combine. Clear the crops.", "how": "Hold your thumb down and drag: the combine drives toward your finger and its giant header cuts everything it rolls over. Clear 90% of the field before the clock runs out to move on (plus bonus time). Rocks stop you dead and cost 3 seconds. Don't run over the cows. Wheat, then corn, then sunflowers: worth more each field.", "max": 99999},
{"file": "g_hive.js", "key": "hive", "name": "Dawg Hive", "icon": "🐝", "blurb": "Daily: make words from 7 letters.", "how": "Make words of 4 or more letters using the 7 letters. Every word must use the center letter, and letters can be used more than once. 4-letter words are worth 1 point; longer words are worth 1 point per letter. A word that uses all 7 letters is a pangram and earns 7 extra points. Climb the ranks from Pup to Big Dawg. Come back any time today; your score posts to the leaderboard as you go.", "cat": "den", "max": 999, "puzzle": true},
{"file": "g_hoops.js", "key": "hoops", "name": "Dawg Hoops", "icon": "🏀", "blurb": "60 seconds. Flick it in.", "how": "Flick up from the ball toward the hoop to shoot. Faster flick = more power, aim with the angle. 2 points a bucket, 3 in the last 15 seconds, +1 for a swish, and 3 in a row doubles your points. Past 20 points the hoop starts moving!", "cat": "sports", "max": 9999},
{"file": "g_hop.js", "key": "hop", "name": "Hydrant Hop", "icon": "🧯", "blurb": "Run, jump the hydrants, grab the bones.", "how": "The pup runs on his own. Tap anywhere to jump, tap again in the air to double jump. Hop hydrants, puddles, mailboxes and the mailman. Stay LOW under pigeons and frisbees. Bones are +10. One bonk and it's over.", "max": 99999},
{"file": "g_jump.js", "key": "jump", "name": "Pup Jump", "icon": "🐶", "blurb": "Bounce up forever. Don't look down.", "how": "The pup bounces by itself. Hold the left or right side of the screen (or drag) to steer. Fly off one edge to come out the other. Bones launch you sky high, boxes break after one bounce. Land on cats and squirrels to bop them (+50), but don't bump into them. Don't fall!", "max": 999999},
{"file": "g_kickret.js", "key": "kickret", "name": "Dawg Return", "icon": "🏈", "blurb": "Return the kick. Juke the cats. Score.", "how": "Catch the kickoff and run it back. Hold and drag anywhere to steer: the dog runs toward your finger and speeds up while you hold. Your pups block cats they touch. DOUBLE-TAP to juke: a quick spin move that makes any cat who dives at you whiff (+1 point each), then it recharges for a few seconds. Touchdown = 7 points and the cats get faster. Tackled = yards/10 points. 3 returns.", "cat": "sports", "max": 9999},
{"file": "g_leash.js", "key": "leash", "name": "Leash", "icon": "🦮", "blurb": "Daily: one path through every square.", "how": "Walk the dog! Drag from 1 and draw a single path that hits the numbers in order (1, 2, 3…) and fills every square on the board. Move up, down, left or right, never diagonally. Drag back over your path to undo, or tap any square on it to cut the path there. A new board every day, one go, and there's only one answer. Score: 700 for solving, plus a bonus of up to 300 for going quick. No clock on screen, so take your time.", "cat": "den", "max": 1000, "puzzle": true},
{"file": "g_mahjong.js", "key": "mahjong", "name": "Dawg Mahjong", "icon": "🀄", "blurb": "Daily: match pairs to clear the board.", "how": "Clear the board by matching pairs of the same tile. You can only take a tile that's free: nothing stacked on top of it, and its left or right side open. Free tiles are bright; blocked ones are shaded. Stuck? Hint shows a pair and Shuffle mixes the tiles left; each costs a few points. Same board for everyone, one go per day, always solvable. Score: 1000 for clearing the board, plus a bonus of up to 500 for going quick, minus a little for each hint or shuffle. No clock on screen, so take your time.", "cat": "den", "max": 1500, "puzzle": true},
{"file": "g_mjrush.js", "key": "mjrush", "name": "Mahjong Rush", "icon": "🀄", "blurb": "Endless tile matching vs the clock.", "how": "Match pairs of free tiles (nothing on top, left or right side open) before the clock runs out. Every match adds 2 seconds. Match again within 3 seconds to build a combo (x2, x3, up to x5) for bigger points. Clear the board for +25 seconds and a level bonus, then a new board deals. Out of matches? Shuffle is free but costs 5 seconds. Hint costs 5 seconds too.", "max": 999999},
{"file": "g_mjrush.js", "key": "mjzen", "name": "Mahjong Zen", "icon": "🍵", "blurb": "Relaxed endless tile matching. No clock.", "how": "The relaxed one: no clock, ever. Match pairs of free tiles (nothing on top, and the left or right side open). Clear a board and a new one deals. Hints and shuffles are free, and it reshuffles for you if you run out of matches. Leave any time; your board is saved. Tap Finish when you want to post your score: 10 per match and 200 per board cleared.", "max": 999999},
{"file": "g_party.js", "key": "party", "name": "Dawg Party", "icon": "🎉", "blurb": "5 random party minigames. One total score.", "how": "Five quick minigames, picked at random every run: Dawg Says, Floor Is Lava, Don't Wake Big Dawg, Face Lift, Tug of Woof and Treat Rain. Each one tells you what to do at the start. Your score is the total of all five.", "max": 1500},
{"file": "g_pips.js", "key": "pips", "name": "Dawg Pips", "icon": "🎲", "blurb": "Daily: place the dominoes to match every rule.", "how": "Three new domino puzzles every day: Easy, Medium and Hard. Tap a domino, tap ROTATE to turn it, then tap the board to drop it. Tap a placed domino to pick it back up. Every colored region has a rule: a number means its pips add up to that, = means all the same, ≠ means all different, < and > mean the total is under or over. Use every domino. One try each per day; progress is saved. Score: solving is worth most of Easy 1000 / Medium 2000 / Hard 3000, plus a small bonus for going quick. No clock on screen, so take your time.", "cat": "den", "max": 3000, "puzzle": true},
{"file": "g_pks.js", "key": "pks", "name": "Pup Kicks", "icon": "⚽", "blurb": "Penalty kicks. Beat the cat keeper.", "how": "Flick up from the ball toward the goal. Aim left or right, flick longer to shoot higher (too long sails over). Bend your flick to curl it. Top corners are worth +50. The cat keeper learns your favorite side, so mix it up. 3 misses and you're out.", "cat": "sports", "max": 9999},
{"file": "g_pool.js", "key": "pool", "name": "Dawg Pool", "icon": "🎱", "blurb": "8-ball vs the pool shark cat.", "how": "One rack of 8-ball vs the pool shark cat. Drag anywhere to swing the cue (or tap a spot to aim at it). Pull the POWER slider down and let go to shoot. Sink your group (solids or stripes), then the 8. Scratch or miss = ball in hand: drag the cue ball. Early 8 loses the rack. Scoring: 50 per ball, +75 for each extra ball in one shot, a growing bonus for sinking shot after shot (RUN x3...), 300 for the rack, 500 for the win, and up to 600 more for winning in fewer shots.", "cat": "sports", "max": 9999},
{"file": "g_pop.js", "key": "pop", "name": "Pup Pop", "icon": "🎈", "blurb": "Fling darts, pop balloons.", "how": "Drag back anywhere and let go to fling a dart, like a slingshot. Darts arc and pop every balloon they fly through. Pop the target number before you run out of darts. 💣 balloons blow up their neighbors, 🎁 gives a bonus dart.", "max": 99999},
{"file": "g_punch.js", "key": "punch", "name": "Pup Punch", "icon": "🥊", "blurb": "Dodge, counter, knock 'em out.", "how": "Tap the left or right half to jab. Swipe left/right to dodge, swipe down to block. Watch the glowing glove: yellow = jab (dodge or block), orange = hook (dodge AWAY from that glove), red = uppercut (dodge, don't block). Hit back after they miss, or when a 🎯 shows on one side. 3 knockdowns = KO. Beat all 4 to be champ.", "cat": "sports", "max": 99999},
{"file": "g_pupman.js", "key": "pupman", "name": "Pup-Man", "icon": ":dawgW:", "blurb": "Gobble kibble. Dodge the mailmen.", "how": "Swipe (or tap a side of the dog) to steer through the maze and gobble every kibble. Turns are saved until the next opening. Big bones in the corners scare the chasers, so chomp them for 200, 400, 800, 1600. 3 lives.", "max": 999999},
{"file": "g_putt.js", "key": "putt", "name": "Putt Pup", "icon": "⛳", "blurb": "9 holes of backyard mini golf.", "how": "9 holes. Drag back from the tennis ball like a slingshot, then let go to putt. The further you pull, the harder the shot. Ace = 50, 2 strokes = 40, 3 = 30, 4 = 20, 5 = 10, 6 = 5. Water costs a stroke. Max 6 strokes per hole.", "max": 450},
{"file": "g_putt.js", "key": "putt18", "name": "Putt Pup 18", "icon": "⛳", "blurb": "The full 18. Back nine included.", "how": "18 holes. Drag back from the tennis ball like a slingshot, then let go to putt. The further you pull, the harder the shot. Ace = 50, 2 strokes = 40, 3 = 30, 4 = 20, 5 = 10, 6 = 5. Water costs a stroke. Max 6 strokes per hole. The back nine adds a loop-de-loop, deck tunnels, a sprinkler, a seesaw, lawnmowers, an island green and the doghouse.", "max": 900},
{"file": "g_pupshot.js", "key": "pupshot", "name": "Pup Shot", "icon": "🏀", "blurb": "Fling it, warp to it, dunk it. 12 courts.", "how": "Press and pull back, then let go to fling the ball (the dots show the path). While the ball is flying, TAP anywhere to warp your pup to the ball, then fling it again from right there, even in mid-air. Get it through the hoop. Each court is worth 500 if you make it in par shots (the stars), 100 less for each extra shot. If the ball flies off the court it comes back to the start. Stuck? Tap ↺ to restart the court. 12 courts.", "max": 99999},
{"file": "g_blumji.js", "key": "blumji", "name": "Blumji Bounce", "icon": "🚩", "blurb": "Bounce platform to platform. Reach the flag. 12 stages.", "how": "Press and pull back, then let go to bounce your pup (the dots show the path). Land on a platform to stand there, then bounce again. Reach the 🚩 flag platform to clear the stage. Miss and you drop back to the last platform you stood on (that bounce still counts). Pink pads bounce you back up, blue platforms slide side to side and carry you with them. Each stage is worth 500 if you make it in par bounces (the stars), 100 less for each extra bounce. Stuck? Tap ↺ to restart the stage. 12 stages.", "max":  99999},
{"file": "g_rummy.js", "key": "rummy", "name": "Rummy Dawgs", "icon": "🧮", "blurb": "Number-tile rummy vs Rex and Duke.", "how": "Get rid of all your tiles. Sets are RUNS (3+ in a row, same color, like 4-5-6 red) or GROUPS (3 or 4 of the same number, all different colors). The 🐶 joker can stand in for any tile. Your first play has to add up to 30+ using only your own tiles. After that, rework the table however you like: take tiles off sets, split them, combine them, as long as every set on the table is valid when you tap Done. Tap tiles to select them, then tap New set or the + at the end of a set to move them there. Undo puts the table back. Nothing to play? Tap Draw. Win: 200 + the tiles left in the pups' racks. Lose: 100 minus what's left in your rack.", "cat": "den", "max": 800},
{"file": "g_seven.js", "key": "seven", "name": "Dawg 7s", "icon": "🏈", "blurb": "7-on-7 passing football. Pick a play, hit the open dog.", "how": "7-on-7: no linemen, every play is a pass. Pick one of three plays, and your receivers run their routes. TAP a receiver to throw to him. Green ring = open, yellow = tight, red = covered (picks happen!). Throw within 4 seconds or you get sacked. After the catch, DRAG to steer him through the cats. 4 downs to reach the yellow line 10 yards ahead, like real football. Touchdown = 7 points and the cats get quicker; every first down is +1. Turn it over 3 times and the game's over.", "cat": "sports", "max": 999},
{"file": "g_sgroups.js", "key": "sgroups", "name": "Sports Groups", "icon": "🏟️", "blurb": "Daily: find four groups of four, sports edition.", "how": "Find four groups of four sports things that share something. Tap four tiles, then Submit. Watch for tiles that seem to fit more than one group. Gold is the easiest group, then green, blue, and purple. You get 4 mistakes and one go per day. Score: a solve is 900, minus 100 per mistake, plus a small bonus (up to 100) for going quick, so a perfect solve beats a fast sloppy one. Missing it is 50, plus 100 per group you found. No clock on screen, so take your time.", "cat": "den", "max": 1000, "puzzle": true},
{"file": "g_shred.js", "key": "shred", "name": "Shred Dawg", "icon": "⛷️", "blurb": "Ski the endless mountain. Outrun the snow-cat.", "how": "Hold anywhere and the dog turns to face your finger: straight down is fastest, sideways nearly stops you. Let go to keep your heading. Tap to hop over rocks, stumps, moguls, pups and small trees. Hit a ramp for big air and tap in the air to flip (+40 style), but finish the flip before you land. Ski between two flags for +10. Crashing just costs time. Past 2000 m the giant snow-cat chases you and it keeps getting faster. Score = meters + style.", "cat": "sports", "max": 99999},
{"file": "g_smash.js", "key": "smash", "name": "Squirrel Smash", "icon": "🐿️", "blurb": "Whack-a-mole. Bop squirrels, not pups.", "how": "Squirrels pop out of the holes. Tap them fast. Golden ones are worth extra. Don't bop the pups. 30 seconds on the clock.", "max": 9999},
{"file": "g_solitaire.js", "key": "solitaire", "name": "Dawg Solitaire", "icon": "🂡", "blurb": "Classic solitaire. Get every card home.", "how": "Build four piles at the top, one per suit, from Ace up to King. Down below, stack cards in descending order, alternating red and black (a red 7 on a black 8). Only a King can go in an empty column. Tap the deck to flip a card; tap the empty deck to turn the pile back over (as many times as you like). Tap any card to send it to its best spot, or drag it where you want. Undo as much as you want. Score: 10 for every card you get home, plus 300 for clearing the board and a small bonus for finishing quick. Max 1000.", "cat": "den", "max": 1000},
{"file": "g_squad.js", "key": "squad", "name": "Squirrel Squadron", "icon": "🚀", "blurb": "Blast the swooping squadron out of the sky.", "how": "Slide your thumb anywhere to move the bulldog left and right. He fires bones on his own. Squirrels, cats and big raccoons fly in and line up; then they peel off and dive at you, dropping acorns. Don't get hit! Raccoons take two bones. Hitting a flier while it's diving is worth double (raccoons 400). Clear the sky to start the next wave. 3 lives, plus a bonus life at 20,000.", "max": 999999},
{"file": "g_sudoku.js", "key": "sudoku", "name": "Dawg Sudoku", "icon": "🔢", "blurb": "Daily: Easy, Medium and Hard sudoku.", "how": "Three new sudokus every day, the same for everyone. Fill the grid so every row, column and 3x3 box has 1-9. Tap a square, then a number. NOTES lets you pencil in options. One try at each per day; your progress is saved if you leave. Score: solving is worth most of Easy 1000 / Medium 2000 / Hard 3000, with a small bonus for going quick. A wrong number just bounces back; it doesn't cost you anything. No clock on screen, so take your time. Your best of the three counts.", "cat": "den", "max": 3000, "puzzle": true},
{"file": "g_swim.js", "key": "swim", "name": "Doggy Paddle", "icon": "🏊", "blurb": "Race the pool. Tap left, right, left, right.", "how": "Tap the LEFT and RIGHT halves of the screen one after the other. Same side twice or mashing = SLIP. Tap when the shrinking ring hits your pup for a PERFECT stroke. Every 6 strokes tap the blue BREATH button or you slow down. At the far wall, SWIPE DOWN for a flip turn. 50m per heat: Heat 1, Semifinal, Final. Top 2 advance. 1000/600/300/100 per heat + time bonus. Keys: ← → strokes, space = breath, ↓ = turn.", "cat": "sports", "max": 9999},
{"file": "g_td.js", "key": "td", "name": "Yard Defense", "icon": "🏰", "blurb": "Tower defense. Post pups, guard the yard.", "how": "Critters march down the path. Pick a dog at the bottom, then tap a round pad to post it. Tap a posted dog to see its range and UPGRADE it (up to ★3) or SELL it back for 75% of what you spent. Rack up points to unlock better dogs (Tennis Cannon, Sprinkler, Howler, then Frisbee Ace, Hydrant, Thunder Woof): tap a ★3 dog to swap it for the new model. A boss shows up every 5 waves, and every wave gets tougher. 10 lives; bosses take 4 if they get through.", "max": 99999},
{"file": "g_tennis.js", "key": "tennis", "name": "Dawg Open", "icon": "🎾", "blurb": "Tennis vs the cat. Time your swings.", "how": "Your dawg runs to the ball by himself. Tap to swing as the ball reaches the ring: early = cross-court, late = down the line, right on time = a deep rocket. Swipe left/right to aim, swipe up to lob. Serve: tap to toss, tap again at the top. Real tennis scoring, first to 4 games takes the set.", "cat": "sports", "max": 9999},
{"file": "g_topdogs.js", "key": "topdogs", "name": "Top Dogs", "icon": "👑", "blurb": "Daily: one dog per row, column and color.", "how": "Place a 🐶 so every row, every column and every colored area has exactly one dog. Dogs can't touch each other, not even diagonally. Tap a square once to mark it ✕ (no dog here), twice for a dog, three times to clear. A new board every day, one go, and there's only one answer. Score: 700 for solving, plus a bonus of up to 300 for going quick. No clock on screen, so take your time.", "cat": "den", "max": 1000, "puzzle": true},
{"file": "g_trail.js", "key": "trail", "name": "Dawg Trail", "icon": "🐂", "blurb": "Wagon-trail adventure. Get the pack west.", "how": "Lead 4 pups 1,200 miles to the Great Dog Park. Tap TRAVEL to roll on a day. Fast pace covers more ground but eats more kibble and gets pups sick. HUNT to catch squirrels for kibble (tap them before they run off). REST heals sick pups. Cross rivers, shop at forts. Score: pups who make it, kibble and treats left, plus a speed bonus.", "max": 9999},
{"file": "g_trap.js", "key": "trap", "name": "Pup Trap", "icon": "🧀", "blurb": "Push crates. Trap the cats. Eat the cheese.", "how": "You're the pup. Tap or hold on the side you want to move. Walk into crates to push the whole row (if there's room at the end). Box in the cats: when EVERY cat on the board is stuck, they all turn into 🧀 cheese. Eat cheese for points. Clear 3 waves to finish a level. Gray rocks don't move. Get caught 3 times and it's over.", "max": 999999},
{"file": "g_volley.js", "key": "volley", "name": "Beach Dawgs", "icon": "🏐", "blurb": "2-on-2 beach volleyball. Bump, set, SPIKE.", "how": "Hold and drag anywhere to run: your dawg follows your finger. The big shadow on the sand shows where the ball will land, so get under it. Tap when the ball reaches your head to BUMP it to your pup. The pup sets it up by the net: tap to jump and SPIKE (hit it at the top of your jump). Tap to serve. Rally scoring, first to 11. Points x100, +500 for a win, +25 per spike kill.", "cat": "sports", "max": 9999}]);

// Register the newer games with the shared arcade lists.
Object.values(GAMEDEFS).forEach(d => { ARC[d.key] = { name: d.name, icon: d.icon, how: d.how, cat: d.cat || "arcade", puzzle: !!d.puzzle, blurb: d.blurb || "" }; ARC_BLURB[d.key] = d.blurb; if (aBest[d.key] == null) aBest[d.key] = 0; });
renderArcSub(); renderArcade();

