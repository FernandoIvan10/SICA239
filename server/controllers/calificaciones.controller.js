// imports
const Alumno = require('../models/alumno.model')
const Grupo = require('../models/grupo.model')
const Materia = require('../models/materia.model')
const Calificacion = require('../models/calificacion.model')

// Función para agregar una nueva calificación
const agregarCalificacion = async (req, res) => {
    try {
        const { alumnoId, materiaId, grupoId, parcial, nota } = req.body

        // Validar que todos los campos obligatorios estén presentes
        if (!alumnoId || !materiaId || !grupoId || !parcial || !nota) {
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

        const parciales = [{ parcial, nota }]
        const promedio = nota // Por ser la única calificación
        
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

// Función para modificar una calificación
const modificarCalificacion = async (req, res) => {
    try {
        const { id } = req.params
        const { parcial, nota } = req.body

        // Valida los campos obligatorios
        if ( !parcial || !nota) {
            return res.status(400).json({ mensaje: 'Faltan campos obligatorios' })
        }

        const calificacion = await Calificacion.findById(id)
        if (!calificacion) return res.status(404).json({ mensaje: 'Calificación no encontrada' })

        // Se actualiza o se crea el parcial
        const parcialExistente = calificacion.parciales.find(p => p.parcial === parcial)
        
        if(parcialExistente){
            parcialExistente.nota = nota
        } else {
            calificacion.parciales.push({ parcial, nota })
        }

        // Se calcula el promedio de las calificaciones
        const suma = calificacion.parciales.reduce((total, p) => total + p.nota, 0)
        calificacion.promedio = suma / calificacion.parciales.length

        // Se guardan los cambios
        await calificacion.save()
        return res.status(200).json(calificacion)
    } catch (error) {
        console.error('Error al modificar la calificación:', error)
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

module.exports = {agregarCalificacion, modificarCalificacion, listarCalificaciones} // Se exporta el controlador