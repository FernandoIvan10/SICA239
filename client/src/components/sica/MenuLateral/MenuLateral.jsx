import LogoCBTA from './../../../assets/img/logo_cbta239.png'
import { useLocation } from 'react-router-dom'
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from 'react'
import { jwtDecode } from "jwt-decode"

import './MenuLateral.css'
import { FaHouseChimney } from "react-icons/fa6"
import { MdGrade, MdGroupAdd, MdGroups, MdOutlineMoveUp } from "react-icons/md"
import { PiMedalFill } from "react-icons/pi"
import { FaHistory, FaUserCircle, FaKey, FaFileUpload, FaUsers, FaUserEdit, FaLayerGroup } from "react-icons/fa"
import { RiCalendarScheduleFill } from "react-icons/ri"
import { IoLogOut } from "react-icons/io5"
import { TiUserAdd } from "react-icons/ti"
import { HiLockClosed } from "react-icons/hi"

// Componente que renderiza el menú lateral del SICA
export default function MenuLateral(){
    const navigate = useNavigate() // Para redirigir al usuario
    const location = useLocation() // Almacena la ruta actual
    const [menuAbierto, setMenuAbierto] = useState(false) // Estado del menú lateral (abierto o cerrado)
    const [elementosMenu, setElementosMenu] = useState([]) // Elementos del menú lateral (dependen del rol)

    useEffect(() => { // Se asigna el menú dependiendo el rol
        const token = localStorage.getItem("token")
        const tokenDecodificado = jwtDecode(token)
        if(tokenDecodificado.rol === 'alumno'){
            // Si el usuario es un alumno se asigna el siguiente menú
            setElementosMenu([
                {titulo:"Inicio", icono:FaHouseChimney, link:'/SICA/alumnos/inicio'},
                {titulo:"Calificaciones", icono:MdGrade, 
                    subelementos:[
                        {titulo:"En curso", icono:PiMedalFill, link:'/SICA/alumnos/en-curso'},
                        {titulo:"Historial",icono:FaHistory, link:'/SICA/alumnos/historial'}
                    ]},
                {titulo:"Horario", icono:RiCalendarScheduleFill, link:'/SICA/alumnos/horario'},
                {titulo:"Usuario", icono:FaUserCircle, 
                    subelementos:[
                        {titulo:"Cambiar contraseña", icono:FaKey, link:'/SICA/alumnos/cambiar-contrasena'},
                        {titulo: "Cerrar sesión", icono:IoLogOut, onClick: cerrarSesion}
                    ]}
            ])
        }else if(tokenDecodificado.rol === 'superadmin'){
            // Si el usuario es superadmin se asigna el siguiente menú
            setElementosMenu([ 
                {titulo: "Inicio", icono:FaHouseChimney, link:'/SICA/administradores/inicio'},
                {titulo: "Gestionar usuarios", icono:FaUsers, 
                    subelementos:[
                        {titulo:"Agregar usuario", icono:TiUserAdd, link:'/SICA/administradores/agregar-usuario'},
                        {titulo:"Ver usuarios", icono:FaUserEdit, link:'/SICA/administradores/ver-usuarios'},
                    ]},
                {titulo: "Gestionar grupos", icono:FaLayerGroup, 
                    subelementos:[
                        {titulo:"Agregar grupo", icono:MdGroupAdd, link:'/SICA/administradores/agregar-grupo'},
                        {titulo:"Ver grupos", icono:MdGroups, link:'/SICA/administradores/ver-grupos'},
                        {titulo: "Subir horarios", icono:RiCalendarScheduleFill, link:'/SICA/administradores/subir-horarios'},
                    ]},
                {titulo: "Capturar calificaciones", icono:FaFileUpload, link:'/SICA/administradores/subir-calificaciones'},
                {titulo: "Cerrar semestre", icono:HiLockClosed, link:'/SICA/administradores/cerrar-semestre'},
                {titulo: "Reubicar alumnos", icono:MdOutlineMoveUp, link:'/SICA/administradores/migrar-alumnos'},
                {titulo:"Usuario", icono:FaUserCircle, 
                    subelementos:[
                        {titulo:"Cambiar contraseña", icono:FaKey, link:'/SICA/administradores/cambiar-contrasena'},
                        {titulo: "Cerrar sesión", icono:IoLogOut, onClick: cerrarSesion}
                    ]}
            ])
        }else if(tokenDecodificado.rol==='editor'){
            // Si el usuario es editor se asigna el siguiente menú
            setElementosMenu([ 
                {titulo: "Inicio", icono:FaHouseChimney, link:'/SICA/administradores/inicio'},
                {titulo: "Gestionar usuarios", icono:FaUsers, 
                    subelementos:[
                        {titulo:"Agregar usuario", icono:TiUserAdd, link:'/SICA/administradores/agregar-usuario'},
                        {titulo:"Ver usuarios", icono:FaUserEdit, link:'/SICA/administradores/ver-usuarios'},
                    ]},
                {titulo: "Gestionar grupos", icono:FaLayerGroup, 
                    subelementos:[
                        {titulo:"Agregar grupo", icono:MdGroupAdd, link:'/SICA/administradores/agregar-grupo'},
                        {titulo:"Ver grupos", icono:MdGroups, link:'/SICA/administradores/ver-grupos'},
                        {titulo: "Subir horarios", icono:RiCalendarScheduleFill, link:'/SICA/administradores/subir-horarios'},
                    ]},
                {titulo: "Capturar calificaciones", icono:FaFileUpload, link:'/SICA/administradores/subir-calificaciones'},
                {titulo: "Reubicar alumnos", icono:MdOutlineMoveUp, link:'/SICA/administradores/migrar-alumnos'},
                {titulo:"Usuario", icono:FaUserCircle, 
                    subelementos:[
                        {titulo:"Cambiar contraseña", icono:FaKey, link:'/SICA/administradores/cambiar-contrasena'},
                        {titulo: "Cerrar sesión", icono:IoLogOut, onClick: cerrarSesion}
                    ]}
            ])
        } else if(tokenDecodificado.rol==='lector'){
            // Si el usuario es lector se asigna el siguiente menú
            setElementosMenu([ 
                {titulo: "Inicio", icono:FaHouseChimney, link:'/SICA/administradores/inicio'},
                {titulo:"Ver usuarios", icono:FaUserEdit, link:'/SICA/administradores/ver-usuarios'},
                {titulo:"Ver grupos", icono:MdGroups, link:'/SICA/administradores/ver-grupos'},
                {titulo: "Ver horarios", icono:RiCalendarScheduleFill, link:'/SICA/administradores/gestionar-horarios'},
                {titulo: "Ver calificaciones", icono:FaFileUpload, link:'/SICA/administradores/calificaciones'},
                {titulo:"Usuario", icono:FaUserCircle, 
                    subelementos:[
                        {titulo:"Cambiar contraseña", icono:FaKey, link:'/SICA/administradores/cambiar-contrasena'},
                        {titulo: "Cerrar sesión", icono:IoLogOut, onClick: cerrarSesion}
                    ]}
            ])
        }
    }, [navigate])

    // Métodos para cambiar el estado el menú lateral
    const abrirMenu = () => {
        setMenuAbierto(true)
    }
    const cerrarMenu = () => {
        setMenuAbierto(false)
    }

    // Función para verificar si la ruta actual coincide con el link del ítem
    const isActive = (link) => {
        return location.pathname === link ? 'active' : ''
    }

    // Método para cerrar la sesión actual
    const cerrarSesion = () => {
        localStorage.removeItem("token")
        navigate('/SICA/iniciar-sesion')
    }

    return(
        <>
            <button className={`menu-hamburguesa ${menuAbierto ? 'oculto' : ''}`} onClick={abrirMenu}>
                ☰
            </button>
            <div className={`contenedor-menu ${menuAbierto ? 'abierto' : ''}`}>
                <button className="cerrar-menu" onClick={cerrarMenu}>×</button>
                <div className="encabezado-menu">
                    <img src={LogoCBTA} alt='Logo'/>
                    <strong>SICA239</strong>
                </div>
                <div className="elementos-menu">
                    <ul>
                        {elementosMenu.map((elemento, index)=>(
                            <li 
                                key={index} 
                                className={isActive(elemento.link)} 
                                onClick={() => {
                                    if (elemento.onClick) {
                                        elemento.onClick()
                                    } else {
                                        navigate(elemento.link)
                                    }
                                    }
                                }
                            >
                                <span>
                                    {elemento.icono && <elemento.icono className='icono'/>}
                                    {elemento.titulo}
                                </span>
                                {elemento.subelementos && (
                                    <ul>
                                        {elemento.subelementos.map((subelemento, subIndex)=>(
                                            <li 
                                                key={subIndex} 
                                                className={isActive(subelemento.link)} 
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    if (subelemento.onClick) {
                                                        subelemento.onClick()
                                                    } else {
                                                        navigate(subelemento.link)
                                                    }
                                                }}
                                            >
                                                <span>
                                                    {subelemento.icono && <subelemento.icono className='icono'/>}
                                                    {subelemento.titulo}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </>
    )
}