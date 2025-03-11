import { ENDPOINTS } from '../config/api';
import ElectoralOffenseService from './ElectoralOffenseService';

/**
 * Servicio para manejar la conexión WebSocket para actualizaciones en tiempo real
 */
class WebSocketService {
  constructor(onMessage, onConnect, onDisconnect) {
    this.ws = null;
    this.isConnected = false;
    this.reconnectInterval = null;
    this.onMessage = onMessage || this.defaultMessageHandler;
    this.onConnect = onConnect || (() => console.log('WebSocket conectado'));
    this.onDisconnect = onDisconnect || (() => console.log('WebSocket desconectado'));
    this.reconnectTime = 3000; // 3 segundos para reconectar
  }

  /**
   * Conecta al WebSocket
   * @param {string} bbox - Bounding box para filtrar reportes (opcional)
   */
  connect(bbox = null) {
    // Construir la URL del WebSocket
    let wsUrl = ENDPOINTS.websocket;
    if (bbox) {
      wsUrl += `?bbox=${encodeURIComponent(JSON.stringify(bbox))}`;
    }
    
    // Crear nueva conexión WebSocket
    this.ws = new WebSocket(wsUrl);
    
    // Configurar manejadores de eventos
    this.ws.onopen = this.handleOpen.bind(this);
    this.ws.onclose = this.handleClose.bind(this);
    this.ws.onmessage = this.handleMessage.bind(this);
    this.ws.onerror = this.handleError.bind(this);
  }

  /**
   * Desconecta del WebSocket
   */
  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
      this.isConnected = false;
      
      // Limpiar el intervalo de reconexión
      if (this.reconnectInterval) {
        clearInterval(this.reconnectInterval);
        this.reconnectInterval = null;
      }
    }
  }

  /**
   * Manejador de evento de apertura de conexión
   */
  handleOpen() {
    console.log('Conexión WebSocket establecida');
    this.isConnected = true;
    
    // Limpiar el intervalo de reconexión si existe
    if (this.reconnectInterval) {
      clearInterval(this.reconnectInterval);
      this.reconnectInterval = null;
    }
    
    // Llamar al callback de conexión
    this.onConnect();
  }

  /**
   * Manejador de evento de cierre de conexión
   */
  handleClose() {
    console.log('Conexión WebSocket cerrada');
    this.isConnected = false;
    
    // Configurar la reconexión automática
    if (!this.reconnectInterval) {
      this.reconnectInterval = setInterval(() => {
        console.log('Intentando reconexión WebSocket...');
        this.connect();
      }, this.reconnectTime);
    }
    
    // Llamar al callback de desconexión
    this.onDisconnect();
  }

  /**
   * Manejador de evento de error
   * @param {Event} error - Evento de error
   */
  handleError(error) {
    console.error('Error en la conexión WebSocket:', error);
  }

  /**
   * Manejador de evento de mensaje
   * @param {MessageEvent} event - Evento de mensaje
   */
  handleMessage(event) {
    try {
      const data = JSON.parse(event.data);
      
      // Procesar el mensaje según su tipo
      if (data.type === 'heartbeat') {
        // El heartbeat no necesita procesamiento especial
        console.log('Heartbeat recibido del servidor');
      } else if (data.type === 'new_report') {
        // Transformar el reporte para hacerlo compatible con el formato del frontend
        const report = {
          id: data.data.id,
          offense_type_id: ElectoralOffenseService.convertBackendIdToFrontendId(data.data.offense_type_id) || data.data.offense_type_id,
          position: {
            coords: {
              latitude: data.data.coordinates.latitude,
              longitude: data.data.coordinates.longitude,
              accuracy: data.data.coordinates.accuracy || 0
            }
          },
          timestamp: data.data.created_at,
          confirmations: data.data.confirmation_count,
          isRecent: true // Un reporte nuevo siempre es reciente
        };
        
        // Llamar al callback con el reporte transformado
        this.onMessage({ type: 'new_report', data: report });
      } else if (data.type === 'confirmation_update') {
        // Pasar directamente la actualización de confirmación
        this.onMessage(data);
      } else {
        // Cualquier otro tipo de mensaje
        this.onMessage(data);
      }
    } catch (error) {
      console.error('Error al procesar mensaje WebSocket:', error, event.data);
    }
  }

  /**
   * Manejador de mensajes por defecto
   * @param {Object} data - Datos del mensaje
   */
  defaultMessageHandler(data) {
    console.log('Mensaje WebSocket recibido:', data);
  }

  /**
   * Verifica si el WebSocket está conectado
   * @returns {boolean} - true si está conectado, false en caso contrario
   */
  isWebSocketConnected() {
    return this.isConnected;
  }
}

export default WebSocketService;
