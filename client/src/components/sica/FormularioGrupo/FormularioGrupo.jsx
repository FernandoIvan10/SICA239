import { useEffect, useState } from 'react'
import '../../../assets/styles/global.css'
import './FormularioGrupo.css'

// Componente que renderiza el formulario para los grupos
export default function FormularioGrupo(props) {
    const [nombreGrupo, setNombreGrupo] = useState(props.nombre || '') // Nombre del grupo
    const [materias, setMaterias] = useState(props.materias || []) // Lista de materias del grupo
    const [nuevaMateria, setNuevaMateria] = useState('') // Nombre de la nueva materia
    const [sugerencias, setSugerencias] = useState([]) // Sugerencias de materias de la BD
    const [enfocado, setEnfocado] = useState(false) // Estado del campo para agregar materias (enfocado o no enfocado)
    const {reset} = props

    useEffect(() => { // Se muestran sugerencias al escribir una nueva materia
        const fetchSugerencias = async () => {
        if (!enfocado) return setSugerencias([]) // Si el campo no está enfocado no se envían sugerencias
        const token = localStorage.getItem('token')
        try {
            // Si el campo está vacío muestra todas las sugerencias
            const query = nuevaMateria.trim() ? `?q=${encodeURIComponent(nuevaMateria)}` : ''
            const res = await fetch(`http://localhost:3000/api/materias${query}`, {
            headers: { Authorization: `Bearer ${token}` },
            })
            const data = await res.json()
            if (res.ok) setSugerencias(data.materias.map(m => m.nombre)) // Si el backend devuelve sugerencias se muestran las sugerencias
            else console.log('Error en fetch, status:', res.status)
        } catch (error){
            console.log('Error en fetch:', error)
            setSugerencias([]);
        }
    }
    fetchSugerencias()
    }, [nuevaMateria, materias, enfocado])

    useEffect(() => { // Se limpian los campos del formulario al reiniciar el componente
        if (reset) {
            setNombreGrupo('')
            setMaterias([])
            setNuevaMateria('')
        }
    }, [reset])

  // Método para agregar una materia a la lista
    const agregarMateria = () => {
        if (nuevaMateria.trim() && !materias.includes(nuevaMateria)) {
            // Si la materia no está vacía y la materia no está en la lista
            setMaterias([...materias, nuevaMateria])
            setNuevaMateria('')
        }
    }

    // Método para eliminar una materia de la lista
    const eliminarMateria = (index) => {
        setMaterias((prev) => prev.filter((_, i) => i !== index));
    }

    return (
    <div className="contenido-principal">
        <h1 className="formulario-grupo-titulo">{props.tituloFormulario}</h1>
        <div className="formulario-grupo">
            <label className="formulario-grupo-label">
                Nombre del Grupo*:
            </label>
                <input
                    className="formulario-grupo-input"
                    type="text"
                    value={nombreGrupo}
                    onChange={(e) => setNombreGrupo(e.target.value)}
                    placeholder="Escribe el nombre del grupo"
                />
            <label className="formulario-grupo-label">
                Materias*:
            </label>
                <div className="formulario-grupo-materias-lista">
                    {materias.map((materia, index) => (
                        <div key={index} className="formulario-grupo-materia-item">
                            {materia}
                            <button onClick={() => eliminarMateria(index)}>X</button>
                        </div>
                    ))}
                </div>
                <div className="formulario-grupo-agregar-materia">
                    <input
                        className="formulario-grupo-input"
                        type="text"
                        value={nuevaMateria}
                        onChange={(e) => setNuevaMateria(e.target.value)}
                        placeholder="Nueva materia"
                        onFocus={() => setEnfocado(true)}
                        onBlur={() => setTimeout(() => setEnfocado(false), 150)}
                    />
                    <button className="formulario-grupo-agregar-materia-boton" onClick={agregarMateria}>Agregar</button>
                    {enfocado && sugerencias.length > 0 && (
                        <ul className="formulario-grupo-sugerencias-materias">
                            {sugerencias.map((s, index) => (
                                <li
                                    key={index}
                                    onMouseDown={() => {
                                    setNuevaMateria(s);
                                    setEnfocado(false);
                                    }}
                                    className="formulario-grupo-sugerencia-item"
                                >
                                    {s}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            <div className="formulario-grupo-botones">
                <button className="boton-guardar" onClick={() => props.guardar(nombreGrupo, materias)}>Guardar</button>
                <button className="boton-cancelar" onClick={props.cancelar}>Cancelar</button>
            </div>
        </div>
    </div>
    )
}