import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useMap } from '../context/MapContext';
import MapLayout from './templates/MapLayout/MapLayout';
import MapControls from './organisms/MapControls/MapControls';
import MapMarker from './molecules/MapMarker/MapMarker';
import ReportForm from './organisms/ReportForm/ReportForm';
import './MapComponent.css';

/**
 * Componente MapComponent refactorizado usando arquitectura CDD
 * Utiliza componentes atómicos, moleculares, organismos y plantillas
 */
const MapComponent = () => {
  const {
    userLocation,
    defaultIcon,
    initializeMap,
    flyToUserLocation,
    zoomIn,
    zoomOut,
  } = useMap();

  const [showReportForm, setShowReportForm] = React.useState(false);

  const handleReportSubmit = (reportDetails) => {
    console.log('Reporte enviado:', reportDetails);
    setShowReportForm(false);
  };

  const handleReportCancel = () => {
    setShowReportForm(false);
  };

  // Componente para el contenido del popup
  const UserLocationPopup = () => (
    <Box className="user-location-popup">
      <Typography variant="body1" fontWeight="bold">
        ¡Estás aquí!
      </Typography>
      <Typography variant="body2">Tu ubicación actual</Typography>
    </Box>
  );

  // Componente para el botón de reporte
  const renderReportButton = () => (
    <Button
      variant="contained"
      color="primary"
      onClick={() => setShowReportForm(true)}
    >
      Reportar
    </Button>
  );

  return (
    <Box className="map-component">
      <MapLayout
        center={[-1.8312, -78.1834]} // Coordenadas de Ecuador
        zoom={7}
        onMapReady={initializeMap}
        mapControls={
          <MapControls
            onLocateUser={flyToUserLocation}
            onZoomIn={zoomIn}
            onZoomOut={zoomOut}
            disableLocate={!userLocation}
          />
        }
        floatingContent={showReportForm ? (
          <ReportForm
            onSubmit={handleReportSubmit}
            onCancel={handleReportCancel}
          />
        ) : (
          renderReportButton()
        )}
      >
        {userLocation && (
          <MapMarker
            position={userLocation}
            icon={defaultIcon}
            popupContent={<UserLocationPopup />}
          />
        )}
      </MapLayout>
    </Box>
  );
};

export default MapComponent;
