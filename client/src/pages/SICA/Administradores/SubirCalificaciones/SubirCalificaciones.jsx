import MenuLateral from '../../../../components/sica/MenuLateral/MenuLateral'
import { useEffect, useState } from 'react'
import { useValidarToken } from '../../../../hooks/useValidarToken/useValidarToken'
import { useValidarRol } from '../../../../hooks/useValidarRol/useValidarRol'
import { jwtDecode } from 'jwt-decode'
import '../../../../assets/styles/global.css'
import './SubirCalificaciones.css'
import MensajeCarga from '../../../../components/sica/MensajeCarga/MensajeCarga'

// Página del SICA para subir calificaciones
export default function SubirCalificaciones(){
    useValidarToken() // El usuario debe haber iniciado sesión
    useValidarRol(['superadmin', 'editor', 'lector']) // El usuario debe tener permiso para acceder a esta ruta

    const token = localStorage.getItem('token') // Token de inicio de sesión
    const tokenDecodificado = jwtDecode(token) // Datos del token
    const [grupos, setGrupos] = useState([]) // Grupos obtenidos del backend
    const [grupoSeleccionado, setGrupoSeleccionado] = useState('') // Grupo seleccionado
    const [parciales] = useState(['Parcial 1', 'Parcial 2', 'Parcial 3', 'Parcial 4', 'Parcial 5']) // Lista de parciales
    const [parcialSeleccionado, setParcialSeleccionado] = useState('Parcial 1') // Parcial seleccionado actualmente
    const [alumnos, setAlumnos] = useState([]) // Alumnos del grupo seleccionado
    const [materias, setMaterias] = useState([]) // Materias del grupo seleccionado
    const [calificaciones, setCalificaciones] = useState({}) // Calificaciones del grupo seleccionado

    useEffect(()=>{ // Se obtienen los grupos del backend
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
            // El grupo de egresados no debe aparecer en esta pantalla
            const gruposFiltrados = data.grupos.filter(g => g.nombre !== "Egresados")
            gruposFiltrados.sort((a, b) => { // Los grupos deben estar ordenados por nombre
                return a.nombre.localeCompare(b.nombre)
            })
            setGrupos(gruposFiltrados)
        })
        .catch(err => {
            console.error('Error al obtener grupos:', err)
            alert('No se pudo conectar con el servidor')
            setGrupos([])
        })
    }, [])
     
    useEffect(()=>{ // Se obtienen los alumnos y materias del grupo seleccionado
        if(grupoSeleccionado){
            fetch(`http://localhost:3000/api/alumnos/por-grupo/${grupoSeleccionado}`, { // Obtener los alumnos del backend
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(async res => {
                const data = await res.json()
                if (!res.ok) {
                    console.error(`Error ${res.status}`, await res.json().catch(() => null))
                    alert(data.mensaje || 'Ocurrió un error al obtener los alumnos')
                    return
                }
                
                setAlumnos(data)
            })
            .catch(error => {
                console.error('Error de red al obtener alumnos:', error)
                alert('No se pudo conectar con el servidor.')
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
            const data = await res.json()

            if(!res.ok){
                console.error(`Error ${res.status}`, await res.json().catch(() => null))
                alert(data.mensaje || 'Ocurrió un error al obtener las calificaciones parciales.')
                return
            }
            
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
        }).catch(err => {
            console.error('Error al obtener calificaciones:', err)
            alert('No se pudo conectar al servidor.')
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
            alert('Selecciona un grupo y un parcial antes de guardar.')
            return
        }

        try{
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
                        materiaId: materia._id,
                        grupoId: grupoSeleccionado,
                        parcial: parcialSeleccionado,
                        nota: Number(calificacionData.nota)
                    }

                    const response = await fetch('http://localhost:3000/api/calificaciones', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify(body)
                    })
                    if(!response.ok){
                        const errorData = await response.json()
                        alert(errorData.mensaje || 'Error al capturar las calificaciones')
                        return
                    }

                }
            }
            alert('Calificaciones guardadas.')
        }catch (err) {
            console.error('Error al guardar calificaciones:', err)
            alert('No se pudo conectar al servidor.')
        }
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
                <div className="subir-calificaciones-selectores">
                    <select className="subir-calificaciones-selectores-select" value={grupoSeleccionado} onChange={e => setGrupoSeleccionado(e.target.value)}>
                        <option value="">Seleccionar grupo</option>
                        {grupos.map(grupo => (
                            <option key={grupo._id} value={grupo._id}>{grupo.nombre}</option>
                        ))}
                    </select>
                    <select className="subir-calificaciones-selectores-select" value={parcialSeleccionado} onChange={e => setParcialSeleccionado(e.target.value)}>
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
                                                disabled={tokenDecodificado.rol === "lector"}
                                            />
                                        </td>
                                    )
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
                {tokenDecodificado.rol !== "lector" && 
                    <button className="boton-guardar" onClick={guardarCalificaciones}>Guardar Calificaciones</button>
                }
            </div>
        </div>
    )
}
