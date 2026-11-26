// @ts-check
// Предупреждения за времето: официални (MeteoAlarm/НИМХ, само България, през /api/alerts)
// и собствени по прогнозата (computeAlerts, за всяко място). Тук са типовете и сливането им.
import { BG_REGIONS } from './regions.js';
export { computeAlerts, THRESHOLDS } from './thresholds.js';
export { BG_REGIONS };

/**
 * @typedef {'wind' | 'thunderstorm' | 'snow-ice' | 'rain' | 'high-temperature' | 'low-temperature'
 *   | 'fog' | 'coastal-event' | 'forest-fire' | 'avalanches' | 'flood' | 'rain-flood' | 'other'} AlertType
 *
 * @typedef {object} Alert
 * @property {string} id
 * @property {'official' | 'forecast'} source
 * @property {AlertType} type
 * @property {1 | 2 | 3 | 4} level   1 информация, 2 жълто, 3 оранжево, 4 червено
 * @property {number} from           мс (UTC)
 * @property {number} to             мс (UTC)
 * @property {number} [value]        само "forecast": екстремната стойност (m/s, mm или °C)
 * @property {{ bg: string, en: string }} [event]  само "official": заглавие от НИМХ
 * @property {{ bg: string, en: string }} [text]   само "official": описание от НИМХ
 *
 * @typedef {object} OfficialFeedAlert  един запис от /api/alerts
 * @property {string} id
 * @property {AlertType} type
 * @property {1 | 2 | 3 | 4} level
 * @property {number} from
 * @property {number} to
 * @property {string[]} regions         NUTS3 кодове, напр. "BG411"
 * @property {{ bg: string, en: string }} event
 * @property {{ bg: string, en: string }} text
 *
 * @typedef {object} OfficialFeed
 * @property {string} updated
 * @property {OfficialFeedAlert[]} alerts
 */

/**
 * Официалните предупреждения за цяла България (малък JSON, еднакъв за всички).
 * @param {AbortSignal} [signal]
 * @returns {Promise<OfficialFeed>}
 */
export async function fetchOfficialAlerts(signal) {
  const res = await fetch('/api/alerts', { signal });
  if (!res.ok) throw new Error(`alerts HTTP ${res.status}`);
  const data = await res.json(); // хвърля, ако не е JSON (напр. в dev сървъра, където няма /api)
  if (!Array.isArray(data?.alerts)) throw new Error('alerts: invalid response');
  return data;
}

/**
 * Активните официални предупреждения за областта (ISO код като "BG-22").
 * @param {OfficialFeed} feed
 * @param {string} regionCode
 * @param {number} now  мс
 * @returns {Alert[]}
 */
export function officialAlertsFor(feed, regionCode, now) {
  const nuts = BG_REGIONS[regionCode]?.nuts;
  if (!nuts) return [];
  return feed.alerts
    .filter((a) => a.regions.includes(nuts) && a.to > now)
    .map((a) => ({
      id: a.id,
      source: /** @type {const} */ ('official'),
      type: a.type,
      level: a.level,
      from: a.from,
      to: a.to,
      event: a.event,
      text: a.text,
    }));
}

/**
 * Официалните са първи. Собствено предупреждение от същия вид се скрива, ако официалното
 * е поне толкова високо (да не се показва едно и също два пъти).
 * @param {Alert[]} official
 * @param {Alert[]} computed
 * @returns {Alert[]}
 */
export function mergeAlerts(official, computed) {
  const rest = computed.filter(
    (c) => !official.some((o) => o.type === c.type && o.level >= c.level),
  );
  return [...official, ...rest].sort((a, b) => b.level - a.level || a.from - b.from);
}
