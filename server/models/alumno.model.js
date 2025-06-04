// imports
const mongoose = require('mongoose')

// Esquema de la colección de Alumnos
const alumnoEsquema = new mongoose.Schema({
    matricula:{type:String, unique:true, required:true},
    nombre:{type:String, required:true},
    apellido:{type:String, required:true},
    contrasena:{type:String, required:true},
    grupoId:{type:mongoose.Schema.Types.ObjectId, ref:'Grupo'},
    fechaCreacion:{type:Date, default:Date.now},
    requiereCambioContrasena:{type:Boolean, default:true}
}, { collection: 'alumnos' })

// La contraseña por defecto es la matrícula
alumnoEsquema.pre('save',function(next){
    this.contrasena = this.matricula
    next();
})

// Se exporta el esquema
module.exports = mongoose.model('Alumno',alumnoEsquema)