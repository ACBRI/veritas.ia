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
  <div className="leaflet-control-locate leaflet-bar leaflet-control" style={{ borderRadius: '50px', marginBottom: '10px' }}>
    <a href="#" title="Centrar en mi ubicación" onClick={handleLocateUser}>📍</a>
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