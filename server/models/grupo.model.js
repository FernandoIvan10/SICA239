const mongoose = require('mongoose')

// Esquema de la colección de Grupos
const grupoSchema = new mongoose.Schema({
    nombre:{type:String, unique:true, required:true, trim:true},
    semestre:{type:String, required:true},
    materias:[ // lista de materias
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Materia',
        },
    ]
}, {
    collection: 'grupos',
    timestamps:true,
})

module.exports = mongoose.model('Grupo',grupoSchema)