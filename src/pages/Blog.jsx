import React from 'react';
import WeatherBlog from '../components/WeatherBlog';
import SEOHead from '../components/SEOHead';

const Blog = () => {
  return (
    <>
      <SEOHead 
        title="Метеорологичен блог - Oblako ☁️"
        description="Научете повече за времето, климата и метеорологията. Полезни статии за прогнози, UV индекс, качество на въздуха и сезонни промени в България."
        keywords="метеорологичен блог, статии за времето, климат, метеорология, UV индекс, качество на въздуха, сезони в България, прогноза за времето"
        url="https://oblako17.online/blog"
        type="article"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "Blog",
          "name": "Метеорологичен блог - Oblako",
          "description": "Блог за времето, климата и метеорологията",
          "url": "https://oblako17.online/blog",
          "publisher": {
            "@type": "Organization",
            "name": "Oblako",
            "url": "https://oblako17.online"
          },
          "blogPost": [
            {
              "@type": "BlogPosting",
              "headline": "Как да разчитаме прогнозата за времето правилно",
              "description": "Научете как да интерпретирате метеорологичните данни и да правите точни прогнози за времето.",
              "datePublished": "2024-12-19",
              "author": {
                "@type": "Organization",
                "name": "Oblako Team"
              }
            },
            {
              "@type": "BlogPosting",
              "headline": "UV индекс и защита от слънцето",
              "description": "Разберете важността на UV индекса и как да се защитите от вредните слънчеви лъчи.",
              "datePublished": "2024-12-18",
              "author": {
                "@type": "Organization",
                "name": "Oblako Team"
              }
            },
            {
              "@type": "BlogPosting",
              "headline": "Качество на въздуха и здравето",
              "description": "Научете как качеството на въздуха влияе върху здравето и как да следите AQI индекса.",
              "datePublished": "2024-12-17",
              "author": {
                "@type": "Organization",
                "name": "Oblako Team"
              }
            },
            {
              "@type": "BlogPosting",
              "headline": "Сезонни промени и времето в България",
              "description": "Разберете как се променя времето през различните сезони в България и какво да очаквате.",
              "datePublished": "2024-12-16",
              "author": {
                "@type": "Organization",
                "name": "Oblako Team"
              }
            }
          ]
        }}
      />
      <WeatherBlog />
    </>
  );
};

export default Blog; 