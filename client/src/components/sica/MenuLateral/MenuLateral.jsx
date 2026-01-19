import LogoCBTA from './../../../assets/img/logo_cbta239.png'
import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { jwtDecode } from 'jwt-decode'

import '../../../assets/styles/global.css'
import './MenuLateral.css'
import { FaHouseChimney } from 'react-icons/fa6'
import { MdGrade, MdGroupAdd, MdGroups, MdOutlineMoveUp } from 'react-icons/md'
import { PiMedalFill } from 'react-icons/pi'
import { FaHistory, FaUserCircle, FaKey, FaFileUpload, FaUsers, FaUserEdit, FaLayerGroup } from 'react-icons/fa'
import { RiCalendarScheduleFill } from 'react-icons/ri'
import { IoLogOut } from 'react-icons/io5'
import { TiUserAdd } from 'react-icons/ti'
import { HiLockClosed } from 'react-icons/hi'

// Componente que renderiza el menú lateral del SICA
export default function MenuLateral(){
    const navigate = useNavigate()
    const location = useLocation() // Para obtener la ruta actual
    const [menuAbierto, setMenuAbierto] = useState(false) // Estado del menú lateral (abierto o cerrado)
    const [elementosMenu, setElementosMenu] = useState([]) // Elementos del menú lateral (dependen del rol)

    useEffect(() => { // Se asigna el menú dependiendo el rol
        const token = localStorage.getItem('token')
        const tokenDecodificado = jwtDecode(token)
        if(tokenDecodificado.rol === 'alumno'){
            setElementosMenu([
                {titulo:'Inicio', icono:FaHouseChimney, link:'/SICA/alumnos/inicio'},
                {titulo:'Calificaciones', icono:MdGrade, 
                    subelementos:[
                        {titulo:'En curso', icono:PiMedalFill, link:'/SICA/alumnos/en-curso'},
                        {titulo:'Historial',icono:FaHistory, link:'/SICA/alumnos/historial'}
                    ]},
                {titulo:'Horario', icono:RiCalendarScheduleFill, link:'/SICA/alumnos/horario'},
                {titulo:'Usuario', icono:FaUserCircle, 
                    subelementos:[
                        {titulo:'Cambiar contraseña', icono:FaKey, link:'/SICA/alumnos/cambiar-contrasena'},
                        {titulo: 'Cerrar sesión', icono:IoLogOut, onClick: cerrarSesion}
                    ]}
            ])
        }else if(tokenDecodificado.rol === 'superadmin'){
            setElementosMenu([ 
                {titulo: 'Inicio', icono:FaHouseChimney, link:'/SICA/administradores/inicio'},
                {titulo: 'Gestionar usuarios', icono:FaUsers, 
                    subelementos:[
                        {titulo:'Agregar usuario', icono:TiUserAdd, link:'/SICA/administradores/agregar-usuario'},
                        {titulo:'Ver usuarios', icono:FaUserEdit, link:'/SICA/administradores/ver-usuarios'},
                    ]},
                {titulo: 'Gestionar grupos', icono:FaLayerGroup, 
                    subelementos:[
                        {titulo:'Agregar grupo', icono:MdGroupAdd, link:'/SICA/administradores/agregar-grupo'},
                        {titulo:'Ver grupos', icono:MdGroups, link:'/SICA/administradores/ver-grupos'},
                        {titulo: 'Subir horarios', icono:RiCalendarScheduleFill, link:'/SICA/administradores/gestionar-horarios'},
                    ]},
                {titulo: 'Capturar calificaciones', icono:FaFileUpload, link:'/SICA/administradores/calificaciones'},
                {titulo: 'Cerrar semestre', icono:HiLockClosed, link:'/SICA/administradores/cerrar-semestre'},
                {titulo: 'Reubicar alumnos', icono:MdOutlineMoveUp, link:'/SICA/administradores/migrar-alumnos'},
                {titulo:'Usuario', icono:FaUserCircle, 
                    subelementos:[
                        {titulo:'Cambiar contraseña', icono:FaKey, link:'/SICA/administradores/cambiar-contrasena'},
                        {titulo: 'Cerrar sesión', icono:IoLogOut, onClick: cerrarSesion}
                    ]}
            ])
        }else if(tokenDecodificado.rol==='editor'){
            setElementosMenu([ 
                {titulo: 'Inicio', icono:FaHouseChimney, link:'/SICA/administradores/inicio'},
                {titulo: 'Gestionar usuarios', icono:FaUsers, 
                    subelementos:[
                        {titulo:'Agregar usuario', icono:TiUserAdd, link:'/SICA/administradores/agregar-usuario'},
                        {titulo:'Ver usuarios', icono:FaUserEdit, link:'/SICA/administradores/ver-usuarios'},
                    ]},
                {titulo: 'Gestionar grupos', icono:FaLayerGroup, 
                    subelementos:[
                        {titulo:'Agregar grupo', icono:MdGroupAdd, link:'/SICA/administradores/agregar-grupo'},
                        {titulo:'Ver grupos', icono:MdGroups, link:'/SICA/administradores/ver-grupos'},
                        {titulo:'Subir horarios', icono:RiCalendarScheduleFill, link:'/SICA/administradores/gestionar-horarios'},
                    ]},
                {titulo: 'Capturar calificaciones', icono:FaFileUpload, link:'/SICA/administradores/calificaciones'},
                {titulo: 'Reubicar alumnos', icono:MdOutlineMoveUp, link:'/SICA/administradores/migrar-alumnos'},
                {titulo:'Usuario', icono:FaUserCircle, 
                    subelementos:[
                        {titulo:'Cambiar contraseña', icono:FaKey, link:'/SICA/administradores/cambiar-contrasena'},
                        {titulo: 'Cerrar sesión', icono:IoLogOut, onClick: cerrarSesion}
                    ]}
            ])
        } else if(tokenDecodificado.rol==='lector'){
            setElementosMenu([ 
                {titulo: 'Inicio', icono:FaHouseChimney, link:'/SICA/administradores/inicio'},
                {titulo:'Ver usuarios', icono:FaUserEdit, link:'/SICA/administradores/ver-usuarios'},
                {titulo:'Ver grupos', icono:MdGroups, link:'/SICA/administradores/ver-grupos'},
                {titulo: 'Ver horarios', icono:RiCalendarScheduleFill, link:'/SICA/administradores/gestionar-horarios'},
                {titulo: 'Ver calificaciones', icono:FaFileUpload, link:'/SICA/administradores/calificaciones'},
                {titulo:'Usuario', icono:FaUserCircle, 
                    subelementos:[
                        {titulo:'Cambiar contraseña', icono:FaKey, link:'/SICA/administradores/cambiar-contrasena'},
                        {titulo: 'Cerrar sesión', icono:IoLogOut, onClick: cerrarSesion}
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

    // Método para determinar si un elemento del menú está activo
    const isActive = (link) => {
        return location.pathname === link ? 'active' : ''
    }

    // Método para cerrar la sesión actual
    const cerrarSesion = () => {
        localStorage.removeItem('token')
        navigate('/SICA/iniciar-sesion')
    }

    return(
        <>
            <button className={`menu__icono ${menuAbierto ? 'oculto' : ""}`} onClick={abrirMenu}>
                ☰
            </button>
            <div className={`menu ${menuAbierto ? 'abierto' : ""}`}>
                <button className="menu__boton--cerrar" onClick={cerrarMenu}>×</button>
                <div className="menu__encabezado">
                    <img src={LogoCBTA} alt="Logo"/>
                    <strong>SICA239</strong>
                </div>
                <div className="menu__elementos">
                    <ul>
                        {elementosMenu.map((elemento, index)=>(
                            <li 
                                key={index} 
                                className={`menu__elemento ${isActive(elemento.link)}`} 
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
                                    {elemento.icono && <elemento.icono className="menu__elemento-icono"/>}
                                    {elemento.titulo}
                                </span>
                                {elemento.subelementos && (
                                    <ul>
                                        {elemento.subelementos.map((subelemento, subIndex)=>(
                                            <li 
                                                key={subIndex} 
                                                className={`menu__subelemento ${isActive(subelemento.link)}`} 
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
                                                    {subelemento.icono && <subelemento.icono className="menu__elemento-icono"/>}
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