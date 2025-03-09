/**
 * Design Tokens - Sistema de diseño para Veritas.ai
 * Estos tokens definen los valores fundamentales para mantener consistencia en toda la aplicación
 */

// Colores
export const colors = {
  // Colores primarios
  primary: {
    main: '#3366cc',
    light: '#5c85d6',
    dark: '#254a99',
    contrastText: '#ffffff',
  },
  // Colores secundarios
  secondary: {
    main: '#ffcc00',
    light: '#ffd633',
    dark: '#cca300',
    contrastText: '#000000',
  },
  // Colores de estado
  status: {
    success: '#4caf50',
    warning: '#ff9800',
    error: '#f44336',
    info: '#2196f3',
  },
  // Colores neutrales
  neutral: {
    white: '#ffffff',
    black: '#000000',
    gray100: '#f5f5f5',
    gray200: '#eeeeee',
    gray300: '#e0e0e0',
    gray400: '#bdbdbd',
    gray500: '#9e9e9e',
    gray600: '#757575',
    gray700: '#616161',
    gray800: '#424242',
    gray900: '#212121',
  },
};

// Tipografía
export const typography = {
  fontFamily: 'Roboto, sans-serif',
  fontWeights: {
    light: 300,
    regular: 400,
    medium: 500,
    bold: 700,
  },
  fontSize: {
    xs: '0.75rem', // 12px
    sm: '0.875rem', // 14px
    md: '1rem', // 16px
    lg: '1.25rem', // 20px
    xl: '1.5rem', // 24px
    xxl: '2rem', // 32px
    xxxl: '2.5rem', // 40px
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    loose: 1.8,
  },
};

// Espaciado
export const spacing = {
  xs: '0.25rem', // 4px
  sm: '0.5rem', // 8px
  md: '1rem', // 16px
  lg: '1.5rem', // 24px
  xl: '2rem', // 32px
  xxl: '3rem', // 48px
};

// Bordes
export const borders = {
  radius: {
    sm: '0.125rem', // 2px
    md: '0.25rem', // 4px
    lg: '0.5rem', // 8px
    xl: '1rem', // 16px
    circle: '50%',
  },
  width: {
    thin: '1px',
    medium: '2px',
    thick: '4px',
  },
};

// Sombras
export const shadows = {
  sm: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
  md: '0 3px 6px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.12)',
  lg: '0 10px 20px rgba(0, 0, 0, 0.15), 0 3px 6px rgba(0, 0, 0, 0.10)',
  xl: '0 15px 25px rgba(0, 0, 0, 0.15), 0 5px 10px rgba(0, 0, 0, 0.05)',
};

// Transiciones
export const transitions = {
  duration: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
  },
  easing: {
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
};

// Breakpoints para diseño responsive
export const breakpoints = {
  xs: '0px',
  sm: '600px',
  md: '960px',
  lg: '1280px',
  xl: '1920px',
};

// Exportar todos los tokens como un objeto único
const tokens = {
  colors,
  typography,
  spacing,
  borders,
  shadows,
  transitions,
  breakpoints,
};

export default tokens;
