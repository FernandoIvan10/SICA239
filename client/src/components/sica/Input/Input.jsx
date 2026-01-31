import '../../../assets/styles/global.css'

// Componente que renderiza un campo básico de entrada de datos
export default function Input({
    className,
    label,
    type,
    placeholder,
    value,
    onChange,
    required,
    disabled
}) {
    return(
        <div className={className}>
            <label>{label}</label>
            <input 
                type={type} 
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                disabled={disabled || false}
                required={required || false}/>
        </div>
    )
}