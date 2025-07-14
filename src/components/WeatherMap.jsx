import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const API_KEY = "b5b3e21a258778d1168e59c1ccb83609";

function LocationMarker({ onLocationSelect }) {
  const [position, setPosition] = useState(null);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useMapEvents({
    click: async (e) => {
      setPosition(e.latlng);
      setWeather(null);
      setError('');
      setLoading(true);
      try {
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${e.latlng.lat}&lon=${e.latlng.lng}&units=metric&appid=${API_KEY}`
        );
        if (!res.ok) throw new Error('No weather data');
        const data = await res.json();
        setWeather(data);
        if (onLocationSelect) onLocationSelect(data);
      } catch (err) {
        setError('No weather data for this location');
      } finally {
        setLoading(false);
      }
    }
  });

  return position === null ? null : (
    <Marker position={position}>
      <Popup>
        {loading && <span>Loading...</span>}
        {error && <span>{error}</span>}
        {weather && (
          <div style={{minWidth: 120}}>
            <b>{weather.name || 'Unknown location'}</b><br/>
            {Math.round(weather.main.temp)}°C<br/>
            {weather.weather[0].description}<br/>
            <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} alt="icon" width={50} />
          </div>
        )}
      </Popup>
    </Marker>
  );
}

function WeatherMap({ onLocationSelect }) {
  // Default center: Sofia, Bulgaria
  const center = [42.6977, 23.3219];
  return (
    <div style={{height: 400, width: '100%', margin: '30px 0 70px 0', borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.07)'}}>
      <MapContainer center={center} zoom={6} style={{height: '100%', width: '100%'}} scrollWheelZoom={true}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker onLocationSelect={onLocationSelect} />
      </MapContainer>
    </div>
  );
}

export default WeatherMap; 