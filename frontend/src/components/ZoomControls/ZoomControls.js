import React from 'react';

const ZoomControls = () => (
  <div
    className="leaflet-control-zoom leaflet-bar leaflet-control"
    style={{ borderRadius: '50px', marginBottom: '60px' }}
  >
    <a
      className="leaflet-control-zoom-in"
      href="#"
      title="Zoom in"
      style={{ borderRadius: '50px 50px 0 0' }}
    >
      +
    </a>
    <a
      className="leaflet-control-zoom-out"
      href="#"
      title="Zoom out"
      style={{ borderRadius: '0 0 50px 50px' }}
    >
      −
    </a>
  </div>
);

export default ZoomControls;
