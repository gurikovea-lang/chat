
const prefix = 'pyramid:' + self.registration.scope + ':';
const cacheName = prefix + '0e14688767f0';
const home = new URL('./',self.registration.scope).href;
self.addEventListener('install',event => {
  event.waitUntil(caches.open(cacheName).then(cache =>
    cache.addAll(['./','./manifest.webmanifest','./icon-192.png','./icon-512.png']))
    .then(() => self.skipWaiting()));
});
self.addEventListener('activate',event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k =>
    k.startsWith(prefix) && k !== cacheName).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener('fetch',event => {
  const request = event.request;
  if (request.method !== 'GET' || !request.url.startsWith(home)) return;
  event.respondWith(caches.open(cacheName).then(async cache => {
    if (request.mode === 'navigate') return (await cache.match(home)) || fetch(request);
    return (await cache.match(request)) || fetch(request);
  }));
});
