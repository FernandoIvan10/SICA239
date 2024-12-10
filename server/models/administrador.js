// imports
const mongoose = require('mongoose')

// Esquema de la colección de Administradores
const administradorEsquema = new mongoose.Schema({
    rfc:{type:String, unique:true, required:true},
    nombre:{type:String},
    apellido:{type:String},
    contraseña:{type:String, required:true},
    rol:{type:String, enum:['superadmin','editor','lector'], required:true},
    fechaCreacion:{type:Date, default:Date.now},
})

// La contraseña por defecto es el rfc
administradorEsquema.pre('save',function(next){
    this.contraseña = this.rfc
    next()
})

// Se exporta el esquema
module.exports = mongoose.model('Administrador',administradorEsquema)