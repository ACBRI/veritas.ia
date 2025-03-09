import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Paper, Typography } from '@mui/material';
import BallotIcon from '@mui/icons-material/Ballot';
import BlockIcon from '@mui/icons-material/Block';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import NoPhotographyIcon from '@mui/icons-material/NoPhotography';
import HelpIcon from '@mui/icons-material/Help';
import WarningIcon from '@mui/icons-material/Warning';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import CampaignIcon from '@mui/icons-material/Campaign';
import DoNotDisturbIcon from '@mui/icons-material/DoNotDisturb';
import GroupsIcon from '@mui/icons-material/Groups';
import './ElectoralOffenseGrid.css';

/**
 * Componente ElectoralOffenseGrid organismo
 * Muestra una cuadrícula de delitos electorales con sus iconos representativos
 */
const ElectoralOffenseGrid = ({ onSelect }) => {
  const offenses = [
    {
      id: 'multiple-vote',
      icon: <BallotIcon fontSize="large" />,
      title: 'Voto múltiple',
      description: 'Emitir más de un voto por parte de una misma persona'
    },
    {
      id: 'obstruction',
      icon: <BlockIcon fontSize="large" />,
      title: 'Obstaculización del proceso',
      description: 'Acciones que impiden o dificultan el normal desarrollo de las votaciones'
    },
    {
      id: 'ballot-destruction',
      icon: <ContentCutIcon fontSize="large" />,
      title: 'Destrucción de papeletas',
      description: 'Daño o destrucción deliberada de las papeletas de votación'
    },
    {
      id: 'vote-photo',
      icon: <NoPhotographyIcon fontSize="large" />,
      title: 'Fotografía del voto',
      description: 'Capturar imágenes del voto emitido'
    },
    {
      id: 'impersonation',
      icon: <HelpIcon fontSize="large" />,
      title: 'Suplantación de identidad',
      description: 'Votar haciéndose pasar por otra persona'
    },
    {
      id: 'intimidation',
      icon: <WarningIcon fontSize="large" />,
      title: 'Intimidación a votantes',
      description: 'Amenazar o coaccionar a los electores'
    },
    {
      id: 'secrecy-violation',
      icon: <VisibilityOffIcon fontSize="large" />,
      title: 'Violación del secreto',
      description: 'Acciones que comprometen la confidencialidad del voto'
    },
    {
      id: 'illegal-propaganda',
      icon: <CampaignIcon fontSize="large" />,
      title: 'Propaganda ilegal',
      description: 'Realizar actividades proselitistas en período prohibido'
    },
    {
      id: 'weapons',
      icon: <DoNotDisturbIcon fontSize="large" />,
      title: 'Portación de armas',
      description: 'Ingresar con armas a los lugares de votación'
    },
    {
      id: 'public-disorder',
      icon: <GroupsIcon fontSize="large" />,
      title: 'Alteración del orden',
      description: 'Provocar disturbios durante el proceso electoral'
    }
  ];

  return (
    <Grid container spacing={2} className="electoral-offense-grid">
      {offenses.map((offense) => (
        <Grid item xs={6} sm={4} md={3} key={offense.id}>
          <Paper 
            className="offense-card" 
            elevation={2}
            onClick={() => onSelect(offense.id)}
          >
            <div className="offense-icon">
              {offense.icon}
            </div>
            <Typography variant="subtitle1" className="offense-title">
              {offense.title}
            </Typography>
            <Typography variant="body2" className="offense-description">
              {offense.description}
            </Typography>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};

ElectoralOffenseGrid.propTypes = {
  onSelect: PropTypes.func.isRequired,
};

export default ElectoralOffenseGrid;
