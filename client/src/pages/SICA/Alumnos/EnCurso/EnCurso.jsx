import MenuLateral from '../../../../components/sica/MenuLateral/MenuLateral'
import { useValidarToken } from '../../../../hooks/useValidarToken/useValidarToken'
import { useValidarRol } from '../../../../hooks/useValidarRol/useValidarRol'
import { useEffect } from 'react'
import { jwtDecode } from 'jwt-decode'
import { useState } from 'react'
import '../../../../assets/styles/global.css'
import MensajeCarga from '../../../../components/sica/MensajeCarga/MensajeCarga'

// Página de inicio del SICA para consultar las calificaciones del semestre en curso
export default function EnCurso(){
    useValidarToken() // El usuario debe haber iniciado sesión
    useValidarRol(['alumno']) // El usuario debe tener permiso para acceder a esta ruta

    const token = localStorage.getItem('token') // Token de inicio de sesión
    const tokenDecodificado = jwtDecode(token) // Datos del token
    const [parciales, setParciales] = useState([]) // Parciales hasta el momento
    const [calificaciones, setCalificaciones] = useState([]) // Calificaciones hasta el momento

    useEffect(()=>{ // Se obtienen las calificaciones del alumno
        fetch(`http://localhost:3000/api/calificaciones/${tokenDecodificado.id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }).then(async res => {
            const data = await res.json()
            if(!res.ok){
                alert(data.mensaje || 'Error al obtener calificaciones.')
                return
            }
            
            setParciales(data.parciales)
            setCalificaciones(data.calificaciones)
        }).catch(err => {
            console.error('Error al obtener las calificaciones:', err)
            alert('No se pudo conectar con el servidor.')
        })
    },[])

    if(calificaciones.length === 0){ // Mientras no haya calificaciones cargadas se muestra un mensaje de carga
        return(
            <MensajeCarga/>
        )
    }
    return(
        <div className="contenedor-principal">
            <MenuLateral/>
            <div className="contenido-principal">
                <h1>Calificaciones Parciales</h1>
                <table className="tabla-calificaciones">
                    <thead>
                        <tr>
                        <th>Materia</th>
                        {parciales.map(parcial => (
                            <th key={parcial}>{parcial}</th>
                        ))}
                        <th>Promedio</th>
                        </tr>
                    </thead>
                    <tbody>
                        {calificaciones.map((cal, i) => (
                        <tr key={i}>
                            <td>{cal.materia}</td>
                            {parciales.map(parcial => (
                            <td key={parcial}>{cal[parcial] ?? '-'}</td>
                            ))}
                            <td>{cal.promedio ?? '-'}</td>
                        </tr>
                        ))}
                    </tbody>
                    </table>
            </div>
        </div>
    )
}