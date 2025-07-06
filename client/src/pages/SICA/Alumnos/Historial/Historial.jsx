import MenuLateral from "../../../../components/sica/MenuLateral/MenuLateral"
import { useValidarToken } from "../../../../hooks/useValidarToken/useValidarToken"
import { useValidarRol } from "../../../../hooks/useValidarRol/useValidarRol"
import './Historial.css'
import { useEffect } from "react"
import { jwtDecode } from "jwt-decode"
import { useState } from "react"

// Página de inicio del SICA para alumnos
export default function Historial(){
    useValidarToken() // El usuario debe haber iniciado sesión
    useValidarRol(['alumno']) // El usuario debe tener permiso para acceder a esta ruta

    const token = localStorage.getItem("token") // Token de inicio de sesión
    const tokenDecodificado = jwtDecode(token) // Datos del token
    const [historial, setHistorial] = useState([]) // Historial académico

    useEffect(() => { // Se obtiene el historial académico del alumno
        try{
            fetch(`/api/historial-academico/${tokenDecodificado.id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            }).then(async res => {
                const data = await res.json()
                if(res.ok){
                    setHistorial(data[0].calificaciones)
                }else{
                    alert(data.mensaje || "Error al obtener el historial académico")
                }
            })
        }catch{
            console.error("Error al obtener el historial académico:", error)
            alert("No se pudo obtener el historial académico.")
        }
    }, [])

    return(
        <div className="contenedor-inicio">
            <MenuLateral/>
            <div className="contenido-principal">
                <h1>Historial Academico</h1>
                <table className="tabla-calificaciones">
                    <thead>
                        <tr>
                            <th>Materia</th>
                            <th>Promedio</th>
                        </tr>
                    </thead>
                    <tbody>
                        {historial.map((cal, i) => (
                            <tr key={i}>
                                <td>{cal.materiaId?.nombre}</td>
                                <td>{cal.nota}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}