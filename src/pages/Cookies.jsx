import React from 'react';
import { Link } from 'react-router-dom';
import { useSeo } from '../hooks/useSeo.js';
import Logo from '../components/Logo.jsx';
import styles from './LegalPage.module.css';

function Cookies() {
  useSeo('cookies');
  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <Logo size="xlarge" showText={false} />
        <h2>Политика за бисквитки</h2>
      </div>
      <p>
        <small>Последна актуализация: 23 ноември 2026 г.</small>
      </p>
      <p>
        Oblako самò не задава бисквитки. Единствените бисквитки идват от Google Analytics и само ако
        изберете „Приемам всички". Останалото е в локалното съхранение на браузъра (
        <code>localStorage</code>) и в кеша на приложението (за работа без интернет); нищо от това
        не се изпраща към сървъри.
      </p>

      <h3>Функционални (винаги)</h3>
      <p>Нужни са за работата на приложението и не се изпращат на трети страни:</p>
      <div className={styles['table-wrap']}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Ключ</th>
              <th>За какво е</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <code>oblako_cookie_consent</code>
              </td>
              <td>Изборът Ви за бисквитки („всички" или „функционални")</td>
            </tr>
            <tr>
              <td>
                <code>oblako_language</code>
              </td>
              <td>Избраният език</td>
            </tr>
            <tr>
              <td>
                <code>weatherAppTheme</code>
              </td>
              <td>Избраната тема (светла/тъмна); липсва при автоматичен избор</td>
            </tr>
            <tr>
              <td>
                <code>oblako_history</code>
              </td>
              <td>Последните 5 търсени града</td>
            </tr>
            <tr>
              <td>
                <code>oblako_last_query</code>
              </td>
              <td>
                Последното показано място (координати, закръглени до около 1 км, и име) — за
                показване без интернет
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        Те остават, докато не изчистите данните на сайта. Ако браузърът блокира локалното
        съхранение, приложението работи, но не запомня тези избори и въпросът за бисквитките се
        показва при всяко зареждане.
      </p>

      <h3>Кеш за работа без интернет</h3>
      <p>
        Service worker-ът на Oblako пази в кеша на браузъра файловете на приложението, снимки и
        икони, както и отговорите на Open-Meteo и BigDataCloud за последните 24 часа (прогнози и
        имена на места; в адресите на заявките има координати, закръглени до около 1 км, и въведени
        градове). Това не е бисквитка и не се изпраща никъде. Служи само за да се покаже последната
        прогноза без връзка. Изтрива се с изчистване на данните на сайта.
      </p>

      <h3>Статистика (само със съгласие)</h3>
      <p>
        Ако изберете „Приемам всички", се зарежда Google Analytics 4 (Google Ireland Limited), който
        задава следните бисквитки:
      </p>
      <div className={styles['table-wrap']}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Бисквитка</th>
              <th>За какво е</th>
              <th>Срок</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <code>_ga</code>
              </td>
              <td>Случаен идентификатор, с който различава посетителите</td>
              <td>до 2 години</td>
            </tr>
            <tr>
              <td>
                <code>_ga_RKJ1SRJKBX</code>
              </td>
              <td>Състояние на сесията</td>
              <td>до 2 години</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        Преди да дадете съгласие, скриптът на Google не се зарежда и към Google не се изпраща нищо.
        Използваме Google Consent Mode: рекламните разрешения (<code>ad_storage</code>,{' '}
        <code>ad_user_data</code>, <code>ad_personalization</code>) са винаги отказани, а{' '}
        <code>analytics_storage</code> се дава само след съгласие. Ако изберете „Само функционални",
        тези бисквитки не се задават. Повече за данните, които получава Google, в{' '}
        <Link to="/privacy">Правилата за поверителност</Link>.
      </p>

      <h3>Реклами</h3>
      <p>Oblako не показва реклами и не използва рекламни бисквитки или рекламни профили.</p>

      <h3>Промяна на избора</h3>
      <p>
        Засега няма бутон за промяна на избора. Изчистете данните на сайта (бисквитки и локално
        съхранение) от настройките на браузъра си, за да се покаже отново въпросът; това изтрива и
        бисквитките на Google Analytics за този сайт. Можете да изтриете бисквитките по всяко време
        от същите настройки.
      </p>

      <p>
        За въпроси относно бисквитките: <a href="mailto:oblako997@gmail.bg">oblako997@gmail.bg</a>
      </p>
    </div>
  );
}

export default Cookies;
