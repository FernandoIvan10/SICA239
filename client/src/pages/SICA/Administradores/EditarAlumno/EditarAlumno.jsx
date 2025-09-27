import MenuLateral from '../../../../components/sica/MenuLateral/MenuLateral'
import { useEffect, useState } from 'react'
import { useValidarToken } from '../../../../hooks/useValidarToken/useValidarToken'
import { useNavigate, useParams } from 'react-router-dom'
import { useValidarRol } from '../../../../hooks/useValidarRol/useValidarRol'
import './EditarAlumno.css'

// Página del SICA para editar alumnos
export default function EditarAlumno() {
    useValidarToken() // El usuario debe haber iniciado sesión
    useValidarRol(['superadmin', 'editor']) // El usuario debe tener permiso para acceder a esta ruta

    const navigate = useNavigate() // Para redireccionar a los usuarios
    const token = localStorage.getItem('token') // Token de inicio de sesión
    const { id } = useParams() // ID enviado por parámetro
    const [alumno, setAlumno] = useState(null) // Contiene todos los datos del formulario
    const [grupos, setGrupos] = useState([]) // Contiene los grupos del backend
    const [materiasRecursadas, setMateriasRecursadas] = useState([]) // Materias que el alumno está recursando
    const [materiaSeleccionada, setMateriaSeleccionada] = useState('') // Materia recursada seleccionada
    
    useEffect(() => { // Se obtienen los grupos de la BD para mostrarlos en el formulario
        fetch('http://localhost:3000/api/grupos', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(async res => {
            const data = await res.json()
            if (!res.ok) {
                alert(data.mensaje || 'Error al obtener grupos')
                setGrupos([])
                return
            }
            return data
        })
        .then(data => {
            setGrupos(data.grupos)
        })
        .catch(err => {
            console.error('Error al obtener grupos:', err)
            alert('No se pudo conectar con el servidor')
            setGrupos([])
        })
    }, [])

    useEffect(() => { // Se obtienen los datos del alumno a editar
        fetch(`http://localhost:3000/api/alumnos/${id}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        .then(async res => {
            const data = await res.json()
            if(!res.ok){
                alert(data.mensaje || 'Error al obtener alumno.')
                return
            }

            const grupo = grupos.find(g => g._id === data.grupoId)
            setAlumno({
                matricula: data.matricula,
                nombre: data.nombre,
                apellido: data.apellido,
                grupoNombre: grupo ? grupo.nombre : '' // Se necesita el nombre del grupo en el formulario
            })
            setMateriasRecursadas(data.materiasRecursadas || [])
        })
        .catch(err => {
            console.error('Error al obtener alumno:', err)
            alert('No se pudo conectar con el servidor.')
        })
    }, [id, grupos])

    // Método para editar el alumno con los nuevos datos
    const guardarCambios = () => {
        if(!alumno.nombre.trim() || !alumno.apellido.trim() || !alumno.grupoNombre.trim()){ // Se deben rellenar todos los campos obligatorios del formulario
            alert('Faltan campos son obligatorios')
            return
        }

        const {nombre, apellido, grupoNombre} = alumno // Se obtienen los nuevos datos del formulario

        fetch(`http://localhost:3000/api/alumnos/${id}`, {
            method: 'PUT',
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({nombre, apellido, grupoNombre, materiasRecursadas})
        }).then(async res => {
            if(res.ok){
                alert('Alumno actualizado correctamente')
                navigate('/SICA/administradores/ver-usuarios')
            } else {
                const errorData = await res.json().catch(() => null)
                console.error(`Error ${res.status}`, errorData)
                 alert(errorData?.mensaje || 'Ocurrió un error al actualizar el alumno')
            }
        })
    }

    // Método para regresar a la lista de usuarios
    const cancelar = () => {
        navigate('/SICA/administradores/ver-usuarios')
    }

    if (!alumno) return <p>Cargando alumno...</p>
    return (
        <div className="contenedor-principal">
            <MenuLateral/>
            <div className="contenido-principal">
                <h1>Editar Alumno</h1>
                <form className="formulario-editar-alumno">
                    <div className="formulario-editar-alumno-campo">
                        <label className="formulario-editar-alumno-label">Matrícula*:</label>
                        <input
                            className="formulario-editar-alumno-input"
                            type="text"
                            value={alumno.matricula}
                            readOnly
                        />
                    </div>
                    <div className="formulario-editar-alumno-campo">
                        <label className="formulario-editar-alumno-label">Nombre*:</label>
                        <input
                            className="formulario-editar-alumno-input"
                            type="text"
                            value={alumno.nombre}
                            onChange={(e) => setAlumno({ ...alumno, nombre: e.target.value })}
                            required
                        />
                    </div>
                    <div className="formulario-editar-alumno-campo">
                        <label className="formulario-editar-alumno-label">Apellido*:</label>
                        <input
                            className="formulario-editar-alumno-input"
                            type="text"
                            value={alumno.apellido}
                            onChange={(e) => setAlumno({ ...alumno, apellido: e.target.value })}
                            required
                        />
                    </div>
                    <div className="formulario-editar-alumno-campo">
                        <label className="formulario-editar-alumno-label">Grupo*:</label>
                        <select
                            className="formulario-editar-alumno-select"
                            value={alumno.grupoNombre}
                            onChange={(e) => setAlumno({ ...alumno, grupoNombre: e.target.value })}
                            required
                        >
                            <option value="">Seleccionar grupo</option>
                            {grupos.map((g) => (
                                <option key={g._id} value={g.nombre}>
                                    {g.nombre}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="formulario-editar-alumno-campo-materias-recursadas">
                        <label className="formulario-editar-alumno-label">Materias recursadas:</label>
                        <div className="formulario-editar-alumno-materias-recursadas">
                            {materiasRecursadas.map((item, index) => {
                                const grupoObj = grupos.find(g => g._id === item.grupo)
                                const materiaObj = grupoObj?.materias.find(m => m._id === item.materia)
                                return (
                                    <div key={index} className="formulario-editar-alumno-materia-recursada">
                                        {materiaObj?.nombre || "Materia desconocida"} - {grupoObj?.nombre || "Grupo desconocido"}
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const nuevas = [...materiasRecursadas]
                                                nuevas.splice(index, 1)
                                                setMateriasRecursadas(nuevas)
                                            }}
                                        >
                                            X
                                        </button>
                                    </div>
                                )
                            })}
                        </div>
                        <select
                            className="formulario-editar-alumno-select"
                            value={materiaSeleccionada}
                            onChange={(e) => setMateriaSeleccionada(e.target.value)}
                        >
                            <option value="">Seleccionar materia</option>
                            {grupos.map(grupo =>
                                grupo.materias.map(materia => (
                                    <option key={`${materia._id}-${grupo._id}`} value={`${materia._id}-${grupo._id}`}>
                                        {materia.nombre} - {grupo.nombre}
                                    </option>
                                ))
                            )}
                        </select>
                    </div>
                    <div className="formulario-editar-alumno-contenedor-boton-agregar">
                        <button
                            type="button"
                            className="formulario-editar-alumno-boton-agregar"
                            onClick={() => {
                                if (materiaSeleccionada) {
                                    const [materia, grupo] = materiaSeleccionada.split("-")
                                    const existe = materiasRecursadas.some(m => m.materia === materia && m.grupo === grupo)
                                    if (!existe) {
                                        setMateriasRecursadas([...materiasRecursadas, { materia, grupo }])
                                    }
                                    setMateriaSeleccionada("")
                                }
                            }}
                        >
                            Agregar
                        </button>
                    </div>
                    <div className="formulario-editar-alumno-botones">
                    <button type="button" className="boton-guardar" onClick={guardarCambios}>
                        Guardar
                    </button>
                    <button type="button" className="boton-cancelar" onClick={cancelar}>
                        Cancelar
                    </button>
                    </div>
                </form>
            </div>
        </div>
    )
}