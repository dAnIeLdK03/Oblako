import React from 'react';
import { Helmet } from '@dr.pogodin/react-helmet';

const SEOHead = ({ 
  title, 
  description, 
  keywords, 
  image, 
  url, 
  type = 'website' 
}) => {
  const defaultTitle = 'Oblako ☁️ - Безплатна прогноза за времето';
  const defaultDescription = 'Безплатна прогноза за времето в реално време. Точна почасова и 5-дневна прогноза, интерактивна карта, графики за температури, изгрев и залез за всеки град в България и света.';
  const defaultKeywords = 'времето, прогноза, weather, облако, облако app, weather app, карта, прогноза за времето, безплатна прогноза, почасова прогноза, температура, изгрев, залез, България, weather forecast, free weather app';
  const defaultImage = 'https://oblako17.online/public/icons/icon-192x192.png';
  const defaultUrl = 'https://oblako17.online/';

  return (
    <Helmet>
      <title>{title || defaultTitle}</title>
      <meta name="description" content={description || defaultDescription} />
      <meta name="keywords" content={keywords || defaultKeywords} />
      
      {/* Open Graph */}
      <meta property="og:title" content={title || defaultTitle} />
      <meta property="og:description" content={description || defaultDescription} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url || defaultUrl} />
      <meta property="og:image" content={image || defaultImage} />
      <meta property="og:image:width" content="192" />
      <meta property="og:image:height" content="192" />
      <meta property="og:locale" content="bg_BG" />
      <meta property="og:site_name" content="Oblako" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title || defaultTitle} />
      <meta name="twitter:description" content={description || defaultDescription} />
      <meta name="twitter:image" content={image || defaultImage} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={url || defaultUrl} />
    </Helmet>
  );
};

export default SEOHead; 