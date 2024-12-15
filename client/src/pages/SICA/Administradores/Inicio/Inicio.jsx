import MenuLateral from "../../../../components/sica/MenuLateral/MenuLateral";
import { FaHouseChimney } from "react-icons/fa6";
import { FaFileUpload, FaUsers, FaUserEdit, FaLayerGroup } from "react-icons/fa";
import { TiUserAdd } from "react-icons/ti";
import { IoLogOut } from "react-icons/io5";
import Bienvenida from "../../../../components/sica/Bienvenida/Bienvenida";
import "./Inicio.css"

// Página de inicio del SICA para administradores
export default function InicioAdmin(){
    const elementos=[ // Elementos del menú
        {titulo: "Inicio", icono:FaHouseChimney, link:'/SICA/administradores/inicio'},
        {titulo: "Subir calificaciones", icono:FaFileUpload, link:'/SICA/administradores/subir-calificaciones'},
        {titulo: "Gestionar usuarios", icono:FaUsers, 
            subelementos:[
                {titulo:"Agregar usuario", icono:TiUserAdd, link:'/SICA/administradores/agregar-usuario'},
                {titulo:"Ver usuarios", icono:FaUserEdit, link:'/SICA/administradores/ver-usuarios'},
            ]},
        {titulo: "Gestionar grupos", icono:FaLayerGroup, link:'/SICA/administradores/gestionar-grupos'},
        {titulo: "Cerrar sesión", icono:IoLogOut, link:'/inicio'},
    ]

    return(
        <div className="contenedor-inicio">
            <MenuLateral elementos={elementos}/>
            <Bienvenida 
                nombre="[NOMBRE]" 
                descripcion="Este es el sistema de calificaciones, aquí podrás gestionar los usuarios,
                gestionar los grupos y subir calificaciones."
                boton1="Subir calificaciones"
                boton2="Gestionar usuarios"
            />
        </div>
    )
}