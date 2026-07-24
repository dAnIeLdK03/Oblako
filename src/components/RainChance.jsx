import React, { useState, useEffect } from 'react';
import { useLanguage } from '../LanguageContext.jsx';
import { useTheme } from '../ThemeContext.jsx';

function RainChance({ weatherData }) {
  const { language } = useLanguage();
  const { convertTemperature, getTemperatureSymbol } = useTheme();
  const [rainData, setRainData] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

  useEffect(() => {
    const fetchRainData = async () => {
      if (weatherData && weatherData.coord) {
        setLoading(true);
        try {
          console.log('Fetching rain data for:', weatherData.coord);
          const res = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?lat=${weatherData.coord.lat}&lon=${weatherData.coord.lon}&units=metric&appid=${API_KEY}`
          );
          if (!res.ok) throw new Error('Failed to fetch forecast data');
          const forecastData = await res.json();
          console.log('Forecast data received:', forecastData);
          
          // Process forecast data for rain chances
          const processedData = processForecastData(forecastData);
          console.log('Processed rain data:', processedData);
          setRainData(processedData);
        } catch (err) {
          console.error('Error fetching rain data:', err);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchRainData();
  }, [weatherData]);

  const processForecastData = (forecastData) => {
    const today = [];
    const week = [];
    
    // Process hourly data for today
    forecastData.list.slice(0, 8).forEach((item, index) => {
      const date = new Date(item.dt * 1000);
      const hour = date.getHours();
      const pop = Math.round((item.pop || 0) * 100);
      
      today.push({
        hour: `${hour.toString().padStart(2, '0')}:00`,
        chance: pop,
        type: getWeatherType(item.weather[0].main),
        temp: Math.round(item.main.temp)
      });
    });

    // Process daily data for week
    const days = ['Пон', 'Вто', 'Сря', 'Чет', 'Пет', 'Съб', 'Нед'];
    const daysEn = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    
    for (let i = 0; i < 7; i++) {
      const dayData = forecastData.list[i * 8] || forecastData.list[forecastData.list.length - 1];
      const pop = Math.round((dayData.pop || 0) * 100);
      
      week.push({
        day: language === 'bg' ? days[i] : daysEn[i],
        chance: pop,
        type: getWeatherType(dayData.weather[0].main),
        temp: Math.round(dayData.main.temp)
      });
    }

    return { today, week };
  };

  const getWeatherType = (main) => {
    switch(main.toLowerCase()) {
      case 'rain': return 'rain';
      case 'thunderstorm': return 'storm';
      case 'snow': return 'snow';
      case 'clear': return 'clear';
      case 'clouds': return 'clouds';
      default: return 'clear';
    }
  };

  // Ensure no duplicate hours in today's data
  const uniqueTodayData = rainData?.today?.reduce((acc, item) => {
    if (!acc.find(existing => existing.hour === item.hour)) {
      acc.push(item);
    }
    return acc;
  }, []) || [];

  // Ensure no duplicate days in week data
  const uniqueWeekData = rainData?.week?.reduce((acc, item) => {
    if (!acc.find(existing => existing.day === item.day)) {
      acc.push(item);
    }
    return acc;
  }, []) || [];

  const getCurrentHour = () => {
    return new Date().getHours();
  };

  const getRainIcon = (type, hour) => {
    const currentHour = hour || getCurrentHour();
    const isNight = currentHour < 6 || currentHour >= 20;
    
    switch(type) {
      case 'storm':
        return isNight ? '⛈️' : '⛈️';
      case 'rain':
        return isNight ? '🌧️' : '🌧️';
      case 'clear':
        return isNight ? '🌙' : '☀️';
      default:
        return isNight ? '🌤️' : '🌤️';
    }
  };

  const getChanceColor = (chance) => {
    if (chance < 20) return '#4CAF50';
    if (chance < 50) return '#FF9800';
    if (chance < 80) return '#F44336';
    return '#9C27B0';
  };

  const getChanceText = (chance) => {
    if (chance < 20) return language === 'bg' ? 'Малка вероятност' : 'Low chance';
    if (chance < 50) return language === 'bg' ? 'Умерена вероятност' : 'Moderate chance';
    if (chance < 80) return language === 'bg' ? 'Висока вероятност' : 'High chance';
    return language === 'bg' ? 'Много вероятно' : 'Very likely';
  };

  if (loading) {
    return (
      <div className="rain-chance">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>{language === 'bg' ? 'Зареждане на данни за валежи...' : 'Loading rain data...'}</p>
        </div>
      </div>
    );
  }

  if (!rainData) {
    return (
      <div className="rain-chance">
        <p>{language === 'bg' ? 'Няма данни за валежи' : 'No rain data available'}</p>
      </div>
    );
  }

  return (
    <div className="rain-chance">
      <h3>{language === 'bg' ? 'Вероятност за валежи' : 'Precipitation Chance'}</h3>
      
      <div className="rain-content">
        {/* Дневна прогноза */}
        <div className="rain-section">
          <h4>{language === 'bg' ? 'Днес по часове' : 'Today by hours'}</h4>
          <div className="rain-hours">
            {uniqueTodayData.map((item, index) => (
              <div key={index} className="rain-hour-item">
                <div className="rain-time">{item.hour}</div>
                <div className="rain-icon">{getRainIcon(item.type, parseInt(item.hour.split(':')[0]))}</div>
                <div className="rain-chance-bar">
                  <div 
                    className="rain-chance-fill"
                    style={{ 
                      width: `${item.chance}%`,
                      backgroundColor: getChanceColor(item.chance)
                    }}
                  ></div>
                </div>
                <div className="rain-percentage">{item.chance}%</div>
              </div>
            ))}
          </div>
        </div>

        {/* Седмична прогноза */}
        <div className="rain-section">
          <h4>{language === 'bg' ? 'Седмична прогноза' : 'Weekly forecast'}</h4>
          <div className="rain-week">
            {uniqueWeekData.map((item, index) => (
              <div key={index} className="rain-day-item">
                <div className="rain-day">{item.day}</div>
                <div className="rain-temp">{convertTemperature(item.temp)}{getTemperatureSymbol()}</div>
                <div className="rain-icon">{getRainIcon(item.type, 12)}</div>
                <div className="rain-chance-bar">
                  <div 
                    className="rain-chance-fill"
                    style={{ 
                      width: `${item.chance}%`,
                      backgroundColor: getChanceColor(item.chance)
                    }}
                  ></div>
                </div>
                <div className="rain-percentage">{item.chance}%</div>
              </div>
            ))}
          </div>
        </div>

        {/* Съвети */}
        <div className="rain-tips">
          <h4>{language === 'bg' ? 'Съвети за деня' : 'Today\'s tips'}</h4>
          <ul>
            <li>{language === 'bg' ? 'Най-висока вероятност за валежи между 15:00-18:00' : 'Highest rain chance between 15:00-18:00'}</li>
            <li>{language === 'bg' ? 'Препоръчва се чадър или дъждобран' : 'Umbrella or raincoat recommended'}</li>
            <li>{language === 'bg' ? 'Избягвайте открити дейности след обяд' : 'Avoid outdoor activities after noon'}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default RainChance; 