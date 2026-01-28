import { httpFetch } from './http'

/**
 * Obtiene la lista de grupos.
 * @returns {Promise<Response>} Respuesta del servidor
 */
export function obtenerGrupos() {
    return httpFetch('api/grupos', {
        method: 'GET',
    })
}