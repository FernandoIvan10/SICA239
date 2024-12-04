import LogoCBTA from './../../../assets/img/logo_cbta239.png'
import {Link} from 'react-router-dom'
import './BarraNavegacion.css'

// Componente que renderiza la barra de navegación principal del sitio web
export default function BarraNavegacion(){
    return (
        <nav class="barra-navegacion">
            {/* Logo */}
            <img src={LogoCBTA} alt='Logo' className='img-barra-navegacion'/>
            {/* Elementos de navegación */}
            <ul className='ul-barra-navegacion'>
                <li className='li-barra-navegacion'><Link to='/inicio'>Inicio</Link></li>
                <li className='li-barra-navegacion'><Link to='/quienes-somos'>Quiénes somos</Link></li>
                <li className='li-barra-navegacion'><Link to='/oferta-educativa'>Oferta educativa</Link></li>
                <li className='li-barra-navegacion'><Link to='/contacto'>Contacto</Link></li>
                <li className='li-barra-navegacion'><Link to='/noticias'>Noticias</Link></li>
                <li className='li-barra-navegacion'>
                    <Link to='/SICA/iniciar-sesion'>
                        <button className='button-barra-navegacion'>Acceso</button>
                    </Link>
                </li>
            </ul>
        </nav>
    )
}