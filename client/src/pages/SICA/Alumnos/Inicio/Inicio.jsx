import MenuLateral from '../../../../components/sica/MenuLateral/MenuLateral'
import Bienvenida from '../../../../components/sica/Bienvenida/Bienvenida'
import { useValidarRol } from '../../../../hooks/useValidarRol/useValidarRol'
import { jwtDecode } from 'jwt-decode'
import '../../../../assets/styles/global.css'

// Página de inicio del SICA para alumnos
export default function InicioAlumno(){
    useValidarRol(['alumno']) // El usuario debe tener permiso para acceder a esta ruta
    
    const token = localStorage.getItem('token') // Token de inicio de sesión
    const tokenDecodificado = jwtDecode(token) // Datos del token

    return(
        <div className="contenedor-principal">
            <MenuLateral/>
            <Bienvenida 
                nombre={tokenDecodificado.nombre} 
                descripcion="Este es el sistema de calificaciones, aquí podrás consultar tus calificaciones y tu horario"
                boton1="Ver calificaciones"
                link1="/SICA/alumnos/en-curso"
                boton2="Ver horario"
                link2="/SICA/alumnos/horario"
            />
        </div>
    )
}