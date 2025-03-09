import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { MapProvider } from './context/MapContext';
import { ReportProvider } from './context/ReportContext';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <MapProvider>
      <ReportProvider>
        <App />
      </ReportProvider>
    </MapProvider>
  </React.StrictMode>
);
