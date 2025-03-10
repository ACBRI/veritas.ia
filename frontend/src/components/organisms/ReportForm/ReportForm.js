import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Box, Modal, Typography, IconButton, Alert } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import TimerIcon from '@mui/icons-material/Timer';
import GpsOffIcon from '@mui/icons-material/GpsOff';
import { useMap } from '../../../context/MapContext';
import { useReport } from '../../../context/ReportContext';
import CloseIcon from '@mui/icons-material/Close';
import Button from '../../atoms/Button/Button';
import ElectoralOffenseGrid from '../ElectoralOffenseGrid/ElectoralOffenseGrid';
import './ReportForm.css';

/**
 * Componente ReportForm organismo
 * Formulario completo para enviar reportes
 */
const ReportForm = ({ open, onSubmit, onCancel }) => {
  const [selectedOffense, setSelectedOffense] = useState(null);
  const [reportLocation, setReportLocation] = useState(null);
  const [error, setError] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);

  const { userLocation, requestUserLocation } = useMap();
  const { submitReport, canMakeNewReport, lastReportTime } = useReport();

  // Actualizar el tiempo restante para poder reportar
  useEffect(() => {
    if (!canMakeNewReport()) {
      const interval = setInterval(() => {
        const waitTime = 5 * 60 * 1000; // 5 minutos en ms
        const elapsed = Date.now() - lastReportTime;
        const remaining = Math.ceil((waitTime - elapsed) / 60000);

        setTimeLeft(remaining);

        if (remaining <= 0) {
          clearInterval(interval);
        }
      }, 1000);

      return () => clearInterval(interval);
    } else {
      setTimeLeft(0);
    }
  }, [lastReportTime, canMakeNewReport]);

  // Cuando el modal se abre, guardamos la ubicación actual
  React.useEffect(() => {
    if (open && userLocation) {
      setReportLocation(userLocation);
    }
  }, [open, userLocation]);
  const handleOffenseSelect = (offenseId) => {
    setSelectedOffense(offenseId);
  };

  const handleSubmit = async () => {
    try {
      setError(null);

      if (!selectedOffense || !reportLocation) {
        return;
      }

      const reportData = {
        offense_type_id: selectedOffense,
        coordinates: {
          latitude: reportLocation[0],
          longitude: reportLocation[1],
          accuracy: reportLocation[2] || 0,
        },
      };

      const enrichedReport = await submitReport(reportData);
      onSubmit(enrichedReport);
      setSelectedOffense(null);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onCancel}
      aria-labelledby="report-form-title"
      aria-describedby="report-form-description"
      className="report-form-modal"
    >
      <Box className="report-form-modal-content">
        <Box className="report-form-header">
          <Typography variant="h5" component="h2" id="report-form-title">
            Nuevo Reporte
          </Typography>
          <IconButton
            aria-label="cerrar"
            onClick={onCancel}
            size="small"
            className="close-button"
          >
            <CloseIcon />
          </IconButton>
        </Box>

        <Typography
          variant="subtitle1"
          id="report-form-description"
          gutterBottom
        >
          Selecciona el tipo de delito electoral que deseas reportar
        </Typography>

        <ElectoralOffenseGrid onSelect={handleOffenseSelect} />

        {/* Alerta de ubicación */}
        {!userLocation && (
          <Alert
            severity="info"
            action={
              <Button
                color="primary"
                size="small"
                variant="text"
                startIcon={<LocationOnIcon />}
                onClick={requestUserLocation}
              >
                Permitir ubicación
              </Button>
            }
          >
            Necesitamos tu ubicación para registrar el reporte
          </Alert>
        )}

        {/* Alerta de precisión GPS */}
        {userLocation && reportLocation && reportLocation[2] > 100 && (
          <Alert severity="warning" icon={<GpsOffIcon />}>
            La precisión GPS no es óptima ({Math.round(reportLocation[2])}m).
            Intenta en un lugar más despejado.
          </Alert>
        )}

        {/* Alerta de timeout */}
        {timeLeft > 0 && (
          <Alert severity="info" icon={<TimerIcon />}>
            Por favor espera {timeLeft} minutos antes de enviar otro reporte
          </Alert>
        )}

        {/* Alerta de error */}
        {error && <Alert severity="error">{error}</Alert>}

        <Box className="form-actions" sx={{ mt: 3 }}>
          <Button variant="outlined" onClick={onCancel} color="secondary">
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            color="primary"
            disabled={
              !selectedOffense ||
              !reportLocation ||
              timeLeft > 0 ||
              (reportLocation && reportLocation[2] > 100)
            }
            startIcon={<LocationOnIcon />}
          >
            Reportar
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

ReportForm.propTypes = {
  open: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default ReportForm;
