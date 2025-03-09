import React from 'react';

const LocateButton = ({ onClick }) => (
  <div className="leaflet-control-locate leaflet-bar leaflet-control" style={{ 
    borderRadius: '50px', 
    marginBottom: '10px',
    background: '#e0e5ec',
    boxShadow: '8px 8px 15px #a3b1c6, -8px -8px 15px #ffffff',
    padding: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }}>
    <a href="#" title="Centrar en mi ubicación" onClick={onClick} style={{ textDecoration: 'none', color: '#3b82f6' }}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" style={{ verticalAlign: 'middle' }}>
        <circle cx="12" cy="12" r="11" fill="#e0e5ec" stroke="#a3b1c6" strokeWidth="1" />
        <circle cx="12" cy="12" r="8" fill="none" stroke="#3b82f6" strokeWidth="1.2" strokeDasharray="2 1" />
        <path d="M12 5.5c-2.5 0-4.5 2-4.5 4.5 0 3.5 4.5 8.5 4.5 8.5s4.5-5 4.5-8.5c0-2.5-2-4.5-4.5-4.5z" 
              fill="#3b82f6" stroke="#2563eb" strokeWidth="0.5" />
        <circle cx="12" cy="10" r="2" fill="#e0e5ec" />
      </svg>
    </a>
  </div>
);

export default LocateButton;
