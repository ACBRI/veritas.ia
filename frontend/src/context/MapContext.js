import React, { createContext, useState, useContext, useCallback } from 'react';
import PropTypes from 'prop-types';
import L from 'leaflet';
import useGeolocation from '../hooks/useGeolocation';
// No usamos useReport directamente en este archivo, pero lo exportamos para conveniencia
// de otros componentes que usen ambos contextos

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
  const [viewBounds, setViewBounds] = useState(null);
  // Configuración del icono por defecto
  const defaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    shadowSize: [41, 41],
  });

  // Función para actualizar los límites del mapa actual
  const updateMapBounds = useCallback(() => {
    if (map) {
      const bounds = map.getBounds();
      setViewBounds(bounds);
      return bounds;
    }
    return null;
  }, [map]);

  // Función para inicializar el mapa
  const initializeMap = useCallback((mapInstance) => {
    console.log('Inicializando mapa...', mapInstance ? 'Instancia recibida' : 'Sin instancia');
    
    if (!mapInstance) {
      console.error('No se pudo inicializar el mapa: No se recibió una instancia válida');
      return;
    }
    
    try {
      // Verificamos que sea una instancia válida de Leaflet
      if (typeof mapInstance.getZoom !== 'function' || 
          typeof mapInstance.getCenter !== 'function' ||
          typeof mapInstance.flyTo !== 'function' ||
          typeof mapInstance.zoomIn !== 'function' ||
          typeof mapInstance.zoomOut !== 'function') {
        console.error('Error: La instancia del mapa no tiene los métodos necesarios');
        return;
      }
      
      // Guardamos la instancia del mapa en el estado
      setMap(mapInstance);
      console.log('Mapa inicializado correctamente');
      console.log(`Zoom inicial: ${mapInstance.getZoom()}`);
      console.log(`Centro inicial: [${mapInstance.getCenter().lat}, ${mapInstance.getCenter().lng}]`);
      
      // Configurar evento para actualizar los límites del mapa cuando cambie
      mapInstance.on('moveend', () => {
        const bounds = mapInstance.getBounds();
        setViewBounds(bounds);
      });
      
      // Inicializar los límites iniciales
      setViewBounds(mapInstance.getBounds());
      
      // Probamos los métodos del mapa para verificar que funcionan
      console.log('Probando métodos del mapa:');
      console.log('- flyTo:', typeof mapInstance.flyTo);
      console.log('- zoomIn:', typeof mapInstance.zoomIn);
      console.log('- zoomOut:', typeof mapInstance.zoomOut);
    } catch (error) {
      console.error('Error al inicializar el mapa:', error);
    }
  }, []);

  // Función para centrar el mapa en la ubicación del usuario
  const flyToUserLocation = useCallback(() => {
    console.log('Intentando volar a la ubicación del usuario...');
    console.log('Estado del mapa:', map ? 'Inicializado' : 'No inicializado');
    console.log('Ubicación del usuario:', userLocation);
    
    if (!map) {
      console.error('No se puede volar a la ubicación: El mapa no está inicializado');
      alert('Error: El mapa no está inicializado correctamente. Por favor, recarga la página.');
      return;
    }
    
    if (!userLocation) {
      console.error('No se puede volar a la ubicación: La ubicación del usuario no está disponible');
      alert('No se pudo obtener tu ubicación. Por favor, verifica los permisos de ubicación en tu navegador.');
      return;
    }
    
    try {
      // Verificamos que el método flyTo exista
      if (typeof map.flyTo !== 'function') {
        console.error('Error: El método flyTo no está disponible en la instancia del mapa');
        return;
      }
      
      console.log(`Volando a la ubicación: [${userLocation[0]}, ${userLocation[1]}]`);
      map.flyTo(userLocation, 13);
      console.log('Vuelo completado');
    } catch (error) {
      console.error('Error al volar a la ubicación:', error);
      alert('Ocurrió un error al intentar ir a tu ubicación. Por favor, intenta de nuevo.');
    }
  }, [map, userLocation]);

  // Función para hacer zoom in
  const zoomIn = useCallback(() => {
    console.log('Intentando hacer zoom in...');
    
    if (!map) {
      console.error('No se puede hacer zoom in: El mapa no está inicializado');
      alert('Error: El mapa no está inicializado correctamente. Por favor, recarga la página.');
      return;
    }
    
    try {
      // Verificamos que los métodos necesarios existan
      if (typeof map.getZoom !== 'function') {
        console.error('Error: El método getZoom no está disponible en la instancia del mapa');
        return;
      }
      
      if (typeof map.zoomIn !== 'function') {
        console.error('Error: El método zoomIn no está disponible en la instancia del mapa');
        return;
      }
      
      console.log(`Nivel de zoom actual: ${map.getZoom()}`);
      map.zoomIn();
      console.log(`Nuevo nivel de zoom: ${map.getZoom()}`);
    } catch (error) {
      console.error('Error al hacer zoom in:', error);
      alert('Ocurrió un error al intentar hacer zoom. Por favor, intenta de nuevo.');
    }
  }, [map]);

  // Función para hacer zoom out
  const zoomOut = useCallback(() => {
    console.log('Intentando hacer zoom out...');
    
    if (!map) {
      console.error('No se puede hacer zoom out: El mapa no está inicializado');
      alert('Error: El mapa no está inicializado correctamente. Por favor, recarga la página.');
      return;
    }
    
    try {
      // Verificamos que los métodos necesarios existan
      if (typeof map.getZoom !== 'function') {
        console.error('Error: El método getZoom no está disponible en la instancia del mapa');
        return;
      }
      
      if (typeof map.zoomOut !== 'function') {
        console.error('Error: El método zoomOut no está disponible en la instancia del mapa');
        return;
      }
      
      console.log(`Nivel de zoom actual: ${map.getZoom()}`);
      map.zoomOut();
      console.log(`Nuevo nivel de zoom: ${map.getZoom()}`);
    } catch (error) {
      console.error('Error al hacer zoom out:', error);
      alert('Ocurrió un error al intentar hacer zoom. Por favor, intenta de nuevo.');
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
    viewBounds,
    initializeMap,
    flyToUserLocation,
    zoomIn,
    zoomOut,
    addMarker,
    removeMarker,
    updateMapBounds,
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
