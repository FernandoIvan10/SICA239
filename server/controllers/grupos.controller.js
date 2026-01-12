const {
    agregarGrupo,
    modificarGrupo,
    listarGrupos
} = require("../services/grupos.service")

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
const actualizarGrupo = async (req, res) => {
    try {
        const { id } = req.params
        payload = {
            nombre: req.body.nombre,
            semestre: req.body.semestre,
            materias: req.body.materias
        }

        await modificarGrupo(id, payload)
        return res.status(200).json({message: 'Grupo actualizado',})
    } catch (error) {
        switch(error.code){
            case 'ID_OBLIGATORIO':
            case 'SIN_CAMBIOS':
                return res.status(400).json({message: error.message})

            case 'GRUPO_NO_ENCONTRADO':
                return res.status(404).json({message: error.message})

            case 'CAMBIO_MATERIAS_NO_PERMITIDO':
                return res.status(409).json({message: error.message})

            default:
                console.error(error)
                return res.status(500).json({message: 'Error interno del servidor'})
        }
    }
}

// Función para listar todos los grupos
const obtenerGrupos = async (req, res) => {
    try {
        const grupos = await listarGrupos()
        return res.status(200).json({grupos})
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: 'Error interno del servidor' })
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
    actualizarGrupo,
    obtenerGrupos,
    eliminarGrupo,
    migrarAlumnos
}