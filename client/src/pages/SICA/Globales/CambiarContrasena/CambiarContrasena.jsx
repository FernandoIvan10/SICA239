import { useState, useEffect } from 'react'
import {jwtDecode} from 'jwt-decode'
import { useNavigate } from 'react-router-dom'
import { useValidarToken } from '../../../../hooks/useValidarToken/useValidarToken'
import MenuLateral from '../../../../components/sica/MenuLateral/MenuLateral'
import '../../../../assets/styles/global.css'
import './CambiarContrasena.css'

// Página del SICA para cambiar la contraseña del usuario
export default function CambiarContrasena() {
  useValidarToken() // El usuario debe haber iniciado sesión

  const navigate = useNavigate() // Para redirigir al usuario
  const token = localStorage.getItem('token') // Token de inicio de sesión
  const [rol, setRol] = useState(null) // Tipo de usuario
  const [contrasenaAntigua, setContrasenaAntigua] = useState('')
  const [contrasenaNueva, setContrasenaNueva] = useState('')
  const [mensaje, setMensaje] = useState('') // Mensaje de éxito o error
  const [cargando, setCargando] = useState(false) // Para bloquear campos y botones mientras carga

  useEffect(() => { // Se obtiene el tipo de usuario del token de inicio de sesión
    try {
      const tokenDecodificado = jwtDecode(token)
      setRol(tokenDecodificado.rol)
    } catch(error) {
      console.log(error)
      localStorage.removeItem('token')
      navigate('/SICA/iniciar-sesion')
    }
  }, [navigate])

  // Método para cambiar la contraseña del usuario activo
  const cambiarContrasena = async (e) => {
    e.preventDefault()
    setMensaje('')
    if (contrasenaNueva.length < 6) {
      setMensaje('La contraseña debe tener al menos 6 caracteres.')
      return
    }
    setCargando(true)

    const url =
      rol === 'alumno'
        ? '/api/alumnos/cambiar-contrasena'
        : '/api/admins/cambiar-contrasena'

    try {
      const res = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ contrasenaAntigua, contrasenaNueva }),
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.mensaje || 'Error al cambiar contraseña')

      setMensaje('Contraseña actualizada correctamente.')
      setTimeout(() => navigate('/SICA/iniciar-sesion'), 2000)
    } catch (error) {
      setMensaje(error.message)
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="contenedor-principal">
      <MenuLateral/>
      <div className="contenido-principal">
        <h1>Cambio de contraseña</h1>
        <form className="formulario-cambiar-contrasena" onSubmit={cambiarContrasena}>
          <div className="formulario-cambiar-contrasena-campo">
            <label className="formulario-cambiar-contrasena-label" htmlFor="contrasenaAntigua">Contraseña antigua:</label>
            <input
              id="contrasenaAntigua"
              className="formulario-cambiar-contrasena-input"
              type="password"
              value={contrasenaAntigua}
              onChange={(e) => setContrasenaAntigua(e.target.value)}
              minLength={6}
              required
              disabled={cargando}
              autoFocus
            />
          </div>
          <div className="formulario-cambiar-contrasena-campo">
            <label className="formulario-cambiar-contrasena-label" htmlFor="contrasenaNueva">Contraseña nueva:</label>
            <input
              id="contrasenaNueva"
              className="formulario-cambiar-contrasena-input"
              type="password"
              value={contrasenaNueva}
              onChange={(e) => setContrasenaNueva(e.target.value)}
              minLength={6}
              required
              disabled={cargando}
            />
          </div>
          <button className="boton-guardar" type="submit" disabled={cargando} style={{ marginTop: 10 }}>
            {cargando ? 'Guardando...' : 'Actualizar contraseña'}
          </button>
        </form>
        {mensaje && <p>{mensaje}</p>}
      </div>
    </div>
  )
}