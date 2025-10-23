import React, { useState, useEffect } from 'react';
import RainChance from '../components/RainChance';
import { useLanguage } from '../LanguageContext.jsx';
import Logo from '../components/Logo.jsx';
import '../Weather.css';

function RainChancePage() {
  const { language } = useLanguage();
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const API_KEY = "b5b3e21a258778d1168e59c1ccb83609";

  useEffect(() => {
    setLoading(true);
    try {
      if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const res = await fetch(
              `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`
            );
            if(!res.ok) throw new Error("Failed to fetch weather data");
            const data = await res.json();
            setWeatherData(data);
          } catch (err) {
            setError(err.message);
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