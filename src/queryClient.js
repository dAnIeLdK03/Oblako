import { QueryClient } from '@tanstack/react-query';

// Общ клиент за кеша на заявките. Настройките за времето са в hooks/weatherQueries.js.
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true, // опреснява остарелите данни при връщане към таба
      gcTime: 30 * 60 * 1000, // неизползван кеш се пази 30 минути
      // Заявката се опитва и без връзка: service worker-ът връща последната прогноза от кеша си.
      // (По подразбиране TanStack Query я спира, докато navigator.onLine е false.)
      networkMode: 'offlineFirst',
    },
  },
});
