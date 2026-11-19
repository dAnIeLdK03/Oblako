import React, { useState, useEffect } from 'react';
import { loadAnalytics } from '../utils/analytics.js';

function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('oblako_cookie_consent');
    if (!consent) setVisible(true);
  }, []);

  const acceptAll = () => {
    localStorage.setItem('oblako_cookie_consent', 'all');
    loadAnalytics();
    setVisible(false);
  };

  const acceptFunctional = () => {
    localStorage.setItem('oblako_cookie_consent', 'functional');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      width: '100%',
      background: '#222',
      color: '#fff',
      padding: '16px 10px',
      textAlign: 'center',
      zIndex: 9999,
      fontSize: 15
    }}>
      Използваме локално съхранение за функционалност и, само с Вашето съгласие, Google Analytics за статистика. Повече в <a href="/cookies" style={{color:'#fff', textDecoration:'underline'}}>Политиката за бисквитки</a> и <a href="/privacy" style={{color:'#fff', textDecoration:'underline'}}>Правилата за поверителност</a>.
      <button onClick={acceptAll} style={{marginLeft: 16, background:'#74b9ff', color:'#222', border:'none', borderRadius:4, padding:'6px 18px', fontWeight:'bold', cursor:'pointer'}}>Приемам всички</button>
      <button onClick={acceptFunctional} style={{marginLeft: 8, background:'#888', color:'#fff', border:'none', borderRadius:4, padding:'6px 18px', fontWeight:'bold', cursor:'pointer'}}>Само функционални</button>
    </div>
  );
}

export default CookieConsent; 