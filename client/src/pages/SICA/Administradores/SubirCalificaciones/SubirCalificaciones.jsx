import {jwtDecode} from "jwt-decode"
import MenuLateral from "../../../../components/sica/MenuLateral/MenuLateral";
import "./SubirCalificaciones.css"
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useValidarToken } from "../../../../hooks/useValidarToken/useValidarToken";

import { FaHouseChimney } from "react-icons/fa6";
import { FaFileUpload, FaUsers, FaUserEdit, FaLayerGroup } from "react-icons/fa";
import { TiUserAdd } from "react-icons/ti";
import { IoLogOut } from "react-icons/io5";
import { MdGroupAdd, MdGroups } from "react-icons/md";
import { RiCalendarScheduleFill } from "react-icons/ri";

// Página del SICA para subir calificaciones
export default function SubirCalificaciones(){
    const navigate = useNavigate() // Para redireccionar a los usuarios
    const [menu, setMenu] = useState([]) // Elementos del menú
    const [grupos, setGrupos] = useState([]) // Almacena los grupos obtenidos del backend
    const [grupoSeleccionado, setGrupoSeleccionado] = useState('') // Almacena el grupo seleccionado actualmente
    const [parciales] = useState(['Parcial 1', 'Parcial 2', 'Parcial 3', 'Parcial 4', 'Parcial 5']) // Lista de parciales
    const [parcialSeleccionado, setParcialSeleccionado] = useState('') // Almacena el parcial seleccionado actualmente
    const [alumnos, setAlumnos] = useState([]) // Almacena los alumnos del grupo seleccionado actualmente
    const [materias, setMaterias] = useState([]) // Almacena las materias del grupo seleccionado actualmente
    const [calificaciones, setCalificaciones] = useState({}) // Almacena las calificaciones del grupo seleccionado actualmente

    useValidarToken() // Se valida que el usuario haya iniciado sesión
    
    useEffect(() => {
        const token = localStorage.getItem('token') // Token de inicio de sesión        
            try{
                const tokenDecodificado = jwtDecode(token) // Se decodifica el token

                if(tokenDecodificado.rol === 'alumno'){
                        // Si el usuario es un alumno se redirige a su panel
                        navigate('/SICA/alumnos/inicio')
                }

                if(tokenDecodificado.rol === 'superadmin'){
                    // Si el usuario es superadmin
                    // Se asigna el siguiente menú
                    setMenu([ 
                        {titulo: "Inicio", icono:FaHouseChimney, link:'/SICA/administradores/inicio'},
                        {titulo: "Subir calificaciones", icono:FaFileUpload, link:'/SICA/administradores/subir-calificaciones'},
                        {titulo: "Gestionar usuarios", icono:FaUsers, 
                            subelementos:[
                                {titulo:"Agregar usuario", icono:TiUserAdd, link:'/SICA/administradores/agregar-usuario'},
                                {titulo:"Ver usuarios", icono:FaUserEdit, link:'/SICA/administradores/ver-usuarios'},
                            ]},
                        {titulo: "Gestionar grupos", icono:FaLayerGroup, 
                            subelementos:[
                                {titulo:"Agregar grupo", icono:MdGroupAdd, link:'/SICA/administradores/agregar-grupo'},
                                {titulo:"Ver grupos", icono:MdGroups, link:'/SICA/administradores/ver-grupos'},
                            ]},
                        {titulo: "Subir horarios", icono:RiCalendarScheduleFill, link:'/SICA/administradores/subir-horarios'},
                        {titulo: "Cerrar sesión", icono:IoLogOut, link:'/inicio'},
                    ])
                }else if(tokenDecodificado.rol==='editor'){
                    // Si el usuario es editor
                    // Se asigna el siguiente menú
                    setMenu([ 
                        {titulo: "Inicio", icono:FaHouseChimney, link:'/SICA/administradores/inicio'},
                        {titulo: "Subir calificaciones", icono:FaFileUpload, link:'/SICA/administradores/subir-calificaciones'},
                        {titulo: "Gestionar usuarios", icono:FaUsers, 
                            subelementos:[
                                {titulo:"Agregar usuario", icono:TiUserAdd, link:'/SICA/administradores/agregar-usuario'},
                                {titulo:"Ver usuarios", icono:FaUserEdit, link:'/SICA/administradores/ver-usuarios'},
                            ]},
                        {titulo: "Gestionar grupos", icono:FaLayerGroup, 
                            subelementos:[
                                {titulo:"Agregar grupo", icono:MdGroupAdd, link:'/SICA/administradores/agregar-grupo'},
                                {titulo:"Ver grupos", icono:MdGroups, link:'/SICA/administradores/ver-grupos'},
                            ]},
                        {titulo: "Cerrar sesión", icono:IoLogOut, link:'/inicio'},
                    ])
                } else if(tokenDecodificado.rol==='lector'){
                    // Si el usuario es lector se redirige a la lista de usuarios
                    navigate('/SICA/administradores/ver-usuarios')
                }

            }catch(error){
                // Si hay algún error se redirige al usuario al inicio de sesión
                navigate('/SICA/iniciar-sesion')
            }
    }, [navigate])

    // Método para obtener los grupos del backend
    useEffect(()=>{
        const token = localStorage.getItem("token") //Token de inicio de sesión
        fetch('http://localhost:3000/api/grupos',{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }).then(async res => {
            if (res.ok) { // Si se obtienen los grupos correctamente
                const data = await res.json()
                setGrupos(data.grupos)
                return
            }else{ // Si ocurrió un error se alerta al usuario
                console.error(`Error ${res.status}`, await res.json().catch(()=>null))
                alert("Ocurrió un error al obtener los grupos")
                return   
            }
        })
    })
     
    // Método para obtener los alumnos y materias del grupo seleccionado
    useEffect(()=>{
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

    // Método para obtener las calificaciones del grupo y parcial seleccionados
    useEffect(() => {
        if (!grupoSeleccionado || !parcialSeleccionado) return
	    setCalificaciones({})

        const token = localStorage.getItem("token")

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

    // Manejar cambios en la calificación
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

        const token = localStorage.getItem("token")

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
            <MenuLateral elementos={menu} />
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