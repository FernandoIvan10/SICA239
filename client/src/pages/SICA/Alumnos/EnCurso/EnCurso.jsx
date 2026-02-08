import MenuLateral from '../../../../components/sica/MenuLateral/MenuLateral'
import MensajeCarga from '../../../../components/sica/MensajeCarga/MensajeCarga'
import MensajeEstado from '../../../../components/sica/MensajeEstado/MensajeEstado'
import { obtenerCalificacionesAlumno } from '../../../../api/alumnos.api'
import { useEffect } from 'react'
import { useState } from 'react'
import { useAuth } from '../../../../auth/useAuth'
import '../../../../assets/styles/global.css'

// Página de inicio del SICA para consultar las calificaciones del semestre en curso
export default function EnCurso(){
    const [parciales, setParciales] = useState([]) // Parciales hasta el momento
    const [calificaciones, setCalificaciones] = useState([]) // Calificaciones hasta el momento
    const [esperandoRespuesta, setEsperandoRespuesta] = useState(true) 
    const [error, setError] = useState(null)
    
    const {cargando, usuario} = useAuth() // Usuario autenticado

    // Método para cargar las calificaciones del alumno
    const cargarCalificacionesAlumno = async (id) => {
        try{
            const respuesta = await obtenerCalificacionesAlumno(id)
            setParciales(respuesta.parciales)
            setCalificaciones(respuesta.calificaciones)
        }catch(error){
            console.error('Error al cargar las calificaciones del alumno:', error)
            setError(error.message || 'Error al cargar las calificaciones del alumno.')
        }
    }

    useEffect(()=>{ // Se obtienen las calificaciones del alumno
        if(!cargando && usuario){
            cargarCalificacionesAlumno(usuario.id)
            setEsperandoRespuesta(false)
        }
    },[cargando, usuario])

    if(
        cargando
        || !usuario
        || esperandoRespuesta
    ){ // Mientras se espera la respuesta del servidor, se muestra un mensaje de carga
        return(
            <MensajeCarga/>
        )
    }

    return(
        <div className="contenedor-principal">
            <MenuLateral/>
            <div className="contenido-principal">
                <h1>Calificaciones Parciales</h1>
                <MensajeEstado
                    error={error}
                    exito={null}
                />
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