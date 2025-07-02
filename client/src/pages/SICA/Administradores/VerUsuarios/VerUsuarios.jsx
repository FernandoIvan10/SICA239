import MenuLateral from "../../../../components/sica/MenuLateral/MenuLateral"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { useValidarToken } from "../../../../hooks/useValidarToken/useValidarToken"
import { useValidarRol } from "../../../../hooks/useValidarRol/useValidarRol"
import { MdEdit } from "react-icons/md"
import { RiResetLeftLine } from "react-icons/ri";
import "./VerUsuarios.css"
import { jwtDecode } from "jwt-decode"

// Página del SICA para ver la lista de usuarios
export default function VerUsuarios(){
    useValidarToken() // El usuario debe haber iniciado sesión
    useValidarRol(['superadmin', 'editor', 'lector']) // El usuario debe tener permiso para acceder a esta ruta
    
    const navigate = useNavigate() // Para redireccionar a los usuarios
    const token = localStorage.getItem('token') // Token de inicio de sesión
    const [alumnos, setAlumnos] = useState([]) // Alumnos del sistema
    const [admins, setAdmins] = useState([]) // Administradores del sistema
    const [usuarios, setUsuarios] = useState([]) // Lista completa de usuarios (alumnos y administradores)
    const [identificador, setIdentificador] = useState('Matrícula') // Título de la columna que muestra la matrícula o RFC del usuario
    const [agrupacion, setAgrupacion] = useState('Grupo') // Título de la columna que muestra el rol o grupo del usuario

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

    useEffect(() => { // Se obtienen los administradores del backend si el usuario es superadmin
        const tokenDecodificado = jwtDecode(token)
        if(tokenDecodificado.rol === 'superadmin'){
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
        }
    }, [])

    useEffect(() => { // Se unen la lista de alumnos y la lista de administradores en una sola lista
        let adminsConTipo = []
        let alumnosConTipo = []
        if(admins.length !== 0){
            adminsConTipo = admins.map(a => ({ ...a, tipo: "Administrador" }))    
        }
        if(alumnos.length !== 0){
            alumnosConTipo = alumnos.map(a => ({ ...a, tipo: "Alumno" }))
        }
        setUsuarios([...alumnosConTipo, ...adminsConTipo]) // Se les agrega el tipo antes de almacenarlos

        const tokenDecodificado = jwtDecode(token)
        if(tokenDecodificado.rol === 'superadmin'){
            setIdentificador("Matrícula/RFC")
            setAgrupacion("Grupo/Rol")
        }
    }, [alumnos, admins])

    // Método para redirigir al usuario a la página de edición del usuario seleccionado
    const redirigirAEdicion = (usuario) => {
        if (usuario.tipo === "Alumno") {
        navigate(`/SICA/administradores/editar-alumno/${usuario._id}`)
        } else if (usuario.tipo === "Administrador") {
        navigate(`/SICA/administradores/editar-administrador/${usuario._id}`)
        }
    }

    // Método para reiniciar la contraseña de un usuario (Que la contraseña sea su RFC o Matrícula)
    const reiniciarContrasena = (usuario) => {
        const confirmacion = confirm( // El usuario debe confirmar el reinicio de contraseña
            `¿Estás seguro que quieres reiniciar la contraseña de ${usuario.nombre} (${usuario.tipo})?`
        )
        if (!confirmacion) return
        
        let url = ""
        if (usuario.tipo === "Alumno") {
            url=`http://localhost:3000/api/alumnos/reiniciar-contrasena/${usuario._id}`
        } else if (usuario.tipo === "Administrador") {
            url=`http://localhost:3000/api/admins/reiniciar-contrasena/${usuario._id}`
        }

        fetch(url, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(async res => {
            if(res.ok){
                alert("Contraseña reiniciada correctamente")
            } else {
                console.error(await res.json().catch(()=>null))
                alert("Ocurrió un error al reiniciar la contraseña")
            }
        })
    }

    if(usuarios.length === 0){ // Mientras no haya usuarios cargados se muestra un mensaje de carga
        return(
            <>
                <MenuLateral/>
                <div className="contenido-principal">
                    <p>Cargando datos</p>
                </div>
            </>
        )
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
                            <th>{identificador}</th>
                            <th>Nombre</th>
                            <th>Apellido</th>
                            <th>{agrupacion}</th>
                            <th>Editar</th>
                            <th>Reiniciar Contraseña</th>
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
                                <td>
                                    <RiResetLeftLine className="btn-reiniciar-contrasena" onClick={() => reiniciarContrasena(usuario)}/>
                                </td>
                            </tr>
                        ))} 
                    </tbody>
                </table>
            </div>
        </div>
    )
}