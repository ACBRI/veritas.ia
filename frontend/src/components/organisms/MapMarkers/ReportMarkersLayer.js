import React, { useEffect, useState } from 'react';
import { useMap } from '../../../context/MapContext';
import { useReport } from '../../../context/ReportContext';
import ReportMarker from './ReportMarker';

const ReportMarkersLayer = () => {
  const { userLocation, viewBounds, map } = useMap();
  const { reports, getNearbyReports, fetchReportsFromBackend, isLoading } = useReport();
  const [isInitialFetchDone, setIsInitialFetchDone] = useState(false);
  
  // Efecto para cargar reportes iniciales cuando el mapa está listo
  useEffect(() => {
    const loadInitialReports = async () => {
      if (map && viewBounds && !isInitialFetchDone) {
        try {
          console.log('Cargando reportes iniciales del backend...');
          await fetchReportsFromBackend(viewBounds);
          setIsInitialFetchDone(true);
        } catch (error) {
          console.error('Error al cargar reportes iniciales:', error);
        }
      }
    };
    
    loadInitialReports();
  }, [map, viewBounds, fetchReportsFromBackend, isInitialFetchDone]);
  
  // Efecto para actualizar reportes cuando cambian los límites del mapa
  useEffect(() => {
    const loadReportsForBounds = async () => {
      if (map && viewBounds && isInitialFetchDone) {
        try {
          console.log('Actualizando reportes para nuevos límites del mapa...');
          await fetchReportsFromBackend(viewBounds);
        } catch (error) {
          console.error('Error al actualizar reportes para nuevos límites:', error);
        }
      }
    };
    
    loadReportsForBounds();
  }, [map, viewBounds, fetchReportsFromBackend, isInitialFetchDone]);
  
  // Obtener reportes cercanos (para compatibilidad con implementación anterior)
  const nearbyReports = userLocation ? getNearbyReports(userLocation) : reports;

  return (
    <>
      {isLoading ? (
        <div className="loading-indicator" style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 1000, background: 'white', padding: '5px 10px', borderRadius: '4px', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
          Cargando reportes...
        </div>
      ) : null}
      
      {nearbyReports.map(report => (
        <ReportMarker
          key={report.id}
          report={report}
          userLocation={userLocation}
        />
      ))}
    </>
  );
};

export default ReportMarkersLayer;
