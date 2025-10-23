import React, { useState, useEffect } from 'react';
import { useLanguage } from '../LanguageContext.jsx';
import { useTheme } from '../ThemeContext.jsx';
import UVIndex from '../components/UVIndex.jsx';
import Navigation from '../components/Navigation.jsx';
import Footer from '../components/Footer.jsx';

const UVIndexPage = () => {
  const { language, t } = useLanguage();
  const { theme } = useTheme();
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_KEY = "b5b3e21a258778d1168e59c1ccb83609";

  useEffect(() => {
    // Get current location weather for UV index
    const getCurrentWeather = async () => {
      setLoading(true);
      try {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            const res = await fetch(
              `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`
            );
            if (!res.ok) throw new Error('Failed to fetch weather data');
            const data = await res.json();
            setWeatherData(data);
          }, (error) => {
            console.error('Geolocation error:', error);
            setError(language === 'bg' ? 'Грешка при получаване на местоположението' : 'Error getting location');
          });
        } else {
          setError(language === 'bg' ? 'Геолокацията не се поддържа' : 'Geolocation not supported');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    getCurrentWeather();
  }, [language]);

  return (
    <>
      
      <div className={`app-container ${theme}`}>
        <Navigation />
        
        <div className="main-content">
          <div className="page-header">
            <h1>☀️ {language === 'bg' ? 'UV Индекс' : 'UV Index'}</h1>
            <p>{language === 'bg' ? 'Информация за ултравиолетовото лъчение и съвети за защита от слънцето' : 'Information about ultraviolet radiation and sun protection advice'}</p>
          </div>

          <div className="uv-index-page">
            {loading && (
              <div className="loading">
                <div className="loading-spinner"></div>
                <p>{language === 'bg' ? 'Зареждане на UV данни...' : 'Loading UV data...'}</p>
              </div>
            )}

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            {weatherData && (
              <div className="uv-content">
                <UVIndex weatherData={weatherData} />
                
                <div className="uv-info-section">
                  <h2>{language === 'bg' ? 'За UV индекса' : 'About UV Index'}</h2>
                  <div className="uv-info-grid">
                    <div className="uv-info-card">
                      <div className="info-icon">🟢</div>
                      <h3>{language === 'bg' ? 'Нисък (0-2)' : 'Low (0-2)'}</h3>
                      <p>{language === 'bg' ? 'Безопасно за престой на открито без защита' : 'Safe for outdoor activities without protection'}</p>
                    </div>
                    
                    <div className="uv-info-card">
                      <div className="info-icon">🟡</div>
                      <h3>{language === 'bg' ? 'Умерен (3-5)' : 'Moderate (3-5)'}</h3>
                      <p>{language === 'bg' ? 'Препоръчва се слънцезащитен крем SPF 30+' : 'Sunscreen SPF 30+ recommended'}</p>
                    </div>
                    
                    <div className="uv-info-card">
                      <div className="info-icon">🟠</div>
                      <h3>{language === 'bg' ? 'Висок (6-7)' : 'High (6-7)'}</h3>
                      <p>{language === 'bg' ? 'Ограничете престоя на слънце между 10:00-16:00' : 'Limit sun exposure between 10:00-16:00'}</p>
                    </div>
                    
                    <div className="uv-info-card">
                      <div className="info-icon">🟣</div>
                      <h3>{language === 'bg' ? 'Много висок (8-10)' : 'Very High (8-10)'}</h3>
                      <p>{language === 'bg' ? 'Останете в сянка и използвайте защита' : 'Stay in shade and use protection'}</p>
                    </div>
                    
                    <div className="uv-info-card">
                      <div className="info-icon">🔴</div>
                      <h3>{language === 'bg' ? 'Екстремен (11+)' : 'Extreme (11+)'}</h3>
                      <p>{language === 'bg' ? 'Останете на закрито между 10:00-16:00' : 'Stay indoors between 10:00-16:00'}</p>
                    </div>
                  </div>
                </div>

                <div className="uv-tips-section">
                  <h2>{language === 'bg' ? 'Съвети за защита от слънцето' : 'Sun Protection Tips'}</h2>
                  <div className="tips-grid">
                    <div className="tip-card">
                      <div className="tip-icon">🧴</div>
                      <h3>{language === 'bg' ? 'Слънцезащитен крем' : 'Sunscreen'}</h3>
                      <p>{language === 'bg' ? 'Използвайте крем с SPF 30+ и нанасяйте на всеки 2 часа' : 'Use SPF 30+ and reapply every 2 hours'}</p>
                    </div>
                    
                    <div className="tip-card">
                      <div className="tip-icon">👒</div>
                      <h3>{language === 'bg' ? 'Шапка и очила' : 'Hat and Sunglasses'}</h3>
                      <p>{language === 'bg' ? 'Носете шапка с широки периферии и UV очила' : 'Wear wide-brimmed hat and UV sunglasses'}</p>
                    </div>
                    
                    <div className="tip-card">
                      <div className="tip-icon">👕</div>
                      <h3>{language === 'bg' ? 'Защитна дреха' : 'Protective Clothing'}</h3>
                      <p>{language === 'bg' ? 'Носете лека дреха с дълги ръкави и панталони' : 'Wear light clothing with long sleeves and pants'}</p>
                    </div>
                    
                    <div className="tip-card">
                      <div className="tip-icon">⏰</div>
                      <h3>{language === 'bg' ? 'Време' : 'Timing'}</h3>
                      <p>{language === 'bg' ? 'Избягвайте слънцето между 10:00-16:00' : 'Avoid sun between 10:00-16:00'}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <Footer />
      </div>
    </>
  );
};

export default UVIndexPage; 