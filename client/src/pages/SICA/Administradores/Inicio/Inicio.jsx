import MenuLateral from '../../../../components/sica/MenuLateral/MenuLateral'
import Bienvenida from '../../../../components/sica/Bienvenida/Bienvenida'
import { useAuth } from '../../../../auth/useAuth'
import '../../../../assets/styles/global.css'
import Cargando from '../../../../components/sica/Cargando/Cargando'

// Página de inicio del SICA para administradores
export default function InicioAdmin(){
    const {usuario} = useAuth() // Usuario autenticado
    
    const configuracionPorRol = {
        superadmin: {
            mensaje: 'Este es el sistema de calificaciones, aquí podrás gestionar los usuarios del sistema, gestionar los grupos y subir las calificaciones de los alumnos',
            boton1: { texto: 'Agregar usuario', link: '/SICA/administradores/agregar-usuario' },
            boton2: { texto: 'Ver usuarios', link: '/SICA/administradores/ver-usuarios' }
        },
        editor: {
            mensaje: 'Este es el sistema de calificaciones, aquí podrás gestionar los alumnos del sistema, gestionar los grupos y subir las calificaciones de los alumnos',
            boton1: { texto: 'Subir calificaciones', link: '/SICA/administradores/calificaciones' },
            boton2: { texto: 'Ver grupos', link: '/SICA/administradores/ver-grupos' }
        },
        lector: {
            mensaje: 'Este es el sistema de calificaciones, aquí podrás consultar los alumnos del sistema, las calificaciones, y los grupos',
            boton1: { texto: 'Ver calificaciones', link: '/SICA/administradores/calificaciones' },
            boton2: { texto: 'Ver usuarios', link: '/SICA/administradores/ver-usuarios' }
        }
    }

    // Si usuario no existe, no renderizar nada aún
    if (!usuario) return <Cargando/>

    const configuracion = configuracionPorRol[usuario.rol] || {}

    return(
        <div className='contenedor-principal'>
            <MenuLateral/>
            <Bienvenida 
                nombre={usuario.nombre}
                mensaje={configuracion.mensaje || ''}
                boton1={configuracion.boton1?.texto || ''}
                link1={configuracion.boton1?.link || '#'}
                boton2={configuracion.boton2?.texto || ''}
                link2={configuracion.boton2?.link || '#'}
            />
        </div>
    )
}