import MenuLateral from "../../../../components/sica/MenuLateral/MenuLateral"
import { useEffect, useState } from "react";
import "./EditarAdministrador.css"
import { useValidarToken } from "../../../../hooks/useValidarToken/useValidarToken";
import { useNavigate, useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

import { FaHouseChimney } from "react-icons/fa6";
import { FaFileUpload, FaUsers, FaUserEdit, FaLayerGroup } from "react-icons/fa";
import { TiUserAdd } from "react-icons/ti";
import { IoLogOut } from "react-icons/io5";
import { MdGroupAdd, MdGroups } from "react-icons/md";
import { RiCalendarScheduleFill } from "react-icons/ri";

// Página del SICA para editar administradores
export default function EditarAdministrador() {
    const navigate = useNavigate() // Para redireccionar a los usuarios
    const [menu, setMenu] = useState([]) // Elementos del menú
    const { id } = useParams() // ID enviado por parámetro
    const [admin, setAdmin] = useState(null) // Contiene todos los datos del formulario
    
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

    useEffect(() => { // Se obtienen los datos del administrador a editar
        const token = localStorage.getItem('token')

        fetch(`http://localhost:3000/api/admins/${id}`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        })
        .then(res => res.json())
        .then(data => {
            setAdmin({
                rfc: data.rfc,
                nombre: data.nombre,
                apellido: data.apellido,
                rol: data.rol
            })
        })
        .catch(err => {
            console.error("Error al obtener administrador:", err)
        })
    }, [id])

    // Método para editar el administrador con los nuevos datos
    const guardarCambios = () => {
        if(!admin.nombre.trim() || !admin.apellido.trim() || !admin.rol.trim()){ // Se valida que hayan rellenado todos los campos del formulario
            alert("Todos los campos son obligatorios")
            return
        }

        const token = localStorage.getItem('token')
        const {nombre, apellido, rol} = admin // Se obtienen los datos del formulario

        fetch(`http://localhost:3000/api/admins/${id}`, {
            method: "PUT",
            headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({nombre, apellido, rol})
        }).then(async res => {
            if(res.ok){
                alert("Administrador actualizado correctamente")
                navigate("/SICA/administradores/ver-usuarios")
            } else {
                console.error(await res.json().catch(()=>null))
                alert("Ocurrió un error al actualizar el admin")
            }
        })
    }

    if (!admin) return <p>Cargando administrador...</p>
    return (
        <>
            <MenuLateral elementos={menu}/>
            <form className="formulario-editar">
                <h2>Editar Administrador</h2>
                <label>
                    RFC:
                    <input
                    type="text"
                    value={admin.rfc}
                    readOnly
                    />
                </label>
                <label>
                    Nombre:
                    <input
                    type="text"
                    value={admin.nombre}
                    onChange={(e) => setAdmin({ ...admin, nombre: e.target.value })}
                    required
                    />
                </label>
                <label>
                    Apellido:
                    <input
                    type="text"
                    value={admin.apellido}
                    onChange={(e) => setAdmin({ ...admin, apellido: e.target.value })}
                    required
                    />
                </label>
                <label>
                    Rol:
                    <select
                        value={admin.rol}
                        onChange={(e) => setAdmin({ ...admin, rol: e.target.value })}
                        required
                    >
                        <option value="superadmin">Superadmin</option>
                        <option value="editor">Editor</option>
                        <option value="lector">Lector</option>
                    </select>
                </label>
                <button type="button" className="btn-guardar" onClick={guardarCambios}>
                    Guardar cambios
                </button>
            </form>
        </>
    )
}