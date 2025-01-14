// imports
const mongoose = require('mongoose')

// Esquema de la colección de Materias
const materiaEsquema = new mongoose.Schema({
    nombre:{type:String, required:true},
    semestre: {type: String},
})

// Se exporta el esquema
module.exports = mongoose.model('Materia',materiaEsquema)