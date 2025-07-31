import { useState } from 'react';
import Forecast from './Forecast';
import { useLanguage } from '../LanguageContext.jsx';
import '../Weather.css';
import {useTheme} from '../ThemeContext.jsx';
import { useHistory } from '../HistoryContext.jsx';
import SunriseSunset from '../components/SunriseSunset.jsx';
import OfflineIndicator from '../components/OfflineIndicator.jsx';
import { useOfflineStorage } from '../hooks/useOfflineStorage.js';
import WeatherMap from '../components/WeatherMap.jsx';
import { useEffect } from 'react';



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
    const { language, changeLanguage, t } = useLanguage();
    const { theme, toggleTheme, temperatureUnit, toggleTemperatureUnit, convertTemperature, getTemperatureSymbol } = useTheme();
    const { searchHistory, addToHistory, clearHistory } = useHistory();
    const { saveWeatherData, saveForecastData } = useOfflineStorage();

    // Добавете нови state-ове
    const [showHistory, setShowHistory] = useState(false);
    
    const [city, setCity] = useState('');
    const [weatherData, setWeatherData] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [mapSelectedCity, setMapSelectedCity] = useState(null);

    const API_KEY = "b5b3e21a258778d1168e59c1ccb83609";

    async function getWeather(e, searchCity = null){
        console.log('getWeather called with:', { e, searchCity, city }); // Debug
        if (e) e.preventDefault();
        const cityToSearch = searchCity || city;
        console.log('cityToSearch:', cityToSearch); // Debug
        if (!cityToSearch.trim()) {
            console.log('No city to search'); // Debug
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
            console.log('Weather API response:', data); // Debug
            setWeatherData(data);

            // Save to offline storage
            saveWeatherData(data, data.name);

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

    // Можете да създадете функция за SVG икони:
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
        console.log('Weather data:', { iconCode, main }); // Debug

        if (iconCode.includes('n')) {
            console.log('Night theme applied');
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

        console.log('Applied theme:', theme);
        return theme;
    };

    const containerClass = `weather-container ${weatherData ? getWeatherTheme(weatherData.weather[0].icon, weatherData.weather[0].main) : ''}`;
    console.log('Container className:', containerClass); // Debug

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
        console.log('Weather data loaded from map:', data.name);
        
        // Скриваме индикацията след 3 секунди
        setTimeout(() => {
            setMapSelectedCity(null);
        }, 3000);
        
        // Прокрутваме до горната част на страницата за да се виждат данните
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const isMobile = useIsMobile();

    return (
        <div className={containerClass}>
            {isMobile ? (
                <div className="header">
                    {/* 1-ви ред: Лого, заглавие, език, тема */}
                    <div className="header-row header-row-top" style={{position: 'relative'}}>
                        <span className="header-logo" role="img" aria-label="logo">☁️</span>
                        <h1 className="header-title">Oblako</h1>
                        <div className="header-controls">
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
                    </div>
                    {/* 2-ри ред: Търсачка и бутон */}
                    <div className="header-row header-row-search">
                        <form onSubmit={getWeather} className="search-form">
                            <input
                                type="text"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                onFocus={handleInputFocus}
                                onBlur={handleInputBlur}
                                placeholder={t('searchPlaceholder')}
                                className="search-input"
                            />
                            <button type="submit" className="search-btn" disabled={loading}>
                                {t('searchButton')}
                            </button>
                        </form>
                    </div>
                    {/* 3-ти ред: Бутон за текущо местоположение (само на мобилни) */}
                    <div className="header-row header-row-location">
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
                    <div className="header-left" style={{position: 'relative'}}>
                        <h1>{t('appTitle')}</h1>
                        <div className="language-selector">
                            <select 
                                className="language-dropdown"
                                value={language}
                                onChange={(e) => changeLanguage(e.target.value)}
                            >
                                <option value="bg">🇧🇬 БГ</option>
                                <option value="en">🇺🇸 EN</option>
                            </select>
                        </div>
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
                    <div className="weather-input">
                        <form onSubmit={getWeather} style={{display: 'flex', gap: '10px', position: 'relative'}}>
                            <div className="search-history">
                                <input
                                    type="text"
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                    onFocus={handleInputFocus}
                                    onBlur={handleInputBlur}
                                    placeholder={t('searchPlaceholder')}
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

            {loading && <div className="loading">{t('loading')}</div>}
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

            {/* PWA Components */}
            <OfflineIndicator />
            {/* Интерактивна карта най-отдолу */}
            <WeatherMap onLocationSelect={handleMapWeather} />
        </div>
    );
}

export default Weather;
