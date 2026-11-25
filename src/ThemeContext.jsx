import React, { createContext, useContext, useState, useEffect } from 'react';
import { getItem, setItem, removeItem } from './utils/storage.js';

const ThemeContext = createContext();

const getSystemTheme = () =>
  window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => getItem('weatherAppTheme') || getSystemTheme());
  const [temperatureUnit, setTemperatureUnit] = useState('celsius');

  // Theme functionality
  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light-theme');
    } else {
      document.documentElement.classList.remove('light-theme');
    }
  }, [theme]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      if (!getItem('weatherAppTheme')) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    setItem('weatherAppTheme', newTheme);
  };

  const setAutoTheme = () => {
    removeItem('weatherAppTheme');
    setTheme(getSystemTheme());
  };

  // Temperature functionality
  const toggleTemperatureUnit = () => {
    const newUnit = temperatureUnit === 'celsius' ? 'fahrenheit' : 'celsius';
    setTemperatureUnit(newUnit);
  };

  const convertTemperature = (celsius) => {
    if (temperatureUnit === 'fahrenheit') {
      const fahrenheit = Math.round((celsius * 9) / 5 + 32);
      return fahrenheit;
    }
    return Math.round(celsius);
  };

  const getTemperatureSymbol = () => {
    return temperatureUnit === 'celsius' ? '°C' : '°F';
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
        setAutoTheme,
        temperatureUnit,
        toggleTemperatureUnit,
        convertTemperature,
        getTemperatureSymbol,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
