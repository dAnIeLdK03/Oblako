import { queryOptions } from '@tanstack/react-query';
import { getWeather } from '../services/weather';
import { getPosition } from '../utils/location.js';

const MINUTE = 60 * 1000;
// Всички страници (начало, прогноза, UV, валежи) ползват една и съща заявка за мястото,
// затова размерът е общ: при смяна на страница данните идват от кеша.
export const FORECAST_DAYS = 14;

// Само мрежови грешки и 5xx си заслужава да се повторят (веднъж).
// 429 и "няма такъв град" не се повтарят: само влошават положението.
const shouldRetry = (failureCount, error) =>
    failureCount < 1 && (error?.code === 'NETWORK' || error?.code === 'SERVER');

// Ключ: град без значение на регистъра или координати до ~100 м.
function locationKey({ city, lat, lon }) {
    return city
        ? { city: city.trim().toLowerCase() }
        : { lat: Number(lat).toFixed(3), lon: Number(lon).toFixed(3) };
}

// query: { city } или { lat, lon }
export function weatherQueryOptions(query) {
    return queryOptions({
        queryKey: ['weather', locationKey(query), FORECAST_DAYS],
        queryFn: ({ signal }) => getWeather(query, { days: FORECAST_DAYS, signal }),
        staleTime: 5 * MINUTE,          // толкова време данните се смятат за свежи (без нова заявка)
        refetchInterval: 15 * MINUTE,   // автоматично опресняване, докато страницата е отворена
        retry: shouldRetry,
        retryDelay: 600,
    });
}

// Позицията на потребителя се споделя между страниците (без повторен въпрос към браузъра).
export const positionQueryOptions = queryOptions({
    queryKey: ['position'],
    queryFn: () => getPosition(),
    staleTime: 5 * MINUTE,
    retry: false,
    refetchOnWindowFocus: false,
});
