// Google Analytics се зарежда САМО след изричното съгласие "Приемам всички".
// До тогава към Google не се праща нищо (нито заявка за скрипта, нито IP адрес).
const GA_ID = 'G-RKJ1SRJKBX';
const CONSENT_KEY = 'oblako_cookie_consent';

export function hasAnalyticsConsent() {
    try {
        return localStorage.getItem(CONSENT_KEY) === 'all';
    } catch {
        return false;
    }
}

export function loadAnalytics() {
    if (window.__gaLoaded) return;
    window.__gaLoaded = true;

    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', GA_ID);

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    document.head.appendChild(script);
}
