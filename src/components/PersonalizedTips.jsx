import React, { useState, useEffect } from 'react';
import { useLanguage } from '../LanguageContext.jsx';

const PersonalizedTips = ({ weatherData }) => {
  const { language } = useLanguage();
  const [userPreferences, setUserPreferences] = useState({});
  const [tips, setTips] = useState([]);

  const translations = {
    bg: {
      title: "Персонализирани съвети",
      description: "Получете съвети базирани на времето и вашите предпочитания",
      preferences: "Предпочитания",
      activities: "Дейности",
      clothing: "Облекло",
      health: "Здраве",
      travel: "Пътуване",
      savePreferences: "Запази предпочитанията",
      tips: {
        hotWeather: {
          title: "Горещо време",
          tips: [
            "Избягвайте престоя на слънце между 11:00 и 16:00",
            "Пийте много вода - поне 2 литра на ден",
            "Носете леко, светло облекло",
            "Използвайте слънцезащитен крем с SPF 30+",
            "Оставете се в сянката когато е възможно"
          ]
        },
        coldWeather: {
          title: "Студено време",
          tips: [
            "Носете няколко слоя дрехи",
            "Покрийте ушите и ръцете си",
            "Избягвайте продължително престояване на открито",
            "Пийте топли напитки",
            "Проверете дали отоплението работи правилно"
          ]
        },
        rainyWeather: {
          title: "Дъждовно време",
          tips: [
            "Носете дъждобран или чадър",
            "Използвайте водоустойчиви обувки",
            "Избягвайте водните пътища",
            "Проверете дали прозорците са затворени",
            "Внимавайте с мокрите пътища"
          ]
        },
        highUV: {
          title: "Висок UV индекс",
          tips: [
            "Използвайте слънцезащитен крем с висок SPF",
            "Носете слънчеви очила",
            "Покрийте главата с шапка",
            "Ограничете престоя на слънце",
            "Търсете сянка между 10:00 и 16:00"
          ]
        },
        poorAirQuality: {
          title: "Лошо качество на въздуха",
          tips: [
            "Оставете се в закрити помещения",
            "Използвайте въздушен филтър",
            "Избягвайте физическа активност на открито",
            "Затворете прозорците",
            "Мониторирайте симптомите си"
          ]
        }
      }
    },
    en: {
      title: "Personalized Tips",
      description: "Get tips based on weather and your preferences",
      preferences: "Preferences",
      activities: "Activities",
      clothing: "Clothing",
      health: "Health",
      travel: "Travel",
      savePreferences: "Save preferences",
      tips: {
        hotWeather: {
          title: "Hot Weather",
          tips: [
            "Avoid sun exposure between 11:00 AM and 4:00 PM",
            "Drink plenty of water - at least 2 liters per day",
            "Wear light, loose clothing",
            "Use sunscreen with SPF 30+",
            "Stay in the shade when possible"
          ]
        },
        coldWeather: {
          title: "Cold Weather",
          tips: [
            "Wear multiple layers of clothing",
            "Cover your ears and hands",
            "Avoid prolonged outdoor exposure",
            "Drink warm beverages",
            "Check if your heating is working properly"
          ]
        },
        rainyWeather: {
          title: "Rainy Weather",
          tips: [
            "Carry an umbrella or raincoat",
            "Wear waterproof shoes",
            "Avoid waterlogged areas",
            "Check if windows are closed",
            "Be careful with wet roads"
          ]
        },
        highUV: {
          title: "High UV Index",
          tips: [
            "Use sunscreen with high SPF",
            "Wear sunglasses",
            "Cover your head with a hat",
            "Limit sun exposure",
            "Seek shade between 10:00 AM and 4:00 PM"
          ]
        },
        poorAirQuality: {
          title: "Poor Air Quality",
          tips: [
            "Stay indoors",
            "Use an air purifier",
            "Avoid outdoor physical activity",
            "Close windows",
            "Monitor your symptoms"
          ]
        }
      }
    }
  };

  const t = translations[language] || translations.bg;

  useEffect(() => {
    // Зареждаме предпочитанията от localStorage
    const savedPreferences = JSON.parse(localStorage.getItem('userPreferences') || '{}');
    setUserPreferences(savedPreferences);
  }, []);

  useEffect(() => {
    if (weatherData) {
      generateTips();
    }
  }, [weatherData, userPreferences]);

  const generateTips = () => {
    const newTips = [];
    
    // Съвети базирани на температурата
    if (weatherData.temperature > 30) {
      newTips.push({
        type: 'hotWeather',
        title: t.tips.hotWeather.title,
        tips: t.tips.hotWeather.tips,
        icon: '🌡️',
        priority: 'high'
      });
    } else if (weatherData.temperature < 5) {
      newTips.push({
        type: 'coldWeather',
        title: t.tips.coldWeather.title,
        tips: t.tips.coldWeather.tips,
        icon: '❄️',
        priority: 'high'
      });
    }
    
    // Съвети за дъжд
    if (weatherData.description?.toLowerCase().includes('дъжд') || 
        weatherData.description?.toLowerCase().includes('rain')) {
      newTips.push({
        type: 'rainyWeather',
        title: t.tips.rainyWeather.title,
        tips: t.tips.rainyWeather.tips,
        icon: '🌧️',
        priority: 'medium'
      });
    }
    
    // Съвети за UV индекс
    if (weatherData.uvIndex > 7) {
      newTips.push({
        type: 'highUV',
        title: t.tips.highUV.title,
        tips: t.tips.highUV.tips,
        icon: '☀️',
        priority: 'high'
      });
    }
    
    // Съвети за качество на въздуха
    if (weatherData.airQuality > 100) {
      newTips.push({
        type: 'poorAirQuality',
        title: t.tips.poorAirQuality.title,
        tips: t.tips.poorAirQuality.tips,
        icon: '🌬️',
        priority: 'medium'
      });
    }
    
    // Персонализирани съвети базирани на предпочитанията
    if (userPreferences.activities) {
      if (userPreferences.activities.includes('running') && weatherData.temperature > 25) {
        newTips.push({
          type: 'personalized',
          title: 'Съвет за бягане',
          tips: [
            'Бягайте рано сутрин или вечер',
            'Пийте много вода преди и след бягане',
            'Избягвайте бягане в най-горещите часове',
            'Слушайте тялото си'
          ],
          icon: '🏃',
          priority: 'medium'
        });
      }
    }
    
    setTips(newTips);
  };

  const updatePreferences = (category, value) => {
    const newPreferences = {
      ...userPreferences,
      [category]: value
    };
    setUserPreferences(newPreferences);
    localStorage.setItem('userPreferences', JSON.stringify(newPreferences));
  };

  return (
    <div className="personalized-tips">
      <div className="tips-header">
        <h3>{t.title}</h3>
        <p>{t.description}</p>
      </div>

      <div className="preferences-section">
        <h4>{t.preferences}</h4>
        <div className="preferences-grid">
          <div className="preference-group">
            <label>{t.activities}</label>
            <div className="checkbox-group">
              {['running', 'cycling', 'hiking', 'swimming', 'tennis'].map(activity => (
                <label key={activity} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={userPreferences.activities?.includes(activity) || false}
                    onChange={(e) => {
                      const current = userPreferences.activities || [];
                      const newActivities = e.target.checked
                        ? [...current, activity]
                        : current.filter(a => a !== activity);
                      updatePreferences('activities', newActivities);
                    }}
                  />
                  <span>{activity}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="tips-section">
        {tips.length > 0 ? (
          tips.map((tip, index) => (
            <div key={index} className={`tip-card ${tip.priority}`}>
              <div className="tip-header">
                <div className="tip-icon">{tip.icon}</div>
                <h4>{tip.title}</h4>
                <div className={`priority-badge ${tip.priority}`}>
                  {tip.priority === 'high' ? 'Важно' : 'Препоръчително'}
                </div>
              </div>
              <ul className="tip-list">
                {tip.tips.map((tipText, tipIndex) => (
                  <li key={tipIndex}>{tipText}</li>
                ))}
              </ul>
            </div>
          ))
        ) : (
          <div className="no-tips">
            <p>Няма специфични съвети за текущото време</p>
          </div>
        )}
      </div>

      <style jsx>{`
        .personalized-tips {
          background: var(--card-bg);
          border-radius: 15px;
          padding: 20px;
          margin: 20px 0;
          border: 1px solid var(--border-color);
        }

        .tips-header h3 {
          margin: 0 0 10px 0;
          color: var(--text-color);
          font-size: 1.2rem;
        }

        .tips-header p {
          margin: 0 0 20px 0;
          color: var(--text-secondary);
          font-size: 0.9rem;
        }

        .preferences-section {
          margin-bottom: 25px;
        }

        .preferences-section h4 {
          margin: 0 0 15px 0;
          color: var(--text-color);
          font-size: 1rem;
        }

        .preferences-grid {
          display: grid;
          gap: 15px;
        }

        .preference-group label {
          display: block;
          margin-bottom: 10px;
          color: var(--text-color);
          font-weight: 500;
        }

        .checkbox-group {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 8px;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.9rem;
          color: var(--text-color);
          cursor: pointer;
        }

        .checkbox-label input[type="checkbox"] {
          margin: 0;
        }

        .tips-section {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .tip-card {
          padding: 15px;
          border-radius: 10px;
          border: 1px solid var(--border-color);
          background: var(--bg-secondary);
        }

        .tip-card.high {
          border-left: 4px solid #e74c3c;
          background: rgba(231, 76, 60, 0.05);
        }

        .tip-card.medium {
          border-left: 4px solid #f39c12;
          background: rgba(243, 156, 18, 0.05);
        }

        .tip-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 10px;
        }

        .tip-icon {
          font-size: 1.5rem;
        }

        .tip-header h4 {
          margin: 0;
          color: var(--text-color);
          font-size: 1rem;
          flex: 1;
        }

        .priority-badge {
          padding: 2px 8px;
          border-radius: 10px;
          font-size: 0.8rem;
          font-weight: 500;
        }

        .priority-badge.high {
          background: rgba(231, 76, 60, 0.2);
          color: #e74c3c;
        }

        .priority-badge.medium {
          background: rgba(243, 156, 18, 0.2);
          color: #f39c12;
        }

        .tip-list {
          margin: 0;
          padding-left: 20px;
          color: var(--text-secondary);
          font-size: 0.9rem;
          line-height: 1.5;
        }

        .tip-list li {
          margin-bottom: 5px;
        }

        .no-tips {
          text-align: center;
          padding: 20px;
          color: var(--text-secondary);
        }

        @media (max-width: 768px) {
          .personalized-tips {
            padding: 15px;
          }
          
          .checkbox-group {
            grid-template-columns: 1fr;
          }
          
          .tip-card {
            padding: 12px;
          }
        }
      `}</style>
    </div>
  );
};

export default PersonalizedTips; 