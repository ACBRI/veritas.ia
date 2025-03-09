import React from 'react';
import PropTypes from 'prop-types';
import { Card as MuiCard, CardContent, CardActions, CardHeader, Typography } from '@mui/material';
import './Card.css';

/**
 * Componente Card molecular
 * Wrapper sobre el componente Card de Material UI con estilos personalizados
 */
const Card = ({
  title,
  subtitle,
  children,
  actions,
  elevation = 0,
  variant = 'outlined',
  className = '',
  ...props
}) => {
  return (
    <MuiCard 
      elevation={elevation} 
      variant={variant} 
      className={`custom-card ${className}`}
      {...props}
    >
      {(title || subtitle) && (
        <CardHeader
          title={title && <Typography variant="h6">{title}</Typography>}
          subheader={subtitle && <Typography variant="body2" color="text.secondary">{subtitle}</Typography>}
        />
      )}
      <CardContent>
        {children}
      </CardContent>
      {actions && (
        <CardActions>
          {actions}
        </CardActions>
      )}
    </MuiCard>
  );
};

Card.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  children: PropTypes.node,
  actions: PropTypes.node,
  elevation: PropTypes.number,
  variant: PropTypes.oneOf(['outlined', 'elevation']),
  className: PropTypes.string,
};

export default Card;
