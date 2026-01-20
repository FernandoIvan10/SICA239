import {Navigate, Outlet} from "react-router-dom"
import {useAuth} from "../auth/useAuth"

// Componente que protege rutas basado en autenticación y roles
export function RequiereRol({roles, children}) {
    const {user, loading} = useAuth()
    if (loading) return null

    if(!user) { // Se necesita iniciar sesión
        return <Navigate to="/SICA/iniciar-sesion" replace />
    }

    if(user.requiereCambioContrasena) { // Se necesita cambiar la contraseña por primera vez
        return <Navigate to="/SICA/primer-cambio-contrasena" replace />
    }

    if(roles && !roles.includes(user.rol)) { // Se necesita un rol con permisos
        return <Navigate to="/SICA/iniciar-sesion" replace />
    }

    if(!children) { // Renderizar rutas hijas
        return <Outlet />
    }

    return children // Renderizar componente protegido
}