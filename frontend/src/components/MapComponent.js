import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const MapComponent = () => {
  const position = [51.505, -0.09]; // Coordenadas de ejemplo (Londres)

  const icon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    shadowSize: [41, 41]
  });

  return (
    <MapContainer center={position} zoom={13} style={{ height: '100vh', width: '100%' }} zoomControl={false}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={position} icon={icon}>
        <Popup>
          Ejemplo de ubicación.
        </Popup>
      </Marker>
      {/* Personalizar la posición del control de zoom */}
      <div className="leaflet-bottom leaflet-right">
        <div className="leaflet-control-zoom leaflet-bar leaflet-control" style={{ borderRadius: '50px' }}>
          <a className="leaflet-control-zoom-in" href="#" title="Zoom in" style={{ borderRadius: '50px 50px 0 0' }}>+</a>
          <a className="leaflet-control-zoom-out" href="#" title="Zoom out" style={{ borderRadius: '0 0 50px 50px' }}>−</a>
        </div>
      </div>
    </MapContainer>
  );
};

export default MapComponent;