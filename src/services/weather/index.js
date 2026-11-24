// Единна входна точка за данни за времето. UI-ът ползва САМО този модул и модела по-долу.
// Конкретният API живее в ./openmeteo.js — за смяна се подменя само импортът по-долу.
//
// Модел (единици: °C, m/s, hPa, метри, unix секунди):
//   getWeather() -> {
//     provider, utcOffset,
//     place:   { name, named (false = само координати), country, lat, lon, utcOffset },
//     current: { time, localTime, temp, feelsLike, humidity, pressure, visibility,
//                windSpeed, windDeg, cloudCover, uv, sunrise, sunset, condition },
//     hourly:  [{ time, localTime, hour, temp, feelsLike, humidity, pressure, visibility,
//                 windSpeed, windDeg, precipProbability (0-100), condition }]   // стъпка 1 час
//     daily:   [{ date 'YYYY-MM-DD', tempMax, tempMin, feelsLikeMax, feelsLikeMin, humidity,
//                 pressure, visibility, windSpeed (макс.), windDeg, precipProbability (0-100),
//                 precipSum (mm), uvMax, sunrise, sunset, condition }]
//   }
//   condition: { group: clear|clouds|drizzle|rain|snow|thunderstorm|fog,
//                description (англ. текст), icon, isDay }
//   localTime е "YYYY-MM-DDTHH:mm" по часа на самото място (new Date(localTime) го показва правилно).
import * as provider from './openmeteo.js';
import { WeatherError, isAbortError } from './errors.js';

export { getIconUrl } from './icons.js';
export { WeatherError, isAbortError };

export const searchCity = (text, opts) => provider.searchCity(text, opts);

// "Sofia" или "Sofia, BG" / "Sofia, Bulgaria"
async function geocode(city, signal) {
  const [name, ...rest] = city.split(',').map((s) => s.trim());
  const hint = rest.join(' ').toLowerCase();
  const results = await provider.searchCity(name, { count: hint ? 10 : 1, signal });
  if (!results.length) throw new WeatherError('NOT_FOUND', 'City not found', { status: 404 });
  const match =
    hint && results.find((r) => [r.country, r.region].some((v) => v && v.toLowerCase() === hint));
  return match || results[0];
}

// query: { city } или { lat, lon }.  opts.days — дни напред (по подразбиране 7, до 16).
// opts.signal — AbortSignal; при отказ се хвърля AbortError (виж isAbortError).
export async function getWeather(query, { days = 7, signal } = {}) {
  let place;
  let weather;
  let named = true;
  if (query.city) {
    place = await geocode(query.city, signal);
    weather = await provider.fetchWeather(place, { days, signal });
  } else {
    // По координати: името на мястото се търси паралелно с времето.
    const [found, data] = await Promise.all([
      provider.reverseGeocode(query.lat, query.lon, { signal }),
      provider.fetchWeather(query, { days, signal }),
    ]);
    named = Boolean(found?.name);
    place = {
      name: found?.name || `${Number(query.lat).toFixed(2)}, ${Number(query.lon).toFixed(2)}`,
      country: found?.country || '',
      lat: query.lat,
      lon: query.lon,
    };
    weather = data;
  }
  return {
    provider: provider.NAME,
    utcOffset: weather.utcOffset,
    place: {
      name: place.name,
      named,
      country: place.country,
      lat: place.lat,
      lon: place.lon,
      utcOffset: weather.utcOffset,
    },
    current: weather.current,
    hourly: weather.hourly,
    daily: weather.daily,
  };
}
