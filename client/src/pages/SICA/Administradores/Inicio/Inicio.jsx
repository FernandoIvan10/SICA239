import MenuLateral from "../../../../components/sica/MenuLateral/MenuLateral";
import { FaHouseChimney } from "react-icons/fa6";
import { FaFileUpload, FaUsers, FaUserEdit } from "react-icons/fa";
import { TiUserAdd } from "react-icons/ti";
import { IoLogOut } from "react-icons/io5";

// Página de inicio del SICA para administradores
export default function InicioAdmin(){
    const elementos=[
        {titulo: "Inicio", icono:FaHouseChimney, link:'/SICA/administradores/inicio'},
        {titulo: "Subir calificaciones", icono:FaFileUpload, link:'/SICA/administradores/subir-calificaciones'},
        {titulo: "Gestionar usuarios", icono:FaUsers, 
            subelementos:[
                {titulo:"Agregar usuario", icono:TiUserAdd, link:'/SICA/administradores/agregar-usuario'},
                {titulo:"Editar usuario", icono:FaUserEdit, link:'/SICA/administradores/editar-usuario'}
            ]},
        {titulo: "Cerrar sesión", icono:IoLogOut}
    ]

    return(
        <div>
            <MenuLateral elementos={elementos}/>
            <div></div>
        </div>
    )
}