import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

const MarkerWithPopup = ({ position, icon, popupText }) => (
  <Marker position={position} icon={icon}>
    <Popup>
      {popupText}
    </Popup>
  </Marker>
);

export default MarkerWithPopup;
