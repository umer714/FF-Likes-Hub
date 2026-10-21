const CACHE_NAME = "mindora-shell-v17";
const APP_SHELL = [
  "/", "/dashboard.html", "/about.html", "/contact.html", "/privacy.html",
  "/ai-study-tools.html", "/pdf-study-assistant.html", "/study-planner.html", "/study-guides.html",
  "/manifest.webmanifest", "/login.html", "/auth.js", "/auth-config.js", "/icons/icon-192.svg", "/icons/icon-512.svg"
];

self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await Promise.all(APP_SHELL.map(async (url) => {
      try { const response = await fetch(url, { cache: "reload" }); if (response.ok) await cache.put(url, response); }
      catch { /* An unavailable asset should not prevent installation. */ }
    }));
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((key) => key !== CACHE_NAME && (key.startsWith("mindora-shell-") || key.startsWith("battlecore-shell-"))).map((key) => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== "GET" || url.origin !== self.location.origin || url.pathname.startsWith("/api/")) return;
  if (request.mode === "navigate") {
    event.respondWith((async () => {
      try {
        const response = await fetch(request);
        if (response.ok) (await caches.open(CACHE_NAME)).put(request, response.clone());
        return response;
      } catch {
        return (await caches.match(request)) || (await caches.match("/")) || new Response("Mindora is offline. Reconnect to the internet to load the latest page.", { status: 503, headers: { "Content-Type": "text/plain; charset=utf-8" } });
      }
    })());
    return;
  }
  event.respondWith((async () => {
    const cached = await caches.match(request);
    if (cached) return cached;
    try {
      const response = await fetch(request);
      if (response.ok && response.type === "basic") (await caches.open(CACHE_NAME)).put(request, response.clone());
      return response;
    } catch {
      return new Response("This resource is not available offline.", { status: 503, headers: { "Content-Type": "text/plain; charset=utf-8" } });
    }
  })());
});
