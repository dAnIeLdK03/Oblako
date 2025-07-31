import React from 'react';
import AirQuality from '../components/AirQuality';
import { useLanguage } from '../LanguageContext.jsx';
import '../Weather.css';

function AirQualityPage() {
  const { language } = useLanguage();

  // Mock weather data for the page
  const mockWeatherData = {
    main: {
      temp: 22,
      humidity: 65,
      pressure: 1013
    },
    weather: [{
      description: 'scattered clouds',
      icon: '03d'
    }],
    wind: {
      speed: 5,
      deg: 180
    },
    visibility: 10000,
    clouds: {
      all: 40
    },
    uvi: 3.5
  };

  return (
    <div className="air-quality-page">
      <div className="page-header">
        <h1>{language === 'bg' ? 'Качество на въздуха' : 'Air Quality'}</h1>
        <p>{language === 'bg' ? 'Индекс на качеството на въздуха и UV индекс' : 'Air quality index and UV index'}</p>
      </div>
      
      <div className="air-quality-content">
        <AirQuality weatherData={mockWeatherData} />
      </div>
    </div>
  );
}

export default AirQualityPage; 