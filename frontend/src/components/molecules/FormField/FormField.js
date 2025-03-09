import React from 'react';
import PropTypes from 'prop-types';
import { FormControl, FormHelperText } from '@mui/material';
import Input from '../../atoms/Input/Input';
import Select from '../../atoms/Select/Select';
import TextArea from '../../atoms/TextArea/TextArea';
import './FormField.css';

/**
 * Componente FormField molecular
 * Agrupa un campo de formulario con su etiqueta y mensaje de ayuda
 */
const FormField = ({
  type = 'text',
  name,
  label,
  value,
  onChange,
  options = [],
  placeholder,
  required = false,
  disabled = false,
  error = false,
  helperText = '',
  className = '',
  ...props
}) => {
  const renderField = () => {
    switch (type) {
      case 'select':
        return (
          <Select
            name={name}
            label={label}
            value={value}
            onChange={onChange}
            options={options}
            required={required}
            disabled={disabled}
            error={error}
            helperText=""
            {...props}
          />
        );
      case 'textarea':
        return (
          <TextArea
            name={name}
            label={label}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            error={error}
            helperText=""
            {...props}
          />
        );
      default:
        return (
          <Input
            name={name}
            label={label}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            type={type}
            required={required}
            disabled={disabled}
            error={error}
            helperText=""
            {...props}
          />
        );
    }
  };

  return (
    <FormControl 
      component="fieldset" 
      className={`form-field ${className}`}
      error={error}
      required={required}
      disabled={disabled}
      fullWidth
    >
      {renderField()}
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};

FormField.propTypes = {
  type: PropTypes.oneOf(['text', 'email', 'password', 'number', 'tel', 'date', 'textarea', 'select']),
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      label: PropTypes.string.isRequired,
    })
  ),
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  error: PropTypes.bool,
  helperText: PropTypes.string,
  className: PropTypes.string,
};

export default FormField;
