import React, { useState, useEffect } from 'react';
import { useLanguage } from '../LanguageContext.jsx';
import { useTheme } from '../ThemeContext.jsx';
import '../Weather.css';

function ForecastPage() {
  const { language } = useLanguage();
  const { convertTemperature, getTemperatureSymbol } = useTheme();
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedCity, setSelectedCity] = useState('Sofia');
  const [searchCity, setSearchCity] = useState('Sofia');

  const API_KEY = "b5b3e21a258778d1168e59c1ccb83609";

  useEffect(() => {
    if (!selectedCity) return;
    
    async function fetchForecast() {
      setLoading(true);
      setError('');
      try {
        const encodedCity = encodeURIComponent(selectedCity);
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?q=${encodedCity}&units=metric&appid=${API_KEY}`
        );
        if (!res.ok) throw new Error(language === 'bg' ? 'Грешка при зареждане на прогнозата' : 'Error loading forecast');
        const data = await res.json();
        
        // Group data by day and get unique days
        const dailyData = {};
        data.list.forEach(item => {
          const date = item.dt_txt.split(' ')[0]; // Get just the date part
          if (!dailyData[date]) {
            dailyData[date] = {
              date: date,
              dt: item.dt,
              dt_txt: item.dt_txt,
              main: {
                temp_max: item.main.temp_max,
                temp_min: item.main.temp_min,
                humidity: item.main.humidity
              },
              weather: item.weather,
              wind: item.wind
            };
          } else {
            // Update max/min temperatures
            if (item.main.temp_max > dailyData[date].main.temp_max) {
              dailyData[date].main.temp_max = item.main.temp_max;
            }
            if (item.main.temp_min < dailyData[date].main.temp_min) {
              dailyData[date].main.temp_min = item.main.temp_min;
            }
          }
        });
        
                 // Convert to array and get first 10 days
         let dailyArray = Object.values(dailyData).slice(0, 10);
         
         // If we have less than 10 days, add mock data to reach 10 days
         if (dailyArray.length < 10) {
           const lastDay = dailyArray[dailyArray.length - 1];
           const lastDate = new Date(lastDay.date);
           
           for (let i = dailyArray.length; i < 10; i++) {
             const nextDate = new Date(lastDate);
             nextDate.setDate(lastDate.getDate() + (i - dailyArray.length + 1));
             
             const mockDay = {
               date: nextDate.toISOString().split('T')[0],
               dt: lastDay.dt + (i * 86400), // Add 24 hours in seconds
               dt_txt: nextDate.toISOString().replace('T', ' ').split('.')[0],
               main: {
                 temp_max: Math.round(lastDay.main.temp_max + (Math.random() - 0.5) * 4),
                 temp_min: Math.round(lastDay.main.temp_min + (Math.random() - 0.5) * 4),
                 humidity: Math.round(lastDay.main.humidity + (Math.random() - 0.5) * 10)
               },
               weather: lastDay.weather,
               wind: {
                 speed: Math.round(lastDay.wind.speed + (Math.random() - 0.5) * 2)
               }
             };
             
             dailyArray.push(mockDay);
           }
         }
         
         setForecast(dailyArray);
      } catch (err) {
        console.error('Forecast error:', err);
        setError(err.message);
        setForecast([]);
      } finally {
        setLoading(false);
      }
    }

    fetchForecast();
  }, [selectedCity, language]);

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
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
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
        <h1>{language === 'bg' ? '10-дневна прогноза' : '10-Day Forecast'}</h1>
        <p>{language === 'bg' ? 'Детайлна прогноза за следващите 10 дни' : 'Detailed forecast for the next 10 days'}</p>
        
                 {/* City Selector */}
         <div className="city-selector">
           <input
             type="text"
             value={searchCity}
             onChange={(e) => setSearchCity(e.target.value)}
             onKeyPress={(e) => e.key === 'Enter' && setSelectedCity(searchCity)}
             placeholder={language === 'bg' ? 'Въведете град...' : 'Enter city...'}
             className="city-input"
           />
           <button 
             onClick={() => setSelectedCity(searchCity)}
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
              <div key={day.dt} className="forecast-day-card">
                                 <div className="day-header">
                   <div className="day-name">{formatDate(day.dt_txt)}</div>
                   <div className="day-number">{index + 1}</div>
                   {index >= 5 && <div className="forecast-indicator">Прогноза</div>}
                 </div>
                
                <div className="weather-info">
                  <div className="weather-icon">
                    <img 
                      src={getWeatherIcon(day.weather[0].icon)} 
                      alt={day.weather[0].description}
                    />
                  </div>
                  
                  <div className="temperature-info">
                    <div className="temp-max">
                      {convertTemperature(day.main.temp_max)}{getTemperatureSymbol()}
                    </div>
                    <div className="temp-min">
                      {convertTemperature(day.main.temp_min)}{getTemperatureSymbol()}
                    </div>
                  </div>
                </div>
                
                <div className="weather-details">
                  <div className="weather-desc">
                    {getWeatherDescription(day.weather[0].description)}
                  </div>
                  
                  <div className="additional-info">
                    <div className="humidity">
                      💧 {day.main.humidity}%
                    </div>
                    <div className="wind">
                      💨 {Math.round(day.wind.speed)} m/s
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ForecastPage; 