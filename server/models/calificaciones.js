// exports
const mongoose = require('mongoose')

// Esquema de la colección de Calificaciones del semestre actual
const calificacionesEsquema = new mongoose.Schema({
    alumnoId: {type:mongoose.Schema.Types.ObjectId, ref:'Alumno'},
    materiaId: {type:mongoose.Schema.Types.ObjectId, ref:'Materia'},
    grupoId: {type:mongoose.Schema.Types.ObjectId, ref:'Grupo'},
    parciales:[
        {
            parcial:{type:String, required:true},
            nota: {type:Number, required:true},
        },
    ],
    promedio: {type:Number},
})

// Se exporta el esquema
module.exports = mongoose.model('Calificaciones',calificacionesEsquema)