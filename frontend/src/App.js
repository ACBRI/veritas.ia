import React from 'react';
import ReportForm from './components/ReportForm';
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
        <Box sx={{ position: 'absolute', top: 16, left: 16, zIndex: 1000 }}>
          <ReportForm />
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;