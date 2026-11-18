// Име на населено място по координати (BigDataCloud, без ключ).
export async function reverseGeocode(lat, lon) {
    try {
        const res = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
        );
        if (!res.ok) return null;
        const d = await res.json();
        const name = d.city || d.locality || d.principalSubdivision;
        return name ? { name, country: d.countryCode || '' } : null;
    } catch {
        return null;
    }
}
