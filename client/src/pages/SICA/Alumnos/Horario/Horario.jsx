import MenuLateral from "../../../../components/sica/MenuLateral/MenuLateral"
import { useValidarToken } from "../../../../hooks/useValidarToken/useValidarToken"
import { useValidarRol } from "../../../../hooks/useValidarRol/useValidarRol"
import './Horario.css'
import { jwtDecode } from "jwt-decode"
import { useEffect } from "react"
import { useState } from "react"

// Página de inicio del SICA para alumnos
export default function Horario(){
    useValidarToken() // El usuario debe haber iniciado sesión
    useValidarRol(['alumno']) // El usuario debe tener permiso para acceder a esta ruta

    const token = localStorage.getItem("token") // Token de inicio de sesión
    const tokenDecodificado = jwtDecode(token) // Datos del token
    const [horarios, setHorarios] = useState([]) // Horarios del alumno 

    useEffect(() => { // Se obtienen los horarios del alumno
        try{
            fetch(`/api/horarios/${tokenDecodificado.id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            }).then(async res => {
                const data = await res.json()
                if(res.ok){
                    setHorarios(data)
                }else{
                    alert(data.mensaje || "Error al obtener los horarios")
                }
            })
        }catch{
            console.error("Error al obtener los horarios:", error)
            alert("No se pudo obtener el horario.")
        }
    }, [])

    return(
        <div className="contenedor-inicio">
            <MenuLateral/>
            <div className="contenido-principal">
                {horarios.map((h, i) => (
                    <div key={i}>
                        <img src={h.imagenUrl} alt={`Horario ${h.grupo}`}/>
                        <label className="horario-nombre">Horario - {h.grupo}</label>
                    </div>
                ))}
            </div>
        </div>
    )
}