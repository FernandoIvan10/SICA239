const mongoose = require('mongoose')

// Esquema de la colección de Administradores
const administradorSchema = new mongoose.Schema({
    rfc:{type:String, unique:true, required:true, uppercase:true, trim:true},
    nombre:{type:String, required:true, trim:true},
    apellido:{type:String, required:true, trim:true},
    contrasena:{type:String, required:true, select:false},
    rol:{type:String, enum:['superadmin','editor','lector'], required:true},
    requiereCambioContrasena:{type:Boolean, default:true}
}, 
{  
    collection: 'administradores',
    timestamps:true
})

module.exports = mongoose.model('Administrador',administradorSchema)