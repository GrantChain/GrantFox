// Custom Service Worker for GrantFox PWA
// This service worker handles push notifications and basic caching

const CACHE_NAME = "grantfox-v1";
const OFFLINE_URL = "/offline.html";

// Install event - cache essential resources
self.addEventListener("install", (event) => {
  console.log("Service Worker: Install event");

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Service Worker: Caching essential files");
      return cache.addAll([
        "/",
        "/offline.html",
        "/icons/icon-192x192.png",
        "/icons/icon-512x512.png",
      ]);
    }),
  );

  // Skip waiting to activate immediately
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  console.log("Service Worker: Activate event");

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log("Service Worker: Deleting old cache:", cacheName);
            return caches.delete(cacheName);
          }
        }),
      );
    }),
  );

  // Take control of all clients immediately
  self.clients.claim();
});

// Fetch event - implement caching strategies
self.addEventListener("fetch", (event) => {
  // Skip non-GET requests
  if (event.request.method !== "GET") {
    return;
  }

  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // Handle navigation requests
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match(OFFLINE_URL);
      }),
    );
    return;
  }

  // Handle API requests with network-first strategy
  if (event.request.url.includes("/api/")) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Cache successful responses
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // Return cached version if available
          return caches.match(event.request);
        }),
    );
    return;
  }

  // Handle static assets with cache-first strategy
  if (
    event.request.destination === "image" ||
    event.request.url.match(/\.(css|js|png|jpg|jpeg|gif|svg|woff|woff2)$/)
  ) {
    event.respondWith(
      caches.match(event.request).then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request).then((response) => {
          // Cache the response
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return response;
        });
      }),
    );
    return;
  }

  // Default: network-first strategy
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Cache successful responses
        if (response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // Return cached version if available
        return caches.match(event.request);
      }),
  );
});

// Push notification event
self.addEventListener("push", (event) => {
  console.log("Service Worker: Push event received");

  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body || "New notification from GrantFox",
      icon: data.icon || "/icons/icon-192x192.png",
      badge: "/icons/icon-72x72.png",
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: "1",
        url: data.url || "/",
      },
      actions: [
        {
          action: "open",
          title: "Open App",
          icon: "/icons/icon-72x72.png",
        },
        {
          action: "close",
          title: "Close",
          icon: "/icons/icon-72x72.png",
        },
      ],
    };

    event.waitUntil(
      self.registration.showNotification(data.title || "GrantFox", options),
    );
  }
});

// Notification click event
self.addEventListener("notificationclick", (event) => {
  console.log("Service Worker: Notification click received");

  event.notification.close();

  if (event.action === "open" || !event.action) {
    const urlToOpen = event.notification.data?.url || "/";

    event.waitUntil(
      clients.matchAll({ type: "window" }).then((clientList) => {
        // Check if there's already a window/tab open with the target URL
        for (const client of clientList) {
          if (client.url === urlToOpen && "focus" in client) {
            return client.focus();
          }
        }
        // If no existing window, open a new one
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      }),
    );
  }
});

// Background sync event (if supported)
self.addEventListener("sync", (event) => {
  console.log("Service Worker: Background sync event");

  if (event.tag === "background-sync") {
    event.waitUntil(
      // Handle background sync tasks here
      Promise.resolve(),
    );
  }
});

// Message event for communication with main thread
self.addEventListener("message", (event) => {
  console.log("Service Worker: Message received", event.data);

  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
