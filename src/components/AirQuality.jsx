import React from 'react';
import { useLanguage } from '../LanguageContext.jsx';
import { useTheme } from '../ThemeContext.jsx';

function AirQuality({ weatherData }) {
  const { language } = useLanguage();
  const { convertTemperature, getTemperatureSymbol } = useTheme();

  if (!weatherData) return null;

  const getAirQualityLevel = (aqi) => {
    if (aqi <= 50) return { level: language === 'bg' ? 'Добро' : 'Good', color: '#4CAF50', bg: 'rgba(76, 175, 80, 0.1)' };
    if (aqi <= 100) return { level: language === 'bg' ? 'Умерено' : 'Moderate', color: '#FF9800', bg: 'rgba(255, 152, 0, 0.1)' };
    if (aqi <= 150) return { level: language === 'bg' ? 'Лошо за чувствителни групи' : 'Unhealthy for Sensitive Groups', color: '#F44336', bg: 'rgba(244, 67, 54, 0.1)' };
    if (aqi <= 200) return { level: language === 'bg' ? 'Лошо' : 'Unhealthy', color: '#9C27B0', bg: 'rgba(156, 39, 176, 0.1)' };
    return { level: language === 'bg' ? 'Много лошо' : 'Very Unhealthy', color: '#795548', bg: 'rgba(121, 85, 72, 0.1)' };
  };

  const getUVLevel = (uvi) => {
    if (uvi < 3) return { level: language === 'bg' ? 'Нисък' : 'Low', color: '#4CAF50', advice: language === 'bg' ? 'Безопасно за престой на открито' : 'Safe for outdoor activities' };
    if (uvi < 6) return { level: language === 'bg' ? 'Умерен' : 'Moderate', color: '#FF9800', advice: language === 'bg' ? 'Използвайте слънцезащитни средства' : 'Use sunscreen' };
    if (uvi < 8) return { level: language === 'bg' ? 'Висок' : 'High', color: '#F44336', advice: language === 'bg' ? 'Ограничете престоя на слънце' : 'Limit sun exposure' };
    if (uvi < 11) return { level: language === 'bg' ? 'Много висок' : 'Very High', color: '#9C27B0', advice: language === 'bg' ? 'Избягвайте слънчевите часове' : 'Avoid peak sun hours' };
    return { level: language === 'bg' ? 'Екстремен' : 'Extreme', color: '#795548', advice: language === 'bg' ? 'Избягвайте престоя на открито' : 'Avoid outdoor activities' };
  };

  const getComfortIndex = (temp, humidity) => {
    let comfort = 'comfortable';
    let advice = '';
    
    if (temp > 30 && humidity > 70) {
      comfort = 'uncomfortable';
      advice = language === 'bg' ? 'Горещо и влажно - неприятно' : 'Hot and humid - uncomfortable';
    } else if (temp < 10 && humidity > 80) {
      comfort = 'uncomfortable';
      advice = language === 'bg' ? 'Студено и влажно - неприятно' : 'Cold and humid - uncomfortable';
    } else if (temp >= 18 && temp <= 25 && humidity >= 40 && humidity <= 60) {
      comfort = 'comfortable';
      advice = language === 'bg' ? 'Идеални условия' : 'Ideal conditions';
    } else if (temp > 25) {
      comfort = 'warm';
      advice = language === 'bg' ? 'Топло, но приятно' : 'Warm but pleasant';
    } else {
      comfort = 'cool';
      advice = language === 'bg' ? 'Хладно, но приятно' : 'Cool but pleasant';
    }
    
    return { comfort, advice };
  };

  // Mock data - в реалност това ще идва от API
  const mockData = {
    aqi: 45, // Air Quality Index
    uv: weatherData.uvi || 3.5, // UV Index
    pollen: 2.3, // Pollen count
    pressure: weatherData.main.pressure,
    visibility: weatherData.visibility / 1000,
    comfort: getComfortIndex(weatherData.main.temp, weatherData.main.humidity)
  };

  const airQuality = getAirQualityLevel(mockData.aqi);
  const uvLevel = getUVLevel(mockData.uv);

  return (
    <div className="air-quality">
      <h3>{language === 'bg' ? 'Качество на въздуха' : 'Air Quality'}</h3>
      
      <div className="aq-grid">
        {/* Air Quality Index */}
        <div className="aq-card" style={{ borderLeftColor: airQuality.color }}>
          <div className="aq-icon">🌬️</div>
          <div className="aq-content">
            <div className="aq-label">{language === 'bg' ? 'Индекс на качеството на въздуха' : 'Air Quality Index'}</div>
            <div className="aq-value" style={{ color: airQuality.color }}>
              {mockData.aqi}
            </div>
            <div className="aq-level">{airQuality.level}</div>
          </div>
        </div>

        {/* UV Index */}
        <div className="aq-card" style={{ borderLeftColor: uvLevel.color }}>
          <div className="aq-icon">☀️</div>
          <div className="aq-content">
            <div className="aq-label">{language === 'bg' ? 'UV индекс' : 'UV Index'}</div>
            <div className="aq-value" style={{ color: uvLevel.color }}>
              {mockData.uv.toFixed(1)}
            </div>
            <div className="aq-level">{uvLevel.level}</div>
          </div>
        </div>

        {/* Pollen Count */}
        <div className="aq-card">
          <div className="aq-icon">🌸</div>
          <div className="aq-content">
            <div className="aq-label">{language === 'bg' ? 'Прашни зърна' : 'Pollen Count'}</div>
            <div className="aq-value">
              {mockData.pollen}
            </div>
            <div className="aq-level">{language === 'bg' ? 'Нисък' : 'Low'}</div>
          </div>
        </div>

        {/* Atmospheric Pressure */}
        <div className="aq-card">
          <div className="aq-icon">📊</div>
          <div className="aq-content">
            <div className="aq-label">{language === 'bg' ? 'Атмосферно налягане' : 'Atmospheric Pressure'}</div>
            <div className="aq-value">
              {mockData.pressure} hPa
            </div>
            <div className="aq-level">{language === 'bg' ? 'Нормално' : 'Normal'}</div>
          </div>
        </div>

        {/* Visibility */}
        <div className="aq-card">
          <div className="aq-icon">👁️</div>
          <div className="aq-content">
            <div className="aq-label">{language === 'bg' ? 'Видимост' : 'Visibility'}</div>
            <div className="aq-value">
              {mockData.visibility.toFixed(1)} km
            </div>
            <div className="aq-level">{language === 'bg' ? 'Добра' : 'Good'}</div>
          </div>
        </div>

        {/* Comfort Index */}
        <div className="aq-card">
          <div className="aq-icon">😊</div>
          <div className="aq-content">
            <div className="aq-label">{language === 'bg' ? 'Комфорт' : 'Comfort'}</div>
            <div className="aq-value">
              {mockData.comfort.comfort === 'comfortable' ? '😊' : 
               mockData.comfort.comfort === 'warm' ? '😌' : 
               mockData.comfort.comfort === 'cool' ? '😐' : '😰'}
            </div>
            <div className="aq-level">{language === 'bg' ? 'Приятно' : 'Pleasant'}</div>
          </div>
        </div>
      </div>

      {/* Advice Section */}
      <div className="aq-advice">
        <h4>{language === 'bg' ? 'Съвети за деня' : 'Today\'s Advice'}</h4>
        <div className="advice-list">
          <div className="advice-item">
            <span className="advice-icon">🌬️</span>
            <span>{airQuality.level} - {language === 'bg' ? 'Времето е подходящо за открити дейности' : 'Weather is suitable for outdoor activities'}</span>
          </div>
          <div className="advice-item">
            <span className="advice-icon">☀️</span>
            <span>{uvLevel.advice}</span>
          </div>
          <div className="advice-item">
            <span className="advice-icon">😊</span>
            <span>{mockData.comfort.advice}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AirQuality; 