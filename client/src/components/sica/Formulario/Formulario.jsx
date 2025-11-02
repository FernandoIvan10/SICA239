import Input from '../../sitio_web/Input/Input'
import '../../../assets/styles/global.css'
import './Formulario.css'

// Componente que renderiza un formulario simple
export default function Formulario(props){
    return(
        <form 
            className="formulario"
            onSubmit={props.onSubmit}>
                {props.icono && <div className="formulario-icono">{props.icono}</div>}
            <div className="formulario-campos">
            {props.campos.map((campo, index)=>(
                    <Input
                        className = "formulario-campo"
                        texto = {campo.texto}
                        type = {campo.type}
                        placeholder = {campo.placeholder}
                        value = {campo.value}
                        onChange = {campo.onChange}
                    />
            ))}
            </div>
            <div className="fomulario-botones">
            {props.botones.map((boton, index)=>(
                    <button className="formulario-boton">{boton.texto}</button>
            ))}
            </div>
            {props.error && <p className="formulario-error">{props.error}</p>}
        </form>
    )
}