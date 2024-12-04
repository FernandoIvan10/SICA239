import Input from '../../components/sitio_web/Input/Input'
import BarraNavegacion from '../../components/sitio_web/BarraNavegacion/BarraNavegacion'
import LogoCBTA from '../../assets/img/logo_cbta239.png'
import { useState } from 'react'
import './Login.css'

// Página para iniciar sesión
export default function Login(){
    // Hook para alternar entre el formulario de Alumnos y Administradores
    const [activarPestaña, setActivarPestaña] = useState('alumno')
    return(
        <>
        {/* Barra de navegación principal */}
        <BarraNavegacion/>
        <h1 className='h1-login'>Calificaciones</h1>
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
                    <form className='formulario'>
                        <img src={LogoCBTA} alt='Logo'/>
                        <div className='campos-formulario'>
                            <Input
                                className='input-formulario'
                                texto='Número de control:'
                                type='text'
                                placeholder='Ingrese su número de control'
                            />
                            <Input
                                className='input-formulario'
                                texto='Contraseña:'
                                type='password'
                                placeholder='Ingrese su contraseña'
                            />
                            <button className='formulario-boton'>Entrar</button>
                        </div>
                    </form>
                ):(
                    // Formulario de administradores
                    <form className='formulario'>
                        <img src={LogoCBTA} alt='Logo'/>
                        <div className='campos-formulario'>
                            <Input
                                className='input-formulario'
                                texto='Usuario:'
                                type='text'
                                placeholder='Ingrese su usuario'
                            />
                            <Input
                                className='input-formulario'
                                texto='Contraseña:'
                                type='password'
                                placeholder='Ingrese su contraseña'
                            />
                            <button className='formulario-boton'>Entrar</button>
                        </div>
                    </form>
                )}
            </div>
        </div>
        </>
    )
}