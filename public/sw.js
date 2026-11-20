// Empty service worker to remove offline functionality.
// Нищо в приложението не го регистрира: пази се само за да замени и унищожи
// service worker-а от стари версии у потребителите. Може да се изтрие, когато
// такива вече няма (напр. след няколко месеца).
self.addEventListener('install', function() {
  self.skipWaiting();
});

self.addEventListener('activate', function() {
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
