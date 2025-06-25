import {BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom"
import RutaProtegida from "./RutaProtegida"
import Inicio from "../pages/SitioWeb/Inicio/Inicio"
import InicioAdmin from "../pages/SICA/Administradores/Inicio/Inicio"
import InicioAlumno from "../pages/SICA/Alumnos/Inicio/Inicio"
import SubirCalificaciones from "../pages/SICA/Administradores/SubirCalificaciones/SubirCalificaciones"
import Login from "../pages/SitioWeb/Login/Login"
import AgregarUsuario from "../pages/SICA/Administradores/AgregarUsuario/AgregarUsuario"
import EnCurso from "../pages/SICA/Alumnos/EnCurso/EnCurso"
import Historial from "../pages/SICA/Alumnos/Historial/Historial"
import Horario from "../pages/SICA/Alumnos/Horario/Horario"
import AgregarGrupo from "../pages/SICA/Administradores/AgregarGrupo/AgregarGrupo"
import VerUsuarios from "../pages/SICA/Administradores/VerUsuarios/VerUsuarios"
import VerGrupos from "../pages/SICA/Administradores/VerGrupos/VerGrupos"
import SubirHorarios from "../pages/SICA/Administradores/GestionarHorarios/GestionarHorarios"
import EditarGrupo from "../pages/SICA/Administradores/EditarGrupo/EditarGrupo"
import EditarAlumno from "../pages/SICA/Administradores/EditarAlumno/EditarAlumno"
import EditarAdministrador from "../pages/SICA/Administradores/EditarAdministrador/EditarAdministrador"
import CerrarSemestre from "../pages/SICA/Administradores/CerrarSemestre/CerrarSemestre"
import MigrarAlumnos from "../pages/SICA/Administradores/MigrarAlumnos/MigrarAlumnos"
import PrimerCambioContrasena from "../pages/SICA/Administradores/CambiarContrasenaPrimeraVez/CambiarContrasenaPrimeraVez"
import CambiarContrasena from "../pages/SICA/Administradores/CambiarContrasena/CambiarContrasena"

// Clase que maneja las rutas (URL) de la App
export default function AppRoutes(){
    return(
        // Ruta con su página asociada
        <Router>
            <Routes>
                <Route path="*" element={<Navigate to="/inicio" />} /> {/* Ruta por defecto */}
                <Route path="/inicio" element={<Inicio/>}/>
                <Route path="/SICA/iniciar-sesion" element={<Login/>}/>
                
                <Route path="/SICA/alumnos/*" element={<RutaProtegida />}>
                    <Route path="inicio" element={<InicioAlumno/>}/>
                    <Route path="en-curso" element={<EnCurso/>}/>
                    <Route path="historial" element={<Historial/>}/>
                    <Route path="horario" element={<Horario/>}/>
                </Route>

                <Route path="/SICA/administradores/*" element={<RutaProtegida />}>
                    <Route path="inicio" element={<InicioAdmin/>}/>
                    <Route path="subir-calificaciones" element={<SubirCalificaciones/>}/>
                    <Route path="agregar-usuario" element={<AgregarUsuario/>}/>
                    <Route path="ver-usuarios" element={<VerUsuarios/>}/>
                    <Route path="agregar-grupo" element={<AgregarGrupo/>}/>
                    <Route path="ver-grupos" element={<VerGrupos/>}/>
                    <Route path="subir-horarios" element={<SubirHorarios/>}/>
                    <Route path="editar-grupo" element={<EditarGrupo/>}/>
                    <Route path="editar-alumno/:id" element={<EditarAlumno/>}/>
                    <Route path="editar-administrador/:id" element={<EditarAdministrador/>}/>
                    <Route path="cerrar-semestre" element={<CerrarSemestre/>}/>
                    <Route path="migrar-alumnos" element={<MigrarAlumnos/>}/>
                </Route>
                
                <Route path="/SICA/primer-cambio-contrasena" element={<PrimerCambioContrasena/>}/>
                <Route path="/SICA/cambiar-contrasena" element={<CambiarContrasena/>}/>
            </Routes>
        </Router>
    )
}