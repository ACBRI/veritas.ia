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
    if (!navigator.geolocation) {
      setError('La geolocalización no está soportada por este navegador.');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation([latitude, longitude]);
        setLoading(false);
      },
      (error) => {
        setError(`Error obteniendo la ubicación: ${error.message}`);
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  }, []);

  return { userLocation, loading, error };
};

export default useGeolocation;
