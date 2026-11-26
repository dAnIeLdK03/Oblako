import { useQuery } from '@tanstack/react-query';
import { Flower2, Wind } from 'lucide-react';
import { useLanguage } from '../LanguageContext.jsx';
import { airQualityQueryOptions } from '../hooks/weatherQueries.js';
import styles from './AirQuality.module.css';

// Горни граници на нивата по европейския индекс; над последната е най-лошото ниво
const AQI_LIMITS = [20, 40, 60, 80, 100];

// Ориентировъчни граници в зърна/m³: [умерено от, високо от]. Дърветата отделят повече полен
// от тревите и бурените, преди да предизвика оплаквания. Няма единна официална скала.
const POLLEN_LIMITS = {
  alder: [15, 90],
  birch: [15, 90],
  olive: [15, 90],
  grass: [5, 20],
  mugwort: [5, 20],
  ragweed: [5, 20],
};

const aqiLevel = (aqi) => {
  const index = AQI_LIMITS.findIndex((limit) => aqi <= limit);
  return index === -1 ? AQI_LIMITS.length + 1 : index + 1;
};

const pollenLevel = ({ type, value }) => {
  const [moderate, high] = POLLEN_LIMITS[type];
  if (value < 1) return 0;
  if (value < moderate) return 1;
  return value < high ? 2 : 3;
};

// Качество на въздуха и полен за мястото. Зарежда се отделно, за да не бави останалата страница.
function AirQuality({ place }) {
  const { t } = useLanguage();
  const { data, isLoading } = useQuery(airQualityQueryOptions(place));

  const pollutants = data
    ? [
        ['PM2.5', data.pm25],
        ['PM10', data.pm10],
        ['NO₂', data.no2],
        [t('airOzone'), data.o3],
        ['SO₂', data.so2],
      ].filter(([, value]) => value != null)
    : [];
  const activePollen = data?.pollen.filter((item) => pollenLevel(item) > 0) ?? [];

  return (
    <section className={styles.card} aria-labelledby="air-quality-title">
      <h2 id="air-quality-title" className={styles.heading}>
        <Wind size={20} className={styles.icon} aria-hidden="true" /> {t('airTitle')}
      </h2>

      {!data && <p className={styles.message}>{t(isLoading ? 'airLoading' : 'airError')}</p>}

      {data && (
        <>
          {data.aqi != null && (
            <div className={`${styles.index} ${styles[`aqi${aqiLevel(data.aqi)}`]}`}>
              <span className={styles.value}>{Math.round(data.aqi)}</span>
              <div>
                <strong>{t(`airLevel${aqiLevel(data.aqi)}`)}</strong>
                <div className={styles.caption}>{t('airIndex')}</div>
              </div>
            </div>
          )}

          <dl className={styles.grid}>
            {pollutants.map(([label, value]) => (
              <div key={label} className={styles.item}>
                <dt className={styles.caption}>{label}</dt>
                <dd>{Math.round(value)} μg/m³</dd>
              </div>
            ))}
          </dl>

          <h3 className={styles.subheading}>
            <Flower2 size={18} className={styles.icon} aria-hidden="true" /> {t('pollenTitle')}
          </h3>
          {activePollen.length ? (
            <dl className={styles.grid}>
              {activePollen.map((item) => (
                <div
                  key={item.type}
                  className={`${styles.item} ${styles[`pollen${pollenLevel(item)}`]}`}
                >
                  <dt className={styles.caption}>{t(`pollen_${item.type}`)}</dt>
                  <dd>{t(`pollenLevel${pollenLevel(item)}`)}</dd>
                </div>
              ))}
            </dl>
          ) : (
            <p className={styles.message}>
              {t(data.pollen.length ? 'pollenNone' : 'pollenNoData')}
            </p>
          )}

          <p className={styles.note}>{t('airSource')}</p>
        </>
      )}
    </section>
  );
}

export default AirQuality;
