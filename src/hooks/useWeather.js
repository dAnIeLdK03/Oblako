import { useRef, useState } from 'react';
import { useLanguage } from '../LanguageContext.jsx';
import { getWeather, isAbortError } from '../services/weather';
import { weatherErrorMessage } from '../utils/weatherErrors.js';
import { getPosition, geolocationErrorMessage, verifyLocation } from '../utils/location.js';

// Състояние и зареждане на времето: по град или по местоположение на потребителя.
// Всяка нова заявка отменя предишната, така че по-стар отговор не презаписва по-нов.
//
//   const { weather, loading, error, locationWarning, searchCity, locate, showWeather } = useWeather({ days });
//   searchCity('Varna')                      -> данни | null
//   locate({ fallbackCity: 'Sofia' })        -> данни | null  (при отказ/грешка се пробва градът)
//   showWeather(data)                        -> показва вече заредени данни (напр. от картата)
export function useWeather({ days } = {}) {
    const { t } = useLanguage();
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [locationWarning, setLocationWarning] = useState(null);
    const requestRef = useRef(null);

    function begin() {
        requestRef.current?.abort();
        const controller = new AbortController();
        requestRef.current = controller;
        setLoading(true);
        setError('');
        return controller;
    }

    function end(controller) {
        if (requestRef.current === controller) setLoading(false);
    }

    // -> { data } | { aborted } | { failed }
    async function load(query, controller, { clearOnError = false } = {}) {
        try {
            const data = await getWeather(query, { days, signal: controller.signal });
            setWeather(data);
            return { data };
        } catch (err) {
            if (isAbortError(err)) return { aborted: true };
            setError(weatherErrorMessage(err, t));
            if (clearOnError) setWeather(null);
            return { failed: true };
        }
    }

    async function searchCity(city) {
        if (!city?.trim()) return null;
        setLocationWarning(null);
        const controller = begin();
        const result = await load({ city }, controller, { clearOnError: true });
        end(controller);
        return result.data ?? null;
    }

    async function locate({ fallbackCity = null } = {}) {
        const controller = begin();

        let position;
        try {
            position = await getPosition();
        } catch (geoError) {
            if (controller.signal.aborted) return null; // заменена от по-нова заявка
            if (fallbackCity) return searchCity(fallbackCity);
            setError(geolocationErrorMessage(geoError, t));
            end(controller);
            return null;
        }
        if (controller.signal.aborted) return null;

        const check = verifyLocation(position);
        setLocationWarning(check.ok ? null : check);

        const { latitude, longitude } = position.coords;
        const result = await load({ lat: latitude, lon: longitude }, controller);
        if (result.failed && fallbackCity) return searchCity(fallbackCity);
        end(controller);
        return result.data ?? null;
    }

    function showWeather(data) {
        setWeather(data);
        setError('');
    }

    return { weather, loading, error, locationWarning, searchCity, locate, showWeather };
}
