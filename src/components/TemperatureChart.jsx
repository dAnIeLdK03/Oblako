import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useLanguage } from '../LanguageContext.jsx';
import { useTheme } from '../ThemeContext.jsx';
import styles from './TemperatureChart.module.css';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

function TemperatureChart({ weather, type = 'hourly' }) {
  const { t } = useLanguage();
  const { theme, convertTemperature, getTemperatureSymbol } = useTheme();

  if (!weather?.hourly?.length) {
    return (
      <div className={styles['chart-container']}>
        <div className={styles['no-chart-data']}>{t('noChartData')}</div>
      </div>
    );
  }

  // Prepare data based on type (hourly or daily)
  const prepareChartData = () => {
    // Всеки запис се свежда до { label-време, temp, feelsLike }
    let dataPoints;

    if (type === 'hourly') {
      // Next 24 hours (8 data points, every 3 hours)
      dataPoints = weather.hourly
        .filter((_, i) => i % 3 === 0)
        .slice(0, 8)
        .map((h) => ({ at: h.localTime, temp: h.temp, feelsLike: h.feelsLike }));
    } else {
      // 5 days, daily maximum
      dataPoints = weather.daily
        .slice(0, 5)
        .map((d) => ({ at: `${d.date}T12:00`, temp: d.tempMax, feelsLike: d.feelsLikeMax }));
    }

    const labels = dataPoints.map((item) => {
      const date = new Date(item.at);

      if (type === 'hourly') {
        return date.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
        });
      } else {
        return date.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
        });
      }
    });

    const temperatures = dataPoints.map((item) => convertTemperature(item.temp));
    const feelsLike = dataPoints.map((item) => convertTemperature(item.feelsLike));

    return { labels, temperatures, feelsLike };
  };

  const { labels, temperatures, feelsLike } = prepareChartData();

  // Theme colors
  const colors = {
    primary: theme === 'dark' ? '#74b9ff' : '#0984e3',
    secondary: theme === 'dark' ? '#ea6e4b' : '#d63031',
    text: theme === 'dark' ? '#ffffff' : '#2d3436',
    grid: theme === 'dark' ? '#495057' : '#ddd',
  };

  const data = {
    labels,
    datasets: [
      {
        label: t('temperature'),
        data: temperatures,
        borderColor: colors.primary,
        backgroundColor: `${colors.primary}20`,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: colors.primary,
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
      {
        label: t('feelsLike'),
        data: feelsLike,
        borderColor: colors.secondary,
        backgroundColor: `${colors.secondary}15`,
        fill: false,
        tension: 0.4,
        pointBackgroundColor: colors.secondary,
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        borderDash: [5, 5],
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: colors.text,
          font: {
            size: 12,
            weight: '500',
          },
          usePointStyle: true,
          padding: 20,
        },
      },
      title: {
        display: true,
        text: type === 'hourly' ? t('hourlyForecast') : t('dailyForecast'),
        color: colors.text,
        font: {
          size: 16,
          weight: '600',
        },
        padding: 20,
      },
      tooltip: {
        backgroundColor: theme === 'dark' ? '#2a2b2d' : '#ffffff',
        titleColor: colors.text,
        bodyColor: colors.text,
        borderColor: colors.grid,
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: function (context) {
            return `${context.dataset.label}: ${context.parsed.y}${getTemperatureSymbol()}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: colors.grid,
          drawBorder: false,
        },
        ticks: {
          color: colors.text,
          font: {
            size: 11,
          },
        },
      },
      y: {
        grid: {
          color: colors.grid,
          drawBorder: false,
        },
        ticks: {
          color: colors.text,
          font: {
            size: 11,
          },
          callback: function (value) {
            return value + getTemperatureSymbol();
          },
        },
      },
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
  };

  return (
    <div className={styles['chart-container']}>
      <div className={styles['chart-wrapper']}>
        <Line data={data} options={options} />
      </div>
    </div>
  );
}

export default TemperatureChart;
