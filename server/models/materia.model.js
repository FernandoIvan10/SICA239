const mongoose = require('mongoose')

// Esquema de la colección de Materias
const materiaSchema = new mongoose.Schema({
    nombre:{type:String, required:true, unique:true},
    semestre: {type: String, required: true},
})

module.exports = mongoose.model('Materia', materiaSchema)