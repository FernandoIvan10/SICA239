import MenuLateral from "../../../../components/sica/MenuLateral/MenuLateral"
import { useEffect, useState } from "react";
import "./AgregarGrupo.css"
import { useValidarToken } from "../../../../hooks/useValidarToken/useValidarToken";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

import { FaHouseChimney } from "react-icons/fa6";
import { FaFileUpload, FaUsers, FaUserEdit, FaLayerGroup } from "react-icons/fa";
import { TiUserAdd } from "react-icons/ti";
import { IoLogOut } from "react-icons/io5";
import { MdGroupAdd, MdGroups } from "react-icons/md";
import { RiCalendarScheduleFill } from "react-icons/ri";

// Página del SICA para agregar grupos
export default function AgregarGrupo() {
    const navigate = useNavigate() // Para redireccionar a los usuarios
    const [nombreGrupo, setNombreGrupo] = useState('') // Nombre del nuevo grupo
    const [materias, setMaterias] = useState([]) // Lista de materias del nuevo grupo
    const [nuevaMateria, setNuevaMateria] = useState('') // Nombre de la nueva materia
    const [menu, setMenu] = useState([]) // Elementos del menú

    useValidarToken() // Se válida que el usuario haya iniciado sesión

    useEffect(() => {
        const token = localStorage.getItem('token') // Token de inicio de sesión
        try{
            const tokenDecodificado = jwtDecode(token) // Se decodifica el token

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
        }else if(tokenDecodificado.rol === 'editor'){
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
        }else if(tokenDecodificado.rol === 'lector'){
            // Si el usuario es lector se redirige al panel para ver grupos
            navigate('/SICA/administradores/gestionar-grupos')
        }

        }catch(error){
            // Si hay algún error se redirige al usuario al inicio de sesión
            navigate('/SICA/iniciar-sesion')
        }
    }, [navigate])

    // Método para agregar una materia a la lista
    const agregarMateria = () => {
        if (nuevaMateria.trim() && !materias.includes(nuevaMateria)) {
            // Si la materia no está vacía y la materia no está en la lista
            setMaterias([...materias, nuevaMateria])
            setNuevaMateria("")

        }
    }

    // Método para eliminar una materia de la lista
    const eliminarMateria = (materia) => {
        setMaterias(materias.filter((m) => m !== materia))
    }

    // Función para guardar el grupo y las materias en la BD
    const guardarGrupo = () => {
        if(!nombreGrupo.trim() || materias.length === 0){
            // No se puede guardar el grupo sin un nombre de grupo y por lo menos una materia
            alert("Debes ingresar un nombre de grupo y al menos una materia")
        }else{

        const token = localStorage.getItem('token') //Token de inicio de sesión

    	const materiasFormateadas = materias.map(nombre => ({ nombre })) //Formato correcto para la API

        // Se envian los datos a la API para guardarlos en la BD
        fetch('http://localhost:3000/api/grupos', {
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
                alert("Grupo guardado exitosamente")
                setNombreGrupo("")
                setMaterias([])
                return
            }else{
                console.error(`Error ${res.status}`, await res.json().catch(()=>null))
                alert("Ocurrió un error al guardar el grupo")
                return
            }
        })
        }
    }

    // Método para cancelar la creación del nuevo grupo
    const cancelar = () => {
        navigate('/SICA/administradores/gestionar-grupos')
    }

    return (
        <div className="contenedor-agregar-grupo">
            <MenuLateral elementos={menu}/>
            <div className="contenedor-formulario">
                <h1>Agregar Nuevo Grupo</h1>
                <div className="formulario-grupo">
                    <label>
                        Nombre del Grupo:
                        <input
                            type="text"
                            value={nombreGrupo}
                            onChange={(e) => setNombreGrupo(e.target.value)}
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
                        <button onClick={guardarGrupo}>Guardar Grupo</button>
                        <button onClick={cancelar}>Cancelar</button>
                    </div>
                </div>
            </div>
        </div>
    )
}