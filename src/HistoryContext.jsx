import React, { createContext, useContext, useState } from 'react';
import { getItem, setItem, removeItem } from './utils/storage.js';

const HistoryContext = createContext();

export const useHistory = () => {
  const context = useContext(HistoryContext);
  if (!context) {
    throw new Error('useHistory must be used within HistoryProvider');
  }
  return context;
};

// Запазената история от браузъра; повредени данни дават празна история.
function readHistory() {
  const saved = getItem('oblako_history');
  if (!saved) return [];
  try {
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed.filter((c) => typeof c === 'string').slice(0, 5) : [];
  } catch {
    return [];
  }
}

export const HistoryProvider = ({ children }) => {
  const [searchHistory, setSearchHistory] = useState(readHistory);

  const addToHistory = (city) => {
    if (!city || typeof city !== 'string') return;

    const normalizedCity = city.trim();
    if (!normalizedCity) return;

    setSearchHistory((prevHistory) => {
      const filtered = prevHistory.filter(
        (item) => item.toLowerCase() !== normalizedCity.toLowerCase(),
      );

      const newHistory = [normalizedCity, ...filtered].slice(0, 5);

      setItem('oblako_history', JSON.stringify(newHistory));
      return newHistory;
    });
  };

  const clearHistory = () => {
    setSearchHistory([]);
    removeItem('oblako_history');
  };

  return (
    <HistoryContext.Provider
      value={{
        searchHistory,
        addToHistory,
        clearHistory,
      }}
    >
      {children}
    </HistoryContext.Provider>
  );
};
