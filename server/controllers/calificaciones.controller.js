// imports
const Alumno = require('../models/alumno.model')
const Grupo = require('../models/grupo.model')
const Materia = require('../models/materia.model')
const Calificacion = require('../models/calificacion.model')

// Controlador para agregar una nueva calificación
const agregarCalificacion = async (req, res) => {
    try {
        const { alumnoId, materiaId, grupoId, parciales } = req.body

        // Validar que todos los campos obligatorios estén presentes
        if (!alumnoId || !materiaId || !grupoId || !parciales || parciales.length === 0) {
            return res.status(400).json({ mensaje: 'Faltan campos obligatorios.' })
        }

        // Validar que el alumno exista
        const alumnoExistente = await Alumno.findById(alumnoId)
        if (!alumnoExistente) {
            return res.status(400).json({ mensaje: 'El alumno especificado no existe.' })
        }

        // Validar que la materia exista
        const materiaExistente = await Materia.findById(materiaId)
        if (!materiaExistente) {
            return res.status(400).json({ mensaje: 'La materia especificada no existe.' })
        }

        // Validar que el grupo exista
        const grupoExistente = await Grupo.findById(grupoId)
        if (!grupoExistente) {
            return res.status(400).json({ mensaje: 'El grupo especificado no existe.' })
        }

        // Validar que las notas sean válidas
        for (const parcial of parciales) {
            if (!parcial.parcial || typeof parcial.nota !== 'number' || parcial.nota < 0 || parcial.nota > 10) {
                return res.status(400).json({
                    mensaje: 'Cada parcial debe tener un nombre y una nota válida entre 0 y 10.',
                })
            }
        }

        // Calcular el promedio de las calificaciones
        const sumaNotas = parciales.reduce((acum, parcial) => acum + parcial.nota, 0)
        const promedio = sumaNotas / parciales.length

        // Crear la nueva calificación
        const nuevaCalificacion = new Calificacion({
            alumnoId,
            materiaId,
            grupoId,
            parciales,
            promedio,
        })

        await nuevaCalificacion.save() // Guardar en la base de datos

        return res.status(201).json({
            mensaje: 'Calificación agregada exitosamente.',
            calificacion: nuevaCalificacion,
        })
    } catch (error) {
        console.error('Error al agregar la calificación:', error)
        return res.status(500).json({ mensaje: 'Error interno del servidor.' })
    }
}

// Controlador para modificar una calificación
const modificarCalificacion = async (req, res) => {
    try {
        const { id } = req.params
        const { alumnoId, materiaId, grupoId, parciales } = req.body

        // Valida los campos obligatorios
        if (!alumnoId || !materiaId || !grupoId || !parciales || parciales.length === 0) {
            return res.status(400).json({ mensaje: 'Faltan campos obligatorios' })
        }

        // Se valida que el alumno exista
        const alumnoExistente = await Alumno.findById(alumnoId)
        if (!alumnoExistente) {
            return res.status(400).json({ mensaje: 'El alumno especificado no existe' })
        }

        // Se valida que la materia exista
        const materiaExistente = await Materia.findById(materiaId)
        if (!materiaExistente) {
            return res.status(400).json({ mensaje: 'La materia especificada no existe' })
        }

        // Se valida que el grupo exista
        const grupoExistente = await Grupo.findById(grupoId)
        if (!grupoExistente) {
            return res.status(400).json({ mensaje: 'El grupo especificado no existe.' })
        }

        // Valida que las notas sean válidas
        for (const parcial of parciales) {
            if (!parcial.parcial || typeof parcial.nota !== 'number' || parcial.nota < 0 || parcial.nota > 10) {
                return res.status(400).json({
                    mensaje: 'Cada parcial debe tener un nombre y una nota válida entre 0 y 10.',
                })
            }
        }

        // Valida que la calificación exista
        const calificacionExistente = await Calificacion.findById(id)
        if (!calificacionExistente) {
            return res.status(404).json({ mensaje: 'La calificación especificada no existe.' })
        }

        // Se calcula el promedio de las calificaciones
        const sumaNotas = parciales.reduce((acum, parcial) => acum + parcial.nota, 0)
        const promedio = sumaNotas / parciales.length

        // Se actualiza la calificación con los nuevos datos
        calificacionExistente.alumnoId = alumnoId
        calificacionExistente.materiaId = materiaId
        calificacionExistente.grupoId = grupoId
        calificacionExistente.parciales = parciales
        calificacionExistente.promedio = promedio

        // Se guardan los cambios
        await calificacionExistente.save()

        return res.status(200).json({
            mensaje: 'Calificación modificada exitosamente.',
            calificacion: calificacionExistente,
        })
    } catch (error) {
        console.error('Error al modificar la calificación:', error)
        return res.status(500).json({ mensaje: 'Error interno del servidor.' })
    }
}

module.exports = {agregarCalificacion, modificarCalificacion} // Se exporta el controlador