import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { Box } from '@mui/material';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './MapLayout.css';

/**
 * Componente MapLayout template
 * Proporciona la estructura base para la vista del mapa
 */
const MapLayout = ({
  center,
  zoom,
  children,
  mapControls,
  floatingContent,
  onMapReady,
}) => {
  const mapRef = useRef();

  const handleMapReady = () => {
    if (onMapReady && mapRef.current) {
      onMapReady(mapRef.current);
    }
  };

  return (
    <Box className="map-layout">
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
        ref={mapRef}
        whenReady={handleMapReady}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {children}
        
        {mapControls && (
          <div className="map-layout-controls leaflet-bottom leaflet-right">
            {mapControls}
          </div>
        )}
      </MapContainer>
      
      {floatingContent && (
        <Box className="map-layout-floating-content">
          {floatingContent}
        </Box>
      )}
    </Box>
  );
};

MapLayout.propTypes = {
  center: PropTypes.arrayOf(PropTypes.number).isRequired,
  zoom: PropTypes.number.isRequired,
  children: PropTypes.node,
  mapControls: PropTypes.node,
  floatingContent: PropTypes.node,
  onMapReady: PropTypes.func,
};

export default MapLayout;
