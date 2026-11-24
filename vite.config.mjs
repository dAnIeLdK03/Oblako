import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

const DAY = 24 * 60 * 60;

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      // Service worker (Workbox generateSW) на /sw.js — същия адрес като стария "празен" worker,
      // така че браузърите на потребителите го заменят при следващата проверка.
      registerType: 'autoUpdate',
      injectRegister: 'script', // /registerSW.js — външен файл, съвместим с CSP script-src 'self'
      manifest: false, // ползва се ръчният public/manifest.json
      workbox: {
        // Черупката на приложението (код, стилове, шрифтове, иконите на времето) — за зареждане без мрежа
        globPatterns: ['**/*.{js,css,html,woff2}', 'weather-icons/*'],
        globIgnores: ['**/*devanagari*'],
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/\.[a-z0-9]+$/i], // robots.txt, sitemap.xml, manifest.json…
        cleanupOutdatedCaches: true,
        runtimeCaching: [
          {
            // Последната прогноза: първо мрежата, при липса на връзка — последният кеширан отговор.
            // Кеш се ползва най-много 24 часа. Ключът закръгля координатите до 2 знака (~1 км),
            // за да съвпадне заявката с точна GPS позиция с тази, която ползваме офлайн.
            urlPattern: ({ url }) =>
              [
                'api.open-meteo.com',
                'geocoding-api.open-meteo.com',
                'api.bigdatacloud.net',
              ].includes(url.hostname),
            handler: 'NetworkFirst',
            options: {
              cacheName: 'oblako-weather',
              networkTimeoutSeconds: 8,
              expiration: { maxEntries: 40, maxAgeSeconds: DAY },
              cacheableResponse: { statuses: [200] },
              plugins: [
                {
                  cacheKeyWillBeUsed: async ({ request }) => {
                    const url = new URL(request.url);
                    for (const key of ['latitude', 'longitude']) {
                      const value = parseFloat(url.searchParams.get(key));
                      if (Number.isFinite(value)) url.searchParams.set(key, value.toFixed(2));
                    }
                    return url.href;
                  },
                },
              ],
            },
          },
          {
            // Големи снимки на градове и лога: кешират се при първо виждане
            urlPattern: ({ url, sameOrigin }) =>
              sameOrigin &&
              (url.pathname.startsWith('/city-photos/') || url.pathname.startsWith('/icons/')),
            handler: 'CacheFirst',
            options: {
              cacheName: 'oblako-images',
              expiration: { maxEntries: 40, maxAgeSeconds: 30 * DAY },
              cacheableResponse: { statuses: [200] },
            },
          },
        ],
      },
    }),
  ],
  server: {
    proxy: {
      '/api': 'http://localhost:4000',
    },
  },
});
