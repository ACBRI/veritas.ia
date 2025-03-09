// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Mock para react-leaflet
jest.mock('react-leaflet', () => ({
  MapContainer: jest.fn(({ children }) => <div data-testid="map-container">{children}</div>),
  TileLayer: jest.fn(() => <div data-testid="tile-layer" />),
  Marker: jest.fn(({ children }) => <div data-testid="marker">{children}</div>),
  Popup: jest.fn(({ children }) => <div data-testid="popup">{children}</div>),
  useMap: jest.fn(() => ({
    flyTo: jest.fn(),
    zoomIn: jest.fn(),
    zoomOut: jest.fn(),
  })),
}));

// Mock para el hook de geolocalización
jest.mock('../src/hooks/useGeolocation', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    userLocation: [0, 0],
    loading: false,
    error: null,
  })),
}));
