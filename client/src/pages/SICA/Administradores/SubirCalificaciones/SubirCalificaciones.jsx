import MenuLateral from "../../../../components/sica/MenuLateral/MenuLateral";
import { FaHouseChimney } from "react-icons/fa6";
import { FaFileUpload, FaUsers, FaUserEdit, FaLayerGroup } from "react-icons/fa";
import { TiUserAdd } from "react-icons/ti";
import { IoLogOut } from "react-icons/io5";
import { useState } from "react";
import "./SubirCalificaciones.css"

// Página del SICA para subir calificaciones
export default function SubirCalificaciones(){
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

    // Datos simulados
    const [grupos, setGrupos] = useState(["Grupo 1", "Grupo 2"]);
    const [parciales, setParciales] = useState(["Parcial 1", "Parcial 2", "Parcial 3"]);
    const [alumnos, setAlumnos] = useState([
        { id: 1, nombre: "Juan Pérez", grupo: "Grupo 1" },
        { id: 2, nombre: "María López", grupo: "Grupo 2" },
    ]);

    const [calificaciones, setCalificaciones] = useState({});

    const handleCalificacionChange = (alumnoId, materia, calificacion) => {
        setCalificaciones(prevState => ({
            ...prevState,
            [alumnoId]: {
                ...prevState[alumnoId],
                [materia]: calificacion
            }
        }));
    };

    return(
        <div className="contenedor-inicio">
            <MenuLateral elementos={elementos}/>
            <div className="contenido-principal">
                <h1>Subir Calificaciones</h1>

                {/* Selectores para Grupo y Parcial */}
                <div className="selectores">
                    <select className="select-grupo">
                        {grupos.map((grupo, index) => (
                            <option key={index} value={grupo}>{grupo}</option>
                        ))}
                    </select>
                    <select className="select-parcial">
                        {parciales.map((parcial, index) => (
                            <option key={index} value={parcial}>{parcial}</option>
                        ))}
                    </select>
                </div>

                {/* Tabla de calificaciones */}
                <table className="tabla-calificaciones">
                    <thead>
                        <tr>
                            <th>Alumno</th>
                            {grupos.length > 0 && grupos[0] && ["Matemáticas", "Ciencias", "Historia"].map((materia, index) => (
                                <th key={index}>{materia}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {alumnos.map((alumno, index) => (
                            <tr key={alumno.id}>
                                <td>{alumno.nombre}</td>
                                {["Matemáticas", "Ciencias", "Historia"].map((materia, index) => (
                                    <td key={index}>
                                        <input 
                                            type="number" 
                                            value={calificaciones[alumno.id]?.[materia] || ''} 
                                            onChange={(e) => handleCalificacionChange(alumno.id, materia, e.target.value)} 
                                            min="0" 
                                            max="10" 
                                        />
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Botón para guardar calificaciones */}
                <button className="btn-guardar">Guardar Calificaciones</button>
            </div>
        </div>
    )
}