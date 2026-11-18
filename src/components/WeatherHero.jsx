import { useState } from 'react';
import { Search } from 'lucide-react';
import { getCityPhoto } from '../utils/cityPhotos';
import { getIconUrl } from '../services/weather';

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
    const weekdayKeys = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

    const handleSubmit = (e) => {
        onSearchSubmit(e);
        setSearchOpen(false);
    };

    const cityName = weatherData?.place.name;
    const weekday = weatherData ? t(weekdayKeys[new Date(weatherData.current.localTime).getDay()]) : '';
    const dailyForecast = weatherData ? weatherData.daily.slice(0, 5) : [];

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
                    <Search size={20} />
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
                            {convertTemperature(weatherData.current.temp)}{getTemperatureSymbol()},
                        </h1>
                        <h1>{translateWeatherCondition(weatherData.current.condition.description)}</h1>
                    </div>

                    {dailyForecast.length > 0 && (
                        <div className="hero-forecast-strip">
                            {dailyForecast.map((day) => (
                                <div key={day.date} className="hero-forecast-item">
                                    <span className="hero-forecast-day">
                                        {t(weekdayKeys[new Date(`${day.date}T12:00:00`).getDay()])}
                                    </span>
                                    <img
                                        src={getIconUrl(day.condition.icon)}
                                        alt={day.condition.description}
                                    />
                                    <span className="hero-forecast-temp">
                                        {translateWeatherCondition(day.condition.description)}, {convertTemperature(day.tempMax)}{getTemperatureSymbol()}
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
