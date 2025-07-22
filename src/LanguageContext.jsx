import React, { createContext, useContext, useState } from 'react';
import { translations } from './translations';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('bg'); // Default to Bulgarian
  
  const t = (key) => {
    return translations[language][key] || key;
  };
  
  const changeLanguage = (newLanguage) => {
    setLanguage(newLanguage);
    localStorage.setItem('oblako_language', newLanguage);
  };
  
  // Load saved language on init, иначе избери според браузъра
  React.useEffect(() => {
    const savedLanguage = localStorage.getItem('oblako_language');
    if (savedLanguage && translations[savedLanguage]) {
      setLanguage(savedLanguage);
    } else {
      // Автоматичен избор според браузъра
      const browserLang = navigator.language || navigator.userLanguage || 'en';
      if (browserLang.startsWith('bg')) {
        setLanguage('bg');
      } else {
        setLanguage('en');
      }
    }
  }, []);
  
  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
