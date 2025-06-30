import MenuLateral from "../../../../components/sica/MenuLateral/MenuLateral"
import { useValidarToken } from "../../../../hooks/useValidarToken/useValidarToken"
import { useValidarRol } from "../../../../hooks/useValidarRol/useValidarRol"
import './Horario.css'

// Página de inicio del SICA para alumnos
export default function Horario(){
    useValidarToken() // El usuario debe haber iniciado sesión
    useValidarRol(['alumno']) // El usuario debe tener permiso para acceder a esta ruta

    return(
        <div className="contenedor-inicio">
            <MenuLateral/>
        </div>
    )
}