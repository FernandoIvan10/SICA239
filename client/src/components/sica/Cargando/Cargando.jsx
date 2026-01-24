import '../../../assets/styles/global.css'
import './Cargando.css'

// Componente que renderiza un indicador de carga
export default function Cargando({mensaje = 'Cargando...'}) {
    return (
        <div className="contenedor-principal">
            <p className="cargando__mensaje">{mensaje}</p>
        </div>
    )
}