import React from 'react';
import ReportForm from './components/ReportForm';
import MapComponent from './components/MapComponent';
import { Box } from '@mui/material';

function App() {
  return (
    <Box sx={{ padding: 2 }}>
      <h1>Veritas.ai - Reporte de Delitos Electorales</h1>
      <ReportForm />
      <MapComponent />
    </Box>
  );
}

export default App;
