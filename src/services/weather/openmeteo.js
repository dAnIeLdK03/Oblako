// @ts-check
// Основният доставчик (Open-Meteo + BigDataCloud). Само файловете на доставчиците знаят за конкретните
// API-та; резервният за прогнозата е ./metno.js. За смяна на API този файл трябва да експортира:
//   NAME, searchCity(text, {count}), reverseGeocode(lat, lon), fetchWeather({lat, lon}, {days}),
//   fetchAirQuality({lat, lon})
// и да връща данни в собствения модел (виж index.js). Единици: °C, m/s, hPa, метри, unix секунди.
import { WeatherError, isAbortError } from './errors.js';
import { request } from './http.js';

/** @typedef {import('./index.js').Forecast} Forecast */
/** @typedef {import('./index.js').CityMatch} CityMatch */
/** @typedef {import('./index.js').Condition} Condition */
/** @typedef {import('./index.js').ConditionGroup} ConditionGroup */
/** @typedef {import('./index.js').ReverseResult} ReverseResult */
/** @typedef {import('./index.js').AirQuality} AirQuality */

export const NAME = 'openmeteo';
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';
const AIR_QUALITY_URL = 'https://air-quality-api.open-meteo.com/v1/air-quality';
const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const REVERSE_URL = 'https://api.bigdatacloud.net/data/reverse-geocode-client';

// Повторните опити, кешът и дедупликацията са в TanStack Query (src/hooks/weatherQueries.js).
const getJson = (/** @type {string} */ url, /** @type {AbortSignal | undefined} */ signal) =>
  request(url, NAME, signal);

// ---- Състояния: WMO код -> собствен модел { group, description, icon, isDay } ----
// group: clear | clouds | drizzle | rain | snow | thunderstorm | fog
// icon: име на файл в public/weather-icons (без d/n за иконите, които нямат нощен вариант)
/** @type {Record<number, [ConditionGroup, string, string]>} */
const WMO = {
  0: ['clear', 'clear sky', '01'],
  1: ['clouds', 'few clouds', '02'],
  2: ['clouds', 'scattered clouds', '03'],
  3: ['clouds', 'overcast clouds', '04'],
  45: ['fog', 'fog', '50'],
  48: ['fog', 'fog', '50'],
  51: ['drizzle', 'light intensity drizzle', '09'],
  53: ['drizzle', 'drizzle', '09'],
  55: ['drizzle', 'heavy intensity drizzle', '09'],
  56: ['rain', 'freezing rain', '13'],
  57: ['rain', 'freezing rain', '13'],
  61: ['rain', 'light rain', '10'],
  63: ['rain', 'moderate rain', '10'],
  65: ['rain', 'heavy intensity rain', '10'],
  66: ['rain', 'freezing rain', '13'],
  67: ['rain', 'freezing rain', '13'],
  71: ['snow', 'light snow', '13'],
  73: ['snow', 'snow', '13'],
  75: ['snow', 'heavy snow', '13'],
  77: ['snow', 'light snow', '13'],
  80: ['rain', 'light intensity shower rain', '09'],
  81: ['rain', 'shower rain', '09'],
  82: ['rain', 'heavy intensity shower rain', '09'],
  85: ['snow', 'light shower snow', '13'],
  86: ['snow', 'heavy shower snow', '13'],
  95: ['thunderstorm', 'thunderstorm', '11'],
  96: ['thunderstorm', 'thunderstorm with rain', '11'],
  99: ['thunderstorm', 'thunderstorm with heavy rain', '11'],
};

/**
 * @param {number} code  WMO код
 * @param {boolean} [isDay]
 * @returns {Condition}
 */
function condition(code, isDay = true) {
  const [group, description, base] = WMO[code] || WMO[0];
  return { group, description, icon: `${base}${isDay ? 'd' : 'n'}`, isDay };
}

// ---- Геокодиране ----
/**
 * @param {string} text
 * @param {{ count?: number, signal?: AbortSignal }} [opts]
 * @returns {Promise<CityMatch[]>}
 */
export async function searchCity(text, { count = 5, signal } = {}) {
  const name = text.trim();
  if (!name) return [];
  const data = await getJson(
    `${GEOCODING_URL}?name=${encodeURIComponent(name)}&count=${count}&language=en&format=json`,
    signal,
  );
  return (data.results || []).map((r) => ({
    name: r.name,
    country: r.country_code || '',
    region: r.admin1 || '',
    lat: r.latitude,
    lon: r.longitude,
    timezone: r.timezone,
  }));
}

/**
 * @param {number} lat
 * @param {number} lon
 * @param {{ signal?: AbortSignal }} [opts]
 * @returns {Promise<ReverseResult | null>}
 */
export async function reverseGeocode(lat, lon, { signal } = {}) {
  try {
    const d = await getJson(
      `${REVERSE_URL}?latitude=${lat}&longitude=${lon}&localityLanguage=en`,
      signal,
    );
    const name = d.city || d.locality || d.principalSubdivision;
    const timezone = d.localityInfo?.informative?.find(
      (/** @type {any} */ item) => item.description === 'time zone',
    )?.name;
    return name
      ? {
          name,
          country: d.countryCode || '',
          regionCode: d.principalSubdivisionCode || undefined,
          timezone,
        }
      : null;
  } catch (err) {
    if (isAbortError(err)) throw err; // отмяната трябва да стигне до извикващия
    return null; // името е допълнително — без него продължаваме
  }
}

// ---- Времето ----
const mean = (arr) => (arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : null);

/**
 * @param {{ lat: number, lon: number }} coords
 * @param {{ days?: number, signal?: AbortSignal }} [opts]
 * @returns {Promise<Forecast>}
 */
export async function fetchWeather({ lat, lon }, { days = 7, signal } = {}) {
  const data = await getJson(
    `${FORECAST_URL}?latitude=${lat}&longitude=${lon}` +
      '&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,cloud_cover,pressure_msl,wind_speed_10m,wind_direction_10m,visibility,uv_index' +
      '&hourly=temperature_2m,apparent_temperature,relative_humidity_2m,precipitation_probability,weather_code,pressure_msl,wind_speed_10m,wind_direction_10m,visibility,is_day' +
      '&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,precipitation_probability_max,precipitation_sum,wind_speed_10m_max,wind_direction_10m_dominant,uv_index_max,sunrise,sunset' +
      `&wind_speed_unit=ms&timeformat=unixtime&timezone=auto&forecast_days=${days}`,
    signal,
  );
  const { current: c, hourly: h, daily: d } = data;
  if (!c || !h?.time || !d?.time) {
    throw new WeatherError('SERVER', `${NAME}: incomplete data`, { provider: NAME });
  }

  const utcOffset = data.utc_offset_seconds || 0;
  const localIso = (t) => new Date((t + utcOffset) * 1000).toISOString().slice(0, 16); // YYYY-MM-DDTHH:mm

  const allHourly = h.time.map((t, i) => ({
    time: t,
    localTime: localIso(t),
    hour: new Date((t + utcOffset) * 1000).getUTCHours(),
    temp: h.temperature_2m[i],
    feelsLike: h.apparent_temperature[i],
    humidity: h.relative_humidity_2m[i],
    pressure: h.pressure_msl[i],
    visibility: h.visibility[i],
    windSpeed: h.wind_speed_10m[i],
    windDeg: h.wind_direction_10m[i],
    precipProbability: h.precipitation_probability[i] ?? 0,
    condition: condition(h.weather_code[i], h.is_day[i] === 1),
  }));

  const daily = d.time.map((t, i) => {
    const date = localIso(t).slice(0, 10);
    const hours = allHourly.filter((x) => x.localTime.startsWith(date));
    return {
      date,
      tempMax: d.temperature_2m_max[i],
      tempMin: d.temperature_2m_min[i],
      feelsLikeMax: d.apparent_temperature_max[i],
      feelsLikeMin: d.apparent_temperature_min[i],
      humidity: Math.round(mean(hours.map((x) => x.humidity)) ?? 0),
      pressure: Math.round(mean(hours.map((x) => x.pressure)) ?? 0),
      visibility: Math.round(mean(hours.map((x) => x.visibility)) ?? 0),
      windSpeed: d.wind_speed_10m_max[i],
      windDeg: d.wind_direction_10m_dominant[i],
      precipProbability: d.precipitation_probability_max[i] ?? 0,
      precipSum: d.precipitation_sum[i] ?? 0,
      uvMax: d.uv_index_max[i] ?? 0,
      sunrise: d.sunrise[i],
      sunset: d.sunset[i],
      condition: condition(d.weather_code[i], true),
    };
  });

  const now = c.time;
  return {
    utcOffset,
    current: {
      time: now,
      localTime: localIso(now),
      temp: c.temperature_2m,
      feelsLike: c.apparent_temperature,
      humidity: c.relative_humidity_2m,
      pressure: c.pressure_msl,
      visibility: c.visibility ?? 10000,
      windSpeed: c.wind_speed_10m,
      windDeg: c.wind_direction_10m,
      cloudCover: c.cloud_cover,
      uv: c.uv_index ?? 0,
      sunrise: daily[0].sunrise ?? now,
      sunset: daily[0].sunset ?? now,
      condition: condition(c.weather_code, c.is_day === 1),
    },
    hourly: allHourly.filter((x) => x.time + 3600 > now), // от текущия час нататък
    daily,
  };
}

// ---- Качество на въздуха и полен (CAMS) ----
const POLLEN_TYPES = ['alder', 'birch', 'grass', 'mugwort', 'olive', 'ragweed'];

/**
 * @param {{ lat: number, lon: number }} coords
 * @param {{ signal?: AbortSignal }} [opts]
 * @returns {Promise<AirQuality>}
 */
export async function fetchAirQuality({ lat, lon }, { signal } = {}) {
  const data = await getJson(
    `${AIR_QUALITY_URL}?latitude=${lat}&longitude=${lon}` +
      '&current=european_aqi,pm2_5,pm10,nitrogen_dioxide,ozone,sulphur_dioxide,' +
      POLLEN_TYPES.map((type) => `${type}_pollen`).join(',') +
      '&timezone=auto&timeformat=unixtime',
    signal,
  );
  const c = data.current;
  if (!c) throw new WeatherError('SERVER', `${NAME}: incomplete data`, { provider: NAME });

  return {
    aqi: c.european_aqi ?? null,
    pm25: c.pm2_5 ?? null,
    pm10: c.pm10 ?? null,
    no2: c.nitrogen_dioxide ?? null,
    o3: c.ozone ?? null,
    so2: c.sulphur_dioxide ?? null,
    // Извън Европа поленът е null (няма данни), а извън сезона е 0
    pollen: POLLEN_TYPES.flatMap((type) => {
      const value = c[`${type}_pollen`];
      return value == null ? [] : [{ type, value }];
    }),
  };
}
