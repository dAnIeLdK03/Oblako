import { useRef, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useLanguage } from '../LanguageContext.jsx';
import { weatherErrorMessage } from '../utils/weatherErrors.js';
import { geolocationErrorMessage, verifyLocation } from '../utils/location.js';
import { weatherQueryOptions, positionQueryOptions } from './weatherQueries.js';

// Времето за конкретно място (град или координати). Кеш, дедупликация, повторни опити
// и опресняване са на TanStack Query. query = null изключва заявката.
export function useWeatherQuery(query, { days, enabled = true } = {}) {
    return useQuery({
        ...weatherQueryOptions(query ?? { city: '' }, days),
        enabled: Boolean(query) && enabled,
    });
}

// Време за страница, която започва от местоположението на потребителя и/или от търсене.
//
//   const { weather, loading, error, locationWarning, searchCity, locate, showWeather, refresh }
//       = useWeather({ days, fallbackCity, startWithLocation });
//
//   searchCity('Varna')   -> Promise<данни | null>; показва града
//   locate()              -> показва времето за текущото местоположение
//   showWeather(data)     -> показва вече заредени данни (напр. избрани от картата)
//   refresh()             -> опреснява показаното време
export function useWeather({ days, fallbackCity = null, startWithLocation = false } = {}) {
    const { t } = useLanguage();
    const queryClient = useQueryClient();
    // { type: 'locate' } | { type: 'city', city } | { type: 'coords', lat, lon } | null
    const [target, setTarget] = useState(startWithLocation ? { type: 'locate' } : null);
    const searchIdRef = useRef(0);

    // --- Режим "моето местоположение": позиция -> време по координати ---
    const locating = target?.type === 'locate';
    const position = useQuery({ ...positionQueryOptions, enabled: locating });
    const coords = locating && position.data
        ? { lat: position.data.coords.latitude, lon: position.data.coords.longitude }
        : null;
    const byCoords = useWeatherQuery(coords, { days });

    // Ако позицията или времето по координати се провалят, пробваме резервния град
    const useFallback = locating && Boolean(fallbackCity) && (position.isError || byCoords.isError);

    // --- Всичко останало: град, координати от картата или резервния град ---
    let spec = null;
    if (target?.type === 'city') spec = { city: target.city };
    else if (target?.type === 'coords') spec = { lat: target.lat, lon: target.lon };
    else if (useFallback) spec = { city: fallbackCity };
    const bySpec = useWeatherQuery(spec, { days });

    const fromLocation = locating && !useFallback;
    const shown = fromLocation ? byCoords : bySpec;
    const weather = shown.data ?? null;

    // Зареждане само когато няма какво да се покаже (не и при фоново опресняване)
    const loading = fromLocation
        ? (position.isLoading || byCoords.isLoading)
        : bySpec.isLoading;

    let error = '';
    if (!weather) {
        if (fromLocation && position.error) error = geolocationErrorMessage(position.error, t);
        else if (shown.error) error = weatherErrorMessage(shown.error, t);
    }

    const check = locating && position.data ? verifyLocation(position.data) : null;
    const locationWarning = check && !check.ok ? check : null;

    async function searchCity(city) {
        const name = city?.trim();
        if (!name) return null;
        const id = ++searchIdRef.current;
        setTarget({ type: 'city', city: name });
        try {
            // Същата заявка като тази на useQuery: изпраща се веднъж (дедупликация)
            const data = await queryClient.fetchQuery(weatherQueryOptions({ city: name }, days));
            return id === searchIdRef.current ? data : null; // има по-ново търсене
        } catch {
            return null; // грешката се показва през `error`
        }
    }

    function locate() {
        searchIdRef.current++;
        queryClient.resetQueries({ queryKey: ['position'] }); // нов въпрос към браузъра
        setTarget({ type: 'locate' });
    }

    function showWeather(data) {
        searchIdRef.current++;
        // Данните вече са в кеша (заредени от картата), така че не се правят нови заявки
        queryClient.setQueryData(weatherQueryOptions({ lat: data.place.lat, lon: data.place.lon }, days).queryKey, data);
        setTarget({ type: 'coords', lat: data.place.lat, lon: data.place.lon });
    }

    function refresh() {
        return queryClient.refetchQueries({ queryKey: ['weather'], type: 'active' });
    }

    return { weather, loading, error, locationWarning, searchCity, locate, showWeather, refresh };
}
