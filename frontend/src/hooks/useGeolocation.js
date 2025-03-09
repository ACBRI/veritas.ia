import { useState, useEffect } from 'react';

/**
 * Hook personalizado para manejar la geolocalización del usuario
 * @returns {Object} Objeto con la ubicación del usuario y estado de carga
 */
const useGeolocation = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('Inicializando hook de geolocalización...');
    
    if (!navigator.geolocation) {
      console.error('La geolocalización no está soportada por este navegador.');
      setError('La geolocalización no está soportada por este navegador.');
      setLoading(false);
      return;
    }

    const successCallback = (position) => {
      const { latitude, longitude } = position.coords;
      console.log(`Ubicación obtenida: [${latitude}, ${longitude}]`);
      setUserLocation([latitude, longitude]);
      setLoading(false);
    };

    const errorCallback = (error) => {
      console.error(`Error de geolocalización: ${error.code} - ${error.message}`);
      
      let errorMessage = 'Error desconocido al obtener la ubicación';
      
      switch(error.code) {
        case 1: // PERMISSION_DENIED
          errorMessage = 'Usuario denegó el acceso a la geolocalización';
          break;
        case 2: // POSITION_UNAVAILABLE
          errorMessage = 'Ubicación no disponible';
          break;
        case 3: // TIMEOUT
          errorMessage = 'Se agotó el tiempo para obtener la ubicación';
          break;
        default:
          errorMessage = `Error desconocido: ${error.message}`;
          break;
      }
      
      setError(errorMessage);
      setLoading(false);
    };

    const options = { 
      enableHighAccuracy: true, 
      timeout: 10000, // Aumentado a 10 segundos
      maximumAge: 0 
    };

    console.log('Solicitando permisos de geolocalización...');
    navigator.geolocation.getCurrentPosition(
      successCallback,
      errorCallback,
      options
    );

    // No es necesario un cleanup para getCurrentPosition
  }, []);

  return { userLocation, loading, error };
};

export default useGeolocation;
