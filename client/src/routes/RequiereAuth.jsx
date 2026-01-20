import {Navigate, Outlet} from "react-router-dom"
import {useAuth} from "../context/AuthProvider/AuthProvider.jsx"

export function RequiereAuth() {
  const { user, loading } = useAuth()

  if (loading) return null

  if (!user) {
    return <Navigate to="/SICA/iniciar-sesion" replace />
  }

  return <Outlet />
}