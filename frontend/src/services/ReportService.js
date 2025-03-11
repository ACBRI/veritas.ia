import axios from 'axios';
import { API_BASE_URL, ENDPOINTS, API_CONFIG } from '../config/api';
import ElectoralOffenseService from './ElectoralOffenseService';

// Constantes para formatos de coordenadas
// Exportar para que puedan ser utilizadas por otros servicios/componentes
export const COORD_FORMAT = {
  FRONTEND: 'frontend', // {position: {coords: {latitude, longitude, accuracy}}}
  BACKEND: 'backend',   // {coordinates: {latitude, longitude, accuracy}}
  GEOJSON: 'geojson'    // GeoJSON format usado por PostGIS
};

/**
 * Servicio para interactuar con los reportes en el backend
 */
class ReportService {
  /**
   * Convierte coordenadas desde un formato a otro
   * @param {Object|Array} coordinates - Coordenadas en cualquier formato soportado
   * @param {string} fromFormat - Formato de origen (COORD_FORMAT)
   * @param {string} toFormat - Formato de destino (COORD_FORMAT)
   * @returns {Object|Array} - Coordenadas en el formato de destino
   */
  static normalizeCoordinates(coordinates, fromFormat, toFormat) {
    // Primero extraemos valores normalizados
    let lat, lng, accuracy = 0;
    
    if (fromFormat === COORD_FORMAT.FRONTEND) {
      if (coordinates.position && coordinates.position.coords) {
        lat = coordinates.position.coords.latitude;
        lng = coordinates.position.coords.longitude;
        accuracy = coordinates.position.coords.accuracy || 0;
      }
    } else if (fromFormat === COORD_FORMAT.BACKEND) {
      if (coordinates.coordinates) {
        lat = coordinates.coordinates.latitude;
        lng = coordinates.coordinates.longitude;
        accuracy = coordinates.coordinates.accuracy || 0;
      }
    } else if (fromFormat === COORD_FORMAT.GEOJSON) {
      if (coordinates.type === 'Point' && Array.isArray(coordinates.coordinates)) {
        // En GeoJSON, el orden es [longitud, latitud]
        lng = coordinates.coordinates[0];
        lat = coordinates.coordinates[1];
      } else if (typeof coordinates === 'string') {
        // Intentar analizar string GeoJSON
        try {
          const parsed = JSON.parse(coordinates);
          if (parsed.type === 'Point' && Array.isArray(parsed.coordinates)) {
            lng = parsed.coordinates[0];
            lat = parsed.coordinates[1];
          }
        } catch (error) {
          console.error('Error al analizar string GeoJSON:', error);
        }
      }
    } else if (Array.isArray(coordinates) && coordinates.length >= 2) {
      // Si es un array [lat, lng, accuracy?]
      lat = coordinates[0];
      lng = coordinates[1];
      accuracy = coordinates[2] || 0;
    }
    
    // Luego convertimos al formato deseado
    if (toFormat === COORD_FORMAT.FRONTEND) {
      return {
        position: {
          coords: {
            latitude: lat,
            longitude: lng,
            accuracy: accuracy
          }
        }
      };
    } else if (toFormat === COORD_FORMAT.BACKEND) {
      return {
        coordinates: {
          latitude: lat,
          longitude: lng,
          accuracy: accuracy
        }
      };
    } else if (toFormat === COORD_FORMAT.GEOJSON) {
      return {
        type: 'Point',
        coordinates: [lng, lat] // GeoJSON usa [longitud, latitud]
      };
    }
    
    // Si no se puede convertir, devolver null
    return null;
  }
  /**
   * Crea un nuevo reporte en el backend
   * @param {Object} reportData - Datos del reporte
   * @returns {Promise<Object>} - Datos del reporte creado
   */
  static async createReport(reportData) {
    try {
      // Determinar el formato de entrada
      let inputFormat;
      if (reportData.position && reportData.position.coords) {
        inputFormat = COORD_FORMAT.FRONTEND;
      } else if (reportData.coordinates) {
        inputFormat = COORD_FORMAT.BACKEND;
      } else if (reportData.type === 'Point' && Array.isArray(reportData.coordinates)) {
        inputFormat = COORD_FORMAT.GEOJSON;
      }
      
      // Verificar si el offense_type_id es un string del frontend y convertirlo
      if (typeof reportData.offense_type_id === 'string') {
        const backendId = ElectoralOffenseService.convertFrontendIdToBackendId(reportData.offense_type_id);
        if (!backendId) {
          throw new Error(`Tipo de delito electoral no reconocido: ${reportData.offense_type_id}`);
        }
        reportData.offense_type_id = backendId;
      }

      // Normalizar coordenadas al formato del backend
      const normalizedData = this.normalizeCoordinates(reportData, inputFormat, COORD_FORMAT.BACKEND);
      
      if (!normalizedData || !normalizedData.coordinates) {
        throw new Error('No se pudieron normalizar las coordenadas del reporte');
      }

      // Preparar payload para el backend
      const payload = {
        offense_type_id: parseInt(reportData.offense_type_id),
        coordinates: normalizedData.coordinates
      };

      console.log('Enviando reporte al backend:', payload);

      const response = await axios.post(
        `${API_BASE_URL}${ENDPOINTS.reports}`,
        payload,
        API_CONFIG
      );
      
      return response.data;
    } catch (error) {
      console.error('Error al crear reporte:', error);
      throw error;
    }
  }

  /**
   * Normaliza un bounding box a formato backend
   * @param {Object} bbox - Bounding box en formato MapContext o formato backend
   * @returns {Object} - Bounding box normalizado para backend
   */
  static normalizeBoundingBox(bbox) {
    // Si ya está en formato backend, usar directamente
    if (bbox.min_lat !== undefined && bbox.max_lat !== undefined) {
      return {
        min_lat: bbox.min_lat,
        min_lon: bbox.min_lon,
        max_lat: bbox.max_lat,
        max_lon: bbox.max_lon
      };
    }
    
    // Si está en formato Leaflet o MapContext (tienen _southWest y _northEast)
    if (bbox._southWest && bbox._northEast) {
      return {
        min_lat: bbox._southWest.lat,
        min_lon: bbox._southWest.lng,
        max_lat: bbox._northEast.lat,
        max_lon: bbox._northEast.lng
      };
    }
    
    // Si está en formato array [minLat, minLon, maxLat, maxLon]
    if (Array.isArray(bbox) && bbox.length >= 4) {
      return {
        min_lat: bbox[0],
        min_lon: bbox[1],
        max_lat: bbox[2],
        max_lon: bbox[3]
      };
    }
    
    throw new Error('Formato de bounding box no reconocido');
  }

  /**
   * Obtiene reportes dentro de un área geográfica
   * @param {Object} bbox - Bounding box para filtrar reportes
   * @param {number|string} offenseType - Tipo de delito (opcional)
   * @param {boolean} activeOnly - Solo reportes activos
   * @returns {Promise<Array>} - Lista de reportes
   */
  static async getReports(bbox, offenseType = null, activeOnly = true) {
    try {
      // Normalizar bounding box
      const normalizedBbox = this.normalizeBoundingBox(bbox);
      
      // Preparar los parámetros para la solicitud
      const params = {
        ...normalizedBbox,
        active_only: activeOnly
      };

      // Convertir el tipo de delito si es necesario
      if (offenseType !== null) {
        if (typeof offenseType === 'string') {
          params.offense_type = ElectoralOffenseService.convertFrontendIdToBackendId(offenseType);
        } else {
          params.offense_type = offenseType;
        }
      }

      const response = await axios.get(
        `${API_BASE_URL}${ENDPOINTS.reports}`,
        { 
          ...API_CONFIG,
          params 
        }
      );
      
      // Convertir los reportes devueltos a un formato compatible con el frontend
      return response.data.map(report => {
        // Extraer coordenadas desde el GeoJSON del backend
        let locationData;
        try {
          locationData = JSON.parse(report.location);
        } catch (e) {
          // Si ya es un objeto, no necesita parsing
          locationData = report.location;
        }
        
        // Normalizar coordenadas a formato frontend
        const frontendCoords = this.normalizeCoordinates(
          locationData, 
          COORD_FORMAT.GEOJSON, 
          COORD_FORMAT.FRONTEND
        );
        
        return {
          id: report.id,
          offense_type_id: ElectoralOffenseService.convertBackendIdToFrontendId(report.offense_type_id) || report.offense_type_id,
          ...frontendCoords, // Incluye la posición normalizada
          timestamp: report.created_at,
          confirmations: report.confirmation_count,
          isRecent: new Date(report.created_at) > new Date(Date.now() - 24*60*60*1000)
        };
      });
    } catch (error) {
      console.error('Error al obtener reportes:', error);
      throw error;
    }
  }

  /**
   * Confirma un reporte
   * @param {string} reportId - ID del reporte a confirmar
   * @returns {Promise<Object>} - Respuesta del servidor
   */
  static async confirmReport(reportId) {
    try {
      const response = await axios.put(
        `${API_BASE_URL}${ENDPOINTS.reports}/${reportId}/confirm`,
        {},
        API_CONFIG
      );
      
      return response.data;
    } catch (error) {
      console.error('Error al confirmar reporte:', error);
      throw error;
    }
  }

  /**
   * Normaliza un reporte recibido a través de WebSocket al formato del frontend
   * @param {Object} reportData - Datos del reporte recibidos por WebSocket
   * @returns {Object} - Reporte normalizado para el frontend
   */
  static normalizeReportFromWebSocket(reportData) {
    try {
      // Si no hay datos, devolver un objeto vacío
      if (!reportData) return {};
      
      // Extraer información de ubicación (viene en formato GeoJSON desde el backend)
      let locationData;
      if (reportData.location) {
        if (typeof reportData.location === 'string') {
          try {
            locationData = JSON.parse(reportData.location);
          } catch (e) {
            console.error('Error al analizar datos GeoJSON:', e);
            locationData = reportData.location; // Usar tal cual si no se puede parsear
          }
        } else {
          locationData = reportData.location;
        }
      }
      
      // Convertir ID de delito al formato frontend
      let offenseTypeId = reportData.offense_type_id;
      if (typeof offenseTypeId === 'number') {
        const frontendId = ElectoralOffenseService.convertBackendIdToFrontendId(offenseTypeId);
        if (frontendId) {
          offenseTypeId = frontendId;
        }
      }
      
      // Normalizar coordenadas
      let positionData = {};
      if (locationData) {
        const normalizedCoords = this.normalizeCoordinates(
          locationData,
          COORD_FORMAT.GEOJSON,
          COORD_FORMAT.FRONTEND
        );
        if (normalizedCoords) {
          positionData = normalizedCoords;
        }
      }
      
      // Crear objeto de reporte normalizado
      return {
        id: reportData.id,
        offense_type_id: offenseTypeId,
        ...positionData,
        timestamp: reportData.created_at || new Date().toISOString(),
        confirmations: reportData.confirmation_count || 0,
        isRecent: reportData.created_at 
          ? new Date(reportData.created_at) > new Date(Date.now() - 24*60*60*1000)
          : true
      };
    } catch (error) {
      console.error('Error al normalizar reporte de WebSocket:', error);
      return reportData; // Devolver datos sin procesar en caso de error
    }
  }
}

export default ReportService;
