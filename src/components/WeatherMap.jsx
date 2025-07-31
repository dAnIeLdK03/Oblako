import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import { useLanguage } from '../LanguageContext.jsx';
import { useTheme } from '../ThemeContext.jsx';
import 'leaflet/dist/leaflet.css';

const API_KEY = "b5b3e21a258778d1168e59c1ccb83609";

// Fix for default markers
import L from 'leaflet';
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function MapController({ onLocationSelect, markers, setMarkers }) {
  const { language } = useLanguage();
  const map = useMap();

  useMapEvents({
    click: async (e) => {
      const newMarker = {
        id: Date.now(),
        position: e.latlng,
        weather: null,
        loading: true,
        error: ''
      };
      
      setMarkers(prev => [...prev, newMarker]);
      
      try {
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${e.latlng.lat}&lon=${e.latlng.lng}&units=metric&appid=${API_KEY}`
        );
        if (!res.ok) throw new Error('No weather data');
        const data = await res.json();
        
        setMarkers(prev => prev.map(marker => 
          marker.id === newMarker.id 
            ? { ...marker, weather: data, loading: false }
            : marker
        ));
        
        if (onLocationSelect) onLocationSelect(data);
      } catch (err) {
        setMarkers(prev => prev.map(marker => 
          marker.id === newMarker.id 
            ? { ...marker, error: language === 'bg' ? 'Няма данни за времето' : 'No weather data', loading: false }
            : marker
        ));
      }
    }
  });

  return null;
}

function WeatherMarker({ marker, onRemove, convertTemperature, getTemperatureSymbol }) {
  const { language } = useLanguage();
  
  const getWeatherIcon = (iconCode) => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };

  const getWeatherColor = (temp) => {
    if (temp < 0) return '#4A90E2'; // Cold - blue
    if (temp < 15) return '#7ED321'; // Cool - green
    if (temp < 25) return '#F5A623'; // Warm - orange
    return '#D0021B'; // Hot - red
  };

  if (!marker.weather && !marker.loading && !marker.error) return null;

  return (
    <Marker 
      position={marker.position}
      icon={L.divIcon({
        className: 'custom-marker',
        html: `
          <div style="
            background: ${marker.weather ? getWeatherColor(marker.weather.main.temp) : '#666'};
            color: white;
            border-radius: 50%;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: 12px;
            border: 2px solid white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          ">
            ${marker.weather ? convertTemperature(marker.weather.main.temp) : '...'}
          </div>
        `,
        iconSize: [30, 30],
        iconAnchor: [15, 15]
      })}
    >
      <Popup>
        <div style={{minWidth: 150, textAlign: 'center'}}>
          {marker.loading && (
            <div>
              <span>⏳ {language === 'bg' ? 'Зареждане...' : 'Loading...'}</span>
            </div>
          )}
          {marker.error && (
            <div>
              <span style={{color: 'red'}}>❌ {marker.error}</span>
            </div>
          )}
          {marker.weather && (
            <div>
              <h4 style={{margin: '0 0 8px 0', color: '#333'}}>
                {marker.weather.name || language === 'bg' ? 'Неизвестно място' : 'Unknown location'}
              </h4>
              <div style={{fontSize: '24px', fontWeight: 'bold', margin: '8px 0'}}>
                {convertTemperature(marker.weather.main.temp)}{getTemperatureSymbol()}
              </div>
              <div style={{margin: '8px 0', fontSize: '14px', color: '#666'}}>
                {marker.weather.weather[0].description}
              </div>
              <img 
                src={getWeatherIcon(marker.weather.weather[0].icon)} 
                alt="weather" 
                style={{width: 50, height: 50}}
              />
              <div style={{marginTop: '8px', fontSize: '12px', color: '#888'}}>
                💧 {marker.weather.main.humidity}% | 🌪️ {marker.weather.wind?.speed || 0} km/h
              </div>
              <button 
                onClick={() => onRemove(marker.id)}
                style={{
                  marginTop: '8px',
                  padding: '4px 8px',
                  background: '#ff4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
              >
                ❌ {language === 'bg' ? 'Премахни' : 'Remove'}
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
  const { convertTemperature, getTemperatureSymbol } = useTheme();
  const [markers, setMarkers] = useState([]);
  const [mapType, setMapType] = useState('street');
  const [showControls, setShowControls] = useState(true);

  // Default center: Sofia, Bulgaria
  const center = [42.6977, 23.3219];

  const mapTypes = {
    street: {
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    },
    satellite: {
      url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      attribution: '&copy; <a href="https://www.esri.com/">Esri</a>'
    },
    terrain: {
      url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
      attribution: '&copy; <a href="https://opentopomap.org/">OpenTopoMap</a>'
    }
  };

  const clearAllMarkers = () => {
    setMarkers([]);
  };

  const removeMarker = (id) => {
    setMarkers(prev => prev.filter(marker => marker.id !== id));
  };

  return (
    <div style={{
      height: 400, 
      width: '100%', 
      margin: '30px 0 70px 0', 
      borderRadius: 12, 
      overflow: 'hidden', 
      boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
      position: 'relative'
    }}>
      {/* Map Controls */}
      {showControls && (
        <div style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          zIndex: 1000,
          background: 'white',
          borderRadius: '8px',
          padding: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          display: 'flex',
          flexDirection: 'column',
          gap: '5px'
        }}>
          <button
            onClick={() => setMapType('street')}
            style={{
              padding: '4px 8px',
              background: mapType === 'street' ? '#007bff' : '#f8f9fa',
              color: mapType === 'street' ? 'white' : '#333',
              border: '1px solid #ddd',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '11px'
            }}
          >
            🗺️ {language === 'bg' ? 'Улица' : 'Street'}
          </button>
          <button
            onClick={() => setMapType('satellite')}
            style={{
              padding: '4px 8px',
              background: mapType === 'satellite' ? '#007bff' : '#f8f9fa',
              color: mapType === 'satellite' ? 'white' : '#333',
              border: '1px solid #ddd',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '11px'
            }}
          >
            🛰️ {language === 'bg' ? 'Сателит' : 'Satellite'}
          </button>
          <button
            onClick={() => setMapType('terrain')}
            style={{
              padding: '4px 8px',
              background: mapType === 'terrain' ? '#007bff' : '#f8f9fa',
              color: mapType === 'terrain' ? 'white' : '#333',
              border: '1px solid #ddd',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '11px'
            }}
          >
            🏔️ {language === 'bg' ? 'Терен' : 'Terrain'}
          </button>
          <button
            onClick={clearAllMarkers}
            style={{
              padding: '4px 8px',
              background: '#dc3545',
              color: 'white',
              border: '1px solid #dc3545',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '11px'
            }}
          >
            🗑️ {language === 'bg' ? 'Изчисти' : 'Clear'}
          </button>
        </div>
      )}

      {/* Instructions */}
      <div style={{
        position: 'absolute',
        top: '10px',
        left: '10px',
        zIndex: 1000,
        background: 'rgba(255,255,255,0.9)',
        borderRadius: '8px',
        padding: '8px 12px',
        fontSize: '12px',
        color: '#666',
        maxWidth: '200px'
      }}>
        📍 {language === 'bg' ? 'Кликнете на картата за да добавите маркер' : 'Click on map to add marker'}
      </div>

      <MapContainer 
        center={center} 
        zoom={6} 
        style={{height: '100%', width: '100%'}} 
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution={mapTypes[mapType].attribution}
          url={mapTypes[mapType].url}
        />
        <MapController 
          onLocationSelect={onLocationSelect} 
          markers={markers}
          setMarkers={setMarkers}
        />
        {markers.map(marker => (
          <WeatherMarker 
            key={marker.id}
            marker={marker} 
            onRemove={removeMarker}
            convertTemperature={convertTemperature}
            getTemperatureSymbol={getTemperatureSymbol}
          />
        ))}
      </MapContainer>
    </div>
  );
}

export default WeatherMap; 