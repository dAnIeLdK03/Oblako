import React, { useState } from 'react';
import { Droplet, Wind } from 'lucide-react';
import { useLanguage } from '../LanguageContext.jsx';
import { useTheme } from '../ThemeContext.jsx';
import Logo from '../components/Logo.jsx';
import DetailedDayForecast from '../components/DetailedDayForecast.jsx';
import { getIconUrl } from '../services/weather';
import { useWeather } from '../hooks/useWeather.js';
import { useSeo } from '../hooks/useSeo.js';
import styles from './ForecastPage.module.css';

function ForecastPage() {
  const { language } = useLanguage();
  const { convertTemperature, getTemperatureSymbol } = useTheme();
  const [selectedDay, setSelectedDay] = useState(null);

  const { weather, loading, error, searchCity } = useWeather({ fallbackCity: 'Sofia' });
  const placeName = weather?.place.name;

  // Полето следва показаното място (при търсене, споделен линк или навигация). Нулира се
  // само при смяна на мястото, за да не се пренаписва текстът, който потребителят пише.
  const [cityInput, setCityInput] = useState(placeName ?? '');
  const [shownPlace, setShownPlace] = useState(placeName);
  if (placeName !== shownPlace) {
    setShownPlace(placeName);
    if (placeName) setCityInput(placeName);
  }
  const forecast = weather ? weather.daily.slice(0, 13) : [];
  useSeo('forecast', { city: weather?.place.named ? weather.place.name : undefined });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
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
      rain: language === 'bg' ? 'Дъжд' : 'Rain',
      thunderstorm: language === 'bg' ? 'Буря' : 'Thunderstorm',
      snow: language === 'bg' ? 'Сняг' : 'Snow',
      mist: language === 'bg' ? 'Мъгла' : 'Mist',
    };
    return descriptions[description.toLowerCase()] || description;
  };

  return (
    <div className={styles['forecast-page']}>
      <div className="page-header">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '15px',
            marginBottom: '20px',
          }}
        >
          <Logo size="xlarge" showText={false} />
          <h1>{language === 'bg' ? '10-дневна прогноза' : '10-Day Forecast'}</h1>
        </div>
        <p>
          {language === 'bg'
            ? 'Детайлна прогноза за следващите 10 дни'
            : 'Detailed forecast for the next 10 days'}
        </p>

        {/* City Selector */}
        <div className={styles['city-selector']}>
          <input
            type="text"
            value={cityInput}
            onChange={(e) => setCityInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && searchCity(cityInput)}
            placeholder={language === 'bg' ? 'Въведете град...' : 'Enter city...'}
            className={styles['city-input']}
          />
          <button onClick={() => searchCity(cityInput)} className="search-btn" disabled={loading}>
            {language === 'bg' ? 'Търси' : 'Search'}
          </button>
        </div>
      </div>

      <div className={styles['forecast-content']}>
        {loading && (
          <div className="loading">{language === 'bg' ? 'Зареждане...' : 'Loading...'}</div>
        )}
        {error && <div className="error-message">{error}</div>}

        {!loading && !error && (
          <div className={styles['ten-day-forecast']}>
            {forecast.map((day, index) => (
              <div
                key={day.date}
                className={`${styles['forecast-day-card']} ${styles.clickable}`}
                onClick={() => setSelectedDay(day)}
              >
                <div className={styles['day-header']}>
                  <div className={styles['day-name']}>{formatDate(`${day.date}T12:00:00`)}</div>
                  <div className={styles['day-number']}>{index + 1}</div>
                </div>

                <div className={styles['weather-info']}>
                  <div className={styles['weather-icon']}>
                    <img src={getWeatherIcon(day.condition.icon)} alt={day.condition.description} />
                  </div>

                  <div className={styles['temperature-info']}>
                    <div className="temp-max">
                      {convertTemperature(day.tempMax)}
                      {getTemperatureSymbol()}
                    </div>
                    <div className="temp-min">
                      {convertTemperature(day.tempMin)}
                      {getTemperatureSymbol()}
                    </div>
                  </div>
                </div>

                <div className={styles['weather-details']}>
                  <div className={styles['weather-desc']}>
                    {getWeatherDescription(day.condition.description)}
                  </div>

                  <div className={styles['additional-info']}>
                    <div className="humidity">
                      <Droplet size={14} /> {day.humidity}%
                    </div>
                    <div className="wind">
                      <Wind size={14} /> {Math.round(day.windSpeed)} m/s
                    </div>
                  </div>
                </div>

                <div className={styles['click-hint']}>
                  {language === 'bg' ? 'Кликнете за подробности' : 'Click for details'}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detailed Day Forecast Modal */}
      {selectedDay && (
        <DetailedDayForecast day={selectedDay} onClose={() => setSelectedDay(null)} />
      )}
    </div>
  );
}

export default ForecastPage;
