/* Service worker simples: cache dos arquivos para o app funcionar instalado/offline. */
var CACHE = "leitura-magica-v8";
var ASSETS = [
  "./",
  "./index.html",
  "./styles.css",
  "./data.js",
  "./progress.js",
  "./fx.js",
  "./alignment.js",
  "./speech.js",
  "./app.js",
  "./manifest.json",
  "./icon.svg"
];

self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(ASSETS); }));
  self.skipWaiting();
});

self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.map(function (k) {
        if (k !== CACHE) return caches.delete(k);
      }));
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", function (e) {
  e.respondWith(
    caches.match(e.request).then(function (r) {
      return r || fetch(e.request);
    })
  );
});
