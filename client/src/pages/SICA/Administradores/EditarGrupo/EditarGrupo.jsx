import MenuLateral from '../../../../components/sica/MenuLateral/MenuLateral'
import FormularioGrupo from '../../../../components/sica/FormularioGrupo/FormularioGrupo'
import MensajeCarga from '../../../../components/sica/MensajeCarga/MensajeCarga'
import MensajeEstado from '../../../../components/sica/MensajeEstado/MensajeEstado'
import { useAuth } from '../../../../auth/useAuth'
import {obtenerMaterias} from '../../../../api/materias.api'
import {editarGrupo, obtenerGrupoPorId} from '../../../../api/grupos.api'
import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import '../../../../assets/styles/global.css'

// Página del SICA para editar grupos
export default function EditarGrupo() {
    const [materias, setMaterias] = useState([]) // Materias globales
    const [grupo, setGrupo] = useState(null) // Datos del grupo a editar
    const [esperandoRespuesta, setEsperandoRespuesta] = useState(true)
    const [exito, setExito] = useState(null)
    const [error, setError] = useState(null)

    const {id} = useParams() // Grupo enviado por parámetro
    const {cargando} = useAuth()
    const navigate = useNavigate()

    // Método para obtener el grupo de la BD
    const cargarGrupo = async () => {
        try{
            const respuesta = await obtenerGrupoPorId(id)
            setGrupo(respuesta)
        }catch(error){
            console.error('Error al cargar grupo:', error)
            setError(error.message || 'Error al cargar grupo.')
        }
    }

    // Método para obtener las materias de la BD
    const cargarMaterias = async () => {
        try{
            const respuesta = await obtenerMaterias()
            setMaterias(respuesta.materias.map(m => m.nombre)) // El formulario trabaja con los nombres de las materias
        }catch(error){
            console.log('Error al cargar materias:', error)
            setError(error.message || 'Error al cargar materias.')
            setMaterias([])
        }
    }

    // Método para editar el grupo con los nuevos datos
    const guardarCambios = async (nuevoNombre, nuevoSemestre, nuevasMaterias) => {
        if(
            !nuevoNombre.trim()
            || !nuevoSemestre.trim()
            || nuevasMaterias.length === 0
        ){ // Se deben rellenar el formulario
            setError('Faltan campos obligatorios.')
            return
        }

        try{
            setEsperandoRespuesta(true)
            setError(null)
            setExito(null)

            await editarGrupo(
                id, 
                {
                    nombre: nuevoNombre,
                    semestre: nuevoSemestre,
                    materias: nuevasMaterias
                }
            )

            setExito('Grupo editado correctamente.')
            navigate('/SICA/administradores/ver-grupos')
        }catch(error){
            console.error('Error al editar el grupo:', error)
            setError(error.message || 'Ocurrió un error al editar el grupo.')
        }finally{
            setEsperandoRespuesta(false)
        }
    }

    // Método para regresar a la vista de grupos sin guardar cambios
    const cancelar = () => {
        navigate('/SICA/administradores/ver-grupos')
    }

    useEffect(() => { // Se obtienen los datos necesarios al cargar la página
        cargarMaterias()
        cargarGrupo()
        setEsperandoRespuesta(false)
    }, [])

    if(cargando || !grupo){ // Mientras se cargan los datos se muestra un mensaje de carga
        return(
            <MensajeCarga/>
        )
    }

    return (
        <div className="contenedor-principal">
            <MenuLateral />
            <div className="contenido-principal">
                <FormularioGrupo
                    tituloFormulario="Editar Grupo"
                    guardar={guardarCambios}
                    cancelar={cancelar}
                    nombre={grupo.nombre}
                    semestre={grupo.semestre}
                    materias={grupo.materias.map((m) => m.nombre)}
                    materiasGlobales={materias}
                    cargando={esperandoRespuesta}
                />
                <MensajeEstado
                    exito={exito}
                    error={error}
                />
            </div>
        </div>
    )
}