import MenuLateral from '../../../../components/sica/MenuLateral/MenuLateral'
import { useValidarToken } from '../../../../hooks/useValidarToken/useValidarToken'
import { useNavigate, useLocation } from 'react-router-dom'
import { useValidarRol } from '../../../../hooks/useValidarRol/useValidarRol'
import FormularioGrupo from '../../../../components/sica/FormularioGrupo/FormularioGrupo'
import '../../../../assets/styles/global.css'

// Página del SICA para editar grupos
export default function EditarGrupo() {
    useValidarToken() // El usuario debe haber iniciado sesión
    useValidarRol(['superadmin', 'editor']) // El usuario debe tener permiso para acceder a esta ruta

    const navigate = useNavigate() // Para redireccionar a los usuarios
    const token = localStorage.getItem('token') // Token de inicio de sesión
    const location = useLocation() // Para obtener los datos del grupo a editar
    const grupo = location.state?.grupo // Grupo a editar
    
    if (!grupo) { // Si no se recibe un grupo se redirige a la vista de grupos        
        navigate('/SICA/administradores/ver-grupos')
        return null
    }

    // Método para editar el grupo con los nuevos datos
    const guardarCambios = (nuevoNombre, nuevasMaterias) => {
        if(!nuevoNombre.trim() || nuevasMaterias.length === 0){ // Se deben rellenar el formulario
            alert('Debes ingresar un nombre de grupo y al menos una materia')
            return
        }

        fetch(`http://localhost:3000/api/grupos/${grupo._id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                nombre: nuevoNombre,
                materias: nuevasMaterias
            })
        }).then(async res => {
            if(res.ok){
                alert('Grupo actualizado correctamente')
                navigate('/SICA/administradores/ver-grupos')
            } else {
                console.error(await res.json().catch(()=>null))
                alert('Ocurrió un error al actualizar el grupo')
            }
        })
    }

    // Método para cancelar los cambios del grupo
    const cancelar = () => {
        navigate('/SICA/administradores/ver-grupos')
    }

    return (
        <div className="contenedor-principal">
            <MenuLateral />
            <FormularioGrupo
                tituloFormulario="Editar Grupo"
                guardar={guardarCambios}
                cancelar={cancelar}
                nombre={grupo.nombre}
                materias={grupo.materias.map(m => m.nombre)}
            />
        </div>
    )
}