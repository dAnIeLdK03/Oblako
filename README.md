# Oblako

Безплатно приложение за прогноза на времето: текущо време, почасова и дневна прогноза, вероятност за валежи, UV индекс, интерактивна карта и графики. Работи на български и английски, в светла и тъмна тема, и може да се инсталира като приложение (PWA), показвайки последната прогноза без интернет.

Сайт: https://oblako17.online

## Данни

Приложението **не изисква API ключове**.

| За какво                   | Услуга                                                                      |
| -------------------------- | --------------------------------------------------------------------------- |
| Прогноза и търсене на град | [Open-Meteo](https://open-meteo.com/)                                       |
| Име на място по координати | [BigDataCloud](https://www.bigdatacloud.com/) (reverse geocoding, без ключ) |
| Карта                      | OpenStreetMap, Esri и OpenTopoMap (плочки)                                  |

Open-Meteo е безплатна за некомерсиална употреба и изисква посочване на източника (във футъра е). За комерсиална употреба вижте условията им.

Само файлът [src/services/weather/openmeteo.js](src/services/weather/openmeteo.js) знае за конкретния доставчик. Останалото приложение ползва единния модел от [src/services/weather/index.js](src/services/weather/index.js), описан с JSDoc типове. За смяна на доставчика се пренаписва само първият файл.

## Изисквания

Node.js `^20.19.0` или `>=22.12.0` (изискване на Vite 7).

## Команди

```bash
npm install            # зависимости
npm run dev            # dev сървър (Vite, http://localhost:5173)
npm run build          # production билд в dist/
npm run preview        # локален преглед на билда от dist/

npm run lint           # ESLint
npm run lint:fix       # ESLint с автоматични поправки
npm run format         # Prettier: форматира всичко
npm run format:check   # Prettier: само проверка (без промени)
```

Service worker-ът (офлайн режим) се генерира при `npm run build`. В `npm run dev` не е активен, затова офлайн режимът се проверява с `npm run build && npm run preview`.

## Структура

```
src/
  pages/            страниците (начало, прогноза, валежи, UV, съвети, правни текстове)
  components/       компоненти; всеки със свой CSS модул (*.module.css)
  hooks/            useWeather (място, геолокация, кеш), заявки, useSeo
  services/weather/ данни за времето: единен модел + доставчик (Open-Meteo)
  utils/            локация, localStorage, анализи
  translations.js   всички текстове (bg / en)
public/             статични файлове, манифест, икони, снимки на градове
vercel.json         SPA rewrite и security заглавия (CSP и др.)
```

## Деплой

Сайтът е статичен: Vercel сервира `dist/` (`npm run build`), а [vercel.json](vercel.json) задава пренасочването към `index.html` и заглавията за сигурност, включително Content Security Policy. Нов външен адрес (API, CDN, шрифт) трябва да се добави в CSP, иначе браузърът ще го блокира.

## Поверителност

- Google Analytics се зарежда само след съгласие („Приемам всички“), с Google Consent Mode; без съгласие към Google не се изпраща нищо.
- Местоположението се иска от браузъра и се изпраща само към Open-Meteo и BigDataCloud. Oblako няма собствен сървър и не го съхранява.
- За работа без интернет на устройството се пазят кеш на приложението и последното място (закръглено до около 1 км).

Подробности са в страниците „Правила за поверителност“ и „Политика за бисквитки“ ([src/pages/Privacy.jsx](src/pages/Privacy.jsx), [src/pages/Cookies.jsx](src/pages/Cookies.jsx)).
