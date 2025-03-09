import React from 'react';
import { render, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MapProvider, useMap } from '../MapContext';

// Mock para el hook useGeolocation
jest.mock('../../hooks/useGeolocation', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    userLocation: [10, 20],
    loading: false,
    error: null,
  })),
}));

// Componente de prueba para acceder al contexto
const TestComponent = ({ testFn }) => {
  const mapContext = useMap();
  testFn(mapContext);
  return null;
};

describe('MapContext', () => {
  let mockMap;
  let contextValues;

  beforeEach(() => {
    // Crear un mock para el objeto map de Leaflet
    mockMap = {
      flyTo: jest.fn(),
      zoomIn: jest.fn(),
      zoomOut: jest.fn(),
    };

    // Función para capturar los valores del contexto
    contextValues = null;
    const testFn = (values) => {
      contextValues = values;
    };

    // Renderizar el componente de prueba dentro del proveedor
    render(
      <MapProvider>
        <TestComponent testFn={testFn} />
      </MapProvider>
    );
  });

  test('proporciona los valores y funciones correctos', () => {
    expect(contextValues).toHaveProperty('userLocation');
    expect(contextValues).toHaveProperty('flyToUserLocation');
    expect(contextValues).toHaveProperty('zoomIn');
    expect(contextValues).toHaveProperty('zoomOut');
    expect(contextValues).toHaveProperty('initializeMap');
  });

  test('initializeMap establece el mapa correctamente', () => {
    act(() => {
      contextValues.initializeMap(mockMap);
    });

    // Verificar que el mapa se haya establecido
    expect(contextValues.map).toBe(mockMap);
  });

  test('flyToUserLocation llama a map.flyTo con la ubicación del usuario', () => {
    // Establecer el mapa
    act(() => {
      contextValues.initializeMap(mockMap);
    });

    // Llamar a la función
    act(() => {
      contextValues.flyToUserLocation();
    });

    // Verificar que se llamó a flyTo con los parámetros correctos
    expect(mockMap.flyTo).toHaveBeenCalledWith([10, 20], 13);
  });

  test('zoomIn llama a map.zoomIn', () => {
    // Establecer el mapa
    act(() => {
      contextValues.initializeMap(mockMap);
    });

    // Llamar a la función
    act(() => {
      contextValues.zoomIn();
    });

    // Verificar que se llamó a zoomIn
    expect(mockMap.zoomIn).toHaveBeenCalled();
  });

  test('zoomOut llama a map.zoomOut', () => {
    // Establecer el mapa
    act(() => {
      contextValues.initializeMap(mockMap);
    });

    // Llamar a la función
    act(() => {
      contextValues.zoomOut();
    });

    // Verificar que se llamó a zoomOut
    expect(mockMap.zoomOut).toHaveBeenCalled();
  });

  test('no llama a funciones del mapa si el mapa no está inicializado', () => {
    // No inicializar el mapa

    // Llamar a las funciones
    act(() => {
      contextValues.flyToUserLocation();
      contextValues.zoomIn();
      contextValues.zoomOut();
    });

    // Verificar que no se llamaron las funciones del mapa
    expect(mockMap.flyTo).not.toHaveBeenCalled();
    expect(mockMap.zoomIn).not.toHaveBeenCalled();
    expect(mockMap.zoomOut).not.toHaveBeenCalled();
  });
});
