import React, { createContext, useContext, useState, useEffect } from 'react';
import { getItem, setItem, removeItem } from './utils/storage.js';
import {
  loadUnits,
  saveUnits,
  toTemperature,
  formatWind,
  formatPressure,
  formatVisibility,
} from './utils/units.js';

const ThemeContext = createContext();

const getSystemTheme = () =>
  window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => getItem('weatherAppTheme') || getSystemTheme());
  const [units, setUnits] = useState(loadUnits);

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

  // Единици (запомнят се в браузъра)
  const setUnit = (kind, unit) => {
    const next = { ...units, [kind]: unit };
    setUnits(next);
    saveUnits(next);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
        setAutoTheme,
        units,
        setUnit,
        convertTemperature: (celsius) => toTemperature(celsius, units.temperature),
        getTemperatureSymbol: () => units.temperature,
        formatWind: (value) => formatWind(value, units.wind),
        formatPressure: (value) => formatPressure(value, units.pressure),
        formatVisibility: (value) => formatVisibility(value, units.visibility),
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
