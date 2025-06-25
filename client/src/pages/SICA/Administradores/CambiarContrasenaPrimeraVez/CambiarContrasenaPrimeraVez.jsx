import { useState, useEffect } from 'react'
import jwtDecode from 'jwt-decode'
import { useNavigate } from 'react-router-dom'


// Página del SICA para cambiar la contraseña de un usuario cuando ingresa por primera vez al sistema
export default function PrimerCambioContrasena() {
  const navigate = useNavigate()
  const [rol, setRol] = useState(null)
  const [nuevaContrasena, setNuevaContrasena] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [cargando, setCargando] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/SICA/iniciar-sesion')
      return
    }
    try {
      const tokenDecodificado = jwtDecode(token)
      setRol(tokenDecodificado.rol)
    } catch {
      navigate('/SICA/iniciar-sesion')
    }
  }, [navigate])

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
        : '/api/administradores/primer-cambio-contrasena'

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

      setMensaje('✅ Contraseña actualizada correctamente.')
      setTimeout(() => navigate('/SICA/iniciar-sesion'), 2000)
    } catch (error) {
      setMensaje('❌ ' + error.message)
    } finally {
      setCargando(false)
    }
  }

  return (
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
  )
}