import { useEffect, useState } from 'react'
import '../../../assets/styles/global.css'
import './FormularioGrupo.css'
import Input from '../../sica/Input/Input'
import Select from '../../../components/sica/Select/Select'
import AccionesFormulario from '../AccionesFormulario/AccionesFormulario'

// Componente que renderiza el formulario para los grupos
export default function FormularioGrupo({
    materiasGlobales,
    nombre,
    semestre,
    materias,
    tituloFormulario,
    guardar,
    cancelar
}) {
    const [enfocado, setEnfocado] = useState(false) // Indica si el campo de nueva materia está enfocado
    const [sugerencias, setSugerencias] = useState([]) // Sugerencias de materias al escribir una nueva materia
    const [nuevaMateria, setNuevaMateria] = useState('') // Nueva materia a agregar al grupo
    const [nombreGrupo, setNombreGrupo] = useState(nombre || '')
    const [semestreGrupo, setSemestreGrupo] = useState(semestre || 'Semestre 1')
    const [materiasGrupo, setMateriasGrupo] = useState(materias || [])

    useEffect(() => { // Se muestran sugerencias al escribir una nueva materia
        if (!enfocado) return setSugerencias([]) // Si no está enfocado no se muestran sugerencias

        const nuevasSugerencias = materiasGlobales.filter(m => 
            m.toLowerCase().includes(nuevaMateria.toLowerCase()) && !materiasGrupo.includes(m)
        )
        setSugerencias(nuevasSugerencias)
    }, [nuevaMateria, enfocado])

    // Método para agregar una materia a la lista
    const agregarMateria = () => {
        if (
            nuevaMateria.trim()
            && !materiasGrupo.includes(nuevaMateria)
        ) { // No se agregan materias vacías o repetidas
            setMateriasGrupo([...materiasGrupo, nuevaMateria])
            setNuevaMateria('')
        }
    }

    // Método para eliminar una materia de la lista
    const eliminarMateria = (index) => {
        setMateriasGrupo((prev) => prev.filter((_, i) => i !== index))
    }

    return (
        <div className="contenido-principal">
            <h1 className="formulario-grupo__titulo">{tituloFormulario}</h1>
            <div className="formulario-grupo">
                <Input
                    className="formulario-grupo__campo"
                    label="Nombre del Grupo*:"
                    type="text"
                    placeholder="Escribe el nombre del grupo"
                    value={nombreGrupo}
                    onChange={(e) => setNombreGrupo(e.target.value)}
                />
                <Select
                    className="formulario-grupo__campo"
                    label="Semestre del Grupo*:"
                    value={semestreGrupo}
                    onChange={(e) => setSemestreGrupo(e.target.value)}
                    options={[
                        { value: "Semestre 1", label: "Semestre 1" },
                        { value: "Semestre 2", label: "Semestre 2" },
                        { value: "Semestre 3", label: "Semestre 3" },
                        { value: "Semestre 4", label: "Semestre 4" },
                        { value: "Semestre 5", label: "Semestre 5" },
                        { value: "Semestre 6", label: "Semestre 6" },
                    ]}
                />
                <label className="formulario-grupo__label">
                    Materias*:
                </label>
                    <div className="formulario-grupo__materias">
                        {materiasGrupo.map((materia, index) => (
                            <div key={index} className="formulario-grupo__materia">
                                {materia}
                                <button onClick={() => eliminarMateria(index)}>X</button>
                            </div>
                        ))}
                    </div>
                    <div className="formulario-grupo__agregar-materia">
                        <input
                            type="text"
                            value={nuevaMateria}
                            onChange={(e) => setNuevaMateria(e.target.value)}
                            placeholder="Nueva materia"
                            onFocus={() => setEnfocado(true)}
                            onBlur={() => setTimeout(() => setEnfocado(false), 150)}
                        />
                        <button onClick={agregarMateria}>Agregar</button>
                        {enfocado && sugerencias.length > 0 && (
                            <ul className="formulario-grupo__sugerencias-materias">
                                {sugerencias.map((s, index) => (
                                    <li
                                        key={index}
                                        onMouseDown={() => {
                                        setNuevaMateria(s);
                                        setEnfocado(false);
                                        }}
                                        className="formulario-grupo__sugerencia"
                                    >
                                        {s}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                <AccionesFormulario
                    guardar={() => guardar(nombreGrupo, semestreGrupo, materiasGrupo)}
                    cancelar={cancelar}
                />
            </div>
        </div>
    )
}