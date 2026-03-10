import { useState } from 'react';
import Forecast from './Forecast';
import { useLanguage } from '../LanguageContext.jsx';
import Logo from '../components/Logo.jsx';
import '../Weather.css';
import {useTheme} from '../ThemeContext.jsx';
import { useHistory } from '../HistoryContext.jsx';
import SunriseSunset from '../components/SunriseSunset.jsx';
import WeatherMap from '../components/WeatherMap.jsx';
import WorldClock from '../components/WorldClock.jsx';
import { useEffect } from 'react';
import SkeletonLoading from '../components/SkeletonLoading.jsx';
import PullToRefresh from '../components/PullToRefresh.jsx';





function useIsMobile() {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    return isMobile;
}

function Weather() {
    const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
    const { language, changeLanguage, t } = useLanguage();
    const { theme, toggleTheme, temperatureUnit, toggleTemperatureUnit, convertTemperature, getTemperatureSymbol } = useTheme();
    const { searchHistory, addToHistory, clearHistory } = useHistory();

    
    const [showHistory, setShowHistory] = useState(false);
    
    const [city, setCity] = useState('');

    const [weatherData, setWeatherData] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [mapSelectedCity, setMapSelectedCity] = useState(null);

    async function getWeather(e, searchCity = null){
        if (e) e.preventDefault();
        const cityToSearch = searchCity || city;
        if (!cityToSearch.trim()) {
            return;
        }

        setLoading(true);
        try{
            setError('');
            const encodedCity = encodeURIComponent(cityToSearch);
            const res = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?q=${encodedCity}&units=metric&appid=${API_KEY}`
            );
            if(!res.ok) throw new Error(t('cityNotFound'));
            const data = await res.json();
            console.log('Weather API response:', data);
            setWeatherData(data);


            addToHistory(data.name);
            setCity(data.name);
            setShowHistory(false);

        }catch(err){
            setError(err.message);
            setWeatherData(null);
        } finally {
            setLoading(false);
        }
    }

    const getCurrentLocation = async () => {
        if (!navigator.geolocation) {
            setError(t('locationError') + ': ' + t('locationNotSupported'));
            return;
        }
        setLoading(true);
        setError('');
        // Проверка с Permissions API
        if (navigator.permissions) {
            try {
                const status = await navigator.permissions.query({ name: 'geolocation' });
                if (status.state === 'denied') {
                    setError(t('locationError') + ': ' + t('locationPermissionDenied') + '. ' + t('locationEnableInstructions'));
                    setLoading(false);
                    return;
                }
            } catch (e) {
                // Permissions API не се поддържа, продължаваме нататък
            }
        }
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                try {
                    const res = await fetch(
                        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`
                    );
                    if (!res.ok) throw new Error(t('locationError'));
                    const data = await res.json();
                    setWeatherData(data);
                    setCity(data.name);
                    setError('');
                } catch (err) {
                    setError(t('locationError'));
                } finally {
                    setLoading(false);
                }
            },
            (geoError) => {
                let msg = t('locationError');
                if (geoError.code === 1) msg += ': ' + t('locationPermissionDenied') + '. ' + t('locationEnableInstructions');
                else if (geoError.code === 2) msg += ': ' + t('locationUnavailable');
                else if (geoError.code === 3) msg += ': ' + t('locationTimeout');
                setError(msg);
                setLoading(false);
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    };
    

    // Функция за превод на weather условията
    const translateWeatherCondition = (condition) => {
        const conditionMap = {
            'clear sky': t('clear'),
            'few clouds': t('clouds'),
            'scattered clouds': t('clouds'),
            'broken clouds': t('clouds'),
            'shower rain': t('rain'),
            'rain': t('rain'),
            'thunderstorm': t('thunderstorm'),
            'snow': t('snow'),
            'mist': t('mist')
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
                t('january'), t('february'), t('march'), t('april'),
                t('may'), t('june'), t('july'), t('august'),
                t('september'), t('october'), t('november'), t('december')
            ];
            return `${day} ${monthNames[month]} ${year}`;
        } else {
            return date.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        }
    };

    const getWeatherSVG = (iconCode) => {
        const iconMap = {
            '01d': '☀️', // clear sky day
            '01n': '🌙', // clear sky night
            '02d': '⛅', // few clouds day
            '02n': '☁️', // few clouds night
            '03d': '☁️', // scattered clouds
            '04d': '☁️', // broken clouds
            '09d': '🌧️', // shower rain
            '10d': '🌦️', // rain day
            '11d': '⛈️', // thunderstorm
            '13d': '❄️', // snow
            '50d': '🌫️'  // mist
        };
        return iconMap[iconCode] || '🌤️';
    };

    const getWeatherTheme = (iconCode, main) => {

        if (iconCode.includes('n')) {
            return 'night';
        }

        let theme;
        switch (main.toLowerCase()) {
            case 'clear': theme = 'sunny'; break;
            case 'clouds': theme = 'cloudy'; break;
            case 'rain':
            case 'drizzle': theme = 'rainy'; break;
            case 'snow': theme = 'snowy'; break;
            case 'thunderstorm': theme = 'stormy'; break;
            default: theme = 'default';
        }

        return theme;
    };

    const containerClass = `weather-container ${weatherData ? getWeatherTheme(weatherData.weather[0].icon, weatherData.weather[0].main) : ''}`;

    const handleHistoryClick = (historyCity) => {
        setCity(historyCity);
        getWeather(null, historyCity);
    };

    const handleInputFocus = () => {
        setShowHistory(true);
    };

    const handleInputBlur = () => {
        // Delay to allow click on history items
        setTimeout(() => setShowHistory(false), 200);
    };

    // При клик на карта зареждам данните и показвам прогнозата
    const handleMapWeather = async (data) => {
        setWeatherData(data);
        setError('');
        setCity(data.name); // Обновяваме града в търсачката
        setMapSelectedCity(data.name); // Запазваме града от картата
        
        // Добавяме в историята
        addToHistory(data.name);
        
        // Показваме съобщение за успешно зареждане
        
        // Скриваме индикацията след 3 секунди
        setTimeout(() => {
            setMapSelectedCity(null);
        }, 3000);
        
        // Прокрутваме до горната част на страницата за да се виждат данните
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleRefresh = async () => {
        if (city) {
            await getWeather(null, city);
        }
    };

    const isMobile = useIsMobile();

    return (
        <>
            
            <div className={containerClass}>
            {isMobile ? (
                <div className="header">
                    {/* 1-ви ред: Лого центрирано */}
                    <div className="header-row header-row-logo" style={{position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', marginTop: '-10px', paddingTop: '0'}}>
                        <Logo size="xxlarge" showText={false} />
                    </div>
                    {/* 2-ри ред: Контроли */}
                    <div className="header-row header-row-controls" style={{position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', marginTop: '15px'}}>
                        <select 
                            className="language-dropdown"
                            value={language}
                            onChange={(e) => changeLanguage(e.target.value)}
                        >
                            <option value="bg">🇧🇬 БГ</option>
                            <option value="en">🇺🇸 EN</option>
                        </select>
                        <button
                            className="theme-toggle"
                            onClick={() => {
                                console.log('Theme toggle clicked, current theme:', theme);
                                toggleTheme();
                            }}
                            title={theme === 'dark' ? t('lightMode') : t('darkMode')}
                        >
                            {theme === 'dark' ? '☀️' : '🌙'}
                        </button>
                        <button
                            className="temp-toggle"
                            onClick={() => {
                                console.log('Temperature toggle clicked, current unit:', temperatureUnit);
                                toggleTemperatureUnit();
                            }}
                            title={temperatureUnit === 'celsius' ? 'Switch to Fahrenheit' : 'Switch to Celsius'}
                        >
                            🌡️ {temperatureUnit === 'celsius' ? '°F' : '°C'}
                        </button>
                    </div>
                    {/* 3-ти ред: Търсачка и бутон */}
                    <div className="header-row header-row-search" style={{position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px'}}>
                        <form onSubmit={getWeather} className="search-form" style={{display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px', width: '100%', maxWidth: '500px'}}>
                            <input
                                type="text"
                                value={city}
                                onChange={(e) => {
                                    setCity(e.target.value);
                                }}
                                onFocus={handleInputFocus}
                                onBlur={handleInputBlur}
                                placeholder={t('searchPlaceholder')}
                                className="search-input"
                                style={{flex: '1', maxWidth: '300px'}}
                            />
                            <button type="submit" className="search-btn" disabled={loading}>
                                {t('searchButton')}
                            </button>
                        </form>
                    </div>
                    {/* 4-ти ред: Бутон за текущо местоположение (само на мобилни) */}
                    <div className="header-row header-row-location" style={{position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px'}}>
                        <button
                            type="button"
                            className="location-btn"
                            onClick={getCurrentLocation}
                            disabled={loading}
                        >
                            {t('currentLocation')}
                        </button>
                    </div>
                </div>
            ) : (
                <div className="header">
                    {/* Лого центрирано */}
                    <div className="desktop-logo" style={{position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', paddingTop: '0'}}>
                        <Logo size="xxlarge" showText={false} />
                    </div>
                    {/* Контроли */}
                    <div className="header-controls" style={{position: 'relative', display: 'flex', alignItems: 'center', gap: '25px', marginTop: '20px', marginBottom: '20px'}}>
                        <select 
                            className="language-dropdown"
                            value={language}
                            onChange={(e) => changeLanguage(e.target.value)}
                        >
                            <option value="bg">🇧🇬 БГ</option>
                            <option value="en">🇺🇸 EN</option>
                        </select>
                        <button
                            className="theme-toggle"
                            onClick={() => {
                                console.log('Theme toggle clicked, current theme:', theme);
                                toggleTheme();
                            }}
                            title={theme === 'dark' ? t('lightMode') : t('darkMode')}
                        >
                            {theme === 'dark' ? '☀️' : '🌙'}
                            {theme === 'dark' ? t('lightMode') : t('darkMode')}
                        </button>
                        <button
                            className="temp-toggle"
                            onClick={() => {
                                console.log('Temperature toggle clicked, current unit:', temperatureUnit);
                                toggleTemperatureUnit();
                            }}
                            title={temperatureUnit === 'celsius' ? 'Switch to Fahrenheit' : 'Switch to Celsius'}
                        >
                            🌡️ {temperatureUnit === 'celsius' ? '°F' : '°C'}
                        </button>
                    </div>
                    
                    {/* World Clock - винаги видим в desktop версията */}
                    <div style={{display: 'flex', justifyContent: 'flex-start', alignItems: 'center', marginTop: '10px', marginBottom: '10px', marginLeft: '20px'}}>
                        <WorldClock city="Sofia" language={language} hasError={false} />
                    </div>
                    
                    <div className="weather-input" style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '10px'}}>
                        <form onSubmit={getWeather} style={{display: 'flex', gap: '10px', position: 'relative', justifyContent: 'center', alignItems: 'center', width: '100%', maxWidth: '600px'}}>
                            <div className="search-history" style={{flex: '1', maxWidth: '300px'}}>
                                                            <input
                                type="text"
                                value={city}
                                onChange={(e) => {
                                    setCity(e.target.value);
                                }}
                                onFocus={handleInputFocus}
                                onBlur={handleInputBlur}
                                placeholder={t('searchPlaceholder')}
                                style={{width: '100%'}}
                            />
                                {/* History Dropdown */}
                                {showHistory && (
                                    <div className="history-dropdown">
                                        {searchHistory.length > 0 ? (
                                            <>
                                                {searchHistory.map((historyCity, index) => (
                                                    <div
                                                        key={index}
                                                        className="history-item"
                                                        onClick={() => handleHistoryClick(historyCity)}
                                                    >
                                                        <span className="history-item-text">{historyCity}</span>
                                                        <span className="history-icon">🕒</span>
                                                    </div>
                                                ))}
                                                <div 
                                                    className="clear-history"
                                                    onClick={clearHistory}
                                                >
                                                    {t('clearHistory')}
                                                </div>
                                            </>
                                        ) : (
                                            <div className="no-history">
                                                {t('noHistory')}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                            <button type="submit" className="search-btn" disabled={loading}>
                                {t('searchButton')}
                            </button>
                            <button
                                type="button"
                                className="location-btn"
                                onClick={getCurrentLocation}
                                disabled={loading}
                            >
                                {t('currentLocation')}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <PullToRefresh onRefresh={handleRefresh}>
                {loading && <SkeletonLoading />}
                {error && <div className="error-message">{error}</div>}
                {mapSelectedCity && (
                    <div className="map-selected-notification">
                        📍 {language === 'bg' ? 'Избрано от картата:' : 'Selected from map:'} {mapSelectedCity}
                    </div>
                )}

                {weatherData && (
                <div className="weather-data">
                    <div className="weather-left">
                        <div className="card">
                            <div className="current-weather">
                                <div className="details">
                                    <p>{t('now')}</p>
                                    <h2>{convertTemperature(weatherData.main.temp)}{getTemperatureSymbol()}</h2>
                                    <p>{translateWeatherCondition(weatherData.weather[0].description)}</p>
                                </div>
                                <div className="weather-icon">
                                    <img
                                        src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
                                        alt={weatherData.weather[0].description}
                                    />
                                </div>
                            </div>
                            <hr />
                            <div className="card-footer">
                                <p>
                                    📅 {formatDate(weatherData.dt)}
                                </p>
                                <p>
                                    📍 {weatherData.name}, {weatherData.sys.country}
                                </p>
                                <p>
                                    👁️ {t('visibility')}: {weatherData.visibility / 1000} km
                                </p>
                                <p>
                                    💧 {t('humidity')}: {weatherData.main.humidity}%
                                </p>
                            </div>
                        </div>

                        {/* Sunrise & Sunset Component */}
                        <SunriseSunset weatherData={weatherData} />
                        

                        
                        {console.log('weatherData:', weatherData)}
                        {console.log('weatherData.timezone:', weatherData && weatherData.timezone)}
                    </div>

                    <div className="weather-right">
                        {city && <Forecast city={city} />}
                    </div>
                </div>
            )}

            {/* Интерактивна карта най-отдолу */}
            <WeatherMap onLocationSelect={handleMapWeather} />
            </PullToRefresh>
            </div>
        </>
    );
}

export default Weather;
