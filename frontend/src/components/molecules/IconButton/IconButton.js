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
  const button = (
    <MuiIconButton
      onClick={onClick}
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
    return (
      <Tooltip title={tooltip} arrow>
        {button}
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
