import { httpFetch } from './http'

/**
 * Obtiene la lista de alumnos del sistema.
 * @param {Object} filtros Filtros opcionales para la consulta
 * @param {string} filtros.grupoId ID del grupo para filtrar alumnos
 * @returns {Promise<Response>} Respuesta del servidor
 */
export function obtenerAlumnos(filtros = {}) {
    const params = new URLSearchParams()

    Object.entries(filtros).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
            params.append(key, value)
        }
    })

    const query = params.toString()
    const url = query ? `api/alumnos?${query}` : 'api/alumnos'

    return httpFetch(url, {
        method: 'GET',
    })
}

/**
 * Obtiene un alumno por su ID.
 * @param {string} id 
 * @returns {Promise<Response>} Respuesta del servidor
 */
export function obtenerAlumnoPorId(id) {
    return httpFetch(`api/alumnos/${id}`, {
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
 * Edita un alumno existente
 * @param {string} id 
 * @param {Object} datos 
 * @param {string} datos.matricula
 * @param {string} datos.nombre
 * @param {string} datos.apellido
 * @param {string} datos.grupo
 * @param {Array} datos.materiasRecursadas (Opcional)
 * @returns {Promise<Response>} Respuesta del servidor
 */
export function editarAlumno(id, datos) {
    return httpFetch(`api/alumnos/${id}`, {
        method: 'PUT',
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