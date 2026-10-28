// Big Dawg Daily: serves the games and keeps the scoreboard in a Google Sheet.
const SHEET_ID = '1VL0FSSHy4VFphMntUA0tKgXBEG4ELWKx7zyXdJvS6Bw';
const APP_TITLE = 'Big Dawg Daily';
const SCORE_HEADERS = ['date', 'playerId', 'fiveN', 'fiveWon', 'fiveRows', 'groupsMistakes', 'groupsWon', 'groupsRows', 'miniSeconds', 'miniChecked', 'updated', 'strandsSeconds', 'strandsHints'];
const PLAYER_HEADERS = ['playerId', 'name', 'joined', 'spice', 'jokes', 'mute', 'pin'];
const SHADE_HEADERS = ['id', 'date', 'fromId', 'toId', 'text', 'kind', 'replyTo', 'created', 'seenAt', 'response'];
const JOKE_HEADERS = ['id', 'playerId', 'text', 'created'];
const PROGRESS_HEADERS = ['date', 'playerId', 'state', 'updated'];
const REACT_HEADERS = ['date', 'fromId', 'toId', 'emoji', 'created'];
const ARCADE_HEADERS = ['date', 'playerId', 'game', 'best', 'plays', 'updated'];
const DARE_KINDS = ['dare', 'dareres', 'join', 'joinok', 'added', 'newbie'];
const ADMIN_ID = 'siy7j5dcz3rtc4iw'; // Sam: gets a heads-up whenever someone new signs up // Zoomies dares ride along in the Shade tab but never count as shade
const DAWGS = [':dawgW:', ':dawgL:', ':dawgcope:', ':dawgsweat:', ':dawgpog:', ':dawgpain:', ':dawgclown:', ':dawgsus:', ':dawgskull:']; // Big Dawg emote pack
const EMOJIS = ['😂', '🔥', '💀', '👏', '🤡'].concat(DAWGS);
const CLAPS = ['👏', '🫃', '🤡', '🖕'].concat(DAWGS); // clap-back answers to shade

const PAGE_FILE_NAME = 'Big Dawg Daily page (index.html)'; // the game page, kept in your Drive

// The newest copy of the game page in your Drive (so it can be updated without touching this code).
function pageHtml_() {
  // Ask Drive for live copies only, so old trashed copies don't slow this down.
  const files = DriveApp.searchFiles('title = "' + PAGE_FILE_NAME + '" and trashed = false');
  let best = null;
  while (files.hasNext()) {
    const f = files.next();
    if (!best || f.getLastUpdated() > best.getLastUpdated()) best = f;
  }
  if (!best) throw new Error('Could not find "' + PAGE_FILE_NAME + '" in your Drive.');
  return best.getBlob().getDataAsString('UTF-8');
}

const WORDS_URL = 'https://raw.githubusercontent.com/tabatkins/wordle-list/main/words';

// The list of allowed five-letter guesses, saved to your Drive the first time.
function words_() {
  const props = PropertiesService.getScriptProperties();
  const id = props.getProperty('WORDS_FILE_ID');
  if (id) { try { return DriveApp.getFileById(id).getBlob().getDataAsString(); } catch (e) {} }
  const text = UrlFetchApp.fetch(WORDS_URL).getContentText();
  const f = DriveApp.createFile('Big Dawg Daily word list.txt', text, MimeType.PLAIN_TEXT);
  props.setProperty('WORDS_FILE_ID', f.getId());
  return text;
}

// The finished page is cached for 10 minutes so most opens skip Drive entirely.
// (A new page upload shows up within 10 minutes, or right away after running clearPageCache.)
const PAGE_CACHE_SECS = 600, PAGE_CHUNK = 20000;
function cachedPage_() {
  const cache = CacheService.getScriptCache();
  const n = Number(cache.get('page:n') || 0);
  if (n > 0) {
    const keys = []; for (let i = 0; i < n; i++) keys.push('page:' + i);
    const got = cache.getAll(keys);
    if (keys.every(k => got[k] != null)) return keys.map(k => got[k]).join('');
  }
  const words = words_().split(/\s+/).filter(w => /^[a-z]{5}$/.test(w)).join(' ');
  const html = pageHtml_().split('__GUESSES__').join(words).split('__APP_URL__').join(ScriptApp.getService().getUrl());
  try {
    const parts = {}; let i = 0;
    for (let at = 0; at < html.length; at += PAGE_CHUNK, i++) parts['page:' + i] = html.slice(at, at + PAGE_CHUNK);
    cache.putAll(parts, PAGE_CACHE_SECS); cache.put('page:n', String(i), PAGE_CACHE_SECS);
  } catch (e) {}
  return html;
}
function clearPageCache() { CacheService.getScriptCache().remove('page:n'); return 'Cleared'; }

function doGet() {
  const html = cachedPage_();
  return HtmlService.createHtmlOutput(html)
    .setTitle(APP_TITLE)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1, viewport-fit=cover');
}

// Run this once from the editor to grant access and set up the sheet tabs.
function setup() {
  pageHtml_();
  words_();
  scoresSheet_();
  playersSheet_();
  progressSheet_();
  shadeSheet_();
  jokesSheet_();
  reactSheet_();
  freshStartOct6_();
  return 'Ready';
}

function ss_() { return SpreadsheetApp.openById(SHEET_ID); }

function scoresSheet_() {
  const ss = ss_();
  let sh = ss.getSheetByName('Scores');
  if (!sh) {
    const first = ss.getSheets()[0];
    if (first && String(first.getRange('A1').getValue()) === 'date') { first.setName('Scores'); sh = first; }
    else { sh = ss.insertSheet('Scores'); sh.getRange(1, 1, 1, SCORE_HEADERS.length).setValues([SCORE_HEADERS]); }
    sh.setFrozenRows(1);
    sh.getRange('A:B').setNumberFormat('@');
    sh.getRange('E:E').setNumberFormat('@');
    sh.getRange('H:H').setNumberFormat('@');
  }
  if (String(sh.getRange(1, 12).getValue()) !== 'strandsSeconds') sh.getRange(1, 12, 1, 2).setValues([['strandsSeconds', 'strandsHints']]);
  return sh;
}

function playersSheet_() {
  const ss = ss_();
  let sh = ss.getSheetByName('Players');
  if (!sh) {
    sh = ss.insertSheet('Players');
    sh.getRange(1, 1, 1, PLAYER_HEADERS.length).setValues([PLAYER_HEADERS]);
    sh.setFrozenRows(1);
    sh.getRange('A:B').setNumberFormat('@');
  }
  if (String(sh.getRange(1, 4).getValue()) !== 'spice') sh.getRange(1, 4, 1, 3).setValues([['spice', 'jokes', 'mute']]);
  if (String(sh.getRange(1, 7).getValue()) !== 'pin') { sh.getRange(1, 7).setValue('pin'); sh.getRange('G:G').setNumberFormat('@'); }
  return sh;
}

function tabSheet_(name, headers, textCols) {
  const ss = ss_();
  let sh = ss.getSheetByName(name);
  if (!sh) {
    sh = ss.insertSheet(name);
    sh.getRange(1, 1, 1, headers.length).setValues([headers]);
    sh.setFrozenRows(1);
    if (textCols) sh.getRange(textCols).setNumberFormat('@');
  }
  return sh;
}
function shadeSheet_() { return tabSheet_('Shade', SHADE_HEADERS, 'A:G'); }
function jokesSheet_() { return tabSheet_('Jokes', JOKE_HEADERS, 'A:C'); }
function reactSheet_() { return tabSheet_('Reactions', REACT_HEADERS, 'A:D'); }
function arcadeSheet_() { return tabSheet_('Arcade', ARCADE_HEADERS, 'A:C'); }

function progressSheet_() {
  const ss = ss_();
  let sh = ss.getSheetByName('Progress');
  if (!sh) {
    sh = ss.insertSheet('Progress');
    sh.getRange(1, 1, 1, PROGRESS_HEADERS.length).setValues([PROGRESS_HEADERS]);
    sh.setFrozenRows(1);
    sh.getRange('A:C').setNumberFormat('@');
  }
  return sh;
}

function cleanId_(id) {
  id = String(id || '');
  if (!/^[a-z0-9]{8,32}$/i.test(id)) throw new Error('Unknown player.');
  return id;
}
function cleanName_(name) {
  name = String(name || '').replace(/[<>\n\r\t]/g, '').replace(/\s+/g, ' ').trim().slice(0, 20);
  if (!name) throw new Error('Pick a name first.');
  return name;
}
function cleanDate_(d) {
  d = String(d || '');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(d)) throw new Error('Bad date.');
  return d;
}
function asDateKey_(v, tz) {
  if (v instanceof Date) return Utilities.formatDate(v, tz, 'yyyy-MM-dd');
  return String(v);
}

function readPlayers_() {
  const sh = playersSheet_();
  const n = sh.getLastRow() - 1;
  if (n < 1) return [];
  return sh.getRange(2, 1, n, 7).getValues().map((r, i) => ({ id: String(r[0]), name: String(r[1]), row: i + 2, spice: Number(r[3]) || 0, jokes: r[4] === true || r[4] === 'TRUE', mute: r[5] === true || r[5] === 'TRUE', pin: String(r[6] || '') })).filter(p => p.id);
}

// Players and PINs. A PIN is stored scrambled (never as the 4 digits). To reset someone's PIN, clear their cell in the Players tab's "pin" column.
function cleanPin_(pin) {
  pin = String(pin || '');
  if (!/^\d{4}$/.test(pin)) throw new Error('Your PIN is 4 numbers.');
  return pin;
}
function pinHash_(id, pin) {
  return Utilities.base64Encode(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, 'bigdawg:' + id + ':' + pin));
}

// Names for the "Who's playing?" screen.
function listPlayers() {
  return readPlayers_().map(p => ({ id: p.id, name: p.name, hasPin: !!p.pin }));
}

// Sign in by tapping your name: checks your PIN, or sets it the first time.
function claimPlayer(id, pin) {
  id = cleanId_(id); pin = cleanPin_(pin);
  const cache = CacheService.getScriptCache();
  const tries = Number(cache.get('pintries:' + id) || 0);
  if (tries >= 5) throw new Error('Too many wrong PINs. Try again in 10 minutes.');
  const lock = LockService.getScriptLock(); lock.waitLock(10000);
  try {
    const p = readPlayers_().find(x => x.id === id);
    if (!p) throw new Error('Unknown player.');
    const h = pinHash_(id, pin);
    if (!p.pin) playersSheet_().getRange(p.row, 7).setValue(h);
    else if (p.pin !== h) {
      cache.put('pintries:' + id, String(tries + 1), 600);
      const left = 4 - tries;
      throw new Error("That PIN doesn't match. " + (left > 1 ? left + ' tries left.' : left === 1 ? '1 try left.' : 'Last try.'));
    }
    cache.remove('pintries:' + id);
    return { id: p.id, name: p.name };
  } finally { lock.releaseLock(); }
}

// New player (needs a PIN) or rename (your own id). Names are unique.
let byIdNow_ = false;
// Tell Sam (or whoever started the first crew) that a new player signed up, with a one-tap Add to their crew.
function notifyNewbie_(newId) {
  ensureCrews_(); MEMO_.crews = null;
  const crews = readCrews_(), players = readPlayers_();
  const admin = players.some(p => p.id === ADMIN_ID) ? ADMIN_ID : (crews[0] && crews[0].owner);
  if (!admin || admin === newId) return;
  const home = crews.find(c => c.owner === admin);
  const tz = ss_().getSpreadsheetTimeZone(); let dk; try { dk = Utilities.formatDate(new Date(), tz, 'yyyy-MM-dd'); } catch (e) { dk = new Date().toISOString().slice(0, 10); }
  const sh = shadeSheet_(), r = sh.getLastRow() + 1; sh.getRange(r, 1, 1, 7).setNumberFormat('@');
  sh.getRange(r, 1, 1, SHADE_HEADERS.length).setValues([[Utilities.getUuid().slice(0, 8), dk, newId, admin, home ? home.id : '', 'newbie', '', new Date(), '', '']]);
}
function register(id, name, pin) {
  id = cleanId_(id); name = cleanName_(name);
  const lock = LockService.getScriptLock(); lock.waitLock(10000);
  try {
    const players = readPlayers_();
    const byId = players.find(p => p.id === id); byIdNow_ = !!byId;
    const byName = players.find(p => p.name.toLowerCase() === name.toLowerCase());
    if (byName && byName.id !== id) throw new Error(byId ? 'Someone already uses that name. Try another.' : 'That name is taken. If it\'s you, go back and tap your name.');
    const sh = playersSheet_();
    if (byId) sh.getRange(byId.row, 2).setValue(name);
    else {
      pin = cleanPin_(pin);
      const r = sh.getLastRow() + 1;
      sh.getRange(r, 1, 1, 2).setNumberFormat('@');
      sh.getRange(r, 7).setNumberFormat('@');
      sh.getRange(r, 1, 1, 7).setValues([[id, name, new Date(), '', '', '', pinHash_(id, pin)]]);
    }
  } finally { lock.releaseLock(); }
  if (!byIdNow_) { try { notifyNewbie_(id); } catch (e) {} }
  return { id: id, name: name };
}

function submit(id, dateKey, entry) {
  id = cleanId_(id); dateKey = cleanDate_(dateKey);
  entry = entry || {};
  const lock = LockService.getScriptLock(); lock.waitLock(10000);
  try {
    if (!readPlayers_().some(p => p.id === id)) throw new Error('Unknown player.');
    const sh = scoresSheet_();
    const tz = ss_().getSpreadsheetTimeZone();
    const n = sh.getLastRow() - 1;
    let rowNum = -1, row = ['', '', '', '', '', '', '', '', '', '', '', '', ''];
    if (n > 0) {
      const vals = sh.getRange(2, 1, n, SCORE_HEADERS.length).getValues();
      for (let i = 0; i < vals.length; i++) {
        if (asDateKey_(vals[i][0], tz) === dateKey && String(vals[i][1]) === id) { rowNum = i + 2; row = vals[i]; break; }
      }
    }
    row[0] = dateKey; row[1] = id;
    // One attempt per puzzle: once a game's result is on the board, it can't be replaced.
    const f = entry.f;
    if (row[2] === '' && f && Number(f.n) >= 1 && Number(f.n) <= 6 && Array.isArray(f.rows) && f.rows.every(r => /^[gyx]{5}$/.test(r))) {
      row[2] = Number(f.n); row[3] = !!f.w; row[4] = f.rows.slice(0, 6).join('|');
    }
    const g = entry.g;
    if (row[5] === '' && g && Number(g.m) >= 0 && Number(g.m) <= 4 && Array.isArray(g.rows) && g.rows.every(r => /^[0-3]{4}$/.test(r))) {
      row[5] = Number(g.m); row[6] = !!g.w; row[7] = g.rows.slice(0, 8).join('|');
    }
    const c = entry.c;
    if (row[8] === '' && c && Number(c.t) > 0 && Number(c.t) < 86400) { row[8] = Math.round(Number(c.t)); row[9] = !!c.k; }
    const s = entry.s;
    if ((row[11] === '' || row[11] == null) && s && Number(s.t) > 0 && Number(s.t) < 86400 && Number(s.h) >= 0 && Number(s.h) <= 20) { row[11] = Math.round(Number(s.t)); row[12] = Math.round(Number(s.h)); }
    row[10] = new Date();
    if (rowNum > 0) sh.getRange(rowNum, 1, 1, row.length).setValues([row]);
    else {
      const r = sh.getLastRow() + 1;
      sh.getRange(r, 1, 1, 2).setNumberFormat('@');
      sh.getRange(r, 1, 1, row.length).setValues([row]);
    }
  } finally { lock.releaseLock(); }
  return getBoard(dateKey, id);
}

// One Scores row as the app's result object.
function parseRow_(v) {
  const t = {};
  if (v[2] !== '') t.f = { n: Number(v[2]), w: v[3] === true || v[3] === 'TRUE', rows: String(v[4]).split('|').filter(Boolean) };
  if (v[5] !== '') t.g = { m: Number(v[5]), w: v[6] === true || v[6] === 'TRUE', rows: String(v[7]).split('|').filter(Boolean) };
  if (v[8] !== '') t.c = { t: Number(v[8]), k: v[9] === true || v[9] === 'TRUE' };
  if (v[11] !== '' && v[11] != null) t.s = { t: Number(v[11]), h: Number(v[12]) || 0 };
  return t;
}

// Everyone's results for one day, plus play streaks and emoji reactions.
function getBoard(dateKey, viewerId) {
  dateKey = cleanDate_(dateKey); viewerId = String(viewerId || '');
  const names = {};
  readPlayers_().forEach(p => names[p.id] = p.name);
  const sh = scoresSheet_();
  const tz = ss_().getSpreadsheetTimeZone();
  const n = sh.getLastRow() - 1;
  const vals = n > 0 ? sh.getRange(2, 1, n, SCORE_HEADERS.length).getValues() : [];
  const today = {}, played = {};
  vals.forEach(v => {
    const d = asDateKey_(v[0], tz), id = String(v[1]);
    if (!id) return;
    (played[id] = played[id] || {})[d] = true;
    if (d !== dateKey) return;
    today[id] = parseRow_(v);
  });
  const out = [];
  Object.keys(played).forEach(id => {
    const st = streak_(played[id], dateKey);
    if ((today[id] || st.s > 0) && inScope_(id)) out.push({ id: id, name: names[id] || 'Player', t: today[id] || {}, s: st.s, z: st.froze });
  });
  const reacts = readReacts_(dateKey);
  out.forEach(p => {
    const mine = reacts.filter(x => x.to === p.id);
    p.r = {}; mine.forEach(x => p.r[x.e] = (p.r[x.e] || 0) + 1);
    p.rm = mine.filter(x => x.from === viewerId).map(x => x.e);
  });
  return { date: dateKey, players: out };
}

// Current streak, counting back from today (or yesterday if you haven't played yet today).
// Streak freeze: one missed day per Mon-Sun week is forgiven automatically, as long as you played the day before it.
function streak_(days, dateKey) {
  let k = days[dateKey] ? dateKey : addDays_(dateKey, -1), s = 0, froze = false;
  const used = {}, thisWeek = weekStart_(dateKey);
  for (let i = 0; i < 1500; i++) {
    if (days[k]) { s++; k = addDays_(k, -1); continue; }
    const w = weekStart_(k), prev = addDays_(k, -1);
    if (used[w] || !days[prev]) break;
    used[w] = true; if (w === thisWeek) froze = true; k = prev;
  }
  return { s: s, froze: froze && s > 0 };
}

// Who a remembered link belongs to.
function whoami(id) {
  id = cleanId_(id);
  const p = readPlayers_().find(x => x.id === id);
  return p ? { id: p.id, name: p.name } : null;
}

// Each player's in-progress games for the day, so reopening the app picks up where they left off.
function saveProgress(id, dateKey, json) {
  id = cleanId_(id); dateKey = cleanDate_(dateKey);
  json = String(json || '');
  if (json.length > 40000) throw new Error('Too much data.');
  const lock = LockService.getScriptLock(); lock.waitLock(10000);
  try {
    const sh = progressSheet_();
    const tz = ss_().getSpreadsheetTimeZone();
    const n = sh.getLastRow() - 1;
    if (n > 0) {
      const vals = sh.getRange(2, 1, n, 2).getValues();
      for (let i = 0; i < vals.length; i++) {
        if (asDateKey_(vals[i][0], tz) === dateKey && String(vals[i][1]) === id) {
          const old = String(sh.getRange(i + 2, 3).getValue() || '');
          sh.getRange(i + 2, 3, 1, 2).setValues([[mergeProgress_(old, json), new Date()]]);
          return true;
        }
      }
    }
    const r = sh.getLastRow() + 1;
    sh.getRange(r, 1, 1, 3).setNumberFormat('@');
    sh.getRange(r, 1, 1, 4).setValues([[dateKey, id, json, new Date()]]);
    return true;
  } finally { lock.releaseLock(); }
}

// Keeps the furthest-along copy of each game, so an older phone can never roll your progress back.
function gameRank_(g, x) {
  if (!x) return -1;
  if (g === 'five') return (x.locked ? 1000 : 0) + (x.guesses || []).length;
  if (g === 'groups') return (((x.solved || []).length === 4 || x.mistakes >= 4) ? 1000 : 0) + (x.history || []).length;
  const done = x.done ? 1e9 : 0, el = Number(x.el) || 0;
  if (g === 'mini') return done + (x.fill || []).filter(Boolean).length * 1e5 + (x.started ? 1 : 0) + el / 1e4;
  return done + ((x.found || []).length + (x.hints || []).length) * 1e5 + (x.started ? 1 : 0) + el / 1e4;
}
function mergeProgress_(oldJson, newJson) {
  let a = null, b = null;
  try { a = JSON.parse(oldJson); } catch (e) {}
  try { b = JSON.parse(newJson); } catch (e) {}
  if (!a || a.v !== 2) return newJson;
  if (!b || b.v !== 2) return oldJson;
  if (a.pid !== b.pid) return newJson; // different puzzle set: the new one wins
  const out = { v: 2, pid: b.pid };
  ['five', 'groups', 'mini', 'strands'].forEach(g => { out[g] = gameRank_(g, b[g]) >= gameRank_(g, a[g]) ? b[g] : a[g]; });
  return JSON.stringify(out);
}

function loadProgress(id, dateKey) {
  id = cleanId_(id); dateKey = cleanDate_(dateKey);
  const sh = progressSheet_();
  const tz = ss_().getSpreadsheetTimeZone();
  const n = sh.getLastRow() - 1;
  if (n < 1) return null;
  const vals = sh.getRange(2, 1, n, 3).getValues();
  for (let i = vals.length - 1; i >= 0; i--) {
    if (asDateKey_(vals[i][0], tz) === dateKey && String(vals[i][1]) === id) return String(vals[i][2]);
  }
  return null;
}

// One-time: Oct 6 got brand-new puzzles, so that day's earlier scores are set aside (kept, relabeled "(old puzzles)").
function freshStartOct6_() {
  const props = PropertiesService.getScriptProperties();
  if (props.getProperty('FRESH_START_2026_10_06')) return;
  props.setProperty('FRESH_START_2026_10_06', '1');
  if (Utilities.formatDate(new Date(), 'America/Indiana/Indianapolis', 'yyyy-MM-dd') !== '2026-10-06') return;
  const sh = scoresSheet_();
  const tz = ss_().getSpreadsheetTimeZone();
  const n = sh.getLastRow() - 1;
  if (n < 1) return;
  const dates = sh.getRange(2, 1, n, 1).getValues();
  const out = dates.map(r => [asDateKey_(r[0], tz) === '2026-10-06' ? '2026-10-06 (old puzzles)' : r[0]]);
  sh.getRange(2, 1, n, 1).setValues(out);
}

// ---------------- Shade ----------------
const isTrue_ = v => v === true || v === 'TRUE';
function cleanText_(t, max) {
  t = String(t || '').replace(/[<>]/g, '').replace(/\s+/g, ' ').trim().slice(0, max);
  if (!t) throw new Error('Nothing to send.');
  return t;
}
function addDays_(dateKey, n) {
  const p = dateKey.split('-').map(Number);
  return Utilities.formatDate(new Date(Date.UTC(p[0], p[1] - 1, p[2] + n)), 'UTC', 'yyyy-MM-dd');
}
function readShade_() {
  const sh = shadeSheet_();
  const n = sh.getLastRow() - 1;
  if (n < 1) return [];
  const tz = ss_().getSpreadsheetTimeZone();
  return sh.getRange(2, 1, n, SHADE_HEADERS.length).getValues().map((r, i) => ({
    id: String(r[0]), date: asDateKey_(r[1], tz), from: String(r[2]), to: String(r[3]), text: String(r[4]),
    kind: String(r[5]), replyTo: String(r[6]), seen: r[8] !== '' && r[8] != null, response: String(r[9] || ''), row: i + 2
  }));
}
function readJokes_(id) {
  const names = {}; readPlayers_().forEach(p => names[p.id] = p.name);
  const sh = jokesSheet_();
  const n = sh.getLastRow() - 1;
  if (n < 1) return [];
  return sh.getRange(2, 1, n, 3).getValues().filter(r => r[0]).map(r => ({ id: String(r[0]), text: String(r[2]), by: names[String(r[1])] || 'Someone', mine: String(r[1]) === id }));
}

// Everything the app needs for shade: inbox, today's throw counts, 7-day boards, settings, inside jokes.
function getShadeState(id, dateKey) {
  id = cleanId_(id); dateKey = cleanDate_(dateKey);
  const players = readPlayers_();
  const me = players.find(p => p.id === id);
  if (!me) throw new Error('Unknown player.');
  const names = {}; players.forEach(p => names[p.id] = p.name);
  const rows = readShade_();
  const since = addDays_(dateKey, -6);
  const crewNm = {}; readCrews_().forEach(c => crewNm[c.id] = c.name);
  const inbox = rows.filter(r => r.to === id && !r.seen).map(r => ({ id: r.id, from: r.from, fromName: names[r.from] || 'Someone', text: r.text, kind: r.kind, crew: crewNm[r.text] || '' }));
  const sentToday = {};
  rows.filter(r => r.from === id && r.date === dateKey && r.kind === 'shade').forEach(r => sentToday[r.to] = (sentToday[r.to] || 0) + 1);
  const recv = {}, sent = {}, ls = {}, claps = {};
  rows.filter(r => r.date >= since && r.date <= dateKey).forEach(r => {
    if (DARE_KINDS.indexOf(r.kind) >= 0) return;
    if (r.kind === 'clap') { claps[r.from] = (claps[r.from] || 0) + 1; return; }
    recv[r.to] = (recv[r.to] || 0) + 1;
    sent[r.from] = (sent[r.from] || 0) + 1;
    if (r.response === 'L') ls[r.to] = (ls[r.to] || 0) + 1;
  });
  const top = m => Object.keys(m).filter(k => names[k] && inScope_(k)).map(k => ({ id: k, name: names[k], n: m[k] })).sort((a, b) => b.n - a.n).slice(0, 5);
  return {
    inbox: inbox, sentToday: sentToday,
    recent: rows.filter(r => r.to === id && r.date >= since).slice(-30).reverse().map(r => ({ id: r.id, from: r.from, fromName: names[r.from] || 'Someone', text: r.text, kind: r.kind, date: r.date, seen: r.seen, crew: crewNm[r.text] || '', response: r.response })),
    board: { recv: top(recv), sent: top(sent), ls: top(ls), claps: top(claps) },
    settings: { spice: me.spice || 0, jokes: !!me.jokes, mute: !!me.mute },
    jokes: readJokes_(id),
    players: players.filter(p => p.id === id || shareCrew_(id, p.id)).map(p => ({ id: p.id, name: p.name, muted: !!p.mute }))
  };
}

function saveSettings(id, s) {
  id = cleanId_(id); s = s || {};
  const p = readPlayers_().find(x => x.id === id);
  if (!p) throw new Error('Unknown player.');
  const spice = Math.max(0, Math.min(3, Math.round(Number(s.spice) || 0)));
  playersSheet_().getRange(p.row, 4, 1, 3).setValues([[spice, !!s.jokes, !!s.mute]]);
  return true;
}

function sendShade(fromId, toId, dateKey, text, kind, replyTo) {
  fromId = cleanId_(fromId); toId = cleanId_(toId); dateKey = cleanDate_(dateKey);
  text = cleanText_(text, 400);
  kind = kind === 'fire' || kind === 'clap' ? kind : 'shade';
  if (kind === 'clap' && CLAPS.indexOf(text) < 0) throw new Error('Pick a clap-back emoji.');
  if (fromId === toId) throw new Error("You can't throw shade at yourself. Well, you can, but not here.");
  const lock = LockService.getScriptLock(); lock.waitLock(10000);
  try {
    const players = readPlayers_();
    const from = players.find(p => p.id === fromId), to = players.find(p => p.id === toId);
    if (!from || !to) throw new Error('Unknown player.');
    if (kind === 'shade' && !shareCrew_(fromId, toId)) throw new Error(NOT_MATES_);
    const rows = readShade_();
    if (kind === 'shade') {
      if (to.mute) throw new Error(to.name + ' has shade muted.');
      const day = allScores_()[dateKey] || {};
      if (!day[fromId]) throw new Error('Play a game first. Shade is earned.');
      if (day[toId]) { const pts = dayPoints_(day); if (!(pts[fromId] > pts[toId])) throw new Error("You're not beating " + to.name + ' today. Shade is earned.'); }
      const n = rows.filter(r => r.from === fromId && r.to === toId && r.date === dateKey && r.kind === 'shade').length;
      if (n >= 3) throw new Error("You've thrown 3 at " + to.name + ' today. Save some for tomorrow.');
    } else {
      replyTo = String(replyTo || '');
      const orig = rows.find(r => r.id === replyTo);
      if (!orig || orig.to !== fromId || orig.from !== toId) throw new Error('Nothing to answer.');
      if (rows.some(r => (r.kind === 'fire' || r.kind === 'clap') && r.replyTo === replyTo)) throw new Error('You already answered that one.');
    }
    const sh = shadeSheet_();
    const r = sh.getLastRow() + 1;
    sh.getRange(r, 1, 1, 7).setNumberFormat('@');
    sh.getRange(r, 1, 1, SHADE_HEADERS.length).setValues([[Utilities.getUuid().slice(0, 8), dateKey, fromId, toId, text, kind, kind !== 'shade' ? replyTo : '', new Date(), '', '']]);
  } finally { lock.releaseLock(); }
  return getShadeState(fromId, dateKey);
}

function respondShade(id, shadeId, response) {
  id = cleanId_(id); shadeId = String(shadeId || '');
  const row = readShade_().find(r => r.id === shadeId && r.to === id);
  if (!row) return false;
  shadeSheet_().getRange(row.row, 9, 1, 2).setValues([[new Date(), ['L', 'clap', 'play', 'ok'].indexOf(response) >= 0 ? response : 'fire']]);
  return true;
}

// Mark several notifications as seen at once (opening the bell).
function markSeen(id, ids) {
  id = cleanId_(id); ids = (Array.isArray(ids) ? ids : []).map(String).slice(0, 50);
  const sh = shadeSheet_(), now = new Date();
  readShade_().filter(r => r.to === id && !r.seen && ids.indexOf(r.id) >= 0).forEach(r => sh.getRange(r.row, 9, 1, 2).setValues([[now, r.response || 'ok']]));
  return true;
}

// In-app feedback: lands in a "Feedback" tab of the sheet for Sam to review.
function sendFeedback(id, text) {
  id = cleanId_(id); text = cleanText_(text, 1000);
  if (!text) throw new Error('Type something first.');
  const p = readPlayers_().find(x => x.id === id);
  const sh = tabSheet_('Feedback', ['date', 'playerId', 'name', 'feedback'], 'A:D');
  sh.appendRow([new Date(), id, p ? p.name : '?', text]);
  return true;
}

function addJoke(id, text) {
  id = cleanId_(id); text = cleanText_(text, 140);
  if (!readPlayers_().some(p => p.id === id)) throw new Error('Unknown player.');
  const sh = jokesSheet_();
  const r = sh.getLastRow() + 1;
  sh.getRange(r, 1, 1, 3).setNumberFormat('@');
  sh.getRange(r, 1, 1, 4).setValues([[Utilities.getUuid().slice(0, 8), id, text, new Date()]]);
  return readJokes_(id);
}

function deleteJoke(id, jokeId) {
  id = cleanId_(id);
  const sh = jokesSheet_();
  const n = sh.getLastRow() - 1;
  if (n > 0) {
    const vals = sh.getRange(2, 1, n, 2).getValues();
    for (let i = 0; i < vals.length; i++) if (String(vals[i][0]) === String(jokeId) && String(vals[i][1]) === id) { sh.deleteRow(i + 2); break; }
  }
  return readJokes_(id);
}

// ---------------- Reactions ----------------
function readReacts_(dateKey) {
  const sh = reactSheet_();
  const n = sh.getLastRow() - 1;
  if (n < 1) return [];
  const tz = ss_().getSpreadsheetTimeZone();
  return sh.getRange(2, 1, n, 4).getValues().map((r, i) => ({ date: asDateKey_(r[0], tz), from: String(r[1]), to: String(r[2]), e: String(r[3]), row: i + 2 })).filter(x => x.date === dateKey);
}

// Tap an emoji on someone's score; tap again to take it back.
function react(fromId, toId, dateKey, emoji) {
  fromId = cleanId_(fromId); toId = cleanId_(toId); dateKey = cleanDate_(dateKey);
  if (EMOJIS.indexOf(emoji) < 0) throw new Error('Unknown reaction.');
  if (fromId === toId) throw new Error("You can't react to your own score.");
  const lock = LockService.getScriptLock(); lock.waitLock(10000);
  try {
    const players = readPlayers_();
    if (!players.some(p => p.id === fromId) || !players.some(p => p.id === toId)) throw new Error('Unknown player.');
    if (!shareCrew_(fromId, toId)) throw new Error(NOT_MATES_);
    const had = readReacts_(dateKey).find(x => x.from === fromId && x.to === toId && x.e === emoji);
    const sh = reactSheet_();
    if (had) sh.deleteRow(had.row);
    else {
      const r = sh.getLastRow() + 1;
      sh.getRange(r, 1, 1, 4).setNumberFormat('@');
      sh.getRange(r, 1, 1, 5).setValues([[dateKey, fromId, toId, emoji, new Date()]]);
    }
  } finally { lock.releaseLock(); }
  return getBoard(dateKey, fromId);
}


// ---------------- Crews ----------------
// Invite-only groups. The scoreboard, league, crowns, awards and Den/Arcade boards can be scoped to one crew
// (or "all" for everyone). The app sends the crew it's showing with every call; it lands in CREW_.
const CREW_HEADERS = ['crewId', 'name', 'code', 'ownerId', 'created'];
const MEMBER_HEADERS = ['crewId', 'playerId', 'joined'];
let CREW_ = 'all', MEMO_ = {};
function crewsSheet_() { return tabSheet_('Crews', CREW_HEADERS, 'A:D'); }
function membersSheet_() { return tabSheet_('CrewMembers', MEMBER_HEADERS, 'A:B'); }
function readCrews_() {
  if (MEMO_.crews) return MEMO_.crews;
  const sh = crewsSheet_(), n = sh.getLastRow() - 1;
  return MEMO_.crews = n < 1 ? [] : sh.getRange(2, 1, n, 4).getValues().map(r => ({ id: String(r[0]), name: String(r[1]), code: String(r[2]).toUpperCase(), owner: String(r[3]) })).filter(c => c.id);
}
function readMembers_() {
  if (MEMO_.members) return MEMO_.members;
  const sh = membersSheet_(), n = sh.getLastRow() - 1;
  return MEMO_.members = n < 1 ? [] : sh.getRange(2, 1, n, 2).getValues().map((r, i) => ({ crew: String(r[0]), id: String(r[1]), row: i + 2 })).filter(m => m.crew && m.id);
}
function newCode_() {
  const A = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789', used = {}; readCrews_().forEach(c => used[c.code] = true);
  for (;;) { let c = ''; for (let i = 0; i < 5; i++) c += A[Math.floor(Math.random() * A.length)]; if (!used[c]) return c; }
}
function addCrew_(name, ownerId) {
  const c = { id: Utilities.getUuid().slice(0, 8), name: name, code: newCode_(), owner: ownerId };
  const sh = crewsSheet_(), r = sh.getLastRow() + 1; sh.getRange(r, 1, 1, 4).setNumberFormat('@');
  sh.getRange(r, 1, 1, 5).setValues([[c.id, c.name, c.code, c.owner, new Date()]]); MEMO_.crews = null; return c;
}
function addMembers_(crewId, ids) {
  const have = {}; readMembers_().filter(m => m.crew === crewId).forEach(m => have[m.id] = true);
  const rows = ids.filter(id => !have[id]).map(id => [crewId, id, new Date()]); if (!rows.length) return;
  const sh = membersSheet_(), r = sh.getLastRow() + 1; sh.getRange(r, 1, rows.length, 2).setNumberFormat('@');
  sh.getRange(r, 1, rows.length, 3).setValues(rows); MEMO_.members = null;
}
// First run: everyone already playing becomes the original crew, so nothing changes for them.
function ensureCrews_() {
  if (readCrews_().length) return;
  const lock = LockService.getScriptLock(); lock.waitLock(10000);
  try {
    MEMO_ = {}; if (readCrews_().length) return;
    const players = readPlayers_(); if (!players.length) return;
    const sam = players.find(p => /^sam\b/i.test(p.name)) || players[0];
    const c = addCrew_('Big Dawgs', sam ? sam.id : '');
    addMembers_(c.id, players.map(p => p.id));
  } finally { lock.releaseLock(); }
}
function crewIdsOf_(id) { return readMembers_().filter(m => m.id === id).map(m => m.crew); }
function shareCrew_(a, b) { ensureCrews_(); const mine = crewIdsOf_(a); return readMembers_().some(m => m.id === b && mine.indexOf(m.crew) >= 0); }
// Ids visible in the current scope, or null for everyone.
function scopeSet_() {
  if (MEMO_.scope !== undefined) return MEMO_.scope;
  if (!CREW_ || CREW_ === 'all') return MEMO_.scope = null;
  const s = {}; readMembers_().filter(m => m.crew === CREW_).forEach(m => s[m.id] = true);
  return MEMO_.scope = s;
}
function inScope_(id) { const s = scopeSet_(); return !s || !!s[id]; }
function scopedNames_() { const names = {}; readPlayers_().forEach(p => { if (inScope_(p.id)) names[p.id] = p.name; }); return names; }
function scopedScores_() {
  const days = allScores_(), s = scopeSet_(); if (!s) return days;
  const out = {}; Object.keys(days).forEach(d => { const day = {}; Object.keys(days[d]).forEach(k => { if (s[k]) day[k] = days[d][k]; }); if (Object.keys(day).length) out[d] = day; });
  return out;
}
function getCrews(id) {
  id = cleanId_(id); ensureCrews_();
  const names = {}; readPlayers_().forEach(p => names[p.id] = p.name);
  const mine = crewIdsOf_(id), mem = readMembers_();
  const reqs = readShade_().filter(r => r.kind === 'join' && r.to === id && r.response !== 'yes' && r.response !== 'no');
  return readCrews_().filter(c => mine.indexOf(c.id) >= 0).map(c => {
    const ids = mem.filter(m => m.crew === c.id).map(m => m.id).filter(k => names[k]);
    const rq = c.owner === id ? reqs.filter(r => r.text === c.id && ids.indexOf(r.from) < 0).map(r => ({ id: r.id, from: r.from, name: names[r.from] || 'Someone' })) : [];
    return { reqs: rq, id: c.id, name: c.name, code: c.code, owner: c.owner === id, n: ids.length, ids: ids, members: ids.map(k => names[k]).sort(), people: ids.map(k => ({ id: k, name: names[k] })).sort((a, b) => a.name.localeCompare(b.name)) };
  });
}
function createCrew(id, name) {
  id = cleanId_(id); name = cleanText_(name, 24).trim(); ensureCrews_();
  if (!name) throw new Error('Give your crew a name.');
  if (!readPlayers_().some(p => p.id === id)) throw new Error('Unknown player.');
  if (readCrews_().filter(c => c.owner === id).length >= 5) throw new Error("You've started 5 crews already.");
  const lock = LockService.getScriptLock(); lock.waitLock(10000);
  let c; try { c = addCrew_(name, id); addMembers_(c.id, [id]); } finally { lock.releaseLock(); }
  return { crews: getCrews(id), crew: c.id };
}
function joinCrew(id, code) {
  id = cleanId_(id); code = String(code || '').toUpperCase().replace(/[^A-Z0-9]/g, ''); ensureCrews_();
  if (!readPlayers_().some(p => p.id === id)) throw new Error('Unknown player.');
  const c = readCrews_().find(x => x.code === code);
  if (!c) throw new Error("No crew with that code. Double-check it with whoever invited you.");
  if (crewIdsOf_(id).length >= 8) throw new Error("You're in 8 crews already. Leave one first.");
  const lock = LockService.getScriptLock(); lock.waitLock(10000);
  try { addMembers_(c.id, [id]); } finally { lock.releaseLock(); }
  return { crews: getCrews(id), crew: c.id, name: c.name };
}
function leaveCrew(id, crewId) {
  id = cleanId_(id); crewId = String(crewId || '');
  const lock = LockService.getScriptLock(); lock.waitLock(10000);
  try { const m = readMembers_().find(x => x.crew === crewId && x.id === id); if (m) membersSheet_().deleteRow(m.row); MEMO_.members = null; } finally { lock.releaseLock(); }
  return { crews: getCrews(id) };
}
function renameCrew(id, crewId, name) {
  id = cleanId_(id); name = cleanText_(name, 24).trim(); if (!name) throw new Error('Give your crew a name.');
  const sh = crewsSheet_(), c = readCrews_().findIndex(x => x.id === crewId);
  if (c < 0 || readCrews_()[c].owner !== id) throw new Error('Only the person who started the crew can rename it.');
  sh.getRange(c + 2, 2).setValue(name); MEMO_.crews = null;
  return { crews: getCrews(id) };
}
// Which crew this request is about: a crew id, 'all', or '' for "my first crew".
function setScope_(crew, meId) {
  MEMO_ = {}; CREW_ = typeof crew === 'string' ? crew : 'all';
  if (CREW_ === '') { try { ensureCrews_(); CREW_ = (meId && crewIdsOf_(cleanId_(meId))[0]) || 'all'; } catch (e) { CREW_ = 'all'; } MEMO_.scope = undefined; }
}
// Crew owner only: take someone out of the crew. They can still rejoin with the code, so change the code too if needed.
function removeFromCrew(id, crewId, targetId) {
  id = cleanId_(id); targetId = cleanId_(targetId); crewId = String(crewId || '');
  const c = readCrews_().find(x => x.id === crewId);
  if (!c || c.owner !== id) throw new Error('Only the person who started the crew can remove people.');
  if (targetId === id) throw new Error("That's you. Use Leave instead.");
  const lock = LockService.getScriptLock(); lock.waitLock(10000);
  try { const m = readMembers_().find(x => x.crew === crewId && x.id === targetId); if (m) membersSheet_().deleteRow(m.row); MEMO_.members = null; } finally { lock.releaseLock(); }
  return { crews: getCrews(id) };
}
// Crew owner only: a fresh invite code, so old links stop working.
function newCrewCode(id, crewId) {
  id = cleanId_(id); crewId = String(crewId || '');
  const i = readCrews_().findIndex(x => x.id === crewId);
  if (i < 0 || readCrews_()[i].owner !== id) throw new Error('Only the person who started the crew can change its code.');
  crewsSheet_().getRange(i + 2, 3).setValue(newCode_()); MEMO_.crews = null;
  return { crews: getCrews(id) };
}
// Ask to join a crew you've seen on the Everyone board. The owner gets a notification and decides.
function requestJoin(id, crewId, dateKey) {
  id = cleanId_(id); crewId = String(crewId || ''); dateKey = cleanDate_(dateKey);
  const c = readCrews_().find(x => x.id === crewId); if (!c) throw new Error('That crew is gone.');
  if (crewIdsOf_(id).indexOf(crewId) >= 0) throw new Error("You're already in " + c.name + '.');
  if (!readPlayers_().some(p => p.id === id)) throw new Error('Unknown player.');
  const lock = LockService.getScriptLock(); lock.waitLock(10000);
  try {
    if (readShade_().some(r => r.kind === 'join' && r.from === id && r.text === crewId && r.date >= addDays_(dateKey, -6))) throw new Error('You already asked this week. Hang tight.');
    const sh = shadeSheet_(), r = sh.getLastRow() + 1; sh.getRange(r, 1, 1, 7).setNumberFormat('@');
    sh.getRange(r, 1, 1, SHADE_HEADERS.length).setValues([[Utilities.getUuid().slice(0, 8), dateKey, id, c.owner, crewId, 'join', '', new Date(), '', '']]);
  } finally { lock.releaseLock(); }
  return true;
}
// Owner answers a request: yes adds them (and tells them); no just closes it quietly.
function answerJoin(id, reqId, yes, dateKey) {
  id = cleanId_(id); reqId = String(reqId || ''); dateKey = cleanDate_(dateKey);
  const lock = LockService.getScriptLock(); lock.waitLock(10000);
  let name = '';
  try {
    const row = readShade_().find(r => r.id === reqId && r.kind === 'join' && r.to === id); if (!row) throw new Error('That request is gone.');
    const c = readCrews_().find(x => x.id === row.text); if (!c || c.owner !== id) throw new Error('Only the crew owner can answer that.');
    name = c.name;
    shadeSheet_().getRange(row.row, 9, 1, 2).setValues([[new Date(), yes ? 'yes' : 'no']]);
    if (yes) {
      addMembers_(c.id, [row.from]);
      const sh = shadeSheet_(), r = sh.getLastRow() + 1; sh.getRange(r, 1, 1, 7).setNumberFormat('@');
      sh.getRange(r, 1, 1, SHADE_HEADERS.length).setValues([[Utilities.getUuid().slice(0, 8), dateKey, id, row.from, c.id, 'joinok', reqId, new Date(), '', '']]);
    }
  } finally { lock.releaseLock(); }
  return { crews: getCrews(id), shade: getShadeState(id, dateKey) };
}
// Crew owner only: add someone straight in. They get a notification and can Leave if they want.
function addToCrew(id, crewId, targetId, dateKey) {
  id = cleanId_(id); targetId = cleanId_(targetId); crewId = String(crewId || ''); dateKey = cleanDate_(dateKey);
  const c = readCrews_().find(x => x.id === crewId);
  if (!c || c.owner !== id) throw new Error('Only the person who started the crew can add people.');
  const who = readPlayers_().find(p => p.id === targetId); if (!who) throw new Error('Unknown player.');
  if (crewIdsOf_(targetId).indexOf(crewId) >= 0) throw new Error(who.name + ' is already in ' + c.name + '.');
  if (crewIdsOf_(targetId).length >= 8) throw new Error(who.name + " is in 8 crews already.");
  const lock = LockService.getScriptLock(); lock.waitLock(10000);
  try {
    addMembers_(c.id, [targetId]);
    const sh = shadeSheet_(), r = sh.getLastRow() + 1; sh.getRange(r, 1, 1, 7).setNumberFormat('@');
    sh.getRange(r, 1, 1, SHADE_HEADERS.length).setValues([[Utilities.getUuid().slice(0, 8), dateKey, id, targetId, c.id, 'added', '', new Date(), '', '']]);
    // an open "ask to join" (or new-player heads-up) about them is now answered
    readShade_().filter(x => (x.kind === 'join' || x.kind === 'newbie') && x.from === targetId && x.text === crewId && x.response !== 'yes' && x.response !== 'no').forEach(x => sh.getRange(x.row, 9, 1, 2).setValues([[new Date(), 'yes']]));
  } finally { lock.releaseLock(); }
  return { crews: getCrews(id), name: who.name };
}
const NOT_MATES_ = "Shade, reactions and dares are just for your crew. Invite them to one first.";

// ---------------- League, crowns, trophies, head-to-head ----------------
// Every finished game as { 'yyyy-MM-dd': { playerId: result } }.
function allScores_() {
  const sh = scoresSheet_();
  const tz = ss_().getSpreadsheetTimeZone();
  const n = sh.getLastRow() - 1;
  const days = {};
  if (n < 1) return days;
  sh.getRange(2, 1, n, SCORE_HEADERS.length).getValues().forEach(v => {
    const d = asDateKey_(v[0], tz), id = String(v[1]);
    if (!id || !/^\d{4}-\d{2}-\d{2}$/.test(d)) return;
    (days[d] = days[d] || {})[id] = parseRow_(v);
  });
  return days;
}
// Points for one day. Five: 5 for 1 or 2 guesses, then 4, 3, 2, 1. Groups: 5 minus mistakes.
// Mini and Strands: 5 for the fastest, then 4, 3, 2, and 1 for everyone else who finished.
function dayPoints_(day) {
  const parts = dayParts_(day), pts = {};
  Object.keys(parts).forEach(id => { const x = parts[id]; pts[id] = x.f + x.g + x.c + x.s; });
  return pts;
}
// The same points split by game: { id: { f, g, c, s } } (Five, Groups, Mini, Strands).
function dayParts_(day) {
  const pts = {};
  Object.keys(day).forEach(id => {
    const t = day[id]; pts[id] = { f: 0, g: 0, c: 0, s: 0 };
    if (t.f && t.f.w) pts[id].f = Math.min(5, 7 - t.f.n); // 1 or 2 guesses = 5, so a lucky first guess isn't a jackpot
    if (t.g && t.g.w) pts[id].g = 5 - t.g.m;
  });
  const ranked = (key, score) => Object.keys(day).filter(id => day[id][key]).sort((a, b) => score(day[a][key]) - score(day[b][key])).forEach((id, i) => pts[id][key] = Math.max(1, 6 - i)); // timed games: 6 for fastest
  ranked('c', c => c.t + (c.k ? 30 : 0));
  ranked('s', x => x.t + 30 * x.h);
  return pts;
}
function dayWinners_(day) {
  if (!day) return [];
  const p = dayPoints_(day);
  const max = Math.max(0, ...Object.keys(p).map(k => p[k]));
  return max > 0 ? Object.keys(p).filter(k => p[k] === max) : [];
}
function weekStart_(dateKey) {
  const p = dateKey.split('-').map(Number);
  const dow = (new Date(Date.UTC(p[0], p[1] - 1, p[2])).getUTCDay() + 6) % 7; // Monday = 0
  return addDays_(dateKey, -dow);
}
// Weekly total counts each player's best 5 days, so missing a day or two doesn't sink your week.
const WEEK_BEST = 5;
// detail=true adds `by`: every day played with its points per game and whether it was one of the best 5 that counted.
function weekTable_(days, start, end, names, detail) {
  const per = {};
  for (let d = start, i = 0; d <= end && i < 400; d = addDays_(d, 1), i++) {
    if (!days[d]) continue;
    const p = dayParts_(days[d]);
    Object.keys(p).forEach(k => { const x = p[k]; (per[k] = per[k] || []).push({ d: d, p: x.f + x.g + x.c + x.s, f: x.f, g: x.g, c: x.c, s: x.s }); });
  }
  return Object.keys(per).filter(k => names[k]).map(k => {
    const top = per[k].slice().sort((a, b) => b.p - a.p || (a.d < b.d ? -1 : 1)).slice(0, WEEK_BEST);
    const row = { id: k, name: names[k], pts: top.reduce((a, b) => a + b.p, 0), days: per[k].length };
    if (detail) { top.forEach(x => x.k = 1); row.by = per[k]; }
    return row;
  }).sort((a, b) => b.pts - a.pts);
}

// Weekly awards (Mon-Sun). Each is { key, ids, names, why }; up to 3 can share one.
function weekAwards_(days, start, end, names) {
  const shade = readShade_().filter(r => r.date >= start && r.date <= end);
  const reacts = reactSheet_().getLastRow() > 1 ? (function () {
    const sh = reactSheet_(), tz = ss_().getSpreadsheetTimeZone();
    return sh.getRange(2, 1, sh.getLastRow() - 1, 4).getValues().map(r => ({ date: asDateKey_(r[0], tz), to: String(r[2]) }));
  })().filter(r => r.date >= start && r.date <= end) : [];
  const st = {};
  const g = id => st[id] = st[id] || { days: 0, fiveN: 0, fiveG: 0, perfect: 0, chokes: 0, mini: null, strands: null, thrown: 0, got: 0, claps: 0, reacts: 0 };
  for (let d = start, i = 0; d <= end && i < 8; d = addDays_(d, 1), i++) {
    const day = days[d]; if (!day) continue;
    Object.keys(day).forEach(id => {
      const t = day[id], x = g(id); x.days++;
      if (t.f) { if (t.f.w) { x.fiveN += t.f.n; x.fiveG++; } else x.chokes++; }
      if (t.g) { if (!t.g.w) x.chokes++; else if (t.g.m === 0) x.perfect++; }
      if (t.c && !t.c.k && (x.mini === null || t.c.t < x.mini)) x.mini = t.c.t;
      if (t.s && t.s.h === 0 && (x.strands === null || t.s.t < x.strands)) x.strands = t.s.t;
    });
  }
  shade.forEach(r => { if (DARE_KINDS.indexOf(r.kind) >= 0) return; if (r.kind === 'clap') g(r.from).claps++; else { g(r.from).thrown++; g(r.to).got++; } });
  reacts.forEach(r => g(r.to).reacts++);
  const ids = Object.keys(st).filter(k => names[k]);
  const mmss = t => Math.floor(t / 60) + ':' + ('0' + (t % 60)).slice(-2);
  const best = (key, val, ok, lowWins, why) => {
    let v0 = null, win = [];
    ids.forEach(id => {
      const v = val(st[id]); if (v === null || !ok(st[id], v)) return;
      if (v0 === null || (lowWins ? v < v0 : v > v0)) { v0 = v; win = [id]; } else if (v === v0) win.push(id);
    });
    if (!win.length || win.length > 3) return null; // a 4-way tie isn't an award
    return { key: key, ids: win, names: win.map(id => names[id]), why: why(v0, st[win[0]]) };
  };
  return [
    best('grinder', x => x.days, (x, v) => v >= 3, false, v => v + ' of 7 days played'),
    best('speed', x => x.mini, () => true, true, v => 'Mini in ' + mmss(v)),
    best('sniper', x => x.strands, () => true, true, v => 'Strands in ' + mmss(v) + ', no hints'),
    best('brain', x => x.fiveG ? x.fiveN / x.fiveG : null, x => x.fiveG >= 3, true, (v, x) => 'Five in ' + v.toFixed(1) + ' guesses on average'),
    best('sweep', x => x.perfect, (x, v) => v > 0, false, v => v + (v === 1 ? ' perfect Groups sort' : ' perfect Groups sorts')),
    best('choke', x => x.chokes, (x, v) => v > 0, false, v => v + (v === 1 ? ' loss' : ' losses')),
    best('merchant', x => x.thrown, (x, v) => v > 0, false, v => v + ' shade thrown'),
    best('bag', x => x.got, (x, v) => v > 0, false, v => v + ' shade taken'),
    best('clapper', x => x.claps, (x, v) => v > 0, false, v => v + (v === 1 ? ' clap back' : ' clap backs')),
    best('fav', x => x.reacts, (x, v) => v > 0, false, v => v + (v === 1 ? ' reaction' : ' reactions'))
  ].filter(Boolean);
}

// Yesterday's crown, this week's league table, and last week's champion.
function getStats(id, dateKey) {
  id = cleanId_(id); dateKey = cleanDate_(dateKey);
  const names = scopedNames_();
  const days = scopedScores_();
  const ws = weekStart_(dateKey);
  const last = weekTable_(days, addDays_(ws, -7), addDays_(ws, -1), names, true);
  return {
    crown: dayWinners_(days[addDays_(dateKey, -1)]).filter(k => names[k]).map(k => ({ id: k, name: names[k] })),
    week: weekTable_(days, ws, dateKey, names, true),
    weekStart: ws,
    lastChamp: last.length && last[0].pts > 0 ? last[0] : null,
    awards: weekAwards_(days, ws, dateKey, names),
    lastAwards: weekAwards_(days, addDays_(ws, -7), addDays_(ws, -1), names)
  };
}

// Week in Review: last Mon-Sun for the crew being viewed. Podium, your finish and daily points, your best moment, awards.
function getWeekReview(id, dateKey) {
  id = cleanId_(id); dateKey = cleanDate_(dateKey);
  const names = scopedNames_(), days = scopedScores_(), start = addDays_(weekStart_(dateKey), -7), end = addDays_(start, 6);
  const table = weekTable_(days, start, end, names, true);
  const mi = table.findIndex(x => x.id === id), mine = mi >= 0 ? table[mi] : null;
  const DN = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], dayName = d => { let i = 0, x = start; while (x < d && i < 6) { x = addDays_(x, 1); i++; } return DN[i]; };
  const mmss = s => Math.floor(s / 60) + ':' + ('0' + (s % 60)).slice(-2);
  // best moment: fastest clean Mini / Strands vs everyone that week, Five in 1-2, perfect Groups, best day
  let moment = null;
  if (mine) {
    const minis = [], strs = []; let five = null, perf = 0;
    for (let d = start; d <= end; d = addDays_(d, 1)) {
      const day = days[d] || {};
      Object.keys(day).forEach(k => { const x = day[k];
        if (x.c && !x.c.k) minis.push({ k: k, t: x.c.t, d: d });
        if (x.s && !x.s.h) strs.push({ k: k, t: x.s.t, d: d }); });
      const m = day[id]; if (!m) continue;
      if (m.f && m.f.w && m.f.n <= 2 && (!five || m.f.n < five.n)) five = { n: m.f.n, d: d };
      if (m.g && m.g.w && m.g.m === 0) perf++;
    }
    const place = (list, icon, game) => {
      list.sort((a, b) => a.t - b.t); const i = list.findIndex(x => x.k === id); if (i < 0 || i > 2) return null;
      const b = list[i], other = list.find(x => x.k !== id);
      const rank = list.filter(x => x.t < b.t).length;
      return { score: 10 - rank * 3, text: `${icon} ${game} in ${mmss(b.t)} on ${dayName(b.d)}${game === 'Strands' ? ', no hints' : ''}. ` + (rank === 0 ? 'Fastest anyone went all week.' : `${rank === 1 ? '2nd' : '3rd'} fastest all week${other ? `, ${b.t - other.t}s off ${names[other.k]}` : ''}.`) };
    };
    const opts = [place(minis.slice(), '⚡', 'Mini'), place(strs.slice(), '🎯', 'Strands')].filter(Boolean);
    if (five) opts.push({ score: five.n === 1 ? 11 : 6, text: five.n === 1 ? `🤯 Five in ONE guess on ${dayName(five.d)}.` : `🧠 Five in 2 guesses on ${dayName(five.d)}.` });
    if (perf >= 4) opts.push({ score: 5 + perf / 2, text: `💎 ${perf} perfect Groups. Not a single mistake on ${perf} days.` });
    const bd = mine.by.slice().sort((a, b) => b.p - a.p)[0];
    if (bd) opts.push({ score: 3, text: `📈 Your best day: ${bd.p} pts on ${dayName(bd.d)}.` });
    opts.sort((a, b) => b.score - a.score); moment = opts[0] ? opts[0].text : null;
  }
  let games = 0; for (let d = start; d <= end; d = addDays_(d, 1)) Object.keys(days[d] || {}).forEach(k => { if (!names[k]) return; const x = days[d][k]; games += ['f', 'g', 'c', 's'].filter(g => x[g]).length; });
  const crew = CREW_ && CREW_ !== 'all' ? (readCrews_().find(c => c.id === CREW_) || {}).name || '' : '';
  return {
    start: start, end: end, crew: crew, players: table.length, games: games,
    podium: table.slice(0, 3).map(x => ({ id: x.id, name: x.name, pts: x.pts })),
    me: mine ? { rank: mi + 1, pts: mine.pts, by: mine.by, days: mine.days, above: mi > 0 ? { name: table[mi - 1].name, pts: table[mi - 1].pts } : null, below: mi === 0 && table[1] ? { name: table[1].name, pts: table[1].pts } : null } : null,
    moment: moment, awards: weekAwards_(days, start, end, names)
  };
}
// Long-run puzzle standings. Like the weekly league, only your best days count, so a few days off (or joining late)
// doesn't bury you: this month = best 20 days, this year = best 200 days. All time ranks by points per day played.
function getAllTime(id, dateKey) {
  dateKey = cleanDate_(dateKey);
  const names = scopedNames_();
  const days = scopedScores_(), per = {};
  Object.keys(days).filter(d => d <= dateKey).forEach(d => {
    const day = days[d], pts = dayPoints_(day), win = dayWinners_(day);
    Object.keys(day).forEach(k => { if (names[k]) (per[k] || (per[k] = [])).push({ d: d, p: pts[k] || 0, w: win.indexOf(k) >= 0 }); });
  });
  // Weekly champions: winner of every finished Mon-Sun league week.
  const champs = [], thisWeek = weekStart_(dateKey), seenW = {};
  Object.keys(days).filter(d => d <= dateKey).forEach(d => { const w = weekStart_(d); if (w < thisWeek) seenW[w] = true; });
  Object.keys(seenW).sort().forEach(w => { const t = weekTable_(days, w, addDays_(w, 6), names, true); if (t.length && t[0].pts > 0) champs.push({ week: w, id: t[0].id, name: t[0].name, pts: t[0].pts, by: t[0].by }); });
  const titles = (k, from, to) => champs.filter(c => c.id === k && c.week >= from.slice(0, 10) && addDays_(c.week, 6) <= to).length;
  const table = (from, to, best) => Object.keys(per).map(k => {
    const list = per[k].filter(x => x.d >= from && x.d <= to); if (!list.length) return null;
    const top = list.map(x => x.p).sort((a, b) => b - a).slice(0, best || list.length);
    const total = list.reduce((a, x) => a + x.p, 0);
    return { id: k, name: names[k], pts: top.reduce((a, b) => a + b, 0), total: total, days: list.length, wins: list.filter(x => x.w).length, titles: titles(k, from, to), avg: Math.round(10 * total / list.length) / 10 };
  }).filter(Boolean);
  const mStart = dateKey.slice(0, 8) + '01', yStart = dateKey.slice(0, 5) + '01-01';
  const prevEnd = addDays_(mStart, -1), prevStart = prevEnd.slice(0, 8) + '01';
  const byPts = a => a.sort((x, y) => y.pts - x.pts || y.wins - x.wins);
  // Puzzle Hall of Fame: fastest clean Mini / Strands (personal bests), best Five and Groups averages (7+ games).
  const pb = { c: {}, s: {} }, av = { f: {}, g: {} };
  Object.keys(days).filter(d => d <= dateKey).forEach(d => Object.keys(days[d]).forEach(k => {
    if (!names[k]) return; const t = days[d][k];
    if (t.c && !t.c.k && t.c.t > 0 && (!pb.c[k] || t.c.t < pb.c[k].v)) pb.c[k] = { v: t.c.t, d: d };
    if (t.s && !t.s.h && t.s.t > 0 && (!pb.s[k] || t.s.t < pb.s[k].v)) pb.s[k] = { v: t.s.t, d: d };
    if (t.f) { const a = av.f[k] || (av.f[k] = { sum: 0, n: 0, best: 0 }); a.sum += t.f.w ? t.f.n : 7; a.n++; if (t.f.w && t.f.n <= 2) a.best++; }
    if (t.g) { const a = av.g[k] || (av.g[k] = { sum: 0, n: 0, best: 0 }); a.sum += t.g.w ? t.g.m : 4; a.n++; if (t.g.w && t.g.m === 0) a.best++; }
  }));
  const fast = m => Object.keys(m).map(k => ({ id: k, name: names[k], v: m[k].v, d: m[k].d })).sort((a, b) => a.v - b.v).slice(0, 5);
  const avgs = m => Object.keys(m).filter(k => m[k].n >= 7).map(k => ({ id: k, name: names[k], v: Math.round(100 * m[k].sum / m[k].n) / 100, n: m[k].n, best: m[k].best })).sort((a, b) => a.v - b.v || b.n - a.n).slice(0, 5);
  const hof = { mini: fast(pb.c), strands: fast(pb.s), five: avgs(av.f), groups: avgs(av.g) };
  const last = byPts(table(prevStart, prevEnd, 20));
  return {
    month: byPts(table(mStart, dateKey, 20)), year: byPts(table(yStart, dateKey, 200)),
    all: table('0000', dateKey).sort((x, y) => (y.days >= 10) - (x.days >= 10) || y.avg - x.avg),
    hof: hof, champs: champs.slice(-26).reverse(), monthKey: mStart, yearKey: yStart.slice(0, 4), lastMonth: last.length && last[0].pts > 0 ? { name: last[0].name, pts: last[0].pts, key: prevStart } : null
  };
}
// A player's trophy case, plus your all-time record against them.
function getPlayerCard(viewerId, targetId, dateKey) {
  viewerId = cleanId_(viewerId); targetId = cleanId_(targetId); dateKey = cleanDate_(dateKey);
  const names = scopedNames_();
  const days = scopedScores_();
  const dates = Object.keys(days).filter(d => d <= dateKey).sort();
  const b = { crowns: 0, titles: 0, genius: 0, perfectGroups: 0, quickMini: 0, quickStrands: 0, bestStreak: 0, perfectWeek: false, played: 0 };
  let run = 0, prev = null, fullRun = 0, prevFull = null, usedW = {};
  dates.forEach(d => {
    const t = days[d][targetId];
    if (dayWinners_(days[d]).indexOf(targetId) >= 0) b.crowns++;
    if (!t) return;
    b.played++;
    if (t.f && t.f.w && t.f.n <= 2) b.genius++;
    if (t.g && t.g.w && t.g.m === 0) b.perfectGroups++;
    if (t.c && !t.c.k && t.c.t < 30) b.quickMini++;
    if (t.s && t.s.h === 0 && t.s.t < 120) b.quickStrands++;
    if (prev && addDays_(prev, 1) === d) run++;
    else if (prev && addDays_(prev, 2) === d && !usedW[weekStart_(addDays_(prev, 1))]) { usedW[weekStart_(addDays_(prev, 1))] = true; run++; } // streak freeze
    else { run = 1; usedW = {}; }
    prev = d; b.bestStreak = Math.max(b.bestStreak, run);
    if (t.f && t.g && t.c && t.s) { fullRun = prevFull && addDays_(prevFull, 1) === d ? fullRun + 1 : 1; prevFull = d; if (fullRun >= 7) b.perfectWeek = true; }
  });
  const thisWeek = weekStart_(dateKey);
  const weeks = {}; dates.forEach(d => { const w = weekStart_(d); if (w < thisWeek) weeks[w] = true; });
  Object.keys(weeks).forEach(w => { const t = weekTable_(days, w, addDays_(w, 6), names); if (t.length && t[0].id === targetId && t[0].pts > 0) b.titles++; });
  let h2h = null;
  if (viewerId !== targetId) {
    h2h = { five: [0, 0, 0], groups: [0, 0, 0], mini: [0, 0, 0], strands: [0, 0, 0] };
    dates.forEach(d => {
      const a = days[d][viewerId], o = days[d][targetId];
      if (!a || !o) return;
      const cmp = (k, key, fn) => { if (a[k] && o[k]) { const x = fn(a[k]), y = fn(o[k]); h2h[key][x < y ? 0 : x > y ? 1 : 2]++; } };
      cmp('f', 'five', f => f.w ? f.n : 7);
      cmp('g', 'groups', g => g.w ? g.m : 5);
      cmp('c', 'mini', c => c.t + (c.k ? 30 : 0));
      cmp('s', 'strands', x => x.t + 30 * x.h);
    });
  }
  const cur = prev && (prev === dateKey || addDays_(prev, 1) === dateKey) ? run : 0;
  const stats = playerStats_(days, dates, targetId, dateKey); stats.cur = cur; stats.best = b.bestStreak;
  const mineC = crewIdsOf_(viewerId), asked = readShade_().filter(r => r.kind === 'join' && r.from === viewerId && r.date >= addDays_(dateKey, -6)).map(r => r.text);
  const canAsk = viewerId === targetId ? [] : readCrews_().filter(c => crewIdsOf_(targetId).indexOf(c.id) >= 0 && mineC.indexOf(c.id) < 0).map(c => ({ id: c.id, name: c.name, asked: asked.indexOf(c.id) >= 0 }));
  const canAdd = viewerId === targetId ? [] : readCrews_().filter(c => c.owner === viewerId && crewIdsOf_(targetId).indexOf(c.id) < 0).map(c => ({ id: c.id, name: c.name }));
  return { canAdd: canAdd, canAsk: canAsk, id: targetId, name: names[targetId] || (readPlayers_().find(p => p.id === targetId) || {}).name || 'Player', badges: b, h2h: h2h, stats: stats, mine: viewerId !== targetId ? playerStats_(days, dates, viewerId, dateKey) : null };
}
// Wordle-style stats for one player: Five guess spread, Groups mistake spread, Strands/Mini times + last-14-day trend, last 7 days.
function playerStats_(days, dates, id, dateKey) {
  const s = { played: 0, five: [0, 0, 0, 0, 0, 0, 0], groups: [0, 0, 0, 0, 0], st: { n: 0, sum: 0, best: 0, hints: 0, trend: [] }, mi: { n: 0, sum: 0, best: 0, checks: 0, trend: [] }, form: [] };
  const recent = addDays_(dateKey, -13);
  dates.forEach(d => {
    const t = days[d][id]; if (!t) return; s.played++;
    if (t.f) s.five[t.f.w ? Math.min(6, t.f.n) - 1 : 6]++;
    if (t.g) s.groups[t.g.w ? Math.min(3, t.g.m) : 4]++;
    if (t.s) { s.st.n++; s.st.sum += t.s.t; if (!s.st.best || t.s.t < s.st.best) s.st.best = t.s.t; if (t.s.h) s.st.hints++; if (d >= recent) s.st.trend.push(t.s.t + 30 * (t.s.h || 0)); }
    if (t.c) { s.mi.n++; s.mi.sum += t.c.t; if (!s.mi.best || t.c.t < s.mi.best) s.mi.best = t.c.t; if (t.c.k) s.mi.checks++; if (d >= recent) s.mi.trend.push(t.c.t + (t.c.k ? 30 : 0)); }
  });
  for (let i = 6; i >= 0; i--) {
    const d = addDays_(dateKey, -i), t = (days[d] || {})[id] || {};
    s.form.push({ d: d, f: t.f ? (t.f.w ? (t.f.n <= 3 ? 2 : 1) : 0) : -1, g: t.g ? (t.g.w ? (t.g.m === 0 ? 2 : 1) : 0) : -1, s: t.s ? (t.s.h ? 1 : 2) : -1, c: t.c ? (t.c.k ? 1 : 2) : -1 });
  }
  const fp = s.five.reduce((a, b) => a + b, 0); s.winPct = fp ? Math.round(100 * (fp - s.five[6]) / fp) : 0;
  return s;
}


// ---------------- Arcade: Zoomies ----------------
// Just for fun: never counts toward daily points, the league, awards or streaks.
const ZOOMIES_MAX = 999;
const ARCADE_GAMES = { zoomies: 300, snake: 999, fetch: 99999, pupman: 999999, putt: 450, hop: 99999, blocks: 9999999, cross: 99999, jump: 999999, smash: 9999,
  duck: 99999, derby: 99999, dawgball: 999, kickret: 9999, hoops: 9999, pks: 9999, golf: 72, darts: 9999, bowl: 300,
  punch: 99999, volley: 9999, swim: 9999, shred: 99999, fg: 9999, airhockey: 9999, tennis: 9999, drive: 99999, mow: 99999, drip: 9999, putt18: 900, pool: 9999,
  td: 99999, pop: 99999, trail: 9999, archery: 100, golf18: 144, party: 1500, dash: 999999, harvest: 99999, dvz: 99999, trap: 999999, euchre: 300, crib: 500,
  sgroups: 1000, hive: 999, sudoku: 3000, pips: 3000, crazy: 2000, rummy: 800, topdogs: 1000, leash: 1000, mahjong: 1500, mjrush: 999999, mjzen: 999999 };
const DEN_DAILY = { sgroups: true, hive: true, sudoku: true, pips: true, topdogs: true, leash: true, mahjong: true }; // daily Den puzzles get a today-only board too
const GOTD_POOL = Object.keys(ARCADE_GAMES).filter(g => ['mow', 'golf18', 'putt18', 'trail', 'euchre', 'crib', 'crazy', 'rummy', 'sgroups', 'hive', 'sudoku', 'pips', 'topdogs', 'leash', 'mahjong', 'mjzen'].indexOf(g) < 0); // long or retired games sit out
// Game of the Day: one per hub (Arcade, Sports, Den card games), each with its own board that resets at midnight.
const SPORTS_GAMES = ['airhockey', 'archery', 'bowl', 'darts', 'dawgball', 'derby', 'duck', 'fg', 'golf', 'hoops', 'kickret', 'pks', 'pool', 'punch', 'shred', 'swim', 'tennis', 'volley'];
const GOTD_POOLS = { arcade: GOTD_POOL.filter(g => SPORTS_GAMES.indexOf(g) < 0), sports: GOTD_POOL.filter(g => SPORTS_GAMES.indexOf(g) >= 0) };
const ARCADE_LOW = { golf: true, golf18: true }; // lower score wins (strokes)
const arcBetter_ = (g, a, b) => ARCADE_LOW[g] ? (a > 0 && (!(b > 0) || a < b)) : a > b; // game -> highest believable score
// A missing game means an old app version (Zoomies only). An unknown game is refused, so a score can never
// land on the wrong leaderboard when the app is newer than this server code.
const cleanGame_ = g => { if (g == null || g === '') return 'zoomies'; if (!ARCADE_GAMES[g]) throw new Error('This game needs the newest server update.'); return g; };
// Dares are stored as "game:score" (older ones are just "score", meaning Zoomies).
function parseDare_(text) { const m = String(text).match(/^(?:([a-z]+):)?(\d+)/); return { game: cleanGame_(m && m[1]), target: m ? Number(m[2]) : 0 }; }
function readArcade_() {
  const sh = arcadeSheet_();
  const n = sh.getLastRow() - 1;
  if (n < 1) return [];
  const tz = ss_().getSpreadsheetTimeZone();
  return sh.getRange(2, 1, n, ARCADE_HEADERS.length).getValues().map((r, i) => ({
    date: asDateKey_(r[0], tz), id: String(r[1]), game: String(r[2]), best: Number(r[3]) || 0, plays: Number(r[4]) || 0, row: i + 2
  }));
}
function cleanScore_(score, game) {
  const n = Math.floor(Number(score));
  if (!isFinite(n) || n < 0 || n > ARCADE_GAMES[cleanGame_(game)]) throw new Error('That score looks off.');
  return n;
}
// One row per player per day: the day's best run and how many runs.
function submitArcade(id, dateKey, score, game) {
  game = cleanGame_(game); id = cleanId_(id); dateKey = cleanDate_(dateKey); score = cleanScore_(score, game);
  const lock = LockService.getScriptLock(); lock.waitLock(10000);
  try {
    if (!readPlayers_().some(p => p.id === id)) throw new Error('Unknown player.');
    const had = readArcade_().find(r => r.date === dateKey && r.id === id && r.game === game);
    const sh = arcadeSheet_();
    if (had) sh.getRange(had.row, 4, 1, 3).setValues([[arcBetter_(game, score, had.best) ? score : had.best, had.plays + 1, new Date()]]);
    else {
      const r = sh.getLastRow() + 1;
      sh.getRange(r, 1, 1, 3).setNumberFormat('@');
      sh.getRange(r, 1, 1, ARCADE_HEADERS.length).setValues([[dateKey, id, game, score, 1, new Date()]]);
    }
  } finally { lock.releaseLock(); }
  return getArcade(id, dateKey);
}
// High scores: this week (Mon-Sun) and all time, best run per player.
function getArcade(id, dateKey) {
  id = cleanId_(id); dateKey = cleanDate_(dateKey);
  const names = scopedNames_();
  const rowsAll = readArcade_().filter(r => names[r.id]);
  const ws = weekStart_(dateKey);
  const bestBy = (list, g) => {
    const m = {}; list.forEach(r => { if (r.best > 0 && (!m[r.id] || arcBetter_(g, r.best, m[r.id]))) m[r.id] = r.best; });
    return Object.keys(m).map(k => ({ id: k, name: names[k], n: m[k] })).sort((a, b) => ARCADE_LOW[g] ? a.n - b.n : b.n - a.n);
  };
  const games = {};
  Object.keys(ARCADE_GAMES).forEach(g => {
    const rows = rowsAll.filter(r => (r.game || 'zoomies') === g);
    const all = bestBy(rows, g), week = bestBy(rows.filter(r => r.date >= ws && r.date <= dateKey), g);
    const mine = all.find(x => x.id === id);
    games[g] = { week: week.slice(0, 10), all: all.slice(0, 10), myBest: mine ? mine.n : 0, today: DEN_DAILY[g] ? bestBy(rows.filter(r => r.date === dateKey), g).slice(0, 5) : undefined };
  });
  // Game of the Day: one arcade/sports game a day gets its own leaderboard that resets at midnight.
  const yk = addDays_(dateKey, -1), gotds = {};
  Object.keys(GOTD_POOLS).forEach(cat => {
    const pool = GOTD_POOLS[cat];
    const pick = dk => { let h = cat === 'arcade' ? 7 : cat === 'sports' ? 11 : 13; const k = cat + dk; for (let i = 0; i < k.length; i++) h = (h * 31 + k.charCodeAt(i)) >>> 0; return pool[h % pool.length]; };
    const tg = pick(dateKey), yg = pick(yk);
    gotds[cat] = { game: tg, cat: cat, board: bestBy(rowsAll.filter(r => (r.game || 'zoomies') === tg && r.date === dateKey), tg).slice(0, 5),
      y: { game: yg, win: bestBy(rowsAll.filter(r => (r.game || 'zoomies') === yg && r.date === yk), yg)[0] || null } };
  });
  const z = games.zoomies;
  return { games: games, week: z.week, all: z.all, myBest: z.myBest, weekStart: ws, gotd: gotds.arcade, gotds: gotds };
}
// Dare a friend to beat a score. Up to 3 dares per friend per day.
function sendDare(fromId, toId, dateKey, score, game) {
  game = cleanGame_(game); fromId = cleanId_(fromId); toId = cleanId_(toId); dateKey = cleanDate_(dateKey); score = cleanScore_(score, game);
  if (fromId === toId) throw new Error("You can't dare yourself.");
  if (score < 1) throw new Error('Score at least 1 before you dare anyone.');
  const lock = LockService.getScriptLock(); lock.waitLock(10000);
  try {
    const players = readPlayers_();
    const to = players.find(p => p.id === toId);
    if (!players.some(p => p.id === fromId) || !to) throw new Error('Unknown player.');
    if (!shareCrew_(fromId, toId)) throw new Error(NOT_MATES_);
    // No point daring someone to beat a score they've already beaten.
    const theirs = readArcade_().filter(r => r.id === toId && (r.game || 'zoomies') === game && r.best > 0).reduce((m, r) => m && !arcBetter_(game, r.best, m) ? m : r.best, 0);
    if (theirs > 0 && !arcBetter_(game, score, theirs)) throw new Error(to.name + ' already has ' + theirs + ' in that game. Beat that first.');
    const n = readShade_().filter(r => r.kind === 'dare' && r.from === fromId && r.to === toId && r.date === dateKey).length;
    if (n >= 3) throw new Error("You've dared " + to.name + ' 3 times today. Let them breathe.');
    const sh = shadeSheet_(), r = sh.getLastRow() + 1;
    sh.getRange(r, 1, 1, 7).setNumberFormat('@');
    sh.getRange(r, 1, 1, SHADE_HEADERS.length).setValues([[Utilities.getUuid().slice(0, 8), dateKey, fromId, toId, game + ':' + score, 'dare', '', new Date(), '', '']]);
  } finally { lock.releaseLock(); }
  return getShadeState(fromId, dateKey);
}
// Your run after accepting a dare. Sends the result back to whoever dared you. One answer per dare.
function answerDare(id, dateKey, dareId, score) {
  id = cleanId_(id); dateKey = cleanDate_(dateKey); dareId = String(dareId || '');
  const lock = LockService.getScriptLock(); lock.waitLock(10000);
  let won = false, target = 0;
  try {
    const rows = readShade_();
    const dare = rows.find(r => r.id === dareId && r.kind === 'dare' && r.to === id);
    if (!dare) throw new Error('That dare is gone.');
    if (rows.some(r => r.kind === 'dareres' && r.replyTo === dareId)) throw new Error('You already answered that dare.');
    const d = parseDare_(dare.text); target = d.target; score = cleanScore_(score, d.game); won = arcBetter_(d.game, score, target);
    const sh = shadeSheet_(), r = sh.getLastRow() + 1;
    sh.getRange(r, 1, 1, 7).setNumberFormat('@');
    sh.getRange(r, 1, 1, SHADE_HEADERS.length).setValues([[Utilities.getUuid().slice(0, 8), dateKey, id, dare.from, parseDare_(dare.text).game + ':' + score + '/' + target, 'dareres', dareId, new Date(), '', '']]);
  } finally { lock.releaseLock(); }
  return { won: won, score: score, target: target };
}

// ---------------- Fast JSON API ----------------
// The game page can live on a fast static host (GitHub Pages) and talk to this script over HTTPS.
// The page sends {fn, args} as plain text (no CORS preflight); only the functions listed here can be called.
const API_FNS = {
  register: register, submit: submit, getBoard: getBoard, whoami: whoami, saveProgress: saveProgress, loadProgress: loadProgress,
  getShadeState: getShadeState, saveSettings: saveSettings, sendShade: sendShade, respondShade: respondShade, addJoke: addJoke,
  deleteJoke: deleteJoke, listPlayers: listPlayers, claimPlayer: claimPlayer, react: react, getStats: getStats,
  getPlayerCard: getPlayerCard, markSeen: markSeen, sendFeedback: sendFeedback, submitArcade: submitArcade, getArcade: getArcade, sendDare: sendDare, answerDare: answerDare,
  bootData: bootData, getAllTime: getAllTime, getCrews: getCrews, createCrew: createCrew, joinCrew: joinCrew, leaveCrew: leaveCrew, renameCrew: renameCrew, removeFromCrew: removeFromCrew, newCrewCode: newCrewCode, requestJoin: requestJoin, answerJoin: answerJoin, addToCrew: addToCrew, getWeekReview: getWeekReview
};
function doPost(e) {
  let out;
  try {
    const req = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    const fn = API_FNS[req.fn];
    if (!fn) throw new Error('Unknown call.');
    setScope_(req.crew, req.me);
    out = { ok: true, result: fn.apply(null, Array.isArray(req.args) ? req.args : []) };
  } catch (err) {
    out = { ok: false, error: String((err && err.message) || err) };
  }
  return ContentService.createTextOutput(JSON.stringify(out === undefined ? null : out)).setMimeType(ContentService.MimeType.JSON);
}
// Everything the app needs when it opens, in one round trip instead of five.
function bootData(id, dateKey) {
  const safe = f => { try { return f(); } catch (e) { return null; } };
  return {
    progress: safe(() => loadProgress(id, dateKey)),
    board: safe(() => getBoard(dateKey, id)),
    shade: safe(() => getShadeState(id, dateKey)),
    stats: safe(() => getStats(id, dateKey)),
    crews: safe(() => getCrews(id)), crew: CREW_
  };
}


// ================= SELF-UPDATE (no more copy/paste) =================
// Every 15 minutes the server checks GitHub for a newer copy of this file. If there is one, it writes the new code
// into this Apps Script project, saves a new version and points the existing web-app deployment at it, so the
// app URL never changes. One-time setup (at a computer): see setupAutoUpdate() below.
const SELF_SRC = 'https://raw.githubusercontent.com/samahlersmeyer-prog/bigdawg/main/server/Code.gs';
const SELF_DEPLOYMENT = 'AKfycbxPfcr0_vWObUwDG5-ZjuVAmiCNNFqTXo38-YpkEPfOcsEq6iehAkjhtPNVf0Az_rh_'; // the id inside the /exec URL

// Run this once from the Apps Script editor (pick it in the function menu, press Run, approve the permissions).
function setupAutoUpdate() {
  ScriptApp.getProjectTriggers().filter(t => t.getHandlerFunction() === 'autoUpdate').forEach(t => ScriptApp.deleteTrigger(t));
  ScriptApp.newTrigger('autoUpdate').timeBased().everyMinutes(15).create();
  return autoUpdate(true);
}
function autoUpdate(force) {
  const props = PropertiesService.getScriptProperties(), log = m => { props.setProperty('selfUpdate', new Date().toISOString() + ' ' + m); return m; };
  try {
    const res = UrlFetchApp.fetch(SELF_SRC + '?t=' + Date.now(), { muteHttpExceptions: true });
    if (res.getResponseCode() !== 200) return log('fetch failed ' + res.getResponseCode());
    const src = res.getContentText();
    if (src.indexOf('function doPost') < 0 || src.indexOf('SELF_DEPLOYMENT') < 0) return log('skipped: file looks wrong');
    const hash = Utilities.base64Encode(Utilities.computeDigest(Utilities.DigestAlgorithm.MD5, src));
    if (force !== true && props.getProperty('codeHash') === hash) return log('up to date');
    const id = ScriptApp.getScriptId(), H = { Authorization: 'Bearer ' + ScriptApp.getOAuthToken() }, api = 'https://script.googleapis.com/v1/projects/' + id;
    const call = (path, method, body) => {
      const r = UrlFetchApp.fetch(api + path, { method: method || 'get', contentType: 'application/json', headers: H, payload: body ? JSON.stringify(body) : undefined, muteHttpExceptions: true });
      if (r.getResponseCode() >= 300) throw new Error(path + ' ' + r.getResponseCode() + ' ' + r.getContentText().slice(0, 200));
      return JSON.parse(r.getContentText() || '{}');
    };
    const cur = call('/content');
    let done = false;
    const files = cur.files.map(f => { if (!done && f.type === 'SERVER_JS' && f.source.indexOf('function doPost') >= 0) { done = true; return { name: f.name, type: f.type, source: src }; } return { name: f.name, type: f.type, source: f.source }; });
    if (!done) return log('skipped: could not find the server file');
    call('/content', 'put', { files: files });
    const ver = call('/versions', 'post', { description: 'auto-update ' + new Date().toISOString() });
    call('/deployments/' + SELF_DEPLOYMENT, 'put', { deploymentConfig: { scriptId: id, versionNumber: ver.versionNumber, manifestFileName: 'appsscript', description: 'auto-update v' + ver.versionNumber } });
    props.setProperty('codeHash', hash);
    return log('updated to version ' + ver.versionNumber);
  } catch (e) { return log('error: ' + e.message); }
}
