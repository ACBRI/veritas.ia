import React from 'react';
import PropTypes from 'prop-types';
import { Marker, Popup } from 'react-leaflet';
import { Box, Typography, Badge } from '@mui/material';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { renderToStaticMarkup } from 'react-dom/server';
import { divIcon } from 'leaflet';

// Importar los mismos iconos que usamos en ElectoralOffenseGrid
import BallotIcon from '@mui/icons-material/Ballot';
import BlockIcon from '@mui/icons-material/Block';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import NoPhotographyIcon from '@mui/icons-material/NoPhotography';
import HelpIcon from '@mui/icons-material/Help';
import WarningIcon from '@mui/icons-material/Warning';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import CampaignIcon from '@mui/icons-material/Campaign';
import GppBadIcon from '@mui/icons-material/GppBad';

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

  // Mapeo de tipos de delitos a iconos
  const offenseIcons = {
    'multiple-vote': BallotIcon,
    'weapons': GppBadIcon,
    'voter-coercion': BlockIcon,
    'ballot-destruction': ContentCutIcon,
    'photography': NoPhotographyIcon,
    'impersonation': VisibilityOffIcon,
    'propaganda': CampaignIcon,
    'intimidation': WarningIcon,
    'other': HelpIcon
  };

  // Obtener el componente de icono correcto
  const IconComponent = offenseIcons[report.offenseType] || HelpIcon;

  // Crear el icono personalizado con el componente de Material-UI
  const icon = divIcon({
    html: renderToStaticMarkup(
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          backgroundColor: 'white',
          boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
          border: '2px solid #1976d2'
        }}
        className={isRecent ? 'pulse-animation' : ''}
      >
        <IconComponent 
          sx={{ 
            color: '#1976d2',
            fontSize: '24px'
          }} 
        />
      </Box>
    ),
    className: '',
    iconSize: [40, 40],
    iconAnchor: [20, 20]
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
