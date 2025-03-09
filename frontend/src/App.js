import React from 'react';
import { Box, CssBaseline, ThemeProvider } from '@mui/material';
import MapComponent from './components/MapComponent';
import { MapProvider } from './context/MapContext';
import theme from './styles/theme';

/**
 * Componente principal de la aplicación
 * Utiliza el patrón de Provider para proporcionar contexto a los componentes hijos
 */
function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <MapProvider>
        <Box sx={{ position: 'relative', height: '100vh', width: '100%' }}>
          <MapComponent />
        </Box>
      </MapProvider>
    </ThemeProvider>
  );
}

export default App;
