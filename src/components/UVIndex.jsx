import React from 'react';
import { Sun } from 'lucide-react';
import { useLanguage } from '../LanguageContext.jsx';
import styles from './UVIndex.module.css';

const UVIndex = ({ weatherData }) => {
  const { language } = useLanguage();

  const getUVLevel = (uvIndex) => {
    if (uvIndex <= 2) return { level: 'low', color: '#4CAF50' };
    if (uvIndex <= 5) return { level: 'moderate', color: '#FF9800' };
    if (uvIndex <= 7) return { level: 'high', color: '#FF5722' };
    if (uvIndex <= 10) return { level: 'very_high', color: '#9C27B0' };
    return { level: 'extreme', color: '#F44336' };
  };

  const getUVAdvice = (uvIndex, level) => {
    const advice = {
      low: {
        bg:
          language === 'bg'
            ? 'Нисък UV индекс - безопасно за престой на открито'
            : 'Low UV index - safe for outdoor activities',
        en:
          language === 'bg'
            ? 'Можете да сте на открито без защита'
            : 'You can be outdoors without protection',
      },
      moderate: {
        bg:
          language === 'bg'
            ? 'Умерен UV индекс - използвайте слънцезащитен крем'
            : 'Moderate UV index - use sunscreen',
        en:
          language === 'bg'
            ? 'Препоръчва се слънцезащитен крем SPF 30+'
            : 'Sunscreen SPF 30+ recommended',
      },
      high: {
        bg:
          language === 'bg'
            ? 'Висок UV индекс - ограничете престоя на слънце'
            : 'High UV index - limit sun exposure',
        en:
          language === 'bg'
            ? 'Избягвайте слънцето между 10:00-16:00'
            : 'Avoid sun between 10:00-16:00',
      },
      very_high: {
        bg:
          language === 'bg'
            ? 'Много висок UV индекс - избягвайте слънцето'
            : 'Very high UV index - avoid sun exposure',
        en:
          language === 'bg'
            ? 'Останете в сянка и използвайте защита'
            : 'Stay in shade and use protection',
      },
      extreme: {
        bg:
          language === 'bg'
            ? 'Екстремен UV индекс - избягвайте открито'
            : 'Extreme UV index - avoid outdoors',
        en:
          language === 'bg'
            ? 'Останете на закрито между 10:00-16:00'
            : 'Stay indoors between 10:00-16:00',
      },
    };
    return advice[level];
  };

  if (!weatherData?.current) return null;
  const { current } = weatherData;
  // Реален UV индекс от доставчика (0 нощем)
  const uvIndex = Math.round(current.uv * 10) / 10;

  const uvLevel = getUVLevel(uvIndex);
  const uvAdvice = getUVAdvice(uvIndex, uvLevel.level);

  return (
    <div className={styles['uv-index-card']}>
      <div className={styles['uv-header']}>
        <div className={styles['uv-icon']}>
          <Sun size={22} />
        </div>
        <h3>{language === 'bg' ? 'UV Индекс' : 'UV Index'}</h3>
      </div>

      <div className="uv-content">
        <div className={styles['uv-display']}>
          <div className={styles['uv-value']} style={{ color: uvLevel.color }}>
            {uvIndex}
          </div>
          <div className={styles['uv-level']}>
            <span className={styles['uv-level-dot']} style={{ backgroundColor: uvLevel.color }} />
            <span className={styles['uv-level-text']}>
              {language === 'bg'
                ? uvLevel.level === 'low'
                  ? 'Нисък'
                  : uvLevel.level === 'moderate'
                    ? 'Умерен'
                    : uvLevel.level === 'high'
                      ? 'Висок'
                      : uvLevel.level === 'very_high'
                        ? 'Много висок'
                        : 'Екстремен'
                : uvLevel.level.charAt(0).toUpperCase() + uvLevel.level.slice(1).replace('_', ' ')}
            </span>
          </div>
        </div>

        <div className={styles['uv-bar']}>
          <div
            className={styles['uv-bar-fill']}
            style={{
              width: `${Math.min(uvIndex / 11, 1) * 100}%`,
              backgroundColor: uvLevel.color,
            }}
          ></div>
        </div>

        <div className={styles['uv-advice']}>
          <div className={styles['advice-main']}>{uvAdvice.bg}</div>
          <div className={styles['advice-detail']}>{uvAdvice.en}</div>
        </div>

        <div className={styles['uv-details']}>
          <div className={styles['detail-item']}>
            <span className={styles['detail-label']}>{language === 'bg' ? 'Време' : 'Time'}</span>
            <span className={styles['detail-value']}>
              {new Date(current.localTime).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
              })}
            </span>
          </div>
          <div className={styles['detail-item']}>
            <span className={styles['detail-label']}>
              {language === 'bg' ? 'Времето' : 'Weather'}
            </span>
            <span className={styles['detail-value']}>{current.condition.description}</span>
          </div>
          <div className={styles['detail-item']}>
            <span className={styles['detail-label']}>
              {language === 'bg' ? 'Облаци' : 'Clouds'}
            </span>
            <span className={styles['detail-value']}>{current.cloudCover ?? 0}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UVIndex;
