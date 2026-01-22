import { useAuth } from '../../../auth/useAuth'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import BarraNavegacion from '../../../components/sitio_web/BarraNavegacion/BarraNavegacion'
import FormularioInicioSesion from '../../../components/sica/Formulario/FormularioInicioSesion'
import { iniciarSesion } from '../../../api/auth.api'
import { FaUserCircle } from 'react-icons/fa'
import './Login.css'

// Página para iniciar sesión
export default function Login(){
    const navigate = useNavigate()
    const {login} = useAuth()

    // Hooks
    const [pestanaActiva, setPestanaActiva] = useState('alumno') // Alternar entre pestañas
    const [usuarioAlumno, setUsuarioAlumno] = useState('')
    const [usuarioAdmin, setUsuarioAdmin] = useState('')
    const [contrasenaAlumno, setContrasenaAlumno] = useState('')
    const [contrasenaAdmin, setContrasenaAdmin] = useState('')
    const [error, setError] = useState('') // Manejo de errores

    // Método para iniciar sesión
    const ingresar = async (e) => {
        e.preventDefault()
        try{
            const credenciales = { // Credenciales
                tipoUsuario:pestanaActiva,
                usuario: pestanaActiva === 'alumno' ? usuarioAlumno : usuarioAdmin,
                contrasena: pestanaActiva === 'alumno' ? contrasenaAlumno : contrasenaAdmin,
            }

            // Se realiza la solicitud de inicio de sesión
            const datos = await iniciarSesion(credenciales)

            // La sesión es almacenada
            const {token} = datos
            login(token)

            // El usuario es redirigido al sistema
            if (pestanaActiva === 'alumno') {
                navigate('/SICA/alumnos/inicio')
            }else{
                navigate('/SICA/administradores/inicio')
            }
        }catch(error){
            console.error('Error al iniciar sesión:', error)
            setError(error.message || 'Error al iniciar sesión')
        }
    }

    return(
        <>
            <BarraNavegacion/>
            <h1 className="login__titulo">Sistema de Calificaciones</h1>
            {/* Tarjeta flotante que envuelve el login */}
            <div className="login__tarjeta-flotante">
                {/* Pestañas que permiten alternar entre los formularios */}
                <div className="login__pestañas">
                    <div
                        className={`login__pestaña ${pestanaActiva === "alumno" ? "activado":""}`}
                        onClick={()=>setPestanaActiva("alumno")}
                    >
                        Alumnos
                    </div>
                    <div
                        className={`login__pestaña ${pestanaActiva === "administrador" ? "activado":""}`}
                        onClick={()=>setPestanaActiva("administrador")}
                    >
                        Administradores
                    </div>
                </div>                
                <div className="login__formulario">
                    {pestanaActiva==="alumno" ?(
                        // Formulario de alumnos
                        <>
                        <FormularioInicioSesion
                            onSubmit={ingresar}
                            icono={<FaUserCircle/>}
                            campos={[{
                                texto:"Número de control:",
                                type:"text",
                                placeholder:"Ingrese su número de control",
                                value:usuarioAlumno,
                                onChange:(e)=>setUsuarioAlumno(e.target.value),
                            },{
                                texto:"Contraseña:",
                                type:"password",
                                placeholder:"Ingrese su contraseña",
                                value:contrasenaAlumno,
                                onChange:(e)=>setContrasenaAlumno(e.target.value),
                            },]}
                            botones={[{texto:"Entrar"}]}
                            error={error}
                        />
                        </>
                    ):(
                        // Formulario de administradores
                        <>
                        <FormularioInicioSesion
                            onSubmit={ingresar}
                            icono={<FaUserCircle/>}
                            campos={[{
                                texto:"Usuario:",
                                type:"text",
                                placeholder:"Ingrese su usuario",
                                value:usuarioAdmin,
                                onChange:(e)=>setUsuarioAdmin(e.target.value),
                            },{
                                texto:"Contraseña:",
                                type:"password",
                                placeholder:"Ingrese su contraseña",
                                value:contrasenaAdmin,
                                onChange:(e)=>setContrasenaAdmin(e.target.value),
                            },]}
                            botones={[{texto:"Entrar"}]}
                            error={error}
                        />
                        </>
                    )}
                </div>
            </div>
        </>
    )
}