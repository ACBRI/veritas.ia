import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Box } from '@mui/material';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
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

  // Componente interno para inicializar el mapa
  // Este componente tiene acceso directo a la instancia del mapa a través del hook useMap
  const MapInitializer = () => {
    const map = useMap();
    
    useEffect(() => {
      console.log('MapInitializer: Mapa disponible', map);
      
      if (!map) {
        console.error('MapInitializer: La instancia del mapa no está disponible');
        return;
      }
      
      if (!onMapReady) {
        console.warn('MapInitializer: No se proporcionó una función onMapReady');
        return;
      }
      
      try {
        // Guardamos la referencia del mapa
        mapRef.current = map;
        
        // Verificamos que el mapa tenga métodos esenciales
        if (typeof map.flyTo !== 'function') {
          console.error('MapInitializer: El método flyTo no está disponible');
          return;
        }
        if (typeof map.zoomIn !== 'function') {
          console.error('MapInitializer: El método zoomIn no está disponible');
          return;
        }
        if (typeof map.zoomOut !== 'function') {
          console.error('MapInitializer: El método zoomOut no está disponible');
          return;
        }
        
        // Llamamos a la función onMapReady con la instancia del mapa
        onMapReady(map);
        console.log('MapInitializer: Mapa inicializado exitosamente');
      } catch (error) {
        console.error('MapInitializer: Error al inicializar el mapa:', error);
      }
    }, [map]);
    
    return null; // Este componente no renderiza nada
  };

  return (
    <Box className="map-layout">
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
        attributionControl={false}
      >
        <MapInitializer />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {children}
        
        {mapControls && (
          <div className="map-layout-controls leaflet-bottom leaflet-right leaflet-control">
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
