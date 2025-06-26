import MenuLateral from "../../../../components/sica/MenuLateral/MenuLateral"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { useValidarToken } from "../../../../hooks/useValidarToken/useValidarToken"
import { useValidarRol } from "../../../../hooks/useValidarRol/useValidarRol"
import { MdEdit } from "react-icons/md"
import "./VerUsuarios.css"

// Página del SICA para ver la lista de usuarios
export default function VerUsuarios(){
    const navigate = useNavigate() // Para redireccionar a los usuarios
    const token = localStorage.getItem('token') // Token de inicio de sesión
    const [alumnos, setAlumnos] = useState([]) // Alumnos del sistema
    const [admins, setAdmins] = useState([]) // Administradores del sistema
    const [usuarios, setUsuarios] = useState([]) // Lista completa de usuarios (alumnos y administradores)

    useValidarToken() // El usuario debe haber iniciado sesión
    useValidarRol('superadmin', 'editor', 'lector') // El usuario debe tener permiso para acceder a esta ruta
    
    useEffect(() => { // Se obtienen los alumnos del backend
        fetch('http://localhost:3000/api/alumnos', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(res => res.json())
        .then(data => {
            setAlumnos(data)
        })
        .catch(err => {
            console.error("Error al obtener alumnos:", err)
            setAlumnos([])
        })
    }, [])

    useEffect(() => { // Se obtienen los administradores del backend
        fetch('http://localhost:3000/api/admins', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(res => res.json())
        .then(data => {
            setAdmins(data)
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

    // Método para redirigir al usuario a la página de edición del usuario seleccionado
    const redirigirAEdicion = (usuario) => {
        if (usuario.tipo === "Alumno") {
        navigate(`/SICA/administradores/editar-alumno/${usuario._id}`)
        } else if (usuario.tipo === "Administrador") {
        navigate(`/SICA/administradores/editar-administrador/${usuario._id}`)
        }
    }

    return(
        <div className="contenedor-inicio">
            <MenuLateral/>
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
                                    <MdEdit className="btn-editar" onClick={() => redirigirAEdicion(usuario)}/>
                                </td>
                            </tr>
                        ))} 
                    </tbody>
                </table>
            </div>
        </div>
    )
}