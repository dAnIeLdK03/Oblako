// Empty service worker to remove offline functionality
self.addEventListener('install', function(e) {
  self.skipWaiting();
});

self.addEventListener('activate', function(e) {
  // Unregister this service worker
  self.registration.unregister();
  // Remove all caches
  if (caches && caches.keys) {
    caches.keys().then(function(keys) {
      keys.forEach(function(key) {
        caches.delete(key);
      });
    });
  }
});
