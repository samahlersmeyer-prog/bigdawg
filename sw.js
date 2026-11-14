// Big Dawg Daily service worker: opens instantly from the phone, updates quietly in the background.
const V = "bdd-f08196998a";
const SHELL = ["./", "./manifest.webmanifest", "./icon-192.png", "./icon-512.png", "./apple-touch-icon.png", "./styles.css?v=ce7bef2c7d", "./js/data.js?v=d5247037cf", "./js/core.js?v=a8123e98ce", "./js/daily.js?v=7774df60f1", "./js/social.js?v=b81db0a3ec", "./js/arcade.js?v=620c0ff59b", "./js/boot.js?v=02efb63a08"];
self.addEventListener("install", e => { e.waitUntil(caches.open(V).then(c => c.addAll(SHELL.map(u => new Request(u, { cache: "reload" })))).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== V && k !== V + "-fonts" && !k.endsWith("-fonts")).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  const req = e.request; if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin === location.origin) {
    const key = req.mode === "navigate" ? "./" : req;
    e.respondWith(caches.open(V).then(async c => {
      const hit = await c.match(key, { ignoreSearch: req.mode === "navigate" });
      const net = fetch(req.mode === "navigate" ? new Request("./", { cache: "no-cache" }) : req).then(r => { if (r && r.ok) c.put(key, r.clone()); return r; }).catch(() => hit);
      if (hit) { e.waitUntil(net); return hit; }
      return net;
    }));
  } else if (/fonts\.(googleapis|gstatic)\.com$/.test(url.hostname)) {
    e.respondWith(caches.open(V + "-fonts").then(async c => (await c.match(req)) || fetch(req).then(r => { c.put(req, r.clone()); return r; })));
  }
});
