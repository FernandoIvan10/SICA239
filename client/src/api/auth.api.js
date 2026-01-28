import { httpFetch } from './http'

/**
 * Inicia sesión en el sistema
 * @param {Object} datos
 * @param {string} datos.usuario - Matrícula o RFC
 * @param {string} datos.tipoUsuario - 'alumno' o 'administrador'
 * @param {string} datos.contrasena
 * @returns {Promise<Object>} Datos de la sesión
 */
export function iniciarSesion(datos) {
    return httpFetch('api/auth/login', {
        method: 'POST',
        body: JSON.stringify(datos),
    })
}