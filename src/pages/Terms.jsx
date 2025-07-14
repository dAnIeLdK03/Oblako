import React from 'react';

function Terms() {
  return (
    <div style={{maxWidth: 700, margin: '40px auto', padding: 20, background: '#fff', color: '#222', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.07)'}}>
      <h2>Условия за ползване</h2>
      <p>Това приложение "Oblako" се предоставя с информационна цел. Използвайки приложението, Вие се съгласявате да не злоупотребявате с услугата и да спазвате добрите практики при използване на интернет.</p>
      <ul>
        <li>Не носим отговорност за точността на прогнозите.</li>
        <li>Не използвайте приложението за незаконни цели.</li>
        <li>Възможни са промени в условията без предизвестие.</li>
      </ul>
      <p>За въпроси: <a href="mailto:oblako997@gmail.bg">oblako997@gmail.bg</a></p>
    </div>
  );
}

export default Terms; 