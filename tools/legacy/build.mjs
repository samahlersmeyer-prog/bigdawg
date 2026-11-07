// Builds legacy/ — a copy of the app for old iPads (iOS 9, Safari 9).
// Run by tools/stamp.py; never edit legacy/ by hand.
//   - js/*.js      -> legacy/js/*.js   (Babel down to ES5)
//   - games/*.js   -> legacy/games/*.js (same; the arcade loads them from there)
//   - polyfills    -> legacy/poly.js   (core-js for what the code uses, fetch, then shim.js)
//   - styles.css   -> legacy/styles.css (grid/gap/clamp/inset rewritten to old flexbox CSS, then legacy.css)
//   - index.html   -> legacy/index.html (same markup, base href="../", no service worker)
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";
import babel from "@babel/core";
import postcss from "postcss";
import * as acorn from "acorn";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "../..");
const OUT = path.join(ROOT, "legacy");
const TARGET = { ios: "9" };
const FILES = ["data", "core", "daily", "social", "arcade", "boot"];
const h = s => crypto.createHash("sha1").update(s).digest("hex").slice(0, 10);
const read = p => fs.readFileSync(path.join(ROOT, p), "utf8");
const write = (p, s) => { const f = path.join(OUT, p); fs.mkdirSync(path.dirname(f), { recursive: true }); if (!fs.existsSync(f) || fs.readFileSync(f, "utf8") !== s) fs.writeFileSync(f, s); };

// ---------- JS ----------
const usedPolys = new Set();
const out = {};
const GAME_FILES = fs.readdirSync(path.join(ROOT, "games")).filter(n => /^g_\w+\.js$/.test(n)).sort();
const jobs = FILES.map(f => ({ src: `js/${f}.js`, dst: `js/${f}.js`, key: f, compact: f === "data" }))
  .concat(GAME_FILES.map(n => ({ src: `games/${n}`, dst: `games/${n}`, key: "games/" + n, compact: false })));
for (const { src: srcPath, dst, key: f, compact } of jobs) {
  let src = read(srcPath);
  // the arcade loads games/<file>; on the old iPad it must load the transpiled copies instead
  if (f === "arcade") { if (!src.includes('sc.src = "games/"')) throw new Error("legacy: game loader path not found in js/arcade.js"); src = src.replace('sc.src = "games/"', 'sc.src = "legacy/games/"');
    // at a slow frame rate keep game speed right (skip ahead up to 1/20 s per frame) instead of slow motion
    if (!src.includes("Math.min(0.033, Math.max(0, (now - G.last) / 1000))")) throw new Error("legacy: game loop dt cap not found in js/arcade.js");
    src = src.replace("Math.min(0.033, Math.max(0, (now - G.last) / 1000))", "Math.min(0.05, Math.max(0, (now - G.last) / 1000))"); }
  // pass 1: find which core-js polyfills the code needs
  const scan = babel.transformSync(src, { babelrc: false, configFile: false, sourceType: "script", compact: true,
    presets: [["@babel/preset-env", { targets: TARGET, modules: false, useBuiltIns: "usage", corejs: "3.40" }]] }).code;
  for (const m of scan.matchAll(/core-js\/modules\/([\w.-]+?)(?:\.js)?["']/g)) usedPolys.add(m[1]);
  // pass 2: the real transpile
  const code = babel.transformSync(src, { babelrc: false, configFile: false, sourceType: "script", compact, comments: false,
    presets: [["@babel/preset-env", { targets: TARGET, modules: false, forceAllTransforms: true }]] }).code;
  acorn.parse(code, { ecmaVersion: 5, sourceType: "script" }); // throws if anything newer than ES5 slipped through
  out[f] = code;
  write(dst, code);
}
// drop transpiled copies of games that no longer exist
const LG = path.join(OUT, "games");
if (fs.existsSync(LG)) for (const n of fs.readdirSync(LG)) if (!GAME_FILES.includes(n)) fs.unlinkSync(path.join(LG, n));
const gamesV = h(GAME_FILES.map(n => out["games/" + n]).join("\n"));

// ---------- polyfills ----------
// Things the code uses that Babel can't see (DOM collections, URL helpers).
["web.dom-collections.for-each", "web.dom-collections.iterator", "web.url", "web.url-search-params", "es.promise", "es.promise.finally",
 "es.symbol", "es.symbol.iterator", "es.array.iterator", "es.object.from-entries", "es.object.values", "es.string.pad-start", "es.array.flat-map",
].forEach(m => usedPolys.add(m));
// Babel guesses broadly (any .map could be an iterator helper); drop families the app doesn't use.
const polyList = [...usedPolys].filter(m => !/^(esnext\.|es\.(array-buffer|typed-array|iterator|set\.|error\.cause|symbol\.description))/.test(m)).sort();
const polyKey = h(polyList.join(","));
const cache = path.join(HERE, ".corejs-" + polyKey + ".js");
let corejs;
if (fs.existsSync(cache)) corejs = fs.readFileSync(cache, "utf8");
else {
  const builder = (await import("core-js-builder")).default;
  corejs = await builder({ modules: polyList, targets: "iOS >= 9", format: "bundle", minify: true, summary: { console: { size: false, modules: false } } });
  for (const old of fs.readdirSync(HERE).filter(n => n.startsWith(".corejs-"))) fs.unlinkSync(path.join(HERE, old));
  fs.writeFileSync(cache, corejs);
}
const fetchPoly = fs.readFileSync(path.join(HERE, "node_modules/whatwg-fetch/dist/fetch.umd.js"), "utf8");
const shim = fs.readFileSync(path.join(HERE, "shim.js"), "utf8");
acorn.parse(shim, { ecmaVersion: 5, sourceType: "script" });
const poly = corejs + "\n;" + fetchPoly + "\n;" + shim;
write("poly.js", poly);

// ---------- CSS ----------
// Classes that are put on <button>. Old Safari can't make a button a flex/grid container, so those
// get block/inline-block layouts instead.
const BTN = new Set(["pill", "icon", "solid", "textbtn", "gcard", "tap", "pname", "chip", "hub-btn", "spiceopt", "shadebtn", "nm", "more",
  "key", "gtile", "ct", "close", "cell", "bell", "add", "arc-board", "on"]);
// Laid out by shim.js (sizes depend on the screen), so only the basics are converted here.
const JS_LAID = new Set([".ggrid"]);
const lastCompound = s => s.trim().split(/\s*[\s>+~]\s*/).pop();
const isBtn = s => { const l = lastCompound(s); return /(^|[^\w-])button\b/.test(l) || [...l.matchAll(/\.([\w-]+)/g)].some(m => BTN.has(m[1])); };
const tracks = v => v == null ? null : v.replace(/!important/, "").replace(/minmax\(\s*0\s*,\s*1fr\s*\)/g, "1fr")
  .replace(/repeat\(\s*(\d+)\s*,\s*([^)]+)\)/g, (m, n, t) => Array(+n).fill(t.trim()).join(" ")).trim().split(/\s+/);
const flexAlign = v => ({ start: "flex-start", end: "flex-end", "flex-start": "flex-start", "flex-end": "flex-end", center: "center", stretch: "stretch", baseline: "baseline" })[v] || null;
const sel = (rule, suffix) => rule.selector.split(",").map(s => s.trim() + " > " + suffix).join(", ");
const unimp = v => (v || "").replace(/\s*!important/, "").trim();

function rewriteValue(prop, v) {
  // clamp(a, b, c) on sizes -> b with min-/max- limits; elsewhere -> the upper bound (iPads are big screens)
  v = v.replace(/clamp\(([^,]+),([^,]+),([^)]+)\)/g, (m, a, b, c) => /cq[wh]/.test(b) ? `clamp(${a},${b},${c})` : c.trim());
  // min(...)/max(...) -> the plain length; container-relative ones are resized by shim.js
  v = v.replace(/\b(min|max)\(([^()]*(?:\([^()]*\)[^()]*)*)\)/g, (m, fn, args) => {
    const a = args.split(",").map(s => s.trim()); const plain = a.filter(x => !/cq[wh]|v[hw]/.test(x));
    return plain.length ? plain[plain.length - 1] : a[0];
  });
  v = v.replace(/clamp\(([^,]+),([^,]+),([^)]+)\)/g, (m, a, b, c) => b.trim());
  // container units -> CSS variables that shim.js keeps up to date
  v = v.replace(/(-?[\d.]+)cq([wh])/g, (m, n, u) => `calc(${n} * var(--cq${u}, 4px))`);
  return v;
}

function convertCss(css) {
  const root = postcss.parse(css);
  root.walkRules(rule => {
    if (rule.parent && rule.parent.type === "atrule" && /keyframes/.test(rule.parent.name)) return;
    // drop selectors old Safari doesn't understand (they'd void the whole rule)
    if (/:focus-visible|:is\(|:where\(|:has\(/.test(rule.selector)) {
      const keep = rule.selectors.filter(s => !/:focus-visible|:is\(|:where\(|:has\(/.test(s));
      if (!keep.length) { rule.remove(); return; } rule.selectors = keep;
    }
    const d = {}; rule.walkDecls(x => { d[x.prop] = x.value; });
    const after = [];
    const add = (selector, props) => after.push(postcss.rule({ selector, nodes: Object.entries(props).map(([prop, value]) => postcss.decl({ prop, value })) }));
    const set = (prop, value) => { let found = false; rule.walkDecls(prop, x => { if (!found) { x.value = value; found = true; } else x.remove(); }); if (!found) rule.append({ prop, value }); };
    const del = prop => rule.walkDecls(prop, x => x.remove());

    // simple value rewrites
    rule.walkDecls(x => {
      if (x.prop === "inset") {
        const p = x.value.replace(/!important/, "").trim().split(/\s+/); const [t, r = t, b = t, l = r] = p;
        x.cloneBefore({ prop: "top", value: t }); x.cloneBefore({ prop: "right", value: r }); x.cloneBefore({ prop: "bottom", value: b }); x.cloneBefore({ prop: "left", value: l }); x.remove(); return;
      }
      if (x.prop === "aspect-ratio" || x.prop === "container-type" || x.prop === "container-name") { x.remove(); return; }
      if (/clamp\(|\bmin\(|\bmax\(/.test(x.value) && /^(width|height)$/.test(x.prop)) {
        const m = x.value.match(/^clamp\(([^,]+),([^,]+),([^)]+)\)$/);
        if (m && !/cq[wh]/.test(m[2])) { x.cloneBefore({ prop: "min-" + x.prop, value: m[1].trim() }); x.cloneBefore({ prop: "max-" + x.prop, value: m[3].trim() }); x.value = m[2].trim(); return; }
      }
      if (/clamp\(|\bmin\(|\bmax\(|cq[wh]/.test(x.value)) x.value = rewriteValue(x.prop, x.value);
      if (x.prop === "position" && /sticky/.test(x.value)) x.cloneBefore({ value: "-webkit-sticky" });
      if (/^(filter|mask|backdrop-filter|mask-image|appearance)$/.test(x.prop)) x.cloneBefore({ prop: "-webkit-" + x.prop });
      if (x.prop === "overflow-wrap" && /anywhere/.test(x.value)) { x.cloneBefore({ prop: "word-break", value: "break-word" }); x.value = "break-word"; }
    });

    const disp = unimp(d.display);
    const isGrid = /grid/.test(disp) || d["grid-template-columns"] != null || d["grid-template-rows"] != null;
    const isFlex = /flex/.test(disp);
    const gapv = unimp(d.gap || d["grid-gap"]).split(/\s+/).filter(Boolean);
    const rg = gapv[0] || null, cg = gapv[1] || gapv[0] || null;
    const button = rule.selectors.every(isBtn);
    const pi = unimp(d["place-items"]).split(/\s+/).filter(Boolean);
    const ai = unimp(d["align-items"]) || pi[0], ji = unimp(d["justify-items"]) || pi[1] || pi[0];

    if (d["grid-column"] && /1\s*\/\s*-1|span\s+\d{2}|1\s*\/\s*span\s*\d+/.test(d["grid-column"])) {
      del("grid-column"); set("width", "100%"); set("flex", "0 0 100%"); set("margin-left", "0");
    }
    del("grid-row"); del("grid-area");

    if (isGrid && JS_LAID.has(rule.selector.trim())) {
      set("display", "flex"); set("flex-wrap", "wrap"); set("align-content", "flex-start");
      ["grid-template-columns", "grid-template-rows", "gap", "grid-gap", "place-items", "grid-auto-flow"].forEach(del);
    } else if (isGrid && button) {
      if (disp) set("display", /inline/.test(disp) ? "inline-block" : "block");
      ["grid-template-columns", "grid-template-rows", "gap", "grid-gap", "place-items", "justify-items", "grid-auto-flow"].forEach(del);
    } else if (isGrid) {
      const cols = tracks(d["grid-template-columns"]), rows = tracks(d["grid-template-rows"]);
      if (disp) set("display", /inline/.test(disp) ? "inline-flex" : "flex");
      ["grid-template-columns", "grid-template-rows", "gap", "grid-gap", "place-items", "justify-items", "grid-auto-flow"].forEach(del);
      if (cols && cols.length > 1) {
        const N = cols.length, allFr = cols.every(t => t === "1fr");
        set("-webkit-flex-direction", "row"); set("flex-direction", "row"); set("flex-wrap", "wrap");
        if (ai) set("align-items", flexAlign(ai) || "stretch");
        if (rows && rows.length > 1 && rows.every(t => t === "1fr")) {
          const R = rows.length; set("align-content", "stretch");
          add(sel(rule, "*"), { height: rg ? `calc((100% - ${R - 1} * ${rg}) / ${R})` : `calc(100% / ${R})` });
        }
        cols.forEach((t, i) => {
          const props = {};
          if (allFr) { props.flex = "0 0 auto"; props.width = cg ? `calc((100% - ${N - 1} * ${cg}) / ${N})` : `calc(100% / ${N})`; }
          else if (/fr$/.test(t)) { props.flex = `${parseFloat(t)} 1 0px`; props["min-width"] = "0"; }
          else if (t === "auto" || /content/.test(t)) props.flex = "0 0 auto";
          else { props.flex = `0 0 ${t}`; props.width = t; }
          if (cg) props["margin-left"] = i ? cg : "0";
          add(sel(rule, `:nth-child(${N}n+${i + 1})`), props);
        });
        if (rg) add(sel(rule, `:nth-child(n+${N + 1})`), { "margin-top": rg });
        if (cols.every(t => /^[\d.]+px$/.test(t)) && !d.width) { set("width", `${cols.reduce((s, t) => s + parseFloat(t), 0) + (N - 1) * (parseFloat(cg) || 0)}px`); set("box-sizing", "content-box"); }
      } else if (rows && rows.length > 1 && rows.every(t => t === "1fr")) {
        set("-webkit-flex-direction", "column"); set("flex-direction", "column");
        add(sel(rule, "*"), { flex: "1 1 0px", "min-height": "0" });
        if (rg) add(sel(rule, "* + *"), { "margin-top": rg });
      } else if (disp) {
        set("-webkit-flex-direction", "column"); set("flex-direction", "column");
        set("align-items", flexAlign(ji) || "stretch");
        if (ai && flexAlign(ai) && flexAlign(ai) !== "stretch") set("justify-content", flexAlign(ai));
        if (rg) add(sel(rule, ":not([hidden]) ~ :not([hidden])"), { "margin-top": rg });
      }
    } else if (isFlex && button) {
      const col = /column/.test(d["flex-direction"] || "");
      set("display", /inline/.test(disp) ? "inline-block" : "block");
      ["gap", "flex-direction", "flex-wrap"].forEach(del);
      add(sel(rule, "*"), col ? { display: "block" } : { display: "inline-block", "vertical-align": "middle" });
      if (rg) add(sel(rule, ":not([hidden]) ~ :not([hidden])"), col ? { "margin-top": rg } : { "margin-left": cg });
    } else if (gapv.length) {
      del("gap"); del("grid-gap");
      const dir = d["flex-direction"] || "row", wrap = /wrap/.test(d["flex-wrap"] || "");
      if (!isFlex && d["grid-template-columns"] == null && !disp) {
        // gap override on a rule without display (e.g. ".sheet .preview .sq { gap }") — nothing safe to do
      } else if (wrap) add(sel(rule, ":not([hidden])"), { "margin-right": cg, "margin-bottom": rg });
      else if (/column/.test(dir)) add(sel(rule, ":not([hidden]) ~ :not([hidden])"), { [/reverse/.test(dir) ? "margin-bottom" : "margin-top"]: rg });
      else add(sel(rule, ":not([hidden]) ~ :not([hidden])"), { [/reverse/.test(dir) ? "margin-right" : "margin-left"]: cg });
    }
    // Safari 9 lets items in a scrolling column shrink below their content (no min-height:auto), so they overlap.
    if (/auto|scroll/.test(d["overflow-y"] || d.overflow || "") && (/column/.test(d["flex-direction"] || "") || (isGrid && disp && !button)))
      after.push(postcss.rule({ selector: sel(rule, "*"), nodes: [postcss.decl({ prop: "-webkit-flex-shrink", value: "0" }), postcss.decl({ prop: "flex-shrink", value: "0" })] }));
    if ((isFlex && !button) || (isGrid && !button && disp)) { // old WebKit wants the prefixed name alongside
      const ds = []; rule.each(x => { if (x.type === "decl" && x.prop === "display" && /flex/.test(x.value) && !/webkit/.test(x.value)) ds.push(x); });
      ds.forEach(x => x.cloneBefore({ value: "-webkit-" + x.value.replace(/\s*!important/, "") }));
    }
    for (let i = after.length - 1; i >= 0; i--) rule.after(after[i]);
  });
  return root.toString();
}
const legacyCss = fs.readFileSync(path.join(HERE, "legacy.css"), "utf8");
const css = convertCss(read("styles.css")) + "\n\n/* ---- legacy.css (hand-tuned for old iPads) ---- */\n" + legacyCss;
write("styles.css", css);

// ---------- HTML ----------
let html = read("index.html");
html = html.replace('<html lang="en">', '<html lang="en" class="legacy">');
html = html.replace(/<base target="_top">/, '<base href="../" target="_top">');
html = html.replace(/href="styles\.css\?v=\w*"/, `href="legacy/styles.css?v=${h(css)}"`);
html = html.replace(/<script src="js\/(\w+)\.js\?v=\w*"><\/script>/g, (m, f) => `<script src="legacy/js/${f}.js?v=${h(out[f])}"></script>`);
html = html.replace(/(<script src="legacy\/js\/data\.js)/, `<script src="legacy/poly.js?v=${h(poly)}"></script>\n$1`);
html = html.replace(/window\.GAMES_V="\w*"/, `window.GAMES_V="${gamesV}"`);
html = html.replace(/<script>\s*\/\/ Keep the installed app up to date[\s\S]*?<\/script>\s*/, "");
html = html.replace(/<link rel="manifest"[^>]*>\s*/, "");
// iOS 9 zooms on double-tap (e.g. quick taps in Strands); old Safari still honors user-scalable=no.
html = html.replace(/<meta name="viewport" content="[^"]*">/, '<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">');
html = html.replace("<head>", "<head>\n<!-- Built by tools/legacy/build.mjs from index.html. Don't edit; run python3 tools/stamp.py. -->");
if (/serviceWorker/.test(html)) throw new Error("legacy: service worker script still in page");

// Offline: iOS 9 has no service worker, but it does have the old Application Cache. List every file the page
// needs (with the same ?v= it asks for) so a bookmark or home-screen icon opens with no internet.
// Paths are relative to legacy/manifest.appcache. Server calls (scoreboard) stay online-only (NETWORK: *).
const cacheList = [
  `styles.css?v=${h(css)}`, `poly.js?v=${h(poly)}`,
  ...FILES.map(f => `js/${f}.js?v=${h(out[f])}`),
  ...GAME_FILES.map(n => `games/${n}?v=${gamesV}`),
  "../strands_x.json", "../apple-touch-icon.png", "../icon-192.png",
];
for (const u of cacheList) { const f = path.join(OUT, u.split("?")[0]); if (!fs.existsSync(f)) throw new Error("legacy: offline file missing: " + u); }
const manifest = "CACHE MANIFEST\n# " + h(html + cacheList.join("\n") + read("strands_x.json")) + "\n\nCACHE:\n" + cacheList.join("\n") + "\n\nNETWORK:\n*\n";
write("manifest.appcache", manifest);
// absolute path: the page's <base href="../"> isn't read yet when <html manifest> is
html = html.replace('<html lang="en" class="legacy">', '<html lang="en" class="legacy" manifest="/bigdawg/legacy/manifest.appcache">');
// when a newer version has downloaded, switch to it (right away if just opened, else next time the iPad wakes it)
html = html.replace("</body>", `<script>
(function () { var ac = window.applicationCache, t0 = Date.now(); if (!ac) return;
  function swap() { try { ac.swapCache(); } catch (e) {} location.reload(); }
  ac.addEventListener("updateready", function () {
    if (Date.now() - t0 < 15000) return swap();
    document.addEventListener("visibilitychange", function () { if (!document.hidden) swap(); });
  });
})();
</script>
</body>`);
write("index.html", html);
console.log(`legacy: built for iOS 9 (${GAME_FILES.length} games, ${polyList.length} polyfills, ${Math.round(poly.length / 1024)}KB poly, ${Math.round(css.length / 1024)}KB css)`);
