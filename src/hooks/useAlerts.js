import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  computeAlerts,
  fetchOfficialAlerts,
  mergeAlerts,
  officialAlertsFor,
} from '../services/alerts/index.js';

const MINUTE = 60 * 1000;

// Предупреждения за показаното място: собствени по прогнозата + (за България) официалните на НИМХ.
// "Сега" е моментът на данните, а не часовникът, за да е резултатът чист и да съвпада с прогнозата.
export function useAlerts(weather) {
  const regionCode = weather?.place.country === 'BG' ? weather.place.regionCode : undefined;

  const official = useQuery({
    queryKey: ['alerts', 'bg'],
    queryFn: ({ signal }) => fetchOfficialAlerts(signal),
    enabled: Boolean(regionCode),
    staleTime: 10 * MINUTE,
    refetchInterval: 15 * MINUTE,
    retry: false, // няма функция в dev сървъра; при грешка просто няма официални
  });

  return useMemo(() => {
    if (!weather) return { alerts: [], regionCode: undefined, hasOfficial: false };
    const now = weather.current.time * 1000;
    const fromFeed =
      official.data && regionCode ? officialAlertsFor(official.data, regionCode, now) : [];
    return {
      alerts: mergeAlerts(fromFeed, computeAlerts(weather, now)),
      regionCode,
      hasOfficial: fromFeed.length > 0,
    };
  }, [weather, official.data, regionCode]);
}
