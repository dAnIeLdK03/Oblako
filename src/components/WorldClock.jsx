import React, { useState, useEffect } from 'react';

const WorldClock = ({ city, language, hasError = false }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isAnimating, setIsAnimating] = useState(false);

  // Времеви зони за различните градове
  const timeZones = {
    'Sofia': 'Europe/Sofia',
    'Plovdiv': 'Europe/Sofia',
    'Varna': 'Europe/Sofia',
    'Burgas': 'Europe/Sofia',
    'London': 'Europe/London',
    'Paris': 'Europe/Paris',
    'Berlin': 'Europe/Berlin',
    'Rome': 'Europe/Rome',
    'Madrid': 'Europe/Madrid',
    'Moscow': 'Europe/Moscow',
    'New York': 'America/New_York',
    'Los Angeles': 'America/Los_Angeles',
    'Tokyo': 'Asia/Tokyo',
    'Beijing': 'Asia/Shanghai',
    'Sydney': 'Australia/Sydney',
    'Dubai': 'Asia/Dubai',
    'Mumbai': 'Asia/Kolkata',
    'Singapore': 'Asia/Singapore',
    // Добавяме повече градове
    'london': 'Europe/London',
    'paris': 'Europe/Paris',
    'berlin': 'Europe/Berlin',
    'rome': 'Europe/Rome',
    'madrid': 'Europe/Madrid',
    'moscow': 'Europe/Moscow',
    'new york': 'America/New_York',
    'los angeles': 'America/Los_Angeles',
    'tokyo': 'Asia/Tokyo',
    'beijing': 'Asia/Shanghai',
    'sydney': 'Australia/Sydney',
    'dubai': 'Asia/Dubai',
    'mumbai': 'Asia/Kolkata',
    'singapore': 'Asia/Singapore'
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 500);
    return () => clearTimeout(timer);
  }, [city]);

  const getCityTime = (cityName) => {
    const normalizedCity = cityName.toLowerCase();
    const timeZone = timeZones[normalizedCity] || timeZones[cityName] || 'Europe/Sofia';
    return currentTime.toLocaleTimeString('bg-BG', {
      timeZone: timeZone,
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getCityDate = (cityName) => {
    const normalizedCity = cityName.toLowerCase();
    const timeZone = timeZones[normalizedCity] || timeZones[cityName] || 'Europe/Sofia';
    return currentTime.toLocaleDateString('bg-BG', {
      timeZone: timeZone,
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const translations = {
    bg: {
      currentTime: 'Текущо време',
      in: 'в',
      cityNotFound: 'Градът не е намерен'
    },
    en: {
      currentTime: 'Current time',
      in: 'in',
      cityNotFound: 'City not found'
    }
  };

  const t = translations[language] || translations.bg;

  return (
    <div className="digital-clock-container">
      <div className={`digital-clock ${isAnimating ? 'animate' : ''} ${hasError ? 'error' : ''}`}>
        {hasError ? (
          <>
            <div className="time-display">--:--:--</div>
            <div className="city-name error-text">{city}</div>
            <div className="date-display">{t.cityNotFound}</div>
          </>
        ) : (
          <>
            <div className="time-display">{getCityTime(city)}</div>
            <div className="city-name">{city}</div>
            <div className="date-display">{getCityDate(city)}</div>
          </>
        )}
      </div>
      <div className="clock-label">
        {hasError ? t.cityNotFound : `${t.currentTime} ${t.in} ${city}`}
      </div>
    </div>
  );
};

export default WorldClock; 