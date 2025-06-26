import MenuLateral from "../../../../components/sica/MenuLateral/MenuLateral"
import { useEffect, useState } from "react"
import { useValidarToken } from "../../../../hooks/useValidarToken/useValidarToken"
import { useValidarRol } from "../../../../hooks/useValidarRol/useValidarRol"
import "./GestionarHorarios.css"

// Página del sica para gestionar los horarios de los grupos
export default function GestionarHorarios(){
    const token = localStorage.getItem('token') // Token de inicio de sesión        
    const [grupos, setGrupos] = useState([]) // Grupos del sistema
    const [horarios, setHorarios] = useState([]) // Horarios de la BD

    useValidarToken() // El usuario debe haber iniciado sesión
    useValidarRol('superadmin', 'editor', 'lector') // El usuario debe tener permiso para acceder a esta ruta

    useEffect(() => { // Se obtienen los grupos del backend
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
    }, [])

    useEffect(() => { // Se obtienen los horarios del backend
        cargarHorarios()
    },[])

    // Método para obtener los horarios de la BD
    const cargarHorarios = () => {
        fetch('http://localhost:3000/api/horarios',{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }).then(async res => {
            if (res.ok) {
                const data = await res.json()
                setHorarios(data.horarios)
                return
            }else{
                console.error(`Error ${res.status}`, await res.json().catch(()=>null))
                alert("Ocurrió un error al obtener los horarios")
                return   
            }
        })
    }

    // Método para obtener el horario de un grupo específico
    const obtenerHorarioDeGrupo = (grupoId) => {
        if (!horarios || horarios.length === 0) return null // Tiene que existir al menos un horario
        return horarios.find(h => h.grupo._id === grupoId)
    }    

    // Método para subir el horario de un grupo
    const subirHorario = async (grupoId, file) => {
        const formData = new FormData()
        formData.append("imagen", file)
        formData.append("grupoId", grupoId)

        const res = await fetch("http://localhost:3000/api/horarios", {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: formData
        })

        if (res.ok) {
            const data = await res.json()
            cargarHorarios()
            alert("Horario establecido exitosamente")
        } else {
            alert("Error al subir el horario")
        }
    }

    // Método para eliminar un horario
    const eliminarHorario = async (horarioId) => {
        const res = await fetch(`http://localhost:3000/api/horarios/${horarioId}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` }
        })

        if (res.ok) {
            cargarHorarios()
        } else {
            alert("Error al eliminar el horario")
        }
    }

    if (grupos.length === 0 && horarios.length === 0) {
        return <p>Cargando datos...</p>
    }
    return(
        <div className="contenedor-gestionar-horarios">
            <MenuLateral/>
            <div className="contenido-principal">
                <h1>Gestionar Grupos</h1>
                <table className="tabla-horarios">
                    <thead>
                        <tr>
                        <th>Grupo</th>
                        <th>Horario</th>
                        <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {grupos.map(grupo => {
                        const horario = obtenerHorarioDeGrupo(grupo._id)
                        return (
                            <tr key={grupo._id}>
                            <td>{grupo.nombre}</td>
                            <td>
                                {horario ? (
                                <img src={horario.imagenUrl} alt="Horario" style={{ width: "200px" }} />
                                ) : (
                                <span>Sin horario</span>
                                )}
                            </td>
                            <td>
                                {!horario && (
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => subirHorario(grupo._id, e.target.files[0])}
                                />
                                )}
                                {horario && (
                                <button onClick={() => eliminarHorario(horario._id)}>
                                    Eliminar
                                </button>
                                )}
                            </td>
                            </tr>
                        )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}