import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useMap } from '../context/MapContext';
import MapLayout from './templates/MapLayout/MapLayout';
import MapControlsContainer from './organisms/MapControls/MapControlsContainer';
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
          <MapControlsContainer 
            disableLocate={!userLocation}
          />
        }
        floatingContent={renderReportButton()}
      >
        {userLocation && (
          <MapMarker
            position={userLocation}
            icon={defaultIcon}
            popupContent={<UserLocationPopup />}
          />
        )}
      </MapLayout>

      <ReportForm
        open={showReportForm}
        onSubmit={handleReportSubmit}
        onCancel={handleReportCancel}
      />
    </Box>
  );
};

export default MapComponent;
