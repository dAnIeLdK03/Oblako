// Име на населено място по координати. Не зависи от доставчика на времето.
// 1) BigDataCloud (без ключ)  2) OpenWeather geo (ако има ключ).
const OWM_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

async function viaBigDataCloud(lat, lon) {
    const res = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
    );
    if (!res.ok) return null;
    const d = await res.json();
    const name = d.city || d.locality || d.principalSubdivision;
    return name ? { name, country: d.countryCode || '' } : null;
}

async function viaOpenWeather(lat, lon) {
    if (!OWM_KEY) return null;
    const res = await fetch(
        `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${OWM_KEY}`
    );
    if (!res.ok) return null;
    const [place] = await res.json();
    return place ? { name: place.name, country: place.country } : null;
}

export async function reverseGeocode(lat, lon) {
    for (const lookup of [viaBigDataCloud, viaOpenWeather]) {
        try {
            const place = await lookup(lat, lon);
            if (place) return place;
        } catch {
            // опитваме следващия
        }
    }
    return null;
}
