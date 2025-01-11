import {jwtDecode} from "jwt-decode"
import { useEffect } from "react"
import {useNavigate} from "react-router-dom"

export function useValidarToken(){
    const navigate = useNavigate() // Para redireccionar a los usuarios

    useEffect(()=>{
        const token = localStorage.getItem("token") // Token de inicio de sesión
        if(token){ //Valida que exista un token
            try{
                const tokenDecodificado = jwtDecode(token) // Se decodifica el token
                if(tokenDecodificado.exp * 1000 < Date.now()){
                    // Si el token expiró entonces es eliminado
                    localStorage.removeItem("token")
                    navigate("/SICA/iniciar-sesion")
                }
            }catch(error){
                console.error("Error al decodificar el token:",error)
                localStorage.removeItem("token")
                navigate("/SICA/iniciar-sesion")
            }
        } else{
            // Si no existe un login el usuario debe iniciar sesión
            navigate("/SICA/iniciar-sesion")
        }
    },[navigate])
}