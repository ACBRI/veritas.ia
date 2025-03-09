import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Modal, Typography, IconButton, Divider } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import FormField from '../../molecules/FormField/FormField';
import Button from '../../atoms/Button/Button';
import ElectoralOffenseGrid from '../ElectoralOffenseGrid/ElectoralOffenseGrid';
import './ReportForm.css';

/**
 * Componente ReportForm organismo
 * Formulario completo para enviar reportes
 */
const ReportForm = ({ open, onSubmit, onCancel }) => {
  const handleOffenseSelect = (offenseId) => {
    onSubmit({ offenseType: offenseId });
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
        
        <Typography variant="subtitle1" id="report-form-description" gutterBottom>
          Selecciona el tipo de delito electoral que deseas reportar
        </Typography>

        <ElectoralOffenseGrid onSelect={handleOffenseSelect} />
        
        <Box className="form-actions" sx={{ mt: 3 }}>
          <Button 
            variant="outlined" 
            onClick={onCancel}
            color="secondary"
          >
            Cancelar
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
