import '../../../assets/styles/global.css'
import './AccionesFormulario.css'

// Componente que renderiza las acciones del formulario (guardar y cancelar)
export default function AccionesFormulario({
    cancelar,
    cargando,
}) {
    return (
        <div className="acciones-formulario">
            <button 
                className="acciones-formulario__boton acciones-formulario__boton--guardar"
                type="submit"
                disabled={cargando || false}
            >
                Guardar
            </button>
            <button
                className="acciones-formulario__boton acciones-formulario__boton--cancelar"
                onClick={cancelar}
                disabled={cargando || false}
            >
                Cancelar
            </button>
        </div>
    )
}