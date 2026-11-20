import { useState } from 'react';
import { Search } from 'lucide-react';
import { getCityPhoto } from '../utils/cityPhotos';
import { getIconUrl } from '../services/weather';
import styles from './WeatherHero.module.css';

function WeatherHero({
    weatherData,
    loading,
    error,
    city,
    setCity,
    onSearchSubmit,
    convertTemperature,
    getTemperatureSymbol,
    translateWeatherCondition,
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
            className={styles.hero}
            style={{ backgroundImage: `url(${getCityPhoto(cityName)})` }}
        >
            <div className={styles['hero-overlay']} />

            <div className={styles['hero-topbar']}>
                <button
                    type="button"
                    className={styles['hero-icon-btn']}
                    onClick={() => setSearchOpen((v) => !v)}
                    aria-label={t('searchButton')}
                >
                    <Search size={20} />
                </button>

                {searchOpen && (
                    <div className={styles['hero-search-panel']}>
                        <form onSubmit={handleSubmit} className={styles['hero-search-form']}>
                            <div className={styles['hero-search-input-wrap']}>
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

            {error && <div className={styles['hero-error']}>{error}</div>}

            {weatherData && (
                <div className={styles['hero-bottom']}>
                    <div className={styles['hero-info']}>
                        <h1>{cityName},</h1>
                        <h1>{weekday},</h1>
                        <h1>
                            {convertTemperature(weatherData.current.temp)}{getTemperatureSymbol()},
                        </h1>
                        <h1>{translateWeatherCondition(weatherData.current.condition.description)}</h1>
                    </div>

                    {dailyForecast.length > 0 && (
                        <div className={styles['hero-forecast-strip']}>
                            {dailyForecast.map((day) => (
                                <div key={day.date} className={styles['hero-forecast-item']}>
                                    <span className={styles['hero-forecast-day']}>
                                        {t(weekdayKeys[new Date(`${day.date}T12:00:00`).getDay()])}
                                    </span>
                                    <img
                                        src={getIconUrl(day.condition.icon)}
                                        alt={day.condition.description}
                                    />
                                    <span className={styles['hero-forecast-temp']}>
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
