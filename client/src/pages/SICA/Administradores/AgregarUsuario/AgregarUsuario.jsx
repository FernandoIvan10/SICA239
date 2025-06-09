import {jwtDecode} from "jwt-decode"
import MenuLateral from "../../../../components/sica/MenuLateral/MenuLateral";
import "./AgregarUsuario.css"
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useValidarToken } from "../../../../hooks/useValidarToken/useValidarToken";

import { FaHouseChimney } from "react-icons/fa6";
import { FaFileUpload, FaUsers, FaUserEdit, FaLayerGroup } from "react-icons/fa";
import { TiUserAdd } from "react-icons/ti";
import { IoLogOut } from "react-icons/io5";
import { MdGroupAdd, MdGroups } from "react-icons/md";
import { RiCalendarScheduleFill } from "react-icons/ri";

// Página del SICA para agregar usuarios 
export default function AgregarUsuario(){
    const navigate = useNavigate() // Para redireccionar a los usuarios
    const [menu, setMenu] = useState([]) // Elementos del menú
    const [rolUsuario, setRolUsuario] = useState(null)
    const [tipoUsuario, setTipoUsuario] = useState("alumno"); // Estado para el tipo de usuario
    const [grupos, setGrupos] = useState([]) // Lista de grupos en la BD

    // Hooks para el formulario de administradores
    const [RFC, setRFC] = useState("")
    const [nombreAdmin, setNombreAdmin] = useState("")
    const [apellidoAdmin, setApellidoAdmin] = useState("")
    const [rolAdmin, setRolAdmin] = useState("lector")

    // Hooks para el formulario de alumnos
    const [matricula, setMatricula] = useState("")
    const [nombreAlumno, setNombreAlumno] = useState("")
    const [apellidoAlumno, setApellidoAlumno] = useState("")
    const [grupo, setGrupo] = useState("")

    useValidarToken() // Se valida que el usuario haya iniciado sesión

    useEffect(() => {
        const token = localStorage.getItem('token') // Token de inicio de sesión        
            try{
                const tokenDecodificado = jwtDecode(token) // Se decodifica el token
                setRolUsuario(tokenDecodificado.rol)

                if(tokenDecodificado.rol === 'alumno'){
                        // Si el usuario es un alumno se redirige a su panel
                        navigate('/SICA/alumnos/inicio')
                }

                if(tokenDecodificado.rol === 'superadmin'){
                    // Si el usuario es superadmin
                    // Se asigna el siguiente menú
                    setMenu([ 
                        {titulo: "Inicio", icono:FaHouseChimney, link:'/SICA/administradores/inicio'},
                        {titulo: "Subir calificaciones", icono:FaFileUpload, link:'/SICA/administradores/subir-calificaciones'},
                        {titulo: "Gestionar usuarios", icono:FaUsers, 
                            subelementos:[
                                {titulo:"Agregar usuario", icono:TiUserAdd, link:'/SICA/administradores/agregar-usuario'},
                                {titulo:"Ver usuarios", icono:FaUserEdit, link:'/SICA/administradores/ver-usuarios'},
                            ]},
                        {titulo: "Gestionar grupos", icono:FaLayerGroup, 
                            subelementos:[
                                {titulo:"Agregar grupo", icono:MdGroupAdd, link:'/SICA/administradores/agregar-grupo'},
                                {titulo:"Ver grupos", icono:MdGroups, link:'/SICA/administradores/ver-grupos'},
                            ]},
                        {titulo: "Subir horarios", icono:RiCalendarScheduleFill, link:'/SICA/administradores/subir-horarios'},
                        {titulo: "Cerrar sesión", icono:IoLogOut, link:'/inicio'},
                    ])
                }else if(tokenDecodificado.rol==='editor'){
                    // Si el usuario es editor
                    // Se asigna el siguiente menú
                    setMenu([ 
                        {titulo: "Inicio", icono:FaHouseChimney, link:'/SICA/administradores/inicio'},
                        {titulo: "Subir calificaciones", icono:FaFileUpload, link:'/SICA/administradores/subir-calificaciones'},
                        {titulo: "Gestionar usuarios", icono:FaUsers, 
                            subelementos:[
                                {titulo:"Agregar usuario", icono:TiUserAdd, link:'/SICA/administradores/agregar-usuario'},
                                {titulo:"Ver usuarios", icono:FaUserEdit, link:'/SICA/administradores/ver-usuarios'},
                            ]},
                        {titulo: "Gestionar grupos", icono:FaLayerGroup, 
                            subelementos:[
                                {titulo:"Agregar grupo", icono:MdGroupAdd, link:'/SICA/administradores/agregar-grupo'},
                                {titulo:"Ver grupos", icono:MdGroups, link:'/SICA/administradores/ver-grupos'},
                            ]},
                        {titulo: "Cerrar sesión", icono:IoLogOut, link:'/inicio'},
                    ])
                } else if(tokenDecodificado.rol==='lector'){
                    // Si el usuario es lector se redirige a la lista de usuarios
                    navigate('/SICA/administradores/ver-usuarios')
                }

            }catch(error){
                // Si hay algún error se redirige al usuario al inicio de sesión
                navigate('/SICA/iniciar-sesion')
            }
    }, [navigate])

    useEffect(() => { // Se obtienen los grupos de la BD para mostrarlos en el formulario
        const token = localStorage.getItem('token')
        fetch('http://localhost:3000/api/grupos', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(res => res.json())
        .then(data => {
            setGrupos(data.grupos)
        })
        .catch(err => {
            console.error("Error al obtener grupos:", err)
            setGrupos([])
        })
    }, [])

    // Función para guardar el nuevo administrador en la BD
    const agregarAdmin = () => {
        if(!RFC.trim() || !nombreAdmin.trim() || !apellidoAdmin.trim() || !rolAdmin.trim()){
            // No se puede guardar el administrador si no se ha llenado todo el formulario
            alert("Debes ingresar todos los datos del formulario")
        }else{
            const token = localStorage.getItem('token') // Token de inicio de sesión
            
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
                    alert("Administrador agregado exitosamente")
                    // Se limpian los campos del formulario
                    setRFC("")
                    setNombreAdmin("")
                    setApellidoAdmin("")
                    setRolAdmin("lector")
                    return
                }else{
                    console.error(`Error ${res.status}`, await res.json().catch(()=>null))
                    alert("Ocurrió un error al guardar el administrador")
                    return
                }
            })
        }
    }

    // Función para guardar el nuevo alumno en la BD
    const agregarAlumno = () => {
        if(!matricula.trim() || !nombreAlumno.trim() || !apellidoAlumno.trim() || !grupo.trim()){
            // No se puede guardar el alumno si no se ha llenado todo el formulario
            alert("Debes ingresar todos los datos del formulario")
        }else{
            const token = localStorage.getItem('token') // Token de inicio de sesión
            
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
                grupoNombre: grupo
	        })
            }).then(async res => {
                if(res.ok){
                    alert("Alumno agregado exitosamente")
                    // Se limpian los campos del formulario
                    setMatricula("")
                    setNombreAlumno("")
                    setApellidoAlumno("")
                    setGrupo("")
                    return
                }else{
                    console.error(`Error ${res.status}`, await res.json().catch(()=>null))
                    alert("Ocurrió un error al guardar el alumno")
                    return
                }
            })
        }
    }

    // Formularios específicos para cada tipo de usuario
    const renderFormulario = () => {
        if (tipoUsuario === "alumno") {
            return (
                <form className="formulario-agregar">
                    <h2>Agregar Alumno</h2>
                    <label>
                        Matrícula:
                        <input 
                            type="text" 
                            placeholder="Ingrese la matrícula" 
                            value={matricula}
                            onChange={(e) => setMatricula(e.target.value)}
                            required 
                        />
                    </label>
                    <label>
                        Nombre:
                        <input 
                            type="text" 
                            placeholder="Ingrese el nombre" 
                            value={nombreAlumno}
                            onChange={(e) => setNombreAlumno(e.target.value)}
                            required 
                        />
                    </label>
                    <label>
                        Apellido:
                        <input 
                            type="text" 
                            placeholder="Ingrese el apellido" 
                            value={apellidoAlumno}
                            onChange={(e) => setApellidoAlumno(e.target.value)}
                            required 
                        />
                    </label>
                    <label>
                        Grupo:
                        <select
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
                    </label>
                    <button 
                        type="button" 
                        className="btn-guardar"
                        onClick={agregarAlumno}
                    >
                        Guardar Alumno
                    </button>
                </form>
            )
        } else if (tipoUsuario === "administrador") {
            return (
                <form className="formulario-agregar">
                    <h2>Agregar Administrador</h2>
                    <label>
                        RFC:
                        <input 
                            type="text" 
                            placeholder="Ingrese el RFC" 
                            value={RFC}
                            onChange={(e) => setRFC(e.target.value)}
                            required
                        />
                    </label>
                    <label>
                        Nombre:
                        <input 
                            type="text" 
                            placeholder="Ingrese el nombre" 
                            value={nombreAdmin}
                            onChange={(e) => setNombreAdmin(e.target.value)}
                            required 
                        />
                    </label>
                    <label>
                        Apellido:
                        <input 
                            type="text" 
                            placeholder="Ingrese el apellido" 
                            value={apellidoAdmin}
                            onChange={(e) => setApellidoAdmin(e.target.value)}
                            required 
                        />
                    </label>
                    <label>
                        Rol:
                        <select value={rolAdmin} onChange={(e)=>setRolAdmin(e.target.value)} required>
                            <option value="superadmin">Superadmin</option>
                            <option value="editor">Editor</option>
                            <option value="lector">Lector</option>
                        </select>
                    </label>
                    <button 
                        type="button" 
                        className="btn-guardar"
                        onClick={agregarAdmin}
                    >
                        Guardar Administrador
                    </button>
                </form>
            )
        }
    }

    return(
        <div className="contenedor-inicio">
            <MenuLateral elementos={menu}/>
            <div className="contenido-principal">
                <h1>Agregar Usuario</h1>
                {/* Selector del tipo de usuario */}
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
                        disabled={rolUsuario === "editor"} // No puede agregar administradores si es editor
                        style={rolUsuario === "editor" ? { opacity: 0.5, cursor: "not-allowed" } : {}}
                    >
                        Administrador
                    </button>
                </div>
                {/* Renderiza el formulario según el tipo de usuario */}
                {renderFormulario()}
            </div>
        </div>
    )
}