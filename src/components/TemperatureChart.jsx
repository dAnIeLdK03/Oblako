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
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useLanguage } from '../LanguageContext.jsx';
import { useTheme } from '../ThemeContext.jsx';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

function TemperatureChart({ forecastData, type = 'hourly' }) {
  const { t } = useLanguage();
  const { theme, convertTemperature, getTemperatureSymbol } = useTheme();

  if (!forecastData || !forecastData.list) {
    return (
      <div className="chart-container">
        <div className="no-chart-data">
          {t('noChartData')}
        </div>
      </div>
    );
  }

  // Prepare data based on type (hourly or daily)
  const prepareChartData = () => {
    let dataPoints = [];
    
    if (type === 'hourly') {
      // Show next 24 hours (8 data points, every 3 hours)
      dataPoints = forecastData.list.slice(0, 8);
    } else {
      // Show 5 days (one point per day at 12:00)
      dataPoints = forecastData.list.filter(item => 
        item.dt_txt.includes('12:00:00')
      ).slice(0, 5);
    }

    const labels = dataPoints.map(item => {
      const date = new Date(item.dt * 1000);
      
      if (type === 'hourly') {
        return date.toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit' 
        });
      } else {
        return date.toLocaleDateString('en-US', { 
          weekday: 'short',
          month: 'short',
          day: 'numeric'
        });
      }
    });

    const temperatures = dataPoints.map(item => convertTemperature(item.main.temp));
    const feelsLike = dataPoints.map(item => convertTemperature(item.main.feels_like));

    return { labels, temperatures, feelsLike };
  };

  const { labels, temperatures, feelsLike } = prepareChartData();

  // Theme colors
  const colors = {
    primary: theme === 'dark' ? '#74b9ff' : '#0984e3',
    secondary: theme === 'dark' ? '#ea6e4b' : '#d63031',
    text: theme === 'dark' ? '#ffffff' : '#2d3436',
    grid: theme === 'dark' ? '#495057' : '#ddd'
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
      }
    ]
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
            weight: '500'
          },
          usePointStyle: true,
          padding: 20
        }
      },
      title: {
        display: true,
        text: type === 'hourly' ? t('hourlyForecast') : t('dailyForecast'),
        color: colors.text,
        font: {
          size: 16,
          weight: '600'
        },
        padding: 20
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
          label: function(context) {
            return `${context.dataset.label}: ${context.parsed.y}${getTemperatureSymbol()}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: colors.grid,
          drawBorder: false
        },
        ticks: {
          color: colors.text,
          font: {
            size: 11
          }
        }
      },
      y: {
        grid: {
          color: colors.grid,
          drawBorder: false
        },
        ticks: {
          color: colors.text,
          font: {
            size: 11
          },
          callback: function(value) {
            return value + getTemperatureSymbol();
          }
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index'
    }
  };

  return (
    <div className="chart-container">
      <div className="chart-wrapper">
        <Line data={data} options={options} />
      </div>
    </div>
  );
}

export default TemperatureChart;
