import { useState, useEffect } from 'react'
import {jwtDecode} from 'jwt-decode'
import { useNavigate } from 'react-router-dom'
import MenuLateral from '../../../../components/sica/MenuLateral/MenuLateral'
import { useValidarToken } from '../../../../hooks/useValidarToken/useValidarToken'

// Página del SICA para cambiar la contraseña de un usuario cuando ingresa por primera vez al sistema
export default function PrimerCambioContrasena() {
  useValidarToken() // El usuario debe haber iniciado sesión

  const navigate = useNavigate() // Para redirigir al usuario
  const [rol, setRol] = useState(null) // Tipo de usuario
  const [nuevaContrasena, setNuevaContrasena] = useState('')
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

  // Método para cambiar la contraseña
  const cambiarContrasena = async (e) => {
    e.preventDefault()
    setMensaje('')
    if (nuevaContrasena.length < 6) {
      setMensaje('La contraseña debe tener al menos 6 caracteres.')
      return
    }
    setCargando(true)

    const url =
      rol === 'alumno'
        ? '/api/alumnos/primer-cambio-contrasena'
        : '/api/admins/primer-cambio-contrasena'

    try {
      const res = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ nuevaContrasena }),
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
    <>
      <MenuLateral/>
      <div style={{ maxWidth: 400, margin: 'auto', padding: 20 }}>
        <h2>Primer cambio de contraseña</h2>
        <form onSubmit={cambiarContrasena}>
          <label htmlFor="nuevaContrasena">Nueva contraseña:</label>
          <input
            id="nuevaContrasena"
            type="password"
            value={nuevaContrasena}
            onChange={(e) => setNuevaContrasena(e.target.value)}
            minLength={6}
            required
            disabled={cargando}
            autoFocus
          />
          <button type="submit" disabled={cargando} style={{ marginTop: 10 }}>
            {cargando ? 'Guardando...' : 'Actualizar contraseña'}
          </button>
        </form>
        {mensaje && <p style={{ marginTop: 10 }}>{mensaje}</p>}
      </div>
    </>
  )
}