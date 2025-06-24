import {BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom"
import Inicio from "../pages/SitioWeb/Inicio/Inicio"
import InicioAdmin from "../pages/SICA/Administradores/Inicio/Inicio"
import InicioAlumno from "../pages/SICA/Alumnos/Inicio/Inicio"
import SubirCalificaciones from "../pages/SICA/Administradores/SubirCalificaciones/SubirCalificaciones"
import Login from "../pages/SitioWeb/Login/Login"
import AgregarUsuario from "../pages/SICA/Administradores/AgregarUsuario/AgregarUsuario"
import EnCurso from "../pages/SICA/Alumnos/EnCurso/EnCurso"
import Historial from "../pages/SICA/Alumnos/Historial/Historial"
import Horario from "../pages/SICA/Alumnos/Horario/Horario"
import CambiarContraseña from "../pages/SICA/Alumnos/CambiarContraseña/CambiarContraseña"
import AgregarGrupo from "../pages/SICA/Administradores/AgregarGrupo/AgregarGrupo"
import VerUsuarios from "../pages/SICA/Administradores/VerUsuarios/VerUsuarios"
import VerGrupos from "../pages/SICA/Administradores/VerGrupos/VerGrupos"
import SubirHorarios from "../pages/SICA/Administradores/GestionarHorarios/GestionarHorarios"
import EditarGrupo from "../pages/SICA/Administradores/EditarGrupo/EditarGrupo"
import EditarAlumno from "../pages/SICA/Administradores/EditarAlumno/EditarAlumno"
import EditarAdministrador from "../pages/SICA/Administradores/EditarAdministrador/EditarAdministrador"
import CerrarSemestre from "../pages/SICA/Administradores/CerrarSemestre/CerrarSemestre"

// Clase que maneja las rutas (URL) de la App
export default function AppRoutes(){
    return(
        // Ruta con su página asociada
        <Router>
            <Routes>
                <Route path="*" element={<Navigate to="/inicio" />} /> {/* Ruta por defecto */}
                <Route path="/inicio" element={<Inicio/>}/>
                <Route path="/SICA/iniciar-sesion" element={<Login/>}/>
                <Route path="/SICA/administradores/inicio" element={<InicioAdmin/>}/>
                <Route path="/SICA/alumnos/inicio" element={<InicioAlumno/>}/>
                <Route path="/SICA/administradores/subir-calificaciones" element={<SubirCalificaciones/>}/>
                <Route path="/SICA/administradores/agregar-usuario" element={<AgregarUsuario/>}/>
                <Route path="/SICA/administradores/ver-usuarios" element={<VerUsuarios/>}/>
                <Route path="/SICA/administradores/agregar-grupo" element={<AgregarGrupo/>}/>
                <Route path="/SICA/administradores/ver-grupos" element={<VerGrupos/>}/>
                <Route path="/SICA/alumnos/en-curso" element={<EnCurso/>}/>
                <Route path="/SICA/alumnos/historial" element={<Historial/>}/>
                <Route path="/SICA/alumnos/horario" element={<Horario/>}/>
                <Route path="/SICA/alumnos/cambiar-contraseña" element={<CambiarContraseña/>}/>
                <Route path="/SICA/administradores/subir-horarios" element={<SubirHorarios/>}/>
                <Route path="/SICA/administradores/editar-grupo" element={<EditarGrupo/>}/>
                <Route path="/SICA/administradores/editar-alumno/:id" element={<EditarAlumno/>}/>
                <Route path="/SICA/administradores/editar-administrador/:id" element={<EditarAdministrador/>}/>
                <Route path="/SICA/administradores/cerrar-semestre" element={<CerrarSemestre/>}/>
            </Routes>
        </Router>
    )
}