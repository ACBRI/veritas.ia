// Configuración de la API
export const API_BASE_URL = 'http://localhost:8000';

// Endpoints específicos
export const ENDPOINTS = {
    reports: '/reports/',
    electoralOffenses: '/electoral-offenses/',
    websocket: 'ws://localhost:8000/ws'
};

// Configuración para las peticiones
export const API_CONFIG = {
    headers: {
        'Content-Type': 'application/json'
    }
};
