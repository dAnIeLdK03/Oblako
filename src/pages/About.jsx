import React from 'react';
import { useLanguage } from '../LanguageContext.jsx';
import { useTheme } from '../ThemeContext.jsx';
import '../Weather.css';

const About = () => {
  const { language } = useLanguage();
  const { theme } = useTheme();

  const content = {
    bg: {
      title: "За Oblako ☁️",
      subtitle: "Вашият надежден партньор за прогноза на времето",
      intro: "Oblako е модерно приложение за прогноза на времето, създадено с цел да предостави на потребителите точна и навременна информация за атмосферните условия. Нашата мисия е да направим прогнозата за времето достъпна, разбираема и полезна за всеки.",
      
      features: {
        title: "Основни функции",
        items: [
          {
            title: "Почасова прогноза",
            description: "Получете детайлна прогноза за всеки час от деня, включително температура, влажност, налягане и скорост на вятъра. Нашите данни се обновяват на всеки 15 минути за максимална точност."
          },
          {
            title: "5-дневна прогноза",
            description: "Планирайте седмицата си с нашата подробна 5-дневна прогноза. Включва максимални и минимални температури, вероятност за валежи и общи метеорологични условия."
          },
          {
            title: "Интерактивна карта",
            description: "Разглеждайте времето в реално време на интерактивна карта. Наблюдавайте движението на облаците, температурите и атмосферното налягане в цял свят."
          },
          {
            title: "Изгрев и залез",
            description: "Узнайте точно кога ще изгрее и залезе слънцето за вашата локация. Тази информация е особено полезна за фотографи, туристи и хора, които планират външни дейности."
          },
          {
            title: "Графики и анализи",
            description: "Визуализирайте температурните промени и други метеорологични данни чрез интерактивни графики. Анализирайте тенденциите и моделите на времето."
          }
        ]
      },

      technology: {
        title: "Технологии и данни",
        description: "Oblako използва най-новите технологии и данни от световно признати метеорологични организации. Нашите прогнози се основават на сложни математически модели и реални наблюдения от метеорологични станции по целия свят.",
        sources: [
          "Отворени метеорологични API данни",
          "Спутникови наблюдения",
          "Радарни данни за валежи",
          "Метеорологични станции в реално време"
        ]
      },

      accuracy: {
        title: "Точност на прогнозите",
        description: "Нашата цел е да предоставим най-точните прогнози възможни. Почасовата прогноза има точност от над 90% за следващите 12 часа, а 5-дневната прогноза е надеждна с точност от 70-80%.",
        factors: [
          "Използване на множество източници на данни",
          "Постоянно обновяване на метеорологичните модели",
          "Машинно обучение за подобряване на точността",
          "Потребителски отзиви за валидация"
        ]
      },

      privacy: {
        title: "Поверителност и сигурност",
        description: "Вашата поверителност е от първостепенно значение за нас. Не събираме лични данни без ваше съгласие и всички метеорологични данни се обработват анонимно.",
        commitments: [
          "Без събиране на лични данни",
          "Шифроване на всички комуникации",
          "Спазване на GDPR регламентите",
          "Прозрачна политика за поверителност"
        ]
      },

      future: {
        title: "Бъдещо развитие",
        description: "Oblako постоянно се развива и подобрява. Работим върху нови функции като прогнози за качеството на въздуха, предупреждения за екстремни метеорологични явления и интеграция с умни домакински устройства.",
        upcoming: [
          "Прогнози за качество на въздуха",
          "Предупреждения за екстремни явления",
          "Интеграция с IoT устройства",
          "Разширени графики и анализи"
        ]
      }
    },
    en: {
      title: "About Oblako ☁️",
      subtitle: "Your trusted weather forecast partner",
      intro: "Oblako is a modern weather forecast application created to provide users with accurate and timely information about atmospheric conditions. Our mission is to make weather forecasting accessible, understandable, and useful for everyone.",
      
      features: {
        title: "Key Features",
        items: [
          {
            title: "Hourly Forecast",
            description: "Get detailed forecasts for every hour of the day, including temperature, humidity, pressure, and wind speed. Our data updates every 15 minutes for maximum accuracy."
          },
          {
            title: "5-Day Forecast",
            description: "Plan your week with our detailed 5-day forecast. Includes maximum and minimum temperatures, precipitation probability, and general meteorological conditions."
          },
          {
            title: "Interactive Map",
            description: "View real-time weather on an interactive map. Observe cloud movement, temperatures, and atmospheric pressure worldwide."
          },
          {
            title: "Sunrise and Sunset",
            description: "Know exactly when the sun will rise and set for your location. This information is especially useful for photographers, tourists, and people planning outdoor activities."
          },
          {
            title: "Charts and Analytics",
            description: "Visualize temperature changes and other meteorological data through interactive charts. Analyze weather trends and patterns."
          }
        ]
      },

      technology: {
        title: "Technology and Data",
        description: "Oblako uses the latest technologies and data from world-renowned meteorological organizations. Our forecasts are based on complex mathematical models and real observations from weather stations around the world.",
        sources: [
          "Open weather API data",
          "Satellite observations",
          "Radar data for precipitation",
          "Real-time weather stations"
        ]
      },

      accuracy: {
        title: "Forecast Accuracy",
        description: "Our goal is to provide the most accurate forecasts possible. The hourly forecast has over 90% accuracy for the next 12 hours, while the 5-day forecast is reliable with 70-80% accuracy.",
        factors: [
          "Use of multiple data sources",
          "Continuous updating of meteorological models",
          "Machine learning for accuracy improvement",
          "User feedback for validation"
        ]
      },

      privacy: {
        title: "Privacy and Security",
        description: "Your privacy is of utmost importance to us. We do not collect personal data without your consent and all meteorological data is processed anonymously.",
        commitments: [
          "No personal data collection",
          "Encryption of all communications",
          "GDPR compliance",
          "Transparent privacy policy"
        ]
      },

      future: {
        title: "Future Development",
        description: "Oblako is constantly evolving and improving. We are working on new features such as air quality forecasts, extreme weather warnings, and integration with smart home devices.",
        upcoming: [
          "Air quality forecasts",
          "Extreme weather warnings",
          "IoT device integration",
          "Enhanced charts and analytics"
        ]
      }
    }
  };

  const currentContent = content[language];

  return (
    <div className="about-page">
      <header className="about-header">
        <h1 className="about-title">
          {currentContent.title}
        </h1>
        <p className="about-subtitle">
          {currentContent.subtitle}
        </p>
      </header>

      <section className="about-section">
        <p className="about-intro">
          {currentContent.intro}
        </p>
      </section>

      <section className="about-section">
        <h2 className="about-section-title">
          {currentContent.features.title}
        </h2>
        <div className="about-features-grid">
          {currentContent.features.items.map((feature, index) => (
            <div key={index} className="about-feature-card">
              <h3 className="about-feature-title">
                {feature.title}
              </h3>
              <p className="about-feature-description">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="about-section">
        <h2 className="about-section-title">
          {currentContent.technology.title}
        </h2>
        <p className="about-section-description">
          {currentContent.technology.description}
        </p>
        <ul className="about-list">
          {currentContent.technology.sources.map((source, index) => (
            <li key={index} className="about-list-item">
              ✓ {source}
            </li>
          ))}
        </ul>
      </section>

      <section className="about-section">
        <h2 className="about-section-title">
          {currentContent.accuracy.title}
        </h2>
        <p className="about-section-description">
          {currentContent.accuracy.description}
        </p>
        <div className="about-factors-grid">
          {currentContent.accuracy.factors.map((factor, index) => (
            <div key={index} className="about-factor-card">
              {factor}
            </div>
          ))}
        </div>
      </section>

      <section className="about-section">
        <h2 className="about-section-title">
          {currentContent.privacy.title}
        </h2>
        <p className="about-section-description">
          {currentContent.privacy.description}
        </p>
        <ul className="about-list">
          {currentContent.privacy.commitments.map((commitment, index) => (
            <li key={index} className="about-list-item">
              🔒 {commitment}
            </li>
          ))}
        </ul>
      </section>

      <section className="about-section">
        <h2 className="about-section-title">
          {currentContent.future.title}
        </h2>
        <p className="about-section-description">
          {currentContent.future.description}
        </p>
        <div className="about-upcoming-grid">
          {currentContent.future.upcoming.map((feature, index) => (
            <div key={index} className="about-upcoming-card">
              🚀 {feature}
            </div>
          ))}
        </div>
      </section>

      <footer className="about-footer">
        <p className="about-footer-text">
          {language === 'bg' 
            ? 'Благодарим ви, че избрахте Oblako за вашите метеорологични нужди!'
            : 'Thank you for choosing Oblako for your weather needs!'
          }
        </p>
      </footer>
    </div>
  );
};

export default About; 