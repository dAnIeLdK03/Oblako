import React, { createContext, useContext, useState } from 'react';
import { translations } from './translations';
import { getItem, setItem } from './utils/storage.js';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};

// Запазеният език, иначе според езика на браузъра (български или английски).
function initialLanguage() {
  const saved = getItem('oblako_language');
  if (saved && translations[saved]) return saved;
  const browserLang = navigator.language || navigator.userLanguage || 'en';
  return browserLang.startsWith('bg') ? 'bg' : 'en';
}

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(initialLanguage);

  const t = (key) => {
    return translations[language][key] || key;
  };

  const changeLanguage = (newLanguage) => {
    setLanguage(newLanguage);
    setItem('oblako_language', newLanguage);
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
