import MenuLateral from '../../../../components/sica/MenuLateral/MenuLateral'
import Bienvenida from '../../../../components/sica/Bienvenida/Bienvenida'
import { useAuth } from '../../../../auth/useAuth'
import '../../../../assets/styles/global.css'

// Página de inicio del SICA para alumnos
export default function InicioAlumno(){
    const {usuario} = useAuth() // Usuario autenticado

    // Si usuario no existe, no renderizar nada aún
    if (!usuario) return <div></div>

    return(
        <div className="contenedor-principal">
            <MenuLateral/>
            <Bienvenida 
                nombre={usuario.nombre} 
                mensaje="Este es el sistema de calificaciones, aquí podrás consultar tus calificaciones y tu horario"
                boton1="Ver calificaciones"
                link1="/SICA/alumnos/en-curso"
                boton2="Ver horario"
                link2="/SICA/alumnos/horario"
            />
        </div>
    )
}