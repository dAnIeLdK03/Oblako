import { useEffect, useRef } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useLanguage } from '../LanguageContext.jsx';
import { weatherErrorMessage } from '../utils/weatherErrors.js';
import { geolocationErrorMessage, verifyLocation } from '../utils/location.js';
import { parsePlace, cityParams, coordsParams } from '../utils/locationParams.js';
import { readLastQuery, offlineQueryFor } from '../utils/lastQuery.js';
import { useOnlineStatus } from './useOnlineStatus.js';
import { weatherQueryOptions, positionQueryOptions } from './weatherQueries.js';

// Времето за конкретно място (град или координати). query = null изключва заявката.
export function useWeatherQuery(query, { enabled = true } = {}) {
    return useQuery({
        ...weatherQueryOptions(query ?? { city: '' }),
        enabled: Boolean(query) && enabled,
    });
}

// Мястото е в URL (?city=Sofia или ?lat=..&lon=..), така че адресът може да се споделя,
// а всички страници, които ползват този хук, показват едно и също място от един кеш.
// Без място в URL се ползва местоположението на потребителя (с резервен град).
// След определяне на местоположението URL се заменя с ?city=Име (не с координати,
// за да не се издава къде е потребителят в споделен линк).
//
//   const { weather, loading, error, locationWarning, searchCity, locate, showWeather, refresh }
//       = useWeather({ fallbackCity });
//
//   searchCity('Varna')   -> Promise<данни | null>; сменя мястото в URL
//   locate()              -> маха мястото от URL и търси местоположението
//   showWeather(data)     -> слага в URL координатите на вече заредени данни (избор от картата)
//   refresh()             -> опреснява показаното време
export function useWeather({ fallbackCity = null } = {}) {
    const { t } = useLanguage();
    const queryClient = useQueryClient();
    const [searchParams, setSearchParams] = useSearchParams();
    const routerLocation = useLocation();
    const searchIdRef = useRef(0);

    const place = parsePlace(searchParams); // null = няма място в URL

    // Без връзка няма как да се определи позицията, затова се показва последното известно място
    // (от кеша на service worker-а). Адресът не се променя, докато няма връзка.
    const online = useOnlineStatus();
    const offlineQuery = online ? null : offlineQueryFor(place, readLastQuery());
    const useLast = !place && Boolean(offlineQuery);

    // --- Няма място в URL: позиция -> време по координати ---
    const locating = !place;
    const position = useQuery({ ...positionQueryOptions, enabled: locating && !useLast });
    const coords = locating && !useLast && position.data
        ? { lat: position.data.coords.latitude, lon: position.data.coords.longitude }
        : null;
    const byCoords = useWeatherQuery(coords);

    // Ако позицията или времето по координати се провалят, пробваме резервния град
    const useFallback = locating && !useLast && Boolean(fallbackCity) && (position.isError || byCoords.isError);

    // --- Място от URL или резервният град ---
    let spec = null;
    if (offlineQuery) spec = offlineQuery;
    else if (place?.type === 'city') spec = { city: place.city };
    else if (place?.type === 'coords') spec = { lat: place.lat, lon: place.lon };
    else if (useFallback) spec = { city: fallbackCity };
    const bySpec = useWeatherQuery(spec);

    const fromLocation = locating && !useFallback && !useLast;
    const shown = fromLocation ? byCoords : bySpec;

    // Мрежова грешка при връзка, която браузърът смята за налична (слаб сигнал): показваме последното
    // известно място, ако service worker-ът го има в кеша си. Не се прави при други грешки (напр. град не е намерен).
    const lastQuery = shown.error?.code === 'NETWORK' && !shown.data ? offlineQueryFor(place, readLastQuery()) : null;
    const byLast = useWeatherQuery(lastQuery);

    const weather = shown.data ?? byLast.data ?? null;

    // Зареждане само когато няма какво да се покаже (не и при фоново опресняване)
    const loading = (fromLocation ? (position.isLoading || byCoords.isLoading) : bySpec.isLoading)
        || (Boolean(lastQuery) && byLast.isLoading);

    let error = '';
    if (!weather) {
        if (fromLocation && position.error) error = geolocationErrorMessage(position.error, t);
        else if (shown.error) error = weatherErrorMessage(shown.error, t);
    }

    // Предупреждението за неточна позиция се пази в състоянието на историята,
    // защото след замяната на URL позицията вече не е "активна"
    const check = fromLocation && position.data ? verifyLocation(position.data) : null;
    const locationWarning = (check && !check.ok ? check : null) ?? routerLocation.state?.locationWarning ?? null;

    // Местоположението е определено -> записваме мястото в URL (замяна, без нов запис в историята)
    const located = locating && !useLast ? shown.data : null;
    useEffect(() => {
        if (!located?.place.named) return;
        queryClient.setQueryData(weatherQueryOptions({ city: located.place.name }).queryKey, located);
        setSearchParams(cityParams(located.place.name), {
            replace: true,
            state: check && !check.ok ? { locationWarning: check } : null,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [located]);

    async function searchCity(city) {
        const name = city?.trim();
        if (!name) return null;
        const id = ++searchIdRef.current;
        setSearchParams(cityParams(name));
        try {
            // Същата заявка като тази на useQuery: изпраща се веднъж (дедупликация)
            const data = await queryClient.fetchQuery(weatherQueryOptions({ city: name }));
            return id === searchIdRef.current ? data : null; // има по-ново търсене
        } catch {
            return null; // грешката се показва през `error`
        }
    }

    function locate() {
        searchIdRef.current++;
        queryClient.resetQueries({ queryKey: ['position'] }); // нов въпрос към браузъра
        setSearchParams({});
    }

    function showWeather(data) {
        searchIdRef.current++;
        // Данните вече са в кеша (заредени от картата), така че не се правят нови заявки
        queryClient.setQueryData(weatherQueryOptions({ lat: data.place.lat, lon: data.place.lon }).queryKey, data);
        setSearchParams(coordsParams(data.place.lat, data.place.lon));
    }

    function refresh() {
        return queryClient.refetchQueries({ queryKey: ['weather'], type: 'active' });
    }

    return { weather, loading, error, locationWarning, searchCity, locate, showWeather, refresh };
}
