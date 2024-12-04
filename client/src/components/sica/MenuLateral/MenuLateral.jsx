import LogoCBTA from './../../../assets/img/logo_cbta239.png'
import { Link } from 'react-router-dom'
import './MenuLateral.css'

// Componente que renderiza el menú lateral del SICA
export default function MenuLateral({elementos}){
    return(
        <div className="contenedor-menu">
            <div className="encabezado-menu">
                <img src={LogoCBTA} alt='Logo'/>
                <strong>SICA239</strong>
            </div>
            <div className="elementos-menu">
                <ul>
                    {elementos.map((elemento, index)=>(
                        <li key={index}>
                            <Link to={elemento.link}>
                                <span>
                                    {elemento.icono && <elemento.icono className='icono'/>}
                                    {elemento.titulo}
                                </span>
                            </Link>
                            {elemento.subelementos && (
                                <ul>
                                    {elemento.subelementos.map((subelemento, subIndex)=>(
                                        <li key={subIndex}>
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
    )
}