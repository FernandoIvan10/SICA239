import MenuLateral from '../../../../components/sica/MenuLateral/MenuLateral'
import MensajeCarga from '../../../../components/sica/MensajeCarga/MensajeCarga'
import MensajeEstado from '../../../../components/sica/MensajeEstado/MensajeEstado'
import { guardarHistorialAcademico } from '../../../../api/historialAcademico.api'
import { useState } from 'react'
import { useAuth } from '../../../../auth/useAuth'
import './CerrarSemestre.css'

// Página del SICA para cerrar un semestre pasando las calificaciones parciales al historial académico
export default function CerrarSemestre(){
    const [confirmar, setConfirmar] = useState(false) // Si está en true se muestra el mensaje de advertencia
    const [esperandoRespuesta, setEsperandoRespuesta] = useState(false) // Deshabilita botones mientras se espera una respuesta
    const [exito, setExito] = useState(null)
    const [error, setError] = useState(null)

    const {cargando} = useAuth()

    // Método para guardar los promedios en el historial académico y eliminar todas las calificaciones parciales actuales
    const cerrarSemestre = async () => {
        try {
            setEsperandoRespuesta(true)
            await guardarHistorialAcademico()
            setExito('El semestre se ha cerrado correctamente.')
        } catch (error) {
            console.error('Error al cerrar el semestre:', error)
            setError(error.message || 'Ocurrió un error al cerrar el semestre.')
        } finally {
            setEsperandoRespuesta(false)
            setConfirmar(false)
        }
    }
    
    if(cargando){
        return <MensajeCarga/>
    }

    return (
        <div className="contenedor-principal">
            <MenuLateral/>
            <div className="contenido-principal">
                <h1>Cerrar Semestre</h1>
                <p>Esta acción guardará los promedios en el historial académico y eliminará todas las calificaciones parciales actuales.</p>
                <div className="cerrar-semestre__botones">
                    <button
                        className="cerrar-semestre__boton"
                        onClick={() => setConfirmar(true)}
                        disabled={esperandoRespuesta}
                    >
                        Cerrar semestre actual
                    </button>
                </div>
                <MensajeEstado
                    exito={exito}
                    error={error}
                />
                {confirmar && (
                    <div className="cerrar-semestre__contenedor-alerta">
                        <div className="cerrar-semestre__alerta-mensaje">
                        <h2>¿Confirmar cierre de semestre?</h2>
                        <p>⚠️ Esta acción no se puede deshacer. Asegúrate de haber verificado todas las calificaciones.</p>
                        <div className="cerrar-semestre__alerta-botones">
                            <button
                                className="cerrar-semestre__boton-confirmar"
                                onClick={cerrarSemestre}
                                disabled={esperandoRespuesta}
                            >
                                Cerrar semestre permanentemente
                            </button>
                            <button
                                className="cerrar-semestre__boton-cancelar"
                                onClick={() => setConfirmar(false)}
                                disabled={esperandoRespuesta}
                            >
                                Cancelar
                            </button>
                        </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}