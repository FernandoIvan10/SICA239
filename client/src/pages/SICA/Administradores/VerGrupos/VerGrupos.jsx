import MenuLateral from '../../../../components/sica/MenuLateral/MenuLateral'
import MensajeCarga from '../../../../components/sica/MensajeCarga/MensajeCarga'
import MensajeEstado from '../../../../components/sica/MensajeEstado/MensajeEstado'
import {obtenerGrupos, eliminarGrupo} from '../../../../api/grupos.api'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { MdEdit, MdDelete } from 'react-icons/md'
import { useAuth } from '../../../../auth/useAuth'
import './VerGrupos.css'

// Página del sica para ver la lista de grupos
export default function VerGrupos(){
    const [grupos, setGrupos] = useState([]) // Grupos del sistema
    const [esperandoRespuesta, setEsperandoRespuesta] = useState(true)
    const [exito, setExito] = useState(null)
    const [error, setError] = useState(null)

    const navigate = useNavigate()
    const {cargando, usuario} = useAuth()

    // Método para obtener los grupos del backend
    const cargarGrupos = async () => {
        try{
            const respuesta = await obtenerGrupos()

            // El grupo de egresados no debe aparecer en esta pantalla
            const gruposFiltrados = respuesta.grupos.filter(g => g.nombre !== "Egresados")

            gruposFiltrados.sort((a, b) => { // La lista de grupos debe estar ordenada por nombre
                return a.nombre.localeCompare(b.nombre)
            })

            setGrupos(gruposFiltrados)
        }catch(error){
            console.error('Error al cargar los grupos:', error)
            setError(error.message || 'No se pudo cargar la lista de grupos.')
        }
    }

    // Método para eliminar un grupo
    const quitarGrupo = async (id) => {
        const confirmar = window.confirm('¿Estás seguro de que quieres eliminar este grupo? (Esta acción es irreversible)') // Se avierte al usuario que eliminar el grupo es irreversible
        if (!confirmar) return

        try{
            await eliminarGrupo(id)
            cargarGrupos() // Se recarga la lista de grupos
            setExito('Grupo eliminado correctamente')
        }catch(error){
            console.error('Error al eliminar el grupo:', error)
            setError(error.message || 'No se pudo eliminar el grupo.')
        }
    }

    useEffect(() => { // Se obtienen los grupos del backend
        if(cargando || !usuario) return

        cargarGrupos()
        setEsperandoRespuesta(false)
    }, [])

    if(cargando || !usuario){ // Mientras se está cargando el usuario se muestra un mensaje de carga
        return(
            <MensajeCarga mensaje="Cargando..."/>
        )
    }

    if(grupos.length === 0){ // Mientras no haya grupos cargados se muestra un mensaje de carga
        return(
            <MensajeCarga mensaje="Obteniendo grupos..."/>
        )
    }
    
    return(
        <div className="contenedor-principal">
            <MenuLateral/>
            <div className="contenido-principal">
                <h1>{usuario.rol !== "lector" ? "Gestionar Grupos" : "Lista de Grupos"}</h1>
                <MensajeEstado
                    exito={exito}
                    error={error}
                />
                <table className="tabla-grupos">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Nombre del Grupo</th>
                            <th>Materias</th>
                            {usuario.rol !== "lector" && <th>Acciones</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {grupos.map((grupo, index) => (
                            <tr key={grupo._id}>
                                <td>{index + 1}</td>
                                <td>{grupo.nombre}</td>
                                <td>{grupo.materias.map((materia) => materia.nombre).join(', ')}</td>
                                {usuario.rol !== "lector" && 
                                    <td>
                                        <MdEdit 
                                            className="tabla-grupos__boton-editar"
                                            onClick={() => navigate("/SICA/administradores/editar-grupo", { state: { grupo } })}
                                            disabled={esperandoRespuesta}
                                        />
                                        <MdDelete 
                                            className="tabla-grupos__boton-eliminar"
                                            onClick={() => quitarGrupo(grupo._id)}
                                            disabled={esperandoRespuesta}
                                        />
                                    </td>
                                }
                            </tr>
                        ))}
                    </tbody>
                </table>
                {usuario.rol !== "lector" && 
                    <button
                        className="tabla-grupos__boton-agregar"
                        onClick={() => navigate("/SICA/administradores/agregar-grupo")}
                        disabled={esperandoRespuesta}
                    >
                        Agregar Grupo
                    </button>
                }
            </div>
        </div>
    )
}