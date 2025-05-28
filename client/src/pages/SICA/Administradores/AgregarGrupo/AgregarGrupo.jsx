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
import FormularioGrupo from "../../../../components/sica/FormularioGrupo/FormularioGrupo";

// Página del SICA para agregar grupos
export default function AgregarGrupo() {
    const navigate = useNavigate() // Para redireccionar a los usuarios
    const [menu, setMenu] = useState([]) // Elementos del menú
    const [resetForm, setResetForm] = useState(false) // Estado para reiniciar el formulario

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

    // Función para guardar el grupo y las materias en la BD
    const guardarGrupo = (nombreGrupo, materias) => {
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
                setResetForm(true);   // reinicia el formulario
                setTimeout(() => setResetForm(false), 0)
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
        setResetForm(true);   // reinicia el formulario
        setTimeout(() => setResetForm(false), 0)
    }

    return (
        <div className="contenedor-agregar-grupo">
            <MenuLateral elementos={menu}/>
            <FormularioGrupo
                tituloFormulario = "Agregar Nuevo Grupo"
                guardar = {guardarGrupo}
                cancelar = {cancelar}
                reset= {resetForm}
            />
        </div>
    )
}