import {jwtDecode} from "jwt-decode"
import MenuLateral from "../../../../components/sica/MenuLateral/MenuLateral";
import "./GestionarHorarios.css"
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useValidarToken } from "../../../../hooks/useValidarToken/useValidarToken";

import { FaHouseChimney } from "react-icons/fa6";
import { FaFileUpload, FaUsers, FaUserEdit, FaLayerGroup } from "react-icons/fa";
import { TiUserAdd } from "react-icons/ti";
import { IoLogOut } from "react-icons/io5";
import { MdGroupAdd, MdGroups } from "react-icons/md";
import { RiCalendarScheduleFill } from "react-icons/ri";

// Página del sica para gestionar los horarios de los grupos
export default function GestionarHorarios(){
    const navigate = useNavigate() // Para redireccionar a los usuarios
    const [menu, setMenu] = useState([]) // Elementos del menú
    const [grupos, setGrupos] = useState([]) // Grupos del sistema
    const [horarios, setHorarios] = useState([]) // Horarios de la BD

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

    useEffect(() => { // Se obtienen los grupos del backend
        const token = localStorage.getItem("token"); //Token de inicio de sesión
        fetch('http://localhost:3000/api/grupos',{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }).then(async res => {
            if (res.ok) { // Si se obtienen los grupos correctamente
                const data = await res.json()
                setGrupos(data.grupos)
                return
            }else{ // Si ocurrió un error se alerta al usuario
                console.error(`Error ${res.status}`, await res.json().catch(()=>null))
                alert("Ocurrió un error al obtener los grupos")
                return   
            }
        })
    }, [])

    useEffect(() => {
        fetch('http://localhost:3000/api/horarios',{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }).then(async res => {
            if (res.ok) {
                const data = await res.json()
                setHorarios(data.horarios)
                return
            }else{ // Si ocurrió un error se alerta al usuario
                console.error(`Error ${res.status}`, await res.json().catch(()=>null))
                alert("Ocurrió un error al obtener los horarios")
                return   
            }
        })
    },[])

    // Método para obtener el horario de un grupo específico
    const obtenerHorarioDeGrupo = (grupoId) => {
        return horarios.find(h => h.grupo._id === grupoId)
    }    

    // Método para subir un horario de un grupo
    const subirHorario = async (grupoId, file) => {
        const formData = new FormData()
        formData.append("imagen", file)
        formData.append("grupoId", grupoId)

        const res = await fetch("http://localhost:3000/api/horarios", {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: formData
        })

        if (res.ok) {
            const data = await res.json()
            setHorarios(prev => [...prev, data.horario])
        } else {
            alert("Error al subir el horario")
        }
        }

    
    // Método para eliminar un horario
    const eliminarHorario = async (horarioId) => {
    const res = await fetch(`http://localhost:3000/api/horarios/${horarioId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
    })

    if (res.ok) {
        setHorarios(prev => prev.filter(h => h._id !== horarioId))
    } else {
        alert("Error al eliminar el horario")
    }
    }


    return(
        <div className="contenedor-gestionar-horarios">
            <MenuLateral elementos={menu}/>
            <div className="contenido-principal">
                <h1>Gestionar Grupos</h1>
                <table className="tabla-horarios">
                    <thead>
                        <tr>
                        <th>Grupo</th>
                        <th>Horario</th>
                        <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {grupos.map(grupo => {
                        const horario = obtenerHorarioDeGrupo(grupo._id)
                        return (
                            <tr key={grupo._id}>
                            <td>{grupo.nombre}</td>
                            <td>
                                {horario ? (
                                <img src={horario.imagenUrl} alt="Horario" style={{ width: "200px" }} />
                                ) : (
                                <span>Sin horario</span>
                                )}
                            </td>
                            <td>
                                {!horario && (
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => subirHorario(grupo._id, e.target.files[0])}
                                />
                                )}
                                {horario && (
                                <button onClick={() => eliminarHorario(horario._id)}>
                                    Eliminar
                                </button>
                                )}
                            </td>
                            </tr>
                        )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}