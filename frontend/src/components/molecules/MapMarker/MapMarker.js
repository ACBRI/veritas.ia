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
  return (
    <Marker
      position={position}
      icon={icon}
      eventHandlers={{
        click: onClick,
        ...eventHandlers,
      }}
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
