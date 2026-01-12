const { buscarMaterias } = require("../services/materias.service")

// Función para buscar materias
const obtenerMaterias = async (req, res) => {
    try {
        const payload = {
            termino: req.query.q,
        }

        const materias = await buscarMaterias(payload)
        res.status(200).json({ materias })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Error interno del servidor' })
    }
}

module.exports = { obtenerMaterias }