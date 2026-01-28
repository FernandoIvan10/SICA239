import AccionesFormulario from '../AccionesFormulario/AccionesFormulario'
import Input from '../Input/Input'
import Select from '../Select/Select'
import { useEffect, useState } from 'react'
import './FormularioAdmin.css'

// Componente que renderiza el formulario para agregar o editar un administrador
export default function FormularioAdmin({
    titulo,
    RFC,
    nombre,
    apellido,
    rol,
    onSubmit,
    cancelar,
    cargando,
    exito
}){
    const [RFCAdmin, setRFCAdmin] = useState(RFC || '')
    const [nombreAdmin, setNombreAdmin] = useState(nombre || '')
    const [apellidoAdmin, setApellidoAdmin] = useState(apellido || '')
    const [rolAdmin, setRolAdmin] = useState(rol || 'lector')

    useEffect(() => { // Al agregar un administrador exitosamente, el formulario se limpia
        if(exito){
            setRFCAdmin('')
            setNombreAdmin('')
            setApellidoAdmin('')
            setRolAdmin('lector')
        }
    }, [exito])

    return (
        <form 
            className="formulario-admin"
            onSubmit={(e) => {
                e.preventDefault();
                onSubmit(RFCAdmin, nombreAdmin, apellidoAdmin, rolAdmin);
            }}
        >
            <h2>{titulo}</h2>
            <Input
                className="formulario-admin__campo"
                label="RFC*:"
                type="text"
                placeholder="Ingrese el RFC"
                value={RFCAdmin}
                onChange={(e) => setRFCAdmin(e.target.value)}
                required={true}
            />
            <Input
                className="formulario-admin__campo"
                label="Nombre*:"
                type="text" 
                placeholder="Ingrese el nombre" 
                value={nombreAdmin}
                onChange={(e) => setNombreAdmin(e.target.value)}
                required={true}
            />
            <Input
                className="formulario-admin__campo"
                label="Apellido*:"
                type="text"
                placeholder="Ingrese el apellido"
                value={apellidoAdmin}
                onChange={(e) => setApellidoAdmin(e.target.value)}
                required={true}
            />
            <Select
                className="formulario-admin__campo"
                label="Rol*:"
                value={rolAdmin}
                onChange={(e)=>setRolAdmin(e.target.value)}
                options={[
                    { value: 'superadmin', label: 'Superadmin' },
                    { value: 'editor', label: 'Editor' },
                    { value: 'lector', label: 'Lector' }
                ]}
                required={true}
            />
            <AccionesFormulario
                cancelar={cancelar}
                cargando={cargando}
            />
        </form>
    )
}