import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { loadAnalytics } from '../utils/analytics.js';
import { getItem, setItem } from '../utils/storage.js';
import styles from './CookieConsent.module.css';

function CookieConsent() {
  // Банерът се показва, докато няма запазен избор
  const [visible, setVisible] = useState(() => !getItem('oblako_cookie_consent'));

  const acceptAll = () => {
    setItem('oblako_cookie_consent', 'all');
    loadAnalytics();
    setVisible(false);
  };

  const acceptFunctional = () => {
    setItem('oblako_cookie_consent', 'functional');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className={styles.banner}>
      Използваме локално съхранение за функционалност и, само с Вашето съгласие, Google Analytics за
      статистика. Повече в <Link to="/cookies">Политиката за бисквитки</Link> и{' '}
      <Link to="/privacy">Правилата за поверителност</Link>.
      <button onClick={acceptAll} className={`${styles.button} ${styles.accept}`}>
        Приемам всички
      </button>
      <button onClick={acceptFunctional} className={`${styles.button} ${styles.decline}`}>
        Само функционални
      </button>
    </div>
  );
}

export default CookieConsent;
