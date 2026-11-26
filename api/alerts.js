// Vercel Function: официалните предупреждения за България от MeteoAlarm (НИМХ).
// Нужна е, защото feed-ът на MeteoAlarm няма CORS заглавия и браузърът не може да го чете директно.
// Не получава никакви данни от потребителя (без параметри): връща всички области, а
// приложението избира своята. Така един отговор се кешира в CDN-а за всички (5 минути).
const { FEED_URL, transform } = require('./_lib/meteoalarm.js');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.setHeader('Allow', 'GET, HEAD');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const upstream = await fetch(FEED_URL, {
      signal: AbortSignal.timeout(8000),
      headers: {
        accept: 'application/json',
        'user-agent': 'Oblako-alerts/1.0 (+https://oblako17.online)',
      },
    });
    if (!upstream.ok) throw new Error(`MeteoAlarm HTTP ${upstream.status}`);
    const feed = await upstream.json();

    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=900');
    return res.status(200).json({
      source: 'MeteoAlarm (NIMH)',
      license: 'CC BY 4.0',
      updated: new Date().toISOString(),
      alerts: transform(feed, Date.now()),
    });
  } catch {
    res.setHeader('Cache-Control', 'no-store');
    return res.status(502).json({ error: 'Alerts are temporarily unavailable' });
  }
};
