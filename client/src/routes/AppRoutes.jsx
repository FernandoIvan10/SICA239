import {BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom"
import Inicio from "../pages/SitioWeb/Inicio/Inicio"
import InicioAdmin from "../pages/SICA/Administradores/Inicio/Inicio"
import InicioAlumno from "../pages/SICA/Alumnos/Inicio/Inicio"
import Login from "../pages/SitioWeb/Login/Login"

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
            </Routes>
        </Router>
    )
}