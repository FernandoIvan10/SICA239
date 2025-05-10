import LogoCBTA from './../../../assets/img/logo_cbta239.png'
import { Link, useLocation } from 'react-router-dom'
import './MenuLateral.css'
import { useState } from 'react'

// Componente que renderiza el menú lateral del SICA
export default function MenuLateral({elementos}){
    const [menuAbierto, setMenuAbierto] = useState(false) // Estado del menú lateral (abierto o cerrado)

    // Métodos para cambiar el estado el menú lateral
    const abrirMenu = () => {
        setMenuAbierto(true)
    }
    const cerrarMenu = () => {
        setMenuAbierto(false)
    }

    const location = useLocation() // Obtenemos la ruta actual

    // Función para verificar si la ruta actual coincide con el link del ítem
    const isActive = (link) => {
        return location.pathname === link ? 'active' : ''
    }

    return(
        <>
            <button className={`menu-hamburguesa ${menuAbierto ? 'oculto' : ''}`} onClick={abrirMenu}>
                ☰
            </button>

            <div className={`contenedor-menu ${menuAbierto ? 'abierto' : ''}`}>
                <button className="cerrar-menu" onClick={cerrarMenu}>×</button>
                <div className="encabezado-menu">
                    <img src={LogoCBTA} alt='Logo'/>
                    <strong>SICA239</strong>
                </div>
                <div className="elementos-menu">
                    <ul>
                        {elementos.map((elemento, index)=>(
                            <li key={index} className={isActive(elemento.link)}>
                                <Link to={elemento.link}>
                                    <span>
                                        {elemento.icono && <elemento.icono className='icono'/>}
                                        {elemento.titulo}
                                    </span>
                                </Link>
                                {elemento.subelementos && (
                                    <ul>
                                        {elemento.subelementos.map((subelemento, subIndex)=>(
                                            <li key={subIndex} className={isActive(subelemento.link)}>
                                                <Link to={subelemento.link}>
                                                <span>
                                                    {subelemento.icono && <subelemento.icono className='icono'/>}
                                                    {subelemento.titulo}
                                                </span>
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </>
    )
}