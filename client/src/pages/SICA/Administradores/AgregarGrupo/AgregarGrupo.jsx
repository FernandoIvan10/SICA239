import MenuLateral from '../../../../components/sica/MenuLateral/MenuLateral'
import FormularioGrupo from '../../../../components/sica/FormularioGrupo/FormularioGrupo'
import { useState } from 'react'
import { useValidarToken } from '../../../../hooks/useValidarToken/useValidarToken'
import { useValidarRol } from '../../../../hooks/useValidarRol/useValidarRol'
import { useNavigate } from 'react-router-dom'
import '../../../../assets/styles/global.css'

// Página del SICA para agregar grupos
export default function AgregarGrupo() {
    useValidarToken() // El usuario debe haber iniciado sesión
    useValidarRol(['superadmin','editor']) // El usuario debe tener permiso para acceder a esta ruta

    const navigate = useNavigate() // Para redirigir al usuario
    const [resetForm, setResetForm] = useState(false) // Para reiniciar el formulario
    const token = localStorage.getItem('token') // Token de inicio de sesión

    // Función para guardar el grupo y las materias en la BD
    const guardarGrupo = (nombreGrupo, materias) => {
        if(!nombreGrupo.trim() || materias.length === 0){
            // No se puede guardar el grupo sin un nombre de grupo y por lo menos una materia
            alert('Debes ingresar un nombre de grupo y al menos una materia')
        }else{ 
    	const materiasFormateadas = materias.map(nombre => ({ nombre })) //Formato correcto para la API
        fetch('http://localhost:3000/api/grupos', { // Guarda el grupo en la BD
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
        		nombre: nombreGrupo,
		        materias: materiasFormateadas
	        })
        }).then(async res => {
            if(res.ok){
                alert('Grupo guardado exitosamente')
                setResetForm(true) // Se limpia el formulario
                setTimeout(() => setResetForm(false), 0)
                return
            }else{
                console.error(`Error ${res.status}`, await res.json().catch(()=>null))
                alert('Ocurrió un error al guardar el grupo')
                return
            }
        })
        }
    }

    // Método para cancelar la creación del nuevo grupo
    const cancelar = () => {
        setResetForm(true)   // reinicia el formulario
        setTimeout(() => setResetForm(false), 0)
        navigate('/SICA/administradores/ver-grupos')
    }

    return (
        <div className="contenedor-principal">
            <MenuLateral/>
            <FormularioGrupo
                tituloFormulario = "Agregar Nuevo Grupo"
                guardar = {guardarGrupo}
                cancelar = {cancelar}
                reset= {resetForm}
            />
        </div>
    )
}