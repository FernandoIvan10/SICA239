import MenuLateral from '../../../../components/sica/MenuLateral/MenuLateral'
import MensajeCarga from '../../../../components/sica/MensajeCarga/MensajeCarga'
import MensajeEstado from '../../../../components/sica/MensajeEstado/MensajeEstado'
import { obtenerGrupos } from '../../../../api/grupos.api'
import { obtenerAlumnos } from '../../../../api/alumnos.api'
import { capturarCalificacion, obtenerCalificaciones } from '../../../../api/calificaciones.api'
import { useEffect, useState } from 'react'
import { useAuth } from '../../../../auth/useAuth'
import '../../../../assets/styles/global.css'
import './CapturarCalificaciones.css'

// Página del SICA para capturar calificaciones
export default function CapturarCalificaciones(){
    const [grupos, setGrupos] = useState([]) // Grupos obtenidos del backend
    const [grupoSeleccionado, setGrupoSeleccionado] = useState('')
    const [parciales] = useState(['Parcial 1', 'Parcial 2', 'Parcial 3', 'Parcial 4', 'Parcial 5'])
    const [parcialSeleccionado, setParcialSeleccionado] = useState('Parcial 1')
    const [alumnos, setAlumnos] = useState([]) // Alumnos del grupo seleccionado
    const [materias, setMaterias] = useState([]) // Materias del grupo seleccionado
    const [calificaciones, setCalificaciones] = useState({}) // Calificaciones del grupo seleccionado
    const [exito, setExito] = useState(null)
    const [error, setError] = useState(null)
    const [esperandoRespuesta, setEsperandoRespuesta] = useState(true)

    const {cargando, usuario} = useAuth() // Usuario autenticado

    // Método para obtener los grupos de la BD
    const cargarGrupos = async () => {
        try{
            const respuesta = await obtenerGrupos()
            const gruposFiltrados = respuesta.grupos.filter(g => g.nombre !== "Egresados")
            gruposFiltrados.sort((a, b) => { // Los grupos deben estar ordenados por nombre
                return a.nombre.localeCompare(b.nombre)
            })
            setGrupos(gruposFiltrados)
        }catch(error){
            console.error('Error al cargar los grupos:', error)
            setError(error.message || 'Error al cargar los grupos')
            setGrupos([])
        }
    }

    // Método para obtener los alumnos de un grupo
    const cargarAlumnosGrupo = async (grupoId) => {
        try{
            const respuesta = await obtenerAlumnos({ grupoId })
            setAlumnos(respuesta)
        }catch(error){
            console.error('Error al cargar los alumnos del grupo:', error)
            setError(error.message || 'Error al cargar los alumnos del grupo')
            setAlumnos([])
        }
    }

    // Método para obtener las calificaciones de un grupo
    const cargarCalificacionesGrupo = async (grupoId) => {
        try{
            const respuesta = await obtenerCalificaciones({ grupoId })

            // Formatear las calificaciones para un acceso más sencillo
             const calificacionesFormateadas = {}

            for (const c of respuesta) {
                const parcialData = c.parciales?.find(
                    p => p.parcial === parcialSeleccionado
                )
                if (!parcialData) continue

                const alumnoId =
                    typeof c.alumnoId === 'object' ? c.alumnoId._id : c.alumnoId
                const materiaId =
                    typeof c.materiaId === 'object' ? c.materiaId._id : c.materiaId

                if (!calificacionesFormateadas[alumnoId]) {
                    calificacionesFormateadas[alumnoId] = {}
                }

                calificacionesFormateadas[alumnoId][materiaId] = {
                    nota: parcialData.nota,
                    calificacionId: c._id
                }
            }

            setCalificaciones(calificacionesFormateadas)
        }catch(error){
            console.error('Error al cargar las calificaciones del grupo:', error)
            setError(error.message || 'Error al cargar las calificaciones del grupo')
        }
    }

    // Método para cambiar las calificaciones a nivel local
    const manejarCambiosCalificaciones = (alumnoId, materiaId, nota) => {
        setCalificaciones(prev => {
            const previa = prev[alumnoId]?.[materiaId] || {}
            return {
                ...prev,
                [alumnoId]: {
                    ...prev[alumnoId],
                    [materiaId]: {
                        ...previa,
                        nota
                    }
                }
            }
        })
    }
    
    // Método para guardar los cambios en las calificaciones
    const guardarCalificaciones = async (grupoId, parcial, alumnos, materias) => {
        if (!grupoId || !parcial) {
            setError('Selecciona un grupo y un parcial antes de guardar.')
            return
        }

        try{
            setEsperandoRespuesta(true)
            setError(null)
            setExito(null)
            let totalGuardadas = 0

            for (const alumno of alumnos) {
                const materiasAlumno = materias.filter(materia => {
                    // Alumno regular del grupo → todas las materias
                    if (alumno.grupoId?._id === grupoId) {
                        return true
                    }

                    // Alumno recursador → solo materias recursadas
                    return alumno.materiasRecursadas?.some(mr =>
                        mr.grupo?.toString() === grupoId &&
                        mr.materia?.toString() === materia._id
                    )
                })

                for (const materia of materiasAlumno) {
                    const calificacionData = calificaciones[alumno._id]?.[materia._id]
                    if (!calificacionData || calificacionData.nota === '' || calificacionData.nota === undefined) continue

                    const body = {
                        alumnoId: alumno._id,
                        materiaId: materia._id,
                        grupoId: grupoId,
                        parcial: parcial,
                        nota: Number(calificacionData.nota)
                    }

                    await capturarCalificacion(body)
                    totalGuardadas++
                }
            }
            
            if(totalGuardadas === 0){
                setError('No hay calificaciones para guardar.')
                return
            }

            setExito('Calificaciones guardadas.')
        }catch (error) {
            console.error('Error al guardar calificaciones:', error)
            setError(error.message || 'Error al guardar calificaciones')
        } finally {
            setEsperandoRespuesta(false)
        }
    }

    useEffect(()=>{ // Se obtienen los grupos del backend
        cargarGrupos()
        setEsperandoRespuesta(false)
    }, [])
     
    useEffect(()=>{ // Se obtienen los alumnos y materias del grupo seleccionado
        if(grupoSeleccionado){
            cargarAlumnosGrupo(grupoSeleccionado)
            // Actualizar materias según el grupo seleccionado
            const grupo = grupos.find(g => g._id === grupoSeleccionado)
            if (grupo){
                setMaterias(grupo.materias)
            }
        }
    }, [grupoSeleccionado])

    useEffect(() => { // Se obtienen las calificaciones del grupo y parcial seleccionados
        if (!grupoSeleccionado || !parcialSeleccionado) return
	    setCalificaciones({})

        cargarCalificacionesGrupo(grupoSeleccionado)
    }, [grupoSeleccionado, parcialSeleccionado])

    if(cargando || !usuario){ // Mientras esté cargando el usuario se muestra un mensaje de carga
        return(
            <MensajeCarga/>
        )
    }

    if(grupos.length === 0){ // Mientras no haya grupos cargados se muestra un mensaje de carga
        return(
            <MensajeCarga/>
        )
    }

    return (
        <div className="contenedor-principal">
            <MenuLateral/>
            <div className="contenido-principal">
                <h1>Capturar Calificaciones</h1>
                <MensajeEstado
                    error={error}
                    exito={exito} 
                />
                <div className="tabla-calificaciones__selectores">
                    <select 
                        value={grupoSeleccionado}
                        onChange={e => setGrupoSeleccionado(e.target.value)}
                        disabled={esperandoRespuesta}
                    >
                        <option value="">Seleccionar grupo</option>
                        {grupos.map(grupo => (
                            <option key={grupo._id} value={grupo._id}>{grupo.nombre}</option>
                        ))}
                    </select>
                    <select
                        value={parcialSeleccionado}
                        onChange={e => setParcialSeleccionado(e.target.value)}
                        disabled={esperandoRespuesta}
                    >
                        <option value="">Seleccionar parcial</option>
                        {parciales.map((parcial, i) => (
                            <option key={i} value={parcial}>{parcial}</option>
                        ))}
                    </select>
                </div>
                <table className="tabla-calificaciones">
                    <thead>
                        <tr>
                            <th>Alumno</th>
                            {materias.map(materia => (
                                <th key={materia._id}>{materia.nombre}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {alumnos.map(alumno => (
                            <tr key={alumno._id}>
                                <td>{alumno.nombre} {alumno.apellido}</td>
                                {materias.map(materia => {
                                    const esDelGrupo = alumno.grupoId?._id === grupoSeleccionado
                                    const esRecursada = alumno.materiasRecursadas?.some(mr => 
                                        mr.grupo?.toString() === grupoSeleccionado && mr.materia?.toString() === materia._id
                                    )
                                    if (!esDelGrupo && !esRecursada) {
                                        return <td key={materia._id}>-</td>
                                    }
                                    const value = typeof calificaciones[alumno._id]?.[materia._id]?.nota === 'number'
                                        ? calificaciones[alumno._id][materia._id].nota
                                        : undefined
                                    return (
                                        <td key={materia._id}>
                                            <input
                                                type="number"
                                                min="0"
                                                max="10"
                                                value={calificaciones[alumno._id]?.[materia._id]?.nota ?? ''}
                                                onChange={e => manejarCambiosCalificaciones(
                                                    alumno._id,
                                                    materia._id,
                                                    e.target.value === '' ? '' : Number(e.target.value)
                                                )}
                                                disabled={usuario.rol === "lector" || esperandoRespuesta}
                                            />
                                        </td>
                                    )
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
                {usuario.rol !== "lector" && 
                    <button
                        className="tabla-calificaciones__boton-guardar"
                        onClick={() => guardarCalificaciones(grupoSeleccionado, parcialSeleccionado, alumnos, materias)}
                        disabled={esperandoRespuesta}
                    >
                        Guardar Calificaciones
                    </button>
                }
            </div>
        </div>
    )
}
