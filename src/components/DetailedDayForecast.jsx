import React from 'react';
import { Droplet, Wind, Gauge, Eye, Compass, CloudRain } from 'lucide-react';
import { useLanguage } from '../LanguageContext.jsx';
import { useTheme } from '../ThemeContext.jsx';
import { getIconUrl } from '../services/weather';

function DetailedDayForecast({ day, onClose }) {
  const { language } = useLanguage();
  const { convertTemperature, getTemperatureSymbol } = useTheme();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    return date.toLocaleDateString(language === 'bg' ? 'bg-BG' : 'en-US', options);
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString(language === 'bg' ? 'bg-BG' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
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
      'rain': language === 'bg' ? 'Дъжд' : 'Rain',
      'thunderstorm': language === 'bg' ? 'Буря' : 'Thunderstorm',
      'snow': language === 'bg' ? 'Сняг' : 'Snow',
      'mist': language === 'bg' ? 'Мъгла' : 'Mist',
      'overcast clouds': language === 'bg' ? 'Пълна облачност' : 'Overcast clouds',
      'light rain': language === 'bg' ? 'Леки дъждове' : 'Light rain',
      'moderate rain': language === 'bg' ? 'Умерени дъждове' : 'Moderate rain',
      'heavy intensity rain': language === 'bg' ? 'Силни дъждове' : 'Heavy intensity rain',
      'very heavy rain': language === 'bg' ? 'Много силни дъждове' : 'Very heavy rain',
      'extreme rain': language === 'bg' ? 'Екстремни дъждове' : 'Extreme rain',
      'freezing rain': language === 'bg' ? 'Замръзващ дъжд' : 'Freezing rain',
      'light intensity shower rain': language === 'bg' ? 'Леки превалявания' : 'Light intensity shower rain',
      'shower rain': language === 'bg' ? 'Превалявания' : 'Shower rain',
      'heavy intensity shower rain': language === 'bg' ? 'Силни превалявания' : 'Heavy intensity shower rain',
      'ragged shower rain': language === 'bg' ? 'Неправилни превалявания' : 'Ragged shower rain',
      'light thunderstorm': language === 'bg' ? 'Лека буря' : 'Light thunderstorm',
      'thunderstorm with light rain': language === 'bg' ? 'Буря с леки дъждове' : 'Thunderstorm with light rain',
      'thunderstorm with rain': language === 'bg' ? 'Буря с дъжд' : 'Thunderstorm with rain',
      'thunderstorm with heavy rain': language === 'bg' ? 'Буря със силни дъждове' : 'Thunderstorm with heavy rain',
      'light snow': language === 'bg' ? 'Леки снегове' : 'Light snow',
      'snow': language === 'bg' ? 'Сняг' : 'Snow',
      'heavy snow': language === 'bg' ? 'Силни снегове' : 'Heavy snow',
      'sleet': language === 'bg' ? 'Суграшица' : 'Sleet',
      'light shower sleet': language === 'bg' ? 'Лека суграшица' : 'Light shower sleet',
      'shower sleet': language === 'bg' ? 'Суграшица' : 'Shower sleet',
      'light rain and snow': language === 'bg' ? 'Леки дъждове и сняг' : 'Light rain and snow',
      'rain and snow': language === 'bg' ? 'Дъжд и сняг' : 'Rain and snow',
      'light shower snow': language === 'bg' ? 'Леки снежни превалявания' : 'Light shower snow',
      'shower snow': language === 'bg' ? 'Снежни превалявания' : 'Shower snow',
      'heavy shower snow': language === 'bg' ? 'Силни снежни превалявания' : 'Heavy shower snow',
      'smoke': language === 'bg' ? 'Дим' : 'Smoke',
      'haze': language === 'bg' ? 'Мъгла' : 'Haze',
      'sand/dust whirls': language === 'bg' ? 'Пясъчни вихри' : 'Sand/dust whirls',
      'fog': language === 'bg' ? 'Мъгла' : 'Fog',
      'sand': language === 'bg' ? 'Пясъчна буря' : 'Sand',
      'dust': language === 'bg' ? 'Прах' : 'Dust',
      'volcanic ash': language === 'bg' ? 'Вулканичен пепел' : 'Volcanic ash',
      'squalls': language === 'bg' ? 'Шквали' : 'Squalls',
      'tornado': language === 'bg' ? 'Торнадо' : 'Tornado'
    };
    return descriptions[description.toLowerCase()] || description;
  };

  const getWindDirection = (degrees) => {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round(degrees / 22.5) % 16;
    return directions[index];
  };

  const getWindDirectionFull = (degrees) => {
    const directions = {
      'N': language === 'bg' ? 'Север' : 'North',
      'NNE': language === 'bg' ? 'Северо-североизток' : 'North-Northeast',
      'NE': language === 'bg' ? 'Североизток' : 'Northeast',
      'ENE': language === 'bg' ? 'Изток-североизток' : 'East-Northeast',
      'E': language === 'bg' ? 'Изток' : 'East',
      'ESE': language === 'bg' ? 'Изток-югоизток' : 'East-Southeast',
      'SE': language === 'bg' ? 'Югоизток' : 'Southeast',
      'SSE': language === 'bg' ? 'Юг-югоизток' : 'South-Southeast',
      'S': language === 'bg' ? 'Юг' : 'South',
      'SSW': language === 'bg' ? 'Юг-югозапад' : 'South-Southwest',
      'SW': language === 'bg' ? 'Югозапад' : 'Southwest',
      'WSW': language === 'bg' ? 'Запад-югозапад' : 'West-Southwest',
      'W': language === 'bg' ? 'Запад' : 'West',
      'WNW': language === 'bg' ? 'Запад-северозапад' : 'West-Northwest',
      'NW': language === 'bg' ? 'Северозапад' : 'Northwest',
      'NNW': language === 'bg' ? 'Север-северозапад' : 'North-Northwest'
    };
    const direction = getWindDirection(degrees);
    return directions[direction] || direction;
  };

  const getUVIndex = (uvi) => {
    if (uvi <= 2) return { level: language === 'bg' ? 'Ниско' : 'Low', color: '#00ff00' };
    if (uvi <= 5) return { level: language === 'bg' ? 'Умерено' : 'Moderate', color: '#ffff00' };
    if (uvi <= 7) return { level: language === 'bg' ? 'Високо' : 'High', color: '#ff8000' };
    if (uvi <= 10) return { level: language === 'bg' ? 'Много високо' : 'Very High', color: '#ff0000' };
    return { level: language === 'bg' ? 'Екстремно' : 'Extreme', color: '#800080' };
  };


  return (
    <div className="detailed-forecast-overlay">
      <div className="detailed-forecast-modal">
        <div className="detailed-forecast-header">
          <h2>{formatDate(`${day.date}T12:00:00`)}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="detailed-forecast-content">
          {/* Main Weather Info */}
          <div className="main-weather-section">
            <div className="weather-icon-large">
              <img 
                src={getWeatherIcon(day.condition.icon)} 
                alt={day.condition.description}
              />
            </div>
            
            <div className="weather-main-info">
              <div className="weather-description">
                {getWeatherDescription(day.condition.description)}
              </div>
              
              <div className="temperature-range">
                <div className="temp-max">
                  <span className="temp-label">{language === 'bg' ? 'Максимум' : 'Max'}</span>
                  <span className="temp-value">{convertTemperature(day.tempMax)}{getTemperatureSymbol()}</span>
                </div>
                <div className="temp-min">
                  <span className="temp-label">{language === 'bg' ? 'Минимум' : 'Min'}</span>
                  <span className="temp-value">{convertTemperature(day.tempMin)}{getTemperatureSymbol()}</span>
                </div>
              </div>
            </div>
          </div>

                                           {/* Detailed Weather Parameters */}
            <div className="weather-parameters">
              <div className="parameter-grid">
                <div className="parameter-item">
                  <div className="parameter-icon"><Droplet size={22} /></div>
                  <div className="parameter-info">
                    <div className="parameter-label">{language === 'bg' ? 'Влажност' : 'Humidity'}</div>
                    <div className="parameter-value">{day.humidity}%</div>
                  </div>
                </div>

                <div className="parameter-item">
                  <div className="parameter-icon"><Wind size={22} /></div>
                  <div className="parameter-info">
                    <div className="parameter-label">{language === 'bg' ? 'Вятър' : 'Wind'}</div>
                    <div className="parameter-value">
                      {Math.round(day.windSpeed)} m/s {day.windDeg ? getWindDirection(day.windDeg) : ''}
                    </div>
                  </div>
                </div>

                {day.pressure > 0 && (
                  <div className="parameter-item">
                    <div className="parameter-icon"><Gauge size={22} /></div>
                    <div className="parameter-info">
                      <div className="parameter-label">{language === 'bg' ? 'Налягане' : 'Pressure'}</div>
                      <div className="parameter-value">{day.pressure} hPa</div>
                    </div>
                  </div>
                )}

                {day.visibility > 0 && (
                  <div className="parameter-item">
                    <div className="parameter-icon"><Eye size={22} /></div>
                    <div className="parameter-info">
                      <div className="parameter-label">{language === 'bg' ? 'Видимост' : 'Visibility'}</div>
                      <div className="parameter-value">{Math.round(day.visibility / 1000)} km</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

                     {/* Wind Details */}
           {day.windSpeed != null && (
             <div className="wind-details-section">
               <h3>{language === 'bg' ? 'Детайли за вятъра' : 'Wind Details'}</h3>
               <div className="wind-details-grid">
                 <div className="wind-detail-item">
                   <div className="wind-icon"><Wind size={20} /></div>
                   <div className="wind-info">
                     <div className="wind-label">{language === 'bg' ? 'Скорост' : 'Speed'}</div>
                     <div className="wind-value">{Math.round(day.windSpeed)} m/s</div>
                   </div>
                 </div>

                 {day.windDeg > 0 && (
                   <div className="wind-detail-item">
                     <div className="wind-icon"><Compass size={20} /></div>
                     <div className="wind-info">
                       <div className="wind-label">{language === 'bg' ? 'Посока' : 'Direction'}</div>
                       <div className="wind-value">{day.windDeg}° ({getWindDirectionFull(day.windDeg)})</div>
                     </div>
                   </div>
                 )}
               </div>
             </div>
           )}

                     

          {/* Precipitation Details */}
          <div className="precipitation-section">
            <h3>{language === 'bg' ? 'Валежи' : 'Precipitation'}</h3>
            <div className="precipitation-details">
              <div className="precipitation-item">
                <div className="precipitation-icon"><CloudRain size={22} /></div>
                <div className="precipitation-info">
                  <div className="precipitation-label">{language === 'bg' ? 'Вероятност' : 'Probability'}</div>
                  <div className="precipitation-value">{Math.round(day.precipProbability)}%</div>
                </div>
              </div>

              {day.precipSum > 0 && (
                <div className="precipitation-item">
                  <div className="precipitation-icon"><Droplet size={22} /></div>
                  <div className="precipitation-info">
                    <div className="precipitation-label">{language === 'bg' ? 'Общо за деня' : 'Daily total'}</div>
                    <div className="precipitation-value">{day.precipSum.toFixed(1)} mm</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          

          
        </div>
      </div>
    </div>
  );
}

export default DetailedDayForecast; 