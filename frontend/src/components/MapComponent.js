import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import LocateButton from './LocateButton/LocateButton';
import ZoomControls from './ZoomControls/ZoomControls';
import MarkerWithPopup from './MarkerWithPopup/MarkerWithPopup';
import FloatingReportButton from './FloatingReportButton/FloatingReportButton';

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

  const handleReportSubmit = (reportDetails) => {
    console.log('Reporte enviado:', reportDetails);
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
        <MarkerWithPopup position={userLocation} icon={icon} popupText="¡Estás aquí!" />
      )}
      <div className="leaflet-bottom leaflet-right">
        <FloatingReportButton onReportSubmit={handleReportSubmit} />
        <div style={{ marginTop: '70px' }}> 
        <LocateButton onClick={handleLocateUser} />
        <ZoomControls />
      </div>
      </div>
    </MapContainer>
  );
};

export default MapComponent;