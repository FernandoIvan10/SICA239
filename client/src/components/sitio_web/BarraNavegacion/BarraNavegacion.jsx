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
            <ul>
                <li><Link to='/inicio'>Inicio</Link></li>
                <li><Link to='/quienes-somos'>Quiénes somos</Link></li>
                <li><Link to='/oferta-educativa'>Oferta educativa</Link></li>
                <li><Link to='/contacto'>Contacto</Link></li>
                <li><Link to='/noticias'>Noticias</Link></li>
                <li>
                    <Link to='/login'>
                        <button>Acceso</button>
                    </Link>
                </li>
            </ul>
        </nav>
    )
}