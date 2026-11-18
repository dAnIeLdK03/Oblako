import { WeatherError } from './errors.js';
import { wmoToCondition } from './codes.js';

const PROVIDER = 'openmeteo';
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';
const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';

async function getJson(url) {
    let res;
    try {
        res = await fetch(url);
    } catch (err) {
        throw new WeatherError('UNAVAILABLE', err.message, { provider: PROVIDER });
    }
    if (!res.ok) {
        throw new WeatherError('UNAVAILABLE', `Open-Meteo HTTP ${res.status}`, { status: res.status, provider: PROVIDER });
    }
    return res.json();
}

// Търсене на населени места по текст. Връща до `count` резултата.
export async function searchCity(text, { count = 5 } = {}) {
    const name = text.trim();
    if (!name) return [];
    const data = await getJson(`${GEOCODING_URL}?name=${encodeURIComponent(name)}&count=${count}&language=en&format=json`);
    return (data.results || []).map((r) => ({
        name: r.name,
        country: r.country_code || '',
        region: r.admin1 || '',
        lat: r.latitude,
        lon: r.longitude,
    }));
}

// "Sofia" или "Sofia, BG" / "Sofia, Bulgaria"
async function geocode(city) {
    const [name, ...rest] = city.split(',').map((s) => s.trim());
    const hint = rest.join(' ').toLowerCase();
    const results = await searchCity(name, { count: hint ? 10 : 1 });
    if (!results.length) throw new WeatherError('NOT_FOUND', 'City not found', { status: 404, provider: PROVIDER });
    const r = (hint && results.find((x) => [x.country, x.region].some((v) => v && v.toLowerCase() === hint))) || results[0];
    return { name: r.name, country: r.country, lat: r.lat, lon: r.lon };
}

async function resolve(query) {
    if (query.city) return geocode(query.city);
    return { name: '', country: '', lat: query.lat, lon: query.lon };
}

export async function getCurrent(query) {
    const place = await resolve(query);
    const data = await getJson(
        `${FORECAST_URL}?latitude=${place.lat}&longitude=${place.lon}` +
        '&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,cloud_cover,pressure_msl,wind_speed_10m,wind_direction_10m,visibility' +
        '&daily=sunrise,sunset&wind_speed_unit=ms&timeformat=unixtime&timezone=auto&forecast_days=1'
    );
    const c = data.current;
    if (!c) throw new WeatherError('UNAVAILABLE', 'Open-Meteo: no current data', { provider: PROVIDER });
    return {
        provider: PROVIDER,
        coord: { lat: place.lat, lon: place.lon },
        weather: [wmoToCondition(c.weather_code, c.is_day === 1)],
        main: {
            temp: c.temperature_2m,
            feels_like: c.apparent_temperature,
            humidity: c.relative_humidity_2m,
            pressure: c.pressure_msl,
        },
        visibility: c.visibility ?? 10000,
        wind: { speed: c.wind_speed_10m, deg: c.wind_direction_10m },
        clouds: { all: c.cloud_cover },
        dt: c.time,
        sys: {
            country: place.country,
            sunrise: data.daily?.sunrise?.[0] ?? c.time,
            sunset: data.daily?.sunset?.[0] ?? c.time,
        },
        name: place.name,
    };
}

// Връща 3-часови записи във формата на OpenWeather /forecast (list[]), по локално време.
export async function getForecast(query, { days = 5 } = {}) {
    const place = await resolve(query);
    const data = await getJson(
        `${FORECAST_URL}?latitude=${place.lat}&longitude=${place.lon}` +
        '&hourly=temperature_2m,apparent_temperature,relative_humidity_2m,precipitation_probability,weather_code,pressure_msl,wind_speed_10m,wind_direction_10m,visibility,is_day' +
        `&wind_speed_unit=ms&timeformat=unixtime&timezone=auto&forecast_days=${days}`
    );
    const h = data.hourly;
    if (!h?.time) throw new WeatherError('UNAVAILABLE', 'Open-Meteo: no forecast data', { provider: PROVIDER });

    const offset = data.utc_offset_seconds || 0;
    const now = Math.floor(Date.now() / 1000);
    const list = [];
    h.time.forEach((t, i) => {
        const local = new Date((t + offset) * 1000);
        if (local.getUTCHours() % 3 !== 0) return; // 3-часова стъпка като OpenWeather
        if (t + 3600 <= now) return; // само бъдещи
        const temp = h.temperature_2m[i];
        list.push({
            dt: t,
            dt_txt: local.toISOString().replace('T', ' ').slice(0, 19),
            main: {
                temp,
                feels_like: h.apparent_temperature[i],
                temp_min: temp,
                temp_max: temp,
                humidity: h.relative_humidity_2m[i],
                pressure: h.pressure_msl[i],
            },
            weather: [wmoToCondition(h.weather_code[i], h.is_day[i] === 1)],
            wind: { speed: h.wind_speed_10m[i], deg: h.wind_direction_10m[i] },
            visibility: h.visibility[i],
            pop: (h.precipitation_probability[i] ?? 0) / 100,
        });
    });

    return {
        provider: PROVIDER,
        list,
        city: { name: place.name, country: place.country, coord: { lat: place.lat, lon: place.lon } },
    };
}

