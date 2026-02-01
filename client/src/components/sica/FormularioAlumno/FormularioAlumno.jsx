import Input from '../Input/Input'
import Select from '../Select/Select'
import { useEffect, useState } from 'react'
import './FormularioAlumno.css'
import AccionesFormulario from '../AccionesFormulario/AccionesFormulario'

// Componente que renderiza el formulario para crear o editar un alumno
export default function FormularioAlumno({
    grupos,
    materias,
    matricula,
    nombre,
    apellido,
    grupo,
    materiasRecursadas,
    titulo,
    onSubmit,
    cancelar,
    cargando,
    exito,
    matriculaDisabled
}) {
    const [matriculaAlumno, setMatriculaAlumno] = useState(matricula || '')
    const [nombreAlumno, setNombreAlumno] = useState(nombre || '')
    const [apellidoAlumno, setApellidoAlumno] = useState(apellido || '')
    const [grupoAlumno, setGrupoAlumno] = useState(grupo || '')
    const [materiasRecursadasAlumno, setMateriasRecursadasAlumno] = useState(materiasRecursadas || [])
    const [materiaSeleccionada, setMateriaSeleccionada] = useState('')

    useEffect(() => { // Al agregar un alumno exitosamente, el formulario se limpia
        if(exito){
            setMatriculaAlumno('')
            setNombreAlumno('')
            setApellidoAlumno('')
            setGrupoAlumno('')
            setMateriasRecursadasAlumno([])
            setMateriaSeleccionada('')
        }
    }, [exito])

    return (
        <form
            className="formulario-alumno"
            onSubmit={(e) => {
                e.preventDefault();
                onSubmit(matriculaAlumno, nombreAlumno, apellidoAlumno, grupoAlumno, materiasRecursadasAlumno);
            }}
        >
            <h2>{titulo}</h2>
            <Input
                className="formulario-alumno__campo"
                label="Matrícula*:"
                type="text"
                placeholder="Ingrese la matrícula"
                value={matriculaAlumno}
                onChange={(e) => setMatriculaAlumno(e.target.value)}
                required={true}
                disabled={matriculaDisabled || false}
            />
            <Input
                className="formulario-alumno__campo"
                label="Nombre*:"
                type="text"
                placeholder="Ingrese el nombre"
                value={nombreAlumno}
                onChange={(e) => setNombreAlumno(e.target.value)}
                required={true}
            />
            <Input
                className="formulario-alumno__campo"
                label="Apellido*:"
                type="text"
                placeholder="Ingrese el apellido"
                value={apellidoAlumno}
                onChange={(e) => setApellidoAlumno(e.target.value)}
                required={true}
            />
            <Select
                className="formulario-alumno__campo"
                label="Grupo*:"
                options={[
                    {value: "", label: "Seleccionar grupo"},
                    ...grupos.map(
                        grupo => ({
                            value: grupo.nombre,
                            label: grupo.nombre
                        })
                    )
                ]}
                value={grupoAlumno}
                onChange={(e) => setGrupoAlumno(e.target.value)}
                required={true}
            />
            <div className="formulario-alumno__campo-materias-recursadas">
                <label>Materias recursadas:</label>
                <div className="formulario-alumno__materias-recursadas">
                    {materiasRecursadasAlumno.map((item, index) => {
                        const grupoObj = grupos.find(g => g._id === item.grupo)
                        const materiaObj = grupoObj?.materias.find(m => m._id === item.materia)
                        return (
                            <div key={index} className="formulario-alumno__materia-recursada">
                                {materiaObj?.nombre || "Materia desconocida"} - {grupoObj?.nombre || "Grupo desconocido"}
                                <button type="button" onClick={() => {
                                    const nuevas = [...materiasRecursadasAlumno]
                                    nuevas.splice(index, 1)
                                    setMateriasRecursadasAlumno(nuevas)
                                }}>
                                    X
                                </button>
                            </div>
                        )
                    })}
                </div>
                <Select
                    className="formulario-alumno__campo"
                    label="Agregar materia recursada:"
                    options={[
                        {value: "", label: "Seleccionar materia"},
                        ...materias.flatMap(materia => 
                            grupos.flatMap(grupo => 
                                grupo.materias.some(m => m._id === materia._id) ? [{
                                    value: `${materia._id}-${grupo._id}`,
                                    label: `${materia.nombre} - ${grupo.nombre}`
                                }] : []
                            )
                        )
                    ]}
                    value={materiaSeleccionada}
                    onChange={(e) => setMateriaSeleccionada(e.target.value)}
                />
                <div className="formulario-alumno__seccion-agregar-materia-recursada">
                    <button
                        type="button"
                        className="formulario-alumno__boton-agregar-materia-recursada"
                        onClick={() => {
                            if (materiaSeleccionada) {
                                const [materia, grupo] = materiaSeleccionada.split("-")
                                const yaAgregada = materiasRecursadasAlumno.some(mr =>
                                    mr.materia === materia && mr.grupo === grupo
                                )
                                if (!yaAgregada) {
                                    setMateriasRecursadasAlumno([...materiasRecursadasAlumno, { materia, grupo }])
                                    setMateriaSeleccionada("")
                                }
                            }
                        }}
                    >
                        Agregar materia
                    </button>
                </div>
            </div>
            <AccionesFormulario
                cancelar={cancelar}
                cargando={cargando}
            />
        </form>
    )
}