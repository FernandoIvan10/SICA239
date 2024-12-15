import MenuLateral from "../../../../components/sica/MenuLateral/MenuLateral"
import { FaHouseChimney } from "react-icons/fa6";
import { FaFileUpload, FaUsers, FaUserEdit, FaLayerGroup } from "react-icons/fa";
import { TiUserAdd } from "react-icons/ti";
import { IoLogOut } from "react-icons/io5";
import { useState } from "react";
import "./AgregarGrupo.css"

// Página del SICA para agregar grupos
export default function AgregarGrupo() {
    const elementos=[ // Elementos del menú
                {titulo: "Inicio", icono:FaHouseChimney, link:'/SICA/administradores/inicio'},
                {titulo: "Subir calificaciones", icono:FaFileUpload, link:'/SICA/administradores/subir-calificaciones'},
                {titulo: "Gestionar usuarios", icono:FaUsers, 
                    subelementos:[
                        {titulo:"Agregar usuario", icono:TiUserAdd, link:'/SICA/administradores/agregar-usuario'},
                        {titulo:"Editar usuario", icono:FaUserEdit, link:'/SICA/administradores/editar-usuario'},
                    ]},
                {titulo: "Gestionar grupos", icono:FaLayerGroup, link:'/SICA/administradores/gestionar-grupos'},
                {titulo: "Cerrar sesión", icono:IoLogOut, link:'/inicio'},
            ]
    
    const [nombre, setNombre] = useState("");
    const [materias, setMaterias] = useState([]);
    const [nuevaMateria, setNuevaMateria] = useState("");

    // Función para agregar una materia a la lista
    const agregarMateria = () => {
        if (nuevaMateria.trim() && !materias.includes(nuevaMateria)) {
            setMaterias([...materias, nuevaMateria]);
            setNuevaMateria("");
        }
    };

    // Función para eliminar una materia de la lista
    const eliminarMateria = (materia) => {
        setMaterias(materias.filter((m) => m !== materia));
    };

    return (
        <>
        <MenuLateral elementos={elementos}/>
        <div className="contenedor-formulario">
            <h1>Agregar Nuevo Grupo</h1>
            <div className="formulario-grupo">
                <label>
                    Nombre del Grupo:
                    <input
                        type="text"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        placeholder="Escribe el nombre del grupo"
                    />
                </label>
                <label>
                    Materias:
                    <div className="materias-lista">
                        {materias.map((materia, index) => (
                            <div key={index} className="materia-item">
                                {materia}
                                <button onClick={() => eliminarMateria(materia)}>X</button>
                            </div>
                        ))}
                    </div>
                    <div className="agregar-materia">
                        <input
                            type="text"
                            value={nuevaMateria}
                            onChange={(e) => setNuevaMateria(e.target.value)}
                            placeholder="Nueva materia"
                        />
                        <button onClick={agregarMateria}>Agregar</button>
                    </div>
                </label>
                <div className="botones-formulario">
                    <button>Guardar Grupo</button>
                    <button>Cancelar</button>
                </div>
            </div>
        </div>
        </>
    );
}