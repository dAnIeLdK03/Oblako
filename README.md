# ☁️ Oblako - Безплатна прогноза за времето

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.0-blue.svg)](https://reactjs.org/)
[![PWA](https://img.shields.io/badge/PWA-Ready-green.svg)](https://web.dev/progressive-web-apps/)
[![SEO](https://img.shields.io/badge/SEO-Optimized-orange.svg)](https://developers.google.com/search)

**Oblako** е модерно двуезично (български/английски) Progressive Web App за прогноза на времето, разработено с React и Vite. Приложението поддържа офлайн режим, инсталиране на устройство, интерактивна карта и спазва всички изисквания за поверителност и бисквитки.

## 🌟 Основни функции

### 📱 **PWA Възможности**
- ✅ **Офлайн поддръжка** - работи без интернет
- ✅ **Инсталация на устройство** - като нативно приложение
- ✅ **Push notifications** - известия за промени във времето
- ✅ **Кеширане** - бързо зареждане

### 🌍 **Многоезичност**
- 🇧🇬 **Български** - пълна поддръжка
- 🇺🇸 **English** - complete support
- 🔄 **Автоматично превключване** според браузъра

### 🗺️ **Интерактивна карта**
- 📍 **Избор на локация** с клик
- 🌤️ **Времето в реално време**
- 📊 **Визуализация на атмосферните условия**
- 🔄 **Автоматично обновяване**

### 📈 **Прогнози и графики**
- ⏰ **Почасова прогноза** - за следващите 24 часа
- 📅 **5-дневна прогноза** - детайлна информация
- 📊 **Графики за температури** - визуални представяния
- 🌅 **Изгрев и залез** - точни часове
- ☀️ **UV индекс** - защита от слънце
- 💨 **Качество на въздуха** - AQI индикатор

### 🎨 **Модерен дизайн**
- 🌙 **Тъмна/светла тема** - автоматично превключване
- 📱 **Responsive дизайн** - за всички устройства
- ⚡ **Бързо зареждане** - оптимизирано за скорост
- 🎯 **Интуитивен интерфейс** - лесен за ползване

## 🚀 Инсталация и стартиране

### Предварителни изисквания
- Node.js (версия 16 или по-нова)
- npm или yarn

### 1. Клониране на репозиторията
```bash
git clone https://github.com/your-username/oblako-weather-app.git
cd oblako-weather-app
```

### 2. Инсталиране на зависимостите
```bash
npm install
```

### 3. Стартиране в режим на разработка
```bash
npm run dev
```
Приложението ще се отвори на `http://localhost:5173`

### 4. Билд за продукция
```bash
npm run build
```

### 5. Преглед на продукционния билд
```bash
npm run preview
```

## 🛠️ Технологии

### Frontend
- **React 18** - модерна библиотека за UI
- **Vite** - бърз build tool
- **React Router** - навигация между страници
- **Context API** - управление на състоянието

### UI/UX
- **CSS3** - модерни стилове
- **Flexbox/Grid** - responsive layout
- **CSS Variables** - теми и цветове
- **Animations** - плавни преходи

### Карти и визуализации
- **Leaflet** - интерактивни карти
- **Chart.js** - графики и диаграми
- **React Chart.js 2** - React wrapper

### PWA
- **Service Worker** - офлайн функционалност
- **Web App Manifest** - инсталация на устройство
- **IndexedDB** - локално съхранение

### SEO
- **React Helmet** - управление на meta тагове
- **Structured Data** - JSON-LD schema
- **Sitemap** - автоматично генериране
- **Robots.txt** - търсачко индексиране

## 📁 Структура на проекта

```
oblako-weather-app/
├── public/
│   ├── icons/           # PWA икони
│   ├── manifest.json    # PWA конфигурация
│   ├── robots.txt       # SEO правила
│   └── sitemap.xml      # SEO карта на сайта
├── src/
│   ├── components/      # React компоненти
│   │   ├── SEOHead.jsx  # SEO оптимизация
│   │   ├── WeatherMap.jsx # Интерактивна карта
│   │   └── ...
│   ├── pages/          # Страници на приложението
│   ├── hooks/          # Custom React hooks
│   ├── contexts/       # React Context providers
│   └── translations.js # Многоезичност
├── server.js           # Backend сървър
└── package.json        # Зависимости и скриптове
```

## 🔧 Конфигурация

### Environment Variables
Създайте `.env` файл в root директорията:

```env
VITE_WEATHER_API_KEY=your_openweathermap_api_key
VITE_GOOGLE_ANALYTICS_ID=your_ga_id
VITE_GOOGLE_ADSENSE_ID=your_adsense_id
```

### API Ключове
1. **OpenWeatherMap API** - за данни за времето
   - Регистрирайте се на [openweathermap.org](https://openweathermap.org/api)
   - Вземете безплатен API ключ

2. **Google Analytics** - за аналитика
   - Създайте акаунт в [Google Analytics](https://analytics.google.com)
   - Добавете tracking ID

## 📱 PWA Функции

### Инсталация
Приложението може да се инсталира като нативно приложение:
- **Android** - Chrome/Edge показва "Add to Home Screen"
- **iOS** - Safari показва "Add to Home Screen"
- **Desktop** - Chrome показва install prompt

### Офлайн функционалност
- Кеширани данни за времето
- Работи без интернет връзка
- Автоматична синхронизация при връщане онлайн

## 🎨 Теми и персонализация

### Автоматични теми
Приложението автоматично променя темата според времето:
- ☀️ **Слънчево** - ярки цветове
- 🌧️ **Дъждовно** - сини тонове
- ❄️ **Снежно** - бели акценти
- 🌙 **Нощно** - тъмни цветове

### Ръчно превключване
Потребителите могат да превключат между:
- 🌙 **Тъмна тема** - за нощно ползване
- ☀️ **Светла тема** - за дневно ползване

## 📊 Аналитика и статистики

### Google Analytics
- 📈 **Page views** - посещения на страници
- ⏱️ **Time on page** - време на страница
- 📱 **Device analytics** - мобилни/десктоп
- 🌍 **Geographic data** - откъде са потребителите

### Admin панел
Скрит админ панел за статистики:
1. Кликнете иконата "ℹ️" 5 пъти
2. Въведете паролата
3. Вижте детайлни статистики

## 🔒 Поверителност и сигурност

### Събиране на данни
- ❌ **Не събираме лични данни**
- ✅ **Само анонимна статистика**
- ✅ **Локално съхранение на настройки**

### Бисквитки
- 🍪 **Функционални** - за работа на приложението
- 📊 **Аналитични** - Google Analytics
- 📢 **Рекламни** - Google AdSense

### Политики
- [Условия за ползване](/terms)
- [Политика за поверителност](/privacy)
- [Политика за бисквитки](/cookies)

## 🚀 Performance оптимизации

### Скорост на зареждане
- ⚡ **Vite** - бърз development и build
- 📦 **Code splitting** - lazy loading
- 🖼️ **Image optimization** - оптимизирани икони
- 💾 **Caching** - intelligent кеширане

### Core Web Vitals
- 🎯 **LCP** - Largest Contentful Paint < 2.5s
- 🎯 **FID** - First Input Delay < 100ms
- 🎯 **CLS** - Cumulative Layout Shift < 0.1

## 🔧 Скриптове

```bash
# Development
npm run dev          # Стартиране в режим на разработка
npm run build        # Билд за продукция
npm run preview      # Преглед на продукционния билд

# Code quality
npm run lint         # ESLint проверка
npm run lint:fix     # Автоматично поправяне

# Backend
node server.js       # Стартиране на backend сървъра
```

## 📈 SEO оптимизации

### Meta тагове
- ✅ **Title** - оптимизирани заключови думи
- ✅ **Description** - привлекателни описания
- ✅ **Keywords** - релевантни ключови думи

### Structured Data
- ✅ **WebApplication** schema
- ✅ **Organization** schema
- ✅ **WebSite** schema
- ✅ **FAQ** schema

### Технически SEO
- ✅ **Sitemap.xml** - автоматично генериране
- ✅ **Robots.txt** - правилни директиви
- ✅ **Canonical URLs** - избегване на дублиране
- ✅ **Hreflang** - многоезичност

## 🤝 Принос към проекта

### Как да допринесете
1. Fork-нете репозиторията
2. Създайте feature branch (`git checkout -b feature/amazing-feature`)
3. Commit-нете промените (`git commit -m 'Add amazing feature'`)
4. Push-нете към branch-а (`git push origin feature/amazing-feature`)
5. Отворете Pull Request

### Guidelines
- 📝 **Добре документиран код**
- 🧪 **Тестове за нови функции**
- 🎨 **Следване на design patterns**
- 📱 **Responsive дизайн**

## 📄 Лиценз

Този проект е лицензиран под MIT License - вижте [LICENSE](LICENSE) файла за детайли.

## 📞 Контакти

- 📧 **Email**: oblako997@gmail.bg
- 🌐 **Website**: [oblako17.online](https://oblako17.online)
- 📱 **PWA**: Инсталирайте от браузъра

## 🙏 Благодарности

- [OpenWeatherMap](https://openweathermap.org/) - за данни за времето
- [React](https://reactjs.org/) - за прекрасната библиотека
- [Vite](https://vitejs.dev/) - за бързия build tool
- [Leaflet](https://leafletjs.com/) - за интерактивните карти
- [Chart.js](https://www.chartjs.org/) - за графиките

## 📊 Статистики

![GitHub stars](https://img.shields.io/github/stars/your-username/oblako-weather-app)
![GitHub forks](https://img.shields.io/github/forks/your-username/oblako-weather-app)
![GitHub issues](https://img.shields.io/github/issues/your-username/oblako-weather-app)
![GitHub pull requests](https://img.shields.io/github/issues-pr/your-username/oblako-weather-app)

---

**⭐ Ако ви хареса проектът, моля давате звезда!**

**Made with ❤️ in Bulgaria**
