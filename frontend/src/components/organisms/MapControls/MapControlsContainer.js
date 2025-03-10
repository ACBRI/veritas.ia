import React from 'react';
import { useMap } from '../../../context/MapContext';
import MapControls from './MapControls';

/**
 * Componente contenedor para los controles del mapa
 * Utiliza el contexto del mapa para acceder a las funciones de control
 */
const MapControlsContainer = ({ disableLocate = false }) => {
  // Obtenemos las funciones del contexto del mapa
  const { flyToUserLocation, zoomIn, zoomOut } = useMap();
  
  // Función para ir a la ubicación del usuario
  const handleLocateUser = () => {
    console.log('Botón de ubicación clickeado');
    flyToUserLocation();
  };
  
  // Función para hacer zoom in
  const handleZoomIn = () => {
    console.log('Botón de zoom in clickeado');
    zoomIn();
  };
  
  // Función para hacer zoom out
  const handleZoomOut = () => {
    console.log('Botón de zoom out clickeado');
    zoomOut();
  };
  
  return (
    <MapControls
      onLocateUser={handleLocateUser}
      onZoomIn={handleZoomIn}
      onZoomOut={handleZoomOut}
      disableLocate={disableLocate}
    />
  );
};

export default MapControlsContainer;
