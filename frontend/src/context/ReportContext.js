import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const ReportContext = createContext();

// Hook personalizado para usar el contexto
export const useReport = () => {
  const context = useContext(ReportContext);
  if (!context) {
    throw new Error('useReport debe usarse dentro de un ReportProvider');
  }
  return context;
};

// Constantes
const REPORT_LIFETIME_DAYS = 30;
const RECENT_REPORT_HOURS = 24;

export const ReportProvider = ({ children }) => {
  // Estado para el ID de sesión anónimo
  const [sessionId, setSessionId] = useState(null);
  
  // Estado para el último reporte y su tiempo
  const [lastReportTime, setLastReportTime] = useState(null);

  // Estado para la lista de reportes
  const [reports, setReports] = useState([]);

  // Limpiar reportes viejos cada vez que cambia la lista
  useEffect(() => {
    const cleanOldReports = () => {
      const now = new Date();
      const thirtyDaysAgo = new Date(now - (REPORT_LIFETIME_DAYS * 24 * 60 * 60 * 1000));
      
      setReports(prevReports => 
        prevReports.filter(report => 
          new Date(report.timestamp) > thirtyDaysAgo
        )
      );
    };

    cleanOldReports();
    // Programar limpieza cada día
    const interval = setInterval(cleanOldReports, 24 * 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);
  
  // Inicializar ID de sesión al cargar
  useEffect(() => {
    const storedSessionId = localStorage.getItem('reportSessionId');
    if (storedSessionId) {
      setSessionId(storedSessionId);
    } else {
      const newSessionId = uuidv4();
      localStorage.setItem('reportSessionId', newSessionId);
      setSessionId(newSessionId);
    }
  }, []);

  // Verificar si la ubicación tiene precisión aceptable
  const validateLocationAccuracy = (position) => {
    return position.coords.accuracy <= 100; // 100 metros de precisión
  };

  // Verificar si podemos hacer un nuevo reporte (timeout de 5 minutos)
  const canMakeNewReport = () => {
    if (!lastReportTime) return true;
    
    const fiveMinutesInMs = 5 * 60 * 1000;
    const timeSinceLastReport = Date.now() - lastReportTime;
    return timeSinceLastReport >= fiveMinutesInMs;
  };

  // Función para enviar un reporte
  // Obtener reportes cercanos a una ubicación
  const getNearbyReports = (location, radiusKm = 5) => {
    if (!location) return [];
    
    return reports.filter(report => {
      const distance = calculateDistance(
        location[0],
        location[1],
        report.position.coords.latitude,
        report.position.coords.longitude
      );
      return distance <= radiusKm;
    });
  };

  // Calcular distancia entre dos puntos
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radio de la Tierra en km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Confirmar un reporte
  const confirmReport = (reportId) => {
    setReports(prevReports =>
      prevReports.map(report =>
        report.id === reportId
          ? { ...report, confirmations: (report.confirmations || 0) + 1 }
          : report
      )
    );
  };

  const submitReport = async (reportData) => {
    // Verificar timeout
    if (!canMakeNewReport()) {
      const minutesLeft = Math.ceil((5 * 60 * 1000 - (Date.now() - lastReportTime)) / 60000);
      throw new Error(`Por favor espera ${minutesLeft} minutos antes de enviar otro reporte`);
    }

    // Verificar precisión de ubicación
    if (!validateLocationAccuracy(reportData.position)) {
      throw new Error('La precisión de la ubicación no es suficiente. Por favor, intenta en un lugar con mejor señal GPS');
    }

    // Agregar datos adicionales al reporte
    const enrichedReport = {
      ...reportData,
      id: uuidv4(),
      sessionId,
      timestamp: new Date().toISOString(),
      confirmations: 0,
      isRecent: true
    };

    // Agregar el nuevo reporte a la lista
    setReports(prevReports => [...prevReports, enrichedReport]);

    // Actualizar tiempo del último reporte
    setLastReportTime(Date.now());

    return enrichedReport;
  };

  const value = {
    submitReport,
    canMakeNewReport,
    lastReportTime,
    sessionId,
    reports,
    getNearbyReports,
    confirmReport
  };

  return (
    <ReportContext.Provider value={value}>
      {children}
    </ReportContext.Provider>
  );
};
