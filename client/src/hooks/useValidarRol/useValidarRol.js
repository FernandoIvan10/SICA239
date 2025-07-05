import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { jwtDecode } from "jwt-decode"

export function useValidarRol(roles) {
    const navigate = useNavigate()

    useEffect(() => {
        const token = localStorage.getItem("token")
        try {
            const tokenDecodificado = jwtDecode(token)
            const tienePermiso = roles.includes(tokenDecodificado.rol)

            if (!tienePermiso) {
                alert('No tienes permiso para entrar a esta ruta')
                navigate('/SICA/iniciar-sesion') // Se redirige a iniciar sesión para que lo redirija a su panel
            }
        } catch (error) {
            navigate('/SICA/iniciar-sesion')
        }
    }, [navigate, roles])
}
