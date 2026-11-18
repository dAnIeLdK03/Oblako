// WMO код на Open-Meteo -> OpenWeather формат, за да не се променя UI-ят.
// [id, main, description, базова икона]
const WMO = {
    0: [800, 'Clear', 'clear sky', '01'],
    1: [801, 'Clouds', 'few clouds', '02'],
    2: [802, 'Clouds', 'scattered clouds', '03'],
    3: [804, 'Clouds', 'overcast clouds', '04'],
    45: [741, 'Fog', 'fog', '50'],
    48: [741, 'Fog', 'fog', '50'],
    51: [300, 'Drizzle', 'light intensity drizzle', '09'],
    53: [301, 'Drizzle', 'drizzle', '09'],
    55: [302, 'Drizzle', 'heavy intensity drizzle', '09'],
    56: [511, 'Rain', 'freezing rain', '13'],
    57: [511, 'Rain', 'freezing rain', '13'],
    61: [500, 'Rain', 'light rain', '10'],
    63: [501, 'Rain', 'moderate rain', '10'],
    65: [502, 'Rain', 'heavy intensity rain', '10'],
    66: [511, 'Rain', 'freezing rain', '13'],
    67: [511, 'Rain', 'freezing rain', '13'],
    71: [600, 'Snow', 'light snow', '13'],
    73: [601, 'Snow', 'snow', '13'],
    75: [602, 'Snow', 'heavy snow', '13'],
    77: [600, 'Snow', 'light snow', '13'],
    80: [520, 'Rain', 'light intensity shower rain', '09'],
    81: [521, 'Rain', 'shower rain', '09'],
    82: [522, 'Rain', 'heavy intensity shower rain', '09'],
    85: [620, 'Snow', 'light shower snow', '13'],
    86: [622, 'Snow', 'heavy shower snow', '13'],
    95: [211, 'Thunderstorm', 'thunderstorm', '11'],
    96: [201, 'Thunderstorm', 'thunderstorm with rain', '11'],
    99: [202, 'Thunderstorm', 'thunderstorm with heavy rain', '11'],
};

export function wmoToCondition(code, isDay = true) {
    const [id, main, description, base] = WMO[code] || WMO[0];
    return { id, main, description, icon: `${base}${isDay ? 'd' : 'n'}` };
}

// Иконите са статични файлове (без ключ и без лимит на заявките).
export function getIconUrl(iconCode, { large = true } = {}) {
    return `https://openweathermap.org/img/wn/${iconCode}${large ? '@2x' : ''}.png`;
}
