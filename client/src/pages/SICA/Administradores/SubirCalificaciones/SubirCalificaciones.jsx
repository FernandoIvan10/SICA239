import MenuLateral from "../../../../components/sica/MenuLateral/MenuLateral"
import { useEffect, useState } from "react"
import { useValidarToken } from "../../../../hooks/useValidarToken/useValidarToken"
import { useValidarRol } from "../../../../hooks/useValidarRol/useValidarRol"
import "./SubirCalificaciones.css"

// Página del SICA para subir calificaciones
export default function SubirCalificaciones(){
    const token = localStorage.getItem('token') // Token de inicio de sesión
    const [grupos, setGrupos] = useState([]) // Grupos obtenidos del backend
    const [grupoSeleccionado, setGrupoSeleccionado] = useState('') // Grupo seleccionado
    const [parciales] = useState(['Parcial 1', 'Parcial 2', 'Parcial 3', 'Parcial 4', 'Parcial 5']) // Lista de parciales
    const [parcialSeleccionado, setParcialSeleccionado] = useState('') // Parcial seleccionado actualmente
    const [alumnos, setAlumnos] = useState([]) // Alumnos del grupo seleccionado
    const [materias, setMaterias] = useState([]) // Materias del grupo seleccionado
    const [calificaciones, setCalificaciones] = useState({}) // Calificaciones del grupo seleccionado

    useValidarToken() // El usuario debe haber iniciado sesión
    useValidarRol('superadmin', 'editor') // El usuario debe tener permiso para acceder a esta ruta

    useEffect(()=>{ // Se obtienen los grupos del backend
        fetch('http://localhost:3000/api/grupos',{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }).then(async res => {
            if (res.ok) {
                const data = await res.json()
                setGrupos(data.grupos)
                return
            }else{
                console.error(`Error ${res.status}`, await res.json().catch(()=>null))
                alert("Ocurrió un error al obtener los grupos")
                return   
            }
        })
    })
     
    useEffect(()=>{ // Se obtienen los alumnos y materias del grupo seleccionado
        if(grupoSeleccionado){
            const token = localStorage.getItem("token");
            fetch(`http://localhost:3000/api/alumnos/por-grupo/${grupoSeleccionado}`, { // Obtener los alumnos del backend
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(async res => {
                if (res.ok) {
                    const data = await res.json()
                    setAlumnos(data)
                } else {
                    console.error(`Error ${res.status}`, await res.json().catch(() => null))
                    alert("Ocurrió un error al obtener los alumnos")
                }
            })
            .catch(error => {
                console.error('Error de red al obtener alumnos:', error)
                alert("Error de red al obtener los alumnos")
            })
            // Actualizar materias según el grupo seleccionado
            const grupo = grupos.find(g => g._id === grupoSeleccionado)
            if (grupo) setMaterias(grupo.materias)
        }
    }, [grupoSeleccionado])

    useEffect(() => { // Se obtienen las calificaciones del grupo y parcial seleccionados
        if (!grupoSeleccionado || !parcialSeleccionado) return
	    setCalificaciones({})

        fetch(`http://localhost:3000/api/calificaciones?grupoId=${grupoSeleccionado}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }).then(async res => {
            if (res.ok) {
                const data = await res.json()
                const calificacionesMap = {}
                for (const c of data.calificaciones) {
                    const parcialData = c.parciales.find(p => p.parcial === parcialSeleccionado)
                    if (!parcialData) continue

                    const alumnoId = typeof c.alumnoId === 'object' ? c.alumnoId._id : c.alumnoId
                    const materiaId = typeof c.materiaId === 'object' ? c.materiaId._id : c.materiaId

                    if (!calificacionesMap[alumnoId]) calificacionesMap[alumnoId] = {}
                    calificacionesMap[alumnoId][materiaId] = {
                        nota: parcialData.nota,
                        calificacionId: c._id
                    }
                }
                setCalificaciones(calificacionesMap)
            } else {
                console.error(`Error ${res.status}`, await res.json().catch(() => null))
            }
        }).catch(err => {
            console.error('Error al obtener calificaciones:', err)
        })
    }, [grupoSeleccionado, parcialSeleccionado])

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
    const guardarCalificaciones = async () => {
        if (!grupoSeleccionado || !parcialSeleccionado) {
            alert("Selecciona un grupo y un parcial antes de guardar.")
            return
        }

        for (const alumno of alumnos) {
            const materiasAlumno = materias.filter(m => {
                const esDelGrupo = alumno.grupoId?.toString() === grupoSeleccionado
                const esRecursada = alumno.materiasRecursadas?.some(mr => 
                    mr.grupo?.toString() === grupoSeleccionado && mr.materia?.toString() === m._id
                )
                return esDelGrupo || esRecursada
            })

            for (const materia of materiasAlumno) {
                const calificacionData = calificaciones[alumno._id]?.[materia._id]
                if (!calificacionData || calificacionData.nota === '' || calificacionData.nota === undefined) continue

                const body = {
                    alumnoId: alumno._id,
                    grupoId: grupoSeleccionado,
                    materiaId: materia._id,
                    parciales: [
                        { parcial: parcialSeleccionado, nota: Number(calificacionData.nota) }
                    ]
                }

                const method = calificacionData.calificacionId ? 'PUT' : 'POST'
                const url = calificacionData.calificacionId
                    ? `http://localhost:3000/api/calificaciones/${calificacionData.calificacionId}`
                    : 'http://localhost:3000/api/calificaciones'

                await fetch(url, {
                    method,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(body)
                })
            }
        }
        alert('Calificaciones guardadas.')
    }

    if (grupos.length === 0) {
        return <p>Cargando datos...</p>
    }
    return (
        <div className="contenedor-inicio">
            <MenuLateral/>
            <div className="contenido-principal">
                <h1>Subir Calificaciones</h1>

                <div className="selectores">
                    <select className="select-grupo" value={grupoSeleccionado} onChange={e => setGrupoSeleccionado(e.target.value)}>
                        <option value="">Seleccionar grupo</option>
                        {grupos.map(grupo => (
                            <option key={grupo._id} value={grupo._id}>{grupo.nombre}</option>
                        ))}
                    </select>
                    <select className="select-parcial" value={parcialSeleccionado} onChange={e => setParcialSeleccionado(e.target.value)}>
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
                                    const esDelGrupo = alumno.grupoId?.toString() === grupoSeleccionado
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
                                                value={calificaciones[alumno._id]?.[materia._id]?.nota || ''}
                                                onChange={e => manejarCambiosCalificaciones(
                                                    alumno._id,
                                                    materia._id,
                                                    e.target.value === '' ? '' : Number(e.target.value)
                                                )}
                                            />
                                        </td>
                                    )
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>

                <button className="btn-guardar" onClick={guardarCalificaciones}>Guardar Calificaciones</button>
            </div>
        </div>
    )
}