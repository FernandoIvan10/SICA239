// imports
const mongoose = require('mongoose')

// Esquema de la colección de Grupos
const grupoEsquema = new mongoose.Schema({
    nombre:{type:String, unique:true, required:true},
    materias:[ // lista de materias
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Materia',
        },
    ]
})

// Se exporta el esquema
module.exports = mongoose.model('Grupo',grupoEsquema)