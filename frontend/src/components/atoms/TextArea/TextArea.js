import React from 'react';
import PropTypes from 'prop-types';
import { TextField } from '@mui/material';
import './TextArea.css';

/**
 * Componente TextArea atómico
 * Wrapper sobre el componente TextField multiline de Material UI con estilos personalizados
 */
const TextArea = ({
  name,
  label,
  value,
  onChange,
  placeholder,
  rows = 4,
  variant = 'outlined',
  size = 'medium',
  fullWidth = true,
  required = false,
  disabled = false,
  error = false,
  helperText = '',
  className = '',
  ...props
}) => {
  return (
    <TextField
      name={name}
      label={label}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      multiline
      rows={rows}
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      required={required}
      disabled={disabled}
      error={error}
      helperText={helperText}
      className={`custom-textarea ${className}`}
      {...props}
    />
  );
};

TextArea.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  rows: PropTypes.number,
  variant: PropTypes.oneOf(['outlined', 'filled', 'standard']),
  size: PropTypes.oneOf(['small', 'medium']),
  fullWidth: PropTypes.bool,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  error: PropTypes.bool,
  helperText: PropTypes.string,
  className: PropTypes.string,
};

export default TextArea;
