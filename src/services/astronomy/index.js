// @ts-check
// Слънце и Луна, изчислени локално (без заявки). Моментите са unix секунди.
// Слънце: формулите на NOAA, точност около минута (без релеф и надморска височина).
// Луна: съкратените редове от Meeus; моментът на фазата е с точност от порядъка на час.

const DAY = 86400;
const RAD = Math.PI / 180;

const sin = (deg) => Math.sin(deg * RAD);
const cos = (deg) => Math.cos(deg * RAD);
const normalize = (deg) => ((deg % 360) + 360) % 360;

// Юлиански векове от J2000.0
const centuries = (time) => (time / DAY + 2440587.5 - 2451545) / 36525;

// Видима еклиптична дължина на Слънцето и величините, нужни за уравнението на времето
function sunPosition(T) {
  const meanLong = normalize(280.46646 + T * (36000.76983 + T * 0.0003032));
  const anomaly = 357.52911 + T * (35999.05029 - T * 0.0001537);
  const center =
    sin(anomaly) * (1.914602 - T * 0.004817) +
    sin(2 * anomaly) * (0.019993 - T * 0.000101) +
    sin(3 * anomaly) * 0.000289;
  const omega = 125.04 - 1934.136 * T;
  return {
    meanLong,
    anomaly,
    longitude: meanLong + center - 0.00569 - 0.00478 * sin(omega),
    obliquity: 23.439291 - T * 0.0130042 + 0.00256 * cos(omega),
    eccentricity: 0.016708634 - T * (0.000042037 + T * 0.0000001267),
  };
}

// Деклинация (градуси) и уравнение на времето (минути)
function solarCoordinates(time) {
  const s = sunPosition(centuries(time));
  const y = Math.tan((s.obliquity / 2) * RAD) ** 2;
  const e = s.eccentricity;
  const eot =
    y * sin(2 * s.meanLong) -
    2 * e * sin(s.anomaly) +
    4 * e * y * sin(s.anomaly) * cos(2 * s.meanLong) -
    0.5 * y * y * sin(4 * s.meanLong) -
    1.25 * e * e * sin(2 * s.anomaly);
  return {
    declination: Math.asin(sin(s.obliquity) * sin(s.longitude)) / RAD,
    equationOfTime: (4 * eot) / RAD,
  };
}

/**
 * Изгрев, залез и продължителност на деня за календарна дата на мястото.
 * @param {number} day        дни от 1970-01-01 по местното време на мястото
 * @param {{ lat: number, lon: number, utcOffset: number }} place
 * @returns {{ sunrise: number | null, sunset: number | null, dayLength: number,
 *   polar: 'day' | 'night' | null }}
 */
export function sunTimes(day, { lat, lon, utcOffset }) {
  const midnight = day * DAY;
  let noon = midnight + (720 - 4 * lon) * 60;
  // Близо до линията за смяна на датата слънчевият обед трябва да остане в същия местен ден
  noon += (day - Math.floor((noon + utcOffset) / DAY)) * DAY;
  noon -= solarCoordinates(noon).equationOfTime * 60;

  // Косинус от часовия ъгъл при 90.833° (рефракция + радиус на диска)
  const hourAngleCos = (time) => {
    const { declination } = solarCoordinates(time);
    return (cos(90.833) - sin(lat) * sin(declination)) / (cos(lat) * cos(declination));
  };

  const atNoon = hourAngleCos(noon);
  if (atNoon > 1) return { sunrise: null, sunset: null, dayLength: 0, polar: 'night' };
  if (atNoon < -1) return { sunrise: null, sunset: null, dayLength: DAY, polar: 'day' };

  // Второ приближение с деклинацията в самия момент на изгрева и залеза
  const event = (direction) => {
    let time = noon;
    for (let i = 0; i < 2; i++) {
      const value = Math.min(1, Math.max(-1, hourAngleCos(time)));
      time = noon + direction * (Math.acos(value) / RAD) * 240; // 1° = 240 s
    }
    return Math.round(time);
  };
  const sunrise = event(-1);
  const sunset = event(1);
  return { sunrise, sunset, dayLength: sunset - sunrise, polar: null };
}

// Ъгъл между Луната и Слънцето по еклиптиката: 0 новолуние, 90 първа четвърт, 180 пълнолуние
function elongation(time) {
  const T = centuries(time);
  const meanLong = 218.3164477 + 481267.88123421 * T;
  const D = 297.8501921 + 445267.1114034 * T;
  const M = 357.5291092 + 35999.0502909 * T;
  const Mm = 134.9633964 + 477198.8675055 * T;
  const F = 93.272095 + 483202.0175233 * T;
  const moon =
    meanLong +
    6.288774 * sin(Mm) +
    1.274027 * sin(2 * D - Mm) +
    0.658314 * sin(2 * D) +
    0.213618 * sin(2 * Mm) -
    0.185116 * sin(M) -
    0.114332 * sin(2 * F) +
    0.058793 * sin(2 * D - 2 * Mm) +
    0.057066 * sin(2 * D - M - Mm) +
    0.053322 * sin(2 * D + Mm) +
    0.045758 * sin(2 * D - M) -
    0.040923 * sin(M - Mm) -
    0.03472 * sin(D) -
    0.030383 * sin(M + Mm);
  return normalize(moon - sunPosition(T).longitude);
}

const PHASES = [
  'new',
  'waxingCrescent',
  'firstQuarter',
  'waxingGibbous',
  'full',
  'waningGibbous',
  'lastQuarter',
  'waningCrescent',
];

// Главните фази (новолуние, четвърти, пълнолуние) се показват около ±12 часа от точния момент
const PRINCIPAL_WINDOW = 6.1;

/**
 * @param {number} time
 * @returns {{ phase: string, illumination: number, angle: number }}  illumination е 0-1
 */
export function moonPhase(time) {
  const angle = elongation(time);
  const nearest = Math.round(angle / 90) * 90;
  const index =
    Math.abs(angle - nearest) <= PRINCIPAL_WINDOW
      ? (nearest / 45) % 8
      : Math.floor(angle / 90) * 2 + 1;
  return { phase: PHASES[index], illumination: (1 - cos(angle)) / 2, angle };
}

const DEGREES_PER_DAY = 360 / 29.530589;

/**
 * Следващият момент, в който ъгълът достига target (0 новолуние, 180 пълнолуние).
 * @param {number} time
 * @param {number} target
 * @returns {number}
 */
export function nextMoonPhase(time, target) {
  let result = time + (normalize(target - elongation(time)) / DEGREES_PER_DAY) * DAY;
  for (let i = 0; i < 5; i++) {
    const error = normalize(target - elongation(result) + 180) - 180;
    result += (error / DEGREES_PER_DAY) * DAY;
  }
  return Math.round(result);
}
