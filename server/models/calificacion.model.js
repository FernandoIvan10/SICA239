const mongoose = require('mongoose')

// Esquema de la colección de Calificaciones del semestre actual
const calificacionSchema = new mongoose.Schema({
    alumnoId: {type:mongoose.Schema.Types.ObjectId, ref:'Alumno', required:true},
    materiaId: {type:mongoose.Schema.Types.ObjectId, ref:'Materia', required:true},
    grupoId: {type:mongoose.Schema.Types.ObjectId, ref:'Grupo', required:true},
    parciales:[
        {
            parcial:{type:String, required:true},
            nota: {type:Number, required:true, min:0, max:10},
        },
    ],
    promedio: {type:Number},
}, {
    collection: 'calificaciones',
    timestamps: true,
})

// un alumno sólo puede tener una calificación por materia y grupo
calificacionSchema.index(
    { alumnoId: 1, materiaId: 1, grupoId: 1 },
    { unique: true, name: 'unique_calificacion' }
)

module.exports = mongoose.model('Calificacion',calificacionSchema)