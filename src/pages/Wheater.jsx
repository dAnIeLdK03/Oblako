import { useState } from 'react';
import Forecast from './Forecast';
import { useLanguage } from '../LanguageContext.jsx';
import '../Weather.css';
import {useTheme} from '../ThemeContext.jsx';
import { useHistory } from '../HistoryContext.jsx';
import SunriseSunset from '../components/SunriseSunset.jsx';
import WeatherMap from '../components/WeatherMap.jsx';
import WorldClock from '../components/WorldClock.jsx';
import { useEffect, useRef } from 'react';
import SkeletonLoading from '../components/SkeletonLoading.jsx';
import PullToRefresh from '../components/PullToRefresh.jsx';
import WeatherHero from '../components/WeatherHero.jsx';
import { verifyLocation } from '../utils/location.js';
import { getWeather as fetchWeather, isAbortError } from '../services/weather';
import { weatherErrorMessage } from '../utils/weatherErrors.js';
import { BarChart3, Calendar, MapPin, Eye, Droplet, Thermometer, Wind } from 'lucide-react';


function Weather() {
    const { language, changeLanguage, t } = useLanguage();
    const { theme, toggleTheme, temperatureUnit, toggleTemperatureUnit, convertTemperature, getTemperatureSymbol } = useTheme();
    const { searchHistory, addToHistory, clearHistory } = useHistory();

    const [city, setCity] = useState('');

    const [weatherData, setWeatherData] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [mapSelectedCity, setMapSelectedCity] = useState(null);
    const [locationWarning, setLocationWarning] = useState(null);
    const didInitLocation = useRef(false);
    const requestRef = useRef(null);

    // Всяка нова заявка отменя предишната, за да не презапише по-стар отговор по-новия
    function startRequest() {
        requestRef.current?.abort();
        const controller = new AbortController();
        requestRef.current = controller;
        return controller;
    }

    async function getWeather(e, searchCity = null){
        if (e) e.preventDefault();
        const cityToSearch = searchCity || city;
        if (!cityToSearch.trim()) {
            return;
        }

        const controller = startRequest();
        setLoading(true);
        try{
            setError('');
            setLocationWarning(null);
            const data = await fetchWeather({ city: cityToSearch }, { signal: controller.signal });
            setWeatherData(data);


            addToHistory(data.place.name);
            setCity(data.place.name);

        }catch(err){
            if (isAbortError(err)) return; // заменена от по-нова заявка
            setError(weatherErrorMessage(err, t));
            setWeatherData(null);
        } finally {
            if (requestRef.current === controller) setLoading(false);
        }
    }

    const getCurrentLocation = async (fallbackCity = null) => {
        if (!navigator.geolocation) {
            if (fallbackCity) getWeather(null, fallbackCity);
            else setError(t('locationError') + ': ' + t('locationNotSupported'));
            return;
        }
        setLoading(true);
        setError('');
        // Проверка с Permissions API
        if (navigator.permissions) {
            try {
                const status = await navigator.permissions.query({ name: 'geolocation' });
                if (status.state === 'denied') {
                    if (fallbackCity) getWeather(null, fallbackCity);
                    else setError(t('locationError') + ': ' + t('locationPermissionDenied') + '. ' + t('locationEnableInstructions'));
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
                const controller = startRequest();
                try {
                    // Допълнителна проверка на точността на позицията
                    const check = verifyLocation(position);
                    setLocationWarning(check.ok ? null : check);
                    // Услугата връща и реалното име на населеното място
                    const data = await fetchWeather({ lat: latitude, lon: longitude }, { signal: controller.signal });
                    setWeatherData(data);
                    setCity(data.place.name);
                    setError('');
                } catch (err) {
                    if (isAbortError(err)) return;
                    if (fallbackCity) getWeather(null, fallbackCity);
                    else setError(weatherErrorMessage(err, t));
                } finally {
                    if (requestRef.current === controller) setLoading(false);
                }
            },
            (geoError) => {
                if (fallbackCity) {
                    getWeather(null, fallbackCity);
                    setLoading(false);
                    return;
                }
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

    useEffect(() => {
        if (didInitLocation.current) return;
        didInitLocation.current = true;
        getCurrentLocation('Sofia');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


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

    const getWeatherTheme = (condition) => {

        if (!condition.isDay) {
            return 'night';
        }

        let theme;
        switch (condition.group) {
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

    const containerClass = `weather-container ${weatherData ? getWeatherTheme(weatherData.current.condition) : ''}`;

    const handleHistoryClick = (historyCity) => {
        setCity(historyCity);
        getWeather(null, historyCity);
    };

    // При клик на карта зареждам данните и показвам прогнозата
    const handleMapWeather = async (data) => {
        setWeatherData(data);
        setError('');
        setCity(data.place.name); // Обновяваме града в търсачката
        setMapSelectedCity(data.place.name); // Запазваме града от картата
        
        // Добавяме в историята
        addToHistory(data.place.name);
        
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
                onLocationClick={() => getCurrentLocation()}
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

            <PullToRefresh onRefresh={handleRefresh}>
                {loading && <SkeletonLoading />}
                {error && <div className="wp-error">{error}</div>}
                {locationWarning && (
                    <div className="wp-error">
                        {language === 'bg'
                            ? 'Локацията е с ниска точност. Проверете дали е правилна или потърсете града ръчно.'
                            : 'Location accuracy is low. Please verify it or search for your city manually.'}
                    </div>
                )}
                {mapSelectedCity && (
                    <div className="wp-toast">
                        <MapPin size={16} className="wp-toast-icon" /> {language === 'bg' ? 'Избрано от картата:' : 'Selected from map:'} {mapSelectedCity}
                    </div>
                )}

                {weatherData && (
                <div className="wp-content">
                    <div className="wp-grid">
                        <div className="wp-card">
                            <h3 className="wp-card-title"><BarChart3 size={20} className="wp-card-title-icon" /> {t('overview')}</h3>
                            <div className="wp-stat-list">
                                <div className="wp-stat">
                                    <Calendar size={16} className="wp-stat-icon" />
                                    <span>{formatDate(weatherData.current.time)}</span>
                                </div>
                                <div className="wp-stat">
                                    <MapPin size={16} className="wp-stat-icon" />
                                    <span>{weatherData.place.name}, {weatherData.place.country}</span>
                                </div>
                                <div className="wp-stat">
                                    <Eye size={16} className="wp-stat-icon" />
                                    <span>{t('visibility')}: {weatherData.current.visibility / 1000} km</span>
                                </div>
                                <div className="wp-stat">
                                    <Droplet size={16} className="wp-stat-icon" />
                                    <span>{t('humidity')}: {weatherData.current.humidity}%</span>
                                </div>
                                <div className="wp-stat">
                                    <Thermometer size={16} className="wp-stat-icon" />
                                    <span>{t('feelsLike')}: {convertTemperature(weatherData.current.feelsLike)}{getTemperatureSymbol()}</span>
                                </div>
                                <div className="wp-stat">
                                    <Wind size={16} className="wp-stat-icon" />
                                    <span>{t('wind')}: {Math.round(weatherData.current.windSpeed * 3.6)} km/h</span>
                                </div>
                            </div>

                            <div className="wp-clock-wrap">
                                <WorldClock city="Sofia" language={language} hasError={false} />
                            </div>
                        </div>

                        <SunriseSunset weatherData={weatherData} />
                    </div>

                    <div className="wp-section">
                        <Forecast weather={weatherData} />
                    </div>
                </div>
            )}

            {/* Интерактивна карта най-отдолу */}
            <div className="wp-section">
                <WeatherMap onLocationSelect={handleMapWeather} />
            </div>
            </PullToRefresh>
            </div>
        </>
    );
}

export default Weather;
