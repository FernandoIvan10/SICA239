// imports
const mongoose = require('mongoose')

// Esquema de la colección de Alumnos
const alumnoEsquema = new mongoose.Schema({
    matricula:{type:String, unique:true, required:true},
    nombre:{type:String, required:true},
    apellido:{type:String, required:true},
    contrasena:{type:String, required:true},
    grupoId:{type:mongoose.Schema.Types.ObjectId, ref:'Grupo'},
    materiasRecursadas:[{
        materia: { type: mongoose.Schema.Types.ObjectId, ref: 'Materia', required: true },
        grupo: { type: mongoose.Schema.Types.ObjectId, ref: 'Grupo', required: true }
    }],
    fechaCreacion:{type:Date, default:Date.now},
    requiereCambioContrasena:{type:Boolean, default:true}
}, { collection: 'alumnos' })

// Se exporta el esquema
module.exports = mongoose.model('Alumno',alumnoEsquema)