import React from 'react';
import { useSeo } from '../hooks/useSeo.js';
import Logo from '../components/Logo.jsx';

function Privacy() {
  useSeo('privacy');
  return (
    <div style={{maxWidth: 700, margin: '40px auto', padding: 20, background: '#fff', color: '#222', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.07)'}}>
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px', marginBottom: '20px'}}>
        <Logo size="xlarge" showText={false} />
        <h2>Правила за поверителност</h2>
      </div>
      <p><small>Последна актуализация: 19 ноември 2026 г.</small></p>
      <p>Oblako (oblako17.online) не изисква регистрация и не събира имена или имейли. Ето какви данни се обработват, при какви условия и от кого.</p>

      <h3>Местоположение</h3>
      <p>Само ако разрешите достъп в браузъра си, координатите Ви се изпращат към <a href="https://open-meteo.com/" target="_blank" rel="noopener noreferrer">Open-Meteo</a> (за прогнозата) и <a href="https://www.bigdatacloud.com/" target="_blank" rel="noopener noreferrer">BigDataCloud</a> (за името на населеното място). Oblako не ги съхранява. Можете да откажете и да търсите град ръчно.</p>

      <h3>Търсени градове</h3>
      <p>Въведеното име на град се изпраща към Open-Meteo. Историята на търсенията се пази само във Вашия браузър и можете да я изтриете по всяко време.</p>

      <h3>Данни в браузъра Ви</h3>
      <p>В локалното съхранение на браузъра се пазят: избраният език, темата, историята на търсенията и изборът Ви за бисквитки. Тези данни не напускат устройството Ви.</p>

      <h3>Статистика (само със съгласие)</h3>
      <p>Ако изберете „Приемам всички", се зарежда Google Analytics (Google Ireland Limited), който получава технически данни за посещенията (напр. посетени страници, тип устройство и браузър, приблизителна област). Според Google, Google Analytics 4 не записва и не съхранява IP адреси. Ако изберете „Само функционални", Google Analytics не се зарежда и към Google не се изпраща нищо.</p>

      <h3>Други услуги, които виждат IP адреса Ви</h3>
      <p>Както при всеки сайт, когато браузърът Ви зарежда съдържание от друг сървър, той получава IP адреса Ви. При Oblako това са: Open-Meteo и BigDataCloud (време и име на място), доставчиците на картата (OpenStreetMap, Esri, OpenTopoMap) и Cloudflare (cdnjs, иконите на маркерите). Хостинг доставчикът на сайта може да води технически логове (IP адрес, час) за сигурност.</p>

      <h3>Вашите права</h3>
      <p>Имате право на достъп, поправяне и изтриване на данните си, на възражение и на ограничаване на обработването, както и да оттеглите съгласието си по всяко време (изчистете данните на сайта от браузъра си и изберете отново). Можете да подадете жалба до <a href="https://www.cpdp.bg/" target="_blank" rel="noopener noreferrer">Комисията за защита на личните данни</a>.</p>

      <p>За въпроси относно поверителността: <a href="mailto:oblako997@gmail.bg">oblako997@gmail.bg</a></p>
    </div>
  );
}

export default Privacy;
