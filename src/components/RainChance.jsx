import React, { useMemo } from 'react';
import { CloudLightning, CloudRain, Sun, Moon, Cloud } from 'lucide-react';
import { useLanguage } from '../LanguageContext.jsx';
import { useTheme } from '../ThemeContext.jsx';

function RainChance({ weatherData }) {
  const { language } = useLanguage();
  const { convertTemperature, getTemperatureSymbol } = useTheme();

  const rainData = useMemo(() => {
    if (!weatherData?.hourly) return null;

    // Днес по часове: следващите 24 часа, през 3 часа
    const today = weatherData.hourly.filter((_, i) => i % 3 === 0).slice(0, 8).map((h) => ({
      hour: `${h.hour.toString().padStart(2, '0')}:00`,
      chance: Math.round(h.precipProbability),
      type: getWeatherType(h.condition.group),
      temp: Math.round(h.temp),
    }));

    // Седмична прогноза: реалните дни от седмицата
    const days = ['Нед', 'Пон', 'Вто', 'Сря', 'Чет', 'Пет', 'Съб'];
    const daysEn = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const week = weatherData.daily.slice(0, 7).map((d) => {
      const weekday = new Date(`${d.date}T12:00:00`).getDay();
      return {
        day: language === 'bg' ? days[weekday] : daysEn[weekday],
        chance: Math.round(d.precipProbability),
        type: getWeatherType(d.condition.group),
        temp: Math.round(d.tempMax),
      };
    });

    return { today, week };
  }, [weatherData, language]);

  function getWeatherType(group) {
    switch (group) {
      case 'rain':
      case 'drizzle': return 'rain';
      case 'thunderstorm': return 'storm';
      case 'snow': return 'snow';
      case 'clear': return 'clear';
      default: return 'clouds';
    }
  }

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
        return <CloudLightning size={22} />;
      case 'rain':
        return <CloudRain size={22} />;
      case 'clear':
        return isNight ? <Moon size={22} /> : <Sun size={22} />;
      default:
        return <Cloud size={22} />;
    }
  };

  const getChanceColor = (chance) => {
    if (chance < 20) return '#4CAF50';
    if (chance < 50) return '#FF9800';
    if (chance < 80) return '#F44336';
    return '#9C27B0';
  };

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