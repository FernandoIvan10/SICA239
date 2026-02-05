import { httpFetch } from './http'

/**
 * Obtiene la lista de horarios.
 * @returns {Promise<Response>} Respuesta del servidor
 */
export function obtenerHorarios() {
    return httpFetch('api/horarios', {
        method: 'GET',
    })
}

/**
 * Guarda un nuevo horario.
 * @param {FormData} datos
 * @param {File} datos.imagen - Archivo de imagen del horario
 * @param {string} datos.grupoId - ID del grupo asociado al horario
 * @returns {Promise<Response>} Respuesta del servidor
 */
export function guardarHorario(datos) {
    return httpFetch('api/horarios', {
        method: 'POST',
        body: datos
    })
}

/**
 * Elimina un horario por su ID.
 * @param {string} horarioId 
 * @returns {Promise<Response>} Respuesta del servidor
 */
export function eliminarHorario(horarioId) {
    return httpFetch(`api/horarios/${horarioId}`, {
        method: 'DELETE',
    })
}