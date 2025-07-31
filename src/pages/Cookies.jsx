import React from 'react';
import Logo from '../components/Logo.jsx';

function Cookies() {
  return (
    <div style={{maxWidth: 700, margin: '40px auto', padding: 20, background: '#fff', color: '#222', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.07)'}}>
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px', marginBottom: '20px'}}>
        <Logo size="xlarge" showText={false} />
        <h2>Политика за бисквитки</h2>
      </div>
      <p>Oblako използва бисквитки (cookies) само за функционалност на приложението, като запазване на избрания език, история на търсенията и тема.</p>
      <ul>
        <li>Не използваме бисквитки за реклама или проследяване.</li>
        <li>Можете да изтриете бисквитките по всяко време от настройките на браузъра си.</li>
        <li>Използването на приложението означава съгласие с тази политика.</li>
      </ul>
      <h3>Рекламни бисквитки</h3>
      <p>
        Сайтът може да използва рекламни бисквитки, предоставени от трети страни (напр. Google), за да показва персонализирани реклами. Тези бисквитки събират информация за вашите посещения и интереси, но не съхраняват лични данни като име или имейл.
      </p>
      <ul>
        <li>Можете да откажете рекламните бисквитки чрез настройките на браузъра си или чрез <a href="https://www.youronlinechoices.com/bg/" target="_blank" rel="noopener noreferrer">YourOnlineChoices</a>.</li>
      </ul>
      <p>За въпроси относно бисквитките: <a href="mailto:oblako997@gmail.bg">oblako997@gmail.bg</a></p>
    </div>
  );
}

export default Cookies; 