import {jwtDecode} from "jwt-decode"
import MenuLateral from "../../../../components/sica/MenuLateral/MenuLateral";
import Bienvenida from "../../../../components/sica/Bienvenida/Bienvenida";
import "./Inicio.css"
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useValidarToken } from "../../../../hooks/useValidarToken/useValidarToken";

import { FaHouseChimney } from "react-icons/fa6";
import { FaFileUpload, FaUsers, FaUserEdit, FaLayerGroup } from "react-icons/fa";
import { TiUserAdd } from "react-icons/ti";
import { IoLogOut } from "react-icons/io5";
import { MdGroupAdd, MdGroups } from "react-icons/md";
import { RiCalendarScheduleFill } from "react-icons/ri";

// Página de inicio del SICA para administradores
export default function InicioAdmin(){
    const navigate = useNavigate() // Para redireccionar a los usuarios
    const [nombreUsuario, setNombreUsuario] = useState('') // Nombre del usuario
    const [menu, setMenu] = useState([]) // Elementos del menú
    const [mensaje, setMensaje] = useState('') // Mensaje de bienvenida
    // Botones para acciones rápidas
    const [boton1, setBoton1] = useState({})
    const [boton2, setBoton2] = useState({})

    useValidarToken() // Se valida que el usuario haya iniciado sesión

    useEffect(() => {
        const token = localStorage.getItem('token') // Token de inicio de sesión        
            try{
                const tokenDecodificado = jwtDecode(token) // Se decodifica el token

                if(tokenDecodificado.rol === 'alumno'){
                        // Si el usuario es un alumno se redirige a su panel
                        navigate('/SICA/alumnos/inicio')
                }

                setNombreUsuario(tokenDecodificado.nombre); // Se almacena el nombre en el estado

                if(tokenDecodificado.rol === 'superadmin'){
                    // Si el usuario es superadmin
                    // Se asigna el siguiente menú
                    setMenu([ 
                        {titulo: "Inicio", icono:FaHouseChimney, link:'/SICA/administradores/inicio'},
                        {titulo: "Subir calificaciones", icono:FaFileUpload, link:'/SICA/administradores/subir-calificaciones'},
                        {titulo: "Gestionar usuarios", icono:FaUsers, 
                            subelementos:[
                                {titulo:"Agregar usuario", icono:TiUserAdd, link:'/SICA/administradores/agregar-usuario'},
                                {titulo:"Ver usuarios", icono:FaUserEdit, link:'/SICA/administradores/ver-usuarios'},
                            ]},
                        {titulo: "Gestionar grupos", icono:FaLayerGroup, 
                            subelementos:[
                                {titulo:"Agregar grupo", icono:MdGroupAdd, link:'/SICA/administradores/agregar-grupo'},
                                {titulo:"Ver grupos", icono:MdGroups, link:'/SICA/administradores/ver-grupos'},
                            ]},
                        {titulo: "Subir horarios", icono:RiCalendarScheduleFill, link:'/SICA/administradores/subir-horarios'},
                        {titulo: "Cerrar sesión", icono:IoLogOut, link:'/inicio'},
                    ])
                    // Se asigna el siguiente mensaje de bienvenida
                    setMensaje("Este es el sistema de calificaciones, aquí podrás gestionar los usuarios del sistema, gestionar los grupos y subir las calificaciones de los alumnos")
                    // Se asignan los siguientes botones
                    setBoton1({texto:"Agregar usuario", link:"/SICA/administradores/agregar-usuario"})
                    setBoton2({texto:"Ver usuarios", link:"/SICA/administradores/ver-usuarios"})
                }else if(tokenDecodificado.rol==='editor'){
                    // Si el usuario es editor
                    // Se asigna el siguiente menú
                    setMenu([ 
                        {titulo: "Inicio", icono:FaHouseChimney, link:'/SICA/administradores/inicio'},
                        {titulo: "Subir calificaciones", icono:FaFileUpload, link:'/SICA/administradores/subir-calificaciones'},
                        {titulo: "Gestionar usuarios", icono:FaUsers, 
                            subelementos:[
                                {titulo:"Agregar usuario", icono:TiUserAdd, link:'/SICA/administradores/agregar-usuario'},
                                {titulo:"Ver usuarios", icono:FaUserEdit, link:'/SICA/administradores/ver-usuarios'},
                            ]},
                        {titulo: "Gestionar grupos", icono:FaLayerGroup, 
                            subelementos:[
                                {titulo:"Agregar grupo", icono:MdGroupAdd, link:'/SICA/administradores/agregar-grupo'},
                                {titulo:"Ver grupos", icono:MdGroups, link:'/SICA/administradores/ver-grupos'},
                            ]},
                        {titulo: "Cerrar sesión", icono:IoLogOut, link:'/inicio'},
                    ])
                    // Se asigna el siguiente mensaje de bienvenida
                    setMensaje("Este es el sistema de calificaciones, aquí podrás gestionar los alumnos del sistema, gestionar los grupos y subir las calificaciones de los alumnos")
                    // Se asignan los siguientes botones
                    setBoton1({texto:"Subir calificaciones", link:"/SICA/administradores/subir-calificaciones"})
                    setBoton2({texto:"Ver grupos", link:"/SICA/administradores/ver-grupos"})
                } else if(tokenDecodificado.rol==='lector'){
                    // Si el usuario es lector se asigna el siguiente menú
                    setMenu([ 
                        {titulo: "Inicio", icono:FaHouseChimney, link:'/SICA/administradores/inicio'},
                        {titulo: "Calificaciones", icono:FaFileUpload, link:'/SICA/administradores/subir-calificaciones'},
                        {titulo:"Usuarios", icono:FaUserEdit, link:'/SICA/administradores/ver-usuarios'},
                        {titulo: "Grupos", icono:FaLayerGroup, link:'/SICA/administradores/gestionar-grupos'},
                        {titulo: "Cerrar sesión", icono:IoLogOut, link:'/inicio'},
                    ])
                    // Se asigna el siguiente mensaje de bienvenida
                    setMensaje("Este es el sistema de calificaciones, aquí podrás consultar los alumnos del sistema, las calificaciones, y los grupos")
                    // Se asignan los siguientes botones
                    setBoton1({texto:"Ver calificaciones", link:"/SICA/administradores/subir-calificaciones"})
                    setBoton2({texto:"Ver usuarios", link:"/SICA/administradores/ver-usuarios"})
                }

            }catch(error){
                // Si hay algún error se redirige al usuario al inicio de sesión
                navigate('/SICA/iniciar-sesion')
            }
    }, [navigate])

    return(
        <div className="contenedor-inicio">
            <MenuLateral elementos={menu}/>
            <Bienvenida 
                nombre={nombreUsuario} 
                descripcion={mensaje}
                textoBoton1={boton1.texto}
                linkBoton1={boton1.link}
                textoBoton2={boton2.texto}
                linkBoton2={boton2.link}
            />
        </div>
    )
}