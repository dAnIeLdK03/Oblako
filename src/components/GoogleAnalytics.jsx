import React, { useEffect } from 'react';

const GoogleAnalytics = ({ trackingId = 'G-XXXXXXXXXX' }) => {
  useEffect(() => {
    // Load Google Analytics
    const script1 = document.createElement('script');
    script1.async = true;
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${trackingId}`;
    document.head.appendChild(script1);

    const script2 = document.createElement('script');
    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${trackingId}', {
        page_title: document.title,
        page_location: window.location.href,
        custom_map: {
          'custom_parameter_1': 'weather_app',
          'custom_parameter_2': 'pwa'
        }
      });
    `;
    document.head.appendChild(script2);

    // Track page views
    const trackPageView = () => {
      if (window.gtag) {
        window.gtag('event', 'page_view', {
          page_title: document.title,
          page_location: window.location.href,
          page_referrer: document.referrer
        });
      }
    };

    // Track custom events
    const trackWeatherSearch = (city) => {
      if (window.gtag) {
        window.gtag('event', 'weather_search', {
          search_term: city,
          content_type: 'weather_forecast'
        });
      }
    };

    const trackFeatureUsage = (feature) => {
      if (window.gtag) {
        window.gtag('event', 'feature_usage', {
          feature_name: feature,
          app_version: '1.0.0'
        });
      }
    };

    const trackShare = (platform) => {
      if (window.gtag) {
        window.gtag('event', 'share', {
          method: platform,
          content_type: 'weather_app'
        });
      }
    };

    // Track PWA installation
    const trackPWAInstall = () => {
      if (window.gtag) {
        window.gtag('event', 'pwa_install', {
          app_name: 'Oblako',
          app_version: '1.0.0'
        });
      }
    };

    // Track offline usage
    const trackOfflineUsage = () => {
      if (window.gtag) {
        window.gtag('event', 'offline_usage', {
          feature: 'cached_weather_data'
        });
      }
    };

    // Expose tracking functions globally
    window.trackWeatherSearch = trackWeatherSearch;
    window.trackFeatureUsage = trackFeatureUsage;
    window.trackShare = trackShare;
    window.trackPWAInstall = trackPWAInstall;
    window.trackOfflineUsage = trackOfflineUsage;

    // Track initial page view
    trackPageView();

    // Track when app becomes visible
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        trackPageView();
      }
    });

    // Track PWA install prompt
    window.addEventListener('beforeinstallprompt', () => {
      trackPWAInstall();
    });

    // Track offline events
    window.addEventListener('offline', () => {
      trackOfflineUsage();
    });

    return () => {
      // Cleanup
      document.head.removeChild(script1);
      document.head.removeChild(script2);
    };
  }, [trackingId]);

  return null; // This component doesn't render anything
};

export default GoogleAnalytics; 