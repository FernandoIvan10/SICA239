import MenuLateral from '../../../../components/sica/MenuLateral/MenuLateral'
import { useValidarToken } from '../../../../hooks/useValidarToken/useValidarToken'
import { useValidarRol } from '../../../../hooks/useValidarRol/useValidarRol'
import { jwtDecode } from 'jwt-decode'
import { useEffect, useState } from 'react'
import '../../../../assets/styles/global.css'
import './Horario.css'

// Página de inicio del SICA para alumnos
export default function Horario(){
    useValidarToken() // El usuario debe haber iniciado sesión
    useValidarRol(['alumno']) // El usuario debe tener permiso para acceder a esta ruta

    const token = localStorage.getItem('token') // Token de inicio de sesión
    const tokenDecodificado = jwtDecode(token) // Datos del token
    const [horarios, setHorarios] = useState([]) // Horarios del alumno 

    useEffect(() => { // Se obtienen los horarios del alumno
            fetch(`/api/horarios/${tokenDecodificado.id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }).then(async res => {
                const data = await res.json()
                if(!res.ok){
                    alert(data.mensaje || 'Error al obtener los horarios')
                    return
                }
        
                    setHorarios(data)
            }).catch(err => {
                console.error('Error al obtener los horarios:', err)
                alert('No se pudo conectar con el servidor.')
            })
    }, [])

    return(
        <div className="contenedor-principal">
            <MenuLateral/>
            <div className="contenido-principal">
                {horarios.map((h, i) => (
                    <div className="contenedor-horario" key={i}>
                        <img className="horario" src={h.imagenUrl} alt={`Horario ${h.grupo}`}/>
                        <label className="horario-nombre">Horario - {h.grupo}</label>
                    </div>
                ))}
            </div>
        </div>
    )
}