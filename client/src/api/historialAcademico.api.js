import { httpFetch } from './http'

export function guardarHistorialAcademico() {
    return httpFetch('api/historial-academico', {
        method: 'POST',
    })
}