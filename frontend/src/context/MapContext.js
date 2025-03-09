import React, { createContext, useState, useContext, useCallback } from 'react';
import PropTypes from 'prop-types';
import L from 'leaflet';
import useGeolocation from '../hooks/useGeolocation';

// Crear el contexto
const MapContext = createContext();

/**
 * Proveedor del contexto del mapa
 * Proporciona estado y funciones relacionadas con el mapa a toda la aplicación
 */
export const MapProvider = ({ children }) => {
  const [map, setMap] = useState(null);
  const {
    userLocation,
    loading: locationLoading,
    error: locationError,
  } = useGeolocation();
  const [markers, setMarkers] = useState([]);
  // Configuración del icono por defecto
  const defaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    shadowSize: [41, 41],
  });

  // Función para inicializar el mapa
  const initializeMap = useCallback((mapInstance) => {
    setMap(mapInstance);
  }, []);

  // Función para centrar el mapa en la ubicación del usuario
  const flyToUserLocation = useCallback(() => {
    if (map && userLocation) {
      map.flyTo(userLocation, 13);
    }
  }, [map, userLocation]);

  // Función para hacer zoom in
  const zoomIn = useCallback(() => {
    if (map) {
      map.zoomIn();
    }
  }, [map]);

  // Función para hacer zoom out
  const zoomOut = useCallback(() => {
    if (map) {
      map.zoomOut();
    }
  }, [map]);

  // Función para añadir un marcador
  const addMarker = useCallback((marker) => {
    setMarkers((prevMarkers) => [...prevMarkers, marker]);
  }, []);

  // Función para eliminar un marcador
  const removeMarker = useCallback((markerId) => {
    setMarkers((prevMarkers) =>
      prevMarkers.filter((marker) => marker.id !== markerId)
    );
  }, []);

  // Valores proporcionados por el contexto
  const value = {
    map,
    userLocation,
    locationLoading,
    locationError,
    markers,
    defaultIcon,
    initializeMap,
    flyToUserLocation,
    zoomIn,
    zoomOut,
    addMarker,
    removeMarker,
  };

  return <MapContext.Provider value={value}>{children}</MapContext.Provider>;
};

MapProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// Hook personalizado para usar el contexto del mapa
export const useMap = () => {
  const context = useContext(MapContext);
  if (!context) {
    throw new Error('useMap debe ser usado dentro de un MapProvider');
  }
  return context;
};

export default MapContext;
