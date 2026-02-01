import MenuLateral from '../../../../components/sica/MenuLateral/MenuLateral'
import MensajeCarga from '../../../../components/sica/MensajeCarga/MensajeCarga'
import FormularioAlumno from '../../../../components/sica/FormularioAlumno/FormularioAlumno'
import MensajeEstado from '../../../../components/sica/MensajeEstado/MensajeEstado'
import { obtenerGrupos } from '../../../../api/grupos.api'
import { obtenerMaterias } from '../../../../api/materias.api'
import { editarAlumno, obtenerAlumnoPorId } from '../../../../api/alumnos.api'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../../../../auth/useAuth'

// Página del SICA para editar alumnos
export default function EditarAlumno() {
    const [grupos, setGrupos] = useState([]) // Grupos del backend
    const [materias, setMaterias] = useState([]) // Materias del backend
    const [alumno, setAlumno] = useState(null) // Contiene todos los datos del formulario
    const [materiasRecursadas, setMateriasRecursadas] = useState([]) // Materias que el alumno está recursando
    const [esperandoRespuesta, setEsperandoRespuesta] = useState(false)
    const [exito, setExito] = useState(null)
    const [error, setError] = useState(null)

    const {cargando} = useAuth() // Usuario autenticado
    const navigate = useNavigate()
    const { id } = useParams()

    // Método para obtener los grupos de la BD
    const cargarGrupos = async () => {
        try{
            const respuesta = await obtenerGrupos()
            const listaGrupos = [...(respuesta?.grupos ?? [])]
                .sort((a, b) => a.nombre.localeCompare(b.nombre))

            setGrupos(listaGrupos)
        }catch(error){
            console.error('Error al obtener grupos:', error)
            setError(error.message || 'Ocurrió un error al cargar los grupos.')
            setGrupos([])
        }
    }

    // Método para obtener las materias de la BD
    const cargarMaterias = async () => {
        try{
            const respuesta = await obtenerMaterias()
            const listaMaterias = [...(respuesta?.materias ?? [])]
                .sort((a, b) => a.nombre.localeCompare(b.nombre))
            setMaterias(listaMaterias)
        }catch(error){
            console.error('Error al obtener materias:', error)
            setError(error.message || 'Ocurrió un error al cargar las materias.')
        }
    }

    // Método para obtener los datos del alumno a editar
    const cargarAlumno = async (id) => {
        try{
            const respuesta = await obtenerAlumnoPorId(id)

            const grupo = grupos.find(g => g._id === respuesta.grupoId)

            setAlumno({
                matricula: respuesta.matricula,
                nombre: respuesta.nombre,
                apellido: respuesta.apellido,
                grupo: grupo ? grupo.nombre : ''
            })
            setMateriasRecursadas(respuesta.materiasRecursadas || [])
        }catch(error){
            console.error('Error al obtener alumno:', error)
            setError(error.message || 'Error al obtener alumno')
        }
    }

    // Método para editar el alumno con los nuevos datos
    const guardarCambios = async (matricula, nombre, apellido, grupo, materiasRecursadas) => {
        try{
            setEsperandoRespuesta(true)
            setError(null)
            setExito(null)

            await editarAlumno(id, {
                nombre: nombre,
                apellido: apellido,
                grupo: grupo,
                materiasRecursadas: materiasRecursadas
            })
            setExito('Alumno actualizado correctamente')
            navigate('/SICA/administradores/ver-usuarios')
        }catch(error){
            console.error('Error al editar alumno:', error)
            setError(error.message || 'Ocurrió un error al actualizar el alumno')
        }finally{
            setEsperandoRespuesta(false)
        }
    }

    // Método para regresar a la lista de usuarios
    const cancelar = () => {
        navigate('/SICA/administradores/ver-usuarios')
    }

    useEffect(() => { // Se obtienen los grupos y materias de la BD para mostrarlos en el formulario
        cargarGrupos()
        cargarMaterias()
    }, [])

    useEffect(() => { // Se obtienen los datos del alumno a editar
        if(grupos.length === 0 || materias.length === 0) return // Esperar a que se carguen los grupos y materias
        
        cargarAlumno(id)
        setEsperandoRespuesta(false)
    }, [id, grupos, materias])

    if (!alumno || cargando) { // Mientras no se carguen los datos del alumno se muestra un mensaje de carga
        return(
            <MensajeCarga/>
        )
    }

    return (
        <div className="contenedor-principal">
            <MenuLateral/>
            <div className="contenido-principal">
                <h1>Editar Alumno</h1>
                <MensajeEstado
                    error={error}
                    exito={exito}
                />
                <FormularioAlumno
                    grupos={grupos}
                    materias={materias}
                    matricula={alumno.matricula}
                    nombre={alumno.nombre}
                    apellido={alumno.apellido}
                    grupo={alumno.grupo}
                    materiasRecursadas={materiasRecursadas}
                    onSubmit={guardarCambios}
                    cancelar={cancelar}
                    cargando={esperandoRespuesta}
                    exito={exito}
                    matriculaDisabled={true}
                />
            </div>
        </div>
    )
}