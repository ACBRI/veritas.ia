import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import MapControls from '../../../organisms/MapControls/MapControls';

describe('MapControls Component', () => {
  // Funciones mock para las props
  const mockOnLocateUser = jest.fn();
  const mockOnZoomIn = jest.fn();
  const mockOnZoomOut = jest.fn();

  // Configuración básica para cada prueba
  const renderComponent = (props = {}) => {
    const defaultProps = {
      onLocateUser: mockOnLocateUser,
      onZoomIn: mockOnZoomIn,
      onZoomOut: mockOnZoomOut,
      ...props,
    };
    return render(<MapControls {...defaultProps} />);
  };

  beforeEach(() => {
    // Limpiar los mocks antes de cada prueba
    jest.clearAllMocks();
  });

  test('renderiza correctamente con todos los botones habilitados', () => {
    renderComponent();
    
    // Verificar que los botones estén presentes
    expect(screen.getByTestId('locate-button')).toBeInTheDocument();
    expect(screen.getByTestId('zoom-in-button')).toBeInTheDocument();
    expect(screen.getByTestId('zoom-out-button')).toBeInTheDocument();
    
    // Verificar que los botones estén habilitados
    expect(screen.getByTestId('locate-button')).not.toBeDisabled();
    expect(screen.getByTestId('zoom-in-button')).not.toBeDisabled();
    expect(screen.getByTestId('zoom-out-button')).not.toBeDisabled();
  });

  test('llama a onLocateUser cuando se hace clic en el botón de ubicación', () => {
    renderComponent();
    
    // Simular clic en el botón de ubicación
    fireEvent.click(screen.getByTestId('locate-button'));
    
    // Verificar que se llamó a la función
    expect(mockOnLocateUser).toHaveBeenCalledTimes(1);
  });

  test('llama a onZoomIn cuando se hace clic en el botón de acercar', () => {
    renderComponent();
    
    // Simular clic en el botón de zoom in
    fireEvent.click(screen.getByTestId('zoom-in-button'));
    
    // Verificar que se llamó a la función
    expect(mockOnZoomIn).toHaveBeenCalledTimes(1);
  });

  test('llama a onZoomOut cuando se hace clic en el botón de alejar', () => {
    renderComponent();
    
    // Simular clic en el botón de zoom out
    fireEvent.click(screen.getByTestId('zoom-out-button'));
    
    // Verificar que se llamó a la función
    expect(mockOnZoomOut).toHaveBeenCalledTimes(1);
  });

  test('deshabilita el botón de ubicación cuando disableLocate es true', () => {
    renderComponent({ disableLocate: true });
    
    // Verificar que el botón esté deshabilitado
    expect(screen.getByTestId('locate-button')).toBeDisabled();
    
    // Simular clic en el botón deshabilitado
    fireEvent.click(screen.getByTestId('locate-button'));
    
    // Verificar que no se llamó a la función
    expect(mockOnLocateUser).not.toHaveBeenCalled();
  });

  test('deshabilita el botón de zoom in cuando disableZoomIn es true', () => {
    renderComponent({ disableZoomIn: true });
    
    // Verificar que el botón esté deshabilitado
    expect(screen.getByTestId('zoom-in-button')).toBeDisabled();
    
    // Simular clic en el botón deshabilitado
    fireEvent.click(screen.getByTestId('zoom-in-button'));
    
    // Verificar que no se llamó a la función
    expect(mockOnZoomIn).not.toHaveBeenCalled();
  });

  test('deshabilita el botón de zoom out cuando disableZoomOut es true', () => {
    renderComponent({ disableZoomOut: true });
    
    // Verificar que el botón esté deshabilitado
    expect(screen.getByTestId('zoom-out-button')).toBeDisabled();
    
    // Simular clic en el botón deshabilitado
    fireEvent.click(screen.getByTestId('zoom-out-button'));
    
    // Verificar que no se llamó a la función
    expect(mockOnZoomOut).not.toHaveBeenCalled();
  });
});
