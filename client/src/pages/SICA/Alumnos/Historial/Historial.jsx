import MenuLateral from '../../../../components/sica/MenuLateral/MenuLateral'
import { useValidarToken } from '../../../../hooks/useValidarToken/useValidarToken'
import { useValidarRol } from '../../../../hooks/useValidarRol/useValidarRol'
import { useEffect } from 'react'
import { jwtDecode } from 'jwt-decode'
import { useState } from 'react'
import '../../../../assets/styles/global.css'
import './Historial.css'
import MensajeCarga from '../../../../components/sica/MensajeCarga/MensajeCarga'

// Página de inicio del SICA para alumnos
export default function Historial(){
    useValidarToken() // El usuario debe haber iniciado sesión
    useValidarRol(['alumno']) // El usuario debe tener permiso para acceder a esta ruta

    const token = localStorage.getItem('token') // Token de inicio de sesión
    const tokenDecodificado = jwtDecode(token) // Datos del token
    const [historial, setHistorial] = useState([]) // Historial académico

    useEffect(() => { // Se obtiene el historial académico del alumno
        fetch(`/api/historial-academico/${tokenDecodificado.id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }).then(async res => {
            const data = await res.json()
            if(!res.ok){
                alert(data.mensaje || 'Error al obtener el historial académico')
                return
            }
            
            setHistorial(data[0].calificaciones)
        }).catch(err => {
            console.error('Error al obtener el historial académico:', err)
            alert('No se pudo conectar con el servidor.')
        })
    }, [])

    if(historial.length === 0){ // Mientras no hayan calificaciones cargadas se muestra un mensaje de carga
        return(
            <MensajeCarga/>
        )
    }
    return (
        <div className="contenedor-principal">
            <MenuLateral />
            <div className="contenido-principal">
            <h1>Historial Académico</h1>

            {/** Agrupar por semestre */}
            {Object.entries(
                historial.reduce((acc, cal) => {
                const sem = cal.semestre || 'Sin semestre'
                if (!acc[sem]) acc[sem] = []
                acc[sem].push(cal)
                return acc
                }, {})
            ).map(([semestre, calificaciones]) => (
                <div key={semestre} style={{ marginBottom: '2rem' }}>
                <h2 className="historial-semestre">{semestre}</h2>
                <table className="tabla-calificaciones">
                    <thead>
                    <tr>
                        <th>Materia</th>
                        <th>Promedio</th>
                    </tr>
                    </thead>
                    <tbody>
                    {calificaciones.map((cal, i) => (
                        <tr key={i}>
                        <td>{cal.materiaId?.nombre}</td>
                        <td>{cal.nota}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                </div>
            ))}
            </div>
        </div>
    )
}