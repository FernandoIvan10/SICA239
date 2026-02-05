const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

// Función para realizar solicitudes HTTP (API Fetch)
export async function httpFetch(endpoint, options = {}) {
    const token = localStorage.getItem('token')
    const isFormData = options.body instanceof FormData

    const headers = {
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...(options.headers || {}),
    }

    // Solo forzar JSON cuando el body NO es FormData
    if (!isFormData && options.body) {
        headers['Content-Type'] = 'application/json'
    }

    const res = await fetch(`${API_URL}/${endpoint}`, {
        ...options,
        headers,
    })

    if (!res.ok) {
        let errorBody = null
        try {
            errorBody = await res.json()
        } catch (_) {}

        throw {
            status: res.status,
            message: errorBody?.message || 'Error en la solicitud',
        }
    }

    // 204 No Content o respuestas vacías
    if (res.status === 204) return null

    try {
        return await res.json()
    } catch {
        return null
    }
}