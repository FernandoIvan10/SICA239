import { httpFetch } from './http'

/**
 * Obtiene la lista de administradores del sistema.
 * @returns {Promise<Response>} Respuesta del servidor
 */
export function obtenerAdministradores() {
    return httpFetch('api/admins', {
        method: 'GET',
    })
}

/**
 * Guarda un nuevo administrador en la base de datos
 * @param {Object} datos
 * @param {string} datos.rfc
 * @param {string} datos.nombre
 * @param {string} datos.apellido
 * @param {string} datos.contrasena
 * @param {string} datos.rol
 * @returns {Promise<Response>} Respuesta del servidor
 */
export function guardarAdministrador(datos) {
    return httpFetch('api/admins', {
        method: 'POST',
        body: JSON.stringify(datos),
    })
}

/**
 * Reinicia la contraseña de un administrador a su valor por defecto (RFC)
 * @param {string} id ID del administrador
 * @returns {Promise<Response>} Respuesta del servidor
 */
export function reiniciarContrasenaAdministrador(id) {
    return httpFetch(`api/admins/${id}/contrasena/reinicio`, {
        method: 'PUT',
    })
}