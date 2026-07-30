import React from 'react';
import { Sun } from 'lucide-react';
import { useLanguage } from '../LanguageContext.jsx';
import { useTheme } from '../ThemeContext.jsx';

const UVIndex = ({ weatherData }) => {
  const { language } = useLanguage();
  const { convertTemperature, getTemperatureSymbol } = useTheme();

  // Calculate UV index based on time of day and weather conditions
  const calculateUVIndex = () => {
    if (!weatherData) return null;

    const hour = new Date(weatherData.dt * 1000).getHours();
    const weatherMain = weatherData.weather[0]?.main?.toLowerCase();
    const clouds = weatherData.clouds?.all || 0;

    // Base UV calculation (simplified)
    let baseUV = 0;
    
    // Time-based UV (highest at noon)
    if (hour >= 10 && hour <= 16) {
      baseUV = 8; // High UV during peak hours
    } else if (hour >= 7 && hour <= 9 || hour >= 17 && hour <= 19) {
      baseUV = 5; // Medium UV during morning/evening
    } else {
      baseUV = 2; // Low UV during early morning/late evening
    }

    // Weather condition adjustments
    if (weatherMain === 'clear' || weatherMain === 'clear sky') {
      baseUV = Math.round(baseUV * 1.2);
    } else if (weatherMain === 'clouds' || weatherMain === 'scattered clouds') {
      baseUV = Math.round(baseUV * 0.8);
    } else if (weatherMain === 'rain' || weatherMain === 'drizzle') {
      baseUV = Math.round(baseUV * 0.6);
    } else if (weatherMain === 'snow') {
      baseUV = Math.round(baseUV * 0.4);
    }

    // Cloud coverage adjustment
    if (clouds > 80) {
      baseUV = Math.round(baseUV * 0.7);
    } else if (clouds > 50) {
      baseUV = Math.round(baseUV * 0.85);
    }

    return Math.max(0, Math.min(11, baseUV));
  };

  const getUVLevel = (uvIndex) => {
    if (uvIndex <= 2) return { level: 'low', color: '#4CAF50' };
    if (uvIndex <= 5) return { level: 'moderate', color: '#FF9800' };
    if (uvIndex <= 7) return { level: 'high', color: '#FF5722' };
    if (uvIndex <= 10) return { level: 'very_high', color: '#9C27B0' };
    return { level: 'extreme', color: '#F44336' };
  };

  const getUVAdvice = (uvIndex, level) => {
    const advice = {
      low: {
        bg: language === 'bg' ? 'Нисък UV индекс - безопасно за престой на открито' : 'Low UV index - safe for outdoor activities',
        en: language === 'bg' ? 'Можете да сте на открито без защита' : 'You can be outdoors without protection'
      },
      moderate: {
        bg: language === 'bg' ? 'Умерен UV индекс - използвайте слънцезащитен крем' : 'Moderate UV index - use sunscreen',
        en: language === 'bg' ? 'Препоръчва се слънцезащитен крем SPF 30+' : 'Sunscreen SPF 30+ recommended'
      },
      high: {
        bg: language === 'bg' ? 'Висок UV индекс - ограничете престоя на слънце' : 'High UV index - limit sun exposure',
        en: language === 'bg' ? 'Избягвайте слънцето между 10:00-16:00' : 'Avoid sun between 10:00-16:00'
      },
      very_high: {
        bg: language === 'bg' ? 'Много висок UV индекс - избягвайте слънцето' : 'Very high UV index - avoid sun exposure',
        en: language === 'bg' ? 'Останете в сянка и използвайте защита' : 'Stay in shade and use protection'
      },
      extreme: {
        bg: language === 'bg' ? 'Екстремен UV индекс - избягвайте открито' : 'Extreme UV index - avoid outdoors',
        en: language === 'bg' ? 'Останете на закрито между 10:00-16:00' : 'Stay indoors between 10:00-16:00'
      }
    };
    return advice[level];
  };

  const uvIndex = calculateUVIndex();
  if (!uvIndex) return null;

  const uvLevel = getUVLevel(uvIndex);
  const uvAdvice = getUVAdvice(uvIndex, uvLevel.level);

  return (
    <div className="uv-index-card">
      <div className="uv-header">
        <div className="uv-icon"><Sun size={22} /></div>
        <h3>{language === 'bg' ? 'UV Индекс' : 'UV Index'}</h3>
      </div>
      
      <div className="uv-content">
        <div className="uv-display">
          <div className="uv-value" style={{ color: uvLevel.color }}>
            {uvIndex}
          </div>
          <div className="uv-level">
            <span className="uv-level-dot" style={{ backgroundColor: uvLevel.color }} />
            <span className="uv-level-text">
              {language === 'bg' ? 
                (uvLevel.level === 'low' ? 'Нисък' :
                 uvLevel.level === 'moderate' ? 'Умерен' :
                 uvLevel.level === 'high' ? 'Висок' :
                 uvLevel.level === 'very_high' ? 'Много висок' : 'Екстремен') :
                uvLevel.level.charAt(0).toUpperCase() + uvLevel.level.slice(1).replace('_', ' ')
              }
            </span>
          </div>
        </div>

        <div className="uv-bar">
          <div 
            className="uv-bar-fill" 
            style={{ 
              width: `${(uvIndex / 11) * 100}%`,
              backgroundColor: uvLevel.color 
            }}
          ></div>
        </div>

        <div className="uv-advice">
          <div className="advice-main">{uvAdvice.bg}</div>
          <div className="advice-detail">{uvAdvice.en}</div>
        </div>

        <div className="uv-details">
          <div className="detail-item">
            <span className="detail-label">{language === 'bg' ? 'Време' : 'Time'}</span>
            <span className="detail-value">{new Date(weatherData.dt * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">{language === 'bg' ? 'Времето' : 'Weather'}</span>
            <span className="detail-value">{weatherData.weather[0]?.description}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">{language === 'bg' ? 'Облаци' : 'Clouds'}</span>
            <span className="detail-value">{weatherData.clouds?.all || 0}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UVIndex; 