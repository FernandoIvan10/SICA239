import MenuLateral from '../../../../components/sica/MenuLateral/MenuLateral'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useValidarToken } from '../../../../hooks/useValidarToken/useValidarToken'
import { useValidarRol } from '../../../../hooks/useValidarRol/useValidarRol'
import { MdEdit, MdDelete } from 'react-icons/md'
import { jwtDecode } from 'jwt-decode'
import './VerGrupos.css'

// Página del sica para ver la lista de grupos
export default function VerGrupos(){
    useValidarToken() // El usuario debe haber iniciado sesión
    useValidarRol(['superadmin', 'editor', 'lector']) // El usuario debe tener permiso para acceder a esta ruta

    const navigate = useNavigate() // Para redireccionar a los usuarios
    const token = localStorage.getItem('token') // Token de inicio de sesión
    const tokenDecodificado = jwtDecode(token) // Datos del token
    const [grupos, setGrupos] = useState([]) // Grupos del sistema

    useEffect(() => { // Se obtienen los grupos del backend
        obtenerGrupos()
    }, [navigate])

    // Método para obtener los grupos del backend
    const obtenerGrupos = () => {
        try{
            fetch('http://localhost:3000/api/grupos',{
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }).then(async res => {
                const data = await res.json()

                if (!res.ok) {
                    console.error(`Error ${res.status}`, await res.json().catch(()=>null))
                    alert(data.mensaje || 'Ocurrió un error al obtener los grupos')
                    return
                }
                setGrupos(data.grupos)
            })
        }catch (err) {
            console.error('Error al obtener grupos:', err)
            alert('No se pudo conectar al servidor.')
        }
    }

    // Método para eliminar un grupo
    const eliminarGrupo = async (idGrupo) => {
        const confirmar = window.confirm('¿Estás seguro de que quieres eliminar este grupo? (Esta acción es irreversible)') // Se avierte al usuario que eliminar el grupo es irreversible
        if (!confirmar) return
        try {
            const respuesta = await fetch(`http://localhost:3000/api/grupos/${idGrupo}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })

            const data = await respuesta.json()
            if(!respuesta.ok){
                console.error(`Error ${respuesta.status}`, data)
                alert(data.mensaje || 'Ocurrió un error al eliminar el grupo.')
                return
            }
                alert('Grupo eliminado correctamente')
		        obtenerGrupos() // Se vuelve a cargar la lista de grupos
        } catch (error) {
            console.error('Error al eliminar el grupo:', error)
            alert('No se pudo conectar al servidor.')
        }
    }

    if(grupos.length === 0){ // Mientras no haya grupos cargados se muestra un mensaje de carga
            return(
                <>
                    <MenuLateral/>
                    <div className="contenido-principal">
                        <p>Cargando datos</p>
                    </div>
                </>
            )
        }
    return(
        <div className="contenedor-principal">
            <MenuLateral/>
            <div className="contenido-principal">
                <h1>{tokenDecodificado.rol !== "lector" ? "Gestionar Grupos" : "Lista de Grupos"}</h1>
                <table className="tabla-grupos">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Nombre del Grupo</th>
                            <th>Materias</th>
                            {tokenDecodificado.rol !== "lector" && <th>Acciones</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {grupos.map((grupo, index) => (
                            <tr key={grupo._id}>
                                <td>{index + 1}</td>
                                <td>{grupo.nombre}</td>
                                <td>{grupo.materias.map((materia) => materia.nombre).join(', ')}</td>
                                {tokenDecodificado.rol !== "lector" && 
                                    <td>
                                        <MdEdit 
                                            className="tabla-grupos-boton-editar"
                                            onClick={() => navigate("/SICA/administradores/editar-grupo", { state: { grupo } })}
                                        />
                                        <MdDelete 
                                            className="tabla-grupos-boton-eliminar"
                                            onClick={() => eliminarGrupo(grupo._id)}
                                        />
                                    </td>
                                }
                            </tr>
                        ))}
                    </tbody>
                </table>
                {tokenDecodificado.rol !== "lector" && 
                    <button
                        className="boton-guardar"
                        onClick={() => navigate("/SICA/administradores/agregar-grupo")}
                    >
                        Agregar Grupo
                    </button>
                }
            </div>
        </div>
    )
}