import Input from '../../sitio_web/Input/Input'
import '../../../assets/styles/global.css'
import './FormularioInicioSesion.css'

// Componente que renderiza el formulario para iniciar sesión
export default function FormularioInicioSesion({
    className,
    onSubmit,
    icono,
    campos,
    botones,
    error
}){
    return(
        <form 
            className={`formulario-iniciar-sesion ${className || ""}`}
            onSubmit={onSubmit}>
                {icono && <div className="formulario-iniciar-sesion_icono">{icono}</div>}
            <div className="formulario-iniciar-sesion_seccion-campos">
            {campos.map((campo)=>(
                    <Input
                        className = "formulario-iniciar-sesion_campo"
                        texto = {campo.texto}
                        type = {campo.type}
                        placeholder = {campo.placeholder}
                        value = {campo.value}
                        onChange = {campo.onChange}
                    />
            ))}
            </div>
            <div className="fomulario-iniciar-sesion_seccion-botones">
            {botones.map((boton)=>(
                    <button className="formulario-iniciar-sesion_boton">{boton.texto}</button>
            ))}
            </div>
            {error && <p className="error">{error}</p>}
        </form>
    )
}