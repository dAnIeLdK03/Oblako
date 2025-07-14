import React, { useState, useEffect } from 'react';

function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('oblako_cookie_consent');
    if (!consent) setVisible(true);
  }, []);

  const acceptAll = () => {
    localStorage.setItem('oblako_cookie_consent', 'all');
    setVisible(false);
    // Тук можеш да инициализираш рекламните скриптове при нужда
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
      Този сайт използва бисквитки за функционалност и (по избор) за персонализирани реклами. Използвайки Oblako, Вие се съгласявате с <a href="/cookies" style={{color:'#fff', textDecoration:'underline'}}>Политиката за бисквитки</a>.
      <button onClick={acceptAll} style={{marginLeft: 16, background:'#74b9ff', color:'#222', border:'none', borderRadius:4, padding:'6px 18px', fontWeight:'bold', cursor:'pointer'}}>Приемам всички</button>
      <button onClick={acceptFunctional} style={{marginLeft: 8, background:'#888', color:'#fff', border:'none', borderRadius:4, padding:'6px 18px', fontWeight:'bold', cursor:'pointer'}}>Само функционални</button>
    </div>
  );
}

export default CookieConsent; 