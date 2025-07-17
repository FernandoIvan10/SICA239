import MenuLateral from "../../../../components/sica/MenuLateral/MenuLateral"
import { useEffect, useState } from "react"
import { useValidarToken } from "../../../../hooks/useValidarToken/useValidarToken"
import { useValidarRol } from "../../../../hooks/useValidarRol/useValidarRol"
import './MigrarAlumnos.css'
import '../../../../assets/styles/global.css'

// Página del SICA para migrar los alumnos de un grupo (sin calificaciones) a otro
export default function MigrarAlumnos() {
    useValidarToken() // El usuario debe haber iniciado sesión
    useValidarRol(['superadmin', 'editor']) // El usuario debe tener permiso para acceder a esta ruta

    const token = localStorage.getItem('token') // Token de inicio de sesión
    const [grupos, setGrupos] = useState([]) // Grupos del sistema
    const [grupoOrigen, setGrupoOrigen] = useState('') // Grupo donde se encuentran los alumnos a migrar
    const [grupoDestino, setGrupoDestino] = useState('') // Grupo a donde serán migrados los alumnos
    const [alumnos, setAlumnos] = useState([]) // Alumnos del grupo seleccionado
    const [seleccionados, setSeleccionados] = useState([]) // Alumnos seleccionados para migrarlos
    const [mensaje, setMensaje] = useState('') // Mensaje de éxito o error
    const [cargando, setCargando] = useState(false) // Para bloquear campos y botones mientras carga la migración

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

    useEffect(() => { // Se obtienen los alumnos del grupo seleccionado
        if(grupoOrigen){
            fetch(`http://localhost:3000/api/alumnos/por-grupo/${grupoOrigen}`, {
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
        }
    }, [grupoOrigen])

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
        setCargando(true)
        setMensaje('')
        try {
            const res = await fetch('/api/grupos/migrar-alumnos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    grupoOrigen,
                    grupoDestino,
                    alumnos: seleccionados,
                }),
            })

            const data = await res.json()

            if (!res.ok) throw new Error(data.mensaje || 'Error al migrar alumnos')
            setMensaje(data.mensaje)

            // Limpia el estado
            setSeleccionados([])
            setGrupoOrigen('')
            setGrupoDestino('')
            setAlumnos([])
        } catch (error) {
            setMensaje(error.message)
        } finally {
            setCargando(false)
        }
    }

    return (
        <div className="contenedor-principal">
            <MenuLateral/>
            <div className="contenido-principal">
                <h1>Migrar alumnos entre grupos</h1>
                <div className="migrar-alumnos-campo">
                    <label className="migrar-alumnos-campo-label">Grupo origen:</label>
                    <select className="migrar-alumnos-campo-select" value={grupoOrigen} onChange={e => setGrupoOrigen(e.target.value)}>
                        <option value="">Selecciona</option>
                        {grupos.map(g => (
                            <option key={g._id} value={g._id}>{g.nombre}</option>
                        ))}
                    </select>
                </div>
                <div className="migrar-alumnos-campo">
                    <label className="migrar-alumnos-campo-label">Grupo destino:</label>
                    <select className="migrar-alumnos-campo-select" value={grupoDestino} onChange={e => setGrupoDestino(e.target.value)}>
                        <option value="">Selecciona</option>
                        {grupos
                            .filter(g => g._id !== grupoOrigen)
                            .map(g => (
                                <option key={g._id} value={g._id}>{g.nombre}</option>
                            ))}
                    </select>
                </div>

                {alumnos.length > 0 && (
                    <div className="migrar-alumnos-contenedor-lista-alumnos">
                        <h2>Selecciona alumnos a migrar:</h2>
                        <ul className="migrar-alumnos-lista-alumnos">
                            {alumnos.map(a => (
                                <li className="migrar-alumnos-alumno" key={a._id}>
                                    <label className="migrar-alumnos-alumno-label">{a.nombre} {a.apellido}</label>
                                    <input
                                        className="migrar-alumnos-alumno-checkbox"
                                        type="checkbox"
                                        checked={seleccionados.includes(a._id)}
                                        onChange={() => manejarCheckbox(a._id)}
                                    />
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                <div className="migrar-alumnos-contenedor-botones">
                    <button
                        className="boton-guardar"
                        onClick={migrar}
                        disabled={cargando || !grupoOrigen || !grupoDestino || seleccionados.length === 0}
                    >
                        {cargando ? 'Migrando...' : 'Migrar alumnos'}
                    </button>
                </div>
                {mensaje && <p>{mensaje}</p>}
            </div>
        </div>
    )
}