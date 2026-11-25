import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../LanguageContext.jsx';
import Logo from './Logo.jsx';
import styles from './Footer.module.css';

function Footer() {
  const { language } = useLanguage();

  const content = {
    bg: {
      copyright: `© ${new Date().getFullYear()}`,
      terms: 'Условия за ползване',
      privacy: 'Правила за поверителност',
      cookies: 'Политика за бисквитки',
      weatherTips: 'Съвети за времето',
    },
    en: {
      copyright: `© ${new Date().getFullYear()}`,
      terms: 'Terms of Use',
      privacy: 'Privacy Policy',
      cookies: 'Cookie Policy',
      weatherTips: 'Weather Tips',
    },
  };

  const t = content[language] || content.en;

  return (
    <footer className={styles.footer}>
      <div className={styles.brand}>
        <Logo size="small" showText={false} />
        <span>{language === 'bg' ? 'Всички права запазени.' : 'All rights reserved.'}</span>
      </div>
      <span className={styles.links}>
        <Link to="/weather-tips" className={styles.link}>
          {t.weatherTips}
        </Link>{' '}
        |
        <Link to="/terms" className={styles.link}>
          {t.terms}
        </Link>{' '}
        |
        <Link to="/privacy" className={styles.link}>
          {t.privacy}
        </Link>{' '}
        |
        <Link to="/cookies" className={styles.link}>
          {t.cookies}
        </Link>
      </span>
      <div className={styles.credit}>
        {language === 'bg' ? 'Метеорологични данни от ' : 'Weather data by '}
        <a
          href="https://open-meteo.com/"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.link}
        >
          Open-Meteo.com
        </a>
      </div>
    </footer>
  );
}

export default Footer;
