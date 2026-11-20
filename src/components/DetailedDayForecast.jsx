import React from 'react';
import { Droplet, Wind, Gauge, Eye, Compass, CloudRain } from 'lucide-react';
import { useLanguage } from '../LanguageContext.jsx';
import { useTheme } from '../ThemeContext.jsx';
import { getIconUrl } from '../services/weather';
import styles from './DetailedDayForecast.module.css';

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


  return (
    <div className={styles['detailed-forecast-overlay']}>
      <div className={styles['detailed-forecast-modal']}>
        <div className={styles['detailed-forecast-header']}>
          <h2>{formatDate(`${day.date}T12:00:00`)}</h2>
          <button className={styles['close-btn']} onClick={onClose}>×</button>
        </div>

        <div className={styles['detailed-forecast-content']}>
          {/* Main Weather Info */}
          <div className={styles['main-weather-section']}>
            <div className={styles['weather-icon-large']}>
              <img 
                src={getWeatherIcon(day.condition.icon)} 
                alt={day.condition.description}
              />
            </div>
            
            <div className={styles['weather-main-info']}>
              <div className={styles['weather-description']}>
                {getWeatherDescription(day.condition.description)}
              </div>
              
              <div className={styles['temperature-range']}>
                <div className="temp-max">
                  <span className={styles['temp-label']}>{language === 'bg' ? 'Максимум' : 'Max'}</span>
                  <span className={styles['temp-value']}>{convertTemperature(day.tempMax)}{getTemperatureSymbol()}</span>
                </div>
                <div className="temp-min">
                  <span className={styles['temp-label']}>{language === 'bg' ? 'Минимум' : 'Min'}</span>
                  <span className={styles['temp-value']}>{convertTemperature(day.tempMin)}{getTemperatureSymbol()}</span>
                </div>
              </div>
            </div>
          </div>

                                           {/* Detailed Weather Parameters */}
            <div className={styles['weather-parameters']}>
              <div className={styles['parameter-grid']}>
                <div className={styles['parameter-item']}>
                  <div className={styles['parameter-icon']}><Droplet size={22} /></div>
                  <div className={styles['parameter-info']}>
                    <div className={styles['parameter-label']}>{language === 'bg' ? 'Влажност' : 'Humidity'}</div>
                    <div className={styles['parameter-value']}>{day.humidity}%</div>
                  </div>
                </div>

                <div className={styles['parameter-item']}>
                  <div className={styles['parameter-icon']}><Wind size={22} /></div>
                  <div className={styles['parameter-info']}>
                    <div className={styles['parameter-label']}>{language === 'bg' ? 'Вятър' : 'Wind'}</div>
                    <div className={styles['parameter-value']}>
                      {Math.round(day.windSpeed)} m/s {day.windDeg ? getWindDirection(day.windDeg) : ''}
                    </div>
                  </div>
                </div>

                {day.pressure > 0 && (
                  <div className={styles['parameter-item']}>
                    <div className={styles['parameter-icon']}><Gauge size={22} /></div>
                    <div className={styles['parameter-info']}>
                      <div className={styles['parameter-label']}>{language === 'bg' ? 'Налягане' : 'Pressure'}</div>
                      <div className={styles['parameter-value']}>{day.pressure} hPa</div>
                    </div>
                  </div>
                )}

                {day.visibility > 0 && (
                  <div className={styles['parameter-item']}>
                    <div className={styles['parameter-icon']}><Eye size={22} /></div>
                    <div className={styles['parameter-info']}>
                      <div className={styles['parameter-label']}>{language === 'bg' ? 'Видимост' : 'Visibility'}</div>
                      <div className={styles['parameter-value']}>{Math.round(day.visibility / 1000)} km</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

                     {/* Wind Details */}
           {day.windSpeed != null && (
             <div className={styles['wind-details-section']}>
               <h3>{language === 'bg' ? 'Детайли за вятъра' : 'Wind Details'}</h3>
               <div className={styles['wind-details-grid']}>
                 <div className={styles['wind-detail-item']}>
                   <div className={styles['wind-icon']}><Wind size={20} /></div>
                   <div className={styles['wind-info']}>
                     <div className={styles['wind-label']}>{language === 'bg' ? 'Скорост' : 'Speed'}</div>
                     <div className={styles['wind-value']}>{Math.round(day.windSpeed)} m/s</div>
                   </div>
                 </div>

                 {day.windDeg > 0 && (
                   <div className={styles['wind-detail-item']}>
                     <div className={styles['wind-icon']}><Compass size={20} /></div>
                     <div className={styles['wind-info']}>
                       <div className={styles['wind-label']}>{language === 'bg' ? 'Посока' : 'Direction'}</div>
                       <div className={styles['wind-value']}>{day.windDeg}° ({getWindDirectionFull(day.windDeg)})</div>
                     </div>
                   </div>
                 )}
               </div>
             </div>
           )}

                     

          {/* Precipitation Details */}
          <div className={styles['precipitation-section']}>
            <h3>{language === 'bg' ? 'Валежи' : 'Precipitation'}</h3>
            <div className={styles['precipitation-details']}>
              <div className={styles['precipitation-item']}>
                <div className={styles['precipitation-icon']}><CloudRain size={22} /></div>
                <div className={styles['precipitation-info']}>
                  <div className={styles['precipitation-label']}>{language === 'bg' ? 'Вероятност' : 'Probability'}</div>
                  <div className={styles['precipitation-value']}>{Math.round(day.precipProbability)}%</div>
                </div>
              </div>

              {day.precipSum > 0 && (
                <div className={styles['precipitation-item']}>
                  <div className={styles['precipitation-icon']}><Droplet size={22} /></div>
                  <div className={styles['precipitation-info']}>
                    <div className={styles['precipitation-label']}>{language === 'bg' ? 'Общо за деня' : 'Daily total'}</div>
                    <div className={styles['precipitation-value']}>{day.precipSum.toFixed(1)} mm</div>
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