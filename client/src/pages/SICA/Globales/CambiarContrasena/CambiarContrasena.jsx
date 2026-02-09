import MenuLateral from '../../../../components/sica/MenuLateral/MenuLateral'
import MensajeEstado from '../../../../components/sica/MensajeEstado/MensajeEstado'
import Input from '../../../../components/sica/Input/Input'
import { editarContrasenaAlumno } from '../../../../api/alumnos.api'
import { editarContrasenaAdministrador } from '../../../../api/admins.api'
import { useState} from 'react'
import { useAuth } from '../../../../auth/useAuth'
import '../../../../assets/styles/global.css'

// Página del SICA para cambiar la contraseña del usuario
export default function CambiarContrasena() {
  const [contrasenaAntigua, setContrasenaAntigua] = useState('')
  const [contrasenaNueva, setContrasenaNueva] = useState('')
  const [esperandoRespuesta, setEsperandoRespuesta] = useState(false)
  const [exito, setExito] = useState(null)
  const [error, setError] = useState(null)

  const {cargando, usuario} = useAuth() // Usuario autenticado

  // Método para cambiar la contraseña del usuario activo
  const cambiarContrasena = async (e) => {
    e.preventDefault()
    if(cargando || !usuario) return
    
    if(!contrasenaAntigua || !contrasenaNueva){
      setError('Ambos campos son obligatorios.')
      return
    }

    if(contrasenaNueva.length < 6){
      setError('La contraseña nueva debe tener al menos 6 caracteres.')
      return
    }
    
    if(contrasenaNueva === contrasenaAntigua){
      setError('La contraseña nueva no puede ser igual a la antigua.')
      return
    }

    try{
      setEsperandoRespuesta(true)
      setError(null)
      setExito(null)

      usuario.rol === 'alumno' 
        ? await editarContrasenaAlumno(usuario.id, { contrasenaAntigua, contrasenaNueva })
        : await editarContrasenaAdministrador(usuario.id, { contrasenaAntigua, contrasenaNueva })

      setExito('Contraseña actualizada exitosamente')
    }catch(error){
      console.error('Error al cambiar contraseña:', error)
      setError(error.message || 'Error al cambiar contraseña.')
    }finally{
      setEsperandoRespuesta(false)
    }
  }

  return (
    <div className="contenedor-principal">
      <MenuLateral/>
      <div className="contenido-principal">
        <h1>Cambio de contraseña</h1>
        <form className="formulario-contrasena" onSubmit={cambiarContrasena}>
          <Input
            className="formulario-contrasena__campo"
            label="Contraseña antigua"
            type="password"
            value={contrasenaAntigua}
            onChange={(e) => setContrasenaAntigua(e.target.value)}
            required
            disabled={esperandoRespuesta}
          />
          <Input
            className="formulario-contrasena__campo"
            label="Contraseña nueva"
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