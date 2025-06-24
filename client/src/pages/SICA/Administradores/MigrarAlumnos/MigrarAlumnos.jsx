import {jwtDecode} from "jwt-decode"
import MenuLateral from "../../../../components/sica/MenuLateral/MenuLateral";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useValidarToken } from "../../../../hooks/useValidarToken/useValidarToken";

import { FaHouseChimney } from "react-icons/fa6";
import { FaFileUpload, FaUsers, FaUserEdit, FaLayerGroup } from "react-icons/fa";
import { TiUserAdd } from "react-icons/ti";
import { IoLogOut } from "react-icons/io5";
import { MdGroupAdd, MdGroups } from "react-icons/md";
import { RiCalendarScheduleFill } from "react-icons/ri";

// Página del SICA para pasar los alumnos de un grupo a otro (sin calificaciones)
export default function MigrarAlumnos() {
    const [menu, setMenu] = useState([])
    const [grupos, setGrupos] = useState([])
    const [grupoOrigen, setGrupoOrigen] = useState('')
    const [grupoDestino, setGrupoDestino] = useState('')
    const [alumnos, setAlumnos] = useState([])
    const [seleccionados, setSeleccionados] = useState([])
    const [mensaje, setMensaje] = useState('')
    const [cargando, setCargando] = useState(false)

    useValidarToken() // Se válida que el usuario haya iniciado sesión

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
        }else if(tokenDecodificado.rol === 'editor'){
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
        }else if(tokenDecodificado.rol === 'lector'){
            // Si el usuario es lector se redirige al panel
            navigate('/SICA/administradores/inicio')
        }
        }catch(error){
            // Si hay algún error se redirige al usuario al inicio de sesión
            navigate('/SICA/iniciar-sesion')
        }
    }, [navigate])

    // Método para obtener los grupos del backend
    useEffect(() => {
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
    }, [])

    // Carga alumnos del grupo seleccionado
    useEffect(() => {
        if(grupoOrigen){
            const token = localStorage.getItem("token");
            fetch(`http://localhost:3000/api/alumnos/por-grupo/${grupoOrigen}`, { // Obtener los alumnos del backend
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

    const manejarCheckbox = (id) => {
        setSeleccionados(prev =>
            prev.includes(id)
                ? prev.filter(alumnoId => alumnoId !== id)
                : [...prev, id]
        )
    }

    const migrar = async () => {
        setCargando(true)
        setMensaje('')

        try {
            const res = await fetch('/api/grupos/migrar-alumnos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({
                    grupoOrigen,
                    grupoDestino,
                    alumnos: seleccionados,
                }),
            })

            const data = await res.json()

            if (!res.ok) throw new Error(data.mensaje || 'Error al migrar alumnos')
            setMensaje('✅ ' + data.mensaje)

            // Limpia el estado
            setSeleccionados([])
            setGrupoOrigen('')
            setGrupoDestino('')
            setAlumnos([])
        } catch (error) {
            setMensaje('❌ ' + error.message)
        } finally {
            setCargando(false)
        }
    }

    return (
        <div>
            <MenuLateral elementos={menu}/>
            <div>
                <h2>Migrar alumnos entre grupos</h2>

                <div>
                    <label>Grupo origen:</label>
                    <select value={grupoOrigen} onChange={e => setGrupoOrigen(e.target.value)}>
                        <option value="">Selecciona</option>
                        {grupos.map(g => (
                            <option key={g._id} value={g._id}>{g.nombre}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label>Grupo destino:</label>
                    <select value={grupoDestino} onChange={e => setGrupoDestino(e.target.value)}>
                        <option value="">Selecciona</option>
                        {grupos
                            .filter(g => g._id !== grupoOrigen)
                            .map(g => (
                                <option key={g._id} value={g._id}>{g.nombre}</option>
                            ))}
                    </select>
                </div>

                {alumnos.length > 0 && (
                    <div>
                        <h3>Selecciona alumnos a migrar:</h3>
                        <ul>
                            {alumnos.map(a => (
                                <li key={a._id}>
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={seleccionados.includes(a._id)}
                                            onChange={() => manejarCheckbox(a._id)}
                                        />
                                        {a.nombre} {a.apellido}
                                    </label>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <button
                    onClick={migrar}
                    disabled={cargando || !grupoOrigen || !grupoDestino || seleccionados.length === 0}
                >
                    {cargando ? 'Migrando...' : 'Migrar alumnos'}
                </button>

                {mensaje && <p>{mensaje}</p>}
            </div>
        </div>
    )
}