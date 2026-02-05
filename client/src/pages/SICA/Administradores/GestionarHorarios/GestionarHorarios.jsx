import MenuLateral from '../../../../components/sica/MenuLateral/MenuLateral'
import MensajeCarga from '../../../../components/sica/MensajeCarga/MensajeCarga'
import MensajeEstado from '../../../../components/sica/MensajeEstado/MensajeEstado'
import { obtenerGrupos } from '../../../../api/grupos.api'
import { obtenerHorarios, guardarHorario, eliminarHorario } from '../../../../api/horarios.api'
import { useEffect, useState } from 'react'
import { useAuth } from '../../../../auth/useAuth'
import '../../../../assets/styles/global.css'
import './GestionarHorarios.css'

// Página del sica para gestionar los horarios de los grupos
export default function GestionarHorarios(){
    const [grupos, setGrupos] = useState([]) // Grupos del sistema
    const [horarios, setHorarios] = useState([]) // Horarios de la BD
    const [esperandoRespuesta, setEsperandoRespuesta] = useState(false)
    const [exito, setExito] = useState(null)
    const [error, setError] = useState(null)

    const {cargando, usuario} = useAuth()

    // Método para obtener los grupos de la BD
    const cargarGrupos = async () => {
        try{
            const respuesta = await obtenerGrupos()
            
            // El grupo de egresados no debe aparecer en esta pantalla
            const gruposFiltrados = respuesta.grupos.filter(g => g.nombre !== "Egresados")
            gruposFiltrados.sort((a, b) => { // Los grupos deben estar ordenados por nombre
                return a.nombre.localeCompare(b.nombre)
            })

            setGrupos(gruposFiltrados)
        }catch(error){
            console.error('Error al cargar los grupos:', error)
            setError(error.message || 'Error al cargar los grupos')
        }
    }

    // Método para obtener los horarios de la BD
    const cargarHorarios = async () => {
        try{
            const respuesta = await obtenerHorarios()
            setHorarios(respuesta)
        }catch(error){
            console.error('Error al cargar los horarios:', error)
            setError(error.message || 'Error al cargar los horarios')
        }
    }

    // Método para obtener el horario de un grupo específico
    const obtenerHorarioDeGrupo = (grupoId) => {
        if (!horarios || horarios.length === 0) return null // Tiene que existir al menos un horario
        return horarios.find(h => h.grupo._id === grupoId)
    }

    // Método para subir el horario de un grupo
    const subirHorario = async (grupoId, file) => {
        try{
            setError(null)
            setExito(null)
            setEsperandoRespuesta(true)

            const formData = new FormData()
            formData.append('imagen', file)
            formData.append('grupoId', grupoId)

            await guardarHorario(formData)
            cargarHorarios()
            setExito('Horario establecido exitosamente')
        }catch(error){
            console.error('Error al subir el horario:', error)
            setError(error.message || 'Ocurrió un error al subir el horario') 
        }finally{
            setEsperandoRespuesta(false)
        }
    }

    // Método para eliminar un horario
    const quitarHorario = async (horarioId) => {
        try{
            setError(null)
            setExito(null)
            setEsperandoRespuesta(true)

            await eliminarHorario(horarioId)
            cargarHorarios()
            setExito('Horario eliminado exitosamente')
        }catch(error){
            console.error('Error al eliminar el horario:', error)
            setError(error.message || 'Ocurrió un error al eliminar el horario') 
        }finally{
            setEsperandoRespuesta(false)
        }
    }


    useEffect(() => { // Se obtienen los grupos del backend
        cargarGrupos()
        cargarHorarios()
        setEsperandoRespuesta(false)
    }, [])

    if(
        cargando
        || !usuario
        || grupos.length === 0
    ){ // Mientras se esté autenticando el usuario se muestra un mensaje de carga
        return (
            <MensajeCarga/>
        )
    }

    return(
        <div className="contenedor-principal">
            <MenuLateral/>
            <div className="contenido-principal">
                <h1>Horarios</h1>
                <p>Nota: Espera a que el horario se haya subido completamente antes de cambiar de página</p>
                <MensajeEstado
                    exito={exito}
                    error={error}
                />
                <table className="tabla-horarios">
                    <thead>
                        <tr>
                        <th>Grupo</th>
                        <th>Horario</th>
                        {usuario.rol !== "lector" && <th>Acciones</th>}
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
                                {usuario.rol !== "lector" && 
                                    <td>
                                        {!horario && (
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => subirHorario(grupo._id, e.target.files[0])}
                                                disabled={esperandoRespuesta}
                                            />
                                        )}
                                        {horario && (
                                        <button 
                                            onClick={() => quitarHorario(horario._id)}
                                            disabled={esperandoRespuesta}
                                        >
                                            Eliminar
                                        </button>
                                        )}
                                    </td>
                                }
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}