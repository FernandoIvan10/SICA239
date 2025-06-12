import {jwtDecode} from "jwt-decode"
import MenuLateral from "../../../../components/sica/MenuLateral/MenuLateral";
import "./VerUsuarios.css"
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useValidarToken } from "../../../../hooks/useValidarToken/useValidarToken";

import { FaHouseChimney } from "react-icons/fa6";
import { FaFileUpload, FaUsers, FaUserEdit, FaLayerGroup } from "react-icons/fa";
import { TiUserAdd } from "react-icons/ti";
import { IoLogOut } from "react-icons/io5";
import { MdGroupAdd, MdGroups } from "react-icons/md";
import { RiCalendarScheduleFill } from "react-icons/ri";
import { MdEdit, MdDelete } from "react-icons/md";

// Página del SICA para ver la lista de usuarios
export default function VerUsuarios(){
    const navigate = useNavigate() // Para redireccionar a los usuarios
    const [menu, setMenu] = useState([]) // Elementos del menú
    const [alumnos, setAlumnos] = useState([]) // Alumnos obtenidos de la BD
    const [admins, setAdmins] = useState([]) // Administradores obtenidos de la BD
    const [usuarios, setUsuarios] = useState([]) // Lista completa de usuarios (alumnos y administradores)

    useValidarToken() // Se valida que el usuario haya iniciado sesión

    useEffect(() => {
        const token = localStorage.getItem('token') // Token de inicio de sesión        
            try{
                const tokenDecodificado = jwtDecode(token) // Se decodifica el token

                if(tokenDecodificado.rol === 'alumno'){
                        // Si el usuario es un alumno se redirige a su panel
                        navigate('/SICA/alumnos/inicio')
                }

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
                } else if(tokenDecodificado.rol==='lector'){
                    // Si el usuario es lector se asigna el siguiente menú
                    setMenu([ 
                        {titulo: "Inicio", icono:FaHouseChimney, link:'/SICA/administradores/inicio'},
                        {titulo: "Calificaciones", icono:FaFileUpload, link:'/SICA/administradores/subir-calificaciones'},
                        {titulo:"Usuarios", icono:FaUserEdit, link:'/SICA/administradores/ver-usuarios'},
                        {titulo: "Grupos", icono:FaLayerGroup, link:'/SICA/administradores/gestionar-grupos'},
                        {titulo: "Cerrar sesión", icono:IoLogOut, link:'/inicio'},
                    ])
                }
            }catch(error){
                // Si hay algún error se redirige al usuario al inicio de sesión
                navigate('/SICA/iniciar-sesion')
            }
    }, [navigate])
    
    useEffect(() => { // Se obtienen los alumnos de la BD
        const token = localStorage.getItem('token')
        fetch('http://localhost:3000/api/alumnos', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(res => res.json())
        .then(data => {
            setAlumnos(data) // Se guarda la lista de alumnos en un hook
        })
        .catch(err => {
            console.error("Error al obtener alumnos:", err)
            setAlumnos([])
        })
    }, [])

    useEffect(() => { // Se obtienen los administradores de la BD para mostrarlos en la tabla de usuarios
        const token = localStorage.getItem('token')
        fetch('http://localhost:3000/api/admins', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(res => res.json())
        .then(data => {
            setAdmins(data) // Se guarda la lista de administradores en un hook
        })
        .catch(err => {
            console.error("Error al obtener administradores:", err)
            setAdmins([])
        })
    }, [])

    useEffect(() => { // Se unen la lista de alumnos y la lista de administradores en una sola lista
        const alumnosConTipo = alumnos.map(a => ({ ...a, tipo: "Alumno" }))
        const adminsConTipo = admins.map(a => ({ ...a, tipo: "Administrador" }))
        setUsuarios([...alumnosConTipo, ...adminsConTipo]) // Se les agrega el tipo antes de almacenarlos
    }, [alumnos, admins])
    

    return(
        <div className="contenedor-inicio">
            <MenuLateral elementos={menu}/>
            <div className="contenido-principal">
                <h1>Lista de Usuarios</h1>
                <table className="tabla-usuarios">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Tipo</th>
                            <th>Matrícula/RFC</th>
                            <th>Nombre</th>
                            <th>Apellido</th>
                            <th>Grupo/Rol</th>
                            <th>Editar</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usuarios.map((usuario, index) => (
                            <tr key={usuario._id || usuario.id || index}>
                                <td>{index + 1}</td>
                                <td>{usuario.tipo}</td>
                                <td>{usuario.tipo === "Alumno" ? usuario.matricula : usuario.rfc}</td>
                                <td>{usuario.nombre}</td>
                                <td>{usuario.apellido}</td>
                                <td>{usuario.tipo === "Alumno" ? usuario.grupoId.nombre : usuario.rol}</td>
                                <td>
                                    <MdEdit className="btn-editar"/>
                                </td>
                            </tr>
                        ))} 
                    </tbody>
                </table>
            </div>
        </div>
    )
}