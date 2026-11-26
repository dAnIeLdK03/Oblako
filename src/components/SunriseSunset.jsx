import { useState, useEffect } from 'react';
import { Sunrise, Sunset, Sun } from 'lucide-react';
import { useLanguage } from '../LanguageContext.jsx';
import MoonPhase from './MoonPhase.jsx';
import { sunTimes } from '../services/astronomy/index.js';
import styles from './SunriseSunset.module.css';

const DAY = 24 * 60 * 60;
const currentSeconds = () => Math.floor(Date.now() / 1000);
const pad = (value) => value.toString().padStart(2, '0');

// Следващият изгрев или залез. Гледа и съседните дни; в полярните ширини може да няма скорошен.
function findNextEvent(now, today, place) {
  for (let day = today - 1; day <= today + 2; day++) {
    const { sunrise, sunset } = sunTimes(day, place);
    if (sunrise > now) return { type: 'sunrise', time: sunrise };
    if (sunset > now) return { type: 'sunset', time: sunset };
  }
  return null;
}

// Всичко се изчислява на устройството по координатите на мястото (без заявки).
function SunriseSunset({ weatherData }) {
  const { t } = useLanguage();
  const [now, setNow] = useState(currentSeconds);

  useEffect(() => {
    const interval = setInterval(() => setNow(currentSeconds()), 1000);
    return () => clearInterval(interval);
  }, []);

  if (!weatherData?.place) return null;

  const { place, utcOffset } = weatherData;
  const today = Math.floor((now + utcOffset) / DAY); // датата на самото място
  const { sunrise, sunset, dayLength, polar } = sunTimes(today, place);
  const next = findNextEvent(now, today, place);

  // Часът е по времето на мястото, а не по часовата зона на браузъра
  const formatTime = (timestamp) =>
    timestamp == null ? '—' : new Date((timestamp + utcOffset) * 1000).toISOString().slice(11, 16);

  const timeDiff = next ? next.time - now : 0;
  const countdown = `${pad(Math.floor(timeDiff / 3600))}:${pad(Math.floor((timeDiff % 3600) / 60))}:${pad(timeDiff % 60)}`;

  return (
    <div className="sunrise-sunset-container">
      <h3 className={styles['sun-title']}>
        <Sunrise size={20} className={styles['sun-title-icon']} /> {t('sunriseSunset')}
      </h3>

      <div className={styles['sun-info-grid']}>
        {/*Sunrise*/}
        <div className={styles['sun-info-item']}>
          <div className={`${styles['sun-icon']} ${styles['sunrise-icon']}`}>
            <Sunrise size={24} />
          </div>
          <div className={styles['sun-details']}>
            <span className={styles['sun-label']}>{t('sunrise')}</span>
            <span className={styles['sun-time']}>{formatTime(sunrise)}</span>
          </div>
        </div>

        {/*Sunset*/}
        <div className={styles['sun-info-item']}>
          <div className={`${styles['sun-icon']} ${styles['sunset-icon']}`}>
            <Sunset size={24} />
          </div>
          <div className={styles['sun-details']}>
            <span className={styles['sun-label']}>{t('sunset')}</span>
            <span className={styles['sun-time']}>{formatTime(sunset)}</span>
          </div>
        </div>
      </div>

      {polar && (
        <p className={styles['polar-note']}>{t(polar === 'day' ? 'polarDay' : 'polarNight')}</p>
      )}

      {/*Countdown Timer*/}
      {next && (
        <div className={styles['countdown-container']}>
          <div className={styles['countdown-header']}>
            <span className={styles['countdown-label']}>
              {next.type === 'sunrise' ? <Sunrise size={16} /> : <Sunset size={16} />}{' '}
              {t('nextEvent')}:
            </span>
            <span className={styles['next-event-name']}>
              {next.type === 'sunrise' ? t('sunrise') : t('sunset')}
            </span>
          </div>

          <div className={styles['countdown-timer']}>
            <div className={styles['countdown-display']}>{countdown}</div>
            <div className={styles['countdown-units']}>
              <span>{t('hours')}</span>
              <span>{t('minutes')}</span>
              <span>{t('seconds')}</span>
            </div>
          </div>
        </div>
      )}

      {/*Day Length*/}
      <div className={styles['day-length']}>
        <span className={styles['day-length-label']}>
          <Sun size={16} /> {t('dayLength')}:
        </span>
        <span className={styles['day-length-value']}>
          {Math.floor(dayLength / 3600)}h {Math.floor((dayLength % 3600) / 60)}m
        </span>
      </div>

      <MoonPhase now={now} place={place} utcOffset={utcOffset} />
    </div>
  );
}

export default SunriseSunset;
