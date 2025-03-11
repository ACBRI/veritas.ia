import axios from 'axios';
import { API_BASE_URL, ENDPOINTS, API_CONFIG } from '../config/api';

/**
 * Servicio para interactuar con los delitos electorales en el backend
 * y manejar la conversión entre IDs de frontend (strings) e IDs de backend (números)
 */
class ElectoralOffenseService {
  /**
   * Obtiene todos los delitos electorales del backend
   * @returns {Promise<Array>} - Lista de delitos electorales
   */
  static async getElectoralOffenses() {
    try {
      const response = await axios.get(
        `${API_BASE_URL}${ENDPOINTS.electoralOffenses}`,
        API_CONFIG
      );
      return response.data;
    } catch (error) {
      console.error('Error al obtener delitos electorales:', error);
      throw error;
    }
  }

  /**
   * Traduce un ID de tipo de delito del frontend al ID correspondiente en el backend
   * @returns {Object} - Mapeo de IDs frontend a backend
   */
  static getFrontendToBackendIdMap() {
    return {
      'multiple-vote': 1,
      'obstruction': 2,
      'ballot-destruction': 3,
      'vote-photo': 4,
      'impersonation': 5,
      'intimidation': 6,
      'secrecy-violation': 7,
      'illegal-propaganda': 8,
      'weapons': 9,
      'public-disorder': 10
    };
  }
  
  /**
   * Obtiene el mapeo inverso de IDs de backend a frontend
   * @returns {Object} - Mapeo de IDs backend a frontend
   */
  static getBackendToFrontendIdMap() {
    const frontendToBackend = this.getFrontendToBackendIdMap();
    const backendToFrontend = {};
    
    for (const [frontendId, backendId] of Object.entries(frontendToBackend)) {
      backendToFrontend[backendId] = frontendId;
    }
    
    return backendToFrontend;
  }

  /**
   * Convierte un ID del frontend a un ID del backend
   * @param {string|number} frontendId - ID del frontend o un ID ya convertido
   * @returns {number} - ID del backend o null si no existe
   */
  static convertFrontendIdToBackendId(frontendId) {
    // Si ya es un número, verificar que sea válido
    if (typeof frontendId === 'number') {
      const backendToFrontend = this.getBackendToFrontendIdMap();
      return backendToFrontend[frontendId] ? frontendId : null;
    }
    
    // Si es un string, hacer la conversión normal
    const idMap = this.getFrontendToBackendIdMap();
    return idMap[frontendId] || null;
  }

  /**
   * Convierte un ID del backend a un ID del frontend
   * @param {number|string} backendId - ID del backend (número o string numérico)
   * @returns {string} - ID del frontend o null si no existe
   */
  static convertBackendIdToFrontendId(backendId) {
    // Asegurar que backendId sea tratado como número
    const id = typeof backendId === 'string' ? parseInt(backendId, 10) : backendId;
    
    // Usar el mapa inverso para mayor eficiencia
    const backendToFrontend = this.getBackendToFrontendIdMap();
    return backendToFrontend[id] || null;
  }
  /**
   * Constructor del servicio para uso como instancia
   * Permite usar el servicio en forma de instancia además de estática
   */
  constructor() {
    // Inicializar mapas para uso como instancia
    this.frontendToBackendMap = ElectoralOffenseService.getFrontendToBackendIdMap();
    this.backendToFrontendMap = ElectoralOffenseService.getBackendToFrontendIdMap();
  }
  
  /**
   * Método de instancia para convertir ID de frontend a backend
   * @param {string|number} frontendId - ID en formato frontend
   * @returns {number|null} - ID en formato backend
   */
  convertToBackendId(frontendId) {
    return ElectoralOffenseService.convertFrontendIdToBackendId(frontendId);
  }
  
  /**
   * Método de instancia para convertir ID de backend a frontend
   * @param {number|string} backendId - ID en formato backend
   * @returns {string|null} - ID en formato frontend
   */
  convertToFrontendId(backendId) {
    return ElectoralOffenseService.convertBackendIdToFrontendId(backendId);
  }
  
  /**
   * Valida si un ID de delito electoral es válido
   * @param {string|number} id - ID a validar
   * @param {string} type - Tipo de ID ('frontend' o 'backend')
   * @returns {boolean} - true si es válido, false si no
   */
  validateOffenseId(id, type = 'frontend') {
    if (type === 'frontend') {
      return id in this.frontendToBackendMap;
    } else if (type === 'backend') {
      return id in this.backendToFrontendMap;
    }
    return false;
  }
}

export default ElectoralOffenseService;
