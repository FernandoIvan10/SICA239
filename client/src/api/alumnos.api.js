import { httpFetch } from './http'

/**
 * Guarda un nuevo alumno en la base de datos
 * @param {Object} datos
 * @param {string} datos.matricula
 * @param {string} datos.nombre
 * @param {string} datos.apellido
 * @param {string} datos.grupo
 * @param {Array} datos.materiasRecursadas (Opcional)
 * @returns {Promise<Response>} Respuesta del servidor
 */
export function guardarAlumno(datos) {
    return httpFetch('api/alumnos', {
        method: 'POST',
        body: JSON.stringify(datos),
    })
}