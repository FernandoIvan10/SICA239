import { httpFetch } from './http'

/**
 * Obtiene la lista de alumnos del sistema.
 * @returns {Promise<Response>} Respuesta del servidor
 */
export function obtenerAlumnos() {
    return httpFetch('api/alumnos', {
        method: 'GET',
    })
}

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

/**
 * Reinicia la contraseña de un alumno a su valor por defecto (Matrícula)
 * @param {string} id ID del alumno
 * @returns {Promise<Response>} Respuesta del servidor
 */
export function reiniciarContrasenaAlumno(id) {
    return httpFetch(`api/alumnos/${id}/contrasena/reinicio`, {
        method: 'PUT',
    })
}

/**
 * Cambia el estado activo/inactivo de un alumno
 * @param {string} id ID del alumno
 * @returns {Promise<Response>} Respuesta del servidor
 */
export function cambiarEstadoAlumno(id) {
    return httpFetch(`api/alumnos/${id}/estado`, {
        method: 'PUT',
    })
}