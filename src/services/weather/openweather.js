import { WeatherError } from './errors.js';

const PROVIDER = 'openweather';
const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const BASE = 'https://api.openweathermap.org/data/2.5';

function locationParams(query) {
    return query.city
        ? `q=${encodeURIComponent(query.city)}`
        : `lat=${query.lat}&lon=${query.lon}`;
}

async function getJson(endpoint, query) {
    if (!API_KEY) throw new WeatherError('UNAVAILABLE', 'OpenWeather key missing', { provider: PROVIDER });
    let res;
    try {
        res = await fetch(`${BASE}/${endpoint}?${locationParams(query)}&units=metric&appid=${API_KEY}`);
    } catch (err) {
        throw new WeatherError('UNAVAILABLE', err.message, { provider: PROVIDER });
    }
    if (res.status === 404) throw new WeatherError('NOT_FOUND', 'City not found', { status: 404, provider: PROVIDER });
    if (!res.ok) throw new WeatherError('UNAVAILABLE', `OpenWeather HTTP ${res.status}`, { status: res.status, provider: PROVIDER });
    const data = await res.json();
    return { ...data, provider: PROVIDER };
}

export const getCurrent = (query) => getJson('weather', query);
export const getForecast = (query) => getJson('forecast', query);
export const isAvailable = () => Boolean(API_KEY);
