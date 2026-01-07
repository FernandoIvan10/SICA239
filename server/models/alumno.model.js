const mongoose = require('mongoose')

// Esquema de la colección de Alumnos
const alumnoSchema = new mongoose.Schema({
    matricula:{type:String, unique:true, required:true, uppercase:true, trim:true},
    nombre:{type:String, required:true, trim:true},
    apellido:{type:String, required:true, trim:true},
    contrasena:{type:String, required:true, select:false},
    grupoId:{type:mongoose.Schema.Types.ObjectId, required:true, ref:'Grupo'},
    materiasRecursadas:[{
        materia: { type: mongoose.Schema.Types.ObjectId, ref: 'Materia', required: true },
        grupo: { type: mongoose.Schema.Types.ObjectId, ref: 'Grupo', required: true }
    }],
    requiereCambioContrasena:{type:Boolean, default:true},
    activo:{type:Boolean, default:true}
},
{ 
    collection: 'alumnos',
    timestamps:true
})

module.exports = mongoose.model('Alumno',alumnoSchema)