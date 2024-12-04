import Inicio from "../pages/Inicio/Inicio"
import {BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom"
import Login from "../pages/Login/Login"

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
            </Routes>
        </Router>
    )
}