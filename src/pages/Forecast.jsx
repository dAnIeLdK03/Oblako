import { useEffect, useState } from "react";
import { useLanguage } from '../LanguageContext.jsx';
import { useTheme } from '../ThemeContext.jsx';
import Logo from '../components/Logo.jsx';
import TemperatureChart from '../components/TemperatureChart.jsx';

function Forecast({city}){
    const { t } = useLanguage();
    const { convertTemperature, getTemperatureSymbol } = useTheme();
    const [forecast, setForecast] = useState([]);
    const [forecastData, setForecastData] = useState(null); 
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [chartType, setChartType] = useState('hourly'); 
    const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

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


                // Filter for hourly display - get next 18 hours (6 data points * 3 hours = 18 hours)
                const hourlyData = data.list.slice(0, 6); // Get next 18 hours
                setForecast(hourlyData);
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

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
    };

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
            <div style={{display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px'}}>
                <Logo size="small" showText={false} />
                <h3>{t('hourlyForecast')} {city} ⏰</h3>
            </div>
            
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
            
            {/* Hourly forecast cards */}
            <div className="forecast-container">
                {forecast.map((hour, index) => (
                    <div key={hour.dt} className="forecast-item">
                        <p className="hour-time">{formatTime(hour.dt_txt)}</p>
                        <img 
                            src={`https://openweathermap.org/img/wn/${hour.weather[0].icon}@2x.png`}
                            alt={hour.weather[0].description}
                        />
                        <p className="hour-temp">{convertTemperature(hour.main.temp)}{getTemperatureSymbol()}</p>
                        <p className="hour-desc">{hour.weather[0].description}</p>
                        <p className="hour-humidity">💧 {hour.main.humidity}%</p>
                    </div>
                ))}
            </div>

        </div>
    );
}

export default Forecast;
