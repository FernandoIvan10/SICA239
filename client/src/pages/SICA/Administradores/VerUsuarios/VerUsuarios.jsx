import MenuLateral from '../../../../components/sica/MenuLateral/MenuLateral'
import MensajeCarga from '../../../../components/sica/MensajeCarga/MensajeCarga'
import MensajeEstado from '../../../../components/sica/MensajeEstado/MensajeEstado'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useMemo } from 'react'
import { MdEdit } from 'react-icons/md'
import { RiResetLeftLine } from 'react-icons/ri'
import { cambiarEstadoAlumno, obtenerAlumnos, reiniciarContrasenaAlumno } from '../../../../api/alumnos.api'
import { obtenerAdministradores, reiniciarContrasenaAdministrador } from '../../../../api/admins.api'
import { useAuth } from '../../../../auth/useAuth'
import './VerUsuarios.css'

// Página del SICA para ver la lista de usuarios
export default function VerUsuarios(){
    const [alumnos, setAlumnos] = useState([]) // Alumnos del sistema
    const [admins, setAdmins] = useState([]) // Administradores del sistema
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [exito, setExito] = useState(null)

    const navigate = useNavigate()
    const {usuario, cargando} = useAuth() // usuario autenticado

    // Método para obtener los alumnos de la BD
    const cargarAlumnos = async () => {
        try{
            const respuesta = await obtenerAlumnos()
            setAlumnos(respuesta)
        }catch(error){
            console.error('Error al obtener alumnos:', error)
            setError(error.message || 'Error al obtener alumnos')
            setAlumnos([])
        }
    }

    // Método para obtener los administradores de la BD
    const cargarAdmins = async () => {
        try{
            const respuesta = await obtenerAdministradores()
            setAdmins(respuesta)
        }catch(error){
            console.error('Error al obtener administradores:', error)
            setError(error.message || 'Error al obtener administradores')
            setAdmins([])
        }
    }

    // Método para redirigir a la página de edición del usuario seleccionado
    const redirigirAEdicion = (usuario) => {
        if (usuario.tipo === 'Alumno') {
        navigate(`/SICA/administradores/editar-alumno/${usuario._id}`)
        } else if (usuario.tipo === 'Administrador') {
        navigate(`/SICA/administradores/editar-administrador/${usuario._id}`)
        }
    }

    // Método para reiniciar la contraseña de un usuario (Que la contraseña sea su RFC o Matrícula)
    const reiniciarContrasena = async (usuario) => {
        const confirmacion = confirm( // El usuario debe confirmar el reinicio de contraseña
            `¿Estás seguro que quieres reiniciar la contraseña de ${usuario.nombre} (${usuario.tipo})?`
        )
        if (!confirmacion) return

        try {
            setLoading(true)

            if (usuario.tipo === 'Alumno') {
                await reiniciarContrasenaAlumno(usuario._id)
            } else if (usuario.tipo === "Administrador") {
                await reiniciarContrasenaAdministrador(usuario._id)
            }

            setExito(`Contraseña de ${usuario.nombre} reiniciada correctamente`)
        } catch (error) {
            console.error('Error al reiniciar constraseña:', error)
            setError(error.message || 'Ocurrió un error al reiniciar contraseña')
        }finally {
            setLoading(false)
        }
    }

    // Método para dar de baja o de alta a un alumno
    const cambiarEstado = async (usuario) => {
        const confirmacion = confirm( // El usuario debe confirmar el cambio de estado
            `¿Estás seguro que quieres cambiar el estado de ${usuario.nombre}?`
        )
        if (!confirmacion) return

        try{
            setLoading(true)
            await cambiarEstadoAlumno(usuario._id)
            setAlumnos(prevAlumnos => 
                prevAlumnos.map(alumno => 
                    alumno._id === usuario._id
                        ? {...alumno, activo: !alumno.activo}
                        : alumno
                )
            )
            setExito(`Estado de ${usuario.nombre} cambiado correctamente`)
        }catch(error){
            console.error('Error al cambiar estado del alumno:', error)
            setError(error.message || 'Ocurrió un error al cambiar el estado del alumno')
        }finally{
            setLoading(false)
        }
    }

    useEffect(() => { // Se cargan los usuarios cuando el componente se monta
        if(!cargando && usuario){
            cargarAlumnos()
            if(usuario.rol === 'superadmin'){ // Solo los superadministradores pueden ver a los administradores
                cargarAdmins()
            }
            setLoading(false)
        }
    }, [usuario])

    const usuarios = useMemo(() => { // Arreglo de usuarios (alumnos y administradores)
        let adminsConTipo = admins.map(a => ({
            ...a,
            tipo: 'Administrador' 
        }))

        let alumnosConTipo = alumnos.map(a => ({
            ...a,
            tipo: 'Alumno' 
        }))

        let combinados = [...adminsConTipo, ...alumnosConTipo]

        if(usuario.rol === 'lector'){ // Si el usuario es lector, solo se muestran los alumnos activos
            combinados = combinados.filter(u => u.activo)
        }

        return combinados.sort((a, b) => {
            if (a.tipo === 'Alumno' && b.tipo === 'Alumno') {
                return a.grupoId.nombre.localeCompare(b.grupoId.nombre)
            }
            return 0
        })
    }, [admins, alumnos, usuario.rol])

    if(!usuario || cargando){ // Si no hay usuario autenticado o se está cargando, se muestra un mensaje de carga
        return <MensajeCarga/>
    }

    if(usuarios.length === 0){ // Mientras no haya usuarios cargados se muestra un mensaje de carga
        return <MensajeCarga mensaje="Obteniendo usuarios..."/>
    }

    return(
        <div className="contenedor-principal">
            <MenuLateral/>
            <div className="contenido-principal">
                <h1>{usuario.rol === "superadmin" ? "Lista de Usuarios" : "Lista de alumnos"}</h1>
                <MensajeEstado 
                    error={error} 
                    exito={exito}
                />
                <table className="tabla-usuarios">
                    <thead>
                        <tr>
                            <th>#</th>
                            {usuario.rol === "superadmin" && <th>Tipo</th>}
                            <th>{usuario.rol === "superadmin" ? "Matrícula/RFC" : "Matrícula"}</th>
                            <th>Nombre</th>
                            <th>Apellido</th>
                            <th>{usuario.rol === "superadmin" ? "Grupo/Rol" : "Grupo"}</th>
                            {usuario.rol !== "lector" && <th>Editar</th>}
                            {usuario.rol !== "lector" && <th>Reiniciar Contraseña</th>}
                            {usuario.rol !== "lector" && <th>Alta/Baja</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {usuarios.map((u, index) => (
                            <tr key={u._id || u.id || index}>
                                <td>{index + 1}</td>
                                {usuario.rol === "superadmin" && <td>{u.tipo}</td>}
                                <td>{u.tipo === "Alumno" ? u.matricula : u.rfc}</td>
                                <td>{u.nombre}</td>
                                <td>{u.apellido}</td>
                                <td>{u.tipo === "Alumno" ? u.grupoId.nombre : u.rol}</td>
                                {usuario.rol !== "lector" && 
                                    <td>
                                        <MdEdit 
                                            className="tabla-usuarios__boton-editar" 
                                            onClick={() => redirigirAEdicion(u)}
                                            disabled={loading}
                                        />
                                    </td>
                                }
                                {usuario.rol !== "lector" && 
                                    <td>
                                        <RiResetLeftLine
                                            className="tabla-usuarios__boton-reiniciar-contraseña"
                                            onClick={() => reiniciarContrasena(u)}
                                            disabled={loading}
                                        />
                                    </td>
                                }
                                {usuario.rol !== "lector" && (
                                    <td
                                        onClick={() => {
                                            if (u.tipo === "Alumno") {
                                                cambiarEstado(u)
                                            }
                                        }}
                                        className={`tabla-usuarios__estado-alumno ${
                                            u.tipo === "Alumno"
                                                ? (u.activo ? "baja" : "alta")
                                                : ""
                                        }`}
                                        disabled={loading}
                                    >
                                        {u.tipo === "Alumno"
                                            ? (u.activo ? "Dar de baja" : "Dar de alta")
                                            : ""}
                                    </td>
                                )}
                            </tr>
                        ))} 
                    </tbody>
                </table>
            </div>
        </div>
    )
}