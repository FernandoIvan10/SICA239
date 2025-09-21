// imports
const Grupo = require('../models/grupo.model')
const Materia = require('../models/materia.model')
const Calificacion = require('../models/calificacion.model')
const Horario = require('../models/horario.model')
const Alumno = require('../models/alumno.model')
const cloudinary = require('../config/cloudinary')

// Función para agregar un nuevo grupo
const agregarGrupo = async (req, res) => {
    try {
        const { nombre, semestre, materias } = req.body

        // Valida que el campo nombre no esté vacío
        if (!nombre) {
            return res.status(400).json({ mensaje: 'El nombre del grupo es obligatorio.' })
        }

        // Valida que el campo semestre no esté vacío
        if (!semestre) {
            return res.status(400).json({ mensaje: 'El semestre del grupo es obligatorio.' })
        }

        // Valida que el grupo no exista
        const existeGrupo = await Grupo.findOne({nombre})
        if(existeGrupo){
            return res.status(400).json({mensaje:"El nombre de grupo ingresado ya se encuentra registrado en el sistema."})
        }

        // Verifica que las materias estén definidas en un arreglo
        if (!materias || !Array.isArray(materias) || materias.length === 0) {
            return res.status(400).json({ mensaje: 'Debe proporcionar al menos una materia.' })
        }

        let materiasIds = []

        for (const materia of materias) {
            const materiaNombre = materia.nombre
            if (!materiaNombre) { // Valida que el nombre de la materia no esté vacío
                return res.status(400).json({ mensaje: 'El nombre de cada materia es obligatorio.' })
            }

            // Valida que la materia no exista
            let materiaExistente = await Materia.findOne({ nombre: materiaNombre })

            if (!materiaExistente) {
                // Si no existe, crea una nueva materia
                const nuevaMateria = new Materia({
                    nombre: materiaNombre,
                    semestre: semestre,
                })
                await nuevaMateria.save()
                materiaExistente = nuevaMateria
            }
            // Se agrega el ID de la materia a la lista
            materiasIds.push(materiaExistente._id)
        }

        // Crear el grupo
        const nuevoGrupo = new Grupo({
            nombre,
            semestre,
            materias: materiasIds,
        })

        await nuevoGrupo.save() // Guarda el grupo
        return res.status(201).json({ mensaje: 'Grupo creado exitosamente.'})
    } catch (error) {
        console.error('Error al agregar el grupo:', error)
        return res.status(500).json({ mensaje: 'Error interno del servidor.' })
    }
}

// Función para modificar un grupo
const modificarGrupo = async (req, res) => {
    try {
        const { id } = req.params
        const { nombre, semestre, materias } = req.body

        // Valida que el ID sea proporcionado
        if (!id) {
            return res.status(400).json({ mensaje: 'El ID del grupo es obligatorio.' })
        }        

        // Valida que el grupo exista
        const grupoExistente = await Grupo.findById(id)
        if (!grupoExistente) {
            return res.status(404).json({ mensaje: 'Grupo no encontrado.' })
        }

        const actualizaciones = {}

        // Actualiza los campos proporcionados
        if (nombre) actualizaciones.nombre = nombre
        if (semestre) actualizaciones.semestre = semestre
        if (materias && materias.length > 0) {
            const calificacionesExistentes = await Calificacion.findOne({grupoId: id})
            if(calificacionesExistentes){ // No se pueden modificar materias si hay calificaciones capturadas
                return res.status(400).json({ mensaje: 'No se pueden modificar las materias porque el grupo tiene calificaciones registradas.' })
            }

            let materiasIds = []

            for (const materiaNombre of materias) {
                // Se busca si la materia existe
                let materiaExistente = await Materia.findOne({ nombre: materiaNombre })
                // Si la materia no existe, entonces se crea
                if (!materiaExistente) {
                    const nuevaMateria = new Materia({ nombre: materiaNombre })
                    await nuevaMateria.save()
                    materiaExistente = nuevaMateria
                }
                materiasIds.push(materiaExistente._id)
            }
            actualizaciones.materias = materiasIds
        }

        // Actualizar el grupo en la base de datos
        const grupoActualizado = await Grupo.findByIdAndUpdate(id, actualizaciones, { new: true })

        return res.status(200).json({
            mensaje: 'Grupo actualizado exitosamente.',
            grupo: grupoActualizado,
        })
    } catch (error) {
        console.error('Error al modificar el grupo:', error)
        return res.status(500).json({ mensaje: 'Error interno del servidor.' })
    }
}

// Función para listar todos los grupos
const listarGrupos = async (req, res) => {
    try {
        // Consulta los grupos con sus datos
        const grupos = await Grupo.find().populate('materias', 'nombre').exec()

        // Retorna la lista de grupos
        return res.status(200).json({
            mensaje: 'Grupos obtenidos exitosamente.',
            grupos,
        })
    } catch (error) {
        console.error('Error al listar los grupos:', error)
        return res.status(500).json({ mensaje: 'Error interno del servidor.' })
    }
}

// Función para eliminar un grupo
const eliminarGrupo = async (req, res) => {
    try {
        const { id } = req.params

        if (!id) { // Valida que hayan enviado el id del grupo
            return res.status(400).json({ mensaje: 'El ID del grupo es obligatorio.' })
        }

        // Verifica que el grupo exista
        const grupoExistente = await Grupo.findById(id);
        if (!grupoExistente) {
            return res.status(404).json({ mensaje: 'Grupo no encontrado.' })
        }

        // No se puede eliminar el grupo si hay calificaciones capturadas
        const calificacionesExistentes = await Calificacion.findOne({ grupoId: id })
        if (calificacionesExistentes) {
            return res.status(400).json({ mensaje: 'No se puede eliminar el grupo porque tiene calificaciones registradas.' })
        }

        const horario = await Horario.findOne({ grupo: id })
        if (horario) { // Si el grupo tiene un horario asignado este se elimina
            await cloudinary.uploader.destroy(horario.publicId) // Elimina la imagen de Cloudinary
            await Horario.findByIdAndDelete(horario._id) // Elimina el documento de la base de datos
        }

        // Elimina el grupo
        await Grupo.findByIdAndDelete(id)

        return res.status(200).json({ mensaje: 'Grupo eliminado exitosamente.' })
    } catch (error) {
        console.error('Error al eliminar el grupo:', error)
        return res.status(500).json({ mensaje: 'Error interno del servidor.' })
    }
}

// Función para migrar alumnos de un grupo a otro
const migrarAlumnos = async (req, res) => {
    const { grupoOrigen, grupoDestino, alumnos } = req.body

    // Valida que se hayan enviado todos los parámetros
    if (!grupoOrigen || !grupoDestino || !Array.isArray(alumnos) || alumnos.length === 0) { 
        return res.status(400).json({ mensaje: 'Faltan datos obligatorios.' })
    }

    try {
        // Verificar que los grupos existan
        const origenExiste = await Grupo.findById(grupoOrigen)
        const destinoExiste = await Grupo.findById(grupoDestino)

        if (!origenExiste || !destinoExiste) {
            return res.status(404).json({ mensaje: 'Uno o ambos grupos especificados no existen.' })
        }

        // Actualizar grupo de cada alumno
        const resultados = await Alumno.updateMany(
            { _id: { $in: alumnos } },
            { $set: { grupoId: grupoDestino, materiasRecursadas: [] } },
        )

        return res.status(200).json({
            mensaje: `Migración completada. ${resultados.modifiedCount} alumno(s) actualizados.`,
        })

    } catch (error) {
        console.error('Error al migrar alumnos:', error)
        return res.status(500).json({ mensaje: 'Error interno al migrar alumnos.' })
    }
}

module.exports = {agregarGrupo, modificarGrupo, listarGrupos, eliminarGrupo, migrarAlumnos} // Se exporta el controlador