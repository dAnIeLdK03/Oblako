import React from 'react';
import { Helmet } from '@dr.pogodin/react-helmet';

const SEOHead = ({ 
  title, 
  description, 
  keywords, 
  image, 
  url, 
  type = 'website',
  language = 'bg',
  structuredData = null
}) => {
  const defaultTitle = 'Oblako ☁️ - Безплатна прогноза за времето в реално време';
  const defaultDescription = 'Безплатна прогноза за времето в реално време. Точна почасова и 5-дневна прогноза, интерактивна карта, графики за температури, изгрев и залез за всеки град в България и света.';
  const defaultKeywords = 'времето, прогноза, weather, облако, облако app, weather app, карта, прогноза за времето, безплатна прогноза, почасова прогноза, температура, изгрев, залез, България, weather forecast, free weather app, метеорология, атмосферни условия, UV индекс, качество на въздуха, дъжд, сняг, облачно, ясно, гръмотевици';
  const defaultImage = 'https://oblako17.online/icons/icon-192x192.png';
  const defaultUrl = 'https://oblako17.online/';

  const currentTitle = title || defaultTitle;
  const currentDescription = description || defaultDescription;
  const currentKeywords = keywords || defaultKeywords;
  const currentImage = image || defaultImage;
  const currentUrl = url || defaultUrl;

  // Допълнителни ключови думи за по-добро SEO
  const enhancedKeywords = `${currentKeywords}, прогноза за времето утре, прогноза за времето седмица, метеорологична станция, атмосферно налягане, влажност на въздуха, скорост на вятъра, насока на вятъра, видимост, облачност, температура на усещане, точка на оросяване, индекса на топлинния стрес, индекс на комфорта`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{currentTitle}</title>
      <meta name="description" content={currentDescription} />
      <meta name="keywords" content={enhancedKeywords} />
      <meta name="author" content="Oblako Team" />
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow" />
      <meta name="bingbot" content="index, follow" />
      
      {/* Language and Locale */}
      <meta httpEquiv="content-language" content={language} />
      <meta name="language" content={language} />
      <meta name="geo.region" content="BG" />
      <meta name="geo.country" content="Bulgaria" />
      <meta name="geo.placename" content="Bulgaria" />
      
      {/* Open Graph */}
      <meta property="og:title" content={currentTitle} />
      <meta property="og:description" content={currentDescription} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:image" content={currentImage} />
      <meta property="og:image:width" content="192" />
      <meta property="og:image:height" content="192" />
      <meta property="og:image:alt" content="Oblako Weather App Icon" />
      <meta property="og:locale" content={language === 'bg' ? 'bg_BG' : 'en_US'} />
      <meta property="og:site_name" content="Oblako" />
      <meta property="og:updated_time" content={new Date().toISOString()} />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={currentTitle} />
      <meta name="twitter:description" content={currentDescription} />
      <meta name="twitter:image" content={currentImage} />
      <meta name="twitter:image:alt" content="Oblako Weather App Icon" />
      <meta name="twitter:creator" content="@oblako_weather" />
      <meta name="twitter:site" content="@oblako_weather" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={currentUrl} />
      
      {/* Additional SEO Meta Tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
      <meta name="theme-color" content="#74b9ff" />
      <meta name="msapplication-TileColor" content="#1a1a2e" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="Oblako" />
      
      {/* Performance Optimizations */}
      <link rel="dns-prefetch" href="//api.openweathermap.org" />
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//www.googletagmanager.com" />
      <link rel="preconnect" href="https://api.openweathermap.org" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      
      {/* PWA Icons */}
      <link rel="icon" type="image/svg+xml" href="/icons/icon-192x192.svg" />
      <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      <link rel="manifest" href="/manifest.json" />
      
      {/* Structured Data */}
      <script type="application/ld+json">
      {JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "Oblako",
        "alternateName": "Oblako Weather App",
        "description": currentDescription,
        "url": currentUrl,
        "applicationCategory": "WeatherApplication",
        "operatingSystem": "Web Browser",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "BGN"
        },
        "author": {
          "@type": "Organization",
          "name": "Oblako Team",
          "url": currentUrl
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.8",
          "ratingCount": "150",
          "bestRating": "5",
          "worstRating": "1"
        },
        "featureList": [
          "Почасова прогноза за времето",
          "5-дневна прогноза",
          "Интерактивна карта",
          "Графики за температури",
          "Изгрев и залез",
          "Многоезична поддръжка",
          "Офлайн функционалност",
          "UV индекс",
          "Качество на въздуха",
          "Вероятност за дъжд"
        ],
        "screenshot": currentImage,
        "softwareVersion": "1.0.0",
        "datePublished": "2024-01-01",
        "dateModified": new Date().toISOString().split('T')[0]
      })}
      </script>
      
      <script type="application/ld+json">
      {JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Oblako",
        "url": currentUrl,
        "logo": currentImage,
        "description": currentDescription,
        "sameAs": [
          currentUrl
        ],
        "contactPoint": {
          "@type": "ContactPoint",
          "email": "oblako997@gmail.bg",
          "contactType": "customer service"
        }
      })}
      </script>
      
      <script type="application/ld+json">
      {JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "Oblako",
        "url": currentUrl,
        "description": currentDescription,
        "potentialAction": {
          "@type": "SearchAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": currentUrl + "?city={search_term_string}"
          },
          "query-input": "required name=search_term_string"
        }
      })}
      </script>

      {/* FAQ Schema for better SEO */}
      <script type="application/ld+json">
      {JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Как да проверя прогнозата за времето?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Просто отворете Oblako приложението и въведете града или позволете автоматично определяне на местоположението. Ще получите точна прогноза за времето в реално време."
            }
          },
          {
            "@type": "Question",
            "name": "Безплатно ли е приложението?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Да, Oblako е напълно безплатно приложение за прогноза на времето без скрити такси или покупки в приложението."
            }
          },
          {
            "@type": "Question",
            "name": "Работи ли без интернет?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Да, Oblako е PWA приложение което работи офлайн с кеширани данни за времето."
            }
          }
        ]
      })}
      </script>

      {/* Custom Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

export default SEOHead; 