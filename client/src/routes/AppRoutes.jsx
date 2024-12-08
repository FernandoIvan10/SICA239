import {BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom"
import Inicio from "../pages/SitioWeb/Inicio/Inicio"
import InicioAdmin from "../pages/SICA/Administradores/Inicio/Inicio"
import InicioAlumno from "../pages/SICA/Alumnos/Inicio/Inicio"
import SubirCalificaciones from "../pages/SICA/Administradores/SubirCalificaciones/SubirCalificaciones"
import Login from "../pages/SitioWeb/Login/Login"
import AgregarUsuario from "../pages/SICA/Administradores/AgregarUsuario/AgregarUsuario"
import EditarUsuario from "../pages/SICA/Administradores/EditarUsuario/EditarUsuario"
import EnCurso from "../pages/SICA/Alumnos/EnCurso/EnCurso"
import Historial from "../pages/SICA/Alumnos/Historial/Historial"
import Horario from "../pages/SICA/Alumnos/Horario/Horario"
import CambiarContraseña from "../pages/SICA/Alumnos/CambiarContraseña/CambiarContraseña"

// Clase que maneja las rutas (URL) de la App
export default function AppRoutes(){
    return(
        // Ruta con su página asociada
        <Router>
            <Routes>
                {/* Ruta por defecto */}
                <Route path="*" element={<Navigate to="/inicio" />} />
                <Route path="/inicio" element={<Inicio/>}/>
                <Route path="/SICA/iniciar-sesion" element={<Login/>}/>
                <Route path="/SICA/administradores/inicio" element={<InicioAdmin/>}/>
                <Route path="/SICA/alumnos/inicio" element={<InicioAlumno/>}/>
                <Route path="/SICA/administradores/subir-calificaciones" element={<SubirCalificaciones/>}/>
                <Route path="/SICA/administradores/agregar-usuario" element={<AgregarUsuario/>}/>
                <Route path="/SICA/administradores/editar-usuario" element={<EditarUsuario/>}/>
                <Route path="/SICA/alumnos/en-curso" element={<EnCurso/>}/>
                <Route path="/SICA/alumnos/historial" element={<Historial/>}/>
                <Route path="/SICA/alumnos/horario" element={<Horario/>}/>
                <Route path="/SICA/alumnos/cambiar-contraseña" element={<CambiarContraseña/>}/>
            </Routes>
        </Router>
    )
}