import { useEffect, useState } from "react";
import { useLanguage } from '../LanguageContext.jsx';
import TemperatureChart from '../components/TemperatureChart.jsx';
import { useOfflineStorage } from '../hooks/useOfflineStorage.js';

function Forecast({city}){
    const { t } = useLanguage();
    const { saveForecastData } = useOfflineStorage();
    const [forecast, setForecast] = useState([]);
    const [forecastData, setForecastData] = useState(null); // Add this
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [chartType, setChartType] = useState('hourly'); // Add this
    const API_KEY = "b5b3e21a258778d1168e59c1ccb83609";

    useEffect(() => {
        if (!city) return;
        
        async function fetchForecast(){
            setLoading(true);
            setError('');
            try {
                const encodedCity = encodeURIComponent(city);
                const res = await fetch(
                    `https://api.openweathermap.org/data/2.5/forecast?q=${encodedCity}&units=metric&appid=${API_KEY}`
                );
                if (!res.ok) throw new Error(t('forecastError'));
                const data = await res.json();
                
                // Store full data for chart
                setForecastData(data);

                // Save to offline storage
                saveForecastData(data, city);

                // Filter for cards display
                const daily = data.list.filter(item => item.dt_txt.includes('12:00:00'));
                setForecast(daily.slice(0, 5));
            } catch (err) {
                console.error('Forecast error:', err);
                setError(err.message);
                setForecast([]);
                setForecastData(null);
            } finally {
                setLoading(false);
            }
        }

        fetchForecast();

    }, [city, t]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        });
    };

    if (loading) return <div className="loading">{t('loadingForecast')}</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="card">
            <h3>{t('forecastTitle')} {city} 🌦️</h3>
            
            {/* Chart Toggle */}
            <div className="chart-toggle">
                <button 
                    className={`chart-toggle-btn ${chartType === 'hourly' ? 'active' : ''}`}
                    onClick={() => setChartType('hourly')}
                >
                    {t('hourlyChart')}
                </button>
                <button 
                    className={`chart-toggle-btn ${chartType === 'daily' ? 'active' : ''}`}
                    onClick={() => setChartType('daily')}
                >
                    {t('dailyChart')}
                </button>
            </div>

            {/* Temperature Chart */}
            <div className="scroll-x">
              <TemperatureChart 
                  forecastData={forecastData} 
                  type={chartType}
              />
            </div>
            
            {/* Existing forecast cards */}
            <div className="forecast-container">
                {forecast.map(day => (
                    <div key={day.dt} className="forecast-item">
                        <p>{formatDate(day.dt_txt)}</p>
                        <img 
                            src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                            alt={day.weather[0].description}
                        />
                        <p className="forecast-temp">{Math.round(day.main.temp)}°C</p>
                        <p>{day.weather[0].description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Forecast;
