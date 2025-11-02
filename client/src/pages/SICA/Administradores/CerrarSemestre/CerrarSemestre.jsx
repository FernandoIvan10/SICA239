import MenuLateral from '../../../../components/sica/MenuLateral/MenuLateral'
import { useState } from 'react'
import { useValidarToken } from '../../../../hooks/useValidarToken/useValidarToken'
import { useValidarRol } from '../../../../hooks/useValidarRol/useValidarRol'
import './CerrarSemestre.css'

// Página del SICA para cerrar un semestre pasando las calificaciones parciales al historial académico
export default function CerrarSemestre(){
    useValidarToken() // El usuario debe haber iniciado sesión
    useValidarRol(['superadmin']) // El usuario debe tener permiso para acceder a esta ruta

    const token = localStorage.getItem('token') // Token de inicio de sesión
    const [confirmar, setConfirmar] = useState(false) // Si está en true se muestra el mensaje de advertencia
    const [cargando, setCargando] = useState(false) // Deshabilita botones mientras se espera una respuesta

    // Método para guardar los promedios en el historial académico y eliminar todas las calificaciones parciales actuales
    const cerrarSemestre = async () => {
        setCargando(true)
        try {
            const res = await fetch('/api/historial-academico', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            })

            const data = await res.json()

            if (!res.ok) throw new Error(data.mensaje || 'Error al cerrar el semestre')

            alert('Semestre cerrado con éxito. Las calificaciones han sido archivadas.')
        } catch (error) {
            console.log(error)
            alert(error.message)
        } finally {
            setCargando(false)
            setConfirmar(false)
        }
    }
    
    return (
        <div className="contenedor-principal">
            <MenuLateral/>
            <div className="contenido-principal">
                <h1>Cerrar Semestre</h1>
                <p>Esta acción guardará los promedios en el historial académico y eliminará todas las calificaciones parciales actuales.</p>
                <div className="cerrar-semestre-botones">
                    <button
                        className="cerrar-semestre-boton"
                        onClick={() => setConfirmar(true)}
                        disabled={cargando}
                    >
                        Cerrar semestre actual
                    </button>
                </div>
                {confirmar && (
                    <div className="cerrar-semestre-contenedor-alerta">
                        <div className="cerrar-semestre-alerta-mensaje">
                        <h2>¿Confirmar cierre de semestre?</h2>
                        <p>⚠️ Esta acción no se puede deshacer. Asegúrate de haber verificado todas las calificaciones.</p>
                        <div className="cerrar-semestre-alerta-botones">
                            <button className="cerrar-semestre-boton-confirmar" onClick={cerrarSemestre} disabled={cargando}>
                            Cerrar semestre permanentemente
                            </button>
                            <button className="cerrar-semestre-boton-cancelar" onClick={() => setConfirmar(false)} disabled={cargando}>
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