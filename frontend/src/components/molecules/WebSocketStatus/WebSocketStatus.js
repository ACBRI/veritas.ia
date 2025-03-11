import React, { useState, useEffect } from 'react';
import { useReport } from '../../../context/ReportContext';
import './WebSocketStatus.css';

/**
 * Componente que muestra el estado de la conexión WebSocket
 * y las actualizaciones en tiempo real
 */
const WebSocketStatus = () => {
  const { isConnected } = useReport();
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState('info'); // 'info', 'success', 'error'

  // Mostrar cambios en el estado de conexión
  useEffect(() => {
    if (isConnected) {
      showTemporaryNotification('Conectado a tiempo real', 'success');
    } else {
      showTemporaryNotification('Conexión en tiempo real perdida', 'error');
    }
  }, [isConnected]);

  /**
   * Muestra una notificación temporal que desaparece después de un tiempo
   * @param {string} message - Mensaje a mostrar
   * @param {string} type - Tipo de notificación (info, success, error)
   * @param {number} duration - Duración en ms (por defecto 3000ms)
   */
  const showTemporaryNotification = (message, type = 'info', duration = 3000) => {
    setNotificationMessage(message);
    setNotificationType(type);
    setShowNotification(true);

    // Ocultar después del tiempo especificado
    setTimeout(() => {
      setShowNotification(false);
    }, duration);
  };

  // No renderizar nada si no hay notificación
  if (!showNotification) {
    return null;
  }

  return (
    <div className={`websocket-notification ${notificationType}`}>
      <div className="notification-content">
        <span className="connection-indicator"></span>
        <span className="notification-message">{notificationMessage}</span>
      </div>
    </div>
  );
};

export default WebSocketStatus;
