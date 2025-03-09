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
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    offenseType: '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Limpiar error cuando el usuario comienza a escribir
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'El título es requerido';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es requerida';
    }
    
    if (!formData.category) {
      newErrors.category = 'Selecciona una categoría';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
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
        
        <Typography variant="subtitle1" id="report-form-description" gutterBottom>
          Selecciona el tipo de delito electoral y completa los detalles
        </Typography>

        <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
          Tipo de Delito Electoral
        </Typography>
        <ElectoralOffenseGrid />
        
        <Divider sx={{ my: 3 }} />
        
        <Typography variant="h6" gutterBottom>
          Detalles del Reporte
        </Typography>

        <form onSubmit={handleSubmit} className="report-form">
        <FormField
          type="text"
          name="title"
          label="Título"
          value={formData.title}
          onChange={handleChange}
          placeholder="Ingresa un título descriptivo"
          required
          error={!!errors.title}
          helperText={errors.title}
        />
        
        <FormField
          type="textarea"
          name="description"
          label="Descripción"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe el reporte con detalle"
          rows={4}
          required
          error={!!errors.description}
          helperText={errors.description}
        />
        

        
        <Box className="form-actions">
          <Button 
            variant="outlined" 
            onClick={onCancel}
            color="secondary"
          >
            Cancelar
          </Button>
          <Button 
            type="submit" 
            variant="contained"
            color="primary"
          >
            Enviar Reporte
          </Button>
        </Box>
        </form>
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
