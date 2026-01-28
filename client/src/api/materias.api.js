import { httpFetch } from './http'

/**
 * Obtiene la lista de materias.
 * @returns {Promise<Response>} Respuesta del servidor
 */
export function obtenerMaterias() {
    return httpFetch('api/materias', {
        method: 'GET',
    })
}