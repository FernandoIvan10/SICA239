import './MensajeEstado.css'

// Componente que renderiza mensajes de estado (error o éxito)
export default function MensajeEstado({
    error,
    exito
}){
    return (
        <div className = "seccion-mensajes-estado">
            {error && <p className="error">{error}</p>}
            {exito && <p className="exito">{exito}</p>}
        </div>
    )
}