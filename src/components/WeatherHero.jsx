import { useEffect, useState } from 'react';
import { getCityPhoto } from '../utils/cityPhotos';

function WeatherHero({
    weatherData,
    loading,
    error,
    city,
    setCity,
    onSearchSubmit,
    onLocationClick,
    language,
    changeLanguage,
    theme,
    toggleTheme,
    temperatureUnit,
    toggleTemperatureUnit,
    convertTemperature,
    getTemperatureSymbol,
    translateWeatherCondition,
    searchHistory,
    onHistoryClick,
    clearHistory,
    t,
}) {
    const [searchOpen, setSearchOpen] = useState(false);
    const [dailyForecast, setDailyForecast] = useState([]);

    const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

    useEffect(() => {
        if (!weatherData?.name) return;

        async function fetchDailyForecast() {
            try {
                const encodedCity = encodeURIComponent(weatherData.name);
                const res = await fetch(
                    `https://api.openweathermap.org/data/2.5/forecast?q=${encodedCity}&units=metric&appid=${API_KEY}`
                );
                if (!res.ok) return;
                const data = await res.json();

                const byDay = new Map();
                data.list.forEach((entry) => {
                    const dayKey = entry.dt_txt.split(' ')[0];
                    const hour = entry.dt_txt.split(' ')[1];
                    const existing = byDay.get(dayKey);
                    if (!existing || Math.abs(parseInt(hour) - 12) < Math.abs(parseInt(existing.dt_txt.split(' ')[1]) - 12)) {
                        byDay.set(dayKey, entry);
                    }
                });

                setDailyForecast(Array.from(byDay.values()).slice(0, 5));
            } catch {
                setDailyForecast([]);
            }
        }

        fetchDailyForecast();
    }, [weatherData?.name, API_KEY]);

    const weekdayKeys = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

    const handleSubmit = (e) => {
        onSearchSubmit(e);
        setSearchOpen(false);
    };

    const cityName = weatherData?.name;
    const weekday = weatherData ? t(weekdayKeys[new Date(weatherData.dt * 1000).getDay()]) : '';

    return (
        <section
            className="hero"
            style={{ backgroundImage: `url(${getCityPhoto(cityName)})` }}
        >
            <div className="hero-overlay" />

            <div className="hero-topbar">
                <button
                    type="button"
                    className="hero-icon-btn"
                    onClick={() => setSearchOpen((v) => !v)}
                    aria-label={t('searchButton')}
                >
                    🔍
                </button>

                {searchOpen && (
                    <div className="hero-search-panel">
                        <form onSubmit={handleSubmit} className="hero-search-form">
                            <div className="hero-search-input-wrap">
                                <input
                                    type="text"
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                    placeholder={t('searchPlaceholder')}
                                    autoFocus
                                />
                            </div>
                            <button type="submit" className="search-btn" disabled={loading}>
                                {t('searchButton')}
                            </button>
                        </form>
                    </div>
                )}
            </div>

            {error && <div className="hero-error">{error}</div>}

            {weatherData && (
                <div className="hero-bottom">
                    <div className="hero-info">
                        <h1>{cityName},</h1>
                        <h1>{weekday},</h1>
                        <h1>
                            {convertTemperature(weatherData.main.temp)}{getTemperatureSymbol()},
                        </h1>
                        <h1>{translateWeatherCondition(weatherData.weather[0].description)}</h1>
                    </div>

                    {dailyForecast.length > 0 && (
                        <div className="hero-forecast-strip">
                            {dailyForecast.map((day) => (
                                <div key={day.dt} className="hero-forecast-item">
                                    <span className="hero-forecast-day">
                                        {t(weekdayKeys[new Date(day.dt * 1000).getDay()])}
                                    </span>
                                    <img
                                        src={`https://openweathermap.org/img/wn/${day.weather[0].icon}.png`}
                                        alt={day.weather[0].description}
                                    />
                                    <span className="hero-forecast-temp">
                                        {translateWeatherCondition(day.weather[0].description)}, {convertTemperature(day.main.temp)}{getTemperatureSymbol()}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </section>
    );
}

export default WeatherHero;
