import MenuLateral from '../../../../components/sica/MenuLateral/MenuLateral'
import MensajeCarga from '../../../../components/sica/MensajeCarga/MensajeCarga'
import FormularioAlumno from '../../../../components/sica/FormularioAlumno/FormularioAlumno'
import FormularioAdmin from '../../../../components/sica/FormularioAdmin/FormularioAdmin'
import MensajeEstado from '../../../../components/sica/MensajeEstado/MensajeEstado'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../../auth/useAuth'
import { obtenerGrupos } from '../../../../api/grupos.api'
import { guardarAlumno } from '../../../../api/alumnos.api'
import { guardarAdministrador } from '../../../../api/admins.api'
import { obtenerMaterias } from '../../../../api/materias.api'
import '../../../../assets/styles/global.css'
import './AgregarUsuario.css'

// Página del SICA para agregar usuarios 
export default function AgregarUsuario(){
    const [grupos, setGrupos] = useState([]) // Grupos de la BD
    const [materias, setMaterias] = useState([]) // Materias de la BD
    const [pestanaActiva, setPestanaActiva] = useState('alumno') // Pestaña activa del formulario
    const [esperandoRespuesta, setEsperandoRespuesta] = useState(true)
    const [error, setError] = useState(null)
    const [exito, setExito] = useState(null)
    
    const navigate = useNavigate()
    const {cargando, usuario} = useAuth()

    // Método para obtener los grupos de la BD
    const cargarGrupos = async () => {
        try {
            const respuesta = await obtenerGrupos()
            const listaGrupos = [...(respuesta?.grupos ?? [])]
                .sort((a, b) => a.nombre.localeCompare(b.nombre))

            setGrupos(listaGrupos)
        } catch (error) {
            console.error('Error al obtener grupos:', error)
            setError(error.message || 'Error al obtener grupos')
        }
    }

    // Método para obtener las materias de la BD
    const cargarMaterias = async () => {
        try{
            const respuesta = await obtenerMaterias()
            const listaMaterias = [...(respuesta?.materias ?? [])]
                .sort((a, b) => a.nombre.localeCompare(b.nombre))

            setMaterias(listaMaterias)
        } catch (error) {
            console.error('Error al obtener materias:', error)
            setError(error.message || 'Error al obtener materias')
        }
    }

    // Método para guardar el nuevo administrador en la BD
    const agregarAdmin = async (RFC, nombre, apellido, rol) => {
        setEsperandoRespuesta(true)
        setError(null)
        setExito(null)

        const datosAdmin = {
            rfc: RFC,
            nombre: nombre,
            apellido: apellido,
            contrasena: RFC, //La contraseña por default es el RFC
            rol: rol
        }

        try{
            await guardarAdministrador(datosAdmin)
            setExito('Administrador guardado exitosamente')
        }catch(error){
            console.error('Error al guardar el administrador:', error)
            setError(error.message || 'Ocurrió un error al guardar el administrador')
        }finally{
            setEsperandoRespuesta(false)
        }
    }

    // Método para guardar el nuevo alumno en la BD
    const agregarAlumno = async (matricula, nombre, apellido, grupo, materiasRecursadas) => {
        setEsperandoRespuesta(true)
        setError(null)
        setExito(null)

        const datosAlumno = {
            matricula: matricula,
            nombre: nombre,
            apellido: apellido,
            contrasena: matricula, //La contraseña por default es la matrícula
            grupoNombre: grupo,
            materiasRecursadas
        }

        try{
            await guardarAlumno(datosAlumno)
            setExito('Alumno guardado exitosamente')
        }catch(error){
            console.error('Error al guardar el alumno:', error)
            setError(error.message || 'Ocurrió un error al guardar el alumno')
        }finally{
            setEsperandoRespuesta(false)
        }
    }

    // Método para regresar a la lista de usuarios
    const cancelar = () => {
        navigate('/SICA/administradores/ver-usuarios')
    }

    // El formulario cambia dependiendo de la pestaña seleccionada
    const renderFormulario = () => {
        if (pestanaActiva === 'alumno') {
            return (
                <FormularioAlumno
                    grupos={grupos}
                    materias={materias}
                    titulo="Agregar Alumno"
                    onSubmit={agregarAlumno}
                    cancelar={cancelar}
                    cargando={esperandoRespuesta}
                    error={error}
                    exito={exito}
                />
            )
        } else if (pestanaActiva === 'administrador') {
            return (
                <FormularioAdmin
                    titulo="Agregar Administrador"
                    onSubmit={agregarAdmin}
                    cancelar={cancelar}
                    cargando={esperandoRespuesta}
                    error={error}
                    exito={exito}
                />
            )
        }
    }

    useEffect(() => { // Se necesitan los grupos y materias para asignarlos a los alumnos
        cargarGrupos()
        cargarMaterias()
        setEsperandoRespuesta(false)
    }, [])

    if(cargando || !usuario){ // Mientras no hay usuario se muestra un mensaje de carga
        return <MensajeCarga mensaje="Cargando usuario..."/>
    }
    
    if(grupos.length === 0){ // Mientras no haya grupos cargados se muestra un mensaje de carga
        return(
            <MensajeCarga mensaje="Cargando grupos..."/>
        )
    }

    return(
        <div className="contenedor-principal">
            <MenuLateral/>
            <div className="contenido-principal">
                <h1>Agregar Usuario</h1>
                <div className="agregar-usuario__seccion-selector">
                    <button
                        className={`agregar-usuario__boton-selector ${pestanaActiva === "alumno" ? "activo" : ""}`}
                        onClick={() => setPestanaActiva("alumno")}
                    >
                        Alumno
                    </button>
                    <button
                        className={`agregar-usuario__boton-selector ${pestanaActiva === "administrador" ? "activo" : ""}`}
                        onClick={() => setPestanaActiva("administrador")}
                        disabled={usuario.rol === "editor"} // Los 'editores' no pueden agregar administradores
                        style={usuario.rol === "editor" ? { opacity: 0.5, cursor: "not-allowed" } : {}}
                    >
                        Administrador
                    </button>
                </div>
                {/* Renderiza el formulario según la pestaña activa */}
                {renderFormulario()}
                <MensajeEstado
                    error={error}
                    exito={exito}
                />
            </div>
        </div>
    )
}