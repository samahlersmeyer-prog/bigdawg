// Builds offline.html: the whole app in one file you can open on a computer with no internet
// (double-click it on a Mac or Windows PC). Every game, puzzle, font and icon is inside the file, and the
// Apps Script server (server/Code.gs) runs inside the page against a pretend Google Sheet kept in this
// browser's storage, so names, scores and progress stay on that computer only.
// Run from the repo root or anywhere: node tools/offline/build.mjs  (stamp.py runs it for you).
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "..", "..");
const rd = p => fs.readFileSync(path.join(ROOT, p), "utf8");
const b64 = p => fs.readFileSync(p).toString("base64");
const must = (src, find, repl, what) => { if (!src.includes(find)) throw new Error("offline build: can't find " + what); return src.split(find).join(repl); };
const safeJs = s => s.replace(/<\/script/gi, "<\\/script").replace(/<!--/g, "<\\!--");

// ---- fonts (same families the live page gets from Google Fonts) ----
const FONTS = [["Libre Franklin", "libre-franklin", [400, 500, 600, 700, 800]], ["Zilla Slab", "zilla-slab", [400, 500, 600, 700]], ["Press Start 2P", "press-start-2p", [400]]];
const fontCss = FONTS.flatMap(([fam, file, ws]) => ws.map(w =>
  `@font-face{font-family:'${fam}';font-style:normal;font-weight:${w};font-display:swap;src:url(data:font/woff2;base64,${b64(path.join(HERE, "fonts", `${file}-latin-${w}-normal.woff2`))}) format('woff2')}`)).join("\n");

// ---- the server, running in the page ----
const SHIM = `/* Big Dawg Daily OFFLINE: the scoreboard server runs inside this page and saves to this computer only. */
(function () {
  var KEY = "bdd-offline:sheets";
  // Dates are kept as "\\u0001<ms>" so they come back as real Dates, like a Google Sheet would give them.
  var enc = function (v) { return v instanceof Date ? "\\u0001" + v.getTime() : v; };
  var dec = function (v) { return typeof v === "string" && v.charAt(0) === "\\u0001" ? new Date(Number(v.slice(1))) : v; };
  function mkSheet(name, rows) {
    return { name: name, rows: rows,
      setName: function (n) { this.name = n; }, setFrozenRows: function () {}, getName: function () { return this.name; },
      getLastRow: function () { return this.rows.length; },
      getLastColumn: function () { return this.rows.reduce(function (m, r) { return Math.max(m, r.length); }, 0); },
      appendRow: function (r) { this.rows.push(r.slice()); }, deleteRow: function (i) { this.rows.splice(i - 1, 1); },
      deleteRows: function (i, n) { this.rows.splice(i - 1, n); }, insertRowAfter: function () {}, clear: function () { this.rows.length = 0; },
      getDataRange: function () { return this.getRange(1, 1, Math.max(1, this.getLastRow()), Math.max(1, this.getLastColumn())); },
      getRange: function (a, b, c, d) {
        var sh = this;
        if (typeof a === "string") {
          var m = /^([A-Z]+)(\\d+)$/.exec(a);
          if (!m) return { setNumberFormat: function () { return this; } };
          a = Number(m[2]); b = m[1].split("").reduce(function (n, ch) { return n * 26 + ch.charCodeAt(0) - 64; }, 0);
        }
        var r0 = a - 1, c0 = b - 1, nr = c || 1, nc = d || 1;
        var cell = function (i, j) { var row = sh.rows[r0 + i] || []; var v = row[c0 + j]; return v === undefined || v === null ? "" : v; };
        var put = function (i, j, v) { while (sh.rows.length <= r0 + i) sh.rows.push([]); var row = sh.rows[r0 + i]; while (row.length < c0 + j) row.push(""); row[c0 + j] = v; };
        return {
          setNumberFormat: function () { return this; }, setNumberFormats: function () { return this; },
          getValue: function () { return cell(0, 0); }, setValue: function (v) { put(0, 0, v); return this; },
          getValues: function () { var o = []; for (var i = 0; i < nr; i++) { var row = []; for (var j = 0; j < nc; j++) row.push(cell(i, j)); o.push(row); } return o; },
          getDisplayValues: function () { return this.getValues().map(function (r) { return r.map(String); }); },
          setValues: function (v) { for (var i = 0; i < v.length; i++) for (var j = 0; j < v[i].length; j++) put(i, j, v[i][j]); return this; },
          clearContent: function () { for (var i = 0; i < nr; i++) for (var j = 0; j < nc; j++) if (sh.rows[r0 + i]) sh.rows[r0 + i][c0 + j] = ""; return this; }
        };
      } };
  }
  var sheets = [];
  function load() {
    var raw = null; try { raw = localStorage.getItem(KEY); } catch (e) {}
    var data = raw ? JSON.parse(raw) : [];
    sheets.length = 0;
    data.forEach(function (s) { sheets.push(mkSheet(s[0], s[1].map(function (r) { return r.map(dec); }))); });
    if (!sheets.length) sheets.push(mkSheet("Sheet1", []));
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(sheets.map(function (s) { return [s.name, s.rows.map(function (r) { return r.map(enc); })]; }))); } catch (e) {} }
  var ss = { getSheetByName: function (n) { return sheets.find(function (s) { return s.name === n; }) || null; },
    insertSheet: function (n) { var s = mkSheet(n, []); sheets.push(s); return s; }, getSheets: function () { return sheets; },
    getSpreadsheetTimeZone: function () { try { return Intl.DateTimeFormat().resolvedOptions().timeZone || "America/Indianapolis"; } catch (e) { return "America/Indianapolis"; } } };
  var pad = function (n) { return String(n).padStart(2, "0"); };
  var SpreadsheetApp = { openById: function () { return ss; }, getActiveSpreadsheet: function () { return ss; }, flush: function () {} };
  var LockService = { getScriptLock: function () { return { waitLock: function () {}, tryLock: function () { return true; }, releaseLock: function () {} }; } };
  var Utilities = {
    formatDate: function (d, tz, f) { d = new Date(d); var u = tz === "UTC" || tz === "GMT";
      var Y = u ? d.getUTCFullYear() : d.getFullYear(), M = (u ? d.getUTCMonth() : d.getMonth()) + 1, D = u ? d.getUTCDate() : d.getDate(),
          h = u ? d.getUTCHours() : d.getHours(), mi = u ? d.getUTCMinutes() : d.getMinutes(), s = u ? d.getUTCSeconds() : d.getSeconds();
      return String(f || "yyyy-MM-dd").replace("yyyy", Y).replace("MM", pad(M)).replace("dd", pad(D)).replace("HH", pad(h)).replace("mm", pad(mi)).replace("ss", pad(s)); },
    getUuid: function () { return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) { var r = Math.random() * 16 | 0; return (c === "x" ? r : (r & 3 | 8)).toString(16); }); },
    DigestAlgorithm: { SHA_256: "SHA_256", MD5: "MD5" }, Charset: { UTF_8: "UTF_8" },
    // Not real SHA-256, but stable and well mixed: only used to hash PINs that never leave this computer.
    computeDigest: function (alg, str) { var out = [], h = 0x811c9dc5; str = String(str);
      for (var k = 0; k < 32; k++) { for (var i = 0; i < str.length; i++) h = Math.imul(h ^ str.charCodeAt(i), 16777619); h = Math.imul(h ^ k, 2654435761) ^ (h >>> 15);
        var b = h & 255; out.push(b > 127 ? b - 256 : b); }
      return out; },
    base64Encode: function (a) { return btoa(String.fromCharCode.apply(null, (Array.isArray(a) ? a : []).map(function (b) { return b & 255; }))); },
    base64EncodeWebSafe: function (a) { return Utilities.base64Encode(a).replace(/\\+/g, "-").replace(/\\//g, "_"); },
    sleep: function () {}
  };
  var noCache = { get: function () { return null; }, getAll: function () { return {}; }, put: function () {}, putAll: function () {}, remove: function () {}, removeAll: function () {} };
  var CacheService = { getScriptCache: function () { return noCache; } };
  var props = {}; try { props = JSON.parse(localStorage.getItem("bdd-offline:props") || "{}"); } catch (e) {}
  var PropertiesService = { getScriptProperties: function () { return {
    getProperty: function (k) { return k in props ? props[k] : null; },
    setProperty: function (k, v) { props[k] = String(v); try { localStorage.setItem("bdd-offline:props", JSON.stringify(props)); } catch (e) {} } }; } };
  var off = function () { throw new Error("offline"); };
  var DriveApp = { searchFiles: off, getFileById: off, createFile: off }, UrlFetchApp = { fetch: off }, MailApp = { sendEmail: function () {} };
  var ScriptApp = { getService: function () { return { getUrl: function () { return ""; } }; }, getProjectTriggers: function () { return []; } };
  var ContentService = { createTextOutput: function () { return { setMimeType: function () { return this; } }; }, MimeType: {} };
  var HtmlService = { createHtmlOutput: function () { return {}; } }, MimeType = {}, Logger = { log: function () {} };
  var F = (function () {
/*__CODE_GS__*/
    return { apiCall_: apiCall_ };
  })();
  var queue = Promise.resolve();
  function run(fn, args) {
    return queue = queue.then(function () {
      load();
      var out = F.apiCall_({ fn: fn, args: JSON.parse(JSON.stringify(args)), crew: window.__crew, me: window.__me });
      save();
      if (!out || !out.ok) throw new Error((out && out.error) || "offline");
      return JSON.parse(JSON.stringify(out.result === undefined ? null : out.result));
    });
  }
  var runner = function (ok, fail) { return new Proxy({}, { get: function (_, k) {
    if (k === "withSuccessHandler") return function (h) { return runner(h, fail); };
    if (k === "withFailureHandler") return function (h) { return runner(ok, h); };
    return function () { var a = Array.prototype.slice.call(arguments);
      setTimeout(function () { run(k, a).then(function (r) { ok && ok(r); }, function (e) { fail && fail(e); }); }, 10); };
  } }); };
  window.google = { script: { get run() { return runner(null, null); },
    url: { getLocation: function (cb) { setTimeout(function () { cb({ parameter: {} }); }, 10); } }, history: { replace: function () {} } } };
})();`;

// ---- page ----
let html = rd("index.html");
const code = rd("server/Code.gs");
if (!/function apiCall_\(/.test(code)) throw new Error("offline build: server/Code.gs has no apiCall_");
const shim = SHIM.replace("/*__CODE_GS__*/", () => code); // function form: Code.gs may contain $ patterns

// head: drop web-only links (manifest, preconnects, Google Fonts), inline icons + styles
html = html.replace(/<link rel="(manifest|preconnect)"[^>]*>\n?/g, "");
html = html.replace(/<link rel="stylesheet" href="https:\/\/fonts\.googleapis\.com[^>]*>\n?/g, "");
html = html.replace(/<link rel="apple-touch-icon"[^>]*>/, "");
html = must(html, '<link rel="icon" type="image/png" href="icon-192.png">', `<link rel="icon" type="image/png" href="data:image/png;base64,${b64(path.join(ROOT, "icon-192.png"))}">`, "icon link");
html = html.replace(/<link rel="stylesheet" href="styles\.css\?v=\w+">/, () => `<style>\n${fontCss}\n${rd("styles.css")}\n</style>`);
if (/<link rel="stylesheet"/.test(html)) throw new Error("offline build: a stylesheet link is left over");
html = html.replace(/<title>([^<]*)<\/title>/, (_, t) => `<title>${t} (offline)</title>`);
html = html.replace("<head>", () => `<head>\n<script>\n${safeJs(shim)}\n</script>`);

// app scripts, with the games built in (no lazy loading) and the Strands bonus words inlined
const patch = (file, src) => {
  if (file === "js/data.js") src = must(src, "let STX = null,", `let STX = ${fs.readFileSync(path.join(ROOT, "strands_x.json"), "utf8").trim()},`, "STX in data.js");
  if (file === "js/core.js") src = must(src, 'if (FAST_URL && window.google && google.script && google.script.run) {', "if (false) {", "fast-splash in core.js");
  return src;
};
const games = fs.readdirSync(path.join(ROOT, "games")).filter(f => /^g_.*\.js$/.test(f)).sort();
let n = 0;
html = html.replace(/<script src="(js\/[\w.-]+\.js)\?v=\w+"><\/script>/g, (_, file) => {
  n++;
  let out = `<script>\n${safeJs(patch(file, rd(file)))}\n</script>`;
  if (file === "js/arcade.js") out += "\n" + games.map(g => `<script>\n${safeJs(rd("games/" + g))}\n</script>`).join("\n");
  return out;
});
if (n !== 6) throw new Error("offline build: expected 6 app scripts, found " + n);
// no service worker or update checks: the file is opened from disk
html = html.replace(/<script>\n\/\/ Keep the installed app up to date[\s\S]*?<\/script>\n?/, "");
if (/serviceWorker|src="(js|games)\//.test(html)) throw new Error("offline build: web-only code is left over");

const stamp = new Date().toISOString().slice(0, 10);
html = html.replace("<head>", `<head>\n<!-- Big Dawg Daily offline edition, built ${stamp} by tools/offline/build.mjs. Don't edit by hand. -->`);
fs.writeFileSync(path.join(ROOT, "offline.html"), html);
console.log(`offline: offline.html (${(html.length / 1048576).toFixed(1)} MB, ${games.length} games)`);
