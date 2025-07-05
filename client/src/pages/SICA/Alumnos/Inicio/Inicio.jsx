import MenuLateral from "../../../../components/sica/MenuLateral/MenuLateral"
import Bienvenida from "../../../../components/sica/Bienvenida/Bienvenida"
import { useValidarToken } from "../../../../hooks/useValidarToken/useValidarToken"
import { useValidarRol } from "../../../../hooks/useValidarRol/useValidarRol"
import './Inicio.css'
import { jwtDecode } from "jwt-decode"

// Página de inicio del SICA para alumnos
export default function InicioAlumno(){
    useValidarToken() // El usuario debe haber iniciado sesión
    useValidarRol(['alumno']) // El usuario debe tener permiso para acceder a esta ruta
    
    const token = localStorage.getItem("token") // Token de inicio de sesión
    const tokenDecodificado = jwtDecode(token) // Datos del token

    return(
        <div className="contenedor-inicio">
            <MenuLateral/>
            <Bienvenida 
                nombre={tokenDecodificado.nombre} 
                descripcion="Este es el sistema de calificaciones, aquí podrás consultar tus calificaciones y tu horario"
                textoBoton1="Ver calificaciones"
                linkBoton1="/SICA/alumnos/en-curso"
                textoBoton2="Ver horario"
                linkBoton2="/SICA/alumnos/horario"
            />
        </div>
    )
}