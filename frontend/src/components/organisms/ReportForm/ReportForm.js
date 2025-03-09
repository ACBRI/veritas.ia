import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Typography } from '@mui/material';
import FormField from '../../molecules/FormField/FormField';
import Button from '../../atoms/Button/Button';
import Card from '../../molecules/Card/Card';
import './ReportForm.css';

/**
 * Componente ReportForm organismo
 * Formulario completo para enviar reportes
 */
const ReportForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
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

  const categoryOptions = [
    { value: '', label: 'Selecciona una categoría' },
    { value: 'incidente', label: 'Incidente' },
    { value: 'sugerencia', label: 'Sugerencia' },
    { value: 'denuncia', label: 'Denuncia' },
    { value: 'otro', label: 'Otro' },
  ];

  return (
    <Card
      title="Nuevo Reporte"
      subtitle="Completa el formulario para enviar un reporte"
      className="report-form-card"
    >
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
        
        <FormField
          type="select"
          name="category"
          label="Categoría"
          value={formData.category}
          onChange={handleChange}
          options={categoryOptions}
          required
          error={!!errors.category}
          helperText={errors.category}
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
    </Card>
  );
};

ReportForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default ReportForm;
