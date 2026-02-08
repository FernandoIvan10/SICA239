import MenuLateral from '../../../../components/sica/MenuLateral/MenuLateral'
import MensajeCarga from '../../../../components/sica/MensajeCarga/MensajeCarga'
import MensajeEstado from '../../../../components/sica/MensajeEstado/MensajeEstado'
import { obtenerHistorialAcademicoAlumno } from '../../../../api/alumnos.api'
import { useEffect } from 'react'
import { useState } from 'react'
import { useAuth } from '../../../../auth/useAuth'
import '../../../../assets/styles/global.css'
import './Historial.css'

// Página de inicio del SICA para alumnos
export default function Historial(){
    const [historial, setHistorial] = useState([]) // Historial académico
    const [esperandoRespuesta, setEsperandoRespuesta] = useState(true)
    const [error, setError] = useState(null)

    const {cargando, usuario} = useAuth() // Usuario autenticado

    // Método para cargar el historial académico del alumno
    const cargarHistorialAcademicoAlumno = async (id) => {
        try{
            const respuesta = await obtenerHistorialAcademicoAlumno(id)
            setHistorial(respuesta[0].calificaciones)
        }catch(error){
            console.error('Error al cargar el historial académico del alumno:', error)
            setError(error.message || 'Error al cargar el historial académico del alumno.')
        }
    }

    useEffect(() => { // Se obtiene el historial académico del alumno
        if(!cargando && usuario){
            cargarHistorialAcademicoAlumno(usuario.id)
            setEsperandoRespuesta(false)
        }
    }, [cargando, usuario])

    if(
        cargando
        || !usuario
        || esperandoRespuesta
    ){ // Mientras se espera la respuesta del servidor, se muestra un mensaje de carga
        return(
            <MensajeCarga/>
        )
    }

    return (
        <div className="contenedor-principal">
            <MenuLateral />
            <div className="contenido-principal">
            <h1>Historial Académico</h1>
            <MensajeEstado
                error = {error}
                exito = {null}
            />
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