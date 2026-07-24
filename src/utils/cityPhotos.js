const CITY_PHOTOS = {
    sofia: '/city-photos/sofia.jpg',
    plovdiv: '/city-photos/plovdiv.jpg',
    varna: '/city-photos/varna.jpg',
    london: '/city-photos/london.jpg',
    paris: '/city-photos/paris.jpg',
    newyork: '/city-photos/newyork.jpg',
    tokyo: '/city-photos/tokyo.jpg',
};

const DEFAULT_PHOTO = '/city-photos/default.jpg';

export function getCityPhoto(cityName) {
    if (!cityName) return DEFAULT_PHOTO;
    const key = cityName.toLowerCase().replace(/[^a-z]/g, '');
    return CITY_PHOTOS[key] || DEFAULT_PHOTO;
}
