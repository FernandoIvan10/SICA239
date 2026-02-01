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

/**
 * Guarda un nuevo grupo.
 * @param {Object} datos
 * @param {string} datos.nombre
 * @param {string} datos.semestre
 * @param {Array<Object>} datos.materias
 * @returns {Promise<Response>} Respuesta del servidor
 */
export function guardarGrupo(datos) {
    return httpFetch('api/grupos', {
        method: 'POST',
        body: JSON.stringify(datos),
    })
}

/**
 * Elimina un grupo por su ID.
 * @param {string} id 
 * @returns {Promise<Response>} Respuesta del servidor
 */
export function eliminarGrupo(id) {
    return httpFetch(`api/grupos/${id}`, {
        method: 'DELETE',
    })
}