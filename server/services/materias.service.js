const Materia = require('../models/materia.model')

// Función para buscar materias
async function buscarMaterias(data){
    const {termino} = data
    
    await Materia.find({ // Buscar materias que coincidan con el término
        nombre: { $regex: termino, $options: 'i' } 
    })
}

module.exports = {
    buscarMaterias
}