// Помощни функции за проверка на засечената локация.

// Реално име на населеното място по координати (по-точно от името на метеостанцията).
export async function reverseGeocode(latitude, longitude, apiKey) {
    try {
        const res = await fetch(
            `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${apiKey}`
        );
        if (!res.ok) return null;
        const [place] = await res.json();
        return place ? { name: place.name, country: place.country } : null;
    } catch {
        return null;
    }
}

// Проверява точността на позицията от браузъра.
// ok=false означава, че позицията е съмнителна (напр. приблизителна, по Wi-Fi/IP).
export function verifyLocation(position) {
    const { accuracy } = position.coords;
    if (accuracy > 20000) return { ok: false, reason: 'accuracy', accuracy };
    return { ok: true };
}
