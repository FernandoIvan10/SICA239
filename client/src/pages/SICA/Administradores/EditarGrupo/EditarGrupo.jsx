import MenuLateral from '../../../../components/sica/MenuLateral/MenuLateral'
import { useNavigate, useLocation } from 'react-router-dom'
import FormularioGrupo from '../../../../components/sica/FormularioGrupo/FormularioGrupo'
import '../../../../assets/styles/global.css'
import MensajeCarga from '../../../../components/sica/MensajeCarga/MensajeCarga'
import { useEffect, useState } from 'react'

// Página del SICA para editar grupos
export default function EditarGrupo() {
    const [materias, setMaterias] = useState([])
    const navigate = useNavigate() // Para redireccionar a los usuarios
    const token = localStorage.getItem('token') // Token de inicio de sesión
    const location = useLocation() // Para obtener los datos del grupo a editar
    const grupo = location.state?.grupo // Grupo a editar
    
    if (!grupo) { // Si no se recibe un grupo se redirige a la vista de grupos        
        navigate('/SICA/administradores/ver-grupos')
        return null
    }

    useEffect(() => { // Se obtienen las materias
        const fetchMaterias = async () => {
            try {
                const res = await fetch(`http://localhost:3000/api/materias`, {
                headers: { Authorization: `Bearer ${token}` },
                })
                const data = await res.json()
                if (res.ok){
                    setMaterias(data.materias.map(m => m.nombre))
                } else {
                    const errorData = await res.json().catch(() => null)
                    console.error(`Error ${res.status}`, errorData)
                    alert(errorData?.message || 'Ocurrió un error al obtener las materias')
                    return
                }
            } catch (error){
                console.log('Error en fetch:', error)
                alert('No se pudo conectar con el servidor.')
                setMaterias([]);
            }
        }
    fetchMaterias()
    }, [])

    // Método para editar el grupo con los nuevos datos
    const guardarCambios = (nuevoNombre, nuevoSemestre, nuevasMaterias) => {
        if(!nuevoNombre.trim() || !nuevoSemestre.trim() || nuevasMaterias.length === 0){ // Se deben rellenar el formulario
            alert('Debes ingresar un nombre de grupo, un semestre y al menos una materia')
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
                semestre: nuevoSemestre,
                materias: nuevasMaterias
            })
        }).then(async res => {
            if(res.ok){
                alert('Grupo actualizado correctamente')
                navigate('/SICA/administradores/ver-grupos')
            } else {
                const errorData = await res.json().catch(() => null)
                console.error(`Error ${res.status}`, errorData)
                 alert(errorData?.message || 'Ocurrió un error al actualizar el grupo')
            }
        })
    }

    // Método para cancelar los cambios del grupo
    const cancelar = () => {
        navigate('/SICA/administradores/ver-grupos')
    }

    if(!grupo){ // Mientras no se carguen los datos del grupo se muestra un mensaje de carga
        return(
            <MensajeCarga/>
        )
    }

    return (
        <div className="contenedor-principal">
            <MenuLateral />
            <FormularioGrupo
                tituloFormulario="Editar Grupo"
                guardar={guardarCambios}
                cancelar={cancelar}
                nombre={grupo.nombre}
                semestre={grupo.semestre}
                materias={grupo.materias.map(m => m.nombre)}
                materiasGlobales={materias}
            />
        </div>
    )
}