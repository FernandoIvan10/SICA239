import { httpFetch } from './http'

export function iniciarSesion(datos) {
    return httpFetch('api/auth/login', {
        method: 'POST',
        body: JSON.stringify(datos),
    })
}