import React from 'react';
import PropTypes from 'prop-types';
import { Box } from '@mui/material';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import IconButton from '../../molecules/IconButton/IconButton';
import './MapControls.css';

/**
 * Componente MapControls organismo
 * Agrupa los controles de navegación del mapa
 */
const MapControls = ({
  onLocateUser,
  onZoomIn,
  onZoomOut,
  disableLocate = false,
  disableZoomIn = false,
  disableZoomOut = false,
}) => {
  return (
    <Box className="map-controls">
      <Box className="map-controls-group">
        <IconButton
          icon={<MyLocationIcon />}
          onClick={onLocateUser}
          tooltip="Mi ubicación"
          disabled={disableLocate}
          className="locate-button"
        />
      </Box>
      
      <Box className="map-controls-group">
        <IconButton
          icon={<AddIcon />}
          onClick={onZoomIn}
          tooltip="Acercar"
          disabled={disableZoomIn}
          className="zoom-button"
        />
        <IconButton
          icon={<RemoveIcon />}
          onClick={onZoomOut}
          tooltip="Alejar"
          disabled={disableZoomOut}
          className="zoom-button"
        />
      </Box>
    </Box>
  );
};

MapControls.propTypes = {
  onLocateUser: PropTypes.func.isRequired,
  onZoomIn: PropTypes.func.isRequired,
  onZoomOut: PropTypes.func.isRequired,
  disableLocate: PropTypes.bool,
  disableZoomIn: PropTypes.bool,
  disableZoomOut: PropTypes.bool,
};

export default MapControls;
