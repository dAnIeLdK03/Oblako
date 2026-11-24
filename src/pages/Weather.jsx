import { useState } from 'react';
import HourlyForecast from '../components/HourlyForecast.jsx';
import { useLanguage } from '../LanguageContext.jsx';
import { useTheme } from '../ThemeContext.jsx';
import { useHistory } from '../HistoryContext.jsx';
import SunriseSunset from '../components/SunriseSunset.jsx';
import WeatherMap from '../components/WeatherMap.jsx';
import WorldClock from '../components/WorldClock.jsx';
import { useEffect } from 'react';
import SkeletonLoading from '../components/SkeletonLoading.jsx';
import PullToRefresh from '../components/PullToRefresh.jsx';
import WeatherHero from '../components/WeatherHero.jsx';
import { useWeather } from '../hooks/useWeather.js';
import { useSeo } from '../hooks/useSeo.js';
import { BarChart3, Calendar, MapPin, Eye, Droplet, Thermometer, Wind } from 'lucide-react';
import styles from './Weather.module.css';

function Weather() {
  const { language, changeLanguage, t } = useLanguage();
  const {
    theme,
    toggleTheme,
    temperatureUnit,
    toggleTemperatureUnit,
    convertTemperature,
    getTemperatureSymbol,
  } = useTheme();
  const { searchHistory, addToHistory, clearHistory } = useHistory();

  const [city, setCity] = useState('');

  const [mapSelectedCity, setMapSelectedCity] = useState(null);
  const {
    weather: weatherData,
    loading,
    error,
    locationWarning,
    searchCity,
    locate,
    showWeather,
    refresh,
  } = useWeather({ fallbackCity: 'Sofia' });

  useSeo('home', { city: weatherData?.place.named ? weatherData.place.name : undefined });

  // Търсачката следва показаното място (при търсене, локация или избор от картата)
  useEffect(() => {
    if (weatherData) setCity(weatherData.place.name);
    // само при смяна на мястото, за да не пренаписваме текста, който потребителят пише
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weatherData?.place.name]);

  async function getWeather(e, searchCityName = null) {
    if (e) e.preventDefault();
    const data = await searchCity(searchCityName || city);
    if (data) addToHistory(data.place.name);
  }

  // Функция за превод на weather условията
  const translateWeatherCondition = (condition) => {
    const conditionMap = {
      'clear sky': t('clear'),
      'few clouds': t('clouds'),
      'scattered clouds': t('clouds'),
      'broken clouds': t('clouds'),
      'shower rain': t('rain'),
      rain: t('rain'),
      thunderstorm: t('thunderstorm'),
      snow: t('snow'),
      mist: t('mist'),
    };
    return conditionMap[condition.toLowerCase()] || condition;
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    if (language === 'bg') {
      const day = date.getDate();
      const month = date.getMonth();
      const year = date.getFullYear();
      const monthNames = [
        t('january'),
        t('february'),
        t('march'),
        t('april'),
        t('may'),
        t('june'),
        t('july'),
        t('august'),
        t('september'),
        t('october'),
        t('november'),
        t('december'),
      ];
      return `${day} ${monthNames[month]} ${year}`;
    } else {
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    }
  };

  const getWeatherTheme = (condition) => {
    if (!condition.isDay) {
      return 'night';
    }

    let theme;
    switch (condition.group) {
      case 'clear':
        theme = 'sunny';
        break;
      case 'clouds':
        theme = 'cloudy';
        break;
      case 'rain':
      case 'drizzle':
        theme = 'rainy';
        break;
      case 'snow':
        theme = 'snowy';
        break;
      case 'thunderstorm':
        theme = 'stormy';
        break;
      default:
        theme = 'default';
    }

    return theme;
  };

  const containerClass = `weather-container ${weatherData ? getWeatherTheme(weatherData.current.condition) : ''}`;

  const handleHistoryClick = (historyCity) => {
    setCity(historyCity);
    getWeather(null, historyCity);
  };

  // При клик на карта зареждам данните и показвам прогнозата
  const handleMapWeather = async (data) => {
    showWeather(data);
    setMapSelectedCity(data.place.name); // Запазваме града от картата

    // Добавяме в историята
    addToHistory(data.place.name);

    // Показваме съобщение за успешно зареждане

    // Скриваме индикацията след 3 секунди
    setTimeout(() => {
      setMapSelectedCity(null);
    }, 3000);

    // Прокрутваме до горната част на страницата за да се виждат данните
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRefresh = async () => {
    await refresh();
  };

  return (
    <>
      <div className={containerClass}>
        <WeatherHero
          weatherData={weatherData}
          loading={loading}
          error={error}
          city={city}
          setCity={setCity}
          onSearchSubmit={getWeather}
          onLocationClick={locate}
          language={language}
          changeLanguage={changeLanguage}
          theme={theme}
          toggleTheme={toggleTheme}
          temperatureUnit={temperatureUnit}
          toggleTemperatureUnit={toggleTemperatureUnit}
          convertTemperature={convertTemperature}
          getTemperatureSymbol={getTemperatureSymbol}
          translateWeatherCondition={translateWeatherCondition}
          searchHistory={searchHistory}
          onHistoryClick={handleHistoryClick}
          clearHistory={clearHistory}
          t={t}
        />

        <PullToRefresh onRefresh={handleRefresh}>
          {loading && <SkeletonLoading />}
          {error && <div className={styles['wp-error']}>{error}</div>}
          {locationWarning && (
            <div className={styles['wp-error']}>
              {language === 'bg'
                ? 'Локацията е с ниска точност. Проверете дали е правилна или потърсете града ръчно.'
                : 'Location accuracy is low. Please verify it or search for your city manually.'}
            </div>
          )}
          {mapSelectedCity && (
            <div className={styles['wp-toast']}>
              <MapPin size={16} className={styles['wp-toast-icon']} />{' '}
              {language === 'bg' ? 'Избрано от картата:' : 'Selected from map:'} {mapSelectedCity}
            </div>
          )}

          {weatherData && (
            <div className={styles['wp-content']}>
              <div className="wp-grid">
                <div className={styles['wp-card']}>
                  <h3 className={styles['wp-card-title']}>
                    <BarChart3 size={20} className={styles['wp-card-title-icon']} /> {t('overview')}
                  </h3>
                  <div className={styles['wp-stat-list']}>
                    <div className={styles['wp-stat']}>
                      <Calendar size={16} className={styles['wp-stat-icon']} />
                      <span>{formatDate(weatherData.current.time)}</span>
                    </div>
                    <div className={styles['wp-stat']}>
                      <MapPin size={16} className={styles['wp-stat-icon']} />
                      <span>
                        {weatherData.place.name}, {weatherData.place.country}
                      </span>
                    </div>
                    <div className={styles['wp-stat']}>
                      <Eye size={16} className={styles['wp-stat-icon']} />
                      <span>
                        {t('visibility')}: {weatherData.current.visibility / 1000} km
                      </span>
                    </div>
                    <div className={styles['wp-stat']}>
                      <Droplet size={16} className={styles['wp-stat-icon']} />
                      <span>
                        {t('humidity')}: {weatherData.current.humidity}%
                      </span>
                    </div>
                    <div className={styles['wp-stat']}>
                      <Thermometer size={16} className={styles['wp-stat-icon']} />
                      <span>
                        {t('feelsLike')}: {convertTemperature(weatherData.current.feelsLike)}
                        {getTemperatureSymbol()}
                      </span>
                    </div>
                    <div className={styles['wp-stat']}>
                      <Wind size={16} className={styles['wp-stat-icon']} />
                      <span>
                        {t('wind')}: {Math.round(weatherData.current.windSpeed * 3.6)} km/h
                      </span>
                    </div>
                  </div>

                  <div className="wp-clock-wrap">
                    <WorldClock city="Sofia" language={language} hasError={false} />
                  </div>
                </div>

                <SunriseSunset weatherData={weatherData} />
              </div>

              <div className="wp-section">
                <HourlyForecast weather={weatherData} />
              </div>
            </div>
          )}

          {/* Интерактивна карта най-отдолу */}
          <div className="wp-section">
            <WeatherMap onLocationSelect={handleMapWeather} />
          </div>
        </PullToRefresh>
      </div>
    </>
  );
}

export default Weather;
