import { Navigate, Outlet } from 'react-router-dom'
import {jwtDecode} from 'jwt-decode'

export default function RutaProtegida() {
  const token = localStorage.getItem('token')

  if (!token) return <Navigate to="/SICA/iniciar-sesion" replace />

  try {
    const decoded = jwtDecode(token)

    if (decoded.requiereCambioContrasena) {
      return <Navigate to="/SICA/primer-cambio-contrasena" replace />
    }

    return <Outlet />
  } catch {
    localStorage.removeItem('token')
    return <Navigate to="/SICA/iniciar-sesion" replace />
  }
}