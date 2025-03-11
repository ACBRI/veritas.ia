import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import ReportService from '../services/ReportService';
import WebSocketService from '../services/WebSocketService';
import { API_BASE_URL } from '../config/api';

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
  
  // Estado para el WebSocket
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Referencia al servicio WebSocket para mantenerlo entre renders
  const webSocketRef = useRef(null);

  // Limpiar reportes viejos cada vez que cambia la lista
  useEffect(() => {
    const cleanOldReports = () => {
      const now = new Date();
      const thirtyDaysAgo = new Date(
        now - REPORT_LIFETIME_DAYS * 24 * 60 * 60 * 1000
      );

      setReports((prevReports) =>
        prevReports.filter(
          (report) => new Date(report.timestamp) > thirtyDaysAgo
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

  /**
   * Obtiene reportes del backend basados en un bounding box
   * @param {Object} bbox - Bounding box del mapa
   * @param {string|number} offenseType - Tipo de delito (opcional)
   * @returns {Promise<Array>} - Lista de reportes
   */
  const fetchReportsFromBackend = useCallback(async (bbox, offenseType = null) => {
    try {
      setIsLoading(true);
      
      // Se asume que ReportService normaliza el bbox y usa los servicios de normalización
      const fetchedReports = await ReportService.getReports(bbox, offenseType);
      
      // Optimizar la actualización de los reportes existentes con los nuevos
      // usando un solo cambio de estado para mejor rendimiento
      setReports(prevReports => {
        // Crear un mapa de reportes existentes para fácil referencia y búsqueda O(1)
        const existingReportsMap = new Map(
          prevReports.map(report => [report.id, report])
        );
        
        // Integrar reportes nuevos y actualizar existentes
        // Si un reporte ya existe, mantenemos ciertos datos locales importantes
        fetchedReports.forEach(report => {
          const existingReport = existingReportsMap.get(report.id);
          if (existingReport) {
            // Mantener datos locales importantes pero actualizar del backend
            existingReportsMap.set(report.id, {
              ...report,
              // Preservar datos que podrían haberse actualizado localmente 
              // y que el backend no proporciona
              userHasConfirmed: existingReport.userHasConfirmed || false
            });
          } else {
            // Nuevo reporte, agregar con valores por defecto para datos locales
            existingReportsMap.set(report.id, {
              ...report,
              userHasConfirmed: false
            });
          }
        });
        
        // Convertir mapa de vuelta a array
        return Array.from(existingReportsMap.values());
      });
      
      setIsLoading(false);
      return fetchedReports;
    } catch (error) {
      console.error('Error al obtener reportes del backend:', error);
      setIsLoading(false);
      throw error;
    }
  }, []);

  /**
   * Procesa mensajes WebSocket y actualiza el estado de reportes
   * @param {Object} data - Datos recibidos del WebSocket
   */
  const processWebSocketMessage = useCallback((data) => {
    // Verificar que es un mensaje válido
    if (!data || !data.type) return;
    
    console.log('WebSocket message received:', data.type);
    
    switch (data.type) {
      case 'new_report':
        // Normalizar datos recibidos a formato esperado por el frontend
        if (data.data) {
          // Asegurarse que el formato es correcto
          const normalizedReport = ReportService.normalizeReportFromWebSocket(data.data);
          
          // Agregar nuevo reporte a la lista, si no existe
          setReports(prevReports => {
            // Verificar si el reporte ya existe
            if (prevReports.some(r => r.id === normalizedReport.id)) {
              return prevReports;
            }
            return [...prevReports, {
              ...normalizedReport,
              userHasConfirmed: false,
              isRecent: true
            }];
          });
        }
        break;
        
      case 'confirmation_update':
        // Actualizar confirmaciones de un reporte existente
        if (data.data && data.data.report_id) {
          setReports(prevReports => 
            prevReports.map(report => 
              report.id === data.data.report_id 
                ? { 
                    ...report, 
                    confirmations: data.data.confirmation_count,
                    // No resetear userHasConfirmed para mantener estado local
                  }
                : report
            )
          );
        }
        break;
        
      case 'report_expired':
        // Remover reporte expirado o marcarlo como inactivo
        if (data.data && data.data.report_id) {
          setReports(prevReports => 
            prevReports.map(report =>
              report.id === data.data.report_id
                ? { ...report, isActive: false, isExpired: true }
                : report
            )
          );
        }
        break;
        
      case 'report_deleted':
        // Remover reporte eliminado
        if (data.data && data.data.report_id) {
          setReports(prevReports => 
            prevReports.filter(report => report.id !== data.data.report_id)
          );
        }
        break;
        
      default:
        console.log('Tipo de mensaje WebSocket no reconocido:', data.type);
    }
  }, []);

  // Inicializar WebSocket
  useEffect(() => {
    const handleConnect = () => {
      console.log('WebSocket conectado exitosamente');
      setIsConnected(true);
    };
    
    const handleDisconnect = () => {
      console.log('WebSocket desconectado');
      setIsConnected(false);
    };
    
    // Crear servicio WebSocket
    webSocketRef.current = new WebSocketService(
      processWebSocketMessage,
      handleConnect,
      handleDisconnect
    );
    
    // Conectar al WebSocket
    webSocketRef.current.connect();
    
    // Limpiar al desmontar
    return () => {
      if (webSocketRef.current) {
        webSocketRef.current.disconnect();
      }
    };
  }, [processWebSocketMessage]);
  
  // Función para obtener reportes cercanos a una ubicación
  const getNearbyReports = (location, radiusKm = 5) => {
    if (!location) return [];

    return reports.filter((report) => {
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
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  /**
   * Confirma un reporte con protección contra confirmaciones duplicadas
   * @param {string} reportId - ID del reporte a confirmar
   * @returns {Promise<Object>} - Respuesta del backend
   */
  const confirmReport = async (reportId) => {
    try {
      // Verificar si el reporte existe en nuestra colección local
      const reportToConfirm = reports.find(report => report.id === reportId);
      if (!reportToConfirm) {
        throw new Error('Reporte no encontrado');
      }
      
      // Verificar si ya lo ha confirmado el usuario
      if (reportToConfirm.userHasConfirmed) {
        console.warn('El usuario ya ha confirmado este reporte');
        return reportToConfirm;
      }
      
      // Marcar como confirmado localmente primero (optimistic update)
      setReports(prevReports =>
        prevReports.map(report =>
          report.id === reportId
            ? {
                ...report, 
                confirmations: (report.confirmations || 0) + 1,
                userHasConfirmed: true
              }
            : report
        )
      );
      
      // Llamar al servicio para confirmar el reporte en el backend
      const result = await ReportService.confirmReport(reportId);
      
      // La actualización final de confirmaciones vendrá por WebSocket
      // pero en caso de que el WebSocket falle, ya tenemos una actualización optimista
      
      return result;
    } catch (error) {
      console.error('Error al confirmar reporte:', error);
      
      // Revertir cambio optimista en caso de error
      setReports(prevReports =>
        prevReports.map(report =>
          report.id === reportId && report.userHasConfirmed
            ? {
                ...report, 
                confirmations: Math.max((report.confirmations || 1) - 1, 0),
                userHasConfirmed: false
              }
            : report
        )
      );
      
      throw error;
    }
  };

  const submitReport = async (reportData) => {
    // Verificar timeout
    if (!canMakeNewReport()) {
      const minutesLeft = Math.ceil(
        (5 * 60 * 1000 - (Date.now() - lastReportTime)) / 60000
      );
      throw new Error(
        `Por favor espera ${minutesLeft} minutos antes de enviar otro reporte`
      );
    }

    // Verificar precisión de ubicación
    if (!validateLocationAccuracy(reportData.position)) {
      throw new Error(
        'La precisión de la ubicación no es suficiente. Por favor, intenta en un lugar con mejor señal GPS'
      );
    }

    try {
      // Usar el nuevo servicio para enviar el reporte
      // El servicio se encargará de convertir el formato apropiadamente
      const savedReport = await ReportService.createReport(reportData);

      // Actualizar el tiempo del último reporte
      setLastReportTime(Date.now());

      // La actualización del reporte real vendrá por WebSocket
      // pero también lo agregamos localmente por si acaso
      const enrichedReport = {
        ...reportData,
        id: savedReport.id,
        sessionId,
        timestamp: savedReport.created_at,
        confirmations: 0,
        isRecent: true,
      };

      setReports((prevReports) => {
        // Verificar si el reporte ya existe (puede haber llegado por WebSocket)
        if (prevReports.some(r => r.id === savedReport.id)) {
          return prevReports;
        }
        return [...prevReports, enrichedReport];
      });

      return enrichedReport;
    } catch (error) {
      console.error('Error al enviar reporte:', error);
      throw error;
    }
  };

  const value = {
    submitReport,
    canMakeNewReport,
    lastReportTime,
    sessionId,
    reports,
    getNearbyReports,
    confirmReport,
    fetchReportsFromBackend,
    isLoading,
    isConnected,
  };

  return (
    <ReportContext.Provider value={value}>{children}</ReportContext.Provider>
  );
};
