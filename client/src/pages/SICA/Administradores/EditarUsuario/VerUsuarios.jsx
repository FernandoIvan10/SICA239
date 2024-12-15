import MenuLateral from "../../../../components/sica/MenuLateral/MenuLateral";
import { FaHouseChimney } from "react-icons/fa6";
import { FaFileUpload, FaUsers, FaUserEdit, FaLayerGroup } from "react-icons/fa";
import { TiUserAdd } from "react-icons/ti";
import { IoLogOut } from "react-icons/io5";
import { MdEdit, MdDelete } from "react-icons/md";
import "./VerUsuarios.css"
import { useState } from "react";

// Página del sica para ver la lista de usuarios
export default function VerUsuarios(){
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

    // Simulación de usuarios
    const [usuarios, setUsuarios] = useState([
        { id: 1, tipo: "Alumno", matricula: "12345", nombre: "Juan", apellido: "Pérez", grupo: "Grupo 1" },
        { id: 2, tipo: "Administrador", rfc: "RFC123456", nombre: "María", apellido: "López", rol: "Superadmin" },
        { id: 3, tipo: "Alumno", matricula: "67890", nombre: "Pedro", apellido: "Gómez", grupo: "Grupo 2" },
    ]);


    return(
        <div className="contenedor-inicio">
            <MenuLateral elementos={elementos}/>
            <div className="contenido-principal">
                <h1>Lista de Usuarios</h1>
                <table className="tabla-usuarios">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Tipo</th>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Apellido</th>
                            <th>Grupo/Rol</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usuarios.map((usuario, index) => (
                            <tr key={usuario.id}>
                                <td>{index + 1}</td>
                                <td>{usuario.tipo}</td>
                                <td>{usuario.tipo === "Alumno" ? usuario.matricula : usuario.rfc}</td>
                                <td>{usuario.nombre}</td>
                                <td>{usuario.apellido}</td>
                                <td>{usuario.tipo === "Alumno" ? usuario.grupo : usuario.rol}</td>
                                <td>
                                    <MdEdit className="btn-editar"/>
                                    <MdDelete className="btn-eliminar"/>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}