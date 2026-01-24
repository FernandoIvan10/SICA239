import {Navigate, Outlet} from "react-router-dom"
import {useAuth} from "../auth/useAuth"
import Cargando from "../components/sica/Cargando/Cargando"

// Componente para proteger rutas que requieren autenticación
export function RequiereAuth() {
  const { usuario, cargando } = useAuth()

  if (cargando) return <Cargando mensaje="Verificando autenticación..." />

  if (!usuario) {
    return <Navigate to="/SICA/iniciar-sesion" replace />
  }

  return <Outlet />
}