import MenuLateral from "../../../../components/sica/MenuLateral/MenuLateral";
import { FaHouseChimney } from "react-icons/fa6";
import { MdGrade } from "react-icons/md";
import { PiMedalFill } from "react-icons/pi";
import { FaHistory, FaUserCircle, FaKey } from "react-icons/fa";
import { RiCalendarScheduleFill } from "react-icons/ri";
import { IoLogOut } from "react-icons/io5";
import Bienvenida from "../../../../components/sica/Bienvenida/Bienvenida";
import './Inicio.css'

// Página de inicio del SICA para alumnos
export default function InicioAlumno(){
    const elementos=[
        {titulo:"Inicio", icono:FaHouseChimney, link:'/SICA/alumnos/inicio'},
        {titulo:"Calificaciones", icono:MdGrade, subelementos:[
            {titulo:"En curso", icono:PiMedalFill, link:'/SICA/alumnos/en-curso'},
            {titulo:"Historial",icono:FaHistory, link:'/SICA/alumnos/historial'}
        ]},
        {titulo:"Horario", icono:RiCalendarScheduleFill, link:'/SICA/alumnos/horario'},
        {titulo:"Usuario", icono:FaUserCircle, subelementos:[
            {titulo:"Cambiar contraseña", icono:FaKey, link:'/SICA/alumnos/cambiar-contraseña'},
            {titulo:"Cerrar sesión", icono:IoLogOut, link:'/inicio'}
        ]}
    ]

    return(
        <div className="contenedor-inicio">
            <MenuLateral elementos={elementos}/>
            <Bienvenida 
                nombre="[NOMBRE]" 
                descripcion="Este es el sistema de calificaciones, aquí podrás..."
                boton1="Ver calificaciones"
                boton2="Ver horario"
            />
        </div>
    )
}