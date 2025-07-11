import LogoCBTA from './../../../assets/img/logo_cbta239.png'
import {Link} from 'react-router-dom'
import './BarraNavegacion.css'
import { useState } from 'react'

// Componente que renderiza la barra de navegación principal del sitio web
export default function BarraNavegacion(){
    const [menuAbierto, setMenuAbierto] = useState(false) // Estado del menú lateral (abierto o cerrado)

    // Métodos para cambiar el estado del menú lateral
    const abrirMenu = () => {
        setMenuAbierto(true)
    }
    const cerrarMenu = () => {
	setMenuAbierto(false)
    }

    return (
        <nav class='barra-navegacion'>
            {/* Logo */}
            <div className='barra-contenido'>
                <img src={LogoCBTA} alt='Logo' className='img-barra-navegacion'/>
                {/* Botón del menú hamburguesa para móviles */}
                <button className='menu-hamburguesa' onClick={abrirMenu}>
                        ☰
                    </button>
                {/* Elementos de navegación */}
                <ul className={`ul-barra-navegacion ${menuAbierto ? 'activo' : ''}`}>
		            {/* Ícono de cerrar sólo visible en móviles */}
                    <li className='cerrar-menu' onClick={cerrarMenu}>✕</li>
                    <li className='li-barra-navegacion' onClick={cerrarMenu}><Link to='/inicio'>Inicio</Link></li>
                    <li className='li-barra-navegacion' onClick={cerrarMenu}><Link to='/quienes-somos'>Quiénes somos</Link></li>
                    <li className='li-barra-navegacion' onClick={cerrarMenu}><Link to='/oferta-educativa'>Oferta educativa</Link></li>
                    <li className='li-barra-navegacion' onClick={cerrarMenu}><Link to='/contacto'>Contacto</Link></li>
                    <li className='li-barra-navegacion' onClick={cerrarMenu}><Link to='/noticias'>Noticias</Link></li>
                    <li className='li-barra-navegacion' onClick={cerrarMenu}>
                        <Link to='/SICA/iniciar-sesion'>
                            <button className='button-barra-navegacion'>Acceso</button>
                        </Link>
                    </li>
                </ul>
            </div>
        </nav>
    )
}