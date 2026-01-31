import '../../../assets/styles/global.css'

// Componente que renderiza una lista desplegable
export default function Select({
    className,
    label,
    value,
    onChange,
    options,
    required
}){
    return(
        <div className={className}>
            <label>{label}</label>
            <select 
                value={value}
                onChange={onChange}
                required={required || false}
            >
                {options.map((option) => (
                    <option value={option.value ?? option}>
                        {option.label ?? option}
                    </option>
                ))}
            </select>
        </div>
    )
}