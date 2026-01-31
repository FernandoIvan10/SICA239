import MenuLateral from '../../../../components/sica/MenuLateral/MenuLateral'
import MensajeCarga from '../../../../components/sica/MensajeCarga/MensajeCarga'
import MensajeEstado from '../../../../components/sica/MensajeEstado/MensajeEstado'
import FormularioAdmin from '../../../../components/sica/FormularioAdmin/FormularioAdmin'
import { editarAdministrador, obtenerAdministradorPorId } from '../../../../api/admins.api'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../../../../auth/useAuth'
import './EditarAdministrador.css'
import '../../../../assets/styles/global.css'

// Página del SICA para editar usuarios administradores
export default function EditarAdministrador() {
    const [admin, setAdmin] = useState(null) // Contiene todos los datos del formulario
    const [esperandoRespuesta, setEsperandoRespuesta] = useState(true)
    const [error, setError] = useState(null)
    const [exito, setExito] = useState(null)
    
    const navigate = useNavigate() // Para redireccionar a los usuarios
    const { id } = useParams() // ID enviado por parámetro
    const {cargando} = useAuth() // Usuario autenticado

    // Método para obtener los datos del administrador a editar
    const cargarAdmin = async (id) => {
        try{
            const administrador = await obtenerAdministradorPorId(id)
            setAdmin({
                rfc: administrador.rfc,
                nombre: administrador.nombre,
                apellido: administrador.apellido,
                rol: administrador.rol
            })
        }catch(error){
            console.error('Error al obtener administrador:', error)
            setError('Error al obtener administrador')
        }finally{
            setEsperandoRespuesta(false)
        }
    }

    // Método para editar el administrador con los nuevos datos
    const guardarCambios = async (rfc, nombre, apellido, rol) => {
        setEsperandoRespuesta(true)
        setError(null)
        setExito(null)

        try{
            await editarAdministrador(id, {nombre, apellido, rol})
            setExito('Administrador editado correctamente')
            navigate('/SICA/administradores/ver-usuarios')
        }catch(error){
            console.error('Error al editar administrador:', error)
            setError(error.message || 'Error al editar administrador')
        }finally{
            setEsperandoRespuesta(false)
        }
    }

    // Método para regresar a la lista de usuarios
    const cancelar = () => {
        navigate('/SICA/administradores/ver-usuarios')
    }

    useEffect(() => { // Se obtienen los datos del administrador a editar
        if(!cargando){
            cargarAdmin(id)
        }
    }, [id, cargando])

    if (!admin || cargando){ // Mientras no se carguen los datos del administrador se muestra un mensaje de carga
        return(
            <MensajeCarga/>
        )
    }

    return (
        <div className="contenedor-principal">
            <MenuLateral/>
            <div className="contenido-principal">
                <h1>Editar Administrador</h1>
                <MensajeEstado
                    error={error}
                    exito={exito}
                />
                <FormularioAdmin
                    RFC={admin.rfc}
                    nombre={admin.nombre}
                    apellido={admin.apellido}
                    rol={admin.rol}
                    onSubmit={guardarCambios}
                    cancelar={cancelar}
                    cargando={esperandoRespuesta}
                    rfcDisabled={true}
                />
            </div>
        </div>
    )
}