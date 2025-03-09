import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import PropTypes from 'prop-types';

const MarkerWithPopup = ({ position, icon, popupText }) => (
  <Marker position={position} icon={icon}>
    <Popup>{popupText}</Popup>
  </Marker>
);

// Añadir validación de props
MarkerWithPopup.propTypes = {
  position: PropTypes.arrayOf(PropTypes.number).isRequired,
  icon: PropTypes.object,
  popupText: PropTypes.node.isRequired,
};

export default MarkerWithPopup;
