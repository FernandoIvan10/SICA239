import {jwtDecode} from 'jwt-decode'
import MenuLateral from '../../../../components/sica/MenuLateral/MenuLateral'
import { useEffect, useState } from 'react'
import { useValidarToken } from '../../../../hooks/useValidarToken/useValidarToken'
import { useValidarRol } from '../../../../hooks/useValidarRol/useValidarRol'
import { useNavigate } from 'react-router-dom'
import '../../../../assets/styles/global.css'
import './AgregarUsuario.css'
import MensajeCarga from '../../../../components/sica/MensajeCarga/MensajeCarga'

// Página del SICA para agregar usuarios 
export default function AgregarUsuario(){
    useValidarToken() // El usuario debe haber iniciado sesión
    useValidarRol(['superadmin','editor']) // El usuario debe tener permiso para acceder a esta ruta

    const navigate = useNavigate() // Para redirigir al usuario
    const token = localStorage.getItem('token') // Token de inicio de sesión
    const [rol, setRol] = useState('') // Tipo de usuario
    const [tipoUsuario, setTipoUsuario] = useState('alumno') // Pestaña activa del formulario
    const [grupos, setGrupos] = useState([]) // Grupos de la BD

    // Hooks para el formulario de administradores
    const [RFC, setRFC] = useState('')
    const [nombreAdmin, setNombreAdmin] = useState('')
    const [apellidoAdmin, setApellidoAdmin] = useState('')
    const [rolAdmin, setRolAdmin] = useState('lector')

    // Hooks para el formulario de alumnos
    const [matricula, setMatricula] = useState('')
    const [nombreAlumno, setNombreAlumno] = useState('')
    const [apellidoAlumno, setApellidoAlumno] = useState('')
    const [grupo, setGrupo] = useState('')
    const [materiasRecursadas, setMateriasRecursadas] = useState([])
    const [materiaSeleccionada, setMateriaSeleccionada] = useState('')

    useEffect(() => { // Se obtiene el tipo de usuario del token de inicio de sesión
        try{
            const tokenDecodificado = jwtDecode(token)
            setRol(tokenDecodificado.rol)
        }catch(error){
            console.log(error)
            localStorage.removeItem('token')
            navigate('/SICA/iniciar-sesion')
        }
    })

    useEffect(() => { // Se obtienen los grupos de la BD para mostrarlos en el formulario
        fetch('http://localhost:3000/api/grupos', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(async res => {
            const data = await res.json()
            if (!res.ok) {
                alert(data.mensaje || 'Error al obtener grupos')
                setGrupos([])
                return
            }
            return data
        })
        .then(data => {
            setGrupos(data.grupos)
        })
        .catch(err => {
            console.error('Error al obtener grupos:', err)
            alert('No se pudo conectar con el servidor')
            setGrupos([])
        })
    }, [])

    // Función para guardar el nuevo administrador en la BD
    const agregarAdmin = () => {
        fetch('http://localhost:3000/api/admins', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
        	rfc: RFC,
		    nombre: nombreAdmin,
            apellido: apellidoAdmin,
            contrasena: RFC, //La contraseña por default es el RFC
            rol: rolAdmin
	    })
        }).then(async res => {
            if(res.ok){
                alert('Administrador agregado exitosamente')
                // Se limpian los campos del formulario
                setRFC('')
                setNombreAdmin('')
                setApellidoAdmin('')
                setRolAdmin('lector')
                return
            }else{
                const errorData = await res.json().catch(() => null)
                console.error(`Error ${res.status}`, errorData)
                alert(errorData?.mensaje || 'Ocurrió un error al guardar el administrador')
                return
            }
        })
    }

    // Función para guardar el nuevo alumno en la BD
    const agregarAlumno = () => {
        fetch('http://localhost:3000/api/alumnos', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
        	matricula: matricula,
		    nombre: nombreAlumno,
            apellido: apellidoAlumno,
            contrasena: matricula, //La contraseña por default es la matrícula
            grupoNombre: grupo,
            materiasRecursadas
        })
        }).then(async res => {
            if(res.ok){
                alert('Alumno agregado exitosamente')
                // Se limpian los campos del formulario
                setMatricula('')
                setNombreAlumno('')
                setApellidoAlumno('')
                setGrupo('')
                setMateriasRecursadas([])
                setMateriaSeleccionada('')
                return
            }else{
                const errorData = await res.json().catch(() => null)
                console.error(`Error ${res.status}`, errorData)
                alert(errorData?.mensaje || 'Ocurrió un error al guardar el alumno.')
                return
            }
        })
    }

    // Método para regresar a la lista de usuarios
    const cancelar = () => {
        navigate('/SICA/administradores/ver-usuarios')
    }

    // Los campos se cambian dependiendo de la pestaña seleccionada (alumno o administrador)
    const renderFormulario = () => {
        if (tipoUsuario === 'alumno') {
            return (
                <form className="formulario-agregar-usuario">
                    <h2>Agregar Alumno</h2>
                    <div className="formulario-agregar-usuario-campo">
                        <label className="formulario-agregar-usuario-label">Matrícula*:</label>
                        <input
                            className="formulario-agregar-usuario-input" 
                            type="text" 
                            placeholder="Ingrese la matrícula" 
                            value={matricula}
                            onChange={(e) => setMatricula(e.target.value)}
                            required 
                        />
                    </div>
                    <div className="formulario-agregar-usuario-campo">
                        <label className="formulario-agregar-usuario-label">Nombre*:</label>
                        <input 
                            className="formulario-agregar-usuario-input"
                            type="text" 
                            placeholder="Ingrese el nombre" 
                            value={nombreAlumno}
                            onChange={(e) => setNombreAlumno(e.target.value)}
                            required 
                        />
                    </div>
                    <div className="formulario-agregar-usuario-campo">
                        <label className="formulario-agregar-usuario-label">Apellido*:</label>
                        <input
                            className="formulario-agregar-usuario-input" 
                            type="text" 
                            placeholder="Ingrese el apellido" 
                            value={apellidoAlumno}
                            onChange={(e) => setApellidoAlumno(e.target.value)}
                            required 
                        />
                    </div>
                    <div className="formulario-agregar-usuario-campo">
                        <label className="formulario-agregar-usuario-label">Grupo*:</label>
                        <select
                            className="formulario-agregar-usuario-select"
                            type="text" 
                            placeholder="Ingrese el ID del grupo" 
                            value={grupo}
                            onChange={(e) => setGrupo(e.target.value)}
                            required 
                        >
                            <option value="">Seleccionar grupo</option>
                                {grupos.map(grupo => (
                                    <option key={grupo.id} value={grupo.nombre}>
                                        {grupo.nombre}
                                    </option>
                                ))}
                        </select>
                    </div>
                    <div className="formulario-agregar-usuario-campo-materias-recursadas">
                        <label className="formulario-agregar-usuario-label">Materias recursadas:</label>
                        <div className="formulario-agregar-usuario-materias-recursadas">
                            {materiasRecursadas.map((item, index) => {
                                const grupoObj = grupos.find(g => g._id === item.grupo)
                                const materiaObj = grupoObj?.materias.find(m => m._id === item.materia)
                                return (
                                    <div key={index} className="formulario-agregar-usuario-materia-recursada">
                                        {materiaObj?.nombre || "Materia desconocida"} - {grupoObj?.nombre || "Grupo desconocido"}
                                        <button onClick={() => {
                                            const nuevas = [...materiasRecursadas]
                                            nuevas.splice(index, 1)
                                            setMateriasRecursadas(nuevas)
                                        }}>X</button>
                                    </div>
                                )
                            })}
                        </div>
                        <select
                            className="formulario-agregar-usuario-select"
                            value={materiaSeleccionada}
                            onChange={(e) => setMateriaSeleccionada(e.target.value)}
                        >
                            <option value="">Seleccionar materia</option>
                            {grupos.map(grupo => (
                                grupo.materias.map(materia => (
                                    <option
                                        key={`${materia._id}-${grupo._id}`}
                                        value={`${materia._id}-${grupo._id}`}
                                    >
                                        {materia.nombre} - {grupo.nombre}
                                    </option>
                                ))
                            ))}
                        </select>
                        </div>
                        <div className="formulario-agregar-usuario-contenedor-boton-agregar">
                            <button
                                type="button"
                                className="formulario-agregar-usuario-boton-agregar"
                                onClick={() => {
                                    if (materiaSeleccionada) {
                                        const [materia, grupo] = materiaSeleccionada.split("-")
                                        const yaAgregada = materiasRecursadas.some(mr =>
                                            mr.materia === materia && mr.grupo === grupo
                                        )
                                        if (!yaAgregada) {
                                            setMateriasRecursadas([...materiasRecursadas, { materia, grupo }])
                                            setMateriaSeleccionada("")
                                        }
                                    }
                                }}
                            >
                                Agregar
                            </button>
                        </div>
                    <div className="formulario-agregar-usuario-botones">
                        <button 
                            type="button" 
                            className="boton-guardar"
                            onClick={agregarAlumno}
                        >
                            Guardar
                        </button>
                        <button
                            type="button"
                            className="boton-cancelar"
                            onClick={cancelar}
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            )
        } else if (tipoUsuario === 'administrador') {
            return (
                <form className="formulario-agregar-usuario">
                    <h2>Agregar Administrador</h2>
                    <div className="formulario-agregar-usuario-campo">
                        <label className="formulario-agregar-usuario-label">RFC*:</label>
                        <input
                            className="formulario-agregar-usuario-input" 
                            type="text" 
                            placeholder="Ingrese el RFC" 
                            value={RFC}
                            onChange={(e) => setRFC(e.target.value)}
                            required
                        />
                    </div>
                    <div className="formulario-agregar-usuario-campo">
                        <label className="formulario-agregar-usuario-label">Nombre*:</label>
                        <input
                            className="formulario-agregar-usuario-input"
                            type="text" 
                            placeholder="Ingrese el nombre" 
                            value={nombreAdmin}
                            onChange={(e) => setNombreAdmin(e.target.value)}
                            required 
                        />
                    </div>
                    <div className="formulario-agregar-usuario-campo">
                        <label className="formulario-agregar-usuario-label">Apellido*:</label>
                        <input
                            className="formulario-agregar-usuario-input"
                            type="text" 
                            placeholder="Ingrese el apellido" 
                            value={apellidoAdmin}
                            onChange={(e) => setApellidoAdmin(e.target.value)}
                            required 
                        />
                    </div>
                    <div className="formulario-agregar-usuario-campo">
                        <label className="formulario-agregar-usuario-label">Rol*:</label>
                        <select 
                            className="formulario-agregar-usuario-select"
                            value={rolAdmin} 
                            onChange={(e)=>setRolAdmin(e.target.value)} 
                            required
                        >
                            <option value="superadmin">Superadmin</option>
                            <option value="editor">Editor</option>
                            <option value="lector">Lector</option>
                        </select>
                    </div>
                    <div className="formulario-agregar-usuario-botones">
                        <button 
                            type="button" 
                            className="boton-guardar"
                            onClick={agregarAdmin}
                        >
                            Guardar
                        </button>
                        <button
                            type="button"
                            className="boton-cancelar"
                            onClick={cancelar}
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            )
        }
    }

    if(grupos.length === 0){ // Mientras no haya grupos cargados se muestra un mensaje de carga
        return(
            <MensajeCarga/>
        )
    }
    return(
        <div className="contenedor-principal">
            <MenuLateral/>
            <div className="contenido-principal">
                <h1>Agregar Usuario</h1>
                <div className="selector-tipo">
                    <button
                        className={`btn-selector ${tipoUsuario === "alumno" ? "activo" : ""}`}
                        onClick={() => setTipoUsuario("alumno")}
                    >
                        Alumno
                    </button>
                    <button
                        className={`btn-selector ${tipoUsuario === "administrador" ? "activo" : ""}`}
                        onClick={() => setTipoUsuario("administrador")}
                        disabled={rol === "editor"} // Los 'editores' no pueden agregar administradores
                        style={rol === "editor" ? { opacity: 0.5, cursor: "not-allowed" } : {}}
                    >
                        Administrador
                    </button>
                </div>
                {/* Renderiza el formulario según la pestaña activa */}
                {renderFormulario()}
            </div>
        </div>
    )
}