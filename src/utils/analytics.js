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
    // Consent Mode v2: всичко е "denied" по подразбиране; тази функция се вика само след
    // съгласие, затова веднага се дава единствено analytics_storage. Реклама не се ползва.
    window.gtag('consent', 'default', {
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
        analytics_storage: 'denied',
    });
    window.gtag('consent', 'update', { analytics_storage: 'granted' });
    window.gtag('js', new Date());
    window.gtag('config', GA_ID);

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    document.head.appendChild(script);
}
