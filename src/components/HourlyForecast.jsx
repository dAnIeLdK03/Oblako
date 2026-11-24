import { lazy, useState } from 'react';
import { Droplet } from 'lucide-react';
import { useLanguage } from '../LanguageContext.jsx';
import { useTheme } from '../ThemeContext.jsx';
import Logo from './Logo.jsx';
import { LazyBoundary, ChartPlaceholder } from './LazyBoundary.jsx';
import { getIconUrl } from '../services/weather';
import styles from './HourlyForecast.module.css';

// Chart.js е в отделен пакет и се зарежда при първо показване на графиката.
const TemperatureChart = lazy(() => import('./TemperatureChart.jsx'));

function HourlyForecast({ weather }) {
  const { t } = useLanguage();
  const { convertTemperature, getTemperatureSymbol } = useTheme();
  const [chartType, setChartType] = useState('hourly');

  // Следващите 18 часа, през 3 часа
  const forecast = weather.hourly.filter((_, i) => i % 3 === 0).slice(0, 6);

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  return (
    <div className="card">
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
        <Logo size="small" showText={false} />
        <h3>
          {t('hourlyForecast')} {weather.place.name} ⏰
        </h3>
      </div>

      {/* Chart Toggle */}
      <div className={styles['chart-toggle']}>
        <button
          className={`${styles['chart-toggle-btn']} ${chartType === 'hourly' ? 'active' : ''}`}
          onClick={() => setChartType('hourly')}
        >
          {t('hourlyChart')}
        </button>
        <button
          className={`${styles['chart-toggle-btn']} ${chartType === 'daily' ? 'active' : ''}`}
          onClick={() => setChartType('daily')}
        >
          {t('dailyChart')}
        </button>
      </div>

      {/* Temperature Chart */}
      <div className={styles['scroll-x']}>
        <LazyBoundary fallback={<ChartPlaceholder />}>
          <TemperatureChart weather={weather} type={chartType} />
        </LazyBoundary>
      </div>

      {/* Hourly forecast cards */}
      <div className={styles['forecast-container']}>
        {forecast.map((hour) => (
          <div key={hour.time} className={styles['forecast-item']}>
            <p className={styles['hour-time']}>{formatTime(hour.localTime)}</p>
            <img src={getIconUrl(hour.condition.icon)} alt={hour.condition.description} />
            <p className={styles['hour-temp']}>
              {convertTemperature(hour.temp)}
              {getTemperatureSymbol()}
            </p>
            <p className={styles['hour-desc']}>{hour.condition.description}</p>
            <p className={styles['hour-humidity']}>
              <Droplet size={14} className={styles['hour-humidity-icon']} /> {hour.humidity}%
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HourlyForecast;
