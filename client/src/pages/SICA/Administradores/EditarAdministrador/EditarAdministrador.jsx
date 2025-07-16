import MenuLateral from "../../../../components/sica/MenuLateral/MenuLateral"
import { useEffect, useState } from "react"
import { useValidarToken } from "../../../../hooks/useValidarToken/useValidarToken"
import { useNavigate, useParams } from "react-router-dom"
import { useValidarRol } from "../../../../hooks/useValidarRol/useValidarRol"
import "./EditarAdministrador.css"

// Página del SICA para editar usuarios administradores
export default function EditarAdministrador() {
    useValidarToken() // El usuario debe haber iniciado sesión
    useValidarRol(['superadmin']) // El usuario debe tener permiso para acceder a esta ruta

    const navigate = useNavigate() // Para redireccionar a los usuarios
    const token = localStorage.getItem('token') // Token de inicio de sesión
    const { id } = useParams() // ID enviado por parámetro
    const [admin, setAdmin] = useState(null) // Contiene todos los datos del formulario
    
    useEffect(() => { // Se obtienen los datos del administrador a editar
        fetch(`http://localhost:3000/api/admins/${id}`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        })
        .then(res => res.json())
        .then(data => {
            setAdmin({
                rfc: data.rfc,
                nombre: data.nombre,
                apellido: data.apellido,
                rol: data.rol
            })
        })
        .catch(err => {
            console.error("Error al obtener administrador:", err)
        })
    }, [id])

    // Método para editar el administrador con los nuevos datos
    const guardarCambios = () => {
        if(!admin.nombre.trim() || !admin.apellido.trim() || !admin.rol.trim()){ // Se deben rellenar todos los campos del formulario
            alert("Todos los campos son obligatorios")
            return
        }
        
        const {nombre, apellido, rol} = admin // Se obtienen los nuevos datos del formulario

        fetch(`http://localhost:3000/api/admins/${id}`, {
            method: "PUT",
            headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({nombre, apellido, rol})
        }).then(async res => {
            if(res.ok){
                alert("Administrador actualizado correctamente")
                navigate("/SICA/administradores/ver-usuarios")
            } else {
                console.error(await res.json().catch(()=>null))
                alert("Ocurrió un error al actualizar el admin")
            }
        })
    }

    // Método para regresar a la lista de usuarios
    const cancelar = () => {
        navigate('/SICA/administradores/ver-usuarios')
    }

    if (!admin) return <p>Cargando administrador...</p>
    return (
        <div className="contenedor-principal">
            <MenuLateral/>
            <div className="contenido-principal">
                <h1>Editar Administrador</h1>
                <form className="formulario-editar-admin">
                    <div className="formulario-editar-admin-campo">
                        <label className="formulario-editar-admin-label">RFC*:</label>
                        <input
                            className="formulario-editar-admin-input"
                            type="text"
                            value={admin.rfc}
                            readOnly
                        />
                    </div>
                    <div className="formulario-editar-admin-campo">
                        <label className="formulario-editar-admin-label">Nombre*:</label>
                        <input
                            className="formulario-editar-admin-input"
                            type="text"
                            value={admin.nombre}
                            onChange={(e) => setAdmin({ ...admin, nombre: e.target.value })}
                            required
                        />
                    </div>
                    <div className="formulario-editar-admin-campo">
                        <label className="formulario-editar-admin-label">Apellido*:</label>
                        <input
                            className="formulario-editar-admin-input"
                            type="text"
                            value={admin.apellido}
                            onChange={(e) => setAdmin({ ...admin, apellido: e.target.value })}
                            required
                        />
                    </div>
                    <div className="formulario-editar-admin-campo">
                    <label className="formulario-editar-admin-label">Rol*:</label>
                        <select
                            className="formulario-editar-admin-select"
                            value={admin.rol}
                            onChange={(e) => setAdmin({ ...admin, rol: e.target.value })}
                            required
                        >
                            <option value="superadmin">Superadmin</option>
                            <option value="editor">Editor</option>
                            <option value="lector">Lector</option>
                        </select>
                    </div>
                    <div className="formulario-editar-admin-botones">
                        <button type="button" className="boton-guardar" onClick={guardarCambios}>
                            Guardar
                        </button>
                        <button type="button" className="boton-cancelar" onClick={cancelar}>
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}