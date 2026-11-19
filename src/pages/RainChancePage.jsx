import React, { useState, useEffect } from 'react';
import RainChance from '../components/RainChance';
import { useLanguage } from '../LanguageContext.jsx';
import Logo from '../components/Logo.jsx';
import '../Weather.css';
import { getWeather, isAbortError } from '../services/weather';
import { weatherErrorMessage } from '../utils/weatherErrors.js';

function RainChancePage() {
  const { language, t } = useLanguage();
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    try {
      if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            setWeatherData(await getWeather({ lat: latitude, lon: longitude }, { signal: controller.signal }));
          } catch (err) {
            if (!isAbortError(err)) setError(weatherErrorMessage(err, t));
          }
        }, (error) => {
          console.error('Geolocation error:', error);
          setError(language === 'bg' ? 'Грешка при получаване на местоположението' : 'Error getting location');
        });
      } else {
        setError(language === 'bg' ? 'Геолокацията не се поддържа' : 'Geolocation not supported');
      }
    } finally {
      setLoading(false);
    }
    return () => controller.abort();
  }, [language]);

  return (
    <div className="rain-chance-page">
      <div className="page-header">
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px', marginBottom: '20px'}}>
          <Logo size="xlarge" showText={false} />
          <h1>{language === 'bg' ? 'Вероятност за валежи' : 'Rain Probability'}</h1>
        </div>
        <p>{language === 'bg' ? 'Детайлна информация за валежите' : 'Detailed precipitation information'}</p>
      </div>
      
      <div className="rain-chance-content">
        {loading && (
          <div className="loading">
            <div className="loading-spinner"></div>
            <p>{language === 'bg' ? 'Зареждане на данни за валежи...' : 'Loading rain data...'}</p>
          </div>
        )}

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {weatherData && (
          <RainChance weatherData={weatherData} />
        )}

        {!loading && !error && !weatherData && (
          <div className="no-data">
            <p>{language === 'bg' ? 'Няма данни за времето' : 'No weather data available'}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default RainChancePage; 