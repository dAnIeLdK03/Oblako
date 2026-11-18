// Локални SVG икони от public/weather-icons (собствени файлове, без външни заявки).
// Само 01, 02 и 10 имат различни варианти за ден (d) и нощ (n).
const DAY_NIGHT_ICONS = new Set(['01', '02', '10']);

// Приема condition.icon от модела (напр. "10d", "04n", "50d").
export function getIconUrl(iconCode) {
    const base = String(iconCode || '03').slice(0, 2);
    const night = String(iconCode).endsWith('n') ? 'n' : 'd';
    const file = DAY_NIGHT_ICONS.has(base) ? `${base}${night}` : base;
    return `${import.meta.env.BASE_URL}weather-icons/${file}.svg`;
}
