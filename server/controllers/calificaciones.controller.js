const { 
    capturarCalificacion,
    listarCalificaciones
 } = require("../services/calificaciones.service")

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
const obtenerCalificaciones = async (req, res) => {
    try {
        const payload = {
            alumnoId: req.query.alumnoId,
            materiaId: req.query.materiaId,
            grupoId: req.query.grupoId
        }

        const calificaciones = await listarCalificaciones(payload)
        return res.status(200).json({calificaciones})
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: 'Error interno del servidor' })
    }
}

module.exports = {
    registrarCalificacion,
    obtenerCalificaciones
}