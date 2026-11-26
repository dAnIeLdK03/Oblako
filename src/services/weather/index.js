// @ts-check
// Единна входна точка за данни за времето. UI-ът ползва САМО този модул и модела по-долу.
// Конкретният API живее в ./openmeteo.js — за смяна се подменя само импортът по-долу.
//
// Единици: °C, m/s, hPa, метри, unix секунди. localTime е "YYYY-MM-DDTHH:mm" по часа на самото
// място (new Date(localTime) го показва правилно). Типовете са JSDoc, проверяват се от редактора
// (// @ts-check); ползват се така:  /** @type {import('../services/weather/index.js').WeatherData} */

/**
 * @typedef {'clear' | 'clouds' | 'drizzle' | 'rain' | 'snow' | 'thunderstorm' | 'fog'} ConditionGroup
 *
 * @typedef {object} Condition
 * @property {ConditionGroup} group
 * @property {string} description  английски текст, напр. "light rain"
 * @property {string} icon         напр. "10d"; подава се на getIconUrl()
 * @property {boolean} isDay
 *
 * @typedef {object} Place
 * @property {string} name
 * @property {boolean} named       false = известни са само координатите (името е "42.70, 23.32")
 * @property {string} country
 * @property {number} lat
 * @property {number} lon
 * @property {number} utcOffset
 * @property {string} [regionCode]  ISO 3166-2 на областта, напр. "BG-22" (ако е известна); за предупреждения
 *
 * @typedef {object} CurrentWeather
 * @property {number} time         unix секунди
 * @property {string} localTime
 * @property {number} temp
 * @property {number} feelsLike
 * @property {number} humidity
 * @property {number} pressure
 * @property {number} visibility
 * @property {number} windSpeed
 * @property {number} windDeg
 * @property {number} cloudCover
 * @property {number} uv
 * @property {number} sunrise      unix секунди
 * @property {number} sunset       unix секунди
 * @property {Condition} condition
 *
 * @typedef {object} HourlyPoint   стъпка 1 час
 * @property {number} time
 * @property {string} localTime
 * @property {number} hour         час на мястото (0-23)
 * @property {number} temp
 * @property {number} feelsLike
 * @property {number} humidity
 * @property {number} pressure
 * @property {number} visibility
 * @property {number} windSpeed
 * @property {number} windDeg
 * @property {number} precipProbability  0-100
 * @property {Condition} condition
 *
 * @typedef {object} DailyPoint
 * @property {string} date         "YYYY-MM-DD"
 * @property {number} tempMax
 * @property {number} tempMin
 * @property {number} feelsLikeMax
 * @property {number} feelsLikeMin
 * @property {number} humidity
 * @property {number} pressure
 * @property {number} visibility
 * @property {number} windSpeed    максималната за деня
 * @property {number} windDeg
 * @property {number} precipProbability  0-100
 * @property {number} precipSum    mm
 * @property {number} uvMax
 * @property {number} sunrise
 * @property {number} sunset
 * @property {Condition} condition
 *
 * @typedef {object} Forecast      това връща доставчикът (openmeteo.js)
 * @property {number} utcOffset
 * @property {CurrentWeather} current
 * @property {HourlyPoint[]} hourly
 * @property {DailyPoint[]} daily
 *
 * @typedef {Forecast & { provider: string, place: Place }} WeatherData   това връща getWeather()
 *
 * @typedef {{ city: string, lat?: undefined, lon?: undefined }
 *   | { city?: undefined, lat: number, lon: number }} WeatherQuery   град ИЛИ координати
 *
 * @typedef {'alder' | 'birch' | 'grass' | 'mugwort' | 'olive' | 'ragweed'} PollenType
 *
 * @typedef {object} AirQuality     текущи стойности; null = няма данни
 * @property {number | null} aqi    европейски индекс за качество на въздуха (0 = най-чист)
 * @property {number | null} pm25   μg/m³ (както и следващите четири)
 * @property {number | null} pm10
 * @property {number | null} no2
 * @property {number | null} o3
 * @property {number | null} so2
 * @property {{ type: PollenType, value: number }[]} pollen  зърна/m³; празно = мястото не се покрива
 *
 * @typedef {object} ReverseResult  резултат от определяне на място по координати
 * @property {string} name
 * @property {string} country
 * @property {string} [regionCode]
 *
 * @typedef {object} CityMatch     резултат от търсене на град
 * @property {string} name
 * @property {string} country
 * @property {string} region
 * @property {number} lat
 * @property {number} lon
 */

import * as provider from './openmeteo.js';
import { WeatherError, isAbortError } from './errors.js';

export { getIconUrl } from './icons.js';
export { WeatherError, isAbortError };

/**
 * @param {string} text
 * @param {{ count?: number, signal?: AbortSignal }} [opts]
 * @returns {Promise<CityMatch[]>}
 */
export const searchCity = (text, opts) => provider.searchCity(text, opts);

/**
 * @param {{ lat: number, lon: number }} coords
 * @param {{ signal?: AbortSignal }} [opts]
 * @returns {Promise<AirQuality>}
 */
export const getAirQuality = (coords, opts) => provider.fetchAirQuality(coords, opts);

// "Sofia" или "Sofia, BG" / "Sofia, Bulgaria"
/**
 * @param {string} city
 * @param {AbortSignal} [signal]
 * @returns {Promise<CityMatch>}
 */
async function geocode(city, signal) {
  const [name, ...rest] = city.split(',').map((s) => s.trim());
  const hint = rest.join(' ').toLowerCase();
  const results = await provider.searchCity(name, { count: hint ? 10 : 1, signal });
  if (!results.length) throw new WeatherError('NOT_FOUND', 'City not found', { status: 404 });
  const match =
    hint && results.find((r) => [r.country, r.region].some((v) => v && v.toLowerCase() === hint));
  return match || results[0];
}

/**
 * query: { city } или { lat, lon }.  opts.days — дни напред (по подразбиране 7, до 16).
 * opts.signal — AbortSignal; при отказ се хвърля AbortError (виж isAbortError).
 * @param {WeatherQuery} query
 * @param {{ days?: number, signal?: AbortSignal }} [opts]
 * @returns {Promise<WeatherData>}
 */
export async function getWeather(query, { days = 7, signal } = {}) {
  let place;
  let weather;
  let named = true;
  let regionCode;
  if (query.city) {
    place = await geocode(query.city, signal);
    // Областта е нужна само за официалните предупреждения, които имаме за България
    const [data, found] = await Promise.all([
      provider.fetchWeather(place, { days, signal }),
      place.country === 'BG' ? provider.reverseGeocode(place.lat, place.lon, { signal }) : null,
    ]);
    weather = data;
    regionCode = found?.regionCode;
  } else {
    // По координати: името на мястото се търси паралелно с времето.
    // (Заявка без град е заявка по координати; празен град не е валидна заявка.)
    const { lat, lon } = /** @type {{ lat: number, lon: number }} */ (query);
    const [found, data] = await Promise.all([
      provider.reverseGeocode(lat, lon, { signal }),
      provider.fetchWeather({ lat, lon }, { days, signal }),
    ]);
    named = Boolean(found?.name);
    regionCode = found?.regionCode;
    place = {
      name: found?.name || `${Number(lat).toFixed(2)}, ${Number(lon).toFixed(2)}`,
      country: found?.country || '',
      lat,
      lon,
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
      regionCode,
    },
    current: weather.current,
    hourly: weather.hourly,
    daily: weather.daily,
  };
}
