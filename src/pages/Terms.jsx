import React from 'react';
import { useSeo } from '../hooks/useSeo.js';
import Logo from '../components/Logo.jsx';
import styles from './LegalPage.module.css';

function Terms() {
  useSeo('terms');
  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <Logo size="xlarge" showText={false} />
        <h2>Условия за ползване</h2>
      </div>
      <p>
        Това приложение "Oblako" се предоставя с информационна цел. Използвайки приложението, Вие се
        съгласявате да не злоупотребявате с услугата и да спазвате добрите практики при използване
        на интернет.
      </p>
      <ul>
        <li>Не носим отговорност за точността на прогнозите.</li>
        <li>Не използвайте приложението за незаконни цели.</li>
        <li>Възможни са промени в условията без предизвестие.</li>
      </ul>
      <p>
        За въпроси: <a href="mailto:oblako997@gmail.bg">oblako997@gmail.bg</a>
      </p>
    </div>
  );
}

export default Terms;
