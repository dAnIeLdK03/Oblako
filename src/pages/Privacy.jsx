import React from 'react';

function Privacy() {
  return (
    <div style={{maxWidth: 700, margin: '40px auto', padding: 20, background: '#fff', color: '#222', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.07)'}}>
      <h2>Правила за поверителност</h2>
      <p>Oblako не събира лични данни от потребителите, освен анонимна статистика за посещенията (дата, IP, браузър), която се използва само за подобряване на услугата и не се споделя с трети страни.</p>
      <ul>
        <li>Не събираме имена, имейли или друга лична информация.</li>
        <li>Използваме cookies само за функционалност на приложението.</li>
        <li>Можете да изтриете историята си по всяко време.</li>
      </ul>
      <h3>Реклами и трети страни</h3>
      <p>
        Oblako може да показва реклами чрез външни доставчици (напр. Google AdSense). Тези доставчици могат да използват бисквитки и подобни технологии, за да персонализират рекламите според вашите интереси и да измерват ефективността им.
      </p>
      <ul>
        <li>Можете да управлявате предпочитанията си за реклами чрез настройките на браузъра си или чрез <a href="https://www.youronlinechoices.com/bg/" target="_blank" rel="noopener noreferrer">YourOnlineChoices</a>.</li>
        <li>Повече за политиката на Google относно рекламите: <a href="https://policies.google.com/technologies/ads?hl=bg" target="_blank" rel="noopener noreferrer">Google Ads Policy</a></li>
      </ul>
      <p>За въпроси относно поверителността: <a href="mailto:oblako997@gmail.bg">oblako997@gmail.bg</a></p>
    </div>
  );
}

export default Privacy; 