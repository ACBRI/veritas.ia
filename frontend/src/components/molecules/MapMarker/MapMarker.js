import React from 'react';
import PropTypes from 'prop-types';
import { Marker, Popup } from 'react-leaflet';
import './MapMarker.css';

/**
 * Componente MapMarker molecular
 * Representa un marcador en el mapa con un popup opcional
 */
const MapMarker = ({
  position,
  icon,
  popupContent,
  onClick,
  eventHandlers = {},
}) => {
  // Preparamos los manejadores de eventos correctamente
  const handlers = {};
  
  // Solo añadimos el evento click si onClick es una función
  if (typeof onClick === 'function') {
    handlers.click = onClick;
  }
  
  // Añadimos el resto de manejadores de eventos, verificando que sean funciones
  Object.keys(eventHandlers).forEach(eventName => {
    if (typeof eventHandlers[eventName] === 'function') {
      handlers[eventName] = eventHandlers[eventName];
    } else {
      console.warn(`Manejador de evento '${eventName}' no es una función válida`);
    }
  });

  return (
    <Marker
      position={position}
      icon={icon}
      eventHandlers={handlers}
    >
      {popupContent && (
        <Popup className="map-marker-popup">{popupContent}</Popup>
      )}
    </Marker>
  );
};

MapMarker.propTypes = {
  position: PropTypes.arrayOf(PropTypes.number).isRequired,
  icon: PropTypes.object,
  popupContent: PropTypes.node,
  onClick: PropTypes.func,
  eventHandlers: PropTypes.object,
};

export default MapMarker;
