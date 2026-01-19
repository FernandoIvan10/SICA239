import '../../../assets/styles/global.css'

// Componente que renderiza una lista desplegableS
export default function Select({
    className,
    texto,
    value,
    onChange,
    options,
}){
    return(
        <div className={className}>
            <label>{texto}</label>
            <select 
                value={value}
                onChange={onChange}
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