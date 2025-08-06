import React, { useState, useEffect } from 'react';
import { useLanguage } from '../LanguageContext.jsx';

const Achievements = () => {
  const { language } = useLanguage();
  const [achievements, setAchievements] = useState([]);
  const [userPoints, setUserPoints] = useState(0);
  const [showUnlocked, setShowUnlocked] = useState(false);

  const translations = {
    bg: {
      title: "Постижения",
      description: "Отключете постижения и спечелете точки",
      points: "точки",
      totalPoints: "Общо точки",
      unlocked: "Отключени",
      locked: "Заключени",
      viewUnlocked: "Преглед на отключените",
      hideUnlocked: "Скрий отключените",
      achievements: {
        firstSearch: {
          title: "Първо търсене",
          description: "Направете първото си търсене за времето",
          points: 10,
          icon: "🔍"
        },
        dailyUser: {
          title: "Ежедневен потребител",
          description: "Посетете приложението 7 дни подред",
          points: 50,
          icon: "📅"
        },
        weatherExpert: {
          title: "Експерт по времето",
          description: "Проверете времето 100 пъти",
          points: 100,
          icon: "🌤️"
        },
        uvMaster: {
          title: "UV майстор",
          description: "Проверете UV индекса 20 пъти",
          points: 30,
          icon: "☀️"
        },
        airQualityGuru: {
          title: "Гуру на качеството на въздуха",
          description: "Проверете качеството на въздуха 15 пъти",
          points: 40,
          icon: "🌬️"
        },
        rainTracker: {
          title: "Проследявач на дъжда",
          description: "Проверете вероятността за дъжд 25 пъти",
          points: 35,
          icon: "🌧️"
        },
        blogReader: {
          title: "Читател на блога",
          description: "Прочетете 5 блог статии",
          points: 25,
          icon: "📖"
        },
        sharer: {
          title: "Споделятел",
          description: "Споделете прогнозата 10 пъти",
          points: 45,
          icon: "📤"
        },
        pwaInstaller: {
          title: "PWA инсталатор",
          description: "Инсталирайте приложението на устройството си",
          points: 75,
          icon: "📱"
        },
        offlineUser: {
          title: "Офлайн потребител",
          description: "Използвайте приложението офлайн",
          points: 60,
          icon: "📡"
        }
      }
    },
    en: {
      title: "Achievements",
      description: "Unlock achievements and earn points",
      points: "points",
      totalPoints: "Total points",
      unlocked: "Unlocked",
      locked: "Locked",
      viewUnlocked: "View unlocked",
      hideUnlocked: "Hide unlocked",
      achievements: {
        firstSearch: {
          title: "First Search",
          description: "Make your first weather search",
          points: 10,
          icon: "🔍"
        },
        dailyUser: {
          title: "Daily User",
          description: "Visit the app for 7 consecutive days",
          points: 50,
          icon: "📅"
        },
        weatherExpert: {
          title: "Weather Expert",
          description: "Check weather 100 times",
          points: 100,
          icon: "🌤️"
        },
        uvMaster: {
          title: "UV Master",
          description: "Check UV index 20 times",
          points: 30,
          icon: "☀️"
        },
        airQualityGuru: {
          title: "Air Quality Guru",
          description: "Check air quality 15 times",
          points: 40,
          icon: "🌬️"
        },
        rainTracker: {
          title: "Rain Tracker",
          description: "Check rain probability 25 times",
          points: 35,
          icon: "🌧️"
        },
        blogReader: {
          title: "Blog Reader",
          description: "Read 5 blog articles",
          points: 25,
          icon: "📖"
        },
        sharer: {
          title: "Sharer",
          description: "Share forecast 10 times",
          points: 45,
          icon: "📤"
        },
        pwaInstaller: {
          title: "PWA Installer",
          description: "Install the app on your device",
          points: 75,
          icon: "📱"
        },
        offlineUser: {
          title: "Offline User",
          description: "Use the app offline",
          points: 60,
          icon: "📡"
        }
      }
    }
  };

  const t = translations[language] || translations.bg;

  useEffect(() => {
    // Зареждаме постиженията от localStorage
    const savedAchievements = JSON.parse(localStorage.getItem('achievements') || '[]');
    const savedPoints = parseInt(localStorage.getItem('userPoints') || '0');
    
    setAchievements(savedAchievements);
    setUserPoints(savedPoints);
  }, []);

  const unlockAchievement = (achievementId) => {
    const achievement = t.achievements[achievementId];
    if (achievement && !achievements.includes(achievementId)) {
      const newAchievements = [...achievements, achievementId];
      const newPoints = userPoints + achievement.points;
      
      setAchievements(newAchievements);
      setUserPoints(newPoints);
      
      // Запазваме в localStorage
      localStorage.setItem('achievements', JSON.stringify(newAchievements));
      localStorage.setItem('userPoints', newPoints.toString());
      
      // Показваме известие
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('🎉 Постижение отключено!', {
          body: `${achievement.title} - +${achievement.points} точки`,
          icon: '/icons/icon-192x192.png'
        });
      }
    }
  };

  const getAchievementStatus = (achievementId) => {
    return achievements.includes(achievementId);
  };

  const filteredAchievements = showUnlocked 
    ? Object.keys(t.achievements)
    : Object.keys(t.achievements).filter(id => !getAchievementStatus(id));

  return (
    <div className="achievements">
      <div className="achievements-header">
        <h3>{t.title}</h3>
        <p>{t.description}</p>
        <div className="points-display">
          <span className="points-label">{t.totalPoints}:</span>
          <span className="points-value">{userPoints} {t.points}</span>
        </div>
      </div>

      <div className="achievements-controls">
        <button 
          className="toggle-button"
          onClick={() => setShowUnlocked(!showUnlocked)}
        >
          {showUnlocked ? t.hideUnlocked : t.viewUnlocked}
        </button>
      </div>

      <div className="achievements-grid">
        {filteredAchievements.map(achievementId => {
          const achievement = t.achievements[achievementId];
          const isUnlocked = getAchievementStatus(achievementId);
          
          return (
            <div 
              key={achievementId} 
              className={`achievement-card ${isUnlocked ? 'unlocked' : 'locked'}`}
            >
              <div className="achievement-icon">
                {achievement.icon}
              </div>
              <div className="achievement-content">
                <h4>{achievement.title}</h4>
                <p>{achievement.description}</p>
                <div className="achievement-points">
                  +{achievement.points} {t.points}
                </div>
                <div className="achievement-status">
                  {isUnlocked ? t.unlocked : t.locked}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <style jsx>{`
        .achievements {
          background: var(--card-bg);
          border-radius: 15px;
          padding: 20px;
          margin: 20px 0;
          border: 1px solid var(--border-color);
        }

        .achievements-header h3 {
          margin: 0 0 10px 0;
          color: var(--text-color);
          font-size: 1.2rem;
        }

        .achievements-header p {
          margin: 0 0 15px 0;
          color: var(--text-secondary);
          font-size: 0.9rem;
        }

        .points-display {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 20px;
        }

        .points-label {
          color: var(--text-secondary);
          font-size: 0.9rem;
        }

        .points-value {
          color: var(--accent-color);
          font-weight: bold;
          font-size: 1.1rem;
        }

        .achievements-controls {
          margin-bottom: 20px;
        }

        .toggle-button {
          padding: 8px 16px;
          border: 1px solid var(--border-color);
          border-radius: 20px;
          background: var(--card-bg);
          color: var(--text-color);
          cursor: pointer;
          font-size: 0.9rem;
          transition: all 0.3s ease;
        }

        .toggle-button:hover {
          background: var(--accent-color);
          color: white;
        }

        .achievements-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 15px;
        }

        .achievement-card {
          display: flex;
          align-items: center;
          padding: 15px;
          border-radius: 10px;
          border: 1px solid var(--border-color);
          transition: all 0.3s ease;
        }

        .achievement-card.unlocked {
          background: linear-gradient(135deg, rgba(116, 185, 255, 0.1), rgba(9, 132, 227, 0.1));
          border-color: var(--accent-color);
        }

        .achievement-card.locked {
          background: var(--bg-secondary);
          opacity: 0.7;
        }

        .achievement-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        .achievement-icon {
          font-size: 2rem;
          margin-right: 15px;
          width: 50px;
          text-align: center;
        }

        .achievement-content {
          flex: 1;
        }

        .achievement-content h4 {
          margin: 0 0 5px 0;
          color: var(--text-color);
          font-size: 1rem;
        }

        .achievement-content p {
          margin: 0 0 8px 0;
          color: var(--text-secondary);
          font-size: 0.85rem;
          line-height: 1.4;
        }

        .achievement-points {
          color: var(--accent-color);
          font-weight: bold;
          font-size: 0.9rem;
          margin-bottom: 5px;
        }

        .achievement-status {
          font-size: 0.8rem;
          padding: 2px 8px;
          border-radius: 10px;
          display: inline-block;
        }

        .achievement-card.unlocked .achievement-status {
          background: rgba(116, 185, 255, 0.2);
          color: var(--accent-color);
        }

        .achievement-card.locked .achievement-status {
          background: rgba(108, 117, 125, 0.2);
          color: var(--text-secondary);
        }

        @media (max-width: 768px) {
          .achievements {
            padding: 15px;
          }
          
          .achievements-grid {
            grid-template-columns: 1fr;
          }
          
          .achievement-card {
            padding: 12px;
          }
        }
      `}</style>
    </div>
  );
};

export default Achievements; 