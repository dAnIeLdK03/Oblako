import React, { useState, useEffect } from 'react';
import { Sunrise, Sunset, Sun } from 'lucide-react';
import { useLanguage } from '../LanguageContext.jsx';
import styles from './SunriseSunset.module.css';

function SunriseSunset({ weatherData }) {
  const { t } = useLanguage();
  const [countdown, setCountdown] = useState('');
  const [nextEvent, setNextEvent] = useState('');

  useEffect(() => {
    if (!weatherData?.current) return;

    const updateCountdown = () => {
      const now = new Date();
      const currentTime = Math.floor(now.getTime() / 1000);

      const sunrise = weatherData.current.sunrise;
      const sunset = weatherData.current.sunset;

      let targetTime, eventType;

      if (currentTime < sunrise) {
        targetTime = sunrise;
        eventType = 'sunrise';
      } else if (currentTime < sunset) {
        targetTime = sunset;
        eventType = 'sunset';
      } else {
        targetTime = sunrise + 24 * 60 * 60;
        eventType = 'sunrise';
      }

      setNextEvent(eventType);

      const timeDiff = targetTime - currentTime;

      if (timeDiff <= 0) {
        setCountdown('00:00:00');
        return;
      }

      const hours = Math.floor(timeDiff / 3600);
      const minutes = Math.floor((timeDiff % 3600) / 60);
      const seconds = timeDiff % 60;

      setCountdown(
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`,
      );
    };

    updateCountdown();

    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [weatherData]);

  if (!weatherData?.current) return null;

  const formatTime = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  const sunrise = weatherData.current.sunrise;
  const sunset = weatherData.current.sunset;

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

      {/*Countdown Timer*/}
      <div className={styles['countdown-container']}>
        <div className={styles['countdown-header']}>
          <span className={styles['countdown-label']}>
            {nextEvent === 'sunrise' ? <Sunrise size={16} /> : <Sunset size={16} />}{' '}
            {t('nextEvent')}:
          </span>
          <span className={styles['next-event-name']}>
            {nextEvent === 'sunrise' ? t('sunrise') : t('sunset')}
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

      {/*Day Length*/}
      <div className={styles['day-length']}>
        <span className={styles['day-length-label']}>
          <Sun size={16} /> {t('dayLength')}:
        </span>
        <span className={styles['day-length-value']}>
          {(() => {
            const dayLengthSeconds = sunset - sunrise;
            const hours = Math.floor(dayLengthSeconds / 3600);
            const minutes = Math.floor((dayLengthSeconds % 3600) / 60);
            return `${hours}h ${minutes}m`;
          })()}
        </span>
      </div>
    </div>
  );
}

export default SunriseSunset;
