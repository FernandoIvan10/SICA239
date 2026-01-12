const { agregarGrupo } = require("../services/grupos.service")

// Función para agregar un nuevo grupo
const crearGrupo = async (req, res) => {
    try {
        const payload = {
            nombre: req.body.nombre,
            semestre: req.body.semestre,
            materias: req.body.materias
        }
        
        await agregarGrupo(payload)
        return res.status(201).json({ message: 'Grupo creado'})
    } catch (error) {
        switch (error.code) {
            case 'CAMPOS_FALTANTES':
            case 'FORMATO_INVALIDO_MATERIAS':
                return res.status(400).json({ message: error.message })

            case 'NOMBRE_DUPLICADO':
                return res.status(409).json({ message: error.message })

            default:
                console.error(error)
                return res.status(500).json({ message: 'Error interno del servidor' })
        }
    }
}

// Función para modificar un grupo
const modificarGrupo = async (req, res) => {
    try {
        const { id } = req.params
        const { nombre, semestre, materias } = req.body

        // Valida que el ID sea proporcionado
        if (!id) {
            return res.status(400).json({ message: 'El ID del grupo es obligatorio.' })
        }        

        // Valida que el grupo exista
        const grupoExistente = await Grupo.findById(id)
        if (!grupoExistente) {
            return res.status(404).json({ message: 'Grupo no encontrado.' })
        }

        const actualizaciones = {}

        // Actualiza los campos proporcionados
        if (nombre) actualizaciones.nombre = nombre
        if (semestre) actualizaciones.semestre = semestre
        if (materias && materias.length > 0) {
            const calificacionesExistentes = await Calificacion.findOne({grupoId: id})
            if(calificacionesExistentes){ // No se pueden modificar materias si hay calificaciones capturadas
                return res.status(400).json({ message: 'No se pueden modificar las materias porque el grupo tiene calificaciones registradas.' })
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
            message: 'Grupo actualizado exitosamente.',
            grupo: grupoActualizado,
        })
    } catch (error) {
        console.error('Error al modificar el grupo:', error)
        return res.status(500).json({ message: 'Error interno del servidor.' })
    }
}

// Función para listar todos los grupos
const listarGrupos = async (req, res) => {
    try {
        // Consulta los grupos con sus datos
        const grupos = await Grupo.find().populate('materias', 'nombre').exec()

        // Retorna la lista de grupos
        return res.status(200).json({
            message: 'Grupos obtenidos exitosamente.',
            grupos,
        })
    } catch (error) {
        console.error('Error al listar los grupos:', error)
        return res.status(500).json({ message: 'Error interno del servidor.' })
    }
}

// Función para eliminar un grupo
const eliminarGrupo = async (req, res) => {
    try {
        const { id } = req.params

        if (!id) { // Valida que hayan enviado el id del grupo
            return res.status(400).json({ message: 'El ID del grupo es obligatorio.' })
        }

        // Verifica que el grupo exista
        const grupoExistente = await Grupo.findById(id);
        if (!grupoExistente) {
            return res.status(404).json({ message: 'Grupo no encontrado.' })
        }

        // No se puede eliminar el grupo si hay calificaciones capturadas
        const calificacionesExistentes = await Calificacion.findOne({ grupoId: id })
        if (calificacionesExistentes) {
            return res.status(400).json({ message: 'No se puede eliminar el grupo porque tiene calificaciones registradas.' })
        }

        // No se puede eliminar el grupo si hay alumnos registrados en él
        const alumnosExistentes = await Alumno.findOne({ grupoId: id })
        const alumnosRecursando = await Alumno.findOne({'materiasRecursadas.grupo': id})
        if (alumnosExistentes || alumnosRecursando) {
            return res.status(400).json({ message: 'No se puede eliminar el grupo porque tiene alumnos registrados.' })
        }

        const horario = await Horario.findOne({ grupo: id })
        if (horario) { // Si el grupo tiene un horario asignado este se elimina
            await cloudinary.uploader.destroy(horario.publicId) // Elimina la imagen de Cloudinary
            await Horario.findByIdAndDelete(horario._id) // Elimina el documento de la base de datos
        }

        // Elimina el grupo
        await Grupo.findByIdAndDelete(id)

        return res.status(200).json({ message: 'Grupo eliminado exitosamente.' })
    } catch (error) {
        console.error('Error al eliminar el grupo:', error)
        return res.status(500).json({ message: 'Error interno del servidor.' })
    }
}

// Función para migrar alumnos de un grupo a otro
const migrarAlumnos = async (req, res) => {
    const grupoOrigen = req.params.id
    const { grupoDestino, alumnos } = req.body

    // Valida que se hayan enviado todos los parámetros
    if (!grupoOrigen || !grupoDestino || !Array.isArray(alumnos) || alumnos.length === 0) { 
        return res.status(400).json({ message: 'Faltan datos obligatorios.' })
    }

    try {
        // Verificar que los grupos existan
        const origenExiste = await Grupo.findById(grupoOrigen)
        const destinoExiste = await Grupo.findById(grupoDestino)

        if (!origenExiste || !destinoExiste) {
            return res.status(404).json({ message: 'Uno o ambos grupos especificados no existen.' })
        }

        // Actualizar grupo de cada alumno
        const resultados = await Alumno.updateMany(
            { _id: { $in: alumnos } },
            { $set: { grupoId: grupoDestino, materiasRecursadas: [] } },
        )

        return res.status(200).json({
            message: `Migración completada. ${resultados.modifiedCount} alumno(s) actualizados.`,
        })

    } catch (error) {
        console.error('Error al migrar alumnos:', error)
        return res.status(500).json({ message: 'Error interno al migrar alumnos.' })
    }
}

module.exports = {
    crearGrupo,
    modificarGrupo,
    listarGrupos,
    eliminarGrupo,
    migrarAlumnos
}