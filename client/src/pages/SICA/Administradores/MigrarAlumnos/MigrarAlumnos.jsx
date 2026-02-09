import MenuLateral from '../../../../components/sica/MenuLateral/MenuLateral'
import MensajeCarga from '../../../../components/sica/MensajeCarga/MensajeCarga'
import MensajeEstado from '../../../../components/sica/MensajeEstado/MensajeEstado'
import Select from '../../../../components/sica/Select/Select'
import { obtenerGrupos, migrarAlumnos } from '../../../../api/grupos.api'
import { obtenerAlumnos } from '../../../../api/alumnos.api'
import { useEffect, useState } from 'react'
import { useAuth } from '../../../../auth/useAuth'
import './MigrarAlumnos.css'
import '../../../../assets/styles/global.css'

// Página del SICA para migrar los alumnos de un grupo (sin calificaciones) a otro
export default function MigrarAlumnos() {
    const [grupos, setGrupos] = useState([]) // Grupos del sistema
    const [grupoOrigen, setGrupoOrigen] = useState('') // Grupo donde se encuentran los alumnos a migrar
    const [grupoDestino, setGrupoDestino] = useState('') // Grupo a donde serán migrados los alumnos
    const [alumnos, setAlumnos] = useState([]) // Alumnos del grupo origen
    const [seleccionados, setSeleccionados] = useState([]) // Alumnos seleccionados para migrarlos
    const [esperandoRespuesta, setEsperandoRespuesta] = useState(false)
    const [exito, setExito] = useState(null)
    const [error, setError] = useState(null)

    const {cargando} = useAuth()

    // Método para obtener los grupos de la BD
    const cargarGrupos = async () => {
        try {
            const respuesta = await obtenerGrupos()
            const listaGrupos = [...(respuesta?.grupos ?? [])]
                .sort((a, b) => a.nombre.localeCompare(b.nombre))

            setGrupos(listaGrupos)
        } catch (error) {
            console.error('Error al obtener grupos:', error)
            setError(error.message || 'Error al obtener grupos')
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

    // Método para modificar la lista de alumnos seleccionados
    const manejarCheckbox = (id) => { 
        setSeleccionados(prev =>
            prev.includes(id)
                ? prev.filter(alumnoId => alumnoId !== id)
                : [...prev, id]
        )
    }

    // Método para migrar de grupo los alumnos seleccionados
    const migrar = async () => {
        setEsperandoRespuesta(true)
        setError(null)
        setExito(null)
        
        try {
            await migrarAlumnos({ grupoOrigenId: grupoOrigen, grupoDestinoId: grupoDestino, alumnosIds: seleccionados })
            setExito('Alumnos migrados exitosamente')

            // Limpia el estado
            setSeleccionados([])
            setGrupoOrigen('')
            setGrupoDestino('')
            setAlumnos([])
        } catch (error) {
            console.error('Error al migrar los alumnos:', error)
            setError(error.message || 'Ocurrió un error al migrar los alumnos')
        } finally {
            setEsperandoRespuesta(false)
        }
    }

    useEffect(() => { // Se obtienen los grupos del backend
        cargarGrupos()
    }, [])

    useEffect(() => { // Se obtienen los alumnos del grupo seleccionado
        if(!grupoOrigen) return
        
        cargarAlumnosGrupo(grupoOrigen)
    }, [grupoOrigen])

    if(cargando || grupos.length === 0){ // Mientras no haya grupos cargados se muestra un mensaje de carga
       return(
        <MensajeCarga/>
       ) 
    }
    
    return (
        <div className="contenedor-principal">
            <MenuLateral/>
            <div className="contenido-principal">
                <h1>Migrar alumnos entre grupos</h1>
                <Select
                    className="migrar-alumnos__campo"
                    label="Grupo origen:"
                    value={grupoOrigen}
                    onChange={e => setGrupoOrigen(e.target.value)}
                    options={[
                        { value: '', label: 'Selecciona' },
                        ...grupos.map(
                            g => ({ 
                                value: g._id,
                                label: g.nombre 
                            })
                        )
                    ]}
                    required
                />
                <Select
                    className="migrar-alumnos__campo"
                    label="Grupo destino:"
                    value={grupoDestino}
                    onChange={e => setGrupoDestino(e.target.value)}
                    options={[
                        { value: '', label: 'Selecciona' },
                        ...grupos
                            .filter(g => g._id !== grupoOrigen)
                            .map(g => ({ value: g._id, label: g.nombre }))
                    ]}
                    required
                />
                
                {alumnos.length > 0 && (
                    <div className="migrar-alumnos__contenedor-lista-alumnos">
                        <h2>Selecciona alumnos a migrar:</h2>
                        <ul className="migrar-alumnos__lista-alumnos">
                            {alumnos.map(a => (
                                <li className="migrar-alumnos__alumno" key={a._id}>
                                    <label>{a.nombre} {a.apellido}</label>
                                    <input
                                        className="migrar-alumnos__alumno-checkbox"
                                        type="checkbox"
                                        checked={seleccionados.includes(a._id)}
                                        onChange={() => manejarCheckbox(a._id)}
                                    />
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                <div className="migrar-alumnos__contenedor-botones">
                    <button
                        className="boton--guardar"
                        onClick={migrar}
                        disabled={esperandoRespuesta || !grupoOrigen || !grupoDestino || seleccionados.length === 0}
                    >
                        {esperandoRespuesta ? 'Migrando...' : 'Migrar alumnos'}
                    </button>
                </div>
                <MensajeEstado
                    exito={exito}
                    error={error}
                />
            </div>
        </div>
    )
}