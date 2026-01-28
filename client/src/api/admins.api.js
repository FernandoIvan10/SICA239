import { httpFetch } from './http'

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