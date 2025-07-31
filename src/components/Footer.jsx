import React from 'react';
import { useLanguage } from '../LanguageContext.jsx';

function Footer() {
  const { language } = useLanguage();

  const content = {
    bg: {
      copyright: `© ${new Date().getFullYear()} Oblako. Всички права запазени.`,
      terms: 'Условия за ползване',
      privacy: 'Правила за поверителност',
      cookies: 'Политика за бисквитки',
      weatherTips: 'Съвети за времето',
    },
    en: {
      copyright: `© ${new Date().getFullYear()} Oblako. All rights reserved.`,
      terms: 'Terms of Use',
      privacy: 'Privacy Policy',
      cookies: 'Cookie Policy',
      weatherTips: 'Weather Tips',
    }
  };

  const t = content[language] || content.en;

  return (
    <footer style={{
      position: 'fixed',
      left: 0,
      bottom: 0,
      width: '100%',
      background: 'var(--bg-color1)',
      color: '#888',
      fontSize: '14px',
      textAlign: 'center',
      fontWeight: 'normal',
      zIndex: 1000,
      boxShadow: '0 -1px 8px rgba(0,0,0,0.04)',
      padding: '10px 0'
    }}>
      {t.copyright}<br />
      <span style={{fontWeight: 'bold'}}>
        <a href="/weather-tips" style={{color: '#888', textDecoration: 'underline', margin: '0 5px'}}>{t.weatherTips}</a> |
        <a href="/terms" style={{color: '#888', textDecoration: 'underline', margin: '0 5px'}}>{t.terms}</a> |
        <a href="/privacy" style={{color: '#888', textDecoration: 'underline', margin: '0 5px'}}>{t.privacy}</a> |
        <a href="/cookies" style={{color: '#888', textDecoration: 'underline', margin: '0 5px'}}>{t.cookies}</a>
      </span>
    </footer>
  );
}

export default Footer; 