import {BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom"
import { RequiereRol } from "./RequiereRol"
import { RequiereAuth } from "./RequiereAuth"
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
import PrimerCambioContrasena from "../pages/SICA/Globales/CambiarContrasenaPrimeraVez/CambiarContrasenaPrimeraVez"
import CambiarContrasena from "../pages/SICA/Globales/CambiarContrasena/CambiarContrasena"

// Clase que maneja las rutas (URL) de la App
export default function AppRoutes(){
    return(
        // Ruta con su página asociada
        <Router>
            <Routes>
                {/* Ruta por defecto */}
                <Route path="*" element={<Navigate to="/inicio" />} />

                {/* Rutas públicas */}
                <Route path="/inicio" element={<Inicio/>}/>
                <Route path="/SICA/iniciar-sesion" element={<Login/>}/>
                
                {/* Rutas protegidas */}
                <Route element={<RequiereAuth/>}>
                    <Route path="/SICA/primer-cambio-contrasena" element={<PrimerCambioContrasena/>}/>
                    <Route path="/SICA/alumnos/cambiar-contrasena" element={<CambiarContrasena/>}/>
                    <Route path="/SICA/administradores/cambiar-contrasena" element={<CambiarContrasena/>}/>
                </Route>

                <Route path="/SICA/alumnos/*" element={<RequiereRol roles={['alumno']} />}>
                    <Route path="inicio" element={<InicioAlumno/>}/>
                    <Route path="en-curso" element={<EnCurso/>}/>
                    <Route path="historial" element={<Historial/>}/>
                    <Route path="horario" element={<Horario/>}/>
                </Route>

                <Route element={<RequiereRol roles={['superadmin']} />}>
                    <Route path="/SICA/administradores/cerrar-semestre" element={<CerrarSemestre/>}/>
                    <Route path="/SICA/administradores/editar-administrador/:id" element={<EditarAdministrador/>}/>
                </Route>

                <Route element={<RequiereRol roles={['superadmin', 'editor']} />}>
                    <Route path="/SICA/administradores/agregar-grupo" element={<AgregarGrupo/>}/>
                    <Route path="/SICA/administradores/agregar-usuario" element={<AgregarUsuario/>}/>
                    <Route path="/SICA/administradores/editar-alumno/:id" element={<EditarAlumno/>}/>
                    <Route path="/SICA/administradores/editar-grupo" element={<EditarGrupo/>}/>
                    <Route path="/SICA/administradores/migrar-alumnos" element={<MigrarAlumnos/>}/>
                </Route>

                <Route element={<RequiereRol roles={['superadmin', 'editor', 'lector']} />}>
                    <Route path="/SICA/administradores/gestionar-horarios" element={<SubirHorarios/>}/>
                    <Route path="/SICA/administradores/inicio" element={<InicioAdmin/>}/>
                    <Route path="/SICA/administradores/calificaciones" element={<SubirCalificaciones/>}/>
                    <Route path="/SICA/administradores/ver-grupos" element={<VerGrupos/>}/>
                    <Route path="/SICA/administradores/ver-usuarios" element={<VerUsuarios/>}/>
                </Route>
            </Routes>
        </Router>
    )
}