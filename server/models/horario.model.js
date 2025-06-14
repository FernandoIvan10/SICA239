const mongoose = require('mongoose')

const HorarioSchema = new mongoose.Schema({
  grupo: { type: mongoose.Schema.Types.ObjectId, ref: 'Grupo', required: true },
  imagenUrl: String,
  publicId: String
}, { collection: 'horarios' })

module.exports = mongoose.model('Horario', HorarioSchema)