import React, { useState, useEffect } from 'react';
import { useLanguage} from '../LanguageContext.jsx';

function SunriseSunset({weatherData}){
    const { t } = useLanguage();
    const [countdown, setCountdown] = useState('');
    const [nextEvent, setNextEvent] = useState('');

    useEffect(() => {
        if(!weatherData || !weatherData.sys) return;

        const updateCountdown = () => {
            const now = new Date();
            const currentTime = Math.floor(now.getTime() / 1000);
        
        const sunrise = weatherData.sys.sunrise;
        const sunset = weatherData.sys.sunset;

        let targetTime, eventType;

        if(currentTime < sunrise){
            targetTime = sunrise;
            eventType = 'sunrise';

        }else if (currentTime < sunset){
            targetTime = sunset;
            eventType = 'sunset';
        }else{
            targetTime = sunrise + (24*60*60);
            eventType = 'sunrise';
        }

        setNextEvent(eventType);
   
        const timeDiff = targetTime - currentTime;

        if(timeDiff <= 0){
            setCountdown('00:00:00');
            return;
        }

        const hours = Math.floor(timeDiff / 3600);
        const minutes = Math.floor(timeDiff % 3600 / 60);
        const seconds = timeDiff % 60;

        setCountdown(
            `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`,
        );
        };

        updateCountdown();

        const interval = setInterval(updateCountdown, 1000);

        return () => clearInterval(interval);
    }, [weatherData]);

    if(!weatherData || !weatherData.sys) return null;

    const formatTime = (timestamp) => {
        const date = new Date(timestamp * 1000);
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
    };

    const sunrise = weatherData.sys.sunrise;
    const sunset = weatherData.sys.sunset;

    return(
        <div className = "sunrise-sunset-container">
            <h3 className = "sun-title">
                🌅 {t('sunriseSunset')}
            </h3>

            <div className = "sun-info-grid">
                {/*Sunrise*/}
                <div className = "sun-info-item">
                    <div className = "sun-icon sunrise-icon">🌅</div>
                    <div className = "sun-details">
                        <span className = "sun-label">{t('sunrise')}</span>
                        <span className = "sun-time">{formatTime(sunrise)}</span>
                    </div>
                </div>

                {/*Sunset*/}
                <div className = "sun-info-item">
                    <div className = "sun-icon sunset-icon">🌇</div>
                    <div className = "sun-details">
                        <span className = "sun-label">{t('sunset')}</span>
                        <span className = "sun-time">{formatTime(sunset)}</span>
                    </div>
                </div>
            </div>

            {/*Countdown Timer*/}
            <div className = "countdown-container">
                <div className = "countdown-header">
                    <span className = "countdown-label">
                        {nextEvent === 'sunrise'? '🌅' : '🌇'} {t('nextEvent')}:
                    </span>
                    <span className = "next-event-name">
                        {nextEvent === 'sunrise' ? t('sunrise') : t('sunset')}
                    </span>
                </div>

                <div className = "countdown-timer">
                    <div className = "countdown-display">
                        {countdown}
                    </div>
                    <div className = "countdown-units">
                        <span>{t('hours')}</span>
                        <span>{t('minutes')}</span>
                        <span>{t('seconds')}</span>
                    </div>
                </div>
            </div>

            {/*Day Length*/}
            <div className = "day-length">
                <span className = "day-length-label">☀️ {t('dayLength')}:</span>
                <span className = "day-length-value">
                    {(() => {
                        const dayLengthSeconds = sunset - sunrise;
                        const hours = Math.floor(dayLengthSeconds / 3600);
                        const minutes = Math.floor((dayLengthSeconds % 3600) / 60);
                        return `${hours}h ${minutes}m`;
                    })()}
                </span>
            </div>
        </div>
    );
}

export default SunriseSunset;
