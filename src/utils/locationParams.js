// Мястото в URL: ?city=Sofia  или  ?lat=42.698&lon=23.322
// Валидира входа от адресната лента (може да е ръчно редактиран или споделен).

export function parsePlace(searchParams) {
    const city = searchParams.get('city')?.trim();
    if (city) return { type: 'city', city: city.slice(0, 100) };

    const lat = parseFloat(searchParams.get('lat'));
    const lon = parseFloat(searchParams.get('lon'));
    if (Number.isFinite(lat) && Number.isFinite(lon) && Math.abs(lat) <= 90 && Math.abs(lon) <= 180) {
        return { type: 'coords', lat, lon };
    }
    return null;
}

export const cityParams = (city) => new URLSearchParams({ city });

// ~100 м точност: достатъчна за времето, без излишни цифри в адреса
export const coordsParams = (lat, lon) =>
    new URLSearchParams({ lat: Number(lat).toFixed(3), lon: Number(lon).toFixed(3) });

// Само параметрите за място от дадена адресна лента ("?city=…" или "").
// Ползва се, за да се запази избраното място при преминаване между страниците.
export function placeSearch(search) {
    const place = parsePlace(new URLSearchParams(search));
    if (!place) return '';
    const params = place.type === 'city' ? cityParams(place.city) : coordsParams(place.lat, place.lon);
    return `?${params}`;
}
