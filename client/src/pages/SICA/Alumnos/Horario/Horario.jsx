import MenuLateral from '../../../../components/sica/MenuLateral/MenuLateral'
import MensajeCarga from '../../../../components/sica/MensajeCarga/MensajeCarga'
import MensajeEstado from '../../../../components/sica/MensajeEstado/MensajeEstado'
import { obtenerHorariosAlumno } from '../../../../api/alumnos.api'
import { useEffect, useState } from 'react'
import { useAuth } from '../../../../auth/useAuth'
import '../../../../assets/styles/global.css'
import './Horario.css'

// Página de inicio del SICA para alumnos
export default function Horario(){
    const [horarios, setHorarios] = useState([]) // Horarios del alumno 
    const [esperandoRespuesta, setEsperandoRespuesta] = useState(true)
    const [error, setError] = useState(null)

    const {cargando, usuario} = useAuth() // Usuario autenticado

    // Método para obtener los horarios del alumno
    const cargarHorariosAlumno = async (id) => {
        try{
            const respuesta = await obtenerHorariosAlumno(id)
            setHorarios(respuesta)
        }catch(error){
            console.error('Error al cargar los horarios del alumno:', error)
            setError(error.message || 'Error al cargar los horarios del alumno.')
        }
    }

    useEffect(() => { // Se obtienen los horarios del alumno
        if(!cargando && usuario){
            cargarHorariosAlumno(usuario.id)
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

    return(
        <div className="contenedor-principal">
            <MenuLateral/>
            <div className="contenido-principal">
                <MensajeEstado
                    error={error}
                    exito={null}
                />
                {horarios.map((h, i) => (
                    <div className="horarios-alumno" key={i}>
                        <img className="horarios-alumno__horario" src={h.imagenUrl} alt={`Horario ${h.grupo}`}/>
                        <label className="horarios-alumno__nombre">Horario - {h.grupo}</label>
                    </div>
                ))}
            </div>
        </div>
    )
}