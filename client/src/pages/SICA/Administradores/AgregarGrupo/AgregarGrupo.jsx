import MenuLateral from '../../../../components/sica/MenuLateral/MenuLateral'
import FormularioGrupo from '../../../../components/sica/FormularioGrupo/FormularioGrupo'
import { useEffect, useState } from 'react'
import { useValidarToken } from '../../../../hooks/useValidarToken/useValidarToken'
import { useValidarRol } from '../../../../hooks/useValidarRol/useValidarRol'
import { useNavigate } from 'react-router-dom'
import '../../../../assets/styles/global.css'

// Página del SICA para agregar grupos
export default function AgregarGrupo() {
    useValidarToken() // El usuario debe haber iniciado sesión
    useValidarRol(['superadmin','editor']) // El usuario debe tener permiso para acceder a esta ruta

    const navigate = useNavigate() // Para redirigir al usuario
    const [materias, setMaterias] = useState([])
    const token = localStorage.getItem('token') // Token de inicio de sesión

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

    // Función para guardar el grupo y las materias en la BD
    const guardarGrupo = (nombreGrupo, semestreGrupo, materiasGrupo) => {
    	const materiasFormateadas = materiasGrupo.map(nombre => ({ nombre })) //Formato correcto para la API
        fetch('http://localhost:3000/api/grupos', { // Guarda el grupo en la BD
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
        		nombre: nombreGrupo,
                semestre: semestreGrupo,
		        materias: materiasFormateadas
	        })
        }).then(async res => {
            if(res.ok){
                alert('Grupo guardado exitosamente.')
                return
            }else{
                const errorData = await res.json().catch(() => null)
                console.error(`Error ${res.status}`, errorData)
                alert(errorData?.message || 'Ocurrió un error al guardar el grupo.')
                return
            }
        })
    }

    // Método para cancelar la creación del nuevo grupo
    const cancelar = () => {
        navigate('/SICA/administradores/ver-grupos')
    }

    return (
        <div className="contenedor-principal">
            <MenuLateral/>
            <FormularioGrupo
                tituloFormulario = "Agregar Nuevo Grupo"
                guardar = {guardarGrupo}
                cancelar = {cancelar}
                materiasGlobales = {materias}
            />
        </div>
    )
}