const CACHE_NAME = "topliga";
var urlsToCache = [
  "/",
  "/index.html",
  "/navlist.html",
  "/pages/home.html",
  "/pages/fixture.html",
  "/pages/standing.html",
  "/pages/stats.html",
  "/pages/admin.html",
  "/pages/detailnews.html",
  "/assets/css/materialize.min.css",
  "/assets/css/styles.css",
  "/assets/css/spacing.css",
  "/assets/js/materialize.min.js",
  "/assets/js/jquery-3.4.1.js",
  "/assets/js/idb.js",
  "/assets/js/contents.js",
  "/assets/js/register-service-worker.js",
  "/assets/js/api.js",
  "/assets/js/db.js",
  "/assets/img/logo-not-found.png",
  "/assets/img/jadwal.png",
  "/assets/img/tlcom.png"
];

self.addEventListener("install",function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME).then(function(cache) {
            return cache.addAll(urlsToCache);
        })
    );
});

self.addEventListener("fetch", function(event) {
  var base_url = "https://api.football-data.org/v2";
  if (event.request.url.indexOf(base_url) > -1) {
    event.respondWith(
      caches.open(CACHE_NAME).then(function(cache) {
        return fetch(event.request).then(function(response) {
          cache.put(event.request.url, response.clone());
          return response;
        })
      })
    );
  } else {
    event.respondWith(
      caches.match(event.request).then(function(response) {
        return response || fetch (event.request);
      })
    )
  }
});

self.addEventListener("activate", function(event) {
    event.waitUntil(
      caches.keys().then(function(cacheNames) {
        return Promise.all(
          cacheNames.map(function(cacheName) {
            if (cacheName != CACHE_NAME) {
              console.log("ServiceWorker: cache " + cacheName + " dihapus");
              return caches.delete(cacheName);
            }
          })
        );
      })
    );
});

self.addEventListener('push', function(event) {
  var body;
  if (event.data) {
    body = event.data.text();
  } else {
    body = 'Push message no payload';
  }
  var options = {
    body: body,
    // icon: 'img/notification.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };
  event.waitUntil(
    self.registration.showNotification('Push Notification', options)
  );
});