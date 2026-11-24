import React from 'react';
import RainChance from '../components/RainChance';
import { useLanguage } from '../LanguageContext.jsx';
import Logo from '../components/Logo.jsx';
import { useWeather } from '../hooks/useWeather.js';
import { useSeo } from '../hooks/useSeo.js';
import styles from './RainChancePage.module.css';

function RainChancePage() {
  const { language } = useLanguage();
  const { weather: weatherData, loading, error } = useWeather({ fallbackCity: 'Sofia' });
  useSeo('rain', { city: weatherData?.place.named ? weatherData.place.name : undefined });

  return (
    <div className={styles['rain-chance-page']}>
      <div className="page-header">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '15px',
            marginBottom: '20px',
          }}
        >
          <Logo size="xlarge" showText={false} />
          <h1>{language === 'bg' ? 'Вероятност за валежи' : 'Rain Probability'}</h1>
        </div>
        <p>
          {language === 'bg'
            ? 'Детайлна информация за валежите'
            : 'Detailed precipitation information'}
        </p>
      </div>

      <div className={styles['rain-chance-content']}>
        {loading && (
          <div className="loading">
            <div className="loading-spinner"></div>
            <p>{language === 'bg' ? 'Зареждане на данни за валежи...' : 'Loading rain data...'}</p>
          </div>
        )}

        {error && <div className="error-message">{error}</div>}

        {weatherData && <RainChance weatherData={weatherData} />}

        {!loading && !error && !weatherData && (
          <div className={styles['no-data']}>
            <p>{language === 'bg' ? 'Няма данни за времето' : 'No weather data available'}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default RainChancePage;
