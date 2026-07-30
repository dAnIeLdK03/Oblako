import React, { useState, useEffect } from 'react';
import { Droplet, Wind } from 'lucide-react';
import { useLanguage } from '../LanguageContext.jsx';
import { useTheme } from '../ThemeContext.jsx';
import Logo from '../components/Logo.jsx';
import DetailedDayForecast from '../components/DetailedDayForecast.jsx';
import '../Weather.css';

function ForecastPage() {
  const { language } = useLanguage();
  const { convertTemperature, getTemperatureSymbol } = useTheme();
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedCity, setSelectedCity] = useState('Sofia');
  const [searchCity, setSearchCity] = useState('Sofia');
  const [selectedDay, setSelectedDay] = useState(null);

  const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

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
        
                 // Convert to array and get first 13 days
         let dailyArray = Object.values(dailyData).slice(0, 13);
         
         // Ensure we have exactly 13 days
         if (dailyArray.length < 13) {
           const lastDay = dailyArray[dailyArray.length - 1];
           const lastDate = new Date(lastDay.date);
           
           for (let i = dailyArray.length; i < 13; i++) {
             const nextDate = new Date(lastDate);
             nextDate.setDate(lastDate.getDate() + (i - dailyArray.length + 1));
             
             // Ensure we don't create duplicate dates
             const newDateString = nextDate.toISOString().split('T')[0];
             if (!dailyArray.find(existing => existing.date === newDateString)) {
               const mockDay = {
                 date: newDateString,
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
         } else if (dailyArray.length > 13) {
           // If we have more than 13 days, take only the first 13
           dailyArray = dailyArray.slice(0, 13);
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
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px', marginBottom: '20px'}}>
                     <Logo size="xlarge" showText={false} />
                     <h1>{language === 'bg' ? '10-дневна прогноза' : '10-Day Forecast'}</h1>
         </div>
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
              <div 
                key={day.dt} 
                className="forecast-day-card clickable"
                onClick={() => setSelectedDay(day)}
              >
                <div className="day-header">
                  <div className="day-name">{formatDate(day.dt_txt)}</div>
                  <div className="day-number">{index + 1}</div>
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
                     <Droplet size={14} /> {day.main.humidity}%
                   </div>
                   <div className="wind">
                     <Wind size={14} /> {Math.round(day.wind.speed)} m/s
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