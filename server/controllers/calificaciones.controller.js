// imports
const Alumno = require('../models/alumno.model')
const Grupo = require('../models/grupo.model')
const Materia = require('../models/materia.model')
const Calificacion = require('../models/calificacion.model')

// Función para agregar una nueva calificación
const agregarCalificacion = async (req, res) => {
    try {
        const { alumnoId, materiaId, grupoId, parcial: parcialInput, nota } = req.body

        // Validar que todos los campos obligatorios estén presentes
        if (!alumnoId || !materiaId || !grupoId || !parcialInput || nota === undefined) {
            return res.status(400).json({ mensaje: 'Faltan campos obligatorios.' })
        }

        let calificacion = await Calificacion.findOne({
            alumnoId,
            materiaId,
            grupoId
        })

        if(!calificacion){
            calificacion = new Calificacion({
                alumnoId,
                materiaId,
                grupoId,
                parciales: [{parcial: parcialInput, nota: Number(nota)}],
                promedio: Number(nota)
            })
        }else{
            const parcialExistente = calificacion.parciales.find(p => p.parcial === parcialInput)

            if(parcialExistente){
                parcialExistente.nota = Number(nota)
            }else{
                calificacion.parciales.push({parcial: parcialInput, nota: Number(nota)})
            }

            const suma = calificacion.parciales.reduce((total, p) => total + p.nota, 0)
            calificacion.promedio = parseFloat((suma/calificacion.parciales.length)).toFixed((2))
        }

        await calificacion.save() // Guardar en la base de datos

        return res.status(200).json({calificacion})
    } catch (error) {
        console.error('Error al agregar la calificación:', error)
        return res.status(500).json({ mensaje: 'Error interno del servidor.' })
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
            mensaje: 'Calificaciones obtenidas exitosamente.',
            calificaciones,
        })
    } catch (error) {
        console.error('Error al listar las calificaciones:', error)
        return res.status(500).json({ mensaje: 'Error interno del servidor.' })
    }
}

// Función para obtener las calificaciones de un alumno con su ID
const obtenerCalificacionesPorID = async (req, res) => {
    try{
        const {id} = req.params

        const calificaciones = await Calificacion.find({alumnoId: id})

        if(!calificaciones || calificaciones.length === 0){
            return res.status(404).json({mensaje: "Calificaciones no encontradas"})
        } 

        return res.status(200).json(calificaciones)
    }catch (error){
        console.error("Error al obtener las calificaciones: ", error)
        return res.status(500).json({mensaje: "Error interno del servidor."})
    }
}

module.exports = {agregarCalificacion, listarCalificaciones, obtenerCalificacionesPorID} // Se exporta el controlador