// Превръща feed-а на MeteoAlarm (CAP като JSON) в малък списък с активни предупреждения.
// Файлът е в api/_lib (префиксът _ го изключва от маршрутите на Vercel) и е чист: без мрежа и без Date.now().

const FEED_URL = 'https://feeds.meteoalarm.org/api/v1/warnings/feeds-bulgaria';

// awareness_type от MeteoAlarm -> име на вид опасност
const TYPES = {
  1: 'wind',
  2: 'snow-ice',
  3: 'thunderstorm',
  4: 'fog',
  5: 'high-temperature',
  6: 'low-temperature',
  7: 'coastal-event',
  8: 'forest-fire',
  9: 'avalanches',
  10: 'rain',
  11: 'flood',
  12: 'rain-flood',
};

// Стойност като "2; yellow; Moderate" или "1; Wind" -> числото отпред
const leadingNumber = (info, name) => {
  const value = info.parameter?.find((p) => p.valueName === name)?.value;
  return parseInt(String(value), 10);
};

const clip = (text, max = 300) => {
  const s = String(text || '')
    .replace(/\s+/g, ' ')
    .trim();
  return s.length > max ? `${s.slice(0, max - 1)}…` : s;
};

/**
 * @param {any} feed   отговорът на feeds.meteoalarm.org
 * @param {number} now  мс; изтеклите предупреждения се отхвърлят
 * @returns {Array<{
 *   id: string, type: string, level: number, from: number, to: number, regions: string[],
 *   event: { bg: string, en: string }, text: { bg: string, en: string }
 * }>}
 */
function transform(feed, now) {
  const alerts = [];
  for (const { alert } of feed?.warnings ?? []) {
    if (alert?.status !== 'Actual' || alert.msgType === 'Cancel') continue;
    const infos = alert.info ?? [];
    const bg = infos.find((i) => i.language?.toLowerCase().startsWith('bg'));
    const en = infos.find((i) => i.language?.toLowerCase().startsWith('en'));
    const base = en ?? bg ?? infos[0];
    if (!base) continue;

    const level = leadingNumber(base, 'awareness_level'); // 1 зелено ... 4 червено
    if (!(level >= 2)) continue; // зелено = "няма опасни явления"
    const to = Date.parse(base.expires);
    if (!(to > now)) continue;
    const from = Date.parse(base.onset || base.effective);

    const regions = [
      ...new Set(
        (base.area ?? [])
          .flatMap((a) => a.geocode ?? [])
          .filter((g) => g.valueName === 'NUTS3')
          .map((g) => g.value),
      ),
    ];
    if (!regions.length) continue;

    alerts.push({
      id: String(alert.identifier),
      type: TYPES[leadingNumber(base, 'awareness_type')] ?? 'other',
      level: Math.min(level, 4),
      from: Number.isFinite(from) ? from : now,
      to,
      regions,
      event: { bg: clip(bg?.event ?? en?.event, 120), en: clip(en?.event ?? bg?.event, 120) },
      text: {
        bg: clip(bg?.description ?? en?.description),
        en: clip(en?.description ?? bg?.description),
      },
    });
  }
  return alerts;
}

module.exports = { FEED_URL, transform };
