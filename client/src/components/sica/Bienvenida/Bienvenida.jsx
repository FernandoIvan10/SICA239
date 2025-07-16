import { Link } from 'react-router-dom'
import '../../../assets/styles/global.css'
import './Bienvenida.css'

// Componente que renderiza el mensaje de bienvenida al SICA
export default function Bienvenida(props){
    return(
    <div className="contenido-principal">
        <h2 className="titulo-bienvenida">¡Bienvenido, {props.nombre}!</h2>
        <p className="mensaje-bienvenida">{props.descripcion}</p>
        <div className="contenedor-botones-bienvenida">
            <Link 
                to={props.linkBoton1} 
                className="boton-bienvenida">
                    {props.textoBoton1}
            </Link>
            <Link 
                to={props.linkBoton2} 
                className="boton-bienvenida">
                    {props.textoBoton2}
            </Link>
        </div>
    </div>
    )
}