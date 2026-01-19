import '../../../assets/styles/global.css'

// Componente que renderiza un campo básico de entrada de datos
export default function Input({
    className,
    texto,
    type,
    placeholder,
    value,
    onChange
}) {
    return(
        <div className={className}>
            <label>{texto}</label>
            <input 
                type={type} 
                placeholder={placeholder}
                value={value}
                onChange={onChange}/>
        </div>
    )
}