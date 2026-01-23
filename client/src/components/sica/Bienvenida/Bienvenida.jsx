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
                <h2 className="bienvenida__titulo">¡Bienvenido, {nombre && {nombre}}!</h2>
            {mensaje &&
                <p className="bienvenida__mensaje">{mensaje}</p>
            }
            <div className="bienvenida__seccion-botones">
                {link1 && boton1 &&
                    <Link 
                        to={link1} 
                        className="bienvenida__boton"
                    >
                        {boton1}
                    </Link>
                }
                {link2 && boton2 &&
                    <Link 
                        to={link2} 
                        className="bienvenida__boton"
                    >
                        {boton2}
                    </Link>
                }
            </div>
        </div>
    )
}