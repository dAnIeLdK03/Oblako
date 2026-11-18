// Единна входна точка за данни за времето.
// Основен доставчик: Open-Meteo (без ключ). Резервен: OpenWeather (ако има ключ).
// Може да се наложи основен с VITE_WEATHER_PROVIDER=openweather|openmeteo.
import * as openmeteo from './openmeteo.js';
import * as openweather from './openweather.js';
import { reverseGeocode } from './reverseGeocode.js';
import { WeatherError } from './errors.js';

export { getIconUrl } from './codes.js';
export { WeatherError };

const providers = { openmeteo, openweather };
const COOLDOWN_MS = 5 * 60 * 1000;
const failedAt = {}; // име на доставчик -> време на последна грешка

function providerOrder() {
    const preferred = import.meta.env.VITE_WEATHER_PROVIDER === 'openweather'
        ? ['openweather', 'openmeteo']
        : ['openmeteo', 'openweather'];
    const available = preferred.filter((name) => providers[name].isAvailable());
    const healthy = available.filter((name) => !(failedAt[name] && Date.now() - failedAt[name] < COOLDOWN_MS));
    // Ако всички са в "охлаждане", опитваме пак всички.
    return healthy.length ? healthy : available;
}

async function withFallback(operation, ...args) {
    let lastError;
    let notFound = null;
    for (const name of providerOrder()) {
        try {
            const result = await providers[name][operation](...args);
            delete failedAt[name];
            return result;
        } catch (err) {
            lastError = err;
            if (err.code === 'NOT_FOUND') {
                notFound = err; // доставчикът работи, просто не знае този град
            } else {
                failedAt[name] = Date.now();
                console.warn(`[weather] ${name} failed, trying next provider:`, err.message);
            }
        }
    }
    throw notFound || lastError || new WeatherError('UNAVAILABLE', 'No weather provider available');
}

// query: { city } или { lat, lon }
export async function getCurrentWeather(query) {
    if (query.city) return withFallback('getCurrent', query);

    // По координати: реалното име на мястото е по-точно от името на метеостанцията.
    const [data, place] = await Promise.all([
        withFallback('getCurrent', query),
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

// opts.days (само Open-Meteo, до 16) — колко дни напред
export function getForecast(query, opts) {
    return withFallback('getForecast', query, opts);
}
