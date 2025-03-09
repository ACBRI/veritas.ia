import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const MapComponent = () => {
  const [userLocation, setUserLocation] = useState(null);
  const mapRef = useRef();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
        },
        (error) => {
          console.error('Error obteniendo la ubicación:', error);
        }
      );
    } else {
      console.error('Geolocalización no soportada por este navegador.');
    }
  }, []);

  const handleLocateUser = () => {
    if (userLocation && mapRef.current) {
      mapRef.current.flyTo(userLocation, 13);
    }
  };

  const icon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    shadowSize: [41, 41]
  });

  return (
    <MapContainer
      center={[-1.8312, -78.1834]} // Coordenadas de Ecuador
      zoom={7}
      style={{ height: '100vh', width: '100%' }}
      zoomControl={false}
      ref={mapRef}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {userLocation && (
        <Marker position={userLocation} icon={icon}>
          <Popup>
            ¡Estás aquí!
          </Popup>
        </Marker>
      )}
      {/* Botón para centrar en la ubicación del usuario */}
      <div className="leaflet-bottom leaflet-right">
        <div className="leaflet-control-locate leaflet-bar leaflet-control" style={{ 
          borderRadius: '50px', 
          marginBottom: '10px',
          background: '#e0e5ec',
          boxShadow: '8px 8px 15px #a3b1c6, -8px -8px 15px #ffffff',
          padding: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <a href="#" title="Centrar en mi ubicación" onClick={handleLocateUser} style={{ textDecoration: 'none', color: '#3b82f6' }}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" style={{ verticalAlign: 'middle' }}>
              {/* Círculo exterior */}
              <circle cx="12" cy="12" r="11" fill="#e0e5ec" stroke="#a3b1c6" strokeWidth="1" />
              
              {/* Anillo decorativo */}
              <circle cx="12" cy="12" r="8" fill="none" stroke="#3b82f6" strokeWidth="1.2" strokeDasharray="2 1" />
              
              {/* Símbolo de ubicación */}
              <path d="M12 5.5c-2.5 0-4.5 2-4.5 4.5 0 3.5 4.5 8.5 4.5 8.5s4.5-5 4.5-8.5c0-2.5-2-4.5-4.5-4.5z" 
                    fill="#3b82f6" stroke="#2563eb" strokeWidth="0.5" />
              
              {/* Punto central */}
              <circle cx="12" cy="10" r="2" fill="#e0e5ec" />
            </svg>
          </a>
        </div>
        <div className="leaflet-control-zoom leaflet-bar leaflet-control" style={{ borderRadius: '50px', marginBottom: '60px' }}>
          <a className="leaflet-control-zoom-in" href="#" title="Zoom in" style={{ borderRadius: '50px 50px 0 0' }}>+</a>
          <a className="leaflet-control-zoom-out" href="#" title="Zoom out" style={{ borderRadius: '0 0 50px 50px' }}>−</a>
        </div>
      </div>
    </MapContainer>
  );
};

export default MapComponent;