import '../../../assets/styles/global.css'
import './AccionesFormulario.css'

// Componente que renderiza las acciones del formulario (guardar y cancelar)
export default function AccionesFormulario({
    guardar,
    cancelar
}) {
    return (
        <div className="acciones-formulario">
            <button 
                className="acciones-formulario__boton acciones-formulario__boton--guardar"
                onClick={guardar}
            >
                Guardar
            </button>
            <button
                className="acciones-formulario__boton acciones-formulario__boton--cancelar"
                onClick={cancelar}
            >
                Cancelar
            </button>
        </div>
    )
}