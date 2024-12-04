import './Bienvenida.css'

// Componente que renderiza el mensaje de bienvenida al SICA
export default function Bienvenida(props){
    return(
    <div className="contenedor-bienvenida">
        <h2>¡Bienvenido, {props.nombre}!</h2>
        <p>{props.descripcion}</p>
        <div className="botones">
            <button>{props.boton1}</button>
            <button>{props.boton2}</button>
        </div>
    </div>
    )
}