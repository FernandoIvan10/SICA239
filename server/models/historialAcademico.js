// imports
const mongoose = require('mongoose')

// Esquema de la colección de los historiales académicos
const historialAcademicoEsquema = new mongoose.Schema({
    alumnoId: {type:mongoose.Schema.Types.ObjectId, ref:'Alumno'},
    calificaciones:[
        {
            materiaId: {type:mongoose.Schema.Types.ObjectId, ref:'Materia'},
            nota: {type:Number},
        }
    ],
})

// Se exporta el esquema
module.exports = mongoose.model('HistorialAcademico',historialAcademicoEsquema)