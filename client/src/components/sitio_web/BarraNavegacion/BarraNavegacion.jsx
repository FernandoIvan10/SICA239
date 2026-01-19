import LogoCBTA from './../../../assets/img/logo_cbta239.png'
import {Link} from 'react-router-dom'
import './BarraNavegacion.css'
import { useState } from 'react'

// Componente que renderiza la barra de navegación principal del sitio web
export default function BarraNavegacion(){
    const [menuAbierto, setMenuAbierto] = useState(false) // Controla si el menú lateral está abierto o cerrado

    // Métodos para cambiar el estado del menú lateral
    const abrirMenu = () => {
        setMenuAbierto(true)
    }
    const cerrarMenu = () => {
	setMenuAbierto(false)
    }

    return (
        <nav className="barra-navegacion">
            <div className="barra-navegacion__contenido">
                <img src={LogoCBTA} alt="Logo" className="barra-navegacion__imagen"/>
                {/* Botón del menú hamburguesa para móviles */}
                <button className="barra-navegacion__icono-menu" onClick={abrirMenu}>
                        ☰
                    </button>
                <ul className={`barra-navegacion__elementos ${menuAbierto ? "activo" : ""}`}>
                    <li className="barra-navegacion__boton--cerrar" onClick={cerrarMenu}>✕</li>
                    <li className="barra-navegacion__elemento" onClick={cerrarMenu}><Link to="/inicio">Inicio</Link></li>
                    <li className="barra-navegacion__elemento" onClick={cerrarMenu}><Link to="/quienes-somos">Quiénes somos</Link></li>
                    <li className="barra-navegacion__elemento" onClick={cerrarMenu}><Link to="/oferta-educativa">Oferta educativa</Link></li>
                    <li className="barra-navegacion__elemento" onClick={cerrarMenu}><Link to="/contacto">Contacto</Link></li>
                    <li className="barra-navegacion__elemento" onClick={cerrarMenu}><Link to="/noticias">Noticias</Link></li>
                    <li className="barra-navegacion__elemento" onClick={cerrarMenu}>
                        <Link to="/SICA/iniciar-sesion">
                            <button className="barra-navegacion__boton--acceso">Acceso</button>
                        </Link>
                    </li>
                </ul>
            </div>
        </nav>
    )
}