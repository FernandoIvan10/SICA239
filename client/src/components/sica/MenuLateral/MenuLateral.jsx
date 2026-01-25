import LogoCBTA from './../../../assets/img/logo_cbta239.png'
import { useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../../../auth/useAuth'
import Cargando from '../../../components/sica/Cargando/Cargando'

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
    const [menuAbierto, setMenuAbierto] = useState(false) // Estado del menú lateral (abierto o cerrado)
    
    const location = useLocation() // Ruta actual
    const navigate = useNavigate()
    const {usuario, logout} = useAuth() // usuario autenticado

    // Métodos para cambiar el estado el menú lateral
    const abrirMenu = () => {
        setMenuAbierto(true)
    }
    const cerrarMenu = () => {
        setMenuAbierto(false)
    }
    
    // Función para verificar si la ruta actual coincide con el link del ítem
    const estaActivo = (link) => {
        return location.pathname === link ? 'active' : ''
    }

    // Método para cerrar la sesión actual
    const cerrarSesion = () => {
        logout()
        navigate('/SICA/iniciar-sesion')
    }

    const elementosPorRol = { // Elementos del menú dependiendo del rol
        superadmin: [
            {titulo: 'Inicio', icono:FaHouseChimney, link:'/SICA/administradores/inicio'},
            {titulo: 'Gestionar usuarios', icono:FaUsers, 
                subelementos:[
                    {titulo:'Agregar usuario', icono:TiUserAdd, link:'/SICA/administradores/agregar-usuario'},
                    {titulo:'Ver usuarios', icono:FaUserEdit, link:'/SICA/administradores/ver-usuarios'},
                ]
            },
            {titulo: 'Gestionar grupos', icono:FaLayerGroup, 
                subelementos:[
                    {titulo:'Agregar grupo', icono:MdGroupAdd, link:'/SICA/administradores/agregar-grupo'},
                    {titulo:'Ver grupos', icono:MdGroups, link:'/SICA/administradores/ver-grupos'},
                    {titulo: 'Subir horarios', icono:RiCalendarScheduleFill, link:'/SICA/administradores/gestionar-horarios'},
                ]
            },
            {titulo: 'Capturar calificaciones', icono:FaFileUpload, link:'/SICA/administradores/calificaciones'},
            {titulo: 'Cerrar semestre', icono:HiLockClosed, link:'/SICA/administradores/cerrar-semestre'},
            {titulo: 'Reubicar alumnos', icono:MdOutlineMoveUp, link:'/SICA/administradores/migrar-alumnos'},
            {titulo:'Usuario', icono:FaUserCircle, 
                subelementos:[
                    {titulo:'Cambiar contraseña', icono:FaKey, link:'/SICA/administradores/cambiar-contrasena'},
                    {titulo: 'Cerrar sesión', icono:IoLogOut, onClick: cerrarSesion}
                ]
            }
        ],
        editor: [
            {titulo: 'Inicio', icono:FaHouseChimney, link:'/SICA/administradores/inicio'},
            {titulo: 'Gestionar usuarios', icono:FaUsers, 
                subelementos:[
                    {titulo:'Agregar usuario', icono:TiUserAdd, link:'/SICA/administradores/agregar-usuario'},
                    {titulo:'Ver usuarios', icono:FaUserEdit, link:'/SICA/administradores/ver-usuarios'},
                ]
            },
            {titulo: 'Gestionar grupos', icono:FaLayerGroup, 
                subelementos:[
                    {titulo:'Agregar grupo', icono:MdGroupAdd, link:'/SICA/administradores/agregar-grupo'},
                    {titulo:'Ver grupos', icono:MdGroups, link:'/SICA/administradores/ver-grupos'},
                    {titulo:'Subir horarios', icono:RiCalendarScheduleFill, link:'/SICA/administradores/gestionar-horarios'},
                ]
            },
            {titulo: 'Capturar calificaciones', icono:FaFileUpload, link:'/SICA/administradores/calificaciones'},
            {titulo: 'Reubicar alumnos', icono:MdOutlineMoveUp, link:'/SICA/administradores/migrar-alumnos'},
            {titulo:'Usuario', icono:FaUserCircle, 
                subelementos:[
                    {titulo:'Cambiar contraseña', icono:FaKey, link:'/SICA/administradores/cambiar-contrasena'},
                    {titulo: 'Cerrar sesión', icono:IoLogOut, onClick: cerrarSesion}
                ]
            }
        ],
        lector: [
            {titulo: 'Inicio', icono:FaHouseChimney, link:'/SICA/administradores/inicio'},
            {titulo:'Ver usuarios', icono:FaUserEdit, link:'/SICA/administradores/ver-usuarios'},
            {titulo:'Ver grupos', icono:MdGroups, link:'/SICA/administradores/ver-grupos'},
            {titulo: 'Ver horarios', icono:RiCalendarScheduleFill, link:'/SICA/administradores/gestionar-horarios'},
            {titulo: 'Ver calificaciones', icono:FaFileUpload, link:'/SICA/administradores/calificaciones'},
            {titulo:'Usuario', icono:FaUserCircle, 
                subelementos:[
                    {titulo:'Cambiar contraseña', icono:FaKey, link:'/SICA/administradores/cambiar-contrasena'},
                    {titulo: 'Cerrar sesión', icono:IoLogOut, onClick: cerrarSesion}
                ]
            }
        ],
        alumno: [
            {titulo:'Inicio', icono:FaHouseChimney, link:'/SICA/alumnos/inicio'},
            {titulo:'Calificaciones', icono:MdGrade, 
                subelementos:[
                    {titulo:'En curso', icono:PiMedalFill, link:'/SICA/alumnos/en-curso'},
                    {titulo:'Historial',icono:FaHistory, link:'/SICA/alumnos/historial'}
                ]
            },
            {titulo:'Horario', icono:RiCalendarScheduleFill, link:'/SICA/alumnos/horario'},
            {titulo:'Usuario', icono:FaUserCircle, 
                subelementos:[
                    {titulo:'Cambiar contraseña', icono:FaKey, link:'/SICA/alumnos/cambiar-contrasena'},
                    {titulo: 'Cerrar sesión', icono:IoLogOut, onClick: cerrarSesion}
                ]
            }
        ]
    }

    if(!usuario) return <Cargando/> // Si usuario no existe, no renderizar nada aún
    
    const elementosMenu = elementosPorRol[usuario.rol] || [] // Elementos del menú según el rol del usuario

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
                                className={`menu__elemento ${estaActivo(elemento.link)}`} 
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
                                                className={`menu__subelemento ${estaActivo(subelemento.link)}`} 
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