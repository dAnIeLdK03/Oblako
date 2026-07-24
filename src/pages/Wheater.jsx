import { useState } from 'react';
import Forecast from './Forecast';
import { useLanguage } from '../LanguageContext.jsx';
import '../Weather.css';
import {useTheme} from '../ThemeContext.jsx';
import { useHistory } from '../HistoryContext.jsx';
import SunriseSunset from '../components/SunriseSunset.jsx';
import WeatherMap from '../components/WeatherMap.jsx';
import WorldClock from '../components/WorldClock.jsx';
import { useEffect } from 'react';
import SkeletonLoading from '../components/SkeletonLoading.jsx';
import PullToRefresh from '../components/PullToRefresh.jsx';
import WeatherHero from '../components/WeatherHero.jsx';


function Weather() {
    const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
    const { language, changeLanguage, t } = useLanguage();
    const { theme, toggleTheme, temperatureUnit, toggleTemperatureUnit, convertTemperature, getTemperatureSymbol } = useTheme();
    const { searchHistory, addToHistory, clearHistory } = useHistory();

    const [city, setCity] = useState('');

    const [weatherData, setWeatherData] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [mapSelectedCity, setMapSelectedCity] = useState(null);

    useEffect(() => {
        getWeather(null, 'Sofia');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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

    return (
        <>

            <div className={containerClass}>
            <WeatherHero
                weatherData={weatherData}
                loading={loading}
                error={error}
                city={city}
                setCity={setCity}
                onSearchSubmit={getWeather}
                onLocationClick={getCurrentLocation}
                language={language}
                changeLanguage={changeLanguage}
                theme={theme}
                toggleTheme={toggleTheme}
                temperatureUnit={temperatureUnit}
                toggleTemperatureUnit={toggleTemperatureUnit}
                convertTemperature={convertTemperature}
                getTemperatureSymbol={getTemperatureSymbol}
                translateWeatherCondition={translateWeatherCondition}
                searchHistory={searchHistory}
                onHistoryClick={handleHistoryClick}
                clearHistory={clearHistory}
                t={t}
            />

            <div style={{display: 'flex', justifyContent: 'flex-start', alignItems: 'center', marginTop: '20px', marginBottom: '10px', marginLeft: '20px'}}>
                <WorldClock city="Sofia" language={language} hasError={false} />
            </div>

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
