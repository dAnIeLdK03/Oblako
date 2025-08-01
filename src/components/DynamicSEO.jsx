import React from 'react';
import { Helmet } from '@dr.pogodin/react-helmet';
import { useLanguage } from '../LanguageContext.jsx';

const DynamicSEO = ({ 
  pageTitle, 
  pageDescription, 
  pageKeywords, 
  pageUrl,
  structuredData 
}) => {
  const { language } = useLanguage();
  
  const defaultStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": pageTitle,
    "description": pageDescription,
    "url": pageUrl,
    "inLanguage": language === 'bg' ? 'bg-BG' : 'en-US',
    "isPartOf": {
      "@type": "WebSite",
      "name": "Oblako",
      "url": "https://oblako17.online/"
    }
  };

  const finalStructuredData = structuredData || defaultStructuredData;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      <meta name="keywords" content={pageKeywords} />
      
      {/* Open Graph */}
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:locale" content={language === 'bg' ? 'bg_BG' : 'en_US'} />
      
      {/* Twitter Card */}
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={pageUrl} />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(finalStructuredData)}
      </script>
    </Helmet>
  );
};

export default DynamicSEO; 