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
  if (window.Node && !("isConnected" in Node.prototype)) Object.defineProperty(Node.prototype, "isConnected", { configurable: true, get: function () { return document.documentElement.contains(this); } });

  // ---------- Canvas: roundRect / ellipse (games draw with these; Safari 9 has neither roundRect nor always ellipse) ----------
  function roundRect(x, y, w, h, r) {
    if (w < 0) { x += w; w = -w; } if (h < 0) { y += h; h = -h; }
    var a = r == null ? [0] : (r instanceof Array ? r : [r]);
    a = a.map(function (v) { return typeof v === "number" ? v : (v && (v.x || 0)) || 0; });
    var tl, tr, br, bl;
    if (a.length === 1) tl = tr = br = bl = a[0];
    else if (a.length === 2) { tl = br = a[0]; tr = bl = a[1]; }
    else if (a.length === 3) { tl = a[0]; tr = bl = a[1]; br = a[2]; }
    else { tl = a[0]; tr = a[1]; br = a[2]; bl = a[3]; }
    var k = Math.min(1, w / ((tl + tr) || 1), w / ((bl + br) || 1), h / ((tl + bl) || 1), h / ((tr + br) || 1));
    tl *= k; tr *= k; br *= k; bl *= k;
    this.moveTo(x + tl, y);
    this.lineTo(x + w - tr, y); this.arcTo(x + w, y, x + w, y + tr, tr);
    this.lineTo(x + w, y + h - br); this.arcTo(x + w, y + h, x + w - br, y + h, br);
    this.lineTo(x + bl, y + h); this.arcTo(x, y + h, x, y + h - bl, bl);
    this.lineTo(x, y + tl); this.arcTo(x, y, x + tl, y, tl);
    this.closePath();
  }
  function ellipse(x, y, rx, ry, rot, a0, a1, ccw) {
    if (rx < 0 || ry < 0) return;
    // only for contexts with save/restore; Path2D falls back to a scaled arc without rotation
    if (this.save && this.setTransform) {
      this.save(); this.translate(x, y); this.rotate(rot || 0); this.scale(rx || 1e-6, ry || 1e-6);
      this.arc(0, 0, 1, a0, a1, !!ccw); this.restore(); return;
    }
    this.arc(x, y, Math.max(rx, ry), a0, a1, !!ccw);
  }
  var C2 = window.CanvasRenderingContext2D && CanvasRenderingContext2D.prototype, P2 = window.Path2D && Path2D.prototype;
  def([C2, P2], "roundRect", roundRect);
  def([C2, P2], "ellipse", ellipse);
  def([C2], "setLineDash", function () {});
  def([C2], "getLineDash", function () { return []; });

  if (!window.requestAnimationFrame)window.requestAnimationFrame = window.webkitRequestAnimationFrame || function (f) { return setTimeout(function () { f(Date.now()); }, 16); };

  // ---------- Pointer events -> touch / mouse (iOS 9 has no pointer events) ----------
  function tappable(n, stop) {
    for (; n && n !== stop && n.nodeType === 1; n = n.parentNode) {
      var tg = n.tagName; if (tg === "BUTTON" || tg === "A" || tg === "INPUT" || tg === "SELECT" || tg === "TEXTAREA" || tg === "LABEL") return true;
      if ((" " + n.className + " ").indexOf(" zpanel ") >= 0) return true;
    }
    return false;
  }
  // ---------- Speed: draw canvases at 1x. A retina iPad from 2012 can't push 4x the pixels at 60fps ----------
  try { Object.defineProperty(window, "devicePixelRatio", { configurable: true, get: function () { return 1; } }); } catch (e) {}

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
          // drag, don't scroll or double-tap zoom -- but never on a touch that starts on a button or a start/results
          // panel, or iOS drops the tap's click (that left Start dead on every game)
          if ((t === "touchmove" || t === "touchstart") && target.nodeType === 1 && !(t === "touchstart" && tappable(ev.target, target))) ev.preventDefault();
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

  // ---------- Fast, reliable taps ----------
  // Old iOS waits ~300ms before a tap becomes a click and sometimes drops it (taps felt dead). Fire the click
  // ourselves the moment the finger lifts, if it barely moved, and cancel the slow native one. Touches a game
  // already claimed (touchstart prevented: drags, boards) are left alone.
  (function () {
    var CLICKABLE = "button, a, label, [onclick], [role=button], [data-home]";
    var t0 = 0, x0 = 0, y0 = 0, moved = false, startEv = null;
    document.addEventListener("touchstart", function (e) {
      if (e.touches.length !== 1) { startEv = null; return; }
      var p = e.touches[0]; t0 = Date.now(); x0 = p.clientX; y0 = p.clientY; moved = false; startEv = e;
    }, false);
    document.addEventListener("touchmove", function (e) {
      var p = e.touches[0]; if (p && (Math.abs(p.clientX - x0) > 10 || Math.abs(p.clientY - y0) > 10)) moved = true;
    }, false);
    document.addEventListener("touchend", function (e) {
      var s = startEv; startEv = null;
      if (!s || s.defaultPrevented || moved || Date.now() - t0 > 800 || e.defaultPrevented) return;
      var el = s.target; if (el && el.nodeType !== 1) el = el.parentNode;
      var c = el && el.closest ? el.closest(CLICKABLE) : null;
      if (!c || c.disabled) return;
      var tg = el.tagName; if (tg === "INPUT" || tg === "TEXTAREA" || tg === "SELECT") return;
      e.preventDefault();
      var p = e.changedTouches[0], ev = document.createEvent("MouseEvents");
      ev.initMouseEvent("click", true, true, window, 1, p.screenX, p.screenY, p.clientX, p.clientY, false, false, false, false, 0, null);
      el.dispatchEvent(ev);
    }, false);
  })();

  // ---------- Server calls: fall back to a <script> tag (JSONP) ----------
  // The app POSTs to the Apps Script URL, which redirects to googleusercontent.com. Old Safari can refuse that
  // cross-site redirect, so if a POST fails we send the same request as GET ?cb=..&q=.. (server doGet answers JS).
  var realFetch = window.fetch, jsonpN = 0, KEY = "bdd:jsonp";
  var useJsonp = false; try { useJsonp = localStorage.getItem(KEY) === "1"; } catch (e) {}
  function jsonp(url, body) {
    return new Promise(function (resolve, reject) {
      var name = "__bdj" + (++jsonpN) + "_" + Date.now(), s = document.createElement("script"), done = false;
      var finish = function (err, data) {
        if (done) return; done = true; clearTimeout(t);
        try { delete window[name]; } catch (e) { window[name] = undefined; }
        if (s.parentNode) s.parentNode.removeChild(s);
        if (err) reject(err); else resolve({ ok: true, status: 200, json: function () { return Promise.resolve(data); }, text: function () { return Promise.resolve(JSON.stringify(data)); } });
      };
      var t = setTimeout(function () { finish(new TypeError("Network request failed")); }, 25000);
      window[name] = function (data) { finish(null, data); };
      s.onerror = function () { finish(new TypeError("Network request failed")); };
      s.src = url + (url.indexOf("?") < 0 ? "?" : "&") + "cb=" + name + "&q=" + encodeURIComponent(body || "{}");
      document.head.appendChild(s);
    });
  }
  if (realFetch) window.fetch = function (input, init) {
    var url = typeof input === "string" ? input : input && input.url;
    if (!/^https:\/\/script\.google\.com\/macros\//.test(url || "") || !init || init.method !== "POST") return realFetch.apply(this, arguments);
    if (useJsonp) return jsonp(url, init.body);
    var self = this, args = arguments;
    return realFetch.apply(self, args).catch(function () {
      return jsonp(url, init.body).then(function (r) { useJsonp = true; try { localStorage.setItem(KEY, "1"); } catch (e) {} return r; });
    });
  };

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
