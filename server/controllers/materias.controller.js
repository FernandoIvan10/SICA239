// imports
const Materia = require('../models/materia.model')

// Función para buscar materias
const buscarMaterias = async (req, res) => {
    try {
        const termino = req.query.q || ''
        const materias = await Materia.find({ // Buscar materias que coincidan con el término
            nombre: { $regex: termino, $options: 'i' } 
        })
        res.status(200).json({ materias })
    } catch (error) {
        console.error('Error al buscar materias:', error)
        res.status(500).json({ mensaje: 'Error interno del servidor' })
    }
}

module.exports = { buscarMaterias } // Se exporta el controlador