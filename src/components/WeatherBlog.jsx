import React, { useState } from 'react';
import { useLanguage } from '../LanguageContext.jsx';

const WeatherBlog = () => {
  const { language } = useLanguage();
  const [activeArticle, setActiveArticle] = useState(0);

  const articles = [
    {
      id: 1,
      title: 'Как да разчитаме прогнозата за времето правилно',
      excerpt: 'Научете как да интерпретирате метеорологичните данни и да правите точни прогнози за времето.',
      content: `
        <h2>Основни принципи на метеорологията</h2>
        <p>Прогнозата за времето се основава на множество фактори като атмосферно налягане, влажност, температура и скорост на вятъра. Нашите метеоролози използват най-новите технологии за анализ на атмосферните условия.</p>
        
        <h3>Ключови индикатори:</h3>
        <ul>
          <li><strong>Атмосферно налягане:</strong> Низкото налягане често предвежда дъжд</li>
          <li><strong>Влажност:</strong> Високата влажност увеличава вероятността за валежи</li>
          <li><strong>Температура:</strong> Резките промени могат да предвещават бури</li>
          <li><strong>Вятър:</strong> Насоката и скоростта са важни за прогнозите</li>
        </ul>
        
        <h3>Как да използвате Oblako за точни прогнози:</h3>
        <p>Нашето приложение предоставя детайлна информация за всички тези параметри, позволявайки ви да правите информирани решения за вашите планове.</p>
      `,
      keywords: 'прогноза за времето, метеорология, атмосферно налягане, влажност, температура, вятър',
      date: '2024-12-19'
    },
    {
      id: 2,
      title: 'UV индекс и защита от слънцето',
      excerpt: 'Разберете важността на UV индекса и как да се защитите от вредните слънчеви лъчи.',
      content: `
        <h2>Какво е UV индексът?</h2>
        <p>UV индексът измерва интензитета на ултравиолетовите лъчи от слънцето, които достигат до повърхността на Земята. Той е важен индикатор за риска от слънчеви изгаряния и дългосрочни здравни проблеми.</p>
        
        <h3>Нива на UV индекс:</h3>
        <ul>
          <li><strong>1-2 (Нисък):</strong> Безопасно за престой на открито</li>
          <li><strong>3-5 (Умерен):</strong> Препоръчителна защита слънцезащитен крем</li>
          <li><strong>6-7 (Висок):</strong> Ограничете престоя на слънце</li>
          <li><strong>8-10 (Много висок):</strong> Избягвайте слънцето в пиковите часове</li>
          <li><strong>11+ (Екстремен):</strong> Избягвайте всякаква експозиция</li>
        </ul>
        
        <h3>Защитни мерки:</h3>
        <p>Използвайте слънцезащитен крем с SPF 30+, носете шапка и слънчеви очила, и избягвайте слънцето между 10:00 и 16:00 часа.</p>
      `,
      keywords: 'UV индекс, слънцезащитен крем, защита от слънце, ултравиолетови лъчи, здравен риск',
      date: '2024-12-18'
    },
    {
      id: 3,
      title: 'Качество на въздуха и здравето',
      excerpt: 'Научете как качеството на въздуха влияе върху здравето и как да следите AQI индекса.',
      content: `
        <h2>AQI - Индекс за качество на въздуха</h2>
        <p>Индексът за качество на въздуха (AQI) е инструмент за информиране на обществеността за ежедневното качество на въздуха. Той помага да разберете колко чист или замърсен е въздухът.</p>
        
        <h3>Нива на AQI:</h3>
        <ul>
          <li><strong>0-50 (Добро):</strong> Въздухът е чист, няма риск за здравето</li>
          <li><strong>51-100 (Умерено):</strong> Приемливо качество, но може да засегне чувствителни хора</li>
          <li><strong>101-150 (Нездравословно за чувствителни групи):</strong> Хора с респираторни проблеми трябва да избягват продължителна активност на открито</li>
          <li><strong>151-200 (Нездравословно):</strong> Всички хора могат да усетят неблагоприятни ефекти</li>
          <li><strong>201-300 (Много нездравословно):</strong> Избягвайте активност на открито</li>
          <li><strong>301+ (Опасно):</strong> Избягвайте всякаква активност на открито</li>
        </ul>
        
        <h3>Как да се защитите:</h3>
        <p>Следете AQI индекса в нашето приложение и планирайте дейностите си според качеството на въздуха. При високи нива, оставете се в закрити помещения с филтриран въздух.</p>
      `,
      keywords: 'качество на въздуха, AQI индекс, замърсяване, здравен риск, респираторни проблеми',
      date: '2024-12-17'
    },
    {
      id: 4,
      title: 'Сезонни промени и времето в България',
      excerpt: 'Разберете как се променя времето през различните сезони в България и какво да очаквате.',
      content: `
        <h2>Климатични особености на България</h2>
        <p>България има умерено-континентален климат с четири ясно изразени сезона. Всяка година носи различни метеорологични предизвикателства и възможности.</p>
        
        <h3>Пролет (март-май):</h3>
        <p>Променливо време с чести дъждове и гръмотевици. Температурите се повишават от 5°C до 25°C. Характерни са внезапните промени в атмосферното налягане.</p>
        
        <h3>Лято (юни-август):</h3>
        <p>Горещо и сухо време с температури до 40°C в южните райони. Чести са сухите горещини и гръмотевичните бури. UV индексът достига максимални стойности.</p>
        
        <h3>Есен (септември-ноември):</h3>
        <p>Постепенно охлаждане с чести мъгли и валежи. Температурите спадат от 25°C до 5°C. Характерни са мъглите сутрин и вечер.</p>
        
        <h3>Зима (декември-февруари):</h3>
        <p>Студено време със снеговалежи в планините. Температурите варират от -20°C до 15°C. Чести са мъглите и ледените условия.</p>
        
        <h3>Как да се подготвите:</h3>
        <p>Следете прогнозите в нашето приложение за да планирате дейностите си според сезона и да се подготвите за екстремни метеорологични условия.</p>
      `,
      keywords: 'сезони в България, климат, пролет, лято, есен, зима, метеорологични условия',
      date: '2024-12-16'
    }
  ];

  return (
    <div className="weather-blog">
      <div className="blog-header">
        <h1>Метеорологичен блог</h1>
        <p>Научете повече за времето, климата и как да интерпретирате метеорологичните данни</p>
      </div>

      <div className="blog-content">
        <div className="articles-list">
          {articles.map((article, index) => (
            <div 
              key={article.id} 
              className={`article-card ${activeArticle === index ? 'active' : ''}`}
              onClick={() => setActiveArticle(index)}
            >
              <div className="article-meta">
                <span className="article-date">{article.date}</span>
                <span className="article-category">Метеорология</span>
              </div>
              <h3 className="article-title">{article.title}</h3>
              <p className="article-excerpt">{article.excerpt}</p>
              <div className="article-keywords">
                {article.keywords.split(', ').map((keyword, i) => (
                  <span key={i} className="keyword-tag">{keyword}</span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="article-content">
          <div className="article-header">
            <h2>{articles[activeArticle].title}</h2>
            <div className="article-meta">
              <span className="publish-date">Публикувано на: {articles[activeArticle].date}</span>
              <span className="read-time">Време за четене: 5 мин</span>
            </div>
          </div>
          
          <div 
            className="article-body"
            dangerouslySetInnerHTML={{ __html: articles[activeArticle].content }}
          />
          
          <div className="article-footer">
            <div className="share-buttons">
              <button className="share-btn facebook">Сподели във Facebook</button>
              <button className="share-btn twitter">Сподели в Twitter</button>
              <button className="share-btn whatsapp">Сподели в WhatsApp</button>
            </div>
            
            <div className="related-articles">
              <h4>Свързани статии:</h4>
              <ul>
                {articles
                  .filter((_, index) => index !== activeArticle)
                  .slice(0, 3)
                  .map(article => (
                    <li key={article.id}>
                      <a href={`#article-${article.id}`} onClick={() => setActiveArticle(articles.findIndex(a => a.id === article.id))}>
                        {article.title}
                      </a>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .weather-blog {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .blog-header {
          text-align: center;
          margin-bottom: 40px;
          padding: 20px;
          background: linear-gradient(135deg, #74b9ff, #0984e3);
          color: white;
          border-radius: 15px;
        }

        .blog-header h1 {
          font-size: 2.5rem;
          margin-bottom: 10px;
        }

        .blog-content {
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: 30px;
        }

        .articles-list {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .article-card {
          padding: 20px;
          border: 1px solid #e1e8ed;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.3s ease;
          background: white;
        }

        .article-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }

        .article-card.active {
          border-color: #74b9ff;
          background: #f8f9ff;
        }

        .article-meta {
          display: flex;
          gap: 10px;
          margin-bottom: 10px;
          font-size: 0.9rem;
        }

        .article-date {
          color: #666;
        }

        .article-category {
          background: #74b9ff;
          color: white;
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 0.8rem;
        }

        .article-title {
          font-size: 1.2rem;
          margin-bottom: 10px;
          color: #2d3436;
        }

        .article-excerpt {
          color: #636e72;
          line-height: 1.5;
          margin-bottom: 15px;
        }

        .article-keywords {
          display: flex;
          flex-wrap: wrap;
          gap: 5px;
        }

        .keyword-tag {
          background: #f1f2f6;
          color: #2d3436;
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 0.8rem;
        }

        .article-content {
          background: white;
          padding: 30px;
          border-radius: 15px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .article-header h2 {
          font-size: 2rem;
          color: #2d3436;
          margin-bottom: 15px;
        }

        .article-body {
          line-height: 1.8;
          color: #2d3436;
        }

        .article-body h2 {
          color: #0984e3;
          margin: 30px 0 15px 0;
        }

        .article-body h3 {
          color: #74b9ff;
          margin: 20px 0 10px 0;
        }

        .article-body ul {
          margin: 15px 0;
          padding-left: 20px;
        }

        .article-body li {
          margin-bottom: 8px;
        }

        .article-body strong {
          color: #2d3436;
        }

        .article-footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #e1e8ed;
        }

        .share-buttons {
          display: flex;
          gap: 10px;
          margin-bottom: 30px;
        }

        .share-btn {
          padding: 10px 20px;
          border: none;
          border-radius: 25px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .share-btn.facebook {
          background: #1877f2;
          color: white;
        }

        .share-btn.twitter {
          background: #1da1f2;
          color: white;
        }

        .share-btn.whatsapp {
          background: #25d366;
          color: white;
        }

        .share-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 3px 10px rgba(0,0,0,0.2);
        }

        .related-articles h4 {
          color: #2d3436;
          margin-bottom: 15px;
        }

        .related-articles ul {
          list-style: none;
          padding: 0;
        }

        .related-articles li {
          margin-bottom: 10px;
        }

        .related-articles a {
          color: #74b9ff;
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .related-articles a:hover {
          color: #0984e3;
        }

        @media (max-width: 768px) {
          .blog-content {
            grid-template-columns: 1fr;
          }
          
          .blog-header h1 {
            font-size: 2rem;
          }
          
          .article-content {
            padding: 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default WeatherBlog; 