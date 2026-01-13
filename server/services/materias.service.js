const Materia = require('../models/materia.model')

// Función para buscar materias
async function buscarMaterias(data){
    const termino = typeof data?.termino === 'string'
        ? data.termino.trim()
        : ''

    const query = {}

    if (termino !== '') { // Aplica la búsqueda por término
        query.nombre = { $regex: termino, $options: 'i' }
    }

    return await Materia.find(query)
}

module.exports = {
    buscarMaterias
}