// ===================== BIG DAWG DAILY: SERVER LOADER =====================
// Paste this ONE time. It runs the latest server code straight from GitHub, so future updates need no pasting
// and no deploying: when Claude pushes a new server/Code.gs, it's live here within about 10 minutes.
// If GitHub is ever unreachable, it keeps running the last copy it saved.
const BD_SRC = 'https://raw.githubusercontent.com/samahlersmeyer-prog/bigdawg/main/server/Code.gs';
let BD_MOD = null;
function BD_() {
  if (BD_MOD) return BD_MOD;
  const cache = CacheService.getScriptCache(), props = PropertiesService.getScriptProperties();
  let src = cache.get('bd_src');
  if (!src) {
    try {
      const r = UrlFetchApp.fetch(BD_SRC + '?t=' + Date.now(), { muteHttpExceptions: true });
      const t = r.getResponseCode() === 200 ? r.getContentText() : '';
      if (t.indexOf('function doPost') >= 0 && t.indexOf('API_FNS') >= 0) {
        src = t; cache.put('bd_src', src, 600);
        // keep a backup copy in Script Properties (split into 8KB pieces) in case GitHub is down later
        const old = +(props.getProperty('bd_n') || 0), n = Math.ceil(src.length / 8000), kv = { bd_n: String(n) };
        for (let i = 0; i < n; i++) kv['bd_' + i] = src.slice(i * 8000, (i + 1) * 8000);
        props.setProperties(kv); for (let i = n; i < old; i++) props.deleteProperty('bd_' + i);
        props.setProperty('bd_loaded', new Date().toISOString() + ' from GitHub (' + src.length + ' chars)');
      }
    } catch (e) { props.setProperty('bd_loaded', new Date().toISOString() + ' GitHub error: ' + e.message); }
  }
  if (!src) { const n = +(props.getProperty('bd_n') || 0); src = ''; for (let i = 0; i < n; i++) src += props.getProperty('bd_' + i) || ''; }
  if (!src) throw new Error('Server code not loaded yet. Check that GitHub is reachable.');
  BD_MOD = new Function(src + '\n;return { doGet: doGet, doPost: doPost, API_FNS: API_FNS };')();
  return BD_MOD;
}
function doGet(e) { return BD_().doGet(e); }
function doPost(e) { return BD_().doPost(e); }
// Run this once from the editor to check it works (it shows what it loaded under Project Settings > Script Properties > bd_loaded).
function testLoader() { CacheService.getScriptCache().remove('bd_src'); BD_MOD = null; BD_(); return PropertiesService.getScriptProperties().getProperty('bd_loaded'); }
// The old 15-minute self-update timer isn't needed anymore; this makes it a harmless no-op.
function autoUpdate() { return 'loader in use'; }
// Entry points for the older Apps Script link (google.script.run):
function register() { return BD_().API_FNS.register.apply(null, arguments); }
function submit() { return BD_().API_FNS.submit.apply(null, arguments); }
function getBoard() { return BD_().API_FNS.getBoard.apply(null, arguments); }
function whoami() { return BD_().API_FNS.whoami.apply(null, arguments); }
function saveProgress() { return BD_().API_FNS.saveProgress.apply(null, arguments); }
function loadProgress() { return BD_().API_FNS.loadProgress.apply(null, arguments); }
function getShadeState() { return BD_().API_FNS.getShadeState.apply(null, arguments); }
function saveSettings() { return BD_().API_FNS.saveSettings.apply(null, arguments); }
function sendShade() { return BD_().API_FNS.sendShade.apply(null, arguments); }
function respondShade() { return BD_().API_FNS.respondShade.apply(null, arguments); }
function addJoke() { return BD_().API_FNS.addJoke.apply(null, arguments); }
function deleteJoke() { return BD_().API_FNS.deleteJoke.apply(null, arguments); }
function listPlayers() { return BD_().API_FNS.listPlayers.apply(null, arguments); }
function claimPlayer() { return BD_().API_FNS.claimPlayer.apply(null, arguments); }
function react() { return BD_().API_FNS.react.apply(null, arguments); }
function getStats() { return BD_().API_FNS.getStats.apply(null, arguments); }
function getPlayerCard() { return BD_().API_FNS.getPlayerCard.apply(null, arguments); }
function markSeen() { return BD_().API_FNS.markSeen.apply(null, arguments); }
function sendFeedback() { return BD_().API_FNS.sendFeedback.apply(null, arguments); }
function submitArcade() { return BD_().API_FNS.submitArcade.apply(null, arguments); }
function getArcade() { return BD_().API_FNS.getArcade.apply(null, arguments); }
function sendDare() { return BD_().API_FNS.sendDare.apply(null, arguments); }
function answerDare() { return BD_().API_FNS.answerDare.apply(null, arguments); }
function bootData() { return BD_().API_FNS.bootData.apply(null, arguments); }
function getAllTime() { return BD_().API_FNS.getAllTime.apply(null, arguments); }
