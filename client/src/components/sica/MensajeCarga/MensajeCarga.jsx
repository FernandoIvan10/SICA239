import '../../../assets/styles/global.css'
import './MensajeCarga.css'

// Componente que renderiza un mensaje de carga
export default function MensajeCarga(){
    return (
        <div className="contenedor-principal">
            <MenuLateral/>
            <p className='mensaje-carga'>Cargando datos...</p>
        </div>
    )
}