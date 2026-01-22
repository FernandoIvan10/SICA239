import {Navigate, Outlet} from "react-router-dom"
import {useAuth} from "../auth/useAuth"

// Componente para proteger rutas que requieren autenticación
export function RequiereAuth() {
  const { usuario, cargando } = useAuth()

  if (cargando) return null

  if (!usuario) {
    return <Navigate to="/SICA/iniciar-sesion" replace />
  }

  return <Outlet />
}