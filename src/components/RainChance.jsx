import React from 'react';
import { useLanguage } from '../LanguageContext.jsx';
import { useTheme } from '../ThemeContext.jsx';

function RainChance({ weatherData }) {
  const { language } = useLanguage();
  const { convertTemperature, getTemperatureSymbol } = useTheme();

  // Mock data - в реалност това ще идва от API
  const rainData = {
    today: [
      { hour: '00:00', chance: 5, type: 'clear', temp: 8 },
      { hour: '03:00', chance: 8, type: 'clear', temp: 6 },
      { hour: '06:00', chance: 15, type: 'rain', temp: 9 },
      { hour: '09:00', chance: 25, type: 'rain', temp: 12 },
      { hour: '12:00', chance: 45, type: 'rain', temp: 16 },
      { hour: '15:00', chance: 70, type: 'storm', temp: 18 },
      { hour: '18:00', chance: 60, type: 'rain', temp: 15 },
      { hour: '21:00', chance: 35, type: 'rain', temp: 11 }
    ],
    week: [
      { day: language === 'bg' ? 'Пон' : 'Mon', chance: 20, type: 'rain', temp: 18 },
      { day: language === 'bg' ? 'Вто' : 'Tue', chance: 45, type: 'rain', temp: 16 },
      { day: language === 'bg' ? 'Сря' : 'Wed', chance: 80, type: 'storm', temp: 14 },
      { day: language === 'bg' ? 'Чет' : 'Thu', chance: 60, type: 'rain', temp: 17 },
      { day: language === 'bg' ? 'Пет' : 'Fri', chance: 15, type: 'rain', temp: 20 },
      { day: language === 'bg' ? 'Съб' : 'Sat', chance: 5, type: 'clear', temp: 22 },
      { day: language === 'bg' ? 'Нед' : 'Sun', chance: 10, type: 'clear', temp: 24 }
    ]
  };

  // Ensure no duplicate hours in today's data
  const uniqueTodayData = rainData.today.reduce((acc, item) => {
    if (!acc.find(existing => existing.hour === item.hour)) {
      acc.push(item);
    }
    return acc;
  }, []);

  // Ensure no duplicate days in week data
  const uniqueWeekData = rainData.week.reduce((acc, item) => {
    if (!acc.find(existing => existing.day === item.day)) {
      acc.push(item);
    }
    return acc;
  }, []);

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