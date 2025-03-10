import { API_BASE_URL, ENDPOINTS, API_CONFIG } from '../config/api';

// Servicio para manejar los reportes
export const ReportService = {
    // Enviar un nuevo reporte
    async createReport(reportData) {
        try {
            const response = await fetch(`${API_BASE_URL}${ENDPOINTS.reports}`, {
                method: 'POST',
                ...API_CONFIG,
                body: JSON.stringify(reportData)
            });

            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error al crear reporte:', error);
            throw new Error('No se pudo enviar el reporte. Por favor intenta nuevamente.');
        }
    },

    // Obtener los tipos de delitos electorales
    async getElectoralOffenses() {
        try {
            const response = await fetch(`${API_BASE_URL}${ENDPOINTS.electoralOffenses}`, {
                method: 'GET',
                ...API_CONFIG
            });

            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error al obtener tipos de delitos:', error);
            throw new Error('No se pudieron cargar los tipos de delitos electorales.');
        }
    }
};
