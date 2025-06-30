import MenuLateral from "../../../../components/sica/MenuLateral/MenuLateral"
import Bienvenida from "../../../../components/sica/Bienvenida/Bienvenida"
import { useValidarToken } from "../../../../hooks/useValidarToken/useValidarToken"
import { useValidarRol } from "../../../../hooks/useValidarRol/useValidarRol"
import './Inicio.css'

// Página de inicio del SICA para alumnos
export default function InicioAlumno(){
    useValidarToken() // El usuario debe haber iniciado sesión
    useValidarRol(['alumno']) // El usuario debe tener permiso para acceder a esta ruta

    return(
        <div className="contenedor-inicio">
            <MenuLateral/>
            <Bienvenida 
                nombre="[NOMBRE]" 
                descripcion="Este es el sistema de calificaciones, aquí podrás..."
                boton1="Ver calificaciones"
                boton2="Ver horario"
            />
        </div>
    )
}