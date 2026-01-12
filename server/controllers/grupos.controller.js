const {
    agregarGrupo,
    modificarGrupo,
    listarGrupos,
    quitarGrupo
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

        await quitarGrupo(id)
        return res.status(200).json({ message: 'Grupo eliminado' })
    } catch (error) {
        switch(error.code){
            case 'ID_OBLIGATORIO':
                return res.status(400).json({message: error.message})

            case 'GRUPO_NO_ENCONTRADO':
                return res.status(404).json({message: error.message})

            case 'ELIMINACION_NO_PERMITIDA':
                return res.status(409).json({message: error.message})

            default:
                console.error(error)
                return res.status(500).json({message: 'Error interno del servidor'})
        }
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