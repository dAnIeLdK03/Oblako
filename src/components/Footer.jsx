import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../LanguageContext.jsx';
import Logo from './Logo.jsx';
import styles from './Footer.module.css';

function Footer() {
  const { t } = useLanguage();

  return (
    <footer className={styles.footer}>
      <div className={styles.brand}>
        <Logo size="small" showText={false} />
        <span>{t('footerRights')}</span>
      </div>
      <span className={styles.links}>
        <Link to="/weather-tips" className={styles.link}>
          {t('footerWeatherTips')}
        </Link>{' '}
        |
        <Link to="/terms" className={styles.link}>
          {t('footerTerms')}
        </Link>{' '}
        |
        <Link to="/privacy" className={styles.link}>
          {t('footerPrivacy')}
        </Link>{' '}
        |
        <Link to="/cookies" className={styles.link}>
          {t('footerCookies')}
        </Link>
      </span>
      <div className={styles.credit}>
        {t('footerDataBy')}{' '}
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
