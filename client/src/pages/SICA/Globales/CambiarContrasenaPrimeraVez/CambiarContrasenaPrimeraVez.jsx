import MensajeEstado from '../../../../components/sica/MensajeEstado/MensajeEstado'
import Input from '../../../../components/sica/Input/Input'
import { primerCambioContrasenaAlumno } from '../../../../api/alumnos.api'
import { primerCambioContrasenaAdministrador } from '../../../../api/admins.api'
import { useAuth } from '../../../../auth/useAuth'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../../../../assets/styles/global.css'

// Página del SICA para cambiar la contraseña de un usuario cuando ingresa por primera vez al sistema
export default function PrimerCambioContrasena() { 
  const [contrasenaNueva, setContrasenaNueva] = useState('')
  const [esperandoRespuesta, setEsperandoRespuesta] = useState(false)
  const [exito, setExito] = useState(null)
  const [error, setError] = useState(null)

  const {cargando, usuario, logout} = useAuth() // Usuario autenticado
  const navigate = useNavigate()

  // Método para cambiar la contraseña
  const cambiarContrasena = async (e) => {
    e.preventDefault()

    if(cargando || !usuario) return

    if(contrasenaNueva.length < 6){
      setError('La contraseña debe tener al menos 6 caracteres.')
      return
    }

    try{
      setEsperandoRespuesta(true)
      setExito(null)
      setError(null)
    
      usuario.rol === 'alumno'
      ? await primerCambioContrasenaAlumno(usuario.id, { contrasenaNueva })
      : await primerCambioContrasenaAdministrador(usuario.id, { contrasenaNueva })

      setExito('Contraseña actualizada correctamente.')
      logout()
      navigate('/SICA/iniciar-sesion')
    }catch(error){
      console.error('Error al cambiar contraseña:', error)
      setError(error.message || 'Error al cambiar contraseña')
    }finally{
      setEsperandoRespuesta(false)
    }
  }

  return (
    <div className="contenedor-principal">
      <div className="contenido-principal">
        <h1>Primer cambio de contraseña</h1>
        <form className="formulario-cambiar-contrasena" onSubmit={cambiarContrasena}>
          <Input
              className="formulario-contrasena__campo"
              label="Nueva contraseña"
              type="password"
              value={contrasenaNueva}
              onChange={(e) => setContrasenaNueva(e.target.value)}
              required
              disabled={esperandoRespuesta}
            />
          <button className="boton--guardar" type="submit" disabled={esperandoRespuesta}>
            {esperandoRespuesta ? 'Guardando...' : 'Actualizar contraseña'}
          </button>
        </form>
        <MensajeEstado
          exito={exito}
          error={error}
        />
      </div>
    </div>
  )
}