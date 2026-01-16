import {jwtDecode} from 'jwt-decode'
import MenuLateral from '../../../../components/sica/MenuLateral/MenuLateral'
import Bienvenida from '../../../../components/sica/Bienvenida/Bienvenida'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useValidarToken } from '../../../../hooks/useValidarToken/useValidarToken'
import { useValidarRol } from '../../../../hooks/useValidarRol/useValidarRol'
import '../../../../assets/styles/global.css'

// Página de inicio del SICA para administradores
export default function InicioAdmin(){
    useValidarToken() // El usuario debe haber iniciado sesión
    useValidarRol(['superadmin', 'editor', 'lector']) // El usuario debe tener permiso para acceder a esta ruta

    const navigate = useNavigate() // Para redireccionar a los usuarios
    const token = localStorage.getItem('token') // Token de inicio de sesión        
    const [nombreUsuario, setNombreUsuario] = useState('') // Nombre del usuario
    const [rol, setRol] = useState('') // Tipo de usuario
    const [mensaje, setMensaje] = useState('') // Mensaje de bienvenida
    // Botones para acciones rápidas
    const [boton1, setBoton1] = useState({})
    const [boton2, setBoton2] = useState({})

    useEffect(() => { // Se obtiene el nombre y rol del usuario del token de inicio de sesión
        try{
            const tokenDecodificado = jwtDecode(token)
            setNombreUsuario(tokenDecodificado.nombre)
            setRol(tokenDecodificado.rol)
        }catch(error){
            console.log(error)
            localStorage.removeItem(token)
            navigate('/SICA/iniciar-sesion')
        }
    },[navigate])

    useEffect(() => { // Se asigna un mensaje de bienvenida distinto dependiendo del rol
            try{
                if(rol === 'superadmin'){
                    // Mensaje de bienvenida para el superadmin
                    setMensaje('Este es el sistema de calificaciones, aquí podrás gestionar los usuarios del sistema, gestionar los grupos y subir las calificaciones de los alumnos')
                    setBoton1({texto:'Agregar usuario', link:'/SICA/administradores/agregar-usuario'})
                    setBoton2({texto:'Ver usuarios', link:'/SICA/administradores/ver-usuarios'})
                }else if(rol==='editor'){
                    // Mensaje de bienvenida para el editor
                    setMensaje('Este es el sistema de calificaciones, aquí podrás gestionar los alumnos del sistema, gestionar los grupos y subir las calificaciones de los alumnos')
                    setBoton1({texto:'Subir calificaciones', link:'/SICA/administradores/calificaciones'})
                    setBoton2({texto:'Ver grupos', link:'/SICA/administradores/ver-grupos'})
                } else if(rol==='lector'){
                    // Mensaje de bienvenida para el lector
                    setMensaje('Este es el sistema de calificaciones, aquí podrás consultar los alumnos del sistema, las calificaciones, y los grupos')
                    setBoton1({texto:'Ver calificaciones', link:'/SICA/administradores/calificaciones'})
                    setBoton2({texto:'Ver usuarios', link:'/SICA/administradores/ver-usuarios'})
                }
            }catch(error){
                console.log(error)
            }
    }, [rol])

    return(
        <div className='contenedor-principal'>
            <MenuLateral/>
            <Bienvenida 
                nombre={nombreUsuario} 
                mensaje={mensaje}
                boton1={boton1.texto}
                link1={boton1.link}
                boton2={boton2.texto}
                link2={boton2.link}
            />
        </div>
    )
}