import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('dark');
  const [temperatureUnit, setTemperatureUnit] = useState('celsius');

  // Theme functionality
  const getSystemTheme = () => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem('weatherAppTheme');
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      setTheme(getSystemTheme());
    }
  }, []);

  useEffect(() => {
    console.log('Theme changed to:', theme);
    if (theme === 'light') {
      document.documentElement.classList.add('light-theme');
      console.log('Added light-theme class');
    } else {
      document.documentElement.classList.remove('light-theme');
      console.log('Removed light-theme class');
    }
  }, [theme]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      if (!localStorage.getItem('weatherAppTheme')) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    console.log('Toggle theme called:', { currentTheme: theme, newTheme });
    setTheme(newTheme);
    localStorage.setItem('weatherAppTheme', newTheme);
  };

  const setAutoTheme = () => {
    localStorage.removeItem('weatherAppTheme');
    setTheme(getSystemTheme());
  };

  // Temperature functionality
  const toggleTemperatureUnit = () => {
    const newUnit = temperatureUnit === 'celsius' ? 'fahrenheit' : 'celsius';
    console.log('Toggle temperature unit called:', { currentUnit: temperatureUnit, newUnit });
    setTemperatureUnit(newUnit);
  };

  const convertTemperature = (celsius) => {
    if (temperatureUnit === 'fahrenheit') {
      const fahrenheit = Math.round((celsius * 9/5) + 32);
      console.log('Temperature conversion:', { celsius, fahrenheit, unit: 'fahrenheit' });
      return fahrenheit;
    }
    console.log('Temperature conversion:', { celsius, unit: 'celsius' });
    return Math.round(celsius);
  };

  const getTemperatureSymbol = () => {
    return temperatureUnit === 'celsius' ? '°C' : '°F';
  };

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      toggleTheme, 
      setAutoTheme,
      temperatureUnit, 
      toggleTemperatureUnit, 
      convertTemperature, 
      getTemperatureSymbol 
    }}>
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