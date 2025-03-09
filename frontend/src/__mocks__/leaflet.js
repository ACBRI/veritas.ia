// Mock para Leaflet
const L = {
  map: jest.fn(() => ({
    setView: jest.fn(),
    remove: jest.fn(),
    flyTo: jest.fn(),
    zoomIn: jest.fn(),
    zoomOut: jest.fn(),
    on: jest.fn(),
    off: jest.fn(),
  })),
  marker: jest.fn(() => ({
    addTo: jest.fn().mockReturnThis(),
    bindPopup: jest.fn().mockReturnThis(),
    setLatLng: jest.fn().mockReturnThis(),
    remove: jest.fn(),
  })),
  icon: jest.fn(() => ({})),
  tileLayer: jest.fn(() => ({
    addTo: jest.fn(),
  })),
  DomEvent: {
    stopPropagation: jest.fn(),
    disableScrollPropagation: jest.fn(),
    disableClickPropagation: jest.fn(),
  },
  latLng: jest.fn((lat, lng) => [lat, lng]),
};

module.exports = L;
