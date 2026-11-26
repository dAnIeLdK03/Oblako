import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import {
  Map,
  Satellite,
  Mountain,
  Trash2,
  MapPin,
  LoaderCircle,
  XCircle,
  Droplet,
  Wind,
} from 'lucide-react';
import { useLanguage } from '../LanguageContext.jsx';
import { useTheme } from '../ThemeContext.jsx';
import 'leaflet/dist/leaflet.css';
import styles from './WeatherMap.module.css';
import { useQueryClient } from '@tanstack/react-query';
import { getIconUrl } from '../services/weather';
import { weatherQueryOptions } from '../hooks/weatherQueries.js';

// Fix for default markers
import L from 'leaflet';
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function MapController({ onLocationSelect, setMarkers }) {
  const { language } = useLanguage();
  const queryClient = useQueryClient();

  useMapEvents({
    click: async (e) => {
      const newMarker = {
        id: Date.now(),
        position: e.latlng,
        weather: null,
        loading: true,
        error: '',
      };

      setMarkers((prev) => [...prev, newMarker]);

      try {
        const data = await queryClient.fetchQuery(
          weatherQueryOptions({ lat: e.latlng.lat, lon: e.latlng.lng }),
        );

        setMarkers((prev) =>
          prev.map((marker) =>
            marker.id === newMarker.id ? { ...marker, weather: data, loading: false } : marker,
          ),
        );

        if (onLocationSelect) onLocationSelect(data);
      } catch {
        setMarkers((prev) =>
          prev.map((marker) =>
            marker.id === newMarker.id
              ? {
                  ...marker,
                  error: language === 'bg' ? 'Няма данни за времето' : 'No weather data',
                  loading: false,
                }
              : marker,
          ),
        );
      }
    },
  });

  return null;
}

function WeatherMarker({ marker, onRemove, convertTemperature, getTemperatureSymbol, formatWind }) {
  const { language } = useLanguage();

  const getWeatherIcon = (iconCode) => {
    return getIconUrl(iconCode);
  };

  const getWeatherColorClass = (temp) => {
    if (temp < 0) return styles['marker-cold']; // blue
    if (temp < 15) return styles['marker-cool']; // green
    if (temp < 25) return styles['marker-warm']; // orange
    return styles['marker-hot']; // red
  };

  if (!marker.weather && !marker.loading && !marker.error) return null;

  return (
    <Marker
      position={marker.position}
      icon={L.divIcon({
        className: 'custom-marker',
        html: `<div class="${styles['marker-badge']} ${marker.weather ? getWeatherColorClass(marker.weather.current.temp) : ''}">${
          marker.weather ? convertTemperature(marker.weather.current.temp) : '...'
        }</div>`,
        iconSize: [30, 30],
        iconAnchor: [15, 15],
      })}
    >
      <Popup>
        <div className={styles.popup}>
          {marker.loading && (
            <div>
              <span className={styles['popup-status']}>
                <LoaderCircle size={14} /> {language === 'bg' ? 'Зареждане...' : 'Loading...'}
              </span>
            </div>
          )}
          {marker.error && (
            <div>
              <span className={`${styles['popup-status']} ${styles['popup-error']}`}>
                <XCircle size={14} /> {marker.error}
              </span>
            </div>
          )}
          {marker.weather && (
            <div>
              <h4 className={styles['popup-title']}>
                {marker.weather.place.name || language === 'bg'
                  ? 'Неизвестно място'
                  : 'Unknown location'}
              </h4>
              <div className={styles['popup-temp']}>
                {convertTemperature(marker.weather.current.temp)}
                {getTemperatureSymbol()}
              </div>
              <div className={styles['popup-desc']}>
                {marker.weather.current.condition.description}
              </div>
              <img
                src={getWeatherIcon(marker.weather.current.condition.icon)}
                alt="weather"
                className={styles['popup-icon']}
              />
              <div className={styles['popup-meta']}>
                <Droplet size={14} /> {marker.weather.current.humidity}% | <Wind size={14} />{' '}
                {formatWind(marker.weather.current.windSpeed || 0)}
              </div>
              <button onClick={() => onRemove(marker.id)} className={styles['popup-remove']}>
                <XCircle size={14} /> {language === 'bg' ? 'Премахни' : 'Remove'}
              </button>
            </div>
          )}
        </div>
      </Popup>
    </Marker>
  );
}

function WeatherMap({ onLocationSelect }) {
  const { language } = useLanguage();
  const { convertTemperature, getTemperatureSymbol, formatWind } = useTheme();
  const [markers, setMarkers] = useState([]);
  const [mapType, setMapType] = useState('street');
  const [showControls] = useState(true);

  // Default center: Sofia, Bulgaria
  const center = [42.6977, 23.3219];

  const mapTypes = {
    street: {
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    },
    satellite: {
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      attribution: '&copy; <a href="https://www.esri.com/">Esri</a>',
    },
    terrain: {
      url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="https://opentopomap.org/">OpenTopoMap</a>',
    },
  };

  const clearAllMarkers = () => {
    setMarkers([]);
  };

  const removeMarker = (id) => {
    setMarkers((prev) => prev.filter((marker) => marker.id !== id));
  };

  const mapButtons = [
    { type: 'street', Icon: Map, label: language === 'bg' ? 'Улица' : 'Street' },
    { type: 'satellite', Icon: Satellite, label: language === 'bg' ? 'Сателит' : 'Satellite' },
    { type: 'terrain', Icon: Mountain, label: language === 'bg' ? 'Терен' : 'Terrain' },
  ];

  return (
    <div className={styles['map-wrapper']}>
      {/* Map Controls */}
      {showControls && (
        <div className={styles.controls}>
          {mapButtons.map(({ type, Icon, label }) => (
            <button
              key={type}
              onClick={() => setMapType(type)}
              className={`${styles['map-btn']} ${mapType === type ? styles['map-btn-active'] : ''}`}
            >
              <Icon size={14} /> {label}
            </button>
          ))}
          <button
            onClick={clearAllMarkers}
            className={`${styles['map-btn']} ${styles['map-btn-danger']}`}
          >
            <Trash2 size={14} /> {language === 'bg' ? 'Изчисти' : 'Clear'}
          </button>
        </div>
      )}

      {/* Instructions */}
      <div className={styles.instructions}>
        <MapPin size={14} />{' '}
        {language === 'bg'
          ? 'Кликнете на картата за да добавите маркер'
          : 'Click on map to add marker'}
      </div>

      <MapContainer
        center={center}
        zoom={6}
        className={styles['map-container']}
        scrollWheelZoom={true}
      >
        <TileLayer attribution={mapTypes[mapType].attribution} url={mapTypes[mapType].url} />
        <MapController onLocationSelect={onLocationSelect} setMarkers={setMarkers} />
        {markers.map((marker) => (
          <WeatherMarker
            key={marker.id}
            marker={marker}
            onRemove={removeMarker}
            convertTemperature={convertTemperature}
            formatWind={formatWind}
            getTemperatureSymbol={getTemperatureSymbol}
          />
        ))}
      </MapContainer>
    </div>
  );
}

export default WeatherMap;
