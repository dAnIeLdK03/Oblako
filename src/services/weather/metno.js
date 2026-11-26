// @ts-check
// Резервен доставчик на прогнозата: MET Norway Locationforecast 2.0 (CC BY 4.0, без ключ).
// Връща същия модел като ./openmeteo.js. Разлики в самите данни:
//   - без видимост; вероятност за валежи само за Северна Европа (иначе null);
//   - UV за ясно небе; почасови стъпки за 2-3 дни, после през 6 часа; около 10 дни;
//   - времената са в UTC, затова часовата зона на мястото се подава отвън.
// Условия: https://api.met.no/doc/TermsOfService (до 4 знака след запетаята; без собствени
// заглавия, за да няма CORS preflight; браузърът сам спазва Expires и If-Modified-Since).
import { WeatherError } from './errors.js';
import { request } from './http.js';
import { sunTimes } from '../astronomy/index.js';

/** @typedef {import('./index.js').Forecast} Forecast */
/** @typedef {import('./index.js').Condition} Condition */
/** @typedef {import('./index.js').ConditionGroup} ConditionGroup */

export const NAME = 'metno';
const URL_BASE = 'https://api.met.no/weatherapi/locationforecast/2.0/complete';
const DAY = 86400;

// Отместване от UTC в секунди за дадения момент. Без позната зона: приблизително по дължината.
/**
 * @param {string | undefined} timeZone
 * @param {number} lon
 * @param {number} time  unix секунди
 */
function offsetFor(timeZone, lon, time) {
  if (timeZone) {
    try {
      const parts = Object.fromEntries(
        new Intl.DateTimeFormat('en-US', {
          timeZone,
          hourCycle: 'h23',
          year: 'numeric',
          month: 'numeric',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          second: 'numeric',
        })
          .formatToParts(time * 1000)
          .map((p) => [p.type, Number(p.value)]),
      );
      const { year, month, day, hour, minute, second } = parts;
      return Date.UTC(year, month - 1, day, hour, minute, second) / 1000 - Math.floor(time);
    } catch {
      // непозната зона
    }
  }
  return Math.round(lon / 15) * 3600;
}

// ---- Състояния: symbol_code -> собствен модел ----
// Кодовете са напр. "clearsky_day", "lightrainshowersandthunder_night", "heavysnow".
/**
 * @param {string} code
 * @returns {{ group: ConditionGroup, description: string, icon: string, severity: number }}
 */
function describe(code) {
  const name = code.split('_')[0];
  const result = (
    /** @type {ConditionGroup} */ group,
    /** @type {string} */ description,
    /** @type {string} */ icon,
    /** @type {number} */ severity,
  ) => ({ group, description, icon, severity });

  const level = name.startsWith('heavy') ? 2 : name.startsWith('light') ? 0 : 1;
  if (name.includes('thunder')) {
    const text = ['thunderstorm', 'thunderstorm with rain', 'thunderstorm with heavy rain'];
    return result('thunderstorm', text[level], '11', 80 + level);
  }
  const showers = name.includes('showers');
  if (name.includes('snow')) {
    const text = showers
      ? ['light shower snow', 'shower snow', 'heavy shower snow']
      : ['light snow', 'snow', 'heavy snow'];
    return result('snow', text[level], '13', 70 + level);
  }
  if (name.includes('sleet')) return result('rain', 'sleet', '13', 60 + level);
  if (name.includes('rain')) {
    const text = showers
      ? ['light intensity shower rain', 'shower rain', 'heavy intensity shower rain']
      : ['light rain', 'moderate rain', 'heavy intensity rain'];
    return result('rain', text[level], showers ? '09' : '10', 50 + level);
  }
  if (name === 'fog') return result('fog', 'fog', '50', 40);
  if (name === 'cloudy') return result('clouds', 'overcast clouds', '04', 30);
  if (name === 'partlycloudy') return result('clouds', 'scattered clouds', '03', 20);
  if (name === 'fair') return result('clouds', 'few clouds', '02', 10);
  return result('clear', 'clear sky', '01', 0);
}

/**
 * @param {string} code
 * @param {boolean} isDay
 * @returns {Condition}
 */
function condition(code, isDay) {
  const { group, description, icon } = describe(code);
  return { group, description, icon: `${icon}${isDay ? 'd' : 'n'}`, isDay };
}

const mean = (/** @type {number[]} */ list) =>
  list.length ? list.reduce((a, b) => a + b, 0) / list.length : 0;

// Средна посока като сбор от вектори (350° и 10° дават 0°, а не 180°)
const meanDirection = (/** @type {{ speed: number, deg: number }[]} */ winds) => {
  let x = 0;
  let y = 0;
  for (const { speed, deg } of winds) {
    x += speed * Math.cos((deg * Math.PI) / 180);
    y += speed * Math.sin((deg * Math.PI) / 180);
  }
  return Math.round((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
};

/**
 * @param {{ lat: number, lon: number }} coords
 * @param {{ days?: number, signal?: AbortSignal, timezone?: string }} [opts]
 * @returns {Promise<Forecast>}
 */
export async function fetchWeather({ lat, lon }, { days = 7, signal, timezone } = {}) {
  const data = await request(
    `${URL_BASE}?lat=${Number(lat).toFixed(4)}&lon=${Number(lon).toFixed(4)}`,
    NAME,
    signal,
  );
  const now = Math.floor(Date.now() / 1000);
  const utcOffset = offsetFor(timezone, lon, now);
  const place = { lat, lon, utcOffset };
  const dayNumber = (/** @type {number} */ t) => Math.floor((t + utcOffset) / DAY);
  const localIso = (/** @type {number} */ t) =>
    new Date((t + utcOffset) * 1000).toISOString().slice(0, 16);
  const isDayAt = (/** @type {number} */ t) => {
    const { sunrise, sunset, polar } = sunTimes(dayNumber(t), place);
    if (polar) return polar === 'day';
    return t >= Number(sunrise) && t < Number(sunset);
  };

  /** @type {{ time: number, data: any }[]} */
  const series = (data.properties?.timeseries ?? []).map((/** @type {any} */ item) => ({
    time: Date.parse(item.time) / 1000,
    data: item.data,
  }));

  // Всеки запис с периода, за който се отнася: следващият час или следващите 6 часа
  const entries = series.map(({ time, data: d }) => {
    const hours = d.next_1_hours ? 1 : d.next_6_hours ? 6 : 0;
    const period = d.next_1_hours ?? d.next_6_hours;
    const i = d.instant.details;
    return {
      time,
      hours,
      temp: i.air_temperature,
      feelsLike: i.apparent_air_temperature ?? i.air_temperature,
      humidity: i.relative_humidity,
      pressure: i.air_pressure_at_sea_level,
      windSpeed: i.wind_speed,
      windDeg: i.wind_from_direction,
      cloudCover: i.cloud_area_fraction,
      uv: i.ultraviolet_index_clear_sky,
      symbol: period?.summary?.symbol_code,
      rain: period?.details?.precipitation_amount ?? 0,
      probability: period?.details?.probability_of_precipitation ?? null,
      max: period?.details?.air_temperature_max,
      min: period?.details?.air_temperature_min,
    };
  });

  const currentEntry = entries.filter((e) => e.time <= now && e.symbol).pop() ?? entries[0];
  if (!currentEntry?.symbol) {
    throw new WeatherError('SERVER', `${NAME}: incomplete data`, { provider: NAME });
  }

  const hourly = entries
    .filter((e) => e.hours === 1 && e.time + 3600 > now)
    .map((e) => ({
      time: e.time,
      localTime: localIso(e.time),
      hour: new Date((e.time + utcOffset) * 1000).getUTCHours(),
      temp: e.temp,
      feelsLike: e.feelsLike,
      humidity: Math.round(e.humidity),
      pressure: e.pressure,
      visibility: null,
      windSpeed: e.windSpeed,
      windDeg: e.windDeg,
      precipProbability: e.probability,
      condition: condition(e.symbol, isDayAt(e.time)),
    }));

  const today = dayNumber(now);
  const numbers = [...new Set(entries.map((e) => dayNumber(e.time)))]
    .filter((day) => day >= today)
    // Последният ден често е само един-два записа: не стига за максимум и минимум
    .filter((day) => day === today || entries.filter((e) => dayNumber(e.time) === day).length > 2)
    .slice(0, days);

  const daily = numbers.map((day) => {
    const list = entries.filter((e) => dayNumber(e.time) === day);
    const temps = list.flatMap((e) =>
      // При 6-часовите стъпки екстремумите са между записите
      e.hours === 6 ? [e.temp, e.max ?? e.temp, e.min ?? e.temp] : [e.temp],
    );
    const feels = list.map((e) => e.feelsLike);
    const probabilities = list.flatMap((e) => (e.probability == null ? [] : [e.probability]));
    const symbols = list.flatMap((e) => (e.symbol ? [e.symbol] : []));
    const worst = symbols.sort((a, b) => describe(b).severity - describe(a).severity)[0];
    const uv = list.flatMap((e) => (e.uv == null ? [] : [e.uv]));
    const { sunrise, sunset } = sunTimes(day, place);
    const midnight = day * DAY - utcOffset;
    return {
      date: new Date(day * DAY * 1000).toISOString().slice(0, 10),
      tempMax: Math.max(...temps),
      tempMin: Math.min(...temps),
      feelsLikeMax: Math.max(...feels),
      feelsLikeMin: Math.min(...feels),
      humidity: Math.round(mean(list.map((e) => e.humidity))),
      pressure: Math.round(mean(list.map((e) => e.pressure))),
      visibility: null,
      windSpeed: Math.max(...list.map((e) => e.windSpeed)),
      windDeg: meanDirection(list.map((e) => ({ speed: e.windSpeed, deg: e.windDeg }))),
      precipProbability: probabilities.length ? Math.max(...probabilities) : null,
      precipSum: Math.round(list.reduce((sum, e) => sum + e.rain, 0) * 10) / 10,
      uvMax: uv.length ? Math.max(...uv) : 0,
      sunrise: sunrise ?? midnight, // полярен ден или нощ
      sunset: sunset ?? midnight,
      condition: condition(worst ?? currentEntry.symbol, true),
    };
  });

  const c = currentEntry;
  return {
    utcOffset,
    current: {
      time: now,
      localTime: localIso(now),
      temp: c.temp,
      feelsLike: c.feelsLike,
      humidity: Math.round(c.humidity),
      pressure: c.pressure,
      visibility: null,
      windSpeed: c.windSpeed,
      windDeg: c.windDeg,
      cloudCover: Math.round(c.cloudCover),
      uv: c.uv ?? 0,
      sunrise: daily[0].sunrise,
      sunset: daily[0].sunset,
      condition: condition(c.symbol, isDayAt(now)),
    },
    hourly,
    daily,
  };
}
