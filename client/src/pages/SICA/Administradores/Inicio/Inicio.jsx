import {jwtDecode} from "jwt-decode"
import MenuLateral from "../../../../components/sica/MenuLateral/MenuLateral";
import { FaHouseChimney } from "react-icons/fa6";
import { FaFileUpload, FaUsers, FaUserEdit, FaLayerGroup } from "react-icons/fa";
import { TiUserAdd } from "react-icons/ti";
import { IoLogOut } from "react-icons/io5";
import Bienvenida from "../../../../components/sica/Bienvenida/Bienvenida";
import "./Inicio.css"
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

// Página de inicio del SICA para administradores
export default function InicioAdmin(){
    const navigate = useNavigate() // Para redireccionar a los usuarios
    const [nombre, setNombre] = useState('') // Nombre del usuario

    useEffect(() => {
        const token = localStorage.getItem('token') // Token de inicio de sesión

        // Se valida que el usuario haya iniciado sesión
        if(!token){
            // Si el usuario no ha iniciado sesión es redirigido al login
            navigate('/SICA/iniciar-sesion')
        } else {
            try{
                const tokenDecodificado = jwtDecode(token) // Se decodifica el token
                setNombre(tokenDecodificado.nombre); // Se almacena el nombre en el estado

                if(tokenDecodificado.rol !== 'superadmin'
                    && tokenDecodificado.rol !== 'editor'
                    && tokenDecodificado.rol !== 'lector'){
                        // Si el usuario es un alumno se redirige a su panel
                        navigate('/SICA/alumnos/inicio')
                }
            }catch(error){
                // Si hay algún error se redirige al usuario al inicio de sesión
                navigate('/SICA/iniciar-sesion')
            }
        }
    }, [navigate])

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
                nombre={nombre} 
                descripcion="Este es el sistema de calificaciones, aquí podrás gestionar los usuarios,
                gestionar los grupos y subir calificaciones."
                boton1="Subir calificaciones"
                boton2="Gestionar usuarios"
            />
        </div>
    )
}