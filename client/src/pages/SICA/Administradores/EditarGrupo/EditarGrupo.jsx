import MenuLateral from "../../../../components/sica/MenuLateral/MenuLateral"
import { useEffect, useState } from "react";
import "./EditarGrupo.css"
import { useValidarToken } from "../../../../hooks/useValidarToken/useValidarToken";
import { useNavigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

import { FaHouseChimney } from "react-icons/fa6";
import { FaFileUpload, FaUsers, FaUserEdit, FaLayerGroup } from "react-icons/fa";
import { TiUserAdd } from "react-icons/ti";
import { IoLogOut } from "react-icons/io5";
import { MdGroupAdd, MdGroups } from "react-icons/md";
import { RiCalendarScheduleFill } from "react-icons/ri";
import FormularioGrupo from "../../../../components/sica/FormularioGrupo/FormularioGrupo";

// Página del SICA para agregar grupos
export default function EditarGrupo() {
    const navigate = useNavigate() // Para redireccionar a los usuarios
    const location = useLocation() // Para obtener los datos del grupo a editar
    const grupo = location.state?.grupo // Grupo a editar
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

    if (!grupo) {
        // Si no se recibe grupo se redirige a la vista de grupos
        navigate("/SICA/administradores/ver-grupos")
        return null
    }

    const guardarCambios = (nuevoNombre, nuevasMaterias) => {
        if(!nuevoNombre.trim() || nuevasMaterias.length === 0){
            alert("Debes ingresar un nombre de grupo y al menos una materia")
            return
        }

        const token = localStorage.getItem('token')

        fetch(`http://localhost:3000/api/grupos/${grupo._id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                nombre: nuevoNombre,
                materias: nuevasMaterias
            })
        }).then(async res => {
            if(res.ok){
                alert("Grupo actualizado correctamente")
                navigate("/SICA/administradores/ver-grupos")
            } else {
                console.error(await res.json().catch(()=>null))
                alert("Ocurrió un error al actualizar el grupo")
            }
        })
    }

    const cancelar = () => {
        navigate("/SICA/administradores/ver-grupos")
    }

    return (
        <div className="contenedor-agregar-grupo">
            <MenuLateral elementos={menu} />
            <FormularioGrupo
                tituloFormulario="Editar Grupo"
                guardar={guardarCambios}
                cancelar={cancelar}
                nombre={grupo.nombre}
                materias={grupo.materias.map(m => m.nombre)}
            />
        </div>
    );
}