import {
  CloudFog,
  CloudLightning,
  CloudRain,
  Flame,
  Info,
  Mountain,
  Snowflake,
  ThermometerSnowflake,
  ThermometerSun,
  TriangleAlert,
  Waves,
  Wind,
} from 'lucide-react';
import { useLanguage } from '../LanguageContext.jsx';
import { useTheme } from '../ThemeContext.jsx';
import { useAlerts } from '../hooks/useAlerts.js';
import { BG_REGIONS } from '../services/alerts/index.js';
import styles from './WeatherAlerts.module.css';

const ICONS = {
  wind: Wind,
  thunderstorm: CloudLightning,
  'snow-ice': Snowflake,
  rain: CloudRain,
  'high-temperature': ThermometerSun,
  'low-temperature': ThermometerSnowflake,
  fog: CloudFog,
  'coastal-event': Waves,
  'forest-fire': Flame,
  avalanches: Mountain,
  flood: Waves,
  'rain-flood': CloudRain,
};

// Предупрежденията за показаното място: официални (България) и собствени по прогнозата.
function WeatherAlerts({ weather }) {
  const { language, t } = useLanguage();
  const { convertTemperature, getTemperatureSymbol } = useTheme();
  const { alerts, regionCode, hasOfficial } = useAlerts(weather);

  if (!alerts.length) return null;

  const locale = language === 'bg' ? 'bg-BG' : 'en-GB';
  // Часовете са по времето на самото място (като localTime в модела)
  const formatTime = (ms) =>
    new Date(ms + weather.utcOffset * 1000).toLocaleString(locale, {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'UTC',
    });

  const title = (alert) => {
    if (alert.source === 'official' && alert.event) return alert.event[language] || alert.event.en;
    const key = alert.type === 'low-temperature' && alert.level === 1 ? 'freezing' : alert.type;
    return t(`alertType_${key}`);
  };

  const detail = (alert) => {
    if (alert.source === 'official') return alert.text?.[language] || alert.text?.en || '';
    const v = alert.value;
    if (v == null) return '';
    if (alert.type === 'wind') return `${t('alertUpTo')} ${Math.round(v * 3.6)} km/h`;
    if (alert.type === 'rain')
      return `${t('alertUpTo')} ${Math.round(v)} mm ${t('alertRainPerDay')}`;
    if (alert.type === 'high-temperature' || alert.type === 'low-temperature') {
      const word = alert.type === 'high-temperature' ? t('alertUpTo') : t('alertDownTo');
      return `${word} ${convertTemperature(v)}${getTemperatureSymbol()}`;
    }
    return '';
  };

  const region = regionCode && BG_REGIONS[regionCode];

  return (
    <section className={styles.alerts} aria-labelledby="weather-alerts-title">
      <h2 id="weather-alerts-title" className={styles.heading}>
        <TriangleAlert size={18} aria-hidden="true" /> {t('alertsTitle')}
        {region && (
          <span className={styles.region}>
            {' '}
            · {t('alertsRegion')} {region[language]}
          </span>
        )}
      </h2>

      <ul className={styles.list}>
        {alerts.map((alert) => {
          const Icon = ICONS[alert.type] || (alert.level === 1 ? Info : TriangleAlert);
          const text = detail(alert);
          return (
            <li key={alert.id} className={`${styles.item} ${styles[`level${alert.level}`]}`}>
              <Icon size={22} className={styles.icon} aria-hidden="true" />
              <div className={styles.body}>
                <div className={styles.top}>
                  <strong>{title(alert)}</strong>
                  <span className={styles.chip}>{t(`alertLevel${alert.level}`)}</span>
                </div>
                {text && <div className={styles.detail}>{text}</div>}
                <div className={styles.meta}>
                  {formatTime(alert.from)} – {formatTime(alert.to)} ·{' '}
                  {alert.source === 'official'
                    ? t('alertSourceOfficial')
                    : t('alertSourceForecast')}
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <p className={styles.note}>
        {hasOfficial && <>{t('alertsAttribution')} </>}
        {alerts.some((a) => a.source === 'forecast') && t('alertsDisclaimer')}
      </p>
    </section>
  );
}

export default WeatherAlerts;
