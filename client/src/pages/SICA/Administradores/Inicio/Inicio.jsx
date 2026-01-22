import MenuLateral from '../../../../components/sica/MenuLateral/MenuLateral'
import Bienvenida from '../../../../components/sica/Bienvenida/Bienvenida'
import { useEffect, useState } from 'react'
import { useAuth } from '../../../../auth/useAuth'
import '../../../../assets/styles/global.css'

// Página de inicio del SICA para administradores
export default function InicioAdmin(){
    const {usuario} = useAuth() // Usuario autenticado
    const [mensaje, setMensaje] = useState('') // Mensaje de bienvenida
    // Botones para acciones rápidas
    const [boton1, setBoton1] = useState({})
    const [boton2, setBoton2] = useState({})

    useEffect(() => { // Se asigna un mensaje de bienvenida distinto dependiendo del rol
        if(usuario.rol === 'superadmin'){
            setMensaje('Este es el sistema de calificaciones, aquí podrás gestionar los usuarios del sistema, gestionar los grupos y subir las calificaciones de los alumnos')
            setBoton1({
                texto:'Agregar usuario', 
                link:'/SICA/administradores/agregar-usuario'
            })
            setBoton2({
                texto:'Ver usuarios', 
                link:'/SICA/administradores/ver-usuarios'
            })
        }else if(usuario.rol==='editor'){
            setMensaje('Este es el sistema de calificaciones, aquí podrás gestionar los alumnos del sistema, gestionar los grupos y subir las calificaciones de los alumnos')
            setBoton1({
                texto:'Subir calificaciones', 
                link:'/SICA/administradores/calificaciones'
            })
            setBoton2({
                texto:'Ver grupos', 
                link:'/SICA/administradores/ver-grupos'
            })
        } else if(usuario.rol==='lector'){
            setMensaje('Este es el sistema de calificaciones, aquí podrás consultar los alumnos del sistema, las calificaciones, y los grupos')
            setBoton1({
                texto:'Ver calificaciones', 
                link:'/SICA/administradores/calificaciones'
            })
            setBoton2({
                texto:'Ver usuarios', 
                link:'/SICA/administradores/ver-usuarios'
            })
        }
    }, [usuario])

    return(
        <div className='contenedor-principal'>
            <MenuLateral/>
            <Bienvenida 
                nombre={usuario.nombre}
                mensaje={mensaje}
                boton1={boton1.texto}
                link1={boton1.link}
                boton2={boton2.texto}
                link2={boton2.link}
            />
        </div>
    )
}