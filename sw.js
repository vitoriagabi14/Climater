/* =====================================================
   sw.js — Service Worker do ClimaTrend (PWA)
   Responsável por: cache de arquivos e suporte offline
   ===================================================== */

const CACHE_NAME = "climaroupa-v1";

// Lista de arquivos que serão guardados no cache do navegador
const ASSETS_TO_CACHE = [
  "/index.html",
  "/style.css",
  "/app.js",
  "/manifest.json",
  "https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Sans:wght@300;400;500&display=swap"
];

// ── INSTALL: executa uma vez quando o SW é instalado ──
// Abre o cache e salva todos os arquivos listados acima
self.addEventListener("install", function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting(); // ativa imediatamente sem esperar recarregar
});

// ── ACTIVATE: executa quando o SW assume o controle ──
// Limpa versões antigas do cache
self.addEventListener("activate", function(event) {
  event.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// ── FETCH: intercepta todas as requisições de rede ──
// Estratégia: "Network First, fallback to Cache"
self.addEventListener("fetch", function(event) {

  // Requisições à API do OpenWeatherMap: sempre vai na rede
  // (não faz sentido usar dados de clima em cache — precisam ser em tempo real)
  if (event.request.url.includes("openweathermap.org")) {
    event.respondWith(fetch(event.request));
    return;
  }

  // Imagens do Unsplash: também sempre busca na rede
  if (event.request.url.includes("unsplash.com")) {
    event.respondWith(fetch(event.request));
    return;
  }

  // Para os demais recursos: tenta a rede primeiro
  // Se falhar (offline), usa a versão em cache
  event.respondWith(
    fetch(event.request)
      .then(function(networkResponse) {
        // Salva uma cópia fresca no cache
        const clone = networkResponse.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        return networkResponse;
      })
      .catch(function() {
        // Sem internet: serve do cache
        return caches.match(event.request);
      })
  );
});