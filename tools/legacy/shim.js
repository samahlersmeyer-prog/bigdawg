// Old-iPad helpers (ES5 only). Loaded after core-js + fetch, before the app scripts.
(function () {
  "use strict";
  var EP = Element.prototype, CP = window.CharacterData && CharacterData.prototype, DP = window.DocumentFragment && DocumentFragment.prototype;

  // ---------- DOM: append / prepend / before / after / replaceWith / remove ----------
  function toNode(args) {
    if (args.length === 1) return typeof args[0] === "string" ? document.createTextNode(args[0]) : args[0];
    var f = document.createDocumentFragment();
    for (var i = 0; i < args.length; i++) f.appendChild(typeof args[i] === "string" ? document.createTextNode(args[i]) : args[i]);
    return f;
  }
  function def(protos, name, fn) { for (var i = 0; i < protos.length; i++) if (protos[i] && !protos[i][name]) Object.defineProperty(protos[i], name, { configurable: true, writable: true, value: fn }); }
  def([EP, DP, Document.prototype], "append", function () { this.appendChild(toNode(arguments)); });
  def([EP, DP, Document.prototype], "prepend", function () { this.insertBefore(toNode(arguments), this.firstChild); });
  def([EP, CP], "before", function () { if (this.parentNode) this.parentNode.insertBefore(toNode(arguments), this); });
  def([EP, CP], "after", function () { if (this.parentNode) this.parentNode.insertBefore(toNode(arguments), this.nextSibling); });
  def([EP, CP], "replaceWith", function () { if (this.parentNode) this.parentNode.replaceChild(toNode(arguments), this); });
  def([EP, CP], "remove", function () { if (this.parentNode) this.parentNode.removeChild(this); });
  def([EP], "replaceChildren", function () { while (this.firstChild) this.removeChild(this.firstChild); if (arguments.length) this.appendChild(toNode(arguments)); });
  def([EP], "toggleAttribute", function (n, force) { var on = force === undefined ? !this.hasAttribute(n) : !!force; if (on) this.setAttribute(n, ""); else this.removeAttribute(n); return on; });
  if (!EP.matches) EP.matches = EP.webkitMatchesSelector;
  def([EP], "closest", function (s) { var e = this; while (e && e.nodeType === 1) { if (e.matches(s)) return e; e = e.parentNode; } return null; });
  def([EP], "setPointerCapture", function () {});
  def([EP], "releasePointerCapture", function () {});
  if (window.Uint32Array && !Uint32Array.prototype.forEach) Uint32Array.prototype.forEach = Array.prototype.forEach;
  if (!Math.hypot) Math.hypot = function () { var s = 0; for (var i = 0; i < arguments.length; i++) s += arguments[i] * arguments[i]; return Math.sqrt(s); };
  if (!window.requestAnimationFrame) window.requestAnimationFrame = window.webkitRequestAnimationFrame || function (f) { return setTimeout(function () { f(Date.now()); }, 16); };

  // ---------- Pointer events -> touch / mouse (iOS 9 has no pointer events) ----------
  if (!window.PointerEvent) {
    var MAP = { pointerdown: ["touchstart", "mousedown"], pointermove: ["touchmove", "mousemove"], pointerup: ["touchend", "mouseup"], pointercancel: ["touchcancel"] };
    var lastTouch = 0;
    var add = EP; while (add && !Object.prototype.hasOwnProperty.call(add, "addEventListener")) add = Object.getPrototypeOf(add);
    if (!add) add = EP;
    var orig = add.addEventListener, origRm = add.removeEventListener;
    add.addEventListener = function (type, fn, opt) {
      if (!MAP[type] || typeof fn !== "function") return orig.call(this, type, fn, opt);
      var target = this, wrap = fn.__lgPtr || (fn.__lgPtr = {});
      MAP[type].forEach(function (t) {
        var w = wrap[t] = function (ev) {
          var touch = t.indexOf("touch") === 0;
          if (touch) lastTouch = Date.now(); else if (Date.now() - lastTouch < 1000) return; // skip the fake mouse events after a tap
          if (!touch && t === "mousemove" && !ev.buttons && !ev.which) return;
          var p = touch ? (ev.changedTouches && ev.changedTouches[0]) || {} : ev;
          if (t === "touchmove" && target.nodeType === 1) ev.preventDefault(); // drag, don't scroll
          fn.call(target, {
            type: type, target: ev.target, currentTarget: target, pointerId: touch ? p.identifier || 1 : 1, pointerType: touch ? "touch" : "mouse",
            clientX: p.clientX, clientY: p.clientY, pageX: p.pageX, pageY: p.pageY, button: 0, isPrimary: true,
            preventDefault: function () { ev.preventDefault(); }, stopPropagation: function () { ev.stopPropagation(); }, originalEvent: ev
          });
        };
        orig.call(t.indexOf("mouse") === 0 && t !== "mousedown" && target.nodeType === 1 ? document : target, t, w, t === "touchmove" ? false : opt);
      });
    };
    add.removeEventListener = function (type, fn, opt) {
      if (!MAP[type] || !fn || !fn.__lgPtr) return origRm.call(this, type, fn, opt);
      var target = this;
      MAP[type].forEach(function (t) { var w = fn.__lgPtr[t]; if (w) origRm.call(t.indexOf("mouse") === 0 && t !== "mousedown" && target.nodeType === 1 ? document : target, t, w, opt); });
    };
  }

  // ---------- Dates without Intl (iOS 9 ignores the options to toLocaleDateString) ----------
  if (!window.Intl) {
    var DS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var MS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var oDate = Date.prototype.toLocaleDateString, oStr = Date.prototype.toLocaleString;
    var fmt = function (d, o) {
      var wd = o.weekday ? (o.weekday === "long" ? DS[d.getDay()] : DS[d.getDay()].slice(0, 3)) : "";
      var mo = o.month ? (o.month === "long" ? MS[d.getMonth()] : o.month === "short" ? MS[d.getMonth()].slice(0, 3) : String(d.getMonth() + 1)) : "";
      var dy = o.day ? (o.day === "2-digit" ? ("0" + d.getDate()).slice(-2) : String(d.getDate())) : "";
      var yr = o.year ? String(d.getFullYear()) : "";
      var md = /^\d+$/.test(mo) ? [mo, dy, yr].filter(Boolean).join("/") : [mo, dy].filter(Boolean).join(" ") + (yr ? (dy ? ", " : " ") + yr : "");
      return [wd, md].filter(Boolean).join(", ");
    };
    Date.prototype.toLocaleDateString = function (loc, o) { return o && (o.weekday || o.month || o.day || o.year) ? fmt(this, o) : oDate.call(this); };
    Date.prototype.toLocaleString = function (loc, o) { return o && (o.weekday || o.month || o.day || o.year) && !o.hour ? fmt(this, o) : oStr.call(this); };
  }

  // ---------- Board sizing (replaces container queries + aspect-ratio) ----------
  var html = document.documentElement;
  var style = document.createElement("style"); style.id = "lg-fit";
  var rules = {};
  function px(n) { return Math.max(0, Math.round(n * 10) / 10) + "px"; }
  function clamp(a, v, b) { return Math.max(a, Math.min(b, v)); }
  function box(e) { var r = e.getBoundingClientRect(); return { w: e.clientWidth || r.width, h: e.clientHeight || r.height }; }
  function fit() {
    if (!style.parentNode && document.head) document.head.appendChild(style);
    var fits = document.querySelectorAll(".fit, .stfit"), changed = false;
    for (var i = 0; i < fits.length; i++) {
      var f = fits[i], b = box(f); if (!b.w || !b.h) continue;
      f.style.setProperty("--cqw", px(b.w / 100)); f.style.setProperty("--cqh", px(b.h / 100));
      var view = f.closest(".view"), id = view && view.id ? "#" + view.id + " " : "", css = "";
      if (f.querySelector(".board")) {
        var bw = Math.min(b.w, b.h * 5 / 6, 350), bh = bw * 6 / 5;
        css += id + ".board{width:" + px(bw) + ";height:" + px(bh) + "}" + id + ".tile{font-size:" + px(Math.min(b.w * 0.08, b.h * 0.066, 32)) + "}";
      }
      if (f.querySelector(".ggrid")) {
        var gw = Math.min(b.w, b.h * 1.25, 480), gh = gw * 0.8, g = 7, tw = Math.floor((gw - 3 * g) / 4 * 10) / 10 - 0.1, th = Math.floor((gh - 3 * g) / 4 * 10) / 10;
        css += id + ".ggrid{width:" + px(gw) + ";height:" + px(gh) + "}" + id + ".ggrid>*{height:" + px(th) + "}" + id + ".ggrid>.gtile{width:" + px(tw) + ";flex:0 0 auto}" +
          id + ".ggrid>.solved{width:100%;flex:0 0 100%}" +
          id + ".gtile{font-size:" + px(clamp(10, b.w * 0.035, 17)) + "}" + id + ".gtile.long{font-size:" + px(clamp(9, b.w * 0.028, 14)) + "}" +
          id + ".solved b{font-size:" + px(clamp(13, b.w * 0.036, 18)) + "}" + id + ".solved span{font-size:" + px(clamp(12, b.w * 0.032, 16)) + "}";
        layoutGroups(f.querySelector(".ggrid"), g);
      }
      var cw = f.querySelector(".cw");
      if (cw) {
        var s = Math.min(b.w, b.h, 400);
        css += id + ".cw{width:" + px(s) + ";height:" + px(s) + "}";
        cw.style.setProperty("--cqw", px((s - 4) / 100)); cw.style.setProperty("--cqh", px((s - 4) / 100));
      }
      if (f.querySelector(".stgrid")) {
        var sw = Math.min(b.w, b.h * 0.75, 360), sh = sw * 8 / 6, d = sw / 6 * 0.78;
        css += id + ".stgrid{width:" + px(sw) + ";height:" + px(sh) + "}" + id + ".sl span{width:" + px(d) + ";height:" + px(d) + ";line-height:" + px(d) + ";font-size:" + px(Math.min(b.w * 0.074, b.h * 0.055, 26)) + "}";
      }
      var key = id || ("#fit" + i);
      if (css && rules[key] !== css) { rules[key] = css; changed = true; }
    }
    if (changed) { var all = ""; for (var k in rules) all += rules[k] + "\n"; style.textContent = all; }
  }
  // Groups: tiles in rows of four under the solved bars, 7px gaps.
  function layoutGroups(grid, g) {
    var kids = grid.children, col = 0, row = 0;
    for (var i = 0; i < kids.length; i++) {
      var k = kids[i];
      k.style.marginTop = row ? g + "px" : "0";
      if (/\bsolved\b/.test(k.className)) { k.style.marginLeft = "0"; row++; col = 0; continue; }
      k.style.marginLeft = col ? g + "px" : "0";
      col++; if (col === 4) { col = 0; row++; }
    }
  }
  var queued = false;
  function soon() { if (queued) return; queued = true; requestAnimationFrame(function () { queued = false; try { fit(); } catch (e) {} }); }
  window.__lgFit = soon;
  addEventListener("resize", soon); addEventListener("orientationchange", function () { setTimeout(soon, 300); });
  function watch() {
    soon();
    if (window.MutationObserver) new MutationObserver(soon).observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["hidden"] });
  }
  if (document.body) watch(); else document.addEventListener("DOMContentLoaded", watch);
})();
