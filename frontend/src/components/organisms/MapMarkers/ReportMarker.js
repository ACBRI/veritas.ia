import React from 'react';
import PropTypes from 'prop-types';
import { Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import { Box, Typography, Badge } from '@mui/material';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

const ReportMarker = ({ report, userLocation }) => {
  // Calcular si el reporte es reciente (menos de 24 horas)
  const isRecent = (new Date() - new Date(report.timestamp)) < 24 * 60 * 60 * 1000;
  
  // Calcular distancia al usuario si hay ubicación
  const getDistance = () => {
    if (!userLocation) return null;
    
    const R = 6371; // Radio de la Tierra en km
    const lat1 = userLocation[0] * Math.PI / 180;
    const lat2 = report.position.coords.latitude * Math.PI / 180;
    const dLat = lat2 - lat1;
    const dLon = (report.position.coords.longitude - userLocation[1]) * Math.PI / 180;
    
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
             Math.cos(lat1) * Math.cos(lat2) * 
             Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    
    return distance;
  };

  // Solo mostrar si está dentro del radio de 5km
  const distance = getDistance();
  if (distance && distance > 5) return null;

  // Crear el icono personalizado según el tipo de delito
  const icon = new Icon({
    iconUrl: `/icons/${report.offenseType}.svg`,
    iconSize: [30, 30],
    className: isRecent ? 'pulse-animation' : ''
  });

  return (
    <Marker
      position={[report.position.coords.latitude, report.position.coords.longitude]}
      icon={icon}
    >
      <Popup>
        <Box sx={{ p: 1 }}>
          <Typography variant="subtitle1" gutterBottom>
            {report.offenseTitle}
            {isRecent && (
              <Badge 
                color="error" 
                badgeContent="Nuevo"
                sx={{ ml: 1 }}
              />
            )}
          </Typography>
          
          <Typography variant="body2" color="text.secondary">
            Reportado: {formatDistanceToNow(new Date(report.timestamp), { 
              addSuffix: true,
              locale: es 
            })}
          </Typography>

          {report.confirmations > 0 && (
            <Typography variant="body2" color="primary">
              ✓ Confirmado por {report.confirmations} usuarios
            </Typography>
          )}

          {distance && (
            <Typography variant="body2" color="text.secondary">
              A {distance.toFixed(1)} km de tu ubicación
            </Typography>
          )}
        </Box>
      </Popup>
    </Marker>
  );
};

ReportMarker.propTypes = {
  report: PropTypes.shape({
    offenseType: PropTypes.string.isRequired,
    offenseTitle: PropTypes.string.isRequired,
    position: PropTypes.object.isRequired,
    timestamp: PropTypes.string.isRequired,
    confirmations: PropTypes.number
  }).isRequired,
  userLocation: PropTypes.array
};

export default ReportMarker;
