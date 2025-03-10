import React from 'react';
import { Box, Typography, Button, Snackbar } from '@mui/material';
import { useMap } from '../context/MapContext';
import { useReport } from '../context/ReportContext';
import MapLayout from './templates/MapLayout/MapLayout';
import MapControlsContainer from './organisms/MapControls/MapControlsContainer';
import MapMarker from './molecules/MapMarker/MapMarker';
import ReportForm from './organisms/ReportForm/ReportForm';
import ReportMarkersLayer from './organisms/MapMarkers/ReportMarkersLayer';
import './organisms/MapMarkers/ReportMarker.css';
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
  
  const { submitReport } = useReport();
  const [snackbarMessage, setSnackbarMessage] = React.useState('');

  const [showReportForm, setShowReportForm] = React.useState(false);

  const handleReportSubmit = async (reportDetails) => {
    try {
      await submitReport(reportDetails);
      setSnackbarMessage('Reporte enviado correctamente');
      setShowReportForm(false);
    } catch (error) {
      setSnackbarMessage(error.message);
    }
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
          <>
            <MapMarker
              position={userLocation}
              icon={defaultIcon}
              popupContent={<UserLocationPopup />}
            />
            <ReportMarkersLayer />
          </>
        )}
      </MapLayout>

      <ReportForm
        open={showReportForm}
        onSubmit={handleReportSubmit}
        onCancel={handleReportCancel}
      />
      
      <Snackbar
        open={!!snackbarMessage}
        autoHideDuration={6000}
        onClose={() => setSnackbarMessage('')}
        message={snackbarMessage}
      />
    </Box>
  );
};

export default MapComponent;
