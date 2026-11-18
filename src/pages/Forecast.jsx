import { useState } from "react";
import { Droplet } from 'lucide-react';
import { useLanguage } from '../LanguageContext.jsx';
import { useTheme } from '../ThemeContext.jsx';
import Logo from '../components/Logo.jsx';
import TemperatureChart from '../components/TemperatureChart.jsx';
import { getIconUrl } from '../services/weather';

function Forecast({ weather }){
    const { t } = useLanguage();
    const { convertTemperature, getTemperatureSymbol } = useTheme();
    const [chartType, setChartType] = useState('hourly'); 

    // Следващите 18 часа, през 3 часа
    const forecast = weather.hourly.filter((_, i) => i % 3 === 0).slice(0, 6);

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

    return (
        <div className="card">
            <div style={{display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px'}}>
                <Logo size="small" showText={false} />
                <h3>{t('hourlyForecast')} {weather.place.name} ⏰</h3>
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
                  weather={weather} 
                  type={chartType}
              />
            </div>
            
            {/* Hourly forecast cards */}
            <div className="forecast-container">
                {forecast.map((hour, index) => (
                    <div key={hour.time} className="forecast-item">
                        <p className="hour-time">{formatTime(hour.localTime)}</p>
                        <img 
                            src={getIconUrl(hour.condition.icon)}
                            alt={hour.condition.description}
                        />
                        <p className="hour-temp">{convertTemperature(hour.temp)}{getTemperatureSymbol()}</p>
                        <p className="hour-desc">{hour.condition.description}</p>
                        <p className="hour-humidity"><Droplet size={14} className="hour-humidity-icon" /> {hour.humidity}%</p>
                    </div>
                ))}
            </div>

        </div>
    );
}

export default Forecast;
