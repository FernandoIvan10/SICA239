import MenuLateral from "../../../../components/sica/MenuLateral/MenuLateral";
import { FaHouseChimney } from "react-icons/fa6";
import { FaFileUpload, FaUsers, FaUserEdit, FaLayerGroup } from "react-icons/fa";
import { TiUserAdd } from "react-icons/ti";
import { IoLogOut } from "react-icons/io5";
import { MdEdit, MdDelete } from "react-icons/md";
import "./GestionarGrupos.css"
import { useState } from "react";

// Página del SICA para gestionar los grupos
export default function GestionarGrupos(){
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

    // Simulación de grupos
    const [grupos, setGrupos] = useState([
        { id: 1, nombre: "Grupo 1", materias: ["Matemáticas", "Ciencias"] },
        { id: 2, nombre: "Grupo 2", materias: ["Historia", "Geografía"] },
    ]);

    return(
        <div className="contenedor-gestionar-grupos">
            <MenuLateral elementos={elementos}/>
            <div className="contenido-principal">
                <h1>Gestionar Grupos</h1>
                {/* Tabla de grupos */}
                <table className="tabla-grupos">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Nombre del Grupo</th>
                            <th>Materias</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {grupos.map((grupo, index) => (
                            <tr key={grupo.id}>
                                <td>{index + 1}</td>
                                <td>{grupo.nombre}</td>
                                <td>{grupo.materias.join(", ")}</td>
                                <td>
                                    <MdEdit className="btn-editar"/>
                                    <MdDelete className="btn-eliminar"/>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {/* Botón para agregar un nuevo grupo */}
                <button
                    className="btn-agregar-grupo"
                >
                    Agregar Grupo
                </button>
            </div>
        </div>
    )
}