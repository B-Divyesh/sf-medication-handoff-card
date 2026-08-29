const VERSION = 'mhc-v6';
const SHELL_CACHE = `${VERSION}-shell`;
const RUNTIME_CACHE = `${VERSION}-runtime`;
const SHELL = ['/offline.html', '/offline.css', '/manifest.webmanifest', '/favicon.svg', '/assets/icon-192.png', '/assets/icon-512.png', '/assets/hero-kitchen-table-640.webp', '/assets/hero-kitchen-table-1280.webp', '/assets/hero-kitchen-table.jpg'];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(SHELL_CACHE);
    const cacheFresh = async (path) => {
      const item = await fetch(path, { cache: 'reload' });
      if (!item.ok) throw new Error(`Could not precache ${path}`);
      await cache.put(path, item);
    };
    await Promise.all(SHELL.map(cacheFresh));
    const response = await fetch('/', { cache: 'reload' });
    const html = await response.clone().text();
    await cache.put('/', response.clone());
    await cache.put('/index.html', response);
    const builtAssets = [...html.matchAll(/(?:src|href)="(\/assets\/[^\"]+)"/g)].map((match) => match[1]);
    await Promise.all(builtAssets.map(cacheFresh));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => ![SHELL_CACHE, RUNTIME_CACHE].includes(key)).map((key) => caches.delete(key)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  if (event.request.mode === 'navigate') {
    event.respondWith(fetch(event.request).then((response) => {
      const copy = response.clone();
      caches.open(RUNTIME_CACHE).then((cache) => cache.put(event.request, copy));
      return response;
    }).catch(async () => {
      const shell = await caches.open(SHELL_CACHE);
      const runtime = await caches.open(RUNTIME_CACHE);
      return (await runtime.match(url.pathname)) || (await shell.match('/')) || (await shell.match('/offline.html'));
    }));
    return;
  }

  event.respondWith((async () => {
    const shell = await caches.open(SHELL_CACHE);
    const runtime = await caches.open(RUNTIME_CACHE);
    const cached = (await shell.match(url.pathname)) || (await runtime.match(event.request));
    if (cached) return cached;
    const response = await fetch(event.request);
    if (response.ok) await runtime.put(event.request, response.clone());
    return response;
  })());
});
