import '../../../assets/styles/global.css'
import './MensajeCarga.css'
import MenuLateral from '../MenuLateral/MenuLateral'

// Componente que renderiza un mensaje de carga
export default function MensajeCarga(){
    return (
        <div className="contenedor-principal">
            <MenuLateral/>
            <p className='mensaje-carga'>Cargando datos...</p>
        </div>
    )
}