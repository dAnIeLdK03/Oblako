import React, { useState, useEffect } from 'react';
import { Droplet, Wind } from 'lucide-react';
import { useLanguage } from '../LanguageContext.jsx';
import { useTheme } from '../ThemeContext.jsx';
import Logo from '../components/Logo.jsx';
import DetailedDayForecast from '../components/DetailedDayForecast.jsx';
import '../Weather.css';
import { getIconUrl } from '../services/weather';
import { useWeather } from '../hooks/useWeather.js';

function ForecastPage() {
  const { language, t } = useLanguage();
  const { convertTemperature, getTemperatureSymbol } = useTheme();
  const [cityInput, setCityInput] = useState('');
  const [selectedDay, setSelectedDay] = useState(null);

  const { weather, loading, error, searchCity } = useWeather({ fallbackCity: 'Sofia' });
  const forecast = weather ? weather.daily.slice(0, 13) : [];

  // Полето следва показаното място (при търсене, споделен линк или навигация)
  useEffect(() => {
    if (weather) setCityInput(weather.place.name);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weather?.place.name]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = {
      weekday: 'long',
      month: 'short',
      day: 'numeric'
    };
    return date.toLocaleDateString(language === 'bg' ? 'bg-BG' : 'en-US', options);
  };

  const getWeatherIcon = (iconCode) => {
    return getIconUrl(iconCode);
  };

  const getWeatherDescription = (description) => {
    const descriptions = {
      'clear sky': language === 'bg' ? 'Ясно' : 'Clear sky',
      'few clouds': language === 'bg' ? 'Леки облаци' : 'Few clouds',
      'scattered clouds': language === 'bg' ? 'Разпръснати облаци' : 'Scattered clouds',
      'broken clouds': language === 'bg' ? 'Разкъсани облаци' : 'Broken clouds',
      'shower rain': language === 'bg' ? 'Дъжд' : 'Shower rain',
      'rain': language === 'bg' ? 'Дъжд' : 'Rain',
      'thunderstorm': language === 'bg' ? 'Буря' : 'Thunderstorm',
      'snow': language === 'bg' ? 'Сняг' : 'Snow',
      'mist': language === 'bg' ? 'Мъгла' : 'Mist'
    };
    return descriptions[description.toLowerCase()] || description;
  };

  return (
    <div className="forecast-page">
      <div className="page-header">
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px', marginBottom: '20px'}}>
                     <Logo size="xlarge" showText={false} />
                     <h1>{language === 'bg' ? '10-дневна прогноза' : '10-Day Forecast'}</h1>
         </div>
         <p>{language === 'bg' ? 'Детайлна прогноза за следващите 10 дни' : 'Detailed forecast for the next 10 days'}</p>
        
                 {/* City Selector */}
         <div className="city-selector">
           <input
             type="text"
             value={cityInput}
             onChange={(e) => setCityInput(e.target.value)}
             onKeyDown={(e) => e.key === 'Enter' && searchCity(cityInput)}
             placeholder={language === 'bg' ? 'Въведете град...' : 'Enter city...'}
             className="city-input"
           />
           <button 
             onClick={() => searchCity(cityInput)}
             className="search-btn"
             disabled={loading}
           >
             {language === 'bg' ? 'Търси' : 'Search'}
           </button>
         </div>
      </div>
      
      <div className="forecast-content">
        {loading && <div className="loading">{language === 'bg' ? 'Зареждане...' : 'Loading...'}</div>}
        {error && <div className="error-message">{error}</div>}
        
        {!loading && !error && (
          <div className="ten-day-forecast">
            {forecast.map((day, index) => (
              <div 
                key={day.date} 
                className="forecast-day-card clickable"
                onClick={() => setSelectedDay(day)}
              >
                <div className="day-header">
                  <div className="day-name">{formatDate(`${day.date}T12:00:00`)}</div>
                  <div className="day-number">{index + 1}</div>
                </div>
               
               <div className="weather-info">
                 <div className="weather-icon">
                   <img 
                     src={getWeatherIcon(day.condition.icon)} 
                     alt={day.condition.description}
                   />
                 </div>
                 
                 <div className="temperature-info">
                   <div className="temp-max">
                     {convertTemperature(day.tempMax)}{getTemperatureSymbol()}
                   </div>
                   <div className="temp-min">
                     {convertTemperature(day.tempMin)}{getTemperatureSymbol()}
                   </div>
                 </div>
               </div>
               
               <div className="weather-details">
                 <div className="weather-desc">
                   {getWeatherDescription(day.condition.description)}
                 </div>
                 
                 <div className="additional-info">
                   <div className="humidity">
                     <Droplet size={14} /> {day.humidity}%
                   </div>
                   <div className="wind">
                     <Wind size={14} /> {Math.round(day.windSpeed)} m/s
                   </div>
                 </div>
               </div>
               
               <div className="click-hint">
                 {language === 'bg' ? 'Кликнете за подробности' : 'Click for details'}
               </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Detailed Day Forecast Modal */}
      {selectedDay && (
        <DetailedDayForecast 
          day={selectedDay} 
          onClose={() => setSelectedDay(null)} 
        />
      )}
    </div>
  );
}

export default ForecastPage; 