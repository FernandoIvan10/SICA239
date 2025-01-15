// imports
const Grupo = require('../models/grupo.model')
const Materia = require('../models/materia.model')

// Función para agregar un nuevo grupo
const agregarGrupo = async (req, res) => {
    try {
        const { nombre, materias } = req.body

        // Valida que el campo nombre no esté vacío
        if (!nombre) {
            return res.status(400).json({ mensaje: 'El nombre del grupo es obligatorio.' })
        }

        // Verifica que las materias estén definidas en un arreglo
        if (!materias || !Array.isArray(materias) || materias.length === 0) {
            return res.status(400).json({ mensaje: 'Debe proporcionar al menos una materia.' })
        }

        let materiasIds = []

        // Recorre la lista de materias
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
            materias: materiasIds,
        })

        await nuevoGrupo.save() // Guarda el grupo
        return res.status(201).json({ message: 'Grupo creado exitosamente con materias.', grupo: nuevoGrupo })
    } catch (error) {
        console.error('Error al agregar el grupo con materias:', error)
        return res.status(500).json({ menssage: 'Error interno del servidor.' })
    }
}

// Función para modificar un grupo
const modificarGrupo = async (req, res) => {
    try {
        const { id } = req.params

        const { nombre, materias } = req.body

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
        if (materias && materias.length > 0) {
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

module.exports = {agregarGrupo, modificarGrupo, listarGrupos} // Se exporta el controlador