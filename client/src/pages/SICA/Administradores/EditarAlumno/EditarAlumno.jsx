import MenuLateral from "../../../../components/sica/MenuLateral/MenuLateral"
import { useEffect, useState } from "react"
import { useValidarToken } from "../../../../hooks/useValidarToken/useValidarToken"
import { useNavigate, useParams } from "react-router-dom"
import { useValidarRol } from "../../../../hooks/useValidarRol/useValidarRol"
import "./EditarAlumno.css"

// Página del SICA para editar alumnos
export default function EditarAlumno() {
    const navigate = useNavigate() // Para redireccionar a los usuarios
    const token = localStorage.getItem('token') // Token de inicio de sesión
    const { id } = useParams() // ID enviado por parámetro
    const [alumno, setAlumno] = useState(null) // Contiene todos los datos del formulario
    const [grupos, setGrupos] = useState([]) // Contiene los grupos del backend
    const [materiasRecursadas, setMateriasRecursadas] = useState([]) // Materias que el alumno está recursando
    const [materiaSeleccionada, setMateriaSeleccionada] = useState("") // Materia recursada seleccionada
    
    useValidarToken() // El usuario debe haber iniciado sesión
    useValidarRol('superadmin', 'editor') // El usuario debe tener permiso para acceder a esta ruta

    useEffect(() => { // Se obtienen los grupos de la BD para mostrarlos en el formulario
        fetch('http://localhost:3000/api/grupos', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(res => res.json())
        .then(data => {
            setGrupos(data.grupos)
        })
        .catch(err => {
            console.error("Error al obtener grupos:", err)
            setGrupos([])
        })
    }, [])

    useEffect(() => { // Se obtienen los datos del alumno a editar
        fetch(`http://localhost:3000/api/alumnos/${id}`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        })
        .then(res => res.json())
        .then(data => {
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
            console.error("Error al obtener alumno:", err)
        })
    }, [id, grupos])

    // Método para editar el alumno con los nuevos datos
    const guardarCambios = () => {
        if(!alumno.nombre.trim() || !alumno.apellido.trim() || !alumno.grupoNombre.trim()){ // Se deben rellenar todos los campos obligatorios del formulario
            alert("Faltan campos son obligatorios")
            return
        }

        const {nombre, apellido, grupoNombre} = alumno // Se obtienen los nuevos datos del formulario

        fetch(`http://localhost:3000/api/alumnos/${id}`, {
            method: "PUT",
            headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({nombre, apellido, grupoNombre, materiasRecursadas})
        }).then(async res => {
            if(res.ok){
                alert("Alumno actualizado correctamente")
                navigate("/SICA/administradores/ver-usuarios")
            } else {
                console.error(await res.json().catch(()=>null))
                alert("Ocurrió un error al actualizar el alumno")
            }
        })
    }

    if (!alumno) return <p>Cargando alumno...</p>
    return (
        <>
            <MenuLateral/>
            <form className="formulario-editar">
                <h2>Editar Alumno</h2>
                <label>
                    Matrícula*:
                    <input
                    type="text"
                    value={alumno.matricula}
                    readOnly
                    />
                </label>
                <label>
                    Nombre*:
                    <input
                    type="text"
                    value={alumno.nombre}
                    onChange={(e) => setAlumno({ ...alumno, nombre: e.target.value })}
                    required
                    />
                </label>
                <label>
                    Apellido*:
                    <input
                    type="text"
                    value={alumno.apellido}
                    onChange={(e) => setAlumno({ ...alumno, apellido: e.target.value })}
                    required
                    />
                </label>
                <label>
                    Grupo*:
                    <select
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
                </label>
                <label>
                    Materias recursadas:
                    <select
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
                    <button
                        type="button"
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
                </label>
                <div className="materias-recursadas-lista">
                    {materiasRecursadas.map((item, index) => {
                        const grupoObj = grupos.find(g => g._id === item.grupo)
                        const materiaObj = grupoObj?.materias.find(m => m._id === item.materia)
                        return (
                            <div key={index} className="materia-item">
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
                <button type="button" className="btn-guardar" onClick={guardarCambios}>
                    Guardar cambios
                </button>
            </form>
        </>
    )
}