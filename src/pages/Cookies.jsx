import React from 'react';
import Logo from '../components/Logo.jsx';

function Cookies() {
  return (
    <div style={{maxWidth: 700, margin: '40px auto', padding: 20, background: '#fff', color: '#222', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.07)'}}>
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px', marginBottom: '20px'}}>
        <Logo size="xlarge" showText={false} />
        <h2>Политика за бисквитки</h2>
      </div>
      <p><small>Последна актуализация: 19 ноември 2026 г.</small></p>

      <h3>Функционални (винаги)</h3>
      <p>Oblako записва в локалното съхранение на браузъра Ви избрания език, темата, историята на търсенията и избора Ви за бисквитки. Те са нужни за работата на приложението и не се изпращат на трети страни.</p>

      <h3>Статистика (само със съгласие)</h3>
      <p>Ако изберете „Приемам всички", се зарежда Google Analytics, който задава бисквитки (напр. <code>_ga</code>), за да отчита посещенията. Ако изберете „Само функционални", тези бисквитки не се задават и Google Analytics не се зарежда.</p>

      <h3>Реклами</h3>
      <p>Oblako не показва реклами и не използва рекламни бисквитки.</p>

      <h3>Промяна на избора</h3>
      <p>Изчистете данните на сайта от настройките на браузъра си, за да се покаже отново въпросът. Можете да изтриете бисквитките по всяко време от същите настройки.</p>

      <p>За въпроси относно бисквитките: <a href="mailto:oblako997@gmail.bg">oblako997@gmail.bg</a></p>
    </div>
  );
}

export default Cookies;
