import '../../../assets/styles/global.css'

// Componente que renderiza un campo básico de entrada de datos
export default function Input(props){
    return(
        <div className={props.className}>
            <label className='input-label'>{props.texto}</label>
            <input 
                type={props.type} 
                placeholder={props.placeholder}
                value={props.value}
                onChange={props.onChange}/>
        </div>
    )
}