export default function Input(props){
    return(
        <div className={props.className}>
            <p>{props.texto}</p>
            <input type={props.type} placeholder={props.placeholder}/>
        </div>
    )
}