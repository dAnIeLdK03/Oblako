import React from 'react';
import AirQuality from '../components/AirQuality';
import { useLanguage } from '../LanguageContext.jsx';
import Logo from '../components/Logo.jsx';
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
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px', marginBottom: '20px'}}>
          <Logo size="xlarge" showText={false} />
          <h1>{language === 'bg' ? 'Качество на въздуха' : 'Air Quality'}</h1>
        </div>
        <p>{language === 'bg' ? 'Индекс на качеството на въздуха и UV индекс' : 'Air quality index and UV index'}</p>
      </div>
      
      <div className="air-quality-content">
        <AirQuality weatherData={mockWeatherData} />
      </div>
    </div>
  );
}

export default AirQualityPage; 