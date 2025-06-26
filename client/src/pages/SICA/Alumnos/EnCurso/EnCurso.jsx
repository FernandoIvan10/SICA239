import MenuLateral from "../../../../components/sica/MenuLateral/MenuLateral"
import { useValidarToken } from "../../../../hooks/useValidarToken/useValidarToken"
import { useValidarRol } from "../../../../hooks/useValidarRol/useValidarRol"
import './EnCurso.css'

// Página de inicio del SICA para consultar las calificaciones del semestre en curso
export default function EnCurso(){
    useValidarToken() // El usuario debe haber iniciado sesión
    useValidarRol('alumno') // El usuario debe tener permiso para acceder a esta ruta

    return(
        <div className="contenedor-inicio">
            <MenuLateral/>
        </div>
    )
}