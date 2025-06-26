import MenuLateral from "../../../../components/sica/MenuLateral/MenuLateral"
import { useState } from "react"
import { useValidarToken } from "../../../../hooks/useValidarToken/useValidarToken"
import { useValidarRol } from "../../../../hooks/useValidarRol/useValidarRol"
import "./CerrarSemestre.css"

// Página del SICA para cerrar un semestre pasando las calificaciones parciales al historial académico
export default function CerrarSemestre(){
    const token = localStorage.getItem('token') // Token de inicio de sesión
    const [confirmar, setConfirmar] = useState(false) // Si está en true se muestra el mensaje de advertencia
    const [cargando, setCargando] = useState(false) // Deshabilita botones mientras se espera una respuesta

    useValidarToken() // El usuario debe haber iniciado sesión
    useValidarRol('superadmin') // El usuario debe tener permiso para acceder a esta ruta

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
        <div className="contenedor-inicio">
            <MenuLateral/>
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
            </div>
        </div>
    )
}