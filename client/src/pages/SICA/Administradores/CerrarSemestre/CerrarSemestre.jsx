import {jwtDecode} from "jwt-decode"
import MenuLateral from "../../../../components/sica/MenuLateral/MenuLateral";
import "./CerrarSemestre.css"
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useValidarToken } from "../../../../hooks/useValidarToken/useValidarToken";

import { FaHouseChimney } from "react-icons/fa6";
import { FaFileUpload, FaUsers, FaUserEdit, FaLayerGroup } from "react-icons/fa";
import { TiUserAdd } from "react-icons/ti";
import { IoLogOut } from "react-icons/io5";
import { MdGroupAdd, MdGroups } from "react-icons/md";
import { RiCalendarScheduleFill } from "react-icons/ri";

// Página del SICA para cerrar un semestre pasando las calificaciones parciales al historial académico
export default function CerrarSemestre(){
    const navigate = useNavigate() // Para redireccionar a los usuarios
    const [menu, setMenu] = useState([]) // Elementos del menú
    const [confirmar, setConfirmar] = useState(false) // Si está en true se muestra el mensaje de advertencia
    const [mensaje, setMensaje] = useState('') // Mensaje de éxito o error
    const [cargando, setCargando] = useState(false) // Deshabilita botones mientras se espera una respuesta

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
                }else if(tokenDecodificado.rol === 'editor' || tokenDecodificado.rol === 'lector'){
                    // Si el usuario es editor o lector se redirige al panel
                    navigate('/SICA/administradores/inicio')
                }
            }catch(error){
                // Si hay algún error se redirige al usuario al inicio de sesión
                navigate('/SICA/iniciar-sesion')
            }
    }, [navigate])

    // Método para guardar los promedios en el historial académico y eliminar todas las calificaciones parciales actuales
    const cerrarSemestre = async () => {
        setCargando(true)
        setMensaje('')
        try {
            const res = await fetch('/api/historial-academico', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            })

            const data = await res.json()

            if (!res.ok) throw new Error(data.mensaje || 'Error al cerrar el semestre')

            setMensaje('✅ Semestre cerrado con éxito. Las calificaciones han sido archivadas.')
        } catch (error) {
            setMensaje('❌ ' + error.message)
        } finally {
            setCargando(false)
            setConfirmar(false)
        }
    }
    
    return (
        <div className="contenedor-inicio">
            <MenuLateral elementos={menu} />
            <div className="contenido-principal">
                <h2>Cerrar Semestre</h2>
                <p>Esta acción guardará los promedios en el historial académico y eliminará todas las calificaciones parciales actuales.</p>
                <button
                    onClick={() => setConfirmar(true)}
                    disabled={cargando}
                    style={{ backgroundColor: 'red', color: 'white' }}
                >
                    Cerrar semestre actual
                </button>

                {confirmar && (
                    <div>
                        <p>¿Estás seguro? Esta acción no se puede deshacer.</p>
                        <button onClick={cerrarSemestre} disabled={cargando}>
                            Confirmar
                        </button>
                        <button onClick={() => setConfirmar(false)} disabled={cargando}>
                            Cancelar
                        </button>
                    </div>
                )}

                {mensaje && <p>{mensaje}</p>}
            </div>
        </div>
    )
}