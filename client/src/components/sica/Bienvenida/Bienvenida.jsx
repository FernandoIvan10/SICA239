import { Link } from 'react-router-dom'
import '../../../assets/styles/global.css'
import './Bienvenida.css'

// Componente que renderiza el mensaje de bienvenida al SICA
export default function Bienvenida({
    className,
    nombre,
    mensaje,
    link1,
    link2,
    boton1,
    boton2
}){
    return(
        <div className={`contenido-principal ${className ?? ""}`}>
            <h2 className="bienvenida__titulo">¡Bienvenido, {nombre}!</h2>
            <p className="bienvenida__mensaje">{mensaje}</p>
            <div className="bienvenida__seccion-botones">
                <Link 
                    to={link1} 
                    className="bienvenida__boton">
                        {boton1}
                </Link>
                <Link 
                    to={link2} 
                    className="bienvenida__boton">
                        {boton2}
                </Link>
            </div>
        </div>
    )
}