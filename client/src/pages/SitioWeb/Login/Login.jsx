import BarraNavegacion from '../../../components/sitio_web/BarraNavegacion/BarraNavegacion'
import Formulario from "../../../components/sica/Formulario/Formulario";
import { FaUserCircle } from "react-icons/fa"
import { useState } from 'react'
import './Login.css'

// Página para iniciar sesión
export default function Login(){
    // Hooks
    const [activarPestaña, setActivarPestaña] = useState('alumno') // Alternar entre formularios
    const [usuarioAlumno, setUsuarioAlumno] = useState('') // Número de control
    const [usuarioAdmin, setUsuarioAdmin] = useState('') // RFC
    const [contraseñaAlumno, setContraseñaAlumno] = useState('') // Contraseña del alumno
    const [contraseñaAdmin, setContraseñaAdmin] = useState('') // Contraseña del administrador
    const [error, setError] = useState('') // Manejo de errores

    // Campos del formulario de administradores

    // Método para iniciar sesión
    const iniciarSesion = async (e) => {
        console.log('Pestaña activa:', activarPestaña);
        console.log('Usuario:', usuarioAdmin);
        console.log('Contraseña:', contraseñaAdmin);
        e.preventDefault()
        try{
            const endpoint = 'http://localhost:3000/api/auth/login' // Ruta de la API para iniciar sesión
            const payload = {
                tipoUsuario:activarPestaña,
                usuario: activarPestaña === 'alumno' ? usuarioAlumno : usuarioAdmin,
                contraseña: activarPestaña === 'alumno' ? contraseñaAlumno : contraseñaAdmin,
            }

            console.log(payload.activarPestaña)
            console.log(payload.usuario)
            console.log(payload.contraseña)

            // Se usa la api para iniciar sesión
            const response = await fetch(endpoint,{
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body: JSON.stringify(payload),
            })

            // Valida que no ocurra ningún error
            if(!response.ok){
                const errorData = await response.json()
                throw new Error(errorData.message || 'Error al iniciar sesion')
            }

            const datos = await response.json()
            const {token, nombre, apellido, tipoUsuario} = datos

            // La sesión debe mantenerse iniciada
            localStorage.setItem('token',token)
            localStorage.setItem('tipoUsuario',tipoUsuario)

            // El usuario es redirigido al sistema
            const ruta = tipoUsuario === 'alumno' ? '/SICA/alumnos/inicio' : '/SICA/administradores/inicio'
            window.location.href = ruta
        }catch(error){
            setError(error.message)
        }
    }

    return(
        <>
        {/* Barra de navegación principal */}
        <BarraNavegacion/>
        <h1 className='h1-login'>Sistema de Calificaciones</h1>
        {/* Tarjeta flotante que envuelve el login */}
        <div className='tarjeta-flotante'>
            {/* Pestañas que permiten alternar entre los formularios */}
            <div className='pestañas'>
                <div
                    className={`pestaña ${activarPestaña === 'alumno' ? 'activado':''}`}
                    onClick={()=>setActivarPestaña('alumno')}
                >Alumnos</div>
                <div
                    className={`pestaña ${activarPestaña === 'administrador' ? 'activado':''}`}
                    onClick={()=>setActivarPestaña('administrador')}
                >Administradores</div>
            </div>                
            <div className='contenido'>
                {activarPestaña==='alumno' ?(
                    // Formulario de alumnos
                    <>
                    <Formulario
                        onSubmit={iniciarSesion}
                        icono={<FaUserCircle className='formulario-icono'/>}
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
                            value:contraseñaAlumno,
                            onChange:(e)=>setContraseñaAlumno(e.target.value),
                        },]}
                        botones={[{texto:"Entrar"}]}
                        error={error}
                    />
                    </>
                ):(
                    // Formulario de administradores
                    <>
                    <Formulario
                        onSubmit={iniciarSesion}
                        icono={<FaUserCircle className='formulario-icono'/>}
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
                            value:contraseñaAdmin,
                            onChange:(e)=>setContraseñaAdmin(e.target.value),
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