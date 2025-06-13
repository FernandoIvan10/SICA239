import MenuLateral from "../../../../components/sica/MenuLateral/MenuLateral"
import { useEffect, useState } from "react";
import "./EditarAlumno.css"
import { useValidarToken } from "../../../../hooks/useValidarToken/useValidarToken";
import { useNavigate, useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

import { FaHouseChimney } from "react-icons/fa6";
import { FaFileUpload, FaUsers, FaUserEdit, FaLayerGroup } from "react-icons/fa";
import { TiUserAdd } from "react-icons/ti";
import { IoLogOut } from "react-icons/io5";
import { MdGroupAdd, MdGroups } from "react-icons/md";
import { RiCalendarScheduleFill } from "react-icons/ri";

// Página del SICA para editar alumnos
export default function EditarGrupo() {
    const navigate = useNavigate() // Para redireccionar a los usuarios
    const [menu, setMenu] = useState([]) // Elementos del menú
    const { id } = useParams() // ID enviado por parámetro
    const [alumno, setAlumno] = useState(null) // Contiene todos los datos del formulario
    const [grupos, setGrupos] = useState([]) // Guarda los grupos del backend
    
    useValidarToken() // Se válida que el usuario haya iniciado sesión

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
        }else if(tokenDecodificado.rol === 'editor'){
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
        }else if(tokenDecodificado.rol === 'lector'){
            // Si el usuario es lector se redirige al panel para ver grupos
            navigate('/SICA/administradores/ver-usuarios')
        }

        }catch(error){
            // Si hay algún error se redirige al usuario al inicio de sesión
            navigate('/SICA/iniciar-sesion')
        }
    }, [navigate])

    useEffect(() => { // Se obtienen los grupos de la BD para mostrarlos en el formulario
        const token = localStorage.getItem('token')
        fetch('http://localhost:3000/api/grupos', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(res => res.json())
        .then(data => {
            setGrupos(data.grupos)
        })
        .catch(err => {
            console.error("Error al obtener grupos:", err)
            setGrupos([])
        })
    }, [])

    useEffect(() => { // Se obtienen los datos del alumno
        if (grupos.length === 0) return // Espera a que los grupos estén cargados

        const token = localStorage.getItem('token')

        fetch(`http://localhost:3000/api/alumnos/${id}`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        })
        .then(res => res.json())
        .then(data => {
            const grupo = grupos.find(g => g._id === data.grupoId)
            setAlumno({
                matricula: data.matricula,
                nombre: data.nombre,
                apellido: data.apellido,
                grupoNombre: grupo ? grupo.nombre : ''
            })
        })
        .catch(err => {
            console.error("Error al obtener alumno:", err)
        })
    }, [id, grupos])

    // Método para editar el alumno con los nuevos datos
    const guardarCambios = () => {
        if(!alumno.nombre.trim() || !alumno.apellido.trim() || !alumno.grupoNombre.trim()){
            alert("Todos los campos son obligatorios")
            return
        }

        const token = localStorage.getItem('token')
        const {nombre, apellido, grupoNombre} = alumno // Se obtienen los datos del formulario

        fetch(`http://localhost:3000/api/alumnos/${id}`, {
            method: "PUT",
            headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(nombre, apellido. grupoNombre)
        }).then(async res => {
            if(res.ok){
                alert("Alumno actualizado correctamente")
                navigate("/SICA/administradores/ver-usuarios")
            } else {
                console.error(await res.json().catch(()=>null))
                alert("Ocurrió un error al actualizar el alumno")
            }
        })
    }

    return (
        <form className="formulario-editar">
            <h2>Editar Alumno</h2>
            <label>
                Matrícula:
                <input
                type="text"
                value={alumno.matricula}
                readOnly
                />
            </label>
            <label>
                Nombre:
                <input
                type="text"
                value={alumno.nombre}
                onChange={(e) => setAlumno({ ...alumno, nombre: e.target.value })}
                />
            </label>
            <label>
                Apellido:
                <input
                type="text"
                value={alumno.apellido}
                onChange={(e) => setAlumno({ ...alumno, apellido: e.target.value })}
                />
            </label>
            <label>
                Grupo:
                <select
                    value={alumno.grupoNombre}
                    onChange={(e) => setAlumno({ ...alumno, grupoNombre: e.target.value })}
                >
                    <option value="">Seleccionar grupo</option>
                    {grupos.map((g) => (
                        <option key={g._id} value={g.nombre}>
                            {g.nombre}
                        </option>
                    ))}
                </select>
            </label>
            <button type="button" className="btn-guardar" onClick={guardarCambios}>
                Guardar cambios
            </button>
        </form>
    )
}