// Единици за показване. Данните в модела са винаги °C, m/s, hPa и метри; тук само се преобразуват.
import { getItem, setItem } from './storage.js';

const KEY = 'oblako_units';

// Първата стойност не е непременно по подразбиране — редът е този на бутоните в менюто.
export const UNIT_OPTIONS = {
  temperature: ['°C', '°F'],
  wind: ['m/s', 'km/h', 'mph'],
  pressure: ['hPa', 'mmHg', 'inHg'],
  visibility: ['km', 'mi'],
};

const DEFAULTS = { temperature: '°C', wind: 'km/h', pressure: 'hPa', visibility: 'km' };

// Запазеният избор; непознати или повредени стойности се заменят с тези по подразбиране
export function loadUnits() {
  let saved;
  try {
    saved = JSON.parse(getItem(KEY));
  } catch {
    saved = null;
  }
  return Object.fromEntries(
    Object.entries(DEFAULTS).map(([kind, fallback]) => [
      kind,
      UNIT_OPTIONS[kind].includes(saved?.[kind]) ? saved[kind] : fallback,
    ]),
  );
}

export const saveUnits = (units) => setItem(KEY, JSON.stringify(units));

export const toTemperature = (celsius, unit) =>
  Math.round(unit === '°F' ? (celsius * 9) / 5 + 32 : celsius);

const WIND_FACTORS = { 'm/s': 1, 'km/h': 3.6, mph: 2.236936 };

export const formatWind = (metersPerSecond, unit) =>
  `${Math.round(metersPerSecond * WIND_FACTORS[unit])} ${unit}`;

export function formatPressure(hectopascals, unit) {
  if (unit === 'mmHg') return `${Math.round(hectopascals * 0.750062)} mmHg`;
  if (unit === 'inHg') return `${(hectopascals * 0.02953).toFixed(2)} inHg`;
  return `${Math.round(hectopascals)} hPa`;
}

// Под 10 (km или mi) с един знак след запетаята, за да личи мъглата
export function formatVisibility(meters, unit) {
  const value = meters / (unit === 'mi' ? 1609.344 : 1000);
  return `${value < 10 ? Number(value.toFixed(1)) : Math.round(value)} ${unit}`;
}
