const mongoose = require('mongoose')

// Esquema de la colección del historial académico
const historialAcademicoSchema = new mongoose.Schema({
    alumnoId: {type:mongoose.Schema.Types.ObjectId, ref:'Alumno', required:true},
    calificaciones:[
        {
            materiaId: {type:mongoose.Schema.Types.ObjectId, ref:'Materia', required:true},
            nota: {type:Number, required:true, min:0, max:10},
            semestre: {type:String, required:true},
        }
    ],
}, { 
    collection: 'historialacademico',
    timestamps: true 
})

module.exports = mongoose.model('HistorialAcademico',historialAcademicoSchema)