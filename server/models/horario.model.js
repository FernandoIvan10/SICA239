const mongoose = require('mongoose')

// Esquema de la colección de los horarios
const HorarioSchema = new mongoose.Schema({
  grupo: { type: mongoose.Schema.Types.ObjectId, ref: 'Grupo', required: true },
  imagenUrl: { type: String, required: true },
  publicId: { type: String, required: true }
}, { 
  collection: 'horarios',
  timestamps: true
})

module.exports = mongoose.model('Horario', HorarioSchema)