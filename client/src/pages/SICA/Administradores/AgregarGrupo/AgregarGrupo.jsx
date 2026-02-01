import MenuLateral from '../../../../components/sica/MenuLateral/MenuLateral'
import FormularioGrupo from '../../../../components/sica/FormularioGrupo/FormularioGrupo'
import MensajeCarga from '../../../../components/sica/MensajeCarga/MensajeCarga'
import MensajeEstado from '../../../../components/sica/MensajeEstado/MensajeEstado'
import {guardarGrupo} from '../../../../api/grupos.api'
import {obtenerMaterias} from '../../../../api/materias.api'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../../auth/useAuth'
import '../../../../assets/styles/global.css'

// Página del SICA para agregar grupos
export default function AgregarGrupo() {
    const [materias, setMaterias] = useState(null)
    const [esperandoRespuesta, setEsperandoRespuesta] = useState(true)
    const [exito, setExito] = useState(null)
    const [error, setError] = useState(null)

    const {cargando} = useAuth() // Usuario autenticado
    const navigate = useNavigate() // Para redirigir al usuario
    
    // Método para obtener las materias de la BD
    const cargarMaterias = async () => {
        try{
            const respuesta = await obtenerMaterias()
            setMaterias(respuesta.materias.map(m => m.nombre))
        }catch(error){
            console.log('Error en fetch:', error)
            setError(error.message || 'No se pudo conectar con el servidor.')
            setMaterias([])
        }
    }

    // Función para guardar el grupo y las materias en la BD
    const agregarGrupo = async (nombreGrupo, semestreGrupo, materiasGrupo) => {
        try{
            setEsperandoRespuesta(true)
            setError(null)
            setExito(null)

            await guardarGrupo({
                nombre: nombreGrupo,
                semestre: semestreGrupo,
                materias: materiasGrupo.map(nombre => ({ nombre }))
            })
            setExito('Grupo guardado exitosamente.')
        }catch(error){
            console.error('Error al guardar el grupo:', error)
            setError(error.message || 'Ocurrió un error al guardar el grupo.')
        }finally{
            setEsperandoRespuesta(false)
        }
    }

    // Método para regresar a la vista de ver grupos
    const cancelar = () => {
        navigate('/SICA/administradores/ver-grupos')
    }

    useEffect(() => { // Se obtienen las materias
        cargarMaterias()
        setEsperandoRespuesta(false)
    }, [])

    if(cargando || materias === null){ // Si los datos están cargando se muestra un mensaje de carga
        return <MensajeCarga/>
    }

    return (
        <div className="contenedor-principal">
            <MenuLateral/>
            <div className="contenido-principal">
                <FormularioGrupo
                    tituloFormulario = "Agregar Nuevo Grupo"
                    guardar = {agregarGrupo}
                    cancelar = {cancelar}
                    materiasGlobales = {materias}
                    cargando={esperandoRespuesta}
                    exito={exito}
                />
                <MensajeEstado
                    exito={exito}
                    error={error}
                />
            </div>
        </div>
    )
}