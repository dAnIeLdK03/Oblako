// @ts-check
// Собствени предупреждения по прогнозата (за всяко място по света, не само България).
// Прагове в стил MeteoAlarm: ниво 2 жълто, 3 оранжево, 4 червено; ниво 1 е само информация.
// Всичко е в THRESHOLDS, за да се настройва на едно място. Функцията е чиста: "сега" се подава отвън.

/** @typedef {import('./index.js').Alert} Alert */
/** @typedef {import('../weather/index.js').WeatherData} WeatherData */

export const THRESHOLDS = {
  /** Средна скорост на вятъра на 10 м, m/s: [жълто, оранжево, червено] (14 m/s ≈ 50 km/h) */
  windMs: [14, 20, 25],
  /** Валеж за денонощие, mm */
  rainMm: [30, 50, 80],
  /** Максимална температура за деня, °C */
  heatC: [35, 38, 41],
  /** Минимална температура за деня, °C (по-ниска = по-високо ниво) */
  coldC: [-10, -15, -20],
  /** Минимална температура под това дава само информация (ниво 1) */
  freezingC: 0,
  /** Колко напред гледаме, часове */
  horizonHours: 48,
};

const HOUR = 3600 * 1000;

/**
 * Ниво 2..4 според праговете; 0 ако не е достигнат първият.
 * @param {number} value
 * @param {number[]} limits  във възходящ ред на тежестта
 * @param {boolean} [higherIsWorse]
 */
function levelFor(value, limits, higherIsWorse = true) {
  let level = 0;
  limits.forEach((limit, i) => {
    if (higherIsWorse ? value >= limit : value <= limit) level = i + 2;
  });
  return level;
}

/**
 * @param {WeatherData} weather
 * @param {number} [now]  мс; по подразбиране моментът на данните
 * @returns {Alert[]}
 */
export function computeAlerts(weather, now = weather.current.time * 1000) {
  const end = now + THRESHOLDS.horizonHours * HOUR;
  /** @type {Alert[]} */
  const alerts = [];

  /** @param {Omit<Alert, 'id' | 'source'>} a */
  const add = (a) => alerts.push({ id: `forecast:${a.type}`, source: 'forecast', ...a });

  // ---- По часове: вятър, гръмотевици, сняг/лед ----
  const hours = weather.hourly.filter((h) => h.time * 1000 < end);
  const span = (/** @type {typeof hours} */ list) => ({
    from: Math.max(now, list[0].time * 1000),
    to: list[list.length - 1].time * 1000 + HOUR,
  });

  const windy = hours.filter((h) => levelFor(h.windSpeed, THRESHOLDS.windMs) >= 2);
  if (windy.length) {
    const peak = Math.max(...windy.map((h) => h.windSpeed));
    add({
      type: 'wind',
      level: /** @type {Alert['level']} */ (levelFor(peak, THRESHOLDS.windMs)),
      value: peak,
      ...span(windy),
    });
  }

  const storms = hours.filter((h) => h.condition.group === 'thunderstorm');
  if (storms.length) {
    const severe = storms.some((h) => /heavy/.test(h.condition.description));
    add({ type: 'thunderstorm', level: severe ? 3 : 2, ...span(storms) });
  }

  const icy = hours.filter(
    (h) =>
      (h.condition.group === 'snow' && /heavy/.test(h.condition.description)) ||
      /freezing rain/.test(h.condition.description),
  );
  if (icy.length) add({ type: 'snow-ice', level: 2, ...span(icy) });

  // ---- По дни: валеж, жега, студ ----
  const days = weather.daily
    .map((d) => {
      const start = Date.parse(`${d.date}T00:00:00Z`) - weather.utcOffset * 1000; // полунощ на мястото
      return { ...d, from: Math.max(now, start), to: start + 24 * HOUR };
    })
    .filter((d) => d.from < end && d.to > now);
  const daySpan = (/** @type {typeof days} */ list) => ({
    from: list[0].from,
    to: list[list.length - 1].to,
  });

  const rainy = days.filter((d) => levelFor(d.precipSum, THRESHOLDS.rainMm) >= 2);
  if (rainy.length) {
    const peak = Math.max(...rainy.map((d) => d.precipSum));
    add({
      type: 'rain',
      level: /** @type {Alert['level']} */ (levelFor(peak, THRESHOLDS.rainMm)),
      value: peak,
      ...daySpan(rainy),
    });
  }

  const hot = days.filter((d) => levelFor(d.tempMax, THRESHOLDS.heatC) >= 2);
  if (hot.length) {
    const peak = Math.max(...hot.map((d) => d.tempMax));
    add({
      type: 'high-temperature',
      level: /** @type {Alert['level']} */ (levelFor(peak, THRESHOLDS.heatC)),
      value: peak,
      ...daySpan(hot),
    });
  }

  const cold = days.filter((d) => levelFor(d.tempMin, THRESHOLDS.coldC, false) >= 2);
  if (cold.length) {
    const low = Math.min(...cold.map((d) => d.tempMin));
    add({
      type: 'low-temperature',
      level: /** @type {Alert['level']} */ (levelFor(low, THRESHOLDS.coldC, false)),
      value: low,
      ...daySpan(cold),
    });
  } else {
    const frosty = days.filter((d) => d.tempMin < THRESHOLDS.freezingC);
    if (frosty.length) {
      add({
        type: 'low-temperature',
        level: 1,
        value: Math.min(...frosty.map((d) => d.tempMin)),
        ...daySpan(frosty),
      });
    }
  }

  return alerts;
}
