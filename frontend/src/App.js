import React from 'react';
import MapComponent from './components/MapComponent';
import { Box, CssBaseline, ThemeProvider, createTheme } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#3366cc',
    },
    secondary: {
      main: '#ffcc00',
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ position: 'relative', height: '100vh', width: '100%' }}>
        <MapComponent />
      </Box>
    </ThemeProvider>
  );
}

export default App;