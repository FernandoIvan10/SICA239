import { httpFetch } from './http'

/**
 * Obtiene la lista de calificaciones del sistema.
 * @param {Object} filtros
 * @param {string} filtros.grupoId ID del grupo para filtrar calificaciones
 * @returns {Promise<Response>} Respuesta del servidor
 */
export function obtenerCalificaciones(filtros = {}) {
    const params = new URLSearchParams()
    
    Object.entries(filtros).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
            params.append(key, value)
        }
    })

    const query = params.toString()
    const url = query ? `api/calificaciones?${query}` : 'api/calificaciones'

    return httpFetch(url, {
        method: 'GET',
    })
}

/**
 * Captura una calificación para un alumno.
 * @param {Object} datos
 * @param {string} datos.alumnoId
 * @param {string} datos.materiaId
 * @param {string} datos.grupoId
 * @param {string} datos.parcialInput
 * @param {number} datos.nota
 * @returns {Promise<Response>} Respuesta del servidor
 */
export function capturarCalificacion(datos) {
    return httpFetch(`api/calificaciones/`, {
        method: 'POST',
        body: JSON.stringify(datos),
    })
}