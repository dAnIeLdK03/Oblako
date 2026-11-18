// Единна входна точка за данни за времето (Open-Meteo, без API ключ).
import * as openmeteo from './openmeteo.js';
import { reverseGeocode } from './reverseGeocode.js';

export { getIconUrl } from './codes.js';
export { WeatherError } from './errors.js';

// query: { city } или { lat, lon }
export async function getCurrentWeather(query) {
    if (query.city) return openmeteo.getCurrent(query);

    // По координати: добавяме реалното име на мястото.
    const [data, place] = await Promise.all([
        openmeteo.getCurrent(query),
        reverseGeocode(query.lat, query.lon),
    ]);
    if (place) {
        data.name = place.name;
        data.sys = { ...data.sys, country: place.country || data.sys?.country || '' };
    } else if (!data.name) {
        data.name = `${Number(query.lat).toFixed(2)}, ${Number(query.lon).toFixed(2)}`;
    }
    return data;
}

// opts.days — колко дни напред (до 16)
export function getForecast(query, opts) {
    return openmeteo.getForecast(query, opts);
}
