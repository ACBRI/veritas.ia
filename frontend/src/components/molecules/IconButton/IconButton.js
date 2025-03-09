import React from 'react';
import PropTypes from 'prop-types';
import { IconButton as MuiIconButton, Tooltip } from '@mui/material';
import './IconButton.css';

/**
 * Componente IconButton molecular
 * Botón con icono y tooltip opcional
 */
const IconButton = ({
  icon,
  onClick,
  tooltip = '',
  color = 'primary',
  size = 'medium',
  disabled = false,
  className = '',
  ...props
}) => {
  // Manejador de eventos mejorado
  const handleClick = (event) => {
    console.log('Botón clickeado');
    // Prevenir comportamiento por defecto para evitar conflictos
    event.preventDefault();
    event.stopPropagation();
    
    if (onClick && typeof onClick === 'function') {
      // Llamar al manejador de eventos proporcionado
      onClick(event);
    } else if (onClick) {
      console.warn('onClick no es una función válida');
    }
  };
  const button = (
    <MuiIconButton
      onClick={handleClick}
      color={color}
      size={size}
      disabled={disabled}
      className={`custom-icon-button ${className}`}
      {...props}
    >
      {icon}
    </MuiIconButton>
  );

  if (tooltip) {
    // Si el botón está deshabilitado, envolvemos en un span para evitar el warning de MUI
    return (
      <Tooltip title={tooltip} arrow>
        {disabled ? (
          <span style={{ display: 'inline-block' }}>
            {button}
          </span>
        ) : (
          button
        )}
      </Tooltip>
    );
  }

  return button;
};

IconButton.propTypes = {
  icon: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  tooltip: PropTypes.string,
  color: PropTypes.oneOf(['default', 'primary', 'secondary', 'success', 'error', 'info', 'warning']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  disabled: PropTypes.bool,
  className: PropTypes.string,
};

export default IconButton;
