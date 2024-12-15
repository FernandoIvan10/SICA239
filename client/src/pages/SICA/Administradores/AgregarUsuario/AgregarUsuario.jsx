import MenuLateral from "../../../../components/sica/MenuLateral/MenuLateral";
import { FaHouseChimney } from "react-icons/fa6";
import { FaFileUpload, FaUsers, FaUserEdit, FaLayerGroup } from "react-icons/fa";
import { TiUserAdd } from "react-icons/ti";
import { IoLogOut } from "react-icons/io5";
import "./AgregarUsuario.css"
import { useState } from "react";

// Página del SICA para agregar usuarios 
export default function AgregarUsuario(){
    const elementos=[ // Elementos del menú
        {titulo: "Inicio", icono:FaHouseChimney, link:'/SICA/administradores/inicio'},
        {titulo: "Subir calificaciones", icono:FaFileUpload, link:'/SICA/administradores/subir-calificaciones'},
        {titulo: "Gestionar usuarios", icono:FaUsers, 
            subelementos:[
                {titulo:"Agregar usuario", icono:TiUserAdd, link:'/SICA/administradores/agregar-usuario'},
                {titulo:"Ver usuarios", icono:FaUserEdit, link:'/SICA/administradores/ver-usuarios'},
            ]},
        {titulo: "Gestionar grupos", icono:FaLayerGroup, link:'/SICA/administradores/gestionar-grupos'},
        {titulo: "Cerrar sesión", icono:IoLogOut, link:'/inicio'},
    ]

        const [tipoUsuario, setTipoUsuario] = useState("alumno"); // Estado para el tipo de usuario

        // Formularios específicos para cada tipo de usuario
    const renderFormulario = () => {
        if (tipoUsuario === "alumno") {
            return (
                <form className="formulario-agregar">
                    <h2>Agregar Alumno</h2>
                    <label>
                        Matrícula:
                        <input type="text" placeholder="Ingrese la matrícula" required />
                    </label>
                    <label>
                        Nombre:
                        <input type="text" placeholder="Ingrese el nombre" required />
                    </label>
                    <label>
                        Apellido:
                        <input type="text" placeholder="Ingrese el apellido" required />
                    </label>
                    <label>
                        Grupo:
                        <input type="text" placeholder="Ingrese el ID del grupo" required />
                    </label>
                    <button type="submit" className="btn-guardar">Guardar Alumno</button>
                </form>
            );
        } else if (tipoUsuario === "administrador") {
            return (
                <form className="formulario-agregar">
                    <h2>Agregar Administrador</h2>
                    <label>
                        RFC:
                        <input type="text" placeholder="Ingrese el RFC" required />
                    </label>
                    <label>
                        Nombre:
                        <input type="text" placeholder="Ingrese el nombre" required />
                    </label>
                    <label>
                        Apellido:
                        <input type="text" placeholder="Ingrese el apellido" required />
                    </label>
                    <label>
                        Contraseña:
                        <input type="password" placeholder="Ingrese la contraseña" required />
                    </label>
                    <label>
                        Rol:
                        <select required>
                            <option value="superadmin">Superadmin</option>
                            <option value="editor">Editor</option>
                            <option value="lector">Lector</option>
                        </select>
                    </label>
                    <button type="submit" className="btn-guardar">Guardar Administrador</button>
                </form>
            );
        }
    };

    return(
        <div className="contenedor-inicio">
            <MenuLateral elementos={elementos}/>
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