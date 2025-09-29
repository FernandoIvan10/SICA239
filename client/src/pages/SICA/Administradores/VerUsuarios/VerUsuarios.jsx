import MenuLateral from '../../../../components/sica/MenuLateral/MenuLateral'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useValidarToken } from '../../../../hooks/useValidarToken/useValidarToken'
import { useValidarRol } from '../../../../hooks/useValidarRol/useValidarRol'
import { MdEdit } from 'react-icons/md'
import { RiResetLeftLine } from 'react-icons/ri'
import './VerUsuarios.css'
import { jwtDecode } from 'jwt-decode'
import MensajeCarga from '../../../../components/sica/MensajeCarga/MensajeCarga'

// Página del SICA para ver la lista de usuarios
export default function VerUsuarios(){
    useValidarToken() // El usuario debe haber iniciado sesión
    useValidarRol(['superadmin', 'editor', 'lector']) // El usuario debe tener permiso para acceder a esta ruta
    
    const navigate = useNavigate() // Para redireccionar a los usuarios
    const token = localStorage.getItem('token') // Token de inicio de sesión
    const tokenDecodificado = jwtDecode(token)
    const [alumnos, setAlumnos] = useState([]) // Alumnos del sistema
    const [admins, setAdmins] = useState([]) // Administradores del sistema
    const [usuarios, setUsuarios] = useState([]) // Lista completa de usuarios (alumnos y administradores)

    useEffect(() => { // Se obtienen los alumnos del backend
        fetch('http://localhost:3000/api/alumnos', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(async res => {
            const data = await res.json()

            if(!res.ok){
                alert(data.mensaje || 'Error al obtener alumnos')
                setAlumnos([])
                return
            }

            setAlumnos(data)
        })
        .catch(err => {
            console.error('Error al obtener alumnos:', err)
            alert('No se pudo conectar con el servidor.')
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
        .then(async res => {
            const data = await res.json()
            
            if (!res.ok) {
                alert(data.mensaje || 'Error al obtener administradores')
                setAdmins([])
                return
            }

            setAdmins(data)
        })
        .catch(err => {
            console.error('Error al obtener administradores:', err)
            alert('No se pudo conectar con el servidor')
            setAdmins([])
        })
        }
    }, [])

    useEffect(() => { // Se unen la lista de alumnos y la lista de administradores en una sola lista
        let adminsConTipo = []
        let alumnosConTipo = []
        if(admins.length !== 0){
            adminsConTipo = admins.map(a => ({ ...a, tipo: 'Administrador' }))
        }
        if(alumnos.length !== 0){
            alumnosConTipo = alumnos.map(a => ({ ...a, tipo: 'Alumno' }))
        }
        setUsuarios([...alumnosConTipo, ...adminsConTipo]) // Se les agrega el tipo antes de almacenarlos
    }, [alumnos, admins])

    // Método para redirigir al usuario a la página de edición del usuario seleccionado
    const redirigirAEdicion = (usuario) => {
        if (usuario.tipo === 'Alumno') {
        navigate(`/SICA/administradores/editar-alumno/${usuario._id}`)
        } else if (usuario.tipo === 'Administrador') {
        navigate(`/SICA/administradores/editar-administrador/${usuario._id}`)
        }
    }

    // Método para reiniciar la contraseña de un usuario (Que la contraseña sea su RFC o Matrícula)
    const reiniciarContrasena = (usuario) => {
        const confirmacion = confirm( // El usuario debe confirmar el reinicio de contraseña
            `¿Estás seguro que quieres reiniciar la contraseña de ${usuario.nombre} (${usuario.tipo})?`
        )
        if (!confirmacion) return
        
        let url = ''
        if (usuario.tipo === 'Alumno') {
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
            const data = await res.json()
            if(!res.ok){
                console.error(await res.json().catch(()=>null))
                alert(data.mensaje || 'Ocurrió un error al reiniciar la contraseña')
                return
            }
                alert('Contraseña reiniciada correctamente')
        })
        .catch(err => {
            console.error('Error al reiniciar constraseña:', err)
            alert('No se pudo conectar con el servidor')
        })
    }

    if(usuarios.length === 0){ // Mientras no haya usuarios cargados se muestra un mensaje de carga
        return(
            <MensajeCarga/>
        )
    }
    return(
        <div className="contenedor-principal">
            <MenuLateral/>
            <div className="contenido-principal">
                <h1>{tokenDecodificado.rol === "superadmin" ? "Lista de Usuarios" : "Lista de alumnos"}</h1>
                <table className="tabla-usuarios">
                    <thead>
                        <tr>
                            <th>#</th>
                            {tokenDecodificado.rol === "superadmin" && <th>Tipo</th>}
                            <th>{tokenDecodificado.rol === "superadmin" ? "Matrícula/RFC" : "Matrícula"}</th>
                            <th>Nombre</th>
                            <th>Apellido</th>
                            <th>{tokenDecodificado.rol === "superadmin" ? "Grupo/Rol" : "Grupo"}</th>
                            {tokenDecodificado.rol !== "lector" && <th>Editar</th>}
                            {tokenDecodificado.rol !== "lector" && <th>Reiniciar Contraseña</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {usuarios.map((usuario, index) => (
                            <tr key={usuario._id || usuario.id || index}>
                                <td>{index + 1}</td>
                                {tokenDecodificado.rol === "superadmin" && <td>{usuario.tipo}</td>}
                                <td>{usuario.tipo === "Alumno" ? usuario.matricula : usuario.rfc}</td>
                                <td>{usuario.nombre}</td>
                                <td>{usuario.apellido}</td>
                                <td>{usuario.tipo === "Alumno" ? usuario.grupoId.nombre : usuario.rol}</td>
                                {tokenDecodificado.rol !== "lector" && 
                                    <td>
                                        <MdEdit className="tabla-usuarios-boton-editar" onClick={() => redirigirAEdicion(usuario)}/>
                                    </td>
                                }
                                {tokenDecodificado.rol !== "lector" && 
                                    <td>
                                        <RiResetLeftLine className="boton-reiniciar-contrasena" onClick={() => reiniciarContrasena(usuario)}/>
                                    </td>
                                }
                            </tr>
                        ))} 
                    </tbody>
                </table>
            </div>
        </div>
    )
}