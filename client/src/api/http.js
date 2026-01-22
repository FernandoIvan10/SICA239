const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Función para realizar solicitudes HTTP (API Fetch)
export async function httpFetch(endpoint, options = {}) {
    const token = localStorage.getItem('token')

    const headers = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...(options.headers || {}),
    }

    const res = await fetch(`${API_URL}/${endpoint}`, {
        ...options,
        headers,
    })

    if(!res.ok) {
        const error = await res.json().catch(() => null);
        throw {
            status: res.status,
            message: error?.message || 'Error en la solicitud',
        }
    }

    return res.json().catch(() => null);
}