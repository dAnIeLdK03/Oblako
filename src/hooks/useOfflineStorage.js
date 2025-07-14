import { useState, useEffect } from 'react';

const STORAGE_KEYS = {
  WEATHER_DATA: 'oblako_weather_data',
  FORECAST_DATA: 'oblako_forecast_data',
  SEARCH_HISTORY: 'oblako_history',
  LAST_CITY: 'oblako_last_city'
};

export function useOfflineStorage() {
  const [offlineData, setOfflineData] = useState({
    weather: null,
    forecast: null,
    lastCity: null,
    isOffline: false
  });

  useEffect(() => {
    loadOfflineData();
  }, []);

  const loadOfflineData = () => {
    try {
      const weather = JSON.parse(localStorage.getItem(STORAGE_KEYS.WEATHER_DATA) || 'null');
      const forecast = JSON.parse(localStorage.getItem(STORAGE_KEYS.FORECAST_DATA) || 'null');
      const lastCity = localStorage.getItem(STORAGE_KEYS.LAST_CITY);

      setOfflineData({
        weather,
        forecast,
        lastCity,
        isOffline: !navigator.onLine
      });
    } catch (error) {
      console.error('Failed to load offline data:', error);
    }
  };

  const saveWeatherData = (data, city) => {
    try {
      const dataWithTimestamp = {
        ...data,
        _cached: Date.now(),
        _city: city
      };
      
      localStorage.setItem(STORAGE_KEYS.WEATHER_DATA, JSON.stringify(dataWithTimestamp));
      localStorage.setItem(STORAGE_KEYS.LAST_CITY, city);
      
      setOfflineData(prev => ({
        ...prev,
        weather: dataWithTimestamp,
        lastCity: city
      }));
    } catch (error) {
      console.error('Failed to save weather data:', error);
    }
  };

  const saveForecastData = (data, city) => {
    try {
      const dataWithTimestamp = {
        ...data,
        _cached: Date.now(),
        _city: city
      };
      
      localStorage.setItem(STORAGE_KEYS.FORECAST_DATA, JSON.stringify(dataWithTimestamp));
      
      setOfflineData(prev => ({
        ...prev,
        forecast: dataWithTimestamp
      }));
    } catch (error) {
      console.error('Failed to save forecast data:', error);
    }
  };

  const clearOfflineData = () => {
    try {
      localStorage.removeItem(STORAGE_KEYS.WEATHER_DATA);
      localStorage.removeItem(STORAGE_KEYS.FORECAST_DATA);
      localStorage.removeItem(STORAGE_KEYS.LAST_CITY);
      
      setOfflineData({
        weather: null,
        forecast: null,
        lastCity: null,
        isOffline: !navigator.onLine
      });
    } catch (error) {
      console.error('Failed to clear offline data:', error);
    }
  };

  const getDataAge = (data) => {
    if (!data || !data._cached) return null;
    
    const now = Date.now();
    const cached = data._cached;
    const ageInMinutes = Math.floor((now - cached) / (1000 * 60));
    
    return ageInMinutes;
  };

  const isDataStale = (data, maxAgeMinutes = 30) => {
    const age = getDataAge(data);
    return age === null || age > maxAgeMinutes;
  };

  return {
    offlineData,
    saveWeatherData,
    saveForecastData,
    clearOfflineData,
    getDataAge,
    isDataStale,
    loadOfflineData
  };
}
