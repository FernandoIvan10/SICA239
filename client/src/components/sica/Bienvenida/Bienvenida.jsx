import { Link } from 'react-router-dom'
import '../../../assets/styles/global.css'
import './Bienvenida.css'

// Componente que renderiza el mensaje de bienvenida al SICA
export default function Bienvenida(props){
    return(
    <div className='contenedor-bienvenida'>
        <h2>¡Bienvenido, {props.nombre}!</h2>
        <p>{props.descripcion}</p>
        <div className="contenedor-botones">
            <Link 
                to={props.linkBoton1} 
                className='boton'>
                    {props.textoBoton1}
            </Link>
            <Link 
                to={props.linkBoton2} 
                className='boton'>
                    {props.textoBoton2}
            </Link>
        </div>
    </div>
    )
}