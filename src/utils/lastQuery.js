// Последното място, за което е зареден прогнозата. Нужно е офлайн: стартов адрес "/" няма място в URL,
// а геолокацията без мрежа не работи, затова показваме последното известно място от кеша на service worker-а.
//
// Координатите се пазят закръглени до 2 знака (~1 км): достатъчно за прогнозата, по-малко точни и
// съвпадат с ключа на кеша на service worker-а (виж vite.config.mjs). Остават само на устройството.
import { getItem, setItem } from './storage.js';

const KEY = 'oblako_last_query';

const round = (n) => Number(Number(n).toFixed(2));

// query: { city } или { lat, lon };  data: резултатът от getWeather (за името по координати)
export function rememberQuery(query, data) {
    const value = query.city
        ? { city: query.city }
        : { lat: round(query.lat), lon: round(query.lon), name: data?.place?.named ? data.place.name : null };
    setItem(KEY, JSON.stringify(value));
}

export function readLastQuery() {
    try {
        const v = JSON.parse(getItem(KEY));
        if (typeof v?.city === 'string' && v.city) return { city: v.city };
        if (Number.isFinite(v?.lat) && Number.isFinite(v?.lon)) {
            return { lat: v.lat, lon: v.lon, name: typeof v.name === 'string' ? v.name : null };
        }
    } catch {
        // липсва или е повредено
    }
    return null;
}

// Офлайн заявка за дадено място от URL. Градът, който сме определили по координати, няма кеширано
// търсене по име (адресът му се записва в URL без мрежова заявка), затова се връщаме към координатите му.
export function offlineQueryFor(place, last) {
    if (!place) return last;
    if (place.type === 'city' && last?.name && last.name.toLowerCase() === place.city.toLowerCase()) {
        return { lat: last.lat, lon: last.lon };
    }
    return null; // иначе ползваме заявката от URL (може да е в кеша)
}
