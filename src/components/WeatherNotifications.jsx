import React, { useState, useEffect } from 'react';
import { useLanguage } from '../LanguageContext.jsx';

const WeatherNotifications = () => {
  const { language } = useLanguage();
  const [notifications, setNotifications] = useState([]);
  const [isEnabled, setIsEnabled] = useState(false);

  const translations = {
    bg: {
      title: "Известия за времето",
      description: "Получавайте известия за важни промени във времето",
      enable: "Активирай известия",
      disable: "Деактивирай известия",
      severeWeather: "Екстремно време",
      rainAlert: "Предупреждение за дъжд",
      stormAlert: "Предупреждение за буря",
      heatAlert: "Предупреждение за горещина",
      coldAlert: "Предупреждение за студ",
      uvAlert: "Висок UV индекс",
      airQualityAlert: "Лошо качество на въздуха",
      noNotifications: "Няма активни известия"
    },
    en: {
      title: "Weather Notifications",
      description: "Get notified about important weather changes",
      enable: "Enable notifications",
      disable: "Disable notifications",
      severeWeather: "Severe weather",
      rainAlert: "Rain warning",
      stormAlert: "Storm warning",
      heatAlert: "Heat warning",
      coldAlert: "Cold warning",
      uvAlert: "High UV index",
      airQualityAlert: "Poor air quality",
      noNotifications: "No active notifications"
    }
  };

  const t = translations[language] || translations.bg;

  const toggleNotifications = () => {
    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        setIsEnabled(!isEnabled);
      } else if (Notification.permission === 'default') {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            setIsEnabled(true);
          }
        });
      }
    }
  };

  const sendNotification = (title, body) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body: body,
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-72x72.png'
      });
    }
  };

  const checkWeatherAlerts = (weatherData) => {
    const alerts = [];
    
    // Проверка за екстремно време
    if (weatherData.temperature > 35) {
      alerts.push({
        type: 'heat',
        title: t.heatAlert,
        message: `Температурата е ${weatherData.temperature}°C`
      });
    }
    
    if (weatherData.temperature < -10) {
      alerts.push({
        type: 'cold',
        title: t.coldAlert,
        message: `Температурата е ${weatherData.temperature}°C`
      });
    }
    
    if (weatherData.uvIndex > 8) {
      alerts.push({
        type: 'uv',
        title: t.uvAlert,
        message: `UV индексът е ${weatherData.uvIndex}`
      });
    }
    
    if (weatherData.airQuality > 150) {
      alerts.push({
        type: 'air',
        title: t.airQualityAlert,
        message: `Качеството на въздуха е ${weatherData.airQuality}`
      });
    }
    
    return alerts;
  };

  useEffect(() => {
    // Проверяваме дали известията са разрешени
    if ('Notification' in window) {
      setIsEnabled(Notification.permission === 'granted');
    }
  }, []);

  return (
    <div className="weather-notifications">
      <div className="notifications-header">
        <h3>{t.title}</h3>
        <p>{t.description}</p>
      </div>

      <div className="notifications-controls">
        <button 
          className={`notification-toggle ${isEnabled ? 'enabled' : 'disabled'}`}
          onClick={toggleNotifications}
        >
          {isEnabled ? t.disable : t.enable}
        </button>
      </div>

      <div className="notifications-list">
        {notifications.length > 0 ? (
          notifications.map((notification, index) => (
            <div key={index} className={`notification-item ${notification.type}`}>
              <div className="notification-icon">
                {notification.type === 'heat' && '🌡️'}
                {notification.type === 'cold' && '❄️'}
                {notification.type === 'uv' && '☀️'}
                {notification.type === 'air' && '🌬️'}
                {notification.type === 'rain' && '🌧️'}
                {notification.type === 'storm' && '⛈️'}
              </div>
              <div className="notification-content">
                <h4>{notification.title}</h4>
                <p>{notification.message}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="no-notifications">
            <p>{t.noNotifications}</p>
          </div>
        )}
      </div>

      <style jsx>{`
        .weather-notifications {
          background: var(--card-bg);
          border-radius: 15px;
          padding: 20px;
          margin: 20px 0;
          border: 1px solid var(--border-color);
        }

        .notifications-header h3 {
          margin: 0 0 10px 0;
          color: var(--text-color);
          font-size: 1.2rem;
        }

        .notifications-header p {
          margin: 0 0 20px 0;
          color: var(--text-secondary);
          font-size: 0.9rem;
        }

        .notifications-controls {
          margin-bottom: 20px;
        }

        .notification-toggle {
          padding: 10px 20px;
          border: none;
          border-radius: 25px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.3s ease;
          background: var(--accent-color);
          color: white;
        }

        .notification-toggle.enabled {
          background: #e74c3c;
        }

        .notification-toggle.disabled {
          background: var(--accent-color);
        }

        .notification-toggle:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }

        .notifications-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .notification-item {
          display: flex;
          align-items: center;
          padding: 15px;
          border-radius: 10px;
          background: var(--bg-secondary);
          border-left: 4px solid;
        }

        .notification-item.heat {
          border-left-color: #e74c3c;
          background: rgba(231, 76, 60, 0.1);
        }

        .notification-item.cold {
          border-left-color: #3498db;
          background: rgba(52, 152, 219, 0.1);
        }

        .notification-item.uv {
          border-left-color: #f39c12;
          background: rgba(243, 156, 18, 0.1);
        }

        .notification-item.air {
          border-left-color: #9b59b6;
          background: rgba(155, 89, 182, 0.1);
        }

        .notification-item.rain {
          border-left-color: #2980b9;
          background: rgba(41, 128, 185, 0.1);
        }

        .notification-item.storm {
          border-left-color: #8e44ad;
          background: rgba(142, 68, 173, 0.1);
        }

        .notification-icon {
          font-size: 1.5rem;
          margin-right: 15px;
        }

        .notification-content h4 {
          margin: 0 0 5px 0;
          color: var(--text-color);
          font-size: 1rem;
        }

        .notification-content p {
          margin: 0;
          color: var(--text-secondary);
          font-size: 0.9rem;
        }

        .no-notifications {
          text-align: center;
          padding: 20px;
          color: var(--text-secondary);
        }

        @media (max-width: 768px) {
          .weather-notifications {
            padding: 15px;
          }
          
          .notification-item {
            padding: 12px;
          }
        }
      `}</style>
    </div>
  );
};

export default WeatherNotifications; 