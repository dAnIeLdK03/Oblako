import React from 'react';
import RainChance from '../components/RainChance';
import { useLanguage } from '../LanguageContext.jsx';
import Logo from '../components/Logo.jsx';
import '../Weather.css';

function RainChancePage() {
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
    }
  };

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
        <RainChance weatherData={mockWeatherData} />
      </div>
    </div>
  );
}

export default RainChancePage; 