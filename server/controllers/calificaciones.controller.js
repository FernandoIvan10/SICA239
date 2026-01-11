const { capturarCalificacion } = require("../services/calificaciones.service")

// Función para capturar una nueva calificación
const registrarCalificacion = async (req, res) => {
    try {
        const payload = {
            alumnoId: req.body.alumnoId,
            materiaId: req.body.materiaId,
            grupoId: req.body.grupoId,
            parcial: req.body.parcialInput,
            nota: req.body.nota
        }

        await capturarCalificacion(payload)
        return res.status(200).json({message: 'Calificaciones registradas'})
    } catch (error) {
        switch(error.code){
            case 'CAMPOS_FALTANTES':
            case 'NOTA_INVALIDA':
                return res.status(400).json({message: error.message})

            default:
                console.error(error)
                return res.status(500).json({message: 'Error interno del servidor'})
        }
    }
}

// Función para listar todas las calificaciones, con opciones de filtros
const listarCalificaciones = async (req, res) => {
    try {
        const {alumnoId, materiaId, grupoId} = req.query

        // Se aplican los filtros en caso de que existan
        const query = {}
        if (grupoId) query.grupoId = grupoId
        if (alumnoId) query.alumnoId = alumnoId
        if (materiaId) query.materiaId = materiaId

        // Realiza la consulta con los filtros aplicados
        const calificaciones = await Calificacion.find(query)
            .populate('alumnoId', 'nombre apellido') // Incluye información del alumno
            .populate('materiaId', 'nombre') // Incluye información de la materia
            .populate('grupoId', 'nombre') // Incluye información del grupo
            .exec()
            
        return res.status(200).json({
            message: 'Calificaciones obtenidas exitosamente.',
            calificaciones,
        })
    } catch (error) {
        console.error('Error al listar las calificaciones:', error)
        return res.status(500).json({ message: 'Error interno del servidor.' })
    }
}

// Función para obtener las calificaciones de un alumno con su ID
const obtenerCalificacionesPorID = async (req, res) => {
    try{
        const {id} = req.params

        const calificaciones = await Calificacion.find({alumnoId: id}).populate('materiaId')

        if(!calificaciones || calificaciones.length === 0){
            return res.status(404).json({message: "Calificaciones no encontradas."})
        } 

        // Se les da un mejor formato a los datos
        const parcialesSet = new Set()
        calificaciones.forEach(cal => {
            cal.parciales.forEach(p => parcialesSet.add(p.parcial))
        })
        const parciales = Array.from(parcialesSet)
        const resultado = calificaciones.map(cal => {
            const fila = {
                materia: cal.materiaId?.nombre
            }
            parciales.forEach(nombre => {
                fila[nombre] = ''
            })
            cal.parciales.forEach(p => {
                fila[p.parcial] = p.nota
            })
            fila.promedio = cal.promedio
            return fila
        })

        return res.status(200).json({parciales, calificaciones: resultado})
    }catch (error){
        console.error("Error al obtener las calificaciones: ", error)
        return res.status(500).json({message: "Error interno del servidor."})
    }
}

module.exports = {
    registrarCalificacion,
    listarCalificaciones,
    obtenerCalificacionesPorID
}