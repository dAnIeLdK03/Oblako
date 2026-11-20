import { useEffect } from 'react';
import { useLanguage } from '../LanguageContext.jsx';

const SITE_URL = 'https://oblako17.online';

// Заглавие и описание за всяка страница. {city} се попълва, когато е показано конкретно място.
// path е каноничният адрес (без ?city=…: страниците с място не са отделни целеви страници).
const PAGES = {
  home: {
    path: '/',
    bg: {
      title: 'Oblako – Прогноза за времето в реално време',
      titleCity: 'Времето във {city} – Oblako',
      description:
        'Безплатна прогноза за времето в реално време: почасова и дневна прогноза, интерактивна карта, изгрев и залез за всеки град в България и света.',
      descriptionCity:
        'Времето във {city}: текуща температура, почасова и 14-дневна прогноза, вятър, влажност, вероятност за валежи, UV индекс, изгрев и залез.',
    },
    en: {
      title: 'Oblako – Real-time weather forecast',
      titleCity: 'Weather in {city} – Oblako',
      description:
        'Free real-time weather forecast. Hourly and daily forecast, interactive map, temperature charts, sunrise and sunset for any city in Bulgaria and worldwide.',
      descriptionCity:
        'Weather in {city}: current temperature, hourly and 14-day forecast, wind, humidity, chance of rain, UV index, sunrise and sunset.',
    },
  },
  forecast: {
    path: '/forecast',
    bg: {
      title: '14-дневна прогноза за времето – Oblako',
      titleCity: 'Прогноза за времето във {city} за 14 дни – Oblako',
      description:
        'Подробна прогноза за времето за следващите 14 дни: минимални и максимални температури, вятър, влажност и вероятност за валежи.',
      descriptionCity:
        '14-дневна прогноза за {city}: минимални и максимални температури, вятър, влажност и вероятност за валежи за всеки ден.',
    },
    en: {
      title: '14-day weather forecast – Oblako',
      titleCity: '14-day weather forecast for {city} – Oblako',
      description:
        'Detailed weather forecast for the next 14 days: minimum and maximum temperatures, wind, humidity and chance of rain.',
      descriptionCity:
        '14-day forecast for {city}: minimum and maximum temperatures, wind, humidity and chance of rain for every day.',
    },
  },
  rain: {
    path: '/rain-chance',
    bg: {
      title: 'Вероятност за валежи – Oblako',
      titleCity: 'Вероятност за валежи във {city} – Oblako',
      description: 'Вероятност за дъжд и сняг по часове и по дни за вашето местоположение или за всеки град.',
      descriptionCity: 'Вероятност за дъжд и сняг във {city} по часове за днес и по дни за седмицата.',
    },
    en: {
      title: 'Chance of rain – Oblako',
      titleCity: 'Chance of rain in {city} – Oblako',
      description: 'Chance of rain and snow by the hour and by the day for your location or any city.',
      descriptionCity: 'Chance of rain and snow in {city} by the hour for today and by the day for the week.',
    },
  },
  uv: {
    path: '/uv-index',
    bg: {
      title: 'UV индекс – Oblako',
      titleCity: 'UV индекс във {city} – Oblako',
      description: 'Текущ UV индекс, ниво на риск и съвети за защита от слънцето.',
      descriptionCity: 'Текущ UV индекс във {city}, ниво на риск и съвети за защита от слънцето.',
    },
    en: {
      title: 'UV index – Oblako',
      titleCity: 'UV index in {city} – Oblako',
      description: 'Current UV index, risk level and sun protection advice.',
      descriptionCity: 'Current UV index in {city}, risk level and sun protection advice.',
    },
  },
  tips: {
    path: '/weather-tips',
    bg: {
      title: 'Съвети за времето – Oblako',
      description: 'Полезни съвети как да се подготвите за жега, студ, дъжд, вятър и силно слънце.',
    },
    en: {
      title: 'Weather tips – Oblako',
      description: 'Useful tips on how to prepare for heat, cold, rain, wind and strong sun.',
    },
  },
  terms: {
    path: '/terms',
    bg: { title: 'Условия за ползване – Oblako', description: 'Условия за ползване на Oblako.' },
    en: { title: 'Terms of use – Oblako', description: 'Terms of use for Oblako.' },
  },
  privacy: {
    path: '/privacy',
    bg: {
      title: 'Правила за поверителност – Oblako',
      description: 'Какви данни обработва Oblako, при какви условия и кои трети страни ги получават.',
    },
    en: {
      title: 'Privacy policy – Oblako',
      description: 'What data Oblako processes, under what conditions and which third parties receive it.',
    },
  },
  cookies: {
    path: '/cookies',
    bg: { title: 'Политика за бисквитки – Oblako', description: 'Как Oblako използва бисквитки и локално съхранение.' },
    en: { title: 'Cookie policy – Oblako', description: 'How Oblako uses cookies and local storage.' },
  },
  // Неизвестен адрес: не се индексира
  notFound: {
    path: null,
    noindex: true,
    bg: { title: 'Страницата не е намерена – Oblako', description: 'Тази страница не съществува.' },
    en: { title: 'Page not found – Oblako', description: 'This page does not exist.' },
  },
};

function setMeta(attr, key, content) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setCanonical(href) {
  let el = document.head.querySelector('link[rel="canonical"]');
  if (!href) {
    el?.remove();
    return;
  }
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

// Сменя title, description, canonical, Open Graph и robots на място (без дублиране на
// таговете от index.html). Нищо не се чисти при излизане: следващата страница ги презаписва.
export function useSeo(page, { city } = {}) {
  const { language } = useLanguage();

  useEffect(() => {
    const config = PAGES[page];
    const copy = config[language] || config.bg;
    const fill = (text) => text.replace('{city}', city);
    const title = city && copy.titleCity ? fill(copy.titleCity) : copy.title;
    const description = city && copy.descriptionCity ? fill(copy.descriptionCity) : copy.description;
    const url = config.path ? `${SITE_URL}${config.path === '/' ? '/' : config.path}` : null;

    document.title = title;
    document.documentElement.lang = language;
    setMeta('name', 'description', description);
    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', description);
    setMeta('name', 'twitter:title', title);
    setMeta('name', 'twitter:description', description);
    setCanonical(url);
    if (url) setMeta('property', 'og:url', url);

    // robots: noindex само за "не е намерено"; иначе се връща стойността от index.html
    const robots = document.head.querySelector('meta[name="robots"]');
    if (robots) {
      robots.dataset.defaultContent ??= robots.getAttribute('content');
      robots.setAttribute('content', config.noindex ? 'noindex, follow' : robots.dataset.defaultContent);
    }
  }, [page, language, city]);
}
